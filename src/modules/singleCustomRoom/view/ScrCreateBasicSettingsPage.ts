
namespace TinyWars.SingleCustomRoom {
    import ProtoTypes       = Utility.ProtoTypes;
    import Helpers          = Utility.Helpers;
    import Lang             = Utility.Lang;
    import Notify           = Utility.Notify;
    import Types            = Utility.Types;
    import CommonConstants  = Utility.CommonConstants;
    import WarMapModel      = WarMap.WarMapModel;
    import CommonHelpPanel  = Common.CommonHelpPanel;

    export class ScrCreateBasicSettingsPage extends GameUi.UiTabPage<void> {
        private readonly _labelMapNameTitle             : GameUi.UiLabel;
        private readonly _labelMapName                  : GameUi.UiLabel;

        private readonly _labelSaveSlotTitle            : GameUi.UiLabel;
        private readonly _labelSaveSlot                 : GameUi.UiLabel;
        private readonly _btnSaveSlot                   : GameUi.UiButton;

        private readonly _labelSlotCommentTitle         : GameUi.UiLabel;
        private readonly _inputSlotComment              : GameUi.UiTextInput;

        private readonly _labelWarRuleTitle             : GameUi.UiLabel;
        private readonly _labelWarRule                  : GameUi.UiLabel;
        private readonly _btnWarRule                    : GameUi.UiButton;

        private readonly _labelHasFogTitle              : GameUi.UiLabel;
        private readonly _labelHasFog                   : GameUi.UiLabel;
        private readonly _btnHasFog                     : GameUi.UiButton;
        private readonly _btnHasFogHelp                 : GameUi.UiButton;

        private _mapRawData : ProtoTypes.Map.IMapRawData;

        public constructor() {
            super();

            this.skinName = "resource/skins/singleCustomRoom/ScrCreateBasicSettingsPage.exml";
        }

        protected async _onOpened(): Promise<void> {
            this._setUiListenerArray([
                { ui: this._inputSlotComment,   callback: this._onFocusOutInputSlotComment,     eventType: egret.FocusEvent.FOCUS_OUT },
                { ui: this._btnWarRule,         callback: this._onTouchedBtnWarRule },
                { ui: this._btnHasFog,          callback: this._onTouchedBtnHasFog },
                { ui: this._btnHasFogHelp,      callback: this._onTouchedBtnHasFogHelp },
                { ui: this._btnSaveSlot,        callback: this._onTouchedBtnSaveSlot, },
            ]);
            this._setNotifyListenerArray([
                { type: Notify.Type.LanguageChanged,                callback: this._onNotifyLanguageChanged },
                { type: Notify.Type.ScrCreateWarSaveSlotChanged,    callback: this._onNotifyScrCreateWarSaveSlotChanged },
            ]);
            this.left                       = 0;
            this.right                      = 0;
            this.top                        = 0;
            this.bottom                     = 0;
            this._inputSlotComment.maxChars = CommonConstants.ScwSaveSlotCommentMaxLength;

            this._mapRawData = await ScrModel.Create.getMapRawData();

            this._updateComponentsForLanguage();
            this._updateComponentsForWarRule();
            this._updateInputSlotComment();
            this._updateLabelMapName();
            this._updateLabelSaveSlot();
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Event callbacks.
        ////////////////////////////////////////////////////////////////////////////////
        private _onNotifyLanguageChanged(e: egret.Event): void {
            this._updateComponentsForLanguage();
        }
        private _onNotifyScrCreateWarSaveSlotChanged(e: egret.Event): void {
            this._updateLabelSaveSlot();
        }

        private _onFocusOutInputSlotComment(e: egret.Event): void {
            ScrModel.Create.setSlotComment(this._inputSlotComment.text || undefined);
            this._updateInputSlotComment();
        }

        private async _onTouchedBtnWarRule(e: egret.TouchEvent): Promise<void> {
            await ScrModel.Create.tickPresetWarRuleId();
            this._updateComponentsForWarRule();
        }

        private _onTouchedBtnHasFog(e: egret.TouchEvent): void {
            const callback = () => {
                ScrModel.Create.setHasFog(!ScrModel.Create.getHasFog());
                this._updateLabelHasFog();
                this._updateLabelWarRule();
            };
            if (ScrModel.Create.getPresetWarRuleId() == null) {
                callback();
            } else {
                Common.CommonConfirmPanel.show({
                    content : Lang.getText(Lang.Type.A0129),
                    callback: () => {
                        ScrModel.Create.setCustomWarRuleId();
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

        private _onTouchedBtnSaveSlot(e: egret.TouchEvent): void {
            ScrCreateSaveSlotsPanel.show();
        }

        ////////////////////////////////////////////////////////////////////////////////
        // View functions.
        ////////////////////////////////////////////////////////////////////////////////
        private _updateComponentsForLanguage(): void {
            this._labelMapNameTitle.text        = Lang.getText(Lang.Type.B0225);
            this._labelSaveSlotTitle.text       = Lang.getText(Lang.Type.B0606);
            this._labelSlotCommentTitle.text    = Lang.getText(Lang.Type.B0605);
            this._labelWarRuleTitle.text        = Lang.getText(Lang.Type.B0318);
            this._labelHasFogTitle.text         = Lang.getText(Lang.Type.B0020);
        }

        private _updateComponentsForWarRule(): void {
            this._updateLabelWarRule();
            this._updateLabelHasFog();
        }

        private _updateInputSlotComment(): void {
            this._inputSlotComment.text = ScrModel.Create.getSlotComment();
        }

        private async _updateLabelMapName(): Promise<void> {
            this._labelMapName.text = await WarMapModel.getMapNameInCurrentLanguage(this._mapRawData.mapId);
        }

        private _updateLabelSaveSlot(): void {
            this._labelSaveSlot.text = `${ScrModel.Create.getSaveSlotIndex()}`;
        }

        private _updateLabelWarRule(): void {
            const label             = this._labelWarRule;
            const settingsForCommon = ScrModel.Create.getData().settingsForCommon;
            label.text              = Lang.getWarRuleNameInLanguage(settingsForCommon.warRule);
            label.textColor         = settingsForCommon.presetWarRuleId == null ? 0xFFFF00 : 0xFFFFFF;
        }

        private _updateLabelHasFog(): void {
            this._labelHasFog.text = Lang.getText(ScrModel.Create.getHasFog() ? Lang.Type.B0012 : Lang.Type.B0013);
        }
    }
}
