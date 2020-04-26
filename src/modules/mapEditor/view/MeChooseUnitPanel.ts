
namespace TinyWars.MapEditor {
    import Notify   = Utility.Notify;
    import Lang     = Utility.Lang;

    const MAX_RECENT_COUNT = 10;

    export class MeChooseUnitPanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Hud0;
        protected readonly _IS_EXCLUSIVE = false;

        private static _instance: MeChooseUnitPanel;

        private _labelRecentTitle   : GameUi.UiLabel;
        private _listRecent         : GameUi.UiScrollList;
        private _listCategory       : GameUi.UiScrollList;
        private _btnCancel          : GameUi.UiButton;

        private _dataListForRecent   : DataForUnitRenderer[] = [];

        public static show(): void {
            if (!MeChooseUnitPanel._instance) {
                MeChooseUnitPanel._instance = new MeChooseUnitPanel();
            }
            MeChooseUnitPanel._instance.open();
        }
        public static hide(): void {
            if (MeChooseUnitPanel._instance) {
                MeChooseUnitPanel._instance.close();
            }
        }

        public constructor() {
            super();

            this._setAutoAdjustHeightEnabled();
            this._setTouchMaskEnabled();
            this._callbackForTouchMask = () => this.close();
            this.skinName = "resource/skins/mapEditor/MeChooseUnitPanel.exml";
        }

        protected _onFirstOpened(): void {
            this._notifyListeners = [
                { type: Notify.Type.LanguageChanged,    callback: this._onNotifyLanguageChanged },
                { type: Notify.Type.UnitAnimationTick,  callback: this._onNotifyUnitAnimationTick },
            ];
            this._uiListeners = [
                { ui: this._btnCancel,  callback: this.close },
            ];
            this._listRecent.setItemRenderer(UnitRenderer);
            this._listCategory.setItemRenderer(CategoryRenderer);
        }

        protected _onOpened(): void {
            this._updateComponentsForLanguage();

            this._updateListCategory();
            this._updateListRecent();
        }

        protected _onClosed(): void {
            this._listCategory.clear();
            this._listRecent.clear();
        }

        public updateOnChooseUnit(unitViewId: number): void {
            const dataList      = this._dataListForRecent;
            const filteredList  = dataList.filter(v => v.unitViewId !== unitViewId);
            dataList.length     = 0;
            dataList[0]         = {
                unitViewId,
                panel   : this,
            };
            for (const v of filteredList) {
                if (dataList.length < MAX_RECENT_COUNT) {
                    dataList.push(v);
                } else {
                    break;
                }
            }
            this._updateListRecent();
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Callbacks.
        ////////////////////////////////////////////////////////////////////////////////
        private _onNotifyLanguageChanged(e: egret.Event): void {
            this._updateComponentsForLanguage();
        }

        private _onNotifyUnitAnimationTick(e: egret.Event): void {
            const viewListForCategory = this._listCategory.getViewList();
            for (let i = 0; i < viewListForCategory.numChildren; ++i) {
                const child = viewListForCategory.getChildAt(i);
                (child instanceof CategoryRenderer) && (child.updateOnUnitAnimationTick());
            }
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Private functions.
        ////////////////////////////////////////////////////////////////////////////////
        private _updateComponentsForLanguage(): void {
            this._btnCancel.label       = Lang.getText(Lang.Type.B0154);
            this._labelRecentTitle.text = `${Lang.getText(Lang.Type.B0372)}:`
        }

        private _createDataForListUnit(): DataForCategoryRenderer[] {
            const mapping = new Map<number, number[]>();
            ConfigManager.forEachUnitTypeAndPlayerIndex((value, unitViewId) => {
                const playerIndex = value.playerIndex;
                if (unitViewId !== 0) {
                    if (mapping.has(playerIndex)) {
                        mapping.get(playerIndex).push(unitViewId);
                    } else {
                        mapping.set(playerIndex, [unitViewId]);
                    }
                }
            });
            const dataList: DataForCategoryRenderer[] = [];
            for (const [, unitViewIdList] of mapping) {
                dataList.push({
                    unitViewIdList,
                    panel   : this,
                });
            }

            return dataList;
        }

        private _updateListCategory(): void {
            const dataList = this._createDataForListUnit();
            this._listCategory.bindData(dataList);
            this._listCategory.scrollVerticalTo(0);
        }

        private _updateListRecent(): void {
            this._listRecent.bindData(this._dataListForRecent);
            this._listRecent.scrollHorizontalTo(0);
        }
    }

    type DataForCategoryRenderer = {
        unitViewIdList  : number[];
        panel           : MeChooseUnitPanel;
    }

    class CategoryRenderer extends eui.ItemRenderer {
        private _listUnit: GameUi.UiScrollList;

        protected childrenCreated(): void {
            super.childrenCreated();

            this._listUnit.setItemRenderer(UnitRenderer);
            this._listUnit.scrollPolicyH = eui.ScrollPolicy.OFF;
        }

        protected dataChanged(): void {
            super.dataChanged();

            const data              = this.data as DataForCategoryRenderer;
            const unitViewIdList    = data.unitViewIdList;
            const dataListForUnit   : DataForUnitRenderer[] = [];
            const panel             = data.panel;
            for (const unitViewId of unitViewIdList) {
                dataListForUnit.push({
                    panel,
                    unitViewId,
                });
            }
            this._listUnit.bindData(dataListForUnit);
        }

        public updateOnUnitAnimationTick(): void {
            const viewList = this._listUnit.getViewList();
            for (let i = 0; i < viewList.numChildren; ++i) {
                const child = viewList.getChildAt(i);
                (child instanceof UnitRenderer) && (child.updateOnUnitAnimationTick());
            }
        }
    }

    type DataForUnitRenderer = {
        unitViewId  : number;
        panel       : MeChooseUnitPanel;
    }

    class UnitRenderer extends eui.ItemRenderer {
        private _group          : eui.Group;
        private _labelName      : GameUi.UiLabel;
        private _conUnitView    : eui.Group;

        private _unitView   = new MeUnitView();

        protected childrenCreated(): void {
            super.childrenCreated();

            this._conUnitView.addChild(this._unitView);
        }

        public updateOnUnitAnimationTick(): void {
            const unitView = this._unitView;
            unitView.tickStateAnimationFrame();
            unitView.tickUnitAnimationFrame();
        }

        protected dataChanged(): void {
            const data              = this.data as DataForUnitRenderer;
            this._labelName.text    = Lang.getUnitName(ConfigManager.getUnitTypeAndPlayerIndex(data.unitViewId).unitType);
            this._unitView.init(new MeUnit().init({
                gridX   : 0,
                gridY   : 0,
                viewId  : data.unitViewId,
                unitId  : 0,
            }, MeManager.getWar().getConfigVersion()));
            this._unitView.startRunningView();
        }

        public onItemTapEvent(): void {
            const data          = this.data as DataForUnitRenderer;
            const panel         = data.panel;
            const unitViewId    = data.unitViewId;
            panel.updateOnChooseUnit(unitViewId);
            panel.close();
            MeManager.getWar().getDrawer().setModeDrawUnit(unitViewId);
        }
    }
}
