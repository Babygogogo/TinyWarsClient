
namespace TinyWars.WarMap {
    import Types      = Utility.Types;
    import Lang       = Utility.Lang;
    import FloatText  = Utility.FloatText;
    import Notify     = Utility.Notify;
    import ProtoTypes = Utility.ProtoTypes;

    export class WarMapSearchPanel extends GameUi.UiPanel {
        protected _IS_EXCLUSIVE = false;
        protected _LAYER_TYPE   = Types.LayerType.Hud2;

        private static _instance: WarMapSearchPanel;

        private _btnClose         : GameUi.UiButton;
        private _btnReset         : GameUi.UiButton;
        private _btnSearch        : GameUi.UiButton;
        private _inputMapName     : GameUi.UiTextInput;
        private _inputDesigner    : GameUi.UiTextInput;
        private _inputPlayersCount: GameUi.UiTextInput;
        private _inputPlayedTimes : GameUi.UiTextInput;
        private _inputMinRating   : GameUi.UiTextInput;

        public static show(): void {
            if (!WarMapSearchPanel._instance) {
                WarMapSearchPanel._instance = new WarMapSearchPanel();
            }
            WarMapSearchPanel._instance.open();
        }
        public static hide(): void {
            if (WarMapSearchPanel._instance) {
                WarMapSearchPanel._instance.close();
            }
        }

        public constructor() {
            super();

            this._setAutoAdjustHeightEnabled();
            this._setTouchMaskEnabled();
            this.skinName = "resource/skins/warMap/WarMapSearchPanel.exml";
        }

        protected _onFirstOpened(): void {
            this._uiListeners = [
                { ui: this._btnClose,  callback: this._onTouchedBtnClose },
                { ui: this._btnReset,  callback: this._onTouchedBtnReset },
                { ui: this._btnSearch, callback: this._onTouchedBtnSearch },
            ];
            this._notifyListeners = [
                { type: Notify.Type.SGetNewestMapInfos, callback: this._onNotifySGetNewestMapInfos },
            ];
        }

        protected _onOpened(): void {
            this._btnReset.enabled  = true;
            this._btnSearch.enabled = true;
        }

        private _onTouchedBtnClose(e: egret.TouchEvent): void {
            WarMapSearchPanel.hide();
        }

        private _onTouchedBtnReset(e: egret.TouchEvent): void {
            WarMapProxy.reqGetNewestMapInfos();
            WarMapSearchPanel.hide();
        }

        private _onTouchedBtnSearch(e: egret.TouchEvent): void {
            FloatText.show(Lang.getText(Lang.Type.A0011));
            this._btnReset.enabled  = false;
            this._btnSearch.enabled = false;
            egret.setTimeout(() => {
                this._btnReset.enabled  = true;
                this._btnSearch.enabled = true;
            }, this, 5000);

            const mapName      = this._inputMapName.text;
            const mapDesigner  = this._inputDesigner.text;
            const playersCount = Number(this._inputPlayersCount.text);
            const playedTimes  = Number(this._inputPlayedTimes.text);
            const minRating    = Number(this._inputMinRating.text);
            WarMapProxy.reqGetNewestMapInfos({
                mapName         : mapName.length                                ? mapName       : undefined,
                mapDesigner     : mapDesigner.length                            ? mapDesigner   : undefined,
                playersCount    : (!isNaN(playersCount)) && (playersCount != 0) ? playersCount  : undefined,
                minPlayedTimes  : (!isNaN(playedTimes))  && (playedTimes != 0)  ? playedTimes   : undefined,
                minRating       : (!isNaN(minRating))    && (minRating != 0)    ? minRating     : undefined,
            });
        }

        private _onNotifySGetNewestMapInfos(e: egret.Event): void {
            const data = e.data as ProtoTypes.IS_GetNewestMapDynamicInfos;
            if ((!data.mapInfos) || (data.mapInfos.length <= 0)) {
                FloatText.show(Lang.getText(Lang.Type.A0010));
            } else {
                FloatText.show(Lang.getText(Lang.Type.A0012));
                WarMapSearchPanel.hide();
            }
        }
    }
}
