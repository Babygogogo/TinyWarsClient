
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
    import GameConfig           = Config.GameConfig;
    import ClientErrorCode      = TwnsClientErrorCode.ClientErrorCode;

    export class MeCommonSettingManager extends BaseWar.BwCommonSettingManager {
        // 在地图编辑器里，玩家数量固定为最大值（为了方便处理某些编辑逻辑），因此warRule实际上是不正确的，因此要重写init函数，去除父类中对warRule的合法性检查，否则地图会无法加载
        public init({ settings, allWarEventIdArray, playersCountUnneutral, gameConfig }: {
            settings                : ISettingsForCommon;
            allWarEventIdArray      : number[];
            playersCountUnneutral   : number;
            gameConfig              : GameConfig;
        }): void {
            const configVersion = settings.configVersion;
            if ((configVersion == null) || (configVersion !== gameConfig.getVersion())) {
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

// export default TwnsMeCommonSettingManager;
