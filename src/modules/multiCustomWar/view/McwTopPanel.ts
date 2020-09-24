
namespace TinyWars.MultiCustomWar {
    import BwHelpers        = BaseWar.BwHelpers;
    import FloatText        = Utility.FloatText;
    import Lang             = Utility.Lang;
    import Helpers          = Utility.Helpers;
    import Notify           = Utility.Notify;
    import Types            = Utility.Types;

    export class McwTopPanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Hud0;
        protected readonly _IS_EXCLUSIVE = false;

        private static _instance: McwTopPanel;

        private _groupPlayer        : eui.Group;
        private _labelPlayer        : GameUi.UiLabel;
        private _labelFund          : GameUi.UiLabel;
        private _groupTimer         : eui.Group;
        private _labelTimerTitle    : GameUi.UiLabel;
        private _labelTimer         : GameUi.UiLabel;
        private _groupCo            : eui.Group;
        private _labelCo            : GameUi.UiLabel;
        private _labelCurrEnergy    : GameUi.UiLabel;
        private _labelPowerEnergy   : GameUi.UiLabel;
        private _labelZoneEnergy    : GameUi.UiLabel;
        private _btnChat            : GameUi.UiButton;
        private _btnUnitList        : GameUi.UiButton;
        private _btnFindBuilding    : GameUi.UiButton;
        private _btnEndTurn         : GameUi.UiButton;
        private _btnCancel          : GameUi.UiButton;
        private _btnMenu            : GameUi.UiButton;

        private _war    : McwWar;

        public static show(): void {
            if (!McwTopPanel._instance) {
                McwTopPanel._instance = new McwTopPanel();
            }
            McwTopPanel._instance.open();
        }

        public static hide(): void {
            if (McwTopPanel._instance) {
                McwTopPanel._instance.close();
            }
        }

        private constructor() {
            super();

            this.skinName = "resource/skins/multiCustomWar/McwTopPanel.exml";
        }

        protected _onFirstOpened(): void {
            this._notifyListeners = [
                { type: Notify.Type.LanguageChanged,                callback: this._onNotifyLanguageChanged },
                { type: Notify.Type.TimeTick,                       callback: this._onNotifyTimeTick },
                { type: Notify.Type.BwTurnPhaseCodeChanged,         callback: this._onNotifyMcwTurnPhaseCodeChanged },
                { type: Notify.Type.BwPlayerFundChanged,            callback: this._onNotifyMcwPlayerFundChanged },
                { type: Notify.Type.BwPlayerIndexInTurnChanged,     callback: this._onNotifyMcwPlayerIndexInTurnChanged },
                { type: Notify.Type.BwCoEnergyChanged,              callback: this._onNotifyMcwCoEnergyChanged },
                { type: Notify.Type.BwCoUsingSkillTypeChanged,      callback: this._onNotifyMcwCoUsingSkillChanged },
                { type: Notify.Type.BwActionPlannerStateChanged,    callback: this._onNotifyMcwActionPlannerStateChanged },
                { type: Notify.Type.SChatGetAllReadProgressList,    callback: this._onNotifyChatGetAllReadProgressList },
                { type: Notify.Type.SChatUpdateReadProgress,        callback: this._onNotifyChatUpdateReadProgress },
                { type: Notify.Type.SChatGetAllMessages,            callback: this._onNotifyChatGetAllMessages },
                { type: Notify.Type.SChatAddMessage,                callback: this._onNotifyChatAddMessage },
            ];
            this._uiListeners = [
                { ui: this._groupPlayer,        callback: this._onTouchedGroupPlayer },
                { ui: this._groupCo,            callback: this._onTouchedGroupCo },
                { ui: this._btnChat,            callback: this._onTouchedBtnChat },
                { ui: this._btnUnitList,        callback: this._onTouchedBtnUnitList, },
                { ui: this._btnFindBuilding,    callback: this._onTouchedBtnFindBuilding, },
                { ui: this._btnEndTurn,         callback: this._onTouchedBtnEndTurn, },
                { ui: this._btnCancel,          callback: this._onTouchedBtnCancel },
                { ui: this._btnMenu,            callback: this._onTouchedBtnMenu, },
            ];
        }

        protected _onOpened(): void {
            this._war = McwModel.getWar();
            this._updateView();
        }

        protected _onClosed(): void {
            delete this._war;
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Callbacks.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _onNotifyLanguageChanged(e: egret.Event): void {
            this._updateComponentsForLanguage();
        }
        private _onNotifyTimeTick(e: egret.Event): void {
            this._updateGroupTimer();

            const war = this._war;
            if ((war)                           &&
                (!war.getIsExecutingAction())   &&
                (war.checkIsBoot())
            ) {
                McwProxy.reqMcwCommonHandleBoot(war.getWarId());
            }
        }
        private _onNotifyMcwTurnPhaseCodeChanged(e: egret.Event): void {
            this._updateBtnEndTurn();
            this._updateBtnFindBuilding();
            this._updateBtnCancel();
        }
        private _onNotifyMcwPlayerFundChanged(e: egret.Event): void {
            this._updateLabelFund();
        }
        private _onNotifyMcwPlayerIndexInTurnChanged(e: egret.Event): void {
            this._updateView();
        }
        private _onNotifyMcwCoEnergyChanged(e: egret.Event): void {
            this._updateLabelCoAndEnergy();
        }
        private _onNotifyMcwCoUsingSkillChanged(e: egret.Event): void {
            this._updateLabelCoAndEnergy();
        }
        private _onNotifyMcwActionPlannerStateChanged(e: egret.Event): void {
            this._updateBtnUnitList();
            this._updateBtnEndTurn();
            this._updateBtnCancel();
        }

        private _onNotifyChatGetAllReadProgressList(e: egret.Event): void {
            this._updateBtnChat();
        }
        private _onNotifyChatUpdateReadProgress(e: egret.Event): void {
            this._updateBtnChat();
        }
        private _onNotifyChatGetAllMessages(e: egret.Event): void {
            this._updateBtnChat();
        }
        private _onNotifyChatAddMessage(e: egret.Event): void {
            this._updateBtnChat();
        }

        private _onTouchedGroupPlayer(e: egret.TouchEvent): void {
            const userId = this._war.getPlayerInTurn().getUserId();
            (userId) && (User.UserPanel.show(userId));
        }
        private _onTouchedGroupCo(e: egret.TouchEvent): void {
            McwCoListPanel.show(Math.max(this._war.getPlayerIndexInTurn() - 1, 0));
            McwWarMenuPanel.hide();
        }
        private _onTouchedBtnChat(e: egret.TouchEvent): void {
            McwWarMenuPanel.hide();
            Chat.ChatPanel.show({});
        }
        private _onTouchedBtnUnitList(e: egret.TouchEvent): void {
            const actionPlanner = this._war.getField().getActionPlanner();
            if ((!actionPlanner.checkIsStateRequesting()) && (actionPlanner.getState() !== Types.ActionPlannerState.ExecutingAction)) {
                actionPlanner.setStateIdle();
                McwUnitListPanel.show();
            }
        }
        private _onTouchedBtnFindBuilding(e: egret.TouchEvent): void {
            const war           = this._war;
            const field         = war.getField();
            const actionPlanner = field.getActionPlanner();
            if ((!actionPlanner.checkIsStateRequesting()) && (actionPlanner.getState() !== Types.ActionPlannerState.ExecutingAction)) {
                actionPlanner.setStateIdle();

                const gridIndex = BwHelpers.getIdleBuildingGridIndex(war);
                if (!gridIndex) {
                    FloatText.show(Lang.getText(Lang.Type.A0077));
                } else {
                    const cursor = field.getCursor();
                    cursor.setGridIndex(gridIndex);
                    cursor.updateView();
                    war.getView().moveGridToCenter(gridIndex);
                }
            }
        }
        private _onTouchedBtnEndTurn(e: egret.TouchEvent): void {
            const war = this._war;
            if ((war.getRemainingVotesForDraw()) && (!war.getPlayerInTurn().getHasVotedForDraw())) {
                FloatText.show(Lang.getText(Lang.Type.A0034));
            } else {
                Common.CommonConfirmPanel.show({
                    title   : Lang.getText(Lang.Type.B0036),
                    content : this._getHintForEndTurn(),
                    callback: () => (this._war.getActionPlanner() as McwActionPlanner).setStateRequestingPlayerEndTurn(),
                });
            }
        }
        private _onTouchedBtnCancel(e: egret.TouchEvent): void {
            this._war.getField().getActionPlanner().setStateIdle();
        }
        private _onTouchedBtnMenu(e: egret.TouchEvent): void {
            const actionPlanner = this._war.getActionPlanner();
            if (!actionPlanner.checkIsStateRequesting()) {
                actionPlanner.setStateIdle();
            }
            McwCoListPanel.hide();
            McwWarMenuPanel.show();
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
            this._labelTimerTitle.text = Lang.getText(Lang.Type.B0188);
        }

        private async _updateLabelPlayer(): Promise<void> {
            const war                   = this._war;
            const player                = war.getPlayerInTurn();
            this._labelPlayer.text      = `${await player.getNickname()} (${Lang.getPlayerForceName(player.getPlayerIndex())})`;
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
                this._labelCo.text  = `${coId == null ? "----" : Utility.ConfigManager.getCoBasicCfg(war.getConfigVersion(), coId).name}`;

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
            this._btnChat.setRedVisible(Chat.ChatModel.checkHasUnreadMessage());
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Util functions.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _getHintForEndTurn(): string {
            const war           = this._war;
            const playerIndex   = war.getPlayerIndexLoggedIn();
            const unitMap       = war.getUnitMap();
            const hints         = new Array<string>();

            let idleUnitsCount = 0;
            unitMap.forEachUnitOnMap(unit => {
                if ((unit.getPlayerIndex() === playerIndex) && (unit.getActionState() === Types.UnitActionState.Idle)) {
                    ++idleUnitsCount;
                }
            });
            (idleUnitsCount) && (hints.push(Lang.getFormattedText(Lang.Type.F0006, idleUnitsCount)));

            let idleBuildingsCount = 0;
            war.getTileMap().forEachTile(tile => {
                if ((tile.checkIsUnitProducerForPlayer(playerIndex)) && (!unitMap.getUnitOnMap(tile.getGridIndex()))) {
                    ++idleBuildingsCount;
                }
            });
            (idleBuildingsCount) && (hints.push(Lang.getFormattedText(Lang.Type.F0007, idleBuildingsCount)));

            hints.push(Lang.getText(Lang.Type.A0024));
            return hints.join(`\n`);
        }
    }
}
