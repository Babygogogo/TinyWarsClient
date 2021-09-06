
import ProtoTypes   from "../../tools/proto/ProtoTypes";

namespace SpmSrwRankModel {
    import NetMessage   = ProtoTypes.NetMessage;

    type SrwRankInfo    = NetMessage.MsgSpmGetSrwRankInfo.ISrwRankInfoForRule;

    const _rankInfoDict = new Map<number, SrwRankInfo[]>();

    export function getRankInfo(mapId: number): SrwRankInfo[] | null {
        return _rankInfoDict.get(mapId) ?? null;
    }

    export function updateOnMsgSpmGetSrwRankInfo(data: ProtoTypes.NetMessage.MsgSpmGetSrwRankInfo.IS): void {
        const mapId = data.mapId;
        if (mapId == null) {
            throw new Error(`Empty mapId.`);
        }

        _rankInfoDict.set(mapId, data.infoArray || []);
    }
}

export default SpmSrwRankModel;
