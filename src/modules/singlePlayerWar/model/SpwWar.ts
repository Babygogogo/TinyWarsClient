
namespace TinyWars.SinglePlayerWar {
    import ProtoTypes               = Utility.ProtoTypes;
    import VisibilityHelpers        = Utility.VisibilityHelpers;
    import ISpmWarSaveSlotExtraData = ProtoTypes.SinglePlayerMode.ISpmWarSaveSlotExtraData;

    export abstract class SpwWar extends BaseWar.BwWar {
        private readonly _playerManager         = new SpwPlayerManager();
        private readonly _turnManager           = new SpwTurnManager();
        private readonly _field                 = new SpwField();
        private readonly _commonSettingManager  = new BaseWar.BwCommonSettingManager();
        private readonly _warEventManager       = new BaseWar.BwWarEventManager();

        private _saveSlotIndex      : number;
        private _saveSlotExtraData  : ISpmWarSaveSlotExtraData;

        public abstract serialize(): ProtoTypes.WarSerialization.ISerialWar;

        public updateTilesAndUnitsOnVisibilityChanged(): void {
            const teamIndexes   = this.getPlayerManager().getAliveWatcherTeamIndexesForSelf();
            const visibleUnits  = VisibilityHelpers.getAllUnitsOnMapVisibleToTeams(this, teamIndexes);
            this.getUnitMap().forEachUnitOnMap(unit => {
                unit.setViewVisible(visibleUnits.has(unit));
            });

            const visibleTiles  = VisibilityHelpers.getAllTilesVisibleToTeams(this, teamIndexes);
            const tileMap       = this.getTileMap();
            tileMap.forEachTile(tile => {
                tile.setHasFog(!visibleTiles.has(tile));
                tile.flushDataToView();
            });
            tileMap.getView().updateCoZone();
        }

        public getPlayerManager(): SpwPlayerManager {
            return this._playerManager;
        }
        public getField(): SpwField {
            return this._field;
        }
        public getTurnManager(): SpwTurnManager {
            return this._turnManager;
        }
        public getCommonSettingManager(): BaseWar.BwCommonSettingManager {
            return this._commonSettingManager;
        }
        public getWarEventManager(): BaseWar.BwWarEventManager {
            return this._warEventManager;
        }

        public setSaveSlotIndex(slotIndex: number): void {
            this._saveSlotIndex = slotIndex;
        }
        public getSaveSlotIndex(): number {
            return this._saveSlotIndex;
        }

        public setSaveSlotExtraData(extraData: ISpmWarSaveSlotExtraData): void {
            this._saveSlotExtraData = extraData;
        }
        public getSaveSlotExtraData(): ISpmWarSaveSlotExtraData | null | undefined {
            return this._saveSlotExtraData;
        }

        public getHumanPlayerIndexes(): number[] {
            return (this.getPlayerManager() as SpwPlayerManager).getHumanPlayerIndexes();
        }
        public getHumanPlayers(): BaseWar.BwPlayer[] {
            return (this.getPlayerManager() as SpwPlayerManager).getHumanPlayers();
        }
        public checkIsHumanInTurn(): boolean {
            return this.getHumanPlayerIndexes().indexOf(this.getPlayerIndexInTurn()) >= 0;
        }
    }
}
