
import { ClientErrorCode }              from "../../../utility/ClientErrorCode";
import { MpwWar }                       from "../../multiPlayerWar/model/MpwWar";
import * as Logger                      from "../../../utility/Logger";
import * as ProtoTypes                  from "../../../utility/ProtoTypes";
import * as Types                       from "../../../utility/Types";
import ISerialWar                       = ProtoTypes.WarSerialization.ISerialWar;
import ISettingsForCcw                  = ProtoTypes.WarSettings.ISettingsForCcw;

export class CcwWar extends MpwWar {
    private _settingsForCcw?: ISettingsForCcw;

    public async init(data: ISerialWar): Promise<ClientErrorCode> {
        const baseInitError = await this._baseInit(data);
        if (baseInitError) {
            return baseInitError;
        }

        const settingsForCcw = data.settingsForCcw;
        if (settingsForCcw == null) {
            return ClientErrorCode.CcwWar_Init_00;
        }

        this._setSettingsForCcw(settingsForCcw);

        this._initView();

        return ClientErrorCode.NoError;
    }

    public getCanCheat(): boolean {
        return false;
    }
    public getWarType(): Types.WarType {
        return this.getCommonSettingManager().getSettingsHasFogByDefault()
            ? Types.WarType.CcwFog
            : Types.WarType.CcwStd;
    }
    public getIsNeedExecutedAction(): boolean {
        return false;
    }
    public getIsNeedSeedRandom(): boolean {
        return false;
    }
    public getMapId(): number | null | undefined {
        const settingsForCcw = this.getSettingsForCcw();
        return settingsForCcw ? settingsForCcw.mapId : undefined;
    }

    private _setSettingsForCcw(settings: ISettingsForCcw): void {
        this._settingsForCcw = settings;
    }
    public getSettingsForCcw(): ISettingsForCcw | null | undefined {
        return this._settingsForCcw;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // The other functions.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    public getWarName(): string | null | undefined {
        const settingsForCcw = this.getSettingsForCcw();
        if (settingsForCcw == null) {
            Logger.error(`CcwWar.getWarName() empty settingsForCcw.`);
            return undefined;
        }

        return settingsForCcw.warName;
    }
    public getWarPassword(): string | null | undefined {
        const settingsForCcw = this.getSettingsForCcw();
        if (settingsForCcw == null) {
            Logger.error(`CcwWar.getWarPassword() empty settingsForCcw.`);
            return undefined;
        }

        return settingsForCcw.warPassword;
    }
    public getWarComment(): string | null | undefined {
        const settingsForCcw = this.getSettingsForCcw();
        if (settingsForCcw == null) {
            Logger.error(`CcwWar.getWarComment() empty settingsForCcw.`);
            return undefined;
        }

        return settingsForCcw.warComment;
    }

    public getSettingsBootTimerParams(): number[] | null | undefined {
        const settingsForCcw = this.getSettingsForCcw();
        if (settingsForCcw == null) {
            Logger.error(`CcwWar.getSettingsBootTimerParams() empty settingsForCcw.`);
            return undefined;
        }

        return settingsForCcw.bootTimerParams;
    }
}
