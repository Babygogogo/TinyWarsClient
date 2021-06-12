
namespace TinyWars.MultiPlayerWar {
    import Types                = Utility.Types;
    import VisibilityHelpers    = Utility.VisibilityHelpers;
    import DestructionHelpers   = Utility.DestructionHelpers;

    export abstract class MpwWar extends BaseWar.BwWar {
        private readonly _playerManager         = new MpwPlayerManager();
        private readonly _turnManager           = new MpwTurnManager();
        private readonly _field                 = new MpwField();
        private readonly _commonSettingManager  = new BaseWar.BwCommonSettingManager();
        private readonly _warEventManager       = new BaseWar.BwWarEventManager();

        public abstract getSettingsBootTimerParams(): number[];

        public getField(): MpwField {
            return this._field;
        }
        public getPlayerManager(): MpwPlayerManager {
            return this._playerManager;
        }
        public getTurnManager(): MpwTurnManager {
            return this._turnManager;
        }
        public getCommonSettingManager(): BaseWar.BwCommonSettingManager {
            return this._commonSettingManager;
        }
        public getIsWarMenuPanelOpening(): boolean {
            return MpwWarMenuPanel.getIsOpening();
        }
        public getWarEventManager(): BaseWar.BwWarEventManager {
            return this._warEventManager;
        }

        public updateTilesAndUnitsOnVisibilityChanged(): void {
            const watcherTeamIndexes    = this.getPlayerManager().getAliveWatcherTeamIndexesForSelf();
            const visibleUnitsOnMap     = VisibilityHelpers.getAllUnitsOnMapVisibleToTeams(this, watcherTeamIndexes);
            this.getUnitMap().forEachUnitOnMap(unit => {
                if (visibleUnitsOnMap.has(unit)) {
                    unit.setViewVisible(true);
                } else {
                    DestructionHelpers.removeUnitOnMap(this, unit.getGridIndex());
                }
            });
            DestructionHelpers.removeInvisibleLoadedUnits(this, watcherTeamIndexes);

            const visibleTiles  = VisibilityHelpers.getAllTilesVisibleToTeams(this, watcherTeamIndexes);
            const tileMap       = this.getTileMap();
            tileMap.forEachTile(tile => {
                if (visibleTiles.has(tile)) {
                    tile.setHasFog(false);
                } else {
                    if (!tile.getHasFog()) {
                        MpwUtility.resetTileDataAsHasFog(tile);
                    }
                }
                tile.flushDataToView();
            });
            tileMap.getView().updateCoZone();
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // The other functions.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        public getBootRestTime(): number | null {
            const player = this.getPlayerInTurn();
            if (player.getPlayerIndex() === 0) {
                return null;
            } else {
                return (this.getEnterTurnTime() + player.getRestTimeToBoot() - Time.TimeModel.getServerTimestamp()) || null;
            }
        }

        public checkIsBoot(): boolean {
            if (this.getIsEnded()) {
                return false;
            } else {
                const player = this.getPlayerInTurn();
                return (player.getAliveState() === Types.PlayerAliveState.Alive)
                    && (!player.checkIsNeutral())
                    && (Time.TimeModel.getServerTimestamp() > this.getEnterTurnTime() + player.getRestTimeToBoot());
            }
        }

        public getPlayerIndexLoggedIn(): number | undefined {
            return (this.getPlayerManager() as MpwPlayerManager).getPlayerIndexLoggedIn();
        }
        public getPlayerLoggedIn(): BaseWar.BwPlayer {
            return (this.getPlayerManager() as MpwPlayerManager).getPlayerLoggedIn();
        }
    }
}
