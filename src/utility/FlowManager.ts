
import { NetMessageCodes }          from "../network/NetMessageCodes";
import { CommonAlertPanel }         from "../modules/common/view/CommonAlertPanel";
import { CcwMyWarListPanel }        from "../modules/coopCustomWar/view/CcwMyWarListPanel";
import { LobbyBackgroundPanel }     from "../modules/lobby/view/LobbyBackgroundPanel";
import { LobbyBottomPanel }         from "../modules/lobby/view/LobbyBottomPanel";
import { LobbyPanel }               from "../modules/lobby/view/LobbyPanel";
import { LobbyTopPanel }            from "../modules/lobby/view/LobbyTopPanel";
import { LoginBackgroundPanel }     from "../modules/login/view/LoginBackgroundPanel";
import { LoginPanel }               from "../modules/login/view/LoginPanel";
import { BwBackgroundPanel }        from "../modules/baseWar/view/BwBackgroundPanel";
import { BwTileBriefPanel }         from "../modules/baseWar/view/BwTileBriefPanel";
import { BwUnitBriefPanel }         from "../modules/baseWar/view/BwUnitBriefPanel";
import { BwWarPanel }               from "../modules/baseWar/view/BwWarPanel";
import { BroadcastPanel }           from "../modules/broadcast/view/BroadcastPanel";
import { MeTopPanel }               from "../modules/mapEditor/view/MeTopPanel";
import { McwMyWarListPanel }        from "../modules/multiCustomWar/view/McwMyWarListPanel";
import { MfwMyWarListPanel }        from "../modules/multiFreeWar/view/MfwMyWarListPanel";
import { MrwMyWarListPanel }        from "../modules/multiRankWar/view/MrwMyWarListPanel";
import { MpwTopPanel }              from "../modules/multiPlayerWar/view/MpwTopPanel";
import { RwTopPanel }               from "../modules/replayWar/view/RwTopPanel";
import { SpwTopPanel }              from "../modules/singlePlayerWar/view/SpwTopPanel";
import { ClientErrorCode }          from "./ClientErrorCode";
import { LangTextType }             from "./LangTextType";
import { Notify }                   from "./Notify";
import { NotifyType }               from "./NotifyType";
import { BroadcastProxy }           from "../modules/broadcast/model/BroadcastProxy";
import { Types }                    from "./Types";
import { Logger }                   from "./Logger";
import * as ChangeLogProxy          from "../modules/changeLog/model/ChangeLogProxy";
import * as ChatProxy               from "../modules/chat/model/ChatProxy";
import * as CommonModel             from "../modules/common/model/CommonModel";
import * as CommonProxy             from "../modules/common/model/CommonProxy";
import * as CcrProxy                from "../modules/coopCustomRoom/model/CcrProxy";
import * as MeModel                 from "../modules/mapEditor/model/MeModel";
import * as MeProxy                 from "../modules/mapEditor/model/MeProxy";
import * as McrProxy                from "../modules/multiCustomRoom/model/McrProxy";
import * as MfrProxy                from "../modules/multiFreeRoom/model/MfrProxy";
import * as MpwModel                from "../modules/multiPlayerWar/model/MpwModel";
import * as MpwProxy                from "../modules/multiPlayerWar/model/MpwProxy";
import * as MrrProxy                from "../modules/multiRankRoom/model/MrrProxy";
import * as RwModel                 from "../modules/replayWar/model/RwModel";
import * as RwProxy                 from "../modules/replayWar/model/RwProxy";
import * as ScrModel                from "../modules/singleCustomRoom/model/ScrModel";
import * as SpmModel                from "../modules/singlePlayerMode/model/SpmModel";
import * as SpmProxy                from "../modules/singlePlayerMode/model/SpmProxy";
import * as SpwModel                from "../modules/singlePlayerWar/model/SpwModel";
import * as TimeModel               from "../modules/time/model/TimeModel";
import * as UserModel               from "../modules/user/model/UserModel";
import * as UserProxy               from "../modules/user/model/UserProxy";
import * as WarMapModel             from "../modules/warMap/model/WarMapModel";
import * as WarMapProxy             from "../modules/warMap/model/WarMapProxy";
import * as NetManager              from "../network/NetManager";
import * as CompatibilityHelper     from "./CompatibilityHelper";
import * as ConfigManager           from "./ConfigManager";
import * as Lang                    from "./Lang";
import * as LocalStorage            from "./LocalStorage";
import * as NoSleepManager          from "./NoSleepManager";
import * as ProtoManager            from "./ProtoManager";
import * as ProtoTypes              from "./ProtoTypes";
import * as ResManager              from "./ResManager";
import * as SoundManager            from "./SoundManager";
import * as StageManager            from "./StageManager";

export namespace FlowManager {
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
        CompatibilityHelper.init();
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
        ScrModel.init();
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
        LoginBackgroundPanel.show();
        LoginPanel.show();
        BroadcastPanel.show();

        SoundManager.playBgm(Types.BgmCode.Lobby01);
    }
    export function gotoLobby(): void {
        _hasOnceWentToLobby = true;

        MpwModel.unloadWar();
        RwModel.unloadWar();
        SpwModel.unloadWar();
        MeModel.unloadWar();
        StageManager.closeAllPanels();
        LobbyBackgroundPanel.show();
        LobbyPanel.show();
        LobbyTopPanel.show();
        LobbyBottomPanel.show();
        BroadcastPanel.show();

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
        BwBackgroundPanel.show();
        MpwTopPanel.show();
        BwWarPanel.show({ war });
        BwTileBriefPanel.show({ war });
        BwUnitBriefPanel.show({ war });
        BroadcastPanel.show();

        SoundManager.playRandomWarBgm();

        return ClientErrorCode.NoError;
    }
    export async function gotoReplayWar(warData: Uint8Array, replayId: number): Promise<void> {
        MpwModel.unloadWar();
        SpwModel.unloadWar();
        MeModel.unloadWar();
        const war = await RwModel.loadWar(warData, replayId);

        StageManager.closeAllPanels();
        BwBackgroundPanel.show();
        RwTopPanel.show();
        BwWarPanel.show({ war });
        BwTileBriefPanel.show({ war });
        BwUnitBriefPanel.show({ war });
        BroadcastPanel.show();

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
        BwBackgroundPanel.show();
        SpwTopPanel.show({ war });
        BwWarPanel.show({ war });
        BwTileBriefPanel.show({ war });
        BwUnitBriefPanel.show({ war });
        BroadcastPanel.show();

        SoundManager.playRandomWarBgm();

        await SpwModel.checkAndHandleAutoActionsAndRobotRecursively(war);
    }
    export async function gotoMapEditorWar(mapRawData: ProtoTypes.Map.IMapRawData, slotIndex: number, isReview: boolean): Promise<void> {
        MpwModel.unloadWar();
        SpwModel.unloadWar();
        RwModel.unloadWar();
        const war = await MeModel.loadWar(mapRawData, slotIndex, isReview);

        StageManager.closeAllPanels();
        BwBackgroundPanel.show();
        MeTopPanel.show();
        BwWarPanel.show({ war });
        BwTileBriefPanel.show({ war });
        BwUnitBriefPanel.show({ war });
        BroadcastPanel.show();

        SoundManager.playBgm(Types.BgmCode.MapEditor01);
    }

    export function gotoMrwMyWarListPanel(): void {
        MpwModel.unloadWar();
        RwModel.unloadWar();
        SpwModel.unloadWar();
        MeModel.unloadWar();
        StageManager.closeAllPanels();
        LobbyBackgroundPanel.show();
        MrwMyWarListPanel.show();
        BroadcastPanel.show();

        SoundManager.playBgm(Types.BgmCode.Lobby01);
    }
    export function gotoMcwMyWarListPanel(): void {
        MpwModel.unloadWar();
        RwModel.unloadWar();
        SpwModel.unloadWar();
        MeModel.unloadWar();
        StageManager.closeAllPanels();
        LobbyBackgroundPanel.show();
        McwMyWarListPanel.show();
        BroadcastPanel.show();

        SoundManager.playBgm(Types.BgmCode.Lobby01);
    }
    export function gotoMfwMyWarListPanel(): void {
        MpwModel.unloadWar();
        RwModel.unloadWar();
        SpwModel.unloadWar();
        MeModel.unloadWar();
        StageManager.closeAllPanels();
        LobbyBackgroundPanel.show();
        MfwMyWarListPanel.show();
        BroadcastPanel.show();

        SoundManager.playBgm(Types.BgmCode.Lobby01);
    }
    export function gotoCcwMyWarListPanel(): void {
        MpwModel.unloadWar();
        RwModel.unloadWar();
        SpwModel.unloadWar();
        MeModel.unloadWar();
        StageManager.closeAllPanels();
        LobbyBackgroundPanel.show();
        CcwMyWarListPanel.show();
        BroadcastPanel.show();

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
        CommonAlertPanel.show({
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
