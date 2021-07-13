
import TwnsUiButton                      from "../../../utility/ui/UiButton";
import TwnsUiLabel                      from "../../../utility/ui/UiLabel";
import TwnsUiTextInput                  from "../../../utility/ui/UiTextInput";
import TwnsUiTabPage                    from "../../../utility/ui/UiTabPage";
import { CommonConfirmPanel }           from "../../common/view/CommonConfirmPanel";
import { CommonHelpPanel }              from "../../common/view/CommonHelpPanel";
import { CommonInputPanel }             from "../../common/view/CommonInputPanel";
import { CommonConstants }              from "../../../utility/CommonConstants";
import { FloatText }                    from "../../../utility/FloatText";
import { Helpers }                      from "../../../utility/Helpers";
import { Lang }                         from "../../../utility/lang/Lang";
import { TwnsLangTextType } from "../../../utility/lang/LangTextType";
import { TwnsNotifyType } from "../../../utility/notify/NotifyType";
import { ProtoTypes }                   from "../../../utility/proto/ProtoTypes";
import { Types }                        from "../../../utility/Types";
import { WarMapModel }                  from "../../warMap/model/WarMapModel";
import { McrCreateModel }               from "../model/McrCreateModel";
import LangTextType         = TwnsLangTextType.LangTextType;
import NotifyType       = TwnsNotifyType.NotifyType;

export class McrCreateBasicSettingsPage extends TwnsUiTabPage.UiTabPage<void> {
    private readonly _labelMapNameTitle             : TwnsUiLabel.UiLabel;
    private readonly _labelMapName                  : TwnsUiLabel.UiLabel;

    private readonly _labelWarNameTitle             : TwnsUiLabel.UiLabel;
    private readonly _inputWarName                  : TwnsUiTextInput.UiTextInput;

    private readonly _labelWarPasswordTitle         : TwnsUiLabel.UiLabel;
    private readonly _inputWarPassword              : TwnsUiTextInput.UiTextInput;

    private readonly _labelWarCommentTitle          : TwnsUiLabel.UiLabel;
    private readonly _inputWarComment               : TwnsUiTextInput.UiTextInput;

    private readonly _labelWarRuleTitle             : TwnsUiLabel.UiLabel;
    private readonly _labelWarRule                  : TwnsUiLabel.UiLabel;
    private readonly _btnWarRule                    : TwnsUiButton.UiButton;

    private readonly _labelHasFogTitle              : TwnsUiLabel.UiLabel;
    private readonly _labelHasFog                   : TwnsUiLabel.UiLabel;
    private readonly _btnHasFog                     : TwnsUiButton.UiButton;
    private readonly _btnHasFogHelp                 : TwnsUiButton.UiButton;

    private readonly _groupTimer                    : eui.Group;
    private readonly _labelTimerTypeTitle           : TwnsUiLabel.UiLabel;
    private readonly _labelTimerType                : TwnsUiLabel.UiLabel;
    private readonly _btnTimerType                  : TwnsUiButton.UiButton;
    private readonly _btnTimerTypeHelp              : TwnsUiButton.UiButton;

    private readonly _groupTimerRegular             : eui.Group;
    private readonly _labelTimerRegularTitle        : TwnsUiLabel.UiLabel;
    private readonly _labelTimerRegular             : TwnsUiLabel.UiLabel;
    private readonly _btnTimerRegular               : TwnsUiButton.UiButton;

    private readonly _groupTimerIncremental         : eui.Group;
    private readonly _labelTimerIncrementalTitle1   : TwnsUiLabel.UiLabel;
    private readonly _labelTimerIncremental1        : TwnsUiLabel.UiLabel;
    private readonly _btnTimerIncremental1          : TwnsUiButton.UiButton;
    private readonly _labelTimerIncrementalTitle2   : TwnsUiLabel.UiLabel;
    private readonly _labelTimerIncremental2        : TwnsUiLabel.UiLabel;
    private readonly _btnTimerIncremental2          : TwnsUiButton.UiButton;

    private _mapRawData : ProtoTypes.Map.IMapRawData;

    public constructor() {
        super();

        this.skinName = "resource/skins/multiCustomRoom/McrCreateBasicSettingsPage.exml";
    }

    protected async _onOpened(): Promise<void> {
        this._setUiListenerArray([
            { ui: this._inputWarName,           callback: this._onFocusOutInputWarName,         eventType: egret.FocusEvent.FOCUS_OUT },
            { ui: this._inputWarPassword,       callback: this._onFocusOutInputWarPassword,     eventType: egret.FocusEvent.FOCUS_OUT },
            { ui: this._inputWarComment,        callback: this._onFocusOutInputWarComment,      eventType: egret.FocusEvent.FOCUS_OUT },
            { ui: this._btnWarRule,             callback: this._onTouchedBtnWarRule },
            { ui: this._btnHasFog,              callback: this._onTouchedBtnHasFog },
            { ui: this._btnHasFogHelp,          callback: this._onTouchedBtnHasFogHelp },
            { ui: this._btnTimerType,           callback: this._onTouchedBtnTimerType, },
            { ui: this._btnTimerTypeHelp,       callback: this._onTouchedBtnTimerTypeHelp, },
            { ui: this._btnTimerRegular,        callback: this._onTouchedBtnTimerRegular, },
            { ui: this._btnTimerIncremental1,   callback: this._onTouchedBtnTimerIncremental1 },
            { ui: this._btnTimerIncremental2,   callback: this._onTouchedBtnTimerIncremental2 },
        ]);
        this._setNotifyListenerArray([
            { type: NotifyType.LanguageChanged, callback: this._onNotifyLanguageChanged },
        ]);
        this.left                       = 0;
        this.right                      = 0;
        this.top                        = 0;
        this.bottom                     = 0;
        this._inputWarName.maxChars     = CommonConstants.WarNameMaxLength;
        this._inputWarPassword.restrict = `0-9`;
        this._inputWarPassword.maxChars = CommonConstants.WarPasswordMaxLength;
        this._inputWarComment.maxChars  = CommonConstants.WarCommentMaxLength;

        this._mapRawData = await McrCreateModel.getMapRawData();

        this._updateComponentsForLanguage();
        this._updateComponentsForWarRule();
        this._updateInputWarName();
        this._updateInputWarPassword();
        this._updateInputWarComment();
        this._updateLabelMapName();
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Event callbacks.
    ////////////////////////////////////////////////////////////////////////////////
    private _onNotifyLanguageChanged(e: egret.Event): void {
        this._updateComponentsForLanguage();
    }

    private _onFocusOutInputWarName(e: egret.TouchEvent): void {
        McrCreateModel.setWarName(this._inputWarName.text || undefined);
        this._updateInputWarName();
    }

    private _onFocusOutInputWarPassword(e: egret.Event): void {
        McrCreateModel.setWarPassword(this._inputWarPassword.text || undefined);
        this._updateInputWarPassword();
    }

    private _onFocusOutInputWarComment(e: egret.Event): void {
        McrCreateModel.setWarComment(this._inputWarComment.text || undefined);
        this._updateInputWarComment();
    }

    private async _onTouchedBtnWarRule(e: egret.TouchEvent): Promise<void> {
        await McrCreateModel.tickPresetWarRuleId();
        this._updateComponentsForWarRule();
    }

    private _onTouchedBtnHasFog(e: egret.TouchEvent): void {
        const callback = () => {
            McrCreateModel.setHasFog(!McrCreateModel.getHasFog());
            this._updateLabelHasFog();
            this._updateLabelWarRule();
        };
        if (McrCreateModel.getPresetWarRuleId() == null) {
            callback();
        } else {
            CommonConfirmPanel.show({
                content : Lang.getText(LangTextType.A0129),
                callback: () => {
                    McrCreateModel.setCustomWarRuleId();
                    callback();
                },
            });
        }
    }

    private _onTouchedBtnHasFogHelp(e: egret.TouchEvent): void {
        CommonHelpPanel.show({
            title  : Lang.getText(LangTextType.B0020),
            content: Lang.getText(LangTextType.R0002),
        });
    }

    private _onTouchedBtnTimerType(e: egret.TouchEvent): void {
        McrCreateModel.tickBootTimerType();
        this._updateGroupTimer();
    }

    private _onTouchedBtnTimerTypeHelp(e: egret.TouchEvent): void {
        CommonHelpPanel.show({
            title  : Lang.getText(LangTextType.B0574),
            content: Lang.getText(LangTextType.R0003),
        });
    }

    private _onTouchedBtnTimerRegular(e: egret.TouchEvent): void {
        McrCreateModel.tickTimerRegularTime();
        this._updateGroupTimer();
    }

    private _onTouchedBtnTimerIncremental1(e: egret.TouchEvent): void {
        const minValue = 1;
        const maxValue = CommonConstants.WarBootTimerIncrementalMaxLimit;
        CommonInputPanel.show({
            title           : Lang.getText(LangTextType.B0389),
            currentValue    : "" + McrCreateModel.getBootTimerParams()[1],
            maxChars        : 5,
            charRestrict    : "0-9",
            tips            : `${Lang.getText(LangTextType.B0319)}: [${minValue}, ${maxValue}] (${Lang.getText(LangTextType.B0017)})`,
            callback        : panel => {
                const text  = panel.getInputText();
                const value = text ? Number(text) : NaN;
                if ((isNaN(value)) || (value > maxValue) || (value < minValue)) {
                    FloatText.show(Lang.getText(LangTextType.A0098));
                } else {
                    McrCreateModel.setTimerIncrementalInitialTime(value);
                    this._updateGroupTimer();
                }
            },
        });
    }

    private _onTouchedBtnTimerIncremental2(e: egret.TouchEvent): void {
        const minValue = 0;
        const maxValue = CommonConstants.WarBootTimerIncrementalMaxLimit;
        CommonInputPanel.show({
            title           : Lang.getText(LangTextType.B0390),
            currentValue    : "" + McrCreateModel.getBootTimerParams()[2],
            maxChars        : 5,
            charRestrict    : "0-9",
            tips            : `${Lang.getText(LangTextType.B0319)}: [${minValue}, ${maxValue}] (${Lang.getText(LangTextType.B0017)})`,
            callback        : panel => {
                const text  = panel.getInputText();
                const value = text ? Number(text) : NaN;
                if ((isNaN(value)) || (value > maxValue) || (value < minValue)) {
                    FloatText.show(Lang.getText(LangTextType.A0098));
                } else {
                    McrCreateModel.setTimerIncrementalIncrementalValue(value);
                    this._updateGroupTimer();
                }
            },
        });
    }

    ////////////////////////////////////////////////////////////////////////////////
    // View functions.
    ////////////////////////////////////////////////////////////////////////////////
    private _updateComponentsForLanguage(): void {
        this._labelMapNameTitle.text            = Lang.getText(LangTextType.B0225);
        this._labelWarNameTitle.text            = Lang.getText(LangTextType.B0185);
        this._labelWarPasswordTitle.text        = Lang.getText(LangTextType.B0186);
        this._labelWarCommentTitle.text         = Lang.getText(LangTextType.B0187);
        this._labelWarRuleTitle.text            = Lang.getText(LangTextType.B0318);
        this._labelHasFogTitle.text             = Lang.getText(LangTextType.B0020);
        this._labelTimerTypeTitle.text          = Lang.getText(LangTextType.B0574);
        this._labelTimerRegularTitle.text       = Lang.getText(LangTextType.B0021);
        this._labelTimerIncrementalTitle1.text  = Lang.getText(LangTextType.B0389);
        this._labelTimerIncrementalTitle2.text  = Lang.getText(LangTextType.B0390);
    }

    private _updateComponentsForWarRule(): void {
        this._updateLabelWarRule();
        this._updateLabelHasFog();
        this._updateGroupTimer();
    }

    private _updateInputWarName(): void {
        this._inputWarName.text = McrCreateModel.getWarName();
    }

    private _updateInputWarPassword(): void {
        this._inputWarPassword.text = McrCreateModel.getWarPassword();
    }

    private _updateInputWarComment(): void {
        this._inputWarComment.text = McrCreateModel.getWarComment();
    }

    private async _updateLabelMapName(): Promise<void> {
        this._labelMapName.text = await WarMapModel.getMapNameInCurrentLanguage(this._mapRawData.mapId);
    }

    private _updateLabelWarRule(): void {
        const label             = this._labelWarRule;
        const settingsForCommon = McrCreateModel.getData().settingsForCommon;
        label.text              = Lang.getWarRuleNameInLanguage(settingsForCommon.warRule);
        label.textColor         = settingsForCommon.presetWarRuleId == null ? 0xFFFF00 : 0xFFFFFF;
    }

    private _updateLabelHasFog(): void {
        this._labelHasFog.text = Lang.getText(McrCreateModel.getHasFog() ? LangTextType.B0012 : LangTextType.B0013);
    }

    private _updateGroupTimer(): void {
        const params                = McrCreateModel.getBootTimerParams();
        const timerType             : Types.BootTimerType = params[0];
        this._labelTimerType.text   = Lang.getBootTimerTypeName(timerType);

        const groupTimer        = this._groupTimer;
        const groupRegular      = this._groupTimerRegular;
        const groupIncremental  = this._groupTimerIncremental;
        (groupRegular.parent) && (groupRegular.parent.removeChild(groupRegular));
        (groupIncremental.parent) && (groupIncremental.parent.removeChild(groupIncremental));

        if (timerType === Types.BootTimerType.Regular) {
            groupTimer.addChild(groupRegular);
            this._labelTimerRegular.text = Helpers.getTimeDurationText2(params[1]);

        } else if (timerType === Types.BootTimerType.Incremental) {
            groupTimer.addChild(groupIncremental);
            this._labelTimerIncremental1.text = Helpers.getTimeDurationText2(params[1]);
            this._labelTimerIncremental2.text = Helpers.getTimeDurationText2(params[2]);
        }
    }
}
