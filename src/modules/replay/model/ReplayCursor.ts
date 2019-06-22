
namespace TinyWars.Replay {
    export class ReplayCursor extends BaseWar.BwCursor {
        protected _getViewClass(): new () => BaseWar.BwCursorView {
            return ReplayCursorView;
        }
    }
}
