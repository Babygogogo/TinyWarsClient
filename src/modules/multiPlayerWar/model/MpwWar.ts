
namespace TinyWars.MultiPlayerWar {
    import Types = Utility.Types;

    export abstract class MpwWar extends BaseWar.BwWar {
        private readonly _playerManager         = new MpwPlayerManager();
        private readonly _turnManager           = new MpwTurnManager();
        private readonly _field                 = new MpwField();
        private readonly _commonSettingManager  = new BaseWar.BwCommonSettingManager();
        private readonly _warEventManager       = new BaseWar.BwWarEventManager();

        private _isEnded = false;

        public abstract getSettingsBootTimerParams(): number[];

        public getField(): MpwField {
            return this._field;
        }
        public getPlayerManager(): MpwPlayerManager {
            return this._playerManager;
        }
        public getTurnManager(): MpwTurnManager {
            return this._turnManager;
        }
        public getCommonSettingManager(): BaseWar.BwCommonSettingManager {
            return this._commonSettingManager;
        }
        public getIsWarMenuPanelOpening(): boolean {
            return MpwWarMenuPanel.getIsOpening();
        }
        public getWarEventManager(): BaseWar.BwWarEventManager {
            return this._warEventManager;
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // The other functions.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        public getBootRestTime(): number | null {
            const player = this.getPlayerInTurn();
            if (player.getPlayerIndex() === 0) {
                return null;
            } else {
                return (this.getEnterTurnTime() + player.getRestTimeToBoot() - Time.TimeModel.getServerTimestamp()) || null;
            }
        }

        public setIsEnded(ended: boolean): void {
            this._isEnded = ended;
        }
        public getIsEnded(): boolean {
            return this._isEnded;
        }

        public checkIsBoot(): boolean {
            if (this.getIsEnded()) {
                return false;
            } else {
                const player = this.getPlayerInTurn();
                return (player.getAliveState() === Types.PlayerAliveState.Alive)
                    && (!player.checkIsNeutral())
                    && (Time.TimeModel.getServerTimestamp() > this.getEnterTurnTime() + player.getRestTimeToBoot());
            }
        }

        public getPlayerIndexLoggedIn(): number | undefined {
            return (this.getPlayerManager() as MpwPlayerManager).getPlayerIndexLoggedIn();
        }
        public getPlayerLoggedIn(): BaseWar.BwPlayer {
            return (this.getPlayerManager() as MpwPlayerManager).getPlayerLoggedIn();
        }
    }
}
