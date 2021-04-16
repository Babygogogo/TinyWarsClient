
namespace TinyWars.MultiFreeRoom {
    import Tween    = egret.Tween;
    import Lang     = Utility.Lang;
    import Notify   = Utility.Notify;
    import Helpers  = Utility.Helpers;

    export class MfrMainMenuPanel extends GameUi.UiPanel<void> {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Scene;
        protected readonly _IS_EXCLUSIVE = true;

        private static _instance: MfrMainMenuPanel;

        private readonly _group             : eui.Group;
        private readonly _btnMultiPlayer    : TinyWars.GameUi.UiButton;
        private readonly _btnRanking        : TinyWars.GameUi.UiButton;
        private readonly _btnSinglePlayer   : TinyWars.GameUi.UiButton;

        private readonly _groupLeft         : eui.Group;
        private readonly _btnCreateRoom     : TinyWars.GameUi.UiButton;
        private readonly _btnJoinRoom       : TinyWars.GameUi.UiButton;
        private readonly _btnMyRoom         : TinyWars.GameUi.UiButton;
        private readonly _btnContinueWar    : TinyWars.GameUi.UiButton;
        private readonly _btnHelp           : TinyWars.GameUi.UiButton;
        private readonly _btnNormalMode     : TinyWars.GameUi.UiButton;

        public static show(): void {
            if (!MfrMainMenuPanel._instance) {
                MfrMainMenuPanel._instance = new MfrMainMenuPanel();
            }
            MfrMainMenuPanel._instance.open(undefined);
        }

        public static async hide(): Promise<void> {
            if (MfrMainMenuPanel._instance) {
                await MfrMainMenuPanel._instance.close();
            }
        }

        private constructor() {
            super();

            this.skinName = "resource/skins/multiFreeRoom/MfrMainMenuPanel.exml";
        }

        protected _onOpened(): void {
            this._setUiListenerArray([
                { ui: this._btnRanking,         callback: this._onTouchedBtnRanking },
                { ui: this._btnSinglePlayer,    callback: this._onTouchedBtnSinglePlayer },
                { ui: this._btnCreateRoom,      callback: this._onTouchedBtnCreateRoom },
                { ui: this._btnJoinRoom,        callback: this._onTouchedBtnJoinRoom },
                { ui: this._btnMyRoom,          callback: this._onTouchedBtnMyRoom },
                { ui: this._btnContinueWar,     callback: this._onTouchedBtnContinueWar },
                { ui: this._btnHelp,            callback: this._onTouchedBtnHelp },
                { ui: this._btnNormalMode,      callback: this._onTouchedBtnNormalMode },
            ]);
            this._setNotifyListenerArray([
                { type: Notify.Type.MsgUserLogout,      callback: this._onMsgUserLogout },
            ]);

            this._showOpenAnimation();

            this._updateView();
        }

        protected async _onClosed(): Promise<void> {
            await this._showCloseAnimation();
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Callbacks.
        ////////////////////////////////////////////////////////////////////////////////
        private _onTouchedBtnRanking(e: egret.TouchEvent): void {
            this.close();
            MultiRankRoom.MrrMainMenuPanel.show();
        }
        private _onTouchedBtnSinglePlayer(e: egret.TouchEvent): void {
            this.close();
            SinglePlayerLobby.SinglePlayerLobbyPanel.show();
        }
        private _onTouchedBtnCreateRoom(e: egret.TouchEvent): void {
            Utility.FloatText.show(Lang.getText(Lang.Type.A0053));
            Utility.FloatText.show(Lang.getText(Lang.Type.A0198));
            // this.close();
            // Lobby.LobbyTopPanel.hide();
            // Lobby.LobbyBottomPanel.hide();
            // MfrCreateMapListPanel.show({});
        }
        private _onTouchedBtnJoinRoom(e: egret.TouchEvent): void {
            this.close();
            Lobby.LobbyTopPanel.hide();
            Lobby.LobbyBottomPanel.hide();
            MfrJoinRoomListPanel.show();
        }
        private _onTouchedBtnMyRoom(e: egret.TouchEvent): void {
            this.close();
            Lobby.LobbyTopPanel.hide();
            Lobby.LobbyBottomPanel.hide();
            MfrMyRoomListPanel.show();
        }
        private _onTouchedBtnContinueWar(e: egret.TouchEvent): void {
            this.close();
            Lobby.LobbyTopPanel.hide();
            Lobby.LobbyBottomPanel.hide();
            MfrMyWarListPanel.show();
        }
        private _onTouchedBtnHelp(e: egret.TouchEvent): void {
            Common.CommonAlertPanel.show({
                title   : Lang.getText(Lang.Type.B0143),
                content : Lang.getRichText(Lang.RichType.R0007),
            });
        }
        private _onTouchedBtnNormalMode(e: egret.TouchEvent): void {
            this.close();
            MultiCustomRoom.McrMainMenuPanel.show();
        }

        private _onMsgUserLogout(e: egret.Event): void {
            this.close();
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Private functions.
        ////////////////////////////////////////////////////////////////////////////////
        private _showOpenAnimation(): void {
            const group = this._group;
            Tween.removeTweens(group);
            group.right = 60;
            group.alpha = 1;

            Helpers.resetTween({
                obj         : this._btnMultiPlayer,
                beginProps  : { alpha: 0, right: -40 },
                endProps    : { alpha: 1, right: 0 },
            });
            Helpers.resetTween({
                obj         : this._btnRanking,
                beginProps  : { alpha: 0, right: -40 },
                waitTime    : 100,
                endProps    : { alpha: 1, right: 0 },
            });
            Helpers.resetTween({
                obj         : this._btnSinglePlayer,
                beginProps  : { alpha: 0, right: -40 },
                waitTime    : 200,
                endProps    : { alpha: 1, right: 0 },
            });

            const groupLeft = this._groupLeft;
            Tween.removeTweens(groupLeft);
            groupLeft.left  = 0;
            groupLeft.alpha = 1;

            Helpers.resetTween({
                obj         : this._btnCreateRoom,
                beginProps  : { alpha: 0, left: -40 },
                endProps    : { alpha: 1, left: 0 },
            });
            Helpers.resetTween({
                obj         : this._btnJoinRoom,
                beginProps  : { alpha: 0, left: -40 },
                waitTime    : 40,
                endProps    : { alpha: 1, left: 0 },
            });
            Helpers.resetTween({
                obj         : this._btnMyRoom,
                beginProps  : { alpha: 0, left: -40 },
                waitTime    : 80,
                endProps    : { alpha: 1, left: 0 },
            });
            Helpers.resetTween({
                obj         : this._btnContinueWar,
                beginProps  : { alpha: 0, left: -40 },
                waitTime    : 120,
                endProps    : { alpha: 1, left: 0 },
            });
            Helpers.resetTween({
                obj         : this._btnHelp,
                beginProps  : { alpha: 0, left: -40 },
                waitTime    : 160,
                endProps    : { alpha: 1, left: 0 },
            });
            Helpers.resetTween({
                obj         : this._btnNormalMode,
                beginProps  : { alpha: 0, left: -40 },
                waitTime    : 200,
                endProps    : { alpha: 1, left: 0 },
            });
        }
        private _showCloseAnimation(): Promise<void> {
            return new Promise<void>((resolve, reject) => {
                Helpers.resetTween({
                    obj         : this._group,
                    beginProps  : { alpha: 1, right: 60 },
                    endProps    : { alpha: 0, right: 20 },
                });
                Helpers.resetTween({
                    obj         : this._groupLeft,
                    beginProps  : { alpha: 1, left: 0 },
                    endProps    : { alpha: 0, left: -40 },
                    callback    : resolve,
                });
            });
        }

        private async _updateView(): Promise<void> {
            this._btnMyRoom.setRedVisible(await MfrModel.checkIsRed());
            this._btnContinueWar.setRedVisible(MultiPlayerWar.MpwModel.checkIsRedForMyMfwWars());
            this._btnNormalMode.setRedVisible(
                (MultiPlayerWar.MpwModel.checkIsRedForMyMcwWars()) ||
                (await MultiCustomRoom.McrModel.checkIsRed())
            );
        }
    }
}
