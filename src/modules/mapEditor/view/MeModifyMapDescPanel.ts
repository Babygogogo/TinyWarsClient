
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
// import Twns.Notify               from "../../tools/notify/NotifyType";
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
namespace Twns.MapEditor {
    import NotifyType               = Twns.Notify.NotifyType;
    import LangTextType             = TwnsLangTextType.LangTextType;

    export type OpenDataForMeModifyMapDescPanel = {
        war     : MeWar;
    };
    export class MeModifyMapDescPanel extends TwnsUiPanel.UiPanel<OpenDataForMeModifyMapDescPanel> {
        private readonly _btnBack!              : TwnsUiButton.UiButton;
        private readonly _labelTitle!           : TwnsUiLabel.UiLabel;

        private readonly _btnChinese!           : TwnsUiButton.UiButton;
        private readonly _labelChinese!         : TwnsUiLabel.UiLabel;
        private readonly _btnEnglish!           : TwnsUiButton.UiButton;
        private readonly _labelEnglish!         : TwnsUiLabel.UiLabel;

        protected _onOpening(): void {
            this._setUiListenerArray([
                { ui: this._btnBack,            callback: this.close },
                { ui: this._btnChinese,         callback: this._onTouchedBtnChinese },
                { ui: this._btnEnglish,         callback: this._onTouchedBtnEnglish },
            ]);
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,         callback: this._onNotifyLanguageChanged },
                { type: NotifyType.MeMapDescChanged,        callback: this._onNotifyMeMapDescChanged },
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

        private _onNotifyMeMapDescChanged(): void {
            this._updateView();
        }

        private _onTouchedBtnChinese(): void {
            const war = this._getOpenData().war;
            if (war.getIsReviewingMap()) {
                return;
            }

            const textArray         = war.getMapDescArray();
            const textData          = textArray.find(v => v.languageType === Types.LanguageType.Chinese);
            const currentText       = textData?.text;

            TwnsPanelManager.open(TwnsPanelConfig.Dict.CommonInputPanel, {
                title           : Lang.getText(LangTextType.B0455),
                currentValue    : currentText || ``,
                charRestrict    : null,
                maxChars        : CommonConstants.MapDescriptionMaxLength,
                tips            : Lang.getFormattedText(LangTextType.F0020, CommonConstants.MapDescriptionMaxLength),
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
                    Twns.Notify.dispatch(NotifyType.MeMapDescChanged);
                },
            });
        }

        private _onTouchedBtnEnglish(): void {
            const war = this._getOpenData().war;
            if (war.getIsReviewingMap()) {
                return;
            }

            const textArray         = war.getMapDescArray();
            const textData          = textArray.find(v => v.languageType === Types.LanguageType.English);
            const currentText       = textData?.text;

            TwnsPanelManager.open(TwnsPanelConfig.Dict.CommonInputPanel, {
                title           : Lang.getText(LangTextType.B0456),
                currentValue    : currentText || ``,
                charRestrict    : null,
                maxChars        : CommonConstants.MapDescriptionMaxLength,
                tips            : Lang.getFormattedText(LangTextType.F0020, CommonConstants.MapDescriptionMaxLength),
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
                    Twns.Notify.dispatch(NotifyType.MeMapDescChanged);
                },
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
            this._labelTitle.text       = Lang.getText(LangTextType.B0893);
            this._btnChinese.label      = Lang.getText(LangTextType.B0455);
            this._btnEnglish.label      = Lang.getText(LangTextType.B0456);
            this._btnBack.label         = Lang.getText(LangTextType.B0146);
        }

        private _updateComponentsForText(): void {
            const textArray = this._getOpenData().war.getMapDescArray();
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
    }
}

// export default TwnsMeModifyMapDescPanel;
