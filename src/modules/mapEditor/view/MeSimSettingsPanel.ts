
// import TwnsCommonConfirmPanel           from "../../common/view/CommonConfirmPanel";
// import TwnsSpmCreateSfwSaveSlotsPanel   from "../../singlePlayerMode/view/SpmCreateSfwSaveSlotsPanel";
// import FloatText                        from "../../tools/helpers/FloatText";
// import FlowManager                      from "../../tools/helpers/FlowManager";
// import Helpers                          from "../../tools/helpers/Helpers";
// import Types                            from "../../tools/helpers/Types";
// import Lang                             from "../../tools/lang/Lang";
// import TwnsLangTextType                 from "../../tools/lang/LangTextType";
// import Notify                   from "../../tools/notify/NotifyType";
// import ProtoTypes                       from "../../tools/proto/ProtoTypes";
// import TwnsUiButton                     from "../../tools/ui/UiButton";
// import TwnsUiLabel                      from "../../tools/ui/UiLabel";
// import TwnsUiPanel                      from "../../tools/ui/UiPanel";
// import TwnsUiTab                        from "../../tools/ui/UiTab";
// import TwnsUiTabItemRenderer            from "../../tools/ui/UiTabItemRenderer";
// import MeSimModel                       from "../model/MeSimModel";
// import TwnsMeSimAdvancedSettingsPage    from "./MeSimAdvancedSettingsPage";
// import TwnsMeSimBasicSettingsPage       from "./MeSimBasicSettingsPage";
// import TwnsMeWarMenuPanel               from "./MeWarMenuPanel";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.MapEditor {
    import MeSimAdvancedSettingsPage    = MapEditor.MeSimAdvancedSettingsPage;
    import MeSimBasicSettingsPage       = MapEditor.MeSimBasicSettingsPage;
    import LangTextType                 = Lang.LangTextType;
    import NotifyType                   = Notify.NotifyType;

    export type OpenDataForMeSimSettingsPanel = void;
    export class MeSimSettingsPanel extends TwnsUiPanel.UiPanel<OpenDataForMeSimSettingsPanel> {
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
        protected _onClosing(): void {
            // nothing to do
        }

        private _onTouchedBtnBack(): void {
            this.close();
        }

        private async _onTouchedBtnConfirm(): Promise<void> {
            const warData   = MapEditor.MeSimModel.getWarData();
            const errorCode = new TestWar.TwWar().getErrorCodeForInitForSfw(warData, await Config.ConfigManager.getGameConfig(Helpers.getExisted(warData.settingsForCommon?.configVersion)));
            if (errorCode) {
                FloatText.show(Lang.getErrorText(errorCode));
            } else {
                PanelHelpers.open(PanelHelpers.PanelDict.SpmCreateSfwSaveSlotsPanel, warData);
            }
        }

        private _onMsgSpmCreateSfw(e: egret.Event): void {
            const data = e.data as CommonProto.NetMessage.MsgSpmCreateSfw.IS;
            PanelHelpers.open(PanelHelpers.PanelDict.CommonConfirmPanel, {
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

// export default TwnsMeSimSettingsPanel;
