
// import CommonConstants      from "../../tools/helpers/CommonConstants";
// import GridIndexHelpers     from "../../tools/helpers/GridIndexHelpers";
// import Helpers              from "../../tools/helpers/Helpers";
// import Notify               from "../../tools/notify/Notify";
// import TwnsNotifyType       from "../../tools/notify/NotifyType";
// import TwnsUiImage          from "../../tools/ui/UiImage";
// import UserModel            from "../../user/model/UserModel";
// import TwnsBwTileMap        from "../model/BwTileMap";
// import WarVisibilityHelpers from "../../tools/warHelpers/WarVisibilityHelpers";
// import TwnsBwTileView       from "./BwTileView";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace TwnsBwTileMapView {
    import NotifyType   = TwnsNotifyType.NotifyType;

    const { width: GRID_WIDTH, height: GRID_HEIGHT } = CommonConstants.GridSize;

    export class BwTileMapView extends egret.DisplayObjectContainer {
        private readonly _tileViewArray             : TwnsBwTileView.BwTileView[] = [];
        private readonly _baseLayer                 = new egret.DisplayObjectContainer();
        private readonly _decoratorLayer            = new egret.DisplayObjectContainer();
        private readonly _gridBorderLayer           = new egret.DisplayObjectContainer();
        private readonly _objectLayer               = new egret.DisplayObjectContainer();
        private readonly _locationLayer             = new egret.DisplayObjectContainer();
        private readonly _coZoneContainer           = new egret.DisplayObjectContainer();
        private readonly _coZoneAreaImageDict       = new Map<number, TwnsUiImage.UiImage[][]>();
        private readonly _coZoneBorderImageArray    : TwnsUiImage.UiImage[] = [];

        private readonly _notifyListeners   = [
            { type: NotifyType.TileAnimationTick,                   callback: this._onNotifyTileAnimationTick },
            { type: NotifyType.UserSettingsIsShowGridBorderChanged, callback: this._onNotifyIsShowGridBorderChanged },
            { type: NotifyType.BwTileLocationFlagSet,               callback: this._onNotifyBwTileLocationFlagSet },
            { type: NotifyType.UserSettingsOpacitySettingsChanged,  callback: this._onNotifyUserSettingsOpacitySettingsChanged },
        ];

        private _tileMap?: TwnsBwTileMap.BwTileMap;

        public constructor() {
            super();

            this.addChild(this._baseLayer);
            this.addChild(this._decoratorLayer);
            this.addChild(this._gridBorderLayer);
            this.addChild(this._objectLayer);
            this.addChild(this._locationLayer);
            this.addChild(this._coZoneContainer);
            this._locationLayer.alpha   = 0.6;
            this._gridBorderLayer.alpha = 0.3;

            this._updateOpacityForTileLayers();
        }

        public init(tileMap: TwnsBwTileMap.BwTileMap): void {
            this._tileMap = tileMap;

            {
                const tileViewArray     = this._tileViewArray;
                const baseLayer         = this._baseLayer;
                const decoratorLayer    = this._decoratorLayer;
                const objectLayer       = this._objectLayer;
                tileViewArray.length    = 0;
                baseLayer.removeChildren();
                decoratorLayer.removeChildren();
                objectLayer.removeChildren();

                for (const tile of tileMap.getAllTiles()) {
                    const view  = tile.getView();
                    const x     = GRID_WIDTH * tile.getGridX();
                    const y     = GRID_HEIGHT * (tile.getGridY() + 1);
                    tileViewArray.push(view);

                    {
                        const imgBase   = view.getImgBase();
                        imgBase.x       = x;
                        imgBase.y       = y;
                        baseLayer.addChild(imgBase);
                    }

                    {
                        const imgDecorator  = view.getImgDecorator();
                        imgDecorator.x      = x;
                        imgDecorator.y      = y;
                        decoratorLayer.addChild(imgDecorator);
                    }

                    {
                        const imgObject = view.getImgObject();
                        imgObject.x     = x;
                        imgObject.y     = y;
                        objectLayer.addChild(imgObject);
                    }
                }
            }

            const { width: mapWidth, height: mapHeight } = tileMap.getMapSize();
            {
                const borderWidth       = mapWidth * GRID_WIDTH;
                const borderHeight      = mapHeight * GRID_HEIGHT;
                const gridBorderLayer   = this._gridBorderLayer;
                gridBorderLayer.removeChildren();
                for (let x = 0; x <= mapWidth; ++x) {
                    const img       = new TwnsUiImage.UiImage(`uncompressedColorBlack0000`);
                    img.smoothing   = false;
                    img.width       = 1;
                    img.height      = borderHeight;
                    img.x           = (x * GRID_WIDTH) - 0.5;
                    gridBorderLayer.addChild(img);
                }
                for (let y = 0; y <= mapHeight; ++y) {
                    const img       = new TwnsUiImage.UiImage(`uncompressedColorBlack0000`);
                    img.smoothing   = false;
                    img.width       = borderWidth;
                    img.height      = 1;
                    img.y           = (y * GRID_HEIGHT) - 0.5;
                    gridBorderLayer.addChild(img);
                }
                this._updateGridBorderLayerVisible();
            }

            {
                const locationLayer = this._locationLayer;
                locationLayer.removeChildren();

                for (let y = 0; y < mapHeight; ++y) {
                    for (let x = 0; x < mapWidth; ++x) {
                        const imgLocation       = new TwnsUiImage.UiImage(`uncompressedColorWhite0000`);
                        imgLocation.smoothing   = false;
                        imgLocation.x           = x * GRID_WIDTH;
                        imgLocation.y           = y * GRID_HEIGHT;
                        imgLocation.width       = GRID_WIDTH;
                        imgLocation.height      = GRID_HEIGHT;
                        locationLayer.addChild(imgLocation);
                    }
                }
            }
        }
        public fastInit(tileMap: TwnsBwTileMap.BwTileMap): void {
            this._tileMap = tileMap;
        }

        public startRunningView(): void {
            Notify.addEventListeners(this._notifyListeners, this);

            this.resetLocationLayer();
            this._initCoZoneContainer();
            this._startCoZoneAnimation();
            this.updateCoZone();
        }
        public stopRunningView(): void {
            Notify.removeEventListeners(this._notifyListeners, this);

            this._stopCoZoneAnimation();
        }

        public setBaseLayerVisible(visible: boolean): void {
            this._baseLayer.visible = visible;
        }
        public getBaseLayerVisible(): boolean {
            return this._baseLayer.visible;
        }

        public setDecoratorLayerVisible(visible: boolean): void {
            this._decoratorLayer.visible = visible;
        }
        public getDecoratorLayerVisible(): boolean {
            return this._decoratorLayer.visible;
        }

        public setObjectLayerVisible(visible: boolean): void {
            this._objectLayer.visible = visible;
        }
        public getObjectLayerVisible(): boolean {
            return this._objectLayer.visible;
        }

        public resetLocationLayer(): void {
            const locationIdArray   : number[] = [];
            const tileMap           = Helpers.getExisted(this._tileMap);
            for (let locationId = CommonConstants.MapMinLocationId; locationId <= CommonConstants.MapMaxLocationId; ++locationId) {
                if (tileMap.getIsLocationVisible(locationId)) {
                    locationIdArray.push(locationId);
                }
            }

            const mapSize   = tileMap.getMapSize();
            const width     = mapSize.width;
            const height    = mapSize.height;
            const layer     = this._locationLayer;
            for (let y = 0; y < height; ++y) {
                for (let x = 0; x < width; ++x) {
                    const gridIndex : Types.GridIndex = { x, y };
                    const tile      = tileMap.getTile(gridIndex);
                    layer.getChildAt(GridIndexHelpers.getGridId(gridIndex, mapSize)).visible = locationIdArray.some(v => tile.getHasLocationFlag(v));
                }
            }
        }

        private _initCoZoneContainer(): void {
            const container     = this._coZoneContainer;
            const tileMap       = Helpers.getExisted(this._tileMap);
            const mapSize       = tileMap.getMapSize();
            const mapWidth      = mapSize.width;
            const mapHeight     = mapSize.height;
            const playerManager = tileMap.getWar().getPlayerManager();
            const playersCount  = playerManager.getTotalPlayersCount(false);

            {
                const imageDict = this._coZoneAreaImageDict;
                for (let playerIndex = 1; playerIndex <= playersCount; ++playerIndex) {
                    if (!imageDict.has(playerIndex)) {
                        imageDict.set(playerIndex, []);
                    }

                    const imgSource = `c08_t03_s${Helpers.getNumText(playerManager.getPlayer(playerIndex).getUnitAndTileSkinId())}_f01`;
                    const matrix    = Helpers.getExisted(imageDict.get(playerIndex));
                    for (let x = 0; x < mapWidth; ++x) {
                        if (matrix[x] == null) {
                            matrix[x] = [];
                        }

                        const column = matrix[x];
                        for (let y = 0; y < mapHeight; ++y) {
                            if (column[y] == null) {
                                const img       = new TwnsUiImage.UiImage(imgSource);
                                img.smoothing   = false;
                                img.x           = GRID_WIDTH * x;
                                img.y           = GRID_HEIGHT * y;
                                column[y]       = img;
                                container.addChild(img);
                            }
                            column[y].source = imgSource;
                        }

                        for (let y = mapHeight; y < column.length; ++y) {
                            const img = column[y];
                            (img) && (img.parent) && (img.parent.removeChild(img));
                        }
                        column.length = mapHeight;
                    }

                    for (let x = mapWidth; x < matrix.length; ++x) {
                        for (const img of matrix[x] || []) {
                            (img) && (img.parent) && (img.parent.removeChild(img));
                        }
                    }
                    matrix.length = mapWidth;
                }

                for (let playerIndex = playersCount + 1; playerIndex <= CommonConstants.WarMaxPlayerIndex; ++playerIndex) {
                    for (const column of imageDict.get(playerIndex) || []) {
                        for (const img of column || []) {
                            (img) && (img.parent) && (img.parent.removeChild(img));
                        }
                    }
                    imageDict.delete(playerIndex);
                }
            }

            {
                const imgArray  = this._coZoneBorderImageArray;
                const imgsCount = (mapWidth + 1) * mapHeight + (mapHeight + 1) * mapWidth;
                for (let i = imgsCount; i < imgArray.length; ++i) {
                    const img = imgArray[i];
                    (img) && (img.parent) && (img.parent.removeChild(img));
                }
                imgArray.length = imgsCount;

                let i = 0;
                for (let y = 0; y <= mapHeight; ++y) {
                    for (let x = 0; x < mapWidth; ++x) {
                        if (imgArray[i] == null) {
                            const img       = new TwnsUiImage.UiImage(`uncompressedColorWhite0000`);
                            imgArray[i]     = img;
                            img.smoothing   = false;
                            container.addChild(img);
                        }

                        const img   = imgArray[i];
                        img.height  = 2;
                        img.width   = GRID_WIDTH - 2;
                        img.x       = x * GRID_WIDTH + 1;
                        img.y       = y * GRID_HEIGHT - 1;

                        ++i;
                    }
                }
                for (let y = 0; y < mapHeight; ++y) {
                    for (let x = 0; x <= mapWidth; ++x) {
                        if (imgArray[i] == null) {
                            const img       = new TwnsUiImage.UiImage(`uncompressedColorWhite0000`);
                            imgArray[i]     = img;
                            img.smoothing   = false;
                            container.addChild(img);
                        }

                        const img   = imgArray[i];
                        img.width   = 2;
                        img.height  = GRID_HEIGHT - 2;
                        img.x       = x * GRID_WIDTH - 1;
                        img.y       = y * GRID_HEIGHT + 1;

                        ++i;
                    }
                }
            }
        }
        public updateCoZone(): void {
            const tileMap               = Helpers.getExisted(this._tileMap);
            const war                   = tileMap.getWar();
            const mapSize               = tileMap.getMapSize();
            const mapWidth              = mapSize.width;
            const mapHeight             = mapSize.height;
            const playerManager         = war.getPlayerManager();
            const playersCount          = playerManager.getTotalPlayersCount(false);
            const watcherTeamIndexes    = playerManager.getAliveWatcherTeamIndexesForSelf();
            const unitMap               = war.getUnitMap();
            const areaImgDict           = this._coZoneAreaImageDict;
            const borderImgArray        = this._coZoneBorderImageArray;
            for (const img of borderImgArray) {
                img.visible = false;
            }

            for (let playerIndex = 1; playerIndex <= playersCount; ++playerIndex) {
                const player        = war.getPlayer(playerIndex);
                const radius        = player.getCoZoneRadius();
                const gridIndexList = ((radius == null) || (!player.checkHasZoneSkillForCurrentSkills()))
                    ? []
                    : player.getCoGridIndexListOnMap().filter(gridIndex => {
                        const unit = unitMap.getUnitOnMap(gridIndex);
                        return (!!unit)
                            && (WarVisibilityHelpers.checkIsUnitOnMapVisibleToTeams({
                                war,
                                gridIndex,
                                unitType            : unit.getUnitType(),
                                isDiving            : unit.getIsDiving(),
                                unitPlayerIndex     : playerIndex,
                                observerTeamIndexes : watcherTeamIndexes,
                            }));
                    });

                const matrix = Helpers.getExisted(areaImgDict.get(playerIndex));
                for (let x = 0; x < mapWidth; ++x) {
                    for (let y = 0; y < mapHeight; ++y) {
                        matrix[x][y].visible = (gridIndexList.length > 0) && (radius >= GridIndexHelpers.getMinDistance({ x, y }, gridIndexList));
                    }
                }

                for (const coGridIndex of gridIndexList) {
                    const { x: coX, y: coY } = coGridIndex;
                    for (const gridIndex of GridIndexHelpers.getGridsWithinDistance(coGridIndex, radius, radius, mapSize)) {
                        const { x, y }  = gridIndex;
                        const deltaX = x - coX;
                        if (deltaX >= 0) {
                            borderImgArray[y * (mapWidth + 1) + x + 1 + (mapHeight + 1) * mapWidth].visible = true;
                        }
                        if (deltaX <= 0) {
                            borderImgArray[y * (mapWidth + 1) + x + (mapHeight + 1) * mapWidth].visible = true;
                        }

                        const deltaY = y - coY;
                        if (deltaY >= 0) {
                            borderImgArray[(y + 1) * mapWidth + x].visible = true;
                        }
                        if (deltaY <= 0) {
                            borderImgArray[y * mapWidth + x].visible = true;
                        }
                    }
                }
            }
        }
        private _startCoZoneAnimation(): void {
            this._stopCoZoneAnimation();

            const coZoneContainer = this._coZoneContainer;
            coZoneContainer.alpha = 0;
            egret.Tween.get(coZoneContainer, { loop: true })
                .to({ alpha: 0.75 }, 1000)
                .to({ alpha: 0 }, 1000);
        }
        private _stopCoZoneAnimation(): void {
            egret.Tween.removeTweens(this._coZoneContainer);
        }

        private _onNotifyTileAnimationTick(): void {
            for (const view of this._tileViewArray) {
                view.updateView();
            }
        }

        private _onNotifyIsShowGridBorderChanged(): void {
            this._updateGridBorderLayerVisible();
        }

        private _onNotifyBwTileLocationFlagSet(e: egret.Event): void {
            const tileMap   = Helpers.getExisted(this._tileMap);
            const tile      = e.data as NotifyData.BwTileLocationFlagSet;
            const img       = this._locationLayer.getChildAt(GridIndexHelpers.getGridId(tile.getGridIndex(), tileMap.getMapSize()));
            for (let locationId = CommonConstants.MapMinLocationId; locationId <= CommonConstants.MapMaxLocationId; ++locationId) {
                if ((tileMap.getIsLocationVisible(locationId)) && (tile.getHasLocationFlag(locationId))) {
                    img.visible = true;
                    return;
                }
            }

            img.visible = false;
        }

        private _onNotifyUserSettingsOpacitySettingsChanged(): void {
            this._updateOpacityForTileLayers();
        }

        private _updateGridBorderLayerVisible(): void {
            this._gridBorderLayer.visible = UserModel.getSelfSettingsIsShowGridBorder();
        }

        private _updateOpacityForTileLayers(): void {
            const opacitySettings       = UserModel.getSelfSettingsOpacitySettings();
            this._baseLayer.alpha       = (opacitySettings?.tileBaseOpacity ?? 100) / 100;
            this._objectLayer.alpha     = (opacitySettings?.tileObjectOpacity ?? 100) / 100;
            this._decoratorLayer.alpha  = (opacitySettings?.tileDecoratorOpacity ?? 100) / 100;
        }
    }
}

// export default TwnsBwTileMapView;
