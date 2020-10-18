
namespace TinyWars.SinglePlayerWar {
    import Logger                   = Utility.Logger;
    import ProtoTypes               = Utility.ProtoTypes;
    import ISeedRandomState         = ProtoTypes.Structure.ISeedRandomState;

    export abstract class SpwWar extends BaseWar.BwWar {
        private _seedRandomInitialState     : ProtoTypes.Structure.ISeedRandomState;
        private _randomNumberGenerator      : seedrandom.prng;

        protected _setSeedRandomInitialState(state: ISeedRandomState): void {
            this._seedRandomInitialState = state;
        }
        protected _getSeedRandomInitialState(): ISeedRandomState | undefined {
            return this._seedRandomInitialState;
        }

        protected _setRandomNumberGenerator(generator: seedrandom.prng): void {
            this._randomNumberGenerator = generator;
        }
        private _getRandomNumberGenerator(): seedrandom.prng {
            return this._randomNumberGenerator;
        }
        public getRandomNumber(): number | undefined {
            const generator = this._getRandomNumberGenerator();
            if (generator == null) {
                Logger.error(`BwWar.getRandomNumber() empty generator.`);
                return undefined;
            }
            return generator();
        }
        protected _getSeedRandomCurrentState(): ISeedRandomState | undefined {
            const generator = this._getRandomNumberGenerator();
            if (generator == null) {
                Logger.error(`BwWar.getRandomNumber() empty generator.`);
                return undefined;
            }
            return generator.state();
        }
    }
}
