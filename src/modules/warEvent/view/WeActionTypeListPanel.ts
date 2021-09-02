
import TwnsBwWar                from "../../baseWar/model/BwWar";
import CommonConstants          from "../../tools/helpers/CommonConstants";
import Types                    from "../../tools/helpers/Types";
import Lang                     from "../../tools/lang/Lang";
import TwnsLangTextType         from "../../tools/lang/LangTextType";
import Notify                   from "../../tools/notify/Notify";
import TwnsNotifyType           from "../../tools/notify/NotifyType";
import ProtoTypes               from "../../tools/proto/ProtoTypes";
import TwnsUiButton             from "../../tools/ui/UiButton";
import TwnsUiLabel              from "../../tools/ui/UiLabel";
import TwnsUiListItemRenderer   from "../../tools/ui/UiListItemRenderer";
import TwnsUiPanel              from "../../tools/ui/UiPanel";
import TwnsUiScrollList         from "../../tools/ui/UiScrollList";
import WarEventHelper           from "../model/WarEventHelper";

namespace TwnsWeActionTypeListPanel {
    import NotifyType           = TwnsNotifyType.NotifyType;
    import IWarEventFullData    = ProtoTypes.Map.IWarEventFullData;
    import IWarEventAction      = ProtoTypes.WarEvent.IWarEventAction;
    import ActionType           = Types.WarEventActionType;
    import LangTextType         = TwnsLangTextType.LangTextType;
    import BwWar                = TwnsBwWar.BwWar;

    type OpenDataForWeActionTypeListPanel = {
        war         : BwWar;
        fullData    : IWarEventFullData;
        action      : IWarEventAction;
    };
    export class WeActionTypeListPanel extends TwnsUiPanel.UiPanel<OpenDataForWeActionTypeListPanel> {
        protected readonly _LAYER_TYPE   = Types.LayerType.Hud1;
        protected readonly _IS_EXCLUSIVE = false;

        private static _instance: WeActionTypeListPanel;

        private readonly _labelTitle!   : TwnsUiLabel.UiLabel;
        private readonly _btnClose!     : TwnsUiButton.UiButton;
        private readonly _listType!     : TwnsUiScrollList.UiScrollList<DataForTypeRenderer>;

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
                label.text = Lang.getWarEventActionTypeName(data.newActionType) || CommonConstants.ErrorTextForUndefined;
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
}

export default TwnsWeActionTypeListPanel;
