
import { UiPanel }                      from "../../../gameui/UiPanel";
import { UiButton }                     from "../../../gameui/UiButton";
import { UiLabel }                      from "../../../gameui/UiLabel";
import { UiTab }                        from "../../../gameui/UiTab";
import { UiTabItemRenderer }            from "../../../gameui/UiTabItemRenderer";
import { CommonConfirmPanel }           from "../../common/view/CommonConfirmPanel";
import { MfrCreateSettingsPanel }       from "../../multiFreeRoom/view/MfrCreateSettingsPanel";
import { MeMfwAdvancedSettingsPage }    from "./MeMfwAdvancedSettingsPage";
import { MeMfwBasicSettingsPage }       from "./MeMfwBasicSettingsPage";
import { MeWarMenuPanel }               from "./MeWarMenuPanel";
import { BroadcastPanel }               from "../../broadcast/view/BroadcastPanel";
import { LobbyBackgroundPanel }         from "../../lobby/view/LobbyBackgroundPanel";
import { TwWar }                        from "../../testWar/model/TwWar";
import * as FloatText                   from "../../../utility/FloatText";
import { FlowManager }                  from "../../../utility/FlowManager";
import * as Lang                        from "../../../utility/Lang";
import { LangTextType } from "../../../utility/LangTextType";
import { Notify }                       from "../../../utility/Notify";
import { NotifyType } from "../../../utility/NotifyType";
import * as ProtoTypes                  from "../../../utility/ProtoTypes";
import * as StageManager                from "../../../utility/StageManager";
import { Types }                        from "../../../utility/Types";
import * as MfrModel                    from "../../multiFreeRoom/model/MfrModel";
import * as MeModel                     from "../model/MeModel";

export class MeMfwSettingsPanel extends UiPanel<void> {
    protected readonly _LAYER_TYPE   = Types.LayerType.Hud0;
    protected readonly _IS_EXCLUSIVE = false;

    private static _instance: MeMfwSettingsPanel;

    private _tabSettings    : UiTab<DataForTabItemRenderer, void>;
    private _labelMenuTitle : UiLabel;
    private _btnBack        : UiButton;
    private _btnConfirm     : UiButton;

    public static show(): void {
        if (!MeMfwSettingsPanel._instance) {
            MeMfwSettingsPanel._instance = new MeMfwSettingsPanel();
        }
        MeMfwSettingsPanel._instance.open(undefined);
    }
    public static async hide(): Promise<void> {
        if (MeMfwSettingsPanel._instance) {
            await MeMfwSettingsPanel._instance.close();
        }
    }

    public constructor() {
        super();

        this.skinName = "resource/skins/mapEditor/MeMfwSettingsPanel.exml";
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
                pageClass  : MeMfwBasicSettingsPage,
            },
            {
                tabItemData: { name: Lang.getText(LangTextType.B0003) },
                pageClass  : MeMfwAdvancedSettingsPage,
            },
        ]);

        this._updateComponentsForLanguage();
    }

    private _onTouchedBtnBack(): void {
        this.close();
        MeWarMenuPanel.show();
    }

    private async _onTouchedBtnConfirm(): Promise<void> {
        MeModel.Mfw.reviseWarRuleForAi();
        const warData   = MeModel.Mfw.getWarData();
        const errorCode = await (new TwWar().init(warData));
        if (errorCode) {
            FloatText.show(Lang.getErrorText(errorCode));
        } else {
            CommonConfirmPanel.show({
                content : Lang.getText(LangTextType.A0201),
                callback: () => {
                    MfrModel.Create.resetDataByInitialWarData(warData);
                    MeModel.unloadWar();
                    StageManager.closeAllPanels();
                    LobbyBackgroundPanel.show();
                    BroadcastPanel.show();
                    MfrCreateSettingsPanel.show();
                },
            });
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
        this._labelMenuTitle.text   = Lang.getText(LangTextType.B0557);
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
