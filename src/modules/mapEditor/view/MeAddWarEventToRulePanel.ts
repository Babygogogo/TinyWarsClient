
import { UiListItemRenderer }           from "../../../utility/ui/UiListItemRenderer";
import { UiPanel }                      from "../../../utility/ui/UiPanel";
import { UiButton }                     from "../../../utility/ui/UiButton";
import { UiLabel }                      from "../../../utility/ui/UiLabel";
import { UiScrollList }                 from "../../../utility/ui/UiScrollList";
import { Lang }                         from "../../../utility/lang/Lang";
import { TwnsLangTextType } from "../../../utility/lang/LangTextType";
import LangTextType         = TwnsLangTextType.LangTextType;
import { Notify }                       from "../../../utility/notify/Notify";
import { TwnsNotifyType } from "../../../utility/notify/NotifyType";
import NotifyType       = TwnsNotifyType.NotifyType;
import { ProtoTypes }                   from "../../../utility/proto/ProtoTypes";
import { Types }                        from "../../../utility/Types";
import { BwWarRuleHelpers }              from "../../baseWar/model/BwWarRuleHelpers";
import { MeModel }                      from "../model/MeModel";

type OpenDataForMeAddWarEventId = {
    warRule     : ProtoTypes.WarRule.IWarRule;
};
export class MeAddWarEventToRulePanel extends UiPanel<OpenDataForMeAddWarEventId>{
    protected readonly _LAYER_TYPE   = Types.LayerType.Hud1;
    protected readonly _IS_EXCLUSIVE = false;

    private static _instance: MeAddWarEventToRulePanel;

    private _listWarEvent   : UiScrollList<DataForWarEventRenderer>;
    private _labelTitle     : UiLabel;
    private _labelNoWarEvent: UiLabel;
    private _btnClose       : UiButton;

    public static show(openData: OpenDataForMeAddWarEventId): void {
        if (!MeAddWarEventToRulePanel._instance) {
            MeAddWarEventToRulePanel._instance = new MeAddWarEventToRulePanel();
        }
        MeAddWarEventToRulePanel._instance.open(openData);
    }

    public static async hide(): Promise<void> {
        if (MeAddWarEventToRulePanel._instance) {
            await MeAddWarEventToRulePanel._instance.close();
        }
    }

    private constructor() {
        super();

        this._setIsTouchMaskEnabled(true);
        this._setIsCloseOnTouchedMask();
        this.skinName = "resource/skins/mapEditor/MeAddWarEventToRulePanel.exml";
    }

    protected _onOpened(): void {
        this._setNotifyListenerArray([
            { type: NotifyType.LanguageChanged,    callback: this._onNotifyLanguageChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._btnClose,       callback: this.close },
        ]);
        this._listWarEvent.setItemRenderer(WarEventRenderer);

        this._updateView();
    }

    private _onNotifyLanguageChanged(e: egret.Event): void {
        this._updateComponentsForLanguage();
    }

    private _updateView(): void {
        this._updateComponentsForLanguage();
        this._updateListMessageAndLabelNoMessage();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.text       = Lang.getText(LangTextType.B0468);
        this._labelNoWarEvent.text  = Lang.getText(LangTextType.B0278);
        this._btnClose.label        = Lang.getText(LangTextType.B0146);
    }
    private _updateListMessageAndLabelNoMessage(): void {
        const dataArray : DataForWarEventRenderer[] = [];
        const warRule   = this._getOpenData().warRule;
        for (const warEvent of MeModel.getWar().getWarEventManager().getWarEventFullData().eventArray || []) {
            dataArray.push({
                warEventId  : warEvent.eventId,
                warRule,
            });
        }

        this._labelNoWarEvent.visible = !dataArray.length;
        this._listWarEvent.bindData(dataArray.sort((v1, v2) => v1.warEventId - v2.warEventId));
    }
}

type DataForWarEventRenderer = {
    warEventId  : number;
    warRule     : ProtoTypes.WarRule.IWarRule;
};
class WarEventRenderer extends UiListItemRenderer<DataForWarEventRenderer> {
    private _labelId    : UiLabel;
    private _btnDelete  : UiButton;
    private _labelName  : UiLabel;
    private _btnAdd     : UiButton;

    protected _onOpened(): void {
        this._setUiListenerArray([
            { ui: this._btnAdd,     callback: this._onTouchedBtnAdd },
            { ui: this._btnDelete,  callback: this._onTouchedBtnDelete },
        ]);
        this._setNotifyListenerArray([
            { type: NotifyType.LanguageChanged,            callback: this._onNotifyLanguageChanged },
            { type: NotifyType.MeWarEventIdArrayChanged,   callback: this._onNotifyMeWarEventIdArrayChanged },
        ]);
        this._updateComponentsForLanguage();
        this._btnDelete.setTextColor(0xFF0000);
    }

    private _onNotifyLanguageChanged(e: egret.Event): void {
        this._updateComponentsForLanguage();
    }
    private _onNotifyMeWarEventIdArrayChanged(e: egret.Event): void {
        this._updateBtnAddAndBtnDelete();
    }
    private _onTouchedBtnAdd(e: egret.TouchEvent): void {
        const data = this.data;
        if (data) {
            BwWarRuleHelpers.addWarEventId(data.warRule, data.warEventId);
            Notify.dispatch(NotifyType.MeWarEventIdArrayChanged);
        }
    }
    private _onTouchedBtnDelete(e: egret.TouchEvent): void {
        const data = this.data;
        if (data) {
            BwWarRuleHelpers.deleteWarEventId(data.warRule, data.warEventId);
            Notify.dispatch(NotifyType.MeWarEventIdArrayChanged);
        }
    }

    protected async _onDataChanged(): Promise<void> {
        const data          = this.data;
        this._labelId.text  = `#${data.warEventId}`;
        this._updateLabelName();
        this._updateBtnAddAndBtnDelete();
    }

    private _updateComponentsForLanguage(): void {
        this._btnDelete.label   = Lang.getText(LangTextType.B0220);
        this._btnAdd.label      = Lang.getText(LangTextType.B0467);

        this._updateLabelName();
    }

    private _updateLabelName(): void {
        const data              = this.data;
        this._labelName.text    = data
            ? Lang.getLanguageText({ textArray: MeModel.getWar().getWarEventManager().getWarEvent(data.warEventId).eventNameArray })
            : undefined;
    }

    private _updateBtnAddAndBtnDelete(): void {
        const data = this.data;
        if (data) {
            const isAdded               = (data.warRule.warEventIdArray || []).indexOf(data.warEventId) >= 0;
            this._btnAdd.visible        = !isAdded;
            this._btnDelete.visible     = isAdded;
        }
    }
}
