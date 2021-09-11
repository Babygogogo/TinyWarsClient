
import TwnsBwWar            from "../../baseWar/model/BwWar";
import TwnsClientErrorCode  from "../../tools/helpers/ClientErrorCode";
import CompatibilityHelpers from "../../tools/helpers/CompatibilityHelpers";
import Helpers              from "../../tools/helpers/Helpers";
import Types                from "../../tools/helpers/Types";
import ProtoTypes           from "../../tools/proto/ProtoTypes";
import WarCommonHelpers     from "../../tools/warHelpers/WarCommonHelpers";

namespace TwnsBwDrawVoteManager {
    import ISerialPlayerManager = ProtoTypes.WarSerialization.ISerialPlayerManager;
    import ClientErrorCode      = TwnsClientErrorCode.ClientErrorCode;
    import BwWar                = TwnsBwWar.BwWar;

    export class BwDrawVoteManager {
        private _remainingVotes?    : number | null;
        private _war?               : BwWar;

        public init(playerManagerData: Types.Undefinable<ISerialPlayerManager>, remainingVotes: Types.Undefinable<number>): void {
            if (remainingVotes == null) {
                this.setRemainingVotes(null);
            } else {
                let maxVotes = 0;
                for (const playerData of playerManagerData ? playerManagerData.players || [] : []) {
                    if (WarCommonHelpers.checkCanVoteForDraw({
                        playerIndex : Helpers.getExisted(playerData.playerIndex),
                        aliveState  : Helpers.getExisted(playerData.aliveState),
                    })) {
                        ++maxVotes;
                    }
                }
                if (remainingVotes >= maxVotes) {
                    throw CompatibilityHelpers.newError(`remainingVotes >= maxVotes.`, ClientErrorCode.BwDrawVoteManager_Init_00);
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
            return Helpers.getDefined(this._remainingVotes);
        }

        public getMaxVotes(): number {
            let maxVotes = 0;
            this._getWar().getPlayerManager().forEachPlayer(false, player => {
                if (player.checkCanVoteForDraw()) {
                    ++maxVotes;
                }
            });

            return maxVotes;
        }

        public checkIsDraw(): boolean {
            return this.getRemainingVotes() === 0;
        }

        private _setWar(war: BwWar): void {
            this._war = war;
        }
        private _getWar(): BwWar {
            return Helpers.getExisted(this._war);
        }
    }
}

export default TwnsBwDrawVoteManager;
