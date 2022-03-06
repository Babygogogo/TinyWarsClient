
// import CommonConstants      from "../../tools/helpers/CommonConstants";
// import Helpers              from "../../tools/helpers/Helpers";
// import Types                from "../../tools/helpers/Types";
// import Lang                 from "../../tools/lang/Lang";
// import TwnsLangTextType     from "../../tools/lang/LangTextType";
// import TwnsNotifyType       from "../../tools/notify/NotifyType";
// import TwnsUiButton         from "../../tools/ui/UiButton";
// import TwnsUiImage          from "../../tools/ui/UiImage";
// import TwnsUiLabel          from "../../tools/ui/UiLabel";
// import TwnsUiPanel          from "../../tools/ui/UiPanel";
// import TwnsUiTextInput      from "../../tools/ui/UiTextInput";
// import RwProxy              from "../model/RwProxy";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace TwnsRwSearchReplayPanel {
    import LangTextType     = TwnsLangTextType.LangTextType;
    import NotifyType       = TwnsNotifyType.NotifyType;

    export type OpenData = void;
    export class RwSearchReplayPanel extends TwnsUiPanel.UiPanel<OpenData> {
        private readonly _imgMask!                      : TwnsUiImage.UiImage;

        private readonly _group!                        : eui.Group;
        private readonly _btnReset!                     : TwnsUiButton.UiButton;
        private readonly _btnSearch!                    : TwnsUiButton.UiButton;
        private readonly _labelTitle!                   : TwnsUiLabel.UiLabel;
        private readonly _labelDesc!                    : TwnsUiLabel.UiLabel;
        private readonly _btnClose!                     : TwnsUiButton.UiButton;

        private readonly _labelReplayIdTitle!           : TwnsUiLabel.UiLabel;
        private readonly _inputReplayId!                : TwnsUiTextInput.UiTextInput;

        private readonly _labelMapNameTitle!            : TwnsUiLabel.UiLabel;
        private readonly _inputMapName!                 : TwnsUiTextInput.UiTextInput;

        private readonly _labelUserNicknameTitle!       : TwnsUiLabel.UiLabel;
        private readonly _inputUserNickname!            : TwnsUiTextInput.UiTextInput;

        private readonly _labelCoNameTitle!             : TwnsUiLabel.UiLabel;
        private readonly _inputCoName!                  : TwnsUiTextInput.UiTextInput;

        private readonly _labelMinGlobalRatingTitle!    : TwnsUiLabel.UiLabel;
        private readonly _inputMinGlobalRating!         : TwnsUiTextInput.UiTextInput;

        private readonly _labelMinMyRatingTitle!        : TwnsUiLabel.UiLabel;
        private readonly _inputMinMyRating!             : TwnsUiTextInput.UiTextInput;

        private readonly _btnHasFog!                    : TwnsUiButton.UiButton;
        private readonly _labelHasFog!                  : TwnsUiLabel.UiLabel;

        private readonly _btnIsRanked!                  : TwnsUiButton.UiButton;
        private readonly _labelIsRanked!                : TwnsUiLabel.UiLabel;

        private _hasFog     : boolean | null = null;
        private _isRanked   : boolean | null = null;

        protected _onOpening(): void {
            this._setUiListenerArray([
                { ui: this._btnClose,               callback: this.close },
                { ui: this._btnReset,               callback: this._onTouchedBtnReset },
                { ui: this._btnSearch,              callback: this._onTouchedBtnSearch },
                { ui: this._inputMinGlobalRating,   callback: this._onFocusOutInputMinGlobalRating, eventType: egret.Event.FOCUS_OUT },
                { ui: this._inputMinMyRating,       callback: this._onFocusOutInputMinMyRating,     eventType: egret.Event.FOCUS_OUT },
                { ui: this._btnHasFog,              callback: this._onTouchedBtnHasFog },
                { ui: this._btnIsRanked,            callback: this._onTouchedBtnIsRanked },
            ]);
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,    callback: this._onNotifyLanguageChanged },
            ]);
            this._setIsTouchMaskEnabled();
            this._setIsCloseOnTouchedMask();
        }
        protected async _updateOnOpenDataChanged(): Promise<void> {
            this._updateComponentsForLanguage();
        }
        protected _onClosing(): void {
            // nothing to do
        }

        private _onTouchedBtnReset(): void {
            RwProxy.reqReplayGetReplayIdArray(null);
            this.close();
        }

        private _onTouchedBtnSearch(): void {
            RwProxy.reqReplayGetReplayIdArray({
                replayId        : getNumber(this._inputReplayId.text),
                mapName         : this._inputMapName.text || null,
                userNickname    : this._inputUserNickname.text || null,
                minMyRating     : getNumber(this._inputMinMyRating.text),
                minGlobalRating : getNumber(this._inputMinGlobalRating.text),
                coName          : this._inputCoName.text || null,
                hasFog          : this._hasFog,
                isRankedMatch   : this._isRanked,
            });
            this.close();
        }

        private _onFocusOutInputMinGlobalRating(): void {
            const input     = this._inputMinGlobalRating;
            const maxRating = CommonConstants.ReplayMaxRating;
            if (Number(input.text) > maxRating) {
                input.text = "" + maxRating;
            }
        }

        private _onFocusOutInputMinMyRating(): void {
            const input     = this._inputMinMyRating;
            const maxRating = CommonConstants.ReplayMaxRating;
            if (Number(input.text) > maxRating) {
                input.text = "" + maxRating;
            }
        }

        private _onTouchedBtnHasFog(): void {
            const hasFog = this._hasFog;
            if (hasFog === true) {
                this._hasFog = false;
            } else if (hasFog === false) {
                this._hasFog = null;
            } else {
                this._hasFog = true;
            }
            this._updateLabelHasFog();
        }

        private _onTouchedBtnIsRanked(): void {
            const isRanked = this._isRanked;
            if (isRanked === true) {
                this._isRanked = false;
            } else if (isRanked === false) {
                this._isRanked = null;
            } else {
                this._isRanked = true;
            }
            this._updateLabelIsRanked();
        }

        private _onNotifyLanguageChanged(): void {
            this._updateComponentsForLanguage();
        }

        private _updateComponentsForLanguage(): void {
            this._labelTitle.text                   = Lang.getText(LangTextType.B0228);
            this._labelReplayIdTitle.text           = Lang.getText(LangTextType.B0235);
            this._labelMapNameTitle.text            = Lang.getText(LangTextType.B0225);
            this._labelUserNicknameTitle.text       = Lang.getText(LangTextType.B0393);
            this._labelCoNameTitle.text             = Lang.getText(LangTextType.B0394);
            this._labelMinMyRatingTitle.text        = Lang.getText(LangTextType.B0363);
            this._labelMinGlobalRatingTitle.text    = Lang.getText(LangTextType.B0364);
            this._labelDesc.text                    = Lang.getText(LangTextType.A0063);
            this._btnReset.label                    = Lang.getText(LangTextType.B0567);
            this._btnSearch.label                   = Lang.getText(LangTextType.B0228);
            this._btnHasFog.label                   = Lang.getText(LangTextType.B0020);
            this._btnIsRanked.label                 = Lang.getText(LangTextType.B0404);

            this._updateLabelHasFog();
            this._updateLabelIsRanked();
        }

        private _updateLabelHasFog(): void {
            const hasFog    = this._hasFog;
            const label     = this._labelHasFog;
            if (hasFog === true) {
                label.text = Lang.getText(LangTextType.B0012);
            } else if (hasFog === false) {
                label.text = Lang.getText(LangTextType.B0013);
            } else {
                label.text = `--`;
            }
        }

        private _updateLabelIsRanked(): void {
            const isRanked  = this._isRanked;
            const label     = this._labelIsRanked;
            if (isRanked === true) {
                label.text = Lang.getText(LangTextType.B0012);
            } else if (isRanked === false) {
                label.text = Lang.getText(LangTextType.B0013);
            } else {
                label.text = `--`;
            }
        }

        protected async _showOpenAnimation(): Promise<void> {
            Helpers.resetTween({
                obj         : this._imgMask,
                beginProps  : { alpha: 0 },
                endProps    : { alpha: 1 },
            });
            Helpers.resetTween({
                obj         : this._group,
                beginProps  : { alpha: 0, verticalCenter: 40 },
                endProps    : { alpha: 1, verticalCenter: 0 },
            });

            await Helpers.wait(CommonConstants.DefaultTweenTime);
        }
        protected async _showCloseAnimation(): Promise<void> {
            Helpers.resetTween({
                obj         : this._imgMask,
                beginProps  : { alpha: 1 },
                endProps    : { alpha: 0 },
            });
            Helpers.resetTween({
                obj         : this._group,
                beginProps  : { alpha: 1, verticalCenter: 0 },
                endProps    : { alpha: 0, verticalCenter: 40 },
            });

            await Helpers.wait(CommonConstants.DefaultTweenTime);
        }
    }

    function getNumber(text: string): number | null {
        const num = text ? Number(text) : null;
        return ((num == null) || (isNaN(num))) ? null : num;
    }
}

// export default TwnsRwSearchReplayPanel;
