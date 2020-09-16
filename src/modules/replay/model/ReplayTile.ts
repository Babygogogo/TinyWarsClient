
namespace TinyWars.Replay {
    import ProtoTypes   = Utility.ProtoTypes;
    import ISerialTile  = ProtoTypes.WarSerialization.ISerialTile;

    export class ReplayTile extends BaseWar.BwTile {
        protected _getViewClass(): new () => BaseWar.BwTileView {
            return ReplayTileView;
        }

        public serializeForSimulation(): ISerialTile | null {
            return this.serialize();
        }
    }
}
