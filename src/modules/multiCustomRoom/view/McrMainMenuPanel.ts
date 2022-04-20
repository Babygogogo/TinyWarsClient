
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
namespace Twns.MultiCustomRoom {
    import NotifyType               = TwnsNotifyType.NotifyType;
    import Tween                    = egret.Tween;

    export type OpenDataForMcrMainMenuPanel = void;
    export class McrMainMenuPanel extends TwnsUiPanel.UiPanel<OpenDataForMcrMainMenuPanel> {
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

        protected _onOpening(): void {
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
                { type: NotifyType.MsgUserLogout,                       callback: this._onNotifyMsgUserLogout },
                { type: NotifyType.MsgMcrGetRoomPlayerInfo,             callback: this._onNotifyMsgMcrGetRoomPlayerInfo },
                { type: NotifyType.MsgMfrGetRoomPlayerInfo,             callback: this._onNotifyMsgMfrGetRoomPlayerInfo },
                { type: NotifyType.MsgCcrGetRoomPlayerInfo,             callback: this._onNotifyMsgCcrGetRoomPlayerInfo },
                { type: NotifyType.MsgMrrGetJoinedRoomIdArray,          callback: this._onMsgMrrGetJoinedRoomIdArray },
                { type: NotifyType.MsgMpwCommonGetWarProgressInfo,      callback: this._onMsgMpwCommonGetWarProgressInfo },
                { type: NotifyType.MsgMpwWatchGetRequestedWarIdArray,   callback: this._onMsgMpwWatchGetRequestedWarIdArray },
            ]);
        }
        protected async _updateOnOpenDataChanged(): Promise<void> {
            this._updateView();
        }
        protected _onClosing(): void {
            // nothing to do
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
            TwnsPanelManager.open(TwnsPanelConfig.Dict.McrCreateMapListPanel, {});
        }
        private _onTouchedBtnJoinRoom(): void {
            this.close();
            TwnsPanelManager.close(TwnsPanelConfig.Dict.LobbyTopPanel);
            TwnsPanelManager.close(TwnsPanelConfig.Dict.LobbyBottomPanel);
            TwnsPanelManager.open(TwnsPanelConfig.Dict.McrJoinRoomListPanel, { filter: null });
        }
        private _onTouchedBtnMyRoom(): void {
            this.close();
            TwnsPanelManager.close(TwnsPanelConfig.Dict.LobbyTopPanel);
            TwnsPanelManager.close(TwnsPanelConfig.Dict.LobbyBottomPanel);
            TwnsPanelManager.open(TwnsPanelConfig.Dict.McrMyRoomListPanel, void 0);
        }
        private _onTouchedBtnContinueWar(): void {
            this.close();
            TwnsPanelManager.close(TwnsPanelConfig.Dict.LobbyTopPanel);
            TwnsPanelManager.close(TwnsPanelConfig.Dict.LobbyBottomPanel);
            TwnsPanelManager.open(TwnsPanelConfig.Dict.McwMyWarListPanel, void 0);
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
            TwnsPanelManager.open(TwnsPanelConfig.Dict.CcrMainMenuPanel, void 0);
        }
        private _onTouchedBtnFreeMode(): void {
            this.close();
            TwnsPanelManager.open(TwnsPanelConfig.Dict.MfrMainMenuPanel, void 0);
        }

        private _onNotifyMsgUserLogout(): void {
            this.close();
        }
        private _onNotifyMsgMcrGetRoomPlayerInfo(): void {
            this._updateBtnMultiPlayer();
            this._updateBtnMyRoom();
        }
        private _onNotifyMsgMfrGetRoomPlayerInfo(): void {
            this._updateBtnMultiPlayer();
        }
        private _onNotifyMsgCcrGetRoomPlayerInfo(): void {
            this._updateBtnMultiPlayer();
        }
        private _onMsgMrrGetJoinedRoomIdArray(): void {
            this._updateBtnRanking();
        }
        private _onMsgMpwCommonGetWarProgressInfo(): void {
            this._updateBtnMultiPlayer();
            this._updateBtnRanking();
            this._updateBtnContinueWar();
            this._updateBtnCoopMode();
            this._updateBtnFreeMode();
        }
        private _onMsgMpwWatchGetRequestedWarIdArray(): void {
            this._updateBtnMultiPlayer();
            this._updateBtnWatchWar();
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Private functions.
        ////////////////////////////////////////////////////////////////////////////////
        protected async _showOpenAnimation(): Promise<void> {
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

            await Helpers.wait(200 + CommonConstants.DefaultTweenTime);
        }
        protected async _showCloseAnimation(): Promise<void> {
            Helpers.resetTween({
                obj         : this._group,
                beginProps  : { alpha: 1, right: 60 },
                endProps    : { alpha: 0, right: 20 },
            });
            Helpers.resetTween({
                obj         : this._groupLeft,
                beginProps  : { alpha: 1, left: 0 },
                endProps    : { alpha: 0, left: -40 },
            });

            await Helpers.wait(CommonConstants.DefaultTweenTime);
        }

        private async _updateView(): Promise<void> {
            this._updateBtnMultiPlayer();
            this._updateBtnRanking();
            this._updateBtnMyRoom();
            this._updateBtnContinueWar();
            this._updateBtnCoopMode();
            this._updateBtnFreeMode();
            this._updateBtnWatchWar();
        }

        private async _updateBtnMultiPlayer(): Promise<void> {
            this._btnMultiPlayer.setRedVisible(await Lobby.LobbyModel.checkIsRedForMultiPlayer());
        }

        private async _updateBtnRanking(): Promise<void> {
            this._btnRanking.setRedVisible(
                (await MultiPlayerWar.MpwModel.checkIsRedForMyMrwWars()) ||
                (await Twns.MultiRankRoom.MrrModel.checkIsRed())
            );
        }

        private async _updateBtnMyRoom(): Promise<void> {
            this._btnMyRoom.setRedVisible(await McrModel.checkIsRed());
        }

        private async _updateBtnContinueWar(): Promise<void> {
            this._btnContinueWar.setRedVisible(await MultiPlayerWar.MpwModel.checkIsRedForMyMcwWars());
        }

        private async _updateBtnCoopMode(): Promise<void> {
            this._btnCoopMode.setRedVisible(await Lobby.LobbyModel.checkIsRedForMultiCoopMode());
        }

        private async _updateBtnFreeMode(): Promise<void> {
            this._btnFreeMode.setRedVisible(await Lobby.LobbyModel.checkIsRedForMultiFreeMode());
        }

        private _updateBtnWatchWar(): void {
            this._btnWatchWar.setRedVisible(Twns.WatchWar.WwModel.checkIsRed());
        }
    }
}

// export default TwnsMcrMainMenuPanel;
