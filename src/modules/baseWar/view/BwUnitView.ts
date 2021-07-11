
import { BwUnit }               from "../model/BwUnit";
import { UiImage }              from "../../../gameui/UiImage";
import * as TimeModel           from "../../time/model/TimeModel";
import * as CommonModel         from "../../common/model/CommonModel";
import * as UserModel           from "../../user/model/UserModel";
import { Types }                from "../../../utility/Types";
import * as VisibilityHelpers   from "../../../utility/VisibilityHelpers";
import * as GridIndexHelpers    from "../../../utility/GridIndexHelpers";
import * as Helpers             from "../../../utility/Helpers";
import * as CommonConstants     from "../../../utility/CommonConstants";
import UnitAnimationType        = Types.UnitAnimationType;
import GridIndex                = Types.GridIndex;

const { width: _GRID_WIDTH, height: _GRID_HEIGHT }  = CommonConstants.GridSize;
const _IMG_UNIT_STAND_ANCHOR_OFFSET_X               = _GRID_WIDTH * 3 / 4;
const _IMG_UNIT_STAND_ANCHOR_OFFSET_Y               = _GRID_HEIGHT / 2;
const _IMG_UNIT_STAND_X                             = _GRID_WIDTH * 2 / 4;
const _IMG_UNIT_STATE_WIDTH                         = 28;
const _IMG_UNIT_STATE_HEIGHT                        = 36;

export class BwUnitView extends egret.DisplayObjectContainer {
    private _imgHp      = new UiImage();
    private _imgState   = new UiImage();
    private _imgUnit    = new UiImage();

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
        this._setUnit(unit);

        return this;
    }

    public startRunningView(): BwUnitView {
        this.resetAllViews();

        return this;
    }

    private _setUnit(unit: BwUnit): void {
        this._unit = unit;
    }
    public getUnit(): BwUnit {
        return this._unit;
    }

    public resetAllViews(): void {
        this._isDark = this.getUnit().getActionState() === Types.UnitActionState.Acted;
        this.resetStateAnimationFrames();
        this.showUnitAnimation(UnitAnimationType.Stand);
        this.updateImageHp();
    }

    public showUnitAnimation(type: UnitAnimationType): void {
        this._animationType = type;
        this.tickUnitAnimationFrame();
    }
    public tickUnitAnimationFrame(): void {
        const unit              = this.getUnit();
        this._imgUnit.source    = CommonModel.getCachedUnitImageSource({
            version     : UserModel.getSelfSettingsTextureVersion(),
            isDark      : this._isDark,
            isMoving    : this._animationType === UnitAnimationType.Move,
            tickCount   : TimeModel.getUnitAnimationTickCount(),
            skinId      : unit.getSkinId(),
            unitType    : unit.getUnitType(),
        });
    }

    public updateImageHp(): void {
        const unit          = this.getUnit();
        const normalizedHp  = unit.getNormalizedCurrentHp();
        if ((normalizedHp >= unit.getNormalizedMaxHp()) || (normalizedHp <= 0)) {
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

    protected _getIsDark(): boolean {
        return this._isDark;
    }
    protected _getFramesForStateAnimation(): string[] {
        return this._framesForStateAnimation;
    }

    public moveAlongPath(
        path        : GridIndex[],
        isDiving    : boolean,
        isBlocked   : boolean,
        aiming      : GridIndex | null | undefined
    ): Promise<void> {
        this.showUnitAnimation(UnitAnimationType.Move);

        const startingPoint = GridIndexHelpers.createPointByGridIndex(path[0]);
        this.x              = startingPoint.x;
        this.y              = startingPoint.y;

        const unit                  = this.getUnit();
        const war                   = unit.getWar();
        const playerIndex           = unit.getPlayerIndex();
        const skinIdMod             = unit.getSkinId() % 2;
        const unitType              = unit.getUnitType();
        const watcherTeamIndexes    = war.getPlayerManager().getAliveWatcherTeamIndexesForSelf();
        const isAlwaysVisible       = watcherTeamIndexes.has(unit.getTeamIndex());
        const tween                 = egret.Tween.get(this);
        if (isAlwaysVisible) {
            this.visible = true;
        }

        for (let i = 1; i < path.length; ++i) {
            const gridIndex = path[i];
            const currentX  = gridIndex.x;
            const previousX = path[i - 1].x;
            if (currentX < previousX) {
                tween.call(() => this._setImgUnitFlippedX(skinIdMod === 1));
            } else if (currentX > previousX) {
                tween.call(() => this._setImgUnitFlippedX(skinIdMod === 0));
            }

            if (!isAlwaysVisible) {
                if (isDiving) {
                    tween.call(() => {
                        this.visible = (i === path.length - 1)
                            && (VisibilityHelpers.checkIsUnitOnMapVisibleToTeams({
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
                        this.visible = (VisibilityHelpers.checkIsUnitOnMapVisibleToTeams({
                            war,
                            gridIndex           : path[i - 1],
                            unitType,
                            isDiving,
                            unitPlayerIndex     : playerIndex,
                            observerTeamIndexes : watcherTeamIndexes,
                        }))
                        || (VisibilityHelpers.checkIsUnitOnMapVisibleToTeams({
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
                    this._setImgUnitFlippedX(false);
                    if ((isBlocked)                                         &&
                        (VisibilityHelpers.checkIsUnitOnMapVisibleToTeams({
                            war,
                            unitType,
                            isDiving,
                            gridIndex           : endingGridIndex,
                            unitPlayerIndex     : playerIndex,
                            observerTeamIndexes : watcherTeamIndexes,
                        }))
                    ) {
                        war.getGridVisionEffect().showEffectBlock(endingGridIndex);
                    }

                    resolve();
                });
            } else {
                const cursor = war.getCursor();
                tween.call(() => {
                    cursor.setIsMovableByTouches(false);
                    cursor.setGridIndex(aiming);
                    cursor.updateView();
                    cursor.setVisibleForConForTarget(true);
                    cursor.setVisibleForConForNormal(false);
                })
                .wait(500)
                .call(() => {
                    cursor.setIsMovableByTouches(true);
                    cursor.updateView();
                    this._setImgUnitFlippedX(false);
                    if ((isBlocked)                                         &&
                        (VisibilityHelpers.checkIsUnitOnMapVisibleToTeams({
                            war,
                            unitType,
                            isDiving,
                            gridIndex           : endingGridIndex,
                            unitPlayerIndex     : playerIndex,
                            observerTeamIndexes : watcherTeamIndexes,
                        }))
                    ) {
                        war.getGridVisionEffect().showEffectBlock(endingGridIndex);
                    }

                    resolve();
                });
            }
        });
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Other functions.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _addFrameForCoSkill(): void {
        const unit          = this._unit;
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
        const unit = this._unit;
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
        const unit = this._unit;
        if (unit.getIsDiving()) {
            this._framesForStateAnimation.push(`${this._getImageSourcePrefix(this._isDark)}_t99_s03_f${Helpers.getNumText(unit.getSkinId())}`);
        }
    }
    private _addFrameForCapture(): void {
        const unit = this._unit;
        if (unit.getIsCapturingTile()) {
            this._framesForStateAnimation.push(`${this._getImageSourcePrefix(this._isDark)}_t99_s04_f${Helpers.getNumText(unit.getSkinId())}`);
        }
    }
    private _addFrameForBuild(): void {
        const unit = this._unit;
        if (unit.getIsBuildingTile()) {
            this._framesForStateAnimation.push(`${this._getImageSourcePrefix(this._isDark)}_t99_s04_f${Helpers.getNumText(unit.getSkinId())}`);
        }
    }
    private _addFrameForLoader(): void {
        const unit  = this.getUnit();
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
        if ((this._unit.checkIsBuildMaterialInShort()) || (this._unit.checkIsProduceMaterialInShort())) {
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
