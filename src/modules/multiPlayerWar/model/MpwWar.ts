
import TwnsBwCommonSettingManager   from "../../baseWar/model/BwCommonSettingManager";
import TwnsBwPlayer                 from "../../baseWar/model/BwPlayer";
import TwnsBwWar                    from "../../baseWar/model/BwWar";
import TwnsBwWarEventManager        from "../../baseWar/model/BwWarEventManager";
import CommonConstants              from "../../tools/helpers/CommonConstants";
import CompatibilityHelpers         from "../../tools/helpers/CompatibilityHelpers";
import Helpers                      from "../../tools/helpers/Helpers";
import Timer                        from "../../tools/helpers/Timer";
import Lang                         from "../../tools/lang/Lang";
import TwnsLangTextType             from "../../tools/lang/LangTextType";
import ProtoTypes                   from "../../tools/proto/ProtoTypes";
import WarDestructionHelpers        from "../../tools/warHelpers/WarDestructionHelpers";
import WarVisibilityHelpers         from "../../tools/warHelpers/WarVisibilityHelpers";
import TwnsMpwWarMenuPanel          from "../view/MpwWarMenuPanel";
import TwnsMpwField                 from "./MpwField";
import TwnsMpwPlayerManager         from "./MpwPlayerManager";
import MpwUtility                   from "./MpwUtility";

namespace TwnsMpwWar {
    import BwWarEventManager        = TwnsBwWarEventManager.BwWarEventManager;
    import MpwPlayerManager         = TwnsMpwPlayerManager.MpwPlayerManager;
    import MpwField                 = TwnsMpwField.MpwField;
    import MpwWarMenuPanel          = TwnsMpwWarMenuPanel.MpwWarMenuPanel;
    import LangTextType             = TwnsLangTextType.LangTextType;
    import WarAction                = ProtoTypes.WarAction;
    import BwCommonSettingManager   = TwnsBwCommonSettingManager.BwCommonSettingManager;
    import BwWar                    = TwnsBwWar.BwWar;

    export abstract class MpwWar extends BwWar {
        private readonly _playerManager         = new MpwPlayerManager();
        private readonly _field                 = new MpwField();
        private readonly _commonSettingManager  = new BwCommonSettingManager();
        private readonly _warEventManager       = new BwWarEventManager();

        public getField(): MpwField {
            return this._field;
        }
        public getPlayerManager(): MpwPlayerManager {
            return this._playerManager;
        }
        public getCommonSettingManager(): BwCommonSettingManager {
            return this._commonSettingManager;
        }
        public getIsWarMenuPanelOpening(): boolean {
            return MpwWarMenuPanel.getIsOpening();
        }
        public getWarEventManager(): BwWarEventManager {
            return this._warEventManager;
        }

        public updateTilesAndUnitsOnVisibilityChanged(): void {
            const watcherTeamIndexes    = this.getPlayerManager().getAliveWatcherTeamIndexesForSelf();
            const visibleUnitsOnMap     = WarVisibilityHelpers.getAllUnitsOnMapVisibleToTeams(this, watcherTeamIndexes);
            for (const unit of this.getUnitMap().getAllUnitsOnMap()) {
                if (visibleUnitsOnMap.has(unit)) {
                    unit.setViewVisible(true);
                } else {
                    WarDestructionHelpers.removeUnitOnMap(this, unit.getGridIndex());
                }
            }
            WarDestructionHelpers.removeInvisibleLoadedUnits(this, watcherTeamIndexes);

            const visibleTiles  = WarVisibilityHelpers.getAllTilesVisibleToTeams(this, watcherTeamIndexes);
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

        public async getDescForExePlayerDeleteUnit(action: WarAction.IWarActionPlayerDeleteUnit): Promise<string | null> {
            return null;
        }
        public async getDescForExePlayerEndTurn(action: WarAction.IWarActionPlayerEndTurn): Promise<string | null> {
            return Lang.getFormattedText(LangTextType.F0030, await this.getPlayerInTurn().getNickname().catch(err => { CompatibilityHelpers.showError(err); throw err; }), this.getPlayerIndexInTurn());
        }
        public async getDescForExePlayerProduceUnit(action: WarAction.IWarActionPlayerProduceUnit): Promise<string | null> {
            return null;
        }
        public async getDescForExePlayerSurrender(action: WarAction.IWarActionPlayerSurrender): Promise<string | null> {
            return Lang.getFormattedText(action.deprecatedIsBoot ? LangTextType.F0028 : LangTextType.F0008, await this.getPlayerInTurn().getNickname().catch(err => { CompatibilityHelpers.showError(err); throw err; }));
        }
        public async getDescForExePlayerVoteForDraw(action: WarAction.IWarActionPlayerVoteForDraw): Promise<string | null> {
            const nickname      = await this.getPlayerInTurn().getNickname().catch(err => { CompatibilityHelpers.showError(err); throw err; });
            const playerIndex   = this.getPlayerIndexInTurn();
            if (!action.isAgree) {
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
            if (playerIndex === CommonConstants.WarNeutralPlayerIndex) {
                return Lang.getFormattedText(LangTextType.F0022, Lang.getText(LangTextType.B0111), playerIndex);
            } else {
                return Lang.getFormattedText(LangTextType.F0022, await this.getPlayerInTurn().getNickname().catch(err => { CompatibilityHelpers.showError(err); throw err; }), playerIndex);
            }
        }
        public async getDescForExeSystemCallWarEvent(action: WarAction.IWarActionSystemCallWarEvent): Promise<string | null> {
            return `${Lang.getText(LangTextType.B0451)}`;
        }
        public async getDescForExeSystemDestroyPlayerForce(action: WarAction.IWarActionSystemDestroyPlayerForce): Promise<string | null> {
            const playerIndex = Helpers.getExisted(action.targetPlayerIndex);
            return `p${playerIndex} ${await this.getPlayer(playerIndex).getNickname().catch(err => { CompatibilityHelpers.showError(err); throw err; })} ${Lang.getText(LangTextType.B0450)}`;
        }
        public async getDescForExeSystemEndWar(action: WarAction.IWarActionSystemEndWar): Promise<string | null> {
            return `${Lang.getText(LangTextType.B0087)}`;
        }
        public async getDescForExeSystemEndTurn(action: WarAction.IWarActionSystemEndTurn): Promise<string | null> {
            return Lang.getFormattedText(LangTextType.F0030, await this.getPlayerInTurn().getNickname().catch(err => { CompatibilityHelpers.showError(err); throw err; }), this.getPlayerIndexInTurn());
        }
        public async getDescForExeSystemHandleBootPlayer(action: WarAction.IWarActionSystemHandleBootPlayer): Promise<string | null> {
            return Lang.getFormattedText(LangTextType.F0028, await this.getPlayerInTurn().getNickname().catch(err => { CompatibilityHelpers.showError(err); throw err; }));
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
        public getBootRestTime(): number | null {
            const player = this.getPlayerInTurn();
            if (player.getPlayerIndex() === 0) {
                return null;
            } else {
                return (this.getEnterTurnTime() + player.getRestTimeToBoot() - Timer.getServerTimestamp()) || null;
            }
        }

        public getIsRunTurnPhaseWithExtraData(): boolean {
            return true;
        }

        public getPlayerIndexLoggedIn(): number | null {
            return this.getPlayerManager().getPlayerIndexLoggedIn();
        }
        public getPlayerLoggedIn(): TwnsBwPlayer.BwPlayer | null {
            return this.getPlayerManager().getPlayerLoggedIn();
        }
    }
}

export default TwnsMpwWar;
