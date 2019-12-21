
namespace TinyWars.SingleCustomWar {
    export class ScwGridVisionEffect extends BaseWar.BwGridVisionEffect {
        protected _getViewClass(): new () => ScwGridVisionEffectView {
            return ScwGridVisionEffectView;
        }
    }
}
