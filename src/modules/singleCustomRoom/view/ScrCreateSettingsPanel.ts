
// import TwnsCommonConfirmPanel               from "../../common/view/CommonConfirmPanel";
// import TwnsCommonWarBasicSettingsPage       from "../../common/view/CommonWarBasicSettingsPage";
// import TwnsCommonWarMapInfoPage             from "../../common/view/CommonWarMapInfoPage";
// import SpmModel                             from "../../singlePlayerMode/model/SpmModel";
// import SpmProxy                             from "../../singlePlayerMode/model/SpmProxy";
// import FlowManager                          from "../../tools/helpers/FlowManager";
// import Helpers                              from "../../tools/helpers/Helpers";
// import Types                                from "../../tools/helpers/Types";
// import Lang                                 from "../../tools/lang/Lang";
// import TwnsLangTextType                     from "../../tools/lang/LangTextType";
// import Notify                       from "../../tools/notify/NotifyType";
// import ProtoTypes                           from "../../tools/proto/ProtoTypes";
// import TwnsUiButton                         from "../../tools/ui/UiButton";
// import TwnsUiLabel                          from "../../tools/ui/UiLabel";
// import TwnsUiPanel                          from "../../tools/ui/UiPanel";
// import TwnsUiTab                            from "../../tools/ui/UiTab";
// import TwnsUiTabItemRenderer                from "../../tools/ui/UiTabItemRenderer";
// import WarMapModel                          from "../../warMap/model/WarMapModel";
// import ScrCreateModel                       from "../model/ScrCreateModel";
// import TwnsScrCreateAdvancedSettingsPage    from "./ScrCreateAdvancedSettingsPage";
// import TwnsScrCreateMapListPanel            from "./ScrCreateMapListPanel";
// import TwnsScrCreatePlayerInfoPage          from "./ScrCreatePlayerInfoPage";
// import TwnsScrCreateSaveSlotsPanel          from "./ScrCreateSaveSlotsPanel";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.SingleCustomRoom {
    import OpenDataForCommonWarBasicSettingsPage    = Common.OpenDataForCommonWarBasicSettingsPage;
    import ScrCreateAdvancedSettingsPage            = SingleCustomRoom.ScrCreateAdvancedSettingsPage;
    import OpenDataForCommonWarMapInfoPage          = Common.OpenDataForCommonMapInfoPage;
    import ScrCreatePlayerInfoPage                  = SingleCustomRoom.ScrCreatePlayerInfoPage;
    import LangTextType                             = Lang.LangTextType;
    import NotifyType                               = Notify.NotifyType;
    import WarBasicSettingsType                     = Types.WarBasicSettingsType;

    const CONFIRM_INTERVAL_MS = 5000;

    export type OpenDataForScrCreateSettingsPanel = void;
    export class ScrCreateSettingsPanel extends TwnsUiPanel.UiPanel<OpenDataForScrCreateSettingsPanel> {
        private readonly _groupNavigator!       : eui.Group;
        private readonly _labelSinglePlayer!    : TwnsUiLabel.UiLabel;
        private readonly _labelCustomMode!      : TwnsUiLabel.UiLabel;
        private readonly _labelChooseMap!       : TwnsUiLabel.UiLabel;
        private readonly _labelGameSettings!    : TwnsUiLabel.UiLabel;

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
                { type: NotifyType.LanguageChanged,                 callback: this._onNotifyLanguageChanged },
                { type: NotifyType.MsgSpmCreateScw,                 callback: this._onNotifyMsgSpmCreateScw },
                { type: NotifyType.ScrCreateWarSaveSlotChanged,     callback: this._onNotifyScrCreateWarSaveSlotChanged },
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
                    pageClass   : ScrCreateAdvancedSettingsPage,
                    pageData    : null,
                },
                {
                    tabItemData : { name: Lang.getText(LangTextType.B0298) },
                    pageClass   : Common.CommonWarMapInfoPage,
                    pageData    : this._createDataForCommonMapInfoPage(),
                },
                {
                    tabItemData : { name: Lang.getText(LangTextType.B0224) },
                    pageClass   : ScrCreatePlayerInfoPage,
                    pageData    : null,
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
            PanelHelpers.open(PanelHelpers.PanelDict.ScrCreateMapListPanel, null);
        }
        private async _onTouchedBtnConfirm(): Promise<void> {
            const data      = SingleCustomRoom.ScrCreateModel.getData();
            const callback  = () => {
                SinglePlayerMode.SpmProxy.reqSpmCreateScw(data);
                this._btnConfirm.enabled = false;
                this._resetTimeoutForBtnConfirm();
            };

            if (await SinglePlayerMode.SpmModel.checkIsEmpty(Helpers.getExisted(data.slotIndex))) {
                callback();
            } else {
                PanelHelpers.open(PanelHelpers.PanelDict.CommonConfirmPanel, {
                    content : Lang.getText(LangTextType.A0070),
                    callback,
                });
            }
        }

        private _onNotifyLanguageChanged(): void {
            this._updateComponentsForLanguage();
        }
        private _onNotifyMsgSpmCreateScw(e: egret.Event): void {
            const data = e.data as CommonProto.NetMessage.MsgSpmCreateScw.IS;
            FlowManager.gotoSinglePlayerWar({
                warData         : Helpers.getExisted(data.warData),
                slotExtraData   : Helpers.getExisted(data.extraData),
                slotIndex       : Helpers.getExisted(data.slotIndex),
            });
        }
        private _onNotifyScrCreateWarSaveSlotChanged(): void {
            this._updateCommonWarBasicSettingsPage();
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
            this._labelSinglePlayer.text        = Lang.getText(LangTextType.B0138);
            this._labelCustomMode.text          = Lang.getText(LangTextType.B0603);
            this._labelChooseMap.text           = Lang.getText(LangTextType.B0227);
            this._labelGameSettings.text        = Lang.getText(LangTextType.B0604);
            this._btnBack.label                 = Lang.getText(LangTextType.B0146);
            this._btnConfirm.label              = Lang.getText(LangTextType.B0026);
        }

        private async _updateCommonWarBasicSettingsPage(): Promise<void> {
            if (this._isTabInitialized) {
                this._tabSettings.updatePageData(0, await this._createDataForCommonWarBasicSettingsPage());
            }
        }

        private _createDataForCommonMapInfoPage(): OpenDataForCommonWarMapInfoPage {
            const mapId = SingleCustomRoom.ScrCreateModel.getMapId();
            return mapId == null
                ? null
                : {
                    gameConfig  : SingleCustomRoom.ScrCreateModel.getGameConfig(),
                    mapInfo     : { mapId },
                };
        }

        private async _createDataForCommonWarBasicSettingsPage(): Promise<OpenDataForCommonWarBasicSettingsPage> {
            const instanceWarRule   = SingleCustomRoom.ScrCreateModel.getInstanceWarRule();
            const gameConfig        = SingleCustomRoom.ScrCreateModel.getGameConfig();
            const warEventFullData  = (await SingleCustomRoom.ScrCreateModel.getMapRawData()).warEventFullData ?? null;
            const openData          : OpenDataForCommonWarBasicSettingsPage = {
                dataArrayForListSettings: [
                    {
                        settingsType    : WarBasicSettingsType.MapId,
                        currentValue    : SingleCustomRoom.ScrCreateModel.getMapId(),
                        instanceWarRule,
                        gameConfig,
                        warEventFullData,
                        callbackOnModify: null,
                    },
                    {
                        settingsType    : WarBasicSettingsType.WarRuleTitle,
                        currentValue    : null,
                        instanceWarRule,
                        gameConfig,
                        warEventFullData,
                        callbackOnModify: async () => {
                            await SingleCustomRoom.ScrCreateModel.tickTemplateWarRuleId();
                            this._updateCommonWarBasicSettingsPage();
                        },
                    },
                    {
                        settingsType    : WarBasicSettingsType.HasFog,
                        currentValue    : null,
                        instanceWarRule,
                        gameConfig,
                        warEventFullData,
                        callbackOnModify: () => {
                            SingleCustomRoom.ScrCreateModel.setHasFog(!SingleCustomRoom.ScrCreateModel.getHasFog());
                            SingleCustomRoom.ScrCreateModel.setCustomWarRuleId();
                            this._updateCommonWarBasicSettingsPage();
                        },
                    },
                    {
                        settingsType    : WarBasicSettingsType.Weather,
                        currentValue    : null,
                        instanceWarRule,
                        gameConfig,
                        warEventFullData,
                        callbackOnModify: () => {
                            SingleCustomRoom.ScrCreateModel.tickDefaultWeatherType();
                            SingleCustomRoom.ScrCreateModel.setCustomWarRuleId();
                            this._updateCommonWarBasicSettingsPage();
                        },
                    },
                    {
                        settingsType    : WarBasicSettingsType.WarEvent,
                        currentValue    : null,
                        instanceWarRule,
                        gameConfig,
                        warEventFullData,
                        callbackOnModify: null,
                    },
                    {
                        settingsType    : WarBasicSettingsType.SpmSaveSlotIndex,
                        currentValue    : SingleCustomRoom.ScrCreateModel.getSaveSlotIndex(),
                        instanceWarRule,
                        gameConfig,
                        warEventFullData,
                        callbackOnModify: () => {
                            PanelHelpers.open(PanelHelpers.PanelDict.SpmCreateSaveSlotsPanel, {
                                currentSlotIndex    : SingleCustomRoom.ScrCreateModel.getSaveSlotIndex(),
                                callback            : slotIndex => {
                                    SingleCustomRoom.ScrCreateModel.setSaveSlotIndex(slotIndex);
                                },
                            });
                        },
                    },
                    {
                        settingsType    : WarBasicSettingsType.SpmSaveSlotComment,
                        currentValue    : SingleCustomRoom.ScrCreateModel.getSlotComment(),
                        instanceWarRule,
                        gameConfig,
                        warEventFullData,
                        callbackOnModify: (newValue: string | number | null) => {
                            if (typeof newValue === "number") {
                                throw Helpers.newError(`Invalid newValue: ${newValue}`, ClientErrorCode.ScrCreateSettingsPanel_CreateDataForCommonWarBasicSettingsPage_00);
                            }
                            SingleCustomRoom.ScrCreateModel.setSlotComment(newValue);
                            this._updateCommonWarBasicSettingsPage();
                        },
                    },
                ],
            };

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

// export default TwnsScrCreateSettingsPanel;
