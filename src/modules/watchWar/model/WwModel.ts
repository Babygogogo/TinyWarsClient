
// import TwnsCommonWarAdvancedSettingsPage    from "../../common/view/CommonWarAdvancedSettingsPage";
// import TwnsCommonWarBasicSettingsPage       from "../../common/view/CommonWarBasicSettingsPage";
// import TwnsCommonWarMapInfoPage             from "../../common/view/CommonWarMapInfoPage";
// import TwnsCommonWarPlayerInfoPage          from "../../common/view/CommonWarPlayerInfoPage";
// import TwnsClientErrorCode                  from "../../tools/helpers/ClientErrorCode";
// import CommonConstants                      from "../../tools/helpers/CommonConstants";
// import Helpers                              from "../../tools/helpers/Helpers";
// import Types                                from "../../tools/helpers/Types";
// import ProtoTypes                           from "../../tools/proto/ProtoTypes";
// import WarCommonHelpers                     from "../../tools/warHelpers/WarCommonHelpers";
// import WarRuleHelpers                       from "../../tools/warHelpers/WarRuleHelpers";
// import WarMapModel                          from "../../warMap/model/WarMapModel";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace WwModel {
    import IMpwWatchIncomingInfo                    = CommonProto.MultiPlayerWar.IMpwWatchIncomingInfo;
    import IMpwWatchOutgoingInfo                    = CommonProto.MultiPlayerWar.IMpwWatchOutgoingInfo;
    import MsgMpwWatchGetIncomingInfoIs             = CommonProto.NetMessage.MsgMpwWatchGetIncomingInfo.IS;
    import MsgMpwWatchGetOutgoingInfoIs             = CommonProto.NetMessage.MsgMpwWatchGetOutgoingInfo.IS;
    import OpenDataForWarCommonMapInfoPage          = TwnsCommonWarMapInfoPage.OpenDataForCommonMapInfoPage;
    import OpenDataForCommonWarBasicSettingsPage    = TwnsCommonWarBasicSettingsPage.OpenDataForCommonWarBasicSettingsPage;
    import OpenDataForCommonWarAdvancedSettingsPage = TwnsCommonWarAdvancedSettingsPage.OpenDataForCommonWarAdvancedSettingsPage;
    import OpenDataForCommonWarPlayerInfoPage       = TwnsCommonWarPlayerInfoPage.OpenDataForCommonWarPlayerInfoPage;
    import ClientErrorCode                          = TwnsClientErrorCode.ClientErrorCode;
    import WarBasicSettingsType                     = Types.WarBasicSettingsType;

    let _requestableWarIdArray  : number[] | null = null;
    let _ongoingWarIdArray      : number[] | null = null;
    let _requestedWarIdArray    : number[] | null = null;
    let _watchedWarIdArray      : number[] | null = null;

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    export function setRequestableWarIdArray(warIdArray: number[]): void {
        _requestableWarIdArray = warIdArray;
    }
    export function getRequestableWarIdArray(): number[] | null {
        return _requestableWarIdArray;
    }

    export function setOngoingWarIdArray(warIdArray: number[]): void {
        _ongoingWarIdArray = warIdArray;
    }
    export function getOngoingWarIdArray(): number[] | null {
        return _ongoingWarIdArray;
    }

    export function setRequestedWarIdArray(warIdArray: number[]): void {
        _requestedWarIdArray = warIdArray;
    }
    export function getRequestedWarIdArray(): number[] | null {
        return _requestedWarIdArray;
    }

    export function setWatchedWarIdArray(warIdArray: number[]): void {
        _watchedWarIdArray = warIdArray;
    }
    export function getWatchedWarIdArray(): number[] | null {
        return _watchedWarIdArray;
    }

    export function checkIsRed(): boolean {
        return !!getRequestedWarIdArray()?.length;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for incoming info.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    const _watchIncomingInfoAccessor = Helpers.createCachedDataAccessor<number, IMpwWatchIncomingInfo>({
        reqData : (warId: number) => WwProxy.reqMpwWatchGetIncomingInfo(warId),
    });

    export function getWatchIncomingInfo(warId: number): Promise<IMpwWatchIncomingInfo | null> {
        return _watchIncomingInfoAccessor.getData(warId);
    }

    export async function updateOnMsgMpwWatchGetIncomingInfo(data: MsgMpwWatchGetIncomingInfoIs): Promise<void> {
        _watchIncomingInfoAccessor.setData(Helpers.getExisted(data.warId), data.incomingInfo ?? null);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for outgoing info.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    const _watchOutgoingInfoAccessor = Helpers.createCachedDataAccessor<number, IMpwWatchOutgoingInfo>({
        reqData : (warId: number) => WwProxy.reqMpwWatchGetOutgoingInfo(warId),
    });

    export function getWatchOutgoingInfo(warId: number): Promise<IMpwWatchOutgoingInfo | null> {
        return _watchOutgoingInfoAccessor.getData(warId);
    }

    export async function updateOnMsgMpwWatchGetOutgoingInfo(data: MsgMpwWatchGetOutgoingInfoIs): Promise<void> {
        _watchOutgoingInfoAccessor.setData(Helpers.getExisted(data.warId), data.outgoingInfo ?? null);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    export async function createDataForCommonWarMapInfoPage(warId: number | null): Promise<OpenDataForWarCommonMapInfoPage> {
        if (warId == null) {
            return null;
        }

        const warSettings = await MpwModel.getWarSettings(warId);
        if (warSettings == null) {
            return null;
        }

        const mapId         = warSettings.settingsForCcw?.mapId ?? warSettings.settingsForMcw?.mapId ?? warSettings.settingsForMrw?.mapId;
        const gameConfig    = await Twns.Config.ConfigManager.getGameConfig(Helpers.getExisted(warSettings.settingsForCommon?.configVersion));
        if (mapId != null) {
            return {
                gameConfig,
                mapInfo : { mapId }
            };
        } else {
            return {
                gameConfig,
                warInfo : {
                    warData : Helpers.getExisted(warSettings.settingsForMfw?.initialWarData, ClientErrorCode.WwModel_CreateDataForCommonWarMapInfoPage_01),
                    players : null,
                },
            };
        }
    }

    export async function createDataForCommonWarPlayerInfoPage(warId: number | null): Promise<OpenDataForCommonWarPlayerInfoPage> {
        if (warId == null) {
            return null;
        }

        const warSettings = await MpwModel.getWarSettings(warId);
        if (warSettings == null) {
            return null;
        }

        const warProgressInfo = await MpwModel.getWarProgressInfo(warId);
        if (warProgressInfo == null) {
            return null;
        }

        const settingsForCommon     = Helpers.getExisted(warSettings.settingsForCommon, ClientErrorCode.WwModel_CreateDataForCommonWarPlayerInfoPage_01);
        const warRule               = Helpers.getExisted(settingsForCommon.warRule, ClientErrorCode.WwModel_CreateDataForCommonWarPlayerInfoPage_02);
        const playerDataList        = Helpers.getExisted(warProgressInfo.playerInfoList, ClientErrorCode.WwModel_CreateDataForCommonWarPlayerInfoPage_03);
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
                isInTurn            : warProgressInfo.playerIndexInTurn === playerIndex,
                isDefeat            : !playerData.isAlive,
            });
        }

        return {
            gameConfig              : await Twns.Config.ConfigManager.getGameConfig(Helpers.getExisted(settingsForCommon.configVersion)),
            playersCountUnneutral,
            roomOwnerPlayerIndex    : null,
            callbackOnExitRoom      : null,
            callbackOnDeletePlayer  : null,
            playerInfoArray,
        };
    }

    export async function createDataForCommonWarBasicSettingsPage(warId: number | null): Promise<OpenDataForCommonWarBasicSettingsPage> {
        if (warId == null) {
            return null;
        }

        const warSettings = await MpwModel.getWarSettings(warId);
        if (warSettings == null) {
            return null;
        }

        const settingsForCommon = Helpers.getExisted(warSettings.settingsForCommon, ClientErrorCode.WwModel_CreateDataForCommonWarBasicSettingsPage_01);
        const warRule           = Helpers.getExisted(settingsForCommon.warRule, ClientErrorCode.WwModel_CreateDataForCommonWarBasicSettingsPage_02);
        const { settingsForMcw, settingsForCcw, settingsForMfw, settingsForMrw } = warSettings;
        const bootTimerParams   = settingsForMcw?.bootTimerParams ?? settingsForMfw?.bootTimerParams ?? settingsForCcw?.bootTimerParams ?? CommonConstants.WarBootTimerDefaultParams;
        const timerType         = bootTimerParams[0] as Types.BootTimerType;
        const mapId             = settingsForMcw?.mapId ?? settingsForMrw?.mapId ?? settingsForCcw?.mapId ?? null;
        const openData          : OpenDataForCommonWarBasicSettingsPage = {
            dataArrayForListSettings: [
                {
                    settingsType    : WarBasicSettingsType.MapName,
                    currentValue    : mapId == null ? `----` : await WarMapModel.getMapNameInCurrentLanguage(Helpers.getExisted(mapId, ClientErrorCode.WwModel_CreateDataForCommonWarBasicSettingsPage_03)),
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
            throw Helpers.newError(`Invalid timerType.`, ClientErrorCode.WwModel_CreateDataForCommonWarBasicSettingsPage_04);
        }

        return openData;
    }

    export async function createDataForCommonWarAdvancedSettingsPage(warId: number | null): Promise<OpenDataForCommonWarAdvancedSettingsPage> {
        const warSettings = warId == null ? null : await MpwModel.getWarSettings(warId);
        if (warSettings == null) {
            return null;
        }

        const settingsForCommon = Helpers.getExisted(warSettings.settingsForCommon, ClientErrorCode.WwModel_CreateDataForCommonWarAdvancedSettingsPage_01);
        return {
            gameConfig  : await Twns.Config.ConfigManager.getGameConfig(Helpers.getExisted(settingsForCommon.configVersion, ClientErrorCode.WwModel_CreateDataForCommonWarAdvancedSettingsPage_02)),
            warRule     : Helpers.getExisted(settingsForCommon.warRule, ClientErrorCode.WwModel_CreateDataForCommonWarAdvancedSettingsPage_03),
            warType     : WarCommonHelpers.getWarTypeByMpwWarSettings(warSettings),
        };
    }
}

// export default WwModel;
