
import McrModel                 from "../../multiCustomRoom/model/McrModel";
import CommonConstants          from "../../tools/helpers/CommonConstants";
import Helpers                  from "../../tools/helpers/Helpers";
import Logger                   from "../../tools/helpers/Logger";
import Types                    from "../../tools/helpers/Types";
import Lang                     from "../../tools/lang/Lang";
import TwnsLangTextType         from "../../tools/lang/LangTextType";
import TwnsNotifyType           from "../../tools/notify/NotifyType";
import ProtoTypes               from "../../tools/proto/ProtoTypes";
import TwnsUiButton             from "../../tools/ui/UiButton";
import TwnsUiLabel              from "../../tools/ui/UiLabel";
import TwnsUiListItemRenderer   from "../../tools/ui/UiListItemRenderer";
import TwnsUiScrollList         from "../../tools/ui/UiScrollList";
import TwnsUiTabPage            from "../../tools/ui/UiTabPage";
import TwnsUiTextInput          from "../../tools/ui/UiTextInput";
import WarMapModel              from "../../warMap/model/WarMapModel";
import TwnsCommonHelpPanel      from "./CommonHelpPanel";

namespace TwnsCommonWarBasicSettingsPage {
    import CommonHelpPanel      = TwnsCommonHelpPanel.CommonHelpPanel;
    import LangTextType         = TwnsLangTextType.LangTextType;
    import NotifyType           = TwnsNotifyType.NotifyType;
    import WarBasicSettingsType = Types.WarBasicSettingsType;

    export type OpenDataForCommonWarBasicSettingsPage = {
        roomId  : number | null;
    };
    export class CommonWarBasicSettingsPage extends TwnsUiTabPage.UiTabPage<OpenDataForCommonWarBasicSettingsPage> {
        private readonly _listSettings  : TwnsUiScrollList.UiScrollList<DataForSettingsRenderer>;

        private readonly _labelMapNameTitle             : TwnsUiLabel.UiLabel;
        private readonly _labelMapName                  : TwnsUiLabel.UiLabel;

        private readonly _labelWarNameTitle             : TwnsUiLabel.UiLabel;
        private readonly _labelWarName                  : TwnsUiLabel.UiLabel;

        private readonly _labelWarPasswordTitle         : TwnsUiLabel.UiLabel;
        private readonly _labelWarPassword              : TwnsUiLabel.UiLabel;

        private readonly _labelWarCommentTitle          : TwnsUiLabel.UiLabel;
        private readonly _labelWarComment               : TwnsUiLabel.UiLabel;

        private readonly _labelWarRuleTitle             : TwnsUiLabel.UiLabel;
        private readonly _labelWarRule                  : TwnsUiLabel.UiLabel;

        private readonly _labelHasFogTitle              : TwnsUiLabel.UiLabel;
        private readonly _labelHasFog                   : TwnsUiLabel.UiLabel;
        private readonly _btnHasFogHelp                 : TwnsUiButton.UiButton;

        private readonly _groupTimer                    : eui.Group;
        private readonly _labelTimerTypeTitle           : TwnsUiLabel.UiLabel;
        private readonly _labelTimerType                : TwnsUiLabel.UiLabel;
        private readonly _btnTimerTypeHelp              : TwnsUiButton.UiButton;

        private readonly _groupTimerRegular             : eui.Group;
        private readonly _labelTimerRegularTitle        : TwnsUiLabel.UiLabel;
        private readonly _labelTimerRegular             : TwnsUiLabel.UiLabel;

        private readonly _groupTimerIncremental         : eui.Group;
        private readonly _labelTimerIncrementalTitle1   : TwnsUiLabel.UiLabel;
        private readonly _labelTimerIncremental1        : TwnsUiLabel.UiLabel;
        private readonly _labelTimerIncrementalTitle2   : TwnsUiLabel.UiLabel;
        private readonly _labelTimerIncremental2        : TwnsUiLabel.UiLabel;

        public constructor() {
            super();

            this.skinName = "resource/skins/common/CommonWarBasicSettingsPage.exml";
        }

        protected _onOpened(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.MsgMcrGetRoomInfo,  callback: this._onNotifyMsgMcrGetRoomInfo },
            ]);
            this._listSettings.setItemRenderer(SettingsRenderer);
            this.left   = 0;
            this.right  = 0;
            this.top    = 0;
            this.bottom = 0;

            this._updateView();
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Event callbacks.
        ////////////////////////////////////////////////////////////////////////////////
        private _onNotifyMsgMcrGetRoomInfo(e: egret.Event): void {
            this._updateView();
        }

        ////////////////////////////////////////////////////////////////////////////////
        // View functions.
        ////////////////////////////////////////////////////////////////////////////////
        private _updateView(): void {
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
            this._labelWarName.text = roomInfo ? roomInfo.settingsForMcw.warName : undefined;
        }

        private async _updateLabelWarPassword(): Promise<void> {
            const roomInfo              = await this._getRoomInfo();
            this._labelWarPassword.text = (roomInfo && roomInfo.settingsForMcw.warPassword) ? `****` : undefined;
        }

        private async _updateLabelWarComment(): Promise<void> {
            const roomInfo              = await this._getRoomInfo();
            this._labelWarComment.text  = roomInfo ? roomInfo.settingsForMcw.warComment : undefined;
        }

        private async _updateLabelMapName(): Promise<void> {
            const roomInfo          = await this._getRoomInfo();
            this._labelMapName.text = roomInfo ? await WarMapModel.getMapNameInCurrentLanguage(roomInfo.settingsForMcw.mapId) : undefined;
        }

        private async _updateLabelWarRule(): Promise<void> {
            const roomInfo          = await this._getRoomInfo();
            const settingsForCommon = roomInfo ? roomInfo.settingsForCommon : undefined;
            const label             = this._labelWarRule;
            if (!settingsForCommon) {
                label.text      = undefined;
            } else {
                label.text      = Lang.getWarRuleNameInLanguage(settingsForCommon.warRule);
                label.textColor = settingsForCommon.presetWarRuleId == null ? 0xFFFF00 : 0xFFFFFF;
            }
        }

        private async _updateLabelHasFog(): Promise<void> {
            const roomInfo      = await this._getRoomInfo();
            const labelHasFog   = this._labelHasFog;
            if (!roomInfo) {
                labelHasFog.text = undefined;
            } else {
                const hasFog            = !!roomInfo.settingsForCommon.warRule.ruleForGlobalParams.hasFogByDefault;
                labelHasFog.text        = Lang.getText(hasFog ? LangTextType.B0012 : LangTextType.B0013);
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
            const params            = roomInfo ? roomInfo.settingsForMcw.bootTimerParams : undefined;
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

        private _getRoomInfo(): Promise<ProtoTypes.MultiCustomRoom.IMcrRoomInfo> {
            return McrModel.getRoomInfo(this._getOpenData().roomId);
        }
    }

    type DataForSettingsRenderer = {
        warType         : Types.WarType;
        settingsType    : WarBasicSettingsType;
        currentValue    : number | string | undefined;
        warRule         : ProtoTypes.WarRule.IWarRule;
        callbackOnModify: ((newValue: string | number) => void) | undefined;
    };
    class SettingsRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForSettingsRenderer> {
        private readonly _labelTitle    : TwnsUiLabel.UiLabel;
        private readonly _labelValue    : TwnsUiLabel.UiLabel;
        private readonly _btnModify     : TwnsUiButton.UiButton;
        private readonly _btnHelp       : TwnsUiButton.UiButton;

        protected _onOpened(): void {
            this._setUiListenerArray([
                { ui: this._btnModify,  callback: this._onTouchedBtnModify },
                { ui: this._btnHelp,    callback: this._onTouchedBtnHelp },
            ]);
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged, callback: this._onNotifyLanguageChanged },
            ]);
        }

        protected _onDataChanged(): void {
            this._updateView();
        }

        private _onTouchedBtnModify(): void {
            const data      = this.data;
            const callback  = data.callbackOnModify;
            if (callback == null) {
                return;
            }

            // TODO
            const settingsType = data.settingsType;
            if (settingsType === WarBasicSettingsType.WarName) {
                this._updateViewAsWarName();
            } else if (settingsType === WarBasicSettingsType.WarPassword) {
                this._updateViewAsWarPassword();
            } else if (settingsType === WarBasicSettingsType.WarComment) {
                this._updateViewAsWarComment();
            } else if (settingsType === WarBasicSettingsType.WarRuleTitle) {
                this._updateViewAsWarRuleTitle();
            } else if (settingsType === WarBasicSettingsType.HasFog) {
                this._updateViewAsHasFog();
            } else if (settingsType === WarBasicSettingsType.TimerType) {
                this._updateViewAsTimerType();
            } else if (settingsType === WarBasicSettingsType.TimerRegularParam) {
                this._updateViewAsTimerRegularParam();
            } else if (settingsType === WarBasicSettingsType.TimerIncrementalParam1) {
                this._updateViewAsTimerIncrementalParam1();
            } else if (settingsType === WarBasicSettingsType.TimerIncrementalParam2) {
                this._updateViewAsTimerIncrementalParam2();
            } else {
                Logger.error(`CommonWarBasicSettingsPage.SettingsRenderer._updateView() invalid settingsType.`);
            }
        }
        private _onTouchedBtnHelp(): void {
            const settingsType = this.data.settingsType;
            if (settingsType === WarBasicSettingsType.HasFog) {
                CommonHelpPanel.show({
                    title  : Lang.getText(LangTextType.B0020),
                    content: Lang.getText(LangTextType.R0002),
                });
            } else if (settingsType === WarBasicSettingsType.TimerType) {
                CommonHelpPanel.show({
                    title  : Lang.getText(LangTextType.B0574),
                    content: Lang.getText(LangTextType.R0003),
                });
            }
        }
        private _onNotifyLanguageChanged(): void {
            this._updateView();
        }

        private _updateView(): void {
            const data              = this.data;
            const settingsType      = data.settingsType;
            this._labelTitle.text   = Lang.getWarBasicSettingsName(settingsType) || CommonConstants.ErrorTextForUndefined;
            this._btnModify.visible = data.callbackOnModify != null;

            if (settingsType === WarBasicSettingsType.MapName) {
                this._updateViewAsMapName();
            } else if (settingsType === WarBasicSettingsType.WarName) {
                this._updateViewAsWarName();
            } else if (settingsType === WarBasicSettingsType.WarPassword) {
                this._updateViewAsWarPassword();
            } else if (settingsType === WarBasicSettingsType.WarComment) {
                this._updateViewAsWarComment();
            } else if (settingsType === WarBasicSettingsType.WarRuleTitle) {
                this._updateViewAsWarRuleTitle();
            } else if (settingsType === WarBasicSettingsType.HasFog) {
                this._updateViewAsHasFog();
            } else if (settingsType === WarBasicSettingsType.TimerType) {
                this._updateViewAsTimerType();
            } else if (settingsType === WarBasicSettingsType.TimerRegularParam) {
                this._updateViewAsTimerRegularParam();
            } else if (settingsType === WarBasicSettingsType.TimerIncrementalParam1) {
                this._updateViewAsTimerIncrementalParam1();
            } else if (settingsType === WarBasicSettingsType.TimerIncrementalParam2) {
                this._updateViewAsTimerIncrementalParam2();
            } else {
                Logger.error(`CommonWarBasicSettingsPage.SettingsRenderer._updateView() invalid settingsType.`);
            }
        }
        private _updateViewAsMapName(): void {
            const data              = this.data;
            this._labelValue.text   = `${data.currentValue}`;
            this._btnHelp.visible   = false;
        }
        private _updateViewAsWarName(): void {
            const data              = this.data;
            this._labelValue.text   = `${data.currentValue}`;
            this._btnHelp.visible   = false;
        }
        private _updateViewAsWarPassword(): void {
            const data              = this.data;
            this._labelValue.text   = `${data.currentValue}`;
            this._btnHelp.visible   = false;
        }
        private _updateViewAsWarComment(): void {
            const data              = this.data;
            this._labelValue.text   = `${data.currentValue}`;
            this._btnHelp.visible   = false;
        }
        private _updateViewAsWarRuleTitle(): void {
            const data              = this.data;
            const warRule           = data.warRule;
            const labelValue        = this._labelValue;
            labelValue.text         = Lang.getWarRuleNameInLanguage(warRule);
            labelValue.textColor    = warRule.ruleId == null ? 0xFFFF00 : 0xFFFFFF;
            this._btnHelp.visible   = false;
        }
        private _updateViewAsHasFog(): void {
            const data              = this.data;
            const hasFog            = data.warRule.ruleForGlobalParams.hasFogByDefault;
            const labelValue        = this._labelValue;
            labelValue.text         = Lang.getText(hasFog ? LangTextType.B0012 : LangTextType.B0013);
            labelValue.textColor    = hasFog == null ? 0xFFFF00 : 0xFFFFFF;
            this._btnHelp.visible   = true;
        }
        private _updateViewAsTimerType(): void {
            const data              = this.data;
            this._labelValue.text   = Lang.getBootTimerTypeName(data.currentValue as Types.BootTimerType);
            this._btnHelp.visible   = true;
        }
        private _updateViewAsTimerRegularParam(): void {
            const data              = this.data;
            this._labelValue.text   = Helpers.getTimeDurationText2(data.currentValue as number);
            this._btnHelp.visible   = false;
        }
        private _updateViewAsTimerIncrementalParam1(): void {
            const data              = this.data;
            this._labelValue.text   = Helpers.getTimeDurationText2(data.currentValue as number);
            this._btnHelp.visible   = false;
        }
        private _updateViewAsTimerIncrementalParam2(): void {
            const data              = this.data;
            this._labelValue.text   = Helpers.getTimeDurationText2(data.currentValue as number);
            this._btnHelp.visible   = false;
        }
    }
}

export default TwnsCommonWarBasicSettingsPage;
