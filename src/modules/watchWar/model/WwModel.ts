
import TwnsCommonWarAdvancedSettingsPage    from "../../common/view/CommonWarAdvancedSettingsPage";
import TwnsCommonWarBasicSettingsPage       from "../../common/view/CommonWarBasicSettingsPage";
import TwnsCommonWarMapInfoPage             from "../../common/view/CommonWarMapInfoPage";
import TwnsCommonWarPlayerInfoPage          from "../../common/view/CommonWarPlayerInfoPage";
import TwnsClientErrorCode                  from "../../tools/helpers/ClientErrorCode";
import CommonConstants                      from "../../tools/helpers/CommonConstants";
import Helpers                              from "../../tools/helpers/Helpers";
import Types                                from "../../tools/helpers/Types";
import ProtoTypes                           from "../../tools/proto/ProtoTypes";
import WarCommonHelpers                     from "../../tools/warHelpers/WarCommonHelpers";
import WarRuleHelpers                       from "../../tools/warHelpers/WarRuleHelpers";
import WarMapModel                          from "../../warMap/model/WarMapModel";

namespace WwModel {
    import IMpwWatchInfo                            = ProtoTypes.MultiPlayerWar.IMpwWatchInfo;
    import OpenDataForWarCommonMapInfoPage          = TwnsCommonWarMapInfoPage.OpenDataForCommonMapInfoPage;
    import OpenDataForCommonWarBasicSettingsPage    = TwnsCommonWarBasicSettingsPage.OpenDataForCommonWarBasicSettingsPage;
    import OpenDataForCommonWarAdvancedSettingsPage = TwnsCommonWarAdvancedSettingsPage.OpenDataForCommonWarAdvancedSettingsPage;
    import OpenDataForCommonWarPlayerInfoPage       = TwnsCommonWarPlayerInfoPage.OpenDataForCommonWarPlayerInfoPage;
    import ClientErrorCode                          = TwnsClientErrorCode.ClientErrorCode;
    import WarBasicSettingsType                     = Types.WarBasicSettingsType;

    let _unwatchedWarInfos      : IMpwWatchInfo[] | null = null;
    let _watchOngoingWarInfos   : IMpwWatchInfo[] | null = null;
    let _watchRequestedWarInfos : IMpwWatchInfo[] | null = null;
    let _watchedWarInfos        : IMpwWatchInfo[] | null = null;

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    export function setUnwatchedWarInfos(infos: IMpwWatchInfo[]): void {
        _unwatchedWarInfos = infos;
    }
    export function getUnwatchedWarInfos(): IMpwWatchInfo[] | null {
        return _unwatchedWarInfos;
    }

    export function setWatchOngoingWarInfos(infos: IMpwWatchInfo[]): void {
        _watchOngoingWarInfos = infos;
    }
    export function getWatchOngoingWarInfos(): IMpwWatchInfo[] | null {
        return _watchOngoingWarInfos;
    }

    export function setWatchRequestedWarInfos(infos: IMpwWatchInfo[]): void {
        _watchRequestedWarInfos = infos;
    }
    export function getWatchRequestedWarInfos(): IMpwWatchInfo[] | null {
        return _watchRequestedWarInfos;
    }

    export function setWatchedWarInfos(infos: IMpwWatchInfo[]): void {
        _watchedWarInfos = infos;
    }
    export function getWatchedWarInfos(): IMpwWatchInfo[] | null {
        return _watchedWarInfos;
    }

    function getWatchInfo(warId: number): IMpwWatchInfo | null {
        return getUnwatchedWarInfos()?.find(v => v.warInfo?.warId === warId)
            ?? getWatchOngoingWarInfos()?.find(v => v.warInfo?.warId === warId)
            ?? getWatchRequestedWarInfos()?.find(v => v.warInfo?.warId === warId)
            ?? getWatchedWarInfos()?.find(v => v.warInfo?.warId === warId)
            ?? null;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    export function createDataForCommonWarMapInfoPage(warId: number | null): OpenDataForWarCommonMapInfoPage {
        const watchInfo = warId == null ? null : getWatchInfo(warId);
        if (watchInfo == null) {
            return null;
        }

        const warInfo   = Helpers.getExisted(watchInfo.warInfo, ClientErrorCode.WwModel_CreateDataForCommonWarMapInfoPage_00);
        const mapId     = warInfo.settingsForCcw?.mapId ?? warInfo.settingsForMcw?.mapId ?? warInfo.settingsForMrw?.mapId;
        if (mapId != null) {
            return { mapInfo: { mapId } };
        } else {
            return {
                warInfo : {
                    warData : Helpers.getExisted(warInfo.settingsForMfw?.initialWarData, ClientErrorCode.WwModel_CreateDataForCommonWarMapInfoPage_01),
                    players : null,
                },
            };
        }
    }

    export function createDataForCommonWarPlayerInfoPage(warId: number | null): OpenDataForCommonWarPlayerInfoPage {
        const watchInfo = warId == null ? null : getWatchInfo(warId);
        if (watchInfo == null) {
            return null;
        }

        const warInfo               = Helpers.getExisted(watchInfo.warInfo, ClientErrorCode.WwModel_CreateDataForCommonWarPlayerInfoPage_00);
        const settingsForCommon     = Helpers.getExisted(warInfo.settingsForCommon, ClientErrorCode.WwModel_CreateDataForCommonWarPlayerInfoPage_01);
        const warRule               = Helpers.getExisted(settingsForCommon.warRule, ClientErrorCode.WwModel_CreateDataForCommonWarPlayerInfoPage_02);
        const playerDataList        = Helpers.getExisted(warInfo.playerInfoList, ClientErrorCode.WwModel_CreateDataForCommonWarPlayerInfoPage_03);
        const playersCountUnneutral = WarRuleHelpers.getPlayersCountUnneutral(warRule);
        const playerInfoArray       : TwnsCommonWarPlayerInfoPage.PlayerInfo[] = [];
        for (let playerIndex = CommonConstants.WarFirstPlayerIndex; playerIndex <= playersCountUnneutral; ++playerIndex) {
            const playerData    = Helpers.getExisted(playerDataList.find(v => v.playerIndex === playerIndex), ClientErrorCode.WwModel_CreateDataForCommonWarPlayerInfoPage_04);
            const userId        = playerData.userId;
            playerInfoArray.push({
                playerIndex,
                teamIndex           : WarRuleHelpers.getTeamIndex(warRule, playerIndex),
                isAi                : userId == null,
                userId              : userId ?? null,
                coId                : playerData.coId ?? null,
                unitAndTileSkinId   : playerData.unitAndTileSkinId ?? null,
                isReady             : null,
                isInTurn            : warInfo.playerIndexInTurn === playerIndex,
                isDefeat            : !playerData.isAlive,
            });
        }

        return {
            configVersion           : Helpers.getExisted(settingsForCommon.configVersion),
            playersCountUnneutral,
            roomOwnerPlayerIndex    : null,
            callbackOnExitRoom      : null,
            callbackOnDeletePlayer  : null,
            playerInfoArray,
        };
    }

    export async function createDataForCommonWarBasicSettingsPage(warId: number | null): Promise<OpenDataForCommonWarBasicSettingsPage> {
        const watchInfo = warId == null ? null : getWatchInfo(warId);
        if (watchInfo == null) {
            return null;
        }

        const warInfo           = Helpers.getExisted(watchInfo.warInfo, ClientErrorCode.WwModel_CreateDataForCommonWarBasicSettingsPage_00);
        const warRule           = Helpers.getExisted(warInfo.settingsForCommon?.warRule, ClientErrorCode.WwModel_CreateDataForCommonWarBasicSettingsPage_01);
        const { settingsForMcw, settingsForCcw, settingsForMfw, settingsForMrw } = warInfo;
        const bootTimerParams   = settingsForMcw?.bootTimerParams ?? settingsForMfw?.bootTimerParams ?? settingsForCcw?.bootTimerParams ?? CommonConstants.WarBootTimerDefaultParams;
        const timerType         = bootTimerParams[0] as Types.BootTimerType;
        const mapId             = settingsForMcw?.mapId ?? settingsForMrw?.mapId ?? settingsForCcw?.mapId ?? null;
        const openData          : OpenDataForCommonWarBasicSettingsPage = {
            dataArrayForListSettings: [
                {
                    settingsType    : WarBasicSettingsType.MapName,
                    currentValue    : mapId == null ? `----` : await WarMapModel.getMapNameInCurrentLanguage(Helpers.getExisted(mapId, ClientErrorCode.WwModel_CreateDataForCommonWarBasicSettingsPage_02)),
                    warRule,
                    callbackOnModify: null,
                },
                {
                    settingsType    : WarBasicSettingsType.WarName,
                    currentValue    : settingsForMcw?.warName ?? settingsForMfw?.warName ?? settingsForCcw?.warName ?? `----`,
                    warRule,
                    callbackOnModify: null,
                },
                {
                    settingsType    : WarBasicSettingsType.WarComment,
                    currentValue    : settingsForMcw?.warComment ?? settingsForMfw?.warName ?? settingsForCcw?.warName ?? `----`,
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
            throw Helpers.newError(`McrModel.createDataForCommonWarBasicSettingsPage() invalid timerType.`);
        }

        return openData;
    }

    export function createDataForCommonWarAdvancedSettingsPage(warId: number | null): OpenDataForCommonWarAdvancedSettingsPage {
        const watchInfo = warId == null ? null : getWatchInfo(warId);
        if (watchInfo == null) {
            return null;
        }

        const warInfo           = Helpers.getExisted(watchInfo.warInfo, ClientErrorCode.WwModel_CreateDataForCommonWarAdvancedSettingsPage_00);
        const settingsForCommon = Helpers.getExisted(warInfo.settingsForCommon, ClientErrorCode.WwModel_CreateDataForCommonWarAdvancedSettingsPage_01);
        return {
            configVersion   : Helpers.getExisted(settingsForCommon.configVersion, ClientErrorCode.WwModel_CreateDataForCommonWarAdvancedSettingsPage_02),
            warRule         : Helpers.getExisted(settingsForCommon.warRule, ClientErrorCode.WwModel_CreateDataForCommonWarAdvancedSettingsPage_03),
            warType         : WarCommonHelpers.getWarTypeByMpwWarInfo(warInfo),
        };
    }
}

export default WwModel;
