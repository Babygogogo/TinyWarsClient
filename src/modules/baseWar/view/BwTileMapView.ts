
namespace TinyWars.BaseWar {
    import Notify               = Utility.Notify;
    import Helpers              = Utility.Helpers;
    import ConfigManager        = Utility.ConfigManager;
    import GridIndexHelpers     = Utility.GridIndexHelpers;
    import VisibilityHelpers    = Utility.VisibilityHelpers;
    import CommonConstants      = ConfigManager.COMMON_CONSTANTS;

    const { width: GRID_WIDTH, height: GRID_HEIGHT } = ConfigManager.getGridSize();

    export class BwTileMapView extends egret.DisplayObjectContainer {
        private readonly _tileViews         = new Array<BwTileView>();
        private readonly _baseLayer         = new egret.DisplayObjectContainer();
        private readonly _objectLayer       = new egret.DisplayObjectContainer();
        private readonly _coZoneContainer   = new egret.DisplayObjectContainer();
        private readonly _coZoneImageDict   = new Map<number, GameUi.UiImage[][]>();

        private _tileMap            : BwTileMap;

        private _notifyListeners = [
            { type: Notify.Type.TileAnimationTick, callback: this._onNotifyTileAnimationTick },
        ];

        public constructor() {
            super();

            this.addChild(this._baseLayer);
            this.addChild(this._objectLayer);
            this.addChild(this._coZoneContainer);
        }

        public init(tileMap: BwTileMap): void {
            this._tileMap = tileMap;

            this._tileViews.length = 0;
            this._baseLayer.removeChildren();
            this._objectLayer.removeChildren();

            tileMap.forEachTile(tile => {
                const view  = tile.getView();
                const x     = GRID_WIDTH * tile.getGridX();
                const y     = GRID_HEIGHT * (tile.getGridY() + 1);
                this._tileViews.push(view);

                const imgBase = view.getImgBase();
                imgBase.x   = x;
                imgBase.y   = y;
                this._baseLayer.addChild(imgBase);

                const imgObject = view.getImgObject();
                imgObject.x = x;
                imgObject.y = y;
                this._objectLayer.addChild(imgObject);
            });
        }
        public fastInit(tileMap: BwTileMap): void {
            this._tileMap = tileMap;
        }

        public startRunningView(): void {
            Notify.addEventListeners(this._notifyListeners, this);

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

        public setObjectLayerVisible(visible: boolean): void {
            this._objectLayer.visible = visible;
        }
        public getObjectLayerVisible(): boolean {
            return this._objectLayer.visible;
        }

        private _initCoZoneContainer(): void {
            const container                                 = this._coZoneContainer;
            const imageDict                                 = this._coZoneImageDict;
            const tileMap                                   = this._tileMap;
            const { width: mapWidth, height: mapHeight }    = tileMap.getMapSize();
            const playerManager                             = tileMap.getWar().getPlayerManager();
            const playersCount                              = playerManager.getTotalPlayersCount(false);

            for (let playerIndex = 1; playerIndex <= playersCount; ++playerIndex) {
                if (!imageDict.has(playerIndex)) {
                    imageDict.set(playerIndex, []);
                }

                const imgSource = `c08_t03_s${Helpers.getNumText(playerManager.getPlayer(playerIndex).getUnitAndTileSkinId())}_f01`;
                const matrix    = imageDict.get(playerIndex);
                for (let x = 0; x < mapWidth; ++x) {
                    if (matrix[x] == null) {
                        matrix[x] = [];
                    }

                    const column = matrix[x];
                    for (let y = 0; y < mapHeight; ++y) {
                        if (column[y] == null) {
                            const img   = new GameUi.UiImage(imgSource);
                            img.x       = GRID_WIDTH * x;
                            img.y       = GRID_HEIGHT * y;
                            column[y]   = img;
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
        public updateCoZone(): void {
            const tileMap                                   = this._tileMap;
            const war                                       = tileMap.getWar();
            const { width: mapWidth, height: mapHeight }    = tileMap.getMapSize();
            const playerManager                             = war.getPlayerManager();
            const playersCount                              = playerManager.getTotalPlayersCount(false);
            const watcherTeamIndexes                        = playerManager.getAliveWatcherTeamIndexesForSelf();
            const unitMap                                   = war.getUnitMap();

            for (let playerIndex = 1; playerIndex <= playersCount; ++playerIndex) {
                const player        = war.getPlayer(playerIndex);
                const radius        = player.getCoZoneRadius();
                const gridIndexList = ((radius == null) || (!player.checkHasZoneSkillForCurrentSkills()))
                    ? []
                    : player.getCoGridIndexListOnMap().filter(gridIndex => {
                        const unit = unitMap.getUnitOnMap(gridIndex);
                        return (!!unit)
                            && (VisibilityHelpers.checkIsUnitOnMapVisibleToTeams({
                                war,
                                gridIndex,
                                unitType: unit.getUnitType(),
                                isDiving: unit.getIsDiving(),
                                unitPlayerIndex: playerIndex,
                                observerTeamIndexes: watcherTeamIndexes
                            }));
                    });

                const matrix = this._coZoneImageDict.get(playerIndex);
                for (let x = 0; x < mapWidth; ++x) {
                    for (let y = 0; y < mapHeight; ++y) {
                        matrix[x][y].visible = (gridIndexList.length > 0) && (radius >= GridIndexHelpers.getMinDistance({ x, y }, gridIndexList));
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

        private _onNotifyTileAnimationTick(e: egret.Event): void {
            for (const view of this._tileViews) {
                view.updateView();
            }
        }
    }
}
