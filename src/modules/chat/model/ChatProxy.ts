
import { TwnsNetMessageCodes }  from "../../../utility/network/NetMessageCodes";
import { Notify }               from "../../../utility/notify/Notify";
import { TwnsNotifyType }       from "../../../utility/notify/NotifyType";
import { Types }                from "../../../utility/Types";
import { NetManager }           from "../../../utility/network/NetManager";
import { ProtoTypes }           from "../../../utility/proto/ProtoTypes";
import { TimeModel }            from "../../time/model/TimeModel";
import { ChatModel }            from "./ChatModel";

export namespace ChatProxy {
    import NetMessage       = ProtoTypes.NetMessage;
    import NetMessageCodes  = TwnsNetMessageCodes.NetMessageCodes;
    import NotifyType       = TwnsNotifyType.NotifyType;

    export function init(): void {
        NetManager.addListeners([
            { msgCode: NetMessageCodes.MsgChatAddMessage,                callback: _onMsgChatAddMessage,             },
            { msgCode: NetMessageCodes.MsgChatGetAllMessages,            callback: _onMsgChatGetAllMessages          },
            { msgCode: NetMessageCodes.MsgChatUpdateReadProgress,        callback: _onMsgChatUpdateReadProgress      },
            { msgCode: NetMessageCodes.MsgChatGetAllReadProgressList,    callback: _onMsgChatGetAllReadProgressList  },
        ], undefined);
    }

    export function reqChatAddMessage(
        content     : string,
        toCategory  : Types.ChatMessageToCategory,
        toTarget    : number,
    ): void {
        NetManager.send({ MsgChatAddMessage: { c: {
            toCategory,
            toTarget,
            content,
        }, } });
    }
    function _onMsgChatAddMessage(e: egret.Event): void {
        const data = e.data as NetMessage.MsgChatAddMessage.IS;
        if (!data.errorCode) {
            ChatModel.updateOnAddMessage(data.message, true);
            Notify.dispatch(NotifyType.MsgChatAddMessage, data);
        }
    }

    export function reqGetAllMessages(): void {
        NetManager.send({ MsgChatGetAllMessages: { c: {} } });
    }
    function _onMsgChatGetAllMessages(e: egret.Event): void {
        const data = e.data as NetMessage.MsgChatGetAllMessages.IS;
        if (!data.errorCode) {
            ChatModel.setAllMessages(data.messageList);
            Notify.dispatch(NotifyType.MsgChatGetAllMessages, data);
        }
    }

    export function reqUpdateReadProgress(
        toCategory  : Types.ChatMessageToCategory,
        toTarget    : number,
        timestamp   = TimeModel.getServerTimestamp(),
    ): void {
        NetManager.send({ MsgChatUpdateReadProgress: { c: {
            progress: {
                toCategory,
                toTarget,
                timestamp,
            }, }
        } });
    }
    function _onMsgChatUpdateReadProgress(e: egret.Event): void {
        const data = e.data as NetMessage.MsgChatUpdateReadProgress.IS;
        if (!data.errorCode) {
            ChatModel.setReadProgress(data.progress);
            Notify.dispatch(NotifyType.MsgChatUpdateReadProgress, data);
        }
    }

    export function reqGetAllReadProgressList(): void {
        NetManager.send({ MsgChatGetAllReadProgressList: { c: {} } });
    }
    function _onMsgChatGetAllReadProgressList(e: egret.Event): void {
        const data = e.data as NetMessage.MsgChatGetAllReadProgressList.IS;
        if (!data.errorCode) {
            ChatModel.resetAllReadProgress(data.list);
            Notify.dispatch(NotifyType.MsgChatGetAllReadProgressList, data);
        }
    }
}
