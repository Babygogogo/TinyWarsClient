
namespace TinyWars.MapEditor {
    export class MeCursorView extends BaseWar.BwCursorView {
        protected _updateConForDamage(): void {
            this._getConForDamage().visible = false;
        }
    }
}
