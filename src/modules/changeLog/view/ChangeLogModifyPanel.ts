
namespace TinyWars.ChangeLog {
    import Notify           = Utility.Notify;
    import Lang             = Utility.Lang;
    import ConfigManager    = Utility.ConfigManager;
    import Types            = Utility.Types;
    import FloatText        = Utility.FloatText;
    import ProtoTypes       = Utility.ProtoTypes;
    import ILanguageText    = ProtoTypes.Structure.ILanguageText;
    import CommonConstants  = ConfigManager.COMMON_CONSTANTS;

    type OpenDataForChangeLogModifyPanel = {
        messageId   : number;
    }

    export class ChangeLogModifyPanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Hud1;
        protected readonly _IS_EXCLUSIVE = false;

        private static _instance: ChangeLogModifyPanel;

        private _openData       : OpenDataForChangeLogModifyPanel;
        private _inputChinese   : GameUi.UiTextInput;
        private _inputEnglish   : GameUi.UiTextInput;
        private _labelTip       : GameUi.UiLabel;
        private _labelTitle     : GameUi.UiLabel;
        private _labelChinese   : GameUi.UiLabel;
        private _labelEnglish   : GameUi.UiLabel;
        private _btnModify      : GameUi.UiButton;
        private _btnClose       : GameUi.UiButton;

        public static show(openData: OpenDataForChangeLogModifyPanel): void {
            if (!ChangeLogModifyPanel._instance) {
                ChangeLogModifyPanel._instance = new ChangeLogModifyPanel();
            }

            ChangeLogModifyPanel._instance._openData = openData;
            ChangeLogModifyPanel._instance.open();
        }

        public static hide(): void {
            if (ChangeLogModifyPanel._instance) {
                ChangeLogModifyPanel._instance.close();
            }
        }

        private constructor() {
            super();

            this._setAutoAdjustHeightEnabled(true);
            this._setTouchMaskEnabled(true);
            this._callbackForTouchMask  = () => this.close();
            this.skinName               = "resource/skins/changeLog/ChangeLogModifyPanel.exml";
        }

        protected _onFirstOpened(): void {
            this._notifyListeners = [
                { type: Notify.Type.LanguageChanged,    callback: this._onNotifyLanguageChanged },
            ];
            this._uiListeners = [
                { ui: this._btnClose,   callback: this.close },
                { ui: this._btnModify,  callback: this._onTouchedBtnModify },
            ];

            this._inputChinese.maxChars = CommonConstants.ChangeLogTextMaxLength;
            this._inputEnglish.maxChars = CommonConstants.ChangeLogTextMaxLength;
        }

        protected _onOpened(): void {
            this._updateView();
        }

        private _onNotifyLanguageChanged(e: egret.Event): void {
            this._updateComponentsForLanguage();
        }

        private _onTouchedBtnModify(e: egret.TouchEvent): void {
            const chineseText   = this._inputChinese.text || ``;
            const englishText   = this._inputEnglish.text || ``;
            const textList      : ILanguageText[] = [
                { languageType: Types.LanguageType.Chinese, text: chineseText || englishText },
                { languageType: Types.LanguageType.English, text: englishText || chineseText },
            ];
            if (textList.every(v => v.text.length <= 0)) {
                FloatText.show(Lang.getText(Lang.Type.A0155));
            } else if (textList.some(v => v.text.length > CommonConstants.ChangeLogTextMaxLength)) {
                FloatText.show(Lang.getFormattedText(Lang.Type.F0034, CommonConstants.ChangeLogTextMaxLength));
            } else {
                ChangeLogProxy.reqChangeLogModifyMessage(this._openData.messageId, textList);
                this.close();
            }
        }

        private _updateView(): void {
            this._updateComponentsForLanguage();

            const textList          = ChangeLogModel.getMessage(this._openData.messageId).textList || [];
            this._inputChinese.text = Lang.getTextInLanguage(textList, Types.LanguageType.Chinese);
            this._inputEnglish.text = Lang.getTextInLanguage(textList, Types.LanguageType.English);
        }

        private _updateComponentsForLanguage(): void {
            this._btnClose.label    = Lang.getText(Lang.Type.B0146);
            this._btnModify.label   = Lang.getText(Lang.Type.B0317);
            this._labelChinese.text = Lang.getText(Lang.Type.B0455);
            this._labelEnglish.text = Lang.getText(Lang.Type.B0456);
            this._labelTip.text     = Lang.getText(Lang.Type.A0156);
            this._labelTitle.text   = `${Lang.getText(Lang.Type.B0317)} #${this._openData.messageId}`;
        }
    }
}
