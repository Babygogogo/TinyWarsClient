
import TwnsUiPanel                      from "../../tools/ui/UiPanel";
import TwnsUiButton                      from "../../tools/ui/UiButton";
import TwnsUiLabel                      from "../../tools/ui/UiLabel";
import TwnsBwUnit                       from "../../baseWar/model/BwUnit";
import BwUnitView = TwnsBwUnitView.BwUnitView;import TwnsBwUnitView                   from "../../baseWar/view/BwUnitView";
import { MeDrawer }                     from "../model/MeDrawer";
import { MeWar }                        from "../model/MeWar";
import { MeChooseTileBasePanel }        from "./MeChooseTileBasePanel";
import { MeChooseUnitPanel }            from "./MeChooseUnitPanel";
import TwnsMeTileSimpleView             from "./MeTileSimpleView";
import { MeWarMenuPanel }               from "./MeWarMenuPanel";
import { MeChooseTileObjectPanel }      from "./MeChooseTileObjectPanel";
import { MeVisibilityPanel }            from "./MeVisibilityPanel";
import { MeSymmetryPanel }              from "./MeSymmetryPanel";
import TwnsLangTextType             from "../../tools/lang/LangTextType";
import TwnsNotifyType               from "../../tools/notify/NotifyType";
import Types                        from "../../tools/helpers/Types";
import CommonConstants              from "../../tools/helpers/CommonConstants";
import Lang                         from "../../tools/lang/Lang";
import MeModel                      from "../model/MeModel";

namespace TwnsMeTopPanel {
    import NotifyType       = TwnsNotifyType.NotifyType;
    import DrawerMode       = Types.MapEditorDrawerMode;
    import LangTextType     = TwnsLangTextType.LangTextType;

    // eslint-disable-next-line no-shadow
    export class MeTopPanel extends TwnsUiPanel.UiPanel<void> {
        protected readonly _LAYER_TYPE   = Types.LayerType.Hud0;
        protected readonly _IS_EXCLUSIVE = false;

        private static _instance: MeTopPanel;

        private _groupMode          : eui.Group;
        private _labelModeTitle     : TwnsUiLabel.UiLabel;
        private _labelMode          : TwnsUiLabel.UiLabel;
        private _conUnitView        : eui.Group;
        private _conTileView        : eui.Group;

        private _btnModePreview         : TwnsUiButton.UiButton;
        private _btnModeDrawTileBase    : TwnsUiButton.UiButton;
        private _btnModeDrawTileObject  : TwnsUiButton.UiButton;
        private _btnModeDrawUnit        : TwnsUiButton.UiButton;
        private _btnModeDeleteTileObject: TwnsUiButton.UiButton;
        private _btnModeDeleteUnit      : TwnsUiButton.UiButton;
        private _btnVisibility          : TwnsUiButton.UiButton;
        private _btnSymmetry            : TwnsUiButton.UiButton;
        private _btnMenu                : TwnsUiButton.UiButton;

        private _unitView   = new BwUnitView();
        private _tileView   = new TwnsMeTileSimpleView.MeTileSimpleView();

        private _war    : MeWar;
        private _drawer : MeDrawer;

        public static show(): void {
            if (!MeTopPanel._instance) {
                MeTopPanel._instance = new MeTopPanel();
            }
            MeTopPanel._instance.open(undefined);
        }

        public static async hide(): Promise<void> {
            if (MeTopPanel._instance) {
                await MeTopPanel._instance.close();
            }
        }

        private constructor() {
            super();

            this.skinName = "resource/skins/mapEditor/MeTopPanel.exml";
        }

        protected _onOpened(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,                callback: this._onNotifyLanguageChanged },
                { type: NotifyType.TileAnimationTick,              callback: this._onNotifyTileAnimationTick },
                { type: NotifyType.UnitAnimationTick,              callback: this._onNotifyUnitAnimationTick },
                { type: NotifyType.MeDrawerModeChanged,            callback: this._onNotifyMeDrawerModeChanged },
                { type: NotifyType.BwTurnPhaseCodeChanged,         callback: this._onNotifyBwTurnPhaseCodeChanged },
                { type: NotifyType.BwPlayerFundChanged,            callback: this._onNotifyBwPlayerFundChanged },
                { type: NotifyType.BwPlayerIndexInTurnChanged,     callback: this._onNotifyBwPlayerIndexInTurnChanged },
                { type: NotifyType.BwCoEnergyChanged,              callback: this._onNotifyBwCoEnergyChanged },
                { type: NotifyType.BwCoUsingSkillTypeChanged,      callback: this._onNotifyBwCoUsingSkillChanged },
                { type: NotifyType.BwActionPlannerStateChanged,    callback: this._onNotifyBwActionPlannerStateChanged },
            ]);
            this._setUiListenerArray([
                { ui: this._btnModePreview,             callback: this._onTouchedBtnModePreview },
                { ui: this._btnModeDrawTileBase,        callback: this._onTouchedBtnModeDrawTileBase },
                { ui: this._btnModeDrawTileObject,      callback: this._onTouchedBtnModeDrawTileObject },
                { ui: this._btnModeDrawUnit,            callback: this._onTouchedBtnModeDrawUnit },
                { ui: this._btnModeDeleteTileObject,    callback: this._onTouchedBtnModeDeleteTileObject },
                { ui: this._btnModeDeleteUnit,          callback: this._onTouchedBtnModeDeleteUnit },
                { ui: this._btnVisibility,              callback: this._onTouchedBtnVisibility },
                { ui: this._btnSymmetry,                callback: this._onTouchedBtnSymmetry },
                { ui: this._btnMenu,                    callback: this._onTouchedBtnMenu, },
            ]);

            this._conTileView.addChild(this._tileView.getImgBase());
            this._conTileView.addChild(this._tileView.getImgObject());
            this._conUnitView.addChild(this._unitView);

            this._war       = MeModel.getWar();
            this._drawer    = this._war.getDrawer();
            this._initTileView();
            this._initUnitView();

            this._updateView();
        }

        protected async _onClosed(): Promise<void> {
            this._war       = null;
            this._drawer    = null;
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
        private _onTouchedBtnVisibility(e: egret.TouchEvent): void {
            MeVisibilityPanel.show();
        }
        private _onTouchedBtnSymmetry(e: egret.TouchEvent): void {
            MeSymmetryPanel.show();
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
            this._btnModePreview.label          = Lang.getText(LangTextType.B0286);
            this._btnModeDrawUnit.label         = Lang.getText(LangTextType.B0281);
            this._btnModeDrawTileObject.label   = Lang.getText(LangTextType.B0283);
            this._btnModeDrawTileBase.label     = Lang.getText(LangTextType.B0282);
            this._btnModeDeleteUnit.label       = Lang.getText(LangTextType.B0284);
            this._btnModeDeleteTileObject.label = Lang.getText(LangTextType.B0285);
            this._btnVisibility.label           = Lang.getText(LangTextType.B0301);
            this._btnSymmetry.label             = Lang.getText(LangTextType.B0306);
        }

        private _updateGroupMode(): void {
            this._updateLabelModeTitle();
            this._updateLabelMode();
            this._updateTileView();
            this._updateUnitView();
        }

        private _updateLabelModeTitle(): void {
            const label     = this._labelModeTitle;
            label.text      = `${Lang.getText(LangTextType.B0280)}: `;
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
            if (mode === DrawerMode.DrawTileBase) {
                con.visible = true;

                const tileBaseData = drawer.getDrawTargetTileBaseData();
                tileView.init({
                    tileBaseShapeId     : tileBaseData.shapeId,
                    tileBaseType        : tileBaseData.baseType,
                    tileObjectShapeId   : null,
                    tileObjectType      : null,
                    playerIndex         : CommonConstants.WarNeutralPlayerIndex,
                });
                tileView.updateView();

            } else if (mode === DrawerMode.DrawTileObject) {
                con.visible = true;

                const tileObjectData    = drawer.getDrawTargetTileObjectData();
                tileView.init({
                    tileBaseShapeId     : null,
                    tileBaseType        : null,
                    tileObjectShapeId   : tileObjectData.shapeId,
                    tileObjectType      : tileObjectData.objectType,
                    playerIndex         : tileObjectData.playerIndex,
                });
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
            this._btnModeDrawUnit.visible = !this._war.getIsReviewingMap();
        }

        private _updateBtnModeDrawTileObject(): void {
            this._btnModeDrawTileObject.visible = !this._war.getIsReviewingMap();
        }

        private _updateBtnModePreview(): void {
            this._btnModePreview.visible = !this._war.getIsReviewingMap();
        }

        private _updateBtnDrawTileBase(): void {
            this._btnModeDrawTileBase.visible = !this._war.getIsReviewingMap();
        }

        private _updateBtnDeleteUnit(): void {
            this._btnModeDeleteUnit.visible = !this._war.getIsReviewingMap();
        }

        private _updateBtnDeleteTileObject(): void {
            this._btnModeDeleteTileObject.visible = !this._war.getIsReviewingMap();
        }

        private _updateBtnMenu(): void {
            this._btnMenu.label = Lang.getText(LangTextType.B0155);
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Util functions.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _initTileView(): void {
            const tileView = this._tileView;
            tileView.init({
                tileBaseType        : null,
                tileBaseShapeId     : null,
                tileObjectType      : null,
                tileObjectShapeId   : null,
                playerIndex         : CommonConstants.WarNeutralPlayerIndex,
            });
            tileView.startRunningView();
        }
        private _initUnitView(): void {
            const war   = this._war;
            const unit  = new TwnsBwUnit.BwUnit();
            unit.init({
                gridIndex   : { x: 0, y: 0 },
                unitId      : 0,
                unitType    : Types.UnitType.Infantry,
                playerIndex : CommonConstants.WarFirstPlayerIndex,
            }, this._war.getConfigVersion());
            unit.startRunning(war);

            this._unitView.init(unit);
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

export default TwnsMeTopPanel;
