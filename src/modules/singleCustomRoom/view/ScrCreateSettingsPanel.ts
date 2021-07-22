
import TwnsCommonConfirmPanel               from "../../common/view/CommonConfirmPanel";
import TwnsCommonMapInfoPage                from "../../common/view/CommonMapInfoPage";
import TwnsCommonWarBasicSettingsPage       from "../../common/view/CommonWarBasicSettingsPage";
import SpmModel                             from "../../singlePlayerMode/model/SpmModel";
import SpmProxy                             from "../../singlePlayerMode/model/SpmProxy";
import FlowManager                          from "../../tools/helpers/FlowManager";
import Helpers                              from "../../tools/helpers/Helpers";
import Types                                from "../../tools/helpers/Types";
import Lang                                 from "../../tools/lang/Lang";
import TwnsLangTextType                     from "../../tools/lang/LangTextType";
import TwnsNotifyType                       from "../../tools/notify/NotifyType";
import ProtoTypes                           from "../../tools/proto/ProtoTypes";
import TwnsUiButton                         from "../../tools/ui/UiButton";
import TwnsUiLabel                          from "../../tools/ui/UiLabel";
import TwnsUiPanel                          from "../../tools/ui/UiPanel";
import TwnsUiTab                            from "../../tools/ui/UiTab";
import TwnsUiTabItemRenderer                from "../../tools/ui/UiTabItemRenderer";
import WarMapModel                          from "../../warMap/model/WarMapModel";
import ScrCreateModel                       from "../model/ScrCreateModel";
import TwnsScrCreateAdvancedSettingsPage    from "./ScrCreateAdvancedSettingsPage";
import TwnsScrCreateMapListPanel            from "./ScrCreateMapListPanel";
import TwnsScrCreatePlayerInfoPage          from "./ScrCreatePlayerInfoPage";
import TwnsScrCreateSaveSlotsPanel          from "./ScrCreateSaveSlotsPanel";

namespace TwnsScrCreateSettingsPanel {
    import CommonConfirmPanel                       = TwnsCommonConfirmPanel.CommonConfirmPanel;
    import OpenDataForCommonWarBasicSettingsPage    = TwnsCommonWarBasicSettingsPage.OpenDataForCommonWarBasicSettingsPage;
    import ScrCreateAdvancedSettingsPage            = TwnsScrCreateAdvancedSettingsPage.ScrCreateAdvancedSettingsPage;
    import OpenDataForCommonMapInfoPage             = TwnsCommonMapInfoPage.OpenDataForCommonMapInfoPage;
    import ScrCreatePlayerInfoPage                  = TwnsScrCreatePlayerInfoPage.ScrCreatePlayerInfoPage;
    import LangTextType                             = TwnsLangTextType.LangTextType;
    import NotifyType                               = TwnsNotifyType.NotifyType;
    import WarBasicSettingsType                     = Types.WarBasicSettingsType;

    const CONFIRM_INTERVAL_MS = 5000;

    export class ScrCreateSettingsPanel extends TwnsUiPanel.UiPanel<void> {
        protected readonly _LAYER_TYPE   = Types.LayerType.Hud0;
        protected readonly _IS_EXCLUSIVE = true;

        private static _instance: ScrCreateSettingsPanel;

        private readonly _groupNavigator        : eui.Group;
        private readonly _labelSinglePlayer     : TwnsUiLabel.UiLabel;
        private readonly _labelCustomMode       : TwnsUiLabel.UiLabel;
        private readonly _labelChooseMap        : TwnsUiLabel.UiLabel;
        private readonly _labelGameSettings     : TwnsUiLabel.UiLabel;

        private readonly _groupTab              : eui.Group;
        private readonly _tabSettings           : TwnsUiTab.UiTab<DataForTabItemRenderer, void | OpenDataForCommonMapInfoPage | OpenDataForCommonWarBasicSettingsPage>;

        private readonly _btnBack               : TwnsUiButton.UiButton;
        private readonly _btnConfirm            : TwnsUiButton.UiButton;

        private _timeoutIdForBtnConfirm : number;
        private _isTabInitialized       = false;

        public static show(): void {
            if (!ScrCreateSettingsPanel._instance) {
                ScrCreateSettingsPanel._instance = new ScrCreateSettingsPanel();
            }
            ScrCreateSettingsPanel._instance.open(undefined);
        }
        public static async hide(): Promise<void> {
            if (ScrCreateSettingsPanel._instance) {
                await ScrCreateSettingsPanel._instance.close();
            }
        }

        public constructor() {
            super();

            this.skinName = "resource/skins/singleCustomRoom/ScrCreateSettingsPanel.exml";
        }

        protected async _onOpened(): Promise<void> {
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

            this._isTabInitialized = false;
            this._tabSettings.bindData([
                {
                    tabItemData : { name: Lang.getText(LangTextType.B0002) },
                    pageClass   : TwnsCommonWarBasicSettingsPage.CommonWarBasicSettingsPage,
                    pageData    : await this._createDataForCommonWarBasicSettingsPage(),
                },
                {
                    tabItemData : { name: Lang.getText(LangTextType.B0003) },
                    pageClass   : ScrCreateAdvancedSettingsPage,
                },
                {
                    tabItemData : { name: Lang.getText(LangTextType.B0298) },
                    pageClass   : TwnsCommonMapInfoPage.CommonMapInfoPage,
                    pageData    : this._createDataForCommonMapInfoPage(),
                },
                {
                    tabItemData : { name: Lang.getText(LangTextType.B0224) },
                    pageClass   : ScrCreatePlayerInfoPage,
                },
            ]);
            this._isTabInitialized = true;

            this._showOpenAnimation();

            this._updateComponentsForLanguage();
            this._btnConfirm.enabled = true;
        }

        protected async _onClosed(): Promise<void> {
            await this._showCloseAnimation();
            this._clearTimeoutForBtnConfirm();
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Callbacks.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _onTouchedBtnBack(): void {
            this.close();
            TwnsScrCreateMapListPanel.ScrCreateMapListPanel.show();
        }
        private _onTouchedBtnConfirm(): void {
            const data      = ScrCreateModel.getData();
            const callback  = () => {
                SpmProxy.reqSpmCreateScw(data);
                this._btnConfirm.enabled = false;
                this._resetTimeoutForBtnConfirm();
            };

            if (SpmModel.checkIsEmpty(data.slotIndex)) {
                callback();
            } else {
                CommonConfirmPanel.show({
                    content : Lang.getText(LangTextType.A0070),
                    callback,
                });
            }
        }

        private _onNotifyLanguageChanged(): void {
            this._updateComponentsForLanguage();
        }
        private _onNotifyMsgSpmCreateScw(e: egret.Event): void {
            const data = e.data as ProtoTypes.NetMessage.MsgSpmCreateScw.IS;
            FlowManager.gotoSinglePlayerWar({
                warData         : data.warData,
                slotExtraData   : data.extraData,
                slotIndex       : data.slotIndex,
            });
        }
        private _onNotifyScrCreateWarSaveSlotChanged(): void {
            this._updateCommonWarBasicSettingsPage();
        }

        private _resetTimeoutForBtnConfirm(): void {
            this._clearTimeoutForBtnConfirm();
            this._timeoutIdForBtnConfirm = egret.setTimeout(() => {
                this._btnConfirm.enabled     = true;
                this._timeoutIdForBtnConfirm = undefined;
            }, this, CONFIRM_INTERVAL_MS);
        }

        private _clearTimeoutForBtnConfirm(): void {
            if (this._timeoutIdForBtnConfirm != null) {
                egret.clearTimeout(this._timeoutIdForBtnConfirm);
                this._timeoutIdForBtnConfirm = undefined;
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

        private _createDataForCommonMapInfoPage(): OpenDataForCommonMapInfoPage {
            const mapId = ScrCreateModel.getMapId();
            return mapId == null
                ? {}
                : { mapInfo: { mapId } };
        }

        private async _createDataForCommonWarBasicSettingsPage(): Promise<OpenDataForCommonWarBasicSettingsPage> {
            const warRule   = ScrCreateModel.getWarRule();
            const openData  : OpenDataForCommonWarBasicSettingsPage = {
                dataArrayForListSettings: [
                    {
                        settingsType    : WarBasicSettingsType.MapName,
                        currentValue    : await WarMapModel.getMapNameInCurrentLanguage(ScrCreateModel.getMapId()),
                        warRule,
                        callbackOnModify: undefined,
                    },
                    {
                        settingsType    : WarBasicSettingsType.WarRuleTitle,
                        currentValue    : undefined,
                        warRule,
                        callbackOnModify: async () => {
                            await ScrCreateModel.tickPresetWarRuleId();
                            this._updateCommonWarBasicSettingsPage();
                        },
                    },
                    {
                        settingsType    : WarBasicSettingsType.HasFog,
                        currentValue    : undefined,
                        warRule,
                        callbackOnModify: () => {
                            ScrCreateModel.setHasFog(!ScrCreateModel.getHasFog());
                            ScrCreateModel.setCustomWarRuleId();
                            this._updateCommonWarBasicSettingsPage();
                        },
                    },
                    {
                        settingsType    : WarBasicSettingsType.SpmSaveSlotIndex,
                        currentValue    : ScrCreateModel.getSaveSlotIndex(),
                        warRule,
                        callbackOnModify: () => {
                            TwnsScrCreateSaveSlotsPanel.ScrCreateSaveSlotsPanel.show();
                        },
                    },
                    {
                        settingsType    : WarBasicSettingsType.SpmSaveSlotComment,
                        currentValue    : ScrCreateModel.getSlotComment(),
                        warRule,
                        callbackOnModify: (newValue: string) => {
                            ScrCreateModel.setSlotComment(newValue || undefined);
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
        private _showOpenAnimation(): void {
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
        }
        private async _showCloseAnimation(): Promise<void> {
            return new Promise<void>(resolve => {
                Helpers.resetTween({
                    obj         : this._groupNavigator,
                    beginProps  : { alpha: 1, y: 20 },
                    endProps    : { alpha: 0, y: -20 },
                    callback    : resolve,
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
            });
        }
    }

    type DataForTabItemRenderer = {
        name: string;
    };
    class TabItemRenderer extends TwnsUiTabItemRenderer.UiTabItemRenderer<DataForTabItemRenderer> {
        private _labelName: TwnsUiLabel.UiLabel;

        protected _onDataChanged(): void {
            this._labelName.text = this.data.name;
        }
    }
}

export default TwnsScrCreateSettingsPanel;
