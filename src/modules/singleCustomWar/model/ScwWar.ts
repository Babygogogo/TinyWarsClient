
namespace TinyWars.SingleCustomWar {
    import Types            = Utility.Types;
    import SerializedBWar   = Types.SerializedBwWar;

    export class ScwWar extends BaseWar.BwWar {
        private _isEnded        = false;

        public async init(data: SerializedBWar): Promise<ScwWar> {
            await super.init(data);

            this.setNextActionId(data.nextActionId);
            this._setPlayerManager(new ScwPlayerManager().init(data.players));
            this._setField(await new ScwField().init(data.field, this.getConfigVersion(), this.getMapFileName()));
            this._setTurnManager(new ScwTurnManager().init(data.turn));

            this._initView();

            return this;
        }

        protected _getViewClass(): new () => ScwWarView {
            return ScwWarView;
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
            return (this.getPlayerManager() as ScwPlayerManager).getPlayerIndexLoggedIn();
        }
        public getPlayerLoggedIn(): ScwPlayer {
            return (this.getPlayerManager() as ScwPlayerManager).getPlayerLoggedIn();
        }
    }
}
