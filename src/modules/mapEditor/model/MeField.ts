
namespace TinyWars.MapEditor {
    import Types = Utility.Types;

    export class MeField {
        private _unitMap            : MeUnitMap;
        private _tileMap            : MeTileMap;
        private _cursor             : MeCursor;
        private _gridVisionEffect   : MeGridVisionEffect;
        private _view               : MeFieldView;

        private _mapDesigner    : string;
        private _mapName        : string;
        private _mapNameEnglish : string;
        private _designerUserId : number;
        private _modifiedTime   : number;
        private _isMultiPlayer  : boolean;
        private _isSinglePlayer : boolean;

        public init(data: Types.MapRawData, configVersion: string): MeField {
            this._setTileMap((this.getTileMap() || new MeTileMap()).init(configVersion, data));
            this._setUnitMap((this.getUnitMap() || new MeUnitMap()).init(configVersion, data));
            this._setCursor((this.getCursor() || new MeCursor()).init(data));
            this._setGridVisionEffect((this.getGridVisionEffect() || new MeGridVisionEffect()).init());

            this.setMapDesigner(data.mapDesigner);
            this.setMapName(data.mapName);
            this.setMapNameEnglish(data.mapNameEnglish);
            this.setDesignerUserId(data.designerUserId);
            this.setModifiedTime(data.modifiedTime);
            this.setIsMultiPlayer(data.isMultiPlayer);
            this.setIsSinglePlayer(data.isSinglePlayer);

            this._view = this._view || new MeFieldView();
            this._view.init(this);

            return this;
        }

        public startRunning(war: MeWar): void {
            this.getTileMap().startRunning(war);
            this.getUnitMap().startRunning(war);
            this.getCursor().startRunning(war);
            this.getGridVisionEffect().startRunning(war);
        }
        public startRunningView(): void {
            this.getView().startRunningView();
            this.getTileMap().startRunningView();
            this.getUnitMap().startRunningView();
            this.getCursor().startRunningView();
            this.getGridVisionEffect().startRunningView();
        }
        public stopRunning(): void {
            this.getView().stopRunningView();
            this.getTileMap().stopRunning();
            this.getUnitMap().stopRunning();
            this.getCursor().stopRunning();
            this.getGridVisionEffect().stopRunning();
        }

        public serialize(): Types.MapRawData {
            const tileMap           = this.getTileMap();
            const mapSize           = tileMap.getMapSize();
            const serializedTileMap = tileMap.serialize();
            return {
                mapDesigner     : this.getMapDesigner(),
                mapName         : this.getMapName(),
                mapNameEnglish  : this.getMapNameEnglish(),
                mapWidth        : mapSize.width,
                mapHeight       : mapSize.height,
                designerUserId  : this.getDesignerUserId(),
                isMultiPlayer   : this.getIsMultiPlayer(),
                isSinglePlayer  : this.getIsSinglePlayer(),
                playersCount    : this.getPlayersCount(),
                tileBases       : serializedTileMap.tileBases,
                tileObjects     : serializedTileMap.tileObjects,
                units           : null,
                unitDataList    : this.getUnitMap().serialize(),
                tileDataList    : serializedTileMap.tileDataList,
            }
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // The other functions.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        public getView(): MeFieldView {
            return this._view;
        }

        private _setTileMap(map: MeTileMap): void {
            this._tileMap = map;
        }
        public getTileMap(): MeTileMap {
            return this._tileMap;
        }

        private _setUnitMap(map: MeUnitMap): void {
            this._unitMap = map;
        }
        public getUnitMap(): MeUnitMap {
            return this._unitMap;
        }

        private _setCursor(cursor: MeCursor): void {
            this._cursor = cursor;
        }
        public getCursor(): MeCursor {
            return this._cursor;
        }

        private _setGridVisionEffect(gridVisionEffect: MeGridVisionEffect): void {
            this._gridVisionEffect = gridVisionEffect;
        }
        public getGridVisionEffect(): MeGridVisionEffect {
            return this._gridVisionEffect;
        }

        public setMapDesigner(mapDesigner: string): void {
            this._mapDesigner = mapDesigner;
        }
        public getMapDesigner(): string {
            return this._mapDesigner;
        }

        public setDesignerUserId(id: number): void {
            this._designerUserId = id;
        }
        public getDesignerUserId(): number {
            return this._designerUserId;
        }

        public setModifiedTime(time: number): void {
            this._modifiedTime = time;
        }
        public getModifiedTime(): number {
            return this._modifiedTime;
        }

        public setMapName(mapName: string): void {
            this._mapName = mapName;
        }
        public getMapName(): string {
            return this._mapName;
        }

        public setMapNameEnglish(mapNameEnglish: string): void {
            this._mapNameEnglish = mapNameEnglish;
        }
        public getMapNameEnglish(): string {
            return this._mapNameEnglish;
        }

        public setIsMultiPlayer(isMultiPlayer: boolean): void {
            this._isMultiPlayer = isMultiPlayer;
        }
        public getIsMultiPlayer(): boolean {
            return this._isMultiPlayer;
        }

        public setIsSinglePlayer(isSinglePlayer: boolean): void {
            this._isSinglePlayer = isSinglePlayer;
        }
        public getIsSinglePlayer(): boolean {
            return this._isSinglePlayer;
        }

        public getPlayersCount(): number {
            let playersCount = 0;
            this.getTileMap().forEachTile(tile => {
                playersCount = Math.max(playersCount, tile.getPlayerIndex());
            });
            this.getUnitMap().forEachUnit(unit => {
                playersCount = Math.max(playersCount, unit.getPlayerIndex());
            });
            return playersCount;
        }
    }
}
