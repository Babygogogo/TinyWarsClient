
namespace TinyWars.MultiPlayerWar.MpwModel {
    import Types                = Utility.Types;
    import Logger               = Utility.Logger;
    import ProtoTypes           = Utility.ProtoTypes;
    import Lang                 = Utility.Lang;
    import FloatText            = Utility.FloatText;
    import CommonAlertPanel     = Common.CommonAlertPanel;
    import IMcwWarInfo          = ProtoTypes.MultiCustomWar.IMcwWarInfo;
    import IMcwWatchInfo        = ProtoTypes.MultiCustomWar.IMcwWatchInfo;
    import ActionContainer      = ProtoTypes.WarAction.IActionContainer;

    let _ongoingWarInfoList     : IMcwWarInfo[] = [];
    let _unwatchedWarInfos      : IMcwWatchInfo[];
    let _watchOngoingWarInfos   : IMcwWatchInfo[];
    let _watchRequestedWarInfos : IMcwWatchInfo[];
    let _watchedWarInfos        : IMcwWatchInfo[];
    let _war                    : MpwWar;
    let _cachedActions          : ActionContainer[] = [];

    export function init(): void {
    }

    export function setOngoingWarInfoList(infoList: IMcwWarInfo[]): void {
        _ongoingWarInfoList = infoList;
    }
    export function getOngoingWarInfoList(): IMcwWarInfo[] | undefined {
        return _ongoingWarInfoList;
    }

    export function setUnwatchedWarInfos(infos: IMcwWatchInfo[]): void {
        _unwatchedWarInfos = infos;
    }
    export function getUnwatchedWarInfos(): IMcwWatchInfo[] | null {
        return _unwatchedWarInfos;
    }

    export function setWatchOngoingWarInfos(infos: IMcwWatchInfo[]): void {
        _watchOngoingWarInfos = infos;
    }
    export function getWatchOngoingWarInfos(): IMcwWatchInfo[] | null {
        return _watchOngoingWarInfos;
    }

    export function setWatchRequestedWarInfos(infos: IMcwWatchInfo[]): void {
        _watchRequestedWarInfos = infos;
    }
    export function getWatchRequestedWarInfos(): IMcwWatchInfo[] | null {
        return _watchRequestedWarInfos;
    }

    export function setWatchedWarInfos(infos: IMcwWatchInfo[]): void {
        _watchedWarInfos = infos;
    }
    export function getWatchedWarInfos(): IMcwWatchInfo[] | null {
        return _watchedWarInfos;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for managing war.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    export async function loadWar(data: ProtoTypes.WarSerialization.ISerialWar): Promise<MpwWar> {
        if (getWar()) {
            Logger.warn(`McwModel.loadWar() another war has been loaded already!`);
            unloadWar();
        }

        const war = data.settingsForMcw
            ? (await new MultiCustomWar.McwWar().init(data)).startRunning().startRunningView() as MpwWar
            : (await new RankMatchWar.RmwWar().init(data)).startRunning().startRunningView() as MpwWar;
        _setWar(war);
        _checkAndRequestBeginTurn(war);

        return war;
    }
    export function unloadWar(): void {
        const war = getWar();
        if (war) {
            war.stopRunning();
            _setWar(undefined);
            _cachedActions.length = 0;
        }
    }

    export function getWar(): MpwWar | undefined {
        return _war;
    }
    function _setWar(war: MpwWar): void {
        _war = war;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Handlers for war actions that McwProxy receives.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    export async function updateOnPlayerSyncWar(data: ProtoTypes.NetMessage.MsgMcwCommonSyncWar.IS): Promise<void> {
        const war = getWar();
        if ((war) && (war.getWarId() === data.warId)) {
            const status = data.status as Types.SyncWarStatus;
            if (status === Types.SyncWarStatus.Defeated) {
                war.setIsEnded(true);
                CommonAlertPanel.show({
                    title   : Lang.getText(Lang.Type.B0088),
                    content : Lang.getText(Lang.Type.A0023),
                    callback: () => Utility.FlowManager.gotoLobby(),
                });

            } else if (status === Types.SyncWarStatus.EndedOrNotExists) {
                war.setIsEnded(true);
                CommonAlertPanel.show({
                    title   : Lang.getText(Lang.Type.B0088),
                    content : Lang.getText(Lang.Type.A0035),
                    callback: () => Utility.FlowManager.gotoLobby(),
                });

            } else if (status === Types.SyncWarStatus.NoError) {
                const requestType = data.requestType as Types.SyncWarRequestType;
                if (requestType === Types.SyncWarRequestType.PlayerForce) {
                    war.setIsEnded(true);
                    await Utility.FlowManager.gotoMultiCustomWar(data.war),
                    FloatText.show(Lang.getText(Lang.Type.A0038));

                } else {
                    const cachedActionsCount = _cachedActions.length;
                    if (data.executedActionsCount !== war.getExecutedActionsCount() + cachedActionsCount) {
                        war.setIsEnded(true);
                        await Utility.FlowManager.gotoMultiCustomWar(data.war);
                        FloatText.show(Lang.getText(Lang.Type.A0036));

                    } else {
                        if (requestType === Types.SyncWarRequestType.PlayerRequest) {
                            FloatText.show(Lang.getText(Lang.Type.A0038));
                        } else {
                            // Nothing to do.
                        }
                        if (!war.getIsExecutingAction()) {
                            if (cachedActionsCount) {
                                MpwActionExecutor.checkAndRunFirstCachedAction(war, _cachedActions);
                            } else {
                                _checkAndRequestBeginTurn(war);
                            }
                        }
                    }
                }

            } else if (status === Types.SyncWarStatus.NotJoined) {
                // Something wrong!!
                war.setIsEnded(true);
                CommonAlertPanel.show({
                    title   : Lang.getText(Lang.Type.B0088),
                    content : Lang.getText(Lang.Type.A0037),
                    callback: () => Utility.FlowManager.gotoLobby(),
                });

            } else if (status === Types.SyncWarStatus.Synchronized) {
                const requestType = data.requestType as Types.SyncWarRequestType;
                if (requestType === Types.SyncWarRequestType.PlayerRequest) {
                    FloatText.show(Lang.getText(Lang.Type.A0038));
                } else {
                    // Nothing to do.
                }

            } else {
                // Something wrong!!
                war.setIsEnded(true);
                CommonAlertPanel.show({
                    title   : Lang.getText(Lang.Type.B0088),
                    content : Lang.getText(Lang.Type.A0037),
                    callback: () => Utility.FlowManager.gotoLobby(),
                });
            }
        }
    }

    export function updateByActionContainer(container: ActionContainer, warId: number): void {
        const war = getWar();
        if ((war) && (war.getWarId() === warId)) {
            if (container.actionId !== war.getExecutedActionsCount() + _cachedActions.length) {
                MpwProxy.reqMcwCommonSyncWar(war, Types.SyncWarRequestType.ReconnectionRequest);
            } else {
                _cachedActions.push(container);
                MpwActionExecutor.checkAndRunFirstCachedAction(war, _cachedActions);
            }
        }
    }

    function _checkAndRequestBeginTurn(war: MpwWar): void {
        const turnManager = war.getTurnManager();
        if ((turnManager.getPhaseCode() === Types.TurnPhaseCode.WaitBeginTurn)      &&
            (war.getPlayerIndexLoggedIn() ===  turnManager.getPlayerIndexInTurn())
        ) {
            (war.getActionPlanner() as MpwActionPlanner).setStateRequestingPlayerBeginTurn();
        }
    }
}
