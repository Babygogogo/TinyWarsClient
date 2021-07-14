
import BwHelpers            from "../../baseWar/model/BwHelpers";
import TwnsClientErrorCode  from "../../tools/helpers/ClientErrorCode";
import CommonConstants      from "../../tools/helpers/CommonConstants";
import ConfigManager        from "../../tools/helpers/ConfigManager";
import GridIndexHelpers     from "../../tools/helpers/GridIndexHelpers";
import Helpers              from "../../tools/helpers/Helpers";
import Logger               from "../../tools/helpers/Logger";
import Types                from "../../tools/helpers/Types";
import ProtoTypes           from "../../tools/proto/ProtoTypes";
import TwnsBwTileMap        from "./BwTileMap";
import TwnsBwUnit           from "./BwUnit";
import TwnsBwUnitMap        from "./BwUnitMap";
import TwnsBwWar            from "./BwWar";

namespace TwnsBwWarEventManager {
    import ISerialWarEventManager           = ProtoTypes.WarSerialization.ISerialWarEventManager;
    import IDataForWarEventCalledCount      = ProtoTypes.WarSerialization.IDataForWarEventCalledCount;
    import IWarEventFullData                = ProtoTypes.Map.IWarEventFullData;
    import WarEvent                         = ProtoTypes.WarEvent;
    import IExtraDataForSystemCallWarEvent  = ProtoTypes.WarAction.WarActionSystemCallWarEvent.IExtraDataForSystemCallWarEvent;
    import ClientErrorCode                  = TwnsClientErrorCode.ClientErrorCode;
    import BwUnitMap                        = TwnsBwUnitMap.BwUnitMap;
    import BwWar                            = TwnsBwWar.BwWar;

    export class BwWarEventManager {
        private _war?               : BwWar;
        private _warEventFullData?  : IWarEventFullData | null | undefined;
        private _calledCountList?   : IDataForWarEventCalledCount[] | null | undefined;

        public init(data: ISerialWarEventManager | null | undefined): ClientErrorCode {
            if (!data) {
                this._setWarEventFullData(null);
                this._setCalledCountList(null);
            } else {
                // TODO: validate the data.
                const warEventFullData = data.warEventFullData;



                this._setWarEventFullData(data.warEventFullData);
                this._setCalledCountList(data.calledCountList);
            }

            return ClientErrorCode.NoError;
        }
        public fastInit(data: ISerialWarEventManager): ClientErrorCode {
            return this.init(data);
        }

        public serialize(): ISerialWarEventManager | undefined {
            return {
                warEventFullData    : this.getWarEventFullData(),
                calledCountList     : this._getCalledCountList(),
            };
        }
        public serializeForCreateSfw(): ISerialWarEventManager | undefined {
            return Helpers.deepClone({
                warEventFullData    : this.getWarEventFullData(),
                calledCountList     : this._getCalledCountList(),
            });
        }
        public serializeForCreateMfr(): ISerialWarEventManager | undefined {
            return this.serializeForCreateSfw();
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

        protected _setWarEventFullData(data: IWarEventFullData): void {
            this._warEventFullData = data;
        }
        public getWarEventFullData(): IWarEventFullData | undefined | null {
            return this._warEventFullData;
        }

        protected _setCalledCountList(list: IDataForWarEventCalledCount[] | null | undefined): void {
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
            const actionIdArray = event.actionIdArray || [];
            for (let index = 0; index < actionIdArray.length; ++index) {
                const extraData = await this._callWarAction(actionIdArray[index], index, isFastExecute);
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

            if (action.WeaAddUnit) {
                return await this._callActionAddUnit(indexForActionIdList, action.WeaAddUnit, isFastExecute);
            } else if (action.WeaSetPlayerAliveState) {
                return await this._callActionSetPlayerAliveState(action.WeaSetPlayerAliveState);
            }

            // TODO add more actions.
        }
        private async _callActionAddUnit(indexForActionIdList: number, action: WarEvent.IWeaAddUnit, isFastExecute: boolean): Promise<IExtraDataForSystemCallWarEvent | undefined> {
            const unitArray = action.unitArray;
            if (unitArray == null) {
                Logger.error(`BwWarEventManager._callActionAddUnit() empty unitArray.`);
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
            for (const data of unitArray) {
                const { canBeBlockedByUnit, needMovableTile, unitData } = data;
                if (canBeBlockedByUnit == null) {
                    Logger.error(`BwWarEventManager._callActionAddUnit() empty canBeBlockedByUnit.`);
                    continue;
                }
                if (needMovableTile == null) {
                    Logger.error(`BwWarEventManager._callActionAddUnit() empty needMovableTile.`);
                    continue;
                }
                if (unitData == null) {
                    Logger.error(`BwWarEventManager._callActionAddUnit() empty unitData.`);
                    continue;
                }

                if (unitData.loaderUnitId != null) {
                    Logger.error(`BwWarEventManager._callActionAddUnit() invalid unitData.loaderUnitId.`);
                    continue;
                }

                const unitId = unitMap.getNextUnitId();
                if (unitId == null) {
                    Logger.error(`BwWarEventManager._callActionAddUnit() empty unitId.`);
                    continue;
                }

                const unitType = unitData.unitType;
                if (unitType == null) {
                    Logger.error(`BwWarEventManager._callActionAddUnit() empty unitType.`);
                    continue;
                }

                const unitCfg = ConfigManager.getUnitTemplateCfg(configVersion, unitType);
                if (unitCfg == null) {
                    Logger.error(`BwWarEventManager._callActionAddUnit() empty unitCfg.`);
                    continue;
                }

                const moveType = unitCfg.moveType;
                if (moveType == null) {
                    Logger.error(`BwWarEventManager._callActionAddUnit() empty moveType.`);
                    continue;
                }

                const rawGridIndex = GridIndexHelpers.convertGridIndex(unitData.gridIndex);
                if (rawGridIndex == null) {
                    Logger.error(`BwWarEventManager._callActionAddUnit() empty rawGridIndex.`);
                    continue;
                }

                const playerIndex = unitData.playerIndex;
                if (playerIndex == null) {
                    Logger.error(`BwWarEventManager._callActionAddUnit() empty playerIndex.`);
                    continue;
                }

                if (BwHelpers.getErrorCodeForUnitDataIgnoringUnitId({
                    unitData,
                    mapSize,
                    configVersion,
                    playersCountUnneutral   : CommonConstants.WarMaxPlayerIndex,
                })) {
                    Logger.error(`BwWarEventManager._callActionAddUnit() invalid unitData.`);
                    continue;
                }

                const player = playerManager.getPlayer(playerIndex);
                if (player == null) {
                    continue;
                }
                if (player.getAliveState() === Types.PlayerAliveState.Dead) {
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

                const unit      = new TwnsBwUnit.BwUnit();
                const unitError = unit.init(revisedUnitData, configVersion);
                if (unitError) {
                    Logger.error(`BwWarEventManager._callActionAddUnit() unitError: ${unitError}`);
                    continue;
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
        private async _callActionSetPlayerAliveState(action: WarEvent.IWeaSetPlayerAliveState): Promise<undefined> {
            const war = this._getWar();
            if (war == null) {
                Logger.error(`BwWarEventManager._callActionSetPlayerAliveState() empty war.`);
                return undefined;
            }

            const playerIndex = action.playerIndex;
            if ((playerIndex == null) || (playerIndex === CommonConstants.WarNeutralPlayerIndex)) {
                Logger.error(`BwWarEventManager._callActionSetPlayerAliveState() invalid playerIndex.`);
                return undefined;
            }

            const playerAliveState: Types.PlayerAliveState | null | undefined = action.playerAliveState;
            if (playerAliveState == null) {
                Logger.error(`BwWarEventManager._callActionSetPlayerAliveState() empty playerAliveState.`);
                return undefined;
            }

            if ((playerAliveState !== Types.PlayerAliveState.Alive) &&
                (playerAliveState !== Types.PlayerAliveState.Dead)  &&
                (playerAliveState !== Types.PlayerAliveState.Dying)
            ) {
                Logger.error(`BwWarEventManager._callActionSetPlayerAliveState() invalid playerAliveState.`);
                return undefined;
            }

            const player = war.getPlayer(playerIndex);
            if (player) {
                player.setAliveState(playerAliveState);
            }

            return undefined;
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

            for (const warEventId of warRule.warEventIdArray || []) {
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

            const conditionIdArray = node.conditionIdArray;
            if (conditionIdArray) {
                for (const conditionId of conditionIdArray) {
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

            const subNodeIdArray = node.subNodeIdArray;
            if (subNodeIdArray) {
                for (const subNodeId of subNodeIdArray) {
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

            if ((!(conditionIdArray || []).length) && (!(subNodeIdArray || []).length)) {
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

            const conEventCalledCountTotalEqualTo = condition.WecEventCalledCountTotalEqualTo;
            if (conEventCalledCountTotalEqualTo) {
                return this._checkIsMeetConEventCalledCountTotalEqualTo(conEventCalledCountTotalEqualTo);
            }

            const conEventCalledCountTotalGreaterThan = condition.WecEventCalledCountTotalGreaterThan;
            if (conEventCalledCountTotalGreaterThan) {
                return this._checkIsMeetConEventCalledCountTotalGreaterThan(conEventCalledCountTotalGreaterThan);
            }

            const conEventCalledCountTotalLessThan = condition.WecEventCalledCountTotalLessThan;
            if (conEventCalledCountTotalLessThan) {
                return this._checkIsMeetConEventCalledCountTotalLessThan(conEventCalledCountTotalLessThan);
            }

            const conPlayerAliveStateEqualTo = condition.WecPlayerAliveStateEqualTo;
            if (conPlayerAliveStateEqualTo) {
                return this._checkIsMeetPlayerAliveStateEqualTo(conPlayerAliveStateEqualTo);
            }

            const conPlayerIndexInTurnEqualTo = condition.WecPlayerIndexInTurnEqualTo;
            if (conPlayerIndexInTurnEqualTo) {
                return this._checkIsMeetConPlayerIndexInTurnEqualTo(conPlayerIndexInTurnEqualTo);
            }

            const conPlayerIndexInTurnGreaterThan = condition.WecPlayerIndexInTurnGreaterThan;
            if (conPlayerIndexInTurnGreaterThan) {
                return this._checkIsMeetConPlayerIndexInTurnGreaterThan(conPlayerIndexInTurnGreaterThan);
            }

            const conPlayerIndexInTurnLessThan = condition.WecPlayerIndexInTurnLessThan;
            if (conPlayerIndexInTurnLessThan) {
                return this._checkIsMeetConPlayerIndexInTurnLessThan(conPlayerIndexInTurnLessThan);
            }

            const conTurnIndexEqualTo = condition.WecTurnIndexEqualTo;
            if (conTurnIndexEqualTo) {
                return this._checkIsMeetConTurnIndexEqualTo(conTurnIndexEqualTo);
            }

            const conTurnIndexGreaterThan = condition.WecTurnIndexGreaterThan;
            if (conTurnIndexGreaterThan) {
                return this._checkIsMeetConTurnIndexGreaterThan(conTurnIndexGreaterThan);
            }

            const conTurnIndexLessThan = condition.WecTurnIndexLessThan;
            if (conTurnIndexLessThan) {
                return this._checkIsMeetConTurnIndexLessThan(conTurnIndexLessThan);
            }

            const conTurnIndexRemainderEqualTo = condition.WecTurnIndexRemainderEqualTo;
            if (conTurnIndexRemainderEqualTo) {
                return this._checkIsMeetConTurnIndexRemainderEqualTo(conTurnIndexRemainderEqualTo);
            }

            const conTurnPhase = condition.WecTurnPhaseEqualTo;
            if (conTurnPhase) {
                return this._checkIsMeetConTurnPhaseEqualTo(conTurnPhase);
            }

            Logger.error(`BwWarEventManager._checkIsMeetCondition() invalid condition!`);
            return undefined;
        }

        private _checkIsMeetConEventCalledCountTotalEqualTo(condition: WarEvent.IWecEventCalledCountTotalEqualTo): boolean | undefined {
            const { eventIdEqualTo, countEqualTo, isNot } = condition;
            if (eventIdEqualTo == null) {
                Logger.error(`BwWarEventManager._checkIsMeetConEventCalledCountTotalEqualTo() empty eventIdEqualTo.`);
                return undefined;
            }

            if (countEqualTo == null) {
                Logger.error(`BwWarEventManager._checkIsMeetConEventCalledCountTotalEqualTo() empty countEqualTo.`);
                return undefined;
            }

            return (this.getWarEventCalledCountTotal(eventIdEqualTo) === countEqualTo)
                ? (isNot ? false : true)
                : (isNot ? true : false);
        }
        private _checkIsMeetConEventCalledCountTotalGreaterThan(condition: WarEvent.IWecEventCalledCountTotalGreaterThan): boolean | undefined {
            const { eventIdEqualTo, countGreaterThan, isNot } = condition;
            if (eventIdEqualTo == null) {
                Logger.error(`BwWarEventManager._checkIsMeetConEventCalledCountTotalGreaterThan() empty eventIdEqualTo.`);
                return undefined;
            }

            if (countGreaterThan == null) {
                Logger.error(`BwWarEventManager._checkIsMeetConEventCalledCountTotalGreaterThan() empty countGreaterThan.`);
                return undefined;
            }

            return (this.getWarEventCalledCountTotal(eventIdEqualTo) > countGreaterThan)
                ? (isNot ? false : true)
                : (isNot ? true : false);
        }
        private _checkIsMeetConEventCalledCountTotalLessThan(condition: WarEvent.IWecEventCalledCountTotalLessThan): boolean | undefined {
            const { eventIdEqualTo, countLessThan, isNot } = condition;
            if (eventIdEqualTo == null) {
                Logger.error(`BwWarEventManager._checkIsMeetConEventCalledCountTotalLessThan() empty eventIdEqualTo.`);
                return undefined;
            }

            if (countLessThan == null) {
                Logger.error(`BwWarEventManager._checkIsMeetConEventCalledCountTotalLessThan() invalid condition.`);
                return undefined;
            }

            return (this.getWarEventCalledCountTotal(eventIdEqualTo) < countLessThan)
                ? (isNot ? false : true)
                : (isNot ? true : false);
        }

        private _checkIsMeetPlayerAliveStateEqualTo(condition: WarEvent.IWecPlayerAliveStateEqualTo): boolean | undefined {
            const { playerIndexEqualTo, aliveStateEqualTo, isNot } = condition;
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
            return ((player ? player.getAliveState() : undefined) === aliveStateEqualTo)
                ? (isNot ? false : true)
                : (isNot ? true : false);
        }

        private _checkIsMeetConPlayerIndexInTurnEqualTo(condition: WarEvent.IWecPlayerIndexInTurnEqualTo): boolean | undefined {
            const { valueEqualTo, isNot } = condition;
            if (valueEqualTo == null) {
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

            return (playerIndex === valueEqualTo)
                ? (isNot ? false : true)
                : (isNot ? true : false);
        }
        private _checkIsMeetConPlayerIndexInTurnGreaterThan(condition: WarEvent.IWecPlayerIndexInTurnGreaterThan): boolean | undefined {
            const { valueGreaterThan, isNot } = condition;
            if (valueGreaterThan == null) {
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

            return (playerIndex > valueGreaterThan)
                ? (isNot ? false : true)
                : (isNot ? true : false);
        }
        private _checkIsMeetConPlayerIndexInTurnLessThan(condition: WarEvent.IWecPlayerIndexInTurnLessThan): boolean | undefined {
            const { valueLessThan, isNot } = condition;
            if (valueLessThan == null) {
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

            return (playerIndex < valueLessThan)
                ? (isNot ? false : true)
                : (isNot ? true : false);
        }

        private _checkIsMeetConTurnIndexEqualTo(condition: WarEvent.IWecTurnIndexEqualTo): boolean | undefined {
            const { valueEqualTo, isNot } = condition;
            if (valueEqualTo == null) {
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

            return (turnIndex === valueEqualTo)
                ? (isNot ? false : true)
                : (isNot ? true : false);
        }
        private _checkIsMeetConTurnIndexGreaterThan(condition: WarEvent.IWecTurnIndexGreaterThan): boolean | undefined {
            const { valueGreaterThan, isNot } = condition;
            if (valueGreaterThan == null) {
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

            return (turnIndex > valueGreaterThan)
                ? (isNot ? false : true)
                : (isNot ? true : false);
        }
        private _checkIsMeetConTurnIndexLessThan(condition: WarEvent.IWecTurnIndexLessThan): boolean | undefined {
            const { valueLessThan, isNot } = condition;
            if (valueLessThan == null) {
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

            return (turnIndex < valueLessThan)
                ? (isNot ? false : true)
                : (isNot ? true : false);
        }
        private _checkIsMeetConTurnIndexRemainderEqualTo(condition: WarEvent.IWecTurnIndexRemainderEqualTo): boolean | undefined {
            const { divider, remainderEqualTo, isNot } = condition;
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

            return (turnIndex % divider === remainderEqualTo)
                ? (isNot ? false : true)
                : (isNot ? true : false);
        }

        private _checkIsMeetConTurnPhaseEqualTo(condition: WarEvent.IWecTurnPhaseEqualTo): boolean | undefined {
            const { valueEqualTo, isNot } = condition;
            if (valueEqualTo == null) {
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

            return (phaseCode === valueEqualTo)
                ? (isNot ? false : true)
                : (isNot ? true : false);
        }

        public getWarEvent(warEventId: number): WarEvent.IWarEvent | undefined {                    // DONE
            const warEventData = this.getWarEventFullData();
            if (warEventData == null) {
                Logger.error(`BwWarEventManager._getWarEvent() empty warEventData.`);
                return undefined;
            }

            const eventArray = warEventData.eventArray;
            if (eventArray == null) {
                Logger.error(`BwWarEventManager._getWarEvent() empty eventArray.`);
                return undefined;
            }

            return eventArray.find(v => v.eventId === warEventId);
        }
        private _getConditionNode(nodeId: number): WarEvent.IWarEventConditionNode | undefined {    // DONE
            const warEventData = this.getWarEventFullData();
            if (warEventData == null) {
                Logger.error(`BwWarEventManager._getConditionNode() empty warEventData.`);
                return undefined;
            }

            const arr = warEventData.conditionNodeArray;
            if (arr == null) {
                Logger.error(`BwWarEventManager._getConditionNode() empty arr.`);
                return undefined;
            }

            return arr.find(v => v.nodeId === nodeId);
        }
        private _getCondition(conditionId: number): WarEvent.IWarEventCondition | undefined {       // DONE
            const warEventData = this.getWarEventFullData();
            if (warEventData == null) {
                Logger.error(`BwWarEventManager._getCondition() empty warEventData.`);
                return undefined;
            }

            const arr = warEventData.conditionArray;
            if (arr == null) {
                Logger.error(`BwWarEventManager._getCondition() empty arr.`);
                return undefined;
            }

            return arr.find(v => v.WecCommonData.conditionId === conditionId);
        }
        public getWarEventAction(actionId: number): WarEvent.IWarEventAction | undefined {          // DONE
            const warEventData = this.getWarEventFullData();
            if (warEventData == null) {
                Logger.error(`BwWarEventManager._getAction() empty warEventData.`);
                return undefined;
            }

            const arr = warEventData.actionArray;
            if (arr == null) {
                Logger.error(`BwWarEventManager._getAction() empty arr.`);
                return undefined;
            }

            return arr.find(v => v.WeaCommonData.actionId === actionId);
        }
    }

    function getGridIndexForAddUnit({ origin, unitMap, tileMap, moveType, needMovableTile, canBeBlockedByUnit }: {
        origin              : Types.GridIndex;
        unitMap             : BwUnitMap;
        tileMap             : TwnsBwTileMap.BwTileMap;
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
                (g): boolean => {
                    if (unitMap.getUnitOnMap(g)) {
                        return false;
                    }

                    const tile = tileMap.getTile(g);
                    if (tile == null) {
                        Logger.error(`BwWarEventManager.getGridIndexForAddUnit() empty tile.`);
                        return false;
                    }

                    if (tile.getMaxHp() != null) {
                        return false;
                    }

                    if ((needMovableTile) && (tile.getMoveCostByMoveType(moveType) == null)) {
                        return false;
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

export default TwnsBwWarEventManager;
