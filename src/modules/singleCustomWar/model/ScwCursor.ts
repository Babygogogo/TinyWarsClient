
namespace TinyWars.SingleCustomWar {
    export class ScwCursor extends BaseWar.BwCursor {
        protected _getViewClass(): new () => BaseWar.BwCursorView {
            return ScwCursorView;
        }
    }
}
