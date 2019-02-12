
namespace TinyWars.WarMap {
    import NetManager   = Network.Manager;
    import ActionCode   = Network.Codes;
    import ProtoTypes   = Utility.ProtoTypes;
    import Notify       = Utility.Notify;
    import Types        = Utility.Types;

    export namespace WarMapProxy {
        type ParamForGetNewestMapInfos = {
            mapName         ?: string | null,
            mapDesigner     ?: string | null,
            playersCount    ?: number | null,
            minRating       ?: number | null,
            minPlayedTimes  ?: number | null,
        }

        export function init(): void {
            NetManager.addListeners([
                { actionCode: ActionCode.S_GetNewestMapDynamicInfos,    callback: _onSGetNewestMapDynamicInfos },
                { actionCode: ActionCode.S_GetMapDynamicInfo,           callback: _onSGetMapDynamicInfo },
            ], WarMapProxy);
        }

        export function reqGetNewestMapInfos(param?: ParamForGetNewestMapInfos): void {
            NetManager.send({
                C_GetNewestMapDynamicInfos: {
                    mapName         : param && param.mapName,
                    mapDesigner     : param && param.mapDesigner,
                    playersCount    : param && param.playersCount,
                    minRating       : param && param.minRating,
                    minPlayedTimes  : param && param.minPlayedTimes,
                },
            });
        }
        function _onSGetNewestMapDynamicInfos(e: egret.Event): void {
            const data = e.data as ProtoTypes.IS_GetNewestMapDynamicInfos;
            WarMapModel.setNewestMapInfos(data);
            Notify.dispatch(Notify.Type.SGetNewestMapInfos, data);
        }

        export function reqGetMapDynamicInfo(key: Types.MapIndexKey): void {
            NetManager.send({
                C_GetMapDynamicInfo: key,
            });
        }
        function _onSGetMapDynamicInfo(e: egret.Event): void {
            const data = e.data as ProtoTypes.IS_GetMapDynamicInfo;
            if (data.errorCode) {
                Notify.dispatch(Notify.Type.SGetMapDynamicInfoFailed, data);
            } else {
                (data.mapDynamicInfo) && (WarMapModel.updateMapDynamicInfo(data.mapDynamicInfo));
                Notify.dispatch(Notify.Type.SGetMapDynamicInfo, data);
            }
        }
    }
}
