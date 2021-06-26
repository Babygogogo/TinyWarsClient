
// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace TinyWars.GameUi {
    import Lang = Utility.Lang;

    type DataForUiRadioButton = {
        titleTextType           : Lang.Type;
        leftTextType            : Lang.Type;
        leftLangType?           : Utility.Types.LanguageType;
        rightTextType           : Lang.Type;
        rightLangType?          : Utility.Types.LanguageType;
        callbackOnLeft          : () => void;
        callbackOnRight         : () => void;
        checkerForLeftOn        : () => boolean;
        notifyListenerArray?    : Utility.Notify.Listener[];
    };

    export class UiRadioButton extends UiComponent {
        // @ts-ignore
        private readonly _labelTitle    : GameUi.UiLabel;
        // @ts-ignore
        private readonly _imgLeftOn     : GameUi.UiImage;
        // @ts-ignore
        private readonly _imgLeftOff    : GameUi.UiImage;
        // @ts-ignore
        private readonly _labelLeft     : GameUi.UiLabel;
        // @ts-ignore
        private readonly _imgRightOn    : GameUi.UiImage;
        // @ts-ignore
        private readonly _imgRightOff   : GameUi.UiImage;
        // @ts-ignore
        private readonly _labelRight    : GameUi.UiLabel;

        private _data                   : DataForUiRadioButton | undefined;

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
        private _getData(): DataForUiRadioButton | undefined {
            return this._data;
        }
        private _clearData(): void {
            const data = this._getData();
            if (data) {
                const notifyListenerArray = data.notifyListenerArray;
                (notifyListenerArray) && (Utility.Notify.removeEventListeners(notifyListenerArray));
            }

            this._data = undefined;
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

            this._labelTitle.text   = Lang.getText(data.titleTextType);

            const isLeftOn          = data.checkerForLeftOn();
            const labelLeft         = this._labelLeft;
            labelLeft.text          = Lang.getText(data.leftTextType, data.leftLangType);
            labelLeft.textColor     = getTextColor(isLeftOn);

            const labelRight        = this._labelRight;
            labelRight.text         = Lang.getText(data.rightTextType, data.rightLangType);
            labelRight.textColor    = getTextColor(!isLeftOn);
        }

        private _onTouchedImgLeftOff(): void {
            const data = this._getData();
            if (data) {
                data.callbackOnLeft();
                this.updateView();
            }
        }
        private _onTouchedImgRightOff(): void {
            const data = this._getData();
            if (data) {
                data.callbackOnRight();
                this.updateView();
            }
        }
        private _onNotifyLanguageChanged(): void {
            this._updateLabels();
        }
    }

    function getTextColor(isOn: boolean): number {
        return isOn ? 0xFFFFFF : 0x889988;
    }
}
