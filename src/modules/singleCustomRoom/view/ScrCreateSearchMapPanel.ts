
namespace TinyWars.SingleCustomRoom {
    import Types      = Utility.Types;
    import Lang       = Utility.Lang;
    import FloatText  = Utility.FloatText;
    import Notify     = Utility.Notify;
    import ProtoTypes = Utility.ProtoTypes;

    export class ScrCreateSearchMapPanel extends GameUi.UiPanel {
        protected _IS_EXCLUSIVE = false;
        protected _LAYER_TYPE   = Types.LayerType.Hud2;

        private static _instance: ScrCreateSearchMapPanel;

        private _btnClose               : GameUi.UiButton;
        private _btnReset               : GameUi.UiButton;
        private _btnSearch              : GameUi.UiButton;
        private _labelName              : GameUi.UiLabel;
        private _labelMapNameTitle      : GameUi.UiLabel;
        private _labelDesignerTitle     : GameUi.UiLabel;
        private _labelPlayersCountTitle : GameUi.UiLabel;
        private _labelPlayedTimesTitle  : GameUi.UiLabel;
        private _labelMinRatingTitle    : GameUi.UiLabel;
        private _labelDesc              : GameUi.UiLabel;
        private _inputMapName           : GameUi.UiTextInput;
        private _inputDesigner          : GameUi.UiTextInput;
        private _inputPlayersCount      : GameUi.UiTextInput;
        private _inputPlayedTimes       : GameUi.UiTextInput;
        private _inputMinRating         : GameUi.UiTextInput;

        public static show(): void {
            if (!ScrCreateSearchMapPanel._instance) {
                ScrCreateSearchMapPanel._instance = new ScrCreateSearchMapPanel();
            }
            ScrCreateSearchMapPanel._instance.open();
        }
        public static hide(): void {
            if (ScrCreateSearchMapPanel._instance) {
                ScrCreateSearchMapPanel._instance.close();
            }
        }

        public constructor() {
            super();

            this._setAutoAdjustHeightEnabled();
            this._setTouchMaskEnabled();
            this.skinName = "resource/skins/singleCustomRoom/ScrCreateSearchMapPanel.exml";
        }

        protected _onFirstOpened(): void {
            this._uiListeners = [
                { ui: this._btnClose,  callback: this._onTouchedBtnClose },
                { ui: this._btnReset,  callback: this._onTouchedBtnReset },
                { ui: this._btnSearch, callback: this._onTouchedBtnSearch },
            ];
            this._notifyListeners = [
                { type: Notify.Type.LanguageChanged,    callback: this._onNotifyLanguageChanged },
            ];
        }

        protected _onOpened(): void {
            this._updateComponentsForLanguage();
            this._btnReset.enabled  = true;
            this._btnSearch.enabled = true;
        }

        private _onTouchedBtnClose(e: egret.TouchEvent): void {
            ScrCreateSearchMapPanel.hide();
        }

        private _onTouchedBtnReset(e: egret.TouchEvent): void {
            ScrCreateMapListPanel.getInstance().setMapFilters({});
            this.close();
        }

        private _onTouchedBtnSearch(e: egret.TouchEvent): void {
            ScrCreateMapListPanel.getInstance().setMapFilters({
                mapName     : this._inputMapName.text || null,
                mapDesigner : this._inputDesigner.text || null,
                playersCount: Number(this._inputPlayersCount.text) || null,
                playedTimes : Number(this._inputPlayedTimes.text) || null,
                minRating   : Number(this._inputMinRating.text) || null,
            });

            ScrCreateSearchMapPanel.hide();
        }

        private _onNotifyLanguageChanged(e: egret.Event): void {
            this._updateComponentsForLanguage();
        }

        private _updateComponentsForLanguage(): void {
            this._labelName.text                = Lang.getText(Lang.Type.B0234);
            this._labelMapNameTitle.text        = `${Lang.getText(Lang.Type.B0225)}:`;
            this._labelDesignerTitle.text       = `${Lang.getText(Lang.Type.B0251)}:`;
            this._labelPlayersCountTitle.text   = `${Lang.getText(Lang.Type.B0229)}:`;
            this._labelPlayedTimesTitle.text    = `${Lang.getText(Lang.Type.B0252)}:`;
            this._labelMinRatingTitle.text      = `${Lang.getText(Lang.Type.B0253)}:`;
            this._labelDesc.text                = Lang.getText(Lang.Type.A0063);
            this._btnClose.label                = Lang.getText(Lang.Type.B0146);
            this._btnReset.label                = Lang.getText(Lang.Type.B0233);
            this._btnSearch.label               = Lang.getText(Lang.Type.B0228);
        }
    }
}
