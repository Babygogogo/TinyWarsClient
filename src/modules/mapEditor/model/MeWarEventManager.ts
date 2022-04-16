
// import TwnsBwWarEventManager    from "../../baseWar/model/BwWarEventManager";
// import Helpers                  from "../../tools/helpers/Helpers";
// import Types                    from "../../tools/helpers/Types";
// import ProtoTypes               from "../../tools/proto/ProtoTypes";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace TwnsMeWarEventManager {
    import BwWarEventManager        = Twns.BaseWar.BwWarEventManager;
    import ISerialWarEventManager   = CommonProto.WarSerialization.ISerialWarEventManager;
    import IWarEventFullData        = CommonProto.Map.IWarEventFullData;

    export class MeWarEventManager extends BwWarEventManager {
        public init(data: ISerialWarEventManager): void {
            this._setWarEventFullData(getRevisedWarEventFullData(data.warEventFullData));
            this._setCalledCountList(null);
            this._setCustomCounterArray(null);
            this._setOngoingPersistentActionIdSet(new Set());
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

// export default TwnsMeWarEventManager;
