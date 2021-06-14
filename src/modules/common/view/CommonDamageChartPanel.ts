
namespace TinyWars.Common {
    import Notify           = Utility.Notify;
    import Lang             = Utility.Lang;
    import Types            = Utility.Types;
    import ConfigManager    = Utility.ConfigManager;
    import ProtoTypes       = Utility.ProtoTypes;
    import UnitType         = Types.UnitType;
    import TileType         = Types.TileType;
    import CommonConstants  = Utility.CommonConstants;
    import IUnitTemplateCfg = ProtoTypes.Config.IUnitTemplateCfg;

    export class CommonDamageChartPanel extends GameUi.UiPanel<void> {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Hud0;
        protected readonly _IS_EXCLUSIVE = false;

        private static _instance: CommonDamageChartPanel;

        private _groupList          : eui.Group;
        private _labelTitle         : TinyWars.GameUi.UiLabel;
        private _listUnit           : TinyWars.GameUi.UiScrollList<DataForUnitRenderer>;
        private _btnBack            : TinyWars.GameUi.UiButton;

        private _groupInfo          : eui.Group;
        private _conUnitView        : eui.Group;
        private _labelName          : GameUi.UiLabel;

        private _listInfo           : GameUi.UiScrollList<DataForInfoRenderer>;
        private _listDamageChart    : GameUi.UiScrollList<DataForDamageRenderer>;
        private _labelDamageChart   : GameUi.UiLabel;
        private _labelOffenseMain1  : GameUi.UiLabel;
        private _labelOffenseSub1   : GameUi.UiLabel;
        private _labelDefenseMain1  : GameUi.UiLabel;
        private _labelDefenseSub1   : GameUi.UiLabel;
        private _labelOffenseMain2  : GameUi.UiLabel;
        private _labelOffenseSub2   : GameUi.UiLabel;
        private _labelDefenseMain2  : GameUi.UiLabel;
        private _labelDefenseSub2   : GameUi.UiLabel;

        private _selectedIndex          : number;
        private _dataForListUnit        : DataForUnitRenderer[];
        private _dataForListDamageChart : DataForDamageRenderer[];
        private _unitView               = new WarMap.WarMapUnitView();

        public static show(): void {
            if (!CommonDamageChartPanel._instance) {
                CommonDamageChartPanel._instance = new CommonDamageChartPanel();
            }
            CommonDamageChartPanel._instance.open(undefined);
        }
        public static async hide(): Promise<void> {
            if (CommonDamageChartPanel._instance) {
                await CommonDamageChartPanel._instance.close();
            }
        }
        public static getIsOpening(): boolean {
            const instance = CommonDamageChartPanel._instance;
            return instance ? instance.getIsOpening() : false;
        }

        public constructor() {
            super();

            this._setIsTouchMaskEnabled();
            this._setIsCloseOnTouchedMask();
            this.skinName = `resource/skins/common/CommonDamageChartPanel.exml`;
        }

        protected _onOpened(): void {
            this._setNotifyListenerArray([
                { type: Notify.Type.LanguageChanged,                callback: this._onNotifyLanguageChanged },
                { type: Notify.Type.UnitAnimationTick,              callback: this._onNotifyUnitAnimationTick },
                { type: Notify.Type.BwActionPlannerStateChanged,    callback: this._onNotifyBwPlannerStateChanged },
            ]);
            this._setUiListenerArray([
                { ui: this._btnBack,    callback: this.close },
            ]);
            this._listUnit.setItemRenderer(UnitRenderer);
            this._listDamageChart.setItemRenderer(DamageRenderer);
            this._listInfo.setItemRenderer(InfoRenderer);

            this._conUnitView.addChild(this._unitView);
            this._showOpenAnimation();

            const listUnit          = this._listUnit;
            this._dataForListUnit   = this._createDataForListUnit();
            listUnit.bindData(this._dataForListUnit);
            listUnit.scrollVerticalTo(0);
            this._updateComponentsForLanguage();
            this.setSelectedIndexAndUpdateView(0);
        }
        protected async _onClosed(): Promise<void> {
            await this._showCloseAnimation();

            this._selectedIndex             = null;
            this._dataForListUnit           = null;
            this._dataForListDamageChart    = null;
        }

        public setSelectedIndexAndUpdateView(newIndex: number): void {
            const oldIndex      = this._selectedIndex;
            this._selectedIndex = newIndex;
            if (oldIndex !== newIndex) {
                this._listUnit.setSelectedIndex(newIndex);
                this._updateUnitViewAndLabelName();
                this._updateListInfo();
                this._updateListDamageChart();
            }
        }
        public getSelectedIndex(): number {
            return this._selectedIndex;
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Callbacks.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _onNotifyLanguageChanged(e: egret.Event): void {
            this._updateComponentsForLanguage();
        }

        private _onNotifyUnitAnimationTick(e: egret.Event): void {
            this._unitView.updateOnAnimationTick(Time.TimeModel.getUnitAnimationTickCount());
        }
        private _onNotifyBwPlannerStateChanged(e: egret.Event): void {
            this.close();
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Functions for view.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _showOpenAnimation(): void {
            const groupList = this._groupList;
            egret.Tween.removeTweens(groupList);
            egret.Tween.get(groupList)
                .set({ alpha: 0, left: -40 })
                .to({ alpha: 1, left: 0 }, 200);

            const groupInfo = this._groupInfo;
            egret.Tween.removeTweens(groupInfo);
            egret.Tween.get(groupInfo)
                .set({ alpha: 0, right: -40 })
                .to({ alpha: 1, right: 0 }, 200);
        }
        private _showCloseAnimation(): Promise<void> {
            return new Promise<void>(resolve => {
                const groupList = this._groupList;
                egret.Tween.removeTweens(groupList);
                egret.Tween.get(groupList)
                    .set({ alpha: 1, left: 0 })
                    .to({ alpha: 0, left: -40 }, 200);

                const groupInfo = this._groupInfo;
                egret.Tween.removeTweens(groupInfo);
                egret.Tween.get(groupInfo)
                    .set({ alpha: 1, right: 0 })
                    .to({ alpha: 0, right: -40 }, 200)
                    .call(resolve);
            });
        }

        private _updateComponentsForLanguage(): void {
            this._btnBack.label             = Lang.getText(Lang.Type.B0146);
            this._labelTitle.text           = Lang.getText(Lang.Type.B0440);
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
            const data = this._dataForListUnit[this._selectedIndex];
            if (data) {
                const unitType          = data.unitType;
                this._labelName.text    = Lang.getUnitName(unitType);
                this._unitView.update({
                    gridIndex       : { x: 0, y: 0 },
                    playerIndex     : CommonConstants.WarFirstPlayerIndex,
                    unitType,
                    actionState     : Types.UnitActionState.Idle,
                }, Time.TimeModel.getUnitAnimationTickCount());
            }
        }

        private _updateListInfo(): void {
            const dataList  : DataForInfoRenderer[] = [];
            const data      = this._dataForListUnit[this._selectedIndex];
            if (data) {
                const configVersion = data.configVersion;
                const unitType      = data.unitType;
                const cfg           = ConfigManager.getUnitTemplateCfg(configVersion, unitType);
                dataList.push(
                    this._createInfoHp(cfg),
                    this._createInfoProductionCost(cfg),
                    this._createInfoMovement(cfg),
                    this._createInfoFuel(cfg),
                    this._createInfoFuelConsumption(cfg),
                    this._createInfoFuelDestruction(cfg),
                    this._createInfoAttackRange(cfg),
                    this._createInfoAttackAfterMove(cfg),
                    this._createInfoVisionRange(cfg),
                    this._createInfoPrimaryWeaponAmmo(cfg),
                    this._createInfoBuildMaterial(cfg),
                    this._createInfoProduceMaterial(cfg),
                    this._createInfoFlareAmmo(cfg),
                    this._createInfoDive(cfg),
                );
            }

            this._listInfo.bindData(dataList.filter(v => !!v));
        }

        private _updateListDamageChart(): void {
            this._dataForListDamageChart = this._createDataForListDamageChart();
            this._listDamageChart.bindData(this._dataForListDamageChart);
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Util functions.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _createInfoHp(cfg: IUnitTemplateCfg): DataForInfoRenderer {
            const maxHp = cfg.maxHp;
            return {
                titleText   : Lang.getText(Lang.Type.B0339),
                valueText   : `${maxHp} / ${maxHp}`,
            };
        }
        private _createInfoProductionCost(cfg: IUnitTemplateCfg): DataForInfoRenderer {
            return {
                titleText   : Lang.getText(Lang.Type.B0341),
                valueText   : `${cfg.productionCost}`,
            };
        }
        private _createInfoMovement(cfg: IUnitTemplateCfg): DataForInfoRenderer {
            return {
                titleText   : Lang.getText(Lang.Type.B0340),
                valueText   : `${cfg.moveRange} (${Lang.getMoveTypeName(cfg.moveType)})`,
            };
        }
        private _createInfoFuel(cfg: IUnitTemplateCfg): DataForInfoRenderer {
            const maxFuel = cfg.maxFuel;
            return {
                titleText   : Lang.getText(Lang.Type.B0342),
                valueText   : `${maxFuel} / ${maxFuel}`,
            };
        }
        private _createInfoFuelConsumption(cfg: IUnitTemplateCfg): DataForInfoRenderer {
            return {
                titleText   : Lang.getText(Lang.Type.B0343),
                valueText   : `${cfg.fuelConsumptionPerTurn}${cfg.diveCfgs == null ? `` : ` (${cfg.diveCfgs[0]})`}`,
            };
        }
        private _createInfoFuelDestruction(cfg: IUnitTemplateCfg): DataForInfoRenderer {
            return {
                titleText   : Lang.getText(Lang.Type.B0344),
                valueText   : cfg.isDestroyedOnOutOfFuel
                    ? Lang.getText(Lang.Type.B0012)
                    : Lang.getText(Lang.Type.B0013),
            };
        }
        private _createInfoAttackRange(cfg: IUnitTemplateCfg): DataForInfoRenderer {
            return {
                titleText   : Lang.getText(Lang.Type.B0345),
                valueText   : cfg.minAttackRange == null ? Lang.getText(Lang.Type.B0001) : `${cfg.minAttackRange} - ${cfg.maxAttackRange}`,
            };
        }
        private _createInfoAttackAfterMove(cfg: IUnitTemplateCfg): DataForInfoRenderer {
            return {
                titleText   : Lang.getText(Lang.Type.B0346),
                valueText   : cfg.canAttackAfterMove ? Lang.getText(Lang.Type.B0012) : Lang.getText(Lang.Type.B0013),
            };
        }
        private _createInfoVisionRange(cfg: IUnitTemplateCfg): DataForInfoRenderer {
            return {
                titleText   : Lang.getText(Lang.Type.B0354),
                valueText   : `${cfg.visionRange}`,
            };
        }
        private _createInfoPrimaryWeaponAmmo(cfg: IUnitTemplateCfg): DataForInfoRenderer | null {
            const maxValue = cfg.primaryWeaponMaxAmmo;
            if (maxValue == null) {
                return null;
            } else {
                return {
                    titleText   : Lang.getText(Lang.Type.B0350),
                    valueText   : `${maxValue} / ${maxValue}`,
                };
            }
        }
        private _createInfoBuildMaterial(cfg: IUnitTemplateCfg): DataForInfoRenderer | null {
            const maxValue = cfg.maxBuildMaterial;
            if (maxValue == null) {
                return null;
            } else {
                return {
                    titleText   : Lang.getText(Lang.Type.B0347),
                    valueText   : `${maxValue} / ${maxValue}`,
                };
            }
        }
        private _createInfoProduceMaterial(cfg: IUnitTemplateCfg): DataForInfoRenderer | null {
            const maxValue = cfg.maxProduceMaterial;
            if (maxValue == null) {
                return null;
            } else {
                return {
                    titleText   : Lang.getText(Lang.Type.B0348),
                    valueText   : `${maxValue} / ${maxValue}`,
                };
            }
        }
        private _createInfoFlareAmmo(cfg: IUnitTemplateCfg): DataForInfoRenderer | null {
            const maxValue = cfg.flareMaxAmmo;
            if (maxValue == null) {
                return null;
            } else {
                return {
                    titleText   : Lang.getText(Lang.Type.B0349),
                    valueText   : `${maxValue} / ${maxValue}`,
                };
            }
        }
        private _createInfoDive(cfg: IUnitTemplateCfg): DataForInfoRenderer | null {
            const isDiver = !!cfg.diveCfgs;
            return {
                titleText   : Lang.getText(Lang.Type.B0439),
                valueText   : isDiver ? Lang.getText(Lang.Type.B0012) : Lang.getText(Lang.Type.B0013),
            };
        }

        private _createDataForListDamageChart(): DataForDamageRenderer[] {
            const data      = this._dataForListUnit[this._selectedIndex];
            const dataList  : DataForDamageRenderer[] = [];
            if (data) {
                const configVersion     = data.configVersion;
                const attackUnitType    = data.unitType;
                const playerIndex       = CommonConstants.WarFirstPlayerIndex;
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
            }

            return dataList.sort(sorterForDataForList);
        }

        private _createDataForListUnit(): DataForUnitRenderer[] {
            const data          : DataForUnitRenderer[] = [];
            const configVersion = ConfigManager.getLatestFormalVersion();
            const unitTypes     = ConfigManager.getUnitTypesByCategory(configVersion, Types.UnitCategory.All);
            for (let index = 0; index < unitTypes.length; ++index) {
                data.push({
                    configVersion,
                    index,
                    unitType: unitTypes[index],
                    panel   : this,
                });
            }

            return data;
        }
    }

    function sorterForDataForList(a: DataForDamageRenderer, b: DataForDamageRenderer): number {
        return a.attackUnitType - b.attackUnitType;
    }

    type DataForUnitRenderer = {
        configVersion   : string;
        unitType        : Types.UnitType;
        index           : number;
        panel           : CommonDamageChartPanel;
    }

    class UnitRenderer extends GameUi.UiListItemRenderer<DataForUnitRenderer> {
        private _imgChoose  : eui.Image;
        private _labelName  : TinyWars.GameUi.UiLabel;

        protected _onOpened(): void {
            this._setUiListenerArray([
                { ui: this._imgChoose,  callback: this._onTouchedImgChoose },
            ]);
        }

        protected _onDataChanged(): void {
            const data              = this.data;
            this._labelName.text    = Lang.getUnitName(data.unitType);
        }

        private _onTouchedImgChoose(e: egret.TouchEvent): void {
            const data = this.data;
            data.panel.setSelectedIndexAndUpdateView(data.index);
        }
    }

    type DataForInfoRenderer = {
        titleText   : string;
        valueText   : string;
    }

    class InfoRenderer extends GameUi.UiListItemRenderer<DataForInfoRenderer> {
        private _btnTitle   : GameUi.UiButton;
        private _labelValue : GameUi.UiLabel;

        protected _onDataChanged(): void {
            const data              = this.data;
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

    class DamageRenderer extends GameUi.UiListItemRenderer<DataForDamageRenderer> {
        private _group                  : eui.Group;
        private _conView                : eui.Group;
        private _unitView               : WarMap.WarMapUnitView;
        private _tileView               : GameUi.UiImage;
        private _labelPrimaryAttack     : GameUi.UiLabel;
        private _labelSecondaryAttack   : GameUi.UiLabel;
        private _labelPrimaryDefend     : GameUi.UiLabel;
        private _labelSecondaryDefend   : GameUi.UiLabel;

        protected _onOpened(): void {
            this._setNotifyListenerArray([
                { type: Notify.Type.UnitAnimationTick,  callback: this._onNotifyUnitAnimationTick },
            ]);

            this._unitView = new WarMap.WarMapUnitView();
            this._conView.addChild(this._unitView);
        }

        private _onNotifyUnitAnimationTick(): void {
            if (this.data) {
                this._unitView.updateOnAnimationTick(Time.TimeModel.getUnitAnimationTickCount());
            }
        }

        protected _onDataChanged(): void {
            this._updateView();
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Functions for view.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _updateView(): void {
            const data              = this.data;
            const configVersion     = data.configVersion;
            const attackUnitType    = data.attackUnitType;
            const targetUnitType    = data.targetUnitType;
            if (targetUnitType != null) {
                this._unitView.visible = true;
                this._tileView.visible = false;
                this._unitView.update({
                    gridIndex       : { x: 0, y: 0 },
                    unitType        : targetUnitType,
                    playerIndex     : data.playerIndex,
                    actionState     : Types.UnitActionState.Idle,
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
