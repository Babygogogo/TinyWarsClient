
import CommonModel      from "../../common/model/CommonModel";
import CommonConstants  from "../../tools/helpers/CommonConstants";
import Helpers          from "../../tools/helpers/Helpers";
import Timer            from "../../tools/helpers/Timer";
import Types            from "../../tools/helpers/Types";
import ProtoTypes       from "../../tools/proto/ProtoTypes";
import TwnsUiImage      from "../../tools/ui/UiImage";
import UserModel        from "../../user/model/UserModel";

namespace TwnsBwTileView {
    import TileObjectType       = Types.TileObjectType;
    import TileBaseType         = Types.TileBaseType;
    import TileDecoratorType    = Types.TileDecoratorType;
    import ISerialTile          = ProtoTypes.WarSerialization.ISerialTile;

    const { height: GRID_HEIGHT } = CommonConstants.GridSize;

    export type DataForTileView = {
        tileData    : ISerialTile;
        hasFog      : boolean;
        skinId      : number;
    };
    export class BwTileView {
        private readonly _imgBase       = new TwnsUiImage.UiImage();
        private readonly _imgDecorator  = new TwnsUiImage.UiImage();
        private readonly _imgObject     = new TwnsUiImage.UiImage();

        private _data   : DataForTileView | null = null;

        public constructor() {
            this._imgBase.anchorOffsetY         = GRID_HEIGHT;
            this._imgDecorator.anchorOffsetY    = GRID_HEIGHT;
            this._imgObject.anchorOffsetY       = GRID_HEIGHT * 2;
        }

        public setData(data: DataForTileView): void {
            this._data = data;
        }
        public getData(): DataForTileView | null {
            return this._data;
        }

        public updateView(): void {
            const data      = Helpers.getExisted(this.getData());
            const skinId    = Helpers.getExisted(data.skinId);
            const hasFog    = Helpers.getExisted(data.hasFog);
            const tileData  = Helpers.getExisted(data.tileData);
            const version   = UserModel.getSelfSettingsTextureVersion();
            const tickCount = Timer.getTileAnimationTickCount();

            {
                const objectType    = tileData.objectType;
                const imgObject     = this.getImgObject();
                if (objectType == null) {
                    throw Helpers.newError(`BwTileView.updateView() empty objectType.`);
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
            }

            {
                const baseType  = tileData.baseType;
                const imgBase   = this.getImgBase();
                if (baseType == null) {
                    throw Helpers.newError(`BwTileView.updateView() empty baseType.`);
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

            {
                const decoratorType     = tileData.decoratorType;
                const imgDecorator      = this.getImgDecorator();
                if ((decoratorType == null) || (decoratorType == TileDecoratorType.Empty)) {
                    imgDecorator.visible = false;
                } else {
                    imgDecorator.visible    = true;
                    imgDecorator.source     = CommonModel.getCachedTileDecoratorImageSource({
                        version,
                        skinId          : CommonConstants.UnitAndTileNeutralSkinId,
                        decoratorType,
                        shapeId         : tileData.decoratorShapeId ?? null,
                        isDark          : hasFog,
                        tickCount,
                    });
                }
            }
        }

        public getImgObject(): TwnsUiImage.UiImage {
            return this._imgObject;
        }
        public getImgDecorator(): TwnsUiImage.UiImage {
            return this._imgDecorator;
        }
        public getImgBase(): TwnsUiImage.UiImage {
            return this._imgBase;
        }
    }
}

export default TwnsBwTileView;
