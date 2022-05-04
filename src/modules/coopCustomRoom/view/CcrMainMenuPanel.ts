
// import TwnsCommonAlertPanel         from "../../common/view/CommonAlertPanel";
// import CcrModel                     from "../../coopCustomRoom/model/CcrModel";
// import TwnsCcwMyWarListPanel        from "../../coopCustomWar/view/CcwMyWarListPanel";
// import TwnsLobbyBottomPanel         from "../../lobby/view/LobbyBottomPanel";
// import TwnsLobbyTopPanel            from "../../lobby/view/LobbyTopPanel";
// import McrModel                     from "../../multiCustomRoom/model/McrModel";
// import TwnsMcrMainMenuPanel         from "../../multiCustomRoom/view/McrMainMenuPanel";
// import MfrModel                     from "../../multiFreeRoom/model/MfrModel";
// import TwnsMfrMainMenuPanel         from "../../multiFreeRoom/view/MfrMainMenuPanel";
// import MpwModel                     from "../../multiPlayerWar/model/MpwModel";
// import TwnsMrrMainMenuPanel         from "../../multiRankRoom/view/MrrMainMenuPanel";
// import TwnsSpmMainMenuPanel         from "../../singlePlayerMode/view/SpmMainMenuPanel";
// import Helpers                      from "../../tools/helpers/Helpers";
// import Types                        from "../../tools/helpers/Types";
// import Lang                         from "../../tools/lang/Lang";
// import TwnsLangTextType             from "../../tools/lang/LangTextType";
// import Twns.Notify               from "../../tools/notify/NotifyType";
// import TwnsUiButton                 from "../../tools/ui/UiButton";
// import TwnsUiPanel                  from "../../tools/ui/UiPanel";
// import TwnsCcrCreateMapListPanel    from "./CcrCreateMapListPanel";
// import TwnsCcrJoinRoomListPanel     from "./CcrJoinRoomListPanel";
// import TwnsCcrMyRoomListPanel       from "./CcrMyRoomListPanel";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.CoopCustomRoom {
    import NotifyType               = Twns.Notify.NotifyType;
    import Tween                    = egret.Tween;
    import LangTextType             = Twns.Lang.LangTextType;

    export type OpenDataForCcrMainMenuPanel = void;
    export class CcrMainMenuPanel extends TwnsUiPanel.UiPanel<OpenDataForCcrMainMenuPanel> {
        private readonly _group!            : eui.Group;
        private readonly _btnMultiPlayer!   : TwnsUiButton.UiButton;
        private readonly _btnRanking!       : TwnsUiButton.UiButton;
        private readonly _btnSinglePlayer!  : TwnsUiButton.UiButton;

        private readonly _groupLeft!        : eui.Group;
        private readonly _btnCreateRoom!    : TwnsUiButton.UiButton;
        private readonly _btnJoinRoom!      : TwnsUiButton.UiButton;
        private readonly _btnMyRoom!        : TwnsUiButton.UiButton;
        private readonly _btnContinueWar!   : TwnsUiButton.UiButton;
        private readonly _btnHelp!          : TwnsUiButton.UiButton;
        private readonly _btnNormalMode!    : TwnsUiButton.UiButton;
        private readonly _btnFreeMode!      : TwnsUiButton.UiButton;

        protected _onOpening(): void {
            this._setUiListenerArray([
                { ui: this._btnRanking,         callback: this._onTouchedBtnRanking },
                { ui: this._btnSinglePlayer,    callback: this._onTouchedBtnSinglePlayer },
                { ui: this._btnCreateRoom,      callback: this._onTouchedBtnCreateRoom },
                { ui: this._btnJoinRoom,        callback: this._onTouchedBtnJoinRoom },
                { ui: this._btnMyRoom,          callback: this._onTouchedBtnMyRoom },
                { ui: this._btnContinueWar,     callback: this._onTouchedBtnContinueWar },
                { ui: this._btnHelp,            callback: this._onTouchedBtnHelp },
                { ui: this._btnNormalMode,      callback: this._onTouchedBtnNormalMode },
                { ui: this._btnFreeMode,        callback: this._onTouchedBtnFreeMode },
            ]);
            this._setNotifyListenerArray([
                { type: NotifyType.MsgUserLogout,                       callback: this._onMsgUserLogout },
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
            Twns.PanelHelpers.open(Twns.PanelHelpers.PanelDict.MrrMainMenuPanel, void 0);
        }
        private _onTouchedBtnSinglePlayer(): void {
            this.close();
            Twns.PanelHelpers.open(Twns.PanelHelpers.PanelDict.SpmMainMenuPanel, void 0);
        }
        private _onTouchedBtnCreateRoom(): void {
            this.close();
            Twns.PanelHelpers.close(Twns.PanelHelpers.PanelDict.LobbyTopPanel);
            Twns.PanelHelpers.close(Twns.PanelHelpers.PanelDict.LobbyBottomPanel);
            Twns.PanelHelpers.open(Twns.PanelHelpers.PanelDict.CcrCreateMapListPanel, {});
        }
        private _onTouchedBtnJoinRoom(): void {
            this.close();
            Twns.PanelHelpers.close(Twns.PanelHelpers.PanelDict.LobbyTopPanel);
            Twns.PanelHelpers.close(Twns.PanelHelpers.PanelDict.LobbyBottomPanel);
            Twns.PanelHelpers.open(Twns.PanelHelpers.PanelDict.CcrJoinRoomListPanel, { filter: null });
        }
        private _onTouchedBtnMyRoom(): void {
            this.close();
            Twns.PanelHelpers.close(Twns.PanelHelpers.PanelDict.LobbyTopPanel);
            Twns.PanelHelpers.close(Twns.PanelHelpers.PanelDict.LobbyBottomPanel);
            Twns.PanelHelpers.open(Twns.PanelHelpers.PanelDict.CcrMyRoomListPanel, void 0);
        }
        private _onTouchedBtnContinueWar(): void {
            this.close();
            Twns.PanelHelpers.close(Twns.PanelHelpers.PanelDict.LobbyTopPanel);
            Twns.PanelHelpers.close(Twns.PanelHelpers.PanelDict.LobbyBottomPanel);
            Twns.PanelHelpers.open(Twns.PanelHelpers.PanelDict.CcwMyWarListPanel, void 0);
        }
        private _onTouchedBtnHelp(): void {
            Twns.PanelHelpers.open(Twns.PanelHelpers.PanelDict.CommonAlertPanel, {
                title   : Lang.getText(LangTextType.B0143),
                content : Lang.getText(LangTextType.R0008),
            });
        }
        private _onTouchedBtnNormalMode(): void {
            this.close();
            Twns.PanelHelpers.open(Twns.PanelHelpers.PanelDict.McrMainMenuPanel, void 0);
        }
        private _onTouchedBtnFreeMode(): void {
            this.close();
            Twns.PanelHelpers.open(Twns.PanelHelpers.PanelDict.MfrMainMenuPanel, void 0);
        }

        private _onMsgUserLogout(): void {
            this.close();
        }
        private _onMsgMpwCommonGetWarProgressInfo(): void {
            this._updateBtnContinueWar();
            this._updateBtnNormalMode();
            this._updateBtnFreeMode();
            this._updateBtnMultiPlayer();
            this._updateBtnRanking();
        }
        private _onMsgMpwWatchGetRequestedWarIdArray(): void {
            this._updateBtnMultiPlayer();
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Private functions.
        ////////////////////////////////////////////////////////////////////////////////
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
                obj         : this._btnCreateRoom,
                beginProps  : { alpha: 0, left: -40 },
                endProps    : { alpha: 1, left: 0 },
            });
            Twns.Helpers.resetTween({
                obj         : this._btnJoinRoom,
                beginProps  : { alpha: 0, left: -40 },
                waitTime    : 200 / 6 * 1,
                endProps    : { alpha: 1, left: 0 },
            });
            Twns.Helpers.resetTween({
                obj         : this._btnMyRoom,
                beginProps  : { alpha: 0, left: -40 },
                waitTime    : 200 / 6 * 2,
                endProps    : { alpha: 1, left: 0 },
            });
            Twns.Helpers.resetTween({
                obj         : this._btnContinueWar,
                beginProps  : { alpha: 0, left: -40 },
                waitTime    : 200 / 6 * 3,
                endProps    : { alpha: 1, left: 0 },
            });
            Twns.Helpers.resetTween({
                obj         : this._btnHelp,
                beginProps  : { alpha: 0, left: -40 },
                waitTime    : 200 / 6 * 4,
                endProps    : { alpha: 1, left: 0 },
            });
            Twns.Helpers.resetTween({
                obj         : this._btnNormalMode,
                beginProps  : { alpha: 0, left: -40 },
                waitTime    : 200 / 6 * 5,
                endProps    : { alpha: 1, left: 0 },
            });
            Twns.Helpers.resetTween({
                obj         : this._btnFreeMode,
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
                endProps    : { alpha: 0, left: -40 },
            });

            await Twns.Helpers.wait(CommonConstants.DefaultTweenTime);
        }

        private async _updateView(): Promise<void> {
            this._updateBtnContinueWar();
            this._updateBtnNormalMode();
            this._updateBtnFreeMode();
            this._updateBtnMultiPlayer();
            this._updateBtnRanking();

            this._btnMyRoom.setRedVisible(await CcrModel.checkIsRed());
        }
        private async _updateBtnContinueWar(): Promise<void> {
            this._btnContinueWar.setRedVisible(await MultiPlayerWar.MpwModel.checkIsRedForMyCcwWars());
        }
        private async _updateBtnNormalMode(): Promise<void> {
            this._btnNormalMode.setRedVisible(await Lobby.LobbyModel.checkIsRedForMultiCustomMode());
        }
        private async _updateBtnFreeMode(): Promise<void> {
            this._btnFreeMode.setRedVisible(await Lobby.LobbyModel.checkIsRedForMultiFreeMode());
        }
        private async _updateBtnMultiPlayer(): Promise<void> {
            this._btnMultiPlayer.setRedVisible(await Lobby.LobbyModel.checkIsRedForMultiPlayer());
        }
        private async _updateBtnRanking(): Promise<void> {
            this._btnRanking.setRedVisible(await Lobby.LobbyModel.checkIsRedForRanking());
        }
    }
}

// export default TwnsCcrMainMenuPanel;
