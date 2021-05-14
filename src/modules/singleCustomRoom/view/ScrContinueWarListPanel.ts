
namespace TinyWars.SingleCustomRoom {
    import Notify       = Utility.Notify;
    import Types        = Utility.Types;
    import Lang         = Utility.Lang;
    import ProtoTypes   = Utility.ProtoTypes;
    import WarMapModel  = WarMap.WarMapModel;

    export class ScrContinueWarListPanel extends GameUi.UiPanel<void> {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Scene;
        protected readonly _IS_EXCLUSIVE = true;

        private static _instance: ScrContinueWarListPanel;

        private _labelMenuTitle : GameUi.UiLabel;
        private _listWar        : GameUi.UiScrollList<DataForWarRenderer>;
        private _labelNoWar     : GameUi.UiLabel;
        private _zoomMap        : GameUi.UiZoomableMap;
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
            ScrContinueWarListPanel._instance.open(undefined);
        }
        public static async hide(): Promise<void> {
            if (ScrContinueWarListPanel._instance) {
                await ScrContinueWarListPanel._instance.close();
            }
        }

        public constructor() {
            super();

            this.skinName = "resource/skins/singleCustomRoom/ScrContinueWarListPanel.exml";
        }

        protected _onOpened(): void {
            this._setNotifyListenerArray([
                { type: Notify.Type.LanguageChanged,            callback: this._onNotifyLanguageChanged },
            ]);
            this._setUiListenerArray([
                { ui: this._btnBack,   callback: this._onTouchTapBtnBack },
            ]);
            this._listWar.setItemRenderer(WarRenderer);

            this._groupInfo.visible = false;
            this._updateComponentsForLanguage();
            this._updateListWar();
        }

        protected async _onClosed(): Promise<void> {
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
                this._zoomMap.clearMap();
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

        private _onTouchTapBtnBack(): void {
            this.close();
            SinglePlayerMode.SpmMainMenuPanel.show();
            Lobby.LobbyTopPanel.show();
            Lobby.LobbyBottomPanel.show();
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
            const saveSlots = SinglePlayerMode.SpmModel.SaveSlot.getSlotArray();
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
            // TODO
            Utility.FloatText.show(`ScrContinueWarListPanel.ScrContinueWarListPanel._showMap()`);
            // const mapId     = slotInfo.mapId;
            // const zoomMap   = this._zoomMap;
            // const groupInfo = this._groupInfo;
            // zoomMap.clearMap();

            // if (!mapId) {
            //     this._labelNoPreview.text   = Lang.getText(Lang.Type.B0324);
            //     groupInfo.visible           = false;
            // } else {
            //     const mapRawData            = await WarMapModel.getRawData(mapId);
            //     this._labelMapName.text     = Lang.getFormattedText(Lang.Type.F0000, await WarMapModel.getMapNameInCurrentLanguage(mapId));
            //     this._labelDesigner.text    = Lang.getFormattedText(Lang.Type.F0001, mapRawData.designerName);
            //     this._labelNoPreview.text   = "";

            //     groupInfo.visible   = true;
            //     groupInfo.alpha     = 1;
            //     egret.Tween.removeTweens(groupInfo);
            //     egret.Tween.get(groupInfo).wait(8000).to({alpha: 0}, 1000).call(() => {groupInfo.visible = false; groupInfo.alpha = 1});
            //     zoomMap.showMapByMapData(mapRawData);
            // }
        }
    }

    type DataForWarRenderer = {
        index       : number;
        slotInfo    : Types.SpmWarSaveSlotData;
        panel       : ScrContinueWarListPanel;
    }
    class WarRenderer extends GameUi.UiListItemRenderer<DataForWarRenderer> {
        private _btnChoose      : GameUi.UiButton;
        private _btnNext        : GameUi.UiButton;
        private _labelSlotIndex : GameUi.UiLabel;
        private _labelWarType   : GameUi.UiLabel;
        private _labelName      : GameUi.UiLabel;

        protected _onOpened(): void {
            this._setUiListenerArray([
                { ui: this._btnChoose,  callback: this._onTouchTapBtnChoose },
                { ui: this._btnNext,    callback: this._onTouchTapBtnNext },
            ]);
        }

        protected dataChanged(): void {
            super.dataChanged();

            const data                  = this.data;
            const slotInfo              = data.slotInfo;
            this.currentState           = data.index === data.panel.getSelectedIndex() ? Types.UiState.Down : Types.UiState.Up;
            this._labelSlotIndex.text   = "" + slotInfo.slotIndex;

            // TODO
            Utility.FloatText.show(`ScrContinueWarListPanel.WarRenderer.dataChanged()`);
            // this._labelWarType.text     = Lang.getWarTypeName(slotInfo.warType);
            // const comment   = slotInfo.slotComment;
            // const labelName = this._labelName;
            // if (comment) {
            //     labelName.text = comment;
            // } else {
            //     const mapId = slotInfo.mapId;
            //     if (mapId == null) {
            //         labelName.text = `(${Lang.getText(Lang.Type.B0321)})`;
            //     } else {
            //         labelName.text = ``;
            //         WarMapModel.getMapNameInCurrentLanguage(mapId).then(v => labelName.text = v);
            //     }
            // }
        }

        private _onTouchTapBtnChoose(): void {
            const data = this.data;
            data.panel.setSelectedIndex(data.index);
        }

        private _onTouchTapBtnNext(): void {
            const slotInfo = this.data.slotInfo;
            Utility.FlowManager.gotoSingleCustomWar({
                slotIndex       : slotInfo.slotIndex,
                warData         : slotInfo.warData,
                slotExtraData   : slotInfo.extraData,
            });
        }
    }
}
