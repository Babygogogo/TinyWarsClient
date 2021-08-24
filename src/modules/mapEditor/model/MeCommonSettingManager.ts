
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
            settings                : ISettingsForCommon | null | undefined;
            allWarEventIdArray      : number[];
            playersCountUnneutral   : number;
        }): Promise<ClientErrorCode> {
            if (settings == null) {
                return ClientErrorCode.MeCommonSettingManagerInit00;
            }

            const configVersion = settings.configVersion;
            if (configVersion !== ConfigManager.getLatestConfigVersion()) {
                return ClientErrorCode.MeCommonSettingManagerInit01;
            }

            const warRule = settings.warRule;
            if (warRule == null) {
                return ClientErrorCode.MeCommonSettingManagerInit02;
            }

            this._setSettingsForCommon(settings);

            return ClientErrorCode.NoError;
        }

        public serializeForCreateSfw(): ISettingsForCommon | undefined {
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
