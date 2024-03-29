
// import TwnsCommonWarAdvancedSettingsPage    from "../../common/view/CommonWarAdvancedSettingsPage";
// import TwnsCommonWarBasicSettingsPage       from "../../common/view/CommonWarBasicSettingsPage";
// import TwnsCommonWarPlayerInfoPage          from "../../common/view/CommonWarPlayerInfoPage";
// import CommonConstants                      from "../../tools/helpers/CommonConstants";
// import Helpers                              from "../../tools/helpers/Helpers";
// import Logger                               from "../../tools/helpers/Logger";
// import Types                                from "../../tools/helpers/Types";
// import Notify                               from "../../tools/notify/Notify";
// import Notify                       from "../../tools/notify/NotifyType";
// import ProtoTypes                           from "../../tools/proto/ProtoTypes";
// import WarRuleHelpers                       from "../../tools/warHelpers/WarRuleHelpers";
// import UserModel                            from "../../user/model/UserModel";
// import WarMapModel                          from "../../warMap/model/WarMapModel";
// import MrrProxy                             from "./MrrProxy";
// import MrrSelfSettingsModel                 from "./MrrSelfSettingsModel";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.MultiRankRoom.MrrModel {
    import NotifyType                               = Notify.NotifyType;
    import WarBasicSettingsType                     = Types.WarBasicSettingsType;
    import IMrrRoomInfo                             = CommonProto.MultiRankRoom.IMrrRoomInfo;
    import OpenDataForCommonWarBasicSettingsPage    = Common.OpenDataForCommonWarBasicSettingsPage;
    import OpenDataForCommonWarAdvancedSettingsPage = Common.OpenDataForCommonWarAdvancedSettingsPage;
    import OpenDataForCommonWarPlayerInfoPage       = Common.OpenDataForCommonWarPlayerInfoPage;

    let _previewingRoomId           : number | null = null;
    let _maxConcurrentCountForStd   = 0;
    let _maxConcurrentCountForFog   = 0;
    const _roomInfoAccessor         = Helpers.createCachedDataAccessor<number, IMrrRoomInfo>({
        reqData : (roomId: number) => MultiRankRoom.MrrProxy.reqMrrGetRoomPublicInfo(roomId),
    });
    const _joinedRoomIdArrayAccessor = Helpers.createCachedDataAccessor<null, number[]>({
        reqData : () => MultiRankRoom.MrrProxy.reqMrrGetJoinedRoomIdArray(),
    });

    export function setMaxConcurrentCount(hasFog: boolean, count: number): void {
        if (hasFog) {
            _maxConcurrentCountForFog = count;
        } else {
            _maxConcurrentCountForStd = count;
        }
    }
    export function getMaxConcurrentCount(hasFog: boolean): number {
        return hasFog ? _maxConcurrentCountForFog : _maxConcurrentCountForStd;
    }

    function setRoomInfo(roomId: number, roomInfo: IMrrRoomInfo | null): void {
        _roomInfoAccessor.setData(roomId, roomInfo);
    }
    export function getRoomInfo(roomId: number): Promise<IMrrRoomInfo | null> {
        return _roomInfoAccessor.getData(roomId);
    }

    export function setJoinedRoomIdArray(roomIdArray: number[]): void {
        _joinedRoomIdArrayAccessor.setData(null, roomIdArray);
    }
    export function getJoinedRoomIdArray(): Promise<number[] | null> {
        return _joinedRoomIdArrayAccessor.getData(null);
    }

    export async function updateOnMsgMrrGetRoomPublicInfo(data: CommonProto.NetMessage.MsgMrrGetRoomPublicInfo.IS): Promise<void> {
        const roomId    = Helpers.getExisted(data.roomId);
        const roomInfo  = data.roomInfo ?? null;
        setRoomInfo(roomId, roomInfo);

        if (MultiRankRoom.MrrSelfSettingsModel.getRoomId() === roomId) {
            await MultiRankRoom.MrrSelfSettingsModel.resetData(roomId);
        }
    }
    export async function updateOnMsgMrrSetBannedCoCategoryIdArray(data: CommonProto.NetMessage.MsgMrrSetBannedCoCategoryIdArray.IS): Promise<void> {
        const roomId    = Helpers.getExisted(data.roomId);
        const roomInfo  = await getRoomInfo(roomId);
        if (!roomInfo) {
            return;
        }

        const settingsForMrw            = Helpers.getExisted(roomInfo.settingsForMrw);
        const srcPlayerIndex            = data.playerIndex;
        const bannedCoCategoryIdArray   = data.bannedCoCategoryIdArray;
        if (settingsForMrw.dataArrayForBanCo == null) {
            settingsForMrw.dataArrayForBanCo = [{
                srcPlayerIndex,
                bannedCoCategoryIdArray,
            }];
        } else {
            const dataArray     = settingsForMrw.dataArrayForBanCo;
            const playerData    = dataArray.find(v => v.srcPlayerIndex === data.playerIndex);
            if (playerData) {
                playerData.bannedCoCategoryIdArray = data.bannedCoCategoryIdArray;
            } else {
                dataArray.push({
                    srcPlayerIndex,
                    bannedCoCategoryIdArray,
                });
            }
        }
    }
    export async function updateOnMsgMrrSetSelfSettings(data: CommonProto.NetMessage.MsgMrrSetSelfSettings.IS): Promise<void> {
        const roomInfo = await getRoomInfo(Helpers.getExisted(data.roomId));
        if (!roomInfo) {
            return;
        }

        const playerIndex       = data.playerIndex;
        const coId              = data.coId;
        const unitAndTileSkinId = data.unitAndTileSkinId;
        if (roomInfo.playerDataList == null) {
            Logger.warn(`MrrModel.updateOnMsgMrrSetSelfSettings() roomInfo.playerDataList == null.`);
            roomInfo.playerDataList = [{
                playerIndex,
                userId              : null,
                coId,
                unitAndTileSkinId,
                isReady             : true,
            }];
        } else {
            const dataArray     = roomInfo.playerDataList;
            const playerData    = dataArray.find(v => v.playerIndex === playerIndex);
            if (playerData) {
                playerData.coId                 = coId;
                playerData.isReady              = true;
                playerData.unitAndTileSkinId    = unitAndTileSkinId;
            } else {
                Logger.warn(`MrrModel.updateOnMsgMrrSetSelfSettings() playerData == null.`);
                dataArray.push({
                    playerIndex,
                    userId              : null,
                    coId,
                    unitAndTileSkinId,
                    isReady             : true,
                });
            }
        }
    }
    export function updateOnMsgMrrDeleteRoomByServer(data: CommonProto.NetMessage.MsgMrrDeleteRoomByServer.IS): void {
        setRoomInfo(Helpers.getExisted(data.roomId), null);
    }

    export async function checkIsRed(): Promise<boolean> {
        const promiseArray: Promise<boolean>[] = [];
        for (const roomId of await getJoinedRoomIdArray() ?? []) {
            promiseArray.push(checkIsRedForRoom(roomId));
        }
        return Helpers.checkIsAnyPromiseTrue(promiseArray);
    }
    export async function checkIsRedForRoom(roomId: number): Promise<boolean> {
        const roomInfo = await getRoomInfo(roomId);
        if (roomInfo == null) {
            return false;
        }

        const selfUserId = User.UserModel.getSelfUserId();
        const playerData = roomInfo.playerDataList?.find(v => v.userId === selfUserId);
        if (playerData == null) {
            return false;
        }

        if (roomInfo.timeForStartSetSelfSettings != null) {
            return !playerData.isReady;
        } else {
            const arr = roomInfo.settingsForMrw?.dataArrayForBanCo;
            if ((arr == null) || (arr.every(v => v.srcPlayerIndex !== playerData.playerIndex))) {
                return true;
            }
        }

        return false;
    }

    export function getPreviewingRoomId(): number | null {
        return _previewingRoomId;
    }
    export function setPreviewingRoomId(roomId: number | null): void {
        if (getPreviewingRoomId() != roomId) {
            _previewingRoomId = roomId;
            Notify.dispatch(NotifyType.MrrJoinedPreviewingRoomIdChanged);
        }
    }

    export async function createDataForCommonWarPlayerInfoPage(roomId: number | null): Promise<OpenDataForCommonWarPlayerInfoPage> {
        const roomInfo = roomId == null ? null : await getRoomInfo(roomId);
        if (roomInfo == null) {
            return null;
        }

        const settingsForCommon = Helpers.getExisted(roomInfo.settingsForCommon);
        const instanceWarRule   = Helpers.getExisted(settingsForCommon.instanceWarRule);
        const playerInfoArray   : Common.PlayerInfo[] = [];
        for (const playerInfo of (roomInfo.playerDataList || [])) {
            const playerIndex = Helpers.getExisted(playerInfo.playerIndex);
            playerInfoArray.push({
                playerIndex,
                teamIndex           : WarHelpers.WarRuleHelpers.getTeamIndex(instanceWarRule, playerIndex),
                isAi                : false,
                userId              : playerInfo.userId ?? null,
                coId                : playerInfo.coId ?? null,
                unitAndTileSkinId   : playerInfo.unitAndTileSkinId ?? null,
                isReady             : Helpers.getExisted(playerInfo.isReady),
                isInTurn            : null,
                isDefeat            : null,
                restTimeToBoot      : null,
            });
        }

        return {
            gameConfig              : await Config.ConfigManager.getGameConfig(Helpers.getExisted(settingsForCommon.configVersion)),
            playersCountUnneutral   : WarHelpers.WarRuleHelpers.getPlayersCountUnneutral(instanceWarRule),
            roomOwnerPlayerIndex    : null,
            callbackOnExitRoom      : null,
            callbackOnDeletePlayer  : null,
            playerInfoArray,
            enterTurnTime           : null,
        };
    }

    export async function createDataForCommonWarBasicSettingsPage(roomId: number | null): Promise<OpenDataForCommonWarBasicSettingsPage> {
        const roomInfo = roomId == null ? null : await getRoomInfo(roomId);
        if (roomInfo == null) {
            return { dataArrayForListSettings: [] };
        }

        const settingsForCommon = Helpers.getExisted(roomInfo.settingsForCommon);
        const instanceWarRule   = Helpers.getExisted(settingsForCommon.instanceWarRule);
        const settingsForMrw    = Helpers.getExisted(roomInfo.settingsForMrw);
        const gameConfig        = Helpers.getExisted(await Config.ConfigManager.getGameConfig(Helpers.getExisted(settingsForCommon.configVersion)));
        const mapId             = Helpers.getExisted(settingsForMrw.mapId);
        const warEventFullData  = (await WarMap.WarMapModel.getRawData(mapId))?.warEventFullData ?? null;
        const bootTimerParams   = CommonConstants.WarBootTimer.DefaultParams.concat();
        const timerType         = bootTimerParams[0] as Types.BootTimerType;
        const openData          : OpenDataForCommonWarBasicSettingsPage = {
            dataArrayForListSettings    : [
                {
                    settingsType    : WarBasicSettingsType.MapId,
                    currentValue    : mapId,
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
                    settingsType    : WarBasicSettingsType.TurnsAndWarActionsLimit,
                    currentValue    : `${settingsForCommon.turnsLimit ?? CommonConstants.Turn.Limit.Default}, ${settingsForCommon.warActionsLimit ?? CommonConstants.WarAction.Limit.Default}`,
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
                    settingsType    : WarBasicSettingsType.TimerIncrementalParams,
                    currentValue    : `${bootTimerParams[1]}, ${bootTimerParams[2]}, ${bootTimerParams[3] ?? 0}`,
                    instanceWarRule,
                    gameConfig,
                    warEventFullData,
                    callbackOnModify: null,
                },
            );
        } else {
            throw Helpers.newError(`MrrModel.createDataForCommonWarBasicSettingsPage() invalid timerType: ${timerType}`, ClientErrorCode.MrrModel_CreateDataForCommonWarBasicSettingsPage_00);
        }

        return openData;
    }

    export async function createDataForCommonWarAdvancedSettingsPage(roomId: number | null): Promise<OpenDataForCommonWarAdvancedSettingsPage> {
        const roomInfo = roomId == null ? null : await getRoomInfo(roomId);
        if (roomInfo == null) {
            return null;
        }

        const settingsForCommon = Helpers.getExisted(roomInfo.settingsForCommon);
        const instanceWarRule   = Helpers.getExisted(settingsForCommon.instanceWarRule);
        return {
            gameConfig      : await Config.ConfigManager.getGameConfig(Helpers.getExisted(settingsForCommon.configVersion)),
            instanceWarRule,
            warType         : instanceWarRule.ruleForGlobalParams?.hasFogByDefault ? Types.WarType.MrwFog : Types.WarType.MrwStd,
        };
    }
}

// export default MrrModel;
