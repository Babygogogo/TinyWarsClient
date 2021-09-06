
import TwnsNetMessageCodes  from "../../tools/network/NetMessageCodes";
import Notify               from "../../tools/notify/Notify";
import TwnsNotifyType       from "../../tools/notify/NotifyType";
import NetManager           from "../../tools/network/NetManager";
import ProtoTypes           from "../../tools/proto/ProtoTypes";
import ChangeLogModel       from "./ChangeLogModel";

namespace ChangeLogProxy {
    import NotifyType       = TwnsNotifyType.NotifyType;
    import NetMessage       = ProtoTypes.NetMessage;
    import ILanguageText    = ProtoTypes.Structure.ILanguageText;
    import NetMessageCodes  = TwnsNetMessageCodes.NetMessageCodes;

    export function init(): void {
        NetManager.addListeners([
            { msgCode: NetMessageCodes.MsgChangeLogAddMessage,         callback: _onMsgChangeLogAddMessage },
            { msgCode: NetMessageCodes.MsgChangeLogModifyMessage,      callback: _onMsgChangeLogModifyMessage },
            { msgCode: NetMessageCodes.MsgChangeLogGetMessageList,     callback: _onMsgChangeLogGetMessageList, },
        ], null);
    }

    export function reqChangeLogAddMessage(textList: ILanguageText[]): void {
        NetManager.send({
            MsgChangeLogAddMessage: { c: {
                textList,
            } },
        });
    }
    function _onMsgChangeLogAddMessage(e: egret.Event): void {
        const data = e.data as ProtoTypes.NetMessage.MsgChangeLogAddMessage.IS;
        if (!data.errorCode) {
            Notify.dispatch(NotifyType.MsgChangeLogAddMessage, data);
        }
    }

    export function reqChangeLogModifyMessage(messageId: number, textList: ILanguageText[]): void {
        NetManager.send({
            MsgChangeLogModifyMessage: { c: {
                messageId,
                textList,
            } },
        });
    }
    function _onMsgChangeLogModifyMessage(e: egret.Event): void {
        const data = e.data as ProtoTypes.NetMessage.MsgChangeLogModifyMessage.IS;
        if (!data.errorCode) {
            Notify.dispatch(NotifyType.MsgChangeLogModifyMessage, data);
        }
    }

    export function reqChangeLogGetMessageList(): void {
        NetManager.send({ MsgChangeLogGetMessageList: { c: {
        } }, });
    }
    function _onMsgChangeLogGetMessageList(e: egret.Event): void {
        const data = e.data as NetMessage.MsgChangeLogGetMessageList.IS;
        if (!data.errorCode) {
            ChangeLogModel.setAllMessageList(data.messageList || []);
            Notify.dispatch(NotifyType.MsgChangeLogGetMessageList, data);
        }
    }
}

export default ChangeLogProxy;
