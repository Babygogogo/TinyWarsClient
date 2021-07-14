
import TwnsUiImage                  from "./UiImage";
import TwnsUiComponent              from "./UiComponent";
import TwnsUiLabel                  from "./UiLabel";
import TwnsLangTextType             from "../lang/LangTextType";
import TwnsNotifyType               from "../notify/NotifyType";
import Lang                         from "../lang/Lang";
import Notify                       from "../notify/Notify";
import Types                        from "../helpers/Types";

namespace TwnsUiRadioButton {
    import LangTextType     = TwnsLangTextType.LangTextType;
    import NotifyType       = TwnsNotifyType.NotifyType;

    type DataForUiRadioButton = {
        titleTextType           : LangTextType;
        leftTextType            : LangTextType;
        leftLangType?           : Types.LanguageType;
        rightTextType           : LangTextType;
        rightLangType?          : Types.LanguageType;
        callbackOnLeft          : () => void;
        callbackOnRight         : () => void;
        checkerForLeftOn        : () => boolean;
        notifyListenerArray?    : Notify.Listener[];
    };

    export class UiRadioButton extends TwnsUiComponent.UiComponent {
        // @ts-ignore
        private readonly _labelTitle    : TwnsUiLabel.UiLabel;
        // @ts-ignore
        private readonly _imgLeftOn     : TwnsUiImage.UiImage;
        // @ts-ignore
        private readonly _imgLeftOff    : TwnsUiImage.UiImage;
        // @ts-ignore
        private readonly _labelLeft     : TwnsUiLabel.UiLabel;
        // @ts-ignore
        private readonly _imgRightOn    : TwnsUiImage.UiImage;
        // @ts-ignore
        private readonly _imgRightOff   : TwnsUiImage.UiImage;
        // @ts-ignore
        private readonly _labelRight    : TwnsUiLabel.UiLabel;

        private _data                   : DataForUiRadioButton | undefined;

        protected _onOpened(): void {
            this._setUiListenerArray([
                { ui: this._imgLeftOff,     callback: this._onTouchedImgLeftOff },
                { ui: this._imgRightOff,    callback: this._onTouchedImgRightOff },
            ]);
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,    callback: this._onNotifyLanguageChanged },
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
                (notifyListenerArray) && (Notify.removeEventListeners(notifyListenerArray));
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

export default TwnsUiRadioButton;
