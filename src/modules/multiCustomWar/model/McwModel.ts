
namespace TinyWars.MultiCustomWar.McwModel {
    import Types            = Utility.Types;
    import Logger           = Utility.Logger;
    import ProtoTypes       = Utility.ProtoTypes;
    import Helpers          = Utility.Helpers;
    import ActionContainer  = ProtoTypes.IActionContainer;
    import ActionCodes      = Network.Codes;

    const _HANDLERS = new Map<ActionCodes, (data: ActionContainer) => Promise<void>>([
        [ActionCodes.S_McwBeginTurn,    _handleMcwBeginTurn],
        [ActionCodes.S_McwEndTurn,      _handleMcwEndTurn],
        [ActionCodes.S_McwUnitWait,     _handleMcwUnitWait],
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
        _updateByActionContainer({ S_McwBeginTurn: data }, data.warId, data.actionId);
    }
    export function updateOnEndTurn(data: ProtoTypes.IS_McwEndTurn): void {
        _updateByActionContainer({ S_McwEndTurn: data }, data.warId, data.actionId);
    }
    export function updateOnUnitWait(data: ProtoTypes.IS_McwUnitWait): void {
        _updateByActionContainer({ S_McwUnitWait: data }, data.warId, data.actionId);
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

    async function _checkAndRunFirstCachedAction(): Promise<void> {
        const container = _cachedActions.length ? _cachedActions.shift() : undefined;
        if ((container) && (_war.getIsRunningWar()) && (!_war.getIsEnded()) && (!_war.getIsRunningAction())) {
            _war.setIsRunningAction(true);
            _war.setNextActionId(_war.getNextActionId() + 1);
            await _HANDLERS.get(Helpers.getActionCode(container))(container);
            _war.setIsRunningAction(false);

            if (_war.getIsEnded()) {
                // TODO: show the ending summary and exit to lobby.
            }
        }
    }

    function _checkAndRequestBeginTurn(): void {
        const turnManager = _war.getTurnManager();
        if ((turnManager.getPhaseCode() === Types.TurnPhaseCode.WaitBeginTurn)      &&
            (_war.getPlayerIndexLoggedIn() ===  turnManager.getPlayerIndexInTurn())
        ) {
            _war.getActionPlanner().setStateRequestingPlayerBeginTurn();
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // The 'true' handlers for war actions.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    async function _handleMcwBeginTurn(data: ActionContainer): Promise<void> {
        const actionPlanner = _war.getActionPlanner();
        actionPlanner.setStateExecutingAction();
        await _war.getTurnManager().endPhaseWaitBeginTurn(data.S_McwBeginTurn);
        actionPlanner.setStateIdle();
    }

    async function _handleMcwEndTurn(data: ActionContainer): Promise<void> {
        const actionPlanner = _war.getActionPlanner();
        actionPlanner.setStateExecutingAction();
        await _war.getTurnManager().endPhaseMain();

        if (_war.getPlayerInTurn() === _war.getPlayerLoggedIn()) {
            actionPlanner.setStateRequestingPlayerBeginTurn();
        } else {
            actionPlanner.setStateIdle();
        }
    }

    async function _handleMcwUnitWait(data: ActionContainer): Promise<void> {
        const actionPlanner = _war.getActionPlanner();
        actionPlanner.setStateExecutingAction();
        // TODO

    }
}
