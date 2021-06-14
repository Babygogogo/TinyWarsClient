
namespace TinyWars.MapEditor {
    import ProtoTypes               = Utility.ProtoTypes;
    import ClientErrorCode          = Utility.ClientErrorCode;
    import Helpers                  = Utility.Helpers;
    import ISerialWarEventManager   = ProtoTypes.WarSerialization.ISerialWarEventManager;
    import IWarEventFullData        = ProtoTypes.Map.IWarEventFullData;

    export class MeWarEventManager extends BaseWar.BwWarEventManager {
        public init(data: ISerialWarEventManager): ClientErrorCode {
            this._setWarEventFullData(getRevisedWarEventFullData(data.warEventFullData));
            this._setCalledCountList(null);

            return ClientErrorCode.NoError;
        }
    }

    function getRevisedWarEventFullData(rawData: IWarEventFullData): IWarEventFullData {
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
