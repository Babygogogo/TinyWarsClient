
// import TwnsCommonWarBasicSettingsPage       from "../../common/view/CommonWarBasicSettingsPage";
// import TwnsCommonWarMapInfoPage             from "../../common/view/CommonWarMapInfoPage";
// import FloatText                            from "../../tools/helpers/FloatText";
// import FlowManager                          from "../../tools/helpers/FlowManager";
// import Helpers                              from "../../tools/helpers/Helpers";
// import Types                                from "../../tools/helpers/Types";
// import Lang                                 from "../../tools/lang/Lang";
// import TwnsLangTextType                     from "../../tools/lang/LangTextType";
// import Notify                       from "../../tools/notify/NotifyType";
// import TwnsUiButton                         from "../../tools/ui/UiButton";
// import TwnsUiLabel                          from "../../tools/ui/UiLabel";
// import TwnsUiPanel                          from "../../tools/ui/UiPanel";
// import TwnsUiTab                            from "../../tools/ui/UiTab";
// import TwnsUiTabItemRenderer                from "../../tools/ui/UiTabItemRenderer";
// import WarMapModel                          from "../../warMap/model/WarMapModel";
// import CcrCreateModel                       from "../model/CcrCreateModel";
// import CcrProxy                             from "../model/CcrProxy";
// import TwnsCcrCreateAdvancedSettingsPage    from "./CcrCreateAdvancedSettingsPage";
// import TwnsCcrCreateMapListPanel            from "./CcrCreateMapListPanel";
// import TwnsCcrCreatePlayerInfoPage          from "./CcrCreatePlayerInfoPage";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.CoopCustomRoom {
    import CcrCreateAdvancedSettingsPage            = CoopCustomRoom.CcrCreateAdvancedSettingsPage;
    import OpenDataForCommonWarMapInfoPage          = Common.OpenDataForCommonMapInfoPage;
    import OpenDataForCommonWarBasicSettingsPage    = Common.OpenDataForCommonWarBasicSettingsPage;
    import CcrCreatePlayerInfoPage                  = CoopCustomRoom.CcrCreatePlayerInfoPage;
    import LangTextType                             = Lang.LangTextType;
    import NotifyType                               = Notify.NotifyType;
    import WarBasicSettingsType                     = Types.WarBasicSettingsType;

    const CONFIRM_INTERVAL_MS = 5000;

    export type OpenDataForCcrCreateSettingsPanel = void;
    export class CcrCreateSettingsPanel extends TwnsUiPanel.UiPanel<OpenDataForCcrCreateSettingsPanel> {
        private readonly _groupNavigator!       : eui.Group;
        private readonly _labelMultiPlayer!     : TwnsUiLabel.UiLabel;
        private readonly _labelCreateRoom!      : TwnsUiLabel.UiLabel;
        private readonly _labelChooseMap!       : TwnsUiLabel.UiLabel;
        private readonly _labelRoomSettings!    : TwnsUiLabel.UiLabel;

        private readonly _groupTab!             : eui.Group;
        private readonly _tabSettings!          : TwnsUiTab.UiTab<DataForTabItemRenderer, void | OpenDataForCommonWarMapInfoPage | OpenDataForCommonWarBasicSettingsPage>;

        private readonly _btnBack!              : TwnsUiButton.UiButton;
        private readonly _btnConfirm!           : TwnsUiButton.UiButton;

        private _timeoutIdForBtnConfirm : number | null = null;
        private _isTabInitialized       = false;

        protected _onOpening(): void {
            this._setUiListenerArray([
                { ui: this._btnBack,        callback: this._onTouchedBtnBack },
                { ui: this._btnConfirm,     callback: this._onTouchedBtnConfirm },
            ]);
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,            callback: this._onNotifyLanguageChanged },
                { type: NotifyType.MsgCcrCreateRoom,           callback: this._onNotifyMsgCcrCreateRoom },
            ]);
            this._tabSettings.setBarItemRenderer(TabItemRenderer);
        }
        protected async _updateOnOpenDataChanged(): Promise<void> {
            this._isTabInitialized = false;
            this._tabSettings.bindData([
                {
                    tabItemData : { name: Lang.getText(LangTextType.B0002) },
                    pageClass   : Common.CommonWarBasicSettingsPage,
                    pageData    : await this._createDataForCommonWarBasicSettingsPage(),
                },
                {
                    tabItemData : { name: Lang.getText(LangTextType.B0003) },
                    pageClass   : CcrCreateAdvancedSettingsPage,
                    pageData    : null,
                },
                {
                    tabItemData : { name: Lang.getText(LangTextType.B0224) },
                    pageClass   : CcrCreatePlayerInfoPage,
                    pageData    : null,
                },
                {
                    tabItemData : { name: Lang.getText(LangTextType.B0298) },
                    pageClass   : Common.CommonWarMapInfoPage,
                    pageData    : this._createDataForCommonMapInfoPage(),
                },
            ]);
            this._isTabInitialized = true;

            this._updateComponentsForLanguage();
            this._btnConfirm.enabled = true;
        }
        protected _onClosing(): void {
            this._clearTimeoutForBtnConfirm();
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Callbacks.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _onTouchedBtnBack(): void {
            this.close();
            PanelHelpers.open(PanelHelpers.PanelDict.CcrCreateMapListPanel, { mapFilter: null });
        }
        private _onTouchedBtnConfirm(): void {
            const data = CoopCustomRoom.CcrCreateModel.getData();
            CcrProxy.reqCreateRoom(data);

            this._btnConfirm.enabled = false;
            this._resetTimeoutForBtnConfirm();
        }

        private _onNotifyLanguageChanged(): void {
            this._updateComponentsForLanguage();
        }
        private _onNotifyMsgCcrCreateRoom(): void {
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
            this._labelCreateRoom.text          = Lang.getText(LangTextType.B0000);
            this._labelMultiPlayer.text         = Lang.getText(LangTextType.B0646);
            this._labelChooseMap.text           = Lang.getText(LangTextType.B0227);
            this._labelRoomSettings.text        = Lang.getText(LangTextType.B0571);
            this._btnBack.label                 = Lang.getText(LangTextType.B0146);
            this._btnConfirm.label              = Lang.getText(LangTextType.B0026);
        }

        private async _updateCommonWarBasicSettingsPage(): Promise<void> {
            if (this._isTabInitialized) {
                this._tabSettings.updatePageData(0, await this._createDataForCommonWarBasicSettingsPage());
            }
        }

        private async _createDataForCommonWarBasicSettingsPage(): Promise<OpenDataForCommonWarBasicSettingsPage> {
            const instanceWarRule   = CcrCreateModel.getInstanceWarRule();
            const turnsLimit        = CcrCreateModel.getTurnsLimit();
            const warActionsLimit   = CcrCreateModel.getWarActionsLimit();
            const bootTimerParams   = CcrCreateModel.getBootTimerParams();
            const gameConfig        = CcrCreateModel.getGameConfig();
            const warEventFullData  = (await CcrCreateModel.getMapRawData()).warEventFullData ?? null;
            const timerType         = bootTimerParams[0] as Types.BootTimerType;
            const openData          : OpenDataForCommonWarBasicSettingsPage = {
                dataArrayForListSettings: [
                    {
                        settingsType    : WarBasicSettingsType.MapId,
                        currentValue    : CoopCustomRoom.CcrCreateModel.getMapId(),
                        instanceWarRule: instanceWarRule,
                        gameConfig,
                        warEventFullData,
                        callbackOnModify: null,
                    },
                    {
                        settingsType    : WarBasicSettingsType.WarName,
                        currentValue    : CoopCustomRoom.CcrCreateModel.getWarName(),
                        instanceWarRule: instanceWarRule,
                        gameConfig,
                        warEventFullData,
                        callbackOnModify: (newValue: string | number | null) => {
                            if (typeof newValue === "number") {
                                throw Helpers.newError(`Invalid newValue: ${newValue}`);
                            }
                            CoopCustomRoom.CcrCreateModel.setWarName(newValue);
                            this._updateCommonWarBasicSettingsPage();
                        },
                    },
                    {
                        settingsType    : WarBasicSettingsType.WarPassword,
                        currentValue    : CoopCustomRoom.CcrCreateModel.getWarPassword(),
                        instanceWarRule: instanceWarRule,
                        gameConfig,
                        warEventFullData,
                        callbackOnModify: (newValue: string | number | null) => {
                            if (typeof newValue === "number") {
                                throw Helpers.newError(`Invalid newValue: ${newValue}`);
                            }
                            CoopCustomRoom.CcrCreateModel.setWarPassword(newValue);
                            this._updateCommonWarBasicSettingsPage();
                        },
                    },
                    {
                        settingsType    : WarBasicSettingsType.WarComment,
                        currentValue    : CoopCustomRoom.CcrCreateModel.getWarComment(),
                        instanceWarRule: instanceWarRule,
                        gameConfig,
                        warEventFullData,
                        callbackOnModify: (newValue: string | number | null) => {
                            if (typeof newValue === "number") {
                                throw Helpers.newError(`Invalid newValue: ${newValue}`);
                            }
                            CoopCustomRoom.CcrCreateModel.setWarComment(newValue);
                            this._updateCommonWarBasicSettingsPage();
                        },
                    },
                    {
                        settingsType    : WarBasicSettingsType.WarRuleTitle,
                        currentValue    : null,
                        instanceWarRule: instanceWarRule,
                        gameConfig,
                        warEventFullData,
                        callbackOnModify: async () => {
                            await CoopCustomRoom.CcrCreateModel.tickTemplateWarRuleId();
                            this._updateCommonWarBasicSettingsPage();
                        },
                    },
                    {
                        settingsType    : WarBasicSettingsType.HasFog,
                        currentValue    : null,
                        instanceWarRule: instanceWarRule,
                        gameConfig,
                        warEventFullData,
                        callbackOnModify: () => {
                            CoopCustomRoom.CcrCreateModel.setHasFog(!CoopCustomRoom.CcrCreateModel.getHasFog());
                            CoopCustomRoom.CcrCreateModel.setCustomWarRuleId();
                            this._updateCommonWarBasicSettingsPage();
                        },
                    },
                    {
                        settingsType    : WarBasicSettingsType.Weather,
                        currentValue    : null,
                        instanceWarRule: instanceWarRule,
                        gameConfig,
                        warEventFullData,
                        callbackOnModify: () => {
                            CoopCustomRoom.CcrCreateModel.tickDefaultWeatherType();
                            CoopCustomRoom.CcrCreateModel.setCustomWarRuleId();
                            this._updateCommonWarBasicSettingsPage();
                        },
                    },
                    {
                        settingsType    : WarBasicSettingsType.WarEvent,
                        currentValue    : null,
                        instanceWarRule: instanceWarRule,
                        gameConfig,
                        warEventFullData,
                        callbackOnModify: null,
                    },
                    {
                        settingsType    : WarBasicSettingsType.TurnsAndWarActionsLimit,
                        currentValue    : `${turnsLimit}, ${warActionsLimit}`,
                        instanceWarRule,
                        gameConfig,
                        warEventFullData,
                        callbackOnModify: (newValue: string | number | null) => {
                            if (typeof newValue !== "string") {
                                throw Helpers.newError(`Invalid newValue: ${newValue}`);
                            }

                            const stringArray = newValue.split(`,`);
                            CcrCreateModel.setTurnsLimit(parseInt(stringArray[0]));
                            CcrCreateModel.setWarActionsLimit(parseInt(stringArray[1]));
                            this._updateCommonWarBasicSettingsPage();
                        },
                    },
                    {
                        settingsType    : WarBasicSettingsType.TimerType,
                        currentValue    : timerType,
                        instanceWarRule: instanceWarRule,
                        gameConfig,
                        warEventFullData,
                        callbackOnModify: async () => {
                            CoopCustomRoom.CcrCreateModel.tickBootTimerType();
                            this._updateCommonWarBasicSettingsPage();
                        },
                    },
                ],
            };
            if (timerType === Types.BootTimerType.Regular) {
                openData.dataArrayForListSettings.push({
                    settingsType    : WarBasicSettingsType.TimerRegularParam,
                    currentValue    : bootTimerParams[1],
                    instanceWarRule: instanceWarRule,
                    gameConfig,
                    warEventFullData,
                    callbackOnModify: () => {
                        CoopCustomRoom.CcrCreateModel.tickTimerRegularTime();
                        this._updateCommonWarBasicSettingsPage();
                    },
                });
            } else if (timerType === Types.BootTimerType.Incremental) {
                openData.dataArrayForListSettings.push(
                    {
                        settingsType    : WarBasicSettingsType.TimerIncrementalParams,
                        currentValue    : `${bootTimerParams[1]}, ${bootTimerParams[2]}, ${bootTimerParams[3] ?? 0}`,
                        instanceWarRule: instanceWarRule,
                        gameConfig,
                        warEventFullData,
                        callbackOnModify: (newValue: number | string | null) => {
                            if (typeof newValue !== "string") {
                                throw Helpers.newError(`Invalid newValue: ${newValue}`);
                            }

                            CcrCreateModel.setTimerIncrementalParamArray(newValue.split(`,`).map(v => parseInt(v)));
                            this._updateCommonWarBasicSettingsPage();
                        },
                    },
                );
            } else {
                throw Helpers.newError(`CcrCreateSettingsPanel._createDataForCommonWarBasicSettingsPage() invalid timerType.`);
            }

            return openData;
        }

        private _createDataForCommonMapInfoPage(): OpenDataForCommonWarMapInfoPage {
            const mapId = CoopCustomRoom.CcrCreateModel.getMapId();
            return mapId == null
                ? null
                : {
                    gameConfig  : CoopCustomRoom.CcrCreateModel.getGameConfig(),
                    hasFog      : CoopCustomRoom.CcrCreateModel.getInstanceWarRule().ruleForGlobalParams?.hasFogByDefault ?? null,
                    mapInfo     : { mapId },
                };
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
}

// export default TwnsCcrCreateSettingsPanel;
