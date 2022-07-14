
// import CommonConstants      from "../../tools/helpers/CommonConstants";
// import GridIndexHelpers     from "../../tools/helpers/GridIndexHelpers";
// import Helpers              from "../../tools/helpers/Helpers";
// import Timer                from "../../tools/helpers/Timer";
// import Types                from "../../tools/helpers/Types";
// import Notify               from "../../tools/notify/Notify";
// import Twns.Notify       from "../../tools/notify/NotifyType";
// import TwnsUiImage          from "../../tools/ui/UiImage";
// import TwnsBwActionPlanner  from "../model/BwActionPlanner";
// import TwnsBwUnit           from "../model/BwUnit";
// import TwnsBwUnitView       from "./BwUnitView";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.BaseWar {
    import NotifyType   = Twns.Notify.NotifyType;
    import State        = Twns.Types.ActionPlannerState;
    import GridIndex    = Twns.Types.GridIndex;
    import Direction    = Twns.Types.Direction;

    const _PATH_GRID_SOURCE_EMPTY               = ``;
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

    const { width: _GRID_WIDTH, height: _GRID_HEIGHT } = Twns.CommonConstants.GridSize;
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
    const _VISIBLE_GRID_FRAMES = [
        `commonGridYellow0001`,     `commonGridYellow0002`,     `commonGridYellow0003`,     `commonGridYellow0004`,
        `commonGridYellow0005`,     `commonGridYellow0006`,     `commonGridYellow0007`,     `commonGridYellow0008`,
        `commonGridYellow0009`,     `commonGridYellow0010`,     `commonGridYellow0011`,     `commonGridYellow0012`,
        `commonGridYellow0013`,     `commonGridYellow0014`,     `commonGridYellow0015`,
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
    const ALPHA_FOR_VISIBLE_GRIDS_NORMAL    = 0.6;

    export class BwActionPlannerView extends egret.DisplayObjectContainer {
        private _actionPlanner?                 : Twns.BaseWar.BwActionPlanner;

        private _conForGrids                    = new egret.DisplayObjectContainer();
        private _conForMovableGrids             = new egret.DisplayObjectContainer();
        private _conForMoveDestination          = new egret.DisplayObjectContainer();
        private _conForAttackableGrids          = new egret.DisplayObjectContainer();
        private _conForVisibleGrids             = new egret.DisplayObjectContainer();
        private _conForMovePath                 = new egret.DisplayObjectContainer();
        private _imgsForMovableGrids?           : TwnsUiImage.UiImage[][];
        private _imgsForAttackableGrids?        : TwnsUiImage.UiImage[][];
        private _imgsForVisibleGrids?           : TwnsUiImage.UiImage[][];
        private readonly _imgForMoveDestination = new TwnsUiImage.UiImage(_MOVABLE_GRID_FRAMES[0]);

        private _conForUnits            = new egret.DisplayObjectContainer();
        private _focusUnitViews         = new Map<number, Twns.BaseWar.BwUnitView>();

        private _notifyEvents: Twns.Notify.Listener[] = [
            { type: NotifyType.GridAnimationTick,       callback: this._onNotifyGridAnimationTick },
            { type: NotifyType.UnitAnimationTick,       callback: this._onNotifyUnitAnimationTick },
            { type: NotifyType.UnitStateIndicatorTick,  callback: this._onNotifyUnitStateIndicatorTick },
        ];

        public constructor() {
            super();

            const conForGrids = this._conForGrids;
            this.addChild(conForGrids);
            conForGrids.addChild(this._conForMovableGrids);
            conForGrids.addChild(this._conForMoveDestination);
            conForGrids.addChild(this._conForAttackableGrids);
            conForGrids.addChild(this._conForVisibleGrids);
            conForGrids.addChild(this._conForMovePath);

            this.addChild(this._conForUnits);
        }

        public init(actionPlanner: Twns.BaseWar.BwActionPlanner): void {
            this._actionPlanner = actionPlanner;
            this._initConForMovableGrids();
            this._initConForMoveDestination();
            this._initConForAttackableGrids();
            this._initConForMovePath();
            this._initConForVisibleGrids();
        }
        public fastInit(actionPlanner: Twns.BaseWar.BwActionPlanner): void {
            this._actionPlanner = actionPlanner;
        }

        public startRunningView(): void {
            Twns.Notify.addEventListeners(this._notifyEvents, this);

            this.updateView();
        }
        public stopRunningView(): void {
            Twns.Notify.removeEventListeners(this._notifyEvents, this);
        }

        private _getActionPlanner(): Twns.BaseWar.BwActionPlanner {
            return Twns.Helpers.getExisted(this._actionPlanner);
        }

        public getContainerForGrids(): egret.DisplayObjectContainer {
            return this._conForGrids;
        }
        public getContainerForUnits(): egret.DisplayObjectContainer {
            return this._conForUnits;
        }

        private _getImgsForMovableGrids(): TwnsUiImage.UiImage[][] {
            return Twns.Helpers.getExisted(this._imgsForMovableGrids);
        }
        private _getImgsForAttackableGrids(): TwnsUiImage.UiImage[][] {
            return Twns.Helpers.getExisted(this._imgsForAttackableGrids);
        }
        private _getImgForMoveDestination(): TwnsUiImage.UiImage {
            return Twns.Helpers.getExisted(this._imgForMoveDestination);
        }
        private _getImgsForVisibleGrids(): TwnsUiImage.UiImage[][] {
            return Twns.Helpers.getExisted(this._imgsForVisibleGrids);
        }

        private _initConForMovableGrids(): void {
            const con = this._conForMovableGrids;
            con.removeChildren();
            con.alpha = ALPHA_FOR_MOVABLE_GRIDS;

            const { width, height } = this._getActionPlanner().getMapSize();
            const images            = Twns.Helpers.createEmptyMap<TwnsUiImage.UiImage>(width, height);
            for (let x = 0; x < width; ++x) {
                for (let y = 0; y < height; ++y) {
                    const image     = new TwnsUiImage.UiImage(_MOVABLE_GRID_FRAMES[0]);
                    image.smoothing = false;
                    image.x         = x * _GRID_WIDTH;
                    image.y         = y * _GRID_HEIGHT;
                    image.visible   = false;
                    images[x][y]    = image;
                    con.addChild(image);
                }
            }
            this._imgsForMovableGrids = images;
        }
        private _initConForMoveDestination(): void {
            const img       = this._imgForMoveDestination;
            img.smoothing   = false;

            const container = this._conForMoveDestination;
            container.removeChildren();
            container.addChild(img);
        }
        private _initConForAttackableGrids(): void {
            const con = this._conForAttackableGrids;
            con.removeChildren();
            con.alpha = ALPHA_FOR_ATTACKABLE_GRIDS_NORMAL;

            const { width, height } = this._getActionPlanner().getMapSize();
            const images            = Twns.Helpers.createEmptyMap<TwnsUiImage.UiImage>(width, height);
            for (let x = 0; x < width; ++x) {
                for (let y = 0; y < height; ++y) {
                    const image     = new TwnsUiImage.UiImage(_ATTACKABLE_GRID_FRAMES[0]);
                    image.smoothing = false;
                    image.x         = x * _GRID_WIDTH;
                    image.y         = y * _GRID_HEIGHT;
                    image.visible   = false;
                    images[x][y]    = image;
                    con.addChild(image);
                }
            }
            this._imgsForAttackableGrids = images;
        }
        private _initConForMovePath(): void {
            this._conForMovePath.removeChildren();
        }
        private _initConForVisibleGrids(): void {
            const con = this._conForVisibleGrids;
            con.removeChildren();
            con.alpha = ALPHA_FOR_VISIBLE_GRIDS_NORMAL;

            const { width, height } = this._getActionPlanner().getMapSize();
            const images            = Twns.Helpers.createEmptyMap<TwnsUiImage.UiImage>(width, height);
            for (let x = 0; x < width; ++x) {
                for (let y = 0; y < height; ++y) {
                    const image     = new TwnsUiImage.UiImage(_VISIBLE_GRID_FRAMES[0]);
                    image.smoothing = false;
                    image.x         = x * _GRID_WIDTH;
                    image.y         = y * _GRID_HEIGHT;
                    image.visible   = false;
                    images[x][y]    = image;
                    con.addChild(image);
                }
            }
            this._imgsForVisibleGrids = images;
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Callbacks.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _onNotifyGridAnimationTick(): void {
            const tick                  = Twns.Timer.getGridAnimationTickCount();
            const sourceForMovable      = _MOVABLE_GRID_FRAMES[tick % _MOVABLE_GRID_FRAMES.length];
            const sourceForAttackable   = _ATTACKABLE_GRID_FRAMES[tick % _ATTACKABLE_GRID_FRAMES.length];
            const sourceForVisible      = _VISIBLE_GRID_FRAMES[tick % _VISIBLE_GRID_FRAMES.length];
            const imgsForMovable        = this._getImgsForMovableGrids();
            const imgsForAttackable     = this._getImgsForAttackableGrids();
            const imgsForVisible        = this._getImgsForVisibleGrids();
            const { width, height }     = this._getActionPlanner().getMapSize();
            for (let x = 0; x < width; ++x) {
                for (let y = 0; y < height; ++y) {
                    imgsForMovable[x][y].source     = sourceForMovable;
                    imgsForAttackable[x][y].source  = sourceForAttackable;
                    imgsForVisible[x][y].source     = sourceForVisible;
                }
            }
            this._getImgForMoveDestination().source = sourceForMovable;
        }

        private _onNotifyUnitAnimationTick(): void {
            for (const [, view] of this._focusUnitViews) {
                view.tickUnitAnimationFrame();
            }
        }

        private _onNotifyUnitStateIndicatorTick(): void {
            for (const [, view] of this._focusUnitViews) {
                view.tickStateAnimationFrame();
            }
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Functions for view.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        public updateView(): void {
            this._resetConForAttackableGrids();
            this._resetConForMovableGrids();
            this._resetConForVisibleGrids();
            this._resetConForMoveDestination();
            this._resetConForMovePath();
            this._resetConForUnits();
        }

        private _resetConForAttackableGrids(): void {
            const con           = this._conForAttackableGrids;
            const actionPlanner = this._getActionPlanner();
            const state         = actionPlanner.getState();

            if (state === State.Idle) {
                con.visible = false;

            } else if (state === State.ExecutingAction) {
                con.visible = false;

            } else if (state === State.MakingMovePath) {
                con.visible = true;
                con.alpha   = ALPHA_FOR_ATTACKABLE_GRIDS_NORMAL;

                const movableArea               = Twns.Helpers.getExisted(actionPlanner.getMovableArea());
                const attackableArea            = Twns.Helpers.getExisted(actionPlanner.getAttackableArea());
                const { width, height }         = actionPlanner.getMapSize();
                const imgsForAttackableGrids    = this._getImgsForAttackableGrids();
                for (let x = 0; x < width; ++x) {
                    for (let y = 0; y < height; ++y) {
                        const isMovable = (!!movableArea[x]) && (!!movableArea[x][y]);
                        imgsForAttackableGrids[x][y].visible = (!isMovable) && (!!attackableArea[x]) && (!!attackableArea[x][y]);
                    }
                }

            } else if (state === State.ChoosingAction) {
                con.visible = true;
                con.alpha   = ALPHA_FOR_ATTACKABLE_GRIDS_NORMAL;

                const movableArea               = Twns.Helpers.getExisted(actionPlanner.getMovableArea());
                const attackableArea            = Twns.Helpers.getExisted(actionPlanner.getAttackableArea());
                const { width, height }         = actionPlanner.getMapSize();
                const imgsForAttackableGrids    = this._getImgsForAttackableGrids();
                for (let x = 0; x < width; ++x) {
                    for (let y = 0; y < height; ++y) {
                        const isMovable = (!!movableArea[x]) && (!!movableArea[x][y]);
                        imgsForAttackableGrids[x][y].visible = (!isMovable) && (!!attackableArea[x]) && (!!attackableArea[x][y]);
                    }
                }

            } else if (state === State.ChoosingAttackTarget) {
                con.visible = true;
                con.alpha   = ALPHA_FOR_ATTACKABLE_GRIDS_NORMAL;

                const { width, height }         = actionPlanner.getMapSize();
                const imgsForAttackableGrids    = this._getImgsForAttackableGrids();
                for (let x = 0; x < width; ++x) {
                    for (let y = 0; y < height; ++y) {
                        imgsForAttackableGrids[x][y].visible = false;
                    }
                }
                for (const grid of Twns.Helpers.getExisted(actionPlanner.getAttackableGridsAfterMove())) {
                    imgsForAttackableGrids[grid.x][grid.y].visible = true;
                }

            } else if (state === State.ChoosingDropDestination) {
                con.visible = false;

            } else if (state === State.ChoosingFlareDestination) {
                con.visible = true;
                con.alpha   = ALPHA_FOR_ATTACKABLE_GRIDS_NORMAL;

                const { width, height } = actionPlanner.getMapSize();
                const imgs              = this._getImgsForAttackableGrids();
                const destination       = actionPlanner.getMovePathDestination();
                const range             = Twns.Helpers.getExisted(actionPlanner.getFocusUnit()?.getFlareMaxRange());
                for (let x = 0; x < width; ++x) {
                    for (let y = 0; y < height; ++y) {
                        imgs[x][y].visible = Twns.GridIndexHelpers.getDistance(destination, { x, y }) <= range;
                    }
                }

            } else if (state === State.ChoosingSiloDestination) {
                con.visible = true;
                con.alpha   = ALPHA_FOR_ATTACKABLE_GRIDS_SILO;

                const { width, height } = actionPlanner.getMapSize();
                const imgs              = this._getImgsForAttackableGrids();
                for (let x = 0; x < width; ++x) {
                    for (let y = 0; y < height; ++y) {
                        imgs[x][y].visible = true;
                    }
                }

            } else if (state === State.ChoosingProductionTarget) {
                con.visible = false;

            } else if (state === State.PreviewingUnitAttackableArea) {
                con.visible = true;
                con.alpha   = ALPHA_FOR_ATTACKABLE_GRIDS_NORMAL;

                const area              = actionPlanner.getAreaForPreviewingAttack();
                const { width, height } = actionPlanner.getMapSize();
                const imgs              = this._getImgsForAttackableGrids();
                for (let x = 0; x < width; ++x) {
                    for (let y = 0; y < height; ++y) {
                        imgs[x][y].visible = (!!area[x]) && (!!area[x][y]);
                    }
                }

            } else if (state === State.PreviewingUnitMovableArea) {
                con.visible = false;

            } else if (state === State.PreviewingUnitVisibleArea) {
                con.visible = false;

            } else if (state === State.PreviewingTileAttackableArea) {
                con.visible = true;
                con.alpha   = ALPHA_FOR_ATTACKABLE_GRIDS_NORMAL;

                const area              = actionPlanner.getAreaForPreviewingAttack();
                const { width, height } = actionPlanner.getMapSize();
                const imgs              = this._getImgsForAttackableGrids();
                for (let x = 0; x < width; ++x) {
                    for (let y = 0; y < height; ++y) {
                        imgs[x][y].visible = (!!area[x]) && (!!area[x][y]);
                    }
                }

            } else {
                // TODO
            }
        }

        private _resetConForMovableGrids(): void {
            const con           = this._conForMovableGrids;
            const actionPlanner = this._getActionPlanner();
            const state         = actionPlanner.getState();

            if (state === State.Idle) {
                con.visible = false;

            } else if (state === State.ExecutingAction) {
                con.visible = false;

            } else if (state === State.MakingMovePath) {
                con.visible = true;

                const movableArea       = Twns.Helpers.getExisted(actionPlanner.getMovableArea());
                const { width, height } = actionPlanner.getMapSize();
                const imgs              = this._getImgsForMovableGrids();
                for (let x = 0; x < width; ++x) {
                    for (let y = 0; y < height; ++y) {
                        imgs[x][y].visible = (!!movableArea[x]) && (!!movableArea[x][y]);
                    }
                }

            } else if (state === State.ChoosingAction) {
                con.visible = true;

                const movableArea       = Twns.Helpers.getExisted(actionPlanner.getMovableArea());
                const { width, height } = actionPlanner.getMapSize();
                const imgs              = this._getImgsForMovableGrids();
                for (let x = 0; x < width; ++x) {
                    for (let y = 0; y < height; ++y) {
                        imgs[x][y].visible = (!!movableArea[x]) && (!!movableArea[x][y]);
                    }
                }

            } else if (state === State.ChoosingAttackTarget) {
                con.visible = false;

            } else if (state === State.ChoosingDropDestination) {
                con.visible = true;

                const { width, height } = actionPlanner.getMapSize();
                const imgs              = this._getImgsForMovableGrids();
                for (let x = 0; x < width; ++x) {
                    for (let y = 0; y < height; ++y) {
                        imgs[x][y].visible = false;
                    }
                }
                for (const grid of Twns.Helpers.getExisted(actionPlanner.getAvailableDropDestinations())) {
                    imgs[grid.x][grid.y].visible = true;
                }

            } else if (state === State.ChoosingFlareDestination) {
                con.visible = false;

            } else if (state === State.ChoosingSiloDestination) {
                con.visible = false;

            } else if (state === State.ChoosingProductionTarget) {
                con.visible = false;

            } else if (state === State.PreviewingUnitAttackableArea) {
                con.visible = false;

            } else if (state === State.PreviewingUnitMovableArea) {
                con.visible = true;

                const area              = Twns.Helpers.getExisted(actionPlanner.getAreaForPreviewingMove());
                const { width, height } = actionPlanner.getMapSize();
                const imgs              = this._getImgsForMovableGrids();
                for (let x = 0; x < width; ++x) {
                    for (let y = 0; y < height; ++y) {
                        imgs[x][y].visible = (!!area[x]) && (!!area[x][y]);
                    }
                }

            } else if (state === State.PreviewingUnitVisibleArea) {
                con.visible = false;

            } else if (state === State.PreviewingTileAttackableArea) {
                con.visible = false;

            } else {
                // TODO
            }
        }

        private _resetConForVisibleGrids(): void {
            const con           = this._conForVisibleGrids;
            const actionPlanner = this._getActionPlanner();
            const state         = actionPlanner.getState();

            if (state === State.Idle) {
                con.visible = false;

            } else if (state === State.ExecutingAction) {
                con.visible = false;

            } else if (state === State.MakingMovePath) {
                con.visible = false;

            } else if (state === State.ChoosingAction) {
                con.visible = false;

            } else if (state === State.ChoosingAttackTarget) {
                con.visible = false;

            } else if (state === State.ChoosingDropDestination) {
                con.visible = false;

            } else if (state === State.ChoosingFlareDestination) {
                con.visible = false;

            } else if (state === State.ChoosingSiloDestination) {
                con.visible = false;

            } else if (state === State.ChoosingProductionTarget) {
                con.visible = false;

            } else if (state === State.PreviewingUnitAttackableArea) {
                con.visible = false;

            } else if (state === State.PreviewingUnitMovableArea) {
                con.visible = false;

            } else if (state === State.PreviewingUnitVisibleArea) {
                con.visible = true;

                const { width, height } = actionPlanner.getMapSize();
                const imgs              = this._getImgsForVisibleGrids();
                for (let x = 0; x < width; ++x) {
                    for (let y = 0; y < height; ++y) {
                        imgs[x][y].visible = false;
                    }
                }
                for (const gridIndex of Twns.Helpers.getExisted(actionPlanner.getAreaForPreviewingVisible())) {
                    imgs[gridIndex.x][gridIndex.y].visible = true;
                }

            } else if (state === State.PreviewingTileAttackableArea) {
                con.visible = false;

            } else {
                // TODO
            }
        }

        private _resetConForMoveDestination(): void {
            const con           = this._conForMoveDestination;
            const actionPlanner = this._getActionPlanner();
            const state         = actionPlanner.getState();
            // TODO
            con.visible = false;
        }

        private _resetConForMovePath(): void {
            const con           = this._conForMovePath;
            const actionPlanner = this._getActionPlanner();
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

            } else if (state === State.PreviewingUnitAttackableArea) {
                con.removeChildren();
                con.visible = false;

            } else if (state === State.PreviewingUnitMovableArea) {
                con.removeChildren();
                con.visible = false;

            } else if (state === State.PreviewingUnitVisibleArea) {
                con.removeChildren();
                con.visible = false;

            } else if (state === State.PreviewingTileAttackableArea) {
                con.removeChildren();
                con.visible = false;

            } else {
                // Nothing to do.
            }
        }

        private _resetConForUnits(): void {
            const con           = this._conForUnits;
            const views         = this._focusUnitViews;
            const actionPlanner = this._getActionPlanner();
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

                const unitOnMap     = Twns.Helpers.getExisted(actionPlanner.getFocusUnitOnMap());
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

                const unitOnMap     = Twns.Helpers.getExisted(actionPlanner.getFocusUnitOnMap());
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

                const unitOnMap     = Twns.Helpers.getExisted(actionPlanner.getFocusUnitOnMap());
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

                const focusUnitOnMap    = Twns.Helpers.getExisted(actionPlanner.getFocusUnitOnMap());
                const focusUnitLoaded   = actionPlanner.getFocusUnitLoaded();
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

                const cursorGridIndex = actionPlanner.getCursor().getGridIndex();
                if (actionPlanner.getAvailableDropDestinations()?.some(grid => Twns.GridIndexHelpers.checkIsEqual(grid, cursorGridIndex))) {
                    this._addUnitView(Twns.Helpers.getExisted(actionPlanner.getChoosingUnitForDrop()), cursorGridIndex);
                }

            } else if (state === State.ChoosingFlareDestination) {
                con.removeChildren();
                views.clear();
                con.visible = true;

                const unitOnMap     = Twns.Helpers.getExisted(actionPlanner.getFocusUnitOnMap());
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

                const unitOnMap     = Twns.Helpers.getExisted(actionPlanner.getFocusUnitOnMap());
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

            } else if (state === State.PreviewingUnitAttackableArea) {
                con.removeChildren();
                views.clear();
                con.visible = true;

                for (const [, unit] of actionPlanner.getUnitsForPreviewingAttackableArea()) {
                    this._addUnitView(unit, unit.getGridIndex());
                }

            } else if (state === State.PreviewingUnitMovableArea) {
                con.removeChildren();
                views.clear();
                con.visible = true;

                const unit = Twns.Helpers.getExisted(actionPlanner.getUnitForPreviewingMovableArea());
                this._addUnitView(unit, unit.getGridIndex());

            } else if (state === State.PreviewingUnitVisibleArea) {
                con.removeChildren();
                views.clear();
                con.visible = true;

                const unit = Twns.Helpers.getExisted(actionPlanner.getUnitForPreviewingVisibleArea());
                this._addUnitView(unit, unit.getGridIndex());

            } else if (state === State.PreviewingTileAttackableArea) {
                con.removeChildren();
                views.clear();
                con.visible = false;

            } else {
                // TODO
            }
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Other functions.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _addUnitView(unit: Twns.BaseWar.BwUnit, gridIndex: GridIndex, alpha = 1): void {
            const view = new Twns.BaseWar.BwUnitView().init(unit).startRunningView();
            // view.alpha = alpha;
            _resetUnitViewXy(view, gridIndex);
            view.showUnitAnimation(Twns.Types.UnitAnimationType.Move);
            this._focusUnitViews.set(unit.getUnitId(), view);
            this._conForUnits.addChild(view);
        }

        private _addMovePathView(): void {
            const con   = this._conForMovePath;
            const path  = this._getActionPlanner().getMovePath();
            for (let i = 0; i < path.length; ++i) {
                const img = _createImgForMovePathGrid(path[i - 1], path[i], path[i + 1]);
                img && con.addChild(img);
            }
        }
    }

    function _createImgForMovePathGrid(prev: GridIndex, curr: GridIndex, next: GridIndex): TwnsUiImage.UiImage | null {
        const source = Twns.Helpers.getExisted(_PATH_GRID_SOURCES.get(Twns.GridIndexHelpers.getAdjacentDirection(prev, curr))).get(Twns.GridIndexHelpers.getAdjacentDirection(next, curr));
        if (!source) {
            return null;
        } else {
            const image     = new TwnsUiImage.UiImage(source);
            image.smoothing = false;
            image.x         = curr.x * _GRID_WIDTH;
            image.y         = curr.y * _GRID_HEIGHT;
            return image;
        }
    }

    function _resetUnitViewXy(view: Twns.BaseWar.BwUnitView, gridIndex: GridIndex): void {
        view.x  = gridIndex.x * _GRID_WIDTH;
        view.y  = gridIndex.y * _GRID_HEIGHT;
    }
}

// export default TwnsBwActionPlannerView;
