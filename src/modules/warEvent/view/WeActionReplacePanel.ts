
import CommonConstants          from "../../tools/helpers/CommonConstants";
import CompatibilityHelpers     from "../../tools/helpers/CompatibilityHelpers";
import Helpers                  from "../../tools/helpers/Helpers";
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

namespace TwnsWeActionReplacePanel {
    import LangTextType         = TwnsLangTextType.LangTextType;
    import NotifyType           = TwnsNotifyType.NotifyType;
    import IWarEventFullData    = ProtoTypes.Map.IWarEventFullData;

    type OpenDataForWeActionReplacePanel = {
        fullData    : IWarEventFullData;
        eventId     : number;
        actionId    : number;
    };
    export class WeActionReplacePanel extends TwnsUiPanel.UiPanel<OpenDataForWeActionReplacePanel> {
        protected readonly _LAYER_TYPE   = Types.LayerType.Hud1;
        protected readonly _IS_EXCLUSIVE = false;

        private static _instance: WeActionReplacePanel;

        private readonly _listAction!       : TwnsUiScrollList.UiScrollList<DataForActionRenderer>;
        private readonly _labelTitle!       : TwnsUiLabel.UiLabel;
        private readonly _labelNoAction!    : TwnsUiLabel.UiLabel;
        private readonly _btnClose!         : TwnsUiButton.UiButton;

        public static show(openData: OpenDataForWeActionReplacePanel): void {
            if (!WeActionReplacePanel._instance) {
                WeActionReplacePanel._instance = new WeActionReplacePanel();
            }
            WeActionReplacePanel._instance.open(openData);
        }

        public static async hide(): Promise<void> {
            if (WeActionReplacePanel._instance) {
                await WeActionReplacePanel._instance.close().catch(err => { CompatibilityHelpers.showError(err); throw err; });
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

        private _onNotifyLanguageChanged(): void {
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
                    candidateActionId: Helpers.getExisted(action.WeaCommonData?.actionId),
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
        private readonly _labelActionId!    : TwnsUiLabel.UiLabel;
        private readonly _labelAction!      : TwnsUiLabel.UiLabel;
        private readonly _btnCopy!          : TwnsUiButton.UiButton;
        private readonly _btnSelect!        : TwnsUiButton.UiButton;

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

        private _onTouchedBtnCopy(): void {          // DONE
            const data = this._getData();
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
        private _onTouchedBtnSelect(): void {        // DONE
            const data = this._getData();
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
        private _onNotifyLanguageChanged(): void {        // DONE
            this._updateComponentsForLanguage();
        }

        private _updateComponentsForLanguage(): void {
            this._btnCopy.label     = Lang.getText(LangTextType.B0487);
            this._btnSelect.label   = Lang.getText(LangTextType.B0492);

            this._updateLabelActionId();
            this._updateLabelAction();
        }

        private _updateLabelActionId(): void {
            if (this._checkHasData()) {
                const data = this._getData();
                this._labelActionId.text  = `${Lang.getText(LangTextType.B0616)}: A${data.candidateActionId}`;
            }
        }
        private _updateLabelAction(): void {
            if (!this._checkHasData()) {
                return;
            }

            const data      = this._getData();
            const action    = (data.fullData.actionArray || []).find(v => v.WeaCommonData?.actionId === data.candidateActionId);
            const label     = this._labelAction;
            if (action == null) {
                label.text = Lang.getText(LangTextType.A0168);
            } else {
                label.text = WarEventHelper.getDescForAction(action) || CommonConstants.ErrorTextForUndefined;
            }
        }
        private _updateBtnSelect(): void {
            const data              = this._getData();
            this._btnSelect.visible = data.srcActionId !== data.candidateActionId;
        }
    }
}

export default TwnsWeActionReplacePanel;
