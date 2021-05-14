
namespace TinyWars.SinglePlayerMode.SpmModel {
    import ProtoTypes           = Utility.ProtoTypes;
    import ProtoManager         = Utility.ProtoManager;
    import CommonConstants      = Utility.CommonConstants;
    import Types                = Utility.Types;
    import NetMessage           = ProtoTypes.NetMessage;
    import SpmWarSaveSlotData   = Types.SpmWarSaveSlotData;

    export function init(): void {
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for save slots.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    export namespace SaveSlot {
        const _slotArray: SpmWarSaveSlotData[] = [];

        export function getSlotArray(): SpmWarSaveSlotData[] {
            return _slotArray;
        }

        export function checkHasRequiredSlotDataArray(): boolean {
            return getSlotArray().length > 0;
        }

        export function checkIsEmpty(slotIndex: number): boolean {
            return getSlotArray()[slotIndex] == null;
        }

        export function getAvailableIndex(): number {
            for (let index = 0; index < CommonConstants.SpwSaveSlotMaxCount; ++index) {
                if (checkIsEmpty(index)) {
                    return index;
                }
            }
            return 0;
        }

        export function updateOnMsgSpmGetWarSaveSlotFullDataArray(data: NetMessage.MsgSpmGetWarSaveSlotFullDataArray.IS): void {
            const dataArray = data.dataArray || [];
            const slotArray = getSlotArray();
            for (let slotIndex = 0; slotIndex < CommonConstants.SpwSaveSlotMaxCount; ++slotIndex) {
                const fullData = dataArray.find(v => v.slotIndex === slotIndex);
                if (fullData == null) {
                    slotArray[slotIndex] = null;
                } else {
                    slotArray[slotIndex] = {
                        slotIndex,
                        extraData   : ProtoManager.decodeAsSpmWarSaveSlotExtraData(fullData.encodedExtraData),
                        warData     : ProtoManager.decodeAsSerialWar(fullData.encodedWarData),
                    };
                }
            }
        }
        export function updateOnMsgSpmCreateScw(data: NetMessage.MsgSpmCreateScw.IS): void {
            const slotIndex = data.slotIndex;
            getSlotArray()[slotIndex] = {
                slotIndex,
                warData     : data.warData,
                extraData   : data.extraData,
            };
        }
        export function updateOnMsgSpmCreateSfw(data: NetMessage.MsgSpmCreateSfw.IS): void {
            const slotIndex = data.slotIndex;
            getSlotArray()[slotIndex] = {
                slotIndex,
                warData     : data.warData,
                extraData   : data.extraData,
            };
        }
        export function updateOnMsgSpmDeleteWarSaveSlot(slotIndex: number): void {
            getSlotArray()[slotIndex] = null;
        }
    }
}
