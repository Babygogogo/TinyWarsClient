
// import TwnsBwWar            from "../../baseWar/model/BwWar";
// import TwnsCommonAlertPanel from "../../common/view/CommonAlertPanel";
// import TwnsScwWar           from "../../singleCustomWar/model/ScwWar";
// import TwnsSfwWar           from "../../singleFreeWar/model/SfwWar";
// import TwnsSrwWar           from "../../singleRankWar/model/SrwWar";
// import CommonConstants      from "../../tools/helpers/CommonConstants";
// import FlowManager          from "../../tools/helpers/FlowManager";
// import Helpers              from "../../tools/helpers/Helpers";
// import Logger               from "../../tools/helpers/Logger";
// import Types                from "../../tools/helpers/Types";
// import Lang                 from "../../tools/lang/Lang";
// import TwnsLangTextType     from "../../tools/lang/LangTextType";
// import ProtoTypes           from "../../tools/proto/ProtoTypes";
// import WarActionExecutor    from "../../tools/warHelpers/WarActionExecutor";
// import WarActionReviser     from "../../tools/warHelpers/WarActionReviser";
// import WarRobot             from "../../tools/warHelpers/WarRobot";
// import TwnsSpwPlayerManager from "./SpwPlayerManager";
// import TwnsSpwWar           from "./SpwWar";

namespace SpwModel {
    import SpwWar                   = TwnsSpwWar.SpwWar;
    import ScwWar                   = TwnsScwWar.ScwWar;
    import SfwWar                   = TwnsSfwWar.SfwWar;
    import SrwWar                   = TwnsSrwWar.SrwWar;
    import SpwPlayerManager         = TwnsSpwPlayerManager.SpwPlayerManager;
    import LangTextType             = TwnsLangTextType.LangTextType;
    import WarSerialization         = ProtoTypes.WarSerialization;
    import IWarActionContainer      = ProtoTypes.WarAction.IWarActionContainer;
    import ISpmWarSaveSlotExtraData = ProtoTypes.SinglePlayerMode.ISpmWarSaveSlotExtraData;
    import BwWar                    = TwnsBwWar.BwWar;

    let _war: SpwWar | null = null;

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

        const war = createWarByWarData(warData);
        await war.init(warData);
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

    export function getWar(): SpwWar | null {
        return _war;
    }
    function setWar(war: SpwWar | null): void {
        _war = war;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Util functions.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    const _warsWithRobotRunning = new Set<BwWar>();

    export async function handlePlayerActionAndAutoActions(war: BwWar, action: IWarActionContainer): Promise<void> {
        await handlePlayerOrRobotAction(war, action);

        await checkAndHandleAutoActionsAndRobotRecursively(war);
    }

    export async function checkAndHandleAutoActionsAndRobotRecursively(war: BwWar): Promise<void> {
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

        const robotAction = await WarRobot.getNextAction(war);
        if (!war.getIsRunning()) {
            _warsWithRobotRunning.delete(war);
            return;
        }

        await handlePlayerOrRobotAction(war, robotAction);

        _warsWithRobotRunning.delete(war);
        await checkAndHandleAutoActionsAndRobotRecursively(war);
    }

    async function handlePlayerOrRobotAction(war: BwWar, action: IWarActionContainer): Promise<void> {
        if (war.getIsEnded()) {
            throw Helpers.newError(`war.getIsEnded() is true.`);
        }
        if (war.getIsExecutingAction()) {
            throw Helpers.newError(`war.getIsExecutingAction() is true.`);
        }
        if (!war.getIsRunning()) {
            throw Helpers.newError(`war.getIsRunning() is false.`);
        }

        await reviseAndExecute(war, action);
    }

    function checkAndEndWar(war: BwWar): boolean {
        if (!war.getIsEnded()) {
            return false;
        } else {
            // TODO: show panels for srw.
            const callback = () => FlowManager.gotoLobby();
            if (war.getDrawVoteManager().checkIsDraw()) {
                TwnsCommonAlertPanel.CommonAlertPanel.show({
                    title   : Lang.getText(LangTextType.B0088),
                    content : Lang.getText(LangTextType.A0030),
                    callback,
                });
            } else {
                const humanPlayerList = (war.getPlayerManager() as SpwPlayerManager).getHumanPlayers();
                if (humanPlayerList.length <= 0) {
                    TwnsCommonAlertPanel.CommonAlertPanel.show({
                        title   : Lang.getText(LangTextType.B0088),
                        content : Lang.getText(LangTextType.A0035),
                        callback,
                    });
                } else {
                    TwnsCommonAlertPanel.CommonAlertPanel.show({
                        title   : Lang.getText(LangTextType.B0088),
                        content : humanPlayerList.some(v => v.getAliveState() === Types.PlayerAliveState.Alive)
                            ? Lang.getText(LangTextType.A0022)
                            : Lang.getText(LangTextType.A0023),
                        callback,
                    });
                }
            }
            return true;
        }
    }

    async function checkAndHandleSystemActions(war: BwWar): Promise<boolean> {
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
            throw Helpers.newError(`SpwModel.checkAndHandleSystemActions() empty turnPhaseCode.`);
        }

        const playerManager = war.getPlayerManager();
        const playerInTurn  = playerManager.getPlayerInTurn();
        if (playerInTurn == null) {
            throw Helpers.newError(`SpwModel.checkAndHandleSystemActions() empty playerInTurn.`);
        }

        if (turnPhaseCode === Types.TurnPhaseCode.WaitBeginTurn) {
            await handleSystemBeginTurn(war);
            await checkAndHandleSystemActions(war);
            return true;
        }

        // Handle the booted players (make them dying).
        if (war.checkIsBoot()) {
            if (turnPhaseCode !== Types.TurnPhaseCode.Main) {
                throw Helpers.newError(`SpwModel.checkAndHandleSystemActions() invalid turn phase code: ${turnPhaseCode}.`);
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
                throw Helpers.newError(`SpwModel.checkAndHandleSystemActions() empty player.`);
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
                throw Helpers.newError(`SpwModel.checkAndHandleSystemActions() invalid turnPhaseCode for the neutral player: ${turnPhaseCode}`);
            }

            await handleSystemEndTurn(war);
            await checkAndHandleSystemActions(war);
            return true;
        }

        // Handle the dead player in turn (end turn).
        if (playerInTurn.getAliveState() === Types.PlayerAliveState.Dead) {
            if (turnPhaseCode !== Types.TurnPhaseCode.Main) {
                throw Helpers.newError(`SpwModel.checkAndHandleSystemActions() invalid turnPhaseCode for the dead player in turn: ${turnPhaseCode}`);
            }

            await handleSystemEndTurn(war);
            await checkAndHandleSystemActions(war);
            return true;
        }

        // No system action available.
        return false;
    }
    async function handleSystemBeginTurn(war: BwWar): Promise<void> {
        await reviseAndExecute(war, {
            actionId                    : war.getExecutedActionManager().getExecutedActionsCount(),
            WarActionSystemBeginTurn    : {
            },
        });
    }
    async function handleSystemCallWarEvent(war: BwWar, warEventId: number): Promise<void> {
        await reviseAndExecute(war, {
            actionId                    : war.getExecutedActionManager().getExecutedActionsCount(),
            WarActionSystemCallWarEvent : {
                warEventId,
            },
        });
    }
    async function handleSystemDestroyPlayerForce(war: BwWar, playerIndex: number): Promise<void> {
        await reviseAndExecute(war, {
            actionId                            : war.getExecutedActionManager().getExecutedActionsCount(),
            WarActionSystemDestroyPlayerForce   : {
                targetPlayerIndex           : playerIndex,
            },
        });
    }
    async function handleSystemEndWar(war: BwWar): Promise<void> {
        await reviseAndExecute(war, {
            actionId                : war.getExecutedActionManager().getExecutedActionsCount(),
            WarActionSystemEndWar   : {
            },
        });
    }
    async function handleSystemHandleBootPlayer(war: BwWar): Promise<void> {
        await reviseAndExecute(war, {
            actionId                        : war.getExecutedActionManager().getExecutedActionsCount(),
            WarActionSystemHandleBootPlayer : {
            },
        });
    }
    async function handleSystemEndTurn(war: BwWar): Promise<void> {
        await reviseAndExecute(war, {
            actionId                : war.getExecutedActionManager().getExecutedActionsCount(),
            WarActionSystemEndTurn  : {
            },
        });
    }

    async function reviseAndExecute(war: BwWar, action: IWarActionContainer): Promise<void> {
        const revisedAction = WarActionReviser.revise(war, action);
        await WarActionExecutor.checkAndExecute(war, revisedAction, false);

        war.getExecutedActionManager().addExecutedAction(revisedAction);
    }

    function createWarByWarData(warData: ProtoTypes.WarSerialization.ISerialWar): SpwWar {
        if (warData.settingsForScw) {
            return new ScwWar();
        } else if (warData.settingsForSfw) {
            return new SfwWar();
        } else if (warData.settingsForSrw) {
            return new SrwWar();
        } else {
            throw Helpers.newError(`Invalid warData.`);
        }
    }
}

// export default SpwModel;
