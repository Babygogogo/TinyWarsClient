
import McrModel             from "../../multiCustomRoom/model/McrModel";
import CompatibilityHelpers from "../../tools/helpers/CompatibilityHelpers";
import NetManager           from "../../tools/network/NetManager";
import TwnsNetMessageCodes  from "../../tools/network/NetMessageCodes";
import Notify               from "../../tools/notify/Notify";
import TwnsNotifyType       from "../../tools/notify/NotifyType";
import ProtoTypes           from "../../tools/proto/ProtoTypes";
import McrJoinModel         from "./McrJoinModel";

namespace McrProxy {
    import NotifyType       = TwnsNotifyType.NotifyType;
    import NetMessage       = ProtoTypes.NetMessage;
    import NetMessageCodes  = TwnsNetMessageCodes.NetMessageCodes;

    export function init(): void {
        NetManager.addListeners([
            { msgCode: NetMessageCodes.MsgMcrCreateRoom,                 callback: _onMsgMcrCreateRoom },
            { msgCode: NetMessageCodes.MsgMcrJoinRoom,                   callback: _onMsgMcrJoinRoom },
            { msgCode: NetMessageCodes.MsgMcrDeleteRoomByPlayer,         callback: _onMsgMcrDeleteRoomByPlayer },
            { msgCode: NetMessageCodes.MsgMcrDeleteRoomByServer,         callback: _onMsgMcrDeleteRoomByServer },
            { msgCode: NetMessageCodes.MsgMcrExitRoom,                   callback: _onMsgMcrExitRoom },
            { msgCode: NetMessageCodes.MsgMcrDeletePlayer,               callback: _onMsgMcrDeletePlayer },
            { msgCode: NetMessageCodes.MsgMcrSetReady,                   callback: _onMsgMcrSetReady },
            { msgCode: NetMessageCodes.MsgMcrSetSelfSettings,            callback: _onMsgMcrSetSelfSettings },
            { msgCode: NetMessageCodes.MsgMcrGetOwnerPlayerIndex,        callback: _onMsgMcrGetOwnerPlayerIndex },
            { msgCode: NetMessageCodes.MsgMcrGetRoomInfo,                callback: _onMsgMcrGetRoomInfo },
            { msgCode: NetMessageCodes.MsgMcrGetJoinableRoomInfoList,    callback: _onMsgMcrGetJoinableRoomInfoList },
            { msgCode: NetMessageCodes.MsgMcrGetJoinedRoomInfoList,      callback: _onMsgMcrGetJoinedRoomInfoList },
            { msgCode: NetMessageCodes.MsgMcrStartWar,                   callback: _onMsgMcrStartWar },
        ], null);
    }

    export function reqCreateRoom(param: NetMessage.MsgMcrCreateRoom.IC): void {
        NetManager.send({
            MsgMcrCreateRoom: { c: param },
        });
    }
    function _onMsgMcrCreateRoom(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMcrCreateRoom.IS;
        if (!data.errorCode) {
            Notify.dispatch(NotifyType.MsgMcrCreateRoom, data);
        }
    }

    export function reqMcrJoinRoom(data: NetMessage.MsgMcrJoinRoom.IC): void {
        NetManager.send({
            MsgMcrJoinRoom: { c: data },
        });
    }
    async function _onMsgMcrJoinRoom(e: egret.Event): Promise<void> {
        const data = e.data as NetMessage.MsgMcrJoinRoom.IS;
        if (!data.errorCode) {
            await McrModel.updateOnMsgMcrJoinRoom(data);
            Notify.dispatch(NotifyType.MsgMcrJoinRoom, data);
        }
    }

    export function reqMcrDeleteRoomByPlayer(roomId: number): void {
        NetManager.send({
            MsgMcrDeleteRoomByPlayer: { c: {
                roomId,
            } },
        });
    }
    function _onMsgMcrDeleteRoomByPlayer(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMcrDeleteRoomByPlayer.IS;
        if (!data.errorCode) {
            Notify.dispatch(NotifyType.MsgMcrDeleteRoomByPlayer, data);
        }
    }

    function _onMsgMcrDeleteRoomByServer(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMcrDeleteRoomByServer.IS;
        if (!data.errorCode) {
            McrModel.updateOnMsgMcrDeleteRoomByServer(data);
            McrJoinModel.updateOnMsgMcrDeleteRoomByServer();
            Notify.dispatch(NotifyType.MsgMcrDeleteRoomByServer, data);
        }
    }

    export function reqMcrExitRoom(roomId: number): void {
        NetManager.send({
            MsgMcrExitRoom: { c: {
                roomId,
            }, },
        });
    }
    async function _onMsgMcrExitRoom(e: egret.Event): Promise<void> {
        const data = e.data as NetMessage.MsgMcrExitRoom.IS;
        if (!data.errorCode) {
            await McrModel.updateOnMsgMcrExitRoom(data);
            Notify.dispatch(NotifyType.MsgMcrExitRoom, data);
        }
    }

    // export function reqMcrSetWarRule(data: NetMessage.MsgMcrSetWarRule.IC): void {
    //     NetManager.send({
    //         MsgMcrSetWarRule: { c: data },
    //     });
    // }
    // function _onMsgMcrSetWarRule(e: egret.Event): void {
    //     const data = e.data as NetMessage.MsgMcrSetWarRule.IS;
    //     if (!data.errorCode) {
    //         Notify.dispatch(Notify.Type.MsgMcrSetWarRule, data);
    //     }
    // }

    export function reqMcrDeletePlayer(roomId: number, playerIndex: number): void {
        NetManager.send({
            MsgMcrDeletePlayer: { c: {
                roomId,
                playerIndex,
            }, },
        });
    }
    async function _onMsgMcrDeletePlayer(e: egret.Event): Promise<void> {
        const data = e.data as NetMessage.MsgMcrDeletePlayer.IS;
        if (!data.errorCode) {
            await McrModel.updateOnMsgMcrDeletePlayer(data);
            Notify.dispatch(NotifyType.MsgMcrDeletePlayer, data);
        }
    }

    export function reqMcrSetReady(roomId: number, isReady: boolean): void {
        NetManager.send({
            MsgMcrSetReady: { c: {
                roomId,
                isReady,
            }, },
        });
    }
    async function _onMsgMcrSetReady(e: egret.Event): Promise<void> {
        const data = e.data as NetMessage.MsgMcrSetReady.IS;
        if (!data.errorCode) {
            await McrModel.updateOnMsgMcrSetReady(data);
            Notify.dispatch(NotifyType.MsgMcrSetReady, data);
        }
    }

    export function reqMcrSetSelfSettings(data: NetMessage.MsgMcrSetSelfSettings.IC): void {
        NetManager.send({
            MsgMcrSetSelfSettings: { c: data },
        });
    }
    async function _onMsgMcrSetSelfSettings(e: egret.Event): Promise<void> {
        const data = e.data as NetMessage.MsgMcrSetSelfSettings.IS;
        if (!data.errorCode) {
            await McrModel.updateOnMsgMcrSetSelfSettings(data);
            Notify.dispatch(NotifyType.MsgMcrSetSelfSettings, data);
        }
    }

    async function _onMsgMcrGetOwnerPlayerIndex(e: egret.Event): Promise<void> {
        const data = e.data as NetMessage.MsgMcrGetOwnerPlayerIndex.IS;
        if (!data.errorCode) {
            await McrModel.updateOnMsgMcrGetOwnerPlayerIndex(data);
            Notify.dispatch(NotifyType.MsgMcrGetOwnerPlayerIndex, data);
        }
    }

    export function reqMcrGetRoomInfo(roomId: number): void {
        NetManager.send({
            MsgMcrGetRoomInfo: { c: {
                roomId,
            }, },
        });
    }
    function _onMsgMcrGetRoomInfo(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMcrGetRoomInfo.IS;
        if (data.errorCode) {
            Notify.dispatch(NotifyType.MsgMcrGetRoomInfoFailed, data);
        } else {
            McrModel.updateOnMsgMcrGetRoomInfo(data);
            Notify.dispatch(NotifyType.MsgMcrGetRoomInfo, data);
        }
    }

    export function reqMcrGetJoinableRoomInfoList(): void {
        NetManager.send({
            MsgMcrGetJoinableRoomInfoList: { c: {
            }, },
        });
    }
    function _onMsgMcrGetJoinableRoomInfoList(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMcrGetJoinableRoomInfoList.IS;
        if (!data.errorCode) {
            McrModel.setJoinableRoomInfoList(data.roomInfoList || []);
            McrJoinModel.updateOnMsgMcrGetJoinableRoomInfoList();
            Notify.dispatch(NotifyType.MsgMcrGetJoinableRoomInfoList, data);
        }
    }

    export function reqMcrGetJoinedRoomInfoList(): void {
        NetManager.send({
            MsgMcrGetJoinedRoomInfoList: { c: {
            }, }
        });
    }
    function _onMsgMcrGetJoinedRoomInfoList(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMcrGetJoinedRoomInfoList.IS;
        if (!data.errorCode) {
            McrModel.setJoinedRoomInfoList(data.roomInfoList || []);
            Notify.dispatch(NotifyType.MsgMcrGetJoinedRoomInfoList, data);
        }
    }

    export function reqMcrStartWar(roomId: number): void {
        NetManager.send({
            MsgMcrStartWar: { c: {
                roomId,
            }, },
        });
    }
    function _onMsgMcrStartWar(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMcrStartWar.IS;
        if (!data.errorCode) {
            Notify.dispatch(NotifyType.MsgMcrStartWar, data);
        }
    }
}

export default McrProxy;
