
// import TwnsBwUnitListPanel              from "../../baseWar/view/BwUnitListPanel";
// import TwnsCommonConfirmPanel           from "../../common/view/CommonConfirmPanel";
// import SpmProxy                         from "../../singlePlayerMode/model/SpmProxy";
// import TwnsSpmCreateSfwSaveSlotsPanel   from "../../singlePlayerMode/view/SpmCreateSfwSaveSlotsPanel";
// import TwnsTwWar                        from "../../testWar/model/TwWar";
// import TwnsClientErrorCode              from "../../tools/helpers/ClientErrorCode";
// import FloatText                        from "../../tools/helpers/FloatText";
// import FlowManager                      from "../../tools/helpers/FlowManager";
// import Helpers                          from "../../tools/helpers/Helpers";
// import Types                            from "../../tools/helpers/Types";
// import Lang                             from "../../tools/lang/Lang";
// import TwnsLangTextType                 from "../../tools/lang/LangTextType";
// import Notify                           from "../../tools/notify/Notify";
// import TwnsNotifyType                   from "../../tools/notify/NotifyType";
// import ProtoTypes                       from "../../tools/proto/ProtoTypes";
// import TwnsUiButton                     from "../../tools/ui/UiButton";
// import TwnsUiImage                      from "../../tools/ui/UiImage";
// import TwnsUiLabel                      from "../../tools/ui/UiLabel";
// import TwnsUiPanel                      from "../../tools/ui/UiPanel";
// import UserModel                        from "../../user/model/UserModel";
// import UserProxy                        from "../../user/model/UserProxy";
// import SpwModel                         from "../model/SpwModel";
// import TwnsSpwWar                       from "../model/SpwWar";
// import TwnsSpwLoadWarPanel              from "./SpwLoadWarPanel";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace TwnsSpwWarMenuPanel {
    import ClientErrorCode              = TwnsClientErrorCode.ClientErrorCode;
    import LangTextType                 = TwnsLangTextType.LangTextType;
    import NotifyType                   = TwnsNotifyType.NotifyType;

    export type OpenData = void;
    export class SpwWarMenuPanel extends TwnsUiPanel2.UiPanel2<OpenData> {
        private readonly _imgMask!              : TwnsUiImage.UiImage;
        private readonly _group!                : eui.Group;
        private readonly _labelTitle!           : TwnsUiLabel.UiLabel;
        private readonly _btnClose!             : TwnsUiButton.UiButton;

        private readonly _btnSaveGame!          : TwnsUiButton.UiButton;
        private readonly _btnLoadGame!          : TwnsUiButton.UiButton;
        private readonly _btnUnitList!          : TwnsUiButton.UiButton;
        private readonly _btnDeleteUnit!        : TwnsUiButton.UiButton;
        private readonly _btnSimulation!        : TwnsUiButton.UiButton;
        private readonly _btnFreeMode!          : TwnsUiButton.UiButton;
        private readonly _btnSetPath!           : TwnsUiButton.UiButton;
        private readonly _btnDeleteGame!        : TwnsUiButton.UiButton;
        private readonly _btnSetDraw!           : TwnsUiButton.UiButton;
        private readonly _btnSurrender!         : TwnsUiButton.UiButton;
        private readonly _btnGotoWarList!       : TwnsUiButton.UiButton;
        private readonly _btnGotoLobby!         : TwnsUiButton.UiButton;

        private _war?           : TwnsSpwWar.SpwWar;

        protected _onOpening(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,                     callback: this._onNotifyLanguageChanged },
                { type: NotifyType.UnitAndTileTextureVersionChanged,    callback: this._onNotifyUnitAndTileTextureVersionChanged },
                { type: NotifyType.MsgSpmSaveScw,                       callback: this._onMsgSpmSaveScw },
                { type: NotifyType.MsgSpmSaveSfw,                       callback: this._onMsgSpmSaveSfw },
                { type: NotifyType.MsgSpmCreateSfw,                     callback: this._onMsgSpmCreateSfw },
                { type: NotifyType.MsgSpmDeleteWarSaveSlot,             callback: this._onNotifyMsgSpmDeleteWarSaveSlot },
            ]);
            this._setUiListenerArray([
                { ui: this._btnClose,                                   callback: this.close },
                { ui: this._btnSaveGame,                                callback: this._onTouchedBtnSaveGame },
                { ui: this._btnLoadGame,                                callback: this._onTouchedBtnLoadGame },
                { ui: this._btnUnitList,                                callback: this._onTouchedBtnUnitList },
                { ui: this._btnDeleteUnit,                              callback: this._onTouchedBtnDeleteUnit },
                { ui: this._btnSimulation,                              callback: this._onTouchedBtnSimulation },
                { ui: this._btnFreeMode,                                callback: this._onTouchedBtnFreeMode },
                { ui: this._btnSetPath,                                 callback: this._onTouchedBtnSetPath },
                { ui: this._btnDeleteGame,                              callback: this._onTouchedBtnDeleteGame },
                { ui: this._btnSetDraw,                                 callback: this._onTouchedBtnSetDraw },
                { ui: this._btnSurrender,                               callback: this._onTouchedBtnSurrender },
                { ui: this._btnGotoWarList,                             callback: this._onTouchedBtnGotoWarList },
                { ui: this._btnGotoLobby,                               callback: this._onTouchedBtnGotoLobby },
            ]);
            this._setIsTouchMaskEnabled();
            this._setIsCloseOnTouchedMask();
        }
        protected async _updateOnOpenDataChanged(): Promise<void> {
            const war = Helpers.getExisted(SpwModel.getWar());
            this._setWar(war);

            this._updateView();
        }
        protected _onClosing(): void {
            delete this._war;
        }

        private _setWar(war: TwnsSpwWar.SpwWar): void {
            this._war = war;
        }
        private _getWar(): TwnsSpwWar.SpwWar {
            return Helpers.getExisted(this._war);
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Callbacks for notify.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _onNotifyUnitAndTileTextureVersionChanged(): void {
            this._updateView();
        }

        private _onMsgSpmSaveScw(): void {
            FloatText.show(Lang.getText(LangTextType.A0073));
        }

        private _onMsgSpmSaveSfw(): void {
            FloatText.show(Lang.getText(LangTextType.A0073));
        }

        private _onMsgSpmCreateSfw(e: egret.Event): void {
            const data = e.data as ProtoTypes.NetMessage.MsgSpmCreateSfw.IS;
            TwnsCommonConfirmPanel.CommonConfirmPanel.show({
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

        private _onNotifyMsgSpmDeleteWarSaveSlot(): void {
            FloatText.show(Lang.getFormattedText(LangTextType.A0141));
        }

        private _onNotifyLanguageChanged(): void {
            this._updateComponentsForLanguage();
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Callbacks for ui.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _onTouchedBtnSaveGame(): void {
            if (!this._checkCanDoAction()) {
                FloatText.show(Lang.getText(LangTextType.A0239));
                return;
            }

            const war = this._getWar();
            TwnsCommonConfirmPanel.CommonConfirmPanel.show({
                content : Lang.getText(LangTextType.A0071),
                callback: () => {
                    const warType = war.getWarType();
                    if ((warType === Types.WarType.ScwFog) || (warType === Types.WarType.ScwStd)) {
                        SpmProxy.reqSpmSaveScw(war);
                    } else if ((warType === Types.WarType.SfwFog) || (warType === Types.WarType.SfwStd)) {
                        SpmProxy.reqSpmSaveSfw(war);
                    } else if ((warType === Types.WarType.SrwFog) || (warType === Types.WarType.SrwStd)) {
                        SpmProxy.reqSpmSaveSrw(war);
                    } else {
                        throw Helpers.newError(`Invalid warType: ${warType}`, ClientErrorCode.SpwWarMenuPanel_OnTOuchedBtnSaveGame_00);
                    }
                },
            });
        }

        private _onTouchedBtnLoadGame(): void {
            if (!this._checkCanDoAction()) {
                FloatText.show(Lang.getText(LangTextType.A0239));
                return;
            }

            TwnsPanelManager.open(TwnsPanelConfig.Dict.SpwLoadWarPanel, void 0);
        }

        private _onTouchedBtnUnitList(): void {
            TwnsPanelManager.open(TwnsPanelConfig.Dict.BwUnitListPanel, {
                war: this._getWar(),
            });
            this.close();
        }

        private _onTouchedBtnDeleteUnit(): void {
            if (!this._checkCanDoAction()) {
                FloatText.show(Lang.getText(LangTextType.A0239));
                return;
            }

            const war           = this._getWar();
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
                TwnsCommonConfirmPanel.CommonConfirmPanel.show({
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
            TwnsPanelManager.open(TwnsPanelConfig.Dict.SpmCreateSfwSaveSlotsPanel, war.serializeForCreateSfw());
        }

        private async _onTouchedBtnFreeMode(): Promise<void> {
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
            const errorCode = await (new TwnsTwWar.TwWar()).getErrorCodeForInit(warData);
            if (errorCode) {
                FloatText.show(Lang.getErrorText(errorCode));
                return;
            }

            TwnsCommonConfirmPanel.CommonConfirmPanel.show({
                content : Lang.getText(LangTextType.A0201),
                callback: () => {
                    FlowManager.gotoMfrCreateSettingsPanel(warData);
                }
            });
        }

        private _onTouchedBtnSetPath(): void {
            const isEnabled = UserModel.getSelfSettingsIsSetPathMode();
            TwnsCommonConfirmPanel.CommonConfirmPanel.show({
                content : Lang.getFormattedText(
                    LangTextType.F0033,
                    Lang.getText(isEnabled ? LangTextType.B0431 : LangTextType.B0432),
                ),
                textForConfirm  : Lang.getText(LangTextType.B0433),
                textForCancel   : Lang.getText(LangTextType.B0434),
                callback: () => {
                    if (!isEnabled) {
                        UserProxy.reqUserSetSettings({
                            isSetPathMode   : true,
                        });
                    }
                },
                callbackOnCancel: () => {
                    if (isEnabled) {
                        UserProxy.reqUserSetSettings({
                            isSetPathMode   : false,
                        });
                    }
                }
            });
        }

        private _onTouchedBtnDeleteGame(): void {
            if (!this._checkCanDoAction()) {
                FloatText.show(Lang.getText(LangTextType.A0239));
                return;
            }

            const war           = this._getWar();
            const saveSlotIndex = war.getSaveSlotIndex();
            TwnsCommonConfirmPanel.CommonConfirmPanel.show({
                content : Lang.getText(LangTextType.A0140),
                callback: () => {
                    SpmProxy.reqSpmDeleteWarSaveSlot(saveSlotIndex);
                },
            });
        }

        private _onTouchedBtnSetDraw(): void {
            if (!this._checkCanDoAction()) {
                FloatText.show(Lang.getText(LangTextType.A0239));
                return;
            }

            const war = this._getWar();
            if (war.getPlayerInTurn().getHasVotedForDraw()) {
                FloatText.show(Lang.getText(LangTextType.A0240));
                return;
            }

            const actionPlanner = war.getActionPlanner();
            if (war.getDrawVoteManager().getRemainingVotes() == null) {
                TwnsCommonConfirmPanel.CommonConfirmPanel.show({
                    content : Lang.getText(LangTextType.A0031),
                    callback: () => actionPlanner.setStateRequestingPlayerVoteForDraw(true),
                });
            } else {
                TwnsCommonConfirmPanel.CommonConfirmPanel.show({
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
            TwnsCommonConfirmPanel.CommonConfirmPanel.show({
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

            TwnsCommonConfirmPanel.CommonConfirmPanel.show({
                title   : Lang.getText(LangTextType.B0652),
                content : Lang.getText(LangTextType.A0225),
                callback: () => FlowManager.gotoMyWarListPanel(this._getWar().getWarType()),
            });
        }

        private _onTouchedBtnGotoLobby(): void {
            if (!this._checkCanDoAction()) {
                FloatText.show(Lang.getText(LangTextType.A0239));
                return;
            }

            TwnsCommonConfirmPanel.CommonConfirmPanel.show({
                title   : Lang.getText(LangTextType.B0054),
                content : Lang.getText(LangTextType.A0025),
                callback: () => FlowManager.gotoLobby(),
            });
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Functions for view.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _updateView(): void {
            this._updateComponentsForLanguage();
        }

        private _updateComponentsForLanguage(): void {
            this._labelTitle.text       = Lang.getText(LangTextType.B0155);
            this._btnSaveGame.label     = Lang.getText(LangTextType.B0260);
            this._btnLoadGame.label     = Lang.getText(LangTextType.B0261);
            this._btnUnitList.label     = Lang.getText(LangTextType.B0152);
            this._btnDeleteUnit.label   = Lang.getText(LangTextType.B0081);
            this._btnSimulation.label   = Lang.getText(LangTextType.B0325);
            this._btnFreeMode.label     = Lang.getText(LangTextType.B0557);
            this._btnSetPath.label      = Lang.getText(LangTextType.B0430);
            this._btnDeleteGame.label   = Lang.getText(LangTextType.B0420);
            this._btnSetDraw.label      = Lang.getText(LangTextType.B0690);
            this._btnSurrender.label    = Lang.getText(LangTextType.B0055);
            this._btnGotoWarList.label  = Lang.getText(LangTextType.B0652);
            this._btnGotoLobby.label    = Lang.getText(LangTextType.B0054);
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Other functions.
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

        private _checkCanDoAction(): boolean {
            const war = this._getWar();
            return (war.checkIsHumanInTurn())                                           &&
                (war.getTurnManager().getPhaseCode() === Types.TurnPhaseCode.Main)      &&
                (war.getActionPlanner().getState() === Types.ActionPlannerState.Idle);
        }
    }
}

// export default TwnsSpwWarMenuPanel;
