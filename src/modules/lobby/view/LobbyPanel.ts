
namespace TinyWars.Lobby {
    import Tween        = egret.Tween;
    import Lang         = Utility.Lang;
    import Helpers      = Utility.Helpers;
    import Notify       = Utility.Notify;
    import UserModel    = User.UserModel;

    const DISCORD_URL   = `https://discord.gg/jdtRpY9`;
    const GITHUB_URL    = `https://github.com/Babygogogo/TinyWarsClient`;

    export class LobbyPanel extends GameUi.UiPanel<void> {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Scene;
        protected readonly _IS_EXCLUSIVE = true;

        private static _instance: LobbyPanel;

        private _groupTips      : eui.Group;
        private _groupWelcome   : eui.Group;
        private _labelTips0     : GameUi.UiLabel;
        private _labelTips1     : GameUi.UiLabel;
        private _groupQq        : eui.Group;
        private _labelTips2     : GameUi.UiLabel;
        private _labelTips3     : GameUi.UiLabel;
        private _groupDiscord   : eui.Group;
        private _labelTips4     : GameUi.UiLabel;
        private _labelTips5     : GameUi.UiLabel;
        private _groupGithub    : eui.Group;
        private _labelTips6     : GameUi.UiLabel;
        private _labelTips7     : GameUi.UiLabel;

        private _group          : eui.Group;
        private _btnSinglePlayer: GameUi.UiButton;
        private _btnMultiPlayer : GameUi.UiButton;
        private _btnRanking     : GameUi.UiButton;

        public static show(): void {
            if (!LobbyPanel._instance) {
                LobbyPanel._instance = new LobbyPanel();
            }
            LobbyPanel._instance.open(undefined);
        }

        public static async hide(): Promise<void> {
            if (LobbyPanel._instance) {
                await LobbyPanel._instance.close();
            }
        }

        private constructor() {
            super();

            this.skinName = "resource/skins/lobby/LobbyPanel.exml";
        }

        protected _onOpened(): void {
            this._setUiListenerArray([
                { ui: this._groupDiscord,       callback: this._onTouchedGroupDiscord },
                { ui: this._groupGithub,        callback: this._onTouchedGroupGithub },
                { ui: this._btnMultiPlayer,     callback: this._onTouchedBtnMultiPlayer },
                { ui: this._btnSinglePlayer,    callback: this._onTouchedBtnSinglePlayer },
                { ui: this._btnRanking,         callback: this._onTouchedBtnRanking },
            ]);
            this._setNotifyListenerArray([
                { type: Notify.Type.LanguageChanged,                callback: this._onNotifyLanguageChanged },
                { type: Notify.Type.MsgUserLogout,                  callback: this._onMsgUserLogout },
                { type: Notify.Type.MsgMcrGetJoinedRoomInfoList,    callback: this._onMsgMcrGetJoinedRoomInfoList },
                { type: Notify.Type.MsgMfrGetJoinedRoomInfoList,    callback: this._onMsgMfrGetJoinedRoomInfoList },
                { type: Notify.Type.MsgMrrGetMyRoomPublicInfoList,  callback: this._onMsgMrrGetMyRoomPublicInfoList },
            ]);

            this._showOpenAnimation();

            this._updateComponentsForLanguage();
            this._updateBtnMultiPlayer();
            this._updateBtnRanking();
        }

        protected async _onClosed(): Promise<void> {
            await this._showCloseAnimation();
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Callbacks.
        ////////////////////////////////////////////////////////////////////////////////
        private _onTouchedGroupDiscord(e: egret.TouchEvent): void {
            if ((window) && (window.open)) {
                Common.CommonConfirmPanel.show({
                    content : Lang.getFormattedText(Lang.Type.F0065, `Discord`),
                    callback: () => {
                        window.open(DISCORD_URL);
                    },
                })
            }
        }

        private _onTouchedGroupGithub(e: egret.TouchEvent): void {
            if ((window) && (window.open)) {
                Common.CommonConfirmPanel.show({
                    content : Lang.getFormattedText(Lang.Type.F0065, `GitHub`),
                    callback: () => {
                        window.open(GITHUB_URL);
                    },
                })
            }
        }

        private _onTouchedBtnMultiPlayer(e: egret.TouchEvent): void {
            this.close();
            MultiCustomRoom.McrMainMenuPanel.show();
        }

        private _onTouchedBtnSinglePlayer(e: egret.TouchEvent): void {
            this.close();
            SinglePlayerLobby.SinglePlayerLobbyPanel.show();
        }

        private _onTouchedBtnRanking(e: egret.TouchEvent): void {
            this.close();
            MultiRankRoom.MrrMainMenuPanel.show();
        }

        private _onMsgUserLogout(e: egret.Event): void {
            this.close();
        }

        private _onMsgMcrGetJoinedRoomInfoList(e: egret.Event): void {
            this._updateBtnMultiPlayer();
        }

        private _onMsgMfrGetJoinedRoomInfoList(e: egret.Event): void {
            this._updateBtnMultiPlayer();
        }

        private _onMsgMrrGetMyRoomPublicInfoList(e: egret.Event): void {
            this._updateBtnRanking();
        }

        private _onNotifyLanguageChanged(e: egret.Event): void {
            this._updateComponentsForLanguage();
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Private functions.
        ////////////////////////////////////////////////////////////////////////////////
        private _showOpenAnimation(): void {
            // const group = this._group;
            // Tween.removeTweens(group);
            // Tween.get(group)
            //     .set({ alpha: 0, right: 20 })
            //     .to({ alpha: 1, right: 60 }, 200);
            const group = this._group;
            group.alpha = 1;
            group.right = 60;

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

            // const groupTips = this._groupTips;
            // Tween.removeTweens(groupTips);
            // Tween.get(groupTips)
            //     .set({ alpha: 0, left: 20 })
            //     .to({ alpha: 1, left: 60 }, 200);
            const groupTips = this._groupTips;
            groupTips.alpha = 1;
            groupTips.left  = 60;

            Helpers.resetTween({
                obj         : this._groupWelcome,
                beginProps  : { alpha: 0, left: -40 },
                endProps    : { alpha: 1, left: 0 },
            });
            Helpers.resetTween({
                obj         : this._groupQq,
                beginProps  : { alpha: 0, left: -40 },
                waitTime    : 66,
                endProps    : { alpha: 1, left: 0 },
            });
            Helpers.resetTween({
                obj         : this._groupDiscord,
                beginProps  : { alpha: 0, left: -40 },
                waitTime    : 132,
                endProps    : { alpha: 1, left: 0 },
            });
            Helpers.resetTween({
                obj         : this._groupGithub,
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

                const groupTips = this._groupTips;
                Tween.removeTweens(groupTips);
                Tween.get(groupTips)
                    .set({ alpha: 1, left: 60 })
                    .to({ alpha: 0, left: 20 }, 200)
                    .call(resolve);
            });
        }

        private async _updateComponentsForLanguage(): Promise<void> {
            this._labelTips0.text   = Lang.getText(Lang.Type.A0195);
            this._labelTips1.text   = ` `;
            this._labelTips2.text   = `${Lang.getText(Lang.Type.B0537)}:`;
            this._labelTips3.text   = `368142455`;
            this._labelTips4.text   = `${Lang.getText(Lang.Type.B0538)}:`;
            this._labelTips5.text   = DISCORD_URL;
            this._labelTips6.text   = `${Lang.getText(Lang.Type.B0539)}:`;
            this._labelTips7.text   = GITHUB_URL;
        }

        private async _updateBtnMultiPlayer(): Promise<void> {
            this._btnMultiPlayer.setRedVisible(
                (MultiPlayerWar.MpwModel.checkIsRedForMyMcwWars())  ||
                (MultiPlayerWar.MpwModel.checkIsRedForMyMfwWars())  ||
                (await MultiCustomRoom.McrModel.checkIsRed())       ||
                (await MultiFreeRoom.MfrModel.checkIsRed())
            );
        }

        private async _updateBtnRanking(): Promise<void> {
            this._btnRanking.setRedVisible(
                (MultiPlayerWar.MpwModel.checkIsRedForMyMrwWars()) ||
                (await MultiRankRoom.MrrModel.checkIsRed())
            );
        }
    }
}
