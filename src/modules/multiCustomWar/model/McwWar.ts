
namespace TinyWars.MultiCustomWar {
    import Types    = Utility.Types;
    import Logger   = Utility.Logger;

    export class McwWar extends BaseWar.BwWar {
        private _isEnded = false;

        public async init(data: Types.SerializedWar): Promise<McwWar> {
            this._baseInit(data);

            this._initPlayerManager(data.players);
            await this._initField(
                data.field,
                data.configVersion,
                data.mapFileName,
                await BaseWar.BwHelpers.getMapSizeAndMaxPlayerIndex(data)
            );
            this._initTurnManager(data.turn);

            this.setNextActionId(data.nextActionId);

            this._initView();

            return this;
        }

        protected _getViewClass(): new () => McwWarView {
            return McwWarView;
        }
        protected _getFieldClass(): new () => McwField {
            return McwField;
        }
        protected _getPlayerManagerClass(): new () => McwPlayerManager {
            return McwPlayerManager;
        }
        protected _getTurnManagerClass(): new () => McwTurnManager {
            return McwTurnManager;
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
