
namespace TinyWars.MapEditor.MeManager {
    import Logger       = Utility.Logger;
    import ProtoTypes   = Utility.ProtoTypes;

    let _war: MeWar;

    export function init(): void {
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
}
