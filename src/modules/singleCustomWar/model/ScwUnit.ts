
namespace TinyWars.SingleCustomWar {
    import Logger           = Utility.Logger;
    import ISerialUnit      = Utility.ProtoTypes.WarSerialization.ISerialUnit;
    import BwHelpers        = BaseWar.BwHelpers;

    export class ScwUnit extends BaseWar.BwUnit {
        protected _getViewClass(): new () => BaseWar.BwUnitView {
            return ScwUnitView;
        }

        public serialize(): ISerialUnit | undefined {
            const data = BwHelpers.serializeUnit(this);
            if (data == null) {
                Logger.error(`ScwUnit.serialize() empty data.`);
                return undefined;
            }

            return data;
        }

        public serializeForSimulation(): ISerialUnit | undefined {
            const data = this.serialize();
            if (data == null) {
                Logger.error(`ScwUnit.serializeForSimulation() empty data.`);
                return undefined;
            }

            return data;
        }
    }
}
