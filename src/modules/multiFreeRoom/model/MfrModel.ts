
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

namespace MfrModel {
    import NotifyType                               = TwnsNotifyType.NotifyType;
    import IMfrRoomInfo                             = ProtoTypes.MultiFreeRoom.IMfrRoomInfo;
    import NetMessage                               = ProtoTypes.NetMessage;
    import OpenDataForCommonWarBasicSettingsPage    = TwnsCommonWarBasicSettingsPage.OpenDataForCommonWarBasicSettingsPage;
    import OpenDataForCommonWarAdvancedSettingsPage = TwnsCommonWarAdvancedSettingsPage.OpenDataForCommonWarAdvancedSettingsPage;
    import OpenDataForCommonWarPlayerInfoPage       = TwnsCommonWarPlayerInfoPage.OpenDataForCommonWarPlayerInfoPage;
    import WarBasicSettingsType                     = Types.WarBasicSettingsType;

    const _roomInfoDict         = new Map<number, IMfrRoomInfo | null>();
    const _roomInfoRequests     = new Map<number, ((info: NetMessage.MsgMfrGetRoomInfo.IS) => void)[]>();

    const _unjoinedRoomIdSet    = new Set<number>();
    const _joinedRoomIdSet      = new Set<number>();

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for rooms.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    export function getRoomInfo(roomId: number): Promise<IMfrRoomInfo | null> {
        if (roomId == null) {
            return new Promise((resolve) => resolve(null));
        }
        if (_roomInfoDict.has(roomId)) {
            return new Promise(resolve => resolve(_roomInfoDict.get(roomId) ?? null));
        }

        if (_roomInfoRequests.has(roomId)) {
            return new Promise((resolve) => {
                Helpers.getExisted(_roomInfoRequests.get(roomId)).push(info => resolve(info.roomInfo ?? null));
            });
        }

        new Promise<void>((resolve) => {
            const callbackOnSucceed = (e: egret.Event): void => {
                const data = e.data as NetMessage.MsgMfrGetRoomInfo.IS;
                if (data.roomId === roomId) {
                    Notify.removeEventListener(NotifyType.MsgMfrGetRoomInfo,         callbackOnSucceed);
                    Notify.removeEventListener(NotifyType.MsgMfrGetRoomInfoFailed,   callbackOnFailed);

                    for (const cb of Helpers.getExisted(_roomInfoRequests.get(roomId))) {
                        cb(data);
                    }
                    _roomInfoRequests.delete(roomId);

                    resolve();
                }
            };
            const callbackOnFailed = (e: egret.Event): void => {
                const data = e.data as NetMessage.MsgMfrGetRoomInfo.IS;
                if (data.roomId === roomId) {
                    Notify.removeEventListener(NotifyType.MsgMfrGetRoomInfo,         callbackOnSucceed);
                    Notify.removeEventListener(NotifyType.MsgMfrGetRoomInfoFailed,   callbackOnFailed);

                    for (const cb of Helpers.getExisted(_roomInfoRequests.get(roomId))) {
                        cb(data);
                    }
                    _roomInfoRequests.delete(roomId);

                    resolve();
                }
            };

            Notify.addEventListener(NotifyType.MsgMfrGetRoomInfo,        callbackOnSucceed);
            Notify.addEventListener(NotifyType.MsgMfrGetRoomInfoFailed,  callbackOnFailed);

            MfrProxy.reqMfrGetRoomInfo(roomId);
        });

        return new Promise((resolve) => {
            _roomInfoRequests.set(roomId, [info => resolve(info.roomInfo ?? null)]);
        });
    }
    function setRoomInfo(roomId: number, info: IMfrRoomInfo | null): void {
        _roomInfoDict.set(roomId, info);
    }

    export function setJoinableRoomInfoList(infoList: IMfrRoomInfo[]): void {
        _unjoinedRoomIdSet.clear();
        for (const roomInfo of infoList || []) {
            const roomId = Helpers.getExisted(roomInfo.roomId);
            _unjoinedRoomIdSet.add(roomId);
            setRoomInfo(roomId, roomInfo);
        }
    }
    export function getUnjoinedRoomIdSet(): Set<number> {
        return _unjoinedRoomIdSet;
    }

    export function setJoinedRoomInfoList(infoList: IMfrRoomInfo[]): void {
        _joinedRoomIdSet.clear();
        for (const roomInfo of infoList || []) {
            const roomId = Helpers.getExisted(roomInfo.roomId);
            _joinedRoomIdSet.add(roomId);
            setRoomInfo(roomId, roomInfo);
        }
    }
    export function getJoinedRoomIdSet(): Set<number> {
        return _joinedRoomIdSet;
    }

    export function updateOnMsgMfrGetRoomInfo(data: ProtoTypes.NetMessage.MsgMfrGetRoomInfo.IS): void {
        const roomInfo  = data.roomInfo ?? null;
        const roomId    = Helpers.getExisted(data.roomId);
        setRoomInfo(roomId, roomInfo);

        if (roomInfo == null) {
            _unjoinedRoomIdSet.delete(roomId);
            _joinedRoomIdSet.delete(roomId);
        }
    }
    export async function updateOnMsgMfrDeletePlayer(data: ProtoTypes.NetMessage.MsgMfrDeletePlayer.IS): Promise<void> {
        const roomId    = Helpers.getExisted(data.roomId);
        const roomInfo  = await getRoomInfo(roomId);
        if (roomInfo) {
            const playerDataList    = Helpers.getExisted(roomInfo.playerDataList);
            const playerData        = playerDataList.find(v => v.playerIndex === data.targetPlayerIndex);
            Helpers.deleteElementFromArray(playerDataList, playerData);

            if ((playerData) && (playerData.userId === UserModel.getSelfUserId())) {
                _unjoinedRoomIdSet.add(roomId);
                _joinedRoomIdSet.delete(roomId);
            }
        }
    }
    export async function updateOnMsgMfrSetReady(data: ProtoTypes.NetMessage.MsgMfrSetReady.IS): Promise<void> {
        Helpers.getExisted((await getRoomInfo(Helpers.getExisted(data.roomId)))?.playerDataList?.find(v => v.playerIndex === data.playerIndex)).isReady = data.isReady;
    }
    export async function updateOnMsgMfrSetSelfSettings(data: ProtoTypes.NetMessage.MsgMfrSetSelfSettings.IS): Promise<void> {
        const roomInfo = await getRoomInfo(Helpers.getExisted(data.roomId));
        if (roomInfo) {
            const oldPlayerIndex                = data.oldPlayerIndex;
            const newPlayerIndex                = data.newPlayerIndex;
            const playerDataInRoom              = Helpers.getExisted(roomInfo.playerDataList?.find(v => v.playerIndex === oldPlayerIndex));
            const playerDataInWar               = Helpers.getExisted(roomInfo.settingsForMfw?.initialWarData?.playerManager?.players?.find(v => v.playerIndex === newPlayerIndex));
            playerDataInRoom.coId               = playerDataInWar.coId;
            playerDataInRoom.unitAndTileSkinId  = playerDataInWar.unitAndTileSkinId;
            playerDataInRoom.playerIndex        = newPlayerIndex;
            if ((oldPlayerIndex !== newPlayerIndex) && (roomInfo.ownerPlayerIndex === oldPlayerIndex)) {
                roomInfo.ownerPlayerIndex = newPlayerIndex;
            }
        }
    }
    export async function updateOnMsgMfrGetOwnerPlayerIndex(data: ProtoTypes.NetMessage.MsgMfrGetOwnerPlayerIndex.IS): Promise<void> {
        const roomInfo = await getRoomInfo(Helpers.getExisted(data.roomId));
        if (roomInfo) {
            roomInfo.ownerPlayerIndex = data.ownerPlayerIndex;
        }
    }
    export async function updateOnMsgMfrJoinRoom(data: ProtoTypes.NetMessage.MsgMfrJoinRoom.IS): Promise<void> {
        const roomInfo          = Helpers.getExisted(await getRoomInfo(Helpers.getExisted(data.roomId)));
        const playerIndex       = data.playerIndex;
        const playerDataInWar   = Helpers.getExisted(roomInfo.settingsForMfw?.initialWarData?.playerManager?.players?.find(v => v.playerIndex === playerIndex));
        if (!roomInfo.playerDataList) {
            roomInfo.playerDataList = [{
                playerIndex         : playerIndex,
                userId              : data.userId,
                isReady             : data.isReady,
                coId                : playerDataInWar.coId,
                unitAndTileSkinId   : playerDataInWar.unitAndTileSkinId,
            }];
        } else {
            const playerDataArrayInRoom = roomInfo.playerDataList;
            Helpers.deleteElementFromArray(playerDataArrayInRoom, playerDataArrayInRoom.find(v => v.playerIndex === playerIndex));
            playerDataArrayInRoom.push({
                playerIndex         : playerIndex,
                userId              : data.userId,
                isReady             : data.isReady,
                coId                : playerDataInWar.coId,
                unitAndTileSkinId   : playerDataInWar.unitAndTileSkinId,
            });
        }
    }
    export async function updateOnMsgMfrExitRoom(data: ProtoTypes.NetMessage.MsgMfrExitRoom.IS): Promise<void> {
        const roomId    = Helpers.getExisted(data.roomId);
        const roomInfo  = await getRoomInfo(roomId);
        if (roomInfo) {
            const playerDataList    = Helpers.getExisted(roomInfo.playerDataList);
            const playerData        = playerDataList.find(v => v.playerIndex === data.playerIndex);
            Helpers.deleteElementFromArray(playerDataList, playerData);

            if ((playerData) && (playerData.userId === UserModel.getSelfUserId())) {
                _unjoinedRoomIdSet.add(roomId);
                _joinedRoomIdSet.delete(roomId);
            }
        }
    }
    export function updateOnMsgMfrDeleteRoomByServer(data: ProtoTypes.NetMessage.MsgMfrDeleteRoomByServer.IS): void {
        const roomId = Helpers.getExisted(data.roomId);
        setRoomInfo(roomId, null);
        _unjoinedRoomIdSet.delete(roomId);
        _joinedRoomIdSet.delete(roomId);
    }

    export async function checkIsRed(): Promise<boolean> {
        for (const roomId of _joinedRoomIdSet) {
            if (await checkIsRedForRoom(roomId)) {
                return true;
            }
        }
        return false;
    }
    export async function checkIsRedForRoom(roomId: number): Promise<boolean> {
        const roomInfo = await getRoomInfo(roomId);
        if (roomInfo) {
            const selfUserId        = UserModel.getSelfUserId();
            const playerDataList    = roomInfo.playerDataList || [];
            const selfPlayerData    = playerDataList.find(v => v.userId === selfUserId);
            if ((selfPlayerData) && (!selfPlayerData.isReady)) {
                return true;
            }

            if ((playerDataList.length === WarRuleHelpers.getPlayersCountUnneutral(Helpers.getExisted(roomInfo.settingsForMfw?.initialWarData?.settingsForCommon?.warRule)))    &&
                (playerDataList.every(v => v.isReady))                                                                                                                          &&
                (selfPlayerData)                                                                                                                                                &&
                (roomInfo.ownerPlayerIndex === selfPlayerData.playerIndex)
            ) {
                return true;
            }
        }
        return false;
    }
    export async function checkCanStartGame(roomId: number): Promise<boolean> {
        const roomInfo = await getRoomInfo(roomId);
        if (!roomInfo) {
            return false;
        }

        const selfUserId        = UserModel.getSelfUserId();
        const playerDataList    = roomInfo.playerDataList || [];
        const selfPlayerData    = playerDataList.find(v => v.userId === selfUserId);
        return (selfPlayerData != null)
            && (selfPlayerData.playerIndex === roomInfo.ownerPlayerIndex)
            && (playerDataList.length === WarRuleHelpers.getPlayersCountUnneutral(Helpers.getExisted(roomInfo.settingsForMfw?.initialWarData?.settingsForCommon?.warRule)))
            && (playerDataList.every(v => v.isReady));
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    export async function createDataForCommonWarPlayerInfoPage(roomId: number): Promise<OpenDataForCommonWarPlayerInfoPage> {
        const roomInfo = await getRoomInfo(roomId);
        if (roomInfo == null) {
            return null;
        }

        const settingsForCommon     = Helpers.getExisted(roomInfo.settingsForMfw?.initialWarData?.settingsForCommon);
        const warRule               = Helpers.getExisted(settingsForCommon.warRule);
        const playersCountUnneutral = WarRuleHelpers.getPlayersCountUnneutral(warRule);
        const playerDataList        = roomInfo.playerDataList || [];
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
            });
        }

        return {
            configVersion           : Helpers.getExisted(settingsForCommon.configVersion),
            playersCountUnneutral,
            roomOwnerPlayerIndex    : Helpers.getExisted(roomInfo.ownerPlayerIndex),
            callbackOnExitRoom      : () => MfrProxy.reqMfrExitRoom(roomId),
            callbackOnDeletePlayer  : (playerIndex) => MfrProxy.reqMfrDeletePlayer(roomId, playerIndex),
            playerInfoArray,
        };
    }

    export async function createDataForCommonWarBasicSettingsPage(roomId: number, showPassword: boolean): Promise<OpenDataForCommonWarBasicSettingsPage> {
        const roomInfo = await getRoomInfo(roomId);
        if (roomInfo == null) {
            return { dataArrayForListSettings: [] };
        }

        const settingsForMfw    = Helpers.getExisted(roomInfo.settingsForMfw);
        const warRule           = Helpers.getExisted(settingsForMfw.initialWarData?.settingsForCommon?.warRule);
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
        const roomInfo = await getRoomInfo(roomId);
        if (roomInfo == null) {
            return null;
        }

        const settingsForCommon = Helpers.getExisted(roomInfo.settingsForMfw?.initialWarData?.settingsForCommon);
        const warRule           = Helpers.getExisted(settingsForCommon.warRule);
        return {
            configVersion   : Helpers.getExisted(settingsForCommon.configVersion),
            warRule,
            warType         : warRule.ruleForGlobalParams?.hasFogByDefault ? Types.WarType.MfwFog : Types.WarType.MfwStd,
        };
    }
}

// export default MfrModel;
