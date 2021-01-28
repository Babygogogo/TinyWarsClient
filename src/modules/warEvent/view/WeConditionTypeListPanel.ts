
namespace TinyWars.WarEvent {
    import Notify               = Utility.Notify;
    import ProtoTypes           = Utility.ProtoTypes;
    import Logger               = Utility.Logger;
    import Types                = Utility.Types;
    import Lang                 = Utility.Lang;
    import FloatText            = Utility.FloatText;
    import IWarEventCondition   = ProtoTypes.WarEvent.IWarEventCondition;
    import ConditionType        = Types.WarEventConditionType;

    type OpenDataForWeConditionTypeListPanel = {
        condition   : IWarEventCondition;
    }
    export class WeConditionTypeListPanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Hud1;
        protected readonly _IS_EXCLUSIVE = false;

        private static _instance: WeConditionTypeListPanel;

        private _labelTitle : GameUi.UiLabel;
        private _btnClose   : GameUi.UiButton;
        private _listType   : GameUi.UiScrollList;

        public static show(openData: OpenDataForWeConditionTypeListPanel): void {
            if (!WeConditionTypeListPanel._instance) {
                WeConditionTypeListPanel._instance = new WeConditionTypeListPanel();
            }
            WeConditionTypeListPanel._instance.open(openData);
        }

        public static hide(): void {
            if (WeConditionTypeListPanel._instance) {
                WeConditionTypeListPanel._instance.close();
            }
        }

        private constructor() {
            super();

            this._setIsAutoAdjustHeight(true);
            this._setIsTouchMaskEnabled(true);
            this._setIsCloseOnTouchedMask();
            this.skinName = "resource/skins/warEvent/WeConditionTypeListPanel.exml";
        }

        protected _onOpened(): void {
            this._setNotifyListenerArray([
                { type: Notify.Type.LanguageChanged,    callback: this._onNotifyLanguageChanged },
            ]);
            this._setUiListenerArray([
                { ui: this._btnClose,       callback: this.close },
            ]);
            this._listType.setItemRenderer(ConditionRenderer);

            this._updateView();
        }

        private _onNotifyLanguageChanged(e: egret.Event): void {
            this._updateComponentsForLanguage();
        }

        private _updateView(): void {
            this._updateComponentsForLanguage();

            this._updateListType();
        }

        private _updateComponentsForLanguage(): void {
            this._labelTitle.text       = Lang.getText(Lang.Type.B0500);
            this._btnClose.label        = Lang.getText(Lang.Type.B0146);
        }
        private _updateListType(): void {
            const openData  = this._getOpenData<OpenDataForWeConditionTypeListPanel>();
            const condition = openData.condition;

            const dataArray: DataForConditionRenderer[] = [];
            for (const newConditionType of WarEventHelper.getConditionTypeArray()) {
                dataArray.push({
                    newConditionType,
                    condition,
                });
            }
            this._listType.bindData(dataArray);
        }
    }

    type DataForConditionRenderer = {
        newConditionType: ConditionType;
        condition       : IWarEventCondition;
    }
    class ConditionRenderer extends GameUi.UiListItemRenderer {
        private _labelType  : GameUi.UiLabel;
        private _labelUsing : GameUi.UiLabel;

        protected _onOpened(): void {
            this._setUiListenerArray([
                { ui: this, callback: this._onTouchedSelf },
            ]);
            this._setNotifyListenerArray([
                { type: Notify.Type.LanguageChanged,    callback: this._onNotifyLanguageChanged },
            ]);

            this._updateComponentsForLanguage();
        }

        protected async dataChanged(): Promise<void> {
            super.dataChanged();

            this._updateLabelType();
            this._updateLabelUsing();
        }

        private _onTouchedSelf(e: egret.TouchEvent): void {
            const data = this.data as DataForConditionRenderer;
            if (data == null) {
                return;
            }

            const conditionType = data.newConditionType;
            const condition     = data.condition;
            if (conditionType !== WarEventHelper.getConditionType(condition)) {
                WarEventHelper.resetCondition(condition, conditionType);
                WarEventHelper.openConditionModifyPanel(condition);
                WeConditionTypeListPanel.hide();
            }
        }
        private _onNotifyLanguageChanged(e: egret.Event): void {        // DONE
            this._updateComponentsForLanguage();
        }

        private _updateComponentsForLanguage(): void {
            this._labelUsing.text = Lang.getText(Lang.Type.B0503);

            this._updateLabelType();
        }

        private _updateLabelType(): void {
            const data  = this.data as DataForConditionRenderer;
            const label = this._labelType;
            if (data == null) {
                label.text = undefined;
            } else {
                label.text = Lang.getWarEventConditionTypeName(data.newConditionType);
            }
        }
        private _updateLabelUsing(): void {
            const data  = this.data as DataForConditionRenderer;
            const label = this._labelUsing;
            if (data == null) {
                label.visible = false;
            } else {
                label.visible = WarEventHelper.getConditionType(data.condition) === data.newConditionType;
            }
        }
    }
}
