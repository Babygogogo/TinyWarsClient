
namespace TinyWars.MultiCustomWar {
    import TimeModel    = Time.TimeModel;
    import Types        = Utility.Types;
    import Helpers      = Utility.Helpers;
    import Notify       = Utility.Notify;

    const { width: _GRID_WIDTH, height: _GRID_HEIGHT } = ConfigManager.getGridSize();
    const _MOVABLE_GRID_FRAMES = [
        `c08_t02_s01_f01`, `c08_t02_s01_f02`, `c08_t02_s01_f03`, `c08_t02_s01_f04`,
        `c08_t02_s01_f05`, `c08_t02_s01_f06`, `c08_t02_s01_f07`, `c08_t02_s01_f08`,
        `c08_t02_s01_f09`, `c08_t02_s01_f10`, `c08_t02_s01_f11`, `c08_t02_s01_f12`,
        `c08_t02_s01_f13`, `c08_t02_s01_f14`, `c08_t02_s01_f15`,
    ];
    const _ATTACKABLE_GRID_FRAMES = [
        `c08_t02_s02_f01`, `c08_t02_s02_f02`, `c08_t02_s02_f03`, `c08_t02_s02_f04`,
        `c08_t02_s02_f05`, `c08_t02_s02_f06`, `c08_t02_s02_f07`, `c08_t02_s02_f08`,
        `c08_t02_s02_f09`, `c08_t02_s02_f10`, `c08_t02_s02_f11`, `c08_t02_s02_f12`,
        `c08_t02_s02_f13`, `c08_t02_s02_f14`, `c08_t02_s02_f15`,
    ];

    export class McwActionPlannerView extends egret.DisplayObjectContainer {
        private _actionPlanner  : McwActionPlanner;
        private _mapSize        : Types.MapSize;

        private _conForMovableGrids     = new egret.DisplayObjectContainer();
        private _conForAttackableGrids  = new egret.DisplayObjectContainer();
        private _conForMovePath         = new egret.DisplayObjectContainer();
        private _imgsForMovableGrids    : GameUi.UiImage[][];
        private _imgsForAttackableGrids : GameUi.UiImage[][];

        private _notifyEvents: Notify.Listener[] = [
            { type: Notify.Type.GridAnimationTick, callback: this._onNotifyGridAnimationTick },
        ];

        public constructor() {
            super();

            this._conForMovableGrids.alpha      = 0.5;
            this._conForAttackableGrids.alpha   = 0.5;
            this.addChild(this._conForMovableGrids);
            this.addChild(this._conForAttackableGrids);
            this.addChild(this._conForMovePath);
        }

        public init(actionPlanner: McwActionPlanner): void {
            this._actionPlanner = actionPlanner;
            this._mapSize       = actionPlanner.getMapSize();
            this._initMovableGrids();
            this._initAttackableGrids();
        }

        public startRunningView(): void {
            Notify.addEventListeners(this._notifyEvents, this);
        }
        public stopRunningView(): void {
            Notify.removeEventListeners(this._notifyEvents, this);
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Callbacks.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _onNotifyGridAnimationTick(e: egret.Event): void {
            const sourceForMovable      = _MOVABLE_GRID_FRAMES[TimeModel.getGridAnimationTickCount() % _MOVABLE_GRID_FRAMES.length];
            const sourceForAttackable   = _ATTACKABLE_GRID_FRAMES[TimeModel.getGridAnimationTickCount() % _ATTACKABLE_GRID_FRAMES.length];
            const imgsForMovable        = this._imgsForMovableGrids;
            const imgsForAttackable     = this._imgsForAttackableGrids;
            const { width, height }     = this._mapSize;
            for (let x = 0; x < width; ++x) {
                for (let y = 0; y < height; ++y) {
                    imgsForMovable[x][y].source     = sourceForMovable;
                    imgsForAttackable[x][y].source  = sourceForAttackable;
                }
            }
        }

        private _initMovableGrids(): void {
            this._conForMovableGrids.removeChildren();
            const { width, height } = this._mapSize;
            const images            = Helpers.createEmptyMap<GameUi.UiImage>(width, height);
            for (let x = 0; x < width; ++x) {
                for (let y = 0; y < height; ++y) {
                    const image     = new GameUi.UiImage(`c08_t02_s01_f01`);
                    image.x         = x * _GRID_WIDTH;
                    image.y         = y * _GRID_HEIGHT;
                    image.visible   = false;
                    image.visible   = Math.random() > 0.5;
                    images[x][y]    = image;
                    this._conForMovableGrids.addChild(image);
                }
            }
            this._imgsForMovableGrids = images;
        }
        private _initAttackableGrids(): void {
            this._conForAttackableGrids.removeChildren();
            const { width, height } = this._mapSize;
            const images            = Helpers.createEmptyMap<GameUi.UiImage>(width, height);
            for (let x = 0; x < width; ++x) {
                for (let y = 0; y < height; ++y) {
                    const image     = new GameUi.UiImage(`c08_t02_s02_f01`);
                    image.x         = x * _GRID_WIDTH;
                    image.y         = y * _GRID_HEIGHT;
                    image.visible   = false;
                    image.visible   = Math.random() > 0.5;
                    images[x][y]    = image;
                    this._conForAttackableGrids.addChild(image);
                }
            }
            this._imgsForAttackableGrids = images;
        }
    }
}
