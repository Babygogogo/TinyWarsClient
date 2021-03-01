
namespace TinyWars.SingleCustomWar.ScwModel {
    import Types                = Utility.Types;
    import Logger               = Utility.Logger;
    import Lang                 = Utility.Lang;
    import ConfigManager        = Utility.ConfigManager;
    import ProtoTypes           = Utility.ProtoTypes;
    import WarSerialization     = ProtoTypes.WarSerialization;
    import IWarActionContainer  = ProtoTypes.WarAction.IWarActionContainer;
    import CommonAlertPanel     = Common.CommonAlertPanel;
    import CommonConstants      = ConfigManager.COMMON_CONSTANTS;

    let _war: ScwWar;
    export function init(): void {
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for managing war.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    export async function loadWar({ warData, slotIndex, slotComment }: {
        warData     : WarSerialization.ISerialWar;
        slotIndex   : number;
        slotComment : string;
    }): Promise<ScwWar> {
        if (_war) {
            Logger.warn(`McwModel.loadWar() another war has been loaded already!`);
            unloadWar();
        }

        _war = (await new SingleCustomWar.ScwWar().init(warData)).startRunning().startRunningView() as ScwWar;
        _war.setSaveSlotIndex(slotIndex);
        _war.setSaveSlotComment(slotComment);
        await checkAndHandleAutoActionsAndRobot();
        await checkAndHandleAutoActions(_war);

        return _war;
    }

    export function unloadWar(): void {
        if (_war) {
            _war.stopRunning();
            _war = undefined;
        }
    }

    export function getWar(): ScwWar | undefined {
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
                await handleAutoActionsAndPlayerAction(ScwActionReviser.revise(war, await ScwRobot.getNextAction(war)));
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

        playerAction.actionId = war.getExecutedActionsCount();
        await ScwActionExecutor.checkAndExecute(war, playerAction);
        if (checkAndEndWar(war)) {
            return;
        }

        await checkAndHandleAutoActions(war);
        checkAndEndWar(war);
    }

    function checkAndEndWar(war: ScwWar): boolean {
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
                const humanPlayerList = (war.getPlayerManager() as ScwPlayerManager).getHumanPlayers();
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

    async function checkAndHandleAutoActions(war: ScwWar): Promise<boolean> {
        if ((war == null) || (war.getIsEnded())) {
            return false;
        }

        // Handle war events.
        const warEventManager = war.getWarEventManager();
        if (warEventManager == null) {
            Logger.error(`ScwModel.checkAndHandleAutoActions() empty warEventManager.`);
            return undefined;
        }

        const callableWarEventId = warEventManager.getCallableWarEventId();
        if (callableWarEventId != null) {
            await handleSystemCallWarEvent(war, callableWarEventId);
            await checkAndHandleAutoActions(war);
            return true;
        }

        // Handle the ending war.
        const playerManager = war.getPlayerManager() as ScwPlayerManager;
        if (playerManager == null) {
            Logger.error(`ScwModel.checkAndHandleAutoActions() empty playerManager.`);
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
            Logger.error(`ScwModel.checkAndHandleAutoActions() empty turnManager.`);
            return false;
        }

        const turnPhaseCode = turnManager.getPhaseCode();
        if (turnPhaseCode == null) {
            Logger.error(`ScwModel.checkAndHandleAutoActions() empty turnPhaseCode.`);
            return false;
        }

        const playerInTurn = playerManager.getPlayerInTurn();
        if (playerInTurn == null) {
            Logger.error(`ScwModel.checkAndHandleAutoActions() empty playerInTurn.`);
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
                Logger.error(`ScwModel.checkAndHandleAutoActions() empty player.`);
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
                Logger.error(`ScwModel.checkAndHandleAutoActions() invalid turnPhaseCode for the neutral player: ${turnPhaseCode}`);
                return false;
            }

            await handlePlayerEndTurn(war);
            await checkAndHandleAutoActions(war);
            return true;
        }

        // Handle the dead player in turn (end turn).
        if (playerInTurn.getAliveState() === Types.PlayerAliveState.Dead) {
            if (turnPhaseCode !== Types.TurnPhaseCode.Main) {
                Logger.error(`ScwModel.checkAndHandleAutoActions() invalid turnPhaseCode for the dead player in turn: ${turnPhaseCode}`);
                return false;
            }

            await handlePlayerEndTurn(war);
            await checkAndHandleAutoActions(war);
            return true;
        }

        // No auto action available.
        return false;
    }
    async function handleSystemBeginTurn(war: ScwWar): Promise<void> {
        await ScwActionExecutor.checkAndExecute(war, {
            actionId                    : war.getExecutedActionsCount(),
            WarActionSystemBeginTurn    : {
            },
        })
    }
    async function handleSystemCallWarEvent(war: ScwWar, warEventId: number): Promise<void> {
        await ScwActionExecutor.checkAndExecute(war, {
            actionId                    : war.getExecutedActionsCount(),
            WarActionSystemCallWarEvent : {
                warEventId,
            },
        });
    }
    async function handleSystemDestroyPlayerForce(war: ScwWar, playerIndex: number): Promise<void> {
        await ScwActionExecutor.checkAndExecute(war, {
            actionId                            : war.getExecutedActionsCount(),
            WarActionSystemDestroyPlayerForce   : {
                targetPlayerIndex           : playerIndex,
            },
        });
    }
    async function handleSystemEndWar(war: ScwWar): Promise<void> {
        await ScwActionExecutor.checkAndExecute(war, {
            actionId                : war.getExecutedActionsCount(),
            WarActionSystemEndWar   : {
            },
        });
    }
    async function handlePlayerEndTurn(war: ScwWar): Promise<void> {
        await ScwActionExecutor.checkAndExecute(war, {
            actionId                : war.getExecutedActionsCount(),
            WarActionPlayerEndTurn  : {
            },
        });
    }

    function checkCanExecuteAction(war: ScwWar): boolean {
        return (war != null)                &&
            (!war.getIsEnded())             &&
            (!war.getIsExecutingAction())   &&
            (war.getIsRunning());
    }
}
