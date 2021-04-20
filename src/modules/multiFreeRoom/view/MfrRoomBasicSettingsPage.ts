
namespace TinyWars.MultiFreeRoom {
    import Helpers          = Utility.Helpers;
    import Lang             = Utility.Lang;
    import Notify           = Utility.Notify;
    import Types            = Utility.Types;
    import ProtoTypes       = Utility.ProtoTypes;
    import WarMapModel      = WarMap.WarMapModel;
    import CommonHelpPanel  = Common.CommonHelpPanel;

    export type OpenDataForMfrRoomBasicSettingsPage = {
        roomId  : number | null;
    }
    export class MfrRoomBasicSettingsPage extends GameUi.UiTabPage {
        private readonly _labelMapNameTitle             : GameUi.UiLabel;
        private readonly _labelMapName                  : GameUi.UiLabel;

        private readonly _labelWarNameTitle             : GameUi.UiLabel;
        private readonly _labelWarName                  : GameUi.UiLabel;

        private readonly _labelWarPasswordTitle         : GameUi.UiLabel;
        private readonly _labelWarPassword              : GameUi.UiLabel;

        private readonly _labelWarCommentTitle          : GameUi.UiLabel;
        private readonly _labelWarComment               : GameUi.UiLabel;

        private readonly _labelWarRuleTitle             : GameUi.UiLabel;
        private readonly _labelWarRule                  : GameUi.UiLabel;

        private readonly _labelHasFogTitle              : GameUi.UiLabel;
        private readonly _labelHasFog                   : GameUi.UiLabel;
        private readonly _btnHasFogHelp                 : GameUi.UiButton;

        private readonly _groupTimer                    : eui.Group;
        private readonly _labelTimerTypeTitle           : GameUi.UiLabel;
        private readonly _labelTimerType                : GameUi.UiLabel;
        private readonly _btnTimerTypeHelp              : GameUi.UiButton;

        private readonly _groupTimerRegular             : eui.Group;
        private readonly _labelTimerRegularTitle        : GameUi.UiLabel;
        private readonly _labelTimerRegular             : GameUi.UiLabel;

        private readonly _groupTimerIncremental         : eui.Group;
        private readonly _labelTimerIncrementalTitle1   : GameUi.UiLabel;
        private readonly _labelTimerIncremental1        : GameUi.UiLabel;
        private readonly _labelTimerIncrementalTitle2   : GameUi.UiLabel;
        private readonly _labelTimerIncremental2        : GameUi.UiLabel;

        public constructor() {
            super();

            this.skinName = "resource/skins/multiFreeRoom/MfrRoomBasicSettingsPage.exml";
        }

        protected _onOpened(): void {
            this._setUiListenerArray([
                { ui: this._btnHasFogHelp,          callback: this._onTouchedBtnHasFogHelp },
                { ui: this._btnTimerTypeHelp,       callback: this._onTouchedBtnTimerTypeHelp, },
            ]);
            this._setNotifyListenerArray([
                { type: Notify.Type.LanguageChanged,    callback: this._onNotifyLanguageChanged },
                { type: Notify.Type.MsgMfrGetRoomInfo,  callback: this._onNotifyMsgMfrGetRoomInfo },
            ]);
            this.left       = 0;
            this.right      = 0;
            this.top        = 0;
            this.bottom     = 0;

            this._updateComponentsForLanguage();
            this._updateComponentsForRoomInfo();
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Event callbacks.
        ////////////////////////////////////////////////////////////////////////////////
        private _onNotifyLanguageChanged(e: egret.Event): void {
            this._updateComponentsForLanguage();
        }

        private _onNotifyMsgMfrGetRoomInfo(e: egret.Event): void {
            this._updateComponentsForRoomInfo();
        }

        private _onTouchedBtnHasFogHelp(e: egret.TouchEvent): void {
            CommonHelpPanel.show({
                title  : Lang.getText(Lang.Type.B0020),
                content: Lang.getRichText(Lang.RichType.R0002),
            });
        }

        private _onTouchedBtnTimerTypeHelp(e: egret.TouchEvent): void {
            CommonHelpPanel.show({
                title  : Lang.getText(Lang.Type.B0574),
                content: Lang.getRichText(Lang.RichType.R0003),
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

        private _updateComponentsForRoomInfo(): void {
            this._updateLabelWarName();
            this._updateLabelWarPassword();
            this._updateLabelWarComment();
            this._updateLabelMapName();
            this._updateLabelWarRule();
            this._updateLabelHasFog();
            this._updateGroupTimer();
        }

        private async _updateLabelWarName(): Promise<void> {
            const roomInfo          = await this._getRoomInfo();
            this._labelWarName.text = roomInfo ? roomInfo.settingsForMfw.warName : undefined;
        }

        private async _updateLabelWarPassword(): Promise<void> {
            const roomInfo              = await this._getRoomInfo();
            this._labelWarPassword.text = (roomInfo && roomInfo.settingsForMfw.warPassword) ? `****` : undefined;
        }

        private async _updateLabelWarComment(): Promise<void> {
            const roomInfo              = await this._getRoomInfo();
            this._labelWarComment.text  = roomInfo ? roomInfo.settingsForMfw.warComment : undefined;
        }

        private async _updateLabelMapName(): Promise<void> {
            this._labelMapName.text = `--`;
        }

        private async _updateLabelWarRule(): Promise<void> {
            this._labelWarRule.text = `--`;
        }

        private async _updateLabelHasFog(): Promise<void> {
            const roomInfo      = await this._getRoomInfo();
            const labelHasFog   = this._labelHasFog;
            if (!roomInfo) {
                labelHasFog.text = undefined;
            } else {
                const hasFog            = !!roomInfo.settingsForMfw.initialWarData.settingsForCommon.warRule.ruleForGlobalParams.hasFogByDefault;
                labelHasFog.text        = Lang.getText(hasFog ? Lang.Type.B0012 : Lang.Type.B0013);
                labelHasFog.textColor   = hasFog ? 0xFFFF00 : 0xFFFFFF;
            }
        }

        private async _updateGroupTimer(): Promise<void> {
            const groupTimer        = this._groupTimer;
            const groupRegular      = this._groupTimerRegular;
            const groupIncremental  = this._groupTimerIncremental;
            (groupRegular.parent) && (groupRegular.parent.removeChild(groupRegular));
            (groupIncremental.parent) && (groupIncremental.parent.removeChild(groupIncremental));

            const roomInfo          = await this._getRoomInfo();
            const params            = roomInfo ? roomInfo.settingsForMfw.bootTimerParams : undefined;
            const labelTimerType    = this._labelTimerType;
            if (!params) {
                labelTimerType.text = undefined;
            } else {
                const timerType     : Types.BootTimerType = params[0];
                labelTimerType.text = Lang.getBootTimerTypeName(timerType);

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

        private _getRoomInfo(): Promise<ProtoTypes.MultiFreeRoom.IMfrRoomInfo> {
            return MfrModel.getRoomInfo(this._getOpenData<OpenDataForMfrRoomBasicSettingsPage>().roomId);
        }
    }
}
