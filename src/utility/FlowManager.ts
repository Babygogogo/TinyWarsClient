
namespace TinyWars.Utility.FlowManager {
    const _NET_EVENTS = [
        { actionCode: Network.Codes.S_ServerDisconnect,   callback: _onNetSServerDisconnect },
    ];
    const _NOTIFY_EVENTS = [
        { type: Notify.Type.ConfigLoaded,   callback: _onNotifyConfigLoaded },
        { type: Notify.Type.SLogin,         callback: _onNotifySLogin },
        { type: Notify.Type.SLogout,        callback: _onNotifySLogout },
    ];

    export async function startGame(stage: egret.Stage): Promise<void> {
        Network.Manager.addListeners(_NET_EVENTS, FlowManager);
        Notify.addEventListeners(_NOTIFY_EVENTS, FlowManager);
        Utility.StageManager.init(stage);
        await Promise.all([ResManager.init(), ProtoManager.init()]);

        ConfigManager.init();
        Network.Manager.init();
        Time.TimeProxy.init();
        Time.TimeModel.init();
        User.UserModel.init();
        WarMap.WarMapProxy.init();
        WarMap.WarMapModel.init();
        Login.LoginProxy.init();
        MultiCustomRoom.McrProxy.init();

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
    export async function gotoMultiCustomWar(data: Types.SerializedMcwWar): Promise<void> {
        const war = await new MultiCustomWar.McwWar().init(data);
        war.startRunning().startRunningView();
        StageManager.closeAllPanels();
        MultiCustomWar.McwBackgroundView.show();

        const layer = StageManager.getLayer(Types.LayerType.Scene);
        layer.removeChildren();
        layer.addChild(war.getView());
    }

    function _onNetSServerDisconnect(e: egret.Event): void {
        const data = e.data as ProtoTypes.IS_ServerDisconnect;
        Common.AlertPanel.show({
            title   : Lang.getText(Lang.BigType.B01, Lang.SubType.S25),
            content : Lang.getText(Lang.BigType.B00, Lang.SubType.S20),
        });
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
            && (ConfigManager.checkIsConfigLoaded(ConfigManager.getNewestConfigVersion()))
    }

    function _removeLoadingDom(): void {
        const document = window.document;
        if (document) {
            const outLoadingLayer = document.getElementById("outLoadingLayer");
            (outLoadingLayer) && (document.body.removeChild(outLoadingLayer));
        }
    }
}
