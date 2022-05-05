
// import CommonConstants              from "../../tools/helpers/CommonConstants";
// import Helpers                      from "../../tools/helpers/Helpers";
// import Types                        from "../../tools/helpers/Types";
// import Lang                         from "../../tools/lang/Lang";
// import TwnsLangTextType             from "../../tools/lang/LangTextType";
// import Notify                       from "../../tools/notify/Notify";
// import Twns.Notify               from "../../tools/notify/NotifyType";
// import ProtoTypes                   from "../../tools/proto/ProtoTypes";
// import TwnsUiButton                 from "../../tools/ui/UiButton";
// import TwnsUiImage                  from "../../tools/ui/UiImage";
// import TwnsUiLabel                  from "../../tools/ui/UiLabel";
// import TwnsUiPanel                  from "../../tools/ui/UiPanel";
// import WarEventHelper               from "../model/WarEventHelper";
// import TwnsWeConditionTypeListPanel from "./WeConditionTypeListPanel";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.WarEvent {
    import LangTextType             = Twns.Lang.LangTextType;
    import NotifyType               = Twns.Notify.NotifyType;
    import IWarEventFullData        = CommonProto.Map.IWarEventFullData;
    import IWarEventCondition       = CommonProto.WarEvent.IWarEventCondition;

    export type OpenDataForWeConditionModifyPanel5 = {
        war         : BaseWar.BwWar;
        fullData    : IWarEventFullData;
        condition   : IWarEventCondition;
    };
    /** WecTurnPhaseEqualTo */
    export class WeConditionModifyPanel5 extends TwnsUiPanel.UiPanel<OpenDataForWeConditionModifyPanel5> {
        private readonly _labelTitle!       : TwnsUiLabel.UiLabel;
        private readonly _btnClose!         : TwnsUiButton.UiButton;
        private readonly _btnType!          : TwnsUiButton.UiButton;
        private readonly _labelDesc!        : TwnsUiLabel.UiLabel;
        private readonly _labelError!       : TwnsUiLabel.UiLabel;
        private readonly _groupIsNot!       : eui.Group;
        private readonly _labelIsNot!       : TwnsUiLabel.UiLabel;
        private readonly _imgIsNot!         : TwnsUiImage.UiImage;
        private readonly _labelTurnPhase!   : TwnsUiLabel.UiLabel;
        private readonly _btnTurnPhase!     : TwnsUiButton.UiButton;

        protected _onOpening(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,    callback: this._onNotifyLanguageChanged },
            ]);
            this._setUiListenerArray([
                { ui: this._btnClose,       callback: this.close },
                { ui: this._btnType,        callback: this._onTouchedBtnType },
                { ui: this._groupIsNot,     callback: this._onTouchedGroupIsNot },
                { ui: this._btnTurnPhase,   callback: this._onTouchedBtnTurnPhase },
            ]);
            this._setIsTouchMaskEnabled(true);
            this._setIsCloseOnTouchedMask();
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
                fullData    : openData.fullData,
                condition   : openData.condition,
                war         : openData.war,
            });
        }
        private _onTouchedGroupIsNot(): void {
            const data  = Twns.Helpers.getExisted(this._getCondition().WecTurnPhaseEqualTo);
            data.isNot  = !data.isNot;
            this._updateImgIsNot();
            this._updateLabelDescAndLabelError();
            Twns.Notify.dispatch(NotifyType.WarEventFullDataChanged);
        }
        private _onTouchedBtnTurnPhase(): void {
            const data          = Twns.Helpers.getExisted(this._getCondition().WecTurnPhaseEqualTo);
            const currTurnPhase = data.valueEqualTo;
            if (currTurnPhase == Twns.Types.TurnPhaseCode.WaitBeginTurn) {
                data.valueEqualTo = Twns.Types.TurnPhaseCode.Main;
            } else {
                data.valueEqualTo = Twns.Types.TurnPhaseCode.WaitBeginTurn;
            }
            this._updateLabelDescAndLabelError();
            this._updateLabelTurnPhase();
            Twns.Notify.dispatch(NotifyType.WarEventFullDataChanged);
        }

        private _updateView(): void {
            this._updateComponentsForLanguage();

            this._updateLabelDescAndLabelError();
            this._updateImgIsNot();
            this._updateLabelTurnPhase();
        }

        private _updateComponentsForLanguage(): void {
            this._labelTitle.text       = `${Lang.getText(LangTextType.B0501)} C${this._getCondition().WecCommonData?.conditionId}`;
            this._btnClose.label        = Lang.getText(LangTextType.B0146);
            this._btnType.label         = Lang.getText(LangTextType.B0516);
            this._labelIsNot.text       = Lang.getText(LangTextType.B0517);
            this._btnTurnPhase.label    = Lang.getText(LangTextType.B0520);

            this._updateLabelDescAndLabelError();
            this._updateLabelTurnPhase();
        }

        private _updateLabelDescAndLabelError(): void {
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
            this._imgIsNot.visible = !!this._getCondition().WecTurnPhaseEqualTo?.isNot;
        }
        private _updateLabelTurnPhase(): void {
            this._labelTurnPhase.text = Lang.getTurnPhaseName(Twns.Helpers.getExisted(this._getCondition().WecTurnPhaseEqualTo?.valueEqualTo)) || Twns.CommonConstants.ErrorTextForUndefined;
        }

        private _getCondition(): IWarEventCondition {
            return this._getOpenData().condition;
        }
    }
}

// export default TwnsWeConditionModifyPanel5;
