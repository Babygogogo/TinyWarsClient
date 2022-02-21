
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
// import TwnsNotifyType                       from "../../tools/notify/NotifyType";
// import ProtoTypes                           from "../../tools/proto/ProtoTypes";
// import WarActionExecutor                    from "../../tools/warHelpers/WarActionExecutor";
// import WarRuleHelpers                       from "../../tools/warHelpers/WarRuleHelpers";
// import UserModel                            from "../../user/model/UserModel";
// import WarMapModel                          from "../../warMap/model/WarMapModel";
// import TwnsMpwWar                           from "./MpwWar";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace MpwModel {
    import MpwWar                                   = TwnsMpwWar.MpwWar;
    import CcwWar                                   = TwnsCcwWar.CcwWar;
    import McwWar                                   = TwnsMcwWar.McwWar;
    import MfwWar                                   = TwnsMfwWar.MfwWar;
    import MrwWar                                   = TwnsMrwWar.MrwWar;
    import LangTextType                             = TwnsLangTextType.LangTextType;
    import NotifyType                               = TwnsNotifyType.NotifyType;
    import WarBasicSettingsType                     = Types.WarBasicSettingsType;
    import IWarActionContainer                      = ProtoTypes.WarAction.IWarActionContainer;
    import IWarRule                                 = ProtoTypes.WarRule.IWarRule;
    import IMpwWarSettings                          = ProtoTypes.MultiPlayerWar.IMpwWarSettings;
    import IMpwWarProgressInfo                      = ProtoTypes.MultiPlayerWar.IMpwWarProgressInfo;
    import ISettingsForCommon                       = ProtoTypes.WarSettings.ISettingsForCommon;
    import ISettingsForMcw                          = ProtoTypes.WarSettings.ISettingsForMcw;
    import ISettingsForCcw                          = ProtoTypes.WarSettings.ISettingsForCcw;
    import ISettingsForMrw                          = ProtoTypes.WarSettings.ISettingsForMrw;
    import ISettingsForMfw                          = ProtoTypes.WarSettings.ISettingsForMfw;
    import ISerialWar                               = ProtoTypes.WarSerialization.ISerialWar;
    import MsgMpwCommonGetWarSettingsIs             = ProtoTypes.NetMessage.MsgMpwCommonGetWarSettings.IS;
    import MsgMpwCommonGetWarProgressInfoIs         = ProtoTypes.NetMessage.MsgMpwCommonGetWarProgressInfo.IS;
    import OpenDataForCommonWarBasicSettingsPage    = TwnsCommonWarBasicSettingsPage.OpenDataForCommonWarBasicSettingsPage;
    import OpenDataForCommonWarAdvancedSettingsPage = TwnsCommonWarAdvancedSettingsPage.OpenDataForCommonWarAdvancedSettingsPage;
    import OpenDataForCommonWarPlayerInfoPage       = TwnsCommonWarPlayerInfoPage.OpenDataForCommonWarPlayerInfoPage;

    const _NOTIFY_LISTENERS     : Notify.Listener[] = [
        { type  : NotifyType.MsgMpwWatchGetIncomingInfo,    callback: _onNotifyMsgMpwWatchGetIncomingInfo },
    ];
    let _allMyWarIdArray        : number[] = [];
    let _mcwPreviewingWarId     : number | null = null;
    let _mrwPreviewingWarId     : number | null = null;
    let _mfwPreviewingWarId     : number | null = null;
    let _ccwPreviewingWarId     : number | null = null;
    let _war                    : MpwWar | null = null;
    let _cachedSyncWarData      : ProtoTypes.NetMessage.MsgMpwCommonSyncWar.IS | null = null;
    const _cachedActions        : IWarActionContainer[] = [];

    export function init(): void {
        Notify.addEventListeners(_NOTIFY_LISTENERS);
    }

    export function setAllMyWarIdArray(idArray: number[]): void {
        _allMyWarIdArray = idArray || [];
    }
    export async function getMyMcwWarIdArray(): Promise<number[]> {
        const warIdArray: number[] = [];
        for (const warId of _allMyWarIdArray) {
            if ((await getWarSettings(warId))?.settingsForMcw) {
                warIdArray.push(warId);
            }
        }
        return warIdArray;
    }
    export async function getMyMrwWarIdArray(): Promise<number[]> {
        const warIdArray: number[] = [];
        for (const warId of _allMyWarIdArray) {
            if ((await getWarSettings(warId))?.settingsForMrw) {
                warIdArray.push(warId);
            }
        }
        return warIdArray;
    }
    export async function getMyMfwWarIdArray(): Promise<number[]> {
        const warIdArray: number[] = [];
        for (const warId of _allMyWarIdArray) {
            if ((await getWarSettings(warId))?.settingsForMfw) {
                warIdArray.push(warId);
            }
        }
        return warIdArray;
    }
    export async function getMyCcwWarIdArray(): Promise<number[]> {
        const warIdArray: number[] = [];
        for (const warId of _allMyWarIdArray) {
            if ((await getWarSettings(warId))?.settingsForCcw) {
                warIdArray.push(warId);
            }
        }
        return warIdArray;
    }

    export function getMcwPreviewingWarId(): number | null {
        return _mcwPreviewingWarId;
    }
    export function setMcwPreviewingWarId(warId: number | null): void {
        if (getMcwPreviewingWarId() != warId) {
            _mcwPreviewingWarId = warId;
            Notify.dispatch(NotifyType.McwPreviewingWarIdChanged);
        }
    }

    export function getMrwPreviewingWarId(): number | null {
        return _mrwPreviewingWarId;
    }
    export function setMrwPreviewingWarId(warId: number | null): void {
        if (getMrwPreviewingWarId() != warId) {
            _mrwPreviewingWarId = warId;
            Notify.dispatch(NotifyType.MrwPreviewingWarIdChanged);
        }
    }

    export function getMfwPreviewingWarId(): number | null {
        return _mfwPreviewingWarId;
    }
    export function setMfwPreviewingWarId(warId: number | null): void {
        if (getMfwPreviewingWarId() != warId) {
            _mfwPreviewingWarId = warId;
            Notify.dispatch(NotifyType.MfwPreviewingWarIdChanged);
        }
    }

    export function getCcwPreviewingWarId(): number | null {
        return _ccwPreviewingWarId;
    }
    export function setCcwPreviewingWarId(warId: number | null): void {
        if (getCcwPreviewingWarId() != warId) {
            _ccwPreviewingWarId = warId;
            Notify.dispatch(NotifyType.CcwPreviewingWarIdChanged);
        }
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
            const selfUserId = UserModel.getSelfUserId();
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
    const _warSettingsDict      = new Map<number, IMpwWarSettings | null>();
    const _warSettingsGetter    = Helpers.createCachedDataGetter({
        dataDict                : _warSettingsDict,
        reqData                 : (warId: number) => MpwProxy.reqMpwCommonGetWarSettings(warId),
    });

    export function getWarSettings(warId: number): Promise<IMpwWarSettings | null> {
        return _warSettingsGetter.getData(warId);
    }

    export async function updateOnMsgMpwCommonGetWarSettings(data: MsgMpwCommonGetWarSettingsIs): Promise<void> {
        const warId = Helpers.getExisted(data.warId);
        _warSettingsDict.set(warId, data.warSettings ?? null);
        _warSettingsGetter.dataUpdated(warId);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for war progress info.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    const _warProgressInfoDict      = new Map<number, IMpwWarProgressInfo | null >();
    const _warProgressInfoGetter    = Helpers.createCachedDataGetter({
        dataDict                : _warProgressInfoDict,
        reqData                 : (warId: number) => MpwProxy.reqMpwCommonGetWarProgressInfo(warId),
    });

    export function getWarProgressInfo(warId: number): Promise<IMpwWarProgressInfo | null> {
        return _warProgressInfoGetter.getData(warId);
    }

    export async function updateOnMsgMpwCommonGetWarProgressInfo(data: MsgMpwCommonGetWarProgressInfoIs): Promise<void> {
        const warId = Helpers.getExisted(data.warId);
        _warProgressInfoDict.set(warId, data.warProgressInfo ?? null);
        _warProgressInfoGetter.dataUpdated(warId);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    export async function createDataForCommonWarBasicSettingsPage(warId: number | null): Promise<OpenDataForCommonWarBasicSettingsPage> {
        const warInfo = warId == null ? null : await getWarSettings(warId);
        if (warInfo == null) {
            return null;
        }

        const settingsForCommon                                                     = Helpers.getExisted(warInfo.settingsForCommon);
        const warRule                                                               = Helpers.getExisted(settingsForCommon.warRule);
        const { settingsForCcw, settingsForMcw, settingsForMfw, settingsForMrw }    = warInfo;
        if (settingsForMcw) {
            return await createDataForCommonWarBasicSettingsPageForMcw(warRule, settingsForCommon, settingsForMcw);
        } else if (settingsForCcw) {
            return await createDataForCommonWarBasicSettingsPageForCcw(warRule, settingsForCommon, settingsForCcw);
        } else if (settingsForMrw) {
            return await createDataForCommonWarBasicSettingsPageForMrw(warRule, settingsForCommon, settingsForMrw);
        } else if (settingsForMfw) {
            return await createDataForCommonWarBasicSettingsPageForMfw(warRule, settingsForCommon, settingsForMfw);
        } else {
            throw Helpers.newError(`Invalid warInfo.`);
        }
    }
    async function createDataForCommonWarBasicSettingsPageForMcw(warRule: IWarRule, settingsForCommon: ISettingsForCommon, settingsForMcw: ISettingsForMcw): Promise<OpenDataForCommonWarBasicSettingsPage> {
        const bootTimerParams   = Helpers.getExisted(settingsForMcw.bootTimerParams);
        const timerType         = bootTimerParams[0] as Types.BootTimerType;
        const openData          : OpenDataForCommonWarBasicSettingsPage = {
            dataArrayForListSettings    : [
                {
                    settingsType    : WarBasicSettingsType.MapName,
                    currentValue    : await WarMapModel.getMapNameInCurrentLanguage(Helpers.getExisted(settingsForMcw.mapId)),
                    warRule,
                    callbackOnModify: null,
                },
                {
                    settingsType    : WarBasicSettingsType.WarName,
                    currentValue    : settingsForMcw.warName ?? null,
                    warRule,
                    callbackOnModify: null,
                },
                {
                    settingsType    : WarBasicSettingsType.WarPassword,
                    currentValue    : settingsForMcw.warPassword ?? null,
                    warRule,
                    callbackOnModify: null,
                },
                {
                    settingsType    : WarBasicSettingsType.WarComment,
                    currentValue    : settingsForMcw.warComment ?? null,
                    warRule,
                    callbackOnModify: null,
                },
                {
                    settingsType    : WarBasicSettingsType.WarRuleTitle,
                    currentValue    : null,
                    warRule,
                    callbackOnModify: null,
                },
                {
                    settingsType    : WarBasicSettingsType.HasFog,
                    currentValue    : null,
                    warRule,
                    callbackOnModify: null,
                },
                {
                    settingsType    : WarBasicSettingsType.Weather,
                    currentValue    : null,
                    warRule,
                    callbackOnModify: null,
                },
                {
                    settingsType    : WarBasicSettingsType.TurnsLimit,
                    currentValue    : settingsForCommon.turnsLimit ?? CommonConstants.WarMaxTurnsLimit,
                    warRule,
                    callbackOnModify: null,
                },
                {
                    settingsType    : WarBasicSettingsType.TimerType,
                    currentValue    : timerType,
                    warRule,
                    callbackOnModify: null,
                },
            ],
        };
        if (timerType === Types.BootTimerType.Regular) {
            openData.dataArrayForListSettings.push({
                settingsType    : WarBasicSettingsType.TimerRegularParam,
                currentValue    : bootTimerParams[1],
                warRule,
                callbackOnModify: null,
            });
        } else if (timerType === Types.BootTimerType.Incremental) {
            openData.dataArrayForListSettings.push(
                {
                    settingsType    : WarBasicSettingsType.TimerIncrementalParam1,
                    currentValue    : bootTimerParams[1],
                    warRule,
                    callbackOnModify: null,
                },
                {
                    settingsType    : WarBasicSettingsType.TimerIncrementalParam2,
                    currentValue    : bootTimerParams[2],
                    warRule,
                    callbackOnModify: null,
                },
            );
        } else {
            throw Helpers.newError(`MpwModel.createDataForCommonWarBasicSettingsPageForMcw() invalid timerType.`);
        }

        return openData;
    }
    async function createDataForCommonWarBasicSettingsPageForCcw(warRule: IWarRule, settingsForCommon: ISettingsForCommon, settingsForCcw: ISettingsForCcw): Promise<OpenDataForCommonWarBasicSettingsPage> {
        const bootTimerParams   = Helpers.getExisted(settingsForCcw.bootTimerParams);
        const timerType         = bootTimerParams[0] as Types.BootTimerType;
        const openData          : OpenDataForCommonWarBasicSettingsPage = {
            dataArrayForListSettings    : [
                {
                    settingsType    : WarBasicSettingsType.MapName,
                    currentValue    : await WarMapModel.getMapNameInCurrentLanguage(Helpers.getExisted(settingsForCcw.mapId)),
                    warRule,
                    callbackOnModify: null,
                },
                {
                    settingsType    : WarBasicSettingsType.WarName,
                    currentValue    : settingsForCcw.warName ?? null,
                    warRule,
                    callbackOnModify: null,
                },
                {
                    settingsType    : WarBasicSettingsType.WarPassword,
                    currentValue    : settingsForCcw.warPassword ?? null,
                    warRule,
                    callbackOnModify: null,
                },
                {
                    settingsType    : WarBasicSettingsType.WarComment,
                    currentValue    : settingsForCcw.warComment ?? null,
                    warRule,
                    callbackOnModify: null,
                },
                {
                    settingsType    : WarBasicSettingsType.WarRuleTitle,
                    currentValue    : null,
                    warRule,
                    callbackOnModify: null,
                },
                {
                    settingsType    : WarBasicSettingsType.HasFog,
                    currentValue    : null,
                    warRule,
                    callbackOnModify: null,
                },
                {
                    settingsType    : WarBasicSettingsType.Weather,
                    currentValue    : null,
                    warRule,
                    callbackOnModify: null,
                },
                {
                    settingsType    : WarBasicSettingsType.TurnsLimit,
                    currentValue    : settingsForCommon.turnsLimit ?? CommonConstants.WarMaxTurnsLimit,
                    warRule,
                    callbackOnModify: null,
                },
                {
                    settingsType    : WarBasicSettingsType.TimerType,
                    currentValue    : timerType,
                    warRule,
                    callbackOnModify: null,
                },
            ],
        };
        if (timerType === Types.BootTimerType.Regular) {
            openData.dataArrayForListSettings.push({
                settingsType    : WarBasicSettingsType.TimerRegularParam,
                currentValue    : bootTimerParams[1],
                warRule,
                callbackOnModify: null,
            });
        } else if (timerType === Types.BootTimerType.Incremental) {
            openData.dataArrayForListSettings.push(
                {
                    settingsType    : WarBasicSettingsType.TimerIncrementalParam1,
                    currentValue    : bootTimerParams[1],
                    warRule,
                    callbackOnModify: null,
                },
                {
                    settingsType    : WarBasicSettingsType.TimerIncrementalParam2,
                    currentValue    : bootTimerParams[2],
                    warRule,
                    callbackOnModify: null,
                },
            );
        } else {
            throw Helpers.newError(`MpwModel.createDataForCommonWarBasicSettingsPageForCcw() invalid timerType.`);
        }

        return openData;
    }
    async function createDataForCommonWarBasicSettingsPageForMrw(warRule: IWarRule, settingsForCommon: ISettingsForCommon, settingsForMrw: ISettingsForMrw): Promise<OpenDataForCommonWarBasicSettingsPage> {
        const bootTimerParams   = CommonConstants.WarBootTimerDefaultParams;
        const timerType         = bootTimerParams[0] as Types.BootTimerType;
        const openData          : OpenDataForCommonWarBasicSettingsPage = {
            dataArrayForListSettings    : [
                {
                    settingsType    : WarBasicSettingsType.MapName,
                    currentValue    : await WarMapModel.getMapNameInCurrentLanguage(Helpers.getExisted(settingsForMrw.mapId)),
                    warRule,
                    callbackOnModify: null,
                },
                {
                    settingsType    : WarBasicSettingsType.WarRuleTitle,
                    currentValue    : null,
                    warRule,
                    callbackOnModify: null,
                },
                {
                    settingsType    : WarBasicSettingsType.HasFog,
                    currentValue    : null,
                    warRule,
                    callbackOnModify: null,
                },
                {
                    settingsType    : WarBasicSettingsType.Weather,
                    currentValue    : null,
                    warRule,
                    callbackOnModify: null,
                },
                {
                    settingsType    : WarBasicSettingsType.TurnsLimit,
                    currentValue    : settingsForCommon.turnsLimit ?? CommonConstants.WarMaxTurnsLimit,
                    warRule,
                    callbackOnModify: null,
                },
                {
                    settingsType    : WarBasicSettingsType.TimerType,
                    currentValue    : timerType,
                    warRule,
                    callbackOnModify: null,
                },
            ],
        };
        if (timerType === Types.BootTimerType.Regular) {
            openData.dataArrayForListSettings.push({
                settingsType    : WarBasicSettingsType.TimerRegularParam,
                currentValue    : bootTimerParams[1],
                warRule,
                callbackOnModify: null,
            });
        } else if (timerType === Types.BootTimerType.Incremental) {
            openData.dataArrayForListSettings.push(
                {
                    settingsType    : WarBasicSettingsType.TimerIncrementalParam1,
                    currentValue    : bootTimerParams[1],
                    warRule,
                    callbackOnModify: null,
                },
                {
                    settingsType    : WarBasicSettingsType.TimerIncrementalParam2,
                    currentValue    : bootTimerParams[2],
                    warRule,
                    callbackOnModify: null,
                },
            );
        } else {
            throw Helpers.newError(`MpwModel.createDataForCommonWarBasicSettingsPageForMrw() invalid timerType.`);
        }

        return openData;
    }
    async function createDataForCommonWarBasicSettingsPageForMfw(warRule: IWarRule, settingsForCommon: ISettingsForCommon, settingsForMfw: ISettingsForMfw): Promise<OpenDataForCommonWarBasicSettingsPage> {
        const bootTimerParams   = Helpers.getExisted(settingsForMfw.bootTimerParams);
        const timerType         = bootTimerParams[0] as Types.BootTimerType;
        const openData          : OpenDataForCommonWarBasicSettingsPage = {
            dataArrayForListSettings    : [
                {
                    settingsType    : WarBasicSettingsType.WarName,
                    currentValue    : settingsForMfw.warName ?? null,
                    warRule,
                    callbackOnModify: null,
                },
                {
                    settingsType    : WarBasicSettingsType.WarPassword,
                    currentValue    : settingsForMfw.warPassword ?? null,
                    warRule,
                    callbackOnModify: null,
                },
                {
                    settingsType    : WarBasicSettingsType.WarComment,
                    currentValue    : settingsForMfw.warComment ?? null,
                    warRule,
                    callbackOnModify: null,
                },
                {
                    settingsType    : WarBasicSettingsType.WarRuleTitle,
                    currentValue    : null,
                    warRule,
                    callbackOnModify: null,
                },
                {
                    settingsType    : WarBasicSettingsType.HasFog,
                    currentValue    : null,
                    warRule,
                    callbackOnModify: null,
                },
                {
                    settingsType    : WarBasicSettingsType.Weather,
                    currentValue    : null,
                    warRule,
                    callbackOnModify: null,
                },
                {
                    settingsType    : WarBasicSettingsType.TurnsLimit,
                    currentValue    : settingsForCommon.turnsLimit ?? CommonConstants.WarMaxTurnsLimit,
                    warRule,
                    callbackOnModify: null,
                },
                {
                    settingsType    : WarBasicSettingsType.TimerType,
                    currentValue    : timerType,
                    warRule,
                    callbackOnModify: null,
                },
            ],
        };
        if (timerType === Types.BootTimerType.Regular) {
            openData.dataArrayForListSettings.push({
                settingsType    : WarBasicSettingsType.TimerRegularParam,
                currentValue    : bootTimerParams[1],
                warRule,
                callbackOnModify: null,
            });
        } else if (timerType === Types.BootTimerType.Incremental) {
            openData.dataArrayForListSettings.push(
                {
                    settingsType    : WarBasicSettingsType.TimerIncrementalParam1,
                    currentValue    : bootTimerParams[1],
                    warRule,
                    callbackOnModify: null,
                },
                {
                    settingsType    : WarBasicSettingsType.TimerIncrementalParam2,
                    currentValue    : bootTimerParams[2],
                    warRule,
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
        const warRule                                                               = Helpers.getExisted(settingsForCommon.warRule);
        const configVersion                                                         = Helpers.getExisted(settingsForCommon.configVersion);
        const hasFog                                                                = warRule.ruleForGlobalParams?.hasFogByDefault;
        const { settingsForCcw, settingsForMcw, settingsForMfw, settingsForMrw }    = warInfo;
        if (settingsForCcw) {
            return {
                configVersion,
                warRule,
                warType     : hasFog ? Types.WarType.CcwFog : Types.WarType.CcwStd,
            };
        } else if (settingsForMcw) {
            return {
                configVersion,
                warRule,
                warType     : hasFog ? Types.WarType.McwFog : Types.WarType.McwStd,
            };
        } else if (settingsForMfw) {
            return {
                configVersion,
                warRule,
                warType     : hasFog ? Types.WarType.MfwFog : Types.WarType.MfwStd,
            };
        } else if (settingsForMrw) {
            return {
                configVersion,
                warRule,
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
        const warRule           = Helpers.getExisted(settingsForCommon.warRule);
        const playerInfoArray   : TwnsCommonWarPlayerInfoPage.PlayerInfo[] = [];
        for (const playerInfo of warProgressInfo.playerInfoList || []) {
            const playerIndex   = Helpers.getExisted(playerInfo.playerIndex);
            const userId        = playerInfo.userId ?? null;
            playerInfoArray.push({
                playerIndex,
                teamIndex           : WarRuleHelpers.getTeamIndex(warRule, playerIndex),
                isAi                : userId == null,
                userId,
                coId                : Helpers.getExisted(playerInfo.coId),
                unitAndTileSkinId   : Helpers.getExisted(playerInfo.unitAndTileSkinId),
                isReady             : null,
                isInTurn            : playerIndex === warProgressInfo.playerIndexInTurn,
                isDefeat            : !playerInfo.isAlive,
            });
        }

        return {
            configVersion           : Helpers.getExisted(settingsForCommon.configVersion),
            playersCountUnneutral   : WarRuleHelpers.getPlayersCountUnneutral(warRule),
            roomOwnerPlayerIndex    : null,
            callbackOnDeletePlayer  : null,
            callbackOnExitRoom      : null,
            playerInfoArray,
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
        await war.init(data);
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
        const data  = e.data as ProtoTypes.NetMessage.MsgMpwWatchGetIncomingInfo.IS;
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

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Handlers for war actions that McwProxy receives.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    export function updateOnPlayerSyncWar(data: ProtoTypes.NetMessage.MsgMpwCommonSyncWar.IS): void {
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
                TwnsPanelManager.open(TwnsPanelConfig.Dict.CommonAlertPanel, {
                    title   : Lang.getText(LangTextType.B0088),
                    content : Lang.getText(LangTextType.A0023),
                    callback: () => {
                        FlowManager.gotoMyWarListPanel(war.getWarType());
                    },
                });
                return;

            } else if (status === Types.SyncWarStatus.EndedOrNotExists) {
                war.setIsEnded(true);
                TwnsPanelManager.open(TwnsPanelConfig.Dict.CommonAlertPanel, {
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
                TwnsPanelManager.open(TwnsPanelConfig.Dict.CommonAlertPanel, {
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
                TwnsPanelManager.open(TwnsPanelConfig.Dict.CommonAlertPanel, {
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

        const selfUserId = Helpers.getExisted(UserModel.getSelfUserId());
        war.getExecutedActionManager().addExecutedAction(container);
        await WarActionExecutor.checkAndExecute(war, container, false);

        const selfPlayer        = war.getPlayerManager().getPlayerByUserId(selfUserId);
        const callbackForGoBack = () => {
            FlowManager.gotoMyWarListPanel(war.getWarType());
        };
        if (war.getIsEnded()) {
            if (war.getDrawVoteManager().getRemainingVotes() === 0) {
                TwnsPanelManager.open(TwnsPanelConfig.Dict.CommonAlertPanel, {
                    title   : Lang.getText(LangTextType.B0088),
                    content : Lang.getText(LangTextType.A0030),
                    callback: callbackForGoBack,
                });
            } else {
                if (selfPlayer == null) {
                    TwnsPanelManager.open(TwnsPanelConfig.Dict.CommonAlertPanel, {
                        title   : Lang.getText(LangTextType.B0088),
                        content : Lang.getText(LangTextType.A0035),
                        callback: callbackForGoBack,
                    });
                } else {
                    TwnsPanelManager.open(TwnsPanelConfig.Dict.CommonAlertPanel, {
                        title   : Lang.getText(LangTextType.B0088),
                        content : selfPlayer.getAliveState() === Types.PlayerAliveState.Alive ? Lang.getText(LangTextType.A0022) : Lang.getText(LangTextType.A0023),
                        callback: callbackForGoBack,
                    });
                }
            }
        } else {
            if (war.getIsRunning()) {
                if (!war.getPlayerManager().getAliveWatcherTeamIndexesForSelf().size) {
                    war.setIsEnded(true);
                    TwnsPanelManager.open(TwnsPanelConfig.Dict.CommonAlertPanel, {
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

    function createWarByWarData(data: ProtoTypes.WarSerialization.ISerialWar): MpwWar {
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
