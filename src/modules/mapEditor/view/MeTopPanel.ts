
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
        // private readonly _labelMode!                    : TwnsUiLabel.UiLabel;
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

        private readonly _groupLeftButtons!             : eui.Group;
        private readonly _btnSaveMap!                   : TwnsUiButton.UiButton;
        private readonly _btnLoadMap!                   : TwnsUiButton.UiButton;
        private readonly _btnReviewAccept!              : TwnsUiButton.UiButton;
        private readonly _btnReviewReject!              : TwnsUiButton.UiButton;
        private readonly _btnWarRule!                   : TwnsUiButton.UiButton;
        private readonly _btnWarEvent!                  : TwnsUiButton.UiButton;
        private readonly _btnMapTag!                    : TwnsUiButton.UiButton;
        private readonly _btnVisibility!                : TwnsUiButton.UiButton;
        private readonly _btnSymmetry!                  : TwnsUiButton.UiButton;
        private readonly _btnSettings!                  : TwnsUiButton.UiButton;
        private readonly _btnMenu!                      : TwnsUiButton.UiButton;

        private readonly _labelLocationTitle!           : TwnsUiLabel.UiLabel;
        private readonly _labelLocation!                : TwnsUiLabel.UiLabel;

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
                { type: NotifyType.BwCoEnergyChanged,               callback: this._onNotifyBwCoEnergyChanged },
                { type: NotifyType.BwCoUsingSkillTypeChanged,       callback: this._onNotifyBwCoUsingSkillChanged },
                { type: NotifyType.BwActionPlannerStateSet,         callback: this._onNotifyBwActionPlannerStateChanged },
                { type: NotifyType.BwCursorGridIndexChanged,        callback: this._onNotifyBwCursorGridIndexChanged },
                { type: NotifyType.BwTileLocationFlagSet,           callback: this._onNotifyBwTileLocationFlatSet },
                { type: NotifyType.MsgMeSubmitMap,                  callback: this._onMsgMeSubmitMap },
                { type: NotifyType.MsgMmReviewMap,                  callback: this._onMsgMmReviewMap },
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
                { ui: this._btnSaveMap,                     callback: this._onTouchedBtnSaveMap },
                { ui: this._btnLoadMap,                     callback: this._onTouchedBtnLoadMap },
                { ui: this._btnReviewAccept,                callback: this._onTouchedBtnReviewAccept },
                { ui: this._btnReviewReject,                callback: this._onTouchedBtnReviewReject },
                { ui: this._btnWarRule,                     callback: this._onTouchedBtnWarRule },
                { ui: this._btnWarEvent,                    callback: this._onTouchedBtnWarEvent },
                { ui: this._btnMapTag,                      callback: this._onTouchedBtnMapTag },
                { ui: this._btnVisibility,                  callback: this._onTouchedBtnVisibility },
                { ui: this._btnSymmetry,                    callback: this._onTouchedBtnSymmetry },
                { ui: this._btnSettings,                    callback: this._onTouchedBtnSettings },
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
            this._updateGroupModePreview();
            this._updateGroupModeDrawTileBase();
            this._updateGroupModeDeleteUnit();
            this._updateGroupModeDeleteTileObject();
        }
        private _onNotifyBwPlayerFundChanged(): void {
            this._updateGroupModeDrawUnit();
        }
        private _onNotifyBwCoEnergyChanged(): void {
            this._updateGroupModeDrawTileObject();
        }
        private _onNotifyBwCoUsingSkillChanged(): void {
            this._updateGroupModeDrawTileObject();
        }
        private _onNotifyBwActionPlannerStateChanged(): void {
            this._updateGroupModePreview();
            this._updateGroupModeDeleteTileObject();
        }
        private _onNotifyBwCursorGridIndexChanged(): void {
            this._updateLabelLocation();
        }
        private _onNotifyBwTileLocationFlatSet(): void {
            this._updateLabelLocation();
        }
        private _onMsgMeSubmitMap(e: egret.Event): void {
            const data = e.data as CommonProto.NetMessage.MsgMeSubmitMap.IS;
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
        private _onMsgMmReviewMap(e: egret.Event): void {
            const data = e.data as CommonProto.NetMessage.MsgMmReviewMap.IS;
            if (data.isAccept) {
                FloatText.show(Lang.getText(LangTextType.A0092));
            } else {
                FloatText.show(Lang.getText(LangTextType.A0093));
            }
            FlowManager.gotoLobby();
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
        private _onTouchedBtnSaveMap(): void {
            TwnsPanelManager.open(TwnsPanelConfig.Dict.MeConfirmSaveMapPanel, void 0);
        }
        private _onTouchedBtnLoadMap(): void {
            const war = this._getWar();
            TwnsPanelManager.open(TwnsPanelConfig.Dict.CommonConfirmPanel, {
                content : Lang.getText(LangTextType.A0072),
                callback: async () => {
                    const slotIndex = war.getMapSlotIndex();
                    const data      = MeModel.getData(slotIndex);
                    war.stopRunning();
                    await war.initWithMapEditorData({
                        mapRawData: (data ? data.mapRawData : null) || await MeUtility.createDefaultMapRawData(slotIndex),
                        slotIndex,
                    });
                    war.setIsMapModified(false);
                    war.startRunning()
                        .startRunningView();
                },
            });
        }
        private _onTouchedBtnReviewAccept(): void {
            TwnsPanelManager.open(TwnsPanelConfig.Dict.MmAcceptMapPanel, { war: this._getWar() });
        }
        private _onTouchedBtnReviewReject(): void {
            TwnsPanelManager.open(TwnsPanelConfig.Dict.MmRejectMapPanel, { war: this._getWar() });
        }
        private _onTouchedBtnWarRule(): void {
            const war = this._getWar();
            if (!war.getIsReviewingMap()) {
                TwnsPanelManager.open(TwnsPanelConfig.Dict.MeWarRulePanel, void 0);
            } else {
                if (war.getWarRuleArray().length) {
                    TwnsPanelManager.open(TwnsPanelConfig.Dict.MeWarRulePanel, void 0);
                } else {
                    FloatText.show(Lang.getText(LangTextType.A0100));
                }
            }
        }
        private _onTouchedBtnWarEvent(): void {
            TwnsPanelManager.open(TwnsPanelConfig.Dict.WeEventListPanel, {
                war: this._getWar(),
            });
        }
        private _onTouchedBtnMapTag(): void {
            TwnsPanelManager.open(TwnsPanelConfig.Dict.MeMapTagPanel, void 0);
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
        private _onTouchedBtnSettings(): void {
            TwnsPanelManager.open(TwnsPanelConfig.Dict.UserSettingsPanel,  void 0);
        }
        private _onTouchedBtnMenu(): void {
            TwnsPanelManager.open(TwnsPanelConfig.Dict.MeWarMenuPanel, void 0);
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Functions for views.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _updateView(): void {
            this._updateComponentsForLanguage();

            this._resetGroupLeftButtons();
            this._updateGroupMode();
            this._updateGroupModePreview();
            this._updateGroupModeDrawUnit();
            this._updateGroupModeDrawTileBase();
            this._updateGroupModeDrawTileDecorator();
            this._updateGroupModeDrawTileObject();
            this._updateGroupModeDeleteUnit();
            this._updateGroupModeDeleteTileDecorator();
            this._updateGroupModeDeleteTileObject();
            this._updateGroupModeDrawLocation();
            this._updateGroupModeDeleteLocation();
            this._updateLabelLocation();
        }

        private _updateComponentsForLanguage(): void {
            // this._updateLabelMode();
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
            this._btnSaveMap.label                  = Lang.getText(LangTextType.B0287);
            this._btnLoadMap.label                  = Lang.getText(LangTextType.B0288);
            this._btnReviewAccept.label             = Lang.getText(LangTextType.B0296);
            this._btnReviewReject.label             = Lang.getText(LangTextType.B0297);
            this._btnWarRule.label                  = Lang.getText(LangTextType.B0314);
            this._btnWarEvent.label                 = Lang.getText(LangTextType.B0461);
            this._btnMapTag.label                   = Lang.getText(LangTextType.B0445);
            this._btnVisibility.label               = Lang.getText(LangTextType.B0301);
            this._btnSymmetry.label                 = Lang.getText(LangTextType.B0306);
            this._btnSettings.label                 = Lang.getText(LangTextType.B0560);
            this._btnMenu.label                     = Lang.getText(LangTextType.B0155);
            this._labelLocationTitle.text           = `${Lang.getText(LangTextType.B0764)}:`;
        }

        private _resetGroupLeftButtons(): void {
            const group = this._groupLeftButtons;
            group.removeChildren();

            if (this._getWar().getIsReviewingMap()) {
                group.addChild(this._btnReviewAccept);
                group.addChild(this._btnReviewReject);
            } else {
                group.addChild(this._btnSaveMap);
                group.addChild(this._btnLoadMap);
            }
            group.addChild(this._btnWarRule);
            group.addChild(this._btnWarEvent);
            group.addChild(this._btnMapTag);
            group.addChild(this._btnVisibility);
            group.addChild(this._btnSymmetry);
            group.addChild(this._btnSettings);
            group.addChild(this._btnMenu);
        }

        private _updateGroupMode(): void {
            // this._updateLabelMode();
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

        // private _updateLabelMode(): void {
        //     const label     = this._labelMode;
        //     const drawer    = this._getDrawer();
        //     const mode      = drawer.getMode();
        //     label.textColor = getTextColorForDrawerMode(mode);

        //     const rawText = `${Lang.getText(LangTextType.B0280)}: ${Lang.getMapEditorDrawerModeText(mode)}`;
        //     if (mode === DrawerMode.AddTileToLocation) {
        //         label.text = `${rawText} ${drawer.getDataForAddTileToLocation()?.locationIdArray.join(`,`)}`;
        //     } else if (mode === DrawerMode.DeleteTileFromLocation) {
        //         label.text = `${rawText} ${drawer.getDataForDeleteTileFromLocation()?.locationIdArray.join(`,`)}`;
        //     } else {
        //         label.text = rawText;
        //     }
        // }

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

        private _updateGroupModeDrawUnit(): void {
            this._groupModeDrawUnit.visible = !this._getWar().getIsReviewingMap();
        }

        private _updateGroupModeDrawTileDecorator(): void {
            this._groupModeDrawTileDecorator.visible = !this._getWar().getIsReviewingMap();
        }

        private _updateGroupModeDrawTileObject(): void {
            this._groupModeDrawTileObject.visible = !this._getWar().getIsReviewingMap();
        }

        private _updateGroupModePreview(): void {
            this._groupModePreview.visible = !this._getWar().getIsReviewingMap();
        }

        private _updateGroupModeDrawTileBase(): void {
            this._groupModeDrawTileBase.visible = !this._getWar().getIsReviewingMap();
        }

        private _updateGroupModeDeleteUnit(): void {
            this._groupModeDeleteUnit.visible = !this._getWar().getIsReviewingMap();
        }

        private _updateGroupModeDeleteTileObject(): void {
            this._groupModeDeleteTileObject.visible = !this._getWar().getIsReviewingMap();
        }

        private _updateGroupModeDeleteTileDecorator(): void {
            this._groupModeDeleteTileDecorator.visible = !this._getWar().getIsReviewingMap();
        }

        private _updateGroupModeDrawLocation(): void {
            this._groupModeDrawLocation.visible = !this._getWar().getIsReviewingMap();
        }

        private _updateGroupModeDeleteLocation(): void {
            this._groupModeDeleteLocation.visible = !this._getWar().getIsReviewingMap();
        }

        private _updateLabelLocation(): void {
            const war                   = this._getWar();
            const locationIdArray       = war.getTileMap().getTile(war.getCursor().getGridIndex()).getHasLocationFlagArray();
            this._labelLocation.text    = locationIdArray.length ? locationIdArray.join(` /`) : `--`;
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
            const unit  = new Twns.BaseWar.BwUnit();
            unit.init({
                gridIndex   : { x: 0, y: 0 },
                unitId      : 0,
                unitType    : Types.UnitType.Infantry,
                playerIndex : CommonConstants.WarFirstPlayerIndex,
            }, this._getWar().getGameConfig());
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
