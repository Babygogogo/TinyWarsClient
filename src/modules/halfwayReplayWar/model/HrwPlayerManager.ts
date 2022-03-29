
// import TwnsBwPlayerManager from "../../baseWar/model/BwPlayerManager";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace TwnsHrwPlayerManager {
    import ClientErrorCode = TwnsClientErrorCode.ClientErrorCode;

    export class HrwPlayerManager extends TwnsBwPlayerManager.BwPlayerManager {
        private _watcherTeamIndexes?    : Set<number>;

        public initWatcherTeamIndexes(warData: CommonProto.WarSerialization.ISerialWar): void {
            const teamIndexes = new Set<number>();
            for (const data of warData.executedActionManager?.halfwayReplayActionArray ?? []) {
                teamIndexes.add(Helpers.getExisted(data.teamIndex, ClientErrorCode.HrwPlayerManager_InitWatcherTeamIndexes_00));
            }
            this._watcherTeamIndexes = teamIndexes;
        }
        public getAliveWatcherTeamIndexesForSelf(): Set<number> {
            return Helpers.getExisted(this._watcherTeamIndexes, ClientErrorCode.HrwPlayerManager_GetAliveWatcherTeamIndexesForSelf_00);
        }
    }
}

// export default TwnsHrwPlayerManager;
