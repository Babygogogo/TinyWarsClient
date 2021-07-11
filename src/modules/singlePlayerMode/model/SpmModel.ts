
import * as CommonConstants     from "../../../utility/CommonConstants";
import * as Notify              from "../../../utility/Notify";
import { NotifyType } from "../../../utility/NotifyType";
import * as ProtoTypes          from "../../../utility/ProtoTypes";
import * as ProtoManager        from "../../../utility/ProtoManager";
import * as Types               from "../../../utility/Types";
import NetMessage           = ProtoTypes.NetMessage;
import SpmWarSaveSlotData   = Types.SpmWarSaveSlotData;

export function init(): void {
    // nothing to do
}

////////////////////////////////////////////////////////////////////////////////////////////////////
// Functions for save slots.
////////////////////////////////////////////////////////////////////////////////////////////////////
export namespace SaveSlot {
    const _slotDict             = new Map<number, SpmWarSaveSlotData>();
    let _hasReceivedSlotArray   = false;
    let _previewingSlotIndex    : number;

    export function getSlotDict(): Map<number, SpmWarSaveSlotData> {
        return _slotDict;
    }
    function setSlotData({ slotIndex, warData, slotExtraData }: {
        slotIndex       : number;
        warData         : ProtoTypes.WarSerialization.ISerialWar;
        slotExtraData   : ProtoTypes.SinglePlayerMode.ISpmWarSaveSlotExtraData;
    }): void {
        getSlotDict().set(slotIndex, {
            slotIndex,
            warData,
            extraData   : slotExtraData,
        });
    }

    export function getHasReceivedSlotArray(): boolean {
        return _hasReceivedSlotArray;
    }

    export function checkIsEmpty(slotIndex: number): boolean {
        return !getSlotDict().has(slotIndex);
    }

    export function getAvailableIndex(): number {
        for (let index = 0; index < CommonConstants.SpwSaveSlotMaxCount; ++index) {
            if (checkIsEmpty(index)) {
                return index;
            }
        }
        return 0;
    }

    export function getPreviewingSlotIndex(): number {
        return _previewingSlotIndex;
    }
    export function setPreviewingSlotIndex(index: number): void {
        if (getPreviewingSlotIndex() !== index) {
            _previewingSlotIndex = index;
            Notify.dispatch(NotifyType.SpmPreviewingWarSaveSlotChanged);
        }
    }

    export function updateOnMsgSpmGetWarSaveSlotFullDataArray(data: NetMessage.MsgSpmGetWarSaveSlotFullDataArray.IS): void {
        _hasReceivedSlotArray = true;

        getSlotDict().clear();
        for (const fullData of data.dataArray || []) {
            setSlotData({
                slotIndex       : fullData.slotIndex,
                slotExtraData   : ProtoManager.decodeAsSpmWarSaveSlotExtraData(fullData.encodedExtraData),
                warData         : ProtoManager.decodeAsSerialWar(fullData.encodedWarData),
            });
        }
    }
    export function updateOnMsgSpmCreateScw(data: NetMessage.MsgSpmCreateScw.IS): void {
        setSlotData({
            slotIndex       : data.slotIndex,
            slotExtraData   : data.extraData,
            warData         : data.warData,
        });
    }
    export function updateOnMsgSpmCreateSfw(data: NetMessage.MsgSpmCreateSfw.IS): void {
        setSlotData({
            slotIndex       : data.slotIndex,
            warData         : data.warData,
            slotExtraData   : data.extraData,
        });
    }
    export function updateOnMsgSpmCreateSrw(data: NetMessage.MsgSpmCreateSrw.IS): void {
        setSlotData({
            slotIndex       : data.slotIndex,
            warData         : data.warData,
            slotExtraData   : data.extraData,
        });
    }
    export function updateOnMsgSpmDeleteWarSaveSlot(slotIndex: number): void {
        getSlotDict().delete(slotIndex);
    }
    export function updateOnMsgSpmSaveScw(data: NetMessage.MsgSpmSaveScw.IS): void {
        setSlotData({
            slotIndex       : data.slotIndex,
            warData         : data.warData,
            slotExtraData   : data.slotExtraData,
        });
    }
    export function updateOnMsgSpmSaveSfw(data: NetMessage.MsgSpmSaveSfw.IS): void {
        setSlotData({
            slotIndex       : data.slotIndex,
            warData         : data.warData,
            slotExtraData   : data.slotExtraData,
        });
    }
    export function updateOnMsgSpmSaveSrw(data: NetMessage.MsgSpmSaveSrw.IS): void {
        setSlotData({
            slotIndex       : data.slotIndex,
            warData         : data.warData,
            slotExtraData   : data.slotExtraData,
        });
    }
    export function updateOnMsgSpmValidateSrw(data: NetMessage.MsgSpmValidateSrw.IS): void {
        getSlotDict().delete(data.slotIndex);
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////
// Functions for srw ranking info.
////////////////////////////////////////////////////////////////////////////////////////////////////
export namespace SrwRank {
    type SrwRankInfo = NetMessage.MsgSpmGetSrwRankInfo.ISrwRankInfoForRule;

    const _rankInfoDict = new Map<number, SrwRankInfo[]>();

    export function getRankInfo(mapId: number): SrwRankInfo[] | undefined | null {
        return _rankInfoDict.get(mapId);
    }

    export function updateOnMsgSpmGetSrwRankInfo(data: ProtoTypes.NetMessage.MsgSpmGetSrwRankInfo.IS): void {
        _rankInfoDict.set(data.mapId, data.infoArray || []);
    }
}
