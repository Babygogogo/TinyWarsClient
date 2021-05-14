
namespace TinyWars.SinglePlayerWar.SpwModel {
    import Types                    = Utility.Types;
    import Logger                   = Utility.Logger;
    import Lang                     = Utility.Lang;
    import ProtoTypes               = Utility.ProtoTypes;
    import CommonConstants          = Utility.CommonConstants;
    import WarSerialization         = ProtoTypes.WarSerialization;
    import IWarActionContainer      = ProtoTypes.WarAction.IWarActionContainer;
    import ISpmWarSaveSlotExtraData = ProtoTypes.SinglePlayerMode.ISpmWarSaveSlotExtraData;
    import CommonAlertPanel         = Common.CommonAlertPanel;

    let _war: SpwWar;
    export function init(): void {
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for managing war.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    export async function loadWar({ warData, slotIndex, slotExtraData }: {
        warData         : WarSerialization.ISerialWar;
        slotIndex       : number;
        slotExtraData   : ISpmWarSaveSlotExtraData;
    }): Promise<SpwWar> {
        if (_war) {
            Logger.warn(`SpwModel.loadWar() another war has been loaded already!`);
            unloadWar();
        }

        const war = warData.settingsForScw
            ? new SingleCustomWar.ScwWar()
            : (warData.settingsForSfw
                ? new SingleFreeWar.SfwWar()
                : null
            );
        if (war == null) {
            Logger.error(`SpwModel.loadWar() empty war.`);
            return undefined;
        }

        const initError = await war.init(warData);
        if (initError) {
            Logger.warn(`SpwModel.loadWar() initError: ${initError}`);
            return undefined;
        }

        war.startRunning().startRunningView();
        war.setSaveSlotIndex(slotIndex);
        war.setSaveSlotExtraData(slotExtraData);
        _war = war;
        await checkAndHandleAutoActionsAndRobot();
        await checkAndHandleAutoActions(war);

        return _war;
    }

    export function unloadWar(): void {
        if (_war) {
            _war.stopRunning();
            _war = undefined;
        }
    }

    export function getWar(): SpwWar | undefined {
        return _war;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Util functions.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    export async function handlePlayerAction(action: IWarActionContainer): Promise<void> {
        await checkAndHandleAutoActionsAndRobot();
        await handleAutoActionsAndPlayerAction(action);
        await checkAndHandleAutoActionsAndRobot();
    }

    export async function checkAndHandleAutoActionsAndRobot(): Promise<void> {
        const war = getWar();
        if (war) {
            await checkAndHandleAutoActions(war);
            if (!war.checkIsHumanInTurn()) {
                await handleAutoActionsAndPlayerAction(SpwActionReviser.revise(war, await SpwRobot.getNextAction(war)));
                await checkAndHandleAutoActionsAndRobot();
            }
        }
    }

    async function handleAutoActionsAndPlayerAction(playerAction: IWarActionContainer): Promise<void> {
        const war = getWar();
        if (!checkCanExecuteAction(war)) {
            return;
        }

        if (checkAndEndWar(war)) {
            return;
        }

        await checkAndHandleAutoActions(war);
        if (checkAndEndWar(war)) {
            return;
        }

        playerAction.actionId = war.getExecutedActionManager().getExecutedActionsCount();
        await SpwActionExecutor.checkAndExecute(war, playerAction);
        if (checkAndEndWar(war)) {
            return;
        }

        await checkAndHandleAutoActions(war);
        checkAndEndWar(war);
    }

    function checkAndEndWar(war: SpwWar): boolean {
        if (!war.getIsEnded()) {
            return false;
        } else {
            const callback = () => Utility.FlowManager.gotoLobby();
            if (war.getDrawVoteManager().checkIsDraw()) {
                CommonAlertPanel.show({
                    title   : Lang.getText(Lang.Type.B0088),
                    content : Lang.getText(Lang.Type.A0030),
                    callback,
                });
            } else {
                const humanPlayerList = (war.getPlayerManager() as SpwPlayerManager).getHumanPlayers();
                if (humanPlayerList.length <= 0) {
                    CommonAlertPanel.show({
                        title   : Lang.getText(Lang.Type.B0088),
                        content : Lang.getText(Lang.Type.A0035),
                        callback,
                    });
                } else {
                    CommonAlertPanel.show({
                        title   : Lang.getText(Lang.Type.B0088),
                        content : humanPlayerList.some(v => v.getAliveState() === Types.PlayerAliveState.Alive)
                            ? Lang.getText(Lang.Type.A0022)
                            : Lang.getText(Lang.Type.A0023),
                        callback,
                    });
                }
            }
            return true;
        }
    }

    async function checkAndHandleAutoActions(war: SpwWar): Promise<boolean> {
        if ((war == null) || (war.getIsEnded())) {
            return false;
        }

        // Handle war events.
        const warEventManager = war.getWarEventManager();
        if (warEventManager == null) {
            Logger.error(`SpwModel.checkAndHandleAutoActions() empty warEventManager.`);
            return undefined;
        }

        const callableWarEventId = warEventManager.getCallableWarEventId();
        if (callableWarEventId != null) {
            await handleSystemCallWarEvent(war, callableWarEventId);
            await checkAndHandleAutoActions(war);
            return true;
        }

        // Handle the ending war.
        const playerManager = war.getPlayerManager() as SpwPlayerManager;
        if (playerManager == null) {
            Logger.error(`SpwModel.checkAndHandleAutoActions() empty playerManager.`);
            return false;
        }
        if ((war.getDrawVoteManager().checkIsDraw())            ||
            (playerManager.getAliveOrDyingTeamsCount(false) <= 1)
        ) {
            await handleSystemEndWar(war);
            await checkAndHandleAutoActions(war);
            return true;
        }

        // Handle the WaitBeginTurn phase.
        const turnManager = war.getTurnManager();
        if (turnManager == null) {
            Logger.error(`SpwModel.checkAndHandleAutoActions() empty turnManager.`);
            return false;
        }

        const turnPhaseCode = turnManager.getPhaseCode();
        if (turnPhaseCode == null) {
            Logger.error(`SpwModel.checkAndHandleAutoActions() empty turnPhaseCode.`);
            return false;
        }

        const playerInTurn = playerManager.getPlayerInTurn();
        if (playerInTurn == null) {
            Logger.error(`SpwModel.checkAndHandleAutoActions() empty playerInTurn.`);
            return false;
        }

        if (turnPhaseCode === Types.TurnPhaseCode.WaitBeginTurn) {
            await handleSystemBeginTurn(war);
            await checkAndHandleAutoActions(war);
            return true;
        }

        // Handle the dying players (destroy force).
        const playersCount = playerManager.getTotalPlayersCount(false);
        for (let playerIndex = CommonConstants.WarFirstPlayerIndex; playerIndex <= playersCount; ++playerIndex) {
            const player = playerManager.getPlayer(playerIndex);
            if (player == null) {
                Logger.error(`SpwModel.checkAndHandleAutoActions() empty player.`);
                return false;
            }

            if (player.getAliveState() === Types.PlayerAliveState.Dying) {
                await handleSystemDestroyPlayerForce(war, playerIndex);
                await checkAndHandleAutoActions(war);
                return true;
            }
        }

        // Handle neutral player (end turn).
        if (playerInTurn.checkIsNeutral()) {
            if (turnPhaseCode !== Types.TurnPhaseCode.Main) {
                Logger.error(`SpwModel.checkAndHandleAutoActions() invalid turnPhaseCode for the neutral player: ${turnPhaseCode}`);
                return false;
            }

            await handlePlayerEndTurn(war);
            await checkAndHandleAutoActions(war);
            return true;
        }

        // Handle the dead player in turn (end turn).
        if (playerInTurn.getAliveState() === Types.PlayerAliveState.Dead) {
            if (turnPhaseCode !== Types.TurnPhaseCode.Main) {
                Logger.error(`SpwModel.checkAndHandleAutoActions() invalid turnPhaseCode for the dead player in turn: ${turnPhaseCode}`);
                return false;
            }

            await handlePlayerEndTurn(war);
            await checkAndHandleAutoActions(war);
            return true;
        }

        // No auto action available.
        return false;
    }
    async function handleSystemBeginTurn(war: SpwWar): Promise<void> {
        await SpwActionExecutor.checkAndExecute(war, {
            actionId                    : war.getExecutedActionManager().getExecutedActionsCount(),
            WarActionSystemBeginTurn    : {
            },
        })
    }
    async function handleSystemCallWarEvent(war: SpwWar, warEventId: number): Promise<void> {
        await SpwActionExecutor.checkAndExecute(war, {
            actionId                    : war.getExecutedActionManager().getExecutedActionsCount(),
            WarActionSystemCallWarEvent : {
                warEventId,
            },
        });
    }
    async function handleSystemDestroyPlayerForce(war: SpwWar, playerIndex: number): Promise<void> {
        await SpwActionExecutor.checkAndExecute(war, {
            actionId                            : war.getExecutedActionManager().getExecutedActionsCount(),
            WarActionSystemDestroyPlayerForce   : {
                targetPlayerIndex           : playerIndex,
            },
        });
    }
    async function handleSystemEndWar(war: SpwWar): Promise<void> {
        await SpwActionExecutor.checkAndExecute(war, {
            actionId                : war.getExecutedActionManager().getExecutedActionsCount(),
            WarActionSystemEndWar   : {
            },
        });
    }
    async function handlePlayerEndTurn(war: SpwWar): Promise<void> {
        await SpwActionExecutor.checkAndExecute(war, {
            actionId                : war.getExecutedActionManager().getExecutedActionsCount(),
            WarActionPlayerEndTurn  : {
            },
        });
    }

    function checkCanExecuteAction(war: SpwWar): boolean {
        return (war != null)                &&
            (!war.getIsEnded())             &&
            (!war.getIsExecutingAction())   &&
            (war.getIsRunning());
    }
}
