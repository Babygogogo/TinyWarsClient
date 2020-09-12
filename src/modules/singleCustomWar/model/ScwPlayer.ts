
namespace TinyWars.SingleCustomWar {
    import Logger           = Utility.Logger;
    import ProtoTypes       = Utility.ProtoTypes;
    import ISerialPlayer    = ProtoTypes.WarSerialization.ISerialPlayer;

    export class ScwPlayer extends BaseWar.BwPlayer {
        public serialize(): ISerialPlayer {
            const fund = this.getFund();
            if (fund == null) {
                Logger.error(`ScwPlayer.serialize() empty fund.`);
                return undefined;
            }

            const hasVotedForDraw = this.getHasVotedForDraw();
            if (hasVotedForDraw == null) {
                Logger.error(`ScwPlayer.serialize() empty hasVotedForDraw.`);
                return undefined;
            }

            const isAlive = this.getIsAlive();
            if (isAlive == null) {
                Logger.error(`ScwPlayer.serialize() empty isAlive.`);
                return undefined;
            }

            const playerIndex = this.getPlayerIndex();
            if (playerIndex == null) {
                Logger.error(`ScwPlayer.serialize() empty playerIndex.`);
                return undefined;
            }

            const teamIndex = this.getTeamIndex();
            if (teamIndex == null) {
                Logger.error(`ScwPlayer.serialize() empty teamIndex.`);
                return undefined;
            }

            const restTimeToBoot = this.getRestTimeToBoot();
            if (restTimeToBoot == null) {
                Logger.error(`ScwPlayer.serialize() empty restTimeToBoo.`);
                return undefined;
            }

            const coUsingSkillType = this.getCoUsingSkillType();
            if (coUsingSkillType == null) {
                Logger.error(`ScwPlayer.serialize() empty coUsingSkillType.`);
                return undefined;
            }

            const coIsDestroyedInTurn = this.getCoIsDestroyedInTurn();
            if (coIsDestroyedInTurn == null) {
                Logger.error(`ScwPlayer.serialize() empty coIsDestroyedInTurn.`);
                return undefined;
            }

            const unitAndTileSkinId = this.getUnitAndTileSkinId();
            if (unitAndTileSkinId == null) {
                Logger.error(`ScwPlayer.serialize() empty unitAndTileSkinId.`);
                return undefined;
            }

            const coId = this.getCoId();
            if (coId == null) {
                Logger.error(`ScwPlayer.serialize() empty coId.`);
                return undefined;
            }

            return {
                playerIndex,
                teamIndex,
                fund,
                hasVotedForDraw,
                isAlive,
                restTimeToBoot,
                coUsingSkillType,
                coIsDestroyedInTurn,
                unitAndTileSkinId,
                userId                      : this.getUserId(),
                coId,
                coCurrentEnergy             : this.getCoCurrentEnergy(),
                watchRequestSrcUserIdList   : [],
                watchOngoingSrcUserIdList   : []
            };
        }

        public serializeForSimulation(): ISerialPlayer {
            const fund = this.getFund();
            if (fund == null) {
                Logger.error(`ScwPlayer.serializeForSimulation() empty fund.`);
                return undefined;
            }

            const hasVotedForDraw = this.getHasVotedForDraw();
            if (hasVotedForDraw == null) {
                Logger.error(`ScwPlayer.serializeForSimulation() empty hasVotedForDraw.`);
                return undefined;
            }

            const isAlive = this.getIsAlive();
            if (isAlive == null) {
                Logger.error(`ScwPlayer.serializeForSimulation() empty isAlive.`);
                return undefined;
            }

            const playerIndex = this.getPlayerIndex();
            if (playerIndex == null) {
                Logger.error(`ScwPlayer.serializeForSimulation() empty playerIndex.`);
                return undefined;
            }

            const teamIndex = this.getTeamIndex();
            if (teamIndex == null) {
                Logger.error(`ScwPlayer.serializeForSimulation() empty teamIndex.`);
                return undefined;
            }

            const restTimeToBoot = this.getRestTimeToBoot();
            if (restTimeToBoot == null) {
                Logger.error(`ScwPlayer.serializeForSimulation() empty restTimeToBoo.`);
                return undefined;
            }

            const coUsingSkillType = this.getCoUsingSkillType();
            if (coUsingSkillType == null) {
                Logger.error(`ScwPlayer.serializeForSimulation() empty coUsingSkillType.`);
                return undefined;
            }

            const coIsDestroyedInTurn = this.getCoIsDestroyedInTurn();
            if (coIsDestroyedInTurn == null) {
                Logger.error(`ScwPlayer.serializeForSimulation() empty coIsDestroyedInTurn.`);
                return undefined;
            }

            const unitAndTileSkinId = this.getUnitAndTileSkinId();
            if (unitAndTileSkinId == null) {
                Logger.error(`ScwPlayer.serializeForSimulation() empty unitAndTileSkinId.`);
                return undefined;
            }

            const coId = this.getCoId();
            if (coId == null) {
                Logger.error(`ScwPlayer.serializeForSimulation() empty coId.`);
                return undefined;
            }

            const selfUserId        = User.UserModel.getSelfUserId();
            const war               = this._getWar();
            const shouldShowFund    = (!war.getFogMap().checkHasFogCurrently()) || (war.getWatcherTeamIndexes(selfUserId).has(this.getTeamIndex()));
            return {
                playerIndex,
                teamIndex,
                fund                        : shouldShowFund ? fund : 0,
                hasVotedForDraw,
                isAlive,
                restTimeToBoot,
                coUsingSkillType,
                coIsDestroyedInTurn,
                unitAndTileSkinId,
                userId                      : playerIndex > 0 ? selfUserId : null,
                coId,
                coCurrentEnergy             : this.getCoCurrentEnergy(),
                watchRequestSrcUserIdList   : [],
                watchOngoingSrcUserIdList   : []
            };
        }
    }
}
