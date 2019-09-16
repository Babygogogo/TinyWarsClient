
namespace TinyWars.MultiCustomWar {
    import Types            = Utility.Types;
    import SerializedMcWar  = Types.SerializedBwWar;

    export class McwWar extends BaseWar.BwWar {
        private _isEnded        = false;

        public async init(data: SerializedMcWar): Promise<McwWar> {
            await super.init(data);

            this.setNextActionId(data.nextActionId);
            this._setPlayerManager(new McwPlayerManager().init(data.players));
            this._setField(await new McwField().init(data.field, this.getConfigVersion(), this.getMapFileName()));
            this._setTurnManager(new McwTurnManager().init(data.turn));

            this._initView();

            return this;
        }

        protected _getViewClass(): new () => McwWarView {
            return McwWarView;
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // The other functions.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
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
    }
}
