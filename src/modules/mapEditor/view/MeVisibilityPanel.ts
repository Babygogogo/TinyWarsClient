
namespace TinyWars.MapEditor {
    import Lang     = Utility.Lang;
    import Notify   = Utility.Notify;
    import Types    = Utility.Types;

    export class MeVisibilityPanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Hud3;
        protected readonly _IS_EXCLUSIVE = false;

        private static _instance: MeVisibilityPanel;

        private _groupUnit          : eui.Group;
        private _labelUnit          : GameUi.UiLabel;
        private _imgUnit            : GameUi.UiImage;
        private _groupTileObject    : eui.Group;
        private _imgTileObject      : GameUi.UiImage;
        private _labelTileObject    : GameUi.UiLabel;
        private _groupTileBase      : eui.Group;
        private _imgTileBase        : GameUi.UiImage;
        private _labelTileBase      : GameUi.UiLabel;

        private _war : MeWar;

        public static show(): void {
            if (!MeVisibilityPanel._instance) {
                MeVisibilityPanel._instance = new MeVisibilityPanel();
            }
            MeVisibilityPanel._instance.open();
        }

        public static hide(): void {
            if (MeVisibilityPanel._instance) {
                MeVisibilityPanel._instance.close();
            }
        }

        public constructor() {
            super();

            this._setIsAutoAdjustHeight();
            this._setIsTouchMaskEnabled();
            this._setIsCloseOnTouchedMask();
            this.skinName = "resource/skins/mapEditor/MeVisibilityPanel.exml";
        }

        protected _onOpened(): void {
            this._setNotifyListenerArray([
                { type: Notify.Type.LanguageChanged, callback: this._onNotifyLanguageChanged },
            ]);
            this._setUiListenerArray([
                { ui: this._groupTileBase,      callback: this._onTouchedGroupTileBase, },
                { ui: this._groupTileObject,    callback: this._onTouchedGroupTileObject, },
                { ui: this._groupUnit,          callback: this._onTouchedGroupUnit },
            ]);

            this._updateComponentsForLanguage();

            this._war = MeManager.getWar();
            this._updateGroupUnit();
            this._updateGroupTileBase();
            this._updateGroupTileObject();
        }

        private _onTouchedGroupTileBase(e: egret.TouchEvent): void {
            const view = this._war.getField().getView();
            view.setTileBasesVisible(!view.getTileBasesVisible());
            this._updateGroupTileBase();
        }

        private _onTouchedGroupTileObject(e: egret.TouchEvent): void {
            const view = this._war.getField().getView();
            view.setTileObjectsVisible(!view.getTileObjectsVisible());
            this._updateGroupTileObject();
        }

        private _onTouchedGroupUnit(e: egret.TouchEvent): void {
            const view = this._war.getField().getView();
            view.setUnitsVisible(!view.getUnitsVisible());
            this._updateGroupUnit();
        }

        private _onNotifyLanguageChanged(e: egret.Event): void {
            this._updateComponentsForLanguage();
        }

        private _updateComponentsForLanguage(): void {
            this._labelTileBase.text        = Lang.getText(Lang.Type.B0302);
            this._labelTileObject.text      = Lang.getText(Lang.Type.B0303);
            this._labelUnit.text            = Lang.getText(Lang.Type.B0304);
        }

        private _updateGroupUnit(): void {
            this._imgUnit.visible = this._war.getField().getView().getUnitsVisible();
        }
        private _updateGroupTileBase(): void {
            this._imgTileBase.visible = this._war.getField().getView().getTileBasesVisible();
        }
        public _updateGroupTileObject(): void {
            this._imgTileObject.visible = this._war.getField().getView().getTileObjectsVisible();
        }
    }
}
