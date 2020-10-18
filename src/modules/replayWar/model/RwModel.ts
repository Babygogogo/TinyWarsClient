
namespace TinyWars.ReplayWar.RwModel {
    import Logger       = Utility.Logger;
    import ProtoManager = Utility.ProtoManager;
    import ProtoTypes   = Utility.ProtoTypes;
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
    export async function loadWar(encodedWarData: Uint8Array): Promise<RwWar> {
        if (_war) {
            Logger.warn(`ReplayModel.loadWar() another war has been loaded already!`);
            unloadWar();
        }

        const warData       = ProtoManager.decodeAsSerialWar(encodedWarData);
        const mapRawData    = await WarMapModel.getRawData(warData.settingsForCommon.mapId);
        const unitDataList  = mapRawData.unitDataList || [];
        const field         = warData.field;
        field.tileMap       = { tiles: mapRawData.tileDataList };
        field.unitMap       = {
            units       : unitDataList,
            nextUnitId  : unitDataList.length,
        };

        _war = (await new RwWar().init(warData)).startRunning().startRunningView() as RwWar;
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
