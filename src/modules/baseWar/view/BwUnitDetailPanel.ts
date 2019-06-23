
namespace TinyWars.BaseWar {
    import Notify       = Utility.Notify;
    import Lang         = Utility.Lang;
    import Types        = Utility.Types;
    import UnitType     = Types.UnitType;
    import TileType     = Types.TileType;

    export type OpenDataForBwUnitDetailPanel = {
        configVersion?  : number;
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
        private _labelHp                : GameUi.UiLabel;
        private _labelProductionCost    : GameUi.UiLabel;
        private _labelFuel              : GameUi.UiLabel;
        private _labelFuelConsumption   : GameUi.UiLabel;
        private _labelDestroyOnOutOfFuel: GameUi.UiLabel;
        private _labelAttackRange       : GameUi.UiLabel;
        private _labelAttackAfterMove   : GameUi.UiLabel;

        private _groupPrimaryWeaponAmmo : eui.Group;
        private _labelPrimaryWeaponAmmo : GameUi.UiLabel;

        private _groupFlareAmmo : eui.Group;
        private _labelFlareAmmo : GameUi.UiLabel;

        private _groupMaterial  : eui.Group;
        private _labelMaterial  : GameUi.UiLabel;

        private _listDamageChart        : GameUi.UiScrollList;

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
                { type: Notify.Type.UnitAnimationTick,              callback: this._onNotifyUnitAnimationTick },
                { type: Notify.Type.BwActionPlannerStateChanged,    callback: this._onNotifyBwPlannerStateChanged },
            ];
            this._uiListeners = [
            ];

            this._listDamageChart.setItemRenderer(DamageRenderer);
            this._unitView = new WarMap.WarMapUnitView();
            this._conUnitView.addChild(this._unitView);
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
            this._updateUnitView();
            this._updateLabels();
            this._updateListDamageChart();
        }

        private _updateUnitView(): void {
            const data  = this._openData;
            const unit  = data.unit;
            this._unitView.update({
                configVersion   : unit ? unit.getConfigVersion() : data.configVersion,
                viewId          : unit ? unit.getViewId() : data.viewId,
                gridX           : 0,
                gridY           : 0,
            }, Time.TimeModel.getUnitAnimationTickCount());
        }

        private _updateLabels(): void {
            const data                          = this._openData;
            const unit                          = data.unit;
            const configVersion                 = unit ? unit.getConfigVersion() : data.configVersion;
            const unitType                      = unit ? unit.getType() : ConfigManager.getUnitTypeAndPlayerIndex(data.viewId).unitType;
            const cfg                           = ConfigManager.getUnitTemplateCfg(configVersion, unitType);
            this._labelName.text                = Lang.getUnitName(unitType);
            this._labelHp.text                  = unit ? `${unit.getCurrentHp()} / ${unit.getMaxHp()}` : `${cfg.maxHp} / ${cfg.maxHp}`;
            this._labelProductionCost.text      = `${cfg.productionCost}`;
            this._labelFuel.text                = unit ? `${unit.getCurrentFuel()} / ${unit.getMaxFuel()}` : `${cfg.maxFuel} / ${cfg.maxFuel}`;
            this._labelFuelConsumption.text     = `${cfg.fuelConsumptionPerTurn}${cfg.fuelConsumptionInDiving == null ? `` : ` (${cfg.fuelConsumptionInDiving})`}`;
            this._labelDestroyOnOutOfFuel.text  = (unit && unit.checkIsDestroyedOnOutOfFuel()) || (cfg.isDestroyedOnOutOfFuel)
                ? Lang.getText(Lang.Type.B0012)
                : Lang.getText(Lang.Type.B0013);
            this._labelAttackRange.text         = cfg.minAttackRange == null ? Lang.getText(Lang.Type.B0001) : `${cfg.minAttackRange} - ${cfg.maxAttackRange}`;
            this._labelAttackAfterMove.text     = cfg.canAttackAfterMove ? Lang.getText(Lang.Type.B0012) : Lang.getText(Lang.Type.B0013);

            if (((unit) && (unit.getMaxBuildMaterial() != null)) || (cfg.maxBuildMaterial != null)) {
                this._groupMaterial.visible             = true;
                this._groupFlareAmmo.visible            = false;
                this._groupPrimaryWeaponAmmo.visible    = false;
                this._labelMaterial.text                = unit ? `${unit.getCurrentBuildMaterial()} / ${unit.getMaxBuildMaterial()}` : `${cfg.maxBuildMaterial} / ${cfg.maxBuildMaterial}`;
            } else if (((unit) && (unit.getMaxProduceMaterial() != null)) || (cfg.maxProduceMaterial != null)) {
                this._groupMaterial.visible             = true;
                this._groupFlareAmmo.visible            = false;
                this._groupPrimaryWeaponAmmo.visible    = false;
                this._labelMaterial.text                = unit ? `${unit.getCurrentProduceMaterial()} / ${unit.getMaxProduceMaterial()}` : `${cfg.maxProduceMaterial} / ${cfg.maxProduceMaterial}`;
            } else if (((unit) && (unit.getFlareMaxAmmo() != null)) || (cfg.flareMaxAmmo != null)) {
                this._groupMaterial.visible             = false;
                this._groupFlareAmmo.visible            = true;
                this._groupPrimaryWeaponAmmo.visible    = false;
                this._labelFlareAmmo.text               = unit ? `${unit.getFlareCurrentAmmo()} / ${unit.getFlareMaxAmmo()}` : `${cfg.flareMaxAmmo} / ${cfg.flareMaxAmmo}`;
            } else if (((unit) && (unit.getPrimaryWeaponMaxAmmo() != null)) || (cfg.primaryWeaponMaxAmmo != null)) {
                this._groupMaterial.visible             = false;
                this._groupFlareAmmo.visible            = false;
                this._groupPrimaryWeaponAmmo.visible    = true;
                this._labelPrimaryWeaponAmmo.text       = unit ? `${unit.getPrimaryWeaponCurrentAmmo()} / ${unit.getPrimaryWeaponMaxAmmo()}` : `${cfg.primaryWeaponMaxAmmo} / ${cfg.primaryWeaponMaxAmmo}`;
            } else {
                this._groupMaterial.visible             = false;
                this._groupFlareAmmo.visible            = false;
                this._groupPrimaryWeaponAmmo.visible    = true;
                this._labelPrimaryWeaponAmmo.text       = Lang.getText(Lang.Type.B0001);
            }
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

            const datas = [] as DataForDamageRenderer[];
            for (const targetUnitType of ConfigManager.getUnitTypesByCategory(configVersion, Types.UnitCategory.All)) {
                datas.push({
                    configVersion,
                    attackUnitType,
                    targetUnitType,
                    playerIndex,
                });
            }
            // for (const defendTileType of ConfigManager.getTileTypesByCategory(configVersion, Types.TileCategory.Destroyable)) {
            //     datas.push({
            //         configVersion,
            //         attackUnitType,
            //         defendTileType,
            //     });
            // }

            return datas.sort(sorterForDataForList);
        }
    }

    function sorterForDataForList(a: DataForDamageRenderer, b: DataForDamageRenderer): number {
        return a.attackUnitType - b.attackUnitType;
    }

    type DataForDamageRenderer = {
        configVersion   : number;
        attackUnitType  : UnitType;
        playerIndex     : number;
        targetUnitType? : UnitType;
        targetTileType? : TileType;
    }

    class DamageRenderer extends eui.ItemRenderer {
        private _group                  : eui.Group;
        private _conView                : eui.Group;
        private _unitView               : WarMap.WarMapUnitView;
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
                const targetTileType = data.targetTileType;

            }
        }
    }
}
