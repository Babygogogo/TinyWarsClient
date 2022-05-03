
// import TwnsBwProduceUnitPanel   from "../../baseWar/view/BwProduceUnitPanel";
// import TwnsClientErrorCode      from "../../tools/helpers/ClientErrorCode";
// import GridIndexHelpers         from "../../tools/helpers/GridIndexHelpers";
// import Helpers                  from "../../tools/helpers/Helpers";
// import Logger                   from "../../tools/helpers/Logger";
// import SoundManager             from "../../tools/helpers/SoundManager";
// import Types                    from "../../tools/helpers/Types";
// import Notify                   from "../../tools/notify/Notify";
// import NotifyData               from "../../tools/notify/NotifyData";
// import Twns.Notify           from "../../tools/notify/NotifyType";
// import WarCommonHelpers         from "../../tools/warHelpers/WarCommonHelpers";
// import WarVisibilityHelpers     from "../../tools/warHelpers/WarVisibilityHelpers";
// import UserModel                from "../../user/model/UserModel";
// import TwnsBwActionPlannerView  from "../view/BwActionPlannerView";
// import TwnsBwUnitActionsPanel   from "../view/BwUnitActionsPanel";
// import TwnsBwCursor             from "./BwCursor";
// import TwnsBwTileMap            from "./BwTileMap";
// import TwnsBwTurnManager        from "./BwTurnManager";
// import TwnsBwUnit               from "./BwUnit";
// import TwnsBwUnitMap            from "./BwUnitMap";
// import TwnsBwWar                from "./BwWar";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.BaseWar {
    import NotifyType       = Twns.Notify.NotifyType;
    import UnitState        = Types.UnitActionState;
    import GridIndex        = Types.GridIndex;
    import State            = Types.ActionPlannerState;
    import MovableArea      = Types.MovableArea;
    import AttackableArea   = Types.AttackableArea;
    import MovePathNode     = Types.MovePathNode;
    import UnitActionType   = Types.UnitActionType;
    import ShortSfxCode     = Types.ShortSfxCode;
    import BwUnit           = BaseWar.BwUnit;
    import BwUnitMap        = BaseWar.BwUnitMap;
    import BwWar            = BaseWar.BwWar;
    import ClientErrorCode  = TwnsClientErrorCode.ClientErrorCode;

    type ChosenUnitForDrop = {
        unit        : BwUnit;
        destination : GridIndex;
    };
    export type DataForUnitAction = {
        actionType          : UnitActionType;
        callback            : () => void;
        unitForLaunch?      : BwUnit;
        unitForDrop?        : BwUnit;
        produceUnitType?    : Types.UnitType;
        costForProduceUnit? : number;
    };

    export abstract class BwActionPlanner {
        private readonly _view              = new BaseWar.BwActionPlannerView();

        private _war?                       : BwWar;
        private _mapSize?                   : Types.MapSize;

        private _state                      = State.Idle;
        private _prevState                  = State.Undefined;

        private _focusUnitOnMap             : BwUnit | null = null;
        private _focusUnitLoaded            : BwUnit | null = null;
        private _choosingUnitForDrop        : BwUnit | null = null;
        private _chosenUnitsForDrop         : ChosenUnitForDrop[] = [];
        private _availableDropDestinations  : GridIndex[] | null = null;
        private _movableArea                : MovableArea | null = null;
        private _attackableArea             : AttackableArea | null = null;
        private _attackableGridsAfterMove   : GridIndex[] | null = null;
        private _movePath                   : MovePathNode[] = [];

        private _unitsForPreviewAttack      = new Map<number, BwUnit>();
        private _tilesForPreviewAttack      = new Set<BaseWar.BwTile>();
        private _areaForPreviewAttack       : AttackableArea = [];
        private _unitForPreviewMove         : BwUnit | null = null;
        private _areaForPreviewMove         : MovableArea | null = null;
        private _unitForPreviewVisible      : BwUnit | null = null;
        private _areaForPreviewVisible      : GridIndex[] | null = null;

        private _notifyListeners: Twns.Notify.Listener[] = [
            { type: NotifyType.BwCursorTapped,      callback: this._onNotifyBwCursorTapped },
            { type: NotifyType.BwCursorDragged,     callback: this._onNotifyBwCursorDragged },
            { type: NotifyType.BwCursorDragEnded,   callback: this._onNotifyBwCursorDragEnded },
        ];

        public init(mapSize: Types.MapSize): void {
            this._setMapSize(Helpers.deepClone(mapSize));

            this.getView().init(this);
        }
        public fastInit(): void {
            this.getView().fastInit(this);
        }

        public startRunning(war: BwWar): void {
            this._war = war;

            this.setStateIdle();
            Twns.Notify.addEventListeners(this._notifyListeners, this);
        }
        public startRunningView(): void {
            this.getView().startRunningView();
        }
        public stopRunning(): void {
            Twns.Notify.removeEventListeners(this._notifyListeners, this);

            this.getView().stopRunningView();
        }

        protected _getWar(): BwWar {
            return Helpers.getExisted(this._war, ClientErrorCode.BwActionPlanner_GetWar_00);
        }
        protected _getUnitMap(): BwUnitMap {
            return this._getWar().getUnitMap();
        }
        protected _getTileMap(): BaseWar.BwTileMap {
            return this._getWar().getTileMap();
        }
        protected _getTurnManager(): BaseWar.BwTurnManager {
            return this._getWar().getTurnManager();
        }
        public getCursor(): BwCursor {
            return this._getWar().getCursor();
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Callbacks.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _onNotifyBwCursorTapped(): void {
            const gridIndex = this.getCursor().getGridIndex();
            const nextState = this._getNextStateOnTap(gridIndex);
            if (Twns.User.UserModel.getSelfSettingsIsAutoScrollMap()) {
                this._getWar().getView().tweenGridToCentralArea(gridIndex);
            }

            const currentState = this.getState();
            if ((nextState === currentState)                                                                &&
                ((nextState === State.ExecutingAction) || (WarHelpers.WarCommonHelpers.checkIsStateRequesting(nextState)))
            ) {
                return;
            }

            if (nextState === State.Idle) {
                this.setStateIdle(nextState === currentState ? ShortSfxCode.CursorMove01 : void 0);

            } else if (nextState === State.MakingMovePath) {
                this._setStateMakingMovePathOnTap(gridIndex);

            } else if (nextState === State.ChoosingAction) {
                this._setStateChoosingActionOnTap(gridIndex);

            } else if (nextState === State.ChoosingAttackTarget) {
                this._setStateChoosingAttackTargetOnTap(gridIndex);

            } else if (nextState === State.ChoosingDropDestination) {
                this._setStateChoosingDropDestinationOnTap(gridIndex);

            } else if (nextState === State.ChoosingFlareDestination) {
                this._setStateChoosingFlareDestinationOnTap(gridIndex);

            } else if (nextState === State.ChoosingSiloDestination) {
                this._setStateChoosingSiloDestinationOnTap(gridIndex);

            } else if (nextState === State.ChoosingProductionTarget) {
                this._setStateChoosingProductionTargetOnTap(gridIndex);

            } else if (nextState === State.PreviewingUnitAttackableArea) {
                this._setStatePreviewingUnitAttackableAreaOnTap(gridIndex);

            } else if (nextState === State.PreviewingUnitMovableArea) {
                this._setStatePreviewingUnitMovableAreaOnTap(gridIndex);

            } else if (nextState === State.PreviewingUnitVisibleArea) {
                this._setStatePreviewingUnitVisibleAreaOnTap(gridIndex);

            } else if (nextState === State.PreviewingTileAttackableArea) {
                this._setStatePreviewingTileAttackableAreaOnTap(gridIndex);

            } else if (nextState === State.RequestingUnitAttackUnit) {
                this._setStateRequestingUnitAttackUnit(gridIndex);

            } else if (nextState === State.RequestingUnitAttackTile) {
                this._setStateRequestingUnitAttackTile(gridIndex);

            } else if (nextState === State.RequestingUnitBeLoaded) {
                throw Helpers.newError(`McwActionPlanner._onNotifyMcwCursorTapped() error 1, nextState: ${nextState}`);

            } else if (nextState === State.RequestingUnitBuildTile) {
                throw Helpers.newError(`McwActionPlanner._onNotifyMcwCursorTapped() error 2, nextState: ${nextState}`);

            } else if (nextState === State.RequestingUnitCaptureTile) {
                throw Helpers.newError(`McwActionPlanner._onNotifyMcwCursorTapped() error 3, nextState: ${nextState}`);

            } else if (nextState === State.RequestingUnitDive) {
                throw Helpers.newError(`McwActionPlanner._onNotifyMcwCursorTapped() error 4, nextState: ${nextState}`);

            } else if (nextState === State.RequestingUnitDrop) {
                this._setStateRequestingUnitDropOnTap(gridIndex);

            } else if (nextState === State.RequestingUnitJoin) {
                throw Helpers.newError(`McwActionPlanner._onNotifyMcwCursorTapped() error 5, nextState: ${nextState}`);

            } else if (nextState === State.RequestingUnitLaunchFlare) {
                this._setStateRequestingUnitLaunchFlare(gridIndex);

            } else if (nextState === State.RequestingUnitLaunchSilo) {
                this._setStateRequestingUnitLaunchSilo(gridIndex);

            } else if (nextState === State.RequestingUnitProduceUnit) {
                throw Helpers.newError(`McwActionPlanner._onNotifyMcwCursorTapped() error 6, nextState: ${nextState}`);

            } else if (nextState === State.RequestingUnitSupply) {
                throw Helpers.newError(`McwActionPlanner._onNotifyMcwCursorTapped() error 7, nextState: ${nextState}`);

            } else if (nextState === State.RequestingUnitSurface) {
                throw Helpers.newError(`McwActionPlanner._onNotifyMcwCursorTapped() error 8, nextState: ${nextState}`);

            } else if (nextState === State.RequestingUnitWait) {
                throw Helpers.newError(`McwActionPlanner._onNotifyMcwCursorTapped() error 9, nextState: ${nextState}`);

            } else {
                throw Helpers.newError(`McwActionPlanner._onNotifyMcwCursorTapped() error 10, nextState: ${nextState}`);
            }
        }

        private _onNotifyBwCursorDragged(e: egret.Event): void {
            const gridIndex = this.getCursor().getGridIndex();
            const nextState = this._getNextStateOnDrag(gridIndex);
            if (Twns.User.UserModel.getSelfSettingsIsAutoScrollMap()) {
                this._getWar().getView().tweenGridToCentralArea((e.data as Twns.Notify.NotifyData.BwCursorDragged).draggedTo);
            }

            if ((nextState === this.getState())                                                                 &&
                ((nextState === State.ExecutingAction) || (WarHelpers.WarCommonHelpers.checkIsStateRequesting(nextState)))
            ) {
                // Do noting.
            } else {
                if (nextState === State.Idle) {
                    this.setStateIdle();

                } else if (nextState === State.MakingMovePath) {
                    this._setStateMakingMovePathOnDrag(gridIndex);

                } else if (nextState === State.ChoosingAction) {
                    this._setStateChoosingActionOnDrag(gridIndex);

                } else if (nextState === State.ChoosingAttackTarget) {
                    this._setStateChoosingAttackTargetOnDrag(gridIndex);

                } else if (nextState === State.ChoosingDropDestination) {
                    this._setStateChoosingDropDestinationOnDrag(gridIndex);

                } else if (nextState === State.ChoosingFlareDestination) {
                    this._setStateChoosingFlareDestinationOnDrag(gridIndex);

                } else if (nextState === State.ChoosingSiloDestination) {
                    this._setStateChoosingSiloDestinationOnDrag(gridIndex);

                } else if (nextState === State.ChoosingProductionTarget) {
                    this._setStateChoosingProductionTargetOnDrag(gridIndex);

                } else if (nextState === State.PreviewingUnitAttackableArea) {
                    this._setStatePreviewingUnitAttackableAreaOnDrag(gridIndex);

                } else if (nextState === State.PreviewingUnitMovableArea) {
                    this._setStatePreviewingMovableAreaOnDrag(gridIndex);

                } else if (nextState === State.PreviewingUnitVisibleArea) {
                    this._setStatePreviewingVisibleAreaOnDrag(gridIndex);

                } else if (nextState === State.PreviewingTileAttackableArea) {
                    this._setStatePreviewingTileAttackableAreaOnDrag(gridIndex);

                } else {
                    throw Helpers.newError(`BwActionPlanner._onNotifyBwCursorTapped() invalid nextState: ${nextState}`);
                }
            }
        }

        private _onNotifyBwCursorDragEnded(): void {
            const gridIndex = this.getCursor().getGridIndex();
            const nextState = this._getNextStateOnDragEnded(gridIndex);

            if (nextState === this.getState()) {
                // Do noting.
            } else {
                if (nextState === State.ChoosingAction) {
                    this._setStateChoosingActionOnDragEnded(gridIndex);

                } else {
                    throw Helpers.newError(`McwActionPlanner._onNotifyBwCursorDragEnded() error 10, nextState: ${nextState}`);
                }
            }
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Functions for setting common state.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        public getState(): State {
            return this._state;
        }
        public getPreviousState(): State {
            return this._prevState;
        }
        protected _setState(state: State): void {
            const isChanged = this._state !== state;
            this._prevState = this._state;
            this._state     = state;

            Logger.log(`BwActionPlanner._setState() ${state}`);
            Twns.Notify.dispatch(NotifyType.BwActionPlannerStateSet);
            (isChanged) && (Twns.Notify.dispatch(NotifyType.BwActionPlannerStateChanged));
        }

        public setStateIdle(shortSfxCode?: ShortSfxCode): void {
            this._clearFocusUnitOnMap();
            this._clearFocusUnitLoaded();
            this._clearChoosingUnitForDrop();
            this._clearChosenUnitsForDrop();
            this._clearAvailableDropDestinations();
            this._clearDataForPreviewingAttackableArea();
            this._clearDataForPreviewingMovableArea();
            this._clearDataForPreviewingVisibleArea();

            if (shortSfxCode != null) {
                SoundManager.playShortSfx(shortSfxCode);
            } else {
                const currentState = this.getState();
                if ((!this.checkIsStateRequesting())        &&
                    (currentState !== State.Idle)           &&
                    (currentState !== State.ExecutingAction)
                ) {
                    SoundManager.playShortSfx(ShortSfxCode.ButtonCancel01);
                }
            }

            this._setState(State.Idle);
            this._updateView();
        }

        public setStateExecutingAction(): void {
            this._clearFocusUnitOnMap();
            this._clearFocusUnitLoaded();
            this._clearChoosingUnitForDrop();
            this._clearChosenUnitsForDrop();
            this._clearAvailableDropDestinations();
            this._clearDataForPreviewingAttackableArea();
            this._clearDataForPreviewingMovableArea();
            this._clearDataForPreviewingVisibleArea();

            this._setState(State.ExecutingAction);
            this._updateView();
        }

        private _setStateMakingMovePathOnTap(gridIndex: GridIndex): void {
            const currState = this.getState();
            const unitMap   = this._getUnitMap();

            if (currState === State.Idle) {
                this._setFocusUnitOnMap(Helpers.getExisted(unitMap.getUnitOnMap(gridIndex)));
                this._resetMovableArea();
                this._resetAttackableArea();
                this._resetMovePathAsShortest(gridIndex);
                SoundManager.playShortSfx(ShortSfxCode.CursorConfirm01);

            } else if (currState === State.ExecutingAction) {
                throw Helpers.newError(`McwActionPlanner._setStateMakingMovePathOnTap() error 1, currState: ${currState}`);

            } else if (currState === State.MakingMovePath) {
                if (Helpers.getExisted(this.getFocusUnit()).checkCanAttackTargetAfterMovePath(this.getMovePath(), gridIndex)) {
                    SoundManager.playShortSfx(ShortSfxCode.CursorConfirm01);
                } else {
                    const existingUnit = this._getUnitMap().getUnitOnMap(gridIndex);
                    if ((existingUnit === this.getFocusUnitOnMap()) && (this.getFocusUnitLoaded())) {
                        // Nothing to do.
                    } else {
                        // if ((!existingUnit) || (existingUnit.getPlayerIndex() !== this._getPlayerIndexLoggedIn())) {
                        //     this._resetMovePathAsShortest(this.getAttackableArea()[gridIndex.x][gridIndex.y].movePathDestination);
                        // } else {
                        //     this._setFocusUnitOnMap(existingUnit);
                        //     this._clearFocusUnitLoaded();
                        //     this._resetMovableArea();
                        //     this._resetAttackableArea();
                        //     this._resetMovePathAsShortest(gridIndex);
                        // }
                        if (existingUnit) {
                            if (this._checkCanControlUnit(existingUnit)) {
                                this._setFocusUnitOnMap(existingUnit);
                                this._clearFocusUnitLoaded();
                                this._resetMovableArea();
                                this._resetAttackableArea();
                                this._resetMovePathAsShortest(gridIndex);
                                SoundManager.playShortSfx(ShortSfxCode.CursorConfirm01);
                            } else {
                                this._resetMovePathAsShortest(Helpers.getExisted(this.getAttackableArea())[gridIndex.x][gridIndex.y].movePathDestination);
                                SoundManager.playShortSfx(ShortSfxCode.CursorConfirm01);
                            }
                        } else {
                            if (this._getTileMap().getTile(gridIndex).getMaxHp() != null) {
                                this._resetMovePathAsShortest(Helpers.getExisted(this.getAttackableArea())[gridIndex.x][gridIndex.y].movePathDestination);
                                SoundManager.playShortSfx(ShortSfxCode.CursorConfirm01);
                            } else {
                                this._updateMovePathByDestination(gridIndex);
                                SoundManager.playShortSfx(ShortSfxCode.CursorConfirm01);
                            }
                        }
                    }
                }

            } else if (currState === State.ChoosingAction) {
                if (Helpers.getExisted(this.getFocusUnit()).checkCanAttackTargetAfterMovePath(this.getMovePath(), gridIndex)) {
                    // Nothing to do.
                } else {
                    const existingUnit = this._getUnitMap().getUnitOnMap(gridIndex);
                    if ((existingUnit === this.getFocusUnitOnMap()) && (this.getFocusUnitLoaded())) {
                        // Nothing to do.
                    } else {
                        if (existingUnit) {
                            if (this._checkCanControlUnit(existingUnit)) {
                                this._setFocusUnitOnMap(existingUnit);
                                this._clearFocusUnitLoaded();
                                this._resetMovableArea();
                                this._resetAttackableArea();
                                this._resetMovePathAsShortest(gridIndex);
                            } else {
                                this._resetMovePathAsShortest(Helpers.getExisted(this.getAttackableArea())[gridIndex.x][gridIndex.y].movePathDestination);
                            }
                        } else {
                            if (this._getTileMap().getTile(gridIndex).getMaxHp() != null) {
                                this._resetMovePathAsShortest(Helpers.getExisted(this.getAttackableArea())[gridIndex.x][gridIndex.y].movePathDestination);
                            } else {
                                this._updateMovePathByDestination(gridIndex);
                            }
                        }
                    }
                }

            } else if (currState === State.ChoosingAttackTarget) {
                throw Helpers.newError(`McwActionPlanner._setStateMakingMovePathOnTap() error 2, currState: ${currState}`);

            } else if (currState === State.ChoosingDropDestination) {
                throw Helpers.newError(`McwActionPlanner._setStateMakingMovePathOnTap() error 3, currState: ${currState}`);

            } else if (currState === State.ChoosingFlareDestination) {
                throw Helpers.newError(`McwActionPlanner._setStateMakingMovePathOnTap() error 4, currState: ${currState}`);

            } else if (currState === State.ChoosingSiloDestination) {
                throw Helpers.newError(`McwActionPlanner._setStateMakingMovePathOnTap() error 5, currState: ${currState}`);

            } else if (currState === State.ChoosingProductionTarget) {
                this._setFocusUnitOnMap(Helpers.getExisted(this._getUnitMap().getUnitOnMap(gridIndex)));
                this._resetMovableArea();
                this._resetAttackableArea();
                this._resetMovePathAsShortest(gridIndex);

            } else if (currState === State.PreviewingUnitAttackableArea) {
                this._setFocusUnitOnMap(Helpers.getExisted(this._getUnitMap().getUnitOnMap(gridIndex)));
                this._resetMovableArea();
                this._resetAttackableArea();
                this._resetMovePathAsShortest(gridIndex);
                this._clearDataForPreviewingAttackableArea();
                this._clearDataForPreviewingVisibleArea();

            } else if (currState === State.PreviewingUnitMovableArea) {
                this._setFocusUnitOnMap(Helpers.getExisted(this._getUnitMap().getUnitOnMap(gridIndex)));
                this._resetMovableArea();
                this._resetAttackableArea();
                this._resetMovePathAsShortest(gridIndex);
                this._clearDataForPreviewingMovableArea();
                this._clearDataForPreviewingVisibleArea();

            } else if (currState === State.PreviewingUnitVisibleArea) {
                this._setFocusUnitOnMap(Helpers.getExisted(this._getUnitMap().getUnitOnMap(gridIndex)));
                this._resetMovableArea();
                this._resetAttackableArea();
                this._resetMovePathAsShortest(gridIndex);
                this._clearDataForPreviewingMovableArea();
                this._clearDataForPreviewingVisibleArea();

            } else if (currState === State.PreviewingTileAttackableArea) {
                this._setFocusUnitOnMap(Helpers.getExisted(this._getUnitMap().getUnitOnMap(gridIndex)));
                this._resetMovableArea();
                this._resetAttackableArea();
                this._resetMovePathAsShortest(gridIndex);
                this._clearDataForPreviewingAttackableArea();
                this._clearDataForPreviewingVisibleArea();

            } else {
                throw Helpers.newError(`McwActionPlanner._setStateMakingMovePathOnTap() error 6, currState: ${currState}`);
            }

            this._setState(State.MakingMovePath);
            this._updateView();
        }

        private _setStateMakingMovePathOnDrag(gridIndex: GridIndex): void {
            const currState = this.getState();
            if (currState === State.Idle) {
                throw Helpers.newError(`BwActionPlanner._setStateMakingMovePathOnDrag() error 1, currState: ${currState}`);

            } else if (currState === State.ExecutingAction) {
                throw Helpers.newError(`BwActionPlanner._setStateMakingMovePathOnDrag() error 2, currState: ${currState}`);

            } else if (currState === State.MakingMovePath) {
                const focusUnit = Helpers.getExisted(this.getFocusUnit());
                if (focusUnit.checkCanAttackTargetAfterMovePath(this.getMovePath(), gridIndex)) {
                    // Do nothing.
                } else {
                    const movableArea = Helpers.getExisted(this.getMovableArea());
                    if (WarHelpers.WarCommonHelpers.checkAreaHasGrid(movableArea, gridIndex)) {
                        this._updateMovePathByDestination(gridIndex);
                    } else {
                        const attackableArea = Helpers.getExisted(this.getAttackableArea());
                        if (!WarHelpers.WarCommonHelpers.checkAreaHasGrid(attackableArea, gridIndex)) {
                            // Do nothing.
                        } else {
                            const newPath = WarHelpers.WarCommonHelpers.createShortestMovePath(movableArea, attackableArea[gridIndex.x][gridIndex.y].movePathDestination);
                            if (focusUnit.checkCanAttackTargetAfterMovePath(newPath, gridIndex)) {
                                this._setMovePath(newPath);
                            } else {
                                // Do nothing.
                            }
                        }
                    }
                }

            } else if (currState === State.ChoosingAction) {
                const focusUnit = Helpers.getExisted(this.getFocusUnit());
                if (focusUnit.checkCanAttackTargetAfterMovePath(this.getMovePath(), gridIndex)) {
                    // Do nothing.
                } else {
                    const movableArea = Helpers.getExisted(this.getMovableArea());
                    if (WarHelpers.WarCommonHelpers.checkAreaHasGrid(movableArea, gridIndex)) {
                        this._updateMovePathByDestination(gridIndex);
                    } else {
                        const attackableArea = Helpers.getExisted(this.getAttackableArea());
                        if (!WarHelpers.WarCommonHelpers.checkAreaHasGrid(attackableArea, gridIndex)) {
                            // Do nothing.
                        } else {
                            const newPath = WarHelpers.WarCommonHelpers.createShortestMovePath(movableArea, attackableArea[gridIndex.x][gridIndex.y].movePathDestination);
                            if (focusUnit.checkCanAttackTargetAfterMovePath(newPath, gridIndex)) {
                                this._setMovePath(newPath);
                            } else {
                                // Do nothing.
                            }
                        }
                    }
                }

            } else if (currState === State.ChoosingAttackTarget) {
                throw Helpers.newError(`BwActionPlanner._setStateMakingMovePathOnDrag() error 4, currState: ${currState}`);

            } else if (currState === State.ChoosingDropDestination) {
                throw Helpers.newError(`BwActionPlanner._setStateMakingMovePathOnDrag() error 5, currState: ${currState}`);

            } else if (currState === State.ChoosingFlareDestination) {
                throw Helpers.newError(`BwActionPlanner._setStateMakingMovePathOnDrag() error 6, currState: ${currState}`);

            } else if (currState === State.ChoosingSiloDestination) {
                throw Helpers.newError(`BwActionPlanner._setStateMakingMovePathOnDrag() error 7, currState: ${currState}`);

            } else if (currState === State.ChoosingProductionTarget) {
                throw Helpers.newError(`BwActionPlanner._setStateMakingMovePathOnDrag() error 8, currState: ${currState}`);

            } else if (currState === State.PreviewingUnitAttackableArea) {
                throw Helpers.newError(`BwActionPlanner._setStateMakingMovePathOnDrag() error 9, currState: ${currState}`);

            } else if (currState === State.PreviewingUnitMovableArea) {
                throw Helpers.newError(`BwActionPlanner._setStateMakingMovePathOnDrag() error 10, currState: ${currState}`);

            } else if (currState === State.PreviewingUnitVisibleArea) {
                throw Helpers.newError(`BwActionPlanner._setStateMakingMovePathOnDrag() invalid currState: ${currState}`, ClientErrorCode.BwActionPlanner_SetStateMakingMovePathOnDrag_00);

            } else if (currState === State.PreviewingTileAttackableArea) {
                throw Helpers.newError(`BwActionPlanner._setStateMakingMovePathOnDrag() invalid currState: ${currState}`);

            } else {
                throw Helpers.newError(`BwActionPlanner._setStateMakingMovePathOnDrag() error 11, currState: ${currState}`);
            }

            this._setState(State.MakingMovePath);
            this._updateView();
        }
        private _setStateMakingMovePathOnChooseAction(unitForLaunch: BwUnit): void {
            const currState = this.getState();
            if (currState !== State.ChoosingAction) {
                throw Helpers.newError(`BwActionPlanner._setStateMakingMovePathOnChooseAction() error 1, currState: ${currState}`);
            } else {
                if (this.getFocusUnitLoaded()) {
                    throw Helpers.newError(`BwActionPlanner._setStateMakingMovePathOnChooseAction() error 2, currState: ${currState}`);
                } else {
                    this._setFocusUnitLoaded(unitForLaunch);
                    this._resetMovableArea();
                    this._resetAttackableArea();
                    this._resetMovePathAsShortest(unitForLaunch.getGridIndex());
                }
            }

            this._setState(State.MakingMovePath);
            this._updateView();
        }

        protected _setStateChoosingActionOnTap(gridIndex: GridIndex): void {
            const currState = this.getState();
            if (currState === State.Idle) {
                throw Helpers.newError(`BwActionPlanner._setStateChoosingActionOnTap() error 1, currState: ${currState}`);

            } else if (currState === State.ExecutingAction) {
                throw Helpers.newError(`BwActionPlanner._setStateChoosingActionOnTap() error 2, currState: ${currState}`);

            } else if (currState === State.MakingMovePath) {
                if (WarHelpers.WarCommonHelpers.checkAreaHasGrid(Helpers.getExisted(this.getMovableArea()), gridIndex)) {
                    this._updateMovePathByDestination(gridIndex);
                    SoundManager.playShortSfx(ShortSfxCode.CursorConfirm01);
                } else {
                    if (!this.getFocusUnitLoaded()) {
                        throw Helpers.newError(`BwActionPlanner._setStateChoosingActionOnTap() error 3, currState: ${currState}`);
                    } else {
                        this._clearFocusUnitLoaded();
                        this._resetMovableArea();
                        this._resetAttackableArea();
                        this._resetMovePathAsShortest(Helpers.getExisted(this.getFocusUnitOnMap()).getGridIndex());
                        SoundManager.playShortSfx(ShortSfxCode.ButtonCancel01);
                    }
                }

            } else if (currState === State.ChoosingAction) {
                if (WarHelpers.WarCommonHelpers.checkAreaHasGrid(Helpers.getExisted(this.getMovableArea()), gridIndex)) {
                    this._updateMovePathByDestination(gridIndex);
                    SoundManager.playShortSfx(ShortSfxCode.CursorConfirm01);
                } else {
                    if (Helpers.getExisted(this.getFocusUnit()).checkCanAttackTargetAfterMovePath(this.getMovePath(), gridIndex)) {
                        SoundManager.playShortSfx(ShortSfxCode.CursorConfirm01);
                    } else {
                        if (this.getFocusUnitLoaded()) {
                            this._clearFocusUnitLoaded();
                            this._resetMovableArea();
                            this._resetAttackableArea();
                            this._resetMovePathAsShortest(Helpers.getExisted(this.getFocusUnitOnMap()).getGridIndex());
                            SoundManager.playShortSfx(ShortSfxCode.ButtonCancel01);
                        } else {
                            SoundManager.playShortSfx(ShortSfxCode.CursorConfirm01);
                        }
                    }
                }

            } else if (currState === State.ChoosingAttackTarget) {
                SoundManager.playShortSfx(ShortSfxCode.ButtonCancel01);

            } else if (currState === State.ChoosingDropDestination) {
                if (this.getAvailableDropDestinations()?.some(g => GridIndexHelpers.checkIsEqual(g, gridIndex))) {
                    this._pushBackChosenUnitForDrop({
                        unit        : Helpers.getExisted(this.getChoosingUnitForDrop()),
                        destination : gridIndex,
                    });
                }
                this._clearChoosingUnitForDrop();
                this._clearAvailableDropDestinations();

            } else if (currState === State.ChoosingFlareDestination) {
                // Nothing to do.

            } else if (currState === State.ChoosingSiloDestination) {
                throw Helpers.newError(`BwActionPlanner._setStateChoosingActionOnTap() error 5, currState: ${currState}`);

            } else if (currState === State.ChoosingProductionTarget) {
                throw Helpers.newError(`BwActionPlanner._setStateChoosingActionOnTap() error 6, currState: ${currState}`);

            } else if (currState === State.PreviewingUnitAttackableArea) {
                throw Helpers.newError(`BwActionPlanner._setStateChoosingActionOnTap() error 7, currState: ${currState}`);

            } else if (currState === State.PreviewingUnitMovableArea) {
                throw Helpers.newError(`BwActionPlanner._setStateChoosingActionOnTap() error 8, currState: ${currState}`);

            } else if (currState === State.PreviewingUnitVisibleArea) {
                throw Helpers.newError(`BwActionPlanner._setStateChoosingActionOnTap() invalid currState: ${currState}`, ClientErrorCode.BwActionPlanner_SetStateChoosingActionOnTap_00);

            } else if (currState === State.PreviewingTileAttackableArea) {
                throw Helpers.newError(`BwActionPlanner._setStateChoosingActionOnTap() invalid currState: ${currState}`);

            } else {
                throw Helpers.newError(`BwActionPlanner._setStateChoosingActionOnTap() error 9, currState: ${currState}`);
            }

            this._setState(State.ChoosingAction);
            this._updateView();
        }
        private _setStateChoosingActionOnDrag(gridIndex: GridIndex): void {
            const currState = this.getState();
            if (currState !== State.ChoosingAction) {
                throw Helpers.newError(`BwActionPlanner._setStateChoosingActionOnDrag() error 1, currState: ${currState}`);
            } else {
                // Nothing to do.
            }

            this._setState(State.ChoosingAction);
            this._updateView();
        }

        protected _setStateChoosingAttackTargetOnTap(gridIndex: GridIndex): void {
            const currState = this.getState();
            if (currState === State.Idle) {
                throw Helpers.newError(`BwActionPlanner._setStateChoosingAttackTargetOnTap() error 1, currState: ${currState}`);

            } else if (currState === State.ExecutingAction) {
                throw Helpers.newError(`BwActionPlanner._setStateChoosingAttackTargetOnTap() error 2, currState: ${currState}`);

            } else if (currState === State.MakingMovePath) {
                throw Helpers.newError(`BwActionPlanner._setStateChoosingAttackTargetOnTap() error 3, currState: ${currState}`);

            } else if (currState === State.ChoosingAction) {
                throw Helpers.newError(`BwActionPlanner._setStateChoosingAttackTargetOnTap() error 4, currState: ${currState}`);

            } else if (currState === State.ChoosingAttackTarget) {
                SoundManager.playShortSfx(ShortSfxCode.CursorConfirm01);

            } else if (currState === State.ChoosingDropDestination) {
                throw Helpers.newError(`BwActionPlanner._setStateChoosingAttackTargetOnTap() error 5, currState: ${currState}`);

            } else if (currState === State.ChoosingFlareDestination) {
                throw Helpers.newError(`BwActionPlanner._setStateChoosingAttackTargetOnTap() error 6, currState: ${currState}`);

            } else if (currState === State.ChoosingSiloDestination) {
                throw Helpers.newError(`BwActionPlanner._setStateChoosingAttackTargetOnTap() error 7, currState: ${currState}`);

            } else if (currState === State.ChoosingProductionTarget) {
                throw Helpers.newError(`BwActionPlanner._setStateChoosingAttackTargetOnTap() error 8, currState: ${currState}`);

            } else if (currState === State.PreviewingUnitAttackableArea) {
                throw Helpers.newError(`BwActionPlanner._setStateChoosingAttackTargetOnTap() error 9, currState: ${currState}`);

            } else if (currState === State.PreviewingUnitMovableArea) {
                throw Helpers.newError(`BwActionPlanner._setStateChoosingAttackTargetOnTap() error 10, currState: ${currState}`);

            } else if (currState === State.PreviewingUnitVisibleArea) {
                throw Helpers.newError(`BwActionPlanner._setStateChoosingAttackTargetOnTap() invalid currState: ${currState}`, ClientErrorCode.BwActionPlanner_SetStateChoosingAttackTargetOnTap_00);

            } else if (currState === State.PreviewingTileAttackableArea) {
                throw Helpers.newError(`BwActionPlanner._setStateChoosingAttackTargetOnTap() invalid currState: ${currState}`);

            } else {
                throw Helpers.newError(`BwActionPlanner._setStateChoosingAttackTargetOnTap() error 11, currState: ${currState}`);
            }

            this._setState(State.ChoosingAttackTarget);
            this._updateView();
        }
        private _setStateChoosingAttackTargetOnDrag(gridIndex: GridIndex): void {
            const currState = this.getState();
            if (currState === State.Idle) {
                throw Helpers.newError(`BwActionPlanner._setStateChoosingAttackTargetOnDrag() error 1, currState: ${currState}`);

            } else if (currState === State.ExecutingAction) {
                throw Helpers.newError(`BwActionPlanner._setStateChoosingAttackTargetOnDrag() error 2, currState: ${currState}`);

            } else if (currState === State.MakingMovePath) {
                throw Helpers.newError(`BwActionPlanner._setStateChoosingAttackTargetOnDrag() error 3, currState: ${currState}`);

            } else if (currState === State.ChoosingAction) {
                throw Helpers.newError(`BwActionPlanner._setStateChoosingAttackTargetOnDrag() error 4, currState: ${currState}`);

            } else if (currState === State.ChoosingAttackTarget) {
                // Nothing to do.

            } else if (currState === State.ChoosingDropDestination) {
                throw Helpers.newError(`BwActionPlanner._setStateChoosingAttackTargetOnDrag() error 5, currState: ${currState}`);

            } else if (currState === State.ChoosingFlareDestination) {
                throw Helpers.newError(`BwActionPlanner._setStateChoosingAttackTargetOnDrag() error 6, currState: ${currState}`);

            } else if (currState === State.ChoosingSiloDestination) {
                throw Helpers.newError(`BwActionPlanner._setStateChoosingAttackTargetOnDrag() error 7, currState: ${currState}`);

            } else if (currState === State.ChoosingProductionTarget) {
                throw Helpers.newError(`BwActionPlanner._setStateChoosingAttackTargetOnDrag() error 8, currState: ${currState}`);

            } else if (currState === State.PreviewingUnitAttackableArea) {
                throw Helpers.newError(`BwActionPlanner._setStateChoosingAttackTargetOnDrag() error 9, currState: ${currState}`);

            } else if (currState === State.PreviewingUnitMovableArea) {
                throw Helpers.newError(`BwActionPlanner._setStateChoosingAttackTargetOnDrag() error 10, currState: ${currState}`);

            } else if (currState === State.PreviewingUnitVisibleArea) {
                throw Helpers.newError(`BwActionPlanner._setStateChoosingAttackTargetOnDrag() invalid currState: ${currState}`, ClientErrorCode.BwActionPlanner_SetStateChoosingAttackTargetOnDrag_00);

            } else if (currState === State.PreviewingTileAttackableArea) {
                throw Helpers.newError(`BwActionPlanner._setStateChoosingAttackTargetOnDrag() invalid currState: ${currState}`);

            } else {
                throw Helpers.newError(`BwActionPlanner._setStateChoosingAttackTargetOnDrag() error 11, currState: ${currState}`);
            }

            this._setState(State.ChoosingAttackTarget);
            this._updateView();
        }
        private _setStateChoosingAttackTargetOnChooseAction(): void {
            const currState = this.getState();
            if (currState !== State.ChoosingAction) {
                throw Helpers.newError(`BwActionPlanner._setStateChoosingAttackTargetOnChooseAction() error 1, currState: ${currState}`);
            } else {
                this._setAttackableGridsAfterMove(this._createAttackableGridsAfterMove());
            }

            this._setState(State.ChoosingAttackTarget);
            this._updateView();
        }

        protected _setStateChoosingDropDestinationOnTap(gridIndex: GridIndex): void {
            const currState = this.getState();
            if (currState === State.Idle) {
                throw Helpers.newError(`BwActionPlanner._setStateChoosingDropDestinationOnTap() error 1, currState: ${currState}`);

            } else if (currState === State.ExecutingAction) {
                throw Helpers.newError(`BwActionPlanner._setStateChoosingDropDestinationOnTap() error 2, currState: ${currState}`);

            } else if (currState === State.MakingMovePath) {
                throw Helpers.newError(`BwActionPlanner._setStateChoosingDropDestinationOnTap() error 3, currState: ${currState}`);

            } else if (currState === State.ChoosingAction) {
                const data = this._popBackChosenUnitForDrop();
                this._setChoosingUnitForDrop(data.unit);
                this._setAvailableDropDestinations(this._calculateAvailableDropDestination(data.unit, this._getChosenDropDestinations()));

            } else if (currState === State.ChoosingAttackTarget) {
                throw Helpers.newError(`BwActionPlanner._setStateChoosingDropDestinationOnTap() error 4, currState: ${currState}`);

            } else if (currState === State.ChoosingDropDestination) {
                throw Helpers.newError(`BwActionPlanner._setStateChoosingDropDestinationOnTap() error 5, currState: ${currState}`);

            } else if (currState === State.ChoosingFlareDestination) {
                throw Helpers.newError(`BwActionPlanner._setStateChoosingDropDestinationOnTap() error 6, currState: ${currState}`);

            } else if (currState === State.ChoosingSiloDestination) {
                throw Helpers.newError(`BwActionPlanner._setStateChoosingDropDestinationOnTap() error 7, currState: ${currState}`);

            } else if (currState === State.ChoosingProductionTarget) {
                throw Helpers.newError(`BwActionPlanner._setStateChoosingDropDestinationOnTap() error 8, currState: ${currState}`);

            } else if (currState === State.PreviewingUnitAttackableArea) {
                throw Helpers.newError(`BwActionPlanner._setStateChoosingDropDestinationOnTap() error 9, currState: ${currState}`);

            } else if (currState === State.PreviewingUnitMovableArea) {
                throw Helpers.newError(`BwActionPlanner._setStateChoosingDropDestinationOnTap() error 10, currState: ${currState}`);

            } else if (currState === State.PreviewingUnitVisibleArea) {
                throw Helpers.newError(`BwActionPlanner._setStateChoosingDropDestinationOnTap() invalid currState: ${currState}`, ClientErrorCode.BwActionPlanner_SetStateChoosingDropDestinationOnTap_00);

            } else if (currState === State.PreviewingTileAttackableArea) {
                throw Helpers.newError(`BwActionPlanner._setStateChoosingDropDestinationOnTap() invalid currState: ${currState}`);

            } else {
                throw Helpers.newError(`BwActionPlanner._setStateChoosingDropDestinationOnTap() error 11, currState: ${currState}`);
            }

            this._setState(State.ChoosingDropDestination);
            this._updateView();
        }
        private _setStateChoosingDropDestinationOnDrag(gridIndex: GridIndex): void {
            const currState = this.getState();
            if (currState === State.Idle) {
                throw Helpers.newError(`BwActionPlanner._setStateChoosingDropDestinationOnDrag() error 1, currState: ${currState}`);

            } else if (currState === State.ExecutingAction) {
                throw Helpers.newError(`BwActionPlanner._setStateChoosingDropDestinationOnDrag() error 2, currState: ${currState}`);

            } else if (currState === State.MakingMovePath) {
                throw Helpers.newError(`BwActionPlanner._setStateChoosingDropDestinationOnDrag() error 3, currState: ${currState}`);

            } else if (currState === State.ChoosingAction) {
                throw Helpers.newError(`BwActionPlanner._setStateChoosingDropDestinationOnDrag() error 4, currState: ${currState}`);

            } else if (currState === State.ChoosingAttackTarget) {
                throw Helpers.newError(`BwActionPlanner._setStateChoosingDropDestinationOnDrag() error 5, currState: ${currState}`);

            } else if (currState === State.ChoosingDropDestination) {
                // Nothing to do.

            } else if (currState === State.ChoosingFlareDestination) {
                throw Helpers.newError(`BwActionPlanner._setStateChoosingDropDestinationOnDrag() error 6, currState: ${currState}`);

            } else if (currState === State.ChoosingSiloDestination) {
                throw Helpers.newError(`BwActionPlanner._setStateChoosingDropDestinationOnDrag() error 7, currState: ${currState}`);

            } else if (currState === State.ChoosingProductionTarget) {
                throw Helpers.newError(`BwActionPlanner._setStateChoosingDropDestinationOnDrag() error 8, currState: ${currState}`);

            } else if (currState === State.PreviewingUnitAttackableArea) {
                throw Helpers.newError(`BwActionPlanner._setStateChoosingDropDestinationOnDrag() error 9, currState: ${currState}`);

            } else if (currState === State.PreviewingUnitMovableArea) {
                throw Helpers.newError(`BwActionPlanner._setStateChoosingDropDestinationOnDrag() error 10, currState: ${currState}`);

            } else if (currState === State.PreviewingUnitVisibleArea) {
                throw Helpers.newError(`BwActionPlanner._setStateChoosingDropDestinationOnDrag() invalid currState: ${currState}`, ClientErrorCode.BwActionPlanner_SetStateChoosingDropDestinationOnDrag_00);

            } else if (currState === State.PreviewingTileAttackableArea) {
                throw Helpers.newError(`BwActionPlanner._setStateChoosingDropDestinationOnDrag() invalid currState: ${currState}`);

            } else {
                throw Helpers.newError(`BwActionPlanner._setStateChoosingDropDestinationOnDrag() error 11, currState: ${currState}`);
            }

            this._setState(State.ChoosingDropDestination);
            this._updateView();
        }
        private _setStateChoosingDropDestinationOnChooseAction(unitForDrop: BwUnit): void {
            const currState = this.getState();
            if (currState !== State.ChoosingAction) {
                throw Helpers.newError(`BwActionPlanner._setStateChoosingDropDestinationOnChooseAction() error 1, currState: ${currState}`);
            } else {
                this._setChoosingUnitForDrop(unitForDrop);
                this._setAvailableDropDestinations(this._calculateAvailableDropDestination(unitForDrop, this._getChosenDropDestinations()));
            }

            this._setState(State.ChoosingDropDestination);
            this._updateView();
        }

        protected _setStateChoosingFlareDestinationOnTap(gridIndex: GridIndex): void {
            const currState = this.getState();
            if (currState === State.Idle) {
                throw Helpers.newError(`BwActionPlanner._setStateChoosingFlareDestinationOnTap() error 1, currState: ${currState}`);

            } else if (currState === State.ExecutingAction) {
                throw Helpers.newError(`BwActionPlanner._setStateChoosingFlareDestinationOnTap() error 2, currState: ${currState}`);

            } else if (currState === State.MakingMovePath) {
                throw Helpers.newError(`BwActionPlanner._setStateChoosingFlareDestinationOnTap() error 3, currState: ${currState}`);

            } else if (currState === State.ChoosingAction) {
                throw Helpers.newError(`BwActionPlanner._setStateChoosingFlareDestinationOnTap() error 4, currState: ${currState}`);

            } else if (currState === State.ChoosingAttackTarget) {
                throw Helpers.newError(`BwActionPlanner._setStateChoosingFlareDestinationOnTap() error 5, currState: ${currState}`);

            } else if (currState === State.ChoosingDropDestination) {
                throw Helpers.newError(`BwActionPlanner._setStateChoosingFlareDestinationOnTap() error 6, currState: ${currState}`);

            } else if (currState === State.ChoosingFlareDestination) {
                // Nothing to do.

            } else if (currState === State.ChoosingSiloDestination) {
                throw Helpers.newError(`BwActionPlanner._setStateChoosingFlareDestinationOnTap() error 7, currState: ${currState}`);

            } else if (currState === State.ChoosingProductionTarget) {
                throw Helpers.newError(`BwActionPlanner._setStateChoosingFlareDestinationOnTap() error 8, currState: ${currState}`);

            } else if (currState === State.PreviewingUnitAttackableArea) {
                throw Helpers.newError(`BwActionPlanner._setStateChoosingFlareDestinationOnTap() error 9, currState: ${currState}`);

            } else if (currState === State.PreviewingUnitMovableArea) {
                throw Helpers.newError(`BwActionPlanner._setStateChoosingFlareDestinationOnTap() error 10, currState: ${currState}`);

            } else if (currState === State.PreviewingUnitVisibleArea) {
                throw Helpers.newError(`BwActionPlanner._setStateChoosingFlareDestinationOnTap() invalid currState: ${currState}`, ClientErrorCode.BwActionPlanner_SetStateChoosingFlareDestinationOnTap_00);

            } else if (currState === State.PreviewingTileAttackableArea) {
                throw Helpers.newError(`BwActionPlanner._setStateChoosingFlareDestinationOnTap() invalid currState: ${currState}`);

            } else {
                throw Helpers.newError(`BwActionPlanner._setStateChoosingFlareDestinationOnTap() error 11, currState: ${currState}`);
            }

            this._setState(State.ChoosingFlareDestination);
            this._updateView();
        }
        private _setStateChoosingFlareDestinationOnDrag(gridIndex: GridIndex): void {
            const currState = this.getState();
            if (currState === State.Idle) {
                throw Helpers.newError(`BwActionPlanner._setStateChoosingFlareDestinationOnDrag() error 1, currState: ${currState}`);

            } else if (currState === State.ExecutingAction) {
                throw Helpers.newError(`BwActionPlanner._setStateChoosingFlareDestinationOnDrag() error 2, currState: ${currState}`);

            } else if (currState === State.MakingMovePath) {
                throw Helpers.newError(`BwActionPlanner._setStateChoosingFlareDestinationOnDrag() error 3, currState: ${currState}`);

            } else if (currState === State.ChoosingAction) {
                throw Helpers.newError(`BwActionPlanner._setStateChoosingFlareDestinationOnDrag() error 4, currState: ${currState}`);

            } else if (currState === State.ChoosingAttackTarget) {
                throw Helpers.newError(`BwActionPlanner._setStateChoosingFlareDestinationOnDrag() error 5, currState: ${currState}`);

            } else if (currState === State.ChoosingDropDestination) {
                throw Helpers.newError(`BwActionPlanner._setStateChoosingFlareDestinationOnDrag() error 6, currState: ${currState}`);

            } else if (currState === State.ChoosingFlareDestination) {
                // Nothing to do.

            } else if (currState === State.ChoosingSiloDestination) {
                throw Helpers.newError(`BwActionPlanner._setStateChoosingFlareDestinationOnDrag() error 7, currState: ${currState}`);

            } else if (currState === State.ChoosingProductionTarget) {
                throw Helpers.newError(`BwActionPlanner._setStateChoosingFlareDestinationOnDrag() error 8, currState: ${currState}`);

            } else if (currState === State.PreviewingUnitAttackableArea) {
                throw Helpers.newError(`BwActionPlanner._setStateChoosingFlareDestinationOnDrag() error 9, currState: ${currState}`);

            } else if (currState === State.PreviewingUnitMovableArea) {
                throw Helpers.newError(`BwActionPlanner._setStateChoosingFlareDestinationOnDrag() error 10, currState: ${currState}`);

            } else if (currState === State.PreviewingUnitVisibleArea) {
                throw Helpers.newError(`BwActionPlanner._setStateChoosingFlareDestinationOnDrag() invalid currState: ${currState}`, ClientErrorCode.BwActionPlanner_SetStateChoosingFlareDestinationOnDrag_00);

            } else if (currState === State.PreviewingTileAttackableArea) {
                throw Helpers.newError(`BwActionPlanner._setStateChoosingFlareDestinationOnDrag() invalid currState: ${currState}`);

            } else {
                throw Helpers.newError(`BwActionPlanner._setStateChoosingFlareDestinationOnDrag() error 11, currState: ${currState}`);
            }

            this._setState(State.ChoosingFlareDestination);
            this._updateView();
        }
        private _setStateChoosingFlareDestinationOnChooseAction(): void {
            const currState = this.getState();
            if (currState !== State.ChoosingAction) {
                throw Helpers.newError(`BwActionPlanner._setStateChoosingFlareDestinationOnChooseAction() error 1, currState: ${currState}`);
            } else {
                // Nothing to do.
            }

            this._setState(State.ChoosingFlareDestination);
            this._updateView();
        }

        protected _setStateChoosingSiloDestinationOnTap(gridIndex: GridIndex): void {
            const currState = this.getState();
            if (currState === State.Idle) {
                throw Helpers.newError(`BwActionPlanner._setStateChoosingSiloDestinationOnTap error 1, currState: ${currState}`);

            } else if (currState === State.ExecutingAction) {
                throw Helpers.newError(`BwActionPlanner._setStateChoosingSiloDestinationOnTap error 2, currState: ${currState}`);

            } else if (currState === State.MakingMovePath) {
                throw Helpers.newError(`BwActionPlanner._setStateChoosingSiloDestinationOnTap error 3, currState: ${currState}`);

            } else if (currState === State.ChoosingAction) {
                throw Helpers.newError(`BwActionPlanner._setStateChoosingSiloDestinationOnTap error 4, currState: ${currState}`);

            } else if (currState === State.ChoosingAttackTarget) {
                throw Helpers.newError(`BwActionPlanner._setStateChoosingSiloDestinationOnTap error 5, currState: ${currState}`);

            } else if (currState === State.ChoosingDropDestination) {
                throw Helpers.newError(`BwActionPlanner._setStateChoosingSiloDestinationOnTap error 6, currState: ${currState}`);

            } else if (currState === State.ChoosingFlareDestination) {
                throw Helpers.newError(`BwActionPlanner._setStateChoosingSiloDestinationOnTap error 7, currState: ${currState}`);

            } else if (currState === State.ChoosingSiloDestination) {
                // Nothing to do.

            } else if (currState === State.ChoosingProductionTarget) {
                throw Helpers.newError(`BwActionPlanner._setStateChoosingSiloDestinationOnTap error 8, currState: ${currState}`);

            } else if (currState === State.PreviewingUnitAttackableArea) {
                throw Helpers.newError(`BwActionPlanner._setStateChoosingSiloDestinationOnTap error 9, currState: ${currState}`);

            } else if (currState === State.PreviewingUnitMovableArea) {
                throw Helpers.newError(`BwActionPlanner._setStateChoosingSiloDestinationOnTap error 10, currState: ${currState}`);

            } else if (currState === State.PreviewingUnitVisibleArea) {
                throw Helpers.newError(`BwActionPlanner._setStateChoosingSiloDestinationOnTap invalid currState: ${currState}`, ClientErrorCode.BwActionPlanner_SetStateChoosingSiloDestinationOnTap_00);

            } else if (currState === State.PreviewingTileAttackableArea) {
                throw Helpers.newError(`BwActionPlanner._setStateChoosingSiloDestinationOnTap invalid currState: ${currState}`);

            } else {
                throw Helpers.newError(`BwActionPlanner._setStateChoosingSiloDestinationOnTap error 11, currState: ${currState}`);
            }

            this._setState(State.ChoosingSiloDestination);
            this._updateView();
        }
        private _setStateChoosingSiloDestinationOnDrag(gridIndex: GridIndex): void {
            const currState = this.getState();
            if (currState === State.Idle) {
                throw Helpers.newError(`BwActionPlanner._setStateChoosingSiloDestinationOnDrag() error 1, currState: ${currState}`);

            } else if (currState === State.ExecutingAction) {
                throw Helpers.newError(`BwActionPlanner._setStateChoosingSiloDestinationOnDrag() error 2, currState: ${currState}`);

            } else if (currState === State.MakingMovePath) {
                throw Helpers.newError(`BwActionPlanner._setStateChoosingSiloDestinationOnDrag() error 3, currState: ${currState}`);

            } else if (currState === State.ChoosingAction) {
                throw Helpers.newError(`BwActionPlanner._setStateChoosingSiloDestinationOnDrag() error 4, currState: ${currState}`);

            } else if (currState === State.ChoosingAttackTarget) {
                throw Helpers.newError(`BwActionPlanner._setStateChoosingSiloDestinationOnDrag() error 5, currState: ${currState}`);

            } else if (currState === State.ChoosingDropDestination) {
                throw Helpers.newError(`BwActionPlanner._setStateChoosingSiloDestinationOnDrag() error 6, currState: ${currState}`);

            } else if (currState === State.ChoosingFlareDestination) {
                throw Helpers.newError(`BwActionPlanner._setStateChoosingSiloDestinationOnDrag() error 7, currState: ${currState}`);

            } else if (currState === State.ChoosingSiloDestination) {
                // Nothing to do.

            } else if (currState === State.ChoosingProductionTarget) {
                throw Helpers.newError(`BwActionPlanner._setStateChoosingSiloDestinationOnDrag() error 8, currState: ${currState}`);

            } else if (currState === State.PreviewingUnitAttackableArea) {
                throw Helpers.newError(`BwActionPlanner._setStateChoosingSiloDestinationOnDrag() error 9, currState: ${currState}`);

            } else if (currState === State.PreviewingUnitMovableArea) {
                throw Helpers.newError(`BwActionPlanner._setStateChoosingSiloDestinationOnDrag() error 10, currState: ${currState}`);

            } else if (currState === State.PreviewingUnitVisibleArea) {
                throw Helpers.newError(`BwActionPlanner._setStateChoosingSiloDestinationOnDrag() invalid currState: ${currState}`, ClientErrorCode.BwActionPlanner_SetStateChoosingSiloDestinationOnDrag_00);

            } else if (currState === State.PreviewingTileAttackableArea) {
                throw Helpers.newError(`BwActionPlanner._setStateChoosingSiloDestinationOnDrag() invalid currState: ${currState}`);

            } else {
                throw Helpers.newError(`BwActionPlanner._setStateChoosingSiloDestinationOnDrag() error 11, currState: ${currState}`);
            }

            this._setState(State.ChoosingSiloDestination);
            this._updateView();
        }
        private _setStateChoosingSiloDestinationOnChooseAction(): void {
            const currState = this.getState();
            if (currState !== State.ChoosingAction) {
                throw Helpers.newError(`BwActionPlanner._setStateChoosingSiloDestinationOnChooseAction() error 1, currState: ${currState}`);
            } else {
                // Nothing to do.
            }

            this._setState(State.ChoosingSiloDestination);
            this._updateView();
        }

        protected _setStateChoosingProductionTargetOnTap(gridIndex: GridIndex): void {
            this._clearFocusUnitOnMap();
            this._clearFocusUnitLoaded();
            this._clearChoosingUnitForDrop();
            this._clearChosenUnitsForDrop();
            this._clearAvailableDropDestinations();
            this._clearDataForPreviewingAttackableArea();
            this._clearDataForPreviewingMovableArea();
            this._clearDataForPreviewingVisibleArea();

            this._setState(State.ChoosingProductionTarget);
            this._updateView();

            SoundManager.playShortSfx(ShortSfxCode.CursorConfirm01);
            TwnsPanelManager.open(TwnsPanelConfig.Dict.BwProduceUnitPanel, {
                gridIndex,
                war         : this._getWar(),
            });
        }
        private _setStateChoosingProductionTargetOnDrag(gridIndex: GridIndex): void {
            throw Helpers.newError(`BwActionPlanner._setStateChoosingProductionTargetOnDrag() error 1, currState: ${this.getState()}`);
        }

        private _setStatePreviewingUnitAttackableAreaOnTap(gridIndex: GridIndex): void {
            this._clearFocusUnitOnMap();
            this._clearFocusUnitLoaded();
            this._clearChoosingUnitForDrop();
            this._clearChosenUnitsForDrop();
            this._clearAvailableDropDestinations();
            this._addUnitForPreviewAttackableArea(Helpers.getExisted(this._getUnitMap().getUnitOnMap(gridIndex)));
            this._clearDataForPreviewingMovableArea();
            this._clearDataForPreviewingVisibleArea();

            this._setState(State.PreviewingUnitAttackableArea);
            this._updateView();
            SoundManager.playShortSfx(ShortSfxCode.CursorConfirm01);
        }
        private _setStatePreviewingUnitAttackableAreaOnDrag(gridIndex: GridIndex): void {
            // Nothing to do.
        }

        private _setStatePreviewingTileAttackableAreaOnTap(gridIndex: GridIndex): void {
            this._clearFocusUnitOnMap();
            this._clearFocusUnitLoaded();
            this._clearChoosingUnitForDrop();
            this._clearChosenUnitsForDrop();
            this._clearAvailableDropDestinations();
            this._addTileForPreviewAttackableArea(this._getTileMap().getTile(gridIndex));
            this._clearDataForPreviewingMovableArea();
            this._clearDataForPreviewingVisibleArea();

            this._setState(State.PreviewingTileAttackableArea);
            this._updateView();
            SoundManager.playShortSfx(ShortSfxCode.CursorConfirm01);
        }
        private _setStatePreviewingTileAttackableAreaOnDrag(gridIndex: GridIndex): void {
            // Nothing to do.
        }

        private _setStatePreviewingUnitMovableAreaOnTap(gridIndex: GridIndex): void {
            this._clearFocusUnitOnMap();
            this._clearFocusUnitLoaded();
            this._clearChoosingUnitForDrop();
            this._clearChosenUnitsForDrop();
            this._clearAvailableDropDestinations();
            this._clearDataForPreviewingAttackableArea();
            this._clearDataForPreviewingVisibleArea();
            this._setUnitForPreviewingMovableArea(Helpers.getExisted(this._getUnitMap().getUnitOnMap(gridIndex)));

            this._setState(State.PreviewingUnitMovableArea);
            this._updateView();
            SoundManager.playShortSfx(ShortSfxCode.CursorConfirm01);
        }
        private _setStatePreviewingMovableAreaOnDrag(gridIndex: GridIndex): void {
            // Nothing to do.
        }

        private _setStatePreviewingUnitVisibleAreaOnTap(gridIndex: GridIndex): void {
            this._clearFocusUnitOnMap();
            this._clearFocusUnitLoaded();
            this._clearChoosingUnitForDrop();
            this._clearChosenUnitsForDrop();
            this._clearAvailableDropDestinations();
            this._clearDataForPreviewingAttackableArea();
            this._clearDataForPreviewingMovableArea();
            this._setUnitForPreviewingVisibleArea(Helpers.getExisted(this._getUnitMap().getUnitOnMap(gridIndex)));

            this._setState(State.PreviewingUnitVisibleArea);
            this._updateView();
            SoundManager.playShortSfx(ShortSfxCode.CursorConfirm01);
        }
        private _setStatePreviewingVisibleAreaOnDrag(gridIndex: GridIndex): void {
            // Nothing to do.
        }

        private _setStateChoosingActionOnDragEnded(gridIndex: GridIndex): void {
            const currState = this.getState();
            if (currState === State.MakingMovePath) {
                if (WarHelpers.WarCommonHelpers.checkAreaHasGrid(Helpers.getExisted(this.getMovableArea()), gridIndex)) {
                    this._updateMovePathByDestination(gridIndex);
                } else {
                    throw Helpers.newError(`BwActionPlanner._setStateChoosingActionOnDragEnded() error 1, currState: ${currState}`);
                }

            } else {
                throw Helpers.newError(`BwActionPlanner._setStateChoosingActionOnDragEnded() error 2, currState: ${currState}`);
            }

            this._setState(State.ChoosingAction);
            this._updateView();
            SoundManager.playShortSfx(ShortSfxCode.CursorConfirm01);
        }

        protected abstract _setStateRequestingUnitAttackUnit(gridIndex: GridIndex): void;
        protected abstract _setStateRequestingUnitAttackTile(gridIndex: GridIndex): void;
        protected abstract _setStateRequestingUnitDropOnTap(gridIndex: GridIndex): void;
        protected abstract _setStateRequestingUnitLaunchFlare(gridIndex: GridIndex): void;
        protected abstract _setStateRequestingUnitLaunchSilo(gridIndex: GridIndex): void;
        public abstract setStateRequestingPlayerProduceUnit(gridIndex: GridIndex, unitType: Types.UnitType, unitHp: number): void;
        public abstract setStateRequestingPlayerEndTurn(): void;
        public abstract setStateRequestingPlayerUseCoSkill(skillType: Types.CoSkillType): void;
        public abstract setStateRequestingPlayerDeleteUnit(): void;
        public abstract setStateRequestingPlayerVoteForDraw(isAgree: boolean): void;
        public abstract setStateRequestingPlayerSurrender(): void;

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Other functions.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        public getView(): BaseWar.BwActionPlannerView {
            return this._view;
        }
        protected abstract _updateView(): void;

        protected abstract _checkCanControlUnit(unit: BwUnit): boolean;

        private _setMapSize(size: Types.MapSize): void {
            this._mapSize = size;
        }
        public getMapSize(): Types.MapSize {
            return Helpers.getExisted(this._mapSize);
        }

        public checkIsStateRequesting(): boolean {
            return WarHelpers.WarCommonHelpers.checkIsStateRequesting(this.getState());
        }

        public getFocusUnit(): BwUnit | null {
            return this.getFocusUnitLoaded() || this.getFocusUnitOnMap();
        }
        public getFocusUnitOnMap(): BwUnit | null {
            return this._focusUnitOnMap;
        }
        private _setFocusUnitOnMap(unit: BwUnit): void {
            this._focusUnitOnMap = unit;
        }
        protected _clearFocusUnitOnMap(): void {
            this._focusUnitOnMap = null;
        }

        public getFocusUnitLoaded(): BwUnit | null {
            return this._focusUnitLoaded;
        }
        private _setFocusUnitLoaded(unit: BwUnit): void {
            this._focusUnitLoaded = unit;
        }
        protected _clearFocusUnitLoaded(): void {
            this._focusUnitLoaded = null;
        }
        protected _getUnitIdForFocusUnitLoaded(): number | null {
            const unit = this.getFocusUnitLoaded();
            return unit ? unit.getUnitId() : null;
        }

        public getAvailableDropDestinations(): GridIndex[] | null {
            return this._availableDropDestinations;
        }
        private _setAvailableDropDestinations(destinations: GridIndex[]): void {
            this._availableDropDestinations = destinations;
        }
        protected _clearAvailableDropDestinations(): void {
            this._availableDropDestinations = null;
        }

        public getChoosingUnitForDrop(): BwUnit | null {
            return this._choosingUnitForDrop;
        }
        private _setChoosingUnitForDrop(unit: BwUnit): void {
            this._choosingUnitForDrop = unit;
        }
        protected _clearChoosingUnitForDrop(): void {
            this._choosingUnitForDrop = null;
        }

        public getChosenUnitsForDrop(): ChosenUnitForDrop[] {
            return this._chosenUnitsForDrop;
        }
        protected _pushBackChosenUnitForDrop(data: ChosenUnitForDrop): void {
            this._chosenUnitsForDrop.push(data);
        }
        private _popBackChosenUnitForDrop(): ChosenUnitForDrop {
            return Helpers.getExisted(this.getChosenUnitsForDrop().pop());
        }
        protected _clearChosenUnitsForDrop(): void {
            this._chosenUnitsForDrop.length = 0;
        }
        private _getChosenDropDestinations(): GridIndex[] {
            const destinations: GridIndex[] = [];
            for (const data of this.getChosenUnitsForDrop()) {
                destinations.push(data.destination);
            }
            return destinations;
        }

        protected _resetMovableArea(): void {
            const unit = Helpers.getExisted(this.getFocusUnit());
            this._movableArea = WarHelpers.WarCommonHelpers.createMovableArea({
                origin          : unit.getGridIndex(),
                maxMoveCost     : unit.getFinalMoveRange(),
                mapSize         : this._getWar().getTileMap().getMapSize(),
                moveCostGetter  : gridIndex => this._getMoveCost(gridIndex, unit)
            });
        }
        public getMovableArea(): MovableArea | null {
            return this._movableArea;
        }

        private _resetAttackableArea(): void {
            const focusUnit             = Helpers.getExisted(this.getFocusUnit());
            const canAttackAfterMove    = focusUnit.checkCanAttackAfterMove();
            const isLoaded              = focusUnit.getLoaderUnitId() != null;
            const beginningGridIndex    = focusUnit.getGridIndex();
            const hasAmmo               = (!!focusUnit.getPrimaryWeaponCurrentAmmo()) || (focusUnit.checkHasSecondaryWeapon());
            const unitMap               = this._getUnitMap();
            this._setAttackableArea(WarHelpers.WarCommonHelpers.createAttackableAreaForUnit({
                movableArea     : Helpers.getExisted(this.getMovableArea()),
                mapSize         : this.getMapSize(),
                minAttackRange  : focusUnit.getMinAttackRange(),
                maxAttackRange  : focusUnit.getFinalMaxAttackRange(),
                checkCanAttack  : (moveGridIndex): boolean => {
                    if (!hasAmmo) {
                        return false;
                    } else {
                        const existingUnit = unitMap.getVisibleUnitOnMap(moveGridIndex);
                        if ((existingUnit) && (existingUnit !== focusUnit)) {
                            return false;
                        } else {
                            const hasMoved = !GridIndexHelpers.checkIsEqual(moveGridIndex, beginningGridIndex);
                            return ((!isLoaded) || (hasMoved))
                                && ((canAttackAfterMove) || (!hasMoved));
                        }
                    }
                }
            }));
        }
        protected _setAttackableArea(area: AttackableArea): void {
            this._attackableArea = area;
        }
        public getAttackableArea(): AttackableArea | null {
            return this._attackableArea;
        }

        private _setAttackableGridsAfterMove(grids: GridIndex[]): void {
            this._attackableGridsAfterMove = grids;
        }
        public getAttackableGridsAfterMove(): GridIndex[] | null {
            return this._attackableGridsAfterMove;
        }
        public checkHasAttackableGridAfterMove(gridIndex: GridIndex): boolean {
            for (const grid of Helpers.getExisted(this.getAttackableGridsAfterMove())) {
                if (GridIndexHelpers.checkIsEqual(grid, gridIndex)) {
                    return true;
                }
            }
            return false;
        }
        private _createAttackableGridsAfterMove(): GridIndex[] {
            const unit              = Helpers.getExisted(this.getFocusUnit());
            const minAttackRange    = unit.getMinAttackRange();
            if (minAttackRange == null) {
                return [];
            } else {
                return GridIndexHelpers.getGridsWithinDistance(
                    { origin: this.getMovePathDestination(), minDistance: Helpers.getExisted(minAttackRange), maxDistance: Helpers.getExisted(unit.getFinalMaxAttackRange()), mapSize: this.getMapSize(), predicate: (gridIndex) => unit.checkCanAttackTargetAfterMovePath(this.getMovePath(), gridIndex) }                );
            }
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Functions for move path.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        protected _resetMovePathAsShortest(destination: GridIndex): void {
            this._setMovePath(WarHelpers.WarCommonHelpers.createShortestMovePath(Helpers.getExisted(this.getMovableArea()), destination));
        }
        private _setMovePath(movePath: MovePathNode[]): void {
            this._movePath = movePath;
            Twns.Notify.dispatch(NotifyType.BwActionPlannerMovePathChanged);
        }
        public getMovePath(): MovePathNode[] {
            return this._movePath;
        }
        public getMovePathDestination(): MovePathNode {
            const movePath = this.getMovePath();
            return movePath[movePath.length - 1];
        }
        protected _updateMovePathByDestination(destination: GridIndex): void {
            const { x, y }      = destination;
            const movableArea   = Helpers.getExisted(this.getMovableArea());
            const currPath      = this.getMovePath();
            if ((movableArea[x]) && (movableArea[x][y]) && (!GridIndexHelpers.checkIsEqual(currPath[currPath.length - 1], destination))) {
                if ((!this._checkAndTruncateMovePath(destination)) && (!this._checkAndExtendMovePath(destination))) {
                    this._resetMovePathAsShortest(destination);
                }
            }
        }
        private _checkAndTruncateMovePath(destination: GridIndex): boolean {
            const path      = this.getMovePath();
            const length    = path.length;
            for (let i = 0; i < length; ++i) {
                if (GridIndexHelpers.checkIsEqual(path[i], destination)) {
                    path.length = i + 1;
                    return true;
                }
            }
            return false;
        }
        private _checkAndExtendMovePath(destination: GridIndex): boolean {
            const path      = this.getMovePath();
            const length    = path.length;
            const prevGrid  = path[length - 1];
            if (!GridIndexHelpers.checkIsAdjacent(prevGrid, destination)) {
                return false;
            } else {
                const focusUnit     = Helpers.getExisted(this.getFocusUnit());
                const totalMoveCost = Helpers.getExisted(this._getMoveCost(destination, focusUnit)) + prevGrid.totalMoveCost;
                if (totalMoveCost > focusUnit.getFinalMoveRange()) {
                    return false;
                } else {
                    path.push({
                        x               : destination.x,
                        y               : destination.y,
                        totalMoveCost,
                    });
                    return true;
                }
            }
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Functions for previewing attackable area.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        public getUnitsForPreviewingAttackableArea(): Map<number, BwUnit> {
            return this._unitsForPreviewAttack;
        }
        public getTilesForPreviewingAttackableArea(): Set<BaseWar.BwTile> {
            return this._tilesForPreviewAttack;
        }

        public getAreaForPreviewingAttack(): AttackableArea {
            return this._areaForPreviewAttack;
        }
        protected _setAreaForPreviewingAttack(area: AttackableArea): void {
            this._areaForPreviewAttack = area;
        }
        protected _clearDataForPreviewingAttackableArea(): void {
            this.getUnitsForPreviewingAttackableArea().clear();
            this.getTilesForPreviewingAttackableArea().clear();
            this._areaForPreviewAttack.length = 0;
        }
        protected _addUnitForPreviewAttackableArea(unit: BwUnit): void {
            const canAttackAfterMove    = unit.checkCanAttackAfterMove();
            const beginningGridIndex    = unit.getGridIndex();
            const hasAmmo               = (!!unit.getPrimaryWeaponCurrentAmmo()) || (unit.checkHasSecondaryWeapon());
            const mapSize               = this.getMapSize();
            const unitMap               = this._getUnitMap();
            const newArea               = WarHelpers.WarCommonHelpers.createAttackableAreaForUnit({
                movableArea: WarHelpers.WarCommonHelpers.createMovableArea({
                    origin          : unit.getGridIndex(),
                    maxMoveCost     : unit.getFinalMoveRange(),
                    mapSize,
                    moveCostGetter  : gridIndex => this._getMoveCost(gridIndex, unit)
                }),
                mapSize,
                minAttackRange: unit.getMinAttackRange(),
                maxAttackRange: unit.getFinalMaxAttackRange(),
                checkCanAttack: (moveGridIndex) => {
                    const existingUnit = unitMap.getUnitOnMap(moveGridIndex);
                    return ((!existingUnit) || (existingUnit === unit))
                        && (hasAmmo)
                        && ((canAttackAfterMove) || (GridIndexHelpers.checkIsEqual(moveGridIndex, beginningGridIndex)));
                }
            });

            this.getUnitsForPreviewingAttackableArea().set(unit.getUnitId(), unit);
            if (!this._areaForPreviewAttack.length) {
                this._areaForPreviewAttack = newArea;
            } else {
                const { width, height } = mapSize;
                for (let x = 0; x < width; ++x) {
                    if (newArea[x]) {
                        if (!this._areaForPreviewAttack[x]) {
                            this._areaForPreviewAttack[x] = newArea[x];
                        } else {
                            for (let y = 0; y < height; ++y) {
                                this._areaForPreviewAttack[x][y] = this._areaForPreviewAttack[x][y] || newArea[x][y];
                            }
                        }
                    }
                }
            }
        }
        private _addTileForPreviewAttackableArea(tile: BaseWar.BwTile): void {
            const mapSize   = this.getMapSize();
            const newArea   = WarHelpers.WarCommonHelpers.createAttackableAreaForTile(tile, mapSize);
            this.getTilesForPreviewingAttackableArea().add(tile);
            if (!this._areaForPreviewAttack.length) {
                this._areaForPreviewAttack = newArea;
            } else {
                const { width, height } = mapSize;
                for (let x = 0; x < width; ++x) {
                    if (newArea[x]) {
                        if (!this._areaForPreviewAttack[x]) {
                            this._areaForPreviewAttack[x] = newArea[x];
                        } else {
                            for (let y = 0; y < height; ++y) {
                                this._areaForPreviewAttack[x][y] = this._areaForPreviewAttack[x][y] || newArea[x][y];
                            }
                        }
                    }
                }
            }
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Functions for previewing movable area.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        public getUnitForPreviewingMovableArea(): BwUnit | null {
            return this._unitForPreviewMove;
        }
        public getAreaForPreviewingMove(): MovableArea | null {
            return this._areaForPreviewMove;
        }
        private _clearDataForPreviewingMovableArea(): void {
            this._unitForPreviewMove = null;
            this._areaForPreviewMove = null;
        }
        private _setUnitForPreviewingMovableArea(unit: BwUnit): void {
            this._unitForPreviewMove = unit;
            this._areaForPreviewMove = WarHelpers.WarCommonHelpers.createMovableArea({
                origin          : unit.getGridIndex(),
                maxMoveCost     : unit.getFinalMoveRange(),
                mapSize         : this._getWar().getTileMap().getMapSize(),
                moveCostGetter  : gridIndex => this._getMoveCost(gridIndex, unit)
            });
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Functions for previewing visible area.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        public getUnitForPreviewingVisibleArea(): BwUnit | null {
            return this._unitForPreviewVisible;
        }
        public getAreaForPreviewingVisible(): GridIndex[] | null {
            return this._areaForPreviewVisible;
        }
        private  _clearDataForPreviewingVisibleArea(): void {
            this._unitForPreviewVisible = null;
            this._areaForPreviewVisible = null;
        }
        private _setUnitForPreviewingVisibleArea(unit: BwUnit): void {
            const gridIndex = unit.getGridIndex();
            this._unitForPreviewVisible = unit;
            this._areaForPreviewVisible = GridIndexHelpers.getGridsWithinDistance({
                origin      : gridIndex,
                minDistance : 0,
                maxDistance : unit.getVisionRangeForPlayer(unit.getPlayerIndex(), gridIndex) ?? 0,
                mapSize     : this._getWar().getTileMap().getMapSize(),
            });
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Functions for getting the next state when the player inputs.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _getNextStateOnTap(gridIndex: GridIndex): State {
            const currState = this.getState();
            if ((this.checkIsStateRequesting()) || (currState === State.ExecutingAction)) {
                return currState;
            } else {
                switch (currState) {
                    case State.Idle                         : return this._getNextStateOnTapWhenIdle(gridIndex);
                    case State.MakingMovePath               : return this._getNextStateOnTapWhenMakingMovePath(gridIndex);
                    case State.ChoosingAction               : return this._getNextStateOnTapWhenChoosingAction(gridIndex);
                    case State.ChoosingAttackTarget         : return this._getNextStateOnTapWhenChoosingAttackTarget(gridIndex);
                    case State.ChoosingDropDestination      : return this._getNextStateOnTapWhenChoosingDropDestination(gridIndex);
                    case State.ChoosingFlareDestination     : return this._getNextStateOnTapWhenChoosingFlareDestination(gridIndex);
                    case State.ChoosingSiloDestination      : return this._getNextStateOnTapWhenChoosingSiloDestination(gridIndex);
                    case State.ChoosingProductionTarget     : return this._getNextStateOnTapWhenChoosingProductionTarget(gridIndex);
                    case State.PreviewingUnitAttackableArea : return this._getNextStateOnTapWhenPreviewingUnitAttackableArea(gridIndex);
                    case State.PreviewingUnitMovableArea    : return this._getNextStateOnTapWhenPreviewingUnitMovableArea(gridIndex);
                    case State.PreviewingUnitVisibleArea    : return this._getNextStateOnTapWhenPreviewingUnitVisibleArea(gridIndex);
                    case State.PreviewingTileAttackableArea : return this._getNextStateOnTapWhenPreviewingTileAttackableArea(gridIndex);
                    default                                 : throw Helpers.newError(`BwActionPlanner._getNextStateOnTap() invalid currState!`);
                }
            }
        }
        protected abstract _getNextStateOnTapWhenIdle(gridIndex: GridIndex): State;
        private _getNextStateOnTapWhenMakingMovePath(gridIndex: GridIndex): State {
            const existingUnit = this._getUnitMap().getVisibleUnitOnMap(gridIndex);
            if (WarHelpers.WarCommonHelpers.checkAreaHasGrid(Helpers.getExisted(this.getMovableArea()), gridIndex)) {
                if (!existingUnit) {
                    if (!Twns.User.UserModel.getSelfSettingsIsSetPathMode()) {
                        return State.ChoosingAction;
                    } else {
                        const previousGridIndex = this.getCursor().getPreviousGridIndex();
                        if ((previousGridIndex) && (GridIndexHelpers.checkIsEqual(gridIndex, previousGridIndex))) {
                            return State.ChoosingAction;
                        } else {
                            return State.MakingMovePath;
                        }
                    }
                } else {
                    if (!this._checkCanControlUnit(existingUnit)) {
                        if (existingUnit.checkHasWeapon()) {
                            return State.PreviewingUnitAttackableArea;
                        } else {
                            return State.PreviewingUnitMovableArea;
                        }
                    } else {
                        const focusUnit = Helpers.getExisted(this.getFocusUnit());
                        if ((focusUnit === this.getFocusUnitLoaded()) && (GridIndexHelpers.checkIsEqual(gridIndex, focusUnit.getGridIndex()))) {
                            return State.MakingMovePath;
                        } else {
                            if ((focusUnit === existingUnit) || (focusUnit.checkCanJoinUnit(existingUnit)) || (existingUnit.checkCanLoadUnit(focusUnit))) {
                                return State.ChoosingAction;
                            } else {
                                if (existingUnit.getActionState() === UnitState.Idle) {
                                    return State.MakingMovePath;
                                } else {
                                    if (existingUnit.checkHasWeapon()) {
                                        return State.PreviewingUnitAttackableArea;
                                    } else {
                                        return State.PreviewingUnitMovableArea;
                                    }
                                }
                            }
                        }
                    }
                }
            } else {
                if (this._checkCanFocusUnitOnMapAttackTarget(gridIndex)) {
                    const previousGridIndex = this.getCursor().getPreviousGridIndex();
                    if ((previousGridIndex == null) || (!GridIndexHelpers.checkIsEqual(gridIndex, previousGridIndex))) {
                        return State.MakingMovePath;
                    } else {
                        if (Helpers.getExisted(this.getFocusUnit()).checkCanAttackTargetAfterMovePath(this.getMovePath(), gridIndex)) {
                            if (existingUnit) {
                                return State.RequestingUnitAttackUnit;
                            } else {
                                return State.RequestingUnitAttackTile;
                            }
                        } else {
                            return State.MakingMovePath;
                        }
                    }
                } else {
                    if (this.getFocusUnitLoaded()) {
                        return State.ChoosingAction;
                    } else {
                        if (!existingUnit) {
                            if (this._getTileMap().getTile(gridIndex).checkIsMapWeapon()) {
                                return State.PreviewingTileAttackableArea;
                            } else {
                                return State.Idle;
                            }
                        } else {
                            if ((this._checkCanControlUnit(existingUnit)) && (existingUnit.getActionState() === UnitState.Idle)) {
                                return State.MakingMovePath;
                            } else {
                                if (existingUnit.checkHasWeapon()) {
                                    return State.PreviewingUnitAttackableArea;
                                } else {
                                    return State.PreviewingUnitMovableArea;
                                }
                            }
                        }
                    }
                }
            }
        }
        private _getNextStateOnTapWhenChoosingAction(gridIndex: GridIndex): State {
            if (this.getChosenUnitsForDrop().length) {
                return State.ChoosingDropDestination;
            } else {
                // return State.MakingMovePath;
                const existingUnit      = this._getUnitMap().getVisibleUnitOnMap(gridIndex);
                const selfPlayerIndex   = this._getWar().getPlayerIndexInTurn();
                if (WarHelpers.WarCommonHelpers.checkAreaHasGrid(Helpers.getExisted(this.getMovableArea()), gridIndex)) {
                    if (!existingUnit) {
                        if (!Twns.User.UserModel.getSelfSettingsIsSetPathMode()) {
                            return State.ChoosingAction;
                        } else {
                            const previousGridIndex = this.getCursor().getPreviousGridIndex();
                            if ((previousGridIndex) && (GridIndexHelpers.checkIsEqual(gridIndex, previousGridIndex))) {
                                return State.ChoosingAction;
                            } else {
                                return State.MakingMovePath;
                            }
                        }
                    } else {
                        if (existingUnit.getPlayerIndex() !== selfPlayerIndex) {
                            if (existingUnit.checkHasWeapon()) {
                                return State.PreviewingUnitAttackableArea;
                            } else {
                                return State.PreviewingUnitMovableArea;
                            }
                        } else {
                            const focusUnit = Helpers.getExisted(this.getFocusUnit());
                            if ((focusUnit === this.getFocusUnitLoaded()) && (GridIndexHelpers.checkIsEqual(gridIndex, focusUnit.getGridIndex()))) {
                                return State.MakingMovePath;
                            } else {
                                if ((focusUnit === existingUnit) || (focusUnit.checkCanJoinUnit(existingUnit)) || (existingUnit.checkCanLoadUnit(focusUnit))) {
                                    return State.ChoosingAction;
                                } else {
                                    if (existingUnit.getActionState() === UnitState.Idle) {
                                        return State.MakingMovePath;
                                    } else {
                                        if (existingUnit.checkHasWeapon()) {
                                            return State.PreviewingUnitAttackableArea;
                                        } else {
                                            return State.PreviewingUnitMovableArea;
                                        }
                                    }
                                }
                            }
                        }
                    }
                } else {
                    if (this._checkCanFocusUnitOnMapAttackTarget(gridIndex)) {
                        const previousGridIndex = this.getCursor().getPreviousGridIndex();
                        if ((previousGridIndex == null) || (!GridIndexHelpers.checkIsEqual(gridIndex, previousGridIndex))) {
                            return State.MakingMovePath;
                        } else {
                            if (Helpers.getExisted(this.getFocusUnit()).checkCanAttackTargetAfterMovePath(this.getMovePath(), gridIndex)) {
                                if (existingUnit) {
                                    return State.RequestingUnitAttackUnit;
                                } else {
                                    return State.RequestingUnitAttackTile;
                                }
                            } else {
                                return State.MakingMovePath;
                            }
                        }
                    } else {
                        if (this.getFocusUnitLoaded()) {
                            return State.ChoosingAction;
                        } else {
                            if (!existingUnit) {
                                if (this._getTileMap().getTile(gridIndex).checkIsMapWeapon()) {
                                    return State.PreviewingTileAttackableArea;
                                } else {
                                    return State.Idle;
                                }
                            } else {
                                if ((existingUnit.getPlayerIndex() === selfPlayerIndex) && (existingUnit.getActionState() === UnitState.Idle)) {
                                    return State.MakingMovePath;
                                } else {
                                    if (existingUnit.checkHasWeapon()) {
                                        return State.PreviewingUnitAttackableArea;
                                    } else {
                                        return State.PreviewingUnitMovableArea;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        protected abstract _getNextStateOnTapWhenChoosingAttackTarget(gridIndex: GridIndex): State;
        protected abstract _getNextStateOnTapWhenChoosingDropDestination(gridIndex: GridIndex): State;
        protected abstract _getNextStateOnTapWhenChoosingFlareDestination(gridIndex: GridIndex): State;
        protected abstract _getNextStateOnTapWhenChoosingSiloDestination(gridIndex: GridIndex): State;
        protected abstract _getNextStateOnTapWhenChoosingProductionTarget(gridIndex: GridIndex): State;
        protected abstract _getNextStateOnTapWhenPreviewingUnitAttackableArea(gridIndex: GridIndex): State;
        protected abstract _getNextStateOnTapWhenPreviewingUnitMovableArea(gridIndex: GridIndex): State;
        protected abstract _getNextStateOnTapWhenPreviewingUnitVisibleArea(gridIndex: GridIndex): State;
        protected abstract _getNextStateOnTapWhenPreviewingTileAttackableArea(gridIndex: GridIndex): State;

        private _getNextStateOnDrag(gridIndex: GridIndex): State {
            const currState = this.getState();
            if (currState === State.ChoosingProductionTarget) {
                return State.Idle;
            } else if (currState === State.ChoosingAction) {
                if (this.getChosenUnitsForDrop().length) {
                    return State.ChoosingAction;
                } else {
                    return State.MakingMovePath;
                }
            } else {
                return currState;
            }
        }

        private _getNextStateOnDragEnded(gridIndex: GridIndex): State {
            const currState = this.getState();
            if (currState === State.MakingMovePath) {
                return this._getNextStateOnDragEndedWhenMakingMovePath(gridIndex);
            } else {
                return currState;
            }
        }
        private _getNextStateOnDragEndedWhenMakingMovePath(gridIndex: GridIndex): State {
            if (WarHelpers.WarCommonHelpers.checkAreaHasGrid(Helpers.getExisted(this.getMovableArea()), gridIndex)) {
                const existingUnit = this._getUnitMap().getVisibleUnitOnMap(gridIndex);
                if (!existingUnit) {
                    if (!Twns.User.UserModel.getSelfSettingsIsSetPathMode()) {
                        return State.ChoosingAction;
                    } else {
                        return State.MakingMovePath;
                    }
                } else {
                    if (!this._checkCanControlUnit(existingUnit)) {
                        return State.MakingMovePath;
                    } else {
                        const focusUnit = Helpers.getExisted(this.getFocusUnit());
                        if ((focusUnit === this.getFocusUnitLoaded()) && (GridIndexHelpers.checkIsEqual(gridIndex, focusUnit.getGridIndex()))) {
                            return State.MakingMovePath;
                        } else {
                            if ((focusUnit === existingUnit) || (focusUnit.checkCanJoinUnit(existingUnit)) || (existingUnit.checkCanLoadUnit(focusUnit))) {
                                return State.ChoosingAction;
                            } else {
                                return State.MakingMovePath;
                            }
                        }
                    }
                }
            } else {
                return State.MakingMovePath;
            }
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Functions for generating actions for the focused unit.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        protected _getDataForUnitActionsPanel(): BaseWar.OpenDataForBwUnitActionsPanel {
            const destination           = this.getMovePathDestination();
            const actionUnitBeLoaded    = this._getActionUnitBeLoaded();
            const war                   = this._getWar();
            if (actionUnitBeLoaded.length) {
                return {
                    war,
                    destination,
                    actionList: actionUnitBeLoaded
                };
            }

            const actionUnitJoin = this._getActionUnitJoin();
            if (actionUnitJoin.length) {
                return {
                    war,
                    destination,
                    actionList: actionUnitJoin
                };
            }

            const dataList: DataForUnitAction[] = [];
            dataList.push(...this._getActionUnitUseCoSuperPower());
            dataList.push(...this._getActionUnitUseCoPower());
            dataList.push(...this._getActionUnitLoadCo());
            dataList.push(...this._getActionUnitAttack());
            dataList.push(...this._getActionUnitCapture());
            dataList.push(...this._getActionUnitDive());
            dataList.push(...this._getActionUnitSurface());
            dataList.push(...this._getActionUnitSupply());
            dataList.push(...this._getActionsUnitLaunchUnit());
            dataList.push(...this._getActionsUnitDropUnit());
            dataList.push(...this._getActionUnitBuildTile());
            dataList.push(...this._getActionUnitLaunchFlare());
            dataList.push(...this._getActionUnitLaunchSilo());
            dataList.push(...this._getActionUnitProduceUnit());
            dataList.push(...this._getActionUnitWait(dataList.length > 0));

            Logger.assert(!!dataList.length, `BwActionPlanner._getDataForUnitActionsPanel() no actions available?!`);
            return {
                war,
                destination,
                actionList: dataList,
            };
        }

        protected abstract _getActionUnitBeLoaded(): DataForUnitAction[];
        protected abstract _getActionUnitJoin(): DataForUnitAction[];
        protected abstract _getActionUnitUseCoSuperPower(): DataForUnitAction[];
        protected abstract _getActionUnitUseCoPower(): DataForUnitAction[];
        protected abstract _getActionUnitLoadCo(): DataForUnitAction[];
        private _getActionUnitAttack(): DataForUnitAction[] {
            return this._createAttackableGridsAfterMove().length
                ? [{ actionType: UnitActionType.Attack, callback: () => this._setStateChoosingAttackTargetOnChooseAction() }]
                : [];
        }
        protected abstract _getActionUnitCapture(): DataForUnitAction[];
        protected abstract _getActionUnitDive(): DataForUnitAction[];
        protected abstract _getActionUnitSurface(): DataForUnitAction[];
        protected abstract _getActionUnitBuildTile(): DataForUnitAction[];
        protected abstract _getActionUnitSupply(): DataForUnitAction[];
        private _getActionsUnitLaunchUnit(): DataForUnitAction[] {
            const dataList  : DataForUnitAction[] = [];
            const focusUnit = Helpers.getExisted(this.getFocusUnit());
            if ((focusUnit !== this.getFocusUnitLoaded()) && (this.getMovePath().length === 1) && (focusUnit.checkCanLaunchLoadedUnit())) {
                const tile = this._getTileMap().getTile(this.getMovePathDestination());
                for (const unit of focusUnit.getLoadedUnits()) {
                    if ((unit.getActionState() === UnitState.Idle) && (tile.getMoveCostByUnit(unit) != null)) {
                        dataList.push({
                            actionType      : UnitActionType.LaunchUnit,
                            callback        : () => this._setStateMakingMovePathOnChooseAction(unit),
                            unitForLaunch   : unit,
                        });
                    }
                }
            }
            return dataList;
        }
        private _getActionsUnitDropUnit(): DataForUnitAction[] {
            const focusUnit                 = Helpers.getExisted(this.getFocusUnit());
            const destination               = this.getMovePathDestination();
            const loadedUnits               = focusUnit.getLoadedUnits();
            const chosenUnits               = this.getChosenUnitsForDrop();
            const chosenDropDestinations    = this._getChosenDropDestinations();
            const actions                   : DataForUnitAction[] = [];
            if ((loadedUnits.length > chosenUnits.length) && (focusUnit.checkCanDropLoadedUnit(this._getTileMap().getTile(destination).getType()))) {
                for (const unit of loadedUnits) {
                    if ((chosenUnits.every(value => value.unit !== unit)) && (this._calculateAvailableDropDestination(unit, chosenDropDestinations).length)) {
                        actions.push({
                            actionType  : UnitActionType.DropUnit,
                            callback    : () => this._setStateChoosingDropDestinationOnChooseAction(unit),
                            unitForDrop : unit,
                        });
                    }
                }
            }
            return actions;
        }
        private _getActionUnitLaunchFlare(): DataForUnitAction[] {
            if ((!this._getWar().getFogMap().checkHasFogCurrently())            ||
                (this.getMovePath().length !== 1)                               ||
                (!Helpers.getExisted(this.getFocusUnit()).getFlareCurrentAmmo())
            ) {
                return [];
            } else {
                return [{ actionType: UnitActionType.LaunchFlare, callback: () => this._setStateChoosingFlareDestinationOnChooseAction() }];
            }
        }
        private _getActionUnitLaunchSilo(): DataForUnitAction[] {
            return (Helpers.getExisted(this.getFocusUnit()).checkCanLaunchSiloOnTile(this._getTileMap().getTile(this.getMovePathDestination())))
                ? [{ actionType: UnitActionType.LaunchSilo, callback: () => this._setStateChoosingSiloDestinationOnChooseAction() }]
                : [];
        }
        protected abstract _getActionUnitProduceUnit(): DataForUnitAction[];
        protected abstract _getActionUnitWait(hasOtherAction: boolean): DataForUnitAction[];

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Other functions.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        protected _getMoveCost(targetGridIndex: GridIndex, movingUnit: BwUnit): number | null {
            if (!GridIndexHelpers.checkIsInsideMap(targetGridIndex, this.getMapSize())) {
                return null;
            } else {
                const existingUnit  = this._getUnitMap().getUnitOnMap(targetGridIndex);
                const teamIndex     = movingUnit.getTeamIndex();
                if ((existingUnit)                                      &&
                    (existingUnit.getTeamIndex() !== teamIndex)         &&
                    (WarVisibilityHelpers.checkIsUnitOnMapVisibleToTeam({
                        war                 : this._getWar(),
                        gridIndex           : targetGridIndex,
                        unitType            : existingUnit.getUnitType(),
                        isDiving            : existingUnit.getIsDiving(),
                        unitPlayerIndex     : existingUnit.getPlayerIndex(),
                        observerTeamIndex   : teamIndex,
                    }))
                ) {
                    return null;
                } else {
                    return this._getTileMap().getTile(targetGridIndex).getMoveCostByUnit(movingUnit);
                }
            }
        }

        protected _checkCanFocusUnitOnMapAttackTarget(gridIndex: GridIndex): boolean {
            const attackableArea = Helpers.getExisted(this.getAttackableArea());
            if (!WarHelpers.WarCommonHelpers.checkAreaHasGrid(attackableArea, gridIndex)) {
                return false;
            } else {
                const focusUnit = Helpers.getExisted(this.getFocusUnit());
                if (focusUnit.checkCanAttackTargetAfterMovePath(this.getMovePath(), gridIndex)) {
                    return true;
                } else {
                    return focusUnit.checkCanAttackTargetAfterMovePath(
                        WarHelpers.WarCommonHelpers.createShortestMovePath(Helpers.getExisted(this.getMovableArea()), attackableArea[gridIndex.x][gridIndex.y].movePathDestination),
                        gridIndex
                    );
                }
            }
        }

        protected _calculateAvailableDropDestination(unitForDrop: BwUnit, chosenDropDestinations: GridIndex[]): GridIndex[] {
            const loader                = this.getFocusUnit();
            const loaderEndingGridIndex = this.getMovePathDestination();
            const tileMap               = this._getTileMap();
            const unitMap               = this._getUnitMap();
            const destinations          = new Array<GridIndex>();
            if (tileMap.getTile(loaderEndingGridIndex).getMoveCostByUnit(unitForDrop) != null) {
                for (const gridIndex of GridIndexHelpers.getAdjacentGrids(loaderEndingGridIndex, this.getMapSize())) {
                    const existingUnit = unitMap.getUnitOnMap(gridIndex);
                    if ((tileMap.getTile(gridIndex).getMoveCostByUnit(unitForDrop) != null)                 &&
                        (chosenDropDestinations.every(g => !GridIndexHelpers.checkIsEqual(g, gridIndex)))   &&
                        ((!existingUnit) || (existingUnit === loader))
                    ) {
                        destinations.push(gridIndex);
                    }
                }
            }
            return destinations;
        }
    }
}

// export default TwnsBwActionPlanner;
