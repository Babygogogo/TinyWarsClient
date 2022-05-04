
// import TwnsNetMessageCodes  from "../../tools/network/NetMessageCodes";
// import Notify               from "../../tools/notify/Notify";
// import Notify       from "../../tools/notify/NotifyType";
// import NetManager           from "../../tools/network/NetManager";
// import ProtoTypes           from "../../tools/proto/ProtoTypes";
// import ChangeLogModel       from "./ChangeLogModel";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.ChangeLog.ChangeLogProxy {
    import NotifyType       = Notify.NotifyType;
    import NetMessage       = CommonProto.NetMessage;
    import ILanguageText    = CommonProto.Structure.ILanguageText;
    import NetMessageCodes  = Net.NetMessageCodes;

    export function init(): void {
        Net.NetManager.addListeners([
            { msgCode: NetMessageCodes.MsgChangeLogAddMessage,         callback: _onMsgChangeLogAddMessage },
            { msgCode: NetMessageCodes.MsgChangeLogModifyMessage,      callback: _onMsgChangeLogModifyMessage },
            { msgCode: NetMessageCodes.MsgChangeLogGetMessageList,     callback: _onMsgChangeLogGetMessageList, },
        ], null);
    }

    export function reqChangeLogAddMessage(textList: ILanguageText[]): void {
        Net.NetManager.send({
            MsgChangeLogAddMessage: { c: {
                textList,
            } },
        });
    }
    function _onMsgChangeLogAddMessage(e: egret.Event): void {
        const data = e.data as CommonProto.NetMessage.MsgChangeLogAddMessage.IS;
        if (!data.errorCode) {
            Notify.dispatch(NotifyType.MsgChangeLogAddMessage, data);
        }
    }

    export function reqChangeLogModifyMessage(messageId: number, textList: ILanguageText[]): void {
        Net.NetManager.send({
            MsgChangeLogModifyMessage: { c: {
                messageId,
                textList,
            } },
        });
    }
    function _onMsgChangeLogModifyMessage(e: egret.Event): void {
        const data = e.data as CommonProto.NetMessage.MsgChangeLogModifyMessage.IS;
        if (!data.errorCode) {
            Notify.dispatch(NotifyType.MsgChangeLogModifyMessage, data);
        }
    }

    export function reqChangeLogGetMessageList(): void {
        Net.NetManager.send({ MsgChangeLogGetMessageList: { c: {
        } }, });
    }
    function _onMsgChangeLogGetMessageList(e: egret.Event): void {
        const data = e.data as NetMessage.MsgChangeLogGetMessageList.IS;
        if (!data.errorCode) {
            ChangeLog.ChangeLogModel.setAllMessageList(data.messageList || []);
            Notify.dispatch(NotifyType.MsgChangeLogGetMessageList, data);
        }
    }
}

// export default ChangeLogProxy;
