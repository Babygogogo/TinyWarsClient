
import { TwnsNetMessageCodes }  from "../../../utility/network/NetMessageCodes";
import { Notify }               from "../../../utility/notify/Notify";
import { TwnsNotifyType }       from "../../../utility/notify/NotifyType";
import { NetManager }           from "../../../utility/network/NetManager";
import { ProtoTypes }           from "../../../utility/proto/ProtoTypes";
import { ChangeLogModel }       from "./ChangeLogModel";

export namespace ChangeLogProxy {
    import NotifyType       = TwnsNotifyType.NotifyType;
    import NetMessage       = ProtoTypes.NetMessage;
    import ILanguageText    = ProtoTypes.Structure.ILanguageText;
    import NetMessageCodes  = TwnsNetMessageCodes.NetMessageCodes;

    export function init(): void {
        NetManager.addListeners([
            { msgCode: NetMessageCodes.MsgChangeLogAddMessage,         callback: _onMsgChangeLogAddMessage },
            { msgCode: NetMessageCodes.MsgChangeLogModifyMessage,      callback: _onMsgChangeLogModifyMessage },
            { msgCode: NetMessageCodes.MsgChangeLogGetMessageList,     callback: _onMsgChangeLogGetMessageList, },
        ], undefined);
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
            ChangeLogModel.setAllMessageList(data.messageList);
            Notify.dispatch(NotifyType.MsgChangeLogGetMessageList, data);
        }
    }
}
