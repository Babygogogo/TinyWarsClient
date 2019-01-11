
namespace TinyWars.WarMap {
    import NetManager   = Network.Manager;
    import ActionCode   = Network.Codes;
    import ProtoTypes   = Utility.ProtoTypes;
    import Notify       = Utility.Notify;

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
                { actionCode: ActionCode.S_GetNewestMapInfos, callback: _onSGetNewestMapInfos },
            ], WarMapProxy);
        }

        export function reqGetNewestMapInfos(param?: ParamForGetNewestMapInfos): void {
            NetManager.send({
                actionCode      : ActionCode.C_GetNewestMapInfos,
                mapName         : param && param.mapName,
                mapDesigner     : param && param.mapDesigner,
                playersCount    : param && param.playersCount,
                minRating       : param && param.minRating,
                minPlayedTimes  : param && param.minPlayedTimes,
            });
        }
        function _onSGetNewestMapInfos(e: egret.Event): void {
            const data = e.data as ProtoTypes.S_GetNewestMapInfos;
            WarMapModel.setNewestMapInfos(data);
            Notify.dispatch(Notify.Type.SGetNewestMapInfos, data);
        }
    }
}
