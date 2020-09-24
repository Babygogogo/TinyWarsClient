
namespace TinyWars.MultiCustomRoom {
    import Notify           = Utility.Notify;
    import Types            = Utility.Types;
    import FloatText        = Utility.FloatText;
    import Helpers          = Utility.Helpers;
    import Lang             = Utility.Lang;
    import ProtoTypes       = Utility.ProtoTypes;
    import ConfigManager    = Utility.ConfigManager;
    import WarMapModel      = WarMap.WarMapModel;

    export class McrWatchHandleRequestWarsPanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Scene;
        protected readonly _IS_EXCLUSIVE = true;

        private static _instance: McrWatchHandleRequestWarsPanel;

        private _labelMenuTitle     : GameUi.UiLabel;
        private _labelPlayersTitle  : GameUi.UiLabel;
        private _labelCommentTitle  : GameUi.UiLabel;
        private _listWar            : GameUi.UiScrollList;
        private _labelNoWar         : GameUi.UiLabel;
        private _zoomMap            : GameUi.UiZoomableComponent;
        private _btnBack            : GameUi.UiButton;

        private _groupInfo      : eui.Group;
        private _labelMapName   : GameUi.UiLabel;
        private _labelDesigner  : GameUi.UiLabel;
        private _labelHasFog    : GameUi.UiLabel;
        private _labelWarComment: GameUi.UiLabel;
        private _listPlayer     : GameUi.UiScrollList;

        private _dataForListWar     : DataForWarRenderer[] = [];
        private _selectedWarIndex   : number;

        public static show(): void {
            if (!McrWatchHandleRequestWarsPanel._instance) {
                McrWatchHandleRequestWarsPanel._instance = new McrWatchHandleRequestWarsPanel();
            }
            McrWatchHandleRequestWarsPanel._instance.open();
        }
        public static hide(): void {
            if (McrWatchHandleRequestWarsPanel._instance) {
                McrWatchHandleRequestWarsPanel._instance.close();
            }
        }

        public constructor() {
            super();

            this._setAutoAdjustHeightEnabled();
            this.skinName = "resource/skins/multiCustomRoom/McrWatchHandleRequestWarsPanel.exml";
        }

        protected _onFirstOpened(): void {
            this._notifyListeners = [
                { type: Notify.Type.LanguageChanged,                callback: this._onNotifyLanguageChanged },
                { type: Notify.Type.SMcwWatchGetRequestedWarInfos,  callback: this._onNotifySMcwWatchGetRequestedWarInfos },
                { type: Notify.Type.SMcwWatchHandleRequest,         callback: this._onNotifySMcwWatchHandleRequest },
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

            McrProxy.reqWatchRequestedWarInfos();
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
        private _onNotifyLanguageChanged(e: egret.Event): void {
            this._updateComponentsForLanguage();
        }

        private _onNotifySMcwWatchGetRequestedWarInfos(e: egret.Event): void {
            const newData        = this._createDataForListWar(McrModel.getWatchRequestedWarInfos());
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

        private _onNotifySMcwWatchHandleRequest(e: egret.Event): void {
            FloatText.show(Lang.getText(Lang.Type.A0061));
            McrProxy.reqWatchRequestedWarInfos();
        }

        private _onTouchTapBtnBack(e: egret.TouchEvent): void {
            McrWatchHandleRequestWarsPanel.hide();
            McrWatchMainMenuPanel.show()
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Private functions.
        ////////////////////////////////////////////////////////////////////////////////
        private _createDataForListWar(infos: ProtoTypes.MultiCustomWar.IMcwWatchInfo[]): DataForWarRenderer[] {
            const data: DataForWarRenderer[] = [];
            if (infos) {
                for (let i = 0; i < infos.length; ++i) {
                    data.push({
                        info    : infos[i],
                        index   : i,
                        panel   : this,
                    });
                }
            }

            return data;
        }

        private _createDataForListPlayer(warInfo: ProtoTypes.MultiCustomWar.IMcwWarInfo, mapPlayersCount: number): DataForPlayerRenderer[] {
            const configVersion     = warInfo.settingsForCommon.configVersion;
            const playerInfoList    = warInfo.playerInfoList;
            const dataList          : DataForPlayerRenderer[] = [];
            for (let playerIndex = 1; playerIndex <= mapPlayersCount; ++playerIndex) {
                dataList.push({
                    configVersion,
                    playerInfo  : playerInfoList.find(v => v.playerIndex === playerIndex),
                });
            }

            return dataList;
        }

        private async _showMap(index: number): Promise<void> {
            const warInfo               = this._dataForListWar[index].info.warInfo;
            const settingsForCommon     = warInfo.settingsForCommon;
            const mapId                 = settingsForCommon.mapId;
            const mapRawData            = await WarMapModel.getRawData(mapId);
            this._labelMapName.text     = Lang.getFormattedText(Lang.Type.F0000, await WarMapModel.getMapNameInCurrentLanguage(mapId));
            this._labelDesigner.text    = Lang.getFormattedText(Lang.Type.F0001, mapRawData.designerName);
            this._labelHasFog.text      = Lang.getFormattedText(Lang.Type.F0005, Lang.getText(settingsForCommon.warRule.ruleForGlobalParams.hasFogByDefault ? Lang.Type.B0012 : Lang.Type.B0001));
            this._labelWarComment.text  = warInfo.settingsForMultiPlayer.warComment || "----";
            this._listPlayer.bindData(this._createDataForListPlayer(warInfo, mapRawData.playersCount));

            this._groupInfo.visible      = true;
            this._groupInfo.alpha        = 1;
            egret.Tween.removeTweens(this._groupInfo);
            egret.Tween.get(this._groupInfo).wait(8000).to({alpha: 0}, 1000).call(() => {this._groupInfo.visible = false; this._groupInfo.alpha = 1});

            const tileMapView = new WarMap.WarMapTileMapView();
            tileMapView.init(mapRawData.mapWidth, mapRawData.mapHeight);
            tileMapView.updateWithTileDataList(mapRawData.tileDataList);

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

        private _updateComponentsForLanguage(): void {
            this._labelMenuTitle.text       = Lang.getText(Lang.Type.B0208);
            this._labelNoWar.text           = Lang.getText(Lang.Type.B0209);
            this._labelPlayersTitle.text    = `${Lang.getText(Lang.Type.B0031)}:`;
            this._labelCommentTitle.text    = `${Lang.getText(Lang.Type.B0187)}:`;
            this._btnBack.label             = Lang.getText(Lang.Type.B0146);
        }
    }

    type DataForWarRenderer = {
        info    : ProtoTypes.MultiCustomWar.IMcwWatchInfo;
        index   : number;
        panel   : McrWatchHandleRequestWarsPanel;
    }

    class WarRenderer extends eui.ItemRenderer {
        private _btnChoose      : GameUi.UiButton;
        private _btnNext        : GameUi.UiButton;
        private _labelName      : GameUi.UiLabel;

        protected childrenCreated(): void {
            super.childrenCreated();

            this._btnChoose.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onTouchTapBtnChoose, this);
            this._btnNext.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onTouchTapBtnNext, this);
        }

        protected dataChanged(): void {
            super.dataChanged();

            const data          = this.data as DataForWarRenderer;
            const warInfo       = data.info.warInfo;
            this.currentState   = data.index === data.panel.getSelectedIndex() ? Types.UiState.Down : Types.UiState.Up;

            const warName = warInfo.settingsForMultiPlayer.warName;
            if (warName) {
                this._labelName.text = warName;
            } else {
                WarMapModel.getMapNameInCurrentLanguage(warInfo.settingsForCommon.mapId).then(v => this._labelName.text = v);
            }
        }

        private _onTouchTapBtnChoose(e: egret.TouchEvent): void {
            const data = this.data as DataForWarRenderer;
            data.panel.setSelectedIndex(data.index);
        }

        private async _onTouchTapBtnNext(e: egret.TouchEvent): Promise<void> {
            McrWatchHandleRequestDetailPanel.show((this.data as DataForWarRenderer).info);
        }
    }

    type DataForPlayerRenderer = {
        playerInfo      : ProtoTypes.Structure.IWarPlayerInfo;
        configVersion   : string;
    }

    class PlayerRenderer extends eui.ItemRenderer {
        private _labelName : GameUi.UiLabel;
        private _labelIndex: GameUi.UiLabel;
        private _labelTeam : GameUi.UiLabel;

        protected dataChanged(): void {
            super.dataChanged();

            const data              = this.data as DataForPlayerRenderer;
            const playerInfo        = data.playerInfo;
            this._labelIndex.text   = Lang.getPlayerForceName(playerInfo.playerIndex);
            this._labelTeam.text    = Lang.getPlayerTeamName(playerInfo.teamIndex);
            User.UserModel.getUserNickname(playerInfo.userId).then(name => {
                this._labelName.text = name + ConfigManager.getCoNameAndTierText(data.configVersion, playerInfo.coId);
            });
        }
    }
}
