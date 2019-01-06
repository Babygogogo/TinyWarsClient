
namespace TinyWars.MultiCustomWar {
    import Types = Utility.Types;

    export type McPlayerUserInfo = {
        userId  : number;
        nickname: string;
    }

    export class McPlayerModel {
        private _fund               : number;
        private _hasVotedForDraw    : boolean;
        private _isAlive            : boolean;
        private _playerIndex        : number;
        private _teamIndex          : number;

        private _userId             : number;
        private _nickname           : string;

        public constructor(data?: Types.SerializedMcPlayer, userInfo?: McPlayerUserInfo) {
            if ((data) && (userInfo)) {
                this.init(data, userInfo);
            }
        }

        public init(data: Types.SerializedMcPlayer, userInfo: McPlayerUserInfo): void {
            this.setFund(data.fund!);
            this.setHasVotedForDraw(data.hasVotedForDraw!);
            this.setIsAlive(data.isAlive!);
            this._setPlayerIndex(data.playerIndex!);
            this._setTeamIndex(data.teamIndex!);
            this._setUserId(userInfo.userId);
            this._setNickname(userInfo.nickname);
        }

        public serialize(): Types.SerializedMcPlayer {
            return {
                fund            : this.getFund(),
                hasVotedForDraw : this.getHasVotedForDraw(),
                isAlive         : this.getIsAlive(),
                playerIndex     : this.getPlayerIndex(),
                teamIndex       : this.getTeamIndex(),
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
