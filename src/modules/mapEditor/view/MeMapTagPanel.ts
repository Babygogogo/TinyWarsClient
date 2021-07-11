
import { UiImage }                      from "../../../gameui/UiImage";
import { UiPanel }                      from "../../../gameui/UiPanel";
import { UiButton }                     from "../../../gameui/UiButton";
import { UiLabel }                      from "../../../gameui/UiLabel";
import { MeWar }                        from "../model/MeWar";
import * as Lang                        from "../../../utility/Lang";
import * as Notify                      from "../../../utility/Notify";
import * as Types                       from "../../../utility/Types";
import * as MeModel                     from "../model/MeModel";

export class MeMapTagPanel extends UiPanel<void> {
    protected readonly _LAYER_TYPE   = Types.LayerType.Hud0;
    protected readonly _IS_EXCLUSIVE = false;

    private static _instance: MeMapTagPanel;

    private _labelTitle     : UiLabel;
    private _btnCancel      : UiButton;
    private _btnConfirm     : UiButton;

    private _groupFog       : eui.Group;
    private _labelFog       : UiLabel;
    private _imgFog         : UiImage;

    private _war            : MeWar;

    public static show(): void {
        if (!MeMapTagPanel._instance) {
            MeMapTagPanel._instance = new MeMapTagPanel();
        }
        MeMapTagPanel._instance.open(undefined);
    }

    public static async hide(): Promise<void> {
        if (MeMapTagPanel._instance) {
            await MeMapTagPanel._instance.close();
        }
    }

    private constructor() {
        super();

        this._setIsTouchMaskEnabled();
        this.skinName = "resource/skins/mapEditor/MeMapTagPanel.exml";
    }

    protected _onOpened(): void {
        this._setNotifyListenerArray([
            { type: Notify.Type.LanguageChanged, callback: this._onNotifyLanguageChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._btnConfirm,     callback: this._onTouchedBtnConfirm },
            { ui: this._btnCancel,      callback: this._onTouchedBtnCancel },
            { ui: this._groupFog,       callback: this._onTouchedGroupMcw },
        ]);

        this._updateComponentsForLanguage();

        const war               = MeModel.getWar();
        const mapTag            = war.getMapTag() || {};
        this._war               = war;
        this._imgFog.visible    = !!mapTag.fog;
    }

    private _onNotifyLanguageChanged(e: egret.Event): void {
        this._updateComponentsForLanguage();
    }

    private _onTouchedBtnConfirm(e: egret.TouchEvent): void {
        this._war.setMapTag({
            fog     : this._imgFog.visible ? true : null,
        });
        this.close();
    }

    private _onTouchedBtnCancel(e: egret.TouchEvent): void {
        this.close();
    }

    private _onTouchedGroupMcw(e: egret.TouchEvent): void {
        if (!this._war.getIsReviewingMap()) {
            this._imgFog.visible = !this._imgFog.visible;
        }
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.text   = Lang.getText(Lang.Type.B0445);
        this._btnConfirm.label  = Lang.getText(Lang.Type.B0026);
        this._labelFog.text     = Lang.getText(Lang.Type.B0438);
    }
}
