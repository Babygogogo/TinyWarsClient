
// import TwnsUiPanel          from "../../tools/ui/UiPanel";
// import Types                from "../../tools/helpers/Types";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.Lobby {
    export type OpenDataForLobbyBackgroundPanel = void;
    export class LobbyBackgroundPanel extends TwnsUiPanel.UiPanel<OpenDataForLobbyBackgroundPanel> {
        protected _onOpening(): void {
            // nothing to do
        }
        protected async _updateOnOpenDataChanged(): Promise<void> {
            // nothing to do
        }
        protected _onClosing(): void {
            // nothing to do
        }
    }
}

// export default TwnsLobbyBackgroundPanel;
