
namespace TinyWars.MapEditor {
    import FloatText        = Utility.FloatText;
    import Lang             = Utility.Lang;
    import ProtoTypes       = Utility.ProtoTypes;
    import Notify           = Utility.Notify;
    import Types            = Utility.Types;
    import DrawerMode       = Types.MapEditorDrawerMode;

    export class MeTopPanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Hud0;
        protected readonly _IS_EXCLUSIVE = false;

        private static _instance: MeTopPanel;

        private _groupMode          : eui.Group;
        private _labelModeTitle     : GameUi.UiLabel;
        private _labelMode          : GameUi.UiLabel;
        private _conUnitView        : eui.Group;
        private _conTileView        : eui.Group;

        private _btnModePreview         : GameUi.UiButton;
        private _btnModeDrawTileBase    : GameUi.UiButton;
        private _btnModeDrawTileObject  : GameUi.UiButton;
        private _btnModeDrawUnit        : GameUi.UiButton;
        private _btnModeDeleteTileObject: GameUi.UiButton;
        private _btnModeDeleteUnit      : GameUi.UiButton;
        private _btnMenu                : GameUi.UiButton;

        private _unitView   = new MeUnitView();
        private _tileView   = new MeTileSimpleView();

        private _war    : MeWar;
        private _drawer : MeDrawer;

        public static show(): void {
            if (!MeTopPanel._instance) {
                MeTopPanel._instance = new MeTopPanel();
            }
            MeTopPanel._instance.open();
        }

        public static hide(): void {
            if (MeTopPanel._instance) {
                MeTopPanel._instance.close();
            }
        }

        private constructor() {
            super();

            this.skinName = "resource/skins/mapEditor/MeTopPanel.exml";
        }

        protected _onFirstOpened(): void {
            this._notifyListeners = [
                { type: Notify.Type.LanguageChanged,                callback: this._onNotifyLanguageChanged },
                { type: Notify.Type.TileAnimationTick,              callback: this._onNotifyTileAnimationTick },
                { type: Notify.Type.UnitAnimationTick,              callback: this._onNotifyUnitAnimationTick },
                { type: Notify.Type.MeDrawerModeChanged,            callback: this._onNotifyMeDrawerModeChanged },
                { type: Notify.Type.BwTurnPhaseCodeChanged,         callback: this._onNotifyBwTurnPhaseCodeChanged },
                { type: Notify.Type.BwPlayerFundChanged,            callback: this._onNotifyBwPlayerFundChanged },
                { type: Notify.Type.BwPlayerIndexInTurnChanged,     callback: this._onNotifyBwPlayerIndexInTurnChanged },
                { type: Notify.Type.BwCoEnergyChanged,              callback: this._onNotifyBwCoEnergyChanged },
                { type: Notify.Type.BwCoUsingSkillTypeChanged,      callback: this._onNotifyBwCoUsingSkillChanged },
                { type: Notify.Type.BwActionPlannerStateChanged,    callback: this._onNotifyBwActionPlannerStateChanged },
            ];
            this._uiListeners = [
                { ui: this._btnModePreview,             callback: this._onTouchedBtnModePreview },
                { ui: this._btnModeDrawTileBase,        callback: this._onTouchedBtnModeDrawTileBase },
                { ui: this._btnModeDrawTileObject,      callback: this._onTouchedBtnModeDrawTileObject },
                { ui: this._btnModeDrawUnit,            callback: this._onTouchedBtnModeDrawUnit },
                { ui: this._btnModeDeleteTileObject,    callback: this._onTouchedBtnModeDeleteTileObject },
                { ui: this._btnModeDeleteUnit,          callback: this._onTouchedBtnModeDeleteUnit },
                { ui: this._btnMenu,                    callback: this._onTouchedBtnMenu, },
            ];
            this._conTileView.addChild(this._tileView.getImgBase());
            this._conTileView.addChild(this._tileView.getImgObject());
            this._conUnitView.addChild(this._unitView);
        }

        protected _onOpened(): void {
            this._war       = MeManager.getWar();
            this._drawer    = this._war.getDrawer();
            this._initTileView();
            this._initUnitView();

            this._updateView();
        }

        protected _onClosed(): void {
            delete this._war;
            delete this._drawer;
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Callbacks.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _onNotifyLanguageChanged(e: egret.Event): void  {
            this._updateComponentsForLanguage();
        }
        private _onNotifyTileAnimationTick(e: egret.Event): void {
            this._tileView.updateOnAnimationTick();
        }
        private _onNotifyUnitAnimationTick(e: egret.Event): void {
            this._unitView.tickStateAnimationFrame();
            this._unitView.tickUnitAnimationFrame();
        }
        private _onNotifyMeDrawerModeChanged(e: egret.Event): void {
            this._updateGroupMode();
        }
        private _onNotifyBwTurnPhaseCodeChanged(e: egret.Event): void {
            this._updateBtnModePreview();
            this._updateBtnDrawTileBase();
            this._updateBtnDeleteUnit();
            this._updateBtnDeleteTileObject();
        }
        private _onNotifyBwPlayerFundChanged(e: egret.Event): void {
            this._updateBtnModeDrawUnit();
        }
        private _onNotifyBwPlayerIndexInTurnChanged(e: egret.Event): void {
            this._updateView();
        }
        private _onNotifyBwCoEnergyChanged(e: egret.Event): void {
            this._updateBtnModeDrawTileObject();
        }
        private _onNotifyBwCoUsingSkillChanged(e: egret.Event): void {
            this._updateBtnModeDrawTileObject();
        }
        private _onNotifyBwActionPlannerStateChanged(e: egret.Event): void {
            this._updateBtnModePreview();
            this._updateBtnDeleteTileObject();
        }

        private _onTouchedBtnModePreview(e: egret.TouchEvent): void {
            this._drawer.setModePreview();
        }
        private _onTouchedBtnModeDrawTileBase(e: egret.TouchEvent): void {
            MeChooseTileBasePanel.show();
        }
        private _onTouchedBtnModeDrawTileObject(e: egret.TouchEvent): void {
            MeChooseTileObjectPanel.show();
        }
        private _onTouchedBtnModeDrawUnit(e: egret.TouchEvent): void {
            MeChooseUnitPanel.show();
        }
        private _onTouchedBtnModeDeleteTileObject(e: egret.TouchEvent): void {
            this._drawer.setModeDeleteTileObject();
        }
        private _onTouchedBtnModeDeleteUnit(e: egret.TouchEvent): void {
            this._drawer.setModeDeleteUnit();
        }

        private _onTouchedBtnMenu(e: egret.TouchEvent): void {
            MeWarMenuPanel.show();
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Functions for views.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _updateView(): void {
            this._updateComponentsForLanguage();

            this._updateGroupMode();
            this._updateBtnModePreview();
            this._updateBtnModeDrawUnit();
            this._updateBtnModeDrawTileObject();
            this._updateBtnDrawTileBase();
            this._updateBtnDeleteUnit();
            this._updateBtnDeleteTileObject();
            this._updateBtnMenu();
        }

        private _updateComponentsForLanguage(): void {
            this._updateLabelModeTitle();
            this._updateLabelMode();
            this._btnModePreview.label          = Lang.getText(Lang.Type.B0286);
            this._btnModeDrawUnit.label         = Lang.getText(Lang.Type.B0281);
            this._btnModeDrawTileObject.label   = Lang.getText(Lang.Type.B0283);
            this._btnModeDrawTileBase.label     = Lang.getText(Lang.Type.B0282);
            this._btnModeDeleteUnit.label       = Lang.getText(Lang.Type.B0284);
            this._btnModeDeleteTileObject.label = Lang.getText(Lang.Type.B0285);
        }

        private _updateGroupMode(): void {
            this._updateLabelModeTitle();
            this._updateLabelMode();
            this._updateTileView();
            this._updateUnitView();
        }

        private _updateLabelModeTitle(): void {
            const label     = this._labelModeTitle;
            label.text      = `${Lang.getText(Lang.Type.B0280)}: `;
            label.textColor = getTextColorForDrawerMode(this._drawer.getMode());
        }

        private _updateLabelMode(): void {
            const label     = this._labelMode;
            const mode      = this._drawer.getMode();
            label.text      = Lang.getMapEditorDrawerModeText(mode);
            label.textColor = getTextColorForDrawerMode(mode);
        }

        private _updateTileView(): void {
            const drawer    = this._drawer;
            const mode      = drawer.getMode();
            const con       = this._conTileView;
            const tileView  = this._tileView;
            if ((mode === DrawerMode.DrawTileBase) || (mode === DrawerMode.DrawTileObject)) {
                con.visible = true;
                tileView.init(drawer.getDrawTargetTileBaseViewId(), drawer.getDrawTargetTileObjectViewId());
                tileView.updateView();
            } else {
                con.visible = false;
            }
        }

        private _updateUnitView(): void {
            const drawer    = this._drawer;
            const con       = this._conUnitView;
            const unitView  = this._unitView;
            if (drawer.getMode() === DrawerMode.DrawUnit) {
                con.visible = true;
                unitView.init(drawer.getDrawTargetUnit());
                unitView.tickStateAnimationFrame();
                unitView.tickUnitAnimationFrame();
            } else {
                con.visible = false;
            }
        }

        private _updateBtnModeDrawUnit(): void {
            this._btnModeDrawUnit.visible = !this._war.getIsReview();
        }

        private _updateBtnModeDrawTileObject(): void {
            this._btnModeDrawTileObject.visible = !this._war.getIsReview();
        }

        private _updateBtnModePreview(): void {
            this._btnModePreview.visible = !this._war.getIsReview();
        }

        private _updateBtnDrawTileBase(): void {
            this._btnModeDrawTileBase.visible = !this._war.getIsReview();
        }

        private _updateBtnDeleteUnit(): void {
            this._btnModeDeleteUnit.visible = !this._war.getIsReview();
        }

        private _updateBtnDeleteTileObject(): void {
            this._btnModeDeleteTileObject.visible = !this._war.getIsReview();
        }

        private _updateBtnMenu(): void {
            this._btnMenu.label = Lang.getText(Lang.Type.B0155);
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Util functions.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _initTileView(): void {
            const tileView = this._tileView;
            tileView.init(null, null);
            tileView.startRunningView();
        }
        private _initUnitView(): void {
            const unitView = this._unitView;
            unitView.init(new MeUnit().init({
                gridX   : 0,
                gridY   : 0,
                viewId  : ConfigManager.getUnitViewId(Types.UnitType.Infantry, 1),
                unitId  : 0,
            }, this._war.getConfigVersion()));
        }
    }

    function getTextColorForDrawerMode(mode: DrawerMode): number {
        switch (mode) {
            case DrawerMode.Preview         : return 0xffffff;
            case DrawerMode.DrawUnit        : return 0x00ff00;
            case DrawerMode.DrawTileBase    : return 0x00ff00;
            case DrawerMode.DrawTileObject  : return 0x00ff00;
            case DrawerMode.DeleteUnit      : return 0xff0000;
            case DrawerMode.DeleteTileObject: return 0xff0000;
            default                         : return 0xffffff;
        }
    }
}
