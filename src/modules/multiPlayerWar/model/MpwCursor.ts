
namespace TinyWars.MultiPlayerWar {
    export class MpwCursor extends BaseWar.BwCursor {
        protected _getViewClass(): new () => BaseWar.BwCursorView {
            return McwCursorView;
        }
    }
}
