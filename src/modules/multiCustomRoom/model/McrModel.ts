
// import TwnsCommonWarAdvancedSettingsPage    from "../../common/view/CommonWarAdvancedSettingsPage";
// import TwnsCommonWarBasicSettingsPage       from "../../common/view/CommonWarBasicSettingsPage";
// import TwnsCommonWarPlayerInfoPage          from "../../common/view/CommonWarPlayerInfoPage";
// import McrProxy                             from "../../multiCustomRoom/model/McrProxy";
// import CommonConstants                      from "../../tools/helpers/CommonConstants";
// import Helpers                              from "../../tools/helpers/Helpers";
// import Types                                from "../../tools/helpers/Types";
// import Notify                               from "../../tools/notify/Notify";
// import Twns.Notify                       from "../../tools/notify/NotifyType";
// import ProtoTypes                           from "../../tools/proto/ProtoTypes";
// import WarRuleHelpers                       from "../../tools/warHelpers/WarRuleHelpers";
// import UserModel                            from "../../user/model/UserModel";
// import WarMapModel                          from "../../warMap/model/WarMapModel";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.MultiCustomRoom.McrModel {
    import IMcrRoomStaticInfo                       = CommonProto.MultiCustomRoom.IMcrRoomStaticInfo;
    import IMcrRoomPlayerInfo                       = CommonProto.MultiCustomRoom.IMcrRoomPlayerInfo;
    import WarBasicSettingsType                     = Twns.Types.WarBasicSettingsType;
    import McrRoomFilter                            = Twns.Types.McrRoomFilter;
    import ConfigManager                            = Config.ConfigManager;
    import OpenDataForCommonWarBasicSettingsPage    = Common.OpenDataForCommonWarBasicSettingsPage;
    import OpenDataForCommonWarAdvancedSettingsPage = Common.OpenDataForCommonWarAdvancedSettingsPage;
    import OpenDataForCommonWarPlayerInfoPage       = Twns.Common.OpenDataForCommonWarPlayerInfoPage;

    const _roomStaticInfoAccessor = Twns.Helpers.createCachedDataAccessor<number, IMcrRoomStaticInfo>({
        reqData : (roomId: number) => McrProxy.reqMcrGetRoomStaticInfo(roomId),
    });
    const _roomPlayerInfoAccessor = Twns.Helpers.createCachedDataAccessor<number, IMcrRoomStaticInfo>({
        // dataExpireTime  : 30,
        reqData         : (roomId: number) => McrProxy.reqMcrGetRoomPlayerInfo(roomId),
    });

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for rooms.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    export function getRoomStaticInfo(roomId: number): Promise<IMcrRoomStaticInfo | null> {
        return _roomStaticInfoAccessor.getData(roomId);
    }
    export function setRoomStaticInfo(roomId: number, info: IMcrRoomStaticInfo | null): void {
        _roomStaticInfoAccessor.setData(roomId, info);
    }

    export function getRoomPlayerInfo(roomId: number): Promise<IMcrRoomPlayerInfo | null> {
        return _roomPlayerInfoAccessor.getData(roomId);
    }
    export function setRoomPlayerInfo(roomId: number, info: IMcrRoomPlayerInfo | null): void {
        _roomPlayerInfoAccessor.setData(roomId, info);
    }

    export async function getUnjoinedRoomIdSet(filter: McrRoomFilter | null): Promise<Set<number>> {
        const unjoinedRoomIdArray   : number[] = [];
        const selfUserId            = Twns.User.UserModel.getSelfUserId();
        if (selfUserId == null) {
            return new Set();
        }

        const allRoomIdArray        = _roomPlayerInfoAccessor.getRequestedKeyArray();
        const roomPlayerInfoArray   = Twns.Helpers.getNonNullElements(await Promise.all(allRoomIdArray.map(v => getRoomPlayerInfo(v))));
        for (const roomPlayerInfo of roomPlayerInfoArray) {
            const playerDataList = roomPlayerInfo.playerDataList ?? [];
            if ((playerDataList.length < Twns.Helpers.getExisted(roomPlayerInfo.playersCountUnneutral))  &&
                (playerDataList.every(v => v.userId !== selfUserId))
            ) {
                unjoinedRoomIdArray.push(Twns.Helpers.getExisted(roomPlayerInfo.roomId));
            }
        }

        return (filter == null)
            ? new Set(unjoinedRoomIdArray)
            : getFilteredRoomIdSet(unjoinedRoomIdArray, filter);
    }
    export async function getJoinedRoomIdSet(filter: McrRoomFilter | null): Promise<Set<number>> {
        const joinedRoomIdArray : number[] = [];
        const selfUserId        = Twns.User.UserModel.getSelfUserId();
        if (selfUserId == null) {
            return new Set();
        }

        const allRoomIdArray        = _roomPlayerInfoAccessor.getRequestedKeyArray();
        const roomPlayerInfoArray   = Twns.Helpers.getNonNullElements(await Promise.all(allRoomIdArray.map(v => getRoomPlayerInfo(v))));
        for (const roomPlayerInfo of roomPlayerInfoArray) {
            if (roomPlayerInfo.playerDataList?.some(v => v.userId === selfUserId)) {
                joinedRoomIdArray.push(Twns.Helpers.getExisted(roomPlayerInfo.roomId));
            }
        }

        return (filter == null)
            ? new Set(joinedRoomIdArray)
            : getFilteredRoomIdSet(joinedRoomIdArray, filter);
    }
    async function getFilteredRoomIdSet(roomIdArray: number[], filter: McrRoomFilter): Promise<Set<number>> {
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
        if ((roomStaticInfo == null) || (roomPlayerInfo == null)) {
            return false;
        }

        const selfUserId        = Twns.User.UserModel.getSelfUserId();
        const playerDataList    = roomPlayerInfo.playerDataList || [];
        const selfPlayerData    = playerDataList.find(v => v.userId === selfUserId);
        if ((selfPlayerData) && (!selfPlayerData.isReady)) {
            return true;
        }

        if ((playerDataList.length === WarHelpers.WarRuleHelpers.getPlayersCountUnneutral(Twns.Helpers.getExisted(roomStaticInfo.settingsForCommon?.instanceWarRule)))   &&
            (playerDataList.every(v => (v.isReady) && (v.userId != null)))                                                                                          &&
            (selfPlayerData)                                                                                                                                        &&
            (roomPlayerInfo.ownerPlayerIndex === selfPlayerData.playerIndex)
        ) {
            return true;
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

        const selfUserId        = Twns.User.UserModel.getSelfUserId();
        const playerDataList    = roomPlayerInfo.playerDataList || [];
        const selfPlayerData    = playerDataList.find(v => v.userId === selfUserId);
        return (selfPlayerData != null)
            && (selfPlayerData.playerIndex === roomPlayerInfo.ownerPlayerIndex)
            && (playerDataList.length == WarHelpers.WarRuleHelpers.getPlayersCountUnneutral(Twns.Helpers.getExisted(roomStaticInfo.settingsForCommon?.instanceWarRule)))
            && (playerDataList.every(v => (v.isReady) && (v.userId != null)));
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

        const settingsForCommon     = Twns.Helpers.getExisted(roomStaticInfo.settingsForCommon);
        const instanceWarRule       = Twns.Helpers.getExisted(settingsForCommon.instanceWarRule);
        const playersCountUnneutral = Twns.Helpers.getExisted(WarHelpers.WarRuleHelpers.getPlayersCountUnneutral(instanceWarRule));
        const playerDataList        = roomPlayerInfo.playerDataList || [];
        const playerInfoArray       : Twns.Common.PlayerInfo[] = [];
        for (let playerIndex = CommonConstants.WarFirstPlayerIndex; playerIndex <= playersCountUnneutral; ++playerIndex) {
            const playerData = playerDataList.find(v => v.playerIndex === playerIndex);
            playerInfoArray.push({
                playerIndex,
                teamIndex           : WarHelpers.WarRuleHelpers.getTeamIndex(instanceWarRule, playerIndex),
                isAi                : false,
                userId              : playerData?.userId ?? null,
                coId                : playerData?.coId ?? null,
                unitAndTileSkinId   : playerData?.unitAndTileSkinId ?? null,
                isReady             : playerData?.isReady ?? null,
                isInTurn            : null,
                isDefeat            : null,
                restTimeToBoot      : null,
            });
        }

        return {
            gameConfig              : await Config.ConfigManager.getGameConfig(Twns.Helpers.getExisted(settingsForCommon.configVersion)),
            playersCountUnneutral,
            roomOwnerPlayerIndex    : Twns.Helpers.getExisted(roomPlayerInfo.ownerPlayerIndex),
            callbackOnExitRoom      : () => {
                if ((roomPlayerInfo.playerDataList?.filter(v => v.userId != null).length ?? 0) > 1) {
                    McrProxy.reqMcrExitRoom(roomId);
                } else {
                    McrProxy.reqMcrDeleteRoom(roomId);
                }
            },
            callbackOnDeletePlayer  : (playerIndex) => McrProxy.reqMcrDeletePlayer(roomId, playerIndex),
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

        const settingsForCommon = Twns.Helpers.getExisted(roomInfo.settingsForCommon);
        const instanceWarRule   = Twns.Helpers.getExisted(settingsForCommon.instanceWarRule);
        const settingsForMcw    = Twns.Helpers.getExisted(roomInfo.settingsForMcw);
        const bootTimerParams   = Twns.Helpers.getExisted(settingsForMcw.bootTimerParams);
        const gameConfig        = Twns.Helpers.getExisted(await ConfigManager.getGameConfig(Twns.Helpers.getExisted(settingsForCommon.configVersion)));
        const mapId             = Twns.Helpers.getExisted(settingsForMcw.mapId);
        const warEventFullData  = (await WarMap.WarMapModel.getRawData(mapId))?.warEventFullData ?? null;
        const warPassword       = settingsForMcw.warPassword;
        const timerType         = bootTimerParams[0] as Twns.Types.BootTimerType;
        const openData          : OpenDataForCommonWarBasicSettingsPage = {
            dataArrayForListSettings    : [
                {
                    settingsType    : WarBasicSettingsType.MapId,
                    currentValue    : Twns.Helpers.getExisted(settingsForMcw.mapId),
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
                    currentValue    : warPassword == null ? null : (showPassword ? warPassword : `****`),
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
        if (timerType === Twns.Types.BootTimerType.Regular) {
            openData.dataArrayForListSettings.push({
                settingsType    : WarBasicSettingsType.TimerRegularParam,
                currentValue    : bootTimerParams[1],
                instanceWarRule,
                gameConfig,
                warEventFullData,
                callbackOnModify: null,
            });
        } else if (timerType === Twns.Types.BootTimerType.Incremental) {
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
            throw Twns.Helpers.newError(`McrModel.createDataForCommonWarBasicSettingsPage() invalid timerType.`);
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

        const settingsForCommon = Twns.Helpers.getExisted(roomInfo.settingsForCommon);
        const instanceWarRule           = Twns.Helpers.getExisted(settingsForCommon.instanceWarRule);
        return {
            gameConfig  : await Config.ConfigManager.getGameConfig(Twns.Helpers.getExisted(settingsForCommon.configVersion)),
            instanceWarRule,
            warType     : instanceWarRule.ruleForGlobalParams?.hasFogByDefault ? Twns.Types.WarType.McwFog : Twns.Types.WarType.McwStd,
        };
    }

    async function checkIsMeetFilter({ roomId, roomPlayerInfo, roomStaticInfo, filter }: {
        roomId          : number;
        roomPlayerInfo  : IMcrRoomPlayerInfo | null;
        roomStaticInfo  : IMcrRoomStaticInfo | null;
        filter          : McrRoomFilter | null;
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

                const gameConfig = await ConfigManager.getGameConfig(configVersion);
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
                const mapId = roomStaticInfo?.settingsForMcw?.mapId;
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
                    const nickname  = (userId == null ? null : await Twns.User.UserModel.getUserBriefInfo(userId))?.nickname;
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

// export default McrModel;
