
// import Helpers                      from "../../tools/helpers/Helpers";
// import Types                        from "../../tools/helpers/Types";
// import Lang                         from "../../tools/lang/Lang";
// import TwnsLangTextType             from "../../tools/lang/LangTextType";
// import TwnsNotifyType               from "../../tools/notify/NotifyType";
// import ProtoTypes                   from "../../tools/proto/ProtoTypes";
// import TwnsUiButton                 from "../../tools/ui/UiButton";
// import TwnsUiImage                  from "../../tools/ui/UiImage";
// import TwnsUiLabel                  from "../../tools/ui/UiLabel";
// import TwnsUiPanel                  from "../../tools/ui/UiPanel";
// import TwnsUiTextInput              from "../../tools/ui/UiTextInput";
// import TwnsMcrCreateMapListPanel    from "./McrCreateMapListPanel";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace TwnsWwSearchWarPanel {
    import LangTextType             = TwnsLangTextType.LangTextType;
    import NotifyType               = TwnsNotifyType.NotifyType;

    export class WwSearchWarPanel extends TwnsUiPanel.UiPanel<void> {
        protected _IS_EXCLUSIVE = false;
        protected _LAYER_TYPE   = Types.LayerType.Hud2;

        private static _instance: WwSearchWarPanel;

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

        public static show(): void {
            if (!WwSearchWarPanel._instance) {
                WwSearchWarPanel._instance = new WwSearchWarPanel();
            }
            WwSearchWarPanel._instance.open();
        }
        public static async hide(): Promise<void> {
            if (WwSearchWarPanel._instance) {
                await WwSearchWarPanel._instance.close();
            }
        }

        private constructor() {
            super();

            this._setIsTouchMaskEnabled();
            this._setIsCloseOnTouchedMask();
            this.skinName = "resource/skins/watchWar/WwSearchWarPanel.exml";
        }

        protected _onOpened(): void {
            this._setUiListenerArray([
                { ui: this._btnClose,   callback: this.close },
                { ui: this._btnReset,   callback: this._onTouchedBtnReset },
                { ui: this._btnSearch,  callback: this._onTouchedBtnSearch },
            ]);
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,    callback: this._onNotifyLanguageChanged },
            ]);

            this._showOpenAnimation();
            this._updateComponentsForLanguage();
        }

        protected async _onClosed(): Promise<void> {
            await this._showCloseAnimation();
        }

        private _onTouchedBtnReset(): void {
            TwnsWwMakeRequestWarsPanel.WwMakeRequestWarsPanel.getInstance().setWarFilter({});
            this.close();
        }

        private _onTouchedBtnSearch(): void {
            TwnsWwMakeRequestWarsPanel.WwMakeRequestWarsPanel.getInstance().setWarFilter({
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

        private _showOpenAnimation(): void {
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
        }
        private _showCloseAnimation(): Promise<void> {
            return new Promise<void>(resolve => {
                Helpers.resetTween({
                    obj         : this._imgMask,
                    beginProps  : { alpha: 1 },
                    endProps    : { alpha: 0 },
                });
                Helpers.resetTween({
                    obj         : this._group,
                    beginProps  : { alpha: 1, verticalCenter: 0 },
                    endProps    : { alpha: 0, verticalCenter: 40 },
                    callback    : resolve,
                });
            });
        }
    }
}

// export default TwnsWwSearchWarPanel;
