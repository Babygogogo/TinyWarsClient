
// import TwnsUiImage          from "../../tools/ui/UiImage";
// import CommonConstants      from "../../tools/helpers/CommonConstants";
// import GridIndexHelpers     from "../../tools/helpers/GridIndexHelpers";
// import Helpers              from "../../tools/helpers/Helpers";
// import NotifyData           from "../../tools/notify/NotifyData";
// import Notify               from "../../tools/notify/Notify";
// import Twns.Notify       from "../../tools/notify/NotifyType";
// import Types                from "../../tools/helpers/Types";
// import TwnsBwCursor         from "../model/BwCursor";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.BaseWar {
    import GridIndex            = Twns.Types.GridIndex;
    import ActionPlannerState   = Twns.Types.ActionPlannerState;
    import NotifyType           = Twns.Notify.NotifyType;

    const { width: _GRID_WIDTH, height: _GRID_HEIGHT } = CommonConstants.GridSize;
    const _PULSE_IN_DURATION                    = 150;
    const _PULSE_OUT_DURATION                   = 150;
    const _PULSE_INTERVAL_DURATION              = 300;
    const _TARGET_FRAME_DURATION                = 100;
    const _DRAG_FIELD_SQUARED_TRIGGER_DISTANCE  = 400;
    const _IMG_SOURCE_FOR_NORMAL_CORNER         = "c04_t03_s01_f01";
    const _IMG_SOURCES_FOR_TARGET               = [
        `c04_t03_s02_f01`,
        `c04_t03_s02_f02`,
        `c04_t03_s02_f03`,
        `c04_t03_s02_f04`,
    ];

    const OUT_LENGTH                    = _GRID_WIDTH / 6;
    const IN_LENGTH                     = _GRID_WIDTH / 9;
    const _UPPER_LEFT_CORNER_OUTER_X    = -OUT_LENGTH;
    const _UPPER_LEFT_CORNER_OUTER_Y    = -OUT_LENGTH;
    const _UPPER_LEFT_CORNER_INNER_X    = IN_LENGTH;
    const _UPPER_LEFT_CORNER_INNER_Y    = IN_LENGTH;
    const _UPPER_RIGHT_CORNER_OUTER_X   = _GRID_WIDTH + OUT_LENGTH;
    const _UPPER_RIGHT_CORNER_OUTER_Y   = -OUT_LENGTH;
    const _UPPER_RIGHT_CORNER_INNER_X   = _GRID_WIDTH - IN_LENGTH;
    const _UPPER_RIGHT_CORNER_INNER_Y   = IN_LENGTH;
    const _LOWER_LEFT_CORNER_OUTER_X    = -OUT_LENGTH;
    const _LOWER_LEFT_CORNER_OUTER_Y    = _GRID_HEIGHT + OUT_LENGTH;
    const _LOWER_LEFT_CORNER_INNER_X    = IN_LENGTH;
    const _LOWER_LEFT_CORNER_INNER_Y    = _GRID_HEIGHT - IN_LENGTH;
    const _LOWER_RIGHT_CORNER_OUTER_X   = _GRID_WIDTH  + OUT_LENGTH;
    const _LOWER_RIGHT_CORNER_OUTER_Y   = _GRID_HEIGHT + OUT_LENGTH;
    const _LOWER_RIGHT_CORNER_INNER_X   = _GRID_WIDTH  - IN_LENGTH;
    const _LOWER_RIGHT_CORNER_INNER_Y   = _GRID_HEIGHT - IN_LENGTH;

    export class BwCursorView extends eui.Group {
        private _cursor?                : BwCursor;
        private _frameIndexForImgTarget = 0;

        private _currGlobalTouchPoints      = new Map<number, Twns.Types.Point>();
        private _prevGlobalTouchPoints      = new Map<number, Twns.Types.Point>();
        private _touchIdForTouchingCursor   : number | null = null;
        private _initialGlobalTouchPoint?   : Twns.Types.Point;
        private _isTouchMovedOrMultiple?    : boolean;

        private _conForAll              = new egret.DisplayObjectContainer();
        private _conForNormal           = new egret.DisplayObjectContainer();
        private _conForTarget           = new egret.DisplayObjectContainer();
        private _conForSiloArea         = new egret.DisplayObjectContainer();
        private _imgUpperLeftCorner     = new TwnsUiImage.UiImage(_IMG_SOURCE_FOR_NORMAL_CORNER);
        private _imgUpperRightCorner    = new TwnsUiImage.UiImage(_IMG_SOURCE_FOR_NORMAL_CORNER);
        private _imgLowerLeftCorner     = new TwnsUiImage.UiImage(_IMG_SOURCE_FOR_NORMAL_CORNER);
        private _imgLowerRightCorner    = new TwnsUiImage.UiImage(_IMG_SOURCE_FOR_NORMAL_CORNER);
        private _imgTarget              = new TwnsUiImage.UiImage(_IMG_SOURCES_FOR_TARGET[this._frameIndexForImgTarget]);
        private _imgSiloArea            = new TwnsUiImage.UiImage(`c04_t03_s03_f01`);

        public constructor() {
            super();

            this.addChild(this._conForAll);
            this._initConForNormal();
            this._initConForTarget();
            this._initConForSiloArea();
        }

        public init(cursor: BwCursor): void {
            this._cursor    = cursor;

            const mapSize   = cursor.getMapSize();
            this.width      = mapSize.width * _GRID_WIDTH;
            this.height     = mapSize.height * _GRID_HEIGHT;
        }
        public fastInit(cursor: BwCursor): void {
            this._cursor = cursor;
        }

        public startRunningView(): void {
            Twns.Notify.addEventListener(NotifyType.ZoomableContentsMoved, this._onNotifyZoomableContentsMoved, this);
            this.addEventListener(egret.TouchEvent.TOUCH_BEGIN,             this._onTouchBegin,             this);
            this.addEventListener(egret.TouchEvent.TOUCH_CANCEL,            this._onTouchCancel,            this);
            this.addEventListener(egret.TouchEvent.TOUCH_END,               this._onTouchEnd,               this);
            this.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE,   this._onTouchReleaseOutside,    this);

            this.updateView();

            this._startNormalAnimation();
            this._startTargetAnimation();
        }
        public stopRunningView(): void {
            this._stopNormalAnimation();
            this._stopTargetAnimation();

            Twns.Notify.removeEventListener(NotifyType.ZoomableContentsMoved, this._onNotifyZoomableContentsMoved, this);
            this.removeEventListener(egret.TouchEvent.TOUCH_BEGIN,              this._onTouchBegin,             this);
            this.removeEventListener(egret.TouchEvent.TOUCH_CANCEL,             this._onTouchCancel,            this);
            this.removeEventListener(egret.TouchEvent.TOUCH_END,                this._onTouchEnd,               this);
            this.removeEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE,    this._onTouchReleaseOutside,    this);
            this.removeEventListener(egret.TouchEvent.TOUCH_MOVE,               this._onTouchMove,              this);
            this._currGlobalTouchPoints.clear();
            this._prevGlobalTouchPoints.clear();
            this._touchIdForTouchingCursor = null;
            delete this._initialGlobalTouchPoint;
            delete this._isTouchMovedOrMultiple;
        }

        public updateView(): void {
            this._updatePos();
            this._updateConForNormal();
            this._updateConForTarget();
            this._updateConForSiloArea();
        }

        public setVisibleForConForNormal(visible: boolean): void {
            this._conForNormal.visible = visible;
        }
        public setVisibleForConForTarget(visible: boolean): void {
            this._conForTarget.visible = visible;
        }
        public setVisibleForConForSiloArea(visible: boolean): void {
            this._conForSiloArea.visible = visible;
        }

        private _getCursor(): BwCursor {
            return Twns.Helpers.getExisted(this._cursor);
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Callbacks.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _onNotifyZoomableContentsMoved(): void {
            const touchPoints = this._currGlobalTouchPoints;
            if ((this._touchIdForTouchingCursor != null) && (touchPoints.size === 1)) {
                const point         = touchPoints.values().next().value as Twns.Types.Point;
                const gridIndex     = this._getGridIndexByGlobalXY(point.x, point.y);
                const currGridIndex = this._getCursor().getGridIndex();
                if (!GridIndexHelpers.checkIsEqual(gridIndex, currGridIndex)) {
                    this._isTouchMovedOrMultiple = true;
                    Twns.Notify.dispatch(NotifyType.BwCursorDragged, {
                        current     : currGridIndex,
                        draggedTo   : gridIndex,
                    } as Twns.Notify.NotifyData.BwCursorDragged);
                }
            }
        }

        private _onTouchBegin(e: egret.TouchEvent): void {
            const touchId   = e.touchPointID;
            if (this._currGlobalTouchPoints.size <= 0) {
                this.addEventListener(egret.TouchEvent.TOUCH_MOVE, this._onTouchMove, this);
                this._initialGlobalTouchPoint   = { x: e.stageX, y: e.stageY };
                this._isTouchMovedOrMultiple    = false;
                this._touchIdForTouchingCursor  = GridIndexHelpers.checkIsEqual(this._getCursor().getGridIndex(), this._getGridIndexByLocalXY(e.localX, e.localY))
                    ? touchId
                    : null;
            }

            if (this._currGlobalTouchPoints.size <= 1) {
                this._currGlobalTouchPoints.set(touchId, { x: e.stageX, y: e.stageY });
                this._prevGlobalTouchPoints.set(touchId, { x: e.stageX, y: e.stageY });
            }
            if (this._currGlobalTouchPoints.size >= 2) {
                this._isTouchMovedOrMultiple = true;
            }
        }
        private _onTouchEnd(e: egret.TouchEvent): void {
            this._removeTouch(e.touchPointID);
        }
        private _onTouchCancel(e: egret.TouchEvent): void {
            this._removeTouch(e.touchPointID);
        }
        private _onTouchReleaseOutside(e: egret.TouchEvent): void {
            this._removeTouch(e.touchPointID);
        }
        private _onTouchMove(e: egret.TouchEvent): void {
            const touchId               = e.touchPointID;
            const currGlobalTouchPoints = this._currGlobalTouchPoints;
            if (currGlobalTouchPoints.has(touchId)) {
                const initialGlobalTouchPoint   = Twns.Helpers.getExisted(this._initialGlobalTouchPoint);
                this._isTouchMovedOrMultiple    = (this._isTouchMovedOrMultiple)
                    || (Twns.Helpers.getSquaredPointDistance(e.stageX, e.stageY, initialGlobalTouchPoint.x, initialGlobalTouchPoint.y) > _DRAG_FIELD_SQUARED_TRIGGER_DISTANCE);
                currGlobalTouchPoints.set(touchId, { x: e.stageX, y: e.stageY });

                if (currGlobalTouchPoints.size > 1) {
                    Twns.Notify.dispatch(NotifyType.BwFieldZoomed, {
                        current : currGlobalTouchPoints,
                        previous: this._prevGlobalTouchPoints,
                    } as Twns.Notify.NotifyData.BwFieldZoomed);
                } else {
                    if (this._touchIdForTouchingCursor != null) {
                        const gridIndex     = this._getGridIndexByLocalXY(e.localX, e.localY);
                        const currGridIndex = this._getCursor().getGridIndex();
                        if (!GridIndexHelpers.checkIsEqual(gridIndex, currGridIndex)) {
                            this._isTouchMovedOrMultiple = true;
                            Twns.Notify.dispatch(NotifyType.BwCursorDragged, {
                                current     : currGridIndex,
                                draggedTo   : gridIndex,
                            } as Twns.Notify.NotifyData.BwCursorDragged);
                        }
                    } else {
                        if (this._isTouchMovedOrMultiple) {
                            Twns.Notify.dispatch(NotifyType.BwFieldDragged, {
                                current : currGlobalTouchPoints.values().next().value,
                                previous: this._prevGlobalTouchPoints.values().next().value,
                            } as Twns.Notify.NotifyData.BwFieldDragged);
                        }
                    }
                }

                this._prevGlobalTouchPoints.set(touchId, { x: e.stageX, y: e.stageY });
            }
        }
        private _removeTouch(touchId: number): void {
            this._prevGlobalTouchPoints.delete(touchId);

            const currGlobalTouchPoints = this._currGlobalTouchPoints;
            if (currGlobalTouchPoints.has(touchId)) {
                currGlobalTouchPoints.delete(touchId);

                const touchIdForTouchingCursor = this._touchIdForTouchingCursor;
                if ((touchIdForTouchingCursor != null) && (!currGlobalTouchPoints.has(touchIdForTouchingCursor))) {
                    this._touchIdForTouchingCursor = null;
                }
                if (!currGlobalTouchPoints.size) {
                    this.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this._onTouchMove, this);
                    if (!this._isTouchMovedOrMultiple) {
                        const initialGlobalTouchPoint = Twns.Helpers.getExisted(this._initialGlobalTouchPoint);
                        Twns.Notify.dispatch(NotifyType.BwCursorTapped, {
                            current : this._getCursor().getGridIndex(),
                            tappedOn: this._getGridIndexByGlobalXY(initialGlobalTouchPoint.x, initialGlobalTouchPoint.y),
                        } as Twns.Notify.NotifyData.BwCursorTapped);
                    } else {
                        if (touchIdForTouchingCursor != null) {
                            Twns.Notify.dispatch(NotifyType.BwCursorDragEnded);
                        }
                    }
                    delete this._initialGlobalTouchPoint;
                }
            }
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Functions for view.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _updatePos(): void {
            const cursor        = this._getCursor();
            this._conForAll.x   = cursor.getGridX() * _GRID_WIDTH;
            this._conForAll.y   = cursor.getGridY() * _GRID_HEIGHT;
        }

        private _updateConForNormal(): void {
            const cursor        = this._getCursor();
            const actionPlanner = cursor.getWar().getActionPlanner();
            const gridIndex     = cursor.getGridIndex();
            const state         = actionPlanner.getState();
            const con           = this._conForNormal;

            if (state === ActionPlannerState.Idle) {
                con.visible = true;

            } else if (state === ActionPlannerState.ExecutingAction) {
                con.visible = true;

            } else if (state === ActionPlannerState.MakingMovePath) {
                con.visible = !actionPlanner.getFocusUnit()?.checkCanAttackTargetAfterMovePath(actionPlanner.getMovePath(), gridIndex);

            } else if (state === ActionPlannerState.ChoosingAction) {
                con.visible = true;

            } else if (state === ActionPlannerState.ChoosingAttackTarget) {
                con.visible = !actionPlanner.checkHasAttackableGridAfterMove(gridIndex);

            } else if (state === ActionPlannerState.ChoosingDropDestination) {
                con.visible = true;

            } else if (state === ActionPlannerState.ChoosingFlareDestination) {
                con.visible = false;

            } else if (state === ActionPlannerState.ChoosingSiloDestination) {
                con.visible = false;

            } else if (state === ActionPlannerState.ChoosingProductionTarget) {
                con.visible = true;

            } else if (state === ActionPlannerState.PreviewingUnitAttackableArea) {
                con.visible = true;

            } else if (state === ActionPlannerState.PreviewingUnitMovableArea) {
                con.visible = true;

            } else if (state === ActionPlannerState.PreviewingUnitVisibleArea) {
                con.visible = true;

            } else if (state === ActionPlannerState.PreviewingTileAttackableArea) {
                con.visible = true;

            } else {
                // TODO
            }
        }
        private _updateConForTarget(): void {
            const cursor        = this._getCursor();
            const actionPlanner = cursor.getWar().getActionPlanner();
            const con           = this._conForTarget;
            const gridIndex     = cursor.getGridIndex();
            const state         = actionPlanner.getState();

            if (state === ActionPlannerState.Idle) {
                con.visible = false;

            } else if (state === ActionPlannerState.ExecutingAction) {
                con.visible = false;

            } else if (state === ActionPlannerState.MakingMovePath) {
                con.visible = !!actionPlanner.getFocusUnit()?.checkCanAttackTargetAfterMovePath(actionPlanner.getMovePath(), gridIndex);

            } else if (state === ActionPlannerState.ChoosingAction) {
                con.visible = false;

            } else if (state === ActionPlannerState.ChoosingAttackTarget) {
                con.visible = actionPlanner.checkHasAttackableGridAfterMove(gridIndex);

            } else if (state === ActionPlannerState.ChoosingDropDestination) {
                con.visible = false;

            } else if (state === ActionPlannerState.ChoosingFlareDestination) {
                con.visible = true;

            } else if (state === ActionPlannerState.ChoosingSiloDestination) {
                con.visible = true;

            } else if (state === ActionPlannerState.ChoosingProductionTarget) {
                con.visible = false;

            } else if (state === ActionPlannerState.PreviewingUnitAttackableArea) {
                con.visible = false;

            } else if (state === ActionPlannerState.PreviewingUnitMovableArea) {
                con.visible = false;

            } else if (state === ActionPlannerState.PreviewingUnitVisibleArea) {
                con.visible = false;

            } else if (state === ActionPlannerState.PreviewingTileAttackableArea) {
                con.visible = false;

            } else {
                // TODO
            }
        }
        private _updateConForSiloArea(): void {
            const actionPlanner = this._getCursor().getWar().getActionPlanner();
            const con           = this._conForSiloArea;
            const state         = actionPlanner.getState();

            if (state === ActionPlannerState.Idle) {
                con.visible = false;

            } else if (state === ActionPlannerState.ExecutingAction) {
                con.visible = false;

            } else if (state === ActionPlannerState.MakingMovePath) {
                con.visible = false;

            } else if (state === ActionPlannerState.ChoosingAction) {
                con.visible = false;

            } else if (state === ActionPlannerState.ChoosingAttackTarget) {
                con.visible = false;

            } else if (state === ActionPlannerState.ChoosingDropDestination) {
                con.visible = false;

            } else if (state === ActionPlannerState.ChoosingFlareDestination) {
                con.visible = true;

            } else if (state === ActionPlannerState.ChoosingSiloDestination) {
                con.visible = true;

            } else if (state === ActionPlannerState.ChoosingProductionTarget) {
                con.visible = false;

            } else if (state === ActionPlannerState.PreviewingUnitAttackableArea) {
                con.visible = false;

            } else if (state === ActionPlannerState.PreviewingUnitMovableArea) {
                con.visible = false;

            } else if (state === ActionPlannerState.PreviewingUnitVisibleArea) {
                con.visible = false;

            } else if (state === ActionPlannerState.PreviewingTileAttackableArea) {
                con.visible = false;

            } else {
                // TODO
            }
        }

        private _initConForNormal(): void {
            {
                const img       = this._imgUpperLeftCorner;
                img.smoothing   = false;
                img.x           = _UPPER_LEFT_CORNER_OUTER_X;
                img.y           = _UPPER_LEFT_CORNER_OUTER_Y;
                this._conForNormal.addChild(img);
            }

            {
                const img       = this._imgUpperRightCorner;
                img.smoothing   = false;
                img.x           = _UPPER_RIGHT_CORNER_OUTER_X;
                img.y           = _UPPER_RIGHT_CORNER_OUTER_Y;
                img.rotation    = 90;
                this._conForNormal.addChild(img);
            }

            {
                const img       = this._imgLowerLeftCorner;
                img.smoothing   = false;
                img.x           = _LOWER_LEFT_CORNER_OUTER_X;
                img.y           = _LOWER_LEFT_CORNER_OUTER_Y;
                img.rotation    = -90;
                this._conForNormal.addChild(img);
            }

            {
                const img       = this._imgLowerRightCorner;
                img.smoothing   = false;
                img.x           = _LOWER_RIGHT_CORNER_OUTER_X;
                img.y           = _LOWER_RIGHT_CORNER_OUTER_Y;
                img.rotation    = 180;
                this._conForNormal.addChild(img);
            }

            this._conForAll.addChild(this._conForNormal);
        }
        private _initConForTarget(): void {
            const img       = this._imgTarget;
            img.smoothing   = false;
            img.x           = -_GRID_WIDTH;
            img.y           = -_GRID_HEIGHT;
            this._conForTarget.addChild(img);

            this._conForAll.addChild(this._conForTarget);
        }
        private _initConForSiloArea(): void {
            const img       = this._imgSiloArea;
            img.smoothing   = false;
            img.x           = -_GRID_WIDTH * 2;
            img.y           = -_GRID_HEIGHT * 2;
            this._conForSiloArea.addChild(img);

            this._conForAll.addChild(this._conForSiloArea);
        }

        private _startNormalAnimation(): void {
            this._stopNormalAnimation();

            egret.Tween.get(this._imgUpperLeftCorner, { loop: true })
                .set({ x: _UPPER_LEFT_CORNER_OUTER_X, y: _UPPER_LEFT_CORNER_OUTER_Y })
                .to({ x: _UPPER_LEFT_CORNER_INNER_X, y: _UPPER_LEFT_CORNER_INNER_Y }, _PULSE_IN_DURATION)
                .to({ x: _UPPER_LEFT_CORNER_OUTER_X, y: _UPPER_LEFT_CORNER_OUTER_Y }, _PULSE_OUT_DURATION)
                .wait(_PULSE_INTERVAL_DURATION);

            egret.Tween.get(this._imgUpperRightCorner, { loop: true })
                .set({ x: _UPPER_RIGHT_CORNER_OUTER_X, y: _UPPER_RIGHT_CORNER_OUTER_Y })
                .to({ x: _UPPER_RIGHT_CORNER_INNER_X, y: _UPPER_RIGHT_CORNER_INNER_Y }, _PULSE_IN_DURATION)
                .to({ x: _UPPER_RIGHT_CORNER_OUTER_X, y: _UPPER_RIGHT_CORNER_OUTER_Y }, _PULSE_OUT_DURATION)
                .wait(_PULSE_INTERVAL_DURATION);

            egret.Tween.get(this._imgLowerLeftCorner, { loop: true })
                .set({ x: _LOWER_LEFT_CORNER_OUTER_X, y: _LOWER_LEFT_CORNER_OUTER_Y })
                .to({ x: _LOWER_LEFT_CORNER_INNER_X, y: _LOWER_LEFT_CORNER_INNER_Y }, _PULSE_IN_DURATION)
                .to({ x: _LOWER_LEFT_CORNER_OUTER_X, y: _LOWER_LEFT_CORNER_OUTER_Y }, _PULSE_OUT_DURATION)
                .wait(_PULSE_INTERVAL_DURATION);

            egret.Tween.get(this._imgLowerRightCorner, { loop: true })
                .set({ x: _LOWER_RIGHT_CORNER_OUTER_X, y: _LOWER_RIGHT_CORNER_OUTER_Y })
                .to({ x: _LOWER_RIGHT_CORNER_INNER_X, y: _LOWER_RIGHT_CORNER_INNER_Y }, _PULSE_IN_DURATION)
                .to({ x: _LOWER_RIGHT_CORNER_OUTER_X, y: _LOWER_RIGHT_CORNER_OUTER_Y }, _PULSE_OUT_DURATION)
                .wait(_PULSE_INTERVAL_DURATION);
        }
        private _stopNormalAnimation(): void {
            egret.Tween.removeTweens(this._imgUpperLeftCorner);
            egret.Tween.removeTweens(this._imgUpperRightCorner);
            egret.Tween.removeTweens(this._imgLowerLeftCorner);
            egret.Tween.removeTweens(this._imgLowerRightCorner);
        }

        private _startTargetAnimation(): void {
            this._stopTargetAnimation();

            const totalFramesCount = _IMG_SOURCES_FOR_TARGET.length;
            egret.Tween.get(this._imgTarget, { loop: true })
                .wait(_TARGET_FRAME_DURATION)
                .call(() => {
                    ++this._frameIndexForImgTarget;
                    (this._frameIndexForImgTarget >= totalFramesCount) && (this._frameIndexForImgTarget = 0);
                    this._imgTarget.source = _IMG_SOURCES_FOR_TARGET[this._frameIndexForImgTarget];
                });
        }
        private _stopTargetAnimation(): void {
            this._frameIndexForImgTarget = 0;
            egret.Tween.removeTweens(this._imgTarget);
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Utils.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _getGridXByLocalX(localX: number): number {
            let gridX = Math.floor(localX / _GRID_WIDTH);
            gridX = Math.max(gridX, 0);
            gridX = Math.min(gridX, this._getCursor().getMapSize().width - 1);
            return gridX;
        }
        private _getGridYByLocalY(localY: number): number {
            let gridY = Math.floor(localY / _GRID_HEIGHT);
            gridY = Math.max(gridY, 0);
            gridY = Math.min(gridY, this._getCursor().getMapSize().height - 1);
            return gridY;
        }
        private _getGridIndexByLocalXY(localX: number, localY: number): GridIndex {
            return { x: this._getGridXByLocalX(localX), y: this._getGridYByLocalY(localY) };
        }
        private _getGridIndexByGlobalXY(globalX: number, globalY: number): GridIndex {
            const point = this.globalToLocal(globalX, globalY);
            return this._getGridIndexByLocalXY(point.x, point.y);
        }
    }
}

// export default TwnsBwCursorView;
