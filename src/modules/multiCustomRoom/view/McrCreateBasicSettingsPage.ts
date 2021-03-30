
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

    export class McrCreateBasicSettingsPage extends GameUi.UiTabPage {
        private _labelMapNameTitle          : GameUi.UiLabel;
        private _labelMapName               : GameUi.UiLabel;

        private _labelWarNameTitle          : GameUi.UiLabel;
        private _inputWarName               : GameUi.UiTextInput;

        private _labelWarPasswordTitle      : GameUi.UiLabel;
        private _inputWarPassword           : GameUi.UiTextInput;

        private _labelWarCommentTitle       : GameUi.UiLabel;
        private _inputWarComment            : GameUi.UiTextInput;

        private _labelWarRuleTitle          : GameUi.UiLabel;
        private _labelWarRule               : GameUi.UiLabel;
        private _btnWarRule                 : GameUi.UiButton;

        private _labelHasFogTitle           : GameUi.UiLabel;
        private _labelHasFog                : GameUi.UiLabel;
        private _btnHasFog                  : GameUi.UiButton;
        private _btnHasFogHelp              : GameUi.UiButton;

        private _groupTimer                 : eui.Group;
        private _btnModifyTimerType         : TinyWars.GameUi.UiButton;
        private _btnHelpTimer               : TinyWars.GameUi.UiButton;
        private _labelTimerType             : TinyWars.GameUi.UiLabel;
        private _groupTimerRegular          : eui.Group;
        private _btnModifyTimerRegular      : TinyWars.GameUi.UiButton;
        private _groupTimerIncremental      : eui.Group;
        private _btnModifyTimerIncremental1 : TinyWars.GameUi.UiButton;
        private _btnModifyTimerIncremental2 : TinyWars.GameUi.UiButton;

        private _btnModifySkinId            : TinyWars.GameUi.UiButton;
        private _labelSkinId                : TinyWars.GameUi.UiLabel;
        private _btnHelpSkinId              : TinyWars.GameUi.UiButton;

        private _mapRawData : ProtoTypes.Map.IMapRawData;

        public constructor() {
            super();

            this.skinName = "resource/skins/multiCustomRoom/McrCreateBasicSettingsPage.exml";
        }

        protected async _onOpened(): Promise<void> {
            this._setUiListenerArray([
                { ui: this._inputWarName,               callback: this._onFocusOutInputWarName,         eventType: egret.FocusEvent.FOCUS_OUT },
                { ui: this._inputWarPassword,           callback: this._onFocusOutInputWarPassword,     eventType: egret.FocusEvent.FOCUS_OUT },
                { ui: this._inputWarComment,            callback: this._onFocusOutInputWarComment,      eventType: egret.FocusEvent.FOCUS_OUT },
                { ui: this._btnWarRule,                 callback: this._onTouchedBtnWarRule },
                { ui: this._btnHasFog,                  callback: this._onTouchedBtnHasFog },
                { ui: this._btnHasFogHelp,              callback: this._onTouchedBtnHasFogHelp },
                { ui: this._btnModifySkinId,            callback: this._onTouchedBtnModifySkin, },
                { ui: this._btnHelpSkinId,              callback: this._onTouchedBtnHelpSkinId, },
                { ui: this._btnModifyTimerType,         callback: this._onTouchedBtnModifyTimerType, },
                { ui: this._btnHelpTimer,               callback: this._onTouchedBtnHelpTimer, },
                { ui: this._btnModifyTimerRegular,      callback: this._onTouchedBtnModifyTimerRegular, },
                { ui: this._btnModifyTimerIncremental1, callback: this._onTouchedBtnModifyTimerIncremental1 },
                { ui: this._btnModifyTimerIncremental2, callback: this._onTouchedBtnModifyTimerIncremental2 },
            ]);
            this._setNotifyListenerArray([
                { type: Notify.Type.LanguageChanged, callback: this._onNotifyLanguageChanged },
            ]);

            this._inputWarName.maxChars     = CommonConstants.WarNameMaxLength;
            this._inputWarPassword.restrict = `0-9`;
            this._inputWarPassword.maxChars = CommonConstants.WarPasswordMaxLength;
            this._inputWarComment.maxChars  = CommonConstants.WarCommentMaxLength;

            this._btnModifySkinId.setTextColor(0x00FF00);
            this._btnModifyTimerIncremental1.setTextColor(0x00FF00);
            this._btnModifyTimerIncremental2.setTextColor(0x00FF00);
            this._btnModifyTimerRegular.setTextColor(0x00FF00);
            this._btnModifyTimerType.setTextColor(0x00FF00);

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

        private async _onTouchedBtnModifySkin(e: egret.TouchEvent): Promise<void> {
            McrModel.Create.tickSelfUnitAndTileSkinId();
            this._updateLabelSkinId();
        }

        private _onTouchedBtnHelpSkinId(e: egret.TouchEvent): void {
            CommonHelpPanel.show({
                title  : Lang.getText(Lang.Type.B0019),
                content: Lang.getRichText(Lang.RichType.R0001),
            });
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
                    title   : Lang.getText(Lang.Type.B0088),
                    content : Lang.getText(Lang.Type.A0129),
                    callback: () => {
                        McrModel.Create.setPresetWarRuleId(null);
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

        private _onTouchedBtnModifyTimerType(e: egret.TouchEvent): void {
            McrModel.Create.tickBootTimerType();
            this._updateGroupTimer();
        }

        private _onTouchedBtnHelpTimer(e: egret.TouchEvent): void {
            CommonHelpPanel.show({
                title  : Lang.getText(Lang.Type.B0021),
                content: Lang.getRichText(Lang.RichType.R0003),
            });
        }

        private _onTouchedBtnModifyTimerRegular(e: egret.TouchEvent): void {
            McrModel.Create.tickTimerRegularTime();
            this._updateGroupTimer();
        }

        private _onTouchedBtnModifyTimerIncremental1(e: egret.TouchEvent): void {
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

        private _onTouchedBtnModifyTimerIncremental2(e: egret.TouchEvent): void {
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
            this._labelMapNameTitle.text        = Lang.getText(Lang.Type.B0225);
            this._labelWarNameTitle.text        = Lang.getText(Lang.Type.B0185);
            this._labelWarPasswordTitle.text    = Lang.getText(Lang.Type.B0186);
            this._labelWarCommentTitle.text     = Lang.getText(Lang.Type.B0187);
            this._labelWarRuleTitle.text        = Lang.getText(Lang.Type.B0318);
            this._labelHasFogTitle.text         = Lang.getText(Lang.Type.B0020);
            this._btnModifySkinId.label         = Lang.getText(Lang.Type.B0397);
            this._btnModifyTimerType.label      = Lang.getText(Lang.Type.B0188);
        }

        private _updateComponentsForWarRule(): void {
            this._updateLabelWarRule();
            this._updateLabelSkinId();
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

        private _updateLabelSkinId(): void {
            this._labelSkinId.text = Lang.getUnitAndTileSkinName(McrModel.Create.getSelfUnitAndTileSkinId());
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
                this._btnModifyTimerRegular.label = Helpers.getTimeDurationText(params[1]);

            } else if (timerType === Types.BootTimerType.Incremental) {
                groupTimer.addChild(groupIncremental);
                this._btnModifyTimerIncremental1.label  = Helpers.getTimeDurationText2(params[1]);
                this._btnModifyTimerIncremental2.label  = Helpers.getTimeDurationText2(params[2]);
            }
        }
    }
}
