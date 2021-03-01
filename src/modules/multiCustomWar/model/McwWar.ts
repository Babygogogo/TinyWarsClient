
namespace TinyWars.MultiCustomWar {
    import Logger           = Utility.Logger;
    import Types            = Utility.Types;
    import ProtoTypes       = Utility.ProtoTypes;
    import BwHelpers        = BaseWar.BwHelpers;
    import ISerialWar       = ProtoTypes.WarSerialization.ISerialWar;
    import ISettingsForMcw  = ProtoTypes.WarSettings.ISettingsForMcw;

    export class McwWar extends MultiPlayerWar.MpwWar {
        private _settingsForMcw?: ISettingsForMcw;

        public async init(data: ISerialWar): Promise<McwWar> {
            if (this._baseInit(data)) {
                Logger.error(`McwWar.init() failed this._baseInit().`);
                return undefined;
            }

            const settingsForMcw = data.settingsForMcw;
            if (!settingsForMcw) {
                Logger.error(`McwWar.init() invalid settingsForMcw! ${JSON.stringify(data)}`);
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

            this._setSettingsForMcw(settingsForMcw);
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

            const settingsForMcw = this.getSettingsForMcw();
            if (settingsForMcw == null) {
                Logger.error(`McwWar.serializeForSimulation() empty settingsForMcw.`);
                return undefined;
            }

            const warEventManager = this.getWarEventManager();
            if (warEventManager == null) {
                Logger.error(`McwWar.serializeForSimulation() empty warEventManager.`);
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

            const serialWarEventManager = warEventManager.serializeForSimulation();
            if (serialWarEventManager == null) {
                Logger.error(`McwWar.serializeForSimulation() empty serialWarEventManager.`);
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
                settingsForMcw              : null,
                settingsForMrw              : null,
                settingsForScw              : { isCheating: true },

                warId,
                seedRandomInitialState      : null,
                seedRandomCurrentState      : new Math.seedrandom("" + Math.random(), { state: true }).state(),
                executedActions             : [],
                remainingVotesForDraw       : this.getDrawVoteManager().getRemainingVotes(),
                warEventManager             : serialWarEventManager,
                playerManager               : serialPlayerManager,
                turnManager                 : serialTurnManager,
                field                       : serialField,
            };
        }

        public getWarType(): Types.WarType {
            return this.getSettingsHasFogByDefault()
                ? Types.WarType.McwFog
                : Types.WarType.McwStd;
        }
        public getIsNeedReplay(): boolean {
            return false;
        }
        public getMapId(): number | undefined {
            const settingsForMcw = this.getSettingsForMcw();
            return settingsForMcw ? settingsForMcw.mapId : undefined;
        }

        private _setSettingsForMcw(settings: ISettingsForMcw): void {
            this._settingsForMcw = settings;
        }
        public getSettingsForMcw(): ISettingsForMcw | null | undefined {
            return this._settingsForMcw;
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // The other functions.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        public getWarName(): string {
            const settingsForMcw = this.getSettingsForMcw();
            if (settingsForMcw == null) {
                Logger.error(`McwWar.getWarName() empty settingsForMcw.`);
                return undefined;
            }

            return settingsForMcw.warName;
        }
        public getWarPassword(): string {
            const settingsForMcw = this.getSettingsForMcw();
            if (settingsForMcw == null) {
                Logger.error(`McwWar.getWarPassword() empty settingsForMcw.`);
                return undefined;
            }

            return settingsForMcw.warPassword;
        }
        public getWarComment(): string {
            const settingsForMcw = this.getSettingsForMcw();
            if (settingsForMcw == null) {
                Logger.error(`McwWar.getWarComment() empty settingsForMcw.`);
                return undefined;
            }

            return settingsForMcw.warComment;
        }

        public getSettingsBootTimerParams(): number[] {
            const settingsForMcw = this.getSettingsForMcw();
            if (settingsForMcw == null) {
                Logger.error(`McwWar.getSettingsBootTimerParams() empty settingsForMcw.`);
                return undefined;
            }

            return settingsForMcw.bootTimerParams;
        }
    }
}
