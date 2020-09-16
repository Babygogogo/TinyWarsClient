
namespace TinyWars.SingleCustomWar {
    import Notify               = Utility.Notify;
    import Lang                 = Utility.Lang;
    import StageManager         = Utility.StageManager;
    import Types                = Utility.Types;
    import VisibilityHelpers    = Utility.VisibilityHelpers;
    import CommonModel          = Common.CommonModel;

    const _CELL_WIDTH           = 80;
    const _LEFT_X               = 80;
    const _RIGHT_X              = 880;

    export class ScwUnitBriefPanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Hud0;
        protected readonly _IS_EXCLUSIVE = false;

        private static _instance: ScwUnitBriefPanel;

        private _group      : eui.Group;
        private _cellList   : ScwUnitBriefCell[] = [];

        private _war        : ScwWar;
        private _cursor     : ScwCursor;
        private _unitMap    : ScwUnitMap;
        private _unitList   : ScwUnit[] = [];
        private _isLeftSide = true;

        public static show(): void {
            if (!ScwUnitBriefPanel._instance) {
                ScwUnitBriefPanel._instance = new ScwUnitBriefPanel();
            }
            ScwUnitBriefPanel._instance.open();
        }
        public static hide(): void {
            if (ScwUnitBriefPanel._instance) {
                ScwUnitBriefPanel._instance.close();
            }
        }
        public static getInstance(): ScwUnitBriefPanel {
            return ScwUnitBriefPanel._instance;
        }

        public constructor() {
            super();

            this._setAutoAdjustHeightEnabled();
            this.skinName = `resource/skins/multiCustomWar/McwUnitBriefPanel.exml`;
        }

        protected _onFirstOpened(): void {
            this._notifyListeners = [
                { type: Notify.Type.GlobalTouchBegin,               callback: this._onNotifyGlobalTouchBegin },
                { type: Notify.Type.GlobalTouchMove,                callback: this._onNotifyGlobalTouchMove },
                { type: Notify.Type.BwCursorGridIndexChanged,       callback: this._onNotifyBwCursorGridIndexChanged },
                { type: Notify.Type.BwActionPlannerStateChanged,    callback: this._onNotifyBwActionPlannerStateChanged },
                { type: Notify.Type.McwWarMenuPanelOpened,          callback: this._onNotifyMcwWarMenuPanelOpened },
                { type: Notify.Type.McwWarMenuPanelClosed,          callback: this._onNotifyMcwWarMenuPanelClosed },
                { type: Notify.Type.BwCoListPanelOpened,            callback: this._onNotifyBwCoListPanelOpened },
                { type: Notify.Type.BwCoListPanelClosed,            callback: this._onNotifyBwCoListPanelClosed },
                { type: Notify.Type.McwProduceUnitPanelOpened,      callback: this._onNotifyMcwProduceUnitPanelOpened },
                { type: Notify.Type.McwProduceUnitPanelClosed,      callback: this._onNotifyMcwProduceUnitPanelClosed },
                { type: Notify.Type.UnitAnimationTick,              callback: this._onNotifyUnitAnimationTick },
            ];
        }
        protected _onOpened(): void {
            this._war       = ScwModel.getWar();
            this._unitMap   = this._war.getUnitMap() as ScwUnitMap;
            this._cursor    = this._war.getField().getCursor() as ScwCursor;

            this._updateView();
        }
        protected _onClosed(): void {
            delete this._war;
            delete this._unitMap;
            delete this._cursor;

            for (const cell of this._cellList) {
                this._destroyCell(cell);
            }
            this._cellList.length = 0;
            this._unitList.length = 0;
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Callbacks.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _onNotifyGlobalTouchBegin(e: egret.Event): void {
            this._adjustPositionOnTouch(e.data);
        }
        private _onNotifyGlobalTouchMove(e: egret.Event): void {
            this._adjustPositionOnTouch(e.data);
        }
        private _onNotifyBwCursorGridIndexChanged(e: egret.Event): void {
            this._updateView();
        }
        private _onNotifyBwActionPlannerStateChanged(e: egret.Event): void {
            const planner = this._war.getActionPlanner();
            if ((planner.getPreviousState() === Types.ActionPlannerState.ExecutingAction) &&
                (planner.getState() !== Types.ActionPlannerState.ExecutingAction)
            ) {
                this._updateView();
            }
        }
        private _onNotifyMcwWarMenuPanelOpened(e: egret.Event): void {
            this._updateView();
        }
        private _onNotifyMcwWarMenuPanelClosed(e: egret.Event): void {
            this._updateView();
        }
        private _onNotifyBwCoListPanelOpened(e: egret.Event): void {
            this._updateView();
        }
        private _onNotifyBwCoListPanelClosed(e: egret.Event): void {
            this._updateView();
        }
        private _onNotifyMcwProduceUnitPanelOpened(e: egret.Event): void {
            this._updateView();
        }
        private _onNotifyMcwProduceUnitPanelClosed(e: egret.Event): void {
            this._updateView();
        }
        private _onNotifyUnitAnimationTick(e: egret.Event): void {
            for (const cell of this._cellList) {
                cell.updateOnAnimationTick();
            }
        }

        private _onCellTouchTap(e: egret.TouchEvent): void {
            for (let i = 0; i < this._cellList.length; ++i) {
                if (this._cellList[i] === e.currentTarget) {
                    BaseWar.BwUnitDetailPanel.show({ unit: this._unitList[i] });
                    return;
                }
            }
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Functions for view.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _updateView(): void {
            if ((ScwWarMenuPanel.getIsOpening()) || (ScwProduceUnitPanel.getIsOpening()) || (ScwCoListPanel.getIsOpening())) {
                this.visible = false;
            } else {
                this.visible = true;

                const unitList  = this._unitList;
                unitList.length = 0;

                const gridIndex     = this._cursor.getGridIndex();
                const unitOnMap     = this._unitMap.getUnitOnMap(gridIndex) as ScwUnit;
                const war           = this._war;
                const teamIndexes   = (war.getPlayerManager() as ScwPlayerManager).getWatcherTeamIndexesForSelf();

                if ((unitOnMap)                                         &&
                    (VisibilityHelpers.checkIsUnitOnMapVisibleToTeams({
                        war,
                        gridIndex,
                        unitType: unitOnMap.getType(),
                        isDiving: unitOnMap.getIsDiving(),
                        unitPlayerIndex: unitOnMap.getPlayerIndex(),
                        observerTeamIndexes: teamIndexes
                    }))
                ) {
                    unitList.push(unitOnMap);

                    if ((!war.getFogMap().checkHasFogCurrently())   ||
                        (teamIndexes.has(unitOnMap.getTeamIndex()))
                    ) {
                        for (const loadedUnit of this._unitMap.getUnitsLoadedByLoader(unitOnMap, true)) {
                            unitList.push(loadedUnit as ScwUnit);
                        }
                    }
                }

                this._group.removeChildren();
                const cellList      = this._cellList;
                const length        = unitList.length;
                this._group.width   = length * _CELL_WIDTH;
                for (let i = 0; i < length; ++i) {
                    cellList[i] = cellList[i] || this._createCell();
                    cellList[i].setUnit(unitList[i]);
                    this._group.addChild(cellList[i]);
                }

                this._updatePosition();
            }
        }

        private _adjustPositionOnTouch(e: egret.TouchEvent): void {
            const tileBriefPanel = ScwTileBriefPanel.getInstance();
            const unitBriefPanel = this;
            let target = e.target as egret.DisplayObject;
            while (target) {
                if ((target) && ((target === tileBriefPanel) || (target === unitBriefPanel))) {
                    return;
                }
                target = target.parent;
            }

            const stageWidth = StageManager.getStage().stageWidth;
            if (e.stageX >= stageWidth / 4 * 3) {
                if (!this._isLeftSide) {
                    this._isLeftSide = true;
                    this._updatePosition();
                }
            } else if (e.stageX < stageWidth / 4) {
                if (this._isLeftSide) {
                    this._isLeftSide = false;
                    this._updatePosition();
                }
            }
        }

        private _updatePosition(): void {
            const isLeftSide    = this._isLeftSide;
            const cellList      = this._cellList;
            const length        = this._unitList.length;
            this._group.x       = isLeftSide ? _LEFT_X : _RIGHT_X - _CELL_WIDTH * length;
            for (let i = 0; i < length; ++i) {
                cellList[i].x = isLeftSide ? _CELL_WIDTH * i : (length - 1 - i) * _CELL_WIDTH;
            }
        }

        private _createCell(): ScwUnitBriefCell {
            const cell = new ScwUnitBriefCell();
            cell.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onCellTouchTap, this);
            return cell;
        }
        private _destroyCell(cell: ScwUnitBriefCell) {
            cell.removeEventListener(egret.TouchEvent.TOUCH_TAP, this._onCellTouchTap, this);
        }
    }

    const _IMAGE_SOURCE_HP          = `c03_t99_s02_f03`;
    const _IMAGE_SOURCE_FUEL        = `c03_t99_s02_f01`;
    const _IMAGE_SOURCE_AMMO        = `c03_t99_s02_f02`;
    const _IMAGE_SOURCE_MATERIAL    = `c03_t99_s02_f04`;
    const _IMAGE_SOURCE_FLARE       = `c03_t99_s02_f02`;

    class ScwUnitBriefCell extends eui.Component {
        private _group          : eui.Group;
        private _conUnitView    : eui.Group;
        private _labelName      : GameUi.UiLabel;
        private _labelHp        : GameUi.UiLabel;
        private _labelFuel      : GameUi.UiLabel;
        private _labelState     : GameUi.UiLabel;
        private _imgHp          : GameUi.UiImage;
        private _imgFuel        : GameUi.UiImage;
        private _imgState       : GameUi.UiImage;
        private _unitView       : ScwUnitView;

        private _unit               : ScwUnit;
        private _isChildrenCreated  = false;

        public constructor() {
            super();

            this.skinName = `resource/skins/multiCustomWar/McwUnitBriefCell.exml`;
        }

        protected childrenCreated(): void {
            super.childrenCreated();

            this._isChildrenCreated = true;

            this._imgHp.source      = CommonModel.getUnitAndTileTexturePrefix() + _IMAGE_SOURCE_HP;
            this._imgFuel.source    = CommonModel.getUnitAndTileTexturePrefix() + _IMAGE_SOURCE_FUEL;
            this._unitView          = new ScwUnitView();
            this._conUnitView.addChild(this._unitView);
            this._updateView();
        }

        public setUnit(unit: ScwUnit): void {
            this._unit = unit;
            this._updateView();
        }

        public updateOnAnimationTick(): void {
            if (this._isChildrenCreated) {
                this._unitView.tickUnitAnimationFrame();
                this._unitView.tickStateAnimationFrame();
            }
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Functions for view.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _updateView(): void {
            if (this._isChildrenCreated) {
                const unit = this._unit;
                this._unitView.init(unit).startRunningView();
                this._labelHp.text      = `${unit.getCurrentHp()}`;
                this._labelFuel.text    = `${unit.getCurrentFuel()}`;
                this._labelName.text    = Lang.getUnitName(unit.getType());

                if (unit.getCurrentBuildMaterial() != null) {
                    this._imgState.visible      = true;
                    this._imgState.source       = CommonModel.getUnitAndTileTexturePrefix() + _IMAGE_SOURCE_MATERIAL;
                    this._labelState.visible    = true;
                    this._labelState.text       = `${unit.getCurrentBuildMaterial()}`;
                } else if (unit.getCurrentProduceMaterial() != null) {
                    this._imgState.visible      = true;
                    this._imgState.source       = CommonModel.getUnitAndTileTexturePrefix() + _IMAGE_SOURCE_MATERIAL;
                    this._labelState.visible    = true;
                    this._labelState.text       = `${unit.getCurrentProduceMaterial()}`;
                } else if (unit.getFlareCurrentAmmo() != null) {
                    this._imgState.visible      = true;
                    this._imgState.source       = CommonModel.getUnitAndTileTexturePrefix() + _IMAGE_SOURCE_FLARE;
                    this._labelState.visible    = true;
                    this._labelState.text       = `${unit.getFlareCurrentAmmo()}`;
                } else if (unit.getPrimaryWeaponCurrentAmmo() != null) {
                    this._imgState.visible      = true;
                    this._imgState.source       = CommonModel.getUnitAndTileTexturePrefix() + _IMAGE_SOURCE_AMMO;
                    this._labelState.visible    = true;
                    this._labelState.text       = `${unit.getPrimaryWeaponCurrentAmmo()}`;
                } else {
                    this._imgState.visible      = false;
                    this._labelState.visible    = false;
                }
            }
        }
    }
}
