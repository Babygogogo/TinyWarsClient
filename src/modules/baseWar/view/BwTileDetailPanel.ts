
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
        private _listInfo                   : GameUi.UiScrollList;
        private _labelMoveCost              : GameUi.UiLabel;
        private _listMoveCost               : GameUi.UiScrollList;

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
                { type: Notify.Type.LanguageChanged,                callback: this._onNotifyLanguageChanged },
                { type: Notify.Type.UnitAnimationTick,              callback: this._onNotifyUnitAnimationTick },
                { type: Notify.Type.BwActionPlannerStateChanged,    callback: this._onNotifyBwPlannerStateChanged },
            ];

            this._imgTileObject.anchorOffsetY = GRID_HEIGHT;
            this._listInfo.setItemRenderer(InfoRenderer);
            this._listMoveCost.setItemRenderer(MoveCostRenderer);
        }
        protected _onOpened(): void {
            this._updateView();
        }
        protected _onClosed(): void {
            this._dataForList = null;
            this._listInfo.clear();
            this._listMoveCost.clear();
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Callbacks.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _onNotifyLanguageChanged(e: egret.Event): void {
            this._updateComponentsForLanguage();
        }
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
            this._updateComponentsForLanguage();
            this._updateTileViewAndLabelName();
            this._updateListInfo();
        }

        private _updateComponentsForLanguage(): void {
            this._labelMoveCost.text = Lang.getText(Lang.Type.B0351);
            this._updateListMoveCost();
        }

        private _updateTileViewAndLabelName(): void {
            const data                  = this._openData;
            const tile                  = data.tile;
            const tickCount             = Time.TimeModel.getTileAnimationTickCount();
            this._imgTileBase.source    = ConfigManager.getTileBaseImageSource(tile.getBaseViewId(), tickCount, false);
            this._imgTileObject.source  = ConfigManager.getTileObjectImageSource(tile.getObjectViewId(), tickCount, false);
            this._labelName.text        = Lang.getTileName(tile.getType());
        }

        private _updateListInfo(): void {
            const data                  = this._openData;
            const tile                  = data.tile;
            const configVersion         = tile.getConfigVersion();
            const tileType              = tile.getType();
            const cfg                   = ConfigManager.getTileTemplateCfgByType(configVersion, tileType);
            const defenseBonus          = cfg.defenseAmount;
            const income                = cfg.incomePerTurn;
            const visionRange           = cfg.visionRange;
            const hideCategory          = cfg.hideUnitCategory;
            const globalAttackBonus     = cfg.globalAttackBonus;
            const globalDefenseBonus    = cfg.globalDefenseBonus;
            const repairAmount          = cfg.repairAmount;

            const dataList: DataForInfoRenderer[] = [
                {
                    titleText   : Lang.getText(Lang.Type.B0352),
                    valueText   : defenseBonus ? `${defenseBonus}(${Lang.getUnitCategoryName(cfg.defenseUnitCategory)})` : `--`,
                },
                {
                    titleText   : Lang.getText(Lang.Type.B0353),
                    valueText   : `${income != null ? income : `--`}`,
                },
                {
                    titleText   : Lang.getText(Lang.Type.B0354),
                    valueText   : visionRange != null
                        ? `${visionRange}${cfg.isVisionEnabledForAllPlayers ? `(${Lang.getText(Lang.Type.B0355)})`: ``}`
                        : `--`,
                },
                {
                    titleText   : Lang.getText(Lang.Type.B0356),
                    valueText   : `${hideCategory != null ? Lang.getUnitCategoryName(hideCategory) : `--`}`,
                },
                {
                    titleText   : Lang.getText(Lang.Type.B0357),
                    valueText   : cfg.isDefeatedOnCapture ? Lang.getText(Lang.Type.B0012) : Lang.getText(Lang.Type.B0013),
                },
                {
                    titleText   : Lang.getText(Lang.Type.B0358),
                    valueText   : cfg.produceUnitCategory
                        ? Lang.getUnitCategoryName(cfg.produceUnitCategory)
                        : Lang.getText(Lang.Type.B0013),
                },
                {
                    titleText   : Lang.getText(Lang.Type.B0359),
                    valueText   : `${globalAttackBonus == null ? `--` : globalAttackBonus + "%"} / ${globalDefenseBonus == null ? `--` : globalDefenseBonus + "%"}`,
                },
                {
                    titleText   : Lang.getText(Lang.Type.B0360),
                    valueText   : repairAmount != null ? `${repairAmount}(${Lang.getUnitCategoryName(cfg.repairUnitCategory)})` : `--`,
                },
            ];
            if (tile.getCurrentHp() != null) {
                dataList.push({
                    titleText   : Lang.getText(Lang.Type.B0339),
                    valueText   : `${tile.getCurrentHp()} / ${tile.getMaxHp()}`,
                });
            }
            if (tile.getCurrentCapturePoint() != null) {
                dataList.push({
                    titleText   : Lang.getText(Lang.Type.B0361),
                    valueText   : `${tile.getCurrentCapturePoint()} / ${tile.getMaxCapturePoint()}`,
                });
            }
            if (tile.getCurrentBuildPoint() != null) {
                dataList.push({
                    titleText   : Lang.getText(Lang.Type.B0362),
                    valueText   : `${tile.getCurrentBuildPoint()} / ${tile.getMaxBuildPoint()}`,
                });
            }

            this._listInfo.bindData(dataList);
        }

        private _updateListMoveCost(): void {
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

    type DataForInfoRenderer = {
        titleText   : string;
        valueText   : string;
    }

    class InfoRenderer extends eui.ItemRenderer {
        private _btnTitle   : GameUi.UiButton;
        private _labelValue : GameUi.UiLabel;

        protected childrenCreated(): void {
            super.childrenCreated();

            this._btnTitle.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onTouchedBtnTitle, this);
        }

        protected dataChanged(): void {
            const data              = this.data as DataForInfoRenderer;
            this._btnTitle.label    = data.titleText;
            this._labelValue.text   = data.valueText;
        }

        private _onTouchedBtnTitle(e: egret.TouchEvent): void {

        }
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
