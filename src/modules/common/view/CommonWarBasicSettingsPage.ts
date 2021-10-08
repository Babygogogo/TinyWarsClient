
// import CommonConstants          from "../../tools/helpers/CommonConstants";
// import FloatText                from "../../tools/helpers/FloatText";
// import Helpers                  from "../../tools/helpers/Helpers";
// import Types                    from "../../tools/helpers/Types";
// import Lang                     from "../../tools/lang/Lang";
// import TwnsLangTextType         from "../../tools/lang/LangTextType";
// import TwnsNotifyType           from "../../tools/notify/NotifyType";
// import ProtoTypes               from "../../tools/proto/ProtoTypes";
// import TwnsUiButton             from "../../tools/ui/UiButton";
// import TwnsUiLabel              from "../../tools/ui/UiLabel";
// import TwnsUiListItemRenderer   from "../../tools/ui/UiListItemRenderer";
// import TwnsUiScrollList         from "../../tools/ui/UiScrollList";
// import TwnsUiTabPage            from "../../tools/ui/UiTabPage";
// import TwnsCommonConfirmPanel   from "./CommonConfirmPanel";
// import TwnsCommonHelpPanel      from "./CommonHelpPanel";
// import TwnsCommonInputPanel     from "./CommonInputPanel";

namespace TwnsCommonWarBasicSettingsPage {
    import CommonHelpPanel      = TwnsCommonHelpPanel.CommonHelpPanel;
    import LangTextType         = TwnsLangTextType.LangTextType;
    import NotifyType           = TwnsNotifyType.NotifyType;
    import WarBasicSettingsType = Types.WarBasicSettingsType;

    export type OpenDataForCommonWarBasicSettingsPage = {
        dataArrayForListSettings    : DataForSettingsRenderer[];
    } | null;
    export class CommonWarBasicSettingsPage extends TwnsUiTabPage.UiTabPage<OpenDataForCommonWarBasicSettingsPage> {
        private readonly _listSettings! : TwnsUiScrollList.UiScrollList<DataForSettingsRenderer>;

        public constructor() {
            super();

            this.skinName = "resource/skins/common/CommonWarBasicSettingsPage.exml";
        }

        protected _onOpened(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged, callback: this._onNotifyLanguageChanged },
            ]);

            this._listSettings.setItemRenderer(SettingsRenderer);
            this.left   = 0;
            this.right  = 0;
            this.top    = 0;
            this.bottom = 0;

            this._updateView();
        }

        private _onNotifyLanguageChanged(): void {
            this._updateView();
        }

        ////////////////////////////////////////////////////////////////////////////////
        // View functions.
        ////////////////////////////////////////////////////////////////////////////////
        private _updateView(): void {
            const openData = this._getOpenData();
            if (openData) {
                this._listSettings.bindData(openData.dataArrayForListSettings);
            }
        }
    }

    type DataForSettingsRenderer = {
        settingsType    : WarBasicSettingsType;
        currentValue    : number | string | null;
        warRule         : ProtoTypes.WarRule.IWarRule;
        callbackOnModify: ((newValue: string | number | null) => void) | null;
    };
    class SettingsRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForSettingsRenderer> {
        private readonly _labelTitle!   : TwnsUiLabel.UiLabel;
        private readonly _labelValue!   : TwnsUiLabel.UiLabel;
        private readonly _btnModify!    : TwnsUiButton.UiButton;
        private readonly _btnHelp!      : TwnsUiButton.UiButton;

        protected _onOpened(): void {
            this._setUiListenerArray([
                { ui: this._btnModify,  callback: this._onTouchedBtnModify },
                { ui: this._btnHelp,    callback: this._onTouchedBtnHelp },
            ]);
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged, callback: this._onNotifyLanguageChanged },
            ]);
        }
        protected _onDataChanged(): void {
            this._updateView();
        }

        private _onTouchedBtnModify(): void {
            const data      = this._getData();
            const callback  = data.callbackOnModify;
            if (callback == null) {
                return;
            }

            const settingsType = data.settingsType;
            if (settingsType === WarBasicSettingsType.MapName) {
                this._modifyAsMapName();
            } else if (settingsType === WarBasicSettingsType.WarName) {
                this._modifyAsWarName();
            } else if (settingsType === WarBasicSettingsType.WarPassword) {
                this._modifyAsWarPassword();
            } else if (settingsType === WarBasicSettingsType.WarComment) {
                this._modifyAsWarComment();
            } else if (settingsType === WarBasicSettingsType.WarRuleTitle) {
                this._modifyAsWarRuleTitle();
            } else if (settingsType === WarBasicSettingsType.HasFog) {
                this._modifyAsHasFog();
            } else if (settingsType === WarBasicSettingsType.TimerType) {
                this._modifyAsTimerType();
            } else if (settingsType === WarBasicSettingsType.TimerRegularParam) {
                this._modifyAsTimerRegularParam();
            } else if (settingsType === WarBasicSettingsType.TimerIncrementalParam1) {
                this._modifyAsTimerIncrementalParam1();
            } else if (settingsType === WarBasicSettingsType.TimerIncrementalParam2) {
                this._modifyAsTimerIncrementalParam2();
            } else if (settingsType === WarBasicSettingsType.SpmSaveSlotIndex) {
                this._modifyAsSpmSaveSlotIndex();
            } else if (settingsType === WarBasicSettingsType.SpmSaveSlotComment) {
                this._modifyAsSpmSaveSlotComment();
            } else {
                throw Helpers.newError(`CommonWarBasicSettingsPage.SettingsRenderer._onTouchedBtnModify() invalid settingsType: ${settingsType}`);
            }
        }
        private _onTouchedBtnHelp(): void {
            const settingsType = this._getData().settingsType;
            if (settingsType === WarBasicSettingsType.HasFog) {
                CommonHelpPanel.show({
                    title  : Lang.getText(LangTextType.B0020),
                    content: Lang.getText(LangTextType.R0002),
                });
            } else if (settingsType === WarBasicSettingsType.TimerType) {
                CommonHelpPanel.show({
                    title  : Lang.getText(LangTextType.B0574),
                    content: Lang.getText(LangTextType.R0003),
                });
            }
        }
        private _onNotifyLanguageChanged(): void {
            this._updateView();
        }

        private _updateView(): void {
            const data              = this._getData();
            const settingsType      = data.settingsType;
            this._labelTitle.text   = Lang.getWarBasicSettingsName(settingsType) || CommonConstants.ErrorTextForUndefined;
            this._btnModify.visible = data.callbackOnModify != null;

            if (settingsType === WarBasicSettingsType.MapName) {
                this._updateViewAsMapName();
            } else if (settingsType === WarBasicSettingsType.WarName) {
                this._updateViewAsWarName();
            } else if (settingsType === WarBasicSettingsType.WarPassword) {
                this._updateViewAsWarPassword();
            } else if (settingsType === WarBasicSettingsType.WarComment) {
                this._updateViewAsWarComment();
            } else if (settingsType === WarBasicSettingsType.WarRuleTitle) {
                this._updateViewAsWarRuleTitle();
            } else if (settingsType === WarBasicSettingsType.HasFog) {
                this._updateViewAsHasFog();
            } else if (settingsType === WarBasicSettingsType.TimerType) {
                this._updateViewAsTimerType();
            } else if (settingsType === WarBasicSettingsType.TimerRegularParam) {
                this._updateViewAsTimerRegularParam();
            } else if (settingsType === WarBasicSettingsType.TimerIncrementalParam1) {
                this._updateViewAsTimerIncrementalParam1();
            } else if (settingsType === WarBasicSettingsType.TimerIncrementalParam2) {
                this._updateViewAsTimerIncrementalParam2();
            } else if (settingsType === WarBasicSettingsType.SpmSaveSlotIndex) {
                this._updateViewAsSpmSaveSlotIndex();
            } else if (settingsType === WarBasicSettingsType.SpmSaveSlotComment) {
                this._updateViewAsSpmSaveSlotComment();
            } else {
                throw Helpers.newError(`CommonWarBasicSettingsPage.SettingsRenderer._updateView() invalid settingsType: ${settingsType}.`);
            }
        }
        private _updateViewAsMapName(): void {
            const data              = this._getData();
            this._labelValue.text   = `${data.currentValue}`;
            this._btnHelp.visible   = false;
        }
        private _updateViewAsWarName(): void {
            const data              = this._getData();
            this._labelValue.text   = `${data.currentValue || ``}`;
            this._btnHelp.visible   = false;
        }
        private _updateViewAsWarPassword(): void {
            const data              = this._getData();
            this._labelValue.text   = `${data.currentValue || ``}`;
            this._btnHelp.visible   = false;
        }
        private _updateViewAsWarComment(): void {
            const data              = this._getData();
            this._labelValue.text   = `${data.currentValue || ``}`;
            this._btnHelp.visible   = false;
        }
        private _updateViewAsWarRuleTitle(): void {
            const data              = this._getData();
            const warRule           = data.warRule;
            const labelValue        = this._labelValue;
            labelValue.text         = Lang.getWarRuleNameInLanguage(warRule) || CommonConstants.ErrorTextForUndefined;
            labelValue.textColor    = warRule.ruleId == null ? 0xFFFF00 : 0xFFFFFF;
            this._btnHelp.visible   = false;
        }
        private _updateViewAsHasFog(): void {
            const data              = this._getData();
            const hasFog            = data.warRule.ruleForGlobalParams?.hasFogByDefault;
            const labelValue        = this._labelValue;
            labelValue.text         = Lang.getText(hasFog ? LangTextType.B0012 : LangTextType.B0013);
            labelValue.textColor    = hasFog ? 0xFFFF00 : 0xFFFFFF;
            this._btnHelp.visible   = true;
        }
        private _updateViewAsTimerType(): void {
            const data              = this._getData();
            this._labelValue.text   = Lang.getBootTimerTypeName(data.currentValue as Types.BootTimerType) || CommonConstants.ErrorTextForUndefined;
            this._btnHelp.visible   = true;
        }
        private _updateViewAsTimerRegularParam(): void {
            const data              = this._getData();
            this._labelValue.text   = Helpers.getTimeDurationText2(data.currentValue as number);
            this._btnHelp.visible   = false;
        }
        private _updateViewAsTimerIncrementalParam1(): void {
            const data              = this._getData();
            this._labelValue.text   = Helpers.getTimeDurationText2(data.currentValue as number);
            this._btnHelp.visible   = false;
        }
        private _updateViewAsTimerIncrementalParam2(): void {
            const data              = this._getData();
            this._labelValue.text   = Helpers.getTimeDurationText2(data.currentValue as number);
            this._btnHelp.visible   = false;
        }
        private _updateViewAsSpmSaveSlotIndex(): void {
            const data              = this._getData();
            this._labelValue.text   = `${data.currentValue}`;
            this._btnHelp.visible   = false;
        }
        private _updateViewAsSpmSaveSlotComment(): void {
            const data              = this._getData();
            this._labelValue.text   = `${data.currentValue || ``}`;
            this._btnHelp.visible   = false;
        }

        private _modifyAsMapName(): void {
            // nothing to do
        }
        private _modifyAsWarName(): void {
            const data          = this._getData();
            const callback      = Helpers.getExisted(data.callbackOnModify);
            const currentValue  = data.currentValue;
            TwnsCommonInputPanel.CommonInputPanel.show({
                title           : Lang.getText(LangTextType.B0185),
                currentValue    : `${currentValue || ``}`,
                maxChars        : CommonConstants.WarNameMaxLength,
                charRestrict    : null,
                tips            : null,
                callback        : panel => {
                    const newValue = panel.getInputText() || null;
                    if (newValue != currentValue) {
                        callback(newValue);
                    }
                },
            });
        }
        private _modifyAsWarPassword(): void {
            const data          = this._getData();
            const callback      = Helpers.getExisted(data.callbackOnModify);
            const currentValue  = data.currentValue;
            TwnsCommonInputPanel.CommonInputPanel.show({
                title           : Lang.getText(LangTextType.B0186),
                currentValue    : `${currentValue || ``}`,
                maxChars        : CommonConstants.WarPasswordMaxLength,
                charRestrict    : `0-9`,
                tips            : Lang.getFormattedText(LangTextType.F0068, CommonConstants.WarPasswordMaxLength),
                callback        : panel => {
                    const newValue = panel.getInputText() || null;
                    if (newValue != currentValue) {
                        callback(newValue);
                    }
                },
            });
        }
        private _modifyAsWarComment(): void {
            const data          = this._getData();
            const callback      = Helpers.getExisted(data.callbackOnModify);
            const currentValue  = data.currentValue;
            TwnsCommonInputPanel.CommonInputPanel.show({
                title           : Lang.getText(LangTextType.B0187),
                currentValue    : `${currentValue || ``}`,
                maxChars        : CommonConstants.WarCommentMaxLength,
                charRestrict    : null,
                tips            : null,
                callback        : panel => {
                    const newValue = panel.getInputText() || null;
                    if (newValue != currentValue) {
                        callback(null);
                    }
                },
            });
        }
        private _modifyAsWarRuleTitle(): void {
            const data      = this._getData();
            const callback  = Helpers.getExisted(data.callbackOnModify);
            callback(null);
        }
        private _modifyAsHasFog(): void {
            const data      = this._getData();
            const callback  = Helpers.getExisted(data.callbackOnModify);
            if (data.warRule.ruleId == null) {
                callback(null);
            } else {
                TwnsCommonConfirmPanel.CommonConfirmPanel.show({
                    content : Lang.getText(LangTextType.A0129),
                    callback: () => callback(null),
                });
            }
        }
        private _modifyAsTimerType(): void {
            const data      = this._getData();
            const callback  = Helpers.getExisted(data.callbackOnModify);
            callback(null);
        }
        private _modifyAsTimerRegularParam(): void {
            const data      = this._getData();
            const callback  = Helpers.getExisted(data.callbackOnModify);
            callback(null);
        }
        private _modifyAsTimerIncrementalParam1(): void {
            const data          = this._getData();
            const callback      = Helpers.getExisted(data.callbackOnModify);
            const minValue      = 1;
            const maxValue      = CommonConstants.WarBootTimerIncrementalMaxLimit;
            const currentValue  = data.currentValue;
            TwnsCommonInputPanel.CommonInputPanel.show({
                title           : Lang.getText(LangTextType.B0389),
                currentValue    : `${currentValue}`,
                maxChars        : 5,
                charRestrict    : `0-9`,
                tips            : `${Lang.getText(LangTextType.B0319)}: [${minValue}, ${maxValue}] (${Lang.getText(LangTextType.B0017)})`,
                callback        : panel => {
                    const text  = panel.getInputText();
                    const value = text ? Number(text) : NaN;
                    if ((isNaN(value)) || (value > maxValue) || (value < minValue)) {
                        FloatText.show(Lang.getText(LangTextType.A0098));
                    } else {
                        if (value !== currentValue) {
                            callback(value);
                        }
                    }
                },
            });
        }
        private _modifyAsTimerIncrementalParam2(): void {
            const data          = this._getData();
            const callback      = Helpers.getExisted(data.callbackOnModify);
            const minValue      = 0;
            const maxValue      = CommonConstants.WarBootTimerIncrementalMaxLimit;
            const currentValue  = data.currentValue;
            TwnsCommonInputPanel.CommonInputPanel.show({
                title           : Lang.getText(LangTextType.B0390),
                currentValue    : `${currentValue}`,
                maxChars        : 5,
                charRestrict    : `0-9`,
                tips            : `${Lang.getText(LangTextType.B0319)}: [${minValue}, ${maxValue}] (${Lang.getText(LangTextType.B0017)})`,
                callback        : panel => {
                    const text  = panel.getInputText();
                    const value = text ? Number(text) : NaN;
                    if ((isNaN(value)) || (value > maxValue) || (value < minValue)) {
                        FloatText.show(Lang.getText(LangTextType.A0098));
                    } else {
                        if (value !== currentValue) {
                            callback(value);
                        }
                    }
                },
            });
        }
        private _modifyAsSpmSaveSlotIndex(): void {
            const data      = this._getData();
            const callback  = Helpers.getExisted(data.callbackOnModify);
            callback(null);
        }
        private _modifyAsSpmSaveSlotComment(): void {
            const data          = this._getData();
            const callback      = Helpers.getExisted(data.callbackOnModify);
            const currentValue  = data.currentValue;
            TwnsCommonInputPanel.CommonInputPanel.show({
                title           : Lang.getText(LangTextType.B0605),
                currentValue    : `${currentValue || ``}`,
                maxChars        : CommonConstants.SpmSaveSlotCommentMaxLength,
                charRestrict    : null,
                tips            : null,
                callback        : panel => {
                    const newValue = panel.getInputText() || null;
                    if (newValue != currentValue) {
                        callback(newValue);
                    }
                },
            });
        }
    }
}

// export default TwnsCommonWarBasicSettingsPage;
