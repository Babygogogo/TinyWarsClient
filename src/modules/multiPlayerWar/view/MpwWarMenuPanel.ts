
// import TwnsBwUnitListPanel              from "../../baseWar/view/BwUnitListPanel";
// import TwnsCommonConfirmPanel           from "../../common/view/CommonConfirmPanel";
// import MpwModel                         from "../../multiPlayerWar/model/MpwModel";
// import MpwProxy                         from "../../multiPlayerWar/model/MpwProxy";
// import TwnsSpmCreateSfwSaveSlotsPanel   from "../../singlePlayerMode/view/SpmCreateSfwSaveSlotsPanel";
// import TwnsTwWar                        from "../../testWar/model/TwWar";
// import FloatText                        from "../../tools/helpers/FloatText";
// import FlowManager                      from "../../tools/helpers/FlowManager";
// import Helpers                          from "../../tools/helpers/Helpers";
// import Types                            from "../../tools/helpers/Types";
// import Lang                             from "../../tools/lang/Lang";
// import TwnsLangTextType                 from "../../tools/lang/LangTextType";
// import Notify                           from "../../tools/notify/Notify";
// import Notify                   from "../../tools/notify/NotifyType";
// import ProtoTypes                       from "../../tools/proto/ProtoTypes";
// import TwnsUiButton                     from "../../tools/ui/UiButton";
// import TwnsUiImage                      from "../../tools/ui/UiImage";
// import TwnsUiLabel                      from "../../tools/ui/UiLabel";
// import TwnsUiPanel                      from "../../tools/ui/UiPanel";
// import UserModel                        from "../../user/model/UserModel";
// import UserProxy                        from "../../user/model/UserProxy";
// import TwnsMpwWar                       from "../model/MpwWar";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.MultiPlayerWar {
    import LangTextType                 = Lang.LangTextType;
    import NotifyType                   = Notify.NotifyType;

    export type OpenDataForMpwWarMenuPanel = void;
    export class MpwWarMenuPanel extends TwnsUiPanel.UiPanel<OpenDataForMpwWarMenuPanel> {
        private readonly _imgMask!              : TwnsUiImage.UiImage;
        private readonly _group!                : eui.Group;
        private readonly _labelTitle!           : TwnsUiLabel.UiLabel;
        private readonly _btnDamageCalculator!  : TwnsUiButton.UiButton;
        private readonly _btnClose!             : TwnsUiButton.UiButton;

        private readonly _btnSync!              : TwnsUiButton.UiButton;
        private readonly _btnUnitList!          : TwnsUiButton.UiButton;
        private readonly _btnDeleteUnit!        : TwnsUiButton.UiButton;
        private readonly _btnSimulation!        : TwnsUiButton.UiButton;
        private readonly _btnFreeMode!          : TwnsUiButton.UiButton;
        private readonly _btnSetPath!           : TwnsUiButton.UiButton;
        private readonly _btnReplay!            : TwnsUiButton.UiButton;
        private readonly _btnUnitOpacity!       : TwnsUiButton.UiButton;
        private readonly _btnMapRating!         : TwnsUiButton.UiButton;
        private readonly _btnSpectate!          : TwnsUiButton.UiButton;
        private readonly _btnSetDraw!           : TwnsUiButton.UiButton;
        private readonly _btnSurrender!         : TwnsUiButton.UiButton;
        private readonly _btnGotoWarList!       : TwnsUiButton.UiButton;
        private readonly _btnGotoLobby!         : TwnsUiButton.UiButton;

        protected _onOpening(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,                     callback: this._onNotifyLanguageChanged },
                { type: NotifyType.UnitAndTileTextureVersionChanged,    callback: this._onNotifyUnitAndTileTextureVersionChanged },
                { type: NotifyType.UserSettingsOpacitySettingsChanged,  callback: this._onNotifyMsgUserSettingsOpacitySettingsChanged },
                { type: NotifyType.MsgSpmCreateSfw,                     callback: this._onNotifyMsgSpmCreateSfw },
                { type: NotifyType.MsgMpwGetHalfwayReplayData,          callback: this._onNotifyMsgMpwGetHalfwayReplayData },
                { type: NotifyType.MsgMpwGetHalfwayReplayDataFailed,    callback: this._onNotifyMsgMpwGetHalfwayReplayDataFailed },
                { type: NotifyType.MsgUserSetMapRating,                 callback: this._onNotifyMsgUserSetMapRating },
                { type: NotifyType.MsgMpwWatchGetIncomingInfo,          callback: this._onNotifyMsgMpwWatchGetIncomingInfo },
            ]);
            this._setUiListenerArray([
                { ui: this._btnClose,                                   callback: this.close },
                { ui: this._btnDamageCalculator,                        callback: this._onTouchedBtnDamageCalculator },
                { ui: this._btnSync,                                    callback: this._onTouchedBtnSync },
                { ui: this._btnUnitList,                                callback: this._onTouchedBtnUnitList },
                { ui: this._btnDeleteUnit,                              callback: this._onTouchedBtnDeleteUnit },
                { ui: this._btnSimulation,                              callback: this._onTouchedBtnSimulation },
                { ui: this._btnFreeMode,                                callback: this._onTouchedBtnFreeMode },
                { ui: this._btnSetPath,                                 callback: this._onTouchedBtnSetPath },
                { ui: this._btnReplay,                                  callback: this._onTouchedBtnReplay },
                { ui: this._btnUnitOpacity,                             callback: this._onTouchedBtnUnitOpacity },
                { ui: this._btnMapRating,                               callback: this._onTouchedBtnMapRating },
                { ui: this._btnSpectate,                                callback: this._onTouchedBtnSpectate },
                { ui: this._btnSetDraw,                                 callback: this._onTouchedBtnSetDraw },
                { ui: this._btnSurrender,                               callback: this._onTouchedBtnSurrender },
                { ui: this._btnGotoWarList,                             callback: this._onTouchedBtnGotoWarList },
                { ui: this._btnGotoLobby,                               callback: this._onTouchedBtnGotoLobby },
            ]);
            this._setIsTouchMaskEnabled();
            this._setIsCloseOnTouchedMask();
        }
        protected async _updateOnOpenDataChanged(): Promise<void> {
            this._updateView();
        }
        protected _onClosing(): void {
            // nothing to do
        }

        private _getWar(): MultiPlayerWar.MpwWar {
            return Helpers.getExisted(MultiPlayerWar.MpwModel.getWar());
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Callbacks for notify.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _onNotifyLanguageChanged(): void {
            this._updateComponentsForLanguage();
        }
        private _onNotifyUnitAndTileTextureVersionChanged(): void {
            this._updateView();
        }
        private _onNotifyMsgUserSettingsOpacitySettingsChanged(): void {
            this._updateBtnUnitOpacity();
        }
        private _onNotifyMsgSpmCreateSfw(e: egret.Event): void {
            const data = e.data as CommonProto.NetMessage.MsgSpmCreateSfw.IS;
            PanelHelpers.open(PanelHelpers.PanelDict.CommonConfirmPanel, {
                content : Lang.getText(LangTextType.A0107),
                callback: () => {
                    FlowManager.gotoSinglePlayerWar({
                        slotIndex       : Helpers.getExisted(data.slotIndex),
                        slotExtraData   : Helpers.getExisted(data.extraData),
                        warData         : Helpers.getExisted(data.warData),
                    });
                },
            });
        }
        private _onNotifyMsgMpwGetHalfwayReplayData(e: egret.Event): void {
            const data = e.data as CommonProto.NetMessage.MsgMpwGetHalfwayReplayData.IS;
            FlowManager.gotoHalfwayReplayWar(Helpers.deepClone(Helpers.getExisted(data.warData)));
        }
        private _onNotifyMsgMpwGetHalfwayReplayDataFailed(): void {
            PanelHelpers.close(PanelHelpers.PanelDict.CommonBlockPanel);
        }
        private _onNotifyMsgUserSetMapRating(): void {
            this._updateBtnMapRating();
        }
        private _onNotifyMsgMpwWatchGetIncomingInfo(): void {
            this._updateBtnSpectate();
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Callbacks for ui.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _onTouchedBtnDamageCalculator(): void {
            PanelHelpers.open(PanelHelpers.PanelDict.CommonDamageCalculatorPanel, {
                war                     : this._getWar(),
                needReviseWeaponType    : true,
                data                    : null,
            });
            this.close();
        }

        private _onTouchedBtnSync(): void {
            const war = this._getWar();
            MultiPlayerWar.MpwProxy.reqMpwCommonSyncWar(
                war,
                war.getActionPlanner().checkIsStateRequesting()
                    ? Types.SyncWarRequestType.PlayerForce
                    : Types.SyncWarRequestType.PlayerRequest
            );
            this.close();
        }

        private _onTouchedBtnUnitList(): void {
            const war = this._getWar();
            PanelHelpers.open(PanelHelpers.PanelDict.BwUnitListPanel, {
                war,
                callbackOnSelect    : unit => {
                    if ((war.getIsExecutingAction()) || (war.getActionPlanner().checkIsStateRequesting())) {
                        return;
                    }

                    const cursor    = war.getCursor();
                    const gridIndex = unit.getGridIndex();
                    if (GridIndexHelpers.checkIsEqual(gridIndex, cursor.getGridIndex())) {
                        Notify.dispatch(NotifyType.BwCursorTapped, {
                            current : gridIndex,
                            tappedOn: gridIndex,
                        } as Notify.NotifyData.BwCursorTapped);
                        PanelHelpers.close(PanelHelpers.PanelDict.BwUnitListPanel);
                    } else {
                        cursor.setGridIndex(gridIndex);
                        cursor.updateView();
                        war.getView().tweenGridToCentralArea(gridIndex);
                        war.getGridVisualEffect().showEffectAiming(gridIndex, 800);
                        SoundManager.playShortSfx(Types.ShortSfxCode.ButtonNeutral01);
                    }
                },
            });
            this.close();
        }

        private _onTouchedBtnDeleteUnit(): void {
            if (!this._checkCanDoAction()) {
                FloatText.show(Lang.getText(LangTextType.A0239));
                return;
            }

            const war = this._getWar();
            if (war.getPlayerInTurn().getUserId() !== User.UserModel.getSelfUserId()) {
                FloatText.show(Lang.getText(LangTextType.A0242));
                return;
            }

            const unitMap       = war.getUnitMap();
            const unit          = unitMap.getVisibleUnitOnMap(war.getCursor().getGridIndex());
            const playerIndex   = war.getPlayerIndexInTurn();
            if (!unit) {
                FloatText.show(Lang.getText(LangTextType.A0027));
            } else if ((unit.getPlayerIndex() !== playerIndex) || (unit.getActionState() !== Types.UnitActionState.Idle)) {
                FloatText.show(Lang.getText(LangTextType.A0028));
            } else if (unitMap.countUnitsOnMapForPlayer(playerIndex) <= 1) {
                FloatText.show(Lang.getText(LangTextType.A0076));
            } else {
                PanelHelpers.open(PanelHelpers.PanelDict.CommonConfirmPanel, {
                    title   : Lang.getText(LangTextType.B0081),
                    content : Lang.getText(LangTextType.A0029),
                    callback: () => war.getActionPlanner().setStateRequestingPlayerDeleteUnit(),
                });
            }
        }

        private _onTouchedBtnSimulation(): void {
            if (!this._checkCanDoAction()) {
                FloatText.show(Lang.getText(LangTextType.A0239));
                return;
            }

            const war = this._getWar();
            PanelHelpers.open(PanelHelpers.PanelDict.SpmCreateSfwSaveSlotsPanel, war.serializeForCreateSfw());
        }

        private _onTouchedBtnFreeMode(): void {
            if (!this._checkCanDoAction()) {
                FloatText.show(Lang.getText(LangTextType.A0239));
                return;
            }

            const war = this._getWar();
            if (war.getPlayerManager().getAliveOrDyingTeamsCount(false) < 2) {
                FloatText.show(Lang.getText(LangTextType.A0199));
                return;
            }

            const warData   = war.serializeForCreateMfr();
            const errorCode = new TestWar.TwWar().getErrorCodeForInitForMfw(warData, war.getGameConfig());
            if (errorCode) {
                FloatText.show(Lang.getErrorText(errorCode));
                return;
            }

            PanelHelpers.open(PanelHelpers.PanelDict.CommonConfirmPanel, {
                content : Lang.getText(LangTextType.A0201),
                callback: () => {
                    FlowManager.gotoMfrCreateSettingsPanel(warData);
                }
            });
        }

        private _onTouchedBtnSetPath(): void {
            const isEnabled = User.UserModel.getSelfSettingsIsSetPathMode();
            PanelHelpers.open(PanelHelpers.PanelDict.CommonConfirmPanel, {
                content : Lang.getFormattedText(
                    LangTextType.F0033,
                    Lang.getText(isEnabled ? LangTextType.B0431 : LangTextType.B0432),
                ),
                textForConfirm  : Lang.getText(LangTextType.B0433),
                textForCancel   : Lang.getText(LangTextType.B0434),
                callback: () => {
                    if (!isEnabled) {
                        User.UserProxy.reqUserSetSettings({
                            isSetPathMode   : true,
                        });
                    }
                },
                callbackOnCancel: () => {
                    if (isEnabled) {
                        User.UserProxy.reqUserSetSettings({
                            isSetPathMode   : false,
                        });
                    }
                }
            });
        }

        private _onTouchedBtnReplay(): void {
            PanelHelpers.open(PanelHelpers.PanelDict.CommonConfirmPanel, {
                content : Lang.getText(LangTextType.A0249),
                callback: () => {
                    MultiPlayerWar.MpwProxy.reqMpwGetHalfwayReplayData(Helpers.getExisted(this._getWar().getWarId()));
                    PanelHelpers.open(PanelHelpers.PanelDict.CommonBlockPanel, {
                        title   : Lang.getText(LangTextType.B0088),
                        content : Lang.getText(LangTextType.A0040),
                    });
                },
            });
        }

        private _onTouchedBtnUnitOpacity(): void {
            User.UserModel.reqTickSelfSettingsUnitOpacity();
        }

        private _onTouchedBtnMapRating(): void {
            const mapId     = Helpers.getExisted(this._getWar().getMapId());
            const minValue  = CommonConstants.MapMinRating;
            const maxValue  = CommonConstants.MapMaxRating;
            PanelHelpers.open(PanelHelpers.PanelDict.CommonInputIntegerPanel, {
                title           : Lang.getText(LangTextType.B0363),
                currentValue    : User.UserModel.getMapRating(mapId) || 0,
                minValue,
                maxValue,
                tips            : `${Lang.getText(LangTextType.B0319)}: [${minValue}, ${maxValue}]\n${Lang.getText(LangTextType.A0238)}`,
                callback        : value => {
                    User.UserProxy.reqUserSetMapRating(mapId, value);
                },
            });
        }

        private _onTouchedBtnSpectate(): void {
            PanelHelpers.open(PanelHelpers.PanelDict.MpwSpectatePanel, void 0);
        }

        private _onTouchedBtnSetDraw(): void {
            if (!this._checkCanDoAction()) {
                FloatText.show(Lang.getText(LangTextType.A0239));
                return;
            }

            const war = this._getWar();
            if (war.getPlayerInTurn().getUserId() !== User.UserModel.getSelfUserId()) {
                FloatText.show(Lang.getText(LangTextType.A0242));
                return;
            }
            if (war.getPlayerInTurn().getHasVotedForDraw()) {
                FloatText.show(Lang.getText(LangTextType.A0240));
                return;
            }

            const actionPlanner = war.getActionPlanner();
            if (war.getDrawVoteManager().getRemainingVotes() == null) {
                PanelHelpers.open(PanelHelpers.PanelDict.CommonConfirmPanel, {
                    content : Lang.getText(LangTextType.A0031),
                    callback: () => actionPlanner.setStateRequestingPlayerVoteForDraw(true),
                });
            } else {
                PanelHelpers.open(PanelHelpers.PanelDict.CommonConfirmPanel, {
                    content             : Lang.getText(LangTextType.A0241),
                    textForConfirm      : Lang.getText(LangTextType.B0214),
                    textForCancel       : Lang.getText(LangTextType.B0215),
                    showButtonClose     : true,
                    callback            : () => {
                        actionPlanner.setStateRequestingPlayerVoteForDraw(true);
                        this.close();
                    },
                    callbackOnCancel    : () => {
                        actionPlanner.setStateRequestingPlayerVoteForDraw(false);
                        this.close();
                    },
                });
            }
        }

        private _onTouchedBtnSurrender(): void {
            if (!this._checkCanDoAction()) {
                FloatText.show(Lang.getText(LangTextType.A0239));
                return;
            }

            const war = this._getWar();
            if (war.getPlayerInTurn().getUserId() !== User.UserModel.getSelfUserId()) {
                FloatText.show(Lang.getText(LangTextType.A0242));
                return;
            }

            PanelHelpers.open(PanelHelpers.PanelDict.CommonConfirmPanel, {
                title   : Lang.getText(LangTextType.B0055),
                content : Lang.getText(LangTextType.A0026),
                callback: () => {
                    war.getActionPlanner().setStateRequestingPlayerSurrender();
                    this.close();
                },
            });
        }

        private _onTouchedBtnGotoWarList(): void {
            if (!this._checkCanDoAction()) {
                FloatText.show(Lang.getText(LangTextType.A0239));
                return;
            }

            PanelHelpers.open(PanelHelpers.PanelDict.CommonConfirmPanel, {
                title   : Lang.getText(LangTextType.B0652),
                content : Lang.getText(LangTextType.A0225),
                callback: () => {
                    const war = this._getWar();
                    if (war.getPlayerLoggedIn() != null) {
                        FlowManager.gotoMyWarListPanel(war.getWarType());
                    } else {
                        FlowManager.gotoWatchWarListPanel();
                    }
                },
            });
        }

        private _onTouchedBtnGotoLobby(): void {
            if (!this._checkCanDoAction()) {
                FloatText.show(Lang.getText(LangTextType.A0239));
                return;
            }

            PanelHelpers.open(PanelHelpers.PanelDict.CommonConfirmPanel, {
                title   : Lang.getText(LangTextType.B0054),
                content : Lang.getText(LangTextType.A0025),
                callback: () => FlowManager.gotoLobby(),
            });
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Functions for view.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        protected async _showOpenAnimation(): Promise<void> {
            Helpers.resetTween({
                obj         : this._imgMask,
                beginProps  : { alpha: 0 },
                endProps    : { alpha: 1 },
            });
            Helpers.resetTween({
                obj         : this._group,
                beginProps  : { alpha: 0, verticalCenter: 40 },
                endProps    : { alpha: 1, verticalCenter: 0 },
            });

            await Helpers.wait(CommonConstants.DefaultTweenTime);
        }
        protected async _showCloseAnimation(): Promise<void> {
            Helpers.resetTween({
                obj         : this._imgMask,
                beginProps  : { alpha: 1 },
                endProps    : { alpha: 0 },
            });
            Helpers.resetTween({
                obj         : this._group,
                beginProps  : { alpha: 1, verticalCenter: 0 },
                endProps    : { alpha: 0, verticalCenter: 40 },
            });

            await Helpers.wait(CommonConstants.DefaultTweenTime);
        }

        private _updateView(): void {
            this._updateComponentsForLanguage();

            this._updateBtnSpectate();
        }

        private _updateComponentsForLanguage(): void {
            this._labelTitle.text       = Lang.getText(LangTextType.B0155);
            this._btnSync.label         = Lang.getText(LangTextType.B0089);
            this._btnReplay.label       = Lang.getText(LangTextType.B0710);
            this._btnUnitList.label     = Lang.getText(LangTextType.B0152);
            this._btnDeleteUnit.label   = Lang.getText(LangTextType.B0081);
            this._btnSimulation.label   = Lang.getText(LangTextType.B0325);
            this._btnFreeMode.label     = Lang.getText(LangTextType.B0557);
            this._btnSpectate.label     = Lang.getText(LangTextType.B0872);
            this._btnSetPath.label      = Lang.getText(LangTextType.B0430);
            this._btnSurrender.label    = Lang.getText(LangTextType.B0055);
            this._btnGotoWarList.label  = Lang.getText(LangTextType.B0652);
            this._btnGotoLobby.label    = Lang.getText(LangTextType.B0054);
            this._updateBtnSetDraw();
            this._updateBtnUnitOpacity();
            this._updateBtnMapRating();
        }

        private _updateBtnSetDraw(): void {
            this._btnSetDraw.label = this._getWar().getDrawVoteManager().getRemainingVotes() == null
                ? Lang.getText(LangTextType.B0690)
                : Lang.getText(LangTextType.B0841);
        }

        private _updateBtnUnitOpacity(): void {
            this._btnUnitOpacity.label = `${Lang.getText(LangTextType.B0747)}: ${User.UserModel.getSelfSettingsOpacitySettings()?.unitOpacity ?? 100}%`;
        }

        private _updateBtnMapRating(): void {
            const btn   = this._btnMapRating;
            const mapId = this._getWar().getMapId();
            if (mapId == null) {
                btn.visible = false;
            } else {
                btn.visible = true;
                btn.label   = `${Lang.getText(LangTextType.B0804)}: ${User.UserModel.getMapRating(mapId) ?? `--`}`;
            }
        }

        private async _updateBtnSpectate(): Promise<void> {
            const info = await WatchWar.WwModel.getWatchIncomingInfo(Helpers.getExisted(this._getWar().getWarId()));
            this._btnSpectate.setRedVisible(!!info?.requestSrcUserIdArray?.length);
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Other functions.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _checkCanDoAction(): boolean {
            const war = this._getWar();
            return (war.checkIsHumanInTurn())                                           &&
                (war.getTurnManager().getPhaseCode() === Types.TurnPhaseCode.Main)      &&
                (war.getActionPlanner().getState() === Types.ActionPlannerState.Idle);
        }
    }
}

// export default TwnsMpwWarMenuPanel;
