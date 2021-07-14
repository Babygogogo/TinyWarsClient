
import ProtoTypes           from "../../tools/proto/ProtoTypes";

export namespace SpmSrwRankModel {
    import NetMessage   = ProtoTypes.NetMessage;

    type SrwRankInfo    = NetMessage.MsgSpmGetSrwRankInfo.ISrwRankInfoForRule;

    const _rankInfoDict = new Map<number, SrwRankInfo[]>();

    export function getRankInfo(mapId: number): SrwRankInfo[] | undefined | null {
        return _rankInfoDict.get(mapId);
    }

    export function updateOnMsgSpmGetSrwRankInfo(data: ProtoTypes.NetMessage.MsgSpmGetSrwRankInfo.IS): void {
        _rankInfoDict.set(data.mapId, data.infoArray || []);
    }
}
