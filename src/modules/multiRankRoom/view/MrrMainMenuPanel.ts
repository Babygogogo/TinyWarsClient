
import TwnsLobbyBottomPanel                 from "../../lobby/view/LobbyBottomPanel";
import TwnsLobbyTopPanel                    from "../../lobby/view/LobbyTopPanel";
import TwnsMcrMainMenuPanel                 from "../../multiCustomRoom/view/McrMainMenuPanel";
import MpwModel                             from "../../multiPlayerWar/model/MpwModel";
import TwnsMrwMyWarListPanel                from "../../multiRankWar/view/MrwMyWarListPanel";
import TwnsSpmMainMenuPanel                 from "../../singlePlayerMode/view/SpmMainMenuPanel";
import Helpers                              from "../../tools/helpers/Helpers";
import Types                                from "../../tools/helpers/Types";
import TwnsNotifyType                       from "../../tools/notify/NotifyType";
import TwnsUiButton                         from "../../tools/ui/UiButton";
import TwnsUiPanel                          from "../../tools/ui/UiPanel";
import MrrModel                             from "../model/MrrModel";
import TwnsMrrMyRoomListPanel               from "./MrrMyRoomListPanel";
import TwnsMrrPreviewMapListPanel           from "./MrrPreviewMapListPanel";
import TwnsMrrSetMaxConcurrentCountPanel    from "./MrrSetMaxConcurrentCountPanel";

namespace TwnsMrrMainMenuPanel {
    import SpmMainMenuPanel                 = TwnsSpmMainMenuPanel.SpmMainMenuPanel;
    import MrrMyRoomListPanel               = TwnsMrrMyRoomListPanel.MrrMyRoomListPanel;
    import MrrSetMaxConcurrentCountPanel    = TwnsMrrSetMaxConcurrentCountPanel.MrrSetMaxConcurrentCountPanel;
    import MrrPreviewMapListPanel           = TwnsMrrPreviewMapListPanel.MrrPreviewMapListPanel;
    import NotifyType                       = TwnsNotifyType.NotifyType;
    import Tween                            = egret.Tween;

    export class MrrMainMenuPanel extends TwnsUiPanel.UiPanel<void> {
        protected readonly _LAYER_TYPE   = Types.LayerType.Scene;
        protected readonly _IS_EXCLUSIVE = true;

        private static _instance: MrrMainMenuPanel;

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

        public static show(): void {
            if (!MrrMainMenuPanel._instance) {
                MrrMainMenuPanel._instance = new MrrMainMenuPanel();
            }
            MrrMainMenuPanel._instance.open();
        }

        public static async hide(): Promise<void> {
            if (MrrMainMenuPanel._instance) {
                await MrrMainMenuPanel._instance.close();
            }
        }

        private constructor() {
            super();

            this.skinName = "resource/skins/multiRankRoom/MrrMainMenuPanel.exml";
        }

        protected _onOpened(): void {
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
                { type: NotifyType.MsgUserLogout,                  callback: this._onMsgUserLogout },
                { type: NotifyType.MsgMrrGetRoomPublicInfo,        callback: this._onMsgMrrGetRoomPublicInfo },
                { type: NotifyType.MsgMrrGetMyRoomPublicInfoList,  callback: this._onMsgMrrGetMyRoomPublicInfoList },
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
        private _onTouchedBtnMultiPlayer(): void {
            this.close();
            TwnsMcrMainMenuPanel.McrMainMenuPanel.show();
        }
        private _onTouchedBtnSinglePlayer(): void {
            this.close();
            SpmMainMenuPanel.show();
        }
        private _onTouchedBtnSetGameNumber(): void {
            MrrSetMaxConcurrentCountPanel.show();
        }
        private _onTouchedBtnMyRoom(): void {
            this.close();
            TwnsLobbyTopPanel.LobbyTopPanel.hide();
            TwnsLobbyBottomPanel.LobbyBottomPanel.hide();
            MrrMyRoomListPanel.show();
        }
        private _onTouchedBtnContinueWar(): void {
            this.close();
            TwnsLobbyTopPanel.LobbyTopPanel.hide();
            TwnsLobbyBottomPanel.LobbyBottomPanel.hide();
            TwnsMrwMyWarListPanel.MrwMyWarListPanel.show();
        }
        private _onTouchedBtnPreviewStdMaps(): void {
            this.close();
            TwnsLobbyTopPanel.LobbyTopPanel.hide();
            TwnsLobbyBottomPanel.LobbyBottomPanel.hide();
            MrrPreviewMapListPanel.show({ hasFog: false });
        }
        private _onTouchedBtnPreviewFogMaps(): void {
            this.close();
            TwnsLobbyTopPanel.LobbyTopPanel.hide();
            TwnsLobbyBottomPanel.LobbyBottomPanel.hide();
            MrrPreviewMapListPanel.show({ hasFog: true });
        }

        private _onMsgUserLogout(): void {
            this.close();
        }
        private _onMsgMrrGetRoomPublicInfo(): void {
            this._updateComponentsForRed();
        }
        private _onMsgMrrGetMyRoomPublicInfoList(): void {
            this._updateComponentsForRed();
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Private functions.
        ////////////////////////////////////////////////////////////////////////////////
        private _updateView(): void {
            this._updateComponentsForRed();
        }

        private async _updateComponentsForRed(): Promise<void> {
            this._btnMyRoom.setRedVisible(await MrrModel.checkIsRed());
            this._btnContinueWar.setRedVisible(MpwModel.checkIsRedForMyMrwWars());
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
                obj         : this._btnSetGameNumber,
                beginProps  : { alpha: 0, left: -40 },
                endProps    : { alpha: 1, left: 0 },
            });
            Helpers.resetTween({
                obj         : this._btnMyRoom,
                beginProps  : { alpha: 0, left: -40 },
                waitTime    : 50,
                endProps    : { alpha: 1, left: 0 },
            });
            Helpers.resetTween({
                obj         : this._btnContinueWar,
                beginProps  : { alpha: 0, left: -40 },
                waitTime    : 100,
                endProps    : { alpha: 1, left: 0 },
            });
            Helpers.resetTween({
                obj         : this._btnPreviewStdMaps,
                beginProps  : { alpha: 0, left: -40 },
                waitTime    : 150,
                endProps    : { alpha: 1, left: 0 },
            });
            Helpers.resetTween({
                obj         : this._btnPreviewFogMaps,
                beginProps  : { alpha: 0, left: -40 },
                waitTime    : 200,
                endProps    : { alpha: 1, left: 0 },
            });
        }
        private _showCloseAnimation(): Promise<void> {
            return new Promise<void>((resolve) => {
                const group = this._group;
                Tween.removeTweens(group);
                Tween.get(group)
                    .set({ alpha: 1, right: 60 })
                    .to({ alpha: 0, right: 20 }, 200)
                    .call(resolve);

                const groupLeft = this._groupLeft;
                Tween.removeTweens(groupLeft);
                Tween.get(groupLeft)
                    .set({ alpha: 1, left: 0 })
                    .to({ alpha: 0, left: -40 }, 200);
            });
        }
    }
}

export default TwnsMrrMainMenuPanel;
