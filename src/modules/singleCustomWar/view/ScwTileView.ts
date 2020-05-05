
namespace TinyWars.SingleCustomWar {
    import CommonModel  = Common.CommonModel;
    import Types        = Utility.Types;

    export class ScwTileView extends BaseWar.BwTileView {
        protected _updateImages(): void {
            const tile      = this._getTile();
            const imgObject = this.getImgObject();
            const imgBase   = this.getImgBase();
            const hasFog    = this._getHasFog();

            const objectId = tile.getObjectViewId();
            if (objectId == null) {
                imgObject.visible = false;
            } else {
                imgObject.visible = true;
                imgObject.source  = ((hasFog) && (tile.getType() !== Types.TileType.Headquarters))
                    ? CommonModel.getTileObjectImageSource(tile.getNeutralObjectViewId(), hasFog)
                    : CommonModel.getTileObjectImageSource(objectId, hasFog);
            }

            const baseId = tile.getBaseViewId();
            if (baseId == null) {
                imgBase.visible = false;
            } else {
                imgBase.visible = true;
                imgBase.source  = CommonModel.getTileBaseImageSource(baseId, hasFog);
            }
        }
    }
}
