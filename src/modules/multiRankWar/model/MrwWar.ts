
namespace TinyWars.MultiRankWar {
    import Logger           = Utility.Logger;
    import ProtoTypes       = Utility.ProtoTypes;
    import Types            = Utility.Types;
    import ClientErrorCode  = Utility.ClientErrorCode;
    import ISerialWar       = ProtoTypes.WarSerialization.ISerialWar;
    import ISettingsForMrw  = ProtoTypes.WarSettings.ISettingsForMrw;
    import CommonConstants  = Utility.CommonConstants;

    export class MrwWar extends MultiPlayerWar.MpwWar {
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

        public getWarType(): Types.WarType {
            return this.getCommonSettingManager().getSettingsHasFogByDefault()
                ? Types.WarType.MrwFog
                : Types.WarType.MrwStd;
        }
        public getIsNeedReplay(): boolean {
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
            return [Types.BootTimerType.Regular, CommonConstants.WarBootTimerRegularDefaultValue];
        }
    }
}
