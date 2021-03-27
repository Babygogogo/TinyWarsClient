
namespace TinyWars.GameUi {
    type DataForUiRadioButton = {
        leftTextType            : Utility.Lang.Type;
        leftLangType?           : Utility.Types.LanguageType;
        rightTextType           : Utility.Lang.Type;
        rightLangType?          : Utility.Types.LanguageType;
        callbackOnLeft          : () => void;
        callbackOnRight         : () => void;
        checkerForLeftOn        : () => boolean;
        notifyListenerArray?    : Utility.Notify.Listener[];
    };

    export class UiRadioButton extends UiComponent {
        private readonly _imgLeftOn     : GameUi.UiImage;
        private readonly _imgLeftOff    : GameUi.UiImage;
        private readonly _labelLeft     : GameUi.UiLabel;
        private readonly _imgRightOn    : GameUi.UiImage;
        private readonly _imgRightOff   : GameUi.UiImage;
        private readonly _labelRight    : GameUi.UiLabel;

        private _data                   : DataForUiRadioButton;

        protected _onOpened(): void {
            this._setUiListenerArray([
                { ui: this._imgLeftOff,     callback: this._onTouchedImgLeftOff },
                { ui: this._imgRightOff,    callback: this._onTouchedImgRightOff },
            ]);
            this._setNotifyListenerArray([
                { type: Utility.Notify.Type.LanguageChanged,    callback: this._onNotifyLanguageChanged },
            ]);
            this._imgLeftOff.touchEnabled   = true;
            this._imgRightOff.touchEnabled  = true;
        }

        protected async _onClosed(): Promise<void> {
            this._clearData();
        }

        public setData(data: DataForUiRadioButton): void {
            this._clearData();
            this._data = data;

            this.updateView();
        }
        private _getData(): DataForUiRadioButton {
            return this._data;
        }
        private _clearData(): void {
            const data = this._getData();
            if (data) {
                const notifyListenerArray = data.notifyListenerArray;
                (notifyListenerArray) && (Utility.Notify.removeEventListeners(notifyListenerArray));
            }

            this._data = null;
        }

        public updateView(): void {
            const data = this._getData();
            if ((!data) || (!this.getIsOpening())) {
                return;
            }

            this._updateLabels();

            const isLeftOn              = data.checkerForLeftOn();
            this._imgLeftOn.visible     = isLeftOn;
            this._imgLeftOff.visible    = !isLeftOn;
            this._imgRightOn.visible    = !isLeftOn;
            this._imgRightOff.visible   = isLeftOn;
        }
        private _updateLabels(): void {
            const data = this._getData();
            if ((!data) || (!this.getIsOpening())) {
                return;
            }

            this._labelLeft.text    = Utility.Lang.getText(data.leftTextType, data.leftLangType);
            this._labelRight.text   = Utility.Lang.getText(data.rightTextType, data.rightLangType);
        }

        private _onTouchedImgLeftOff(e: egret.TouchEvent): void {
            const data = this._getData();
            if (data) {
                data.callbackOnLeft();
                this.updateView();
            }
        }
        private _onTouchedImgRightOff(e: egret.TouchEvent): void {
            const data = this._getData();
            if (data) {
                data.callbackOnRight();
                this.updateView();
            }
        }
        private _onNotifyLanguageChanged(e: egret.Event): void {
            this._updateLabels();
        }
    }
}
