
namespace TinyWars.SinglePlayerMode.SpmModel {
    import ProtoTypes           = Utility.ProtoTypes;
    import ProtoManager         = Utility.ProtoManager;
    import CommonConstants      = Utility.CommonConstants;
    import Types                = Utility.Types;
    import Notify               = Utility.Notify;
    import NetMessage           = ProtoTypes.NetMessage;
    import SpmWarSaveSlotData   = Types.SpmWarSaveSlotData;

    export function init(): void {
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
                Notify.dispatch(Notify.Type.SpmPreviewingWarSaveSlotChanged);
            }
        }

        export function updateOnMsgSpmGetWarSaveSlotFullDataArray(data: NetMessage.MsgSpmGetWarSaveSlotFullDataArray.IS): void {
            _hasReceivedSlotArray = true;

            const slotDict = getSlotDict();
            slotDict.clear();

            for (const fullData of data.dataArray || []) {
                const slotIndex = fullData.slotIndex;
                slotDict.set(slotIndex, {
                    slotIndex,
                    extraData   : ProtoManager.decodeAsSpmWarSaveSlotExtraData(fullData.encodedExtraData),
                    warData     : ProtoManager.decodeAsSerialWar(fullData.encodedWarData),
                });
            }
        }
        export function updateOnMsgSpmCreateScw(data: NetMessage.MsgSpmCreateScw.IS): void {
            const slotIndex = data.slotIndex;
            getSlotDict().set(slotIndex, {
                slotIndex,
                warData     : data.warData,
                extraData   : data.extraData,
            });
        }
        export function updateOnMsgSpmCreateSfw(data: NetMessage.MsgSpmCreateSfw.IS): void {
            const slotIndex = data.slotIndex;
            getSlotDict().set(slotIndex, {
                slotIndex,
                warData     : data.warData,
                extraData   : data.extraData,
            });
        }
        export function updateOnMsgSpmDeleteWarSaveSlot(slotIndex: number): void {
            getSlotDict().delete(slotIndex);
        }
        export function updateOnMsgSpmSaveScw(data: NetMessage.MsgSpmSaveScw.IS): void {
            const slotIndex = data.slotIndex;
            getSlotDict().set(slotIndex, {
                slotIndex,
                warData     : data.warData,
                extraData   : data.slotExtraData,
            });
        }
        export function updateOnMsgSpmSaveSfw(data: NetMessage.MsgSpmSaveSfw.IS): void {
            const slotIndex = data.slotIndex;
            getSlotDict().set(slotIndex, {
                slotIndex,
                warData     : data.warData,
                extraData   : data.slotExtraData,
            });
        }
    }
}
