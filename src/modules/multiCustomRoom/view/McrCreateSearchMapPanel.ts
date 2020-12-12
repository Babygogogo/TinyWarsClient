
namespace TinyWars.MultiCustomRoom {
    import Types        = Utility.Types;
    import Lang         = Utility.Lang;
    import Notify       = Utility.Notify;
    import ProtoTypes   = Utility.ProtoTypes;

    export class McrCreateSearchMapPanel extends GameUi.UiPanel {
        protected _IS_EXCLUSIVE = false;
        protected _LAYER_TYPE   = Types.LayerType.Hud2;

        private static _instance: McrCreateSearchMapPanel;

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

        private _groupTagFog    : eui.Group;
        private _btnTagFog      : GameUi.UiButton;
        private _labelTagFog    : GameUi.UiLabel;

        private _mapTag         : ProtoTypes.Map.IDataForMapTag = {};

        public static show(): void {
            if (!McrCreateSearchMapPanel._instance) {
                McrCreateSearchMapPanel._instance = new McrCreateSearchMapPanel();
            }
            McrCreateSearchMapPanel._instance.open();
        }
        public static hide(): void {
            if (McrCreateSearchMapPanel._instance) {
                McrCreateSearchMapPanel._instance.close();
            }
        }

        public constructor() {
            super();

            this._setAutoAdjustHeightEnabled();
            this._setTouchMaskEnabled();
            this.skinName = "resource/skins/multiCustomRoom/McrCreateSearchMapPanel.exml";
        }

        protected _onFirstOpened(): void {
            this._uiListeners = [
                { ui: this._btnClose,   callback: this._onTouchedBtnClose },
                { ui: this._btnReset,   callback: this._onTouchedBtnReset },
                { ui: this._btnSearch,  callback: this._onTouchedBtnSearch },
                { ui: this._btnTagFog,  callback: this._onTouchedBtnTagFog },
            ];
            this._notifyListeners = [
                { type: Notify.Type.LanguageChanged,    callback: this._onNotifyLanguageChanged },
            ];
        }

        protected _onOpened(): void {
            this._updateComponentsForLanguage();
        }

        private _onTouchedBtnClose(e: egret.TouchEvent): void {
            McrCreateSearchMapPanel.hide();
        }

        private _onTouchedBtnReset(e: egret.TouchEvent): void {
            McrCreateMapListPanel.getInstance().setMapFilters({});
            McrCreateSearchMapPanel.hide();
        }

        private _onTouchedBtnSearch(e: egret.TouchEvent): void {
            McrCreateMapListPanel.getInstance().setMapFilters({
                mapName     : this._inputMapName.text || null,
                mapDesigner : this._inputDesigner.text || null,
                playersCount: Number(this._inputPlayersCount.text) || null,
                playedTimes : Number(this._inputPlayedTimes.text) || null,
                minRating   : Number(this._inputMinRating.text) || null,
                mapTag      : this._mapTag,
            });

            McrCreateSearchMapPanel.hide();
        }

        private _onTouchedBtnTagFog(e: egret.TouchEvent): void {
            const mapTag = this._mapTag;
            const hasFog = mapTag.fog;
            if (hasFog == true) {
                mapTag.fog = false;
            } else if (hasFog == false) {
                mapTag.fog = null;
            } else {
                mapTag.fog = true;
            }
            this._updateLabelTagFog();
        }

        private _onNotifyLanguageChanged(e: egret.Event): void {
            this._updateComponentsForLanguage();
        }

        private _updateComponentsForLanguage(): void {
            this._labelName.text                = Lang.getText(Lang.Type.B0447);
            this._labelMapNameTitle.text        = `${Lang.getText(Lang.Type.B0225)}:`;
            this._labelDesignerTitle.text       = `${Lang.getText(Lang.Type.B0251)}:`;
            this._labelPlayersCountTitle.text   = `${Lang.getText(Lang.Type.B0229)}:`;
            this._labelPlayedTimesTitle.text    = `${Lang.getText(Lang.Type.B0252)}:`;
            this._labelMinRatingTitle.text      = `${Lang.getText(Lang.Type.B0253)}:`;
            this._labelDesc.text                = Lang.getText(Lang.Type.A0063);
            this._btnClose.label                = Lang.getText(Lang.Type.B0146);
            this._btnReset.label                = Lang.getText(Lang.Type.B0233);
            this._btnSearch.label               = Lang.getText(Lang.Type.B0228);
            this._btnTagFog.label               = Lang.getText(Lang.Type.B0438);
            this._updateLabelTagFog();
        }

        private _updateLabelTagFog(): void {
            const hasFog    = this._mapTag.fog;
            const label     = this._labelTagFog;
            if (hasFog == true) {
                label.text = Lang.getText(Lang.Type.B0012);
            } else if (hasFog == false) {
                label.text = Lang.getText(Lang.Type.B0013);
            } else {
                label.text = Lang.getText(Lang.Type.B0446);
            }
        }
    }
}
