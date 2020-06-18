
namespace TinyWars.MultiCustomRoom {
    import Notify           = Utility.Notify;
    import Types            = Utility.Types;
    import ConfigManager    = Utility.ConfigManager;
    import Helpers          = Utility.Helpers;
    import Lang             = Utility.Lang;
    import ProtoTypes       = Utility.ProtoTypes;
    import WarMapModel      = WarMap.WarMapModel;

    export class McrJoinMapListPanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Scene;
        protected readonly _IS_EXCLUSIVE = true;

        private static _instance: McrJoinMapListPanel;

        private _labelMenuTitle : GameUi.UiLabel;
        private _listWar        : GameUi.UiScrollList;
        private _labelNoWar     : GameUi.UiLabel;
        private _zoomMap        : GameUi.UiZoomableComponent;
        private _btnBack        : GameUi.UiButton;

        private _groupInfo          : eui.Group;
        private _labelMapName       : GameUi.UiLabel;
        private _labelDesigner      : GameUi.UiLabel;
        private _labelHasFogTitle   : GameUi.UiLabel;
        private _labelHasFog        : GameUi.UiLabel;
        private _labelWarComment    : GameUi.UiLabel;
        private _labelPlayersTitle  : GameUi.UiLabel;
        private _labelCommentTitle  : GameUi.UiLabel;
        private _listPlayer         : GameUi.UiScrollList;

        private _dataForListWar     : DataForWarRenderer[] = [];
        private _dataForListPlayer  : DataForPlayerRenderer[] = [];
        private _selectedWarIndex   : number;

        public static show(): void {
            if (!McrJoinMapListPanel._instance) {
                McrJoinMapListPanel._instance = new McrJoinMapListPanel();
            }
            McrJoinMapListPanel._instance.open();
        }
        public static hide(): void {
            if (McrJoinMapListPanel._instance) {
                McrJoinMapListPanel._instance.close();
            }
        }

        public constructor() {
            super();

            this._setAutoAdjustHeightEnabled();
            this.skinName = "resource/skins/multiCustomRoom/McrJoinMapListPanel.exml";
        }

        protected _onFirstOpened(): void {
            this._notifyListeners = [
                { type: Notify.Type.LanguageChanged,                callback: this._onNotifyLanguageChanged },
                { type: Notify.Type.SMcrGetUnjoinedWaitingInfos,    callback: this._onNotifySMcrGetUnjoinedWaitingInfos },
                { type: Notify.Type.SMcrContinueWar,                callback: this._onNotifySMcrContinueWar },
            ];
            this._uiListeners = [
                { ui: this._btnBack,   callback: this._onTouchTapBtnBack },
            ];
            this._listWar.setItemRenderer(WarRenderer);
            this._listPlayer.setItemRenderer(PlayerRenderer);
        }

        protected _onOpened(): void {
            this._groupInfo.visible = false;
            this._zoomMap.setMouseWheelListenerEnabled(true);
            this._zoomMap.setTouchListenerEnabled(true);
            this._updateComponentsForLanguage();

            McrProxy.reqUnjoinedWarInfos();
        }

        protected _onClosed(): void {
            this._zoomMap.removeAllContents();
            this._zoomMap.setMouseWheelListenerEnabled(false);
            this._zoomMap.setTouchListenerEnabled(false);
            this._listWar.clear();
            this._listPlayer.clear();
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
        private _onNotifySMcrGetUnjoinedWaitingInfos(e: egret.Event): void {
            const newData        = this._createDataForListWar(McrModel.getUnjoinedWaitingInfos());
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

        private _onNotifySMcrContinueWar(e: egret.Event): void {
            Utility.FlowManager.gotoMultiCustomWar((e.data as ProtoTypes.IS_McrContinueWar).war as Types.SerializedWar);
        }

        private _onNotifyLanguageChanged(e: egret.Event): void {
            this._updateComponentsForLanguage();
        }

        private _onTouchTapBtnBack(e: egret.TouchEvent): void {
            McrJoinMapListPanel.hide();
            McrMainMenuPanel.show()
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Private functions.
        ////////////////////////////////////////////////////////////////////////////////
        private _updateComponentsForLanguage(): void {
            this._labelMenuTitle.text       = Lang.getText(Lang.Type.B0023);
            this._btnBack.label             = Lang.getText(Lang.Type.B0146);
            this._labelNoWar.text           = Lang.getText(Lang.Type.B0210);
            this._labelCommentTitle.text    = `${Lang.getText(Lang.Type.B0187)}:`;
            this._labelPlayersTitle.text    = `${Lang.getText(Lang.Type.B0232)}:`;
            this._labelHasFogTitle.text     = `${Lang.getText(Lang.Type.B0020)}:`;
        }

        private _createDataForListWar(infos: ProtoTypes.IMcrWaitingInfo[]): DataForWarRenderer[] {
            const data: DataForWarRenderer[] = [];
            if (infos) {
                for (let i = 0; i < infos.length; ++i) {
                    data.push({
                        warInfo : infos[i],
                        index   : i,
                        panel   : this,
                    });
                }
            }

            return data;
        }

        private _createDataForListPlayer(waitingInfo: ProtoTypes.IMcrWaitingInfo, mapPlayersCount: number): DataForPlayerRenderer[] {
            const playerInfoList    = waitingInfo.playerInfoList;
            const configVersion     = waitingInfo.configVersion;
            const info1             = getPlayerInfo(playerInfoList, 1);
            const info2             = getPlayerInfo(playerInfoList, 2);
            const data              : DataForPlayerRenderer[] = [
                {
                    playerIndex     : 1,
                    userId          : info1 ? info1.userId : null,
                    teamIndex       : info1 ? info1.teamIndex : null,
                    coId            : info1 ? info1.coId : null,
                    configVersion,
                },
                {
                    playerIndex     : 2,
                    userId          : info2 ? info2.userId : null,
                    teamIndex       : info2 ? info2.teamIndex : null,
                    coId            : info2 ? info2.coId : null,
                    configVersion,
                },
            ];
            if (mapPlayersCount >= 3) {
                const info = getPlayerInfo(playerInfoList, 3);
                data.push({
                    playerIndex     : 3,
                    userId          : info ? info.userId : null,
                    teamIndex       : info ? info.teamIndex : null,
                    coId            : info ? info.coId : null,
                    configVersion,
                });
            }
            if (mapPlayersCount >= 4) {
                const info = getPlayerInfo(playerInfoList, 4);
                data.push({
                    playerIndex     : 4,
                    userId          : info ? info.userId : null,
                    teamIndex       : info ? info.teamIndex : null,
                    coId            : info ? info.coId : null,
                    configVersion,
                });
            }

            return data;
        }

        private async _showMap(index: number): Promise<void> {
            const warInfo               = this._dataForListWar[index].warInfo;
            const mapRawData            = await WarMapModel.getMapRawData(warInfo.mapFileName);
            this._labelMapName.text     = Lang.getFormattedText(Lang.Type.F0000, await WarMapModel.getMapNameInLanguage(warInfo.mapFileName));
            this._labelDesigner.text    = Lang.getFormattedText(Lang.Type.F0001, mapRawData.mapDesigner);
            this._labelHasFog.text      = Lang.getText(warInfo.hasFog ? Lang.Type.B0012 : Lang.Type.B0001);
            this._labelHasFog.textColor = warInfo.hasFog ? 0xFF0000 : 0x00FF00;
            this._labelWarComment.text  = warInfo.warComment || "----";
            this._listPlayer.bindData(this._createDataForListPlayer(warInfo, mapRawData.playersCount));

            this._groupInfo.visible      = true;
            this._groupInfo.alpha        = 1;
            egret.Tween.removeTweens(this._groupInfo);
            egret.Tween.get(this._groupInfo).wait(8000).to({alpha: 0}, 1000).call(() => {this._groupInfo.visible = false; this._groupInfo.alpha = 1});

            const tileMapView = new WarMap.WarMapTileMapView();
            tileMapView.init(mapRawData.mapWidth, mapRawData.mapHeight);
            tileMapView.updateWithBaseViewIdArray(mapRawData.tileBases);
            tileMapView.updateWithObjectViewIdArray(mapRawData.tileObjects);

            const unitMapView = new WarMap.WarMapUnitMapView();
            unitMapView.initWithMapRawData(mapRawData);

            const gridSize = Utility.ConfigManager.getGridSize();
            this._zoomMap.removeAllContents();
            this._zoomMap.setContentWidth(mapRawData.mapWidth * gridSize.width);
            this._zoomMap.setContentHeight(mapRawData.mapHeight * gridSize.height);
            this._zoomMap.addContent(tileMapView);
            this._zoomMap.addContent(unitMapView);
            this._zoomMap.setContentScale(0, true);
        }
    }

    type DataForWarRenderer = {
        warInfo : ProtoTypes.IMcrWaitingInfo;
        index   : number;
        panel   : McrJoinMapListPanel;
    }

    class WarRenderer extends eui.ItemRenderer {
        private _btnChoose      : GameUi.UiButton;
        private _btnNext        : GameUi.UiButton;
        private _labelName      : GameUi.UiLabel;
        private _labelPassword  : GameUi.UiLabel;

        protected childrenCreated(): void {
            super.childrenCreated();

            this._btnChoose.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onTouchTapBtnChoose, this);
            this._btnNext.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onTouchTapBtnNext, this);
        }

        protected dataChanged(): void {
            super.dataChanged();

            const data                  = this.data as DataForWarRenderer;
            const warInfo               = data.warInfo;
            this.currentState           = data.index === data.panel.getSelectedIndex() ? Types.UiState.Down : Types.UiState.Up;
            this._labelPassword.visible = (warInfo.warPassword != null) && (warInfo.warPassword.length > 0);
            if (warInfo.warName) {
                this._labelName.text = warInfo.warName;
            } else {
                WarMapModel.getMapNameInLanguage(warInfo.mapFileName).then(v => this._labelName.text = v);
            }
        }

        private _onTouchTapBtnChoose(e: egret.TouchEvent): void {
            const data = this.data as DataForWarRenderer;
            data.panel.setSelectedIndex(data.index);
        }

        private async _onTouchTapBtnNext(e: egret.TouchEvent): Promise<void> {
            const data = this.data as DataForWarRenderer;
            if (data.warInfo.warPassword) {
                McrJoinPasswordPanel.show(data.warInfo);
            } else {
                McrJoinMapListPanel.hide();

                await McrModel.resetJoinWarData(data.warInfo);
                McrJoinSettingsPanel.show();
            }
        }
    }

    type DataForPlayerRenderer = {
        playerIndex     : number;
        userId          : number | null;
        teamIndex       : number;
        coId            : number;
        configVersion   : string;
    }

    class PlayerRenderer extends eui.ItemRenderer {
        private _labelName : GameUi.UiLabel;
        private _labelIndex: GameUi.UiLabel;
        private _labelTeam : GameUi.UiLabel;

        protected dataChanged(): void {
            super.dataChanged();

            const data              = this.data as DataForPlayerRenderer;
            const userId            = data.userId;
            this._labelIndex.text   = Helpers.getColorTextForPlayerIndex(data.playerIndex);
            this._labelTeam.text    = data.teamIndex != null ? Helpers.getTeamText(data.teamIndex) : "??";
            if (userId == null) {
                this._labelName.text = "????";
            } else {
                User.UserModel.getUserNickname(userId).then(name => {
                    this._labelName.text = `${name} ${ConfigManager.getCoNameAndTierText(data.configVersion, data.coId)}`;
                })
            }
        }
    }

    function getPlayerInfo(playerInfoList: ProtoTypes.IWarPlayerInfo[], playerIndex: number): ProtoTypes.IWarPlayerInfo | null {
        return playerInfoList.find(v => v.playerIndex === playerIndex);
    }
}
