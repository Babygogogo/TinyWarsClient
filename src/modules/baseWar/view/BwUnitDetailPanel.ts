
namespace TinyWars.BaseWar {
    import Notify       = Utility.Notify;
    import Lang         = Utility.Lang;
    import Types        = Utility.Types;
    import UnitType     = Types.UnitType;
    import TileType     = Types.TileType;

    export type OpenDataForBwUnitDetailPanel = {
        configVersion?  : string;
        viewId?         : number;
        unit?           : BwUnit;
    }

    export class BwUnitDetailPanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Hud0;
        protected readonly _IS_EXCLUSIVE = false;

        private static _instance: BwUnitDetailPanel;

        private _group                  : eui.Group;
        private _conUnitView            : eui.Group;
        private _labelName              : GameUi.UiLabel;

        // private _labelHp                : GameUi.UiLabel;
        // private _labelMovement          : GameUi.UiLabel;
        // private _labelProductionCost    : GameUi.UiLabel;
        // private _labelFuel              : GameUi.UiLabel;
        // private _labelFuelConsumption   : GameUi.UiLabel;
        // private _labelDestroyOnOutOfFuel: GameUi.UiLabel;
        // private _labelAttackRange       : GameUi.UiLabel;
        // private _labelAttackAfterMove   : GameUi.UiLabel;

        // private _groupPrimaryWeaponAmmo : eui.Group;
        // private _labelPrimaryWeaponAmmo : GameUi.UiLabel;

        // private _groupFlareAmmo : eui.Group;
        // private _labelFlareAmmo : GameUi.UiLabel;

        // private _groupMaterial  : eui.Group;
        // private _labelMaterial  : GameUi.UiLabel;

        private _listInfo           : GameUi.UiScrollList;
        private _listDamageChart    : GameUi.UiScrollList;
        private _labelDamageChart   : GameUi.UiLabel;
        private _labelOffenseMain1  : GameUi.UiLabel;
        private _labelOffenseSub1   : GameUi.UiLabel;
        private _labelDefenseMain1  : GameUi.UiLabel;
        private _labelDefenseSub1   : GameUi.UiLabel;
        private _labelOffenseMain2  : GameUi.UiLabel;
        private _labelOffenseSub2   : GameUi.UiLabel;
        private _labelDefenseMain2  : GameUi.UiLabel;
        private _labelDefenseSub2   : GameUi.UiLabel;

        private _openData   : OpenDataForBwUnitDetailPanel;
        private _dataForList: DataForDamageRenderer[];
        private _unitView   : WarMap.WarMapUnitView;

        public static show(data: OpenDataForBwUnitDetailPanel): void {
            if (!BwUnitDetailPanel._instance) {
                BwUnitDetailPanel._instance = new BwUnitDetailPanel();
            }
            BwUnitDetailPanel._instance._openData = data;
            BwUnitDetailPanel._instance.open();
        }
        public static hide(): void {
            if (BwUnitDetailPanel._instance) {
                BwUnitDetailPanel._instance.close();
            }
        }
        public static getIsOpening(): boolean {
            const instance = BwUnitDetailPanel._instance;
            return instance ? instance.getIsOpening() : false;
        }

        public constructor() {
            super();

            this._setAutoAdjustHeightEnabled();
            this._setTouchMaskEnabled();
            this._callbackForTouchMask = () => this.close();
            this.skinName = `resource/skins/baseWar/BwUnitDetailPanel.exml`;
        }

        protected _onFirstOpened(): void {
            this._notifyListeners = [
                { type: Notify.Type.LanguageChanged,                callback: this._onNotifyLanguageChanged },
                { type: Notify.Type.UnitAnimationTick,              callback: this._onNotifyUnitAnimationTick },
                { type: Notify.Type.BwActionPlannerStateChanged,    callback: this._onNotifyBwPlannerStateChanged },
            ];

            this._listDamageChart.setItemRenderer(DamageRenderer);
            this._listInfo.setItemRenderer(InfoRenderer);
            this._unitView = new WarMap.WarMapUnitView();
            this._conUnitView.addChild(this._unitView);
        }
        protected _onOpened(): void {
            this._updateView();
        }
        protected _onClosed(): void {
            this._listDamageChart.clear();
            this._listInfo.clear();
            this._dataForList = null;
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Callbacks.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _onNotifyLanguageChanged(e: egret.Event): void {
            this._updateComponentsForLanguage();
        }

        private _onNotifyUnitAnimationTick(e: egret.Event): void {
            const viewList = this._listDamageChart.getViewList();
            for (let i = 0; i < viewList.numChildren; ++i) {
                const child = viewList.getChildAt(i);
                (child instanceof DamageRenderer) && (child.updateOnUnitAnimationTick());
            }

            this._unitView.updateOnAnimationTick(Time.TimeModel.getUnitAnimationTickCount());
        }
        private _onNotifyBwPlannerStateChanged(e: egret.Event): void {
            this.close();
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Functions for view.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _updateView(): void {
            this._updateComponentsForLanguage();
            this._updateUnitViewAndLabelName();
            this._updateListDamageChart();
        }

        private _updateComponentsForLanguage(): void {
            this._labelDamageChart.text     = Lang.getText(Lang.Type.B0334);
            this._labelOffenseMain1.text    = Lang.getText(Lang.Type.B0335);
            this._labelOffenseSub1.text     = Lang.getText(Lang.Type.B0336);
            this._labelDefenseMain1.text    = Lang.getText(Lang.Type.B0337);
            this._labelDefenseSub1.text     = Lang.getText(Lang.Type.B0338);
            this._labelOffenseMain2.text    = Lang.getText(Lang.Type.B0335);
            this._labelOffenseSub2.text     = Lang.getText(Lang.Type.B0336);
            this._labelDefenseMain2.text    = Lang.getText(Lang.Type.B0337);
            this._labelDefenseSub2.text     = Lang.getText(Lang.Type.B0338);
            this._updateListInfo();
        }

        private _updateUnitViewAndLabelName(): void {
            const data              = this._openData;
            const unit              = data.unit;
            const viewId            = unit ? unit.getViewId() : data.viewId;
            const unitType          = unit ? unit.getType() : ConfigManager.getUnitTypeAndPlayerIndex(viewId).unitType;
            this._labelName.text    = Lang.getUnitName(unitType);
            this._unitView.update({
                configVersion   : unit ? unit.getConfigVersion() : data.configVersion,
                viewId,
                gridX           : 0,
                gridY           : 0,
            }, Time.TimeModel.getUnitAnimationTickCount());
        }

        private _updateListInfo(): void {
            const data          = this._openData;
            const unit          = data.unit;
            const configVersion = unit ? unit.getConfigVersion() : data.configVersion;
            const unitType      = unit ? unit.getType() : ConfigManager.getUnitTypeAndPlayerIndex(data.viewId).unitType;
            const cfg           = ConfigManager.getUnitTemplateCfg(configVersion, unitType);

            const dataList: DataForInfoRenderer[] = [];
            dataList.push(
                {
                    // HP
                    titleText   : Lang.getText(Lang.Type.B0339),
                    valueText   : unit ? `${unit.getCurrentHp()} / ${unit.getMaxHp()}` : `${cfg.maxHp} / ${cfg.maxHp}`,
                },
                {
                    // Production Cost
                    titleText   : Lang.getText(Lang.Type.B0341),
                    valueText   : `${cfg.productionCost}`,
                },
                {
                    // Movement
                    titleText   : Lang.getText(Lang.Type.B0340),
                    valueText   : `${cfg.moveRange} (${Lang.getMoveTypeName(cfg.moveType)})`,
                },
                {
                    // Fuel
                    titleText   : Lang.getText(Lang.Type.B0342),
                    valueText   : unit ? `${unit.getCurrentFuel()} / ${unit.getMaxFuel()}` : `${cfg.maxFuel} / ${cfg.maxFuel}`,
                },
                {
                    // Fuel consumption
                    titleText   : Lang.getText(Lang.Type.B0343),
                    valueText   : `${cfg.fuelConsumptionPerTurn}${cfg.fuelConsumptionInDiving == null ? `` : ` (${cfg.fuelConsumptionInDiving})`}`,
                },
                {
                    // Destroy on out of fuel
                    titleText   : Lang.getText(Lang.Type.B0344),
                    valueText   : (unit && unit.checkIsDestroyedOnOutOfFuel()) || (cfg.isDestroyedOnOutOfFuel)
                        ? Lang.getText(Lang.Type.B0012)
                        : Lang.getText(Lang.Type.B0013),
                },
                {
                    // Attack range
                    titleText   : Lang.getText(Lang.Type.B0345),
                    valueText   : cfg.minAttackRange == null ? Lang.getText(Lang.Type.B0001) : `${cfg.minAttackRange} - ${cfg.maxAttackRange}`,
                },
                {
                    // Attack after move
                    titleText   : Lang.getText(Lang.Type.B0346),
                    valueText   : cfg.canAttackAfterMove ? Lang.getText(Lang.Type.B0012) : Lang.getText(Lang.Type.B0013),
                }
            );
            if (((unit) && (unit.getPrimaryWeaponMaxAmmo() != null)) || (cfg.primaryWeaponMaxAmmo != null)) {
                dataList.push({
                    titleText   : Lang.getText(Lang.Type.B0350),
                    valueText   : unit
                        ? `${unit.getPrimaryWeaponCurrentAmmo()} / ${unit.getPrimaryWeaponMaxAmmo()}`
                        : `${cfg.primaryWeaponMaxAmmo} / ${cfg.primaryWeaponMaxAmmo}`,
                });
            }
            if (((unit) && (unit.getMaxBuildMaterial() != null)) || (cfg.maxBuildMaterial != null)) {
                dataList.push({
                    titleText   : Lang.getText(Lang.Type.B0347),
                    valueText   : unit
                        ? `${unit.getCurrentBuildMaterial()} / ${unit.getMaxBuildMaterial()}`
                        : `${cfg.maxBuildMaterial} / ${cfg.maxBuildMaterial}`,
                });
            }
            if (((unit) && (unit.getMaxProduceMaterial() != null)) || (cfg.maxProduceMaterial != null)) {
                dataList.push({
                    titleText   : Lang.getText(Lang.Type.B0348),
                    valueText   : unit
                        ? `${unit.getCurrentProduceMaterial()} / ${unit.getMaxProduceMaterial()}`
                        : `${cfg.maxProduceMaterial} / ${cfg.maxProduceMaterial}`,
                });
            }
            if (((unit) && (unit.getFlareMaxAmmo() != null)) || (cfg.flareMaxAmmo != null)) {
                dataList.push({
                    titleText   : Lang.getText(Lang.Type.B0349),
                    valueText   : unit
                        ? `${unit.getFlareCurrentAmmo()} / ${unit.getFlareMaxAmmo()}`
                        : `${cfg.flareMaxAmmo} / ${cfg.flareMaxAmmo}`,
                });
            }

            this._listInfo.bindData(dataList);
        }

        private _updateListDamageChart(): void {
            this._dataForList = this._createDataForList();
            this._listDamageChart.bindData(this._dataForList);
        }

        private _createDataForList(): DataForDamageRenderer[] {
            const openData          = this._openData;
            const unit              = openData.unit;
            const configVersion     = unit ? unit.getConfigVersion() : openData.configVersion;
            const attackUnitType    = unit ? unit.getType() : ConfigManager.getUnitTypeAndPlayerIndex(openData.viewId).unitType;
            const playerIndex       = unit ? unit.getPlayerIndex() : ConfigManager.getUnitTypeAndPlayerIndex(openData.viewId).playerIndex;

            const dataList = [] as DataForDamageRenderer[];
            for (const targetUnitType of ConfigManager.getUnitTypesByCategory(configVersion, Types.UnitCategory.All)) {
                dataList.push({
                    configVersion,
                    attackUnitType,
                    targetUnitType,
                    playerIndex,
                });
            }
            for (const targetTileType of ConfigManager.getTileTypesByCategory(configVersion, Types.TileCategory.Destroyable)) {
                dataList.push({
                    configVersion,
                    attackUnitType,
                    targetTileType,
                });
            }

            return dataList.sort(sorterForDataForList);
        }
    }

    function sorterForDataForList(a: DataForDamageRenderer, b: DataForDamageRenderer): number {
        return a.attackUnitType - b.attackUnitType;
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

    type DataForDamageRenderer = {
        configVersion   : string;
        attackUnitType  : UnitType;
        playerIndex?    : number;
        targetUnitType? : UnitType;
        targetTileType? : TileType;
    }

    class DamageRenderer extends eui.ItemRenderer {
        private _group                  : eui.Group;
        private _conView                : eui.Group;
        private _unitView               : WarMap.WarMapUnitView;
        private _tileView               : GameUi.UiImage;
        private _labelPrimaryAttack     : GameUi.UiLabel;
        private _labelSecondaryAttack   : GameUi.UiLabel;
        private _labelPrimaryDefend     : GameUi.UiLabel;
        private _labelSecondaryDefend   : GameUi.UiLabel;

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
            const data              = this.data as DataForDamageRenderer;
            const configVersion     = data.configVersion;
            const attackUnitType    = data.attackUnitType;
            const targetUnitType    = data.targetUnitType;
            if (targetUnitType != null) {
                this._unitView.visible = true;
                this._tileView.visible = false;
                this._unitView.update({
                    configVersion,
                    gridX           : 0,
                    gridY           : 0,
                    viewId          : ConfigManager.getUnitViewId(targetUnitType, data.playerIndex),
                }, Time.TimeModel.getUnitAnimationTickCount());

                const attackCfg                 = ConfigManager.getDamageChartCfgs(configVersion, attackUnitType);
                const targetArmorType           = ConfigManager.getUnitTemplateCfg(configVersion, targetUnitType).armorType;
                const primaryAttackDamage       = attackCfg[targetArmorType][Types.WeaponType.Primary].damage;
                const secondaryAttackDamage     = attackCfg[targetArmorType][Types.WeaponType.Secondary].damage;
                this._labelPrimaryAttack.text   = primaryAttackDamage == null ? `--` : `${primaryAttackDamage}`;
                this._labelSecondaryAttack.text = secondaryAttackDamage == null ? `--` : `${secondaryAttackDamage}`;

                const defendCfg                 = ConfigManager.getDamageChartCfgs(configVersion, targetUnitType);
                const attackerArmorType         = ConfigManager.getUnitTemplateCfg(configVersion, attackUnitType).armorType;
                const primaryDefendDamage       = defendCfg[attackerArmorType][Types.WeaponType.Primary].damage;
                const secondaryDefendDamage     = defendCfg[attackerArmorType][Types.WeaponType.Secondary].damage;
                this._labelPrimaryDefend.text   = primaryDefendDamage == null ? `--` : `${primaryDefendDamage}`;
                this._labelSecondaryDefend.text = secondaryDefendDamage == null ? `--` : `${secondaryDefendDamage}`;

            } else {
                this._unitView.visible = false;
                this._tileView.visible = true;

                const targetTileType            = data.targetTileType;
                const attackCfg                 = ConfigManager.getDamageChartCfgs(configVersion, attackUnitType);
                const targetCfg                 = ConfigManager.getTileTemplateCfgByType(configVersion, targetTileType)
                const targetArmorType           = targetCfg.armorType;
                const primaryAttackDamage       = attackCfg[targetArmorType][Types.WeaponType.Primary].damage;
                const secondaryAttackDamage     = attackCfg[targetArmorType][Types.WeaponType.Secondary].damage;
                const viewId                    = ConfigManager.getTileObjectViewId(ConfigManager.getTileObjectTypeByTileType(targetTileType), 0);
                this._tileView.source           = ConfigManager.getTileObjectImageSource(viewId, 0, false);
                this._labelPrimaryAttack.text   = primaryAttackDamage == null ? `--` : `${primaryAttackDamage}`;
                this._labelSecondaryAttack.text = secondaryAttackDamage == null ? `--` : `${secondaryAttackDamage}`;
                this._labelPrimaryDefend.text   = `--`;
                this._labelSecondaryDefend.text = `--`;
            }
        }
    }
}
