
import TwnsNetMessageCodes  from "../../tools/network/NetMessageCodes";
import { CommonConfirmPanel }   from "../../common/view/CommonConfirmPanel";
import TwnsBwWar                from "../../baseWar/model/BwWar";
import TwnsLangTextType     from "../../tools/lang/LangTextType";
import Notify               from "../../tools/notify/Notify";
import TwnsNotifyType       from "../../tools/notify/NotifyType";
import Types                from "../../tools/helpers/Types";
import MpwModel             from "../../multiPlayerWar/model/MpwModel";
import NetManager           from "../../tools/network/NetManager";
import Lang                 from "../../tools/lang/Lang";
import ProtoTypes           from "../../tools/proto/ProtoTypes";

namespace MpwProxy {
    import LangTextType     = TwnsLangTextType.LangTextType;
    import NotifyType       = TwnsNotifyType.NotifyType;
    import NetMessage       = ProtoTypes.NetMessage;
    import NetMessageCodes  = TwnsNetMessageCodes.NetMessageCodes;
    import BwWar            = TwnsBwWar.BwWar;

    export function init(): void {
        NetManager.addListeners([
            { msgCode: NetMessageCodes.MsgMpwCommonBroadcastGameStart,        callback: _onMsgMpwCommonBroadcastGameStart },
            { msgCode: NetMessageCodes.MsgMpwCommonHandleBoot,                callback: _onMsgMpwCommonHandleBoot },
            { msgCode: NetMessageCodes.MsgMpwCommonContinueWar,               callback: _onMsgMpwCommonContinueWar },
            { msgCode: NetMessageCodes.MsgMpwCommonGetMyWarInfoList,          callback: _onMsgMpwCommonGetMyWarInfoList },
            { msgCode: NetMessageCodes.MsgMpwCommonSyncWar,                   callback: _onMsgMpwCommonSyncWar },

            { msgCode: NetMessageCodes.MsgMpwWatchGetUnwatchedWarInfos,       callback: _onMsgMpwWatchGetUnwatchedWarInfos },
            { msgCode: NetMessageCodes.MsgMpwWatchGetOngoingWarInfos,         callback: _onMsgMpwWatchGetOngoingWarInfos },
            { msgCode: NetMessageCodes.MsgMpwWatchGetRequestedWarInfos,       callback: _onMsgMpwWatchGetRequestedWarInfos },
            { msgCode: NetMessageCodes.MsgMpwWatchGetWatchedWarInfos,         callback: _onMsgMpwWatchGetWatchedWarInfos },
            { msgCode: NetMessageCodes.MsgMpwWatchMakeRequest,                callback: _onMsgMpwWatchMakeRequest },
            { msgCode: NetMessageCodes.MsgMpwWatchHandleRequest,              callback: _onMsgMpwWatchHandleRequest },
            { msgCode: NetMessageCodes.MsgMpwWatchDeleteWatcher,              callback: _onMsgMpwWatchDeleteWatcher },
            { msgCode: NetMessageCodes.MsgMpwWatchContinueWar,                callback: _onMsgMpwWatchContinueWar },

            { msgCode: NetMessageCodes.MsgMpwExecuteWarAction,                callback: _onMsgMpwExecuteWarAction },
        ], undefined);
    }

    function _onMsgMpwCommonBroadcastGameStart(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMpwCommonBroadcastGameStart.IS;
        Lang.getGameStartDesc(data).then(desc => {
            CommonConfirmPanel.show({
                title   : Lang.getText(LangTextType.B0392),
                content : desc,
                callback: () => {
                    reqMpwCommonContinueWar(data.warId);
                },
            });
        });
    }

    export function reqMpwCommonContinueWar(warId: number): void {
        NetManager.send({
            MsgMpwCommonContinueWar: { c: {
                warId,
            }, },
        });
    }
    function _onMsgMpwCommonContinueWar(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMpwCommonContinueWar.IS;
        if (data.errorCode) {
            Notify.dispatch(NotifyType.MsgMpwCommonContinueWarFailed, data);
        } else {
            Notify.dispatch(NotifyType.MsgMpwCommonContinueWar, data);
        }
    }

    export function reqMpwCommonGetMyWarInfoList(): void {
        NetManager.send({
            MsgMpwCommonGetMyWarInfoList: { c: {} },
        });
    }
    function _onMsgMpwCommonGetMyWarInfoList(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMpwCommonGetMyWarInfoList.IS;
        MpwModel.setAllMyWarInfoList(data.infos);
        Notify.dispatch(NotifyType.MsgMpwCommonGetMyWarInfoList, data);
    }

    export function reqMpwCommonSyncWar(war: BwWar, requestType: Types.SyncWarRequestType): void {
        NetManager.send({
            MsgMpwCommonSyncWar: { c: {
                warId               : war.getWarId(),
                executedActionsCount: war.getExecutedActionManager().getExecutedActionsCount(),
                requestType,
            }, }
        });
    }
    function _onMsgMpwCommonSyncWar(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMpwCommonSyncWar.IS;
        if (!data.errorCode) {
            MpwModel.updateOnPlayerSyncWar(data);
            Notify.dispatch(NotifyType.MsgMpwCommonSyncWar);
        }
    }

    export function reqUnwatchedWarInfos(): void {
        NetManager.send({
            MsgMpwWatchGetUnwatchedWarInfos: { c: {
            } },
        });
    }
    function _onMsgMpwWatchGetUnwatchedWarInfos(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMpwWatchGetUnwatchedWarInfos.IS;
        if (!data.errorCode) {
            MpwModel.setUnwatchedWarInfos(data.infos);
            Notify.dispatch(NotifyType.MsgMpwWatchGetUnwatchedWarInfos, data);
        }
    }

    export function reqWatchGetOngoingWarInfos(): void {
        NetManager.send({
            MsgMpwWatchGetOngoingWarInfos: { c: {
            } },
        });
    }
    function _onMsgMpwWatchGetOngoingWarInfos(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMpwWatchGetOngoingWarInfos.IS;
        if (!data.errorCode) {
            MpwModel.setWatchOngoingWarInfos(data.infos);
            Notify.dispatch(NotifyType.MsgMpwWatchGetOngoingWarInfos, data);
        }
    }

    export function reqWatchRequestedWarInfos(): void {
        NetManager.send({
            MsgMpwWatchGetRequestedWarInfos: { c: {
            }, }
        });
    }
    function _onMsgMpwWatchGetRequestedWarInfos(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMpwWatchGetRequestedWarInfos.IS;
        if (!data.errorCode) {
            MpwModel.setWatchRequestedWarInfos(data.infos);
            Notify.dispatch(NotifyType.MsgMpwWatchGetRequestedWarInfos, data);
        }
    }

    export function reqWatchedWarInfos(): void {
        NetManager.send({
            MsgMpwWatchGetWatchedWarInfos: { c: {
            }, }
        });
    }
    function _onMsgMpwWatchGetWatchedWarInfos(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMpwWatchGetWatchedWarInfos.IS;
        if (!data.errorCode) {
            MpwModel.setWatchedWarInfos(data.infos);
            Notify.dispatch(NotifyType.MsgMpwWatchGetWatchedWarInfos, data);
        }
    }

    export function reqWatchMakeRequest(warId: number, dstUserIds: number[]): void {
        NetManager.send({
            MsgMpwWatchMakeRequest: { c: {
                warId,
                dstUserIds,
            }, }
        });
    }
    function _onMsgMpwWatchMakeRequest(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMpwWatchMakeRequest.IS;
        if (!data.errorCode) {
            Notify.dispatch(NotifyType.MsgMpwWatchMakeRequest, data);
        }
    }

    export function reqWatchHandleRequest(warId: number, acceptSrcUserIds: number[], declineSrcUserIds: number[]): void {
        NetManager.send({
            MsgMpwWatchHandleRequest: { c: {
                warId,
                acceptSrcUserIds,
                declineSrcUserIds,
            }, }
        });
    }
    function _onMsgMpwWatchHandleRequest(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMpwWatchHandleRequest.IS;
        if (!data.errorCode) {
            Notify.dispatch(NotifyType.MsgMpwWatchHandleRequest, data);
        }
    }

    export function reqWatchDeleteWatcher(warId: number, watcherUserIds: number[]): void {
        NetManager.send({
            MsgMpwWatchDeleteWatcher: { c: {
                warId,
                watcherUserIds,
            }, }
        });
    }
    function _onMsgMpwWatchDeleteWatcher(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMpwWatchDeleteWatcher.IS;
        if (!data.errorCode) {
            Notify.dispatch(NotifyType.MsgMpwWatchDeleteWatcher, data);
        }
    }

    export function reqWatchContinueWar(warId: number): void {
        NetManager.send({
            MsgMpwWatchContinueWar: { c: {
                warId,
            }, }
        });
    }
    function _onMsgMpwWatchContinueWar(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMpwWatchContinueWar.IS;
        if (data.errorCode) {
            Notify.dispatch(NotifyType.MsgMpwWatchContinueWarFailed, data);
        } else {
            Notify.dispatch(NotifyType.MsgMpwWatchContinueWar, data);
        }
    }

    export function reqMpwCommonHandleBoot(warId: number): void {
        NetManager.send({
            MsgMpwCommonHandleBoot: { c: {
                warId,
            }, },
        });
    }
    function _onMsgMpwCommonHandleBoot(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMpwCommonHandleBoot.IS;
        if (!data.errorCode) {
            Notify.dispatch(NotifyType.MsgMpwCommonHandleBoot, data);
        }
    }

    export function reqMpwExecuteWarAction(war: BwWar, actionContainer: ProtoTypes.WarAction.IWarActionContainer): void {
        NetManager.send({
            MsgMpwExecuteWarAction: { c: {
                warId           : war.getWarId(),
                actionContainer,
            }, },
        });
    }
    function _onMsgMpwExecuteWarAction(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMpwExecuteWarAction.IS;
        if (!data.errorCode) {
            MpwModel.updateByActionContainer(data.actionContainer, data.warId);
            Notify.dispatch(NotifyType.MsgMpwExecuteWarAction, data);
        }
    }
}

export default MpwProxy;
