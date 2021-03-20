
namespace TinyWars.MapEditor {
    import ProtoTypes           = Utility.ProtoTypes;
    import ConfigManager        = Utility.ConfigManager;
    import CommonConstants      = Utility.CommonConstants;
    import Helpers              = Utility.Helpers;
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

        public serializeForSimulation(): ISettingsForCommon | undefined {
            const settingsForCommon = Helpers.deepClone(this.getSettingsForCommon());
            if (settingsForCommon != null) {
                const playerRules               = settingsForCommon.warRule.ruleForPlayers;
                const playersCountUnneutral     = (this._getWar().getField() as MeField).getMaxPlayerIndex();
                playerRules.playerRuleDataArray = playerRules.playerRuleDataArray.filter(v => {
                    const playerIndex = v.playerIndex;
                    return (playerIndex <= playersCountUnneutral)
                        && (playerIndex >= CommonConstants.WarFirstPlayerIndex);
                }).sort((v1, v2) => v1.playerIndex - v2.playerIndex);
            }

            return settingsForCommon;
        }
    }
}
