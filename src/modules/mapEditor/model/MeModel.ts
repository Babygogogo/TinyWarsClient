
namespace TinyWars.MapEditor.MeModel {
    import ProtoTypes       = Utility.ProtoTypes;
    import Types            = Utility.Types;
    import MapReviewStatus  = Types.MapReviewStatus;
    import MeMapData        = Types.MeMapData;

    const MAP_DICT = new Map<number, MeMapData>();

    export function init(): void {
    }

    export function resetDataList(rawDataList: ProtoTypes.IMapEditorData[]): void {
        MAP_DICT.clear();
        for (const data of rawDataList || []) {
            const slotIndex     = data.slotIndex;
            MAP_DICT.set(slotIndex, {
                slotIndex,
                reviewStatus    : data.reviewStatus,
                mapRawData      : data.mapRawData,
                reviewComment   : data.reviewComment,
            });
        }
        for (let i = 0; i < ConfigManager.COMMON_CONSTANTS.MapEditorSlotMaxCount; ++i) {
            if (!MAP_DICT.has(i)) {
                MAP_DICT.set(i, createEmptyData(i));
            }
        }
    }
    export function updateData(slotIndex: number, data: ProtoTypes.IMapEditorData): void {
        MAP_DICT.set(slotIndex, {
            slotIndex,
            reviewStatus: data.reviewStatus,
            mapRawData  : data.mapRawData,
        });
    }
    export function getDataDict(): Map<number, MeMapData> {
        return MAP_DICT;
    }
    export function getData(slotIndex: number): MeMapData {
        return MAP_DICT.get(slotIndex);
    }

    export function checkHasReviewingMap(): boolean {
        for (const [, data] of MAP_DICT) {
            if (data.reviewStatus === MapReviewStatus.Reviewing) {
                return true;
            }
        }
        return false;
    }

    function createEmptyData(slotIndex: number): MeMapData {
        return {
            slotIndex,
            reviewStatus: MapReviewStatus.None,
            mapRawData  : null,
        }
    }
}
