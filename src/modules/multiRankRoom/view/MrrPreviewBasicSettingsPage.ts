
namespace TinyWars.MultiRankRoom {
    import Helpers          = Utility.Helpers;
    import Lang             = Utility.Lang;
    import Notify           = Utility.Notify;
    import Types            = Utility.Types;
    import ProtoTypes       = Utility.ProtoTypes;
    import CommonConstants  = Utility.CommonConstants;
    import WarMapModel      = WarMap.WarMapModel;
    import CommonHelpPanel  = Common.CommonHelpPanel;

    export type OpenDataForMrrPreviewBasicSettingsPage = {
        hasFog  : boolean;
        mapId   : number | null;
    }
    export class MrrPreviewBasicSettingsPage extends GameUi.UiTabPage<OpenDataForMrrPreviewBasicSettingsPage> {
        private readonly _labelMapNameTitle             : GameUi.UiLabel;
        private readonly _labelMapName                  : GameUi.UiLabel;

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

            this.skinName = "resource/skins/multiRankRoom/MrrPreviewBasicSettingsPage.exml";
        }

        protected _onOpened(): void {
            this._setUiListenerArray([
                { ui: this._btnHasFogHelp,          callback: this._onTouchedBtnHasFogHelp },
                { ui: this._btnTimerTypeHelp,       callback: this._onTouchedBtnTimerTypeHelp, },
            ]);
            this._setNotifyListenerArray([
                { type: Notify.Type.LanguageChanged,    callback: this._onNotifyLanguageChanged },
                { type: Notify.Type.MsgMapGetRawData,   callback: this._onNotifyMsgMapGetRawData },
            ]);
            this.left       = 0;
            this.right      = 0;
            this.top        = 0;
            this.bottom     = 0;

            this._updateComponentsForLanguage();
            this._updateComponentsForMapInfo();
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Event callbacks.
        ////////////////////////////////////////////////////////////////////////////////
        private _onNotifyLanguageChanged(e: egret.Event): void {
            this._updateComponentsForLanguage();
        }

        private _onNotifyMsgMapGetRawData(e: egret.Event): void {
            this._updateComponentsForMapInfo();
        }

        private _onTouchedBtnHasFogHelp(e: egret.TouchEvent): void {
            CommonHelpPanel.show({
                title  : Lang.getText(Lang.Type.B0020),
                content: Lang.getText(Lang.Type.R0002),
            });
        }

        private _onTouchedBtnTimerTypeHelp(e: egret.TouchEvent): void {
            CommonHelpPanel.show({
                title  : Lang.getText(Lang.Type.B0574),
                content: Lang.getText(Lang.Type.R0003),
            });
        }

        ////////////////////////////////////////////////////////////////////////////////
        // View functions.
        ////////////////////////////////////////////////////////////////////////////////
        private _updateComponentsForLanguage(): void {
            this._labelMapNameTitle.text            = Lang.getText(Lang.Type.B0225);
            this._labelWarRuleTitle.text            = Lang.getText(Lang.Type.B0318);
            this._labelHasFogTitle.text             = Lang.getText(Lang.Type.B0020);
            this._labelTimerTypeTitle.text          = Lang.getText(Lang.Type.B0574);
            this._labelTimerRegularTitle.text       = Lang.getText(Lang.Type.B0021);
            this._labelTimerIncrementalTitle1.text  = Lang.getText(Lang.Type.B0389);
            this._labelTimerIncrementalTitle2.text  = Lang.getText(Lang.Type.B0390);
        }

        private _updateComponentsForMapInfo(): void {
            this._updateLabelMapName();
            this._updateLabelWarRule();
            this._updateLabelHasFog();
            this._updateGroupTimer();
        }

        private async _updateLabelMapName(): Promise<void> {
            this._labelMapName.text = await WarMapModel.getMapNameInCurrentLanguage(this._getOpenData().mapId) || `??`;
        }

        private async _updateLabelWarRule(): Promise<void> {
            const openData          = this._getOpenData();
            const mapRawData        = await WarMapModel.getRawData(openData.mapId);
            const warRule           = (mapRawData ? mapRawData.warRuleArray || [] : []).find(v => v.ruleForGlobalParams.hasFogByDefault === openData.hasFog);
            this._labelWarRule.text = warRule ? Lang.getWarRuleNameInLanguage(warRule) || `??` : `??`;
        }

        private async _updateLabelHasFog(): Promise<void> {
            const hasFog            = this._getOpenData().hasFog;
            const labelHasFog       = this._labelHasFog;
            labelHasFog.text        = Lang.getText(hasFog ? Lang.Type.B0012 : Lang.Type.B0013);
            labelHasFog.textColor   = hasFog ? 0xFFFF00 : 0xFFFFFF;
        }

        private async _updateGroupTimer(): Promise<void> {
            const groupTimer        = this._groupTimer;
            const groupRegular      = this._groupTimerRegular;
            const groupIncremental  = this._groupTimerIncremental;
            (groupRegular.parent) && (groupRegular.parent.removeChild(groupRegular));
            (groupIncremental.parent) && (groupIncremental.parent.removeChild(groupIncremental));

            const params            = CommonConstants.WarBootTimerDefaultParams;
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
    }
}
