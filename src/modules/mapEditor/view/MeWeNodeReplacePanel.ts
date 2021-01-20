
namespace TinyWars.MapEditor {
    import Notify               = Utility.Notify;
    import Helpers              = Utility.Helpers;
    import ProtoTypes           = Utility.ProtoTypes;
    import Logger               = Utility.Logger;
    import Lang                 = Utility.Lang;
    import FloatText            = Utility.FloatText;
    import BwWarEventHelper     = BaseWar.BwWarEventHelper;
    import WarEvent             = ProtoTypes.WarEvent;
    import IWarEventFullData    = ProtoTypes.Map.IWarEventFullData;

    type OpenDataForMeWeNodeReplacePanel = {
        eventId         : number;
        parentNodeId?   : number;
        nodeId          : number | null | undefined;
        fullData        : IWarEventFullData;
    }
    export class MeWeNodeReplacePanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Hud1;
        protected readonly _IS_EXCLUSIVE = false;

        private static _instance: MeWeNodeReplacePanel;

        private _listNode       : GameUi.UiScrollList;
        private _labelTitle     : GameUi.UiLabel;
        private _labelNoNode    : GameUi.UiLabel;
        private _btnClose       : GameUi.UiButton;

        public static show(openData: OpenDataForMeWeNodeReplacePanel): void {
            if (!MeWeNodeReplacePanel._instance) {
                MeWeNodeReplacePanel._instance = new MeWeNodeReplacePanel();
            }
            MeWeNodeReplacePanel._instance.open(openData);
        }

        public static hide(): void {
            if (MeWeNodeReplacePanel._instance) {
                MeWeNodeReplacePanel._instance.close();
            }
        }

        private constructor() {
            super();

            this._setIsAutoAdjustHeight(true);
            this._setIsTouchMaskEnabled(true);
            this._setIsCloseOnTouchedMask();
            this.skinName = "resource/skins/mapEditor/MeWeNodeReplacePanel.exml";
        }

        protected _onOpened(): void {
            this._setNotifyListenerArray([
                { type: Notify.Type.LanguageChanged,    callback: this._onNotifyLanguageChanged },
            ]);
            this._setUiListenerArray([
                { ui: this._btnClose,       callback: this.close },
            ]);
            this._listNode.setItemRenderer(NodeRenderer);

            this._updateView();
        }

        private _onNotifyLanguageChanged(e: egret.Event): void {
            this._updateComponentsForLanguage();
        }

        private _updateView(): void {
            this._updateComponentsForLanguage();

            this._updateListNodeAndLabelNoNode();
        }

        private _updateComponentsForLanguage(): void {
            this._labelTitle.text   = Lang.getText(Lang.Type.B0491);
            this._labelNoNode.text  = Lang.getText(Lang.Type.B0278);
            this._btnClose.label    = Lang.getText(Lang.Type.B0146);
        }
        private _updateListNodeAndLabelNoNode(): void {
            const openData      = this._getOpenData<OpenDataForMeWeNodeReplacePanel>();
            const eventId       = openData.eventId;
            const parentNodeId  = openData.parentNodeId;
            const srcNodeId     = openData.nodeId;
            const fullData      = openData.fullData;

            const dataArray: DataForNodeRenderer[] = [];
            for (const node of openData.fullData.conditionNodeArray || []) {
                dataArray.push({
                    eventId,
                    parentNodeId,
                    srcNodeId,
                    candidateNodeId : node.nodeId,
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
        srcNodeId       : number;
        candidateNodeId : number;
        fullData        : IWarEventFullData;
    }
    class NodeRenderer extends GameUi.UiListItemRenderer {
        private _labelNodeId        : GameUi.UiLabel;
        private _labelSubNode       : GameUi.UiLabel;
        private _labelSubCondition  : GameUi.UiLabel;
        private _btnCopy            : GameUi.UiButton;
        private _btnSelect          : GameUi.UiButton;

        protected _onOpened(): void {
            this._setUiListenerArray([
                { ui: this._btnCopy,    callback: this._onTouchedBtnCopy },
                { ui: this._btnSelect,  callback: this._onTouchedBtnSelect },
            ]);
            this._setNotifyListenerArray([
                { type: Notify.Type.LanguageChanged,    callback: this._onNotifyLanguageChanged },
            ]);

            this._updateComponentsForLanguage();
        }

        protected async dataChanged(): Promise<void> {
            super.dataChanged();

            this._updateLabelNodeId();
            this._updateLabelSubNode();
            this._updateLabelSubCondition();
        }

        private _onTouchedBtnCopy(e: egret.TouchEvent): void {          // DONE
            const data = this.data as DataForNodeRenderer;
            if (data == null) {
                return;
            }

            const fullData          = data.fullData;
            const parentNodeId      = data.parentNodeId;
            const candidateNodeId   = data.candidateNodeId;
            const candidateNode     = (fullData.conditionNodeArray || []).find(v => v.nodeId === candidateNodeId);
            if (candidateNode == null) {
                Logger.error(`MeWeNodeReplacePanel.NodeRenderer._onTouchedBtnCopy() empty candidateNode.`);
                FloatText.show(`MeWeNodeReplacePanel.NodeRenderer._onTouchedBtnCopy() empty candidateNode.`);
                return;
            }

            const isAnd             = candidateNode.isAnd;
            const conditionIdArray  = (candidateNode.conditionIdArray || []).concat();
            const subNodeIdArray    = (candidateNode.subNodeIdArray || []).concat();
            if (parentNodeId == null) {
                if (BwWarEventHelper.createAndReplaceSubNodeInEvent({
                    fullData,
                    eventId         : data.eventId,
                    isAnd,
                    conditionIdArray,
                    subNodeIdArray,
                }) != null) {
                    Notify.dispatch(Notify.Type.MeWarEventFullDataChanged);
                }
            } else {
                if (BwWarEventHelper.getAllSubNodesAndConditionsForNode({ fullData, nodeId: candidateNodeId }).nodeIdSet.has(parentNodeId)) {
                    FloatText.show(Lang.getText(Lang.Type.A0179));
                    return;
                }

                if (BwWarEventHelper.createSubNodeInParentNode({
                    fullData,
                    parentNodeId,
                    isAnd,
                    conditionIdArray,
                    subNodeIdArray
                }) != null) {
                    Notify.dispatch(Notify.Type.MeWarEventFullDataChanged);
                }
            }

            MeWeNodeReplacePanel.hide();
        }
        private _onTouchedBtnSelect(e: egret.TouchEvent): void {        // DONE
            const data = this.data as DataForNodeRenderer;
            if (data == null) {
                return;
            }

            const parentNodeId  = data.parentNodeId;
            const fullData      = data.fullData;
            const newNodeId     = data.candidateNodeId;
            if (parentNodeId == null) {
                if (BwWarEventHelper.replaceSubNodeInEvent({
                    fullData,
                    eventId     : data.eventId,
                    newNodeId,
                })) {
                    Notify.dispatch(Notify.Type.MeWarEventFullDataChanged);
                }
            } else {
                if (BwWarEventHelper.getAllSubNodesAndConditionsForNode({ fullData, nodeId: newNodeId }).nodeIdSet.has(parentNodeId)) {
                    FloatText.show(Lang.getText(Lang.Type.A0179));
                    return;
                }

                if (BwWarEventHelper.replaceSubNodeInParentNode({
                    fullData,
                    parentNodeId,
                    oldNodeId   : data.srcNodeId,
                    newNodeId,
                })) {
                    Notify.dispatch(Notify.Type.MeWarEventFullDataChanged);
                }
            }
        }
        private _onNotifyLanguageChanged(e: egret.Event): void {        // DONE
            this._updateComponentsForLanguage();
        }

        private _updateComponentsForLanguage(): void {
            this._btnCopy.label     = Lang.getText(Lang.Type.B0487);
            this._btnSelect.label   = Lang.getText(Lang.Type.B0492);

            this._updateLabelNodeId();
            this._updateLabelSubNode();
            this._updateLabelSubCondition();
        }

        private _updateLabelNodeId(): void {
            const data = this.data as DataForNodeRenderer;
            if (data) {
                this._labelNodeId.text  = `${Lang.getText(Lang.Type.B0488)}: N${data.candidateNodeId}`;
            }
        }
        private _updateLabelSubNode(): void {
            const data = this.data as DataForNodeRenderer;
            if (data == null) {
                return;
            }

            const node  = (data.fullData.conditionNodeArray || []).find(v => v.nodeId === data.candidateNodeId);
            const label = this._labelSubNode;
            if (node == null) {
                label.text = Lang.getText(Lang.Type.A0160);
            } else {
                const textArray: string[] = [];
                for (const subNodeId of (node.subNodeIdArray || []).sort()) {
                    textArray.push(`N${subNodeId}`);
                }

                label.text = `${Lang.getText(Lang.Type.B0489)}: ${textArray.length ? textArray.join(`, `) : Lang.getText(Lang.Type.B0001)}`;
            }
        }
        private _updateLabelSubCondition(): void {
            const data = this.data as DataForNodeRenderer;
            if (data == null) {
                return;
            }

            const node  = (data.fullData.conditionNodeArray || []).find(v => v.nodeId === data.candidateNodeId);
            const label = this._labelSubCondition;
            if (node == null) {
                label.text = undefined;
            } else {
                const textArray: string[] = [];
                for (const conditionId of (node.conditionIdArray || []).sort()) {
                    textArray.push(`C${conditionId}`);
                }

                label.text = `${Lang.getText(Lang.Type.B0490)}: ${textArray.length ? textArray.join(`, `) : Lang.getText(Lang.Type.B0001)}`;
            }
        }
    }
}
