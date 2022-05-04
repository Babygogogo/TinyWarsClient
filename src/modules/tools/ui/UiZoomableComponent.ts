
// import TwnsUiComponent      from "./UiComponent";
// import TwnsUiImage          from "./UiImage";
// import Helpers              from "../helpers/Helpers";
// import Notify               from "../notify/Notify";
// import Twns.Notify       from "../notify/NotifyType";
// import StageManager         from "../helpers/StageManager";
// import Types                from "../helpers/Types";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace TwnsUiZoomableComponent {
    import NotifyType           = Twns.Notify.NotifyType;
    import Point                = Twns.Types.Point;
    import TouchPoints          = Twns.Types.TouchPoints;

    const MAX_CONTENT_SCALE     = 6;

    export class UiZoomableComponent extends TwnsUiComponent.UiComponent {
        private _maskForContents                : TwnsUiImage.UiImage | null = null;

        private _contents                       = new egret.DisplayObjectContainer();
        private _contentWidth                   = 0;
        private _contentHeight                  = 0;
        private _spacingForTop                  = 0;
        private _spacingForBottom               = 0;
        private _spacingForLeft                 = 0;
        private _spacingForRight                = 0;
        private _isTouchListenerEnabled         = false;
        private _currGlobalTouchPoints          = new Map<number, Point>();
        private _prevGlobalTouchPoints          = new Map<number, Point>();

        public constructor() {
            super();

            this.addChild(this._contents);

            this.dispatchEventWith(egret.Event.COMPLETE);
        }

        protected _onOpened(): void {
            this._setUiListenerArray([
                { ui: this, callback: this._onResize, eventType: egret.Event.RESIZE },
            ]);
        }
        protected async _onClosed(): Promise<void> {
            this.setMouseWheelListenerEnabled(false);
            this.setTouchListenerEnabled(false);
        }

        public setMaskEnabled(enabled: boolean): void {
            if (enabled) {
                if (!this._maskForContents) {
                    const mask  = new TwnsUiImage.UiImage("uncompressedColorPink0000");
                    mask.left   = 0;
                    mask.right  = 0;
                    mask.top    = 0;
                    mask.bottom = 0;

                    this._maskForContents = mask;
                    this._contents.mask   = mask;
                    this.addChildAt(mask, 0);
                }
            } else {
                if (this._maskForContents) {
                    (this._contents.mask as any) = null;
                    this.removeChild(this._maskForContents);
                    this._maskForContents = null;
                }
            }
        }

        public setMouseWheelListenerEnabled(enabled: boolean): void {
            if (enabled) {
                Twns.Notify.addEventListener(NotifyType.MouseWheel, this._onNotifyMouseWheel, this);
            } else {
                Twns.Notify.removeEventListener(NotifyType.MouseWheel, this._onNotifyMouseWheel, this);
            }
        }

        public setTouchListenerEnabled(enabled: boolean): void {
            if ((enabled) && (!this._isTouchListenerEnabled)) {
                this.addEventListener(egret.TouchEvent.TOUCH_BEGIN,             this._onTouchBegin,             this);
                this.addEventListener(egret.TouchEvent.TOUCH_CANCEL,            this._onTouchCancel,            this);
                this.addEventListener(egret.TouchEvent.TOUCH_END,               this._onTouchEnd,               this);
                this.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE,   this._onTouchReleaseOutside,    this);

            } else if ((!enabled) && (this._isTouchListenerEnabled)) {
                this.removeEventListener(egret.TouchEvent.TOUCH_BEGIN,              this._onTouchBegin,             this);
                this.removeEventListener(egret.TouchEvent.TOUCH_CANCEL,             this._onTouchCancel,            this);
                this.removeEventListener(egret.TouchEvent.TOUCH_END,                this._onTouchEnd,               this);
                this.removeEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE,    this._onTouchReleaseOutside,    this);
                this.removeEventListener(egret.TouchEvent.TOUCH_MOVE,               this._onTouchMove,              this);
                this._currGlobalTouchPoints.clear();
                this._prevGlobalTouchPoints.clear();
            }
        }

        public addContent(content: egret.DisplayObject): void {
            this._contents.addChild(content);
        }
        public removeContent(content: egret.DisplayObject): void {
            this._contents.removeChild(content);
        }
        public removeAllContents(): void {
            this._contents.removeChildren();
        }
        public getContents(): egret.DisplayObjectContainer {
            return this._contents;
        }

        public setContentWidth(width: number): void {
            this._contentWidth = width;

            this._reviseContentScaleAndPosition();
        }
        public getContentWidth(): number {
            return this._contentWidth;
        }
        public setContentHeight(height: number): void {
            this._contentHeight = height;

            this._reviseContentScaleAndPosition();
        }
        public getContentHeight(): number {
            return this._contentHeight;
        }

        public setBoundarySpacings(left = 0, right = 0, top = 0, bottom = 0): void {
            this._spacingForTop    = top;
            this._spacingForBottom = bottom;
            this._spacingForLeft   = left;
            this._spacingForRight  = right;

            this._reviseContentScaleAndPosition();
        }

        public setContentX(x: number, needRevise: boolean): void {
            const contents  = this.getContents();
            const newX      = needRevise ? this.getRevisedContentX(x) : x;
            if (newX !== contents.x) {
                contents.x = newX;
                Twns.Notify.dispatch(NotifyType.ZoomableContentsMoved);
            }
        }
        private set _contentX(x: number) {
            this.setContentX(x, false);
        }
        private get _contentX(): number {
            return this.getContentX();
        }
        public getContentX(): number {
            return this._contents.x;
        }
        public setContentY(y: number, needRevise: boolean): void {
            const contents  = this.getContents();
            const newY      = needRevise ? this.getRevisedContentY(y) : y;
            if (newY !== contents.y) {
                contents.y = newY;
                Twns.Notify.dispatch(NotifyType.ZoomableContentsMoved);
            }
        }
        private set _contentY(y: number) {
            this.setContentY(y, false);
        }
        private get _contentY(): number {
            return this.getContentY();
        }
        public getContentY(): number {
            return this._contents.y;
        }
        public tweenContentToPoint(contentX: number, contentY: number, needRevise: boolean): void {
            if (needRevise) {
                contentX = this.getRevisedContentX(contentX);
                contentY = this.getRevisedContentY(contentY);
            }

            egret.Tween.removeTweens(this);
            egret.Tween.get(this)
                .to({ _contentX: contentX, _contentY: contentY }, 200);
        }

        public setContentScale(scale: number, needRevise: boolean): void {
            this._contents.scaleX = scale;
            this._contents.scaleY = scale;

            if (needRevise) {
                if ((this._getBoundaryHeight()) && (this._getBoundaryWidth())) {
                    this._reviseContentScaleAndPosition();
                }
            }
        }
        public getContentScale(): number {
            return this._contents.scaleX;
        }

        public setZoomByScroll(stageX: number, stageY: number, scrollValue: number): void {
            const point = ((stageX != null) && (stageY != null))
                ? this._contents.globalToLocal(stageX, stageY)
                : null;
            if ((point != null) && (this._checkIsInsideContents(point))) {
                this._setZoom(point, this._getScaleModifierByScrollValue(scrollValue));
            }
        }

        public setZoomByTouches(currGlobalPoints: TouchPoints, prevGlobalPoints: TouchPoints): void {
            const currGlobalCenterPoint = this._getCenterPoint(currGlobalPoints);
            const currLocalCenterPoint  = this._contents.globalToLocal(currGlobalCenterPoint.x, currGlobalCenterPoint.y);
            if (this._checkIsInsideContents(currLocalCenterPoint)) {
                this._setZoom(currLocalCenterPoint, this._getScaleModifierByTouches(currGlobalPoints, prevGlobalPoints));

                const prevGlobalCenterPoint = this._getCenterPoint(prevGlobalPoints);
                this.setContentX(this.getContentX() + currGlobalCenterPoint.x - prevGlobalCenterPoint.x, true);
                this.setContentY(this.getContentY() + currGlobalCenterPoint.y - prevGlobalCenterPoint.y, true);
            }
        }

        public setDragByTouches(currGlobalPoint: Point, prevGlobalPoint: Point): void {
            this.setContentX(this.getContentX() + currGlobalPoint.x - prevGlobalPoint.x, true);
            this.setContentY(this.getContentY() + currGlobalPoint.y - prevGlobalPoint.y, true);
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Callbacks.
        ////////////////////////////////////////////////////////////////////////////////
        private _onResize(): void {
            this._reviseContentScaleAndPosition();
        }

        private _onNotifyMouseWheel(e: egret.Event): void {
            this.setZoomByScroll(StageManager.getMouseX(), StageManager.getMouseY(), e.data);
        }

        private _onTouchBegin(e: egret.TouchEvent): void {
            const touchesCount = this._currGlobalTouchPoints.size;
            if (touchesCount <= 0) {
                this.addEventListener(egret.TouchEvent.TOUCH_MOVE, this._onTouchMove, this);
            }

            const touchId = e.touchPointID;
            if (touchesCount <= 1) {
                this._currGlobalTouchPoints.set(touchId, { x: e.stageX, y: e.stageY });
                this._prevGlobalTouchPoints.set(touchId, { x: e.stageX, y: e.stageY });
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
            const prevGlobalTouchPoints = this._prevGlobalTouchPoints;
            currGlobalTouchPoints.set(touchId, { x: e.stageX, y: e.stageY });

            if ((currGlobalTouchPoints.size > 1) && (prevGlobalTouchPoints.size > 1)) {
                this.setZoomByTouches(currGlobalTouchPoints, prevGlobalTouchPoints);
            } else {
                if (prevGlobalTouchPoints.has(touchId)) {
                    this.setDragByTouches(Twns.Helpers.getExisted(currGlobalTouchPoints.get(touchId)), Twns.Helpers.getExisted(prevGlobalTouchPoints.get(touchId)));
                }
            }

            this._prevGlobalTouchPoints.set(touchId, { x: e.stageX, y: e.stageY });
        }
        private _removeTouch(touchPointId: number): void {
            this._currGlobalTouchPoints.delete(touchPointId);
            this._prevGlobalTouchPoints.delete(touchPointId);

            if (!this._currGlobalTouchPoints.size) {
                this.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this._onTouchMove, this);
            }
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Private functions.
        ////////////////////////////////////////////////////////////////////////////////
        private _getScaleModifierByScrollValue(value: number): number {
            return Math.max(0.01, 1 + value / 1000);
        }
        private _getScaleModifierByTouches(currPoints: TouchPoints, prevPoints: TouchPoints): number {
            const newPoints: Point[] = [];
            for (const [, point] of currPoints) {
                newPoints.push(this._contents.globalToLocal(point.x, point.y));
            }

            const oldPoints: Point[] = [];
            for (const [, point] of prevPoints) {
                oldPoints.push(this._contents.globalToLocal(point.x, point.y));
            }

            return Twns.Helpers.getPointDistance(newPoints[0].x, newPoints[0].y, newPoints[1].x, newPoints[1].y)
                /  Twns.Helpers.getPointDistance(oldPoints[0].x, oldPoints[0].y, oldPoints[1].x, oldPoints[1].y);
        }

        private _getCenterPoint(touches: TouchPoints): Point {
            const points: Point[] = [];
            for (const [, point] of touches) {
                points.push({ x: point.x, y: point.y });
                if (points.length >= 2) {
                    break;
                }
            }

            if (points.length === 0) {
                return {x: 0, y: 0};
            } else if (points.length === 1) {
                return points[0];
            } else {
                return {
                    x: (points[0].x + points[1].x) / 2,
                    y: (points[0].y + points[1].y) / 2,
                };
            }
        }

        private _checkIsInsideContents(point: Point): boolean {
            return (point.x >= 0)
                && (point.y >= 0)
                && (point.x <= this.getContentWidth())
                && (point.y <= this.getContentHeight());
        }

        private _setZoom(focusPoint: Point, scaleModifier: number): void {
            const currentScale = this.getContentScale();
            let newScale = currentScale * scaleModifier;
            newScale = Math.max(newScale, this._getMinContentScale());
            newScale = Math.min(newScale, this._getMaxContentScale());

            if (newScale !== currentScale) {
                const oldGlobalPoint = this._contents.localToGlobal(focusPoint.x, focusPoint.y);
                this.setContentScale(newScale, false);

                const newGlobalPoint = this._contents.localToGlobal(focusPoint.x, focusPoint.y);
                this.setContentX(this.getContentX() - newGlobalPoint.x + oldGlobalPoint.x, false);
                this.setContentY(this.getContentY() - newGlobalPoint.y + oldGlobalPoint.y, false);

                this._reviseContentScaleAndPosition();
            }
        }

        private _getMaxContentScale(): number {
            return Math.max(MAX_CONTENT_SCALE, this._getMinContentScale());
        }
        private _getMinContentScale(): number {
            const boundaryWidth  = this._getBoundaryWidth();
            const boundaryHeight = this._getBoundaryHeight();
            const contentWidth   = this.getContentWidth();
            const contentHeight  = this.getContentHeight();
            if ((!boundaryWidth) || (!boundaryHeight) || (!contentWidth) || (!contentHeight)) {
                return 1;
            } else {
                return Math.min(boundaryWidth / contentWidth, boundaryHeight / contentHeight);
            }
        }

        private _getBoundaryWidth(): number {
            return this.width - this._spacingForLeft - this._spacingForRight;
        }
        private _getBoundaryHeight(): number {
            return this.height - this._spacingForTop - this._spacingForBottom;
        }

        private _getMinContentX(): number {
            const boundaryWidth = this._getBoundaryWidth();
            const contentWidth  = this.getContentWidth() * this.getContentScale();
            if (contentWidth <= boundaryWidth) {
                return this._spacingForLeft + (boundaryWidth - contentWidth) / 2;
            } else {
                return this._spacingForLeft - (contentWidth - boundaryWidth);
            }
        }
        private _getMaxContentX(): number {
            const boundaryWidth = this._getBoundaryWidth();
            const contentWidth  = this.getContentWidth() * this.getContentScale();
            if (contentWidth <= boundaryWidth) {
                return this._spacingForLeft + (boundaryWidth - contentWidth) / 2;
            } else {
                return this._spacingForLeft;
            }
        }
        private _getMinContentY(): number {
            const boundaryHeight = this._getBoundaryHeight();
            const contentHeight  = this.getContentHeight() * this.getContentScale();
            if (contentHeight <= boundaryHeight) {
                return this._spacingForTop + (boundaryHeight - contentHeight) / 2;
            } else {
                return this._spacingForTop - (contentHeight - boundaryHeight);
            }
        }
        private _getMaxContentY(): number {
            const boundaryHeight = this._getBoundaryHeight();
            const contentHeight  = this.getContentHeight() * this.getContentScale();
            if (contentHeight <= boundaryHeight) {
                return this._spacingForTop + (boundaryHeight - contentHeight) / 2;
            } else {
                return this._spacingForTop;
            }
        }

        public getRevisedContentX(contentX: number): number {
            return Math.min(
                Math.max(contentX, this._getMinContentX()),
                this._getMaxContentX()
            );
        }
        public getRevisedContentY(contentY: number): number {
            return Math.min(
                Math.max(contentY, this._getMinContentY()),
                this._getMaxContentY()
            );
        }
        private _reviseContentX(): void {
            this.setContentX(this.getRevisedContentX(this.getContentX()), false);
        }
        private _reviseContentY(): void {
            this.setContentY(this.getRevisedContentY(this.getContentY()), false);
        }
        private _reviseContentScaleAndPosition(): void {
            let scale = this.getContentScale();
            scale = Math.max(scale, this._getMinContentScale());
            scale = Math.min(scale, this._getMaxContentScale());
            this.setContentScale(scale, false);

            this._reviseContentX();
            this._reviseContentY();
        }
    }
}

// export default TwnsUiZoomableComponent;
