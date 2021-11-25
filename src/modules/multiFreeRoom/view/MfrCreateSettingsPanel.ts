
// import TwnsCommonWarBasicSettingsPage       from "../../common/view/CommonWarBasicSettingsPage";
// import TwnsCommonWarMapInfoPage             from "../../common/view/CommonWarMapInfoPage";
// import TwnsLobbyBottomPanel                 from "../../lobby/view/LobbyBottomPanel";
// import TwnsLobbyTopPanel                    from "../../lobby/view/LobbyTopPanel";
// import MfrProxy                             from "../../multiFreeRoom/model/MfrProxy";
// import CommonConstants                      from "../../tools/helpers/CommonConstants";
// import FloatText                            from "../../tools/helpers/FloatText";
// import FlowManager                          from "../../tools/helpers/FlowManager";
// import Helpers                              from "../../tools/helpers/Helpers";
// import Types                                from "../../tools/helpers/Types";
// import Lang                                 from "../../tools/lang/Lang";
// import TwnsLangTextType                     from "../../tools/lang/LangTextType";
// import TwnsNotifyType                       from "../../tools/notify/NotifyType";
// import TwnsUiButton                         from "../../tools/ui/UiButton";
// import TwnsUiImage                          from "../../tools/ui/UiImage";
// import TwnsUiLabel                          from "../../tools/ui/UiLabel";
// import TwnsUiListItemRenderer               from "../../tools/ui/UiListItemRenderer";
// import TwnsUiPanel                          from "../../tools/ui/UiPanel";
// import TwnsUiScrollList                     from "../../tools/ui/UiScrollList";
// import TwnsUiTab                            from "../../tools/ui/UiTab";
// import TwnsUiTabItemRenderer                from "../../tools/ui/UiTabItemRenderer";
// import WarCommonHelpers                     from "../../tools/warHelpers/WarCommonHelpers";
// import WarRuleHelpers                       from "../../tools/warHelpers/WarRuleHelpers";
// import MfrCreateModel                       from "../model/MfrCreateModel";
// import TwnsMfrCreateAdvancedSettingsPage    from "./MfrCreateAdvancedSettingsPage";
// import TwnsMfrCreatePlayerInfoPage          from "./MfrCreatePlayerInfoPage";
// import TwnsMfrMainMenuPanel                 from "./MfrMainMenuPanel";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace TwnsMfrCreateSettingsPanel {
    import MfrCreateAdvancedSettingsPage            = TwnsMfrCreateAdvancedSettingsPage.MfrCreateAdvancedSettingsPage;
    import OpenDataForCommonWarBasicSettingsPage    = TwnsCommonWarBasicSettingsPage.OpenDataForCommonWarBasicSettingsPage;
    import OpenDataForCommonWarMapInfoPage          = TwnsCommonWarMapInfoPage.OpenDataForCommonMapInfoPage;
    import LangTextType                             = TwnsLangTextType.LangTextType;
    import NotifyType                               = TwnsNotifyType.NotifyType;
    import WarBasicSettingsType                     = Types.WarBasicSettingsType;

    const CONFIRM_INTERVAL_MS = 5000;

    export type OpenData = void;
    export class MfrCreateSettingsPanel extends TwnsUiPanel.UiPanel<OpenData> {
        private readonly _groupNavigator!           : eui.Group;
        private readonly _labelMultiPlayer!         : TwnsUiLabel.UiLabel;
        private readonly _labelFreeMode!            : TwnsUiLabel.UiLabel;
        private readonly _labelCreateRoom!          : TwnsUiLabel.UiLabel;
        private readonly _labelRoomSettings!        : TwnsUiLabel.UiLabel;

        private readonly _groupSettings!            : eui.Group;
        private readonly _groupChooseCo!            : eui.Group;
        private readonly _labelChooseCo!            : TwnsUiLabel.UiLabel;
        private readonly _btnChooseCo!              : TwnsUiButton.UiButton;

        private readonly _groupChoosePlayerIndex!   : eui.Group;
        private readonly _labelChoosePlayerIndex!   : TwnsUiLabel.UiLabel;
        private readonly _sclPlayerIndex!           : TwnsUiScrollList.UiScrollList<DataForPlayerIndexRenderer>;

        private readonly _groupChooseSkinId!        : eui.Group;
        private readonly _labelChooseSkinId!        : TwnsUiLabel.UiLabel;
        private readonly _sclSkinId!                : TwnsUiScrollList.UiScrollList<DataForSkinIdRenderer>;

        private readonly _groupTab!                 : eui.Group;
        private readonly _tabSettings!              : TwnsUiTab.UiTab<DataForTabItemRenderer, void | OpenDataForCommonWarMapInfoPage | OpenDataForCommonWarBasicSettingsPage>;

        private readonly _btnBack!                  : TwnsUiButton.UiButton;
        private readonly _btnConfirm!               : TwnsUiButton.UiButton;

        private _timeoutIdForBtnConfirm : number | null = null;
        private _isTabInitialized       = false;

        protected _onOpening(): void {
            this._setUiListenerArray([
                { ui: this._btnBack,        callback: this._onTouchedBtnBack },
                { ui: this._btnConfirm,     callback: this._onTouchedBtnConfirm },
                { ui: this._btnChooseCo,    callback: this._onTouchedBtnChooseCo },
            ]);
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,            callback: this._onNotifyLanguageChanged },
                { type: NotifyType.MfrCreateSelfCoIdChanged,   callback: this._onNotifyMfrCreateSelfCoIdChanged },
                { type: NotifyType.MsgMfrCreateRoom,           callback: this._onNotifyMsgMfrCreateRoom },
            ]);
            this._tabSettings.setBarItemRenderer(TabItemRenderer);
            this._sclPlayerIndex.setItemRenderer(PlayerIndexRenderer);
            this._sclSkinId.setItemRenderer(SkinIdRenderer);
        }
        protected async _updateOnOpenDataChanged(): Promise<void> {
            this._isTabInitialized = false;
            this._tabSettings.bindData([
                {
                    tabItemData : { name: Lang.getText(LangTextType.B0002) },
                    pageClass   : TwnsCommonWarBasicSettingsPage.CommonWarBasicSettingsPage,
                    pageData    : this._createDataForCommonWarBasicSettingsPage(),
                },
                {
                    tabItemData : { name: Lang.getText(LangTextType.B0003) },
                    pageClass   : MfrCreateAdvancedSettingsPage,
                    pageData    : null,
                },
                // {
                //     tabItemData : { name: Lang.getText(LangTextType.B0224) },
                //     pageClass   : TwnsMfrCreatePlayerInfoPage.MfrCreatePlayerInfoPage,
                //     pageData    : null,
                // },
                {
                    tabItemData : { name: Lang.getText(LangTextType.B0298) },
                    pageClass   : TwnsCommonWarMapInfoPage.CommonWarMapInfoPage,
                    pageData    : this._createDataForCommonMapInfoPage(),
                },
            ]);
            this._isTabInitialized = true;

            this._updateComponentsForLanguage();
            this._initSclPlayerIndex();
            this._initSclSkinId();
            this._updateBtnChooseCo();
            this._btnConfirm.enabled = true;
        }
        protected _onClosing(): void {
            // nothing to do
            this._clearTimeoutForBtnConfirm();
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Callbacks.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _onTouchedBtnBack(): void {
            this.close();
            TwnsPanelManager.open(TwnsPanelConfig.Dict.MfrMainMenuPanel, void 0);
            TwnsPanelManager.open(TwnsPanelConfig.Dict.LobbyTopPanel, void 0);
            TwnsPanelManager.open(TwnsPanelConfig.Dict.LobbyBottomPanel, void 0);
        }
        private _onTouchedBtnConfirm(): void {
            MfrProxy.reqCreateRoom(MfrCreateModel.getData());

            this._btnConfirm.enabled = false;
            this._resetTimeoutForBtnConfirm();
        }
        private _onTouchedBtnChooseCo(): void {
            const currentCoId = MfrCreateModel.getSelfCoId();
            TwnsPanelManager.open(TwnsPanelConfig.Dict.CommonChooseCoPanel, {
                currentCoId,
                availableCoIdArray  : WarRuleHelpers.getAvailableCoIdArrayForPlayer({
                    warRule         : MfrCreateModel.getWarRule(),
                    playerIndex     : MfrCreateModel.getSelfPlayerIndex(),
                    configVersion   : MfrCreateModel.getConfigVersion(),
                }),
                callbackOnConfirm   : (newCoId) => {
                    if (newCoId !== currentCoId) {
                        MfrCreateModel.setSelfCoId(newCoId);
                    }
                },
            });
        }

        private _onNotifyLanguageChanged(): void {
            this._updateComponentsForLanguage();
        }
        private _onNotifyMfrCreateSelfCoIdChanged(): void {
            this._updateBtnChooseCo();
        }
        private _onNotifyMsgMfrCreateRoom(): void {
            FloatText.show(Lang.getText(LangTextType.A0015));
            FlowManager.gotoLobby();
        }

        private _resetTimeoutForBtnConfirm(): void {
            this._clearTimeoutForBtnConfirm();
            this._timeoutIdForBtnConfirm = egret.setTimeout(() => {
                this._btnConfirm.enabled     = true;
                this._timeoutIdForBtnConfirm = null;
            }, this, CONFIRM_INTERVAL_MS);
        }

        private _clearTimeoutForBtnConfirm(): void {
            if (this._timeoutIdForBtnConfirm != null) {
                egret.clearTimeout(this._timeoutIdForBtnConfirm);
                this._timeoutIdForBtnConfirm = null;
            }
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Functions for the view.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _updateComponentsForLanguage(): void {
            this._labelMultiPlayer.text         = Lang.getText(LangTextType.B0137);
            this._labelFreeMode.text            = Lang.getText(LangTextType.B0557);
            this._labelCreateRoom.text          = Lang.getText(LangTextType.B0000);
            this._labelRoomSettings.text        = Lang.getText(LangTextType.B0571);
            this._labelChooseCo.text            = Lang.getText(LangTextType.B0145);
            this._labelChoosePlayerIndex.text   = Lang.getText(LangTextType.B0572);
            this._labelChooseSkinId.text        = Lang.getText(LangTextType.B0586);
            this._btnBack.label                 = Lang.getText(LangTextType.B0146);
            this._btnConfirm.label              = Lang.getText(LangTextType.B0026);
        }

        private _updateBtnChooseCo(): void {
            const cfg               = ConfigManager.getCoBasicCfg(MfrCreateModel.getConfigVersion(), MfrCreateModel.getSelfCoId());
            this._btnChooseCo.label = cfg.name;
        }

        private async _initSclPlayerIndex(): Promise<void> {
            const playersCountUnneutral = Helpers.getExisted(MfrCreateModel.getInitialWarData().playerManager?.players).length - 1;
            const dataArray             : DataForPlayerIndexRenderer[] = [];
            for (let playerIndex = CommonConstants.WarFirstPlayerIndex; playerIndex <= playersCountUnneutral; ++playerIndex) {
                dataArray.push({
                    playerIndex,
                });
            }
            this._sclPlayerIndex.bindData(dataArray);
        }

        private _initSclSkinId(): void {
            const dataArray: DataForSkinIdRenderer[] = [];
            for (let skinId = CommonConstants.UnitAndTileMinSkinId; skinId <= CommonConstants.UnitAndTileMaxSkinId; ++skinId) {
                dataArray.push({
                    skinId,
                });
            }
            this._sclSkinId.bindData(dataArray);
        }

        private _createDataForCommonMapInfoPage(): OpenDataForCommonWarMapInfoPage {
            const warData = MfrCreateModel.getInitialWarData();
            return warData == null
                ? {}
                : { warInfo: { warData, players: null } };
        }

        private _updateCommonWarBasicSettingsPage(): void {
            if (this._isTabInitialized) {
                this._tabSettings.updatePageData(0, this._createDataForCommonWarBasicSettingsPage());
            }
        }

        private _createDataForCommonWarBasicSettingsPage(): OpenDataForCommonWarBasicSettingsPage {
            const warRule           = MfrCreateModel.getWarRule();
            const bootTimerParams   = MfrCreateModel.getBootTimerParams();
            const timerType         = bootTimerParams[0] as Types.BootTimerType;
            const openData          : OpenDataForCommonWarBasicSettingsPage = {
                dataArrayForListSettings: [
                    {
                        settingsType    : WarBasicSettingsType.WarName,
                        currentValue    : MfrCreateModel.getWarName(),
                        warRule,
                        callbackOnModify: (newValue: string | number | null) => {
                            if (typeof newValue === "number") {
                                throw Helpers.newError(`Invalid newValue: ${newValue}`);
                            }
                            MfrCreateModel.setWarName(newValue);
                            this._updateCommonWarBasicSettingsPage();
                        },
                    },
                    {
                        settingsType    : WarBasicSettingsType.WarPassword,
                        currentValue    : MfrCreateModel.getWarPassword(),
                        warRule,
                        callbackOnModify: (newValue: string | number | null) => {
                            if (typeof newValue === "number") {
                                throw Helpers.newError(`Invalid newValue: ${newValue}`);
                            }
                            MfrCreateModel.setWarPassword(newValue);
                            this._updateCommonWarBasicSettingsPage();
                        },
                    },
                    {
                        settingsType    : WarBasicSettingsType.WarComment,
                        currentValue    : MfrCreateModel.getWarComment(),
                        warRule,
                        callbackOnModify: (newValue: string | number | null) => {
                            if (typeof newValue === "number") {
                                throw Helpers.newError(`Invalid newValue: ${newValue}`);
                            }
                            MfrCreateModel.setWarComment(newValue);
                            this._updateCommonWarBasicSettingsPage();
                        },
                    },
                    {
                        settingsType    : WarBasicSettingsType.WarRuleTitle,
                        currentValue    : null,
                        warRule,
                        callbackOnModify: null,
                    },
                    {
                        settingsType    : WarBasicSettingsType.HasFog,
                        currentValue    : null,
                        warRule,
                        callbackOnModify: null,
                    },
                    {
                        settingsType    : WarBasicSettingsType.Weather,
                        currentValue    : null,
                        warRule,
                        callbackOnModify: null,
                    },
                    {
                        settingsType    : WarBasicSettingsType.TimerType,
                        currentValue    : timerType,
                        warRule,
                        callbackOnModify: async () => {
                            MfrCreateModel.tickBootTimerType();
                            this._updateCommonWarBasicSettingsPage();
                        },
                    },
                ],
            };
            if (timerType === Types.BootTimerType.Regular) {
                openData.dataArrayForListSettings.push({
                    settingsType    : WarBasicSettingsType.TimerRegularParam,
                    currentValue    : bootTimerParams[1],
                    warRule,
                    callbackOnModify: () => {
                        MfrCreateModel.tickTimerRegularTime();
                        this._updateCommonWarBasicSettingsPage();
                    },
                });
            } else if (timerType === Types.BootTimerType.Incremental) {
                openData.dataArrayForListSettings.push(
                    {
                        settingsType    : WarBasicSettingsType.TimerIncrementalParam1,
                        currentValue    : bootTimerParams[1],
                        warRule,
                        callbackOnModify: (newValue: number | string | null) => {
                            if (typeof newValue !== "number") {
                                throw Helpers.newError(`Invalid newValue: ${newValue}`);
                            }
                            MfrCreateModel.setTimerIncrementalInitialTime(newValue);
                            this._updateCommonWarBasicSettingsPage();
                        },
                    },
                    {
                        settingsType    : WarBasicSettingsType.TimerIncrementalParam2,
                        currentValue    : bootTimerParams[2],
                        warRule,
                        callbackOnModify: (newValue: number | string | null) => {
                            if (typeof newValue !== "number") {
                                throw Helpers.newError(`Invalid newValue: ${newValue}`);
                            }
                            MfrCreateModel.setTimerIncrementalIncrementalValue(newValue);
                            this._updateCommonWarBasicSettingsPage();
                        },
                    },
                );
            } else {
                throw Helpers.newError(`MfrCreateSettingsPanel._createDataForCommonWarBasicSettingsPage() invalid timerType.`);
            }

            return openData;
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Opening/closing animations.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        protected async _showOpenAnimation(): Promise<void> {
            Helpers.resetTween({
                obj         : this._groupNavigator,
                beginProps  : { alpha: 0, y: -20 },
                endProps    : { alpha: 1, y: 20 },
            });
            Helpers.resetTween({
                obj         : this._btnBack,
                beginProps  : { alpha: 0, y: -20 },
                endProps    : { alpha: 1, y: 20 },
            });
            Helpers.resetTween({
                obj         : this._groupSettings,
                beginProps  : { alpha: 0, left: -20 },
                endProps    : { alpha: 1, left: 20 },
            });
            Helpers.resetTween({
                obj         : this._btnConfirm,
                beginProps  : { alpha: 0, left: -20 },
                endProps    : { alpha: 1, left: 20 },
            });
            Helpers.resetTween({
                obj         : this._groupTab,
                beginProps  : { alpha: 0, },
                endProps    : { alpha: 1, },
            });

            await Helpers.wait(CommonConstants.DefaultTweenTime);
        }
        protected async _showCloseAnimation(): Promise<void> {
            Helpers.resetTween({
                obj         : this._groupNavigator,
                beginProps  : { alpha: 1, y: 20 },
                endProps    : { alpha: 0, y: -20 },
            });
            Helpers.resetTween({
                obj         : this._btnBack,
                beginProps  : { alpha: 1, y: 20 },
                endProps    : { alpha: 0, y: -20 },
            });
            Helpers.resetTween({
                obj         : this._groupSettings,
                beginProps  : { alpha: 1, left: 20 },
                endProps    : { alpha: 0, left: -20 },
            });
            Helpers.resetTween({
                obj         : this._btnConfirm,
                beginProps  : { alpha: 1, left: 20 },
                endProps    : { alpha: 0, left: -20 },
            });
            Helpers.resetTween({
                obj         : this._groupTab,
                beginProps  : { alpha: 1, },
                endProps    : { alpha: 0, },
            });

            await Helpers.wait(CommonConstants.DefaultTweenTime);
        }
    }

    type DataForTabItemRenderer = {
        name: string;
    };
    class TabItemRenderer extends TwnsUiTabItemRenderer.UiTabItemRenderer<DataForTabItemRenderer> {
        private readonly _labelName!    : TwnsUiLabel.UiLabel;

        protected _onDataChanged(): void {
            this._labelName.text = this._getData().name;
        }
    }

    type DataForPlayerIndexRenderer = {
        playerIndex: number;
    };
    class PlayerIndexRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForPlayerIndexRenderer> {
        private readonly _labelName!    : TwnsUiLabel.UiLabel;

        protected _onOpened(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,                    callback: this._onNotifyLanguageChanged },
                { type: NotifyType.MfrCreateTeamIndexChanged,          callback: this._onNotifyMfrCreateTeamIndexChanged },
                { type: NotifyType.MfrCreateSelfPlayerIndexChanged,    callback: this._onNotifyMfrCreateSelfPlayerIndexChanged },
            ]);
        }

        protected _onDataChanged(): void {
            this._updateLabelName();
            this._updateState();
        }

        public onItemTapEvent(): void {
            const data = this.data;
            if (data) {
                const creator       = MfrCreateModel;
                const playerIndex   = data.playerIndex;
                const playerData    = creator.getInitialWarData().playerManager?.players?.find(v => v.playerIndex === playerIndex);
                if ((playerData == null)                                    ||
                    (playerData.aliveState === Types.PlayerAliveState.Dead) ||
                    (playerData.userId == null)
                ) {
                    FloatText.show(Lang.getText(LangTextType.A0204));
                } else {
                    creator.setSelfPlayerIndex(playerIndex);

                    const availableCoIdArray = WarRuleHelpers.getAvailableCoIdArrayForPlayer({
                        warRule         : creator.getWarRule(),
                        playerIndex,
                        configVersion   : MfrCreateModel.getConfigVersion(),
                    });
                    if (availableCoIdArray.indexOf(creator.getSelfCoId()) < 0) {
                        creator.setSelfCoId(WarRuleHelpers.getRandomCoIdWithCoIdList(availableCoIdArray));
                    }
                }
            }
        }
        private _onNotifyLanguageChanged(): void {
            this._updateLabelName();
        }
        private _onNotifyMfrCreateTeamIndexChanged(): void {
            this._updateLabelName();
        }
        private _onNotifyMfrCreateSelfPlayerIndexChanged(): void {
            this._updateState();
        }

        private _updateLabelName(): void {
            const data = this.data;
            if (data) {
                const playerIndex       = data.playerIndex;
                this._labelName.text    = `P${playerIndex} (${Lang.getPlayerTeamName(WarRuleHelpers.getTeamIndex(MfrCreateModel.getWarRule(), playerIndex))})`;
            }
        }
        private _updateState(): void {
            const data          = this.data;
            this.currentState   = ((data) && (data.playerIndex === MfrCreateModel.getSelfPlayerIndex())) ? `down` : `up`;
        }
    }

    type DataForSkinIdRenderer = {
        skinId: number;
    };
    class SkinIdRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForSkinIdRenderer> {
        private readonly _imgColor! : TwnsUiImage.UiImage;

        protected _onOpened(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.MfrCreateSelfPlayerIndexChanged, callback: this._onNotifyMfrCreateSelfPlayerIndexChanged },
            ]);
        }

        protected _onDataChanged(): void {
            this._updateImgColor();
        }

        private _onNotifyMfrCreateSelfPlayerIndexChanged(): void {
            this._updateImgColor();
        }

        private _updateImgColor(): void {
            const data = this.data;
            if (data) {
                const skinId            = data.skinId;
                this._imgColor.source   = WarCommonHelpers.getImageSourceForSkinId(skinId, MfrCreateModel.getSelfPlayerData().unitAndTileSkinId === skinId);
            }
        }
    }
}

// export default TwnsMfrCreateSettingsPanel;
