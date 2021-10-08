
import TwnsCommonConfirmPanel           from "../../common/view/CommonConfirmPanel";
import TwnsTwWar                        from "../../testWar/model/TwWar";
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
import MeMfwModel                       from "../model/MeMfwModel";
import TwnsMeMfwAdvancedSettingsPage    from "./MeMfwAdvancedSettingsPage";
import TwnsMeMfwBasicSettingsPage       from "./MeMfwBasicSettingsPage";
import TwnsMeWarMenuPanel               from "./MeWarMenuPanel";

namespace TwnsMeMfwSettingsPanel {
    import CommonConfirmPanel           = TwnsCommonConfirmPanel.CommonConfirmPanel;
    import MeMfwAdvancedSettingsPage    = TwnsMeMfwAdvancedSettingsPage.MeMfwAdvancedSettingsPage;
    import MeMfwBasicSettingsPage       = TwnsMeMfwBasicSettingsPage.MeMfwBasicSettingsPage;
    import NotifyType                   = TwnsNotifyType.NotifyType;
    import LangTextType                 = TwnsLangTextType.LangTextType;

    export class MeMfwSettingsPanel extends TwnsUiPanel.UiPanel<void> {
        protected readonly _LAYER_TYPE   = Types.LayerType.Hud0;
        protected readonly _IS_EXCLUSIVE = false;

        private static _instance: MeMfwSettingsPanel;

        private readonly _tabSettings!      : TwnsUiTab.UiTab<DataForTabItemRenderer, void>;
        private readonly _labelMenuTitle!   : TwnsUiLabel.UiLabel;
        private readonly _btnBack!          : TwnsUiButton.UiButton;
        private readonly _btnConfirm!       : TwnsUiButton.UiButton;

        public static show(): void {
            if (!MeMfwSettingsPanel._instance) {
                MeMfwSettingsPanel._instance = new MeMfwSettingsPanel();
            }
            MeMfwSettingsPanel._instance.open();
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
                    tabItemData : { name: Lang.getText(LangTextType.B0002) },
                    pageClass   : MeMfwBasicSettingsPage,
                    pageData    : void 0,
                },
                {
                    tabItemData : { name: Lang.getText(LangTextType.B0003) },
                    pageClass   : MeMfwAdvancedSettingsPage,
                    pageData    : void 0,
                },
            ]);

            this._updateComponentsForLanguage();
        }

        private _onTouchedBtnBack(): void {
            this.close();
            TwnsMeWarMenuPanel.MeWarMenuPanel.show();
        }

        private async _onTouchedBtnConfirm(): Promise<void> {
            MeMfwModel.reviseWarRuleForAi();
            const warData   = MeMfwModel.getWarData();
            const errorCode = await (new TwnsTwWar.TwWar().getErrorCodeForInit(warData));
            if (errorCode) {
                FloatText.show(Lang.getErrorText(errorCode));
            } else {
                CommonConfirmPanel.show({
                    content : Lang.getText(LangTextType.A0201),
                    callback: () => {
                        FlowManager.gotoMfrCreateSettingsPanel(warData);
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
            this._labelMenuTitle.text   = Lang.getText(LangTextType.B0557);
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

export default TwnsMeMfwSettingsPanel;
