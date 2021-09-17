
import CommonModel              from "../../common/model/CommonModel";
import CommonConstants          from "../../tools/helpers/CommonConstants";
import CompatibilityHelpers     from "../../tools/helpers/CompatibilityHelpers";
import ConfigManager            from "../../tools/helpers/ConfigManager";
import Helpers                  from "../../tools/helpers/Helpers";
import Timer                    from "../../tools/helpers/Timer";
import Types                    from "../../tools/helpers/Types";
import Lang                     from "../../tools/lang/Lang";
import TwnsLangTextType         from "../../tools/lang/LangTextType";
import TwnsNotifyType           from "../../tools/notify/NotifyType";
import ProtoTypes               from "../../tools/proto/ProtoTypes";
import TwnsUiButton             from "../../tools/ui/UiButton";
import TwnsUiImage              from "../../tools/ui/UiImage";
import TwnsUiLabel              from "../../tools/ui/UiLabel";
import TwnsUiListItemRenderer   from "../../tools/ui/UiListItemRenderer";
import TwnsUiPanel              from "../../tools/ui/UiPanel";
import TwnsUiScrollList         from "../../tools/ui/UiScrollList";
import UserModel                from "../../user/model/UserModel";
import TwnsWarMapUnitView       from "../../warMap/view/WarMapUnitView";

namespace TwnsCommonDamageChartPanel {
    import NotifyType       = TwnsNotifyType.NotifyType;
    import LangTextType     = TwnsLangTextType.LangTextType;
    import WarMapUnitView   = TwnsWarMapUnitView.WarMapUnitView;
    import UnitType         = Types.UnitType;
    import TileType         = Types.TileType;
    import IUnitTemplateCfg = ProtoTypes.Config.IUnitTemplateCfg;

    export class CommonDamageChartPanel extends TwnsUiPanel.UiPanel<void> {
        protected readonly _LAYER_TYPE   = Types.LayerType.Hud0;
        protected readonly _IS_EXCLUSIVE = false;

        private static _instance: CommonDamageChartPanel;

        private readonly _groupList!            : eui.Group;
        private readonly _labelTitle!           : TwnsUiLabel.UiLabel;
        private readonly _listUnit!             : TwnsUiScrollList.UiScrollList<DataForUnitRenderer>;
        private readonly _btnBack!              : TwnsUiButton.UiButton;

        private readonly _groupInfo!            : eui.Group;
        private readonly _conUnitView!          : eui.Group;
        private readonly _labelName!            : TwnsUiLabel.UiLabel;

        private readonly _listInfo!             : TwnsUiScrollList.UiScrollList<DataForInfoRenderer>;
        private readonly _listDamageChart!      : TwnsUiScrollList.UiScrollList<DataForDamageRenderer>;
        private readonly _labelDamageChart!     : TwnsUiLabel.UiLabel;
        private readonly _labelOffenseMain1!    : TwnsUiLabel.UiLabel;
        private readonly _labelOffenseSub1!     : TwnsUiLabel.UiLabel;
        private readonly _labelDefenseMain1!    : TwnsUiLabel.UiLabel;
        private readonly _labelDefenseSub1!     : TwnsUiLabel.UiLabel;
        private readonly _labelOffenseMain2!    : TwnsUiLabel.UiLabel;
        private readonly _labelOffenseSub2!     : TwnsUiLabel.UiLabel;
        private readonly _labelDefenseMain2!    : TwnsUiLabel.UiLabel;
        private readonly _labelDefenseSub2!     : TwnsUiLabel.UiLabel;

        private _selectedIndex              : number | null = null;
        private _dataForListUnit?           : DataForUnitRenderer[];
        private _dataForListDamageChart?    : DataForDamageRenderer[];
        private _unitView                   = new WarMapUnitView();

        public static show(): void {
            if (!CommonDamageChartPanel._instance) {
                CommonDamageChartPanel._instance = new CommonDamageChartPanel();
            }
            CommonDamageChartPanel._instance.open();
        }
        public static async hide(): Promise<void> {
            if (CommonDamageChartPanel._instance) {
                await CommonDamageChartPanel._instance.close().catch(err => { CompatibilityHelpers.showError(err); throw err; });
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
                { type: NotifyType.LanguageChanged,                callback: this._onNotifyLanguageChanged },
                { type: NotifyType.UnitAnimationTick,              callback: this._onNotifyUnitAnimationTick },
                { type: NotifyType.BwActionPlannerStateSet,    callback: this._onNotifyBwPlannerStateChanged },
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
            await this._showCloseAnimation().catch(err => { CompatibilityHelpers.showError(err); throw err; });

            this._selectedIndex = null;
            delete this._dataForListUnit;
            delete this._dataForListDamageChart;
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
        public getSelectedIndex(): number | null {
            return this._selectedIndex;
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Callbacks.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _onNotifyLanguageChanged(): void {
            this._updateComponentsForLanguage();
        }

        private _onNotifyUnitAnimationTick(): void {
            this._unitView.updateOnAnimationTick(Timer.getUnitAnimationTickCount());
        }
        private _onNotifyBwPlannerStateChanged(): void {
            // this.close();
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
            this._btnBack.label             = Lang.getText(LangTextType.B0146);
            this._labelTitle.text           = Lang.getText(LangTextType.B0440);
            this._labelDamageChart.text     = Lang.getText(LangTextType.B0334);
            this._labelOffenseMain1.text    = Lang.getText(LangTextType.B0335);
            this._labelOffenseSub1.text     = Lang.getText(LangTextType.B0336);
            this._labelDefenseMain1.text    = Lang.getText(LangTextType.B0337);
            this._labelDefenseSub1.text     = Lang.getText(LangTextType.B0338);
            this._labelOffenseMain2.text    = Lang.getText(LangTextType.B0335);
            this._labelOffenseSub2.text     = Lang.getText(LangTextType.B0336);
            this._labelDefenseMain2.text    = Lang.getText(LangTextType.B0337);
            this._labelDefenseSub2.text     = Lang.getText(LangTextType.B0338);
            this._updateListInfo();
        }

        private _updateUnitViewAndLabelName(): void {
            const selectedIndex = this.getSelectedIndex();
            const dataArray     = this._dataForListUnit;
            const data          = (selectedIndex == null) || (dataArray == null)
                ? null
                : dataArray[selectedIndex];
            if (data) {
                const unitType          = data.unitType;
                this._labelName.text    = Lang.getUnitName(unitType) ?? CommonConstants.ErrorTextForUndefined;
                this._unitView.update({
                    gridIndex       : { x: 0, y: 0 },
                    playerIndex     : CommonConstants.WarFirstPlayerIndex,
                    unitType,
                    actionState     : Types.UnitActionState.Idle,
                }, Timer.getUnitAnimationTickCount());
            }
        }

        private _updateListInfo(): void {
            const selectedIndex = this.getSelectedIndex();
            const dataArray     = this._dataForListUnit;
            const data          = (selectedIndex == null) || (dataArray == null)
                ? null
                : dataArray[selectedIndex];
            const listInfo      = this._listInfo;
            if (data == null) {
                listInfo.clear();
            } else {
                const configVersion = data.configVersion;
                const unitType      = data.unitType;
                const cfg           = ConfigManager.getUnitTemplateCfg(configVersion, unitType);
                this._listInfo.bindData(Helpers.getNonNullElements([
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
                ]));
            }

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
                titleText   : Lang.getText(LangTextType.B0339),
                valueText   : `${maxHp} / ${maxHp}`,
            };
        }
        private _createInfoProductionCost(cfg: IUnitTemplateCfg): DataForInfoRenderer {
            return {
                titleText   : Lang.getText(LangTextType.B0341),
                valueText   : `${cfg.productionCost}`,
            };
        }
        private _createInfoMovement(cfg: IUnitTemplateCfg): DataForInfoRenderer {
            return {
                titleText   : Lang.getText(LangTextType.B0340),
                valueText   : `${cfg.moveRange} (${Lang.getMoveTypeName(Helpers.getExisted(cfg.moveType))})`,
            };
        }
        private _createInfoFuel(cfg: IUnitTemplateCfg): DataForInfoRenderer {
            const maxFuel = cfg.maxFuel;
            return {
                titleText   : Lang.getText(LangTextType.B0342),
                valueText   : `${maxFuel} / ${maxFuel}`,
            };
        }
        private _createInfoFuelConsumption(cfg: IUnitTemplateCfg): DataForInfoRenderer {
            return {
                titleText   : Lang.getText(LangTextType.B0343),
                valueText   : `${cfg.fuelConsumptionPerTurn}${cfg.diveCfgs == null ? `` : ` (${cfg.diveCfgs[0]})`}`,
            };
        }
        private _createInfoFuelDestruction(cfg: IUnitTemplateCfg): DataForInfoRenderer {
            return {
                titleText   : Lang.getText(LangTextType.B0344),
                valueText   : cfg.isDestroyedOnOutOfFuel
                    ? Lang.getText(LangTextType.B0012)
                    : Lang.getText(LangTextType.B0013),
            };
        }
        private _createInfoAttackRange(cfg: IUnitTemplateCfg): DataForInfoRenderer {
            return {
                titleText   : Lang.getText(LangTextType.B0345),
                valueText   : cfg.minAttackRange == null ? Lang.getText(LangTextType.B0001) : `${cfg.minAttackRange} - ${cfg.maxAttackRange}`,
            };
        }
        private _createInfoAttackAfterMove(cfg: IUnitTemplateCfg): DataForInfoRenderer {
            return {
                titleText   : Lang.getText(LangTextType.B0346),
                valueText   : cfg.canAttackAfterMove ? Lang.getText(LangTextType.B0012) : Lang.getText(LangTextType.B0013),
            };
        }
        private _createInfoVisionRange(cfg: IUnitTemplateCfg): DataForInfoRenderer {
            return {
                titleText   : Lang.getText(LangTextType.B0354),
                valueText   : `${cfg.visionRange}`,
            };
        }
        private _createInfoPrimaryWeaponAmmo(cfg: IUnitTemplateCfg): DataForInfoRenderer | null {
            const maxValue = cfg.primaryWeaponMaxAmmo;
            if (maxValue == null) {
                return null;
            } else {
                return {
                    titleText   : Lang.getText(LangTextType.B0350),
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
                    titleText   : Lang.getText(LangTextType.B0347),
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
                    titleText   : Lang.getText(LangTextType.B0348),
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
                    titleText   : Lang.getText(LangTextType.B0349),
                    valueText   : `${maxValue} / ${maxValue}`,
                };
            }
        }
        private _createInfoDive(cfg: IUnitTemplateCfg): DataForInfoRenderer | null {
            const isDiver = !!cfg.diveCfgs;
            return {
                titleText   : Lang.getText(LangTextType.B0439),
                valueText   : isDiver ? Lang.getText(LangTextType.B0012) : Lang.getText(LangTextType.B0013),
            };
        }

        private _createDataForListDamageChart(): DataForDamageRenderer[] {
            const selectedIndex     = this.getSelectedIndex();
            const dataArrayForUnit  = this._dataForListUnit;
            const dataForUnit       = (selectedIndex == null) || (dataArrayForUnit == null) ? null : dataArrayForUnit[selectedIndex];
            const dataArray         : DataForDamageRenderer[] = [];
            if (dataForUnit) {
                const configVersion     = dataForUnit.configVersion;
                const attackUnitType    = dataForUnit.unitType;
                const playerIndex       = CommonConstants.WarFirstPlayerIndex;
                for (const targetUnitType of ConfigManager.getUnitTypesByCategory(configVersion, Types.UnitCategory.All)) {
                    dataArray.push({
                        configVersion,
                        attackUnitType,
                        targetUnitType,
                        playerIndex,
                    });
                }
                for (const targetTileType of ConfigManager.getTileTypesByCategory(configVersion, Types.TileCategory.Destroyable)) {
                    dataArray.push({
                        configVersion,
                        attackUnitType,
                        targetTileType,
                    });
                }
            }

            return dataArray.sort(sorterForDataForList);
        }

        private _createDataForListUnit(): DataForUnitRenderer[] {
            const data          : DataForUnitRenderer[] = [];
            const configVersion = Helpers.getExisted(ConfigManager.getLatestConfigVersion());
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
    };
    class UnitRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForUnitRenderer> {
        private readonly _imgChoose!    : eui.Image;
        private readonly _labelName!    : TwnsUiLabel.UiLabel;

        protected _onOpened(): void {
            this._setUiListenerArray([
                { ui: this._imgChoose,  callback: this._onTouchedImgChoose },
            ]);
        }

        protected _onDataChanged(): void {
            const data              = this._getData();
            this._labelName.text    = Lang.getUnitName(data.unitType) ?? CommonConstants.ErrorTextForUndefined;
        }

        private _onTouchedImgChoose(): void {
            const data = this._getData();
            data.panel.setSelectedIndexAndUpdateView(data.index);
        }
    }

    type DataForInfoRenderer = {
        titleText   : string;
        valueText   : string;
    };
    class InfoRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForInfoRenderer> {
        private readonly _btnTitle!     : TwnsUiButton.UiButton;
        private readonly _labelValue!   : TwnsUiLabel.UiLabel;

        protected _onDataChanged(): void {
            const data              = this._getData();
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
    };
    class DamageRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForDamageRenderer> {
        private readonly _group!                : eui.Group;
        private readonly _conView!              : eui.Group;
        private readonly _unitView              = new WarMapUnitView();
        private readonly _tileView!             : TwnsUiImage.UiImage;
        private readonly _labelPrimaryAttack!   : TwnsUiLabel.UiLabel;
        private readonly _labelSecondaryAttack! : TwnsUiLabel.UiLabel;
        private readonly _labelPrimaryDefend!   : TwnsUiLabel.UiLabel;
        private readonly _labelSecondaryDefend! : TwnsUiLabel.UiLabel;

        protected _onOpened(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.UnitAnimationTick,  callback: this._onNotifyUnitAnimationTick },
            ]);

            this._conView.addChild(this._unitView);
        }

        private _onNotifyUnitAnimationTick(): void {
            if (this.data) {
                this._unitView.updateOnAnimationTick(Timer.getUnitAnimationTickCount());
            }
        }

        protected _onDataChanged(): void {
            this._updateView();
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Functions for view.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _updateView(): void {
            const data              = this._getData();
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
                }, Timer.getUnitAnimationTickCount());

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

                const targetTileType            = Helpers.getExisted(data.targetTileType);
                const attackCfg                 = ConfigManager.getDamageChartCfgs(configVersion, attackUnitType);
                const targetCfg                 = ConfigManager.getTileTemplateCfgByType(configVersion, targetTileType);
                const targetArmorType           = Helpers.getExisted(targetCfg.armorType);
                const primaryAttackDamage       = attackCfg[targetArmorType][Types.WeaponType.Primary].damage;
                const secondaryAttackDamage     = attackCfg[targetArmorType][Types.WeaponType.Secondary].damage;
                this._tileView.source           = CommonModel.getCachedTileObjectImageSource({
                    version     : UserModel.getSelfSettingsTextureVersion(),
                    skinId      : CommonConstants.UnitAndTileNeutralSkinId,
                    objectType  : ConfigManager.getTileObjectTypeByTileType(targetTileType),
                    isDark      : false,
                    shapeId     : 0,
                    tickCount   : Timer.getTileAnimationTickCount(),
                });
                this._labelPrimaryAttack.text   = primaryAttackDamage == null ? `--` : `${primaryAttackDamage}`;
                this._labelSecondaryAttack.text = secondaryAttackDamage == null ? `--` : `${secondaryAttackDamage}`;
                this._labelPrimaryDefend.text   = `--`;
                this._labelSecondaryDefend.text = `--`;
            }
        }
    }
}

export default TwnsCommonDamageChartPanel;
