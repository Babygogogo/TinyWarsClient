
namespace TinyWars.SingleCustomRoom {
    import Notify       = Utility.Notify;
    import Types        = Utility.Types;
    import Lang         = Utility.Lang;
    import ProtoTypes   = Utility.ProtoTypes;
    import FloatText    = Utility.FloatText;
    import ProtoManager = Utility.ProtoManager;
    import WarMapModel  = WarMap.WarMapModel;

    export class ScrContinueWarListPanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Scene;
        protected readonly _IS_EXCLUSIVE = true;

        private static _instance: ScrContinueWarListPanel;

        private _labelMenuTitle : GameUi.UiLabel;
        private _listWar        : GameUi.UiScrollList;
        private _labelNoWar     : GameUi.UiLabel;
        private _zoomMap        : GameUi.UiZoomableComponent;
        private _btnBack        : GameUi.UiButton;

        private _groupInfo          : eui.Group;
        private _labelMapName       : GameUi.UiLabel;
        private _labelDesigner      : GameUi.UiLabel;
        private _labelNoPreview     : GameUi.UiLabel;

        private _dataForListWar     : DataForWarRenderer[] = [];
        private _selectedWarIndex   : number;

        public static show(): void {
            if (!ScrContinueWarListPanel._instance) {
                ScrContinueWarListPanel._instance = new ScrContinueWarListPanel();
            }
            ScrContinueWarListPanel._instance.open();
        }
        public static hide(): void {
            if (ScrContinueWarListPanel._instance) {
                ScrContinueWarListPanel._instance.close();
            }
        }

        public constructor() {
            super();

            this._setAutoAdjustHeightEnabled();
            this.skinName = "resource/skins/singleCustomRoom/ScrContinueWarListPanel.exml";
        }

        protected _onFirstOpened(): void {
            this._notifyListeners = [
                { type: Notify.Type.LanguageChanged,        callback: this._onNotifyLanguageChanged },
                { type: Notify.Type.MsgScrContinueWarFailed,  callback: this._onNotifySScrContinueWarFailed },
                { type: Notify.Type.MsgScrContinueWar,        callback: this._onNotifySScrContinueWar },
            ];
            this._uiListeners = [
                { ui: this._btnBack,   callback: this._onTouchTapBtnBack },
            ];
            this._listWar.setItemRenderer(WarRenderer);
        }

        protected _onOpened(): void {
            this._groupInfo.visible = false;
            this._zoomMap.setMouseWheelListenerEnabled(true);
            this._zoomMap.setTouchListenerEnabled(true);
            this._updateComponentsForLanguage();
            this._updateListWar();
        }

        protected _onClosed(): void {
            this._zoomMap.removeAllContents();
            this._zoomMap.setMouseWheelListenerEnabled(false);
            this._zoomMap.setTouchListenerEnabled(false);
            this._listWar.clear();
            egret.Tween.removeTweens(this._groupInfo);
        }

        public async setSelectedIndex(newIndex: number): Promise<void> {
            const oldIndex         = this._selectedWarIndex;
            const dataList         = this._dataForListWar;
            this._selectedWarIndex = dataList[newIndex] ? newIndex : undefined;

            if (dataList[oldIndex]) {
                this._listWar.updateSingleData(oldIndex, dataList[oldIndex])
            };

            if (dataList[newIndex]) {
                this._listWar.updateSingleData(newIndex, dataList[newIndex]);
                await this._showMap(newIndex);
            } else {
                this._zoomMap.removeAllContents();
                this._groupInfo.visible = false;
            }
        }
        public getSelectedIndex(): number {
            return this._selectedWarIndex;
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Callbacks.
        ////////////////////////////////////////////////////////////////////////////////
        private _onNotifyLanguageChanged(e: egret.Event): void {
            this._updateComponentsForLanguage();
        }

        private _onNotifySScrContinueWarFailed(e: egret.Event): void {
            Common.CommonBlockPanel.hide();
        }

        private _onNotifySScrContinueWar(e: egret.Event): void {
            const data      = e.data as ProtoTypes.NetMessage.MsgScrContinueWar.IS;
            const warData   = ProtoManager.decodeAsSerialWar(data.encodedWar);
            Utility.FlowManager.gotoSingleCustomWar(warData);
        }

        private _onTouchTapBtnBack(): void {
            ScrContinueWarListPanel.hide();
            SinglePlayerLobby.SinglePlayerLobbyPanel.show();
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Private functions.
        ////////////////////////////////////////////////////////////////////////////////
        private _updateComponentsForLanguage(): void {
            this._labelMenuTitle.text       = Lang.getText(Lang.Type.B0024);
            this._labelNoWar.text           = Lang.getText(Lang.Type.B0210);
            this._btnBack.label             = Lang.getText(Lang.Type.B0146);
        }

        private _updateListWar(): void {
            const newData        = this._createDataForListWar();
            this._dataForListWar = newData;

            if (newData.length > 0) {
                this._labelNoWar.visible = false;
                this._listWar.bindData(newData);
            } else {
                this._labelNoWar.visible = true;
                this._listWar.clear();
            }
            this.setSelectedIndex(0);
        }

        private _createDataForListWar(): DataForWarRenderer[] {
            const saveSlots = ScrModel.getSaveSlotInfoList();
            const data      : DataForWarRenderer[] = [];
            if (saveSlots) {
                for (let i = 0; i < saveSlots.length; ++i) {
                    data.push({
                        index   : i,
                        slotInfo: saveSlots[i],
                        panel   : this,
                    });
                }
            }

            return data;
        }

        private async _showMap(index: number): Promise<void> {
            const slotInfo  = this._dataForListWar[index].slotInfo;
            const mapId     = slotInfo.mapId;
            const zoomMap   = this._zoomMap;
            const groupInfo = this._groupInfo;
            zoomMap.removeAllContents();

            if (!mapId) {
                this._labelNoPreview.text   = Lang.getText(Lang.Type.B0324);
                groupInfo.visible           = false;
            } else {
                const mapRawData            = await WarMapModel.getRawData(mapId);
                this._labelMapName.text     = Lang.getFormattedText(Lang.Type.F0000, await WarMapModel.getMapNameInCurrentLanguage(mapId));
                this._labelDesigner.text    = Lang.getFormattedText(Lang.Type.F0001, mapRawData.designerName);
                this._labelNoPreview.text   = "";

                groupInfo.visible   = true;
                groupInfo.alpha     = 1;
                egret.Tween.removeTweens(groupInfo);
                egret.Tween.get(groupInfo).wait(8000).to({alpha: 0}, 1000).call(() => {groupInfo.visible = false; groupInfo.alpha = 1});

                const tileMapView = new WarMap.WarMapTileMapView();
                tileMapView.init(mapRawData.mapWidth, mapRawData.mapHeight);
                tileMapView.updateWithTileDataList(mapRawData.tileDataList);

                const unitMapView = new WarMap.WarMapUnitMapView();
                unitMapView.initWithMapRawData(mapRawData);

                const gridSize = Utility.ConfigManager.getGridSize();
                zoomMap.setContentWidth(mapRawData.mapWidth * gridSize.width);
                zoomMap.setContentHeight(mapRawData.mapHeight * gridSize.height);
                zoomMap.addContent(tileMapView);
                zoomMap.addContent(unitMapView);
                zoomMap.setContentScale(0, true);
            }
        }
    }

    type DataForWarRenderer = {
        index       : number;
        slotInfo    : ProtoTypes.SingleCustomRoom.IScrSaveSlotInfo;
        panel       : ScrContinueWarListPanel;
    }

    class WarRenderer extends eui.ItemRenderer {
        private _btnChoose      : GameUi.UiButton;
        private _btnNext        : GameUi.UiButton;
        private _labelSlotIndex : GameUi.UiLabel;
        private _labelWarType   : GameUi.UiLabel;
        private _labelName      : GameUi.UiLabel;

        protected childrenCreated(): void {
            super.childrenCreated();

            this._btnChoose.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onTouchTapBtnChoose, this);
            this._btnNext.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onTouchTapBtnNext, this);
        }

        protected dataChanged(): void {
            super.dataChanged();

            const data                  = this.data as DataForWarRenderer;
            const slotInfo              = data.slotInfo;
            this.currentState           = data.index === data.panel.getSelectedIndex() ? Types.UiState.Down : Types.UiState.Up;
            this._labelSlotIndex.text   = "" + slotInfo.saveSlotIndex;
            this._labelWarType.text     = Lang.getWarTypeName(slotInfo.warType);

            const mapId = slotInfo.mapId;
            if (mapId == null) {
                this._labelName.text = `(${Lang.getText(Lang.Type.B0321)})`;
            } else {
                WarMapModel.getMapNameInCurrentLanguage(mapId).then(v => this._labelName.text = v);
            }
        }

        private _onTouchTapBtnChoose(): void {
            const data = this.data as DataForWarRenderer;
            data.panel.setSelectedIndex(data.index);
        }

        private _onTouchTapBtnNext(): void {
            ScrProxy.reqContinueWar((this.data as DataForWarRenderer).slotInfo.saveSlotIndex);
            Common.CommonBlockPanel.show({
                title   : Lang.getText(Lang.Type.B0088),
                content : Lang.getText(Lang.Type.A0021),
            });
        }
    }
}
