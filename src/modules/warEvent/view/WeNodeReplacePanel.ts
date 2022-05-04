
// import FloatText                from "../../tools/helpers/FloatText";
// import Helpers                  from "../../tools/helpers/Helpers";
// import Types                    from "../../tools/helpers/Types";
// import Lang                     from "../../tools/lang/Lang";
// import TwnsLangTextType         from "../../tools/lang/LangTextType";
// import Notify                   from "../../tools/notify/Notify";
// import Twns.Notify           from "../../tools/notify/NotifyType";
// import ProtoTypes               from "../../tools/proto/ProtoTypes";
// import TwnsUiButton             from "../../tools/ui/UiButton";
// import TwnsUiLabel              from "../../tools/ui/UiLabel";
// import TwnsUiListItemRenderer   from "../../tools/ui/UiListItemRenderer";
// import TwnsUiPanel              from "../../tools/ui/UiPanel";
// import TwnsUiScrollList         from "../../tools/ui/UiScrollList";
// import WarEventHelper           from "../model/WarEventHelper";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.WarEvent {
    import LangTextType         = Twns.Lang.LangTextType;
    import NotifyType           = Twns.Notify.NotifyType;
    import ClientErrorCode      = Twns.ClientErrorCode;
    import IWarEventFullData    = CommonProto.Map.IWarEventFullData;

    export type OpenDataForWeNodeReplacePanel = {
        eventId         : number;
        parentNodeId?   : number;
        nodeId          : number | null;
        fullData        : IWarEventFullData;
    };
    export class WeNodeReplacePanel extends TwnsUiPanel.UiPanel<OpenDataForWeNodeReplacePanel> {
        private readonly _listNode!     : TwnsUiScrollList.UiScrollList<DataForNodeRenderer>;
        private readonly _labelTitle!   : TwnsUiLabel.UiLabel;
        private readonly _labelNoNode!  : TwnsUiLabel.UiLabel;
        private readonly _btnClose!     : TwnsUiButton.UiButton;

        protected _onOpening(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,    callback: this._onNotifyLanguageChanged },
            ]);
            this._setUiListenerArray([
                { ui: this._btnClose,       callback: this.close },
            ]);
            this._setIsTouchMaskEnabled(true);
            this._setIsCloseOnTouchedMask();

            this._listNode.setItemRenderer(NodeRenderer);
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
                    candidateNodeId : Twns.Helpers.getExisted(node.nodeId),
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

            this._btnCopy.visible = false;
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
            const candidateNode     = Twns.Helpers.getExisted((fullData.conditionNodeArray || []).find(v => v.nodeId === candidateNodeId), ClientErrorCode.WeNodeReplacePanel_NodeRenderer_OnTouchedBtnCopy_00);
            const isAnd             = Twns.Helpers.getExisted(candidateNode.isAnd);
            const conditionIdArray  = (candidateNode.conditionIdArray || []).concat();
            const subNodeIdArray    = (candidateNode.subNodeIdArray || []).concat();
            if (parentNodeId == null) {
                if (Twns.WarHelpers.WarEventHelpers.createAndReplaceSubNodeInEvent({
                    fullData,
                    eventId         : data.eventId,
                    isAnd,
                    conditionIdArray,
                    subNodeIdArray,
                }) != null) {
                    Twns.Notify.dispatch(NotifyType.WarEventFullDataChanged);
                }
            } else {
                if (Twns.WarHelpers.WarEventHelpers.getAllSubNodesAndConditionsForNode({ fullData, nodeId: candidateNodeId }).nodeIdSet.has(parentNodeId)) {
                    FloatText.show(Lang.getText(LangTextType.A0179));
                    return;
                }

                if (Twns.WarHelpers.WarEventHelpers.cloneAndReplaceNodeInParentNode({
                    fullData,
                    parentNodeId,
                    nodeIdForClone  : candidateNodeId,
                    nodeIdForDelete : data.srcNodeId,
                }) != null) {
                    Twns.Notify.dispatch(NotifyType.WarEventFullDataChanged);
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
                if (Twns.WarHelpers.WarEventHelpers.replaceSubNodeInEvent({
                    fullData,
                    eventId     : data.eventId,
                    newNodeId,
                })) {
                    Twns.Notify.dispatch(NotifyType.WarEventFullDataChanged);
                }
            } else {
                if (Twns.WarHelpers.WarEventHelpers.getAllSubNodesAndConditionsForNode({ fullData, nodeId: newNodeId }).nodeIdSet.has(parentNodeId)) {
                    FloatText.show(Lang.getText(LangTextType.A0179));
                    return;
                }

                if (Twns.WarHelpers.WarEventHelpers.replaceSubNodeInParentNode({
                    fullData,
                    parentNodeId,
                    oldNodeId   : data.srcNodeId,
                    newNodeId,
                })) {
                    Twns.Notify.dispatch(NotifyType.WarEventFullDataChanged);
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
                const nodeId            = data.candidateNodeId;
                const fullData          = data.fullData;
                const obtainerNameArray = (fullData.conditionNodeArray?.filter(node => node.subNodeIdArray?.some(v => v === nodeId)).map(v => `N${v.nodeId}`) ?? [])
                    .concat(fullData.eventArray?.filter(event => event.conditionNodeId === nodeId).map(v => `E${v.eventId}`) ?? []);
                this._labelNodeId.text  = `N${nodeId} (${Lang.getText(LangTextType.B0749)}: ${obtainerNameArray.length ? obtainerNameArray.join(`, `) : Lang.getText(LangTextType.B0001)})`;
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

// export default TwnsWeNodeReplacePanel;
