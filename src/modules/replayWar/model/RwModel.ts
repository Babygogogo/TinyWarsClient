
// import Helpers              from "../../tools/helpers/Helpers";
// import Logger               from "../../tools/helpers/Logger";
// import Notify               from "../../tools/notify/Notify";
// import TwnsNotifyType       from "../../tools/notify/NotifyType";
// import ProtoManager         from "../../tools/proto/ProtoManager";
// import ProtoTypes           from "../../tools/proto/ProtoTypes";
// import WarCommonHelpers     from "../../tools/warHelpers/WarCommonHelpers";
// import WarMapModel          from "../../warMap/model/WarMapModel";
// import TwnsRwWar            from "./RwWar";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace RwModel {
    import NetMessage           = ProtoTypes.NetMessage;
    import IReplayBriefInfo     = ProtoTypes.Replay.IReplayBriefInfo;
    import ISerialWar           = ProtoTypes.WarSerialization.ISerialWar;
    import MsgReplayGetDataIs   = NetMessage.MsgReplayGetData.IS;
    import NotifyType           = TwnsNotifyType.NotifyType;
    import RwWar                = TwnsRwWar.RwWar;

    let _replayIdArray              : number[] | null = null;
    let _previewingReplayId         : number | null = null;
    let _war                        : RwWar | null = null;
    const _replayBriefInfoAccessor  = Helpers.createCachedDataAccessor<number, IReplayBriefInfo>({
        reqData: (replayId: number) => RwProxy.reqReplayGetBriefInfo(replayId),
    });
    const _replaySelfRatingAccessor = Helpers.createCachedDataAccessor<number, number>({
        reqData: (replayId: number) => RwProxy.reqReplayGetSelfRating(replayId),
    });

    export function init(): void {
        // nothing to do
    }

    export function setReplayIdArray(replayIdArray: number[]): void {
        _replayIdArray = replayIdArray;
    }
    export function getReplayIdArray(): number[] | null {
        return _replayIdArray;
    }

    export function getReplayBriefInfo(replayId: number): Promise<IReplayBriefInfo | null> {
        return _replayBriefInfoAccessor.getData(replayId);
    }
    export function setReplayBriefInfo(replayId: number, replayInfo: IReplayBriefInfo | null): void {
        _replayBriefInfoAccessor.setData(replayId, replayInfo);
    }

    export function getReplaySelfRating(replayId: number): Promise<number | null> {
        return _replaySelfRatingAccessor.getData(replayId);
    }
    export function setReplaySelfRating(replayId: number, rating: number | null): void {
        _replaySelfRatingAccessor.setData(replayId, rating);
    }

    export function setPreviewingReplayId(replayId: number | null): void {
        if (getPreviewingReplayId() != replayId) {
            _previewingReplayId = replayId;
            Notify.dispatch(NotifyType.RwPreviewingReplayIdChanged);
        }
    }
    export function getPreviewingReplayId(): number | null {
        return _previewingReplayId;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for managing war.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    export async function loadWar(warData: ISerialWar, replayId: number): Promise<RwWar> {
        if (_war) {
            Logger.warn(`RwModel.loadWar() another war has been loaded already!`);
            unloadWar();
        }

        const mapId = WarCommonHelpers.getMapId(warData);
        if (mapId != null) {
            const mapRawData                = Helpers.getExisted(await WarMapModel.getRawData(mapId));
            const unitDataArray             = mapRawData.unitDataArray || [];
            const field                     = Helpers.getExisted(warData.field);
            warData.seedRandomCurrentState  = Helpers.deepClone(warData.seedRandomInitialState);
            field.tileMap                   = { tiles: mapRawData.tileDataArray };
            field.unitMap                   = {
                units       : unitDataArray,
                nextUnitId  : unitDataArray.length,
            };
        }
        {
            const settingsForMfw = warData.settingsForMfw;
            if (settingsForMfw) {
                const initialWarData            = Helpers.getExisted(settingsForMfw.initialWarData);
                const seedRandomInitialState    = initialWarData.seedRandomInitialState;
                warData.remainingVotesForDraw   = Helpers.deepClone(initialWarData.remainingVotesForDraw);
                warData.weatherManager          = Helpers.deepClone(initialWarData.weatherManager);
                warData.warEventManager         = Helpers.deepClone(initialWarData.warEventManager);
                warData.playerManager           = Helpers.deepClone(initialWarData.playerManager);
                warData.turnManager             = Helpers.deepClone(initialWarData.turnManager);
                warData.field                   = Helpers.deepClone(initialWarData.field);
                warData.seedRandomInitialState  = Helpers.deepClone(seedRandomInitialState);
                warData.seedRandomCurrentState  = Helpers.deepClone(seedRandomInitialState);
            }
        }

        const war = new RwWar();
        await war.init(warData);
        war.startRunning().startRunningView();
        war.setReplayId(replayId);
        _war = war;
        return _war;
    }

    export function unloadWar(): void {
        if (_war) {
            _war.stopRunning();
            _war = null;
        }
    }

    export function getWar(): RwWar | null {
        return _war;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for replay data.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    const _replayDataGetter = Helpers.createCachedDataAccessor<number, ISerialWar>({
        reqData : (replayId: number) => RwProxy.reqReplayGetData(replayId),
    });

    export function getReplayData(replayId: number): Promise<ISerialWar | null> {
        return _replayDataGetter.getData(replayId);
    }

    export function updateOnMsgReplayGetData(data: MsgReplayGetDataIs): void {
        const encodedWar = data.encodedWar;
        _replayDataGetter.setData(Helpers.getExisted(data.replayId), encodedWar ? ProtoManager.decodeAsSerialWar(encodedWar) : null);
    }
}

// export default RwModel;
