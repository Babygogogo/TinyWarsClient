
namespace TinyWars.MapEditor {
    import Types                = Utility.Types;
    import ProtoTypes           = Utility.ProtoTypes;
    import WarSerialization     = ProtoTypes.WarSerialization;
    import ISerialPlayerManager = WarSerialization.ISerialPlayerManager;
    import ISerialPlayer        = WarSerialization.ISerialPlayer;

    export class MePlayerManager extends BaseWar.BwPlayerManager {
        public serializeForSimulation(): ISerialPlayerManager {
            const maxPlayerIndex    = (this._getWar().getField() as MeField).getMaxPlayerIndex();
            const selfUserId        = User.UserModel.getSelfUserId();
            const players           : ISerialPlayer[] = [];
            for (let playerIndex = 0; playerIndex <= maxPlayerIndex; ++playerIndex) {
                players.push({
                    fund                        : 0,
                    hasVotedForDraw             : false,
                    aliveState                  : Types.PlayerAliveState.Alive,
                    playerIndex,
                    teamIndex                   : playerIndex,
                    userId                      : playerIndex > 0 ? selfUserId : null,
                    coId                        : 0,
                    coCurrentEnergy             : null,
                    coUsingSkillType            : Types.CoSkillType.Passive,
                    coIsDestroyedInTurn         : false,
                    watchRequestSrcUserIdArray  : [],
                    watchOngoingSrcUserIdArray  : [],
                    restTimeToBoot              : 0,
                    unitAndTileSkinId           : playerIndex,
                });
            }

            return {
                players,
            };
        }

        protected _getPlayerClass(): new () => BaseWar.BwPlayer {
            return MePlayer;
        }

        ////////////////////////////////////////////////////////////////////////////////
        // The other public functions.
        ////////////////////////////////////////////////////////////////////////////////
        public getAliveWatcherTeamIndexesForSelf(): Set<number> {
            return this.getAliveTeamIndexes(false);
        }
    }
}
