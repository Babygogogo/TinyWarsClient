
namespace TinyWars.SinglePlayerMode.SpmModel {
    import ProtoTypes           = Utility.ProtoTypes;
    import CommonConstants      = Utility.CommonConstants;

    export function init(): void {
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for save slots.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    export namespace SaveSlot {
        let _infoArray  : ProtoTypes.SingleCustomRoom.IScrSaveSlotInfo[];

        export function setInfoArray(infoArray: ProtoTypes.SingleCustomRoom.IScrSaveSlotInfo[]): void {
            _infoArray = infoArray;
        }
        export function getInfoArray(): ProtoTypes.SingleCustomRoom.IScrSaveSlotInfo[] | null {
            return _infoArray;
        }
        export function deleteInfo(slotIndex: number): void {
            const infoArray = getInfoArray();
            if (infoArray) {
                for (let i = 0; i < infoArray.length; ++i) {
                    if (infoArray[i].slotIndex === slotIndex) {
                        infoArray.splice(i, 1);
                        return;
                    }
                }
            }
        }
        export function checkIsEmpty(slotIndex: number): boolean {
            const infoArray = getInfoArray();
            if (!infoArray) {
                return true;
            } else {
                return infoArray.every(v => v.slotIndex !== slotIndex);
            }
        }

        export function getAvailableIndex(): number {
            for (let index = 0; index < CommonConstants.SpwSaveSlotMaxCount; ++index) {
                if (checkIsEmpty(index)) {
                    return index;
                }
            }
            return 0;
        }
    }
}
