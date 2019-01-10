
namespace TinyWars.Utility.FlowManager {
    const _NOTIFY_EVENTS = [
        { type: Notify.Type.ConfigLoaded,   callback: _onNotifyConfigLoaded },
        { type: Notify.Type.SLogin,         callback: _onNotifySLogin },
        { type: Notify.Type.SLogout,        callback: _onNotifySLogout },
    ];

    export async function startGame(stage: egret.Stage): Promise<void> {
        Notify.addEventListeners(_NOTIFY_EVENTS, FlowManager);
        Utility.StageManager.init(stage);
        await Promise.all([ResManager.init(), ProtoManager.init()]);

        ConfigManager.init();
        Network.Manager.init();
        Time.TimeProxy.init();
        Time.TimeModel.init();
        User.UserModel.init();
        Map.MapProxy.init();
        Map.MapModel.init();
        Login.LoginProxy.init();
        CustomOnlineWarCreator.CreateWarProxy.init();
        CustomOnlineWarExiter.ExitWarProxy.init();
        CustomOnlineWarJoiner.JoinWarProxy.init();

        _removeLoadingDom();
        gotoLogin();

        await ResManager.loadMainRes();
        (_checkCanFirstGoToLobby()) && (gotoLobby());
    }

    export function gotoLogin(): void {
        StageManager.closeAllPanels();
        Login.LoginBackgroundPanel.show();
        Login.LoginPanel.show();
    }
    export function gotoLobby(): void {
        StageManager.closeAllPanels();
        Lobby.LobbyPanel.show();
        Lobby.LobbyTopPanel.show();
    }

    function _onNotifyConfigLoaded(e: egret.Event): void {
        (_checkCanFirstGoToLobby()) && (gotoLobby());
    }
    function _onNotifySLogin(e: egret.Event): void {
        (_checkCanFirstGoToLobby()) && (gotoLobby());
    }
    function _onNotifySLogout(e: egret.Event): void {
        gotoLogin();
    }

    function _checkCanFirstGoToLobby(): boolean {
        return (User.UserModel.checkIsLoggedIn())
            && (ResManager.checkIsLoadedMainResource())
            && (ConfigManager.checkIsLoaded(ConfigManager.getNewestConfigVersion()))
    }

    function _removeLoadingDom(): void {
        const document = window.document;
        if (document) {
            const outLoadingLayer = document.getElementById("outLoadingLayer");
            (outLoadingLayer) && (document.body.removeChild(outLoadingLayer));
        }
    }
}
