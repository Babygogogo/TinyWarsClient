
import TwnsUiImage          from "../../../utility/ui/UiImage";
import { BwGridVisualEffect }   from "../model/BwGridVisualEffect";
import { CommonConstants }      from "../../../utility/CommonConstants";
import { GridIndexHelpers }     from "../../../utility/GridIndexHelpers";
import { Helpers }              from "../../../utility/Helpers";
import { Types }                from "../../../utility/Types";
import GridIndex                = Types.GridIndex;

const { width: _GRID_WIDTH, height: _GRID_HEIGHT } = CommonConstants.GridSize;
const BLOCK_OFFSET_X            = Math.floor(_GRID_WIDTH * 0.3);
const BLOCK_OFFSET_Y            = Math.floor(_GRID_HEIGHT * 0.3);
const DIVE_OFFSET_X             = -_GRID_WIDTH;
const DIVE_OFFSET_Y             = -_GRID_HEIGHT;
const EXPLOSION_OFFSET_X        = -_GRID_WIDTH;
const EXPLOSION_OFFSET_Y        = -_GRID_HEIGHT * 2;
const DAMAGE_OFFSET_X           = -_GRID_WIDTH;
const DAMAGE_OFFSET_Y           = -_GRID_HEIGHT;
const SUPPLY_OFFSET_X           = Math.floor(_GRID_WIDTH * 0.3);
const SUPPLY_OFFSET_Y           = Math.floor(_GRID_HEIGHT * 0.3);
const REPAIR_OFFSET_X           = Math.floor(_GRID_WIDTH * 0.3);
const REPAIR_OFFSET_Y           = Math.floor(_GRID_HEIGHT * 0.3);
const SKILL_ACTIVATION_OFFSET_X = - (336 -_GRID_WIDTH) / 2;
const SKILL_ACTIVATION_OFFSET_Y = - (336 -_GRID_HEIGHT) / 2;

export class BwGridVisualEffectView extends egret.DisplayObjectContainer {
    private _gridVisualEffect           : BwGridVisualEffect;

    private _layerForBlock              = new egret.DisplayObjectContainer();
    private _layerForDive               = new egret.DisplayObjectContainer();
    private _layerForSurface            = new egret.DisplayObjectContainer();
    private _layerForExplosion          = new egret.DisplayObjectContainer();
    private _layerForDamage             = new egret.DisplayObjectContainer();
    private _layerForFlare              = new egret.DisplayObjectContainer();
    private _layerForSupply             = new egret.DisplayObjectContainer();
    private _layerForRepair             = new egret.DisplayObjectContainer();
    private _layerForSkillActivation    = new egret.DisplayObjectContainer();

    public constructor() {
        super();

        this.addChild(this._layerForRepair);
        this.addChild(this._layerForSupply);
        this.addChild(this._layerForBlock);
        this.addChild(this._layerForSurface);
        this.addChild(this._layerForDive);
        this.addChild(this._layerForExplosion);
        this.addChild(this._layerForDamage);
        this.addChild(this._layerForFlare);
        this.addChild(this._layerForSkillActivation);
    }

    public init(gridVisualEffect: BwGridVisualEffect): void {
        this._gridVisualEffect = gridVisualEffect;
    }
    public fastInit(gridVisualEffect: BwGridVisualEffect): void {
        this._gridVisualEffect = gridVisualEffect;
    }

    public startRunningView(): void {
        // nothing to do
    }
    public stopRunningView(): void {
        // nothing to do
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // The public functions.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    public showEffectBlock(gridIndex: GridIndex): void {
        this._layerForBlock.addChild(createEffectBlock(gridIndex));
    }

    public showEffectDive(gridIndex: GridIndex): void {
        this._layerForDive.addChild(createEffectDive(gridIndex));
    }

    public showEffectExplosion(gridIndex: GridIndex): void {
        this._layerForExplosion.addChild(createEffectExplosion(gridIndex));
    }

    public showEffectFlare(gridIndex: GridIndex): void {
        this._layerForFlare.addChild(createEffectFlare(gridIndex));
    }

    public showEffectDamage(gridIndex: GridIndex): void {
        this._layerForDamage.addChild(createEffectDamage(gridIndex));
    }

    public showEffectSupply(gridIndex: GridIndex): void {
        this._layerForSupply.addChild(createEffectSupply(gridIndex));
    }

    public showEffectRepair(gridIndex: GridIndex): void {
        this._layerForRepair.addChild(createEffectRepair(gridIndex));
    }

    public showEffectSiloExplosion(gridIndex: GridIndex): void {
        this._layerForExplosion.addChild(createEffectSiloExplosion(gridIndex));
    }

    public showEffectSkillActivation(gridIndex: GridIndex): void {
        this._layerForSkillActivation.addChild(createEffectSkillActivation(gridIndex));
    }

    public showEffectSurface(gridIndex: GridIndex): void {
        this._layerForSurface.addChild(createEffectSurface(gridIndex));
    }
}

function createEffectBlock(gridIndex: GridIndex): egret.DisplayObject {
    const img           = new TwnsUiImage.UiImage(`c04_t08_s05_f01`);
    img.anchorOffsetX   = 174;
    img.anchorOffsetY   = 54;
    img.scaleX          = 2;
    img.scaleY          = 2;

    const pos   = GridIndexHelpers.createPointByGridIndex(gridIndex);
    img.x       = BLOCK_OFFSET_X + pos.x;
    img.y       = BLOCK_OFFSET_Y + pos.y;

    egret.Tween.get(img)
        .to({ scaleX: 1, scaleY: 1 }, 100)
        .wait(600)
        .call(() => (img.parent) && (img.parent.removeChild(img)));

    return img;
}

function createEffectDive(gridIndex: GridIndex): egret.DisplayObject {
    const img   = new TwnsUiImage.UiImage(`c04_t08_s07_f01`);
    const pos   = GridIndexHelpers.createPointByGridIndex(gridIndex);
    img.x       = DIVE_OFFSET_X + pos.x;
    img.y       = DIVE_OFFSET_Y + pos.y;

    const tween = egret.Tween.get(img);
    for (let i = 2; i <= 7; ++i) {
        tween.wait(50).set({ source: `c04_t08_s07_f${Helpers.getNumText(i, 2)}` });
    }
    tween.call(() => (img.parent) && (img.parent.removeChild(img)));

    return img;
}

function createEffectExplosion(gridIndex: GridIndex): egret.DisplayObject {
    const img   = new TwnsUiImage.UiImage(`c04_t08_s01_f01`);
    const pos   = GridIndexHelpers.createPointByGridIndex(gridIndex);
    img.x       = EXPLOSION_OFFSET_X + pos.x;
    img.y       = EXPLOSION_OFFSET_Y + pos.y;

    const tween = egret.Tween.get(img);
    for (let i = 2; i <= 9; ++i) {
        tween.wait(50).set({ source: `c04_t08_s01_f${Helpers.getNumText(i, 2)}` });
    }
    tween.call(() => (img.parent) && (img.parent.removeChild(img)));

    return img;
}

function createEffectFlare(gridIndex: GridIndex): egret.DisplayObject {
    return createEffectDamage(gridIndex);
}

function createEffectDamage(gridIndex: GridIndex): egret.DisplayObject {
    const img   = new TwnsUiImage.UiImage(`c04_t08_s02_f01`);
    const pos   = GridIndexHelpers.createPointByGridIndex(gridIndex);
    img.x       = DAMAGE_OFFSET_X + pos.x;
    img.y       = DAMAGE_OFFSET_Y + pos.y;

    const tween = egret.Tween.get(img);
    for (let i = 2; i <= 8; ++i) {
        tween.wait(50).set({ source: `c04_t08_s02_f${Helpers.getNumText(i, 2)}` });
    }
    tween.call(() => (img.parent) && (img.parent.removeChild(img)));

    return img;
}

function createEffectSupply(gridIndex: GridIndex): egret.DisplayObject {
    const img           = new TwnsUiImage.UiImage("c04_t08_s03_f01");
    img.anchorOffsetX   = 180;
    img.anchorOffsetY   = 54;
    img.scaleX          = 2;
    img.scaleY          = 2;

    const pos   = GridIndexHelpers.createPointByGridIndex(gridIndex);
    img.x       = SUPPLY_OFFSET_X + pos.x;
    img.y       = SUPPLY_OFFSET_Y + pos.y;

    egret.Tween.get(img)
        .to({ scaleX: 1, scaleY: 1 }, 100)
        .wait(600)
        .call(() => (img.parent) && (img.parent.removeChild(img)));

    return img;
}

function createEffectRepair(gridIndex: GridIndex): egret.DisplayObject {
    const img           = new TwnsUiImage.UiImage("c04_t08_s04_f01");
    img.anchorOffsetX   = 180;
    img.anchorOffsetY   = 54;
    img.scaleX          = 2;
    img.scaleY          = 2;

    const pos   = GridIndexHelpers.createPointByGridIndex(gridIndex);
    img.x       = REPAIR_OFFSET_X + pos.x;
    img.y       = REPAIR_OFFSET_Y + pos.y;

    egret.Tween.get(img)
        .to({ scaleX: 1, scaleY: 1 }, 100)
        .wait(600)
        .call(() => (img.parent) && (img.parent.removeChild(img)));

    return img;
}

function createEffectSiloExplosion(gridIndex: GridIndex): egret.DisplayObject {
    const img   = new TwnsUiImage.UiImage(`c04_t08_s02_f01`);
    const pos   = GridIndexHelpers.createPointByGridIndex(gridIndex);
    img.x       = DAMAGE_OFFSET_X + pos.x;
    img.y       = DAMAGE_OFFSET_Y + pos.y;

    const tween = egret.Tween.get(img);
    for (let i = 2; i <= 8; ++i) {
        tween.wait(50).set({ source: `c04_t08_s02_f${Helpers.getNumText(i, 2)}` });
    }

    tween.set({ x: EXPLOSION_OFFSET_X + pos.x, y: EXPLOSION_OFFSET_Y + pos.y, source: `c04_t08_s01_f01` });
    for (let i = 2; i <= 9; ++i) {
        tween.wait(50).set({ source: `c04_t08_s01_f${Helpers.getNumText(i, 2)}` });
    }

    tween.call(() => (img.parent) && (img.parent.removeChild(img)));

    return img;
}

function createEffectSkillActivation(gridIndex: GridIndex): egret.DisplayObject {
    const img   = new TwnsUiImage.UiImage(`c04_t08_s06_f01`);
    const pos   = GridIndexHelpers.createPointByGridIndex(gridIndex);
    img.x       = SKILL_ACTIVATION_OFFSET_X + pos.x;
    img.y       = SKILL_ACTIVATION_OFFSET_Y + pos.y;

    const tween = egret.Tween.get(img);
    for (let i = 2; i <= 34; ++i) {
        tween.wait(34).set({ source: `c04_t08_s06_f${Helpers.getNumText(i, 2)}` });
    }
    tween.call(() => (img.parent) && (img.parent.removeChild(img)));

    return img;
}

function createEffectSurface(gridIndex: GridIndex): egret.DisplayObject {
    const img   = new TwnsUiImage.UiImage(`c04_t08_s08_f01`);
    const pos   = GridIndexHelpers.createPointByGridIndex(gridIndex);
    img.x       = DAMAGE_OFFSET_X + pos.x;
    img.y       = DAMAGE_OFFSET_Y + pos.y;

    const tween = egret.Tween.get(img);
    for (let i = 2; i <= 5; ++i) {
        tween.wait(50).set({ source: `c04_t08_s08_f${Helpers.getNumText(i, 2)}` });
    }
    tween.call(() => (img.parent) && (img.parent.removeChild(img)));

    return img;
}
