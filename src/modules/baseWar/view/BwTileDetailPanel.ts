
namespace TinyWars.BaseWar {
    import Notify       = Utility.Notify;
    import Lang         = Utility.Lang;
    import Types        = Utility.Types;
    import UnitType     = Types.UnitType;

    export type OpenDataForBwTileDetailPanel = {
        tile    : BwTile;
    }

    const { width: GRID_WIDTH, height: GRID_HEIGHT } = ConfigManager.getGridSize();

    export class BwTileDetailPanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Hud0;
        protected readonly _IS_EXCLUSIVE = false;

        private static _instance: BwTileDetailPanel;

        private _group                      : eui.Group;
        private _labelName                  : GameUi.UiLabel;
        private _imgTileBase                : GameUi.UiImage;
        private _imgTileObject              : GameUi.UiImage;
        private _labelDefenseBonus          : GameUi.UiLabel;
        private _labelIncome                : GameUi.UiLabel;
        private _labelVisionRange           : GameUi.UiLabel;
        private _labelHideCategory          : GameUi.UiLabel;
        private _labelLoseOnCapture         : GameUi.UiLabel;
        private _labelCanProduceUnit        : GameUi.UiLabel;
        private _labelAttackDefenseBonus    : GameUi.UiLabel;
        private _labelRepairAmount          : GameUi.UiLabel;
        private _listMoveCost               : GameUi.UiScrollList;

        private _groupCapturePoint          : eui.Group;
        private _labelCapturePoint          : GameUi.UiLabel;

        private _groupHp                    : eui.Group;
        private _labelHp                    : GameUi.UiLabel;

        private _groupBuildPoint            : eui.Group;
        private _labelBuildPoint            : GameUi.UiLabel;

        private _openData   : OpenDataForBwTileDetailPanel;
        private _dataForList: DataForMoveRangeRenderer[];

        public static show(data: OpenDataForBwTileDetailPanel): void {
            if (!BwTileDetailPanel._instance) {
                BwTileDetailPanel._instance = new BwTileDetailPanel();
            }
            BwTileDetailPanel._instance._openData = data;
            BwTileDetailPanel._instance.open();
        }
        public static hide(): void {
            if (BwTileDetailPanel._instance) {
                BwTileDetailPanel._instance.close();
            }
        }
        public static getIsOpening(): boolean {
            const instance = BwTileDetailPanel._instance;
            return instance ? instance.getIsOpening() : false;
        }

        public constructor() {
            super();

            this._setAutoAdjustHeightEnabled();
            this._setTouchMaskEnabled();
            this._callbackForTouchMask = () => this.close();
            this.skinName = `resource/skins/baseWar/BwTileDetailPanel.exml`;
        }

        protected _onFirstOpened(): void {
            this._notifyListeners = [
                { type: Notify.Type.UnitAnimationTick,              callback: this._onNotifyUnitAnimationTick },
                { type: Notify.Type.BwActionPlannerStateChanged,    callback: this._onNotifyBwPlannerStateChanged },
            ];
            this._uiListeners = [
            ];

            this._imgTileObject.anchorOffsetY = GRID_HEIGHT;
            this._listMoveCost.setItemRenderer(MoveCostRenderer);
        }
        protected _onOpened(): void {
            this._updateView();
        }
        protected _onClosed(): void {
            delete this._dataForList;
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Callbacks.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _onNotifyUnitAnimationTick(e: egret.Event): void {
            const viewList = this._listMoveCost.getViewList();
            for (let i = 0; i < viewList.numChildren; ++i) {
                const child = viewList.getChildAt(i);
                (child instanceof MoveCostRenderer) && (child.updateOnUnitAnimationTick());
            }
        }
        private _onNotifyBwPlannerStateChanged(e: egret.Event): void {
            this.close();
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Functions for view.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _updateView(): void {
            this._updateTileView();
            this._updateLabels();
            this._updateListDamageChart();
        }

        private _updateTileView(): void {
            const data      = this._openData;
            const tile      = data.tile;
            const tickCount = Time.TimeModel.getTileAnimationTickCount();
            this._imgTileBase.source      = ConfigManager.getTileBaseImageSource(tile.getBaseViewId(), tickCount, false);
            this._imgTileObject.source    = ConfigManager.getTileObjectImageSource(tile.getObjectViewId(), tickCount, false);
        }

        private _updateLabels(): void {
            const data                          = this._openData;
            const tile                          = data.tile;
            const configVersion                 = tile.getConfigVersion();
            const tileType                      = tile.getType();
            const cfg                           = ConfigManager.getTileTemplateCfgByType(configVersion, tileType);
            const defenseBonus                  = cfg.defenseAmount;
            const income                        = cfg.incomePerTurn;
            const visionRange                   = cfg.visionRange;
            const hideCategory                  = cfg.hideUnitCategory;
            const globalAttackBonus             = cfg.globalAttackBonus;
            const globalDefenseBonus            = cfg.globalDefenseBonus;
            const repairAmount                  = cfg.repairAmount;
            this._labelName.text                = Lang.getTileName(tileType);
            this._labelDefenseBonus.text        = defenseBonus ? `${defenseBonus}(${Lang.getUnitCategoryName(cfg.defenseUnitCategory)})` : `--`;
            this._labelIncome.text              = `${income != null ? income : `--`}`;
            this._labelVisionRange.text         = `${visionRange != null ? visionRange : `--`}`;
            this._labelHideCategory.text        = `${hideCategory != null ? Lang.getUnitCategoryName(hideCategory) : `--`}`;
            this._labelLoseOnCapture.text       = cfg.isDefeatedOnCapture ? Lang.getText(Lang.Type.B0012) : Lang.getText(Lang.Type.B0013);
            this._labelCanProduceUnit.text      = cfg.produceUnitCategory ? Lang.getText(Lang.Type.B0012) : Lang.getText(Lang.Type.B0013);
            this._labelAttackDefenseBonus.text  = `${globalAttackBonus == null ? `--` : globalAttackBonus + "%"} / ${globalDefenseBonus == null ? `--` : globalDefenseBonus + "%"}`;
            this._labelRepairAmount.text        = repairAmount != null ? `${repairAmount}(${Lang.getUnitCategoryName(cfg.repairUnitCategory)})` : `--`;

            if (tile.getCurrentHp() != null) {
                this._groupCapturePoint.visible = false;
                this._groupHp.visible           = true;
                this._groupBuildPoint.visible   = false;
                this._labelHp.text              = `${tile.getCurrentHp()} / ${tile.getMaxHp()}`;
            } else if (tile.getCurrentCapturePoint() != null) {
                this._groupCapturePoint.visible = true;
                this._groupHp.visible           = false;
                this._groupBuildPoint.visible   = false;
                this._labelCapturePoint.text    = `${tile.getCurrentCapturePoint()} / ${tile.getMaxCapturePoint()}`;
            } else if (tile.getCurrentBuildPoint() != null) {
                this._groupCapturePoint.visible = false;
                this._groupHp.visible           = false;
                this._groupBuildPoint.visible   = true;
                this._labelBuildPoint.text      = `${tile.getCurrentBuildPoint()} / ${tile.getMaxBuildPoint()}`;
            } else {
                this._groupCapturePoint.visible = false;
                this._groupHp.visible           = false;
                this._groupBuildPoint.visible   = false;
            }
        }

        private _updateListDamageChart(): void {
            this._dataForList = this._createDataForList();
            this._listMoveCost.bindData(this._dataForList);
        }

        private _createDataForList(): DataForMoveRangeRenderer[] {
            const openData          = this._openData;
            const tile              = openData.tile;
            const configVersion     = tile.getConfigVersion();
            const tileCfg           = ConfigManager.getTileTemplateCfgByType(configVersion, tile.getType());
            const playerIndex       = tile.getPlayerIndex() || 1;

            const dataList = [] as DataForMoveRangeRenderer[];
            for (const unitType of ConfigManager.getUnitTypesByCategory(configVersion, Types.UnitCategory.All)) {
                dataList.push({
                    configVersion,
                    unitType,
                    tileCfg,
                    playerIndex,
                });
            }

            return dataList.sort(sorterForDataForList);
        }
    }

    function sorterForDataForList(a: DataForMoveRangeRenderer, b: DataForMoveRangeRenderer): number {
        return a.unitType - b.unitType;
    }

    type DataForMoveRangeRenderer = {
        configVersion   : string;
        unitType        : UnitType;
        tileCfg         : Types.TileTemplateCfg;
        playerIndex     : number;
    }

    class MoveCostRenderer extends eui.ItemRenderer {
        private _group          : eui.Group;
        private _conView        : eui.Group;
        private _unitView       : WarMap.WarMapUnitView;
        private _labelMoveCost  : GameUi.UiLabel;

        protected childrenCreated(): void {
            super.childrenCreated();

            this._unitView = new WarMap.WarMapUnitView();
            this._conView.addChild(this._unitView);
        }

        public updateOnUnitAnimationTick(): void {
            if (this.data) {
                this._unitView.updateOnAnimationTick(Time.TimeModel.getUnitAnimationTickCount());
            }
        }

        protected dataChanged(): void {
            super.dataChanged();

            this._updateView();
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Functions for view.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _updateView(): void {
            const data                  = this.data as DataForMoveRangeRenderer;
            const configVersion         = data.configVersion;
            const unitType              = data.unitType;
            const moveCostCfg           = ConfigManager.getMoveCostCfgByTileType(configVersion, data.tileCfg.type);
            const moveCost              = moveCostCfg[ConfigManager.getUnitTemplateCfg(configVersion, unitType).moveType].cost;
            this._labelMoveCost.text    = moveCost != null ? `${moveCost}` : `--`;
            this._unitView.update({
                configVersion,
                gridX           : 0,
                gridY           : 0,
                viewId          : ConfigManager.getUnitViewId(unitType, data.playerIndex),
            }, Time.TimeModel.getUnitAnimationTickCount());
        }
    }
}
