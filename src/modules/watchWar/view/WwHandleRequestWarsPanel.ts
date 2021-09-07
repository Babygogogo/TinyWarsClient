
import TwnsLobbyBottomPanel                 from "../../lobby/view/LobbyBottomPanel";
import TwnsLobbyTopPanel                    from "../../lobby/view/LobbyTopPanel";
import CommonConstants                      from "../../tools/helpers/CommonConstants";
import CompatibilityHelpers from "../../tools/helpers/CompatibilityHelpers";
import ConfigManager                        from "../../tools/helpers/ConfigManager";
import FloatText                            from "../../tools/helpers/FloatText";
import Helpers                              from "../../tools/helpers/Helpers";
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
import TwnsWwHandleRequestDetailPanel       from "./WwHandleRequestDetailPanel";
import TwnsWwMainMenuPanel                  from "./WwMainMenuPanel";

namespace TwnsWwHandleRequestWarsPanel {
    import McrWatchHandleRequestDetailPanel = TwnsWwHandleRequestDetailPanel.WwHandleRequestDetailPanel;
    import LangTextType                     = TwnsLangTextType.LangTextType;
    import NotifyType                       = TwnsNotifyType.NotifyType;

    export class WwHandleRequestWarsPanel extends TwnsUiPanel.UiPanel<void> {
        protected readonly _LAYER_TYPE   = Types.LayerType.Scene;
        protected readonly _IS_EXCLUSIVE = true;

        private static _instance: WwHandleRequestWarsPanel;

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
        private _selectedWarIndex   : number | null = null;

        public static show(): void {
            if (!WwHandleRequestWarsPanel._instance) {
                WwHandleRequestWarsPanel._instance = new WwHandleRequestWarsPanel();
            }
            WwHandleRequestWarsPanel._instance.open();
        }
        public static async hide(): Promise<void> {
            if (WwHandleRequestWarsPanel._instance) {
                await WwHandleRequestWarsPanel._instance.close().catch(err => { CompatibilityHelpers.showError(err); throw err; });
            }
        }

        public constructor() {
            super();

            this.skinName = "resource/skins/watchWar/WwHandleRequestWarsPanel.exml";
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

            WwProxy.reqWatchRequestedWarInfos();
        }

        protected async _onClosed(): Promise<void> {
            egret.Tween.removeTweens(this._groupInfo);
        }

        public async setSelectedIndex(newIndex: number): Promise<void> {
            const oldIndex         = this._selectedWarIndex;
            const dataList         = this._dataForListWar;
            this._selectedWarIndex = dataList[newIndex] ? newIndex : null;

            if ((oldIndex != null) && (dataList[oldIndex])) {
                this._listWar.updateSingleData(oldIndex, dataList[oldIndex]);
            }

            if (dataList[newIndex]) {
                this._listWar.updateSingleData(newIndex, dataList[newIndex]);
                await this._showMap(newIndex).catch(err => { CompatibilityHelpers.showError(err); throw err; });
            } else {
                this._zoomMap.clearMap();
                this._groupInfo.visible = false;
            }
        }
        public getSelectedIndex(): number | null {
            return this._selectedWarIndex;
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Callbacks.
        ////////////////////////////////////////////////////////////////////////////////
        private _onNotifyLanguageChanged(): void {
            this._updateComponentsForLanguage();
        }

        private _onNotifySMcwWatchGetRequestedWarInfos(): void {
            const newData        = this._createDataForListWar(WwModel.getWatchRequestedWarInfos());
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

        private _onNotifySMcwWatchHandleRequest(): void {
            FloatText.show(Lang.getText(LangTextType.A0061));
            WwProxy.reqWatchRequestedWarInfos();
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
        private _createDataForListWar(infos: Types.Undefinable<ProtoTypes.MultiPlayerWar.IMpwWatchInfo[]>): DataForWarRenderer[] {
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

        private _createDataForListPlayer(warInfo: ProtoTypes.MultiPlayerWar.IMpwWarInfo, playersCountUnneutral: Types.Undefinable<number>): DataForPlayerRenderer[] {
            const configVersion = warInfo.settingsForCommon?.configVersion;
            if (configVersion == null) {
                return [];
            }

            if (playersCountUnneutral == null) {
                return [];
            }

            const playerInfoList    = warInfo.playerInfoList || [];
            const dataArray         : DataForPlayerRenderer[] = [];
            for (let playerIndex = 1; playerIndex <= playersCountUnneutral; ++playerIndex) {
                const playerInfo = playerInfoList.find(v => v.playerIndex === playerIndex);
                if (playerInfo) {
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
                throw new Error(`WwMakeRequestWarsPanel._showMap() empty warInfo.`);
            }

            const hasFogByDefault   = warInfo.settingsForCommon?.warRule?.ruleForGlobalParams?.hasFogByDefault;
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
                const playersCount      = warData?.playerManager?.players?.length;
                labelMapName.text       = ``;
                labelDesigner.text      = ``;
                labelHasFog.text        = Lang.getFormattedText(LangTextType.F0005, Lang.getText(hasFogByDefault ? LangTextType.B0012 : LangTextType.B0001));
                labelWarComment.text    = settingsForMfw.warComment || "----";
                listPlayer.bindData(playersCount != null ? this._createDataForListPlayer(warInfo, playersCount - 1) : []);
                if (warData) {
                    zoomMap.showMapByWarData(warData, null);
                } else {
                    zoomMap.clearMap();
                }

            } else if (settingsForCcw) {
                const mapId             = settingsForCcw.mapId;
                const mapRawData        = mapId == null ? null : await WarMapModel.getRawData(mapId).catch(err => { CompatibilityHelpers.showError(err); throw err; });
                labelMapName.text       = Lang.getFormattedText(LangTextType.F0000, mapId == null ? CommonConstants.ErrorTextForUndefined : await WarMapModel.getMapNameInCurrentLanguage(mapId).catch(err => { CompatibilityHelpers.showError(err); throw err; }));
                labelDesigner.text      = Lang.getFormattedText(LangTextType.F0001, mapRawData?.designerName || CommonConstants.ErrorTextForUndefined);
                labelHasFog.text        = Lang.getFormattedText(LangTextType.F0005, Lang.getText(hasFogByDefault ? LangTextType.B0012 : LangTextType.B0001));
                labelWarComment.text    = settingsForCcw.warComment || "----";
                listPlayer.bindData(this._createDataForListPlayer(warInfo, mapRawData?.playersCountUnneutral));
                if (mapRawData) {
                    zoomMap.showMapByMapData(mapRawData);
                } else {
                    zoomMap.clearMap();
                }

            } else if (settingsForMcw) {
                const mapId             = settingsForMcw.mapId;
                const mapRawData        = mapId == null ? null : await WarMapModel.getRawData(mapId).catch(err => { CompatibilityHelpers.showError(err); throw err; });
                labelMapName.text       = Lang.getFormattedText(LangTextType.F0000, mapId == null ? CommonConstants.ErrorTextForUndefined : await WarMapModel.getMapNameInCurrentLanguage(mapId).catch(err => { CompatibilityHelpers.showError(err); throw err; }));
                labelDesigner.text      = Lang.getFormattedText(LangTextType.F0001, mapRawData?.designerName || CommonConstants.ErrorTextForUndefined);
                labelHasFog.text        = Lang.getFormattedText(LangTextType.F0005, Lang.getText(hasFogByDefault ? LangTextType.B0012 : LangTextType.B0001));
                labelWarComment.text    = settingsForMcw.warComment || "----";
                listPlayer.bindData(this._createDataForListPlayer(warInfo, mapRawData?.playersCountUnneutral));
                if (mapRawData) {
                    zoomMap.showMapByMapData(mapRawData);
                } else {
                    zoomMap.clearMap();
                }

            } else if (settingsForMrw) {
                const mapId             = settingsForMrw.mapId;
                const mapRawData        = mapId == null ? null : await WarMapModel.getRawData(mapId).catch(err => { CompatibilityHelpers.showError(err); throw err; });
                labelMapName.text       = Lang.getFormattedText(LangTextType.F0000, mapId == null ? CommonConstants.ErrorTextForUndefined : await WarMapModel.getMapNameInCurrentLanguage(mapId).catch(err => { CompatibilityHelpers.showError(err); throw err; }));
                labelDesigner.text      = Lang.getFormattedText(LangTextType.F0001, mapRawData?.designerName || CommonConstants.ErrorTextForUndefined);
                labelHasFog.text        = Lang.getFormattedText(LangTextType.F0005, Lang.getText(hasFogByDefault ? LangTextType.B0012 : LangTextType.B0001));
                labelWarComment.text    = "----";
                listPlayer.bindData(this._createDataForListPlayer(warInfo, mapRawData?.playersCountUnneutral));
                if (mapRawData) {
                    zoomMap.showMapByMapData(mapRawData);
                } else {
                    zoomMap.clearMap();
                }
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
        panel   : WwHandleRequestWarsPanel;
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
            const data          = this._getData();
            this.currentState   = data.index === data.panel.getSelectedIndex() ? Types.UiState.Down : Types.UiState.Up;
            this._updateLabelName();
        }

        private _onTouchTapBtnChoose(): void {
            const data = this._getData();
            data.panel.setSelectedIndex(data.index);
        }

        private async _onTouchTapBtnNext(): Promise<void> {
            McrWatchHandleRequestDetailPanel.show({ watchInfo: this._getData().info });
        }

        private async _updateLabelName(): Promise<void> {
            const labelName = this._labelName;
            labelName.text  = ``;

            const warInfo = this._getData().info.warInfo;
            if (warInfo != null) {
                const { settingsForMfw, settingsForCcw, settingsForMcw, settingsForMrw } = warInfo;
                if (settingsForMfw) {
                    labelName.text = settingsForMfw.warName || `----`;

                } else if (settingsForMcw) {
                    const warName = settingsForMcw.warName;
                    if (warName) {
                        labelName.text = warName;
                    } else {
                        const mapId     = settingsForMcw.mapId;
                        labelName.text  = (mapId == null ? null : await WarMapModel.getMapNameInCurrentLanguage(mapId).catch(err => { CompatibilityHelpers.showError(err); throw err; })) || CommonConstants.ErrorTextForUndefined;
                    }

                } else if (settingsForCcw) {
                    const warName = settingsForCcw.warName;
                    if (warName) {
                        labelName.text = warName;
                    } else {
                        const mapId     = settingsForCcw.mapId;
                        labelName.text  = (mapId == null ? null : await WarMapModel.getMapNameInCurrentLanguage(mapId).catch(err => { CompatibilityHelpers.showError(err); throw err; })) || CommonConstants.ErrorTextForUndefined;
                    }

                } else if (settingsForMrw) {
                    const mapId     = settingsForMrw.mapId;
                    labelName.text  = (mapId == null ? null : await WarMapModel.getMapNameInCurrentLanguage(mapId).catch(err => { CompatibilityHelpers.showError(err); throw err; })) || CommonConstants.ErrorTextForUndefined;
                }
            }
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

        protected async _onDataChanged(): Promise<void> {
            const data              = this._getData();
            const playerInfo        = data.playerInfo;
            const playerIndex       = playerInfo.playerIndex;
            const teamIndex         = playerInfo.teamIndex;
            this._labelIndex.text   = playerIndex == null ? CommonConstants.ErrorTextForUndefined : Lang.getPlayerForceName(playerIndex);
            this._labelTeam.text    = (teamIndex == null ? null : Lang.getPlayerTeamName(teamIndex)) || CommonConstants.ErrorTextForUndefined;

            const userId    = playerInfo.userId;
            const labelName = this._labelName;
            const coName    = ConfigManager.getCoNameAndTierText(data.configVersion, Helpers.getExisted(playerInfo.coId));
            if (userId == null) {
                labelName.text = `${Lang.getText(LangTextType.B0607)} ${coName}`;
            } else {
                labelName.text = `${await UserModel.getUserNickname(userId).catch(err => { CompatibilityHelpers.showError(err); throw err; })} ${coName}`;
            }
        }
    }
}

export default TwnsWwHandleRequestWarsPanel;
