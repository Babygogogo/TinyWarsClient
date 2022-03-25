
// import TwnsBwCommonSettingManager   from "../../baseWar/model/BwCommonSettingManager";
// import TwnsBwPlayer                 from "../../baseWar/model/BwPlayer";
// import TwnsBwWar                    from "../../baseWar/model/BwWar";
// import TwnsBwWarEventManager        from "../../baseWar/model/BwWarEventManager";
// import CommonConstants              from "../../tools/helpers/CommonConstants";
// import Helpers                      from "../../tools/helpers/Helpers";
// import Lang                         from "../../tools/lang/Lang";
// import TwnsLangTextType             from "../../tools/lang/LangTextType";
// import ProtoTypes                   from "../../tools/proto/ProtoTypes";
// import WarVisibilityHelpers         from "../../tools/warHelpers/WarVisibilityHelpers";
// import TwnsSpwField                 from "./SpwField";
// import TwnsSpwPlayerManager         from "./SpwPlayerManager";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace TwnsSpwWar {
    import LangTextType             = TwnsLangTextType.LangTextType;
    import WarAction                = ProtoTypes.WarAction;
    import ISpmWarSaveSlotExtraData = ProtoTypes.SinglePlayerMode.ISpmWarSaveSlotExtraData;
    import BwCommonSettingManager   = TwnsBwCommonSettingManager.BwCommonSettingManager;

    export abstract class SpwWar extends Twns.BaseWar.BwWar {
        private readonly _playerManager         = new TwnsSpwPlayerManager.SpwPlayerManager();
        private readonly _field                 = new TwnsSpwField.SpwField();
        private readonly _commonSettingManager  = new BwCommonSettingManager();
        private readonly _warEventManager       = new TwnsBwWarEventManager.BwWarEventManager();

        private _saveSlotIndex?     : number;
        private _saveSlotExtraData? : ISpmWarSaveSlotExtraData;

        public abstract serialize(): ProtoTypes.WarSerialization.ISerialWar;

        public updateTilesAndUnitsOnVisibilityChanged(isFastExecute: boolean): void {
            const teamIndexes   = this.getPlayerManager().getAliveWatcherTeamIndexesForSelf();
            const visibleUnits  = WarVisibilityHelpers.getAllUnitsOnMapVisibleToTeams(this, teamIndexes);
            for (const unit of this.getUnitMap().getAllUnitsOnMap()) {
                if (!isFastExecute) {
                    unit.setViewVisible(visibleUnits.has(unit));
                }
            }

            const visibleTiles  = WarVisibilityHelpers.getAllTilesVisibleToTeams(this, teamIndexes);
            const tileMap       = this.getTileMap();
            for (const tile of tileMap.getAllTiles()) {
                tile.setHasFog(!visibleTiles.has(tile));

                if (!isFastExecute) {
                    tile.flushDataToView();
                }
            }

            if (!isFastExecute) {
                tileMap.getView().updateCoZone();
            }
        }

        public async getDescForExePlayerDeleteUnit(action: WarAction.IWarActionPlayerDeleteUnit): Promise<string | null> {
            return null;
        }
        public async getDescForExePlayerEndTurn(action: WarAction.IWarActionPlayerEndTurn): Promise<string | null> {
            return Lang.getFormattedText(LangTextType.F0030, await this.getPlayerInTurn().getNickname(), this.getPlayerIndexInTurn());
        }
        public async getDescForExePlayerProduceUnit(action: WarAction.IWarActionPlayerProduceUnit): Promise<string | null> {
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
            if (playerIndex === CommonConstants.WarNeutralPlayerIndex) {
                return Lang.getFormattedText(LangTextType.F0022, Lang.getText(LangTextType.B0111), playerIndex);
            } else {
                return Lang.getFormattedText(LangTextType.F0022, await this.getPlayerInTurn().getNickname(), playerIndex);
            }
        }
        public async getDescForExeSystemCallWarEvent(action: WarAction.IWarActionSystemCallWarEvent): Promise<string | null> {
            return `${Lang.getText(LangTextType.B0451)}`;
        }
        public async getDescForExeSystemDestroyPlayerForce(action: WarAction.IWarActionSystemDestroyPlayerForce): Promise<string | null> {
            const playerIndex = Helpers.getExisted(action.targetPlayerIndex);
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

        public getPlayerManager(): TwnsSpwPlayerManager.SpwPlayerManager {
            return this._playerManager;
        }
        public getField(): TwnsSpwField.SpwField {
            return this._field;
        }
        public getCommonSettingManager(): BwCommonSettingManager {
            return this._commonSettingManager;
        }
        public getWarEventManager(): TwnsBwWarEventManager.BwWarEventManager {
            return this._warEventManager;
        }

        public getIsExecuteActionsWithExtraData(): boolean {
            return false;
        }

        public getBootRestTime(): number | null {
            return null;
        }

        public setSaveSlotIndex(slotIndex: number): void {
            this._saveSlotIndex = slotIndex;
        }
        public getSaveSlotIndex(): number {
            return Helpers.getExisted(this._saveSlotIndex);
        }

        public setSaveSlotExtraData(extraData: ISpmWarSaveSlotExtraData): void {
            this._saveSlotExtraData = extraData;
        }
        public getSaveSlotExtraData(): ISpmWarSaveSlotExtraData {
            return Helpers.getExisted(this._saveSlotExtraData);
        }

        public getHumanPlayerIndexes(): number[] {
            return (this.getPlayerManager() as TwnsSpwPlayerManager.SpwPlayerManager).getHumanPlayerIndexes();
        }
        public getHumanPlayers(): TwnsBwPlayer.BwPlayer[] {
            return (this.getPlayerManager() as TwnsSpwPlayerManager.SpwPlayerManager).getHumanPlayers();
        }
    }
}

// export default TwnsSpwWar;
