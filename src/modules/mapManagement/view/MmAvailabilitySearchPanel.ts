
namespace TinyWars.MapManagement {
    import Types      = Utility.Types;
    import Lang       = Utility.Lang;
    import FloatText  = Utility.FloatText;
    import Notify     = Utility.Notify;
    import ProtoTypes = Utility.ProtoTypes;

    export class MmAvailabilitySearchPanel extends GameUi.UiPanel {
        protected _IS_EXCLUSIVE = false;
        protected _LAYER_TYPE   = Types.LayerType.Hud2;

        private static _instance: MmAvailabilitySearchPanel;

        private _btnClose         : GameUi.UiButton;
        private _btnReset         : GameUi.UiButton;
        private _btnSearch        : GameUi.UiButton;
        private _inputMapName     : GameUi.UiTextInput;
        private _inputDesigner    : GameUi.UiTextInput;
        private _inputPlayersCount: GameUi.UiTextInput;
        private _inputPlayedTimes : GameUi.UiTextInput;
        private _inputMinRating   : GameUi.UiTextInput;

        public static show(): void {
            if (!MmAvailabilitySearchPanel._instance) {
                MmAvailabilitySearchPanel._instance = new MmAvailabilitySearchPanel();
            }
            MmAvailabilitySearchPanel._instance.open();
        }
        public static hide(): void {
            if (MmAvailabilitySearchPanel._instance) {
                MmAvailabilitySearchPanel._instance.close();
            }
        }

        public constructor() {
            super();

            this._setAutoAdjustHeightEnabled();
            this._setTouchMaskEnabled();
            this.skinName = "resource/skins/mapManagement/MmAvailabilitySearchPanel.exml";
        }

        protected _onFirstOpened(): void {
            this._uiListeners = [
                { ui: this._btnClose,  callback: this._onTouchedBtnClose },
                { ui: this._btnReset,  callback: this._onTouchedBtnReset },
                { ui: this._btnSearch, callback: this._onTouchedBtnSearch },
            ];
        }

        protected _onOpened(): void {
            this._btnReset.enabled  = true;
            this._btnSearch.enabled = true;
        }

        private _onTouchedBtnClose(e: egret.TouchEvent): void {
            MmAvailabilitySearchPanel.hide();
        }

        private _onTouchedBtnReset(e: egret.TouchEvent): void {
            MmAvailabilityListPanel.getInstance().setMapFilters({});
            MmAvailabilitySearchPanel.hide();
        }

        private _onTouchedBtnSearch(e: egret.TouchEvent): void {
            MmAvailabilityListPanel.getInstance().setMapFilters({
                mapName     : this._inputMapName.text || null,
                mapDesigner : this._inputDesigner.text || null,
                playersCount: Number(this._inputPlayersCount.text) || null,
                playedTimes : Number(this._inputPlayedTimes.text) || null,
                minRating   : Number(this._inputMinRating.text) || null,
            });

            MmAvailabilitySearchPanel.hide();
        }
    }
}
