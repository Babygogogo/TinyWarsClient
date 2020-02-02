
namespace TinyWars.MapEditor {
    import Notify   = Utility.Notify;
    import Lang     = Utility.Lang;
    import Types    = Utility.Types;

    export class MeChooseTileObjectPanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Hud0;
        protected readonly _IS_EXCLUSIVE = false;

        private static _instance: MeChooseTileObjectPanel;

        private _labelForceTitle: GameUi.UiLabel;
        private _listForce      : GameUi.UiScrollList;
        private _listTileObject : GameUi.UiScrollList;
        private _btnCancel      : GameUi.UiButton;

        private _dataForListForce   : DataForForceRenderer[] = [];
        private _selectForceIndex   : number;

        public static show(): void {
            if (!MeChooseTileObjectPanel._instance) {
                MeChooseTileObjectPanel._instance = new MeChooseTileObjectPanel();
            }
            MeChooseTileObjectPanel._instance.open();
        }
        public static hide(): void {
            if (MeChooseTileObjectPanel._instance) {
                MeChooseTileObjectPanel._instance.close();
            }
        }

        public constructor() {
            super();

            this._setAutoAdjustHeightEnabled();
            this._setTouchMaskEnabled();
            this._callbackForTouchMask = () => this.close();
            this.skinName = "resource/skins/mapEditor/MeChooseTileObjectPanel.exml";
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
            this._listTileObject.setItemRenderer(TileObjectRenderer);
            this._listTileObject.scrollPolicyH = eui.ScrollPolicy.OFF;
        }

        protected _onOpened(): void {
            this._updateComponentsForLanguage();

            this._dataForListForce = this._createDataForListForce();
            this._listForce.bindData(this._dataForListForce);
            this.setSelectedForceIndex(0);
        }

        protected _onClosed(): void {
            this._listTileObject.clear();
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
                this._updateListTileObject(newIndex);
            } else {
                this._listTileObject.clear();
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
            const viewList = this._listTileObject.getViewList();
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
            for (let playerIndex = 0; playerIndex <= ConfigManager.MAX_PLAYER_INDEX; ++playerIndex) {
                dataList.push({
                    index,
                    playerIndex,
                    panel: this,
                });
                ++index;
            }

            return dataList;
        }

        private _createDataForListTileObject(playerIndex: number): DataForTileObjectRenderer[] {
            const dataList: DataForTileObjectRenderer[] = [];
            ConfigManager.forEachTileObjectTypeAndPlayerIndex((value, objectViewId) => {
                if ((value.playerIndex === playerIndex) && (objectViewId !== 0)) {
                    dataList.push({
                        objectViewId,
                    });
                }
            });
            return dataList;
        }

        private _updateListTileObject(index: number): void {
            const dataList = this._createDataForListTileObject(this._dataForListForce[index].playerIndex);
            this._listTileObject.bindData(dataList);
            this._listTileObject.scrollVerticalTo(0);
        }
    }

    type DataForForceRenderer = {
        index       : number;
        playerIndex : number;
        panel       : MeChooseTileObjectPanel;
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
        objectViewId: number;
    }

    class TileObjectRenderer extends eui.ItemRenderer {
        private _group          : eui.Group;
        private _labelName      : GameUi.UiLabel;
        private _conTileView    : eui.Group;

        private _tileView   = new MeTileSimpleView();

        protected childrenCreated(): void {
            super.childrenCreated();

            const tileView = this._tileView;
            this._conTileView.addChild(tileView.getImgBase());
            this._conTileView.addChild(tileView.getImgObject());
            tileView.startRunningView();
        }

        public updateOnTileAnimationTick(): void {
            this._tileView.updateOnAnimationTick();
        }

        protected dataChanged(): void {
            const data              = this.data as DataForTileObjectRenderer;
            this._labelName.text    = Lang.getTileName(ConfigManager.getTileType(Types.TileBaseType.Plain, ConfigManager.getTileObjectTypeAndPlayerIndex(data.objectViewId).tileObjectType));
            this._tileView.init(null, data.objectViewId);
            this._tileView.updateView();
        }

        public onItemTapEvent(): void {
            const data = this.data as DataForTileObjectRenderer;
            MeChooseTileObjectPanel.hide();
            MeManager.getWar().getDrawer().setModeDrawTileObject(data.objectViewId);
        }
    }
}
