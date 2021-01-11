
namespace TinyWars.BaseWar {
    import ConfigManager                    = Utility.ConfigManager;
    import Types                            = Utility.Types;
    import GridIndexHelpers                 = Utility.GridIndexHelpers;
    import Helpers                          = Utility.Helpers;
    import ProtoTypes                       = Utility.ProtoTypes;
    import Logger                           = Utility.Logger;
    import ISerialWarEventManager           = ProtoTypes.WarSerialization.ISerialWarEventManager;
    import IDataForWarEventCalledCount      = ProtoTypes.WarSerialization.IDataForWarEventCalledCount;
    import IDataForWarEvent                 = ProtoTypes.Map.IDataForWarEvent;
    import WarEvent                         = ProtoTypes.WarEvent;
    import IExtraDataForSystemCallWarEvent  = ProtoTypes.WarAction.WarActionSystemCallWarEvent.IExtraDataForSystemCallWarEvent;
    import CommonConstants                  = ConfigManager.COMMON_CONSTANTS;

    export abstract class BwWarEventManager {
        private _war?               : BwWar;
        private _warEventData?      : IDataForWarEvent | null | undefined;
        private _calledCountList?   : IDataForWarEventCalledCount[] | null | undefined;

        public init(data: ISerialWarEventManager): BwWarEventManager | undefined {
            this.setWarEventData(data.warEventData);
            this._setCalledCountList(data.calledCountList);

            return this;
        }
        public fastInit(data: ISerialWarEventManager): BwWarEventManager {
            this.setWarEventData(Helpers.deepClone(data.warEventData));
            this._setCalledCountList(Helpers.deepClone(data.calledCountList));

            return this;
        }

        public serialize(): ISerialWarEventManager | undefined {
            return {
                warEventData    : this.getWarEventData(),
                calledCountList : this._getCalledCountList(),
            };
        }
        public serializeForSimulation(): ISerialWarEventManager | undefined {
            return {
                warEventData    : this.getWarEventData(),
                calledCountList : this._getCalledCountList(),
            };
        }

        public startRunning(war: BwWar): void {
            this._setWar(war);
        }

        private _setWar(war: BwWar): void {
            this._war = war;
        }
        private _getWar(): BwWar | undefined {
            return this._war;
        }

        public setWarEventData(data: IDataForWarEvent | null | undefined): void {
            this._warEventData = data;
        }
        public getWarEventData(): IDataForWarEvent | undefined | null {
            return this._warEventData;
        }

        private _setCalledCountList(list: IDataForWarEventCalledCount[] | null | undefined): void {
            this._calledCountList = list;
        }
        private _getCalledCountList(): IDataForWarEventCalledCount[] | null | undefined {
            return this._calledCountList;
        }

        public async callWarEvent(warEventId: number, isFastExecute: boolean): Promise<IExtraDataForSystemCallWarEvent[] | undefined> { // DONE
            const event = this.getWarEvent(warEventId);
            if (event == null) {
                Logger.error(`BwWarEventManager.callWarEvent() empty event.`);
                return undefined;
            }

            const extraDataList : IExtraDataForSystemCallWarEvent[] = [];
            const actionIdList  = event.actionIdList || [];
            for (let index = 0; index < actionIdList.length; ++index) {
                const extraData = await this._callWarAction(actionIdList[index], index, isFastExecute);
                if (extraData) {
                    extraDataList.push(extraData);
                }
            }

            return extraDataList;
        }
        private async _callWarAction(warEventActionId: number, indexForActionIdList: number, isFastExecute: boolean): Promise<IExtraDataForSystemCallWarEvent | undefined> {
            const action = this.getWarEventAction(warEventActionId);
            if (action == null) {
                Logger.error(`BwWarEventManager._callWarAction() empty action.`);
                return undefined;
            }

            if (action.WarEventActionAddUnit) {
                return await this._callActionAddUnit(indexForActionIdList, action.WarEventActionAddUnit, isFastExecute);
            }

            // TODO add more actions.
        }
        private async _callActionAddUnit(indexForActionIdList: number, action: WarEvent.IWarEventActionAddUnit, isFastExecute: boolean): Promise<IExtraDataForSystemCallWarEvent | undefined> {
            const unitList = action.unitList;
            if (unitList == null) {
                Logger.error(`BwWarEventManager._callActionAddUnit() empty unitList.`);
                return undefined;
            }

            const war = this._getWar();
            if (war == null) {
                Logger.error(`BwWarEventManager._callActionAddUnit() empty war.`);
                return undefined;
            }

            const unitMap = war.getUnitMap();
            if (unitMap == null) {
                Logger.error(`BwWarEventManager._callActionAddUnit() empty unitMap.`);
                return undefined;
            }

            const tileMap = war.getTileMap();
            if (tileMap == null) {
                Logger.error(`BwWarEventManager._callActionAddUnit() empty tileMap.`);
                return undefined;
            }

            const playerManager = war.getPlayerManager();
            if (playerManager == null) {
                Logger.error(`BwWarEventManager._callActionAddUnit() empty playerManager.`);
                return undefined;
            }

            const configVersion = war.getConfigVersion();
            if (configVersion == null) {
                Logger.error(`BwWarEventManager._callActionAddUnit() empty configVersion.`);
                return undefined;
            }

            const mapSize = unitMap.getMapSize();
            if (mapSize == null) {
                Logger.error(`BwWarEventManager._callActionAddUnit() empty mapSize.`);
                return undefined;
            }

            const playersCountUnneutral = playerManager.getTotalPlayersCount(false);
            const resultingUnitList     : ProtoTypes.WarSerialization.ISerialUnit[] = [];
            for (const data of unitList) {
                const { canBeBlockedByUnit, needMovableTile, unitData } = data;
                if (canBeBlockedByUnit == null) {
                    Logger.error(`BwWarEventManager._callActionAddUnit() empty canBeBlockedByUnit.`);
                    break;
                }
                if (needMovableTile == null) {
                    Logger.error(`BwWarEventManager._callActionAddUnit() empty needMovableTile.`);
                    break;
                }
                if (unitData == null) {
                    Logger.error(`BwWarEventManager._callActionAddUnit() empty unitData.`);
                    break;
                }

                if (unitData.loaderUnitId != null) {
                    Logger.error(`BwWarEventManager._callActionAddUnit() invalid unitData.loaderUnitId.`);
                    break;
                }

                const unitId = unitMap.getNextUnitId();
                if (unitId == null) {
                    Logger.error(`BwWarEventManager._callActionAddUnit() empty unitId.`);
                    break;
                }

                const unitType = unitData.unitType;
                if (unitType == null) {
                    Logger.error(`BwWarEventManager._callActionAddUnit() empty unitType.`);
                    break;
                }

                const unitCfg = ConfigManager.getUnitTemplateCfg(configVersion, unitType);
                if (unitCfg == null) {
                    Logger.error(`BwWarEventManager._callActionAddUnit() empty unitCfg.`);
                    break;
                }

                const moveType = unitCfg.moveType;
                if (moveType == null) {
                    Logger.error(`BwWarEventManager._callActionAddUnit() empty moveType.`);
                    break;
                }

                const rawGridIndex = BwHelpers.convertGridIndex(unitData.gridIndex);
                if (rawGridIndex == null) {
                    Logger.error(`BwWarEventManager._callActionAddUnit() empty rawGridIndex.`);
                    break;
                }

                const player = playerManager.getPlayer(unitData.playerIndex);
                if (player == null) {
                    Logger.error(`BwWarEventManager._callActionAddUnit() empty player.`);
                    break;
                }

                if (!BwHelpers.checkIsUnitDataValidIgnoringUnitId({
                    unitData,
                    mapSize,
                    configVersion,
                    playersCountUnneutral,
                })) {
                    Logger.error(`BwWarEventManager._callActionAddUnit() invalid unitData.`);
                    break;
                }

                if (player.getAliveState() !== Types.PlayerAliveState.Alive) {
                    continue;
                }

                const gridIndex = getGridIndexForAddUnit({
                    origin  : rawGridIndex,
                    tileMap,
                    unitMap,
                    canBeBlockedByUnit,
                    needMovableTile,
                    moveType,
                });
                if (gridIndex == null) {
                    continue;
                }

                const revisedUnitData       = Helpers.deepClone(unitData);
                revisedUnitData.gridIndex   = gridIndex;
                revisedUnitData.unitId      = unitId;

                const unit = new (unitMap.getUnitClass())().init(revisedUnitData, configVersion);
                if (unit == null) {
                    Logger.error(`BwWarEventManager._callActionAddUnit() empty unit.`);
                    break;
                }

                resultingUnitList.push(revisedUnitData);
                unit.startRunning(war);
                unitMap.setNextUnitId(unitId + 1);
                unitMap.setUnitOnMap(unit);
            }
            return {
                indexForActionIdList,
                ExtraDataForWeaAddUnit: {
                    unitList    : resultingUnitList,
                },
            };
        }

        public updateWarEventCalledCountOnCall(eventId: number): void {                     // DONE
            const calledCountList = this._getCalledCountList();
            if (calledCountList == null) {
                this._setCalledCountList([{
                    eventId,
                    calledCountTotal        : 1,
                    calledCountInPlayerTurn : 1,
                }]);
            } else {
                const data = calledCountList.find(v => v.eventId === eventId);
                if (data) {
                    if (data.calledCountInPlayerTurn == null) {
                        Logger.error(`BwWarEventManager.updateWarEventCalledCountOnCall() empty data.calledCountInPlayerTurn.`);
                        return undefined;
                    }
                    if (data.calledCountTotal == null) {
                        Logger.error(`BwWarEventManager.updateWarEventCalledCountOnCall() empty data.calledCountTotal.`);
                        return undefined;
                    }
                    ++data.calledCountInPlayerTurn;
                    ++data.calledCountTotal;
                } else {
                    calledCountList.push({
                        eventId,
                        calledCountTotal        : 1,
                        calledCountInPlayerTurn : 1,
                    });
                }
            }
        }
        public updateWarEventCalledCountOnPlayerTurnSwitched(): void {                      // DONE
            const list = this._getCalledCountList();
            if (list) {
                list.forEach(v => {
                    v.calledCountInPlayerTurn = 0;
                });
            }
        }
        public getWarEventCalledCountTotal(eventId: number): number {                       // DONE
            const list = this._getCalledCountList();
            const data = list ? list.find(v => v.eventId === eventId) : null;
            return data ? data.calledCountTotal || 0 : 0;
        }
        public getWarEventCalledCountInPlayerTurn(eventId: number): number {                // DONE
            const list = this._getCalledCountList();
            const data = list ? list.find(v => v.eventId === eventId) : null;
            return data ? data.calledCountInPlayerTurn || 0 : 0;
        }

        public getCallableWarEventId(): number | undefined {                                // DONE
            const war = this._getWar();
            if (war == null) {
                Logger.error(`BwWarEventManager.getCallableWarEventId() empty war.`);
                return undefined;
            }

            const warRule = war.getWarRule();
            if (warRule == null) {
                Logger.error(`BwWarEventManager.getCallableWarEventId() empty warRule.`);
                return undefined;
            }

            for (const warEventId of warRule.warEventIdList || []) {
                if (this._checkCanCallWarEvent(warEventId)) {
                    return warEventId;
                }
            }
            return undefined;
        }

        private _checkCanCallWarEvent(warEventId: number): boolean | undefined {            // DONE
            const warEvent = this.getWarEvent(warEventId);
            if (warEvent == null) {
                Logger.error(`BwWarEventManager._checkCanCallWarEvent() empty warEvent.`);
                return undefined;
            }

            const nodeId = warEvent.conditionNodeId;
            if (nodeId == null) {
                Logger.error(`BwWarEventManager._checkCanCallWarEvent() empty nodeId.`);
                return undefined;
            }

            const maxCallCountInPlayerTurn = warEvent.maxCallCountInPlayerTurn;
            if (maxCallCountInPlayerTurn == null) {
                Logger.error(`BwWarEventManager._checkCanCallWarEvent() empty maxCallCountInPlayerTurn.`);
                return undefined;
            }

            const maxCallCountTotal = warEvent.maxCallCountTotal;
            if (maxCallCountTotal == null) {
                Logger.error(`BwWarEventManager._checkCanCallWarEvent() empty maxCallCountTotal.`);
                return undefined;
            }

            if ((this.getWarEventCalledCountInPlayerTurn(warEventId) >= maxCallCountInPlayerTurn) ||
                (this.getWarEventCalledCountTotal(warEventId) >= maxCallCountTotal)
            ) {
                return false;
            }

            return this._checkIsMeetConditionNode(nodeId);
        }

        private _checkIsMeetConditionNode(nodeId: number): boolean | undefined {            // DONE
            const node = this._getConditionNode(nodeId);
            if (node == null) {
                Logger.error(`BwWarEventManager._checkIsMeetConditionNode() empty node.`);
                return undefined;
            }

            const isAnd = node.isAnd;
            if (isAnd == null) {
                Logger.error(`BwWarEventManager._checkIsMeetConditionNode() empty isAnd.`);
                return undefined;
            }

            const conditionIdList = node.conditionIdList;
            if (conditionIdList) {
                for (const conditionId of conditionIdList) {
                    const isConditionMet = this._checkIsMeetCondition(conditionId);
                    if (isConditionMet == null) {
                        Logger.error(`BwWarEventManager._checkIsMeetConditionNode() empty isConditionMet.`);
                        return undefined;
                    }

                    if ((isAnd) && (!isConditionMet)) {
                        return false;
                    }
                    if ((!isAnd) && (isConditionMet)) {
                        return true;
                    }
                }
            }

            const subNodeIdList = node.subNodeIdList;
            if (subNodeIdList) {
                for (const subNodeId of subNodeIdList) {
                    const isSubNodeMet = this._checkIsMeetConditionNode(subNodeId);
                    if (isSubNodeMet == null) {
                        Logger.error(`BwWarEventManager._checkIsMeetConditionNode() empty isSubNodeMet.`);
                        return undefined;
                    }

                    if ((isAnd) && (!isSubNodeMet)) {
                        return false;
                    }
                    if ((!isAnd) && (isSubNodeMet)) {
                        return true;
                    }
                }
            }

            if ((!(conditionIdList || []).length) && (!(subNodeIdList || []).length)) {
                Logger.error(`BwWarEventManager._checkIsMeetConditionNode() empty conditionIdList and subNodeIdList.`);
                return undefined;
            }

            return true;
        }
        private _checkIsMeetCondition(conditionId: number): boolean | undefined {
            const condition = this._getCondition(conditionId);
            if (condition == null) {
                Logger.error(`BwWarEventManager._checkIsMeetCondition() empty condition.`);
                return undefined;
            }

            const wecCommonData = condition.WecCommonData;
            if (wecCommonData == null) {
                Logger.error(`BwWarEventManager._checkIsMeetCondition() empty wecCommonData.`);
                return undefined;
            }

            const isNot = wecCommonData.isNot;
            if (isNot == null) {
                Logger.error(`BwWarEventManager._checkIsMeetCondition() empty isNot.`);
                return undefined;
            }

            const conEventCalledCountTotalEqualTo = condition.WecEventCalledCountTotalEqualTo;
            if (conEventCalledCountTotalEqualTo) {
                return this._checkIsMeetConEventCalledCountTotalEqualTo(isNot, conEventCalledCountTotalEqualTo);
            }

            const conEventCalledCountTotalGreaterThan = condition.WecEventCalledCountTotalGreaterThan;
            if (conEventCalledCountTotalGreaterThan) {
                return this._checkIsMeetConEventCalledCountTotalGreaterThan(isNot, conEventCalledCountTotalGreaterThan);
            }

            const conEventCalledCountTotalLessThan = condition.WecEventCalledCountTotalLessThan;
            if (conEventCalledCountTotalLessThan) {
                return this._checkIsMeetConEventCalledCountTotalLessThan(isNot, conEventCalledCountTotalLessThan);
            }

            const conPlayerAliveStateEqualTo = condition.WecPlayerAliveStateEqualTo;
            if (conPlayerAliveStateEqualTo) {
                return this._checkIsMeetPlayerAliveStateEqualTo(isNot, conPlayerAliveStateEqualTo);
            }

            const conPlayerIndexInTurnEqualTo = condition.WecPlayerIndexInTurnEqualTo;
            if (conPlayerIndexInTurnEqualTo) {
                return this._checkIsMeetConPlayerIndexInTurnEqualTo(isNot, conPlayerIndexInTurnEqualTo);
            }

            const conPlayerIndexInTurnGreaterThan = condition.WecPlayerIndexInTurnGreaterThan;
            if (conPlayerIndexInTurnGreaterThan) {
                return this._checkIsMeetConPlayerIndexInTurnGreaterThan(isNot, conPlayerIndexInTurnGreaterThan);
            }

            const conPlayerIndexInTurnLessThan = condition.WecPlayerIndexInTurnLessThan;
            if (conPlayerIndexInTurnLessThan) {
                return this._checkIsMeetConPlayerIndexInTurnLessThan(isNot, conPlayerIndexInTurnLessThan);
            }

            const conTurnIndexEqualTo = condition.WecTurnIndexEqualTo;
            if (conTurnIndexEqualTo) {
                return this._checkIsMeetConTurnIndexEqualTo(isNot, conTurnIndexEqualTo);
            }

            const conTurnIndexGreaterThan = condition.WecTurnIndexGreaterThan;
            if (conTurnIndexGreaterThan) {
                return this._checkIsMeetConTurnIndexGreaterThan(isNot, conTurnIndexGreaterThan);
            }

            const conTurnIndexLessThan = condition.WecTurnIndexLessThan;
            if (conTurnIndexLessThan) {
                return this._checkIsMeetConTurnIndexLessThan(isNot, conTurnIndexLessThan);
            }

            const conTurnIndexRemainderEqualTo = condition.WecTurnIndexRemainderEqualTo;
            if (conTurnIndexRemainderEqualTo) {
                return this._checkIsMeetConTurnIndexRemainderEqualTo(isNot, conTurnIndexRemainderEqualTo);
            }

            const conTurnPhase = condition.WecTurnPhaseEqualTo;
            if (conTurnPhase) {
                return this._checkIsMeetConTurnPhaseEqualTo(isNot, conTurnPhase);
            }

            Logger.error(`BwWarEventManager._checkIsMeetCondition() invalid condition!`);
            return undefined;
        }

        private _checkIsMeetConEventCalledCountTotalEqualTo(isNot: boolean, condition: WarEvent.IWecEventCalledCountTotalEqualTo): boolean | undefined {
            const { eventIdEqualTo, countEqualTo } = condition;
            if (eventIdEqualTo == null) {
                Logger.error(`BwWarEventManager._checkIsMeetConEventCalledCountTotalEqualTo() empty eventIdEqualTo.`);
                return undefined;
            }

            if (countEqualTo == null) {
                Logger.error(`BwWarEventManager._checkIsMeetConEventCalledCountTotalEqualTo() empty countEqualTo.`);
                return undefined;
            }

            if (this.getWarEventCalledCountTotal(eventIdEqualTo) === countEqualTo) {
                return isNot ? false : true;
            }

            return isNot ? true : false;
        }
        private _checkIsMeetConEventCalledCountTotalGreaterThan(isNot: boolean, condition: WarEvent.IWecEventCalledCountTotalGreaterThan): boolean | undefined {
            const { eventIdEqualTo, countGreaterThan } = condition;
            if (eventIdEqualTo == null) {
                Logger.error(`BwWarEventManager._checkIsMeetConEventCalledCountTotalGreaterThan() empty eventIdEqualTo.`);
                return undefined;
            }

            if (countGreaterThan == null) {
                Logger.error(`BwWarEventManager._checkIsMeetConEventCalledCountTotalGreaterThan() empty countGreaterThan.`);
                return undefined;
            }

            if (this.getWarEventCalledCountTotal(eventIdEqualTo) > countGreaterThan) {
                return isNot ? false : true;
            }

            return isNot ? true : false;
        }
        private _checkIsMeetConEventCalledCountTotalLessThan(isNot: boolean, condition: WarEvent.IWecEventCalledCountTotalLessThan): boolean | undefined {
            const { eventIdEqualTo, countLessThan } = condition;
            if (eventIdEqualTo == null) {
                Logger.error(`BwWarEventManager._checkIsMeetConEventCalledCountTotalLessThan() empty eventIdEqualTo.`);
                return undefined;
            }

            if (countLessThan == null) {
                Logger.error(`BwWarEventManager._checkIsMeetConEventCalledCountTotalLessThan() invalid condition.`);
                return undefined;
            }

            if (this.getWarEventCalledCountTotal(eventIdEqualTo) < countLessThan) {
                return isNot ? false : true;
            }

            return isNot ? true : false;
        }

        private _checkIsMeetPlayerAliveStateEqualTo(isNot: boolean, condition: WarEvent.IWecPlayerAliveStateEqualTo): boolean | undefined {
            const { playerIndexEqualTo, aliveStateEqualTo } = condition;
            if (aliveStateEqualTo == null) {
                Logger.error(`BwWarEventManager._checkIsMeetPlayerAliveStateEqualTo() empty aliveStateEqualTo.`);
                return undefined;
            }

            if (playerIndexEqualTo == null) {
                Logger.error(`BwWarEventManager._checkIsMeetPlayerAliveStateEqualTo() empty playerIndexEqualTo.`);
                return undefined;
            }

            const war = this._getWar();
            if (war == null) {
                Logger.error(`BwWarEventManager._checkIsMeetPlayerAliveStateEqualTo() empty war.`);
                return undefined;
            }

            const player = war.getPlayer(playerIndexEqualTo);
            if (player == null) {
                return isNot ? true : false;
            }

            if (player.getAliveState() === aliveStateEqualTo) {
                return isNot ? false : true;
            }

            return isNot ? true : false;
        }

        private _checkIsMeetConPlayerIndexInTurnEqualTo(isNot: boolean, condition: WarEvent.IWecPlayerIndexInTurnEqualTo): boolean | undefined {
            const value = condition.valueEqualTo;
            if (value == null) {
                Logger.error(`BwWarEventManager._checkIsMeetConPlayerIndexInTurnEqualTo() invalid condition.`);
                return undefined;
            }

            const war = this._getWar();
            if (war == null) {
                Logger.error(`BwWarEventManager._checkIsMeetConPlayerIndexInTurnEqualTo() empty war.`);
                return undefined;
            }

            const playerIndex = war.getPlayerIndexInTurn();
            if (playerIndex == null) {
                Logger.error(`BwWarEventManager._checkIsMeetConPlayerIndexInTurnEqualTo() empty playerIndex.`);
                return undefined;
            }

            if (playerIndex === value) {
                return isNot ? false : true;
            }

            return isNot ? true : false;
        }
        private _checkIsMeetConPlayerIndexInTurnGreaterThan(isNot: boolean, condition: WarEvent.IWecPlayerIndexInTurnGreaterThan): boolean | undefined {
            const value = condition.valueGreaterThan;
            if (value == null) {
                Logger.error(`BwWarEventManager._checkIsMeetConPlayerIndexInTurnGreaterThan() invalid condition.`);
                return undefined;
            }

            const war = this._getWar();
            if (war == null) {
                Logger.error(`BwWarEventManager._checkIsMeetConPlayerIndexInTurnGreaterThan() empty war.`);
                return undefined;
            }

            const playerIndex = war.getPlayerIndexInTurn();
            if (playerIndex == null) {
                Logger.error(`BwWarEventManager._checkIsMeetConPlayerIndexInTurnGreaterThan() empty playerIndex.`);
                return undefined;
            }

            if (playerIndex > value) {
                return isNot ? false : true;
            }

            return isNot ? true : false;
        }
        private _checkIsMeetConPlayerIndexInTurnLessThan(isNot: boolean, condition: WarEvent.IWecPlayerIndexInTurnLessThan): boolean | undefined {
            const value = condition.valueLessThan;
            if (value == null) {
                Logger.error(`BwWarEventManager._checkIsMeetConPlayerIndexInTurnLessThan() invalid condition.`);
                return undefined;
            }

            const war = this._getWar();
            if (war == null) {
                Logger.error(`BwWarEventManager._checkIsMeetConPlayerIndexInTurnLessThan() empty war.`);
                return undefined;
            }

            const playerIndex = war.getPlayerIndexInTurn();
            if (playerIndex == null) {
                Logger.error(`BwWarEventManager._checkIsMeetConPlayerIndexInTurnLessThan() empty playerIndex.`);
                return undefined;
            }

            if (playerIndex < value) {
                return isNot ? false : true;
            }

            return isNot ? true : false;
        }

        private _checkIsMeetConTurnIndexEqualTo(isNot: boolean, condition: WarEvent.IWecTurnIndexEqualTo): boolean | undefined {
            const value = condition.valueEqualTo;
            if (value == null) {
                Logger.error(`BwWarEventManager._checkIsMeetConTurnIndexEqualTo() empty value.`);
                return undefined;
            }

            const war = this._getWar();
            if (war == null) {
                Logger.error(`BwWarEventManager._checkIsMeetConTurnIndexEqualTo() empty war.`);
                return undefined;
            }

            const turnManager = war.getTurnManager();
            if (turnManager == null) {
                Logger.error(`BwWarEventManager._checkIsMeetConTurnIndexEqualTo() empty turnManager.`);
                return undefined;
            }

            const turnIndex = turnManager.getTurnIndex();
            if (turnIndex == null) {
                Logger.error(`BwWarEventManager._checkIsMeetConTurnIndexEqualTo() empty turnIndex.`);
                return undefined;
            }

            if (turnIndex === value) {
                return isNot ? false : true;
            }

            return isNot ? true : false;
        }
        private _checkIsMeetConTurnIndexGreaterThan(isNot: boolean, condition: WarEvent.IWecTurnIndexGreaterThan): boolean | undefined {
            const value = condition.valueGreaterThan;
            if (value == null) {
                Logger.error(`BwWarEventManager._checkIsMeetConTurnIndexGreaterThan() empty value.`);
                return undefined;
            }

            const war = this._getWar();
            if (war == null) {
                Logger.error(`BwWarEventManager._checkIsMeetConTurnIndexGreaterThan() empty war.`);
                return undefined;
            }

            const turnManager = war.getTurnManager();
            if (turnManager == null) {
                Logger.error(`BwWarEventManager._checkIsMeetConTurnIndexGreaterThan() empty turnManager.`);
                return undefined;
            }

            const turnIndex = turnManager.getTurnIndex();
            if (turnIndex == null) {
                Logger.error(`BwWarEventManager._checkIsMeetConTurnIndexGreaterThan() empty turnIndex.`);
                return undefined;
            }

            if (turnIndex > value) {
                return isNot ? false : true;
            }

            return isNot ? true : false;
        }
        private _checkIsMeetConTurnIndexLessThan(isNot: boolean, condition: WarEvent.IWecTurnIndexLessThan): boolean | undefined {
            const value = condition.valueLessThan;
            if (value == null) {
                Logger.error(`BwWarEventManager._checkIsMeetConTurnIndexLessThan() invalid condition.`);
                return undefined;
            }

            const war = this._getWar();
            if (war == null) {
                Logger.error(`BwWarEventManager._checkIsMeetConTurnIndexEqualTo() empty war.`);
                return undefined;
            }

            const turnManager = war.getTurnManager();
            if (turnManager == null) {
                Logger.error(`BwWarEventManager._checkIsMeetConTurnIndexEqualTo() empty turnManager.`);
                return undefined;
            }

            const turnIndex = turnManager.getTurnIndex();
            if (turnIndex == null) {
                Logger.error(`BwWarEventManager._checkIsMeetConTurnIndexEqualTo() empty turnIndex.`);
                return undefined;
            }

            if (turnIndex < value) {
                return isNot ? false : true;
            }

            return isNot ? true : false;
        }
        private _checkIsMeetConTurnIndexRemainderEqualTo(isNot: boolean, condition: WarEvent.IWecTurnIndexRemainderEqualTo): boolean | undefined {
            const { divider, remainderEqualTo } = condition;
            if ((!divider) || (remainderEqualTo == null)) {
                Logger.error(`BwWarEventManager._checkIsMeetConTurnIndexRemainderEqualTo() invalid condition.`);
                return undefined;
            }

            const war = this._getWar();
            if (war == null) {
                Logger.error(`BwWarEventManager._checkIsMeetConTurnIndexEqualTo() empty war.`);
                return undefined;
            }

            const turnManager = war.getTurnManager();
            if (turnManager == null) {
                Logger.error(`BwWarEventManager._checkIsMeetConTurnIndexEqualTo() empty turnManager.`);
                return undefined;
            }

            const turnIndex = turnManager.getTurnIndex();
            if (turnIndex == null) {
                Logger.error(`BwWarEventManager._checkIsMeetConTurnIndexEqualTo() empty turnIndex.`);
                return undefined;
            }

            if (turnIndex % divider === remainderEqualTo) {
                return isNot ? false : true;
            }

            return isNot ? true : false;
        }

        private _checkIsMeetConTurnPhaseEqualTo(isNot: boolean, condition: WarEvent.IWecTurnPhaseEqualTo): boolean | undefined {
            const value = condition.valueEqualTo;
            if (value == null) {
                Logger.error(`BwWarEventManager._checkIsMeetConTurnPhaseEqualTo() invalid condition.`);
                return undefined;
            }

            const war = this._getWar();
            if (war == null) {
                Logger.error(`BwWarEventManager._checkIsMeetConTurnPhaseEqualTo() empty war.`);
                return undefined;
            }

            const turnManager = war.getTurnManager();
            if (turnManager == null) {
                Logger.error(`BwWarEventManager._checkIsMeetConTurnPhaseEqualTo() empty turnManager.`);
                return undefined;
            }

            const phaseCode = turnManager.getPhaseCode();
            if (phaseCode == null) {
                Logger.error(`BwWarEventManager._checkIsMeetConTurnPhaseEqualTo() empty phaseCode.`);
                return undefined;
            }

            if (phaseCode === value) {
                return isNot ? false : true;
            }

            return isNot ? true : false;
        }

        public getWarEvent(warEventId: number): WarEvent.IWarEvent | undefined {                    // DONE
            const warEventData = this.getWarEventData();
            if (warEventData == null) {
                Logger.error(`BwWarEventManager._getWarEvent() empty warEventData.`);
                return undefined;
            }

            const eventList = warEventData.eventList;
            if (eventList == null) {
                Logger.error(`BwWarEventManager._getWarEvent() empty eventList.`);
                return undefined;
            }

            return eventList.find(v => v.eventId === warEventId);
        }
        private _getConditionNode(nodeId: number): WarEvent.IWarEventConditionNode | undefined {    // DONE
            const warEventData = this.getWarEventData();
            if (warEventData == null) {
                Logger.error(`BwWarEventManager._getConditionNode() empty warEventData.`);
                return undefined;
            }

            const list = warEventData.conditionNodeList;
            if (list == null) {
                Logger.error(`BwWarEventManager._getConditionNode() empty list.`);
                return undefined;
            }

            return list.find(v => v.nodeId === nodeId);
        }
        private _getCondition(conditionId: number): WarEvent.IWarEventCondition | undefined {       // DONE
            const warEventData = this.getWarEventData();
            if (warEventData == null) {
                Logger.error(`BwWarEventManager._getCondition() empty warEventData.`);
                return undefined;
            }

            const list = warEventData.conditionList;
            if (list == null) {
                Logger.error(`BwWarEventManager._getCondition() empty list.`);
                return undefined;
            }

            return list.find(v => v.WecCommonData.conditionId === conditionId);
        }
        public getWarEventAction(actionId: number): WarEvent.IWarEventAction | undefined {          // DONE
            const warEventData = this.getWarEventData();
            if (warEventData == null) {
                Logger.error(`BwWarEventManager._getAction() empty warEventData.`);
                return undefined;
            }

            const list = warEventData.actionList;
            if (list == null) {
                Logger.error(`BwWarEventManager._getAction() empty list.`);
                return undefined;
            }

            return list.find(v => v.WarEventActionCommonData.actionId === actionId);
        }
    }

    function getGridIndexForAddUnit({ origin, unitMap, tileMap, moveType, needMovableTile, canBeBlockedByUnit }: {
        origin              : Types.GridIndex;
        unitMap             : BwUnitMap;
        tileMap             : BwTileMap;
        moveType            : Types.MoveType;
        needMovableTile     : boolean;
        canBeBlockedByUnit  : boolean;
    }): Types.GridIndex | undefined {
        const mapSize = tileMap.getMapSize();
        if (mapSize == null) {
            Logger.error(`BwWarEventManager.getGridIndexForAddUnit() empty mapSize.`);
            return undefined;
        }

        if ((canBeBlockedByUnit) && (unitMap.getUnitOnMap(origin))) {
            return undefined;
        }

        const maxDistance = Math.max(
            GridIndexHelpers.getDistance(origin, { x: 0,                    y: 0 }),
            GridIndexHelpers.getDistance(origin, { x: 0,                    y: mapSize.height - 1 }),
            GridIndexHelpers.getDistance(origin, { x: mapSize.width - 1,    y: 0 }),
            GridIndexHelpers.getDistance(origin, { x: mapSize.width - 1,    y: mapSize.height - 1 }),
        );

        for (let distance = 0; distance <= maxDistance; ++distance) {
            const gridIndex = GridIndexHelpers.getGridsWithinDistance(
                origin,
                distance,
                distance,
                mapSize,
                (gridIndex): boolean => {
                    if (unitMap.getUnitOnMap(gridIndex)) {
                        return false;
                    }

                    if (needMovableTile) {
                        const tile = tileMap.getTile(gridIndex);
                        if (tile == null) {
                            Logger.error(`BwWarEventManager.getGridIndexForAddUnit() empty tile.`);
                            return false;
                        }

                        if (tile.getMoveCostByMoveType(moveType) == null) {
                            return false;
                        }
                    }

                    return true;
                }
            )[0];
            if (gridIndex) {
                return gridIndex;
            }
        }

        return undefined;
    }
}
