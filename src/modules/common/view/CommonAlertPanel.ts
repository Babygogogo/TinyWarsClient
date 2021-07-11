
import { UiImage }              from "../../../gameui/UiImage";
import { UiPanel }              from "../../../gameui/UiPanel";
import { UiButton }             from "../../../gameui/UiButton";
import { UiLabel }              from "../../../gameui/UiLabel";
import * as Helpers             from "../../../utility/Helpers";
import * as Lang                from "../../../utility/Lang";
import { LangTextType } from "../../../utility/LangTextType";
import * as Notify              from "../../../utility/Notify";
import { NotifyType } from "../../../utility/NotifyType";
import * as Types               from "../../../utility/Types";

type OpenDataForCommonAlertPanel = {
    title       : string;
    content     : string;
    callback?   : () => any;
};

export class CommonAlertPanel extends UiPanel<OpenDataForCommonAlertPanel> {
    protected readonly _LAYER_TYPE   = Types.LayerType.Notify1;
    protected readonly _IS_EXCLUSIVE = true;

    private static _instance: CommonAlertPanel;

    private readonly _imgMask       : UiImage;
    private readonly _group         : eui.Group;
    private readonly _labelTitle    : UiLabel;
    private readonly _scrContent    : eui.Scroller;
    private readonly _labelContent  : UiLabel;
    private readonly _btnConfirm    : UiButton;

    public static show(openData: OpenDataForCommonAlertPanel): void {
        if (!CommonAlertPanel._instance) {
            CommonAlertPanel._instance = new CommonAlertPanel();
        }
        CommonAlertPanel._instance.open(openData);
    }

    public static async hide(): Promise<void> {
        if (CommonAlertPanel._instance) {
            await CommonAlertPanel._instance.close();
        }
    }

    public constructor() {
        super();

        this._setIsTouchMaskEnabled();
        this.skinName = "resource/skins/common/CommonAlertPanel.exml";
    }

    protected _onOpened(): void {
        this._setUiListenerArray([
            { ui: this._btnConfirm, callback: this._onTouchedBtnClose },
        ]);
        this._setNotifyListenerArray([
            { type: NotifyType.LanguageChanged, callback: this._onNotifyLanguageChanged },
        ]);

        this._showOpenAnimation();

        this._updateComponentsForLanguage();

        const openData          = this._getOpenData();
        this._labelTitle.text   = openData.title;
        this._labelContent.setRichText(openData.content);
        this._scrContent.viewport.scrollV = 0;
    }

    protected async _onClosed(): Promise<void> {
        await this._showCloseAnimation();
    }

    private _onTouchedBtnClose(e: egret.TouchEvent): void {
        const openData = this._getOpenData();
        (openData.callback) && (openData.callback());

        this.close();
    }

    private _onNotifyLanguageChanged(e: egret.Event): void {
        this._updateComponentsForLanguage();
    }

    private _updateComponentsForLanguage(): void {
        this._btnConfirm.label = Lang.getText(LangTextType.B0026);
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
