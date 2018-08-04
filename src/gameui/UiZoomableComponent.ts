
namespace GameUi {
    import Types        = Utility.Types;
    import Helpers      = Utility.Helpers;
    import StageManager = Utility.StageManager;
    import Size         = Types.Size;
    import Point        = Types.Point;

    const ORIGIN: Point = {
        x: 0,
        y: 0
    };
    type TouchEvents = { [toucheId: number]: egret.TouchEvent };
    type TouchPoints = { [toucheId: number]: Point };

    export class UiZoomableComponent extends eui.Component {
        private _maskForContents: UiImage;

        private _contents        : egret.DisplayObjectContainer = new egret.DisplayObjectContainer();
        private _contentWidth    : number = 0;
        private _contentHeight   : number = 0;
        private _spacingForTop   : number = 0;
        private _spacingForBottom: number = 0;
        private _spacingForLeft  : number = 0;
        private _spacingForRight : number = 0;

        public constructor() {
            super();

            this.addEventListener(egret.Event.RESIZE, this._onResize, this);

            this._resetMask();
            this.addChild(this._contents);
        }

        public addContent(content: egret.DisplayObject): void {
            this._contents.addChild(content);
        }
        public removeContent(content: egret.DisplayObject): void {
            this._contents.removeChild(content);
        }

        public setContentWidth(width: number): void {
            this._contentWidth = width;
            this.reviseContentX();
        }
        public getContentWidth(): number {
            return this._contentWidth;
        }
        public setContentHeight(height: number): void {
            this._contentHeight = height;
            this.reviseContentY();
        }
        public getContentHeight(): number {
            return this._contentHeight;
        }

        public setBoundarySpacings(left = 0, right = 0, top = 0, bottom = 0): void {
            this._spacingForTop    = top;
            this._spacingForBottom = bottom;
            this._spacingForLeft   = left;
            this._spacingForRight  = right;

            this.reviseContentX();
            this.reviseContentY();
        }

        public setContentX(x: number): void {
            x = Math.max(x, this._getMinContentX());
            x = Math.min(x, this._getMaxContentX());
            this._contents.x = x;
        }
        public getContentX(): number {
            return this._contents.x;
        }
        public setContentY(y: number): void {
            y = Math.max(y, this._getMinContentY());
            y = Math.min(y, this._getMaxContentY());
            this._contents.y = y;
        }
        public getContentY(): number {
            return this._contents.y;
        }

        public reviseContentX(): void {
            this.setContentX(this.getContentX());
        }
        public reviseContentY(): void {
            this.setContentY(this.getContentY());
        }

        public setZoomByScroll(focusPoint: Types.Point, scrollValue: number): void {
            this._setZoom(
                focusPoint,
                this._getNewScale(this.scaleX, this._getScaleModifierByScrollValue(scrollValue))
            );
        }

        public setZoomByTouches(touches: TouchEvents, prevPoints: TouchPoints): void {
            this._setZoom(
                this._getCenterPoint(touches),
                this._getNewScale(this.scaleX, this._getScaleModifierByTouches(touches, prevPoints))
            );
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Callbacks.
        ////////////////////////////////////////////////////////////////////////////////
        private _onResize(e: egret.Event): void {
            this.reviseContentX();
            this.reviseContentY();
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Private functions.
        ////////////////////////////////////////////////////////////////////////////////
        private _getMaxScale(): number {
            return 2;
        }

        private _getMinScale(): number {
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

        private _getNewScale(currScale: number, modifier: number): number {
            let newScale = currScale * modifier;
            newScale = Math.max(this._getMinScale(), newScale);
            newScale = Math.min(this._getMaxScale(), newScale);

            return newScale;
        }

        private _getScaleModifierByScrollValue(value: number): number {
            return 1 - value / 10;
        }

        private _getScaleModifierByTouches(touches: TouchEvents, prevPoints: TouchPoints): number {
            const distances: number[] = [];
            for (const id in touches) {
                const touch     = touches[id];
                const prevPoint = prevPoints[id];
                if (!prevPoint) {
                    distances.push(0);
                } else {
                    distances.push(Helpers.getPointDistance(touch.localX, touch.localY, prevPoint.x, prevPoint.y));
                }

                if (distances.length >= 2) {
                    break;
                }
            }

            if ((distances.length <= 1) || (distances[0] === 0) || (distances[1] === 0)) {
                return 1;
            } else {
                return distances[1] / distances[0];
            }
        }

        private _getCenterPoint(touches: TouchEvents): Types.Point {
            const points: Types.Point[] = [];
            for (const id in touches) {
                points.push({x: touches[id].localX, y: touches[id].localY});
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
                }
            }
        }

        private _checkShouldZoom(scaleModifier: number): boolean {
            const currentScale = this.scaleX;
            if (scaleModifier === 1) {
                return false;
            } else if ((scaleModifier > 1) && (currentScale >= this._getMaxScale())) {
                return false;
            } else if ((scaleModifier < 1) && (currentScale <= this._getMinScale())) {
                return false;
            } else {
                return true;
            }
        }

        private _setZoom(focusPoint: Types.Point, scale: number): void {
            const oldGlobalPoint = this.localToGlobal(focusPoint.x, focusPoint.y);
            this.scaleX = this.scaleY = scale;

            const newGlobalPoint = this.localToGlobal(focusPoint.x, focusPoint.y);
            this.x = this.x - newGlobalPoint.x + oldGlobalPoint.x;
            this.y = this.y - newGlobalPoint.y + oldGlobalPoint.y;
            this.reviseContentX();
            this.reviseContentY();
        }

        private _getBoundaryWidth(): number {
            return this.width - this._spacingForLeft - this._spacingForRight;
        }
        private _getBoundaryHeight(): number {
            return this.height - this._spacingForTop - this._spacingForBottom;
        }

        private _getMinContentX(): number {
            const boundaryWidth = this._getBoundaryWidth();
            const contentWidth  = this.getContentWidth();
            if (contentWidth <= boundaryWidth) {
                return this._spacingForLeft + (boundaryWidth - contentWidth) / 2;
            } else {
                return this._spacingForLeft - (contentWidth - boundaryWidth);
            }
        }
        private _getMaxContentX(): number {
            const boundaryWidth = this._getBoundaryWidth();
            const contentWidth  = this.getContentWidth();
            if (contentWidth <= boundaryWidth) {
                return this._spacingForLeft + (boundaryWidth - contentWidth) / 2;
            } else {
                return this._spacingForLeft;
            }
        }
        private _getMinContentY(): number {
            const boundaryHeight = this._getBoundaryHeight();
            const contentHeight  = this.getContentHeight();
            if (contentHeight <= boundaryHeight) {
                return this._spacingForTop + (boundaryHeight - contentHeight) / 2;
            } else {
                return this._spacingForTop - (contentHeight - boundaryHeight);
            }
        }
        private _getMaxContentY(): number {
            const boundaryHeight = this._getBoundaryHeight();
            const contentHeight  = this.getContentHeight();
            if (contentHeight <= boundaryHeight) {
                return this._spacingForTop + (boundaryHeight - contentHeight) / 2;
            } else {
                return this._spacingForTop;
            }
        }

        private _resetMask(): void {
            if (!this._maskForContents) {
                const mask  = new UiImage("c03_t06_s01_f01_png");
                mask.left   = 0;
                mask.right  = 0;
                mask.top    = 0;
                mask.bottom = 0;

                this._maskForContents = mask;
                this._contents.mask   = mask;
                this.addChildAt(mask, 0);
            }
        }
    }
}
