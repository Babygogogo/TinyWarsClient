
// import TwnsCommonCoListPanel    from "../../common/view/CommonCoListPanel";
// import CommonConstants          from "../../tools/helpers/CommonConstants";
// import GridIndexHelpers         from "../../tools/helpers/GridIndexHelpers";
// import Helpers                  from "../../tools/helpers/Helpers";
// import SoundManager             from "../../tools/helpers/SoundManager";
// import StageManager             from "../../tools/helpers/StageManager";
// import Types                    from "../../tools/helpers/Types";
// import Lang                     from "../../tools/lang/Lang";
// import NotifyData               from "../../tools/notify/NotifyData";
// import TwnsNotifyType           from "../../tools/notify/NotifyType";
// import TwnsUiImage              from "../../tools/ui/UiImage";
// import TwnsUiLabel              from "../../tools/ui/UiLabel";
// import TwnsUiPanel              from "../../tools/ui/UiPanel";
// import WarVisibilityHelpers     from "../../tools/warHelpers/WarVisibilityHelpers";
// import TwnsBwUnit               from "../model/BwUnit";
// import TwnsBwWar                from "../model/BwWar";
// import TwnsBwProduceUnitPanel   from "./BwProduceUnitPanel";
// import TwnsBwUnitDetailPanel    from "./BwUnitDetailPanel";
// import TwnsBwUnitView           from "./BwUnitView";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace TwnsBwUnitBriefPanel {
    import BwWar                = TwnsBwWar.BwWar;
    import NotifyType           = TwnsNotifyType.NotifyType;
    import BwUnit               = TwnsBwUnit.BwUnit;

    const _CELL_WIDTH           = 70;

    export type OpenData = {
        war : BwWar;
    };
    // eslint-disable-next-line no-shadow
    export class BwUnitBriefPanel extends TwnsUiPanel.UiPanel<OpenData> {
        private readonly _group!    : eui.Group;
        private _cellList           : BwUnitBriefCell[] = [];

        private _unitList   : BwUnit[] = [];
        private _isLeftSide = true;

        protected _onOpening(): void {
            this._setNotifyListenerArray([
                // { type: NotifyType.GlobalTouchBegin,                callback: this._onNotifyGlobalTouchBegin },
                // { type: NotifyType.GlobalTouchMove,                 callback: this._onNotifyGlobalTouchMove },
                { type: NotifyType.BwCursorGridIndexChanged,        callback: this._onNotifyBwCursorGridIndexChanged },
                { type: NotifyType.BwActionPlannerStateSet,         callback: this._onNotifyBwActionPlannerStateChanged },
                { type: NotifyType.BwProduceUnitPanelOpened,        callback: this._onNotifyBwProduceUnitPanelOpened },
                { type: NotifyType.BwProduceUnitPanelClosed,        callback: this._onNotifyBwProduceUnitPanelClosed },
                { type: NotifyType.MeUnitChanged,                   callback: this._onNotifyMeUnitChanged },
                { type: NotifyType.UnitAnimationTick,               callback: this._onNotifyUnitAnimationTick },
                { type: NotifyType.UnitStateIndicatorTick,          callback: this._onNotifyUnitStateIndicatorTick },
            ]);
        }
        protected async _updateOnOpenDataChanged(): Promise<void> {
            this._updateView();
        }
        protected _onClosing(): void {
            for (const cell of this._cellList) {
                this._destroyCell(cell);
            }
            this._cellList.length = 0;
            this._unitList.length = 0;
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Callbacks.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // private _onNotifyGlobalTouchBegin(e: egret.Event): void {
        //     this._adjustPositionOnTouch(e.data);
        // }
        // private _onNotifyGlobalTouchMove(e: egret.Event): void {
        //     this._adjustPositionOnTouch(e.data);
        // }
        private _onNotifyBwCursorGridIndexChanged(): void {
            this._updateView();
        }
        private _onNotifyBwActionPlannerStateChanged(): void {
            const planner = this._getOpenData().war.getActionPlanner();
            if ((planner.getPreviousState() === Types.ActionPlannerState.ExecutingAction) &&
                (planner.getState() !== Types.ActionPlannerState.ExecutingAction)
            ) {
                this._updateView();
            }
        }
        private _onNotifyBwProduceUnitPanelOpened(): void {
            this._updateView();
        }
        private _onNotifyBwProduceUnitPanelClosed(): void {
            this._updateView();
        }
        private _onNotifyMeUnitChanged(e: egret.Event): void {
            const data = e.data as NotifyData.MeUnitChanged;
            if (GridIndexHelpers.checkIsEqual(data.gridIndex, this._getOpenData().war.getCursor().getGridIndex())) {
                this._updateView();
            }
        }
        private _onNotifyUnitAnimationTick(): void {
            for (const cell of this._cellList) {
                cell.updateOnAnimationTick();
            }
        }
        private _onNotifyUnitStateIndicatorTick(): void {
            for (const cell of this._cellList) {
                cell.updateOnStateIndicatorTick();
            }
        }

        private _onCellTouchTap(e: egret.TouchEvent): void {
            SoundManager.playShortSfx(Types.ShortSfxCode.ButtonNeutral01);
            for (let i = 0; i < this._cellList.length; ++i) {
                if (this._cellList[i] === e.currentTarget) {
                    TwnsPanelManager.open(TwnsPanelConfig.Dict.BwUnitDetailPanel, { unit: this._unitList[i] });
                    return;
                }
            }
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Functions for view.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _updateView(): void {
            const war = this._getOpenData().war;
            if (!war.getIsRunning()) {
                this.visible = false;
            } else {
                this.visible = true;

                const unitList  = this._unitList;
                unitList.length = 0;

                const unitMap       = war.getUnitMap();
                const gridIndex     = war.getCursor().getGridIndex();
                const unitOnMap     = unitMap.getUnitOnMap(gridIndex);
                const teamIndexes   = war.getPlayerManager().getAliveWatcherTeamIndexesForSelf();

                if ((unitOnMap)                                         &&
                    (WarVisibilityHelpers.checkIsUnitOnMapVisibleToTeams({
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

        // private async _adjustPositionOnTouch(e: egret.TouchEvent): Promise<void> {
        //     const tileBriefPanel = TwnsBwTileBriefPanel.BwTileBriefPanel.getInstance();
        //     let target = e.target as egret.DisplayObject;
        //     while (target) {
        //         if ((target) && ((target === tileBriefPanel) || (target === this))) {
        //             return;
        //         }
        //         target = target.parent;
        //     }

        //     const stageWidth        = StageManager.getStage().stageWidth;
        //     const currentIsLeftSide = this._isLeftSide;
        //     const newIsLeftSide     = e.stageX >= stageWidth / 4 * 3
        //         ? true
        //         : (e.stageX < stageWidth / 4
        //             ? false
        //             : currentIsLeftSide
        //         );
        //     if (newIsLeftSide !== currentIsLeftSide) {
        //         await this._showCloseAnimation();
        //         this._isLeftSide = newIsLeftSide;
        //         this._updatePosition();
        //         this._showOpenAnimation();
        //     }
        // }

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

        protected async _showOpenAnimation(): Promise<void> {
            Helpers.resetTween({
                obj         : this._group,
                beginProps  : { alpha: 0, bottom: -40 },
                endProps    : { alpha: 1, bottom: 0 },
                tweenTime   : 50,
            });

            await Helpers.wait(50);
        }
        protected async _showCloseAnimation(): Promise<void> {
            Helpers.resetTween({
                obj         : this._group,
                beginProps  : { alpha: 1, bottom: 0 },
                endProps    : { alpha: 0, bottom: -40 },
                tweenTime   : 50,
            });

            await Helpers.wait(50);
        }
    }

    const _IMAGE_SOURCE_HP          = `c04_t10_s00_f00`;
    const _IMAGE_SOURCE_FUEL        = `c04_t10_s01_f00`;
    const _IMAGE_SOURCE_AMMO        = `c04_t10_s02_f00`;
    const _IMAGE_SOURCE_MATERIAL    = `c04_t10_s05_f00`;
    const _IMAGE_SOURCE_FLARE       = `c04_t10_s02_f00`;

    class BwUnitBriefCell extends eui.Component {
        private readonly _group!        : eui.Group;
        private readonly _conUnitView!  : eui.Group;
        private readonly _labelName!    : TwnsUiLabel.UiLabel;
        private readonly _labelHp!      : TwnsUiLabel.UiLabel;
        private readonly _labelFuel!    : TwnsUiLabel.UiLabel;
        private readonly _labelState!   : TwnsUiLabel.UiLabel;
        private readonly _imgHp!        : TwnsUiImage.UiImage;
        private readonly _imgFuel!      : TwnsUiImage.UiImage;
        private readonly _imgState!     : TwnsUiImage.UiImage;
        private readonly _unitView      = new TwnsBwUnitView.BwUnitView();

        private _unit               : BwUnit | null = null;
        private _isChildrenCreated  = false;

        public constructor() {
            super();

            this.skinName = `resource/skins/baseWar/BwUnitBriefCell.exml`;
        }

        protected childrenCreated(): void {
            super.childrenCreated();

            this._isChildrenCreated = true;

            this._imgHp.source      = _IMAGE_SOURCE_HP;
            this._imgFuel.source    = _IMAGE_SOURCE_FUEL;
            this._conUnitView.addChild(this._unitView);
            this._updateView();
        }

        public setUnit(unit: BwUnit): void {
            this._unit = unit;
            this._updateView();
        }

        public updateOnAnimationTick(): void {
            if (this._isChildrenCreated) {
                this._unitView.tickUnitAnimationFrame();
            }
        }

        public updateOnStateIndicatorTick(): void {
            if (this._isChildrenCreated) {
                this._unitView.tickStateAnimationFrame();
            }
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Functions for view.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _updateView(): void {
            if (this._isChildrenCreated) {
                const unit = Helpers.getExisted(this._unit);
                this._unitView.init(unit).startRunningView();
                this._labelHp.text      = `${unit.getCurrentHp()}`;
                this._labelFuel.text    = `${unit.getCurrentFuel()}`;
                this._labelName.text    = Lang.getUnitName(unit.getUnitType()) ?? CommonConstants.ErrorTextForUndefined;

                if (unit.getCurrentBuildMaterial() != null) {
                    this._imgState.visible      = true;
                    this._imgState.source       = _IMAGE_SOURCE_MATERIAL;
                    this._labelState.visible    = true;
                    this._labelState.text       = `${unit.getCurrentBuildMaterial()}`;
                } else if (unit.getCurrentProduceMaterial() != null) {
                    this._imgState.visible      = true;
                    this._imgState.source       = _IMAGE_SOURCE_MATERIAL;
                    this._labelState.visible    = true;
                    this._labelState.text       = `${unit.getCurrentProduceMaterial()}`;
                } else if (unit.getFlareCurrentAmmo() != null) {
                    this._imgState.visible      = true;
                    this._imgState.source       = _IMAGE_SOURCE_FLARE;
                    this._labelState.visible    = true;
                    this._labelState.text       = `${unit.getFlareCurrentAmmo()}`;
                } else if (unit.getPrimaryWeaponCurrentAmmo() != null) {
                    this._imgState.visible      = true;
                    this._imgState.source       = _IMAGE_SOURCE_AMMO;
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

// export default TwnsBwUnitBriefPanel;
