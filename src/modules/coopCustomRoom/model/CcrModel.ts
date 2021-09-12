
import TwnsCommonWarAdvancedSettingsPage    from "../../common/view/CommonWarAdvancedSettingsPage";
import TwnsCommonWarBasicSettingsPage       from "../../common/view/CommonWarBasicSettingsPage";
import TwnsCommonWarPlayerInfoPage          from "../../common/view/CommonWarPlayerInfoPage";
import CcrProxy                             from "../../coopCustomRoom/model/CcrProxy";
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

namespace CcrModel {
    import NotifyType                               = TwnsNotifyType.NotifyType;
    import WarBasicSettingsType                     = Types.WarBasicSettingsType;
    import NetMessage                               = ProtoTypes.NetMessage;
    import ICcrRoomInfo                             = ProtoTypes.CoopCustomRoom.ICcrRoomInfo;
    import OpenDataForCommonWarBasicSettingsPage    = TwnsCommonWarBasicSettingsPage.OpenDataForCommonWarBasicSettingsPage;
    import OpenDataForCommonWarAdvancedSettingsPage = TwnsCommonWarAdvancedSettingsPage.OpenDataForCommonWarAdvancedSettingsPage;
    import OpenDataForCommonWarPlayerInfoPage       = TwnsCommonWarPlayerInfoPage.OpenDataForCommonWarPlayerInfoPage;

    export type DataForCreateRoom   = ProtoTypes.NetMessage.MsgCcrCreateRoom.IC;
    export type DataForJoinRoom     = ProtoTypes.NetMessage.MsgCcrJoinRoom.IC;

    const _roomInfoDict         = new Map<number, ICcrRoomInfo | null>();
    const _roomInfoRequests     = new Map<number, ((info: NetMessage.MsgCcrGetRoomInfo.IS) => void)[]>();

    const _unjoinedRoomIdSet    = new Set<number>();
    const _joinedRoomIdSet      = new Set<number>();

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for rooms.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    export function getRoomInfo(roomId: number): Promise<ICcrRoomInfo | null> {
        if (roomId == null) {
            return new Promise((resolve) => resolve(null));
        }
        if (_roomInfoDict.has(roomId)) {
            return new Promise(resolve => resolve(Helpers.getDefined(_roomInfoDict.get(roomId))));
        }

        if (_roomInfoRequests.has(roomId)) {
            return new Promise((resolve) => {
                Helpers.getExisted(_roomInfoRequests.get(roomId)).push(info => resolve(info.roomInfo || null));
            });
        }

        new Promise<void>((resolve) => {
            const callbackOnSucceed = (e: egret.Event): void => {
                const data = e.data as NetMessage.MsgCcrGetRoomInfo.IS;
                if (data.roomId === roomId) {
                    Notify.removeEventListener(NotifyType.MsgCcrGetRoomInfo,         callbackOnSucceed);
                    Notify.removeEventListener(NotifyType.MsgCcrGetRoomInfoFailed,   callbackOnFailed);

                    for (const cb of Helpers.getExisted(_roomInfoRequests.get(roomId))) {
                        cb(data);
                    }
                    _roomInfoRequests.delete(roomId);

                    resolve();
                }
            };
            const callbackOnFailed = (e: egret.Event): void => {
                const data = e.data as NetMessage.MsgCcrGetRoomInfo.IS;
                if (data.roomId === roomId) {
                    Notify.removeEventListener(NotifyType.MsgCcrGetRoomInfo,         callbackOnSucceed);
                    Notify.removeEventListener(NotifyType.MsgCcrGetRoomInfoFailed,   callbackOnFailed);

                    for (const cb of Helpers.getExisted(_roomInfoRequests.get(roomId))) {
                        cb(data);
                    }
                    _roomInfoRequests.delete(roomId);

                    resolve();
                }
            };

            Notify.addEventListener(NotifyType.MsgCcrGetRoomInfo,        callbackOnSucceed);
            Notify.addEventListener(NotifyType.MsgCcrGetRoomInfoFailed,  callbackOnFailed);

            CcrProxy.reqCcrGetRoomInfo(roomId);
        });

        return new Promise((resolve) => {
            _roomInfoRequests.set(roomId, [info => resolve(info.roomInfo || null)]);
        });
    }
    function setRoomInfo(roomId: number, info: ICcrRoomInfo | null): void {
        _roomInfoDict.set(roomId, info);
    }

    export function setJoinableRoomInfoList(infoList: ICcrRoomInfo[]): void {
        _unjoinedRoomIdSet.clear();
        for (const roomInfo of infoList) {
            const roomId = Helpers.getExisted(roomInfo.roomId);
            _unjoinedRoomIdSet.add(roomId);
            setRoomInfo(roomId, roomInfo);
        }
    }
    export function getUnjoinedRoomIdSet(): Set<number> {
        return _unjoinedRoomIdSet;
    }

    export function setJoinedRoomInfoList(infoList: ICcrRoomInfo[]): void {
        _joinedRoomIdSet.clear();
        for (const roomInfo of infoList) {
            const roomId = Helpers.getExisted(roomInfo.roomId);
            _joinedRoomIdSet.add(roomId);
            setRoomInfo(roomId, roomInfo);
        }
    }
    export function getJoinedRoomIdSet(): Set<number> {
        return _joinedRoomIdSet;
    }

    export function updateOnMsgCcrGetRoomInfo(data: ProtoTypes.NetMessage.MsgCcrGetRoomInfo.IS): void {
        const roomInfo  = data.roomInfo || null;
        const roomId    = Helpers.getExisted(data.roomId);
        setRoomInfo(roomId, roomInfo);

        if (roomInfo == null) {
            _unjoinedRoomIdSet.delete(roomId);
            _joinedRoomIdSet.delete(roomId);
        }
    }
    export async function updateOnMsgCcrDeletePlayer(data: ProtoTypes.NetMessage.MsgCcrDeletePlayer.IS): Promise<void> {
        const roomId    = Helpers.getExisted(data.roomId);
        const roomInfo  = await getRoomInfo(roomId).catch(err => { CompatibilityHelpers.showError(err); throw err; });
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
    export async function updateOnMsgCcrSetReady(data: ProtoTypes.NetMessage.MsgCcrSetReady.IS): Promise<void> {
        const roomInfo = await getRoomInfo(Helpers.getExisted(data.roomId)).catch(err => { CompatibilityHelpers.showError(err); throw err; });
        if (roomInfo) {
            Helpers.getExisted(roomInfo.playerDataList?.find(v => v.playerIndex === data.playerIndex)).isReady = data.isReady;
        }
    }
    export async function updateOnMsgCcrSetSelfSettings(data: ProtoTypes.NetMessage.MsgCcrSetSelfSettings.IS): Promise<void> {
        const roomInfo = await getRoomInfo(Helpers.getExisted(data.roomId)).catch(err => { CompatibilityHelpers.showError(err); throw err; });
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
    export async function updateOnMsgCcrGetOwnerPlayerIndex(data: ProtoTypes.NetMessage.MsgCcrGetOwnerPlayerIndex.IS): Promise<void> {
        const roomInfo = await getRoomInfo(Helpers.getExisted(data.roomId)).catch(err => { CompatibilityHelpers.showError(err); throw err; });
        if (roomInfo) {
            roomInfo.ownerPlayerIndex = data.ownerPlayerIndex;
        }
    }
    export async function updateOnMsgCcrJoinRoom(data: ProtoTypes.NetMessage.MsgCcrJoinRoom.IS): Promise<void> {
        const roomInfo      = Helpers.getExisted(await getRoomInfo(Helpers.getExisted(data.roomId)).catch(err => { CompatibilityHelpers.showError(err); throw err; }));
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
    export async function updateOnMsgCcrExitRoom(data: ProtoTypes.NetMessage.MsgCcrExitRoom.IS): Promise<void> {
        const roomId    = Helpers.getExisted(data.roomId);
        const roomInfo  = await getRoomInfo(roomId).catch(err => { CompatibilityHelpers.showError(err); throw err; });
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
    export function updateOnMsgCcrDeleteRoomByServer(data: ProtoTypes.NetMessage.MsgCcrDeleteRoomByServer.IS): void {
        const roomId = Helpers.getExisted(data.roomId);
        setRoomInfo(roomId, null);
        _unjoinedRoomIdSet.delete(roomId);
        _joinedRoomIdSet.delete(roomId);
    }

    export async function checkIsRed(): Promise<boolean> {
        for (const roomId of _joinedRoomIdSet) {
            if (await checkIsRedForRoom(roomId).catch(err => { CompatibilityHelpers.showError(err); throw err; })) {
                return true;
            }
        }
        return false;
    }
    export async function checkIsRedForRoom(roomId: number): Promise<boolean> {
        const roomInfo = await getRoomInfo(roomId).catch(err => { CompatibilityHelpers.showError(err); throw err; });
        if (roomInfo) {
            const selfUserId        = UserModel.getSelfUserId();
            const playerDataList    = roomInfo.playerDataList || [];
            const selfPlayerData    = playerDataList.find(v => v.userId === selfUserId);
            if ((selfPlayerData) && (!selfPlayerData.isReady)) {
                return true;
            }

            if ((playerDataList.length === WarRuleHelpers.getPlayersCountUnneutral(Helpers.getExisted(roomInfo.settingsForCommon?.warRule)))    &&
                (playerDataList.every(v => v.isReady))                                                                                          &&
                (selfPlayerData)                                                                                                                &&
                (roomInfo.ownerPlayerIndex === selfPlayerData.playerIndex)
            ) {
                return true;
            }
        }
        return false;
    }
    export async function checkCanStartGame(roomId: number): Promise<boolean> {
        const roomInfo = await getRoomInfo(roomId).catch(err => { CompatibilityHelpers.showError(err); throw err; });
        if (!roomInfo) {
            return false;
        }

        const selfUserId        = UserModel.getSelfUserId();
        const playerDataList    = roomInfo.playerDataList || [];
        const selfPlayerData    = playerDataList.find(v => v.userId === selfUserId);
        return (selfPlayerData != null)
            && (selfPlayerData.playerIndex === roomInfo.ownerPlayerIndex)
            && (playerDataList.length == WarRuleHelpers.getPlayersCountUnneutral(Helpers.getExisted(roomInfo.settingsForCommon?.warRule)))
            && (playerDataList.every(v => v.isReady));
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    export async function createDataForCommonWarPlayerInfoPage(roomId: number): Promise<OpenDataForCommonWarPlayerInfoPage> {
        const roomInfo = await getRoomInfo(roomId).catch(err => { CompatibilityHelpers.showError(err); throw err; });
        if (roomInfo == null) {
            return null;
        }

        const settingsForCommon     = Helpers.getExisted(roomInfo.settingsForCommon);
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
            callbackOnExitRoom      : () => CcrProxy.reqCcrExitRoom(roomId),
            callbackOnDeletePlayer  : (playerIndex) => CcrProxy.reqCcrDeletePlayer(roomId, playerIndex),
            playerInfoArray,
        };
    }

    export async function createDataForCommonWarBasicSettingsPage(roomId: number, showPassword: boolean): Promise<OpenDataForCommonWarBasicSettingsPage> {
        const roomInfo = await getRoomInfo(roomId).catch(err => { CompatibilityHelpers.showError(err); throw err; });
        if (roomInfo == null) {
            return { dataArrayForListSettings: [] };
        }

        const warRule           = Helpers.getExisted(roomInfo.settingsForCommon?.warRule);
        const settingsForCcw    = Helpers.getExisted(roomInfo.settingsForCcw);
        const bootTimerParams   = Helpers.getExisted(settingsForCcw.bootTimerParams);
        const warPassword       = settingsForCcw.warPassword;
        const timerType         = bootTimerParams[0] as Types.BootTimerType;
        const openData          : OpenDataForCommonWarBasicSettingsPage = {
            dataArrayForListSettings    : [
                {
                    settingsType    : WarBasicSettingsType.MapName,
                    currentValue    : await WarMapModel.getMapNameInCurrentLanguage(Helpers.getExisted(settingsForCcw.mapId)).catch(err => { CompatibilityHelpers.showError(err); throw err; }),
                    warRule,
                    callbackOnModify: null,
                },
                {
                    settingsType    : WarBasicSettingsType.WarName,
                    currentValue    : settingsForCcw.warName ?? null,
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
                    currentValue    : settingsForCcw.warComment ?? null,
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
            throw Helpers.newError(`CcrModel.createDataForCommonWarBasicSettingsPage() invalid timerType.`);
        }

        return openData;
    }

    export async function createDataForCommonWarAdvancedSettingsPage(roomId: number): Promise<OpenDataForCommonWarAdvancedSettingsPage> {
        const roomInfo = await getRoomInfo(roomId).catch(err => { CompatibilityHelpers.showError(err); throw err; });
        if (roomInfo == null) {
            return null;
        }

        const settingsForCommon = Helpers.getExisted(roomInfo.settingsForCommon);
        const warRule           = Helpers.getExisted(settingsForCommon.warRule);
        return {
            configVersion   : Helpers.getExisted(settingsForCommon.configVersion),
            warRule,
            warType         : warRule.ruleForGlobalParams?.hasFogByDefault ? Types.WarType.CcwFog : Types.WarType.CcwStd,
        };
    }
}

export default CcrModel;
