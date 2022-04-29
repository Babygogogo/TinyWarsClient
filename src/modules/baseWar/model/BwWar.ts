
// import TwnsClientErrorCode          from "../../tools/helpers/ClientErrorCode";
// import ConfigManager                from "../../tools/helpers/ConfigManager";
// import Helpers                      from "../../tools/helpers/Helpers";
// import Timer                        from "../../tools/helpers/Timer";
// import Types                        from "../../tools/helpers/Types";
// import ProtoTypes                   from "../../tools/proto/ProtoTypes";
// import WarCommonHelpers             from "../../tools/warHelpers/WarCommonHelpers";
// import WarEventHelper               from "../../warEvent/model/WarEventHelper";
// import TwnsBwWarView                from "../view/BwWarView";
// import TwnsBwActionPlanner          from "./BwActionPlanner";
// import TwnsBwCommonSettingManager   from "./BwCommonSettingManager";
// import TwnsBwCursor                 from "./BwCursor";
// import TwnsBwDrawVoteManager        from "./BwDrawVoteManager";
// import TwnsBwExecutedActionManager  from "./BwExecutedActionManager";
// import TwnsBwField                  from "./BwField";
// import TwnsBwFogMap                 from "./BwFogMap";
// import TwnsBwGridVisualEffect       from "./BwGridVisualEffect";
// import TwnsBwPlayer                 from "./BwPlayer";
// import TwnsBwPlayerManager          from "./BwPlayerManager";
// import TwnsBwRandomNumberManager    from "./BwRandomNumberManager";
// import TwnsBwTileMap                from "./BwTileMap";
// import TwnsBwTurnManager            from "./BwTurnManager";
// import TwnsBwUnitMap                from "./BwUnitMap";
// import TwnsBwWarEventManager        from "./BwWarEventManager";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.BaseWar {
    import WarAction                = CommonProto.WarAction;
    import ISerialWar               = CommonProto.WarSerialization.ISerialWar;
    import ClientErrorCode          = TwnsClientErrorCode.ClientErrorCode;
    import GameConfig               = Config.GameConfig;

    export abstract class BwWar {
        private readonly _weatherManager        = new TwnsBwWeatherManager.BwWeatherManager();
        private readonly _turnManager           = new BwTurnManager();
        private readonly _executedActionManager = new BaseWar.BwExecutedActionManager();
        private readonly _randomNumberManager   = new TwnsBwRandomNumberManager.BwRandomNumberManager();
        private readonly _drawVoteManager       = new TwnsBwDrawVoteManager.BwDrawVoteManager();
        private readonly _view                  = new BaseWar.BwWarView();

        private _gameConfig             : GameConfig | null = null;
        private _warId                  : number | null = null;
        private _isRunning              = false;
        private _isExecutingAction      = false;
        private _isEnded                = false;

        public abstract init(data: ISerialWar, gameConfig: GameConfig): void;
        public abstract getWarType(): Types.WarType;
        public abstract getMapId(): number | null;
        public abstract getIsNeedExecutedAction(): boolean;
        public abstract getIsNeedSeedRandom(): boolean;
        public abstract getCanCheat(): boolean;
        public abstract getPlayerManager(): BwPlayerManager;
        public abstract getField(): BwField;
        public abstract getCommonSettingManager(): BwCommonSettingManager;
        public abstract getWarEventManager(): BaseWar.BwWarEventManager;
        public abstract getBootRestTime(playerIndex: number): number | null;
        public abstract getSettingsBootTimerParams(): number[];
        public abstract getIsExecuteActionsWithExtraData(): boolean;
        public abstract updateTilesAndUnitsOnVisibilityChanged(isFastExecute: boolean): void;
        public abstract getDescForExePlayerDeleteUnit(action: WarAction.IWarActionPlayerDeleteUnit): Promise<string | null>;
        public abstract getDescForExePlayerEndTurn(action: WarAction.IWarActionPlayerEndTurn): Promise<string | null>;
        public abstract getDescForExePlayerProduceUnit(action: WarAction.IWarActionPlayerProduceUnit): Promise<string | null>;
        public abstract getDescForExePlayerSurrender(action: WarAction.IWarActionPlayerSurrender): Promise<string | null>;
        public abstract getDescForExePlayerVoteForDraw(action: WarAction.IWarActionPlayerVoteForDraw): Promise<string | null>;
        public abstract getDescForExeSystemBeginTurn(action: WarAction.IWarActionSystemBeginTurn): Promise<string | null>;
        public abstract getDescForExeSystemCallWarEvent(action: WarAction.IWarActionSystemCallWarEvent): Promise<string | null>;
        public abstract getDescForExeSystemDestroyPlayerForce(action: WarAction.IWarActionSystemDestroyPlayerForce): Promise<string | null>;
        public abstract getDescForExeSystemEndWar(action: WarAction.IWarActionSystemEndWar): Promise<string | null>;
        public abstract getDescForExeSystemEndTurn(action: WarAction.IWarActionSystemEndTurn): Promise<string | null>;
        public abstract getDescForExeSystemHandleBootPlayer(action: WarAction.IWarActionSystemHandleBootPlayer): Promise<string | null>;
        public abstract getDescForExeUnitAttackTile(action: WarAction.IWarActionUnitAttackTile): Promise<string | null>;
        public abstract getDescForExeUnitAttackUnit(action: WarAction.IWarActionUnitAttackUnit): Promise<string | null>;
        public abstract getDescForExeUnitBeLoaded(action: WarAction.IWarActionUnitBeLoaded): Promise<string | null>;
        public abstract getDescForExeUnitBuildTile(action: WarAction.IWarActionUnitBuildTile): Promise<string | null>;
        public abstract getDescForExeUnitCaptureTile(action: WarAction.IWarActionUnitCaptureTile): Promise<string | null>;
        public abstract getDescForExeUnitDive(action: WarAction.IWarActionUnitDive): Promise<string | null>;
        public abstract getDescForExeUnitDropUnit(action: WarAction.IWarActionUnitDropUnit): Promise<string | null>;
        public abstract getDescForExeUnitJoinUnit(action: WarAction.IWarActionUnitJoinUnit): Promise<string | null>;
        public abstract getDescForExeUnitLaunchFlare(action: WarAction.IWarActionUnitLaunchFlare): Promise<string | null>;
        public abstract getDescForExeUnitLaunchSilo(action: WarAction.IWarActionUnitLaunchSilo): Promise<string | null>;
        public abstract getDescForExeUnitLoadCo(action: WarAction.IWarActionUnitLoadCo): Promise<string | null>;
        public abstract getDescForExeUnitProduceUnit(action: WarAction.IWarActionUnitProduceUnit): Promise<string | null>;
        public abstract getDescForExeUnitSupplyUnit(action: WarAction.IWarActionUnitSupplyUnit): Promise<string | null>;
        public abstract getDescForExeUnitSurface(action: WarAction.IWarActionUnitSurface): Promise<string | null>;
        public abstract getDescForExeUnitUseCoSkill(action: WarAction.IWarActionUnitUseCoSkill): Promise<string | null>;
        public abstract getDescForExeUnitWait(action: WarAction.IWarActionUnitWait): Promise<string | null>;

        protected _baseInit(data: ISerialWar, gameConfig: GameConfig): void {
            const settingsForCommon = Helpers.getExisted(data.settingsForCommon, ClientErrorCode.BwWar_BaseInit_00);
            const configVersion     = Helpers.getExisted(settingsForCommon.configVersion, ClientErrorCode.BwWar_BaseInit_01);
            if (configVersion !== gameConfig.getVersion()) {
                throw Helpers.newError(`Invalid configVersion: ${configVersion}`, ClientErrorCode.BwWar_BaseInit_02);
            }

            this._setGameConfig(gameConfig);
            this.getWeatherManager().init(data.weatherManager);
            this.getDrawVoteManager().init(data.playerManager, data.remainingVotesForDraw);

            const dataForWarEventManager = data.warEventManager;
            this.getCommonSettingManager().init({
                settings                : settingsForCommon,
                allWarEventIdArray      : WarHelpers.WarEventHelpers.getAllWarEventIdArray(dataForWarEventManager?.warEventFullData),
                playersCountUnneutral   : WarHelpers.WarCommonHelpers.getPlayersCountUnneutral(data.playerManager),
                gameConfig,
            });

            this.getWarEventManager().init(dataForWarEventManager);
            this.getRandomNumberManager().init({
                isNeedSeedRandom: this.getIsNeedSeedRandom(),
                initialState    : data.seedRandomInitialState,
                currentState    : data.seedRandomCurrentState,
            });
            this.getExecutedActionManager().init({
                isNeedExecutedActions   : this.getIsNeedExecutedAction(),
                data                    : data.executedActionManager,
            });

            const playerManager = this.getPlayerManager();
            playerManager.init(data.playerManager, gameConfig);

            const playersCountUnneutral = playerManager.getTotalPlayersCount(false);
            this.getTurnManager().init(data.turnManager, playersCountUnneutral);
            this.getField().init({
                data                : data.field,
                gameConfig,
                playersCountUnneutral,
            });

            this._setWarId(data.warId ?? null);
            this.setIsEnded(!!data.isEnded);
        }

        protected _initView(): void {
            this.getView().init(this);
        }
        protected _fastInitView(): void {
            this.getView().fastInit(this);
        }
        public getView(): BaseWar.BwWarView {
            return this._view;
        }

        public serializeForCreateSfw(): ISerialWar {
            return {
                settingsForCommon           : this.getCommonSettingManager().serializeForCreateSfw(),
                settingsForMcw              : null,
                settingsForMrw              : null,
                settingsForMfw              : null,
                settingsForCcw              : null,
                settingsForScw              : null,
                settingsForSfw              : null,

                warId                       : this.getWarId(),
                isEnded                     : false,
                seedRandomInitialState      : null,
                seedRandomCurrentState      : null,
                executedActionManager       : null,
                remainingVotesForDraw       : this.getDrawVoteManager().getRemainingVotes(),
                weatherManager              : this.getWeatherManager().serializeForCreateSfw(),
                warEventManager             : this.getWarEventManager().serializeForCreateSfw(),
                playerManager               : this.getPlayerManager().serializeForCreateSfw(),
                turnManager                 : this.getTurnManager().serializeForCreateSfw(),
                field                       : this.getField().serializeForCreateSfw(),
            };
        }
        public serializeForCreateMfr(): ISerialWar {
            return {
                settingsForCommon           : this.getCommonSettingManager().serializeForCreateMfr(),
                settingsForMcw              : null,
                settingsForMrw              : null,
                settingsForMfw              : null,
                settingsForCcw              : null,
                settingsForScw              : null,
                settingsForSfw              : null,

                warId                       : this.getWarId(),
                isEnded                     : false,
                seedRandomInitialState      : null,
                seedRandomCurrentState      : null,
                executedActionManager       : null,
                remainingVotesForDraw       : this.getDrawVoteManager().getRemainingVotes(),
                weatherManager              : this.getWeatherManager().serializeForCreateMfr(),
                warEventManager             : this.getWarEventManager().serializeForCreateMfr(),
                playerManager               : this.getPlayerManager().serializeForCreateMfr(),
                turnManager                 : this.getTurnManager().serializeForCreateMfr(),
                field                       : this.getField().serializeForCreateMfr(),
            };
        }

        public startRunning(): BwWar {
            this.getCommonSettingManager().startRunning(this);
            this.getWeatherManager().startRunning(this);
            this.getWarEventManager().startRunning(this);
            this.getDrawVoteManager().startRunning(this);
            this.getTurnManager().startRunning(this);
            this.getPlayerManager().startRunning(this);
            this.getField().startRunning(this);

            this._setIsRunning(true);

            return this;
        }
        public startRunningView(): BwWar {
            this.getView().startRunningView();
            this.getField().startRunningView();
            this.getWeatherManager().startRunningView();

            return this;
        }
        public stopRunning(): BwWar {
            this.getField().stopRunning();
            this.getView().stopRunning();
            this.getWeatherManager().stopRunning();

            this._setIsRunning(false);

            return this;
        }

        private _setIsRunning(isRunning: boolean): void {
            this._isRunning = isRunning;
        }
        public getIsRunning(): boolean {
            return this._isRunning;
        }
        public getIsExecutingAction(): boolean {
            return this._isExecutingAction;
        }
        public setIsExecutingAction(isExecuting: boolean): void {
            this._isExecutingAction = isExecuting;
        }

        public checkCanEnd(): boolean {
            if (this.getWarEventManager().getCallableWarEventId() != null) {
                return false;
            }

            const aliveTeamIndexSet = new Set<number>();
            let hasAliveHumanPlayer = false;
            for (const [, player] of this.getPlayerManager().getAllPlayersDict()) {
                if ((player.checkIsNeutral()) || (player.getAliveState() === Types.PlayerAliveState.Dead)) {
                    continue;
                }

                aliveTeamIndexSet.add(player.getTeamIndex());
                if (player.getUserId() != null) {
                    hasAliveHumanPlayer = true;
                }
            }

            return (!hasAliveHumanPlayer)
                || (aliveTeamIndexSet.size <= 1)
                || (this.getDrawVoteManager().checkIsDraw());
        }
        public setIsEnded(ended: boolean): void {
            this._isEnded = ended;
        }
        public getIsEnded(): boolean {
            return this._isEnded;
        }

        public checkIsBoot(): boolean {
            if (this.getIsEnded()) {
                return false;
            }

            const player            = this.getPlayerInTurn();
            const restTimeToBoot    = player.getRestTimeToBoot();
            const enterTurnTime     = this.getEnterTurnTime();
            const bootTimeParams    = this.getSettingsBootTimerParams();
            return (bootTimeParams[0] !== Types.BootTimerType.NoBoot)
                && (player.getUserId() != null)
                && (player.getAliveState() === Types.PlayerAliveState.Alive)
                && (!player.checkIsNeutral())
                && (Timer.getServerTimestamp() > enterTurnTime + restTimeToBoot);
        }

        private _setWarId(warId: number | null): void {
            this._warId = warId;
        }
        public getWarId(): number | null{
            return this._warId;
        }

        public getGameConfig(): Config.GameConfig {
            return Helpers.getExisted(this._gameConfig);
        }
        private _setGameConfig(gameConfig: GameConfig): void {
            this._gameConfig = gameConfig;
        }

        public getWarRule(): CommonProto.WarRule.ITemplateWarRule {
            return this.getCommonSettingManager().getWarRule();
        }

        public getPlayersCountUnneutral(): number {
            return this.getPlayerManager().getTotalPlayersCount(false);
        }
        public getPlayer(playerIndex: number): BwPlayer {
            return this.getPlayerManager().getPlayer(playerIndex);
        }
        public getPlayerInTurn(): BwPlayer {
            return this.getPlayerManager().getPlayerInTurn();
        }
        public getPlayerIndexInTurn(): number {
            return this.getTurnManager().getPlayerIndexInTurn();
        }
        public checkIsHumanInTurn(): boolean {
            const player = this.getPlayerInTurn();
            return (player != null) && (player.getUserId() != null);
        }

        public getTurnManager(): BwTurnManager {
            return this._turnManager;
        }
        public getFogMap(): BaseWar.BwFogMap {
            return this.getField().getFogMap();
        }
        public getUnitMap(): BwUnitMap {
            return this.getField().getUnitMap();
        }
        public getTileMap(): BwTileMap {
            return this.getField().getTileMap();
        }
        public getActionPlanner(): BwActionPlanner {
            return this.getField().getActionPlanner();
        }
        public getGridVisualEffect(): TwnsBwGridVisualEffect.BwGridVisualEffect {
            return this.getField().getGridVisualEffect();
        }
        public getCursor(): TwnsBwCursor.BwCursor {
            return this.getField().getCursor();
        }

        public getEnterTurnTime(): number {
            return this.getTurnManager().getEnterTurnTime();
        }
        public getTurnPhaseCode(): Types.TurnPhaseCode {
            return this.getTurnManager().getPhaseCode();
        }

        public getWeatherManager(): TwnsBwWeatherManager.BwWeatherManager {
            return this._weatherManager;
        }
        public getDrawVoteManager(): TwnsBwDrawVoteManager.BwDrawVoteManager {
            return this._drawVoteManager;
        }
        public getRandomNumberManager(): TwnsBwRandomNumberManager.BwRandomNumberManager {
            return this._randomNumberManager;
        }
        public getExecutedActionManager(): BaseWar.BwExecutedActionManager {
            return this._executedActionManager;
        }
    }
}

// export default TwnsBwWar;
