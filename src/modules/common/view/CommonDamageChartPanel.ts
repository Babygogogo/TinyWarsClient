
namespace TinyWars.Common {
    import Notify           = Utility.Notify;
    import Lang             = Utility.Lang;
    import Types            = Utility.Types;
    import ConfigManager    = Utility.ConfigManager;
    import ProtoTypes       = Utility.ProtoTypes;
    import UnitType         = Types.UnitType;
    import TileType         = Types.TileType;
    import CommonConstants  = ConfigManager.COMMON_CONSTANTS;
    import IUnitTemplateCfg = ProtoTypes.Config.IUnitTemplateCfg;

    export class CommonDamageChartPanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Hud0;
        protected readonly _IS_EXCLUSIVE = false;

        private static _instance: CommonDamageChartPanel;

        private _group                  : eui.Group;
        private _conUnitView            : eui.Group;
        private _labelName              : GameUi.UiLabel;

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

        private _dataForList: DataForDamageRenderer[];
        private _unitView   : WarMap.WarMapUnitView;

        public static show(): void {
            if (!CommonDamageChartPanel._instance) {
                CommonDamageChartPanel._instance = new CommonDamageChartPanel();
            }
            CommonDamageChartPanel._instance.open();
        }
        public static hide(): void {
            if (CommonDamageChartPanel._instance) {
                CommonDamageChartPanel._instance.close();
            }
        }
        public static getIsOpening(): boolean {
            const instance = CommonDamageChartPanel._instance;
            return instance ? instance.getIsOpening() : false;
        }

        public constructor() {
            super();

            this._setAutoAdjustHeightEnabled();
            this._setTouchMaskEnabled();
            this._callbackForTouchMask = () => this.close();
            this.skinName = `resource/skins/baseWar/CommonDamageChartPanel.exml`;
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
            const unit              = this._openData.unit;
            this._labelName.text    = Lang.getUnitName(unit.getType());
            this._unitView.update({
                gridIndex       : { x: 0, y: 0},
                skinId          : unit.getSkinId(),
                unitType        : unit.getType(),
                unitActionState : unit.getActionState(),
            }, Time.TimeModel.getUnitAnimationTickCount());
        }

        private _updateListInfo(): void {
            const unit          = this._openData.unit;
            const configVersion = unit.getConfigVersion();
            const unitType      = unit.getType();
            const cfg           = ConfigManager.getUnitTemplateCfg(configVersion, unitType);

            const dataList: DataForInfoRenderer[] = [
                this._createInfoHp(unit, cfg),
                this._createInfoProductionCost(unit, cfg),
                this._createInfoMovement(unit, cfg),
                this._createInfoFuel(unit, cfg),
                this._createInfoFuelConsumption(unit, cfg),
                this._createInfoFuelDestruction(unit, cfg),
                this._createInfoAttackRange(unit, cfg),
                this._createInfoAttackAfterMove(unit, cfg),
                this._createInfoVisionRange(unit, cfg),
                this._createInfoPrimaryWeaponAmmo(unit, cfg),
                this._createInfoBuildMaterial(unit, cfg),
                this._createInfoProduceMaterial(unit, cfg),
                this._createInfoFlareAmmo(unit, cfg),
                this._createInfoDive(unit, cfg),
            ].filter(v => !!v);

            this._listInfo.bindData(dataList);
        }

        private _createInfoHp(unit: BaseWar.BwUnit, cfg: IUnitTemplateCfg): DataForInfoRenderer {
            return {
                titleText   : Lang.getText(Lang.Type.B0339),
                valueText   : `${unit.getCurrentHp()} / ${unit.getMaxHp()}`,
            };
        }
        private _createInfoProductionCost(unit: BaseWar.BwUnit, cfg: IUnitTemplateCfg): DataForInfoRenderer {
            return {
                titleText   : Lang.getText(Lang.Type.B0341),
                valueText   : `${cfg.productionCost}`,
            };
        }
        private _createInfoMovement(unit: BaseWar.BwUnit, cfg: IUnitTemplateCfg): DataForInfoRenderer {
            return {
                titleText   : Lang.getText(Lang.Type.B0340),
                valueText   : `${cfg.moveRange} (${Lang.getMoveTypeName(cfg.moveType)})`,
            };
        }
        private _createInfoFuel(unit: BaseWar.BwUnit, cfg: IUnitTemplateCfg): DataForInfoRenderer {
            return {
                titleText   : Lang.getText(Lang.Type.B0342),
                valueText   : `${unit.getCurrentFuel()} / ${unit.getMaxFuel()}`,
            };
        }
        private _createInfoFuelConsumption(unit: BaseWar.BwUnit, cfg: IUnitTemplateCfg): DataForInfoRenderer {
            return {
                titleText   : Lang.getText(Lang.Type.B0343),
                valueText   : `${cfg.fuelConsumptionPerTurn}${cfg.diveCfgs == null ? `` : ` (${cfg.diveCfgs[0]})`}`,
            };
        }
        private _createInfoFuelDestruction(unit: BaseWar.BwUnit, cfg: IUnitTemplateCfg): DataForInfoRenderer {
            return {
                titleText   : Lang.getText(Lang.Type.B0344),
                valueText   : (unit && unit.checkIsDestroyedOnOutOfFuel()) || (cfg.isDestroyedOnOutOfFuel)
                    ? Lang.getText(Lang.Type.B0012)
                    : Lang.getText(Lang.Type.B0013),
            };
        }
        private _createInfoAttackRange(unit: BaseWar.BwUnit, cfg: IUnitTemplateCfg): DataForInfoRenderer {
            return {
                titleText   : Lang.getText(Lang.Type.B0345),
                valueText   : cfg.minAttackRange == null ? Lang.getText(Lang.Type.B0001) : `${cfg.minAttackRange} - ${cfg.maxAttackRange}`,
            };
        }
        private _createInfoAttackAfterMove(unit: BaseWar.BwUnit, cfg: IUnitTemplateCfg): DataForInfoRenderer {
            return {
                titleText   : Lang.getText(Lang.Type.B0346),
                valueText   : cfg.canAttackAfterMove ? Lang.getText(Lang.Type.B0012) : Lang.getText(Lang.Type.B0013),
            };
        }
        private _createInfoVisionRange(unit: BaseWar.BwUnit, cfg: IUnitTemplateCfg): DataForInfoRenderer {
            return {
                titleText   : Lang.getText(Lang.Type.B0354),
                valueText   : unit ? `${unit.getCfgVisionRange()}` : `${cfg.visionRange}`,
            };
        }
        private _createInfoPrimaryWeaponAmmo(
            unit        : BaseWar.BwUnit,
            cfg         : IUnitTemplateCfg,
        ): DataForInfoRenderer | null {
            const maxValue = unit.getPrimaryWeaponMaxAmmo();
            if (maxValue == null) {
                return null;
            } else {
                const currValue = unit.getPrimaryWeaponCurrentAmmo();
                return {
                    titleText   : Lang.getText(Lang.Type.B0350),
                    valueText   : `${currValue} / ${maxValue}`,
                };
            }
        }

        private _createInfoBuildMaterial(
            unit        : BaseWar.BwUnit,
            cfg         : IUnitTemplateCfg,
        ): DataForInfoRenderer | null {
            const maxValue = unit.getMaxBuildMaterial();
            if (maxValue == null) {
                return null;
            } else {
                const currValue = unit.getCurrentBuildMaterial();
                return {
                    titleText   : Lang.getText(Lang.Type.B0347),
                    valueText   : `${currValue} / ${maxValue}`,
                };
            }
        }

        private _createInfoProduceMaterial(
            unit        : BaseWar.BwUnit,
            cfg         : IUnitTemplateCfg,
        ): DataForInfoRenderer | null {
            const maxValue = unit.getMaxProduceMaterial();
            if (maxValue == null) {
                return null;
            } else {
                const currValue = unit.getCurrentProduceMaterial();
                return {
                    titleText   : Lang.getText(Lang.Type.B0348),
                    valueText   : `${currValue} / ${maxValue}`,
                };
            }
        }

        private _createInfoFlareAmmo(
            unit        : BaseWar.BwUnit,
            cfg         : IUnitTemplateCfg,
        ): DataForInfoRenderer | null {
            const maxValue = unit.getFlareMaxAmmo();
            if (maxValue == null) {
                return null;
            } else {
                const currValue = unit.getFlareCurrentAmmo();
                return {
                    titleText   : Lang.getText(Lang.Type.B0349),
                    valueText   : `${currValue} / ${maxValue}`,
                };
            }
        }

        private _createInfoDive(
            unit        : BaseWar.BwUnit,
            cfg         : IUnitTemplateCfg,
        ): DataForInfoRenderer | null {
            const isDiver = unit.checkIsDiver();
            return {
                titleText   : Lang.getText(Lang.Type.B0439),
                valueText   : isDiver ? Lang.getText(Lang.Type.B0012) : Lang.getText(Lang.Type.B0013),
            };
        }

        private _updateListDamageChart(): void {
            this._dataForList = this._createDataForListDamageChart();
            this._listDamageChart.bindData(this._dataForList);
        }

        private _createDataForListDamageChart(): DataForDamageRenderer[] {
            const unit              = this._openData.unit;
            const configVersion     = unit.getConfigVersion();
            const attackUnitType    = unit.getType();
            const playerIndex       = unit.getPlayerIndex();

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

        protected dataChanged(): void {
            const data              = this.data as DataForInfoRenderer;
            this._labelValue.text   = data.valueText;
            this._btnTitle.label    = data.titleText;
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
                    gridIndex       : { x: 0, y: 0 },
                    unitType        : targetUnitType,
                    skinId          : data.playerIndex,
                    unitActionState : Types.UnitActionState.Idle,
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
                this._tileView.source           = Common.CommonModel.getCachedTileObjectImageSource({
                    version     : User.UserModel.getSelfSettingsTextureVersion(),
                    skinId      : CommonConstants.UnitAndTileNeutralSkinId,
                    objectType  : ConfigManager.getTileObjectTypeByTileType(targetTileType),
                    isDark      : false,
                    shapeId     : 0,
                    tickCount   : Time.TimeModel.getTileAnimationTickCount(),
                });
                this._labelPrimaryAttack.text   = primaryAttackDamage == null ? `--` : `${primaryAttackDamage}`;
                this._labelSecondaryAttack.text = secondaryAttackDamage == null ? `--` : `${secondaryAttackDamage}`;
                this._labelPrimaryDefend.text   = `--`;
                this._labelSecondaryDefend.text = `--`;
            }
        }
    }
}
