
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
namespace Twns.BaseWar {
    import ISerialWarEventManager           = CommonProto.WarSerialization.ISerialWarEventManager;
    import IDataForWarEventCalledCount      = CommonProto.WarSerialization.IDataForWarEventCalledCount;
    import IWarEventFullData                = CommonProto.Map.IWarEventFullData;
    import WarEvent                         = CommonProto.WarEvent;
    import IWarActionSystemCallWarEvent     = CommonProto.WarAction.IWarActionSystemCallWarEvent;
    import ICustomCounter                   = CommonProto.WarSerialization.ICustomCounter;
    import ClientErrorCode                  = Twns.ClientErrorCode;
    import WarEventHelpers                  = WarHelpers.WarEventHelpers;

    export class BwWarEventManager {
        private _war?                           : BwWar;
        private _calledCountList?               : IDataForWarEventCalledCount[] | null;
        private _customCounterArray?            : ICustomCounter[] | null;
        private _ongoingPersistentActionIdSet?  : Set<number>;

        public init(data: Twns.Types.Undefinable<ISerialWarEventManager>, warEventFullData: Twns.Types.Undefinable<CommonProto.Map.IWarEventFullData>): void {
            if (!data) {
                this._setCalledCountList(null);
                this._setCustomCounterArray(null);
                this._setOngoingPersistentActionIdSet(new Set());
            } else {
                // TODO: validate the data.
                const customCounterArray = data.customCounterArray ?? null;
                if ((customCounterArray) && (!Config.ConfigManager.checkIsValidCustomCounterArray(customCounterArray))) {
                    throw Twns.Helpers.newError(`BwWarEventManager.init() invalid customCounterArray.`, ClientErrorCode.BwWarEventManager_Init_00);
                }

                const ongoingPersistentActionIdArray    = data.ongoingPersistentActionIdArray ?? [];
                const ongoingPersistentActionIdSet      = new Set(ongoingPersistentActionIdArray);
                if (ongoingPersistentActionIdArray.length !== ongoingPersistentActionIdSet.size) {
                    throw Twns.Helpers.newError(`BwWarEventMAnager.init() invalid ongoingPersistentActionIdArray.`, ClientErrorCode.BwWarEventManager_Init_01);
                }
                for (const actionId of ongoingPersistentActionIdSet) {
                    const action = warEventFullData?.actionArray?.find(v => v.WeaCommonData?.actionId === actionId);
                    if ((action == null) || (!WarEventHelpers.checkIsPersistentAction(action))) {
                        throw Twns.Helpers.newError(`BwWarEventMAnager.init() invalid ongoingPersistentActionIdArray.`, ClientErrorCode.BwWarEventManager_Init_02);
                    }
                }

                this._setCalledCountList(Twns.Helpers.deepClone(data.calledCountList) ?? null);
                this._setCustomCounterArray(Twns.Helpers.deepClone(customCounterArray));
                this._setOngoingPersistentActionIdSet(ongoingPersistentActionIdSet);
            }
        }
        public fastInit(data: ISerialWarEventManager): void {
            this._setCalledCountList(Twns.Helpers.deepClone(data.calledCountList) ?? null);
            this._setCustomCounterArray(Twns.Helpers.deepClone(data.customCounterArray ?? null));
            this._setOngoingPersistentActionIdSet(new Set(data.ongoingPersistentActionIdArray));
        }

        public serialize(): ISerialWarEventManager {
            return {
                calledCountList                 : this._getCalledCountList(),
                customCounterArray              : this._getCustomCounterArray(),
                ongoingPersistentActionIdArray  : [...this.getOngoingPersistentActionIdSet()],
            };
        }
        public serializeForCreateSfw(): ISerialWarEventManager {
            return {
                calledCountList                 : Twns.Helpers.deepClone(this._getCalledCountList()),
                customCounterArray              : Twns.Helpers.deepClone(this._getCustomCounterArray()),
                ongoingPersistentActionIdArray  : [...this.getOngoingPersistentActionIdSet()],
            };
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
            return Twns.Helpers.getExisted(this._war);
        }

        public getWarEventFullData(): IWarEventFullData | null {
            return this._getWar().getCommonSettingManager().getInstanceWarRule().warEventFullData ?? null;
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Functions for called counts.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        protected _setCalledCountList(list: IDataForWarEventCalledCount[] | null): void {
            this._calledCountList = list;
        }
        private _getCalledCountList(): IDataForWarEventCalledCount[] | null {
            return Twns.Helpers.getDefined(this._calledCountList, ClientErrorCode.BwWarEventManager_GetCalledCountList_00);
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
                        throw Twns.Helpers.newError(`Empty data.calledCountInPlayerTurn.`);
                    }
                    if (data.calledCountTotal == null) {
                        throw Twns.Helpers.newError(`Empty data.calledCountTotal`);
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

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Functions for custom counters.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        protected _setCustomCounterArray(counterArray: ICustomCounter[] | null): void {
            this._customCounterArray = counterArray;
        }
        private _getCustomCounterArray(): ICustomCounter[] | null {
            return Twns.Helpers.getDefined(this._customCounterArray, ClientErrorCode.BwWarEventManager_GetCustomCounterArray_00);
        }

        private _setCustomCounter(counterId: number, counterValue: number): void {
            if (!Config.ConfigManager.checkIsValidCustomCounterId(counterId)) {
                throw Twns.Helpers.newError(`BwWarEventManager._setCustomCounter() invalid counterId: ${counterId}`, ClientErrorCode.BwWarEventManager_SetCustomCounter_00);
            }

            if (!Config.ConfigManager.checkIsValidCustomCounterValue(counterValue)) {
                throw Twns.Helpers.newError(`BwWarEventManager._setCustomCounter() invalid counterValue: ${counterValue}`, ClientErrorCode.BwWarEventManager_SetCustomCounter_01);
            }

            const array = this._getCustomCounterArray();
            if (array == null) {
                this._setCustomCounterArray([{
                    customCounterId     : counterId,
                    customCounterValue  : counterValue,
                }]);
            } else {
                const data = array.find(v => v.customCounterId === counterId);
                if (data) {
                    data.customCounterValue = counterValue;
                } else {
                    array.push({
                        customCounterId     : counterId,
                        customCounterValue  : counterValue,
                    });
                }
            }
        }
        private _getCustomCounter(counterId: number): number {
            if (!Config.ConfigManager.checkIsValidCustomCounterId(counterId)) {
                throw Twns.Helpers.newError(`BwWarEventManager._getCustomCounter() invalid counterId: ${counterId}`, ClientErrorCode.BwWarEventManager_GetCustomCounter_00);
            }

            return this._getCustomCounterArray()?.find(v => v.customCounterId === counterId)?.customCounterValue ?? 0;
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Functions for persistent actions.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        protected _setOngoingPersistentActionIdSet(actionIdArray: Set<number>): void {
            this._ongoingPersistentActionIdSet = actionIdArray;
        }
        public getOngoingPersistentActionIdSet(): Set<number> {
            return Twns.Helpers.getExisted(this._ongoingPersistentActionIdSet, ClientErrorCode.BwWarEventManager_GetOngoingPersistentActionIdSet_00);
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Functions for calling events.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        public async callWarEvent(action: IWarActionSystemCallWarEvent, isFastExecute: boolean): Promise<void> {
            this._getWar().getIsExecuteActionsWithExtraData()
                ? await this._callWarEventWithExtraData(action, isFastExecute)
                : await this._callWarEventWithoutExtraData(Twns.Helpers.getExisted(action.warEventId, ClientErrorCode.BwWarEventManager_CallWarEvent_00), isFastExecute);
        }
        private async _callWarEventWithExtraData(action: IWarActionSystemCallWarEvent, isFastExecute: boolean): Promise<void> {
            for (const actionId of this.getWarEvent(Twns.Helpers.getExisted(action.extraData?.warEventId, ClientErrorCode.BwWarEventManager_CallWarEventWithExtraData_00)).actionIdArray || []) {
                await this._callWarActionWithExtraData(actionId, isFastExecute);
            }

            const extraData = Twns.Helpers.getExisted(action.extraData, ClientErrorCode.BwWarEventManager_CallWarEventWithExtraData_01);
            WarHelpers.WarCommonHelpers.handleCommonExtraDataForWarActions({
                war             : this._getWar(),
                commonExtraData : Twns.Helpers.getExisted(extraData.commonExtraData, ClientErrorCode.BwWarEventManager_CallWarEventWithExtraData_02),
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
            if      (action.WeaAddUnit)                         { await this._callActionAddUnitWithExtraData(action.WeaAddUnit, isFastExecute); }
            else if (action.WeaDialogue)                        { await this._callActionDialogueWithExtraData(action.WeaDialogue, isFastExecute); }
            else if (action.WeaSetViewpoint)                    { await this._callActionSetViewpointWithExtraData(action.WeaSetViewpoint, isFastExecute); }
            else if (action.WeaSetWeather)                      { await this._callActionSetWeatherWithExtraData(action.WeaSetWeather, isFastExecute); }
            else if (action.WeaSimpleDialogue)                  { await this._callActionSimpleDialogueWithExtraData(action.WeaSimpleDialogue, isFastExecute); }
            else if (action.WeaPlayBgm)                         { await this._callActionPlayBgmWithExtraData(action.WeaPlayBgm, isFastExecute); }
            else if (action.WeaSetForceFogCode)                 { await this._callActionSetForceFogCodeWithExtraData(action.WeaSetForceFogCode, isFastExecute); }
            else if (action.WeaSetCustomCounter)                { await this._callActionSetCustomCounterWithExtraData(action.WeaSetCustomCounter, isFastExecute); }
            else if (action.WeaDeprecatedSetPlayerAliveState)   { await this._callActionDeprecatedSetPlayerAliveStateWithExtraData(action.WeaDeprecatedSetPlayerAliveState, isFastExecute); }
            else if (action.WeaDeprecatedSetPlayerFund)         { await this._callActionDeprecatedSetPlayerFundWithExtraData(action.WeaDeprecatedSetPlayerFund, isFastExecute); }
            else if (action.WeaDeprecatedSetPlayerCoEnergy)     { await this._callActionDeprecatedSetPlayerCoEnergyWithExtraData(action.WeaDeprecatedSetPlayerCoEnergy, isFastExecute); }
            else if (action.WeaStopPersistentAction)            { await this._callActionStopPersistentActionWithExtraData(action.WeaStopPersistentAction, isFastExecute); }
            else if (action.WeaSetPlayerAliveState)             { await this._callActionSetPlayerAliveStateWithExtraData(action.WeaSetPlayerAliveState, isFastExecute); }
            else if (action.WeaSetPlayerState)                  { await this._callActionSetPlayerStateWithExtraData(action.WeaSetPlayerState, isFastExecute); }
            else if (action.WeaSetPlayerCoEnergy)               { await this._callActionSetPlayerCoEnergyWithExtraData(action.WeaSetPlayerCoEnergy, isFastExecute); }
            else if (action.WeaSetUnitState)                    { await this._callActionSetUnitStateWithExtraData(action.WeaSetUnitState, isFastExecute); }
            else if (action.WeaSetTileType)                     { await this._callActionSetTileTypeWithExtraData(action.WeaSetTileType, isFastExecute); }
            else if (action.WeaSetTileState)                    { await this._callActionSetTileStateWithExtraData(action.WeaSetTileState, isFastExecute); }
            else if (action.WeaPersistentShowText)              { await this._callActionPersistentShowTextWithExtraData(action.WeaPersistentShowText, isFastExecute, warEventActionId); }
            else {
                throw Twns.Helpers.newError(`Invalid action.`);
            }

            // todo: add more actions.
        }
        private async _callWarActionWithoutExtraData(warEventActionId: number, isFastExecute: boolean): Promise<void> {
            const action = this.getWarEventAction(warEventActionId);
            if      (action.WeaAddUnit)                         { await this._callActionAddUnitWithoutExtraData(action.WeaAddUnit, isFastExecute); }
            else if (action.WeaDialogue)                        { await this._callActionDialogueWithoutExtraData(action.WeaDialogue, isFastExecute); }
            else if (action.WeaSetViewpoint)                    { await this._callActionSetViewpointWithoutExtraData(action.WeaSetViewpoint, isFastExecute); }
            else if (action.WeaSetWeather)                      { await this._callActionSetWeatherWithoutExtraData(action.WeaSetWeather, isFastExecute); }
            else if (action.WeaSimpleDialogue)                  { await this._callActionSimpleDialogueWithoutExtraData(action.WeaSimpleDialogue, isFastExecute); }
            else if (action.WeaPlayBgm)                         { await this._callActionPlayBgmWithoutExtraData(action.WeaPlayBgm, isFastExecute); }
            else if (action.WeaSetForceFogCode)                 { await this._callActionSetForceFogCodeWithoutExtraData(action.WeaSetForceFogCode, isFastExecute); }
            else if (action.WeaSetCustomCounter)                { await this._callActionSetCustomCounterWithoutExtraData(action.WeaSetCustomCounter, isFastExecute); }
            else if (action.WeaDeprecatedSetPlayerAliveState)   { await this._callActionDeprecatedSetPlayerAliveStateWithoutExtraData(action.WeaDeprecatedSetPlayerAliveState, isFastExecute); }
            else if (action.WeaDeprecatedSetPlayerFund)         { await this._callActionDeprecatedSetPlayerFundWithoutExtraData(action.WeaDeprecatedSetPlayerFund, isFastExecute); }
            else if (action.WeaDeprecatedSetPlayerCoEnergy)     { await this._callActionDeprecatedSetPlayerCoEnergyWithoutExtraData(action.WeaDeprecatedSetPlayerCoEnergy, isFastExecute); }
            else if (action.WeaStopPersistentAction)            { await this._callActionStopPersistentActionWithoutExtraData(action.WeaStopPersistentAction, isFastExecute); }
            else if (action.WeaSetPlayerAliveState)             { await this._callActionSetPlayerAliveStateWithoutExtraData(action.WeaSetPlayerAliveState, isFastExecute); }
            else if (action.WeaSetPlayerState)                  { await this._callActionSetPlayerStateWithoutExtraData(action.WeaSetPlayerState, isFastExecute); }
            else if (action.WeaSetPlayerCoEnergy)               { await this._callActionSetPlayerCoEnergyWithoutExtraData(action.WeaSetPlayerCoEnergy, isFastExecute); }
            else if (action.WeaSetUnitState)                    { await this._callActionSetUnitStateWithoutExtraData(action.WeaSetUnitState, isFastExecute); }
            else if (action.WeaSetTileType)                     { await this._callActionSetTileTypeWithoutExtraData(action.WeaSetTileType, isFastExecute); }
            else if (action.WeaSetTileState)                    { await this._callActionSetTileStateWithoutExtraData(action.WeaSetTileState, isFastExecute); }
            else if (action.WeaPersistentShowText)              { await this._callActionPersistentShowTextWithoutExtraData(action.WeaPersistentShowText, isFastExecute, warEventActionId); }
            else {
                throw Twns.Helpers.newError(`Invalid action.`);
            }

            // todo: add more actions.
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        private async _callActionAddUnitWithExtraData(action: WarEvent.IWeaAddUnit, isFastExecute: boolean): Promise<void> {
            // nothing to do
        }
        private async _callActionAddUnitWithoutExtraData(action: WarEvent.IWeaAddUnit, isFastExecute: boolean): Promise<void> {
            const unitArray = action.unitArray;
            if ((unitArray == null) || (!unitArray.length)) {
                throw Twns.Helpers.newError(`Empty unitArray.`);
            }

            const war           = this._getWar();
            const unitMap       = war.getUnitMap();
            const tileMap       = war.getTileMap();
            const playerManager = war.getPlayerManager();
            const gameConfig    = war.getGameConfig();
            const mapSize       = unitMap.getMapSize();
            for (const data of unitArray) {
                const unitData = Twns.Helpers.getExisted(data.unitData);
                if (unitData.loaderUnitId != null) {
                    throw Twns.Helpers.newError(`unitData.loaderUnitId != null: ${unitData.loaderUnitId}`);
                }

                const canBeBlockedByUnit    = Twns.Helpers.getExisted(data.canBeBlockedByUnit);
                const needMovableTile       = Twns.Helpers.getExisted(data.needMovableTile);
                const unitId                = unitMap.getNextUnitId();
                const unitType              = Twns.Helpers.getExisted(unitData.unitType);
                const moveType              = Twns.Helpers.getExisted(gameConfig.getUnitTemplateCfg(unitType)?.moveType);
                const rawGridIndex          = Twns.Helpers.getExisted(GridIndexHelpers.convertGridIndex(unitData.gridIndex));
                if (WarHelpers.WarCommonHelpers.getErrorCodeForUnitDataIgnoringUnitId({
                    unitData,
                    mapSize,
                    gameConfig,
                    playersCountUnneutral   : CommonConstants.WarMaxPlayerIndex,
                })) {
                    throw Twns.Helpers.newError(`Invalid unitData: ${JSON.stringify(unitData)}`);
                }

                const playerIndex = Twns.Helpers.getExisted(unitData.playerIndex);
                const player = playerManager.getPlayer(playerIndex);
                if (player == null) {
                    continue;
                }
                if (player.getAliveState() === Twns.Types.PlayerAliveState.Dead) {
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

                const revisedUnitData       = Twns.Helpers.deepClone(unitData);
                revisedUnitData.gridIndex   = gridIndex;
                revisedUnitData.unitId      = unitId;

                const unit = new BwUnit();
                unit.init(revisedUnitData, gameConfig);

                unit.startRunning(war);
                unitMap.setNextUnitId(unitId + 1);
                unitMap.setUnitOnMap(unit);
                (!isFastExecute) && (unit.updateView());
            }
        }

        private async _callActionDialogueWithExtraData(action: WarEvent.IWeaDialogue, isFast: boolean): Promise<void> {
            if (isFast) {
                return;
            }

            return new Promise<void>(resolve => {
                Twns.PanelHelpers.open(Twns.PanelHelpers.PanelDict.BwDialoguePanel, {
                    gameConfig   : this._getWar().getGameConfig(),
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
                Twns.PanelHelpers.open(Twns.PanelHelpers.PanelDict.BwDialoguePanel, {
                    gameConfig   : this._getWar().getGameConfig(),
                    actionData      : action,
                    callbackOnClose : () => resolve(),
                });
            });
        }

        private async _callActionSetViewpointWithExtraData(action: WarEvent.IWeaSetViewpoint, isFast: boolean): Promise<void> {
            const war       = this._getWar();
            const gridIndex = Twns.Helpers.getExisted(GridIndexHelpers.convertGridIndex(action.gridIndex), ClientErrorCode.BwWarEventManager_CallActionSetViewpointWithExtraData_00);
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
            const gridIndex = Twns.Helpers.getExisted(GridIndexHelpers.convertGridIndex(action.gridIndex), ClientErrorCode.BwWarEventManager_CallActionSetViewpointWithoutExtraData_00);
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
            weatherManager.setForceWeatherType(Twns.Helpers.getExisted(action.weatherType, ClientErrorCode.BwWarEventManager_CallActionSetWeatherWithExtraData_00));

            const turnsCount = Twns.Helpers.getExisted(action.weatherTurnsCount, ClientErrorCode.BwWarEventManager_CallActionSetWeatherWithExtraData_01);
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
            weatherManager.setForceWeatherType(Twns.Helpers.getExisted(action.weatherType, ClientErrorCode.BwWarEventManager_CallActionSetWeatherWithoutExtraData_00));

            const weatherTurnsCount = Twns.Helpers.getExisted(action.weatherTurnsCount, ClientErrorCode.BwWarEventManager_CallActionSetWeatherWithoutExtraData_01);
            if (weatherTurnsCount == 0) {
                weatherManager.setExpirePlayerIndex(null);
                weatherManager.setExpireTurnIndex(null);
            } else {
                weatherManager.setExpirePlayerIndex(war.getPlayerIndexInTurn());
                weatherManager.setExpireTurnIndex(war.getTurnManager().getTurnIndex() + weatherTurnsCount);
            }

            if (!isFast) {
                weatherManager.getView().resetView(false);
            }
        }

        private async _callActionSimpleDialogueWithExtraData(action: WarEvent.IWeaSimpleDialogue, isFast: boolean): Promise<void> {
            if (isFast) {
                return;
            }

            return new Promise<void>(resolve => {
                Twns.PanelHelpers.open(Twns.PanelHelpers.PanelDict.BwSimpleDialoguePanel, {
                    gameConfig   : this._getWar().getGameConfig(),
                    actionData      : action,
                    callbackOnClose : () => resolve(),
                });
            });
        }
        private async _callActionSimpleDialogueWithoutExtraData(action: WarEvent.IWeaSimpleDialogue, isFast: boolean): Promise<void> {
            if (isFast) {
                return;
            }

            return new Promise<void>(resolve => {
                Twns.PanelHelpers.open(Twns.PanelHelpers.PanelDict.BwSimpleDialoguePanel, {
                    gameConfig   : this._getWar().getGameConfig(),
                    actionData      : action,
                    callbackOnClose : () => resolve(),
                });
            });
        }

        private async _callActionPlayBgmWithExtraData(action: WarEvent.IWeaPlayBgm, isFast: boolean): Promise<void> {
            if (isFast) {
                return;
            }

            if (action.useCoBgm) {
                Twns.SoundManager.playCoBgmWithWar(this._getWar(), false);
            } else {
                Twns.SoundManager.playBgm(Twns.Helpers.getExisted(action.bgmCode));
            }
        }
        private async _callActionPlayBgmWithoutExtraData(action: WarEvent.IWeaPlayBgm, isFast: boolean): Promise<void> {
            if (isFast) {
                return;
            }

            if (action.useCoBgm) {
                Twns.SoundManager.playCoBgmWithWar(this._getWar(), false);
            } else {
                Twns.SoundManager.playBgm(Twns.Helpers.getExisted(action.bgmCode));
            }
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        private async _callActionSetForceFogCodeWithExtraData(action: WarEvent.IWeaSetForceFogCode, isFast: boolean): Promise<void> {
            const war       = this._getWar();
            const fogMap    = war.getFogMap();
            fogMap.setForceFogCode(Twns.Helpers.getExisted(action.forceFogCode, ClientErrorCode.BwWarEventManager_CallActionSetHasFogWithExtraData_00));

            const turnsCount = Twns.Helpers.getExisted(action.turnsCount, ClientErrorCode.BwWarEventManager_CallActionSetHasFogWithExtraData_01);
            if (turnsCount == 0) {
                fogMap.setForceExpirePlayerIndex(null);
                fogMap.setForceExpireTurnIndex(null);
            } else {
                fogMap.setForceExpirePlayerIndex(war.getPlayerIndexInTurn());
                fogMap.setForceExpireTurnIndex(war.getTurnManager().getTurnIndex() + turnsCount);
            }
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        private async _callActionSetForceFogCodeWithoutExtraData(action: WarEvent.IWeaSetForceFogCode, isFast: boolean): Promise<void> {
            const war       = this._getWar();
            const fogMap    = war.getFogMap();
            fogMap.setForceFogCode(Twns.Helpers.getExisted(action.forceFogCode, ClientErrorCode.BwWarEventManager_CallActionSetHasFogWithoutExtraData_00));

            const turnsCount = Twns.Helpers.getExisted(action.turnsCount, ClientErrorCode.BwWarEventManager_CallActionSetHasFogWithoutExtraData_01);
            if (turnsCount == 0) {
                fogMap.setForceExpirePlayerIndex(null);
                fogMap.setForceExpireTurnIndex(null);
            } else {
                fogMap.setForceExpirePlayerIndex(war.getPlayerIndexInTurn());
                fogMap.setForceExpireTurnIndex(war.getTurnManager().getTurnIndex() + turnsCount);
            }
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        private async _callActionSetCustomCounterWithExtraData(action: WarEvent.IWeaSetCustomCounter, isFast: boolean): Promise<void> {
            const multiplierPercentage  = action.multiplierPercentage ?? 100;
            const deltaValue            = action.deltaValue ?? 0;
            const maxValue              = CommonConstants.WarCustomCounterMaxValue;
            const customCounterIdArray  = action.customCounterIdArray;
            for (let counterId = CommonConstants.WarCustomCounterMinId; counterId <= CommonConstants.WarCustomCounterMaxId; ++counterId) {
                if ((customCounterIdArray?.length) && (customCounterIdArray.indexOf(counterId) < 0)) {
                    continue;
                }

                this._setCustomCounter(
                    counterId,
                    Math.min(
                        maxValue,
                        Math.max(-maxValue, Math.floor(this._getCustomCounter(counterId) * multiplierPercentage / 100 + deltaValue))
                    )
                );
            }
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        private async _callActionSetCustomCounterWithoutExtraData(action: WarEvent.IWeaSetCustomCounter, isFast: boolean): Promise<void> {
            const multiplierPercentage  = action.multiplierPercentage ?? 100;
            const deltaValue            = action.deltaValue ?? 0;
            const maxValue              = CommonConstants.WarCustomCounterMaxValue;
            const customCounterIdArray  = action.customCounterIdArray;
            for (let counterId = CommonConstants.WarCustomCounterMinId; counterId <= CommonConstants.WarCustomCounterMaxId; ++counterId) {
                if ((customCounterIdArray?.length) && (customCounterIdArray.indexOf(counterId) < 0)) {
                    continue;
                }

                this._setCustomCounter(
                    counterId,
                    Math.min(
                        maxValue,
                        Math.max(-maxValue, Math.floor(this._getCustomCounter(counterId) * multiplierPercentage / 100 + deltaValue))
                    )
                );
            }
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        private async _callActionDeprecatedSetPlayerAliveStateWithExtraData(action: WarEvent.IWeaDeprecatedSetPlayerAliveState, isFastExecute: boolean): Promise<void> {
            // nothing to do
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        private async _callActionDeprecatedSetPlayerAliveStateWithoutExtraData(action: WarEvent.IWeaDeprecatedSetPlayerAliveState, isFastExecute: boolean): Promise<void> {
            const war = this._getWar();
            const playerIndex = action.playerIndex;
            if ((playerIndex == null) || (playerIndex === CommonConstants.WarNeutralPlayerIndex)) {
                throw Twns.Helpers.newError(`Invalid playerIndex: ${playerIndex}`);
            }

            const playerAliveState = Twns.Helpers.getExisted(action.playerAliveState);
            if (!Config.ConfigManager.checkIsValidPlayerAliveState(playerAliveState)) {
                throw Twns.Helpers.newError(`Invalid playerAliveState: ${playerAliveState}`);
            }

            const player = war.getPlayer(playerIndex);
            if (player) {
                player.setAliveState(playerAliveState);
            }
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        private async _callActionDeprecatedSetPlayerFundWithExtraData(action: WarEvent.IWeaDeprecatedSetPlayerFund, isFastExecute: boolean): Promise<void> {
            // nothing to do
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        private async _callActionDeprecatedSetPlayerFundWithoutExtraData(action: WarEvent.IWeaDeprecatedSetPlayerFund, isFastExecute: boolean): Promise<void> {
            const player                = this._getWar().getPlayer(Twns.Helpers.getExisted(action.playerIndex));
            const multiplierPercentage  = action.multiplierPercentage ?? 100;
            const deltaValue            = action.deltaValue ?? 0;
            const maxValue              = CommonConstants.WarPlayerMaxFund;
            player.setFund(Math.min(
                maxValue,
                Math.max(-maxValue, Math.floor(player.getFund() * multiplierPercentage / 100 + deltaValue)))
            );
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        private async _callActionDeprecatedSetPlayerCoEnergyWithExtraData(action: WarEvent.IWeaDeprecatedSetPlayerCoEnergy, isFastExecute: boolean): Promise<void> {
            // nothing to do
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        private async _callActionDeprecatedSetPlayerCoEnergyWithoutExtraData(action: WarEvent.IWeaDeprecatedSetPlayerCoEnergy, isFastExecute: boolean): Promise<void> {
            const player                = this._getWar().getPlayer(Twns.Helpers.getExisted(action.playerIndex));
            const multiplierPercentage  = action.multiplierPercentage ?? 100;
            const deltaPercentage       = action.deltaPercentage ?? 0;
            const maxEnergy             = player.getCoMaxEnergy();
            if (maxEnergy > 0) {
                player.setCoCurrentEnergy(Math.max(
                    0,
                    Math.min(maxEnergy, Math.floor(player.getCoCurrentEnergy() * multiplierPercentage / 100 + maxEnergy * deltaPercentage / 100))
                ));
            }
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        private async _callActionStopPersistentActionWithExtraData(action: WarEvent.IWeaStopPersistentAction, isFastExecute: boolean): Promise<void> {
            const actionIdSet = this.getOngoingPersistentActionIdSet();
            for (const actionId of action.actionIdArray ?? []) {
                actionIdSet.delete(actionId);
            }
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        private async _callActionStopPersistentActionWithoutExtraData(action: WarEvent.IWeaStopPersistentAction, isFastExecute: boolean): Promise<void> {
            const actionIdSet = this.getOngoingPersistentActionIdSet();
            for (const actionId of action.actionIdArray ?? []) {
                actionIdSet.delete(actionId);
            }
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        private async _callActionSetPlayerAliveStateWithExtraData(action: WarEvent.IWeaSetPlayerAliveState, isFastExecute: boolean): Promise<void> {
            // nothing to do
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        private async _callActionSetPlayerAliveStateWithoutExtraData(action: WarEvent.IWeaSetPlayerAliveState, isFastExecute: boolean): Promise<void> {
            const playerAliveState = Twns.Helpers.getExisted(action.playerAliveState);
            if (!Config.ConfigManager.checkIsValidPlayerAliveState(playerAliveState)) {
                throw Twns.Helpers.newError(`Invalid playerAliveState: ${playerAliveState}`);
            }

            const playerIndexArray = action.playerIndexArray;
            for (const [playerIndex, player] of this._getWar().getPlayerManager().getAllPlayersDict()) {
                if ((playerIndexArray?.length) && (playerIndexArray.indexOf(playerIndex) < 0)) {
                    continue;
                }

                player.setAliveState(playerAliveState);
            }
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        private async _callActionSetPlayerStateWithExtraData(action: WarEvent.IWeaSetPlayerState, isFastExecute: boolean): Promise<void> {
            // nothing to do
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        private async _callActionSetPlayerStateWithoutExtraData(action: WarEvent.IWeaSetPlayerState, isFastExecute: boolean): Promise<void> {
            const conPlayerIndexArray           = action.conPlayerIndexArray;
            const conAliveStateArray            = action.conAliveStateArray;
            const conCoUsingSkillTypeArray      = action.conCoUsingSkillTypeArray;
            const conFund                       = action.conFund;
            const conFundComparator             = action.conFundComparator ?? Twns.Types.ValueComparator.EqualTo;
            const conEnergyPercentage           = action.conEnergyPercentage;
            const conEnergyPercentageComparator = action.conEnergyPercentageComparator ?? Twns.Types.ValueComparator.EqualTo;
            const actFundMultiplierPercentage   = action.actFundMultiplierPercentage ?? 100;
            const actFundDeltaValue             = action.actFundDeltaValue ?? 0;
            const actCoEnergyMultiplierPct      = action.actCoEnergyMultiplierPct ?? 100;
            const actCoEnergyDeltaPct           = action.actCoEnergyDeltaPct ?? 0;
            const maxFund                       = CommonConstants.WarPlayerMaxFund;
            const actAliveState                 = action.actAliveState;

            for (const [playerIndex, player] of this._getWar().getPlayerManager().getAllPlayersDict()) {
                if (((conPlayerIndexArray?.length) && (conPlayerIndexArray.indexOf(playerIndex) < 0))                           ||
                    ((conAliveStateArray?.length) && (conAliveStateArray.indexOf(player.getAliveState()) < 0))                  ||
                    ((conCoUsingSkillTypeArray?.length) && (conCoUsingSkillTypeArray.indexOf(player.getCoUsingSkillType()) < 0))
                ) {
                    continue;
                }

                const fund = player.getFund();
                if ((conFund != null)                       &&
                    (!Twns.Helpers.checkIsMeetValueComparator({
                        comparator  : conFundComparator,
                        targetValue : conFund,
                        actualValue : fund,
                    }))
                ) {
                    continue;
                }

                const coMaxEnergy       = player.getCoMaxEnergy();
                const coCurrentEnergy   = player.getCoCurrentEnergy();
                if (conEnergyPercentage != null) {
                    if ((coMaxEnergy == 0)                      ||
                        (!Twns.Helpers.checkIsMeetValueComparator({
                            comparator  : conEnergyPercentageComparator,
                            targetValue : conEnergyPercentage,
                            actualValue : coCurrentEnergy * 100 / coMaxEnergy,
                        }))
                    ) {
                        continue;
                    }
                }

                player.setFund(Math.min(
                    maxFund,
                    Math.max(-maxFund, Math.floor(fund * actFundMultiplierPercentage / 100 + actFundDeltaValue)))
                );

                player.setCoCurrentEnergy(Twns.Helpers.getValueInRange({
                    maxValue    : coMaxEnergy,
                    minValue    : 0,
                    rawValue    : Math.floor(coCurrentEnergy * actCoEnergyMultiplierPct / 100 + coMaxEnergy * actCoEnergyDeltaPct / 100),
                }));

                if (actAliveState != null) {
                    player.setAliveState(actAliveState);
                }
            }
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        private async _callActionSetPlayerCoEnergyWithExtraData(action: WarEvent.IWeaSetPlayerCoEnergy, isFastExecute: boolean): Promise<void> {
            // nothing to do
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        private async _callActionSetPlayerCoEnergyWithoutExtraData(action: WarEvent.IWeaSetPlayerCoEnergy, isFastExecute: boolean): Promise<void> {
            const multiplierPercentage  = action.actCoEnergyMultiplierPct ?? 100;
            const deltaPercentage       = action.actCoEnergyDeltaPct ?? 0;
            const playerIndexArray      = action.playerIndexArray;
            for (const [playerIndex, player] of this._getWar().getPlayerManager().getAllPlayersDict()) {
                if ((playerIndexArray?.length) && (playerIndexArray.indexOf(playerIndex) < 0)) {
                    continue;
                }

                const maxEnergy = player.getCoMaxEnergy();
                if (maxEnergy > 0) {
                    player.setCoCurrentEnergy(Math.max(
                        0,
                        Math.min(maxEnergy, Math.floor(player.getCoCurrentEnergy() * multiplierPercentage / 100 + maxEnergy * deltaPercentage / 100))
                    ));
                }
            }
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        private async _callActionSetUnitStateWithExtraData(action: WarEvent.IWeaSetUnitState, isFastExecute: boolean): Promise<void> {
            // nothing to do
        }
        private async _callActionSetUnitStateWithoutExtraData(action: WarEvent.IWeaSetUnitState, isFastExecute: boolean): Promise<void> {
            const playerIndexArray              = action.conPlayerIndexArray ?? [];
            const teamIndexArray                = action.conTeamIndexArray ?? [];
            const locationIdArray               = action.conLocationIdArray ?? [];
            const gridIndexArray                = action.conGridIndexArray?.map(v => Twns.Helpers.getExisted(GridIndexHelpers.convertGridIndex(v), ClientErrorCode.BwWarEventManager_CallActionSetUnitHpWithoutExtraData_00)) ?? [];
            const unitTypeArray                 = action.conUnitTypeArray ?? [];
            const actionStateArray              = action.conActionStateArray ?? [];
            const hasLoadedCo                   = action.conHasLoadedCo;
            const conHp                         = action.conHp;
            const conHpComparator               = action.conHpComparator ?? Twns.Types.ValueComparator.EqualTo;
            const conFuelPct                    = action.conFuelPct;
            const conFuelPctComparator          = action.conFuelPctComparator ?? Twns.Types.ValueComparator.EqualTo;
            const conPriAmmoPct                 = action.conPriAmmoPct;
            const conPriAmmoPctComparator       = action.conPriAmmoPctComparator ?? Twns.Types.ValueComparator.EqualTo;
            const conPromotion                  = action.conPromotion;
            const conPromotionComparator        = action.conPromotionComparator ?? Twns.Types.ValueComparator.EqualTo;
            const destroyUnit                   = action.actDestroyUnit;
            const actActionState                = action.actActionState;
            const actHasLoadedCo                = action.actHasLoadedCo;
            const hpDeltaValue                  = action.actHpDeltaValue ?? 0;
            const hpMultiplierPercentage        = action.actHpMultiplierPercentage ?? 100;
            const fuelDeltaValue                = action.actFuelDeltaValue ?? 0;
            const fuelMultiplierPercentage      = action.actFuelMultiplierPercentage ?? 100;
            const priAmmoDeltaValue             = action.actPriAmmoDeltaValue ?? 0;
            const priAmmoMultiplierPercentage   = action.actPriAmmoMultiplierPercentage ?? 100;
            const promotionDeltaValue           = action.actPromotionDeltaValue ?? 0;
            const promotionMultiplierPercentage = action.actPromotionMultiplierPercentage ?? 100;
            const war                           = this._getWar();
            const unitMap                       = war.getUnitMap();
            const tileMap                       = war.getTileMap();
            const mapSize                       = tileMap.getMapSize();
            const mapWidth                      = mapSize.width;
            const mapHeight                     = mapSize.height;
            const minHp                         = 1;
            const minFuel                       = 0;
            const minPromotion                  = 0;
            const minPriAmmo                    = 0;
            for (let x = 0; x < mapWidth; ++x) {
                for (let y = 0; y < mapHeight; ++y) {
                    const gridIndex : Twns.Types.GridIndex = { x, y };
                    const unit      = unitMap.getUnitOnMap(gridIndex);
                    const tile      = tileMap.getTile(gridIndex);
                    if ((unit == null)                                                                                          ||
                        ((unitTypeArray.length) && (unitTypeArray.indexOf(unit.getUnitType()) < 0))                             ||
                        ((playerIndexArray.length) && (playerIndexArray.indexOf(unit.getPlayerIndex()) < 0))                    ||
                        ((teamIndexArray.length) && (teamIndexArray.indexOf(unit.getTeamIndex()) < 0))                          ||
                        ((gridIndexArray.length) && (!gridIndexArray.some(v => GridIndexHelpers.checkIsEqual(v, gridIndex))))   ||
                        ((locationIdArray.length) && (!locationIdArray.some(v => tile.getHasLocationFlag(v))))                  ||
                        ((actionStateArray.length) && (actionStateArray.indexOf(unit.getActionState()) < 0))                    ||
                        ((hasLoadedCo != null) && (unit.getHasLoadedCo() !== hasLoadedCo))
                    ) {
                        continue;
                    }

                    if ((conHp != null)                         &&
                        (!Twns.Helpers.checkIsMeetValueComparator({
                            comparator  : conHpComparator,
                            targetValue : conHp,
                            actualValue : unit.getCurrentHp(),
                        }))
                    ) {
                        continue;
                    }

                    if ((conPromotion != null)                  &&
                        (!Twns.Helpers.checkIsMeetValueComparator({
                            comparator  : conPromotionComparator,
                            targetValue : conPromotion,
                            actualValue : unit.getCurrentPromotion(),
                        }))
                    ) {
                        continue;
                    }

                    if ((conFuelPct != null)                    &&
                        (!Twns.Helpers.checkIsMeetValueComparator({
                            comparator  : conFuelPctComparator,
                            targetValue : conFuelPct * 100,
                            actualValue : unit.getCurrentFuel() * 100 / unit.getMaxFuel(),
                        }))
                    ) {
                        continue;
                    }

                    if (conPriAmmoPct != null) {
                        const maxAmmo = unit.getPrimaryWeaponMaxAmmo();
                        if ((maxAmmo == null)                       ||
                            (!Twns.Helpers.checkIsMeetValueComparator({
                                comparator  : conPriAmmoPctComparator,
                                targetValue : conPriAmmoPct * 100,
                                actualValue : Twns.Helpers.getExisted(unit.getPrimaryWeaponCurrentAmmo(), ClientErrorCode.BwWarEventManager_CallActionSetUnitHpWithoutExtraData_01) * 100 / maxAmmo,
                            }))
                        ) {
                            continue;
                        }
                    }

                    if (destroyUnit) {
                        WarDestructionHelpers.destroyUnitOnMap(war, gridIndex, !isFastExecute);

                    } else {
                        unit.setCurrentHp(Twns.Helpers.getValueInRange({
                            maxValue    : unit.getMaxHp(),
                            minValue    : minHp,
                            rawValue    : Math.floor(unit.getCurrentHp() * hpMultiplierPercentage / 100 + hpDeltaValue),
                        }));

                        unit.setCurrentFuel(Twns.Helpers.getValueInRange({
                            maxValue    : unit.getMaxFuel(),
                            minValue    : minFuel,
                            rawValue    : Math.floor(unit.getCurrentFuel() * fuelMultiplierPercentage / 100 + fuelDeltaValue),
                        }));

                        unit.setCurrentPromotion(Twns.Helpers.getValueInRange({
                            maxValue    : unit.getMaxPromotion(),
                            minValue    : minPromotion,
                            rawValue    : Math.floor(unit.getCurrentPromotion() * promotionMultiplierPercentage / 100 + promotionDeltaValue),
                        }));

                        {
                            const currentAmmo = unit.getPrimaryWeaponCurrentAmmo();
                            if (currentAmmo != null) {
                                unit.setPrimaryWeaponCurrentAmmo(Twns.Helpers.getValueInRange({
                                    maxValue    : Twns.Helpers.getExisted(unit.getPrimaryWeaponMaxAmmo(), ClientErrorCode.BwWarEventManager_CallActionSetUnitHpWithoutExtraData_02),
                                    minValue    : minPriAmmo,
                                    rawValue    : Math.floor(currentAmmo * priAmmoMultiplierPercentage / 100 + priAmmoDeltaValue),
                                }));
                            }
                        }

                        if (actActionState != null) {
                            unit.setActionState(actActionState);
                        }

                        if (actHasLoadedCo != null) {
                            unit.setHasLoadedCo(actHasLoadedCo);
                        }

                        if (!isFastExecute) {
                            unit.updateView();
                        }
                    }
                }
            }
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        private async _callActionSetTileTypeWithExtraData(action: WarEvent.IWeaSetTileType, isFastExecute: boolean): Promise<void> {
            // nothing to do
        }
        private async _callActionSetTileTypeWithoutExtraData(action: WarEvent.IWeaSetTileType, isFastExecute: boolean): Promise<void> {
            const war                       = this._getWar();
            const gameConfig                = war.getGameConfig();
            const actTileData               = Twns.Helpers.getExisted(action.actTileData, ClientErrorCode.BwWarEventManager_CallActionSetTileTypeWithoutExtraData_00);
            const rawActBaseType            = Twns.Helpers.getExisted(actTileData.baseType, ClientErrorCode.BwWarEventManager_CallActionSetTileTypeWithoutExtraData_01);
            const rawActObjectType          = Twns.Helpers.getExisted(actTileData.objectType, ClientErrorCode.BwWarEventManager_CallActionSetTileTypeWithoutExtraData_02);
            const actDestroyUnit            = action.actDestroyUnit;
            const actIsModifyTileBase       = (action.actIsModifyTileBase) || (action.actIsModifyTileBase == null);
            const actIsModifyTileDecorator  = (action.actIsModifyTileDecorator) || (action.actIsModifyTileDecorator == null);
            const actIsModifyTileObject     = (action.actIsModifyTileObject) || (action.actIsModifyTileObject == null);
            const conIsHighlighted          = action.conIsHighlighted;
            const conLocationIdArray        = action.conLocationIdArray ?? [];
            const conGridIndexArray         = action.conGridIndexArray?.map(v => Twns.Helpers.getExisted(GridIndexHelpers.convertGridIndex(v), ClientErrorCode.BwWarEventManager_CallActionSetTileTypeWithoutExtraData_03)) ?? [];
            const unitMap                   = war.getUnitMap();
            const tileMap                   = war.getTileMap();
            const mapSize                   = tileMap.getMapSize();
            const mapWidth                  = mapSize.width;
            const mapHeight                 = mapSize.height;
            for (let x = 0; x < mapWidth; ++x) {
                for (let y = 0; y < mapHeight; ++y) {
                    const gridIndex : Twns.Types.GridIndex = { x, y };
                    const tile      = tileMap.getTile(gridIndex);
                    if (((conIsHighlighted != null) && (tile.getIsHighlighted() !== conIsHighlighted))                              ||
                        ((conGridIndexArray.length) && (!conGridIndexArray.some(v => GridIndexHelpers.checkIsEqual(v, gridIndex)))) ||
                        ((conLocationIdArray.length) && (!conLocationIdArray.some(v => tile.getHasLocationFlag(v))))
                    ) {
                        continue;
                    }

                    const actBaseType   = actIsModifyTileBase ? rawActBaseType : tile.getBaseType();
                    const actObjectType = actIsModifyTileObject ? rawActObjectType : tile.getObjectType();
                    if (unitMap.getUnitOnMap(gridIndex)) {
                        if (actDestroyUnit) {
                            WarDestructionHelpers.destroyUnitOnMap(war, gridIndex, !isFastExecute);
                        } else if (gameConfig.getTileTemplateCfgByType(Config.ConfigManager.getTileType(actBaseType, actObjectType))?.maxHp != null) {
                            continue;
                        }
                    }

                    const tileData: CommonProto.WarSerialization.ISerialTile = {
                        gridIndex,
                        playerIndex         : actIsModifyTileObject ? actTileData.playerIndex : tile.getPlayerIndex(),
                        baseType            : actBaseType,
                        baseShapeId         : actIsModifyTileBase ? actTileData.baseShapeId : tile.getBaseShapeId(),
                        decoratorType       : actIsModifyTileDecorator ? actTileData.decoratorType : tile.getDecoratorType(),
                        decoratorShapeId    : actIsModifyTileDecorator ? actTileData.decoratorShapeId : tile.getDecoratorShapeId(),
                        objectType          : actObjectType,
                        objectShapeId       : actIsModifyTileObject ? actTileData.objectShapeId : tile.getObjectShapeId(),
                        locationFlags       : tile.getLocationFlags(),
                        isHighlighted       : tile.getIsHighlighted(),
                    };
                    tile.init(tileData, gameConfig);
                    tile.startRunning(war);

                    if (!isFastExecute) {
                        tile.flushDataToView();
                    }
                }
            }
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        private async _callActionSetTileStateWithExtraData(action: WarEvent.IWeaSetTileState, isFastExecute: boolean): Promise<void> {
            // nothing to do
        }
        private async _callActionSetTileStateWithoutExtraData(action: WarEvent.IWeaSetTileState, isFastExecute: boolean): Promise<void> {
            const war                                   = this._getWar();
            const tileMap                               = war.getTileMap();
            const mapSize                               = tileMap.getMapSize();
            const mapWidth                              = mapSize.width;
            const mapHeight                             = mapSize.height;
            const conIsHighlighted                      = action.conIsHighlighted;
            const conLocationIdArray                    = action.conLocationIdArray ?? [];
            const conGridIndexArray                     = action.conGridIndexArray?.map(v => Twns.Helpers.getExisted(GridIndexHelpers.convertGridIndex(v), ClientErrorCode.BwWarEventManager_CallActionSetTileStateWithoutExtraData_00)) ?? [];
            const actHpMultiplierPercentage             = action.actHpMultiplierPercentage;
            const actHpDeltaValue                       = action.actHpDeltaValue;
            const actBuildPointMultiplierPercentage     = action.actBuildPointMultiplierPercentage;
            const actBuildPointDeltaValue               = action.actBuildPointDeltaValue;
            const actCapturePointMultiplierPercentage   = action.actCapturePointMultiplierPercentage;
            const actCapturePointDeltaValue             = action.actCapturePointDeltaValue;
            const actAddLocationIdArray                 = action.actAddLocationIdArray ?? [];
            const actDeleteLocationIdArray              = action.actDeleteLocationIdArray ?? [];
            const actIsHighlighted                      = action.actIsHighlighted;
            for (let x = 0; x < mapWidth; ++x) {
                for (let y = 0; y < mapHeight; ++y) {
                    const gridIndex : Twns.Types.GridIndex = { x, y };
                    const tile      = tileMap.getTile(gridIndex);
                    if (((conIsHighlighted != null) && (tile.getIsHighlighted() !== conIsHighlighted))                              ||
                        ((conGridIndexArray.length) && (!conGridIndexArray.some(v => GridIndexHelpers.checkIsEqual(v, gridIndex)))) ||
                        ((conLocationIdArray.length) && (!conLocationIdArray.some(v => tile.getHasLocationFlag(v))))
                    ) {
                        continue;
                    }

                    {
                        const currentHp = tile.getCurrentHp();
                        if ((currentHp != null)                                                 &&
                            ((actHpMultiplierPercentage != null) || (actHpDeltaValue != null))
                        ) {
                            tile.setCurrentHp(Twns.Helpers.getValueInRange({
                                minValue    : 0,
                                maxValue    : Twns.Helpers.getExisted(tile.getMaxHp(), ClientErrorCode.BwWarEventManager_CallActionSetTileStateWithoutExtraData_01),
                                rawValue    : Math.floor(currentHp * (actHpMultiplierPercentage ?? 100) / 100 + (actHpDeltaValue ?? 0)),
                            }));
                        }
                    }

                    {
                        const currentBuildPoint = tile.getCurrentBuildPoint();
                        if ((currentBuildPoint != null)                                                         &&
                            ((actBuildPointDeltaValue != null) || (actBuildPointMultiplierPercentage != null))
                        ) {
                            tile.setCurrentBuildPoint(Twns.Helpers.getValueInRange({
                                minValue    : 0,
                                maxValue    : Twns.Helpers.getExisted(tile.getMaxBuildPoint(), ClientErrorCode.BwWarEventManager_CallActionSetTileStateWithoutExtraData_02),
                                rawValue    : Math.floor(currentBuildPoint * (actBuildPointMultiplierPercentage ?? 100) / 100 + (actBuildPointDeltaValue ?? 0)),
                            }));
                        }
                    }

                    {
                        const currentCapturePoint = tile.getCurrentCapturePoint();
                        if ((currentCapturePoint != null)                                                           &&
                            ((actCapturePointDeltaValue != null) || (actCapturePointMultiplierPercentage != null))
                        ) {
                            tile.setCurrentCapturePoint(Twns.Helpers.getValueInRange({
                                minValue    : 0,
                                maxValue    : Twns.Helpers.getExisted(tile.getMaxCapturePoint(), ClientErrorCode.BwWarEventManager_CallActionSetTileStateWithoutExtraData_03),
                                rawValue    : Math.floor(currentCapturePoint * (actCapturePointMultiplierPercentage ?? 100) / 100 + (actCapturePointDeltaValue ?? 0)),
                            }));
                        }
                    }

                    if (actAddLocationIdArray.length) {
                        for (const locationId of actAddLocationIdArray) {
                            tile.setHasLocationFlag(locationId, true);
                        }
                    }

                    if (actDeleteLocationIdArray.length) {
                        for (const locationId of actDeleteLocationIdArray) {
                            tile.setHasLocationFlag(locationId, false);
                        }
                    }

                    if (actIsHighlighted != null) {
                        tile.setIsHighlighted(actIsHighlighted);
                    }

                    if (!isFastExecute) {
                        tile.flushDataToView();
                    }
                }
            }
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        private async _callActionPersistentShowTextWithExtraData(action: WarEvent.IWeaPersistentShowText, isFastExecute: boolean, actionId: number): Promise<void> {
            this.getOngoingPersistentActionIdSet().add(actionId);
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        private async _callActionPersistentShowTextWithoutExtraData(action: WarEvent.IWeaPersistentShowText, isFastExecute: boolean, actionId: number): Promise<void> {
            this.getOngoingPersistentActionIdSet().add(actionId);
        }

        public getCallableWarEventId(): number | null {                                // DONE
            for (const warEvent of this._getWar().getCommonSettingManager().getInstanceWarRule().warEventFullData?.eventArray || []) {
                const warEventId = Twns.Helpers.getExisted(warEvent.eventId);
                if (this._checkCanCallWarEvent(warEventId)) {
                    return warEventId;
                }
            }

            return null;
        }

        private _checkCanCallWarEvent(warEventId: number): boolean {            // DONE
            const warEvent = this.getWarEvent(warEventId);
            if ((this.getWarEventCalledCountInPlayerTurn(warEventId) >= Twns.Helpers.getExisted(warEvent.maxCallCountInPlayerTurn)) ||
                (this.getWarEventCalledCountTotal(warEventId) >= Twns.Helpers.getExisted(warEvent.maxCallCountTotal))
            ) {
                return false;
            }

            return this._checkIsMeetConditionNode(Twns.Helpers.getExisted(warEvent.conditionNodeId));
        }

        private _checkIsMeetConditionNode(nodeId: number): boolean {            // DONE
            const node              = this._getConditionNode(nodeId);
            const isAnd             = Twns.Helpers.getExisted(node.isAnd);
            const conditionIdArray  = node.conditionIdArray;
            const subNodeIdArray    = node.subNodeIdArray;
            if ((!conditionIdArray?.length) && (!subNodeIdArray?.length)) {
                throw Twns.Helpers.newError(`Empty conditionIdArray and subNodeIdArray.`);
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
            else if (condition.WecEventCalledCount)                 { return this._checkIsMeetConEventCalledCount(condition.WecEventCalledCount); }
            else if (condition.WecPlayerAliveStateEqualTo)          { return this._checkIsMeetConPlayerAliveStateEqualTo(condition.WecPlayerAliveStateEqualTo); }
            else if (condition.WecPlayerPresence)                   { return this._checkIsMeetConPlayerPresence(condition.WecPlayerPresence); }
            else if (condition.WecPlayerIndexInTurnEqualTo)         { return this._checkIsMeetConPlayerIndexInTurnEqualTo(condition.WecPlayerIndexInTurnEqualTo); }
            else if (condition.WecPlayerIndexInTurnGreaterThan)     { return this._checkIsMeetConPlayerIndexInTurnGreaterThan(condition.WecPlayerIndexInTurnGreaterThan); }
            else if (condition.WecPlayerIndexInTurnLessThan)        { return this._checkIsMeetConPlayerIndexInTurnLessThan(condition.WecPlayerIndexInTurnLessThan); }
            else if (condition.WecTurnIndexEqualTo)                 { return this._checkIsMeetConTurnIndexEqualTo(condition.WecTurnIndexEqualTo); }
            else if (condition.WecTurnIndexGreaterThan)             { return this._checkIsMeetConTurnIndexGreaterThan(condition.WecTurnIndexGreaterThan); }
            else if (condition.WecTurnIndexLessThan)                { return this._checkIsMeetConTurnIndexLessThan(condition.WecTurnIndexLessThan); }
            else if (condition.WecTurnIndexRemainderEqualTo)        { return this._checkIsMeetConTurnIndexRemainderEqualTo(condition.WecTurnIndexRemainderEqualTo); }
            else if (condition.WecTurnAndPlayer)                    { return this._checkIsMeetConTurnAndPlayer(condition.WecTurnAndPlayer); }
            else if (condition.WecTurnPhaseEqualTo)                 { return this._checkIsMeetConTurnPhaseEqualTo(condition.WecTurnPhaseEqualTo); }
            else if (condition.WecWeatherAndFog)                    { return this._checkIsMeetConWeatherAndFog(condition.WecWeatherAndFog); }
            else if (condition.WecTilePlayerIndexEqualTo)           { return this._checkIsMeetConTilePlayerIndexEqualTo(condition.WecTilePlayerIndexEqualTo); }
            else if (condition.WecTileTypeEqualTo)                  { return this._checkIsMeetConTileTypeEqualTo(condition.WecTileTypeEqualTo); }
            else if (condition.WecTilePresence)                     { return this._checkIsMeetConTilePresence(condition.WecTilePresence); }
            else if (condition.WecUnitPresence)                     { return this._checkIsMeetConUnitPresence(condition.WecUnitPresence); }
            else if (condition.WecCustomCounter)                    { return this._checkIsMeetConCustomCounter(condition.WecCustomCounter); }

            throw Twns.Helpers.newError(`Invalid condition!`);
        }

        private _checkIsMeetConEventCalledCountTotalEqualTo(condition: WarEvent.IWecEventCalledCountTotalEqualTo): boolean {
            const eventIdEqualTo    = Twns.Helpers.getExisted(condition.eventIdEqualTo);
            const countEqualTo      = Twns.Helpers.getExisted(condition.countEqualTo);
            const isNot             = Twns.Helpers.getExisted(condition.isNot);
            return (this.getWarEventCalledCountTotal(eventIdEqualTo) === countEqualTo)
                ? (isNot ? false : true)
                : (isNot ? true : false);
        }
        private _checkIsMeetConEventCalledCountTotalGreaterThan(condition: WarEvent.IWecEventCalledCountTotalGreaterThan): boolean {
            const eventIdEqualTo    = Twns.Helpers.getExisted(condition.eventIdEqualTo);
            const countGreaterThan  = Twns.Helpers.getExisted(condition.countGreaterThan);
            const isNot             = Twns.Helpers.getExisted(condition.isNot);
            return (this.getWarEventCalledCountTotal(eventIdEqualTo) > countGreaterThan)
                ? (isNot ? false : true)
                : (isNot ? true : false);
        }
        private _checkIsMeetConEventCalledCountTotalLessThan(condition: WarEvent.IWecEventCalledCountTotalLessThan): boolean {
            const eventIdEqualTo    = Twns.Helpers.getExisted(condition.eventIdEqualTo);
            const countLessThan     = Twns.Helpers.getExisted(condition.countLessThan);
            const isNot             = Twns.Helpers.getExisted(condition.isNot);
            return (this.getWarEventCalledCountTotal(eventIdEqualTo) < countLessThan)
                ? (isNot ? false : true)
                : (isNot ? true : false);
        }
        private _checkIsMeetConEventCalledCount(condition: WarEvent.IWecEventCalledCount): boolean {
            const eventIdArray          = condition.eventIdArray ?? [];
            const timesInTurn           = condition.timesInTurn;
            const timesTotal            = condition.timesTotal;
            const timesInTurnComparator = Twns.Helpers.getExisted(condition.timesInTurnComparator, ClientErrorCode.BwWarEventManager_CheckIsMeetConEventCalledCount_00);
            const timesTotalComparator  = Twns.Helpers.getExisted(condition.timesTotalComparator, ClientErrorCode.BwWarEventManager_CheckIsMeetConEventCalledCount_01);

            let eventsCount = 0;
            for (const warEvent of this._getWar().getCommonSettingManager().getInstanceWarRule().warEventFullData?.eventArray ?? []) {
                const eventId = Twns.Helpers.getExisted(warEvent.eventId, ClientErrorCode.BwWarEventManager_CheckIsMeetConEventCalledCount_02);
                if ((eventIdArray.length) && (eventIdArray.indexOf(eventId) < 0)) {
                    continue;
                }

                if ((timesInTurn != null)                   &&
                    (!Twns.Helpers.checkIsMeetValueComparator({
                        comparator  : timesInTurnComparator,
                        targetValue : timesInTurn,
                        actualValue : this.getWarEventCalledCountInPlayerTurn(eventId),
                    }))
                ) {
                    continue;
                }

                if ((timesTotal != null)                    &&
                    (!Twns.Helpers.checkIsMeetValueComparator({
                        comparator  : timesTotalComparator,
                        targetValue : timesTotal,
                        actualValue : this.getWarEventCalledCountTotal(eventId),
                    }))
                ) {
                    continue;
                }

                ++eventsCount;
            }

            return Twns.Helpers.checkIsMeetValueComparator({
                comparator  : Twns.Helpers.getExisted(condition.eventsCountComparator, ClientErrorCode.BwWarEventManager_CheckIsMeetConEventCalledCount_03),
                targetValue : Twns.Helpers.getExisted(condition.eventsCount, ClientErrorCode.BwWarEventManager_CheckIsMeetConEventCalledCount_04),
                actualValue : eventsCount,
            });
        }

        private _checkIsMeetConPlayerAliveStateEqualTo(condition: WarEvent.IWecPlayerAliveStateEqualTo): boolean {
            const playerIndexEqualTo    = Twns.Helpers.getExisted(condition.playerIndexEqualTo);
            const aliveStateEqualTo     = Twns.Helpers.getExisted(condition.aliveStateEqualTo);
            const isNot                 = Twns.Helpers.getExisted(condition.isNot);
            const player                = this._getWar().getPlayer(playerIndexEqualTo);
            return (player.getAliveState() === aliveStateEqualTo)
                ? (isNot ? false : true)
                : (isNot ? true : false);
        }
        private _checkIsMeetConPlayerPresence(condition: WarEvent.IWecPlayerPresence): boolean {
            const playerIndexArray              = condition.playerIndexArray ?? [];
            const aliveStateArray               = condition.aliveStateArray ?? [];
            const coUsingSkillTypeArray         = condition.coUsingSkillTypeArray ?? [];
            const coCategoryIdArray             = condition.coCategoryIdArray ?? [];
            const targetFund                    = condition.fund;
            const fundComparator                = Twns.Helpers.getExisted(condition.fundComparator, ClientErrorCode.BwWarEventManager_CheckIsMeetConPlayerState_00);
            const targetEnergyPercentage        = condition.energyPercentage;
            const energyPercentageComparator    = Twns.Helpers.getExisted(condition.energyPercentageComparator, ClientErrorCode.BwWarEventManager_CheckIsMeetConPlayerState_01);
            const war                           = this._getWar();
            const gameConfig                    = war.getGameConfig();
            let playersCount                    = 0;
            for (const [playerIndex, player] of war.getPlayerManager().getAllPlayersDict()) {
                if (((playerIndexArray.length) && (playerIndexArray.indexOf(playerIndex) < 0))                              ||
                    ((aliveStateArray.length) && (aliveStateArray.indexOf(player.getAliveState()) < 0))                     ||
                    ((coUsingSkillTypeArray.length) && (coUsingSkillTypeArray.indexOf(player.getCoUsingSkillType()) < 0))
                ) {
                    continue;
                }

                if ((targetFund != null) && (!Twns.Helpers.checkIsMeetValueComparator({
                    comparator  : fundComparator,
                    targetValue : targetFund,
                    actualValue : player.getFund(),
                }))) {
                    continue;
                }

                if (coCategoryIdArray.length) {
                    const categoryId = gameConfig.getCoBasicCfg(player.getCoId())?.categoryId;
                    if ((categoryId == null) || (coCategoryIdArray.indexOf(categoryId) < 0)) {
                        continue;
                    }
                }

                if (targetEnergyPercentage != null) {
                    const maxEnergy = player.getCoMaxEnergy();
                    if ((maxEnergy <= 0) || (!Twns.Helpers.checkIsMeetValueComparator({
                        comparator  : energyPercentageComparator,
                        targetValue : targetEnergyPercentage,
                        actualValue : player.getCoCurrentEnergy() * 100 / maxEnergy,
                    }))) {
                        continue;
                    }
                }

                ++playersCount;
            }

            return Twns.Helpers.checkIsMeetValueComparator({
                comparator  : Twns.Helpers.getExisted(condition.playersCountComparator, ClientErrorCode.BwWarEventManager_CheckIsMeetConPlayerState_02),
                actualValue : playersCount,
                targetValue : Twns.Helpers.getExisted(condition.playersCount, ClientErrorCode.BwWarEventManager_CheckIsMeetConPlayerState_03),
            });
        }

        private _checkIsMeetConPlayerIndexInTurnEqualTo(condition: WarEvent.IWecPlayerIndexInTurnEqualTo): boolean {
            const valueEqualTo  = Twns.Helpers.getExisted(condition.valueEqualTo);
            const isNot         = Twns.Helpers.getExisted(condition.isNot);
            const playerIndex   = this._getWar().getPlayerIndexInTurn();
            return (playerIndex === valueEqualTo)
                ? (isNot ? false : true)
                : (isNot ? true : false);
        }
        private _checkIsMeetConPlayerIndexInTurnGreaterThan(condition: WarEvent.IWecPlayerIndexInTurnGreaterThan): boolean {
            const valueGreaterThan  = Twns.Helpers.getExisted(condition.valueGreaterThan);
            const isNot             = Twns.Helpers.getExisted(condition.isNot);
            const playerIndex       = this._getWar().getPlayerIndexInTurn();
            return (playerIndex > valueGreaterThan)
                ? (isNot ? false : true)
                : (isNot ? true : false);
        }
        private _checkIsMeetConPlayerIndexInTurnLessThan(condition: WarEvent.IWecPlayerIndexInTurnLessThan): boolean {
            const valueLessThan = Twns.Helpers.getExisted(condition.valueLessThan);
            const isNot         = Twns.Helpers.getExisted(condition.isNot);
            const playerIndex   = this._getWar().getPlayerIndexInTurn();
            return (playerIndex < valueLessThan)
                ? (isNot ? false : true)
                : (isNot ? true : false);
        }

        private _checkIsMeetConTurnIndexEqualTo(condition: WarEvent.IWecTurnIndexEqualTo): boolean {
            const valueEqualTo  = Twns.Helpers.getExisted(condition.valueEqualTo);
            const isNot         = Twns.Helpers.getExisted(condition.isNot);
            const turnIndex     = this._getWar().getTurnManager().getTurnIndex();
            return (turnIndex === valueEqualTo)
                ? (isNot ? false : true)
                : (isNot ? true : false);
        }
        private _checkIsMeetConTurnIndexGreaterThan(condition: WarEvent.IWecTurnIndexGreaterThan): boolean {
            const valueGreaterThan  = Twns.Helpers.getExisted(condition.valueGreaterThan);
            const isNot             = Twns.Helpers.getExisted(condition.isNot);
            const turnIndex         = this._getWar().getTurnManager().getTurnIndex();
            return (turnIndex > valueGreaterThan)
                ? (isNot ? false : true)
                : (isNot ? true : false);
        }
        private _checkIsMeetConTurnIndexLessThan(condition: WarEvent.IWecTurnIndexLessThan): boolean {
            const valueLessThan     = Twns.Helpers.getExisted(condition.valueLessThan);
            const isNot             = Twns.Helpers.getExisted(condition.isNot);
            const turnIndex         = this._getWar().getTurnManager().getTurnIndex();
            return (turnIndex < valueLessThan)
                ? (isNot ? false : true)
                : (isNot ? true : false);
        }
        private _checkIsMeetConTurnIndexRemainderEqualTo(condition: WarEvent.IWecTurnIndexRemainderEqualTo): boolean {
            const divider           = Twns.Helpers.getExisted(condition.divider);
            const remainderEqualTo  = Twns.Helpers.getExisted(condition.remainderEqualTo);
            const isNot             = Twns.Helpers.getExisted(condition.isNot);
            const turnIndex         = this._getWar().getTurnManager().getTurnIndex();
            return (turnIndex % divider === remainderEqualTo)
                ? (isNot ? false : true)
                : (isNot ? true : false);
        }
        private _checkIsMeetConTurnAndPlayer(condition: WarEvent.IWecTurnAndPlayer): boolean {
            const turnManager   = this._getWar().getTurnManager();
            const turnIndex     = turnManager.getTurnIndex();
            {
                const targetTurnIndex       = condition.turnIndex;
                const turnIndexComparator   = condition.turnIndexComparator;
                if ((targetTurnIndex != null) && (turnIndexComparator != null)) {
                    if (!Twns.Helpers.checkIsMeetValueComparator({
                        comparator  : turnIndexComparator,
                        actualValue : turnIndex,
                        targetValue : targetTurnIndex,
                    })) {
                        return false;
                    }
                }
            }
            {
                const turnIndexDivider      = condition.turnIndexDivider;
                const targetRemainder       = condition.turnIndexRemainder;
                const remainderComparator   = condition.turnIndexRemainderComparator;
                if ((turnIndexDivider != null) && (targetRemainder != null) && (remainderComparator != null)) {
                    if (!Twns.Helpers.checkIsMeetValueComparator({
                        comparator  : remainderComparator,
                        actualValue : turnIndex % turnIndexDivider,
                        targetValue : targetRemainder,
                    })) {
                        return false;
                    }
                }
            }
            {
                const turnPhase = condition.turnPhase;
                if ((turnPhase != null) && (turnManager.getPhaseCode() !== turnPhase)) {
                    return false;
                }
            }
            {
                const playerIndexArray = condition.playerIndexArray;
                if ((playerIndexArray?.length) && (playerIndexArray.indexOf(turnManager.getPlayerIndexInTurn()) < 0)) {
                    return false;
                }
            }

            return true;
        }

        private _checkIsMeetConTurnPhaseEqualTo(condition: WarEvent.IWecTurnPhaseEqualTo): boolean {
            const valueEqualTo  = Twns.Helpers.getExisted(condition.valueEqualTo);
            const isNot         = Twns.Helpers.getExisted(condition.isNot);
            const phaseCode     = this._getWar().getTurnManager().getPhaseCode();
            return (phaseCode === valueEqualTo)
                ? (isNot ? false : true)
                : (isNot ? true : false);
        }

        private _checkIsMeetConWeatherAndFog(condition: WarEvent.IWecWeatherAndFog): boolean {
            const war               = this._getWar();
            const weatherTypeArray  = condition.weatherTypeArray;
            if ((weatherTypeArray?.length) && (weatherTypeArray.indexOf(war.getWeatherManager().getCurrentWeatherType()) < 0)) {
                return false;
            }

            const hasFogCurrently = condition.hasFogCurrently;
            if ((hasFogCurrently != null) && (war.getFogMap().checkHasFogCurrently() != hasFogCurrently)) {
                return false;
            }

            return true;
        }

        private _checkIsMeetConTilePlayerIndexEqualTo(condition: WarEvent.IWecTilePlayerIndexEqualTo): boolean {
            const tile  = this._getWar().getTileMap().getTile(Twns.Helpers.getExisted(GridIndexHelpers.convertGridIndex(condition.gridIndex), ClientErrorCode.BwWarEventManager_CheckIsMeetConTilePlayerIndexEqualTo_00));
            const isNot = condition.isNot;
            return (tile.getPlayerIndex() === Twns.Helpers.getExisted(condition.playerIndex, ClientErrorCode.BwWarEventManager_CheckIsMeetConTilePlayerIndexEqualTo_01))
                ? (isNot ? false : true)
                : (isNot ? true : false);
        }
        private _checkIsMeetConTileTypeEqualTo(condition: WarEvent.IWecTileTypeEqualTo): boolean {
            const tile  = this._getWar().getTileMap().getTile(Twns.Helpers.getExisted(GridIndexHelpers.convertGridIndex(condition.gridIndex), ClientErrorCode.BwWarEventManager_CheckIsMeetConTileTypeEqualTo_00));
            const isNot = condition.isNot;
            return (tile.getType() === Twns.Helpers.getExisted(condition.tileType, ClientErrorCode.BwWarEventManager_CheckIsMeetConTileTypeEqualTo_01))
                ? (isNot ? false : true)
                : (isNot ? true : false);
        }
        private _checkIsMeetConTilePresence(condition: WarEvent.IWecTilePresence): boolean {
            const playerIndexArray      = condition.playerIndexArray ?? [];
            const teamIndexArray        = condition.teamIndexArray ?? [];
            const locationIdArray       = condition.locationIdArray ?? [];
            const gridIndexArray        = condition.gridIndexArray?.map(v => Twns.Helpers.getExisted(GridIndexHelpers.convertGridIndex(v), ClientErrorCode.BwWarEventManager_CheckIsMeetConTilePresence_00)) ?? [];
            const tileTypeArray         = condition.tileTypeArray ?? [];
            const war                   = this._getWar();
            const tileMap               = war.getTileMap();
            const mapSize               = tileMap.getMapSize();
            const mapWidth              = mapSize.width;
            const mapHeight             = mapSize.height;
            let tilesCount              = 0;
            for (let x = 0; x < mapWidth; ++x) {
                for (let y = 0; y < mapHeight; ++y) {
                    const gridIndex : Twns.Types.GridIndex = { x, y };
                    const tile      = tileMap.getTile(gridIndex);
                    if (((tileTypeArray.length) && (tileTypeArray.indexOf(tile.getType()) < 0))                                 ||
                        ((playerIndexArray.length) && (playerIndexArray.indexOf(tile.getPlayerIndex()) < 0))                    ||
                        ((teamIndexArray.length) && (teamIndexArray.indexOf(tile.getTeamIndex()) < 0))                          ||
                        ((gridIndexArray.length) && (!gridIndexArray.some(v => GridIndexHelpers.checkIsEqual(v, gridIndex))))   ||
                        ((locationIdArray.length) && (!locationIdArray.some(v => tile.getHasLocationFlag(v))))
                    ) {
                        continue;
                    }

                    ++tilesCount;
                }
            }

            return Twns.Helpers.checkIsMeetValueComparator({
                comparator  : Twns.Helpers.getExisted(condition.tilesCountComparator, ClientErrorCode.BwWarEventManager_CheckIsMeetConTilePresence_01),
                actualValue : tilesCount,
                targetValue : Twns.Helpers.getExisted(condition.tilesCount, ClientErrorCode.BwWarEventManager_CheckIsMeetConTilePresence_02)
            });
        }
        private _checkIsMeetConUnitPresence(condition: WarEvent.IWecUnitPresence): boolean {
            const playerIndexArray      = condition.playerIndexArray ?? [];
            const teamIndexArray        = condition.teamIndexArray ?? [];
            const locationIdArray       = condition.locationIdArray ?? [];
            const gridIndexArray        = condition.gridIndexArray?.map(v => Twns.Helpers.getExisted(GridIndexHelpers.convertGridIndex(v), ClientErrorCode.BwWarEventManager_CheckIsMeetConUnitPresence_00)) ?? [];
            const unitTypeArray         = condition.unitTypeArray ?? [];
            const actionStateArray      = condition.actionStateArray ?? [];
            const hasLoadedCo           = condition.hasLoadedCo;
            const hp                    = condition.hp;
            const hpComparator          = condition.hpComparator ?? Twns.Types.ValueComparator.EqualTo;
            const fuelPct               = condition.fuelPct;
            const fuelPctComparator     = condition.fuelPctComparator ?? Twns.Types.ValueComparator.EqualTo;
            const priAmmoPct            = condition.priAmmoPct;
            const priAmmoPctComparator  = condition.priAmmoPctComparator ?? Twns.Types.ValueComparator.EqualTo;
            const promotion             = condition.promotion;
            const promotionComparator   = condition.promotionComparator ?? Twns.Types.ValueComparator.EqualTo;
            const war                   = this._getWar();
            const unitMap               = war.getUnitMap();
            const tileMap               = war.getTileMap();
            let unitsCount              = 0;
            for (const unit of unitMap.getAllUnits()) {
                const gridIndex = unit.getGridIndex();
                const tile      = tileMap.getTile(gridIndex);
                if ((unit == null)                                                                                          ||
                    ((unitTypeArray.length) && (unitTypeArray.indexOf(unit.getUnitType()) < 0))                             ||
                    ((playerIndexArray.length) && (playerIndexArray.indexOf(unit.getPlayerIndex()) < 0))                    ||
                    ((teamIndexArray.length) && (teamIndexArray.indexOf(unit.getTeamIndex()) < 0))                          ||
                    ((gridIndexArray.length) && (!gridIndexArray.some(v => GridIndexHelpers.checkIsEqual(v, gridIndex))))   ||
                    ((locationIdArray.length) && (!locationIdArray.some(v => tile.getHasLocationFlag(v))))                  ||
                    ((actionStateArray.length) && (actionStateArray.indexOf(unit.getActionState()) < 0))                    ||
                    ((hasLoadedCo != null) && (unit.getHasLoadedCo() !== hasLoadedCo))
                ) {
                    continue;
                }

                if ((hp != null)                            &&
                    (!Twns.Helpers.checkIsMeetValueComparator({
                        comparator  : hpComparator,
                        targetValue : hp,
                        actualValue : unit.getCurrentHp(),
                    }))
                ) {
                    continue;
                }

                if ((promotion != null)                     &&
                    (!Twns.Helpers.checkIsMeetValueComparator({
                        comparator  : promotionComparator,
                        targetValue : promotion,
                        actualValue : unit.getCurrentPromotion(),
                    }))
                ) {
                    continue;
                }

                if ((fuelPct != null)                       &&
                    (!Twns.Helpers.checkIsMeetValueComparator({
                        comparator  : fuelPctComparator,
                        targetValue : fuelPct * 100,
                        actualValue : unit.getCurrentFuel() * 100 / unit.getMaxFuel(),
                    }))
                ) {
                    continue;
                }

                if (priAmmoPct != null) {
                    const maxAmmo = unit.getPrimaryWeaponMaxAmmo();
                    if ((maxAmmo == null)   ||
                        (!Twns.Helpers.checkIsMeetValueComparator({
                            comparator  : priAmmoPctComparator,
                            targetValue : priAmmoPct * 100,
                            actualValue : Twns.Helpers.getExisted(unit.getPrimaryWeaponCurrentAmmo(), ClientErrorCode.BwWarEventManager_CheckIsMeetConUnitPresence_01) * 100 / maxAmmo
                        }))
                    ) {
                        continue;
                    }
                }

                ++unitsCount;
            }

            return Twns.Helpers.checkIsMeetValueComparator({
                comparator  : Twns.Helpers.getExisted(condition.unitsCountComparator, ClientErrorCode.BwWarEventManager_CheckIsMeetConUnitPresence_02),
                actualValue : unitsCount,
                targetValue : Twns.Helpers.getExisted(condition.unitsCount, ClientErrorCode.BwWarEventManager_CheckIsMeetConUnitPresence_03),
            });
        }

        private _checkIsMeetConCustomCounter(condition: WarEvent.IWecCustomCounter): boolean {
            const counterIdArray        = condition.counterIdArray ?? [];
            const targetValue           = condition.value;
            const valueComparator       = Twns.Helpers.getExisted(condition.valueComparator, ClientErrorCode.BwWarEventManager_CheckIsMeetConCustomCounter_00);
            const valueDivider          = condition.valueDivider;
            const valueRemainder        = condition.valueRemainder;
            const remainderComparator   = Twns.Helpers.getExisted(condition.valueRemainderComparator, ClientErrorCode.BwWarEventManager_CheckIsMeetConCustomCounter_01);
            let counter                 = 0;
            for (let counterId = CommonConstants.WarCustomCounterMinId; counterId <= CommonConstants.WarCustomCounterMaxId; ++counterId) {
                if ((counterIdArray.length) && (counterIdArray.indexOf(counterId) < 0)) {
                    continue;
                }

                const value = this._getCustomCounter(counterId);
                if ((targetValue != null)                   &&
                    (!Twns.Helpers.checkIsMeetValueComparator({
                        comparator  : valueComparator,
                        targetValue,
                        actualValue : value,
                    }))
                ) {
                    continue;
                }

                if ((valueDivider != null)                  &&
                    (valueRemainder != null)                &&
                    (!Twns.Helpers.checkIsMeetValueComparator({
                        comparator  : remainderComparator,
                        targetValue : valueRemainder,
                        actualValue : value % valueDivider,
                    }))
                ) {
                    continue;
                }

                ++counter;
            }

            return Twns.Helpers.checkIsMeetValueComparator({
                comparator  : Twns.Helpers.getExisted(condition.counterCountComparator, ClientErrorCode.BwWarEventManager_CheckIsMeetConCustomCounter_02),
                targetValue : Twns.Helpers.getExisted(condition.counterCount, ClientErrorCode.BwWarEventManager_CheckIsMeetConCustomCounter_03),
                actualValue : counter,
            });
        }

        public getWarEvent(warEventId: number): WarEvent.IWarEvent {                    // DONE
            return Twns.Helpers.getExisted(this.getWarEventFullData()?.eventArray?.find(v => v.eventId === warEventId));
        }
        private _getConditionNode(nodeId: number): WarEvent.IWarEventConditionNode {    // DONE
            return Twns.Helpers.getExisted(this.getWarEventFullData()?.conditionNodeArray?.find(v => v.nodeId === nodeId));
        }
        private _getCondition(conditionId: number): WarEvent.IWarEventCondition {       // DONE
            return Twns.Helpers.getExisted(this.getWarEventFullData()?.conditionArray?.find(v => v.WecCommonData?.conditionId === conditionId));
        }
        public getWarEventAction(actionId: number): WarEvent.IWarEventAction {          // DONE
            return Twns.Helpers.getExisted(this.getWarEventFullData()?.actionArray?.find(v => v.WeaCommonData?.actionId === actionId));
        }
    }

    function getGridIndexForAddUnit({ origin, unitMap, tileMap, moveType, needMovableTile, canBeBlockedByUnit }: {
        origin              : Twns.Types.GridIndex;
        unitMap             : BwUnitMap;
        tileMap             : BwTileMap;
        moveType            : Twns.Types.MoveType;
        needMovableTile     : boolean;
        canBeBlockedByUnit  : boolean;
    }): Twns.Types.GridIndex | null {
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
                {
                    origin, minDistance: distance, maxDistance: distance, mapSize, predicate: (g): boolean => {
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
                }            )[0];
            if (gridIndex) {
                return gridIndex;
            }
        }

        return null;
    }

}

// export default TwnsBwWarEventManager;
