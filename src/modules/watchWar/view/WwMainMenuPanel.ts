
import TwnsLobbyBottomPanel         from "../../lobby/view/LobbyBottomPanel";
import TwnsLobbyTopPanel            from "../../lobby/view/LobbyTopPanel";
import TwnsMcrMainMenuPanel         from "../../multiCustomRoom/view/McrMainMenuPanel";
import TwnsMrrMainMenuPanel         from "../../multiRankRoom/view/MrrMainMenuPanel";
import TwnsSpmMainMenuPanel         from "../../singlePlayerMode/view/SpmMainMenuPanel";
import CompatibilityHelpers         from "../../tools/helpers/CompatibilityHelpers";
import Helpers                      from "../../tools/helpers/Helpers";
import Types                        from "../../tools/helpers/Types";
import TwnsNotifyType               from "../../tools/notify/NotifyType";
import TwnsUiButton                 from "../../tools/ui/UiButton";
import TwnsUiPanel                  from "../../tools/ui/UiPanel";
import WwModel                      from "../model/WwModel";
import TwnsWwDeleteWatcherWarsPanel from "./WwDeleteWatcherWarsPanel";
import TwnsWwHandleRequestWarsPanel from "./WwHandleRequestWarsPanel";
import TwnsWwMakeRequestWarsPanel   from "./WwMakeRequestWarsPanel";
import TwnsWwOngoingWarsPanel       from "./WwOngoingWarsPanel";

namespace TwnsWwMainMenuPanel {
    import NotifyType                       = TwnsNotifyType.NotifyType;
    import McrWatchOngoingWarsPanel         = TwnsWwOngoingWarsPanel.McrWatchOngoingWarsPanel;
    import McrWatchMakeRequestWarsPanel     = TwnsWwMakeRequestWarsPanel.WwMakeRequestWarsPanel;
    import McrWatchDeleteWatcherWarsPanel   = TwnsWwDeleteWatcherWarsPanel.WwDeleteWatcherWarsPanel;
    import McrWatchHandleRequestWarsPanel   = TwnsWwHandleRequestWarsPanel.WwHandleRequestWarsPanel;
    import Tween                            = egret.Tween;

    export class WwMainMenuPanel extends TwnsUiPanel.UiPanel<void> {
        protected readonly _LAYER_TYPE   = Types.LayerType.Scene;
        protected readonly _IS_EXCLUSIVE = true;

        private static _instance: WwMainMenuPanel;

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

        public static show(): void {
            if (!WwMainMenuPanel._instance) {
                WwMainMenuPanel._instance = new WwMainMenuPanel();
            }
            WwMainMenuPanel._instance.open();
        }

        public static async hide(): Promise<void> {
            if (WwMainMenuPanel._instance) {
                await WwMainMenuPanel._instance.close().catch(err => { CompatibilityHelpers.showError(err); throw err; });
            }
        }

        private constructor() {
            super();

            this.skinName = "resource/skins/watchWar/WwMainMenuPanel.exml";
        }

        protected _onOpened(): void {
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

            this._showOpenAnimation();

            this._updateView();
        }

        protected async _onClosed(): Promise<void> {
            await this._showCloseAnimation().catch(err => { CompatibilityHelpers.showError(err); throw err; });
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Callbacks.
        ////////////////////////////////////////////////////////////////////////////////
        private _onTouchedBtnRanking(): void {
            this.close();
            TwnsMrrMainMenuPanel.MrrMainMenuPanel.show();
        }

        private _onTouchedBtnSinglePlayer(): void {
            this.close();
            TwnsSpmMainMenuPanel.SpmMainMenuPanel.show();
        }

        private _onTouchedBtnMakeRequest(): void {
            this.close();
            TwnsLobbyTopPanel.LobbyTopPanel.hide();
            TwnsLobbyBottomPanel.LobbyBottomPanel.hide();
            McrWatchMakeRequestWarsPanel.show();
        }

        private _onTouchedBtnHandleRequest(): void {
            this.close();
            TwnsLobbyTopPanel.LobbyTopPanel.hide();
            TwnsLobbyBottomPanel.LobbyBottomPanel.hide();
            McrWatchHandleRequestWarsPanel.show();
        }

        private _onTouchedBtnDeleteWatcher(): void {
            this.close();
            TwnsLobbyTopPanel.LobbyTopPanel.hide();
            TwnsLobbyBottomPanel.LobbyBottomPanel.hide();
            McrWatchDeleteWatcherWarsPanel.show();
        }

        private _onTouchedBtnContinueWar(): void {
            this.close();
            TwnsLobbyTopPanel.LobbyTopPanel.hide();
            TwnsLobbyBottomPanel.LobbyBottomPanel.hide();
            McrWatchOngoingWarsPanel.show();
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
    }
}

export default TwnsWwMainMenuPanel;
