
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
            LobbyPanel._instance.open();
        }

        public static hide(): void {
            if (LobbyPanel._instance) {
                LobbyPanel._instance.close();
            }
        }

        private constructor() {
            super();

            this._setAutoAdjustHeightEnabled();
            this.skinName = "resource/skins/lobby/LobbyPanel.exml";
        }

        protected _onFirstOpened(): void {
            this._uiListeners = [
                { ui: this, callback: this._onResize, eventType: egret.Event.RESIZE },
            ];
            this._notifyListeners = [
                { type: Notify.Type.LanguageChanged,                callback: this._onNotifyLanguageChanged },
                { type: Notify.Type.MsgUserLogout,                  callback: this._onMsgUserLogout },
                { type: Notify.Type.MsgMcrGetJoinedRoomInfoList,    callback: this._onMsgMcrGetJoinedRoomInfoList },
                { type: Notify.Type.MsgRmrGetMyRoomPublicInfoList,  callback: this._onMsgRmrGetMyRoomPublicInfoList },
            ];

            this._listCommand.setItemRenderer(CommandRenderer);
        }

        protected async _onOpened(): Promise<void> {
            this._showOpenAnimation();

            this._updateComponentsForLanguage();
        }

        protected _onClosed(): void {
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

        private _onMsgRmrGetMyRoomPublicInfoList(e: egret.Event): void {
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
                        RankMatchRoom.RmrMainMenuPanel.show();
                    },
                    redChecker  : async () => {
                        return (MultiPlayerWar.MpwModel.checkIsRedForMyRmwWars())
                            || (await RankMatchRoom.RmrModel.checkIsRed());
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
                        LobbyPanel.hide();
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

    class CommandRenderer extends eui.ItemRenderer {
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
