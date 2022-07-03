
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
    import WarEventHelpers                  = WarHelpers.WarEventHelpers;

    export class BwWarEventManager {
        private _war?                           : BwWar;
        private _calledCountList?               : IDataForWarEventCalledCount[] | null;
        private _customCounterArray?            : ICustomCounter[] | null;
        private _ongoingPersistentActionIdSet?  : Set<number>;

        public init(data: Types.Undefinable<ISerialWarEventManager>, warEventFullData: Types.Undefinable<CommonProto.Map.IWarEventFullData>): void {
            if (!data) {
                this._setCalledCountList(null);
                this._setCustomCounterArray(null);
                this._setOngoingPersistentActionIdSet(new Set());
            } else {
                // TODO: validate the data.
                const customCounterArray = data.customCounterArray ?? null;
                if ((customCounterArray) && (!Config.ConfigManager.checkIsValidCustomCounterArray(customCounterArray))) {
                    throw Helpers.newError(`BwWarEventManager.init() invalid customCounterArray.`, ClientErrorCode.BwWarEventManager_Init_00);
                }

                const ongoingPersistentActionIdArray    = data.ongoingPersistentActionIdArray ?? [];
                const ongoingPersistentActionIdSet      = new Set(ongoingPersistentActionIdArray);
                if (ongoingPersistentActionIdArray.length !== ongoingPersistentActionIdSet.size) {
                    throw Helpers.newError(`BwWarEventMAnager.init() invalid ongoingPersistentActionIdArray.`, ClientErrorCode.BwWarEventManager_Init_01);
                }
                for (const actionId of ongoingPersistentActionIdSet) {
                    const action = warEventFullData?.actionArray?.find(v => v.WeaCommonData?.actionId === actionId);
                    if ((action == null) || (!WarEventHelpers.checkIsPersistentAction(action))) {
                        throw Helpers.newError(`BwWarEventMAnager.init() invalid ongoingPersistentActionIdArray.`, ClientErrorCode.BwWarEventManager_Init_02);
                    }
                }

                this._setCalledCountList(Helpers.deepClone(data.calledCountList) ?? null);
                this._setCustomCounterArray(Helpers.deepClone(customCounterArray));
                this._setOngoingPersistentActionIdSet(ongoingPersistentActionIdSet);
            }
        }
        public fastInit(data: ISerialWarEventManager): void {
            this._setCalledCountList(Helpers.deepClone(data.calledCountList) ?? null);
            this._setCustomCounterArray(Helpers.deepClone(data.customCounterArray ?? null));
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
                calledCountList                 : Helpers.deepClone(this._getCalledCountList()),
                customCounterArray              : Helpers.deepClone(this._getCustomCounterArray()),
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
            return Helpers.getExisted(this._war);
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
            return Helpers.getDefined(this._calledCountList, ClientErrorCode.BwWarEventManager_GetCalledCountList_00);
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

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Functions for custom counters.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        protected _setCustomCounterArray(counterArray: ICustomCounter[] | null): void {
            this._customCounterArray = counterArray;
        }
        private _getCustomCounterArray(): ICustomCounter[] | null {
            return Helpers.getDefined(this._customCounterArray, ClientErrorCode.BwWarEventManager_GetCustomCounterArray_00);
        }

        private _setCustomCounter(counterId: number, counterValue: number): void {
            if (!Config.ConfigManager.checkIsValidCustomCounterId(counterId)) {
                throw Helpers.newError(`BwWarEventManager._setCustomCounter() invalid counterId: ${counterId}`, ClientErrorCode.BwWarEventManager_SetCustomCounter_00);
            }

            if (!Config.ConfigManager.checkIsValidCustomCounterValue(counterValue)) {
                throw Helpers.newError(`BwWarEventManager._setCustomCounter() invalid counterValue: ${counterValue}`, ClientErrorCode.BwWarEventManager_SetCustomCounter_01);
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
                throw Helpers.newError(`BwWarEventManager._getCustomCounter() invalid counterId: ${counterId}`, ClientErrorCode.BwWarEventManager_GetCustomCounter_00);
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
            return Helpers.getExisted(this._ongoingPersistentActionIdSet, ClientErrorCode.BwWarEventManager_GetOngoingPersistentActionIdSet_00);
        }

        public checkOngoingPersistentActionCanActivateCoSkill(playerIndex: number): boolean {
            for (const actionId of this.getOngoingPersistentActionIdSet()) {
                const action = this.getWarEventAction(actionId).WeaPersistentModifyPlayerAttribute;
                if (action == null) {
                    continue;
                }
                if (action.actCanActivateCoSkill !== false) {
                    continue;
                }

                const conPlayerIndexArray = action.conPlayerIndexArray;
                if ((!conPlayerIndexArray?.length) || ((conPlayerIndexArray ?? []).indexOf(playerIndex) >= 0)) {
                    return false;
                }
            }

            return true;
        }
        public checkOngoingPersistentActionBannedUnitType(playerIndex: number, unitType: number): boolean {
            for (const actionId of this.getOngoingPersistentActionIdSet()) {
                const action = this.getWarEventAction(actionId).WeaPersistentModifyPlayerAttribute;
                if (action == null) {
                    continue;
                }
                if ((action.actBannedUnitTypeArray ?? []).indexOf(unitType) < 0) {
                    continue;
                }

                const conPlayerIndexArray = action.conPlayerIndexArray;
                if ((!conPlayerIndexArray?.length) || ((conPlayerIndexArray ?? []).indexOf(playerIndex) >= 0)) {
                    return true;
                }
            }

            return false;
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Functions for calling events.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
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
            WarHelpers.WarCommonHelpers.handleCommonExtraDataForWarActions({
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
            if      (action.WeaAddUnit)                         { await this._callActionAddUnitWithExtraData(action.WeaAddUnit, isFastExecute); }
            else if (action.WeaDialogue)                        { await this._callActionDialogueWithExtraData(action.WeaDialogue, isFastExecute); }
            else if (action.WeaSetViewpoint)                    { await this._callActionSetViewpointWithExtraData(action.WeaSetViewpoint, isFastExecute); }
            else if (action.WeaSetWeather)                      { await this._callActionSetWeatherWithExtraData(action.WeaSetWeather, isFastExecute); }
            else if (action.WeaSimpleDialogue)                  { await this._callActionSimpleDialogueWithExtraData(action.WeaSimpleDialogue, isFastExecute); }
            else if (action.WeaPlayBgm)                         { await this._callActionPlayBgmWithExtraData(action.WeaPlayBgm, isFastExecute); }
            else if (action.WeaSetForceFogCode)                 { await this._callActionSetForceFogCodeWithExtraData(action.WeaSetForceFogCode, isFastExecute); }
            else if (action.WeaSetCustomCounter)                { await this._callActionSetCustomCounterWithExtraData(action.WeaSetCustomCounter, isFastExecute); }
            else if (action.WeaStopPersistentAction)            { await this._callActionStopPersistentActionWithExtraData(action.WeaStopPersistentAction, isFastExecute); }
            else if (action.WeaSetPlayerState)                  { await this._callActionSetPlayerStateWithExtraData(action.WeaSetPlayerState, isFastExecute); }
            else if (action.WeaSetUnitState)                    { await this._callActionSetUnitStateWithExtraData(action.WeaSetUnitState, isFastExecute); }
            else if (action.WeaSetTileType)                     { await this._callActionSetTileTypeWithExtraData(action.WeaSetTileType, isFastExecute); }
            else if (action.WeaSetTileState)                    { await this._callActionSetTileStateWithExtraData(action.WeaSetTileState, isFastExecute); }
            else if (action.WeaPersistentShowText)              { await this._callActionPersistentShowTextWithExtraData(action.WeaPersistentShowText, isFastExecute, warEventActionId); }
            else if (action.WeaPersistentModifyPlayerAttribute) { await this._callActionPersistentModifyPlayerAttributeWithExtraData(action.WeaPersistentModifyPlayerAttribute, isFastExecute, warEventActionId); }
            else {
                throw Helpers.newError(`Invalid action.`);
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
            else if (action.WeaStopPersistentAction)            { await this._callActionStopPersistentActionWithoutExtraData(action.WeaStopPersistentAction, isFastExecute); }
            else if (action.WeaSetPlayerState)                  { await this._callActionSetPlayerStateWithoutExtraData(action.WeaSetPlayerState, isFastExecute); }
            else if (action.WeaSetUnitState)                    { await this._callActionSetUnitStateWithoutExtraData(action.WeaSetUnitState, isFastExecute); }
            else if (action.WeaSetTileType)                     { await this._callActionSetTileTypeWithoutExtraData(action.WeaSetTileType, isFastExecute); }
            else if (action.WeaSetTileState)                    { await this._callActionSetTileStateWithoutExtraData(action.WeaSetTileState, isFastExecute); }
            else if (action.WeaPersistentShowText)              { await this._callActionPersistentShowTextWithoutExtraData(action.WeaPersistentShowText, isFastExecute, warEventActionId); }
            else if (action.WeaPersistentModifyPlayerAttribute) { await this._callActionPersistentModifyPlayerAttributeWithoutExtraData(action.WeaPersistentModifyPlayerAttribute, isFastExecute, warEventActionId); }
            else {
                throw Helpers.newError(`Invalid action.`);
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
                throw Helpers.newError(`Empty unitArray.`);
            }

            const war           = this._getWar();
            const unitMap       = war.getUnitMap();
            const tileMap       = war.getTileMap();
            const playerManager = war.getPlayerManager();
            const gameConfig    = war.getGameConfig();
            const mapSize       = unitMap.getMapSize();
            for (const data of unitArray) {
                const unitData = Helpers.getExisted(data.unitData);
                if (unitData.loaderUnitId != null) {
                    throw Helpers.newError(`unitData.loaderUnitId != null: ${unitData.loaderUnitId}`);
                }

                const canBeBlockedByUnit    = Helpers.getExisted(data.canBeBlockedByUnit);
                const needMovableTile       = Helpers.getExisted(data.needMovableTile);
                const unitId                = unitMap.getNextUnitId();
                const unitType              = Helpers.getExisted(unitData.unitType);
                const moveType              = Helpers.getExisted(gameConfig.getUnitTemplateCfg(unitType)?.moveType);
                const rawGridIndex          = Helpers.getExisted(GridIndexHelpers.convertGridIndex(unitData.gridIndex));
                if (WarHelpers.WarCommonHelpers.getErrorCodeForUnitDataIgnoringUnitId({
                    unitData,
                    mapSize,
                    gameConfig,
                    playersCountUnneutral   : CommonConstants.PlayerIndex.Max,
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
                PanelHelpers.open(PanelHelpers.PanelDict.BwDialoguePanel, {
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
                PanelHelpers.open(PanelHelpers.PanelDict.BwDialoguePanel, {
                    gameConfig   : this._getWar().getGameConfig(),
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

            const turnsCount = Helpers.getExisted(action.weatherTurnsCount, ClientErrorCode.BwWarEventManager_CallActionSetWeatherWithExtraData_01);
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

            const weatherTurnsCount = Helpers.getExisted(action.weatherTurnsCount, ClientErrorCode.BwWarEventManager_CallActionSetWeatherWithoutExtraData_01);
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
                PanelHelpers.open(PanelHelpers.PanelDict.BwSimpleDialoguePanel, {
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
                PanelHelpers.open(PanelHelpers.PanelDict.BwSimpleDialoguePanel, {
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
                SoundManager.playCoBgmWithWar(this._getWar(), false);
            } else {
                SoundManager.playBgm(Helpers.getExisted(action.bgmCode));
            }
        }
        private async _callActionPlayBgmWithoutExtraData(action: WarEvent.IWeaPlayBgm, isFast: boolean): Promise<void> {
            if (isFast) {
                return;
            }

            if (action.useCoBgm) {
                SoundManager.playCoBgmWithWar(this._getWar(), false);
            } else {
                SoundManager.playBgm(Helpers.getExisted(action.bgmCode));
            }
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        private async _callActionSetForceFogCodeWithExtraData(action: WarEvent.IWeaSetForceFogCode, isFast: boolean): Promise<void> {
            const war       = this._getWar();
            const fogMap    = war.getFogMap();
            fogMap.setForceFogCode(Helpers.getExisted(action.forceFogCode, ClientErrorCode.BwWarEventManager_CallActionSetHasFogWithExtraData_00));

            const turnsCount = Helpers.getExisted(action.turnsCount, ClientErrorCode.BwWarEventManager_CallActionSetHasFogWithExtraData_01);
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
            fogMap.setForceFogCode(Helpers.getExisted(action.forceFogCode, ClientErrorCode.BwWarEventManager_CallActionSetHasFogWithoutExtraData_00));

            const turnsCount = Helpers.getExisted(action.turnsCount, ClientErrorCode.BwWarEventManager_CallActionSetHasFogWithoutExtraData_01);
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
        private async _callActionSetPlayerStateWithExtraData(action: WarEvent.IWeaSetPlayerState, isFastExecute: boolean): Promise<void> {
            // nothing to do
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        private async _callActionSetPlayerStateWithoutExtraData(action: WarEvent.IWeaSetPlayerState, isFastExecute: boolean): Promise<void> {
            const conPlayerIndexArray           = action.conPlayerIndexArray;
            const conAliveStateArray            = action.conAliveStateArray;
            const conCoUsingSkillTypeArray      = action.conCoUsingSkillTypeArray;
            const conFund                       = action.conFund;
            const conFundComparator             = action.conFundComparator ?? Types.ValueComparator.EqualTo;
            const conEnergyPercentage           = action.conEnergyPercentage;
            const conEnergyPercentageComparator = action.conEnergyPercentageComparator ?? Types.ValueComparator.EqualTo;
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
                    (!Helpers.checkIsMeetValueComparator({
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
                        (!Helpers.checkIsMeetValueComparator({
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

                player.setCoCurrentEnergy(Helpers.getValueInRange({
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
        private async _callActionSetUnitStateWithExtraData(action: WarEvent.IWeaSetUnitState, isFastExecute: boolean): Promise<void> {
            // nothing to do
        }
        private async _callActionSetUnitStateWithoutExtraData(action: WarEvent.IWeaSetUnitState, isFastExecute: boolean): Promise<void> {
            const playerIndexArray              = action.conPlayerIndexArray ?? [];
            const teamIndexArray                = action.conTeamIndexArray ?? [];
            const locationIdArray               = action.conLocationIdArray ?? [];
            const gridIndexArray                = action.conGridIndexArray?.map(v => Helpers.getExisted(GridIndexHelpers.convertGridIndex(v), ClientErrorCode.BwWarEventManager_CallActionSetUnitHpWithoutExtraData_00)) ?? [];
            const unitTypeArray                 = action.conUnitTypeArray ?? [];
            const actionStateArray              = action.conActionStateArray ?? [];
            const hasLoadedCo                   = action.conHasLoadedCo;
            const conHp                         = action.conHp;
            const conHpComparator               = action.conHpComparator ?? Types.ValueComparator.EqualTo;
            const conFuelPct                    = action.conFuelPct;
            const conFuelPctComparator          = action.conFuelPctComparator ?? Types.ValueComparator.EqualTo;
            const conPriAmmoPct                 = action.conPriAmmoPct;
            const conPriAmmoPctComparator       = action.conPriAmmoPctComparator ?? Types.ValueComparator.EqualTo;
            const conPromotion                  = action.conPromotion;
            const conPromotionComparator        = action.conPromotionComparator ?? Types.ValueComparator.EqualTo;
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
                    const gridIndex : Types.GridIndex = { x, y };
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
                        (!Helpers.checkIsMeetValueComparator({
                            comparator  : conHpComparator,
                            targetValue : conHp,
                            actualValue : unit.getCurrentHp(),
                        }))
                    ) {
                        continue;
                    }

                    if ((conPromotion != null)                  &&
                        (!Helpers.checkIsMeetValueComparator({
                            comparator  : conPromotionComparator,
                            targetValue : conPromotion,
                            actualValue : unit.getCurrentPromotion(),
                        }))
                    ) {
                        continue;
                    }

                    if ((conFuelPct != null)                    &&
                        (!Helpers.checkIsMeetValueComparator({
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
                            (!Helpers.checkIsMeetValueComparator({
                                comparator  : conPriAmmoPctComparator,
                                targetValue : conPriAmmoPct * 100,
                                actualValue : Helpers.getExisted(unit.getPrimaryWeaponCurrentAmmo(), ClientErrorCode.BwWarEventManager_CallActionSetUnitHpWithoutExtraData_01) * 100 / maxAmmo,
                            }))
                        ) {
                            continue;
                        }
                    }

                    if (destroyUnit) {
                        WarHelpers.WarDestructionHelpers.destroyUnitOnMap(war, gridIndex, !isFastExecute);

                    } else {
                        unit.setCurrentHp(Helpers.getValueInRange({
                            maxValue    : unit.getMaxHp(),
                            minValue    : minHp,
                            rawValue    : Math.floor(unit.getCurrentHp() * hpMultiplierPercentage / 100 + hpDeltaValue),
                        }));

                        unit.setCurrentFuel(Helpers.getValueInRange({
                            maxValue    : unit.getMaxFuel(),
                            minValue    : minFuel,
                            rawValue    : Math.floor(unit.getCurrentFuel() * fuelMultiplierPercentage / 100 + fuelDeltaValue),
                        }));

                        unit.setCurrentPromotion(Helpers.getValueInRange({
                            maxValue    : unit.getMaxPromotion(),
                            minValue    : minPromotion,
                            rawValue    : Math.floor(unit.getCurrentPromotion() * promotionMultiplierPercentage / 100 + promotionDeltaValue),
                        }));

                        {
                            const currentAmmo = unit.getPrimaryWeaponCurrentAmmo();
                            if (currentAmmo != null) {
                                unit.setPrimaryWeaponCurrentAmmo(Helpers.getValueInRange({
                                    maxValue    : Helpers.getExisted(unit.getPrimaryWeaponMaxAmmo(), ClientErrorCode.BwWarEventManager_CallActionSetUnitHpWithoutExtraData_02),
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
            const actTileData               = Helpers.getExisted(action.actTileData, ClientErrorCode.BwWarEventManager_CallActionSetTileTypeWithoutExtraData_00);
            const rawActBaseType            = Helpers.getExisted(actTileData.baseType, ClientErrorCode.BwWarEventManager_CallActionSetTileTypeWithoutExtraData_01);
            const rawActObjectType          = Helpers.getExisted(actTileData.objectType, ClientErrorCode.BwWarEventManager_CallActionSetTileTypeWithoutExtraData_02);
            const actDestroyUnit            = action.actDestroyUnit;
            const actIsModifyTileBase       = (action.actIsModifyTileBase) || (action.actIsModifyTileBase == null);
            const actIsModifyTileDecorator  = (action.actIsModifyTileDecorator) || (action.actIsModifyTileDecorator == null);
            const actIsModifyTileObject     = (action.actIsModifyTileObject) || (action.actIsModifyTileObject == null);
            const conIsHighlighted          = action.conIsHighlighted;
            const conLocationIdArray        = action.conLocationIdArray ?? [];
            const conGridIndexArray         = action.conGridIndexArray?.map(v => Helpers.getExisted(GridIndexHelpers.convertGridIndex(v), ClientErrorCode.BwWarEventManager_CallActionSetTileTypeWithoutExtraData_03)) ?? [];
            const unitMap                   = war.getUnitMap();
            const tileMap                   = war.getTileMap();
            const mapSize                   = tileMap.getMapSize();
            const mapWidth                  = mapSize.width;
            const mapHeight                 = mapSize.height;
            for (let x = 0; x < mapWidth; ++x) {
                for (let y = 0; y < mapHeight; ++y) {
                    const gridIndex : Types.GridIndex = { x, y };
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
                            WarHelpers.WarDestructionHelpers.destroyUnitOnMap(war, gridIndex, !isFastExecute);
                        } else if (gameConfig.getTileTemplateCfg(Helpers.getExisted(gameConfig.getTileType(actBaseType, actObjectType)))?.maxHp != null) {
                            continue;
                        }
                    }

                    const tileData: CommonProto.WarSerialization.ISerialTile = {
                        gridIndex,
                        playerIndex         : actIsModifyTileObject ? actTileData.playerIndex : tile.getPlayerIndex(),
                        baseType            : actBaseType,
                        baseShapeId         : actIsModifyTileBase ? actTileData.baseShapeId : tile.getBaseShapeId(),
                        decoratorType       : actIsModifyTileDecorator ? actTileData.decoratorType : tile.getDecorationType(),
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
            const conGridIndexArray                     = action.conGridIndexArray?.map(v => Helpers.getExisted(GridIndexHelpers.convertGridIndex(v), ClientErrorCode.BwWarEventManager_CallActionSetTileStateWithoutExtraData_00)) ?? [];
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
                    const gridIndex : Types.GridIndex = { x, y };
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
                            tile.setCurrentHp(Helpers.getValueInRange({
                                minValue    : 0,
                                maxValue    : Helpers.getExisted(tile.getMaxHp(), ClientErrorCode.BwWarEventManager_CallActionSetTileStateWithoutExtraData_01),
                                rawValue    : Math.floor(currentHp * (actHpMultiplierPercentage ?? 100) / 100 + (actHpDeltaValue ?? 0)),
                            }));
                        }
                    }

                    {
                        const currentBuildPoint = tile.getCurrentBuildPoint();
                        if ((currentBuildPoint != null)                                                         &&
                            ((actBuildPointDeltaValue != null) || (actBuildPointMultiplierPercentage != null))
                        ) {
                            tile.setCurrentBuildPoint(Helpers.getValueInRange({
                                minValue    : 0,
                                maxValue    : Helpers.getExisted(tile.getMaxBuildPoint(), ClientErrorCode.BwWarEventManager_CallActionSetTileStateWithoutExtraData_02),
                                rawValue    : Math.floor(currentBuildPoint * (actBuildPointMultiplierPercentage ?? 100) / 100 + (actBuildPointDeltaValue ?? 0)),
                            }));
                        }
                    }

                    {
                        const currentCapturePoint = tile.getCurrentCapturePoint();
                        if ((currentCapturePoint != null)                                                           &&
                            ((actCapturePointDeltaValue != null) || (actCapturePointMultiplierPercentage != null))
                        ) {
                            tile.setCurrentCapturePoint(Helpers.getValueInRange({
                                minValue    : 0,
                                maxValue    : Helpers.getExisted(tile.getMaxCapturePoint(), ClientErrorCode.BwWarEventManager_CallActionSetTileStateWithoutExtraData_03),
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

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        private async _callActionPersistentModifyPlayerAttributeWithExtraData(action: WarEvent.IWeaPersistentModifyPlayerAttribute, isFastExecute: boolean, actionId: number): Promise<void> {
            this.getOngoingPersistentActionIdSet().add(actionId);
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        private async _callActionPersistentModifyPlayerAttributeWithoutExtraData(action: WarEvent.IWeaPersistentModifyPlayerAttribute, isFastExecute: boolean, actionId: number): Promise<void> {
            this.getOngoingPersistentActionIdSet().add(actionId);
        }

        public getCallableWarEventId(): number | null {                                // DONE
            const war = this._getWar();
            if (war.getTurnManager().getTurnIndex() > war.getCommonSettingManager().getTurnsLimit()) {
                return null;
            }

            for (const warEvent of this._getWar().getCommonSettingManager().getInstanceWarRule().warEventFullData?.eventArray || []) {
                const warEventId = Helpers.getExisted(warEvent.eventId);
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

            let isMeetAnyConditionOrNode = false;
            if (conditionIdArray) {
                for (const conditionId of conditionIdArray) {
                    const isConditionMet = this._checkIsMeetCondition(conditionId);
                    if ((isAnd) && (!isConditionMet)) {
                        return false;
                    }
                    if ((!isAnd) && (isConditionMet)) {
                        return true;
                    }
                    isMeetAnyConditionOrNode ||= isConditionMet;
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
                    isMeetAnyConditionOrNode ||= isSubNodeMet;
                }
            }

            return isMeetAnyConditionOrNode;
        }
        private _checkIsMeetCondition(conditionId: number): boolean {
            const condition = this._getCondition(conditionId);

            if (condition.WecEventCalledCount)                      { return this._checkIsMeetConEventCalledCount(condition.WecEventCalledCount); }
            else if (condition.WecPlayerPresence)                   { return this._checkIsMeetConPlayerPresence(condition.WecPlayerPresence); }
            else if (condition.WecTurnAndPlayer)                    { return this._checkIsMeetConTurnAndPlayer(condition.WecTurnAndPlayer); }
            else if (condition.WecWeatherAndFog)                    { return this._checkIsMeetConWeatherAndFog(condition.WecWeatherAndFog); }
            else if (condition.WecTilePresence)                     { return this._checkIsMeetConTilePresence(condition.WecTilePresence); }
            else if (condition.WecUnitPresence)                     { return this._checkIsMeetConUnitPresence(condition.WecUnitPresence); }
            else if (condition.WecCustomCounter)                    { return this._checkIsMeetConCustomCounter(condition.WecCustomCounter); }
            else if (condition.WecOngoingPersistentActionPresence)  { return this._checkIsMeetConOngoingPersistentActionPresence(condition.WecOngoingPersistentActionPresence); }

            throw Helpers.newError(`Invalid condition!`);
        }

        private _checkIsMeetConEventCalledCount(condition: WarEvent.IWecEventCalledCount): boolean {
            const eventIdArray          = condition.eventIdArray ?? [];
            const timesInTurn           = condition.timesInTurn;
            const timesTotal            = condition.timesTotal;
            const timesInTurnComparator = Helpers.getExisted(condition.timesInTurnComparator, ClientErrorCode.BwWarEventManager_CheckIsMeetConEventCalledCount_00);
            const timesTotalComparator  = Helpers.getExisted(condition.timesTotalComparator, ClientErrorCode.BwWarEventManager_CheckIsMeetConEventCalledCount_01);

            let eventsCount = 0;
            for (const warEvent of this._getWar().getCommonSettingManager().getInstanceWarRule().warEventFullData?.eventArray ?? []) {
                const eventId = Helpers.getExisted(warEvent.eventId, ClientErrorCode.BwWarEventManager_CheckIsMeetConEventCalledCount_02);
                if ((eventIdArray.length) && (eventIdArray.indexOf(eventId) < 0)) {
                    continue;
                }

                if ((timesInTurn != null)                   &&
                    (!Helpers.checkIsMeetValueComparator({
                        comparator  : timesInTurnComparator,
                        targetValue : timesInTurn,
                        actualValue : this.getWarEventCalledCountInPlayerTurn(eventId),
                    }))
                ) {
                    continue;
                }

                if ((timesTotal != null)                    &&
                    (!Helpers.checkIsMeetValueComparator({
                        comparator  : timesTotalComparator,
                        targetValue : timesTotal,
                        actualValue : this.getWarEventCalledCountTotal(eventId),
                    }))
                ) {
                    continue;
                }

                ++eventsCount;
            }

            return Helpers.checkIsMeetValueComparator({
                comparator  : Helpers.getExisted(condition.eventsCountComparator, ClientErrorCode.BwWarEventManager_CheckIsMeetConEventCalledCount_03),
                targetValue : Helpers.getExisted(condition.eventsCount, ClientErrorCode.BwWarEventManager_CheckIsMeetConEventCalledCount_04),
                actualValue : eventsCount,
            });
        }

        private _checkIsMeetConPlayerPresence(condition: WarEvent.IWecPlayerPresence): boolean {
            const playerIndexArray              = condition.playerIndexArray ?? [];
            const aliveStateArray               = condition.aliveStateArray ?? [];
            const coUsingSkillTypeArray         = condition.coUsingSkillTypeArray ?? [];
            const coCategoryIdArray             = condition.coCategoryIdArray ?? [];
            const targetFund                    = condition.fund;
            const fundComparator                = Helpers.getExisted(condition.fundComparator, ClientErrorCode.BwWarEventManager_CheckIsMeetConPlayerState_00);
            const targetEnergyPercentage        = condition.energyPercentage;
            const energyPercentageComparator    = Helpers.getExisted(condition.energyPercentageComparator, ClientErrorCode.BwWarEventManager_CheckIsMeetConPlayerState_01);
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

                if ((targetFund != null) && (!Helpers.checkIsMeetValueComparator({
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
                    if ((maxEnergy <= 0) || (!Helpers.checkIsMeetValueComparator({
                        comparator  : energyPercentageComparator,
                        targetValue : targetEnergyPercentage,
                        actualValue : player.getCoCurrentEnergy() * 100 / maxEnergy,
                    }))) {
                        continue;
                    }
                }

                ++playersCount;
            }

            return Helpers.checkIsMeetValueComparator({
                comparator  : Helpers.getExisted(condition.playersCountComparator, ClientErrorCode.BwWarEventManager_CheckIsMeetConPlayerState_02),
                actualValue : playersCount,
                targetValue : Helpers.getExisted(condition.playersCount, ClientErrorCode.BwWarEventManager_CheckIsMeetConPlayerState_03),
            });
        }

        private _checkIsMeetConTurnAndPlayer(condition: WarEvent.IWecTurnAndPlayer): boolean {
            const turnManager   = this._getWar().getTurnManager();
            const turnIndex     = turnManager.getTurnIndex();
            {
                const targetTurnIndex       = condition.turnIndex;
                const turnIndexComparator   = condition.turnIndexComparator;
                if ((targetTurnIndex != null) && (turnIndexComparator != null)) {
                    if (!Helpers.checkIsMeetValueComparator({
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
                    if (!Helpers.checkIsMeetValueComparator({
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

        private _checkIsMeetConTilePresence(condition: WarEvent.IWecTilePresence): boolean {
            const playerIndexArray      = condition.playerIndexArray ?? [];
            const teamIndexArray        = condition.teamIndexArray ?? [];
            const locationIdArray       = condition.locationIdArray ?? [];
            const gridIndexArray        = condition.gridIndexArray?.map(v => Helpers.getExisted(GridIndexHelpers.convertGridIndex(v), ClientErrorCode.BwWarEventManager_CheckIsMeetConTilePresence_00)) ?? [];
            const tileTypeArray         = condition.tileTypeArray ?? [];
            const war                   = this._getWar();
            const tileMap               = war.getTileMap();
            const mapSize               = tileMap.getMapSize();
            const mapWidth              = mapSize.width;
            const mapHeight             = mapSize.height;
            let tilesCount              = 0;
            for (let x = 0; x < mapWidth; ++x) {
                for (let y = 0; y < mapHeight; ++y) {
                    const gridIndex : Types.GridIndex = { x, y };
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

            return Helpers.checkIsMeetValueComparator({
                comparator  : Helpers.getExisted(condition.tilesCountComparator, ClientErrorCode.BwWarEventManager_CheckIsMeetConTilePresence_01),
                actualValue : tilesCount,
                targetValue : Helpers.getExisted(condition.tilesCount, ClientErrorCode.BwWarEventManager_CheckIsMeetConTilePresence_02)
            });
        }
        private _checkIsMeetConUnitPresence(condition: WarEvent.IWecUnitPresence): boolean {
            const playerIndexArray      = condition.playerIndexArray ?? [];
            const teamIndexArray        = condition.teamIndexArray ?? [];
            const locationIdArray       = condition.locationIdArray ?? [];
            const gridIndexArray        = condition.gridIndexArray?.map(v => Helpers.getExisted(GridIndexHelpers.convertGridIndex(v), ClientErrorCode.BwWarEventManager_CheckIsMeetConUnitPresence_00)) ?? [];
            const unitTypeArray         = condition.unitTypeArray ?? [];
            const actionStateArray      = condition.actionStateArray ?? [];
            const hasLoadedCo           = condition.hasLoadedCo;
            const hp                    = condition.hp;
            const hpComparator          = condition.hpComparator ?? Types.ValueComparator.EqualTo;
            const fuelPct               = condition.fuelPct;
            const fuelPctComparator     = condition.fuelPctComparator ?? Types.ValueComparator.EqualTo;
            const priAmmoPct            = condition.priAmmoPct;
            const priAmmoPctComparator  = condition.priAmmoPctComparator ?? Types.ValueComparator.EqualTo;
            const promotion             = condition.promotion;
            const promotionComparator   = condition.promotionComparator ?? Types.ValueComparator.EqualTo;
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
                    (!Helpers.checkIsMeetValueComparator({
                        comparator  : hpComparator,
                        targetValue : hp,
                        actualValue : unit.getCurrentHp(),
                    }))
                ) {
                    continue;
                }

                if ((promotion != null)                     &&
                    (!Helpers.checkIsMeetValueComparator({
                        comparator  : promotionComparator,
                        targetValue : promotion,
                        actualValue : unit.getCurrentPromotion(),
                    }))
                ) {
                    continue;
                }

                if ((fuelPct != null)                       &&
                    (!Helpers.checkIsMeetValueComparator({
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
                        (!Helpers.checkIsMeetValueComparator({
                            comparator  : priAmmoPctComparator,
                            targetValue : priAmmoPct * 100,
                            actualValue : Helpers.getExisted(unit.getPrimaryWeaponCurrentAmmo(), ClientErrorCode.BwWarEventManager_CheckIsMeetConUnitPresence_01) * 100 / maxAmmo
                        }))
                    ) {
                        continue;
                    }
                }

                ++unitsCount;
            }

            return Helpers.checkIsMeetValueComparator({
                comparator  : Helpers.getExisted(condition.unitsCountComparator, ClientErrorCode.BwWarEventManager_CheckIsMeetConUnitPresence_02),
                actualValue : unitsCount,
                targetValue : Helpers.getExisted(condition.unitsCount, ClientErrorCode.BwWarEventManager_CheckIsMeetConUnitPresence_03),
            });
        }

        private _checkIsMeetConCustomCounter(condition: WarEvent.IWecCustomCounter): boolean {
            const counterIdArray        = condition.counterIdArray ?? [];
            const targetValue           = condition.value;
            const valueComparator       = Helpers.getExisted(condition.valueComparator, ClientErrorCode.BwWarEventManager_CheckIsMeetConCustomCounter_00);
            const valueDivider          = condition.valueDivider;
            const valueRemainder        = condition.valueRemainder;
            const remainderComparator   = Helpers.getExisted(condition.valueRemainderComparator, ClientErrorCode.BwWarEventManager_CheckIsMeetConCustomCounter_01);
            let counter                 = 0;
            for (let counterId = CommonConstants.WarCustomCounterMinId; counterId <= CommonConstants.WarCustomCounterMaxId; ++counterId) {
                if ((counterIdArray.length) && (counterIdArray.indexOf(counterId) < 0)) {
                    continue;
                }

                const value = this._getCustomCounter(counterId);
                if ((targetValue != null)                   &&
                    (!Helpers.checkIsMeetValueComparator({
                        comparator  : valueComparator,
                        targetValue,
                        actualValue : value,
                    }))
                ) {
                    continue;
                }

                if ((valueDivider != null)                  &&
                    (valueRemainder != null)                &&
                    (!Helpers.checkIsMeetValueComparator({
                        comparator  : remainderComparator,
                        targetValue : valueRemainder,
                        actualValue : value % valueDivider,
                    }))
                ) {
                    continue;
                }

                ++counter;
            }

            return Helpers.checkIsMeetValueComparator({
                comparator  : Helpers.getExisted(condition.counterCountComparator, ClientErrorCode.BwWarEventManager_CheckIsMeetConCustomCounter_02),
                targetValue : Helpers.getExisted(condition.counterCount, ClientErrorCode.BwWarEventManager_CheckIsMeetConCustomCounter_03),
                actualValue : counter,
            });
        }

        private _checkIsMeetConOngoingPersistentActionPresence(condition: WarEvent.IWecOngoingPersistentActionPresence): boolean {
            const conActionIdArray      = condition.ongoingActionIdArray;
            const ongoingActionIdSet    = this.getOngoingPersistentActionIdSet();
            let counter                 = 0;
            if (!conActionIdArray?.length) {
                counter = ongoingActionIdSet.size;
            } else {
                for (const actionId of conActionIdArray) {
                    if (ongoingActionIdSet.has(actionId)) {
                        ++counter;
                    }
                }
            }

            return Helpers.checkIsMeetValueComparator({
                comparator  : Helpers.getExisted(condition.ongoingActionsCountComparator, ClientErrorCode.BwWarEventManager_CheckIsMeetConOngoingPersistentActionPresence_00),
                targetValue : Helpers.getExisted(condition.ongoingActionsCount, ClientErrorCode.BwWarEventManager_CheckIsMeetConOngoingPersistentActionPresence_01),
                actualValue : counter,
            });
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
        tileMap             : BwTileMap;
        moveType            : number;
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
