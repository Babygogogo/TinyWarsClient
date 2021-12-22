
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
namespace TwnsWeConditionModifyPanel30 {
    import LangTextType             = TwnsLangTextType.LangTextType;
    import NotifyType               = TwnsNotifyType.NotifyType;
    import IWarEventFullData        = ProtoTypes.Map.IWarEventFullData;
    import IWarEventCondition       = ProtoTypes.WarEvent.IWarEventCondition;

    export type OpenData = {
        war         : TwnsBwWar.BwWar;
        fullData    : IWarEventFullData;
        condition   : IWarEventCondition;
    };
    /** WecPlayerIndexInTurnEqualTo */
    export class WeConditionModifyPanel30 extends TwnsUiPanel.UiPanel<OpenData> {
        private readonly _labelTitle!       : TwnsUiLabel.UiLabel;
        private readonly _btnType!          : TwnsUiButton.UiButton;
        private readonly _btnClose!         : TwnsUiButton.UiButton;
        private readonly _labelDesc!        : TwnsUiLabel.UiLabel;
        private readonly _labelError!       : TwnsUiLabel.UiLabel;
        private readonly _labelGridIndex!   : TwnsUiLabel.UiLabel;
        private readonly _inputGridX!       : TwnsUiTextInput.UiTextInput;
        private readonly _inputGridY!       : TwnsUiTextInput.UiTextInput;
        private readonly _labelPlayerIndex! : TwnsUiLabel.UiLabel;
        private readonly _inputPlayerIndex! : TwnsUiTextInput.UiTextInput;
        private readonly _groupIsNot!       : eui.Group;
        private readonly _imgIsNot!         : TwnsUiImage.UiImage;
        private readonly _labelIsNot!       : TwnsUiLabel.UiLabel;

        protected _onOpening(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,    callback: this._onNotifyLanguageChanged },
            ]);
            this._setUiListenerArray([
                { ui: this._btnClose,           callback: this.close },
                { ui: this._btnType,            callback: this._onTouchedBtnType },
                { ui: this._groupIsNot,         callback: this._onTouchedGroupIsNot },
                { ui: this._inputPlayerIndex,   callback: this._onFocusOutInputPlayerIndex, eventType: egret.FocusEvent.FOCUS_OUT },
                { ui: this._inputGridX,         callback: this._onFocusOutInputGridX,       eventType: egret.FocusEvent.FOCUS_OUT },
                { ui: this._inputGridY,         callback: this._onFocusOutInputGridY,       eventType: egret.FocusEvent.FOCUS_OUT },
            ]);
            this._setIsTouchMaskEnabled(true);
            this._setIsCloseOnTouchedMask();

            this._inputPlayerIndex.restrict = `0-9`;
            this._inputGridX.restrict       = `0-9`;
            this._inputGridY.restrict       = `0-9`;
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
            TwnsPanelManager.open(TwnsPanelConfig.Dict.WeConditionTypeListPanel, {
                fullData    : openData.fullData,
                condition   : openData.condition,
                war         : openData.war,
            });
        }
        private _onTouchedGroupIsNot(): void {
            const data  = Helpers.getExisted(this._getCondition().WecTilePlayerIndexEqualTo);
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
                Helpers.getExisted(this._getCondition().WecTilePlayerIndexEqualTo).playerIndex = value;
                this._updateLabelDescAndLabelError();
                this._updateInputPlayerIndex();
                Notify.dispatch(NotifyType.WarEventFullDataChanged);
            }
        }
        private _onFocusOutInputGridX(): void {
            const value = parseInt(this._inputGridX.text);
            if (isNaN(value)) {
                this._updateInputGridX();
            } else {
                const mapSize = this._getOpenData().war.getTileMap().getMapSize();
                Helpers.getExisted(this._getCondition().WecTilePlayerIndexEqualTo?.gridIndex).x = Math.max(0, Math.min(mapSize.width - 1, value));
                this._updateLabelDescAndLabelError();
                this._updateInputGridX();
                Notify.dispatch(NotifyType.WarEventFullDataChanged);
            }
        }
        private _onFocusOutInputGridY(): void {
            const value = parseInt(this._inputGridY.text);
            if (isNaN(value)) {
                this._updateInputGridY();
            } else {
                const mapSize = this._getOpenData().war.getTileMap().getMapSize();
                Helpers.getExisted(this._getCondition().WecTilePlayerIndexEqualTo?.gridIndex).y = Math.max(0, Math.min(mapSize.height - 1, value));
                this._updateLabelDescAndLabelError();
                this._updateInputGridY();
                Notify.dispatch(NotifyType.WarEventFullDataChanged);
            }
        }

        private _updateView(): void {
            this._updateComponentsForLanguage();

            this._updateLabelDescAndLabelError();
            this._updateImgIsNot();
            this._updateInputPlayerIndex();
            this._updateInputGridX();
            this._updateInputGridY();
        }

        private _updateComponentsForLanguage(): void {
            this._labelTitle.text       = `${Lang.getText(LangTextType.B0501)} C${this._getCondition().WecCommonData?.conditionId}`;
            this._btnClose.label        = Lang.getText(LangTextType.B0146);
            this._btnType.label         = Lang.getText(LangTextType.B0516);
            this._labelIsNot.text       = Lang.getText(LangTextType.B0517);
            this._labelPlayerIndex.text = Lang.getText(LangTextType.B0521);
            this._labelGridIndex.text   = Lang.getText(LangTextType.B0531);

            this._updateLabelDescAndLabelError();
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
            this._imgIsNot.visible = !!this._getCondition().WecTilePlayerIndexEqualTo?.isNot;
        }
        private _updateInputPlayerIndex(): void {
            this._inputPlayerIndex.text = `${this._getCondition().WecTilePlayerIndexEqualTo?.playerIndex}`;
        }
        private _updateInputGridX(): void {
            this._inputGridX.text = `${this._getCondition().WecTilePlayerIndexEqualTo?.gridIndex?.x}`;
        }
        private _updateInputGridY(): void {
            this._inputGridY.text = `${this._getCondition().WecTilePlayerIndexEqualTo?.gridIndex?.y}`;
        }

        private _getCondition(): IWarEventCondition {
            return this._getOpenData().condition;
        }
    }
}

// export default TwnsWeConditionModifyPanel13;
