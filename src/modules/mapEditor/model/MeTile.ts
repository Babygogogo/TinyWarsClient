
namespace TinyWars.MapEditor {
    export class MeTile extends BaseWar.BwTile {
        public getSkinId(): number {
            return this.getPlayerIndex();
        }
    }
}
