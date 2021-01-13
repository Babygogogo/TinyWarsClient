
namespace TinyWars.ReplayWar {
    import CommonBlockPanel = Common.CommonBlockPanel;
    import Notify           = Utility.Notify;
    import Types            = Utility.Types;
    import Lang             = Utility.Lang;
    import Helpers          = Utility.Helpers;
    import ProtoTypes       = Utility.ProtoTypes;
    import FlowManager      = Utility.FlowManager;
    import ConfigManager    = Utility.ConfigManager;
    import WarMapModel      = WarMap.WarMapModel;

    export class RwReplayListPanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Scene;
        protected readonly _IS_EXCLUSIVE = true;

        private static _instance: RwReplayListPanel;

        private _labelMenuTitle : GameUi.UiLabel;
        private _labelNoReplay  : GameUi.UiLabel;
        private _listMap        : GameUi.UiScrollList;
        private _zoomMap        : GameUi.UiZoomableComponent;
        private _btnSearch      : GameUi.UiButton;
        private _btnBack        : GameUi.UiButton;

        private _groupInfo              : eui.Group;
        private _labelMapName           : GameUi.UiLabel;
        private _labelDesigner          : GameUi.UiLabel;
        private _labelPlayers           : GameUi.UiLabel;
        private _labelHasFog            : GameUi.UiLabel;
        private _labelTurnIndex         : GameUi.UiLabel;
        private _labelNextActionId      : GameUi.UiLabel;
        private _labelGlobalRatingTitle : GameUi.UiLabel;
        private _labelGlobalRating      : GameUi.UiLabel;
        private _labelMyRatingTitle     : GameUi.UiLabel;
        private _labelMyRating          : GameUi.UiLabel;
        private _listPlayer             : GameUi.UiScrollList;

        private _dataForListReplay  : DataForMapNameRenderer[] = [];
        private _selectedIndex      : number;

        public static show(): void {
            if (!RwReplayListPanel._instance) {
                RwReplayListPanel._instance = new RwReplayListPanel();
            }
            RwReplayListPanel._instance.open(undefined);
        }
        public static hide(): void {
            if (RwReplayListPanel._instance) {
                RwReplayListPanel._instance.close();
            }
        }

        public constructor() {
            super();

            this._setIsAutoAdjustHeight();
            this.skinName = "resource/skins/replayWar/RwReplayListPanel.exml";
        }

        protected _onOpened(): void {
            this._setNotifyListenerArray([
                { type: Notify.Type.MsgReplayGetInfoList,       callback: this._onNotifySMcrGetReplayInfos },
                { type: Notify.Type.MsgReplayGetData,           callback: this._onNotifySMcrGetReplayData },
                { type: Notify.Type.MsgReplayGetDataFailed,    callback: this._onNotifySMcrGetReplayDataFailed },
                { type: Notify.Type.LanguageChanged,            callback: this._onNotifyLanguageChanged },
            ]);
            this._setUiListenerArray([
                { ui: this._btnSearch, callback: this._onTouchTapBtnSearch },
                { ui: this._btnBack,   callback: this._onTouchTapBtnBack },
            ]);
            this._listMap.setItemRenderer(ReplayRenderer);
            this._listPlayer.setItemRenderer(PlayerRenderer);

            RwProxy.reqReplayInfos(null);

            this._groupInfo.visible = false;
            this._zoomMap.setMouseWheelListenerEnabled(true);
            this._zoomMap.setTouchListenerEnabled(true);

            this._updateView();
        }
        protected _onClosed(): void {
            this._zoomMap.removeAllContents();
            this._zoomMap.setMouseWheelListenerEnabled(false);
            this._zoomMap.setTouchListenerEnabled(false);
            this._listMap.clear();
            this._listPlayer.clear();
            egret.Tween.removeTweens(this._groupInfo);
        }

        public setSelectedIndex(newIndex: number): void {
            const dataList      = this._dataForListReplay;
            const maxIndex      = dataList ? dataList.length - 1 : -1;
            const oldIndex      = this._selectedIndex;
            newIndex            = newIndex <= maxIndex ? newIndex : undefined;
            this._selectedIndex = newIndex;

            (dataList[oldIndex]) && (this._listMap.updateSingleData(oldIndex, dataList[oldIndex]));
            (dataList[newIndex]) && (this._listMap.updateSingleData(newIndex, dataList[newIndex]));

            this._updateGroupInfo();
            this._updateMapView();
        }
        public getSelectedIndex(): number {
            return this._selectedIndex;
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Callbacks.
        ////////////////////////////////////////////////////////////////////////////////
        private _onNotifySMcrGetReplayInfos(e: egret.Event): void {
            this._updateView();
        }

        private _onNotifySMcrGetReplayData(e: egret.Event): void {
            const data = ReplayWar.RwModel.getReplayData();
            FlowManager.gotoReplay(data.encodedWar, data.replayId);
        }

        private _onNotifySMcrGetReplayDataFailed(e: egret.Event): void {
            CommonBlockPanel.hide();
        }

        private _onNotifyLanguageChanged(e: egret.Event): void {
            this._updateComponentsForLanguage();
        }

        private _onTouchTapBtnSearch(e: egret.TouchEvent): void {
            RwSearchReplayPanel.show();
        }

        private _onTouchTapBtnBack(e: egret.TouchEvent): void {
            RwReplayListPanel.hide();
            MultiCustomRoom.McrMainMenuPanel.show();
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Functions for updating view.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _updateView(): void {
            this._updateComponentsForLanguage();
            this._dataForListReplay = this._createDataForListReplay();
            this._updateListReplay();
            this.setSelectedIndex(0);
        }

        private _updateComponentsForLanguage(): void {
            this._labelMenuTitle.text           = Lang.getText(Lang.Type.B0092);
            this._labelPlayers.text             = `${Lang.getText(Lang.Type.B0232)}:`;
            this._labelNoReplay.text            = Lang.getText(Lang.Type.B0241);
            this._labelMyRatingTitle.text       = `${Lang.getText(Lang.Type.B0363)}:`;
            this._labelGlobalRatingTitle.text   = `${Lang.getText(Lang.Type.B0364)}:`;
            this._btnBack.label                 = Lang.getText(Lang.Type.B0146);
            this._btnSearch.label               = Lang.getText(Lang.Type.B0228);
        }

        private _updateListReplay(): void {
            const dataList = this._dataForListReplay;
            if ((!dataList) || (!dataList.length)) {
                this._labelNoReplay.visible = true;
                this._listMap.clear();
            } else {
                this._labelNoReplay.visible = false;
                this._listMap.bindData(dataList);
            }
        }

        private async _updateGroupInfo(): Promise<void> {
            const dataList  = this._dataForListReplay;
            const data      = dataList ? dataList[this._selectedIndex] : undefined;
            egret.Tween.removeTweens(this._groupInfo);

            if (!data) {
                this._groupInfo.visible = false;
            } else {
                this._groupInfo.visible = true;
                this._groupInfo.alpha   = 1;

                const replayBriefInfo           = data.info.replayBriefInfo;
                const mapId                     = replayBriefInfo.mapId;
                const totalRaters               = replayBriefInfo.totalRaters;
                const myRating                  = data.info.myRating;
                this._labelMapName.text         = Lang.getFormattedText(Lang.Type.F0000, await WarMapModel.getMapNameInCurrentLanguage(mapId));
                this._labelDesigner.text        = Lang.getFormattedText(Lang.Type.F0001, (await WarMapModel.getRawData(mapId)).designerName);
                this._labelHasFog.text          = Lang.getFormattedText(Lang.Type.F0005, Lang.getText(replayBriefInfo.hasFog ? Lang.Type.B0012 : Lang.Type.B0001));
                this._labelTurnIndex.text       = `${Lang.getText(Lang.Type.B0091)}: ${replayBriefInfo.turnIndex + 1}`;
                this._labelGlobalRating.text    = totalRaters ? Helpers.formatString("%.2f(%d)", replayBriefInfo.totalRating / totalRaters, totalRaters) : `--`;
                this._labelMyRating.text        = myRating == null ? `--` : `${myRating}`;
                this._labelNextActionId.text    = `${Lang.getText(Lang.Type.B0090)}: ${replayBriefInfo.executedActionsCount}`;
                this._listPlayer.bindData(this._createDataForListPlayer(replayBriefInfo));

                egret.Tween.get(this._groupInfo).wait(5000).to({alpha: 0}, 1000).call(() => {this._groupInfo.visible = false; this._groupInfo.alpha = 1});
            }
        }

        private async _updateMapView(): Promise<void> {
            const dataList  = this._dataForListReplay;
            const data      = dataList ? dataList[this._selectedIndex] : undefined;
            if (!data) {
                this._zoomMap.visible = false;
            } else {
                this._zoomMap.visible = true;

                const mapRawData    = await WarMapModel.getRawData(data.info.replayBriefInfo.mapId);
                const tileMapView   = new WarMap.WarMapTileMapView();
                tileMapView.init(mapRawData.mapWidth, mapRawData.mapHeight);
                tileMapView.updateWithTileDataArray(mapRawData.tileDataArray);

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

        ////////////////////////////////////////////////////////////////////////////////
        // Private functions.
        ////////////////////////////////////////////////////////////////////////////////
        private _createDataForListReplay(): DataForMapNameRenderer[] {
            const data: DataForMapNameRenderer[] = [];
            const infos = RwModel.getReplayInfoList();
            if (infos) {
                for (let i = 0; i < infos.length; ++i) {
                    const info = infos[i];
                    data.push({
                        info,
                        index       : i,
                        panel       : this,
                    });
                }
            }
            return data;
        }

        private _createDataForListPlayer(replayBriefInfo: ProtoTypes.Replay.IReplayBriefInfo): DataForPlayerRenderer[] {
            const configVersion     = replayBriefInfo.configVersion;
            const playerInfoList    = replayBriefInfo.playerInfoList;
            const dataList          : DataForPlayerRenderer[] = [];
            for (let playerIndex = 1; playerIndex <= playerInfoList.length; ++playerIndex) {
                dataList.push({
                    configVersion,
                    playerInfo  : playerInfoList.find(v => v.playerIndex === playerIndex),
                });
            }

            return dataList;
        }
    }

    type DataForMapNameRenderer = {
        info        : ProtoTypes.Replay.IReplayInfo;
        index       : number;
        panel       : RwReplayListPanel;
    }

    class ReplayRenderer extends GameUi.UiListItemRenderer {
        private _btnChoose      : GameUi.UiButton;
        private _btnNext        : GameUi.UiButton;
        private _labelTurnIndex : GameUi.UiLabel;
        private _labelReplayId  : GameUi.UiLabel;
        private _labelName      : GameUi.UiLabel;

        protected childrenCreated(): void {
            super.childrenCreated();

            this._btnChoose.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onTouchTapBtnChoose, this);
            this._btnNext.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onTouchTapBtnNext, this);
        }

        protected dataChanged(): void {
            super.dataChanged();

            const data                  = this.data as DataForMapNameRenderer;
            const info                  = data.info.replayBriefInfo;
            const warType               = info.warType;
            this.currentState           = data.index === data.panel.getSelectedIndex() ? Types.UiState.Down : Types.UiState.Up;
            this._labelTurnIndex.text   = `${Lang.getText(Lang.Type.B0091)}: ${info.turnIndex + 1}`;
            this._labelReplayId.text    = `ID: ${info.replayId}${warType === Types.WarType.RmwStd || warType === Types.WarType.RmwFog ? ` RANK` : ``}`;
            WarMapModel.getMapNameInCurrentLanguage(info.mapId).then(v => this._labelName.text = v);
        }

        private _onTouchTapBtnChoose(e: egret.TouchEvent): void {
            const data = this.data as DataForMapNameRenderer;
            data.panel.setSelectedIndex(data.index);
        }

        private _onTouchTapBtnNext(e: egret.TouchEvent): void {
            const data = this.data as DataForMapNameRenderer;
            if (data) {
                CommonBlockPanel.show({
                    title   : Lang.getText(Lang.Type.B0088),
                    content : Lang.getText(Lang.Type.A0040),
                });
                RwProxy.reqReplayGetData(data.info.replayBriefInfo.replayId);
            }
        }
    }

    type DataForPlayerRenderer = {
        configVersion   : string;
        playerInfo      : ProtoTypes.Structure.IWarPlayerInfo;
    }

    class PlayerRenderer extends GameUi.UiListItemRenderer {
        private _labelName : GameUi.UiLabel;
        private _labelIndex: GameUi.UiLabel;

        protected dataChanged(): void {
            super.dataChanged();

            const data              = this.data as DataForPlayerRenderer;
            const playerInfo        = data.playerInfo;
            this._labelIndex.text   = `${Lang.getPlayerForceName(playerInfo.playerIndex)}(${Lang.getPlayerTeamName(playerInfo.teamIndex)})`;
            User.UserModel.getUserNickname(playerInfo.userId).then(name => {
                this._labelName.text = `${name} (${ConfigManager.getCoNameAndTierText(data.configVersion, playerInfo.coId)})`;
            });
        }
    }
}
