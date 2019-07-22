
namespace TinyWars.MultiCustomRoom {
    import Notify           = Utility.Notify;
    import Types            = Utility.Types;
    import FloatText        = Utility.FloatText;
    import Helpers          = Utility.Helpers;
    import Lang             = Utility.Lang;
    import ProtoTypes       = Utility.ProtoTypes;
    import TemplateMapModel = WarMap.WarMapModel;

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

        private _dataForListWar     : DataForWarRenderer[] = [];
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
                { type: Notify.Type.SMcrGetJoinedOngoingInfos,  callback: this._onNotifySMcrGetJoinedOngoingInfos },
                { type: Notify.Type.SMcrExitWar,                callback: this._onNotifySMcrExitWar },
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
            McrProxy.reqGetJoinedOngoingInfos();
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
            FloatText.show(Lang.getText(Lang.Type.A0016));
        }

        private _onTouchTapBtnBack(e: egret.TouchEvent): void {
            McrContinueWarListPanel.hide();
            McrMainMenuPanel.show();
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
                    playerIndex : 1,
                    playerName  : warInfo.p1UserNickname,
                    teamIndex   : warInfo.p1TeamIndex,
                    isAlive     : warInfo.p1IsAlive,
                },
                {
                    playerIndex : 2,
                    playerName  : warInfo.p2UserNickname,
                    teamIndex   : warInfo.p2TeamIndex,
                    isAlive     : warInfo.p2IsAlive,
                },
            ];
            if (mapInfo.playersCount >= 3) {
                data.push({
                    playerIndex : 3,
                    playerName  : warInfo.p3UserNickname,
                    teamIndex   : warInfo.p3TeamIndex,
                    isAlive     : warInfo.p3IsAlive,
                });
            }
            if (mapInfo.playersCount >= 4) {
                data.push({
                    playerIndex : 4,
                    playerName  : warInfo.p4UserNickname,
                    teamIndex   : warInfo.p4TeamIndex,
                    isAlive     : warInfo.p4IsAlive,
                });
            }
            data[warInfo.playerIndexInTurn - 1].defeatTimestamp = warInfo.enterTurnTime + warInfo.timeLimit;

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

        private async _showMap(index: number): Promise<void> {
            const warInfo               = this._dataForListWar[index].warInfo;
            const [mapData, mapInfo]    = await Promise.all([TemplateMapModel.getMapData(warInfo as Types.MapIndexKey), TemplateMapModel.getMapDynamicInfoAsync(warInfo as Types.MapIndexKey)]);
            this._labelMapName.text     = Lang.getFormatedText(Lang.Type.F0000, mapInfo.mapName);
            this._labelDesigner.text    = Lang.getFormatedText(Lang.Type.F0001, mapInfo.mapDesigner);
            this._labelHasFog.text      = Lang.getFormatedText(Lang.Type.F0005, Lang.getText(warInfo.hasFog ? Lang.Type.B0012 : Lang.Type.B0013));
            this._labelWarComment.text  = warInfo.warComment || "----";
            this._listPlayer.bindData(this._createDataForListPlayer(warInfo, mapInfo));

            this._groupInfo.visible      = true;
            this._groupInfo.alpha        = 1;
            egret.Tween.removeTweens(this._groupInfo);
            egret.Tween.get(this._groupInfo).wait(8000).to({alpha: 0}, 1000).call(() => {this._groupInfo.visible = false; this._groupInfo.alpha = 1});

            const tileMapView = new WarMap.WarMapTileMapView();
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
            McrContinueDetailPanel.show(data.warInfo);
        }

        private _checkIsInTurn(info: ProtoTypes.IMcwOngoingDetail): boolean {
            const userId        = User.UserModel.getSelfUserId();
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
        isAlive         : boolean;
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
                this._labelIndex.text       = Helpers.getColorTextForPlayerIndex(data.playerIndex);
                this._labelIndex.textColor  = 0x00FF00;
                this._labelTeam.text        = Helpers.getTeamText(data.teamIndex);
                this._labelTeam.textColor   = 0x00FF00
                this._labelName.text        = data.playerName + (leftTime > 0
                    ? ` (${Lang.getText(Lang.Type.B0027)}:${Helpers.getTimeDurationText(leftTime)})`
                    : ` (${Lang.getText(Lang.Type.B0028)})`);
                this._labelName.textColor   = 0x00FF00;
            } else {
                this._labelIndex.text       = Helpers.getColorTextForPlayerIndex(data.playerIndex);
                this._labelIndex.textColor  = 0xFFFFFF;
                this._labelTeam.text        = Helpers.getTeamText(data.teamIndex);
                this._labelTeam.textColor   = 0xFFFFFF;
                this._labelName.text        = data.isAlive
                    ? data.playerName
                    : `${data.playerName} (${Lang.getText(Lang.Type.B0056)})`;
                this._labelName.textColor   = 0xFFFFFF;
            }
        }
    }
}
