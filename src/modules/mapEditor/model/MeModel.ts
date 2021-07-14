
import Logger                       from "../../tools/helpers/Logger";
import Types                        from "../../tools/helpers/Types";
import { MeWar }                        from "./MeWar";
import CommonConstants              from "../../tools/helpers/CommonConstants";
import ProtoTypes                   from "../../tools/proto/ProtoTypes";
import UserModel                    from "../../user/model/UserModel";
import * as MeUtility                   from "./MeUtility";

namespace MeModel {
    import MapReviewStatus                  = Types.MapReviewStatus;
    import IMapEditorData                   = ProtoTypes.Map.IMapEditorData;

    const MAP_DICT  = new Map<number, IMapEditorData>();
    let _war        : MeWar;

    export function init(): void {
        // nothing to do.
    }

    export async function resetDataList(rawDataList: IMapEditorData[]): Promise<void> {
        MAP_DICT.clear();
        for (const data of rawDataList || []) {
            const slotIndex = data.slotIndex;
            MAP_DICT.set(slotIndex, {
                slotIndex,
                reviewStatus    : data.reviewStatus,
                mapRawData      : data.mapRawData,
                reviewComment   : data.reviewComment,
            });
        }

        const maxSlotsCount = await UserModel.getIsSelfMapCommittee()
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

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for managing war.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    export async function loadWar(mapRawData: ProtoTypes.Map.IMapRawData | null, slotIndex: number, isReview: boolean): Promise<MeWar> {
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
            _war = undefined;
        }
    }

    export function getWar(): MeWar | undefined {
        return _war;
    }

    function createEmptyData(slotIndex: number): IMapEditorData {
        return {
            slotIndex,
            reviewStatus: MapReviewStatus.None,
            mapRawData  : null,
        };
    }
}

export default MeModel;
