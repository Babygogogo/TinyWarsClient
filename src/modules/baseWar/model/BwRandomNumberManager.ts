
import Helpers      from "../../tools/helpers/Helpers";
import ProtoTypes   from "../../tools/proto/ProtoTypes";

namespace TwnsBwRandomNumberManager {
    import ISeedRandomState = ProtoTypes.Structure.ISeedRandomState;

    export class BwRandomNumberManager {
        private _isNeedReplay?              : boolean;
        private _seedRandomInitialState?    : ProtoTypes.Structure.ISeedRandomState | null;
        private _randomNumberGenerator?     : seedrandom.prng | null;

        public init({ isNeedSeedRandom, initialState, currentState }: {
            isNeedSeedRandom: boolean;
            initialState    : ISeedRandomState | null | undefined;
            currentState    : ISeedRandomState | null | undefined;
        }): void {
            this._setIsNeedReplay(isNeedSeedRandom);

            if (isNeedSeedRandom) {
                // TODO: check if the states are valid.
                if (initialState == null) {
                    throw new Error(`Empty initialState.`);
                }
                this._setSeedRandomInitialState(initialState);

                if (currentState == null) {
                    throw new Error(`Empty currentState.`);
                }
                this._setRandomNumberGenerator(new Math.seedrandom("", { state: currentState }));
            }
        }

        private _setIsNeedReplay(isNeedReplay: boolean): void {
            this._isNeedReplay = isNeedReplay;
        }
        private _getIsNeedReplay(): boolean {
            return Helpers.getDefined(this._isNeedReplay);
        }

        private _setRandomNumberGenerator(generator: seedrandom.prng): void {
            this._randomNumberGenerator = generator;
        }
        private _getRandomNumberGenerator(): seedrandom.prng | null {
            return Helpers.getDefined(this._randomNumberGenerator);
        }

        public getRandomNumber(): number {
            if (!this._getIsNeedReplay()) {
                return Math.random();
            }

            return Helpers.getExisted(this._getRandomNumberGenerator())();
        }

        public getSeedRandomCurrentState(): ProtoTypes.Structure.ISeedRandomState {
            return Helpers.getExisted(this._getRandomNumberGenerator()).state();
        }

        private _setSeedRandomInitialState(state: ProtoTypes.Structure.ISeedRandomState): void {
            this._seedRandomInitialState = state;
        }
        public getSeedRandomInitialState(): ProtoTypes.Structure.ISeedRandomState | null {
            return Helpers.getDefined(this._seedRandomInitialState);
        }
    }
}

export default TwnsBwRandomNumberManager;
