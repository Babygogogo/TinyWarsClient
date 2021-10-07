
import CompatibilityHelpers     from "../../tools/helpers/CompatibilityHelpers";
import FloatText                from "../../tools/helpers/FloatText";
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

namespace TwnsWeNodeReplacePanel {
    import LangTextType         = TwnsLangTextType.LangTextType;
    import NotifyType           = TwnsNotifyType.NotifyType;
    import IWarEventFullData    = ProtoTypes.Map.IWarEventFullData;

    type OpenDataForWeNodeReplacePanel = {
        eventId         : number;
        parentNodeId?   : number;
        nodeId          : number | null;
        fullData        : IWarEventFullData;
    };
    export class WeNodeReplacePanel extends TwnsUiPanel.UiPanel<OpenDataForWeNodeReplacePanel> {
        protected readonly _LAYER_TYPE   = Types.LayerType.Hud1;
        protected readonly _IS_EXCLUSIVE = false;

        private static _instance: WeNodeReplacePanel;

        private readonly _listNode!     : TwnsUiScrollList.UiScrollList<DataForNodeRenderer>;
        private readonly _labelTitle!   : TwnsUiLabel.UiLabel;
        private readonly _labelNoNode!  : TwnsUiLabel.UiLabel;
        private readonly _btnClose!     : TwnsUiButton.UiButton;

        public static show(openData: OpenDataForWeNodeReplacePanel): void {
            if (!WeNodeReplacePanel._instance) {
                WeNodeReplacePanel._instance = new WeNodeReplacePanel();
            }
            WeNodeReplacePanel._instance.open(openData);
        }

        public static async hide(): Promise<void> {
            if (WeNodeReplacePanel._instance) {
                await WeNodeReplacePanel._instance.close();
            }
        }

        private constructor() {
            super();

            this._setIsTouchMaskEnabled(true);
            this._setIsCloseOnTouchedMask();
            this.skinName = "resource/skins/warEvent/WeNodeReplacePanel.exml";
        }

        protected _onOpened(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,    callback: this._onNotifyLanguageChanged },
            ]);
            this._setUiListenerArray([
                { ui: this._btnClose,       callback: this.close },
            ]);
            this._listNode.setItemRenderer(NodeRenderer);

            this._updateView();
        }

        private _onNotifyLanguageChanged(): void {
            this._updateComponentsForLanguage();
        }

        private _updateView(): void {
            this._updateComponentsForLanguage();

            this._updateListNodeAndLabelNoNode();
        }

        private _updateComponentsForLanguage(): void {
            this._labelTitle.text   = Lang.getText(LangTextType.B0491);
            this._labelNoNode.text  = Lang.getText(LangTextType.B0278);
            this._btnClose.label    = Lang.getText(LangTextType.B0146);
        }
        private _updateListNodeAndLabelNoNode(): void {
            const openData      = this._getOpenData();
            const eventId       = openData.eventId;
            const parentNodeId  = openData.parentNodeId;
            const srcNodeId     = openData.nodeId ?? null;
            const fullData      = openData.fullData;

            const dataArray: DataForNodeRenderer[] = [];
            for (const node of openData.fullData.conditionNodeArray || []) {
                dataArray.push({
                    eventId,
                    parentNodeId,
                    srcNodeId,
                    candidateNodeId : Helpers.getExisted(node.nodeId),
                    fullData,
                });
            }

            this._labelNoNode.visible = !dataArray.length;
            this._listNode.bindData(dataArray);
        }
    }

    type DataForNodeRenderer = {
        eventId         : number;
        parentNodeId?   : number;
        srcNodeId       : number | null;
        candidateNodeId : number;
        fullData        : IWarEventFullData;
    };
    class NodeRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForNodeRenderer> {
        private readonly _labelNodeId!          : TwnsUiLabel.UiLabel;
        private readonly _labelSubNode!         : TwnsUiLabel.UiLabel;
        private readonly _labelSubCondition!    : TwnsUiLabel.UiLabel;
        private readonly _btnCopy!              : TwnsUiButton.UiButton;
        private readonly _btnSelect!            : TwnsUiButton.UiButton;

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

        protected async _onDataChanged(): Promise<void> {
            this._updateLabelNodeId();
            this._updateLabelSubNode();
            this._updateLabelSubCondition();
        }

        private _onTouchedBtnCopy(): void {          // DONE
            const data = this.data;
            if (data == null) {
                return;
            }

            const fullData          = data.fullData;
            const parentNodeId      = data.parentNodeId;
            const candidateNodeId   = data.candidateNodeId;
            const candidateNode     = (fullData.conditionNodeArray || []).find(v => v.nodeId === candidateNodeId);
            if (candidateNode == null) {
                throw Helpers.newError(`Empty candidateNode.`);
            }

            const isAnd             = Helpers.getExisted(candidateNode.isAnd);
            const conditionIdArray  = (candidateNode.conditionIdArray || []).concat();
            const subNodeIdArray    = (candidateNode.subNodeIdArray || []).concat();
            if (parentNodeId == null) {
                if (WarEventHelper.createAndReplaceSubNodeInEvent({
                    fullData,
                    eventId         : data.eventId,
                    isAnd,
                    conditionIdArray,
                    subNodeIdArray,
                }) != null) {
                    Notify.dispatch(NotifyType.WarEventFullDataChanged);
                }
            } else {
                if (WarEventHelper.getAllSubNodesAndConditionsForNode({ fullData, nodeId: candidateNodeId }).nodeIdSet.has(parentNodeId)) {
                    FloatText.show(Lang.getText(LangTextType.A0179));
                    return;
                }

                if (WarEventHelper.cloneAndReplaceNodeInParentNode({
                    fullData,
                    parentNodeId,
                    nodeIdForClone  : candidateNodeId,
                    nodeIdForDelete : data.srcNodeId,
                }) != null) {
                    Notify.dispatch(NotifyType.WarEventFullDataChanged);
                }
            }
        }
        private _onTouchedBtnSelect(): void {        // DONE
            const data = this.data;
            if (data == null) {
                return;
            }

            const parentNodeId  = data.parentNodeId;
            const fullData      = data.fullData;
            const newNodeId     = data.candidateNodeId;
            if (parentNodeId == null) {
                if (WarEventHelper.replaceSubNodeInEvent({
                    fullData,
                    eventId     : data.eventId,
                    newNodeId,
                })) {
                    Notify.dispatch(NotifyType.WarEventFullDataChanged);
                }
            } else {
                if (WarEventHelper.getAllSubNodesAndConditionsForNode({ fullData, nodeId: newNodeId }).nodeIdSet.has(parentNodeId)) {
                    FloatText.show(Lang.getText(LangTextType.A0179));
                    return;
                }

                if (WarEventHelper.replaceSubNodeInParentNode({
                    fullData,
                    parentNodeId,
                    oldNodeId   : data.srcNodeId,
                    newNodeId,
                })) {
                    Notify.dispatch(NotifyType.WarEventFullDataChanged);
                }
            }
        }
        private _onNotifyLanguageChanged(): void {        // DONE
            this._updateComponentsForLanguage();
        }

        private _updateComponentsForLanguage(): void {
            this._btnCopy.label     = Lang.getText(LangTextType.B0487);
            this._btnSelect.label   = Lang.getText(LangTextType.B0492);

            this._updateLabelNodeId();
            this._updateLabelSubNode();
            this._updateLabelSubCondition();
        }

        private _updateLabelNodeId(): void {
            const data = this.data;
            if (data) {
                this._labelNodeId.text  = `${Lang.getText(LangTextType.B0488)}: N${data.candidateNodeId}`;
            }
        }
        private _updateLabelSubNode(): void {
            const data = this.data;
            if (data == null) {
                return;
            }

            const node  = (data.fullData.conditionNodeArray || []).find(v => v.nodeId === data.candidateNodeId);
            const label = this._labelSubNode;
            if (node == null) {
                label.text = Lang.getText(LangTextType.A0160);
            } else {
                const textArray: string[] = [];
                for (const subNodeId of (node.subNodeIdArray || []).sort((v1, v2) => v1 - v2)) {
                    textArray.push(`N${subNodeId}`);
                }

                label.text = `${Lang.getText(LangTextType.B0489)}: ${textArray.length ? textArray.join(`, `) : Lang.getText(LangTextType.B0001)}`;
            }
        }
        private _updateLabelSubCondition(): void {
            const data = this.data;
            if (data == null) {
                return;
            }

            const node  = (data.fullData.conditionNodeArray || []).find(v => v.nodeId === data.candidateNodeId);
            const label = this._labelSubCondition;
            if (node == null) {
                label.text = ``;
            } else {
                const textArray: string[] = [];
                for (const conditionId of (node.conditionIdArray || []).sort((v1, v2) => v1 - v2)) {
                    textArray.push(`C${conditionId}`);
                }

                label.text = `${Lang.getText(LangTextType.B0490)}: ${textArray.length ? textArray.join(`, `) : Lang.getText(LangTextType.B0001)}`;
            }
        }
    }
}

export default TwnsWeNodeReplacePanel;
