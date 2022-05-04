
// import TwnsCommonConfirmPanel           from "../../common/view/CommonConfirmPanel";
// import TwnsTwWar                        from "../../testWar/model/TwWar";
// import FloatText                        from "../../tools/helpers/FloatText";
// import FlowManager                      from "../../tools/helpers/FlowManager";
// import Helpers                          from "../../tools/helpers/Helpers";
// import Types                            from "../../tools/helpers/Types";
// import Lang                             from "../../tools/lang/Lang";
// import TwnsLangTextType                 from "../../tools/lang/LangTextType";
// import Twns.Notify                   from "../../tools/notify/NotifyType";
// import ProtoTypes                       from "../../tools/proto/ProtoTypes";
// import TwnsUiButton                     from "../../tools/ui/UiButton";
// import TwnsUiLabel                      from "../../tools/ui/UiLabel";
// import TwnsUiPanel                      from "../../tools/ui/UiPanel";
// import TwnsUiTab                        from "../../tools/ui/UiTab";
// import TwnsUiTabItemRenderer            from "../../tools/ui/UiTabItemRenderer";
// import MeMfwModel                       from "../model/MeMfwModel";
// import TwnsMeMfwAdvancedSettingsPage    from "./MeMfwAdvancedSettingsPage";
// import TwnsMeMfwBasicSettingsPage       from "./MeMfwBasicSettingsPage";
// import TwnsMeWarMenuPanel               from "./MeWarMenuPanel";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.MapEditor {
    import MeMfwAdvancedSettingsPage    = Twns.MapEditor.MeMfwAdvancedSettingsPage;
    import MeMfwBasicSettingsPage       = MapEditor.MeMfwBasicSettingsPage;
    import NotifyType                   = Twns.Notify.NotifyType;
    import LangTextType                 = Twns.Lang.LangTextType;

    export type OpenDataForMeMfwSettingsPanel = void;
    export class MeMfwSettingsPanel extends TwnsUiPanel.UiPanel<OpenDataForMeMfwSettingsPanel> {
        private readonly _tabSettings!      : TwnsUiTab.UiTab<DataForTabItemRenderer, void>;
        private readonly _labelMenuTitle!   : TwnsUiLabel.UiLabel;
        private readonly _btnBack!          : TwnsUiButton.UiButton;
        private readonly _btnConfirm!       : TwnsUiButton.UiButton;

        protected _onOpening(): void {
            this._setUiListenerArray([
                { ui: this._btnBack,    callback: this._onTouchedBtnBack },
                { ui: this._btnConfirm, callback: this._onTouchedBtnConfirm },
            ]);
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,    callback: this._onNotifyLanguageChanged },
                { type: NotifyType.MsgSpmCreateSfw,    callback: this._onMsgSpmCreateSfw },
            ]);
            this._tabSettings.setBarItemRenderer(TabItemRenderer);
        }
        protected async _updateOnOpenDataChanged(): Promise<void> {
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
        protected _onClosing(): void {
            // nothing to do
        }

        private _onTouchedBtnBack(): void {
            this.close();
            Twns.PanelHelpers.open(Twns.PanelHelpers.PanelDict.MeWarMenuPanel, void 0);
        }

        private async _onTouchedBtnConfirm(): Promise<void> {
            MapEditor.MeMfwModel.reviseInstanceWarRuleForAi();
            const warData   = MapEditor.MeMfwModel.getWarData();
            const errorCode = new TestWar.TwWar().getErrorCodeForInitForMfw(warData, await Config.ConfigManager.getGameConfig(Twns.Helpers.getExisted(warData.settingsForCommon?.configVersion)));
            if (errorCode) {
                FloatText.show(Lang.getErrorText(errorCode));
            } else {
                Twns.PanelHelpers.open(Twns.PanelHelpers.PanelDict.CommonConfirmPanel, {
                    content : Lang.getText(LangTextType.A0201),
                    callback: () => {
                        Twns.FlowManager.gotoMfrCreateSettingsPanel(warData);
                    },
                });
            }
        }

        private _onMsgSpmCreateSfw(e: egret.Event): void {
            const data = e.data as CommonProto.NetMessage.MsgSpmCreateSfw.IS;
            Twns.PanelHelpers.open(Twns.PanelHelpers.PanelDict.CommonConfirmPanel, {
                content : Lang.getText(LangTextType.A0107),
                callback: () => {
                    Twns.FlowManager.gotoSinglePlayerWar({
                        slotIndex       : Twns.Helpers.getExisted(data.slotIndex),
                        slotExtraData   : Twns.Helpers.getExisted(data.extraData),
                        warData         : Twns.Helpers.getExisted(data.warData),
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

// export default TwnsMeMfwSettingsPanel;
