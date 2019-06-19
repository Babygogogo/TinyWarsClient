
namespace TinyWars.MultiCustomWar {
    import Types            = Utility.Types;
    import MapIndexKey      = Types.MapIndexKey;
    import SerializedMcWar  = Types.SerializedBwWar;

    export class McwWar extends BaseWar.BwWar {
        private _isEnded        = false;

        private _field          : McwField;
        private _turnManager    : McwTurnManager;

        private _view               : McwWarView;
        private _isRunningAction    = false;
        private _isRunningWar       = false;

        public async init(data: SerializedMcWar): Promise<McwWar> {
            await super.init(data);

            this.setNextActionId(data.nextActionId);
            this._setPlayerManager(new McwPlayerManager().init(data.players));
            this._setField(await new McwField().init(data.field, this.getConfigVersion(), this.getMapIndexKey()));
            this._setTurnManager(new McwTurnManager().init(data.turn));

            this._view = this._view || new McwWarView();
            this._view.init(this);

            return this;
        }

        public startRunning(): McwWar {
            this.getTurnManager().startRunning(this);
            this.getPlayerManager().startRunning(this);
            this.getField().startRunning(this);

            this._isRunningWar = true;

            return this;
        }
        public startRunningView(): McwWar {
            this.getView().startRunning();
            this.getField().startRunningView();

            return this;
        }
        public stopRunning(): McwWar {
            this.getField().stopRunning();
            this.getView().stopRunning();

            this._isRunningWar = false;

            return this;
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // The other functions.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        public getView(): McwWarView {
            return this._view;
        }

        public getIsRunningAction(): boolean {
            return this._isRunningAction;
        }
        public setIsRunningAction(isRunning: boolean): void {
            this._isRunningAction = isRunning;
        }

        public getIsRunningWar(): boolean {
            return this._isRunningWar;
        }

        public getEnterTurnTime(): number {
            return this.getTurnManager().getEnterTurnTime();
        }

        public setIsEnded(ended: boolean): void {
            this._isEnded = ended;
        }
        public getIsEnded(): boolean {
            return this._isEnded;
        }

        public getPlayerIndexLoggedIn(): number | undefined {
            return (this.getPlayerManager() as McwPlayerManager).getPlayerIndexLoggedIn();
        }
        public getPlayerLoggedIn(): McwPlayer {
            return (this.getPlayerManager() as McwPlayerManager).getPlayerLoggedIn();
        }

        private _setField(field: McwField): void {
            this._field = field;
        }
        public getField(): McwField {
            return this._field;
        }
        public getUnitMap(): McwUnitMap {
            return this.getField().getUnitMap();
        }
        public getTileMap(): McwTileMap {
            return this.getField().getTileMap();
        }
        public getFogMap(): McwFogMap {
            return this.getField().getFogMap();
        }

        public getActionPlanner(): McwActionPlanner {
            return this.getField().getActionPlanner();
        }

        public getGridVisionEffect(): McwGridVisionEffect {
            return this.getField().getGridVisionEffect();
        }

        private _setTurnManager(manager: McwTurnManager): void {
            this._turnManager = manager;
        }
        public getTurnManager(): McwTurnManager {
            return this._turnManager;
        }
    }
}
