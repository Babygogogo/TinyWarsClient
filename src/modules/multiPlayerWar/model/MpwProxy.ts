
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
// import Twns.Notify           from "../../tools/notify/NotifyType";
// import ProtoTypes               from "../../tools/proto/ProtoTypes";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.MultiPlayerWar.MpwProxy {
    import LangTextType         = Twns.Lang.LangTextType;
    import NotifyType           = Twns.Notify.NotifyType;
    import NetMessage           = CommonProto.NetMessage;
    import NetMessageCodes      = Twns.Net.NetMessageCodes;

    export function init(): void {
        Twns.Net.NetManager.addListeners([
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
            Twns.PanelHelpers.open(Twns.PanelHelpers.PanelDict.CommonConfirmPanel, {
                title   : Lang.getText(LangTextType.B0392),
                content : desc,
                callback: () => {
                    reqMpwCommonContinueWar(Twns.Helpers.getExisted(data.warId));
                },
            });
        });
    }

    export function reqMpwCommonContinueWar(warId: number): void {
        Twns.Net.NetManager.send({
            MsgMpwCommonContinueWar: { c: {
                warId,
            }, },
        });
    }
    function _onMsgMpwCommonContinueWar(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMpwCommonContinueWar.IS;
        if (data.errorCode) {
            Twns.Notify.dispatch(NotifyType.MsgMpwCommonContinueWarFailed, data);
        } else {
            Twns.Notify.dispatch(NotifyType.MsgMpwCommonContinueWar, data);
        }
    }

    export function reqMpwCommonSyncWar(war: BaseWar.BwWar, requestType: Twns.Types.SyncWarRequestType): void {
        Twns.Net.NetManager.send({
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
            Twns.Notify.dispatch(NotifyType.MsgMpwCommonSyncWar);
        }
    }

    export function reqMpwCommonGetWarSettings(warId: number): void {
        Twns.Net.NetManager.send({
            MsgMpwCommonGetWarSettings: { c: {
                warId
            } },
        });
    }
    function _onMsgMpwCommonGetWarSettings(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMpwCommonGetWarSettings.IS;
        MpwModel.updateOnMsgMpwCommonGetWarSettings(data);
        Twns.Notify.dispatch(NotifyType.MsgMpwCommonGetWarSettings, data);
    }

    export function reqMpwCommonGetWarProgressInfo(warId: number): void {
        Twns.Net.NetManager.send({
            MsgMpwCommonGetWarProgressInfo: { c: {
                warId
            } },
        });
    }
    function _onMsgMpwCommonGetWarProgressInfo(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMpwCommonGetWarProgressInfo.IS;
        MpwModel.updateOnMsgMpwCommonGetWarProgressInfo(data);
        Twns.Notify.dispatch(NotifyType.MsgMpwCommonGetWarProgressInfo, data);
    }

    export function reqMpwGetHalfwayReplayData(warId: number): void {
        Twns.Net.NetManager.send({
            MsgMpwGetHalfwayReplayData: { c: {
                warId,
            } },
        });
    }
    function _onMsgMpwGetHalfwayReplayData(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMpwGetHalfwayReplayData.IS;
        if (data.errorCode) {
            Twns.Notify.dispatch(NotifyType.MsgMpwGetHalfwayReplayDataFailed, data);
        } else {
            Twns.Notify.dispatch(NotifyType.MsgMpwGetHalfwayReplayData, data);
        }
    }

    export function reqMpwCommonHandleBoot(warId: number): void {
        Twns.Net.NetManager.send({
            MsgMpwCommonHandleBoot: { c: {
                warId,
            }, },
        });
    }
    function _onMsgMpwCommonHandleBoot(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMpwCommonHandleBoot.IS;
        if (!data.errorCode) {
            Twns.Notify.dispatch(NotifyType.MsgMpwCommonHandleBoot, data);
        }
    }

    export function reqMpwExecuteWarAction(war: BaseWar.BwWar, actionContainer: CommonProto.WarAction.IWarActionContainer): void {
        Twns.Net.NetManager.send({
            MsgMpwExecuteWarAction: { c: {
                warId           : war.getWarId(),
                actionContainer,
            }, },
        });
    }
    function _onMsgMpwExecuteWarAction(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMpwExecuteWarAction.IS;
        if (!data.errorCode) {
            MpwModel.updateOnMsgMpwExecuteWarAction(Twns.Helpers.getExisted(data.actionContainer), Twns.Helpers.getExisted(data.warId));
            Twns.Notify.dispatch(NotifyType.MsgMpwExecuteWarAction, data);
        }
    }
}

// export default MpwProxy;
