
import TwnsBwUnitListPanel      from "../../baseWar/view/BwUnitListPanel";
import ChatModel                from "../../chat/model/ChatModel";
import TwnsChatPanel            from "../../chat/view/ChatPanel";
import TwnsCommonCoListPanel    from "../../common/view/CommonCoListPanel";
import TwnsCommonConfirmPanel   from "../../common/view/CommonConfirmPanel";
import MpwModel                 from "../../multiPlayerWar/model/MpwModel";
import MpwProxy                 from "../../multiPlayerWar/model/MpwProxy";
import TwnsMpwWar               from "../../multiPlayerWar/model/MpwWar";
import ConfigManager            from "../../tools/helpers/ConfigManager";
import FloatText                from "../../tools/helpers/FloatText";
import Helpers                  from "../../tools/helpers/Helpers";
import SoundManager             from "../../tools/helpers/SoundManager";
import Timer                    from "../../tools/helpers/Timer";
import Types                    from "../../tools/helpers/Types";
import Lang                     from "../../tools/lang/Lang";
import TwnsLangTextType         from "../../tools/lang/LangTextType";
import TwnsNotifyType           from "../../tools/notify/NotifyType";
import ProtoTypes               from "../../tools/proto/ProtoTypes";
import TwnsUiButton             from "../../tools/ui/UiButton";
import TwnsUiLabel              from "../../tools/ui/UiLabel";
import TwnsUiPanel              from "../../tools/ui/UiPanel";
import WarCommonHelpers         from "../../tools/warHelpers/WarCommonHelpers";
import UserModel                from "../../user/model/UserModel";
import UserProxy                from "../../user/model/UserProxy";
import TwnsUserPanel            from "../../user/view/UserPanel";
import TwnsMpwActionPlanner     from "../model/MpwActionPlanner";
import TwnsMpwWarMenuPanel      from "./MpwWarMenuPanel";

namespace TwnsMpwTopPanel {
    import ChatPanel            = TwnsChatPanel.ChatPanel;
    import CommonConfirmPanel   = TwnsCommonConfirmPanel.CommonConfirmPanel;
    import UserPanel            = TwnsUserPanel.UserPanel;
    import MpwWar               = TwnsMpwWar.MpwWar;
    import CommonCoListPanel    = TwnsCommonCoListPanel.CommonCoListPanel;
    import MpwActionPlanner     = TwnsMpwActionPlanner.MpwActionPlanner;
    import MpwWarMenuPanel      = TwnsMpwWarMenuPanel.MpwWarMenuPanel;
    import BwUnitListPanel      = TwnsBwUnitListPanel.BwUnitListPanel;
    import LangTextType         = TwnsLangTextType.LangTextType;
    import NotifyType           = TwnsNotifyType.NotifyType;

    export class MpwTopPanel extends TwnsUiPanel.UiPanel<void> {
        protected readonly _LAYER_TYPE   = Types.LayerType.Hud0;
        protected readonly _IS_EXCLUSIVE = false;

        private static _instance: MpwTopPanel;

        private readonly _groupPlayer!      : eui.Group;
        private readonly _labelPlayerState! : TwnsUiLabel.UiLabel;
        private readonly _labelPlayer!      : TwnsUiLabel.UiLabel;
        private readonly _labelFund!        : TwnsUiLabel.UiLabel;
        private readonly _groupTimer!       : eui.Group;
        private readonly _labelTimerTitle!  : TwnsUiLabel.UiLabel;
        private readonly _labelTimer!       : TwnsUiLabel.UiLabel;
        private readonly _groupCo!          : eui.Group;
        private readonly _labelCo!          : TwnsUiLabel.UiLabel;
        private readonly _labelCurrEnergy!  : TwnsUiLabel.UiLabel;
        private readonly _labelPowerEnergy! : TwnsUiLabel.UiLabel;
        private readonly _labelZoneEnergy!  : TwnsUiLabel.UiLabel;
        private readonly _btnChat!          : TwnsUiButton.UiButton;
        private readonly _btnUnitList!      : TwnsUiButton.UiButton;
        private readonly _btnFindBuilding!  : TwnsUiButton.UiButton;
        private readonly _btnEndTurn!       : TwnsUiButton.UiButton;
        private readonly _btnCancel!        : TwnsUiButton.UiButton;
        private readonly _btnMenu!          : TwnsUiButton.UiButton;

        public static show(): void {
            if (!MpwTopPanel._instance) {
                MpwTopPanel._instance = new MpwTopPanel();
            }
            MpwTopPanel._instance.open();
        }

        public static async hide(): Promise<void> {
            if (MpwTopPanel._instance) {
                await MpwTopPanel._instance.close();
            }
        }

        private constructor() {
            super();

            this.skinName = "resource/skins/multiPlayerWar/MpwTopPanel.exml";
        }

        protected _onOpened(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,                 callback: this._onNotifyLanguageChanged },
                { type: NotifyType.TimeTick,                        callback: this._onNotifyTimeTick },
                { type: NotifyType.BwTurnPhaseCodeChanged,          callback: this._onNotifyBwTurnPhaseCodeChanged },
                { type: NotifyType.BwPlayerFundChanged,             callback: this._onNotifyBwPlayerFundChanged },
                { type: NotifyType.BwPlayerIndexInTurnChanged,      callback: this._onNotifyBwPlayerIndexInTurnChanged },
                { type: NotifyType.BwCoEnergyChanged,               callback: this._onNotifyBwCoEnergyChanged },
                { type: NotifyType.BwCoUsingSkillTypeChanged,       callback: this._onNotifyBwCoUsingSkillChanged },
                { type: NotifyType.BwActionPlannerStateChanged,     callback: this._onNotifyBwActionPlannerStateChanged },
                { type: NotifyType.MsgChatGetAllReadProgressList,   callback: this._onNotifyMsgChatGetAllReadProgressList },
                { type: NotifyType.MsgChatUpdateReadProgress,       callback: this._onNotifyMsgChatUpdateReadProgress },
                { type: NotifyType.MsgChatGetAllMessages,           callback: this._onNotifyMsgChatGetAllMessages },
                { type: NotifyType.MsgChatAddMessage,               callback: this._onNotifyMsgChatAddMessage },
                { type: NotifyType.MsgUserGetOnlineState,           callback: this._onNotifyMsgUserGetOnlineState },
            ]);
            this._setUiListenerArray([
                { ui: this._groupPlayer,        callback: this._onTouchedGroupPlayer },
                { ui: this._groupCo,            callback: this._onTouchedGroupCo },
                { ui: this._btnChat,            callback: this._onTouchedBtnChat },
                { ui: this._btnUnitList,        callback: this._onTouchedBtnUnitList, },
                { ui: this._btnFindBuilding,    callback: this._onTouchedBtnFindBuilding, },
                { ui: this._btnEndTurn,         callback: this._onTouchedBtnEndTurn, },
                { ui: this._btnCancel,          callback: this._onTouchedBtnCancel },
                { ui: this._btnMenu,            callback: this._onTouchedBtnMenu, },
            ]);
            this._btnCancel.setShortSfxCode(Types.ShortSfxCode.None);

            this._updateView();
        }

        private _getWar(): MpwWar {
            return Helpers.getExisted(MpwModel.getWar());
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Callbacks.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _onNotifyLanguageChanged(): void {
            this._updateComponentsForLanguage();
        }
        private _onNotifyTimeTick(): void {
            this._updateGroupTimer();

            const war = this._getWar();
            if (war == null) {
                return;
            }

            if ((!war.getIsExecutingAction()) && (war.checkIsBoot())) {
                MpwProxy.reqMpwCommonHandleBoot(Helpers.getExisted(war.getWarId()));
            }

            const userId = war.getPlayerInTurn().getUserId();
            if ((userId != null)                        &&
                (userId !== UserModel.getSelfUserId())  &&
                (Timer.getServerTimestamp() % 60 == 0)
            ) {
                UserProxy.reqUserGetOnlineState(userId);
            }
        }
        private _onNotifyBwTurnPhaseCodeChanged(): void {
            this._updateBtnEndTurn();
            this._updateBtnFindBuilding();
            this._updateBtnCancel();
        }
        private _onNotifyBwPlayerFundChanged(): void {
            this._updateLabelFund();
        }
        private _onNotifyBwPlayerIndexInTurnChanged(): void {
            const war = this._getWar();
            this._updateView();
            SoundManager.playCoBgmWithWar(war, false);

            const userId = war.getPlayerInTurn().getUserId();
            if ((userId != null) && (userId !== UserModel.getSelfUserId())) {
                UserProxy.reqUserGetOnlineState(userId);
            }
        }
        private _onNotifyBwCoEnergyChanged(): void {
            this._updateLabelCoAndEnergy();
        }
        private _onNotifyBwCoUsingSkillChanged(): void {
            this._updateLabelCoAndEnergy();
            SoundManager.playCoBgmWithWar(this._getWar(), false);
        }
        private _onNotifyBwActionPlannerStateChanged(): void {
            this._updateBtnUnitList();
            this._updateBtnEndTurn();
            this._updateBtnCancel();
        }

        private _onNotifyMsgChatGetAllReadProgressList(): void {
            this._updateBtnChat();
        }
        private _onNotifyMsgChatUpdateReadProgress(): void {
            this._updateBtnChat();
        }
        private _onNotifyMsgChatGetAllMessages(): void {
            this._updateBtnChat();
        }
        private _onNotifyMsgChatAddMessage(): void {
            this._updateBtnChat();
        }
        private _onNotifyMsgUserGetOnlineState(e: egret.Event): void {
            const data = e.data as ProtoTypes.NetMessage.MsgUserGetOnlineState.IS;
            if (data.userId === this._getWar().getPlayerInTurn().getUserId()) {
                this._updateLabelPlayerState();
            }
        }

        private _onTouchedGroupPlayer(): void {
            const userId = this._getWar().getPlayerInTurn().getUserId();
            if (userId != null) {
                UserPanel.show({ userId });

                if (userId !== UserModel.getSelfUserId()) {
                    UserProxy.reqUserGetOnlineState(userId);
                }
            }
        }
        private _onTouchedGroupCo(): void {
            CommonCoListPanel.show({
                war             : this._getWar(),
            });
            MpwWarMenuPanel.hide();
        }
        private _onTouchedBtnChat(): void {
            MpwWarMenuPanel.hide();
            ChatPanel.show({});
        }
        private _onTouchedBtnUnitList(): void {
            const war           = this._getWar();
            const actionPlanner = war.getField().getActionPlanner();
            if ((!actionPlanner.checkIsStateRequesting()) && (actionPlanner.getState() !== Types.ActionPlannerState.ExecutingAction)) {
                actionPlanner.setStateIdle();
                BwUnitListPanel.show({ war });
            }
        }
        private _onTouchedBtnFindBuilding(): void {
            const war           = this._getWar();
            const field         = war.getField();
            const actionPlanner = field.getActionPlanner();
            if ((!actionPlanner.checkIsStateRequesting()) && (actionPlanner.getState() !== Types.ActionPlannerState.ExecutingAction)) {
                actionPlanner.setStateIdle();

                const gridIndex = WarCommonHelpers.getIdleBuildingGridIndex(war);
                if (!gridIndex) {
                    FloatText.show(Lang.getText(LangTextType.A0077));
                } else {
                    const cursor = field.getCursor();
                    cursor.setGridIndex(gridIndex);
                    cursor.updateView();
                    war.getView().tweenGridToCentralArea(gridIndex);
                }
            }
        }
        private _onTouchedBtnEndTurn(): void {
            const war = this._getWar();
            if ((war.getDrawVoteManager().getRemainingVotes()) && (!war.getPlayerInTurn().getHasVotedForDraw())) {
                FloatText.show(Lang.getText(LangTextType.A0034));
            } else {
                CommonConfirmPanel.show({
                    title   : Lang.getText(LangTextType.B0036),
                    content : this._getHintForEndTurn(),
                    callback: () => (this._getWar().getActionPlanner() as MpwActionPlanner).setStateRequestingPlayerEndTurn(),
                });
            }
        }
        private _onTouchedBtnCancel(): void {
            this._getWar().getField().getActionPlanner().setStateIdle();
        }
        private _onTouchedBtnMenu(): void {
            const actionPlanner = this._getWar().getActionPlanner();
            if (!actionPlanner.checkIsStateRequesting()) {
                actionPlanner.setStateIdle();
            }
            CommonCoListPanel.hide();
            MpwWarMenuPanel.show();
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Functions for views.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _updateView(): void {
            this._updateComponentsForLanguage();
            this._updateLabelPlayerState();
            this._updateLabelPlayer();
            this._updateGroupTimer();
            this._updateLabelFund();
            this._updateLabelCoAndEnergy();
            this._updateBtnEndTurn();
            this._updateBtnUnitList();
            this._updateBtnFindBuilding();
            this._updateBtnCancel();
            this._updateBtnChat();
        }

        private _updateComponentsForLanguage(): void {
            this._labelTimerTitle.text = Lang.getText(LangTextType.B0188);
        }

        private async _updateLabelPlayerState(): Promise<void> {
            const userId    = this._getWar().getPlayerInTurn().getUserId();
            const label     = this._labelPlayerState;
            if ((userId == null) || (userId === UserModel.getSelfUserId())) {
                label.text      = Lang.getText(LangTextType.B0676);
                label.textColor = Types.ColorValue.Green;
            } else {
                const userPublicInfo = await UserModel.getUserPublicInfo(userId);
                if ((userPublicInfo == null) || (!userPublicInfo.isOnline)) {
                    label.text      = Lang.getText(LangTextType.B0677);
                    label.textColor = Types.ColorValue.Red;
                } else {
                    label.text      = Lang.getText(LangTextType.B0676);
                    label.textColor = (Timer.getServerTimestamp() - Helpers.getExisted(userPublicInfo.lastActivityTime) > 60) ? Types.ColorValue.Yellow : Types.ColorValue.Green;
                }
            }
        }

        private async _updateLabelPlayer(): Promise<void> {
            const war                   = this._getWar();
            const player                = war.getPlayerInTurn();
            this._labelPlayer.text      = `${await player.getNickname()} (${Lang.getPlayerForceName(player.getPlayerIndex())}, ${Lang.getUnitAndTileSkinName(player.getUnitAndTileSkinId())})`;
            this._labelPlayer.textColor = player === war.getPlayerLoggedIn() ? 0x00FF00 : 0xFFFFFF;
        }

        private _updateGroupTimer(): void {
            const war       = this._getWar();
            const group     = this._groupTimer;
            const restTime  = war ? war.getBootRestTime() : null;
            if (restTime == null) {
                group.visible = false;
            } else {
                group.visible = true;

                const label     = this._labelTimer;
                label.text      = Helpers.getTimeDurationText2(restTime);
                label.textColor = restTime >= 30 * 60
                    ? 0xFFFFFF
                    : (restTime >= 5 * 60 ? 0xFFFF00 : 0xFF4400);
            }
        }

        private _updateLabelFund(): void {
            const war               = this._getWar();
            const playerInTurn      = war.getPlayerInTurn();
            if ((war.getFogMap().checkHasFogCurrently())                                                                        &&
                (!war.getPlayerManager().getAliveWatcherTeamIndexesForSelf().has(playerInTurn.getTeamIndex()))
            ) {
                this._labelFund.text = `????`;
            } else {
                this._labelFund.text = `${playerInTurn.getFund()}`;
            }
        }

        private _updateLabelCoAndEnergy(): void {
            const war = this._getWar();
            if ((war) && (war.getIsRunning())) {
                const player        = war.getPlayerInTurn();
                const coId          = player.getCoId();
                this._labelCo.text  = `${coId == null ? "----" : ConfigManager.getCoBasicCfg(war.getConfigVersion(), coId).name}`;

                const skillType = player.getCoUsingSkillType();
                if (skillType === Types.CoSkillType.Power) {
                    this._labelCurrEnergy.text = "COP";
                } else if (skillType === Types.CoSkillType.SuperPower) {
                    this._labelCurrEnergy.text = "SCOP";
                } else {
                    const currentEnergy = player.getCoCurrentEnergy();
                    this._labelCurrEnergy.text = `${currentEnergy != null ? currentEnergy : `--`}`;
                }

                const powerEnergy           = player.getCoPowerEnergy();
                const superPowerEnergy      = player.getCoSuperPowerEnergy();
                this._labelPowerEnergy.text = `P ${powerEnergy == null ? `--` : powerEnergy} / ${superPowerEnergy == null ? `--` : superPowerEnergy}`;

                const zoneEnergyText        = (player.getCoZoneExpansionEnergyList() || []).join(` / `);
                this._labelZoneEnergy.text  = `Z ${zoneEnergyText.length ? zoneEnergyText : `--`}`;
            }
        }

        private _updateBtnEndTurn(): void {
            const war                   = this._getWar();
            const turnManager           = war.getTurnManager();
            this._btnEndTurn.visible    = (turnManager.getPlayerIndexInTurn() === war.getPlayerIndexLoggedIn())
                && (turnManager.getPhaseCode() === Types.TurnPhaseCode.Main)
                && (war.getActionPlanner().getState() === Types.ActionPlannerState.Idle);
        }

        private _updateBtnUnitList(): void {
            const war                   = this._getWar();
            const actionPlanner         = war.getActionPlanner();
            this._btnUnitList.visible   = (!actionPlanner.checkIsStateRequesting()) && (actionPlanner.getState() !== Types.ActionPlannerState.ExecutingAction);
        }

        private _updateBtnFindBuilding(): void {
            const war                       = this._getWar();
            const turnManager               = war.getTurnManager();
            this._btnFindBuilding.visible   = (turnManager.getPlayerIndexInTurn() === war.getPlayerIndexLoggedIn())
                && (turnManager.getPhaseCode() === Types.TurnPhaseCode.Main);
        }

        private _updateBtnCancel(): void {
            const war               = this._getWar();
            const turnManager       = war.getTurnManager();
            const actionPlanner     = war.getActionPlanner();
            const state             = actionPlanner.getState();
            this._btnCancel.visible = (turnManager.getPlayerIndexInTurn() === war.getPlayerIndexLoggedIn())
                && (turnManager.getPhaseCode() === Types.TurnPhaseCode.Main)
                && (state !== Types.ActionPlannerState.Idle)
                && (state !== Types.ActionPlannerState.ExecutingAction)
                && (!actionPlanner.checkIsStateRequesting());
        }

        private _updateBtnChat(): void {
            this._btnChat.setRedVisible(ChatModel.checkHasUnreadMessage());
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Util functions.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _getHintForEndTurn(): string {
            const war           = this._getWar();
            const playerIndex   = war.getPlayerIndexLoggedIn();
            const unitMap       = war.getUnitMap();
            const hints         = new Array<string>();

            if (playerIndex != null) {
                {
                    let idleUnitsCount = 0;
                    for (const unit of unitMap.getAllUnitsOnMap()) {
                        if ((unit.getPlayerIndex() === playerIndex) && (unit.getActionState() === Types.UnitActionState.Idle)) {
                            ++idleUnitsCount;
                        }
                    }
                    (idleUnitsCount) && (hints.push(Lang.getFormattedText(LangTextType.F0006, idleUnitsCount)));
                }

                {
                    const idleBuildingsDict = new Map<Types.TileType, Types.GridIndex[]>();
                    for (const tile of war.getTileMap().getAllTiles()) {
                        if ((tile.checkIsUnitProducerForPlayer(playerIndex)) && (!unitMap.getUnitOnMap(tile.getGridIndex()))) {
                            const tileType  = tile.getType();
                            const gridIndex = tile.getGridIndex();
                            if (!idleBuildingsDict.has(tileType)) {
                                idleBuildingsDict.set(tileType, [gridIndex]);
                            } else {
                                Helpers.getExisted(idleBuildingsDict.get(tileType)).push(gridIndex);
                            }
                        }
                    }
                    const textArrayForBuildings: string[] = [];
                    for (const [tileType, gridIndexArray] of idleBuildingsDict) {
                        textArrayForBuildings.push(Lang.getFormattedText(
                            LangTextType.F0007, gridIndexArray.length,
                            Lang.getTileName(tileType),
                            gridIndexArray.map(v => `(${v.x}, ${v.y})`).join(`, `)),
                        );
                    }
                    (textArrayForBuildings.length) && (hints.push(textArrayForBuildings.join(`\n`)));
                }
            }

            hints.push(Lang.getText(LangTextType.A0024));
            return hints.join(`\n\n`);
        }
    }
}

export default TwnsMpwTopPanel;
