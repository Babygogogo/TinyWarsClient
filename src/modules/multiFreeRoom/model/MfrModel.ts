
// import TwnsCommonWarAdvancedSettingsPage    from "../../common/view/CommonWarAdvancedSettingsPage";
// import TwnsCommonWarBasicSettingsPage       from "../../common/view/CommonWarBasicSettingsPage";
// import TwnsCommonWarPlayerInfoPage          from "../../common/view/CommonWarPlayerInfoPage";
// import MfrProxy                             from "../../multiFreeRoom/model/MfrProxy";
// import CommonConstants                      from "../../tools/helpers/CommonConstants";
// import Helpers                              from "../../tools/helpers/Helpers";
// import Types                                from "../../tools/helpers/Types";
// import Notify                               from "../../tools/notify/Notify";
// import TwnsNotifyType                       from "../../tools/notify/NotifyType";
// import ProtoTypes                           from "../../tools/proto/ProtoTypes";
// import WarRuleHelpers                       from "../../tools/warHelpers/WarRuleHelpers";
// import UserModel                            from "../../user/model/UserModel";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.MultiFreeRoom.MfrModel {
    import IMfrRoomStaticInfo                       = CommonProto.MultiFreeRoom.IMfrRoomStaticInfo;
    import IMfrRoomPlayerInfo                       = CommonProto.MultiFreeRoom.IMfrRoomPlayerInfo;
    import OpenDataForCommonWarBasicSettingsPage    = Common.OpenDataForCommonWarBasicSettingsPage;
    import OpenDataForCommonWarAdvancedSettingsPage = Twns.Common.OpenDataForCommonWarAdvancedSettingsPage;
    import OpenDataForCommonWarPlayerInfoPage       = TwnsCommonWarPlayerInfoPage.OpenDataForCommonWarPlayerInfoPage;
    import WarBasicSettingsType                     = Types.WarBasicSettingsType;
    import MfrRoomFilter                            = Types.MfrRoomFilter;

    const _roomStaticInfoAccessor = Helpers.createCachedDataAccessor<number, IMfrRoomStaticInfo>({
        reqData : (roomId: number) => MfrProxy.reqMfrGetRoomStaticInfo(roomId),
    });
    const _roomPlayerInfoAccessor = Helpers.createCachedDataAccessor<number, IMfrRoomPlayerInfo>({
        reqData : (roomId: number) => MfrProxy.reqMfrGetRoomPlayerInfo(roomId),
    });

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for rooms.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    export function getRoomStaticInfo(roomId: number): Promise<IMfrRoomStaticInfo | null> {
        return _roomStaticInfoAccessor.getData(roomId);
    }
    export function setRoomStaticInfo(roomId: number, info: IMfrRoomStaticInfo | null): void {
        _roomStaticInfoAccessor.setData(roomId, info);
    }

    export function getRoomPlayerInfo(roomId: number): Promise<IMfrRoomPlayerInfo | null> {
        return _roomPlayerInfoAccessor.getData(roomId);
    }
    export function setRoomPlayerInfo(roomId: number, info: IMfrRoomPlayerInfo | null): void {
        _roomPlayerInfoAccessor.setData(roomId, info);
    }

    export async function getUnjoinedRoomIdSet(filter: MfrRoomFilter | null): Promise<Set<number>> {
        const unjoinedRoomIdArray   : number[] = [];
        const selfUserId            = UserModel.getSelfUserId();
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
    export async function getJoinedRoomIdSet(filter: MfrRoomFilter | null): Promise<Set<number>> {
        const joinedRoomIdArray : number[] = [];
        const selfUserId        = UserModel.getSelfUserId();
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
    async function getFilteredRoomIdSet(roomIdArray: number[], filter: MfrRoomFilter): Promise<Set<number>> {
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
        if ((roomPlayerInfo) && (roomStaticInfo)) {
            const selfUserId        = UserModel.getSelfUserId();
            const playerDataList    = roomPlayerInfo.playerDataList || [];
            const selfPlayerData    = playerDataList.find(v => v.userId === selfUserId);
            if ((selfPlayerData) && (!selfPlayerData.isReady)) {
                return true;
            }

            if ((playerDataList.length === WarRuleHelpers.getPlayersCountUnneutral(Helpers.getExisted(roomStaticInfo.settingsForMfw?.initialWarData?.settingsForCommon?.warRule)))  &&
                (playerDataList.every(v => v.isReady))                                                                                                                              &&
                (selfPlayerData)                                                                                                                                                    &&
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

        const selfUserId        = UserModel.getSelfUserId();
        const playerDataList    = roomPlayerInfo.playerDataList || [];
        const selfPlayerData    = playerDataList.find(v => v.userId === selfUserId);
        return (selfPlayerData != null)
            && (selfPlayerData.playerIndex === roomPlayerInfo.ownerPlayerIndex)
            && (playerDataList.length === WarRuleHelpers.getPlayersCountUnneutral(Helpers.getExisted(roomStaticInfo.settingsForMfw?.initialWarData?.settingsForCommon?.warRule)))
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

        const settingsForCommon     = Helpers.getExisted(roomStaticInfo.settingsForMfw?.initialWarData?.settingsForCommon);
        const warRule               = Helpers.getExisted(settingsForCommon.warRule);
        const playersCountUnneutral = WarRuleHelpers.getPlayersCountUnneutral(warRule);
        const playerDataList        = roomPlayerInfo.playerDataList || [];
        const playerInfoArray       : TwnsCommonWarPlayerInfoPage.PlayerInfo[] = [];
        for (let playerIndex = CommonConstants.WarFirstPlayerIndex; playerIndex <= playersCountUnneutral; ++playerIndex) {
            const playerData    = playerDataList.find(v => v.playerIndex === playerIndex);
            const userId        = playerData?.userId ?? null;
            const isReady       = playerData?.isReady ?? null;
            playerInfoArray.push({
                playerIndex,
                teamIndex           : WarRuleHelpers.getTeamIndex(warRule, playerIndex),
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
            callbackOnExitRoom      : () => MfrProxy.reqMfrExitRoom(roomId),
            callbackOnDeletePlayer  : (playerIndex) => MfrProxy.reqMfrDeletePlayer(roomId, playerIndex),
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

        const settingsForMfw    = Helpers.getExisted(roomInfo.settingsForMfw);
        const settingsForCommon = Helpers.getExisted(settingsForMfw.initialWarData?.settingsForCommon);
        const warRule           = Helpers.getExisted(settingsForCommon.warRule);
        const bootTimerParams   = Helpers.getExisted(settingsForMfw.bootTimerParams);
        const gameConfig        = Helpers.getExisted(await Config.ConfigManager.getGameConfig(Helpers.getExisted(settingsForCommon.configVersion)));
        const warPassword       = settingsForMfw.warPassword;
        const timerType         = bootTimerParams[0] as Types.BootTimerType;
        const warEventFullData  = settingsForMfw.initialWarData?.warEventManager?.warEventFullData ?? null;
        const openData          : OpenDataForCommonWarBasicSettingsPage = {
            dataArrayForListSettings    : [
                {
                    settingsType    : WarBasicSettingsType.WarName,
                    currentValue    : settingsForMfw.warName ?? null,
                    warRule,
                    gameConfig,
                    warEventFullData,
                    callbackOnModify: null,
                },
                {
                    settingsType    : WarBasicSettingsType.WarPassword,
                    currentValue    : warPassword == null ? null : (showPassword ? warPassword : `****`),
                    warRule,
                    gameConfig,
                    warEventFullData,
                    callbackOnModify: null,
                },
                {
                    settingsType    : WarBasicSettingsType.WarComment,
                    currentValue    : settingsForMfw.warComment ?? null,
                    warRule,
                    gameConfig,
                    warEventFullData,
                    callbackOnModify: null,
                },
                {
                    settingsType    : WarBasicSettingsType.WarRuleTitle,
                    currentValue    : null,
                    warRule,
                    gameConfig,
                    warEventFullData,
                    callbackOnModify: null,
                },
                {
                    settingsType    : WarBasicSettingsType.HasFog,
                    currentValue    : null,
                    warRule,
                    gameConfig,
                    warEventFullData,
                    callbackOnModify: null,
                },
                {
                    settingsType    : WarBasicSettingsType.Weather,
                    currentValue    : null,
                    warRule,
                    gameConfig,
                    warEventFullData,
                    callbackOnModify: null,
                },
                {
                    settingsType    : WarBasicSettingsType.WarEvent,
                    currentValue    : null,
                    warRule,
                    gameConfig,
                    warEventFullData,
                    callbackOnModify: null,
                },
                {
                    settingsType    : WarBasicSettingsType.TurnsLimit,
                    currentValue    : settingsForCommon.turnsLimit ?? CommonConstants.WarMaxTurnsLimit,
                    warRule,
                    gameConfig,
                    warEventFullData,
                    callbackOnModify: null,
                },
                {
                    settingsType    : WarBasicSettingsType.TimerType,
                    currentValue    : timerType,
                    warRule,
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
                warRule,
                gameConfig,
                warEventFullData,
                callbackOnModify: null,
            });
        } else if (timerType === Types.BootTimerType.Incremental) {
            openData.dataArrayForListSettings.push(
                {
                    settingsType    : WarBasicSettingsType.TimerIncrementalParam1,
                    currentValue    : bootTimerParams[1],
                    warRule,
                    gameConfig,
                    warEventFullData,
                    callbackOnModify: null,
                },
                {
                    settingsType    : WarBasicSettingsType.TimerIncrementalParam2,
                    currentValue    : bootTimerParams[2],
                    warRule,
                    gameConfig,
                    warEventFullData,
                    callbackOnModify: null,
                },
            );
        } else {
            throw Helpers.newError(`MfrModel.createDataForCommonWarBasicSettingsPage() invalid timerType: ${timerType}.`);
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

        const settingsForCommon = Helpers.getExisted(roomInfo.settingsForMfw?.initialWarData?.settingsForCommon);
        const warRule           = Helpers.getExisted(settingsForCommon.warRule);
        return {
            gameConfig  : await Config.ConfigManager.getGameConfig(Helpers.getExisted(settingsForCommon.configVersion)),
            warRule,
            warType     : warRule.ruleForGlobalParams?.hasFogByDefault ? Types.WarType.MfwFog : Types.WarType.MfwStd,
        };
    }

    async function checkIsMeetFilter({ roomId, roomPlayerInfo, roomStaticInfo, filter }: {
        roomId          : number;
        roomPlayerInfo  : IMfrRoomPlayerInfo | null;
        roomStaticInfo  : IMfrRoomStaticInfo | null;
        filter          : MfrRoomFilter | null;
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

        const warRule = roomStaticInfo?.settingsForMfw?.initialWarData?.settingsForCommon?.warRule;
        {
            const filterHasFog = filter.hasFog;
            if ((filterHasFog != null) && ((!!warRule?.ruleForGlobalParams?.hasFogByDefault) !== filterHasFog)) {
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
                const configVersion = roomStaticInfo?.settingsForMfw?.initialWarData?.settingsForCommon?.configVersion;
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
            const filterUserNickname = filter.userNickname?.trim();
            if (filterUserNickname) {
                const lowerCaseName = filterUserNickname.toLowerCase();
                let hasPlayer       = false;
                for (const playerInfo of playerDataList) {
                    const userId    = playerInfo.userId;
                    const nickname  = (userId == null ? null : await UserModel.getUserBriefInfo(userId))?.nickname;
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

// export default MfrModel;
