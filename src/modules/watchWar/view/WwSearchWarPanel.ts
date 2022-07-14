
// import Helpers                      from "../../tools/helpers/Helpers";
// import Types                        from "../../tools/helpers/Types";
// import Lang                         from "../../tools/lang/Lang";
// import TwnsLangTextType             from "../../tools/lang/LangTextType";
// import Twns.Notify               from "../../tools/notify/NotifyType";
// import ProtoTypes                   from "../../tools/proto/ProtoTypes";
// import TwnsUiButton                 from "../../tools/ui/UiButton";
// import TwnsUiImage                  from "../../tools/ui/UiImage";
// import TwnsUiLabel                  from "../../tools/ui/UiLabel";
// import TwnsUiPanel                  from "../../tools/ui/UiPanel";
// import TwnsUiTextInput              from "../../tools/ui/UiTextInput";
// import TwnsMcrCreateMapListPanel    from "./McrCreateMapListPanel";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.WatchWar {
    import LangTextType             = Twns.Lang.LangTextType;
    import NotifyType               = Twns.Notify.NotifyType;

    export type OpenDataForWwSearchWarPanel = void;
    export class WwSearchWarPanel extends TwnsUiPanel.UiPanel<OpenDataForWwSearchWarPanel> {
        private readonly _imgMask!                  : TwnsUiImage.UiImage;

        private readonly _group!                    : eui.Group;
        private readonly _btnClose!                 : TwnsUiButton.UiButton;
        private readonly _btnReset!                 : TwnsUiButton.UiButton;
        private readonly _btnSearch!                : TwnsUiButton.UiButton;
        private readonly _labelName!                : TwnsUiLabel.UiLabel;
        private readonly _labelDesc!                : TwnsUiLabel.UiLabel;

        private readonly _labelMapNameTitle!        : TwnsUiLabel.UiLabel;
        private readonly _inputMapName!             : TwnsUiTextInput.UiTextInput;

        private readonly _labelPlayerNameTitle!     : TwnsUiLabel.UiLabel;
        private readonly _inputPlayerName!          : TwnsUiTextInput.UiTextInput;

        private readonly _labelPlayersCountTitle!   : TwnsUiLabel.UiLabel;
        private readonly _inputPlayersCount!        : TwnsUiTextInput.UiTextInput;

        private readonly _labelCoNameTitle!         : TwnsUiLabel.UiLabel;
        private readonly _inputCoName!              : TwnsUiTextInput.UiTextInput;

        private readonly _labelWarIdTitle!          : TwnsUiLabel.UiLabel;
        private readonly _inputWarId!               : TwnsUiTextInput.UiTextInput;

        protected _onOpening(): void {
            this._setUiListenerArray([
                { ui: this._btnClose,   callback: this.close },
                { ui: this._btnReset,   callback: this._onTouchedBtnReset },
                { ui: this._btnSearch,  callback: this._onTouchedBtnSearch },
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
            Twns.PanelHelpers.open(Twns.PanelHelpers.PanelDict.WwMakeRequestWarsPanel, {});
            this.close();
        }

        private _onTouchedBtnSearch(): void {
            Twns.PanelHelpers.open(Twns.PanelHelpers.PanelDict.WwMakeRequestWarsPanel, {
                mapName                 : this._inputMapName.text.trim() || null,
                userNickname            : this._inputPlayerName.text.trim() || null,
                coName                  : this._inputCoName.text.trim() || null,
                playersCountUnneutral   : Number(this._inputPlayersCount.text) || null,
                warId                   : Number(this._inputWarId.text) || null,
            });

            this.close();
        }

        private _onNotifyLanguageChanged(): void {
            this._updateComponentsForLanguage();
        }

        private _updateComponentsForLanguage(): void {
            this._labelName.text                = Lang.getText(LangTextType.B0228);
            this._labelMapNameTitle.text        = Lang.getText(LangTextType.B0225);
            this._labelPlayerNameTitle.text     = Lang.getText(LangTextType.B0393);
            this._labelPlayersCountTitle.text   = Lang.getText(LangTextType.B0229);
            this._labelCoNameTitle.text         = Lang.getText(LangTextType.B0394);
            this._labelWarIdTitle.text          = Lang.getText(LangTextType.B0226);
            this._labelDesc.text                = Lang.getText(LangTextType.A0063);
            this._btnReset.label                = Lang.getText(LangTextType.B0567);
            this._btnSearch.label               = Lang.getText(LangTextType.B0228);
        }

        protected async _showOpenAnimation(): Promise<void> {
            Twns.Helpers.resetTween({
                obj         : this._imgMask,
                beginProps  : { alpha: 0 },
                endProps    : { alpha: 1 },
            });
            Twns.Helpers.resetTween({
                obj         : this._group,
                beginProps  : { alpha: 0, verticalCenter: 40 },
                endProps    : { alpha: 1, verticalCenter: 0 },
            });

            await Twns.Helpers.wait(Twns.CommonConstants.DefaultTweenTime);
        }
        protected async _showCloseAnimation(): Promise<void> {
            Twns.Helpers.resetTween({
                obj         : this._imgMask,
                beginProps  : { alpha: 1 },
                endProps    : { alpha: 0 },
            });
            Twns.Helpers.resetTween({
                obj         : this._group,
                beginProps  : { alpha: 1, verticalCenter: 0 },
                endProps    : { alpha: 0, verticalCenter: 40 },
            });

            await Twns.Helpers.wait(Twns.CommonConstants.DefaultTweenTime);
        }
    }
}

// export default TwnsWwSearchWarPanel;
