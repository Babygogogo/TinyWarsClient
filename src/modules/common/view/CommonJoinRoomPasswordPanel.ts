
// import CommonConstants      from "../../tools/helpers/CommonConstants";
// import FloatText            from "../../tools/helpers/FloatText";
// import Helpers              from "../../tools/helpers/Helpers";
// import Types                from "../../tools/helpers/Types";
// import Lang                 from "../../tools/lang/Lang";
// import TwnsLangTextType     from "../../tools/lang/LangTextType";
// import TwnsNotifyType       from "../../tools/notify/NotifyType";
// import TwnsUiButton         from "../../tools/ui/UiButton";
// import TwnsUiImage          from "../../tools/ui/UiImage";
// import TwnsUiLabel          from "../../tools/ui/UiLabel";
// import TwnsUiPanel          from "../../tools/ui/UiPanel";
// import TwnsUiTextInput      from "../../tools/ui/UiTextInput";
// import WarMapModel          from "../../warMap/model/WarMapModel";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace TwnsCommonJoinRoomPasswordPanel {
    import LangTextType     = TwnsLangTextType.LangTextType;
    import NotifyType       = TwnsNotifyType.NotifyType;

    export type OpenData = {
        warName             : string | null;
        mapId               : number | null;
        password            : string;
        callbackOnSucceed   : () => void;
    };
    export class CommonJoinRoomPasswordPanel extends TwnsUiPanel.UiPanel<OpenData> {
        private readonly _imgMask!              : TwnsUiImage.UiImage;
        private readonly _group!                : eui.Group;
        private readonly _labelTitle!           : TwnsUiLabel.UiLabel;
        private readonly _labelRoomTitle!       : TwnsUiLabel.UiLabel;
        private readonly _labelPasswordTitle!   : TwnsUiLabel.UiLabel;
        private readonly _labelWarName!         : TwnsUiLabel.UiLabel;
        private readonly _inputWarPassword!     : TwnsUiTextInput.UiTextInput;
        private readonly _labelTips!            : TwnsUiLabel.UiLabel;
        private readonly _btnCancel!            : TwnsUiButton.UiButton;
        private readonly _btnConfirm!           : TwnsUiButton.UiButton;

        protected _onOpening(): void {
            this._setUiListenerArray([
                { ui: this._btnCancel,        callback: this._onTouchedBtnCancel },
                { ui: this._btnConfirm,       callback: this._onTouchedBtnConfirm },
            ]);
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,    callback: this._onNotifyLanguageChanged },
            ]);
            this._setIsTouchMaskEnabled();
            this._setIsCloseOnTouchedMask();
        }
        protected async _updateOnOpenDataChanged(): Promise<void> {
            this._updateComponentsForLanguage();
            this._inputWarPassword.text = "";
        }
        protected _onClosing(): void {
            // nothing to do
        }

        private _onNotifyLanguageChanged(): void {
            this._updateComponentsForLanguage();
        }

        private _onTouchedBtnCancel(): void {
            this.close();
        }

        private async _onTouchedBtnConfirm(): Promise<void> {
            const openData = this._getOpenData();
            if (this._inputWarPassword.text !== openData.password) {
                FloatText.show(Lang.getText(LangTextType.A0017));
            } else {
                openData.callbackOnSucceed();
                this.close();
            }
        }

        private _updateComponentsForLanguage(): void {
            this._labelTitle.text           = Lang.getText(LangTextType.B0449);
            this._labelRoomTitle.text       = `${Lang.getText(LangTextType.B0405)}:`;
            this._labelPasswordTitle.text   = `${Lang.getText(LangTextType.B0171)}:`;
            this._btnCancel.label           = Lang.getText(LangTextType.B0154);
            this._btnConfirm.label          = Lang.getText(LangTextType.B0026);
            this._labelTips.text            = Lang.getFormattedText(LangTextType.F0068, CommonConstants.WarPasswordMaxLength);
            this._updateLabelWarName();
        }
        private async _updateLabelWarName(): Promise<void> {
            const openData  = this._getOpenData();
            const warName   = openData.warName;
            const label     = this._labelWarName;
            if (warName) {
                label.text = warName;
            } else {
                const mapId = openData.mapId;
                if (mapId != null) {
                    label.text = await WarMapModel.getMapNameInCurrentLanguage(mapId) || CommonConstants.ErrorTextForUndefined;
                } else {
                    label.text = Lang.getText(LangTextType.B0555);
                }
            }
        }

        protected async _showOpenAnimation(): Promise<void> {
            Helpers.resetTween({
                obj         : this._imgMask,
                beginProps  : { alpha: 0 },
                endProps    : { alpha: 1 },
            });
            Helpers.resetTween({
                obj         : this._group,
                beginProps  : { alpha: 0, verticalCenter: -40 },
                endProps    : { alpha: 1, verticalCenter: 0 },
            });

            await Helpers.wait(CommonConstants.DefaultTweenTime);
        }
        protected async _showCloseAnimation(): Promise<void> {
            Helpers.resetTween({
                obj         : this._imgMask,
                beginProps  : { alpha: 1 },
                endProps    : { alpha: 0 },
            });
            Helpers.resetTween({
                obj         : this._group,
                beginProps  : { alpha: 1, verticalCenter: 0 },
                endProps    : { alpha: 0, verticalCenter: -40 },
            });

            await Helpers.wait(CommonConstants.DefaultTweenTime);
        }
    }
}

// export default TwnsCommonJoinRoomPasswordPanel;
