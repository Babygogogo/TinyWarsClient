
// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace TinyWars.Utility.FlowManager {
    import UserModel    = User.UserModel;
    import MpwProxy     = MultiPlayerWar.MpwProxy;
    import MpwModel     = MultiPlayerWar.MpwModel;
    import SpwModel     = SinglePlayerWar.SpwModel;
    import RwModel      = ReplayWar.RwModel;
    import MeModel      = MapEditor.MeModel;

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
        CompatibilityHelper.init();
        Network.NetManager.addListeners(_NET_EVENTS, FlowManager);
        Notify.addEventListeners(_NOTIFY_EVENTS, FlowManager);
        StageManager.init(stage);
        await Promise.all([ResManager.init(), ProtoManager.init()]);
        StageManager.setStageScale(LocalStorage.getStageScale());

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
        MultiFreeRoom.MfrProxy.init();
        CoopCustomRoom.CcrProxy.init();
        ReplayWar.RwProxy.init();
        RwModel.init();
        SinglePlayerMode.SpmProxy.init();
        SinglePlayerMode.SpmModel.init();
        SingleCustomRoom.ScrModel.init();
        SpwModel.init();
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
        SpwModel.unloadWar();
        MeModel.unloadWar();
        StageManager.closeAllPanels();
        Login.LoginBackgroundPanel.show();
        Login.LoginPanel.show();
        Broadcast.BroadcastPanel.show();

        SoundManager.playBgm(Types.BgmCode.Lobby01);
    }
    export function gotoLobby(): void {
        _hasOnceWentToLobby = true;

        MpwModel.unloadWar();
        RwModel.unloadWar();
        SpwModel.unloadWar();
        MeModel.unloadWar();
        StageManager.closeAllPanels();
        Lobby.LobbyBackgroundPanel.show();
        Lobby.LobbyPanel.show();
        Lobby.LobbyTopPanel.show();
        Lobby.LobbyBottomPanel.show();
        Broadcast.BroadcastPanel.show();

        SoundManager.playBgm(Types.BgmCode.Lobby01);
    }

    export async function gotoMultiPlayerWar(data: ProtoTypes.WarSerialization.ISerialWar): Promise<ClientErrorCode> {
        RwModel.unloadWar();
        SpwModel.unloadWar();
        MeModel.unloadWar();
        const { errorCode, war } = await MpwModel.loadWar(data);
        if (errorCode) {
            return errorCode;
        } else if (war == null) {
            return ClientErrorCode.FlowManager_GotoMultiPlayerWar_00;
        }

        StageManager.closeAllPanels();
        BaseWar.BwBackgroundPanel.show();
        MultiPlayerWar.MpwTopPanel.show();
        BaseWar.BwWarPanel.show({ war });
        BaseWar.BwTileBriefPanel.show({ war });
        BaseWar.BwUnitBriefPanel.show({ war });
        Broadcast.BroadcastPanel.show();

        SoundManager.playRandomWarBgm();

        return ClientErrorCode.NoError;
    }
    export async function gotoReplayWar(warData: Uint8Array, replayId: number): Promise<void> {
        MpwModel.unloadWar();
        SpwModel.unloadWar();
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
    export async function gotoSinglePlayerWar({ warData, slotIndex, slotExtraData }: {
        slotIndex       : number;
        slotExtraData   : ProtoTypes.SinglePlayerMode.ISpmWarSaveSlotExtraData;
        warData         : ProtoTypes.WarSerialization.ISerialWar;
    }): Promise<void> {
        MpwModel.unloadWar();
        RwModel.unloadWar();
        MeModel.unloadWar();
        const war = await SpwModel.loadWar({ warData, slotIndex, slotExtraData });

        StageManager.closeAllPanels();
        BaseWar.BwBackgroundPanel.show();
        SinglePlayerWar.SpwTopPanel.show();
        BaseWar.BwWarPanel.show({ war });
        BaseWar.BwTileBriefPanel.show({ war });
        BaseWar.BwUnitBriefPanel.show({ war });
        Broadcast.BroadcastPanel.show();

        SoundManager.playRandomWarBgm();

        await SpwModel.checkAndHandleAutoActionsAndRobotRecursively(war);
    }
    export async function gotoMapEditorWar(mapRawData: ProtoTypes.Map.IMapRawData, slotIndex: number, isReview: boolean): Promise<void> {
        MpwModel.unloadWar();
        SpwModel.unloadWar();
        RwModel.unloadWar();
        const war = await MeModel.loadWar(mapRawData, slotIndex, isReview);

        StageManager.closeAllPanels();
        BaseWar.BwBackgroundPanel.show();
        MapEditor.MeTopPanel.show();
        BaseWar.BwWarPanel.show({ war });
        BaseWar.BwTileBriefPanel.show({ war });
        BaseWar.BwUnitBriefPanel.show({ war });
        Broadcast.BroadcastPanel.show();

        SoundManager.playBgm(Types.BgmCode.MapEditor01);
    }

    export function gotoMrwMyWarListPanel(): void {
        MpwModel.unloadWar();
        RwModel.unloadWar();
        SpwModel.unloadWar();
        MeModel.unloadWar();
        StageManager.closeAllPanels();
        Lobby.LobbyBackgroundPanel.show();
        MultiRankWar.MrwMyWarListPanel.show();
        Broadcast.BroadcastPanel.show();

        SoundManager.playBgm(Types.BgmCode.Lobby01);
    }
    export function gotoMcwMyWarListPanel(): void {
        MpwModel.unloadWar();
        RwModel.unloadWar();
        SpwModel.unloadWar();
        MeModel.unloadWar();
        StageManager.closeAllPanels();
        Lobby.LobbyBackgroundPanel.show();
        MultiCustomWar.McwMyWarListPanel.show();
        Broadcast.BroadcastPanel.show();

        SoundManager.playBgm(Types.BgmCode.Lobby01);
    }
    export function gotoMfwMyWarListPanel(): void {
        MpwModel.unloadWar();
        RwModel.unloadWar();
        SpwModel.unloadWar();
        MeModel.unloadWar();
        StageManager.closeAllPanels();
        Lobby.LobbyBackgroundPanel.show();
        MultiFreeWar.MfwMyWarListPanel.show();
        Broadcast.BroadcastPanel.show();

        SoundManager.playBgm(Types.BgmCode.Lobby01);
    }
    export function gotoCcwMyWarListPanel(): void {
        MpwModel.unloadWar();
        RwModel.unloadWar();
        SpwModel.unloadWar();
        MeModel.unloadWar();
        StageManager.closeAllPanels();
        Lobby.LobbyBackgroundPanel.show();
        CoopCustomWar.CcwMyWarListPanel.show();
        Broadcast.BroadcastPanel.show();

        SoundManager.playBgm(Types.BgmCode.Lobby01);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Callbacks.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    function _onNotifyConfigLoaded(): void {
        if (_checkCanFirstGoToLobby()) {
            gotoLobby();
        }
    }

    function _onNotifyNetworkConnected(): void {
        const account   = UserModel.getSelfAccount();
        const password  = UserModel.getSelfPassword();
        if ((!UserModel.getIsLoggedIn())    &&
            (account != null)               &&
            (password != null)
        ) {
            User.UserProxy.reqLogin(account, password, true);
        }
    }

    function _onMsgCommonServerDisconnect(): void {
        _hasOnceWentToLobby = false;
        UserModel.clearLoginInfo();
        FlowManager.gotoLogin();

        const title     = Lang.getText(Lang.Type.B0025);
        const content   = Lang.getText(Lang.Type.A0020);
        if ((title == null) || (content == null)) {
            Logger.error(`FlowManager._onMsgCommonServerDisconnect() empty title/content.`);
            return;
        }
        Common.CommonAlertPanel.show({
            title,
            content,
        });
    }

    function _onMsgUserLogin(): void {
        if (_checkCanFirstGoToLobby()) {
            gotoLobby();
        } else {
            const mcwWar = MpwModel.getWar();
            if (mcwWar) {
                MpwProxy.reqMpwCommonSyncWar(mcwWar, Types.SyncWarRequestType.ReconnectionRequest);
            }
        }
    }

    function _onMsgUserLogout(): void {
        _hasOnceWentToLobby = false;
        UserModel.clearLoginInfo();
        gotoLogin();
    }

    function _onMsgMpwCommonContinueWar(e: egret.Event): void {
        const data      = e.data as ProtoTypes.NetMessage.MsgMpwCommonContinueWar.IS;
        const warData   = data.war;
        if (warData == null) {
            Logger.error(`FlowManager._onMsgMpwCommonContinueWar() empty warData.`);
            return;
        }

        gotoMultiPlayerWar(warData);
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
}
