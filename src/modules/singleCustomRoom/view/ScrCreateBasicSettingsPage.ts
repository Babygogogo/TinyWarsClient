
import { UiButton }                     from "../../../gameui/UiButton";
import { UiLabel }                      from "../../../gameui/UiLabel";
import { UiTextInput }                  from "../../../gameui/UiTextInput";
import { UiTabPage }                    from "../../../gameui/UiTabPage";
import { CommonConfirmPanel }           from "../../common/view/CommonConfirmPanel";
import { CommonHelpPanel }              from "../../common/view/CommonHelpPanel";
import { ScrCreateSaveSlotsPanel }      from "./ScrCreateSaveSlotsPanel";
import * as CommonConstants             from "../../../utility/CommonConstants";
import * as Lang                        from "../../../utility/Lang";
import { LangTextType } from "../../../utility/LangTextType";
import * as Notify                      from "../../../utility/Notify";
import { NotifyType } from "../../../utility/NotifyType";
import * as ProtoTypes                  from "../../../utility/ProtoTypes";
import * as WarMapModel                 from "../../warMap/model/WarMapModel";
import * as ScrModel                    from "../model/ScrModel";

export class ScrCreateBasicSettingsPage extends UiTabPage<void> {
    private readonly _labelMapNameTitle             : UiLabel;
    private readonly _labelMapName                  : UiLabel;

    private readonly _labelSaveSlotTitle            : UiLabel;
    private readonly _labelSaveSlot                 : UiLabel;
    private readonly _btnSaveSlot                   : UiButton;

    private readonly _labelSlotCommentTitle         : UiLabel;
    private readonly _inputSlotComment              : UiTextInput;

    private readonly _labelWarRuleTitle             : UiLabel;
    private readonly _labelWarRule                  : UiLabel;
    private readonly _btnWarRule                    : UiButton;

    private readonly _labelHasFogTitle              : UiLabel;
    private readonly _labelHasFog                   : UiLabel;
    private readonly _btnHasFog                     : UiButton;
    private readonly _btnHasFogHelp                 : UiButton;

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
            { type: NotifyType.LanguageChanged,                callback: this._onNotifyLanguageChanged },
            { type: NotifyType.ScrCreateWarSaveSlotChanged,    callback: this._onNotifyScrCreateWarSaveSlotChanged },
        ]);
        this.left                       = 0;
        this.right                      = 0;
        this.top                        = 0;
        this.bottom                     = 0;
        this._inputSlotComment.maxChars = CommonConstants.SpmSaveSlotCommentMaxLength;

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
            CommonConfirmPanel.show({
                content : Lang.getText(LangTextType.A0129),
                callback: () => {
                    ScrModel.Create.setCustomWarRuleId();
                    callback();
                },
            });
        }
    }

    private _onTouchedBtnHasFogHelp(e: egret.TouchEvent): void {
        CommonHelpPanel.show({
            title  : Lang.getText(LangTextType.B0020),
            content: Lang.getText(LangTextType.R0002),
        });
    }

    private _onTouchedBtnSaveSlot(e: egret.TouchEvent): void {
        ScrCreateSaveSlotsPanel.show();
    }

    ////////////////////////////////////////////////////////////////////////////////
    // View functions.
    ////////////////////////////////////////////////////////////////////////////////
    private _updateComponentsForLanguage(): void {
        this._labelMapNameTitle.text        = Lang.getText(LangTextType.B0225);
        this._labelSaveSlotTitle.text       = Lang.getText(LangTextType.B0606);
        this._labelSlotCommentTitle.text    = Lang.getText(LangTextType.B0605);
        this._labelWarRuleTitle.text        = Lang.getText(LangTextType.B0318);
        this._labelHasFogTitle.text         = Lang.getText(LangTextType.B0020);
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
        this._labelHasFog.text = Lang.getText(ScrModel.Create.getHasFog() ? LangTextType.B0012 : LangTextType.B0013);
    }
}
