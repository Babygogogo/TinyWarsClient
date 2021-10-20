
// import Helpers      from "../../tools/helpers/Helpers";
// import ProtoTypes   from "../../tools/proto/ProtoTypes";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace SpmSrwRankModel {
    import ClientErrorCode  = TwnsClientErrorCode.ClientErrorCode;
    import NetMessage       = ProtoTypes.NetMessage;

    type SrwRankInfo    = NetMessage.MsgSpmGetSrwRankInfo.ISrwRankInfoForRule;

    const _rankInfoDict = new Map<number, SrwRankInfo[]>();

    export function getRankInfo(mapId: number): SrwRankInfo[] | null {
        return _rankInfoDict.get(mapId) ?? null;
    }

    export function updateOnMsgSpmGetSrwRankInfo(data: ProtoTypes.NetMessage.MsgSpmGetSrwRankInfo.IS): void {
        const mapId = Helpers.getExisted(data.mapId, ClientErrorCode.SpmSrwRankModel_UpdateOnMsgSpmGetSrwRankInfo_00);
        _rankInfoDict.set(mapId, data.infoArray || []);
    }
}

// export default SpmSrwRankModel;
