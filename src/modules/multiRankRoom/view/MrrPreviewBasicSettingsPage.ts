
import { UiButton }                     from "../../../utility/ui/UiButton";
import { UiLabel }                      from "../../../utility/ui/UiLabel";
import { UiTabPage }                    from "../../../utility/ui/UiTabPage";
import { CommonHelpPanel }              from "../../common/view/CommonHelpPanel";
import { CommonConstants }              from "../../../utility/CommonConstants";
import { Helpers }                      from "../../../utility/Helpers";
import { Lang }                         from "../../../utility/lang/Lang";
import { TwnsLangTextType } from "../../../utility/lang/LangTextType";
import LangTextType         = TwnsLangTextType.LangTextType;
import { Notify }                       from "../../../utility/notify/Notify";
import { TwnsNotifyType } from "../../../utility/notify/NotifyType";
import NotifyType       = TwnsNotifyType.NotifyType;
import { Types }                        from "../../../utility/Types";
import { WarMapModel }                  from "../../warMap/model/WarMapModel";

export type OpenDataForMrrPreviewBasicSettingsPage = {
    hasFog  : boolean;
    mapId   : number | null;
};
export class MrrPreviewBasicSettingsPage extends UiTabPage<OpenDataForMrrPreviewBasicSettingsPage> {
    private readonly _labelMapNameTitle             : UiLabel;
    private readonly _labelMapName                  : UiLabel;

    private readonly _labelWarRuleTitle             : UiLabel;
    private readonly _labelWarRule                  : UiLabel;

    private readonly _labelHasFogTitle              : UiLabel;
    private readonly _labelHasFog                   : UiLabel;
    private readonly _btnHasFogHelp                 : UiButton;

    private readonly _groupTimer                    : eui.Group;
    private readonly _labelTimerTypeTitle           : UiLabel;
    private readonly _labelTimerType                : UiLabel;
    private readonly _btnTimerTypeHelp              : UiButton;

    private readonly _groupTimerRegular             : eui.Group;
    private readonly _labelTimerRegularTitle        : UiLabel;
    private readonly _labelTimerRegular             : UiLabel;

    private readonly _groupTimerIncremental         : eui.Group;
    private readonly _labelTimerIncrementalTitle1   : UiLabel;
    private readonly _labelTimerIncremental1        : UiLabel;
    private readonly _labelTimerIncrementalTitle2   : UiLabel;
    private readonly _labelTimerIncremental2        : UiLabel;

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
            { type: NotifyType.LanguageChanged,    callback: this._onNotifyLanguageChanged },
            { type: NotifyType.MsgMapGetRawData,   callback: this._onNotifyMsgMapGetRawData },
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
            title  : Lang.getText(LangTextType.B0020),
            content: Lang.getText(LangTextType.R0002),
        });
    }

    private _onTouchedBtnTimerTypeHelp(e: egret.TouchEvent): void {
        CommonHelpPanel.show({
            title  : Lang.getText(LangTextType.B0574),
            content: Lang.getText(LangTextType.R0003),
        });
    }

    ////////////////////////////////////////////////////////////////////////////////
    // View functions.
    ////////////////////////////////////////////////////////////////////////////////
    private _updateComponentsForLanguage(): void {
        this._labelMapNameTitle.text            = Lang.getText(LangTextType.B0225);
        this._labelWarRuleTitle.text            = Lang.getText(LangTextType.B0318);
        this._labelHasFogTitle.text             = Lang.getText(LangTextType.B0020);
        this._labelTimerTypeTitle.text          = Lang.getText(LangTextType.B0574);
        this._labelTimerRegularTitle.text       = Lang.getText(LangTextType.B0021);
        this._labelTimerIncrementalTitle1.text  = Lang.getText(LangTextType.B0389);
        this._labelTimerIncrementalTitle2.text  = Lang.getText(LangTextType.B0390);
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
        labelHasFog.text        = Lang.getText(hasFog ? LangTextType.B0012 : LangTextType.B0013);
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
