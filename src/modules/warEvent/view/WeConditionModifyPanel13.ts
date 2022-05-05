
// import CommonConstants                  from "../../tools/helpers/CommonConstants";
// import Helpers                          from "../../tools/helpers/Helpers";
// import Types                            from "../../tools/helpers/Types";
// import Lang                             from "../../tools/lang/Lang";
// import TwnsLangTextType                 from "../../tools/lang/LangTextType";
// import Notify                           from "../../tools/notify/Notify";
// import Twns.Notify                   from "../../tools/notify/NotifyType";
// import ProtoTypes                       from "../../tools/proto/ProtoTypes";
// import TwnsUiButton                     from "../../tools/ui/UiButton";
// import TwnsUiImage                      from "../../tools/ui/UiImage";
// import TwnsUiLabel                      from "../../tools/ui/UiLabel";
// import TwnsUiPanel                      from "../../tools/ui/UiPanel";
// import TwnsUiTextInput                  from "../../tools/ui/UiTextInput";
// import WarEventHelper                   from "../model/WarEventHelper";
// import TwnsWeConditionTypeListPanel     from "./WeConditionTypeListPanel";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.WarEvent {
    import NotifyType               = Twns.Notify.NotifyType;
    import IWarEventFullData        = CommonProto.Map.IWarEventFullData;
    import IWarEventCondition       = CommonProto.WarEvent.IWarEventCondition;
    import LangTextType             = Twns.Lang.LangTextType;

    export type OpenDataForWeConditionModifyPanel13 = {
        war         : BaseWar.BwWar;
        fullData    : IWarEventFullData;
        condition   : IWarEventCondition;
    };
    /** WecPlayerAliveStateEqualTo */
    export class WeConditionModifyPanel13 extends TwnsUiPanel.UiPanel<OpenDataForWeConditionModifyPanel13> {
        private readonly _labelTitle!       : TwnsUiLabel.UiLabel;
        private readonly _btnClose!         : TwnsUiButton.UiButton;
        private readonly _btnType!          : TwnsUiButton.UiButton;
        private readonly _labelDesc!        : TwnsUiLabel.UiLabel;
        private readonly _labelError!       : TwnsUiLabel.UiLabel;
        private readonly _groupIsNot!       : eui.Group;
        private readonly _labelIsNot!       : TwnsUiLabel.UiLabel;
        private readonly _imgIsNot!         : TwnsUiImage.UiImage;
        private readonly _labelAliveState!  : TwnsUiLabel.UiLabel;
        private readonly _btnAliveState!    : TwnsUiButton.UiButton;
        private readonly _labelPlayerIndex! : TwnsUiLabel.UiLabel;
        private readonly _inputPlayerIndex! : TwnsUiTextInput.UiTextInput;

        protected _onOpening(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,    callback: this._onNotifyLanguageChanged },
            ]);
            this._setUiListenerArray([
                { ui: this._btnClose,           callback: this.close },
                { ui: this._btnType,            callback: this._onTouchedBtnType },
                { ui: this._groupIsNot,         callback: this._onTouchedGroupIsNot },
                { ui: this._btnAliveState,      callback: this._onTouchedBtnAliveState },
                { ui: this._inputPlayerIndex,   callback: this._onFocusOutInputPlayerIndex, eventType: egret.FocusEvent.FOCUS_OUT },
            ]);
            this._setIsTouchMaskEnabled(true);
            this._setIsCloseOnTouchedMask();

            this._inputPlayerIndex.restrict = `0-9`;
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
        private _onTouchedBtnType(): void {
            const openData = this._getOpenData();
            Twns.PanelHelpers.open(Twns.PanelHelpers.PanelDict.WeConditionTypeListPanel, {
                war         : openData.war,
                fullData    : openData.fullData,
                condition   : openData.condition,
            });
        }
        private _onTouchedGroupIsNot(): void {
            const data  = Twns.Helpers.getExisted(this._getCondition().WecPlayerAliveStateEqualTo);
            data.isNot  = !data.isNot;
            this._updateImgIsNot();
            this._updateLabelDesc();
            Twns.Notify.dispatch(NotifyType.WarEventFullDataChanged);
        }
        private _onTouchedBtnAliveState(): void {
            const data              = Twns.Helpers.getExisted(this._getCondition().WecPlayerAliveStateEqualTo);
            const currAliveState    = data.aliveStateEqualTo;
            if (currAliveState === Twns.Types.PlayerAliveState.Alive) {
                data.aliveStateEqualTo = Twns.Types.PlayerAliveState.Dying;
            } else if (currAliveState === Twns.Types.PlayerAliveState.Dying) {
                data.aliveStateEqualTo = Twns.Types.PlayerAliveState.Dead;
            } else {
                data.aliveStateEqualTo = Twns.Types.PlayerAliveState.Alive;
            }
            this._updateLabelDesc();
            this._updateLabelAliveState();
            Twns.Notify.dispatch(NotifyType.WarEventFullDataChanged);
        }
        private _onFocusOutInputPlayerIndex(): void {
            const value = parseInt(this._inputPlayerIndex.text);
            if (isNaN(value)) {
                this._updateInputPlayerIndex();
            } else {
                Twns.Helpers.getExisted(this._getCondition().WecPlayerAliveStateEqualTo).playerIndexEqualTo = value;
                this._updateLabelDesc();
                this._updateInputPlayerIndex();
                Twns.Notify.dispatch(NotifyType.WarEventFullDataChanged);
            }
        }

        private _updateView(): void {
            this._updateComponentsForLanguage();

            this._updateLabelDesc();
            this._updateImgIsNot();
            this._updateLabelAliveState();
            this._updateInputPlayerIndex();
        }

        private _updateComponentsForLanguage(): void {
            this._labelTitle.text       = `${Lang.getText(LangTextType.B0501)} C${this._getCondition().WecCommonData?.conditionId}`;
            this._btnClose.label        = Lang.getText(LangTextType.B0146);
            this._btnType.label         = Lang.getText(LangTextType.B0516);
            this._labelIsNot.text       = Lang.getText(LangTextType.B0517);
            this._btnAliveState.label   = Lang.getText(LangTextType.B0523);
            this._labelPlayerIndex.text = Lang.getText(LangTextType.B0521);

            this._updateLabelDesc();
            this._updateLabelAliveState();
            this._updateInputPlayerIndex();
        }

        private _updateLabelDesc(): void {
            const openData          = this._getOpenData();
            const condition         = openData.condition;
            const war               = openData.war;
            const errorTip          = WarHelpers.WarEventHelpers.getErrorTipForCondition(openData.fullData, condition, war);
            const labelError        = this._labelError;
            labelError.text         = errorTip || Lang.getText(LangTextType.B0493);
            labelError.textColor    = errorTip ? Twns.Types.ColorValue.Red : Twns.Types.ColorValue.Green;
            this._labelDesc.text    = WarHelpers.WarEventHelpers.getDescForCondition(condition, war.getGameConfig()) || Twns.CommonConstants.ErrorTextForUndefined;
        }
        private _updateImgIsNot(): void {
            this._imgIsNot.visible = !!this._getCondition().WecPlayerAliveStateEqualTo?.isNot;
        }
        private _updateLabelAliveState(): void {
            this._labelAliveState.text = Lang.getPlayerAliveStateName(Twns.Helpers.getExisted(this._getCondition().WecPlayerAliveStateEqualTo?.aliveStateEqualTo)) || Twns.CommonConstants.ErrorTextForUndefined;
        }
        private _updateInputPlayerIndex(): void {
            this._inputPlayerIndex.text = `${this._getCondition().WecPlayerAliveStateEqualTo?.playerIndexEqualTo}`;
        }

        private _getCondition(): IWarEventCondition {
            return this._getOpenData().condition;
        }
    }
}

// export default TwnsWeConditionModifyPanel12;
