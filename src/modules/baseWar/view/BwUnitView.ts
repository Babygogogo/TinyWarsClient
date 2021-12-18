
// import TwnsBwUnit           from "../model/BwUnit";
// import TwnsUiImage          from "../../tools/ui/UiImage";
// import Timer                from "../../tools/helpers/Timer";
// import CommonModel          from "../../common/model/CommonModel";
// import UserModel            from "../../user/model/UserModel";
// import Types                from "../../tools/helpers/Types";
// import WarVisibilityHelpers from "../../tools/warHelpers/WarVisibilityHelpers";
// import GridIndexHelpers     from "../../tools/helpers/GridIndexHelpers";
// import Helpers              from "../../tools/helpers/Helpers";
// import CommonConstants      from "../../tools/helpers/CommonConstants";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace TwnsBwUnitView {
    import ClientErrorCode      = TwnsClientErrorCode.ClientErrorCode;
    import UnitAnimationType    = Types.UnitAnimationType;
    import GridIndex            = Types.GridIndex;

    const { width: _GRID_WIDTH, height: _GRID_HEIGHT }  = CommonConstants.GridSize;
    const _IMG_UNIT_STAND_ANCHOR_OFFSET_X               = _GRID_WIDTH * 3 / 4;
    const _IMG_UNIT_STAND_ANCHOR_OFFSET_Y               = _GRID_HEIGHT / 2;
    const _IMG_UNIT_STAND_X                             = _GRID_WIDTH * 2 / 4;
    const _IMG_UNIT_STATE_WIDTH                         = 10;
    const _IMG_UNIT_STATE_HEIGHT                        = 12;
    const _AIMING_TIME_MS                               = 500;

    export class BwUnitView extends egret.DisplayObjectContainer {
        private _imgHp      = new TwnsUiImage.UiImage();
        private _imgState   = new TwnsUiImage.UiImage();
        private _imgUnit    = new TwnsUiImage.UiImage();

        private _unit                       : TwnsBwUnit.BwUnit | null = null;
        private _animationType              = UnitAnimationType.Stand;
        private _isDark                     = false;
        private _framesForStateAnimation    = [] as string[];

        public constructor() {
            super();

            const imgUnit           = this._imgUnit;
            imgUnit.smoothing       = false;
            imgUnit.anchorOffsetX   = _IMG_UNIT_STAND_ANCHOR_OFFSET_X;
            imgUnit.anchorOffsetY   = _IMG_UNIT_STAND_ANCHOR_OFFSET_Y;
            imgUnit.x               = _IMG_UNIT_STAND_X;

            const imgState      = this._imgState;
            imgState.smoothing  = false;
            imgState.x          = 0;
            imgState.y          = _GRID_HEIGHT - _IMG_UNIT_STATE_HEIGHT;

            const imgHp     = this._imgHp;
            imgHp.smoothing = false;
            imgHp.x         = _GRID_WIDTH - _IMG_UNIT_STATE_WIDTH - 1;
            imgHp.y         = _GRID_HEIGHT - _IMG_UNIT_STATE_HEIGHT;

            this.addChild(imgUnit);
            this.addChild(imgState);
            this.addChild(imgHp);
        }

        public init(unit: TwnsBwUnit.BwUnit): BwUnitView {
            this._setUnit(unit);

            return this;
        }

        public startRunningView(): BwUnitView {
            this.resetAllViews();

            return this;
        }

        private _setUnit(unit: TwnsBwUnit.BwUnit): void {
            this._unit = unit;
        }
        public getUnit(): TwnsBwUnit.BwUnit | null {
            return this._unit;
        }

        public resetAllViews(): void {
            const unit      = Helpers.getExisted(this.getUnit());
            this._isDark    = unit.getActionState() === Types.UnitActionState.Acted;
            this._setImgUnitFlippedX(unit.getPlayerIndex() % 2 === 0);
            this.resetStateAnimationFrames();
            this.showUnitAnimation(UnitAnimationType.Stand);
            this.updateImageHp();
        }

        public showUnitAnimation(type: UnitAnimationType): void {
            this._animationType = type;
            this.tickUnitAnimationFrame();
        }
        public tickUnitAnimationFrame(): void {
            const unit              = Helpers.getExisted(this.getUnit());
            this._imgUnit.source    = CommonModel.getCachedUnitImageSource({
                version     : UserModel.getSelfSettingsTextureVersion(),
                isDark      : this._isDark,
                isMoving    : this._animationType === UnitAnimationType.Move,
                tickCount   : Timer.getUnitAnimationTickCount(),
                skinId      : unit.getSkinId(),
                unitType    : unit.getUnitType(),
            });
        }

        public updateImageHp(): void {
            const unit          = Helpers.getExisted(this.getUnit());
            const normalizedHp  = unit.getNormalizedCurrentHp();
            if (normalizedHp >= unit.getNormalizedMaxHp()) {
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
                ? ``
                : this._framesForStateAnimation[Timer.getUnitStateIndicatorTickCount() % framesCount];
        }

        protected _getIsDark(): boolean {
            return this._isDark;
        }
        protected _getFramesForStateAnimation(): string[] {
            return this._framesForStateAnimation;
        }

        public moveAlongPath({ path, isDiving, isBlocked, aiming }: {
            path        : GridIndex[];
            isDiving    : boolean;
            isBlocked   : boolean;
            aiming      : GridIndex | null;
        }): Promise<void> {
            this.showUnitAnimation(UnitAnimationType.Move);

            const startingPoint = GridIndexHelpers.createPointByGridIndex(path[0]);
            this.x              = startingPoint.x;
            this.y              = startingPoint.y;

            const unit                  = Helpers.getExisted(this.getUnit());
            const war                   = unit.getWar();
            const playerIndex           = unit.getPlayerIndex();
            const unitType              = unit.getUnitType();
            const watcherTeamIndexes    = war.getPlayerManager().getAliveWatcherTeamIndexesForSelf();
            const isAlwaysVisible       = watcherTeamIndexes.has(unit.getTeamIndex());
            const tween                 = egret.Tween.get(this);
            if (isAlwaysVisible) {
                this.visible = true;
            }
            if ((path.length > 0) || (aiming)) {
                SoundManager.playLongSfxForMoveUnit(unitType);
            }

            for (let i = 1; i < path.length; ++i) {
                const gridIndex = path[i];
                const currentX  = gridIndex.x;
                const previousX = path[i - 1].x;
                if (currentX < previousX) {
                    tween.call(() => this._setImgUnitFlippedX(true));
                } else if (currentX > previousX) {
                    tween.call(() => this._setImgUnitFlippedX(false));
                }

                if (!isAlwaysVisible) {
                    if (isDiving) {
                        tween.call(() => {
                            this.visible = (i === path.length - 1)
                                && (WarVisibilityHelpers.checkIsUnitOnMapVisibleToTeams({
                                    war,
                                    gridIndex,
                                    unitType,
                                    isDiving,
                                    unitPlayerIndex     : playerIndex,
                                    observerTeamIndexes : watcherTeamIndexes,
                                }));
                        });
                    } else {
                        tween.call(() => {
                            this.visible = (WarVisibilityHelpers.checkIsUnitOnMapVisibleToTeams({
                                war,
                                gridIndex           : path[i - 1],
                                unitType,
                                isDiving,
                                unitPlayerIndex     : playerIndex,
                                observerTeamIndexes : watcherTeamIndexes,
                            }))
                            || (WarVisibilityHelpers.checkIsUnitOnMapVisibleToTeams({
                                war,
                                gridIndex,
                                unitType,
                                isDiving,
                                unitPlayerIndex     : playerIndex,
                                observerTeamIndexes : watcherTeamIndexes,
                            }));
                        });
                    }
                }

                tween.to(GridIndexHelpers.createPointByGridIndex(gridIndex), 200);
            }

            const endingGridIndex = path[path.length - 1];
            return new Promise<void>(resolve => {
                if (!aiming) {
                    tween.call(() => {
                        this._setImgUnitFlippedX(playerIndex % 2 === 0);
                        if ((isBlocked)                                         &&
                            (WarVisibilityHelpers.checkIsUnitOnMapVisibleToTeams({
                                war,
                                unitType,
                                isDiving,
                                gridIndex           : endingGridIndex,
                                unitPlayerIndex     : playerIndex,
                                observerTeamIndexes : watcherTeamIndexes,
                            }))
                        ) {
                            war.getGridVisualEffect().showEffectBlock(endingGridIndex);
                        }
                        SoundManager.fadeoutLongSfxForMoveUnit();

                        resolve();
                    });
                } else {
                    const cursor = war.getCursor();
                    tween.call(() => {
                        cursor.setIsMovableByTouches(false);
                        cursor.setIsVisible(false);
                        war.getGridVisualEffect().showEffectAiming(aiming, _AIMING_TIME_MS);
                    })
                    .wait(_AIMING_TIME_MS)
                    .call(() => {
                        cursor.setIsMovableByTouches(true);
                        cursor.setIsVisible(true);
                        this._setImgUnitFlippedX(playerIndex % 2 === 0);
                        if ((isBlocked)                                         &&
                            (WarVisibilityHelpers.checkIsUnitOnMapVisibleToTeams({
                                war,
                                unitType,
                                isDiving,
                                gridIndex           : endingGridIndex,
                                unitPlayerIndex     : playerIndex,
                                observerTeamIndexes : watcherTeamIndexes,
                            }))
                        ) {
                            war.getGridVisualEffect().showEffectBlock(endingGridIndex);
                        }
                        SoundManager.fadeoutLongSfxForMoveUnit();

                        resolve();
                    });
                }
            });
        }
        public moveAlongExtraPath({ path, aiming, deleteViewAfterMoving }: {
            path                    : ProtoTypes.Structure.IGridIndexAndPathInfo[];
            aiming                  : GridIndex | null;
            deleteViewAfterMoving   : boolean;
        }): Promise<void> {
            this.showUnitAnimation(UnitAnimationType.Move);

            const startingPoint = GridIndexHelpers.createPointByGridIndex(Helpers.getExisted(GridIndexHelpers.convertGridIndex(path[0].gridIndex), ClientErrorCode.BwUnitView_MoveAlongExtraPath_00));
            this.x              = startingPoint.x;
            this.y              = startingPoint.y;

            const unit          = Helpers.getExisted(this.getUnit());
            const war           = unit.getWar();
            const unitType      = unit.getUnitType();
            const tween         = egret.Tween.get(this);
            if ((path.length > 0) || (aiming)) {
                SoundManager.playLongSfxForMoveUnit(unitType);
            }

            for (let i = 1; i < path.length; ++i) {
                const node          = path[i];
                const gridIndex     = Helpers.getExisted(GridIndexHelpers.convertGridIndex(node.gridIndex), ClientErrorCode.BwUnitView_MoveAlongExtraPath_01);
                const currentX      = gridIndex.x;
                const previousNode  = path[i - 1];
                const previousX     = Helpers.getExisted(previousNode.gridIndex?.x, ClientErrorCode.BwUnitView_MoveAlongExtraPath_02);
                if (currentX < previousX) {
                    tween.call(() => this._setImgUnitFlippedX(true));
                } else if (currentX > previousX) {
                    tween.call(() => this._setImgUnitFlippedX(false));
                }
                tween.call(() => {
                    this.visible = (!!previousNode.isVisible) || (!!node.isVisible);
                });
                tween.to(GridIndexHelpers.createPointByGridIndex(gridIndex), 200);
            }

            const endingNode        = path[path.length - 1];
            const isBlockedInEnd    = !!endingNode.isBlocked;
            const isVisibleInEnd    = !!endingNode.isVisible;
            const unitMapView       = war.getUnitMap().getView();
            if ((deleteViewAfterMoving) && (!isVisibleInEnd)) {
                tween.call(() => {
                    unitMapView.removeUnit(this);
                });
            }

            const endingGridIndex = Helpers.getExisted(GridIndexHelpers.convertGridIndex(endingNode.gridIndex), ClientErrorCode.BwUnitView_MoveAlongExtraPath_03);
            return new Promise<void>(resolve => {
                if (!aiming) {
                    tween.call(() => {
                        this._setImgUnitFlippedX(unit.getPlayerIndex() % 2 === 0);
                        if ((isBlockedInEnd) && (isVisibleInEnd)) {
                            war.getGridVisualEffect().showEffectBlock(endingGridIndex);
                        }
                        (deleteViewAfterMoving) && (unitMapView.removeUnit(this));

                        SoundManager.fadeoutLongSfxForMoveUnit();

                        resolve();
                    });
                } else {
                    const cursor = war.getCursor();
                    tween.call(() => {
                        cursor.setIsMovableByTouches(false);
                        cursor.setIsVisible(false);
                        war.getGridVisualEffect().showEffectAiming(aiming, _AIMING_TIME_MS);
                    })
                    .wait(_AIMING_TIME_MS)
                    .call(() => {
                        cursor.setIsMovableByTouches(true);
                        cursor.setIsVisible(true);

                        this._setImgUnitFlippedX(unit.getPlayerIndex() % 2 === 0);
                        if ((isBlockedInEnd) && (isVisibleInEnd)) {
                            war.getGridVisualEffect().showEffectBlock(endingGridIndex);
                        }
                        (deleteViewAfterMoving) && (unitMapView.removeUnit(this));

                        SoundManager.fadeoutLongSfxForMoveUnit();

                        resolve();
                    });
                }
            });
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Other functions.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _addFrameForCoSkill(): void {
            const unit          = Helpers.getExisted(this.getUnit());
            const player        = unit.getPlayer();
            const skillType     = player ? player.getCoUsingSkillType() : null;
            const strForSkinId  = Helpers.getNumText(unit.getSkinId());
            if (skillType === Types.CoSkillType.Power) {
                this._framesForStateAnimation.push(`${this._getImageSourcePrefix(this._isDark)}_t99_s08_f${strForSkinId}`);
            } else if (skillType === Types.CoSkillType.SuperPower) {
                this._framesForStateAnimation.push(`${this._getImageSourcePrefix(this._isDark)}_t99_s07_f${strForSkinId}`);
            }
        }
        private _addFrameForPromotion(): void {
            const unit = Helpers.getExisted(this.getUnit());
            if (unit.getHasLoadedCo()) {
                this._framesForStateAnimation.push(`${this._getImageSourcePrefix(this._isDark)}_t99_s05_f99`);
            } else {
                const promotion = unit.getCurrentPromotion();
                if (promotion > 0) {
                    this._framesForStateAnimation.push(`${this._getImageSourcePrefix(this._isDark)}_t99_s05_f${Helpers.getNumText(promotion)}`);
                }
            }
        }
        private _addFrameForFuel(): void {
            if (Helpers.getExisted(this.getUnit()).checkIsFuelInShort()) {
                this._framesForStateAnimation.push(`${this._getImageSourcePrefix(this._isDark)}_t99_s02_f01`);
            }
        }
        private _addFrameForAmmo(): void {
            const unit = Helpers.getExisted(this.getUnit());
            if ((unit.checkIsPrimaryWeaponAmmoInShort()) || (unit.checkIsFlareAmmoInShort())) {
                this._framesForStateAnimation.push(`${this._getImageSourcePrefix(this._isDark)}_t99_s02_f02`);
            }
        }
        private _addFrameForDive(): void {
            const unit = Helpers.getExisted(this.getUnit());
            if (unit.getIsDiving()) {
                this._framesForStateAnimation.push(`${this._getImageSourcePrefix(this._isDark)}_t99_s03_f${Helpers.getNumText(unit.getSkinId())}`);
            }
        }
        private _addFrameForCapture(): void {
            const unit = Helpers.getExisted(this.getUnit());
            if (unit.getIsCapturingTile()) {
                this._framesForStateAnimation.push(`${this._getImageSourcePrefix(this._isDark)}_t99_s04_f${Helpers.getNumText(unit.getSkinId())}`);
            }
        }
        private _addFrameForBuild(): void {
            const unit = Helpers.getExisted(this.getUnit());
            if (unit.getIsBuildingTile()) {
                this._framesForStateAnimation.push(`${this._getImageSourcePrefix(this._isDark)}_t99_s04_f${Helpers.getNumText(unit.getSkinId())}`);
            }
        }
        private _addFrameForLoader(): void {
            const unit  = Helpers.getExisted(this.getUnit());
            const war   = unit.getWar();
            if ((war) && (unit.getMaxLoadUnitsCount())) {
                const strForSkinId = Helpers.getNumText(unit.getSkinId());
                if (!war.getFogMap().checkHasFogCurrently()) {
                    if (unit.getLoadedUnitsCount() > 0) {
                        this._getFramesForStateAnimation().push(`${this._getImageSourcePrefix(this._getIsDark())}_t99_s06_f${strForSkinId}`);
                    }
                } else {
                    if (!war.getPlayerManager().getAliveWatcherTeamIndexesForSelf().has(unit.getTeamIndex())) {
                        this._getFramesForStateAnimation().push(`${this._getImageSourcePrefix(this._getIsDark())}_t99_s06_f${strForSkinId}`);
                    } else {
                        if (unit.getLoadedUnitsCount() > 0) {
                            this._getFramesForStateAnimation().push(`${this._getImageSourcePrefix(this._getIsDark())}_t99_s06_f${strForSkinId}`);
                        }
                    }
                }
            }
        }
        private _addFrameForMaterial(): void {
            const unit = Helpers.getExisted(this.getUnit());
            if ((unit.checkIsBuildMaterialInShort()) || (unit.checkIsProduceMaterialInShort())) {
                this._framesForStateAnimation.push(`${this._getImageSourcePrefix(this._isDark)}_t99_s02_f04`);
            }
        }

        protected _setImgUnitFlippedX(isFlipped: boolean): void {
            this._imgUnit.scaleX = isFlipped ? -1 : 1;
        }

        protected _getImageSourcePrefix(isDark: boolean): string {
            return CommonModel.getUnitAndTileTexturePrefix() + (isDark ? `c07` : `c03`);
        }
    }
}

// export default TwnsBwUnitView;
