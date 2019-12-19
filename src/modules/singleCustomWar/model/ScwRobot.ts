
namespace TinyWars.SingleCustomWar.ScwRobot {
    import Types            = Utility.Types;
    import GridIndexHelpers = Utility.GridIndexHelpers;
    import Helpers          = Utility.Helpers;
    import DamageCalculator = Utility.DamageCalculator;
    import BwHelpers        = BaseWar.BwHelpers;
    import BwUnit           = BaseWar.BwUnit;
    import WarAction        = Types.RawWarActionContainer;
    import GridIndex        = Types.GridIndex;
    import MovableArea      = Types.MovableArea;
    import MovePathNode     = Types.MovePathNode;
    import TileType         = Types.TileType;
    import UnitType         = Types.UnitType;
    import UnitState        = Types.UnitActionState;

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
    const _TILE_VALUE: { [tileType: number]: number } = {           // ADJUSTABLE
        [TileType.Headquarters] : 10,
        [TileType.Factory]      : 15,
        [TileType.Airport]      : 12,
        [TileType.Seaport]      : 12,
        [TileType.City]         : 10,
        [TileType.CommandTower] : 15,
        [TileType.Radar]        : 10,
    };
    const _PRODUCTION_CANDIDATES: { [tileType: number]: { [unitType: number]: number } } = {    // ADJUSTABLE
        [TileType.Factory]: {
            [UnitType.Infantry]     : 500,
            [UnitType.Mech]         : 0,
            [UnitType.Bike]         : 400,
            [UnitType.Recon]        : 0,
            [UnitType.Flare]        : null,
            [UnitType.AntiAir]      : 150,
            [UnitType.Tank]         : 650,
            [UnitType.MediumTank]   : 600,
            [UnitType.WarTank]      : 550,
            [UnitType.Artillery]    : 450,
            [UnitType.AntiTank]     : 400,
            [UnitType.Rockets]      : 300,
            [UnitType.Missiles]     : null,
            [UnitType.Rig]          : null,
        },
        [TileType.Airport]: {
            [UnitType.Fighter]          : 200,
            [UnitType.Bomber]           : 200,
            [UnitType.Duster]           : 400,
            [UnitType.BattleCopter]     : 600,
            [UnitType.TransportCopter]  : null,
        },
        [TileType.Seaport]: {
            [UnitType.Battleship]   : 300,
            [UnitType.Carrier]      : null,
            [UnitType.Submarine]    : 300,
            [UnitType.Cruiser]      : 300,
            [UnitType.Lander]       : null,
            [UnitType.Gunboat]      : 300,
        },
    };

    let _frameBeginTime         : number;
    let _war                    : ScwWar;
    let _configVersion          : string;
    let _turnManager            : ScwTurnManager;
    let _playerManager          : ScwPlayerManager;
    let _unitMap                : ScwUnitMap;
    let _tileMap                : ScwTileMap;
    let _mapSize                : Types.MapSize;
    let _phaseCode              : PhaseCode;
    let _unitValues             : Map<number, number>;
    let _unitValueRatio         : number;
    let _candidateUnits         : ScwUnit[];

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Helpers.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    function _clearVariables(): void {
        _frameBeginTime         = null;
        _war                    = null;
        _configVersion          = null;
        _turnManager            = null;
        _playerManager          = null;
        _unitMap                = null;
        _tileMap                = null;
        _mapSize                = null;
        _phaseCode              = null;
        _unitValues             = null;
        _unitValueRatio         = null;
        _candidateUnits         = null;
    }

    function _checkAndCallLater(): Promise<void> {  // DONE
        if (Date.now() - _frameBeginTime <= 10) {
            return;
        } else {
            return new Promise<void>((resolve, reject) => {
                egret.callLater(() => {
                    _frameBeginTime = Date.now();
                    resolve();
                }, null);
            });
        }
    }

    function _getUnitValues(): Map<number, number> {    // DONE
        const values = new Map<number, number>();
        _unitMap.forEachUnit(unit => {
            const playerIndex = unit.getPlayerIndex();
            values.set(playerIndex, (values.get(playerIndex) || 0) + unit.getProductionFinalCost() * unit.getNormalizedCurrentHp() / unit.getNormalizedMaxHp());
        });
        return values;
    }

    function _getUnitValueRatio(): number { // DONE
        let selfValue       = 0;
        let enemyValue      = 0;
        const selfTeamIndex = _playerManager.getPlayerInTurn().getTeamIndex();
        for (const [playerIndex, value] of _unitValues) {
            if (_playerManager.getPlayer(playerIndex).getTeamIndex() === selfTeamIndex) {
                selfValue += value;
            } else {
                enemyValue += value;
            }
        }
        return enemyValue > 0 ? selfValue / enemyValue : 1;
    }

    function _checkCanUnitWaitOnGrid(unit: ScwUnit, gridIndex: GridIndex): boolean {    // DONE
        if (GridIndexHelpers.checkIsEqual(unit.getGridIndex(), gridIndex)) {
            return unit.getLoaderUnitId() == null;
        } else {
            return !_unitMap.getUnitOnMap(gridIndex);
        }
    }

    function _checkIsCoUnit(unit: BwUnit): boolean {    // DONE
        return _playerManager.getPlayer(unit.getPlayerIndex()).getCoUnitId() === unit.getUnitId();
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

    function _popRandomElement<T>(arr: T[]): T {    // DONE
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

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Generators for score map for distance to the nearest capturable tile.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    async function _createScoreMapForDistance(unit: ScwUnit): Promise<number[][] | null> {
        await _checkAndCallLater();

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

    async function _createDamageMap(targetUnit: ScwUnit, isDiving: boolean): Promise<number[][]> { // DONE
        await _checkAndCallLater();

        const map               = Helpers.createEmptyMap<number>(_mapSize.width);
        const attackBonuses     = _getAttackBonusForAllPlayers();
        const defenseBonus      = _getDefenseBonusForTargetUnit(targetUnit);
        const targetTeamIndex   = targetUnit.getTeamIndex();
        const luckValue         = (_war.getSettingsLuckLowerLimit() + _war.getSettingsLuckUpperLimit()) / 2;
        _unitMap.forEachUnit(async (attacker: ScwUnit) => {
            await _checkAndCallLater();

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
    async function _getCandidateUnitsForPhase1(): Promise<ScwUnit[]> { // DONE
        await _checkAndCallLater();

        const units             : ScwUnit[] = [];
        const playerIndexInturn = _turnManager.getPlayerIndexInTurn();
        _unitMap.forEachUnitOnMap((unit: ScwUnit) => {
            if ((unit.getPlayerIndex() === playerIndexInturn)   &&
                (unit.getState() === UnitState.Idle)            &&
                (unit.getFinalMaxAttackRange() > 1)
            ) {
                units.push(unit);
            }
        });
        return units;
    }

    async function _getCandidateUnitsForPhase2(): Promise<ScwUnit[]> {  // DONE
        await _checkAndCallLater();

        const units             : ScwUnit[] = [];
        const playerIndexInturn = _turnManager.getPlayerIndexInTurn();
        _unitMap.forEachUnitOnMap((unit: ScwUnit) => {
            if ((unit.getPlayerIndex() === playerIndexInturn)   &&
                (unit.getState() === UnitState.Idle)            &&
                (unit.getIsCapturingTile())
            ) {
                units.push(unit);
            }
        });

        return units;
    }

    async function _getCandidateUnitsForPhase3(): Promise<ScwUnit[]> {  // DONE
        await _checkAndCallLater();

        const units             : ScwUnit[] = [];
        const playerIndexInturn = _turnManager.getPlayerIndexInTurn();
        _unitMap.forEachUnitOnMap((unit: ScwUnit) => {
            if ((unit.getPlayerIndex() === playerIndexInturn)   &&
                (unit.getState() === UnitState.Idle)            &&
                (unit.checkCanCapture())
            ) {
                units.push(unit);
            }
        });

        return units;
    }

    async function _getCandidateUnitsForPhase4(): Promise<ScwUnit[]> {  // DONE
        await _checkAndCallLater();

        const units             : ScwUnit[] = [];
        const playerIndexInturn = _turnManager.getPlayerIndexInTurn();
        _unitMap.forEachUnitOnMap((unit: ScwUnit) => {
            if ((unit.getPlayerIndex() === playerIndexInturn)                                                   &&
                (unit.getState() === UnitState.Idle)                                                            &&
                (unit.getMinAttackRange())                                                                      &&
                (ConfigManager.checkIsUnitTypeInCategory(_configVersion, unit.getType(), Types.UnitCategory.Air))
            ) {
                units.push(unit);
            }
        });

        return units;
    }

    async function _getCandidateUnitsForPhase5(): Promise<ScwUnit[]> {  // DONE
        await _checkAndCallLater();

        const units             : ScwUnit[] = [];
        const playerIndexInturn = _turnManager.getPlayerIndexInTurn();
        _unitMap.forEachUnitOnMap((unit: ScwUnit) => {
            if ((unit.getPlayerIndex() === playerIndexInturn)   &&
                (unit.getState() === UnitState.Idle)            &&
                (unit.getFinalMaxAttackRange() === 1)
            ) {
                units.push(unit);
            }
        });

        return units;
    }

    async function _getCandidateUnitsForPhase6(): Promise<ScwUnit[]> {  // DONE
        await _checkAndCallLater();

        const units             : ScwUnit[] = [];
        const playerIndexInturn = _turnManager.getPlayerIndexInTurn();
        _unitMap.forEachUnitOnMap((unit: ScwUnit) => {
            if ((unit.getPlayerIndex() === playerIndexInturn) && (unit.getState() === UnitState.Idle)) {
                const maxRange = unit.getFinalMaxAttackRange();
                if ((!maxRange) || (maxRange === 1)) {
                    units.push(unit);
                }
            }
        });

        return units;
    }

    async function _getCandidateUnitsForPhase7(): Promise<ScwUnit[]> {  // DONE
        await _checkAndCallLater();

        const units             : ScwUnit[] = [];
        const playerIndexInturn = _turnManager.getPlayerIndexInTurn();
        _unitMap.forEachUnitOnMap((unit: ScwUnit) => {
            if ((unit.getPlayerIndex() === playerIndexInturn) && (unit.getState() === UnitState.Idle)) {
                units.push(unit);
            }
        });

        return units;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Score calculators.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    function _getScoreForThreat(unit: ScwUnit, gridIndex: GridIndex, damageMap: number[][]): number {   // DONE
        const hp        = unit.getCurrentHp();
        const damage    = Math.min(damageMap[gridIndex.x][gridIndex.y] || 0, hp);
        return - (damage + (damage >= hp ? 20 : 0) * unit.getProductionFinalCost() / 3000 / Math.max(1, _unitValueRatio)) * (_checkIsCoUnit(unit) ? 2 : 1); // ADJUSTABLE
    }

    async function _getScoreForPosition(unit: ScwUnit, gridIndex: GridIndex, damageMap: number[][], scoreMapForDistance: number[][] | null): Promise<number> {  // DONE
        await _checkAndCallLater();

        let score = _getScoreForThreat(unit, gridIndex, damageMap);
        if (scoreMapForDistance) {
            score += scoreMapForDistance[gridIndex.x][gridIndex.y];                     // ADJUSTABLE
        }

        const tile = _tileMap.getTile(gridIndex);
        if (tile.checkCanRepairUnit(unit)) {
            score += (unit.getNormalizedMaxHp() - unit.getNormalizedCurrentHp()) * 15;  // ADJUSTABLE
        }
        if (tile.checkCanSupplyUnit(unit)) {
            const maxAmmo = unit.getPrimaryWeaponMaxAmmo();
            if (maxAmmo) {
                score += (maxAmmo - unit.getPrimaryWeaponCurrentAmmo()) / maxAmmo * 55;         // ADJUSTABLE
            }

            const maxFuel = unit.getMaxFuel();
            if (maxFuel) {
                score += (maxFuel - unit.getCurrentFuel()) / maxFuel * 50 * (unit.checkIsDestroyedOnOutOfFuel() ? 2 : 1);   // ADJUSTABLE
            }
        }

        const teamIndex = unit.getTeamIndex();
        if (tile.getTeamIndex() === teamIndex) {
            switch (tile.getType()) {
                case TileType.Factory : score += -500; break;                                                               // ADJUSTABLE
                case TileType.Airport : score += -200; break;                                                               // ADJUSTABLE
                case TileType.Seaport : score += -150; break;                                                               // ADJUSTABLE
                default                     : break;
            }
        } else if (tile.getTeamIndex() !== 0) {
            switch (tile.getType()) {
                case TileType.Factory : score += 50; break;                                                                 // ADJUSTABLE
                case TileType.Airport : score += 20; break;                                                                 // ADJUSTABLE
                case TileType.Seaport : score += 15; break;                                                                 // ADJUSTABLE
                default                     : break;
            }
        }

        let distanceToEnemyUnits    = 0;
        let enemyUnitsCount         = 0;
        _unitMap.forEachUnitOnMap(u => {
            if (u.getTeamIndex() != teamIndex) {
                distanceToEnemyUnits += GridIndexHelpers.getDistance(gridIndex, u.getGridIndex());
                ++enemyUnitsCount;
            }
        });
        if (enemyUnitsCount > 0) {
            score += - (distanceToEnemyUnits / enemyUnitsCount) * 10;                           // ADJUSTABLE
        }

        return score;
    }

    async function _getScoreForActionUnitBeLoaded(unit: ScwUnit, gridIndex: GridIndex): Promise<number> { // DONE
        await _checkAndCallLater();

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

    async function _getScoreForActionUnitJoin(unit: ScwUnit, gridIndex: GridIndex): Promise<number> { // DONE
        await _checkAndCallLater();

        const targetUnit = _unitMap.getUnitOnMap(gridIndex);
        if (targetUnit.getState() === UnitState.Idle) {
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

    async function _getScoreForActionUnitAttack(    // DONE
        unit            : ScwUnit,
        gridIndex       : GridIndex,
        targetGridIndex : GridIndex,
        pathNodes       : MovePathNode[],
        attackDamage    : number | null,
        counterDamage   : number | null,
    ): Promise<number | null> {
        await _checkAndCallLater();

        if (attackDamage == null) {
            return null;
        }

        const targetTile    = _tileMap.getTile(targetGridIndex);
        const tileType      = targetTile.getType();
        if (tileType === TileType.Meteor) {
            return Math.min(attackDamage, targetTile.getCurrentHp());                                   // ADJUSTABLE
        }

        const targetUnit    = _unitMap.getUnitOnMap(targetGridIndex);
        const targetHp      = targetUnit.getCurrentHp();
        attackDamage        = Math.min(attackDamage, targetHp);
        let score           = (attackDamage + (attackDamage >= targetHp ? 20 : 0))
            * targetUnit.getProductionFinalCost() / 3000 * Math.max(1, _unitValueRatio)
            * (_checkIsCoUnit(targetUnit) ? 2 : 1);                                                     // ADJUSTABLE

        if (targetUnit.getIsCapturingTile()) {
            score += targetTile.getCurrentCapturePoint() > targetUnit.getCaptureAmount() ? 20 : 200;    // ADJUSTABLE
            if ((tileType === TileType.Headquarters)    ||
                (tileType === TileType.Factory)         ||
                (tileType === TileType.Airport)         ||
                (tileType === TileType.Seaport)
            ) {
                score += 99999;                                                                         // ADJUSTABLE
            }
        }

        if (counterDamage) {
            const attackerHp    = unit.getCurrentHp();
            counterDamage       = Math.min(counterDamage, attackerHp);
            score               += - (counterDamage + (counterDamage >= attackerHp ? 20 : 0))
                * unit.getProductionFinalCost() / 3000 / Math.max(1, _unitValueRatio)
                * (_checkIsCoUnit(unit) ? 2 : 1);                                                       // ADJUSTABLE
        }

        return score;
    }

    async function _getScoreForActionUnitCaptureTile(unit: ScwUnit, gridIndex: GridIndex): Promise<number> {    // DONE
        await _checkAndCallLater();

        const tile                  = _tileMap.getTile(gridIndex);
        const currentCapturePoint   = tile.getCurrentCapturePoint();
        const captureAmount         = unit.getCaptureAmount();
        if (captureAmount >= currentCapturePoint) {
            return 10000;                                                                       // ADJUSTABLE
        } else if (captureAmount < currentCapturePoint / 3) {
            return 1;                                                                           // ADJUSTABLE
        } else {
            const value = _TILE_VALUE[tile.getType()] || 5;                                     // ADJUSTABLE
            return captureAmount >= currentCapturePoint / 2 ? value : value / 2;                // ADJUSTABLE
        }
    }

    async function _getScoreForActionUnitDive(unit: ScwUnit, gridIndex: GridIndex): Promise<number> {   // DONE
        await _checkAndCallLater();

        return unit.getCurrentFuel() <= 35 ? -10 : 10;
    }

    async function _getScoreForActionUnitLaunchSilo(unitValueMap: number[][], targetGridIndex: GridIndex): Promise<number> {    // DONE
        await _checkAndCallLater();

        let score = 10000;                                                                                                          // ADJUSTABLE
        for (const gridIndex of GridIndexHelpers.getGridsWithinDistance(targetGridIndex, 0, ConfigManager.SILO_RADIUS, _mapSize)) {
            score += unitValueMap[gridIndex.x][gridIndex.y] || 0;                                                                   // ADJUSTABLE
        }
        return score;
    }

    async function _getScoreForActionUnitSurface(unit: ScwUnit, gridIndex: GridIndex): Promise<number> {    // DONE
        await _checkAndCallLater();

        return (unit.getCurrentFuel() <= 35) ? 10 : -10;
    }

    async function _getScoreForActionUnitWait(unit: ScwUnit, gridIndex: GridIndex): Promise<number> {   // DONE
        await _checkAndCallLater();

        const tile = _tileMap.getTile(gridIndex);
        if ((tile.getMaxCapturePoint()) && (tile.getTeamIndex() !== unit.getTeamIndex())) {
            return -20;                                                                     // ADJUSTABLE
        } else {
            return 0;                                                                       // ADJUSTABLE
        }
    }

    async function _getScoreForActionPlayerProduceUnit(gridIndex: GridIndex, unitType: UnitType, idleFactoriesCount: number): Promise<number | null> { // DONE
        await _checkAndCallLater();

        const playerIndexInTurn = _turnManager.getPlayerIndexInTurn();
        const unit              = new ScwUnit();
        unit.init({
            viewId  : ConfigManager.getUnitViewId(unitType, playerIndexInTurn),
            unitId  : 0,
            gridX   : gridIndex.x,
            gridY   : gridIndex.y,
        }, _configVersion);
        unit.startRunning(_war);

        const productionCost    = unit.getProductionFinalCost();
        const restFund          = _playerManager.getPlayer(playerIndexInTurn).getFund() - productionCost;
        if (restFund < 0) {
            return null;
        }

        const tileType  = _tileMap.getTile(gridIndex).getType();
        let score       = _PRODUCTION_CANDIDATES[tileType][unitType];
        if (unitType !== UnitType.Infantry) {
            const restFactoriesCount = tileType === TileType.Factory ? idleFactoriesCount - 1 : idleFactoriesCount;
            if (restFactoriesCount * ConfigManager.getUnitTemplateCfg(_configVersion, UnitType.Infantry).productionCost > restFund) {
                score += -999999;                                                                                                       // ADJUSTABLE
            }
        }

        const teamIndex = unit.getTeamIndex();
        _unitMap.forEachUnitOnMap(unitOnMap => {
            if (unitOnMap.getTeamIndex() === teamIndex) {
                if (unitOnMap.getType() === unitType) {
                    score += -unitOnMap.getCurrentHp() * productionCost / 3000;                                                         // ADJUSTABLE
                }
            } else {
                if (unit.getMinAttackRange()) {
                    const damage = Math.min(unit.getBaseDamage(unitOnMap.getArmorType()) || 0, unitOnMap.getCurrentHp());
                    score += damage * unitOnMap.getProductionFinalCost() / 3000;                                                        // ADJUSTABLE
                }
                if (unitOnMap.getMinAttackRange()) {
                    const damage = Math.min((unitOnMap.getBaseDamage(unit.getArmorType()) || 0) * unitOnMap.getNormalizedCurrentHp() / unitOnMap.getNormalizedMaxHp(), unit.getCurrentHp());    // ADJUSTABLE
                    score += -damage * productionCost / 3000;                                                                           // ADJUSTABLE
                }
            }
        });

        return score;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // The available action generators for units.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    async function _getScoreAndActionUnitBeLoaded(unit: ScwUnit, gridIndex: GridIndex, pathNodes: MovePathNode[]): Promise<ScoreAndAction | null> { // DONE
        await _checkAndCallLater();

        if (GridIndexHelpers.checkIsEqual(gridIndex, unit.getGridIndex())) {
            return null;
        }

        const loader = _unitMap.getUnitOnMap(gridIndex);
        if ((!loader) || (!loader.checkCanLoadUnit(unit))) {
            return null;
        }

        return {
            score   : await _getScoreForActionUnitBeLoaded(unit, gridIndex),
            action  : { UnitBeLoaded: {
                path        : pathNodes,
                launchUnitId: unit.getLoaderUnitId() == null ? null : unit.getUnitId(),
            } },
        };
    }

    async function _getScoreAndActionUnitJoin(unit: ScwUnit, gridIndex: GridIndex, pathNodes: MovePathNode[]): Promise<ScoreAndAction | null> { // DONE
        await _checkAndCallLater();

        if (GridIndexHelpers.checkIsEqual(gridIndex, unit.getGridIndex())) {
            return null;
        }

        const existingUnit = _unitMap.getUnitOnMap(gridIndex);
        if ((!existingUnit) || (!unit.checkCanJoinUnit(existingUnit))) {
            return null;
        }

        return {
            score   : await _getScoreForActionUnitJoin(unit, gridIndex),
            action  : { UnitJoin: {
                path        : pathNodes,
                launchUnitId: unit.getLoaderUnitId() == null ? null : unit.getUnitId(),
            } },
        };
    }

    async function _getScoreAndActionUnitAttack(unit: ScwUnit, gridIndex: GridIndex, pathNodes: MovePathNode[]): Promise<ScoreAndAction | null> {   // DONE
        await _checkAndCallLater();

        const minRange  = unit.getMinAttackRange();
        const maxRange  = unit.getFinalMaxAttackRange();
        if ((minRange == null) ||
            (maxRange == null) ||
            ((!unit.checkCanAttackAfterMove()) && (!GridIndexHelpers.checkIsEqual(gridIndex, unit.getGridIndex())))
        ) {
            return null;
        }

        const launchUnitId  = unit.getLoaderUnitId() == null ? null : unit.getUnitId();
        let data            : ScoreAndAction;
        for (const targetGridIndex of GridIndexHelpers.getGridsWithinDistance(gridIndex, minRange, maxRange, _mapSize)) {
            const damages = DamageCalculator.getEstimatedBattleDamage(_war, pathNodes, launchUnitId, targetGridIndex);
            data = _getBetterScoreAndAction(
                data,
                {
                    score   : await _getScoreForActionUnitAttack(unit, gridIndex, targetGridIndex, pathNodes, damages[0], damages[1]),
                    action  : { UnitAttack: {
                        path    : pathNodes,
                        targetGridIndex,
                        launchUnitId,
                    } },
                }
            );
        }

        return data;
    }

    async function _getScoreAndActionUnitCaptureTile(unit: ScwUnit, gridIndex: GridIndex, pathNodes: MovePathNode[]): Promise<ScoreAndAction | null> {  // DONE
        await _checkAndCallLater();

        const tile = _tileMap.getTile(gridIndex);
        if (!unit.checkCanCaptureTile(tile)) {
            return null;
        } else {
            return {
                score   : await _getScoreForActionUnitCaptureTile(unit, gridIndex),
                action  : { UnitCaptureTile: {
                    path            : pathNodes,
                    launchUnitId    : unit.getLoaderUnitId() == null ? null : unit.getUnitId(),
                } },
            }
        }
    }

    async function _getScoreAndActionUnitDive(unit: ScwUnit, gridIndex: GridIndex, pathNodes: MovePathNode[]): Promise<ScoreAndAction | null> { // DONE
        await _checkAndCallLater();

        if (!unit.checkCanDive()) {
            return null;
        } else {
            return {
                score   : await _getScoreForActionUnitDive(unit, gridIndex),
                action  : { UnitDive: {
                    path            : pathNodes,
                    launchUnitId    : unit.getLoaderUnitId() == null ? null : unit.getUnitId(),
                } },
            }
        }
    }

    async function _getScoreAndActionUnitLaunchSilo(unit: ScwUnit, gridIndex: GridIndex, pathNodes: MovePathNode[]): Promise<ScoreAndAction | null> {   // DONE
        await _checkAndCallLater();

        if (!unit.checkCanLaunchSiloOnTile(_tileMap.getTile(gridIndex))) {
            return null;
        }

        const { width, height } = _mapSize;
        const unitValueMap      = Helpers.createEmptyMap<number>(width, height);
        const teamIndex         = unit.getTeamIndex();
        for (let x = 0; x < width; ++x) {
            for (let y = 0; y < height; ++y) {
                const targetUnit = _unitMap.getUnitOnMap({ x, y });
                if ((!targetUnit) || (targetUnit === unit)) {
                    unitValueMap[x][y] = 0;
                } else {
                    const value         = Math.min(30, targetUnit.getCurrentHp() - 1) * targetUnit.getProductionFinalCost() / 10;
                    unitValueMap[x][y]  = targetUnit.getTeamIndex() === teamIndex ? -value : value;                                 // ADJUSTABLE
                }
            }
        }
        unitValueMap[gridIndex.x][gridIndex.y] = -Math.min(30, unit.getCurrentHp() - 1) * unit.getProductionFinalCost() / 10;       // ADJUSTABLE

        let maxScore        : number;
        let targetGridIndex : GridIndex;
        for (let x = 0; x < width; ++x) {
            for (let y = 0; y < height; ++y) {
                const newTargetGridIndex    = { x, y };
                const newMaxScore           = await _getScoreForActionUnitLaunchSilo(unitValueMap, newTargetGridIndex);
                if ((maxScore == null) || (newMaxScore > maxScore)) {
                    maxScore        = newMaxScore;
                    targetGridIndex = newTargetGridIndex;
                }
            }
        }

        return {
            score   : maxScore,
            action  : { UnitLaunchSilo: {
                path            : pathNodes,
                launchUnitId    : unit.getLoaderUnitId() == null ? null : unit.getUnitId(),
                targetGridIndex,
            } },
        };
    }

    async function _getScoreAndActionUnitSurface(unit: ScwUnit, gridIndex: GridIndex, pathNodes: MovePathNode[]): Promise<ScoreAndAction | null> {  // DONE
        await _checkAndCallLater();

        if (!unit.checkCanSurface()) {
            return null;
        } else {
            return {
                score   : await _getScoreForActionUnitSurface(unit, gridIndex),
                action  : { UnitSurface: {
                    path            : pathNodes,
                    launchUnitId    : unit.getLoaderUnitId() == null ? null : unit.getUnitId(),
                } },
            }
        }
    }

    async function _getScoreAndActionUnitWait(unit: ScwUnit, gridIndex: GridIndex, pathNodes: MovePathNode[]): Promise<ScoreAndAction | null> { // DONE
        await _checkAndCallLater();

        return {
            score   : await _getScoreForActionUnitWait(unit, gridIndex),
            action  : { UnitWait: {
                path            : pathNodes,
                launchUnitId    : unit.getLoaderUnitId() == null ? null : unit.getUnitId(),
            } },
        }
    }

    async function _getMaxScoreAndAction(unit: ScwUnit, gridIndex: GridIndex, pathNodes: MovePathNode[]): Promise<ScoreAndAction | null> {  // DONE
        await _checkAndCallLater();

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

        let data: ScoreAndAction;
        data = _getBetterScoreAndAction(data, await _getScoreAndActionUnitAttack(unit, gridIndex, pathNodes));
        data = _getBetterScoreAndAction(data, await _getScoreAndActionUnitCaptureTile(unit, gridIndex, pathNodes));
        data = _getBetterScoreAndAction(data, await _getScoreAndActionUnitDive(unit, gridIndex, pathNodes));
        data = _getBetterScoreAndAction(data, await _getScoreAndActionUnitLaunchSilo(unit, gridIndex, pathNodes));
        data = _getBetterScoreAndAction(data, await _getScoreAndActionUnitSurface(unit, gridIndex, pathNodes));
        data = _getBetterScoreAndAction(data, await _getScoreAndActionUnitWait(unit, gridIndex, pathNodes));

        return data;
    }

    async function _getActionForMaxScoreWithCandidateUnit(candidateUnit: ScwUnit): Promise<WarAction | null> {  // DONE
        await _checkAndCallLater();

        const reachableArea         = _getReachableArea(candidateUnit, null, null);
        const damageMapForSurface   = await _createDamageMap(candidateUnit, false);
        const damageMapForDive      = candidateUnit.checkIsDiver() ? await _createDamageMap(candidateUnit, true) : null;
        const scoreMapForDistance   = await _createScoreMapForDistance(candidateUnit);
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
                                    score   : (action.UnitDive) || ((candidateUnit.getIsDiving()) && (!action.UnitSurface))
                                        ? scoreAndAction.score + await _getScoreForPosition(candidateUnit, gridIndex, damageMapForDive, scoreMapForDistance)
                                        : scoreAndAction.score + await _getScoreForPosition(candidateUnit, gridIndex, damageMapForSurface, scoreMapForDistance)
                                },
                            );
                        }
                    }
                }
            }
        }

        return bestScoreAndAction ? bestScoreAndAction.action : null;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // The available action generators for production.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    async function _getMaxScoreAndActionPlayerProduceUnitWithGridIndex(gridIndex: GridIndex, idleFactoriesCount: number): Promise<ScoreAndAction | null> {  // DONE
        await _checkAndCallLater();

        let maxScore        : number;
        let targetUnitType  : number;
        for (const t in _PRODUCTION_CANDIDATES[_tileMap.getTile(gridIndex).getType()]) {
            const unitType  = Number(t);
            const score     = await _getScoreForActionPlayerProduceUnit(gridIndex, unitType, idleFactoriesCount);
            if ((maxScore == null) || (score > maxScore)) {
                maxScore        = score;
                targetUnitType  = unitType;
            }
        }

        if (maxScore == null) {
            return null;
        } else {
            return {
                score   : maxScore,
                action  : { PlayerProduceUnit: {
                    unitType    : targetUnitType,
                    gridIndex,
                } },
            }
        }
    }

    async function _getActionPlayerProduceUnitForMaxScore(): Promise<WarAction | null> {    // DONE
        await _checkAndCallLater();

        const playerIndexInturn = _turnManager.getPlayerIndexInTurn();
        if (playerIndexInturn === 0) {
            return null;
        }

        const idleBuildingPosList   : GridIndex[] = [];
        let idleFactoriesCount      = 0;

        _tileMap.forEachTile(tile => {
            const gridIndex = tile.getGridIndex();
            if ((tile.getPlayerIndex() === playerIndexInturn)   &&
                (!_unitMap.getUnitOnMap(gridIndex))             &&
                (tile.getProduceUnitCategory() != null)
            ) {
                idleBuildingPosList.push(gridIndex);
                if (tile.getType() === TileType.Factory) {
                    ++idleFactoriesCount;
                }
            }
        });

        let data: ScoreAndAction;
        for (const gridIndex of idleBuildingPosList) {
            data = _getBetterScoreAndAction(data, await _getMaxScoreAndActionPlayerProduceUnitWithGridIndex(gridIndex, idleFactoriesCount));
        }

        return data ? data.action : null;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Phases.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Phase 0: begin turn.
    async function _getActionForPhase0(): Promise<WarAction | null> {   // DONE
        await _checkAndCallLater();

        if (_turnManager.getPhaseCode() === Types.TurnPhaseCode.WaitBeginTurn) {
            return { PlayerBeginTurn: { } };
        } else {
            _phaseCode = PhaseCode.Phase1;
            return null;
        }
    }

    // Phase 1: make the ranged units to attack enemies.
    async function _getActionForPhase1(): Promise<WarAction | null> {   // DONE
        await _checkAndCallLater();

        _candidateUnits = await _getCandidateUnitsForPhase1();
        let action      : WarAction;
        while ((!action) || (!action.UnitAttack)) {
            const unit = _popRandomCandidateUnit(_candidateUnits);
            if (!unit) {
                _candidateUnits = null;
                _phaseCode      = PhaseCode.Phase2;
                return null;
            }

            action = await _getActionForMaxScoreWithCandidateUnit(unit);
        }

        return action;
    }

    // Phase 2: move the infantries, mech and bikes that are capturing buildings.
    async function _getActionForPhase2(): Promise<WarAction | null> {   // DONE
        await _checkAndCallLater();

        _candidateUnits     = await _getCandidateUnitsForPhase2();
        const candidateUnit = _popRandomCandidateUnit(_candidateUnits);
        if (!candidateUnit) {
            _candidateUnits = null;
            _phaseCode      = PhaseCode.Phase3;
            return null;
        }

        return await _getActionForMaxScoreWithCandidateUnit(candidateUnit);
    }

    //  Phase 3: move the other infantries, mech and bikes.
    async function _getActionForPhase3(): Promise<WarAction | null> {   // DONE
        await _checkAndCallLater();

        _candidateUnits     = await _getCandidateUnitsForPhase3();
        const candidateUnit = _popRandomCandidateUnit(_candidateUnits);
        if (!candidateUnit) {
            _candidateUnits = null;
            _phaseCode      = PhaseCode.Phase4;
            return null;
        }

        return await _getActionForMaxScoreWithCandidateUnit(candidateUnit);
    }

    // Phase 4: move the air combat units.
    async function _getActionForPhase4(): Promise<WarAction | null> {   // DONE
        await _checkAndCallLater();

        _candidateUnits     = await _getCandidateUnitsForPhase4();
        const candidateUnit = _popRandomCandidateUnit(_candidateUnits);
        if (!candidateUnit) {
            _candidateUnits = null;
            _phaseCode      = PhaseCode.Phase5;
            return null;
        }

        return await _getActionForMaxScoreWithCandidateUnit(candidateUnit);
    }

    // Phase 5: move the remaining direct units.
    async function _getActionForPhase5(): Promise<WarAction | null> {   // DONE
        await _checkAndCallLater();

        _candidateUnits     = await _getCandidateUnitsForPhase5();
        const candidateUnit = _popRandomCandidateUnit(_candidateUnits);
        if (!candidateUnit) {
            _candidateUnits = null;
            _phaseCode      = PhaseCode.Phase6;
            return null;
        }

        return await _getActionForMaxScoreWithCandidateUnit(candidateUnit);
    }

    // Phase 6: move the other units except the remaining ranged units.
    async function _getActionForPhase6(): Promise<WarAction | null> {   // DONE
        await _checkAndCallLater();

        _candidateUnits     = await _getCandidateUnitsForPhase6();
        const candidateUnit = _popRandomCandidateUnit(_candidateUnits);
        if (!candidateUnit) {
            _candidateUnits = null;
            _phaseCode      = PhaseCode.Phase7;
            return null;
        }

        return await _getActionForMaxScoreWithCandidateUnit(candidateUnit);
    }

    // Phase 7: move the remaining units.
    async function _getActionForPhase7(): Promise<WarAction | null> {   // DONE
        await _checkAndCallLater();

        _candidateUnits     = await _getCandidateUnitsForPhase7();
        const candidateUnit = _popRandomCandidateUnit(_candidateUnits);
        if (!candidateUnit) {
            _candidateUnits = null;
            _phaseCode      = PhaseCode.Phase8;
            return null;
        }

        return await _getActionForMaxScoreWithCandidateUnit(candidateUnit);
    }

    // Phase 8: build units.
    async function _getActionForPhase8(): Promise<WarAction | null> {   // DONE
        await _checkAndCallLater();

        const action = await _getActionPlayerProduceUnitForMaxScore();
        if (!action) {
            _phaseCode = PhaseCode.Phase9;
            return null;
        }

        return action;
    }

    // Phase 9: end turn.
    async function _getActionForPhase9(): Promise<WarAction | null> {   // DONE
        await _checkAndCallLater();

        return { PlayerEndTurn: {} };
    }

    export async function getNextAction(war: ScwWar): Promise<WarAction> {
        if (!_war) {
            _frameBeginTime = Date.now();
            _war            = war;
            _configVersion  = war.getConfigVersion();
            _turnManager    = war.getTurnManager() as ScwTurnManager;
            _playerManager  = war.getPlayerManager() as ScwPlayerManager;
            _unitMap        = war.getUnitMap() as ScwUnitMap;
            _tileMap        = war.getTileMap() as ScwTileMap;
            _mapSize        = _tileMap.getMapSize();
            _phaseCode      = PhaseCode.Phase0;
            _unitValues     = _getUnitValues();
            _unitValueRatio = _getUnitValueRatio();
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

        action.actionId = _war.getNextActionId();
        _clearVariables();
        return action;
    }
}
