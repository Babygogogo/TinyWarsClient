
namespace TinyWars.TestWar {
    import ProtoTypes   = Utility.ProtoTypes;
    import ISerialTile  = ProtoTypes.WarSerialization.ISerialTile;

    export class TwTile extends BaseWar.BwTile {
        public serializeForSimulation(): ISerialTile | null {
            return undefined
        }
    }
}
