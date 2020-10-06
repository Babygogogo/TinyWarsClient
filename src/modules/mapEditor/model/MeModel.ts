
namespace TinyWars.MapEditor.MeModel {
    import ProtoTypes       = Utility.ProtoTypes;
    import Types            = Utility.Types;
    import ConfigManager    = Utility.ConfigManager;
    import MapReviewStatus  = Types.MapReviewStatus;
    import IMapEditorData   = ProtoTypes.Map.IMapEditorData;
    import CommonConstants  = ConfigManager.COMMON_CONSTANTS;

    const MAP_DICT = new Map<number, IMapEditorData>();

    export function init(): void {
    }

    export function resetDataList(rawDataList: IMapEditorData[]): void {
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
        for (let i = 0; i < CommonConstants.MapEditorSlotMaxCount; ++i) {
            if (!MAP_DICT.has(i)) {
                MAP_DICT.set(i, createEmptyData(i));
            }
        }
    }
    export function updateData(slotIndex: number, data: IMapEditorData): void {
        MAP_DICT.set(slotIndex, {
            slotIndex,
            reviewStatus: data.reviewStatus,
            mapRawData  : data.mapRawData,
        });
    }
    export function getDataDict(): Map<number, IMapEditorData> {
        return MAP_DICT;
    }
    export function getData(slotIndex: number): IMapEditorData {
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

    function createEmptyData(slotIndex: number): IMapEditorData {
        return {
            slotIndex,
            reviewStatus: MapReviewStatus.None,
            mapRawData  : null,
        }
    }
}
