
namespace TinyWars.MultiCustomRoom {
    import BlockPanel       = Common.BlockPanel;
    import Notify           = Utility.Notify;
    import Types            = Utility.Types;
    import Lang             = Utility.Lang;
    import Helpers          = Utility.Helpers;
    import ProtoTypes       = Utility.ProtoTypes;
    import FlowManager      = Utility.FlowManager;
    import TemplateMapModel = WarMap.WarMapModel;

    export class McrReplayListPanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Scene;
        protected readonly _IS_EXCLUSIVE = true;

        private static _instance: McrReplayListPanel;

        private _labelNoReplay  : GameUi.UiLabel;
        private _listMap        : GameUi.UiScrollList;
        private _zoomMap        : GameUi.UiZoomableComponent;
        private _btnSearch      : GameUi.UiButton;
        private _btnBack        : GameUi.UiButton;

        private _groupInfo          : eui.Group;
        private _labelMapName       : GameUi.UiLabel;
        private _labelDesigner      : GameUi.UiLabel;
        private _labelHasFog        : GameUi.UiLabel;
        private _labelTurnIndex     : GameUi.UiLabel;
        private _labelNextActionId  : GameUi.UiLabel;
        private _listPlayer         : GameUi.UiScrollList;

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
            const datas         = this._dataForListReplay;
            const maxIndex      = datas ? datas.length - 1 : -1;
            const oldIndex      = this._selectedIndex;
            newIndex            = newIndex <= maxIndex ? newIndex : undefined;
            this._selectedIndex = newIndex;

            (datas[oldIndex]) && (this._listMap.updateSingleData(oldIndex, datas[oldIndex]));
            (datas[newIndex]) && (this._listMap.updateSingleData(newIndex, datas[newIndex]));

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
            FlowManager.gotoReplay(data.encodedWar, data.userNicknames);
        }

        private _onNotifySMcrGetReplayDataFailed(e: egret.Event): void {
            BlockPanel.hide();
        }

        private _onTouchTapBtnSearch(e: egret.TouchEvent): void {
            // WarMap.WarMapSearchPanel.show();
            Utility.FloatText.show("TODO!!");
        }

        private _onTouchTapBtnBack(e: egret.TouchEvent): void {
            McrReplayListPanel.hide();
            Lobby.LobbyPanel.show();
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Functions for updating view.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _updateView(): void {
            this._dataForListReplay = this._createDataForListReplay();
            this._updateListReplay();
            this.setSelectedIndex(Math.floor(Math.random() * this._dataForListReplay.length));
        }

        private _updateListReplay(): void {
            const datas = this._dataForListReplay;
            if ((!datas) || (!datas.length)) {
                this._labelNoReplay.visible = true;
                this._listMap.clear();
            } else {
                this._labelNoReplay.visible = false;
                this._listMap.bindData(datas);
            }
        }

        private _updateGroupInfo(): void {
            const datas = this._dataForListReplay;
            const data  = datas ? datas[this._selectedIndex] : undefined;
            egret.Tween.removeTweens(this._groupInfo);

            if (!data) {
                this._groupInfo.visible = false;
            } else {
                this._groupInfo.visible = true;
                this._groupInfo.alpha   = 1;

                const info = data.info;
                this._labelMapName.text         = Lang.getFormatedText(Lang.Type.F0000, info.mapName);
                this._labelDesigner.text        = Lang.getFormatedText(Lang.Type.F0001, info.mapDesigner);
                this._labelHasFog.text          = Lang.getFormatedText(Lang.Type.F0005, Lang.getText(info.hasFog ? Lang.Type.B0012 : Lang.Type.B0013));
                this._labelTurnIndex.text       = `${Lang.getText(Lang.Type.B0091)}: ${info.turnIndex + 1}`;
                this._labelNextActionId.text    = `${Lang.getText(Lang.Type.B0090)}: ${info.nextActionId}`;
                this._listPlayer.bindData(this._createDataForListPlayer(info));

                egret.Tween.get(this._groupInfo).wait(5000).to({alpha: 0}, 1000).call(() => {this._groupInfo.visible = false; this._groupInfo.alpha = 1});
            }
        }

        private async _updateMapView(): Promise<void> {
            const datas = this._dataForListReplay;
            const data  = datas ? datas[this._selectedIndex] : undefined;
            if (!data) {
                this._zoomMap.visible = false;
            } else {
                this._zoomMap.visible = true;

                const key           = data.info as Types.MapIndexKey
                const [mapData]     = await Promise.all([TemplateMapModel.getMapData(key), TemplateMapModel.getMapDynamicInfoAsync(key)]);
                const tileMapView   = new WarMap.WarMapTileMapView();
                tileMapView.init(mapData.mapWidth, mapData.mapHeight);
                tileMapView.updateWithBaseViewIdArray(mapData.tileBases);
                tileMapView.updateWithObjectViewIdArray(mapData.tileObjects);

                const unitMapView = new WarMap.WarMapUnitMapView();
                unitMapView.initWithDatas(this._createUnitViewDatas(mapData.units, mapData.mapWidth, mapData.mapHeight));

                const gridSize = ConfigManager.getGridSize();
                this._zoomMap.removeAllContents();
                this._zoomMap.setContentWidth(mapData.mapWidth * gridSize.width);
                this._zoomMap.setContentHeight(mapData.mapHeight * gridSize.height);
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
            const data: DataForPlayerRenderer[] = [
                {
                    playerIndex : 1,
                    playerName  : info.p1UserNickname,
                    teamIndex   : info.p1TeamIndex,
                },
                {
                    playerIndex : 2,
                    playerName  : info.p2UserNickname,
                    teamIndex   : info.p2TeamIndex,
                },
            ];
            if (info.p3UserId != null) {
                data.push({
                    playerIndex : 3,
                    playerName  : info.p3UserNickname,
                    teamIndex   : info.p3TeamIndex,
                });
            }
            if (info.p4UserId != null) {
                data.push({
                    playerIndex: 4,
                    playerName : info.p4UserNickname,
                    teamIndex  : info.p4TeamIndex,
                });
            }

            return data;
        }

        private _createUnitViewDatas(unitViewIds: number[], mapWidth: number, mapHeight: number): Types.UnitViewData[] {
            const configVersion = ConfigManager.getNewestConfigVersion();
            const datas: Types.UnitViewData[] = [];

            let index  = 0;
            for (let y = 0; y < mapHeight; ++y) {
                for (let x = 0; x < mapWidth; ++x) {
                    const viewId = unitViewIds[index];
                    ++index;
                    if (viewId > 0) {
                        datas.push({
                            configVersion: configVersion,
                            gridX        : x,
                            gridY        : y,
                            viewId       : viewId,
                        });
                    }
                }
            }
            return datas;
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
            this._labelName.text        = info.mapName;
        }

        private _onTouchTapBtnChoose(e: egret.TouchEvent): void {
            const data = this.data as DataForMapNameRenderer;
            data.panel.setSelectedIndex(data.index);
        }

        private _onTouchTapBtnNext(e: egret.TouchEvent): void {
            const data = this.data as DataForMapNameRenderer;
            if (data) {
                BlockPanel.show({
                    title   : Lang.getText(Lang.Type.B0088),
                    content : Lang.getText(Lang.Type.A0040),
                });
                McrProxy.reqReplayData(data.info.replayId);
            }
        }
    }

    type DataForPlayerRenderer = {
        playerIndex: number;
        playerName : string;
        teamIndex  : number;
    }

    class PlayerRenderer extends eui.ItemRenderer {
        private _labelName : GameUi.UiLabel;
        private _labelIndex: GameUi.UiLabel;
        private _labelTeam : GameUi.UiLabel;

        protected dataChanged(): void {
            super.dataChanged();

            const data = this.data as DataForPlayerRenderer;
            this._labelIndex.text = Helpers.getColorTextForPlayerIndex(data.playerIndex);
            this._labelName.text  = data.playerName || "????";
            this._labelTeam.text  = data.teamIndex != null ? Helpers.getTeamText(data.teamIndex) : "??";
        }
    }
}
