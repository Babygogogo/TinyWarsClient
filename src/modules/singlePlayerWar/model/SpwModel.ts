
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace SpwModel {
    import ClientErrorCode          = TwnsClientErrorCode.ClientErrorCode;
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
            throw Helpers.newError(`war.getIsEnded() is true.`, ClientErrorCode.SpwModel_HandlePlayerOrRobotAction_00);
        }
        if (war.getIsExecutingAction()) {
            throw Helpers.newError(`war.getIsExecutingAction() is true.`, ClientErrorCode.SpwModel_HandlePlayerOrRobotAction_01);
        }
        if (!war.getIsRunning()) {
            throw Helpers.newError(`war.getIsRunning() is false.`, ClientErrorCode.SpwModel_HandlePlayerOrRobotAction_02);
        }

        await reviseAndExecute(war, action);
    }

    function checkAndEndWar(war: BwWar): boolean {
        if (!war.getIsEnded()) {
            return false;
        }
        // TODO: show panels for srw.

        const callback = () => FlowManager.gotoLobby();
        if (war.getDrawVoteManager().checkIsDraw()) {
            TwnsPanelManager.open(TwnsPanelConfig.Dict.CommonAlertPanel, {
                title   : Lang.getText(LangTextType.B0088),
                content : Lang.getText(LangTextType.A0030),
                callback,
            });
        } else {
            const humanPlayerArray = (war.getPlayerManager() as SpwPlayerManager).getHumanPlayers();
            if (humanPlayerArray.length <= 0) {
                TwnsPanelManager.open(TwnsPanelConfig.Dict.CommonAlertPanel, {
                    title   : Lang.getText(LangTextType.B0088),
                    content : Lang.getText(LangTextType.A0035),
                    callback,
                });
            } else {
                if (humanPlayerArray.every(v => v.getAliveState() === Types.PlayerAliveState.Dead)) {
                    TwnsPanelManager.open(TwnsPanelConfig.Dict.CommonAlertPanel, {
                        title   : Lang.getText(LangTextType.B0088),
                        content : Lang.getText(LangTextType.A0023),
                        callback,
                    });
                } else {
                    if (war instanceof SrwWar) {
                        TwnsPanelManager.open(TwnsPanelConfig.Dict.CommonAlertPanel, {
                            title   : Lang.getText(LangTextType.B0088),
                            content : Lang.getFormattedText(LangTextType.F0127, war.calculateTotalScore()),
                            callback: () => {
                                callback();

                                TwnsPanelManager.open(TwnsPanelConfig.Dict.CommonConfirmPanel, {
                                    content : Lang.getText(LangTextType.A0277),
                                    callback: () => {
                                        SpmProxy.reqSpmValidateSrw(war);
                                    },
                                });
                            },
                        });
                    } else {
                        TwnsPanelManager.open(TwnsPanelConfig.Dict.CommonAlertPanel, {
                            title   : Lang.getText(LangTextType.B0088),
                            content : Lang.getText(LangTextType.A0022),
                            callback,
                        });
                    }
                }
            }
        }

        return true;
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
        const playerManager = war.getPlayerManager();
        if (turnPhaseCode === Types.TurnPhaseCode.WaitBeginTurn) {
            await handleSystemBeginTurn(war);
            await checkAndHandleSystemActions(war);
            return true;
        }

        // Handle the dying players (destroy force).
        const playersCount = playerManager.getTotalPlayersCount(false);
        for (let playerIndex = CommonConstants.WarFirstPlayerIndex; playerIndex <= playersCount; ++playerIndex) {
            const player = playerManager.getPlayer(playerIndex);
            if (player.getAliveState() === Types.PlayerAliveState.Dying) {
                await handleSystemDestroyPlayerForce(war, playerIndex);
                await checkAndHandleSystemActions(war);
                return true;
            }
        }

        // Handle turns limit.
        const playerInTurn      = playerManager.getPlayerInTurn();
        const hasVotedForDraw   = playerInTurn.getHasVotedForDraw();
        if (war.getTurnManager().getTurnIndex() > war.getCommonSettingManager().getTurnsLimit()) {
            if (!hasVotedForDraw) {
                await handleSystemVoteForDraw(war, true);
                await checkAndHandleSystemActions(war);
                return true;
            } else {
                await handleSystemEndTurn(war);
                await checkAndHandleSystemActions(war);
                return true;
            }
        }

        // Handle the booted players (make them dying or end turn).
        const remainingVotesForDraw = war.getDrawVoteManager().getRemainingVotes();
        if (war.checkIsBoot()) {
            if (turnPhaseCode !== Types.TurnPhaseCode.Main) {
                throw Helpers.newError(`SpwModel.checkAndHandleSystemActions() invalid turn phase code: ${turnPhaseCode}.`, ClientErrorCode.SpwModel_CheckAndHandleSystemAction_00);
            }

            if (!playerInTurn.getHasTakenManualAction()) {
                await handleSystemHandleBootPlayer(war);
                await checkAndHandleSystemActions(war);
                return true;
            } else {
                if ((remainingVotesForDraw) && (!hasVotedForDraw)) {
                    await handleSystemVoteForDraw(war, false);
                    await checkAndHandleSystemActions(war);
                    return true;
                } else {
                    await handleSystemEndTurn(war);
                    await checkAndHandleSystemActions(war);
                    return true;
                }
            }
        }

        // Handle system vote for draw.
        if ((remainingVotesForDraw)                                                                             &&
            (!hasVotedForDraw)                                                                                  &&
            ((playerInTurn.checkIsNeutral()) || (playerInTurn.getAliveState() === Types.PlayerAliveState.Dead))
        ) {
            await handleSystemVoteForDraw(war, true);
            await checkAndHandleSystemActions(war);
            return true;
        }

        // Handle system end turn.
        if ((playerInTurn.checkIsNeutral())                                 ||
            (playerInTurn.getAliveState() === Types.PlayerAliveState.Dead)
        ) {
            if (turnPhaseCode !== Types.TurnPhaseCode.Main) {
                throw Helpers.newError(`SpwModel.checkAndHandleSystemActions() invalid turnPhaseCode for the neutral player: ${turnPhaseCode}`, ClientErrorCode.SpwModel_CheckAndHandleSystemAction_01);
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
    async function handleSystemVoteForDraw(war: BwWar, isAgree: boolean): Promise<void> {
        await reviseAndExecute(war, {
            actionId                    : war.getExecutedActionManager().getExecutedActionsCount(),
            WarActionSystemVoteForDraw  : {
                isAgree,
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
            throw Helpers.newError(`Invalid warData.`, ClientErrorCode.SpwModel_CreateWarByWarData_00);
        }
    }
}

// export default SpwModel;
