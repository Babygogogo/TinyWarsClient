
import { ClientErrorCode }              from "../../../utility/ClientErrorCode";
import { SpwWar }                       from "../../singlePlayerWar/model/SpwWar";
import { SpwWarMenuPanel }              from "../../singlePlayerWar/view/SpwWarMenuPanel";
import { Logger }                       from "../../../utility/Logger";
import * as ProtoTypes                  from "../../../utility/ProtoTypes";
import { Types }                        from "../../../utility/Types";
import ISerialWar                       = ProtoTypes.WarSerialization.ISerialWar;
import ISettingsForSfw                  = ProtoTypes.WarSettings.ISettingsForSfw;

export class SfwWar extends SpwWar {
    private _settingsForSfw : ISettingsForSfw;

    public async init(data: ISerialWar): Promise<ClientErrorCode> {
        const baseInitError = await this._baseInit(data);
        if (baseInitError) {
            return baseInitError;
        }

        const settingsForSfw = data.settingsForSfw;
        if (settingsForSfw == null) {
            return ClientErrorCode.SfwWarInit00;
        }

        this._setSettingsForSfw(settingsForSfw);

        this._initView();

        return ClientErrorCode.NoError;
    }

    public serialize(): ISerialWar {
        const settingsForCommon = this.getCommonSettingManager().getSettingsForCommon();
        if (settingsForCommon == null) {
            Logger.error(`SfwWar.serialize() empty settingsForCommon.`);
            return undefined;
        }

        const settingsForSfw = this._getSettingsForSfw();
        if (settingsForSfw == null) {
            Logger.error(`SfwWar.serialize() empty settingsForSfw.`);
            return undefined;
        }

        const playerManager = this.getPlayerManager();
        if (playerManager == null) {
            Logger.error(`SfwWar.serialize() empty playerManager.`);
            return undefined;
        }

        const turnManager = this.getTurnManager();
        if (turnManager == null) {
            Logger.error(`SfwWar.serialize() empty turnManager.`);
            return undefined;
        }

        const field = this.getField();
        if (field == null) {
            Logger.error(`SfwWar.serialize() empty field.`);
            return undefined;
        }

        const warEventManager = this.getWarEventManager();
        if (warEventManager == null) {
            Logger.error(`SfwWar.serialize() empty warEventManager.`);
            return undefined;
        }

        const serialPlayerManager = playerManager.serialize();
        if (serialPlayerManager == null) {
            Logger.error(`SfwWar.serialize() empty serialPlayerManager.`);
            return undefined;
        }

        const serialTurnManager = turnManager.serialize();
        if (serialTurnManager == null) {
            Logger.error(`SfwWar.serialize() empty serialTurnManager.`);
            return undefined;
        }

        const serialField = field.serialize();
        if (serialField == null) {
            Logger.error(`SfwWar.serialize() empty serialField.`);
            return undefined;
        }

        const serialWarEventManager = warEventManager.serialize();
        if (serialWarEventManager == null) {
            Logger.error(`SfwWar.serialize() empty serialWarEventManager.`);
            return undefined;
        }

        return {
            settingsForCommon,
            settingsForSfw,

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
            ? Types.WarType.SfwFog
            : Types.WarType.SfwStd;
    }

    public getMapId(): number | undefined {
        return undefined;
    }

    public getCanCheat(): boolean {
        return true;
    }

    public getSettingsBootTimerParams(): number[] | null | undefined {
        return [Types.BootTimerType.NoBoot];
    }

    private _setSettingsForSfw(settings: ISettingsForSfw): void {
        this._settingsForSfw = settings;
    }
    private _getSettingsForSfw(): ISettingsForSfw | null | undefined {
        return this._settingsForSfw;
    }
}
