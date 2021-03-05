
namespace TinyWars.WarMap {
    import UiImage          = GameUi.UiImage;
    import Types            = Utility.Types
    import CommonConstants  = Utility.CommonConstants;
    import TimeModel        = Time.TimeModel;
    import CommonModel      = Common.CommonModel;

    const { width: GRID_WIDTH, height: GRID_HEIGHT } = CommonConstants.GridSize;

    export class WarMapUnitView extends egret.DisplayObjectContainer {
        private _unitImage: UiImage;

        private _data   : Types.WarMapUnitViewData;

        public constructor(data?: Types.WarMapUnitViewData, tickCount?: number) {
            super();

            const unitImage  = new UiImage();
            unitImage.bottom = -GRID_HEIGHT;
            this._unitImage  = unitImage;
            this.addChild(unitImage);

            (data) && (this.update(data, tickCount));
        }

        public update(data: Types.WarMapUnitViewData, tickCount?: number): void {
            const gridIndex = data.gridIndex;
            this._data = data;
            this.updateOnAnimationTick(tickCount || TimeModel.getUnitAnimationTickCount());
            this.x = gridIndex.x * GRID_WIDTH - GRID_WIDTH / 4;
            this.y = gridIndex.y * GRID_HEIGHT - GRID_HEIGHT / 2;
        }

        public getData(): Types.WarMapUnitViewData {
            return this._data;
        }

        public updateOnAnimationTick(tickCount: number): void {
            const data = this._data;
            if (data) {
                // if (this._state === Types.UnitActionState.Idle) {
                //     this._unitImage.source = CommonModel.getUnitIdleImageSource(this._data.viewId, false);
                // } else {
                //     this._unitImage.source = CommonModel.getUnitMovingImageSource(this._data.viewId, false);
                // }

                this._unitImage.source = CommonModel.getCachedUnitImageSource({
                    version     : User.UserModel.getSelfSettingsTextureVersion(),
                    skinId      : data.skinId,
                    unitType    : data.unitType,
                    isMoving    : false,
                    isDark      : data.unitActionState === Types.UnitActionState.Acted,
                    tickCount,
                });
            }
        }
    }
}
