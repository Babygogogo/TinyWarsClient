
import SoundManager     from "../helpers/SoundManager";
import Types            from "../helpers/Types";
import Lang             from "../lang/Lang";
import TwnsLangTextType from "../lang/LangTextType";
import Notify           from "../notify/Notify";
import TwnsNotifyType   from "../notify/NotifyType";
import TwnsUiComponent  from "./UiComponent";
import TwnsUiImage      from "./UiImage";
import TwnsUiLabel      from "./UiLabel";

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
        private readonly _labelTitle!   : TwnsUiLabel.UiLabel;
        private readonly _imgLeftOn!    : TwnsUiImage.UiImage;
        private readonly _imgLeftOff!   : TwnsUiImage.UiImage;
        private readonly _labelLeft!    : TwnsUiLabel.UiLabel;
        private readonly _imgRightOn!   : TwnsUiImage.UiImage;
        private readonly _imgRightOff!  : TwnsUiImage.UiImage;
        private readonly _labelRight!   : TwnsUiLabel.UiLabel;

        private _data                   : DataForUiRadioButton | null = null;

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
        private _getData(): DataForUiRadioButton | null {
            return this._data;
        }
        private _clearData(): void {
            const data = this._getData();
            if (data) {
                const notifyListenerArray = data.notifyListenerArray;
                (notifyListenerArray) && (Notify.removeEventListeners(notifyListenerArray));
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
                SoundManager.playShortSfx(Types.ShortSfxCode.ButtonConfirm01);
            }
        }
        private _onTouchedImgRightOff(): void {
            const data = this._getData();
            if (data) {
                data.callbackOnRight();
                this.updateView();
                SoundManager.playShortSfx(Types.ShortSfxCode.ButtonConfirm01);
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
