
import { MpwWar }                       from "../../multiPlayerWar/model/MpwWar";
import TwnsClientErrorCode              from "../../tools/helpers/ClientErrorCode";
import CommonConstants              from "../../tools/helpers/CommonConstants";
import ProtoTypes                   from "../../tools/proto/ProtoTypes";
import Types                        from "../../tools/helpers/Types";
import ISerialWar                       = ProtoTypes.WarSerialization.ISerialWar;
import ISettingsForMrw                  = ProtoTypes.WarSettings.ISettingsForMrw;
import ClientErrorCode = TwnsClientErrorCode.ClientErrorCode;

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
