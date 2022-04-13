
// import TwnsBwWar                from "../../baseWar/model/BwWar";
// import TwnsCommonConfirmPanel   from "../../common/view/CommonConfirmPanel";
// import MpwModel                 from "../../multiPlayerWar/model/MpwModel";
// import Helpers                  from "../../tools/helpers/Helpers";
// import Types                    from "../../tools/helpers/Types";
// import Lang                     from "../../tools/lang/Lang";
// import TwnsLangTextType         from "../../tools/lang/LangTextType";
// import NetManager               from "../../tools/network/NetManager";
// import TwnsNetMessageCodes      from "../../tools/network/NetMessageCodes";
// import Notify                   from "../../tools/notify/Notify";
// import TwnsNotifyType           from "../../tools/notify/NotifyType";
// import ProtoTypes               from "../../tools/proto/ProtoTypes";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.MultiPlayerWar.MpwProxy {
    import LangTextType         = TwnsLangTextType.LangTextType;
    import NotifyType           = TwnsNotifyType.NotifyType;
    import NetMessage           = CommonProto.NetMessage;
    import NetMessageCodes      = TwnsNetMessageCodes.NetMessageCodes;

    export function init(): void {
        NetManager.addListeners([
            { msgCode: NetMessageCodes.MsgMpwCommonBroadcastGameStart,      callback: _onMsgMpwCommonBroadcastGameStart },
            { msgCode: NetMessageCodes.MsgMpwCommonHandleBoot,              callback: _onMsgMpwCommonHandleBoot },
            { msgCode: NetMessageCodes.MsgMpwCommonContinueWar,             callback: _onMsgMpwCommonContinueWar },
            { msgCode: NetMessageCodes.MsgMpwCommonSyncWar,                 callback: _onMsgMpwCommonSyncWar },
            { msgCode: NetMessageCodes.MsgMpwCommonGetWarSettings,          callback: _onMsgMpwCommonGetWarSettings },
            { msgCode: NetMessageCodes.MsgMpwCommonGetWarProgressInfo,      callback: _onMsgMpwCommonGetWarProgressInfo },
            { msgCode: NetMessageCodes.MsgMpwGetHalfwayReplayData,          callback: _onMsgMpwGetHalfwayReplayData },

            { msgCode: NetMessageCodes.MsgMpwExecuteWarAction,              callback: _onMsgMpwExecuteWarAction },
        ], null);
    }

    function _onMsgMpwCommonBroadcastGameStart(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMpwCommonBroadcastGameStart.IS;
        Lang.getGameStartDesc(data).then(desc => {
            TwnsPanelManager.open(TwnsPanelConfig.Dict.CommonConfirmPanel, {
                title   : Lang.getText(LangTextType.B0392),
                content : desc,
                callback: () => {
                    reqMpwCommonContinueWar(Helpers.getExisted(data.warId));
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

    export function reqMpwCommonSyncWar(war: BaseWar.BwWar, requestType: Types.SyncWarRequestType): void {
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

    export function reqMpwCommonGetWarSettings(warId: number): void {
        NetManager.send({
            MsgMpwCommonGetWarSettings: { c: {
                warId
            } },
        });
    }
    function _onMsgMpwCommonGetWarSettings(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMpwCommonGetWarSettings.IS;
        MpwModel.updateOnMsgMpwCommonGetWarSettings(data);
        Notify.dispatch(NotifyType.MsgMpwCommonGetWarSettings, data);
    }

    export function reqMpwCommonGetWarProgressInfo(warId: number): void {
        NetManager.send({
            MsgMpwCommonGetWarProgressInfo: { c: {
                warId
            } },
        });
    }
    function _onMsgMpwCommonGetWarProgressInfo(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMpwCommonGetWarProgressInfo.IS;
        MpwModel.updateOnMsgMpwCommonGetWarProgressInfo(data);
        Notify.dispatch(NotifyType.MsgMpwCommonGetWarProgressInfo, data);
    }

    export function reqMpwGetHalfwayReplayData(warId: number): void {
        NetManager.send({
            MsgMpwGetHalfwayReplayData: { c: {
                warId,
            } },
        });
    }
    function _onMsgMpwGetHalfwayReplayData(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMpwGetHalfwayReplayData.IS;
        if (data.errorCode) {
            Notify.dispatch(NotifyType.MsgMpwGetHalfwayReplayDataFailed, data);
        } else {
            Notify.dispatch(NotifyType.MsgMpwGetHalfwayReplayData, data);
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

    export function reqMpwExecuteWarAction(war: BaseWar.BwWar, actionContainer: CommonProto.WarAction.IWarActionContainer): void {
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
            MpwModel.updateOnMsgMpwExecuteWarAction(Helpers.getExisted(data.actionContainer), Helpers.getExisted(data.warId));
            Notify.dispatch(NotifyType.MsgMpwExecuteWarAction, data);
        }
    }
}

// export default MpwProxy;
