
import TwnsCommonConfirmPanel           from "../../common/view/CommonConfirmPanel";
import TwnsSpmCreateSfwSaveSlotsPanel   from "../../singlePlayerMode/view/SpmCreateSfwSaveSlotsPanel";
import FloatText                        from "../../tools/helpers/FloatText";
import FlowManager                      from "../../tools/helpers/FlowManager";
import Helpers                          from "../../tools/helpers/Helpers";
import Types                            from "../../tools/helpers/Types";
import Lang                             from "../../tools/lang/Lang";
import TwnsLangTextType                 from "../../tools/lang/LangTextType";
import TwnsNotifyType                   from "../../tools/notify/NotifyType";
import ProtoTypes                       from "../../tools/proto/ProtoTypes";
import TwnsUiButton                     from "../../tools/ui/UiButton";
import TwnsUiLabel                      from "../../tools/ui/UiLabel";
import TwnsUiPanel                      from "../../tools/ui/UiPanel";
import TwnsUiTab                        from "../../tools/ui/UiTab";
import TwnsUiTabItemRenderer            from "../../tools/ui/UiTabItemRenderer";
import MeSimModel                       from "../model/MeSimModel";
import TwnsMeSimAdvancedSettingsPage    from "./MeSimAdvancedSettingsPage";
import TwnsMeSimBasicSettingsPage       from "./MeSimBasicSettingsPage";
import TwnsMeWarMenuPanel               from "./MeWarMenuPanel";

namespace TwnsMeSimSettingsPanel {
    import CommonConfirmPanel           = TwnsCommonConfirmPanel.CommonConfirmPanel;
    import SpmCreateSfwSaveSlotsPanel   = TwnsSpmCreateSfwSaveSlotsPanel.SpmCreateSfwSaveSlotsPanel;
    import MeSimAdvancedSettingsPage    = TwnsMeSimAdvancedSettingsPage.MeSimAdvancedSettingsPage;
    import MeSimBasicSettingsPage       = TwnsMeSimBasicSettingsPage.MeSimBasicSettingsPage;
    import LangTextType                 = TwnsLangTextType.LangTextType;
    import NotifyType                   = TwnsNotifyType.NotifyType;

    export class MeSimSettingsPanel extends TwnsUiPanel.UiPanel<void> {
        protected readonly _LAYER_TYPE   = Types.LayerType.Hud0;
        protected readonly _IS_EXCLUSIVE = false;

        private static _instance: MeSimSettingsPanel;

        private readonly _tabSettings!      : TwnsUiTab.UiTab<DataForTabItemRenderer, void>;
        private readonly _labelMenuTitle!   : TwnsUiLabel.UiLabel;
        private readonly _btnBack!          : TwnsUiButton.UiButton;
        private readonly _btnConfirm!       : TwnsUiButton.UiButton;

        public static show(): void {
            if (!MeSimSettingsPanel._instance) {
                MeSimSettingsPanel._instance = new MeSimSettingsPanel();
            }
            MeSimSettingsPanel._instance.open();
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
                    tabItemData : { name: Lang.getText(LangTextType.B0002) },
                    pageClass   : MeSimBasicSettingsPage,
                    pageData    : void 0,
                },
                {
                    tabItemData : { name: Lang.getText(LangTextType.B0003) },
                    pageClass   : MeSimAdvancedSettingsPage,
                    pageData    : void 0,
                },
            ]);

            this._updateComponentsForLanguage();
            this._btnConfirm.enabled = true;
        }

        private _onTouchedBtnBack(): void {
            this.close();
            TwnsMeWarMenuPanel.MeWarMenuPanel.show();
        }

        private _onTouchedBtnConfirm(): void {
            if (MeSimModel.checkIsValidWarData()) {
                SpmCreateSfwSaveSlotsPanel.show(MeSimModel.getWarData());
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
                        slotIndex       : Helpers.getExisted(data.slotIndex),
                        slotExtraData   : Helpers.getExisted(data.extraData),
                        warData         : Helpers.getExisted(data.warData),
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

    class TabItemRenderer extends TwnsUiTabItemRenderer.UiTabItemRenderer<DataForTabItemRenderer> {
        private readonly _labelName!    : TwnsUiLabel.UiLabel;

        protected _onDataChanged(): void {
            this._labelName.text = this._getData().name;
        }
    }
}

export default TwnsMeSimSettingsPanel;
