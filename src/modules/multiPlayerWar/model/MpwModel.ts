
import { TwnsClientErrorCode }  from "../../../utility/ClientErrorCode";
import { TwnsCommonAlertPanel }     from "../../common/view/CommonAlertPanel";
import { MpwWar }               from "./MpwWar";
import { CcwWar }               from "../../coopCustomWar/model/CcwWar";
import { McwWar }               from "../../multiCustomWar/model/McwWar";
import { MfwWar }               from "../../multiFreeWar/model/MfwWar";
import { MrwWar }               from "../../multiRankWar/model/MrwWar";
import { TwnsLangTextType }     from "../../../utility/lang/LangTextType";
import { Logger }               from "../../../utility/Logger";
import { Notify }               from "../../../utility/notify/Notify";
import { TwnsNotifyType }       from "../../../utility/notify/NotifyType";
import { Types }                from "../../../utility/Types";
import { FlowManager }          from "../../../utility/FlowManager";
import { FloatText }            from "../../../utility/FloatText";
import { Lang }                 from "../../../utility/lang/Lang";
import { ProtoTypes }           from "../../../utility/proto/ProtoTypes";
import { MpwProxy }             from "../../multiPlayerWar/model/MpwProxy";
import { UserModel }            from "../../user/model/UserModel";
import { BwWarActionExecutor }  from "../../baseWar/model/BwWarActionExecutor";

export namespace MpwModel {
    import LangTextType             = TwnsLangTextType.LangTextType;
    import NotifyType               = TwnsNotifyType.NotifyType;
    import IMpwWarInfo              = ProtoTypes.MultiPlayerWar.IMpwWarInfo;
    import IMpwWatchInfo            = ProtoTypes.MultiPlayerWar.IMpwWatchInfo;
    import IWarActionContainer      = ProtoTypes.WarAction.IWarActionContainer;
    import ClientErrorCode          = TwnsClientErrorCode.ClientErrorCode;

    let _allWarInfoList         : IMpwWarInfo[] = [];
    let _unwatchedWarInfos      : IMpwWatchInfo[];
    let _watchOngoingWarInfos   : IMpwWatchInfo[];
    let _watchRequestedWarInfos : IMpwWatchInfo[];
    let _watchedWarInfos        : IMpwWatchInfo[];
    let _mcwPreviewingWarId     : number | undefined;
    let _mrwPreviewingWarId     : number | undefined;
    let _mfwPreviewingWarId     : number | undefined;
    let _ccwPreviewingWarId     : number | undefined;
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
    export function getMyCcwWarInfoArray(): IMpwWarInfo[] {
        return getAllMyWarInfoList().filter(v => v.settingsForCcw != null);
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
            Notify.dispatch(NotifyType.McwPreviewingWarIdChanged);
        }
    }

    export function getMrwPreviewingWarId(): number | undefined {
        return _mrwPreviewingWarId;
    }
    export function setMrwPreviewingWarId(warId: number | undefined): void {
        if (getMrwPreviewingWarId() != warId) {
            _mrwPreviewingWarId = warId;
            Notify.dispatch(NotifyType.MrwPreviewingWarIdChanged);
        }
    }

    export function getMfwPreviewingWarId(): number | undefined {
        return _mfwPreviewingWarId;
    }
    export function setMfwPreviewingWarId(warId: number | undefined): void {
        if (getMfwPreviewingWarId() != warId) {
            _mfwPreviewingWarId = warId;
            Notify.dispatch(NotifyType.MfwPreviewingWarIdChanged);
        }
    }

    export function getCcwPreviewingWarId(): number | undefined {
        return _ccwPreviewingWarId;
    }
    export function setCcwPreviewingWarId(warId: number | undefined): void {
        if (getCcwPreviewingWarId() != warId) {
            _ccwPreviewingWarId = warId;
            Notify.dispatch(NotifyType.CcwPreviewingWarIdChanged);
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
    export function checkIsRedForMyCcwWars(): boolean {
        return checkIsRedForMyWars(getMyCcwWarInfoArray());
    }
    export function checkIsRedForMyWar(warInfo: IMpwWarInfo | null | undefined): boolean {
        if (warInfo == null) {
            return false;
        } else {
            const selfUserId = UserModel.getSelfUserId();
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

        const war = createWarByWarData(data);
        if (war == null) {
            return { errorCode: ClientErrorCode.MpwModel_LoadWar_00 };
        }

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
                TwnsCommonAlertPanel.CommonAlertPanel.show({
                    title   : Lang.getText(LangTextType.B0088),
                    content : Lang.getText(LangTextType.A0023),
                    callback: () => {
                        if (war instanceof MrwWar) {
                            FlowManager.gotoMrwMyWarListPanel();
                        } else if (war instanceof MfwWar) {
                            FlowManager.gotoMfwMyWarListPanel();
                        } else if (war instanceof CcwWar) {
                            FlowManager.gotoCcwMyWarListPanel();
                        } else if (war instanceof McwWar) {
                            FlowManager.gotoMcwMyWarListPanel();
                        }
                    },
                });

            } else if (status === Types.SyncWarStatus.EndedOrNotExists) {
                war.setIsEnded(true);
                TwnsCommonAlertPanel.CommonAlertPanel.show({
                    title   : Lang.getText(LangTextType.B0088),
                    content : Lang.getText(LangTextType.A0035),
                    callback: () => {
                        if (war instanceof MrwWar) {
                            FlowManager.gotoMrwMyWarListPanel();
                        } else if (war instanceof MfwWar) {
                            FlowManager.gotoMfwMyWarListPanel();
                        } else if (war instanceof CcwWar) {
                            FlowManager.gotoCcwMyWarListPanel();
                        } else if (war instanceof McwWar) {
                            FlowManager.gotoMcwMyWarListPanel();
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
                        await FlowManager.gotoMultiPlayerWar(warData);
                        FloatText.show(Lang.getText(LangTextType.A0038));
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
                                await FlowManager.gotoMultiPlayerWar(warData);
                                FloatText.show(Lang.getText(LangTextType.A0036));
                            }

                        } else {
                            if (requestType === Types.SyncWarRequestType.PlayerRequest) {
                                FloatText.show(Lang.getText(LangTextType.A0038));
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
                TwnsCommonAlertPanel.CommonAlertPanel.show({
                    title   : Lang.getText(LangTextType.B0088),
                    content : Lang.getText(LangTextType.A0037),
                    callback: () => FlowManager.gotoLobby(),
                });

            } else if (status === Types.SyncWarStatus.Synchronized) {
                const requestType = data.requestType as Types.SyncWarRequestType;
                if (requestType === Types.SyncWarRequestType.PlayerRequest) {
                    FloatText.show(Lang.getText(LangTextType.A0038));
                } else {
                    // Nothing to do.
                }

            } else {
                // Something wrong!!
                war.setIsEnded(true);
                TwnsCommonAlertPanel.CommonAlertPanel.show({
                    title   : Lang.getText(LangTextType.B0088),
                    content : Lang.getText(LangTextType.A0037),
                    callback: () => FlowManager.gotoLobby(),
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

        const selfUserId = UserModel.getSelfUserId();
        if (selfUserId == null) {
            Logger.error(`MpwModel.checkAndRunFirstCachedAction() empty selfUserId.`);
            return;
        }

        war.getExecutedActionManager().addExecutedAction(container);

        const errorCode = await BwWarActionExecutor.checkAndExecute(war, container, false);
        if (errorCode) {
            Logger.error(`MpwModel.checkAndRunFirstCachedAction() errorCode: ${errorCode}.`);
        }

        const playerManager     = war.getPlayerManager();
        const remainingVotes    = war.getDrawVoteManager().getRemainingVotes();
        const selfPlayer        = playerManager.getPlayerByUserId(selfUserId);
        const callbackForGoBack = () => {
            if (war instanceof MrwWar) {
                FlowManager.gotoMrwMyWarListPanel();
            } else if (war instanceof MfwWar) {
                FlowManager.gotoMfwMyWarListPanel();
            } else if (war instanceof CcwWar) {
                FlowManager.gotoCcwMyWarListPanel();
            } else if (war instanceof McwWar) {
                FlowManager.gotoMcwMyWarListPanel();
            }
        };
        if (war.getIsEnded()) {
            if (remainingVotes === 0) {
                TwnsCommonAlertPanel.CommonAlertPanel.show({
                    title   : Lang.getText(LangTextType.B0088),
                    content : Lang.getText(LangTextType.A0030),
                    callback: callbackForGoBack,
                });
            } else {
                if (selfPlayer == null) {
                    TwnsCommonAlertPanel.CommonAlertPanel.show({
                        title   : Lang.getText(LangTextType.B0088),
                        content : Lang.getText(LangTextType.A0035),
                        callback: callbackForGoBack,
                    });
                } else {
                    TwnsCommonAlertPanel.CommonAlertPanel.show({
                        title   : Lang.getText(LangTextType.B0088),
                        content : selfPlayer.getAliveState() === Types.PlayerAliveState.Alive ? Lang.getText(LangTextType.A0022) : Lang.getText(LangTextType.A0023),
                        callback: callbackForGoBack,
                    });
                }
            }
        } else {
            if (war.getIsRunning()) {
                if (!war.getPlayerManager().getAliveWatcherTeamIndexesForSelf().size) {
                    war.setIsEnded(true);
                    TwnsCommonAlertPanel.CommonAlertPanel.show({
                        title   : Lang.getText(LangTextType.B0035),
                        content : selfPlayer ? Lang.getText(LangTextType.A0023) : Lang.getText(LangTextType.A0152),
                        callback: callbackForGoBack,
                    });
                } else {
                    checkAndRunFirstCachedAction(war, actionList);
                }
            }
        }
    }

    function createWarByWarData(data: ProtoTypes.WarSerialization.ISerialWar): MpwWar | undefined {
        if (data.settingsForMcw) {
            return new McwWar();
        } else if (data.settingsForMrw) {
            return new MrwWar();
        } else if (data.settingsForMfw) {
            return new MfwWar();
        } else if (data.settingsForCcw) {
            return new CcwWar();
        } else {
            return undefined;
        }
    }
}
