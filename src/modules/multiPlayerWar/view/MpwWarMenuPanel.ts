
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
// import Twns.Notify                   from "../../tools/notify/NotifyType";
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
    import LangTextType                 = Twns.Lang.LangTextType;
    import NotifyType                   = Twns.Notify.NotifyType;

    export type OpenDataForMpwWarMenuPanel = void;
    export class MpwWarMenuPanel extends TwnsUiPanel.UiPanel<OpenDataForMpwWarMenuPanel> {
        private readonly _imgMask!              : TwnsUiImage.UiImage;
        private readonly _group!                : eui.Group;
        private readonly _labelTitle!           : TwnsUiLabel.UiLabel;
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
            return Twns.Helpers.getExisted(MultiPlayerWar.MpwModel.getWar());
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
            Twns.PanelHelpers.open(Twns.PanelHelpers.PanelDict.CommonConfirmPanel, {
                content : Lang.getText(LangTextType.A0107),
                callback: () => {
                    Twns.FlowManager.gotoSinglePlayerWar({
                        slotIndex       : Twns.Helpers.getExisted(data.slotIndex),
                        slotExtraData   : Twns.Helpers.getExisted(data.extraData),
                        warData         : Twns.Helpers.getExisted(data.warData),
                    });
                },
            });
        }
        private _onNotifyMsgMpwGetHalfwayReplayData(e: egret.Event): void {
            const data = e.data as CommonProto.NetMessage.MsgMpwGetHalfwayReplayData.IS;
            Twns.FlowManager.gotoHalfwayReplayWar(Twns.Helpers.deepClone(Twns.Helpers.getExisted(data.warData)));
        }
        private _onNotifyMsgMpwGetHalfwayReplayDataFailed(): void {
            Twns.PanelHelpers.close(Twns.PanelHelpers.PanelDict.CommonBlockPanel);
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
        private _onTouchedBtnSync(): void {
            const war = this._getWar();
            MultiPlayerWar.MpwProxy.reqMpwCommonSyncWar(
                war,
                war.getActionPlanner().checkIsStateRequesting()
                    ? Twns.Types.SyncWarRequestType.PlayerForce
                    : Twns.Types.SyncWarRequestType.PlayerRequest
            );
            this.close();
        }

        private _onTouchedBtnUnitList(): void {
            Twns.PanelHelpers.open(Twns.PanelHelpers.PanelDict.BwUnitListPanel, {
                war: this._getWar(),
            });
            this.close();
        }

        private _onTouchedBtnDeleteUnit(): void {
            if (!this._checkCanDoAction()) {
                Twns.FloatText.show(Lang.getText(LangTextType.A0239));
                return;
            }

            const war = this._getWar();
            if (war.getPlayerInTurn().getUserId() !== Twns.User.UserModel.getSelfUserId()) {
                Twns.FloatText.show(Lang.getText(LangTextType.A0242));
                return;
            }

            const unitMap       = war.getUnitMap();
            const unit          = unitMap.getVisibleUnitOnMap(war.getCursor().getGridIndex());
            const playerIndex   = war.getPlayerIndexInTurn();
            if (!unit) {
                Twns.FloatText.show(Lang.getText(LangTextType.A0027));
            } else if ((unit.getPlayerIndex() !== playerIndex) || (unit.getActionState() !== Twns.Types.UnitActionState.Idle)) {
                Twns.FloatText.show(Lang.getText(LangTextType.A0028));
            } else if (unitMap.countUnitsOnMapForPlayer(playerIndex) <= 1) {
                Twns.FloatText.show(Lang.getText(LangTextType.A0076));
            } else {
                Twns.PanelHelpers.open(Twns.PanelHelpers.PanelDict.CommonConfirmPanel, {
                    title   : Lang.getText(LangTextType.B0081),
                    content : Lang.getText(LangTextType.A0029),
                    callback: () => war.getActionPlanner().setStateRequestingPlayerDeleteUnit(),
                });
            }
        }

        private _onTouchedBtnSimulation(): void {
            if (!this._checkCanDoAction()) {
                Twns.FloatText.show(Lang.getText(LangTextType.A0239));
                return;
            }

            const war = this._getWar();
            Twns.PanelHelpers.open(Twns.PanelHelpers.PanelDict.SpmCreateSfwSaveSlotsPanel, war.serializeForCreateSfw());
        }

        private _onTouchedBtnFreeMode(): void {
            if (!this._checkCanDoAction()) {
                Twns.FloatText.show(Lang.getText(LangTextType.A0239));
                return;
            }

            const war = this._getWar();
            if (war.getPlayerManager().getAliveOrDyingTeamsCount(false) < 2) {
                Twns.FloatText.show(Lang.getText(LangTextType.A0199));
                return;
            }

            const warData   = war.serializeForCreateMfr();
            const errorCode = new TestWar.TwWar().getErrorCodeForInitForMfw(warData, war.getGameConfig());
            if (errorCode) {
                Twns.FloatText.show(Lang.getErrorText(errorCode));
                return;
            }

            Twns.PanelHelpers.open(Twns.PanelHelpers.PanelDict.CommonConfirmPanel, {
                content : Lang.getText(LangTextType.A0201),
                callback: () => {
                    Twns.FlowManager.gotoMfrCreateSettingsPanel(warData);
                }
            });
        }

        private _onTouchedBtnSetPath(): void {
            const isEnabled = Twns.User.UserModel.getSelfSettingsIsSetPathMode();
            Twns.PanelHelpers.open(Twns.PanelHelpers.PanelDict.CommonConfirmPanel, {
                content : Lang.getFormattedText(
                    LangTextType.F0033,
                    Lang.getText(isEnabled ? LangTextType.B0431 : LangTextType.B0432),
                ),
                textForConfirm  : Lang.getText(LangTextType.B0433),
                textForCancel   : Lang.getText(LangTextType.B0434),
                callback: () => {
                    if (!isEnabled) {
                        Twns.User.UserProxy.reqUserSetSettings({
                            isSetPathMode   : true,
                        });
                    }
                },
                callbackOnCancel: () => {
                    if (isEnabled) {
                        Twns.User.UserProxy.reqUserSetSettings({
                            isSetPathMode   : false,
                        });
                    }
                }
            });
        }

        private _onTouchedBtnReplay(): void {
            Twns.PanelHelpers.open(Twns.PanelHelpers.PanelDict.CommonConfirmPanel, {
                content : Lang.getText(LangTextType.A0249),
                callback: () => {
                    MultiPlayerWar.MpwProxy.reqMpwGetHalfwayReplayData(Twns.Helpers.getExisted(this._getWar().getWarId()));
                    Twns.PanelHelpers.open(Twns.PanelHelpers.PanelDict.CommonBlockPanel, {
                        title   : Lang.getText(LangTextType.B0088),
                        content : Lang.getText(LangTextType.A0040),
                    });
                },
            });
        }

        private _onTouchedBtnUnitOpacity(): void {
            Twns.User.UserModel.reqTickSelfSettingsUnitOpacity();
        }

        private _onTouchedBtnMapRating(): void {
            const mapId     = Twns.Helpers.getExisted(this._getWar().getMapId());
            const minValue  = Twns.CommonConstants.MapMinRating;
            const maxValue  = Twns.CommonConstants.MapMaxRating;
            Twns.PanelHelpers.open(Twns.PanelHelpers.PanelDict.CommonInputIntegerPanel, {
                title           : Lang.getText(LangTextType.B0363),
                currentValue    : Twns.User.UserModel.getMapRating(mapId) || 0,
                minValue,
                maxValue,
                tips            : `${Lang.getText(LangTextType.B0319)}: [${minValue}, ${maxValue}]\n${Lang.getText(LangTextType.A0238)}`,
                callback        : panel => {
                    Twns.User.UserProxy.reqUserSetMapRating(mapId, panel.getInputValue());
                },
            });
        }

        private _onTouchedBtnSpectate(): void {
            Twns.PanelHelpers.open(Twns.PanelHelpers.PanelDict.MpwSpectatePanel, void 0);
        }

        private _onTouchedBtnSetDraw(): void {
            if (!this._checkCanDoAction()) {
                Twns.FloatText.show(Lang.getText(LangTextType.A0239));
                return;
            }

            const war = this._getWar();
            if (war.getPlayerInTurn().getUserId() !== Twns.User.UserModel.getSelfUserId()) {
                Twns.FloatText.show(Lang.getText(LangTextType.A0242));
                return;
            }
            if (war.getPlayerInTurn().getHasVotedForDraw()) {
                Twns.FloatText.show(Lang.getText(LangTextType.A0240));
                return;
            }

            const actionPlanner = war.getActionPlanner();
            if (war.getDrawVoteManager().getRemainingVotes() == null) {
                Twns.PanelHelpers.open(Twns.PanelHelpers.PanelDict.CommonConfirmPanel, {
                    content : Lang.getText(LangTextType.A0031),
                    callback: () => actionPlanner.setStateRequestingPlayerVoteForDraw(true),
                });
            } else {
                Twns.PanelHelpers.open(Twns.PanelHelpers.PanelDict.CommonConfirmPanel, {
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
                Twns.FloatText.show(Lang.getText(LangTextType.A0239));
                return;
            }

            const war = this._getWar();
            if (war.getPlayerInTurn().getUserId() !== Twns.User.UserModel.getSelfUserId()) {
                Twns.FloatText.show(Lang.getText(LangTextType.A0242));
                return;
            }

            Twns.PanelHelpers.open(Twns.PanelHelpers.PanelDict.CommonConfirmPanel, {
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
                Twns.FloatText.show(Lang.getText(LangTextType.A0239));
                return;
            }

            Twns.PanelHelpers.open(Twns.PanelHelpers.PanelDict.CommonConfirmPanel, {
                title   : Lang.getText(LangTextType.B0652),
                content : Lang.getText(LangTextType.A0225),
                callback: () => {
                    const war = this._getWar();
                    if (war.getPlayerLoggedIn() != null) {
                        Twns.FlowManager.gotoMyWarListPanel(war.getWarType());
                    } else {
                        Twns.FlowManager.gotoWatchWarListPanel();
                    }
                },
            });
        }

        private _onTouchedBtnGotoLobby(): void {
            if (!this._checkCanDoAction()) {
                Twns.FloatText.show(Lang.getText(LangTextType.A0239));
                return;
            }

            Twns.PanelHelpers.open(Twns.PanelHelpers.PanelDict.CommonConfirmPanel, {
                title   : Lang.getText(LangTextType.B0054),
                content : Lang.getText(LangTextType.A0025),
                callback: () => Twns.FlowManager.gotoLobby(),
            });
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Functions for view.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        protected async _showOpenAnimation(): Promise<void> {
            Twns.Helpers.resetTween({
                obj         : this._imgMask,
                beginProps  : { alpha: 0 },
                endProps    : { alpha: 1 },
            });
            Twns.Helpers.resetTween({
                obj         : this._group,
                beginProps  : { alpha: 0, verticalCenter: 40 },
                endProps    : { alpha: 1, verticalCenter: 0 },
            });

            await Twns.Helpers.wait(Twns.CommonConstants.DefaultTweenTime);
        }
        protected async _showCloseAnimation(): Promise<void> {
            Twns.Helpers.resetTween({
                obj         : this._imgMask,
                beginProps  : { alpha: 1 },
                endProps    : { alpha: 0 },
            });
            Twns.Helpers.resetTween({
                obj         : this._group,
                beginProps  : { alpha: 1, verticalCenter: 0 },
                endProps    : { alpha: 0, verticalCenter: 40 },
            });

            await Twns.Helpers.wait(Twns.CommonConstants.DefaultTweenTime);
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
            this._btnUnitOpacity.label = `${Lang.getText(LangTextType.B0747)}: ${Twns.User.UserModel.getSelfSettingsOpacitySettings()?.unitOpacity ?? 100}%`;
        }

        private _updateBtnMapRating(): void {
            const btn   = this._btnMapRating;
            const mapId = this._getWar().getMapId();
            if (mapId == null) {
                btn.visible = false;
            } else {
                btn.visible = true;
                btn.label   = `${Lang.getText(LangTextType.B0804)}: ${Twns.User.UserModel.getMapRating(mapId) ?? `--`}`;
            }
        }

        private async _updateBtnSpectate(): Promise<void> {
            const info = await WatchWar.WwModel.getWatchIncomingInfo(Twns.Helpers.getExisted(this._getWar().getWarId()));
            this._btnSpectate.setRedVisible(!!info?.requestSrcUserIdArray?.length);
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Other functions.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _checkCanDoAction(): boolean {
            const war = this._getWar();
            return (war.checkIsHumanInTurn())                                           &&
                (war.getTurnManager().getPhaseCode() === Twns.Types.TurnPhaseCode.Main)      &&
                (war.getActionPlanner().getState() === Twns.Types.ActionPlannerState.Idle);
        }
    }
}

// export default TwnsMpwWarMenuPanel;
