
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
// import Notify               from "../notify/NotifyType";
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
namespace Twns.FlowManager {
    import ClientErrorCode  = TwnsClientErrorCode.ClientErrorCode;
    import LangTextType     = TwnsLangTextType.LangTextType;
    import NotifyType       = Notify.NotifyType;
    import NetMessageCodes  = Twns.Net.NetMessageCodes;
    import WarType          = Types.WarType;

    const _NET_EVENTS = [
        { msgCode: NetMessageCodes.MsgCommonServerDisconnect, callback: _onMsgCommonServerDisconnect },
    ];
    const _NOTIFY_EVENTS = [
        { type: NotifyType.NetworkConnected,                callback: _onNotifyNetworkConnected, },
        { type: NotifyType.MsgUserLogin,                    callback: _onMsgUserLogin },
        { type: NotifyType.MsgUserLogout,                   callback: _onMsgUserLogout },
        { type: NotifyType.MsgMpwCommonContinueWar,         callback: _onMsgMpwCommonContinueWar },
        { type: NotifyType.MsgCommonLatestConfigVersion,    callback: _onMsgCommonLatestConfigVersion },
    ];

    let _hasOnceWentToLobby = false;

    export function startGame(stage: egret.Stage): void {
        doStartGame(stage);
    }
    async function doStartGame(stage: egret.Stage): Promise<void> {
        await ResVersionController.init();
        Twns.CompatibilityHelpers.init();
        Twns.Net.NetManager.addListeners(_NET_EVENTS);
        Notify.addEventListeners(_NOTIFY_EVENTS);
        StageManager.init(stage);
        await Promise.all([ResManager.init(), ProtoManager.init()]);
        StageManager.setStageScale(LocalStorage.getStageScale());

        Lang.init();
        NoSleepManager.init();
        Config.ConfigManager.init();
        Twns.Net.NetManager.init();
        MultiPlayerWar.MpwProxy.init();
        MultiPlayerWar.MpwModel.init();
        Twns.Timer.init();
        User.UserProxy.init();
        User.UserModel.init();
        WarMap.WarMapProxy.init();
        WarMap.WarMapModel.init();
        MultiCustomRoom.McrProxy.init();
        MultiRankRoom.MrrProxy.init();
        MultiFreeRoom.MfrProxy.init();
        CoopCustomRoom.CcrProxy.init();
        WatchWar.WwProxy.init();
        ReplayWar.RwProxy.init();
        ReplayWar.RwModel.init();
        HalfwayReplayWar.HrwModel.init();
        SinglePlayerMode.SpmProxy.init();
        SinglePlayerMode.SpmModel.init();
        SingleCustomRoom.ScrCreateModel.init();
        SinglePlayerWar.SpwModel.init();
        MapEditor.MeProxy.init();
        MapEditor.MeModel.init();
        Chat.ChatProxy.init();
        Common.CommonProxy.init();
        Common.CommonModel.init();
        Broadcast.BroadcastProxy.init();
        ChangeLog.ChangeLogProxy.init();
        Leaderboard.LeaderboardProxy.init();
        PanelHelpers.initPanelDict();

        _removeLoadingDom();
        gotoLogin();

        await ResManager.loadMainRes();
        (_checkCanFirstGoToLobby()) && (gotoLobby());
    }

    export function gotoLogin(): void {
        MultiPlayerWar.MpwModel.unloadWar();
        ReplayWar.RwModel.unloadWar();
        HalfwayReplayWar.HrwModel.unloadWar();
        SinglePlayerWar.SpwModel.unloadWar();
        MapEditor.MeModel.unloadWar();

        PanelHelpers.closeAllPanelsExcept([
            PanelHelpers.PanelDict.UserLoginBackgroundPanel,
            PanelHelpers.PanelDict.UserLoginPanel,
            PanelHelpers.PanelDict.BroadcastPanel,
        ]);
        PanelHelpers.open(PanelHelpers.PanelDict.UserLoginBackgroundPanel, void 0);
        PanelHelpers.open(PanelHelpers.PanelDict.UserLoginPanel, void 0);
        PanelHelpers.open(PanelHelpers.PanelDict.BroadcastPanel, void 0);

        Twns.SoundManager.playBgm(Types.BgmCode.Lobby01);
    }
    export function gotoLobby(): void {
        _hasOnceWentToLobby = true;

        MultiPlayerWar.MpwModel.unloadWar();
        ReplayWar.RwModel.unloadWar();
        HalfwayReplayWar.HrwModel.unloadWar();
        SinglePlayerWar.SpwModel.unloadWar();
        MapEditor.MeModel.unloadWar();
        PanelHelpers.closeAllPanelsExcept([
            PanelHelpers.PanelDict.BroadcastPanel,
            PanelHelpers.PanelDict.LobbyBackgroundPanel,
            PanelHelpers.PanelDict.LobbyBottomPanel,
            PanelHelpers.PanelDict.LobbyTopPanel,
            PanelHelpers.PanelDict.LobbyTopRightPanel,
            PanelHelpers.PanelDict.LobbyPanel,
        ]);
        PanelHelpers.open(PanelHelpers.PanelDict.BroadcastPanel, void 0);
        PanelHelpers.open(PanelHelpers.PanelDict.LobbyBackgroundPanel, void 0);
        PanelHelpers.open(PanelHelpers.PanelDict.LobbyBottomPanel, void 0);
        PanelHelpers.open(PanelHelpers.PanelDict.LobbyTopPanel, void 0);
        PanelHelpers.open(PanelHelpers.PanelDict.LobbyTopRightPanel, void 0);
        PanelHelpers.open(PanelHelpers.PanelDict.LobbyPanel, void 0);

        Twns.SoundManager.playBgm(Types.BgmCode.Lobby01);
    }

    export async function gotoMultiPlayerWar(data: CommonProto.WarSerialization.ISerialWar): Promise<void> {
        const war = await MultiPlayerWar.MpwModel.loadWar(data);
        ReplayWar.RwModel.unloadWar();
        HalfwayReplayWar.HrwModel.unloadWar();
        SinglePlayerWar.SpwModel.unloadWar();
        MapEditor.MeModel.unloadWar();

        PanelHelpers.closeAllPanelsExcept([
            PanelHelpers.PanelDict.BwBackgroundPanel,
            PanelHelpers.PanelDict.BroadcastPanel,
        ]);
        PanelHelpers.open(PanelHelpers.PanelDict.BwBackgroundPanel, void 0);
        PanelHelpers.open(PanelHelpers.PanelDict.MpwTopPanel, { war });
        PanelHelpers.open(PanelHelpers.PanelDict.MpwSidePanel, { war });
        PanelHelpers.open(PanelHelpers.PanelDict.BwWarPanel, { war });
        PanelHelpers.open(PanelHelpers.PanelDict.BwTileBriefPanel, { war });
        PanelHelpers.open(PanelHelpers.PanelDict.BwUnitBriefPanel, { war });
        PanelHelpers.open(PanelHelpers.PanelDict.BroadcastPanel, void 0);

        Twns.SoundManager.playCoBgmWithWar(war, true);
    }
    export async function gotoReplayWar(warData: CommonProto.WarSerialization.ISerialWar, replayId: number): Promise<void> {
        const war = await ReplayWar.RwModel.loadWar(warData, replayId);
        HalfwayReplayWar.HrwModel.unloadWar();
        MultiPlayerWar.MpwModel.unloadWar();
        SinglePlayerWar.SpwModel.unloadWar();
        MapEditor.MeModel.unloadWar();

        PanelHelpers.closeAllPanelsExcept([
            PanelHelpers.PanelDict.BwBackgroundPanel,
            PanelHelpers.PanelDict.BroadcastPanel,
        ]);
        PanelHelpers.open(PanelHelpers.PanelDict.BwBackgroundPanel, void 0);
        PanelHelpers.open(PanelHelpers.PanelDict.RwTopPanel, { war });
        PanelHelpers.open(PanelHelpers.PanelDict.BwWarPanel, { war });
        PanelHelpers.open(PanelHelpers.PanelDict.BwTileBriefPanel, { war });
        PanelHelpers.open(PanelHelpers.PanelDict.BwUnitBriefPanel, { war });
        PanelHelpers.open(PanelHelpers.PanelDict.BroadcastPanel, void 0);

        Twns.SoundManager.playCoBgmWithWar(war, true);
    }
    export async function gotoHalfwayReplayWar(warData: CommonProto.WarSerialization.ISerialWar): Promise<void> {
        const war = await HalfwayReplayWar.HrwModel.loadWar(warData);
        ReplayWar.RwModel.unloadWar();
        MultiPlayerWar.MpwModel.unloadWar();
        SinglePlayerWar.SpwModel.unloadWar();
        MapEditor.MeModel.unloadWar();

        PanelHelpers.closeAllPanelsExcept([
            PanelHelpers.PanelDict.BwBackgroundPanel,
            PanelHelpers.PanelDict.BroadcastPanel,
        ]);
        PanelHelpers.open(PanelHelpers.PanelDict.BwBackgroundPanel, void 0);
        PanelHelpers.open(PanelHelpers.PanelDict.HrwTopPanel, { war });
        PanelHelpers.open(PanelHelpers.PanelDict.BwWarPanel, { war });
        PanelHelpers.open(PanelHelpers.PanelDict.BwTileBriefPanel, { war });
        PanelHelpers.open(PanelHelpers.PanelDict.BwUnitBriefPanel, { war });
        PanelHelpers.open(PanelHelpers.PanelDict.BroadcastPanel, void 0);

        Twns.SoundManager.playCoBgmWithWar(war, true);
    }
    export async function gotoSinglePlayerWar({ warData, slotIndex, slotExtraData }: {
        slotIndex       : number;
        slotExtraData   : CommonProto.SinglePlayerMode.ISpmWarSaveSlotExtraData;
        warData         : CommonProto.WarSerialization.ISerialWar;
    }): Promise<void> {
        const war = await SinglePlayerWar.SpwModel.loadWar({ warData, slotIndex, slotExtraData });
        MultiPlayerWar.MpwModel.unloadWar();
        ReplayWar.RwModel.unloadWar();
        HalfwayReplayWar.HrwModel.unloadWar();
        MapEditor.MeModel.unloadWar();

        PanelHelpers.closeAllPanelsExcept([
            PanelHelpers.PanelDict.BwBackgroundPanel,
            PanelHelpers.PanelDict.BroadcastPanel,
        ]);
        PanelHelpers.open(PanelHelpers.PanelDict.BwBackgroundPanel, void 0);
        PanelHelpers.open(PanelHelpers.PanelDict.SpwTopPanel, { war });
        PanelHelpers.open(PanelHelpers.PanelDict.SpwSidePanel, { war });
        PanelHelpers.open(PanelHelpers.PanelDict.BwWarPanel, { war });
        PanelHelpers.open(PanelHelpers.PanelDict.BwTileBriefPanel, { war });
        PanelHelpers.open(PanelHelpers.PanelDict.BwUnitBriefPanel, { war });
        PanelHelpers.open(PanelHelpers.PanelDict.BroadcastPanel, void 0);

        Twns.SoundManager.playCoBgmWithWar(war, true);

        await SinglePlayerWar.SpwModel.checkAndHandleAutoActionsAndRobotRecursively(war);
    }
    export async function gotoMapEditorWar(mapRawData: Types.Undefinable<CommonProto.Map.IMapRawData>, slotIndex: number, isReview: boolean): Promise<void> {
        const war = await MapEditor.MeModel.loadWar(mapRawData, slotIndex, isReview);
        MultiPlayerWar.MpwModel.unloadWar();
        SinglePlayerWar.SpwModel.unloadWar();
        ReplayWar.RwModel.unloadWar();
        HalfwayReplayWar.HrwModel.unloadWar();

        PanelHelpers.closeAllPanelsExcept([
            PanelHelpers.PanelDict.BwBackgroundPanel,
            PanelHelpers.PanelDict.BroadcastPanel,
        ]);
        PanelHelpers.open(PanelHelpers.PanelDict.BwBackgroundPanel, void 0);
        PanelHelpers.open(PanelHelpers.PanelDict.MeTopPanel, void 0);
        PanelHelpers.open(PanelHelpers.PanelDict.BwWarPanel, { war });
        PanelHelpers.open(PanelHelpers.PanelDict.BwTileBriefPanel, { war });
        PanelHelpers.open(PanelHelpers.PanelDict.BwUnitBriefPanel, { war });
        PanelHelpers.open(PanelHelpers.PanelDict.BroadcastPanel, void 0);

        Twns.SoundManager.playBgm(Types.BgmCode.MapEditor01);
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
        PanelHelpers.open(PanelHelpers.PanelDict.RwReplayListPanel, void 0);
    }
    export function gotoWatchWarListPanel(): void {
        _unloadAllWarsAndOpenCommonPanels();
        PanelHelpers.open(PanelHelpers.PanelDict.WwOngoingWarsPanel, void 0);
    }

    export function gotoMfrCreateSettingsPanel(warData: CommonProto.WarSerialization.ISerialWar): void {
        MultiPlayerWar.MpwModel.unloadWar();
        ReplayWar.RwModel.unloadWar();
        HalfwayReplayWar.HrwModel.unloadWar();
        SinglePlayerWar.SpwModel.unloadWar();
        MapEditor.MeModel.unloadWar();
        MultiFreeRoom.MfrCreateModel.resetDataByInitialWarData(warData);
        PanelHelpers.closeAllPanelsExcept([
            PanelHelpers.PanelDict.BroadcastPanel,
            PanelHelpers.PanelDict.LobbyTopRightPanel,
            PanelHelpers.PanelDict.LobbyBackgroundPanel,
        ]);
        PanelHelpers.open(PanelHelpers.PanelDict.BroadcastPanel, void 0);
        PanelHelpers.open(PanelHelpers.PanelDict.LobbyTopRightPanel, void 0);
        PanelHelpers.open(PanelHelpers.PanelDict.LobbyBackgroundPanel, void 0);
        PanelHelpers.open(PanelHelpers.PanelDict.MfrCreateSettingsPanel, void 0);

        Twns.SoundManager.playBgm(Types.BgmCode.Lobby01);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Callbacks.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    function _onNotifyNetworkConnected(): void {
        const account   = User.UserModel.getSelfAccount();
        const password  = User.UserModel.getSelfPassword();
        if ((_hasOnceWentToLobby)           &&
            (!User.UserModel.getIsLoggedIn())    &&
            (account != null)               &&
            (password != null)
        ) {
            User.UserProxy.reqLogin(account, password, true);
        }
    }

    function _onMsgCommonServerDisconnect(): void {
        // _hasOnceWentToLobby = false;
        // UserModel.clearLoginInfo();
        // gotoLogin();

        PanelHelpers.open(PanelHelpers.PanelDict.CommonAlertPanel, {
            title   : Lang.getText(LangTextType.B0025),
            content : Lang.getText(LangTextType.A0020),
        });
    }

    function _onMsgUserLogin(): void {
        if (_checkCanFirstGoToLobby()) {
            gotoLobby();
        } else {
            const mcwWar = MultiPlayerWar.MpwModel.getWar();
            if (mcwWar) {
                MultiPlayerWar.MpwProxy.reqMpwCommonSyncWar(mcwWar, Types.SyncWarRequestType.ReconnectionRequest);
            }
        }
    }

    function _onMsgUserLogout(): void {
        _hasOnceWentToLobby = false;
        User.UserModel.clearLoginInfo();
        gotoLogin();
    }

    function _onMsgMpwCommonContinueWar(e: egret.Event): void {
        const data      = e.data as CommonProto.NetMessage.MsgMpwCommonContinueWar.IS;
        const warData   = Helpers.getExisted(data.war, ClientErrorCode.FlowManager_OnMsgMpwCommonContinueWar_00);
        gotoMultiPlayerWar(warData);
    }

    function _onMsgCommonLatestConfigVersion(): void {
        if (_checkCanFirstGoToLobby()) {
            gotoLobby();
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Other private functions.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    function _checkCanFirstGoToLobby(): boolean {
        return (!_hasOnceWentToLobby)
            && (User.UserModel.getIsLoggedIn())
            && (ResManager.checkIsLoadedMainResource())
            && (Config.ConfigManager.getLatestConfigVersion() != null);
    }

    function _removeLoadingDom(): void {
        const document = window.document;
        if (document) {
            const outLoadingLayer = document.getElementById("outLoadingLayer");
            (outLoadingLayer) && (document.body.removeChild(outLoadingLayer));
        }
    }

    function _unloadAllWarsAndOpenCommonPanels(): void {
        MultiPlayerWar.MpwModel.unloadWar();
        ReplayWar.RwModel.unloadWar();
        HalfwayReplayWar.HrwModel.unloadWar();
        SinglePlayerWar.SpwModel.unloadWar();
        MapEditor.MeModel.unloadWar();

        PanelHelpers.closeAllPanelsExcept([
            PanelHelpers.PanelDict.BroadcastPanel,
            PanelHelpers.PanelDict.LobbyBackgroundPanel,
            PanelHelpers.PanelDict.LobbyTopRightPanel,
        ]);
        PanelHelpers.open(PanelHelpers.PanelDict.BroadcastPanel, void 0);
        PanelHelpers.open(PanelHelpers.PanelDict.LobbyBackgroundPanel, void 0);
        PanelHelpers.open(PanelHelpers.PanelDict.LobbyTopRightPanel, void 0);

        Twns.SoundManager.playBgm(Types.BgmCode.Lobby01);
    }

    function _gotoMrwMyWarListPanel(): void {
        _unloadAllWarsAndOpenCommonPanels();
        PanelHelpers.open(PanelHelpers.PanelDict.MrwMyWarListPanel, void 0);
    }
    function _gotoMcwMyWarListPanel(): void {
        _unloadAllWarsAndOpenCommonPanels();
        PanelHelpers.open(PanelHelpers.PanelDict.McwMyWarListPanel, void 0);
    }
    function _gotoMfwMyWarListPanel(): void {
        _unloadAllWarsAndOpenCommonPanels();
        PanelHelpers.open(PanelHelpers.PanelDict.MfwMyWarListPanel, void 0);
    }
    function _gotoCcwMyWarListPanel(): void {
        _unloadAllWarsAndOpenCommonPanels();
        PanelHelpers.open(PanelHelpers.PanelDict.CcwMyWarListPanel, void 0);
    }
    function _gotoSpmWarListPanel(): void {
        _unloadAllWarsAndOpenCommonPanels();
        PanelHelpers.open(PanelHelpers.PanelDict.SpmWarListPanel, void 0);
    }
    function _gotoMeMapListPanel(): void {
        _unloadAllWarsAndOpenCommonPanels();
        PanelHelpers.open(PanelHelpers.PanelDict.MeMapListPanel, void 0);
    }
}

// export default FlowManager;
