
import { UiButton }                     from "../../../gameui/UiButton";
import { UiLabel }                      from "../../../gameui/UiLabel";
import { UiTextInput }                  from "../../../gameui/UiTextInput";
import { UiTabPage }                    from "../../../gameui/UiTabPage";
import { CommonConfirmPanel }           from "../../common/view/CommonConfirmPanel";
import { CommonHelpPanel }              from "../../common/view/CommonHelpPanel";
import { CommonInputPanel }             from "../../common/view/CommonInputPanel";
import * as CommonConstants             from "../../../utility/CommonConstants";
import * as FloatText                   from "../../../utility/FloatText";
import * as Helpers                     from "../../../utility/Helpers";
import * as Lang                        from "../../../utility/Lang";
import * as Notify                      from "../../../utility/Notify";
import * as ProtoTypes                  from "../../../utility/ProtoTypes";
import * as Types                       from "../../../utility/Types";
import * as CcrModel                    from "../../coopCustomRoom/model/CcrModel";
import * as WarMapModel                 from "../../warMap/model/WarMapModel";

export class CcrCreateBasicSettingsPage extends UiTabPage<void> {
    private readonly _labelMapNameTitle             : UiLabel;
    private readonly _labelMapName                  : UiLabel;

    private readonly _labelWarNameTitle             : UiLabel;
    private readonly _inputWarName                  : UiTextInput;

    private readonly _labelWarPasswordTitle         : UiLabel;
    private readonly _inputWarPassword              : UiTextInput;

    private readonly _labelWarCommentTitle          : UiLabel;
    private readonly _inputWarComment               : UiTextInput;

    private readonly _labelWarRuleTitle             : UiLabel;
    private readonly _labelWarRule                  : UiLabel;
    private readonly _btnWarRule                    : UiButton;

    private readonly _labelHasFogTitle              : UiLabel;
    private readonly _labelHasFog                   : UiLabel;
    private readonly _btnHasFog                     : UiButton;
    private readonly _btnHasFogHelp                 : UiButton;

    private readonly _groupTimer                    : eui.Group;
    private readonly _labelTimerTypeTitle           : UiLabel;
    private readonly _labelTimerType                : UiLabel;
    private readonly _btnTimerType                  : UiButton;
    private readonly _btnTimerTypeHelp              : UiButton;

    private readonly _groupTimerRegular             : eui.Group;
    private readonly _labelTimerRegularTitle        : UiLabel;
    private readonly _labelTimerRegular             : UiLabel;
    private readonly _btnTimerRegular               : UiButton;

    private readonly _groupTimerIncremental         : eui.Group;
    private readonly _labelTimerIncrementalTitle1   : UiLabel;
    private readonly _labelTimerIncremental1        : UiLabel;
    private readonly _btnTimerIncremental1          : UiButton;
    private readonly _labelTimerIncrementalTitle2   : UiLabel;
    private readonly _labelTimerIncremental2        : UiLabel;
    private readonly _btnTimerIncremental2          : UiButton;

    private _mapRawData : ProtoTypes.Map.IMapRawData;

    public constructor() {
        super();

        this.skinName = "resource/skins/coopCustomRoom/CcrCreateBasicSettingsPage.exml";
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
            { type: Notify.Type.LanguageChanged, callback: this._onNotifyLanguageChanged },
        ]);
        this.left                       = 0;
        this.right                      = 0;
        this.top                        = 0;
        this.bottom                     = 0;
        this._inputWarName.maxChars     = CommonConstants.WarNameMaxLength;
        this._inputWarPassword.restrict = `0-9`;
        this._inputWarPassword.maxChars = CommonConstants.WarPasswordMaxLength;
        this._inputWarComment.maxChars  = CommonConstants.WarCommentMaxLength;

        this._mapRawData = await CcrModel.Create.getMapRawData();

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
    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _onFocusOutInputWarName(): void {
        CcrModel.Create.setWarName(this._inputWarName.text || undefined);
        this._updateInputWarName();
    }

    private _onFocusOutInputWarPassword(): void {
        CcrModel.Create.setWarPassword(this._inputWarPassword.text || undefined);
        this._updateInputWarPassword();
    }

    private _onFocusOutInputWarComment(): void {
        CcrModel.Create.setWarComment(this._inputWarComment.text || undefined);
        this._updateInputWarComment();
    }

    private async _onTouchedBtnWarRule(): Promise<void> {
        await CcrModel.Create.tickPresetWarRuleId();
        this._updateComponentsForWarRule();
    }

    private _onTouchedBtnHasFog(): void {
        const callback = () => {
            CcrModel.Create.setHasFog(!CcrModel.Create.getHasFog());
            this._updateLabelHasFog();
            this._updateLabelWarRule();
        };
        if (CcrModel.Create.getPresetWarRuleId() == null) {
            callback();
        } else {
            CommonConfirmPanel.show({
                content : Lang.getText(Lang.Type.A0129),
                callback: () => {
                    CcrModel.Create.setCustomWarRuleId();
                    callback();
                },
            });
        }
    }

    private _onTouchedBtnHasFogHelp(): void {
        CommonHelpPanel.show({
            title  : Lang.getText(Lang.Type.B0020),
            content: Lang.getText(Lang.Type.R0002),
        });
    }

    private _onTouchedBtnTimerType(): void {
        CcrModel.Create.tickBootTimerType();
        this._updateGroupTimer();
    }

    private _onTouchedBtnTimerTypeHelp(): void {
        CommonHelpPanel.show({
            title  : Lang.getText(Lang.Type.B0574),
            content: Lang.getText(Lang.Type.R0003),
        });
    }

    private _onTouchedBtnTimerRegular(): void {
        CcrModel.Create.tickTimerRegularTime();
        this._updateGroupTimer();
    }

    private _onTouchedBtnTimerIncremental1(): void {
        const minValue = 1;
        const maxValue = CommonConstants.WarBootTimerIncrementalMaxLimit;
        CommonInputPanel.show({
            title           : Lang.getText(Lang.Type.B0389),
            currentValue    : "" + CcrModel.Create.getBootTimerParams()[1],
            maxChars        : 5,
            charRestrict    : "0-9",
            tips            : `${Lang.getText(Lang.Type.B0319)}: [${minValue}, ${maxValue}] (${Lang.getText(Lang.Type.B0017)})`,
            callback        : panel => {
                const text  = panel.getInputText();
                const value = text ? Number(text) : NaN;
                if ((isNaN(value)) || (value > maxValue) || (value < minValue)) {
                    FloatText.show(Lang.getText(Lang.Type.A0098));
                } else {
                    CcrModel.Create.setTimerIncrementalInitialTime(value);
                    this._updateGroupTimer();
                }
            },
        });
    }

    private _onTouchedBtnTimerIncremental2(): void {
        const minValue = 0;
        const maxValue = CommonConstants.WarBootTimerIncrementalMaxLimit;
        CommonInputPanel.show({
            title           : Lang.getText(Lang.Type.B0390),
            currentValue    : "" + CcrModel.Create.getBootTimerParams()[2],
            maxChars        : 5,
            charRestrict    : "0-9",
            tips            : `${Lang.getText(Lang.Type.B0319)}: [${minValue}, ${maxValue}] (${Lang.getText(Lang.Type.B0017)})`,
            callback        : panel => {
                const text  = panel.getInputText();
                const value = text ? Number(text) : NaN;
                if ((isNaN(value)) || (value > maxValue) || (value < minValue)) {
                    FloatText.show(Lang.getText(Lang.Type.A0098));
                } else {
                    CcrModel.Create.setTimerIncrementalIncrementalValue(value);
                    this._updateGroupTimer();
                }
            },
        });
    }

    ////////////////////////////////////////////////////////////////////////////////
    // View functions.
    ////////////////////////////////////////////////////////////////////////////////
    private _updateComponentsForLanguage(): void {
        this._labelMapNameTitle.text            = Lang.getText(Lang.Type.B0225);
        this._labelWarNameTitle.text            = Lang.getText(Lang.Type.B0185);
        this._labelWarPasswordTitle.text        = Lang.getText(Lang.Type.B0186);
        this._labelWarCommentTitle.text         = Lang.getText(Lang.Type.B0187);
        this._labelWarRuleTitle.text            = Lang.getText(Lang.Type.B0318);
        this._labelHasFogTitle.text             = Lang.getText(Lang.Type.B0020);
        this._labelTimerTypeTitle.text          = Lang.getText(Lang.Type.B0574);
        this._labelTimerRegularTitle.text       = Lang.getText(Lang.Type.B0021);
        this._labelTimerIncrementalTitle1.text  = Lang.getText(Lang.Type.B0389);
        this._labelTimerIncrementalTitle2.text  = Lang.getText(Lang.Type.B0390);
    }

    private _updateComponentsForWarRule(): void {
        this._updateLabelWarRule();
        this._updateLabelHasFog();
        this._updateGroupTimer();
    }

    private _updateInputWarName(): void {
        this._inputWarName.text = CcrModel.Create.getWarName();
    }

    private _updateInputWarPassword(): void {
        this._inputWarPassword.text = CcrModel.Create.getWarPassword();
    }

    private _updateInputWarComment(): void {
        this._inputWarComment.text = CcrModel.Create.getWarComment();
    }

    private async _updateLabelMapName(): Promise<void> {
        this._labelMapName.text = await WarMapModel.getMapNameInCurrentLanguage(this._mapRawData.mapId);
    }

    private _updateLabelWarRule(): void {
        const label             = this._labelWarRule;
        const settingsForCommon = CcrModel.Create.getData().settingsForCommon;
        label.text              = Lang.getWarRuleNameInLanguage(settingsForCommon.warRule);
        label.textColor         = settingsForCommon.presetWarRuleId == null ? 0xFFFF00 : 0xFFFFFF;
    }

    private _updateLabelHasFog(): void {
        this._labelHasFog.text = Lang.getText(CcrModel.Create.getHasFog() ? Lang.Type.B0012 : Lang.Type.B0013);
    }

    private _updateGroupTimer(): void {
        const params                = CcrModel.Create.getBootTimerParams();
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
