
namespace TinyWars.MultiPlayerWar {
    import Types                = Utility.Types;
    import ProtoTypes           = Utility.ProtoTypes;
    import VisibilityHelpers    = Utility.VisibilityHelpers;
    import DestructionHelpers   = Utility.DestructionHelpers;
    import CommonConstants      = Utility.CommonConstants;
    import Lang                 = Utility.Lang;
    import WarAction            = ProtoTypes.WarAction;

    export abstract class MpwWar extends BaseWar.BwWar {
        private readonly _playerManager         = new MpwPlayerManager();
        private readonly _field                 = new MpwField();
        private readonly _commonSettingManager  = new BaseWar.BwCommonSettingManager();
        private readonly _warEventManager       = new BaseWar.BwWarEventManager();

        public getField(): MpwField {
            return this._field;
        }
        public getPlayerManager(): MpwPlayerManager {
            return this._playerManager;
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
            for (const unit of this.getUnitMap().getAllUnitsOnMap()) {
                if (visibleUnitsOnMap.has(unit)) {
                    unit.setViewVisible(true);
                } else {
                    DestructionHelpers.removeUnitOnMap(this, unit.getGridIndex());
                }
            }
            DestructionHelpers.removeInvisibleLoadedUnits(this, watcherTeamIndexes);

            const visibleTiles  = VisibilityHelpers.getAllTilesVisibleToTeams(this, watcherTeamIndexes);
            const tileMap       = this.getTileMap();
            for (const tile of tileMap.getAllTiles()) {
                if (visibleTiles.has(tile)) {
                    tile.setHasFog(false);
                } else {
                    if (!tile.getHasFog()) {
                        MpwUtility.resetTileDataAsHasFog(tile);
                    }
                }
                tile.flushDataToView();
            }
            tileMap.getView().updateCoZone();
        }

        public async getDescForExePlayerDeleteUnit(action: WarAction.IWarActionPlayerDeleteUnit): Promise<string | undefined> {
            return undefined;
        }
        public async getDescForExePlayerEndTurn(action: WarAction.IWarActionPlayerEndTurn): Promise<string | undefined> {
            return Lang.getFormattedText(Lang.Type.F0030, await this.getPlayerInTurn().getNickname(), this.getPlayerIndexInTurn());
        }
        public async getDescForExePlayerProduceUnit(action: WarAction.IWarActionPlayerProduceUnit): Promise<string | undefined> {
            return undefined;
        }
        public async getDescForExePlayerSurrender(action: WarAction.IWarActionPlayerSurrender): Promise<string | undefined> {
            return Lang.getFormattedText(action.deprecatedIsBoot ? Lang.Type.F0028 : Lang.Type.F0008, await this.getPlayerInTurn().getNickname());
        }
        public async getDescForExePlayerVoteForDraw(action: WarAction.IWarActionPlayerVoteForDraw): Promise<string | undefined> {
            const nickname      = await this.getPlayerInTurn().getNickname();
            const playerIndex   = this.getPlayerIndexInTurn();
            if (!action.isAgree) {
                return Lang.getFormattedText(Lang.Type.F0017, playerIndex, nickname);
            } else {
                if (this.getDrawVoteManager().getRemainingVotes()) {
                    return Lang.getFormattedText(Lang.Type.F0018, playerIndex, nickname);
                } else {
                    return Lang.getFormattedText(Lang.Type.F0019, playerIndex, nickname);
                }
            }
        }
        public async getDescForExeSystemBeginTurn(action: WarAction.IWarActionSystemBeginTurn): Promise<string | undefined> {
            const playerIndex = this.getPlayerIndexInTurn();
            if (playerIndex === CommonConstants.WarNeutralPlayerIndex) {
                return Lang.getFormattedText(Lang.Type.F0022, Lang.getText(Lang.Type.B0111), playerIndex);
            } else {
                return Lang.getFormattedText(Lang.Type.F0022, await this.getPlayerInTurn().getNickname(), playerIndex);
            }
        }
        public async getDescForExeSystemCallWarEvent(action: WarAction.IWarActionSystemCallWarEvent): Promise<string | undefined> {
            return `${Lang.getText(Lang.Type.B0451)}`;
        }
        public async getDescForExeSystemDestroyPlayerForce(action: WarAction.IWarActionSystemDestroyPlayerForce): Promise<string | undefined> {
            const playerIndex = action.targetPlayerIndex;
            return `p${playerIndex} ${await this.getPlayer(playerIndex).getNickname()} ${Lang.getText(Lang.Type.B0450)}`;
        }
        public async getDescForExeSystemEndWar(action: WarAction.IWarActionSystemEndWar): Promise<string | undefined> {
            return `${Lang.getText(Lang.Type.B0087)}`;
        }
        public async getDescForExeSystemEndTurn(action: WarAction.IWarActionSystemEndTurn): Promise<string | undefined> {
            return Lang.getFormattedText(Lang.Type.F0030, await this.getPlayerInTurn().getNickname(), this.getPlayerIndexInTurn());
        }
        public async getDescForExeSystemHandleBootPlayer(action: WarAction.IWarActionSystemHandleBootPlayer): Promise<string | undefined> {
            return Lang.getFormattedText(Lang.Type.F0028, await this.getPlayerInTurn().getNickname());
        }
        public async getDescForExeUnitAttackTile(action: WarAction.IWarActionUnitAttackTile): Promise<string | undefined> {
            return undefined;
        }
        public async getDescForExeUnitAttackUnit(action: WarAction.IWarActionUnitAttackUnit): Promise<string | undefined> {
            return undefined;
        }
        public async getDescForExeUnitBeLoaded(action: WarAction.IWarActionUnitBeLoaded): Promise<string | undefined> {
            return undefined;
        }
        public async getDescForExeUnitBuildTile(action: WarAction.IWarActionUnitBuildTile): Promise<string | undefined> {
            return undefined;
        }
        public async getDescForExeUnitCaptureTile(action: WarAction.IWarActionUnitCaptureTile): Promise<string | undefined> {
            return undefined;
        }
        public async getDescForExeUnitDive(action: WarAction.IWarActionUnitDive): Promise<string | undefined> {
            return undefined;
        }
        public async getDescForExeUnitDropUnit(action: WarAction.IWarActionUnitDropUnit): Promise<string | undefined> {
            return undefined;
        }
        public async getDescForExeUnitJoinUnit(action: WarAction.IWarActionUnitJoinUnit): Promise<string | undefined> {
            return undefined;
        }
        public async getDescForExeUnitLaunchFlare(action: WarAction.IWarActionUnitLaunchFlare): Promise<string | undefined> {
            return undefined;
        }
        public async getDescForExeUnitLaunchSilo(action: WarAction.IWarActionUnitLaunchSilo): Promise<string | undefined> {
            return undefined;
        }
        public async getDescForExeUnitLoadCo(action: WarAction.IWarActionUnitLoadCo): Promise<string | undefined> {
            return undefined;
        }
        public async getDescForExeUnitProduceUnit(action: WarAction.IWarActionUnitProduceUnit): Promise<string | undefined> {
            return undefined;
        }
        public async getDescForExeUnitSupplyUnit(action: WarAction.IWarActionUnitSupplyUnit): Promise<string | undefined> {
            return undefined;
        }
        public async getDescForExeUnitSurface(action: WarAction.IWarActionUnitSurface): Promise<string | undefined> {
            return undefined;
        }
        public async getDescForExeUnitUseCoSkill(action: WarAction.IWarActionUnitUseCoSkill): Promise<string | undefined> {
            return undefined;
        }
        public async getDescForExeUnitWait(action: WarAction.IWarActionUnitWait): Promise<string | undefined> {
            return undefined;
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

        public getIsRunTurnPhaseWithExtraData(): boolean {
            return true;
        }

        public getPlayerIndexLoggedIn(): number | undefined {
            return this.getPlayerManager().getPlayerIndexLoggedIn();
        }
        public getPlayerLoggedIn(): BaseWar.BwPlayer {
            return this.getPlayerManager().getPlayerLoggedIn();
        }
    }
}
