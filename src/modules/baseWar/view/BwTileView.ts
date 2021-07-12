
import { TwnsUiImage }      from "../../../utility/ui/UiImage";
import { CommonModel }      from "../../common/model/CommonModel";
import { TimeModel }        from "../../time/model/TimeModel";
import { UserModel }        from "../../user/model/UserModel";
import { Types }            from "../../../utility/Types";
import { Logger }           from "../../../utility/Logger";
import { CommonConstants }  from "../../../utility/CommonConstants";
import { ProtoTypes }       from "../../../utility/proto/ProtoTypes";
import TileObjectType       = Types.TileObjectType;
import TileBaseType         = Types.TileBaseType;
import ISerialTile          = ProtoTypes.WarSerialization.ISerialTile;

const { width: GRID_WIDTH, height: GRID_HEIGHT } = CommonConstants.GridSize;

export type DataForTileView = {
    tileData    : ISerialTile;
    hasFog      : boolean;
    skinId      : number;
};
export class BwTileView {
    private _imgBase    = new TwnsUiImage.UiImage();
    private _imgObject  = new TwnsUiImage.UiImage();

    private _data       : DataForTileView;

    public constructor() {
        this._imgBase.anchorOffsetY     = GRID_HEIGHT;
        this._imgObject.anchorOffsetY   = GRID_HEIGHT * 2;
    }

    public setData(data: DataForTileView): void {
        this._data = data;
    }
    public getData(): DataForTileView {
        return this._data;
    }

    public updateView(): void {
        const data = this.getData();
        if (data == null) {
            Logger.error(`BwTileView.updateView() empty tileData.`);
            return undefined;
        }

        const skinId = data.skinId;
        if (skinId == null) {
            Logger.error(`BwTileView.updateView() empty skinId.`);
            return undefined;
        }

        const hasFog = data.hasFog;
        if (hasFog == null) {
            Logger.error(`BwTileView.updateView() empty hasFog.`);
            return undefined;
        }

        const tileData = data.tileData;
        if (tileData == null) {
            Logger.error(`BwTileView.updateView() empty tileData.`);
            return undefined;
        }

        const imgObject = this.getImgObject();
        const imgBase   = this.getImgBase();
        const version   = UserModel.getSelfSettingsTextureVersion();
        const tickCount = TimeModel.getTileAnimationTickCount();

        const objectType = tileData.objectType;
        if (objectType == null) {
            Logger.error(`BwTileView.updateView() empty objectType.`);
            imgObject.visible = false;
        } else if (objectType === TileObjectType.Empty) {
            imgObject.visible = false;
        } else {
            imgObject.visible   = true;
            imgObject.source    = CommonModel.getCachedTileObjectImageSource({
                version,
                skinId      : ((hasFog) && (objectType !== TileObjectType.Headquarters)) ? CommonConstants.UnitAndTileNeutralSkinId : skinId,
                shapeId     : tileData.objectShapeId || 0,
                objectType,
                isDark      : hasFog,
                tickCount,
            });
        }

        const baseType = tileData.baseType;
        if (baseType == null) {
            Logger.error(`BwTileView.updateView() empty baseType.`);
            imgBase.visible = false;
        } else if (baseType === TileBaseType.Empty) {
            imgBase.visible = false;
        } else {
            imgBase.visible = true;
            imgBase.source  = CommonModel.getCachedTileBaseImageSource({
                version,
                skinId      : CommonConstants.UnitAndTileNeutralSkinId,
                shapeId     : tileData.baseShapeId || 0,
                baseType,
                isDark      : hasFog,
                tickCount,
            });
        }
    }

    public getImgObject(): TwnsUiImage.UiImage {
        return this._imgObject;
    }
    public getImgBase(): TwnsUiImage.UiImage {
        return this._imgBase;
    }
}
