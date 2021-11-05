
// import TwnsClientErrorCode  from "../../tools/helpers/ClientErrorCode";
// import CommonConstants      from "../../tools/helpers/CommonConstants";
// import ConfigManager        from "../../tools/helpers/ConfigManager";
// import GridIndexHelpers     from "../../tools/helpers/GridIndexHelpers";
// import Helpers              from "../../tools/helpers/Helpers";
// import Types                from "../../tools/helpers/Types";
// import ProtoTypes           from "../../tools/proto/ProtoTypes";
// import WarCommonHelpers     from "../../tools/warHelpers/WarCommonHelpers";
// import TwnsBwDialoguePanel  from "../view/BwDialoguePanel";
// import TwnsBwTileMap        from "./BwTileMap";
// import TwnsBwUnit           from "./BwUnit";
// import TwnsBwUnitMap        from "./BwUnitMap";
// import TwnsBwWar            from "./BwWar";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace TwnsBwWarEventManager {
    import ISerialWarEventManager           = ProtoTypes.WarSerialization.ISerialWarEventManager;
    import IDataForWarEventCalledCount      = ProtoTypes.WarSerialization.IDataForWarEventCalledCount;
    import IWarEventFullData                = ProtoTypes.Map.IWarEventFullData;
    import WarEvent                         = ProtoTypes.WarEvent;
    import IWarActionSystemCallWarEvent     = ProtoTypes.WarAction.IWarActionSystemCallWarEvent;
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

        public async callWarEvent(action: IWarActionSystemCallWarEvent, isFastExecute: boolean): Promise<void> {
            this._getWar().getIsExecuteActionsWithExtraData()
                ? await this._callWarEventWithExtraData(action, isFastExecute)
                : await this._callWarEventWithoutExtraData(Helpers.getExisted(action.warEventId, ClientErrorCode.BwWarEventManager_CallWarEvent_00), isFastExecute);
        }
        private async _callWarEventWithExtraData(action: IWarActionSystemCallWarEvent, isFastExecute: boolean): Promise<void> {
            for (const actionId of this.getWarEvent(Helpers.getExisted(action.extraData?.warEventId, ClientErrorCode.BwWarEventManager_CallWarEventWithExtraData_00)).actionIdArray || []) {
                await this._callWarActionWithExtraData(actionId, isFastExecute);
            }

            const extraData = Helpers.getExisted(action.extraData, ClientErrorCode.BwWarEventManager_CallWarEventWithExtraData_01);
            WarCommonHelpers.handleCommonExtraDataForWarActions({
                war             : this._getWar(),
                commonExtraData : Helpers.getExisted(extraData.commonExtraData, ClientErrorCode.BwWarEventManager_CallWarEventWithExtraData_02),
                isFastExecute,
            });
        }
        private async _callWarEventWithoutExtraData(warEventId: number, isFastExecute: boolean): Promise<void> { // DONE
            for (const actionId of this.getWarEvent(warEventId).actionIdArray || []) {
                await this._callWarActionWithoutExtraData(actionId, isFastExecute);
            }
        }

        private async _callWarActionWithExtraData(warEventActionId: number, isFastExecute: boolean): Promise<void> {
            const action = this.getWarEventAction(warEventActionId);
            if (action.WeaAddUnit) {
                await this._callActionAddUnitWithExtraData(action.WeaAddUnit, isFastExecute);
            } else if (action.WeaSetPlayerAliveState) {
                await this._callActionSetPlayerAliveStateWithExtraData(action.WeaSetPlayerAliveState, isFastExecute);
            } else if (action.WeaDialogue) {
                await this._callActionDialogueWithExtraData(action.WeaDialogue, isFastExecute);
            } else if (action.WeaSetViewpoint) {
                await this._callActionSetViewpointWithExtraData(action.WeaSetViewpoint, isFastExecute);
            } else if (action.WeaSetWeather) {
                await this._callActionSetWeatherWithExtraData(action.WeaSetWeather, isFastExecute);
            } else {
                throw Helpers.newError(`Invalid action.`);
            }

            // TODO add more actions.
        }
        private async _callWarActionWithoutExtraData(warEventActionId: number, isFastExecute: boolean): Promise<void> {
            const action = this.getWarEventAction(warEventActionId);
            if (action.WeaAddUnit) {
                await this._callActionAddUnitWithoutExtraData(action.WeaAddUnit, isFastExecute);
            } else if (action.WeaSetPlayerAliveState) {
                await this._callActionSetPlayerAliveStateWithoutExtraData(action.WeaSetPlayerAliveState, isFastExecute);
            } else if (action.WeaDialogue) {
                await this._callActionDialogueWithoutExtraData(action.WeaDialogue, isFastExecute);
            } else if (action.WeaSetViewpoint) {
                await this._callActionSetViewpointWithoutExtraData(action.WeaSetViewpoint, isFastExecute);
            } else if (action.WeaSetWeather) {
                await this._callActionSetWeatherWithoutExtraData(action.WeaSetWeather, isFastExecute);
            } else {
                throw Helpers.newError(`Invalid action.`);
            }

            // TODO add more actions.
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        private async _callActionAddUnitWithExtraData(action: WarEvent.IWeaAddUnit, isFastExecute: boolean): Promise<void> {
            // nothing to do
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        private async _callActionAddUnitWithoutExtraData(action: WarEvent.IWeaAddUnit, isFastExecute: boolean): Promise<void> {
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

                unit.startRunning(war);
                unitMap.setNextUnitId(unitId + 1);
                unitMap.setUnitOnMap(unit);
            }
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        private async _callActionSetPlayerAliveStateWithExtraData(action: WarEvent.IWeaSetPlayerAliveState, isFastExecute: boolean): Promise<void> {
            // nothing to do
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        private async _callActionSetPlayerAliveStateWithoutExtraData(action: WarEvent.IWeaSetPlayerAliveState, isFastExecute: boolean): Promise<void> {
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
        }

        private async _callActionDialogueWithExtraData(action: WarEvent.IWeaDialogue, isFast: boolean): Promise<void> {
            if (isFast) {
                return;
            }

            return new Promise<void>(resolve => {
                TwnsBwDialoguePanel.BwDialoguePanel.show({
                    actionData      : action,
                    callbackOnClose : () => resolve(),
                });
            });
        }
        private async _callActionDialogueWithoutExtraData(action: WarEvent.IWeaDialogue, isFast: boolean): Promise<void> {
            if (isFast) {
                return;
            }

            return new Promise<void>(resolve => {
                TwnsBwDialoguePanel.BwDialoguePanel.show({
                    actionData      : action,
                    callbackOnClose : () => resolve(),
                });
            });
        }

        private async _callActionSetViewpointWithExtraData(action: WarEvent.IWeaSetViewpoint, isFast: boolean): Promise<void> {
            const war       = this._getWar();
            const gridIndex = Helpers.getExisted(GridIndexHelpers.convertGridIndex(action.gridIndex), ClientErrorCode.BwWarEventManager_CallActionSetViewpointWithExtraData_00);
            const cursor    = war.getCursor();
            cursor.setGridIndex(gridIndex);
            cursor.updateView();
            war.getView().moveGridToCenter(gridIndex);

            if ((!isFast) && (action.needFocusEffect)) {
                war.getGridVisualEffect().showEffectAiming(gridIndex, 1000);
                await new Promise<void>(resolve => {
                    egret.setTimeout(() => resolve(), null, 1000);
                });
            }
        }
        private async _callActionSetViewpointWithoutExtraData(action: WarEvent.IWeaSetViewpoint, isFast: boolean): Promise<void> {
            const war       = this._getWar();
            const gridIndex = Helpers.getExisted(GridIndexHelpers.convertGridIndex(action.gridIndex), ClientErrorCode.BwWarEventManager_CallActionSetViewpointWithoutExtraData_00);
            const cursor    = war.getCursor();
            cursor.setGridIndex(gridIndex);
            cursor.updateView();
            war.getView().moveGridToCenter(gridIndex);

            if ((!isFast) && (action.needFocusEffect)) {
                war.getGridVisualEffect().showEffectAiming(gridIndex, 1000);
                await new Promise<void>(resolve => {
                    egret.setTimeout(() => resolve(), null, 1000);
                });
            }
        }

        private async _callActionSetWeatherWithExtraData(action: WarEvent.IWeaSetWeather, isFast: boolean): Promise<void> {
            const war               = this._getWar();
            const weatherManager    = war.getWeatherManager();
            weatherManager.setForceWeatherType(Helpers.getExisted(action.weatherType, ClientErrorCode.BwWarEventManager_CallActionSetWeatherWithExtraData_00));

            const turnsCount = Helpers.getExisted(action.turnsCount, ClientErrorCode.BwWarEventManager_CallActionSetWeatherWithExtraData_01);
            if (turnsCount == 0) {
                weatherManager.setExpirePlayerIndex(null);
                weatherManager.setExpireTurnIndex(null);
            } else {
                weatherManager.setExpirePlayerIndex(war.getPlayerIndexInTurn());
                weatherManager.setExpireTurnIndex(war.getTurnManager().getTurnIndex() + turnsCount);
            }

            if (!isFast) {
                weatherManager.getView().resetView(false);
            }
        }
        private async _callActionSetWeatherWithoutExtraData(action: WarEvent.IWeaSetWeather, isFast: boolean): Promise<void> {
            const war               = this._getWar();
            const weatherManager    = war.getWeatherManager();
            weatherManager.setForceWeatherType(Helpers.getExisted(action.weatherType, ClientErrorCode.BwWarEventManager_CallActionSetWeatherWithoutExtraData_00));

            const turnsCount = Helpers.getExisted(action.turnsCount, ClientErrorCode.BwWarEventManager_CallActionSetWeatherWithoutExtraData_01);
            if (turnsCount == 0) {
                weatherManager.setExpirePlayerIndex(null);
                weatherManager.setExpireTurnIndex(null);
            } else {
                weatherManager.setExpirePlayerIndex(war.getPlayerIndexInTurn());
                weatherManager.setExpireTurnIndex(war.getTurnManager().getTurnIndex() + turnsCount);
            }

            if (!isFast) {
                weatherManager.getView().resetView(false);
            }
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

            if      (condition.WecEventCalledCountTotalEqualTo)     { return this._checkIsMeetConEventCalledCountTotalEqualTo(condition.WecEventCalledCountTotalEqualTo); }
            else if (condition.WecEventCalledCountTotalGreaterThan) { return this._checkIsMeetConEventCalledCountTotalGreaterThan(condition.WecEventCalledCountTotalGreaterThan); }
            else if (condition.WecEventCalledCountTotalLessThan)    { return this._checkIsMeetConEventCalledCountTotalLessThan(condition.WecEventCalledCountTotalLessThan); }
            else if (condition.WecPlayerAliveStateEqualTo)          { return this._checkIsMeetConPlayerAliveStateEqualTo(condition.WecPlayerAliveStateEqualTo); }
            else if (condition.WecPlayerIndexInTurnEqualTo)         { return this._checkIsMeetConPlayerIndexInTurnEqualTo(condition.WecPlayerIndexInTurnEqualTo); }
            else if (condition.WecPlayerIndexInTurnGreaterThan)     { return this._checkIsMeetConPlayerIndexInTurnGreaterThan(condition.WecPlayerIndexInTurnGreaterThan); }
            else if (condition.WecPlayerIndexInTurnLessThan)        { return this._checkIsMeetConPlayerIndexInTurnLessThan(condition.WecPlayerIndexInTurnLessThan); }
            else if (condition.WecTurnIndexEqualTo)                 { return this._checkIsMeetConTurnIndexEqualTo(condition.WecTurnIndexEqualTo); }
            else if (condition.WecTurnIndexGreaterThan)             { return this._checkIsMeetConTurnIndexGreaterThan(condition.WecTurnIndexGreaterThan); }
            else if (condition.WecTurnIndexLessThan)                { return this._checkIsMeetConTurnIndexLessThan(condition.WecTurnIndexLessThan); }
            else if (condition.WecTurnIndexRemainderEqualTo)        { return this._checkIsMeetConTurnIndexRemainderEqualTo(condition.WecTurnIndexRemainderEqualTo); }
            else if (condition.WecTurnPhaseEqualTo)                 { return this._checkIsMeetConTurnPhaseEqualTo(condition.WecTurnPhaseEqualTo); }
            else if (condition.WecTilePlayerIndexEqualTo)           { return this._checkIsMeetConTilePlayerIndexEqualTo(condition.WecTilePlayerIndexEqualTo); }
            else if (condition.WecTileTypeEqualTo)                  { return this._checkIsMeetConTileTypeEqualTo(condition.WecTileTypeEqualTo); }

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

        private _checkIsMeetConPlayerAliveStateEqualTo(condition: WarEvent.IWecPlayerAliveStateEqualTo): boolean {
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

        private _checkIsMeetConTilePlayerIndexEqualTo(condition: WarEvent.IWecTilePlayerIndexEqualTo): boolean {
            const tile  = this._getWar().getTileMap().getTile(Helpers.getExisted(GridIndexHelpers.convertGridIndex(condition.gridIndex), ClientErrorCode.BwWarEventManager_CheckIsMeetConTilePlayerIndexEqualTo_00));
            const isNot = condition.isNot;
            return (tile.getPlayerIndex() === Helpers.getExisted(condition.playerIndex, ClientErrorCode.BwWarEventManager_CheckIsMeetConTilePlayerIndexEqualTo_01))
                ? (isNot ? false : true)
                : (isNot ? true : false);
        }
        private _checkIsMeetConTileTypeEqualTo(condition: WarEvent.IWecTileTypeEqualTo): boolean {
            const tile  = this._getWar().getTileMap().getTile(Helpers.getExisted(GridIndexHelpers.convertGridIndex(condition.gridIndex), ClientErrorCode.BwWarEventManager_CheckIsMeetConTileTypeEqualTo_00));
            const isNot = condition.isNot;
            return (tile.getType() === Helpers.getExisted(condition.tileType, ClientErrorCode.BwWarEventManager_CheckIsMeetConTileTypeEqualTo_01))
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

// export default TwnsBwWarEventManager;
