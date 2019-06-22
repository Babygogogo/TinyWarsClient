
namespace TinyWars.BaseWar {
    import TimeModel        = Time.TimeModel;
    import Types            = Utility.Types;
    import Helpers          = Utility.Helpers;
    import Notify           = Utility.Notify;
    import GridIndexHelpers = Utility.GridIndexHelpers;
    import State            = Types.ActionPlannerState;
    import GridIndex        = Types.GridIndex;
    import Direction        = Types.Direction;

    const _PATH_GRID_SOURCE_EMPTY               = undefined;
    const _PATH_GRID_SOURCE_LINE_VERTICAL       = `c08_t01_s01_f01`;
    const _PATH_GRID_SOURCE_LINE_HORIZONTAL     = `c08_t01_s02_f01`;
    const _PATH_GRID_SOURCE_ARROW_UP            = `c08_t01_s03_f01`;
    const _PATH_GRID_SOURCE_ARROW_DOWN          = `c08_t01_s04_f01`;
    const _PATH_GRID_SOURCE_ARROW_LEFT          = `c08_t01_s05_f01`;
    const _PATH_GRID_SOURCE_ARROW_RIGHT         = `c08_t01_s06_f01`;
    const _PATH_GRID_SOURCE_CORNER_DOWN_LEFT    = `c08_t01_s07_f01`;
    const _PATH_GRID_SOURCE_CORNER_DOWN_RIGHT   = `c08_t01_s08_f01`;
    const _PATH_GRID_SOURCE_CORNER_UP_LEFT      = `c08_t01_s09_f01`;
    const _PATH_GRID_SOURCE_CORNER_UP_RIGHT     = `c08_t01_s10_f01`;

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
    const _PATH_GRID_SOURCES = new Map<Direction, Map<Direction, string>>([
        [Direction.Undefined, new Map([
            [Direction.Undefined,   _PATH_GRID_SOURCE_EMPTY],
            [Direction.Up,          _PATH_GRID_SOURCE_LINE_VERTICAL],
            [Direction.Down,        _PATH_GRID_SOURCE_LINE_VERTICAL],
            [Direction.Left,        _PATH_GRID_SOURCE_LINE_HORIZONTAL],
            [Direction.Right,       _PATH_GRID_SOURCE_LINE_HORIZONTAL],
        ])],
        [Direction.Up, new Map([
            [Direction.Undefined,   _PATH_GRID_SOURCE_ARROW_DOWN],
            [Direction.Up,          _PATH_GRID_SOURCE_EMPTY],
            [Direction.Down,        _PATH_GRID_SOURCE_LINE_VERTICAL],
            [Direction.Left,        _PATH_GRID_SOURCE_CORNER_UP_LEFT],
            [Direction.Right,       _PATH_GRID_SOURCE_CORNER_UP_RIGHT],
        ])],
        [Direction.Down, new Map([
            [Direction.Undefined,   _PATH_GRID_SOURCE_ARROW_UP],
            [Direction.Up,          _PATH_GRID_SOURCE_LINE_VERTICAL],
            [Direction.Down,        _PATH_GRID_SOURCE_EMPTY],
            [Direction.Left,        _PATH_GRID_SOURCE_CORNER_DOWN_LEFT],
            [Direction.Right,       _PATH_GRID_SOURCE_CORNER_DOWN_RIGHT],
        ])],
        [Direction.Left, new Map([
            [Direction.Undefined,   _PATH_GRID_SOURCE_ARROW_RIGHT],
            [Direction.Up,          _PATH_GRID_SOURCE_CORNER_UP_LEFT],
            [Direction.Down,        _PATH_GRID_SOURCE_CORNER_DOWN_LEFT],
            [Direction.Left,        _PATH_GRID_SOURCE_EMPTY],
            [Direction.Right,       _PATH_GRID_SOURCE_LINE_HORIZONTAL],
        ])],
        [Direction.Right, new Map([
            [Direction.Undefined,   _PATH_GRID_SOURCE_ARROW_LEFT],
            [Direction.Up,          _PATH_GRID_SOURCE_CORNER_UP_RIGHT],
            [Direction.Down,        _PATH_GRID_SOURCE_CORNER_DOWN_RIGHT],
            [Direction.Left,        _PATH_GRID_SOURCE_LINE_HORIZONTAL],
            [Direction.Right,       _PATH_GRID_SOURCE_EMPTY],
        ])],
    ]);
    const ALPHA_FOR_MOVABLE_GRIDS           = 0.5;
    const ALPHA_FOR_ATTACKABLE_GRIDS_NORMAL = 0.6;
    const ALPHA_FOR_ATTACKABLE_GRIDS_SILO   = 0.15;

    export abstract class BwActionPlannerView extends egret.DisplayObjectContainer {
        private _actionPlanner  : BwActionPlanner;
        private _mapSize        : Types.MapSize;

        private _conForGrids            = new egret.DisplayObjectContainer();
        private _conForMovableGrids     = new egret.DisplayObjectContainer();
        private _conForMoveDestination  = new egret.DisplayObjectContainer();
        private _conForAttackableGrids  = new egret.DisplayObjectContainer();
        private _conForMovePath         = new egret.DisplayObjectContainer();
        private _imgsForMovableGrids    : GameUi.UiImage[][];
        private _imgsForAttackableGrids : GameUi.UiImage[][];
        private _imgForMoveDestination  : GameUi.UiImage;

        private _conForUnits            = new egret.DisplayObjectContainer();
        private _focusUnitViews         = new Map<number, BwUnitView>();

        private _notifyEvents: Notify.Listener[] = [
            { type: Notify.Type.GridAnimationTick, callback: this._onNotifyGridAnimationTick },
            { type: Notify.Type.UnitAnimationTick, callback: this._onNotifyUnitAnimationTick },
        ];

        public constructor() {
            super();

            const conForGrids = this._conForGrids;
            this.addChild(conForGrids);
            conForGrids.addChild(this._conForMovableGrids);
            conForGrids.addChild(this._conForMoveDestination);
            conForGrids.addChild(this._conForAttackableGrids);
            conForGrids.addChild(this._conForMovePath);

            this.addChild(this._conForUnits);
        }

        public init(actionPlanner: BwActionPlanner): void {
            this._actionPlanner = actionPlanner;
            this._mapSize       = actionPlanner.getMapSize();
            this._initConForMovableGrids();
            this._initConForMoveDestination();
            this._initConForAttackableGrids();
            this._initConForMovePath();
        }

        public startRunningView(): void {
            Notify.addEventListeners(this._notifyEvents, this);

            this.updateView();
        }
        public stopRunningView(): void {
            Notify.removeEventListeners(this._notifyEvents, this);
        }

        public getContainerForGrids(): egret.DisplayObjectContainer {
            return this._conForGrids;
        }
        public getContainerForUnits(): egret.DisplayObjectContainer {
            return this._conForUnits;
        }

        protected abstract _getUnitViewClass(): new () => BwUnitView;

        private _initConForMovableGrids(): void {
            this._conForMovableGrids.removeChildren();
            this._conForMovableGrids.alpha = ALPHA_FOR_MOVABLE_GRIDS;

            const { width, height } = this._mapSize;
            const images            = Helpers.createEmptyMap<GameUi.UiImage>(width, height);
            for (let x = 0; x < width; ++x) {
                for (let y = 0; y < height; ++y) {
                    const image     = new GameUi.UiImage(_MOVABLE_GRID_FRAMES[0]);
                    image.x         = x * _GRID_WIDTH;
                    image.y         = y * _GRID_HEIGHT;
                    image.visible   = false;
                    images[x][y]    = image;
                    this._conForMovableGrids.addChild(image);
                }
            }
            this._imgsForMovableGrids = images;
        }
        private _initConForMoveDestination(): void {
            this._conForMoveDestination.removeChildren();
            this._imgForMoveDestination     = new GameUi.UiImage(_MOVABLE_GRID_FRAMES[0]);
            this._imgForMoveDestination.x   = 0;
            this._imgForMoveDestination.y   = 0;
            this._conForMoveDestination.addChild(this._imgForMoveDestination);
        }
        private _initConForAttackableGrids(): void {
            this._conForAttackableGrids.removeChildren();
            this._conForAttackableGrids.alpha = ALPHA_FOR_ATTACKABLE_GRIDS_NORMAL;

            const { width, height } = this._mapSize;
            const images            = Helpers.createEmptyMap<GameUi.UiImage>(width, height);
            for (let x = 0; x < width; ++x) {
                for (let y = 0; y < height; ++y) {
                    const image     = new GameUi.UiImage(_ATTACKABLE_GRID_FRAMES[0]);
                    image.x         = x * _GRID_WIDTH;
                    image.y         = y * _GRID_HEIGHT;
                    image.visible   = false;
                    images[x][y]    = image;
                    this._conForAttackableGrids.addChild(image);
                }
            }
            this._imgsForAttackableGrids = images;
        }
        private _initConForMovePath(): void {
            this._conForMovePath.removeChildren();
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
            this._imgForMoveDestination.source = sourceForMovable;
        }

        private _onNotifyUnitAnimationTick(e: egret.Event): void {
            for (const [, view] of this._focusUnitViews) {
                view.tickUnitAnimationFrame();
                view.tickStateAnimationFrame();
            }
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Functions for view.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        public updateView(): void {
            this._resetConForAttackableGrids();
            this._resetConForMovableGrids();
            this._resetConForMoveDestination();
            this._resetConForMovePath();
            this._resetConForUnits();
        }

        private _resetConForAttackableGrids(): void {
            const con           = this._conForAttackableGrids;
            const actionPlanner = this._actionPlanner;
            const state         = actionPlanner.getState();

            if (state === State.Idle) {
                con.visible = false;

            } else if (state === State.ExecutingAction) {
                con.visible = false;

            } else if (state === State.MakingMovePath) {
                con.visible = true;
                con.alpha   = ALPHA_FOR_ATTACKABLE_GRIDS_NORMAL;

                const movableArea       = actionPlanner.getMovableArea();
                const attackableArea    = actionPlanner.getAttackableArea();
                const { width, height } = this._mapSize;
                for (let x = 0; x < width; ++x) {
                    for (let y = 0; y < height; ++y) {
                        const isMovable = (!!movableArea[x]) && (!!movableArea[x][y]);
                        this._imgsForAttackableGrids[x][y].visible = (!isMovable) && (!!attackableArea[x]) && (!!attackableArea[x][y]);
                    }
                }

            } else if (state === State.ChoosingAction) {
                con.visible = false;

            } else if (state === State.ChoosingAttackTarget) {
                con.visible = true;
                con.alpha   = ALPHA_FOR_ATTACKABLE_GRIDS_NORMAL;

                const { width, height } = this._mapSize;
                for (let x = 0; x < width; ++x) {
                    for (let y = 0; y < height; ++y) {
                        this._imgsForAttackableGrids[x][y].visible = false;
                    }
                }
                for (const grid of actionPlanner.getAttackableGridsAfterMove()) {
                    this._imgsForAttackableGrids[grid.x][grid.y].visible = true;
                }

            } else if (state === State.ChoosingDropDestination) {
                con.visible = false;

            } else if (state === State.ChoosingFlareDestination) {
                con.visible = true;
                con.alpha   = ALPHA_FOR_ATTACKABLE_GRIDS_NORMAL;

                const { width, height } = this._mapSize;
                const imgs              = this._imgsForAttackableGrids;
                const destination       = actionPlanner.getMovePathDestination();
                const range             = actionPlanner.getFocusUnit().getFlareMaxRange();
                for (let x = 0; x < width; ++x) {
                    for (let y = 0; y < height; ++y) {
                        imgs[x][y].visible = GridIndexHelpers.getDistance(destination, { x, y }) <= range;
                    }
                }

            } else if (state === State.ChoosingSiloDestination) {
                con.visible = true;
                con.alpha   = ALPHA_FOR_ATTACKABLE_GRIDS_SILO;

                const { width, height } = this._mapSize;
                const imgs              = this._imgsForAttackableGrids;
                for (let x = 0; x < width; ++x) {
                    for (let y = 0; y < height; ++y) {
                        imgs[x][y].visible = true;
                    }
                }

            } else if (state === State.ChoosingProductionTarget) {
                con.visible = false;

            } else if (state === State.PreviewingAttackableArea) {
                con.visible = true;
                con.alpha   = ALPHA_FOR_ATTACKABLE_GRIDS_NORMAL;

                const area              = actionPlanner.getAreaForPreviewingAttack();
                const { width, height } = this._mapSize;
                for (let x = 0; x < width; ++x) {
                    for (let y = 0; y < height; ++y) {
                        this._imgsForAttackableGrids[x][y].visible = (!!area[x]) && (!!area[x][y]);
                    }
                }

            } else if (state === State.PreviewingMovableArea) {
                con.visible = false;

            } else {
                // TODO
            }
        }

        private _resetConForMovableGrids(): void {
            const con           = this._conForMovableGrids;
            const actionPlanner = this._actionPlanner;
            const state         = actionPlanner.getState();

            if (state === State.Idle) {
                con.visible = false;

            } else if (state === State.ExecutingAction) {
                con.visible = false;

            } else if (state === State.MakingMovePath) {
                con.visible = true;

                const movableArea       = actionPlanner.getMovableArea();
                const { width, height } = this._mapSize;
                for (let x = 0; x < width; ++x) {
                    for (let y = 0; y < height; ++y) {
                        this._imgsForMovableGrids[x][y].visible = (!!movableArea[x]) && (!!movableArea[x][y]);
                    }
                }

            } else if (state === State.ChoosingAction) {
                con.visible = false;

            } else if (state === State.ChoosingAttackTarget) {
                con.visible = false;

            } else if (state === State.ChoosingDropDestination) {
                con.visible = true;

                const { width, height } = this._mapSize;
                for (let x = 0; x < width; ++x) {
                    for (let y = 0; y < height; ++y) {
                        this._imgsForMovableGrids[x][y].visible = false;
                    }
                }
                for (const grid of actionPlanner.getAvailableDropDestinations()) {
                    this._imgsForMovableGrids[grid.x][grid.y].visible = true;
                }

            } else if (state === State.ChoosingFlareDestination) {
                con.visible = false;

            } else if (state === State.ChoosingSiloDestination) {
                con.visible = false;

            } else if (state === State.ChoosingProductionTarget) {
                con.visible = false;

            } else if (state === State.PreviewingAttackableArea) {
                con.visible = false;

            } else if (state === State.PreviewingMovableArea) {
                con.visible = true;

                const area              = actionPlanner.getAreaForPreviewingMove();
                const { width, height } = this._mapSize;
                for (let x = 0; x < width; ++x) {
                    for (let y = 0; y < height; ++y) {
                        this._imgsForMovableGrids[x][y].visible = (!!area[x]) && (!!area[x][y]);
                    }
                }

            } else {
                // TODO
            }
        }

        private _resetConForMoveDestination(): void {
            const con           = this._conForMoveDestination;
            const actionPlanner = this._actionPlanner;
            const state         = actionPlanner.getState();
            // TODO
            con.visible = false;
        }

        private _resetConForMovePath(): void {
            const con           = this._conForMovePath;
            const actionPlanner = this._actionPlanner;
            const state         = actionPlanner.getState();

            if (state == State.Idle) {
                con.removeChildren();
                con.visible = false;

            } else if (state === State.ExecutingAction) {
                con.removeChildren();
                con.visible = false;

            } else if (state === State.MakingMovePath) {
                con.removeChildren();
                con.visible = true;

                this._addMovePathView();

            } else if (state === State.ChoosingAction) {
                con.removeChildren();
                con.visible = true;

                this._addMovePathView();

            } else if (state === State.ChoosingAttackTarget) {
                con.removeChildren();
                con.visible = true;

                this._addMovePathView();

            } else if (state === State.ChoosingDropDestination) {
                con.removeChildren();
                con.visible = true;

                this._addMovePathView();

            } else if (state === State.ChoosingFlareDestination) {
                con.removeChildren();
                con.visible = true;

                this._addMovePathView();

            } else if (state === State.ChoosingSiloDestination) {
                con.removeChildren();
                con.visible = true;

                this._addMovePathView();

            } else if (state === State.ChoosingProductionTarget) {
                con.removeChildren();
                con.visible = false;

            } else if (state === State.PreviewingAttackableArea) {
                con.removeChildren();
                con.visible = false;

            } else if (state === State.PreviewingMovableArea) {
                con.removeChildren();
                con.visible = false;

            } else {
                // Nothing to do.
            }
        }

        private _resetConForUnits(): void {
            const con           = this._conForUnits;
            const views         = this._focusUnitViews;
            const actionPlanner = this._actionPlanner;
            const state         = actionPlanner.getState();

            if (state === State.Idle) {
                con.removeChildren();
                views.clear();
                con.visible = false;

            } else if (state === State.ExecutingAction) {
                con.removeChildren();
                con.visible = false;
                views.clear();

            } else if (state === State.MakingMovePath) {
                con.removeChildren();
                views.clear();
                con.visible = true;

                const unitOnMap     = actionPlanner.getFocusUnitOnMap();
                const unitLoaded    = actionPlanner.getFocusUnitLoaded();
                const movePath      = actionPlanner.getMovePath();
                if (!unitLoaded) {
                    this._addUnitView(unitOnMap, movePath[movePath.length - 1]);
                } else {
                    this._addUnitView(unitOnMap, unitOnMap.getGridIndex());
                    this._addUnitView(unitLoaded, movePath[movePath.length - 1]);
                }

            } else if (state === State.ChoosingAction) {
                con.removeChildren();
                views.clear();
                con.visible = true;

                const unitOnMap     = actionPlanner.getFocusUnitOnMap();
                const unitLoaded    = actionPlanner.getFocusUnitLoaded();
                const movePath      = actionPlanner.getMovePath();
                if (!unitLoaded) {
                    this._addUnitView(unitOnMap, movePath[movePath.length - 1]);
                } else {
                    this._addUnitView(unitOnMap, unitOnMap.getGridIndex());
                    this._addUnitView(unitLoaded, movePath[movePath.length - 1]);
                }

                for (const data of actionPlanner.getChosenUnitsForDrop()) {
                    this._addUnitView(data.unit, data.destination);
                }

            } else if (state === State.ChoosingAttackTarget) {
                con.removeChildren();
                views.clear();
                con.visible = true;

                const unitOnMap     = actionPlanner.getFocusUnitOnMap();
                const unitLoaded    = actionPlanner.getFocusUnitLoaded();
                const movePath      = actionPlanner.getMovePath();
                if (!unitLoaded) {
                    this._addUnitView(unitOnMap, movePath[movePath.length - 1]);
                } else {
                    this._addUnitView(unitOnMap, unitOnMap.getGridIndex());
                    this._addUnitView(unitLoaded, movePath[movePath.length - 1]);
                }

            } else if (state === State.ChoosingDropDestination) {
                con.removeChildren();
                views.clear();
                con.visible = true;

                const focusUnitLoaded   = actionPlanner.getFocusUnitLoaded();
                const focusUnitOnMap    = actionPlanner.getFocusUnitOnMap();
                const movePath          = actionPlanner.getMovePath();
                if (!focusUnitLoaded) {
                    this._addUnitView(focusUnitOnMap, movePath[movePath.length - 1]);
                } else {
                    this._addUnitView(focusUnitOnMap, focusUnitOnMap.getGridIndex());
                    this._addUnitView(focusUnitLoaded, movePath[movePath.length - 1]);
                }

                for (const data of actionPlanner.getChosenUnitsForDrop()) {
                    this._addUnitView(data.unit, data.destination);
                }

                const cursorGridIndex = this._actionPlanner.getCursor().getGridIndex();
                if (actionPlanner.getAvailableDropDestinations()!.some(grid => GridIndexHelpers.checkIsEqual(grid, cursorGridIndex))) {
                    this._addUnitView(actionPlanner.getChoosingUnitForDrop(), cursorGridIndex);
                }

            } else if (state === State.ChoosingFlareDestination) {
                con.removeChildren();
                views.clear();
                con.visible = true;

                const unitOnMap     = actionPlanner.getFocusUnitOnMap();
                const unitLoaded    = actionPlanner.getFocusUnitLoaded();
                const movePath      = actionPlanner.getMovePath();
                if (!unitLoaded) {
                    this._addUnitView(unitOnMap, movePath[movePath.length - 1]);
                } else {
                    this._addUnitView(unitOnMap, unitOnMap.getGridIndex());
                    this._addUnitView(unitLoaded, movePath[movePath.length - 1]);
                }

            } else if (state === State.ChoosingSiloDestination) {
                con.removeChildren();
                views.clear();
                con.visible = true;

                const unitOnMap     = actionPlanner.getFocusUnitOnMap();
                const unitLoaded    = actionPlanner.getFocusUnitLoaded();
                const movePath      = actionPlanner.getMovePath();
                if (!unitLoaded) {
                    this._addUnitView(unitOnMap, movePath[movePath.length - 1]);
                } else {
                    this._addUnitView(unitOnMap, unitOnMap.getGridIndex());
                    this._addUnitView(unitLoaded, movePath[movePath.length - 1]);
                }

            } else if (state === State.ChoosingProductionTarget) {
                con.removeChildren();
                views.clear();
                con.visible = false;

            } else if (state === State.PreviewingAttackableArea) {
                con.removeChildren();
                views.clear();
                con.visible = true;

                for (const [, unit] of actionPlanner.getUnitsForPreviewingAttackableArea()) {
                    this._addUnitView(unit, unit.getGridIndex());
                }

            } else if (state === State.PreviewingMovableArea) {
                con.removeChildren();
                views.clear();
                con.visible = true;

                const unit = actionPlanner.getUnitForPreviewingMovableArea();
                this._addUnitView(unit, unit.getGridIndex());

            } else {
                // TODO
            }
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Other functions.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _addUnitView(unit: BwUnit, gridIndex: GridIndex, alpha = 1): void {
            const view = new (this._getUnitViewClass())().init(unit).startRunningView();
            // view.alpha = alpha;
            _resetUnitViewXy(view, gridIndex);
            view.showUnitAnimation(Types.UnitAnimationType.Move);
            this._focusUnitViews.set(unit.getUnitId(), view);
            this._conForUnits.addChild(view);
        }

        private _addMovePathView(): void {
            const con   = this._conForMovePath;
            const path  = this._actionPlanner.getMovePath();
            for (let i = 0; i < path.length; ++i) {
                const img = _createImgForMovePathGrid(path[i - 1], path[i], path[i + 1]);
                img && con.addChild(img);
            }
        }
    }

    function _createImgForMovePathGrid(prev: GridIndex, curr: GridIndex, next: GridIndex): GameUi.UiImage {
        const source = _PATH_GRID_SOURCES.get(GridIndexHelpers.getAdjacentDirection(prev, curr)).get(GridIndexHelpers.getAdjacentDirection(next, curr));
        if (!source) {
            return undefined;
        } else {
            const image = new GameUi.UiImage(source);
            image.x = curr.x * _GRID_WIDTH;
            image.y = curr.y * _GRID_HEIGHT;
            return image;
        }
    }

    function _resetUnitViewXy(view: BwUnitView, gridIndex: GridIndex): void {
        view.x  = gridIndex.x * _GRID_WIDTH;
        view.y  = gridIndex.y * _GRID_HEIGHT;
    }
}
