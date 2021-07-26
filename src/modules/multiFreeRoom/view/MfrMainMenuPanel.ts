
import TwnsCommonAlertPanel     from "../../common/view/CommonAlertPanel";
import CcrModel                 from "../../coopCustomRoom/model/CcrModel";
import TwnsCcrMainMenuPanel     from "../../coopCustomRoom/view/CcrMainMenuPanel";
import TwnsLobbyBottomPanel     from "../../lobby/view/LobbyBottomPanel";
import TwnsLobbyTopPanel        from "../../lobby/view/LobbyTopPanel";
import McrModel                 from "../../multiCustomRoom/model/McrModel";
import TwnsMcrMainMenuPanel     from "../../multiCustomRoom/view/McrMainMenuPanel";
import MfrModel                 from "../../multiFreeRoom/model/MfrModel";
import TwnsMfwMyWarListPanel    from "../../multiFreeWar/view/MfwMyWarListPanel";
import MpwModel                 from "../../multiPlayerWar/model/MpwModel";
import TwnsMrrMainMenuPanel     from "../../multiRankRoom/view/MrrMainMenuPanel";
import TwnsSpmMainMenuPanel     from "../../singlePlayerMode/view/SpmMainMenuPanel";
import FloatText                from "../../tools/helpers/FloatText";
import Helpers                  from "../../tools/helpers/Helpers";
import Types                    from "../../tools/helpers/Types";
import Lang                     from "../../tools/lang/Lang";
import TwnsLangTextType         from "../../tools/lang/LangTextType";
import TwnsNotifyType           from "../../tools/notify/NotifyType";
import TwnsUiButton             from "../../tools/ui/UiButton";
import TwnsUiPanel              from "../../tools/ui/UiPanel";
import TwnsMfrJoinRoomListPanel from "./MfrJoinRoomListPanel";
import TwnsMfrMyRoomListPanel   from "./MfrMyRoomListPanel";

namespace TwnsMfrMainMenuPanel {
    import MfrJoinRoomListPanel = TwnsMfrJoinRoomListPanel.MfrJoinRoomListPanel;
    import MfrMyRoomListPanel   = TwnsMfrMyRoomListPanel.MfrMyRoomListPanel;
    import NotifyType           = TwnsNotifyType.NotifyType;
    import Tween                = egret.Tween;
    import LangTextType         = TwnsLangTextType.LangTextType;

    export class MfrMainMenuPanel extends TwnsUiPanel.UiPanel<void> {
        protected readonly _LAYER_TYPE   = Types.LayerType.Scene;
        protected readonly _IS_EXCLUSIVE = true;

        private static _instance: MfrMainMenuPanel;

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
        private readonly _btnHelp           : TwnsUiButton.UiButton;
        // @ts-ignore
        private readonly _btnNormalMode     : TwnsUiButton.UiButton;
        // @ts-ignore
        private readonly _btnCoopMode       : TwnsUiButton.UiButton;

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
            TwnsMrrMainMenuPanel.MrrMainMenuPanel.show();
        }
        private _onTouchedBtnSinglePlayer(): void {
            this.close();
            TwnsSpmMainMenuPanel.SpmMainMenuPanel.show();
        }
        private _onTouchedBtnCreateRoom(): void {
            FloatText.show(Lang.getText(LangTextType.A0053));
            FloatText.show(Lang.getText(LangTextType.A0198));
            // this.close();
            // Lobby.LobbyTopPanel.hide();
            // Lobby.LobbyBottomPanel.hide();
            // MfrCreateMapListPanel.show({});
        }
        private _onTouchedBtnJoinRoom(): void {
            this.close();
            TwnsLobbyTopPanel.LobbyTopPanel.hide();
            TwnsLobbyBottomPanel.LobbyBottomPanel.hide();
            MfrJoinRoomListPanel.show();
        }
        private _onTouchedBtnMyRoom(): void {
            this.close();
            TwnsLobbyTopPanel.LobbyTopPanel.hide();
            TwnsLobbyBottomPanel.LobbyBottomPanel.hide();
            MfrMyRoomListPanel.show();
        }
        private _onTouchedBtnContinueWar(): void {
            this.close();
            TwnsLobbyTopPanel.LobbyTopPanel.hide();
            TwnsLobbyBottomPanel.LobbyBottomPanel.hide();
            TwnsMfwMyWarListPanel.MfwMyWarListPanel.show();
        }
        private _onTouchedBtnHelp(): void {
            TwnsCommonAlertPanel.CommonAlertPanel.show({
                title   : Lang.getText(LangTextType.B0143),
                content : Lang.getText(LangTextType.R0007),
            });
        }
        private _onTouchedBtnNormalMode(): void {
            this.close();
            TwnsMcrMainMenuPanel.McrMainMenuPanel.show();
        }
        private _onTouchedBtnCoopMode(): void {
            this.close();
            TwnsCcrMainMenuPanel.CcrMainMenuPanel.show();
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
            this._btnNormalMode.setRedVisible((MpwModel.checkIsRedForMyMcwWars()) || (await McrModel.checkIsRed()));
            this._btnCoopMode.setRedVisible((MpwModel.checkIsRedForMyCcwWars()) || (await CcrModel.checkIsRed()));
        }
    }
}

export default TwnsMfrMainMenuPanel;
