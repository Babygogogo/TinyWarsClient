
import TwnsBwCommonSettingManager   from "../../baseWar/model/BwCommonSettingManager";
import TwnsClientErrorCode          from "../../tools/helpers/ClientErrorCode";
import ConfigManager                from "../../tools/helpers/ConfigManager";
import Helpers                      from "../../tools/helpers/Helpers";
import ProtoTypes                   from "../../tools/proto/ProtoTypes";
import TwnsMeWar                    from "./MeWar";

namespace TwnsMeCommonSettingManager {
    import MeWar                = TwnsMeWar.MeWar;
    import ISettingsForCommon   = ProtoTypes.WarSettings.ISettingsForCommon;
    import ClientErrorCode      = TwnsClientErrorCode.ClientErrorCode;

    export class MeCommonSettingManager extends TwnsBwCommonSettingManager.BwCommonSettingManager {
        public async init({ settings, allWarEventIdArray, playersCountUnneutral }: {
            settings                : ISettingsForCommon;
            allWarEventIdArray      : number[];
            playersCountUnneutral   : number;
        }): Promise<void> {
            const configVersion = settings.configVersion;
            if ((configVersion == null) || (configVersion !== ConfigManager.getLatestConfigVersion())) {
                throw Helpers.newError(`Invalid configVersion: ${configVersion}`, ClientErrorCode.MeCommonSettingManager_Init_00);
            }

            const warRule = settings.warRule;
            if (warRule == null) {
                throw Helpers.newError(`Invalid configVersion: ${configVersion}`, ClientErrorCode.MeCommonSettingManager_Init_00);
            }

            this._setSettingsForCommon(settings);
        }

        public serializeForCreateSfw(): ISettingsForCommon {
            const war       = this._getWar() as MeWar;
            const warRule   = war.getRevisedWarRuleArray(war.getField().getMaxPlayerIndex())[0];
            return {
                configVersion   : this.getSettingsForCommon().configVersion,
                presetWarRuleId : warRule.ruleId,
                warRule         : Helpers.deepClone(warRule),
            };
        }
    }
}

export default TwnsMeCommonSettingManager;
