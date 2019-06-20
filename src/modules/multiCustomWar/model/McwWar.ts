
namespace TinyWars.MultiCustomWar {
    import Types            = Utility.Types;
    import SerializedMcWar  = Types.SerializedBwWar;

    export class McwWar extends BaseWar.BwWar {
        private _isEnded        = false;

        private _view               : McwWarView;

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

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // The other functions.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        public getView(): McwWarView {
            return this._view;
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


        public getActionPlanner(): McwActionPlanner {
            return this.getField().getActionPlanner();
        }
    }
}
