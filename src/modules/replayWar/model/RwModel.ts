
// import Helpers              from "../../tools/helpers/Helpers";
// import Logger               from "../../tools/helpers/Logger";
// import Notify               from "../../tools/notify/Notify";
// import Twns.Notify       from "../../tools/notify/NotifyType";
// import ProtoManager         from "../../tools/proto/ProtoManager";
// import ProtoTypes           from "../../tools/proto/ProtoTypes";
// import WarCommonHelpers     from "../../tools/warHelpers/WarCommonHelpers";
// import WarMapModel          from "../../warMap/model/WarMapModel";
// import TwnsRwWar            from "./RwWar";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.ReplayWar.RwModel {
    import NetMessage           = CommonProto.NetMessage;
    import IReplayInfo          = CommonProto.Replay.IReplayInfo;
    import ISerialWar           = CommonProto.WarSerialization.ISerialWar;
    import MsgReplayGetDataIs   = NetMessage.MsgReplayGetData.IS;
    import NotifyType           = Twns.Notify.NotifyType;
    import RwWar                = Twns.ReplayWar.RwWar;

    let _replayIdArray          : number[] | null = null;
    let _previewingReplayId     : number | null = null;
    let _war                    : RwWar | null = null;
    const _replayInfoAccessor   = Twns.Helpers.createCachedDataAccessor<number, IReplayInfo>({
        reqData: (replayId: number) => Twns.ReplayWar.RwProxy.reqReplayGetReplayInfo(replayId),
    });
    const _replaySelfRatingAccessor = Twns.Helpers.createCachedDataAccessor<number, number>({
        reqData: (replayId: number) => Twns.ReplayWar.RwProxy.reqReplayGetSelfRating(replayId),
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

    export function getReplayInfo(replayId: number): Promise<IReplayInfo | null> {
        return _replayInfoAccessor.getData(replayId);
    }
    export function setReplayInfo(replayId: number, replayInfo: IReplayInfo | null): void {
        _replayInfoAccessor.setData(replayId, replayInfo);
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
            Twns.Notify.dispatch(NotifyType.RwPreviewingReplayIdChanged);
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
            Twns.Logger.warn(`RwModel.loadWar() another war has been loaded already!`);
            unloadWar();
        }

        const mapId = Twns.WarHelpers.WarCommonHelpers.getMapId(warData);
        if (mapId != null) {
            const mapRawData                = Twns.Helpers.getExisted(await Twns.WarMap.WarMapModel.getRawData(mapId));
            const unitDataArray             = mapRawData.unitDataArray || [];
            const field                     = Twns.Helpers.getExisted(warData.field);
            warData.seedRandomCurrentState  = Twns.Helpers.deepClone(warData.seedRandomInitialState);
            field.tileMap                   = { tiles: mapRawData.tileDataArray };
            field.unitMap                   = {
                units       : unitDataArray,
                nextUnitId  : unitDataArray.length,
            };
        }
        {
            const settingsForMfw = warData.settingsForMfw;
            if (settingsForMfw) {
                const initialWarData            = Twns.Helpers.getExisted(settingsForMfw.initialWarData);
                const seedRandomInitialState    = initialWarData.seedRandomInitialState;
                warData.remainingVotesForDraw   = Twns.Helpers.deepClone(initialWarData.remainingVotesForDraw);
                warData.weatherManager          = Twns.Helpers.deepClone(initialWarData.weatherManager);
                warData.warEventManager         = Twns.Helpers.deepClone(initialWarData.warEventManager);
                warData.playerManager           = Twns.Helpers.deepClone(initialWarData.playerManager);
                warData.turnManager             = Twns.Helpers.deepClone(initialWarData.turnManager);
                warData.field                   = Twns.Helpers.deepClone(initialWarData.field);
                warData.seedRandomInitialState  = Twns.Helpers.deepClone(seedRandomInitialState);
                warData.seedRandomCurrentState  = Twns.Helpers.deepClone(seedRandomInitialState);
            }
        }

        const war = new RwWar();
        war.init(warData, await Twns.Config.ConfigManager.getGameConfig(Twns.Helpers.getExisted(warData.settingsForCommon?.configVersion)));
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
    const _replayDataGetter = Twns.Helpers.createCachedDataAccessor<number, ISerialWar>({
        reqData : (replayId: number) => Twns.ReplayWar.RwProxy.reqReplayGetData(replayId),
    });

    export function getReplayData(replayId: number): Promise<ISerialWar | null> {
        return _replayDataGetter.getData(replayId);
    }

    export function updateOnMsgReplayGetData(data: MsgReplayGetDataIs): void {
        const encodedWar = data.encodedWar;
        _replayDataGetter.setData(Twns.Helpers.getExisted(data.replayId), encodedWar ? Twns.ProtoManager.decodeAsSerialWar(encodedWar) : null);
    }
}

// export default RwModel;
