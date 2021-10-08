
import TwnsBwUnit                       from "../../baseWar/model/BwUnit";
import TwnsBwUnitView                   from "../../baseWar/view/BwUnitView";
import CommonConstants                  from "../../tools/helpers/CommonConstants";
import Helpers                          from "../../tools/helpers/Helpers";
import Types                            from "../../tools/helpers/Types";
import Lang                             from "../../tools/lang/Lang";
import TwnsLangTextType                 from "../../tools/lang/LangTextType";
import TwnsNotifyType                   from "../../tools/notify/NotifyType";
import TwnsUiButton                     from "../../tools/ui/UiButton";
import TwnsUiLabel                      from "../../tools/ui/UiLabel";
import TwnsUiPanel                      from "../../tools/ui/UiPanel";
import TwnsMeDrawer                     from "../model/MeDrawer";
import MeModel                          from "../model/MeModel";
import TwnsMeWar                        from "../model/MeWar";
import TwnsMeChooseTileBasePanel        from "./MeChooseTileBasePanel";
import TwnsMeChooseTileDecoratorPanel   from "./MeChooseTileDecoratorPanel";
import TwnsMeChooseTileObjectPanel      from "./MeChooseTileObjectPanel";
import TwnsMeChooseUnitPanel            from "./MeChooseUnitPanel";
import TwnsMeSymmetryPanel              from "./MeSymmetryPanel";
import TwnsMeTileSimpleView             from "./MeTileSimpleView";
import TwnsMeVisibilityPanel            from "./MeVisibilityPanel";
import TwnsMeWarMenuPanel               from "./MeWarMenuPanel";

namespace TwnsMeTopPanel {
    import BwUnitView               = TwnsBwUnitView.BwUnitView;
    import MeDrawer                 = TwnsMeDrawer.MeDrawer;
    import MeWar                    = TwnsMeWar.MeWar;
    import MeChooseTileBasePanel    = TwnsMeChooseTileBasePanel.MeChooseTileBasePanel;
    import MeChooseUnitPanel        = TwnsMeChooseUnitPanel.MeChooseUnitPanel;
    import MeWarMenuPanel           = TwnsMeWarMenuPanel.MeWarMenuPanel;
    import MeChooseTileObjectPanel  = TwnsMeChooseTileObjectPanel.MeChooseTileObjectPanel;
    import MeVisibilityPanel        = TwnsMeVisibilityPanel.MeVisibilityPanel;
    import MeSymmetryPanel          = TwnsMeSymmetryPanel.MeSymmetryPanel;
    import NotifyType               = TwnsNotifyType.NotifyType;
    import DrawerMode               = Types.MapEditorDrawerMode;
    import LangTextType             = TwnsLangTextType.LangTextType;

    // eslint-disable-next-line no-shadow
    export class MeTopPanel extends TwnsUiPanel.UiPanel<void> {
        protected readonly _LAYER_TYPE   = Types.LayerType.Hud0;
        protected readonly _IS_EXCLUSIVE = false;

        private static _instance: MeTopPanel;

        private readonly _groupMode!                    : eui.Group;
        private readonly _labelMode!                    : TwnsUiLabel.UiLabel;
        private readonly _conUnitView!                  : eui.Group;
        private readonly _conTileView!                  : eui.Group;

        private readonly _btnModePreview!               : TwnsUiButton.UiButton;
        private readonly _btnModeDrawTileBase!          : TwnsUiButton.UiButton;
        private readonly _btnModeDrawTileDecorator!     : TwnsUiButton.UiButton;
        private readonly _btnModeDrawTileObject!        : TwnsUiButton.UiButton;
        private readonly _btnModeDrawUnit!              : TwnsUiButton.UiButton;
        private readonly _btnModeDeleteTileDecorator!   : TwnsUiButton.UiButton;
        private readonly _btnModeDeleteTileObject!      : TwnsUiButton.UiButton;
        private readonly _btnModeDeleteUnit!            : TwnsUiButton.UiButton;
        private readonly _btnVisibility!                : TwnsUiButton.UiButton;
        private readonly _btnSymmetry!                  : TwnsUiButton.UiButton;
        private readonly _btnMenu!                      : TwnsUiButton.UiButton;

        private _unitView   = new BwUnitView();
        private _tileView   = new TwnsMeTileSimpleView.MeTileSimpleView();

        public static show(): void {
            if (!MeTopPanel._instance) {
                MeTopPanel._instance = new MeTopPanel();
            }
            MeTopPanel._instance.open();
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
                { type: NotifyType.LanguageChanged,                 callback: this._onNotifyLanguageChanged },
                { type: NotifyType.TileAnimationTick,               callback: this._onNotifyTileAnimationTick },
                { type: NotifyType.UnitAnimationTick,               callback: this._onNotifyUnitAnimationTick },
                { type: NotifyType.UnitStateIndicatorTick,          callback: this._onNotifyUnitStateIndicatorTick },
                { type: NotifyType.MeDrawerModeChanged,             callback: this._onNotifyMeDrawerModeChanged },
                { type: NotifyType.BwTurnPhaseCodeChanged,          callback: this._onNotifyBwTurnPhaseCodeChanged },
                { type: NotifyType.BwPlayerFundChanged,             callback: this._onNotifyBwPlayerFundChanged },
                { type: NotifyType.BwPlayerIndexInTurnChanged,      callback: this._onNotifyBwPlayerIndexInTurnChanged },
                { type: NotifyType.BwCoEnergyChanged,               callback: this._onNotifyBwCoEnergyChanged },
                { type: NotifyType.BwCoUsingSkillTypeChanged,       callback: this._onNotifyBwCoUsingSkillChanged },
                { type: NotifyType.BwActionPlannerStateSet,         callback: this._onNotifyBwActionPlannerStateChanged },
            ]);
            this._setUiListenerArray([
                { ui: this._btnModePreview,             callback: this._onTouchedBtnModePreview },
                { ui: this._btnModeDrawTileBase,        callback: this._onTouchedBtnModeDrawTileBase },
                { ui: this._btnModeDrawTileDecorator,   callback: this._onTouchedBtnModeDrawTileDecorator },
                { ui: this._btnModeDrawTileObject,      callback: this._onTouchedBtnModeDrawTileObject },
                { ui: this._btnModeDrawUnit,            callback: this._onTouchedBtnModeDrawUnit },
                { ui: this._btnModeDeleteTileObject,    callback: this._onTouchedBtnModeDeleteTileObject },
                { ui: this._btnModeDeleteTileDecorator, callback: this._onTouchedBtnModeDeleteTileDecorator },
                { ui: this._btnModeDeleteUnit,          callback: this._onTouchedBtnModeDeleteUnit },
                { ui: this._btnVisibility,              callback: this._onTouchedBtnVisibility },
                { ui: this._btnSymmetry,                callback: this._onTouchedBtnSymmetry },
                { ui: this._btnMenu,                    callback: this._onTouchedBtnMenu, },
            ]);

            const tileView      = this._tileView;
            const conTileView   = this._conTileView;
            conTileView.addChild(tileView.getImgBase());
            conTileView.addChild(tileView.getImgDecorator());
            conTileView.addChild(tileView.getImgObject());
            this._conUnitView.addChild(this._unitView);

            this._initTileView();
            this._initUnitView();

            this._updateView();
        }

        private _getWar(): MeWar {
            return Helpers.getExisted(MeModel.getWar());
        }
        private _getDrawer(): MeDrawer {
            return this._getWar().getDrawer();
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Callbacks.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _onNotifyLanguageChanged(): void  {
            this._updateComponentsForLanguage();
        }
        private _onNotifyTileAnimationTick(): void {
            this._tileView.updateOnAnimationTick();
        }
        private _onNotifyUnitAnimationTick(): void {
            this._unitView.tickUnitAnimationFrame();
        }
        private _onNotifyUnitStateIndicatorTick(): void {
            this._unitView.tickStateAnimationFrame();
        }
        private _onNotifyMeDrawerModeChanged(): void {
            this._updateGroupMode();
        }
        private _onNotifyBwTurnPhaseCodeChanged(): void {
            this._updateBtnModePreview();
            this._updateBtnModeDrawTileBase();
            this._updateBtnDeleteUnit();
            this._updateBtnDeleteTileObject();
        }
        private _onNotifyBwPlayerFundChanged(): void {
            this._updateBtnModeDrawUnit();
        }
        private _onNotifyBwPlayerIndexInTurnChanged(): void {
            this._updateView();
        }
        private _onNotifyBwCoEnergyChanged(): void {
            this._updateBtnModeDrawTileObject();
        }
        private _onNotifyBwCoUsingSkillChanged(): void {
            this._updateBtnModeDrawTileObject();
        }
        private _onNotifyBwActionPlannerStateChanged(): void {
            this._updateBtnModePreview();
            this._updateBtnDeleteTileObject();
        }

        private _onTouchedBtnModePreview(): void {
            this._getDrawer().setModePreview();
        }
        private _onTouchedBtnModeDrawTileBase(): void {
            MeChooseTileBasePanel.show();
        }
        private _onTouchedBtnModeDrawTileDecorator(): void {
            TwnsMeChooseTileDecoratorPanel.MeChooseTileDecoratorPanel.show();
        }
        private _onTouchedBtnModeDrawTileObject(): void {
            MeChooseTileObjectPanel.show();
        }
        private _onTouchedBtnModeDrawUnit(): void {
            MeChooseUnitPanel.show();
        }
        private _onTouchedBtnModeDeleteTileObject(): void {
            this._getDrawer().setModeDeleteTileObject();
        }
        private _onTouchedBtnModeDeleteTileDecorator(): void {
            this._getDrawer().setModeDeleteTileDecorator();
        }
        private _onTouchedBtnModeDeleteUnit(): void {
            this._getDrawer().setModeDeleteUnit();
        }
        private _onTouchedBtnVisibility(): void {
            MeVisibilityPanel.show();
        }
        private _onTouchedBtnSymmetry(): void {
            MeSymmetryPanel.show();
        }

        private _onTouchedBtnMenu(): void {
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
            this._updateBtnModeDrawTileBase();
            this._updateBtnModeDrawTileDecorator();
            this._updateBtnModeDrawTileObject();
            this._updateBtnDeleteUnit();
            this._updateBtnDeleteTileDecorator();
            this._updateBtnDeleteTileObject();
            this._updateBtnMenu();
        }

        private _updateComponentsForLanguage(): void {
            this._updateLabelMode();
            this._btnModePreview.label              = Lang.getText(LangTextType.B0286);
            this._btnModeDrawUnit.label             = Lang.getText(LangTextType.B0281);
            this._btnModeDrawTileBase.label         = Lang.getText(LangTextType.B0282);
            this._btnModeDrawTileDecorator.label    = Lang.getText(LangTextType.B0662);
            this._btnModeDrawTileObject.label       = Lang.getText(LangTextType.B0283);
            this._btnModeDeleteUnit.label           = Lang.getText(LangTextType.B0284);
            this._btnModeDeleteTileDecorator.label  = Lang.getText(LangTextType.B0661);
            this._btnModeDeleteTileObject.label     = Lang.getText(LangTextType.B0285);
            this._btnVisibility.label               = Lang.getText(LangTextType.B0301);
            this._btnSymmetry.label                 = Lang.getText(LangTextType.B0306);
        }

        private _updateGroupMode(): void {
            this._updateLabelMode();
            this._updateTileView();
            this._updateUnitView();
        }

        private _updateLabelMode(): void {
            const label     = this._labelMode;
            const mode      = this._getDrawer().getMode();
            label.text      = `${Lang.getText(LangTextType.B0280)}: ${Lang.getMapEditorDrawerModeText(mode)}`;
            label.textColor = getTextColorForDrawerMode(mode);
        }

        private _updateTileView(): void {
            const drawer    = this._getDrawer();
            const mode      = drawer.getMode();
            const con       = this._conTileView;
            const tileView  = this._tileView;
            if (mode === DrawerMode.DrawTileBase) {
                con.visible = true;

                const tileBaseData = Helpers.getExisted(drawer.getDrawTargetTileBaseData());
                tileView.init({
                    tileBaseShapeId     : tileBaseData.shapeId,
                    tileBaseType        : tileBaseData.baseType,
                    tileDecoratorType   : null,
                    tileDecoratorShapeId: null,
                    tileObjectShapeId   : null,
                    tileObjectType      : null,
                    playerIndex         : CommonConstants.WarNeutralPlayerIndex,
                });
                tileView.updateView();

            } else if (mode === DrawerMode.DrawTileDecorator) {
                con.visible = true;

                const tileDecoratorData = Helpers.getExisted(drawer.getDrawTargetTileDecoratorData());
                tileView.init({
                    tileBaseShapeId     : null,
                    tileBaseType        : null,
                    tileDecoratorType   : tileDecoratorData.decoratorType,
                    tileDecoratorShapeId: tileDecoratorData.shapeId,
                    tileObjectShapeId   : null,
                    tileObjectType      : null,
                    playerIndex         : CommonConstants.WarNeutralPlayerIndex,
                });
                tileView.updateView();

            } else if (mode === DrawerMode.DrawTileObject) {
                con.visible = true;

                const tileObjectData = Helpers.getExisted(drawer.getDrawTargetTileObjectData());
                tileView.init({
                    tileBaseShapeId     : null,
                    tileBaseType        : null,
                    tileDecoratorType   : null,
                    tileDecoratorShapeId: null,
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
            const drawer    = this._getDrawer();
            const con       = this._conUnitView;
            const unitView  = this._unitView;
            if (drawer.getMode() === DrawerMode.DrawUnit) {
                con.visible = true;
                unitView.init(Helpers.getExisted(drawer.getDrawTargetUnit()));
                unitView.tickStateAnimationFrame();
                unitView.tickUnitAnimationFrame();
            } else {
                con.visible = false;
            }
        }

        private _updateBtnModeDrawUnit(): void {
            this._btnModeDrawUnit.visible = !this._getWar().getIsReviewingMap();
        }

        private _updateBtnModeDrawTileDecorator(): void {
            this._btnModeDrawTileDecorator.visible = !this._getWar().getIsReviewingMap();
        }

        private _updateBtnModeDrawTileObject(): void {
            this._btnModeDrawTileObject.visible = !this._getWar().getIsReviewingMap();
        }

        private _updateBtnModePreview(): void {
            this._btnModePreview.visible = !this._getWar().getIsReviewingMap();
        }

        private _updateBtnModeDrawTileBase(): void {
            this._btnModeDrawTileBase.visible = !this._getWar().getIsReviewingMap();
        }

        private _updateBtnDeleteUnit(): void {
            this._btnModeDeleteUnit.visible = !this._getWar().getIsReviewingMap();
        }

        private _updateBtnDeleteTileObject(): void {
            this._btnModeDeleteTileObject.visible = !this._getWar().getIsReviewingMap();
        }

        private _updateBtnDeleteTileDecorator(): void {
            this._btnModeDeleteTileDecorator.visible = !this._getWar().getIsReviewingMap();
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
                tileDecoratorType   : null,
                tileDecoratorShapeId: null,
                tileObjectType      : null,
                tileObjectShapeId   : null,
                playerIndex         : CommonConstants.WarNeutralPlayerIndex,
            });
            tileView.startRunningView();
        }
        private _initUnitView(): void {
            const war   = this._getWar();
            const unit  = new TwnsBwUnit.BwUnit();
            unit.init({
                gridIndex   : { x: 0, y: 0 },
                unitId      : 0,
                unitType    : Types.UnitType.Infantry,
                playerIndex : CommonConstants.WarFirstPlayerIndex,
            }, this._getWar().getConfigVersion());
            unit.startRunning(war);

            this._unitView.init(unit);
        }
    }

    function getTextColorForDrawerMode(mode: DrawerMode): number {
        switch (mode) {
            case DrawerMode.Preview             : return 0xffffff;
            case DrawerMode.DrawUnit            : return 0x00ff00;
            case DrawerMode.DrawTileBase        : return 0x00ff00;
            case DrawerMode.DrawTileObject      : return 0x00ff00;
            case DrawerMode.DrawTileDecorator   : return 0x00ff00;
            case DrawerMode.DeleteUnit          : return 0xff0000;
            case DrawerMode.DeleteTileDecorator : return 0xff0000;
            case DrawerMode.DeleteTileObject    : return 0xff0000;
            default                             : return 0xffffff;
        }
    }
}

export default TwnsMeTopPanel;
