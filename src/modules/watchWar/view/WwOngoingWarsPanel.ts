
import TwnsCommonBlockPanel         from "../../common/view/CommonBlockPanel";
import TwnsLobbyBottomPanel         from "../../lobby/view/LobbyBottomPanel";
import TwnsLobbyTopPanel            from "../../lobby/view/LobbyTopPanel";
import ConfigManager                from "../../tools/helpers/ConfigManager";
import FlowManager                  from "../../tools/helpers/FlowManager";
import Logger                       from "../../tools/helpers/Logger";
import Types                        from "../../tools/helpers/Types";
import Lang                         from "../../tools/lang/Lang";
import TwnsLangTextType             from "../../tools/lang/LangTextType";
import TwnsNotifyType               from "../../tools/notify/NotifyType";
import ProtoTypes                   from "../../tools/proto/ProtoTypes";
import TwnsUiButton                 from "../../tools/ui/UiButton";
import TwnsUiLabel                  from "../../tools/ui/UiLabel";
import TwnsUiListItemRenderer       from "../../tools/ui/UiListItemRenderer";
import TwnsUiPanel                  from "../../tools/ui/UiPanel";
import TwnsUiScrollList             from "../../tools/ui/UiScrollList";
import TwnsUiZoomableMap            from "../../tools/ui/UiZoomableMap";
import UserModel                    from "../../user/model/UserModel";
import WarMapModel                  from "../../warMap/model/WarMapModel";
import WwModel                      from "../model/WwModel";
import WwProxy                      from "../model/WwProxy";
import TwnsWwMainMenuPanel          from "./WwMainMenuPanel";

namespace TwnsWwOngoingWarsPanel {
    import LangTextType             = TwnsLangTextType.LangTextType;
    import NotifyType               = TwnsNotifyType.NotifyType;
    import CommonBlockPanel         = TwnsCommonBlockPanel.CommonBlockPanel;

    export class McrWatchOngoingWarsPanel extends TwnsUiPanel.UiPanel<void> {
        protected readonly _LAYER_TYPE   = Types.LayerType.Scene;
        protected readonly _IS_EXCLUSIVE = true;

        private static _instance: McrWatchOngoingWarsPanel;

        private readonly _labelMenuTitle!       : TwnsUiLabel.UiLabel;
        private readonly _labelPlayersTitle!    : TwnsUiLabel.UiLabel;
        private readonly _labelCommentTitle!    : TwnsUiLabel.UiLabel;
        private readonly _listWar!              : TwnsUiScrollList.UiScrollList<DataForWarRenderer>;
        private readonly _labelNoWar!           : TwnsUiLabel.UiLabel;
        private readonly _zoomMap!              : TwnsUiZoomableMap.UiZoomableMap;
        private readonly _btnBack!              : TwnsUiButton.UiButton;

        private readonly _groupInfo!            : eui.Group;
        private readonly _labelMapName!         : TwnsUiLabel.UiLabel;
        private readonly _labelDesigner!        : TwnsUiLabel.UiLabel;
        private readonly _labelHasFog!          : TwnsUiLabel.UiLabel;
        private readonly _labelWarComment!      : TwnsUiLabel.UiLabel;
        private readonly _listPlayer!           : TwnsUiScrollList.UiScrollList<DataForPlayerRenderer>;

        private _dataForListWar     : DataForWarRenderer[] = [];
        private _selectedWarIndex   : number | undefined;

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

            this.skinName = "resource/skins/watchWar/WwOngoingWarsPanel.exml";
        }

        protected _onOpened(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,                 callback: this._onNotifyLanguageChanged },
                { type: NotifyType.MsgMpwWatchGetOngoingWarInfos,   callback: this._onNotifySMcwWatchGetOngoingWarInfos },
                { type: NotifyType.MsgMpwWatchContinueWar,          callback: this._onNotifySMcwWatchContinueWar },
                { type: NotifyType.MsgMpwWatchContinueWarFailed,    callback: this._onNotifySMcwWatchContinueWarFailed },
            ]);
            this._setUiListenerArray([
                { ui: this._btnBack,   callback: this._onTouchTapBtnBack },
            ]);
            this._listWar.setItemRenderer(WarRenderer);
            this._listPlayer.setItemRenderer(PlayerRenderer);

            this._groupInfo.visible = false;
            this._updateComponentsForLanguage();

            WwProxy.reqWatchGetOngoingWarInfos();
        }

        protected async _onClosed(): Promise<void> {
            egret.Tween.removeTweens(this._groupInfo);
        }

        public async setSelectedIndex(newIndex: number): Promise<void> {
            const oldIndex         = this._selectedWarIndex;
            const dataList         = this._dataForListWar;
            this._selectedWarIndex = dataList[newIndex] ? newIndex : undefined;

            if ((oldIndex != null) && (dataList[oldIndex])) {
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
        public getSelectedIndex(): number | undefined {
            return this._selectedWarIndex;
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Callbacks.
        ////////////////////////////////////////////////////////////////////////////////
        private _onNotifyLanguageChanged(): void {
            this._updateComponentsForLanguage();
        }

        private _onNotifySMcwWatchGetOngoingWarInfos(): void {
            const newData        = this._createDataForListWar(WwModel.getWatchOngoingWarInfos());
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
            const warData = (e.data as ProtoTypes.NetMessage.MsgMpwWatchContinueWar.IS).war;
            if (warData) {
                FlowManager.gotoMultiPlayerWar(warData);
            }
        }

        private _onNotifySMcwWatchContinueWarFailed(): void {
            CommonBlockPanel.hide();
            WwProxy.reqWatchGetOngoingWarInfos();
        }

        private _onTouchTapBtnBack(): void {
            this.close();
            TwnsLobbyTopPanel.LobbyTopPanel.show();
            TwnsLobbyBottomPanel.LobbyBottomPanel.show();
            TwnsWwMainMenuPanel.WwMainMenuPanel.show();
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Private functions.
        ////////////////////////////////////////////////////////////////////////////////
        private _createDataForListWar(infos: ProtoTypes.MultiPlayerWar.IMpwWatchInfo[] | null): DataForWarRenderer[] {
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
            const configVersion     = warInfo?.settingsForCommon?.configVersion;
            const playerInfoList    = warInfo.playerInfoList || [];
            const dataArray         : DataForPlayerRenderer[] = [];
            if (configVersion) {
                for (let playerIndex = 1; playerIndex <= mapPlayersCount; ++playerIndex) {
                    const playerInfo = playerInfoList.find(v => v.playerIndex === playerIndex);
                    if (playerInfo == null) {
                        Logger.error(`WwOngoingWarsPanel._createDataForListPlayer() empty playerInfo.`);
                        continue;
                    }
                    dataArray.push({
                        configVersion,
                        playerInfo,
                    });
                }
            }

            return dataArray;
        }

        private async _showMap(index: number): Promise<void> {
            const warInfo = this._dataForListWar[index].info.warInfo;
            if (warInfo == null) {
                Logger.error(`WwOngoingWarsPanel._showMap() empty warInfo.`);
                return;
            }

            const hasFogByDefault   = warInfo?.settingsForCommon?.warRule?.ruleForGlobalParams?.hasFogByDefault;
            const {
                settingsForMfw,
                settingsForCcw,
                settingsForMcw,
                settingsForMrw,
            } = warInfo;
            const labelMapName      = this._labelMapName;
            const labelDesigner     = this._labelDesigner;
            const labelHasFog       = this._labelHasFog;
            const labelWarComment   = this._labelWarComment;
            const listPlayer        = this._listPlayer;
            const zoomMap           = this._zoomMap;

            if (settingsForMfw) {
                const warData           = settingsForMfw.initialWarData;
                labelMapName.text       = ``;
                labelDesigner.text      = ``;
                labelHasFog.text        = Lang.getFormattedText(LangTextType.F0005, Lang.getText(hasFogByDefault ? LangTextType.B0012 : LangTextType.B0001));
                labelWarComment.text    = settingsForMfw.warComment || "----";
                listPlayer.bindData(this._createDataForListPlayer(warInfo, warData.playerManager.players.length - 1));
                zoomMap.showMapByWarData(warData);
            } else if (settingsForCcw) {
                const mapId             = settingsForCcw.mapId;
                const mapRawData        = await WarMapModel.getRawData(mapId);
                labelMapName.text       = Lang.getFormattedText(LangTextType.F0000, await WarMapModel.getMapNameInCurrentLanguage(mapId));
                labelDesigner.text      = Lang.getFormattedText(LangTextType.F0001, mapRawData.designerName);
                labelHasFog.text        = Lang.getFormattedText(LangTextType.F0005, Lang.getText(hasFogByDefault ? LangTextType.B0012 : LangTextType.B0001));
                labelWarComment.text    = settingsForCcw.warComment || "----";
                listPlayer.bindData(this._createDataForListPlayer(warInfo, mapRawData.playersCountUnneutral));
                zoomMap.showMapByMapData(mapRawData);
            } else if (settingsForMcw) {
                const mapId             = settingsForMcw.mapId;
                const mapRawData        = await WarMapModel.getRawData(mapId);
                labelMapName.text       = Lang.getFormattedText(LangTextType.F0000, await WarMapModel.getMapNameInCurrentLanguage(mapId));
                labelDesigner.text      = Lang.getFormattedText(LangTextType.F0001, mapRawData.designerName);
                labelHasFog.text        = Lang.getFormattedText(LangTextType.F0005, Lang.getText(hasFogByDefault ? LangTextType.B0012 : LangTextType.B0001));
                labelWarComment.text    = settingsForMcw.warComment || "----";
                listPlayer.bindData(this._createDataForListPlayer(warInfo, mapRawData.playersCountUnneutral));
                zoomMap.showMapByMapData(mapRawData);
            } else if (settingsForMrw) {
                const mapId             = settingsForMrw.mapId;
                const mapRawData        = await WarMapModel.getRawData(mapId);
                labelMapName.text       = Lang.getFormattedText(LangTextType.F0000, await WarMapModel.getMapNameInCurrentLanguage(mapId));
                labelDesigner.text      = Lang.getFormattedText(LangTextType.F0001, mapRawData.designerName);
                labelHasFog.text        = Lang.getFormattedText(LangTextType.F0005, Lang.getText(hasFogByDefault ? LangTextType.B0012 : LangTextType.B0001));
                labelWarComment.text    = "----";
                listPlayer.bindData(this._createDataForListPlayer(warInfo, mapRawData.playersCountUnneutral));
                zoomMap.showMapByMapData(mapRawData);
            }

            this._groupInfo.visible      = true;
            this._groupInfo.alpha        = 1;
            egret.Tween.removeTweens(this._groupInfo);
            egret.Tween.get(this._groupInfo).wait(8000).to({alpha: 0}, 1000).call(() => {this._groupInfo.visible = false; this._groupInfo.alpha = 1;});
        }

        private _updateComponentsForLanguage(): void {
            this._labelMenuTitle.text       = Lang.getText(LangTextType.B0222);
            this._labelNoWar.text           = Lang.getText(LangTextType.B0210);
            this._labelPlayersTitle.text    = `${Lang.getText(LangTextType.B0031)}:`;
            this._labelCommentTitle.text    = `${Lang.getText(LangTextType.B0187)}:`;
            this._btnBack.label             = Lang.getText(LangTextType.B0146);
        }
    }

    type DataForWarRenderer = {
        info    : ProtoTypes.MultiPlayerWar.IMpwWatchInfo;
        index   : number;
        panel   : McrWatchOngoingWarsPanel;
    };
    class WarRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForWarRenderer> {
        private readonly _btnChoose!    : TwnsUiButton.UiButton;
        private readonly _btnNext!      : TwnsUiButton.UiButton;
        private readonly _labelName!    : TwnsUiLabel.UiLabel;

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

        private _onTouchTapBtnChoose(): void {
            const data = this.data;
            data.panel.setSelectedIndex(data.index);
        }

        private async _onTouchTapBtnNext(): Promise<void> {
            WwProxy.reqWatchContinueWar(this.data.info.warInfo.warId);
        }
    }

    type DataForPlayerRenderer = {
        playerInfo      : ProtoTypes.Structure.IWarPlayerInfo;
        configVersion   : string;
    };

    class PlayerRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForPlayerRenderer> {
        private readonly _labelName!    : TwnsUiLabel.UiLabel;
        private readonly _labelIndex!   : TwnsUiLabel.UiLabel;
        private readonly _labelTeam!    : TwnsUiLabel.UiLabel;

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

export default TwnsWwOngoingWarsPanel;
