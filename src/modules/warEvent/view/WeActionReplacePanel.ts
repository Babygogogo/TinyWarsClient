
import { TwnsUiListItemRenderer }           from "../../../utility/ui/UiListItemRenderer";
import { TwnsUiPanel }                      from "../../../utility/ui/UiPanel";
import { TwnsUiButton }                      from "../../../utility/ui/UiButton";
import { TwnsUiLabel }                      from "../../../utility/ui/UiLabel";
import { TwnsUiScrollList }                 from "../../../utility/ui/UiScrollList";
import { Lang }                         from "../../../utility/lang/Lang";
import { TwnsLangTextType } from "../../../utility/lang/LangTextType";
import LangTextType         = TwnsLangTextType.LangTextType;
import { Notify }                       from "../../../utility/notify/Notify";
import { TwnsNotifyType } from "../../../utility/notify/NotifyType";
import NotifyType       = TwnsNotifyType.NotifyType;
import { ProtoTypes }                   from "../../../utility/proto/ProtoTypes";
import { Types }                        from "../../../utility/Types";
import * as WarEventHelper              from "../model/WarEventHelper";
import IWarEventFullData                = ProtoTypes.Map.IWarEventFullData;

type OpenDataForWeActionReplacePanel = {
    fullData    : IWarEventFullData;
    eventId     : number;
    actionId    : number;
};
export class WeActionReplacePanel extends TwnsUiPanel.UiPanel<OpenDataForWeActionReplacePanel> {
    protected readonly _LAYER_TYPE   = Types.LayerType.Hud1;
    protected readonly _IS_EXCLUSIVE = false;

    private static _instance: WeActionReplacePanel;

    private _listAction     : TwnsUiScrollList.UiScrollList<DataForActionRenderer>;
    private _labelTitle     : TwnsUiLabel.UiLabel;
    private _labelNoAction  : TwnsUiLabel.UiLabel;
    private _btnClose       : TwnsUiButton.UiButton;

    public static show(openData: OpenDataForWeActionReplacePanel): void {
        if (!WeActionReplacePanel._instance) {
            WeActionReplacePanel._instance = new WeActionReplacePanel();
        }
        WeActionReplacePanel._instance.open(openData);
    }

    public static async hide(): Promise<void> {
        if (WeActionReplacePanel._instance) {
            await WeActionReplacePanel._instance.close();
        }
    }

    private constructor() {
        super();

        this._setIsTouchMaskEnabled(true);
        this._setIsCloseOnTouchedMask();
        this.skinName = "resource/skins/warEvent/WeActionReplacePanel.exml";
    }

    protected _onOpened(): void {
        this._setNotifyListenerArray([
            { type: NotifyType.LanguageChanged,    callback: this._onNotifyLanguageChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._btnClose,       callback: this.close },
        ]);
        this._listAction.setItemRenderer(ActionRenderer);

        this._updateView();
    }

    private _onNotifyLanguageChanged(e: egret.Event): void {
        this._updateComponentsForLanguage();
    }

    private _updateView(): void {
        this._updateComponentsForLanguage();

        this._updateComponentsForAction();
    }

    private _updateComponentsForLanguage(): void {
        const openData              = this._getOpenData();
        this._labelTitle.text       = `${Lang.getText(LangTextType.B0615)} A${openData.actionId}`;
        this._labelNoAction.text    = Lang.getText(LangTextType.B0278);
        this._btnClose.label        = Lang.getText(LangTextType.B0146);
    }
    private _updateComponentsForAction(): void {
        const openData      = this._getOpenData();
        const eventId       = openData.eventId;
        const srcActionId   = openData.actionId;
        const fullData      = openData.fullData;

        const dataArray: DataForActionRenderer[] = [];
        for (const action of openData.fullData.actionArray || []) {
            dataArray.push({
                eventId,
                srcActionId,
                candidateActionId: action.WeaCommonData.actionId,
                fullData,
            });
        }

        this._labelNoAction.visible = !dataArray.length;
        this._listAction.bindData(dataArray);
    }
}

type DataForActionRenderer = {
    eventId             : number;
    srcActionId         : number;
    candidateActionId   : number;
    fullData            : IWarEventFullData;
};
class ActionRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForActionRenderer> {
    private _labelActionId  : TwnsUiLabel.UiLabel;
    private _labelAction    : TwnsUiLabel.UiLabel;
    private _btnCopy        : TwnsUiButton.UiButton;
    private _btnSelect      : TwnsUiButton.UiButton;

    protected _onOpened(): void {
        this._setUiListenerArray([
            { ui: this._btnCopy,    callback: this._onTouchedBtnCopy },
            { ui: this._btnSelect,  callback: this._onTouchedBtnSelect },
        ]);
        this._setNotifyListenerArray([
            { type: NotifyType.LanguageChanged,    callback: this._onNotifyLanguageChanged },
        ]);

        this._updateComponentsForLanguage();
    }

    protected _onDataChanged(): void {
        this._updateLabelActionId();
        this._updateLabelAction();
        this._updateBtnSelect();
    }

    private _onTouchedBtnCopy(e: egret.TouchEvent): void {          // DONE
        const data = this.data;
        if (data == null) {
            return;
        }

        if (WarEventHelper.cloneAndReplaceActionInEvent({
            fullData            : data.fullData,
            eventId             : data.eventId,
            actionIdForDelete   : data.srcActionId,
            actionIdForClone    : data.candidateActionId,
        }) != null) {
            Notify.dispatch(NotifyType.WarEventFullDataChanged);
            WeActionReplacePanel.hide();
        }
    }
    private _onTouchedBtnSelect(e: egret.TouchEvent): void {        // DONE
        const data = this.data;
        if (data == null) {
            return;
        }

        if (WarEventHelper.replaceActionInEvent({
            fullData    : data.fullData,
            eventId     : data.eventId,
            oldActionId : data.srcActionId,
            newActionId : data.candidateActionId,
        })) {
            Notify.dispatch(NotifyType.WarEventFullDataChanged);
            WeActionReplacePanel.hide();
        }
    }
    private _onNotifyLanguageChanged(e: egret.Event): void {        // DONE
        this._updateComponentsForLanguage();
    }

    private _updateComponentsForLanguage(): void {
        this._btnCopy.label     = Lang.getText(LangTextType.B0487);
        this._btnSelect.label   = Lang.getText(LangTextType.B0492);

        this._updateLabelActionId();
        this._updateLabelAction();
    }

    private _updateLabelActionId(): void {
        const data = this.data;
        if (data) {
            this._labelActionId.text  = `${Lang.getText(LangTextType.B0616)}: A${data.candidateActionId}`;
        }
    }
    private _updateLabelAction(): void {
        const data = this.data;
        if (data == null) {
            return;
        }

        const action    = (data.fullData.actionArray || []).find(v => v.WeaCommonData.actionId === data.candidateActionId);
        const label     = this._labelAction;
        if (action == null) {
            label.text = Lang.getText(LangTextType.A0168);
        } else {
            label.text = WarEventHelper.getDescForAction(action);
        }
    }
    private _updateBtnSelect(): void {
        const data = this.data;
        if (data) {
            this._btnSelect.visible = data.srcActionId !== data.candidateActionId;
        }
    }
}
