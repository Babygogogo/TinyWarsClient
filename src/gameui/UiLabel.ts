
module GameUi {
    export class UiLabel extends eui.Label {
        public touchEnabled = false;

        public setRichText(str: string): void {
            this.textFlow = (new egret.HtmlTextParser()).parser(str);
        }
    }
}
