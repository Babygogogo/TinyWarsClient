
// import TwnsBwBackgroundPanel        from "../../baseWar/view/BwBackgroundPanel";
// import TwnsBwTileBriefPanel         from "../../baseWar/view/BwTileBriefPanel";
// import TwnsBwUnitBriefPanel         from "../../baseWar/view/BwUnitBriefPanel";
// import TwnsBwWarPanel               from "../../baseWar/view/BwWarPanel";
// import BroadcastProxy               from "../../broadcast/model/BroadcastProxy";
// import TwnsBroadcastPanel           from "../../broadcast/view/BroadcastPanel";
// import ChangeLogProxy               from "../../changeLog/model/ChangeLogProxy";
// import ChatProxy                    from "../../chat/model/ChatProxy";
// import CommonModel                  from "../../common/model/CommonModel";
// import CommonProxy                  from "../../common/model/CommonProxy";
// import TwnsCommonAlertPanel         from "../../common/view/CommonAlertPanel";
// import CcrProxy                     from "../../coopCustomRoom/model/CcrProxy";
// import TwnsCcwMyWarListPanel        from "../../coopCustomWar/view/CcwMyWarListPanel";
// import TwnsLobbyBackgroundPanel     from "../../lobby/view/LobbyBackgroundPanel";
// import TwnsLobbyBottomPanel         from "../../lobby/view/LobbyBottomPanel";
// import TwnsLobbyPanel               from "../../lobby/view/LobbyPanel";
// import TwnsLobbyTopPanel            from "../../lobby/view/LobbyTopPanel";
// import TwnsLobbyTopRightPanel       from "../../lobby/view/LobbyTopRightPanel";
// import MeModel                      from "../../mapEditor/model/MeModel";
// import MeProxy                      from "../../mapEditor/model/MeProxy";
// import TwnsMeMapListPanel           from "../../mapEditor/view/MeMapListPanel";
// import TwnsMeTopPanel               from "../../mapEditor/view/MeTopPanel";
// import McrProxy                     from "../../multiCustomRoom/model/McrProxy";
// import TwnsMcwMyWarListPanel        from "../../multiCustomWar/view/McwMyWarListPanel";
// import MfrCreateModel               from "../../multiFreeRoom/model/MfrCreateModel";
// import MfrProxy                     from "../../multiFreeRoom/model/MfrProxy";
// import TwnsMfrCreateSettingsPanel   from "../../multiFreeRoom/view/MfrCreateSettingsPanel";
// import TwnsMfwMyWarListPanel        from "../../multiFreeWar/view/MfwMyWarListPanel";
// import MpwModel                     from "../../multiPlayerWar/model/MpwModel";
// import MpwProxy                     from "../../multiPlayerWar/model/MpwProxy";
// import TwnsMpwSidePanel             from "../../multiPlayerWar/view/MpwSidePanel";
// import TwnsMpwTopPanel              from "../../multiPlayerWar/view/MpwTopPanel";
// import MrrProxy                     from "../../multiRankRoom/model/MrrProxy";
// import TwnsMrwMyWarListPanel        from "../../multiRankWar/view/MrwMyWarListPanel";
// import RwModel                      from "../../replayWar/model/RwModel";
// import RwProxy                      from "../../replayWar/model/RwProxy";
// import TwnsRwReplayListPanel        from "../../replayWar/view/RwReplayListPanel";
// import TwnsRwTopPanel               from "../../replayWar/view/RwTopPanel";
// import ScrCreateModel               from "../../singleCustomRoom/model/ScrCreateModel";
// import SpmModel                     from "../../singlePlayerMode/model/SpmModel";
// import SpmProxy                     from "../../singlePlayerMode/model/SpmProxy";
// import TwnsSpmWarListPanel          from "../../singlePlayerMode/view/SpmWarListPanel";
// import SpwModel                     from "../../singlePlayerWar/model/SpwModel";
// import TwnsSpwSidePanel             from "../../singlePlayerWar/view/SpwSidePanel";
// import TwnsSpwTopPanel              from "../../singlePlayerWar/view/SpwTopPanel";
// import UserModel                    from "../../user/model/UserModel";
// import UserProxy                    from "../../user/model/UserProxy";
// import TwnsUserLoginBackgroundPanel from "../../user/view/UserLoginBackgroundPanel";
// import TwnsUserLoginPanel           from "../../user/view/UserLoginPanel";
// import WarMapModel                  from "../../warMap/model/WarMapModel";
// import WarMapProxy                  from "../../warMap/model/WarMapProxy";
// import WwProxy                      from "../../watchWar/model/WwProxy";
// import TwnsWwOngoingWarsPanel       from "../../watchWar/view/WwOngoingWarsPanel";
// import Lang                         from "../lang/Lang";
// import TwnsLangTextType             from "../lang/LangTextType";
// import NetManager                   from "../network/NetManager";
// import TwnsNetMessageCodes          from "../network/NetMessageCodes";
// import Notify                       from "../notify/Notify";
// import TwnsNotifyType               from "../notify/NotifyType";
// import ProtoManager                 from "../proto/ProtoManager";
// import ProtoTypes                   from "../proto/ProtoTypes";
// import ResManager                   from "../res/ResManager";
// import CompatibilityHelpers         from "./CompatibilityHelpers";
// import ConfigManager                from "./ConfigManager";
// import Helpers                      from "./Helpers";
// import LocalStorage                 from "./LocalStorage";
// import NoSleepManager               from "./NoSleepManager";
// import SoundManager                 from "./SoundManager";
// import StageManager                 from "./StageManager";
// import Timer                        from "./Timer";
// import Types                        from "./Types";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace FlowManager {
    import ClientErrorCode  = TwnsClientErrorCode.ClientErrorCode;
    import LangTextType     = TwnsLangTextType.LangTextType;
    import NotifyType       = TwnsNotifyType.NotifyType;
    import NetMessageCodes  = TwnsNetMessageCodes.NetMessageCodes;
    import WarType          = Types.WarType;

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

    export function startGame(stage: egret.Stage): void {
        doStartGame(stage);
    }
    async function doStartGame(stage: egret.Stage): Promise<void> {
        CompatibilityHelpers.init();
        NetManager.addListeners(_NET_EVENTS);
        Notify.addEventListeners(_NOTIFY_EVENTS);
        StageManager.init(stage);
        await Promise.all([ResManager.init(), ProtoManager.init()]);
        StageManager.setStageScale(LocalStorage.getStageScale());

        Lang.init();
        NoSleepManager.init();
        ConfigManager.init();
        NetManager.init();
        MpwProxy.init();
        MpwModel.init();
        Timer.init();
        UserProxy.init();
        UserModel.init();
        WarMapProxy.init();
        WarMapModel.init();
        McrProxy.init();
        MrrProxy.init();
        MfrProxy.init();
        CcrProxy.init();
        WwProxy.init();
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
        StageManager.closeAllPanels(Helpers.getNonNullElements([
            TwnsUserLoginBackgroundPanel.UserLoginBackgroundPanel.getInstance(),
            TwnsUserLoginPanel.UserLoginPanel.getInstance(),
            TwnsBroadcastPanel.BroadcastPanel.getInstance(),
        ]));
        TwnsUserLoginBackgroundPanel.UserLoginBackgroundPanel.show();
        TwnsUserLoginPanel.UserLoginPanel.show();
        TwnsBroadcastPanel.BroadcastPanel.show();

        SoundManager.playBgm(Types.BgmCode.Lobby01);
    }
    export function gotoLobby(): void {
        _hasOnceWentToLobby = true;

        MpwModel.unloadWar();
        RwModel.unloadWar();
        SpwModel.unloadWar();
        MeModel.unloadWar();
        StageManager.closeAllPanels(Helpers.getNonNullElements([
            TwnsLobbyBackgroundPanel.LobbyBackgroundPanel.getInstance(),
            TwnsLobbyPanel.LobbyPanel.getInstance(),
            TwnsLobbyTopPanel.LobbyTopPanel.getInstance(),
            TwnsLobbyTopRightPanel.LobbyTopRightPanel.getInstance(),
            TwnsLobbyBottomPanel.LobbyBottomPanel.getInstance(),
            TwnsBroadcastPanel.BroadcastPanel.getInstance(),
        ]));
        TwnsLobbyBackgroundPanel.LobbyBackgroundPanel.show();
        TwnsLobbyPanel.LobbyPanel.show();
        TwnsLobbyTopPanel.LobbyTopPanel.show();
        TwnsLobbyTopRightPanel.LobbyTopRightPanel.show();
        TwnsLobbyBottomPanel.LobbyBottomPanel.show();
        TwnsBroadcastPanel.BroadcastPanel.show();

        SoundManager.playBgm(Types.BgmCode.Lobby01);
    }

    export async function gotoMultiPlayerWar(data: ProtoTypes.WarSerialization.ISerialWar): Promise<void> {
        const war = await MpwModel.loadWar(data);
        RwModel.unloadWar();
        SpwModel.unloadWar();
        MeModel.unloadWar();

        StageManager.closeAllPanels();
        TwnsBwBackgroundPanel.BwBackgroundPanel.show();
        TwnsMpwTopPanel.MpwTopPanel.show({ war });
        TwnsMpwSidePanel.MpwSidePanel.show({ war });
        TwnsBwWarPanel.BwWarPanel.show({ war });
        TwnsBwTileBriefPanel.BwTileBriefPanel.show({ war });
        TwnsBwUnitBriefPanel.BwUnitBriefPanel.show({ war });
        TwnsBroadcastPanel.BroadcastPanel.show();

        SoundManager.playCoBgmWithWar(war, true);
    }
    export async function gotoReplayWar(warData: Uint8Array, replayId: number): Promise<void> {
        const war = await RwModel.loadWar(warData, replayId);
        MpwModel.unloadWar();
        SpwModel.unloadWar();
        MeModel.unloadWar();

        StageManager.closeAllPanels();
        TwnsBwBackgroundPanel.BwBackgroundPanel.show();
        TwnsRwTopPanel.RwTopPanel.show({ war });
        TwnsBwWarPanel.BwWarPanel.show({ war });
        TwnsBwTileBriefPanel.BwTileBriefPanel.show({ war });
        TwnsBwUnitBriefPanel.BwUnitBriefPanel.show({ war });
        TwnsBroadcastPanel.BroadcastPanel.show();

        SoundManager.playCoBgmWithWar(war, true);
    }
    export async function gotoSinglePlayerWar({ warData, slotIndex, slotExtraData }: {
        slotIndex       : number;
        slotExtraData   : ProtoTypes.SinglePlayerMode.ISpmWarSaveSlotExtraData;
        warData         : ProtoTypes.WarSerialization.ISerialWar;
    }): Promise<void> {
        const war = await SpwModel.loadWar({ warData, slotIndex, slotExtraData });
        MpwModel.unloadWar();
        RwModel.unloadWar();
        MeModel.unloadWar();

        StageManager.closeAllPanels();
        TwnsBwBackgroundPanel.BwBackgroundPanel.show();
        TwnsSpwTopPanel.SpwTopPanel.show({ war });
        TwnsSpwSidePanel.SpwSidePanel.show({ war });
        TwnsBwWarPanel.BwWarPanel.show({ war });
        TwnsBwTileBriefPanel.BwTileBriefPanel.show({ war });
        TwnsBwUnitBriefPanel.BwUnitBriefPanel.show({ war });
        TwnsBroadcastPanel.BroadcastPanel.show();

        SoundManager.playCoBgmWithWar(war, true);

        await SpwModel.checkAndHandleAutoActionsAndRobotRecursively(war);
    }
    export async function gotoMapEditorWar(mapRawData: Types.Undefinable<ProtoTypes.Map.IMapRawData>, slotIndex: number, isReview: boolean): Promise<void> {
        const war = await MeModel.loadWar(mapRawData, slotIndex, isReview);
        MpwModel.unloadWar();
        SpwModel.unloadWar();
        RwModel.unloadWar();

        StageManager.closeAllPanels();
        TwnsBwBackgroundPanel.BwBackgroundPanel.show();
        TwnsMeTopPanel.MeTopPanel.show();
        TwnsBwWarPanel.BwWarPanel.show({ war });
        TwnsBwTileBriefPanel.BwTileBriefPanel.show({ war });
        TwnsBwUnitBriefPanel.BwUnitBriefPanel.show({ war });
        TwnsBroadcastPanel.BroadcastPanel.show();

        SoundManager.playBgm(Types.BgmCode.MapEditor01);
    }

    export function gotoMyWarListPanel(warType: WarType): void {
        if ((warType === WarType.MfwFog) || (warType === WarType.MfwStd)) {
            _gotoMfwMyWarListPanel();
        } else if ((warType === WarType.MrwFog) || (warType === WarType.MrwStd)) {
            _gotoMrwMyWarListPanel();
        } else if ((warType === WarType.McwFog) || (warType === WarType.McwStd)) {
            _gotoMcwMyWarListPanel();
        } else if ((warType === WarType.CcwFog) || (warType === WarType.CcwStd)) {
            _gotoCcwMyWarListPanel();
        } else if ((warType === WarType.ScwFog) || (warType === WarType.ScwStd) || (warType === WarType.SfwFog) || (warType === WarType.SfwStd) || (warType === WarType.SrwFog) || (warType === WarType.SrwStd)) {
            _gotoSpmWarListPanel();
        } else if (warType === WarType.Me) {
            _gotoMeMapListPanel();
        } else {
            throw Helpers.newError(`FlowManager.gotoMyWarListPanel() invalid warType: ${warType}.`, ClientErrorCode.FlowManager_GotoMyWarListPanel_00);
        }
    }
    export function gotoRwReplayListPanel(): void {
        _unloadAllWarsAndOpenCommonPanels();
        TwnsRwReplayListPanel.RwReplayListPanel.show();
    }
    export function gotoWatchWarListPanel(): void {
        _unloadAllWarsAndOpenCommonPanels();
        TwnsWwOngoingWarsPanel.McrWatchOngoingWarsPanel.show();
    }

    export function gotoMfrCreateSettingsPanel(warData: ProtoTypes.WarSerialization.ISerialWar): void {
        MpwModel.unloadWar();
        RwModel.unloadWar();
        SpwModel.unloadWar();
        MeModel.unloadWar();
        MfrCreateModel.resetDataByInitialWarData(warData);
        StageManager.closeAllPanels(Helpers.getNonNullElements([
            TwnsLobbyTopRightPanel.LobbyTopRightPanel.getInstance(),
        ]));
        TwnsLobbyBackgroundPanel.LobbyBackgroundPanel.show();
        TwnsLobbyTopRightPanel.LobbyTopRightPanel.show();
        TwnsBroadcastPanel.BroadcastPanel.show();
        TwnsMfrCreateSettingsPanel.MfrCreateSettingsPanel.show();

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
        if ((_hasOnceWentToLobby)           &&
            (!UserModel.getIsLoggedIn())    &&
            (account != null)               &&
            (password != null)
        ) {
            UserProxy.reqLogin(account, password, true);
        }
    }

    function _onMsgCommonServerDisconnect(): void {
        // _hasOnceWentToLobby = false;
        // UserModel.clearLoginInfo();
        // gotoLogin();

        TwnsCommonAlertPanel.CommonAlertPanel.show({
            title   : Lang.getText(LangTextType.B0025),
            content : Lang.getText(LangTextType.A0020),
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
        const warData   = Helpers.getExisted(data.war, ClientErrorCode.FlowManager_OnMsgMpwCommonContinueWar_00);
        gotoMultiPlayerWar(warData);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Other private functions.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    function _checkCanFirstGoToLobby(): boolean {
        const configVersion = ConfigManager.getLatestConfigVersion();
        return (!_hasOnceWentToLobby)
            && (UserModel.getIsLoggedIn())
            && (ResManager.checkIsLoadedMainResource())
            && (configVersion != null)
            && (!!ConfigManager.getCachedConfig(configVersion));
    }

    function _removeLoadingDom(): void {
        const document = window.document;
        if (document) {
            const outLoadingLayer = document.getElementById("outLoadingLayer");
            (outLoadingLayer) && (document.body.removeChild(outLoadingLayer));
        }
    }

    function _unloadAllWarsAndOpenCommonPanels(): void {
        MpwModel.unloadWar();
        RwModel.unloadWar();
        SpwModel.unloadWar();
        MeModel.unloadWar();
        StageManager.closeAllPanels(Helpers.getNonNullElements([
            TwnsLobbyBackgroundPanel.LobbyBackgroundPanel.getInstance(),
            TwnsLobbyTopRightPanel.LobbyTopRightPanel.getInstance(),
            TwnsBroadcastPanel.BroadcastPanel.getInstance(),
        ]));
        TwnsLobbyBackgroundPanel.LobbyBackgroundPanel.show();
        TwnsLobbyTopRightPanel.LobbyTopRightPanel.show();
        TwnsBroadcastPanel.BroadcastPanel.show();
        SoundManager.playBgm(Types.BgmCode.Lobby01);
    }

    function _gotoMrwMyWarListPanel(): void {
        _unloadAllWarsAndOpenCommonPanels();
        TwnsMrwMyWarListPanel.MrwMyWarListPanel.show();
    }
    function _gotoMcwMyWarListPanel(): void {
        _unloadAllWarsAndOpenCommonPanels();
        TwnsMcwMyWarListPanel.McwMyWarListPanel.show();
    }
    function _gotoMfwMyWarListPanel(): void {
        _unloadAllWarsAndOpenCommonPanels();
        TwnsMfwMyWarListPanel.MfwMyWarListPanel.show();
    }
    function _gotoCcwMyWarListPanel(): void {
        _unloadAllWarsAndOpenCommonPanels();
        TwnsCcwMyWarListPanel.CcwMyWarListPanel.show();
    }
    function _gotoSpmWarListPanel(): void {
        _unloadAllWarsAndOpenCommonPanels();
        TwnsSpmWarListPanel.SpmWarListPanel.show();
    }
    function _gotoMeMapListPanel(): void {
        _unloadAllWarsAndOpenCommonPanels();
        TwnsMeMapListPanel.MeMapListPanel.show();
    }
}

// export default FlowManager;
