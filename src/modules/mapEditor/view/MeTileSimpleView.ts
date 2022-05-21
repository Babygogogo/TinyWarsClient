
// import CommonModel      from "../../common/model/CommonModel";
// import CommonConstants  from "../../tools/helpers/CommonConstants";
// import Helpers          from "../../tools/helpers/Helpers";
// import Timer            from "../../tools/helpers/Timer";
// import Types            from "../../tools/helpers/Types";
// import TwnsUiImage      from "../../tools/ui/UiImage";
// import UserModel        from "../../user/model/UserModel";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.MapEditor {
    import TileBaseType             = Types.TileBaseType;
    import TileDecoratorType        = Types.TileDecoratorType;
    import TileObjectType           = Types.TileObjectType;

    const { height: GRID_HEIGHT }   = CommonConstants.GridSize;
    export type TileViewData = {
        gameConfig          : Config.GameConfig;
        tileBaseType        : TileBaseType | null;
        tileBaseShapeId     : number | null;
        tileDecoratorType   : TileDecoratorType | null;
        tileDecoratorShapeId: number | null;
        tileObjectType      : TileObjectType | null;
        tileObjectShapeId   : number | null;
        playerIndex         : number;
    };

    export class MeTileSimpleView {
        private readonly _imgBase       = new TwnsUiImage.UiImage();
        private readonly _imgDecorator  = new TwnsUiImage.UiImage();
        private readonly _imgObject     = new TwnsUiImage.UiImage();

        private _gameConfig         : Config.GameConfig | null = null;
        private _baseType           : TileBaseType | null = null;
        private _baseShapeId        : number | null = null;
        private _decoratorType      : TileDecoratorType | null = null;
        private _decoratorShapeId   : number | null = null;
        private _objectType         : TileObjectType | null = null;
        private _objectShapeId      : number | null = null;
        private _playerIndex        : number | null = null;

        public constructor() {
            {
                const img           = this.getImgBase();
                img.smoothing       = false;
                img.anchorOffsetY   = GRID_HEIGHT;
            }

            {
                const img           = this.getImgDecorator();
                img.smoothing       = false;
                img.anchorOffsetY   = GRID_HEIGHT;
            }

            {
                const img           = this.getImgObject();
                img.smoothing       = false;
                img.anchorOffsetY   = GRID_HEIGHT * 2;
            }
        }

        public init(data: TileViewData): MeTileSimpleView {
            this._gameConfig        = data.gameConfig;
            this._baseType          = data.tileBaseType;
            this._baseShapeId       = data.tileBaseShapeId;
            this._decoratorType     = data.tileDecoratorType;
            this._decoratorShapeId  = data.tileDecoratorShapeId;
            this._objectType        = data.tileObjectType;
            this._objectShapeId     = data.tileObjectShapeId;
            this._playerIndex       = data.playerIndex;

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
            const gameConfig = this._gameConfig;
            if (gameConfig == null) {
                return;
            }

            const version   = User.UserModel.getSelfSettingsTextureVersion();
            const tickCount = Timer.getTileAnimationTickCount();
            {
                const objectType    = this._objectType;
                const imgObject     = this.getImgObject();
                if (objectType == null) {
                    imgObject.visible = false;
                } else {
                    imgObject.visible = true;
                    imgObject.source  = Common.CommonModel.getCachedTileObjectImageSource({
                        gameConfig,
                        version,
                        themeType   : Types.TileThemeType.Clear,
                        skinId      : Helpers.getExisted(this._playerIndex),
                        objectType,
                        isDark      : false,
                        shapeId     : this._objectShapeId ?? 0,
                        tickCount,
                    });
                }
            }

            {
                const baseType  = this._baseType;
                const imgBase   = this.getImgBase();
                if (baseType == null) {
                    imgBase.visible = false;
                } else {
                    imgBase.visible = true;
                    imgBase.source  = Common.CommonModel.getCachedTileBaseImageSource({
                        gameConfig,
                        version,
                        themeType   : Types.TileThemeType.Clear,
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
                if (decoratorType == null) {
                    imgDecorator.visible = false;
                } else {
                    imgDecorator.visible = true;
                    imgDecorator.source  = Common.CommonModel.getCachedTileDecoratorImageSource({
                        version,
                        themeType   : Types.TileThemeType.Clear,
                        skinId      : CommonConstants.UnitAndTileNeutralSkinId,
                        tileDecorationType: decoratorType,
                        isDark      : false,
                        shapeId     : Helpers.getExisted(this._decoratorShapeId),
                        tickCount,
                        gameConfig,
                    });
                }
            }
        }
    }
}

// export default TwnsMeTileSimpleView;
