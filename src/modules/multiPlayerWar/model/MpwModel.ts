
// import TwnsCommonAlertPanel                 from "../../common/view/CommonAlertPanel";
// import TwnsCommonWarAdvancedSettingsPage    from "../../common/view/CommonWarAdvancedSettingsPage";
// import TwnsCommonWarBasicSettingsPage       from "../../common/view/CommonWarBasicSettingsPage";
// import TwnsCommonWarPlayerInfoPage          from "../../common/view/CommonWarPlayerInfoPage";
// import TwnsCcwWar                           from "../../coopCustomWar/model/CcwWar";
// import TwnsMcwWar                           from "../../multiCustomWar/model/McwWar";
// import TwnsMfwWar                           from "../../multiFreeWar/model/MfwWar";
// import MpwProxy                             from "../../multiPlayerWar/model/MpwProxy";
// import TwnsMrwWar                           from "../../multiRankWar/model/MrwWar";
// import TwnsClientErrorCode                  from "../../tools/helpers/ClientErrorCode";
// import CommonConstants                      from "../../tools/helpers/CommonConstants";
// import FloatText                            from "../../tools/helpers/FloatText";
// import FlowManager                          from "../../tools/helpers/FlowManager";
// import Helpers                              from "../../tools/helpers/Helpers";
// import Logger                               from "../../tools/helpers/Logger";
// import Types                                from "../../tools/helpers/Types";
// import Lang                                 from "../../tools/lang/Lang";
// import TwnsLangTextType                     from "../../tools/lang/LangTextType";
// import Notify                               from "../../tools/notify/Notify";
// import Notify                       from "../../tools/notify/NotifyType";
// import ProtoTypes                           from "../../tools/proto/ProtoTypes";
// import WarActionExecutor                    from "../../tools/warHelpers/WarActionExecutor";
// import WarRuleHelpers                       from "../../tools/warHelpers/WarRuleHelpers";
// import UserModel                            from "../../user/model/UserModel";
// import WarMapModel                          from "../../warMap/model/WarMapModel";
// import TwnsMpwWar                           from "./MpwWar";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.MultiPlayerWar.MpwModel {
    import MpwWar                                   = MultiPlayerWar.MpwWar;
    import CcwWar                                   = CoopCustomWar.CcwWar;
    import McwWar                                   = MultiCustomWar.McwWar;
    import MfwWar                                   = MultiFreeWar.MfwWar;
    import MrwWar                                   = MultiRankWar.MrwWar;
    import LangTextType                             = Lang.LangTextType;
    import NotifyType                               = Notify.NotifyType;
    import WarBasicSettingsType                     = Types.WarBasicSettingsType;
    import IWarActionContainer                      = CommonProto.WarAction.IWarActionContainer;
    import IInstanceWarRule                         = CommonProto.WarRule.IInstanceWarRule;
    import IMpwWarSettings                          = CommonProto.MultiPlayerWar.IMpwWarSettings;
    import IMpwWarProgressInfo                      = CommonProto.MultiPlayerWar.IMpwWarProgressInfo;
    import ISettingsForCommon                       = CommonProto.WarSettings.ISettingsForCommon;
    import ISettingsForMcw                          = CommonProto.WarSettings.ISettingsForMcw;
    import ISettingsForCcw                          = CommonProto.WarSettings.ISettingsForCcw;
    import ISettingsForMrw                          = CommonProto.WarSettings.ISettingsForMrw;
    import ISettingsForMfw                          = CommonProto.WarSettings.ISettingsForMfw;
    import ISerialWar                               = CommonProto.WarSerialization.ISerialWar;
    import MsgMpwCommonGetWarSettingsIs             = CommonProto.NetMessage.MsgMpwCommonGetWarSettings.IS;
    import MsgMpwCommonGetWarProgressInfoIs         = CommonProto.NetMessage.MsgMpwCommonGetWarProgressInfo.IS;
    import OpenDataForCommonWarBasicSettingsPage    = Common.OpenDataForCommonWarBasicSettingsPage;
    import OpenDataForCommonWarAdvancedSettingsPage = Common.OpenDataForCommonWarAdvancedSettingsPage;
    import OpenDataForCommonWarPlayerInfoPage       = Common.OpenDataForCommonWarPlayerInfoPage;

    const _NOTIFY_LISTENERS     : Notify.Listener[] = [
        { type: NotifyType.MsgMpwWatchGetIncomingInfo,      callback: _onNotifyMsgMpwWatchGetIncomingInfo },
        { type: NotifyType.MsgMpwWatchGetOutgoingInfo,      callback: _onNotifyMsgMpwWatchGetOutgoingInfo },
    ];
    let _war                    : MpwWar | null = null;
    let _cachedSyncWarData      : CommonProto.NetMessage.MsgMpwCommonSyncWar.IS | null = null;
    const _cachedActions        : IWarActionContainer[] = [];

    export function init(): void {
        Notify.addEventListeners(_NOTIFY_LISTENERS);
    }

    export async function getMyMcwWarIdArray(): Promise<number[]> {
        return getMyMpwWarIdArray(warSettings => warSettings?.settingsForMcw != null);
    }
    export async function getMyMrwWarIdArray(): Promise<number[]> {
        return getMyMpwWarIdArray(warSettings => warSettings?.settingsForMrw != null);
    }
    export async function getMyMfwWarIdArray(): Promise<number[]> {
        return getMyMpwWarIdArray(warSettings => warSettings?.settingsForMfw != null);
    }
    export async function getMyCcwWarIdArray(): Promise<number[]> {
        return getMyMpwWarIdArray(warSettings => warSettings?.settingsForCcw != null);
    }
    async function getMyMpwWarIdArray(predicate: (warSettings: IMpwWarSettings | null) => boolean): Promise<number[]> {
        const userId = User.UserModel.getSelfUserId();
        if (userId == null) {
            return [];
        }

        const allWarIdArray = _warProgressInfoAccessor.getRequestedKeyArray();
        const [
            warProgressInfoArray,
            warSettingsArray,
        ] = await Promise.all([
            Promise.all(allWarIdArray.map(v => getWarProgressInfo(v))),
            Promise.all(allWarIdArray.map(v => getWarSettings(v))),
        ]);

        const warIdArray: number[] = [];
        for (let i = 0; i < allWarIdArray.length; ++i) {
            const warProgressInfo = warProgressInfoArray[i];
            if ((warProgressInfo != null)                                           &&
                (!warProgressInfo.isEnded)                                          &&
                (warProgressInfo.playerInfoList?.some(v => v.userId === userId))    &&
                (predicate(warSettingsArray[i]))
            ) {
                warIdArray.push(allWarIdArray[i]);
            }
        }
        return warIdArray;
    }

    export async function checkIsRedForMyMcwWars(): Promise<boolean> {
        return checkIsRedForMyWars(await getMyMcwWarIdArray());
    }
    export async function checkIsRedForMyMrwWars(): Promise<boolean> {
        return checkIsRedForMyWars(await getMyMrwWarIdArray());
    }
    export async function checkIsRedForMyMfwWars(): Promise<boolean> {
        return checkIsRedForMyWars(await getMyMfwWarIdArray());
    }
    export async function checkIsRedForMyCcwWars(): Promise<boolean> {
        return checkIsRedForMyWars(await getMyCcwWarIdArray());
    }
    export function checkIsRedForMyWar(progressInfo: IMpwWarProgressInfo | null): boolean {
        if (progressInfo == null) {
            return false;
        } else {
            const selfUserId = User.UserModel.getSelfUserId();
            return (progressInfo.playerInfoList || []).some(v => (v.playerIndex === progressInfo.playerIndexInTurn) && (v.userId === selfUserId));
        }
    }
    async function checkIsRedForMyWars(warIdArray: number[]): Promise<boolean> {
        for (const warId of warIdArray) {
            const warProgressInfo = await getWarProgressInfo(warId);
            if (checkIsRedForMyWar(warProgressInfo)) {
                return true;
            }
        }

        return false;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for war settings.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    const _warSettingsAccessor = Helpers.createCachedDataAccessor<number, IMpwWarSettings>({
        reqData : (warId: number) => MpwProxy.reqMpwCommonGetWarSettings(warId),
    });

    export function getWarSettings(warId: number): Promise<IMpwWarSettings | null> {
        return _warSettingsAccessor.getData(warId);
    }

    export async function updateOnMsgMpwCommonGetWarSettings(data: MsgMpwCommonGetWarSettingsIs): Promise<void> {
        _warSettingsAccessor.setData(Helpers.getExisted(data.warId), data.warSettings ?? null);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for war progress info.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    const _warProgressInfoAccessor = Helpers.createCachedDataAccessor<number, IMpwWarProgressInfo>({
        reqData : (warId: number) => MpwProxy.reqMpwCommonGetWarProgressInfo(warId),
    });

    export function getWarProgressInfo(warId: number): Promise<IMpwWarProgressInfo | null> {
        return _warProgressInfoAccessor.getData(warId);
    }

    export async function updateOnMsgMpwCommonGetWarProgressInfo(data: MsgMpwCommonGetWarProgressInfoIs): Promise<void> {
        _warProgressInfoAccessor.setData(Helpers.getExisted(data.warId), data.warProgressInfo ?? null);
    }

    export function updateOnMsgMpwCommonMarkTile(data: CommonProto.NetMessage.MsgMpwCommonMarkTile.IS): void {
        const war = getWar();
        if ((war) && (war.getWarId() === data.warId)) {
            const player = war.getPlayerLoggedIn();
            if (player == null) {
                return;
            }

            const gridId = Helpers.getExisted(data.gridId);
            if (data.isMark) {
                player.addMarkedGridId(gridId);
            } else {
                player.deleteMarkedGridId(gridId);
            }
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    export async function createDataForCommonWarBasicSettingsPage(warId: number | null): Promise<OpenDataForCommonWarBasicSettingsPage> {
        const warInfo = warId == null ? null : await getWarSettings(warId);
        if (warInfo == null) {
            return null;
        }

        const settingsForCommon                                                     = Helpers.getExisted(warInfo.settingsForCommon);
        const instanceWarRule                                                       = Helpers.getExisted(settingsForCommon.instanceWarRule);
        const { settingsForCcw, settingsForMcw, settingsForMfw, settingsForMrw }    = warInfo;
        if (settingsForMcw) {
            return await createDataForCommonWarBasicSettingsPageForMcw(instanceWarRule, settingsForCommon, settingsForMcw);
        } else if (settingsForCcw) {
            return await createDataForCommonWarBasicSettingsPageForCcw(instanceWarRule, settingsForCommon, settingsForCcw);
        } else if (settingsForMrw) {
            return await createDataForCommonWarBasicSettingsPageForMrw(instanceWarRule, settingsForCommon, settingsForMrw);
        } else if (settingsForMfw) {
            return await createDataForCommonWarBasicSettingsPageForMfw(instanceWarRule, settingsForCommon, settingsForMfw);
        } else {
            throw Helpers.newError(`Invalid warInfo.`);
        }
    }
    async function createDataForCommonWarBasicSettingsPageForMcw(instanceWarRule: IInstanceWarRule, settingsForCommon: ISettingsForCommon, settingsForMcw: ISettingsForMcw): Promise<OpenDataForCommonWarBasicSettingsPage> {
        const bootTimerParams   = Helpers.getExisted(settingsForMcw.bootTimerParams);
        const timerType         = bootTimerParams[0] as Types.BootTimerType;
        const gameConfig        = Helpers.getExisted(await Config.ConfigManager.getGameConfig(Helpers.getExisted(settingsForCommon.configVersion)));
        const warEventFullData  = (await WarMap.WarMapModel.getRawData(Helpers.getExisted(settingsForMcw.mapId)))?.warEventFullData ?? null;
        const openData          : OpenDataForCommonWarBasicSettingsPage = {
            dataArrayForListSettings    : [
                {
                    settingsType    : WarBasicSettingsType.MapId,
                    currentValue    : Helpers.getExisted(settingsForMcw.mapId),
                    instanceWarRule,
                    gameConfig,
                    warEventFullData,
                    callbackOnModify: null,
                },
                {
                    settingsType    : WarBasicSettingsType.WarName,
                    currentValue    : settingsForMcw.warName ?? null,
                    instanceWarRule,
                    gameConfig,
                    warEventFullData,
                    callbackOnModify: null,
                },
                {
                    settingsType    : WarBasicSettingsType.WarPassword,
                    currentValue    : settingsForMcw.warPassword ?? null,
                    instanceWarRule,
                    gameConfig,
                    warEventFullData,
                    callbackOnModify: null,
                },
                {
                    settingsType    : WarBasicSettingsType.WarComment,
                    currentValue    : settingsForMcw.warComment ?? null,
                    instanceWarRule,
                    gameConfig,
                    warEventFullData,
                    callbackOnModify: null,
                },
                {
                    settingsType    : WarBasicSettingsType.WarRuleTitle,
                    currentValue    : null,
                    instanceWarRule,
                    gameConfig,
                    warEventFullData,
                    callbackOnModify: null,
                },
                {
                    settingsType    : WarBasicSettingsType.HasFog,
                    currentValue    : null,
                    instanceWarRule,
                    gameConfig,
                    warEventFullData,
                    callbackOnModify: null,
                },
                {
                    settingsType    : WarBasicSettingsType.Weather,
                    currentValue    : null,
                    instanceWarRule,
                    gameConfig,
                    warEventFullData,
                    callbackOnModify: null,
                },
                {
                    settingsType    : WarBasicSettingsType.WarEvent,
                    currentValue    : null,
                    instanceWarRule,
                    gameConfig,
                    warEventFullData,
                    callbackOnModify: null,
                },
                {
                    settingsType    : WarBasicSettingsType.TurnsLimit,
                    currentValue    : settingsForCommon.turnsLimit ?? CommonConstants.WarMaxTurnsLimit,
                    instanceWarRule,
                    gameConfig,
                    warEventFullData,
                    callbackOnModify: null,
                },
                {
                    settingsType    : WarBasicSettingsType.TimerType,
                    currentValue    : timerType,
                    instanceWarRule,
                    gameConfig,
                    warEventFullData,
                    callbackOnModify: null,
                },
            ],
        };
        if (timerType === Types.BootTimerType.Regular) {
            openData.dataArrayForListSettings.push({
                settingsType    : WarBasicSettingsType.TimerRegularParam,
                currentValue    : bootTimerParams[1],
                instanceWarRule,
                gameConfig,
                warEventFullData,
                callbackOnModify: null,
            });
        } else if (timerType === Types.BootTimerType.Incremental) {
            openData.dataArrayForListSettings.push(
                {
                    settingsType    : WarBasicSettingsType.TimerIncrementalParam1,
                    currentValue    : bootTimerParams[1],
                    instanceWarRule,
                    gameConfig,
                    warEventFullData,
                    callbackOnModify: null,
                },
                {
                    settingsType    : WarBasicSettingsType.TimerIncrementalParam2,
                    currentValue    : bootTimerParams[2],
                    instanceWarRule,
                    gameConfig,
                    warEventFullData,
                    callbackOnModify: null,
                },
            );
        } else {
            throw Helpers.newError(`MpwModel.createDataForCommonWarBasicSettingsPageForMcw() invalid timerType.`);
        }

        return openData;
    }
    async function createDataForCommonWarBasicSettingsPageForCcw(instanceWarRule: IInstanceWarRule, settingsForCommon: ISettingsForCommon, settingsForCcw: ISettingsForCcw): Promise<OpenDataForCommonWarBasicSettingsPage> {
        const bootTimerParams   = Helpers.getExisted(settingsForCcw.bootTimerParams);
        const timerType         = bootTimerParams[0] as Types.BootTimerType;
        const gameConfig        = Helpers.getExisted(await Config.ConfigManager.getGameConfig(Helpers.getExisted(settingsForCommon.configVersion)));
        const warEventFullData  = (await WarMap.WarMapModel.getRawData(Helpers.getExisted(settingsForCcw.mapId)))?.warEventFullData ?? null;
        const openData          : OpenDataForCommonWarBasicSettingsPage = {
            dataArrayForListSettings    : [
                {
                    settingsType    : WarBasicSettingsType.MapId,
                    currentValue    : Helpers.getExisted(settingsForCcw.mapId),
                    instanceWarRule,
                    gameConfig,
                    warEventFullData,
                    callbackOnModify: null,
                },
                {
                    settingsType    : WarBasicSettingsType.WarName,
                    currentValue    : settingsForCcw.warName ?? null,
                    instanceWarRule,
                    gameConfig,
                    warEventFullData,
                    callbackOnModify: null,
                },
                {
                    settingsType    : WarBasicSettingsType.WarPassword,
                    currentValue    : settingsForCcw.warPassword ?? null,
                    instanceWarRule,
                    gameConfig,
                    warEventFullData,
                    callbackOnModify: null,
                },
                {
                    settingsType    : WarBasicSettingsType.WarComment,
                    currentValue    : settingsForCcw.warComment ?? null,
                    instanceWarRule,
                    gameConfig,
                    warEventFullData,
                    callbackOnModify: null,
                },
                {
                    settingsType    : WarBasicSettingsType.WarRuleTitle,
                    currentValue    : null,
                    instanceWarRule,
                    gameConfig,
                    warEventFullData,
                    callbackOnModify: null,
                },
                {
                    settingsType    : WarBasicSettingsType.HasFog,
                    currentValue    : null,
                    instanceWarRule,
                    gameConfig,
                    warEventFullData,
                    callbackOnModify: null,
                },
                {
                    settingsType    : WarBasicSettingsType.Weather,
                    currentValue    : null,
                    instanceWarRule,
                    gameConfig,
                    warEventFullData,
                    callbackOnModify: null,
                },
                {
                    settingsType    : WarBasicSettingsType.WarEvent,
                    currentValue    : null,
                    instanceWarRule,
                    gameConfig,
                    warEventFullData,
                    callbackOnModify: null,
                },
                {
                    settingsType    : WarBasicSettingsType.TurnsLimit,
                    currentValue    : settingsForCommon.turnsLimit ?? CommonConstants.WarMaxTurnsLimit,
                    instanceWarRule,
                    gameConfig,
                    warEventFullData,
                    callbackOnModify: null,
                },
                {
                    settingsType    : WarBasicSettingsType.TimerType,
                    currentValue    : timerType,
                    instanceWarRule,
                    gameConfig,
                    warEventFullData,
                    callbackOnModify: null,
                },
            ],
        };
        if (timerType === Types.BootTimerType.Regular) {
            openData.dataArrayForListSettings.push({
                settingsType    : WarBasicSettingsType.TimerRegularParam,
                currentValue    : bootTimerParams[1],
                instanceWarRule,
                gameConfig,
                warEventFullData,
                callbackOnModify: null,
            });
        } else if (timerType === Types.BootTimerType.Incremental) {
            openData.dataArrayForListSettings.push(
                {
                    settingsType    : WarBasicSettingsType.TimerIncrementalParam1,
                    currentValue    : bootTimerParams[1],
                    instanceWarRule,
                    gameConfig,
                    warEventFullData,
                    callbackOnModify: null,
                },
                {
                    settingsType    : WarBasicSettingsType.TimerIncrementalParam2,
                    currentValue    : bootTimerParams[2],
                    instanceWarRule,
                    gameConfig,
                    warEventFullData,
                    callbackOnModify: null,
                },
            );
        } else {
            throw Helpers.newError(`MpwModel.createDataForCommonWarBasicSettingsPageForCcw() invalid timerType.`);
        }

        return openData;
    }
    async function createDataForCommonWarBasicSettingsPageForMrw(instanceWarRule: IInstanceWarRule, settingsForCommon: ISettingsForCommon, settingsForMrw: ISettingsForMrw): Promise<OpenDataForCommonWarBasicSettingsPage> {
        const bootTimerParams   = CommonConstants.WarBootTimerDefaultParams;
        const timerType         = bootTimerParams[0] as Types.BootTimerType;
        const gameConfig        = Helpers.getExisted(await Config.ConfigManager.getGameConfig(Helpers.getExisted(settingsForCommon.configVersion)));
        const warEventFullData  = (await WarMap.WarMapModel.getRawData(Helpers.getExisted(settingsForMrw.mapId)))?.warEventFullData ?? null;
        const openData          : OpenDataForCommonWarBasicSettingsPage = {
            dataArrayForListSettings    : [
                {
                    settingsType    : WarBasicSettingsType.MapId,
                    currentValue    : Helpers.getExisted(settingsForMrw.mapId),
                    instanceWarRule,
                    gameConfig,
                    warEventFullData,
                    callbackOnModify: null,
                },
                {
                    settingsType    : WarBasicSettingsType.WarRuleTitle,
                    currentValue    : null,
                    instanceWarRule,
                    gameConfig,
                    warEventFullData,
                    callbackOnModify: null,
                },
                {
                    settingsType    : WarBasicSettingsType.HasFog,
                    currentValue    : null,
                    instanceWarRule,
                    gameConfig,
                    warEventFullData,
                    callbackOnModify: null,
                },
                {
                    settingsType    : WarBasicSettingsType.Weather,
                    currentValue    : null,
                    instanceWarRule,
                    gameConfig,
                    warEventFullData,
                    callbackOnModify: null,
                },
                {
                    settingsType    : WarBasicSettingsType.WarEvent,
                    currentValue    : null,
                    instanceWarRule,
                    gameConfig,
                    warEventFullData,
                    callbackOnModify: null,
                },
                {
                    settingsType    : WarBasicSettingsType.TurnsLimit,
                    currentValue    : settingsForCommon.turnsLimit ?? CommonConstants.WarMaxTurnsLimit,
                    instanceWarRule,
                    gameConfig,
                    warEventFullData,
                    callbackOnModify: null,
                },
                {
                    settingsType    : WarBasicSettingsType.TimerType,
                    currentValue    : timerType,
                    instanceWarRule,
                    gameConfig,
                    warEventFullData,
                    callbackOnModify: null,
                },
            ],
        };
        if (timerType === Types.BootTimerType.Regular) {
            openData.dataArrayForListSettings.push({
                settingsType    : WarBasicSettingsType.TimerRegularParam,
                currentValue    : bootTimerParams[1],
                instanceWarRule,
                gameConfig,
                warEventFullData,
                callbackOnModify: null,
            });
        } else if (timerType === Types.BootTimerType.Incremental) {
            openData.dataArrayForListSettings.push(
                {
                    settingsType    : WarBasicSettingsType.TimerIncrementalParam1,
                    currentValue    : bootTimerParams[1],
                    instanceWarRule,
                    gameConfig,
                    warEventFullData,
                    callbackOnModify: null,
                },
                {
                    settingsType    : WarBasicSettingsType.TimerIncrementalParam2,
                    currentValue    : bootTimerParams[2],
                    instanceWarRule,
                    gameConfig,
                    warEventFullData,
                    callbackOnModify: null,
                },
            );
        } else {
            throw Helpers.newError(`MpwModel.createDataForCommonWarBasicSettingsPageForMrw() invalid timerType.`);
        }

        return openData;
    }
    async function createDataForCommonWarBasicSettingsPageForMfw(instanceWarRule: IInstanceWarRule, settingsForCommon: ISettingsForCommon, settingsForMfw: ISettingsForMfw): Promise<OpenDataForCommonWarBasicSettingsPage> {
        const bootTimerParams   = Helpers.getExisted(settingsForMfw.bootTimerParams);
        const timerType         = bootTimerParams[0] as Types.BootTimerType;
        const gameConfig        = Helpers.getExisted(await Config.ConfigManager.getGameConfig(Helpers.getExisted(settingsForCommon.configVersion)));
        const warEventFullData  = instanceWarRule.warEventFullData ?? null;
        const openData          : OpenDataForCommonWarBasicSettingsPage = {
            dataArrayForListSettings    : [
                {
                    settingsType    : WarBasicSettingsType.WarName,
                    currentValue    : settingsForMfw.warName ?? null,
                    instanceWarRule,
                    gameConfig,
                    warEventFullData,
                    callbackOnModify: null,
                },
                {
                    settingsType    : WarBasicSettingsType.WarPassword,
                    currentValue    : settingsForMfw.warPassword ?? null,
                    instanceWarRule,
                    gameConfig,
                    warEventFullData,
                    callbackOnModify: null,
                },
                {
                    settingsType    : WarBasicSettingsType.WarComment,
                    currentValue    : settingsForMfw.warComment ?? null,
                    instanceWarRule,
                    gameConfig,
                    warEventFullData,
                    callbackOnModify: null,
                },
                {
                    settingsType    : WarBasicSettingsType.WarRuleTitle,
                    currentValue    : null,
                    instanceWarRule,
                    gameConfig,
                    warEventFullData,
                    callbackOnModify: null,
                },
                {
                    settingsType    : WarBasicSettingsType.HasFog,
                    currentValue    : null,
                    instanceWarRule,
                    gameConfig,
                    warEventFullData,
                    callbackOnModify: null,
                },
                {
                    settingsType    : WarBasicSettingsType.Weather,
                    currentValue    : null,
                    instanceWarRule,
                    gameConfig,
                    warEventFullData,
                    callbackOnModify: null,
                },
                {
                    settingsType    : WarBasicSettingsType.WarEvent,
                    currentValue    : null,
                    instanceWarRule,
                    gameConfig,
                    warEventFullData,
                    callbackOnModify: null,
                },
                {
                    settingsType    : WarBasicSettingsType.TurnsLimit,
                    currentValue    : settingsForCommon.turnsLimit ?? CommonConstants.WarMaxTurnsLimit,
                    instanceWarRule,
                    gameConfig,
                    warEventFullData,
                    callbackOnModify: null,
                },
                {
                    settingsType    : WarBasicSettingsType.TimerType,
                    currentValue    : timerType,
                    instanceWarRule,
                    gameConfig,
                    warEventFullData,
                    callbackOnModify: null,
                },
            ],
        };
        if (timerType === Types.BootTimerType.Regular) {
            openData.dataArrayForListSettings.push({
                settingsType    : WarBasicSettingsType.TimerRegularParam,
                currentValue    : bootTimerParams[1],
                instanceWarRule,
                gameConfig,
                warEventFullData,
                callbackOnModify: null,
            });
        } else if (timerType === Types.BootTimerType.Incremental) {
            openData.dataArrayForListSettings.push(
                {
                    settingsType    : WarBasicSettingsType.TimerIncrementalParam1,
                    currentValue    : bootTimerParams[1],
                    instanceWarRule,
                    gameConfig,
                    warEventFullData,
                    callbackOnModify: null,
                },
                {
                    settingsType    : WarBasicSettingsType.TimerIncrementalParam2,
                    currentValue    : bootTimerParams[2],
                    instanceWarRule,
                    gameConfig,
                    warEventFullData,
                    callbackOnModify: null,
                },
            );
        } else {
            throw Helpers.newError(`MpwModel.createDataForCommonWarBasicSettingsPageForMfw() invalid timerType.`);
        }

        return openData;
    }

    export async function createDataForCommonWarAdvancedSettingsPage(warId: number | null): Promise<OpenDataForCommonWarAdvancedSettingsPage> {
        const warInfo = warId == null ? null : await getWarSettings(warId);
        if (warInfo == null) {
            return null;
        }

        const settingsForCommon                                                     = Helpers.getExisted(warInfo.settingsForCommon);
        const instanceWarRule                                                       = Helpers.getExisted(settingsForCommon.instanceWarRule);
        const gameConfig                                                            = await Config.ConfigManager.getGameConfig(Helpers.getExisted(settingsForCommon.configVersion));
        const hasFog                                                                = instanceWarRule.ruleForGlobalParams?.hasFogByDefault;
        const { settingsForCcw, settingsForMcw, settingsForMfw, settingsForMrw }    = warInfo;
        if (settingsForCcw) {
            return {
                gameConfig,
                instanceWarRule,
                warType     : hasFog ? Types.WarType.CcwFog : Types.WarType.CcwStd,
            };
        } else if (settingsForMcw) {
            return {
                gameConfig,
                instanceWarRule,
                warType     : hasFog ? Types.WarType.McwFog : Types.WarType.McwStd,
            };
        } else if (settingsForMfw) {
            return {
                gameConfig,
                instanceWarRule,
                warType     : hasFog ? Types.WarType.MfwFog : Types.WarType.MfwStd,
            };
        } else if (settingsForMrw) {
            return {
                gameConfig,
                instanceWarRule,
                warType     : hasFog ? Types.WarType.MrwFog : Types.WarType.MrwStd,
            };
        } else {
            throw Helpers.newError(`MpwModel.createDataForCommonWarAdvancedSettingsPage() invalid warInfo.`);
        }
    }

    export async function createDataForCommonWarPlayerInfoPage(warId: number | null): Promise<OpenDataForCommonWarPlayerInfoPage> {
        const warSettings = warId == null ? null : await getWarSettings(warId);
        if (warSettings == null) {
            return null;
        }

        const warProgressInfo = warId == null ? null : await getWarProgressInfo(warId);
        if (warProgressInfo == null) {
            return null;
        }

        const settingsForCommon = Helpers.getExisted(warSettings.settingsForCommon);
        const instanceWarRule   = Helpers.getExisted(settingsForCommon.instanceWarRule);
        const playerInfoArray   : Common.PlayerInfo[] = [];
        for (const playerInfo of warProgressInfo.playerInfoList || []) {
            const playerIndex   = Helpers.getExisted(playerInfo.playerIndex);
            const userId        = playerInfo.userId ?? null;
            playerInfoArray.push({
                playerIndex,
                teamIndex           : WarHelpers.WarRuleHelpers.getTeamIndex(instanceWarRule, playerIndex),
                isAi                : userId == null,
                userId,
                coId                : Helpers.getExisted(playerInfo.coId),
                unitAndTileSkinId   : Helpers.getExisted(playerInfo.unitAndTileSkinId),
                isReady             : null,
                isInTurn            : playerIndex === warProgressInfo.playerIndexInTurn,
                isDefeat            : !playerInfo.isAlive,
                restTimeToBoot      : playerInfo.restTimeToBoot ?? null,
            });
        }

        return {
            gameConfig              : await Config.ConfigManager.getGameConfig(Helpers.getExisted(settingsForCommon.configVersion)),
            playersCountUnneutral   : WarHelpers.WarRuleHelpers.getPlayersCountUnneutral(instanceWarRule),
            roomOwnerPlayerIndex    : null,
            callbackOnDeletePlayer  : null,
            callbackOnExitRoom      : null,
            playerInfoArray,
            enterTurnTime           : warProgressInfo.enterTurnTime ?? null,
        };
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for managing war.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    export async function loadWar(data: ISerialWar): Promise<MpwWar> {
        if (getWar()) {
            Logger.warn(`MpwModel.loadWar() another war has been loaded already!`);
            unloadWar();
        }

        const war = createWarByWarData(data);
        war.init(data, await Config.ConfigManager.getGameConfig(Helpers.getExisted(data.settingsForCommon?.configVersion)));
        war.startRunning().startRunningView();
        _setWar(war);

        return war;
    }
    export function unloadWar(): void {
        const war = getWar();
        if (war) {
            war.stopRunning();
            _setWar(null);
            _cachedActions.length = 0;
        }
    }

    export function getWar(): MpwWar | null {
        return _war;
    }
    function _setWar(war: MpwWar | null): void {
        _war = war;
    }

    function _onNotifyMsgMpwWatchGetIncomingInfo(e: egret.Event): void {
        const data  = e.data as CommonProto.NetMessage.MsgMpwWatchGetIncomingInfo.IS;
        const war   = getWar();
        if (war?.getWarId() !== Helpers.getExisted(data.warId)) {
            return;
        }

        const player = war.getPlayerLoggedIn();
        if (player == null) {
            return;
        }

        const info = data.incomingInfo;
        player.setWatchOngoingSrcUserIds(info?.ongoingSrcUserIdArray ?? []);
        player.setWatchRequestSrcUserIds(info?.requestSrcUserIdArray ?? []);
    }
    function _onNotifyMsgMpwWatchGetOutgoingInfo(e: egret.Event): void {
        const data  = e.data as CommonProto.NetMessage.MsgMpwWatchGetOutgoingInfo.IS;
        const war   = getWar();
        if (war?.getWarId() !== Helpers.getExisted(data.warId)) {
            return;
        }

        const info = data.outgoingInfo;
        if (info == null) {
            return;
        }

        const selfUserId            = Helpers.getExisted(User.UserModel.getSelfUserId());
        const ongoingDstUserIdArray = info.ongoingDstUserIdArray ?? [];
        const requestDstUserIdArray = info.requestDstUserIdArray ?? [];
        for (const [, player] of war.getPlayerManager().getAllPlayersDict()) {
            const userId = player.getUserId();
            if (userId == null) {
                continue;
            }

            if (ongoingDstUserIdArray.indexOf(userId) >= 0) {
                player.addWatchOngoingSrcUserId(selfUserId);
            } else {
                player.removeWatchOngoingSrcUserId(selfUserId);
            }

            if (requestDstUserIdArray.indexOf(userId) >= 0) {
                player.addWatchRequestSrcUserId(selfUserId);
            } else {
                player.removeWatchRequestSrcUserId(selfUserId);
            }
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Handlers for war actions that McwProxy receives.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    export function updateOnPlayerSyncWar(data: CommonProto.NetMessage.MsgMpwCommonSyncWar.IS): void {
        const war = getWar();
        if ((war) && (war.getWarId() === data.warId)) {
            _cachedSyncWarData = data;
            checkAndSyncWarOrRunCachedAction(war, _cachedActions);
        }
    }

    export function updateOnMsgMpwExecuteWarAction(container: IWarActionContainer, warId: number): void {
        const war = getWar();
        if ((war) && (war.getWarId() === warId)) {
            if (container.actionId !== war.getExecutedActionManager().getExecutedActionsCount() + _cachedActions.length) {
                MpwProxy.reqMpwCommonSyncWar(war, Types.SyncWarRequestType.ReconnectionRequest);
            } else {
                _cachedActions.push(container);
                checkAndSyncWarOrRunCachedAction(war, _cachedActions);
            }
        }
    }

    async function checkAndSyncWarOrRunCachedAction(war: MpwWar, actionList: IWarActionContainer[]): Promise<void> {
        if ((!war.getIsRunning()) || (war.getIsEnded()) || (war.getIsExecutingAction())) {
            return;
        }

        for (;;) {
            const syncWarData = _cachedSyncWarData;
            if (syncWarData == null) {
                break;
            }

            const cachedActionsCount    = _cachedActions.length;
            const executedActionsCount  = war.getExecutedActionManager().getExecutedActionsCount();
            if ((war.getWarId() !== syncWarData.warId)                                                                                          ||
                ((syncWarData.executedActionsCount != null) && (syncWarData.executedActionsCount < executedActionsCount + cachedActionsCount))
            ) {
                _cachedSyncWarData = null;
                break;
            }

            const status    = syncWarData.status as Types.SyncWarStatus;
            const warData   = syncWarData.war;
            if (status === Types.SyncWarStatus.Defeated) {
                war.setIsEnded(true);
                PanelHelpers.open(PanelHelpers.PanelDict.CommonAlertPanel, {
                    title   : Lang.getText(LangTextType.B0088),
                    content : Lang.getText(LangTextType.A0023),
                    callback: () => {
                        FlowManager.gotoMyWarListPanel(war.getWarType());
                    },
                });
                return;

            } else if (status === Types.SyncWarStatus.EndedOrNotExists) {
                war.setIsEnded(true);
                PanelHelpers.open(PanelHelpers.PanelDict.CommonAlertPanel, {
                    title   : Lang.getText(LangTextType.B0088),
                    content : Lang.getText(LangTextType.A0035),
                    callback: () => {
                        FlowManager.gotoMyWarListPanel(war.getWarType());
                    },
                });
                return;

            } else if (status === Types.SyncWarStatus.NoError) {
                const requestType = syncWarData.requestType as Types.SyncWarRequestType;
                if (requestType === Types.SyncWarRequestType.PlayerForce) {
                    war.setIsEnded(true);
                    if (warData == null) {
                        throw Helpers.newError(`MpwModel.updateOnPlayerSyncWar() empty warData 1.`);
                    } else {
                        await FlowManager.gotoMultiPlayerWar(warData);
                        FloatText.show(Lang.getText(LangTextType.A0038));
                    }
                    return;

                } else {
                    if (syncWarData.executedActionsCount !== executedActionsCount + cachedActionsCount) {
                        war.setIsEnded(true);
                        if (warData == null) {
                            throw Helpers.newError(`MpwModel.updateOnPlayerSyncWar() empty warData 2.`);
                        } else {
                            await FlowManager.gotoMultiPlayerWar(warData);
                            FloatText.show(Lang.getText(LangTextType.A0036));
                        }
                        return;

                    } else {
                        if (requestType === Types.SyncWarRequestType.PlayerRequest) {
                            FloatText.show(Lang.getText(LangTextType.A0038));
                        } else {
                            // Nothing to do.
                        }
                        break;
                    }
                }

            } else if (status === Types.SyncWarStatus.NotJoined) {
                // Something wrong!!
                war.setIsEnded(true);
                PanelHelpers.open(PanelHelpers.PanelDict.CommonAlertPanel, {
                    title   : Lang.getText(LangTextType.B0088),
                    content : Lang.getText(LangTextType.A0037),
                    callback: () => FlowManager.gotoLobby(),
                });
                return;

            } else if (status === Types.SyncWarStatus.Synchronized) {
                const requestType = syncWarData.requestType as Types.SyncWarRequestType;
                if (requestType === Types.SyncWarRequestType.PlayerRequest) {
                    FloatText.show(Lang.getText(LangTextType.A0038));
                } else {
                    // Nothing to do.
                }
                break;

            } else {
                // Something wrong!!
                war.setIsEnded(true);
                PanelHelpers.open(PanelHelpers.PanelDict.CommonAlertPanel, {
                    title   : Lang.getText(LangTextType.B0088),
                    content : Lang.getText(LangTextType.A0037),
                    callback: () => FlowManager.gotoLobby(),
                });
                return;
            }
        }

        const container = actionList.shift();
        if (container == null) {
            return;
        }

        const selfUserId = Helpers.getExisted(User.UserModel.getSelfUserId());
        war.getExecutedActionManager().addExecutedAction(container);
        await WarHelpers.WarActionExecutor.checkAndExecute(war, container, false);

        const selfPlayer        = war.getPlayerManager().getPlayerByUserId(selfUserId);
        const callbackForGoBack = () => {
            FlowManager.gotoMyWarListPanel(war.getWarType());
        };
        if (war.getIsEnded()) {
            if (war.getDrawVoteManager().getRemainingVotes() === 0) {
                PanelHelpers.open(PanelHelpers.PanelDict.CommonAlertPanel, {
                    title   : Lang.getText(LangTextType.B0088),
                    content : Lang.getText(LangTextType.A0030),
                    callback: callbackForGoBack,
                });
            } else {
                if (selfPlayer == null) {
                    PanelHelpers.open(PanelHelpers.PanelDict.CommonAlertPanel, {
                        title   : Lang.getText(LangTextType.B0088),
                        content : Lang.getText(LangTextType.A0035),
                        callback: callbackForGoBack,
                    });
                } else {
                    PanelHelpers.open(PanelHelpers.PanelDict.CommonAlertPanel, {
                        title   : Lang.getText(LangTextType.B0088),
                        content : selfPlayer.getAliveState() === Types.PlayerAliveState.Alive ? Lang.getText(LangTextType.A0022) : Lang.getText(LangTextType.A0023),
                        callback: callbackForGoBack,
                    });
                }
            }
        } else {
            if (war.getIsRunning()) {
                if (!war.getPlayerManager().getWatcherTeamIndexesForSelf().size) {
                    war.setIsEnded(true);
                    PanelHelpers.open(PanelHelpers.PanelDict.CommonAlertPanel, {
                        title   : Lang.getText(LangTextType.B0035),
                        content : selfPlayer ? Lang.getText(LangTextType.A0023) : Lang.getText(LangTextType.A0152),
                        callback: callbackForGoBack,
                    });
                } else {
                    checkAndSyncWarOrRunCachedAction(war, actionList);
                }
            }
        }
    }

    function createWarByWarData(data: CommonProto.WarSerialization.ISerialWar): MpwWar {
        if (data.settingsForMcw) {
            return new McwWar();
        } else if (data.settingsForMrw) {
            return new MrwWar();
        } else if (data.settingsForMfw) {
            return new MfwWar();
        } else if (data.settingsForCcw) {
            return new CcwWar();
        } else {
            throw Helpers.newError(`Invalid data.`);
        }
    }
}

// export default MpwModel;
