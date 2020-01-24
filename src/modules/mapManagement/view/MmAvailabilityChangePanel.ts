
namespace TinyWars.MapManagement {
    import FloatText    = Utility.FloatText;
    import Lang         = Utility.Lang;
    import Types        = Utility.Types;
    import NotifyType   = Utility.Notify.Type;
    import WarMapModel  = WarMap.WarMapModel;
    import WarMapProxy  = WarMap.WarMapProxy;

    export class MmAvailabilityChangePanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Hud0;
        protected readonly _IS_EXCLUSIVE = false;

        private _groupMcw   : eui.Group;
        private _labelMcw   : GameUi.UiLabel;
        private _imgMcw     : GameUi.UiImage;

        private _groupScw   : eui.Group;
        private _labelScw   : GameUi.UiLabel;
        private _imgScw     : GameUi.UiImage;

        private _btnCancel   : GameUi.UiButton;
        private _btnConfirm : GameUi.UiButton;

        private static _instance: MmAvailabilityChangePanel;
        private _mapFileName    : string;

        public static show(mapFileName: string): void {
            if (!MmAvailabilityChangePanel._instance) {
                MmAvailabilityChangePanel._instance = new MmAvailabilityChangePanel();
            }
            MmAvailabilityChangePanel._instance._mapFileName = mapFileName;
            MmAvailabilityChangePanel._instance.open();
        }

        public static hide(): void {
            if (MmAvailabilityChangePanel._instance) {
                MmAvailabilityChangePanel._instance.close();
            }
        }

        private constructor() {
            super();

            this._setAutoAdjustHeightEnabled();
            this.skinName = "resource/skins/mapManagement/MmAvailabilityChangePanel.exml";
        }

        protected _onFirstOpened(): void {
            this._notifyListeners = [
                { type: NotifyType.LanguageChanged, callback: this._onNotifyLanguageChanged },
            ];
            this._uiListeners = [
                { ui: this._btnConfirm,     callback: this._onTouchedBtnConfirm },
                { ui: this._btnCancel,      callback: this._onTouchedBtnCancel },
                { ui: this._groupMcw,       callback: this._onTouchedGroupMcw },
                { ui: this._groupScw,       callback: this._onTouchedGroupScw },
            ];
        }

        protected _onOpened(): void {
            this._updateViewOnLanguageChanged();

            const mapExtraData       = WarMapModel.getExtraData(this._mapFileName);
            this._imgMcw.visible    = !!mapExtraData.canMcw;
            this._imgScw.visible    = !!mapExtraData.canScw;
        }

        private _onNotifyLanguageChanged(e: egret.Event): void {
            this._updateViewOnLanguageChanged();
        }

        private _onTouchedBtnConfirm(e: egret.TouchEvent): void {
            WarMapProxy.reqMmChangeAvailability(this._mapFileName, {
                canMcw : this._imgMcw.visible,
                canWr  : false,
                canScw : this._imgScw.visible,
            });
            MmAvailabilityChangePanel.hide();
        }

        private _onTouchedBtnCancel(e: egret.TouchEvent): void {
            MmAvailabilityChangePanel.hide();
        }

        private _onTouchedGroupMcw(e: egret.TouchEvent): void {
            this._imgMcw.visible = !this._imgMcw.visible;
        }

        private _onTouchedGroupScw(e: egret.TouchEvent): void {
            this._imgScw.visible = !this._imgScw.visible;
        }

        private _updateViewOnLanguageChanged(): void {
            // TODO
        }
    }
}
