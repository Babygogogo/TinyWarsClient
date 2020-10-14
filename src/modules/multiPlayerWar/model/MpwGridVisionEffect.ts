
namespace TinyWars.MultiPlayerWar {
    export class MpwGridVisionEffect extends BaseWar.BwGridVisionEffect {
        protected _getViewClass(): new () => McwGridVisionEffectView {
            return McwGridVisionEffectView;
        }
    }
}
