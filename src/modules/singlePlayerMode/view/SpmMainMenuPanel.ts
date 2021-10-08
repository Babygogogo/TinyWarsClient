
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
// import TwnsNotifyType               from "../../tools/notify/NotifyType";
// import TwnsUiButton                 from "../../tools/ui/UiButton";
// import TwnsUiPanel                  from "../../tools/ui/UiPanel";
// import TwnsSpmWarListPanel          from "./SpmWarListPanel";

namespace TwnsSpmMainMenuPanel {
    import SpmWarListPanel          = TwnsSpmWarListPanel.SpmWarListPanel;
    import ScrCreateMapListPanel    = TwnsScrCreateMapListPanel.ScrCreateMapListPanel;
    import LangTextType             = TwnsLangTextType.LangTextType;
    import NotifyType               = TwnsNotifyType.NotifyType;
    import Tween                    = egret.Tween;

    export class SpmMainMenuPanel extends TwnsUiPanel.UiPanel<void> {
        protected readonly _LAYER_TYPE   = Types.LayerType.Scene;
        protected readonly _IS_EXCLUSIVE = true;

        private static _instance: SpmMainMenuPanel;

        private readonly _groupLeft!            : eui.Group;
        private readonly _btnCampaign!          : TwnsUiButton.UiButton;
        private readonly _btnCreateCustomWar!   : TwnsUiButton.UiButton;
        private readonly _btnContinueWar!       : TwnsUiButton.UiButton;

        private readonly _group!                : eui.Group;
        private readonly _btnMultiPlayer!       : TwnsUiButton.UiButton;
        private readonly _btnRanking!           : TwnsUiButton.UiButton;
        private readonly _btnSinglePlayer!      : TwnsUiButton.UiButton;

        public static show(): void {
            if (!SpmMainMenuPanel._instance) {
                SpmMainMenuPanel._instance = new SpmMainMenuPanel();
            }
            SpmMainMenuPanel._instance.open();
        }

        public static async hide(): Promise<void> {
            if (SpmMainMenuPanel._instance) {
                await SpmMainMenuPanel._instance.close();
            }
        }

        private constructor() {
            super();

            this.skinName = "resource/skins/singlePlayerMode/SpmMainMenuPanel.exml";
        }

        protected _onOpened(): void {
            this._setUiListenerArray([
                { ui: this._btnMultiPlayer,     callback: this._onTouchedBtnMultiPlayer },
                { ui: this._btnRanking,         callback: this._onTouchedBtnRanking },
                { ui: this._btnCampaign,        callback: this._onTouchedBtnCampaign },
                { ui: this._btnCreateCustomWar, callback: this._onTouchedBtnCreateCustomWar },
                { ui: this._btnContinueWar,     callback: this._onTouchedBtnContinueWar },
            ]);
            this._setNotifyListenerArray([
                { type: NotifyType.MsgUserLogout,      callback: this._onMsgUserLogout },
            ]);

            this._showOpenAnimation();
        }

        protected async _onClosed(): Promise<void> {
            await this._showCloseAnimation();
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Callbacks.
        ////////////////////////////////////////////////////////////////////////////////
        private _onMsgUserLogout(): void {
            this.close();
        }

        private _onTouchedBtnMultiPlayer(): void {
            this.close();
            TwnsMcrMainMenuPanel.McrMainMenuPanel.show();
        }
        private _onTouchedBtnRanking(): void {
            this.close();
            TwnsMrrMainMenuPanel.MrrMainMenuPanel.show();
        }
        private _onTouchedBtnCampaign(): void {
            FloatText.show(Lang.getText(LangTextType.A0053));
        }
        private _onTouchedBtnCreateCustomWar(): void {
            this.close();
            TwnsLobbyTopPanel.LobbyTopPanel.hide();
            TwnsLobbyBottomPanel.LobbyBottomPanel.hide();
            ScrCreateMapListPanel.show(null);
        }
        private _onTouchedBtnContinueWar(): void {
            this.close();
            TwnsLobbyTopPanel.LobbyTopPanel.hide();
            TwnsLobbyBottomPanel.LobbyBottomPanel.hide();
            SpmWarListPanel.show();
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
                obj         : this._btnCampaign,
                beginProps  : { alpha: 0, left: -40 },
                endProps    : { alpha: 1, left: 0 },
            });
            Helpers.resetTween({
                obj         : this._btnCreateCustomWar,
                beginProps  : { alpha: 0, left: -40 },
                waitTime    : 100,
                endProps    : { alpha: 1, left: 0 },
            });
            Helpers.resetTween({
                obj         : this._btnContinueWar,
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
                    .to({ alpha: 0, right: 20 }, 200);

                const groupLeft = this._groupLeft;
                Tween.removeTweens(groupLeft);
                Tween.get(groupLeft)
                    .set({ alpha: 1, left: 0 })
                    .to({ alpha: 0, left: -40 }, 200)
                    .call(resolve);
            });
        }
    }
}

// export default TwnsSpmMainMenuPanel;
