
import TwnsUiImage      from "../../tools/ui/UiImage";
import CommonConstants  from "../../tools/helpers/CommonConstants";
import Logger           from "../../tools/helpers/Logger";
import Types            from "../../tools/helpers/Types";
import CommonModel      from "../../common/model/CommonModel";
import Timer            from "../../tools/helpers/Timer";
import UserModel        from "../../user/model/UserModel";

namespace TwnsMeTileSimpleView {
    import TileBaseType             = Types.TileBaseType;
    import TileDecoratorType        = Types.TileDecoratorType;
    import TileObjectType           = Types.TileObjectType;

    const { height: GRID_HEIGHT }   = CommonConstants.GridSize;

    export class MeTileSimpleView {
        private _imgBase        = new TwnsUiImage.UiImage();
        private _imgDecorator   = new TwnsUiImage.UiImage();
        private _imgObject      = new TwnsUiImage.UiImage();

        private _baseType           : TileBaseType;
        private _baseShapeId        : number;
        private _decoratorType      : TileDecoratorType;
        private _decoratorShapeId   : number;
        private _objectType         : TileObjectType;
        private _objectShapeId      : number;
        private _playerIndex        : number;

        public constructor() {
            this.getImgBase().anchorOffsetY         = GRID_HEIGHT;
            this.getImgDecorator().anchorOffsetY    = GRID_HEIGHT;
            this.getImgObject().anchorOffsetY       = GRID_HEIGHT * 2;
        }

        public init({ tileBaseType, tileBaseShapeId, tileDecoratorType, tileDecoratorShapeId, tileObjectType, tileObjectShapeId, playerIndex }: {
            tileBaseType        : TileBaseType;
            tileBaseShapeId     : number;
            tileDecoratorType   : TileDecoratorType;
            tileDecoratorShapeId: number;
            tileObjectType      : TileObjectType;
            tileObjectShapeId   : number;
            playerIndex         : number;
        }): MeTileSimpleView {
            if (playerIndex == null) {
                Logger.error(`MeTileSimpleView.init() empty playerIndex.`);
                return undefined;
            }

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

        public setHasFog(hasFog: boolean): void {
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
            const skinId    = this._playerIndex;

            {
                const objectType    = this._objectType;
                const imgObject     = this.getImgObject();
                if ((objectType == null) || (objectType === TileObjectType.Empty)) {
                    imgObject.visible = false;
                } else {
                    imgObject.visible = true;
                    imgObject.source  = CommonModel.getCachedTileObjectImageSource({
                        version,
                        skinId,
                        objectType,
                        isDark      : false,
                        shapeId     : this._objectShapeId,
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
                        shapeId     : this._baseShapeId,
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
                        shapeId     : this._decoratorShapeId,
                        tickCount,
                    });
                }
            }
        }
    }
}

export default TwnsMeTileSimpleView;
