
import TwnsCommonWarAdvancedSettingsPage    from "../../common/view/CommonWarAdvancedSettingsPage";
import TwnsCommonWarBasicSettingsPage       from "../../common/view/CommonWarBasicSettingsPage";
import TwnsCommonWarPlayerInfoPage          from "../../common/view/CommonWarPlayerInfoPage";
import McrProxy                             from "../../multiCustomRoom/model/McrProxy";
import Helpers                              from "../../tools/helpers/Helpers";
import Logger                               from "../../tools/helpers/Logger";
import Types                                from "../../tools/helpers/Types";
import Notify                               from "../../tools/notify/Notify";
import TwnsNotifyType                       from "../../tools/notify/NotifyType";
import ProtoTypes                           from "../../tools/proto/ProtoTypes";
import WarRuleHelpers                       from "../../tools/warHelpers/WarRuleHelpers";
import UserModel                            from "../../user/model/UserModel";
import WarMapModel                          from "../../warMap/model/WarMapModel";

namespace McrModel {
    import NotifyType                               = TwnsNotifyType.NotifyType;
    import NetMessage                               = ProtoTypes.NetMessage;
    import IMcrRoomInfo                             = ProtoTypes.MultiCustomRoom.IMcrRoomInfo;
    import WarBasicSettingsType                     = Types.WarBasicSettingsType;
    import OpenDataForCommonWarBasicSettingsPage    = TwnsCommonWarBasicSettingsPage.OpenDataForCommonWarBasicSettingsPage;
    import OpenDataForCommonWarAdvancedSettingsPage = TwnsCommonWarAdvancedSettingsPage.OpenDataForCommonWarAdvancedSettingsPage;
    import OpenDataForCommonWarPlayerInfoPage       = TwnsCommonWarPlayerInfoPage.OpenDataForCommonWarPlayerInfoPage;

    export type DataForCreateRoom   = ProtoTypes.NetMessage.MsgMcrCreateRoom.IC;
    export type DataForJoinRoom     = ProtoTypes.NetMessage.MsgMcrJoinRoom.IC;

    const _roomInfoDict         = new Map<number, IMcrRoomInfo | undefined>();
    const _roomInfoRequests     = new Map<number, ((info: NetMessage.MsgMcrGetRoomInfo.IS | undefined | null) => void)[]>();

    const _unjoinedRoomIdSet    = new Set<number>();
    const _joinedRoomIdSet      = new Set<number>();

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for rooms.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    export function getRoomInfo(roomId: number): Promise<IMcrRoomInfo | undefined | null> {
        if (roomId == null) {
            return new Promise((resolve) => resolve(null));
        }
        if (_roomInfoDict.has(roomId)) {
            return new Promise(resolve => resolve(_roomInfoDict.get(roomId)));
        }

        if (_roomInfoRequests.has(roomId)) {
            return new Promise((resolve) => {
                _roomInfoRequests.get(roomId).push(info => resolve(info.roomInfo));
            });
        }

        new Promise<void>((resolve) => {
            const callbackOnSucceed = (e: egret.Event): void => {
                const data = e.data as NetMessage.MsgMcrGetRoomInfo.IS;
                if (data.roomId === roomId) {
                    Notify.removeEventListener(NotifyType.MsgMcrGetRoomInfo,         callbackOnSucceed);
                    Notify.removeEventListener(NotifyType.MsgMcrGetRoomInfoFailed,   callbackOnFailed);

                    for (const cb of _roomInfoRequests.get(roomId)) {
                        cb(data);
                    }
                    _roomInfoRequests.delete(roomId);

                    resolve();
                }
            };
            const callbackOnFailed = (e: egret.Event): void => {
                const data = e.data as NetMessage.MsgMcrGetRoomInfo.IS;
                if (data.roomId === roomId) {
                    Notify.removeEventListener(NotifyType.MsgMcrGetRoomInfo,         callbackOnSucceed);
                    Notify.removeEventListener(NotifyType.MsgMcrGetRoomInfoFailed,   callbackOnFailed);

                    for (const cb of _roomInfoRequests.get(roomId)) {
                        cb(data);
                    }
                    _roomInfoRequests.delete(roomId);

                    resolve();
                }
            };

            Notify.addEventListener(NotifyType.MsgMcrGetRoomInfo,        callbackOnSucceed);
            Notify.addEventListener(NotifyType.MsgMcrGetRoomInfoFailed,  callbackOnFailed);

            McrProxy.reqMcrGetRoomInfo(roomId);
        });

        return new Promise((resolve) => {
            _roomInfoRequests.set(roomId, [info => resolve(info.roomInfo)]);
        });
    }
    function setRoomInfo(roomId: number, info: IMcrRoomInfo | undefined): void {
        _roomInfoDict.set(roomId, info);
    }

    export function setJoinableRoomInfoList(infoList: IMcrRoomInfo[]): void {
        _unjoinedRoomIdSet.clear();
        for (const roomInfo of infoList || []) {
            const roomId = roomInfo.roomId;
            _unjoinedRoomIdSet.add(roomId);
            setRoomInfo(roomId, roomInfo);
        }
    }
    export function getUnjoinedRoomIdSet(): Set<number> {
        return _unjoinedRoomIdSet;
    }

    export function setJoinedRoomInfoList(infoList: IMcrRoomInfo[]): void {
        _joinedRoomIdSet.clear();
        for (const roomInfo of infoList || []) {
            const roomId = roomInfo.roomId;
            _joinedRoomIdSet.add(roomId);
            setRoomInfo(roomId, roomInfo);
        }
    }
    export function getJoinedRoomIdSet(): Set<number> {
        return _joinedRoomIdSet;
    }

    export function updateOnMsgMcrGetRoomInfo(data: ProtoTypes.NetMessage.MsgMcrGetRoomInfo.IS): void {
        const roomInfo  = data.roomInfo;
        const roomId    = data.roomId;
        setRoomInfo(roomId, roomInfo);

        if (roomInfo == null) {
            _unjoinedRoomIdSet.delete(roomId);
            _joinedRoomIdSet.delete(roomId);
        }
    }
    export async function updateOnMsgMcrDeletePlayer(data: ProtoTypes.NetMessage.MsgMcrDeletePlayer.IS): Promise<void> {
        const roomId    = data.roomId;
        const roomInfo  = await getRoomInfo(roomId);
        if (roomInfo) {
            const playerDataList    = roomInfo.playerDataList;
            const playerData        = playerDataList.find(v => v.playerIndex === data.targetPlayerIndex);
            Helpers.deleteElementFromArray(playerDataList, playerData);

            if ((playerData) && (playerData.userId === UserModel.getSelfUserId())) {
                _unjoinedRoomIdSet.add(roomId);
                _joinedRoomIdSet.delete(roomId);
            }
        }
    }
    export async function updateOnMsgMcrSetReady(data: ProtoTypes.NetMessage.MsgMcrSetReady.IS): Promise<void> {
        const roomInfo      = await getRoomInfo(data.roomId);
        const playerData    = roomInfo ? roomInfo.playerDataList.find(v => v.playerIndex === data.playerIndex) : null;
        if (playerData) {
            playerData.isReady = data.isReady;
        }
    }
    export async function updateOnMsgMcrSetSelfSettings(data: ProtoTypes.NetMessage.MsgMcrSetSelfSettings.IS): Promise<void> {
        const roomInfo = await getRoomInfo(data.roomId);
        if (roomInfo) {
            const oldPlayerIndex            = data.oldPlayerIndex;
            const newPlayerIndex            = data.newPlayerIndex;
            const playerData                = roomInfo.playerDataList.find(v => v.playerIndex === oldPlayerIndex);
            playerData.coId                 = data.coId;
            playerData.unitAndTileSkinId    = data.unitAndTileSkinId;
            playerData.playerIndex          = newPlayerIndex;
            if ((oldPlayerIndex !== newPlayerIndex) && (roomInfo.ownerPlayerIndex === oldPlayerIndex)) {
                roomInfo.ownerPlayerIndex = newPlayerIndex;
            }
        }
    }
    export async function updateOnMsgMcrGetOwnerPlayerIndex(data: ProtoTypes.NetMessage.MsgMcrGetOwnerPlayerIndex.IS): Promise<void> {
        const roomInfo = await getRoomInfo(data.roomId);
        if (roomInfo) {
            roomInfo.ownerPlayerIndex = data.ownerPlayerIndex;
        }
    }
    export async function updateOnMsgMcrJoinRoom(data: ProtoTypes.NetMessage.MsgMcrJoinRoom.IS): Promise<void> {
        const roomInfo      = await getRoomInfo(data.roomId);
        const playerIndex   = data.playerIndex;
        if (!roomInfo.playerDataList) {
            roomInfo.playerDataList = [{
                playerIndex         : playerIndex,
                userId              : data.userId,
                isReady             : data.isReady,
                coId                : data.coId,
                unitAndTileSkinId   : data.unitAndTileSkinId,
            }];
        } else {
            const playerDataList = roomInfo.playerDataList;
            Helpers.deleteElementFromArray(playerDataList, playerDataList.find(v => v.playerIndex === playerIndex));
            playerDataList.push({
                playerIndex         : playerIndex,
                userId              : data.userId,
                isReady             : data.isReady,
                coId                : data.coId,
                unitAndTileSkinId   : data.unitAndTileSkinId,
            });
        }
    }
    export async function updateOnMsgMcrExitRoom(data: ProtoTypes.NetMessage.MsgMcrExitRoom.IS): Promise<void> {
        const roomId    = data.roomId;
        const roomInfo  = await getRoomInfo(roomId);
        if (roomInfo) {
            const playerDataList    = roomInfo.playerDataList;
            const playerData        = playerDataList.find(v => v.playerIndex === data.playerIndex);
            Helpers.deleteElementFromArray(playerDataList, playerData);

            if ((playerData) && (playerData.userId === UserModel.getSelfUserId())) {
                _unjoinedRoomIdSet.add(roomId);
                _joinedRoomIdSet.delete(roomId);
            }
        }
    }
    export function updateOnMsgMcrDeleteRoomByServer(data: ProtoTypes.NetMessage.MsgMcrDeleteRoomByServer.IS): void {
        const roomId = data.roomId;
        setRoomInfo(roomId, undefined);
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

            if ((playerDataList.length === WarRuleHelpers.getPlayersCount(roomInfo.settingsForCommon.warRule))    &&
                (playerDataList.every(v => (v.isReady) && (v.userId != null)))                                      &&
                (selfPlayerData)                                                                                    &&
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
            && (playerDataList.length == WarRuleHelpers.getPlayersCount(roomInfo.settingsForCommon.warRule))
            && (playerDataList.every(v => (v.isReady) && (v.userId != null)));
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    export async function createDataForCommonWarPlayerInfoPage(roomId: number): Promise<OpenDataForCommonWarPlayerInfoPage | undefined> {
        const roomInfo = await getRoomInfo(roomId);
        if (roomInfo == null) {
            return undefined;
        }

        const settingsForCommon = roomInfo.settingsForCommon;
        const warRule           = settingsForCommon.warRule;
        const playerInfoArray   : TwnsCommonWarPlayerInfoPage.PlayerInfo[] = [];
        for (const playerInfo of (roomInfo.playerDataList || [])) {
            const playerIndex = playerInfo.playerIndex;
            playerInfoArray.push({
                playerIndex,
                teamIndex           : WarRuleHelpers.getTeamIndex(warRule, playerIndex),
                userId              : playerInfo.userId,
                coId                : playerInfo.coId,
                unitAndTileSkinId   : playerInfo.unitAndTileSkinId,
                isReady             : playerInfo.isReady,
                isInTurn            : undefined,
                isDefeat            : undefined,
            });
        }

        return {
            configVersion           : settingsForCommon.configVersion,
            playersCountUnneutral   : WarRuleHelpers.getPlayersCount(warRule),
            roomOwnerPlayerIndex    : roomInfo.ownerPlayerIndex,
            callbackOnExitRoom      : () => McrProxy.reqMcrExitRoom(roomId),
            callbackOnDeletePlayer  : (playerIndex) => McrProxy.reqMcrDeletePlayer(roomId, playerIndex),
            playerInfoArray,
        };
    }

    export async function createDataForCommonWarBasicSettingsPage(roomId: number, showPassword: boolean): Promise<OpenDataForCommonWarBasicSettingsPage> {
        const roomInfo = await getRoomInfo(roomId);
        if (roomInfo == null) {
            return { dataArrayForListSettings: [] };
        }

        const warRule           = roomInfo.settingsForCommon.warRule;
        const settingsForMcw    = roomInfo.settingsForMcw;
        const bootTimerParams   = settingsForMcw.bootTimerParams;
        const warPassword       = settingsForMcw.warPassword;
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
                    currentValue    : warPassword == null ? undefined : (showPassword ? warPassword : `****`),
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
            Logger.error(`McrModel.createDataForCommonWarBasicSettingsPage() invalid timerType.`);
        }

        return openData;
    }

    export async function createDataForCommonWarAdvancedSettingsPage(roomId: number): Promise<OpenDataForCommonWarAdvancedSettingsPage | undefined> {
        const roomInfo = await getRoomInfo(roomId);
        if (roomInfo == null) {
            return undefined;
        }

        const settingsForCommon = roomInfo.settingsForCommon;
        const warRule           = settingsForCommon.warRule;
        return {
            configVersion   : settingsForCommon.configVersion,
            warRule,
            warType         : warRule.ruleForGlobalParams.hasFogByDefault ? Types.WarType.McwFog : Types.WarType.McwStd,
        };
    }
}

export default McrModel;
