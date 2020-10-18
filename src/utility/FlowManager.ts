
namespace TinyWars.Utility.FlowManager {
    import UserModel    = User.UserModel;
    import McwProxy     = MultiPlayerWar.MpwProxy;
    import McwModel     = MultiPlayerWar.MpwModel;
    import ScwModel     = SingleCustomWar.ScwModel;
    import RwModel      = ReplayWar.RwModel;
    import MeManager    = MapEditor.MeManager;

    const _NET_EVENTS = [
        { msgCode: Network.Codes.MsgCommonServerDisconnect, callback: _onMsgCommonServerDisconnect },
    ];
    const _NOTIFY_EVENTS = [
        { type: Notify.Type.NetworkConnected,   callback: _onNotifyNetworkConnected, },
        { type: Notify.Type.ConfigLoaded,       callback: _onNotifyConfigLoaded },
        { type: Notify.Type.MsgUserLogin,             callback: _onNotifySLogin },
        { type: Notify.Type.MsgUserLogout,            callback: _onNotifySLogout },
    ];

    let _hasOnceWentToLobby = false;

    export async function startGame(stage: egret.Stage): Promise<void> {
        window.onerror = (message, filename, row, col, err) => {
            Common.CommonErrorPanel.show({
                content : `${message}\n\n${err ? err.stack : "No available call stack."}`,
            });
        };

        Network.Manager.addListeners(_NET_EVENTS, FlowManager);
        Notify.addEventListeners(_NOTIFY_EVENTS, FlowManager);
        Utility.StageManager.init(stage);
        await Promise.all([ResManager.init(), ProtoManager.init()]);

        Lang.init();
        NoSleepManager.init();
        Utility.ConfigManager.init();
        Network.Manager.init();
        McwProxy.init();
        McwModel.init();
        Time.TimeModel.init();
        User.UserProxy.init();
        User.UserModel.init();
        WarMap.WarMapProxy.init();
        WarMap.WarMapModel.init();
        MultiCustomRoom.McrProxy.init();
        ReplayWar.RwProxy.init();
        RwModel.init();
        SingleCustomRoom.ScrProxy.init();
        SingleCustomRoom.ScrModel.init();
        ScwModel.init();
        MapEditor.MeProxy.init();
        MapEditor.MeModel.init();
        MeManager.init();
        Chat.ChatProxy.init();
        Common.CommonProxy.init();
        Common.CommonModel.init();

        _removeLoadingDom();
        gotoLogin();

        await ResManager.loadMainRes();
        (_checkCanFirstGoToLobby()) && (gotoLobby());
    }

    export function gotoLogin(): void {
        McwModel.unloadWar();
        RwModel.unloadWar();
        ScwModel.unloadWar();
        MeManager.unloadWar();
        StageManager.closeAllPanels();
        Login.LoginBackgroundPanel.show();
        Login.LoginPanel.show();
    }
    export function gotoLobby(): void {
        _hasOnceWentToLobby = true;

        McwModel.unloadWar();
        RwModel.unloadWar();
        ScwModel.unloadWar();
        MeManager.unloadWar();
        StageManager.closeAllPanels();
        Lobby.LobbyPanel.show();
        Lobby.LobbyTopPanel.show();
    }
    export async function gotoMultiCustomWar(data: ProtoTypes.WarSerialization.ISerialWar): Promise<void> {
        RwModel.unloadWar();
        ScwModel.unloadWar();
        MeManager.unloadWar();
        await McwModel.loadWar(data);

        StageManager.closeAllPanels();
        MultiPlayerWar.McwBackgroundPanel.show();
        MultiPlayerWar.McwTopPanel.show();
        MultiPlayerWar.McwWarPanel.show();
        MultiPlayerWar.McwTileBriefPanel.show();
        MultiPlayerWar.McwUnitBriefPanel.show();
    }
    export async function gotoReplay(warData: Uint8Array): Promise<void> {
        McwModel.unloadWar();
        ScwModel.unloadWar();
        MeManager.unloadWar();
        await RwModel.loadWar(warData);

        StageManager.closeAllPanels();
        ReplayWar.RwBackgroundPanel.show();
        ReplayWar.RwTopPanel.show();
        ReplayWar.RwWarPanel.show();
        ReplayWar.RwTileBriefPanel.show();
        ReplayWar.RwUnitBriefPanel.show();
    }
    export async function gotoSingleCustomWar(data: ProtoTypes.WarSerialization.ISerialWar): Promise<void> {
        McwModel.unloadWar();
        RwModel.unloadWar();
        MeManager.unloadWar();
        await ScwModel.loadWar(data);

        StageManager.closeAllPanels();
        SingleCustomWar.ScwBackgroundPanel.show();
        SingleCustomWar.ScwTopPanel.show();
        SingleCustomWar.ScwWarPanel.show();
        SingleCustomWar.ScwTileBriefPanel.show();
        SingleCustomWar.ScwUnitBriefPanel.show();
    }
    export async function gotoMapEditor(mapRawData: ProtoTypes.Map.IMapRawData, slotIndex: number, isReview: boolean): Promise<void> {
        McwModel.unloadWar();
        ScwModel.unloadWar();
        RwModel.unloadWar();
        await MeManager.loadWar(mapRawData, slotIndex, isReview);

        StageManager.closeAllPanels();
        MapEditor.MeBackgroundPanel.show();
        MapEditor.MeTopPanel.show();
        MapEditor.MeWarPanel.show();
        MapEditor.MeTileBriefPanel.show();
        MapEditor.MeUnitBriefPanel.show();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Callbacks.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    function _onNotifyNetworkConnected(e: egret.Event): void {
        const account   = UserModel.getSelfAccount();
        const password  = UserModel.getSelfPassword();
        if ((!UserModel.getIsLoggedIn()) && (account != null) && (password != null)) {
            User.UserProxy.reqLogin(account, password, true);
        }
    }

    function _onMsgCommonServerDisconnect(e: egret.Event): void {
        const data = e.data as ProtoTypes.NetMessage.MsgCommonServerDisconnect.IS;

        _hasOnceWentToLobby = false;
        UserModel.clearLoginInfo();
        FlowManager.gotoLogin();

        Common.CommonAlertPanel.show({
            title   : Lang.getText(Lang.Type.B0025),
            content : Lang.getText(Lang.Type.A0020),
        });
    }

    function _onNotifyConfigLoaded(e: egret.Event): void {
        (_checkCanFirstGoToLobby()) && (gotoLobby());
    }

    function _onNotifySLogin(e: egret.Event): void {
        if (_checkCanFirstGoToLobby()) {
            gotoLobby();
        } else {
            const mcwWar = McwModel.getWar();
            if (mcwWar) {
                McwProxy.reqMcwCommonSyncWar(mcwWar, Types.SyncWarRequestType.ReconnectionRequest);
            }
        }
    }

    function _onNotifySLogout(e: egret.Event): void {
        _hasOnceWentToLobby = false;
        UserModel.clearLoginInfo();
        gotoLogin();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Other private functions.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    function _checkCanFirstGoToLobby(): boolean {
        return (!_hasOnceWentToLobby)
            && (User.UserModel.getIsLoggedIn())
            && (ResManager.checkIsLoadedMainResource())
            && (Utility.ConfigManager.checkIsConfigLoaded(Utility.ConfigManager.getLatestConfigVersion()))
    }

    function _removeLoadingDom(): void {
        const document = window.document;
        if (document) {
            const outLoadingLayer = document.getElementById("outLoadingLayer");
            (outLoadingLayer) && (document.body.removeChild(outLoadingLayer));
        }
    }
}
