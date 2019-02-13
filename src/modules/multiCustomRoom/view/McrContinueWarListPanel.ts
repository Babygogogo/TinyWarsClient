
namespace TinyWars.MultiCustomRoom {
    import Notify           = Utility.Notify;
    import Types            = Utility.Types;
    import StageManager     = Utility.StageManager;
    import FloatText        = Utility.FloatText;
    import Helpers          = Utility.Helpers;
    import Lang             = Utility.Lang;
    import ProtoTypes       = Utility.ProtoTypes;
    import TemplateMapModel = WarMap.WarMapModel;
    import TemplateMapProxy = WarMap.WarMapProxy;

    export class McrContinueWarListPanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Scene;
        protected readonly _IS_EXCLUSIVE = true;

        private static _instance: McrContinueWarListPanel;

        private _listWar   : GameUi.UiScrollList;
        private _labelNoWar: GameUi.UiLabel;
        private _zoomMap   : GameUi.UiZoomableComponent;
        private _btnBack   : GameUi.UiButton;

        private _groupInfo      : eui.Group;
        private _labelMapName   : GameUi.UiLabel;
        private _labelDesigner  : GameUi.UiLabel;
        private _labelHasFog    : GameUi.UiLabel;
        private _labelWarComment: GameUi.UiLabel;
        private _listPlayer     : GameUi.UiScrollList;

        private _currentTouchPoints : Types.TouchPoints = {};
        private _previousTouchPoints: Types.TouchPoints = {};
        private _dataForListWar     : DataForWarRenderer[] = [];
        private _dataForListPlayer  : DataForPlayerRenderer[] = [];
        private _selectedWarIndex   : number;

        public static show(): void {
            if (!McrContinueWarListPanel._instance) {
                McrContinueWarListPanel._instance = new McrContinueWarListPanel();
            }
            McrContinueWarListPanel._instance.open();
        }
        public static hide(): void {
            if (McrContinueWarListPanel._instance) {
                McrContinueWarListPanel._instance.close();
            }
        }

        public constructor() {
            super();

            this._setAutoAdjustHeightEnabled();
            this.skinName = "resource/skins/multiCustomRoom/McrContinueWarListPanel.exml";
        }

        protected _onFirstOpened(): void {
            this._notifyListeners = [
                { type: Notify.Type.MouseWheel,                 callback: this._onNotifyMouseWheel },
                { type: Notify.Type.SMcrGetJoinedOngoingInfos,  callback: this._onNotifySMcrGetJoinedOngoingInfos },
                { type: Notify.Type.SMcrExitWar,                callback: this._onNotifySMcrExitWar },
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

            McrProxy.reqGetJoinedOngoingInfos();
        }

        protected _onClosed(): void {
            this._zoomMap.removeAllContents();
            this._listWar.clear();
            this._listPlayer.clear();
            egret.Tween.removeTweens(this._groupInfo);
        }

        public async setSelectedIndex(newIndex: number): Promise<void> {
            const oldIndex         = this._selectedWarIndex;
            const datas            = this._dataForListWar;
            this._selectedWarIndex = datas[newIndex] ? newIndex : undefined;

            if (datas[oldIndex]) {
                this._listWar.updateSingleData(oldIndex, datas[oldIndex])
            };

            if (datas[newIndex]) {
                this._listWar.updateSingleData(newIndex, datas[newIndex]);
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
        private _onNotifyMouseWheel(e: egret.Event): void {
            this._zoomMap.setZoomByScroll(StageManager.getMouseX(), StageManager.getMouseY(), e.data);
        }

        private _onNotifySMcrGetJoinedOngoingInfos(e: egret.Event): void {
            const newData        = this._createDataForListWar(McrModel.getJoinedOngoingInfos());
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

        private _onNotifySMcrExitWar(e: egret.Event): void {
            FloatText.show(Lang.getText(Lang.BigType.B00, Lang.SubType.S16));
        }

        private _onTouchBeginZoomMap(e: egret.TouchEvent): void {
            const touchesCount = Helpers.getObjectKeysCount(this._currentTouchPoints);
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

            if (Helpers.getObjectKeysCount(this._currentTouchPoints) > 1) {
                this._zoomMap.setZoomByTouches(this._currentTouchPoints, this._previousTouchPoints);
            } else {
                const zoomMap = this._zoomMap;
                zoomMap.setContentX(zoomMap.getContentX() + e.stageX - this._previousTouchPoints[touchId].x, true);
                zoomMap.setContentY(zoomMap.getContentY() + e.stageY - this._previousTouchPoints[touchId].y, true);
            }

            this._previousTouchPoints[touchId] = { x: e.stageX, y: e.stageY };
        }

        private _onTouchTapBtnBack(e: egret.TouchEvent): void {
            McrContinueWarListPanel.hide();
            Lobby.LobbyPanel.show();
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Private functions.
        ////////////////////////////////////////////////////////////////////////////////
        private _createDataForListWar(infos: ProtoTypes.IMcwOngoingDetail[]): DataForWarRenderer[] {
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

        private _createDataForListPlayer(warInfo: ProtoTypes.IMcwOngoingDetail, mapInfo: ProtoTypes.IMapDynamicInfo): DataForPlayerRenderer[] {
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
            data[warInfo.playerIndexInTurn - 1].defeatTimestamp = warInfo.enterTurnTime + warInfo.timeLimit;

            return data;
        }

        private _createUnitViewDatas(unitViewIds: number[], mapWidth: number, mapHeight: number): Types.UnitViewData[] {
            const configVersion = ConfigManager.getNewestConfigVersion();
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
            const warInfo               = this._dataForListWar[index].warInfo;
            const [mapData, mapInfo]    = await Promise.all([TemplateMapModel.getMapData(warInfo as Types.MapIndexKey), TemplateMapModel.getMapDynamicInfoAsync(warInfo as Types.MapIndexKey)]);
            this._labelMapName.text     = Lang.getFormatedText(Lang.FormatType.F000, mapInfo.mapName);
            this._labelDesigner.text    = Lang.getFormatedText(Lang.FormatType.F001, mapInfo.mapDesigner);
            this._labelHasFog.text      = Lang.getFormatedText(Lang.FormatType.F005, Lang.getText(Lang.BigType.B01, warInfo.hasFog ? Lang.SubType.S12 : Lang.SubType.S13));
            this._labelWarComment.text  = warInfo.warComment || "----";
            this._listPlayer.bindData(this._createDataForListPlayer(warInfo, mapInfo));

            this._groupInfo.visible      = true;
            this._groupInfo.alpha        = 1;
            egret.Tween.removeTweens(this._groupInfo);
            egret.Tween.get(this._groupInfo).wait(8000).to({alpha: 0}, 1000).call(() => {this._groupInfo.visible = false; this._groupInfo.alpha = 1});

            const tileMapView = new MultiCustomWar.TileMapView();
            tileMapView.init(mapData.mapWidth, mapData.mapHeight);
            tileMapView.updateWithBaseViewIdArray(mapData.tileBases);
            tileMapView.updateWithObjectViewIdArray(mapData.tileObjects);

            const unitMapView = new MultiCustomWar.UnitMapView();
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

    type DataForWarRenderer = {
        warInfo : ProtoTypes.IMcwOngoingDetail;
        index   : number;
        panel   : McrContinueWarListPanel;
    }

    class WarRenderer extends eui.ItemRenderer {
        private _btnChoose      : GameUi.UiButton;
        private _btnNext        : GameUi.UiButton;
        private _labelName      : GameUi.UiLabel;
        private _labelInTurn    : GameUi.UiLabel;

        protected childrenCreated(): void {
            super.childrenCreated();

            this._btnChoose.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onTouchTapBtnChoose, this);
            this._btnNext.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onTouchTapBtnNext, this);
        }

        protected dataChanged(): void {
            super.dataChanged();

            const data      = this.data as DataForWarRenderer;
            const warInfo   = data.warInfo;
            this.currentState           = data.index === data.panel.getSelectedIndex() ? Types.UiState.Down : Types.UiState.Up;
            this._labelName.text        = warInfo.warName || warInfo.mapName;
            this._labelInTurn.visible   = this._checkIsInTurn(warInfo);
        }

        private _onTouchTapBtnChoose(e: egret.TouchEvent): void {
            const data = this.data as DataForWarRenderer;
            data.panel.setSelectedIndex(data.index);
        }

        private _onTouchTapBtnNext(e: egret.TouchEvent): void {
            const data = this.data as DataForWarRenderer;
            McrExitDetailPanel.show(data.warInfo);
        }

        private _checkIsInTurn(info: ProtoTypes.IMcwOngoingDetail): boolean {
            const userId        = User.UserModel.getUserId();
            const playerIndex   = info.playerIndexInTurn;
            return ((playerIndex === 1) && (userId === info.p1UserId))
                || ((playerIndex === 2) && (userId === info.p2UserId))
                || ((playerIndex === 3) && (userId === info.p3UserId))
                || ((playerIndex === 4) && (userId === info.p4UserId));
        }
    }

    type DataForPlayerRenderer = {
        playerIndex     : number;
        playerName      : string;
        teamIndex       : number;
        defeatTimestamp?: number;
    }

    class PlayerRenderer extends eui.ItemRenderer {
        private _labelName      : GameUi.UiLabel;
        private _labelIndex     : GameUi.UiLabel;
        private _labelTeam      : GameUi.UiLabel;

        protected dataChanged(): void {
            super.dataChanged();

            const data = this.data as DataForPlayerRenderer;
            if (data.defeatTimestamp != null) {
                const leftTime = data.defeatTimestamp - Time.TimeModel.getServerTimestamp();
                this._labelIndex.text       = Helpers.getColorText(data.playerIndex);
                this._labelIndex.textColor  = 0x00FF00;
                this._labelTeam.text        = Helpers.getTeamText(data.teamIndex);
                this._labelTeam.textColor   = 0x00FF00
                this._labelName.text        = data.playerName + (leftTime > 0
                    ? ` (${Lang.getText(Lang.BigType.B01, Lang.SubType.S27)}:${Helpers.getTimeText(leftTime)})`
                    : ` (${Lang.getText(Lang.BigType.B01, Lang.SubType.S28)})`);
                this._labelName.textColor   = 0x00FF00;
            } else {
                this._labelIndex.text       = Helpers.getColorText(data.playerIndex);
                this._labelIndex.textColor  = 0xFFFFFF;
                this._labelTeam.text        = Helpers.getTeamText(data.teamIndex);
                this._labelTeam.textColor   = 0xFFFFFF;
                this._labelName.text        = data.playerName;
                this._labelName.textColor   = 0xFFFFFF;
            }
        }
    }
}
