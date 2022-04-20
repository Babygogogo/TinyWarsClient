
// import CommonConstants      from "../../tools/helpers/CommonConstants";
// import Helpers              from "../../tools/helpers/Helpers";
// import Notify               from "../../tools/notify/Notify";
// import TwnsNotifyType       from "../../tools/notify/NotifyType";
// import ProtoTypes           from "../../tools/proto/ProtoTypes";
// import WarRuleHelpers       from "../../tools/warHelpers/WarRuleHelpers";
// import UserModel            from "../../user/model/UserModel";
// import MrrModel             from "./MrrModel";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.MultiRankRoom.MrrSelfSettingsModel {
    import NotifyType       = TwnsNotifyType.NotifyType;
    import ClientErrorCode  = TwnsClientErrorCode.ClientErrorCode;
    import IMrrRoomInfo     = CommonProto.MultiRankRoom.IMrrRoomInfo;

    let _roomId             : number | null;
    let _coId               : number | null;
    let _unitAndTileSkinId  : number | null;
    let _availableCoIdArray : number[] | null;

    export async function resetData(roomId: number): Promise<void> {
        setRoomId(roomId);
        clearCoId();
        clearUnitAndTileSkinId();
        clearAvailableCoIdArray();

        const roomInfo          = Helpers.getExisted(await MultiRankRoom.MrrModel.getRoomInfo(roomId));
        const playerDataList    = roomInfo ? roomInfo.playerDataList || [] : [];
        const selfUserId        = UserModel.getSelfUserId();
        const selfPlayerData    = playerDataList.find(v => v.userId === selfUserId);
        if ((roomInfo.timeForStartSetSelfSettings == null) || (selfPlayerData == null)) {
            return;
        }

        const selfPlayerIndex       = Helpers.getExisted(selfPlayerData.playerIndex);
        const availableCoIdArray    = await generateAvailableCoIdArray(roomInfo, selfPlayerIndex);
        if (!availableCoIdArray.length) {
            throw Helpers.newError(`Empty availableCoIdArray`, ClientErrorCode.MrrSelfSettingsModel_ResetData_00);
        }
        setAvailableCoIdArray(availableCoIdArray);

        if (selfPlayerData.isReady) {
            setCoId(Helpers.getExisted(selfPlayerData.coId));
            setUnitAndTileSkinId(Helpers.getExisted(selfPlayerData.unitAndTileSkinId));
        } else {
            const availableSkinIdList = generateAvailableSkinIdList(roomInfo);
            if (!availableSkinIdList.length) {
                throw Helpers.newError(`Empty availableSkinIdList.`, ClientErrorCode.MrrSelfSettingsModel_ResetData_01);
            }

            setCoId(CommonConstants.CoEmptyId);
            setUnitAndTileSkinId(availableSkinIdList.indexOf(selfPlayerIndex) >= 0 ? selfPlayerIndex : availableSkinIdList[0]);
        }
    }
    function setRoomId(roomId: number): void {
        _roomId = roomId;
    }
    export function getRoomId(): number | null {
        return _roomId;
    }

    export function setCoId(coId: number): void {
        if (_coId !== coId) {
            _coId = coId;
            Notify.dispatch(NotifyType.MrrSelfSettingsCoIdChanged);
        }
    }
    export function getCoId(): number | null {
        return _coId;
    }
    function clearCoId(): void {
        _coId = null;
    }

    export function setUnitAndTileSkinId(skinId: number): void {
        if (_unitAndTileSkinId !== skinId) {
            _unitAndTileSkinId = skinId;
            Notify.dispatch(NotifyType.MrrSelfSettingsSkinIdChanged);
        }
    }
    export function getUnitAndTileSkinId(): number | null {
        return _unitAndTileSkinId;
    }
    function clearUnitAndTileSkinId(): void {
        _unitAndTileSkinId = null;
    }

    function setAvailableCoIdArray(idArray: number[]): void {
        _availableCoIdArray = idArray;
    }
    export function getAvailableCoIdArray(): number[] | null {
        return _availableCoIdArray;
    }
    function clearAvailableCoIdArray(): void {
        _availableCoIdArray = null;
    }

    async function generateAvailableCoIdArray(roomInfo: IMrrRoomInfo, playerIndex: number): Promise<number[]> {
        const settingsForCommon = Helpers.getExisted(roomInfo.settingsForCommon);
        const gameConfig        = await Config.ConfigManager.getGameConfig(Helpers.getExisted(settingsForCommon.configVersion));
        const settingsForMrw    = Helpers.getExisted(roomInfo.settingsForMrw);
        const dataArrayForBanCo = Helpers.getExisted(settingsForMrw.dataArrayForBanCo);
        const playerRule        = WarRuleHelpers.getPlayerRule(Helpers.getExisted(settingsForCommon.warRule), playerIndex);
        const bannedCoIdSet     = new Set<number>(playerRule.bannedCoIdArray);
        for (const data of dataArrayForBanCo) {
            for (const coId of data.bannedCoIdList || []) {
                bannedCoIdSet.add(coId);
            }
        }

        return WarRuleHelpers.getAvailableCoIdArray(gameConfig, bannedCoIdSet);
    }

    function generateAvailableSkinIdList(roomInfo: IMrrRoomInfo): number[] {
        const usedSkinIds = new Set<number>();
        for (const playerData of Helpers.getExisted(roomInfo.playerDataList)) {
            if (playerData.isReady) {
                const skinId = Helpers.getExisted(playerData.unitAndTileSkinId);
                if (usedSkinIds.has(skinId)) {
                    throw Helpers.newError(`Duplicated skinId: ${skinId}`, ClientErrorCode.MrrSelfSettingsModel_GenerateAvailableSkinIdList_00);
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

// export default MrrSelfSettingsModel;
