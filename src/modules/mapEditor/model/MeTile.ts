
namespace TinyWars.MapEditor {
    import ProtoTypes       = Utility.ProtoTypes;
    import ISerialTile      = ProtoTypes.WarSerialization.ISerialTile;

    export class MeTile extends BaseWar.BwTile {
        public serializeForSimulation(): ISerialTile | null {
            return this.serialize();
        }

        public getSkinId(): number {
            return this.getPlayerIndex();
        }
    }
}
