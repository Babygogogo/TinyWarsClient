
import { UiImage }              from "../../../gameui/UiImage";
import * as CommonConstants     from "../../../utility/CommonConstants";
import { Logger }               from "../../../utility/Logger";
import { Types }                from "../../../utility/Types";
import * as CommonModel         from "../../common/model/CommonModel";
import * as TimeModel           from "../../time/model/TimeModel";
import * as UserModel           from "../../user/model/UserModel";
import TileObjectType           = Types.TileObjectType;
import TileBaseType             = Types.TileBaseType;

const { width: GRID_WIDTH, height: GRID_HEIGHT } = CommonConstants.GridSize;

export class MeTileSimpleView {
    private _imgBase    = new UiImage();
    private _imgObject  = new UiImage();

    private _baseType       : TileBaseType;
    private _baseShapeId    : number;
    private _objectType     : TileObjectType;
    private _objectShapeId  : number;
    private _playerIndex    : number;

    public constructor() {
        this._imgBase.anchorOffsetY     = GRID_HEIGHT;
        this._imgObject.anchorOffsetY   = GRID_HEIGHT * 2;
    }

    public init(
        { tileBaseType, tileBaseShapeId, tileObjectType, tileObjectShapeId, playerIndex }: {
            tileBaseType        : TileBaseType;
            tileBaseShapeId     : number;
            tileObjectType      : TileObjectType;
            tileObjectShapeId   : number;
            playerIndex         : number;
        }
    ): MeTileSimpleView {
        if (playerIndex == null) {
            Logger.error(`MeTileSimpleView.init() empty playerIndex.`);
            return undefined;
        }

        this._baseType      = tileBaseType;
        this._baseShapeId   = tileBaseShapeId;
        this._objectType    = tileObjectType;
        this._objectShapeId = tileObjectShapeId;
        this._playerIndex   = playerIndex;

        return this;
    }

    public startRunningView(): void {
        this.updateView();
    }

    public updateView(): void {
        this._updateImages();
    }

    public setHasFog(hasFog: boolean): void {
        this._updateImages();
    }

    public getImgObject(): UiImage {
        return this._imgObject;
    }
    public getImgBase(): UiImage {
        return this._imgBase;
    }

    public updateOnAnimationTick(): void {
        this._updateImages();
    }

    protected _updateImages(): void {
        const version   = UserModel.getSelfSettingsTextureVersion();
        const tickCount = TimeModel.getTileAnimationTickCount();
        const skinId    = this._playerIndex;

        const objectType = this._objectType;
        if ((objectType == null) || (objectType === TileObjectType.Empty)) {
            this._imgObject.visible = false;
        } else {
            this._imgObject.visible = true;
            this._imgObject.source  = CommonModel.getCachedTileObjectImageSource({
                version,
                skinId,
                objectType,
                isDark      : false,
                shapeId     : this._objectShapeId,
                tickCount,
            });
        }

        const baseType = this._baseType;
        if ((baseType == null) || (baseType === TileBaseType.Empty)) {
            this._imgBase.visible = false;
        } else {
            this._imgBase.visible = true;
            this._imgBase.source  = CommonModel.getCachedTileBaseImageSource({
                version,
                skinId      : CommonConstants.UnitAndTileNeutralSkinId,
                baseType,
                isDark      : false,
                shapeId     : this._baseShapeId,
                tickCount,
            });
        }
    }
}
