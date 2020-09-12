
namespace TinyWars.SingleCustomWar {
    import Types            = Utility.Types;
    import Logger           = Utility.Logger;
    import ConfigManager    = Utility.ConfigManager;
    import CommonModel      = Common.CommonModel;
    import TimeModel        = Time.TimeModel;
    import TileBaseType     = Types.TileBaseType;
    import TileObjectType   = Types.TileObjectType;
    import CommonConstants  = ConfigManager.COMMON_CONSTANTS;

    export class ScwTileView extends BaseWar.BwTileView {
        protected _updateImages(): void {
            const tile = this._getTile();
            if (tile == null) {
                Logger.error(`ScwTileView._updateImages() empty tile.`);
                return undefined;
            }
            const skinId = tile.getSkinId();
            if (skinId == null) {
                Logger.error(`ScwTileView._updateImages() empty skinId.`);
                return undefined;
            }

            const imgObject = this.getImgObject();
            const imgBase   = this.getImgBase();
            const hasFog    = this._getHasFog();
            const version   = CommonModel.getUnitAndTileTextureVersion();
            const tickCount = TimeModel.getTileAnimationTickCount();

            const objectType = tile.getObjectType();
            if (objectType == null) {
                Logger.error(`ScwTileView._updateImages() empty objectType.`);
                imgObject.visible = false;
            } else if (objectType === TileObjectType.Empty) {
                imgObject.visible = false;
            } else {
                imgObject.visible   = true;
                imgObject.source    = CommonModel.getCachedTileObjectImageSource({
                    version,
                    skinId      : ((hasFog) && (objectType !== TileObjectType.Headquarters)) ? CommonConstants.UnitAndTileNeutralSkinId : skinId,
                    shapeId     : tile.getObjectShapeId(),
                    objectType,
                    isDark      : hasFog,
                    tickCount,
                });
            }

            const baseType = tile.getBaseType();
            if (baseType == null) {
                Logger.error(`ScwTileView._updateImages() empty baseType.`);
                imgBase.visible = false;
            } else if (baseType === TileBaseType.Empty) {
                imgBase.visible = false;
            } else {
                imgBase.visible = true;
                imgBase.source  = CommonModel.getCachedTileBaseImageSource({
                    version,
                    skinId,
                    shapeId     : tile.getBaseShapeId(),
                    baseType,
                    isDark      : hasFog,
                    tickCount,
                });
            }
        }
    }
}
