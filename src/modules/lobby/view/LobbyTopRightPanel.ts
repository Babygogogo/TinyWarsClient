
// import Types                    from "../../tools/helpers/Types";
// import TwnsNotifyType           from "../../tools/notify/NotifyType";
// import TwnsUiButton             from "../../tools/ui/UiButton";
// import TwnsUiPanel              from "../../tools/ui/UiPanel";
// import TwnsUserSettingsPanel    from "../../user/view/UserSettingsPanel";

namespace TwnsLobbyTopRightPanel {
    import NotifyType           = TwnsNotifyType.NotifyType;

    export class LobbyTopRightPanel extends TwnsUiPanel.UiPanel<void> {
        protected readonly _LAYER_TYPE   = Types.LayerType.Hud0;
        protected readonly _IS_EXCLUSIVE = false;

        private static _instance            : LobbyTopRightPanel | null = null;

        private readonly _group!            : eui.Group;
        private readonly _btnSettings!      : TwnsUiButton.UiButton;

        public static show(): void {
            if (!LobbyTopRightPanel._instance) {
                LobbyTopRightPanel._instance = new LobbyTopRightPanel();
            }
            LobbyTopRightPanel._instance.open();
        }
        public static async hide(): Promise<void> {
            if (LobbyTopRightPanel._instance) {
                await LobbyTopRightPanel._instance.close();
            }
        }
        public static getInstance(): LobbyTopRightPanel | null {
            return LobbyTopRightPanel._instance;
        }

        private constructor() {
            super();

            this.skinName = "resource/skins/lobby/LobbyTopRightPanel.exml";
        }

        protected _onOpened(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged, callback: this._onNotifyLanguageChanged },
                { type: NotifyType.MsgUserLogout,   callback: this._onMsgUserLogout },
            ]);
            this._setUiListenerArray([
                { ui: this._btnSettings,    callback: this._onTouchedBtnSettings },
            ]);

            this._showOpenAnimation();
        }
        protected async _onClosed(): Promise<void> {
            await this._showCloseAnimation();
        }

        private _onMsgUserLogout(): void {
            this.close();
        }

        private _onNotifyLanguageChanged(): void {
            // nothing to do
        }

        private _onTouchedBtnSettings(): void {
            TwnsPanelManager.open(TwnsPanelConfig.Dict.UserSettingsPanel, void 0);
        }

        private _showOpenAnimation(): void {
            const group = this._group;
            egret.Tween.removeTweens(group);
            egret.Tween.get(group)
                .set({ alpha: 0, top: -40 })
                .to({ alpha: 1, top: 0 }, 200);
        }
        private _showCloseAnimation(): Promise<void> {
            return new Promise<void>((resolve) => {
                const group = this._group;
                egret.Tween.removeTweens(group);
                egret.Tween.get(group)
                    .set({ alpha: 1, top: 0 })
                    .to({ alpha: 0, top: -40 }, 200)
                    .call(resolve);
            });
        }
    }
}

// export default TwnsLobbyTopRightPanel;
