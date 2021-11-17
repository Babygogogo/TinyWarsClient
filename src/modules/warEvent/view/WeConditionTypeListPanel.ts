
// import CommonConstants          from "../../tools/helpers/CommonConstants";
// import Types                    from "../../tools/helpers/Types";
// import Lang                     from "../../tools/lang/Lang";
// import TwnsLangTextType         from "../../tools/lang/LangTextType";
// import Notify                   from "../../tools/notify/Notify";
// import TwnsNotifyType           from "../../tools/notify/NotifyType";
// import ProtoTypes               from "../../tools/proto/ProtoTypes";
// import TwnsUiButton             from "../../tools/ui/UiButton";
// import TwnsUiLabel              from "../../tools/ui/UiLabel";
// import TwnsUiListItemRenderer   from "../../tools/ui/UiListItemRenderer";
// import TwnsUiPanel              from "../../tools/ui/UiPanel";
// import TwnsUiScrollList         from "../../tools/ui/UiScrollList";
// import WarEventHelper           from "../model/WarEventHelper";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace TwnsWeConditionTypeListPanel {
    import NotifyType           = TwnsNotifyType.NotifyType;
    import IWarEventFullData    = ProtoTypes.Map.IWarEventFullData;
    import IWarEventCondition   = ProtoTypes.WarEvent.IWarEventCondition;
    import ConditionType        = Types.WarEventConditionType;
    import LangTextType         = TwnsLangTextType.LangTextType;

    export type OpenData = {
        war         : TwnsBwWar.BwWar;
        fullData    : IWarEventFullData;
        condition   : IWarEventCondition;
    };
    export class WeConditionTypeListPanel extends TwnsUiPanel2.UiPanel2<OpenData> {
        private readonly _labelTitle!   : TwnsUiLabel.UiLabel;
        private readonly _btnClose!     : TwnsUiButton.UiButton;
        private readonly _listType!     : TwnsUiScrollList.UiScrollList<DataForTypeRenderer>;

        protected _onOpening(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,    callback: this._onNotifyLanguageChanged },
            ]);
            this._setUiListenerArray([
                { ui: this._btnClose,       callback: this.close },
            ]);
            this._setIsTouchMaskEnabled(true);
            this._setIsCloseOnTouchedMask();

            this._listType.setItemRenderer(TypeRenderer);
        }
        protected async _updateOnOpenDataChanged(): Promise<void> {
            this._updateView();
        }
        protected _onClosing(): void {
            // nothing to do
        }

        private _onNotifyLanguageChanged(): void {
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
            const war       = openData.war;
            const dataArray: DataForTypeRenderer[] = [];
            for (const newConditionType of WarEventHelper.getConditionTypeArray()) {
                dataArray.push({
                    war,
                    fullData,
                    newConditionType,
                    condition,
                });
            }
            this._listType.bindData(dataArray);
        }
    }

    type DataForTypeRenderer = {
        war             : TwnsBwWar.BwWar;
        fullData        : ProtoTypes.Map.IWarEventFullData;
        newConditionType: ConditionType;
        condition       : IWarEventCondition;
    };
    class TypeRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForTypeRenderer> {
        private readonly _labelType!    : TwnsUiLabel.UiLabel;
        private readonly _labelUsing!   : TwnsUiLabel.UiLabel;
        private readonly _labelSwitch!  : TwnsUiLabel.UiLabel;

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

        private _onTouchedSelf(): void {
            const data          = this._getData();
            const conditionType = data.newConditionType;
            const condition     = data.condition;
            if (conditionType !== WarEventHelper.getConditionType(condition)) {
                WarEventHelper.resetCondition(condition, conditionType);
                WarEventHelper.openConditionModifyPanel({ fullData: data.fullData, condition, war: data.war });
                TwnsPanelManager.close(TwnsPanelConfig.Dict.WeConditionTypeListPanel);

                Notify.dispatch(NotifyType.WarEventFullDataChanged);
            }
        }
        private _onNotifyLanguageChanged(): void {        // DONE
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
                label.text = ``;
            } else {
                label.text = Lang.getWarEventConditionTypeName(data.newConditionType) || CommonConstants.ErrorTextForUndefined;
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
}

// export default TwnsWeConditionTypeListPanel;
