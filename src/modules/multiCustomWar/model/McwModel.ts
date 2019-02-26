
namespace TinyWars.MultiCustomWar.McwModel {
    import Types            = Utility.Types;
    import Logger           = Utility.Logger;
    import ProtoTypes       = Utility.ProtoTypes;
    import Helpers          = Utility.Helpers;
    import ActionContainer  = ProtoTypes.IActionContainer;
    import ActionCodes      = Network.Codes;

    const _HANDLERS = new Map<ActionCodes, (data: ActionContainer) => void>([
        [ActionCodes.S_McwBeginTurn, _handleMcwBeginTurn],
    ]);

    let _war            : McwWar;
    let _cachedActions  = new Array<ActionContainer>();

    export function init(): void {
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for managing war.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    export async function loadWar(data: Types.SerializedMcwWar): Promise<McwWar> {
        if (_war) {
            Logger.warn(`McwModel.loadWar() another war has been loaded already!`);
            unloadWar();
        }

        _war = (await new MultiCustomWar.McwWar().init(data)).startRunning().startRunningView();
        _checkAndRequestBeginTurn();

        return _war;
    }

    export function unloadWar(): void {
        if (_war) {
            _war.stopRunning();
            _war                    = undefined;
            _cachedActions.length   = 0;
        }
    }

    export function getWar(): McwWar | undefined {
        return _war;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Handlers for war actions that McwProxy receives.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    export function updateOnBeginTurn(data: ProtoTypes.IS_McwBeginTurn): void {
        _updateByActionContainer({
            S_McwBeginTurn: data
        }, data.warId, data.actionId);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Util functions.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    function _updateByActionContainer(container: ActionContainer, warId: number, actionId: number): void {
        if ((_war) && (_war.getWarId() === warId)) {
            if (actionId !== _war.getNextActionId() + _cachedActions.length) {
                // TODO: refresh the war.
            } else {
                _cachedActions.push(container);
                _checkAndRunFirstCachedAction();
            }
        }
    }

    function _checkAndRunFirstCachedAction(): void {
        const action = _cachedActions.length ? _cachedActions.shift() : undefined;
        if ((action) && (_war.getIsRunningWar()) && (!_war.getIsRunningAction())) {
            _HANDLERS.get(Helpers.getActionCode(action))(action);
        }
    }

    function _checkAndRequestBeginTurn(): void {
        const turnManager = _war.getTurnManager();
        if ((turnManager.getPhaseCode() === Types.TurnPhaseCode.WaitBeginTurn) &&
            (_war.getPlayerIndexLoggedIn() ===  turnManager.getPlayerIndexInTurn())) {
            McwProxy.reqMcwBeginTurn(_war.getWarId());
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // The 'true' handlers for war actions.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    function _handleMcwBeginTurn(data: ActionContainer): void {
        _war.getTurnManager().endPhaseWaitBeginTurn(data.S_McwBeginTurn);
    }
}
