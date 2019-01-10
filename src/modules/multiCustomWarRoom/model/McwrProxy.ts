
namespace TinyWars.MultiCustomWarRoom {
    import NetManager = Network.Manager;
    import ActionCode = Network.Codes;
    import Helpers    = Utility.Helpers;
    import ProtoTypes = Utility.ProtoTypes;
    import Notify     = Utility.Notify;

    export type DataForCreateWar = {
        mapName         : string,
        mapDesigner     : string,
        mapVersion      : number,
        warName        ?: string;
        warPassword    ?: string;
        warComment     ?: string;
        configVersion   : number;

        playerIndex     : number;
        teamIndex       : number;

        hasFog              : boolean;
        timeLimit           : number;
        initialFund         : number;
        incomeModifier      : number;
        initialEnergy       : number;
        energyGrowthModifier: number;
        moveRangeModifier   : number;
        attackPowerModifier : number;
        visionRangeModifier : number;
    }

    export namespace McwrProxy {
        export function init(): void {
            NetManager.addListeners([
                { actionCode: ActionCode.S_CreateMultiCustomWar, callback: _onSCreateCustomOnlineWar },
            ], McwrProxy);
        }

        export function reqCreate(param: DataForCreateWar): void {
            const obj = Helpers.cloneObject(param);
            obj["actionCode"] = ActionCode.C_CreateMultiCustomWar;
            NetManager.send(obj);
        }
        function _onSCreateCustomOnlineWar(e: egret.Event): void {
            const data = e.data as ProtoTypes.IS_CreateMultiCustomWar;
            if (!data.errorCode) {
                Notify.dispatch(Notify.Type.SCreateCustomOnlineWar, data);
            }
        }
    }
}
