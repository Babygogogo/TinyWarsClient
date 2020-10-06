
namespace TinyWars.BaseWar {
    import Notify               = Utility.Notify;
    import Helpers              = Utility.Helpers;
    import GridIndexHelpers     = Utility.GridIndexHelpers;
    import VisibilityHelpers    = Utility.VisibilityHelpers;

    const { width: GRID_WIDTH, height: GRID_HEIGHT } = Utility.ConfigManager.getGridSize();

    export abstract class BwTileMapView extends egret.DisplayObjectContainer {
        private _tileViews          = new Array<BwTileView>();
        private _baseLayer          = new egret.DisplayObjectContainer();
        private _objectLayer        = new egret.DisplayObjectContainer();
        private _coZoneContainer    = new egret.DisplayObjectContainer();
        private _coZoneImages       = new Map<number, GameUi.UiImage[][]>();

        private _tileMap                : BwTileMap;
        private _isCoZoneInitialized    = false;

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
            const coZoneContainer = this._coZoneContainer;
            egret.Tween.removeTweens(coZoneContainer);
            coZoneContainer.alpha = 0;
            egret.Tween.get(coZoneContainer, { loop: true })
                .to({ alpha: 0.75 }, 1000)
                .to({ alpha: 0 }, 1000);

            this.updateCoZone();
        }
        public stopRunningView(): void {
            Notify.removeEventListeners(this._notifyListeners, this);

            egret.Tween.removeTweens(this._coZoneContainer);
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
            if (!this._isCoZoneInitialized) {
                this._isCoZoneInitialized = true;

                const container = this._coZoneContainer;
                container.removeChildren();

                const images = this._coZoneImages;
                images.clear();

                const tileMap                                   = this._tileMap;
                const { width: mapWidth, height: mapHeight }    = tileMap.getMapSize();
                const playersCount                              = tileMap.getWar().getPlayerManager().getTotalPlayersCount(false);
                for (let i = 1; i <= playersCount; ++i) {
                    const layer     = new egret.DisplayObjectContainer();
                    const imgSource = `c08_t03_s${Helpers.getNumText(i)}_f01`;
                    const matrix: GameUi.UiImage[][] = [];
                    for (let x = 0; x < mapWidth; ++x) {
                        matrix[x] = [];
                        for (let y = 0; y < mapHeight; ++y) {
                            const img   = new GameUi.UiImage(imgSource);
                            img.x       = GRID_WIDTH * x;
                            img.y       = GRID_HEIGHT * y;
                            layer.addChild(img);
                            matrix[x].push(img);
                        }
                    }

                    images.set(i, matrix);
                    container.addChild(layer);
                }
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
                                unitType: unit.getType(),
                                isDiving: unit.getIsDiving(),
                                unitPlayerIndex: playerIndex,
                                observerTeamIndexes: watcherTeamIndexes
                            }));
                    });

                const matrix = this._coZoneImages.get(playerIndex);
                for (let x = 0; x < mapWidth; ++x) {
                    for (let y = 0; y < mapHeight; ++y) {
                        matrix[x][y].visible = (gridIndexList.length > 0) && (radius >= GridIndexHelpers.getMinDistance({ x, y }, gridIndexList));
                    }
                }
            }
        }

        private _onNotifyTileAnimationTick(e: egret.Event): void {
            for (const view of this._tileViews) {
                view.updateView();
            }
        }
    }
}
