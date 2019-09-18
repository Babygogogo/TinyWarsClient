
namespace TinyWars.WarMap {
    import NetManager   = Network.Manager;
    import ActionCode   = Network.Codes;
    import ProtoTypes   = Utility.ProtoTypes;
    import Notify       = Utility.Notify;

    export namespace WarMapProxy {
        export function init(): void {
            NetManager.addListeners([
                { msgCode: ActionCode.S_GetMapList,             callback: _onSGetMapList },
                { msgCode: ActionCode.S_GetMapStatisticsData,   callback: _onSGetMapStatisticsData },
                { msgCode: ActionCode.S_GetMapRawData,          callback: _onSGetMapRawData },
            ], WarMapProxy);
        }

        export function reqGetMapList(): void {
            NetManager.send({
                C_GetMapList: {
                },
            });
        }
        function _onSGetMapList(e: egret.Event): void {
            const data = e.data as ProtoTypes.IS_GetMapList;
            if (!data.errorCode) {
                WarMapModel.resetMapDict(data.mapList);
                Notify.dispatch(Notify.Type.SGetMapList, data);
            }
        }

        export function reqGetMapStatisticsData(mapFileName: string): void {
            NetManager.send({
                C_GetMapStatisticsData: {
                    mapFileName,
                },
            });
        }
        function _onSGetMapStatisticsData(e: egret.Event): void {
            const data = e.data as ProtoTypes.IS_GetMapStatisticsData;
            if (data.errorCode) {
                Notify.dispatch(Notify.Type.SGetMapStatisticsDataFailed, data);
            } else {
                WarMapModel.setMapStatisticsData(data.mapStatisticsData);
                Notify.dispatch(Notify.Type.SGetMapStatisticsData, data);
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
    }
}
