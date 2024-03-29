
// import CommonModel          from "../../common/model/CommonModel";
// import CommonConstants      from "../../tools/helpers/CommonConstants";
// import ConfigManager        from "../../tools/helpers/ConfigManager";
// import GridIndexHelpers     from "../../tools/helpers/GridIndexHelpers";
// import Helpers              from "../../tools/helpers/Helpers";
// import Timer                from "../../tools/helpers/Timer";
// import Types                from "../../tools/helpers/Types";
// import Notify               from "../../tools/notify/Notify";
// import Notify       from "../../tools/notify/NotifyType";
// import ProtoTypes           from "../../tools/proto/ProtoTypes";
// import TwnsUiImage          from "../../tools/ui/UiImage";
// import WarCommonHelpers     from "../../tools/warHelpers/WarCommonHelpers";
// import UserModel            from "../../user/model/UserModel";
// import TwnsWarMapUnitView   from "./WarMapUnitView";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.WarMap {
    import NotifyType       = Notify.NotifyType;
    import MapSize          = Types.MapSize;
    import IMapRawData      = CommonProto.Map.IMapRawData;
    import WarSerialization = CommonProto.WarSerialization;
    import ISerialWar       = WarSerialization.ISerialWar;
    import ISerialTile      = WarSerialization.ISerialTile;
    import ISerialPlayer    = WarSerialization.ISerialPlayer;
    import GameConfig       = Config.GameConfig;

    const { width: GRID_WIDTH, height: GRID_HEIGHT } = CommonConstants.GridSize;

    export class WarMapView extends egret.DisplayObjectContainer {
        private readonly _tileMapView   = new TileMapView();
        private readonly _unitMapView   = new WarMapUnitMapView();

        public constructor() {
            super();

            this.addChild(this._tileMapView);
            this.addChild(this._unitMapView);
        }

        public showMapByMapData(mapRawData: IMapRawData, gameConfig: GameConfig): void {
            this.width  = GRID_WIDTH  * Helpers.getExisted(mapRawData.mapWidth);
            this.height = GRID_HEIGHT * Helpers.getExisted(mapRawData.mapHeight);
            this._tileMapView.showTileMap(gameConfig, Helpers.getExisted(mapRawData.tileDataArray));
            this._unitMapView.showUnitMap({
                unitDataArray   : mapRawData.unitDataArray || [],
                players         : null,
                gameConfig,
            });
        }
        public showMapByWarData(warData: ISerialWar, gameConfig: GameConfig, players?: Types.Undefinable<ISerialPlayer[]>): void {
            const field     = Helpers.getExisted(warData.field);
            const tileMap   = Helpers.getExisted(field.tileMap);
            const mapSize   = WarHelpers.WarCommonHelpers.getMapSize(tileMap);
            this.width      = GRID_WIDTH * mapSize.width;
            this.height     = GRID_HEIGHT * mapSize.height;

            players = players || Helpers.getExisted(warData.playerManager?.players);
            this._tileMapView.showTileMap(gameConfig, Helpers.getExisted(tileMap.tiles), players);
            this._unitMapView.showUnitMap({
                unitDataArray   : field.unitMap?.units || [],
                players,
                gameConfig,
            });
        }

        public clear(): void {
            this._tileMapView.clear();
            this._unitMapView.clear();
        }
    }

    class TileMapView extends egret.DisplayObjectContainer {
        private readonly _borderLayer           = new egret.DisplayObjectContainer();
        private readonly _imgCornerUL           = new TwnsUiImage.UiImage(`uncompressedCorner0000`);
        private readonly _imgCornerUR           = new TwnsUiImage.UiImage(`uncompressedCorner0001`);
        private readonly _imgCornerDR           = new TwnsUiImage.UiImage(`uncompressedCorner0002`);
        private readonly _imgCornerDL           = new TwnsUiImage.UiImage(`uncompressedCorner0003`);
        private readonly _imgBorderU            = new TwnsUiImage.UiImage(`uncompressedBorder0000`);
        private readonly _imgBorderR            = new TwnsUiImage.UiImage(`uncompressedBorder0001`);
        private readonly _imgBorderD            = new TwnsUiImage.UiImage(`uncompressedBorder0002`);
        private readonly _imgBorderL            = new TwnsUiImage.UiImage(`uncompressedBorder0003`);

        private readonly _baseLayer             = new TileBaseLayer();
        private readonly _decoratorLayer        = new TileDecoratorLayer();
        private readonly _gridBorderLayer       = new egret.DisplayObjectContainer();
        private readonly _objectLayer           = new TileObjectLayer();

        private readonly _notifyListenerArray   : Notify.Listener[] = [
            { type: NotifyType.TileAnimationTick,                   callback: this._onNotifyTileAnimationTick },
            { type: NotifyType.UserSettingsIsShowGridBorderChanged, callback: this._onNotifyIsShowGridBorderChanged },
        ];

        public constructor() {
            super();

            this._initBorderLayer();
            this._gridBorderLayer.alpha = 0.3;
            this.addChild(this._baseLayer);
            this.addChild(this._decoratorLayer);
            this.addChild(this._gridBorderLayer);
            this.addChild(this._objectLayer);
            this.addEventListener(egret.Event.ADDED_TO_STAGE, this._onAddedToStage, this);
        }

        public showTileMap(gameConfig: GameConfig, dataList: ISerialTile[], players?: ISerialPlayer[]): void {
            this._baseLayer.updateWithTileDataList(gameConfig, dataList, players);
            this._decoratorLayer.updateWithTileDataList(gameConfig, dataList, players);
            this._objectLayer.updateWithTileDataList(gameConfig, dataList, players);
            this._resetGridBorderLayer(dataList);
            this._updateBorderLayer(dataList);
        }
        public clear(): void {
            this._baseLayer.clear();
            this._decoratorLayer.clear();
            this._objectLayer.clear();
            this._resetGridBorderLayer([]);
            this._updateBorderLayer([]);
        }

        private _onAddedToStage(): void {
            this.removeEventListener(egret.Event.ADDED_TO_STAGE, this._onAddedToStage, this);
            this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this._onRemovedFromStage, this);

            Notify.addEventListeners(this._notifyListenerArray, this);
        }
        private _onRemovedFromStage(): void {
            this.addEventListener(egret.Event.ADDED_TO_STAGE, this._onAddedToStage, this);
            this.removeEventListener(egret.Event.REMOVED_FROM_STAGE, this._onRemovedFromStage, this);

            Notify.removeEventListeners(this._notifyListenerArray, this);
        }
        private _onNotifyTileAnimationTick(): void {
            this._baseLayer.updateViewOnTick();
            this._decoratorLayer.updateViewOnTick();
            this._objectLayer.updateViewOnTick();
        }

        private _onNotifyIsShowGridBorderChanged(): void {
            this._updateGridBorderLayerVisible();
        }

        private _resetGridBorderLayer(tileDataArray: ISerialTile[]): void {
            const { width: mapWidth, height: mapHeight }    = getMapSize(tileDataArray);
            const borderWidth                               = mapWidth * GRID_WIDTH;
            const borderHeight                              = mapHeight * GRID_HEIGHT;
            const gridBorderLayer                           = this._gridBorderLayer;
            gridBorderLayer.removeChildren();
            for (let x = 1; x < mapWidth; ++x) {
                const img       = new TwnsUiImage.UiImage(`uncompressedColorBlack0000`);
                img.smoothing   = false;
                img.width       = 1;
                img.height      = borderHeight;
                img.x           = (x * GRID_WIDTH) - 0.5;
                gridBorderLayer.addChild(img);
            }
            for (let y = 1; y < mapHeight; ++y) {
                const img       = new TwnsUiImage.UiImage(`uncompressedColorBlack0000`);
                img.smoothing   = false;
                img.width       = borderWidth;
                img.height      = 1;
                img.y           = (y * GRID_HEIGHT) - 0.5;
                gridBorderLayer.addChild(img);
            }
            this._updateGridBorderLayerVisible();
        }
        private _updateGridBorderLayerVisible(): void {
            this._gridBorderLayer.visible = User.UserModel.getSelfSettingsIsShowGridBorder();
        }

        private _initBorderLayer(): void {
            const borderLayer       = this._borderLayer;
            const imgCornerUL       = this._imgCornerUL;
            const imgCornerUR       = this._imgCornerUR;
            const imgCornerDL       = this._imgCornerDL;
            const imgCornerDR       = this._imgCornerDR;
            const imgBorderU        = this._imgBorderU;
            const imgBorderD        = this._imgBorderD;
            const imgBorderL        = this._imgBorderL;
            const imgBorderR        = this._imgBorderR;
            imgCornerUL.smoothing   = false;
            imgCornerUR.smoothing   = false;
            imgCornerDL.smoothing   = false;
            imgCornerDR.smoothing   = false;
            imgBorderU.smoothing    = false;
            imgBorderD.smoothing    = false;
            imgBorderL.smoothing    = false;
            imgBorderR.smoothing    = false;
            borderLayer.addChild(imgBorderU);
            borderLayer.addChild(imgBorderD);
            borderLayer.addChild(imgBorderL);
            borderLayer.addChild(imgBorderR);
            borderLayer.addChild(imgCornerUL);
            borderLayer.addChild(imgCornerUR);
            borderLayer.addChild(imgCornerDL);
            borderLayer.addChild(imgCornerDR);
            this.addChild(borderLayer);
        }

        private _updateBorderLayer(tileDataArray: ISerialTile[]): void {
            const mapSize           = getMapSize(tileDataArray);
            const horizontalPixels  = mapSize.width * GRID_WIDTH;
            const verticalPixels    = mapSize.height * GRID_HEIGHT;
            {
                const imgCornerUL   = this._imgCornerUL;
                imgCornerUL.x       = -4;
                imgCornerUL.y       = -4;
            }

            {
                const imgCornerUR   = this._imgCornerUR;
                imgCornerUR.x       = horizontalPixels;
                imgCornerUR.y       = -4;
            }

            {
                const imgCornerDR   = this._imgCornerDR;
                imgCornerDR.x       = horizontalPixels;
                imgCornerDR.y       = verticalPixels;
            }

            {
                const imgCornerDL   = this._imgCornerDL;
                imgCornerDL.x       = -4;
                imgCornerDL.y       = verticalPixels;
            }

            {
                const imgBorderU    = this._imgBorderU;
                imgBorderU.x        = -0.5;
                imgBorderU.y        = -4;
                imgBorderU.width    = horizontalPixels + 1;
            }

            {
                const imgBorderR    = this._imgBorderR;
                imgBorderR.x        = horizontalPixels;
                imgBorderR.y        = -0.5;
                imgBorderR.height   = verticalPixels + 1;
            }

            {
                const imgBorderD    = this._imgBorderD;
                imgBorderD.x        = -0.5;
                imgBorderD.y        = verticalPixels;
                imgBorderD.width    = horizontalPixels + 1;
            }

            {
                const imgBorderL    = this._imgBorderL;
                imgBorderL.x        = -4;
                imgBorderL.y        = -0.5;
                imgBorderL.height   = verticalPixels + 1;
            }
        }
    }

    abstract class TileLayerBase extends eui.Component {
        private _gameConfig             : GameConfig | null = null;
        private readonly _tileDataMap   : Types.WarMapTileViewData[][] = [];
        private readonly _imageMap      : TwnsUiImage.UiImage[][] = [];

        public updateWithTileDataList(gameConfig: GameConfig, tileDataArray: ISerialTile[], players?: ISerialPlayer[]): void {
            const mapSize       = getMapSize(tileDataArray);
            this._gameConfig    = gameConfig;
            this._resetTileDataMap(mapSize, tileDataArray, players);
            this._resetImageMap(mapSize);

            this.updateViewOnTick();
        }

        public updateViewOnTick(): void {
            const gameConfig = this._gameConfig;
            if (gameConfig == null) {
                return;
            }

            const imageMap      = this._imageMap;
            const tileDataMap   = this._tileDataMap;
            const width         = tileDataMap.length;
            const height        = width > 0 ? tileDataMap[0].length : 0;
            const tickCount     = Timer.getTileAnimationTickCount();
            for (let x = 0; x < width; ++x) {
                for (let y = 0; y < height; ++y) {
                    imageMap[x][y].source = this._getImageSource(gameConfig, tileDataMap[x][y], tickCount);
                }
            }
        }

        public clear(): void {
            const mapSize       = getMapSize([]);
            this._gameConfig    = null;
            this._resetTileDataMap(mapSize, [], []);
            this._resetImageMap(mapSize);
        }

        private _resetTileDataMap(mapSize: MapSize, tileDataArray: ISerialTile[], players?: ISerialPlayer[]): void {
            const map       = this._tileDataMap;
            const width     = mapSize.width;
            const height    = mapSize.height;
            map.length      = width;
            for (let x = 0; x < width; ++x) {
                if (map[x] == null) {
                    map[x] = [];
                }

                const column    = map[x];
                column.length   = height;
            }

            for (const rawTileData of tileDataArray) {
                const tileData                  = Helpers.deepClone(rawTileData) as Types.WarMapTileViewData;
                const gridIndex                 = Helpers.getExisted(GridIndexHelpers.convertGridIndex(tileData.gridIndex));
                tileData.skinId                 = players ? (players.find(v => v.playerIndex === tileData.playerIndex)?.unitAndTileSkinId ?? null) : null;
                map[gridIndex.x][gridIndex.y]   = tileData;
            }
        }
        private _resetImageMap(mapSize: MapSize): void {
            const map       = this._imageMap;
            const width     = mapSize.width;
            const height    = mapSize.height;
            for (let x = width; x < map.length; ++x) {
                for (const img of map[x] || []) {
                    (img) && (img.parent) && (img.parent.removeChild(img));
                }
            }
            map.length = width;

            for (let x = 0; x < width; ++x) {
                if (map[x] == null) {
                    map[x] = [];
                }

                const column = map[x];
                for (let y = height; y < column.length; ++y) {
                    const img = column[y];
                    (img) && (img.parent) && (img.parent.removeChild(img));
                }
                column.length = height;

                for (let y = 0; y < height; ++y) {
                    if (column[y] == null) {
                        const img       = new TwnsUiImage.UiImage();
                        img.smoothing   = false;
                        img.x           = GRID_WIDTH * x;
                        img.y           = this._getImageY(y);
                        column[y]       = img;
                        this.addChild(img);
                    }
                }
            }
        }

        protected abstract _getImageSource(gameConfig: GameConfig, tileData: Types.WarMapTileViewData, tickCount: number): string;
        protected abstract _getImageY(gridY: number): number;
    }

    class TileBaseLayer extends TileLayerBase {
        protected _getImageSource(gameConfig: GameConfig, tileData: ISerialTile, tickCount: number): string {
            return tileData == null
                ? ``
                : Common.CommonModel.getCachedTileBaseImageSource({
                    gameConfig,
                    version     : User.UserModel.getSelfSettingsTextureVersion(),
                    themeType   : Types.TileThemeType.Clear,
                    baseType    : Helpers.getExisted(tileData.baseType),
                    shapeId     : tileData.baseShapeId || 0,
                    isDark      : false,
                    skinId      : CommonConstants.UnitAndTileNeutralSkinId,
                    tickCount,
                });
        }

        protected _getImageY(gridY: number): number {
            return GRID_HEIGHT * gridY;
        }
    }

    class TileDecoratorLayer extends TileLayerBase {
        protected _getImageSource(gameConfig: GameConfig, tileData: ISerialTile, tickCount: number): string {
            return tileData == null
                ? ``
                : Common.CommonModel.getCachedTileDecoratorImageSource({
                    version             : User.UserModel.getSelfSettingsTextureVersion(),
                    themeType           : Types.TileThemeType.Clear,
                    tileDecorationType  : tileData.decoratorType ?? null,
                    shapeId             : tileData.decoratorShapeId ?? 0,
                    isDark              : false,
                    skinId              : CommonConstants.UnitAndTileNeutralSkinId,
                    tickCount,
                    gameConfig,
                });
        }

        protected _getImageY(gridY: number): number {
            return GRID_HEIGHT * gridY;
        }
    }

    class TileObjectLayer extends TileLayerBase {
        protected _getImageSource(gameConfig: GameConfig, tileData: Types.WarMapTileViewData, tickCount: number): string {
            return tileData == null
                ? ``
                : Common.CommonModel.getCachedTileObjectImageSource({
                    gameConfig,
                    version     : User.UserModel.getSelfSettingsTextureVersion(),
                    themeType   : Types.TileThemeType.Clear,
                    objectType  : tileData.objectType || CommonConstants.TileObjectType.Empty,
                    shapeId     : tileData.objectShapeId || 0,
                    isDark      : false,
                    skinId      : Helpers.getExisted(tileData.skinId || tileData.playerIndex),
                    tickCount,
                });
        }

        protected _getImageY(gridY: number): number {
            return GRID_HEIGHT * (gridY - 1);
        }
    }

    function getMapSize(tileDataArray: ISerialTile[]): MapSize {
        let width   = 0;
        let height  = 0;
        for (const tile of tileDataArray) {
            const gridIndex = Helpers.getExisted(GridIndexHelpers.convertGridIndex(tile.gridIndex));
            width           = Math.max(gridIndex.x + 1, width);
            height          = Math.max(gridIndex.y + 1, height);
        }

        return { width, height };
    }

    class WarMapUnitMapView extends egret.DisplayObjectContainer {
        private readonly _unitViews             : WarMapUnitView[] = [];
        private readonly _airLayer              = new egret.DisplayObjectContainer();
        private readonly _groundLayer           = new egret.DisplayObjectContainer();
        private readonly _seaLayer              = new egret.DisplayObjectContainer();
        private readonly _notifyListenerArray   : Notify.Listener[] = [
            { type: NotifyType.UnitAnimationTick,       callback: this._onNotifyUnitAnimationTick },
            { type: NotifyType.UnitStateIndicatorTick,  callback: this._onNotifyUnitStateIndicatorTick },
        ];

        public constructor() {
            super();

            this.addChild(this._seaLayer);
            this.addChild(this._groundLayer);
            this.addChild(this._airLayer);
            this.addEventListener(egret.Event.ADDED_TO_STAGE, this._onAddedToStage, this);
        }

        public showUnitMap({ unitDataArray, players, gameConfig }: {
            unitDataArray   : WarSerialization.ISerialUnit[];
            players         : ISerialPlayer[] | null;
            gameConfig      : GameConfig;
        }): void {
            this._initWithDataList(_createUnitViewDataList({ unitDataArray, players, gameConfig }));
        }
        private _initWithDataList(dataList: Types.WarMapUnitViewData[]): void {
            this.clear();

            const tickCount = Timer.getUnitAnimationTickCount();
            for (const data of dataList) {
                this._addUnit(data, tickCount);
            }
            this._reviseZOrderForAllUnits();
        }
        public clear(): void {
            for (const view of this._unitViews) {
                (view.parent) && (view.parent.removeChild(view));
            }
            this._unitViews.length = 0;
        }

        private _onAddedToStage(): void {
            this.removeEventListener(egret.Event.ADDED_TO_STAGE, this._onAddedToStage, this);
            this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this._onRemovedFromStage, this);

            Notify.addEventListeners(this._notifyListenerArray, this);
        }
        private _onRemovedFromStage(): void {
            this.addEventListener(egret.Event.ADDED_TO_STAGE, this._onAddedToStage, this);
            this.removeEventListener(egret.Event.REMOVED_FROM_STAGE, this._onRemovedFromStage, this);

            Notify.removeEventListeners(this._notifyListenerArray, this);
        }
        private _onNotifyUnitAnimationTick(): void {
            const tickCount = Timer.getUnitAnimationTickCount();
            for (const view of this._unitViews) {
                view.updateOnAnimationTick(tickCount);
            }
        }
        private _onNotifyUnitStateIndicatorTick(): void {
            for (const view of this._unitViews) {
                view.updateOnStateIndicatorTick();
            }
        }

        private _reviseZOrderForAllUnits(): void {
            this._reviseZOrderForSingleLayer(this._airLayer);
            this._reviseZOrderForSingleLayer(this._groundLayer);
            this._reviseZOrderForSingleLayer(this._seaLayer);
        }
        private _reviseZOrderForSingleLayer(layer: egret.DisplayObjectContainer): void {
            const unitsCount    = layer.numChildren;
            const unitViews     : WarMapUnitView[] = [];
            for (let i = 0; i < unitsCount; ++i) {
                unitViews.push(layer.getChildAt(i) as WarMapUnitView);
            }
            unitViews.sort((v1, v2): number => {
                const g1 = Helpers.getExisted(GridIndexHelpers.convertGridIndex(v1.getUnitData()?.gridIndex));
                const g2 = Helpers.getExisted(GridIndexHelpers.convertGridIndex(v2.getUnitData()?.gridIndex));
                const y1 = g1.y;
                const y2 = g2.y;
                return y1 !== y2 ? y1 - y2 : g1.x - g2.x;
            });

            for (let i = 0; i < unitsCount; ++i) {
                layer.addChildAt(unitViews[i], i);
            }
        }

        private _addUnit(data: Types.WarMapUnitViewData, tickCount: number): void {
            const view = new WarMapUnitView(data, tickCount);
            this._unitViews.push(view);

            switch (data.gameConfig.getUnitTemplateCfg(Helpers.getExisted(data.unitType))?.layer) {
                case CommonConstants.UnitDisplayLayer.Air       : this._airLayer.addChild(view);                                                    break;
                case CommonConstants.UnitDisplayLayer.Ground    : this._groundLayer.addChild(view);                                                 break;
                case CommonConstants.UnitDisplayLayer.Sea       : this._seaLayer.addChild(view);                                                    break;
                default                                         : throw Helpers.newError(`Invalid layer`, ClientErrorCode.WarMapView_AddUnit_00);
            }
        }
    }

    function _createUnitViewDataList({ unitDataArray, players, gameConfig }: {
        unitDataArray   : WarSerialization.ISerialUnit[];
        players         : ISerialPlayer[] | null;
        gameConfig      : GameConfig;
    }): Types.WarMapUnitViewData[] {
        const dataArray: Types.WarMapUnitViewData[] = [];
        if (unitDataArray) {
            const loaderUnitIdSet = new Set<number>();
            for (const unitData of unitDataArray) {
                const loaderUnitId = unitData.loaderUnitId;
                if (loaderUnitId == null) {
                    const data      = Helpers.deepClone(unitData) as Types.WarMapUnitViewData;
                    data.gameConfig = gameConfig;
                    dataArray.push(data);
                } else {
                    loaderUnitIdSet.add(loaderUnitId);
                }
            }

            for (const unitData of dataArray) {
                if (loaderUnitIdSet.has(Helpers.getExisted(unitData.unitId))) {
                    unitData.hasLoadedUnit = true;
                }

                const playerData = players ? players.find(v => v.playerIndex === unitData.playerIndex) : null;
                if (playerData) {
                    unitData.coUsingSkillType   = Helpers.getExisted(playerData.coUsingSkillType);
                    unitData.skinId             = Helpers.getExisted(playerData.unitAndTileSkinId);
                }
            }
        }

        return dataArray;
    }
}

// export default TwnsWarMapView;
