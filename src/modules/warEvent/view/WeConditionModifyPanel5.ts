
// import CommonConstants              from "../../tools/helpers/CommonConstants";
// import Helpers                      from "../../tools/helpers/Helpers";
// import Types                        from "../../tools/helpers/Types";
// import Lang                         from "../../tools/lang/Lang";
// import TwnsLangTextType             from "../../tools/lang/LangTextType";
// import Notify                       from "../../tools/notify/Notify";
// import TwnsNotifyType               from "../../tools/notify/NotifyType";
// import ProtoTypes                   from "../../tools/proto/ProtoTypes";
// import TwnsUiButton                 from "../../tools/ui/UiButton";
// import TwnsUiImage                  from "../../tools/ui/UiImage";
// import TwnsUiLabel                  from "../../tools/ui/UiLabel";
// import TwnsUiPanel                  from "../../tools/ui/UiPanel";
// import WarEventHelper               from "../model/WarEventHelper";
// import TwnsWeConditionTypeListPanel from "./WeConditionTypeListPanel";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace TwnsWeConditionModifyPanel5 {
    import WeConditionTypeListPanel = TwnsWeConditionTypeListPanel.WeConditionTypeListPanel;
    import LangTextType             = TwnsLangTextType.LangTextType;
    import NotifyType               = TwnsNotifyType.NotifyType;
    import IWarEventFullData        = ProtoTypes.Map.IWarEventFullData;
    import IWarEventCondition       = ProtoTypes.WarEvent.IWarEventCondition;

    type OpenDataForWeConditionModifyPanel5 = {
        war         : TwnsBwWar.BwWar;
        fullData    : IWarEventFullData;
        condition   : IWarEventCondition;
    };
    /** WecTurnPhaseEqualTo */
    export class WeConditionModifyPanel5 extends TwnsUiPanel.UiPanel<OpenDataForWeConditionModifyPanel5> {
        protected readonly _LAYER_TYPE   = Types.LayerType.Hud1;
        protected readonly _IS_EXCLUSIVE = false;

        private static _instance: WeConditionModifyPanel5;

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

        public static show(openData: OpenDataForWeConditionModifyPanel5): void {
            if (!WeConditionModifyPanel5._instance) {
                WeConditionModifyPanel5._instance = new WeConditionModifyPanel5();
            }
            WeConditionModifyPanel5._instance.open(openData);
        }

        public static async hide(): Promise<void> {
            if (WeConditionModifyPanel5._instance) {
                await WeConditionModifyPanel5._instance.close();
            }
        }

        private constructor() {
            super();

            this._setIsTouchMaskEnabled(true);
            this._setIsCloseOnTouchedMask();
            this.skinName = "resource/skins/warEvent/WeConditionModifyPanel5.exml";
        }

        protected _onOpened(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,    callback: this._onNotifyLanguageChanged },
            ]);
            this._setUiListenerArray([
                { ui: this._btnClose,       callback: this.close },
                { ui: this._btnType,        callback: this._onTouchedBtnType },
                { ui: this._groupIsNot,     callback: this._onTouchedGroupIsNot },
                { ui: this._btnTurnPhase,   callback: this._onTouchedBtnTurnPhase },
            ]);

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
                war         : openData.war,
            });
        }
        private _onTouchedGroupIsNot(): void {
            const data  = Helpers.getExisted(this._getCondition().WecTurnPhaseEqualTo);
            data.isNot  = !data.isNot;
            this._updateImgIsNot();
            this._updateLabelDescAndLabelError();
            Notify.dispatch(NotifyType.WarEventFullDataChanged);
        }
        private _onTouchedBtnTurnPhase(): void {
            const data          = Helpers.getExisted(this._getCondition().WecTurnPhaseEqualTo);
            const currTurnPhase = data.valueEqualTo;
            if (currTurnPhase == Types.TurnPhaseCode.WaitBeginTurn) {
                data.valueEqualTo = Types.TurnPhaseCode.Main;
            } else {
                data.valueEqualTo = Types.TurnPhaseCode.WaitBeginTurn;
            }
            this._updateLabelDescAndLabelError();
            this._updateLabelTurnPhase();
            Notify.dispatch(NotifyType.WarEventFullDataChanged);
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
            const errorTip          = WarEventHelper.getErrorTipForCondition(openData.fullData, condition, openData.war);
            const labelError        = this._labelError;
            labelError.text         = errorTip || Lang.getText(LangTextType.B0493);
            labelError.textColor    = errorTip ? Types.ColorValue.Red : Types.ColorValue.Green;
            this._labelDesc.text    = WarEventHelper.getDescForCondition(condition) || CommonConstants.ErrorTextForUndefined;
        }
        private _updateImgIsNot(): void {
            this._imgIsNot.visible = !!this._getCondition().WecTurnPhaseEqualTo?.isNot;
        }
        private _updateLabelTurnPhase(): void {
            this._labelTurnPhase.text = Lang.getTurnPhaseName(Helpers.getExisted(this._getCondition().WecTurnPhaseEqualTo?.valueEqualTo)) || CommonConstants.ErrorTextForUndefined;
        }

        private _getCondition(): IWarEventCondition {
            return this._getOpenData().condition;
        }
    }
}

// export default TwnsWeConditionModifyPanel5;
