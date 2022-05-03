
// import TwnsBwPlayerManager from "../../baseWar/model/BwPlayerManager";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.HalfwayReplayWar {
    import ClientErrorCode = TwnsClientErrorCode.ClientErrorCode;

    export class HrwPlayerManager extends Twns.BaseWar.BwPlayerManager {
        private _watcherTeamIndexes?    : Set<number>;

        public initWatcherTeamIndexes(warData: CommonProto.WarSerialization.ISerialWar): void {
            const teamIndexes = new Set<number>();
            for (const data of warData.executedActionManager?.halfwayReplayActionArray ?? []) {
                teamIndexes.add(Twns.Helpers.getExisted(data.teamIndex, ClientErrorCode.HrwPlayerManager_InitWatcherTeamIndexes_00));
            }
            this._watcherTeamIndexes = teamIndexes;
        }
        public getWatcherTeamIndexesForSelf(): Set<number> {
            return Twns.Helpers.getExisted(this._watcherTeamIndexes, ClientErrorCode.HrwPlayerManager_GetAliveWatcherTeamIndexesForSelf_00);
        }
    }
}

// export default TwnsHrwPlayerManager;
