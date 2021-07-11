
import { UiButton }                     from "../../../gameui/UiButton";
import { UiLabel }                      from "../../../gameui/UiLabel";
import { UiTabPage }                    from "../../../gameui/UiTabPage";
import { CommonHelpPanel }              from "../../common/view/CommonHelpPanel";
import * as Lang                        from "../../../utility/Lang";
import * as Notify                      from "../../../utility/Notify";
import * as Types                       from "../../../utility/Types";
import * as BwHelpers                   from "../../baseWar/model/BwHelpers";
import * as WarMapModel                 from "../../warMap/model/WarMapModel";
import * as SpmModel                    from "../model/SpmModel";

export type OpenDataForSpmWarBasicSettingsPage = {
    slotIndex   : number | null;
};
export class SpmWarBasicSettingsPage extends UiTabPage<OpenDataForSpmWarBasicSettingsPage> {
    private readonly _labelMapNameTitle     : UiLabel;
    private readonly _labelMapName          : UiLabel;

    private readonly _labelSaveSlotTitle    : UiLabel;
    private readonly _labelSaveSlot         : UiLabel;

    private readonly _labelSlotCommentTitle : UiLabel;
    private readonly _labelSlotComment      : UiLabel;

    private readonly _labelWarRuleTitle     : UiLabel;
    private readonly _labelWarRule          : UiLabel;

    private readonly _labelHasFogTitle      : UiLabel;
    private readonly _btnHasFogHelp         : UiButton;
    private readonly _labelHasFog           : UiLabel;

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
            content: Lang.getText(Lang.Type.R0002),
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
        const warData       = slotData ? slotData.warData : null;
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
