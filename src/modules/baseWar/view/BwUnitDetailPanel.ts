
import * as Notify                  from "../../../utility/Notify";
import * as Lang                    from "../../../utility/Lang";
import * as Types                   from "../../../utility/Types";
import * as FloatText               from "../../../utility/FloatText";
import * as ConfigManager           from "../../../utility/ConfigManager";
import * as ProtoTypes              from "../../../utility/ProtoTypes";
import * as CommonConstants         from "../../../utility/CommonConstants";
import * as TimeModel               from "../../time/model/TimeModel";
import * as CommonModel             from "../../common/model/CommonModel";
import * as UserModel               from "../../user/model/UserModel";
import { BwUnit }                   from "../model/BwUnit";
import { WarMapUnitView }           from "../../warMap/view/WarMapUnitView";
import { CommonDamageChartPanel }   from "../../common/view/CommonDamageChartPanel";
import { CommonInputPanel }         from "../../common/view/CommonInputPanel";
import { CommonConfirmPanel }       from "../../common/view/CommonConfirmPanel";
import { UiPanel }                  from "../../../gameui/UiPanel";
import { UiScrollList }             from "../../../gameui/UiScrollList";
import { UiButton }                 from "../../../gameui/UiButton";
import { UiLabel }                  from "../../../gameui/UiLabel";
import { UiListItemRenderer }       from "../../../gameui/UiListItemRenderer";
import { UiImage }                  from "../../../gameui/UiImage";
import UnitType                     = Types.UnitType;
import TileType                     = Types.TileType;

export type OpenDataForBwUnitDetailPanel = {
    unit: BwUnit;
};

export class BwUnitDetailPanel extends UiPanel<OpenDataForBwUnitDetailPanel> {
    protected readonly _LAYER_TYPE   = Types.LayerType.Hud0;
    protected readonly _IS_EXCLUSIVE = false;

    private static _instance: BwUnitDetailPanel;

    private _group              : eui.Group;
    private _conUnitView        : eui.Group;
    private _labelName          : UiLabel;
    private _btnUnitsInfo       : UiButton;

    private _listInfo           : UiScrollList<DataForInfoRenderer>;
    private _listDamageChart    : UiScrollList<DataForDamageRenderer>;
    private _labelDamageChart   : UiLabel;
    private _labelOffenseMain1  : UiLabel;
    private _labelOffenseSub1   : UiLabel;
    private _labelDefenseMain1  : UiLabel;
    private _labelDefenseSub1   : UiLabel;
    private _labelOffenseMain2  : UiLabel;
    private _labelOffenseSub2   : UiLabel;
    private _labelDefenseMain2  : UiLabel;
    private _labelDefenseSub2   : UiLabel;

    private _dataForList: DataForDamageRenderer[];
    private _unitView   = new WarMapUnitView();

    public static show(openData: OpenDataForBwUnitDetailPanel): void {
        if (!BwUnitDetailPanel._instance) {
            BwUnitDetailPanel._instance = new BwUnitDetailPanel();
        }
        BwUnitDetailPanel._instance.open(openData);
    }
    public static async hide(): Promise<void> {
        if (BwUnitDetailPanel._instance) {
            await BwUnitDetailPanel._instance.close();
        }
    }
    public static getIsOpening(): boolean {
        const instance = BwUnitDetailPanel._instance;
        return instance ? instance.getIsOpening() : false;
    }

    public constructor() {
        super();

        this._setIsTouchMaskEnabled();
        this._setIsCloseOnTouchedMask();
        this.skinName = `resource/skins/baseWar/BwUnitDetailPanel.exml`;
    }

    protected _onOpened(): void {
        this._setNotifyListenerArray([
            { type: Notify.Type.LanguageChanged,                callback: this._onNotifyLanguageChanged },
            { type: Notify.Type.UnitAnimationTick,              callback: this._onNotifyUnitAnimationTick },
            { type: Notify.Type.BwActionPlannerStateChanged,    callback: this._onNotifyBwPlannerStateChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._btnUnitsInfo,   callback: this._onTouchedBtnUnitsInfo },
        ]);

        this._listDamageChart.setItemRenderer(DamageRenderer);
        this._listInfo.setItemRenderer(InfoRenderer);
        this._conUnitView.addChild(this._unitView);

        this._updateView();
    }
    protected async _onClosed(): Promise<void> {
        this._dataForList = null;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Callbacks.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _onNotifyUnitAnimationTick(): void {
        this._unitView.updateOnAnimationTick(TimeModel.getUnitAnimationTickCount());
    }
    private _onNotifyBwPlannerStateChanged(): void {
        this.close();
    }

    private _onTouchedBtnUnitsInfo(): void {
        this.close();
        CommonDamageChartPanel.show();
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
        this._btnUnitsInfo.label        = Lang.getText(Lang.Type.B0440);
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
        const unit              = this._getOpenData().unit;
        this._labelName.text    = Lang.getUnitName(unit.getUnitType());
        this._unitView.update({
            gridIndex       : { x: 0, y: 0},
            skinId          : unit.getSkinId(),
            unitType        : unit.getUnitType(),
            actionState     : unit.getActionState(),
        }, TimeModel.getUnitAnimationTickCount());
    }

    private _updateListInfo(): void {
        const unit          = this._getOpenData().unit;
        const configVersion = unit.getConfigVersion();
        const unitType      = unit.getUnitType();
        const cfg           = ConfigManager.getUnitTemplateCfg(configVersion, unitType);
        const war           = unit.getWar();
        const isCheating    = war.getCanCheat();

        const dataList: DataForInfoRenderer[] = [
            this._createInfoHp(unit, cfg, isCheating),
            {
                // Production Cost
                titleText               : Lang.getText(Lang.Type.B0341),
                valueText               : `${cfg.productionCost}`,
                callbackOnTouchedTitle  : null,
            },
            {
                // Movement
                titleText               : Lang.getText(Lang.Type.B0340),
                valueText               : `${cfg.moveRange} (${Lang.getMoveTypeName(cfg.moveType)})`,
                callbackOnTouchedTitle  : null,
            },
            this._createInfoFuel(unit, cfg, isCheating),
            {
                // Fuel consumption
                titleText               : Lang.getText(Lang.Type.B0343),
                valueText               : `${cfg.fuelConsumptionPerTurn}${cfg.diveCfgs == null ? `` : ` (${cfg.diveCfgs[0]})`}`,
                callbackOnTouchedTitle  : null,
            },
            {
                // Destroy on out of fuel
                titleText               : Lang.getText(Lang.Type.B0344),
                valueText               : (unit && unit.checkIsDestroyedOnOutOfFuel()) || (cfg.isDestroyedOnOutOfFuel)
                    ? Lang.getText(Lang.Type.B0012)
                    : Lang.getText(Lang.Type.B0013),
                callbackOnTouchedTitle  : null,
            },
            this._createInfoPromotion(unit, cfg, isCheating),
            {
                // Attack range
                titleText               : Lang.getText(Lang.Type.B0345),
                valueText               : cfg.minAttackRange == null ? Lang.getText(Lang.Type.B0001) : `${cfg.minAttackRange} - ${cfg.maxAttackRange}`,
                callbackOnTouchedTitle  : null,
            },
            {
                // Attack after move
                titleText               : Lang.getText(Lang.Type.B0346),
                valueText               : cfg.canAttackAfterMove ? Lang.getText(Lang.Type.B0012) : Lang.getText(Lang.Type.B0013),
                callbackOnTouchedTitle  : null,
            },
            {
                // Vision range
                titleText               : Lang.getText(Lang.Type.B0354),
                valueText               : unit ? `${unit.getCfgVisionRange()}` : `${cfg.visionRange}`,
                callbackOnTouchedTitle  : null,
            },
            this._createInfoPrimaryWeaponAmmo(unit, cfg, isCheating),
            this._createInfoBuildMaterial(unit, cfg, isCheating),
            this._createInfoProduceMaterial(unit, cfg, isCheating),
            this._createInfoFlareAmmo(unit, cfg, isCheating),
            this._createInfoActionState(unit, cfg, isCheating),
            this._createInfoDiving(unit, cfg, isCheating),
            this._createInfoCo(unit, cfg, isCheating),
        ].filter(v => !!v);

        this._listInfo.bindData(dataList);
    }

    private _createInfoHp(unit: BwUnit, cfg: ProtoTypes.Config.IUnitTemplateCfg, isCheating: boolean): DataForInfoRenderer {
        const currValue = unit.getCurrentHp();
        const maxValue  = unit.getMaxHp();
        const minValue  = 1;
        return {
            titleText               : Lang.getText(Lang.Type.B0339),
            valueText               : `${currValue} / ${maxValue}`,
            callbackOnTouchedTitle  : !isCheating
                ? null
                : () => {
                    CommonInputPanel.show({
                        title           : Lang.getText(Lang.Type.B0339),
                        currentValue    : "" + currValue,
                        maxChars        : 3,
                        charRestrict    : "0-9",
                        tips            : `${Lang.getText(Lang.Type.B0319)}: [${minValue}, ${maxValue}]`,
                        callback        : panel => {
                            const text  = panel.getInputText();
                            const value = text ? Number(text) : NaN;
                            if ((isNaN(value)) || (value > maxValue) || (value < minValue)) {
                                FloatText.show(Lang.getText(Lang.Type.A0098));
                            } else {
                                unit.setCurrentHp(value);
                                unit.updateView();
                                this._updateListInfo();
                            }
                        },
                    });
                },
        };
    }

    private _createInfoFuel(
        unit        : BwUnit,
        cfg         : ProtoTypes.Config.IUnitTemplateCfg,
        isCheating  : boolean
    ): DataForInfoRenderer {
        const currValue = unit.getCurrentFuel();
        const maxValue  = unit.getMaxFuel();
        const minValue  = 0;
        return {
            titleText               : Lang.getText(Lang.Type.B0342),
            valueText               : `${currValue} / ${maxValue}`,
            callbackOnTouchedTitle  : !isCheating
                ? null
                : () => {
                    CommonInputPanel.show({
                        title           : Lang.getText(Lang.Type.B0342),
                        currentValue    : "" + currValue,
                        maxChars        : 2,
                        charRestrict    : "0-9",
                        tips            : `${Lang.getText(Lang.Type.B0319)}: [${minValue}, ${maxValue}]`,
                        callback        : panel => {
                            const text  = panel.getInputText();
                            const value = text ? Number(text) : NaN;
                            if ((isNaN(value)) || (value > maxValue) || (value < minValue)) {
                                FloatText.show(Lang.getText(Lang.Type.A0098));
                            } else {
                                unit.setCurrentFuel(value);
                                unit.updateView();
                                this._updateListInfo();
                            }
                        },
                    });
                },
        };
    }

    private _createInfoPromotion(
        unit        : BwUnit,
        cfg         : ProtoTypes.Config.IUnitTemplateCfg,
        isCheating  : boolean
    ): DataForInfoRenderer | null {
        const maxValue = unit.getMaxPromotion();
        if (maxValue == null) {
            return null;
        } else {
            const currValue = unit.getCurrentPromotion();
            const minValue  = 0;
            return {
                titleText               : Lang.getText(Lang.Type.B0370),
                valueText               : `${currValue} / ${maxValue}`,
                callbackOnTouchedTitle  : !isCheating
                    ? null
                    : () => {
                        CommonInputPanel.show({
                            title           : Lang.getText(Lang.Type.B0370),
                            currentValue    : "" + currValue,
                            maxChars        : 1,
                            charRestrict    : "0-9",
                            tips            : `${Lang.getText(Lang.Type.B0319)}: [${minValue}, ${maxValue}]`,
                            callback        : panel => {
                                const text  = panel.getInputText();
                                const value = text ? Number(text) : NaN;
                                if ((isNaN(value)) || (value > maxValue) || (value < minValue)) {
                                    FloatText.show(Lang.getText(Lang.Type.A0098));
                                } else {
                                    unit.setCurrentPromotion(value);
                                    unit.updateView();
                                    this._updateListInfo();
                                }
                            },
                        });
                    },
            };
        }
    }

    private _createInfoPrimaryWeaponAmmo(
        unit        : BwUnit,
        cfg         : ProtoTypes.Config.IUnitTemplateCfg,
        isCheating  : boolean
    ): DataForInfoRenderer | null {
        const maxValue = unit.getPrimaryWeaponMaxAmmo();
        if (maxValue == null) {
            return null;
        } else {
            const currValue = unit.getPrimaryWeaponCurrentAmmo();
            const minValue  = 0;
            return {
                titleText               : Lang.getText(Lang.Type.B0350),
                valueText               : `${currValue} / ${maxValue}`,
                callbackOnTouchedTitle  : !isCheating
                    ? null
                    : () => {
                        CommonInputPanel.show({
                            title           : Lang.getText(Lang.Type.B0350),
                            currentValue    : "" + currValue,
                            maxChars        : 2,
                            charRestrict    : "0-9",
                            tips            : `${Lang.getText(Lang.Type.B0319)}: [${minValue}, ${maxValue}]`,
                            callback        : panel => {
                                const text  = panel.getInputText();
                                const value = text ? Number(text) : NaN;
                                if ((isNaN(value)) || (value > maxValue) || (value < minValue)) {
                                    FloatText.show(Lang.getText(Lang.Type.A0098));
                                } else {
                                    unit.setPrimaryWeaponCurrentAmmo(value);
                                    unit.updateView();
                                    this._updateListInfo();
                                }
                            },
                        });
                    },
            };
        }
    }

    private _createInfoBuildMaterial(
        unit        : BwUnit,
        cfg         : ProtoTypes.Config.IUnitTemplateCfg,
        isCheating  : boolean
    ): DataForInfoRenderer | null {
        const maxValue = unit.getMaxBuildMaterial();
        if (maxValue == null) {
            return null;
        } else {
            const currValue = unit.getCurrentBuildMaterial();
            const minValue  = 0;
            return {
                titleText               : Lang.getText(Lang.Type.B0347),
                valueText               : `${currValue} / ${maxValue}`,
                callbackOnTouchedTitle  : !isCheating
                    ? null
                    : () => {
                        CommonInputPanel.show({
                            title           : Lang.getText(Lang.Type.B0347),
                            currentValue    : "" + currValue,
                            maxChars        : 2,
                            charRestrict    : "0-9",
                            tips            : `${Lang.getText(Lang.Type.B0319)}: [${minValue}, ${maxValue}]`,
                            callback        : panel => {
                                const text  = panel.getInputText();
                                const value = text ? Number(text) : NaN;
                                if ((isNaN(value)) || (value > maxValue) || (value < minValue)) {
                                    FloatText.show(Lang.getText(Lang.Type.A0098));
                                } else {
                                    unit.setCurrentBuildMaterial(value);
                                    unit.updateView();
                                    this._updateListInfo();
                                }
                            },
                        });
                    },
            };
        }
    }

    private _createInfoProduceMaterial(
        unit        : BwUnit,
        cfg         : ProtoTypes.Config.IUnitTemplateCfg,
        isCheating  : boolean
    ): DataForInfoRenderer | null {
        const maxValue = unit.getMaxProduceMaterial();
        if (maxValue == null) {
            return null;
        } else {
            const currValue = unit.getCurrentProduceMaterial();
            const minValue  = 0;
            return {
                titleText               : Lang.getText(Lang.Type.B0348),
                valueText               : `${currValue} / ${maxValue}`,
                callbackOnTouchedTitle  : !isCheating
                    ? null
                    : () => {
                        CommonInputPanel.show({
                            title           : Lang.getText(Lang.Type.B0348),
                            currentValue    : "" + currValue,
                            maxChars        : 2,
                            charRestrict    : "0-9",
                            tips            : `${Lang.getText(Lang.Type.B0319)}: [${minValue}, ${maxValue}]`,
                            callback        : panel => {
                                const text  = panel.getInputText();
                                const value = text ? Number(text) : NaN;
                                if ((isNaN(value)) || (value > maxValue) || (value < minValue)) {
                                    FloatText.show(Lang.getText(Lang.Type.A0098));
                                } else {
                                    unit.setCurrentProduceMaterial(value);
                                    unit.updateView();
                                    this._updateListInfo();
                                }
                            },
                        });
                    },
            };
        }
    }

    private _createInfoFlareAmmo(
        unit        : BwUnit,
        cfg         : ProtoTypes.Config.IUnitTemplateCfg,
        isCheating  : boolean
    ): DataForInfoRenderer | null {
        const maxValue = unit.getFlareMaxAmmo();
        if (maxValue == null) {
            return null;
        } else {
            const currValue = unit.getFlareCurrentAmmo();
            const minValue  = 0;
            return {
                titleText               : Lang.getText(Lang.Type.B0349),
                valueText               : `${currValue} / ${maxValue}`,
                callbackOnTouchedTitle  : !isCheating
                    ? null
                    : () => {
                        CommonInputPanel.show({
                            title           : Lang.getText(Lang.Type.B0349),
                            currentValue    : "" + currValue,
                            maxChars        : 2,
                            charRestrict    : "0-9",
                            tips            : `${Lang.getText(Lang.Type.B0319)}: [${minValue}, ${maxValue}]`,
                            callback        : panel => {
                                const text  = panel.getInputText();
                                const value = text ? Number(text) : NaN;
                                if ((isNaN(value)) || (value > maxValue) || (value < minValue)) {
                                    FloatText.show(Lang.getText(Lang.Type.A0098));
                                } else {
                                    unit.setFlareCurrentAmmo(value);
                                    unit.updateView();
                                    this._updateListInfo();
                                }
                            },
                        });
                    },
            };
        }
    }

    private _createInfoActionState(
        unit        : BwUnit,
        cfg         : ProtoTypes.Config.IUnitTemplateCfg,
        isCheating  : boolean
    ): DataForInfoRenderer | null {
        if (!isCheating) {
            return null;
        } else {
            const state = unit.getActionState();
            return {
                titleText               : Lang.getText(Lang.Type.B0367),
                valueText               : Lang.getUnitActionStateText(state),
                callbackOnTouchedTitle  : () => {
                    CommonConfirmPanel.show({
                        title       : Lang.getText(Lang.Type.B0349),
                        content     : Lang.getText(Lang.Type.A0113),
                        callback    : () => {
                            unit.setActionState(state === Types.UnitActionState.Acted ? Types.UnitActionState.Idle : Types.UnitActionState.Acted);
                            unit.updateView();
                            this._updateListInfo();
                        }
                    });
                },
            };
        }
    }

    private _createInfoDiving(
        unit        : BwUnit,
        cfg         : ProtoTypes.Config.IUnitTemplateCfg,
        isCheating  : boolean
    ): DataForInfoRenderer | null {
        if (!unit.checkIsDiver()) {
            return null;
        } else {
            const isDiving = unit.getIsDiving();
            return {
                titleText               : Lang.getText(Lang.Type.B0371),
                valueText               : isDiving ? Lang.getText(Lang.Type.B0012) : Lang.getText(Lang.Type.B0013),
                callbackOnTouchedTitle  : !isCheating
                    ? null
                    : () => {
                        CommonConfirmPanel.show({
                            title       : Lang.getText(Lang.Type.B0371),
                            content     : Lang.getText(Lang.Type.A0114),
                            callback    : () => {
                                unit.setIsDiving(!isDiving);
                                unit.updateView();
                                this._updateListInfo();
                            }
                        });
                },
            };
        }
    }

    private _createInfoCo(
        unit        : BwUnit,
        cfg         : ProtoTypes.Config.IUnitTemplateCfg,
        isCheating  : boolean
    ): DataForInfoRenderer | null {
        const hasLoadedCo = unit.getHasLoadedCo();
        return {
            titleText               : Lang.getText(Lang.Type.B0421),
            valueText               : hasLoadedCo ? Lang.getText(Lang.Type.B0012) : Lang.getText(Lang.Type.B0013),
            callbackOnTouchedTitle  : !isCheating
                ? null
                : () => {
                    unit.setHasLoadedCo(!hasLoadedCo);
                    unit.updateView();
                    this._updateListInfo();

                    unit.getWar().getTileMap().getView().updateCoZone();
                },
        };
    }

    private _updateListDamageChart(): void {
        this._dataForList = this._createDataForListDamageChart();
        this._listDamageChart.bindData(this._dataForList);
    }

    private _createDataForListDamageChart(): DataForDamageRenderer[] {
        const unit              = this._getOpenData().unit;
        const configVersion     = unit.getConfigVersion();
        const attackUnitType    = unit.getUnitType();
        const playerIndex       = unit.getPlayerIndex();

        const dataList: DataForDamageRenderer[] = [];
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
    titleText               : string;
    valueText               : string;
    callbackOnTouchedTitle  : (() => void) | null;
};

class InfoRenderer extends UiListItemRenderer<DataForInfoRenderer> {
    private _btnTitle   : UiButton;
    private _labelValue : UiLabel;

    protected _onOpened(): void {
        this._setUiListenerArray([
            { ui: this._btnTitle, callback: this._onTouchedBtnTitle },
        ]);
    }

    protected _onDataChanged(): void {
        const data              = this.data;
        this._labelValue.text   = data.valueText;
        this._btnTitle.label    = data.titleText;
        this._btnTitle.setTextColor(data.callbackOnTouchedTitle ? 0x00FF00 : 0xFFFFFF);
    }

    private _onTouchedBtnTitle(): void {
        const data      = this.data;
        const callback  = data ? data.callbackOnTouchedTitle : null;
        (callback) && (callback());
    }
}

type DataForDamageRenderer = {
    configVersion   : string;
    attackUnitType  : UnitType;
    playerIndex?    : number;
    targetUnitType? : UnitType;
    targetTileType? : TileType;
};

class DamageRenderer extends UiListItemRenderer<DataForDamageRenderer> {
    private _group                  : eui.Group;
    private _conView                : eui.Group;
    private _unitView               : WarMapUnitView;
    private _tileView               : UiImage;
    private _labelPrimaryAttack     : UiLabel;
    private _labelSecondaryAttack   : UiLabel;
    private _labelPrimaryDefend     : UiLabel;
    private _labelSecondaryDefend   : UiLabel;

    protected _onOpened(): void {
        this._setNotifyListenerArray([
            { type: Notify.Type.UnitAnimationTick,  callback: this._onNotifyUnitAnimationTick },
        ]);

        this._unitView = new WarMapUnitView();
        this._conView.addChild(this._unitView);
    }

    private _onNotifyUnitAnimationTick(): void {
        if (this.data) {
            this._unitView.updateOnAnimationTick(TimeModel.getUnitAnimationTickCount());
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
            }, TimeModel.getUnitAnimationTickCount());

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
            const targetCfg                 = ConfigManager.getTileTemplateCfgByType(configVersion, targetTileType);
            const targetArmorType           = targetCfg.armorType;
            const primaryAttackDamage       = attackCfg[targetArmorType][Types.WeaponType.Primary].damage;
            const secondaryAttackDamage     = attackCfg[targetArmorType][Types.WeaponType.Secondary].damage;
            this._tileView.source           = CommonModel.getCachedTileObjectImageSource({
                version     : UserModel.getSelfSettingsTextureVersion(),
                skinId      : CommonConstants.UnitAndTileNeutralSkinId,
                objectType  : ConfigManager.getTileObjectTypeByTileType(targetTileType),
                isDark      : false,
                shapeId     : 0,
                tickCount   : TimeModel.getTileAnimationTickCount(),
            });
            this._labelPrimaryAttack.text   = primaryAttackDamage == null ? `--` : `${primaryAttackDamage}`;
            this._labelSecondaryAttack.text = secondaryAttackDamage == null ? `--` : `${secondaryAttackDamage}`;
            this._labelPrimaryDefend.text   = `--`;
            this._labelSecondaryDefend.text = `--`;
        }
    }
}
