
import TwnsCommonWarAdvancedSettingsPage    from "../../common/view/CommonWarAdvancedSettingsPage";
import TwnsCommonWarBasicSettingsPage       from "../../common/view/CommonWarBasicSettingsPage";
import TwnsCommonWarPlayerInfoPage          from "../../common/view/CommonWarPlayerInfoPage";
import CommonConstants                      from "../../tools/helpers/CommonConstants";
import CompatibilityHelpers                 from "../../tools/helpers/CompatibilityHelpers";
import Helpers                              from "../../tools/helpers/Helpers";
import Logger                               from "../../tools/helpers/Logger";
import Types                                from "../../tools/helpers/Types";
import Notify                               from "../../tools/notify/Notify";
import TwnsNotifyType                       from "../../tools/notify/NotifyType";
import ProtoTypes                           from "../../tools/proto/ProtoTypes";
import WarRuleHelpers                       from "../../tools/warHelpers/WarRuleHelpers";
import UserModel                            from "../../user/model/UserModel";
import WarMapModel                          from "../../warMap/model/WarMapModel";
import MrrProxy                             from "./MrrProxy";
import MrrSelfSettingsModel                 from "./MrrSelfSettingsModel";

namespace MrrModel {
    import NotifyType                               = TwnsNotifyType.NotifyType;
    import WarBasicSettingsType                     = Types.WarBasicSettingsType;
    import NetMessage                               = ProtoTypes.NetMessage;
    import IMrrRoomInfo                             = ProtoTypes.MultiRankRoom.IMrrRoomInfo;
    import OpenDataForCommonWarBasicSettingsPage    = TwnsCommonWarBasicSettingsPage.OpenDataForCommonWarBasicSettingsPage;
    import OpenDataForCommonWarAdvancedSettingsPage = TwnsCommonWarAdvancedSettingsPage.OpenDataForCommonWarAdvancedSettingsPage;
    import OpenDataForCommonWarPlayerInfoPage       = TwnsCommonWarPlayerInfoPage.OpenDataForCommonWarPlayerInfoPage;

    let _previewingRoomId           : number | null = null;
    let _maxConcurrentCountForStd   = 0;
    let _maxConcurrentCountForFog   = 0;
    const _roomInfoDict             = new Map<number, IMrrRoomInfo | null>();
    const _roomInfoRequests         = new Map<number, ((info: NetMessage.MsgMrrGetRoomPublicInfo.IS) => void)[]>();

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
        _roomInfoDict.set(roomId, roomInfo);
    }
    export function getRoomInfo(roomId: number): Promise<IMrrRoomInfo | null> {
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
                const data = e.data as NetMessage.MsgMrrGetRoomPublicInfo.IS;
                if (data.roomId === roomId) {
                    Notify.removeEventListener(NotifyType.MsgMrrGetRoomPublicInfo,         callbackOnSucceed);
                    Notify.removeEventListener(NotifyType.MsgMrrGetRoomPublicInfoFailed,   callbackOnFailed);

                    for (const cb of Helpers.getExisted(_roomInfoRequests.get(roomId))) {
                        cb(data);
                    }
                    _roomInfoRequests.delete(roomId);

                    resolve();
                }
            };
            const callbackOnFailed = (e: egret.Event): void => {
                const data = e.data as NetMessage.MsgMrrGetRoomPublicInfo.IS;
                if (data.roomId === roomId) {
                    Notify.removeEventListener(NotifyType.MsgMrrGetRoomPublicInfo,         callbackOnSucceed);
                    Notify.removeEventListener(NotifyType.MsgMrrGetRoomPublicInfoFailed,   callbackOnFailed);

                    for (const cb of Helpers.getExisted(_roomInfoRequests.get(roomId))) {
                        cb(data);
                    }
                    _roomInfoRequests.delete(roomId);

                    resolve();
                }
            };

            Notify.addEventListener(NotifyType.MsgMrrGetRoomPublicInfo,        callbackOnSucceed);
            Notify.addEventListener(NotifyType.MsgMrrGetRoomPublicInfoFailed,  callbackOnFailed);

            MrrProxy.reqMrrGetRoomPublicInfo(roomId);
        });

        return new Promise((resolve) => {
            _roomInfoRequests.set(roomId, [info => resolve(info.roomInfo ?? null)]);
        });
    }

    export function updateWithMyRoomInfoList(roomList: IMrrRoomInfo[]): void {
        for (const roomInfo of roomList || []) {
            setRoomInfo(Helpers.getExisted(roomInfo.roomId), roomInfo);
        }
    }
    export function getMyRoomIdArray(): number[] {
        const idArray: number[] = [];
        for (const [roomId, roomInfo] of _roomInfoDict) {
            if (checkIsMyRoom(roomInfo)) {
                idArray.push(roomId);
            }
        }
        return idArray;
    }

    export async function updateOnMsgMrrGetRoomPublicInfo(data: ProtoTypes.NetMessage.MsgMrrGetRoomPublicInfo.IS): Promise<void> {
        const roomInfo  = Helpers.getExisted(data.roomInfo);
        const roomId    = Helpers.getExisted(roomInfo.roomId);
        setRoomInfo(roomId, roomInfo);

        if (MrrSelfSettingsModel.getRoomId() === roomId) {
            await MrrSelfSettingsModel.resetData(roomId).catch(err => { CompatibilityHelpers.showError(err); throw err; });
        }
    }
    export async function updateOnMsgMrrSetBannedCoIdList(data: ProtoTypes.NetMessage.MsgMrrSetBannedCoIdList.IS): Promise<void> {
        const roomId    = Helpers.getExisted(data.roomId);
        const roomInfo  = await getRoomInfo(roomId).catch(err => { CompatibilityHelpers.showError(err); throw err; });
        if (!roomInfo) {
            return;
        }

        const settingsForMrw    = Helpers.getExisted(roomInfo.settingsForMrw);
        const srcPlayerIndex    = data.playerIndex;
        const bannedCoIdList    = data.bannedCoIdList;
        if (settingsForMrw.dataArrayForBanCo == null) {
            settingsForMrw.dataArrayForBanCo = [{
                srcPlayerIndex,
                bannedCoIdList,
            }];
        } else {
            const dataArray     = settingsForMrw.dataArrayForBanCo;
            const playerData    = dataArray.find(v => v.srcPlayerIndex === data.playerIndex);
            if (playerData) {
                playerData.bannedCoIdList = data.bannedCoIdList;
            } else {
                dataArray.push({
                    srcPlayerIndex,
                    bannedCoIdList,
                });
            }
        }
    }
    export async function updateOnMsgMrrSetSelfSettings(data: ProtoTypes.NetMessage.MsgMrrSetSelfSettings.IS): Promise<void> {
        const roomInfo = await getRoomInfo(Helpers.getExisted(data.roomId)).catch(err => { CompatibilityHelpers.showError(err); throw err; });
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
    export function updateOnMsgMrrDeleteRoomByServer(data: ProtoTypes.NetMessage.MsgMrrDeleteRoomByServer.IS): void {
        const roomId        = Helpers.getExisted(data.roomId);
        const oldRoomInfo   = _roomInfoDict.get(roomId);
        setRoomInfo(roomId, null);

        if ((oldRoomInfo) && (checkIsMyRoom(oldRoomInfo))) {
            Notify.dispatch(NotifyType.MrrMyRoomDeleted);
        }
    }

    export async function checkIsRed(): Promise<boolean> {
        for (const roomId of getMyRoomIdArray()) {
            if (await checkIsRedForRoom(roomId).catch(err => { CompatibilityHelpers.showError(err); throw err; })) {
                return true;
            }
        }
        return false;
    }
    export async function checkIsRedForRoom(roomId: number): Promise<boolean> {
        const roomInfo = await getRoomInfo(roomId).catch(err => { CompatibilityHelpers.showError(err); throw err; });
        if (roomInfo == null) {
            return false;
        }

        const selfUserId = UserModel.getSelfUserId();
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
        const roomInfo = roomId == null ? null : await getRoomInfo(roomId).catch(err => { CompatibilityHelpers.showError(err); throw err; });
        if (roomInfo == null) {
            return null;
        }

        const settingsForCommon = Helpers.getExisted(roomInfo.settingsForCommon);
        const warRule           = Helpers.getExisted(settingsForCommon.warRule);
        const playerInfoArray   : TwnsCommonWarPlayerInfoPage.PlayerInfo[] = [];
        for (const playerInfo of (roomInfo.playerDataList || [])) {
            const playerIndex = Helpers.getExisted(playerInfo.playerIndex);
            playerInfoArray.push({
                playerIndex,
                teamIndex           : WarRuleHelpers.getTeamIndex(warRule, playerIndex),
                isAi                : false,
                userId              : playerInfo.userId ?? null,
                coId                : playerInfo.coId ?? null,
                unitAndTileSkinId   : playerInfo.unitAndTileSkinId ?? null,
                isReady             : Helpers.getExisted(playerInfo.isReady),
                isInTurn            : null,
                isDefeat            : null,
            });
        }

        return {
            configVersion           : Helpers.getExisted(settingsForCommon.configVersion),
            playersCountUnneutral   : WarRuleHelpers.getPlayersCountUnneutral(warRule),
            roomOwnerPlayerIndex    : null,
            callbackOnExitRoom      : null,
            callbackOnDeletePlayer  : null,
            playerInfoArray,
        };
    }

    export async function createDataForCommonWarBasicSettingsPage(roomId: number | null): Promise<OpenDataForCommonWarBasicSettingsPage> {
        const roomInfo = roomId == null ? null : await getRoomInfo(roomId).catch(err => { CompatibilityHelpers.showError(err); throw err; });
        if (roomInfo == null) {
            return { dataArrayForListSettings: [] };
        }

        const warRule           = Helpers.getExisted(roomInfo.settingsForCommon?.warRule);
        const settingsForMrw    = Helpers.getExisted(roomInfo.settingsForMrw);
        const bootTimerParams   = CommonConstants.WarBootTimerDefaultParams;
        const timerType         = bootTimerParams[0] as Types.BootTimerType;
        const openData          : OpenDataForCommonWarBasicSettingsPage = {
            dataArrayForListSettings    : [
                {
                    settingsType    : WarBasicSettingsType.MapName,
                    currentValue    : await WarMapModel.getMapNameInCurrentLanguage(Helpers.getExisted(settingsForMrw.mapId)).catch(err => { CompatibilityHelpers.showError(err); throw err; }),
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
            throw Helpers.newError(`MrrModel.createDataForCommonWarBasicSettingsPage() invalid timerType: ${timerType}`);
        }

        return openData;
    }

    export async function createDataForCommonWarAdvancedSettingsPage(roomId: number | null): Promise<OpenDataForCommonWarAdvancedSettingsPage> {
        const roomInfo = roomId == null ? null : await getRoomInfo(roomId).catch(err => { CompatibilityHelpers.showError(err); throw err; });
        if (roomInfo == null) {
            return null;
        }

        const settingsForCommon = Helpers.getExisted(roomInfo.settingsForCommon);
        const warRule           = Helpers.getExisted(settingsForCommon.warRule);
        return {
            configVersion   : Helpers.getExisted(settingsForCommon.configVersion),
            warRule,
            warType         : warRule.ruleForGlobalParams?.hasFogByDefault ? Types.WarType.MrwFog : Types.WarType.MrwStd,
        };
    }

    function checkIsMyRoom(roomInfo: IMrrRoomInfo | null): boolean {
        const selfUserId = UserModel.getSelfUserId();
        return !!roomInfo?.playerDataList?.some(v => v.userId === selfUserId);
    }
}

export default MrrModel;
