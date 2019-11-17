
namespace TinyWars.SingleCustomWar.ScrRobot {
    import ProtoTypes       = Utility.ProtoTypes;
    import Types            = Utility.Types;
    import GridIndexHelpers = Utility.GridIndexHelpers;
    import Helpers          = Utility.Helpers;
    import BwHelpers        = BaseWar.BwHelpers;
    import WarAction        = ProtoTypes.IWarActionContainer;
    import GridIndex        = Types.GridIndex;
    import MovableArea      = Types.MovableArea;
    import MovePathNode     = Types.MovePathNode;

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
    type AttackInfo = {
        baseDamage      : number;
        normalizedHp    : number;
        fuel            : number;
    }
    type ScoreAndAction = {
        score   : number;
        action  : WarAction;
    }

    let _war                    : ScwWar;
    let _turnManager            : ScwTurnManager;
    let _playerManager          : ScwPlayerManager;
    let _unitMap                : ScwUnitMap;
    let _tileMap                : ScwTileMap;
    let _mapSize                : Types.MapSize;
    let _playerIndexForHuman    : number;
    let _phaseCode              : PhaseCode;
    let _unitValues             : Map<number, number>;
    let _candidateUnits         : ScwUnit[];

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Helpers.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    function _getUnitValues(): Map<number, number> {    // DONE
        const values = new Map<number, number>();
        _unitMap.forEachUnit(unit => {
            const playerIndex = unit.getPlayerIndex();
            values.set(playerIndex, (values.get(playerIndex) || 0) + unit.getProductionFinalCost() * unit.getNormalizedCurrentHp() / unit.getNormalizedMaxHp());
        });
        return values;
    }

    function _checkCanUnitWaitOnGrid(unit: ScwUnit, gridIndex: GridIndex): boolean {    // DONE
        if (GridIndexHelpers.checkIsEqual(unit.getGridIndex(), gridIndex)) {
            return unit.getLoaderUnitId() == null;
        } else {
            return !_unitMap.getUnitOnMap(gridIndex);
        }
    }

    function _getBetterScoreAndAction(data1: ScoreAndAction | null, data2: ScoreAndAction | null): ScoreAndAction | null {  // DONE
        if (!data1) {
            return data2;
        } else if (!data2) {
            return data1;
        } else {
            return data1.score >= data2.score ? data1 : data2;
        }
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

    function _getReachableArea(unit: ScwUnit, passableGridIndex: GridIndex | null, blockedGridIndex: GridIndex | null): MovableArea {
        return BwHelpers.createMovableArea(
            unit.getGridIndex(),
            Math.min(unit.getFinalMoveRange(), unit.getCurrentFuel()),
            (gridIndex: GridIndex) => {
                if ((!GridIndexHelpers.checkIsInsideMap(gridIndex, _mapSize))                           ||
                    ((blockedGridIndex) && (GridIndexHelpers.checkIsEqual(gridIndex, blockedGridIndex)))
                ) {
                    return null;
                } else {
                    if ((passableGridIndex) && (GridIndexHelpers.checkIsEqual(gridIndex, passableGridIndex))) {
                        return _tileMap.getTile(gridIndex).getMoveCostByUnit(unit);
                    } else {
                        const existingUnit = _unitMap.getUnitOnMap(gridIndex);
                        if ((existingUnit) && (existingUnit.getTeamIndex() != unit.getTeamIndex())) {
                            return null;
                        } else {
                            return _tileMap.getTile(gridIndex).getMoveCostByUnit(unit);
                        }
                    }
                }
            }
        );
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
    // Generators for score map for distance to the nearest capturable tile.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    function _createScoreMapForDistance(unit: ScwUnit): number[][] | null {
        const nearestCapturableTile = BwHelpers.findNearestCapturableTile(_tileMap, _unitMap, unit);
        if (!nearestCapturableTile) {
            return null;
        }

        const { distanceMap, maxDistance }  = BwHelpers.createDistanceMap(_tileMap, unit, nearestCapturableTile.getGridIndex());
        const scoreForUnmovableGrid = -20 * (maxDistance + 1);                                                      // ADJUSTABLE
        for (let x = 0; x < _mapSize.width; ++x) {
            for (let y = 0; y < _mapSize.height; ++y) {
                distanceMap[x][y] = distanceMap[x][y] != null ? distanceMap[x][y] * -20 : scoreForUnmovableGrid;    // ADJUSTABLE
            }
        }

        return distanceMap;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Damage map generators.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    function _getAttackBonusForAllPlayers(): Map<number, number> {  // DONE
        const bonuses = new Map<number, number>();
        _playerManager.forEachPlayer(false, player => {
            bonuses.set(player.getPlayerIndex(), _war.getSettingsAttackPowerModifier());
        });

        _tileMap.forEachTile(tile => {
            const bonus = tile.getGlobalAttackBonus();
            if (bonus) {
                const playerIndex = tile.getPlayerIndex();
                bonuses.set(playerIndex, (bonuses.get(playerIndex) || 0) + bonus);
            }
        });

        return bonuses;
    }

    function _getDefenseBonusForTargetUnit(unit: ScwUnit): number { // DONE
        let bonus           = unit.getPromotionDefenseBonus();
        const playerIndex   = unit.getPlayerIndex();
        _tileMap.forEachTile(tile => {
            if (tile.getPlayerIndex() === playerIndex) {
                bonus += (tile.getGlobalDefenseBonus() || 0);
            }
        });

        return bonus;
    }

    function _getAttackInfo(attacker: ScwUnit, target: ScwUnit): AttackInfo {   // DONE
        const gridIndex = attacker.getGridIndex();
        if (attacker.getLoaderUnitId() == null) {
            const tile          = _tileMap.getTile(gridIndex);
            const repairInfo    = tile.getRepairHpAndCostForUnit(attacker);
            if (repairInfo) {
                return {
                    baseDamage  : attacker.getCfgBaseDamage(target.getArmorType()),
                    normalizedHp: Math.floor((attacker.getCurrentHp() + repairInfo.hp) / ConfigManager.UNIT_HP_NORMALIZER),
                    fuel        : attacker.getMaxFuel(),
                };
            } else {
                if ((tile.checkCanSupplyUnit(attacker))                                     ||
                    (GridIndexHelpers.getAdjacentGrids(gridIndex, _mapSize).some(g => {
                        const supplier = _unitMap.getUnitOnMap(g);
                        return (!!supplier) && (supplier.checkCanSupplyAdjacentUnit(attacker))
                    }))
                ) {
                    return {
                        baseDamage  : attacker.getCfgBaseDamage(target.getArmorType()),
                        normalizedHp: attacker.getNormalizedCurrentHp(),
                        fuel        : attacker.getMaxFuel(),
                    };
                } else {
                    return {
                        baseDamage  : attacker.getBaseDamage(target.getArmorType()),
                        normalizedHp: attacker.getNormalizedCurrentHp(),
                        fuel        : attacker.getCurrentFuel(),
                    };
                }
            }

        } else {
            const loader = _unitMap.getUnitOnMap(gridIndex);
            if ((!attacker.checkCanAttackAfterMove())               ||
                (loader.getUnitId() !== attacker.getLoaderUnitId()) ||
                (!loader.checkCanLaunchLoadedUnit())
            ) {
                return {
                    baseDamage  : null,
                    normalizedHp: attacker.getNormalizedCurrentHp(),
                    fuel        : attacker.getCurrentFuel(),
                };
            } else {
                const repairInfo = loader.getRepairHpAndCostForLoadedUnit(attacker);
                if (repairInfo) {
                    return {
                        baseDamage  : attacker.getCfgBaseDamage(target.getArmorType()),
                        normalizedHp: Math.floor((attacker.getCurrentHp() + repairInfo.hp) / ConfigManager.UNIT_HP_NORMALIZER),
                        fuel        : attacker.getMaxFuel(),
                    };
                } else {
                    if (loader.checkCanSupplyLoadedUnit()) {
                        return {
                            baseDamage  : attacker.getCfgBaseDamage(target.getArmorType()),
                            normalizedHp: attacker.getNormalizedCurrentHp(),
                            fuel        : attacker.getMaxFuel(),
                        };
                    } else {
                        return {
                            baseDamage  : attacker.getBaseDamage(target.getArmorType()),
                            normalizedHp: attacker.getNormalizedCurrentHp(),
                            fuel        : attacker.getCurrentFuel(),
                        }
                    }
                }
            }
        }
    }

    function _getDefenseMultiplierWithBonus(bonus: number): number {    // DONE
        return (bonus >= 0)
            ? 1 / (1 + bonus / 100)
            : 1 - bonus / 100;
    }

    function _createDamageMap(targetUnit: ScwUnit, isDiving: boolean): number[][] { // DONE
        const map               = Helpers.createEmptyMap<number>(_mapSize.width);
        const attackBonuses     = _getAttackBonusForAllPlayers();
        const defenseBonus      = _getDefenseBonusForTargetUnit(targetUnit);
        const targetTeamIndex   = targetUnit.getTeamIndex();
        const luckValue         = (_war.getSettingsLuckLowerLimit() + _war.getSettingsLuckUpperLimit()) / 2;
        _unitMap.forEachUnit((attacker: ScwUnit) => {
            const minAttackRange    = attacker.getMinAttackRange();
            const maxAttackRange    = attacker.getFinalMaxAttackRange();
            if ((!minAttackRange)                                       ||
                (!maxAttackRange)                                       ||
                (attacker.getTeamIndex() === targetTeamIndex)           ||
                ((isDiving) && (!attacker.checkCanAttackDivingUnits()))
            ) {
                return;
            }

            const { baseDamage, normalizedHp, fuel } = _getAttackInfo(attacker, targetUnit);
            if (baseDamage == null) {
                return;
            }

            const beginningGridIndex    = attacker.getGridIndex();
            const attackBonus           = (attackBonuses.get(attacker.getPlayerIndex()) || 0) + attacker.getPromotionAttackBonus();
            const movableArea           = BwHelpers.createMovableArea(
                beginningGridIndex,
                Math.min(attacker.getFinalMoveRange(), fuel),
                gridIndex => {
                    if (!GridIndexHelpers.checkIsInsideMap(gridIndex, _mapSize)) {
                        return null;
                    } else {
                        const existingUnit = _unitMap.getUnitOnMap(gridIndex);
                        if ((existingUnit) && (existingUnit.getTeamIndex() != attacker.getTeamIndex())) {
                            return null;
                        } else {
                            return _tileMap.getTile(gridIndex).getMoveCostByUnit(attacker);
                        }
                    }
                }
            );
            const attackableArea = BwHelpers.createAttackableArea(
                movableArea,
                _mapSize,
                minAttackRange,
                maxAttackRange,
                (moveGridIndex: GridIndex, attackGridIndex: GridIndex): boolean => {
                    const hasMoved = !GridIndexHelpers.checkIsEqual(moveGridIndex, beginningGridIndex);
                    return ((attacker.getLoaderUnitId() == null) || (hasMoved))
                        && ((attacker.checkCanAttackAfterMove()) || (!hasMoved));
                }
            );
            for (let x = 0; x < _mapSize.width; ++x) {
                const column = attackableArea[x];
                if (column) {
                    for (let y = 0; y < _mapSize.height; ++y) {
                        if (column[y]) {
                            map[x][y] = Math.max(
                                map[x][y] || 0,
                                Math.floor(
                                    (baseDamage * Math.max(0, 1 + attackBonus / 100) + luckValue)
                                    * normalizedHp
                                    * _getDefenseMultiplierWithBonus(defenseBonus + _tileMap.getTile({ x, y }).getDefenseAmountForUnit(targetUnit))
                                    / ConfigManager.UNIT_HP_NORMALIZER
                                ),
                            );
                        }
                    }
                }
            }
        });
        return map;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Candidate units generators.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    function _getCandidateUnitsForPhase1(): ScwUnit[] { // DONE
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
    // Score calculators.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    async function _getScoreForUnitBeLoaded(unit: ScwUnit, gridIndex: GridIndex): Promise<number> { // DONE
        const loader = _unitMap.getUnitOnMap(gridIndex);
        if (!loader.checkCanLaunchLoadedUnit()) {
            return -1000;                                                                   // ADJUSTABLE
        } else {
            if (loader.getNormalizedRepairHpForLoadedUnit() != null) {
                return (unit.getNormalizedMaxHp() - unit.getNormalizedCurrentHp()) * 10;    // ADJUSTABLE
            } else {
                return 0;
            }
        }
    }

    async function _getScoreForUnitJoin(unit: ScwUnit, gridIndex: GridIndex): Promise<number> { // DONE
        const targetUnit = _unitMap.getUnitOnMap(gridIndex);
        if (targetUnit.getState() === Types.UnitState.Idle) {
            return -9999;                                                                       // ADJUSTABLE
        } else {
            if (!targetUnit.getIsCapturingTile()) {
                const newHp = unit.getNormalizedCurrentHp() + targetUnit.getNormalizedCurrentHp();
                const maxHp = unit.getNormalizedMaxHp();
                return newHp > maxHp ? ((newHp - maxHp) * (-50)) : ((maxHp - newHp) * 5);       // ADJUSTABLE
            } else {
                const currentCapturePoint   = _tileMap.getTile(gridIndex).getCurrentCapturePoint();
                const newHp                 = unit.getNormalizedCurrentHp() + targetUnit.getNormalizedCurrentHp();
                const maxHp                 = unit.getNormalizedMaxHp();
                if (targetUnit.getCaptureAmount() >= currentCapturePoint) {
                    return (newHp > maxHp) ? ((newHp - maxHp) * (-50)) : ((maxHp - newHp) * 5); // ADJUSTABLE
                } else {
                    return (Math.min(maxHp, newHp) >= currentCapturePoint) ? 60 : 30;           // ADJUSTABLE
                }
            }
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // The available action generators for units.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    async function _getScoreAndActionUnitBeLoaded(unit: ScwUnit, gridIndex: GridIndex, pathNodes: MovePathNode[]): Promise<ScoreAndAction | null> { // DONE
        if (GridIndexHelpers.checkIsEqual(gridIndex, unit.getGridIndex())) {
            return null;
        }

        const loader = _unitMap.getUnitOnMap(gridIndex);
        if ((!loader) || (!loader.checkCanLoadUnit(unit))) {
            return null;
        }

        return {
            score   : await _getScoreForUnitBeLoaded(unit, gridIndex),
            action  : { WarActionUnitBeLoaded: {
                path        : { nodes: pathNodes },
                launchUnitId: unit.getLoaderUnitId() == null ? null : unit.getUnitId(),
            } },
        };
    }

    async function _getScoreAndActionUnitJoin(unit: ScwUnit, gridIndex: GridIndex, pathNodes: MovePathNode[]): Promise<ScoreAndAction | null> { // DONE
        if (GridIndexHelpers.checkIsEqual(gridIndex, unit.getGridIndex())) {
            return null;
        }

        const existingUnit = _unitMap.getUnitOnMap(gridIndex);
        if ((!existingUnit) || (!unit.checkCanJoinUnit(existingUnit))) {
            return null;
        }

        return {
            score   : await _getScoreForUnitJoin(unit, gridIndex),
            action  : { WarActionUnitJoin: {
                path        : { nodes: pathNodes },
                launchUnitId: unit.getLoaderUnitId() == null ? null : unit.getUnitId(),
            } },
        };
    }

    async function _getMaxScoreAndAction(unit: ScwUnit, gridIndex: GridIndex, pathNodes: MovePathNode[]): Promise<ScoreAndAction | null> {
        const dataForUnitBeLoaded = await _getScoreAndActionUnitBeLoaded(unit, gridIndex, pathNodes);
        if (dataForUnitBeLoaded) {
            return dataForUnitBeLoaded;
        }

        const dataForUnitJoin = await _getScoreAndActionUnitJoin(unit, gridIndex, pathNodes);
        if (dataForUnitJoin) {
            return dataForUnitJoin;
        }

        if (!_checkCanUnitWaitOnGrid(unit, gridIndex)) {
            return null;
        }

        // TODO
        let data: ScoreAndAction;

    }

    async function _getActionForMaxScoreWithCandidateUnit(candidateUnit: ScwUnit): Promise<WarAction | null> {
        const reachableArea         = _getReachableArea(candidateUnit, null, null);
        const damageMapForSurface   = _createDamageMap(candidateUnit, false);
        const damageMapForDive      = candidateUnit.checkIsDiver() ? _createDamageMap(candidateUnit, true) : null;
        const scoreMapForDistance   = _createScoreMapForDistance(candidateUnit);
        let bestScoreAndAction      : ScoreAndAction;

        for (let x = 0; x < _mapSize.width; ++x) {
            if (reachableArea[x]) {
                for (let y = 0; y < _mapSize.height; ++y) {
                    if (reachableArea[x][y]) {
                        const gridIndex     = { x, y };
                        const pathNodes     = BwHelpers.createShortestMovePath(reachableArea, gridIndex);
                        let scoreAndAction  = await _getMaxScoreAndAction(candidateUnit, gridIndex, pathNodes);

                        if (scoreAndAction) {
                            const action        = scoreAndAction.action;
                            bestScoreAndAction  = _getBetterScoreAndAction(
                                bestScoreAndAction,
                                {
                                    action  : scoreAndAction.action,
                                    // TODO
                                    score   : (action.WarActionUnitDive) || ((candidateUnit.getIsDiving()) && (!action.WarActionUnitSurface))
                                        ? scoreAndAction.score
                                        : scoreAndAction.score
                                }
                            );
                        }
                    }
                }
            }
        }

        return bestScoreAndAction ? bestScoreAndAction.action : null;
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
            _playerManager  = war.getPlayerManager() as ScwPlayerManager;
            _unitMap        = war.getUnitMap() as ScwUnitMap;
            _tileMap        = war.getTileMap() as ScwTileMap;
            _mapSize        = _tileMap.getMapSize();
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
