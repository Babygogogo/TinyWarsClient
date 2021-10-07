
import TwnsClientErrorCode  from "../../tools/helpers/ClientErrorCode";
import CommonConstants      from "../../tools/helpers/CommonConstants";
import CompatibilityHelpers from "../../tools/helpers/CompatibilityHelpers";
import ConfigManager        from "../../tools/helpers/ConfigManager";
import GridIndexHelpers     from "../../tools/helpers/GridIndexHelpers";
import Helpers              from "../../tools/helpers/Helpers";
import Types                from "../../tools/helpers/Types";
import ProtoTypes           from "../../tools/proto/ProtoTypes";
import WarCommonHelpers     from "../../tools/warHelpers/WarCommonHelpers";
import TwnsBwDialoguePanel  from "../view/BwDialoguePanel";
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
        private _warEventFullData?  : IWarEventFullData | null;
        private _calledCountList?   : IDataForWarEventCalledCount[] | null;

        public init(data: Types.Undefinable<ISerialWarEventManager>): void {
            if (!data) {
                this._setWarEventFullData(null);
                this._setCalledCountList(null);
            } else {
                // TODO: validate the data.
                const warEventFullData = data.warEventFullData ?? null;

                this._setWarEventFullData(warEventFullData);
                this._setCalledCountList(data.calledCountList ?? null);
            }
        }
        public fastInit(data: ISerialWarEventManager): void {
            this.init(data);
        }

        public serialize(): ISerialWarEventManager {
            return {
                warEventFullData    : this.getWarEventFullData(),
                calledCountList     : this._getCalledCountList(),
            };
        }
        public serializeForCreateSfw(): ISerialWarEventManager {
            return Helpers.deepClone({
                warEventFullData    : this.getWarEventFullData(),
                calledCountList     : this._getCalledCountList(),
            });
        }
        public serializeForCreateMfr(): ISerialWarEventManager {
            return this.serializeForCreateSfw();
        }

        public startRunning(war: BwWar): void {
            this._setWar(war);
        }

        private _setWar(war: BwWar): void {
            this._war = war;
        }
        private _getWar(): BwWar {
            return Helpers.getExisted(this._war);
        }

        protected _setWarEventFullData(data: IWarEventFullData | null): void {
            this._warEventFullData = data;
        }
        public getWarEventFullData(): IWarEventFullData | null {
            return Helpers.getDefined(this._warEventFullData, ClientErrorCode.BwWarEventManager_GetWarEventFullData_00);
        }

        protected _setCalledCountList(list: IDataForWarEventCalledCount[] | null): void {
            this._calledCountList = list;
        }
        private _getCalledCountList(): IDataForWarEventCalledCount[] | null {
            return Helpers.getDefined(this._calledCountList, ClientErrorCode.BwWarEventManager_GetCalledCountList_00);
        }

        public async callWarEvent(warEventId: number, isFastExecute: boolean): Promise<IExtraDataForSystemCallWarEvent[]> { // DONE
            const event = this.getWarEvent(warEventId);
            if (event == null) {
                throw Helpers.newError(`Empty event.`);
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
        private async _callWarAction(warEventActionId: number, indexForActionIdList: number, isFastExecute: boolean): Promise<IExtraDataForSystemCallWarEvent | null> {
            const action = this.getWarEventAction(warEventActionId);
            if (action.WeaAddUnit) {
                return await this._callActionAddUnit(indexForActionIdList, action.WeaAddUnit, isFastExecute);
            } else if (action.WeaSetPlayerAliveState) {
                return await this._callActionSetPlayerAliveState(action.WeaSetPlayerAliveState);
            } else if (action.WeaDialogue) {
                return await this._callActionDialogue(action.WeaDialogue, isFastExecute);
            } else {
                throw Helpers.newError(`Invalid action.`);
            }

            // TODO add more actions.
        }
        private async _callActionAddUnit(indexForActionIdList: number, action: WarEvent.IWeaAddUnit, isFastExecute: boolean): Promise<IExtraDataForSystemCallWarEvent | null> {
            const unitArray = action.unitArray;
            if ((unitArray == null) || (!unitArray.length)) {
                throw Helpers.newError(`Empty unitArray.`);
            }

            const war               = this._getWar();
            const unitMap           = war.getUnitMap();
            const tileMap           = war.getTileMap();
            const playerManager     = war.getPlayerManager();
            const configVersion     = war.getConfigVersion();
            const mapSize           = unitMap.getMapSize();
            const resultingUnitList : ProtoTypes.WarSerialization.ISerialUnit[] = [];
            for (const data of unitArray) {
                const unitData = Helpers.getExisted(data.unitData);
                if (unitData.loaderUnitId != null) {
                    throw Helpers.newError(`unitData.loaderUnitId != null: ${unitData.loaderUnitId}`);
                }

                const canBeBlockedByUnit    = Helpers.getExisted(data.canBeBlockedByUnit);
                const needMovableTile       = Helpers.getExisted(data.needMovableTile);
                const unitId                = unitMap.getNextUnitId();
                const unitType              = Helpers.getExisted(unitData.unitType);
                const unitCfg               = ConfigManager.getUnitTemplateCfg(configVersion, unitType);
                const moveType              = unitCfg.moveType;
                const rawGridIndex          = Helpers.getExisted(GridIndexHelpers.convertGridIndex(unitData.gridIndex));
                if (WarCommonHelpers.getErrorCodeForUnitDataIgnoringUnitId({
                    unitData,
                    mapSize,
                    configVersion,
                    playersCountUnneutral   : CommonConstants.WarMaxPlayerIndex,
                })) {
                    throw Helpers.newError(`Invalid unitData: ${JSON.stringify(unitData)}`);
                }

                const playerIndex = Helpers.getExisted(unitData.playerIndex);
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

                const unit = new TwnsBwUnit.BwUnit();
                unit.init(revisedUnitData, configVersion);

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
        private async _callActionSetPlayerAliveState(action: WarEvent.IWeaSetPlayerAliveState): Promise<null> {
            const war = this._getWar();
            const playerIndex = action.playerIndex;
            if ((playerIndex == null) || (playerIndex === CommonConstants.WarNeutralPlayerIndex)) {
                throw Helpers.newError(`Invalid playerIndex: ${playerIndex}`);
            }

            const playerAliveState = Helpers.getExisted(action.playerAliveState);
            if ((playerAliveState !== Types.PlayerAliveState.Alive) &&
                (playerAliveState !== Types.PlayerAliveState.Dead)  &&
                (playerAliveState !== Types.PlayerAliveState.Dying)
            ) {
                throw Helpers.newError(`Invalid playerAliveState: ${playerAliveState}`);
            }

            const player = war.getPlayer(playerIndex);
            if (player) {
                player.setAliveState(playerAliveState);
            }

            return null;
        }
        private async _callActionDialogue(action: WarEvent.IWeaDialogue, isFast: boolean): Promise<null> {
            if (isFast) {
                return null;
            }

            return new Promise<null>(resolve => {
                TwnsBwDialoguePanel.BwDialoguePanel.show({
                    actionData      : action,
                    callbackOnClose : () => resolve(null),
                });
            });
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
                        throw Helpers.newError(`Empty data.calledCountInPlayerTurn.`);
                    }
                    if (data.calledCountTotal == null) {
                        throw Helpers.newError(`Empty data.calledCountTotal`);
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

        public getCallableWarEventId(): number | null {                                // DONE
            for (const warEventId of this._getWar().getCommonSettingManager().getWarRule().warEventIdArray || []) {
                if (this._checkCanCallWarEvent(warEventId)) {
                    return warEventId;
                }
            }

            return null;
        }

        private _checkCanCallWarEvent(warEventId: number): boolean {            // DONE
            const warEvent = this.getWarEvent(warEventId);
            if ((this.getWarEventCalledCountInPlayerTurn(warEventId) >= Helpers.getExisted(warEvent.maxCallCountInPlayerTurn)) ||
                (this.getWarEventCalledCountTotal(warEventId) >= Helpers.getExisted(warEvent.maxCallCountTotal))
            ) {
                return false;
            }

            return this._checkIsMeetConditionNode(Helpers.getExisted(warEvent.conditionNodeId));
        }

        private _checkIsMeetConditionNode(nodeId: number): boolean {            // DONE
            const node              = this._getConditionNode(nodeId);
            const isAnd             = Helpers.getExisted(node.isAnd);
            const conditionIdArray  = node.conditionIdArray;
            const subNodeIdArray    = node.subNodeIdArray;
            if ((!conditionIdArray?.length) && (!subNodeIdArray?.length)) {
                throw Helpers.newError(`Empty conditionIdArray and subNodeIdArray.`);
            }

            if (conditionIdArray) {
                for (const conditionId of conditionIdArray) {
                    const isConditionMet = this._checkIsMeetCondition(conditionId);
                    if ((isAnd) && (!isConditionMet)) {
                        return false;
                    }
                    if ((!isAnd) && (isConditionMet)) {
                        return true;
                    }
                }
            }

            if (subNodeIdArray) {
                for (const subNodeId of subNodeIdArray) {
                    const isSubNodeMet = this._checkIsMeetConditionNode(subNodeId);
                    if ((isAnd) && (!isSubNodeMet)) {
                        return false;
                    }
                    if ((!isAnd) && (isSubNodeMet)) {
                        return true;
                    }
                }
            }

            return true;
        }
        private _checkIsMeetCondition(conditionId: number): boolean {
            const condition = this._getCondition(conditionId);

            {
                const conEventCalledCountTotalEqualTo = condition.WecEventCalledCountTotalEqualTo;
                if (conEventCalledCountTotalEqualTo) {
                    return this._checkIsMeetConEventCalledCountTotalEqualTo(conEventCalledCountTotalEqualTo);
                }
            }

            {
                const conEventCalledCountTotalGreaterThan = condition.WecEventCalledCountTotalGreaterThan;
                if (conEventCalledCountTotalGreaterThan) {
                    return this._checkIsMeetConEventCalledCountTotalGreaterThan(conEventCalledCountTotalGreaterThan);
                }
            }

            {
                const conEventCalledCountTotalLessThan = condition.WecEventCalledCountTotalLessThan;
                if (conEventCalledCountTotalLessThan) {
                    return this._checkIsMeetConEventCalledCountTotalLessThan(conEventCalledCountTotalLessThan);
                }
            }

            {
                const conPlayerAliveStateEqualTo = condition.WecPlayerAliveStateEqualTo;
                if (conPlayerAliveStateEqualTo) {
                    return this._checkIsMeetPlayerAliveStateEqualTo(conPlayerAliveStateEqualTo);
                }
            }

            {
                const conPlayerIndexInTurnEqualTo = condition.WecPlayerIndexInTurnEqualTo;
                if (conPlayerIndexInTurnEqualTo) {
                    return this._checkIsMeetConPlayerIndexInTurnEqualTo(conPlayerIndexInTurnEqualTo);
                }
            }

            {
                const conPlayerIndexInTurnGreaterThan = condition.WecPlayerIndexInTurnGreaterThan;
                if (conPlayerIndexInTurnGreaterThan) {
                    return this._checkIsMeetConPlayerIndexInTurnGreaterThan(conPlayerIndexInTurnGreaterThan);
                }
            }

            {
                const conPlayerIndexInTurnLessThan = condition.WecPlayerIndexInTurnLessThan;
                if (conPlayerIndexInTurnLessThan) {
                    return this._checkIsMeetConPlayerIndexInTurnLessThan(conPlayerIndexInTurnLessThan);
                }
            }

            {
                const conTurnIndexEqualTo = condition.WecTurnIndexEqualTo;
                if (conTurnIndexEqualTo) {
                    return this._checkIsMeetConTurnIndexEqualTo(conTurnIndexEqualTo);
                }
            }

            {
                const conTurnIndexGreaterThan = condition.WecTurnIndexGreaterThan;
                if (conTurnIndexGreaterThan) {
                    return this._checkIsMeetConTurnIndexGreaterThan(conTurnIndexGreaterThan);
                }
            }

            {
                const conTurnIndexLessThan = condition.WecTurnIndexLessThan;
                if (conTurnIndexLessThan) {
                    return this._checkIsMeetConTurnIndexLessThan(conTurnIndexLessThan);
                }
            }

            {
                const conTurnIndexRemainderEqualTo = condition.WecTurnIndexRemainderEqualTo;
                if (conTurnIndexRemainderEqualTo) {
                    return this._checkIsMeetConTurnIndexRemainderEqualTo(conTurnIndexRemainderEqualTo);
                }
            }

            {
                const conTurnPhase = condition.WecTurnPhaseEqualTo;
                if (conTurnPhase) {
                    return this._checkIsMeetConTurnPhaseEqualTo(conTurnPhase);
                }
            }

            throw Helpers.newError(`Invalid condition!`);
        }

        private _checkIsMeetConEventCalledCountTotalEqualTo(condition: WarEvent.IWecEventCalledCountTotalEqualTo): boolean {
            const eventIdEqualTo    = Helpers.getExisted(condition.eventIdEqualTo);
            const countEqualTo      = Helpers.getExisted(condition.countEqualTo);
            const isNot             = Helpers.getExisted(condition.isNot);
            return (this.getWarEventCalledCountTotal(eventIdEqualTo) === countEqualTo)
                ? (isNot ? false : true)
                : (isNot ? true : false);
        }
        private _checkIsMeetConEventCalledCountTotalGreaterThan(condition: WarEvent.IWecEventCalledCountTotalGreaterThan): boolean {
            const eventIdEqualTo    = Helpers.getExisted(condition.eventIdEqualTo);
            const countGreaterThan  = Helpers.getExisted(condition.countGreaterThan);
            const isNot             = Helpers.getExisted(condition.isNot);
            return (this.getWarEventCalledCountTotal(eventIdEqualTo) > countGreaterThan)
                ? (isNot ? false : true)
                : (isNot ? true : false);
        }
        private _checkIsMeetConEventCalledCountTotalLessThan(condition: WarEvent.IWecEventCalledCountTotalLessThan): boolean {
            const eventIdEqualTo    = Helpers.getExisted(condition.eventIdEqualTo);
            const countLessThan     = Helpers.getExisted(condition.countLessThan);
            const isNot             = Helpers.getExisted(condition.isNot);
            return (this.getWarEventCalledCountTotal(eventIdEqualTo) < countLessThan)
                ? (isNot ? false : true)
                : (isNot ? true : false);
        }

        private _checkIsMeetPlayerAliveStateEqualTo(condition: WarEvent.IWecPlayerAliveStateEqualTo): boolean {
            const playerIndexEqualTo    = Helpers.getExisted(condition.playerIndexEqualTo);
            const aliveStateEqualTo     = Helpers.getExisted(condition.aliveStateEqualTo);
            const isNot                 = Helpers.getExisted(condition.isNot);
            const player                = this._getWar().getPlayer(playerIndexEqualTo);
            return (player.getAliveState() === aliveStateEqualTo)
                ? (isNot ? false : true)
                : (isNot ? true : false);
        }

        private _checkIsMeetConPlayerIndexInTurnEqualTo(condition: WarEvent.IWecPlayerIndexInTurnEqualTo): boolean {
            const valueEqualTo  = Helpers.getExisted(condition.valueEqualTo);
            const isNot         = Helpers.getExisted(condition.isNot);
            const playerIndex   = this._getWar().getPlayerIndexInTurn();
            return (playerIndex === valueEqualTo)
                ? (isNot ? false : true)
                : (isNot ? true : false);
        }
        private _checkIsMeetConPlayerIndexInTurnGreaterThan(condition: WarEvent.IWecPlayerIndexInTurnGreaterThan): boolean {
            const valueGreaterThan  = Helpers.getExisted(condition.valueGreaterThan);
            const isNot             = Helpers.getExisted(condition.isNot);
            const playerIndex       = this._getWar().getPlayerIndexInTurn();
            return (playerIndex > valueGreaterThan)
                ? (isNot ? false : true)
                : (isNot ? true : false);
        }
        private _checkIsMeetConPlayerIndexInTurnLessThan(condition: WarEvent.IWecPlayerIndexInTurnLessThan): boolean {
            const valueLessThan = Helpers.getExisted(condition.valueLessThan);
            const isNot         = Helpers.getExisted(condition.isNot);
            const playerIndex   = this._getWar().getPlayerIndexInTurn();
            return (playerIndex < valueLessThan)
                ? (isNot ? false : true)
                : (isNot ? true : false);
        }

        private _checkIsMeetConTurnIndexEqualTo(condition: WarEvent.IWecTurnIndexEqualTo): boolean {
            const valueEqualTo  = Helpers.getExisted(condition.valueEqualTo);
            const isNot         = Helpers.getExisted(condition.isNot);
            const turnIndex     = this._getWar().getTurnManager().getTurnIndex();
            return (turnIndex === valueEqualTo)
                ? (isNot ? false : true)
                : (isNot ? true : false);
        }
        private _checkIsMeetConTurnIndexGreaterThan(condition: WarEvent.IWecTurnIndexGreaterThan): boolean {
            const valueGreaterThan  = Helpers.getExisted(condition.valueGreaterThan);
            const isNot             = Helpers.getExisted(condition.isNot);
            const turnIndex         = this._getWar().getTurnManager().getTurnIndex();
            return (turnIndex > valueGreaterThan)
                ? (isNot ? false : true)
                : (isNot ? true : false);
        }
        private _checkIsMeetConTurnIndexLessThan(condition: WarEvent.IWecTurnIndexLessThan): boolean {
            const valueLessThan     = Helpers.getExisted(condition.valueLessThan);
            const isNot             = Helpers.getExisted(condition.isNot);
            const turnIndex         = this._getWar().getTurnManager().getTurnIndex();
            return (turnIndex < valueLessThan)
                ? (isNot ? false : true)
                : (isNot ? true : false);
        }
        private _checkIsMeetConTurnIndexRemainderEqualTo(condition: WarEvent.IWecTurnIndexRemainderEqualTo): boolean {
            const divider           = Helpers.getExisted(condition.divider);
            const remainderEqualTo  = Helpers.getExisted(condition.remainderEqualTo);
            const isNot             = Helpers.getExisted(condition.isNot);
            const turnIndex         = this._getWar().getTurnManager().getTurnIndex();
            return (turnIndex % divider === remainderEqualTo)
                ? (isNot ? false : true)
                : (isNot ? true : false);
        }

        private _checkIsMeetConTurnPhaseEqualTo(condition: WarEvent.IWecTurnPhaseEqualTo): boolean {
            const valueEqualTo  = Helpers.getExisted(condition.valueEqualTo);
            const isNot         = Helpers.getExisted(condition.isNot);
            const phaseCode     = this._getWar().getTurnManager().getPhaseCode();
            return (phaseCode === valueEqualTo)
                ? (isNot ? false : true)
                : (isNot ? true : false);
        }

        public getWarEvent(warEventId: number): WarEvent.IWarEvent {                    // DONE
            return Helpers.getExisted(this.getWarEventFullData()?.eventArray?.find(v => v.eventId === warEventId));
        }
        private _getConditionNode(nodeId: number): WarEvent.IWarEventConditionNode {    // DONE
            return Helpers.getExisted(this.getWarEventFullData()?.conditionNodeArray?.find(v => v.nodeId === nodeId));
        }
        private _getCondition(conditionId: number): WarEvent.IWarEventCondition {       // DONE
            return Helpers.getExisted(this.getWarEventFullData()?.conditionArray?.find(v => v.WecCommonData?.conditionId === conditionId));
        }
        public getWarEventAction(actionId: number): WarEvent.IWarEventAction {          // DONE
            return Helpers.getExisted(this.getWarEventFullData()?.actionArray?.find(v => v.WeaCommonData?.actionId === actionId));
        }
    }

    function getGridIndexForAddUnit({ origin, unitMap, tileMap, moveType, needMovableTile, canBeBlockedByUnit }: {
        origin              : Types.GridIndex;
        unitMap             : BwUnitMap;
        tileMap             : TwnsBwTileMap.BwTileMap;
        moveType            : Types.MoveType;
        needMovableTile     : boolean;
        canBeBlockedByUnit  : boolean;
    }): Types.GridIndex | null {
        const mapSize = tileMap.getMapSize();
        if ((canBeBlockedByUnit) && (unitMap.getUnitOnMap(origin))) {
            return null;
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

        return null;
    }

}

export default TwnsBwWarEventManager;
