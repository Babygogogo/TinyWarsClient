
namespace TinyWars.WarMap {
    import NetManager   = Network.Manager;
    import ActionCode   = Network.Codes;
    import ProtoTypes   = Utility.ProtoTypes;
    import Types        = Utility.Types;
    import Notify       = Utility.Notify;

    export namespace WarMapProxy {
        export function init(): void {
            NetManager.addListeners([
                { msgCode: ActionCode.S_GetMapMetaDataList,         callback: _onSGetMapMetaDataList },
                { msgCode: ActionCode.S_GetMapStatisticsDataList,   callback: _onSGetMapStatisticsDataList },
                { msgCode: ActionCode.S_GetMapRawData,              callback: _onSGetMapRawData },
                { msgCode: ActionCode.S_MmChangeAvailability,       callback: _onSMmChangeAvailability },
                { msgCode: ActionCode.S_MmReloadAllMaps,            callback: _onSMmReloadAllMaps },
            ], WarMapProxy);
        }

        export function reqGetMapMetaDataList(): void {
            NetManager.send({
                C_GetMapMetaDataList: {
                },
            });
        }
        function _onSGetMapMetaDataList(e: egret.Event): void {
            const data = e.data as ProtoTypes.IS_GetMapMetaDataList;
            if (!data.errorCode) {
                WarMapModel.resetMapMetaDataDict(data.dataList);
                Notify.dispatch(Notify.Type.SGetMapMetaDataList, data);
            }
        }

        export function reqGetMapStatisticsDataList(): void {
            NetManager.send({
                C_GetMapStatisticsDataList: {
                },
            });
        }
        function _onSGetMapStatisticsDataList(e: egret.Event): void {
            const data = e.data as ProtoTypes.IS_GetMapStatisticsDataList;
            if (!data.errorCode) {
                WarMapModel.resetMapStatisticsDataDict(data.dataList);
                Notify.dispatch(Notify.Type.SGetMapStatisticsDataList, data);
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
                    isEnabledForMultiCustomWar  : availability.isEnabledForMcw,
                    isEnabledForWarRoom         : availability.isEnabledForWr,
                    isEnabledForSingleCustomWar : availability.isEnabledForScw,
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
    }
}
