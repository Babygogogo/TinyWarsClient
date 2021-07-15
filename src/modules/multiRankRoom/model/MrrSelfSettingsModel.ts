
import CommonConstants              from "../../tools/helpers/CommonConstants";
import Logger                       from "../../tools/helpers/Logger";
import Notify                       from "../../tools/notify/Notify";
import TwnsNotifyType from "../../tools/notify/NotifyType";
import ProtoTypes                   from "../../tools/proto/ProtoTypes";
import WarRuleHelpers              from "../../tools/warHelpers/WarRuleHelpers";
import UserModel                    from "../../user/model/UserModel";
import MrrModel                     from "./MrrModel";

export namespace MrrSelfSettingsModel {
    import NotifyType       = TwnsNotifyType.NotifyType;
    import IMrrRoomInfo     = ProtoTypes.MultiRankRoom.IMrrRoomInfo;

    let _roomId             : number | null | undefined;
    let _coId               : number | null | undefined;
    let _unitAndTileSkinId  : number | null | undefined;
    let _availableCoIdArray : number[] | null | undefined;

    export async function resetData(roomId: number): Promise<void> {
        setRoomId(roomId);
        setCoId(null);
        setUnitAndTileSkinId(null);
        setAvailableCoIdArray(null);

        const roomInfo          = await MrrModel.getRoomInfo(roomId);
        const playerDataList    = roomInfo ? roomInfo.playerDataList || [] : [];
        const selfUserId        = UserModel.getSelfUserId();
        const selfPlayerData    = playerDataList.find(v => v.userId === selfUserId);
        if ((roomInfo.timeForStartSetSelfSettings == null) || (selfPlayerData == null)) {
            return;
        }

        const selfPlayerIndex       = selfPlayerData.playerIndex;
        const availableCoIdArray    = generateAvailableCoIdArray(roomInfo, selfPlayerIndex);
        if ((availableCoIdArray == null) || (!availableCoIdArray.length)) {
            Logger.error(`MrrModel.SelfSettings.resetData() empty availableCoIdArray.`);
            return undefined;
        }
        setAvailableCoIdArray(availableCoIdArray);

        if (selfPlayerData.isReady) {
            setCoId(selfPlayerData.coId);
            setUnitAndTileSkinId(selfPlayerData.unitAndTileSkinId);
        } else {
            const availableSkinIdList = generateAvailableSkinIdList(roomInfo);
            if ((availableSkinIdList == null) || (!availableSkinIdList.length)) {
                Logger.error(`MrrModel.SelfSettings.resetData() empty availableSkinIdList.`);
                return undefined;
            }

            setCoId(CommonConstants.CoEmptyId);
            setUnitAndTileSkinId(availableSkinIdList.indexOf(selfPlayerIndex) >= 0 ? selfPlayerIndex : availableSkinIdList[0]);
        }
    }
    function setRoomId(roomId: number | null | undefined): void {
        _roomId = roomId;
    }
    export function getRoomId(): number | null | undefined {
        return _roomId;
    }

    export function setCoId(coId: number | null | undefined): void {
        if (_coId !== coId) {
            _coId = coId;
            Notify.dispatch(NotifyType.MrrSelfSettingsCoIdChanged);
        }
    }
    export function getCoId(): number | null | undefined {
        return _coId;
    }

    export function setUnitAndTileSkinId(skinId: number | null | undefined): void {
        if (_unitAndTileSkinId !== skinId) {
            _unitAndTileSkinId = skinId;
            Notify.dispatch(NotifyType.MrrSelfSettingsSkinIdChanged);
        }
    }
    export function getUnitAndTileSkinId(): number | null | undefined {
        return _unitAndTileSkinId;
    }

    function setAvailableCoIdArray(idArray: number[] | null | undefined): void {
        _availableCoIdArray = idArray;
    }
    export function getAvailableCoIdArray(): number[] | null | undefined {
        return _availableCoIdArray;
    }
    function generateAvailableCoIdArray(roomInfo: IMrrRoomInfo, playerIndex: number): number[] | undefined {
        const settingsForCommon = roomInfo.settingsForCommon;
        if (settingsForCommon == null) {
            Logger.error(`MrrModel.generateAvailableCoIdList() empty settingsForCommon.`);
            return undefined;
        }

        const configVersion = settingsForCommon.configVersion;
        if (configVersion == null) {
            Logger.error(`MrrModel.generateAvailableCoIdList() empty configVersion.`);
            return undefined;
        }

        const settingsForMrw = roomInfo.settingsForMrw;
        if (settingsForMrw == null) {
            Logger.error(`MrrModel.generateAvailableCoIdList() empty settingsForMrw.`);
            return undefined;
        }

        const dataArrayForBanCo = settingsForMrw.dataArrayForBanCo;
        if (dataArrayForBanCo == null) {
            Logger.error(`MrrModel.generateAvailableCoIdList() empty dataArrayForBanCo.`);
            return undefined;
        }

        const playerRule = WarRuleHelpers.getPlayerRule(settingsForCommon.warRule, playerIndex);
        if (playerRule == null) {
            Logger.error(`MrrModel.generateAvailableCoIdList() empty playerRule.`);
            return undefined;
        }

        const bannedCoIdSet = new Set<number>(playerRule.bannedCoIdArray);
        for (const data of dataArrayForBanCo) {
            for (const coId of data.bannedCoIdList || []) {
                bannedCoIdSet.add(coId);
            }
        }

        return WarRuleHelpers.getAvailableCoIdArray(configVersion, bannedCoIdSet);
    }

    function generateAvailableSkinIdList(roomInfo: IMrrRoomInfo): number[] | undefined {
        const playerDataList = roomInfo.playerDataList;
        if (playerDataList == null) {
            Logger.error(`MrrModel.SelfSettings.generateAvailableSkinIdList() empty playerDataList.`);
            return undefined;
        }

        const usedSkinIds = new Set<number>();
        for (const playerData of playerDataList) {
            if (playerData.isReady) {
                const skinId = playerData.unitAndTileSkinId;
                if (usedSkinIds.has(skinId)) {
                    Logger.error(`MrrModel.SelfSettings.generateAvailableSkinIdList() duplicated skinId!`);
                    return undefined;
                }

                usedSkinIds.add(skinId);
            }
        }

        const availableSkinIdList: number[] = [];
        for (let skinId = CommonConstants.UnitAndTileMinSkinId; skinId <= CommonConstants.UnitAndTileMaxSkinId; ++skinId) {
            if (!usedSkinIds.has(skinId)) {
                availableSkinIdList.push(skinId);
            }
        }
        return availableSkinIdList;
    }
}
