
namespace TinyWars.WarEvent {
    import Notify               = Utility.Notify;
    import ProtoTypes           = Utility.ProtoTypes;
    import Logger               = Utility.Logger;
    import Types                = Utility.Types;
    import Lang                 = Utility.Lang;
    import FloatText            = Utility.FloatText;
    import IWarEventFullData    = ProtoTypes.Map.IWarEventFullData;
    import IWarEventCondition   = ProtoTypes.WarEvent.IWarEventCondition;
    import ConditionType        = Types.WarEventConditionType;

    type OpenDataForWeConditionModifyPanel5 = {
        condition   : IWarEventCondition;
    }

    /** WecTurnPhaseEqualTo */
    export class WeConditionModifyPanel5 extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Hud1;
        protected readonly _IS_EXCLUSIVE = false;

        private static _instance: WeConditionModifyPanel5;

        private _labelTitle : GameUi.UiLabel;
        private _btnClose   : GameUi.UiButton;
        private _btnType    : GameUi.UiButton;
        private _labelDesc  : GameUi.UiLabel;

        public static show(openData: OpenDataForWeConditionModifyPanel5): void {
            if (!WeConditionModifyPanel5._instance) {
                WeConditionModifyPanel5._instance = new WeConditionModifyPanel5();
            }
            WeConditionModifyPanel5._instance.open(openData);
        }

        public static hide(): void {
            if (WeConditionModifyPanel5._instance) {
                WeConditionModifyPanel5._instance.close();
            }
        }

        private constructor() {
            super();

            this._setIsAutoAdjustHeight(true);
            this._setIsTouchMaskEnabled(true);
            this._setIsCloseOnTouchedMask();
            this.skinName = "resource/skins/warEvent/WeConditionModifyPanel5.exml";
        }

        protected _onOpened(): void {
            this._setNotifyListenerArray([
                { type: Notify.Type.LanguageChanged,    callback: this._onNotifyLanguageChanged },
            ]);
            this._setUiListenerArray([
                { ui: this._btnClose,   callback: this.close },
                { ui: this._btnType,    callback: this._onTouchedBtnType },
            ]);

            this._updateView();
        }

        private _onNotifyLanguageChanged(e: egret.Event): void {
            this._updateComponentsForLanguage();
        }
        private _onTouchedBtnType(e: egret.TouchEvent): void {
            WeConditionTypeListPanel.show({ condition: this._getOpenData<OpenDataForWeConditionModifyPanel5>().condition });
        }

        private _updateView(): void {
            this._updateComponentsForLanguage();

            this._updateLabelDesc();
        }

        private _updateComponentsForLanguage(): void {
            this._labelTitle.text   = Lang.getText(Lang.Type.B0501);
            this._btnClose.label    = Lang.getText(Lang.Type.B0146);
            this._btnType.label     = Lang.getText(Lang.Type.B0516);

            this._updateLabelDesc();
        }

        private _updateLabelDesc(): void {
            this._labelDesc.text = WarEventHelper.getDescForCondition(this._getOpenData<OpenDataForWeConditionModifyPanel5>().condition);
        }
    }
}
