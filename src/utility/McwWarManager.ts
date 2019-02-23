
namespace TinyWars.Utility.McwWarManager {
    import NetManager   = Network.Manager;
    import McwWar       = MultiCustomWar.McwWar;

    const _NET_EVENTS = [
    ];

    let _war: McwWar;

    export function init(): void {
        NetManager.addListeners(_NET_EVENTS, McwWarManager);
    }

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
