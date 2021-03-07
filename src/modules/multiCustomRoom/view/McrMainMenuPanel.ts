
namespace TinyWars.MultiCustomRoom {
    import Tween        = egret.Tween;
    import Lang         = Utility.Lang;
    import Notify       = Utility.Notify;
    import Helpers      = Utility.Helpers;

    export class McrMainMenuPanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Scene;
        protected readonly _IS_EXCLUSIVE = true;

        private static _instance: McrMainMenuPanel;

        private readonly _btnBack           : TinyWars.GameUi.UiButton;

        private readonly _group             : eui.Group;
        private readonly _btnMultiPlayer    : TinyWars.GameUi.UiButton;
        private readonly _btnRanking        : TinyWars.GameUi.UiButton;
        private readonly _btnSinglePlayer   : TinyWars.GameUi.UiButton;

        private readonly _groupLeft         : eui.Group;
        private readonly _btnCreateRoom     : TinyWars.GameUi.UiButton;
        private readonly _btnJoinRoom       : TinyWars.GameUi.UiButton;
        private readonly _btnMyRoom         : TinyWars.GameUi.UiButton;
        private readonly _btnContinueWar    : TinyWars.GameUi.UiButton;
        private readonly _btnWatchWar       : TinyWars.GameUi.UiButton;
        private readonly _btnReplayWar      : TinyWars.GameUi.UiButton;

        public static show(): void {
            if (!McrMainMenuPanel._instance) {
                McrMainMenuPanel._instance = new McrMainMenuPanel();
            }
            McrMainMenuPanel._instance.open(undefined);
        }

        public static async hide(): Promise<void> {
            if (McrMainMenuPanel._instance) {
                await McrMainMenuPanel._instance.close();
            }
        }

        private constructor() {
            super();

            this._setIsAutoAdjustHeight();
            this.skinName = "resource/skins/multiCustomRoom/McrMainMenuPanel.exml";
        }

        protected _onOpened(): void {
            this._setUiListenerArray([
                { ui: this._btnBack,            callback: this._onTouchedBtnBack },
                { ui: this._btnRanking,         callback: this._onTouchedBtnRanking },
                { ui: this._btnSinglePlayer,    callback: this._onTouchedBtnSinglePlayer },
                { ui: this._btnCreateRoom,      callback: this._onTouchedBtnCreateRoom },
                { ui: this._btnJoinRoom,        callback: this._onTouchedBtnJoinRoom },
                { ui: this._btnMyRoom,          callback: this._onTouchedBtnMyRoom },
                { ui: this._btnContinueWar,     callback: this._onTouchedBtnContinueWar },
                { ui: this._btnWatchWar,        callback: this._onTouchedBtnWatchWar },
                { ui: this._btnReplayWar,       callback: this._onTouchedBtnReplayWar },
            ]);
            this._setNotifyListenerArray([
                { type: Notify.Type.LanguageChanged,    callback: this._onNotifyLanguageChanged },
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
        private _onTouchedBtnBack(e: egret.TouchEvent): void {
            this.close();
            Lobby.LobbyPanel.show();
        }
        private _onTouchedBtnRanking(e: egret.TouchEvent): void {
            this.close();
            MultiRankRoom.MrrMainMenuPanel.show();
        }
        private _onTouchedBtnSinglePlayer(e: egret.TouchEvent): void {
            this.close();
            SinglePlayerLobby.SinglePlayerLobbyPanel.show();
        }
        private _onTouchedBtnCreateRoom(e: egret.TouchEvent): void {
            this.close();
            McrCreateMapListPanel.show({});
        }
        private _onTouchedBtnJoinRoom(e: egret.TouchEvent): void {
            this.close();
            McrJoinRoomListPanel.show();
        }
        private _onTouchedBtnMyRoom(e: egret.TouchEvent): void {
            this.close();
            McrMyRoomListPanel.show();
        }
        private _onTouchedBtnContinueWar(e: egret.TouchEvent): void {
            this.close();
            McrMyWarListPanel.show();
        }
        private _onTouchedBtnWatchWar(e: egret.TouchEvent): void {
            this.close();
            McrWatchMainMenuPanel.show();
        }
        private _onTouchedBtnReplayWar(e: egret.TouchEvent): void {
            this.close();
            ReplayWar.RwReplayListPanel.show();
        }

        private _onNotifyLanguageChanged(e: egret.Event): void {
            this._updateComponentsForLanguage();
        }
        private _onMsgUserLogout(e: egret.Event): void {
            this.close();
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Private functions.
        ////////////////////////////////////////////////////////////////////////////////
        private _showOpenAnimation(): void {
            Helpers.resetTween({
                obj         : this._btnBack,
                beginProps  : { alpha: 0, bottom: -20 },
                waitTime    : 0,
                endProps    : { alpha: 1, bottom: 20 },
                tweenTime   : 200,
            });

            const group = this._group;
            Tween.removeTweens(group);
            group.right = 60;
            group.alpha = 1;

            Helpers.resetTween({
                obj         : this._btnMultiPlayer,
                beginProps  : { alpha: 0, right: -40 },
                waitTime    : 0,
                endProps    : { alpha: 1, right: 0 },
                tweenTime   : 200,
            });
            Helpers.resetTween({
                obj         : this._btnRanking,
                beginProps  : { alpha: 0, right: -40 },
                waitTime    : 100,
                endProps    : { alpha: 1, right: 0 },
                tweenTime   : 200,
            });
            Helpers.resetTween({
                obj         : this._btnSinglePlayer,
                beginProps  : { alpha: 0, right: -40 },
                waitTime    : 200,
                endProps    : { alpha: 1, right: 0 },
                tweenTime   : 200,
            });

            const groupLeft = this._groupLeft;
            Tween.removeTweens(groupLeft);
            groupLeft.left  = 0;
            groupLeft.alpha = 1;

            Helpers.resetTween({
                obj         : this._btnCreateRoom,
                beginProps  : { alpha: 0, left: -40 },
                waitTime    : 0,
                endProps    : { alpha: 1, left: 0 },
                tweenTime   : 200,
            });
            Helpers.resetTween({
                obj         : this._btnJoinRoom,
                beginProps  : { alpha: 0, left: -40 },
                waitTime    : 40,
                endProps    : { alpha: 1, left: 0 },
                tweenTime   : 200,
            });
            Helpers.resetTween({
                obj         : this._btnMyRoom,
                beginProps  : { alpha: 0, left: -40 },
                waitTime    : 80,
                endProps    : { alpha: 1, left: 0 },
                tweenTime   : 200,
            });
            Helpers.resetTween({
                obj         : this._btnContinueWar,
                beginProps  : { alpha: 0, left: -40 },
                waitTime    : 120,
                endProps    : { alpha: 1, left: 0 },
                tweenTime   : 200,
            });
            Helpers.resetTween({
                obj         : this._btnWatchWar,
                beginProps  : { alpha: 0, left: -40 },
                waitTime    : 160,
                endProps    : { alpha: 1, left: 0 },
                tweenTime   : 200,
            });
            Helpers.resetTween({
                obj         : this._btnReplayWar,
                beginProps  : { alpha: 0, left: -40 },
                waitTime    : 200,
                endProps    : { alpha: 1, left: 0 },
                tweenTime   : 200,
            });
        }
        private _showCloseAnimation(): Promise<void> {
            return new Promise<void>((resolve, reject) => {
                Helpers.resetTween({
                    obj         : this._btnBack,
                    beginProps  : { alpha: 1, bottom: 20 },
                    waitTime    : 0,
                    endProps    : { alpha: 0, bottom: -20 },
                    tweenTime   : 200,
                });

                const group = this._group;
                Tween.removeTweens(group);
                Tween.get(group)
                    .set({ alpha: 1, right: 60 })
                    .to({ alpha: 0, right: 20 }, 200);

                const groupLeft = this._groupLeft;
                Tween.removeTweens(groupLeft);
                Tween.get(groupLeft)
                    .set({ alpha: 1, left: 0 })
                    .to({ alpha: 0, left: -40 }, 200)
                    .call(resolve);
            });
        }

        private async _updateView(): Promise<void> {
            this._updateComponentsForLanguage();

            const watchInfos = MultiPlayerWar.MpwModel.getWatchRequestedWarInfos();
            this._btnMyRoom.setRedVisible(await McrModel.checkIsRed());
            this._btnContinueWar.setRedVisible(MultiPlayerWar.MpwModel.checkIsRedForMyMcwWars());
            this._btnWatchWar.setRedVisible((!!watchInfos) && (watchInfos.length > 0))
        }

        private _updateComponentsForLanguage(): void {
            this._btnBack.label = Lang.getText(Lang.Type.B0146);
        }
    }
}
