
import MpwModel                             from "../../multiPlayerWar/model/MpwModel";
import MpwProxy                             from "../../multiPlayerWar/model/MpwProxy";
import ConfigManager                        from "../../tools/helpers/ConfigManager";
import FloatText                            from "../../tools/helpers/FloatText";
import Types                                from "../../tools/helpers/Types";
import Lang                                 from "../../tools/lang/Lang";
import TwnsLangTextType                     from "../../tools/lang/LangTextType";
import TwnsNotifyType                       from "../../tools/notify/NotifyType";
import ProtoTypes                           from "../../tools/proto/ProtoTypes";
import TwnsUiButton                         from "../../tools/ui/UiButton";
import TwnsUiLabel                          from "../../tools/ui/UiLabel";
import TwnsUiListItemRenderer               from "../../tools/ui/UiListItemRenderer";
import TwnsUiPanel                          from "../../tools/ui/UiPanel";
import TwnsUiScrollList                     from "../../tools/ui/UiScrollList";
import TwnsUiZoomableMap                    from "../../tools/ui/UiZoomableMap";
import UserModel                            from "../../user/model/UserModel";
import WarMapModel                          from "../../warMap/model/WarMapModel";
import TwnsMcrWatchHandleRequestDetailPanel from "./McrWatchHandleRequestDetailPanel";
import TwnsMcrWatchMainMenuPanel            from "./McrWatchMainMenuPanel";

namespace TwnsMcrWatchHandleRequestWarsPanel {
    import McrWatchMainMenuPanel            = TwnsMcrWatchMainMenuPanel.McrWatchMainMenuPanel;
    import McrWatchHandleRequestDetailPanel = TwnsMcrWatchHandleRequestDetailPanel.McrWatchHandleRequestDetailPanel;
    import LangTextType                     = TwnsLangTextType.LangTextType;
    import NotifyType                       = TwnsNotifyType.NotifyType;

    export class McrWatchHandleRequestWarsPanel extends TwnsUiPanel.UiPanel<void> {
        protected readonly _LAYER_TYPE   = Types.LayerType.Scene;
        protected readonly _IS_EXCLUSIVE = true;

        private static _instance: McrWatchHandleRequestWarsPanel;

        private _labelMenuTitle     : TwnsUiLabel.UiLabel;
        private _labelPlayersTitle  : TwnsUiLabel.UiLabel;
        private _labelCommentTitle  : TwnsUiLabel.UiLabel;
        private _listWar            : TwnsUiScrollList.UiScrollList<DataForWarRenderer>;
        private _labelNoWar         : TwnsUiLabel.UiLabel;
        private _zoomMap            : TwnsUiZoomableMap.UiZoomableMap;
        private _btnBack            : TwnsUiButton.UiButton;

        private _groupInfo      : eui.Group;
        private _labelMapName   : TwnsUiLabel.UiLabel;
        private _labelDesigner  : TwnsUiLabel.UiLabel;
        private _labelHasFog    : TwnsUiLabel.UiLabel;
        private _labelWarComment: TwnsUiLabel.UiLabel;
        private _listPlayer     : TwnsUiScrollList.UiScrollList<DataForPlayerRenderer>;

        private _dataForListWar     : DataForWarRenderer[] = [];
        private _selectedWarIndex   : number;

        public static show(): void {
            if (!McrWatchHandleRequestWarsPanel._instance) {
                McrWatchHandleRequestWarsPanel._instance = new McrWatchHandleRequestWarsPanel();
            }
            McrWatchHandleRequestWarsPanel._instance.open(undefined);
        }
        public static async hide(): Promise<void> {
            if (McrWatchHandleRequestWarsPanel._instance) {
                await McrWatchHandleRequestWarsPanel._instance.close();
            }
        }

        public constructor() {
            super();

            this.skinName = "resource/skins/multiCustomRoom/McrWatchHandleRequestWarsPanel.exml";
        }

        protected _onOpened(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,                callback: this._onNotifyLanguageChanged },
                { type: NotifyType.MsgMpwWatchGetRequestedWarInfos,  callback: this._onNotifySMcwWatchGetRequestedWarInfos },
                { type: NotifyType.MsgMpwWatchHandleRequest,         callback: this._onNotifySMcwWatchHandleRequest },
            ]);
            this._setUiListenerArray([
                { ui: this._btnBack,   callback: this._onTouchTapBtnBack },
            ]);
            this._listWar.setItemRenderer(WarRenderer);
            this._listPlayer.setItemRenderer(PlayerRenderer);

            this._groupInfo.visible = false;
            this._updateComponentsForLanguage();

            MpwProxy.reqWatchRequestedWarInfos();
        }

        protected async _onClosed(): Promise<void> {
            egret.Tween.removeTweens(this._groupInfo);
        }

        public async setSelectedIndex(newIndex: number): Promise<void> {
            const oldIndex         = this._selectedWarIndex;
            const dataList         = this._dataForListWar;
            this._selectedWarIndex = dataList[newIndex] ? newIndex : undefined;

            if (dataList[oldIndex]) {
                this._listWar.updateSingleData(oldIndex, dataList[oldIndex]);
            }

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

        private _onNotifySMcwWatchGetRequestedWarInfos(e: egret.Event): void {
            const newData        = this._createDataForListWar(MpwModel.getWatchRequestedWarInfos());
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
            FloatText.show(Lang.getText(LangTextType.A0061));
            MpwProxy.reqWatchRequestedWarInfos();
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
                });
            }

            return dataList;
        }

        private async _showMap(index: number): Promise<void> {
            const warInfo               = this._dataForListWar[index].info.warInfo;
            const settingsForMfw    = warInfo.settingsForMfw;
            if (settingsForMfw) {
                const warData               = settingsForMfw.initialWarData;
                this._labelMapName.text     = undefined;
                this._labelDesigner.text    = undefined;
                this._labelHasFog.text      = Lang.getFormattedText(LangTextType.F0005, Lang.getText(warData.settingsForCommon.warRule.ruleForGlobalParams.hasFogByDefault ? LangTextType.B0012 : LangTextType.B0001));
                this._labelWarComment.text  = settingsForMfw.warComment || "----";
                this._listPlayer.bindData(this._createDataForListPlayer(warInfo, warData.playerManager.players.length - 1));
                this._zoomMap.showMapByWarData(warData);
            } else {
                const settingsForMcw        = warInfo.settingsForMcw;
                const mapId                 = settingsForMcw ? settingsForMcw.mapId : warInfo.settingsForMrw.mapId;
                const mapRawData            = await WarMapModel.getRawData(mapId);
                this._labelMapName.text     = Lang.getFormattedText(LangTextType.F0000, await WarMapModel.getMapNameInCurrentLanguage(mapId));
                this._labelDesigner.text    = Lang.getFormattedText(LangTextType.F0001, mapRawData.designerName);
                this._labelHasFog.text      = Lang.getFormattedText(LangTextType.F0005, Lang.getText(warInfo.settingsForCommon.warRule.ruleForGlobalParams.hasFogByDefault ? LangTextType.B0012 : LangTextType.B0001));
                this._labelWarComment.text  = (settingsForMcw ? settingsForMcw.warComment : null) || "----";
                this._listPlayer.bindData(this._createDataForListPlayer(warInfo, mapRawData.playersCountUnneutral));
                this._zoomMap.showMapByMapData(mapRawData);
            }

            this._groupInfo.visible      = true;
            this._groupInfo.alpha        = 1;
            egret.Tween.removeTweens(this._groupInfo);
            egret.Tween.get(this._groupInfo).wait(8000).to({alpha: 0}, 1000).call(() => {this._groupInfo.visible = false; this._groupInfo.alpha = 1;});
        }

        private _updateComponentsForLanguage(): void {
            this._labelMenuTitle.text       = Lang.getText(LangTextType.B0208);
            this._labelNoWar.text           = Lang.getText(LangTextType.B0209);
            this._labelPlayersTitle.text    = `${Lang.getText(LangTextType.B0031)}:`;
            this._labelCommentTitle.text    = `${Lang.getText(LangTextType.B0187)}:`;
            this._btnBack.label             = Lang.getText(LangTextType.B0146);
        }
    }

    type DataForWarRenderer = {
        info    : ProtoTypes.MultiPlayerWar.IMpwWatchInfo;
        index   : number;
        panel   : McrWatchHandleRequestWarsPanel;
    };
    class WarRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForWarRenderer> {
        private _btnChoose      : TwnsUiButton.UiButton;
        private _btnNext        : TwnsUiButton.UiButton;
        private _labelName      : TwnsUiLabel.UiLabel;

        protected _onOpened(): void {
            this._setUiListenerArray([
                { ui: this._btnChoose,  callback: this._onTouchTapBtnChoose },
                { ui: this._btnNext,    callback: this._onTouchTapBtnNext },
            ]);
        }

        protected _onDataChanged(): void {
            const data          = this.data;
            const warInfo       = data.info.warInfo;
            this.currentState   = data.index === data.panel.getSelectedIndex() ? Types.UiState.Down : Types.UiState.Up;

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
            McrWatchHandleRequestDetailPanel.show({ watchInfo: this.data.info });
        }
    }

    type DataForPlayerRenderer = {
        playerInfo      : ProtoTypes.Structure.IWarPlayerInfo;
        configVersion   : string;
    };
    class PlayerRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForPlayerRenderer> {
        private _labelName : TwnsUiLabel.UiLabel;
        private _labelIndex: TwnsUiLabel.UiLabel;
        private _labelTeam : TwnsUiLabel.UiLabel;

        protected _onDataChanged(): void {
            const data              = this.data;
            const playerInfo        = data.playerInfo;
            this._labelIndex.text   = Lang.getPlayerForceName(playerInfo.playerIndex);
            this._labelTeam.text    = Lang.getPlayerTeamName(playerInfo.teamIndex);
            UserModel.getUserNickname(playerInfo.userId).then(name => {
                this._labelName.text = name + ConfigManager.getCoNameAndTierText(data.configVersion, playerInfo.coId);
            });
        }
    }
}

export default TwnsMcrWatchHandleRequestWarsPanel;
