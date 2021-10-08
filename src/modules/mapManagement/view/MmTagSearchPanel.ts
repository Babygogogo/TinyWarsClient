
// import Types                from "../../tools/helpers/Types";
// import Lang                 from "../../tools/lang/Lang";
// import TwnsLangTextType     from "../../tools/lang/LangTextType";
// import TwnsNotifyType       from "../../tools/notify/NotifyType";
// import TwnsUiButton         from "../../tools/ui/UiButton";
// import TwnsUiLabel          from "../../tools/ui/UiLabel";
// import TwnsUiPanel          from "../../tools/ui/UiPanel";
// import TwnsUiTextInput      from "../../tools/ui/UiTextInput";
// import TwnsMmTagListPanel   from "./MmTagListPanel";

namespace TwnsMmTagSearchPanel {
    import LangTextType     = TwnsLangTextType.LangTextType;
    import NotifyType       = TwnsNotifyType.NotifyType;

    export class MmTagSearchPanel extends TwnsUiPanel.UiPanel<void> {
        protected _IS_EXCLUSIVE = false;
        protected _LAYER_TYPE   = Types.LayerType.Hud2;

        private static _instance: MmTagSearchPanel;

        private readonly _btnClose!                 : TwnsUiButton.UiButton;
        private readonly _btnReset!                 : TwnsUiButton.UiButton;
        private readonly _btnSearch!                : TwnsUiButton.UiButton;
        private readonly _labelName!                : TwnsUiLabel.UiLabel;
        private readonly _labelMapNameTitle!        : TwnsUiLabel.UiLabel;
        private readonly _labelDesignerTitle!       : TwnsUiLabel.UiLabel;
        private readonly _labelPlayersCountTitle!   : TwnsUiLabel.UiLabel;
        private readonly _labelPlayedTimesTitle!    : TwnsUiLabel.UiLabel;
        private readonly _labelMinRatingTitle!      : TwnsUiLabel.UiLabel;
        private readonly _labelDesc!                : TwnsUiLabel.UiLabel;
        private readonly _inputMapName!             : TwnsUiTextInput.UiTextInput;
        private readonly _inputDesigner!            : TwnsUiTextInput.UiTextInput;
        private readonly _inputPlayersCount!        : TwnsUiTextInput.UiTextInput;
        private readonly _inputPlayedTimes!         : TwnsUiTextInput.UiTextInput;
        private readonly _inputMinRating!           : TwnsUiTextInput.UiTextInput;

        public static show(): void {
            if (!MmTagSearchPanel._instance) {
                MmTagSearchPanel._instance = new MmTagSearchPanel();
            }
            MmTagSearchPanel._instance.open();
        }
        public static async hide(): Promise<void> {
            if (MmTagSearchPanel._instance) {
                await MmTagSearchPanel._instance.close();
            }
        }

        public constructor() {
            super();

            this._setIsTouchMaskEnabled();
            this.skinName = "resource/skins/mapManagement/MmTagSearchPanel.exml";
        }

        protected _onOpened(): void {
            this._setUiListenerArray([
                { ui: this._btnClose,  callback: this._onTouchedBtnClose },
                { ui: this._btnReset,  callback: this._onTouchedBtnReset },
                { ui: this._btnSearch, callback: this._onTouchedBtnSearch },
            ]);
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,    callback: this._onNotifyLanguageChanged },
            ]);

            this._updateComponentsForLanguage();
            this._btnReset.enabled  = true;
            this._btnSearch.enabled = true;
        }

        private _onTouchedBtnClose(): void {
            this.close();
        }

        private _onTouchedBtnReset(): void {
            TwnsMmTagListPanel.MmTagListPanel.getInstance().setMapFilters({});
            this.close();
        }

        private _onTouchedBtnSearch(): void {
            TwnsMmTagListPanel.MmTagListPanel.getInstance().setMapFilters({
                mapName     : this._inputMapName.text || null,
                mapDesigner : this._inputDesigner.text || null,
                playersCount: Number(this._inputPlayersCount.text) || null,
                playedTimes : Number(this._inputPlayedTimes.text) || null,
                minRating   : Number(this._inputMinRating.text) || null,
            });

            this.close();
        }

        private _onNotifyLanguageChanged(): void {
            this._updateComponentsForLanguage();
        }

        private _updateComponentsForLanguage(): void {
            this._labelName.text                = Lang.getText(LangTextType.B0234);
            this._labelMapNameTitle.text        = `${Lang.getText(LangTextType.B0225)}:`;
            this._labelDesignerTitle.text       = `${Lang.getText(LangTextType.B0251)}:`;
            this._labelPlayersCountTitle.text   = `${Lang.getText(LangTextType.B0229)}:`;
            this._labelPlayedTimesTitle.text    = `${Lang.getText(LangTextType.B0252)}:`;
            this._labelMinRatingTitle.text      = `${Lang.getText(LangTextType.B0253)}:`;
            this._labelDesc.text                = Lang.getText(LangTextType.A0063);
            this._btnClose.label                = Lang.getText(LangTextType.B0146);
            this._btnReset.label                = Lang.getText(LangTextType.B0233);
            this._btnSearch.label               = Lang.getText(LangTextType.B0228);
        }
    }
}

// export default TwnsMmTagSearchPanel;
