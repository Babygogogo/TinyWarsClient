
namespace TinyWars.MultiCustomWar {
    export class McwCursor extends BaseWar.BwCursor {
        protected _getViewClass(): new () => BaseWar.BwCursorView {
            return McwCursorView;
        }
    }
}
