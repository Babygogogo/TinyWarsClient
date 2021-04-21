
namespace TinyWars.MultiFreeRoom {
    import Notify   = Utility.Notify;
    import Lang     = Utility.Lang;

    export class MfrCreateMapInfoPage extends GameUi.UiTabPage<void> {
        private readonly _zoomMap       : GameUi.UiZoomableMap;
        private readonly _uiMapInfo     : GameUi.UiMapInfo;
        private readonly _labelLoading  : GameUi.UiLabel;

        public constructor() {
            super();

            this.skinName = "resource/skins/multiFreeRoom/MfrCreateMapInfoPage.exml";
        }

        protected async _onOpened(): Promise<void> {
            this._setNotifyListenerArray([
                { type: Notify.Type.LanguageChanged,    callback: this._onNotifyLanguageChanged },
            ]);

            this.left   = 0;
            this.right  = 0;
            this.top    = 0;
            this.bottom = 0;

            const warData = MfrModel.Create.getInitialWarData();
            this._zoomMap.showMapByWarData(warData);
            this._uiMapInfo.setData({
                warData,
            });

            this._updateComponentsForLanguage();
        }

        private _onNotifyLanguageChanged(e: egret.Event): void {
            this._updateComponentsForLanguage();
        }

        private _updateComponentsForLanguage(): void {
            this._labelLoading.text = Lang.getText(Lang.Type.A0150);
        }
    }
}
