
namespace CustomOnlineWarExiter {
    import Notify           = Utility.Notify;
    import Types            = Utility.Types;
    import StageManager     = Utility.StageManager;
    import FloatText        = Utility.FloatText;
    import Helpers          = Utility.Helpers;
    import Lang             = Utility.Lang;
    import ProtoTypes       = Utility.ProtoTypes;
    import TemplateMapModel = TemplateMap.TemplateMapModel;
    import TemplateMapProxy = TemplateMap.TemplateMapProxy;

    export class ExitWarListPanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Scene;
        protected readonly _IS_EXCLUSIVE = true;

        private static _instance: ExitWarListPanel;

        private _listWar   : GameUi.UiScrollList;
        private _zoomMap   : GameUi.UiZoomableComponent;
        private _btnBack   : GameUi.UiButton;

        private _groupInfo      : eui.Group;
        private _labelMapName   : GameUi.UiLabel;
        private _labelDesigner  : GameUi.UiLabel;
        private _listPlayer     : GameUi.UiScrollList;

        private _currentTouchPoints : Types.TouchPoints = {};
        private _previousTouchPoints: Types.TouchPoints = {};
        private _warInfos           : ProtoTypes.IWaitingCustomOnlineWarInfo[] = [];
        private _dataForListWar     : DataForWarRenderer[] = [];
        private _dataForListPlayer  : DataForPlayerRenderer[] = [];
        private _selectedWarIndex   : number;

        public static open(): void {
            if (!ExitWarListPanel._instance) {
                ExitWarListPanel._instance = new ExitWarListPanel();
            }
            ExitWarListPanel._instance.open();
        }
        public static close(): void {
            if (ExitWarListPanel._instance) {
                ExitWarListPanel._instance.close();
            }
        }

        public constructor() {
            super();

            this._setAutoAdjustHeightEnabled();
            this.skinName = "resource/skins/customOnlineWarExiter/ExitWarListPanel.exml";
        }

        protected _onFirstOpened(): void {
            this._notifyListeners = [
                { name: Notify.Type.MouseWheel,                      callback: this._onNotifyMouseWheel },
                { name: Notify.Type.SGetWaitingCustomOnlineWarInfos, callback: this._onNotifyGetWaitingCustomOnlineWarInfos },
            ];
            this._uiListeners = [
                { ui: this._zoomMap,   callback: this._onTouchBeginZoomMap, eventType: egret.TouchEvent.TOUCH_BEGIN },
                { ui: this._zoomMap,   callback: this._onTouchEndZoomMap,   eventType: egret.TouchEvent.TOUCH_END },
                { ui: this._btnBack,   callback: this._onTouchTapBtnBack },
            ];
            this._listWar.setItemRenderer(WarRenderer);
            this._listPlayer.setItemRenderer(PlayerRenderer);
        }

        protected _onOpened(): void {
            this._groupInfo.visible = false;

            ExitWarProxy.reqWaitingCustomOnlineWarInfos();
        }

        protected _onClosed(): void {
            this._zoomMap.removeAllContents();
            this._listWar.clear();
            this._listPlayer.clear();
            egret.Tween.removeTweens(this._groupInfo);
        }

        public async setSelectedIndex(newIndex: number): Promise<void> {
            const datas = this._dataForListWar;
            if (datas.length <= 0) {
                this._selectedWarIndex = undefined;
            } else if (datas[newIndex]) {
                const oldIndex      = this._selectedWarIndex;
                this._selectedWarIndex = newIndex;
                (datas[oldIndex])       && (this._listWar.updateSingleData(oldIndex, datas[oldIndex]));
                (oldIndex !== newIndex) && (this._listWar.updateSingleData(newIndex, datas[newIndex]));

                await this._showMap(newIndex);
            }
        }
        public getSelectedIndex(): number {
            return this._selectedWarIndex;
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Callbacks.
        ////////////////////////////////////////////////////////////////////////////////
        private _onNotifyMouseWheel(e: egret.Event): void {
            this._zoomMap.setZoomByScroll(StageManager.getMouseX(), StageManager.getMouseY(), e.data);
        }

        private _onNotifyGetWaitingCustomOnlineWarInfos(e: egret.Event): void {
            this._warInfos = ExitWarModel.getWarInfos();
            const newData  = this._createDataForListWar();
            if (newData.length > 0) {
                this._dataForListWar = newData;
                this._listWar.bindData(newData);
                this.setSelectedIndex(Math.floor(Math.random() * newData.length));
            }
        }

        private _onTouchBeginZoomMap(e: egret.TouchEvent): void {
            const touchesCount = Helpers.getKeysCount(this._currentTouchPoints);
            if (touchesCount <= 0) {
                this._zoomMap.addEventListener(egret.TouchEvent.TOUCH_MOVE, this._onTouchMoveZoomMap, this);
            }

            const touchId = e.touchPointID;
            if (touchesCount <= 1) {
                this._currentTouchPoints[touchId]  = { x: e.stageX, y: e.stageY };
                this._previousTouchPoints[touchId] = { x: e.stageX, y: e.stageY };
            }
        }

        private _onTouchEndZoomMap(e: egret.TouchEvent): void {
            delete this._currentTouchPoints[e.touchPointID];
            delete this._previousTouchPoints[e.touchPointID];

            if (Helpers.checkIsEmptyObject(this._currentTouchPoints)) {
                this._zoomMap.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this._onTouchMoveZoomMap, this);
            }
        }

        private _onTouchMoveZoomMap(e: egret.TouchEvent): void {
            const touchId = e.touchPointID;
            this._currentTouchPoints[touchId] = { x: e.stageX, y: e.stageY };

            if (Helpers.getKeysCount(this._currentTouchPoints) > 1) {
                this._zoomMap.setZoomByTouches(this._currentTouchPoints, this._previousTouchPoints);
            } else {
                const zoomMap = this._zoomMap;
                zoomMap.setContentX(zoomMap.getContentX() + e.stageX - this._previousTouchPoints[touchId].x, true);
                zoomMap.setContentY(zoomMap.getContentY() + e.stageY - this._previousTouchPoints[touchId].y, true);
            }

            this._previousTouchPoints[touchId] = { x: e.stageX, y: e.stageY };
        }

        private _onTouchTapBtnBack(e: egret.TouchEvent): void {
            ExitWarListPanel.close();
            Lobby.LobbyPanel.open();
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Private functions.
        ////////////////////////////////////////////////////////////////////////////////
        private _createDataForListWar(): DataForWarRenderer[] {
            const data: DataForWarRenderer[] = [];
            const infos = this._warInfos;
            if (infos) {
                for (let i = 0; i < infos.length; ++i) {
                    const info = infos[i];
                    data.push({
                        warName : info.warName || info.mapName,
                        index   : i,
                        panel   : this,
                    });
                }
            }

            return data;
        }

        private _createDataForListPlayer(warInfo: ProtoTypes.IWaitingCustomOnlineWarInfo, mapInfo: ProtoTypes.IMapInfo): DataForPlayerRenderer[] {
            const data: DataForPlayerRenderer[] = [
                {
                    playerIndex: 1,
                    playerName : warInfo.p1UserNickname,
                    teamIndex  : warInfo.p1TeamIndex,
                },
                {
                    playerIndex: 2,
                    playerName : warInfo.p2UserNickname,
                    teamIndex  : warInfo.p2TeamIndex,
                },
            ];
            if (mapInfo.playersCount >= 3) {
                data.push({
                    playerIndex: 3,
                    playerName : warInfo.p3UserNickname,
                    teamIndex  : warInfo.p3TeamIndex,
                });
            }
            if (mapInfo.playersCount >= 4) {
                data.push({
                    playerIndex: 4,
                    playerName : warInfo.p4UserNickname,
                    teamIndex  : warInfo.p4TeamIndex,
                });
            }

            return data;
        }

        private _createUnitViewDatas(unitViewIds: number[], mapWidth: number, mapHeight: number): Types.UnitViewData[] {
            const configVersion = Config.getLatestConfigVersion();
            const datas: Types.UnitViewData[] = [];

            let index  = 0;
            let unitId = 0;
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
                            unitId       : unitId,
                        });
                        ++unitId;
                    }
                }
            }
            return datas;
        }

        private async _showMap(index: number): Promise<void> {
            const warInfo = this._warInfos[index];
            const data    = await TemplateMapModel.getMapData(warInfo as Types.MapIndexKey);
            const mapInfo = TemplateMapModel.getMapInfo(warInfo as Types.MapIndexKey);

            this._labelMapName.text      = Lang.getFormatedText(Lang.FormatType.F000, mapInfo.mapName);
            this._labelDesigner.text     = Lang.getFormatedText(Lang.FormatType.F001, mapInfo.designer);
            this._listPlayer.bindData(this._createDataForListPlayer(warInfo, mapInfo));
            this._groupInfo.visible      = true;
            this._groupInfo.alpha        = 1;
            egret.Tween.removeTweens(this._groupInfo);
            egret.Tween.get(this._groupInfo).wait(5000).to({alpha: 0}, 1000).call(() => {this._groupInfo.visible = false; this._groupInfo.alpha = 1});

            const tileMapView = new OnlineWar.TileMapView();
            tileMapView.init(data.mapWidth, data.mapHeight);
            tileMapView.updateWithBaseViewIdArray(data.tileBases);
            tileMapView.updateWithObjectViewIdArray(data.tileObjects);

            const unitMapView = new OnlineWar.UnitMapView();
            unitMapView.initWithDatas(this._createUnitViewDatas(data.units, data.mapWidth, data.mapHeight));

            const gridSize = Config.getGridSize();
            this._zoomMap.removeAllContents();
            this._zoomMap.setContentWidth(data.mapWidth * gridSize.width);
            this._zoomMap.setContentHeight(data.mapHeight * gridSize.height);
            this._zoomMap.addContent(tileMapView);
            this._zoomMap.addContent(unitMapView);
            this._zoomMap.setContentScale(0, true);
        }
    }

    type DataForWarRenderer = {
        warName : string;
        index   : number;
        panel   : ExitWarListPanel;
    }

    class WarRenderer extends eui.ItemRenderer {
        private _btnChoose: GameUi.UiButton;
        private _btnNext  : GameUi.UiButton;
        private _labelName: GameUi.UiLabel;

        protected childrenCreated(): void {
            super.childrenCreated();

            this._btnChoose.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onTouchTapBtnChoose, this);
            this._btnNext.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onTouchTapBtnNext, this);
        }

        protected dataChanged(): void {
            super.dataChanged();

            const data = this.data as DataForWarRenderer;
            this.currentState    = data.index === data.panel.getSelectedIndex() ? Types.UiState.Down : Types.UiState.Up;
            this._labelName.text = data.warName;
        }

        private _onTouchTapBtnChoose(e: egret.TouchEvent): void {
            const data = this.data as DataForWarRenderer;
            data.panel.setSelectedIndex(data.index);
        }

        private _onTouchTapBtnNext(e: egret.TouchEvent): void {
            // TODO
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
            this._labelIndex.text = Helpers.getColorText(data.playerIndex);
            this._labelName.text  = data.playerName || "????";
            this._labelTeam.text  = data.teamIndex != null ? Helpers.getTeamText(data.teamIndex) : "??";
        }
    }
}
