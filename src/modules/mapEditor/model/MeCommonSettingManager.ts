
namespace TinyWars.MapEditor {
    import ProtoTypes           = Utility.ProtoTypes;
    import ConfigManager        = Utility.ConfigManager;
    import ClientErrorCode      = Utility.ClientErrorCode;
    import ISettingsForCommon   = ProtoTypes.WarSettings.ISettingsForCommon;

    export class MeCommonSettingManager extends BaseWar.BwCommonSettingManager {
        public async init({ settings, allWarEventIdArray, playersCountUnneutral }: {
            settings                : ISettingsForCommon | null | undefined;
            allWarEventIdArray      : number[];
            playersCountUnneutral   : number;
        }): Promise<ClientErrorCode> {
            if (settings == null) {
                return ClientErrorCode.MeCommonSettingManagerInit00;
            }

            const configVersion = settings.configVersion;
            if (configVersion !== ConfigManager.getLatestFormalVersion()) {
                return ClientErrorCode.MeCommonSettingManagerInit01;
            }

            const warRule = settings.warRule;
            if (warRule == null) {
                return ClientErrorCode.MeCommonSettingManagerInit02;
            }

            this._setSettingsForCommon(settings);

            return ClientErrorCode.NoError;
        }
    }
}
