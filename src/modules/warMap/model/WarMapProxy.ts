
namespace TinyWars.WarMap.WarMapProxy {
    import NetManager   = Network.Manager;
    import MsgCode      = Network.Codes;
    import ProtoTypes   = Utility.ProtoTypes;
    import Types        = Utility.Types;
    import Notify       = Utility.Notify;

    export function init(): void {
        NetManager.addListeners([
            { msgCode: MsgCode.S_MapGetEnabledExtraDataList,    callback: _onSMapGetEnabledExtraDataList },
            { msgCode: MsgCode.S_MapGetExtraData,               callback: _onSMapGetExtraData },
            { msgCode: MsgCode.S_MapGetRawData,                 callback: _onSMapGetRawData },
            { msgCode: MsgCode.S_MmChangeAvailability,          callback: _onSMmChangeAvailability },
            { msgCode: MsgCode.S_MmReloadAllMaps,               callback: _onSMmReloadAllMaps },
            { msgCode: MsgCode.S_MmMergeMap,                    callback: _onSMmMergeMap },
            { msgCode: MsgCode.S_MmDeleteMap,                   callback: _onSMmDeleteMap },
            { msgCode: MsgCode.S_MmGetReviewingMaps,            callback: _onSMmGetReviewingMaps },
            { msgCode: MsgCode.S_MmReviewMap,                   callback: _onSMmReviewMap },
        ], WarMapProxy);
    }

    export function reqGetMapEnabledExtraDataList(): void {
        NetManager.send({
            C_MapGetEnabledExtraDataList: {
            },
        });
    }
    function _onSMapGetEnabledExtraDataList(e: egret.Event): void {
        const data = e.data as ProtoTypes.IS_MapGetEnabledExtraDataList;
        if (!data.errorCode) {
            WarMapModel.resetExtraDataDict(data.dataList);
            Notify.dispatch(Notify.Type.SMapGetEnabledExtraDataList, data);
        }
    }

    export function reqGetMapExtraData(mapId: number): void {
        NetManager.send({
            C_MapGetExtraData: {
                mapId: mapId,
            },
        });
    }
    function _onSMapGetExtraData(e: egret.Event): void {
        const data = e.data as ProtoTypes.IS_MapGetExtraData;
        if (data.errorCode) {
            Notify.dispatch(Notify.Type.SMapGetExtraDataFailed, data);
        } else {
            WarMapModel.setExtraData(data.mapExtraData);
            Notify.dispatch(Notify.Type.SMapGetExtraData, data);
        }
    }

    export function reqGetMapRawData(mapId: number): void {
        NetManager.send({
            C_MapGetRawData: {
                mapId,
            },
        });
    }
    function _onSMapGetRawData(e: egret.Event): void {
        const data = e.data as ProtoTypes.IS_MapGetRawData;
        if (data.errorCode) {
            Notify.dispatch(Notify.Type.SMapGetRawDataFailed, data);
        } else {
            WarMapModel.setMapRawData(data.mapFileName, data.mapRawData);
            Notify.dispatch(Notify.Type.SMapGetRawData, data);
        }
    }

    export function reqMmChangeAvailability(mapFileName: string, availability: Types.MapAvailability): void {
        NetManager.send({
            C_MmChangeAvailability: {
                mapFileName,
                canMcw  : availability.canMcw,
                canWr   : availability.canWr,
                canScw  : availability.canScw,
            },
        });
    }
    function _onSMmChangeAvailability(e: egret.Event): void {
        const data = e.data as ProtoTypes.IS_MmChangeAvailability;
        if (!data.errorCode) {
            Notify.dispatch(Notify.Type.SMmChangeAvailability);
        }
    }

    export function reqReloadAllMaps(): void {
        NetManager.send({
            C_MmReloadAllMaps: {},
        });
    }
    function _onSMmReloadAllMaps(e: egret.Event): void {
        const data = e.data as ProtoTypes.IS_MmReloadAllMaps;
        if (!data.errorCode) {
            Notify.dispatch(Notify.Type.SMmReloadAllMaps);
        }
    }

    export function reqMergeMap(srcMapFileName: string, dstMapFileName: string): void {
        NetManager.send({
            C_MmMergeMap: {
                srcMapFileName,
                dstMapFileName,
            },
        });
    }
    function _onSMmMergeMap(e: egret.Event): void {
        const data = e.data as ProtoTypes.IS_MmMergeMap;
        if (!data.errorCode) {
            WarMapModel.setMapRawData(data.dstMapFileName, data.dstMapRawData);
            WarMapModel.setExtraData(data.dstMapExtraData);
            WarMapModel.deleteExtraData(data.srcMapFileName);
            Notify.dispatch(Notify.Type.SMmMergeMap, data);
        }
    }

    export function reqMmDeleteMap(mapFileName: string): void {
        NetManager.send({
            C_MmDeleteMap: {
                mapFileName,
            },
        });
    }
    function _onSMmDeleteMap(e: egret.Event): void {
        const data = e.data as ProtoTypes.IS_MmDeleteMap;
        if (!data.errorCode) {
            WarMapModel.deleteExtraData(data.mapFileName);
            Notify.dispatch(Notify.Type.SMmDeleteMap, data);
        }
    }

    export function reqMmGetReviewingMaps(): void {
        NetManager.send({
            C_MmGetReviewingMaps: {},
        });
    }
    function _onSMmGetReviewingMaps(e: egret.Event): void {
        const data = e.data as ProtoTypes.IS_MmGetReviewingMaps;
        if (!data.errorCode) {
            WarMapModel.setMmReviewingMaps(data.maps);
            Notify.dispatch(Notify.Type.SMmGetReviewingMaps, data);
        }
    }

    export function reqReviewMap(
        designerUserId  : number,
        slotIndex       : number,
        modifiedTime    : number,
        isAccept        : boolean,
        reviewComment   : string | null
    ) : void {
        NetManager.send({
            C_MmReviewMap: {
                designerUserId,
                slotIndex,
                modifiedTime,
                isAccept,
                reviewComment,
            },
        });
    }
    function _onSMmReviewMap(e: egret.Event): void {
        const data = e.data as ProtoTypes.IS_MmReviewMap;
        if (!data.errorCode) {
            Notify.dispatch(Notify.Type.SMmReviewMap, data);
        }
    }
}
