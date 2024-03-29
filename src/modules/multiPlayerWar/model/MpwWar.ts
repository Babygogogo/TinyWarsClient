
// import TwnsBwCommonSettingManager   from "../../baseWar/model/BwCommonSettingManager";
// import TwnsBwPlayer                 from "../../baseWar/model/BwPlayer";
// import TwnsBwWar                    from "../../baseWar/model/BwWar";
// import TwnsBwWarEventManager        from "../../baseWar/model/BwWarEventManager";
// import CommonConstants              from "../../tools/helpers/CommonConstants";
// import Helpers                      from "../../tools/helpers/Helpers";
// import Timer                        from "../../tools/helpers/Timer";
// import Lang                         from "../../tools/lang/Lang";
// import TwnsLangTextType             from "../../tools/lang/LangTextType";
// import ProtoTypes                   from "../../tools/proto/ProtoTypes";
// import WarDestructionHelpers        from "../../tools/warHelpers/WarDestructionHelpers";
// import WarVisibilityHelpers         from "../../tools/warHelpers/WarVisibilityHelpers";
// import TwnsMpwWarMenuPanel          from "../view/MpwWarMenuPanel";
// import TwnsMpwField                 from "./MpwField";
// import TwnsMpwPlayerManager         from "./MpwPlayerManager";
// import MpwUtility                   from "./MpwUtility";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.MultiPlayerWar {
    import LangTextType             = Lang.LangTextType;
    import WarAction                = CommonProto.WarAction;

    export abstract class MpwWar extends BaseWar.BwWar {
        private readonly _playerManager         = new MultiPlayerWar.MpwPlayerManager();
        private readonly _field                 = new MultiPlayerWar.MpwField();
        private readonly _commonSettingManager  = new BaseWar.BwCommonSettingManager();
        private readonly _warEventManager       = new BaseWar.BwWarEventManager();

        private _visionTeamIndex    : number | null = null;

        public getField(): MultiPlayerWar.MpwField {
            return this._field;
        }
        public getPlayerManager(): MultiPlayerWar.MpwPlayerManager {
            return this._playerManager;
        }
        public getCommonSettingManager(): BaseWar.BwCommonSettingManager {
            return this._commonSettingManager;
        }
        public getWarEventManager(): BaseWar.BwWarEventManager {
            return this._warEventManager;
        }

        public updateTilesAndUnitsOnVisibilityChanged(isFastExecute: boolean): void {
            const watcherTeamIndexes    = this.getPlayerManager().getWatcherTeamIndexesForSelf();
            const visibleUnitsOnMap     = WarHelpers.WarVisibilityHelpers.getAllUnitsOnMapVisibleToTeams(this, watcherTeamIndexes);
            for (const unit of this.getUnitMap().getAllUnitsOnMap()) {
                if (visibleUnitsOnMap.has(unit)) {
                    if (!isFastExecute) {
                        unit.setViewVisible(true);
                    }
                } else {
                    WarHelpers.WarDestructionHelpers.removeUnitOnMap(this, unit.getGridIndex());
                }
            }
            WarHelpers.WarDestructionHelpers.removeInvisibleLoadedUnits(this, watcherTeamIndexes);

            const visibleTiles  = WarHelpers.WarVisibilityHelpers.getAllTilesVisibleToTeams(this, watcherTeamIndexes);
            const tileMap       = this.getTileMap();
            for (const tile of tileMap.getAllTiles()) {
                if (visibleTiles.has(tile)) {
                    tile.setHasFog(false);
                } else {
                    if (!tile.getHasFog()) {
                        WarHelpers.WarCommonHelpers.resetTileDataAsHasFog(tile);
                    }
                }

                if (!isFastExecute) {
                    tile.flushDataToView();
                }
            }

            if (!isFastExecute) {
                tileMap.getView().updateCoZone();
            }

            this._handleVisionTeamIndex(watcherTeamIndexes, isFastExecute);
        }
        private _handleVisionTeamIndex(watcherTeamIndexes: Set<number>, isFastExecute: boolean): void {
            const visionTeamIndex = this.getVisionTeamIndex();
            if (visionTeamIndex == null) {
                return;
            }
            if ((watcherTeamIndexes.size === 1) && (watcherTeamIndexes.values().next().value === visionTeamIndex)) {
                return;
            }

            const visibleTiles = WarHelpers.WarVisibilityHelpers.getAllTilesVisibleToTeams(this, new Set([visionTeamIndex]));
            for (const tile of this.getTileMap().getAllTiles()) {
                tile.setHasFog(!visibleTiles.has(tile));

                if (!isFastExecute) {
                    tile.flushDataToView();
                }
            }
        }

        public async getDescForExePlayerDeleteUnit(action: WarAction.IWarActionPlayerDeleteUnit): Promise<string | null> {
            return null;
        }
        public async getDescForExePlayerEndTurn(action: WarAction.IWarActionPlayerEndTurn): Promise<string | null> {
            return Lang.getFormattedText(LangTextType.F0030, await this.getPlayerInTurn().getNickname(), this.getPlayerIndexInTurn());
        }
        public async getDescForExePlayerProduceUnit(action: WarAction.IWarActionPlayerProduceUnit, gameConfig: Config.GameConfig): Promise<string | null> {
            return null;
        }
        public async getDescForExePlayerSurrender(action: WarAction.IWarActionPlayerSurrender): Promise<string | null> {
            return Lang.getFormattedText(action.deprecatedIsBoot ? LangTextType.F0028 : LangTextType.F0008, await this.getPlayerInTurn().getNickname());
        }
        public async getDescForExePlayerVoteForDraw(action: WarAction.IWarActionPlayerVoteForDraw): Promise<string | null> {
            const nickname      = await this.getPlayerInTurn().getNickname();
            const playerIndex   = this.getPlayerIndexInTurn();
            const isAgree       = action.extraData ? action.extraData.isAgree : action.isAgree;
            if (!isAgree) {
                return Lang.getFormattedText(LangTextType.F0017, playerIndex, nickname);
            } else {
                if (this.getDrawVoteManager().getRemainingVotes()) {
                    return Lang.getFormattedText(LangTextType.F0018, playerIndex, nickname);
                } else {
                    return Lang.getFormattedText(LangTextType.F0019, playerIndex, nickname);
                }
            }
        }
        public async getDescForExeSystemBeginTurn(action: WarAction.IWarActionSystemBeginTurn): Promise<string | null> {
            const playerIndex = this.getPlayerIndexInTurn();
            if (playerIndex === CommonConstants.PlayerIndex.Neutral) {
                return Lang.getFormattedText(LangTextType.F0022, Lang.getText(LangTextType.B0111), playerIndex);
            } else {
                return Lang.getFormattedText(LangTextType.F0022, await this.getPlayerInTurn().getNickname(), playerIndex);
            }
        }
        public async getDescForExeSystemCallWarEvent(action: WarAction.IWarActionSystemCallWarEvent): Promise<string | null> {
            return `${Lang.getText(LangTextType.B0451)}`;
        }
        public async getDescForExeSystemDestroyPlayerForce(action: WarAction.IWarActionSystemDestroyPlayerForce): Promise<string | null> {
            const playerIndex = Helpers.getExisted(action.extraData?.targetPlayerIndex);
            return `p${playerIndex} ${await this.getPlayer(playerIndex).getNickname()} ${Lang.getText(LangTextType.B0450)}`;
        }
        public async getDescForExeSystemEndWar(action: WarAction.IWarActionSystemEndWar): Promise<string | null> {
            return `${Lang.getText(LangTextType.B0087)}`;
        }
        public async getDescForExeSystemEndTurn(action: WarAction.IWarActionSystemEndTurn): Promise<string | null> {
            return Lang.getFormattedText(LangTextType.F0030, await this.getPlayerInTurn().getNickname(), this.getPlayerIndexInTurn());
        }
        public async getDescForExeSystemHandleBootPlayer(action: WarAction.IWarActionSystemHandleBootPlayer): Promise<string | null> {
            return Lang.getFormattedText(LangTextType.F0028, await this.getPlayerInTurn().getNickname());
        }
        public async getDescForExeUnitAttackTile(action: WarAction.IWarActionUnitAttackTile): Promise<string | null> {
            return null;
        }
        public async getDescForExeUnitAttackUnit(action: WarAction.IWarActionUnitAttackUnit): Promise<string | null> {
            return null;
        }
        public async getDescForExeUnitBeLoaded(action: WarAction.IWarActionUnitBeLoaded): Promise<string | null> {
            return null;
        }
        public async getDescForExeUnitBuildTile(action: WarAction.IWarActionUnitBuildTile): Promise<string | null> {
            return null;
        }
        public async getDescForExeUnitCaptureTile(action: WarAction.IWarActionUnitCaptureTile): Promise<string | null> {
            return null;
        }
        public async getDescForExeUnitDive(action: WarAction.IWarActionUnitDive): Promise<string | null> {
            return null;
        }
        public async getDescForExeUnitDropUnit(action: WarAction.IWarActionUnitDropUnit): Promise<string | null> {
            return null;
        }
        public async getDescForExeUnitJoinUnit(action: WarAction.IWarActionUnitJoinUnit): Promise<string | null> {
            return null;
        }
        public async getDescForExeUnitLaunchFlare(action: WarAction.IWarActionUnitLaunchFlare): Promise<string | null> {
            return null;
        }
        public async getDescForExeUnitLaunchSilo(action: WarAction.IWarActionUnitLaunchSilo): Promise<string | null> {
            return null;
        }
        public async getDescForExeUnitLoadCo(action: WarAction.IWarActionUnitLoadCo): Promise<string | null> {
            return null;
        }
        public async getDescForExeUnitProduceUnit(action: WarAction.IWarActionUnitProduceUnit): Promise<string | null> {
            return null;
        }
        public async getDescForExeUnitSupplyUnit(action: WarAction.IWarActionUnitSupplyUnit): Promise<string | null> {
            return null;
        }
        public async getDescForExeUnitSurface(action: WarAction.IWarActionUnitSurface): Promise<string | null> {
            return null;
        }
        public async getDescForExeUnitUseCoSkill(action: WarAction.IWarActionUnitUseCoSkill): Promise<string | null> {
            return null;
        }
        public async getDescForExeUnitWait(action: WarAction.IWarActionUnitWait): Promise<string | null> {
            return null;
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // The other functions.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        public getBootRestTime(playerIndex: number): number | null {
            if (playerIndex === CommonConstants.PlayerIndex.Neutral) {
                return null;
            } else {
                const restTime = this.getPlayer(playerIndex).getRestTimeToBoot();
                if (playerIndex === this.getPlayerIndexInTurn()) {
                    return (this.getEnterTurnTime() + restTime - Timer.getServerTimestamp()) || null;
                } else {
                    return restTime;
                }
            }
        }

        public getIsExecuteActionsWithExtraData(): boolean {
            return true;
        }

        public getPlayerIndexLoggedIn(): number | null {
            return this.getPlayerManager().getPlayerIndexLoggedIn();
        }
        public getPlayerLoggedIn(): BaseWar.BwPlayer | null {
            return this.getPlayerManager().getPlayerLoggedIn();
        }

        public getVisionTeamIndex(): number | null {
            return this._visionTeamIndex;
        }
        private _setVisionTeamIndex(index: number | null): void {
            this._visionTeamIndex = index;
        }
        public checkCanTickVisionTeamIndex(): boolean {
            return this.getPlayerManager().getWatcherTeamIndexesForSelf().size > 1;
        }
        public tickVisionTeamIndex(): number | null {
            const teamIndexArray = [...this.getPlayerManager().getWatcherTeamIndexesForSelf()].sort((v1, v2) => v1 - v2);
            Helpers.deleteElementFromArray(teamIndexArray, CommonConstants.TeamIndex.Neutral);

            const currentVisionTeamIndex    = this.getVisionTeamIndex();
            const newVisionTeamIndex        = currentVisionTeamIndex == null
                ? (teamIndexArray[0] ?? null)
                : (teamIndexArray.find(v => v > currentVisionTeamIndex) ?? null);
            this._setVisionTeamIndex(newVisionTeamIndex);

            return newVisionTeamIndex;
        }
    }
}

// export default TwnsMpwWar;
