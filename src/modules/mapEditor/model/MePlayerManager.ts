
// import TwnsBwPlayerManager  from "../../baseWar/model/BwPlayerManager";
// import CommonConstants      from "../../tools/helpers/CommonConstants";
// import ProtoTypes           from "../../tools/proto/ProtoTypes";
// import TwnsMeField          from "./MeField";
// import MeUtility            from "./MeUtility";

namespace Twns.MapEditor {
    import BwPlayerManager      = Twns.BaseWar.BwPlayerManager;
    import MeField              = Twns.MapEditor.MeField;
    import WarSerialization     = CommonProto.WarSerialization;
    import ISerialPlayerManager = WarSerialization.ISerialPlayerManager;
    import ISerialPlayer        = WarSerialization.ISerialPlayer;

    export class MePlayerManager extends BwPlayerManager {
        public serializeForCreateSfw(): ISerialPlayerManager {
            const maxPlayerIndex    = (this._getWar().getField() as MeField).getMaxPlayerIndex();
            const players           : ISerialPlayer[] = [];
            for (let playerIndex = CommonConstants.WarNeutralPlayerIndex; playerIndex <= maxPlayerIndex; ++playerIndex) {
                players.push(Twns.MapEditor.MeHelpers.createDefaultISerialPlayer(playerIndex));
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
        public getWatcherTeamIndexesForSelf(): Set<number> {
            return this.getAliveTeamIndexes(false);
        }
    }
}

// export default TwnsMePlayerManager;
