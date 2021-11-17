
// import TwnsLobbyBottomPanel         from "../../lobby/view/LobbyBottomPanel";
// import TwnsLobbyTopPanel            from "../../lobby/view/LobbyTopPanel";
// import TwnsMcrMainMenuPanel         from "../../multiCustomRoom/view/McrMainMenuPanel";
// import TwnsMrrMainMenuPanel         from "../../multiRankRoom/view/MrrMainMenuPanel";
// import TwnsSpmMainMenuPanel         from "../../singlePlayerMode/view/SpmMainMenuPanel";
// import Helpers                      from "../../tools/helpers/Helpers";
// import Types                        from "../../tools/helpers/Types";
// import TwnsNotifyType               from "../../tools/notify/NotifyType";
// import TwnsUiButton                 from "../../tools/ui/UiButton";
// import TwnsUiPanel                  from "../../tools/ui/UiPanel";
// import WwModel                      from "../model/WwModel";
// import TwnsWwDeleteWatcherWarsPanel from "./WwDeleteWatcherWarsPanel";
// import TwnsWwHandleRequestWarsPanel from "./WwHandleRequestWarsPanel";
// import TwnsWwMakeRequestWarsPanel   from "./WwMakeRequestWarsPanel";
// import TwnsWwOngoingWarsPanel       from "./WwOngoingWarsPanel";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace TwnsWwMainMenuPanel {
    import NotifyType                       = TwnsNotifyType.NotifyType;
    import Tween                            = egret.Tween;

    export type OpenData = void;
    export class WwMainMenuPanel extends TwnsUiPanel2.UiPanel2<OpenData> {
        private readonly _group!            : eui.Group;
        private readonly _btnMultiPlayer!   : TwnsUiButton.UiButton;
        private readonly _btnRanking!       : TwnsUiButton.UiButton;
        private readonly _btnSinglePlayer!  : TwnsUiButton.UiButton;

        private readonly _groupLeft!        : eui.Group;
        private readonly _btnMakeRequest!   : TwnsUiButton.UiButton;
        private readonly _btnHandleRequest! : TwnsUiButton.UiButton;
        private readonly _btnDeleteWatcher! : TwnsUiButton.UiButton;
        private readonly _btnContinueWar!   : TwnsUiButton.UiButton;
        private readonly _btnBack!          : TwnsUiButton.UiButton;

        protected _onOpening(): void {
            this._setUiListenerArray([
                { ui: this._btnRanking,         callback: this._onTouchedBtnRanking },
                { ui: this._btnSinglePlayer,    callback: this._onTouchedBtnSinglePlayer },
                { ui: this._btnMakeRequest,     callback: this._onTouchedBtnMakeRequest },
                { ui: this._btnHandleRequest,   callback: this._onTouchedBtnHandleRequest },
                { ui: this._btnDeleteWatcher,   callback: this._onTouchedBtnDeleteWatcher },
                { ui: this._btnContinueWar,     callback: this._onTouchedBtnContinueWar },
                { ui: this._btnBack,            callback: this._onTouchedBtnBack },
            ]);
            this._setNotifyListenerArray([
                { type: NotifyType.MsgUserLogout,      callback: this._onMsgUserLogout },
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

        private _onTouchedBtnMakeRequest(): void {
            this.close();
            TwnsPanelManager.close(TwnsPanelConfig.Dict.LobbyTopPanel);
            TwnsPanelManager.close(TwnsPanelConfig.Dict.LobbyBottomPanel);
            TwnsPanelManager.open(TwnsPanelConfig.Dict.WwMakeRequestWarsPanel, {});
        }

        private _onTouchedBtnHandleRequest(): void {
            this.close();
            TwnsPanelManager.close(TwnsPanelConfig.Dict.LobbyTopPanel);
            TwnsPanelManager.close(TwnsPanelConfig.Dict.LobbyBottomPanel);
            TwnsPanelManager.open(TwnsPanelConfig.Dict.WwHandleRequestWarsPanel, void 0);
        }

        private _onTouchedBtnDeleteWatcher(): void {
            this.close();
            TwnsPanelManager.close(TwnsPanelConfig.Dict.LobbyTopPanel);
            TwnsPanelManager.close(TwnsPanelConfig.Dict.LobbyBottomPanel);
            TwnsPanelManager.open(TwnsPanelConfig.Dict.WwDeleteWatcherWarsPanel, void 0);
        }

        private _onTouchedBtnContinueWar(): void {
            this.close();
            TwnsPanelManager.close(TwnsPanelConfig.Dict.LobbyTopPanel);
            TwnsPanelManager.close(TwnsPanelConfig.Dict.LobbyBottomPanel);
            TwnsPanelManager.open(TwnsPanelConfig.Dict.WwOngoingWarsPanel, void 0);
        }

        private _onTouchedBtnBack(): void {
            this.close();
            TwnsMcrMainMenuPanel.McrMainMenuPanel.show();
        }

        private _onMsgUserLogout(): void {
            this.close();
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Private functions.
        ////////////////////////////////////////////////////////////////////////////////
        private _updateView(): void {
            this._btnHandleRequest.setRedVisible(!!WwModel.getWatchRequestedWarInfos()?.length);
        }

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
                obj         : this._btnMakeRequest,
                beginProps  : { alpha: 0, left: -40 },
                endProps    : { alpha: 1, left: 0 },
            });
            Helpers.resetTween({
                obj         : this._btnHandleRequest,
                beginProps  : { alpha: 0, left: -40 },
                waitTime    : 200 / 4 * 1,
                endProps    : { alpha: 1, left: 0 },
            });
            Helpers.resetTween({
                obj         : this._btnDeleteWatcher,
                beginProps  : { alpha: 0, left: -40 },
                waitTime    : 200 / 4 * 2,
                endProps    : { alpha: 1, left: 0 },
            });
            Helpers.resetTween({
                obj         : this._btnContinueWar,
                beginProps  : { alpha: 0, left: -40 },
                waitTime    : 200 / 4 * 3,
                endProps    : { alpha: 1, left: 0 },
            });
            Helpers.resetTween({
                obj         : this._btnBack,
                beginProps  : { alpha: 0, left: -40 },
                waitTime    : 200 / 4 * 4,
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
    }
}

// export default TwnsWwMainMenuPanel;
