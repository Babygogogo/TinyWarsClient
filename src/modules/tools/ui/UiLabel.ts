
namespace TwnsUiLabel {
    export class UiLabel extends eui.Label {
        public touchEnabled = false;
        public maxTextWidth = 0;
        public wordWrap     = true;

        public constructor() {
            super();

            this.addEventListener(egret.Event.ENTER_FRAME, this._onRender, this);
        }

        public setRichText(str: string): void {
            this.textFlow = (new egret.HtmlTextParser()).parser(str);
        }

        private _onRender(): void {
            this._autoResize();
        }

        private _autoResize(): void {
            if ((!this.visible) || (!this.stage)) {
                return;
            }

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

// export default TwnsUiLabel;
