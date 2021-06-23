
// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace TinyWars.GameUi {
    export class UiLabel extends eui.Label {
        public touchEnabled = false;
        public maxTextWidth = 0;
        public wordWrap     = true;

        public $setText(value: string): boolean {
            const result = super.$setText(value);
            this.applyMaxTextWidth();
            return result;
        }

        public $setTextColor(color: number): boolean {
            const result = super.$setTextColor(color);
            this.applyMaxTextWidth();
            return result;
        }

        public setRichText(str: string): void {
            this.textFlow = (new egret.HtmlTextParser()).parser(str);
        }

        public applyMaxTextWidth(): void {
            if (this.maxWidth > 0) {
                this.once(egret.Event.ENTER_FRAME, this._onEnterFrameForApplyMaxTextWidth, this);
            }
        }

        private _onEnterFrameForApplyMaxTextWidth(): void {
            const maxWidth = this.maxTextWidth;
            if (maxWidth > 0) {
                const currWidth = this.textWidth;
                this.scaleX     = (currWidth > maxWidth)
                    ? maxWidth / currWidth
                    : 1;
            }
        }
    }
}
