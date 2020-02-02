
namespace TinyWars.MapEditor {
    import Notify       = Utility.Notify;
    import Types        = Utility.Types;
    import GridIndex    = Types.GridIndex;

    export class MeGridVisionEffect {
        private _view: MeGridVisionEffectView;

        private _war: MeWar;

        public init(): MeGridVisionEffect {
            this._view = this._view || new MeGridVisionEffectView();
            this._view.init(this);

            return this;
        }

        public startRunning(war: MeWar): void {
            this._war = war;
        }
        public startRunningView(): void {
            this.getView().startRunningView();
        }
        public stopRunning(): void {
            this.getView().stopRunningView();
        }

        public getView(): MeGridVisionEffectView {
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
