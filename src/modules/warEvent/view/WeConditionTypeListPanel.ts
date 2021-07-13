
import TwnsUiListItemRenderer           from "../../../utility/ui/UiListItemRenderer";
import TwnsUiPanel                      from "../../../utility/ui/UiPanel";
import TwnsUiButton                      from "../../../utility/ui/UiButton";
import TwnsUiLabel                      from "../../../utility/ui/UiLabel";
import TwnsUiScrollList                 from "../../../utility/ui/UiScrollList";
import { Lang }                         from "../../../utility/lang/Lang";
import { TwnsLangTextType } from "../../../utility/lang/LangTextType";
import { Notify }                       from "../../../utility/notify/Notify";
import { TwnsNotifyType } from "../../../utility/notify/NotifyType";
import NotifyType       = TwnsNotifyType.NotifyType;
import { ProtoTypes }                   from "../../../utility/proto/ProtoTypes";
import { Types }                        from "../../../utility/Types";
import * as WarEventHelper              from "../model/WarEventHelper";
import IWarEventFullData                = ProtoTypes.Map.IWarEventFullData;
import IWarEventCondition               = ProtoTypes.WarEvent.IWarEventCondition;
import ConditionType                    = Types.WarEventConditionType;
import LangTextType         = TwnsLangTextType.LangTextType;

type OpenDataForWeConditionTypeListPanel = {
    fullData    : IWarEventFullData;
    condition   : IWarEventCondition;
};
export class WeConditionTypeListPanel extends TwnsUiPanel.UiPanel<OpenDataForWeConditionTypeListPanel> {
    protected readonly _LAYER_TYPE   = Types.LayerType.Hud1;
    protected readonly _IS_EXCLUSIVE = false;

    private static _instance: WeConditionTypeListPanel;

    private _labelTitle : TwnsUiLabel.UiLabel;
    private _btnClose   : TwnsUiButton.UiButton;
    private _listType   : TwnsUiScrollList.UiScrollList<DataForTypeRenderer>;

    public static show(openData: OpenDataForWeConditionTypeListPanel): void {
        if (!WeConditionTypeListPanel._instance) {
            WeConditionTypeListPanel._instance = new WeConditionTypeListPanel();
        }
        WeConditionTypeListPanel._instance.open(openData);
    }

    public static async hide(): Promise<void> {
        if (WeConditionTypeListPanel._instance) {
            await WeConditionTypeListPanel._instance.close();
        }
    }

    private constructor() {
        super();

        this._setIsTouchMaskEnabled(true);
        this._setIsCloseOnTouchedMask();
        this.skinName = "resource/skins/warEvent/WeConditionTypeListPanel.exml";
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
        const condition = openData.condition;
        const fullData  = openData.fullData;

        const dataArray: DataForTypeRenderer[] = [];
        for (const newConditionType of WarEventHelper.getConditionTypeArray()) {
            dataArray.push({
                fullData,
                newConditionType,
                condition,
            });
        }
        this._listType.bindData(dataArray);
    }
}

type DataForTypeRenderer = {
    fullData        : ProtoTypes.Map.IWarEventFullData;
    newConditionType: ConditionType;
    condition       : IWarEventCondition;
};
class TypeRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForTypeRenderer> {
    private _labelType  : TwnsUiLabel.UiLabel;
    private _labelUsing : TwnsUiLabel.UiLabel;
    private _labelSwitch: TwnsUiLabel.UiLabel;

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

        const conditionType = data.newConditionType;
        const condition     = data.condition;
        if (conditionType !== WarEventHelper.getConditionType(condition)) {
            WarEventHelper.resetCondition(condition, conditionType);
            WarEventHelper.openConditionModifyPanel(data.fullData, condition);
            WeConditionTypeListPanel.hide();

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
            label.text = Lang.getWarEventConditionTypeName(data.newConditionType);
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
            const isUsing       = WarEventHelper.getConditionType(data.condition) === data.newConditionType;
            labelUsing.visible  = isUsing;
            labelSwitch.visible = !isUsing;
        }
    }
}
