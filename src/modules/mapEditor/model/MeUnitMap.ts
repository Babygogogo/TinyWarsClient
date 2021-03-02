
namespace TinyWars.MapEditor {
    export class MeUnitMap extends BaseWar.BwUnitMap {
        public reviseAllUnitIds(): void {
            const allUnits  = new Map<number, { unit: BaseWar.BwUnit, newUnitId: number }>();
            let nextUnitId  = 0;
            this.forEachUnit(unit => {
                allUnits.set(unit.getUnitId(), { unit, newUnitId: nextUnitId } );
                ++nextUnitId;
            });
            for (const [, value] of allUnits) {
                const unit = value.unit;
                unit.setUnitId(value.newUnitId);

                const loaderUnitId = unit.getLoaderUnitId();
                if (loaderUnitId != null) {
                    unit.setLoaderUnitId(allUnits.get(loaderUnitId).newUnitId);
                }
            }
            this.setNextUnitId(nextUnitId);
        }
    }
}
