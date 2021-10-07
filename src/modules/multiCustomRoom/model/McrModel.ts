
import TwnsCommonWarAdvancedSettingsPage    from "../../common/view/CommonWarAdvancedSettingsPage";
import TwnsCommonWarBasicSettingsPage       from "../../common/view/CommonWarBasicSettingsPage";
import TwnsCommonWarPlayerInfoPage          from "../../common/view/CommonWarPlayerInfoPage";
import McrProxy                             from "../../multiCustomRoom/model/McrProxy";
import CommonConstants                      from "../../tools/helpers/CommonConstants";
import CompatibilityHelpers                 from "../../tools/helpers/CompatibilityHelpers";
import Helpers                              from "../../tools/helpers/Helpers";
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

    const _roomInfoDict         = new Map<number, IMcrRoomInfo | null>();
    const _roomInfoRequests     = new Map<number, ((info: NetMessage.MsgMcrGetRoomInfo.IS) => void)[]>();

    const _unjoinedRoomIdSet    = new Set<number>();
    const _joinedRoomIdSet      = new Set<number>();

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for rooms.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    export function getRoomInfo(roomId: number): Promise<IMcrRoomInfo | null> {
        {
            const cachedInfo = _roomInfoDict.get(roomId);
            if (cachedInfo !== undefined) {
                return new Promise(resolve => resolve(cachedInfo));
            }
        }

        if (_roomInfoRequests.has(roomId)) {
            return new Promise((resolve) => {
                Helpers.getExisted(_roomInfoRequests.get(roomId)).push(info => resolve(info.roomInfo ?? null));
            });
        }

        new Promise<void>((resolve) => {
            const callbackOnSucceed = (e: egret.Event): void => {
                const data = e.data as NetMessage.MsgMcrGetRoomInfo.IS;
                if (data.roomId === roomId) {
                    Notify.removeEventListener(NotifyType.MsgMcrGetRoomInfo,         callbackOnSucceed);
                    Notify.removeEventListener(NotifyType.MsgMcrGetRoomInfoFailed,   callbackOnFailed);

                    for (const cb of Helpers.getExisted(_roomInfoRequests.get(roomId))) {
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

                    for (const cb of Helpers.getExisted(_roomInfoRequests.get(roomId))) {
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
            _roomInfoRequests.set(roomId, [info => resolve(info.roomInfo ?? null)]);
        });
    }
    function setRoomInfo(roomId: number, info: IMcrRoomInfo | null): void {
        _roomInfoDict.set(roomId, info);
    }

    export function setJoinableRoomInfoList(infoList: IMcrRoomInfo[]): void {
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

    export function setJoinedRoomInfoList(infoList: IMcrRoomInfo[]): void {
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

    export function updateOnMsgMcrGetRoomInfo(data: ProtoTypes.NetMessage.MsgMcrGetRoomInfo.IS): void {
        const roomInfo  = data.roomInfo;
        const roomId    = Helpers.getExisted(data.roomId);
        setRoomInfo(roomId, roomInfo ?? null);

        if (roomInfo == null) {
            _unjoinedRoomIdSet.delete(roomId);
            _joinedRoomIdSet.delete(roomId);
        }
    }
    export async function updateOnMsgMcrDeletePlayer(data: ProtoTypes.NetMessage.MsgMcrDeletePlayer.IS): Promise<void> {
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
    export async function updateOnMsgMcrSetReady(data: ProtoTypes.NetMessage.MsgMcrSetReady.IS): Promise<void> {
        const roomInfo = await getRoomInfo(Helpers.getExisted(data.roomId));
        if (roomInfo) {
            Helpers.getExisted(roomInfo.playerDataList?.find(v => v.playerIndex === data.playerIndex)).isReady = data.isReady;
        }
    }
    export async function updateOnMsgMcrSetSelfSettings(data: ProtoTypes.NetMessage.MsgMcrSetSelfSettings.IS): Promise<void> {
        const roomInfo = await getRoomInfo(Helpers.getExisted(data.roomId));
        if (roomInfo) {
            const oldPlayerIndex            = data.oldPlayerIndex;
            const newPlayerIndex            = data.newPlayerIndex;
            const playerData                = Helpers.getExisted(roomInfo.playerDataList?.find(v => v.playerIndex === oldPlayerIndex));
            playerData.coId                 = data.coId;
            playerData.unitAndTileSkinId    = data.unitAndTileSkinId;
            playerData.playerIndex          = newPlayerIndex;
            if ((oldPlayerIndex !== newPlayerIndex) && (roomInfo.ownerPlayerIndex === oldPlayerIndex)) {
                roomInfo.ownerPlayerIndex = newPlayerIndex;
            }
        }
    }
    export async function updateOnMsgMcrGetOwnerPlayerIndex(data: ProtoTypes.NetMessage.MsgMcrGetOwnerPlayerIndex.IS): Promise<void> {
        const roomInfo = await getRoomInfo(Helpers.getExisted(data.roomId));
        if (roomInfo) {
            roomInfo.ownerPlayerIndex = data.ownerPlayerIndex;
        }
    }
    export async function updateOnMsgMcrJoinRoom(data: ProtoTypes.NetMessage.MsgMcrJoinRoom.IS): Promise<void> {
        const roomInfo      = Helpers.getExisted(await getRoomInfo(Helpers.getExisted(data.roomId)));
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
    export function updateOnMsgMcrDeleteRoomByServer(data: ProtoTypes.NetMessage.MsgMcrDeleteRoomByServer.IS): void {
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

            if ((playerDataList.length === WarRuleHelpers.getPlayersCountUnneutral(Helpers.getExisted(roomInfo.settingsForCommon?.warRule)))    &&
                (playerDataList.every(v => (v.isReady) && (v.userId != null)))                                                                  &&
                (selfPlayerData)                                                                                                                &&
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
            && (playerDataList.length == WarRuleHelpers.getPlayersCountUnneutral(Helpers.getExisted(roomInfo.settingsForCommon?.warRule)))
            && (playerDataList.every(v => (v.isReady) && (v.userId != null)));
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    export async function createDataForCommonWarPlayerInfoPage(roomId: number | null): Promise<OpenDataForCommonWarPlayerInfoPage> {
        if (roomId == null) {
            return null;
        }

        const roomInfo = await getRoomInfo(roomId);
        if (roomInfo == null) {
            return null;
        }

        const settingsForCommon     = Helpers.getExisted(roomInfo.settingsForCommon);
        const warRule               = Helpers.getExisted(settingsForCommon.warRule);
        const playersCountUnneutral = Helpers.getExisted(WarRuleHelpers.getPlayersCountUnneutral(warRule));
        const playerDataList        = roomInfo.playerDataList || [];
        const playerInfoArray       : TwnsCommonWarPlayerInfoPage.PlayerInfo[] = [];
        for (let playerIndex = CommonConstants.WarFirstPlayerIndex; playerIndex <= playersCountUnneutral; ++playerIndex) {
            const playerData = playerDataList.find(v => v.playerIndex === playerIndex);
            playerInfoArray.push({
                playerIndex,
                teamIndex           : WarRuleHelpers.getTeamIndex(warRule, playerIndex),
                isAi                : false,
                userId              : playerData?.userId ?? null,
                coId                : playerData?.coId ?? null,
                unitAndTileSkinId   : playerData?.unitAndTileSkinId ?? null,
                isReady             : playerData?.isReady ?? null,
                isInTurn            : null,
                isDefeat            : null,
            });
        }

        return {
            configVersion           : Helpers.getExisted(settingsForCommon.configVersion),
            playersCountUnneutral,
            roomOwnerPlayerIndex    : Helpers.getExisted(roomInfo.ownerPlayerIndex),
            callbackOnExitRoom      : () => McrProxy.reqMcrExitRoom(roomId),
            callbackOnDeletePlayer  : (playerIndex) => McrProxy.reqMcrDeletePlayer(roomId, playerIndex),
            playerInfoArray,
        };
    }

    export async function createDataForCommonWarBasicSettingsPage(roomId: number | null, showPassword: boolean): Promise<OpenDataForCommonWarBasicSettingsPage> {
        if (roomId == null) {
            return null;
        }

        const roomInfo = await getRoomInfo(roomId);
        if (roomInfo == null) {
            return { dataArrayForListSettings: [] };
        }

        const warRule           = Helpers.getExisted(roomInfo.settingsForCommon?.warRule);
        const settingsForMcw    = Helpers.getExisted(roomInfo.settingsForMcw);
        const bootTimerParams   = Helpers.getExisted(settingsForMcw.bootTimerParams);
        const warPassword       = settingsForMcw.warPassword;
        const timerType         = bootTimerParams[0] as Types.BootTimerType;
        const openData          : OpenDataForCommonWarBasicSettingsPage = {
            dataArrayForListSettings    : [
                {
                    settingsType    : WarBasicSettingsType.MapName,
                    currentValue    : await WarMapModel.getMapNameInCurrentLanguage(Helpers.getExisted(settingsForMcw.mapId)),
                    warRule,
                    callbackOnModify: null,
                },
                {
                    settingsType    : WarBasicSettingsType.WarName,
                    currentValue    : settingsForMcw.warName ?? null,
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
                    currentValue    : settingsForMcw.warComment ?? null,
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

    export async function createDataForCommonWarAdvancedSettingsPage(roomId: number | null): Promise<OpenDataForCommonWarAdvancedSettingsPage> {
        if (roomId == null) {
            return null;
        }

        const roomInfo = await getRoomInfo(roomId);
        if (roomInfo == null) {
            return null;
        }

        const settingsForCommon = Helpers.getExisted(roomInfo.settingsForCommon);
        const warRule           = Helpers.getExisted(settingsForCommon.warRule);
        return {
            configVersion   : Helpers.getExisted(settingsForCommon.configVersion),
            warRule,
            warType         : warRule.ruleForGlobalParams?.hasFogByDefault ? Types.WarType.McwFog : Types.WarType.McwStd,
        };
    }
}

export default McrModel;
