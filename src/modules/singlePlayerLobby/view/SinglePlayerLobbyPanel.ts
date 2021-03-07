
namespace TinyWars.SinglePlayerLobby {
    import Tween        = egret.Tween;
    import Lang         = Utility.Lang;
    import FloatText    = Utility.FloatText;
    import Notify       = Utility.Notify;
    import Helpers      = Utility.Helpers;

    export class SinglePlayerLobbyPanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Scene;
        protected readonly _IS_EXCLUSIVE = true;

        private static _instance: SinglePlayerLobbyPanel;

        private readonly _groupLeft         : eui.Group;
        private readonly _btnCampaign       : TinyWars.GameUi.UiButton;
        private readonly _btnContinueWar    : TinyWars.GameUi.UiButton;

        private readonly _group             : eui.Group;
        private readonly _btnMultiPlayer    : TinyWars.GameUi.UiButton;
        private readonly _btnRanking        : TinyWars.GameUi.UiButton;
        private readonly _btnSinglePlayer   : TinyWars.GameUi.UiButton;

        private readonly _btnBack           : TinyWars.GameUi.UiButton;


        public static show(): void {
            if (!SinglePlayerLobbyPanel._instance) {
                SinglePlayerLobbyPanel._instance = new SinglePlayerLobbyPanel();
            }
            SinglePlayerLobbyPanel._instance.open(undefined);
        }

        public static async hide(): Promise<void> {
            if (SinglePlayerLobbyPanel._instance) {
                await SinglePlayerLobbyPanel._instance.close();
            }
        }

        private constructor() {
            super();

            this._setIsAutoAdjustHeight();
            this.skinName = "resource/skins/singlePlayerLobby/SinglePlayerLobbyPanel.exml";
        }

        protected _onOpened(): void {
            this._setUiListenerArray([
                { ui: this._btnMultiPlayer, callback: this._onTouchedBtnMultiPlayer },
                { ui: this._btnRanking,     callback: this._onTouchedBtnRanking },
                { ui: this._btnCampaign,    callback: this._onTouchedBtnCampaign },
                { ui: this._btnContinueWar, callback: this._onTouchedBtnContinueWar },
                { ui: this._btnBack,        callback: this._onTouchedBtnBack },
            ]);
            this._setNotifyListenerArray([
                { type: Notify.Type.LanguageChanged,    callback: this._onNotifyLanguageChanged },
                { type: Notify.Type.MsgUserLogout,      callback: this._onMsgUserLogout },
            ]);

            this._showOpenAnimation();

            this._updateComponentsForLanguage();
        }

        protected async _onClosed(): Promise<void> {
            await this._showCloseAnimation();
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Callbacks.
        ////////////////////////////////////////////////////////////////////////////////
        private _onMsgUserLogout(e: egret.Event): void {
            this.close();
        }

        private _onNotifyLanguageChanged(e: egret.Event): void {
            this._updateComponentsForLanguage();
        }

        private _onTouchedBtnMultiPlayer(e: egret.TouchEvent): void {
            this.close();
            MultiCustomRoom.McrMainMenuPanel.show();
        }
        private _onTouchedBtnRanking(e: egret.TouchEvent): void {
            this.close();
            MultiRankRoom.MrrMainMenuPanel.show();
        }
        private _onTouchedBtnCampaign(e: egret.TouchEvent): void {
            FloatText.show(Lang.getText(Lang.Type.A0053));
        }
        private _onTouchedBtnContinueWar(e: egret.TouchEvent): void {
            this.close();
            SingleCustomRoom.ScrContinueWarListPanel.show();
        }
        private _onTouchedBtnBack(e: egret.TouchEvent): void {
            this.close();
            Lobby.LobbyPanel.show();
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Private functions.
        ////////////////////////////////////////////////////////////////////////////////
        private _updateComponentsForLanguage(): void {
            this._btnBack.label = Lang.getText(Lang.Type.B0146);
        }

        private _showOpenAnimation(): void {
            Helpers.resetTween({
                obj         : this._btnBack,
                beginProps  : { alpha: 0, bottom: -20 },
                waitTime    : 0,
                endProps    : { alpha: 1, bottom: 20 },
                tweenTime   : 200,
            });

            const group = this._group;
            Tween.removeTweens(group);
            group.right = 60;
            group.alpha = 1;

            Helpers.resetTween({
                obj         : this._btnMultiPlayer,
                beginProps  : { alpha: 0, right: -40 },
                waitTime    : 0,
                endProps    : { alpha: 1, right: 0 },
                tweenTime   : 200,
            });
            Helpers.resetTween({
                obj         : this._btnRanking,
                beginProps  : { alpha: 0, right: -40 },
                waitTime    : 100,
                endProps    : { alpha: 1, right: 0 },
                tweenTime   : 200,
            });
            Helpers.resetTween({
                obj         : this._btnSinglePlayer,
                beginProps  : { alpha: 0, right: -40 },
                waitTime    : 200,
                endProps    : { alpha: 1, right: 0 },
                tweenTime   : 200,
            });

            const groupLeft = this._groupLeft;
            Tween.removeTweens(groupLeft);
            groupLeft.left  = 0;
            groupLeft.alpha = 1;

            Helpers.resetTween({
                obj         : this._btnCampaign,
                beginProps  : { alpha: 0, left: -40 },
                waitTime    : 0,
                endProps    : { alpha: 1, left: 0 },
                tweenTime   : 200,
            });
            Helpers.resetTween({
                obj         : this._btnContinueWar,
                beginProps  : { alpha: 0, left: -40 },
                waitTime    : 100,
                endProps    : { alpha: 1, left: 0 },
                tweenTime   : 200,
            });
        }
        private _showCloseAnimation(): Promise<void> {
            return new Promise<void>((resolve, reject) => {
                Helpers.resetTween({
                    obj         : this._btnBack,
                    beginProps  : { alpha: 1, bottom: 20 },
                    waitTime    : 0,
                    endProps    : { alpha: 0, bottom: -20 },
                    tweenTime   : 200,
                });

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
