
import TwnsUiComponent from "./UiComponent";

namespace TwnsUiTabPage {
    export abstract class UiTabPage<OpenData> extends TwnsUiComponent.UiComponent {
        private _openData   : OpenData;

        protected constructor() {
            super();

            this.touchEnabled = false;
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for open self.
        ////////////////////////////////////////////////////////////////////////////////
        public open(parent: egret.DisplayObjectContainer, data: OpenData): void {
            this._setOpenData(data);
            parent.addChild(this);

            this._doOpen();
        }

        private _setOpenData(data: OpenData): void {
            this._openData = data;
        }
        protected _getOpenData(): OpenData {
            return this._openData;
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for close self.
        ////////////////////////////////////////////////////////////////////////////////
        public close(): void {
            (this.parent) && (this.parent.removeChild(this));

            this._doClose();

            this._setOpenData(undefined);
        }
    }
}

export default TwnsUiTabPage;
