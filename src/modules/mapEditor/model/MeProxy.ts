
// import Helpers              from "../../tools/helpers/Helpers";
// import NetManager           from "../../tools/network/NetManager";
// import TwnsNetMessageCodes  from "../../tools/network/NetMessageCodes";
// import Notify               from "../../tools/notify/Notify";
// import Twns.Notify       from "../../tools/notify/NotifyType";
// import ProtoTypes           from "../../tools/proto/ProtoTypes";
// import MeModel              from "./MeModel";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.MapEditor.MeProxy {
    import NotifyType       = Twns.Notify.NotifyType;
    import NetMessage       = CommonProto.NetMessage;
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
            await Twns.MapEditor.MeModel.resetDataList(data.dataList || []);
            Twns.Notify.dispatch(NotifyType.MsgMeGetDataList, data);
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
            Twns.MapEditor.MeModel.updateData(Helpers.getExisted(data.slotIndex), Helpers.getExisted(data.data));
            Twns.Notify.dispatch(NotifyType.MsgMeGetData, data);
        }
    }

    export function reqMeSubmitMap(slotIndex: number, mapRawData: CommonProto.Map.IMapRawData, needReview: boolean): void {
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
            Twns.Notify.dispatch(NotifyType.MsgMeSubmitMap, data);
        }
    }
}

// export default MeProxy;
