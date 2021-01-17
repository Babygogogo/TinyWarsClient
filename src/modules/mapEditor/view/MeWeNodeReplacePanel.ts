
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
        private _btnAddNode     : GameUi.UiButton;
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
                { ui: this._btnAddNode,     callback: this._onTouchedBtnAddNode },
                { ui: this._btnClose,       callback: this.close },
            ]);
            this._listNode.setItemRenderer(NodeRenderer);

            this._updateView();
        }

        private _onNotifyLanguageChanged(e: egret.Event): void {
            this._updateComponentsForLanguage();
        }
        private _onTouchedBtnAddNode(e: egret.TouchEvent): void {
            const data      = this._getOpenData<OpenDataForMeWeNodeReplacePanel>();
            const fullData  = data.fullData;
            const newNodeId = BwWarEventHelper.addNode({ fullData });
            if (newNodeId == null) {
                Logger.error(`MeWeNodeReplacePanel._onTouchedBtnAddNode() empty newNodeId!`);
                return;
            }

            const srcNodeId     = data.nodeId;
            const eventId       = data.eventId;
            const parentNodeId  = data.parentNodeId;
            if (parentNodeId == null) {
                const event = fullData.eventArray.find(v => v.eventId === eventId);
                if (event.conditionNodeId !== srcNodeId) {
                    Logger.error(`MeWeNodeReplacePanel._onTouchedBtnAddNode() invalid srcNodeId!`);
                    BwWarEventHelper.checkAndDeleteUnusedNode(fullData, newNodeId);
                    return;
                }
                event.conditionNodeId = newNodeId;

                BwWarEventHelper.checkAndDeleteUnusedNode(fullData, srcNodeId);
                Notify.dispatch(Notify.Type.MeWarEventFullDataChanged);
                this.close();

            } else {
                const idArray = fullData.conditionNodeArray.find(v => v.nodeId === parentNodeId).subNodeIdArray;
                Helpers.deleteElementFromArray(idArray, srcNodeId);
                idArray.push(newNodeId);
                idArray.sort();

                BwWarEventHelper.checkAndDeleteUnusedNode(fullData, srcNodeId);
                Notify.dispatch(Notify.Type.MeWarEventFullDataChanged);
                this.close();
            }
        }

        private _updateView(): void {
            this._updateComponentsForLanguage();

            this._updateListNodeAndLabelNoNode();
        }

        private _updateComponentsForLanguage(): void {
            this._labelTitle.text   = Lang.getText(Lang.Type.B0491);
            this._labelNoNode.text  = Lang.getText(Lang.Type.B0278);
            this._btnClose.label    = Lang.getText(Lang.Type.B0146);
            this._btnAddNode.label  = Lang.getText(Lang.Type.B0320);
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

        private _onTouchedBtnCopy(e: egret.TouchEvent): void {
            const data = this.data as DataForNodeRenderer;
            if (data) {
                const srcNodeId         = data.srcNodeId;
                const candidateNodeId   = data.candidateNodeId;
                const fullData          = data.fullData;
                const eventId           = data.eventId;
                const parentNodeId      = data.parentNodeId;
                const eventArray        = fullData.eventArray;
                if (parentNodeId == null) {
                    const event = eventArray.find(v => v.eventId === eventId);
                    if (event.conditionNodeId !== srcNodeId) {
                        Logger.error(`MeWeNodeReplacePanel.NodeRenderer._onTouchedBtnCopy() invalid srcNodeId!`);
                        return;
                    }

                    const newNodeId = BwWarEventHelper.cloneNode(fullData, candidateNodeId);
                    if (newNodeId == null) {
                        Logger.error(`MeWeNodeReplacePanel.NodeRenderer._onTouchedBtnCopy() empty newNodeId!`);
                        return;
                    }
                    event.conditionNodeId = newNodeId;

                    BwWarEventHelper.checkAndDeleteUnusedNode(fullData, srcNodeId);
                    Notify.dispatch(Notify.Type.MeWarEventFullDataChanged);
                    MeWeNodeReplacePanel.hide();

                } else {
                    if (BwWarEventHelper.getAllSubNodesAndConditionsForNode({ fullData, nodeId: candidateNodeId }).nodeIdSet.has(parentNodeId)) {
                        FloatText.show(Lang.getText(Lang.Type.A0179));
                        return;
                    }

                    const newNodeId = BwWarEventHelper.cloneNode(fullData, candidateNodeId);
                    if (newNodeId == null) {
                        Logger.error(`MeWeNodeReplacePanel.NodeRenderer._onTouchedBtnCopy() empty newNodeId 2!`);
                        return;
                    }

                    const parentNode = fullData.conditionNodeArray.find(v => v.nodeId === parentNodeId);
                    if (parentNode.subNodeIdArray == null) {
                        parentNode.subNodeIdArray = [];
                    }

                    const idArray = parentNode.subNodeIdArray;
                    Helpers.deleteElementFromArray(idArray, srcNodeId);
                    idArray.push(newNodeId);
                    idArray.sort();

                    BwWarEventHelper.checkAndDeleteUnusedNode(fullData, srcNodeId);
                    Notify.dispatch(Notify.Type.MeWarEventFullDataChanged);
                    MeWeNodeReplacePanel.hide();
                }
            }
        }
        private _onTouchedBtnSelect(e: egret.TouchEvent): void {
            const data = this.data as DataForNodeRenderer;
            if (data) {
                const srcNodeId         = data.srcNodeId;
                const candidateNodeId   = data.candidateNodeId;
                if (srcNodeId == candidateNodeId) {
                    MeWeNodeReplacePanel.hide();
                    return;
                }

                const fullData      = data.fullData;
                const eventId       = data.eventId;
                const parentNodeId  = data.parentNodeId;
                const eventArray    = fullData.eventArray;
                if (parentNodeId == null) {
                    eventArray.find(v => v.eventId === eventId).conditionNodeId = candidateNodeId;

                    BwWarEventHelper.checkAndDeleteUnusedNode(fullData, srcNodeId);
                    Notify.dispatch(Notify.Type.MeWarEventFullDataChanged);
                    MeWeNodeReplacePanel.hide();

                } else {
                    if (BwWarEventHelper.getAllSubNodesAndConditionsForNode({ fullData, nodeId: candidateNodeId }).nodeIdSet.has(parentNodeId)) {
                        FloatText.show(Lang.getText(Lang.Type.A0179));
                        return;
                    }

                    const node = fullData.conditionNodeArray.find(v => v.nodeId === parentNodeId);
                    if (node.subNodeIdArray == null) {
                        node.subNodeIdArray = [];
                    }

                    const idArray = node.subNodeIdArray;
                    Helpers.deleteElementFromArray(idArray, srcNodeId);
                    idArray.push(candidateNodeId);
                    idArray.sort();

                    BwWarEventHelper.checkAndDeleteUnusedNode(fullData, srcNodeId);
                    Notify.dispatch(Notify.Type.MeWarEventFullDataChanged);
                    MeWeNodeReplacePanel.hide();
                }
            }
        }
        private _onNotifyLanguageChanged(e: egret.Event): void {
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
