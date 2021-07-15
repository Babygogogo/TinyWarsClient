
import TwnsUiPanel                      from "../../tools/ui/UiPanel";
import TwnsUiButton                      from "../../tools/ui/UiButton";
import TwnsLobbyBottomPanel         from "../../lobby/view/LobbyBottomPanel";
import TwnsLobbyTopPanel            from "../../lobby/view/LobbyTopPanel";
import TwnsMcwMyWarListPanel        from "../../multiCustomWar/view/McwMyWarListPanel";
import MfrMainMenuPanel= TwnsMfrMainMenuPanel.MfrMainMenuPanel;import TwnsMfrMainMenuPanel             from "../../multiFreeRoom/view/MfrMainMenuPanel";
import MrrMainMenuPanel= TwnsMrrMainMenuPanel.MrrMainMenuPanel;import TwnsMrrMainMenuPanel             from "../../multiRankRoom/view/MrrMainMenuPanel";
import { RwReplayListPanel }            from "../../replayWar/view/RwReplayListPanel";
import SpmMainMenuPanel= TwnsSpmMainMenuPanel.SpmMainMenuPanel;import TwnsSpmMainMenuPanel             from "../../singlePlayerMode/view/SpmMainMenuPanel";
import { McrWatchMainMenuPanel }        from "./McrWatchMainMenuPanel";
import { McrCreateMapListPanel }        from "./McrCreateMapListPanel";
import { McrJoinRoomListPanel }         from "./McrJoinRoomListPanel";
import { McrMyRoomListPanel }           from "./McrMyRoomListPanel";
import CcrMainMenuPanel = TwnsCcrMainMenuPanel.CcrMainMenuPanel;import TwnsCcrMainMenuPanel             from "../../coopCustomRoom/view/CcrMainMenuPanel";
import TwnsNotifyType               from "../../tools/notify/NotifyType";
import Types                        from "../../tools/helpers/Types";
import Helpers                      from "../../tools/helpers/Helpers";
import CcrModel                     from "../../coopCustomRoom/model/CcrModel";
import McrModel                     from "../../multiCustomRoom/model/McrModel";
import MfrModel                     from "../../multiFreeRoom/model/MfrModel";
import MpwModel                     from "../../multiPlayerWar/model/MpwModel";
import NotifyType                       = TwnsNotifyType.NotifyType;
import Tween                            = egret.Tween;

namespace TwnsMcrMainMenuPanel {

    export class McrMainMenuPanel extends TwnsUiPanel.UiPanel<void> {
        protected readonly _LAYER_TYPE   = Types.LayerType.Scene;
        protected readonly _IS_EXCLUSIVE = true;

        private static _instance: McrMainMenuPanel;

        // @ts-ignore
        private readonly _group             : eui.Group;
        // @ts-ignore
        private readonly _btnMultiPlayer    : TwnsUiButton.UiButton;
        // @ts-ignore
        private readonly _btnRanking        : TwnsUiButton.UiButton;
        // @ts-ignore
        private readonly _btnSinglePlayer   : TwnsUiButton.UiButton;

        // @ts-ignore
        private readonly _groupLeft         : eui.Group;
        // @ts-ignore
        private readonly _btnCreateRoom     : TwnsUiButton.UiButton;
        // @ts-ignore
        private readonly _btnJoinRoom       : TwnsUiButton.UiButton;
        // @ts-ignore
        private readonly _btnMyRoom         : TwnsUiButton.UiButton;
        // @ts-ignore
        private readonly _btnContinueWar    : TwnsUiButton.UiButton;
        // @ts-ignore
        private readonly _btnWatchWar       : TwnsUiButton.UiButton;
        // @ts-ignore
        private readonly _btnReplayWar      : TwnsUiButton.UiButton;
        // @ts-ignore
        private readonly _btnCoopMode       : TwnsUiButton.UiButton;
        // @ts-ignore
        private readonly _btnFreeMode       : TwnsUiButton.UiButton;

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
            MrrMainMenuPanel.show();
        }
        private _onTouchedBtnSinglePlayer(): void {
            this.close();
            SpmMainMenuPanel.show();
        }
        private _onTouchedBtnCreateRoom(): void {
            this.close();
            TwnsLobbyTopPanel.LobbyTopPanel.hide();
            TwnsLobbyBottomPanel.LobbyBottomPanel.hide();
            McrCreateMapListPanel.show({});
        }
        private _onTouchedBtnJoinRoom(): void {
            this.close();
            TwnsLobbyTopPanel.LobbyTopPanel.hide();
            TwnsLobbyBottomPanel.LobbyBottomPanel.hide();
            McrJoinRoomListPanel.show();
        }
        private _onTouchedBtnMyRoom(): void {
            this.close();
            TwnsLobbyTopPanel.LobbyTopPanel.hide();
            TwnsLobbyBottomPanel.LobbyBottomPanel.hide();
            McrMyRoomListPanel.show();
        }
        private _onTouchedBtnContinueWar(): void {
            this.close();
            TwnsLobbyTopPanel.LobbyTopPanel.hide();
            TwnsLobbyBottomPanel.LobbyBottomPanel.hide();
            TwnsMcwMyWarListPanel.McwMyWarListPanel.show();
        }
        private _onTouchedBtnWatchWar(): void {
            this.close();
            TwnsLobbyTopPanel.LobbyTopPanel.hide();
            TwnsLobbyBottomPanel.LobbyBottomPanel.hide();
            McrWatchMainMenuPanel.show();
        }
        private _onTouchedBtnReplayWar(): void {
            this.close();
            TwnsLobbyTopPanel.LobbyTopPanel.hide();
            TwnsLobbyBottomPanel.LobbyBottomPanel.hide();
            RwReplayListPanel.show();
        }
        private _onTouchedBtnCoopMode(): void {
            this.close();
            CcrMainMenuPanel.show();
        }
        private _onTouchedBtnFreeMode(): void {
            this.close();
            MfrMainMenuPanel.show();
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
            const watchInfos = MpwModel.getWatchRequestedWarInfos();
            this._btnMyRoom.setRedVisible(await McrModel.checkIsRed());
            this._btnContinueWar.setRedVisible(MpwModel.checkIsRedForMyMcwWars());
            this._btnWatchWar.setRedVisible((!!watchInfos) && (watchInfos.length > 0));
            this._btnCoopMode.setRedVisible(MpwModel.checkIsRedForMyCcwWars() || await CcrModel.checkIsRed());
            this._btnFreeMode.setRedVisible(MpwModel.checkIsRedForMyMfwWars() || await MfrModel.checkIsRed());
        }
    }
}

export default TwnsMcrMainMenuPanel;
