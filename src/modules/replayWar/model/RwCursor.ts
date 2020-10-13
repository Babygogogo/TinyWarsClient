
namespace TinyWars.ReplayWar {
    export class RwCursor extends BaseWar.BwCursor {
        protected _getViewClass(): new () => BaseWar.BwCursorView {
            return RwCursorView;
        }
    }
}
