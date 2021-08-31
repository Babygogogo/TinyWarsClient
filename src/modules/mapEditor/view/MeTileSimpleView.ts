
import CommonModel      from "../../common/model/CommonModel";
import CommonConstants  from "../../tools/helpers/CommonConstants";
import Helpers          from "../../tools/helpers/Helpers";
import Timer            from "../../tools/helpers/Timer";
import Types            from "../../tools/helpers/Types";
import TwnsUiImage      from "../../tools/ui/UiImage";
import UserModel        from "../../user/model/UserModel";

namespace TwnsMeTileSimpleView {
    import TileBaseType             = Types.TileBaseType;
    import TileDecoratorType        = Types.TileDecoratorType;
    import TileObjectType           = Types.TileObjectType;

    const { height: GRID_HEIGHT }   = CommonConstants.GridSize;

    export class MeTileSimpleView {
        private readonly _imgBase       = new TwnsUiImage.UiImage();
        private readonly _imgDecorator  = new TwnsUiImage.UiImage();
        private readonly _imgObject     = new TwnsUiImage.UiImage();

        private _baseType           : TileBaseType | null = null;
        private _baseShapeId        : number | null = null;
        private _decoratorType      : TileDecoratorType | null = null;
        private _decoratorShapeId   : number | null = null;
        private _objectType         : TileObjectType | null = null;
        private _objectShapeId      : number | null = null;
        private _playerIndex        : number | null = null;

        public constructor() {
            this.getImgBase().anchorOffsetY         = GRID_HEIGHT;
            this.getImgDecorator().anchorOffsetY    = GRID_HEIGHT;
            this.getImgObject().anchorOffsetY       = GRID_HEIGHT * 2;
        }

        public init({ tileBaseType, tileBaseShapeId, tileDecoratorType, tileDecoratorShapeId, tileObjectType, tileObjectShapeId, playerIndex }: {
            tileBaseType        : TileBaseType | null;
            tileBaseShapeId     : number | null;
            tileDecoratorType   : TileDecoratorType | null;
            tileDecoratorShapeId: number | null;
            tileObjectType      : TileObjectType;
            tileObjectShapeId   : number;
            playerIndex         : number;
        }): MeTileSimpleView {
            this._baseType          = tileBaseType;
            this._baseShapeId       = tileBaseShapeId;
            this._decoratorType     = tileDecoratorType;
            this._decoratorShapeId  = tileDecoratorShapeId;
            this._objectType        = tileObjectType;
            this._objectShapeId     = tileObjectShapeId;
            this._playerIndex       = playerIndex;

            return this;
        }

        public startRunningView(): void {
            this.updateView();
        }

        public updateView(): void {
            this._updateImages();
        }

        public getImgObject(): TwnsUiImage.UiImage {
            return this._imgObject;
        }
        public getImgBase(): TwnsUiImage.UiImage {
            return this._imgBase;
        }
        public getImgDecorator(): TwnsUiImage.UiImage {
            return this._imgDecorator;
        }

        public updateOnAnimationTick(): void {
            this._updateImages();
        }

        protected _updateImages(): void {
            const version   = UserModel.getSelfSettingsTextureVersion();
            const tickCount = Timer.getTileAnimationTickCount();

            {
                const objectType    = this._objectType;
                const imgObject     = this.getImgObject();
                if ((objectType == null) || (objectType === TileObjectType.Empty)) {
                    imgObject.visible = false;
                } else {
                    imgObject.visible = true;
                    imgObject.source  = CommonModel.getCachedTileObjectImageSource({
                        version,
                        skinId      : Helpers.getExisted(this._playerIndex),
                        objectType,
                        isDark      : false,
                        shapeId     : Helpers.getExisted(this._objectShapeId),
                        tickCount,
                    });
                }
            }

            {
                const baseType  = this._baseType;
                const imgBase   = this.getImgBase();
                if ((baseType == null) || (baseType === TileBaseType.Empty)) {
                    imgBase.visible = false;
                } else {
                    imgBase.visible = true;
                    imgBase.source  = CommonModel.getCachedTileBaseImageSource({
                        version,
                        skinId      : CommonConstants.UnitAndTileNeutralSkinId,
                        baseType,
                        isDark      : false,
                        shapeId     : Helpers.getExisted(this._baseShapeId),
                        tickCount,
                    });
                }
            }

            {
                const decoratorType = this._decoratorType;
                const imgDecorator  = this.getImgDecorator();
                if ((decoratorType == null) || (decoratorType === TileDecoratorType.Empty)) {
                    imgDecorator.visible = false;
                } else {
                    imgDecorator.visible = true;
                    imgDecorator.source  = CommonModel.getCachedTileDecoratorImageSource({
                        version,
                        skinId      : CommonConstants.UnitAndTileNeutralSkinId,
                        decoratorType,
                        isDark      : false,
                        shapeId     : Helpers.getExisted(this._decoratorShapeId),
                        tickCount,
                    });
                }
            }
        }
    }
}

export default TwnsMeTileSimpleView;
