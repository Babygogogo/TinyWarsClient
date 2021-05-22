
namespace TinyWars.MultiCustomRoom {
    import Notify           = Utility.Notify;
    import Types            = Utility.Types;
    import FlowManager      = Utility.FlowManager;
    import Helpers          = Utility.Helpers;
    import Lang             = Utility.Lang;
    import ProtoTypes       = Utility.ProtoTypes;
    import ConfigManager    = Utility.ConfigManager;
    import WarMapModel      = WarMap.WarMapModel;

    export class McrWatchOngoingWarsPanel extends GameUi.UiPanel<void> {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Scene;
        protected readonly _IS_EXCLUSIVE = true;

        private static _instance: McrWatchOngoingWarsPanel;

        private _labelMenuTitle     : GameUi.UiLabel;
        private _labelPlayersTitle  : GameUi.UiLabel;
        private _labelCommentTitle  : GameUi.UiLabel;
        private _listWar            : GameUi.UiScrollList<DataForWarRenderer>;
        private _labelNoWar         : GameUi.UiLabel;
        private _zoomMap            : GameUi.UiZoomableMap;
        private _btnBack            : GameUi.UiButton;

        private _groupInfo      : eui.Group;
        private _labelMapName   : GameUi.UiLabel;
        private _labelDesigner  : GameUi.UiLabel;
        private _labelHasFog    : GameUi.UiLabel;
        private _labelWarComment: GameUi.UiLabel;
        private _listPlayer     : GameUi.UiScrollList<DataForPlayerRenderer>;

        private _dataForListWar     : DataForWarRenderer[] = [];
        private _selectedWarIndex   : number;

        public static show(): void {
            if (!McrWatchOngoingWarsPanel._instance) {
                McrWatchOngoingWarsPanel._instance = new McrWatchOngoingWarsPanel();
            }
            McrWatchOngoingWarsPanel._instance.open(undefined);
        }
        public static async hide(): Promise<void> {
            if (McrWatchOngoingWarsPanel._instance) {
                await McrWatchOngoingWarsPanel._instance.close();
            }
        }

        public constructor() {
            super();

            this.skinName = "resource/skins/multiCustomRoom/McrWatchOngoingWarsPanel.exml";
        }

        protected _onOpened(): void {
            this._setNotifyListenerArray([
                { type: Notify.Type.LanguageChanged,                callback: this._onNotifyLanguageChanged },
                { type: Notify.Type.MsgMpwWatchGetOngoingWarInfos,    callback: this._onNotifySMcwWatchGetOngoingWarInfos },
                { type: Notify.Type.MsgMpwWatchContinueWar,           callback: this._onNotifySMcwWatchContinueWar },
                { type: Notify.Type.MsgMpwWatchContinueWarFailed,     callback: this._onNotifySMcwWatchContinueWarFailed },
            ]);
            this._setUiListenerArray([
                { ui: this._btnBack,   callback: this._onTouchTapBtnBack },
            ]);
            this._listWar.setItemRenderer(WarRenderer);
            this._listPlayer.setItemRenderer(PlayerRenderer);

            this._groupInfo.visible = false;
            this._updateComponentsForLanguage();

            MultiPlayerWar.MpwProxy.reqWatchGetOngoingWarInfos();
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

        private _onNotifySMcwWatchGetOngoingWarInfos(e: egret.Event): void {
            const newData        = this._createDataForListWar(MultiPlayerWar.MpwModel.getWatchOngoingWarInfos());
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

        private _onNotifySMcwWatchContinueWar(e: egret.Event): void {
            FlowManager.gotoMultiPlayerWar((e.data as ProtoTypes.NetMessage.MsgMpwWatchContinueWar.IS).war);
        }

        private _onNotifySMcwWatchContinueWarFailed(e: egret.Event): void {
            Common.CommonBlockPanel.hide();
            MultiPlayerWar.MpwProxy.reqWatchGetOngoingWarInfos();
        }

        private _onTouchTapBtnBack(e: egret.TouchEvent): void {
            this.close();
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
            const configVersion     = warInfo.settingsForCommon.configVersion;
            const playerInfoList    = warInfo.playerInfoList;
            const dataList          : DataForPlayerRenderer[] = [];
            for (let playerIndex = 1; playerIndex <= mapPlayersCount; ++playerIndex) {
                dataList.push({
                    configVersion,
                    playerInfo  : playerInfoList.find(v => v.playerIndex === playerIndex),
                })
            }

            return dataList;
        }

        private async _showMap(index: number): Promise<void> {
            const warInfo           = this._dataForListWar[index].info.warInfo;
            const settingsForMfw    = warInfo.settingsForMfw;
            if (settingsForMfw) {
                const warData               = settingsForMfw.initialWarData;
                this._labelMapName.text     = undefined;
                this._labelDesigner.text    = undefined;
                this._labelHasFog.text      = Lang.getFormattedText(Lang.Type.F0005, Lang.getText(warData.settingsForCommon.warRule.ruleForGlobalParams.hasFogByDefault ? Lang.Type.B0012 : Lang.Type.B0001));
                this._labelWarComment.text  = settingsForMfw.warComment || "----";
                this._listPlayer.bindData(this._createDataForListPlayer(warInfo, warData.playerManager.players.length - 1));
                this._zoomMap.showMapByWarData(warData);
            } else {
                const settingsForMcw        = warInfo.settingsForMcw;
                const mapId                 = settingsForMcw ? settingsForMcw.mapId : warInfo.settingsForMrw.mapId;
                const mapRawData            = await WarMapModel.getRawData(mapId);
                this._labelMapName.text     = Lang.getFormattedText(Lang.Type.F0000, await WarMapModel.getMapNameInCurrentLanguage(mapId));
                this._labelDesigner.text    = Lang.getFormattedText(Lang.Type.F0001, mapRawData.designerName);
                this._labelHasFog.text      = Lang.getFormattedText(Lang.Type.F0005, Lang.getText(warInfo.settingsForCommon.warRule.ruleForGlobalParams.hasFogByDefault ? Lang.Type.B0012 : Lang.Type.B0001));
                this._labelWarComment.text  = (settingsForMcw ? settingsForMcw.warComment : null) || "----";
                this._listPlayer.bindData(this._createDataForListPlayer(warInfo, mapRawData.playersCountUnneutral));
                this._zoomMap.showMapByMapData(mapRawData);
            }

            this._groupInfo.visible      = true;
            this._groupInfo.alpha        = 1;
            egret.Tween.removeTweens(this._groupInfo);
            egret.Tween.get(this._groupInfo).wait(8000).to({alpha: 0}, 1000).call(() => {this._groupInfo.visible = false; this._groupInfo.alpha = 1});
        }

        private _updateComponentsForLanguage(): void {
            this._labelMenuTitle.text       = Lang.getText(Lang.Type.B0222);
            this._labelNoWar.text           = Lang.getText(Lang.Type.B0210);
            this._labelPlayersTitle.text    = `${Lang.getText(Lang.Type.B0031)}:`;
            this._labelCommentTitle.text    = `${Lang.getText(Lang.Type.B0187)}:`;
            this._btnBack.label             = Lang.getText(Lang.Type.B0146);
        }
    }

    type DataForWarRenderer = {
        info    : ProtoTypes.MultiPlayerWar.IMpwWatchInfo;
        index   : number;
        panel   : McrWatchOngoingWarsPanel;
    }

    class WarRenderer extends GameUi.UiListItemRenderer<DataForWarRenderer> {
        private _btnChoose      : GameUi.UiButton;
        private _btnNext        : GameUi.UiButton;
        private _labelName      : GameUi.UiLabel;

        protected _onOpened(): void {
            this._setUiListenerArray([
                { ui: this._btnChoose,  callback: this._onTouchTapBtnChoose },
                { ui: this._btnNext,    callback: this._onTouchTapBtnNext },
            ]);
        }

        protected _onDataChanged(): void {
            const data              = this.data;
            const warInfo           = data.info.warInfo;
            this.currentState       = data.index === data.panel.getSelectedIndex() ? Types.UiState.Down : Types.UiState.Up;

            const labelName         = this._labelName;
            const settingsForMfw    = warInfo.settingsForMfw;
            if (settingsForMfw) {
                labelName.text = settingsForMfw.warName || `----`;
            } else {
                const settingsForMcw    = warInfo.settingsForMcw;
                const warName           = settingsForMcw ? settingsForMcw.warName : null;
                if (warName) {
                    labelName.text = warName;
                } else {
                    labelName.text = "";
                    WarMapModel.getMapNameInCurrentLanguage(settingsForMcw ? settingsForMcw.mapId : warInfo.settingsForMrw.mapId).then(v => labelName.text = v);
                }
            }
        }

        private _onTouchTapBtnChoose(e: egret.TouchEvent): void {
            const data = this.data;
            data.panel.setSelectedIndex(data.index);
        }

        private async _onTouchTapBtnNext(e: egret.TouchEvent): Promise<void> {
            MultiPlayerWar.MpwProxy.reqWatchContinueWar(this.data.info.warInfo.warId);
        }
    }

    type DataForPlayerRenderer = {
        playerInfo      : ProtoTypes.Structure.IWarPlayerInfo;
        configVersion   : string;
    }

    class PlayerRenderer extends GameUi.UiListItemRenderer<DataForPlayerRenderer> {
        private _labelName : GameUi.UiLabel;
        private _labelIndex: GameUi.UiLabel;
        private _labelTeam : GameUi.UiLabel;

        protected _onDataChanged(): void {
            const data              = this.data;
            const playerInfo        = data.playerInfo;
            this._labelIndex.text   = Lang.getPlayerForceName(playerInfo.playerIndex);
            this._labelTeam.text    = Lang.getPlayerTeamName(playerInfo.teamIndex);
            User.UserModel.getUserNickname(playerInfo.userId).then(name => {
                this._labelName.text = name + ConfigManager.getCoNameAndTierText(data.configVersion, playerInfo.coId);
            });
        }
    }
}
