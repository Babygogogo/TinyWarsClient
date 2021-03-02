
namespace TinyWars.BaseWar {
    import Notify       = Utility.Notify;
    import Types        = Utility.Types;
    import GridIndex    = Types.GridIndex;

    export class BwGridVisualEffect {
        private readonly _view = new BwGridVisualEffectView();

        private _war: BwWar;

        private _notifyListeners: Notify.Listener[] = [
            { type: Notify.Type.BwUnitBeAttacked,   callback: this._onNotifyBwUnitBeAttacked },
            { type: Notify.Type.BwUnitBeDestroyed,  callback: this._onNotifyBwUnitBeDestroyed },
            { type: Notify.Type.BwUnitBeRepaired,   callback: this._onNotifyBwUnitBeRepaired },
            { type: Notify.Type.BwUnitBeSupplied,   callback: this._onNotifyBwUnitBeSupplied },
            { type: Notify.Type.BwTileBeDestroyed,  callback: this._onNotifyBwTileBeDestroyed },
            { type: Notify.Type.BwTileBeAttacked,   callback: this._onNotifyBwTileBeAttacked },
            { type: Notify.Type.BwSiloExploded,     callback: this._onNotifyBwSiloExploded },
        ];

        public init(): BwGridVisualEffect {
            this.getView().init(this);

            return this;
        }
        public fastInit(): BwGridVisualEffect {
            this.getView().fastInit(this);

            return this;
        }

        public startRunning(war: BwWar): void {
            Notify.addEventListeners(this._notifyListeners, this, undefined, 1);

            this._war = war;
        }
        public startRunningView(): void {
            this.getView().startRunningView();
        }
        public stopRunning(): void {
            Notify.removeEventListeners(this._notifyListeners, this);

            this.getView().stopRunningView();
        }

        public getView(): BwGridVisualEffectView {
            return this._view;
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // The callbacks.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _onNotifyBwUnitBeAttacked(e: egret.Event): void {

        }

        private _onNotifyBwUnitBeDestroyed(e: egret.Event): void {

        }

        private _onNotifyBwUnitBeRepaired(e: egret.Event): void {

        }

        private _onNotifyBwUnitBeSupplied(e: egret.Event): void {

        }

        private _onNotifyBwTileBeAttacked(e: egret.Event): void {

        }

        private _onNotifyBwTileBeDestroyed(e: egret.Event): void {

        }

        private _onNotifyBwSiloExploded(e: egret.Event): void {

        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // The public functions.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        public showEffectBlock(gridIndex: GridIndex): void {
            this.getView().showEffectBlock(gridIndex);
        }

        public showEffectDive(gridIndex: GridIndex): void {
            this.getView().showEffectDive(gridIndex);
        }

        public showEffectExplosion(gridIndex: GridIndex): void {
            this.getView().showEffectExplosion(gridIndex);
        }

        public showEffectFlare(gridIndex: GridIndex): void {
            this.getView().showEffectFlare(gridIndex);
        }

        public showEffectDamage(gridIndex: GridIndex): void {
            this.getView().showEffectDamage(gridIndex);
        }

        public showEffectSupply(gridIndex: GridIndex): void {
            this.getView().showEffectSupply(gridIndex);
        }

        public showEffectRepair(gridIndex: GridIndex): void {
            this.getView().showEffectRepair(gridIndex);
        }

        public showEffectSiloExplosion(gridIndex: GridIndex): void {
            this.getView().showEffectSiloExplosion(gridIndex);
        }

        public showEffectSkillActivation(gridIndex: GridIndex): void {
            this.getView().showEffectSkillActivation(gridIndex);
        }

        public showEffectSurface(gridIndex: GridIndex): void {
            this.getView().showEffectSurface(gridIndex);
        }
    }
}
