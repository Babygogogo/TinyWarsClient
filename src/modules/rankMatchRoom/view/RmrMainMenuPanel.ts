
namespace TinyWars.RankMatchRoom {
    import Lang         = Utility.Lang;
    import FlowManager  = Utility.FlowManager;
    import Notify       = Utility.Notify;

    export class RmrMainMenuPanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Scene;
        protected readonly _IS_EXCLUSIVE = true;

        private static _instance: RmrMainMenuPanel;

        private _labelMenuTitle : GameUi.UiLabel;
        private _btnBack        : GameUi.UiButton;
        private _listCommand    : GameUi.UiScrollList;

        public static show(): void {
            if (!RmrMainMenuPanel._instance) {
                RmrMainMenuPanel._instance = new RmrMainMenuPanel();
            }
            RmrMainMenuPanel._instance.open();
        }

        public static hide(): void {
            if (RmrMainMenuPanel._instance) {
                RmrMainMenuPanel._instance.close();
            }
        }

        private constructor() {
            super();

            this._setIsAutoAdjustHeight();
            this.skinName = "resource/skins/rankMatchRoom/RmrMainMenuPanel.exml";
        }

        protected _onOpened(): void {
            this._setUiListenerArray([
                { ui: this._btnBack, callback: this._onTouchedBtnBack },
            ]);
            this._setNotifyListenerArray([
                { type: Notify.Type.LanguageChanged,                callback: this._onNotifyLanguageChanged },
                { type: Notify.Type.MsgUserLogout,                  callback: this._onMsgUserLogout },
                { type: Notify.Type.MsgRmrGetRoomPublicInfo,        callback: this._onMsgRmrGetRoomPublicInfo },
                { type: Notify.Type.MsgRmrGetMyRoomPublicInfoList,  callback: this._onMsgRmrGetMyRoomPublicInfoList },
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
            RmrMainMenuPanel.hide();
        }
        private _onMsgRmrGetRoomPublicInfo(e: egret.Event): void {
            this._listCommand.refresh();
        }
        private _onMsgRmrGetMyRoomPublicInfoList(e: egret.Event): void {
            this._updateListCommand();
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Private functions.
        ////////////////////////////////////////////////////////////////////////////////
        private _updateView(): void {
            this._updateComponentsForLanguage();
            this._updateListCommand();
        }

        private _updateComponentsForLanguage(): void {
            this._labelMenuTitle.text   = Lang.getText(Lang.Type.B0404);
            this._btnBack.label         = Lang.getText(Lang.Type.B0146);
        }

        private _updateListCommand(): void {
            this._listCommand.bindData(this._createDataForListCommand());
        }

        private _createDataForListCommand(): DataForCommandRenderer[] {
            return [
                {
                    name    : Lang.getText(Lang.Type.B0413),
                    callback: (): void => {
                        RmrSetMaxConcurrentCountPanel.show();
                    },
                },
                {
                    name    : Lang.getText(Lang.Type.B0410),
                    callback: (): void => {
                        this.close();
                        RmrMyRoomListPanel.show();
                    },
                    redChecker  : async () => {
                        return await RmrModel.checkIsRed();
                    },
                },
                {
                    name    : Lang.getText(Lang.Type.B0024),
                    callback: () => {
                        this.close();
                        RmrMyWarListPanel.show();
                    },
                    redChecker  : async () => {
                        return MultiPlayerWar.MpwModel.checkIsRedForMyRmwWars();
                    },
                },
                {
                    name    : Lang.getText(Lang.Type.B0441),
                    callback: () => {
                        this.close();
                        RmrPreviewMapListPanel.show(false);
                    },
                    redChecker  : async () => {
                        return false;
                    },
                },
                {
                    name    : Lang.getText(Lang.Type.B0442),
                    callback: () => {
                        this.close();
                        RmrPreviewMapListPanel.show(true);
                    },
                    redChecker  : async () => {
                        return false;
                    },
                },
                // {
                //     name    : Lang.getText(Lang.Type.B0206),
                //     callback: () => {
                //         RmrMainMenuPanel.hide();
                //         McrWatchMainMenuPanel.show();
                //     },
                //     redChecker  : () => {
                //         const watchInfos = MultiPlayerWar.MpwModel.getWatchRequestedWarInfos();
                //         return (!!watchInfos) && (watchInfos.length > 0);
                //     },
                // },
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
            this._imgRed.visible    = (data.redChecker != null) && (await data.redChecker());
        }

        public onItemTapEvent(e: eui.ItemTapEvent): void {
            (this.data as DataForCommandRenderer).callback();
        }
    }
}
