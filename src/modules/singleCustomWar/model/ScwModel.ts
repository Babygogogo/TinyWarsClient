
namespace TinyWars.SingleCustomWar.ScwModel {
    import Types                    = Utility.Types;
    import Logger                   = Utility.Logger;
    import ProtoTypes               = Utility.ProtoTypes;
    import Lang                     = Utility.Lang;
    import ConfigManager            = Utility.ConfigManager;
    import CommonAlertPanel         = Common.CommonAlertPanel;
    import WarSerialization         = ProtoTypes.WarSerialization;
    import IActionContainer         = ProtoTypes.WarAction.IActionContainer;
    import CommonConstants          = ConfigManager.COMMON_CONSTANTS;

    let _war            : ScwWar;
    let _cachedActions  = new Array<IActionContainer>();

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
        checkAndRequestBeginTurnOrRunRobot(_war);

        return _war;
    }

    export function unloadWar(): void {
        if (_war) {
            _war.stopRunning();
            _war                    = undefined;
            _cachedActions.length   = 0;
        }
    }

    export function getWar(): ScwWar | undefined {
        return _war;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Util functions.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    export function updateByWarAction(container: IActionContainer): void {
        const war = getWar();
        if (war) {
            if (container.actionId !== war.getExecutedActionsCount() + _cachedActions.length) {
                Logger.error(`ScwModel._updateByActionContainer() invalid action id: ${container.actionId}`);
            } else {
                _cachedActions.push(container);
                _checkAndRunFirstCachedAction();
            }
        }
    }

    async function _checkAndRunFirstCachedAction(): Promise<void> {
        const war       = getWar();
        const container = _cachedActions.length ? _cachedActions.shift() : undefined;
        if ((container) && (war.getIsRunning()) && (!war.getIsEnded()) && (!war.getIsExecutingAction())) {
            war.setIsExecutingAction(true);
            if (war.getIsSinglePlayerCheating()) {
                war.setExecutedActionsCount(war.getExecutedActionsCount() + 1);
            } else {
                war.addExecutedAction(container);
            }
            await ScwActionExecutor.execute(war, container);
            war.setIsExecutingAction(false);

            if (war.getIsRunning()) {
                if (war.getPlayerIndexInTurn() === CommonConstants.WarNeutralPlayerIndex) {
                    if (_cachedActions.length) {
                        _checkAndRunFirstCachedAction();
                    } else {
                        checkAndRequestBeginTurnOrRunRobot(war);
                    }
                } else {
                    const playerManager = war.getPlayerManager();
                    if (!playerManager.getAliveWatcherTeamIndexesForSelf().size) {
                        if (war.getHumanPlayers().length > 0) {
                            war.setIsEnded(true);
                            CommonAlertPanel.show({
                                title   : Lang.getText(Lang.Type.B0035),
                                content : Lang.getText(Lang.Type.A0023),
                                callback: () => Utility.FlowManager.gotoLobby(),
                            });
                        } else {
                            if (playerManager.getAliveTeamsCount(false) <= 1) {
                                war.setIsEnded(true);
                                CommonAlertPanel.show({
                                    title   : Lang.getText(Lang.Type.B0034),
                                    content : Lang.getText(Lang.Type.A0022),
                                    callback: () => Utility.FlowManager.gotoLobby(),
                                });

                            } else {
                                if (_cachedActions.length) {
                                    _checkAndRunFirstCachedAction();
                                } else {
                                    checkAndRequestBeginTurnOrRunRobot(war);
                                }
                            }
                        }

                    } else {
                        if (war.getRemainingVotesForDraw() === 0) {
                            war.setIsEnded(true);
                            CommonAlertPanel.show({
                                title   : Lang.getText(Lang.Type.B0082),
                                content : Lang.getText(Lang.Type.A0030),
                                callback: () => Utility.FlowManager.gotoLobby(),
                            });

                        } else {
                            if (playerManager.getAliveTeamsCount(false) <= 1) {
                                war.setIsEnded(true);
                                CommonAlertPanel.show({
                                    title   : Lang.getText(Lang.Type.B0034),
                                    content : Lang.getText(Lang.Type.A0022),
                                    callback: () => Utility.FlowManager.gotoLobby(),
                                });

                            } else {
                                if (_cachedActions.length) {
                                    _checkAndRunFirstCachedAction();
                                } else {
                                    checkAndRequestBeginTurnOrRunRobot(war);
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    export async function checkAndRequestBeginTurnOrRunRobot(war: ScwWar): Promise<void> {
        if (!war.checkIsHumanInTurn()) {
            updateByWarAction(ScwActionReviser.revise(war, await ScwRobot.getNextAction(war)))
        } else {
            if (war.getTurnManager().getPhaseCode() === Types.TurnPhaseCode.WaitBeginTurn) {
                (war.getActionPlanner() as ScwActionPlanner).setStateRequestingPlayerBeginTurn();
            }
        }
    }
}
