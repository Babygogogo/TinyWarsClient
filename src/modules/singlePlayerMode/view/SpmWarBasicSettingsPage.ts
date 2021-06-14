
namespace TinyWars.SinglePlayerMode {
    import Lang             = Utility.Lang;
    import Notify           = Utility.Notify;
    import Types            = Utility.Types;
    import WarMapModel      = WarMap.WarMapModel;
    import BwHelpers        = BaseWar.BwHelpers;
    import CommonHelpPanel  = Common.CommonHelpPanel;

    export type OpenDataForSpmWarBasicSettingsPage = {
        slotIndex   : number | null;
    }
    export class SpmWarBasicSettingsPage extends GameUi.UiTabPage<OpenDataForSpmWarBasicSettingsPage> {
        private readonly _labelMapNameTitle     : TinyWars.GameUi.UiLabel;
        private readonly _labelMapName          : TinyWars.GameUi.UiLabel;

        private readonly _labelSaveSlotTitle    : TinyWars.GameUi.UiLabel;
        private readonly _labelSaveSlot         : TinyWars.GameUi.UiLabel;

        private readonly _labelSlotCommentTitle : TinyWars.GameUi.UiLabel;
        private readonly _labelSlotComment      : TinyWars.GameUi.UiLabel;

        private readonly _labelWarRuleTitle     : TinyWars.GameUi.UiLabel;
        private readonly _labelWarRule          : TinyWars.GameUi.UiLabel;

        private readonly _labelHasFogTitle      : TinyWars.GameUi.UiLabel;
        private readonly _btnHasFogHelp         : TinyWars.GameUi.UiButton;
        private readonly _labelHasFog           : TinyWars.GameUi.UiLabel;

        public constructor() {
            super();

            this.skinName = "resource/skins/singlePlayerMode/SpmWarBasicSettingsPage.exml";
        }

        protected _onOpened(): void {
            this._setUiListenerArray([
                { ui: this._btnHasFogHelp,  callback: this._onTouchedBtnHasFogHelp },
            ]);
            this._setNotifyListenerArray([
                { type: Notify.Type.LanguageChanged,                    callback: this._onNotifyLanguageChanged },
                { type: Notify.Type.MsgSpmGetWarSaveSlotFullDataArray,  callback: this._onNotifyMsgSpmGetWarSaveSlotFullDataArray },
            ]);
            this.left       = 0;
            this.right      = 0;
            this.top        = 0;
            this.bottom     = 0;

            this._updateComponentsForLanguage();
            this._updateComponentsForWarInfo();
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Event callbacks.
        ////////////////////////////////////////////////////////////////////////////////
        private _onNotifyLanguageChanged(e: egret.Event): void {
            this._updateComponentsForLanguage();
        }

        private _onNotifyMsgSpmGetWarSaveSlotFullDataArray(e: egret.Event): void {
            this._updateComponentsForWarInfo();
        }

        private _onTouchedBtnHasFogHelp(e: egret.TouchEvent): void {
            CommonHelpPanel.show({
                title  : Lang.getText(Lang.Type.B0020),
                content: Lang.getRichText(Lang.RichType.R0002),
            });
        }

        ////////////////////////////////////////////////////////////////////////////////
        // View functions.
        ////////////////////////////////////////////////////////////////////////////////
        private _updateComponentsForLanguage(): void {
            this._labelMapNameTitle.text            = Lang.getText(Lang.Type.B0225);
            this._labelSaveSlotTitle.text           = Lang.getText(Lang.Type.B0606);
            this._labelSlotCommentTitle.text        = Lang.getText(Lang.Type.B0605);
            this._labelWarRuleTitle.text            = Lang.getText(Lang.Type.B0318);
            this._labelHasFogTitle.text             = Lang.getText(Lang.Type.B0020);
        }

        private _updateComponentsForWarInfo(): void {
            this._updateLabelSaveSlot();
            this._updateLabelSlotComment();
            this._updateLabelMapName();
            this._updateLabelWarRule();
            this._updateLabelHasFog();
        }

        private _updateLabelSaveSlot(): void {
            this._labelSaveSlot.text = `${this._getOpenData().slotIndex}`;
        }

        private _updateLabelSlotComment(): void {
            const slotData              = this._getSlotData();
            this._labelSlotComment.text = slotData ? slotData.extraData.slotComment : null;
        }

        private async _updateLabelMapName(): Promise<void> {
            const slotData          = this._getSlotData();
            const warData           = slotData ? slotData.warData : null;
            const mapId             = warData ? BwHelpers.getMapId(warData) : null;
            this._labelMapName.text = mapId == null
                ? `(${Lang.getText(Lang.Type.B0321)})`
                : await WarMapModel.getMapNameInCurrentLanguage(mapId);
        }

        private _updateLabelWarRule(): void {
            const slotData          = this._getSlotData();
            const warData           = slotData ? slotData.warData : null;
            const settingsForCommon = warData ? warData.settingsForCommon : undefined;
            const label             = this._labelWarRule;
            if (!settingsForCommon) {
                label.text      = undefined;
            } else {
                label.text      = Lang.getWarRuleNameInLanguage(settingsForCommon.warRule);
                label.textColor = settingsForCommon.presetWarRuleId == null ? 0xFFFF00 : 0xFFFFFF;
            }
        }

        private _updateLabelHasFog(): void {
            const slotData      = this._getSlotData();
            const warData       = slotData ? slotData.warData : null
            const labelHasFog   = this._labelHasFog;
            if (!warData) {
                labelHasFog.text = undefined;
            } else {
                const hasFog            = !!warData.settingsForCommon.warRule.ruleForGlobalParams.hasFogByDefault;
                labelHasFog.text        = Lang.getText(hasFog ? Lang.Type.B0012 : Lang.Type.B0013);
                labelHasFog.textColor   = hasFog ? 0xFFFF00 : 0xFFFFFF;
            }
        }

        private _getSlotData(): Types.SpmWarSaveSlotData {
            return SpmModel.SaveSlot.getSlotDict().get(this._getOpenData().slotIndex);
        }
    }
}
