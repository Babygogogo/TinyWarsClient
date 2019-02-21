
namespace TinyWars.Utility.McwWarManager {
    import McwWar = MultiCustomWar.McwWar;

    let _war: McwWar;

    export async function loadWar(data: Types.SerializedMcwWar): Promise<McwWar> {
        if (_war) {
            Logger.warn(`McwWarManager.loadWar() another war has been loaded already!`);
            unloadWar();
        }
        _war = await new MultiCustomWar.McwWar().init(data);
        _war.startRunning().startRunningView();

        return _war;
    }

    export function unloadWar(): void {
        if (_war) {
            _war.stopRunning();
            _war = undefined;
        }
    }

    export function getWar(): McwWar | undefined {
        return _war;
    }
}
