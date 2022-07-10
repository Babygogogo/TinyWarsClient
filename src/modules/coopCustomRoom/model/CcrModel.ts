
// import TwnsCommonWarAdvancedSettingsPage    from "../../common/view/CommonWarAdvancedSettingsPage";
// import TwnsCommonWarBasicSettingsPage       from "../../common/view/CommonWarBasicSettingsPage";
// import TwnsCommonWarPlayerInfoPage          from "../../common/view/CommonWarPlayerInfoPage";
// import CcrProxy                             from "../../coopCustomRoom/model/CcrProxy";
// import CommonConstants                      from "../../tools/helpers/CommonConstants";
// import Helpers                              from "../../tools/helpers/Helpers";
// import Types                                from "../../tools/helpers/Types";
// import Notify                               from "../../tools/notify/Notify";
// import Notify                       from "../../tools/notify/NotifyType";
// import ProtoTypes                           from "../../tools/proto/ProtoTypes";
// import WarRuleHelpers                       from "../../tools/warHelpers/WarRuleHelpers";
// import UserModel                            from "../../user/model/UserModel";
// import WarMapModel                          from "../../warMap/model/WarMapModel";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.CoopCustomRoom.CcrModel {
    import WarBasicSettingsType                     = Types.WarBasicSettingsType;
    import CcrRoomFilter                            = Types.CcrRoomFilter;
    import ICcrRoomStaticInfo                       = CommonProto.CoopCustomRoom.ICcrRoomStaticInfo;
    import ICcrRoomPlayerInfo                       = CommonProto.CoopCustomRoom.ICcrRoomPlayerInfo;
    import OpenDataForCommonWarBasicSettingsPage    = Common.OpenDataForCommonWarBasicSettingsPage;
    import OpenDataForCommonWarAdvancedSettingsPage = Common.OpenDataForCommonWarAdvancedSettingsPage;
    import OpenDataForCommonWarPlayerInfoPage       = Common.OpenDataForCommonWarPlayerInfoPage;

    export type DataForCreateRoom   = CommonProto.NetMessage.MsgCcrCreateRoom.IC;
    export type DataForJoinRoom     = CommonProto.NetMessage.MsgCcrJoinRoom.IC;

    const _roomStaticInfoAccessor = Helpers.createCachedDataAccessor<number, ICcrRoomStaticInfo>({
        reqData : (roomId: number) => CcrProxy.reqCcrGetRoomStaticInfo(roomId),
    });
    const _roomPlayerInfoAccessor = Helpers.createCachedDataAccessor<number, ICcrRoomPlayerInfo>({
        reqData : (roomId: number) => CcrProxy.reqCcrGetRoomPlayerInfo(roomId),
    });

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for rooms.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    export function getRoomStaticInfo(roomId: number): Promise<ICcrRoomStaticInfo | null> {
        return _roomStaticInfoAccessor.getData(roomId);
    }
    export function setRoomStaticInfo(roomId: number, info: ICcrRoomStaticInfo | null): void {
        _roomStaticInfoAccessor.setData(roomId, info);
    }

    export function getRoomPlayerInfo(roomId: number): Promise<ICcrRoomPlayerInfo | null> {
        return _roomPlayerInfoAccessor.getData(roomId);
    }
    export function setRoomPlayerInfo(roomId: number, info: ICcrRoomPlayerInfo | null): void {
        _roomPlayerInfoAccessor.setData(roomId, info);
    }

    export async function getUnjoinedRoomIdSet(filter: CcrRoomFilter | null): Promise<Set<number>> {
        const unjoinedRoomIdArray   : number[] = [];
        const selfUserId            = User.UserModel.getSelfUserId();
        if (selfUserId == null) {
            return new Set();
        }

        const allRoomIdArray        = _roomPlayerInfoAccessor.getRequestedKeyArray();
        const roomPlayerInfoArray   = Helpers.getNonNullElements(await Promise.all(allRoomIdArray.map(v => getRoomPlayerInfo(v))));
        for (const roomPlayerInfo of roomPlayerInfoArray) {
            const playerDataList = roomPlayerInfo.playerDataList ?? [];
            if ((playerDataList.length < Helpers.getExisted(roomPlayerInfo.playersCountUnneutral))  &&
                (playerDataList.every(v => v.userId !== selfUserId))
            ) {
                unjoinedRoomIdArray.push(Helpers.getExisted(roomPlayerInfo.roomId));
            }
        }

        return (filter == null)
            ? new Set(unjoinedRoomIdArray)
            : getFilteredRoomIdSet(unjoinedRoomIdArray, filter);
    }
    export async function getJoinedRoomIdSet(filter: CcrRoomFilter | null): Promise<Set<number>> {
        const joinedRoomIdArray : number[] = [];
        const selfUserId        = User.UserModel.getSelfUserId();
        if (selfUserId == null) {
            return new Set();
        }

        const allRoomIdArray        = _roomPlayerInfoAccessor.getRequestedKeyArray();
        const roomPlayerInfoArray   = Helpers.getNonNullElements(await Promise.all(allRoomIdArray.map(v => getRoomPlayerInfo(v))));
        for (const roomPlayerInfo of roomPlayerInfoArray) {
            if (roomPlayerInfo.playerDataList?.some(v => v.userId === selfUserId)) {
                joinedRoomIdArray.push(Helpers.getExisted(roomPlayerInfo.roomId));
            }
        }

        return (filter == null)
            ? new Set(joinedRoomIdArray)
            : getFilteredRoomIdSet(joinedRoomIdArray, filter);
    }
    async function getFilteredRoomIdSet(roomIdArray: number[], filter: CcrRoomFilter): Promise<Set<number>> {
        const [roomStaticInfoArray, roomPlayerInfoArray] = await Promise.all([
            await Promise.all(roomIdArray.map(v => getRoomStaticInfo(v))),
            await Promise.all(roomIdArray.map(v => getRoomPlayerInfo(v))),
        ]);
        const filteredRoomIdSet = new Set<number>();
        for (let i = 0; i < roomIdArray.length; ++i) {
            const roomId = roomIdArray[i];
            if (await checkIsMeetFilter({
                roomId,
                roomStaticInfo  : roomStaticInfoArray[i],
                roomPlayerInfo  : roomPlayerInfoArray[i],
                filter,
            })) {
                filteredRoomIdSet.add(roomId);
            }
        }

        return filteredRoomIdSet;
    }

    export async function checkIsRed(): Promise<boolean> {
        for (const roomId of await getJoinedRoomIdSet(null)) {
            if (await checkIsRedForRoom(roomId)) {
                return true;
            }
        }
        return false;
    }
    export async function checkIsRedForRoom(roomId: number): Promise<boolean> {
        const [roomStaticInfo, roomPlayerInfo] = await Promise.all([
            getRoomStaticInfo(roomId),
            getRoomPlayerInfo(roomId),
        ]);
        if ((roomStaticInfo) && (roomPlayerInfo)) {
            const selfUserId        = User.UserModel.getSelfUserId();
            const playerDataList    = roomPlayerInfo.playerDataList || [];
            const selfPlayerData    = playerDataList.find(v => v.userId === selfUserId);
            if ((selfPlayerData) && (!selfPlayerData.isReady)) {
                return true;
            }

            if ((playerDataList.length === WarHelpers.WarRuleHelpers.getPlayersCountUnneutral(Helpers.getExisted(roomStaticInfo.settingsForCommon?.instanceWarRule)))  &&
                (playerDataList.every(v => v.isReady))                                                                                                                      &&
                (selfPlayerData)                                                                                                                                            &&
                (roomPlayerInfo.ownerPlayerIndex === selfPlayerData.playerIndex)
            ) {
                return true;
            }
        }
        return false;
    }
    export async function checkCanStartGame(roomId: number): Promise<boolean> {
        const [roomStaticInfo, roomPlayerInfo] = await Promise.all([
            getRoomStaticInfo(roomId),
            getRoomPlayerInfo(roomId),
        ]);
        if ((roomStaticInfo == null) || (roomPlayerInfo == null)) {
            return false;
        }

        const selfUserId        = User.UserModel.getSelfUserId();
        const playerDataList    = roomPlayerInfo.playerDataList || [];
        const selfPlayerData    = playerDataList.find(v => v.userId === selfUserId);
        return (selfPlayerData != null)
            && (selfPlayerData.playerIndex === roomPlayerInfo.ownerPlayerIndex)
            && (playerDataList.length == WarHelpers.WarRuleHelpers.getPlayersCountUnneutral(Helpers.getExisted(roomStaticInfo.settingsForCommon?.instanceWarRule)))
            && (playerDataList.every(v => v.isReady));
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    export async function createDataForCommonWarPlayerInfoPage(roomId: number | null): Promise<OpenDataForCommonWarPlayerInfoPage> {
        if (roomId == null) {
            return null;
        }

        const [roomStaticInfo, roomPlayerInfo] = await Promise.all([
            getRoomStaticInfo(roomId),
            getRoomPlayerInfo(roomId),
        ]);
        if ((roomStaticInfo == null) || (roomPlayerInfo == null)) {
            return null;
        }

        const settingsForCommon     = Helpers.getExisted(roomStaticInfo.settingsForCommon);
        const instanceWarRule       = Helpers.getExisted(settingsForCommon.instanceWarRule);
        const playersCountUnneutral = WarHelpers.WarRuleHelpers.getPlayersCountUnneutral(instanceWarRule);
        const playerDataList        = roomPlayerInfo.playerDataList || [];
        const playerInfoArray       : Common.PlayerInfo[] = [];
        for (let playerIndex = CommonConstants.PlayerIndex.First; playerIndex <= playersCountUnneutral; ++playerIndex) {
            const playerData    = playerDataList.find(v => v.playerIndex === playerIndex);
            const userId        = playerData?.userId ?? null;
            const isReady       = playerData?.isReady ?? null;

            playerInfoArray.push({
                playerIndex,
                teamIndex           : WarHelpers.WarRuleHelpers.getTeamIndex(instanceWarRule, playerIndex),
                isAi                : (userId == null) && (!!isReady),
                userId,
                coId                : playerData?.coId ?? null,
                unitAndTileSkinId   : playerData?.unitAndTileSkinId ?? null,
                isReady,
                isInTurn            : null,
                isDefeat            : null,
                restTimeToBoot      : null,
            });
        }

        return {
            gameConfig              : await Config.ConfigManager.getGameConfig(Helpers.getExisted(settingsForCommon.configVersion)),
            playersCountUnneutral,
            roomOwnerPlayerIndex    : Helpers.getExisted(roomPlayerInfo.ownerPlayerIndex),
            callbackOnExitRoom      : () => CoopCustomRoom.CcrProxy.reqCcrExitRoom(roomId),
            callbackOnDeletePlayer  : (playerIndex, forbidReentrance) => CoopCustomRoom.CcrProxy.reqCcrDeletePlayer(roomId, playerIndex, forbidReentrance),
            playerInfoArray,
            enterTurnTime           : null,
        };
    }

    export async function createDataForCommonWarBasicSettingsPage(roomId: number | null, showPassword: boolean): Promise<OpenDataForCommonWarBasicSettingsPage> {
        if (roomId == null) {
            return null;
        }

        const roomInfo = await getRoomStaticInfo(roomId);
        if (roomInfo == null) {
            return { dataArrayForListSettings: [] };
        }

        const settingsForCommon = Helpers.getExisted(roomInfo.settingsForCommon);
        const instanceWarRule   = Helpers.getExisted(settingsForCommon.instanceWarRule);
        const settingsForCcw    = Helpers.getExisted(roomInfo.settingsForCcw);
        const bootTimerParams   = Helpers.getExisted(settingsForCcw.bootTimerParams);
        const mapId             = Helpers.getExisted(settingsForCcw.mapId);
        const gameConfig        = Helpers.getExisted(await Config.ConfigManager.getGameConfig(Helpers.getExisted(settingsForCommon.configVersion)));
        const warEventFullData  = (await WarMap.WarMapModel.getRawData(mapId))?.warEventFullData ?? null;
        const warPassword       = settingsForCcw.warPassword;
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
                    settingsType    : WarBasicSettingsType.WarName,
                    currentValue    : settingsForCcw.warName ?? null,
                    instanceWarRule,
                    gameConfig,
                    warEventFullData,
                    callbackOnModify: null,
                },
                {
                    settingsType    : WarBasicSettingsType.WarPassword,
                    currentValue    : warPassword == null ? null : (showPassword ? warPassword : `****`),
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
            throw Helpers.newError(`CcrModel.createDataForCommonWarBasicSettingsPage() invalid timerType.`);
        }

        return openData;
    }

    export async function createDataForCommonWarAdvancedSettingsPage(roomId: number | null): Promise<OpenDataForCommonWarAdvancedSettingsPage> {
        if (roomId == null) {
            return null;
        }

        const roomInfo = await getRoomStaticInfo(roomId);
        if (roomInfo == null) {
            return null;
        }

        const settingsForCommon = Helpers.getExisted(roomInfo.settingsForCommon);
        const instanceWarRule   = Helpers.getExisted(settingsForCommon.instanceWarRule);
        return {
            gameConfig  : await Config.ConfigManager.getGameConfig(Helpers.getExisted(settingsForCommon.configVersion)),
            instanceWarRule,
            warType     : instanceWarRule.ruleForGlobalParams?.hasFogByDefault ? Types.WarType.CcwFog : Types.WarType.CcwStd,
        };
    }

    async function checkIsMeetFilter({ roomId, roomPlayerInfo, roomStaticInfo, filter }: {
        roomId          : number;
        roomPlayerInfo  : ICcrRoomPlayerInfo | null;
        roomStaticInfo  : ICcrRoomStaticInfo | null;
        filter          : CcrRoomFilter | null;
    }): Promise<boolean> {
        if (roomPlayerInfo == null) {
            return false;
        }

        if (filter == null) {
            return true;
        }

        {
            const filterRoomId = filter.roomId;
            if ((filterRoomId != null) && (roomId !== filterRoomId)) {
                return false;
            }
        }

        const instanceWarRule = roomStaticInfo?.settingsForCommon?.instanceWarRule;
        {
            const filterHasFog = filter.hasFog;
            if ((filterHasFog != null) && ((!!instanceWarRule?.ruleForGlobalParams?.hasFogByDefault) !== filterHasFog)) {
                return false;
            }
        }

        const playerDataList = roomPlayerInfo.playerDataList ?? [];
        {
            const filterUserIdInRoom = filter.userIdInRoom;
            if ((filterUserIdInRoom != null) && (!playerDataList.some(v => v.userId === filterUserIdInRoom))) {
                return false;
            }
        }

        {
            const filterUserIdNotInRoom = filter.userIdNotInRoom;
            if ((filterUserIdNotInRoom != null) && (playerDataList.some(v => v.userId === filterUserIdNotInRoom))) {
                return false;
            }
        }

        {
            const filterCoName = filter.coName?.trim();
            if (filterCoName) {
                const configVersion = roomStaticInfo?.settingsForCommon?.configVersion;
                if (configVersion == null) {
                    return false;
                }

                const gameConfig = await Config.ConfigManager.getGameConfig(configVersion);
                if (gameConfig == null) {
                    return false;
                }

                const lowerCaseName = filterCoName.toLowerCase();
                if (!playerDataList.some(v => {
                    const coId = v.coId;
                    const name = coId == null ? null : gameConfig.getCoBasicCfg(coId)?.name;
                    return (name != null) && (name.toLowerCase().includes(lowerCaseName));
                })) {
                    return false;
                }
            }
        }

        {
            const filterMapName = filter.mapName?.trim();
            if (filterMapName) {
                const mapId = roomStaticInfo?.settingsForCcw?.mapId;
                if (mapId == null) {
                    return false;
                }

                const mapRawData    = await WarMap.WarMapModel.getRawData(mapId);
                const lowerCaseName = filterMapName.toLowerCase();
                if (!(mapRawData?.mapNameArray || []).some(v => {
                    const name = v.text;
                    return (!!name) && (name.toLowerCase().includes(lowerCaseName));
                })) {
                    return false;
                }
            }
        }

        {
            const filterUserNickname = filter.userNickname?.trim();
            if (filterUserNickname) {
                const lowerCaseName = filterUserNickname.toLowerCase();
                let hasPlayer       = false;
                for (const playerInfo of playerDataList) {
                    const userId    = playerInfo.userId;
                    const nickname  = (userId == null ? null : await User.UserModel.getUserBriefInfo(userId))?.nickname;
                    if ((nickname != null) && (nickname.toLowerCase().includes(lowerCaseName))) {
                        hasPlayer = true;
                        break;
                    }
                }
                if (!hasPlayer) {
                    return false;
                }
            }
        }

        return true;
    }
}

// export default CcrModel;
