
import { UiImage }              from "../../../gameui/UiImage";
import { UiPanel }              from "../../../gameui/UiPanel";
import { UiButton }             from "../../../gameui/UiButton";
import { UiLabel }              from "../../../gameui/UiLabel";
import { MmWarRulePanel }       from "./MmWarRulePanel";
import * as Lang                from "../../../utility/Lang";
import { LangTextType } from "../../../utility/LangTextType";
import { Notify }               from "../../../utility/Notify";
import { NotifyType } from "../../../utility/NotifyType";
import { Types }                from "../../../utility/Types";
import * as WarMapModel         from "../../warMap/model/WarMapModel";
import * as WarMapProxy         from "../../warMap/model/WarMapProxy";

type OpenDataForMmTagChangePanel = {
    mapId   : number;
};
export class MmTagChangePanel extends UiPanel<OpenDataForMmTagChangePanel> {
    protected readonly _LAYER_TYPE   = Types.LayerType.Hud0;
    protected readonly _IS_EXCLUSIVE = false;

    private static _instance: MmTagChangePanel;

    private _labelTitle     : UiLabel;
    private _btnWarRule     : UiButton;
    private _btnCancel      : UiButton;
    private _btnConfirm     : UiButton;

    private _groupFog       : eui.Group;
    private _labelFog       : UiLabel;
    private _imgFog         : UiImage;

    private _mapId          : number;

    public static show(openData: OpenDataForMmTagChangePanel): void {
        if (!MmTagChangePanel._instance) {
            MmTagChangePanel._instance = new MmTagChangePanel();
        }
        MmTagChangePanel._instance.open(openData);
    }

    public static async hide(): Promise<void> {
        if (MmTagChangePanel._instance) {
            await MmTagChangePanel._instance.close();
        }
    }

    private constructor() {
        super();

        this._setIsTouchMaskEnabled();
        this.skinName = "resource/skins/mapManagement/MmTagChangePanel.exml";
    }

    protected async _onOpened(): Promise<void> {
        this._setNotifyListenerArray([
            { type: NotifyType.LanguageChanged, callback: this._onNotifyLanguageChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._btnConfirm,     callback: this._onTouchedBtnConfirm },
            { ui: this._btnCancel,      callback: this._onTouchedBtnCancel },
            { ui: this._btnWarRule,     callback: this._onTouchedBtnWarRule },
            { ui: this._groupFog,       callback: this._onTouchedGroupMcw },
        ]);

        this._updateComponentsForLanguage();

        const mapId = this._getOpenData().mapId;
        this._mapId = mapId;

        const mapTag            = (await WarMapModel.getBriefData(mapId)).mapTag || {};
        this._imgFog.visible    = !!mapTag.fog;
    }

    private _onNotifyLanguageChanged(e: egret.Event): void {
        this._updateComponentsForLanguage();
    }

    private _onTouchedBtnConfirm(e: egret.TouchEvent): void {
        WarMapProxy.reqMmSetMapTag(this._mapId, {
            fog : this._imgFog.visible ? true : null,
        });
        this.close();
    }

    private async _onTouchedBtnWarRule(e: egret.TouchEvent): Promise<void> {
        MmWarRulePanel.show(await WarMapModel.getRawData(this._mapId));
        this.close();
    }

    private _onTouchedBtnCancel(e: egret.TouchEvent): void {
        this.close();
    }

    private _onTouchedGroupMcw(e: egret.TouchEvent): void {
        this._imgFog.visible = !this._imgFog.visible;
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.text   = Lang.getText(LangTextType.B0444);
        this._btnCancel.label   = Lang.getText(LangTextType.B0154);
        this._btnConfirm.label  = Lang.getText(LangTextType.B0026);
        this._btnWarRule.label  = Lang.getText(LangTextType.B0314);
        this._labelFog.text     = Lang.getText(LangTextType.B0438);
    }
}
