
namespace TinyWars.SinglePlayerMode {
    import Tween        = egret.Tween;
    import Lang         = Utility.Lang;
    import FloatText    = Utility.FloatText;
    import Notify       = Utility.Notify;
    import Helpers      = Utility.Helpers;

    export class SpmMainMenuPanel extends GameUi.UiPanel<void> {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Scene;
        protected readonly _IS_EXCLUSIVE = true;

        private static _instance: SpmMainMenuPanel;

        private readonly _groupLeft         : eui.Group;
        private readonly _btnCampaign       : TinyWars.GameUi.UiButton;
        private readonly _btnCreateCustomWar: TinyWars.GameUi.UiButton;
        private readonly _btnContinueWar    : TinyWars.GameUi.UiButton;

        private readonly _group             : eui.Group;
        private readonly _btnMultiPlayer    : TinyWars.GameUi.UiButton;
        private readonly _btnRanking        : TinyWars.GameUi.UiButton;
        private readonly _btnSinglePlayer   : TinyWars.GameUi.UiButton;

        public static show(): void {
            if (!SpmMainMenuPanel._instance) {
                SpmMainMenuPanel._instance = new SpmMainMenuPanel();
            }
            SpmMainMenuPanel._instance.open(undefined);
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
                { type: Notify.Type.MsgUserLogout,      callback: this._onMsgUserLogout },
            ]);

            this._showOpenAnimation();

            if (!SpmModel.SaveSlot.getHasReceivedSlotArray()) {
                SpmProxy.reqSpmGetWarSaveSlotFullDataArray();
            }
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
        private _onTouchedBtnCreateCustomWar(e: egret.TouchEvent): void {
            this.close();
            Lobby.LobbyTopPanel.hide();
            Lobby.LobbyBottomPanel.hide();
            SingleCustomRoom.ScrCreateMapListPanel.show();
        }
        private _onTouchedBtnContinueWar(e: egret.TouchEvent): void {
            this.close();
            Lobby.LobbyTopPanel.hide();
            Lobby.LobbyBottomPanel.hide();
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
            return new Promise<void>((resolve, reject) => {
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
