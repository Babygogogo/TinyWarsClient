
module GameUi {
    export class UILabel extends eui.Label {
        public setRichText(str: string): void {
            this.textFlow = (new egret.HtmlTextParser()).parser(str);
        }
    }
}
