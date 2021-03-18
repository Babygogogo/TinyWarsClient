
namespace TinyWars.BaseWar {
    import Tween                = egret.Tween;
    import Notify               = Utility.Notify;
    import Lang                 = Utility.Lang;
    import StageManager         = Utility.StageManager;
    import Types                = Utility.Types;
    import VisibilityHelpers    = Utility.VisibilityHelpers;
    import GridIndexHelpers     = Utility.GridIndexHelpers;
    import CommonModel          = Common.CommonModel;

    const _CELL_WIDTH           = 80;

    type OpenDataForBwUnitBriefPanel = {
        war : BwWar;
    }

    export class BwUnitBriefPanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Hud0;
        protected readonly _IS_EXCLUSIVE = false;

        private static _instance: BwUnitBriefPanel;

        private _group      : eui.Group;
        private _cellList   : BwUnitBriefCell[] = [];

        private _unitList   : BaseWar.BwUnit[] = [];
        private _isLeftSide = true;

        public static show(openData: OpenDataForBwUnitBriefPanel): void {
            if (!BwUnitBriefPanel._instance) {
                BwUnitBriefPanel._instance = new BwUnitBriefPanel();
            }
            BwUnitBriefPanel._instance.open(openData);
        }
        public static async hide(): Promise<void> {
            if (BwUnitBriefPanel._instance) {
                await BwUnitBriefPanel._instance.close();
            }
        }
        public static getInstance(): BwUnitBriefPanel {
            return BwUnitBriefPanel._instance;
        }

        public constructor() {
            super();

            this.skinName = `resource/skins/baseWar/BwUnitBriefPanel.exml`;
        }

        protected _onOpened(): void {
            this._setNotifyListenerArray([
                { type: Notify.Type.GlobalTouchBegin,               callback: this._onNotifyGlobalTouchBegin },
                { type: Notify.Type.GlobalTouchMove,                callback: this._onNotifyGlobalTouchMove },
                { type: Notify.Type.BwCursorGridIndexChanged,       callback: this._onNotifyBwCursorGridIndexChanged },
                { type: Notify.Type.BwActionPlannerStateChanged,    callback: this._onNotifyBwActionPlannerStateChanged },
                { type: Notify.Type.BwWarMenuPanelOpened,           callback: this._onNotifyBwWarMenuPanelOpened },
                { type: Notify.Type.BwWarMenuPanelClosed,           callback: this._onNotifyBwWarMenuPanelClosed },
                { type: Notify.Type.BwCoListPanelOpened,            callback: this._onNotifyBwCoListPanelOpened },
                { type: Notify.Type.BwCoListPanelClosed,            callback: this._onNotifyBwCoListPanelClosed },
                { type: Notify.Type.BwProduceUnitPanelOpened,       callback: this._onNotifyBwProduceUnitPanelOpened },
                { type: Notify.Type.BwProduceUnitPanelClosed,       callback: this._onNotifyBwProduceUnitPanelClosed },
                { type: Notify.Type.MeUnitChanged,                  callback: this._onNotifyMeUnitChanged },
                { type: Notify.Type.UnitAnimationTick,              callback: this._onNotifyUnitAnimationTick },
            ]);

            const group     = this._group;
            group.alpha     = 0;
            group.bottom    = -40;
            this._showOpenAnimation();

            this._updateView();
        }
        protected async _onClosed(): Promise<void> {
            await this._showCloseAnimation();

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
            const planner = this._getOpenData<OpenDataForBwUnitBriefPanel>().war.getActionPlanner();
            if ((planner.getPreviousState() === Types.ActionPlannerState.ExecutingAction) &&
                (planner.getState() !== Types.ActionPlannerState.ExecutingAction)
            ) {
                this._updateView();
            }
        }
        private _onNotifyBwWarMenuPanelOpened(e: egret.Event): void {
            this._updateView();
        }
        private _onNotifyBwWarMenuPanelClosed(e: egret.Event): void {
            this._updateView();
        }
        private _onNotifyBwCoListPanelOpened(e: egret.Event): void {
            this._updateView();
        }
        private _onNotifyBwCoListPanelClosed(e: egret.Event): void {
            this._updateView();
        }
        private _onNotifyBwProduceUnitPanelOpened(e: egret.Event): void {
            this._updateView();
        }
        private _onNotifyBwProduceUnitPanelClosed(e: egret.Event): void {
            this._updateView();
        }
        private _onNotifyMeUnitChanged(e: egret.Event): void {
            const data = e.data as Notify.Data.MeUnitChanged;
            if (GridIndexHelpers.checkIsEqual(data.gridIndex, this._getOpenData<OpenDataForBwUnitBriefPanel>().war.getField().getCursor().getGridIndex())) {
                this._updateView();
            }
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
            const war = this._getOpenData<OpenDataForBwUnitBriefPanel>().war;
            if ((war.getIsWarMenuPanelOpening())            ||
                (!war.getIsRunning())                       ||
                (BaseWar.BwProduceUnitPanel.getIsOpening()) ||
                (BaseWar.BwCoListPanel.getIsOpening())
            ) {
                this.visible = false;
            } else {
                this.visible = true;

                const unitList  = this._unitList;
                unitList.length = 0;

                const unitMap       = war.getUnitMap();
                const gridIndex     = war.getField().getCursor().getGridIndex();
                const unitOnMap     = unitMap.getUnitOnMap(gridIndex);
                const teamIndexes   = war.getPlayerManager().getAliveWatcherTeamIndexesForSelf();

                if ((unitOnMap)                                         &&
                    (VisibilityHelpers.checkIsUnitOnMapVisibleToTeams({
                        war,
                        gridIndex,
                        unitType            : unitOnMap.getUnitType(),
                        isDiving            : unitOnMap.getIsDiving(),
                        unitPlayerIndex     : unitOnMap.getPlayerIndex(),
                        observerTeamIndexes : teamIndexes
                    }))
                ) {
                    unitList.push(unitOnMap);

                    if ((!war.getFogMap().checkHasFogCurrently())   ||
                        (teamIndexes.has(unitOnMap.getTeamIndex()))
                    ) {
                        for (const loadedUnit of unitMap.getUnitsLoadedByLoader(unitOnMap, true)) {
                            unitList.push(loadedUnit);
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

        private async _adjustPositionOnTouch(e: egret.TouchEvent): Promise<void> {
            const tileBriefPanel = BaseWar.BwTileBriefPanel.getInstance();
            const unitBriefPanel = this;
            let target = e.target as egret.DisplayObject;
            while (target) {
                if ((target) && ((target === tileBriefPanel) || (target === unitBriefPanel))) {
                    return;
                }
                target = target.parent;
            }

            const stageWidth        = StageManager.getStage().stageWidth;
            const currentIsLeftSide = this._isLeftSide;
            const newIsLeftSide     = e.stageX >= stageWidth / 4 * 3
                ? true
                : (e.stageX < stageWidth / 4
                    ? false
                    : currentIsLeftSide
                );
            if (newIsLeftSide !== currentIsLeftSide) {
                await this._showCloseAnimation();
                this._isLeftSide = newIsLeftSide;
                this._updatePosition();
                this._showOpenAnimation();
            }
        }

        private _updatePosition(): void {
            const isLeftSide    = this._isLeftSide;
            const cellList      = this._cellList;
            const length        = this._unitList.length;
            this._group.x       = isLeftSide ? _CELL_WIDTH : StageManager.getStage().stageWidth - _CELL_WIDTH * (length + 1);
            for (let i = 0; i < length; ++i) {
                cellList[i].x = isLeftSide ? _CELL_WIDTH * i : (length - 1 - i) * _CELL_WIDTH;
            }
        }

        private _createCell(): BwUnitBriefCell {
            const cell = new BwUnitBriefCell();
            cell.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onCellTouchTap, this);
            return cell;
        }
        private _destroyCell(cell: BwUnitBriefCell) {
            cell.removeEventListener(egret.TouchEvent.TOUCH_TAP, this._onCellTouchTap, this);
        }

        private _showOpenAnimation(): void {
            const group = this._group;
            Tween.removeTweens(group);
            Tween.get(group)
                .to({ bottom: 0, alpha: 1 }, 50);
        }
        private _showCloseAnimation(): Promise<void> {
            return new Promise<void>(resolve => {
                const group = this._group;
                Tween.removeTweens(group);
                Tween.get(group)
                    .to({ bottom: -40, alpha: 0 }, 50)
                    .call(() => resolve());
            });
        }
    }

    const _IMAGE_SOURCE_HP          = `c03_t99_s02_f03`;
    const _IMAGE_SOURCE_FUEL        = `c03_t99_s02_f01`;
    const _IMAGE_SOURCE_AMMO        = `c03_t99_s02_f02`;
    const _IMAGE_SOURCE_MATERIAL    = `c03_t99_s02_f04`;
    const _IMAGE_SOURCE_FLARE       = `c03_t99_s02_f02`;

    class BwUnitBriefCell extends eui.Component {
        private _group          : eui.Group;
        private _conUnitView    : eui.Group;
        private _labelName      : GameUi.UiLabel;
        private _labelHp        : GameUi.UiLabel;
        private _labelFuel      : GameUi.UiLabel;
        private _labelState     : GameUi.UiLabel;
        private _imgHp          : GameUi.UiImage;
        private _imgFuel        : GameUi.UiImage;
        private _imgState       : GameUi.UiImage;
        private _unitView       : BaseWar.BwUnitView;

        private _unit               : BaseWar.BwUnit;
        private _isChildrenCreated  = false;

        public constructor() {
            super();

            this.skinName = `resource/skins/baseWar/BwUnitBriefCell.exml`;
        }

        protected childrenCreated(): void {
            super.childrenCreated();

            this._isChildrenCreated = true;

            this._imgHp.source      = CommonModel.getUnitAndTileTexturePrefix() + _IMAGE_SOURCE_HP;
            this._imgFuel.source    = CommonModel.getUnitAndTileTexturePrefix() + _IMAGE_SOURCE_FUEL;
            this._unitView          = new BaseWar.BwUnitView();
            this._conUnitView.addChild(this._unitView);
            this._updateView();
        }

        public setUnit(unit: BaseWar.BwUnit): void {
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
                this._labelName.text    = Lang.getUnitName(unit.getUnitType());

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
