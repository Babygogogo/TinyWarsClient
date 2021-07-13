
import TwnsUiImage                      from "../../../utility/ui/UiImage";
import TwnsUiPanel                      from "../../../utility/ui/UiPanel";
import TwnsUiButton                      from "../../../utility/ui/UiButton";
import TwnsUiLabel                      from "../../../utility/ui/UiLabel";
import { MeWar }                        from "../model/MeWar";
import { Lang }                         from "../../../utility/lang/Lang";
import { TwnsLangTextType } from "../../../utility/lang/LangTextType";
import LangTextType         = TwnsLangTextType.LangTextType;
import { Notify }                       from "../../../utility/notify/Notify";
import { TwnsNotifyType } from "../../../utility/notify/NotifyType";
import NotifyType       = TwnsNotifyType.NotifyType;
import { Types }                        from "../../../utility/Types";
import { MeModel }                      from "../model/MeModel";

export class MeMapTagPanel extends TwnsUiPanel.UiPanel<void> {
    protected readonly _LAYER_TYPE   = Types.LayerType.Hud0;
    protected readonly _IS_EXCLUSIVE = false;

    private static _instance: MeMapTagPanel;

    private _labelTitle     : TwnsUiLabel.UiLabel;
    private _btnCancel      : TwnsUiButton.UiButton;
    private _btnConfirm     : TwnsUiButton.UiButton;

    private _groupFog       : eui.Group;
    private _labelFog       : TwnsUiLabel.UiLabel;
    private _imgFog         : TwnsUiImage.UiImage;

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
            { type: NotifyType.LanguageChanged, callback: this._onNotifyLanguageChanged },
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
        this._labelTitle.text   = Lang.getText(LangTextType.B0445);
        this._btnConfirm.label  = Lang.getText(LangTextType.B0026);
        this._labelFog.text     = Lang.getText(LangTextType.B0438);
    }
}
