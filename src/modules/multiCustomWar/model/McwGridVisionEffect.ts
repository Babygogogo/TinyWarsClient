
namespace TinyWars.MultiCustomWar {
    import Notify       = Utility.Notify;
    import Types        = Utility.Types;
    import GridIndex    = Types.GridIndex;

    export class McwGridVisionEffect {
        private _view: McwGridVisionEffectView;

        private _war: McwWar;

        private _notifyListeners: Notify.Listener[] = [
            { type: Notify.Type.McwUnitBeAttacked,      callback: this._onNotifyMcwUnitBeAttacked },
            { type: Notify.Type.McwUnitBeDestroyed,     callback: this._onNotifyMcwUnitBeDestroyed },
            { type: Notify.Type.McwUnitBeRepaired,      callback: this._onNotifyMcwUnitBeRepaired },
            { type: Notify.Type.McwUnitBeSupplied,      callback: this._onNotifyMcwUnitBeSupplied },
            { type: Notify.Type.McwTileBeDestroyed,     callback: this._onNotifyMcwTileBeDestroyed },
            { type: Notify.Type.McwTileBeAttacked,      callback: this._onNotifyMcwTileBeAttacked },
            { type: Notify.Type.McwSiloExploded,        callback: this._onNotifyMcwSiloExploded },
        ];

        public constructor() {
        }

        public async init(): Promise<McwGridVisionEffect> {
            this._view = this._view || new McwGridVisionEffectView();
            this._view.init(this);

            return this;
        }

        public startRunning(war: McwWar): void {
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

        public getView(): McwGridVisionEffectView {
            return this._view;
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // The callbacks.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _onNotifyMcwUnitBeAttacked(e: egret.Event): void {

        }

        private _onNotifyMcwUnitBeDestroyed(e: egret.Event): void {

        }

        private _onNotifyMcwUnitBeRepaired(e: egret.Event): void {

        }

        private _onNotifyMcwUnitBeSupplied(e: egret.Event): void {

        }

        private _onNotifyMcwTileBeAttacked(e: egret.Event): void {

        }

        private _onNotifyMcwTileBeDestroyed(e: egret.Event): void {

        }

        private _onNotifyMcwSiloExploded(e: egret.Event): void {

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
