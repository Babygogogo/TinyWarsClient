
// import TwnsBwCommonSettingManager   from "../../baseWar/model/BwCommonSettingManager";
// import TwnsClientErrorCode          from "../../tools/helpers/ClientErrorCode";
// import ConfigManager                from "../../tools/helpers/ConfigManager";
// import Helpers                      from "../../tools/helpers/Helpers";
// import ProtoTypes                   from "../../tools/proto/ProtoTypes";
// import TwnsMeWar                    from "./MeWar";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.MapEditor {
    import MeWar                = MapEditor.MeWar;
    import ISettingsForCommon   = CommonProto.WarSettings.ISettingsForCommon;

    export class MeCommonSettingManager extends BaseWar.BwCommonSettingManager {
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

// export default TwnsMeCommonSettingManager;
