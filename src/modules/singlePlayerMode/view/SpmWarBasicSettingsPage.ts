
import TwnsUiButton                      from "../../tools/ui/UiButton";
import TwnsUiLabel                      from "../../tools/ui/UiLabel";
import TwnsUiTabPage                    from "../../tools/ui/UiTabPage";
import CommonHelpPanel = TwnsCommonHelpPanel.CommonHelpPanel;import TwnsCommonHelpPanel              from "../../common/view/CommonHelpPanel";
import Lang                         from "../../tools/lang/Lang";
import TwnsLangTextType from "../../tools/lang/LangTextType";
import LangTextType         = TwnsLangTextType.LangTextType;
import Notify                       from "../../tools/notify/Notify";
import TwnsNotifyType from "../../tools/notify/NotifyType";
import NotifyType       = TwnsNotifyType.NotifyType;
import Types                        from "../../tools/helpers/Types";
import WarCommonHelpers             from "../../tools/warHelpers/WarCommonHelpers";
import WarMapModel                  from "../../warMap/model/WarMapModel";
import SpmModel                     from "../model/SpmModel";

export type OpenDataForSpmWarBasicSettingsPage = {
    slotIndex   : number | null;
};
export class SpmWarBasicSettingsPage extends TwnsUiTabPage.UiTabPage<OpenDataForSpmWarBasicSettingsPage> {
    private readonly _labelMapNameTitle     : TwnsUiLabel.UiLabel;
    private readonly _labelMapName          : TwnsUiLabel.UiLabel;

    private readonly _labelSaveSlotTitle    : TwnsUiLabel.UiLabel;
    private readonly _labelSaveSlot         : TwnsUiLabel.UiLabel;

    private readonly _labelSlotCommentTitle : TwnsUiLabel.UiLabel;
    private readonly _labelSlotComment      : TwnsUiLabel.UiLabel;

    private readonly _labelWarRuleTitle     : TwnsUiLabel.UiLabel;
    private readonly _labelWarRule          : TwnsUiLabel.UiLabel;

    private readonly _labelHasFogTitle      : TwnsUiLabel.UiLabel;
    private readonly _btnHasFogHelp         : TwnsUiButton.UiButton;
    private readonly _labelHasFog           : TwnsUiLabel.UiLabel;

    public constructor() {
        super();

        this.skinName = "resource/skins/singlePlayerMode/SpmWarBasicSettingsPage.exml";
    }

    protected _onOpened(): void {
        this._setUiListenerArray([
            { ui: this._btnHasFogHelp,  callback: this._onTouchedBtnHasFogHelp },
        ]);
        this._setNotifyListenerArray([
            { type: NotifyType.LanguageChanged,                    callback: this._onNotifyLanguageChanged },
            { type: NotifyType.MsgSpmGetWarSaveSlotFullDataArray,  callback: this._onNotifyMsgSpmGetWarSaveSlotFullDataArray },
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
            title  : Lang.getText(LangTextType.B0020),
            content: Lang.getText(LangTextType.R0002),
        });
    }

    ////////////////////////////////////////////////////////////////////////////////
    // View functions.
    ////////////////////////////////////////////////////////////////////////////////
    private _updateComponentsForLanguage(): void {
        this._labelMapNameTitle.text            = Lang.getText(LangTextType.B0225);
        this._labelSaveSlotTitle.text           = Lang.getText(LangTextType.B0606);
        this._labelSlotCommentTitle.text        = Lang.getText(LangTextType.B0605);
        this._labelWarRuleTitle.text            = Lang.getText(LangTextType.B0318);
        this._labelHasFogTitle.text             = Lang.getText(LangTextType.B0020);
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
        const mapId             = warData ? WarCommonHelpers.getMapId(warData) : null;
        this._labelMapName.text = mapId == null
            ? `(${Lang.getText(LangTextType.B0321)})`
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
        const warData       = slotData ? slotData.warData : null;
        const labelHasFog   = this._labelHasFog;
        if (!warData) {
            labelHasFog.text = undefined;
        } else {
            const hasFog            = !!warData.settingsForCommon.warRule.ruleForGlobalParams.hasFogByDefault;
            labelHasFog.text        = Lang.getText(hasFog ? LangTextType.B0012 : LangTextType.B0013);
            labelHasFog.textColor   = hasFog ? 0xFFFF00 : 0xFFFFFF;
        }
    }

    private _getSlotData(): Types.SpmWarSaveSlotData {
        return SpmModel.getSlotDict().get(this._getOpenData().slotIndex);
    }
}
