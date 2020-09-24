
namespace TinyWars.MultiCustomWar {
    import Logger                   = Utility.Logger;
    import BwHelpers                = BaseWar.BwHelpers;
    import ProtoTypes               = Utility.ProtoTypes;
    import ISerialWar               = ProtoTypes.WarSerialization.ISerialWar;
    import ISettingsForMultiPlayer  = ProtoTypes.WarSettings.ISettingsForMultiPlayer;

    export class McwWar extends BaseWar.BwWar {
        private _settingsForMultiPlayer?: ISettingsForMultiPlayer;
        private _isEnded                = false;

        public async init(data: ISerialWar): Promise<McwWar> {
            if (!this._baseInit(data)) {
                Logger.error(`McwWar.init() failed this._baseInit().`);
                return undefined;
            }

            const settingsForMultiPlayer = data.settingsForMultiPlayer;
            if (!settingsForMultiPlayer) {
                Logger.error(`McwWar.init() invalid settingsForMultiPlayer! ${JSON.stringify(data)}`);
                return undefined;
            }

            const mapSizeAndMaxPlayerIndex = await BwHelpers.getMapSizeAndMaxPlayerIndex(data);
            if (!mapSizeAndMaxPlayerIndex) {
                Logger.error(`McwWar.init() invalid war data! ${JSON.stringify(data)}`);
                return undefined;
            }

            const settingsForCommon = data.settingsForCommon;
            if (!settingsForCommon) {
                Logger.error(`McwWar.init() empty settingsForCommon! ${JSON.stringify(data)}`);
                return undefined;
            }

            const configVersion = settingsForCommon.configVersion;
            if (configVersion == null) {
                Logger.error(`McwWar.init() empty configVersion.`);
                return undefined;
            }

            const dataForPlayerManager = data.playerManager;
            if (dataForPlayerManager == null) {
                Logger.error(`McwWar.init() empty dataForPlayerManager.`);
                return undefined;
            }

            const dataForTurnManager = data.turnManager;
            if (dataForTurnManager == null) {
                Logger.error(`McwWar.init() empty dataForTurnManager.`);
                return undefined;
            }

            const dataForField = data.field;
            if (dataForField == null) {
                Logger.error(`McwWar.init() empty dataForField.`);
                return undefined;
            }

            const playerManager = (this.getPlayerManager() || new (this._getPlayerManagerClass())()).init(dataForPlayerManager);
            if (playerManager == null) {
                Logger.error(`McwWar.init() empty playerManager.`);
                return undefined;
            }

            const turnManager = (this.getTurnManager() || new (this._getTurnManagerClass())()).init(dataForTurnManager);
            if (turnManager == null) {
                Logger.error(`McwWar.init() empty turnManager.`);
                return undefined;
            }

            const field = await (this.getField() || new (this._getFieldClass())()).init(dataForField, configVersion, mapSizeAndMaxPlayerIndex);
            if (field == null) {
                Logger.error(`McwWar.init() empty field.`);
                return undefined;
            }

            this._setSettingsForMultiPlayer(settingsForMultiPlayer);
            this._setPlayerManager(playerManager);
            this._setTurnManager(turnManager);
            this._setField(field);

            this._initView();

            return this;
        }

        public serializeForSimulation(): ISerialWar | undefined {
            const warId = this.getWarId();
            if (warId == null) {
                Logger.error(`McwWar.serializeForSimulation() empty warId.`);
                return undefined;
            }

            const settingsForCommon = this.getSettingsForCommon();
            if (settingsForCommon == null) {
                Logger.error(`McwWar.serializeForSimulation() empty settingsForCommon.`);
                return undefined;
            }

            const settingsForMultiPlayer = this.getSettingsForMultiPlayer();
            if (settingsForMultiPlayer == null) {
                Logger.error(`McwWar.serializeForSimulation() empty settingsForMultiPlayer.`);
                return undefined;
            }

            const executedActionsCount = this.getExecutedActionsCount();
            if (executedActionsCount == null) {
                Logger.error(`McwWar.serializeForSimulation() empty executedActionsCount.`);
                return undefined;
            }

            const playerManager = this.getPlayerManager();
            if (playerManager == null) {
                Logger.error(`McwWar.serializeForSimulation() empty playerManager.`);
                return undefined;
            }

            const turnManager = this.getTurnManager();
            if (turnManager == null) {
                Logger.error(`McwWar.serializeForSimulation() empty turnManager.`);
                return undefined;
            }

            const field = this.getField();
            if (field == null) {
                Logger.error(`McwWar.serializeForSimulation() empty field.`);
                return undefined;
            }

            const serialPlayerManager = playerManager.serializeForSimulation();
            if (serialPlayerManager == null) {
                Logger.error(`McwWar.serializeForSimulation() empty serialPlayerManager.`);
                return undefined;
            }

            const serialTurnManager = turnManager.serializeForSimulation();
            if (serialTurnManager == null) {
                Logger.error(`McwWar.serializeForSimulation() empty serialTurnManager.`);
                return undefined;
            }

            const serialField = field.serializeForSimulation();
            if (serialField == null) {
                Logger.error(`McwWar.serializeForSimulation() empty serialField.`);
                return undefined;
            }

            return {
                settingsForCommon,
                settingsForMultiPlayer,

                warId,
                seedRandomInitialState      : null,
                seedRandomCurrentState      : new Math.seedrandom("" + Math.random(), { state: true }).state(),
                executedActions             : [],
                executedActionsCount,
                remainingVotesForDraw       : this.getRemainingVotesForDraw(),
                playerManager               : serialPlayerManager,
                turnManager                 : serialTurnManager,
                field                       : serialField,
            };
        }

        protected _getViewClass(): new () => McwWarView {
            return McwWarView;
        }
        protected _getFieldClass(): new () => McwField {
            return McwField;
        }
        protected _getPlayerManagerClass(): new () => McwPlayerManager {
            return McwPlayerManager;
        }
        protected _getTurnManagerClass(): new () => McwTurnManager {
            return McwTurnManager;
        }

        private _setSettingsForMultiPlayer(settings: ISettingsForMultiPlayer): void {
            this._settingsForMultiPlayer = settings;
        }
        public getSettingsForMultiPlayer(): ISettingsForMultiPlayer | null | undefined {
            return this._settingsForMultiPlayer;
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // The other functions.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        public getWarName(): string {
            const settingsForMultiPlayer = this.getSettingsForMultiPlayer();
            if (settingsForMultiPlayer == null) {
                Logger.error(`McwWar.getWarName() empty settingsForMultiPlayer.`);
                return undefined;
            }

            return settingsForMultiPlayer.warName;
        }
        public getWarPassword(): string {
            const settingsForMultiPlayer = this.getSettingsForMultiPlayer();
            if (settingsForMultiPlayer == null) {
                Logger.error(`McwWar.getWarPassword() empty settingsForMultiPlayer.`);
                return undefined;
            }

            return settingsForMultiPlayer.warPassword;
        }
        public getWarComment(): string {
            const settingsForMultiPlayer = this.getSettingsForMultiPlayer();
            if (settingsForMultiPlayer == null) {
                Logger.error(`McwWar.getWarComment() empty settingsForMultiPlayer.`);
                return undefined;
            }

            return settingsForMultiPlayer.warComment;
        }

        public getSettingsBootTimerParams(): number[] {
            const settingsForMultiPlayer = this.getSettingsForMultiPlayer();
            if (settingsForMultiPlayer == null) {
                Logger.error(`McwWar.getSettingsBootTimerParams() empty settingsForMultiPlayer.`);
                return undefined;
            }

            return settingsForMultiPlayer.bootTimerParams;
        }
        public getBootRestTime(): number | null {
            const player = this.getPlayerInTurn();
            if (player.getPlayerIndex() === 0) {
                return null;
            } else {
                return (this.getEnterTurnTime() + player.getRestTimeToBoot() - Time.TimeModel.getServerTimestamp()) || null;
            }
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
            } else {
                const player = this.getPlayerInTurn();
                return (player.getIsAlive())
                    && (!player.checkIsNeutral())
                    && (Time.TimeModel.getServerTimestamp() > this.getEnterTurnTime() + player.getRestTimeToBoot());
            }
        }

        public getPlayerIndexLoggedIn(): number | undefined {
            return (this.getPlayerManager() as McwPlayerManager).getPlayerIndexLoggedIn();
        }
        public getPlayerLoggedIn(): McwPlayer {
            return (this.getPlayerManager() as McwPlayerManager).getPlayerLoggedIn();
        }
    }
}
