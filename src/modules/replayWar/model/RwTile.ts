
namespace TinyWars.ReplayWar {
    import ProtoTypes   = Utility.ProtoTypes;
    import ISerialTile  = ProtoTypes.WarSerialization.ISerialTile;

    export class RwTile extends BaseWar.BwTile {
        public serializeForSimulation(): ISerialTile | null {
            return this.serialize();
        }
    }
}
