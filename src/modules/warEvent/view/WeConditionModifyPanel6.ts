
import CommonConstants              from "../../tools/helpers/CommonConstants";
import CompatibilityHelpers         from "../../tools/helpers/CompatibilityHelpers";
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

namespace TwnsWeConditionModifyPanel6 {
    import WeConditionTypeListPanel = TwnsWeConditionTypeListPanel.WeConditionTypeListPanel;
    import LangTextType             = TwnsLangTextType.LangTextType;
    import NotifyType               = TwnsNotifyType.NotifyType;
    import IWarEventFullData        = ProtoTypes.Map.IWarEventFullData;
    import IWarEventCondition       = ProtoTypes.WarEvent.IWarEventCondition;

    type OpenDataForWeConditionModifyPanel6 = {
        fullData    : IWarEventFullData;
        condition   : IWarEventCondition;
    };
    /** WecPlayerIndexInTurnEqualTo */
    export class WeConditionModifyPanel6 extends TwnsUiPanel.UiPanel<OpenDataForWeConditionModifyPanel6> {
        protected readonly _LAYER_TYPE   = Types.LayerType.Hud1;
        protected readonly _IS_EXCLUSIVE = false;

        private static _instance: WeConditionModifyPanel6;

        private readonly _labelTitle!       : TwnsUiLabel.UiLabel;
        private readonly _btnClose!         : TwnsUiButton.UiButton;
        private readonly _btnType!          : TwnsUiButton.UiButton;
        private readonly _labelDesc!        : TwnsUiLabel.UiLabel;
        private readonly _labelError!       : TwnsUiLabel.UiLabel;
        private readonly _groupIsNot!       : eui.Group;
        private readonly _labelIsNot!       : TwnsUiLabel.UiLabel;
        private readonly _imgIsNot!         : TwnsUiImage.UiImage;
        private readonly _labelPlayerIndex! : TwnsUiLabel.UiLabel;
        private readonly _inputPlayerIndex! : TwnsUiTextInput.UiTextInput;

        public static show(openData: OpenDataForWeConditionModifyPanel6): void {
            if (!WeConditionModifyPanel6._instance) {
                WeConditionModifyPanel6._instance = new WeConditionModifyPanel6();
            }
            WeConditionModifyPanel6._instance.open(openData);
        }

        public static async hide(): Promise<void> {
            if (WeConditionModifyPanel6._instance) {
                await WeConditionModifyPanel6._instance.close().catch(err => { CompatibilityHelpers.showError(err); throw err; });
            }
        }

        private constructor() {
            super();

            this._setIsTouchMaskEnabled(true);
            this._setIsCloseOnTouchedMask();
            this.skinName = "resource/skins/warEvent/WeConditionModifyPanel6.exml";
        }

        protected _onOpened(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,    callback: this._onNotifyLanguageChanged },
            ]);
            this._setUiListenerArray([
                { ui: this._btnClose,           callback: this.close },
                { ui: this._btnType,            callback: this._onTouchedBtnType },
                { ui: this._groupIsNot,         callback: this._onTouchedGroupIsNot },
                { ui: this._inputPlayerIndex,   callback: this._onFocusOutInputPlayerIndex, eventType: egret.FocusEvent.FOCUS_OUT },
            ]);
            this._inputPlayerIndex.restrict = `0-9`;

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
            const data  = Helpers.getExisted(this._getCondition().WecPlayerIndexInTurnEqualTo);
            data.isNot  = !data.isNot;
            this._updateImgIsNot();
            this._updateLabelDescAndLabelError();
            Notify.dispatch(NotifyType.WarEventFullDataChanged);
        }
        private _onFocusOutInputPlayerIndex(): void {
            const value = parseInt(this._inputPlayerIndex.text);
            if (isNaN(value)) {
                this._updateInputPlayerIndex();
            } else {
                Helpers.getExisted(this._getCondition().WecPlayerIndexInTurnEqualTo).valueEqualTo = value;
                this._updateLabelDescAndLabelError();
                this._updateInputPlayerIndex();
                Notify.dispatch(NotifyType.WarEventFullDataChanged);
            }
        }

        private _updateView(): void {
            this._updateComponentsForLanguage();

            this._updateLabelDescAndLabelError();
            this._updateImgIsNot();
            this._updateInputPlayerIndex();
        }

        private _updateComponentsForLanguage(): void {
            this._labelTitle.text       = `${Lang.getText(LangTextType.B0501)} C${this._getCondition().WecCommonData?.conditionId}`;
            this._btnClose.label        = Lang.getText(LangTextType.B0146);
            this._btnType.label         = Lang.getText(LangTextType.B0516);
            this._labelIsNot.text       = Lang.getText(LangTextType.B0517);
            this._labelPlayerIndex.text = Lang.getText(LangTextType.B0521);

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
            this._imgIsNot.visible = !!this._getCondition().WecPlayerIndexInTurnEqualTo?.isNot;
        }
        private _updateInputPlayerIndex(): void {
            this._inputPlayerIndex.text = `${this._getCondition().WecPlayerIndexInTurnEqualTo?.valueEqualTo}`;
        }

        private _getCondition(): IWarEventCondition {
            return this._getOpenData().condition;
        }
    }
}

export default TwnsWeConditionModifyPanel6;
