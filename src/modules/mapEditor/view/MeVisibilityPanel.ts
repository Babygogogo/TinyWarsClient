
import { UiImage }                      from "../../../utility/ui/UiImage";
import { UiPanel }                      from "../../../utility/ui/UiPanel";
import { UiLabel }                      from "../../../utility/ui/UiLabel";
import { MeWar }                        from "../model/MeWar";
import { Lang }                         from "../../../utility/lang/Lang";
import { TwnsLangTextType } from "../../../utility/lang/LangTextType";
import LangTextType         = TwnsLangTextType.LangTextType;
import { Notify }                       from "../../../utility/notify/Notify";
import { TwnsNotifyType } from "../../../utility/notify/NotifyType";
import NotifyType       = TwnsNotifyType.NotifyType;
import { Types }                        from "../../../utility/Types";
import { MeModel }                      from "../model/MeModel";

export class MeVisibilityPanel extends UiPanel<void> {
    protected readonly _LAYER_TYPE   = Types.LayerType.Hud3;
    protected readonly _IS_EXCLUSIVE = false;

    private static _instance: MeVisibilityPanel;

    private _groupUnit          : eui.Group;
    private _labelUnit          : UiLabel;
    private _imgUnit            : UiImage;
    private _groupTileObject    : eui.Group;
    private _imgTileObject      : UiImage;
    private _labelTileObject    : UiLabel;
    private _groupTileBase      : eui.Group;
    private _imgTileBase        : UiImage;
    private _labelTileBase      : UiLabel;

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
