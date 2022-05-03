
// import TwnsNetMessageCodes  from "../../tools/network/NetMessageCodes";
// import Notify               from "../../tools/notify/Notify";
// import Twns.Notify       from "../../tools/notify/NotifyType";
// import NetManager           from "../../tools/network/NetManager";
// import ProtoTypes           from "../../tools/proto/ProtoTypes";
// import ChangeLogModel       from "./ChangeLogModel";

namespace Twns.ChangeLog.ChangeLogProxy {
    import NotifyType       = Twns.Notify.NotifyType;
    import NetMessage       = CommonProto.NetMessage;
    import ILanguageText    = CommonProto.Structure.ILanguageText;
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
        const data = e.data as CommonProto.NetMessage.MsgChangeLogAddMessage.IS;
        if (!data.errorCode) {
            Twns.Notify.dispatch(NotifyType.MsgChangeLogAddMessage, data);
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
        const data = e.data as CommonProto.NetMessage.MsgChangeLogModifyMessage.IS;
        if (!data.errorCode) {
            Twns.Notify.dispatch(NotifyType.MsgChangeLogModifyMessage, data);
        }
    }

    export function reqChangeLogGetMessageList(): void {
        NetManager.send({ MsgChangeLogGetMessageList: { c: {
        } }, });
    }
    function _onMsgChangeLogGetMessageList(e: egret.Event): void {
        const data = e.data as NetMessage.MsgChangeLogGetMessageList.IS;
        if (!data.errorCode) {
            Twns.ChangeLog.ChangeLogModel.setAllMessageList(data.messageList || []);
            Twns.Notify.dispatch(NotifyType.MsgChangeLogGetMessageList, data);
        }
    }
}

// export default ChangeLogProxy;
