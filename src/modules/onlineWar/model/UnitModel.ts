
namespace OnlineWar {
    import Types          = Utility.Types;
    import IdConverter    = Utility.IdConverter;
    import Helpers        = Utility.Helpers;
    import SerializedUnit = Types.SerializedUnit;
    import InstantialUnit = Types.InstantialUnit;
    import UnitState      = Types.UnitState;
    import ArmorType      = Types.ArmorType;

    export class UnitModel {
        private _template: Types.TemplateUnit;
        private _isInitialized: boolean;

        private _gridX              : number;
        private _gridY              : number;
        private _viewId             : number;
        private _unitId             : number;
        private _unitType           : Types.UnitType;
        private _playerIndex        : number;

        private _state                   : UnitState;
        private _currentHp               : number;
        private _currentFuel             : number;
        private _currentBuildMaterial    : number;
        private _currentProduceMaterial  : number;
        private _currentPromotion        : number;
        private _flareCurrentAmmo        : number;
        private _isBuildingTile          : number;
        private _isCapturingTile         : boolean;
        private _isDiving                : boolean;
        private _loadedUnitIds           : number[];
        private _primaryWeaponCurrentAmmo: number;

        public constructor(data?: SerializedUnit) {
            if (data) {
                this.deserialize(data);
            }
        }

        public deserialize(data: SerializedUnit): void {
            const t             = IdConverter.getUnitTypeAndPlayerIndex(data.viewId);
            this._isInitialized = true;
            this._gridX         = data.gridX;
            this._gridY         = data.gridY;
            this._viewId        = data.viewId;
            this._unitId        = data.unitId;
            this._unitType      = t.unitType;
            this._playerIndex   = t.playerIndex;
            this._template      = Config.getTemplateUnit(this._unitType);
            this._loadInstantialData(data.instantialData);
        }

        public serialize(): SerializedUnit {
            egret.assert(this._isInitialized, "UnitModel.serialize() the tile hasn't been initialized!");
            return {
                gridX         : this._gridX,
                gridY         : this._gridY,
                viewId        : this._viewId,
                unitId        : this._unitId,
                instantialData: this._createInstantialData(),
            };
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for view.
        ////////////////////////////////////////////////////////////////////////////////
        public getViewId(): number {
            return this._viewId;
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for state.
        ////////////////////////////////////////////////////////////////////////////////
        public getState(): UnitState {
            return this._state;
        }

        public setState(state: UnitState): void {
            this._state = state;
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for hp and armor.
        ////////////////////////////////////////////////////////////////////////////////
        public getMaxHp(): number {
            return this._template.maxHp;
        }

        public getNormalizedCurrentHp(): number {
            return Helpers.getNormalizedHp(this.getCurrentHp());
        }
        public getCurrentHp(): number {
            return this._currentHp;
        }
        public setCurrentHp(hp: number): void {
            egret.assert((hp >= 0) && (hp <= this.getMaxHp()));
            this._currentHp = hp;
        }

        public getArmorType(): Types.ArmorType {
            return this._template.armorType;
        }

        public checkIsArmorAffectByLuck(): boolean | undefined {
            return this._template.isAffectedByLuck;
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for weapon.
        ////////////////////////////////////////////////////////////////////////////////
        public checkHasPrimaryWeapon(): boolean {
            return this._template.primaryWeaponDamages != null;
        }

        public getPrimaryWeaponMaxAmmo(): number {
            return this._template.primaryWeaponMaxAmmo;
        }

        public getPrimaryWeaponCurrentAmmo(): number {
            return this._primaryWeaponCurrentAmmo;
        }
        public setPrimaryWeaponCurrentAmmo(ammo: number): void {
            this._primaryWeaponCurrentAmmo = ammo;
        }

        public checkIsPrimaryWeaponAmmoInShort(): boolean {
            const maxAmmo = this.getPrimaryWeaponMaxAmmo();
            return maxAmmo != null ? this.getPrimaryWeaponCurrentAmmo() <= maxAmmo * 0.4 : undefined;
        }

        public getPrimaryWeaponRawDamage(armorType: ArmorType): number | undefined {
            const damages = this._template.primaryWeaponDamages;
            return damages ? damages[armorType] : undefined;
        }

        public checkHasSecondaryWeapon(): boolean {
            return this._template.secondaryWeaponDamages != null;
        }

        public getSecondaryWeaponRawDamage(armorType: ArmorType): number | undefined {
            const damages = this._template.secondaryWeaponDamages;
            return damages ? damages[armorType] : undefined;
        }

        public getRawDamage(armorType: ArmorType): number | undefined {
            return this.getPrimaryWeaponRawDamage(armorType) || this.getSecondaryWeaponRawDamage(armorType);
        }

        public getRawMinAttackRange(): number | undefined {
            return this._template.minAttackRange;
        }
        public getRawMaxAttackRange(): number | undefined {
            return this._template.maxAttackRange;
        }

        public checkCanAttackAfterMove(): boolean | undefined {
            return this._template.canAttackAfterMove;
        }
        public checkCanAttackDivingUnits(): boolean | undefined {
            return this._template.canAttackDivingUnits;
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Private functions.
        ////////////////////////////////////////////////////////////////////////////////
        private _createInstantialData(): InstantialUnit | undefined {
            const data: InstantialUnit = {};

            const state = this.getState();
            (state !== UnitState.Idle) && (data.state = state);

            const currentHp = this.getCurrentHp();
            (currentHp !== this.getMaxHp()) && (data.currentHp = currentHp);

            const currentAmmo = this.getPrimaryWeaponCurrentAmmo();
            (currentAmmo !== this.getPrimaryWeaponMaxAmmo()) && (data.primaryWeaponCurrentAmmo = currentAmmo);

            return Helpers.checkIsEmptyObject(data) ? undefined : data;
        }

        private _loadInstantialData(d: InstantialUnit | undefined) {
            this.setState(                   (d) && (d.state                    != null) ? d.state                    : UnitState.Idle);
            this.setCurrentHp(               (d) && (d.currentHp                != null) ? d.currentHp                : this.getMaxHp());
            this.setPrimaryWeaponCurrentAmmo((d) && (d.primaryWeaponCurrentAmmo != null) ? d.primaryWeaponCurrentAmmo : this.getPrimaryWeaponMaxAmmo());
        }
    }
}
