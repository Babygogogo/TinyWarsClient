
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
namespace MfrModel {
    import IMfrRoomStaticInfo                       = CommonProto.MultiFreeRoom.IMfrRoomStaticInfo;
    import IMfrRoomPlayerInfo                       = CommonProto.MultiFreeRoom.IMfrRoomPlayerInfo;
    import OpenDataForCommonWarBasicSettingsPage    = TwnsCommonWarBasicSettingsPage.OpenDataForCommonWarBasicSettingsPage;
    import OpenDataForCommonWarAdvancedSettingsPage = TwnsCommonWarAdvancedSettingsPage.OpenDataForCommonWarAdvancedSettingsPage;
    import OpenDataForCommonWarPlayerInfoPage       = TwnsCommonWarPlayerInfoPage.OpenDataForCommonWarPlayerInfoPage;
    import WarBasicSettingsType                     = Types.WarBasicSettingsType;

    const _roomStaticInfoAccessor = Helpers.createCachedDataAccessor<number, IMfrRoomStaticInfo>({
        reqData : (roomId: number) => MfrProxy.reqMfrGetRoomStaticInfo(roomId),
    });
    const _roomPlayerInfoAccessor = Helpers.createCachedDataAccessor<number, IMfrRoomPlayerInfo>({
        reqData : (roomId: number) => MfrProxy.reqMfrGetRoomPlayerInfo(roomId),
    });

    const _joinableRoomIdSet    = new Set<number>();
    const _joinedRoomIdSet      = new Set<number>();

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

    export function setJoinableRoomIdArray(roomIdArray: number[]): void {
        _joinableRoomIdSet.clear();
        for (const roomId of roomIdArray || []) {
            _joinableRoomIdSet.add(roomId);
        }
    }
    export function getUnjoinedRoomIdSet(): Set<number> {
        return _joinableRoomIdSet;
    }

    export function setJoinedRoomIdArray(roomIdArray: number[]): void {
        _joinedRoomIdSet.clear();
        for (const roomId of roomIdArray || []) {
            _joinedRoomIdSet.add(roomId);
        }
    }
    export function getJoinedRoomIdSet(): Set<number> {
        return _joinedRoomIdSet;
    }

    export async function checkIsRed(): Promise<boolean> {
        for (const roomId of getJoinedRoomIdSet()) {
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
    export async function createDataForCommonWarPlayerInfoPage(roomId: number): Promise<OpenDataForCommonWarPlayerInfoPage> {
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
            gameConfig              : await Twns.Config.ConfigManager.getGameConfig(Helpers.getExisted(settingsForCommon.configVersion)),
            playersCountUnneutral,
            roomOwnerPlayerIndex    : Helpers.getExisted(roomPlayerInfo.ownerPlayerIndex),
            callbackOnExitRoom      : () => MfrProxy.reqMfrExitRoom(roomId),
            callbackOnDeletePlayer  : (playerIndex) => MfrProxy.reqMfrDeletePlayer(roomId, playerIndex),
            playerInfoArray,
            enterTurnTime           : null,
        };
    }

    export async function createDataForCommonWarBasicSettingsPage(roomId: number, showPassword: boolean): Promise<OpenDataForCommonWarBasicSettingsPage> {
        const roomInfo = await getRoomStaticInfo(roomId);
        if (roomInfo == null) {
            return { dataArrayForListSettings: [] };
        }

        const settingsForMfw    = Helpers.getExisted(roomInfo.settingsForMfw);
        const settingsForCommon = Helpers.getExisted(settingsForMfw.initialWarData?.settingsForCommon);
        const warRule           = Helpers.getExisted(settingsForCommon.warRule);
        const bootTimerParams   = Helpers.getExisted(settingsForMfw.bootTimerParams);
        const warPassword       = settingsForMfw.warPassword;
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
                    currentValue    : warPassword == null ? null : (showPassword ? warPassword : `****`),
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
            throw Helpers.newError(`MfrModel.createDataForCommonWarBasicSettingsPage() invalid timerType: ${timerType}.`);
        }

        return openData;
    }

    export async function createDataForCommonWarAdvancedSettingsPage(roomId: number): Promise<OpenDataForCommonWarAdvancedSettingsPage> {
        const roomInfo = await getRoomStaticInfo(roomId);
        if (roomInfo == null) {
            return null;
        }

        const settingsForCommon = Helpers.getExisted(roomInfo.settingsForMfw?.initialWarData?.settingsForCommon);
        const warRule           = Helpers.getExisted(settingsForCommon.warRule);
        return {
            gameConfig  : await Twns.Config.ConfigManager.getGameConfig(Helpers.getExisted(settingsForCommon.configVersion)),
            warRule,
            warType     : warRule.ruleForGlobalParams?.hasFogByDefault ? Types.WarType.MfwFog : Types.WarType.MfwStd,
        };
    }
}

// export default MfrModel;
