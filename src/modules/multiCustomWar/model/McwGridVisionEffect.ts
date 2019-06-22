
namespace TinyWars.MultiCustomWar {
    export class McwGridVisionEffect extends BaseWar.BwGridVisionEffect {
        protected _getViewClass(): new () => McwGridVisionEffectView {
            return McwGridVisionEffectView;
        }
    }
}
