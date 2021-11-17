
// import CcrModel                     from "../../coopCustomRoom/model/CcrModel";
// import TwnsCcrMainMenuPanel         from "../../coopCustomRoom/view/CcrMainMenuPanel";
// import TwnsLobbyBottomPanel         from "../../lobby/view/LobbyBottomPanel";
// import TwnsLobbyTopPanel            from "../../lobby/view/LobbyTopPanel";
// import McrModel                     from "../../multiCustomRoom/model/McrModel";
// import TwnsMcwMyWarListPanel        from "../../multiCustomWar/view/McwMyWarListPanel";
// import MfrModel                     from "../../multiFreeRoom/model/MfrModel";
// import TwnsMfrMainMenuPanel         from "../../multiFreeRoom/view/MfrMainMenuPanel";
// import MpwModel                     from "../../multiPlayerWar/model/MpwModel";
// import TwnsMrrMainMenuPanel         from "../../multiRankRoom/view/MrrMainMenuPanel";
// import TwnsRwReplayListPanel        from "../../replayWar/view/RwReplayListPanel";
// import TwnsSpmMainMenuPanel         from "../../singlePlayerMode/view/SpmMainMenuPanel";
// import Helpers                      from "../../tools/helpers/Helpers";
// import Types                        from "../../tools/helpers/Types";
// import TwnsNotifyType               from "../../tools/notify/NotifyType";
// import TwnsUiButton                 from "../../tools/ui/UiButton";
// import TwnsUiPanel                  from "../../tools/ui/UiPanel";
// import WwModel                      from "../../watchWar/model/WwModel";
// import TwnsWwMainMenuPanel          from "../../watchWar/view/WwMainMenuPanel";
// import TwnsMcrCreateMapListPanel    from "./McrCreateMapListPanel";
// import TwnsMcrJoinRoomListPanel     from "./McrJoinRoomListPanel";
// import TwnsMcrMyRoomListPanel       from "./McrMyRoomListPanel";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace TwnsMcrMainMenuPanel {
    import NotifyType               = TwnsNotifyType.NotifyType;
    import Tween                    = egret.Tween;

    export class McrMainMenuPanel extends TwnsUiPanel.UiPanel<void> {
        protected readonly _LAYER_TYPE   = Types.LayerType.Scene;
        protected readonly _IS_EXCLUSIVE = true;

        private static _instance: McrMainMenuPanel;

        private readonly _group!            : eui.Group;
        private readonly _btnMultiPlayer!   : TwnsUiButton.UiButton;
        private readonly _btnRanking!       : TwnsUiButton.UiButton;
        private readonly _btnSinglePlayer!  : TwnsUiButton.UiButton;

        private readonly _groupLeft!        : eui.Group;
        private readonly _btnCreateRoom!    : TwnsUiButton.UiButton;
        private readonly _btnJoinRoom!      : TwnsUiButton.UiButton;
        private readonly _btnMyRoom!        : TwnsUiButton.UiButton;
        private readonly _btnContinueWar!   : TwnsUiButton.UiButton;
        private readonly _btnWatchWar!      : TwnsUiButton.UiButton;
        private readonly _btnReplayWar!     : TwnsUiButton.UiButton;
        private readonly _btnCoopMode!      : TwnsUiButton.UiButton;
        private readonly _btnFreeMode!      : TwnsUiButton.UiButton;

        public static show(): void {
            if (!McrMainMenuPanel._instance) {
                McrMainMenuPanel._instance = new McrMainMenuPanel();
            }
            McrMainMenuPanel._instance.open();
        }

        public static async hide(): Promise<void> {
            if (McrMainMenuPanel._instance) {
                await McrMainMenuPanel._instance.close();
            }
        }

        private constructor() {
            super();

            this.skinName = "resource/skins/multiCustomRoom/McrMainMenuPanel.exml";
        }

        protected _onOpened(): void {
            this._setUiListenerArray([
                { ui: this._btnRanking,         callback: this._onTouchedBtnRanking },
                { ui: this._btnSinglePlayer,    callback: this._onTouchedBtnSinglePlayer },
                { ui: this._btnCreateRoom,      callback: this._onTouchedBtnCreateRoom },
                { ui: this._btnJoinRoom,        callback: this._onTouchedBtnJoinRoom },
                { ui: this._btnMyRoom,          callback: this._onTouchedBtnMyRoom },
                { ui: this._btnContinueWar,     callback: this._onTouchedBtnContinueWar },
                { ui: this._btnWatchWar,        callback: this._onTouchedBtnWatchWar },
                { ui: this._btnReplayWar,       callback: this._onTouchedBtnReplayWar },
                { ui: this._btnCoopMode,        callback: this._onTouchedBtnCoopMode },
                { ui: this._btnFreeMode,        callback: this._onTouchedBtnFreeMode },
            ]);
            this._setNotifyListenerArray([
                { type: NotifyType.MsgUserLogout,      callback: this._onMsgUserLogout },
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
            TwnsPanelManager.open(TwnsPanelConfig.Dict.MrrMainMenuPanel, void 0);
        }
        private _onTouchedBtnSinglePlayer(): void {
            this.close();
            TwnsPanelManager.open(TwnsPanelConfig.Dict.SpmMainMenuPanel, void 0);
        }
        private _onTouchedBtnCreateRoom(): void {
            this.close();
            TwnsPanelManager.close(TwnsPanelConfig.Dict.LobbyTopPanel);
            TwnsPanelManager.close(TwnsPanelConfig.Dict.LobbyBottomPanel);
            TwnsMcrCreateMapListPanel.McrCreateMapListPanel.show({});
        }
        private _onTouchedBtnJoinRoom(): void {
            this.close();
            TwnsPanelManager.close(TwnsPanelConfig.Dict.LobbyTopPanel);
            TwnsPanelManager.close(TwnsPanelConfig.Dict.LobbyBottomPanel);
            TwnsMcrJoinRoomListPanel.McrJoinRoomListPanel.show();
        }
        private _onTouchedBtnMyRoom(): void {
            this.close();
            TwnsPanelManager.close(TwnsPanelConfig.Dict.LobbyTopPanel);
            TwnsPanelManager.close(TwnsPanelConfig.Dict.LobbyBottomPanel);
            TwnsMcrMyRoomListPanel.McrMyRoomListPanel.show();
        }
        private _onTouchedBtnContinueWar(): void {
            this.close();
            TwnsPanelManager.close(TwnsPanelConfig.Dict.LobbyTopPanel);
            TwnsPanelManager.close(TwnsPanelConfig.Dict.LobbyBottomPanel);
            TwnsMcwMyWarListPanel.McwMyWarListPanel.show();
        }
        private _onTouchedBtnWatchWar(): void {
            this.close();
            TwnsPanelManager.open(TwnsPanelConfig.Dict.WwMainMenuPanel, void 0);
        }
        private _onTouchedBtnReplayWar(): void {
            this.close();
            TwnsPanelManager.close(TwnsPanelConfig.Dict.LobbyTopPanel);
            TwnsPanelManager.close(TwnsPanelConfig.Dict.LobbyBottomPanel);
            TwnsPanelManager.open(TwnsPanelConfig.Dict.RwReplayListPanel, void 0);
        }
        private _onTouchedBtnCoopMode(): void {
            this.close();
            TwnsCcrMainMenuPanel.CcrMainMenuPanel.show();
        }
        private _onTouchedBtnFreeMode(): void {
            this.close();
            TwnsPanelManager.open(TwnsPanelConfig.Dict.MfrMainMenuPanel, void 0);
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
                waitTime    : 200 / 7 * 1,
                endProps    : { alpha: 1, left: 0 },
            });
            Helpers.resetTween({
                obj         : this._btnMyRoom,
                beginProps  : { alpha: 0, left: -40 },
                waitTime    : 200 / 7 * 2,
                endProps    : { alpha: 1, left: 0 },
            });
            Helpers.resetTween({
                obj         : this._btnContinueWar,
                beginProps  : { alpha: 0, left: -40 },
                waitTime    : 200 / 7 * 3,
                endProps    : { alpha: 1, left: 0 },
            });
            Helpers.resetTween({
                obj         : this._btnWatchWar,
                beginProps  : { alpha: 0, left: -40 },
                waitTime    : 200 / 7 * 4,
                endProps    : { alpha: 1, left: 0 },
            });
            Helpers.resetTween({
                obj         : this._btnReplayWar,
                beginProps  : { alpha: 0, left: -40 },
                waitTime    : 200 / 7 * 5,
                endProps    : { alpha: 1, left: 0 },
            });
            Helpers.resetTween({
                obj         : this._btnCoopMode,
                beginProps  : { alpha: 0, left: -40 },
                waitTime    : 200 / 7 * 6,
                endProps    : { alpha: 1, left: 0 },
            });
            Helpers.resetTween({
                obj         : this._btnFreeMode,
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
            const watchInfos = WwModel.getWatchRequestedWarInfos();
            this._btnMyRoom.setRedVisible(await McrModel.checkIsRed());
            this._btnContinueWar.setRedVisible(MpwModel.checkIsRedForMyMcwWars());
            this._btnWatchWar.setRedVisible((!!watchInfos) && (watchInfos.length > 0));
            this._btnCoopMode.setRedVisible(MpwModel.checkIsRedForMyCcwWars() || await CcrModel.checkIsRed());
            this._btnFreeMode.setRedVisible(MpwModel.checkIsRedForMyMfwWars() || await MfrModel.checkIsRed());
        }
    }
}

// export default TwnsMcrMainMenuPanel;
