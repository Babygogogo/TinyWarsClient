
namespace TinyWars.WarMap.WarMapProxy {
    import NetManager   = Network.Manager;
    import MsgCode      = Network.Codes;
    import ProtoTypes   = Utility.ProtoTypes;
    import Notify       = Utility.Notify;
    import NetMessage   = ProtoTypes.NetMessage;

    export function init(): void {
        NetManager.addListeners([
            { msgCode: MsgCode.MsgMapGetEnabledBriefDataList,   callback: _onMsgMapGetEnabledBriefDataList },
            { msgCode: MsgCode.MsgMapGetEnabledRawDataList,     callback: _onMsgMapGetEnabledRawDataList },
            { msgCode: MsgCode.MsgMapGetBriefData,              callback: _onMsgMapGetBriefData },
            { msgCode: MsgCode.MsgMapGetRawData,                callback: _onMsgMapGetRawData },
            { msgCode: MsgCode.MsgMmSetMapAvailability,         callback: _onMsgMmSetMapAvailability },
            { msgCode: MsgCode.MsgMmDeleteMap,                  callback: _onMsgMmDeleteMap },
            { msgCode: MsgCode.MsgMmGetReviewingMaps,           callback: _onMsgMmGetReviewingMaps },
            { msgCode: MsgCode.MsgMmReviewMap,                  callback: _onMsgMmReviewMap },
            { msgCode: MsgCode.MsgMmSetMapTag,                  callback: _onMsgMmSetMapTag },
        ], WarMapProxy);
    }

    function _onMsgMapGetEnabledBriefDataList(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMapGetEnabledBriefDataList.IS;
        if (!data.errorCode) {
            WarMapModel.resetBriefDataDict(data.dataList);
            Notify.dispatch(Notify.Type.MsgMapGetEnabledBriefDataList, data);
        }
    }

    function _onMsgMapGetEnabledRawDataList(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMapGetEnabledRawDataList.IS;
        if (!data.errorCode) {
            WarMapModel.updateRawDataDict(data.dataList);
            Notify.dispatch(Notify.Type.MsgMapGetEnabledRawDataList, data);
        }
    }

    export function reqGetMapBriefData(mapId: number): void {
        NetManager.send({
            MsgMapGetBriefData: { c: {
                mapId,
            }, },
        });
    }
    function _onMsgMapGetBriefData(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMapGetBriefData.IS;
        if (data.errorCode) {
            Notify.dispatch(Notify.Type.MsgMapGetBriefDataFailed, data);
        } else {
            WarMapModel.setBriefData(data.mapBriefData);
            Notify.dispatch(Notify.Type.MsgMapGetBriefData, data);
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
            WarMapModel.deleteBriefData(data.mapId);
            Notify.dispatch(Notify.Type.MsgMmDeleteMap, data);
        }
    }

    export function reqMmGetReviewingMaps(): void {
        NetManager.send({
            MsgMmGetReviewingMaps: { c: {} },
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

    export function reqMmSetMapTag(mapId: number, mapTag: ProtoTypes.Map.IDataForMapTag | null | undefined): void {
        NetManager.send({ MsgMmSetMapTag: { c: {
            mapId,
            mapTag,
        } } });
    }
    function _onMsgMmSetMapTag(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMmSetMapTag.IS;
        if (!data.errorCode) {
            Notify.dispatch(Notify.Type.MsgMmSetMapTag, data);
        }
    }
}
