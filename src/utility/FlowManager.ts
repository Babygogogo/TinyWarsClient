
namespace TinyWars.Utility.FlowManager {
    import UserModel    = User.UserModel;
    import MpwProxy     = MultiPlayerWar.MpwProxy;
    import MpwModel     = MultiPlayerWar.MpwModel;
    import ScwModel     = SingleCustomWar.ScwModel;
    import RwModel      = ReplayWar.RwModel;
    import MeManager    = MapEditor.MeManager;

    const _NET_EVENTS = [
        { msgCode: Network.Codes.MsgCommonServerDisconnect, callback: _onMsgCommonServerDisconnect },
    ];
    const _NOTIFY_EVENTS = [
        { type: Notify.Type.NetworkConnected,           callback: _onNotifyNetworkConnected, },
        { type: Notify.Type.ConfigLoaded,               callback: _onNotifyConfigLoaded },
        { type: Notify.Type.MsgUserLogin,               callback: _onMsgUserLogin },
        { type: Notify.Type.MsgUserLogout,              callback: _onMsgUserLogout },
        { type: Notify.Type.MsgMpwCommonContinueWar,    callback: _onMsgMpwCommonContinueWar },
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
        MpwProxy.init();
        MpwModel.init();
        Time.TimeModel.init();
        User.UserProxy.init();
        User.UserModel.init();
        WarMap.WarMapProxy.init();
        WarMap.WarMapModel.init();
        MultiCustomRoom.McrProxy.init();
        RankMatchRoom.RmrProxy.init();
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
        Broadcast.BroadcastProxy.init();

        _removeLoadingDom();
        gotoLogin();

        await ResManager.loadMainRes();
        (_checkCanFirstGoToLobby()) && (gotoLobby());
    }

    export function gotoLogin(): void {
        MpwModel.unloadWar();
        RwModel.unloadWar();
        ScwModel.unloadWar();
        MeManager.unloadWar();
        StageManager.closeAllPanels();
        Login.LoginBackgroundPanel.show();
        Login.LoginPanel.show();
        Broadcast.BroadcastPanel.show();
    }
    export function gotoLobby(): void {
        _hasOnceWentToLobby = true;

        MpwModel.unloadWar();
        RwModel.unloadWar();
        ScwModel.unloadWar();
        MeManager.unloadWar();
        StageManager.closeAllPanels();
        Lobby.LobbyPanel.show();
        Lobby.LobbyTopPanel.show();
        Broadcast.BroadcastPanel.show();
    }
    export async function gotoMultiCustomWar(data: ProtoTypes.WarSerialization.ISerialWar): Promise<void> {
        RwModel.unloadWar();
        ScwModel.unloadWar();
        MeManager.unloadWar();
        await MpwModel.loadWar(data);

        StageManager.closeAllPanels();
        MultiPlayerWar.McwBackgroundPanel.show();
        MultiPlayerWar.McwTopPanel.show();
        MultiPlayerWar.McwWarPanel.show();
        MultiPlayerWar.McwTileBriefPanel.show();
        MultiPlayerWar.McwUnitBriefPanel.show();
        Broadcast.BroadcastPanel.show();
    }
    export async function gotoReplay(warData: Uint8Array, replayId: number): Promise<void> {
        MpwModel.unloadWar();
        ScwModel.unloadWar();
        MeManager.unloadWar();
        await RwModel.loadWar(warData, replayId);

        StageManager.closeAllPanels();
        ReplayWar.RwBackgroundPanel.show();
        ReplayWar.RwTopPanel.show();
        ReplayWar.RwWarPanel.show();
        ReplayWar.RwTileBriefPanel.show();
        ReplayWar.RwUnitBriefPanel.show();
        Broadcast.BroadcastPanel.show();
    }
    export async function gotoSingleCustomWar({ warData, slotIndex, slotComment }: {
        warData     : ProtoTypes.WarSerialization.ISerialWar;
        slotIndex   : number;
        slotComment : string;
    }): Promise<void> {
        MpwModel.unloadWar();
        RwModel.unloadWar();
        MeManager.unloadWar();
        await ScwModel.loadWar({ warData, slotIndex, slotComment });

        StageManager.closeAllPanels();
        SingleCustomWar.ScwBackgroundPanel.show();
        SingleCustomWar.ScwTopPanel.show();
        SingleCustomWar.ScwWarPanel.show();
        SingleCustomWar.ScwTileBriefPanel.show();
        SingleCustomWar.ScwUnitBriefPanel.show();
        Broadcast.BroadcastPanel.show();
    }
    export async function gotoMapEditor(mapRawData: ProtoTypes.Map.IMapRawData, slotIndex: number, isReview: boolean): Promise<void> {
        MpwModel.unloadWar();
        ScwModel.unloadWar();
        RwModel.unloadWar();
        await MeManager.loadWar(mapRawData, slotIndex, isReview);

        StageManager.closeAllPanels();
        MapEditor.MeBackgroundPanel.show();
        MapEditor.MeTopPanel.show();
        MapEditor.MeWarPanel.show();
        MapEditor.MeTileBriefPanel.show();
        MapEditor.MeUnitBriefPanel.show();
        Broadcast.BroadcastPanel.show();
    }

    export function gotoRmrMyWarListPanel(): void {
        MpwModel.unloadWar();
        RwModel.unloadWar();
        ScwModel.unloadWar();
        MeManager.unloadWar();
        StageManager.closeAllPanels();
        Lobby.LobbyTopPanel.show();
        RankMatchRoom.RmrMyWarListPanel.show();
        Broadcast.BroadcastPanel.show();
    }
    export function gotoMcrMyWarListPanel(): void {
        MpwModel.unloadWar();
        RwModel.unloadWar();
        ScwModel.unloadWar();
        MeManager.unloadWar();
        StageManager.closeAllPanels();
        Lobby.LobbyTopPanel.show();
        MultiCustomRoom.McrMyWarListPanel.show();
        Broadcast.BroadcastPanel.show();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Callbacks.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    function _onNotifyNetworkConnected(e: egret.Event): void {
        const account   = UserModel.getSelfAccount();
        const password  = UserModel.getSelfPassword();
        if ((!UserModel.getIsLoggedIn())    &&
            (account != null)               &&
            (password != null)
        ) {
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

    function _onMsgUserLogin(e: egret.Event): void {
        if (_checkCanFirstGoToLobby()) {
            gotoLobby();
        } else {
            const mcwWar = MpwModel.getWar();
            if (mcwWar) {
                MpwProxy.reqMcwCommonSyncWar(mcwWar, Types.SyncWarRequestType.ReconnectionRequest);
            }
        }
    }

    function _onMsgUserLogout(e: egret.Event): void {
        _hasOnceWentToLobby = false;
        UserModel.clearLoginInfo();
        gotoLogin();
    }

    function _onMsgMpwCommonContinueWar(e: egret.Event): void {
        const data = e.data as ProtoTypes.NetMessage.MsgMpwCommonContinueWar.IS;
        gotoMultiCustomWar(data.war);
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
