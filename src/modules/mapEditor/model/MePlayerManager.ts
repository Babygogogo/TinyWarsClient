
// import TwnsBwPlayerManager  from "../../baseWar/model/BwPlayerManager";
// import CommonConstants      from "../../tools/helpers/CommonConstants";
// import ProtoTypes           from "../../tools/proto/ProtoTypes";
// import TwnsMeField          from "./MeField";
// import MeUtility            from "./MeUtility";

namespace TwnsMePlayerManager {
    import BwPlayerManager      = TwnsBwPlayerManager.BwPlayerManager;
    import MeField              = TwnsMeField.MeField;
    import WarSerialization     = ProtoTypes.WarSerialization;
    import ISerialPlayerManager = WarSerialization.ISerialPlayerManager;
    import ISerialPlayer        = WarSerialization.ISerialPlayer;

    export class MePlayerManager extends BwPlayerManager {
        public serializeForCreateSfw(): ISerialPlayerManager {
            const maxPlayerIndex    = (this._getWar().getField() as MeField).getMaxPlayerIndex();
            const players           : ISerialPlayer[] = [];
            for (let playerIndex = CommonConstants.WarNeutralPlayerIndex; playerIndex <= maxPlayerIndex; ++playerIndex) {
                players.push(MeUtility.createDefaultISerialPlayer(playerIndex));
            }

            return {
                players,
            };
        }

        public serializeForCreateMfr(): ISerialPlayerManager {
            const maxPlayerIndex    = (this._getWar().getField() as MeField).getMaxPlayerIndex();
            const players           : ISerialPlayer[] = [];
            for (let playerIndex = CommonConstants.WarNeutralPlayerIndex; playerIndex <= maxPlayerIndex; ++playerIndex) {
                players.push(this.getPlayer(playerIndex).serializeForCreateMfr());
            }

            return { players };
        }

        ////////////////////////////////////////////////////////////////////////////////
        // The other public functions.
        ////////////////////////////////////////////////////////////////////////////////
        public getAliveWatcherTeamIndexesForSelf(): Set<number> {
            return this.getAliveTeamIndexes(false);
        }
    }
}

// export default TwnsMePlayerManager;
