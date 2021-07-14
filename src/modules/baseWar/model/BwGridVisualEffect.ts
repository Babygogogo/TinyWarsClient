
import TwnsClientErrorCode          from "../../tools/helpers/ClientErrorCode";
import Types                        from "../../tools/helpers/Types";
import Notify                       from "../../tools/notify/Notify";
import TwnsNotifyType               from "../../tools/notify/NotifyType";
import TwnsBwGridVisualEffectView   from "../view/BwGridVisualEffectView";
import TwnsBwWar                    from "./BwWar";

namespace TwnsBwGridVisualEffect {
    import GridIndex                = Types.GridIndex;
    import ClientErrorCode          = TwnsClientErrorCode.ClientErrorCode;
    import NotifyType               = TwnsNotifyType.NotifyType;
    import BwGridVisualEffectView   = TwnsBwGridVisualEffectView.BwGridVisualEffectView;
    import BwWar                    = TwnsBwWar.BwWar;

    export class BwGridVisualEffect {
        private readonly _view = new BwGridVisualEffectView();

        private _war: BwWar;

        private _notifyListeners: Notify.Listener[] = [
            { type: NotifyType.BwUnitBeAttacked,   callback: this._onNotifyBwUnitBeAttacked },
            { type: NotifyType.BwUnitBeDestroyed,  callback: this._onNotifyBwUnitBeDestroyed },
            { type: NotifyType.BwUnitBeRepaired,   callback: this._onNotifyBwUnitBeRepaired },
            { type: NotifyType.BwUnitBeSupplied,   callback: this._onNotifyBwUnitBeSupplied },
            { type: NotifyType.BwTileBeDestroyed,  callback: this._onNotifyBwTileBeDestroyed },
            { type: NotifyType.BwTileBeAttacked,   callback: this._onNotifyBwTileBeAttacked },
            { type: NotifyType.BwSiloExploded,     callback: this._onNotifyBwSiloExploded },
        ];

        public init(): ClientErrorCode {
            this.getView().init(this);

            return ClientErrorCode.NoError;
        }
        public fastInit(): ClientErrorCode {
            this.getView().fastInit(this);

            return ClientErrorCode.NoError;
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
            // nothing to do
        }

        private _onNotifyBwUnitBeDestroyed(e: egret.Event): void {
            // nothing to do
        }

        private _onNotifyBwUnitBeRepaired(e: egret.Event): void {
            // nothing to do
        }

        private _onNotifyBwUnitBeSupplied(e: egret.Event): void {
            // nothing to do
        }

        private _onNotifyBwTileBeAttacked(e: egret.Event): void {
            // nothing to do
        }

        private _onNotifyBwTileBeDestroyed(e: egret.Event): void {
            // nothing to do
        }

        private _onNotifyBwSiloExploded(e: egret.Event): void {
            // nothing to do
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

export default TwnsBwGridVisualEffect;
