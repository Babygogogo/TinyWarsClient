
// import TwnsClientErrorCode  from "../helpers/ClientErrorCode";
// import Helpers              from "../helpers/Helpers";
// import Logger               from "../helpers/Logger";
// import TwnsUiComponent      from "./UiComponent";

namespace TwnsUiTabPage {
    import ClientErrorCode = TwnsClientErrorCode.ClientErrorCode;

    export abstract class UiTabPage<OpenData> extends TwnsUiComponent.UiComponent {
        private _openData?  : OpenData;

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

            Logger.warn("UiTabPage opened: " + this.skinName);
            this._doOpen();
        }

        private _setOpenData(data: OpenData): void {
            this._openData = data;
        }
        protected _getOpenData(): OpenData {
            return Twns.Helpers.getDefined(this._openData, ClientErrorCode.UiTabPage_GetOpenData_00);
        }
        private _clearOpenData(): void {
            delete this._openData;
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for close self.
        ////////////////////////////////////////////////////////////////////////////////
        public close(): void {
            (this.parent) && (this.parent.removeChild(this));

            this._doClose();
            this._clearOpenData();
        }
    }
}

// export default TwnsUiTabPage;
