
namespace TinyWars.Lobby {
    import Lang         = Utility.Lang;
    import FloatText    = Utility.FloatText;
    import Notify       = Utility.Notify;
    import UserModel    = User.UserModel;

    export class LobbyPanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Scene;
        protected readonly _IS_EXCLUSIVE = true;

        private static _instance: LobbyPanel;

        private _group1: eui.Group;
        private _group2: eui.Group;
        private _group3: eui.Group;
        private _group4: eui.Group;

        private _group          : eui.Group;
        private _labelTips      : GameUi.UiLabel;
        private _labelMenuTitle : GameUi.UiLabel;
        private _listCommand    : GameUi.UiScrollList;

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

            this._setIsAutoAdjustHeight();
            this.skinName = "resource/skins/lobby/LobbyPanel.exml";
        }

        protected _onOpened(): void {
            this._setUiListenerArray([
                { ui: this, callback: this._onResize, eventType: egret.Event.RESIZE },
            ]);
            this._setNotifyListenerArray([
                { type: Notify.Type.LanguageChanged,                callback: this._onNotifyLanguageChanged },
                { type: Notify.Type.MsgUserLogout,                  callback: this._onMsgUserLogout },
                { type: Notify.Type.MsgMcrGetJoinedRoomInfoList,    callback: this._onMsgMcrGetJoinedRoomInfoList },
                { type: Notify.Type.MsgMrrGetMyRoomPublicInfoList,  callback: this._onMsgMrrGetMyRoomPublicInfoList },
            ]);
            this._listCommand.setItemRenderer(CommandRenderer);

            this._showOpenAnimation();

            this._updateComponentsForLanguage();
        }

        protected async _onClosed(): Promise<void> {
            await this._showCloseAnimation();

            this._listCommand.clear();
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Callbacks.
        ////////////////////////////////////////////////////////////////////////////////
        private _onResize(e: egret.Event): void {
            this._group1.height = (this.height - 40 - 90) / 2;
            this._group2.height = (this.height - 40 - 90) / 2;
            this._group3.height = (this.height - 40 - 90) / 2;
            this._group4.height = (this.height - 40 - 90) / 2;
        }

        private _onMsgUserLogout(e: egret.Event): void {
            this.close();
        }

        private _onMsgMcrGetJoinedRoomInfoList(e: egret.Event): void {
            this._listCommand.refresh();
        }

        private _onMsgMrrGetMyRoomPublicInfoList(e: egret.Event): void {
            this._listCommand.refresh();
        }

        private _onNotifyLanguageChanged(e: egret.Event): void {
            this._updateComponentsForLanguage();
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Private functions.
        ////////////////////////////////////////////////////////////////////////////////
        private _showOpenAnimation(): void {
            const group = this._group;
            egret.Tween.removeTweens(group);
            egret.Tween.get(group)
                .set({ alpha: 0, right: -40 })
                .to({ alpha: 1, right: 0 }, 200);

            const labelTips = this._labelTips;
            egret.Tween.removeTweens(labelTips);
            egret.Tween.get(labelTips)
                .set({ alpha: 0 })
                .to({ alpha: 1 }, 200);
        }
        private _showCloseAnimation(): Promise<void> {
            return new Promise<void>((resolve, reject) => {
                const group = this._group;
                egret.Tween.removeTweens(group);
                egret.Tween.get(group)
                    .set({ alpha: 1, right: 0 })
                    .to({ alpha: 0, right: -40 }, 200);

                const labelTips = this._labelTips;
                egret.Tween.removeTweens(labelTips);
                egret.Tween.get(labelTips)
                    .set({ alpha: 1 })
                    .to({ alpha: 0 }, 200)
                    .call(resolve);
            });
        }

        private async _updateComponentsForLanguage(): Promise<void> {
            this._labelTips.text        = Lang.getRichText(Lang.RichType.R0007),
            this._labelMenuTitle.text   = Lang.getText(Lang.Type.B0155);
            this._listCommand.bindData(await this._createDataForListCommand());
        }

        private async _createDataForListCommand(): Promise<DataForCommandRenderer[]> {
            const dataList: DataForCommandRenderer[] = [
                {
                    name    : Lang.getText(Lang.Type.B0137),
                    callback: (): void => {
                        this.close();
                        MultiCustomRoom.McrMainMenuPanel.show();
                    },
                    redChecker  : async () => {
                        return (MultiPlayerWar.MpwModel.checkIsRedForMyMcwWars())
                            || (await MultiCustomRoom.McrModel.checkIsRed());
                    },
                },
                {
                    name        : Lang.getText(Lang.Type.B0404),
                    callback    : () => {
                        this.close();
                        MultiRankRoom.MrrMainMenuPanel.show();
                    },
                    redChecker  : async () => {
                        return (MultiPlayerWar.MpwModel.checkIsRedForMyMrwWars())
                            || (await MultiRankRoom.MrrModel.checkIsRed());
                    }
                },
                {
                    name    : Lang.getText(Lang.Type.B0138),
                    callback: (): void => {
                        this.close();
                        SinglePlayerLobby.SinglePlayerLobbyPanel.show();
                    },
                },
                {
                    name    : Lang.getText(Lang.Type.B0271),
                    callback: (): void => {
                        this.close();
                        MapEditor.MeMapListPanel.show();
                    },
                }
            ];

            if ((await UserModel.getIsSelfAdmin()) || (await UserModel.getIsSelfMapCommittee())) {
                dataList.push({
                    name    : Lang.getText(Lang.Type.B0192),
                    callback: (): void => {
                        this.close();
                        MapManagement.MmMainMenuPanel.show();
                    },
                });
            }

            return dataList;
        }
    }

    type DataForCommandRenderer = {
        name        : string;
        callback    : () => void;
        redChecker? : () => Promise<boolean>;
    }

    class CommandRenderer extends GameUi.UiListItemRenderer {
        private _labelCommand   : GameUi.UiLabel;
        private _imgRed         : GameUi.UiImage;

        protected async dataChanged(): Promise<void> {
            super.dataChanged();

            const data              = this.data as DataForCommandRenderer;
            this._labelCommand.text = data.name;
            this._imgRed.visible    = (data.redChecker != null) && (await data.redChecker());
        }

        public onItemTapEvent(e: eui.ItemTapEvent): void {
            (this.data as DataForCommandRenderer).callback();
        }
    }
}
