
namespace TinyWars.BaseWar {
    import ProtoTypes       = Utility.ProtoTypes;
    import ClientErrorCode  = Utility.ClientErrorCode;
    import Logger           = Utility.Logger;
    import ISeedRandomState = ProtoTypes.Structure.ISeedRandomState;

    export class BwRandomNumberManager {
        private _isNeedReplay?              : boolean;
        private _seedRandomInitialState?    : ProtoTypes.Structure.ISeedRandomState;
        private _randomNumberGenerator?     : seedrandom.prng;

        public init({ isNeedSeedRandom, initialState, currentState }: {
            isNeedSeedRandom: boolean;
            initialState    : ISeedRandomState | null | undefined;
            currentState    : ISeedRandomState | null | undefined;
        }): ClientErrorCode {
            this._setIsNeedReplay(isNeedSeedRandom);

            if (isNeedSeedRandom) {
                // TODO: check if the states are valid.
                if (initialState == null) {
                    return ClientErrorCode.BwRandomNumberManager00;
                }
                this._setSeedRandomInitialState(initialState);

                if (currentState == null) {
                    return ClientErrorCode.BwRandomNumberManager01;
                }
                this._setRandomNumberGenerator(new Math.seedrandom("", { state: currentState }));
            }

            return ClientErrorCode.NoError;
        }

        private _setIsNeedReplay(isNeedReplay: boolean): void {
            this._isNeedReplay = isNeedReplay;
        }
        private _getIsNeedReplay(): boolean | undefined {
            return this._isNeedReplay;
        }

        private _setRandomNumberGenerator(generator: seedrandom.prng): void {
            this._randomNumberGenerator = generator;
        }
        private _getRandomNumberGenerator(): seedrandom.prng | undefined {
            return this._randomNumberGenerator;
        }

        public getRandomNumber(): number | undefined {
            if (!this._getIsNeedReplay()) {
                return Math.random();
            }

            const generator = this._getRandomNumberGenerator();
            if (generator == null) {
                Logger.error(`BwRandomNumberManager.getRandomNumber() empty generator.`);
                return undefined;
            }
            return generator();
        }

        public getSeedRandomCurrentState(): ProtoTypes.Structure.ISeedRandomState | undefined {
            if (!this._getIsNeedReplay()) {
                return undefined;
            }

            const generator = this._getRandomNumberGenerator();
            if (generator == null) {
                Logger.error(`BwRandomNumberManager.getRandomNumber() empty generator.`);
                return undefined;
            }
            return generator.state();
        }

        private _setSeedRandomInitialState(state: ProtoTypes.Structure.ISeedRandomState): void {
            this._seedRandomInitialState = state;
        }
        public getSeedRandomInitialState(): ProtoTypes.Structure.ISeedRandomState | undefined {
            return this._seedRandomInitialState;
        }
    }
}
