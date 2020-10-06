
namespace TinyWars.MapEditor {
    export class MeGridVisionEffect extends BaseWar.BwGridVisionEffect {
        protected _getViewClass(): new () => BaseWar.BwGridVisionEffectView {
            return MeGridVisionEffectView;
        }
    }
}
