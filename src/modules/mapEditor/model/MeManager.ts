
namespace TinyWars.MapEditor.MeManager {
    import Types                = Utility.Types;
    import Logger               = Utility.Logger;
    import ProtoTypes           = Utility.ProtoTypes;
    import Helpers              = Utility.Helpers;
    import DestructionHelpers   = Utility.DestructionHelpers;
    import GridIndexHelpers     = Utility.GridIndexHelpers;
    import Lang                 = Utility.Lang;
    import FloatText            = Utility.FloatText;
    import ProtoManager         = Utility.ProtoManager;
    import WarActionCodes       = Utility.WarActionCodes;
    import Notify               = Utility.Notify;
    import WarActionContainer   = ProtoTypes.IWarActionContainer;
    import BwHelpers            = BaseWar.BwHelpers;
    import GridIndex            = Types.GridIndex;
    import UnitState            = Types.UnitActionState;
    import MovePath             = Types.MovePath;
    import TileType             = Types.TileType;

    let _war: MeWar;

    export function init(): void {
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for managing war.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    export function loadWar(mapRawData: Types.MapRawData | null, slotIndex: number, isReview: boolean): MeWar {
        if (_war) {
            Logger.warn(`MeManager.loadWar() another war has been loaded already!`);
            unloadWar();
        }

        mapRawData = mapRawData || MeUtility.createDefaultMapRawData(slotIndex);
        _war = new MeWar().init(mapRawData, slotIndex, Utility.ConfigManager.getNewestConfigVersion(), isReview).startRunning().startRunningView();
        return _war;
    }

    export function unloadWar(): void {
        if (_war) {
            _war.stopRunning();
            _war = undefined;
        }
    }

    export function getWar(): MeWar | undefined {
        return _war;
    }
}
