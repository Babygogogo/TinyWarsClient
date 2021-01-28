
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

    type OpenDataForWeConditionModifyPanel1 = {
        condition   : IWarEventCondition;
    }

    /** WecTurnIndexEqualTo */
    export class WeConditionModifyPanel1 extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Hud1;
        protected readonly _IS_EXCLUSIVE = false;

        private static _instance: WeConditionModifyPanel1;

        private _labelTitle     : GameUi.UiLabel;
        private _btnClose       : GameUi.UiButton;
        private _btnType        : GameUi.UiButton;
        private _labelDesc      : GameUi.UiLabel;
        private _groupIsNot     : eui.Group;
        private _labelIsNot     : GameUi.UiLabel;
        private _imgIsNot       : GameUi.UiImage;
        private _labelTurnIndex : GameUi.UiLabel;
        private _inputTurnIndex : GameUi.UiTextInput;

        public static show(openData: OpenDataForWeConditionModifyPanel1): void {
            if (!WeConditionModifyPanel1._instance) {
                WeConditionModifyPanel1._instance = new WeConditionModifyPanel1();
            }
            WeConditionModifyPanel1._instance.open(openData);
        }

        public static hide(): void {
            if (WeConditionModifyPanel1._instance) {
                WeConditionModifyPanel1._instance.close();
            }
        }

        private constructor() {
            super();

            this._setIsAutoAdjustHeight(true);
            this._setIsTouchMaskEnabled(true);
            this._setIsCloseOnTouchedMask();
            this.skinName = "resource/skins/warEvent/WeConditionModifyPanel1.exml";
        }

        protected _onOpened(): void {
            this._setNotifyListenerArray([
                { type: Notify.Type.LanguageChanged,    callback: this._onNotifyLanguageChanged },
            ]);
            this._setUiListenerArray([
                { ui: this._btnClose,       callback: this.close },
                { ui: this._btnType,        callback: this._onTouchedBtnType },
                { ui: this._groupIsNot,     callback: this._onTouchedGroupIsNot },
                { ui: this._inputTurnIndex, callback: this._onFocusOutInputTurnIndex, eventType: egret.FocusEvent.FOCUS_OUT },
            ]);
            this._inputTurnIndex.restrict = `0-9`;

            this._updateView();
        }

        private _onNotifyLanguageChanged(e: egret.Event): void {
            this._updateComponentsForLanguage();
        }
        private _onTouchedBtnType(e: egret.TouchEvent): void {
            WeConditionTypeListPanel.show({ condition: this._getCondition() });
        }
        private _onTouchedGroupIsNot(e: egret.TouchEvent): void {
            const data  = this._getCondition().WecTurnIndexEqualTo;
            data.isNot  = !data.isNot;
            this._updateImgIsNot();
            this._updateLabelDesc();
        }
        private _onFocusOutInputTurnIndex(e: egret.FocusEvent): void {
            const value = parseInt(this._inputTurnIndex.text);
            const data  = this._getCondition().WecTurnIndexEqualTo;
            if (isNaN(value)) {
                this._inputTurnIndex.text = `${data.valueEqualTo}`;
            } else {
                data.valueEqualTo = value;
                this._updateLabelDesc();
            }
        }

        private _updateView(): void {
            this._updateComponentsForLanguage();

            this._updateLabelDesc();
            this._updateImgIsNot();
        }

        private _updateComponentsForLanguage(): void {
            this._labelTitle.text       = Lang.getText(Lang.Type.B0501);
            this._btnClose.label        = Lang.getText(Lang.Type.B0146);
            this._btnType.label         = Lang.getText(Lang.Type.B0516);
            this._labelIsNot.text       = Lang.getText(Lang.Type.B0517);
            this._labelTurnIndex.text   = Lang.getText(Lang.Type.B0091);

            this._updateLabelDesc();
        }

        private _updateLabelDesc(): void {
            this._labelDesc.text = WarEventHelper.getDescForCondition(this._getCondition());
        }
        private _updateImgIsNot(): void {
            this._imgIsNot.visible = !!this._getCondition().WecTurnIndexEqualTo.isNot;
        }

        private _getCondition(): IWarEventCondition {
            return this._getOpenData<OpenDataForWeConditionModifyPanel1>().condition;
        }
    }
}
