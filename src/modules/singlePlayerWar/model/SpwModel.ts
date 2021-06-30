
// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace TinyWars.SinglePlayerWar.SpwModel {
    import Types                    = Utility.Types;
    import Logger                   = Utility.Logger;
    import Lang                     = Utility.Lang;
    import ProtoTypes               = Utility.ProtoTypes;
    import ClientErrorCode          = Utility.ClientErrorCode;
    import CommonConstants          = Utility.CommonConstants;
    import WarSerialization         = ProtoTypes.WarSerialization;
    import IWarActionContainer      = ProtoTypes.WarAction.IWarActionContainer;
    import ISpmWarSaveSlotExtraData = ProtoTypes.SinglePlayerMode.ISpmWarSaveSlotExtraData;
    import CommonAlertPanel         = Common.CommonAlertPanel;

    let _war: SpwWar;
    export function init(): void {
        // nothing to do.
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for managing war.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    export async function loadWar({ warData, slotIndex, slotExtraData }: {
        warData         : WarSerialization.ISerialWar;
        slotIndex       : number;
        slotExtraData   : ISpmWarSaveSlotExtraData;
    }): Promise<SpwWar> {
        if (getWar()) {
            Logger.warn(`SpwModel.loadWar() another war has been loaded already!`);
            unloadWar();
        }

        const war = warData.settingsForScw
            ? new SingleCustomWar.ScwWar()
            : (warData.settingsForSfw
                ? new SingleFreeWar.SfwWar()
                : (warData.settingsForSrw
                    ? new SingleRankWar.SrwWar()
                    : null
                )
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
        setWar(war);

        return war;
    }

    export function unloadWar(): void {
        const war = getWar();
        if (war) {
            war.stopRunning();
            setWar(null);
        }
    }

    export function getWar(): SpwWar | undefined | null {
        return _war;
    }
    function setWar(war: SpwWar | null | undefined): void {
        _war = war;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Util functions.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    const _warsWithRobotRunning = new Set<SpwWar>();

    export async function handlePlayerActionAndAutoActions(war: SpwWar, action: IWarActionContainer): Promise<void> {
        await handlePlayerOrRobotAction(war, action);

        await checkAndHandleAutoActionsAndRobotRecursively(war);
    }

    export async function checkAndHandleAutoActionsAndRobotRecursively(war: SpwWar): Promise<void> {
        if (_warsWithRobotRunning.has(war)) {
            return;
        }
        _warsWithRobotRunning.add(war);

        if ((checkAndEndWar(war)) || (!war.getIsRunning())) {
            _warsWithRobotRunning.delete(war);
            return;
        }

        await checkAndHandleSystemActions(war);

        if ((checkAndEndWar(war)) || (!war.getIsRunning())) {
            _warsWithRobotRunning.delete(war);
            return;
        }

        if (war.checkIsHumanInTurn()) {
            _warsWithRobotRunning.delete(war);
            return;
        }

        const {
            errorCode   : errorCodeForRobotAction,
            action      : robotAction,
        } = await SpwRobot.getNextAction(war);
        if (errorCodeForRobotAction) {
            Logger.error(`SpwModel.checkAndHandleAutoActionsAndRobotRecursively() errorCodeForRobotAction: ${errorCodeForRobotAction}`);
            _warsWithRobotRunning.delete(war);
            return;
        } else if (robotAction == null) {
            Logger.error(`SpwModel.checkAndHandleAutoActionsAndRobotRecursively() empty robotAction!`);
            _warsWithRobotRunning.delete(war);
            return;
        }

        if (!war.getIsRunning()) {
            _warsWithRobotRunning.delete(war);
            return;
        }

        await handlePlayerOrRobotAction(war, robotAction);

        _warsWithRobotRunning.delete(war);
        await checkAndHandleAutoActionsAndRobotRecursively(war);
    }

    async function handlePlayerOrRobotAction(war: SpwWar, action: IWarActionContainer): Promise<ClientErrorCode> {
        if (!checkCanExecuteAction(war)) {
            Logger.error(`SpwModel.handlePlayerOrRobotAction() checkCanExecuteAction(war) is not true!`);
            return ClientErrorCode.SpwModel_HandlePlayerOrRobotAction_00;
        }

        return await reviseAndExecute(war, action);
    }

    function checkAndEndWar(war: SpwWar): boolean {
        if (!war.getIsEnded()) {
            return false;
        } else {
            // TODO: show panels for srw.
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

    async function checkAndHandleSystemActions(war: SpwWar): Promise<boolean> {
        if ((war == null) || (war.getIsEnded())) {
            return false;
        }

        // Handle war events.
        const callableWarEventId = war.getWarEventManager().getCallableWarEventId();
        if (callableWarEventId != null) {
            await handleSystemCallWarEvent(war, callableWarEventId);
            await checkAndHandleSystemActions(war);
            return true;
        }

        // Handle the ending war.
        if (war.checkCanEnd()) {
            await handleSystemEndWar(war);
            await checkAndHandleSystemActions(war);
            return true;
        }

        // Handle the WaitBeginTurn phase.
        const turnPhaseCode = war.getTurnPhaseCode();
        if (turnPhaseCode == null) {
            Logger.error(`SpwModel.checkAndHandleSystemActions() empty turnPhaseCode.`);
            return false;
        }

        const playerManager = war.getPlayerManager();
        const playerInTurn  = playerManager.getPlayerInTurn();
        if (playerInTurn == null) {
            Logger.error(`SpwModel.checkAndHandleSystemActions() empty playerInTurn.`);
            return false;
        }

        if (turnPhaseCode === Types.TurnPhaseCode.WaitBeginTurn) {
            await handleSystemBeginTurn(war);
            await checkAndHandleSystemActions(war);
            return true;
        }

        // Handle the booted players (make them dying).
        if (war.checkIsBoot()) {
            if (turnPhaseCode !== Types.TurnPhaseCode.Main) {
                Logger.error(`SpwModel.checkAndHandleSystemActions() invalid turn phase code: ${turnPhaseCode}.`);
                return false;
            }

            await handleSystemHandleBootPlayer(war);
            await checkAndHandleSystemActions(war);
            return true;
        }

        // Handle the dying players (destroy force).
        const playersCount = playerManager.getTotalPlayersCount(false);
        for (let playerIndex = CommonConstants.WarFirstPlayerIndex; playerIndex <= playersCount; ++playerIndex) {
            const player = playerManager.getPlayer(playerIndex);
            if (player == null) {
                Logger.error(`SpwModel.checkAndHandleSystemActions() empty player.`);
                return false;
            }

            if (player.getAliveState() === Types.PlayerAliveState.Dying) {
                await handleSystemDestroyPlayerForce(war, playerIndex);
                await checkAndHandleSystemActions(war);
                return true;
            }
        }

        // Handle neutral player (end turn).
        if (playerInTurn.checkIsNeutral()) {
            if (turnPhaseCode !== Types.TurnPhaseCode.Main) {
                Logger.error(`SpwModel.checkAndHandleSystemActions() invalid turnPhaseCode for the neutral player: ${turnPhaseCode}`);
                return false;
            }

            await handleSystemEndTurn(war);
            await checkAndHandleSystemActions(war);
            return true;
        }

        // Handle the dead player in turn (end turn).
        if (playerInTurn.getAliveState() === Types.PlayerAliveState.Dead) {
            if (turnPhaseCode !== Types.TurnPhaseCode.Main) {
                Logger.error(`SpwModel.checkAndHandleSystemActions() invalid turnPhaseCode for the dead player in turn: ${turnPhaseCode}`);
                return false;
            }

            await handleSystemEndTurn(war);
            await checkAndHandleSystemActions(war);
            return true;
        }

        // No system action available.
        return false;
    }
    async function handleSystemBeginTurn(war: SpwWar): Promise<ClientErrorCode> {
        return await reviseAndExecute(war, {
            actionId                    : war.getExecutedActionManager().getExecutedActionsCount(),
            WarActionSystemBeginTurn    : {
            },
        });
    }
    async function handleSystemCallWarEvent(war: SpwWar, warEventId: number): Promise<ClientErrorCode> {
        return await reviseAndExecute(war, {
            actionId                    : war.getExecutedActionManager().getExecutedActionsCount(),
            WarActionSystemCallWarEvent : {
                warEventId,
            },
        });
    }
    async function handleSystemDestroyPlayerForce(war: SpwWar, playerIndex: number): Promise<ClientErrorCode> {
        return await reviseAndExecute(war, {
            actionId                            : war.getExecutedActionManager().getExecutedActionsCount(),
            WarActionSystemDestroyPlayerForce   : {
                targetPlayerIndex           : playerIndex,
            },
        });
    }
    async function handleSystemEndWar(war: SpwWar): Promise<ClientErrorCode> {
        return await reviseAndExecute(war, {
            actionId                : war.getExecutedActionManager().getExecutedActionsCount(),
            WarActionSystemEndWar   : {
            },
        });
    }
    async function handleSystemHandleBootPlayer(war: SpwWar): Promise<ClientErrorCode> {
        return await reviseAndExecute(war, {
            actionId                        : war.getExecutedActionManager().getExecutedActionsCount(),
            WarActionSystemHandleBootPlayer : {
            },
        });
    }
    async function handleSystemEndTurn(war: SpwWar): Promise<ClientErrorCode> {
        return await reviseAndExecute(war, {
            actionId                : war.getExecutedActionManager().getExecutedActionsCount(),
            WarActionSystemEndTurn  : {
            },
        });
    }

    function checkCanExecuteAction(war: SpwWar): boolean {
        return (war != null)                &&
            (!war.getIsEnded())             &&
            (!war.getIsExecutingAction())   &&
            (war.getIsRunning());
    }
    async function reviseAndExecute(war: SpwWar, action: IWarActionContainer): Promise<ClientErrorCode> {
        const {
            errorCode   : errorCodeForRevisedAction,
            action      : revisedAction,
        } = BwActionReviser.revise(war, action);
        if (errorCodeForRevisedAction) {
            Logger.error(`SpwModel.reviseAndExecute() errorCodeForRevisedAction: ${errorCodeForRevisedAction}.`);
            return errorCodeForRevisedAction;
        } else if (revisedAction == null) {
            Logger.error(`SpwModel.reviseAndExecute() empty revisedAction!.`);
            return ClientErrorCode.SpwModel_ReviseAndExecute_00;
        }

        const errorCodeForExecute = await BaseWar.BwWarActionExecutor.checkAndExecute(war, revisedAction, false);
        if (errorCodeForExecute) {
            Logger.error(`SpwModel.reviseAndExecute() errorCodeForExecute: ${errorCodeForExecute}.`);
            return errorCodeForExecute;
        }

        war.getExecutedActionManager().addExecutedAction(revisedAction);
        return ClientErrorCode.NoError;
    }
}
