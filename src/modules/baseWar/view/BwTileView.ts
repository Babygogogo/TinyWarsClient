
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
    import TileObjectType       = Twns.Types.TileObjectType;
    import TileBaseType         = Twns.Types.TileBaseType;
    import TileDecoratorType    = Twns.Types.TileDecoratorType;
    import ISerialTile          = CommonProto.WarSerialization.ISerialTile;

    const {
        height  : GRID_HEIGHT,
        width   : GRID_WIDTH,
    } = Twns.CommonConstants.GridSize;

    export type DataForTileView = {
        tileData    : ISerialTile;
        themeType   : Twns.Types.TileThemeType;
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
            const data      = Twns.Helpers.getExisted(this.getData());
            const skinId    = data.skinId;
            const hasFog    = data.hasFog;
            const tileData  = data.tileData;
            const themeType = data.themeType;
            const version   = Twns.User.UserModel.getSelfSettingsTextureVersion();
            const tickCount = Twns.Timer.getTileAnimationTickCount();

            {
                const objectType    = Twns.Helpers.getExisted(tileData.objectType);
                const imgObject     = this.getImgObject();
                imgObject.visible   = true;
                imgObject.source    = Twns.Common.CommonModel.getCachedTileObjectImageSource({
                    version,
                    themeType,
                    skinId      : ((hasFog) && (objectType !== TileObjectType.Headquarters)) ? Twns.CommonConstants.UnitAndTileNeutralSkinId : skinId,
                    shapeId     : tileData.objectShapeId || 0,
                    objectType,
                    isDark      : hasFog,
                    tickCount,
                });
            }

            {
                const baseType  = tileData.baseType;
                const imgBase   = this.getImgBase();
                if (baseType == null) {
                    throw Twns.Helpers.newError(`BwTileView.updateView() empty baseType.`);
                } else if (baseType === TileBaseType.Empty) {
                    imgBase.visible = false;
                } else {
                    imgBase.visible = true;
                    imgBase.source  = Twns.Common.CommonModel.getCachedTileBaseImageSource({
                        version,
                        themeType,
                        skinId      : Twns.CommonConstants.UnitAndTileNeutralSkinId,
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
                    imgDecorator.source     = Twns.Common.CommonModel.getCachedTileDecoratorImageSource({
                        version,
                        themeType,
                        skinId          : Twns.CommonConstants.UnitAndTileNeutralSkinId,
                        decoratorType,
                        shapeId         : tileData.decoratorShapeId ?? null,
                        isDark          : hasFog,
                        tickCount,
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
