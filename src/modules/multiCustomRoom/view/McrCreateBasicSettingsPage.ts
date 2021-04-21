
namespace TinyWars.MultiCustomRoom {
    import ProtoTypes       = Utility.ProtoTypes;
    import Helpers          = Utility.Helpers;
    import Lang             = Utility.Lang;
    import Notify           = Utility.Notify;
    import Types            = Utility.Types;
    import FloatText        = Utility.FloatText;
    import CommonConstants  = Utility.CommonConstants;
    import WarMapModel      = WarMap.WarMapModel;
    import CommonHelpPanel  = Common.CommonHelpPanel;

    export class McrCreateBasicSettingsPage extends GameUi.UiTabPage<void> {
        private readonly _labelMapNameTitle             : GameUi.UiLabel;
        private readonly _labelMapName                  : GameUi.UiLabel;

        private readonly _labelWarNameTitle             : GameUi.UiLabel;
        private readonly _inputWarName                  : GameUi.UiTextInput;

        private readonly _labelWarPasswordTitle         : GameUi.UiLabel;
        private readonly _inputWarPassword              : GameUi.UiTextInput;

        private readonly _labelWarCommentTitle          : GameUi.UiLabel;
        private readonly _inputWarComment               : GameUi.UiTextInput;

        private readonly _labelWarRuleTitle             : GameUi.UiLabel;
        private readonly _labelWarRule                  : GameUi.UiLabel;
        private readonly _btnWarRule                    : GameUi.UiButton;

        private readonly _labelHasFogTitle              : GameUi.UiLabel;
        private readonly _labelHasFog                   : GameUi.UiLabel;
        private readonly _btnHasFog                     : GameUi.UiButton;
        private readonly _btnHasFogHelp                 : GameUi.UiButton;

        private readonly _groupTimer                    : eui.Group;
        private readonly _labelTimerTypeTitle           : GameUi.UiLabel;
        private readonly _labelTimerType                : GameUi.UiLabel;
        private readonly _btnTimerType                  : GameUi.UiButton;
        private readonly _btnTimerTypeHelp              : GameUi.UiButton;

        private readonly _groupTimerRegular             : eui.Group;
        private readonly _labelTimerRegularTitle        : GameUi.UiLabel;
        private readonly _labelTimerRegular             : GameUi.UiLabel;
        private readonly _btnTimerRegular               : GameUi.UiButton;

        private readonly _groupTimerIncremental         : eui.Group;
        private readonly _labelTimerIncrementalTitle1   : GameUi.UiLabel;
        private readonly _labelTimerIncremental1        : GameUi.UiLabel;
        private readonly _btnTimerIncremental1          : GameUi.UiButton;
        private readonly _labelTimerIncrementalTitle2   : GameUi.UiLabel;
        private readonly _labelTimerIncremental2        : GameUi.UiLabel;
        private readonly _btnTimerIncremental2          : GameUi.UiButton;

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

            this._mapRawData = await McrModel.Create.getMapRawData();

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
            McrModel.Create.setWarName(this._inputWarName.text || undefined);
            this._updateInputWarName();
        }

        private _onFocusOutInputWarPassword(e: egret.Event): void {
            McrModel.Create.setWarPassword(this._inputWarPassword.text || undefined);
            this._updateInputWarPassword();
        }

        private _onFocusOutInputWarComment(e: egret.Event): void {
            McrModel.Create.setWarComment(this._inputWarComment.text || undefined);
            this._updateInputWarComment();
        }

        private async _onTouchedBtnWarRule(e: egret.TouchEvent): Promise<void> {
            await McrModel.Create.tickPresetWarRuleId();
            this._updateComponentsForWarRule();
        }

        private _onTouchedBtnHasFog(e: egret.TouchEvent): void {
            const callback = () => {
                McrModel.Create.setHasFog(!McrModel.Create.getHasFog());
                this._updateLabelHasFog();
                this._updateLabelWarRule();
            };
            if (McrModel.Create.getPresetWarRuleId() == null) {
                callback();
            } else {
                Common.CommonConfirmPanel.show({
                    content : Lang.getText(Lang.Type.A0129),
                    callback: () => {
                        McrModel.Create.setCustomWarRuleId();
                        callback();
                    },
                });
            }
        }

        private _onTouchedBtnHasFogHelp(e: egret.TouchEvent): void {
            CommonHelpPanel.show({
                title  : Lang.getText(Lang.Type.B0020),
                content: Lang.getRichText(Lang.RichType.R0002),
            });
        }

        private _onTouchedBtnTimerType(e: egret.TouchEvent): void {
            McrModel.Create.tickBootTimerType();
            this._updateGroupTimer();
        }

        private _onTouchedBtnTimerTypeHelp(e: egret.TouchEvent): void {
            CommonHelpPanel.show({
                title  : Lang.getText(Lang.Type.B0574),
                content: Lang.getRichText(Lang.RichType.R0003),
            });
        }

        private _onTouchedBtnTimerRegular(e: egret.TouchEvent): void {
            McrModel.Create.tickTimerRegularTime();
            this._updateGroupTimer();
        }

        private _onTouchedBtnTimerIncremental1(e: egret.TouchEvent): void {
            const minValue = 1;
            const maxValue = CommonConstants.WarBootTimerIncrementalMaxLimit;
            Common.CommonInputPanel.show({
                title           : Lang.getText(Lang.Type.B0389),
                currentValue    : "" + McrModel.Create.getBootTimerParams()[1],
                maxChars        : 5,
                charRestrict    : "0-9",
                tips            : `${Lang.getText(Lang.Type.B0319)}: [${minValue}, ${maxValue}] (${Lang.getText(Lang.Type.B0017)})`,
                callback        : panel => {
                    const text  = panel.getInputText();
                    const value = text ? Number(text) : NaN;
                    if ((isNaN(value)) || (value > maxValue) || (value < minValue)) {
                        FloatText.show(Lang.getText(Lang.Type.A0098));
                    } else {
                        McrModel.Create.setTimerIncrementalInitialTime(value);
                        this._updateGroupTimer();
                    }
                },
            });
        }

        private _onTouchedBtnTimerIncremental2(e: egret.TouchEvent): void {
            const minValue = 0;
            const maxValue = CommonConstants.WarBootTimerIncrementalMaxLimit;
            Common.CommonInputPanel.show({
                title           : Lang.getText(Lang.Type.B0390),
                currentValue    : "" + McrModel.Create.getBootTimerParams()[2],
                maxChars        : 5,
                charRestrict    : "0-9",
                tips            : `${Lang.getText(Lang.Type.B0319)}: [${minValue}, ${maxValue}] (${Lang.getText(Lang.Type.B0017)})`,
                callback        : panel => {
                    const text  = panel.getInputText();
                    const value = text ? Number(text) : NaN;
                    if ((isNaN(value)) || (value > maxValue) || (value < minValue)) {
                        FloatText.show(Lang.getText(Lang.Type.A0098));
                    } else {
                        McrModel.Create.setTimerIncrementalIncrementalValue(value);
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
            this._inputWarName.text = McrModel.Create.getWarName();
        }

        private _updateInputWarPassword(): void {
            this._inputWarPassword.text = McrModel.Create.getWarPassword();
        }

        private _updateInputWarComment(): void {
            this._inputWarComment.text = McrModel.Create.getWarComment();
        }

        private async _updateLabelMapName(): Promise<void> {
            this._labelMapName.text = await WarMapModel.getMapNameInCurrentLanguage(this._mapRawData.mapId);
        }

        private _updateLabelWarRule(): void {
            const label             = this._labelWarRule;
            const settingsForCommon = McrModel.Create.getData().settingsForCommon;
            label.text              = Lang.getWarRuleNameInLanguage(settingsForCommon.warRule);
            label.textColor         = settingsForCommon.presetWarRuleId == null ? 0xFFFF00 : 0xFFFFFF;
        }

        private _updateLabelHasFog(): void {
            this._labelHasFog.text = Lang.getText(McrModel.Create.getHasFog() ? Lang.Type.B0012 : Lang.Type.B0013);
        }

        private _updateGroupTimer(): void {
            const params                = McrModel.Create.getBootTimerParams();
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
}
