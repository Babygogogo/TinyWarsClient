
// import TwnsBwPlayerManager from "../../baseWar/model/BwPlayerManager";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace TwnsHrwPlayerManager {
    import ClientErrorCode = TwnsClientErrorCode.ClientErrorCode;

    export class HrwPlayerManager extends TwnsBwPlayerManager.BwPlayerManager {
        private _watcherTeamIndexes?    : Set<number>;

        public initWatcherTeamIndexes(warData: ProtoTypes.WarSerialization.ISerialWar): void {
            const teamIndexes = new Set<number>();
            for (const a of warData.halfwayReplayActionArray ?? []) {
                teamIndexes.add(Helpers.getExisted(a.teamIndex, ClientErrorCode.HrwPlayerManager_InitWatcherTeamIndexes_00));
            }
            this._watcherTeamIndexes = teamIndexes;
        }
        public getAliveWatcherTeamIndexesForSelf(): Set<number> {
            return Helpers.getExisted(this._watcherTeamIndexes, ClientErrorCode.HrwPlayerManager_GetAliveWatcherTeamIndexesForSelf_00);
        }
    }
}

// export default TwnsHrwPlayerManager;
