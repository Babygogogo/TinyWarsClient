
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
    import IWarEventFullData    = CommonProto.Map.IWarEventFullData;
    import GameConfig           = Config.GameConfig;

    export class MeCommonSettingManager extends BaseWar.BwCommonSettingManager {
        // 在地图编辑器里，玩家数量固定为最大值（为了方便处理某些编辑逻辑），因此warRule实际上是不正确的，因此要重写init函数，去除父类中对warRule的合法性检查，否则地图会无法加载
        public init({ settings, warType, mapSize, gameConfig, playersCountUnneutral }: {
            settings                : ISettingsForCommon;
            warType                 : Types.WarType;
            mapSize                 : Types.MapSize;
            gameConfig              : GameConfig;
            playersCountUnneutral   : number;
        }): void {
            const configVersion = settings.configVersion;
            if ((configVersion == null) || (configVersion !== gameConfig.getVersion())) {
                throw Helpers.newError(`Invalid configVersion: ${configVersion}`, ClientErrorCode.MeCommonSettingManager_Init_00);
            }

            const instanceWarRule = settings.instanceWarRule;
            if (instanceWarRule == null) {
                throw Helpers.newError(`Invalid configVersion: ${configVersion}`, ClientErrorCode.MeCommonSettingManager_Init_00);
            }

            instanceWarRule.warEventFullData = getRevisedWarEventFullData(instanceWarRule.warEventFullData);
            this._setSettingsForCommon(settings);
        }

        public serializeForCreateSfw(): ISettingsForCommon {
            const war               = this._getWar() as MeWar;
            const templateWarRule   = war.getRevisedTemplateWarRuleArray(war.getField().getMaxPlayerIndex())[0];
            const settingsForCommon = war.getCommonSettingManager().getSettingsForCommon();
            return {
                configVersion   : settingsForCommon.configVersion,
                instanceWarRule : WarHelpers.WarRuleHelpers.createInstanceWarRule(templateWarRule, settingsForCommon.instanceWarRule?.warEventFullData),
            };
        }
    }

    function getRevisedWarEventFullData(rawData: Types.Undefinable<IWarEventFullData>): IWarEventFullData {
        const data = rawData
            ? Helpers.deepClone(rawData)
            : {
                actionArray         : [],
                conditionArray      : [],
                conditionNodeArray  : [],
                eventArray          : [],
            };

        if (data.actionArray == null) {
            data.actionArray = [];
        }
        if (data.conditionArray == null) {
            data.conditionArray = [];
        }
        if (data.conditionNodeArray == null) {
            data.conditionNodeArray = [];
        }
        if (data.eventArray == null) {
            data.eventArray = [];
        }

        for (const node of data.conditionNodeArray) {
            if (node.subNodeIdArray == null) {
                node.subNodeIdArray = [];
            }
            if (node.conditionIdArray == null) {
                node.conditionIdArray = [];
            }
        }
        for (const event of data.eventArray) {
            if (event.actionIdArray == null) {
                event.actionIdArray = [];
            }
            if (event.eventNameArray == null) {
                event.eventNameArray = [];
            }
        }

        return data;
    }
}

// export default TwnsMeCommonSettingManager;
