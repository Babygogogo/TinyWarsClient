
namespace TinyWars.MapEditor {
    import Notify   = Utility.Notify;
    import Lang     = Utility.Lang;
    import Types    = Utility.Types;

    export class MeChooseUnitPanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Hud0;
        protected readonly _IS_EXCLUSIVE = false;

        private static _instance: MeChooseUnitPanel;

        private _labelForceTitle: GameUi.UiLabel;
        private _listForce      : GameUi.UiScrollList;
        private _listUnit       : GameUi.UiScrollList;
        private _btnCancel      : GameUi.UiButton;

        private _dataForListForce   : DataForForceRenderer[] = [];
        private _selectForceIndex   : number;

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
                { type: Notify.Type.TileAnimationTick,  callback: this._onNotifyTileAnimationTick },
            ];
            this._uiListeners = [
                { ui: this._btnCancel,  callback: this.close },
            ];
            this._listForce.setItemRenderer(ForceRenderer);
            this._listUnit.setItemRenderer(TileObjectRenderer);
            this._listUnit.scrollPolicyH = eui.ScrollPolicy.OFF;
        }

        protected _onOpened(): void {
            this._updateComponentsForLanguage();

            this._dataForListForce = this._createDataForListForce();
            this._listForce.bindData(this._dataForListForce);
            this.setSelectedForceIndex(0);
        }

        protected _onClosed(): void {
            this._listUnit.clear();
            this._listForce.clear();
        }

        public setSelectedForceIndex(newIndex: number): void {
            const oldIndex         = this._selectForceIndex;
            const dataList         = this._dataForListForce;
            this._selectForceIndex = dataList[newIndex] ? newIndex : undefined;

            if (dataList[oldIndex]) {
                this._listForce.updateSingleData(oldIndex, dataList[oldIndex])
            }

            if (dataList[newIndex]) {
                this._listForce.updateSingleData(newIndex, dataList[newIndex]);
                this._updateListUnit(newIndex);
            } else {
                this._listUnit.clear();
            }
        }
        public getSelectedForceIndex(): number {
            return this._selectForceIndex;
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Callbacks.
        ////////////////////////////////////////////////////////////////////////////////
        private _onNotifyLanguageChanged(e: egret.Event): void {
            this._updateComponentsForLanguage();
        }

        private _onNotifyTileAnimationTick(e: egret.Event): void {
            const viewList = this._listUnit.getViewList();
            for (let i = 0; i < viewList.numChildren; ++i) {
                const child = viewList.getChildAt(i);
                (child instanceof TileObjectRenderer) && (child.updateOnTileAnimationTick());
            }
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Private functions.
        ////////////////////////////////////////////////////////////////////////////////
        private _updateComponentsForLanguage(): void {
            this._btnCancel.label       = Lang.getText(Lang.Type.B0154);
            this._labelForceTitle.text  = `${Lang.getText(Lang.Type.B0168)}:`;
        }

        private _createDataForListForce(): DataForForceRenderer[] {
            const dataList: DataForForceRenderer[] = [];

            let index = 0;
            for (let playerIndex = 1; playerIndex <= ConfigManager.MAX_PLAYER_INDEX; ++playerIndex) {
                dataList.push({
                    index,
                    playerIndex,
                    panel: this,
                });
                ++index;
            }

            return dataList;
        }

        private _createDataForListUnit(playerIndex: number): DataForTileObjectRenderer[] {
            const dataList: DataForTileObjectRenderer[] = [];
            ConfigManager.forEachUnitTypeAndPlayerIndex((value, unitViewId) => {
                if ((value.playerIndex === playerIndex) && (unitViewId !== 0)) {
                    dataList.push({
                        unitViewId,
                    });
                }
            });
            return dataList;
        }

        private _updateListUnit(index: number): void {
            const dataList = this._createDataForListUnit(this._dataForListForce[index].playerIndex);
            this._listUnit.bindData(dataList);
            this._listUnit.scrollVerticalTo(0);
        }
    }

    type DataForForceRenderer = {
        index       : number;
        playerIndex : number;
        panel       : MeChooseUnitPanel;
    }

    class ForceRenderer extends eui.ItemRenderer {
        private _labelName: GameUi.UiLabel;

        protected dataChanged(): void {
            super.dataChanged();

            const data                  = this.data as DataForForceRenderer;
            this._labelName.text        = Lang.getPlayerForceName(data.playerIndex);
            this._labelName.textColor   = data.index === data.panel.getSelectedForceIndex() ? 0x00ff00 : 0xffffff;
        }

        public onItemTapEvent(e: eui.ItemTapEvent): void {
            const data = this.data as DataForForceRenderer;
            data.panel.setSelectedForceIndex(data.index);
        }
    }

    type DataForTileObjectRenderer = {
        unitViewId: number;
    }

    class TileObjectRenderer extends eui.ItemRenderer {
        private _group          : eui.Group;
        private _labelName      : GameUi.UiLabel;
        private _conUnitView    : eui.Group;

        private _unitView   = new MeUnitView();

        protected childrenCreated(): void {
            super.childrenCreated();

            this._conUnitView.addChild(this._unitView);
        }

        public updateOnTileAnimationTick(): void {
            const unitView = this._unitView;
            unitView.tickStateAnimationFrame();
            unitView.tickUnitAnimationFrame();
        }

        protected dataChanged(): void {
            const data              = this.data as DataForTileObjectRenderer;
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
            const data = this.data as DataForTileObjectRenderer;
            MeChooseUnitPanel.hide();
            MeManager.getWar().getDrawer().setModeDrawUnit(data.unitViewId);
        }
    }
}
