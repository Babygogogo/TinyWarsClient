
namespace TinyWars.BaseWar {
    import TimeModel            = Time.TimeModel;
    import Types                = Utility.Types;
    import Helpers              = Utility.Helpers;
    import UnitAnimationType    = Types.UnitAnimationType;
    import GridIndex            = Types.GridIndex;

    const { width: _GRID_WIDTH, height: _GRID_HEIGHT }  = ConfigManager.getGridSize();
    const _IMG_UNIT_STAND_ANCHOR_OFFSET_X               = _GRID_WIDTH * 3 / 4;
    const _IMG_UNIT_STAND_ANCHOR_OFFSET_Y               = _GRID_HEIGHT / 2;
    const _IMG_UNIT_STAND_X                             = _GRID_WIDTH * 2 / 4;
    const _IMG_UNIT_STATE_WIDTH                         = 28;
    const _IMG_UNIT_STATE_HEIGHT                        = 36;

    export abstract class BwUnitView extends egret.DisplayObjectContainer {
        private _imgHp      = new GameUi.UiImage();
        private _imgState   = new GameUi.UiImage();
        private _imgUnit    = new GameUi.UiImage();

        private _unit                       : BwUnit;
        private _animationType              = UnitAnimationType.Stand;
        private _isDark                     = false;
        private _framesForStateAnimation    = [] as string[];

        public constructor() {
            super();

            this._imgUnit.anchorOffsetX = _IMG_UNIT_STAND_ANCHOR_OFFSET_X;
            this._imgUnit.anchorOffsetY = _IMG_UNIT_STAND_ANCHOR_OFFSET_Y;
            this._imgUnit.x             = _IMG_UNIT_STAND_X;
            this._imgState.x            = 0;
            this._imgState.y            = _GRID_HEIGHT - _IMG_UNIT_STATE_HEIGHT;
            this._imgHp.x               = _GRID_WIDTH - _IMG_UNIT_STATE_WIDTH - 3;
            this._imgHp.y               = _GRID_HEIGHT - _IMG_UNIT_STATE_HEIGHT;
            this.addChild(this._imgUnit);
            this.addChild(this._imgState);
            this.addChild(this._imgHp);
        }

        public init(unit: BwUnit): BwUnitView {
            this._unit = unit;

            return this;
        }

        public startRunningView(): BwUnitView {
            this.resetAllViews();

            return this;
        }

        public getUnit(): BwUnit {
            return this._unit;
        }

        public resetAllViews(): void {
            this._isDark = this._unit.getState() === Types.UnitState.Actioned;
            this.resetStateAnimationFrames();
            this.showUnitAnimation(UnitAnimationType.Stand);
            this.updateImageHp();
        }

        public showUnitAnimation(type: UnitAnimationType): void {
            this._animationType = type;
            this.tickUnitAnimationFrame();
        }
        public tickUnitAnimationFrame(): void {
            if (this._animationType === UnitAnimationType.Stand) {
                this._imgUnit.source    = ConfigManager.getUnitIdleImageSource(this._unit.getViewId(), Math.floor(TimeModel.getUnitAnimationTickCount() / 2), this._isDark);
            } else {
                this._imgUnit.source    = ConfigManager.getUnitMovingImageSource(this._unit.getViewId(), TimeModel.getUnitAnimationTickCount(), this._isDark);
            }
        }

        public updateImageHp(): void {
            const normalizedHp = this._unit.getNormalizedCurrentHp();
            if ((normalizedHp >= this._unit.getNormalizedMaxHp()) || (normalizedHp <= 0)) {
                this._imgHp.visible = false;
            } else {
                this._imgHp.visible = true;
                this._imgHp.source  = `${this._getImageSourcePrefix(this._isDark)}_t99_s01_f${Helpers.getNumText(normalizedHp)}`;
            }
        }

        public resetStateAnimationFrames(): void {
            const frames    = this._framesForStateAnimation;
            frames.length   = 0;
            this._addFrameForCoSkill();
            this._addFrameForPromotion();
            this._addFrameForFuel();
            this._addFrameForAmmo();
            this._addFrameForDive();
            this._addFrameForCapture();
            this._addFrameForBuild();
            this._addFrameForLoader();
            this._addFrameForMaterial();

            this.tickStateAnimationFrame();
        }
        public tickStateAnimationFrame(): void {
            const framesCount       = this._framesForStateAnimation.length;
            this._imgState.source   = framesCount <= 0
                ? undefined
                : this._framesForStateAnimation[Math.floor(TimeModel.getUnitAnimationTickCount() / 6) % framesCount];
        }

        public abstract moveAlongPath(path: GridIndex[], isDiving: boolean, isBlocked: boolean, callback: Function, aiming?: GridIndex): void;

        protected _getIsDark(): boolean {
            return this._isDark;
        }
        protected _getFramesForStateAnimation(): string[] {
            return this._framesForStateAnimation;
        }
        protected _getUnit(): BwUnit {
            return this._unit;
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Other functions.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _addFrameForCoSkill(): void {
            const unit = this._unit;
            if (unit.getPlayer().getCoIsUsingSkill()) {
                this._framesForStateAnimation.push(`${this._getImageSourcePrefix(this._isDark)}_t99_s08_f${Helpers.getNumText(unit.getPlayerIndex())}`);
            }
        }
        private _addFrameForPromotion(): void {
            const unit = this._unit;
            if (unit.getUnitId() === unit.getPlayer().getCoUnitId()) {
                this._framesForStateAnimation.push(`${this._getImageSourcePrefix(this._isDark)}_t99_s05_f99`);
            } else {
                const promotion = unit.getCurrentPromotion();
                if (promotion > 0) {
                    this._framesForStateAnimation.push(`${this._getImageSourcePrefix(this._isDark)}_t99_s05_f${Helpers.getNumText(promotion)}`);
                }
            }
        }
        private _addFrameForFuel(): void {
            if (this._unit.checkIsFuelInShort()) {
                this._framesForStateAnimation.push(`${this._getImageSourcePrefix(this._isDark)}_t99_s02_f01`);
            }
        }
        private _addFrameForAmmo(): void {
            if ((this._unit.checkIsPrimaryWeaponAmmoInShort()) || (this._unit.checkIsFlareAmmoInShort())) {
                this._framesForStateAnimation.push(`${this._getImageSourcePrefix(this._isDark)}_t99_s02_f02`);
            }
        }
        private _addFrameForDive(): void {
            if (this._unit.getIsDiving()) {
                this._framesForStateAnimation.push(`${this._getImageSourcePrefix(this._isDark)}_t99_s03_f${Helpers.getNumText(this._unit.getPlayerIndex())}`);
            }
        }
        private _addFrameForCapture(): void {
            if (this._unit.getIsCapturingTile()) {
                this._framesForStateAnimation.push(`${this._getImageSourcePrefix(this._isDark)}_t99_s04_f${Helpers.getNumText(this._unit.getPlayerIndex())}`);
            }
        }
        private _addFrameForBuild(): void {
            if (this._unit.getIsBuildingTile()) {
                this._framesForStateAnimation.push(`${this._getImageSourcePrefix(this._isDark)}_t99_s04_f${Helpers.getNumText(this._unit.getPlayerIndex())}`);
            }
        }
        protected abstract _addFrameForLoader(): void;
        private _addFrameForMaterial(): void {
            if ((this._unit.checkIsBuildMaterialInShort()) || (this._unit.checkIsProduceMaterialInShort())) {
                this._framesForStateAnimation.push(`${this._getImageSourcePrefix(this._isDark)}_t99_s02_f04`);
            }
        }

        protected _setImgUnitFlippedX(isFlipped: boolean): void {
            this._imgUnit.scaleX = isFlipped ? -1 : 1;
        }

        protected _getImageSourcePrefix(isDark: boolean): string {
            return isDark ? `c07` : `c03`;
        }
    }
}
