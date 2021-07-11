
import { UiPanel }                          from "../../../gameui/UiPanel";
import { UiButton }                         from "../../../gameui/UiButton";
import { UiLabel }                          from "../../../gameui/UiLabel";
import { UiTab }                            from "../../../gameui/UiTab";
import { UiTabItemRenderer }                from "../../../gameui/UiTabItemRenderer";
import { CcrCreateMapListPanel }            from "./CcrCreateMapListPanel";
import { CcrCreateAdvancedSettingsPage }    from "./CcrCreateAdvancedSettingsPage";
import { CcrCreateBasicSettingsPage }       from "./CcrCreateBasicSettingsPage";
import { CcrCreateMapInfoPage }             from "./CcrCreateMapInfoPage";
import { CcrCreatePlayerInfoPage }          from "./CcrCreatePlayerInfoPage";
import * as FloatText                       from "../../../utility/FloatText";
import * as FlowManager                     from "../../../utility/FlowManager";
import * as Helpers                         from "../../../utility/Helpers";
import * as Lang                            from "../../../utility/Lang";
import * as Notify                          from "../../../utility/Notify";
import * as Types                           from "../../../utility/Types";
import * as CcrModel                        from "../../coopCustomRoom/model/CcrModel";
import * as CcrProxy                        from "../model/CcrProxy";

const CONFIRM_INTERVAL_MS = 5000;

export class CcrCreateSettingsPanel extends UiPanel<void> {
    protected readonly _LAYER_TYPE   = Types.LayerType.Hud0;
    protected readonly _IS_EXCLUSIVE = true;

    private static _instance: CcrCreateSettingsPanel;

    private readonly _groupNavigator        : eui.Group;
    private readonly _labelMultiPlayer      : UiLabel;
    private readonly _labelCreateRoom       : UiLabel;
    private readonly _labelChooseMap        : UiLabel;
    private readonly _labelRoomSettings     : UiLabel;

    private readonly _groupTab              : eui.Group;
    private readonly _tabSettings           : UiTab<DataForTabItemRenderer, void>;

    private readonly _btnBack               : UiButton;
    private readonly _btnConfirm            : UiButton;

    private _timeoutIdForBtnConfirm: number;

    public static show(): void {
        if (!CcrCreateSettingsPanel._instance) {
            CcrCreateSettingsPanel._instance = new CcrCreateSettingsPanel();
        }
        CcrCreateSettingsPanel._instance.open(undefined);
    }
    public static async hide(): Promise<void> {
        if (CcrCreateSettingsPanel._instance) {
            await CcrCreateSettingsPanel._instance.close();
        }
    }

    public constructor() {
        super();

        this.skinName = "resource/skins/coopCustomRoom/CcrCreateSettingsPanel.exml";
    }

    protected _onOpened(): void {
        this._setUiListenerArray([
            { ui: this._btnBack,        callback: this._onTouchedBtnBack },
            { ui: this._btnConfirm,     callback: this._onTouchedBtnConfirm },
        ]);
        this._setNotifyListenerArray([
            { type: Notify.Type.LanguageChanged,            callback: this._onNotifyLanguageChanged },
            { type: Notify.Type.MsgCcrCreateRoom,           callback: this._onNotifyMsgCcrCreateRoom },
        ]);
        this._tabSettings.setBarItemRenderer(TabItemRenderer);

        this._tabSettings.bindData([
            {
                tabItemData : { name: Lang.getText(Lang.Type.B0002) },
                pageClass   : CcrCreateBasicSettingsPage,
            },
            {
                tabItemData : { name: Lang.getText(Lang.Type.B0003) },
                pageClass   : CcrCreateAdvancedSettingsPage,
            },
            {
                tabItemData : { name: Lang.getText(Lang.Type.B0224) },
                pageClass   : CcrCreatePlayerInfoPage,
            },
            {
                tabItemData : { name: Lang.getText(Lang.Type.B0298) },
                pageClass   : CcrCreateMapInfoPage,
            },
        ]);

        this._showOpenAnimation();

        this._updateComponentsForLanguage();
        this._btnConfirm.enabled = true;
    }

    protected async _onClosed(): Promise<void> {
        await this._showCloseAnimation();
        this._clearTimeoutForBtnConfirm();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Callbacks.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _onTouchedBtnBack(): void {
        this.close();
        CcrCreateMapListPanel.show();
    }
    private _onTouchedBtnConfirm(): void {
        const data = CcrModel.Create.getData();
        CcrProxy.reqCreateRoom(data);

        this._btnConfirm.enabled = false;
        this._resetTimeoutForBtnConfirm();
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }
    private _onNotifyMsgCcrCreateRoom(): void {
        FloatText.show(Lang.getText(Lang.Type.A0015));
        FlowManager.gotoLobby();
    }

    private _resetTimeoutForBtnConfirm(): void {
        this._clearTimeoutForBtnConfirm();
        this._timeoutIdForBtnConfirm = egret.setTimeout(() => {
            this._btnConfirm.enabled     = true;
            this._timeoutIdForBtnConfirm = undefined;
        }, this, CONFIRM_INTERVAL_MS);
    }

    private _clearTimeoutForBtnConfirm(): void {
        if (this._timeoutIdForBtnConfirm != null) {
            egret.clearTimeout(this._timeoutIdForBtnConfirm);
            this._timeoutIdForBtnConfirm = undefined;
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for the view.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _updateComponentsForLanguage(): void {
        this._labelCreateRoom.text          = Lang.getText(Lang.Type.B0000);
        this._labelMultiPlayer.text         = Lang.getText(Lang.Type.B0646);
        this._labelChooseMap.text           = Lang.getText(Lang.Type.B0227);
        this._labelRoomSettings.text        = Lang.getText(Lang.Type.B0571);
        this._btnBack.label                 = Lang.getText(Lang.Type.B0146);
        this._btnConfirm.label              = Lang.getText(Lang.Type.B0026);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Opening/closing animations.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _showOpenAnimation(): void {
        Helpers.resetTween({
            obj         : this._groupNavigator,
            beginProps  : { alpha: 0, y: -20 },
            endProps    : { alpha: 1, y: 20 },
        });
        Helpers.resetTween({
            obj         : this._btnBack,
            beginProps  : { alpha: 0, y: -20 },
            endProps    : { alpha: 1, y: 20 },
        });
        Helpers.resetTween({
            obj         : this._btnConfirm,
            beginProps  : { alpha: 0, left: -20 },
            endProps    : { alpha: 1, left: 20 },
        });
        Helpers.resetTween({
            obj         : this._groupTab,
            beginProps  : { alpha: 0, },
            endProps    : { alpha: 1, },
        });
    }
    private async _showCloseAnimation(): Promise<void> {
        return new Promise<void>(resolve => {
            Helpers.resetTween({
                obj         : this._groupNavigator,
                beginProps  : { alpha: 1, y: 20 },
                endProps    : { alpha: 0, y: -20 },
                callback    : resolve,
            });
            Helpers.resetTween({
                obj         : this._btnBack,
                beginProps  : { alpha: 1, y: 20 },
                endProps    : { alpha: 0, y: -20 },
            });
            Helpers.resetTween({
                obj         : this._btnConfirm,
                beginProps  : { alpha: 1, left: 20 },
                endProps    : { alpha: 0, left: -20 },
            });
            Helpers.resetTween({
                obj         : this._groupTab,
                beginProps  : { alpha: 1, },
                endProps    : { alpha: 0, },
            });
        });
    }
}

type DataForTabItemRenderer = {
    name: string;
};
class TabItemRenderer extends UiTabItemRenderer<DataForTabItemRenderer> {
    private _labelName: UiLabel;

    protected _onDataChanged(): void {
        this._labelName.text = this.data.name;
    }
}
