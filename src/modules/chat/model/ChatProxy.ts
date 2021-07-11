
import * as NetManager          from "../../../network/NetManager";
import { NetMessageCodes }      from "../../../network/NetMessageCodes";
import * as Notify              from "../../../utility/Notify";
import * as ProtoTypes          from "../../../utility/ProtoTypes";
import * as Types               from "../../../utility/Types";
import * as TimeModel           from "../../time/model/TimeModel";
import * as ChatModel           from "./ChatModel";
import NetMessage               = ProtoTypes.NetMessage;

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
        Notify.dispatch(Notify.Type.MsgChatAddMessage, data);
    }
}

export function reqGetAllMessages(): void {
    NetManager.send({ MsgChatGetAllMessages: { c: {} } });
}
function _onMsgChatGetAllMessages(e: egret.Event): void {
    const data = e.data as NetMessage.MsgChatGetAllMessages.IS;
    if (!data.errorCode) {
        ChatModel.setAllMessages(data.messageList);
        Notify.dispatch(Notify.Type.MsgChatGetAllMessages, data);
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
        Notify.dispatch(Notify.Type.MsgChatUpdateReadProgress, data);
    }
}

export function reqGetAllReadProgressList(): void {
    NetManager.send({ MsgChatGetAllReadProgressList: { c: {} } });
}
function _onMsgChatGetAllReadProgressList(e: egret.Event): void {
    const data = e.data as NetMessage.MsgChatGetAllReadProgressList.IS;
    if (!data.errorCode) {
        ChatModel.resetAllReadProgress(data.list);
        Notify.dispatch(Notify.Type.MsgChatGetAllReadProgressList, data);
    }
}
