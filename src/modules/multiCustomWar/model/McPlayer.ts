
namespace TinyWars.MultiCustomWar {
    import Types = Utility.Types;

    export class McPlayer {
        private _fund               : number;
        private _hasVotedForDraw    : boolean;
        private _isAlive            : boolean;
        private _playerIndex        : number;
        private _teamIndex          : number;
        private _userId             : number;

        private _nickname           : string;
        private _war                : McWar;

        public constructor() {
        }

        public init(data: Types.SerializedMcPlayer): McPlayer {
            this.setFund(data.fund!);
            this.setHasVotedForDraw(data.hasVotedForDraw!);
            this.setIsAlive(data.isAlive!);
            this._setPlayerIndex(data.playerIndex!);
            this._setTeamIndex(data.teamIndex!);
            this._setUserId(data.userId);

            return this;
        }

        public startRunning(war: McWar): void {
            this._war = war;
        }

        public serialize(): Types.SerializedMcPlayer {
            return {
                fund            : this.getFund(),
                hasVotedForDraw : this.getHasVotedForDraw(),
                isAlive         : this.getIsAlive(),
                playerIndex     : this.getPlayerIndex(),
                teamIndex       : this.getTeamIndex(),
                userId          : this.getUserId(),
            };
        }

        public setFund(fund: number): void {
            this._fund = fund;
        }
        public getFund(): number {
            return this._fund;
        }

        public setHasVotedForDraw(voted: boolean): void {
            this._hasVotedForDraw = voted;
        }
        public getHasVotedForDraw(): boolean {
            return this._hasVotedForDraw;
        }

        public setIsAlive(alive: boolean): void {
            this._isAlive = alive;
        }
        public getIsAlive(): boolean {
            return this._isAlive;
        }

        private _setPlayerIndex(index: number): void {
            this._playerIndex = index;
        }
        public getPlayerIndex(): number {
            return this._playerIndex;
        }

        private _setTeamIndex(index: number): void {
            this._teamIndex = index;
        }
        public getTeamIndex(): number {
            return this._teamIndex;
        }

        private _setUserId(id: number): void {
            this._userId = id;
        }
        public getUserId(): number {
            return this._userId;
        }

        private _setNickname(nickname: string): void {
            this._nickname = nickname;
        }
        public getNickname(): string {
            return this._nickname;
        }
    }
}
