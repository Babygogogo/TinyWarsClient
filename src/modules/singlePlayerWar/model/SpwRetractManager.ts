
// import TwnsBwPlayer         from "../../baseWar/model/BwPlayer";
// import TwnsBwPlayerManager  from "../../baseWar/model/BwPlayerManager";
// import Helpers              from "../../tools/helpers/Helpers";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.SinglePlayerWar {
    export class SpwRetractManager {
        private _canRetract         = false;
        private _retractStateArray  : Uint8Array[] = [];
        private _nextRetractId      = 0;

        public setCanRetract(canRetract: boolean): void {
            this._canRetract = canRetract;
        }
        public getCanRetract(): boolean {
            return this._canRetract;
        }

        public addRetractState(state: Uint8Array): void {
            const array     = this._retractStateArray;
            const retractId = this._nextRetractId;
            if ((retractId !== 0) && (array[retractId - 1] == null)) {
                throw Helpers.newError(`Invalid retractId: ${retractId}`);
            }

            array.length = retractId;
            array.push(state);
            ++this._nextRetractId;
        }
        public getRetractState(retractId: number): Uint8Array | null {
            return this._retractStateArray[retractId] ?? null;
        }

        public getNextRetractId(): number {
            return this._nextRetractId;
        }
        public setNextRetractId(retractId: number): void {
            this._nextRetractId = retractId;
        }
    }
}

// export default TwnsSpwPlayerManager;
