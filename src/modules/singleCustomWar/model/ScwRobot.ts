
namespace TinyWars.SingleCustomWar.ScrRobot {
    import ProtoTypes       = Utility.ProtoTypes;
    import Types            = Utility.Types;
    import WarAction        = ProtoTypes.IWarActionContainer;

    const enum PhaseCode {
        Phase0,
        Phase1,
        Phase2,
        Phase3,
        Phase4,
        Phase5,
        Phase6,
        Phase7,
        Phase8,
        Phase9,
        Phase10,
    }

    let _war                    : ScwWar;
    let _turnManager            : ScwTurnManager;
    let _unitMap                : ScwUnitMap;
    let _playerIndexForHuman    : number;
    let _phaseCode              : PhaseCode;
    let _unitValues             : Map<number, number>;
    let _candidateUnits         : ScwUnit[];

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Helpers.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    function _getUnitValues(): Map<number, number> {
        const values = new Map<number, number>();
        _unitMap.forEachUnit(unit => {
            const playerIndex = unit.getPlayerIndex();
            values.set(playerIndex, (values.get(playerIndex) || 0) + unit.getProductionFinalCost() * unit.getNormalizedCurrentHp() / unit.getNormalizedMaxHp());
        });
        return values;
    }

    function _popRandomElement<T>(arr: T[]): T {
        const length = arr.length;
        if (!length) {
            return null;
        } else {
            return arr.splice(Math.floor(_war.getRandomNumberGenerator()() * length), 1)[0];
        }
    }

    function _popRandomCandidateUnit(candidateUnits: ScwUnit[]): ScwUnit | null {
        const unit = _popRandomElement(candidateUnits);
        if (!unit) {
            return null;
        } else {
            if ((_unitMap.getUnitOnMap(unit.getGridIndex()) === unit) ||
                (_unitMap.getUnitLoadedById(unit.getUnitId()) === unit)
            ) {
                return unit;
            } else {
                return _popRandomCandidateUnit(candidateUnits);
            }
        }
    }

    function _clearVariables(): void {
        _war                    = null;
        _turnManager            = null;
        _unitMap                = null;
        _playerIndexForHuman    = null;
        _phaseCode              = null;
        _unitValues             = null;
        _candidateUnits         = null;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Candidate units generators.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    function _getCandidateUnitsForPhase1(): ScwUnit[] {
        const units             : ScwUnit[] = [];
        const playerIndexInturn = _turnManager.getPlayerIndexInTurn();
        _unitMap.forEachUnitOnMap((unit: ScwUnit) => {
            if ((unit.getPlayerIndex() === playerIndexInturn)   &&
                (unit.getState() === Types.UnitState.Idle)      &&
                (unit.getFinalMaxAttackRange() > 1)
            ) {
                units.push(unit);
            }
        });
        return units;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Phases.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Phase 0: begin turn.
    async function _getActionForPhase0(): Promise<WarAction | null> {
        if (_turnManager.getPhaseCode() === Types.TurnPhaseCode.WaitBeginTurn) {
            return { WarActionPlayerBeginTurn: { } };
        } else {
            _phaseCode = PhaseCode.Phase1;
            return null;
        }
    }

    // Phase 1: make the ranged units to attack enemies.
    async function _getActionForPhase1(): Promise<WarAction | null> {
        _candidateUnits = _candidateUnits || _getCandidateUnitsForPhase1();

        let action: WarAction;
        while ((!action) || (!action.WarActionUnitAttack)) {
            const unit = _popRandomCandidateUnit(_candidateUnits);
            if (!unit) {
                _candidateUnits = null;
                _phaseCode      = PhaseCode.Phase2;
                return null;
            }

            // action = _getActionForMaxScoreWithCandidateUnit(unit);
        }

        return null;
    }

    async function _getActionForPhase2(): Promise<WarAction | null> {
        return null;
    }

    async function _getActionForPhase3(): Promise<WarAction | null> {
        return null;
    }

    async function _getActionForPhase4(): Promise<WarAction | null> {
        return null;
    }

    async function _getActionForPhase5(): Promise<WarAction | null> {
        return null;
    }

    async function _getActionForPhase6(): Promise<WarAction | null> {
        return null;
    }

    async function _getActionForPhase7(): Promise<WarAction | null> {
        return null;
    }

    async function _getActionForPhase8(): Promise<WarAction | null> {
        return null;
    }

    async function _getActionForPhase9(): Promise<WarAction | null> {
        return null;
    }

    async function _getActionForPhase10(): Promise<WarAction | null> {
        return null;
    }

    export async function getNextAction(war: ScwWar): Promise<WarAction> {
        if (!_war) {
            _war            = war;
            _turnManager    = war.getTurnManager() as ScwTurnManager;
            _unitMap        = war.getUnitMap() as ScwUnitMap;
            _phaseCode      = PhaseCode.Phase0;
            _unitValues     = _getUnitValues();
        }

        let action: WarAction;
        if ((!action) && (_phaseCode === PhaseCode.Phase0))     { action = await _getActionForPhase0(); }
        if ((!action) && (_phaseCode === PhaseCode.Phase1))     { action = await _getActionForPhase1(); }
        if ((!action) && (_phaseCode === PhaseCode.Phase2))     { action = await _getActionForPhase2(); }
        if ((!action) && (_phaseCode === PhaseCode.Phase3))     { action = await _getActionForPhase3(); }
        if ((!action) && (_phaseCode === PhaseCode.Phase4))     { action = await _getActionForPhase4(); }
        if ((!action) && (_phaseCode === PhaseCode.Phase5))     { action = await _getActionForPhase5(); }
        if ((!action) && (_phaseCode === PhaseCode.Phase6))     { action = await _getActionForPhase6(); }
        if ((!action) && (_phaseCode === PhaseCode.Phase7))     { action = await _getActionForPhase7(); }
        if ((!action) && (_phaseCode === PhaseCode.Phase8))     { action = await _getActionForPhase8(); }
        if ((!action) && (_phaseCode === PhaseCode.Phase9))     { action = await _getActionForPhase9(); }
        if ((!action) && (_phaseCode === PhaseCode.Phase10))    { action = await _getActionForPhase10(); }

        _clearVariables();
        return action;
    }
}
