
namespace TinyWars.MultiCustomWar {
    import TimeModel            = Time.TimeModel;
    import Types                = Utility.Types;
    import Helpers              = Utility.Helpers;
    import UnitAnimationType    = Types.UnitAnimationType;
    import GridIndex            = Types.GridIndex;

    const _GRID_SIZE = ConfigManager.getGridSize();

    export class McwUnitView extends egret.DisplayObjectContainer {
        private _imgHp      = new GameUi.UiImage();
        private _imgState   = new GameUi.UiImage();
        private _imgUnit    = new GameUi.UiImage();

        private _unit                       : McwUnit;
        private _animationType              = UnitAnimationType.Stand;
        private _isDark                     = false;
        private _framesForStateAnimation    = [] as string[];

        public constructor() {
            super();

            this._imgUnit.addEventListener( eui.UIEvent.RESIZE, () => this._imgUnit.anchorOffsetY  = this._imgUnit.height,  this);
            this._imgState.addEventListener(eui.UIEvent.RESIZE, () => this._imgState.anchorOffsetY = this._imgState.height, this);
            this._imgHp.addEventListener(   eui.UIEvent.RESIZE, () => this._imgHp.anchorOffsetY    = this._imgHp.height,    this);
            this._imgUnit.x     = 0;
            this._imgUnit.y     = _GRID_SIZE.height;
            this._imgState.x    = 3;
            this._imgState.y    = _GRID_SIZE.height;
            this._imgHp.x       = _GRID_SIZE.width - 24;
            this._imgHp.y       = _GRID_SIZE.height;
            this.addChild(this._imgUnit);
            this.addChild(this._imgState);
            this.addChild(this._imgHp);
        }

        public init(unit: McwUnit): McwUnitView {
            this._unit = unit;

            return this;
        }

        public startRunningView(): McwUnitView {
            this.resetAllViews();

            return this;
        }

        public getUnit(): McwUnit {
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
                this._imgUnit.x         = 0;
                this._imgUnit.source    = ConfigManager.getUnitIdleImageSource(this._unit.getViewId(), Math.floor(TimeModel.getUnitAnimationTickCount() / 2), this._isDark);
            } else {
                this._imgUnit.x         = -_GRID_SIZE.width / 4;
                this._imgUnit.source    = ConfigManager.getUnitMovingImageSource(this._unit.getViewId(), TimeModel.getUnitAnimationTickCount(), this._isDark);
            }
        }

        public updateImageHp(): void {
            const normalizedHp = this._unit.getNormalizedCurrentHp();
            if ((normalizedHp >= ConfigManager.MAX_UNIT_NORMALIZED_HP) || (normalizedHp <= 0)) {
                this._imgHp.visible = false;
            } else {
                this._imgHp.visible = true;
                this._imgHp.source  = `${getImageSourcePrefix(this._isDark)}_t99_s01_f${Helpers.getNumText(normalizedHp)}`;
            }
        }

        public resetStateAnimationFrames(): void {
            const frames    = this._framesForStateAnimation;
            frames.length   = 0;
            this._addFrameForPlayerSkill();
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

        public moveAlongPath(path: GridIndex[], isDiving: boolean, callback: Function, aiming?: GridIndex): void {
            this.showUnitAnimation(UnitAnimationType.Move);

        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Other functions.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _addFrameForPlayerSkill(): void {
            // TODO
        }
        private _addFrameForPromotion(): void {
            const promotion = this._unit.getCurrentPromotion();
            if (promotion > 0) {
                this._framesForStateAnimation.push(`${getImageSourcePrefix(this._isDark)}_t99_s05_f${Helpers.getNumText(promotion)}`);
            }
        }
        private _addFrameForFuel(): void {
            if (this._unit.checkIsFuelInShort()) {
                this._framesForStateAnimation.push(`${getImageSourcePrefix(this._isDark)}_t99_s02_f01`);
            }
        }
        private _addFrameForAmmo(): void {
            if ((this._unit.checkIsPrimaryWeaponAmmoInShort()) || (this._unit.checkIsFlareAmmoInShort())) {
                this._framesForStateAnimation.push(`${getImageSourcePrefix(this._isDark)}_t99_s02_f02`);
            }
        }
        private _addFrameForDive(): void {
            if (this._unit.getIsDiving()) {
                this._framesForStateAnimation.push(`${getImageSourcePrefix(this._isDark)}_t99_s03_f${Helpers.getNumText(this._unit.getPlayerIndex())}`);
            }
        }
        private _addFrameForCapture(): void {
            if (this._unit.getIsCapturingTile()) {
                this._framesForStateAnimation.push(`${getImageSourcePrefix(this._isDark)}_t99_s04_f${Helpers.getNumText(this._unit.getPlayerIndex())}`);
            }
        }
        private _addFrameForBuild(): void {
            if (this._unit.getIsBuildingTile()) {
                this._framesForStateAnimation.push(`${getImageSourcePrefix(this._isDark)}_t99_s04_f${Helpers.getNumText(this._unit.getPlayerIndex())}`);
            }
        }
        private _addFrameForLoader(): void {
            const unit  = this._unit;
            const war   = unit.getWar();
            if (war) {
                const unitPlayerIndex = unit.getPlayerIndex();
                if (!war.getFogMap().checkHasFogCurrently()) {
                    if (unit.getLoadedUnitsCount() > 0) {
                        this._framesForStateAnimation.push(`${getImageSourcePrefix(this._isDark)}_t99_s06_f${Helpers.getNumText(unitPlayerIndex)}`);
                    }
                } else {
                    const playerManager = war.getPlayerManager();
                    if (!playerManager.checkIsSameTeam(unitPlayerIndex, playerManager.getPlayerIndexLoggedIn())) {
                        this._framesForStateAnimation.push(`${getImageSourcePrefix(this._isDark)}_t99_s06_f${Helpers.getNumText(unitPlayerIndex)}`);
                    }
                }
            }
        }
        private _addFrameForMaterial(): void {
            if ((this._unit.checkIsBuildMaterialInShort()) || (this._unit.checkIsProduceMaterialInShort())) {
                this._framesForStateAnimation.push(`${getImageSourcePrefix(this._isDark)}_t99_s02_f04`);
            }
        }
    }

    function getImageSourcePrefix(isDark: boolean): string {
        return isDark ? `c07` : `c03`;
    }
}
