
// import Types                    from "../../tools/helpers/Types";
// import Twns.Notify           from "../../tools/notify/NotifyType";
// import TwnsUiButton             from "../../tools/ui/UiButton";
// import TwnsUiPanel              from "../../tools/ui/UiPanel";
// import TwnsUserSettingsPanel    from "../../user/view/UserSettingsPanel";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.Lobby {
    import NotifyType           = Twns.Notify.NotifyType;

    export type OpenDataForLobbyTopRightPanel = void;
    export class LobbyTopRightPanel extends TwnsUiPanel.UiPanel<OpenDataForLobbyTopRightPanel> {
        private readonly _group!            : eui.Group;
        private readonly _btnSettings!      : TwnsUiButton.UiButton;

        protected _onOpening(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged, callback: this._onNotifyLanguageChanged },
                { type: NotifyType.MsgUserLogout,   callback: this._onMsgUserLogout },
            ]);
            this._setUiListenerArray([
                { ui: this._btnSettings,    callback: this._onTouchedBtnSettings },
            ]);
        }
        protected async _updateOnOpenDataChanged(): Promise<void> {
            // nothing to do
        }
        protected _onClosing(): void {
            // nothing to do
        }

        private _onMsgUserLogout(): void {
            this.close();
        }

        private _onNotifyLanguageChanged(): void {
            // nothing to do
        }

        private _onTouchedBtnSettings(): void {
            Twns.PanelHelpers.open(Twns.PanelHelpers.PanelDict.UserSettingsPanel, void 0);
        }

        protected async _showOpenAnimation(): Promise<void> {
            Twns.Helpers.resetTween({
                obj         : this._group,
                beginProps  : { alpha: 0, top: -40 },
                endProps    : { alpha: 1, top: 0 },
            });

            await Twns.Helpers.wait(CommonConstants.DefaultTweenTime);
        }
        protected async _showCloseAnimation(): Promise<void> {
            Twns.Helpers.resetTween({
                obj         : this._group,
                beginProps  : { alpha: 1, top: 0 },
                endProps    : { alpha: 0, top: -40 },
            });

            await Twns.Helpers.wait(CommonConstants.DefaultTweenTime);
        }
    }
}

// export default TwnsLobbyTopRightPanel;
