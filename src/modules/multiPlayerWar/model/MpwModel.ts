
namespace TinyWars.MultiPlayerWar.MpwModel {
    import Types                = Utility.Types;
    import Logger               = Utility.Logger;
    import ProtoTypes           = Utility.ProtoTypes;
    import Notify               = Utility.Notify;
    import Lang                 = Utility.Lang;
    import FloatText            = Utility.FloatText;
    import ClientErrorCode      = Utility.ClientErrorCode;
    import CommonAlertPanel     = Common.CommonAlertPanel;
    import IMpwWarInfo          = ProtoTypes.MultiPlayerWar.IMpwWarInfo;
    import IMpwWatchInfo        = ProtoTypes.MultiPlayerWar.IMpwWatchInfo;
    import IWarActionContainer  = ProtoTypes.WarAction.IWarActionContainer;

    let _allWarInfoList         : IMpwWarInfo[] = [];
    let _unwatchedWarInfos      : IMpwWatchInfo[];
    let _watchOngoingWarInfos   : IMpwWatchInfo[];
    let _watchRequestedWarInfos : IMpwWatchInfo[];
    let _watchedWarInfos        : IMpwWatchInfo[];
    let _mcwPreviewingWarId     : number | undefined;
    let _mrwPreviewingWarId     : number | undefined;
    let _mfwPreviewingWarId     : number | undefined;
    let _war                    : MpwWar | undefined;
    const _cachedActions        : IWarActionContainer[] = [];

    export function init(): void {
        // nothing to do.
    }

    export function setAllMyWarInfoList(infoList: IMpwWarInfo[]): void {
        _allWarInfoList = infoList || [];
    }
    function getAllMyWarInfoList(): IMpwWarInfo[] {
        return _allWarInfoList;
    }
    export function getMyMcwWarInfoArray(): IMpwWarInfo[] {
        return getAllMyWarInfoList().filter(v => v.settingsForMcw != null);
    }
    export function getMyMrwWarInfoArray(): IMpwWarInfo[] {
        return getAllMyWarInfoList().filter(v => v.settingsForMrw != null);
    }
    export function getMyMfwWarInfoArray(): IMpwWarInfo[] {
        return getAllMyWarInfoList().filter(v => v.settingsForMfw != null);
    }
    export function getMyWarInfo(warId: number): IMpwWarInfo | undefined {
        return getAllMyWarInfoList().find(v => v.warId === warId);
    }

    export function getMcwPreviewingWarId(): number | undefined {
        return _mcwPreviewingWarId;
    }
    export function setMcwPreviewingWarId(warId: number | undefined): void {
        if (getMcwPreviewingWarId() != warId) {
            _mcwPreviewingWarId = warId;
            Notify.dispatch(Notify.Type.McwPreviewingWarIdChanged);
        }
    }

    export function getMrwPreviewingWarId(): number | undefined {
        return _mrwPreviewingWarId;
    }
    export function setMrwPreviewingWarId(warId: number | undefined): void {
        if (getMrwPreviewingWarId() != warId) {
            _mrwPreviewingWarId = warId;
            Notify.dispatch(Notify.Type.MrwPreviewingWarIdChanged);
        }
    }

    export function getMfwPreviewingWarId(): number | undefined {
        return _mfwPreviewingWarId;
    }
    export function setMfwPreviewingWarId(warId: number | undefined): void {
        if (getMfwPreviewingWarId() != warId) {
            _mfwPreviewingWarId = warId;
            Notify.dispatch(Notify.Type.MfwPreviewingWarIdChanged);
        }
    }

    export function checkIsRedForMyMcwWars(): boolean {
        return checkIsRedForMyWars(getMyMcwWarInfoArray());
    }
    export function checkIsRedForMyMrwWars(): boolean {
        return checkIsRedForMyWars(getMyMrwWarInfoArray());
    }
    export function checkIsRedForMyMfwWars(): boolean {
        return checkIsRedForMyWars(getMyMfwWarInfoArray());
    }
    export function checkIsRedForMyWar(warInfo: IMpwWarInfo | null): boolean {
        if (warInfo == null) {
            return false;
        } else {
            const selfUserId = User.UserModel.getSelfUserId();
            return (warInfo.playerInfoList || []).some(v => (v.playerIndex === warInfo.playerIndexInTurn) && (v.userId === selfUserId));
        }
    }
    function checkIsRedForMyWars(wars: IMpwWarInfo[]): boolean {
        return wars.some(warInfo => checkIsRedForMyWar(warInfo));
    }

    export function setUnwatchedWarInfos(infos: IMpwWatchInfo[]): void {
        _unwatchedWarInfos = infos;
    }
    export function getUnwatchedWarInfos(): IMpwWatchInfo[] | null {
        return _unwatchedWarInfos;
    }

    export function setWatchOngoingWarInfos(infos: IMpwWatchInfo[]): void {
        _watchOngoingWarInfos = infos;
    }
    export function getWatchOngoingWarInfos(): IMpwWatchInfo[] | null {
        return _watchOngoingWarInfos;
    }

    export function setWatchRequestedWarInfos(infos: IMpwWatchInfo[]): void {
        _watchRequestedWarInfos = infos;
    }
    export function getWatchRequestedWarInfos(): IMpwWatchInfo[] | null {
        return _watchRequestedWarInfos;
    }

    export function setWatchedWarInfos(infos: IMpwWatchInfo[]): void {
        _watchedWarInfos = infos;
    }
    export function getWatchedWarInfos(): IMpwWatchInfo[] | null {
        return _watchedWarInfos;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for managing war.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    export async function loadWar(data: ProtoTypes.WarSerialization.ISerialWar): Promise<{ errorCode: ClientErrorCode, war?: MpwWar }> {
        if (getWar()) {
            Logger.warn(`MpwModel.loadWar() another war has been loaded already!`);
            unloadWar();
        }

        const war = data.settingsForMcw
            ? new MultiCustomWar.McwWar()
            : (data.settingsForMrw
                ? new MultiRankWar.MrwWar()
                : new MultiFreeWar.MfwWar()
            );
        const initError = await war.init(data);
        if (initError) {
            return { errorCode: initError };
        }

        war.startRunning().startRunningView();
        _setWar(war);

        return {
            errorCode   : ClientErrorCode.NoError,
            war,
        };
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
    function _setWar(war: MpwWar | undefined): void {
        _war = war;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Handlers for war actions that McwProxy receives.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    export async function updateOnPlayerSyncWar(data: ProtoTypes.NetMessage.MsgMpwCommonSyncWar.IS): Promise<void> {
        const war = getWar();
        if ((war) && (war.getWarId() === data.warId)) {
            const status    = data.status as Types.SyncWarStatus;
            const warData   = data.war;
            if (status === Types.SyncWarStatus.Defeated) {
                war.setIsEnded(true);
                CommonAlertPanel.show({
                    title   : Lang.getText(Lang.Type.B0088),
                    content : Lang.getText(Lang.Type.A0023),
                    callback: () => {
                        if (war instanceof MultiRankWar.MrwWar) {
                            Utility.FlowManager.gotoMrwMyWarListPanel();
                        } else {
                            Utility.FlowManager.gotoMcwMyWarListPanel();
                        }
                    },
                });

            } else if (status === Types.SyncWarStatus.EndedOrNotExists) {
                war.setIsEnded(true);
                CommonAlertPanel.show({
                    title   : Lang.getText(Lang.Type.B0088),
                    content : Lang.getText(Lang.Type.A0035),
                    callback: () => {
                        if (war instanceof MultiRankWar.MrwWar) {
                            Utility.FlowManager.gotoMrwMyWarListPanel();
                        } else {
                            Utility.FlowManager.gotoMcwMyWarListPanel();
                        }
                    },
                });

            } else if (status === Types.SyncWarStatus.NoError) {
                const requestType = data.requestType as Types.SyncWarRequestType;
                if (requestType === Types.SyncWarRequestType.PlayerForce) {
                    war.setIsEnded(true);
                    if (warData == null) {
                        Logger.error(`MpwModel.updateOnPlayerSyncWar() empty warData 1.`);
                    } else {
                        await Utility.FlowManager.gotoMultiPlayerWar(warData);
                        FloatText.show(Lang.getText(Lang.Type.A0038));
                    }

                } else {
                    const cachedActionsCount    = _cachedActions.length;
                    const executedActionsCount  = war.getExecutedActionManager().getExecutedActionsCount();
                    if (executedActionsCount == null) {
                        Logger.error(`MpwModel.updateOnPlayerSyncWar() empty executedActionsCount.`);
                    } else {
                        if (data.executedActionsCount !== executedActionsCount + cachedActionsCount) {
                            war.setIsEnded(true);
                            if (warData == null) {
                                Logger.error(`MpwModel.updateOnPlayerSyncWar() empty warData 2.`);
                            } else {
                                await Utility.FlowManager.gotoMultiPlayerWar(warData);
                                FloatText.show(Lang.getText(Lang.Type.A0036));
                            }

                        } else {
                            if (requestType === Types.SyncWarRequestType.PlayerRequest) {
                                FloatText.show(Lang.getText(Lang.Type.A0038));
                            } else {
                                // Nothing to do.
                            }
                            if (!war.getIsExecutingAction()) {
                                if (cachedActionsCount) {
                                    checkAndRunFirstCachedAction(war, _cachedActions);
                                } else {
                                    // Nothing to do.
                                }
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

    export function updateByActionContainer(container: IWarActionContainer, warId: number): void {
        const war = getWar();
        if ((war) && (war.getWarId() === warId)) {
            const executedActionsCount = war.getExecutedActionManager().getExecutedActionsCount();
            if (executedActionsCount == null) {
                Logger.error(`MpwModel.updateByActionContainer() empty executedActionsCount.`);
            } else {
                if (container.actionId !== executedActionsCount + _cachedActions.length) {
                    MpwProxy.reqMpwCommonSyncWar(war, Types.SyncWarRequestType.ReconnectionRequest);
                } else {
                    _cachedActions.push(container);
                    checkAndRunFirstCachedAction(war, _cachedActions);
                }
            }
        }
    }

    async function checkAndRunFirstCachedAction(war: MpwWar, actionList: IWarActionContainer[]): Promise<void> {
        if ((!war.getIsRunning()) || (war.getIsEnded()) || (war.getIsExecutingAction())) {
            return;
        }

        const container = actionList.shift();
        if (container == null) {
            return;
        }

        const selfUserId = User.UserModel.getSelfUserId();
        if (selfUserId == null) {
            Logger.error(`MpwModel.checkAndRunFirstCachedAction() empty selfUserId.`);
            return;
        }

        war.getExecutedActionManager().addExecutedAction(container);

        const errorCode = await BaseWar.BwWarActionExecutor.checkAndExecute(war, container, false);
        if (errorCode) {
            Logger.error(`MpwModel.checkAndRunFirstCachedAction() errorCode: ${errorCode}.`);
        }

        const playerManager     = war.getPlayerManager();
        const remainingVotes    = war.getDrawVoteManager().getRemainingVotes();
        const selfPlayer        = playerManager.getPlayerByUserId(selfUserId);
        const callbackForGoBack = () => {
            if (war instanceof MultiRankWar.MrwWar) {
                Utility.FlowManager.gotoMrwMyWarListPanel();
            } else {
                Utility.FlowManager.gotoMcwMyWarListPanel();
            }
        };
        if (war.getIsEnded()) {
            if (remainingVotes === 0) {
                CommonAlertPanel.show({
                    title   : Lang.getText(Lang.Type.B0088),
                    content : Lang.getText(Lang.Type.A0030),
                    callback: callbackForGoBack,
                });
            } else {
                if (selfPlayer == null) {
                    CommonAlertPanel.show({
                        title   : Lang.getText(Lang.Type.B0088),
                        content : Lang.getText(Lang.Type.A0035),
                        callback: callbackForGoBack,
                    });
                } else {
                    CommonAlertPanel.show({
                        title   : Lang.getText(Lang.Type.B0088),
                        content : selfPlayer.getAliveState() === Types.PlayerAliveState.Alive ? Lang.getText(Lang.Type.A0022) : Lang.getText(Lang.Type.A0023),
                        callback: callbackForGoBack,
                    });
                }
            }
        } else {
            if (war.getIsRunning()) {
                if (!war.getPlayerManager().getAliveWatcherTeamIndexesForSelf().size) {
                    war.setIsEnded(true);
                    CommonAlertPanel.show({
                        title   : Lang.getText(Lang.Type.B0035),
                        content : selfPlayer ? Lang.getText(Lang.Type.A0023) : Lang.getText(Lang.Type.A0152),
                        callback: callbackForGoBack,
                    });
                } else {
                    checkAndRunFirstCachedAction(war, actionList);
                }
            }
        }
    }
}
