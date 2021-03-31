
namespace TinyWars.GameUi {
    export abstract class UiTabPage extends UiComponent {
        private _openData   : any;

        protected constructor() {
            super();

            this.touchEnabled = false;
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for open self.
        ////////////////////////////////////////////////////////////////////////////////
        public open(parent: egret.DisplayObjectContainer, data: any): void {
            this._setOpenData(data);
            parent.addChild(this);

            this._doOpen();
        }

        private _setOpenData(data: any): void {
            this._openData = data;
        }
        protected _getOpenData<T>(): T {
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
