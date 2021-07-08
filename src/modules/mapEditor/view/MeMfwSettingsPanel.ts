
// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace TinyWars.MapEditor {
    import Lang         = Utility.Lang;
    import Notify       = Utility.Notify;
    import FloatText    = Utility.FloatText;
    import ProtoTypes   = Utility.ProtoTypes;
    import FlowManager  = Utility.FlowManager;

    export class MeMfwSettingsPanel extends GameUi.UiPanel<void> {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Hud0;
        protected readonly _IS_EXCLUSIVE = false;

        private static _instance: MeMfwSettingsPanel;

        private _tabSettings    : GameUi.UiTab<DataForTabItemRenderer, void>;
        private _labelMenuTitle : GameUi.UiLabel;
        private _btnBack        : GameUi.UiButton;
        private _btnConfirm     : GameUi.UiButton;

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
                { type: Notify.Type.LanguageChanged,    callback: this._onNotifyLanguageChanged },
                { type: Notify.Type.MsgSpmCreateSfw,    callback: this._onMsgSpmCreateSfw },
            ]);
            this._tabSettings.setBarItemRenderer(TabItemRenderer);

            this._tabSettings.bindData([
                {
                    tabItemData: { name: Lang.getText(Lang.Type.B0002) },
                    pageClass  : MeMfwBasicSettingsPage,
                },
                {
                    tabItemData: { name: Lang.getText(Lang.Type.B0003) },
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
            const errorCode = await (new TestWar.TwWar().init(warData));
            if (errorCode) {
                FloatText.show(Lang.getErrorText(errorCode));
            } else {
                Common.CommonConfirmPanel.show({
                    content : Lang.getText(Lang.Type.A0201),
                    callback: () => {
                        MultiFreeRoom.MfrModel.Create.resetDataByInitialWarData(warData);
                        MeModel.unloadWar();
                        Utility.StageManager.closeAllPanels();
                        Lobby.LobbyBackgroundPanel.show();
                        Broadcast.BroadcastPanel.show();
                        MultiFreeRoom.MfrCreateSettingsPanel.show();
                    },
                });
            }
        }

        private _onMsgSpmCreateSfw(e: egret.Event): void {
            const data = e.data as ProtoTypes.NetMessage.MsgSpmCreateSfw.IS;
            Common.CommonConfirmPanel.show({
                content : Lang.getText(Lang.Type.A0107),
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
            this._labelMenuTitle.text   = Lang.getText(Lang.Type.B0557);
            this._btnBack.label         = Lang.getText(Lang.Type.B0146);
            this._btnConfirm.label      = Lang.getText(Lang.Type.B0026);
        }
    }

    type DataForTabItemRenderer = {
        name: string;
    };

    class TabItemRenderer extends GameUi.UiTabItemRenderer<DataForTabItemRenderer> {
        private _labelName: GameUi.UiLabel;

        protected _onDataChanged(): void {
            this._labelName.text = this.data.name;
        }
    }
}
