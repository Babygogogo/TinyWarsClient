
namespace TinyWars.WarEvent {
    import Notify               = Utility.Notify;
    import ProtoTypes           = Utility.ProtoTypes;
    import Lang                 = Utility.Lang;
    import IWarEventFullData    = ProtoTypes.Map.IWarEventFullData;

    type OpenDataForWeActionReplacePanel = {
        fullData    : IWarEventFullData;
        eventId     : number;
        actionId    : number;
    }
    export class WeActionReplacePanel extends GameUi.UiPanel<OpenDataForWeActionReplacePanel> {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Hud1;
        protected readonly _IS_EXCLUSIVE = false;

        private static _instance: WeActionReplacePanel;

        private _listAction     : GameUi.UiScrollList<DataForActionRenderer>;
        private _labelTitle     : GameUi.UiLabel;
        private _labelNoAction  : GameUi.UiLabel;
        private _btnClose       : GameUi.UiButton;

        public static show(openData: OpenDataForWeActionReplacePanel): void {
            if (!WeActionReplacePanel._instance) {
                WeActionReplacePanel._instance = new WeActionReplacePanel();
            }
            WeActionReplacePanel._instance.open(openData);
        }

        public static async hide(): Promise<void> {
            if (WeActionReplacePanel._instance) {
                await WeActionReplacePanel._instance.close();
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
                { type: Notify.Type.LanguageChanged,    callback: this._onNotifyLanguageChanged },
            ]);
            this._setUiListenerArray([
                { ui: this._btnClose,       callback: this.close },
            ]);
            this._listAction.setItemRenderer(ActionRenderer);

            this._updateView();
        }

        private _onNotifyLanguageChanged(e: egret.Event): void {
            this._updateComponentsForLanguage();
        }

        private _updateView(): void {
            this._updateComponentsForLanguage();

            this._updateComponentsForAction();
        }

        private _updateComponentsForLanguage(): void {
            const openData              = this._getOpenData();
            this._labelTitle.text       = `${Lang.getText(Lang.Type.B0615)} A${openData.actionId}`;
            this._labelNoAction.text    = Lang.getText(Lang.Type.B0278);
            this._btnClose.label        = Lang.getText(Lang.Type.B0146);
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
                    candidateActionId: action.WarEventActionCommonData.actionId,
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
    }
    class ActionRenderer extends GameUi.UiListItemRenderer<DataForActionRenderer> {
        private _labelActionId  : GameUi.UiLabel;
        private _labelAction    : GameUi.UiLabel;
        private _btnCopy        : GameUi.UiButton;
        private _btnSelect      : GameUi.UiButton;

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

        protected _onDataChanged(): void {
            this._updateLabelActionId();
            this._updateLabelAction();
            this._updateBtnSelect();
        }

        private _onTouchedBtnCopy(e: egret.TouchEvent): void {          // DONE
            const data = this.data;
            if (data == null) {
                return;
            }

            if (WarEventHelper.cloneAndReplaceActionInEvent({
                fullData            : data.fullData,
                eventId             : data.eventId,
                actionIdForDelete   : data.srcActionId,
                actionIdForClone    : data.candidateActionId,
            }) != null) {
                Notify.dispatch(Notify.Type.WarEventFullDataChanged);
                WeActionReplacePanel.hide();
            }
        }
        private _onTouchedBtnSelect(e: egret.TouchEvent): void {        // DONE
            const data = this.data;
            if (data == null) {
                return;
            }

            if (WarEventHelper.replaceActionInEvent({
                fullData    : data.fullData,
                eventId     : data.eventId,
                oldActionId : data.srcActionId,
                newActionId : data.candidateActionId,
            })) {
                Notify.dispatch(Notify.Type.WarEventFullDataChanged);
                WeActionReplacePanel.hide();
            }
        }
        private _onNotifyLanguageChanged(e: egret.Event): void {        // DONE
            this._updateComponentsForLanguage();
        }

        private _updateComponentsForLanguage(): void {
            this._btnCopy.label     = Lang.getText(Lang.Type.B0487);
            this._btnSelect.label   = Lang.getText(Lang.Type.B0492);

            this._updateLabelActionId();
            this._updateLabelAction();
        }

        private _updateLabelActionId(): void {
            const data = this.data;
            if (data) {
                this._labelActionId.text  = `${Lang.getText(Lang.Type.B0616)}: A${data.candidateActionId}`;
            }
        }
        private _updateLabelAction(): void {
            const data = this.data;
            if (data == null) {
                return;
            }

            const action    = (data.fullData.actionArray || []).find(v => v.WarEventActionCommonData.actionId === data.candidateActionId);
            const label     = this._labelAction;
            if (action == null) {
                label.text = Lang.getText(Lang.Type.A0168);
            } else {
                label.text = WarEventHelper.getDescForAction(action);
            }
        }
        private _updateBtnSelect(): void {
            const data = this.data;
            if (data) {
                this._btnSelect.visible = data.srcActionId !== data.candidateActionId;
            }
        }
    }
}
