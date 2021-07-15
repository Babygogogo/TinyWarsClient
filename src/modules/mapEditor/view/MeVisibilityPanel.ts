
import Types            from "../../tools/helpers/Types";
import Lang             from "../../tools/lang/Lang";
import TwnsLangTextType from "../../tools/lang/LangTextType";
import TwnsNotifyType   from "../../tools/notify/NotifyType";
import TwnsUiImage      from "../../tools/ui/UiImage";
import TwnsUiLabel      from "../../tools/ui/UiLabel";
import TwnsUiPanel      from "../../tools/ui/UiPanel";
import MeModel          from "../model/MeModel";
import TwnsMeWar        from "../model/MeWar";

namespace TwnsMeVisibilityPanel {
    import MeWar        = TwnsMeWar.MeWar;
    import LangTextType = TwnsLangTextType.LangTextType;
    import NotifyType   = TwnsNotifyType.NotifyType;

    export class MeVisibilityPanel extends TwnsUiPanel.UiPanel<void> {
        protected readonly _LAYER_TYPE   = Types.LayerType.Hud3;
        protected readonly _IS_EXCLUSIVE = false;

        private static _instance: MeVisibilityPanel;

        private _groupUnit          : eui.Group;
        private _labelUnit          : TwnsUiLabel.UiLabel;
        private _imgUnit            : TwnsUiImage.UiImage;
        private _groupTileObject    : eui.Group;
        private _imgTileObject      : TwnsUiImage.UiImage;
        private _labelTileObject    : TwnsUiLabel.UiLabel;
        private _groupTileBase      : eui.Group;
        private _imgTileBase        : TwnsUiImage.UiImage;
        private _labelTileBase      : TwnsUiLabel.UiLabel;

        private _war : MeWar;

        public static show(): void {
            if (!MeVisibilityPanel._instance) {
                MeVisibilityPanel._instance = new MeVisibilityPanel();
            }
            MeVisibilityPanel._instance.open(undefined);
        }

        public static async hide(): Promise<void> {
            if (MeVisibilityPanel._instance) {
                await MeVisibilityPanel._instance.close();
            }
        }

        public constructor() {
            super();

            this._setIsTouchMaskEnabled();
            this._setIsCloseOnTouchedMask();
            this.skinName = "resource/skins/mapEditor/MeVisibilityPanel.exml";
        }

        protected _onOpened(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged, callback: this._onNotifyLanguageChanged },
            ]);
            this._setUiListenerArray([
                { ui: this._groupTileBase,      callback: this._onTouchedGroupTileBase, },
                { ui: this._groupTileObject,    callback: this._onTouchedGroupTileObject, },
                { ui: this._groupUnit,          callback: this._onTouchedGroupUnit },
            ]);

            this._updateComponentsForLanguage();

            this._war = MeModel.getWar();
            this._updateGroupUnit();
            this._updateGroupTileBase();
            this._updateGroupTileObject();
        }

        private _onTouchedGroupTileBase(e: egret.TouchEvent): void {
            const view = this._war.getField().getView();
            view.setTileBasesVisible(!view.getTileBasesVisible());
            this._updateGroupTileBase();
        }

        private _onTouchedGroupTileObject(e: egret.TouchEvent): void {
            const view = this._war.getField().getView();
            view.setTileObjectsVisible(!view.getTileObjectsVisible());
            this._updateGroupTileObject();
        }

        private _onTouchedGroupUnit(e: egret.TouchEvent): void {
            const view = this._war.getField().getView();
            view.setUnitsVisible(!view.getUnitsVisible());
            this._updateGroupUnit();
        }

        private _onNotifyLanguageChanged(e: egret.Event): void {
            this._updateComponentsForLanguage();
        }

        private _updateComponentsForLanguage(): void {
            this._labelTileBase.text        = Lang.getText(LangTextType.B0302);
            this._labelTileObject.text      = Lang.getText(LangTextType.B0303);
            this._labelUnit.text            = Lang.getText(LangTextType.B0304);
        }

        private _updateGroupUnit(): void {
            this._imgUnit.visible = this._war.getField().getView().getUnitsVisible();
        }
        private _updateGroupTileBase(): void {
            this._imgTileBase.visible = this._war.getField().getView().getTileBasesVisible();
        }
        public _updateGroupTileObject(): void {
            this._imgTileObject.visible = this._war.getField().getView().getTileObjectsVisible();
        }
    }
}

export default TwnsMeVisibilityPanel;
