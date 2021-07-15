
import TwnsUiPanel                      from "../../tools/ui/UiPanel";
import TwnsUiButton                      from "../../tools/ui/UiButton";
import TwnsUiLabel                      from "../../tools/ui/UiLabel";
import ChatPanel = TwnsChatPanel.ChatPanel;import TwnsChatPanel                    from "../../chat/view/ChatPanel";
import CommonConfirmPanel = TwnsCommonConfirmPanel.CommonConfirmPanel;import TwnsCommonConfirmPanel           from "../../common/view/CommonConfirmPanel";
import UserPanel = TwnsUserPanel.UserPanel;import TwnsUserPanel                    from "../../user/view/UserPanel";
import MpwWar= TwnsMpwWar.MpwWar;import TwnsMpwWar                       from "../../multiPlayerWar/model/MpwWar";
import BwCoListPanel = TwnsBwCoListPanel.BwCoListPanel;import TwnsBwCoListPanel                from "../../baseWar/view/BwCoListPanel";
import { MpwActionPlanner }             from "../model/MpwActionPlanner";
import { MpwWarMenuPanel }              from "./MpwWarMenuPanel";
import BwUnitListPanel = TwnsBwUnitListPanel.BwUnitListPanel;import TwnsBwUnitListPanel              from "../../baseWar/view/BwUnitListPanel";
import TwnsLangTextType             from "../../tools/lang/LangTextType";
import TwnsNotifyType               from "../../tools/notify/NotifyType";
import Types                        from "../../tools/helpers/Types";
import ConfigManager                from "../../tools/helpers/ConfigManager";
import FloatText                    from "../../tools/helpers/FloatText";
import Helpers                      from "../../tools/helpers/Helpers";
import Lang                         from "../../tools/lang/Lang";
import WarCommonHelpers             from "../../tools/warHelpers/WarCommonHelpers";
import ChatModel                    from "../../chat/model/ChatModel";
import MpwModel                     from "../../multiPlayerWar/model/MpwModel";
import MpwProxy                     from "../../multiPlayerWar/model/MpwProxy";

namespace TwnsMpwTopPanel {
    import LangTextType     = TwnsLangTextType.LangTextType;
    import NotifyType       = TwnsNotifyType.NotifyType;

    export class MpwTopPanel extends TwnsUiPanel.UiPanel<void> {
        protected readonly _LAYER_TYPE   = Types.LayerType.Hud0;
        protected readonly _IS_EXCLUSIVE = false;

        private static _instance: MpwTopPanel;

        private _groupPlayer        : eui.Group;
        private _labelPlayer        : TwnsUiLabel.UiLabel;
        private _labelFund          : TwnsUiLabel.UiLabel;
        private _groupTimer         : eui.Group;
        private _labelTimerTitle    : TwnsUiLabel.UiLabel;
        private _labelTimer         : TwnsUiLabel.UiLabel;
        private _groupCo            : eui.Group;
        private _labelCo            : TwnsUiLabel.UiLabel;
        private _labelCurrEnergy    : TwnsUiLabel.UiLabel;
        private _labelPowerEnergy   : TwnsUiLabel.UiLabel;
        private _labelZoneEnergy    : TwnsUiLabel.UiLabel;
        private _btnChat            : TwnsUiButton.UiButton;
        private _btnUnitList        : TwnsUiButton.UiButton;
        private _btnFindBuilding    : TwnsUiButton.UiButton;
        private _btnEndTurn         : TwnsUiButton.UiButton;
        private _btnCancel          : TwnsUiButton.UiButton;
        private _btnMenu            : TwnsUiButton.UiButton;

        private _war    : MpwWar;

        public static show(): void {
            if (!MpwTopPanel._instance) {
                MpwTopPanel._instance = new MpwTopPanel();
            }
            MpwTopPanel._instance.open(undefined);
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
                { type: NotifyType.LanguageChanged,                callback: this._onNotifyLanguageChanged },
                { type: NotifyType.TimeTick,                       callback: this._onNotifyTimeTick },
                { type: NotifyType.BwTurnPhaseCodeChanged,         callback: this._onNotifyBwTurnPhaseCodeChanged },
                { type: NotifyType.BwPlayerFundChanged,            callback: this._onNotifyBwPlayerFundChanged },
                { type: NotifyType.BwPlayerIndexInTurnChanged,     callback: this._onNotifyBwPlayerIndexInTurnChanged },
                { type: NotifyType.BwCoEnergyChanged,              callback: this._onNotifyBwCoEnergyChanged },
                { type: NotifyType.BwCoUsingSkillTypeChanged,      callback: this._onNotifyBwCoUsingSkillChanged },
                { type: NotifyType.BwActionPlannerStateChanged,    callback: this._onNotifyBwActionPlannerStateChanged },
                { type: NotifyType.MsgChatGetAllReadProgressList,  callback: this._onMsgChatGetAllReadProgressList },
                { type: NotifyType.MsgChatUpdateReadProgress,      callback: this._onMsgChatUpdateReadProgress },
                { type: NotifyType.MsgChatGetAllMessages,          callback: this._onMsgChatGetAllMessages },
                { type: NotifyType.MsgChatAddMessage,              callback: this._onMsgChatAddMessage },
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

            this._war = MpwModel.getWar();
            this._updateView();
        }

        protected async _onClosed(): Promise<void> {
            this._war = null;
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Callbacks.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _onNotifyLanguageChanged(): void {
            this._updateComponentsForLanguage();
        }
        private _onNotifyTimeTick(): void {
            this._updateGroupTimer();

            const war = this._war;
            if ((war)                           &&
                (!war.getIsExecutingAction())   &&
                (war.checkIsBoot())
            ) {
                MpwProxy.reqMpwCommonHandleBoot(war.getWarId());
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
            this._updateView();
        }
        private _onNotifyBwCoEnergyChanged(): void {
            this._updateLabelCoAndEnergy();
        }
        private _onNotifyBwCoUsingSkillChanged(): void {
            this._updateLabelCoAndEnergy();
        }
        private _onNotifyBwActionPlannerStateChanged(): void {
            this._updateBtnUnitList();
            this._updateBtnEndTurn();
            this._updateBtnCancel();
        }

        private _onMsgChatGetAllReadProgressList(): void {
            this._updateBtnChat();
        }
        private _onMsgChatUpdateReadProgress(): void {
            this._updateBtnChat();
        }
        private _onMsgChatGetAllMessages(): void {
            this._updateBtnChat();
        }
        private _onMsgChatAddMessage(): void {
            this._updateBtnChat();
        }

        private _onTouchedGroupPlayer(): void {
            const userId = this._war.getPlayerInTurn().getUserId();
            (userId) && (UserPanel.show({ userId }));
        }
        private _onTouchedGroupCo(): void {
            BwCoListPanel.show({
                war             : this._war,
                selectedIndex   : Math.max(this._war.getPlayerIndexInTurn() - 1, 0),
            });
            MpwWarMenuPanel.hide();
        }
        private _onTouchedBtnChat(): void {
            MpwWarMenuPanel.hide();
            ChatPanel.show({});
        }
        private _onTouchedBtnUnitList(): void {
            const war           = this._war;
            const actionPlanner = war.getField().getActionPlanner();
            if ((!actionPlanner.checkIsStateRequesting()) && (actionPlanner.getState() !== Types.ActionPlannerState.ExecutingAction)) {
                actionPlanner.setStateIdle();
                BwUnitListPanel.show({ war });
            }
        }
        private _onTouchedBtnFindBuilding(): void {
            const war           = this._war;
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
            const war = this._war;
            if ((war.getDrawVoteManager().getRemainingVotes()) && (!war.getPlayerInTurn().getHasVotedForDraw())) {
                FloatText.show(Lang.getText(LangTextType.A0034));
            } else {
                CommonConfirmPanel.show({
                    title   : Lang.getText(LangTextType.B0036),
                    content : this._getHintForEndTurn(),
                    callback: () => (this._war.getActionPlanner() as MpwActionPlanner).setStateRequestingPlayerEndTurn(),
                });
            }
        }
        private _onTouchedBtnCancel(): void {
            this._war.getField().getActionPlanner().setStateIdle();
        }
        private _onTouchedBtnMenu(): void {
            const actionPlanner = this._war.getActionPlanner();
            if (!actionPlanner.checkIsStateRequesting()) {
                actionPlanner.setStateIdle();
            }
            BwCoListPanel.hide();
            MpwWarMenuPanel.show();
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Functions for views.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _updateView(): void {
            this._updateComponentsForLanguage();
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

        private async _updateLabelPlayer(): Promise<void> {
            const war                   = this._war;
            const player                = war.getPlayerInTurn();
            this._labelPlayer.text      = `${await player.getNickname()} (${Lang.getPlayerForceName(player.getPlayerIndex())}, ${Lang.getUnitAndTileSkinName(player.getUnitAndTileSkinId())})`;
            this._labelPlayer.textColor = player === war.getPlayerLoggedIn() ? 0x00FF00 : 0xFFFFFF;
        }

        private _updateGroupTimer(): void {
            const war       = this._war;
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
            const war               = this._war;
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
            const war = this._war;
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
            const war                   = this._war;
            const turnManager           = war.getTurnManager();
            this._btnEndTurn.visible    = (turnManager.getPlayerIndexInTurn() === war.getPlayerIndexLoggedIn())
                && (turnManager.getPhaseCode() === Types.TurnPhaseCode.Main)
                && (war.getActionPlanner().getState() === Types.ActionPlannerState.Idle);
        }

        private _updateBtnUnitList(): void {
            const war                   = this._war;
            const actionPlanner         = war.getActionPlanner();
            this._btnUnitList.visible   = (!actionPlanner.checkIsStateRequesting()) && (actionPlanner.getState() !== Types.ActionPlannerState.ExecutingAction);
        }

        private _updateBtnFindBuilding(): void {
            const war                       = this._war;
            const turnManager               = war.getTurnManager();
            this._btnFindBuilding.visible   = (turnManager.getPlayerIndexInTurn() === war.getPlayerIndexLoggedIn())
                && (turnManager.getPhaseCode() === Types.TurnPhaseCode.Main);
        }

        private _updateBtnCancel(): void {
            const war               = this._war;
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
            const war           = this._war;
            const playerIndex   = war.getPlayerIndexLoggedIn();
            const unitMap       = war.getUnitMap();
            const hints         = new Array<string>();

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
                            idleBuildingsDict.get(tileType).push(gridIndex);
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

            hints.push(Lang.getText(LangTextType.A0024));
            return hints.join(`\n\n`);
        }
    }
}

export default TwnsMpwTopPanel;
