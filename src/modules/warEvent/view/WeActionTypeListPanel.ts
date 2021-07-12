
import { UiListItemRenderer }           from "../../../utility/ui/UiListItemRenderer";
import { UiPanel }                      from "../../../utility/ui/UiPanel";
import { UiButton }                     from "../../../utility/ui/UiButton";
import { UiLabel }                      from "../../../utility/ui/UiLabel";
import { UiScrollList }                 from "../../../utility/ui/UiScrollList";
import { BwWar }                        from "../../baseWar/model/BwWar";
import { Lang }                         from "../../../utility/lang/Lang";
import { TwnsLangTextType } from "../../../utility/lang/LangTextType";
import { Notify }                       from "../../../utility/notify/Notify";
import { TwnsNotifyType } from "../../../utility/notify/NotifyType";
import NotifyType       = TwnsNotifyType.NotifyType;
import { ProtoTypes }                   from "../../../utility/proto/ProtoTypes";
import { Types }                        from "../../../utility/Types";
import * as WarEventHelper              from "../model/WarEventHelper";
import IWarEventFullData                = ProtoTypes.Map.IWarEventFullData;
import IWarEventAction                  = ProtoTypes.WarEvent.IWarEventAction;
import ActionType                       = Types.WarEventActionType;
import LangTextType         = TwnsLangTextType.LangTextType;

type OpenDataForWeActionTypeListPanel = {
    war         : BwWar;
    fullData    : IWarEventFullData;
    action      : IWarEventAction;
};
export class WeActionTypeListPanel extends UiPanel<OpenDataForWeActionTypeListPanel> {
    protected readonly _LAYER_TYPE   = Types.LayerType.Hud1;
    protected readonly _IS_EXCLUSIVE = false;

    private static _instance: WeActionTypeListPanel;

    private _labelTitle : UiLabel;
    private _btnClose   : UiButton;
    private _listType   : UiScrollList<DataForTypeRenderer>;

    public static show(openData: OpenDataForWeActionTypeListPanel): void {
        if (!WeActionTypeListPanel._instance) {
            WeActionTypeListPanel._instance = new WeActionTypeListPanel();
        }
        WeActionTypeListPanel._instance.open(openData);
    }

    public static async hide(): Promise<void> {
        if (WeActionTypeListPanel._instance) {
            await WeActionTypeListPanel._instance.close();
        }
    }

    private constructor() {
        super();

        this._setIsTouchMaskEnabled(true);
        this._setIsCloseOnTouchedMask();
        this.skinName = "resource/skins/warEvent/WeActionTypeListPanel.exml";
    }

    protected _onOpened(): void {
        this._setNotifyListenerArray([
            { type: NotifyType.LanguageChanged,    callback: this._onNotifyLanguageChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._btnClose,       callback: this.close },
        ]);
        this._listType.setItemRenderer(TypeRenderer);

        this._updateView();
    }

    private _onNotifyLanguageChanged(e: egret.Event): void {
        this._updateComponentsForLanguage();
    }

    private _updateView(): void {
        this._updateComponentsForLanguage();

        this._updateListType();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.text       = Lang.getText(LangTextType.B0516);
        this._btnClose.label        = Lang.getText(LangTextType.B0146);
    }
    private _updateListType(): void {
        const openData  = this._getOpenData();
        const action    = openData.action;
        const fullData  = openData.fullData;
        const war       = openData.war;

        const dataArray: DataForTypeRenderer[] = [];
        for (const newActionType of WarEventHelper.getActionTypeArray()) {
            dataArray.push({
                war,
                fullData,
                newActionType,
                action,
            });
        }
        this._listType.bindData(dataArray);
    }
}

type DataForTypeRenderer = {
    war             : BwWar;
    fullData        : ProtoTypes.Map.IWarEventFullData;
    newActionType   : ActionType;
    action          : IWarEventAction;
};
class TypeRenderer extends UiListItemRenderer<DataForTypeRenderer> {
    private _labelType  : UiLabel;
    private _labelUsing : UiLabel;
    private _labelSwitch: UiLabel;

    protected _onOpened(): void {
        this._setUiListenerArray([
            { ui: this, callback: this._onTouchedSelf },
        ]);
        this._setNotifyListenerArray([
            { type: NotifyType.LanguageChanged,    callback: this._onNotifyLanguageChanged },
        ]);

        this._updateComponentsForLanguage();
    }

    protected async _onDataChanged(): Promise<void> {
        this._updateLabelType();
        this._updateLabelUsingAndSwitch();
    }

    private _onTouchedSelf(e: egret.TouchEvent): void {
        const data = this.data;
        if (data == null) {
            return;
        }

        const actionType    = data.newActionType;
        const action        = data.action;
        if (actionType !== WarEventHelper.getActionType(action)) {
            WarEventHelper.resetAction(action, actionType);
            WarEventHelper.openActionModifyPanel(data.war, data.fullData, action);
            WeActionTypeListPanel.hide();

            Notify.dispatch(NotifyType.WarEventFullDataChanged);
        }
    }
    private _onNotifyLanguageChanged(e: egret.Event): void {        // DONE
        this._updateComponentsForLanguage();
    }

    private _updateComponentsForLanguage(): void {
        this._labelUsing.text   = Lang.getText(LangTextType.B0503);
        this._labelSwitch.text  = Lang.getText(LangTextType.B0520);

        this._updateLabelType();
    }

    private _updateLabelType(): void {
        const data  = this.data;
        const label = this._labelType;
        if (data == null) {
            label.text = undefined;
        } else {
            label.text = Lang.getWarEventActionTypeName(data.newActionType);
        }
    }
    private _updateLabelUsingAndSwitch(): void {
        const data          = this.data;
        const labelUsing    = this._labelUsing;
        const labelSwitch   = this._labelSwitch;
        if (data == null) {
            labelUsing.visible  = false;
            labelSwitch.visible = false;
        } else {
            const isUsing       = WarEventHelper.getActionType(data.action) === data.newActionType;
            labelUsing.visible  = isUsing;
            labelSwitch.visible = !isUsing;
        }
    }
}
