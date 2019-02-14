
namespace TinyWars.WarMap {
    import UiImage     = GameUi.UiImage;
    import Notify      = Utility.Notify;
    import Types       = Utility.Types
    import TimeModel   = Time.TimeModel;

    const GRID_SIZE   = ConfigManager.getGridSize();
    const GRID_WIDTH  = GRID_SIZE.width;
    const GRID_HEIGHT = GRID_SIZE.height;

    export class WarMapUnitView extends egret.DisplayObjectContainer {
        private _unitImage: UiImage;

        private _data : Types.UnitViewData;
        private _state: Types.UnitState = Types.UnitState.Idle;

        public constructor(data?: Types.UnitViewData, tickCount?: number) {
            super();

            const unitImage  = new UiImage();
            unitImage.bottom = -GRID_HEIGHT;
            this._unitImage  = unitImage;
            this.addChild(unitImage);

            (data) && (this.update(data, tickCount));
        }

        public update(data: Types.UnitViewData, tickCount?: number): void {
            this._data = data;
            this.updateOnAnimationTick(tickCount || TimeModel.getUnitAnimationTickCount());
            this.x = data.gridX * GRID_WIDTH;
            this.y = data.gridY * GRID_HEIGHT;
            // TODO
        }

        public getData(): Types.UnitViewData {
            return this._data;
        }

        public setState(state: Types.UnitState, tickCount?: number): void {
            this._state = state;
            this.updateOnAnimationTick(tickCount || TimeModel.getUnitAnimationTickCount());
        }

        public updateOnAnimationTick(tickCount: number): void {
            if (this._data) {
                if (this._state === Types.UnitState.Idle) {
                    this._unitImage.source = ConfigManager.getUnitIdleImageSource(this._data.viewId, tickCount);
                } else {
                    this._unitImage.source = ConfigManager.getUnitMovingImageSource(this._data.viewId, tickCount);
                }
            }
        }
    }
}
