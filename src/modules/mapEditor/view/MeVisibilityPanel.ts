
// import TwnsBwWar            from "../../baseWar/model/BwWar";
// import Helpers              from "../../tools/helpers/Helpers";
// import Types                from "../../tools/helpers/Types";
// import Lang                 from "../../tools/lang/Lang";
// import TwnsLangTextType     from "../../tools/lang/LangTextType";
// import TwnsNotifyType       from "../../tools/notify/NotifyType";
// import TwnsUiImage          from "../../tools/ui/UiImage";
// import TwnsUiLabel          from "../../tools/ui/UiLabel";
// import TwnsUiPanel          from "../../tools/ui/UiPanel";
// import MeModel              from "../model/MeModel";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace TwnsMeVisibilityPanel {
    import LangTextType = TwnsLangTextType.LangTextType;
    import NotifyType   = TwnsNotifyType.NotifyType;

    export type OpenData = void;
    export class MeVisibilityPanel extends TwnsUiPanel.UiPanel<OpenData> {
        private readonly _groupUnit!            : eui.Group;
        private readonly _labelUnit!            : TwnsUiLabel.UiLabel;
        private readonly _imgUnit!              : TwnsUiImage.UiImage;
        private readonly _groupTileObject!      : eui.Group;
        private readonly _imgTileObject!        : TwnsUiImage.UiImage;
        private readonly _labelTileObject!      : TwnsUiLabel.UiLabel;
        private readonly _groupTileBase!        : eui.Group;
        private readonly _imgTileBase!          : TwnsUiImage.UiImage;
        private readonly _labelTileBase!        : TwnsUiLabel.UiLabel;
        private readonly _groupTileDecorator!   : eui.Group;
        private readonly _imgTileDecorator!     : TwnsUiImage.UiImage;
        private readonly _labelTileDecorator!   : TwnsUiLabel.UiLabel;

        protected _onOpening(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged, callback: this._onNotifyLanguageChanged },
            ]);
            this._setUiListenerArray([
                { ui: this._groupTileBase,      callback: this._onTouchedGroupTileBase, },
                { ui: this._groupTileDecorator, callback: this._onTouchedGroupTileDecorator },
                { ui: this._groupTileObject,    callback: this._onTouchedGroupTileObject, },
                { ui: this._groupUnit,          callback: this._onTouchedGroupUnit },
            ]);
            this._setIsTouchMaskEnabled();
            this._setIsCloseOnTouchedMask();
        }
        protected async _updateOnOpenDataChanged(): Promise<void> {
            this._updateComponentsForLanguage();

            this._updateGroupUnit();
            this._updateGroupTileBase();
            this._updateGroupTileDecorator();
            this._updateGroupTileObject();
        }
        protected _onClosing(): void {
            // nothing to do
        }

        private _getWar(): TwnsBwWar.BwWar {
            return Helpers.getExisted(MeModel.getWar());
        }

        private _onTouchedGroupTileBase(): void {
            const view = this._getWar().getField().getView();
            view.setTileBasesVisible(!view.getTileBasesVisible());
            this._updateGroupTileBase();
        }

        private _onTouchedGroupTileDecorator(): void {
            const view = this._getWar().getField().getView();
            view.setTileDecoratorsVisible(!view.getTileDecoratorsVisible());
            this._updateGroupTileDecorator();
        }

        private _onTouchedGroupTileObject(): void {
            const view = this._getWar().getField().getView();
            view.setTileObjectsVisible(!view.getTileObjectsVisible());
            this._updateGroupTileObject();
        }

        private _onTouchedGroupUnit(): void {
            const view = this._getWar().getField().getView();
            view.setUnitsVisible(!view.getUnitsVisible());
            this._updateGroupUnit();
        }

        private _onNotifyLanguageChanged(): void {
            this._updateComponentsForLanguage();
        }

        private _updateComponentsForLanguage(): void {
            this._labelTileBase.text        = Lang.getText(LangTextType.B0302);
            this._labelTileDecorator.text   = Lang.getText(LangTextType.B0664);
            this._labelTileObject.text      = Lang.getText(LangTextType.B0303);
            this._labelUnit.text            = Lang.getText(LangTextType.B0304);
        }

        private _updateGroupUnit(): void {
            this._imgUnit.visible = this._getWar().getField().getView().getUnitsVisible();
        }
        private _updateGroupTileBase(): void {
            this._imgTileBase.visible = this._getWar().getField().getView().getTileBasesVisible();
        }
        private _updateGroupTileDecorator(): void {
            this._imgTileDecorator.visible = this._getWar().getField().getView().getTileDecoratorsVisible();
        }
        public _updateGroupTileObject(): void {
            this._imgTileObject.visible = this._getWar().getField().getView().getTileObjectsVisible();
        }
    }
}

// export default TwnsMeVisibilityPanel;
