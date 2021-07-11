
import { UiListItemRenderer }           from "../../../gameui/UiListItemRenderer";
import { UiButton }                     from "../../../gameui/UiButton";
import { UiLabel }                      from "../../../gameui/UiLabel";
import { UiScrollList }                 from "../../../gameui/UiScrollList";
import { UiTabPage }                    from "../../../gameui/UiTabPage";
import { CommonConfirmPanel }           from "../../common/view/CommonConfirmPanel";
import { CommonInputPanel }             from "../../common/view/CommonInputPanel";
import { CommonChooseCoPanel }          from "../../common/view/CommonChooseCoPanel";
import * as CommonConstants             from "../../../utility/CommonConstants";
import * as ConfigManager               from "../../../utility/ConfigManager";
import * as FloatText                   from "../../../utility/FloatText";
import * as Lang                        from "../../../utility/Lang";
import * as Notify                      from "../../../utility/Notify";
import * as MeModel                     from "../model/MeModel";

export class MeSimAdvancedSettingsPage extends UiTabPage<void> {
    private _labelMapNameTitle      : UiLabel;
    private _labelMapName           : UiLabel;
    private _labelPlayersCountTitle : UiLabel;
    private _labelPlayersCount      : UiLabel;
    private _labelPlayerList        : UiLabel;
    private _listPlayer             : UiScrollList<DataForPlayerRenderer>;

    public constructor() {
        super();

        this.skinName = "resource/skins/mapEditor/MeSimAdvancedSettingsPage.exml";
    }

    protected _onOpened(): void {
        this._setNotifyListenerArray([
            { type: Notify.Type.LanguageChanged,    callback: this._onNotifyLanguageChanged },
        ]);
        this._listPlayer.setItemRenderer(PlayerRenderer);

        this._updateComponentsForLanguage();
        this._updateLabelMapName();
        this._updateLabelPlayersCount();
        this._updateListPlayer();
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Event callbacks.
    ////////////////////////////////////////////////////////////////////////////////
    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    ////////////////////////////////////////////////////////////////////////////////
    // View functions.
    ////////////////////////////////////////////////////////////////////////////////
    private _updateComponentsForLanguage(): void {
        this._labelMapNameTitle.text        = `${Lang.getText(Lang.Type.B0225)}:`;
        this._labelPlayersCountTitle.text   = `${Lang.getText(Lang.Type.B0229)}:`;
        this._labelPlayerList.text          = Lang.getText(Lang.Type.B0395);
    }

    private _updateLabelMapName(): void {
        this._labelMapName.text = Lang.getLanguageText({ textArray: MeModel.Sim.getMapRawData().mapNameArray });
    }

    private _updateLabelPlayersCount(): void {
        this._labelPlayersCount.text = "" + MeModel.Sim.getMapRawData().playersCountUnneutral;
    }

    private _updateListPlayer(): void {
        const playersCount  = MeModel.Sim.getMapRawData().playersCountUnneutral;
        const dataList      : DataForPlayerRenderer[] = [];
        for (let playerIndex = 1; playerIndex <= playersCount; ++playerIndex) {
            dataList.push({ playerIndex });
        }
        this._listPlayer.bindData(dataList);
    }
}

type DataForPlayerRenderer = {
    playerIndex : number;
};
class PlayerRenderer extends UiListItemRenderer<DataForPlayerRenderer> {
    private _listInfo   : UiScrollList<DataForInfoRenderer>;

    protected _onOpened(): void {
        this._listInfo.setItemRenderer(InfoRenderer);
    }

    protected _onDataChanged(): void {
        this._updateView();
    }

    private _updateView(): void {
        this._listInfo.visible  = true;
        this._listInfo.bindData(this._createDataForListInfo());
    }

    private _createDataForListInfo(): DataForInfoRenderer[] {
        const data          = this.data;
        const playerIndex   = data.playerIndex;
        return [
            this._createDataController(playerIndex),
            this._createDataTeamIndex(playerIndex),
            this._createDataCo(playerIndex),
            this._createDataSkinId(playerIndex),
            this._createDataInitialFund(playerIndex),
            this._createDataIncomeMultiplier(playerIndex),
            this._createDataEnergyAddPctOnLoadCo(playerIndex),
            this._createDataEnergyGrowthMultiplier(playerIndex),
            this._createDataMoveRangeModifier(playerIndex),
            this._createDataAttackPowerModifier(playerIndex),
            this._createDataVisionRangeModifier(playerIndex),
            this._createDataLuckLowerLimit(playerIndex),
            this._createDataLuckUpperLimit(playerIndex),
        ];
    }
    private _createDataController(playerIndex: number): DataForInfoRenderer {
        const isControlledByPlayer = MeModel.Sim.getIsControlledByPlayer(playerIndex);
        return {
            titleText               : Lang.getText(Lang.Type.B0424),
            infoText                : isControlledByPlayer ? Lang.getText(Lang.Type.B0031) : Lang.getText(Lang.Type.B0256),
            infoColor               : 0xFFFFFF,
            callbackOnTouchedTitle  : () => {
                MeModel.Sim.setIsControlledByPlayer(playerIndex, !isControlledByPlayer);
                this._updateView();
            },
        };
    }
    private _createDataTeamIndex(playerIndex: number): DataForInfoRenderer {
        return {
            titleText               : Lang.getText(Lang.Type.B0019),
            infoText                : Lang.getPlayerTeamName(MeModel.Sim.getTeamIndex(playerIndex)),
            infoColor               : 0xFFFFFF,
            callbackOnTouchedTitle  : () => {
                this._confirmUseCustomRule(() => {
                    MeModel.Sim.tickTeamIndex(playerIndex);
                    this._updateView();
                });
            },
        };
    }
    private _createDataCo(playerIndex: number): DataForInfoRenderer {
        const coId          = MeModel.Sim.getCoId(playerIndex);
        const configVersion = MeModel.Sim.getWarData().settingsForCommon.configVersion;
        return {
            titleText               : Lang.getText(Lang.Type.B0425),
            infoText                : ConfigManager.getCoNameAndTierText(configVersion, coId),
            infoColor               : 0xFFFFFF,
            callbackOnTouchedTitle  : () => {
                CommonChooseCoPanel.show({
                    currentCoId         : coId,
                    availableCoIdArray  : ConfigManager.getEnabledCoArray(configVersion).map(v => v.coId),
                    callbackOnConfirm   : newCoId => {
                        if (newCoId !== coId) {
                            MeModel.Sim.setCoId(playerIndex, newCoId);
                            this._updateView();
                        }
                    },
                });
            },
        };
    }
    private _createDataSkinId(playerIndex: number): DataForInfoRenderer {
        return {
            titleText               : Lang.getText(Lang.Type.B0397),
            infoText                : Lang.getUnitAndTileSkinName(MeModel.Sim.getUnitAndTileSkinId(playerIndex)),
            infoColor               : 0xFFFFFF,
            callbackOnTouchedTitle  : () => {
                MeModel.Sim.tickUnitAndTileSkinId(playerIndex);
                this._updateView();
            },
        };
    }
    private _createDataInitialFund(playerIndex: number): DataForInfoRenderer {
        const currValue = MeModel.Sim.getInitialFund(playerIndex);
        return {
            titleText               : Lang.getText(Lang.Type.B0178),
            infoText                : `${currValue}`,
            infoColor               : getTextColor(currValue, CommonConstants.WarRuleInitialFundDefault),
            callbackOnTouchedTitle  : () => {
                this._confirmUseCustomRule(() => {
                    const maxValue  = CommonConstants.WarRuleInitialFundMaxLimit;
                    const minValue  = CommonConstants.WarRuleInitialFundMinLimit;
                    CommonInputPanel.show({
                        title           : Lang.getText(Lang.Type.B0178),
                        currentValue    : "" + currValue,
                        maxChars        : 7,
                        charRestrict    : "0-9\\-",
                        tips            : `${Lang.getText(Lang.Type.B0319)}: [${minValue}, ${maxValue}]`,
                        callback        : panel => {
                            const text  = panel.getInputText();
                            const value = text ? Number(text) : NaN;
                            if ((isNaN(value)) || (value > maxValue) || (value < minValue)) {
                                FloatText.show(Lang.getText(Lang.Type.A0098));
                            } else {
                                MeModel.Sim.setInitialFund(playerIndex, value);
                                this._updateView();
                            }
                        },
                    });
                });
            }
        };
    }
    private _createDataIncomeMultiplier(playerIndex: number): DataForInfoRenderer {
        const currValue = MeModel.Sim.getIncomeMultiplier(playerIndex);
        const maxValue  = CommonConstants.WarRuleIncomeMultiplierMaxLimit;
        const minValue  = CommonConstants.WarRuleIncomeMultiplierMinLimit;
        return {
            titleText               : Lang.getText(Lang.Type.B0179),
            infoText                : `${currValue}%`,
            infoColor               : getTextColor(currValue, CommonConstants.WarRuleIncomeMultiplierDefault),
            callbackOnTouchedTitle  : () => {
                this._confirmUseCustomRule(() => {
                    CommonInputPanel.show({
                        title           : Lang.getText(Lang.Type.B0179),
                        currentValue    : "" + currValue,
                        maxChars        : 5,
                        charRestrict    : "0-9",
                        tips            : `${Lang.getText(Lang.Type.B0319)}: [${minValue}, ${maxValue}]`,
                        callback        : panel => {
                            const text  = panel.getInputText();
                            const value = text ? Number(text) : NaN;
                            if ((isNaN(value)) || (value > maxValue) || (value < minValue)) {
                                FloatText.show(Lang.getText(Lang.Type.A0098));
                            } else {
                                MeModel.Sim.setIncomeMultiplier(playerIndex, value);
                                this._updateView();
                            }
                        },
                    });
                });
            },
        };
    }
    private _createDataEnergyAddPctOnLoadCo(playerIndex: number): DataForInfoRenderer {
        const currValue     = MeModel.Sim.getEnergyAddPctOnLoadCo(playerIndex);
        const minValue      = CommonConstants.WarRuleEnergyAddPctOnLoadCoMinLimit;
        const maxValue      = CommonConstants.WarRuleEnergyAddPctOnLoadCoMaxLimit;
        return {
            titleText               : Lang.getText(Lang.Type.B0180),
            infoText                : `${currValue}%`,
            infoColor               : getTextColor(currValue, CommonConstants.WarRuleEnergyAddPctOnLoadCoDefault),
            callbackOnTouchedTitle  : () => {
                this._confirmUseCustomRule(() => {
                    CommonInputPanel.show({
                        title           : Lang.getText(Lang.Type.B0180),
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
                                MeModel.Sim.setEnergyAddPctOnLoadCo(playerIndex, value);
                                this._updateView();
                            }
                        },
                    });
                });
            },
        };
    }
    private _createDataEnergyGrowthMultiplier(playerIndex: number): DataForInfoRenderer {
        const currValue     = MeModel.Sim.getEnergyGrowthMultiplier(playerIndex);
        const minValue      = CommonConstants.WarRuleEnergyGrowthMultiplierMinLimit;
        const maxValue      = CommonConstants.WarRuleEnergyGrowthMultiplierMaxLimit;
        return {
            titleText               : Lang.getText(Lang.Type.B0181),
            infoText                : `${currValue}%`,
            infoColor               : getTextColor(currValue, CommonConstants.WarRuleEnergyGrowthMultiplierDefault),
            callbackOnTouchedTitle  : () => {
                this._confirmUseCustomRule(() => {
                    CommonInputPanel.show({
                        title           : Lang.getText(Lang.Type.B0181),
                        currentValue    : "" + currValue,
                        maxChars        : 5,
                        charRestrict    : "0-9",
                        tips            : `${Lang.getText(Lang.Type.B0319)}: [${minValue}, ${maxValue}]`,
                        callback        : panel => {
                            const text  = panel.getInputText();
                            const value = text ? Number(text) : NaN;
                            if ((isNaN(value)) || (value > maxValue) || (value < minValue)) {
                                FloatText.show(Lang.getText(Lang.Type.A0098));
                            } else {
                                MeModel.Sim.setEnergyGrowthMultiplier(playerIndex, value);
                                this._updateView();
                            }
                        },
                    });
                });
            },
        };
    }
    private _createDataMoveRangeModifier(playerIndex: number): DataForInfoRenderer {
        const currValue     = MeModel.Sim.getMoveRangeModifier(playerIndex);
        const minValue      = CommonConstants.WarRuleMoveRangeModifierMinLimit;
        const maxValue      = CommonConstants.WarRuleMoveRangeModifierMaxLimit;
        return {
            titleText               : Lang.getText(Lang.Type.B0182),
            infoText                : `${currValue}`,
            infoColor               : getTextColor(currValue, CommonConstants.WarRuleMoveRangeModifierDefault),
            callbackOnTouchedTitle  : () => {
                this._confirmUseCustomRule(() => {
                    CommonInputPanel.show({
                        title           : Lang.getText(Lang.Type.B0182),
                        currentValue    : "" + currValue,
                        maxChars        : 3,
                        charRestrict    : "0-9\\-",
                        tips            : `${Lang.getText(Lang.Type.B0319)}: [${minValue}, ${maxValue}]`,
                        callback        : panel => {
                            const text  = panel.getInputText();
                            const value = text ? Number(text) : NaN;
                            if ((isNaN(value)) || (value > maxValue) || (value < minValue)) {
                                FloatText.show(Lang.getText(Lang.Type.A0098));
                            } else {
                                MeModel.Sim.setMoveRangeModifier(playerIndex, value);
                                this._updateView();
                            }
                        },
                    });
                });
            },
        };
    }
    private _createDataAttackPowerModifier(playerIndex: number): DataForInfoRenderer {
        const currValue     = MeModel.Sim.getAttackPowerModifier(playerIndex);
        const minValue      = CommonConstants.WarRuleOffenseBonusMinLimit;
        const maxValue      = CommonConstants.WarRuleOffenseBonusMaxLimit;
        return {
            titleText               : Lang.getText(Lang.Type.B0183),
            infoText                : `${currValue}%`,
            infoColor               : getTextColor(currValue, CommonConstants.WarRuleOffenseBonusDefault),
            callbackOnTouchedTitle  : () => {
                this._confirmUseCustomRule(() => {
                    CommonInputPanel.show({
                        title           : Lang.getText(Lang.Type.B0183),
                        currentValue    : "" + currValue,
                        maxChars        : 5,
                        charRestrict    : "0-9\\-",
                        tips            : `${Lang.getText(Lang.Type.B0319)}: [${minValue}, ${maxValue}]`,
                        callback        : panel => {
                            const text  = panel.getInputText();
                            const value = text ? Number(text) : NaN;
                            if ((isNaN(value)) || (value > maxValue) || (value < minValue)) {
                                FloatText.show(Lang.getText(Lang.Type.A0098));
                            } else {
                                MeModel.Sim.setAttackPowerModifier(playerIndex, value);
                                this._updateView();
                            }
                        },
                    });
                });
            },
        };
    }
    private _createDataVisionRangeModifier(playerIndex: number): DataForInfoRenderer {
        const currValue     = MeModel.Sim.getVisionRangeModifier(playerIndex);
        const minValue      = CommonConstants.WarRuleVisionRangeModifierMinLimit;
        const maxValue      = CommonConstants.WarRuleVisionRangeModifierMaxLimit;
        return {
            titleText               : Lang.getText(Lang.Type.B0184),
            infoText                : `${currValue}`,
            infoColor               : getTextColor(currValue, CommonConstants.WarRuleVisionRangeModifierDefault),
            callbackOnTouchedTitle  : () => {
                this._confirmUseCustomRule(() => {
                    CommonInputPanel.show({
                        title           : Lang.getText(Lang.Type.B0184),
                        currentValue    : "" + currValue,
                        maxChars        : 3,
                        charRestrict    : "0-9\\-",
                        tips            : `${Lang.getText(Lang.Type.B0319)}: [${minValue}, ${maxValue}]`,
                        callback        : panel => {
                            const text  = panel.getInputText();
                            const value = text ? Number(text) : NaN;
                            if ((isNaN(value)) || (value > maxValue) || (value < minValue)) {
                                FloatText.show(Lang.getText(Lang.Type.A0098));
                            } else {
                                MeModel.Sim.setVisionRangeModifier(playerIndex, value);
                                this._updateView();
                            }
                        },
                    });
                });
            },
        };
    }
    private _createDataLuckLowerLimit(playerIndex: number): DataForInfoRenderer {
        const currValue     = MeModel.Sim.getLuckLowerLimit(playerIndex);
        const minValue      = CommonConstants.WarRuleLuckMinLimit;
        const maxValue      = CommonConstants.WarRuleLuckMaxLimit;
        return {
            titleText               : Lang.getText(Lang.Type.B0189),
            infoText                : `${currValue}%`,
            infoColor               : getTextColor(currValue, CommonConstants.WarRuleLuckDefaultLowerLimit),
            callbackOnTouchedTitle  : () => {
                this._confirmUseCustomRule(() => {
                    CommonInputPanel.show({
                        title           : Lang.getText(Lang.Type.B0189),
                        currentValue    : "" + currValue,
                        maxChars        : 4,
                        charRestrict    : "0-9\\-",
                        tips            : `${Lang.getText(Lang.Type.B0319)}: [${minValue}, ${maxValue}]`,
                        callback        : panel => {
                            const text  = panel.getInputText();
                            const value = text ? Number(text) : NaN;
                            if ((isNaN(value)) || (value > maxValue) || (value < minValue)) {
                                FloatText.show(Lang.getText(Lang.Type.A0098));
                            } else {
                                const upperLimit = MeModel.Sim.getLuckUpperLimit(playerIndex);
                                if (value <= upperLimit) {
                                    MeModel.Sim.setLuckLowerLimit(playerIndex, value);
                                } else {
                                    MeModel.Sim.setLuckUpperLimit(playerIndex, value);
                                    MeModel.Sim.setLuckLowerLimit(playerIndex, upperLimit);
                                }
                                this._updateView();
                            }
                        },
                    });
                });
            },
        };
    }
    private _createDataLuckUpperLimit(playerIndex: number): DataForInfoRenderer {
        const currValue     = MeModel.Sim.getLuckUpperLimit(playerIndex);
        const minValue      = CommonConstants.WarRuleLuckMinLimit;
        const maxValue      = CommonConstants.WarRuleLuckMaxLimit;
        return {
            titleText               : Lang.getText(Lang.Type.B0190),
            infoText                : `${currValue}%`,
            infoColor               : getTextColor(currValue, CommonConstants.WarRuleLuckDefaultUpperLimit),
            callbackOnTouchedTitle  : () => {
                this._confirmUseCustomRule(() => {
                    CommonInputPanel.show({
                        title           : Lang.getText(Lang.Type.B0190),
                        currentValue    : "" + currValue,
                        maxChars        : 4,
                        charRestrict    : "0-9\\-",
                        tips            : `${Lang.getText(Lang.Type.B0319)}: [${minValue}, ${maxValue}]`,
                        callback        : panel => {
                            const text  = panel.getInputText();
                            const value = text ? Number(text) : NaN;
                            if ((isNaN(value)) || (value > maxValue) || (value < minValue)) {
                                FloatText.show(Lang.getText(Lang.Type.A0098));
                            } else {
                                const lowerLimit = MeModel.Sim.getLuckLowerLimit(playerIndex);
                                if (value >= lowerLimit) {
                                    MeModel.Sim.setLuckUpperLimit(playerIndex, value);
                                } else {
                                    MeModel.Sim.setLuckLowerLimit(playerIndex, value);
                                    MeModel.Sim.setLuckUpperLimit(playerIndex, lowerLimit);
                                }
                                this._updateView();
                            }
                        },
                    });
                });
            },
        };
    }

    private _confirmUseCustomRule(callback: () => void): void {
        if (MeModel.Sim.getPresetWarRuleId() == null) {
            callback();
        } else {
            CommonConfirmPanel.show({
                content : Lang.getText(Lang.Type.A0129),
                callback: () => {
                    MeModel.Sim.setPresetWarRuleId(null);
                    callback();
                },
            });
        }
    }
}

type DataForInfoRenderer = {
    titleText               : string;
    infoText                : string;
    infoColor               : number;
    callbackOnTouchedTitle  : (() => void) | null;
};

class InfoRenderer extends UiListItemRenderer<DataForInfoRenderer> {
    private _btnTitle   : UiButton;
    private _labelValue : UiLabel;

    protected _onOpened(): void {
        this._setUiListenerArray([
            { ui: this._btnTitle,   callback: this._onTouchedBtnTitle },
        ]);
    }

    protected _onDataChanged(): void {
        const data                  = this.data;
        this._labelValue.text       = data.infoText;
        this._labelValue.textColor  = data.infoColor;
        this._btnTitle.label        = data.titleText;
        this._btnTitle.setTextColor(data.callbackOnTouchedTitle ? 0x00FF00 : 0xFFFFFF);
    }

    private _onTouchedBtnTitle(): void {
        const data      = this.data;
        const callback  = data ? data.callbackOnTouchedTitle : null;
        (callback) && (callback());
    }
}

function getTextColor(value: number, defaultValue: number): number {
    if (value > defaultValue) {
        return 0x00FF00;
    } else if (value < defaultValue) {
        return 0xFF0000;
    } else {
        return 0xFFFFFF;
    }
}
