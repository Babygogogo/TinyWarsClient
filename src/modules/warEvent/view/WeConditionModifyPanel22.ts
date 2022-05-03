
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
// import TwnsUiTextInput              from "../../tools/ui/UiTextInput";
// import WarEventHelper               from "../model/WarEventHelper";
// import TwnsWeConditionTypeListPanel from "./WeConditionTypeListPanel";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.WarEvent {
    import NotifyType               = Twns.Notify.NotifyType;
    import IWarEventFullData        = CommonProto.Map.IWarEventFullData;
    import IWarEventCondition       = CommonProto.WarEvent.IWarEventCondition;
    import LangTextType             = TwnsLangTextType.LangTextType;

    export type OpenDataForWeConditionModifyPanel22 = {
        war         : BaseWar.BwWar;
        fullData    : IWarEventFullData;
        condition   : IWarEventCondition;
    };
    /** WecEventCalledCountTotalLessThan */
    export class WeConditionModifyPanel22 extends TwnsUiPanel.UiPanel<OpenDataForWeConditionModifyPanel22> {
        private readonly _labelTitle!       : TwnsUiLabel.UiLabel;
        private readonly _btnClose!         : TwnsUiButton.UiButton;
        private readonly _btnType!          : TwnsUiButton.UiButton;
        private readonly _labelDesc!        : TwnsUiLabel.UiLabel;
        private readonly _labelError!       : TwnsUiLabel.UiLabel;
        private readonly _groupIsNot!       : eui.Group;
        private readonly _labelIsNot!       : TwnsUiLabel.UiLabel;
        private readonly _imgIsNot!         : TwnsUiImage.UiImage;
        private readonly _labelEvent!       : TwnsUiLabel.UiLabel;
        private readonly _btnEvent!         : TwnsUiButton.UiButton;
        private readonly _labelCalledCount! : TwnsUiLabel.UiLabel;
        private readonly _inputCalledCount! : TwnsUiTextInput.UiTextInput;

        protected _onOpening(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,    callback: this._onNotifyLanguageChanged },
            ]);
            this._setUiListenerArray([
                { ui: this._btnClose,           callback: this.close },
                { ui: this._btnType,            callback: this._onTouchedBtnType },
                { ui: this._groupIsNot,         callback: this._onTouchedGroupIsNot },
                { ui: this._btnEvent,           callback: this._onTouchedBtnTurnEvent },
                { ui: this._inputCalledCount,   callback: this._onFocusOutInputCalledCount, eventType: egret.FocusEvent.FOCUS_OUT },
            ]);
            this._setIsTouchMaskEnabled(true);
            this._setIsCloseOnTouchedMask();

            this._inputCalledCount.restrict = `0-9`;
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
            const data  = Twns.Helpers.getExisted(this._getCondition().WecEventCalledCountTotalLessThan);
            data.isNot  = !data.isNot;
            this._updateImgIsNot();
            this._updateLabelDescAndLabelError();
            Twns.Notify.dispatch(NotifyType.WarEventFullDataChanged);
        }
        private _onTouchedBtnTurnEvent(): void {
            const openData              = this._getOpenData();
            const eventArray            = Twns.Helpers.getExisted(openData.fullData.eventArray);
            const condition             = Twns.Helpers.getExisted(openData.condition.WecEventCalledCountTotalLessThan);
            const newIndex              = (eventArray.findIndex(v => v.eventId === condition.eventIdEqualTo) + 1) % eventArray.length;
            condition.eventIdEqualTo    = eventArray[newIndex].eventId;

            this._updateLabelDescAndLabelError();
            this._updateLabelEvent();
            Twns.Notify.dispatch(NotifyType.WarEventFullDataChanged);
        }
        private _onFocusOutInputCalledCount(): void {
            const value = parseInt(this._inputCalledCount.text);
            if (isNaN(value)) {
                this._updateInputCalledCount();
            } else {
                Twns.Helpers.getExisted(this._getCondition().WecEventCalledCountTotalLessThan).countLessThan = value;
                this._updateLabelDescAndLabelError();
                this._updateInputCalledCount();
                Twns.Notify.dispatch(NotifyType.WarEventFullDataChanged);
            }
        }

        private _updateView(): void {
            this._updateComponentsForLanguage();

            this._updateLabelDescAndLabelError();
            this._updateImgIsNot();
            this._updateLabelEvent();
            this._updateInputCalledCount();
        }

        private _updateComponentsForLanguage(): void {
            this._labelTitle.text       = `${Lang.getText(LangTextType.B0501)} C${this._getCondition().WecCommonData?.conditionId}`;
            this._btnClose.label        = Lang.getText(LangTextType.B0146);
            this._btnType.label         = Lang.getText(LangTextType.B0516);
            this._labelIsNot.text       = Lang.getText(LangTextType.B0517);
            this._btnEvent.label        = Lang.getText(LangTextType.B0469);
            this._labelCalledCount.text = Lang.getText(LangTextType.B0522);

            this._updateLabelDescAndLabelError();
            this._updateLabelEvent();
            this._updateInputCalledCount();
        }

        private _updateLabelDescAndLabelError(): void {
            const openData          = this._getOpenData();
            const condition         = openData.condition;
            const war               = openData.war;
            const errorTip          = WarHelpers.WarEventHelpers.getErrorTipForCondition(openData.fullData, condition, war);
            const labelError        = this._labelError;
            labelError.text         = errorTip || Lang.getText(LangTextType.B0493);
            labelError.textColor    = errorTip ? Twns.Types.ColorValue.Red : Twns.Types.ColorValue.Green;
            this._labelDesc.text    = WarHelpers.WarEventHelpers.getDescForCondition(condition, war.getGameConfig()) || CommonConstants.ErrorTextForUndefined;
        }
        private _updateImgIsNot(): void {
            this._imgIsNot.visible = !!this._getCondition().WecEventCalledCountTotalLessThan?.isNot;
        }
        private _updateLabelEvent(): void {
            const openData          = this._getOpenData();
            const eventId           = Twns.Helpers.getExisted(openData.condition.WecEventCalledCountTotalLessThan?.eventIdEqualTo);
            const event             = WarHelpers.WarEventHelpers.getEvent(openData.fullData, eventId);
            this._labelEvent.text   = `#${eventId} (${event ? Lang.getLanguageText({ textArray: event.eventNameArray }) : `---`})`;
        }
        private _updateInputCalledCount(): void {
            this._inputCalledCount.text = `${this._getCondition().WecEventCalledCountTotalLessThan?.eventIdEqualTo}`;
        }

        private _getCondition(): IWarEventCondition {
            return this._getOpenData().condition;
        }
    }
}

// export default TwnsWeConditionModifyPanel11;
