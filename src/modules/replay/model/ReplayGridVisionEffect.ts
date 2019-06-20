
namespace TinyWars.Replay {
    export class ReplayGridVisionEffect extends BaseWar.BwGridVisionEffect {
        protected _getViewClass(): new () => ReplayGridVisionEffectView {
            return ReplayGridVisionEffectView;
        }
    }
}
