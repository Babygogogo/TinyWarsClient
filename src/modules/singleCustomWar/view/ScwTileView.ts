
namespace TinyWars.SingleCustomWar {
    import TimeModel    = Time.TimeModel;
    import Types        = Utility.Types;

    export class ScwTileView extends BaseWar.BwTileView {
        protected _updateImages(): void {
            const tile      = this._getTile();
            const tickCount = TimeModel.getTileAnimationTickCount();
            const imgObject = this.getImgObject();
            const imgBase   = this.getImgBase();
            const hasFog    = this._getHasFog();

            const objectId = tile.getObjectViewId();
            if (objectId == null) {
                imgObject.visible = false;
            } else {
                imgObject.visible = true;
                imgObject.source  = ((hasFog) && (tile.getType() !== Types.TileType.Headquarters))
                    ? ConfigManager.getTileObjectImageSource(tile.getNeutralObjectViewId(), tickCount, hasFog)
                    : ConfigManager.getTileObjectImageSource(objectId, tickCount, hasFog);
            }

            const baseId = tile.getBaseViewId();
            if (baseId == null) {
                imgBase.visible = false;
            } else {
                imgBase.visible = true;
                imgBase.source  = ConfigManager.getTileBaseImageSource(baseId, tickCount, hasFog);
            }
        }
    }
}
