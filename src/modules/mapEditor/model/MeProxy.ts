
// import Helpers              from "../../tools/helpers/Helpers";
// import NetManager           from "../../tools/network/NetManager";
// import TwnsNetMessageCodes  from "../../tools/network/NetMessageCodes";
// import Notify               from "../../tools/notify/Notify";
// import Notify       from "../../tools/notify/NotifyType";
// import ProtoTypes           from "../../tools/proto/ProtoTypes";
// import MeModel              from "./MeModel";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.MapEditor.MeProxy {
    import NotifyType       = Notify.NotifyType;
    import NetMessage       = CommonProto.NetMessage;
    import NetMessageCodes  = Net.NetMessageCodes;

    export function init(): void {
        Net.NetManager.addListeners([
            { msgCode: NetMessageCodes.MsgMeGetMapDataList,     callback: _onMsgMeGetMapDataList },
            { msgCode: NetMessageCodes.MsgMeGetMapData,         callback: _onMsgMeGetMapData },
            { msgCode: NetMessageCodes.MsgMeSubmitMap,          callback: _onMsgMeSubmitMap },
            { msgCode: NetMessageCodes.MsgMeDeleteSlot,         callback: _onMsgMeDeleteSlot },
        ], null);
    }

    export function reqMeGetMapDataList(): void {
        Net.NetManager.send({
            MsgMeGetMapDataList: { c: {} },
        });
    }
    async function _onMsgMeGetMapDataList(e: egret.Event): Promise<void> {
        const data = e.data as NetMessage.MsgMeGetMapDataList.IS;
        if (!data.errorCode) {
            await MapEditor.MeModel.resetDataList(data.dataList || []);
            Notify.dispatch(NotifyType.MsgMeGetDataList, data);
        }
    }

    export function reqMeGetMapData(slotIndex: number): void {
        Net.NetManager.send({
            MsgMeGetMapData: { c: {
                slotIndex,
            }, }
        });
    }
    function _onMsgMeGetMapData(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMeGetMapData.IS;
        if (!data.errorCode) {
            MapEditor.MeModel.updateData(Helpers.getExisted(data.slotIndex), Helpers.getExisted(data.data));
            Notify.dispatch(NotifyType.MsgMeGetData, data);
        }
    }

    export function reqMeSubmitMap(slotIndex: number, mapRawData: CommonProto.Map.IMapRawData, needReview: boolean): void {
        Net.NetManager.send({
            MsgMeSubmitMap: { c: {
                slotIndex,
                needReview,
                mapRawData,
            }, }
        });
    }
    function _onMsgMeSubmitMap(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMeSubmitMap.IS;
        if (!data.errorCode) {
            Notify.dispatch(NotifyType.MsgMeSubmitMap, data);
        }
    }

    export function reqMeDeleteSlot(slotIndex: number): void {
        Net.NetManager.send({
            MsgMeDeleteSlot: { c: {
                slotIndex,
            } },
        });
    }
    function _onMsgMeDeleteSlot(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMeDeleteSlot.IS;
        if (!data.errorCode) {
            MeModel.updateOnMsgMeDeleteSlot(data);
            Notify.dispatch(NotifyType.MsgMeDeleteSlot, data);
        }
    }
}

// export default MeProxy;
