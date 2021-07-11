
import { ClientErrorCode }              from "../../../utility/ClientErrorCode";
import { BwWar }                        from "../../baseWar/model/BwWar";
import { BwCommonSettingManager }       from "../../baseWar/model/BwCommonSettingManager";
import { BwWarEventManager }            from "../../baseWar/model/BwWarEventManager";
import { TwPlayerManager }              from "./TwPlayerManager";
import { TwField }                      from "./TwField";
import * as CommonConstants             from "../../../utility/CommonConstants";
import * as ConfigManager               from "../../../utility/ConfigManager";
import * as Logger                      from "../../../utility/Logger";
import * as ProtoTypes                  from "../../../utility/ProtoTypes";
import * as Types                       from "../../../utility/Types";
import * as BwWarRuleHelper             from "../../baseWar/model/BwWarRuleHelper";
import * as TimeModel                   from "../../time/model/TimeModel";
import * as WarEventHelper              from "../../warEvent/model/WarEventHelper";
import WarSerialization                 = ProtoTypes.WarSerialization;
import ISerialWar                       = WarSerialization.ISerialWar;
import IMapRawData                      = ProtoTypes.Map.IMapRawData;

export class TwWar extends BwWar {
    private readonly _playerManager         = new TwPlayerManager();
    private readonly _field                 = new TwField();
    private readonly _commonSettingManager  = new BwCommonSettingManager();
    private readonly _warEventManager       = new BwWarEventManager();

    public getCanCheat(): boolean {
        return false;
    }
    public getPlayerManager(): TwPlayerManager {
        return this._playerManager;
    }
    public getField(): TwField {
        return this._field;
    }
    public getCommonSettingManager(): BwCommonSettingManager {
        return this._commonSettingManager;
    }
    public getWarEventManager(): BwWarEventManager {
        return this._warEventManager;
    }

    public getIsRunTurnPhaseWithExtraData(): boolean {
        return false;
    }
    public updateTilesAndUnitsOnVisibilityChanged(): void {
        // nothing to do.
    }

    public async getDescForExePlayerDeleteUnit(): Promise<string | undefined> {
        return undefined;
    }
    public async getDescForExePlayerEndTurn(): Promise<string | undefined> {
        return undefined;
    }
    public async getDescForExePlayerProduceUnit(): Promise<string | undefined> {
        return undefined;
    }
    public async getDescForExePlayerSurrender(): Promise<string | undefined> {
        return undefined;
    }
    public async getDescForExePlayerVoteForDraw(): Promise<string | undefined> {
        return undefined;
    }
    public async getDescForExeSystemBeginTurn(): Promise<string | undefined> {
        return undefined;
    }
    public async getDescForExeSystemCallWarEvent(): Promise<string | undefined> {
        return undefined;
    }
    public async getDescForExeSystemDestroyPlayerForce(): Promise<string | undefined> {
        return undefined;
    }
    public async getDescForExeSystemEndWar(): Promise<string | undefined> {
        return undefined;
    }
    public async getDescForExeSystemEndTurn(): Promise<string | undefined> {
        return undefined;
    }
    public async getDescForExeSystemHandleBootPlayer(): Promise<string | undefined> {
        return undefined;
    }
    public async getDescForExeUnitAttackTile(): Promise<string | undefined> {
        return undefined;
    }
    public async getDescForExeUnitAttackUnit(): Promise<string | undefined> {
        return undefined;
    }
    public async getDescForExeUnitBeLoaded(): Promise<string | undefined> {
        return undefined;
    }
    public async getDescForExeUnitBuildTile(): Promise<string | undefined> {
        return undefined;
    }
    public async getDescForExeUnitCaptureTile(): Promise<string | undefined> {
        return undefined;
    }
    public async getDescForExeUnitDive(): Promise<string | undefined> {
        return undefined;
    }
    public async getDescForExeUnitDropUnit(): Promise<string | undefined> {
        return undefined;
    }
    public async getDescForExeUnitJoinUnit(): Promise<string | undefined> {
        return undefined;
    }
    public async getDescForExeUnitLaunchFlare(): Promise<string | undefined> {
        return undefined;
    }
    public async getDescForExeUnitLaunchSilo(): Promise<string | undefined> {
        return undefined;
    }
    public async getDescForExeUnitLoadCo(): Promise<string | undefined> {
        return undefined;
    }
    public async getDescForExeUnitProduceUnit(): Promise<string | undefined> {
        return undefined;
    }
    public async getDescForExeUnitSupplyUnit(): Promise<string | undefined> {
        return undefined;
    }
    public async getDescForExeUnitSurface(): Promise<string | undefined> {
        return undefined;
    }
    public async getDescForExeUnitUseCoSkill(): Promise<string | undefined> {
        return undefined;
    }
    public async getDescForExeUnitWait(): Promise<string | undefined> {
        return undefined;
    }

    public async init(data: ISerialWar): Promise<ClientErrorCode> {
        const baseInitError = await this._baseInit(data);
        if (baseInitError) {
            return baseInitError;
        }

        return ClientErrorCode.NoError;
    }
    public async initByMapRawData(mapRawData: IMapRawData): Promise<ClientErrorCode> {
        const warData = await _createDataForCreateTwWar(mapRawData);
        if (warData == null) {
            return ClientErrorCode.TwWarInitByMapRawData00;
        }

        return await this.init(warData);
    }

    public getWarType(): Types.WarType {
        return Types.WarType.Test;
    }

    public getMapId(): number | null | undefined {
        return undefined;
    }

    public getIsNeedExecutedAction(): boolean {
        return false;
    }
    public getIsNeedSeedRandom(): boolean {
        return false;
    }

    public getIsWarMenuPanelOpening(): boolean {
        return false;
    }

    public getSettingsBootTimerParams(): number[] | null | undefined {
        return [Types.BootTimerType.NoBoot];
    }
}

async function _createDataForCreateTwWar(mapRawData: IMapRawData): Promise<ISerialWar | undefined> {
    const dataForPlayerManager = await _createInitialPlayerManagerDataForTw(mapRawData);
    if (!dataForPlayerManager) {
        Logger.error(`TwWar._createDataForCreateTwWar() failed _createInitialPlayerManagerDataForTw().`);
        return undefined;
    }

    const fieldData = await _createInitialFieldData(mapRawData);
    if (fieldData == null) {
        Logger.error(`TwWar._createDataForCreateTwWar() empty fieldData.`);
        return undefined;
    }

    const warRule = (mapRawData.warRuleArray || [])[0];
    if (warRule == null) {
        Logger.error(`TwWar._createDataForCreateTwWar() empty warRule.`);
        return undefined;
    }

    const seedRandomState = new Math.seedrandom("" + Math.random(), { state: true }).state();
    return {
        settingsForCommon       : {
            configVersion       : ConfigManager.getLatestFormalVersion(),
            warRule,
            presetWarRuleId     : warRule.ruleId,
        },

        warId                   : -1,
        executedActions         : [],
        remainingVotesForDraw   : undefined,
        playerManager           : dataForPlayerManager,
        turnManager             : _createInitialTurnData(),
        field                   : fieldData,
        seedRandomInitialState  : seedRandomState,
        seedRandomCurrentState  : seedRandomState,
        warEventManager         : {
            warEventFullData    : WarEventHelper.trimWarEventFullData(mapRawData.warEventFullData, warRule.warEventIdArray),
            calledCountList     : [],
        },
    };
}

function _createInitialTurnData(): WarSerialization.ISerialTurnManager {
    return {
        turnIndex       : CommonConstants.WarFirstTurnIndex,
        playerIndex     : 0,
        turnPhaseCode   : Types.TurnPhaseCode.WaitBeginTurn,
        enterTurnTime   : TimeModel.getServerTimestamp(),
    };
}

async function _createInitialPlayerManagerDataForTw(mapRawData: IMapRawData): Promise<WarSerialization.ISerialPlayerManager | undefined> {
    const configVersion = ConfigManager.getLatestFormalVersion();
    if (configVersion == null) {
        Logger.error(`TwWar._createInitialPlayerManagerDataForTw() empty configVersion.`);
        return undefined;
    }

    const playersCountUnneutral = mapRawData.playersCountUnneutral;
    if ((playersCountUnneutral == null) || (playersCountUnneutral < 2)) {
        Logger.error(`TwWar._createInitialPlayerManagerDataForTw() invalid playersCount!`);
        return undefined;
    }

    const bootTimerParams   = [Types.BootTimerType.Regular, CommonConstants.WarBootTimerRegularDefaultValue];
    const restTimeToBoot    = bootTimerParams ? bootTimerParams[1] : undefined;
    if (restTimeToBoot == null) {
        Logger.error(`TwWar._createInitialPlayerManagerDataForTw() empty restTimeToBoot.`);
        return undefined;
    }

    const players = [_createInitialSinglePlayerData({
        playerIndex         : 0,
        teamIndex           : 0,
        userId              : null,
        coId                : CommonConstants.CoEmptyId,
        restTimeToBoot      : 0,
        unitAndTileSkinId   : 0,
    })];

    const warRule = (mapRawData.warRuleArray || [])[0];
    if (warRule == null) {
        Logger.error(`TwWar._createInitialPlayerManagerDataForTw() empty warRule.`);
        return undefined;
    }

    const ruleForPlayers = warRule.ruleForPlayers;
    if (ruleForPlayers == null) {
        Logger.error(`TwWar._createInitialPlayerManagerDataForTw() empty ruleForPlayers.`);
        return undefined;
    }

    const ruleAvailability = warRule.ruleAvailability;
    if (ruleAvailability == null) {
        Logger.error(`TwWar._createInitialPlayerManagerDataForTw() empty ruleAvailability.`);
        return undefined;
    }

    if ((BwWarRuleHelper.getErrorCodeForRuleForPlayers({ ruleForPlayers, configVersion, playersCountUnneutral, ruleAvailability })) ||
        ((ruleForPlayers.playerRuleDataArray || []).length !== playersCountUnneutral)
    ) {
        Logger.error(`TwWar._createInitialPlayerManagerDataForTw() invalid ruleForPlayers! ${JSON.stringify(bootTimerParams)}`);
        return undefined;
    }

    for (let playerIndex = CommonConstants.WarFirstPlayerIndex; playerIndex <= playersCountUnneutral; ++playerIndex) {
        const teamIndex = BwWarRuleHelper.getTeamIndexByRuleForPlayers(ruleForPlayers, playerIndex);
        if (teamIndex == null) {
            Logger.error(`TwWar._createInitialPlayerManagerDataForTw() invalid teamIndex!`);
            return undefined;
        }

        players.push(_createInitialSinglePlayerData({
            playerIndex,
            teamIndex,
            userId              : 1,
            coId                : CommonConstants.CoEmptyId,
            restTimeToBoot,
            unitAndTileSkinId   : playerIndex,
        }));
    }

    return { players };
}

async function _createInitialFieldData(mapRawData: IMapRawData): Promise<WarSerialization.ISerialField | undefined> {
    const tiles = mapRawData.tileDataArray;
    if (tiles == null) {
        Logger.error(`TwWar._createInitialFieldData() empty tiles.`);
        return undefined;
    }

    const units = mapRawData.unitDataArray || [];
    return {
        tileMap     : {
            tiles,
        },
        unitMap : {
            units,
            nextUnitId  : units.length,
        },
        fogMap  : {
            forceFogCode: Types.ForceFogCode.None,
        },
    };
}

type DataForCreateSinglePlayerData = {
    playerIndex         : number;
    teamIndex           : number;
    userId              : number | null | undefined;
    coId                : number | null | undefined;
    restTimeToBoot      : number;
    unitAndTileSkinId   : number;
};
function _createInitialSinglePlayerData(data: DataForCreateSinglePlayerData): WarSerialization.ISerialPlayer {
    return {
        fund                        : 0,
        hasVotedForDraw             : false,
        aliveState                  : Types.PlayerAliveState.Alive,
        playerIndex                 : data.playerIndex,
        restTimeToBoot              : data.restTimeToBoot,
        userId                      : data.userId,
        unitAndTileSkinId           : data.unitAndTileSkinId,
        coId                        : data.coId,
        coCurrentEnergy             : null,
        coUsingSkillType            : Types.CoSkillType.Passive,
        coIsDestroyedInTurn         : false,
        watchOngoingSrcUserIdArray  : null,
        watchRequestSrcUserIdArray  : null,
    };
}
