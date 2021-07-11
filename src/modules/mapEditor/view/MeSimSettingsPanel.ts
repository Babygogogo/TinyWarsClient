
import { UiPanel }                      from "../../../gameui/UiPanel";
import { UiButton }                     from "../../../gameui/UiButton";
import { UiLabel }                      from "../../../gameui/UiLabel";
import { UiTab }                        from "../../../gameui/UiTab";
import { UiTabItemRenderer }            from "../../../gameui/UiTabItemRenderer";
import { CommonConfirmPanel }           from "../../common/view/CommonConfirmPanel";
import { SpmCreateSfwSaveSlotsPanel }   from "../../singlePlayerMode/view/SpmCreateSfwSaveSlotsPanel";
import { MeSimAdvancedSettingsPage }    from "./MeSimAdvancedSettingsPage";
import { MeSimBasicSettingsPage }       from "./MeSimBasicSettingsPage";
import { MeWarMenuPanel }               from "./MeWarMenuPanel";
import * as FloatText                   from "../../../utility/FloatText";
import * as FlowManager                 from "../../../utility/FlowManager";
import * as Lang                        from "../../../utility/Lang";
import { LangTextType } from "../../../utility/LangTextType";
import * as Notify                      from "../../../utility/Notify";
import { NotifyType } from "../../../utility/NotifyType";
import * as ProtoTypes                  from "../../../utility/ProtoTypes";
import * as Types                       from "../../../utility/Types";
import * as MeModel                     from "../model/MeModel";

export class MeSimSettingsPanel extends UiPanel<void> {
    protected readonly _LAYER_TYPE   = Types.LayerType.Hud0;
    protected readonly _IS_EXCLUSIVE = false;

    private static _instance: MeSimSettingsPanel;

    private _tabSettings    : UiTab<DataForTabItemRenderer, void>;
    private _labelMenuTitle : UiLabel;
    private _btnBack        : UiButton;
    private _btnConfirm     : UiButton;

    public static show(): void {
        if (!MeSimSettingsPanel._instance) {
            MeSimSettingsPanel._instance = new MeSimSettingsPanel();
        }
        MeSimSettingsPanel._instance.open(undefined);
    }
    public static async hide(): Promise<void> {
        if (MeSimSettingsPanel._instance) {
            await MeSimSettingsPanel._instance.close();
        }
    }

    public constructor() {
        super();

        this.skinName = "resource/skins/mapEditor/MeSimSettingsPanel.exml";
    }

    protected _onOpened(): void {
        this._setUiListenerArray([
            { ui: this._btnBack,    callback: this._onTouchedBtnBack },
            { ui: this._btnConfirm, callback: this._onTouchedBtnConfirm },
        ]);
        this._setNotifyListenerArray([
            { type: NotifyType.LanguageChanged,    callback: this._onNotifyLanguageChanged },
            { type: NotifyType.MsgSpmCreateSfw,    callback: this._onMsgSpmCreateSfw },
        ]);
        this._tabSettings.setBarItemRenderer(TabItemRenderer);

        this._tabSettings.bindData([
            {
                tabItemData: { name: Lang.getText(LangTextType.B0002) },
                pageClass  : MeSimBasicSettingsPage,
            },
            {
                tabItemData: { name: Lang.getText(LangTextType.B0003) },
                pageClass  : MeSimAdvancedSettingsPage,
            },
        ]);

        this._updateComponentsForLanguage();
        this._btnConfirm.enabled = true;
    }

    private _onTouchedBtnBack(): void {
        this.close();
        MeWarMenuPanel.show();
    }

    private _onTouchedBtnConfirm(): void {
        if (MeModel.Sim.checkIsValidWarData()) {
            SpmCreateSfwSaveSlotsPanel.show(MeModel.Sim.getWarData());
        } else {
            FloatText.show(Lang.getText(LangTextType.A0146));
        }
    }

    private _onMsgSpmCreateSfw(e: egret.Event): void {
        const data = e.data as ProtoTypes.NetMessage.MsgSpmCreateSfw.IS;
        CommonConfirmPanel.show({
            content : Lang.getText(LangTextType.A0107),
            callback: () => {
                FlowManager.gotoSinglePlayerWar({
                    slotIndex       : data.slotIndex,
                    slotExtraData   : data.extraData,
                    warData         : data.warData,
                });
            },
        });
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _updateComponentsForLanguage(): void {
        this._labelMenuTitle.text   = Lang.getText(LangTextType.B0325);
        this._btnBack.label         = Lang.getText(LangTextType.B0146);
        this._btnConfirm.label      = Lang.getText(LangTextType.B0026);
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
