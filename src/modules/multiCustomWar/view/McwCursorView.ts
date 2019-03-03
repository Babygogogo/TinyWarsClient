
namespace TinyWars.MultiCustomWar {
    import Types = Utility.Types;

    export class McwCursorView extends egret.DisplayObjectContainer {
        private _cursor         : McwCursor;

        public init(cursor: McwCursor): void {
            egret.assert(!this._cursor, "McwCursorView.init() already initialied!");
            this._cursor = cursor;
        }

        public startRunningView(): void {
        }
        public stopRunningView(): void {
        }

        public updateView(): void {

        }
    }
}
