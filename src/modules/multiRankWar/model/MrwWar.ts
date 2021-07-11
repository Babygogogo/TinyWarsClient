
import { MpwWar }                       from "../../multiPlayerWar/model/MpwWar";
import { ClientErrorCode }              from "../../../utility/ClientErrorCode";
import * as CommonConstants             from "../../../utility/CommonConstants";
import * as ProtoTypes                  from "../../../utility/ProtoTypes";
import * as Types                       from "../../../utility/Types";
import ISerialWar                       = ProtoTypes.WarSerialization.ISerialWar;
import ISettingsForMrw                  = ProtoTypes.WarSettings.ISettingsForMrw;

export class MrwWar extends MpwWar {
    private _settingsForMrw?: ISettingsForMrw;

    public async init(data: ISerialWar): Promise<ClientErrorCode> {
        const baseInitError = await this._baseInit(data);
        if (baseInitError) {
            return baseInitError;
        }

        const settingsForMrw = data.settingsForMrw;
        if (settingsForMrw == null) {
            return ClientErrorCode.MrwWarInit00;
        }

        this._setSettingsForMrw(settingsForMrw);

        this._initView();

        return ClientErrorCode.NoError;
    }

    public getCanCheat(): boolean {
        return false;
    }
    public getWarType(): Types.WarType {
        return this.getCommonSettingManager().getSettingsHasFogByDefault()
            ? Types.WarType.MrwFog
            : Types.WarType.MrwStd;
    }
    public getIsNeedExecutedAction(): boolean {
        return false;
    }
    public getIsNeedSeedRandom(): boolean {
        return false;
    }
    public getMapId(): number | undefined {
        const settingsForMrw = this.getSettingsForMrw();
        return settingsForMrw ? settingsForMrw.mapId : undefined;
    }

    private _setSettingsForMrw(settings: ISettingsForMrw): void {
        this._settingsForMrw = settings;
    }
    public getSettingsForMrw(): ISettingsForMrw | null | undefined {
        return this._settingsForMrw;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // The other functions.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    public getSettingsBootTimerParams(): number[] {
        return CommonConstants.WarBootTimerDefaultParams;
    }
}
