
import { TwnsBwBackgroundPanel }    from "../modules/baseWar/view/BwBackgroundPanel";
import { BwTileBriefPanel }         from "../modules/baseWar/view/BwTileBriefPanel";
import { BwUnitBriefPanel }         from "../modules/baseWar/view/BwUnitBriefPanel";
import { BwWarPanel }               from "../modules/baseWar/view/BwWarPanel";
import { BroadcastProxy }           from "../modules/broadcast/model/BroadcastProxy";
import { TwnsBroadcastPanel }       from "../modules/broadcast/view/BroadcastPanel";
import { ChangeLogProxy }           from "../modules/changeLog/model/ChangeLogProxy";
import { ChatProxy }                from "../modules/chat/model/ChatProxy";
import { CommonModel }              from "../modules/common/model/CommonModel";
import { CommonProxy }              from "../modules/common/model/CommonProxy";
import { TwnsCommonAlertPanel }     from "../modules/common/view/CommonAlertPanel";
import { CcrProxy }                 from "../modules/coopCustomRoom/model/CcrProxy";
import { TwnsCcwMyWarListPanel }    from "../modules/coopCustomWar/view/CcwMyWarListPanel";
import { TwnsLobbyBackgroundPanel } from "../modules/lobby/view/LobbyBackgroundPanel";
import { TwnsLobbyBottomPanel }     from "../modules/lobby/view/LobbyBottomPanel";
import { TwnsLobbyPanel }           from "../modules/lobby/view/LobbyPanel";
import { TwnsLobbyTopPanel }        from "../modules/lobby/view/LobbyTopPanel";
import { TwnsLoginBackgroundPanel } from "../modules/login/view/LoginBackgroundPanel";
import { TwnsLoginPanel }           from "../modules/login/view/LoginPanel";
import { MeModel }                  from "../modules/mapEditor/model/MeModel";
import { MeProxy }                  from "../modules/mapEditor/model/MeProxy";
import { TwnsMeTopPanel }           from "../modules/mapEditor/view/MeTopPanel";
import { McrProxy }                 from "../modules/multiCustomRoom/model/McrProxy";
import { TwnsMcwMyWarListPanel }    from "../modules/multiCustomWar/view/McwMyWarListPanel";
import { MfrProxy }                 from "../modules/multiFreeRoom/model/MfrProxy";
import { TwnsMfwMyWarListPanel }    from "../modules/multiFreeWar/view/MfwMyWarListPanel";
import { MpwModel }                 from "../modules/multiPlayerWar/model/MpwModel";
import { MpwProxy }                 from "../modules/multiPlayerWar/model/MpwProxy";
import { TwnsMpwTopPanel }          from "../modules/multiPlayerWar/view/MpwTopPanel";
import { MrrProxy }                 from "../modules/multiRankRoom/model/MrrProxy";
import { TwnsMrwMyWarListPanel }    from "../modules/multiRankWar/view/MrwMyWarListPanel";
import { RwModel }                  from "../modules/replayWar/model/RwModel";
import { RwProxy }                  from "../modules/replayWar/model/RwProxy";
import { TwnsRwTopPanel }           from "../modules/replayWar/view/RwTopPanel";
import { ScrCreateModel }           from "../modules/singleCustomRoom/model/ScrCreateModel";
import { SpmModel }                 from "../modules/singlePlayerMode/model/SpmModel";
import { SpmProxy }                 from "../modules/singlePlayerMode/model/SpmProxy";
import { SpwModel }                 from "../modules/singlePlayerWar/model/SpwModel";
import { TwnsSpwTopPanel }          from "../modules/singlePlayerWar/view/SpwTopPanel";
import { TimeModel }                from "../modules/time/model/TimeModel";
import { UserModel }                from "../modules/user/model/UserModel";
import { UserProxy }                from "../modules/user/model/UserProxy";
import { WarMapModel }              from "../modules/warMap/model/WarMapModel";
import { WarMapProxy }              from "../modules/warMap/model/WarMapProxy";
import { TwnsClientErrorCode }      from "./ClientErrorCode";
import { CompatibilityHelpers }     from "./CompatibilityHelpers";
import { ConfigManager }            from "./ConfigManager";
import { Lang }                     from "./lang/Lang";
import { TwnsLangTextType }         from "./lang/LangTextType";
import { LocalStorage }             from "./LocalStorage";
import { Logger }                   from "./Logger";
import { NetManager }               from "./network/NetManager";
import { TwnsNetMessageCodes }      from "./network/NetMessageCodes";
import { NoSleepManager }           from "./NoSleepManager";
import { Notify }                   from "./notify/Notify";
import { TwnsNotifyType }           from "./notify/NotifyType";
import { ProtoManager }             from "./proto/ProtoManager";
import { ProtoTypes }               from "./proto/ProtoTypes";
import { ResManager }               from "./res/ResManager";
import { SoundManager }             from "./SoundManager";
import { StageManager }             from "./StageManager";
import { Types }                    from "./Types";

export namespace FlowManager {
    import ClientErrorCode  = TwnsClientErrorCode.ClientErrorCode;
    import LangTextType     = TwnsLangTextType.LangTextType;
    import NotifyType       = TwnsNotifyType.NotifyType;
    import NetMessageCodes  = TwnsNetMessageCodes.NetMessageCodes;

    const _NET_EVENTS = [
        { msgCode: NetMessageCodes.MsgCommonServerDisconnect, callback: _onMsgCommonServerDisconnect },
    ];
    const _NOTIFY_EVENTS = [
        { type: NotifyType.ConfigLoaded,               callback: _onNotifyConfigLoaded },
        { type: NotifyType.NetworkConnected,           callback: _onNotifyNetworkConnected, },
        { type: NotifyType.MsgUserLogin,               callback: _onMsgUserLogin },
        { type: NotifyType.MsgUserLogout,              callback: _onMsgUserLogout },
        { type: NotifyType.MsgMpwCommonContinueWar,    callback: _onMsgMpwCommonContinueWar },
    ];

    let _hasOnceWentToLobby = false;

    export async function startGame(stage: egret.Stage): Promise<void> {
        CompatibilityHelpers.init();
        NetManager.addListeners(_NET_EVENTS, undefined);
        Notify.addEventListeners(_NOTIFY_EVENTS, undefined);
        StageManager.init(stage);
        await Promise.all([ResManager.init(), ProtoManager.init()]);
        StageManager.setStageScale(LocalStorage.getStageScale());

        Lang.init();
        NoSleepManager.init();
        ConfigManager.init();
        NetManager.init();
        MpwProxy.init();
        MpwModel.init();
        TimeModel.init();
        UserProxy.init();
        UserModel.init();
        WarMapProxy.init();
        WarMapModel.init();
        McrProxy.init();
        MrrProxy.init();
        MfrProxy.init();
        CcrProxy.init();
        RwProxy.init();
        RwModel.init();
        SpmProxy.init();
        SpmModel.init();
        ScrCreateModel.init();
        SpwModel.init();
        MeProxy.init();
        MeModel.init();
        ChatProxy.init();
        CommonProxy.init();
        CommonModel.init();
        BroadcastProxy.init();
        ChangeLogProxy.init();

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
        TwnsLoginBackgroundPanel.LoginBackgroundPanel.show();
        TwnsLoginPanel.LoginPanel.show();
        TwnsBroadcastPanel.BroadcastPanel.show();

        SoundManager.playBgm(Types.BgmCode.Lobby01);
    }
    export function gotoLobby(): void {
        _hasOnceWentToLobby = true;

        MpwModel.unloadWar();
        RwModel.unloadWar();
        SpwModel.unloadWar();
        MeModel.unloadWar();
        StageManager.closeAllPanels();
        TwnsLobbyBackgroundPanel.LobbyBackgroundPanel.show();
        TwnsLobbyPanel.LobbyPanel.show();
        TwnsLobbyTopPanel.LobbyTopPanel.show();
        TwnsLobbyBottomPanel.LobbyBottomPanel.show();
        TwnsBroadcastPanel.BroadcastPanel.show();

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
        TwnsBwBackgroundPanel.BwBackgroundPanel.show();
        TwnsMpwTopPanel.MpwTopPanel.show();
        BwWarPanel.BwWarPanel.show({ war });
        BwTileBriefPanel.BwTileBriefPanel.show({ war });
        BwUnitBriefPanel.BwUnitBriefPanel.show({ war });
        TwnsBroadcastPanel.BroadcastPanel.show();

        SoundManager.playRandomWarBgm();

        return ClientErrorCode.NoError;
    }
    export async function gotoReplayWar(warData: Uint8Array, replayId: number): Promise<void> {
        MpwModel.unloadWar();
        SpwModel.unloadWar();
        MeModel.unloadWar();
        const war = await RwModel.loadWar(warData, replayId);

        StageManager.closeAllPanels();
        TwnsBwBackgroundPanel.BwBackgroundPanel.show();
        TwnsRwTopPanel.RwTopPanel.show();
        BwWarPanel.BwWarPanel.show({ war });
        BwTileBriefPanel.BwTileBriefPanel.show({ war });
        BwUnitBriefPanel.BwUnitBriefPanel.show({ war });
        TwnsBroadcastPanel.BroadcastPanel.show();

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
        TwnsBwBackgroundPanel.BwBackgroundPanel.show();
        TwnsSpwTopPanel.SpwTopPanel.show({ war });
        BwWarPanel.BwWarPanel.show({ war });
        BwTileBriefPanel.BwTileBriefPanel.show({ war });
        BwUnitBriefPanel.BwUnitBriefPanel.show({ war });
        TwnsBroadcastPanel.BroadcastPanel.show();

        SoundManager.playRandomWarBgm();

        await SpwModel.checkAndHandleAutoActionsAndRobotRecursively(war);
    }
    export async function gotoMapEditorWar(mapRawData: ProtoTypes.Map.IMapRawData, slotIndex: number, isReview: boolean): Promise<void> {
        MpwModel.unloadWar();
        SpwModel.unloadWar();
        RwModel.unloadWar();
        const war = await MeModel.loadWar(mapRawData, slotIndex, isReview);

        StageManager.closeAllPanels();
        TwnsBwBackgroundPanel.BwBackgroundPanel.show();
        TwnsMeTopPanel.MeTopPanel.show();
        BwWarPanel.BwWarPanel.show({ war });
        BwTileBriefPanel.BwTileBriefPanel.show({ war });
        BwUnitBriefPanel.BwUnitBriefPanel.show({ war });
        TwnsBroadcastPanel.BroadcastPanel.show();

        SoundManager.playBgm(Types.BgmCode.MapEditor01);
    }

    export function gotoMrwMyWarListPanel(): void {
        MpwModel.unloadWar();
        RwModel.unloadWar();
        SpwModel.unloadWar();
        MeModel.unloadWar();
        StageManager.closeAllPanels();
        TwnsLobbyBackgroundPanel.LobbyBackgroundPanel.show();
        TwnsMrwMyWarListPanel.MrwMyWarListPanel.show();
        TwnsBroadcastPanel.BroadcastPanel.show();

        SoundManager.playBgm(Types.BgmCode.Lobby01);
    }
    export function gotoMcwMyWarListPanel(): void {
        MpwModel.unloadWar();
        RwModel.unloadWar();
        SpwModel.unloadWar();
        MeModel.unloadWar();
        StageManager.closeAllPanels();
        TwnsLobbyBackgroundPanel.LobbyBackgroundPanel.show();
        TwnsMcwMyWarListPanel.McwMyWarListPanel.show();
        TwnsBroadcastPanel.BroadcastPanel.show();

        SoundManager.playBgm(Types.BgmCode.Lobby01);
    }
    export function gotoMfwMyWarListPanel(): void {
        MpwModel.unloadWar();
        RwModel.unloadWar();
        SpwModel.unloadWar();
        MeModel.unloadWar();
        StageManager.closeAllPanels();
        TwnsLobbyBackgroundPanel.LobbyBackgroundPanel.show();
        TwnsMfwMyWarListPanel.MfwMyWarListPanel.show();
        TwnsBroadcastPanel.BroadcastPanel.show();

        SoundManager.playBgm(Types.BgmCode.Lobby01);
    }
    export function gotoCcwMyWarListPanel(): void {
        MpwModel.unloadWar();
        RwModel.unloadWar();
        SpwModel.unloadWar();
        MeModel.unloadWar();
        StageManager.closeAllPanels();
        TwnsLobbyBackgroundPanel.LobbyBackgroundPanel.show();
        TwnsCcwMyWarListPanel.CcwMyWarListPanel.show();
        TwnsBroadcastPanel.BroadcastPanel.show();

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
            UserProxy.reqLogin(account, password, true);
        }
    }

    function _onMsgCommonServerDisconnect(): void {
        _hasOnceWentToLobby = false;
        UserModel.clearLoginInfo();
        gotoLogin();

        const title     = Lang.getText(LangTextType.B0025);
        const content   = Lang.getText(LangTextType.A0020);
        if ((title == null) || (content == null)) {
            Logger.error(`FlowManager._onMsgCommonServerDisconnect() empty title/content.`);
            return;
        }
        TwnsCommonAlertPanel.CommonAlertPanel.show({
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
            && (UserModel.getIsLoggedIn())
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
