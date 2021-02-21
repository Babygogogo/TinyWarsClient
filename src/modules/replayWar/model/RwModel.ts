
namespace TinyWars.ReplayWar.RwModel {
    import Logger       = Utility.Logger;
    import ProtoManager = Utility.ProtoManager;
    import ProtoTypes   = Utility.ProtoTypes;
    import BwHelpers    = BaseWar.BwHelpers;
    import WarMapModel  = WarMap.WarMapModel;
    import IReplayInfo  = ProtoTypes.Replay.IReplayInfo;

    let _replayInfoList : IReplayInfo[];
    let _replayData     : ProtoTypes.NetMessage.MsgReplayGetData.IS;
    let _war            : RwWar;

    export function init(): void {
    }

    export function setReplayInfoList(infoList: IReplayInfo[]): void {
        _replayInfoList = infoList;
    }
    export function getReplayInfoList(): IReplayInfo[] | undefined {
        return _replayInfoList;
    }

    export function setReplayData(data: ProtoTypes.NetMessage.MsgReplayGetData.IS): void {
        _replayData = data;
    }
    export function getReplayData(): ProtoTypes.NetMessage.MsgReplayGetData.IS | undefined {
        return _replayData;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for managing war.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    export async function loadWar(encodedWarData: Uint8Array, replayId: number): Promise<RwWar> {
        if (_war) {
            Logger.warn(`ReplayModel.loadWar() another war has been loaded already!`);
            unloadWar();
        }

        const warData       = ProtoManager.decodeAsSerialWar(encodedWarData);
        const mapRawData    = await WarMapModel.getRawData(BwHelpers.getMapId(warData));
        const unitDataArray = mapRawData.unitDataArray || [];
        const field         = warData.field;
        field.tileMap       = { tiles: mapRawData.tileDataArray };
        field.unitMap       = {
            units       : unitDataArray,
            nextUnitId  : unitDataArray.length,
        };

        _war = (await new RwWar().init(warData)).startRunning().startRunningView() as RwWar;
        _war.setReplayId(replayId);
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
