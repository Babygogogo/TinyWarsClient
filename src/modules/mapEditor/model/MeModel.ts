
// import CommonConstants      from "../../tools/helpers/CommonConstants";
// import Helpers              from "../../tools/helpers/Helpers";
// import Logger               from "../../tools/helpers/Logger";
// import Types                from "../../tools/helpers/Types";
// import ProtoTypes           from "../../tools/proto/ProtoTypes";
// import UserModel            from "../../user/model/UserModel";
// import MeUtility            from "./MeUtility";
// import TwnsMeWar            from "./MeWar";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace MeModel {
    import MeWar            = TwnsMeWar.MeWar;
    import MapReviewStatus  = Types.MapReviewStatus;
    import IMapRawData      = ProtoTypes.Map.IMapRawData;
    import IMapEditorData   = ProtoTypes.Map.IMapEditorData;

    const MAP_DICT  = new Map<number, IMapEditorData>();
    let _war        : MeWar | null = null;

    export function init(): void {
        // nothing to do.
    }

    export async function resetDataList(rawDataList: IMapEditorData[]): Promise<void> {
        MAP_DICT.clear();
        for (const data of rawDataList || []) {
            const slotIndex = Helpers.getExisted(data.slotIndex);
            MAP_DICT.set(slotIndex, {
                slotIndex,
                reviewStatus    : data.reviewStatus,
                mapRawData      : convertBaseSeaToDecoratorShore(data.mapRawData),
                reviewComment   : data.reviewComment,
            });
        }

        const maxSlotsCount = UserModel.getIsSelfMapCommittee()
            ? CommonConstants.MapEditorSlotMaxCountForCommittee
            : CommonConstants.MapEditorSlotMaxCountForNormal;
        for (let i = 0; i < maxSlotsCount; ++i) {
            if (!MAP_DICT.has(i)) {
                MAP_DICT.set(i, createEmptyData(i));
            }
        }
    }
    export function updateData(slotIndex: number, data: IMapEditorData): void {
        MAP_DICT.set(slotIndex, {
            slotIndex,
            reviewStatus: data.reviewStatus,
            mapRawData  : convertBaseSeaToDecoratorShore(data.mapRawData),
        });
    }
    export function getDataDict(): Map<number, IMapEditorData> {
        return MAP_DICT;
    }
    export function getData(slotIndex: number): IMapEditorData | null {
        return MAP_DICT.get(slotIndex) ?? null;
    }

    export function getReviewingMapSlotIndex(): number | null {
        for (const [slotIndex, data] of MAP_DICT) {
            if (data.reviewStatus === MapReviewStatus.Reviewing) {
                return slotIndex;
            }
        }
        return null;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for managing war.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    export async function loadWar(mapRawData: Types.Undefinable<IMapRawData>, slotIndex: number, isReview: boolean): Promise<MeWar> {
        if (_war) {
            Logger.warn(`MeManager.loadWar() another war has been loaded already!`);
            unloadWar();
        }

        mapRawData = mapRawData || await MeUtility.createDefaultMapRawData(slotIndex);
        _war = new MeWar();
        await _war.initWithMapEditorData({
            mapRawData,
            slotIndex
        });
        _war.setIsMapModified(false);
        _war.setIsReviewingMap(isReview);
        _war.startRunning()
            .startRunningView();

        return _war;
    }

    export function unloadWar(): void {
        if (_war) {
            _war.stopRunning();
            _war = null;
        }
    }

    export function getWar(): MeWar | null {
        return _war;
    }

    function createEmptyData(slotIndex: number): IMapEditorData {
        return {
            slotIndex,
            reviewStatus: MapReviewStatus.None,
            mapRawData  : null,
        };
    }

    function convertBaseSeaToDecoratorShore(mapRawData: Types.Undefinable<IMapRawData>): IMapRawData | null {
        if (mapRawData == null) {
            return null;
        }

        for (const tileData of mapRawData.tileDataArray || []) {
            if (tileData.baseType !== Types.TileBaseType.Sea) {
                continue;
            }

            const shapeId = tileData.baseShapeId;
            if (shapeId) {
                tileData.decoratorType      = Types.TileDecoratorType.Shore;
                tileData.decoratorShapeId   = shapeId;
                tileData.baseShapeId        = 0;
            }
        }
        return mapRawData;
    }
}

// export default MeModel;
