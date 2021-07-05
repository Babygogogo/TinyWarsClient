
// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace TinyWars.MultiFreeRoom {
    import Tween    = egret.Tween;
    import Lang     = Utility.Lang;
    import Notify   = Utility.Notify;
    import Helpers  = Utility.Helpers;
    import MpwModel = MultiPlayerWar.MpwModel;

    export class MfrMainMenuPanel extends GameUi.UiPanel<void> {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Scene;
        protected readonly _IS_EXCLUSIVE = true;

        private static _instance: MfrMainMenuPanel;

        // @ts-ignore
        private readonly _group             : eui.Group;
        // @ts-ignore
        private readonly _btnMultiPlayer    : GameUi.UiButton;
        // @ts-ignore
        private readonly _btnRanking        : GameUi.UiButton;
        // @ts-ignore
        private readonly _btnSinglePlayer   : GameUi.UiButton;

        // @ts-ignore
        private readonly _groupLeft         : eui.Group;
        // @ts-ignore
        private readonly _btnCreateRoom     : GameUi.UiButton;
        // @ts-ignore
        private readonly _btnJoinRoom       : GameUi.UiButton;
        // @ts-ignore
        private readonly _btnMyRoom         : GameUi.UiButton;
        // @ts-ignore
        private readonly _btnContinueWar    : GameUi.UiButton;
        // @ts-ignore
        private readonly _btnHelp           : GameUi.UiButton;
        // @ts-ignore
        private readonly _btnNormalMode     : GameUi.UiButton;
        // @ts-ignore
        private readonly _btnCoopMode       : GameUi.UiButton;

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
                { ui: this._btnCoopMode,        callback: this._onTouchedBtnCoopMode },
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
        private _onTouchedBtnRanking(): void {
            this.close();
            MultiRankRoom.MrrMainMenuPanel.show();
        }
        private _onTouchedBtnSinglePlayer(): void {
            this.close();
            SinglePlayerMode.SpmMainMenuPanel.show();
        }
        private _onTouchedBtnCreateRoom(): void {
            Utility.FloatText.show(Lang.getText(Lang.Type.A0053));
            Utility.FloatText.show(Lang.getText(Lang.Type.A0198));
            // this.close();
            // Lobby.LobbyTopPanel.hide();
            // Lobby.LobbyBottomPanel.hide();
            // MfrCreateMapListPanel.show({});
        }
        private _onTouchedBtnJoinRoom(): void {
            this.close();
            Lobby.LobbyTopPanel.hide();
            Lobby.LobbyBottomPanel.hide();
            MfrJoinRoomListPanel.show();
        }
        private _onTouchedBtnMyRoom(): void {
            this.close();
            Lobby.LobbyTopPanel.hide();
            Lobby.LobbyBottomPanel.hide();
            MfrMyRoomListPanel.show();
        }
        private _onTouchedBtnContinueWar(): void {
            this.close();
            Lobby.LobbyTopPanel.hide();
            Lobby.LobbyBottomPanel.hide();
            MultiFreeWar.MfwMyWarListPanel.show();
        }
        private _onTouchedBtnHelp(): void {
            Common.CommonAlertPanel.show({
                title   : Lang.getText(Lang.Type.B0143),
                content : Lang.getText(Lang.Type.R0007),
            });
        }
        private _onTouchedBtnNormalMode(): void {
            this.close();
            MultiCustomRoom.McrMainMenuPanel.show();
        }
        private _onTouchedBtnCoopMode(): void {
            this.close();
            CoopCustomRoom.CcrMainMenuPanel.show();
        }

        private _onMsgUserLogout(): void {
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
                waitTime    : 200 / 6 * 1,
                endProps    : { alpha: 1, left: 0 },
            });
            Helpers.resetTween({
                obj         : this._btnMyRoom,
                beginProps  : { alpha: 0, left: -40 },
                waitTime    : 200 / 6 * 2,
                endProps    : { alpha: 1, left: 0 },
            });
            Helpers.resetTween({
                obj         : this._btnContinueWar,
                beginProps  : { alpha: 0, left: -40 },
                waitTime    : 200 / 6 * 3,
                endProps    : { alpha: 1, left: 0 },
            });
            Helpers.resetTween({
                obj         : this._btnHelp,
                beginProps  : { alpha: 0, left: -40 },
                waitTime    : 200 / 6 * 4,
                endProps    : { alpha: 1, left: 0 },
            });
            Helpers.resetTween({
                obj         : this._btnNormalMode,
                beginProps  : { alpha: 0, left: -40 },
                waitTime    : 200 / 6 * 5,
                endProps    : { alpha: 1, left: 0 },
            });
            Helpers.resetTween({
                obj         : this._btnCoopMode,
                beginProps  : { alpha: 0, left: -40 },
                waitTime    : 200,
                endProps    : { alpha: 1, left: 0 },
            });
        }
        private _showCloseAnimation(): Promise<void> {
            return new Promise<void>((resolve) => {
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
            this._btnContinueWar.setRedVisible(MpwModel.checkIsRedForMyMfwWars());
            this._btnNormalMode.setRedVisible((MpwModel.checkIsRedForMyMcwWars()) || (await MultiCustomRoom.McrModel.checkIsRed()));
            this._btnCoopMode.setRedVisible((MpwModel.checkIsRedForMyCcwWars()) || (await CoopCustomRoom.CcrModel.checkIsRed()));
        }
    }
}
