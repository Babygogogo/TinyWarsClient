
namespace TinyWars.MapEditor {
    import Types            = Utility.Types;
    import CommonModel      = Common.CommonModel;
    import TileObjectType   = Types.TileObjectType;
    import TileBaseType     = Types.TileBaseType;

    const { width: GRID_WIDTH, height: GRID_HEIGHT } = Utility.ConfigManager.getGridSize();

    export class MeTileSimpleView {
        private _imgBase    = new GameUi.UiImage();
        private _imgObject  = new GameUi.UiImage();

        private _baseType       : TileBaseType;
        private _baseShapeId    : number;
        private _objectType     : TileObjectType;
        private _objectShapeId  : number;
        private _playerIndex    : number;

        public constructor() {
            this._imgBase.anchorOffsetY     = GRID_HEIGHT;
            this._imgObject.anchorOffsetY   = GRID_HEIGHT * 2;
        }

        public init(params: {
            tileBaseType        : TileBaseType;
            tileBaseShapeId     : number;
            tileObjectType      : TileObjectType;
            tileObjectShapeId   : number;
            playerIndex         : number;
        }): MeTileSimpleView {
            this._baseType      = params.tileBaseType;
            this._baseShapeId   = params.tileBaseShapeId;
            this._objectType    = params.tileObjectType;
            this._objectShapeId = params.tileObjectShapeId;
            this._playerIndex   = params.playerIndex;

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

        public getImgObject(): GameUi.UiImage {
            return this._imgObject;
        };
        public getImgBase(): GameUi.UiImage {
            return this._imgBase;
        }

        public updateOnAnimationTick(): void {
            this._updateImages();
        }

        protected _updateImages(): void {
            const version   = CommonModel.getUnitAndTileTextureVersion();
            const tickCount = Time.TimeModel.getTileAnimationTickCount();
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
                    skinId,
                    baseType,
                    isDark      : false,
                    shapeId     : this._baseShapeId,
                    tickCount,
                });
            }
        }
    }
}
