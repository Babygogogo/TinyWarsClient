
import CommonModel              from "../../common/model/CommonModel";
import GridIndexHelpers         from "../../tools/helpers/GridIndexHelpers";
import StageManager             from "../../tools/helpers/StageManager";
import Types                    from "../../tools/helpers/Types";
import Lang                     from "../../tools/lang/Lang";
import NotifyData               from "../../tools/notify/NotifyData";
import TwnsNotifyType           from "../../tools/notify/NotifyType";
import TwnsUiImage              from "../../tools/ui/UiImage";
import TwnsUiLabel              from "../../tools/ui/UiLabel";
import TwnsUiPanel              from "../../tools/ui/UiPanel";
import TwnsBwUnit               from "../model/BwUnit";
import WarVisibilityHelpers     from "../../tools/warHelpers/WarVisibilityHelpers";
import TwnsBwWar                from "../model/BwWar";
import TwnsCommonCoListPanel    from "../../common/view/CommonCoListPanel";
import TwnsBwProduceUnitPanel   from "./BwProduceUnitPanel";
import TwnsBwTileBriefPanel     from "./BwTileBriefPanel";
import TwnsBwUnitDetailPanel    from "./BwUnitDetailPanel";
import TwnsBwUnitView           from "./BwUnitView";

namespace TwnsBwUnitBriefPanel {
    import BwCoListPanel        = TwnsCommonCoListPanel.CommonCoListPanel;
    import BwProduceUnitPanel   = TwnsBwProduceUnitPanel.BwProduceUnitPanel;
    import BwUnitDetailPanel    = TwnsBwUnitDetailPanel.BwUnitDetailPanel;
    import BwUnitView           = TwnsBwUnitView.BwUnitView;
    import BwWar                = TwnsBwWar.BwWar;
    import NotifyType           = TwnsNotifyType.NotifyType;
    import BwUnit               = TwnsBwUnit.BwUnit;
    import Tween                = egret.Tween;

    const _CELL_WIDTH           = 80;

    type OpenDataForBwUnitBriefPanel = {
        war : BwWar;
    };
    // eslint-disable-next-line no-shadow
    export class BwUnitBriefPanel extends TwnsUiPanel.UiPanel<OpenDataForBwUnitBriefPanel> {
        protected readonly _LAYER_TYPE   = Types.LayerType.Hud0;
        protected readonly _IS_EXCLUSIVE = false;

        private static _instance: BwUnitBriefPanel;

        private _group      : eui.Group;
        private _cellList   : BwUnitBriefCell[] = [];

        private _unitList   : BwUnit[] = [];
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
                { type: NotifyType.GlobalTouchBegin,               callback: this._onNotifyGlobalTouchBegin },
                { type: NotifyType.GlobalTouchMove,                callback: this._onNotifyGlobalTouchMove },
                { type: NotifyType.BwCursorGridIndexChanged,       callback: this._onNotifyBwCursorGridIndexChanged },
                { type: NotifyType.BwActionPlannerStateChanged,    callback: this._onNotifyBwActionPlannerStateChanged },
                { type: NotifyType.BwWarMenuPanelOpened,           callback: this._onNotifyBwWarMenuPanelOpened },
                { type: NotifyType.BwWarMenuPanelClosed,           callback: this._onNotifyBwWarMenuPanelClosed },
                { type: NotifyType.BwCoListPanelOpened,            callback: this._onNotifyBwCoListPanelOpened },
                { type: NotifyType.BwCoListPanelClosed,            callback: this._onNotifyBwCoListPanelClosed },
                { type: NotifyType.BwProduceUnitPanelOpened,       callback: this._onNotifyBwProduceUnitPanelOpened },
                { type: NotifyType.BwProduceUnitPanelClosed,       callback: this._onNotifyBwProduceUnitPanelClosed },
                { type: NotifyType.MeUnitChanged,                  callback: this._onNotifyMeUnitChanged },
                { type: NotifyType.UnitAnimationTick,              callback: this._onNotifyUnitAnimationTick },
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
            const planner = this._getOpenData().war.getActionPlanner();
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
            const data = e.data as NotifyData.MeUnitChanged;
            if (GridIndexHelpers.checkIsEqual(data.gridIndex, this._getOpenData().war.getCursor().getGridIndex())) {
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
                    BwUnitDetailPanel.show({ unit: this._unitList[i] });
                    return;
                }
            }
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Functions for view.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _updateView(): void {
            const war = this._getOpenData().war;
            if ((war.getIsWarMenuPanelOpening())            ||
                (!war.getIsRunning())                       ||
                (BwProduceUnitPanel.getIsOpening()) ||
                (BwCoListPanel.getIsOpening())
            ) {
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

        private async _adjustPositionOnTouch(e: egret.TouchEvent): Promise<void> {
            const tileBriefPanel = TwnsBwTileBriefPanel.BwTileBriefPanel.getInstance();
            let target = e.target as egret.DisplayObject;
            while (target) {
                if ((target) && ((target === tileBriefPanel) || (target === this))) {
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
        private _labelName      : TwnsUiLabel.UiLabel;
        private _labelHp        : TwnsUiLabel.UiLabel;
        private _labelFuel      : TwnsUiLabel.UiLabel;
        private _labelState     : TwnsUiLabel.UiLabel;
        private _imgHp          : TwnsUiImage.UiImage;
        private _imgFuel        : TwnsUiImage.UiImage;
        private _imgState       : TwnsUiImage.UiImage;
        private _unitView       : BwUnitView;

        private _unit               : BwUnit;
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
            this._unitView          = new BwUnitView();
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

export default TwnsBwUnitBriefPanel;
