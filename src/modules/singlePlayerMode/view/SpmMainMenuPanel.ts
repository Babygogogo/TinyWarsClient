
// import TwnsLobbyBottomPanel         from "../../lobby/view/LobbyBottomPanel";
// import TwnsLobbyTopPanel            from "../../lobby/view/LobbyTopPanel";
// import TwnsMcrMainMenuPanel         from "../../multiCustomRoom/view/McrMainMenuPanel";
// import TwnsMrrMainMenuPanel         from "../../multiRankRoom/view/MrrMainMenuPanel";
// import TwnsScrCreateMapListPanel    from "../../singleCustomRoom/view/ScrCreateMapListPanel";
// import FloatText                    from "../../tools/helpers/FloatText";
// import Helpers                      from "../../tools/helpers/Helpers";
// import Types                        from "../../tools/helpers/Types";
// import Lang                         from "../../tools/lang/Lang";
// import TwnsLangTextType             from "../../tools/lang/LangTextType";
// import Twns.Notify               from "../../tools/notify/NotifyType";
// import TwnsUiButton                 from "../../tools/ui/UiButton";
// import TwnsUiPanel                  from "../../tools/ui/UiPanel";
// import TwnsSpmWarListPanel          from "./SpmWarListPanel";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.SinglePlayerMode {
    import LangTextType             = Twns.Lang.LangTextType;
    import NotifyType               = Twns.Notify.NotifyType;
    import Tween                    = egret.Tween;

    export type OpenDataForSpmMainMenuPanel = void;
    export class SpmMainMenuPanel extends TwnsUiPanel.UiPanel<OpenDataForSpmMainMenuPanel> {
        private readonly _groupLeft!            : eui.Group;
        private readonly _btnCampaign!          : TwnsUiButton.UiButton;
        private readonly _btnCreateWarRoom!     : TwnsUiButton.UiButton;
        private readonly _btnCreateCustomWar!   : TwnsUiButton.UiButton;
        private readonly _btnContinueWar!       : TwnsUiButton.UiButton;

        private readonly _group!                : eui.Group;
        private readonly _btnMultiPlayer!       : TwnsUiButton.UiButton;
        private readonly _btnRanking!           : TwnsUiButton.UiButton;
        private readonly _btnSinglePlayer!      : TwnsUiButton.UiButton;

        protected _onOpening(): void {
            this._setUiListenerArray([
                { ui: this._btnMultiPlayer,     callback: this._onTouchedBtnMultiPlayer },
                { ui: this._btnRanking,         callback: this._onTouchedBtnRanking },
                { ui: this._btnCampaign,        callback: this._onTouchedBtnCampaign },
                { ui: this._btnCreateWarRoom,   callback: this._onTouchedBtnCreateWarRoom },
                { ui: this._btnCreateCustomWar, callback: this._onTouchedBtnCreateCustomWar },
                { ui: this._btnContinueWar,     callback: this._onTouchedBtnContinueWar },
            ]);
            this._setNotifyListenerArray([
                { type: NotifyType.MsgUserLogout,                       callback: this._onMsgUserLogout },
                { type: NotifyType.MsgMcrGetRoomPlayerInfo,             callback: this._onNotifyMsgMcrGetRoomPlayerInfo },
                { type: NotifyType.MsgMfrGetRoomPlayerInfo,             callback: this._onNotifyMsgMfrGetRoomPlayerInfo },
                { type: NotifyType.MsgCcrGetRoomPlayerInfo,             callback: this._onNotifyMsgCcrGetRoomPlayerInfo },
                { type: NotifyType.MsgMrrGetJoinedRoomIdArray,          callback: this._onMsgMrrGetMyRoomPublicInfoList },
                { type: NotifyType.MsgMpwCommonGetWarProgressInfo,      callback: this._onMsgMpwCommonGetWarProgressInfo },
                { type: NotifyType.MsgMpwWatchGetRequestedWarIdArray,   callback: this._onMsgMpwWatchGetRequestedWarIdArray },
            ]);
        }
        protected async _updateOnOpenDataChanged(): Promise<void> {
            this._updateBtnMultiPlayer();
            this._updateBtnRanking();
        }
        protected _onClosing(): void {
            // nothing to do
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Callbacks.
        ////////////////////////////////////////////////////////////////////////////////
        private _onMsgUserLogout(): void {
            this.close();
        }

        private _onTouchedBtnMultiPlayer(): void {
            this.close();
            Twns.PanelHelpers.open(Twns.PanelHelpers.PanelDict.McrMainMenuPanel, void 0);
        }
        private _onTouchedBtnRanking(): void {
            this.close();
            Twns.PanelHelpers.open(Twns.PanelHelpers.PanelDict.MrrMainMenuPanel, void 0);
        }
        private _onTouchedBtnCampaign(): void {
            FloatText.show(Lang.getText(LangTextType.A0053));
        }
        private _onTouchedBtnCreateWarRoom(): void {
            this.close();
            Twns.PanelHelpers.close(Twns.PanelHelpers.PanelDict.LobbyTopPanel);
            Twns.PanelHelpers.close(Twns.PanelHelpers.PanelDict.LobbyBottomPanel);
            Twns.PanelHelpers.open(Twns.PanelHelpers.PanelDict.SrrCreateMapListPanel, null);
        }
        private _onTouchedBtnCreateCustomWar(): void {
            this.close();
            Twns.PanelHelpers.close(Twns.PanelHelpers.PanelDict.LobbyTopPanel);
            Twns.PanelHelpers.close(Twns.PanelHelpers.PanelDict.LobbyBottomPanel);
            Twns.PanelHelpers.open(Twns.PanelHelpers.PanelDict.ScrCreateMapListPanel, null);
        }
        private _onTouchedBtnContinueWar(): void {
            this.close();
            Twns.PanelHelpers.close(Twns.PanelHelpers.PanelDict.LobbyTopPanel);
            Twns.PanelHelpers.close(Twns.PanelHelpers.PanelDict.LobbyBottomPanel);
            Twns.PanelHelpers.open(Twns.PanelHelpers.PanelDict.SpmWarListPanel, void 0);
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
        private _onMsgMrrGetMyRoomPublicInfoList(): void {
            this._updateBtnRanking();
        }
        private _onMsgMpwCommonGetWarProgressInfo(): void {
            this._updateBtnMultiPlayer();
            this._updateBtnRanking();
        }
        private _onMsgMpwWatchGetRequestedWarIdArray(): void {
            this._updateBtnMultiPlayer();
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Private functions.
        ////////////////////////////////////////////////////////////////////////////////
        private async _updateBtnMultiPlayer(): Promise<void> {
            this._btnMultiPlayer.setRedVisible(await Lobby.LobbyModel.checkIsRedForMultiPlayer());
        }

        private async _updateBtnRanking(): Promise<void> {
            this._btnRanking.setRedVisible(
                (await MultiPlayerWar.MpwModel.checkIsRedForMyMrwWars())   ||
                (await Twns.MultiRankRoom.MrrModel.checkIsRed())
            );
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
                obj         : this._btnCampaign,
                beginProps  : { alpha: 0, left: -40 },
                endProps    : { alpha: 1, left: 0 },
            });
            Twns.Helpers.resetTween({
                obj         : this._btnCreateWarRoom,
                beginProps  : { alpha: 0, left: -40 },
                waitTime    : 66,
                endProps    : { alpha: 1, left: 0 },
            });
            Twns.Helpers.resetTween({
                obj         : this._btnCreateCustomWar,
                beginProps  : { alpha: 0, left: -40 },
                waitTime    : 133,
                endProps    : { alpha: 1, left: 0 },
            });
            Twns.Helpers.resetTween({
                obj         : this._btnContinueWar,
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
    }
}

// export default TwnsSpmMainMenuPanel;
