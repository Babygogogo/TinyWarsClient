
import CommonConstants              from "../../tools/helpers/CommonConstants";
import Helpers                      from "../../tools/helpers/Helpers";
import Types                        from "../../tools/helpers/Types";
import Lang                         from "../../tools/lang/Lang";
import TwnsLangTextType             from "../../tools/lang/LangTextType";
import Notify                       from "../../tools/notify/Notify";
import TwnsNotifyType               from "../../tools/notify/NotifyType";
import ProtoTypes                   from "../../tools/proto/ProtoTypes";
import TwnsUiButton                 from "../../tools/ui/UiButton";
import TwnsUiImage                  from "../../tools/ui/UiImage";
import TwnsUiLabel                  from "../../tools/ui/UiLabel";
import TwnsUiPanel                  from "../../tools/ui/UiPanel";
import TwnsUiTextInput              from "../../tools/ui/UiTextInput";
import WarEventHelper               from "../model/WarEventHelper";
import TwnsWeConditionTypeListPanel from "./WeConditionTypeListPanel";

namespace TwnsWeConditionModifyPanel2 {
    import WeConditionTypeListPanel = TwnsWeConditionTypeListPanel.WeConditionTypeListPanel;
    import LangTextType             = TwnsLangTextType.LangTextType;
    import NotifyType               = TwnsNotifyType.NotifyType;
    import IWarEventFullData        = ProtoTypes.Map.IWarEventFullData;
    import IWarEventCondition       = ProtoTypes.WarEvent.IWarEventCondition;

    type OpenDataForWeConditionModifyPanel2 = {
        fullData    : IWarEventFullData;
        condition   : IWarEventCondition;
    };
    /** WecTurnIndexGreaterThan */
    export class WeConditionModifyPanel2 extends TwnsUiPanel.UiPanel<OpenDataForWeConditionModifyPanel2> {
        protected readonly _LAYER_TYPE   = Types.LayerType.Hud1;
        protected readonly _IS_EXCLUSIVE = false;

        private static _instance: WeConditionModifyPanel2;

        private readonly _labelTitle!       : TwnsUiLabel.UiLabel;
        private readonly _btnClose!         : TwnsUiButton.UiButton;
        private readonly _btnType!          : TwnsUiButton.UiButton;
        private readonly _labelDesc!        : TwnsUiLabel.UiLabel;
        private readonly _labelError!       : TwnsUiLabel.UiLabel;
        private readonly _groupIsNot!       : eui.Group;
        private readonly _labelIsNot!       : TwnsUiLabel.UiLabel;
        private readonly _imgIsNot!         : TwnsUiImage.UiImage;
        private readonly _labelTurnIndex!   : TwnsUiLabel.UiLabel;
        private readonly _inputTurnIndex!   : TwnsUiTextInput.UiTextInput;

        public static show(openData: OpenDataForWeConditionModifyPanel2): void {
            if (!WeConditionModifyPanel2._instance) {
                WeConditionModifyPanel2._instance = new WeConditionModifyPanel2();
            }
            WeConditionModifyPanel2._instance.open(openData);
        }

        public static async hide(): Promise<void> {
            if (WeConditionModifyPanel2._instance) {
                await WeConditionModifyPanel2._instance.close();
            }
        }

        private constructor() {
            super();

            this._setIsTouchMaskEnabled(true);
            this._setIsCloseOnTouchedMask();
            this.skinName = "resource/skins/warEvent/WeConditionModifyPanel2.exml";
        }

        protected _onOpened(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,    callback: this._onNotifyLanguageChanged },
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

        private _onNotifyLanguageChanged(): void {
            this._updateComponentsForLanguage();
        }
        private _onTouchedBtnType(): void {
            const openData = this._getOpenData();
            WeConditionTypeListPanel.show({
                fullData    : openData.fullData,
                condition   : openData.condition,
            });
        }
        private _onTouchedGroupIsNot(): void {
            const data  = Helpers.getExisted(this._getCondition().WecTurnIndexGreaterThan);
            data.isNot  = !data.isNot;
            this._updateImgIsNot();
            this._updateLabelDescAndLabelError();
            Notify.dispatch(NotifyType.WarEventFullDataChanged);
        }
        private _onFocusOutInputTurnIndex(): void {
            const value = parseInt(this._inputTurnIndex.text);
            if (isNaN(value)) {
                this._updateInputTurnIndex();
            } else {
                Helpers.getExisted(this._getCondition().WecTurnIndexGreaterThan).valueGreaterThan = value;
                this._updateLabelDescAndLabelError();
                this._updateInputTurnIndex();
                Notify.dispatch(NotifyType.WarEventFullDataChanged);
            }
        }

        private _updateView(): void {
            this._updateComponentsForLanguage();

            this._updateLabelDescAndLabelError();
            this._updateImgIsNot();
            this._updateInputTurnIndex();
        }

        private _updateComponentsForLanguage(): void {
            this._labelTitle.text       = `${Lang.getText(LangTextType.B0501)} C${this._getCondition().WecCommonData?.conditionId}`;
            this._btnClose.label        = Lang.getText(LangTextType.B0146);
            this._btnType.label         = Lang.getText(LangTextType.B0516);
            this._labelIsNot.text       = Lang.getText(LangTextType.B0517);
            this._labelTurnIndex.text   = Lang.getText(LangTextType.B0091);

            this._updateLabelDescAndLabelError();
        }

        private _updateLabelDescAndLabelError(): void {
            const openData          = this._getOpenData();
            const condition         = openData.condition;
            const errorTip          = WarEventHelper.getErrorTipForCondition(openData.fullData, condition);
            const labelError        = this._labelError;
            labelError.text         = errorTip || Lang.getText(LangTextType.B0493);
            labelError.textColor    = errorTip ? Types.ColorValue.Red : Types.ColorValue.Green;
            this._labelDesc.text    = WarEventHelper.getDescForCondition(condition) || CommonConstants.ErrorTextForUndefined;
        }
        private _updateImgIsNot(): void {
            this._imgIsNot.visible = !!this._getCondition().WecTurnIndexGreaterThan?.isNot;
        }
        private _updateInputTurnIndex(): void {
            this._inputTurnIndex.text = `${this._getCondition().WecTurnIndexGreaterThan?.valueGreaterThan}`;
        }

        private _getCondition(): IWarEventCondition {
            return this._getOpenData().condition;
        }
    }
}

export default TwnsWeConditionModifyPanel2;
