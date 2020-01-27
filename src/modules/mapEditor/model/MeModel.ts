
namespace TinyWars.MapEditor.MeModel {
    import ProtoTypes       = Utility.ProtoTypes;
    import Types            = Utility.Types;
    import ProtoManager     = Utility.ProtoManager;
    import MapReviewStatus  = Types.MapReviewStatus;
    import MeMapData        = Types.MeMapData;

    const MAP_DICT = new Map<number, MeMapData>();

    export function init(): void {
    }

    export function resetDataList(rawDataList: ProtoTypes.IMapEditorData[]): void {
        MAP_DICT.clear();
        for (const data of rawDataList || []) {
            const slotIndex     = data.slotIndex;
            const encodedMap    = data.encodedMap;
            MAP_DICT.set(slotIndex, {
                slotIndex,
                reviewStatus: data.reviewStatus,
                encodedMap,
                mapRawData  : encodedMap ? ProtoManager.decodeAsMapRawData(encodedMap) : null,
            });
        }
        for (let i = 0; i < ConfigManager.MAX_MAP_EDITOR_SLOT_COUNT; ++i) {
            if (!MAP_DICT.has(i)) {
                MAP_DICT.set(i, createEmptyData(i));
            }
        }
    }
    export function getDataDict(): Map<number, MeMapData> {
        return MAP_DICT;
    }

    function createEmptyData(slotIndex: number): MeMapData {
        return {
            slotIndex,
            reviewStatus: MapReviewStatus.None,
            encodedMap  : null,
            mapRawData  : null,
        }
    }
}
