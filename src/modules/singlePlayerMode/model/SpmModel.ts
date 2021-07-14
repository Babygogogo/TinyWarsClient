
import Notify               from "../../tools/notify/Notify";
import TwnsNotifyType       from "../../tools/notify/NotifyType";
import Types                from "../../tools/helpers/Types";
import CommonConstants      from "../../tools/helpers/CommonConstants";
import ProtoTypes           from "../../tools/proto/ProtoTypes";
import ProtoManager         from "../../tools/proto/ProtoManager";

namespace SpmModel {
    import NotifyType           = TwnsNotifyType.NotifyType;
    import NetMessage           = ProtoTypes.NetMessage;
    import SpmWarSaveSlotData   = Types.SpmWarSaveSlotData;

    export function init(): void {
        // nothing to do
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for save slots.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
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

export default SpmModel;
