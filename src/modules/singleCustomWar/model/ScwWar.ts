
import TwnsSpwWar           from "../../singlePlayerWar/model/SpwWar";
import TwnsSpwWarMenuPanel  from "../../singlePlayerWar/view/SpwWarMenuPanel";
import TwnsClientErrorCode  from "../../tools/helpers/ClientErrorCode";
import Logger               from "../../tools/helpers/Logger";
import Types                from "../../tools/helpers/Types";
import ProtoTypes           from "../../tools/proto/ProtoTypes";

namespace TwnsScwWar {
    import SpwWar           = TwnsSpwWar.SpwWar;
    import SpwWarMenuPanel  = TwnsSpwWarMenuPanel.SpwWarMenuPanel;
    import ISerialWar       = ProtoTypes.WarSerialization.ISerialWar;
    import ISettingsForScw  = ProtoTypes.WarSettings.ISettingsForScw;
    import ClientErrorCode  = TwnsClientErrorCode.ClientErrorCode;

    export class ScwWar extends SpwWar {
        private _settingsForScw : ISettingsForScw;

        public async init(data: ISerialWar): Promise<ClientErrorCode> {
            const baseInitError = await this._baseInit(data);
            if (baseInitError) {
                return baseInitError;
            }

            const settingsForScw = data.settingsForScw;
            if (settingsForScw == null) {
                return ClientErrorCode.ScwWarInit00;
            }

            this._setSettingsForScw(settingsForScw);

            this._initView();

            return ClientErrorCode.NoError;
        }

        public serialize(): ISerialWar {
            const settingsForCommon = this.getCommonSettingManager().getSettingsForCommon();
            if (settingsForCommon == null) {
                Logger.error(`ScwWar.serialize() empty settingsForCommon.`);
                return undefined;
            }

            const settingsForScw = this._getSettingsForScw();
            if (settingsForScw == null) {
                Logger.error(`ScwWar.serialize() empty settingsForScw.`);
                return undefined;
            }

            const playerManager = this.getPlayerManager();
            if (playerManager == null) {
                Logger.error(`ScwWar.serialize() empty playerManager.`);
                return undefined;
            }

            const turnManager = this.getTurnManager();
            if (turnManager == null) {
                Logger.error(`ScwWar.serialize() empty turnManager.`);
                return undefined;
            }

            const field = this.getField();
            if (field == null) {
                Logger.error(`ScwWar.serialize() empty field.`);
                return undefined;
            }

            const warEventManager = this.getWarEventManager();
            if (warEventManager == null) {
                Logger.error(`ScwWar.serialize() empty warEventManager.`);
                return undefined;
            }

            const serialPlayerManager = playerManager.serialize();
            if (serialPlayerManager == null) {
                Logger.error(`ScwWar.serialize() empty serialPlayerManager.`);
                return undefined;
            }

            const serialTurnManager = turnManager.serialize();
            if (serialTurnManager == null) {
                Logger.error(`ScwWar.serialize() empty serialTurnManager.`);
                return undefined;
            }

            const serialField = field.serialize();
            if (serialField == null) {
                Logger.error(`ScwWar.serialize() empty serialField.`);
                return undefined;
            }

            const serialWarEventManager = warEventManager.serialize();
            if (serialWarEventManager == null) {
                Logger.error(`ScwWar.serialize() empty serialWarEventManager.`);
                return undefined;
            }

            return {
                settingsForCommon,
                settingsForScw,

                warId                       : this.getWarId(),
                seedRandomInitialState      : null,
                seedRandomCurrentState      : null,
                executedActions             : [],
                remainingVotesForDraw       : this.getDrawVoteManager().getRemainingVotes(),
                warEventManager             : serialWarEventManager,
                playerManager               : serialPlayerManager,
                turnManager                 : serialTurnManager,
                field                       : serialField,
            };
        }

        public getIsNeedExecutedAction(): boolean {
            return false;
        }
        public getIsNeedSeedRandom(): boolean {
            return false;
        }
        public getIsWarMenuPanelOpening(): boolean {
            return SpwWarMenuPanel.getIsOpening();
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // The other functions.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        public getWarType(): Types.WarType {
            return this.getCommonSettingManager().getSettingsHasFogByDefault()
                ? Types.WarType.ScwFog
                : Types.WarType.ScwStd;
        }

        public getMapId(): number | undefined {
            const settingsForScw = this._getSettingsForScw();
            return settingsForScw ? settingsForScw.mapId : undefined;
        }

        public getCanCheat(): boolean {
            return true;
        }

        public getSettingsBootTimerParams(): number[] | null | undefined {
            return [Types.BootTimerType.NoBoot];
        }

        private _setSettingsForScw(settings: ISettingsForScw): void {
            this._settingsForScw = settings;
        }
        private _getSettingsForScw(): ISettingsForScw | null | undefined {
            return this._settingsForScw;
        }
    }
}

export default TwnsScwWar;
