
namespace TinyWars.Lobby {
    import Tween        = egret.Tween;
    import Lang         = Utility.Lang;
    import Helpers      = Utility.Helpers;
    import Notify       = Utility.Notify;
    import UserModel    = User.UserModel;

    export class LobbyBottomPanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Hud0;
        protected readonly _IS_EXCLUSIVE = false;

        private static _instance: LobbyBottomPanel;

        private _groupBottom    : eui.Group;
        private _groupMyInfo    : eui.Group;
        private _groupChat      : eui.Group;
        private _groupMapEditor : eui.Group;
        private _groupGameData  : eui.Group;

        public static show(): void {
            if (!LobbyBottomPanel._instance) {
                LobbyBottomPanel._instance = new LobbyBottomPanel();
            }
            LobbyBottomPanel._instance.open(undefined);
        }

        public static async hide(): Promise<void> {
            if (LobbyBottomPanel._instance) {
                await LobbyBottomPanel._instance.close();
            }
        }

        private constructor() {
            super();

            this.skinName = "resource/skins/lobby/LobbyBottomPanel.exml";
        }

        protected _onOpened(): void {
            this._setUiListenerArray([
                { ui: this._groupMyInfo,        callback: this._onTouchedGroupMyInfo },
                { ui: this._groupChat,          callback: this._onTouchedGroupChat },
                { ui: this._groupMapEditor,     callback: this._onTouchedGroupMapEditor },
                { ui: this._groupGameData,      callback: this._onTouchedGroupGameData },
            ]);
            this._setNotifyListenerArray([
                { type: Notify.Type.MsgUserLogout, callback: this._onMsgUserLogout },
            ]);

            this._showOpenAnimation();
        }

        protected async _onClosed(): Promise<void> {
            await this._showCloseAnimation();
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Callbacks.
        ////////////////////////////////////////////////////////////////////////////////
        private _onTouchedGroupMyInfo(e: egret.TouchEvent): void {
            User.UserOnlineUsersPanel.hide();
            Chat.ChatPanel.hide();
            User.UserPanel.show({ userId: UserModel.getSelfUserId() });
        }

        private _onTouchedGroupChat(e: egret.TouchEvent): void {
            User.UserOnlineUsersPanel.hide();
            User.UserPanel.hide();
            if (!Chat.ChatPanel.getIsOpening()) {
                Chat.ChatPanel.show({ toUserId: null });
            } else {
                Chat.ChatPanel.hide();
            }
        }

        private _onTouchedGroupMapEditor(e: egret.TouchEvent): void {
            this.close();
            LobbyTopPanel.hide();
            MapEditor.MeMapListPanel.show();
        }

        private _onTouchedGroupGameData(e: egret.TouchEvent): void {
            Common.CommonDamageChartPanel.show();
        }

        private _onMsgUserLogout(e: egret.Event): void {
            this.close();
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Private functions.
        ////////////////////////////////////////////////////////////////////////////////
        private _showOpenAnimation(): void {
            const groupBottom = this._groupBottom;
            Tween.removeTweens(groupBottom);
            Tween.get(groupBottom)
                .set({ alpha: 0, bottom: -40 })
                .to({ alpha: 1, bottom: 0 }, 200);

            Helpers.resetTween({
                obj         : this._groupMyInfo,
                beginProps  : { alpha: 0, top: 40 },
                waitTime    : 0,
                endProps    : { alpha: 1, top: 0 },
                tweenTime   : 200,
            });
            Helpers.resetTween({
                obj         : this._groupChat,
                beginProps  : { alpha: 0, top: 40 },
                waitTime    : 66,
                endProps    : { alpha: 1, top: 0 },
                tweenTime   : 200,
            });
            Helpers.resetTween({
                obj         : this._groupMapEditor,
                beginProps  : { alpha: 0, top: 40 },
                waitTime    : 132,
                endProps    : { alpha: 1, top: 0 },
                tweenTime   : 200,
            });
            Helpers.resetTween({
                obj         : this._groupGameData,
                beginProps  : { alpha: 0, top: 40 },
                waitTime    : 200,
                endProps    : { alpha: 1, top: 0 },
                tweenTime   : 200,
            });
        }
        private _showCloseAnimation(): Promise<void> {
            return new Promise<void>((resolve, reject) => {
                const groupBottom = this._groupBottom;
                Tween.removeTweens(groupBottom);
                Tween.get(groupBottom)
                    .set({ alpha: 1, bottom: 0 })
                    .to({ alpha: 0, bottom: -40 }, 200)
                    .call(resolve);
            });
        }
    }
}
