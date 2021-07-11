
import { MpwWar }           from "../../multiPlayerWar/model/MpwWar";
import { ClientErrorCode }  from "../../../utility/ClientErrorCode";
import { Logger }           from "../../../utility/Logger";
import * as ProtoTypes      from "../../../utility/ProtoTypes";
import { Types }            from "../../../utility/Types";
import ISerialWar           = ProtoTypes.WarSerialization.ISerialWar;
import ISettingsForMcw      = ProtoTypes.WarSettings.ISettingsForMcw;

export class McwWar extends MpwWar {
    private _settingsForMcw?: ISettingsForMcw;

    public async init(data: ISerialWar): Promise<ClientErrorCode> {
        const baseInitError = await this._baseInit(data);
        if (baseInitError) {
            return baseInitError;
        }

        const settingsForMcw = data.settingsForMcw;
        if (settingsForMcw == null) {
            return ClientErrorCode.McwWarInit00;
        }

        this._setSettingsForMcw(settingsForMcw);

        this._initView();

        return ClientErrorCode.NoError;
    }

    public getCanCheat(): boolean {
        return false;
    }
    public getWarType(): Types.WarType {
        return this.getCommonSettingManager().getSettingsHasFogByDefault()
            ? Types.WarType.McwFog
            : Types.WarType.McwStd;
    }
    public getIsNeedExecutedAction(): boolean {
        return false;
    }
    public getIsNeedSeedRandom(): boolean {
        return false;
    }
    public getMapId(): number | null | undefined {
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
    public getWarName(): string | null | undefined {
        const settingsForMcw = this.getSettingsForMcw();
        if (settingsForMcw == null) {
            Logger.error(`McwWar.getWarName() empty settingsForMcw.`);
            return undefined;
        }

        return settingsForMcw.warName;
    }
    public getWarPassword(): string | null | undefined {
        const settingsForMcw = this.getSettingsForMcw();
        if (settingsForMcw == null) {
            Logger.error(`McwWar.getWarPassword() empty settingsForMcw.`);
            return undefined;
        }

        return settingsForMcw.warPassword;
    }
    public getWarComment(): string | null | undefined {
        const settingsForMcw = this.getSettingsForMcw();
        if (settingsForMcw == null) {
            Logger.error(`McwWar.getWarComment() empty settingsForMcw.`);
            return undefined;
        }

        return settingsForMcw.warComment;
    }

    public getSettingsBootTimerParams(): number[] | null | undefined {
        const settingsForMcw = this.getSettingsForMcw();
        if (settingsForMcw == null) {
            Logger.error(`McwWar.getSettingsBootTimerParams() empty settingsForMcw.`);
            return undefined;
        }

        return settingsForMcw.bootTimerParams;
    }
}
