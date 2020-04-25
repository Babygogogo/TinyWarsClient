
namespace TinyWars.Replay {
    import Types            = Utility.Types;
    import SerializedMcUnit = Types.SerializedUnit;
    import UnitState        = Types.UnitActionState;
    import UnitType         = Types.UnitType;

    export class ReplayUnit extends BaseWar.BwUnit {
        protected _getViewClass(): new () => BaseWar.BwUnitView {
            return ReplayUnitView;
        }

        public serialize(): SerializedMcUnit {
            const data: SerializedMcUnit = {
                gridX   : this.getGridX(),
                gridY   : this.getGridY(),
                viewId  : this.getViewId(),
                unitId  : this.getUnitId(),
            };

            const state = this.getActionState();
            (state !== UnitState.Idle) && (data.state = state);

            const currentHp = this.getCurrentHp();
            (currentHp !== this.getMaxHp()) && (data.currentHp = currentHp);

            const currentAmmo = this.getPrimaryWeaponCurrentAmmo();
            (currentAmmo !== this.getPrimaryWeaponMaxAmmo()) && (data.primaryWeaponCurrentAmmo = currentAmmo);

            const isCapturing = this.getIsCapturingTile();
            (isCapturing) && (data.isCapturingTile = isCapturing);

            const isDiving = this.getIsDiving();
            ((isDiving) || (this.getType() === UnitType.Submarine)) && (data.isDiving = isDiving);

            const currentFuel = this.getCurrentFuel();
            (currentFuel !== this.getMaxFuel()) && (data.currentFuel = currentFuel);

            const flareAmmo = this.getFlareCurrentAmmo();
            (flareAmmo !== this.getFlareMaxAmmo()) && (data.flareCurrentAmmo = flareAmmo);

            const produceMaterial = this.getCurrentProduceMaterial();
            (produceMaterial !== this.getMaxProduceMaterial()) && (data.currentProduceMaterial = produceMaterial);

            const currentPromotion = this.getCurrentPromotion();
            (currentPromotion !== 0) && (data.currentPromotion = currentPromotion);

            const isBuildingTile = this.getIsBuildingTile();
            (isBuildingTile) && (data.isBuildingTile = isBuildingTile);

            const buildMaterial = this.getCurrentBuildMaterial();
            (buildMaterial !== this.getMaxBuildMaterial()) && (data.currentBuildMaterial = buildMaterial);

            const loaderUnitId = this.getLoaderUnitId();
            (loaderUnitId != null) && (data.loaderUnitId = loaderUnitId);

            return data;
        }

        public serializeForSimulation(): SerializedMcUnit {
            return this.serialize();
        }
    }
}
