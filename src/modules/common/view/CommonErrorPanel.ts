
// import Types                from "../../tools/helpers/Types";
// import Lang                 from "../../tools/lang/Lang";
// import TwnsLangTextType     from "../../tools/lang/LangTextType";
// import TwnsUiButton         from "../../tools/ui/UiButton";
// import TwnsUiLabel          from "../../tools/ui/UiLabel";
// import TwnsUiPanel          from "../../tools/ui/UiPanel";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.Common {
    import LangTextType         = Twns.Lang.LangTextType;

    export type OpenDataForCommonErrorPanel = {
        content     : string;
        callback?   : () => any;
    };
    export class CommonErrorPanel extends TwnsUiPanel.UiPanel<OpenDataForCommonErrorPanel> {
        private readonly _labelTitle!   : TwnsUiLabel.UiLabel;
        private readonly _labelContent! : TwnsUiLabel.UiLabel;
        private readonly _btnClose!     : TwnsUiButton.UiButton;

        protected _onOpening(): void {
            this._setUiListenerArray([
                { ui: this._btnClose, callback: this._onTouchedBtnClose },
            ]);
            this._setIsTouchMaskEnabled();

            this._btnClose.label    = Lang.getText(LangTextType.B0026);
            this._labelTitle.text   = Lang.getText(LangTextType.A0056);
        }
        protected async _updateOnOpenDataChanged(): Promise<void> {
            this._labelContent.text = this._getOpenData().content;
        }
        protected _onClosing(): void {
            // nothing to do
        }

        private _onTouchedBtnClose(): void {
            const openData = this._getOpenData();
            (openData.callback) && (openData.callback());

            this.close();
        }
    }
}

// export default TwnsCommonErrorPanel;
