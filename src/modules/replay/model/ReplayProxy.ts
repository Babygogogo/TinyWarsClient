
namespace TinyWars.Replay.ReplayProxy {
    import NetManager       = Network.Manager;
    import NetMessageCodes  = Network.Codes;
    import Types            = Utility.Types;
    import Logger           = Utility.Logger;
    import ProtoTypes       = Utility.ProtoTypes;
    import Notify           = Utility.Notify;
    import GridIndex        = Types.GridIndex;
    import UnitType         = Types.UnitType;

    export function init(): void {
        NetManager.addListeners([
        ], ReplayProxy);
    }
}
