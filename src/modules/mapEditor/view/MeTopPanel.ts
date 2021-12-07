
// import TwnsBwUnit                       from "../../baseWar/model/BwUnit";
// import TwnsBwUnitView                   from "../../baseWar/view/BwUnitView";
// import CommonConstants                  from "../../tools/helpers/CommonConstants";
// import Helpers                          from "../../tools/helpers/Helpers";
// import Types                            from "../../tools/helpers/Types";
// import Lang                             from "../../tools/lang/Lang";
// import TwnsLangTextType                 from "../../tools/lang/LangTextType";
// import TwnsNotifyType                   from "../../tools/notify/NotifyType";
// import TwnsUiButton                     from "../../tools/ui/UiButton";
// import TwnsUiLabel                      from "../../tools/ui/UiLabel";
// import TwnsUiPanel                      from "../../tools/ui/UiPanel";
// import TwnsMeDrawer                     from "../model/MeDrawer";
// import MeModel                          from "../model/MeModel";
// import TwnsMeWar                        from "../model/MeWar";
// import TwnsMeChooseTileBasePanel        from "./MeChooseTileBasePanel";
// import TwnsMeChooseTileDecoratorPanel   from "./MeChooseTileDecoratorPanel";
// import TwnsMeChooseTileObjectPanel      from "./MeChooseTileObjectPanel";
// import TwnsMeChooseUnitPanel            from "./MeChooseUnitPanel";
// import TwnsMeSymmetryPanel              from "./MeSymmetryPanel";
// import TwnsMeTileSimpleView             from "./MeTileSimpleView";
// import TwnsMeVisibilityPanel            from "./MeVisibilityPanel";
// import TwnsMeWarMenuPanel               from "./MeWarMenuPanel";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace TwnsMeTopPanel {
    import MeDrawer                 = TwnsMeDrawer.MeDrawer;
    import MeWar                    = TwnsMeWar.MeWar;
    import NotifyType               = TwnsNotifyType.NotifyType;
    import DrawerMode               = Types.MapEditorDrawerMode;
    import LangTextType             = TwnsLangTextType.LangTextType;

    export type OpenData = void;
    export class MeTopPanel extends TwnsUiPanel.UiPanel<OpenData> {
        private readonly _groupMode!                    : eui.Group;
        private readonly _labelMode!                    : TwnsUiLabel.UiLabel;
        private readonly _conUnitView!                  : eui.Group;
        private readonly _conTileView!                  : eui.Group;

        private readonly _groupModePreview!             : eui.Group;
        private readonly _labelModePreview!             : TwnsUiLabel.UiLabel;
        private readonly _groupModeDrawTileBase!        : eui.Group;
        private readonly _labelModeDrawTileBase!        : TwnsUiLabel.UiLabel;
        private readonly _groupModeDrawTileDecorator!   : eui.Group;
        private readonly _labelModeDrawTileDecorator!   : TwnsUiLabel.UiLabel;
        private readonly _groupModeDeleteTileDecorator! : eui.Group;
        private readonly _labelModeDeleteTileDecorator! : TwnsUiLabel.UiLabel;
        private readonly _groupModeDrawTileObject!      : eui.Group;
        private readonly _labelModeDrawTileObject!      : TwnsUiLabel.UiLabel;
        private readonly _groupModeDeleteTileObject!    : eui.Group;
        private readonly _labelModeDeleteTileObject!    : TwnsUiLabel.UiLabel;
        private readonly _groupModeDrawUnit!            : eui.Group;
        private readonly _labelModeDrawUnit!            : TwnsUiLabel.UiLabel;
        private readonly _groupModeDeleteUnit!          : eui.Group;
        private readonly _labelModeDeleteUnit!          : TwnsUiLabel.UiLabel;
        private readonly _groupModeDrawLocation!        : eui.Group;
        private readonly _labelModeDrawLocation!        : TwnsUiLabel.UiLabel;
        private readonly _groupModeDeleteLocation!      : eui.Group;
        private readonly _labelModeDeleteLocation!      : TwnsUiLabel.UiLabel;

        private readonly _btnVisibility!                : TwnsUiButton.UiButton;
        private readonly _btnSymmetry!                  : TwnsUiButton.UiButton;
        private readonly _btnMenu!                      : TwnsUiButton.UiButton;

        private _unitView   = new TwnsBwUnitView.BwUnitView();
        private _tileView   = new TwnsMeTileSimpleView.MeTileSimpleView();

        protected _onOpening(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,                 callback: this._onNotifyLanguageChanged },
                { type: NotifyType.TimeTick,                        callback: this._onNotifyTimeTick },
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
                { type: NotifyType.MsgMeSubmitMap,                  callback: this._onMsgMeSubmitMap },
            ]);
            this._setUiListenerArray([
                { ui: this._groupModePreview,               callback: this._onTouchedGroupModePreview },
                { ui: this._groupModeDrawTileBase,          callback: this._onTouchedGroupModeDrawTileBase },
                { ui: this._groupModeDrawTileDecorator,     callback: this._onTouchedGroupModeDrawTileDecorator },
                { ui: this._groupModeDeleteTileDecorator,   callback: this._onTouchedGroupModeDeleteTileDecorator },
                { ui: this._groupModeDrawTileObject,        callback: this._onTouchedGroupModeDrawTileObject },
                { ui: this._groupModeDeleteTileObject,      callback: this._onTouchedGroupModeDeleteTileObject },
                { ui: this._groupModeDrawUnit,              callback: this._onTouchedGroupModeDrawUnit },
                { ui: this._groupModeDeleteUnit,            callback: this._onTouchedGroupModeDeleteUnit },
                { ui: this._groupModeDrawLocation,          callback: this._onTouchedGroupModeDrawLocation },
                { ui: this._groupModeDeleteLocation,        callback: this._onTouchedGroupModeDeleteLocation },
                { ui: this._btnVisibility,                  callback: this._onTouchedBtnVisibility },
                { ui: this._btnSymmetry,                    callback: this._onTouchedBtnSymmetry },
                { ui: this._btnMenu,                        callback: this._onTouchedBtnMenu, },
            ]);

            const tileView      = this._tileView;
            const conTileView   = this._conTileView;
            conTileView.addChild(tileView.getImgBase());
            conTileView.addChild(tileView.getImgDecorator());
            conTileView.addChild(tileView.getImgObject());
            this._conUnitView.addChild(this._unitView);

            this._initTileView();
            this._initUnitView();
        }
        protected async _updateOnOpenDataChanged(): Promise<void> {
            this._updateView();
        }
        protected _onClosing(): void {
            this._conTileView.removeChildren();
            this._conUnitView.removeChildren();
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
        private _onNotifyTimeTick(): void {
            const autoSaveTime = UserModel.getSelfMapEditorAutoSaveTime();
            if ((!autoSaveTime) || (Timer.getServerTimestamp() % autoSaveTime !== 0)) {
                return;
            }

            const war = MeModel.getWar();
            if ((war == null) || (!war.getIsMapModified()) || (war.getIsReviewingMap())) {
                return;
            }

            const slotIndex = war.getMapSlotIndex();
            if (slotIndex === MeModel.getReviewingMapSlotIndex()) {
                return;
            }

            MeProxy.reqMeSubmitMap(slotIndex, war.serializeForMap(), false);
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
        private _onMsgMeSubmitMap(e: egret.Event): void {
            const data = e.data as ProtoTypes.NetMessage.MsgMeSubmitMap.IS;
            if (!data.needReview) {
                FloatText.show(Lang.getText(LangTextType.A0085));
            } else {
                const errorCode = data.mapRawDataErrorCode;
                if (errorCode) {
                    FloatText.show(Lang.getText(LangTextType.A0197));
                    FloatText.show(Lang.getErrorText(errorCode));
                } else {
                    FloatText.show(Lang.getText(LangTextType.A0244));
                }
            }

            this._getWar().setIsMapModified(false);
        }

        private _onTouchedGroupModePreview(): void {
            this._getDrawer().setModePreview();
            SoundManager.playShortSfx(Types.ShortSfxCode.ButtonNeutral01);
        }
        private _onTouchedGroupModeDrawTileBase(): void {
            TwnsPanelManager.open(TwnsPanelConfig.Dict.MeChooseTileBasePanel, void 0);
            SoundManager.playShortSfx(Types.ShortSfxCode.ButtonNeutral01);
        }
        private _onTouchedGroupModeDrawTileDecorator(): void {
            TwnsPanelManager.open(TwnsPanelConfig.Dict.MeChooseTileDecoratorPanel, void 0);
            SoundManager.playShortSfx(Types.ShortSfxCode.ButtonNeutral01);
        }
        private _onTouchedGroupModeDrawTileObject(): void {
            TwnsPanelManager.open(TwnsPanelConfig.Dict.MeChooseTileObjectPanel, void 0);
            SoundManager.playShortSfx(Types.ShortSfxCode.ButtonNeutral01);
        }
        private _onTouchedGroupModeDrawUnit(): void {
            TwnsPanelManager.open(TwnsPanelConfig.Dict.MeChooseUnitPanel, void 0);
            SoundManager.playShortSfx(Types.ShortSfxCode.ButtonNeutral01);
        }
        private _onTouchedGroupModeDeleteTileObject(): void {
            this._getDrawer().setModeDeleteTileObject();
            SoundManager.playShortSfx(Types.ShortSfxCode.ButtonNeutral01);
        }
        private _onTouchedGroupModeDrawLocation(): void {
            TwnsPanelManager.open(TwnsPanelConfig.Dict.MeChooseLocationPanel, { isAdd: true });
            SoundManager.playShortSfx(Types.ShortSfxCode.ButtonNeutral01);
        }
        private _onTouchedGroupModeDeleteLocation(): void {
            TwnsPanelManager.open(TwnsPanelConfig.Dict.MeChooseLocationPanel, { isAdd: false });
            SoundManager.playShortSfx(Types.ShortSfxCode.ButtonNeutral01);
        }
        private _onTouchedGroupModeDeleteTileDecorator(): void {
            this._getDrawer().setModeDeleteTileDecorator();
            SoundManager.playShortSfx(Types.ShortSfxCode.ButtonNeutral01);
        }
        private _onTouchedGroupModeDeleteUnit(): void {
            this._getDrawer().setModeDeleteUnit();
            SoundManager.playShortSfx(Types.ShortSfxCode.ButtonNeutral01);
        }

        private _onTouchedBtnVisibility(): void {
            TwnsPanelManager.open(TwnsPanelConfig.Dict.MeVisibilityPanel, void 0);
        }
        private _onTouchedBtnSymmetry(): void {
            TwnsPanelManager.open(TwnsPanelConfig.Dict.MeSymmetryPanel, void 0);
        }
        private _onTouchedBtnMenu(): void {
            TwnsPanelManager.open(TwnsPanelConfig.Dict.MeWarMenuPanel, void 0);
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
            this._labelModePreview.text             = Lang.getText(LangTextType.B0286);
            this._labelModeDrawTileBase.text        = Lang.getText(LangTextType.B0282);
            this._labelModeDeleteTileDecorator.text = Lang.getText(LangTextType.B0661);
            this._labelModeDrawUnit.text            = Lang.getText(LangTextType.B0281);
            this._labelModeDrawTileDecorator.text   = Lang.getText(LangTextType.B0662);
            this._labelModeDrawTileObject.text      = Lang.getText(LangTextType.B0283);
            this._labelModeDeleteUnit.text          = Lang.getText(LangTextType.B0284);
            this._labelModeDeleteTileObject.text    = Lang.getText(LangTextType.B0285);
            this._labelModeDrawLocation.text        = Lang.getText(LangTextType.B0759);
            this._labelModeDeleteLocation.text      = Lang.getText(LangTextType.B0760);
            this._btnVisibility.label               = Lang.getText(LangTextType.B0301);
            this._btnSymmetry.label                 = Lang.getText(LangTextType.B0306);
            this._btnMenu.label                     = Lang.getText(LangTextType.B0155);
        }

        private _updateGroupMode(): void {
            this._updateLabelMode();
            this._updateTileView();
            this._updateUnitView();

            const mode = this._getDrawer().getMode();
            Helpers.changeColor(this._groupModePreview,             mode === Types.MapEditorDrawerMode.Preview ? Types.ColorType.White : Types.ColorType.Origin);
            Helpers.changeColor(this._groupModeDrawTileBase,        mode === Types.MapEditorDrawerMode.DrawTileBase ? Types.ColorType.White : Types.ColorType.Origin);
            Helpers.changeColor(this._groupModeDrawTileDecorator,   mode === Types.MapEditorDrawerMode.DrawTileDecorator ? Types.ColorType.White : Types.ColorType.Origin);
            Helpers.changeColor(this._groupModeDeleteTileDecorator, mode === Types.MapEditorDrawerMode.DeleteTileDecorator ? Types.ColorType.White : Types.ColorType.Origin);
            Helpers.changeColor(this._groupModeDrawTileObject,      mode === Types.MapEditorDrawerMode.DrawTileObject ? Types.ColorType.White : Types.ColorType.Origin);
            Helpers.changeColor(this._groupModeDeleteTileObject,    mode === Types.MapEditorDrawerMode.DeleteTileObject ? Types.ColorType.White : Types.ColorType.Origin);
            Helpers.changeColor(this._groupModeDrawUnit,            mode === Types.MapEditorDrawerMode.DrawUnit ? Types.ColorType.White : Types.ColorType.Origin);
            Helpers.changeColor(this._groupModeDeleteUnit,          mode === Types.MapEditorDrawerMode.DeleteUnit ? Types.ColorType.White : Types.ColorType.Origin);
            Helpers.changeColor(this._groupModeDrawLocation,        mode === Types.MapEditorDrawerMode.AddTileToLocation ? Types.ColorType.White : Types.ColorType.Origin);
            Helpers.changeColor(this._groupModeDeleteLocation,      mode === Types.MapEditorDrawerMode.DeleteTileFromLocation ? Types.ColorType.White : Types.ColorType.Origin);
        }

        private _updateLabelMode(): void {
            const label     = this._labelMode;
            const drawer    = this._getDrawer();
            const mode      = drawer.getMode();
            label.textColor = getTextColorForDrawerMode(mode);

            const rawText = `${Lang.getText(LangTextType.B0280)}: ${Lang.getMapEditorDrawerModeText(mode)}`;
            if (mode === DrawerMode.AddTileToLocation) {
                label.text = `${rawText} ${drawer.getDataForAddTileToLocation()?.locationIdArray.join(`,`)}`;
            } else if (mode === DrawerMode.DeleteTileFromLocation) {
                label.text = `${rawText} ${drawer.getDataForDeleteTileFromLocation()?.locationIdArray.join(`,`)}`;
            } else {
                label.text = rawText;
            }
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
            this._groupModeDrawUnit.visible = !this._getWar().getIsReviewingMap();
        }

        private _updateBtnModeDrawTileDecorator(): void {
            this._groupModeDrawTileDecorator.visible = !this._getWar().getIsReviewingMap();
        }

        private _updateBtnModeDrawTileObject(): void {
            this._groupModeDrawTileObject.visible = !this._getWar().getIsReviewingMap();
        }

        private _updateBtnModePreview(): void {
            this._groupModePreview.visible = !this._getWar().getIsReviewingMap();
        }

        private _updateBtnModeDrawTileBase(): void {
            this._groupModeDrawTileBase.visible = !this._getWar().getIsReviewingMap();
        }

        private _updateBtnDeleteUnit(): void {
            this._groupModeDeleteUnit.visible = !this._getWar().getIsReviewingMap();
        }

        private _updateBtnDeleteTileObject(): void {
            this._groupModeDeleteTileObject.visible = !this._getWar().getIsReviewingMap();
        }

        private _updateBtnDeleteTileDecorator(): void {
            this._groupModeDeleteTileDecorator.visible = !this._getWar().getIsReviewingMap();
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
            case DrawerMode.Preview                 : return 0xffffff;
            case DrawerMode.DrawUnit                : return 0x00ff00;
            case DrawerMode.DrawTileBase            : return 0x00ff00;
            case DrawerMode.DrawTileObject          : return 0x00ff00;
            case DrawerMode.DrawTileDecorator       : return 0x00ff00;
            case DrawerMode.DeleteUnit              : return 0xff0000;
            case DrawerMode.DeleteTileDecorator     : return 0xff0000;
            case DrawerMode.DeleteTileObject        : return 0xff0000;
            case DrawerMode.AddTileToLocation       : return 0x00ff00;
            case DrawerMode.DeleteTileFromLocation  : return 0xff0000;
            default                                 : return 0xffffff;
        }
    }
}

// export default TwnsMeTopPanel;
