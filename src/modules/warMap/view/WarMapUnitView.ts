
// import CommonModel      from "../../common/model/CommonModel";
// import CommonConstants  from "../../tools/helpers/CommonConstants";
// import ConfigManager    from "../../tools/helpers/ConfigManager";
// import GridIndexHelpers from "../../tools/helpers/GridIndexHelpers";
// import Helpers          from "../../tools/helpers/Helpers";
// import Timer            from "../../tools/helpers/Timer";
// import Types            from "../../tools/helpers/Types";
// import TwnsUiImage      from "../../tools/ui/UiImage";
// import WarCommonHelpers from "../../tools/warHelpers/WarCommonHelpers";
// import UserModel        from "../../user/model/UserModel";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.WarMap {
    const { width: GRID_WIDTH, height: GRID_HEIGHT }    = Twns.CommonConstants.GridSize;
    const IMG_UNIT_STATE_WIDTH                          = 10;
    const IMG_UNIT_STATE_HEIGHT                         = 12;

    export class WarMapUnitView extends egret.DisplayObjectContainer {
        private readonly _imgUnit                   = new TwnsUiImage.UiImage();
        private readonly _imgHp                     = new TwnsUiImage.UiImage();
        private readonly _imgState                  = new TwnsUiImage.UiImage();
        private readonly _framesForStateAnimation   : string[] = [];

        private _unitData                           : Twns.Types.WarMapUnitViewData | null = null;
        private _isDark                             = false;

        public constructor(data?: Twns.Types.WarMapUnitViewData, tickCount?: number) {
            super();

            const imgUnit       = this._imgUnit;
            imgUnit.smoothing   = false;
            imgUnit.bottom      = -GRID_HEIGHT;
            this.addChild(imgUnit);

            const imgHp     = this._imgHp;
            imgHp.smoothing = false;
            imgHp.x         = GRID_WIDTH - IMG_UNIT_STATE_WIDTH - 1 + GRID_WIDTH / 4;
            imgHp.y         = GRID_HEIGHT - IMG_UNIT_STATE_HEIGHT + GRID_HEIGHT / 2;
            this.addChild(imgHp);

            const imgState      = this._imgState;
            imgState.smoothing  = false;
            imgState.x          = 0 + GRID_WIDTH / 4;
            imgState.y          = GRID_HEIGHT - IMG_UNIT_STATE_HEIGHT + GRID_HEIGHT / 2;
            this.addChild(imgState);

            (data) && (this.update(data, tickCount));
        }

        public update(data: Twns.Types.WarMapUnitViewData, tickCount?: number): void {
            this._setUnitData(data);

            const gridIndex = Twns.Helpers.getExisted(Twns.GridIndexHelpers.convertGridIndex(data.gridIndex));
            this._isDark    = data.actionState === Twns.Types.UnitActionState.Acted;
            this.x          = gridIndex.x * GRID_WIDTH - GRID_WIDTH / 4;
            this.y          = gridIndex.y * GRID_HEIGHT - GRID_HEIGHT / 2;
            this.updateOnAnimationTick(tickCount || Twns.Timer.getUnitAnimationTickCount());

            this._updateImageHp();
            this._resetStateAnimationFrames();
        }

        public getUnitData(): Twns.Types.WarMapUnitViewData | null {
            return this._unitData;
        }
        private _setUnitData(data: Twns.Types.WarMapUnitViewData): void {
            this._unitData = data;
        }

        public updateOnAnimationTick(tickCount: number): void {
            const data = this.getUnitData();
            if (data == null) {
                return;
            }

            this._imgUnit.source = Twns.Common.CommonModel.getCachedUnitImageSource({
                version     : Twns.User.UserModel.getSelfSettingsTextureVersion(),
                skinId      : data.skinId || Twns.Config.ConfigManager.getUnitAndTileDefaultSkinId(Twns.Helpers.getExisted(data.playerIndex)),
                unitType    : Twns.Helpers.getExisted(data.unitType),
                isMoving    : false,
                isDark      : this._isDark,
                tickCount,
            });
        }

        public updateOnStateIndicatorTick(): void {
            if (this.getUnitData() != null) {
                this._tickStateAnimationFrame();
            }
        }

        private _updateImageHp(): void {
            const unitData = this.getUnitData();
            if (unitData == null) {
                return;
            }

            const hp            = unitData.currentHp;
            const normalizedHp  = hp == null ? null : Twns.WarHelpers.WarCommonHelpers.getNormalizedHp(hp);
            const imgHp         = this._imgHp;
            if ((normalizedHp == null)                                                      ||
                (normalizedHp >= Twns.WarHelpers.WarCommonHelpers.getNormalizedHp(this._getUnitTemplateCfg().maxHp))
            ) {
                imgHp.visible = false;
            } else {
                imgHp.visible   = true;
                imgHp.source    = `${getImageSourcePrefix(this._isDark)}_t99_s01_f${Twns.Helpers.getNumText(normalizedHp)}`;
            }
        }
        private _resetStateAnimationFrames(): void {
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

            this._tickStateAnimationFrame();
        }
        private _tickStateAnimationFrame(): void {
            const frames            = this._framesForStateAnimation;
            const framesCount       = frames.length;
            this._imgState.source   = framesCount <= 0
                ? ``
                : frames[Twns.Timer.getUnitAnimationTickCount() % framesCount];
        }

        private _addFrameForCoSkill(): void {
            const unitData = this.getUnitData();
            if (unitData == null) {
                return;
            }

            const skillType     = unitData.coUsingSkillType;
            const strForSkinId  = Twns.Helpers.getNumText(this._getSkinId());
            if (skillType === Twns.Types.CoSkillType.Power) {
                this._framesForStateAnimation.push(`${getImageSourcePrefix(this._isDark)}_t99_s08_f${strForSkinId}`);
            } else if (skillType === Twns.Types.CoSkillType.SuperPower) {
                this._framesForStateAnimation.push(`${getImageSourcePrefix(this._isDark)}_t99_s07_f${strForSkinId}`);
            }
        }
        private _addFrameForPromotion(): void {
            const unitData = this.getUnitData();
            if (unitData == null) {
                return;
            }

            if (unitData.hasLoadedCo) {
                this._framesForStateAnimation.push(`${getImageSourcePrefix(this._isDark)}_t99_s05_f99`);
            } else {
                const promotion = unitData.currentPromotion;
                if ((promotion != null) && (promotion > 0)) {
                    this._framesForStateAnimation.push(`${getImageSourcePrefix(this._isDark)}_t99_s05_f${Twns.Helpers.getNumText(promotion)}`);
                }
            }
        }
        private _addFrameForFuel(): void {
            const unitData = this.getUnitData();
            if (unitData == null) {
                return;
            }

            const fuel = unitData.currentFuel;
            if ((fuel != null) && (fuel <= this._getUnitTemplateCfg().maxFuel * 0.4)) {
                this._framesForStateAnimation.push(`${getImageSourcePrefix(this._isDark)}_t99_s02_f01`);
            }
        }
        private _addFrameForAmmo(): void {
            const unitData = this.getUnitData();
            if (unitData == null) {
                return;
            }

            const cfg                       = this._getUnitTemplateCfg();
            const primaryWeaponMaxAmmo      = cfg.primaryWeaponMaxAmmo;
            const flareMaxAmmo              = cfg.flareMaxAmmo;
            const primaryWeaponCurrentAmmo  = unitData.primaryWeaponCurrentAmmo;
            const flareCurrentAmmo          = unitData.flareCurrentAmmo;
            if (((primaryWeaponMaxAmmo != null) && (primaryWeaponCurrentAmmo != null) && (primaryWeaponCurrentAmmo <= primaryWeaponMaxAmmo * 0.4)) ||
                ((flareMaxAmmo != null) && (flareCurrentAmmo != null) && (flareCurrentAmmo <= flareMaxAmmo * 0.4))
            ) {
                this._framesForStateAnimation.push(`${getImageSourcePrefix(this._isDark)}_t99_s02_f02`);
            }
        }
        private _addFrameForDive(): void {
            const unitData = this.getUnitData();
            if ((unitData) && (unitData.isDiving)) {
                this._framesForStateAnimation.push(`${getImageSourcePrefix(this._isDark)}_t99_s03_f${Twns.Helpers.getNumText(this._getSkinId())}`);
            }
        }
        private _addFrameForCapture(): void {
            const unitData = this.getUnitData();
            if ((unitData) && (unitData.isCapturingTile)) {
                this._framesForStateAnimation.push(`${getImageSourcePrefix(this._isDark)}_t99_s04_f${Twns.Helpers.getNumText(this._getSkinId())}`);
            }
        }
        private _addFrameForBuild(): void {
            const unitData = this.getUnitData();
            if ((unitData) && (unitData.isBuildingTile)) {
                this._framesForStateAnimation.push(`${getImageSourcePrefix(this._isDark)}_t99_s04_f${Twns.Helpers.getNumText(this._getSkinId())}`);
            }
        }
        private _addFrameForLoader(): void {
            const unitData = this.getUnitData();
            if ((unitData) && (unitData.hasLoadedUnit)) {
                this._framesForStateAnimation.push(`${getImageSourcePrefix(this._isDark)}_t99_s06_f${Twns.Helpers.getNumText(this._getSkinId())}`);
            }
        }
        private _addFrameForMaterial(): void {
            const unitData = this.getUnitData();
            if (unitData == null) {
                return;
            }

            const cfg                       = this._getUnitTemplateCfg();
            const maxBuildMaterial          = cfg.maxBuildMaterial;
            const maxProduceMaterial        = cfg.maxProduceMaterial;
            const currentBuildMaterial      = unitData.currentBuildMaterial;
            const currentProduceMaterial    = unitData.currentProduceMaterial;
            if (((maxBuildMaterial != null) && (currentBuildMaterial != null) && (currentBuildMaterial <= maxBuildMaterial * 0.4))          ||
                ((maxProduceMaterial != null) && (currentProduceMaterial != null) && (currentProduceMaterial <= maxProduceMaterial * 0.4))
            ) {
                this._framesForStateAnimation.push(`${getImageSourcePrefix(this._isDark)}_t99_s02_f04`);
            }
        }

        private _getUnitTemplateCfg(): Twns.Types.UnitTemplateCfg {
            const data = Twns.Helpers.getExisted(this.getUnitData());
            return Twns.Helpers.getExisted(data.gameConfig.getUnitTemplateCfg(Twns.Helpers.getExisted(data.unitType)));
        }
        private _getSkinId(): number {
            const data = this.getUnitData();
            return data?.skinId ?? Twns.Config.ConfigManager.getUnitAndTileDefaultSkinId(Twns.Helpers.getExisted(data?.playerIndex));
        }
    }

    function getImageSourcePrefix(isDark: boolean): string {
        return Twns.Common.CommonModel.getUnitAndTileTexturePrefix() + (isDark ? `c07` : `c03`);
    }
}

// export default TwnsWarMapUnitView;
