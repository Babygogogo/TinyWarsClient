
import TwnsSpwWar           from "../../singlePlayerWar/model/SpwWar";
import TwnsSpwWarMenuPanel  from "../../singlePlayerWar/view/SpwWarMenuPanel";
import TwnsClientErrorCode  from "../../tools/helpers/ClientErrorCode";
import FloatText            from "../../tools/helpers/FloatText";
import Helpers              from "../../tools/helpers/Helpers";
import Logger               from "../../tools/helpers/Logger";
import Types                from "../../tools/helpers/Types";
import ProtoTypes           from "../../tools/proto/ProtoTypes";

namespace TwnsSrwWar {
    import SpwWar           = TwnsSpwWar.SpwWar;
    import SpwWarMenuPanel  = TwnsSpwWarMenuPanel.SpwWarMenuPanel;
    import ISerialWar       = ProtoTypes.WarSerialization.ISerialWar;
    import ISettingsForSrw  = ProtoTypes.WarSettings.ISettingsForSrw;
    import ClientErrorCode  = TwnsClientErrorCode.ClientErrorCode;

    export class SrwWar extends SpwWar {
        private _settingsForSrw : ISettingsForSrw;

        public async init(data: ISerialWar): Promise<ClientErrorCode> {
            const baseInitError = await this._baseInit(data);
            if (baseInitError) {
                return baseInitError;
            }

            const settingsForSrw = data.settingsForSrw;
            if (settingsForSrw == null) {
                return ClientErrorCode.SrwWarInit00;
            }

            this._setSettingsForSrw(settingsForSrw);

            this._initView();

            return ClientErrorCode.NoError;
        }

        public serialize(): ISerialWar {
            const settingsForCommon = this.getCommonSettingManager().getSettingsForCommon();
            if (settingsForCommon == null) {
                Logger.error(`SrwWar.serialize() empty settingsForCommon.`);
                return undefined;
            }

            const settingsForSrw = this._getSettingsForSrw();
            if (settingsForSrw == null) {
                Logger.error(`SrwWar.serialize() empty settingsForSrw.`);
                return undefined;
            }

            const playerManager = this.getPlayerManager();
            if (playerManager == null) {
                Logger.error(`SrwWar.serialize() empty playerManager.`);
                return undefined;
            }

            const turnManager = this.getTurnManager();
            if (turnManager == null) {
                Logger.error(`SrwWar.serialize() empty turnManager.`);
                return undefined;
            }

            const field = this.getField();
            if (field == null) {
                Logger.error(`SrwWar.serialize() empty field.`);
                return undefined;
            }

            const warEventManager = this.getWarEventManager();
            if (warEventManager == null) {
                Logger.error(`SrwWar.serialize() empty warEventManager.`);
                return undefined;
            }

            const serialPlayerManager = playerManager.serialize();
            if (serialPlayerManager == null) {
                Logger.error(`SrwWar.serialize() empty serialPlayerManager.`);
                return undefined;
            }

            const serialTurnManager = turnManager.serialize();
            if (serialTurnManager == null) {
                Logger.error(`SrwWar.serialize() empty serialTurnManager.`);
                return undefined;
            }

            const serialField = field.serialize();
            if (serialField == null) {
                Logger.error(`SrwWar.serialize() empty serialField.`);
                return undefined;
            }

            const serialWarEventManager = warEventManager.serialize();
            if (serialWarEventManager == null) {
                Logger.error(`SrwWar.serialize() empty serialWarEventManager.`);
                return undefined;
            }

            const randomNumberManager       = this.getRandomNumberManager();
            const seedRandomCurrentState    = randomNumberManager.getSeedRandomCurrentState();
            if (seedRandomCurrentState == null) {
                Logger.error(`SrwWar.serialize() empty seedRandomCurrentState.`);
                return undefined;
            }

            const seedRandomInitialState = randomNumberManager.getSeedRandomInitialState();
            if (seedRandomInitialState == null) {
                Logger.error(`SrwWar.serialize() empty seedRandomInitialState.`);
                return undefined;
            }

            const executedActions = this.getExecutedActionManager().getAllExecutedActions();
            if (executedActions == null) {
                Logger.error(`SrwWar.serialize() empty executedActions.`);
                return undefined;
            }

            return {
                settingsForCommon,
                settingsForSrw,

                warId                       : this.getWarId(),
                seedRandomInitialState,
                seedRandomCurrentState,
                executedActions,
                remainingVotesForDraw       : this.getDrawVoteManager().getRemainingVotes(),
                warEventManager             : serialWarEventManager,
                playerManager               : serialPlayerManager,
                turnManager                 : serialTurnManager,
                field                       : serialField,
            };
        }
        public serializeForValidation(): ISerialWar {
            const settingsForCommon = this.getCommonSettingManager().getSettingsForCommon();
            if (settingsForCommon == null) {
                Logger.error(`SrwWar.serialize() empty settingsForCommon.`);
                return undefined;
            }

            const settingsForSrw = Helpers.deepClone(this._getSettingsForSrw());
            if (settingsForSrw == null) {
                Logger.error(`SrwWar.serialize() empty settingsForSrw.`);
                return undefined;
            }

            const serialPlayerManager = this.getPlayerManager().serialize();
            if (serialPlayerManager == null) {
                Logger.error(`SrwWar.serialize() empty serialPlayerManager.`);
                return undefined;
            }

            const seedRandomInitialState = this.getRandomNumberManager().getSeedRandomInitialState();
            if (seedRandomInitialState == null) {
                Logger.error(`SrwWar.serialize() empty seedRandomInitialState.`);
                return undefined;
            }

            const executedActions = this.getExecutedActionManager().getAllExecutedActions();
            if (executedActions == null) {
                Logger.error(`SrwWar.serialize() empty executedActions.`);
                return undefined;
            }

            settingsForSrw.totalScore = this.calculateTotalScore();

            return {
                settingsForCommon,
                settingsForSrw,

                warId                       : null,
                seedRandomInitialState,
                seedRandomCurrentState      : null,
                executedActions,
                remainingVotesForDraw       : null,
                warEventManager             : null,
                playerManager               : serialPlayerManager,
                turnManager                 : null,
                field                       : null,
            };
        }

        public getIsNeedExecutedAction(): boolean {
            return true;
        }
        public getIsNeedSeedRandom(): boolean {
            return true;
        }
        public getIsWarMenuPanelOpening(): boolean {
            return SpwWarMenuPanel.getIsOpening();
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // The other functions.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        public getWarType(): Types.WarType {
            return this.getCommonSettingManager().getSettingsHasFogByDefault()
                ? Types.WarType.SrwFog
                : Types.WarType.SrwStd;
        }

        public getMapId(): number | undefined {
            const settingsForSrw = this._getSettingsForSrw();
            return settingsForSrw ? settingsForSrw.mapId : undefined;
        }

        public getCanCheat(): boolean {
            return false;
        }

        public getSettingsBootTimerParams(): number[] | null | undefined {
            return [Types.BootTimerType.NoBoot];
        }

        private _setSettingsForSrw(settings: ISettingsForSrw): void {
            this._settingsForSrw = settings;
        }
        private _getSettingsForSrw(): ISettingsForSrw | null | undefined {
            return this._settingsForSrw;
        }

        public calculateTotalScore(): number {
            // TODO
            FloatText.show("SrwWar.calculateTotalScore() TODO!");
            return 0;
        }
    }
}

export default TwnsSrwWar;
