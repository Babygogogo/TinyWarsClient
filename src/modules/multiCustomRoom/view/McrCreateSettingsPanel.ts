
// import TwnsCommonChooseCoPanel              from "../../common/view/CommonChooseCoPanel";
// import TwnsCommonWarBasicSettingsPage       from "../../common/view/CommonWarBasicSettingsPage";
// import TwnsCommonWarMapInfoPage             from "../../common/view/CommonWarMapInfoPage";
// import McrProxy                             from "../../multiCustomRoom/model/McrProxy";
// import CommonConstants                      from "../../tools/helpers/CommonConstants";
// import ConfigManager                        from "../../tools/helpers/ConfigManager";
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
// import WarMapModel                          from "../../warMap/model/WarMapModel";
// import McrCreateModel                       from "../model/McrCreateModel";
// import TwnsMcrCreateAdvancedSettingsPage    from "./McrCreateAdvancedSettingsPage";
// import TwnsMcrCreateMapListPanel            from "./McrCreateMapListPanel";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.MultiCustomRoom {
    import McrCreateAdvancedSettingsPage            = TwnsMcrCreateAdvancedSettingsPage.McrCreateAdvancedSettingsPage;
    import OpenDataForCommonWarBasicSettingsPage    = Common.OpenDataForCommonWarBasicSettingsPage;
    import OpenDataForCommonWarMapInfoPage          = TwnsCommonWarMapInfoPage.OpenDataForCommonMapInfoPage;
    import LangTextType                             = TwnsLangTextType.LangTextType;
    import NotifyType                               = TwnsNotifyType.NotifyType;
    import WarBasicSettingsType                     = Types.WarBasicSettingsType;

    const CONFIRM_INTERVAL_MS = 5000;

    export type OpenDataForMcrCreateSettingsPanel = void;
    export class McrCreateSettingsPanel extends TwnsUiPanel.UiPanel<OpenDataForMcrCreateSettingsPanel> {
        private readonly _groupNavigator!           : eui.Group;
        private readonly _labelMultiPlayer!         : TwnsUiLabel.UiLabel;
        private readonly _labelCreateRoom!          : TwnsUiLabel.UiLabel;
        private readonly _labelChooseMap!           : TwnsUiLabel.UiLabel;
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
        private readonly _tabSettings!              : TwnsUiTab.UiTab<DataForTabItemRenderer, void | OpenDataForCommonWarBasicSettingsPage | OpenDataForCommonWarMapInfoPage>;

        private readonly _btnBack!                  : TwnsUiButton.UiButton;
        private readonly _btnConfirm!               : TwnsUiButton.UiButton;

        private _timeoutIdForBtnConfirm             : number | null = null;
        private _isTabInitialized                   = false;

        protected _onOpening(): void {
            this._setUiListenerArray([
                { ui: this._btnBack,        callback: this._onTouchedBtnBack },
                { ui: this._btnConfirm,     callback: this._onTouchedBtnConfirm },
                { ui: this._btnChooseCo,    callback: this._onTouchedBtnChooseCo },
            ]);
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,            callback: this._onNotifyLanguageChanged },
                { type: NotifyType.McrCreateSelfCoIdChanged,   callback: this._onNotifyMcrCreateSelfCoIdChanged },
                { type: NotifyType.MsgMcrCreateRoom,           callback: this._onNotifyMsgMcrCreateRoom },
                { type: NotifyType.MsgMcrCreateRoomFailed,     callback: this._onNotifyMsgMcrCreateRoomFailed },
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
                    pageClass   : Common.CommonWarBasicSettingsPage,
                    pageData    : await this._createDataForCommonWarBasicSettingsPage(),
                },
                {
                    tabItemData : { name: Lang.getText(LangTextType.B0003) },
                    pageClass   : McrCreateAdvancedSettingsPage,
                    pageData    : null,
                },
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
            this._clearTimeoutForBtnConfirm();
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Callbacks.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _onTouchedBtnBack(): void {
            this.close();
            TwnsPanelManager.open(TwnsPanelConfig.Dict.McrCreateMapListPanel, null);
        }
        private _onTouchedBtnConfirm(): void {
            const data = McrCreateModel.getData();
            MultiCustomRoom.McrProxy.reqCreateRoom(data);

            this._btnConfirm.enabled = false;
            this._resetTimeoutForBtnConfirm();
        }
        private _onTouchedBtnChooseCo(): void {
            const currentCoId = McrCreateModel.getSelfCoId();
            const gameConfig    = McrCreateModel.getGameConfig();
            TwnsPanelManager.open(TwnsPanelConfig.Dict.CommonChooseCoPanel, {
                gameConfig,
                currentCoId,
                availableCoIdArray  : WarRuleHelpers.getAvailableCoIdArrayForPlayer({
                    warRule         : McrCreateModel.getWarRule(),
                    playerIndex     : McrCreateModel.getSelfPlayerIndex(),
                    gameConfig,
                }),
                callbackOnConfirm   : (newCoId) => {
                    if (newCoId !== currentCoId) {
                        McrCreateModel.setSelfCoId(newCoId);
                    }
                },
            });
        }

        private _onNotifyLanguageChanged(): void {
            this._updateComponentsForLanguage();
        }
        private _onNotifyMcrCreateSelfCoIdChanged(): void {
            this._updateBtnChooseCo();
        }
        private _onNotifyMsgMcrCreateRoom(): void {
            FloatText.show(Lang.getText(LangTextType.A0015));
            FlowManager.gotoLobby();
        }
        private _onNotifyMsgMcrCreateRoomFailed(): void {
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
            this._labelMultiPlayer.text         = Lang.getText(LangTextType.B0137);
            this._labelChooseMap.text           = Lang.getText(LangTextType.B0227);
            this._labelRoomSettings.text        = Lang.getText(LangTextType.B0571);
            this._labelChooseCo.text            = Lang.getText(LangTextType.B0145);
            this._labelChoosePlayerIndex.text   = Lang.getText(LangTextType.B0572);
            this._labelChooseSkinId.text        = Lang.getText(LangTextType.B0573);
            this._btnBack.label                 = Lang.getText(LangTextType.B0146);
            this._btnConfirm.label              = Lang.getText(LangTextType.B0026);
        }

        private async _updateBtnChooseCo(): Promise<void> {
            const gameConfig        = McrCreateModel.getGameConfig();
            this._btnChooseCo.label = gameConfig.getCoBasicCfg(McrCreateModel.getSelfCoId())?.name ?? CommonConstants.ErrorTextForUndefined;
        }

        private async _initSclPlayerIndex(): Promise<void> {
            const playersCountUnneutral = Helpers.getExisted((await McrCreateModel.getMapRawData()).playersCountUnneutral);
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

        private async _updateCommonWarBasicSettingsPage(): Promise<void> {
            if (this._isTabInitialized) {
                this._tabSettings.updatePageData(0, await this._createDataForCommonWarBasicSettingsPage());
            }
        }

        private async _createDataForCommonWarBasicSettingsPage(): Promise<OpenDataForCommonWarBasicSettingsPage> {
            const warRule           = McrCreateModel.getWarRule();
            const bootTimerParams   = McrCreateModel.getBootTimerParams();
            const turnsLimit        = McrCreateModel.getTurnsLimit();
            const gameConfig        = McrCreateModel.getGameConfig();
            const warEventFullData  = (await McrCreateModel.getMapRawData()).warEventFullData ?? null;
            const timerType         = bootTimerParams[0] as Types.BootTimerType;
            const openData          : OpenDataForCommonWarBasicSettingsPage = {
                dataArrayForListSettings: [
                    {
                        settingsType    : WarBasicSettingsType.MapId,
                        currentValue    : McrCreateModel.getMapId(),
                        warRule,
                        gameConfig,
                        warEventFullData,
                        callbackOnModify: null,
                    },
                    {
                        settingsType    : WarBasicSettingsType.WarName,
                        currentValue    : McrCreateModel.getWarName(),
                        warRule,
                        gameConfig,
                        warEventFullData,
                        callbackOnModify: (newValue: string | number | null) => {
                            if (typeof newValue == "number") {
                                throw Helpers.newError(`Invalid newValue: ${newValue}`);
                            }
                            McrCreateModel.setWarName(newValue);
                            this._updateCommonWarBasicSettingsPage();
                        },
                    },
                    {
                        settingsType    : WarBasicSettingsType.WarPassword,
                        currentValue    : McrCreateModel.getWarPassword(),
                        warRule,
                        gameConfig,
                        warEventFullData,
                        callbackOnModify: (newValue: string | number | null) => {
                            if (typeof newValue == "number") {
                                throw Helpers.newError(`Invalid newValue: ${newValue}`);
                            }
                            McrCreateModel.setWarPassword(newValue);
                            this._updateCommonWarBasicSettingsPage();
                        },
                    },
                    {
                        settingsType    : WarBasicSettingsType.WarComment,
                        currentValue    : McrCreateModel.getWarComment(),
                        warRule,
                        gameConfig,
                        warEventFullData,
                        callbackOnModify: (newValue: string | number | null) => {
                            if (typeof newValue == "number") {
                                throw Helpers.newError(`Invalid newValue: ${newValue}`);
                            }
                            McrCreateModel.setWarComment(newValue);
                            this._updateCommonWarBasicSettingsPage();
                        },
                    },
                    {
                        settingsType    : WarBasicSettingsType.WarRuleTitle,
                        currentValue    : null,
                        warRule,
                        gameConfig,
                        warEventFullData,
                        callbackOnModify: async () => {
                            await McrCreateModel.tickPresetWarRuleId();
                            this._updateCommonWarBasicSettingsPage();
                        },
                    },
                    {
                        settingsType    : WarBasicSettingsType.HasFog,
                        currentValue    : null,
                        warRule,
                        gameConfig,
                        warEventFullData,
                        callbackOnModify: () => {
                            McrCreateModel.setHasFog(!McrCreateModel.getHasFog());
                            McrCreateModel.setCustomWarRuleId();
                            this._updateCommonWarBasicSettingsPage();
                        },
                    },
                    {
                        settingsType    : WarBasicSettingsType.Weather,
                        currentValue    : null,
                        warRule,
                        gameConfig,
                        warEventFullData,
                        callbackOnModify: () => {
                            McrCreateModel.tickDefaultWeatherType();
                            McrCreateModel.setCustomWarRuleId();
                            this._updateCommonWarBasicSettingsPage();
                        },
                    },
                    {
                        settingsType    : WarBasicSettingsType.WarEvent,
                        currentValue    : null,
                        warRule,
                        gameConfig,
                        warEventFullData,
                        callbackOnModify: null,
                    },
                    {
                        settingsType    : WarBasicSettingsType.TurnsLimit,
                        currentValue    : turnsLimit,
                        warRule,
                        gameConfig,
                        warEventFullData,
                        callbackOnModify: (newValue: string | number | null) => {
                            if (typeof newValue !== "number") {
                                throw Helpers.newError(`Invalid newValue: ${newValue}`);
                            }
                            McrCreateModel.setTurnsLimit(newValue);
                            this._updateCommonWarBasicSettingsPage();
                        },
                    },
                    {
                        settingsType    : WarBasicSettingsType.TimerType,
                        currentValue    : timerType,
                        warRule,
                        gameConfig,
                        warEventFullData,
                        callbackOnModify: async () => {
                            McrCreateModel.tickBootTimerType();
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
                    gameConfig,
                    warEventFullData,
                    callbackOnModify: () => {
                        McrCreateModel.tickTimerRegularTime();
                        this._updateCommonWarBasicSettingsPage();
                    },
                });
            } else if (timerType === Types.BootTimerType.Incremental) {
                openData.dataArrayForListSettings.push(
                    {
                        settingsType    : WarBasicSettingsType.TimerIncrementalParam1,
                        currentValue    : bootTimerParams[1],
                        warRule,
                        gameConfig,
                        warEventFullData,
                        callbackOnModify: (newValue: number | string | null) => {
                            if ((typeof newValue == "string") || (newValue == null)) {
                                throw Helpers.newError(`Invalid newValue: ${newValue}`);
                            }
                            McrCreateModel.setTimerIncrementalInitialTime(newValue);
                            this._updateCommonWarBasicSettingsPage();
                        },
                    },
                    {
                        settingsType    : WarBasicSettingsType.TimerIncrementalParam2,
                        currentValue    : bootTimerParams[2],
                        warRule,
                        gameConfig,
                        warEventFullData,
                        callbackOnModify: (newValue: number | string | null) => {
                            if ((typeof newValue == "string") || (newValue == null)) {
                                throw Helpers.newError(`Invalid newValue: ${newValue}`);
                            }
                            McrCreateModel.setTimerIncrementalIncrementalValue(newValue);
                            this._updateCommonWarBasicSettingsPage();
                        },
                    },
                );
            } else {
                throw Helpers.newError(`Invalid timerType: ${timerType}`);
            }

            return openData;
        }
        private _createDataForCommonMapInfoPage(): OpenDataForCommonWarMapInfoPage {
            const mapId = McrCreateModel.getMapId();
            return mapId == null
                ? null
                : {
                    gameConfig  : McrCreateModel.getGameConfig(),
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
                { type: NotifyType.McrCreateTeamIndexChanged,          callback: this._onNotifyMcrCreateTeamIndexChanged },
                { type: NotifyType.McrCreateSelfPlayerIndexChanged,    callback: this._onNotifyMcrCreateSelfPlayerIndexChanged },
            ]);
        }

        protected _onDataChanged(): void {
            this._updateLabelName();
            this._updateState();
        }

        public onItemTapEvent(): void {
            const data = this.data;
            if (data) {
                const creator       = McrCreateModel;
                const playerIndex   = data.playerIndex;
                creator.setSelfPlayerIndex(playerIndex);

                const availableCoIdArray = WarRuleHelpers.getAvailableCoIdArrayForPlayer({
                    warRule         : creator.getWarRule(),
                    playerIndex,
                    gameConfig      : McrCreateModel.getGameConfig(),
                });
                if (availableCoIdArray.indexOf(creator.getSelfCoId()) < 0) {
                    creator.setSelfCoId(WarRuleHelpers.getRandomCoIdWithCoIdList(availableCoIdArray));
                }
            }
        }
        private _onNotifyLanguageChanged(): void {
            this._updateLabelName();
        }
        private _onNotifyMcrCreateTeamIndexChanged(): void {
            this._updateLabelName();
        }
        private _onNotifyMcrCreateSelfPlayerIndexChanged(): void {
            this._updateState();
        }

        private _updateLabelName(): void {
            const data = this.data;
            if (data) {
                const playerIndex       = data.playerIndex;
                this._labelName.text    = `P${playerIndex} (${Lang.getPlayerTeamName(WarRuleHelpers.getTeamIndex(McrCreateModel.getWarRule(), playerIndex))})`;
            }
        }
        private _updateState(): void {
            const data          = this.data;
            this.currentState   = ((data) && (data.playerIndex === McrCreateModel.getSelfPlayerIndex())) ? `down` : `up`;
        }
    }

    type DataForSkinIdRenderer = {
        skinId: number;
    };
    class SkinIdRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForSkinIdRenderer> {
        private readonly _imgColor! : TwnsUiImage.UiImage;

        protected _onOpened(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.McrCreateSelfSkinIdChanged, callback: this._onNotifyMcrCreateSelfSkinIdChanged },
            ]);
        }

        protected _onDataChanged(): void {
            this._updateImgColor();
        }

        public onItemTapEvent(): void {
            const data = this.data;
            if (data) {
                McrCreateModel.setSelfUnitAndTileSkinId(data.skinId);
            }
        }
        private _onNotifyMcrCreateSelfSkinIdChanged(): void {
            this._updateImgColor();
        }

        private _updateImgColor(): void {
            const data = this.data;
            if (data) {
                const skinId            = data.skinId;
                this._imgColor.source   = WarHelpers.WarCommonHelpers.getImageSourceForSkinId(skinId, McrCreateModel.getSelfUnitAndTileSkinId() === skinId);
            }
        }
    }
}

// export default TwnsMcrCreateSettingsPanel;
