
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
namespace Twns.SinglePlayerWar.SpwModel {
    import SpwWar                   = SinglePlayerWar.SpwWar;
    import ScwWar                   = SingleCustomWar.ScwWar;
    import SfwWar                   = SingleFreeWar.SfwWar;
    import SrwWar                   = SingleRankWar.SrwWar;
    import SpwPlayerManager         = SinglePlayerWar.SpwPlayerManager;
    import LangTextType             = Lang.LangTextType;
    import WarSerialization         = CommonProto.WarSerialization;
    import IWarActionContainer      = CommonProto.WarAction.IWarActionContainer;
    import ISpmWarSaveSlotExtraData = CommonProto.SinglePlayerMode.ISpmWarSaveSlotExtraData;
    import BwWar                    = BaseWar.BwWar;

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

        const data  = Helpers.deepClone(warData);
        const war   = createWarByWarData(data);
        war.init(data, await Config.ConfigManager.getGameConfig(Helpers.getExisted(data.settingsForCommon?.configVersion)));
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

            if (war instanceof SpwWar) {
                const retractManager = war.getRetractManager();
                if (retractManager.getCanRetract()) {
                    retractManager.addRetractState(ProtoManager.encodeAsSerialWar(war.serialize()));
                }
            }

            return;
        }

        const robotAction = await WarHelpers.WarRobot.getNextAction(war);
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
            PanelHelpers.open(PanelHelpers.PanelDict.CommonAlertPanel, {
                title   : Lang.getText(LangTextType.B0088),
                content : Lang.getText(LangTextType.A0030),
                callback,
            });
        } else {
            const humanPlayerArray = (war.getPlayerManager() as SpwPlayerManager).getHumanPlayers();
            if (humanPlayerArray.length <= 0) {
                PanelHelpers.open(PanelHelpers.PanelDict.CommonAlertPanel, {
                    title   : Lang.getText(LangTextType.B0088),
                    content : Lang.getText(LangTextType.A0035),
                    callback,
                });
            } else {
                if (humanPlayerArray.every(v => v.getAliveState() === Types.PlayerAliveState.Dead)) {
                    PanelHelpers.open(PanelHelpers.PanelDict.CommonAlertPanel, {
                        title   : Lang.getText(LangTextType.B0088),
                        content : Lang.getText(LangTextType.A0023),
                        callback,
                    });
                } else {
                    if (war instanceof SrwWar) {
                        PanelHelpers.open(PanelHelpers.PanelDict.CommonAlertPanel, {
                            title   : Lang.getText(LangTextType.B0088),
                            content : Lang.getFormattedText(LangTextType.F0127, war.calculateTotalScore()),
                            callback: () => {
                                callback();

                                PanelHelpers.open(PanelHelpers.PanelDict.CommonConfirmPanel, {
                                    content : Lang.getText(LangTextType.A0277),
                                    callback: () => {
                                        SinglePlayerMode.SpmProxy.reqSpmValidateSrw(war);
                                    },
                                });
                            },
                        });
                    } else {
                        PanelHelpers.open(PanelHelpers.PanelDict.CommonAlertPanel, {
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

        // Handle turns limit.
        const playerManager     = war.getPlayerManager();
        const playerInTurn      = playerManager.getPlayerInTurn();
        const hasVotedForDraw   = playerInTurn.getHasVotedForDraw();
        const turnPhaseCode     = war.getTurnPhaseCode();
        if (war.getTurnManager().getTurnIndex() > war.getCommonSettingManager().getTurnsLimit()) {
            if (war.checkCanEnd()) {
                await handleSystemEndWar(war);
                await checkAndHandleSystemActions(war);
                return true;
            }

            if (turnPhaseCode === Types.TurnPhaseCode.WaitBeginTurn) {
                await handleSystemBeginTurn(war);
                await checkAndHandleSystemActions(war);
                return true;
            }

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
        if (turnPhaseCode === Types.TurnPhaseCode.WaitBeginTurn) {
            await handleSystemBeginTurn(war);
            await checkAndHandleSystemActions(war);
            return true;
        }

        // Handle the dying players (destroy force).
        const playersCount = playerManager.getTotalPlayersCount(false);
        for (let playerIndex = CommonConstants.PlayerIndex.First; playerIndex <= playersCount; ++playerIndex) {
            const player = playerManager.getPlayer(playerIndex);
            if (player.getAliveState() === Types.PlayerAliveState.Dying) {
                await handleSystemDestroyPlayerForce(war, playerIndex);
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
        const revisedAction = WarHelpers.WarActionReviser.revise(war, action);
        await WarHelpers.WarActionExecutor.checkAndExecute(war, revisedAction, false);

        war.getExecutedActionManager().addExecutedAction(revisedAction);
    }

    function createWarByWarData(warData: CommonProto.WarSerialization.ISerialWar): SpwWar {
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
