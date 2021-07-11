
import { UiImage }              from "../../../gameui/UiImage";
import * as Types               from "../../../utility/Types";
import * as Helpers             from "../../../utility/Helpers";
import * as CommonConstants     from "../../../utility/CommonConstants";
import * as ConfigManager       from "../../../utility/ConfigManager";
import * as BwHelpers           from "../../baseWar/model/BwHelpers";
import * as TimeModel           from "../../time/model/TimeModel";
import * as CommonModel         from "../../common/model/CommonModel";
import * as UserModel           from "../../user/model/UserModel";

const { width: GRID_WIDTH, height: GRID_HEIGHT }    = CommonConstants.GridSize;
const IMG_UNIT_STATE_WIDTH                          = 28;
const IMG_UNIT_STATE_HEIGHT                         = 36;

export class WarMapUnitView extends egret.DisplayObjectContainer {
    private readonly _imgUnit                   = new UiImage();
    private readonly _imgHp                     = new UiImage();
    private readonly _imgState                  = new UiImage();
    private readonly _framesForStateAnimation   : string[] = [];

    private _unitData                           : Types.WarMapUnitViewData;
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
        const gridIndex = data.gridIndex;
        this._unitData  = data;
        this._isDark    = data.actionState === Types.UnitActionState.Acted;
        this.x          = gridIndex.x * GRID_WIDTH - GRID_WIDTH / 4;
        this.y          = gridIndex.y * GRID_HEIGHT - GRID_HEIGHT / 2;
        this.updateOnAnimationTick(tickCount || TimeModel.getUnitAnimationTickCount());

        this._updateImageHp();
        this._resetStateAnimationFrames();
    }

    public getData(): Types.WarMapUnitViewData {
        return this._unitData;
    }

    public updateOnAnimationTick(tickCount: number): void {
        const data = this._unitData;
        if (data) {
            this._tickStateAnimationFrame();
            this._imgUnit.source = CommonModel.getCachedUnitImageSource({
                version     : UserModel.getSelfSettingsTextureVersion(),
                skinId      : data.skinId || ConfigManager.getUnitAndTileDefaultSkinId(data.playerIndex),
                unitType    : data.unitType,
                isMoving    : false,
                isDark      : this._isDark,
                tickCount,
            });
        }
    }

    private _updateImageHp(): void {
        const data          = this._unitData;
        const hp            = data ? data.currentHp : null;
        const normalizedHp  = hp == null ? null : BwHelpers.getNormalizedHp(hp);
        const imgHp         = this._imgHp;
        if ((normalizedHp == null)                                                      ||
            (normalizedHp <= 0)                                                         ||
            (normalizedHp >= BwHelpers.getNormalizedHp(this._getUnitTemplateCfg().maxHp))
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
            ? undefined
            : frames[Math.floor(TimeModel.getUnitAnimationTickCount() / 6) % framesCount];
    }

    private _addFrameForCoSkill(): void {
        const skillType     = this._unitData.coUsingSkillType;
        const strForSkinId  = Helpers.getNumText(this._getSkinId());
        if (skillType === Types.CoSkillType.Power) {
            this._framesForStateAnimation.push(`${getImageSourcePrefix(this._isDark)}_t99_s08_f${strForSkinId}`);
        } else if (skillType === Types.CoSkillType.SuperPower) {
            this._framesForStateAnimation.push(`${getImageSourcePrefix(this._isDark)}_t99_s07_f${strForSkinId}`);
        }
    }
    private _addFrameForPromotion(): void {
        const unit = this._unitData;
        if (unit.hasLoadedCo) {
            this._framesForStateAnimation.push(`${getImageSourcePrefix(this._isDark)}_t99_s05_f99`);
        } else {
            const promotion = unit.currentPromotion;
            if (promotion > 0) {
                this._framesForStateAnimation.push(`${getImageSourcePrefix(this._isDark)}_t99_s05_f${Helpers.getNumText(promotion)}`);
            }
        }
    }
    private _addFrameForFuel(): void {
        if (this._unitData.currentFuel <= this._getUnitTemplateCfg().maxFuel * 0.4) {
            this._framesForStateAnimation.push(`${getImageSourcePrefix(this._isDark)}_t99_s02_f01`);
        }
    }
    private _addFrameForAmmo(): void {
        const unitData  = this._unitData;
        const cfg       = this._getUnitTemplateCfg();
        if ((unitData.primaryWeaponCurrentAmmo <= cfg.primaryWeaponMaxAmmo * 0.4) ||
            (unitData.flareCurrentAmmo <= cfg.flareMaxAmmo * 0.4)
        ) {
            this._framesForStateAnimation.push(`${getImageSourcePrefix(this._isDark)}_t99_s02_f02`);
        }
    }
    private _addFrameForDive(): void {
        if (this._unitData.isDiving) {
            this._framesForStateAnimation.push(`${getImageSourcePrefix(this._isDark)}_t99_s03_f${Helpers.getNumText(this._getSkinId())}`);
        }
    }
    private _addFrameForCapture(): void {
        if (this._unitData.isCapturingTile) {
            this._framesForStateAnimation.push(`${getImageSourcePrefix(this._isDark)}_t99_s04_f${Helpers.getNumText(this._getSkinId())}`);
        }
    }
    private _addFrameForBuild(): void {
        if (this._unitData.isBuildingTile) {
            this._framesForStateAnimation.push(`${getImageSourcePrefix(this._isDark)}_t99_s04_f${Helpers.getNumText(this._getSkinId())}`);
        }
    }
    private _addFrameForLoader(): void {
        if (this._unitData.hasLoadedUnit) {
            this._framesForStateAnimation.push(`${getImageSourcePrefix(this._isDark)}_t99_s06_f${Helpers.getNumText(this._getSkinId())}`);
        }
    }
    private _addFrameForMaterial(): void {
        const unitData  = this._unitData;
        const cfg       = this._getUnitTemplateCfg();
        if ((unitData.currentBuildMaterial <= cfg.maxBuildMaterial * 0.4) ||
            (unitData.currentProduceMaterial <= cfg.maxProduceMaterial * 0.4)
        ) {
            this._framesForStateAnimation.push(`${getImageSourcePrefix(this._isDark)}_t99_s02_f04`);
        }
    }

    private _getUnitTemplateCfg(): Types.UnitTemplateCfg {
        const data = this._unitData;
        return data
            ? ConfigManager.getUnitTemplateCfg(ConfigManager.getLatestFormalVersion(), data.unitType)
            : null;
    }
    private _getSkinId(): number {
        const data = this._unitData;
        return data.skinId || ConfigManager.getUnitAndTileDefaultSkinId(data.playerIndex);
    }
}

function getImageSourcePrefix(isDark: boolean): string {
    return CommonModel.getUnitAndTileTexturePrefix() + (isDark ? `c07` : `c03`);
}
