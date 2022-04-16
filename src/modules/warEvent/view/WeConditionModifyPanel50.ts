
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
// import TwnsUiTextInput              from "../../tools/ui/UiTextInput";
// import WarEventHelper               from "../model/WarEventHelper";
// import TwnsWeConditionTypeListPanel from "./WeConditionTypeListPanel";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace TwnsWeConditionModifyPanel50 {
    import LangTextType             = TwnsLangTextType.LangTextType;
    import NotifyType               = TwnsNotifyType.NotifyType;
    import IWarEventFullData        = CommonProto.Map.IWarEventFullData;
    import IWarEventCondition       = CommonProto.WarEvent.IWarEventCondition;

    export type OpenData = {
        war         : Twns.BaseWar.BwWar;
        fullData    : IWarEventFullData;
        condition   : IWarEventCondition;
    };
    export class WeConditionModifyPanel50 extends TwnsUiPanel.UiPanel<OpenData> {
        private readonly _labelTitle!                       : TwnsUiLabel.UiLabel;
        private readonly _btnType!                          : TwnsUiButton.UiButton;
        private readonly _btnClose!                         : TwnsUiButton.UiButton;
        private readonly _labelDesc!                        : TwnsUiLabel.UiLabel;
        private readonly _labelError!                       : TwnsUiLabel.UiLabel;
        private readonly _imgInnerTouchMask!                : TwnsUiImage.UiImage;

        private readonly _btnWeatherType!                   : TwnsUiButton.UiButton;
        private readonly _labelWeatherType!                 : TwnsUiLabel.UiLabel;
        private readonly _btnHasFogCurrently!               : TwnsUiButton.UiButton;
        private readonly _labelHasFogCurrently!             : TwnsUiLabel.UiLabel;

        protected _onOpening(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,         callback: this._onNotifyLanguageChanged },
                { type: NotifyType.WarEventFullDataChanged, callback: this._onNotifyWarEventFullDataChanged },
            ]);
            this._setUiListenerArray([
                { ui: this._btnClose,                       callback: this.close },
                { ui: this._btnType,                        callback: this._onTouchedBtnType },
                { ui: this._imgInnerTouchMask,              callback: this._onTouchedImgInnerTouchMask },
                { ui: this._btnWeatherType,                 callback: this._onTouchedBtnWeatherType },
                { ui: this._btnHasFogCurrently,             callback: this._onTouchedBtnHasFogCurrently },
            ]);
            this._setIsTouchMaskEnabled(true);
            this._setIsCloseOnTouchedMask();

            this._imgInnerTouchMask.touchEnabled = true;
            this._setInnerTouchMaskEnabled(false);
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
        private _onNotifyWarEventFullDataChanged(): void {
            this._updateView();
        }
        private _onTouchedBtnType(): void {
            const openData = this._getOpenData();
            TwnsPanelManager.open(TwnsPanelConfig.Dict.WeConditionTypeListPanel, {
                fullData    : openData.fullData,
                condition   : openData.condition,
                war         : openData.war,
            });
        }
        private _onTouchedImgInnerTouchMask(): void {
            this._setInnerTouchMaskEnabled(false);
        }
        private _onTouchedBtnWeatherType(): void {
            const condition = this._getCondition();
            TwnsPanelManager.open(TwnsPanelConfig.Dict.CommonChooseWeatherTypePanel, {
                gameConfig              : this._getOpenData().war.getGameConfig(),
                currentWeatherTypeArray : condition.weatherTypeArray ?? [],
                callbackOnConfirm       : weatherTypeArray => {
                    condition.weatherTypeArray = weatherTypeArray;
                    Notify.dispatch(NotifyType.WarEventFullDataChanged);
                },
            });
        }
        private _onTouchedBtnHasFogCurrently(): void {
            const condition         = this._getCondition();
            const hasFogCurrently   = condition.hasFogCurrently;
            if (hasFogCurrently) {
                condition.hasFogCurrently = false;
            } else if (hasFogCurrently == null) {
                condition.hasFogCurrently = true;
            } else {
                condition.hasFogCurrently = null;
            }
            Notify.dispatch(NotifyType.WarEventFullDataChanged);
        }

        private _updateView(): void {
            this._updateComponentsForLanguage();

            this._updateLabelDescAndLabelError();
            this._updateLabelWeatherType();
            this._updateLabelHasFogCurrently();
        }

        private _updateComponentsForLanguage(): void {
            this._labelTitle.text                       = `${Lang.getText(LangTextType.B0501)} C${this._getOpenData().condition.WecCommonData?.conditionId}`;
            this._btnClose.label                        = Lang.getText(LangTextType.B0146);
            this._btnType.label                         = Lang.getText(LangTextType.B0516);
            this._btnWeatherType.label                  = Lang.getText(LangTextType.B0705);
            this._btnHasFogCurrently.label              = Lang.getText(LangTextType.B0020);

            this._updateLabelDescAndLabelError();
        }

        private _updateLabelDescAndLabelError(): void {
            const openData          = this._getOpenData();
            const condition         = openData.condition;
            const errorTip          = Twns.WarHelpers.WarEventHelpers.getErrorTipForCondition(openData.fullData, condition, openData.war);
            const labelError        = this._labelError;
            labelError.text         = errorTip || Lang.getText(LangTextType.B0493);
            labelError.textColor    = errorTip ? Types.ColorValue.Red : Types.ColorValue.Green;
            this._labelDesc.text    = Twns.WarHelpers.WarEventHelpers.getDescForCondition(condition) || CommonConstants.ErrorTextForUndefined;
        }
        private _updateLabelWeatherType(): void {
            const weatherTypeArray      = this._getCondition().weatherTypeArray;
            this._labelWeatherType.text = weatherTypeArray?.length ? weatherTypeArray.map(v => Lang.getWeatherName(v)).join(`, `) : Lang.getText(LangTextType.B0776);
        }
        private _updateLabelHasFogCurrently(): void {
            const hasFogCurrently           = this._getCondition().hasFogCurrently;
            this._labelHasFogCurrently.text = hasFogCurrently != null ? Lang.getText(hasFogCurrently ? LangTextType.B0431 : LangTextType.B0432) : Lang.getText(LangTextType.B0776);
        }

        private _getCondition(): CommonProto.WarEvent.IWecWeatherAndFog {
            return Helpers.getExisted(this._getOpenData().condition.WecWeatherAndFog);
        }
        private _setInnerTouchMaskEnabled(isEnabled: boolean): void {
            this._imgInnerTouchMask.visible = isEnabled;
        }
    }
}

// export default TwnsWeConditionModifyPanel15;
