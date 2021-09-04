
import TwnsClientErrorCode          from "../../tools/helpers/ClientErrorCode";
import TwnsBwWar                    from "../../baseWar/model/BwWar";
import Logger                       from "../../tools/helpers/Logger";
import ProtoTypes                   from "../../tools/proto/ProtoTypes";
import WarCommonHelpers             from "../../tools/warHelpers/WarCommonHelpers";
import Helpers                      from "../../tools/helpers/Helpers";

namespace TwnsBwDrawVoteManager {
    import ISerialPlayerManager = ProtoTypes.WarSerialization.ISerialPlayerManager;
    import ClientErrorCode      = TwnsClientErrorCode.ClientErrorCode;
    import BwWar                = TwnsBwWar.BwWar;

    export class BwDrawVoteManager {
        private _remainingVotes?    : number | null;
        private _war?               : BwWar;

        public init(playerManagerData: ISerialPlayerManager | null | undefined, remainingVotes: number | null | undefined): ClientErrorCode {
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
                    return ClientErrorCode.BwDrawVoteManagerInit00;
                }
            }

            return ClientErrorCode.NoError;
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

        public getMaxVotes(): number | undefined {
            const war = this._getWar();
            if (war == null) {
                Logger.log(`BwDrawVoteManager.getMaxVotes() empty war.`);
                return undefined;
            }

            let maxVotes = 0;
            war.getPlayerManager().forEachPlayer(false, player => {
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
        private _getWar(): BwWar | null | undefined {
            return this._war;
        }
    }
}

export default TwnsBwDrawVoteManager;
