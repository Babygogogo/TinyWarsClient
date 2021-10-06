
import TwnsBwUnitListPanel              from "../../baseWar/view/BwUnitListPanel";
import TwnsCommonConfirmPanel           from "../../common/view/CommonConfirmPanel";
import MpwModel                         from "../../multiPlayerWar/model/MpwModel";
import MpwProxy                         from "../../multiPlayerWar/model/MpwProxy";
import TwnsSpmCreateSfwSaveSlotsPanel   from "../../singlePlayerMode/view/SpmCreateSfwSaveSlotsPanel";
import TwnsTwWar                        from "../../testWar/model/TwWar";
import CompatibilityHelpers             from "../../tools/helpers/CompatibilityHelpers";
import FloatText                        from "../../tools/helpers/FloatText";
import FlowManager                      from "../../tools/helpers/FlowManager";
import Helpers                          from "../../tools/helpers/Helpers";
import Types                            from "../../tools/helpers/Types";
import Lang                             from "../../tools/lang/Lang";
import TwnsLangTextType                 from "../../tools/lang/LangTextType";
import Notify                           from "../../tools/notify/Notify";
import TwnsNotifyType                   from "../../tools/notify/NotifyType";
import ProtoTypes                       from "../../tools/proto/ProtoTypes";
import TwnsUiButton                     from "../../tools/ui/UiButton";
import TwnsUiImage                      from "../../tools/ui/UiImage";
import TwnsUiLabel                      from "../../tools/ui/UiLabel";
import TwnsUiPanel                      from "../../tools/ui/UiPanel";
import UserModel                        from "../../user/model/UserModel";
import UserProxy                        from "../../user/model/UserProxy";
import TwnsMpwWar                       from "../model/MpwWar";

namespace TwnsMpwWarMenuPanel {
    import CommonConfirmPanel           = TwnsCommonConfirmPanel.CommonConfirmPanel;
    import MpwWar                       = TwnsMpwWar.MpwWar;
    import SpmCreateSfwSaveSlotsPanel   = TwnsSpmCreateSfwSaveSlotsPanel.SpmCreateSfwSaveSlotsPanel;
    import LangTextType                 = TwnsLangTextType.LangTextType;
    import NotifyType                   = TwnsNotifyType.NotifyType;

    export class MpwWarMenuPanel extends TwnsUiPanel.UiPanel<void> {
        protected readonly _LAYER_TYPE   = Types.LayerType.Hud0;
        protected readonly _IS_EXCLUSIVE = false;

        private static _instance: MpwWarMenuPanel;

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
        private readonly _btnSetDraw!           : TwnsUiButton.UiButton;
        private readonly _btnSurrender!         : TwnsUiButton.UiButton;
        private readonly _btnGotoWarList!       : TwnsUiButton.UiButton;
        private readonly _btnGotoLobby!         : TwnsUiButton.UiButton;

        public static show(): void {
            if (!MpwWarMenuPanel._instance) {
                MpwWarMenuPanel._instance = new MpwWarMenuPanel();
            }
            MpwWarMenuPanel._instance.open();
        }
        public static async hide(): Promise<void> {
            if (MpwWarMenuPanel._instance) {
                await MpwWarMenuPanel._instance.close().catch(err => { CompatibilityHelpers.showError(err); throw err; });
            }
        }
        public static getIsOpening(): boolean {
            const instance = MpwWarMenuPanel._instance;
            return instance ? instance.getIsOpening() : false;
        }

        public constructor() {
            super();

            this._setIsTouchMaskEnabled();
            this._setIsCloseOnTouchedMask();
            this.skinName = `resource/skins/multiPlayerWar/MpwWarMenuPanel.exml`;
        }

        protected _onOpened(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,                     callback: this._onNotifyLanguageChanged },
                { type: NotifyType.UnitAndTileTextureVersionChanged,    callback: this._onNotifyUnitAndTileTextureVersionChanged },
                { type: NotifyType.MsgSpmCreateSfw,                     callback: this._onNotifyMsgSpmCreateSfw },
            ]);
            this._setUiListenerArray([
                { ui: this._btnClose,                                   callback: this.close },
                { ui: this._btnSync,                                    callback: this._onTouchedBtnSync },
                { ui: this._btnUnitList,                                callback: this._onTouchedBtnUnitList },
                { ui: this._btnDeleteUnit,                              callback: this._onTouchedBtnDeleteUnit },
                { ui: this._btnSimulation,                              callback: this._onTouchedBtnSimulation },
                { ui: this._btnFreeMode,                                callback: this._onTouchedBtnFreeMode },
                { ui: this._btnSetPath,                                 callback: this._onTouchedBtnSetPath },
                { ui: this._btnSetDraw,                                 callback: this._onTouchedBtnSetDraw },
                { ui: this._btnSurrender,                               callback: this._onTouchedBtnSurrender },
                { ui: this._btnGotoWarList,                             callback: this._onTouchedBtnGotoWarList },
                { ui: this._btnGotoLobby,                               callback: this._onTouchedBtnGotoLobby },
            ]);

            this._showOpenAnimation();

            this._updateView();

            Notify.dispatch(NotifyType.BwWarMenuPanelOpened);
        }
        protected async _onClosed(): Promise<void> {
            await this._showCloseAnimation().catch(err => { CompatibilityHelpers.showError(err); throw err; });

            Notify.dispatch(NotifyType.BwWarMenuPanelClosed);
        }

        private _getWar(): MpwWar {
            return Helpers.getExisted(MpwModel.getWar());
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
        private _onNotifyMsgSpmCreateSfw(e: egret.Event): void {
            const data = e.data as ProtoTypes.NetMessage.MsgSpmCreateSfw.IS;
            CommonConfirmPanel.show({
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

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Callbacks for ui.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _onTouchedBtnSync(): void {
            const war = this._getWar();
            MpwProxy.reqMpwCommonSyncWar(
                war,
                war.getActionPlanner().checkIsStateRequesting()
                    ? Types.SyncWarRequestType.PlayerForce
                    : Types.SyncWarRequestType.PlayerRequest
            );
            this.close();
        }

        private _onTouchedBtnUnitList(): void {
            TwnsBwUnitListPanel.BwUnitListPanel.show({
                war: this._getWar(),
            });
            this.close();
        }

        private _onTouchedBtnDeleteUnit(): void {
            if (!this._checkCanDoAction()) {
                FloatText.show(Lang.getText(LangTextType.A0239));
                return;
            }

            const war = this._getWar();
            if (war.getPlayerInTurn().getUserId() !== UserModel.getSelfUserId()) {
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
            SpmCreateSfwSaveSlotsPanel.show(war.serializeForCreateSfw());
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
            const errorCode = await (new TwnsTwWar.TwWar()).getErrorCodeForInit(warData).catch(err => { CompatibilityHelpers.showError(err); throw err; });
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

        private _onTouchedBtnSetDraw(): void {
            if (!this._checkCanDoAction()) {
                FloatText.show(Lang.getText(LangTextType.A0239));
                return;
            }

            const war = this._getWar();
            if (war.getPlayerInTurn().getUserId() !== UserModel.getSelfUserId()) {
                FloatText.show(Lang.getText(LangTextType.A0242));
                return;
            }
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
            if (war.getPlayerInTurn().getUserId() !== UserModel.getSelfUserId()) {
                FloatText.show(Lang.getText(LangTextType.A0242));
                return;
            }

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
        private _showOpenAnimation(): void {
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
        }
        private _showCloseAnimation(): Promise<void> {
            return new Promise<void>((resolve) => {
                Helpers.resetTween({
                    obj         : this._imgMask,
                    beginProps  : { alpha: 1 },
                    endProps    : { alpha: 0 },
                });
                Helpers.resetTween({
                    obj         : this._group,
                    beginProps  : { alpha: 1, verticalCenter: 0 },
                    endProps    : { alpha: 0, verticalCenter: 40 },
                    callback    : resolve,
                });
            });
        }

        private _updateView(): void {
            this._updateComponentsForLanguage();
        }

        private _updateComponentsForLanguage(): void {
            this._labelTitle.text       = Lang.getText(LangTextType.B0155);
            this._btnSync.label         = Lang.getText(LangTextType.B0089);
            this._btnUnitList.label     = Lang.getText(LangTextType.B0152);
            this._btnDeleteUnit.label   = Lang.getText(LangTextType.B0081);
            this._btnSimulation.label   = Lang.getText(LangTextType.B0325);
            this._btnFreeMode.label     = Lang.getText(LangTextType.B0557);
            this._btnSetPath.label      = Lang.getText(LangTextType.B0430);
            this._btnSetDraw.label      = Lang.getText(LangTextType.B0690);
            this._btnSurrender.label    = Lang.getText(LangTextType.B0055);
            this._btnGotoWarList.label  = Lang.getText(LangTextType.B0652);
            this._btnGotoLobby.label    = Lang.getText(LangTextType.B0054);
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

export default TwnsMpwWarMenuPanel;
