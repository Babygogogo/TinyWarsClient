
import TwnsClientErrorCode              from "../../tools/helpers/ClientErrorCode";
import BwWarEventManager = TwnsBwWarEventManager.BwWarEventManager;import TwnsBwWarEventManager            from "../../baseWar/model/BwWarEventManager";
import Helpers                      from "../../tools/helpers/Helpers";
import ProtoTypes                   from "../../tools/proto/ProtoTypes";
import ISerialWarEventManager           = ProtoTypes.WarSerialization.ISerialWarEventManager;
import IWarEventFullData                = ProtoTypes.Map.IWarEventFullData;
import ClientErrorCode = TwnsClientErrorCode.ClientErrorCode;

export class MeWarEventManager extends BwWarEventManager {
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
