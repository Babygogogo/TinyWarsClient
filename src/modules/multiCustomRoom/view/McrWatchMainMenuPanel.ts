
namespace TinyWars.MultiCustomRoom {
    import Lang         = Utility.Lang;
    import FlowManager  = Utility.FlowManager;
    import Notify       = Utility.Notify;

    export class McrWatchMainMenuPanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Scene;
        protected readonly _IS_EXCLUSIVE = true;

        private static _instance: McrWatchMainMenuPanel;

        private _labelMenuTitle : GameUi.UiLabel;
        private _btnBack        : GameUi.UiButton;
        private _listCommand    : GameUi.UiScrollList;

        public static show(): void {
            if (!McrWatchMainMenuPanel._instance) {
                McrWatchMainMenuPanel._instance = new McrWatchMainMenuPanel();
            }
            McrWatchMainMenuPanel._instance.open(undefined);
        }

        public static async hide(): Promise<void> {
            if (McrWatchMainMenuPanel._instance) {
                await McrWatchMainMenuPanel._instance.close();
            }
        }

        private constructor() {
            super();

            this.skinName = "resource/skins/multiCustomRoom/McrWatchMainMenuPanel.exml";
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

        protected async _onClosed(): Promise<void> {
            this._listCommand.clear();
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Callbacks.
        ////////////////////////////////////////////////////////////////////////////////
        private _onTouchedBtnBack(e: egret.TouchEvent): void {
            this.close();
            McrMainMenuPanel.show();
            Lobby.LobbyTopPanel.show();
            Lobby.LobbyBottomPanel.show();
        }

        private _onMsgUserLogout(e: egret.Event): void {
            this.close();
        }
        private _onNotifyLanguageChanged(e: egret.Event): void {
            this._updateView();
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Private functions.
        ////////////////////////////////////////////////////////////////////////////////
        private _updateView(): void {
            this._labelMenuTitle.text   = Lang.getText(Lang.Type.B0206);
            this._btnBack.label         = Lang.getText(Lang.Type.B0146);
            this._listCommand.bindData(this._createDataForListCommand());
        }

        private _createDataForListCommand(): DataForCommandRenderer[] {
            return [
                {
                    name    : Lang.getText(Lang.Type.B0207),
                    callback: (): void => {
                        this.close();
                        McrWatchMakeRequestWarsPanel.show();
                    },
                },
                {
                    name    : Lang.getText(Lang.Type.B0208),
                    callback: (): void => {
                        this.close();
                        McrWatchHandleRequestWarsPanel.show();
                    },
                    redChecker  : () => {
                        const watchInfos = MultiPlayerWar.MpwModel.getWatchRequestedWarInfos();
                        return (!!watchInfos) && (watchInfos.length > 0);
                    },
                },
                {
                    name    : Lang.getText(Lang.Type.B0219),
                    callback: (): void => {
                        this.close();
                        McrWatchDeleteWatcherWarsPanel.show();
                    },
                },
                {
                    name    : Lang.getText(Lang.Type.B0222),
                    callback: (): void => {
                        this.close();
                        McrWatchOngoingWarsPanel.show();
                    },
                },
            ];
        }
    }

    type DataForCommandRenderer = {
        name        : string;
        callback    : () => void;
        redChecker? : () => boolean;
    }

    class CommandRenderer extends GameUi.UiListItemRenderer {
        private _labelCommand   : GameUi.UiLabel;
        private _imgRed         : GameUi.UiImage;

        protected dataChanged(): void {
            super.dataChanged();

            const data              = this.data as DataForCommandRenderer;
            this._labelCommand.text = data.name;
            this._imgRed.visible    = (!!data.redChecker) && (data.redChecker());
        }

        public onItemTapEvent(e: eui.ItemTapEvent): void {
            (this.data as DataForCommandRenderer).callback();
        }
    }
}
