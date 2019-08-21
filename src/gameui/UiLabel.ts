
module TinyWars.GameUi {
    export class UiLabel extends eui.Label {
        public touchEnabled = false;
        public maxTextWidth = 0;

        public $setText(value: string): boolean {
            const result = super.$setText(value);
            egret.callLater(() => this.applyMaxTextWidth(), this);
            return result;
        }

        public $setTextColor(color: number): boolean {
            const result = super.$setTextColor(color);
            egret.callLater(() => this.applyMaxTextWidth(), this);
            return result;
        }

        public setRichText(str: string): void {
            this.textFlow = (new egret.HtmlTextParser()).parser(str);
        }

        public applyMaxTextWidth(): void {
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
