
// import TwnsLobbyBottomPanel                 from "../../lobby/view/LobbyBottomPanel";
// import TwnsLobbyTopPanel                    from "../../lobby/view/LobbyTopPanel";
// import TwnsMcrMainMenuPanel                 from "../../multiCustomRoom/view/McrMainMenuPanel";
// import MpwModel                             from "../../multiPlayerWar/model/MpwModel";
// import TwnsMrwMyWarListPanel                from "../../multiRankWar/view/MrwMyWarListPanel";
// import TwnsSpmMainMenuPanel                 from "../../singlePlayerMode/view/SpmMainMenuPanel";
// import Helpers                              from "../../tools/helpers/Helpers";
// import Types                                from "../../tools/helpers/Types";
// import Twns.Notify                       from "../../tools/notify/NotifyType";
// import TwnsUiButton                         from "../../tools/ui/UiButton";
// import TwnsUiPanel                          from "../../tools/ui/UiPanel";
// import MrrModel                             from "../model/MrrModel";
// import TwnsMrrMyRoomListPanel               from "./MrrMyRoomListPanel";
// import TwnsMrrPreviewMapListPanel           from "./MrrPreviewMapListPanel";
// import TwnsMrrSetMaxConcurrentCountPanel    from "./MrrSetMaxConcurrentCountPanel";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.MultiRankRoom {
    import NotifyType                       = Twns.Notify.NotifyType;
    import Tween                            = egret.Tween;

    export type OpenDataForMrrMainMenuPanel = void;
    export class MrrMainMenuPanel extends TwnsUiPanel.UiPanel<OpenDataForMrrMainMenuPanel> {
        private readonly _group!                : eui.Group;
        private readonly _btnMultiPlayer!       : TwnsUiButton.UiButton;
        private readonly _btnRanking!           : TwnsUiButton.UiButton;
        private readonly _btnSinglePlayer!      : TwnsUiButton.UiButton;

        private readonly _groupLeft!            : eui.Group;
        private readonly _btnSetGameNumber!     : TwnsUiButton.UiButton;
        private readonly _btnMyRoom!            : TwnsUiButton.UiButton;
        private readonly _btnContinueWar!       : TwnsUiButton.UiButton;
        private readonly _btnPreviewStdMaps!    : TwnsUiButton.UiButton;
        private readonly _btnPreviewFogMaps!    : TwnsUiButton.UiButton;

        protected _onOpening(): void {
            this._setUiListenerArray([
                { ui: this._btnMultiPlayer,     callback: this._onTouchedBtnMultiPlayer },
                { ui: this._btnSinglePlayer,    callback: this._onTouchedBtnSinglePlayer },
                { ui: this._btnSetGameNumber,   callback: this._onTouchedBtnSetGameNumber },
                { ui: this._btnMyRoom,          callback: this._onTouchedBtnMyRoom },
                { ui: this._btnContinueWar,     callback: this._onTouchedBtnContinueWar },
                { ui: this._btnPreviewStdMaps,  callback: this._onTouchedBtnPreviewStdMaps },
                { ui: this._btnPreviewFogMaps,  callback: this._onTouchedBtnPreviewFogMaps },
            ]);
            this._setNotifyListenerArray([
                { type: NotifyType.MsgUserLogout,                       callback: this._onMsgUserLogout },
                { type: NotifyType.MsgMrrGetRoomPublicInfo,             callback: this._onMsgMrrGetRoomPublicInfo },
                { type: NotifyType.MsgMrrGetJoinedRoomIdArray,          callback: this._onMsgMrrGetJoinedRoomIdArray },
                { type: NotifyType.MsgMcrGetRoomPlayerInfo,             callback: this._onNotifyMsgMcrGetRoomPlayerInfo },
                { type: NotifyType.MsgMfrGetRoomPlayerInfo,             callback: this._onNotifyMsgMfrGetRoomPlayerInfo },
                { type: NotifyType.MsgCcrGetRoomPlayerInfo,             callback: this._onNotifyMsgCcrGetRoomPlayerInfo },
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
        private _onTouchedBtnMultiPlayer(): void {
            this.close();
            Twns.PanelHelpers.open(Twns.PanelHelpers.PanelDict.McrMainMenuPanel, void 0);
        }
        private _onTouchedBtnSinglePlayer(): void {
            this.close();
            Twns.PanelHelpers.open(Twns.PanelHelpers.PanelDict.SpmMainMenuPanel, void 0);
        }
        private _onTouchedBtnSetGameNumber(): void {
            Twns.PanelHelpers.open(Twns.PanelHelpers.PanelDict.MrrSetMaxConcurrentCountPanel, void 0);
        }
        private _onTouchedBtnMyRoom(): void {
            this.close();
            Twns.PanelHelpers.close(Twns.PanelHelpers.PanelDict.LobbyTopPanel);
            Twns.PanelHelpers.close(Twns.PanelHelpers.PanelDict.LobbyBottomPanel);
            Twns.PanelHelpers.open(Twns.PanelHelpers.PanelDict.MrrMyRoomListPanel, void 0);
        }
        private _onTouchedBtnContinueWar(): void {
            this.close();
            Twns.PanelHelpers.close(Twns.PanelHelpers.PanelDict.LobbyTopPanel);
            Twns.PanelHelpers.close(Twns.PanelHelpers.PanelDict.LobbyBottomPanel);
            Twns.PanelHelpers.open(Twns.PanelHelpers.PanelDict.MrwMyWarListPanel, void 0);
        }
        private _onTouchedBtnPreviewStdMaps(): void {
            this.close();
            Twns.PanelHelpers.close(Twns.PanelHelpers.PanelDict.LobbyTopPanel);
            Twns.PanelHelpers.close(Twns.PanelHelpers.PanelDict.LobbyBottomPanel);
            Twns.PanelHelpers.open(Twns.PanelHelpers.PanelDict.MrrPreviewMapListPanel, { hasFog: false });
        }
        private _onTouchedBtnPreviewFogMaps(): void {
            this.close();
            Twns.PanelHelpers.close(Twns.PanelHelpers.PanelDict.LobbyTopPanel);
            Twns.PanelHelpers.close(Twns.PanelHelpers.PanelDict.LobbyBottomPanel);
            Twns.PanelHelpers.open(Twns.PanelHelpers.PanelDict.MrrPreviewMapListPanel, { hasFog: true });
        }

        private _onMsgUserLogout(): void {
            this.close();
        }
        private _onMsgMrrGetRoomPublicInfo(): void {
            this._updateComponentsForRed();
        }
        private _onMsgMrrGetJoinedRoomIdArray(): void {
            this._updateComponentsForRed();
        }
        private _onNotifyMsgMcrGetRoomPlayerInfo(): void {
            this._updateBtnMultiPlayer();
        }
        private _onNotifyMsgMfrGetRoomPlayerInfo(): void {
            this._updateBtnMultiPlayer();
        }
        private _onNotifyMsgCcrGetRoomPlayerInfo(): void {
            this._updateBtnMultiPlayer();
        }
        private _onMsgMpwCommonGetWarProgressInfo(): void {
            this._updateBtnMultiPlayer();
            this._updateBtnRanking();
            this._updateBtnContinueWar();
        }
        private _onMsgMpwWatchGetRequestedWarIdArray(): void {
            this._updateBtnMultiPlayer();
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Private functions.
        ////////////////////////////////////////////////////////////////////////////////
        private _updateView(): void {
            this._updateComponentsForRed();
        }

        private async _updateComponentsForRed(): Promise<void> {
            this._updateBtnMultiPlayer();
            this._updateBtnRanking();
            this._updateBtnContinueWar();

            this._btnMyRoom.setRedVisible(await Twns.MultiRankRoom.MrrModel.checkIsRed());
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

        private async _updateBtnContinueWar(): Promise<void> {
            this._btnContinueWar.setRedVisible(await MultiPlayerWar.MpwModel.checkIsRedForMyMrwWars());
        }

        protected async _showOpenAnimation(): Promise<void> {
            const group = this._group;
            Tween.removeTweens(group);
            group.right = 60;
            group.alpha = 1;

            Twns.Helpers.resetTween({
                obj         : this._btnMultiPlayer,
                beginProps  : { alpha: 0, right: -40 },
                endProps    : { alpha: 1, right: 0 },
            });
            Twns.Helpers.resetTween({
                obj         : this._btnRanking,
                beginProps  : { alpha: 0, right: -40 },
                waitTime    : 100,
                endProps    : { alpha: 1, right: 0 },
            });
            Twns.Helpers.resetTween({
                obj         : this._btnSinglePlayer,
                beginProps  : { alpha: 0, right: -40 },
                waitTime    : 200,
                endProps    : { alpha: 1, right: 0 },
            });

            const groupLeft = this._groupLeft;
            Tween.removeTweens(groupLeft);
            groupLeft.left  = 0;
            groupLeft.alpha = 1;

            Twns.Helpers.resetTween({
                obj         : this._btnSetGameNumber,
                beginProps  : { alpha: 0, left: -40 },
                endProps    : { alpha: 1, left: 0 },
            });
            Twns.Helpers.resetTween({
                obj         : this._btnMyRoom,
                beginProps  : { alpha: 0, left: -40 },
                waitTime    : 50,
                endProps    : { alpha: 1, left: 0 },
            });
            Twns.Helpers.resetTween({
                obj         : this._btnContinueWar,
                beginProps  : { alpha: 0, left: -40 },
                waitTime    : 100,
                endProps    : { alpha: 1, left: 0 },
            });
            Twns.Helpers.resetTween({
                obj         : this._btnPreviewStdMaps,
                beginProps  : { alpha: 0, left: -40 },
                waitTime    : 150,
                endProps    : { alpha: 1, left: 0 },
            });
            Twns.Helpers.resetTween({
                obj         : this._btnPreviewFogMaps,
                beginProps  : { alpha: 0, left: -40 },
                waitTime    : 200,
                endProps    : { alpha: 1, left: 0 },
            });

            await Twns.Helpers.wait(200 + CommonConstants.DefaultTweenTime);
        }
        protected async _showCloseAnimation(): Promise<void> {
            Twns.Helpers.resetTween({
                obj         : this._group,
                beginProps  : { alpha: 1, right: 60 },
                endProps    : { alpha: 0, right: 20 },
            });
            Twns.Helpers.resetTween({
                obj         : this._groupLeft,
                beginProps  : { alpha: 1, left: 0 },
                endProps    : { alpha: 0, left: -40},
            });

            await Twns.Helpers.wait(CommonConstants.DefaultTweenTime);
        }
    }
}

// export default TwnsMrrMainMenuPanel;
