
namespace TinyWars.SinglePlayerWar {
    import ProtoTypes               = Utility.ProtoTypes;
    import Lang                     = Utility.Lang;
    import CommonConstants          = Utility.CommonConstants;
    import VisibilityHelpers        = Utility.VisibilityHelpers;
    import WarAction                = ProtoTypes.WarAction;
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
            return Lang.getFormattedText(action.isBoot ? Lang.Type.F0028 : Lang.Type.F0008, await this.getPlayerInTurn().getNickname());
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
