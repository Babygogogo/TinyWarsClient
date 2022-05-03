
// import Helpers              from "../../tools/helpers/Helpers";
// import Types                from "../../tools/helpers/Types";
// import Lang                 from "../../tools/lang/Lang";
// import TwnsLangTextType     from "../../tools/lang/LangTextType";
// import Twns.Notify       from "../../tools/notify/NotifyType";
// import TwnsUiButton         from "../../tools/ui/UiButton";
// import TwnsUiImage          from "../../tools/ui/UiImage";
// import TwnsUiLabel          from "../../tools/ui/UiLabel";
// import TwnsUiPanel          from "../../tools/ui/UiPanel";
// import MeModel              from "../model/MeModel";
// import TwnsMeWar            from "../model/MeWar";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.MapEditor {
    import MeWar        = Twns.MapEditor.MeWar;
    import LangTextType = TwnsLangTextType.LangTextType;
    import NotifyType   = Twns.Notify.NotifyType;

    export type OpenDataForMeMapTagPanel = void;
    export class MeMapTagPanel extends TwnsUiPanel.UiPanel<OpenDataForMeMapTagPanel> {
        private readonly _labelTitle!   : TwnsUiLabel.UiLabel;
        private readonly _btnCancel!    : TwnsUiButton.UiButton;
        private readonly _btnConfirm!   : TwnsUiButton.UiButton;

        private readonly _groupFog!     : eui.Group;
        private readonly _labelFog!     : TwnsUiLabel.UiLabel;
        private readonly _imgFog!       : TwnsUiImage.UiImage;

        protected _onOpening(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged, callback: this._onNotifyLanguageChanged },
            ]);
            this._setUiListenerArray([
                { ui: this._btnConfirm,     callback: this._onTouchedBtnConfirm },
                { ui: this._btnCancel,      callback: this._onTouchedBtnCancel },
                { ui: this._groupFog,       callback: this._onTouchedGroupMcw },
            ]);
            this._setIsTouchMaskEnabled();
            this._setIsCloseOnTouchedMask();
        }
        protected async _updateOnOpenDataChanged(): Promise<void> {
            this._updateComponentsForLanguage();

            this._imgFog.visible = !!(this._getWar().getMapTag() || {}).fog;
        }
        protected _onClosing(): void {
            // nothing to do
        }

        private _getWar(): MeWar {
            return Twns.Helpers.getExisted(Twns.MapEditor.MeModel.getWar());
        }

        private _onNotifyLanguageChanged(): void {
            this._updateComponentsForLanguage();
        }

        private _onTouchedBtnConfirm(): void {
            this._getWar().setMapTag({
                fog     : this._imgFog.visible ? true : null,
            });
            this.close();
        }

        private _onTouchedBtnCancel(): void {
            this.close();
        }

        private _onTouchedGroupMcw(): void {
            if (!this._getWar().getIsReviewingMap()) {
                this._imgFog.visible = !this._imgFog.visible;
            }
        }

        private _updateComponentsForLanguage(): void {
            this._labelTitle.text   = Lang.getText(LangTextType.B0445);
            this._btnConfirm.label  = Lang.getText(LangTextType.B0026);
            this._labelFog.text     = Lang.getText(LangTextType.B0438);
        }
    }
}

// export default TwnsMeMapTagPanel;
