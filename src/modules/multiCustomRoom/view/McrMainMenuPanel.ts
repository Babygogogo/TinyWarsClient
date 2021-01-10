
namespace TinyWars.MultiCustomRoom {
    import Lang         = Utility.Lang;
    import FlowManager  = Utility.FlowManager;
    import Notify       = Utility.Notify;

    export class McrMainMenuPanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Scene;
        protected readonly _IS_EXCLUSIVE = true;

        private static _instance: McrMainMenuPanel;

        private _labelMenuTitle : GameUi.UiLabel;
        private _btnBack        : GameUi.UiButton;
        private _listCommand    : GameUi.UiScrollList;

        public static show(): void {
            if (!McrMainMenuPanel._instance) {
                McrMainMenuPanel._instance = new McrMainMenuPanel();
            }
            McrMainMenuPanel._instance.open();
        }

        public static hide(): void {
            if (McrMainMenuPanel._instance) {
                McrMainMenuPanel._instance.close();
            }
        }

        private constructor() {
            super();

            this._setIsAutoAdjustHeight();
            this.skinName = "resource/skins/multiCustomRoom/McrMainMenuPanel.exml";
        }

        protected _onOpened(): void {
            this._setUiListenerArray([
                { ui: this._btnBack, callback: this._onTouchedBtnBack },
            ]);
            this._setNotifyListenerArray([
                { type: Notify.Type.LanguageChanged,    callback: this._onNotifyLanguageChanged },
                { type: Notify.Type.MsgUserLogout,      callback: this._onMsgUserLogout },
            ]);
            this._listCommand.setItemRenderer(CommandRenderer);

            this._updateView();
        }

        protected _onClosed(): void {
            this._listCommand.clear();
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Callbacks.
        ////////////////////////////////////////////////////////////////////////////////
        private _onTouchedBtnBack(e: egret.TouchEvent): void {
            this.close();
            Lobby.LobbyPanel.show();
        }

        private _onNotifyLanguageChanged(e: egret.Event): void {
            this._updateView();
        }
        private _onMsgUserLogout(e: egret.Event): void {
            this.close();
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Private functions.
        ////////////////////////////////////////////////////////////////////////////////
        private _updateView(): void {
            this._labelMenuTitle.text   = Lang.getText(Lang.Type.B0205);
            this._btnBack.label         = Lang.getText(Lang.Type.B0146);
            this._listCommand.bindData(this._createDataForListCommand());
        }

        private _createDataForListCommand(): DataForCommandRenderer[] {
            return [
                {
                    name    : Lang.getText(Lang.Type.B0000),
                    callback: (): void => {
                        this.close();
                        McrCreateMapListPanel.show({});
                    },
                },
                {
                    name    : Lang.getText(Lang.Type.B0023),
                    callback: (): void => {
                        this.close();
                        McrJoinRoomListPanel.show();
                    },
                },
                {
                    name    : Lang.getText(Lang.Type.B0410),
                    callback: (): void => {
                        this.close();
                        McrMyRoomListPanel.show();
                    },
                    redChecker: async () => {
                        return await McrModel.checkIsRed();
                    },
                },
                {
                    name    : Lang.getText(Lang.Type.B0024),
                    callback: () => {
                        this.close();
                        McrMyWarListPanel.show();
                    },
                    redChecker  : async () => {
                        return MultiPlayerWar.MpwModel.checkIsRedForMyMcwWars();
                    },
                },
                {
                    name    : Lang.getText(Lang.Type.B0206),
                    callback: () => {
                        this.close();
                        McrWatchMainMenuPanel.show();
                    },
                    redChecker  : async () => {
                        const watchInfos = MultiPlayerWar.MpwModel.getWatchRequestedWarInfos();
                        return (!!watchInfos) && (watchInfos.length > 0);
                    },
                },
                {
                    name    : Lang.getText(Lang.Type.B0092),
                    callback: () => {
                        this.close();
                        ReplayWar.RwReplayListPanel.show();
                    },
                },
            ];
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
            this._imgRed.visible    = (!!data.redChecker) && (await data.redChecker());
        }

        public onItemTapEvent(e: eui.ItemTapEvent): void {
            (this.data as DataForCommandRenderer).callback();
        }
    }
}
