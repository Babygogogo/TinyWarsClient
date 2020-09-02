
namespace TinyWars.MultiCustomRoom {
    import CommonBlockPanel = Common.CommonBlockPanel;
    import Notify           = Utility.Notify;
    import Types            = Utility.Types;
    import Lang             = Utility.Lang;
    import Helpers          = Utility.Helpers;
    import ProtoTypes       = Utility.ProtoTypes;
    import FlowManager      = Utility.FlowManager;
    import ConfigManager    = Utility.ConfigManager;
    import WarMapModel      = WarMap.WarMapModel;

    export class McrReplayListPanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Scene;
        protected readonly _IS_EXCLUSIVE = true;

        private static _instance: McrReplayListPanel;

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
            if (!McrReplayListPanel._instance) {
                McrReplayListPanel._instance = new McrReplayListPanel();
            }
            McrReplayListPanel._instance.open();
        }
        public static hide(): void {
            if (McrReplayListPanel._instance) {
                McrReplayListPanel._instance.close();
            }
        }

        public constructor() {
            super();

            this._setAutoAdjustHeightEnabled();
            this.skinName = "resource/skins/multiCustomRoom/McrReplayListPanel.exml";
        }

        protected _onFirstOpened(): void {
            this._notifyListeners = [
                { type: Notify.Type.SMcrGetReplayInfos,         callback: this._onNotifySMcrGetReplayInfos },
                { type: Notify.Type.SMcrGetReplayData,          callback: this._onNotifySMcrGetReplayData },
                { type: Notify.Type.SMcrGetReplayDataFailed,    callback: this._onNotifySMcrGetReplayDataFailed },
                { type: Notify.Type.LanguageChanged,            callback: this._onNotifyLanguageChanged },
            ];
            this._uiListeners = [
                { ui: this._btnSearch, callback: this._onTouchTapBtnSearch },
                { ui: this._btnBack,   callback: this._onTouchTapBtnBack },
            ];
            this._listMap.setItemRenderer(ReplayRenderer);
            this._listPlayer.setItemRenderer(PlayerRenderer);
        }
        protected _onOpened(): void {
            McrProxy.reqReplayInfos();

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
            const data = McrModel.getReplayData();
            FlowManager.gotoReplay(data.encodedWar);
        }

        private _onNotifySMcrGetReplayDataFailed(e: egret.Event): void {
            CommonBlockPanel.hide();
        }

        private _onNotifyLanguageChanged(e: egret.Event): void {
            this._updateComponentsForLanguage();
        }

        private _onTouchTapBtnSearch(e: egret.TouchEvent): void {
            McrReplaySearchPanel.show();
        }

        private _onTouchTapBtnBack(e: egret.TouchEvent): void {
            McrReplayListPanel.hide();
            McrMainMenuPanel.show();
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

                const info                      = data.info;
                const mapExtraData              = await WarMapModel.getExtraData(info.mapFileName);
                const totalRaters               = info.totalRaters;
                this._labelMapName.text         = Lang.getFormattedText(Lang.Type.F0000, await WarMapModel.getMapNameInCurrentLanguage(mapExtraData.mapFileName));
                this._labelDesigner.text        = Lang.getFormattedText(Lang.Type.F0001, mapExtraData.mapDesigner);
                this._labelHasFog.text          = Lang.getFormattedText(Lang.Type.F0005, Lang.getText(info.hasFog ? Lang.Type.B0012 : Lang.Type.B0001));
                this._labelTurnIndex.text       = `${Lang.getText(Lang.Type.B0091)}: ${info.turnIndex + 1}`;
                this._labelGlobalRating.text    = totalRaters ? Helpers.formatString("%.2f(%d)", info.totalRating / totalRaters, totalRaters) : `--`;
                this._labelMyRating.text        = info.myRating == null ? `--` : `${info.myRating}`;
                this._labelNextActionId.text    = `${Lang.getText(Lang.Type.B0090)}: ${info.nextActionId}`;
                this._listPlayer.bindData(this._createDataForListPlayer(info));

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

                const mapFileName   = data.info.mapFileName;
                const mapRawData    = await WarMapModel.getMapRawData(mapFileName);
                const tileMapView   = new WarMap.WarMapTileMapView();
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

        ////////////////////////////////////////////////////////////////////////////////
        // Private functions.
        ////////////////////////////////////////////////////////////////////////////////
        private _createDataForListReplay(): DataForMapNameRenderer[] {
            const data: DataForMapNameRenderer[] = [];
            const infos = McrModel.getReplayInfos();
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

        private _createDataForListPlayer(info: ProtoTypes.IMcwReplayInfo): DataForPlayerRenderer[] {
            const configVersion = info.configVersion;
            const data: DataForPlayerRenderer[] = [
                {
                    configVersion,
                    playerIndex : 1,
                    userId      : info.p1UserId,
                    teamIndex   : info.p1TeamIndex,
                    coId        : info.p1CoId,
                },
                {
                    configVersion,
                    playerIndex : 2,
                    userId      : info.p2UserId,
                    teamIndex   : info.p2TeamIndex,
                    coId        : info.p2CoId,
                },
            ];
            if (info.p3UserId != null) {
                data.push({
                    configVersion,
                    playerIndex : 3,
                    userId      : info.p3UserId,
                    teamIndex   : info.p3TeamIndex,
                    coId        : info.p3CoId,
                });
            }
            if (info.p4UserId != null) {
                data.push({
                    configVersion,
                    playerIndex : 4,
                    userId      : info.p4UserId,
                    teamIndex   : info.p4TeamIndex,
                    coId        : info.p4CoId,
                });
            }

            return data;
        }
    }

    type DataForMapNameRenderer = {
        info        : ProtoTypes.IMcwReplayInfo;
        index       : number;
        panel       : McrReplayListPanel;
    }

    class ReplayRenderer extends eui.ItemRenderer {
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
            const info                  = data.info;
            this.currentState           = data.index === data.panel.getSelectedIndex() ? Types.UiState.Down : Types.UiState.Up;
            this._labelTurnIndex.text   = `${Lang.getText(Lang.Type.B0091)}: ${info.turnIndex + 1}`;
            this._labelReplayId.text    = `ID: ${info.replayId}`;
            WarMapModel.getMapNameInCurrentLanguage(info.mapFileName).then(v => this._labelName.text = v);
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
                McrProxy.reqReplayData(data.info.replayId);
            }
        }
    }

    type DataForPlayerRenderer = {
        configVersion   : string;
        playerIndex     : number;
        userId          : number | null;
        teamIndex       : number;
        coId            : number | null | undefined;
    }

    class PlayerRenderer extends eui.ItemRenderer {
        private _labelName : GameUi.UiLabel;
        private _labelIndex: GameUi.UiLabel;
        private _labelTeam : GameUi.UiLabel;

        protected dataChanged(): void {
            super.dataChanged();

            const data              = this.data as DataForPlayerRenderer;
            this._labelIndex.text   = Helpers.getColorTextForPlayerIndex(data.playerIndex);
            this._labelTeam.text    = data.teamIndex != null ? Helpers.getTeamText(data.teamIndex) : "??";
            User.UserModel.getUserNickname(data.userId).then(name => {
                this._labelName.text = name + ConfigManager.getCoNameAndTierText(data.configVersion, data.coId);
            });
        }
    }
}
