
namespace TinyWars.ReplayWar {
    export class RwGridVisionEffect extends BaseWar.BwGridVisionEffect {
        protected _getViewClass(): new () => RwGridVisionEffectView {
            return RwGridVisionEffectView;
        }
    }
}
