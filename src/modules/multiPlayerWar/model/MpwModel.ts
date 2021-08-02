
import TwnsCommonAlertPanel                 from "../../common/view/CommonAlertPanel";
import TwnsCommonWarAdvancedSettingsPage    from "../../common/view/CommonWarAdvancedSettingsPage";
import TwnsCommonWarBasicSettingsPage       from "../../common/view/CommonWarBasicSettingsPage";
import TwnsCommonWarPlayerInfoPage          from "../../common/view/CommonWarPlayerInfoPage";
import TwnsCcwWar                           from "../../coopCustomWar/model/CcwWar";
import TwnsMcwWar                           from "../../multiCustomWar/model/McwWar";
import TwnsMfwWar                           from "../../multiFreeWar/model/MfwWar";
import MpwProxy                             from "../../multiPlayerWar/model/MpwProxy";
import TwnsMrwWar                           from "../../multiRankWar/model/MrwWar";
import TwnsClientErrorCode                  from "../../tools/helpers/ClientErrorCode";
import CommonConstants                      from "../../tools/helpers/CommonConstants";
import FloatText                            from "../../tools/helpers/FloatText";
import FlowManager                          from "../../tools/helpers/FlowManager";
import Logger                               from "../../tools/helpers/Logger";
import Types                                from "../../tools/helpers/Types";
import Lang                                 from "../../tools/lang/Lang";
import TwnsLangTextType                     from "../../tools/lang/LangTextType";
import Notify                               from "../../tools/notify/Notify";
import TwnsNotifyType                       from "../../tools/notify/NotifyType";
import ProtoTypes                           from "../../tools/proto/ProtoTypes";
import WarActionExecutor                    from "../../tools/warHelpers/WarActionExecutor";
import WarRuleHelpers                       from "../../tools/warHelpers/WarRuleHelpers";
import UserModel                            from "../../user/model/UserModel";
import WarMapModel                          from "../../warMap/model/WarMapModel";
import TwnsMpwWar                           from "./MpwWar";

namespace MpwModel {
    import MpwWar                                   = TwnsMpwWar.MpwWar;
    import CcwWar                                   = TwnsCcwWar.CcwWar;
    import McwWar                                   = TwnsMcwWar.McwWar;
    import MfwWar                                   = TwnsMfwWar.MfwWar;
    import MrwWar                                   = TwnsMrwWar.MrwWar;
    import LangTextType                             = TwnsLangTextType.LangTextType;
    import NotifyType                               = TwnsNotifyType.NotifyType;
    import ClientErrorCode                          = TwnsClientErrorCode.ClientErrorCode;
    import WarBasicSettingsType                     = Types.WarBasicSettingsType;
    import IMpwWarInfo                              = ProtoTypes.MultiPlayerWar.IMpwWarInfo;
    import IWarActionContainer                      = ProtoTypes.WarAction.IWarActionContainer;
    import IWarRule                                 = ProtoTypes.WarRule.IWarRule;
    import ISettingsForMcw                          = ProtoTypes.WarSettings.ISettingsForMcw;
    import ISettingsForCcw                          = ProtoTypes.WarSettings.ISettingsForCcw;
    import ISettingsForMrw                          = ProtoTypes.WarSettings.ISettingsForMrw;
    import ISettingsForMfw                          = ProtoTypes.WarSettings.ISettingsForMfw;
    import OpenDataForCommonWarBasicSettingsPage    = TwnsCommonWarBasicSettingsPage.OpenDataForCommonWarBasicSettingsPage;
    import OpenDataForCommonWarAdvancedSettingsPage = TwnsCommonWarAdvancedSettingsPage.OpenDataForCommonWarAdvancedSettingsPage;
    import OpenDataForCommonWarPlayerInfoPage       = TwnsCommonWarPlayerInfoPage.OpenDataForCommonWarPlayerInfoPage;

    let _allWarInfoList         : IMpwWarInfo[] = [];
    let _mcwPreviewingWarId     : number | undefined;
    let _mrwPreviewingWarId     : number | undefined;
    let _mfwPreviewingWarId     : number | undefined;
    let _ccwPreviewingWarId     : number | undefined;
    let _war                    : MpwWar | undefined;
    const _cachedActions        : IWarActionContainer[] = [];

    export function init(): void {
        // nothing to do.
    }

    export function setAllMyWarInfoList(infoList: IMpwWarInfo[]): void {
        _allWarInfoList = infoList || [];
    }
    function getAllMyWarInfoList(): IMpwWarInfo[] {
        return _allWarInfoList;
    }
    export function getMyMcwWarInfoArray(): IMpwWarInfo[] {
        return getAllMyWarInfoList().filter(v => v.settingsForMcw != null);
    }
    export function getMyMrwWarInfoArray(): IMpwWarInfo[] {
        return getAllMyWarInfoList().filter(v => v.settingsForMrw != null);
    }
    export function getMyMfwWarInfoArray(): IMpwWarInfo[] {
        return getAllMyWarInfoList().filter(v => v.settingsForMfw != null);
    }
    export function getMyCcwWarInfoArray(): IMpwWarInfo[] {
        return getAllMyWarInfoList().filter(v => v.settingsForCcw != null);
    }
    export function getMyWarInfo(warId: number): IMpwWarInfo | undefined {
        return getAllMyWarInfoList().find(v => v.warId === warId);
    }

    export function getMcwPreviewingWarId(): number | undefined {
        return _mcwPreviewingWarId;
    }
    export function setMcwPreviewingWarId(warId: number | undefined): void {
        if (getMcwPreviewingWarId() != warId) {
            _mcwPreviewingWarId = warId;
            Notify.dispatch(NotifyType.McwPreviewingWarIdChanged);
        }
    }

    export function getMrwPreviewingWarId(): number | undefined {
        return _mrwPreviewingWarId;
    }
    export function setMrwPreviewingWarId(warId: number | undefined): void {
        if (getMrwPreviewingWarId() != warId) {
            _mrwPreviewingWarId = warId;
            Notify.dispatch(NotifyType.MrwPreviewingWarIdChanged);
        }
    }

    export function getMfwPreviewingWarId(): number | undefined {
        return _mfwPreviewingWarId;
    }
    export function setMfwPreviewingWarId(warId: number | undefined): void {
        if (getMfwPreviewingWarId() != warId) {
            _mfwPreviewingWarId = warId;
            Notify.dispatch(NotifyType.MfwPreviewingWarIdChanged);
        }
    }

    export function getCcwPreviewingWarId(): number | undefined {
        return _ccwPreviewingWarId;
    }
    export function setCcwPreviewingWarId(warId: number | undefined): void {
        if (getCcwPreviewingWarId() != warId) {
            _ccwPreviewingWarId = warId;
            Notify.dispatch(NotifyType.CcwPreviewingWarIdChanged);
        }
    }

    export function checkIsRedForMyMcwWars(): boolean {
        return checkIsRedForMyWars(getMyMcwWarInfoArray());
    }
    export function checkIsRedForMyMrwWars(): boolean {
        return checkIsRedForMyWars(getMyMrwWarInfoArray());
    }
    export function checkIsRedForMyMfwWars(): boolean {
        return checkIsRedForMyWars(getMyMfwWarInfoArray());
    }
    export function checkIsRedForMyCcwWars(): boolean {
        return checkIsRedForMyWars(getMyCcwWarInfoArray());
    }
    export function checkIsRedForMyWar(warInfo: IMpwWarInfo | null | undefined): boolean {
        if (warInfo == null) {
            return false;
        } else {
            const selfUserId = UserModel.getSelfUserId();
            return (warInfo.playerInfoList || []).some(v => (v.playerIndex === warInfo.playerIndexInTurn) && (v.userId === selfUserId));
        }
    }
    function checkIsRedForMyWars(wars: IMpwWarInfo[]): boolean {
        return wars.some(warInfo => checkIsRedForMyWar(warInfo));
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    export async function createDataForCommonWarBasicSettingsPage(warId: number): Promise<OpenDataForCommonWarBasicSettingsPage> {
        const warInfo = getMyWarInfo(warId);
        if (warInfo == null) {
            return { dataArrayForListSettings: [] };
        }

        const warRule                                                               = warInfo.settingsForCommon.warRule;
        const { settingsForCcw, settingsForMcw, settingsForMfw, settingsForMrw }    = warInfo;
        if (settingsForMcw) {
            return await createDataForCommonWarBasicSettingsPageForMcw(warRule, settingsForMcw);
        } else if (settingsForCcw) {
            return await createDataForCommonWarBasicSettingsPageForCcw(warRule, settingsForCcw);
        } else if (settingsForMrw) {
            return await createDataForCommonWarBasicSettingsPageForMrw(warRule, settingsForMrw);
        } else if (settingsForMfw) {
            return await createDataForCommonWarBasicSettingsPageForMfw(warRule, settingsForMfw);
        } else {
            Logger.error(`MpwModel.createDataForCommonWarBasicSettingsPage() invalid warInfo.`);
            return { dataArrayForListSettings: [] };
        }
    }
    async function createDataForCommonWarBasicSettingsPageForMcw(warRule: IWarRule, settingsForMcw: ISettingsForMcw): Promise<OpenDataForCommonWarBasicSettingsPage> {
        const bootTimerParams   = settingsForMcw.bootTimerParams;
        const timerType         = bootTimerParams[0] as Types.BootTimerType;
        const openData          : OpenDataForCommonWarBasicSettingsPage = {
            dataArrayForListSettings    : [
                {
                    settingsType    : WarBasicSettingsType.MapName,
                    currentValue    : await WarMapModel.getMapNameInCurrentLanguage(settingsForMcw.mapId),
                    warRule,
                    callbackOnModify: undefined,
                },
                {
                    settingsType    : WarBasicSettingsType.WarName,
                    currentValue    : settingsForMcw.warName,
                    warRule,
                    callbackOnModify: undefined,
                },
                {
                    settingsType    : WarBasicSettingsType.WarPassword,
                    currentValue    : settingsForMcw.warPassword,
                    warRule,
                    callbackOnModify: undefined,
                },
                {
                    settingsType    : WarBasicSettingsType.WarComment,
                    currentValue    : settingsForMcw.warComment,
                    warRule,
                    callbackOnModify: undefined,
                },
                {
                    settingsType    : WarBasicSettingsType.WarRuleTitle,
                    currentValue    : undefined,
                    warRule,
                    callbackOnModify: undefined,
                },
                {
                    settingsType    : WarBasicSettingsType.HasFog,
                    currentValue    : undefined,
                    warRule,
                    callbackOnModify: undefined,
                },
                {
                    settingsType    : WarBasicSettingsType.TimerType,
                    currentValue    : timerType,
                    warRule,
                    callbackOnModify: undefined,
                },
            ],
        };
        if (timerType === Types.BootTimerType.Regular) {
            openData.dataArrayForListSettings.push({
                settingsType    : WarBasicSettingsType.TimerRegularParam,
                currentValue    : bootTimerParams[1],
                warRule,
                callbackOnModify: undefined,
            });
        } else if (timerType === Types.BootTimerType.Incremental) {
            openData.dataArrayForListSettings.push(
                {
                    settingsType    : WarBasicSettingsType.TimerIncrementalParam1,
                    currentValue    : bootTimerParams[1],
                    warRule,
                    callbackOnModify: undefined,
                },
                {
                    settingsType    : WarBasicSettingsType.TimerIncrementalParam2,
                    currentValue    : bootTimerParams[2],
                    warRule,
                    callbackOnModify: undefined,
                },
            );
        } else {
            Logger.error(`MpwModel.createDataForCommonWarBasicSettingsPageForMcw() invalid timerType.`);
        }

        return openData;
    }
    async function createDataForCommonWarBasicSettingsPageForCcw(warRule: IWarRule, settingsForCcw: ISettingsForCcw): Promise<OpenDataForCommonWarBasicSettingsPage> {
        const bootTimerParams   = settingsForCcw.bootTimerParams;
        const timerType         = bootTimerParams[0] as Types.BootTimerType;
        const openData          : OpenDataForCommonWarBasicSettingsPage = {
            dataArrayForListSettings    : [
                {
                    settingsType    : WarBasicSettingsType.MapName,
                    currentValue    : await WarMapModel.getMapNameInCurrentLanguage(settingsForCcw.mapId),
                    warRule,
                    callbackOnModify: undefined,
                },
                {
                    settingsType    : WarBasicSettingsType.WarName,
                    currentValue    : settingsForCcw.warName,
                    warRule,
                    callbackOnModify: undefined,
                },
                {
                    settingsType    : WarBasicSettingsType.WarPassword,
                    currentValue    : settingsForCcw.warPassword,
                    warRule,
                    callbackOnModify: undefined,
                },
                {
                    settingsType    : WarBasicSettingsType.WarComment,
                    currentValue    : settingsForCcw.warComment,
                    warRule,
                    callbackOnModify: undefined,
                },
                {
                    settingsType    : WarBasicSettingsType.WarRuleTitle,
                    currentValue    : undefined,
                    warRule,
                    callbackOnModify: undefined,
                },
                {
                    settingsType    : WarBasicSettingsType.HasFog,
                    currentValue    : undefined,
                    warRule,
                    callbackOnModify: undefined,
                },
                {
                    settingsType    : WarBasicSettingsType.TimerType,
                    currentValue    : timerType,
                    warRule,
                    callbackOnModify: undefined,
                },
            ],
        };
        if (timerType === Types.BootTimerType.Regular) {
            openData.dataArrayForListSettings.push({
                settingsType    : WarBasicSettingsType.TimerRegularParam,
                currentValue    : bootTimerParams[1],
                warRule,
                callbackOnModify: undefined,
            });
        } else if (timerType === Types.BootTimerType.Incremental) {
            openData.dataArrayForListSettings.push(
                {
                    settingsType    : WarBasicSettingsType.TimerIncrementalParam1,
                    currentValue    : bootTimerParams[1],
                    warRule,
                    callbackOnModify: undefined,
                },
                {
                    settingsType    : WarBasicSettingsType.TimerIncrementalParam2,
                    currentValue    : bootTimerParams[2],
                    warRule,
                    callbackOnModify: undefined,
                },
            );
        } else {
            Logger.error(`MpwModel.createDataForCommonWarBasicSettingsPageForCcw() invalid timerType.`);
        }

        return openData;
    }
    async function createDataForCommonWarBasicSettingsPageForMrw(warRule: IWarRule, settingsForMrw: ISettingsForMrw): Promise<OpenDataForCommonWarBasicSettingsPage> {
        const bootTimerParams   = CommonConstants.WarBootTimerDefaultParams;
        const timerType         = bootTimerParams[0] as Types.BootTimerType;
        const openData          : OpenDataForCommonWarBasicSettingsPage = {
            dataArrayForListSettings    : [
                {
                    settingsType    : WarBasicSettingsType.MapName,
                    currentValue    : await WarMapModel.getMapNameInCurrentLanguage(settingsForMrw.mapId),
                    warRule,
                    callbackOnModify: undefined,
                },
                {
                    settingsType    : WarBasicSettingsType.WarRuleTitle,
                    currentValue    : undefined,
                    warRule,
                    callbackOnModify: undefined,
                },
                {
                    settingsType    : WarBasicSettingsType.HasFog,
                    currentValue    : undefined,
                    warRule,
                    callbackOnModify: undefined,
                },
                {
                    settingsType    : WarBasicSettingsType.TimerType,
                    currentValue    : timerType,
                    warRule,
                    callbackOnModify: undefined,
                },
            ],
        };
        if (timerType === Types.BootTimerType.Regular) {
            openData.dataArrayForListSettings.push({
                settingsType    : WarBasicSettingsType.TimerRegularParam,
                currentValue    : bootTimerParams[1],
                warRule,
                callbackOnModify: undefined,
            });
        } else if (timerType === Types.BootTimerType.Incremental) {
            openData.dataArrayForListSettings.push(
                {
                    settingsType    : WarBasicSettingsType.TimerIncrementalParam1,
                    currentValue    : bootTimerParams[1],
                    warRule,
                    callbackOnModify: undefined,
                },
                {
                    settingsType    : WarBasicSettingsType.TimerIncrementalParam2,
                    currentValue    : bootTimerParams[2],
                    warRule,
                    callbackOnModify: undefined,
                },
            );
        } else {
            Logger.error(`MpwModel.createDataForCommonWarBasicSettingsPageForMrw() invalid timerType.`);
        }

        return openData;
    }
    async function createDataForCommonWarBasicSettingsPageForMfw(warRule: IWarRule, settingsForMfw: ISettingsForMfw): Promise<OpenDataForCommonWarBasicSettingsPage> {
        const bootTimerParams   = settingsForMfw.bootTimerParams;
        const timerType         = bootTimerParams[0] as Types.BootTimerType;
        const openData          : OpenDataForCommonWarBasicSettingsPage = {
            dataArrayForListSettings    : [
                {
                    settingsType    : WarBasicSettingsType.WarName,
                    currentValue    : settingsForMfw.warName,
                    warRule,
                    callbackOnModify: undefined,
                },
                {
                    settingsType    : WarBasicSettingsType.WarPassword,
                    currentValue    : settingsForMfw.warPassword,
                    warRule,
                    callbackOnModify: undefined,
                },
                {
                    settingsType    : WarBasicSettingsType.WarComment,
                    currentValue    : settingsForMfw.warComment,
                    warRule,
                    callbackOnModify: undefined,
                },
                {
                    settingsType    : WarBasicSettingsType.WarRuleTitle,
                    currentValue    : undefined,
                    warRule,
                    callbackOnModify: undefined,
                },
                {
                    settingsType    : WarBasicSettingsType.HasFog,
                    currentValue    : undefined,
                    warRule,
                    callbackOnModify: undefined,
                },
                {
                    settingsType    : WarBasicSettingsType.TimerType,
                    currentValue    : timerType,
                    warRule,
                    callbackOnModify: undefined,
                },
            ],
        };
        if (timerType === Types.BootTimerType.Regular) {
            openData.dataArrayForListSettings.push({
                settingsType    : WarBasicSettingsType.TimerRegularParam,
                currentValue    : bootTimerParams[1],
                warRule,
                callbackOnModify: undefined,
            });
        } else if (timerType === Types.BootTimerType.Incremental) {
            openData.dataArrayForListSettings.push(
                {
                    settingsType    : WarBasicSettingsType.TimerIncrementalParam1,
                    currentValue    : bootTimerParams[1],
                    warRule,
                    callbackOnModify: undefined,
                },
                {
                    settingsType    : WarBasicSettingsType.TimerIncrementalParam2,
                    currentValue    : bootTimerParams[2],
                    warRule,
                    callbackOnModify: undefined,
                },
            );
        } else {
            Logger.error(`MpwModel.createDataForCommonWarBasicSettingsPageForMfw() invalid timerType.`);
        }

        return openData;
    }

    export async function createDataForCommonWarAdvancedSettingsPage(warId: number): Promise<OpenDataForCommonWarAdvancedSettingsPage | undefined> {
        const warInfo = getMyWarInfo(warId);
        if (warInfo == null) {
            return undefined;
        }

        const settingsForCommon                                                     = warInfo.settingsForCommon;
        const { warRule, configVersion }                                            = settingsForCommon;
        const { settingsForCcw, settingsForMcw, settingsForMfw, settingsForMrw }    = warInfo;
        const hasFog                                                                = warRule.ruleForGlobalParams.hasFogByDefault;
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
            Logger.error(`MpwModel.createDataForCommonWarAdvancedSettingsPage() invalid warInfo.`);
            return undefined;
        }
    }

    export async function createDataForCommonWarPlayerInfoPage(warId: number): Promise<OpenDataForCommonWarPlayerInfoPage | undefined> {
        const warInfo = getMyWarInfo(warId);
        if (warInfo == null) {
            return undefined;
        }

        const settingsForCommon = warInfo.settingsForCommon;
        const warRule           = settingsForCommon.warRule;
        const playerInfoArray   : TwnsCommonWarPlayerInfoPage.PlayerInfo[] = [];
        for (const playerInfo of warInfo.playerInfoList || []) {
            const { playerIndex, userId } = playerInfo;
            playerInfoArray.push({
                playerIndex,
                teamIndex           : WarRuleHelpers.getTeamIndex(warRule, playerIndex),
                isAi                : userId == null,
                userId,
                coId                : playerInfo.coId,
                unitAndTileSkinId   : playerInfo.unitAndTileSkinId,
                isReady             : undefined,
                isInTurn            : playerIndex === warInfo.playerIndexInTurn,
                isDefeat            : !playerInfo.isAlive,
            });
        }

        return {
            configVersion           : settingsForCommon.configVersion,
            playersCountUnneutral   : WarRuleHelpers.getPlayersCount(warRule),
            roomOwnerPlayerIndex    : undefined,
            callbackOnDeletePlayer  : undefined,
            callbackOnExitRoom      : undefined,
            playerInfoArray,
        };
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for managing war.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    export async function loadWar(data: ProtoTypes.WarSerialization.ISerialWar): Promise<{ errorCode: ClientErrorCode, war?: MpwWar }> {
        if (getWar()) {
            Logger.warn(`MpwModel.loadWar() another war has been loaded already!`);
            unloadWar();
        }

        const war = createWarByWarData(data);
        if (war == null) {
            return { errorCode: ClientErrorCode.MpwModel_LoadWar_00 };
        }

        const initError = await war.init(data);
        if (initError) {
            return { errorCode: initError };
        }

        war.startRunning().startRunningView();
        _setWar(war);

        return {
            errorCode   : ClientErrorCode.NoError,
            war,
        };
    }
    export function unloadWar(): void {
        const war = getWar();
        if (war) {
            war.stopRunning();
            _setWar(undefined);
            _cachedActions.length = 0;
        }
    }

    export function getWar(): MpwWar | undefined {
        return _war;
    }
    function _setWar(war: MpwWar | undefined): void {
        _war = war;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Handlers for war actions that McwProxy receives.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    export async function updateOnPlayerSyncWar(data: ProtoTypes.NetMessage.MsgMpwCommonSyncWar.IS): Promise<void> {
        const war = getWar();
        if ((war) && (war.getWarId() === data.warId)) {
            const status    = data.status as Types.SyncWarStatus;
            const warData   = data.war;
            if (status === Types.SyncWarStatus.Defeated) {
                war.setIsEnded(true);
                TwnsCommonAlertPanel.CommonAlertPanel.show({
                    title   : Lang.getText(LangTextType.B0088),
                    content : Lang.getText(LangTextType.A0023),
                    callback: () => {
                        FlowManager.gotoMyWarListPanel(war.getWarType());
                    },
                });

            } else if (status === Types.SyncWarStatus.EndedOrNotExists) {
                war.setIsEnded(true);
                TwnsCommonAlertPanel.CommonAlertPanel.show({
                    title   : Lang.getText(LangTextType.B0088),
                    content : Lang.getText(LangTextType.A0035),
                    callback: () => {
                        FlowManager.gotoMyWarListPanel(war.getWarType());
                    },
                });

            } else if (status === Types.SyncWarStatus.NoError) {
                const requestType = data.requestType as Types.SyncWarRequestType;
                if (requestType === Types.SyncWarRequestType.PlayerForce) {
                    war.setIsEnded(true);
                    if (warData == null) {
                        Logger.error(`MpwModel.updateOnPlayerSyncWar() empty warData 1.`);
                    } else {
                        await FlowManager.gotoMultiPlayerWar(warData);
                        FloatText.show(Lang.getText(LangTextType.A0038));
                    }

                } else {
                    const cachedActionsCount    = _cachedActions.length;
                    const executedActionsCount  = war.getExecutedActionManager().getExecutedActionsCount();
                    if (executedActionsCount == null) {
                        Logger.error(`MpwModel.updateOnPlayerSyncWar() empty executedActionsCount.`);
                    } else {
                        if (data.executedActionsCount !== executedActionsCount + cachedActionsCount) {
                            war.setIsEnded(true);
                            if (warData == null) {
                                Logger.error(`MpwModel.updateOnPlayerSyncWar() empty warData 2.`);
                            } else {
                                await FlowManager.gotoMultiPlayerWar(warData);
                                FloatText.show(Lang.getText(LangTextType.A0036));
                            }

                        } else {
                            if (requestType === Types.SyncWarRequestType.PlayerRequest) {
                                FloatText.show(Lang.getText(LangTextType.A0038));
                            } else {
                                // Nothing to do.
                            }
                            if (!war.getIsExecutingAction()) {
                                if (cachedActionsCount) {
                                    checkAndRunFirstCachedAction(war, _cachedActions);
                                } else {
                                    // Nothing to do.
                                }
                            }
                        }
                    }
                }

            } else if (status === Types.SyncWarStatus.NotJoined) {
                // Something wrong!!
                war.setIsEnded(true);
                TwnsCommonAlertPanel.CommonAlertPanel.show({
                    title   : Lang.getText(LangTextType.B0088),
                    content : Lang.getText(LangTextType.A0037),
                    callback: () => FlowManager.gotoLobby(),
                });

            } else if (status === Types.SyncWarStatus.Synchronized) {
                const requestType = data.requestType as Types.SyncWarRequestType;
                if (requestType === Types.SyncWarRequestType.PlayerRequest) {
                    FloatText.show(Lang.getText(LangTextType.A0038));
                } else {
                    // Nothing to do.
                }

            } else {
                // Something wrong!!
                war.setIsEnded(true);
                TwnsCommonAlertPanel.CommonAlertPanel.show({
                    title   : Lang.getText(LangTextType.B0088),
                    content : Lang.getText(LangTextType.A0037),
                    callback: () => FlowManager.gotoLobby(),
                });
            }
        }
    }

    export function updateByActionContainer(container: IWarActionContainer, warId: number): void {
        const war = getWar();
        if ((war) && (war.getWarId() === warId)) {
            const executedActionsCount = war.getExecutedActionManager().getExecutedActionsCount();
            if (executedActionsCount == null) {
                Logger.error(`MpwModel.updateByActionContainer() empty executedActionsCount.`);
            } else {
                if (container.actionId !== executedActionsCount + _cachedActions.length) {
                    MpwProxy.reqMpwCommonSyncWar(war, Types.SyncWarRequestType.ReconnectionRequest);
                } else {
                    _cachedActions.push(container);
                    checkAndRunFirstCachedAction(war, _cachedActions);
                }
            }
        }
    }

    async function checkAndRunFirstCachedAction(war: MpwWar, actionList: IWarActionContainer[]): Promise<void> {
        if ((!war.getIsRunning()) || (war.getIsEnded()) || (war.getIsExecutingAction())) {
            return;
        }

        const container = actionList.shift();
        if (container == null) {
            return;
        }

        const selfUserId = UserModel.getSelfUserId();
        if (selfUserId == null) {
            Logger.error(`MpwModel.checkAndRunFirstCachedAction() empty selfUserId.`);
            return;
        }

        war.getExecutedActionManager().addExecutedAction(container);

        const errorCode = await WarActionExecutor.checkAndExecute(war, container, false);
        if (errorCode) {
            Logger.error(`MpwModel.checkAndRunFirstCachedAction() errorCode: ${errorCode}.`);
        }

        const playerManager     = war.getPlayerManager();
        const remainingVotes    = war.getDrawVoteManager().getRemainingVotes();
        const selfPlayer        = playerManager.getPlayerByUserId(selfUserId);
        const callbackForGoBack = () => {
            FlowManager.gotoMyWarListPanel(war.getWarType());
        };
        if (war.getIsEnded()) {
            if (remainingVotes === 0) {
                TwnsCommonAlertPanel.CommonAlertPanel.show({
                    title   : Lang.getText(LangTextType.B0088),
                    content : Lang.getText(LangTextType.A0030),
                    callback: callbackForGoBack,
                });
            } else {
                if (selfPlayer == null) {
                    TwnsCommonAlertPanel.CommonAlertPanel.show({
                        title   : Lang.getText(LangTextType.B0088),
                        content : Lang.getText(LangTextType.A0035),
                        callback: callbackForGoBack,
                    });
                } else {
                    TwnsCommonAlertPanel.CommonAlertPanel.show({
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
                    TwnsCommonAlertPanel.CommonAlertPanel.show({
                        title   : Lang.getText(LangTextType.B0035),
                        content : selfPlayer ? Lang.getText(LangTextType.A0023) : Lang.getText(LangTextType.A0152),
                        callback: callbackForGoBack,
                    });
                } else {
                    checkAndRunFirstCachedAction(war, actionList);
                }
            }
        }
    }

    function createWarByWarData(data: ProtoTypes.WarSerialization.ISerialWar): MpwWar | undefined {
        if (data.settingsForMcw) {
            return new McwWar();
        } else if (data.settingsForMrw) {
            return new MrwWar();
        } else if (data.settingsForMfw) {
            return new MfwWar();
        } else if (data.settingsForCcw) {
            return new CcwWar();
        } else {
            return undefined;
        }
    }
}

export default MpwModel;
