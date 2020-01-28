
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

        mapRawData = mapRawData || createDefaultMapRawData(slotIndex);
        _war = new MeWar().init(mapRawData, slotIndex, ConfigManager.getNewestConfigVersion(), isReview).startRunning().startRunningView();
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

    function createDefaultMapRawData(slotIndex: number): Types.MapRawData {
        const mapWidth      = 20;
        const mapHeight     = 15;
        const gridsCount    = mapWidth * mapHeight;
        return {
            mapDesigner     : User.UserModel.getSelfNickname(),
            mapName         : `${Lang.getText(Lang.Type.B0279)} - ${slotIndex}`,
            mapNameEnglish  : `${Lang.getText(Lang.Type.B0279)} - ${slotIndex}`,
            mapWidth,
            mapHeight,
            isMultiPlayer   : true,
            isSinglePlayer  : true,
            playersCount    : 2,
            tileBases       : (new Array(gridsCount)).fill(ConfigManager.getTileBaseViewId(Types.TileBaseType.Plain)),
            tileObjects     : (new Array(gridsCount)).fill(0),
            units           : null,
            unitDataList    : null,
            tileDataList    : null,
        }
    }
}
