
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
        await Twns.ResVersionController.init();
        CompatibilityHelpers.init();
        NetManager.addListeners(_NET_EVENTS);
        Notify.addEventListeners(_NOTIFY_EVENTS);
        StageManager.init(stage);
        await Promise.all([ResManager.init(), ProtoManager.init()]);
        StageManager.setStageScale(LocalStorage.getStageScale());

        Lang.init();
        NoSleepManager.init();
        Twns.Config.ConfigManager.init();
        NetManager.init();
        Twns.MultiPlayerWar.MpwProxy.init();
        Twns.MultiPlayerWar.MpwModel.init();
        Timer.init();
        UserProxy.init();
        UserModel.init();
        WarMapProxy.init();
        WarMapModel.init();
        Twns.MultiCustomRoom.McrProxy.init();
        Twns.MultiRankRoom.MrrProxy.init();
        Twns.MultiFreeRoom.MfrProxy.init();
        Twns.CoopCustomRoom.CcrProxy.init();
        WwProxy.init();
        RwProxy.init();
        RwModel.init();
        HrwModel.init();
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
        Twns.LeaderboardProxy.init();
        TwnsPanelConfig.init();

        _removeLoadingDom();
        gotoLogin();

        await ResManager.loadMainRes();
        (_checkCanFirstGoToLobby()) && (gotoLobby());
    }

    export function gotoLogin(): void {
        Twns.MultiPlayerWar.MpwModel.unloadWar();
        RwModel.unloadWar();
        HrwModel.unloadWar();
        SpwModel.unloadWar();
        MeModel.unloadWar();

        TwnsPanelManager.closeAllPanelsExcept([
            TwnsPanelConfig.Dict.UserLoginBackgroundPanel,
            TwnsPanelConfig.Dict.UserLoginPanel,
            TwnsPanelConfig.Dict.BroadcastPanel,
        ]);
        TwnsPanelManager.open(TwnsPanelConfig.Dict.UserLoginBackgroundPanel, void 0);
        TwnsPanelManager.open(TwnsPanelConfig.Dict.UserLoginPanel, void 0);
        TwnsPanelManager.open(TwnsPanelConfig.Dict.BroadcastPanel, void 0);

        SoundManager.playBgm(Types.BgmCode.Lobby01);
    }
    export function gotoLobby(): void {
        _hasOnceWentToLobby = true;

        Twns.MultiPlayerWar.MpwModel.unloadWar();
        RwModel.unloadWar();
        HrwModel.unloadWar();
        SpwModel.unloadWar();
        MeModel.unloadWar();
        TwnsPanelManager.closeAllPanelsExcept([
            TwnsPanelConfig.Dict.BroadcastPanel,
            TwnsPanelConfig.Dict.LobbyBackgroundPanel,
            TwnsPanelConfig.Dict.LobbyBottomPanel,
            TwnsPanelConfig.Dict.LobbyTopPanel,
            TwnsPanelConfig.Dict.LobbyTopRightPanel,
            TwnsPanelConfig.Dict.LobbyPanel,
        ]);
        TwnsPanelManager.open(TwnsPanelConfig.Dict.BroadcastPanel, void 0);
        TwnsPanelManager.open(TwnsPanelConfig.Dict.LobbyBackgroundPanel, void 0);
        TwnsPanelManager.open(TwnsPanelConfig.Dict.LobbyBottomPanel, void 0);
        TwnsPanelManager.open(TwnsPanelConfig.Dict.LobbyTopPanel, void 0);
        TwnsPanelManager.open(TwnsPanelConfig.Dict.LobbyTopRightPanel, void 0);
        TwnsPanelManager.open(TwnsPanelConfig.Dict.LobbyPanel, void 0);

        SoundManager.playBgm(Types.BgmCode.Lobby01);
    }

    export async function gotoMultiPlayerWar(data: CommonProto.WarSerialization.ISerialWar): Promise<void> {
        const war = await Twns.MultiPlayerWar.MpwModel.loadWar(data);
        RwModel.unloadWar();
        HrwModel.unloadWar();
        SpwModel.unloadWar();
        MeModel.unloadWar();

        TwnsPanelManager.closeAllPanelsExcept([
            TwnsPanelConfig.Dict.BwBackgroundPanel,
            TwnsPanelConfig.Dict.BroadcastPanel,
        ]);
        TwnsPanelManager.open(TwnsPanelConfig.Dict.BwBackgroundPanel, void 0);
        TwnsPanelManager.open(TwnsPanelConfig.Dict.MpwTopPanel, { war });
        TwnsPanelManager.open(TwnsPanelConfig.Dict.MpwSidePanel, { war });
        TwnsPanelManager.open(TwnsPanelConfig.Dict.BwWarPanel, { war });
        TwnsPanelManager.open(TwnsPanelConfig.Dict.BwTileBriefPanel, { war });
        TwnsPanelManager.open(TwnsPanelConfig.Dict.BwUnitBriefPanel, { war });
        TwnsPanelManager.open(TwnsPanelConfig.Dict.BroadcastPanel, void 0);

        SoundManager.playCoBgmWithWar(war, true);
    }
    export async function gotoReplayWar(warData: CommonProto.WarSerialization.ISerialWar, replayId: number): Promise<void> {
        const war = await RwModel.loadWar(warData, replayId);
        HrwModel.unloadWar();
        Twns.MultiPlayerWar.MpwModel.unloadWar();
        SpwModel.unloadWar();
        MeModel.unloadWar();

        TwnsPanelManager.closeAllPanelsExcept([
            TwnsPanelConfig.Dict.BwBackgroundPanel,
            TwnsPanelConfig.Dict.BroadcastPanel,
        ]);
        TwnsPanelManager.open(TwnsPanelConfig.Dict.BwBackgroundPanel, void 0);
        TwnsPanelManager.open(TwnsPanelConfig.Dict.RwTopPanel, { war });
        TwnsPanelManager.open(TwnsPanelConfig.Dict.BwWarPanel, { war });
        TwnsPanelManager.open(TwnsPanelConfig.Dict.BwTileBriefPanel, { war });
        TwnsPanelManager.open(TwnsPanelConfig.Dict.BwUnitBriefPanel, { war });
        TwnsPanelManager.open(TwnsPanelConfig.Dict.BroadcastPanel, void 0);

        SoundManager.playCoBgmWithWar(war, true);
    }
    export async function gotoHalfwayReplayWar(warData: CommonProto.WarSerialization.ISerialWar): Promise<void> {
        const war = await HrwModel.loadWar(warData);
        RwModel.unloadWar();
        Twns.MultiPlayerWar.MpwModel.unloadWar();
        SpwModel.unloadWar();
        MeModel.unloadWar();

        TwnsPanelManager.closeAllPanelsExcept([
            TwnsPanelConfig.Dict.BwBackgroundPanel,
            TwnsPanelConfig.Dict.BroadcastPanel,
        ]);
        TwnsPanelManager.open(TwnsPanelConfig.Dict.BwBackgroundPanel, void 0);
        TwnsPanelManager.open(TwnsPanelConfig.Dict.HrwTopPanel, { war });
        TwnsPanelManager.open(TwnsPanelConfig.Dict.BwWarPanel, { war });
        TwnsPanelManager.open(TwnsPanelConfig.Dict.BwTileBriefPanel, { war });
        TwnsPanelManager.open(TwnsPanelConfig.Dict.BwUnitBriefPanel, { war });
        TwnsPanelManager.open(TwnsPanelConfig.Dict.BroadcastPanel, void 0);

        SoundManager.playCoBgmWithWar(war, true);
    }
    export async function gotoSinglePlayerWar({ warData, slotIndex, slotExtraData }: {
        slotIndex       : number;
        slotExtraData   : CommonProto.SinglePlayerMode.ISpmWarSaveSlotExtraData;
        warData         : CommonProto.WarSerialization.ISerialWar;
    }): Promise<void> {
        const war = await SpwModel.loadWar({ warData, slotIndex, slotExtraData });
        Twns.MultiPlayerWar.MpwModel.unloadWar();
        RwModel.unloadWar();
        HrwModel.unloadWar();
        MeModel.unloadWar();

        TwnsPanelManager.closeAllPanelsExcept([
            TwnsPanelConfig.Dict.BwBackgroundPanel,
            TwnsPanelConfig.Dict.BroadcastPanel,
        ]);
        TwnsPanelManager.open(TwnsPanelConfig.Dict.BwBackgroundPanel, void 0);
        TwnsPanelManager.open(TwnsPanelConfig.Dict.SpwTopPanel, { war });
        TwnsPanelManager.open(TwnsPanelConfig.Dict.SpwSidePanel, { war });
        TwnsPanelManager.open(TwnsPanelConfig.Dict.BwWarPanel, { war });
        TwnsPanelManager.open(TwnsPanelConfig.Dict.BwTileBriefPanel, { war });
        TwnsPanelManager.open(TwnsPanelConfig.Dict.BwUnitBriefPanel, { war });
        TwnsPanelManager.open(TwnsPanelConfig.Dict.BroadcastPanel, void 0);

        SoundManager.playCoBgmWithWar(war, true);

        await SpwModel.checkAndHandleAutoActionsAndRobotRecursively(war);
    }
    export async function gotoMapEditorWar(mapRawData: Types.Undefinable<CommonProto.Map.IMapRawData>, slotIndex: number, isReview: boolean): Promise<void> {
        const war = await MeModel.loadWar(mapRawData, slotIndex, isReview);
        Twns.MultiPlayerWar.MpwModel.unloadWar();
        SpwModel.unloadWar();
        RwModel.unloadWar();
        HrwModel.unloadWar();

        TwnsPanelManager.closeAllPanelsExcept([
            TwnsPanelConfig.Dict.BwBackgroundPanel,
            TwnsPanelConfig.Dict.BroadcastPanel,
        ]);
        TwnsPanelManager.open(TwnsPanelConfig.Dict.BwBackgroundPanel, void 0);
        TwnsPanelManager.open(TwnsPanelConfig.Dict.MeTopPanel, void 0);
        TwnsPanelManager.open(TwnsPanelConfig.Dict.BwWarPanel, { war });
        TwnsPanelManager.open(TwnsPanelConfig.Dict.BwTileBriefPanel, { war });
        TwnsPanelManager.open(TwnsPanelConfig.Dict.BwUnitBriefPanel, { war });
        TwnsPanelManager.open(TwnsPanelConfig.Dict.BroadcastPanel, void 0);

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
        TwnsPanelManager.open(TwnsPanelConfig.Dict.RwReplayListPanel, void 0);
    }
    export function gotoWatchWarListPanel(): void {
        _unloadAllWarsAndOpenCommonPanels();
        TwnsPanelManager.open(TwnsPanelConfig.Dict.WwOngoingWarsPanel, void 0);
    }

    export function gotoMfrCreateSettingsPanel(warData: CommonProto.WarSerialization.ISerialWar): void {
        Twns.MultiPlayerWar.MpwModel.unloadWar();
        RwModel.unloadWar();
        HrwModel.unloadWar();
        SpwModel.unloadWar();
        MeModel.unloadWar();
        MfrCreateModel.resetDataByInitialWarData(warData);
        TwnsPanelManager.closeAllPanelsExcept([
            TwnsPanelConfig.Dict.BroadcastPanel,
            TwnsPanelConfig.Dict.LobbyTopRightPanel,
            TwnsPanelConfig.Dict.LobbyBackgroundPanel,
        ]);
        TwnsPanelManager.open(TwnsPanelConfig.Dict.BroadcastPanel, void 0);
        TwnsPanelManager.open(TwnsPanelConfig.Dict.LobbyTopRightPanel, void 0);
        TwnsPanelManager.open(TwnsPanelConfig.Dict.LobbyBackgroundPanel, void 0);
        TwnsPanelManager.open(TwnsPanelConfig.Dict.MfrCreateSettingsPanel, void 0);

        SoundManager.playBgm(Types.BgmCode.Lobby01);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Callbacks.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
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

        TwnsPanelManager.open(TwnsPanelConfig.Dict.CommonAlertPanel, {
            title   : Lang.getText(LangTextType.B0025),
            content : Lang.getText(LangTextType.A0020),
        });
    }

    function _onMsgUserLogin(): void {
        if (_checkCanFirstGoToLobby()) {
            gotoLobby();
        } else {
            const mcwWar = Twns.MultiPlayerWar.MpwModel.getWar();
            if (mcwWar) {
                Twns.MultiPlayerWar.MpwProxy.reqMpwCommonSyncWar(mcwWar, Types.SyncWarRequestType.ReconnectionRequest);
            }
        }
    }

    function _onMsgUserLogout(): void {
        _hasOnceWentToLobby = false;
        UserModel.clearLoginInfo();
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
            && (UserModel.getIsLoggedIn())
            && (ResManager.checkIsLoadedMainResource())
            && (Twns.Config.ConfigManager.getLatestConfigVersion() != null);
    }

    function _removeLoadingDom(): void {
        const document = window.document;
        if (document) {
            const outLoadingLayer = document.getElementById("outLoadingLayer");
            (outLoadingLayer) && (document.body.removeChild(outLoadingLayer));
        }
    }

    function _unloadAllWarsAndOpenCommonPanels(): void {
        Twns.MultiPlayerWar.MpwModel.unloadWar();
        RwModel.unloadWar();
        HrwModel.unloadWar();
        SpwModel.unloadWar();
        MeModel.unloadWar();

        TwnsPanelManager.closeAllPanelsExcept([
            TwnsPanelConfig.Dict.BroadcastPanel,
            TwnsPanelConfig.Dict.LobbyBackgroundPanel,
            TwnsPanelConfig.Dict.LobbyTopRightPanel,
        ]);
        TwnsPanelManager.open(TwnsPanelConfig.Dict.BroadcastPanel, void 0);
        TwnsPanelManager.open(TwnsPanelConfig.Dict.LobbyBackgroundPanel, void 0);
        TwnsPanelManager.open(TwnsPanelConfig.Dict.LobbyTopRightPanel, void 0);

        SoundManager.playBgm(Types.BgmCode.Lobby01);
    }

    function _gotoMrwMyWarListPanel(): void {
        _unloadAllWarsAndOpenCommonPanels();
        TwnsPanelManager.open(TwnsPanelConfig.Dict.MrwMyWarListPanel, void 0);
    }
    function _gotoMcwMyWarListPanel(): void {
        _unloadAllWarsAndOpenCommonPanels();
        TwnsPanelManager.open(TwnsPanelConfig.Dict.McwMyWarListPanel, void 0);
    }
    function _gotoMfwMyWarListPanel(): void {
        _unloadAllWarsAndOpenCommonPanels();
        TwnsPanelManager.open(TwnsPanelConfig.Dict.MfwMyWarListPanel, void 0);
    }
    function _gotoCcwMyWarListPanel(): void {
        _unloadAllWarsAndOpenCommonPanels();
        TwnsPanelManager.open(TwnsPanelConfig.Dict.CcwMyWarListPanel, void 0);
    }
    function _gotoSpmWarListPanel(): void {
        _unloadAllWarsAndOpenCommonPanels();
        TwnsPanelManager.open(TwnsPanelConfig.Dict.SpmWarListPanel, void 0);
    }
    function _gotoMeMapListPanel(): void {
        _unloadAllWarsAndOpenCommonPanels();
        TwnsPanelManager.open(TwnsPanelConfig.Dict.MeMapListPanel, void 0);
    }
}

// export default FlowManager;
