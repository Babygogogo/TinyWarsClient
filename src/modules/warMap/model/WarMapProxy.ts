
namespace TinyWars.WarMap.WarMapProxy {
    import NetManager   = Network.Manager;
    import MsgCode      = Network.Codes;
    import ProtoTypes   = Utility.ProtoTypes;
    import Notify       = Utility.Notify;
    import NetMessage   = ProtoTypes.NetMessage;

    export function init(): void {
        NetManager.addListeners([
            { msgCode: MsgCode.MsgMapGetEnabledExtraDataList,   callback: _onMsgMapGetEnabledExtraDataList },
            { msgCode: MsgCode.MsgMapGetExtraData,              callback: _onMsgMapGetExtraData },
            { msgCode: MsgCode.MsgMapGetRawData,                callback: _onMsgMapGetRawData },
            { msgCode: MsgCode.MsgMmSetMapAvailability,         callback: _onMsgMmSetMapAvailability },
            { msgCode: MsgCode.MsgMmDeleteMap,                  callback: _onMsgMmDeleteMap },
            { msgCode: MsgCode.MsgMmGetReviewingMaps,           callback: _onMsgMmGetReviewingMaps },
            { msgCode: MsgCode.MsgMmReviewMap,                  callback: _onMsgMmReviewMap },
        ], WarMapProxy);
    }

    export function reqMapGetEnabledExtraDataList(): void {
        NetManager.send({
            MsgMapGetEnabledExtraDataList: { c: {
            }, }
        });
    }
    function _onMsgMapGetEnabledExtraDataList(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMapGetEnabledExtraDataList.IS;
        if (!data.errorCode) {
            WarMapModel.resetExtraDataDict(data.dataList);
            Notify.dispatch(Notify.Type.MsgMapGetEnabledExtraDataList, data);
        }
    }

    export function reqGetMapExtraData(mapId: number): void {
        NetManager.send({
            MsgMapGetExtraData: { c: {
                mapId,
            }, },
        });
    }
    function _onMsgMapGetExtraData(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMapGetExtraData.IS;
        if (data.errorCode) {
            Notify.dispatch(Notify.Type.MsgMapGetExtraDataFailed, data);
        } else {
            WarMapModel.setExtraData(data.mapExtraData);
            Notify.dispatch(Notify.Type.MsgMapGetExtraData, data);
        }
    }

    export function reqGetMapRawData(mapId: number): void {
        NetManager.send({
            MsgMapGetRawData: { c: {
                mapId,
            }, },
        });
    }
    function _onMsgMapGetRawData(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMapGetRawData.IS;
        if (data.errorCode) {
            Notify.dispatch(Notify.Type.MsgMapGetRawDataFailed, data);
        } else {
            WarMapModel.setRawData(data.mapId, data.mapRawData);
            Notify.dispatch(Notify.Type.MsgMapGetRawData, data);
        }
    }

    export function reqMmSetMapAvailability(mapId: number, availability: ProtoTypes.Map.IDataForMapAvailability): void {
        NetManager.send({
            MsgMmSetMapAvailability: { c: {
                mapId,
                availability,
            }, },
        });
    }
    function _onMsgMmSetMapAvailability(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMmSetMapAvailability.IS;
        if (!data.errorCode) {
            Notify.dispatch(Notify.Type.MsgMmSetMapAvailability);
        }
    }

    export function reqMmDeleteMap(mapId: number): void {
        NetManager.send({
            MsgMmDeleteMap: { c: {
                mapId,
            }, }
        });
    }
    function _onMsgMmDeleteMap(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMmDeleteMap.IS;
        if (!data.errorCode) {
            WarMapModel.deleteExtraData(data.mapId);
            Notify.dispatch(Notify.Type.MsgMmDeleteMap, data);
        }
    }

    export function reqMmGetReviewingMaps(): void {
        NetManager.send({
            MsgMmGetReviewingMaps: { s: {} },
        });
    }
    function _onMsgMmGetReviewingMaps(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMmGetReviewingMaps.IS;
        if (!data.errorCode) {
            WarMapModel.setMmReviewingMaps(data.maps);
            Notify.dispatch(Notify.Type.MsgMmGetReviewingMaps, data);
        }
    }

    export function reqMmReviewMap(
        { designerUserId, slotIndex, modifiedTime, isAccept, reviewComment, availability }: {
            designerUserId  : number;
            slotIndex       : number;
            modifiedTime    : number;
            isAccept        : boolean;
            reviewComment   : string | null;
            availability    : ProtoTypes.Map.IDataForMapAvailability;
        }
    ): void {
        NetManager.send({
            MsgMmReviewMap: { c: {
                designerUserId,
                slotIndex,
                modifiedTime,
                isAccept,
                reviewComment,
                availability,
            }, },
        });
    }
    function _onMsgMmReviewMap(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMmReviewMap.IS;
        if (!data.errorCode) {
            Notify.dispatch(Notify.Type.MsgMmReviewMap, data);
        }
    }
}
