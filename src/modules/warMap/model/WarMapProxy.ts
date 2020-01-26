
namespace TinyWars.WarMap.WarMapProxy {
    import NetManager   = Network.Manager;
    import MsgCode      = Network.Codes;
    import ProtoTypes   = Utility.ProtoTypes;
    import Types        = Utility.Types;
    import Notify       = Utility.Notify;

    export function init(): void {
        NetManager.addListeners([
            { msgCode: MsgCode.S_GetMapEnabledExtraDataList,    callback: _onSGetMapEnabledExtraDataList },
            { msgCode: MsgCode.S_GetMapExtraData,               callback: _onSGetMapExtraData },
            { msgCode: MsgCode.S_GetMapRawData,                 callback: _onSGetMapRawData },
            { msgCode: MsgCode.S_MmChangeAvailability,          callback: _onSMmChangeAvailability },
            { msgCode: MsgCode.S_MmReloadAllMaps,               callback: _onSMmReloadAllMaps },
            { msgCode: MsgCode.S_MmMergeMap,                    callback: _onSMmMergeMap },
            { msgCode: MsgCode.S_MmDeleteMap,                   callback: _onSMmDeleteMap },
        ], WarMapProxy);
    }

    export function reqGetMapEnabledExtraDataList(): void {
        NetManager.send({
            C_GetMapEnabledExtraDataList: {
            },
        });
    }
    function _onSGetMapEnabledExtraDataList(e: egret.Event): void {
        const data = e.data as ProtoTypes.IS_GetMapEnabledExtraDataList;
        if (!data.errorCode) {
            WarMapModel.resetExtraDataDict(data.dataList);
            Notify.dispatch(Notify.Type.SGetMapEnabledExtraDataList, data);
        }
    }

    export function reqGetMapExtraData(mapFileName: string): void {
        NetManager.send({
            C_GetMapExtraData: {
                mapFileName,
            },
        });
    }
    function _onSGetMapExtraData(e: egret.Event): void {
        const data = e.data as ProtoTypes.IS_GetMapExtraData;
        if (data.errorCode) {
            Notify.dispatch(Notify.Type.SGetMapExtraDataFailed, data);
        } else {
            WarMapModel.setExtraData(data.mapExtraData);
            Notify.dispatch(Notify.Type.SGetMapExtraData, data);
        }
    }

    export function reqGetMapRawData(mapFileName: string): void {
        NetManager.send({
            C_GetMapRawData: {
                mapFileName,
            },
        });
    }
    function _onSGetMapRawData(e: egret.Event): void {
        const data = e.data as ProtoTypes.IS_GetMapRawData;
        if (data.errorCode) {
            Notify.dispatch(Notify.Type.SGetMapRawDataFailed, data);
        } else {
            WarMapModel.setMapRawData(data.mapFileName, data.mapRawData);
            Notify.dispatch(Notify.Type.SGetMapRawData, data);
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
}
