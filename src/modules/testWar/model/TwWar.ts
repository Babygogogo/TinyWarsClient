
// import TwnsBwCommonSettingManager   from "../../baseWar/model/BwCommonSettingManager";
// import TwnsBwWar                    from "../../baseWar/model/BwWar";
// import TwnsBwWarEventManager        from "../../baseWar/model/BwWarEventManager";
// import TwnsClientErrorCode          from "../../tools/helpers/ClientErrorCode";
// import CommonConstants              from "../../tools/helpers/CommonConstants";
// import ConfigManager                from "../../tools/helpers/ConfigManager";
// import Helpers                      from "../../tools/helpers/Helpers";
// import Timer                        from "../../tools/helpers/Timer";
// import Types                        from "../../tools/helpers/Types";
// import ProtoTypes                   from "../../tools/proto/ProtoTypes";
// import WarRuleHelpers               from "../../tools/warHelpers/WarRuleHelpers";
// import WarEventHelper               from "../../warEvent/model/WarEventHelper";
// import TwnsTwField                  from "./TwField";
// import TwnsTwPlayerManager          from "./TwPlayerManager";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.TestWar {
    import BwWarEventManager    = BaseWar.BwWarEventManager;
    import TwPlayerManager      = TestWar.TwPlayerManager;
    import TwField              = TestWar.TwField;
    import WarSerialization     = CommonProto.WarSerialization;
    import ISerialWar           = WarSerialization.ISerialWar;
    import IMapRawData          = CommonProto.Map.IMapRawData;
    import BwWar                = BaseWar.BwWar;
    import GameConfig           = Config.GameConfig;

    export class TwWar extends BwWar {
        private readonly _playerManager         = new TwPlayerManager();
        private readonly _field                 = new TwField();
        private readonly _commonSettingManager  = new BaseWar.BwCommonSettingManager();
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
        public getCommonSettingManager(): BaseWar.BwCommonSettingManager {
            return this._commonSettingManager;
        }
        public getWarEventManager(): BwWarEventManager {
            return this._warEventManager;
        }

        public getIsExecuteActionsWithExtraData(): boolean {
            return false;
        }
        public updateTilesAndUnitsOnVisibilityChanged(): void {
            // nothing to do.
        }

        public async getDescForExePlayerDeleteUnit(): Promise<string | null> {
            return null;
        }
        public async getDescForExePlayerEndTurn(): Promise<string | null> {
            return null;
        }
        public async getDescForExePlayerProduceUnit(): Promise<string | null> {
            return null;
        }
        public async getDescForExePlayerSurrender(): Promise<string | null> {
            return null;
        }
        public async getDescForExePlayerVoteForDraw(): Promise<string | null> {
            return null;
        }
        public async getDescForExeSystemBeginTurn(): Promise<string | null> {
            return null;
        }
        public async getDescForExeSystemCallWarEvent(): Promise<string | null> {
            return null;
        }
        public async getDescForExeSystemDestroyPlayerForce(): Promise<string | null> {
            return null;
        }
        public async getDescForExeSystemEndWar(): Promise<string | null> {
            return null;
        }
        public async getDescForExeSystemEndTurn(): Promise<string | null> {
            return null;
        }
        public async getDescForExeSystemHandleBootPlayer(): Promise<string | null> {
            return null;
        }
        public async getDescForExeUnitAttackTile(): Promise<string | null> {
            return null;
        }
        public async getDescForExeUnitAttackUnit(): Promise<string | null> {
            return null;
        }
        public async getDescForExeUnitBeLoaded(): Promise<string | null> {
            return null;
        }
        public async getDescForExeUnitBuildTile(): Promise<string | null> {
            return null;
        }
        public async getDescForExeUnitCaptureTile(): Promise<string | null> {
            return null;
        }
        public async getDescForExeUnitDive(): Promise<string | null> {
            return null;
        }
        public async getDescForExeUnitDropUnit(): Promise<string | null> {
            return null;
        }
        public async getDescForExeUnitJoinUnit(): Promise<string | null> {
            return null;
        }
        public async getDescForExeUnitLaunchFlare(): Promise<string | null> {
            return null;
        }
        public async getDescForExeUnitLaunchSilo(): Promise<string | null> {
            return null;
        }
        public async getDescForExeUnitLoadCo(): Promise<string | null> {
            return null;
        }
        public async getDescForExeUnitProduceUnit(): Promise<string | null> {
            return null;
        }
        public async getDescForExeUnitSupplyUnit(): Promise<string | null> {
            return null;
        }
        public async getDescForExeUnitSurface(): Promise<string | null> {
            return null;
        }
        public async getDescForExeUnitUseCoSkill(): Promise<string | null> {
            return null;
        }
        public async getDescForExeUnitWait(): Promise<string | null> {
            return null;
        }

        public init(data: ISerialWar, gameConfig: GameConfig, warType = WarHelpers.WarCommonHelpers.getWarType(data)): void {
            this._baseInit(data, gameConfig, warType);
        }
        public async initByMapRawData(mapRawData: IMapRawData, gameConfig: GameConfig): Promise<void> {
            this.init(await _createDataForCreateTwWar(mapRawData, gameConfig), gameConfig);
        }

        public getErrorCodeForInitForSfw(data: ISerialWar, gameConfig: GameConfig): ClientErrorCode {
            try {
                this.init(data, gameConfig, data.settingsForCommon?.instanceWarRule?.ruleForGlobalParams?.hasFogByDefault ? Types.WarType.SfwFog : Types.WarType.SfwStd);
            } catch(e) {
                const error = e as Types.CustomError;
                return error?.errorCode ?? ClientErrorCode.TwWar_GetErrorCodeForInitForSfw_00;
            }

            return ClientErrorCode.NoError;
        }
        public getErrorCodeForInitForMfw(data: ISerialWar, gameConfig: GameConfig): ClientErrorCode {
            try {
                this.init(data, gameConfig, data.settingsForCommon?.instanceWarRule?.ruleForGlobalParams?.hasFogByDefault ? Types.WarType.MfwFog : Types.WarType.MfwStd);
            } catch(e) {
                const error = e as Types.CustomError;
                return error?.errorCode ?? ClientErrorCode.TwWar_GetErrorCodeForInitForMfw_00;
            }

            return ClientErrorCode.NoError;
        }
        public async getErrorCodeForInitByMapRawData(mapRawData: IMapRawData, gameConfig: GameConfig): Promise<ClientErrorCode> {
            return await this.initByMapRawData(mapRawData, gameConfig).catch(e => {
                const error = e as Types.CustomError;
                return error?.errorCode ?? ClientErrorCode.TwWar_GetErrorCodeForInitByMapRawData_00;
            }) || ClientErrorCode.NoError;
        }

        public getMapId(): number | null {
            return null;
        }

        public getIsNeedExecutedAction(): boolean {
            return false;
        }
        public getIsNeedSeedRandom(): boolean {
            return false;
        }

        public getBootRestTime(): number | null {
            return null;
        }
        public getSettingsBootTimerParams(): number[] {
            return [Types.BootTimerType.NoBoot];
        }
    }

    async function _createDataForCreateTwWar(mapRawData: IMapRawData, gameConfig: GameConfig): Promise<ISerialWar> {
        const dataForPlayerManager  = await _createInitialPlayerManagerDataForTw(mapRawData, gameConfig);
        const fieldData             = await _createInitialFieldData(mapRawData);
        const instanceWarRule       = WarHelpers.WarRuleHelpers.createInstanceWarRule((mapRawData.templateWarRuleArray || [])[0], mapRawData.warEventFullData);
        const seedRandomState       = new Math.seedrandom("" + Math.random(), { state: true }).state();
        return {
            settingsForCommon       : {
                configVersion       : await Config.ConfigManager.getLatestConfigVersion(),
                instanceWarRule,
            },
            settingsForMfw          : {},

            warId                   : -1,
            isEnded                 : false,
            remainingVotesForDraw   : null,
            playerManager           : dataForPlayerManager,
            turnManager             : _createInitialTurnData(),
            field                   : fieldData,
            seedRandomInitialState  : seedRandomState,
            seedRandomCurrentState  : seedRandomState,
            warEventManager         : {
                calledCountList     : [],
            },
            executedActionManager   : {
                executedActionArray         : [],
                executedActionsCount        : 0,
                halfwayReplayActionArray    : [],
            },
        };
    }

    function _createInitialTurnData(): WarSerialization.ISerialTurnManager {
        return {
            turnIndex       : CommonConstants.WarFirstTurnIndex,
            playerIndex     : 0,
            turnPhaseCode   : Types.TurnPhaseCode.WaitBeginTurn,
            enterTurnTime   : Timer.getServerTimestamp(),
        };
    }

    async function _createInitialPlayerManagerDataForTw(mapRawData: IMapRawData, gameConfig: GameConfig): Promise<WarSerialization.ISerialPlayerManager> {
        const playersCountUnneutral = mapRawData.playersCountUnneutral;
        if ((playersCountUnneutral == null) || (playersCountUnneutral < 2)) {
            throw Helpers.newError(`Invalid playersCountUnneutral: ${playersCountUnneutral}`, ClientErrorCode.TwWar_CreateInitialPlayerManagerDataForTw_00);
        }

        const bootTimerParams   = CommonConstants.WarBootTimer.DefaultParams.concat();
        const restTimeToBoot    = bootTimerParams[1];
        const players = [_createInitialSinglePlayerData({
            playerIndex         : 0,
            teamIndex           : 0,
            userId              : null,
            coId                : CommonConstants.CoId.Empty,
            restTimeToBoot      : 0,
            unitAndTileSkinId   : 0,
        })];

        const templateWarRule   = (mapRawData.templateWarRuleArray || [])[0];
        const ruleForPlayers    = Helpers.getExisted(templateWarRule.ruleForPlayers);
        const ruleAvailability  = Helpers.getExisted(templateWarRule.ruleAvailability);
        if ((WarHelpers.WarRuleHelpers.getErrorCodeForRuleForPlayers({ ruleForPlayers, gameConfig, playersCountUnneutral, ruleAvailability })) ||
            ((ruleForPlayers.playerRuleDataArray || []).length !== playersCountUnneutral)
        ) {
            throw Helpers.newError(`Invalid ruleForPlayers.`, ClientErrorCode.TwWar_CreateInitialPlayerManagerDataForTw_01);
        }

        for (let playerIndex = CommonConstants.PlayerIndex.First; playerIndex <= playersCountUnneutral; ++playerIndex) {
            const teamIndex = WarHelpers.WarRuleHelpers.getTeamIndexByRuleForPlayers(ruleForPlayers, playerIndex);
            players.push(_createInitialSinglePlayerData({
                playerIndex,
                teamIndex,
                userId              : 1,
                coId                : CommonConstants.CoId.Empty,
                restTimeToBoot,
                unitAndTileSkinId   : playerIndex,
            }));
        }

        return { players };
    }

    async function _createInitialFieldData(mapRawData: IMapRawData): Promise<WarSerialization.ISerialField> {
        const tiles = Helpers.getExisted(mapRawData.tileDataArray);
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
        userId              : number | null;
        coId                : number | null;
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
            coPowerActivatedCount       : null,
            coIsDestroyedInTurn         : false,
            watchOngoingSrcUserIdArray  : null,
            watchRequestSrcUserIdArray  : null,
            markedGridIdArray           : null,
        };
    }
}

// export default TwnsTwWar;
