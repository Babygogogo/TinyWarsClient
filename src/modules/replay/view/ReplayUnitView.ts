
namespace TinyWars.Replay {
    import Types                = Utility.Types;
    import Helpers              = Utility.Helpers;
    import GridIndexHelpers     = Utility.GridIndexHelpers;
    import UnitAnimationType    = Types.UnitAnimationType;
    import GridIndex            = Types.GridIndex;

    export class ReplayUnitView extends BaseWar.BwUnitView {
        public moveAlongPath(path: GridIndex[], isDiving: boolean, isBlocked: boolean, callback: Function, aiming?: GridIndex): void {
            this.showUnitAnimation(UnitAnimationType.Move);

            const startingPoint = GridIndexHelpers.createPointByGridIndex(path[0]);
            this.x              = startingPoint.x;
            this.y              = startingPoint.y;

            const unit              = this._getUnit();
            const war               = unit.getWar() as ReplayWar;
            const playerIndex       = unit.getPlayerIndex();
            const playerIndexMod    = playerIndex % 2;
            const tween             = egret.Tween.get(this);
            this.visible            = true;

            for (let i = 1; i < path.length; ++i) {
                const gridIndex = path[i];
                const currentX  = gridIndex.x;
                const previousX = path[i - 1].x;
                if (currentX < previousX) {
                    tween.call(() => this._setImgUnitFlippedX(playerIndexMod === 1));
                } else if (currentX > previousX) {
                    tween.call(() => this._setImgUnitFlippedX(playerIndexMod === 0));
                }

                tween.to(GridIndexHelpers.createPointByGridIndex(gridIndex), 200);
            }

            if (!aiming) {
                tween.call(() => {
                    this._setImgUnitFlippedX(false);
                    (isBlocked) && (war.getGridVisionEffect().showEffectBlock(path[path.length - 1]));

                    (callback) && (callback());
                });
            } else {
                const cursor = war.getField().getCursor();
                tween.call(() => {
                    cursor.setIsMovableByTouches(false);
                    cursor.setGridIndex(aiming);
                    cursor.updateView();
                    cursor.setVisibleForConForTarget(true);
                    cursor.setVisibleForConForNormal(false);
                })
                .wait(500)
                .call(() => {
                    cursor.setIsMovableByTouches(true);
                    cursor.updateView();
                    this._setImgUnitFlippedX(false);
                    (isBlocked) && (war.getGridVisionEffect().showEffectBlock(path[path.length - 1]));

                    (callback) && (callback());
                });
            }
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Other functions.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        protected _addFrameForLoader(): void {
            const unit  = this._getUnit();
            const war   = unit.getWar();
            if ((war) && (unit.getMaxLoadUnitsCount())) {
                const unitPlayerIndex = unit.getPlayerIndex();
                if (unit.getLoadedUnitsCount() > 0) {
                    this._getFramesForStateAnimation().push(`${this._getImageSourcePrefix(this._getIsDark())}_t99_s06_f${Helpers.getNumText(unitPlayerIndex)}`);
                }
            }
        }
    }
}
