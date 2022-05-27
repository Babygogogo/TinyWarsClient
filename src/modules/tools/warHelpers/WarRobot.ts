
// import TwnsClientErrorCode  from "../helpers/ClientErrorCode";
// import CommonConstants      from "../helpers/CommonConstants";
// import ConfigManager        from "../helpers/ConfigManager";
// import GridIndexHelpers     from "../helpers/GridIndexHelpers";
// import Helpers              from "../helpers/Helpers";
// import Types                from "../helpers/Types";
// import ProtoTypes           from "../proto/ProtoTypes";
// import WarDamageCalculator  from "./WarDamageCalculator";
// import WarCommonHelpers     from "./WarCommonHelpers";
// import TwnsBwTile           from "../../baseWar/model/BwTile";
// import TwnsBwUnit           from "../../baseWar/model/BwUnit";
// import WarVisibilityHelpers from "./WarVisibilityHelpers";
// import TwnsBwWar            from "../../baseWar/model/BwWar";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.WarHelpers.WarRobot {
    import IWarActionContainer  = CommonProto.WarAction.IWarActionContainer;
    import WeaponType           = Types.WeaponType;
    import GridIndex            = Types.GridIndex;
    import MovableArea          = Types.MovableArea;
    import MovePathNode         = Types.MovePathNode;
    import UnitActionState      = Types.UnitActionState;
    import UnitAiMode           = Types.UnitAiMode;
    import CoSkillType          = Types.CoSkillType;
    import BwUnit               = BaseWar.BwUnit;
    import BwTile               = BaseWar.BwTile;
    import BwWar                = BaseWar.BwWar;

    type AttackInfo = {
        baseDamage      : number | null | undefined;
        normalizedHp    : number;
        fuel            : number;
        luckValue       : number;
    };
    type ScoreAndAction = {
        score   : number;
        action  : IWarActionContainer;
    };
    type DamageMapData = {
        max             : number;
        directTotal     : number;
        indirectTotal   : number;
    };
    type UnitsInfo = {
        value           : number;
        allCountOnMap   : number;
        idleCountOnMap  : number;
    };
    type CommonParams = {
        war                     : BwWar;
        playerIndexInTurn       : number;
        mapSize                 : Types.MapSize;
        unitsInfoDict           : Map<number, UnitsInfo>;
        unitValueRatio          : number;
        visibleUnits            : Set<BwUnit>;
        globalOffenseBonuses    : Map<number, number>;
        globalDefenseBonuses    : Map<number, number>;
        luckValues              : Map<number, number>;
        bestScoreAndActionDict  : Map<BwUnit, ScoreAndAction>;
        getCachedMoveCost       : (unit: BwUnit, tile: BwTile) => number | null;
        // getAndTickRandomInteger : () => number;
    };

    const _IS_NEED_VISIBILITY = true;
    // const _DISTANCE_SCORE_SCALERS: { [tileType: number]: number } = {
    //     [TileType.Airport]      : 1.2,
    //     [TileType.City]         : 1.1,
    //     [TileType.CommandTower] : 1.25,
    //     [TileType.Factory]      : 1.3,
    //     [TileType.Headquarters] : 1.35,
    //     [TileType.Radar]        : 1.1,
    //     [TileType.Seaport]      : 1.15,
    // };

    const _calculatingWars = new Set<BwWar>();

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Helpers.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    async function getCommonParams(war: BwWar): Promise<CommonParams> {
        await Helpers.checkAndCallLater();

        const playerIndexInTurn     = war.getPlayerIndexInTurn();
        const unitsInfoDict         = await getUnitsInfoDict(war);
        // const randomNumberManager   = war.getRandomNumberManager();
        // const isNeedSeedRandom      = randomNumberManager.getIsNeedSeedRandom();
        // const getRandomIntegerArray = Helpers.createLazyFunc(() => {
        //     return randomNumberManager.getSeedRandomCurrentState().S ?? [];
        // });
        // let randomIndex             = 0;
        const moveCostDict          = new Map<BwUnit, Map<BwTile, number | null>>();
        return {
            war,
            playerIndexInTurn,
            mapSize                 : war.getTileMap().getMapSize(),
            unitsInfoDict,
            unitValueRatio          : await getUnitValueRatio(war, unitsInfoDict, playerIndexInTurn),
            visibleUnits            : WarHelpers.WarVisibilityHelpers.getAllUnitsOnMapVisibleToTeams(war, new Set([war.getPlayer(playerIndexInTurn).getTeamIndex()])),
            globalOffenseBonuses    : await getGlobalOffenseBonuses(war),
            globalDefenseBonuses    : await getGlobalDefenseBonuses(war),
            luckValues              : await getLuckValues(war),
            bestScoreAndActionDict  : new Map(),
            // getAndTickRandomInteger : () => {
            //     if (!isNeedSeedRandom) {
            //         return Math.floor(Math.random() * 256);
            //     }

            //     const array     = getRandomIntegerArray();
            //     const length    = array.length;
            //     if (!length) {
            //         return 0;
            //     } else {
            //         const integer   = array[randomIndex];
            //         randomIndex     = (randomIndex + 1) % length;
            //         return integer;
            //     }
            // },
            getCachedMoveCost       : (unit, tile) => {
                if (!moveCostDict.has(unit)) {
                    moveCostDict.set(unit, new Map());
                }

                const subMap = Helpers.getExisted(moveCostDict.get(unit), ClientErrorCode.SpwRobot_GetCachedMoveCost_00);
                if (!subMap.has(tile)) {
                    subMap.set(tile, tile.getMoveCostByUnit(unit));
                }

                return subMap.get(tile) ?? null;
            },
        };
    }

    async function getUnitsInfoDict(war: BwWar): Promise<Map<number, UnitsInfo>> {
        await Helpers.checkAndCallLater();

        const unitsInfoDict = new Map<number, UnitsInfo>();
        for (const unit of war.getUnitMap().getAllUnits()) {
            const playerIndex   = unit.getPlayerIndex();
            const value         = unit.getProductionCfgCost() * unit.getNormalizedCurrentHp() / unit.getNormalizedMaxHp();
            const isOnMap       = unit.getLoaderUnitId() == null;
            const isIdle        = unit.getActionState() === UnitActionState.Idle;

            if (!unitsInfoDict.has(playerIndex)) {
                unitsInfoDict.set(playerIndex, {
                    value,
                    allCountOnMap   : isOnMap ? 1 : 0,
                    idleCountOnMap  : isOnMap && isIdle ? 1 : 0,
                });
            } else {
                const info          = Helpers.getExisted(unitsInfoDict.get(playerIndex), ClientErrorCode.SpwRobot_GetUnitsInfoDict_00);
                info.value          += value;
                info.allCountOnMap  += isOnMap ? 1 : 0;
                info.idleCountOnMap += isOnMap && isIdle ? 1 : 0;
            }
        }
        for (const [playerIndex] of war.getPlayerManager().getAllPlayersDict()) {
            if (!unitsInfoDict.has(playerIndex)) {
                unitsInfoDict.set(playerIndex, {
                    value           : 0,
                    allCountOnMap   : 0,
                    idleCountOnMap  : 0,
                });
            }
        }

        return unitsInfoDict;
    }

    async function getUnitValueRatio(war: BwWar, unitsInfoDict: Map<number, UnitsInfo>, playerIndexInTurn: number): Promise<number> {
        await Helpers.checkAndCallLater();

        const playerManager = war.getPlayerManager();
        const playerInTurn  = playerManager.getPlayer(playerIndexInTurn);
        const selfTeamIndex = playerInTurn.getTeamIndex();
        let selfValue       = 0;
        let enemyValue      = 0;
        for (const [playerIndex, { value }] of unitsInfoDict) {
            const player    = playerManager.getPlayer(playerIndex);
            const teamIndex = player.getTeamIndex();
            if (teamIndex === selfTeamIndex) {
                selfValue += value;
            } else {
                enemyValue += value;
            }
        }
        return enemyValue > 0 ? selfValue / enemyValue : 1;
    }

    async function getGlobalOffenseBonuses(war: BwWar): Promise<Map<number, number>> {
        await Helpers.checkAndCallLater();

        const globalOffenseBonuses  = new Map<number, number>();
        const commonSettingManager  = war.getCommonSettingManager();
        for (const player of war.getPlayerManager().getAllPlayers()) {
            const playerIndex = player.getPlayerIndex();
            if (playerIndex === CommonConstants.PlayerIndex.Neutral) {
                continue;
            }

            const modifier = commonSettingManager.getSettingsAttackPowerModifier(playerIndex);
            globalOffenseBonuses.set(playerIndex, modifier);
        }

        for (const tile of war.getTileMap().getAllTiles()) {
            const playerIndex = tile.getPlayerIndex();
            if (playerIndex === CommonConstants.PlayerIndex.Neutral) {
                continue;
            }

            const bonus = tile.getGlobalAttackBonus();
            if (bonus == null) {
                continue;
            }

            const currentBonus = Helpers.getExisted(globalOffenseBonuses.get(playerIndex), ClientErrorCode.SpwRobot_GetGlobalOffenseBonuses_00);
            globalOffenseBonuses.set(playerIndex, currentBonus + bonus);
        }

        return globalOffenseBonuses;
    }

    async function getGlobalDefenseBonuses(war: BwWar): Promise<Map<number, number>> {
        await Helpers.checkAndCallLater();

        const globalDefenseBonuses = new Map<number, number>();
        for (let playerIndex = war.getPlayerManager().getTotalPlayersCount(false); playerIndex > CommonConstants.PlayerIndex.Neutral; --playerIndex) {
            globalDefenseBonuses.set(playerIndex, 0);
        }

        for (const tile of war.getTileMap().getAllTiles()) {
            const playerIndex = tile.getPlayerIndex();
            if (playerIndex === CommonConstants.PlayerIndex.Neutral) {
                continue;
            }

            const bonus = tile.getGlobalDefenseBonus();
            if (bonus == null) {
                continue;
            }

            const currentBonus = Helpers.getExisted(globalDefenseBonuses.get(playerIndex), ClientErrorCode.SpwRobot_GetGlobalDefenseBonuses_00);
            globalDefenseBonuses.set(playerIndex, currentBonus + bonus);
        }

        return globalDefenseBonuses;
    }

    async function getLuckValues(war: BwWar): Promise<Map<number, number>> {
        await Helpers.checkAndCallLater();

        const luckValues            = new Map<number, number>();
        const commonSettingManager  = war.getCommonSettingManager();
        for (let playerIndex = war.getPlayerManager().getTotalPlayersCount(false); playerIndex > CommonConstants.PlayerIndex.Neutral; --playerIndex) {
            const upperLimit = commonSettingManager.getSettingsLuckUpperLimit(playerIndex);
            const lowerLimit = commonSettingManager.getSettingsLuckLowerLimit(playerIndex);
            luckValues.set(playerIndex, (upperLimit + lowerLimit) / 2);
        }

        return luckValues;
    }

    async function checkCanUnitWaitOnGrid(commonParams: CommonParams, unit: BwUnit, gridIndex: GridIndex): Promise<boolean> {
        await Helpers.checkAndCallLater();

        const unitGridIndex = unit.getGridIndex();
        return (GridIndexHelpers.checkIsEqual(unitGridIndex, gridIndex))
            ? (unit.getLoaderUnitId() == null)
            : (!commonParams.war.getUnitMap().getUnitOnMap(gridIndex));
    }

    function getBetterScoreAndAction(data1: ScoreAndAction | null | undefined, data2: ScoreAndAction, commonParams: CommonParams): ScoreAndAction {
        if (data1 == null) {
            return data2;
        } else {
            const score1 = data1.score;
            const score2 = data2.score;
            if (score1 !== score2) {
                return score1 > score2 ? data1 : data2;
            } else {
                // return commonParams.getAndTickRandomInteger() % 2 === 0 ? data1 : data2;
                return commonParams.war.getExecutedActionManager().getExecutedActionsCount() % 2 === 0 ? data1 : data2;
            }
        }
    }
    function getBestScoreAndAction(dataArray: (ScoreAndAction | null)[], commonParams: CommonParams): ScoreAndAction | null {
        let bestData: ScoreAndAction | null = null;
        for (const newData of dataArray) {
            if (newData != null) {
                bestData = getBetterScoreAndAction(bestData, newData, commonParams);
            }
        }
        return bestData;
    }

    async function getReachableArea({ commonParams, unit, passableGridIndex, blockedGridIndex }: {
        commonParams        : CommonParams;
        unit                : BwUnit;
        passableGridIndex   : GridIndex | null;
        blockedGridIndex    : GridIndex | null;
    }): Promise<MovableArea> {
        await Helpers.checkAndCallLater();

        const moveRange         = unit.getFinalMoveRange();
        const currentFuel       = unit.getCurrentFuel();
        const unitGridIndex     = unit.getGridIndex();
        const { war, mapSize }  = commonParams;
        const unitMap           = war.getUnitMap();
        const tileMap           = war.getTileMap();
        return WarHelpers.WarCommonHelpers.createMovableArea({
            origin          : unitGridIndex,
            maxMoveCost     : Math.min(moveRange, currentFuel),
            mapSize,
            moveCostGetter  : gridIndex => {
                const tile = tileMap.getTile(gridIndex);
                if ((!GridIndexHelpers.checkIsInsideMap(gridIndex, mapSize))                            ||
                    ((blockedGridIndex) && (GridIndexHelpers.checkIsEqual(gridIndex, blockedGridIndex)))
                ) {
                    return null;
                } else {
                    if ((passableGridIndex) && (GridIndexHelpers.checkIsEqual(gridIndex, passableGridIndex))) {
                        return commonParams.getCachedMoveCost(unit, tile);
                    } else {
                        const existingUnit = unitMap.getUnitOnMap(gridIndex);
                        if ((existingUnit) && (existingUnit.getTeamIndex() != unit.getTeamIndex())) {
                            return null;
                        } else {
                            return commonParams.getCachedMoveCost(unit, tile);
                        }
                    }
                }
            }
        });
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Generators for score map for distance to the nearest capturable tile.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // async function _createScoreMapForDistance(unit: BwUnit): Promise<number[][] | null> {
    //     await _checkAndCallLater();

    //     const tileMap = war.getTileMap();
    //     const nearestCapturableTile = BwHelpers.findNearestCapturableTile(tileMap, war.getUnitMap(), unit);
    //     if (!nearestCapturableTile) {
    //         return null;
    //     }

    //     const { distanceMap, maxDistance }  = BwHelpers.createDistanceMap(tileMap, unit, nearestCapturableTile.getGridIndex());
    //     const mapSize                       = tileMap.getMapSize();
    //     const scoreForUnmovableGrid         = -10 * (maxDistance + 1);
    //     for (let x = 0; x < mapSize.width; ++x) {
    //         for (let y = 0; y < mapSize.height; ++y) {
    //             distanceMap[x][y] = distanceMap[x][y] != null ? distanceMap[x][y] * -10 : scoreForUnmovableGrid;
    //         }
    //     }

    //     return distanceMap;
    // }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Damage map generators.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    async function getAttackInfo(commonParams: CommonParams, attacker: BwUnit, targetUnit: BwUnit): Promise<AttackInfo> {
        await Helpers.checkAndCallLater();

        const attackerGridIndex             = attacker.getGridIndex();
        const attackerPlayerIndex           = attacker.getPlayerIndex();
        const luckValue                     = Helpers.getExisted(commonParams.luckValues.get(attackerPlayerIndex), ClientErrorCode.SpwRobot_GetAttackInfo_00);
        const targetArmorType               = targetUnit.getArmorType();
        const attackerCurrentHp             = attacker.getCurrentHp();
        const attackerMaxFuel               = attacker.getMaxFuel();
        const attackerCurrentFuel           = attacker.getCurrentFuel();
        const { war, mapSize }              = commonParams;
        const unitMap                       = war.getUnitMap();
        const attackerNormalizedCurrentHp   = WarHelpers.WarCommonHelpers.getNormalizedHp(attackerCurrentHp);
        const baseDamageWithAmmo            = attacker.getCfgBaseDamage(targetArmorType, attacker.checkHasPrimaryWeapon() ? WeaponType.Primary : WeaponType.Secondary);
        const baseDamageForCurrentAmmo      = attacker.getBaseDamage(targetArmorType);
        const loaderUnitId                  = attacker.getLoaderUnitId();

        if (loaderUnitId == null) {
            const tile          = war.getTileMap().getTile(attackerGridIndex);
            const repairInfo    = tile.getRepairHpAndCostForUnit(attacker);
            if (repairInfo) {
                return {
                    baseDamage  : baseDamageWithAmmo,
                    normalizedHp: WarHelpers.WarCommonHelpers.getNormalizedHp(attackerCurrentHp + repairInfo.hp),
                    fuel        : attackerMaxFuel,
                    luckValue,
                };
            } else {
                if ((tile.checkCanSupplyUnit(attacker))                                             ||
                    (GridIndexHelpers.getAdjacentGrids(attackerGridIndex, mapSize).some(g => {
                        const supplier = unitMap.getUnitOnMap(g);
                        return (!!supplier) && (supplier.checkCanSupplyAdjacentUnit(attacker));
                    }))
                ) {
                    return {
                        baseDamage  : baseDamageWithAmmo,
                        normalizedHp: attackerNormalizedCurrentHp,
                        fuel        : attackerMaxFuel,
                        luckValue,
                    };
                } else {
                    return {
                        baseDamage  : baseDamageForCurrentAmmo,
                        normalizedHp: attackerNormalizedCurrentHp,
                        fuel        : attackerCurrentFuel,
                        luckValue,
                    };
                }
            }

        } else {
            const loaderUnit = unitMap.getUnitOnMap(attackerGridIndex);
            if ((loaderUnit == null) || (loaderUnit === attacker)) {
                throw Helpers.newError(`Invalid loaderUnit.`, ClientErrorCode.SpwRobot_GetAttackInfo_01);
            }

            if ((!attacker.checkCanAttackAfterMove())       ||
                (loaderUnit.getUnitId() !== loaderUnitId)   ||
                (!loaderUnit.checkCanLaunchLoadedUnit())
            ) {
                return {
                    baseDamage  : null,
                    normalizedHp: attackerNormalizedCurrentHp,
                    fuel        : attackerCurrentFuel,
                    luckValue,
                };
            } else {
                const repairInfo = loaderUnit.getRepairHpAndCostForLoadedUnit(attacker);
                if (repairInfo) {
                    return {
                        baseDamage  : baseDamageWithAmmo,
                        normalizedHp: WarHelpers.WarCommonHelpers.getNormalizedHp(attackerCurrentHp + repairInfo.hp),
                        fuel        : attackerMaxFuel,
                        luckValue,
                    };
                } else {
                    if (loaderUnit.checkCanSupplyLoadedUnit()) {
                        return {
                            baseDamage  : baseDamageWithAmmo,
                            normalizedHp: attackerNormalizedCurrentHp,
                            fuel        : attackerMaxFuel,
                            luckValue,
                        };
                    } else {
                        return {
                            baseDamage  : baseDamageForCurrentAmmo,
                            normalizedHp: attackerNormalizedCurrentHp,
                            fuel        : attackerCurrentFuel,
                            luckValue,
                        };
                    }
                }
            }
        }
    }

    async function createDamageMap(commonParams: CommonParams, targetUnit: BwUnit, isDiving: boolean): Promise<DamageMapData[][]> {
        await Helpers.checkAndCallLater();

        const targetPlayerIndex                         = targetUnit.getPlayerIndex();
        const globalDefenseBonus                        = Helpers.getExisted(commonParams.globalDefenseBonuses.get(targetPlayerIndex), ClientErrorCode.SpwRobot_CreateDamageMap_00);
        const { war, mapSize, globalOffenseBonuses }    = commonParams;
        const { width: mapWidth, height: mapHeight }    = mapSize;
        const unitMap                                   = war.getUnitMap();
        const tileMap                                   = war.getTileMap();
        const damageMap                                 = Helpers.createEmptyMap<DamageMapData>(mapWidth);
        const targetTeamIndex                           = targetUnit.getTeamIndex();

        for (const attacker of unitMap.getAllUnits()) {
            await Helpers.checkAndCallLater();

            const beginningGridIndex        = attacker.getGridIndex();
            const attackerPlayerIndex       = attacker.getPlayerIndex();
            const globalOffenseBonus        = Helpers.getExisted(globalOffenseBonuses.get(attackerPlayerIndex), ClientErrorCode.SpwRobot_CreateDamageMap_01);
            const promotionAttackBonus      = attacker.getPromotionAttackBonus();
            const attackerFinalMoveRange    = attacker.getFinalMoveRange();
            const minAttackRange            = attacker.getMinAttackRange();
            const maxAttackRange            = attacker.getFinalMaxAttackRange();
            const attackerTeamIndex         = attacker.getTeamIndex();
            if ((minAttackRange == null)                                ||
                (maxAttackRange == null)                                ||
                (attackerTeamIndex === targetTeamIndex)                 ||
                ((isDiving) && (!attacker.checkCanAttackDivingUnits()))
            ) {
                continue;
            }

            const attackInfo                                    = await getAttackInfo(commonParams, attacker, targetUnit);
            const { baseDamage, fuel, normalizedHp, luckValue } = attackInfo;
            if (baseDamage == null) {
                continue;
            }

            await Helpers.checkAndCallLater();
            const movableArea = WarHelpers.WarCommonHelpers.createMovableArea({
                origin          : beginningGridIndex,
                maxMoveCost     : Math.min(attackerFinalMoveRange, fuel),
                mapSize,
                moveCostGetter  : gridIndex => {
                    if (!GridIndexHelpers.checkIsInsideMap(gridIndex, mapSize)) {
                        return null;
                    } else {
                        const existingUnit = unitMap.getUnitOnMap(gridIndex);
                        if ((existingUnit) && (existingUnit !== targetUnit) && (existingUnit.getTeamIndex() != attackerTeamIndex)) {
                            return null;
                        } else {
                            return commonParams.getCachedMoveCost(attacker, tileMap.getTile(gridIndex));
                        }
                    }
                },
            });

            await Helpers.checkAndCallLater();
            const attackableArea = WarHelpers.WarCommonHelpers.createAttackableAreaForUnit({
                movableArea,
                mapSize,
                minAttackRange,
                maxAttackRange,
                checkCanAttack: (moveGridIndex: GridIndex): boolean => {
                    const hasMoved = !GridIndexHelpers.checkIsEqual(moveGridIndex, beginningGridIndex);
                    return ((attacker.getLoaderUnitId() == null) || (hasMoved))
                        && ((attacker.checkCanAttackAfterMove()) || (!hasMoved));
                }
            });

            await Helpers.checkAndCallLater();
            const attackBonus = globalOffenseBonus + promotionAttackBonus;
            for (let x = 0; x < mapWidth; ++x) {
                const column = attackableArea[x];
                if (column == null) {
                    continue;
                }

                for (let y = 0; y < mapHeight; ++y) {
                    const attackableGridData = column[y];
                    if (attackableGridData == null) {
                        continue;
                    }

                    const targetGridIndex   : GridIndex = { x, y };
                    const isDirect          = GridIndexHelpers.getDistance(attackableGridData.movePathDestination, targetGridIndex) <= 1;
                    const damage            = Math.floor(
                        (baseDamage * Math.max(0, 1 + attackBonus / 100) + luckValue)
                        * normalizedHp
                        * WarHelpers.WarDamageCalculator.getDamageMultiplierForDefenseBonus(globalDefenseBonus + tileMap.getTile(targetGridIndex).getDefenseAmountForUnit(targetUnit) + targetUnit.getPromotionDefenseBonus())
                        / CommonConstants.UnitHpNormalizer
                    );
                    if (!damageMap[x][y]) {
                        damageMap[x][y] = {
                            max             : damage,
                            directTotal     : isDirect ? damage : 0,
                            indirectTotal   : isDirect ? 0 : damage,
                        };
                    } else {
                        const damageGridData    = damageMap[x][y];
                        damageGridData.max      = Math.max(damageGridData.max, damage);
                        if (isDirect) {
                            damageGridData.directTotal += damage;
                        } else {
                            damageGridData.indirectTotal += damage;
                        }
                    }
                }
            }
        }

        return damageMap;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Candidate units generators.
    ////////////////////////////////////////////////////////////////////////////////////////////////////

    // async function _getCandidateUnitsForPhase1a(commonParams: CommonParams): Promise<BwUnit[]> {
    //     await Helpers.checkAndCallLater();

    //     const { war, playerIndexInTurn }    = commonParams;
    //     const units                         : BwUnit[] = [];
    //     war.getUnitMap().forEachUnit((unit: BwUnit) => {
    //         if ((unit.getPlayerIndex() === playerIndexInTurn)   &&
    //             (unit.getActionState() === UnitActionState.Idle)
    //         ) {
    //             units.push(unit);
    //         }
    //     });
    //     return units;
    // }

    // async function _getCandidateUnitsForPhase4(commonParams: CommonParams): Promise<BwUnit[]> {
    //     await Helpers.checkAndCallLater();

    //     const { war, playerIndexInTurn }    = commonParams;
    //     const units                         : BwUnit[] = [];
    //     const configVersion                 = war.getConfigVersion();
    //     war.getUnitMap().forEachUnitOnMap((unit: BwUnit) => {
    //         if ((unit.getPlayerIndex() === playerIndexInTurn)                                                   &&
    //             (unit.getActionState() === UnitActionState.Idle)                                                &&
    //             (unit.getMinAttackRange())                                                                      &&
    //             (ConfigManager.checkIsUnitTypeInCategory(configVersion, unit.getUnitType(), Types.UnitCategory.Air))
    //         ) {
    //             units.push(unit);
    //         }
    //     });

    //     return units;
    // }

    // async function _getCandidateUnitsForPhase5(): Promise<BwUnit[]> {
    //     await Helpers.checkAndCallLater();

    //     const units             : BwUnit[] = [];
    //     const playerIndexInturn = war.getTurnManager().getPlayerIndexInTurn();
    //     war.getUnitMap().forEachUnitOnMap((unit: BwUnit) => {
    //         if ((unit.getPlayerIndex() === playerIndexInturn)   &&
    //             (unit.getActionState() === UnitActionState.Idle)            &&
    //             (unit.getFinalMaxAttackRange() === 1)
    //         ) {
    //             units.push(unit);
    //         }
    //     });

    //     return units;
    // }

    // async function _getCandidateUnitsForPhase6(): Promise<BwUnit[]> {
    //     await Helpers.checkAndCallLater();

    //     const units             : BwUnit[] = [];
    //     const playerIndexInturn = war.getTurnManager().getPlayerIndexInTurn();
    //     war.getUnitMap().forEachUnitOnMap((unit: BwUnit) => {
    //         if ((unit.getPlayerIndex() === playerIndexInturn) && (unit.getActionState() === UnitActionState.Idle)) {
    //             const maxRange = unit.getFinalMaxAttackRange();
    //             if ((!maxRange) || (maxRange === 1)) {
    //                 units.push(unit);
    //             }
    //         }
    //     });

    //     return units;
    // }

    // async function _getCandidateUnitsForPhase7(commonParams: CommonParams): Promise<BwUnit[]> {
    //     await Helpers.checkAndCallLater();

    //     const { war, playerIndexInTurn }    = commonParams;
    //     const units                         : BwUnit[] = [];
    //     war.getUnitMap().forEachUnitOnMap((unit: BwUnit) => {
    //         if ((unit.getPlayerIndex() === playerIndexInTurn) && (unit.getActionState() === UnitActionState.Idle)) {
    //             units.push(unit);

    //             if (unit.checkCanLaunchLoadedUnit()) {
    //                 for (const loadedUnit of unit.getLoadedUnits()) {
    //                     if (loadedUnit.getActionState() === UnitActionState.Idle) {
    //                         units.push(loadedUnit);
    //                     }
    //                 }
    //             }
    //         }
    //     });

    //     return units;
    // }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Score calculators.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    async function getScoreForBeThreatened(commonParams: CommonParams, unit: BwUnit, gridIndex: GridIndex, damageMap: DamageMapData[][] | null | undefined): Promise<number> {
        // const hp            = unit.getCurrentHp();
        // const data          = damageMap[gridIndex.x][gridIndex.y];
        // const maxDamage     = Math.min(data ? data.max : 0, hp);
        // // const totalDamage   = Math.min(data ? data.total : 0, hp);
        // return - (maxDamage * (maxDamage / 100) + (maxDamage >= hp ? 30 : 0))
        //     * (unit.getProductionFinalCost() / 6000 / Math.max(1, _unitValueRatio))
        //     * (unit.getHasLoadedCo() ? 2 : 1);

        await Helpers.checkAndCallLater();

        const data = damageMap ? damageMap[gridIndex.x][gridIndex.y] : null;
        if (data == null) {
            return 0;
        }

        const scalerForUnitValueRatio   = Math.pow(1 / Math.max(1, commonParams.unitValueRatio), 1);
        const currentHp                 = unit.getCurrentHp();
        const directDamage              = data.directTotal;
        const indirectDamage            = data.indirectTotal;
        const totalDamage               = directDamage + indirectDamage;
        const canBeDestroyed            = totalDamage >= currentHp;
        let score                       = -(totalDamage + (canBeDestroyed ? 30 : 0)) * unit.getProductionCfgCost() / 1000 * scalerForUnitValueRatio * (unit.getHasLoadedCo() ? 2 : 1);
        if (canBeDestroyed) {
            for (const loadedUnit of commonParams.war.getUnitMap().getUnitsLoadedByLoader(unit, true)) {
                score += -(loadedUnit.getCurrentHp() + 30) * loadedUnit.getProductionCfgCost() / 1000 * scalerForUnitValueRatio * (loadedUnit.getHasLoadedCo() ? 2 : 1);
            }
        }

        return score;
    }

    async function getScoreForThreatEnemies(commonParams: CommonParams, attackerUnit: BwUnit, gridIndex: GridIndex, scoreDictForThreatEnemy: Map<BwUnit, number>): Promise<number> {
        await Helpers.checkAndCallLater();

        const war           = commonParams.war;
        const unitMap       = war.getUnitMap();
        const loaderUnit    = unitMap.getUnitOnMap(gridIndex);
        if ((loaderUnit)                                                &&
            (loaderUnit.getUnitType() !== attackerUnit.getUnitType())   &&
            (!loaderUnit.checkCanLaunchLoadedUnit())
        ) {
            return 0;
        }

        const mapSize           = commonParams.mapSize;
        const tileMap           = war.getTileMap();
        const attackerTeamIndex = attackerUnit.getTeamIndex();

        await Helpers.checkAndCallLater();
        const movableArea = WarHelpers.WarCommonHelpers.createMovableArea({
            origin          : gridIndex,
            maxMoveCost     : attackerUnit.getFinalMoveRange(),
            mapSize,
            moveCostGetter  : g => {
                if (!GridIndexHelpers.checkIsInsideMap(g, mapSize)) {
                    return null;
                } else {
                    // const existingUnit = unitMap.getUnitOnMap(g);
                    // if ((existingUnit) && (existingUnit.getTeamIndex() != attackerTeamIndex)) {
                    //     return null;
                    // } else {
                    //     return commonParams.getCachedMoveCost(attackerUnit, tileMap.getTile(g));
                    // }
                    return commonParams.getCachedMoveCost(attackerUnit, tileMap.getTile(g));
                }
            },
        });

        await Helpers.checkAndCallLater();
        const attackableArea = WarHelpers.WarCommonHelpers.createAttackableAreaForUnit({
            movableArea,
            mapSize,
            minAttackRange  : attackerUnit.getMinAttackRange(),
            maxAttackRange  : attackerUnit.getFinalMaxAttackRange(),
            checkCanAttack  : (moveGridIndex: GridIndex): boolean => {
                const hasMoved = !GridIndexHelpers.checkIsEqual(moveGridIndex, gridIndex);
                return ((attackerUnit.checkCanAttackAfterMove()) || (!hasMoved));
            }
        });

        await Helpers.checkAndCallLater();
        const scalerForUnitValueRatio   = Math.pow(Math.max(1, commonParams.unitValueRatio), 1);
        const mapWidth                  = mapSize.width;
        const mapHeight                 = mapSize.height;
        const normalizedHp              = attackerUnit.getNormalizedCurrentHp();
        const attackerPlayerIndex       = attackerUnit.getPlayerIndex();
        const luckValue                 = Helpers.getExisted(commonParams.luckValues.get(attackerPlayerIndex), ClientErrorCode.SpwRobot_GetScoreForThreatEnemies_00);
        const globalOffenseBonus        = Helpers.getExisted(commonParams.globalOffenseBonuses.get(attackerPlayerIndex), ClientErrorCode.SpwRobot_GetScoreForThreatEnemies_01);
        const globalDefenseBonuses      = commonParams.globalDefenseBonuses;
        const attackBonus               = globalOffenseBonus + attackerUnit.getPromotionAttackBonus();
        let totalScore                  = 0;
        for (let x = 0; x < mapWidth; ++x) {
            const column = attackableArea[x];
            if (column == null) {
                continue;
            }

            for (let y = 0; y < mapHeight; ++y) {
                const attackableGridData = column[y];
                if (attackableGridData == null) {
                    continue;
                }

                const targetGridIndex   : GridIndex = { x, y };
                const targetUnit        = unitMap.getUnitOnMap(targetGridIndex);
                if (targetUnit == null) {
                    continue;
                }

                if (scoreDictForThreatEnemy.has(targetUnit)) {
                    totalScore += Helpers.getExisted(scoreDictForThreatEnemy.get(targetUnit), ClientErrorCode.SpwRobot_GetScoreForThreatEnemies_02);
                    continue;
                }

                if (targetUnit.getTeamIndex() === attackerTeamIndex) {
                    scoreDictForThreatEnemy.set(targetUnit, 0);
                    continue;
                }

                const baseDamage = attackerUnit.getBaseDamage(targetUnit.getArmorType());
                if (baseDamage == null) {
                    scoreDictForThreatEnemy.set(targetUnit, 0);
                    continue;
                }

                const globalDefenseBonus    = Helpers.getExisted(globalDefenseBonuses.get(targetUnit.getPlayerIndex()), ClientErrorCode.SpwRobot_GetScoreForThreatEnemies_03);
                const damage                = Math.floor(
                    (baseDamage * Math.max(0, 1 + attackBonus / 100) + luckValue)
                    * normalizedHp
                    * WarHelpers.WarDamageCalculator.getDamageMultiplierForDefenseBonus(globalDefenseBonus + tileMap.getTile(targetGridIndex).getDefenseAmountForUnit(targetUnit) + targetUnit.getPromotionDefenseBonus())
                    / CommonConstants.UnitHpNormalizer
                );
                const canDestroy    = damage >= targetUnit.getCurrentHp();
                let score           = (damage + (canDestroy ? 30 : 0)) * targetUnit.getProductionCfgCost() / 1000 * scalerForUnitValueRatio * (targetUnit.getHasLoadedCo() ? 2 : 1);
                if (canDestroy) {
                    for (const loadedUnit of unitMap.getUnitsLoadedByLoader(targetUnit, true)) {
                        score += -(loadedUnit.getCurrentHp() + 30) * loadedUnit.getProductionCfgCost() / 1000 * scalerForUnitValueRatio * (loadedUnit.getHasLoadedCo() ? 2 : 1);
                    }
                }

                scoreDictForThreatEnemy.set(targetUnit, score);
                totalScore += score;
            }
        }

        return totalScore;
    }

    async function getScoreForDistanceToCapturableBuildings(commonParams: CommonParams, unit: BwUnit, movableArea: MovableArea): Promise<number> {
        await Helpers.checkAndCallLater();

        const { war, mapSize }                          = commonParams;
        const { width: mapWidth, height: mapHeight }    = mapSize;
        const tileMap                                   = war.getTileMap();
        const unitMap                                   = war.getUnitMap();
        const teamIndex                                 = unit.getTeamIndex();
        const distanceArray                             : number[] = [];
        for (let x = 0; x < mapWidth; ++x) {
            if (movableArea[x] == null) {
                continue;
            }

            for (let y = 0; y < mapHeight; ++y) {
                const info = movableArea[x][y];
                if (info == null) {
                    continue;
                }

                const distance      = info.totalMoveCost;
                const gridIndex     : GridIndex = { x, y };
                const tile          = tileMap.getTile(gridIndex);
                const existingUnit  = unitMap.getUnitOnMap(gridIndex);
                if (((tile.getMaxCapturePoint() != null) && (tile.getTeamIndex() !== teamIndex))    ||
                    ((existingUnit != null) && (existingUnit.getTeamIndex() !== teamIndex))
                ) {
                    distanceArray.push(distance);
                }
            }
        }
        distanceArray.sort((v1, v2) => v1 - v2);

        const moveRange = unit.getFinalMoveRange();
        const scaler    = unit.getCurrentHp() * unit.getProductionCfgCost() / 1000 / Math.max(1, commonParams.unitValueRatio) * (unit.getHasLoadedCo() ? 2 : 1);
        let score       = 0;
        for (let i = Math.min(1, distanceArray.length - 1); i >= 0; --i) {
            const distance = distanceArray[i];
            if (distance > 0) {
                score += -(distance + Math.ceil(distance / Math.max(1, moveRange)) * scaler) / (i === 0 ? 1 : 100);
            } else {
                score += unit.checkIsCapturer() ? 0 : ((-scaler - 10) / (i === 0 ? 1 : 100));
            }
        }
        return score;

        // method 2
        // const { war, mapSize }                          = commonParams;
        // const { width: mapWidth, height: mapHeight }    = mapSize;
        // const tileMap                                   = war.getTileMap();
        // const teamIndex                                 = unit.getTeamIndex();
        // const distanceInfoArray                         : { distance: number, scaler: number }[] = [];
        // for (let x = 0; x < mapWidth; ++x) {
        //     if (movableArea[x] == null) {
        //         continue;
        //     }

        //     for (let y = 0; y < mapHeight; ++y) {
        //         const info = movableArea[x][y];
        //         if (info == null) {
        //             continue;
        //         }

        //         const tile          = tileMap.getTile({ x, y });
        //         const tileType      = tile.getType();
        //         const tileTeamIndex = tile.getTeamIndex();
        //         if ((tile.getMaxCapturePoint() != null) &&
        //             (tileTeamIndex !== teamIndex)
        //         ) {
        //             distanceInfoArray.push({
        //                 distance: info.totalMoveCost,
        //                 scaler  : (_DISTANCE_SCORE_SCALERS[tileType] || 1) * (tileTeamIndex === CommonConstants.WarNeutralTeamIndex ? 1.2 : 1),
        //             });
        //         }
        //     }
        // }

        // const tilesCount = distanceInfoArray.length;
        // if (tilesCount <= 0) {
        //     return 0;
        // } else {
        //     const currentHp         = unit.getCurrentHp();
        //     const maxHp             = unit.getMaxHp();
        //     let score               = 0;
        //     let maxDistance         = 0;
        //     for (const distanceInfo of distanceInfoArray) {
        //         const distance  = distanceInfo.distance;
        //         maxDistance     = Math.max(maxDistance, distance);
        //         score           += - Math.pow(distance, 2) * distanceInfo.scaler;
        //     }
        //     return score / tilesCount / (maxDistance || 1) * 2 * unit.getProductionCfgCost() / 1000 / maxHp * currentHp;
        // }


        // method 1
        // const tileMap                                   = war.getTileMap();
        // const { width: mapWidth, height: mapHeight }    = tileMap.getMapSize();
        // const teamIndex                                 = unit.getTeamIndex();
        // let maxScore                                    = Number.MIN_VALUE;
        // for (let x = 0; x < mapWidth; ++x) {
        //     if (movableArea[x]) {
        //         for (let y = 0; y < mapHeight; ++y) {
        //             const info = movableArea[x][y];
        //             if (info) {
        //                 const tile = tileMap.getTile({ x, y });
        //                 if ((tile.getMaxCapturePoint() != null) && (tile.getTeamIndex() !== teamIndex)) {
        //                     maxScore = Math.max(maxScore, - info.totalMoveCost * (_DISTANCE_SCORE_SCALERS[tile.getType()] || 1) * 10);
        //                 }
        //             }
        //         }
        //     }
        // }
        // return maxScore > Number.MIN_VALUE ? maxScore : 0;
    }

    // async function getScoreForDistanceToOtherUnits(commonParams: CommonParams, unit: BwUnit, movableArea: MovableArea): Promise<number> {
    //     await Helpers.checkAndCallLater();

    //     const productionCost                            = unit.getProductionCfgCost();
    //     const maxHp                                     = unit.getMaxHp();
    //     const currentHp                                 = unit.getCurrentHp();
    //     const { war, mapSize }                          = commonParams;
    //     const { width: mapWidth, height: mapHeight }    = mapSize;
    //     const unitMap                                   = war.getUnitMap();
    //     const teamIndex                                 = unit.getTeamIndex();
    //     const distanceArrayForEnemies                   : number[] = [];
    //     const distanceArrayForAllies                    : number[] = [];
    //     for (let x = 0; x < mapWidth; ++x) {
    //         if (movableArea[x] == null) {
    //             continue;
    //         }

    //         for (let y = 0; y < mapHeight; ++y) {
    //             const info = movableArea[x][y];
    //             if (info == null) {
    //                 continue;
    //             }

    //             const otherUnit = unitMap.getUnitOnMap({ x, y });
    //             if ((otherUnit == null) || (otherUnit === unit)) {
    //                 continue;
    //             }

    //             const distance = info.totalMoveCost * (otherUnit.getHasLoadedCo() ? 2 : 1);
    //             if (otherUnit.getTeamIndex() !== teamIndex) {
    //                 distanceArrayForEnemies.push(distance);
    //             } else {
    //                 distanceArrayForAllies.push(distance);
    //             }
    //         }
    //     }

    //     const enemiesCount      = distanceArrayForEnemies.length;
    //     let scoreForEnemies     = 0;
    //     if (enemiesCount > 0) {
    //         let maxDistance     = 0;
    //         let totalDistance1  = 0;
    //         let totalDistance2  = 0;
    //         for (const distance of distanceArrayForEnemies) {
    //             maxDistance     = Math.max(maxDistance, distance);
    //             totalDistance1  += distance;
    //             totalDistance2  += Math.pow(distance, 2);
    //         }
    //         scoreForEnemies = - totalDistance1 * 0.05 - totalDistance2 / enemiesCount / (maxDistance || 1) * 0.2;
    //     }

    //     const alliesCount   = distanceArrayForAllies.length;
    //     let scoreForAllies  = 0;
    //     if (alliesCount > 0) {
    //         let maxDistance     = 0;
    //         let totalDistance1  = 0;
    //         let totalDistance2  = 0;
    //         for (const distance of distanceArrayForAllies) {
    //             maxDistance     = Math.max(maxDistance, distance);
    //             totalDistance1  += distance;
    //             totalDistance2  += Math.pow(distance, 2);
    //         }
    //         scoreForAllies = - totalDistance1 * 0.025 - totalDistance2 / alliesCount / (maxDistance || 1) * 0.1;
    //     }

    //     return (scoreForAllies + scoreForEnemies) * productionCost / maxHp * currentHp / 1000;

    //     // const unitMap                                   = war.getUnitMap();
    //     // const { width: mapWidth, height: mapHeight }    = unitMap.getMapSize();
    //     // const teamIndex                                 = unit.getTeamIndex();
    //     // let maxScoreForEnemies                          = Number.MIN_VALUE;
    //     // let maxScoreForAllies                           = Number.MIN_VALUE;
    //     // for (let x = 0; x < mapWidth; ++x) {
    //     //     if (movableArea[x]) {
    //     //         for (let y = 0; y < mapHeight; ++y) {
    //     //             const info = movableArea[x][y];
    //     //             if (info == null) {
    //     //                 continue;
    //     //             }

    //     //             const otherUnit = unitMap.getUnitOnMap({ x, y });
    //     //             if ((otherUnit == null) || (otherUnit === unit)) {
    //     //                 continue;
    //     //             }

    //     //             const score = - info.totalMoveCost * (otherUnit.getHasLoadedCo() ? 2 : 1);
    //     //             if (otherUnit.getTeamIndex() !== teamIndex) {
    //     //                 maxScoreForEnemies = Math.max(maxScoreForEnemies, score * 0);
    //     //             } else {
    //     //                 maxScoreForAllies = Math.max(maxScoreForAllies, score * 0);
    //     //             }
    //     //         }
    //     //     }
    //     // }
    //     // return (maxScoreForEnemies > Number.MIN_VALUE ? maxScoreForEnemies : 0)
    //     //     + (maxScoreForAllies > Number.MIN_VALUE ? maxScoreForAllies : 0);
    // }

    async function getScoreForPosition({ commonParams, unit, gridIndex, damageMap, scoreDictForThreatEnemy }: {
        commonParams            : CommonParams;
        unit                    : BwUnit;
        gridIndex               : GridIndex;
        damageMap               : DamageMapData[][] | null | undefined;
        scoreDictForThreatEnemy : Map<BwUnit, number>;
    }): Promise<number> {
        await Helpers.checkAndCallLater();

        const [scoreForBeThreatened, scoreForThreatEnemies] = await Promise.all([
            getScoreForBeThreatened(commonParams, unit, gridIndex, damageMap),
            getScoreForThreatEnemies(commonParams, unit, gridIndex, scoreDictForThreatEnemy),
        ]);
        let totalScore          = scoreForBeThreatened + scoreForThreatEnemies;
        const { war, mapSize }  = commonParams;
        const tileMap           = war.getTileMap();
        const tile              = tileMap.getTile(gridIndex);
        const passiveScaler     = unit.getProductionCfgCost() / 1000 / Math.max(1, commonParams.unitValueRatio) * (unit.getHasLoadedCo() ? 2 : 1);
        if (tile.checkCanRepairUnit(unit)) {
            totalScore += (unit.getMaxHp() - unit.getCurrentHp()) * 1 * passiveScaler;
        }

        if (tile.checkCanSupplyUnit(unit)) {
            {
                const maxAmmo = unit.getPrimaryWeaponMaxAmmo();
                if ((maxAmmo) && (unit.checkIsPrimaryWeaponAmmoInShort())) {
                    const currentAmmo   = Helpers.getExisted(unit.getPrimaryWeaponCurrentAmmo(), ClientErrorCode.SpwRobot_GetScoreForPosition_00);
                    totalScore          += ((maxAmmo - currentAmmo) / maxAmmo * 10 + (currentAmmo <= 0 ? 40 : 0)) * passiveScaler;
                }
            }

            if (unit.checkIsFuelInShort()) {
                const maxFuel   = unit.getMaxFuel();
                totalScore      += (maxFuel - unit.getCurrentFuel()) / maxFuel * 10 * (unit.checkIsDestroyedOnOutOfFuel() ? 5 : 1) * passiveScaler;
            }

            if (_IS_NEED_VISIBILITY) {
                const maxAmmo = unit.getFlareMaxAmmo();
                if ((maxAmmo) && (war.getFogMap().checkHasFogCurrently())) {
                    const currentAmmo   = Helpers.getExisted(unit.getFlareCurrentAmmo(), ClientErrorCode.SpwRobot_GetScoreForPosition_01);
                    totalScore          += ((maxAmmo - currentAmmo) / maxAmmo * 10 + (currentAmmo <= 0 ? 40 : 0)) * passiveScaler;
                }
            }
        }

        const unitTeamIndex         = unit.getTeamIndex();
        const tileTeamIndex         = tile.getTeamIndex();
        const aiScoreArrayForStay   = tile.getTemplateCfg().aiScoreForStay;
        if (aiScoreArrayForStay) {
            if (tileTeamIndex === unitTeamIndex) {
                totalScore += aiScoreArrayForStay[0] ?? 0;
            } else if (tileTeamIndex !== CommonConstants.TeamIndex.Neutral) {
                totalScore += aiScoreArrayForStay[1] ?? 0;
            }
        }

        await Helpers.checkAndCallLater();

        const moveType      = unit.getMoveType();
        const movableArea   = WarHelpers.WarCommonHelpers.createMovableArea({
            origin          : gridIndex,
            maxMoveCost     : Number.MAX_SAFE_INTEGER,
            mapSize,
            moveCostGetter  : g => {
                return tileMap.getTile(g).getMoveCostByMoveType(moveType);
            },
        });

        totalScore += await getScoreForDistanceToCapturableBuildings(commonParams, unit, movableArea);
        // totalScore += await getScoreForDistanceToOtherUnits(commonParams, unit, movableArea);

        return totalScore;
    }

    async function getScoreForMovePath(commonParams: CommonParams, movingUnit: BwUnit, movePath: MovePathNode[]): Promise<number> {
        await Helpers.checkAndCallLater();

        if (!_IS_NEED_VISIBILITY) {
            return 0;
        }

        const discoveredUnits = WarHelpers.WarVisibilityHelpers.getDiscoveredUnitsByPath({
            war             : commonParams.war,
            path            : movePath,
            movingUnit,
            isUnitDestroyed : false,
            visibleUnits    : commonParams.visibleUnits,
        });
        let scoreForMovePath = 0;
        for (const unit of discoveredUnits) {
            scoreForMovePath += 1 + unit.getCurrentHp() / unit.getMaxHp() * unit.getProductionCfgCost() / 1000 * (unit.getHasLoadedCo() ? 2 : 1) * 1;
        }

        return scoreForMovePath;
    }

    async function getScoreForActionUnitBeLoaded(commonParams: CommonParams, unit: BwUnit, gridIndex: GridIndex): Promise<number> {
        await Helpers.checkAndCallLater();

        const { war }   = commonParams;
        const loader    = Helpers.getExisted(war.getUnitMap().getUnitOnMap(gridIndex), ClientErrorCode.SpwRobot_GetScoreForActionUnitBeLoaded_00);
        if (!loader.checkCanLoadUnit(unit)) {
            throw Helpers.newError(`Can't load the unit.`, ClientErrorCode.SpwRobot_GetScoreForActionUnitBeLoaded_01);
        }

        const passiveScaler = unit.getProductionCfgCost() / 1000 / Math.max(1, commonParams.unitValueRatio) * (unit.getHasLoadedCo() ? 2 : 1);
        let totalScore      = 0;
        if (loader.getNormalizedRepairHpForLoadedUnit() != null) {
            totalScore += (unit.getMaxHp() - unit.getCurrentHp()) * passiveScaler;
        }

        if (loader.checkCanSupplyLoadedUnit()) {
            {
                const maxAmmo = unit.getPrimaryWeaponMaxAmmo();
                if (maxAmmo) {
                    const currentAmmo   = Helpers.getExisted(unit.getPrimaryWeaponCurrentAmmo(), ClientErrorCode.SpwRobot_GetScoreForActionUnitBeLoaded_02);
                    totalScore          += ((maxAmmo - currentAmmo) / maxAmmo * 10 + (currentAmmo <= 0 ? 40 : 0)) * passiveScaler;
                }
            }

            {
                const maxFuel   = unit.getMaxFuel();
                totalScore      += (maxFuel - unit.getCurrentFuel()) / maxFuel * 10 * (unit.checkIsDestroyedOnOutOfFuel() ? 5 : 1) * passiveScaler;
            }

            if (_IS_NEED_VISIBILITY) {
                const maxAmmo = unit.getFlareMaxAmmo();
                if ((maxAmmo) && (war.getFogMap().checkHasFogCurrently())) {
                    const currentAmmo   = Helpers.getExisted(unit.getFlareCurrentAmmo(), ClientErrorCode.SpwRobot_GetScoreForActionUnitBeLoaded_03);
                    totalScore          += ((maxAmmo - currentAmmo) / maxAmmo * 10 + (currentAmmo <= 0 ? 40 : 0)) * passiveScaler;
                }
            }
        }

        return totalScore;
    }

    async function getScoreForActionUnitJoin(commonParams: CommonParams, unit: BwUnit, gridIndex: GridIndex): Promise<number> {
        await Helpers.checkAndCallLater();

        const { war }       = commonParams;
        const targetUnit    = Helpers.getExisted(war.getUnitMap().getUnitOnMap(gridIndex), ClientErrorCode.SpwRobot_GetScoreForActionUnitJoin_00);
        if (targetUnit.getActionState() === UnitActionState.Idle) {
            return -9999;
        }

        const normalizedMaxHp       = unit.getNormalizedMaxHp();
        const rawNormalizedNewHp    = unit.getNormalizedCurrentHp() + targetUnit.getNormalizedCurrentHp();
        const tile                  = war.getTileMap().getTile(gridIndex);
        const currentCapturePoint   = tile.getCurrentCapturePoint();
        const captureAmount         = targetUnit.getCaptureAmount(gridIndex);
        if ((currentCapturePoint == null)           ||
            (captureAmount == null)                 ||
            (captureAmount >= currentCapturePoint)
        ) {
            return rawNormalizedNewHp > normalizedMaxHp
                ? ((rawNormalizedNewHp - normalizedMaxHp) * (-20))
                : 0;
        }

        return (Math.min(normalizedMaxHp, rawNormalizedNewHp) >= currentCapturePoint)
            ? (tile.getTemplateCfg().aiScoreForCapture ?? 0)
            : 0;
    }

    async function getScoreForActionUnitAttack({ commonParams, focusUnit, focusUnitGridIndex, battleDamageInfoArray }: {
        commonParams            : CommonParams;
        focusUnit               : BwUnit;
        focusUnitGridIndex      : GridIndex;
        battleDamageInfoArray   : CommonProto.Structure.IBattleDamageInfo[];
    }): Promise<number> {
        await Helpers.checkAndCallLater();

        const focusTeamIndex            = focusUnit.getTeamIndex();
        const { war, unitValueRatio }   = commonParams;
        const unitMap                   = war.getUnitMap();
        const tileMap                   = war.getTileMap();
        const unitHpDict                = new Map<BwUnit, number>();
        const tileHpDict                = new Map<BwTile, number>();
        // const scalerForSelfDamage       = Math.pow(1 / Math.max(1, unitValueRatio), 1) * 9999;
        // const scalerForEnemyDamage      = Math.pow(Math.max(1, unitValueRatio), 1) * 9999;
        const scalerForSelfDamage       = Math.pow(1 / Math.max(1, unitValueRatio), 1);
        const scalerForEnemyDamage      = Math.pow(Math.max(1, unitValueRatio), 1) * 3;

        let totalScore = 0;
        for (const battleDamageInfo of battleDamageInfoArray) {
            const damage        = Helpers.getExisted(battleDamageInfo.damage, ClientErrorCode.SpwRobot_GetScoreForActionUnitAttack_00);
            const tileGridIndex = GridIndexHelpers.convertGridIndex(battleDamageInfo.targetTileGridIndex);
            if (tileGridIndex != null) {
                const tile2 = tileMap.getTile(tileGridIndex);
                if (!tileHpDict.has(tile2)) {
                    const tileHp2 = Helpers.getExisted(tile2.getCurrentHp(), ClientErrorCode.SpwRobot_GetScoreForActionUnitAttack_01);
                    tileHpDict.set(tile2, tileHp2);
                }

                const tileHp2           = Helpers.getExisted(tileHpDict.get(tile2), ClientErrorCode.SpwRobot_GetScoreForActionUnitAttack_02);
                const tileTeamIndex2    = tile2.getTeamIndex();
                const actualDamage      = Math.min(tileHp2, damage);
                tileHpDict.set(tile2, tileHp2 - actualDamage);

                totalScore += actualDamage * (tileTeamIndex2 === focusTeamIndex ? -1 : 1);
                continue;
            }

            const unitId2 = battleDamageInfo.targetUnitId;
            if (unitId2 != null) {
                const unit2 = Helpers.getExisted(unitMap.getUnitById(unitId2), ClientErrorCode.SpwRobot_GetScoreForActionUnitAttack_03);
                if (!unitHpDict.has(unit2)) {
                    unitHpDict.set(unit2, unit2.getCurrentHp());
                }

                const unitHp2               = Helpers.getExisted(unitHpDict.get(unit2), ClientErrorCode.SpwRobot_GetScoreForActionUnitAttack_04);
                const unitTeamIndex2        = unit2.getTeamIndex();
                const unitProductionCost2   = unit2.getProductionCfgCost();
                const actualDamage          = Math.min(unitHp2, damage);
                unitHpDict.set(unit2, unitHp2 - actualDamage);

                const isUnitDestroyed   = (actualDamage >= unitHp2) && (actualDamage > 0);
                const isSelfDamaged     = unitTeamIndex2 === focusTeamIndex;
                let score               = (actualDamage + (isUnitDestroyed ? 30 : 0))
                    * unitProductionCost2 / 1000
                    * (isSelfDamaged ? scalerForSelfDamage : scalerForEnemyDamage)
                    * (unit2.getHasLoadedCo() ? 2 : 1);

                {
                    const unitOriginGridIndex2  = unit2.getGridIndex();
                    const gridIndex2            = (unit2 === focusUnit) ? focusUnitGridIndex : unitOriginGridIndex2;
                    if (GridIndexHelpers.checkIsEqual(gridIndex2, unitOriginGridIndex2)) {
                        const tile2 = tileMap.getTile(gridIndex2);
                        if (tile2.getTeamIndex() !== unitTeamIndex2) {
                            const captureAmount = unit2.getCaptureAmount(gridIndex2);
                            const capturePoint  = tile2.getCurrentCapturePoint();
                            if ((captureAmount != null) && (capturePoint != null)) {
                                score *= captureAmount >= capturePoint ? 2 : 1.1;

                                if (tile2.checkIsDefeatOnCapture()) {
                                    score *= 10000;
                                }
                                if (tile2.getCfgProduceUnitCategory()) {
                                    score *= 5;
                                }
                            }
                        }
                    }
                }

                if (isUnitDestroyed) {
                    for (const loadedUnit of unitMap.getUnitsLoadedByLoader(unit2, true)) {
                        score += (loadedUnit.getCurrentHp() + 30)
                            * loadedUnit.getProductionCfgCost() / 1000
                            * (isSelfDamaged ? scalerForSelfDamage : scalerForEnemyDamage)
                            * (loadedUnit.getHasLoadedCo() ? 2 : 1);
                    }
                }

                totalScore += score * (isSelfDamaged ? -1 : 1);
                continue;
            }

            throw Helpers.newError(`Invalid battleDamageInfo.`, ClientErrorCode.SpwRobot_GetScoreForActionUnitAttack_09);
        }

        return totalScore;
    }

    async function getScoreForActionUnitCaptureTile(commonParams: CommonParams, unit: BwUnit, gridIndex: GridIndex): Promise<number> {
        await Helpers.checkAndCallLater();

        const tile                  = commonParams.war.getTileMap().getTile(gridIndex);
        const currentCapturePoint   = Helpers.getExisted(tile.getCurrentCapturePoint(), ClientErrorCode.SpwRobot_GetScoreForActionUnitCaptureTile_00 );
        const captureAmount         = Helpers.getExisted(unit.getCaptureAmount(gridIndex), ClientErrorCode.SpwRobot_GetScoreAndActionUnitCaptureTile_01);
        if (captureAmount >= currentCapturePoint) {
            return 99999999;
        }
        if (captureAmount <= 0) {
            return -99999999;
        }

        const turnsCount = Math.ceil(currentCapturePoint / captureAmount);
        return turnsCount > 2
            ? 1
            : (tile.getTemplateCfg().aiScoreForCapture ?? 0) / turnsCount;
    }

    async function getScoreForActionUnitDive(unit: BwUnit): Promise<number> {
        await Helpers.checkAndCallLater();

        return unit.checkIsFuelInShort() ? -10 : 10;
    }

    async function getScoreForActionUnitDropUnit(unit: BwUnit, dropDestinations: CommonProto.Structure.IDropDestination[]): Promise<number> {
        await Helpers.checkAndCallLater();

        return dropDestinations.length * 100;
    }

    async function getScoreForActionUnitLaunchSilo(commonParams: CommonParams, unitValueMap: number[][], targetGridIndex: GridIndex, siloRadius: number): Promise<number> {
        await Helpers.checkAndCallLater();

        let score = 9999;
        for (const gridIndex of GridIndexHelpers.getGridsWithinDistance({ origin: targetGridIndex, minDistance: 0, maxDistance: siloRadius, mapSize: commonParams.mapSize })) {
            score += unitValueMap[gridIndex.x][gridIndex.y] ?? 0;
        }

        return score;
    }

    async function getScoreForActionUnitLaunchFlare(commonParams: CommonParams, unit: BwUnit, targetGridIndex: GridIndex): Promise<number> {
        await Helpers.checkAndCallLater();

        const flareRadius                       = Helpers.getExisted(unit.getFlareRadius(), ClientErrorCode.SpwRobot_GetScoreForUnitLaunchFlare_00);
        const { war, mapSize, visibleUnits }    = commonParams;
        const unitMap                           = war.getUnitMap();
        let score                               = 0;
        for (const gridIndex of GridIndexHelpers.getGridsWithinDistance({ origin: targetGridIndex, minDistance: 0, maxDistance: flareRadius, mapSize })) {
            const u = unitMap.getUnitOnMap(gridIndex);
            if ((u) && (!u.getIsDiving()) && (!visibleUnits.has(u))) {
                score += 3 + u.getCurrentHp() / u.getMaxHp() * u.getProductionCfgCost() / 1000 * (u.getHasLoadedCo() ? 2 : 1) * 2;
            }
        }

        return score;
    }

    async function getScoreForActionUnitSurface(unit: BwUnit): Promise<number> {
        await Helpers.checkAndCallLater();

        return unit.checkIsFuelInShort() ? 10 : -10;
    }

    async function getScoreForActionUnitWait(): Promise<number> {
        await Helpers.checkAndCallLater();

        // const tile = war.getTileMap().getTile(gridIndex);
        // if ((tile.getMaxCapturePoint()) && (tile.getTeamIndex() !== unit.getTeamIndex())) {
        //     return -20;
        // } else {
        //     return 0;
        // }
        return 0;
    }

    async function getScoreForActionUnitLoadCo(unit: BwUnit): Promise<number> {
        await Helpers.checkAndCallLater();

        let totalScore      = unit.getCurrentHp() * 100;
        const scoreArray    = unit.getGameConfig().getCoBasicCfg(unit.getPlayer().getCoId())?.aiBoardUnitTypeAndScore;
        if (scoreArray == null) {
            totalScore += -20000;
        } else {
            const unitType  = unit.getUnitType();
            let hasFound    = false;
            for (let i = 0; i < scoreArray.length; i += 2) {
                if (scoreArray[i] === unitType) {
                    hasFound    = true;
                    totalScore  += scoreArray[i + 1] ?? -20000;
                    break;
                }
            }

            if (!hasFound) {
                totalScore += -20000;
            }
        }

        return totalScore;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async function getScoreForActionUnitUseCoSkill(unit: BwUnit): Promise<number> {
        await Helpers.checkAndCallLater();

        return 999999999;
    }

    async function getScoreForActionPlayerProduceUnit({ commonParams, producingGridIndex, producingUnitType, getMinTurnsCountForAttack }: {
        commonParams                : CommonParams;
        producingGridIndex          : GridIndex;
        producingUnitType           : number;
        getMinTurnsCountForAttack   : (attackerUnit: BwUnit, targetGridIndex: GridIndex) => Promise<number | null>;
    }): Promise<number | null> {
        await Helpers.checkAndCallLater();

        const war       = commonParams.war;
        const tileMap   = war.getTileMap();
        let score       = (war.getGameConfig().getUnitTemplateCfg(producingUnitType)?.aiProductionScore ?? [])[war.getFogMap().checkHasFogCurrently() ? 1 : 0];
        if ((score == null) || (score <= -999999)) {
            return null;
        }

        const playerIndexInTurn = commonParams.playerIndexInTurn;
        const gameConfig        = war.getGameConfig();
        const player            = war.getPlayerManager().getPlayer(playerIndexInTurn);
        const producingUnit     = new BwUnit();
        producingUnit.init({
            unitId      : 0,
            unitType    : producingUnitType,
            gridIndex   : producingGridIndex,
            playerIndex : playerIndexInTurn,
        }, gameConfig);
        producingUnit.startRunning(war);

        const productionCost    = producingUnit.getProductionFinalCost();
        const restFund          = player.getFund() - productionCost;
        if (restFund < 0) {
            return null;
        }

        const producingTeamIndex            = producingUnit.getTeamIndex();
        const producingUnitCurrentHp        = producingUnit.getCurrentHp();
        const producingUnitMaxAttackRange   = producingUnit.getFinalMaxAttackRange();
        const producingUnitMoveRange        = producingUnit.getFinalMoveRange();
        const mapSize                       = tileMap.getMapSize();
        const unitValueRatio                = commonParams.unitValueRatio;
        const getProducingUnitMovableArea   = Helpers.createLazyFunc(() => {
            return WarHelpers.WarCommonHelpers.createMovableArea({
                origin          : producingGridIndex,
                maxMoveCost     : Number.MAX_SAFE_INTEGER,
                mapSize,
                moveCostGetter  : g => {
                    return commonParams.getCachedMoveCost(producingUnit, tileMap.getTile(g));
                },
            });
        });
        let canAttack       = false;
        let hasEnemyUnit    = false;
        for (const unit of war.getUnitMap().getAllUnits()) {
            const unitCurrentHp = unit.getCurrentHp();
            if (unit.getTeamIndex() !== producingTeamIndex) {
                hasEnemyUnit = true;
            } else {
                if (unit.getUnitType() === producingUnitType) {
                    score += -unitCurrentHp * productionCost / 1000;
                }

                continue;
            }

            const unitGridIndex = unit.getGridIndex();
            if (producingUnitMaxAttackRange) {
                const baseDamage = producingUnit.getBaseDamage(unit.getArmorType());
                if (baseDamage != null) {
                    const movableArea = getProducingUnitMovableArea();
                    const minDistance = Helpers.getNonNullElements(GridIndexHelpers.getGridsWithinDistance(
                        { origin: unitGridIndex, minDistance: 0, maxDistance: producingUnitMaxAttackRange, mapSize }                ).map(g => {
                        const column = movableArea[g.x];
                        return (column ? column[g.y] : null)?.totalMoveCost;
                    })).sort((d1, d2) => d1 - d2)[0];
                    const turnsCount = minDistance == null
                        ? null
                        : (producingUnitMoveRange <= 0
                            ? (minDistance <= 0 ? 1 : null)
                            : Math.max(
                                1,
                                Math.ceil(minDistance / producingUnitMoveRange) + (producingUnit.checkCanAttackAfterMove() ? 0 : 1)
                            )
                        );

                    if (turnsCount != null) {
                        const damage    = Math.min(baseDamage, unitCurrentHp);
                        score           += damage * unit.getProductionCfgCost() / 1000 * Math.max(1, unitValueRatio) / turnsCount;
                    }

                    canAttack = true;
                }
            }

            if (unit.getCfgMaxAttackRange()) {
                const baseDamage = unit.getBaseDamage(producingUnit.getArmorType());
                if (baseDamage != null) {
                    const turnsCount = await getMinTurnsCountForAttack(unit, producingGridIndex);
                    if (turnsCount != null) {
                        const damage    = Math.min(baseDamage * WarHelpers.WarCommonHelpers.getNormalizedHp(unitCurrentHp) / unit.getNormalizedMaxHp(), producingUnitCurrentHp);
                        score           += -damage * productionCost / 1000 / Math.max(1, unitValueRatio) / turnsCount;
                    }
                }
            }
        }

        if ((!canAttack) && (hasEnemyUnit)) {
            return null;
        }
        return score;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // The available action generators for units.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    async function getScoreAndActionUnitBeLoaded(commonParams: CommonParams, unit: BwUnit, gridIndex: GridIndex, pathNodes: MovePathNode[]): Promise<ScoreAndAction | null> {
        await Helpers.checkAndCallLater();

        const unitGridIndex = unit.getGridIndex();
        if (GridIndexHelpers.checkIsEqual(gridIndex, unitGridIndex)) {
            return null;
        }

        const loader = commonParams.war.getUnitMap().getUnitOnMap(gridIndex);
        if ((!loader) || (!loader.checkCanLoadUnit(unit))) {
            return null;
        }

        const score = await getScoreForActionUnitBeLoaded(commonParams, unit, gridIndex);
        return {
            score,
            action  : { WarActionUnitBeLoaded: {
                path        : {
                    nodes           : pathNodes,
                    fuelConsumption : pathNodes[pathNodes.length - 1].totalMoveCost,
                    isBlocked       : false,
                },
                launchUnitId: unit.getLoaderUnitId() == null ? null : unit.getUnitId(),
            } },
        };
    }

    async function getScoreAndActionUnitJoin(commonParams: CommonParams, unit: BwUnit, gridIndex: GridIndex, pathNodes: MovePathNode[]): Promise<ScoreAndAction | null> {
        await Helpers.checkAndCallLater();

        const unitGridIndex = unit.getGridIndex();
        if (GridIndexHelpers.checkIsEqual(gridIndex, unitGridIndex)) {
            return null;
        }

        const existingUnit = commonParams.war.getUnitMap().getUnitOnMap(gridIndex);
        if ((!existingUnit) || (!unit.checkCanJoinUnit(existingUnit))) {
            return null;
        }

        const score = await getScoreForActionUnitJoin(commonParams, unit, gridIndex);
        return {
            score,
            action  : { WarActionUnitJoinUnit: {
                path        : {
                nodes           : pathNodes,
                    fuelConsumption : pathNodes[pathNodes.length - 1].totalMoveCost,
                    isBlocked       : false,
                },
                launchUnitId: unit.getLoaderUnitId() == null ? null : unit.getUnitId(),
            } },
        };
    }

    async function getScoreAndActionUnitAttack(commonParams: CommonParams, unit: BwUnit, gridIndex: GridIndex, pathNodes: MovePathNode[]): Promise<ScoreAndAction | null> {
        await Helpers.checkAndCallLater();

        const unitGridIndex = unit.getGridIndex();
        const minRange      = unit.getMinAttackRange();
        const maxRange      = unit.getFinalMaxAttackRange();
        if ((minRange == null)                                                                              ||
            (maxRange == null)                                                                              ||
            ((!unit.checkCanAttackAfterMove()) && (!GridIndexHelpers.checkIsEqual(gridIndex, unitGridIndex)))
        ) {
            return null;
        }

        const { war, visibleUnits, mapSize }    = commonParams;
        const launchUnitId                      = unit.getLoaderUnitId() == null ? null : unit.getUnitId();
        const unitMap                           = war.getUnitMap();
        const promiseArray                      : Promise<ScoreAndAction>[] = [];
        for (const targetGridIndex of GridIndexHelpers.getGridsWithinDistance({ origin: gridIndex, minDistance: minRange, maxDistance: maxRange, mapSize })) {
            const targetUnit = unitMap.getUnitOnMap(targetGridIndex);
            if ((_IS_NEED_VISIBILITY) && (targetUnit != null) && (!visibleUnits.has(targetUnit))) {
                continue;
            }
            if (!unit.checkCanAttackTargetAfterMovePath(pathNodes, targetGridIndex)) {
                continue;
            }

            promiseArray.push((async () => {
                await Helpers.checkAndCallLater();

                const battleDamageInfoArray = WarHelpers.WarDamageCalculator.getEstimatedBattleDamage({ war, attackerMovePath: pathNodes, launchUnitId, targetGridIndex });
                return {
                    score   : await getScoreForActionUnitAttack({
                        commonParams,
                        focusUnit               : unit,
                        focusUnitGridIndex      : gridIndex,
                        battleDamageInfoArray,
                    }),
                    action  : unitMap.getUnitOnMap(targetGridIndex) != null
                        ? { WarActionUnitAttackUnit: {
                            path        : {
                                nodes           : pathNodes,
                                fuelConsumption : pathNodes[pathNodes.length - 1].totalMoveCost,
                                isBlocked       : false,
                            },
                            targetGridIndex,
                            launchUnitId,
                        } }
                        : { WarActionUnitAttackTile: {
                            path        : {
                                nodes           : pathNodes,
                                fuelConsumption : pathNodes[pathNodes.length - 1].totalMoveCost,
                                isBlocked       : false,
                            },
                            targetGridIndex,
                            launchUnitId,
                        }, },
                };
            })());
        }

        return getBestScoreAndAction(await Promise.all(promiseArray), commonParams);
    }

    async function getScoreAndActionUnitCaptureTile(commonParams: CommonParams, unit: BwUnit, gridIndex: GridIndex, pathNodes: MovePathNode[]): Promise<ScoreAndAction | null> {
        await Helpers.checkAndCallLater();

        const tile = commonParams.war.getTileMap().getTile(gridIndex);
        if (!unit.checkCanCaptureTile(tile)) {
            return null;
        } else {
            const score = await getScoreForActionUnitCaptureTile(commonParams, unit, gridIndex);
            return {
                score,
                action  : { WarActionUnitCaptureTile: {
                    path        : {
                        nodes           : pathNodes,
                        fuelConsumption : pathNodes[pathNodes.length - 1].totalMoveCost,
                        isBlocked       : false,
                    },
                    launchUnitId    : unit.getLoaderUnitId() == null ? null : unit.getUnitId(),
                } },
            };
        }
    }

    async function getScoreAndActionUnitDive(unit: BwUnit, gridIndex: GridIndex, pathNodes: MovePathNode[]): Promise<ScoreAndAction | null> {
        await Helpers.checkAndCallLater();

        if (!unit.checkCanDive()) {
            return null;
        } else {
            const score = await getScoreForActionUnitDive(unit);
            return {
                score,
                action  : { WarActionUnitDive: {
                    path        : {
                        nodes           : pathNodes,
                        fuelConsumption : pathNodes[pathNodes.length - 1].totalMoveCost,
                        isBlocked       : false,
                    },
                    launchUnitId    : unit.getLoaderUnitId() == null ? null : unit.getUnitId(),
                } },
            };
        }
    }

    async function getScoreAndActionUnitDropUnit({ commonParams, unit, gridIndex, pathNodes }: {
        commonParams    : CommonParams;
        unit            : BwUnit;
        gridIndex       : GridIndex;
        pathNodes       : MovePathNode[];
    }): Promise<ScoreAndAction | null> {
        await Helpers.checkAndCallLater();

        if ((!unit.getCfgCanDropLoadedUnit()) || (unit.getLoadedUnitsCount() <= 0)) {
            return null;
        }

        const war           = commonParams.war;
        const tileMap       = war.getTileMap();
        const loaderTile    = tileMap.getTile(gridIndex);
        if (!unit.checkCanDropLoadedUnit(loaderTile.getType())) {
            return null;
        }

        const unitMap           = war.getUnitMap();
        const targetTileArray   = GridIndexHelpers.getAdjacentGrids(gridIndex, commonParams.mapSize)
            .filter(v => {
                const existingUnit = unitMap.getUnitOnMap(v);
                return (existingUnit == null) || (existingUnit == unit);
            })
            .map(v => tileMap.getTile(v));
            // .sort(() => commonParams.getAndTickRandomInteger() % 2 === 0 ? -1 : 1);
        const loadedUnitArray   = unit.getLoadedUnits()
            .filter(v => commonParams.getCachedMoveCost(v, loaderTile) != null)
            .sort((v1, v2) => {
                const hp1 = v1.getCurrentHp();
                const hp2 = v2.getCurrentHp();
                if (hp1 !== hp2) {
                    return hp2 - hp1;
                } else {
                    return v1.getUnitId() - v2.getUnitId();
                }
            });

        const dropDestinations: CommonProto.Structure.IDropDestination[] = [];
        for (const loadedUnit of loadedUnitArray) {
            const index = targetTileArray.findIndex(v => commonParams.getCachedMoveCost(loadedUnit, v) != null);
            if (index >= 0) {
                dropDestinations.push({
                    unitId      : loadedUnit.getUnitId(),
                    gridIndex   : targetTileArray[index].getGridIndex(),
                });
                targetTileArray.splice(index, 1);
            }
        }

        if (!dropDestinations.length) {
            return null;
        } else {
            const score = await getScoreForActionUnitDropUnit(unit, dropDestinations);
            return {
                score,
                action  : { WarActionUnitDropUnit: {
                    path        : {
                        nodes           : pathNodes,
                        fuelConsumption : pathNodes[pathNodes.length - 1].totalMoveCost,
                        isBlocked       : false,
                    },
                    launchUnitId    : unit.getLoaderUnitId() == null ? null : unit.getUnitId(),
                    dropDestinations,
                    isDropBlocked   : false,
                } },
            };
        }
    }

    async function getScoreAndActionUnitLaunchSilo(commonParams: CommonParams, unit: BwUnit, gridIndex: GridIndex, pathNodes: MovePathNode[]): Promise<ScoreAndAction | null> {
        await Helpers.checkAndCallLater();

        const { war }   = commonParams;
        const tile      = war.getTileMap().getTile(gridIndex);
        if (!unit.checkCanLaunchSiloOnTile(tile)) {
            return null;
        }

        const { width: mapWidth, height: mapHeight }    = commonParams.mapSize;
        const unitValueMap                              = Helpers.createEmptyMap<number>(mapWidth, mapHeight);
        const teamIndex                                 = unit.getTeamIndex();
        const unitMap                                   = war.getUnitMap();
        const launchSiloParams                          = Helpers.getExisted(war.getGameConfig().getTileObjectCfg(tile.getObjectType())?.launchSiloParams, ClientErrorCode.SpwRobot_GetScoreAndActionUnitLaunchSilo_00);
        const siloDamage                                = Helpers.getExisted(launchSiloParams[3], ClientErrorCode.SpwRobot_GetScoreAndActionUnitLaunchSilo_01);
            for (let x = 0; x < mapWidth; ++x) {
            for (let y = 0; y < mapHeight; ++y) {
                const targetUnit = unitMap.getUnitOnMap({ x, y });
                if ((!targetUnit) || (targetUnit === unit)) {
                    unitValueMap[x][y] = 0;
                } else {
                    const value         = Math.min(siloDamage, targetUnit.getCurrentHp() - 1) * targetUnit.getProductionCfgCost();
                    unitValueMap[x][y]  = targetUnit.getTeamIndex() === teamIndex ? -value : value;
                }
            }
        }
        unitValueMap[gridIndex.x][gridIndex.y] = -Math.min(siloDamage, unit.getCurrentHp() - 1) * unit.getProductionCfgCost();

        let scoreAndGridIndex: { score: number, gridIndex: GridIndex } | null = null;
        for (let x = 0; x < mapWidth; ++x) {
            for (let y = 0; y < mapHeight; ++y) {
                const newTargetGridIndex    : GridIndex = { x, y };
                const newMaxScore           = await getScoreForActionUnitLaunchSilo(commonParams, unitValueMap, newTargetGridIndex, launchSiloParams[2]);
                if (scoreAndGridIndex == null) {
                    scoreAndGridIndex = {
                        score       : newMaxScore,
                        gridIndex   : newTargetGridIndex,
                    };
                } else if (newMaxScore > scoreAndGridIndex.score) {
                    scoreAndGridIndex.score     = newMaxScore;
                    scoreAndGridIndex.gridIndex = newTargetGridIndex;
                }
            }
        }

        return scoreAndGridIndex
            ? {
                score   : scoreAndGridIndex.score,
                action  : {
                    WarActionUnitLaunchSilo: {
                        path        : {
                            nodes           : pathNodes,
                            fuelConsumption : pathNodes[pathNodes.length - 1].totalMoveCost,
                            isBlocked       : false,
                        },
                        launchUnitId    : unit.getLoaderUnitId() == null ? null : unit.getUnitId(),
                        targetGridIndex : scoreAndGridIndex.gridIndex,
                    }
                },
            }
            : null;
    }

    async function getScoreAndActionUnitLaunchFlare(commonParams: CommonParams, unit: BwUnit, gridIndex: GridIndex, pathNodes: MovePathNode[]): Promise<ScoreAndAction | null> {
        await Helpers.checkAndCallLater();

        const { war, mapSize } = commonParams;
        if ((!_IS_NEED_VISIBILITY)                      ||
            (!war.getFogMap().checkHasFogCurrently())   ||
            (!unit.getFlareCurrentAmmo())               ||
            (pathNodes.length !== 1)
        ) {
            return null;
        }

        const flareMaxRange     = Helpers.getExisted(unit.getFlareMaxRange(), ClientErrorCode.SpwRobot_GetScoreAndActionUnitLaunchFlare_00);
        const promiseArray      : Promise<ScoreAndAction | null>[] = [];
        for (const targetGridIndex of GridIndexHelpers.getGridsWithinDistance({ origin: gridIndex, minDistance: 0, maxDistance: flareMaxRange, mapSize })) {
            promiseArray.push((async () => {
                return {
                    score   : await getScoreForActionUnitLaunchFlare(commonParams, unit, targetGridIndex),
                    action  : { WarActionUnitLaunchFlare: {
                        path        : {
                            nodes           : pathNodes,
                            fuelConsumption : pathNodes[pathNodes.length - 1].totalMoveCost,
                            isBlocked       : false,
                        },
                        launchUnitId    : unit.getLoaderUnitId() == null ? null : unit.getUnitId(),
                        targetGridIndex,
                    } },
                };
            })());
        }

        return getBestScoreAndAction(await Promise.all(promiseArray), commonParams);
    }

    async function getScoreAndActionUnitProduceUnit(commonParams: CommonParams, unit: BwUnit, pathNodes: MovePathNode[]): Promise<ScoreAndAction | null> {
        await Helpers.checkAndCallLater();

        if ((pathNodes.length !== 1) || (unit.getLoaderUnitId() != null)) {
            return null;
        }

        const produceUnitType   = unit.getProduceUnitType();
        const material          = unit.getCurrentProduceMaterial();
        const maxLoadUnitsCount = unit.getMaxLoadUnitsCount();
        const war               = commonParams.war;
        const playerIndex       = commonParams.playerIndexInTurn;
        if ((produceUnitType == null)                                                                                           ||
            (material == null)                                                                                                  ||
            (material <= 0)                                                                                                     ||
            (maxLoadUnitsCount == null)                                                                                         ||
            (unit.getLoadedUnitsCount() >= maxLoadUnitsCount)                                                                   ||
            ((war.getCommonSettingManager().getSettingsBannedUnitTypeArray(playerIndex) ?? []).indexOf(produceUnitType) >= 0)   ||
            (war.getWarEventManager().checkOngoingPersistentActionBannedUnitType(playerIndex, produceUnitType))
        ) {
            return null;
        }

        const score = (war.getGameConfig().getUnitTemplateCfg(produceUnitType)?.aiProductionScore ?? [])[war.getFogMap().checkHasFogCurrently() ? 1 : 0];
        if ((score == null)                                             ||
            (unit.getProduceUnitCost() > war.getPlayerInTurn().getFund())
         ) {
            return null;
        }

        return {
            score   : score + 1,
            action  : { WarActionUnitProduceUnit: {
                path    : {
                    nodes           : pathNodes,
                    fuelConsumption : pathNodes[pathNodes.length - 1].totalMoveCost,
                    isBlocked       : false,
                },
                launchUnitId    : unit.getLoaderUnitId() == null ? null : unit.getUnitId(),
            }},
        };
    }

    async function getScoreAndActionUnitSurface(unit: BwUnit, gridIndex: GridIndex, pathNodes: MovePathNode[]): Promise<ScoreAndAction | null> {
        await Helpers.checkAndCallLater();

        if (!unit.checkCanSurface()) {
            return null;
        } else {
            const score = await getScoreForActionUnitSurface(unit);
            return {
                score,
                action  : { WarActionUnitSurface: {
                    path        : {
                        nodes           : pathNodes,
                        fuelConsumption : pathNodes[pathNodes.length - 1].totalMoveCost,
                        isBlocked       : false,
                    },
                    launchUnitId    : unit.getLoaderUnitId() == null ? null : unit.getUnitId(),
                } },
            };
        }
    }

    async function getScoreAndActionUnitWait(unit: BwUnit, pathNodes: MovePathNode[]): Promise<ScoreAndAction> {
        await Helpers.checkAndCallLater();

        const score = await getScoreForActionUnitWait();
        return {
            score,
            action  : { WarActionUnitWait: {
                path        : {
                    nodes           : pathNodes,
                    fuelConsumption : pathNodes[pathNodes.length - 1].totalMoveCost,
                    isBlocked       : false,
                },
                launchUnitId    : unit.getLoaderUnitId() == null ? null : unit.getUnitId(),
            } },
        };
    }

    async function getScoreAndActionUnitLoadCo(unit: BwUnit, pathNodes: MovePathNode[]): Promise<ScoreAndAction | null> {
        await Helpers.checkAndCallLater();

        if (!unit.checkCanLoadCoAfterMovePath(pathNodes)) {
            return null;
        }

        return {
            score   : await getScoreForActionUnitLoadCo(unit),
            action  : { WarActionUnitLoadCo: {
                path        : {
                    nodes           : pathNodes,
                    fuelConsumption : pathNodes[pathNodes.length - 1].totalMoveCost,
                    isBlocked       : false,
                },
                launchUnitId    : unit.getLoaderUnitId() == null ? null : unit.getUnitId(),
            } },
        };
    }

    async function getScoreAndActionUnitUseCoSkill(commonParams: CommonParams, unit: BwUnit, pathNodes: MovePathNode[]): Promise<ScoreAndAction | null> {
        await Helpers.checkAndCallLater();

        const war               = commonParams.war;
        const playerIndexInTurn = commonParams.playerIndexInTurn;
        const unitsInfo         = Helpers.getExisted(commonParams.unitsInfoDict.get(playerIndexInTurn), ClientErrorCode.SpwRobot_GetScoreAndActionUnitUseCoSkill_00);
        const player            = war.getPlayer(playerIndexInTurn);
        const idleUnitsCount    = unitsInfo.idleCountOnMap;
        const allUnitsCount     = unitsInfo.allCountOnMap;
        const gameConfig        = war.getGameConfig();

        if (unit.checkCanUseCoSkill(CoSkillType.SuperPower)) {
            const canResetState = player.getCoSkills(CoSkillType.SuperPower).map(v => gameConfig.getCoSkillCfg(v)).some(v => v?.selfUnitActionState != null);
            if (((canResetState) && (idleUnitsCount > 0))                       ||
                ((!canResetState) && (idleUnitsCount < allUnitsCount * 0.85))
            ) {
                return null;
            } else {
                return {
                    score   : await getScoreForActionUnitUseCoSkill(unit),
                    action  : { WarActionUnitUseCoSkill: {
                        path        : {
                            nodes           : pathNodes,
                            fuelConsumption : pathNodes[pathNodes.length - 1].totalMoveCost,
                            isBlocked       : false,
                        },
                        launchUnitId    : unit.getLoaderUnitId() == null ? null : unit.getUnitId(),
                        skillType       : CoSkillType.SuperPower,
                    } },
                };
            }
        }

        if (unit.checkCanUseCoSkill(Types.CoSkillType.Power)) {
            const canResetState = player.getCoSkills(CoSkillType.Power).map(v => gameConfig.getCoSkillCfg(v)).some(v => v?.selfUnitActionState != null);
            if ((player.getCoCurrentEnergy() > Helpers.getExisted(player.getCoPowerEnergy(), ClientErrorCode.SpwRobot_GetScoreAndActionUnitUseCoSkill_01) * 1.1)  ||
                ((canResetState) && (idleUnitsCount > 0))                       ||
                ((!canResetState) && (idleUnitsCount < allUnitsCount * 0.85))
            ) {
                return null;
            } else {
                return {
                    score   : await getScoreForActionUnitUseCoSkill(unit),
                    action  : { WarActionUnitUseCoSkill: {
                        path        : {
                            nodes           : pathNodes,
                            fuelConsumption : pathNodes[pathNodes.length - 1].totalMoveCost,
                            isBlocked       : false,
                        },
                        launchUnitId    : unit.getLoaderUnitId() == null ? null : unit.getUnitId(),
                        skillType       : CoSkillType.Power,
                    } },
                };
            }
        }

        return null;
    }

    async function getBestScoreAndActionForUnitAndPath(commonParams: CommonParams, unit: BwUnit, gridIndex: GridIndex, pathNodes: MovePathNode[]): Promise<ScoreAndAction | null> {
        await Helpers.checkAndCallLater();

        const scoreAndActionForUnitBeLoaded = await getScoreAndActionUnitBeLoaded(commonParams, unit, gridIndex, pathNodes);
        if (scoreAndActionForUnitBeLoaded) {
            return scoreAndActionForUnitBeLoaded;
        }

        const scoreAndActionForUnitJoin = await getScoreAndActionUnitJoin(commonParams, unit, gridIndex, pathNodes);
        if (scoreAndActionForUnitJoin) {
            return scoreAndActionForUnitJoin;
        }

        if (!await checkCanUnitWaitOnGrid(commonParams, unit, gridIndex)) {
            return null;
        }

        return getBestScoreAndAction(await Promise.all([
            getScoreAndActionUnitAttack(commonParams, unit, gridIndex, pathNodes),
            getScoreAndActionUnitCaptureTile(commonParams, unit, gridIndex, pathNodes),
            getScoreAndActionUnitDive(unit, gridIndex, pathNodes),
            getScoreAndActionUnitDropUnit({ commonParams, unit, gridIndex, pathNodes }),
            getScoreAndActionUnitLaunchSilo(commonParams, unit, gridIndex, pathNodes),
            getScoreAndActionUnitLaunchFlare(commonParams, unit, gridIndex, pathNodes),
            getScoreAndActionUnitProduceUnit(commonParams, unit, pathNodes),
            getScoreAndActionUnitSurface(unit, gridIndex, pathNodes),
            getScoreAndActionUnitWait(unit, pathNodes),
            getScoreAndActionUnitLoadCo(unit, pathNodes),
            getScoreAndActionUnitUseCoSkill(commonParams, unit, pathNodes),
        ]), commonParams);
    }
    // function getActionType(action: IWarActionContainer): number {
    //     if      (action.WarActionPlayerDeleteUnit)          { return 1; }
    //     else if (action.WarActionPlayerEndTurn)             { return 2; }
    //     else if (action.WarActionPlayerProduceUnit)         { return 3; }
    //     else if (action.WarActionPlayerSurrender)           { return 4; }
    //     else if (action.WarActionPlayerVoteForDraw)         { return 5; }
    //     else if (action.WarActionPlayerUseCoSkill)          { return 6; }
    //     else if (action.WarActionSystemBeginTurn)           { return 7; }
    //     else if (action.WarActionSystemCallWarEvent)        { return 8; }
    //     else if (action.WarActionSystemDestroyPlayerForce)  { return 9; }
    //     else if (action.WarActionSystemEndWar)              { return 10; }
    //     else if (action.WarActionSystemEndTurn)             { return 11; }
    //     else if (action.WarActionSystemHandleBootPlayer)    { return 12; }
    //     else if (action.WarActionSystemVoteForDraw)         { return 13; }
    //     else if (action.WarActionUnitAttackTile)            { return 14; }
    //     else if (action.WarActionUnitAttackUnit)            { return 15; }
    //     else if (action.WarActionUnitBeLoaded)              { return 16; }
    //     else if (action.WarActionUnitBuildTile)             { return 17; }
    //     else if (action.WarActionUnitCaptureTile)           { return 18; }
    //     else if (action.WarActionUnitDive)                  { return 19; }
    //     else if (action.WarActionUnitDropUnit)              { return 20; }
    //     else if (action.WarActionUnitJoinUnit)              { return 21; }
    //     else if (action.WarActionUnitLaunchFlare)           { return 22; }
    //     else if (action.WarActionUnitLaunchSilo)            { return 23; }
    //     else if (action.WarActionUnitLoadCo)                { return 24; }
    //     else if (action.WarActionUnitProduceUnit)           { return 25; }
    //     else if (action.WarActionUnitSupplyUnit)            { return 26; }
    //     else if (action.WarActionUnitSurface)               { return 27; }
    //     else if (action.WarActionUnitUseCoSkill)            { return 28; }
    //     else if (action.WarActionUnitWait)                  { return 29; }
    //     else                                                { throw Helpers.newError(`WarRobot.getActionType() invalid action.`, ClientErrorCode.SpwRobot_GetActionType_00); }
    // }

    async function getBestScoreAndActionForCandidateUnit(commonParams: CommonParams, candidateUnit: BwUnit): Promise<ScoreAndAction | null> {
        await Helpers.checkAndCallLater();

        if (!candidateUnit.checkCanAiDoAction()) {
            return null;
        }

        const bestScoreAndActionDict = commonParams.bestScoreAndActionDict;
        {
            const bestScoreAndAction = bestScoreAndActionDict.get(candidateUnit);
            if (bestScoreAndAction) {
                return bestScoreAndAction;
            }
        }

        const reachableArea             = await getReachableArea({ commonParams, unit: candidateUnit, passableGridIndex: null, blockedGridIndex: null });
        const damageMapForSurface       = await createDamageMap(commonParams, candidateUnit, false);
        const damageMapForDive          = candidateUnit.checkIsDiver() ? await createDamageMap(commonParams, candidateUnit, true) : null;
        const originGridIndex           = candidateUnit.getGridIndex();
        const scoreDictForThreatEnemy   = new Map<BwUnit, number>();
        const canLaunchUnit             = (candidateUnit.checkCanLaunchLoadedUnit()) && (candidateUnit.getLoadedUnits().some(v => ((v.getActionState() === UnitActionState.Idle) && (v.checkCanAiDoAction()) && (v.getFinalMoveRange() > 0))));
        // const scoreMapForDistance       = await _createScoreMapForDistance(candidateUnit);
        const { width: mapWidth, height: mapHeight }    = commonParams.mapSize;
        const promiseArray                              : Promise<ScoreAndAction | null>[] = [];
        for (let x = 0; x < mapWidth; ++x) {
            if (reachableArea[x] == null) {
                continue;
            }

            for (let y = 0; y < mapHeight; ++y) {
                if (reachableArea[x][y] == null) {
                    continue;
                }

                const gridIndex: GridIndex = { x, y };
                promiseArray.push((async (): Promise<ScoreAndAction | null> => {
                    if (GridIndexHelpers.checkIsEqual(gridIndex, originGridIndex)) {
                        if (candidateUnit.getLoaderUnitId() != null) {
                            return null;
                        }
                    } else {
                        const aiMode = candidateUnit.getAiMode();
                        if (aiMode === UnitAiMode.NoMove) {
                            return null;
                        }
                    }

                    const pathNodes         = WarHelpers.WarCommonHelpers.createShortestMovePath(reachableArea, gridIndex);
                    const scoreAndAction    = await getBestScoreAndActionForUnitAndPath(commonParams, candidateUnit, gridIndex, pathNodes);
                    if (scoreAndAction == null) {
                        return null;
                    }

                    const action                = scoreAndAction.action;
                    const scoreForLaunchUnit    = ((pathNodes.length === 1) && (canLaunchUnit)) ? -999 : 1;
                    const scoreForMovePath      = await getScoreForMovePath(commonParams, candidateUnit, pathNodes);
                    const scoreForPosition      = await getScoreForPosition({
                        commonParams,
                        unit                    : candidateUnit,
                        gridIndex,
                        damageMap               : ((action.WarActionUnitDive) || ((candidateUnit.getIsDiving()) && (!action.WarActionUnitSurface))) ? damageMapForDive : damageMapForSurface,
                        scoreDictForThreatEnemy,
                    });
                    return {
                        score   : scoreAndAction.score + scoreForLaunchUnit + scoreForMovePath + scoreForPosition,
                        action,
                    };
                })());
            }
        }

        const bestScoreAndAction = getBestScoreAndAction(await Promise.all(promiseArray), commonParams);
        if (bestScoreAndAction) {
            bestScoreAndActionDict.set(candidateUnit, bestScoreAndAction);
        }
        return bestScoreAndAction;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // The available action generators for production.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    async function getBestScoreAndActionPlayerProduceUnitWithGridIndex({ commonParams, gridIndex, getMinTurnsCountForAttack }: {
        commonParams                : CommonParams;
        gridIndex                   : GridIndex;
        getMinTurnsCountForAttack   : (attackerUnit: BwUnit, targetGridIndex: GridIndex) => Promise<number | null>;
    }): Promise<ScoreAndAction | null> {
        await Helpers.checkAndCallLater();

        const war           = commonParams.war;
        const playerIndex   = commonParams.playerIndexInTurn;
        const unitCategory  = war.getTileMap().getTile(gridIndex).getProduceUnitCategoryForPlayer(playerIndex);
        if (unitCategory == null) {
            return null;
        }

        const warEventManager       = war.getWarEventManager();
        const bannedUnitTypeArray   = war.getCommonSettingManager().getSettingsBannedUnitTypeArray(playerIndex) ?? [];
        let bestScoreAndUnitType    : { score: number, unitType: number } | null = null;
        for (const unitType of war.getGameConfig().getUnitTypesByCategory(unitCategory) ?? []) {
            if ((bannedUnitTypeArray.indexOf(unitType) >= 0)                                        ||
                (warEventManager.checkOngoingPersistentActionBannedUnitType(playerIndex, unitType))
            ) {
                continue;
            }

            const score = await getScoreForActionPlayerProduceUnit({
                commonParams,
                producingGridIndex          : gridIndex,
                producingUnitType           : unitType,
                getMinTurnsCountForAttack,
            });
            if (score == null) {
                continue;
            }

            if (bestScoreAndUnitType == null) {
                bestScoreAndUnitType = {
                    score,
                    unitType,
                };
            } else if (score > bestScoreAndUnitType.score) {
                bestScoreAndUnitType.score       = score;
                bestScoreAndUnitType.unitType    = unitType;
            }
        }

        if (bestScoreAndUnitType == null) {
            return null;
        } else {
            return {
                score   : bestScoreAndUnitType.score,
                action  : { WarActionPlayerProduceUnit: {
                    unitType    : bestScoreAndUnitType.unitType,
                    unitHp      : CommonConstants.UnitMaxHp,
                    gridIndex,
                } },
            };
        }
    }

    async function getBestActionPlayerProduceUnit(commonParams: CommonParams): Promise<IWarActionContainer | null> {
        await Helpers.checkAndCallLater();

        const { war, playerIndexInTurn } = commonParams;
        if (playerIndexInTurn === CommonConstants.PlayerIndex.Neutral) {
            return null;
        }

        const idleBuildingPosList   : GridIndex[] = [];
        const unitMap               = war.getUnitMap();
        const tileMap               = war.getTileMap();

        for (const tile of war.getTileMap().getAllTiles()) {
            const gridIndex = tile.getGridIndex();
            if ((!unitMap.getUnitOnMap(gridIndex))                  &&
                (tile.checkIsUnitProducerForPlayer(playerIndexInTurn))
            ) {
                idleBuildingPosList.push(gridIndex);
            }
        }

        const mapSize                       = commonParams.mapSize;
        const maxAttackRangeDict            = new Map<BwUnit, number | null>();
        const moveRangeDict                 = new Map<BwUnit, number>();
        const movableAreaDict               = new Map<BwUnit, MovableArea>();
        const rawGetMinTurnsCountForAttack  = async (attackerUnit: BwUnit, targetGridIndex: GridIndex) => {
            if (!maxAttackRangeDict.has(attackerUnit)) {
                maxAttackRangeDict.set(attackerUnit, attackerUnit.getFinalMaxAttackRange());
            }

            const maxAttackRange = maxAttackRangeDict.get(attackerUnit);
            if (maxAttackRange == null) {
                return null;
            }

            if (!movableAreaDict.has(attackerUnit)) {
                await Helpers.checkAndCallLater();
                movableAreaDict.set(attackerUnit, WarHelpers.WarCommonHelpers.createMovableArea({
                    origin          : attackerUnit.getGridIndex(),
                    maxMoveCost     : Number.MAX_SAFE_INTEGER,
                    mapSize,
                    moveCostGetter  : g => {
                        return commonParams.getCachedMoveCost(attackerUnit, tileMap.getTile(g));
                    },
                }));
            }

            const movableArea   = Helpers.getExisted(movableAreaDict.get(attackerUnit), ClientErrorCode.SpwRobot_GetBestActionPlayerProduceUnit_00);
            const minDistance   = Helpers.getNonNullElements(GridIndexHelpers.getGridsWithinDistance(
                { origin: targetGridIndex, minDistance: 0, maxDistance: maxAttackRange, mapSize }        ).map(g => {
                const column = movableArea[g.x];
                return (column ? column[g.y] : null)?.totalMoveCost;
            })).sort((d1, d2) => d1 - d2)[0];
            if (minDistance == null) {
                return null;
            } else {
                if (!moveRangeDict.has(attackerUnit)) {
                    moveRangeDict.set(attackerUnit, attackerUnit.getFinalMoveRange());
                }

                const moveRange = Helpers.getExisted(moveRangeDict.get(attackerUnit), ClientErrorCode.SpwRobot_GetBestActionPlayerProduceUnit_01);
                return (moveRange <= 0
                    ? (minDistance <= 0 ? 1 : null)
                    : Math.max(
                        1,
                        Math.ceil(minDistance / moveRange) + (attackerUnit.checkCanAttackAfterMove() ? 0 : 1)
                    )
                );
            }
        };
        const minTurnsCountDict         = new Map<BwUnit, Map<number, number | null>>();
        const getMinTurnsCountForAttack = async (attackerUnit: BwUnit, targetGridIndex: GridIndex) => {
            const gridId = GridIndexHelpers.getGridId(targetGridIndex, mapSize);
            if (!minTurnsCountDict.has(attackerUnit)) {
                minTurnsCountDict.set(attackerUnit, new Map([[gridId, await rawGetMinTurnsCountForAttack(attackerUnit, targetGridIndex)]]));
            } else {
                const dict = Helpers.getExisted(minTurnsCountDict.get(attackerUnit), ClientErrorCode.SpwRobot_GetBestActionPlayerProduceUnit_02);
                if (!dict.has(gridId)) {
                    dict.set(gridId, await rawGetMinTurnsCountForAttack(attackerUnit, targetGridIndex));
                }
            }

            return minTurnsCountDict.get(attackerUnit)?.get(gridId) ?? null;
        };

        const promiseArray: Promise<ScoreAndAction | null>[] = [];
        for (const gridIndex of idleBuildingPosList) {
            promiseArray.push(getBestScoreAndActionPlayerProduceUnitWithGridIndex({
                commonParams,
                gridIndex,
                getMinTurnsCountForAttack,
            }));
        }

        return getBestScoreAndAction(await Promise.all(promiseArray), commonParams)?.action ?? null;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Phases.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Phase 1a: search for the best action for all units.
    // async function _getActionForPhase1a(): Promise<WarAction | null> {
    //     await _checkAndCallLater();

    //     let scoreAndAction : ScoreAndAction;
    //     for (const unit of await _getCandidateUnitsForPhase1a()) {
    //         scoreAndAction = _getBetterScoreAndAction(scoreAndAction, await _getActionForMaxScoreWithCandidateUnit1(unit));
    //     }
    //     if (scoreAndAction) {
    //         return scoreAndAction.action;
    //     } else {
    //         return null;
    //     }
    // }

    // Phase 1: 发动co技能
    async function getCandidateUnitsForPhase1(commonParams: CommonParams): Promise<BwUnit[]> {
        await Helpers.checkAndCallLater();

        const playerIndexInTurn = commonParams.playerIndexInTurn;
        const unitMap           = commonParams.war.getUnitMap();
        const units             : BwUnit[] = [];
        for (const unit of unitMap.getAllUnitsOnMap()) {
            if ((unit.getPlayerIndex() === playerIndexInTurn)                                                       &&
                (unit.getActionState() === UnitActionState.Idle)                                                    &&
                (unit.checkCanAiDoAction())                                                                         &&
                ((unit.checkCanUseCoSkill(CoSkillType.Power) || (unit.checkCanUseCoSkill(CoSkillType.SuperPower))))
            ) {
                units.push(unit);
            }
        }
        for (const unit of unitMap.getAllUnitsLoaded()) {
            if ((unit.getPlayerIndex() === playerIndexInTurn)                                                       &&
                (unit.getActionState() === UnitActionState.Idle)                                                    &&
                (unit.checkCanAiDoAction())                                                                         &&
                ((unit.checkCanUseCoSkill(CoSkillType.Power) || (unit.checkCanUseCoSkill(CoSkillType.SuperPower))))
            ) {
                const loaderUnit = unit.getLoaderUnit();
                if ((loaderUnit?.getPlayerIndex() === playerIndexInTurn)            &&
                    (loaderUnit.getActionState() === UnitActionState.Idle)          &&
                    (loaderUnit.checkCanAiDoAction())                               &&
                    (loaderUnit.checkCanLaunchLoadedUnit())                         &&
                    (unitMap.getUnitOnMap(loaderUnit.getGridIndex()) === loaderUnit)
                ) {
                    units.push(unit);
                }
            }
        }

        return units.sort((v1, v2) => {
            const hp1 = v1.getCurrentHp();
            const hp2 = v2.getCurrentHp();
            if (hp1 !== hp2) {
                return hp2 - hp1;
            } else {
                return v1.getUnitId() - v2.getUnitId();
            }
        });
    }
    async function getActionForPhase1(commonParams: CommonParams): Promise<IWarActionContainer | null> {
        const war               = commonParams.war;
        const playerIndexInTurn = commonParams.playerIndexInTurn;
        const player            = war.getPlayer(playerIndexInTurn);
        const coType            = player.getCoType();

        if (coType === Types.CoType.Global) {
            const unitsInfo         = Helpers.getExisted(commonParams.unitsInfoDict.get(playerIndexInTurn), ClientErrorCode.SpwRobot_GetActionForPhase1_00);
            const allUnitsCount     = unitsInfo.allCountOnMap;
            const idleUnitsCount    = unitsInfo.idleCountOnMap;
            const gameConfig        = war.getGameConfig();
            if (player.checkCanUseCoSkill(CoSkillType.SuperPower)) {
                const canResetState = player.getCoSkills(CoSkillType.SuperPower).map(v => gameConfig.getCoSkillCfg(v)).some(v => v?.selfUnitActionState != null);
                if (((canResetState) && (idleUnitsCount > 0))                       ||
                    ((!canResetState) && (idleUnitsCount < allUnitsCount * 0.85))
                ) {
                    return null;
                } else {
                    return {
                        WarActionPlayerUseCoSkill: {
                            skillType   : CoSkillType.SuperPower,
                        },
                    };
                }

            } else if (player.checkCanUseCoSkill(Types.CoSkillType.Power)) {
                const canResetState = player.getCoSkills(CoSkillType.Power).map(v => gameConfig.getCoSkillCfg(v)).some(v => v?.selfUnitActionState != null);
                if ((player.getCoCurrentEnergy() > Helpers.getExisted(player.getCoPowerEnergy(), ClientErrorCode.SpwRobot_GetActionForPhase1_01) * 1.1)   ||
                    ((canResetState) && (idleUnitsCount > 0))                                                                                               ||
                    ((!canResetState) && (idleUnitsCount < allUnitsCount * 0.85))
                ) {
                    return null;
                } else {
                    return {
                        WarActionPlayerUseCoSkill: {
                            skillType   : CoSkillType.Power,
                        },
                    };
                }

            } else {
                return null;
            }
        }

        if (coType === Types.CoType.Zoned) {
            for (const unit of await getCandidateUnitsForPhase1(commonParams)) {
                const action = (await getBestScoreAndActionForCandidateUnit(commonParams, unit))?.action;
                if (action) {
                    return action;
                }
            }

            return null;
        }

        return null;
    }

    // // Phase 2: 让能占领建筑的部队进行占领（若当前最佳操作不是占领则跳过）
    // // Phase 2: 操作能占领建筑的部队
    // async function getCandidateUnitsForPhase2(commonParams: CommonParams): Promise<BwUnit[]> {
    //     await Helpers.checkAndCallLater();

    //     const playerIndexInTurn = commonParams.playerIndexInTurn;
    //     const war               = commonParams.war;
    //     const unitMap           = war.getUnitMap();
    //     const units             : BwUnit[] = [];
    //     for (const unit of unitMap.getAllUnitsOnMap()) {
    //         if ((unit.getPlayerIndex() === playerIndexInTurn)       &&
    //             (unit.getActionState() === UnitActionState.Idle)    &&
    //             (unit.checkCanAiDoAction())                         &&
    //             (unit.checkIsCapturer())
    //         ) {
    //             units.push(unit);
    //         }
    //     }
    //     for (const unit of unitMap.getAllUnitsLoaded()) {
    //         if ((unit.getPlayerIndex() === playerIndexInTurn)       &&
    //             (unit.getActionState() === UnitActionState.Idle)    &&
    //             (unit.checkCanAiDoAction())                         &&
    //             (unit.checkIsCapturer())
    //         ) {
    //             const loaderUnit = unit.getLoaderUnit();
    //             if ((loaderUnit?.getPlayerIndex() === playerIndexInTurn)            &&
    //                 (loaderUnit.getActionState() === UnitActionState.Idle)          &&
    //                 (loaderUnit.checkCanAiDoAction())                               &&
    //                 (loaderUnit.checkCanLaunchLoadedUnit())                         &&
    //                 (unitMap.getUnitOnMap(loaderUnit.getGridIndex()) === loaderUnit)
    //             ) {
    //                 units.push(unit);
    //             }
    //         }
    //     }

    //     const tileMap = war.getTileMap();
    //     return units.sort((v1, v2) => {
    //         const capturePoint1 = tileMap.getTile(v1.getGridIndex()).getCurrentCapturePoint() ?? Number.MAX_SAFE_INTEGER;
    //         const capturePoint2 = tileMap.getTile(v2.getGridIndex()).getCurrentCapturePoint() ?? Number.MAX_SAFE_INTEGER;
    //         if (capturePoint1 != capturePoint2) {
    //             return capturePoint1 - capturePoint2;
    //         }

    //         const hp1 = v1.getCurrentHp();
    //         const hp2 = v2.getCurrentHp();
    //         if (hp1 !== hp2) {
    //             return hp2 - hp1;
    //         } else {
    //             return v1.getUnitId() - v2.getUnitId();
    //         }
    //     });
    // }
    // async function getActionForPhase2(commonParams: CommonParams): Promise<IWarActionContainer | null> {
    //     await Helpers.checkAndCallLater();

    //     const bestActionDict = commonParams.bestActionDict;
    //     for (const unit of await getCandidateUnitsForPhase2(commonParams)) {
    //         {
    //             const existingBestAction = bestActionDict.get(unit);
    //             if (existingBestAction) {
    //                 // if (existingBestAction.WarActionUnitCaptureTile) {
    //                 //     return existingBestAction;
    //                 // }
    //                 // continue;
    //                 return existingBestAction;
    //             }
    //         }

    //         const action = (await getBestScoreAndActionForCandidateUnit(commonParams, unit))?.action;
    //         if (action == null) {
    //             continue;
    //         }

    //         bestActionDict.set(unit, action);
    //         // if (action.WarActionUnitCaptureTile) {
    //         //     return action;
    //         // }
    //         return action;
    //     }

    //     return null;
    // }

    // // Phase 3: 让远程部队开火（若当前最佳操作不是开火则跳过）
    // // Phase 3: 操作远程部队
    // async function getCandidateUnitsForPhase3(commonParams: CommonParams): Promise<BwUnit[]> {
    //     await Helpers.checkAndCallLater();

    //     const playerIndexInTurn = commonParams.playerIndexInTurn;
    //     const unitMap           = commonParams.war.getUnitMap();
    //     const units             : BwUnit[] = [];
    //     for (const unit of unitMap.getAllUnitsOnMap()) {
    //         if ((unit.getPlayerIndex() === playerIndexInTurn)       &&
    //             (unit.getActionState() === UnitActionState.Idle)    &&
    //             (unit.checkCanAiDoAction())
    //         ) {
    //             const maxAttackRange = unit.getFinalMaxAttackRange();
    //             if ((maxAttackRange == null) || (maxAttackRange <= 1)) {
    //                 continue;
    //             }

    //             units.push(unit);
    //         }
    //     }
    //     for (const unit of unitMap.getAllUnitsLoaded()) {
    //         if ((unit.getPlayerIndex() === playerIndexInTurn)       &&
    //             (unit.getActionState() === UnitActionState.Idle)    &&
    //             (unit.checkCanAiDoAction())
    //         ) {
    //             const maxAttackRange = unit.getFinalMaxAttackRange();
    //             if ((maxAttackRange == null) || (maxAttackRange <= 1) || (!unit.checkCanAttackAfterMove())) {
    //                 continue;
    //             }

    //             const loaderUnit = unit.getLoaderUnit();
    //             if ((loaderUnit?.getPlayerIndex() === playerIndexInTurn)            &&
    //                 (loaderUnit.getActionState() === UnitActionState.Idle)          &&
    //                 (loaderUnit.checkCanAiDoAction())                               &&
    //                 (loaderUnit.checkCanLaunchLoadedUnit())                         &&
    //                 (unitMap.getUnitOnMap(loaderUnit.getGridIndex()) === loaderUnit)
    //             ) {
    //                 units.push(unit);
    //             }
    //         }
    //     }

    //     return units.sort((v1, v2) => {
    //         const cost1 = v1.getProductionCfgCost() * v1.getCurrentHp();
    //         const cost2 = v2.getProductionCfgCost() * v2.getCurrentHp();
    //         if (cost1 !== cost2) {
    //             return cost2 - cost1;
    //         }

    //         return v1.getUnitId() - v2.getUnitId();
    //     });
    // }
    // async function getActionForPhase3(commonParams: CommonParams): Promise<IWarActionContainer | null> {
    //     await Helpers.checkAndCallLater();

    //     const bestActionDict = commonParams.bestActionDict;
    //     for (const unit of await getCandidateUnitsForPhase3(commonParams)) {
    //         {
    //             const existingBestAction = bestActionDict.get(unit);
    //             if (existingBestAction) {
    //                 // if ((existingBestAction.WarActionUnitAttackTile) || (existingBestAction.WarActionUnitAttackUnit)) {
    //                 //     return existingBestAction;
    //                 // }
    //                 // continue;
    //                 return existingBestAction;
    //             }
    //         }

    //         const action = (await getBestScoreAndActionForCandidateUnit(commonParams, unit))?.action;
    //         if (action == null) {
    //             continue;
    //         }

    //         bestActionDict.set(unit, action);
    //         // if ((action.WarActionUnitAttackTile) || (action.WarActionUnitAttackUnit)) {
    //         //     return action;
    //         // }
    //         return action;
    //     }

    //     return null;
    // }

    // // Phase 4: 让近程部队开火（若当前最佳操作不是开火则跳过；优先顺序是大飞机-车辆和小飞机-步兵？）
    // // Phase 4: 操作近程部队
    // async function getCandidateUnitsForPhase4(commonParams: CommonParams): Promise<BwUnit[]> {
    //     await Helpers.checkAndCallLater();

    //     const playerIndexInTurn = commonParams.playerIndexInTurn;
    //     const unitMap           = commonParams.war.getUnitMap();
    //     const units             : BwUnit[] = [];
    //     for (const unit of unitMap.getAllUnitsOnMap()) {
    //         if ((unit.getPlayerIndex() === playerIndexInTurn)       &&
    //             (unit.getActionState() === UnitActionState.Idle)    &&
    //             (unit.checkCanAiDoAction())
    //         ) {
    //             const maxAttackRange = unit.getFinalMaxAttackRange();
    //             if ((maxAttackRange == null) || (maxAttackRange > 1)) {
    //                 continue;
    //             }

    //             units.push(unit);
    //         }
    //     }
    //     for (const unit of unitMap.getAllUnitsLoaded()) {
    //         if ((unit.getPlayerIndex() === playerIndexInTurn)       &&
    //             (unit.getActionState() === UnitActionState.Idle)    &&
    //             (unit.checkCanAiDoAction())
    //         ) {
    //             const maxAttackRange = unit.getFinalMaxAttackRange();
    //             if ((maxAttackRange == null) || (maxAttackRange > 1) || (!unit.checkCanAttackAfterMove())) {
    //                 continue;
    //             }

    //             const loaderUnit = unit.getLoaderUnit();
    //             if ((loaderUnit?.getPlayerIndex() === playerIndexInTurn)            &&
    //                 (loaderUnit.getActionState() === UnitActionState.Idle)          &&
    //                 (loaderUnit.checkCanAiDoAction())                               &&
    //                 (loaderUnit.checkCanLaunchLoadedUnit())                         &&
    //                 (unitMap.getUnitOnMap(loaderUnit.getGridIndex()) === loaderUnit)
    //             ) {
    //                 units.push(unit);
    //             }
    //         }
    //     }

    //     return units.sort((v1, v2) => {
    //         const cost1 = v1.getProductionCfgCost() * v1.getCurrentHp();
    //         const cost2 = v2.getProductionCfgCost() * v2.getCurrentHp();
    //         if (cost1 !== cost2) {
    //             return cost2 - cost1;
    //         }

    //         return v1.getUnitId() - v2.getUnitId();
    //     });
    // }
    // async function getActionForPhase4(commonParams: CommonParams): Promise<IWarActionContainer | null> {
    //     await Helpers.checkAndCallLater();

    //     const bestActionDict = commonParams.bestActionDict;
    //     for (const unit of await getCandidateUnitsForPhase4(commonParams)) {
    //         {
    //             const existingBestAction = bestActionDict.get(unit);
    //             if (existingBestAction) {
    //                 // if ((existingBestAction.WarActionUnitAttackTile) || (existingBestAction.WarActionUnitAttackUnit)) {
    //                 //     return existingBestAction;
    //                 // }
    //                 // continue;
    //                 return existingBestAction;
    //             }
    //         }

    //         const action = (await getBestScoreAndActionForCandidateUnit(commonParams, unit))?.action;
    //         if (action == null) {
    //             continue;
    //         }

    //         bestActionDict.set(unit, action);
    //         // if ((action.WarActionUnitAttackTile) || (action.WarActionUnitAttackUnit)) {
    //         //     return action;
    //         // }
    //         return action;
    //     }

    //     return null;
    // }

    // // Phase 5: 操作只能卸载而不能弹射装载物的运输部队
    // async function getCandidateUnitsForPhase5(commonParams: CommonParams): Promise<BwUnit[]> {
    //     await Helpers.checkAndCallLater();

    //     const playerIndexInTurn = commonParams.playerIndexInTurn;
    //     const unitMap           = commonParams.war.getUnitMap();
    //     const units             : BwUnit[] = [];
    //     for (const unit of unitMap.getAllUnitsOnMap()) {
    //         if ((unit.getPlayerIndex() === playerIndexInTurn)       &&
    //             (unit.getActionState() === UnitActionState.Idle)    &&
    //             (unit.checkCanAiDoAction())                         &&
    //             (unit.getMaxLoadUnitsCount())                       &&
    //             (!unit.checkCanLaunchLoadedUnit())
    //         ) {
    //             units.push(unit);
    //         }
    //     }
    //     for (const unit of unitMap.getAllUnitsLoaded()) {
    //         if ((unit.getPlayerIndex() === playerIndexInTurn)       &&
    //             (unit.getActionState() === UnitActionState.Idle)    &&
    //             (unit.checkCanAiDoAction())                         &&
    //             (unit.getMaxLoadUnitsCount())                       &&
    //             (!unit.checkCanLaunchLoadedUnit())
    //         ) {
    //             const loaderUnit = unit.getLoaderUnit();
    //             if ((loaderUnit?.getPlayerIndex() === playerIndexInTurn)            &&
    //                 (loaderUnit.getActionState() === UnitActionState.Idle)          &&
    //                 (loaderUnit.checkCanAiDoAction())                               &&
    //                 (loaderUnit.checkCanLaunchLoadedUnit())                         &&
    //                 (unitMap.getUnitOnMap(loaderUnit.getGridIndex()) === loaderUnit)
    //             ) {
    //                 units.push(unit);
    //             }
    //         }
    //     }

    //     return units.sort((v1, v2) => {
    //         const cost1 = v1.getProductionCfgCost() * v1.getCurrentHp();
    //         const cost2 = v2.getProductionCfgCost() * v2.getCurrentHp();
    //         if (cost1 !== cost2) {
    //             return cost1 - cost2;
    //         }

    //         return v1.getUnitId() - v2.getUnitId();
    //     });
    // }
    // async function getActionForPhase5(commonParams: CommonParams): Promise<IWarActionContainer | null> {
    //     await Helpers.checkAndCallLater();

    //     const bestActionDict = commonParams.bestActionDict;
    //     for (const unit of await getCandidateUnitsForPhase5(commonParams)) {
    //         {
    //             const existingBestAction = bestActionDict.get(unit);
    //             if (existingBestAction) {
    //                 return existingBestAction;
    //             }
    //         }

    //         const action = (await getBestScoreAndActionForCandidateUnit(commonParams, unit))?.action;
    //         if (action == null) {
    //             continue;
    //         }

    //         bestActionDict.set(unit, action);
    //         return action;
    //     }

    //     return null;
    // }

    // // Phase 6: 操作剩余近程、且不能弹射装载物的部队
    // async function getCandidateUnitsForPhase6(commonParams: CommonParams): Promise<BwUnit[]> {
    //     await Helpers.checkAndCallLater();

    //     const playerIndexInTurn = commonParams.playerIndexInTurn;
    //     const unitMap           = commonParams.war.getUnitMap();
    //     const units             : BwUnit[] = [];
    //     for (const unit of unitMap.getAllUnitsOnMap()) {
    //         if ((unit.getPlayerIndex() === playerIndexInTurn)       &&
    //             (unit.getActionState() === UnitActionState.Idle)    &&
    //             (unit.checkCanAiDoAction())                         &&
    //             (!unit.checkCanLaunchLoadedUnit())
    //         ) {
    //             const maxAttackRange = unit.getFinalMaxAttackRange();
    //             if ((maxAttackRange == null) || (maxAttackRange > 1)) {
    //                 continue;
    //             }

    //             units.push(unit);
    //         }
    //     }
    //     for (const unit of unitMap.getAllUnitsLoaded()) {
    //         if ((unit.getPlayerIndex() === playerIndexInTurn)       &&
    //             (unit.getActionState() === UnitActionState.Idle)    &&
    //             (unit.checkCanAiDoAction())                         &&
    //             (!unit.checkCanLaunchLoadedUnit())
    //         ) {
    //             const maxAttackRange = unit.getFinalMaxAttackRange();
    //             if ((maxAttackRange == null) || (maxAttackRange > 1)) {
    //                 continue;
    //             }

    //             const loaderUnit = unit.getLoaderUnit();
    //             if ((loaderUnit?.getPlayerIndex() === playerIndexInTurn)            &&
    //                 (loaderUnit.getActionState() === UnitActionState.Idle)          &&
    //                 (loaderUnit.checkCanAiDoAction())                               &&
    //                 (loaderUnit.checkCanLaunchLoadedUnit())                         &&
    //                 (unitMap.getUnitOnMap(loaderUnit.getGridIndex()) === loaderUnit)
    //             ) {
    //                 units.push(unit);
    //             }
    //         }
    //     }

    //     return units.sort((v1, v2) => {
    //         const cost1 = v1.getProductionCfgCost() * v1.getCurrentHp();
    //         const cost2 = v2.getProductionCfgCost() * v2.getCurrentHp();
    //         if (cost1 !== cost2) {
    //             return cost1 - cost2;
    //         }

    //         return v1.getUnitId() - v2.getUnitId();
    //     });
    // }
    // async function getActionForPhase6(commonParams: CommonParams): Promise<IWarActionContainer | null> {
    //     await Helpers.checkAndCallLater();

    //     const bestActionDict = commonParams.bestActionDict;
    //     for (const unit of await getCandidateUnitsForPhase6(commonParams)) {
    //         {
    //             const existingBestAction = bestActionDict.get(unit);
    //             if (existingBestAction) {
    //                 return existingBestAction;
    //             }
    //         }

    //         const action = (await getBestScoreAndActionForCandidateUnit(commonParams, unit))?.action;
    //         if (action == null) {
    //             continue;
    //         }

    //         bestActionDict.set(unit, action);
    //         return action;
    //     }

    //     return null;
    // }

    // // Phase 7: 操作剩余远程、且不能弹射装载物的部队
    // async function getCandidateUnitsForPhase7(commonParams: CommonParams): Promise<BwUnit[]> {
    //     await Helpers.checkAndCallLater();

    //     const playerIndexInTurn = commonParams.playerIndexInTurn;
    //     const unitMap           = commonParams.war.getUnitMap();
    //     const units             : BwUnit[] = [];
    //     for (const unit of unitMap.getAllUnitsOnMap()) {
    //         if ((unit.getPlayerIndex() === playerIndexInTurn)       &&
    //             (unit.getActionState() === UnitActionState.Idle)    &&
    //             (unit.checkCanAiDoAction())                         &&
    //             (!unit.checkCanLaunchLoadedUnit())
    //         ) {
    //             const maxAttackRange = unit.getFinalMaxAttackRange();
    //             if ((maxAttackRange == null) || (maxAttackRange <= 1)) {
    //                 continue;
    //             }

    //             units.push(unit);
    //         }
    //     }
    //     for (const unit of unitMap.getAllUnitsLoaded()) {
    //         if ((unit.getPlayerIndex() === playerIndexInTurn)       &&
    //             (unit.getActionState() === UnitActionState.Idle)    &&
    //             (unit.checkCanAiDoAction())                         &&
    //             (!unit.checkCanLaunchLoadedUnit())
    //         ) {
    //             const maxAttackRange = unit.getFinalMaxAttackRange();
    //             if ((maxAttackRange == null) || (maxAttackRange <= 1)) {
    //                 continue;
    //             }

    //             const loaderUnit = unit.getLoaderUnit();
    //             if ((loaderUnit?.getPlayerIndex() === playerIndexInTurn)            &&
    //                 (loaderUnit.getActionState() === UnitActionState.Idle)          &&
    //                 (loaderUnit.checkCanAiDoAction())                               &&
    //                 (loaderUnit.checkCanLaunchLoadedUnit())                         &&
    //                 (unitMap.getUnitOnMap(loaderUnit.getGridIndex()) === loaderUnit)
    //             ) {
    //                 units.push(unit);
    //             }
    //         }
    //     }

    //     return units.sort((v1, v2) => {
    //         const cost1 = v1.getProductionCfgCost() * v1.getCurrentHp();
    //         const cost2 = v2.getProductionCfgCost() * v2.getCurrentHp();
    //         if (cost1 !== cost2) {
    //             return cost1 - cost2;
    //         }

    //         return v1.getUnitId() - v2.getUnitId();
    //     });
    // }
    // async function getActionForPhase7(commonParams: CommonParams): Promise<IWarActionContainer | null> {
    //     await Helpers.checkAndCallLater();

    //     const bestActionDict = commonParams.bestActionDict;
    //     for (const unit of await getCandidateUnitsForPhase7(commonParams)) {
    //         {
    //             const existingBestAction = bestActionDict.get(unit);
    //             if (existingBestAction) {
    //                 return existingBestAction;
    //             }
    //         }

    //         const action = (await getBestScoreAndActionForCandidateUnit(commonParams, unit))?.action;
    //         if (action == null) {
    //             continue;
    //         }

    //         bestActionDict.set(unit, action);
    //         return action;
    //     }

    //     return null;
    // }

    // Phase 8: 操作剩余任意部队
    async function getCandidateUnitsForPhase8(commonParams: CommonParams): Promise<BwUnit[]> {
        await Helpers.checkAndCallLater();

        const playerIndexInTurn = commonParams.playerIndexInTurn;
        const unitMap           = commonParams.war.getUnitMap();
        const units             : BwUnit[] = [];
        for (const unit of unitMap.getAllUnitsOnMap()) {
            if ((unit.getPlayerIndex() === playerIndexInTurn)       &&
                (unit.getActionState() === UnitActionState.Idle)    &&
                (unit.checkCanAiDoAction())
            ) {
                units.push(unit);
            }
        }
        for (const unit of unitMap.getAllUnitsLoaded()) {
            if ((unit.getPlayerIndex() === playerIndexInTurn)       &&
                (unit.getActionState() === UnitActionState.Idle)    &&
                (unit.checkCanAiDoAction())
            ) {
                const loaderUnit = unit.getLoaderUnit();
                if ((loaderUnit?.getPlayerIndex() === playerIndexInTurn)            &&
                    (loaderUnit.getActionState() === UnitActionState.Idle)          &&
                    (loaderUnit.checkCanAiDoAction())                               &&
                    (loaderUnit.checkCanLaunchLoadedUnit())                         &&
                    (unitMap.getUnitOnMap(loaderUnit.getGridIndex()) === loaderUnit)
                ) {
                    units.push(unit);
                }
            }
        }

        return units.sort((v1, v2) => {
            const cost1 = v1.getProductionCfgCost() * v1.getCurrentHp();
            const cost2 = v2.getProductionCfgCost() * v2.getCurrentHp();
            if (cost1 !== cost2) {
                return cost1 - cost2;
            }

            return v1.getUnitId() - v2.getUnitId();
        });
    }
    async function getActionForPhase8(commonParams: CommonParams): Promise<IWarActionContainer | null> {
        await Helpers.checkAndCallLater();

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // const bestActionDict = commonParams.bestActionDict;
        // for (const unit of await getCandidateUnitsForPhase8(commonParams)) {
        //     {
        //         const existingBestAction = bestActionDict.get(unit);
        //         if (existingBestAction) {
        //             return existingBestAction;
        //         }
        //     }

        //     const action = (await getBestScoreAndActionForCandidateUnit(commonParams, unit))?.action;
        //     if (action == null) {
        //         continue;
        //     }

        //     bestActionDict.set(unit, action);
        //     return action;
        // }

        // return null;

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // const promiseArray: Promise<ScoreAndAction | null>[] = [];
        // for (const unit of await getCandidateUnitsForPhase8(commonParams)) {
        //     promiseArray.push(getBestScoreAndActionForCandidateUnit(commonParams, unit));
        // }

        // return (getBestScoreAndAction(await Promise.all(promiseArray), commonParams))?.action ?? null;

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        let bestScoreAndAction: ScoreAndAction | null = null;
        for (const unit of await getCandidateUnitsForPhase8(commonParams)) {
            const newData = await getBestScoreAndActionForCandidateUnit(commonParams, unit);
            if (newData) {
                bestScoreAndAction = getBetterScoreAndAction(bestScoreAndAction, newData, commonParams);
            }
        }

        return bestScoreAndAction?.action ?? null;
    }

    // Phase 4: move the air combat units.
    // async function _getActionForPhase4(): Promise<WarAction | null> {
    //     await Helpers.checkAndCallLater();

    //     let scoreAndAction : ScoreAndAction;
    //     for (const unit of await _getCandidateUnitsForPhase4()) {
    //         scoreAndAction = getBetterScoreAndAction(scoreAndAction, await getActionForMaxScoreWithCandidateUnit(unit));
    //     }
    //     if (scoreAndAction) {
    //         return scoreAndAction.action;
    //     } else {
    //         return null;
    //     }
    // }

    // Phase 5: move the remaining direct units.
    // async function _getActionForPhase5(): Promise<WarAction | null> {
    //     await Helpers.checkAndCallLater();

    //     let scoreAndAction : ScoreAndAction;
    //     for (const unit of await _getCandidateUnitsForPhase5()) {
    //         scoreAndAction = getBetterScoreAndAction(scoreAndAction, await getActionForMaxScoreWithCandidateUnit(unit));
    //     }
    //     if (scoreAndAction) {
    //         return scoreAndAction.action;
    //     } else {
    //         return null;
    //     }
    // }

    // Phase 6: move the other units except the remaining ranged units.
    // async function _getActionForPhase6(): Promise<WarAction | null> {
    //     await Helpers.checkAndCallLater();

    //     let scoreAndAction : ScoreAndAction;
    //     for (const unit of await _getCandidateUnitsForPhase6()) {
    //         scoreAndAction = getBetterScoreAndAction(scoreAndAction, await getActionForMaxScoreWithCandidateUnit(unit));
    //     }
    //     if (scoreAndAction) {
    //         return scoreAndAction.action;
    //     } else {
    //         return null;
    //     }
    // }

    // Phase 7: move the remaining units.
    // async function _getActionForPhase7(): Promise<WarAction | null> {
    //     await Helpers.checkAndCallLater();

    //     let scoreAndAction : ScoreAndAction;
    //     for (const unit of await _getCandidateUnitsForPhase7()) {
    //         scoreAndAction = getBetterScoreAndAction(scoreAndAction, await getActionForMaxScoreWithCandidateUnit(unit));
    //     }
    //     if (scoreAndAction) {
    //         return scoreAndAction.action;
    //     } else {
    //         return null;
    //     }
    // }

    // Phase 9: 生产部队
    async function getActionForPhase9(commonParams: CommonParams): Promise<IWarActionContainer | null> {
        await Helpers.checkAndCallLater();

        return await getBestActionPlayerProduceUnit(commonParams);
    }

    // Phase 11: 投票和局
    async function getActionForPhase11(commonParams: CommonParams): Promise<IWarActionContainer | null> {
        await Helpers.checkAndCallLater();

        const war = commonParams.war;
        if ((war.getDrawVoteManager().getRemainingVotes() == null) ||
            (war.getPlayerInTurn().getHasVotedForDraw())
        ) {
            return null;
        } else {
            return {
                WarActionPlayerVoteForDraw: {
                    isAgree : true,
                },
            };
        }
    }

    // Phase 12: 结束回合
    async function getActionForPhase12(): Promise<IWarActionContainer> {
        await Helpers.checkAndCallLater();

        return {
            WarActionPlayerEndTurn: {},
        };
    }

    const funcArray = [
        getActionForPhase1,
        // getActionForPhase2,
        // getActionForPhase3,
        // getActionForPhase4,
        // getActionForPhase5,
        // getActionForPhase6,
        // getActionForPhase7,
        getActionForPhase8,
        getActionForPhase9,
        getActionForPhase11,
        getActionForPhase12,
    ];
    async function doGetNextAction(war: BwWar): Promise<IWarActionContainer> {
        const commonParams = await getCommonParams(war);
        if (war.getPlayerIndexInTurn() === CommonConstants.PlayerIndex.Neutral) {
            throw Helpers.newError(`Invalid playerIndexInTurn.`, ClientErrorCode.SpwRobot_DoGetNextAction_00);
        }

        for (const func of funcArray) {
            const actionForPhase = await func(commonParams);
            if (actionForPhase) {
                return actionForPhase;
            }
        }

        throw Helpers.newError(`No available action?!`, ClientErrorCode.SpwRobot_DoGetNextAction_01);
    }

    export async function getNextAction(war: BwWar): Promise<IWarActionContainer> {
        if (_calculatingWars.has(war)) {
            throw Helpers.newError(`Calculating.`, ClientErrorCode.SpwRobot_GetNextAction_00);
        }

        _calculatingWars.add(war);
        const action = await doGetNextAction(war);
        action.actionId = war.getExecutedActionManager().getExecutedActionsCount();
        _calculatingWars.delete(war);

        return action;
    }
}

// export default WarRobot;
