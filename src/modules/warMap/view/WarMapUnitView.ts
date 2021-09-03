
import CommonModel      from "../../common/model/CommonModel";
import CommonConstants  from "../../tools/helpers/CommonConstants";
import ConfigManager    from "../../tools/helpers/ConfigManager";
import GridIndexHelpers from "../../tools/helpers/GridIndexHelpers";
import Helpers          from "../../tools/helpers/Helpers";
import Timer            from "../../tools/helpers/Timer";
import Types            from "../../tools/helpers/Types";
import TwnsUiImage      from "../../tools/ui/UiImage";
import WarCommonHelpers from "../../tools/warHelpers/WarCommonHelpers";
import UserModel        from "../../user/model/UserModel";

namespace TwnsWarMapUnitView {
    const { width: GRID_WIDTH, height: GRID_HEIGHT }    = CommonConstants.GridSize;
    const IMG_UNIT_STATE_WIDTH                          = 28;
    const IMG_UNIT_STATE_HEIGHT                         = 36;

    export class WarMapUnitView extends egret.DisplayObjectContainer {
        private readonly _imgUnit                   = new TwnsUiImage.UiImage();
        private readonly _imgHp                     = new TwnsUiImage.UiImage();
        private readonly _imgState                  = new TwnsUiImage.UiImage();
        private readonly _framesForStateAnimation   : string[] = [];

        private _unitData?                          : Types.WarMapUnitViewData;
        private _isDark                             = false;

        public constructor(data?: Types.WarMapUnitViewData, tickCount?: number) {
            super();

            const imgUnit   = this._imgUnit;
            imgUnit.bottom  = -GRID_HEIGHT;
            this.addChild(imgUnit);

            const imgHp = this._imgHp;
            imgHp.x     = GRID_WIDTH - IMG_UNIT_STATE_WIDTH - 3 + GRID_WIDTH / 4;
            imgHp.y     = GRID_HEIGHT - IMG_UNIT_STATE_HEIGHT + GRID_HEIGHT / 2;
            this.addChild(imgHp);

            const imgState  = this._imgState;
            imgState.x      = 0 + GRID_WIDTH / 4;
            imgState.y      = GRID_HEIGHT - IMG_UNIT_STATE_HEIGHT + GRID_HEIGHT / 2;
            this.addChild(imgState);

            (data) && (this.update(data, tickCount));
        }

        public update(data: Types.WarMapUnitViewData, tickCount?: number): void {
            this._setUnitData(data);

            const gridIndex = Helpers.getExisted(GridIndexHelpers.convertGridIndex(data.gridIndex));
            this._isDark    = data.actionState === Types.UnitActionState.Acted;
            this.x          = gridIndex.x * GRID_WIDTH - GRID_WIDTH / 4;
            this.y          = gridIndex.y * GRID_HEIGHT - GRID_HEIGHT / 2;
            this.updateOnAnimationTick(tickCount || Timer.getUnitAnimationTickCount());

            this._updateImageHp();
            this._resetStateAnimationFrames();
        }

        public getUnitData(): Types.WarMapUnitViewData {
            return Helpers.getDefined(this._unitData);
        }
        private _setUnitData(data: Types.WarMapUnitViewData): void {
            this._unitData = data;
        }

        public updateOnAnimationTick(tickCount: number): void {
            const data = this.getUnitData();
            this._tickStateAnimationFrame();
            this._imgUnit.source = CommonModel.getCachedUnitImageSource({
                version     : UserModel.getSelfSettingsTextureVersion(),
                skinId      : data.skinId || ConfigManager.getUnitAndTileDefaultSkinId(Helpers.getExisted(data.playerIndex)),
                unitType    : Helpers.getExisted(data.unitType),
                isMoving    : false,
                isDark      : this._isDark,
                tickCount,
            });
        }

        private _updateImageHp(): void {
            const hp            = this.getUnitData().currentHp;
            const normalizedHp  = hp == null ? null : WarCommonHelpers.getNormalizedHp(hp);
            const imgHp         = this._imgHp;
            if ((normalizedHp == null)                                                      ||
                (normalizedHp <= 0)                                                         ||
                (normalizedHp >= WarCommonHelpers.getNormalizedHp(this._getUnitTemplateCfg().maxHp))
            ) {
                imgHp.visible = false;
            } else {
                imgHp.visible   = true;
                imgHp.source    = `${getImageSourcePrefix(this._isDark)}_t99_s01_f${Helpers.getNumText(normalizedHp)}`;
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
                : frames[Math.floor(Timer.getUnitAnimationTickCount() / 6) % framesCount];
        }

        private _addFrameForCoSkill(): void {
            const skillType     = this.getUnitData().coUsingSkillType;
            const strForSkinId  = Helpers.getNumText(this._getSkinId());
            if (skillType === Types.CoSkillType.Power) {
                this._framesForStateAnimation.push(`${getImageSourcePrefix(this._isDark)}_t99_s08_f${strForSkinId}`);
            } else if (skillType === Types.CoSkillType.SuperPower) {
                this._framesForStateAnimation.push(`${getImageSourcePrefix(this._isDark)}_t99_s07_f${strForSkinId}`);
            }
        }
        private _addFrameForPromotion(): void {
            const unitData = this.getUnitData();
            if (unitData.hasLoadedCo) {
                this._framesForStateAnimation.push(`${getImageSourcePrefix(this._isDark)}_t99_s05_f99`);
            } else {
                const promotion = unitData.currentPromotion;
                if ((promotion != null) && (promotion > 0)) {
                    this._framesForStateAnimation.push(`${getImageSourcePrefix(this._isDark)}_t99_s05_f${Helpers.getNumText(promotion)}`);
                }
            }
        }
        private _addFrameForFuel(): void {
            const fuel = this.getUnitData().currentFuel;
            if ((fuel != null) && (fuel <= this._getUnitTemplateCfg().maxFuel * 0.4)) {
                this._framesForStateAnimation.push(`${getImageSourcePrefix(this._isDark)}_t99_s02_f01`);
            }
        }
        private _addFrameForAmmo(): void {
            const unitData                  = this.getUnitData();
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
            if (this.getUnitData().isDiving) {
                this._framesForStateAnimation.push(`${getImageSourcePrefix(this._isDark)}_t99_s03_f${Helpers.getNumText(this._getSkinId())}`);
            }
        }
        private _addFrameForCapture(): void {
            if (this.getUnitData().isCapturingTile) {
                this._framesForStateAnimation.push(`${getImageSourcePrefix(this._isDark)}_t99_s04_f${Helpers.getNumText(this._getSkinId())}`);
            }
        }
        private _addFrameForBuild(): void {
            if (this.getUnitData().isBuildingTile) {
                this._framesForStateAnimation.push(`${getImageSourcePrefix(this._isDark)}_t99_s04_f${Helpers.getNumText(this._getSkinId())}`);
            }
        }
        private _addFrameForLoader(): void {
            if (this.getUnitData().hasLoadedUnit) {
                this._framesForStateAnimation.push(`${getImageSourcePrefix(this._isDark)}_t99_s06_f${Helpers.getNumText(this._getSkinId())}`);
            }
        }
        private _addFrameForMaterial(): void {
            const unitData              = this.getUnitData();
            const cfg                   = this._getUnitTemplateCfg();
            const maxBuildMaterial      = cfg.maxBuildMaterial;
            const maxProduceMaterial    = cfg.maxProduceMaterial;
            if (((maxBuildMaterial != null) && (Helpers.getExisted(unitData.currentBuildMaterial) <= maxBuildMaterial * 0.4)) ||
                ((maxProduceMaterial != null) && (Helpers.getExisted(unitData.currentProduceMaterial) <= maxProduceMaterial * 0.4))
            ) {
                this._framesForStateAnimation.push(`${getImageSourcePrefix(this._isDark)}_t99_s02_f04`);
            }
        }

        private _getUnitTemplateCfg(): Types.UnitTemplateCfg {
            return ConfigManager.getUnitTemplateCfg(Helpers.getExisted(ConfigManager.getLatestConfigVersion()), Helpers.getExisted(this.getUnitData().unitType));
        }
        private _getSkinId(): number {
            const data = this.getUnitData();
            return data.skinId ?? ConfigManager.getUnitAndTileDefaultSkinId(Helpers.getExisted(data.playerIndex));
        }
    }

    function getImageSourcePrefix(isDark: boolean): string {
        return CommonModel.getUnitAndTileTexturePrefix() + (isDark ? `c07` : `c03`);
    }
}

export default TwnsWarMapUnitView;
