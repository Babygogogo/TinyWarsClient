
namespace TinyWars.MultiCustomWar.McwModel {
    import Types        = Utility.Types;
    import Logger       = Utility.Logger;
    import ProtoTypes   = Utility.ProtoTypes;

    let _war: McwWar;

    export function init(): void {
    }

    export async function loadWar(data: Types.SerializedMcwWar): Promise<McwWar> {
        if (_war) {
            Logger.warn(`McwModel.loadWar() another war has been loaded already!`);
            unloadWar();
        }
        _war = await new MultiCustomWar.McwWar().init(data);
        _war.startRunning().startRunningView();
        _checkAndRequestBeginTurn();

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

    export function updateOnBeginTurn(data: ProtoTypes.IS_McwBeginTurn): void {
        if ((_war) && (_war.getWarId() === data.warId)) {
            _war.getTurnManager().endPhaseWaitBeginTurn(data);
        }
    }

    function _checkAndRequestBeginTurn(): void {
        const turnManager = _war.getTurnManager();
        if ((turnManager.getPhaseCode() === Types.TurnPhaseCode.WaitBeginTurn) &&
            (_war.getPlayerIndexLoggedIn() ===  turnManager.getPlayerIndexInTurn())) {
            McwProxy.reqMcwBeginTurn(_war.getWarId());
        }
    }
}
