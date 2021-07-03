
// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace TinyWars.MapEditor {
    import ProtoTypes           = Utility.ProtoTypes;
    import WarSerialization     = ProtoTypes.WarSerialization;
    import ISerialPlayerManager = WarSerialization.ISerialPlayerManager;
    import ISerialPlayer        = WarSerialization.ISerialPlayer;

    export class MePlayerManager extends BaseWar.BwPlayerManager {
        public serializeForCreateSfw(): ISerialPlayerManager {
            const maxPlayerIndex    = (this._getWar().getField() as MeField).getMaxPlayerIndex();
            const players           : ISerialPlayer[] = [];
            for (let playerIndex = 0; playerIndex <= maxPlayerIndex; ++playerIndex) {
                players.push(MeUtility.createDefaultISerialPlayer(playerIndex));
            }

            return {
                players,
            };
        }

        ////////////////////////////////////////////////////////////////////////////////
        // The other public functions.
        ////////////////////////////////////////////////////////////////////////////////
        public getAliveWatcherTeamIndexesForSelf(): Set<number> {
            return this.getAliveTeamIndexes(false);
        }
    }
}
