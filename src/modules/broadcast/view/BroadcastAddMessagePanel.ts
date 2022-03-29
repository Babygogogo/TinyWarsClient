
// import ChangeLogProxy       from "../../changeLog/model/ChangeLogProxy";
// import CommonConstants      from "../../tools/helpers/CommonConstants";
// import FloatText            from "../../tools/helpers/FloatText";
// import Helpers              from "../../tools/helpers/Helpers";
// import Types                from "../../tools/helpers/Types";
// import Lang                 from "../../tools/lang/Lang";
// import TwnsLangTextType     from "../../tools/lang/LangTextType";
// import TwnsNotifyType       from "../../tools/notify/NotifyType";
// import ProtoTypes           from "../../tools/proto/ProtoTypes";
// import TwnsUiButton         from "../../tools/ui/UiButton";
// import TwnsUiLabel          from "../../tools/ui/UiLabel";
// import TwnsUiPanel          from "../../tools/ui/UiPanel";
// import TwnsUiTextInput      from "../../tools/ui/UiTextInput";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace TwnsBroadcastAddMessagePanel {
    import LangTextType     = TwnsLangTextType.LangTextType;
    import NotifyType       = TwnsNotifyType.NotifyType;
    import ILanguageText    = CommonProto.Structure.ILanguageText;

    export type OpenData = void;
    export class BroadcastAddMessagePanel extends TwnsUiPanel.UiPanel<OpenData> {
        private readonly _group!                : eui.Group;
        private readonly _labelTitle!           : TwnsUiLabel.UiLabel;
        private readonly _labelChinese!         : TwnsUiLabel.UiLabel;
        private readonly _inputChinese!         : TwnsUiTextInput.UiTextInput;
        private readonly _labelEnglish!         : TwnsUiLabel.UiLabel;
        private readonly _inputEnglish!         : TwnsUiTextInput.UiTextInput;

        private readonly _btnStartTime!         : TwnsUiButton.UiButton;
        private readonly _labelStartTime!       : TwnsUiLabel.UiLabel;
        private readonly _btnStartTimeYear!     : TwnsUiButton.UiButton;
        private readonly _btnStartTimeMonth!    : TwnsUiButton.UiButton;
        private readonly _btnStartTimeDay!      : TwnsUiButton.UiButton;
        private readonly _btnStartTimeHour!     : TwnsUiButton.UiButton;
        private readonly _btnStartTimeMinute!   : TwnsUiButton.UiButton;
        private readonly _btnStartTimeSecond!   : TwnsUiButton.UiButton;
        private readonly _btnDuration!          : TwnsUiButton.UiButton;
        private readonly _labelDuration!        : TwnsUiLabel.UiLabel;

        private readonly _labelTip!             : TwnsUiLabel.UiLabel;
        private readonly _btnClose!             : TwnsUiButton.UiButton;
        private readonly _btnModify!            : TwnsUiButton.UiButton;

        private _startTime      = 0;
        private _duration       = 180;

        protected _onOpening(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,    callback: this._onNotifyLanguageChanged },
            ]);
            this._setUiListenerArray([
                { ui: this._btnClose,                   callback: this.close },
                { ui: this._btnModify,                  callback: this._onTouchedBtnModify },
                { ui: this._btnStartTime,               callback: this._onTouchedBtnStartTime },
                { ui: this._btnStartTimeYear,           callback: this._onTouchedBtnStartTimeYear },
                { ui: this._btnStartTimeMonth,          callback: this._onTouchedBtnStartTimeMonth },
                { ui: this._btnStartTimeDay,            callback: this._onTouchedBtnStartTimeDay },
                { ui: this._btnStartTimeHour,           callback: this._onTouchedBtnStartTimeHour },
                { ui: this._btnStartTimeMinute,         callback: this._onTouchedBtnStartTimeMinute },
                { ui: this._btnStartTimeSecond,         callback: this._onTouchedBtnStartTimeSecond },
                { ui: this._btnDuration,                callback: this._onTouchedBtnDuration },
            ]);
            this._setIsTouchMaskEnabled(true);
            this._setIsCloseOnTouchedMask();

            this._inputChinese.maxChars = CommonConstants.BroadcastTextMaxLength;
            this._inputEnglish.maxChars = CommonConstants.BroadcastTextMaxLength;
        }
        protected async _updateOnOpenDataChanged(): Promise<void> {
            this._startTime = Timer.getServerTimestamp();
            this._updateView();

            this._inputChinese.text = `服务器即将进行停机更新。请尽快保存您的进度以免丢失，谢谢！`;
            this._inputEnglish.text = `The server is about to be down and updated. Please save your progress ASAP, thank you!`;
        }
        protected _onClosing(): void {
            // nothing to do
        }

        private _onNotifyLanguageChanged(): void {
            this._updateComponentsForLanguage();
        }

        private _onTouchedBtnModify(): void {
            const chineseText   = this._inputChinese.text.trim() || ``;
            const englishText   = this._inputEnglish.text.trim() || ``;
            const textList      : ILanguageText[] = [];
            if (chineseText) {
                textList.push({ languageType: Types.LanguageType.Chinese, text: chineseText });
            }
            if (englishText) {
                textList.push({ languageType: Types.LanguageType.English, text: englishText });
            }
            if (textList.every(v => Helpers.getExisted(v.text).length <= 0)) {
                FloatText.show(Lang.getText(LangTextType.A0155));
            } else if (textList.some(v => Helpers.getExisted(v.text).length > CommonConstants.BroadcastTextMaxLength)) {
                FloatText.show(Lang.getFormattedText(LangTextType.F0034, CommonConstants.BroadcastTextMaxLength));
            } else {
                const startTime = this._startTime;
                BroadcastProxy.reqBroadcastAddMessage(textList, startTime, startTime + this._duration);
                this.close();
            }
        }

        private _onTouchedBtnStartTime(): void {
            this._startTime = Timer.getServerTimestamp();
            this._updateLabelDuration();
            this._updateLabelStartTime();
        }

        private _onTouchedBtnStartTimeYear(): void {
            const minValue  = 2022;
            const maxValue  = 2100;
            const date      = new Date(this._startTime * 1000);
            TwnsPanelManager.open(TwnsPanelConfig.Dict.CommonInputIntegerPanel, {
                title           : Lang.getText(LangTextType.B0059),
                minValue,
                maxValue,
                currentValue    : date.getFullYear(),
                tips            : `${Lang.getText(LangTextType.B0319)}: [${minValue}, ${maxValue}]`,
                callback        : panel => {
                    date.setFullYear(panel.getInputValue());
                    this._startTime = Math.floor(date.getTime() / 1000);
                    this._updateLabelStartTime();
                    this._updateLabelDuration();
                },
            });
        }
        private _onTouchedBtnStartTimeMonth(): void {
            const minValue  = 1;
            const maxValue  = 12;
            const date      = new Date(this._startTime * 1000);
            TwnsPanelManager.open(TwnsPanelConfig.Dict.CommonInputIntegerPanel, {
                title           : Lang.getText(LangTextType.B0058),
                minValue,
                maxValue,
                currentValue    : date.getMonth() + 1,
                tips            : `${Lang.getText(LangTextType.B0319)}: [${minValue}, ${maxValue}]`,
                callback        : panel => {
                    date.setMonth(panel.getInputValue() - 1);
                    this._startTime = Math.floor(date.getTime() / 1000);
                    this._updateLabelStartTime();
                    this._updateLabelDuration();
                },
            });
        }
        private _onTouchedBtnStartTimeDay(): void {
            const minValue  = 1;
            const maxValue  = 31;
            const date      = new Date(this._startTime * 1000);
            TwnsPanelManager.open(TwnsPanelConfig.Dict.CommonInputIntegerPanel, {
                title           : Lang.getText(LangTextType.B0057),
                minValue,
                maxValue,
                currentValue    : date.getDate(),
                tips            : `${Lang.getText(LangTextType.B0319)}: [${minValue}, ${maxValue}]`,
                callback        : panel => {
                    date.setDate(panel.getInputValue());
                    this._startTime = Math.floor(date.getTime() / 1000);
                    this._updateLabelStartTime();
                    this._updateLabelDuration();
                },
            });
        }
        private _onTouchedBtnStartTimeHour(): void {
            const minValue  = 0;
            const maxValue  = 23;
            const date      = new Date(this._startTime * 1000);
            TwnsPanelManager.open(TwnsPanelConfig.Dict.CommonInputIntegerPanel, {
                title           : Lang.getText(LangTextType.B0884),
                minValue,
                maxValue,
                currentValue    : date.getHours(),
                tips            : `${Lang.getText(LangTextType.B0319)}: [${minValue}, ${maxValue}]`,
                callback        : panel => {
                    date.setHours(panel.getInputValue());
                    this._startTime = Math.floor(date.getTime() / 1000);
                    this._updateLabelStartTime();
                    this._updateLabelDuration();
                },
            });
        }
        private _onTouchedBtnStartTimeMinute(): void {
            const minValue  = 0;
            const maxValue  = 59;
            const date      = new Date(this._startTime * 1000);
            TwnsPanelManager.open(TwnsPanelConfig.Dict.CommonInputIntegerPanel, {
                title           : Lang.getText(LangTextType.B0885),
                minValue,
                maxValue,
                currentValue    : date.getMinutes(),
                tips            : `${Lang.getText(LangTextType.B0319)}: [${minValue}, ${maxValue}]`,
                callback        : panel => {
                    date.setMinutes(panel.getInputValue());
                    this._startTime = Math.floor(date.getTime() / 1000);
                    this._updateLabelStartTime();
                    this._updateLabelDuration();
                },
            });
        }
        private _onTouchedBtnStartTimeSecond(): void {
            const minValue  = 0;
            const maxValue  = 59;
            const date      = new Date(this._startTime * 1000);
            TwnsPanelManager.open(TwnsPanelConfig.Dict.CommonInputIntegerPanel, {
                title           : Lang.getText(LangTextType.B0886),
                minValue,
                maxValue,
                currentValue    : date.getSeconds(),
                tips            : `${Lang.getText(LangTextType.B0319)}: [${minValue}, ${maxValue}]`,
                callback        : panel => {
                    date.setSeconds(panel.getInputValue());
                    this._startTime = Math.floor(date.getTime() / 1000);
                    this._updateLabelStartTime();
                    this._updateLabelDuration();
                },
            });
        }

        private _onTouchedBtnDuration(): void {
            const minValue  = 30;
            const maxValue  = 3600 * 24;
            TwnsPanelManager.open(TwnsPanelConfig.Dict.CommonInputIntegerPanel, {
                title           : Lang.getText(LangTextType.B0883),
                minValue,
                maxValue,
                currentValue    : this._duration,
                tips            : `${Lang.getText(LangTextType.B0319)}: [${minValue}, ${maxValue}](s)`,
                callback        : panel => {
                    const newValue = panel.getInputValue();
                    this._duration = newValue;
                    this._updateLabelDuration();
                },
            });
        }

        private _updateView(): void {
            this._updateComponentsForLanguage();

            this._updateLabelStartTime();
            this._updateLabelDuration();
        }

        private _updateComponentsForLanguage(): void {
            this._btnClose.label            = Lang.getText(LangTextType.B0146);
            this._btnModify.label           = Lang.getText(LangTextType.B0320);
            this._labelChinese.text         = Lang.getText(LangTextType.B0455);
            this._labelEnglish.text         = Lang.getText(LangTextType.B0456);
            this._labelTip.text             = Lang.getText(LangTextType.A0156);
            this._labelTitle.text           = Lang.getText(LangTextType.B0454);
            this._btnStartTime.label        = Lang.getText(LangTextType.B0882);
            this._btnDuration.label         = Lang.getText(LangTextType.B0883);
            this._btnStartTimeYear.label    = Lang.getText(LangTextType.B0059);
            this._btnStartTimeMonth.label   = Lang.getText(LangTextType.B0058);
            this._btnStartTimeDay.label     = Lang.getText(LangTextType.B0057);
            this._btnStartTimeHour.label    = Lang.getText(LangTextType.B0884);
            this._btnStartTimeMinute.label  = Lang.getText(LangTextType.B0885);
            this._btnStartTimeSecond.label  = Lang.getText(LangTextType.B0886);
        }

        private _updateLabelStartTime(): void {
            this._labelStartTime.text = Helpers.getTimestampShortText(this._startTime);
        }
        private _updateLabelDuration(): void {
            const duration              = this._duration;
            this._labelDuration.text    = `${Helpers.getTimeDurationText2(duration)} (~${Helpers.getTimestampShortText(this._startTime + duration)})`;
        }
    }
}

// export default TwnsBroadcastAddMessagePanel;
