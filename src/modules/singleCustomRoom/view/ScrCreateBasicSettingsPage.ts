
import { TwnsUiButton }                      from "../../../utility/ui/UiButton";
import { TwnsUiLabel }                      from "../../../utility/ui/UiLabel";
import { TwnsUiTextInput }                  from "../../../utility/ui/UiTextInput";
import { TwnsUiTabPage }                    from "../../../utility/ui/UiTabPage";
import { CommonConfirmPanel }           from "../../common/view/CommonConfirmPanel";
import { CommonHelpPanel }              from "../../common/view/CommonHelpPanel";
import { ScrCreateSaveSlotsPanel }      from "./ScrCreateSaveSlotsPanel";
import { CommonConstants }              from "../../../utility/CommonConstants";
import { Lang }                         from "../../../utility/lang/Lang";
import { TwnsLangTextType } from "../../../utility/lang/LangTextType";
import LangTextType         = TwnsLangTextType.LangTextType;
import { Notify }                       from "../../../utility/notify/Notify";
import { TwnsNotifyType } from "../../../utility/notify/NotifyType";
import NotifyType       = TwnsNotifyType.NotifyType;
import { ProtoTypes }                   from "../../../utility/proto/ProtoTypes";
import { WarMapModel }                  from "../../warMap/model/WarMapModel";
import { ScrCreateModel }                     from "../model/ScrCreateModel";

export class ScrCreateBasicSettingsPage extends TwnsUiTabPage.UiTabPage<void> {
    private readonly _labelMapNameTitle             : TwnsUiLabel.UiLabel;
    private readonly _labelMapName                  : TwnsUiLabel.UiLabel;

    private readonly _labelSaveSlotTitle            : TwnsUiLabel.UiLabel;
    private readonly _labelSaveSlot                 : TwnsUiLabel.UiLabel;
    private readonly _btnSaveSlot                   : TwnsUiButton.UiButton;

    private readonly _labelSlotCommentTitle         : TwnsUiLabel.UiLabel;
    private readonly _inputSlotComment              : TwnsUiTextInput.UiTextInput;

    private readonly _labelWarRuleTitle             : TwnsUiLabel.UiLabel;
    private readonly _labelWarRule                  : TwnsUiLabel.UiLabel;
    private readonly _btnWarRule                    : TwnsUiButton.UiButton;

    private readonly _labelHasFogTitle              : TwnsUiLabel.UiLabel;
    private readonly _labelHasFog                   : TwnsUiLabel.UiLabel;
    private readonly _btnHasFog                     : TwnsUiButton.UiButton;
    private readonly _btnHasFogHelp                 : TwnsUiButton.UiButton;

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

        this._mapRawData = await ScrCreateModel.getMapRawData();

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
        ScrCreateModel.setSlotComment(this._inputSlotComment.text || undefined);
        this._updateInputSlotComment();
    }

    private async _onTouchedBtnWarRule(e: egret.TouchEvent): Promise<void> {
        await ScrCreateModel.tickPresetWarRuleId();
        this._updateComponentsForWarRule();
    }

    private _onTouchedBtnHasFog(e: egret.TouchEvent): void {
        const callback = () => {
            ScrCreateModel.setHasFog(!ScrCreateModel.getHasFog());
            this._updateLabelHasFog();
            this._updateLabelWarRule();
        };
        if (ScrCreateModel.getPresetWarRuleId() == null) {
            callback();
        } else {
            CommonConfirmPanel.show({
                content : Lang.getText(LangTextType.A0129),
                callback: () => {
                    ScrCreateModel.setCustomWarRuleId();
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
        this._inputSlotComment.text = ScrCreateModel.getSlotComment();
    }

    private async _updateLabelMapName(): Promise<void> {
        this._labelMapName.text = await WarMapModel.getMapNameInCurrentLanguage(this._mapRawData.mapId);
    }

    private _updateLabelSaveSlot(): void {
        this._labelSaveSlot.text = `${ScrCreateModel.getSaveSlotIndex()}`;
    }

    private _updateLabelWarRule(): void {
        const label             = this._labelWarRule;
        const settingsForCommon = ScrCreateModel.getData().settingsForCommon;
        label.text              = Lang.getWarRuleNameInLanguage(settingsForCommon.warRule);
        label.textColor         = settingsForCommon.presetWarRuleId == null ? 0xFFFF00 : 0xFFFFFF;
    }

    private _updateLabelHasFog(): void {
        this._labelHasFog.text = Lang.getText(ScrCreateModel.getHasFog() ? LangTextType.B0012 : LangTextType.B0013);
    }
}
