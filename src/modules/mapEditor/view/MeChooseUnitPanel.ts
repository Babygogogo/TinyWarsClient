
namespace TinyWars.MapEditor {
    import Notify           = Utility.Notify;
    import Lang             = Utility.Lang;
    import ConfigManager    = Utility.ConfigManager;
    import Types            = Utility.Types;
    import CommonConstants  = Utility.CommonConstants;

    const MAX_RECENT_COUNT = 10;

    export class MeChooseUnitPanel extends GameUi.UiPanel<void> {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Hud0;
        protected readonly _IS_EXCLUSIVE = false;

        private static _instance: MeChooseUnitPanel;

        private _labelRecentTitle   : GameUi.UiLabel;
        private _listRecent         : GameUi.UiScrollList<DataForUnitRenderer, UnitRenderer>;
        private _listCategory       : GameUi.UiScrollList<DataForCategoryRenderer, CategoryRenderer>;
        private _btnCancel          : GameUi.UiButton;

        private _dataListForRecent   : DataForUnitRenderer[] = [];

        public static show(): void {
            if (!MeChooseUnitPanel._instance) {
                MeChooseUnitPanel._instance = new MeChooseUnitPanel();
            }
            MeChooseUnitPanel._instance.open(undefined);
        }
        public static async hide(): Promise<void> {
            if (MeChooseUnitPanel._instance) {
                await MeChooseUnitPanel._instance.close();
            }
        }

        public constructor() {
            super();

            this._setIsTouchMaskEnabled();
            this._setIsCloseOnTouchedMask();
            this.skinName = "resource/skins/mapEditor/MeChooseUnitPanel.exml";
        }

        protected _onOpened(): void {
            this._setNotifyListenerArray([
                { type: Notify.Type.LanguageChanged,    callback: this._onNotifyLanguageChanged },
            ]);
            this._setUiListenerArray([
                { ui: this._btnCancel,  callback: this.close },
            ]);
            this._listRecent.setItemRenderer(UnitRenderer);
            this._listCategory.setItemRenderer(CategoryRenderer);

            this._updateComponentsForLanguage();

            this._updateListCategory();
            this._updateListRecent();
        }

        protected async _onClosed(): Promise<void> {
            this._listCategory.clear();
            this._listRecent.clear();
        }

        public updateOnChooseUnit(data: DataForDrawUnit): void {
            const dataList      = this._dataListForRecent;
            const filteredList  = dataList.filter(v => {
                const oldData = v.dataForDrawUnit;
                return (oldData.playerIndex != data.playerIndex)
                    || (oldData.unitType != data.unitType);
            });
            dataList.length     = 0;
            dataList[0]         = {
                dataForDrawUnit: data,
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

        ////////////////////////////////////////////////////////////////////////////////
        // Private functions.
        ////////////////////////////////////////////////////////////////////////////////
        private _updateComponentsForLanguage(): void {
            this._btnCancel.label       = Lang.getText(Lang.Type.B0154);
            this._labelRecentTitle.text = `${Lang.getText(Lang.Type.B0372)}:`
        }

        private _createDataForListUnit(): DataForCategoryRenderer[] {
            const mapping = new Map<number, DataForDrawUnit[]>();
            for (const unitType of ConfigManager.getUnitTypesByCategory(ConfigManager.getLatestFormalVersion(), Types.UnitCategory.All)) {
                for (let playerIndex = CommonConstants.WarFirstPlayerIndex; playerIndex <= CommonConstants.WarMaxPlayerIndex; ++playerIndex) {
                    if (!mapping.has(playerIndex)) {
                        mapping.set(playerIndex, []);
                    }

                    mapping.get(playerIndex).push({
                        playerIndex,
                        unitType,
                    });
                }
            }

            const dataList: DataForCategoryRenderer[] = [];
            for (const [, dataListForDrawUnit] of mapping) {
                dataList.push({
                    dataListForDrawUnit,
                    panel               : this,
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
        dataListForDrawUnit : DataForDrawUnit[];
        panel               : MeChooseUnitPanel;
    }

    class CategoryRenderer extends GameUi.UiListItemRenderer<DataForCategoryRenderer> {
        private _listUnit: GameUi.UiScrollList<DataForUnitRenderer, UnitRenderer>;

        protected _onOpened(): void {
            this._listUnit.setItemRenderer(UnitRenderer);
            this._listUnit.setScrollPolicyH(eui.ScrollPolicy.OFF);
        }

        protected dataChanged(): void {
            super.dataChanged();

            const data              = this.data;
            const unitViewIdList    = data.dataListForDrawUnit;
            const dataListForUnit   : DataForUnitRenderer[] = [];
            const panel             = data.panel;
            for (const unitViewId of unitViewIdList) {
                dataListForUnit.push({
                    panel,
                    dataForDrawUnit: unitViewId,
                });
            }
            this._listUnit.bindData(dataListForUnit);
        }
    }

    type DataForUnitRenderer = {
        dataForDrawUnit : DataForDrawUnit;
        panel           : MeChooseUnitPanel;
    }

    class UnitRenderer extends GameUi.UiListItemRenderer<DataForUnitRenderer> {
        private _group          : eui.Group;
        private _labelName      : GameUi.UiLabel;
        private _conUnitView    : eui.Group;

        private _unitView   = new BaseWar.BwUnitView();

        protected _onOpened(): void {
            this._setNotifyListenerArray([
                { type: Notify.Type.UnitAnimationTick,  callback: this._onNotifyUnitAnimationTick },
            ]);

            this._conUnitView.addChild(this._unitView);
        }

        private _onNotifyUnitAnimationTick(): void {
            const unitView = this._unitView;
            unitView.tickStateAnimationFrame();
            unitView.tickUnitAnimationFrame();
        }

        protected dataChanged(): void {
            const data              = this.data;
            const dataForDrawUnit   = data.dataForDrawUnit;
            const unitType          = dataForDrawUnit.unitType;
            const war               = MeModel.getWar();
            this._labelName.text    = Lang.getUnitName(unitType);

            const unitView  = this._unitView;
            const unit      = new BaseWar.BwUnit();
            unit.init({
                gridIndex   : { x: 0, y: 0 },
                unitId      : 0,
                unitType,
                playerIndex : dataForDrawUnit.playerIndex,
            }, war.getConfigVersion());
            unit.startRunning(war);
            unitView.init(unit);
            unitView.startRunningView();
        }

        public onItemTapEvent(): void {
            const data              = this.data;
            const panel             = data.panel;
            const dataForDrawUnit   = data.dataForDrawUnit;
            panel.updateOnChooseUnit(dataForDrawUnit);
            panel.close();
            MeModel.getWar().getDrawer().setModeDrawUnit(dataForDrawUnit);
        }
    }
}
