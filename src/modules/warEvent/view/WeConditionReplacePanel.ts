
namespace TinyWars.WarEvent {
    import Notify               = Utility.Notify;
    import ProtoTypes           = Utility.ProtoTypes;
    import Logger               = Utility.Logger;
    import Lang                 = Utility.Lang;
    import FloatText            = Utility.FloatText;
    import IWarEventFullData    = ProtoTypes.Map.IWarEventFullData;

    type OpenDataForWeConditionReplacePanel = {
        fullData        : IWarEventFullData;
        parentNodeId    : number;
        conditionId     : number;
    }
    export class WeConditionReplacePanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Hud1;
        protected readonly _IS_EXCLUSIVE = false;

        private static _instance: WeConditionReplacePanel;

        private _listCondition      : GameUi.UiScrollList;
        private _labelTitle         : GameUi.UiLabel;
        private _labelNoCondition   : GameUi.UiLabel;
        private _btnClose           : GameUi.UiButton;

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

            this._setIsAutoAdjustHeight(true);
            this._setIsTouchMaskEnabled(true);
            this._setIsCloseOnTouchedMask();
            this.skinName = "resource/skins/warEvent/WeConditionReplacePanel.exml";
        }

        protected _onOpened(): void {
            this._setNotifyListenerArray([
                { type: Notify.Type.LanguageChanged,    callback: this._onNotifyLanguageChanged },
            ]);
            this._setUiListenerArray([
                { ui: this._btnClose,       callback: this.close },
            ]);
            this._listCondition.setItemRenderer(ConditionRenderer);

            this._updateView();
        }

        private _onNotifyLanguageChanged(e: egret.Event): void {
            this._updateComponentsForLanguage();
        }

        private _updateView(): void {
            this._updateComponentsForLanguage();

            this._updateListConditionAndLabelNoCondition();
        }

        private _updateComponentsForLanguage(): void {
            const openData              = this._getOpenData<OpenDataForWeConditionReplacePanel>();
            this._labelTitle.text       = `${Lang.getText(Lang.Type.B0500)} C${openData.conditionId}`;
            this._labelNoCondition.text = Lang.getText(Lang.Type.B0278);
            this._btnClose.label        = Lang.getText(Lang.Type.B0146);
        }
        private _updateListConditionAndLabelNoCondition(): void {
            const openData          = this._getOpenData<OpenDataForWeConditionReplacePanel>();
            const parentNodeId      = openData.parentNodeId;
            const srcConditionId    = openData.conditionId;
            const fullData          = openData.fullData;

            const dataArray: DataForConditionRenderer[] = [];
            for (const condition of openData.fullData.conditionArray || []) {
                dataArray.push({
                    parentNodeId,
                    srcConditionId,
                    candidateConditionId : condition.WecCommonData.conditionId,
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
    }
    class ConditionRenderer extends GameUi.UiListItemRenderer {
        private _labelConditionId   : GameUi.UiLabel;
        private _labelCondition     : GameUi.UiLabel;
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

            this._updateLabelConditionId();
            this._updateLabelCondition();
        }

        private _onTouchedBtnCopy(e: egret.TouchEvent): void {          // DONE
            const data = this.data as DataForConditionRenderer;
            if (data == null) {
                return;
            }

            if (WarEventHelper.cloneAndReplaceConditionInParentNode({
                fullData                : data.fullData,
                parentNodeId            : data.parentNodeId,
                conditionIdForDelete    : data.srcConditionId,
                conditionIdForClone     : data.candidateConditionId,
            }) != null) {
                Notify.dispatch(Notify.Type.WarEventFullDataChanged);
            }
        }
        private _onTouchedBtnSelect(e: egret.TouchEvent): void {        // DONE
            const data = this.data as DataForConditionRenderer;
            if (data == null) {
                return;
            }

            if (WarEventHelper.replaceConditionInParentNode({
                fullData        : data.fullData,
                parentNodeId    : data.parentNodeId,
                oldConditionId  : data.srcConditionId,
                newConditionId  : data.candidateConditionId,
            })) {
                Notify.dispatch(Notify.Type.WarEventFullDataChanged);
            }
        }
        private _onNotifyLanguageChanged(e: egret.Event): void {        // DONE
            this._updateComponentsForLanguage();
        }

        private _updateComponentsForLanguage(): void {
            this._btnCopy.label     = Lang.getText(Lang.Type.B0487);
            this._btnSelect.label   = Lang.getText(Lang.Type.B0492);

            this._updateLabelConditionId();
            this._updateLabelCondition();
        }

        private _updateLabelConditionId(): void {
            const data = this.data as DataForConditionRenderer;
            if (data) {
                this._labelConditionId.text  = `${Lang.getText(Lang.Type.B0502)}: C${data.candidateConditionId}`;
            }
        }
        private _updateLabelCondition(): void {
            const data = this.data as DataForConditionRenderer;
            if (data == null) {
                return;
            }

            const condition = (data.fullData.conditionArray || []).find(v => v.WecCommonData.conditionId === data.candidateConditionId);
            const label     = this._labelCondition;
            if (condition == null) {
                label.text = Lang.getText(Lang.Type.A0160);
            } else {
                label.text = WarEventHelper.getDescForCondition(condition);
            }
        }
    }
}
