
// import TwnsBwWar            from "../../baseWar/model/BwWar";
// import TwnsClientErrorCode  from "../../tools/helpers/ClientErrorCode";
// import Helpers              from "../../tools/helpers/Helpers";
// import Types                from "../../tools/helpers/Types";
// import ProtoTypes           from "../../tools/proto/ProtoTypes";
// import WarCommonHelpers     from "../../tools/warHelpers/WarCommonHelpers";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.BaseWar {
    import ISerialPlayerManager = CommonProto.WarSerialization.ISerialPlayerManager;
    import ClientErrorCode      = Twns.ClientErrorCode;
    import BwWar                = Twns.BaseWar.BwWar;

    export class BwDrawVoteManager {
        private _remainingVotes?    : number | null;
        private _war?               : BwWar;

        public init(playerManagerData: Twns.Types.Undefinable<ISerialPlayerManager>, remainingVotes: Twns.Types.Undefinable<number>): void {
            if (remainingVotes == null) {
                this.setRemainingVotes(null);
            } else {
                const maxVotes = playerManagerData?.players?.length ?? 0;
                if (remainingVotes >= maxVotes) {
                    throw Twns.Helpers.newError(`remainingVotes >= maxVotes.`, ClientErrorCode.BwDrawVoteManager_Init_00);
                }
                this.setRemainingVotes(remainingVotes);
            }
        }

        public startRunning(war: BwWar): void {
            this._setWar(war);
        }

        public setRemainingVotes(votes: number | null): void {
            this._remainingVotes = votes;
        }
        public getRemainingVotes(): number | null {
            return Twns.Helpers.getDefined(this._remainingVotes, ClientErrorCode.BwDrawVoteManager_GetRemainingVotes_00);
        }

        public getMaxVotes(): number {
            return this._getWar().getPlayerManager().getTotalPlayersCount(true);
        }

        public checkIsDraw(): boolean {
            return this.getRemainingVotes() === 0;
        }

        private _setWar(war: BwWar): void {
            this._war = war;
        }
        private _getWar(): BwWar {
            return Twns.Helpers.getExisted(this._war);
        }
    }
}

// export default TwnsBwDrawVoteManager;
