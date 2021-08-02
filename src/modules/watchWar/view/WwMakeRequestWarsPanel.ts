
import TwnsLobbyBottomPanel                 from "../../lobby/view/LobbyBottomPanel";
import TwnsLobbyTopPanel                    from "../../lobby/view/LobbyTopPanel";
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
import WwModel                              from "../model/WwModel";
import WwProxy                              from "../model/WwProxy";
import TwnsWwMainMenuPanel                  from "./WwMainMenuPanel";
import TwnsWwMakeRequestDetailPanel         from "./WwMakeRequestDetailPanel";

namespace TwnsWwMakeRequestWarsPanel {
    import McrWatchMakeRequestDetailPanel   = TwnsWwMakeRequestDetailPanel.WwMakeRequestDetailPanel;
    import LangTextType                     = TwnsLangTextType.LangTextType;
    import NotifyType                       = TwnsNotifyType.NotifyType;

    export class WwMakeRequestWarsPanel extends TwnsUiPanel.UiPanel<void> {
        protected readonly _LAYER_TYPE   = Types.LayerType.Scene;
        protected readonly _IS_EXCLUSIVE = true;

        private static _instance: WwMakeRequestWarsPanel;

        private _labelPlayersTitle  : TwnsUiLabel.UiLabel;
        private _labelCommentTitle  : TwnsUiLabel.UiLabel;
        private _labelMenuTitle     : TwnsUiLabel.UiLabel;
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
            if (!WwMakeRequestWarsPanel._instance) {
                WwMakeRequestWarsPanel._instance = new WwMakeRequestWarsPanel();
            }
            WwMakeRequestWarsPanel._instance.open(undefined);
        }
        public static async hide(): Promise<void> {
            if (WwMakeRequestWarsPanel._instance) {
                await WwMakeRequestWarsPanel._instance.close();
            }
        }

        public constructor() {
            super();

            this.skinName = "resource/skins/watchWar/WwMakeRequestWarsPanel.exml";
        }

        protected _onOpened(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,                callback: this._onNotifyLanguageChanged },
                { type: NotifyType.MsgMpwWatchGetUnwatchedWarInfos,  callback: this._onNotifySMcwWatchGetUnwatchedWarInfos },
                { type: NotifyType.MsgMpwWatchMakeRequest,           callback: this._onNotifySMcwWatchMakeRequest },
            ]);
            this._setUiListenerArray([
                { ui: this._btnBack,   callback: this._onTouchTapBtnBack },
            ]);
            this._listWar.setItemRenderer(WarRenderer);
            this._listPlayer.setItemRenderer(PlayerRenderer);

            this._groupInfo.visible = false;
            this._updateComponentsForLanguage();

            WwProxy.reqUnwatchedWarInfos();
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
        private _onNotifyLanguageChanged(): void {
            this._updateComponentsForLanguage();
        }

        private _onNotifySMcwWatchGetUnwatchedWarInfos(): void {
            const newData        = this._createDataForListWar(WwModel.getUnwatchedWarInfos());
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

        private _onNotifySMcwWatchMakeRequest(): void {
            FloatText.show(Lang.getText(LangTextType.A0060));
            WwProxy.reqUnwatchedWarInfos();
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
            const warInfo           = this._dataForListWar[index].info.warInfo;
            const hasFogByDefault   = warInfo.settingsForCommon.warRule.ruleForGlobalParams.hasFogByDefault;
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
                labelMapName.text       = undefined;
                labelDesigner.text      = undefined;
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

            const groupInfo     = this._groupInfo;
            groupInfo.visible   = true;
            groupInfo.alpha     = 1;
            egret.Tween.removeTweens(groupInfo);
            egret.Tween.get(groupInfo)
                .wait(8000)
                .to({alpha: 0}, 1000)
                .call(() => {
                    groupInfo.visible = false;
                    groupInfo.alpha = 1;
                });
        }

        private _updateComponentsForLanguage(): void {
            this._labelMenuTitle.text       = Lang.getText(LangTextType.B0207);
            this._labelPlayersTitle.text    = `${Lang.getText(LangTextType.B0031)}:`;
            this._labelCommentTitle.text    = `${Lang.getText(LangTextType.B0187)}:`;
            this._btnBack.label             = Lang.getText(LangTextType.B0146);
            this._labelNoWar.text           = Lang.getText(LangTextType.B0210);
        }
    }

    type DataForWarRenderer = {
        info    : ProtoTypes.MultiPlayerWar.IMpwWatchInfo;
        index   : number;
        panel   : WwMakeRequestWarsPanel;
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
            this.currentState   = data.index === data.panel.getSelectedIndex() ? Types.UiState.Down : Types.UiState.Up;
            this._updateLabelName();
        }

        private _onTouchTapBtnChoose(): void {
            const data = this.data;
            data.panel.setSelectedIndex(data.index);
        }

        private async _onTouchTapBtnNext(): Promise<void> {
            McrWatchMakeRequestDetailPanel.show({ watchInfo: this.data.info });
        }

        private async _updateLabelName(): Promise<void> {
            const warInfo   = this.data.info.warInfo;
            const labelName = this._labelName;
            labelName.text  = ``;

            const { settingsForMfw, settingsForCcw, settingsForMcw, settingsForMrw } = warInfo;
            if (settingsForMfw) {
                labelName.text = settingsForMfw.warName || `----`;
            } else if (settingsForMcw) {
                labelName.text = settingsForMcw.warName || await WarMapModel.getMapNameInCurrentLanguage(settingsForMcw.mapId);
            } else if (settingsForCcw) {
                labelName.text = settingsForCcw.warName || await WarMapModel.getMapNameInCurrentLanguage(settingsForCcw.mapId);
            } else if (settingsForMrw) {
                labelName.text = await WarMapModel.getMapNameInCurrentLanguage(settingsForMrw.mapId);
            }
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
                this._labelName.text = `${name} ${ConfigManager.getCoNameAndTierText(data.configVersion, playerInfo.coId)}`;
            });
        }
    }
}

export default TwnsWwMakeRequestWarsPanel;
