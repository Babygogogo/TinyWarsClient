
namespace TemplateMap {
    import NetManager   = Network.Manager;
    import ActionCode   = Network.Codes;
    import ProtoTypes   = Utility.ProtoTypes;
    import Notify       = Utility.Notify;

    export namespace TemplateMapProxy {
        type ParamForGetNewestMapInfos = {
            mapName         ?: string | null,
            designer        ?: string | null,
            playersCount    ?: number | null,
            minRating       ?: number | null,
            minPlayedTimes  ?: number | null,
        }

        export function init(): void {
            NetManager.addListeners(
                { actionCode: ActionCode.S_GetNewestMapInfos, callback: _onSGetNewestMapInfos, thisObject: TemplateMapProxy },
            );
        }

        export function reqGetNewestMapInfos(param?: ParamForGetNewestMapInfos): void {
            NetManager.send({
                actionCode      : ActionCode.C_GetNewestMapInfos,
                mapName         : param && param.mapName,
                designer        : param && param.designer,
                playersCount    : param && param.playersCount,
                minRating       : param && param.minRating,
                minPlayedTimes  : param && param.minPlayedTimes,
            });
        }
        function _onSGetNewestMapInfos(e: egret.Event): void {
            const data = e.data as ProtoTypes.S_GetNewestMapInfos;
            TemplateMapModel.setNewestMapInfos(data);
            Notify.dispatch(Notify.Type.SGetNewestMapInfos, data);
        }
    }
}
