
// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace TwnsUiLabel {
    export class UiLabel extends eui.Label {
        public touchEnabled = false;
        public maxTextWidth = 0;
        public wordWrap     = true;

        public constructor() {
            super();

            this.addEventListener(egret.Event.ADDED_TO_STAGE, this._onAddedToStage, this);
        }

        public setRichText(str: string): void {
            this.textFlow = (new egret.HtmlTextParser()).parser(str);
        }

        private _onAddedToStage(): void {
            this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this._onRemovedFromStage, this);
            this.addEventListener(egret.Event.ENTER_FRAME, this._onEnterFrame, this);
            this.removeEventListener(egret.Event.ADDED_TO_STAGE, this._onAddedToStage, this);
        }
        private _onRemovedFromStage(): void {
            this.addEventListener(egret.Event.ADDED_TO_STAGE, this._onAddedToStage, this);
            this.removeEventListener(egret.Event.ENTER_FRAME, this._onEnterFrame, this);
            this.removeEventListener(egret.Event.REMOVED_FROM_STAGE, this._onRemovedFromStage, this);
        }
        private _onEnterFrame(): void {
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
