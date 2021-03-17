
namespace TinyWars.Utility.FlowManager {
    import UserModel        = User.UserModel;
    import MpwProxy         = MultiPlayerWar.MpwProxy;
    import MpwModel         = MultiPlayerWar.MpwModel;
    import ScwModel         = SingleCustomWar.ScwModel;
    import RwModel          = ReplayWar.RwModel;
    import MeModel          = MapEditor.MeModel;
    import CommonConstants  = Utility.CommonConstants;

    const _NET_EVENTS = [
        { msgCode: Network.Codes.MsgCommonServerDisconnect, callback: _onMsgCommonServerDisconnect },
    ];
    const _NOTIFY_EVENTS = [
        { type: Notify.Type.ConfigLoaded,               callback: _onNotifyConfigLoaded },
        { type: Notify.Type.NetworkConnected,           callback: _onNotifyNetworkConnected, },
        { type: Notify.Type.MsgUserLogin,               callback: _onMsgUserLogin },
        { type: Notify.Type.MsgUserLogout,              callback: _onMsgUserLogout },
        { type: Notify.Type.MsgMpwCommonContinueWar,    callback: _onMsgMpwCommonContinueWar },
    ];

    let _hasOnceWentToLobby = false;

    export async function startGame(stage: egret.Stage): Promise<void> {
        _registerWindowOnError();
        _preventBrowserBack();

        Network.NetManager.addListeners(_NET_EVENTS, FlowManager);
        Notify.addEventListeners(_NOTIFY_EVENTS, FlowManager);
        Utility.StageManager.init(stage);
        await Promise.all([ResManager.init(), ProtoManager.init()]);

        Lang.init();
        NoSleepManager.init();
        ConfigManager.init();
        Network.NetManager.init();
        MpwProxy.init();
        MpwModel.init();
        Time.TimeModel.init();
        User.UserProxy.init();
        User.UserModel.init();
        WarMap.WarMapProxy.init();
        WarMap.WarMapModel.init();
        MultiCustomRoom.McrProxy.init();
        MultiRankRoom.MrrProxy.init();
        ReplayWar.RwProxy.init();
        RwModel.init();
        SingleCustomRoom.ScrProxy.init();
        SingleCustomRoom.ScrModel.init();
        ScwModel.init();
        MapEditor.MeProxy.init();
        MeModel.init();
        Chat.ChatProxy.init();
        Common.CommonProxy.init();
        Common.CommonModel.init();
        Broadcast.BroadcastProxy.init();
        ChangeLog.ChangeLogProxy.init();

        _removeLoadingDom();
        gotoLogin();

        await ResManager.loadMainRes();
        (_checkCanFirstGoToLobby()) && (gotoLobby());
    }

    export function gotoLogin(): void {
        MpwModel.unloadWar();
        RwModel.unloadWar();
        ScwModel.unloadWar();
        MeModel.unloadWar();
        StageManager.closeAllPanels();
        Login.LoginBackgroundPanel.show();
        Login.LoginPanel.show();
        Broadcast.BroadcastPanel.show();

        SoundManager.playBgm(SoundManager.BgmCode.Lobby01);
    }
    export function gotoLobby(): void {
        _hasOnceWentToLobby = true;

        MpwModel.unloadWar();
        RwModel.unloadWar();
        ScwModel.unloadWar();
        MeModel.unloadWar();
        StageManager.closeAllPanels();
        Lobby.LobbyBackgroundPanel.show();
        Lobby.LobbyPanel.show();
        Lobby.LobbyTopPanel.show();
        Lobby.LobbyBottomPanel.show();
        Broadcast.BroadcastPanel.show();

        SoundManager.playBgm(SoundManager.BgmCode.Lobby01);
    }

    export async function gotoMultiPlayerWar(data: ProtoTypes.WarSerialization.ISerialWar): Promise<void> {
        RwModel.unloadWar();
        ScwModel.unloadWar();
        MeModel.unloadWar();
        const war = await MpwModel.loadWar(data);

        StageManager.closeAllPanels();
        BaseWar.BwBackgroundPanel.show();
        MultiPlayerWar.MpwTopPanel.show();
        BaseWar.BwWarPanel.show({ war });
        BaseWar.BwTileBriefPanel.show({ war });
        BaseWar.BwUnitBriefPanel.show({ war });
        Broadcast.BroadcastPanel.show();

        SoundManager.playRandomWarBgm();
    }
    export async function gotoReplayWar(warData: Uint8Array, replayId: number): Promise<void> {
        MpwModel.unloadWar();
        ScwModel.unloadWar();
        MeModel.unloadWar();
        const war = await RwModel.loadWar(warData, replayId);

        StageManager.closeAllPanels();
        BaseWar.BwBackgroundPanel.show();
        ReplayWar.RwTopPanel.show();
        BaseWar.BwWarPanel.show({ war });
        BaseWar.BwTileBriefPanel.show({ war });
        BaseWar.BwUnitBriefPanel.show({ war });
        Broadcast.BroadcastPanel.show();

        SoundManager.playRandomWarBgm();
    }
    export async function gotoSingleCustomWar({ warData, slotIndex, slotComment }: {
        warData     : ProtoTypes.WarSerialization.ISerialWar;
        slotIndex   : number;
        slotComment : string;
    }): Promise<void> {
        MpwModel.unloadWar();
        RwModel.unloadWar();
        MeModel.unloadWar();
        const war = await ScwModel.loadWar({ warData, slotIndex, slotComment });

        StageManager.closeAllPanels();
        BaseWar.BwBackgroundPanel.show();
        SingleCustomWar.ScwTopPanel.show();
        BaseWar.BwWarPanel.show({ war });
        BaseWar.BwTileBriefPanel.show({ war });
        BaseWar.BwUnitBriefPanel.show({ war });
        Broadcast.BroadcastPanel.show();

        SoundManager.playRandomWarBgm();
    }
    export async function gotoMapEditorWar(mapRawData: ProtoTypes.Map.IMapRawData, slotIndex: number, isReview: boolean): Promise<void> {
        MpwModel.unloadWar();
        ScwModel.unloadWar();
        RwModel.unloadWar();
        const war = await MeModel.loadWar(mapRawData, slotIndex, isReview);

        StageManager.closeAllPanels();
        BaseWar.BwBackgroundPanel.show();
        MapEditor.MeTopPanel.show();
        BaseWar.BwWarPanel.show({ war });
        BaseWar.BwTileBriefPanel.show({ war });
        BaseWar.BwUnitBriefPanel.show({ war });
        Broadcast.BroadcastPanel.show();

        SoundManager.playBgm(SoundManager.BgmCode.MapEditor01);
    }

    export function gotoMrrMyWarListPanel(): void {
        MpwModel.unloadWar();
        RwModel.unloadWar();
        ScwModel.unloadWar();
        MeModel.unloadWar();
        StageManager.closeAllPanels();
        Lobby.LobbyBackgroundPanel.show();
        Lobby.LobbyTopPanel.show();
        MultiRankRoom.MrrMyWarListPanel.show();
        Broadcast.BroadcastPanel.show();

        SoundManager.playBgm(SoundManager.BgmCode.Lobby01);
    }
    export function gotoMcrMyWarListPanel(): void {
        MpwModel.unloadWar();
        RwModel.unloadWar();
        ScwModel.unloadWar();
        MeModel.unloadWar();
        StageManager.closeAllPanels();
        Lobby.LobbyBackgroundPanel.show();
        Lobby.LobbyTopPanel.show();
        MultiCustomRoom.McrMyWarListPanel.show();
        Broadcast.BroadcastPanel.show();

        SoundManager.playBgm(SoundManager.BgmCode.Lobby01);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Callbacks.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    function _onNotifyConfigLoaded(e: egret.Event): void {
        if (_checkCanFirstGoToLobby()) {
            gotoLobby();
        }
    }

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
        gotoMultiPlayerWar(data.war);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Other private functions.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    function _checkCanFirstGoToLobby(): boolean {
        return (!_hasOnceWentToLobby)
            && (User.UserModel.getIsLoggedIn())
            && (ResManager.checkIsLoadedMainResource())
            && (!!ConfigManager.getCachedConfig(ConfigManager.getLatestFormalVersion()));
    }

    function _removeLoadingDom(): void {
        const document = window.document;
        if (document) {
            const outLoadingLayer = document.getElementById("outLoadingLayer");
            (outLoadingLayer) && (document.body.removeChild(outLoadingLayer));
        }
    }

    function _registerWindowOnError(): void {
        window.onerror = (message, filename, row, col, err) => {
            const content = `${message}\n\n${err ? err.stack : "No available call stack."}`;
            Common.CommonErrorPanel.show({
                content,
            });
            Chat.ChatProxy.reqChatAddMessage(
                content.substr(0, CommonConstants.ChatContentMaxLength),
                Types.ChatMessageToCategory.Private,
                CommonConstants.AdminUserId,
            );
        };
    }

    function _preventBrowserBack(): void {
        const state = {
            url: window.location.href,
        };
        try {
            if (window.history) {
                window.history.pushState(state, "", window.location.href);
            }
        } catch (e) {
            Logger.error(e);
        }

        if (window.addEventListener) {
            window.addEventListener("popstate", (e) => {
                FloatText.show(Lang.getText(Lang.Type.A0194));
            }, false);
        }
    }
}
