
// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace TinyWars.GameUi {
    export class UiLabel extends eui.Label {
        public touchEnabled = false;
        public maxTextWidth = 0;
        public wordWrap     = true;

        public constructor() {
            super();

            this.addEventListener(egret.Event.RESIZE, this._onResize, this);
        }

        public setRichText(str: string): void {
            this.textFlow = (new egret.HtmlTextParser()).parser(str);
        }

        private _onResize(): void {
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
