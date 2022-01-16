
// import Helpers              from "../../tools/helpers/Helpers";
// import NetManager           from "../../tools/network/NetManager";
// import TwnsNetMessageCodes  from "../../tools/network/NetMessageCodes";
// import Notify               from "../../tools/notify/Notify";
// import TwnsNotifyType       from "../../tools/notify/NotifyType";
// import ProtoTypes           from "../../tools/proto/ProtoTypes";
// import MeModel              from "./MeModel";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace MeProxy {
    import NotifyType       = TwnsNotifyType.NotifyType;
    import NetMessage       = ProtoTypes.NetMessage;
    import NetMessageCodes  = TwnsNetMessageCodes.NetMessageCodes;

    export function init(): void {
        NetManager.addListeners([
            { msgCode: NetMessageCodes.MsgMeGetMapDataList,     callback: _onMsgMeGetMapDataList },
            { msgCode: NetMessageCodes.MsgMeGetMapData,         callback: _onMsgMeGetMapData },
            { msgCode: NetMessageCodes.MsgMeSubmitMap,          callback: _onMsgMeSubmitMap },
        ], null);
    }

    export function reqMeGetMapDataList(): void {
        NetManager.send({
            MsgMeGetMapDataList: { c: {} },
        });
    }
    async function _onMsgMeGetMapDataList(e: egret.Event): Promise<void> {
        const data = e.data as NetMessage.MsgMeGetMapDataList.IS;
        if (!data.errorCode) {
            await MeModel.resetDataList(data.dataList || []);
            Notify.dispatch(NotifyType.MsgMeGetDataList, data);
        }
    }

    export function reqMeGetMapData(slotIndex: number): void {
        NetManager.send({
            MsgMeGetMapData: { c: {
                slotIndex,
            }, }
        });
    }
    function _onMsgMeGetMapData(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMeGetMapData.IS;
        if (!data.errorCode) {
            MeModel.updateData(Helpers.getExisted(data.slotIndex), Helpers.getExisted(data.data));
            Notify.dispatch(NotifyType.MsgMeGetData, data);
        }
    }

    export function reqMeSubmitMap(slotIndex: number, mapRawData: ProtoTypes.Map.IMapRawData, needReview: boolean): void {
        NetManager.send({
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
}

// export default MeProxy;
