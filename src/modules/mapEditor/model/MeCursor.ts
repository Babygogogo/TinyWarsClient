
namespace TinyWars.MapEditor {
    export class MeCursor extends BaseWar.BwCursor {
        protected _getViewClass(): new () => BaseWar.BwCursorView {
            return MeCursorView;
        }
    }
}
