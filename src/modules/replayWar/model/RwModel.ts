
import { RwWar }                        from "./RwWar";
import Logger                       from "../../tools/helpers/Logger";
import Notify                       from "../../tools/notify/Notify";
import TwnsNotifyType               from "../../tools/notify/NotifyType";
import Helpers                      from "../../tools/helpers/Helpers";
import ProtoTypes                   from "../../tools/proto/ProtoTypes";
import ProtoManager                 from "../../tools/proto/ProtoManager";
import WarCommonHelpers             from "../../tools/warHelpers/WarCommonHelpers";
import WarMapModel                  from "../../warMap/model/WarMapModel";

namespace RwModel {
    import NotifyType       = TwnsNotifyType.NotifyType;
    import IReplayInfo      = ProtoTypes.Replay.IReplayInfo;

    let _replayInfoList     : IReplayInfo[];
    let _replayData         : ProtoTypes.NetMessage.MsgReplayGetData.IS;
    let _previewingReplayId : number;
    let _war                : RwWar;

    export function init(): void {
        // nothing to do
    }

    export function setReplayInfoList(infoList: IReplayInfo[]): void {
        _replayInfoList = infoList;
    }
    export function getReplayInfoList(): IReplayInfo[] | undefined {
        return _replayInfoList;
    }
    export function getReplayInfo(replayId: number): IReplayInfo | undefined {
        const replayInfoArray = getReplayInfoList();
        return replayInfoArray ? replayInfoArray.find(v => v.replayBriefInfo.replayId === replayId) : undefined;
    }

    export function setReplayData(data: ProtoTypes.NetMessage.MsgReplayGetData.IS): void {
        _replayData = data;
    }
    export function getReplayData(): ProtoTypes.NetMessage.MsgReplayGetData.IS | undefined {
        return _replayData;
    }

    export function setPreviewingReplayId(replayId: number): void {
        if (getPreviewingReplayId() != replayId) {
            _previewingReplayId = replayId;
            Notify.dispatch(NotifyType.RwPreviewingReplayIdChanged);
        }
    }
    export function getPreviewingReplayId(): number | null | undefined {
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
        const mapRawData                = await WarMapModel.getRawData(WarCommonHelpers.getMapId(warData));
        const unitDataArray             = mapRawData.unitDataArray || [];
        const field                     = warData.field;
        warData.seedRandomCurrentState  = Helpers.deepClone(warData.seedRandomInitialState);
        field.tileMap                   = { tiles: mapRawData.tileDataArray };
        field.unitMap                   = {
            units       : unitDataArray,
            nextUnitId  : unitDataArray.length,
        };

        const war       = new RwWar();
        const initError = await war.init(warData);
        if (initError) {
            Logger.error(`RwModel.loadWar() initError: ${initError}`);
            return undefined;
        }

        war.startRunning().startRunningView();
        war.setReplayId(replayId);
        _war = war;
        return _war;
    }

    export function unloadWar(): void {
        if (_war) {
            _war.stopRunning();
            _war = undefined;
        }
    }

    export function getWar(): RwWar | undefined {
        return _war;
    }
}

export default RwModel;
