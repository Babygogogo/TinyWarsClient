
import CommonModel                  from "../../common/model/CommonModel";
import TwnsCommonConfirmPanel       from "../../common/view/CommonConfirmPanel";
import TwnsCommonDamageChartPanel   from "../../common/view/CommonDamageChartPanel";
import TwnsCommonInputPanel         from "../../common/view/CommonInputPanel";
import CommonConstants              from "../../tools/helpers/CommonConstants";
import CompatibilityHelpers         from "../../tools/helpers/CompatibilityHelpers";
import ConfigManager                from "../../tools/helpers/ConfigManager";
import FloatText                    from "../../tools/helpers/FloatText";
import Helpers                      from "../../tools/helpers/Helpers";
import Timer                        from "../../tools/helpers/Timer";
import Types                        from "../../tools/helpers/Types";
import Lang                         from "../../tools/lang/Lang";
import TwnsLangTextType             from "../../tools/lang/LangTextType";
import TwnsNotifyType               from "../../tools/notify/NotifyType";
import ProtoTypes                   from "../../tools/proto/ProtoTypes";
import TwnsUiButton                 from "../../tools/ui/UiButton";
import TwnsUiImage                  from "../../tools/ui/UiImage";
import TwnsUiLabel                  from "../../tools/ui/UiLabel";
import TwnsUiListItemRenderer       from "../../tools/ui/UiListItemRenderer";
import TwnsUiPanel                  from "../../tools/ui/UiPanel";
import TwnsUiScrollList             from "../../tools/ui/UiScrollList";
import UserModel                    from "../../user/model/UserModel";
import TwnsWarMapUnitView           from "../../warMap/view/WarMapUnitView";
import TwnsBwUnit                   from "../model/BwUnit";

namespace TwnsBwUnitDetailPanel {
    import NotifyType               = TwnsNotifyType.NotifyType;
    import LangTextType             = TwnsLangTextType.LangTextType;
    import WarMapUnitView           = TwnsWarMapUnitView.WarMapUnitView;
    import CommonDamageChartPanel   = TwnsCommonDamageChartPanel.CommonDamageChartPanel;
    import CommonConfirmPanel       = TwnsCommonConfirmPanel.CommonConfirmPanel;
    import UnitType                 = Types.UnitType;
    import TileType                 = Types.TileType;
    import BwUnit                   = TwnsBwUnit.BwUnit;

    export type OpenDataForBwUnitDetailPanel = {
        unit: BwUnit;
    };

    export class BwUnitDetailPanel extends TwnsUiPanel.UiPanel<OpenDataForBwUnitDetailPanel> {
        protected readonly _LAYER_TYPE   = Types.LayerType.Hud0;
        protected readonly _IS_EXCLUSIVE = false;

        private static _instance: BwUnitDetailPanel;

        private readonly _group!                : eui.Group;
        private readonly _conUnitView!          : eui.Group;
        private readonly _labelName!            : TwnsUiLabel.UiLabel;
        private readonly _btnUnitsInfo!         : TwnsUiButton.UiButton;

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

        private _unitView   = new WarMapUnitView();

        public static show(openData: OpenDataForBwUnitDetailPanel): void {
            if (!BwUnitDetailPanel._instance) {
                BwUnitDetailPanel._instance = new BwUnitDetailPanel();
            }
            BwUnitDetailPanel._instance.open(openData);
        }
        public static async hide(): Promise<void> {
            if (BwUnitDetailPanel._instance) {
                await BwUnitDetailPanel._instance.close().catch(err => { CompatibilityHelpers.showError(err); throw err; });
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
                { type: NotifyType.LanguageChanged,                callback: this._onNotifyLanguageChanged },
                { type: NotifyType.UnitAnimationTick,              callback: this._onNotifyUnitAnimationTick },
                { type: NotifyType.BwActionPlannerStateChanged,    callback: this._onNotifyBwPlannerStateChanged },
            ]);
            this._setUiListenerArray([
                { ui: this._btnUnitsInfo,   callback: this._onTouchedBtnUnitsInfo },
            ]);

            this._listDamageChart.setItemRenderer(DamageRenderer);
            this._listInfo.setItemRenderer(InfoRenderer);
            this._conUnitView.addChild(this._unitView);

            this._updateView();
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
            this._btnUnitsInfo.label        = Lang.getText(LangTextType.B0440);
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
            const unit              = this._getOpenData().unit;
            this._labelName.text    = Lang.getUnitName(unit.getUnitType()) ?? CommonConstants.ErrorTextForUndefined;
            this._unitView.update({
                gridIndex       : { x: 0, y: 0},
                skinId          : unit.getSkinId(),
                unitType        : unit.getUnitType(),
                actionState     : unit.getActionState(),
            }, Timer.getUnitAnimationTickCount());
        }

        private _updateListInfo(): void {
            const unit          = this._getOpenData().unit;
            const configVersion = unit.getConfigVersion();
            const unitType      = unit.getUnitType();
            const cfg           = ConfigManager.getUnitTemplateCfg(configVersion, unitType);
            const war           = unit.getWar();
            const isCheating    = war.getCanCheat();
            this._listInfo.bindData(Helpers.getNonNullElements([
                this._createInfoHp(unit, cfg, isCheating),
                {
                    // Production Cost
                    titleText               : Lang.getText(LangTextType.B0341),
                    valueText               : `${cfg.productionCost}`,
                    callbackOnTouchedTitle  : null,
                },
                {
                    // Movement
                    titleText               : Lang.getText(LangTextType.B0340),
                    valueText               : `${cfg.moveRange} (${Lang.getMoveTypeName(cfg.moveType)})`,
                    callbackOnTouchedTitle  : null,
                },
                this._createInfoFuel(unit, cfg, isCheating),
                {
                    // Fuel consumption
                    titleText               : Lang.getText(LangTextType.B0343),
                    valueText               : `${cfg.fuelConsumptionPerTurn}${cfg.diveCfgs == null ? `` : ` (${cfg.diveCfgs[0]})`}`,
                    callbackOnTouchedTitle  : null,
                },
                {
                    // Destroy on out of fuel
                    titleText               : Lang.getText(LangTextType.B0344),
                    valueText               : (unit && unit.checkIsDestroyedOnOutOfFuel()) || (cfg.isDestroyedOnOutOfFuel)
                        ? Lang.getText(LangTextType.B0012)
                        : Lang.getText(LangTextType.B0013),
                    callbackOnTouchedTitle  : null,
                },
                this._createInfoPromotion(unit, cfg, isCheating),
                {
                    // Attack range
                    titleText               : Lang.getText(LangTextType.B0345),
                    valueText               : cfg.minAttackRange == null ? Lang.getText(LangTextType.B0001) : `${cfg.minAttackRange} - ${cfg.maxAttackRange}`,
                    callbackOnTouchedTitle  : null,
                },
                {
                    // Attack after move
                    titleText               : Lang.getText(LangTextType.B0346),
                    valueText               : cfg.canAttackAfterMove ? Lang.getText(LangTextType.B0012) : Lang.getText(LangTextType.B0013),
                    callbackOnTouchedTitle  : null,
                },
                {
                    // Vision range
                    titleText               : Lang.getText(LangTextType.B0354),
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
            ]));
        }

        private _createInfoHp(unit: BwUnit, cfg: ProtoTypes.Config.IUnitTemplateCfg, isCheating: boolean): DataForInfoRenderer {
            const currValue = unit.getCurrentHp();
            const maxValue  = unit.getMaxHp();
            const minValue  = 1;
            return {
                titleText               : Lang.getText(LangTextType.B0339),
                valueText               : `${currValue} / ${maxValue}`,
                callbackOnTouchedTitle  : !isCheating
                    ? null
                    : () => {
                        TwnsCommonInputPanel.CommonInputPanel.show({
                            title           : Lang.getText(LangTextType.B0339),
                            currentValue    : "" + currValue,
                            maxChars        : 3,
                            charRestrict    : "0-9",
                            tips            : `${Lang.getText(LangTextType.B0319)}: [${minValue}, ${maxValue}]`,
                            callback        : panel => {
                                const text  = panel.getInputText();
                                const value = text ? Number(text) : NaN;
                                if ((isNaN(value)) || (value > maxValue) || (value < minValue)) {
                                    FloatText.show(Lang.getText(LangTextType.A0098));
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
                titleText               : Lang.getText(LangTextType.B0342),
                valueText               : `${currValue} / ${maxValue}`,
                callbackOnTouchedTitle  : !isCheating
                    ? null
                    : () => {
                        TwnsCommonInputPanel.CommonInputPanel.show({
                            title           : Lang.getText(LangTextType.B0342),
                            currentValue    : "" + currValue,
                            maxChars        : 2,
                            charRestrict    : "0-9",
                            tips            : `${Lang.getText(LangTextType.B0319)}: [${minValue}, ${maxValue}]`,
                            callback        : panel => {
                                const text  = panel.getInputText();
                                const value = text ? Number(text) : NaN;
                                if ((isNaN(value)) || (value > maxValue) || (value < minValue)) {
                                    FloatText.show(Lang.getText(LangTextType.A0098));
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
                    titleText               : Lang.getText(LangTextType.B0370),
                    valueText               : `${currValue} / ${maxValue}`,
                    callbackOnTouchedTitle  : !isCheating
                        ? null
                        : () => {
                            TwnsCommonInputPanel.CommonInputPanel.show({
                                title           : Lang.getText(LangTextType.B0370),
                                currentValue    : "" + currValue,
                                maxChars        : 1,
                                charRestrict    : "0-9",
                                tips            : `${Lang.getText(LangTextType.B0319)}: [${minValue}, ${maxValue}]`,
                                callback        : panel => {
                                    const text  = panel.getInputText();
                                    const value = text ? Number(text) : NaN;
                                    if ((isNaN(value)) || (value > maxValue) || (value < minValue)) {
                                        FloatText.show(Lang.getText(LangTextType.A0098));
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
                    titleText               : Lang.getText(LangTextType.B0350),
                    valueText               : `${currValue} / ${maxValue}`,
                    callbackOnTouchedTitle  : !isCheating
                        ? null
                        : () => {
                            TwnsCommonInputPanel.CommonInputPanel.show({
                                title           : Lang.getText(LangTextType.B0350),
                                currentValue    : "" + currValue,
                                maxChars        : 2,
                                charRestrict    : "0-9",
                                tips            : `${Lang.getText(LangTextType.B0319)}: [${minValue}, ${maxValue}]`,
                                callback        : panel => {
                                    const text  = panel.getInputText();
                                    const value = text ? Number(text) : NaN;
                                    if ((isNaN(value)) || (value > maxValue) || (value < minValue)) {
                                        FloatText.show(Lang.getText(LangTextType.A0098));
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
                    titleText               : Lang.getText(LangTextType.B0347),
                    valueText               : `${currValue} / ${maxValue}`,
                    callbackOnTouchedTitle  : !isCheating
                        ? null
                        : () => {
                            TwnsCommonInputPanel.CommonInputPanel.show({
                                title           : Lang.getText(LangTextType.B0347),
                                currentValue    : "" + currValue,
                                maxChars        : 2,
                                charRestrict    : "0-9",
                                tips            : `${Lang.getText(LangTextType.B0319)}: [${minValue}, ${maxValue}]`,
                                callback        : panel => {
                                    const text  = panel.getInputText();
                                    const value = text ? Number(text) : NaN;
                                    if ((isNaN(value)) || (value > maxValue) || (value < minValue)) {
                                        FloatText.show(Lang.getText(LangTextType.A0098));
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
                    titleText               : Lang.getText(LangTextType.B0348),
                    valueText               : `${currValue} / ${maxValue}`,
                    callbackOnTouchedTitle  : !isCheating
                        ? null
                        : () => {
                            TwnsCommonInputPanel.CommonInputPanel.show({
                                title           : Lang.getText(LangTextType.B0348),
                                currentValue    : "" + currValue,
                                maxChars        : 2,
                                charRestrict    : "0-9",
                                tips            : `${Lang.getText(LangTextType.B0319)}: [${minValue}, ${maxValue}]`,
                                callback        : panel => {
                                    const text  = panel.getInputText();
                                    const value = text ? Number(text) : NaN;
                                    if ((isNaN(value)) || (value > maxValue) || (value < minValue)) {
                                        FloatText.show(Lang.getText(LangTextType.A0098));
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
                    titleText               : Lang.getText(LangTextType.B0349),
                    valueText               : `${currValue} / ${maxValue}`,
                    callbackOnTouchedTitle  : !isCheating
                        ? null
                        : () => {
                            TwnsCommonInputPanel.CommonInputPanel.show({
                                title           : Lang.getText(LangTextType.B0349),
                                currentValue    : "" + currValue,
                                maxChars        : 2,
                                charRestrict    : "0-9",
                                tips            : `${Lang.getText(LangTextType.B0319)}: [${minValue}, ${maxValue}]`,
                                callback        : panel => {
                                    const text  = panel.getInputText();
                                    const value = text ? Number(text) : NaN;
                                    if ((isNaN(value)) || (value > maxValue) || (value < minValue)) {
                                        FloatText.show(Lang.getText(LangTextType.A0098));
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
                    titleText               : Lang.getText(LangTextType.B0367),
                    valueText               : Lang.getUnitActionStateText(state) ?? CommonConstants.ErrorTextForUndefined,
                    callbackOnTouchedTitle  : () => {
                        CommonConfirmPanel.show({
                            title       : Lang.getText(LangTextType.B0349),
                            content     : Lang.getText(LangTextType.A0113),
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
                    titleText               : Lang.getText(LangTextType.B0371),
                    valueText               : isDiving ? Lang.getText(LangTextType.B0012) : Lang.getText(LangTextType.B0013),
                    callbackOnTouchedTitle  : !isCheating
                        ? null
                        : () => {
                            CommonConfirmPanel.show({
                                title       : Lang.getText(LangTextType.B0371),
                                content     : Lang.getText(LangTextType.A0114),
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
                titleText               : Lang.getText(LangTextType.B0421),
                valueText               : hasLoadedCo ? Lang.getText(LangTextType.B0012) : Lang.getText(LangTextType.B0013),
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
            this._listDamageChart.bindData(this._createDataForListDamageChart());
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

    class InfoRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForInfoRenderer> {
        private readonly _btnTitle!     : TwnsUiButton.UiButton;
        private readonly _labelValue!   : TwnsUiLabel.UiLabel;

        protected _onOpened(): void {
            this._setUiListenerArray([
                { ui: this._btnTitle, callback: this._onTouchedBtnTitle },
            ]);
            this._setShortSfxCode(Types.ShortSfxCode.None);
        }

        protected _onDataChanged(): void {
            const data              = this._getData();
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
            this._setShortSfxCode(Types.ShortSfxCode.None);

            this._conView.addChild(this._unitView);
        }

        private _onNotifyUnitAnimationTick(): void {
            this._unitView.updateOnAnimationTick(Timer.getUnitAnimationTickCount());
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

export default TwnsBwUnitDetailPanel;
