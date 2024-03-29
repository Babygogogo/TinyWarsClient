
// import CommonModel      from "../../common/model/CommonModel";
// import CommonConstants  from "../../tools/helpers/CommonConstants";
// import Helpers          from "../../tools/helpers/Helpers";
// import Timer            from "../../tools/helpers/Timer";
// import Types            from "../../tools/helpers/Types";
// import ProtoTypes       from "../../tools/proto/ProtoTypes";
// import TwnsUiImage      from "../../tools/ui/UiImage";
// import UserModel        from "../../user/model/UserModel";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.BaseWar {
    import ISerialTile          = CommonProto.WarSerialization.ISerialTile;

    const {
        height  : GRID_HEIGHT,
        width   : GRID_WIDTH,
    } = CommonConstants.GridSize;

    export type DataForTileView = {
        gameConfig  : Config.GameConfig;
        tileData    : ISerialTile;
        themeType   : Types.TileThemeType;
        hasFog      : boolean;
        skinId      : number;
    };
    export class BwTileView {
        private readonly _imgBase       = new TwnsUiImage.UiImage();
        private readonly _imgDecorator  = new TwnsUiImage.UiImage();
        private readonly _imgObject     = new TwnsUiImage.UiImage();
        private readonly _imgHighlight  = new TwnsUiImage.UiImage(`uncompressedColorWhite0000`);

        private _data   : DataForTileView | null = null;

        public constructor() {
            const imgBase               = this.getImgBase();
            imgBase.smoothing           = false;
            imgBase.anchorOffsetY       = GRID_HEIGHT;

            const imgDecorator          = this.getImgDecorator();
            imgDecorator.smoothing      = false;
            imgDecorator.anchorOffsetY  = GRID_HEIGHT;

            const imgObject             = this.getImgObject();
            imgObject.smoothing         = false;
            imgObject.anchorOffsetY     = GRID_HEIGHT * 2;

            const imgHighlight          = this.getImgHighlight();
            imgHighlight.smoothing      = false;
            imgHighlight.width          = GRID_WIDTH;
            imgHighlight.height         = GRID_HEIGHT;
            imgHighlight.alpha          = 0.6;
            imgHighlight.anchorOffsetY  = GRID_HEIGHT;
        }

        public setData(data: DataForTileView): void {
            this._data = data;
        }
        public getData(): DataForTileView | null {
            return this._data;
        }

        public updateView(): void {
            const data          = Helpers.getExisted(this.getData());
            const skinId        = data.skinId;
            const hasFog        = data.hasFog;
            const tileData      = data.tileData;
            const themeType     = data.themeType;
            const gameConfig    = data.gameConfig;
            const version       = User.UserModel.getSelfSettingsTextureVersion();
            const tickCount     = Timer.getTileAnimationTickCount();
            const tileBaseType  = Helpers.getExisted(tileData.baseType);

            {
                const objectType    = Helpers.getExisted(tileData.objectType);
                const imgObject     = this.getImgObject();
                imgObject.visible   = true;
                imgObject.source    = Common.CommonModel.getCachedTileObjectImageSource({
                    gameConfig,
                    version,
                    themeType,
                    skinId      : ((hasFog) && (!gameConfig.getTileTemplateCfgByBaseTypeAndObjectType(tileBaseType, objectType)?.isAlwaysShowOwner)) ? CommonConstants.UnitAndTileNeutralSkinId : skinId,
                    shapeId     : tileData.objectShapeId || 0,
                    objectType,
                    isDark      : hasFog,
                    tickCount,
                });
            }

            {
                const imgBase   = this.getImgBase();
                imgBase.visible = true;
                imgBase.source  = Common.CommonModel.getCachedTileBaseImageSource({
                    gameConfig,
                    version,
                    themeType,
                    skinId      : CommonConstants.UnitAndTileNeutralSkinId,
                    shapeId     : tileData.baseShapeId || 0,
                    baseType    : tileBaseType,
                    isDark      : hasFog,
                    tickCount,
                });
            }

            {
                const decoratorType     = tileData.decoratorType;
                const imgDecorator      = this.getImgDecorator();
                if (decoratorType == null) {
                    imgDecorator.visible = false;
                } else {
                    imgDecorator.visible    = true;
                    imgDecorator.source     = Common.CommonModel.getCachedTileDecoratorImageSource({
                        version,
                        themeType,
                        skinId              : CommonConstants.UnitAndTileNeutralSkinId,
                        tileDecorationType  : decoratorType,
                        shapeId             : tileData.decoratorShapeId ?? 0,
                        isDark              : hasFog,
                        tickCount,
                        gameConfig,
                    });
                }
            }

            this.getImgHighlight().visible = !!tileData.isHighlighted;
        }

        public getImgHighlight(): TwnsUiImage.UiImage {
            return this._imgHighlight;
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

// export default TwnsBwTileView;
