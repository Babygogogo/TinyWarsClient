
import CommonConstants          from "../../tools/helpers/CommonConstants";
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

namespace TwnsWeConditionReplacePanel {
    import LangTextType         = TwnsLangTextType.LangTextType;
    import NotifyType           = TwnsNotifyType.NotifyType;
    import IWarEventFullData    = ProtoTypes.Map.IWarEventFullData;

    type OpenDataForWeConditionReplacePanel = {
        fullData        : IWarEventFullData;
        parentNodeId    : number;
        conditionId     : number;
    };
    export class WeConditionReplacePanel extends TwnsUiPanel.UiPanel<OpenDataForWeConditionReplacePanel> {
        protected readonly _LAYER_TYPE   = Types.LayerType.Hud1;
        protected readonly _IS_EXCLUSIVE = false;

        private static _instance: WeConditionReplacePanel;

        private readonly _listCondition!    : TwnsUiScrollList.UiScrollList<DataForConditionRenderer>;
        private readonly _labelTitle!       : TwnsUiLabel.UiLabel;
        private readonly _labelNoCondition! : TwnsUiLabel.UiLabel;
        private readonly _btnClose!         : TwnsUiButton.UiButton;

        public static show(openData: OpenDataForWeConditionReplacePanel): void {
            if (!WeConditionReplacePanel._instance) {
                WeConditionReplacePanel._instance = new WeConditionReplacePanel();
            }
            WeConditionReplacePanel._instance.open(openData);
        }

        public static async hide(): Promise<void> {
            if (WeConditionReplacePanel._instance) {
                await WeConditionReplacePanel._instance.close();
            }
        }

        private constructor() {
            super();

            this._setIsTouchMaskEnabled(true);
            this._setIsCloseOnTouchedMask();
            this.skinName = "resource/skins/warEvent/WeConditionReplacePanel.exml";
        }

        protected _onOpened(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,    callback: this._onNotifyLanguageChanged },
            ]);
            this._setUiListenerArray([
                { ui: this._btnClose,       callback: this.close },
            ]);
            this._listCondition.setItemRenderer(ConditionRenderer);

            this._updateView();
        }

        private _onNotifyLanguageChanged(): void {
            this._updateComponentsForLanguage();
        }

        private _updateView(): void {
            this._updateComponentsForLanguage();

            this._updateListConditionAndLabelNoCondition();
        }

        private _updateComponentsForLanguage(): void {
            const openData              = this._getOpenData();
            this._labelTitle.text       = `${Lang.getText(LangTextType.B0500)} C${openData.conditionId}`;
            this._labelNoCondition.text = Lang.getText(LangTextType.B0278);
            this._btnClose.label        = Lang.getText(LangTextType.B0146);
        }
        private _updateListConditionAndLabelNoCondition(): void {
            const openData          = this._getOpenData();
            const parentNodeId      = openData.parentNodeId;
            const srcConditionId    = openData.conditionId;
            const fullData          = openData.fullData;

            const dataArray: DataForConditionRenderer[] = [];
            for (const condition of openData.fullData.conditionArray || []) {
                dataArray.push({
                    parentNodeId,
                    srcConditionId,
                    candidateConditionId : Helpers.getExisted(condition.WecCommonData?.conditionId),
                    fullData,
                });
            }

            this._labelNoCondition.visible = !dataArray.length;
            this._listCondition.bindData(dataArray);
        }
    }

    type DataForConditionRenderer = {
        parentNodeId        : number;
        srcConditionId      : number;
        candidateConditionId: number;
        fullData            : IWarEventFullData;
    };
    class ConditionRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForConditionRenderer> {
        private readonly _labelConditionId! : TwnsUiLabel.UiLabel;
        private readonly _labelCondition!   : TwnsUiLabel.UiLabel;
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
            this._updateLabelConditionId();
            this._updateLabelCondition();
            this._updateBtnSelect();
        }

        private _onTouchedBtnCopy(): void {          // DONE
            const data = this._getData();
            if (WarEventHelper.cloneAndReplaceConditionInParentNode({
                fullData                : data.fullData,
                parentNodeId            : data.parentNodeId,
                conditionIdForDelete    : data.srcConditionId,
                conditionIdForClone     : data.candidateConditionId,
            }) != null) {
                Notify.dispatch(NotifyType.WarEventFullDataChanged);
                WeConditionReplacePanel.hide();
            }
        }
        private _onTouchedBtnSelect(): void {        // DONE
            const data = this._getData();
            if (WarEventHelper.replaceConditionInParentNode({
                fullData        : data.fullData,
                parentNodeId    : data.parentNodeId,
                oldConditionId  : data.srcConditionId,
                newConditionId  : data.candidateConditionId,
            })) {
                Notify.dispatch(NotifyType.WarEventFullDataChanged);
                WeConditionReplacePanel.hide();
            }
        }
        private _onNotifyLanguageChanged(): void {        // DONE
            this._updateComponentsForLanguage();
        }

        private _updateComponentsForLanguage(): void {
            this._btnCopy.label     = Lang.getText(LangTextType.B0487);
            this._btnSelect.label   = Lang.getText(LangTextType.B0492);

            this._updateLabelConditionId();
            this._updateLabelCondition();
        }

        private _updateLabelConditionId(): void {
            const data                  = this._getData();
            this._labelConditionId.text = `${Lang.getText(LangTextType.B0502)}: C${data.candidateConditionId}`;
        }
        private _updateLabelCondition(): void {
            const data      = this._getData();
            const condition = (data.fullData.conditionArray || []).find(v => v.WecCommonData?.conditionId === data.candidateConditionId);
            const label     = this._labelCondition;
            if (condition == null) {
                label.text = Lang.getText(LangTextType.A0160);
            } else {
                label.text = WarEventHelper.getDescForCondition(condition) || CommonConstants.ErrorTextForUndefined;
            }
        }
        private _updateBtnSelect(): void {
            const data              = this._getData();
            this._btnSelect.visible = data.srcConditionId !== data.candidateConditionId;
        }
    }
}

export default TwnsWeConditionReplacePanel;
