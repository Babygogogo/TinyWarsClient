
namespace TinyWars.MultiCustomRoom {
    import Notify           = Utility.Notify;
    import Types            = Utility.Types;
    import FloatText        = Utility.FloatText;
    import Helpers          = Utility.Helpers;
    import Lang             = Utility.Lang;
    import ProtoTypes       = Utility.ProtoTypes;
    import ConfigManager    = Utility.ConfigManager;
    import WarMapModel      = WarMap.WarMapModel;

    export class McrWatchDeleteWatcherWarsPanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Scene;
        protected readonly _IS_EXCLUSIVE = true;

        private static _instance: McrWatchDeleteWatcherWarsPanel;

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
            if (!McrWatchDeleteWatcherWarsPanel._instance) {
                McrWatchDeleteWatcherWarsPanel._instance = new McrWatchDeleteWatcherWarsPanel();
            }
            McrWatchDeleteWatcherWarsPanel._instance.open();
        }
        public static hide(): void {
            if (McrWatchDeleteWatcherWarsPanel._instance) {
                McrWatchDeleteWatcherWarsPanel._instance.close();
            }
        }

        public constructor() {
            super();

            this._setAutoAdjustHeightEnabled();
            this.skinName = "resource/skins/multiCustomRoom/McrWatchDeleteWatcherWarsPanel.exml";
        }

        protected _onFirstOpened(): void {
            this._notifyListeners = [
                { type: Notify.Type.LanguageChanged,                callback: this._onNotifyLanguageChanged },
                { type: Notify.Type.MsgMpwWatchGetWatchedWarInfos,    callback: this._onNotifySMcwWatchGetWatchedWarInfos },
                { type: Notify.Type.MsgMpwWatchDeleteWatcher,         callback: this._onNotifySMcwWatchDeleteWatcher },
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

            MultiPlayerWar.MpwProxy.reqWatchedWarInfos();
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

        private _onNotifySMcwWatchGetWatchedWarInfos(e: egret.Event): void {
            const newData        = this._createDataForListWar(MultiPlayerWar.MpwModel.getWatchedWarInfos());
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

        private _onNotifySMcwWatchDeleteWatcher(e: egret.Event): void {
            FloatText.show(Lang.getText(Lang.Type.A0062));
            MultiPlayerWar.MpwProxy.reqWatchedWarInfos();
        }

        private _onTouchTapBtnBack(e: egret.TouchEvent): void {
            McrWatchDeleteWatcherWarsPanel.hide();
            McrWatchMainMenuPanel.show();
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Private functions.
        ////////////////////////////////////////////////////////////////////////////////
        private _createDataForListWar(infos: ProtoTypes.MultiPlayerWar.IMpwWatchInfo[]): DataForWarRenderer[] {
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

        private _createDataForListPlayer(warInfo: ProtoTypes.MultiPlayerWar.IMpwWarInfo, mapPlayersCount: number): DataForPlayerRenderer[] {
            const configVersion = warInfo.settingsForCommon.configVersion;
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
            this._labelWarComment.text  = warInfo.settingsForMcw.warComment || "----";
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
            this._labelMenuTitle.text       = Lang.getText(Lang.Type.B0219);
            this._labelNoWar.text           = Lang.getText(Lang.Type.B0210);
            this._labelPlayersTitle.text    = `${Lang.getText(Lang.Type.B0031)}:`;
            this._labelCommentTitle.text    = `${Lang.getText(Lang.Type.B0187)}:`;
            this._btnBack.label             = Lang.getText(Lang.Type.B0146);
        }
    }

    type DataForWarRenderer = {
        info    : ProtoTypes.MultiPlayerWar.IMpwWatchInfo;
        index   : number;
        panel   : McrWatchDeleteWatcherWarsPanel;
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

            const warName = warInfo.settingsForMcw.warName;
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
            McrWatchDeleteWatcherDetailPanel.show((this.data as DataForWarRenderer).info);
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
