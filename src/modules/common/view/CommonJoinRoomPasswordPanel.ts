
import CommonConstants      from "../../tools/helpers/CommonConstants";
import CompatibilityHelpers from "../../tools/helpers/CompatibilityHelpers";
import FloatText            from "../../tools/helpers/FloatText";
import Helpers              from "../../tools/helpers/Helpers";
import Types                from "../../tools/helpers/Types";
import Lang                 from "../../tools/lang/Lang";
import TwnsLangTextType     from "../../tools/lang/LangTextType";
import TwnsNotifyType       from "../../tools/notify/NotifyType";
import TwnsUiButton         from "../../tools/ui/UiButton";
import TwnsUiImage          from "../../tools/ui/UiImage";
import TwnsUiLabel          from "../../tools/ui/UiLabel";
import TwnsUiPanel          from "../../tools/ui/UiPanel";
import TwnsUiTextInput      from "../../tools/ui/UiTextInput";
import WarMapModel          from "../../warMap/model/WarMapModel";

namespace TwnsCommonJoinRoomPasswordPanel {
    import LangTextType     = TwnsLangTextType.LangTextType;
    import NotifyType       = TwnsNotifyType.NotifyType;

    type OpenData = {
        warName             : string | null;
        mapId               : number | null;
        password            : string;
        callbackOnSucceed   : () => void;
    };
    export class CommonJoinRoomPasswordPanel extends TwnsUiPanel.UiPanel<OpenData> {
        protected readonly _LAYER_TYPE   = Types.LayerType.Hud0;
        protected readonly _IS_EXCLUSIVE = true;

        private static _instance: CommonJoinRoomPasswordPanel;

        private readonly _imgMask!              : TwnsUiImage.UiImage;
        private readonly _group!                : eui.Group;
        private readonly _labelTitle!           : TwnsUiLabel.UiLabel;
        private readonly _labelRoomTitle!       : TwnsUiLabel.UiLabel;
        private readonly _labelPasswordTitle!   : TwnsUiLabel.UiLabel;
        private readonly _labelWarName!         : TwnsUiLabel.UiLabel;
        private readonly _inputWarPassword!     : TwnsUiTextInput.UiTextInput;
        private readonly _btnCancel!            : TwnsUiButton.UiButton;
        private readonly _btnConfirm!           : TwnsUiButton.UiButton;

        public static show(openData: OpenData): void {
            if (!CommonJoinRoomPasswordPanel._instance) {
                CommonJoinRoomPasswordPanel._instance = new CommonJoinRoomPasswordPanel();
            }
            CommonJoinRoomPasswordPanel._instance.open(openData);
        }
        public static async hide(): Promise<void> {
            if (CommonJoinRoomPasswordPanel._instance) {
                await CommonJoinRoomPasswordPanel._instance.close().catch(err => { CompatibilityHelpers.showError(err); throw err; });
            }
        }

        private constructor() {
            super();

            this._setIsTouchMaskEnabled();
            this._setIsCloseOnTouchedMask();
            this.skinName = "resource/skins/common/CommonJoinRoomPasswordPanel.exml";
        }

        protected _onOpened(): void {
            this._setUiListenerArray([
                { ui: this._btnCancel,        callback: this._onTouchedBtnCancel },
                { ui: this._btnConfirm,       callback: this._onTouchedBtnConfirm },
            ]);
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,    callback: this._onNotifyLanguageChanged },
            ]);

            this._showOpenAnimation();
            this._updateComponentsForLanguage();
            this._inputWarPassword.text = "";
        }
        protected async _onClosed(): Promise<void> {
            await this._showCloseAnimation().catch(err => { CompatibilityHelpers.showError(err); throw err; });
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
                    label.text = await WarMapModel.getMapNameInCurrentLanguage(mapId).catch(err => { CompatibilityHelpers.showError(err); throw err; }) || CommonConstants.ErrorTextForUndefined;
                } else {
                    label.text = Lang.getText(LangTextType.B0555);
                }
            }
        }

        private _showOpenAnimation(): void {
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
        }
        private _showCloseAnimation(): Promise<void> {
            return new Promise<void>(resolve => {
                Helpers.resetTween({
                    obj         : this._imgMask,
                    beginProps  : { alpha: 1 },
                    endProps    : { alpha: 0 },
                });

                Helpers.resetTween({
                    obj         : this._group,
                    beginProps  : { alpha: 1, verticalCenter: 0 },
                    endProps    : { alpha: 0, verticalCenter: -40 },
                    callback    : resolve,
                });
            });
        }
    }
}

export default TwnsCommonJoinRoomPasswordPanel;
