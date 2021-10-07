
import CompatibilityHelpers from "../../tools/helpers/CompatibilityHelpers";
import Helpers              from "../../tools/helpers/Helpers";
import Logger               from "../../tools/helpers/Logger";
import Notify               from "../../tools/notify/Notify";
import TwnsNotifyType       from "../../tools/notify/NotifyType";
import ProtoManager         from "../../tools/proto/ProtoManager";
import ProtoTypes           from "../../tools/proto/ProtoTypes";
import WarCommonHelpers     from "../../tools/warHelpers/WarCommonHelpers";
import WarMapModel          from "../../warMap/model/WarMapModel";
import TwnsRwWar            from "./RwWar";

namespace RwModel {
    import NotifyType       = TwnsNotifyType.NotifyType;
    import IReplayInfo      = ProtoTypes.Replay.IReplayInfo;
    import RwWar            = TwnsRwWar.RwWar;

    let _replayInfoList     : IReplayInfo[] | null = null;
    let _replayData         : ProtoTypes.NetMessage.MsgReplayGetData.IS | null = null;
    let _previewingReplayId : number | null = null;
    let _war                : RwWar | null = null;

    export function init(): void {
        // nothing to do
    }

    export function setReplayInfoList(infoList: IReplayInfo[]): void {
        _replayInfoList = infoList;
    }
    export function getReplayInfoList(): IReplayInfo[] | null {
        return _replayInfoList;
    }
    export function getReplayInfo(replayId: number): IReplayInfo | null {
        const replayInfoArray = getReplayInfoList();
        return replayInfoArray ? replayInfoArray.find(v => v.replayBriefInfo?.replayId === replayId) ?? null : null;
    }

    export function setReplayData(data: ProtoTypes.NetMessage.MsgReplayGetData.IS): void {
        _replayData = data;
    }
    export function getReplayData(): ProtoTypes.NetMessage.MsgReplayGetData.IS | null {
        return _replayData;
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
    export async function loadWar(encodedWarData: Uint8Array, replayId: number): Promise<RwWar> {
        if (_war) {
            Logger.warn(`RwModel.loadWar() another war has been loaded already!`);
            unloadWar();
        }

        const warData                   = ProtoManager.decodeAsSerialWar(encodedWarData);
        const mapRawData                = Helpers.getExisted(await WarMapModel.getRawData(Helpers.getExisted(WarCommonHelpers.getMapId(warData))));
        const unitDataArray             = mapRawData.unitDataArray || [];
        const field                     = Helpers.getExisted(warData.field);
        warData.seedRandomCurrentState  = Helpers.deepClone(warData.seedRandomInitialState);
        field.tileMap                   = { tiles: mapRawData.tileDataArray };
        field.unitMap                   = {
            units       : unitDataArray,
            nextUnitId  : unitDataArray.length,
        };

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
}

export default RwModel;
