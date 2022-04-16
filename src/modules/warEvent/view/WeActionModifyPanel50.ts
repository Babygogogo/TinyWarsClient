
// import TwnsBwWar                    from "../../baseWar/model/BwWar";
// import TwnsBwDialoguePanel          from "../../baseWar/view/BwDialoguePanel";
// import TwnsCommonChooseCoPanel      from "../../common/view/CommonChooseCoPanel";
// import TwnsCommonConfirmPanel       from "../../common/view/CommonConfirmPanel";
// import TwnsCommonInputPanel         from "../../common/view/CommonInputPanel";
// import CommonConstants              from "../../tools/helpers/CommonConstants";
// import ConfigManager                from "../../tools/helpers/ConfigManager";
// import FloatText                    from "../../tools/helpers/FloatText";
// import Helpers                      from "../../tools/helpers/Helpers";
// import Types                        from "../../tools/helpers/Types";
// import Lang                         from "../../tools/lang/Lang";
// import TwnsLangTextType             from "../../tools/lang/LangTextType";
// import Notify                       from "../../tools/notify/Notify";
// import TwnsNotifyType               from "../../tools/notify/NotifyType";
// import ProtoTypes                   from "../../tools/proto/ProtoTypes";
// import TwnsUiButton                 from "../../tools/ui/UiButton";
// import TwnsUiImage                  from "../../tools/ui/UiImage";
// import TwnsUiLabel                  from "../../tools/ui/UiLabel";
// import TwnsUiListItemRenderer       from "../../tools/ui/UiListItemRenderer";
// import TwnsUiPanel                  from "../../tools/ui/UiPanel";
// import TwnsUiScrollList             from "../../tools/ui/UiScrollList";
// import WarEventHelper               from "../model/WarEventHelper";
// import TwnsWeActionTypeListPanel    from "./WeActionTypeListPanel";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.WarEvent {
    import NotifyType               = TwnsNotifyType.NotifyType;
    import IWarEventFullData        = CommonProto.Map.IWarEventFullData;
    import IWarEventAction          = CommonProto.WarEvent.IWarEventAction;
    import LangTextType             = TwnsLangTextType.LangTextType;
    import BwWar                    = BaseWar.BwWar;

    export type OpenDataForWeActionModifyPanel50 = {
        war         : BwWar;
        fullData    : IWarEventFullData;
        action      : IWarEventAction;
    };
    export class WeActionModifyPanel50 extends TwnsUiPanel.UiPanel<OpenDataForWeActionModifyPanel50> {
        private readonly _btnBack!              : TwnsUiButton.UiButton;
        private readonly _btnType!              : TwnsUiButton.UiButton;
        private readonly _labelTitle!           : TwnsUiLabel.UiLabel;
        private readonly _labelDesc!            : TwnsUiLabel.UiLabel;
        private readonly _labelError!           : TwnsUiLabel.UiLabel;

        private readonly _btnChinese!           : TwnsUiButton.UiButton;
        private readonly _labelChinese!         : TwnsUiLabel.UiLabel;
        private readonly _btnEnglish!           : TwnsUiButton.UiButton;
        private readonly _labelEnglish!         : TwnsUiLabel.UiLabel;

        protected _onOpening(): void {
            this._setUiListenerArray([
                { ui: this._btnType,            callback: this._onTouchedBtnType },
                { ui: this._btnBack,            callback: this.close },
                { ui: this._btnChinese,         callback: this._onTouchedBtnChinese },
                { ui: this._btnEnglish,         callback: this._onTouchedBtnEnglish },
            ]);
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,            callback: this._onNotifyLanguageChanged },
                { type: NotifyType.WarEventFullDataChanged,    callback: this._onNotifyWarEventFullDataChanged },
            ]);
            this._setIsTouchMaskEnabled();
            this._setIsCloseOnTouchedMask();
        }
        protected async _updateOnOpenDataChanged(): Promise<void> {
            this._updateView();
        }
        protected _onClosing(): void {
            // nothing to do
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Event callbacks.
        ////////////////////////////////////////////////////////////////////////////////
        private _onNotifyLanguageChanged(): void {
            this._updateComponentsForLanguage();
        }

        private _onNotifyWarEventFullDataChanged(): void {
            this._updateView();
        }

        private _onTouchedBtnChinese(): void {
            const textArray         = Helpers.getExisted(this._getAction().textArray);
            const textData          = textArray.find(v => v.languageType === Types.LanguageType.Chinese);
            const currentText       = textData?.text;

            TwnsPanelManager.open(TwnsPanelConfig.Dict.CommonInputPanel, {
                title           : Lang.getText(LangTextType.B0455),
                currentValue    : currentText || ``,
                charRestrict    : null,
                maxChars        : CommonConstants.WarEventActionPersistentShowTextMaxLength,
                tips            : Lang.getFormattedText(LangTextType.F0020, CommonConstants.WarEventActionPersistentShowTextMaxLength),
                canBeEmpty      : true,
                isMultiLine     : true,
                callback        : panel => {
                    const text = (panel.getInputText() || ``).trim();
                    if (text === currentText) {
                        return;
                    }

                    if (!text.length) {
                        Helpers.deleteElementFromArray(textArray, textData);
                    } else {
                        if (textData) {
                            textData.text = text;
                        } else {
                            textArray.push({
                                languageType    : Types.LanguageType.Chinese,
                                text,
                            });
                        }
                    }
                    Notify.dispatch(NotifyType.WarEventFullDataChanged);
                },
            });
        }

        private _onTouchedBtnEnglish(): void {
            const textArray         = Helpers.getExisted(this._getAction().textArray);
            const textData          = textArray.find(v => v.languageType === Types.LanguageType.English);
            const currentText       = textData?.text;

            TwnsPanelManager.open(TwnsPanelConfig.Dict.CommonInputPanel, {
                title           : Lang.getText(LangTextType.B0456),
                currentValue    : currentText || ``,
                charRestrict    : null,
                maxChars        : CommonConstants.WarEventActionPersistentShowTextMaxLength,
                tips            : Lang.getFormattedText(LangTextType.F0020, CommonConstants.WarEventActionPersistentShowTextMaxLength),
                canBeEmpty      : true,
                isMultiLine     : true,
                callback        : panel => {
                    const text = (panel.getInputText() || ``).trim();
                    if (text === currentText) {
                        return;
                    }

                    if (!text.length) {
                        Helpers.deleteElementFromArray(textArray, textData);
                    } else {
                        if (textData) {
                            textData.text = text;
                        } else {
                            textArray.push({
                                languageType    : Types.LanguageType.English,
                                text,
                            });
                        }
                    }
                    Notify.dispatch(NotifyType.WarEventFullDataChanged);
                },
            });
        }

        private _onTouchedBtnType(): void {
            const openData = this._getOpenData();
            TwnsPanelManager.open(TwnsPanelConfig.Dict.WeActionTypeListPanel, {
                war         : openData.war,
                fullData    : openData.fullData,
                action      : openData.action,
            });
        }

        ////////////////////////////////////////////////////////////////////////////////
        // View functions.
        ////////////////////////////////////////////////////////////////////////////////
        private _updateView(): void {
            this._updateComponentsForLanguage();

            this._updateComponentsForText();
        }

        private _updateComponentsForLanguage(): void {
            this._labelTitle.text       = `${Lang.getText(LangTextType.B0533)} A${this._getOpenData().action.WeaCommonData?.actionId}`;
            this._btnType.label         = Lang.getText(LangTextType.B0516);
            this._btnChinese.label      = Lang.getText(LangTextType.B0455);
            this._btnEnglish.label      = Lang.getText(LangTextType.B0456);
            this._btnBack.label         = Lang.getText(LangTextType.B0146);

            this._updateLabelDescAndLabelError();
        }

        private _updateLabelDescAndLabelError(): void {
            const openData          = this._getOpenData();
            const action            = openData.action;
            const war               = openData.war;
            const errorTip          = WarHelpers.WarEventHelpers.getErrorTipForAction(openData.fullData, action, war);
            const labelError        = this._labelError;
            labelError.text         = errorTip || Lang.getText(LangTextType.B0493);
            labelError.textColor    = errorTip ? Types.ColorValue.Red : Types.ColorValue.Green;
            this._labelDesc.text    = WarHelpers.WarEventHelpers.getDescForAction(action, war) || CommonConstants.ErrorTextForUndefined;
        }

        private _updateComponentsForText(): void {
            const textArray = this._getAction().textArray;
            this._labelChinese.text = Lang.getLanguageText({
                textArray,
                useAlternate: false,
                languageType: Types.LanguageType.Chinese,
            }) || "";
            this._labelEnglish.text = Lang.getLanguageText({
                textArray,
                useAlternate: false,
                languageType: Types.LanguageType.English,
            }) || "";
        }

        private _getAction(): CommonProto.WarEvent.IWeaPersistentShowText {
            return Helpers.getExisted(this._getOpenData().action.WeaPersistentShowText);
        }
    }
}

// export default TwnsWeActionModifyPanel50;
