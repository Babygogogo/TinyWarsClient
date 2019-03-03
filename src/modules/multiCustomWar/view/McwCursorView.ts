
namespace TinyWars.MultiCustomWar {
    import Types = Utility.Types;

    const { width: _GRID_WIDTH, height: _GRID_HEIGHT } = ConfigManager.getGridSize();
    const _CORNER_WIDTH             = 28;
    const _CORNER_HEIGHT            = 28;
    const _PULSE_IN_DURATION        = 150;
    const _PULSE_OUT_DURATION       = 150;
    const _PULSE_INTERVAL_DURATION  = 300;
    const _TARGET_FRAME_DURATION    = 100;

    const _IMG_SOURCE_FOR_NORMAL_CORNER = "c04_t03_s01_f01";
    const _IMG_SOURCES_FOR_TARGET       = [
        `c04_t03_s02_f01`,
        `c04_t03_s02_f02`,
        `c04_t03_s02_f03`,
        `c04_t03_s02_f04`,
    ];

    const _UPPER_LEFT_CORNER_OUTER_X    = -6;
    const _UPPER_LEFT_CORNER_OUTER_Y    = -6;
    const _UPPER_LEFT_CORNER_INNER_X    = 4;
    const _UPPER_LEFT_CORNER_INNER_Y    = 4;
    const _UPPER_RIGHT_CORNER_OUTER_X   = _GRID_WIDTH + 6;
    const _UPPER_RIGHT_CORNER_OUTER_Y   = -6;
    const _UPPER_RIGHT_CORNER_INNER_X   = _GRID_WIDTH - 4;
    const _UPPER_RIGHT_CORNER_INNER_Y   = 4;
    const _LOWER_LEFT_CORNER_OUTER_X    = -6;
    const _LOWER_LEFT_CORNER_OUTER_Y    = _GRID_HEIGHT + 6;
    const _LOWER_LEFT_CORNER_INNER_X    = 4;
    const _LOWER_LEFT_CORNER_INNER_Y    = _GRID_HEIGHT - 4;
    const _LOWER_RIGHT_CORNER_OUTER_X   = _GRID_WIDTH  + 6;
    const _LOWER_RIGHT_CORNER_OUTER_Y   = _GRID_HEIGHT + 6;
    const _LOWER_RIGHT_CORNER_INNER_X   = _GRID_WIDTH  - 4;
    const _LOWER_RIGHT_CORNER_INNER_Y   = _GRID_HEIGHT - 4;

    export class McwCursorView extends egret.DisplayObjectContainer {
        private _cursor                 : McwCursor;
        private _frameIndexForImgTarget = 0;

        private _conForAll              = new egret.DisplayObjectContainer();
        private _conForNormal           = new egret.DisplayObjectContainer();
        private _conForTarget           = new egret.DisplayObjectContainer();
        private _conForSiloArea         = new egret.DisplayObjectContainer();
        private _imgUpperLeftCorner     = new GameUi.UiImage(_IMG_SOURCE_FOR_NORMAL_CORNER);
        private _imgUpperRightCorner    = new GameUi.UiImage(_IMG_SOURCE_FOR_NORMAL_CORNER);
        private _imgLowerLeftCorner     = new GameUi.UiImage(_IMG_SOURCE_FOR_NORMAL_CORNER);
        private _imgLowerRightCorner    = new GameUi.UiImage(_IMG_SOURCE_FOR_NORMAL_CORNER);
        private _imgTarget              = new GameUi.UiImage(_IMG_SOURCES_FOR_TARGET[this._frameIndexForImgTarget]);
        private _imgSiloArea            = new GameUi.UiImage(`c04_t03_s03_f01`);

        public constructor() {
            super();

            this.addChild(this._conForAll);
            this._initConForNormal();
            this._initConForTarget();
            this._initConForSiloArea()
        }

        public init(cursor: McwCursor): void {
            egret.assert(!this._cursor, "McwCursorView.init() already initialied!");
            this._cursor = cursor;
        }

        public startRunningView(): void {
            this._startNormalAnimation();
            this._startTargetAnimation();
        }
        public stopRunningView(): void {
            this._stopNormalAnimation();
            this._stopTargetAnimation();
        }

        public updateView(): void {

        }

        private _initConForNormal(): void {
            this._imgUpperLeftCorner.x = _UPPER_LEFT_CORNER_OUTER_X;
            this._imgUpperLeftCorner.y = _UPPER_LEFT_CORNER_OUTER_Y;
            this._conForNormal.addChild(this._imgUpperLeftCorner);

            this._imgUpperRightCorner.x         = _UPPER_RIGHT_CORNER_OUTER_X;
            this._imgUpperRightCorner.y         = _UPPER_RIGHT_CORNER_OUTER_Y;
            this._imgUpperRightCorner.rotation  = 90;
            this._conForNormal.addChild(this._imgUpperRightCorner);

            this._imgLowerLeftCorner.x          = _LOWER_LEFT_CORNER_OUTER_X;
            this._imgLowerLeftCorner.y          = _LOWER_LEFT_CORNER_OUTER_Y;
            this._imgLowerLeftCorner.rotation   = -90;
            this._conForNormal.addChild(this._imgLowerLeftCorner);

            this._imgLowerRightCorner.x         = _LOWER_RIGHT_CORNER_OUTER_X;
            this._imgLowerRightCorner.y         = _LOWER_RIGHT_CORNER_OUTER_Y;
            this._imgLowerRightCorner.rotation  = 180;
            this._conForNormal.addChild(this._imgLowerRightCorner);

            this._conForAll.addChild(this._conForNormal);
        }
        private _initConForTarget(): void {
            this._imgTarget.x = -_GRID_WIDTH;
            this._imgTarget.y = -_GRID_HEIGHT;
            this._conForTarget.addChild(this._imgTarget);

            this._conForAll.addChild(this._conForTarget);
        }
        private _initConForSiloArea(): void {
            this._imgSiloArea.x = -_GRID_WIDTH * 2;
            this._imgSiloArea.y = -_GRID_HEIGHT * 2;
            this._conForSiloArea.addChild(this._imgSiloArea);

            this._conForAll.addChild(this._conForSiloArea);
        }

        private _startNormalAnimation(): void {
            egret.Tween.get(this._imgUpperLeftCorner, { loop: true })
                .to({ x: _UPPER_LEFT_CORNER_INNER_X, y: _UPPER_LEFT_CORNER_INNER_Y }, _PULSE_IN_DURATION)
                .to({ x: _UPPER_LEFT_CORNER_OUTER_X, y: _UPPER_LEFT_CORNER_OUTER_Y }, _PULSE_OUT_DURATION)
                .wait(_PULSE_INTERVAL_DURATION);

            egret.Tween.get(this._imgUpperRightCorner, { loop: true })
                .to({ x: _UPPER_RIGHT_CORNER_INNER_X, y: _UPPER_RIGHT_CORNER_INNER_Y }, _PULSE_IN_DURATION)
                .to({ x: _UPPER_RIGHT_CORNER_OUTER_X, y: _UPPER_RIGHT_CORNER_OUTER_Y }, _PULSE_OUT_DURATION)
                .wait(_PULSE_INTERVAL_DURATION);

            egret.Tween.get(this._imgLowerLeftCorner, { loop: true })
                .to({ x: _LOWER_LEFT_CORNER_INNER_X, y: _LOWER_LEFT_CORNER_INNER_Y }, _PULSE_IN_DURATION)
                .to({ x: _LOWER_LEFT_CORNER_OUTER_X, y: _LOWER_LEFT_CORNER_OUTER_Y }, _PULSE_OUT_DURATION)
                .wait(_PULSE_INTERVAL_DURATION);

            egret.Tween.get(this._imgLowerRightCorner, { loop: true })
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
            egret.Tween.removeTweens(this._imgTarget);
        }
    }
}
