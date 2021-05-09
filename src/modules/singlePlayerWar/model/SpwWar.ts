
namespace TinyWars.SinglePlayerWar {
    import ProtoTypes = Utility.ProtoTypes;

    export abstract class SpwWar extends BaseWar.BwWar {
        private _isEnded            = false;
        private _saveSlotIndex      : number;
        private _saveSlotComment    : string;

        public abstract serialize(): ProtoTypes.WarSerialization.ISerialWar;
        public abstract getCanCheat(): boolean;

        protected _getFieldClass(): new () => SpwField {
            return SpwField;
        }
        protected _getPlayerManagerClass(): new () => SpwPlayerManager {
            return SpwPlayerManager;
        }
        protected _getTurnManagerClass(): new () => SpwTurnManager {
            return SpwTurnManager;
        }

        public setIsEnded(ended: boolean): void {
            this._isEnded = ended;
        }
        public getIsEnded(): boolean {
            return this._isEnded;
        }

        public setSaveSlotIndex(slotIndex: number): void {
            this._saveSlotIndex = slotIndex;
        }
        public getSaveSlotIndex(): number {
            return this._saveSlotIndex;
        }

        public setSaveSlotComment(comment: string | null | undefined): void {
            this._saveSlotComment = comment;
        }
        public getSaveSlotComment(): string | null | undefined {
            return this._saveSlotComment;
        }

        public getHumanPlayerIndexes(): number[] {
            return (this.getPlayerManager() as SpwPlayerManager).getHumanPlayerIndexes();
        }
        public getHumanPlayers(): BaseWar.BwPlayer[] {
            return (this.getPlayerManager() as SpwPlayerManager).getHumanPlayers();
        }
        public checkIsHumanInTurn(): boolean {
            return this.getHumanPlayerIndexes().indexOf(this.getPlayerIndexInTurn()) >= 0;
        }
    }
}
