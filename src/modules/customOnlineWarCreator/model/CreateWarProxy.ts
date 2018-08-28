
namespace CustomOnlineWarCreator {
    import NetManager = Network.Manager;
    import ActionCode = Network.Codes;
    import Helpers    = Utility.Helpers;
    import ProtoTypes = Utility.ProtoTypes;
    import Notify     = Utility.Notify;

    export type DataForCreateWar = {
        mapName : string,
        designer: string,
        version : number,

        warName        ?: string;
        warPassword    ?: string;
        warComment     ?: string;
        playerIndex     : number;
        teamIndex       : number;
        hasFog          : boolean;
        timeLimit       : number;

        initialFund         : number;
        incomeModifier      : number;
        initialEnergy       : number;
        energyGrowthModifier: number;
        moveRangeModifier   : number;
        attackPowerModifier : number;
        visionRangeModifier : number;
    }

    export namespace CreateWarProxy {
        export function init(): void {
            NetManager.addListeners(
                { actionCode: ActionCode.S_CreateCustomOnlineWar, callback: _onSCreateCustomOnlineWar, thisObject: CreateWarProxy },
            );
        }

        export function reqCreateCustomOnlineWar(param: DataForCreateWar): void {
            const obj = Helpers.cloneObject(param);
            obj["actionCode"] = ActionCode.C_CreateCustomOnlineWar;
            NetManager.send(obj);
        }
        function _onSCreateCustomOnlineWar(e: egret.Event): void {
            const data = e.data as ProtoTypes.IS_CreateCustomOnlineWar;
            if (!data.errorCode) {
                Notify.dispatch(Notify.Type.SCreateCustomOnlineWar, data);
            }
        }
    }
}
