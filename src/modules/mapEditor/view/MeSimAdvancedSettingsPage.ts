
import { UiListItemRenderer }           from "../../../utility/ui/UiListItemRenderer";
import { UiButton }                     from "../../../utility/ui/UiButton";
import { UiLabel }                      from "../../../utility/ui/UiLabel";
import { UiScrollList }                 from "../../../utility/ui/UiScrollList";
import { UiTabPage }                    from "../../../utility/ui/UiTabPage";
import { CommonConfirmPanel }           from "../../common/view/CommonConfirmPanel";
import { CommonInputPanel }             from "../../common/view/CommonInputPanel";
import { CommonChooseCoPanel }          from "../../common/view/CommonChooseCoPanel";
import { MeSimModel }                   from "../model/MeSimModel";
import { TwnsLangTextType }             from "../../../utility/lang/LangTextType";
import { TwnsNotifyType }               from "../../../utility/notify/NotifyType";
import { CommonConstants }              from "../../../utility/CommonConstants";
import { ConfigManager }                from "../../../utility/ConfigManager";
import { FloatText }                    from "../../../utility/FloatText";
import { Lang }                         from "../../../utility/lang/Lang";
import LangTextType                     = TwnsLangTextType.LangTextType;
import NotifyType                       = TwnsNotifyType.NotifyType;

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
            { type: NotifyType.LanguageChanged,    callback: this._onNotifyLanguageChanged },
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
        this._labelMapNameTitle.text        = `${Lang.getText(LangTextType.B0225)}:`;
        this._labelPlayersCountTitle.text   = `${Lang.getText(LangTextType.B0229)}:`;
        this._labelPlayerList.text          = Lang.getText(LangTextType.B0395);
    }

    private _updateLabelMapName(): void {
        this._labelMapName.text = Lang.getLanguageText({ textArray: MeSimModel.getMapRawData().mapNameArray });
    }

    private _updateLabelPlayersCount(): void {
        this._labelPlayersCount.text = "" + MeSimModel.getMapRawData().playersCountUnneutral;
    }

    private _updateListPlayer(): void {
        const playersCount  = MeSimModel.getMapRawData().playersCountUnneutral;
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
        const isControlledByPlayer = MeSimModel.getIsControlledByPlayer(playerIndex);
        return {
            titleText               : Lang.getText(LangTextType.B0424),
            infoText                : isControlledByPlayer ? Lang.getText(LangTextType.B0031) : Lang.getText(LangTextType.B0256),
            infoColor               : 0xFFFFFF,
            callbackOnTouchedTitle  : () => {
                MeSimModel.setIsControlledByPlayer(playerIndex, !isControlledByPlayer);
                this._updateView();
            },
        };
    }
    private _createDataTeamIndex(playerIndex: number): DataForInfoRenderer {
        return {
            titleText               : Lang.getText(LangTextType.B0019),
            infoText                : Lang.getPlayerTeamName(MeSimModel.getTeamIndex(playerIndex)),
            infoColor               : 0xFFFFFF,
            callbackOnTouchedTitle  : () => {
                this._confirmUseCustomRule(() => {
                    MeSimModel.tickTeamIndex(playerIndex);
                    this._updateView();
                });
            },
        };
    }
    private _createDataCo(playerIndex: number): DataForInfoRenderer {
        const coId          = MeSimModel.getCoId(playerIndex);
        const configVersion = MeSimModel.getWarData().settingsForCommon.configVersion;
        return {
            titleText               : Lang.getText(LangTextType.B0425),
            infoText                : ConfigManager.getCoNameAndTierText(configVersion, coId),
            infoColor               : 0xFFFFFF,
            callbackOnTouchedTitle  : () => {
                CommonChooseCoPanel.show({
                    currentCoId         : coId,
                    availableCoIdArray  : ConfigManager.getEnabledCoArray(configVersion).map(v => v.coId),
                    callbackOnConfirm   : newCoId => {
                        if (newCoId !== coId) {
                            MeSimModel.setCoId(playerIndex, newCoId);
                            this._updateView();
                        }
                    },
                });
            },
        };
    }
    private _createDataSkinId(playerIndex: number): DataForInfoRenderer {
        return {
            titleText               : Lang.getText(LangTextType.B0397),
            infoText                : Lang.getUnitAndTileSkinName(MeSimModel.getUnitAndTileSkinId(playerIndex)),
            infoColor               : 0xFFFFFF,
            callbackOnTouchedTitle  : () => {
                MeSimModel.tickUnitAndTileSkinId(playerIndex);
                this._updateView();
            },
        };
    }
    private _createDataInitialFund(playerIndex: number): DataForInfoRenderer {
        const currValue = MeSimModel.getInitialFund(playerIndex);
        return {
            titleText               : Lang.getText(LangTextType.B0178),
            infoText                : `${currValue}`,
            infoColor               : getTextColor(currValue, CommonConstants.WarRuleInitialFundDefault),
            callbackOnTouchedTitle  : () => {
                this._confirmUseCustomRule(() => {
                    const maxValue  = CommonConstants.WarRuleInitialFundMaxLimit;
                    const minValue  = CommonConstants.WarRuleInitialFundMinLimit;
                    CommonInputPanel.show({
                        title           : Lang.getText(LangTextType.B0178),
                        currentValue    : "" + currValue,
                        maxChars        : 7,
                        charRestrict    : "0-9\\-",
                        tips            : `${Lang.getText(LangTextType.B0319)}: [${minValue}, ${maxValue}]`,
                        callback        : panel => {
                            const text  = panel.getInputText();
                            const value = text ? Number(text) : NaN;
                            if ((isNaN(value)) || (value > maxValue) || (value < minValue)) {
                                FloatText.show(Lang.getText(LangTextType.A0098));
                            } else {
                                MeSimModel.setInitialFund(playerIndex, value);
                                this._updateView();
                            }
                        },
                    });
                });
            }
        };
    }
    private _createDataIncomeMultiplier(playerIndex: number): DataForInfoRenderer {
        const currValue = MeSimModel.getIncomeMultiplier(playerIndex);
        const maxValue  = CommonConstants.WarRuleIncomeMultiplierMaxLimit;
        const minValue  = CommonConstants.WarRuleIncomeMultiplierMinLimit;
        return {
            titleText               : Lang.getText(LangTextType.B0179),
            infoText                : `${currValue}%`,
            infoColor               : getTextColor(currValue, CommonConstants.WarRuleIncomeMultiplierDefault),
            callbackOnTouchedTitle  : () => {
                this._confirmUseCustomRule(() => {
                    CommonInputPanel.show({
                        title           : Lang.getText(LangTextType.B0179),
                        currentValue    : "" + currValue,
                        maxChars        : 5,
                        charRestrict    : "0-9",
                        tips            : `${Lang.getText(LangTextType.B0319)}: [${minValue}, ${maxValue}]`,
                        callback        : panel => {
                            const text  = panel.getInputText();
                            const value = text ? Number(text) : NaN;
                            if ((isNaN(value)) || (value > maxValue) || (value < minValue)) {
                                FloatText.show(Lang.getText(LangTextType.A0098));
                            } else {
                                MeSimModel.setIncomeMultiplier(playerIndex, value);
                                this._updateView();
                            }
                        },
                    });
                });
            },
        };
    }
    private _createDataEnergyAddPctOnLoadCo(playerIndex: number): DataForInfoRenderer {
        const currValue     = MeSimModel.getEnergyAddPctOnLoadCo(playerIndex);
        const minValue      = CommonConstants.WarRuleEnergyAddPctOnLoadCoMinLimit;
        const maxValue      = CommonConstants.WarRuleEnergyAddPctOnLoadCoMaxLimit;
        return {
            titleText               : Lang.getText(LangTextType.B0180),
            infoText                : `${currValue}%`,
            infoColor               : getTextColor(currValue, CommonConstants.WarRuleEnergyAddPctOnLoadCoDefault),
            callbackOnTouchedTitle  : () => {
                this._confirmUseCustomRule(() => {
                    CommonInputPanel.show({
                        title           : Lang.getText(LangTextType.B0180),
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
                                MeSimModel.setEnergyAddPctOnLoadCo(playerIndex, value);
                                this._updateView();
                            }
                        },
                    });
                });
            },
        };
    }
    private _createDataEnergyGrowthMultiplier(playerIndex: number): DataForInfoRenderer {
        const currValue     = MeSimModel.getEnergyGrowthMultiplier(playerIndex);
        const minValue      = CommonConstants.WarRuleEnergyGrowthMultiplierMinLimit;
        const maxValue      = CommonConstants.WarRuleEnergyGrowthMultiplierMaxLimit;
        return {
            titleText               : Lang.getText(LangTextType.B0181),
            infoText                : `${currValue}%`,
            infoColor               : getTextColor(currValue, CommonConstants.WarRuleEnergyGrowthMultiplierDefault),
            callbackOnTouchedTitle  : () => {
                this._confirmUseCustomRule(() => {
                    CommonInputPanel.show({
                        title           : Lang.getText(LangTextType.B0181),
                        currentValue    : "" + currValue,
                        maxChars        : 5,
                        charRestrict    : "0-9",
                        tips            : `${Lang.getText(LangTextType.B0319)}: [${minValue}, ${maxValue}]`,
                        callback        : panel => {
                            const text  = panel.getInputText();
                            const value = text ? Number(text) : NaN;
                            if ((isNaN(value)) || (value > maxValue) || (value < minValue)) {
                                FloatText.show(Lang.getText(LangTextType.A0098));
                            } else {
                                MeSimModel.setEnergyGrowthMultiplier(playerIndex, value);
                                this._updateView();
                            }
                        },
                    });
                });
            },
        };
    }
    private _createDataMoveRangeModifier(playerIndex: number): DataForInfoRenderer {
        const currValue     = MeSimModel.getMoveRangeModifier(playerIndex);
        const minValue      = CommonConstants.WarRuleMoveRangeModifierMinLimit;
        const maxValue      = CommonConstants.WarRuleMoveRangeModifierMaxLimit;
        return {
            titleText               : Lang.getText(LangTextType.B0182),
            infoText                : `${currValue}`,
            infoColor               : getTextColor(currValue, CommonConstants.WarRuleMoveRangeModifierDefault),
            callbackOnTouchedTitle  : () => {
                this._confirmUseCustomRule(() => {
                    CommonInputPanel.show({
                        title           : Lang.getText(LangTextType.B0182),
                        currentValue    : "" + currValue,
                        maxChars        : 3,
                        charRestrict    : "0-9\\-",
                        tips            : `${Lang.getText(LangTextType.B0319)}: [${minValue}, ${maxValue}]`,
                        callback        : panel => {
                            const text  = panel.getInputText();
                            const value = text ? Number(text) : NaN;
                            if ((isNaN(value)) || (value > maxValue) || (value < minValue)) {
                                FloatText.show(Lang.getText(LangTextType.A0098));
                            } else {
                                MeSimModel.setMoveRangeModifier(playerIndex, value);
                                this._updateView();
                            }
                        },
                    });
                });
            },
        };
    }
    private _createDataAttackPowerModifier(playerIndex: number): DataForInfoRenderer {
        const currValue     = MeSimModel.getAttackPowerModifier(playerIndex);
        const minValue      = CommonConstants.WarRuleOffenseBonusMinLimit;
        const maxValue      = CommonConstants.WarRuleOffenseBonusMaxLimit;
        return {
            titleText               : Lang.getText(LangTextType.B0183),
            infoText                : `${currValue}%`,
            infoColor               : getTextColor(currValue, CommonConstants.WarRuleOffenseBonusDefault),
            callbackOnTouchedTitle  : () => {
                this._confirmUseCustomRule(() => {
                    CommonInputPanel.show({
                        title           : Lang.getText(LangTextType.B0183),
                        currentValue    : "" + currValue,
                        maxChars        : 5,
                        charRestrict    : "0-9\\-",
                        tips            : `${Lang.getText(LangTextType.B0319)}: [${minValue}, ${maxValue}]`,
                        callback        : panel => {
                            const text  = panel.getInputText();
                            const value = text ? Number(text) : NaN;
                            if ((isNaN(value)) || (value > maxValue) || (value < minValue)) {
                                FloatText.show(Lang.getText(LangTextType.A0098));
                            } else {
                                MeSimModel.setAttackPowerModifier(playerIndex, value);
                                this._updateView();
                            }
                        },
                    });
                });
            },
        };
    }
    private _createDataVisionRangeModifier(playerIndex: number): DataForInfoRenderer {
        const currValue     = MeSimModel.getVisionRangeModifier(playerIndex);
        const minValue      = CommonConstants.WarRuleVisionRangeModifierMinLimit;
        const maxValue      = CommonConstants.WarRuleVisionRangeModifierMaxLimit;
        return {
            titleText               : Lang.getText(LangTextType.B0184),
            infoText                : `${currValue}`,
            infoColor               : getTextColor(currValue, CommonConstants.WarRuleVisionRangeModifierDefault),
            callbackOnTouchedTitle  : () => {
                this._confirmUseCustomRule(() => {
                    CommonInputPanel.show({
                        title           : Lang.getText(LangTextType.B0184),
                        currentValue    : "" + currValue,
                        maxChars        : 3,
                        charRestrict    : "0-9\\-",
                        tips            : `${Lang.getText(LangTextType.B0319)}: [${minValue}, ${maxValue}]`,
                        callback        : panel => {
                            const text  = panel.getInputText();
                            const value = text ? Number(text) : NaN;
                            if ((isNaN(value)) || (value > maxValue) || (value < minValue)) {
                                FloatText.show(Lang.getText(LangTextType.A0098));
                            } else {
                                MeSimModel.setVisionRangeModifier(playerIndex, value);
                                this._updateView();
                            }
                        },
                    });
                });
            },
        };
    }
    private _createDataLuckLowerLimit(playerIndex: number): DataForInfoRenderer {
        const currValue     = MeSimModel.getLuckLowerLimit(playerIndex);
        const minValue      = CommonConstants.WarRuleLuckMinLimit;
        const maxValue      = CommonConstants.WarRuleLuckMaxLimit;
        return {
            titleText               : Lang.getText(LangTextType.B0189),
            infoText                : `${currValue}%`,
            infoColor               : getTextColor(currValue, CommonConstants.WarRuleLuckDefaultLowerLimit),
            callbackOnTouchedTitle  : () => {
                this._confirmUseCustomRule(() => {
                    CommonInputPanel.show({
                        title           : Lang.getText(LangTextType.B0189),
                        currentValue    : "" + currValue,
                        maxChars        : 4,
                        charRestrict    : "0-9\\-",
                        tips            : `${Lang.getText(LangTextType.B0319)}: [${minValue}, ${maxValue}]`,
                        callback        : panel => {
                            const text  = panel.getInputText();
                            const value = text ? Number(text) : NaN;
                            if ((isNaN(value)) || (value > maxValue) || (value < minValue)) {
                                FloatText.show(Lang.getText(LangTextType.A0098));
                            } else {
                                const upperLimit = MeSimModel.getLuckUpperLimit(playerIndex);
                                if (value <= upperLimit) {
                                    MeSimModel.setLuckLowerLimit(playerIndex, value);
                                } else {
                                    MeSimModel.setLuckUpperLimit(playerIndex, value);
                                    MeSimModel.setLuckLowerLimit(playerIndex, upperLimit);
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
        const currValue     = MeSimModel.getLuckUpperLimit(playerIndex);
        const minValue      = CommonConstants.WarRuleLuckMinLimit;
        const maxValue      = CommonConstants.WarRuleLuckMaxLimit;
        return {
            titleText               : Lang.getText(LangTextType.B0190),
            infoText                : `${currValue}%`,
            infoColor               : getTextColor(currValue, CommonConstants.WarRuleLuckDefaultUpperLimit),
            callbackOnTouchedTitle  : () => {
                this._confirmUseCustomRule(() => {
                    CommonInputPanel.show({
                        title           : Lang.getText(LangTextType.B0190),
                        currentValue    : "" + currValue,
                        maxChars        : 4,
                        charRestrict    : "0-9\\-",
                        tips            : `${Lang.getText(LangTextType.B0319)}: [${minValue}, ${maxValue}]`,
                        callback        : panel => {
                            const text  = panel.getInputText();
                            const value = text ? Number(text) : NaN;
                            if ((isNaN(value)) || (value > maxValue) || (value < minValue)) {
                                FloatText.show(Lang.getText(LangTextType.A0098));
                            } else {
                                const lowerLimit = MeSimModel.getLuckLowerLimit(playerIndex);
                                if (value >= lowerLimit) {
                                    MeSimModel.setLuckUpperLimit(playerIndex, value);
                                } else {
                                    MeSimModel.setLuckLowerLimit(playerIndex, value);
                                    MeSimModel.setLuckUpperLimit(playerIndex, lowerLimit);
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
        if (MeSimModel.getPresetWarRuleId() == null) {
            callback();
        } else {
            CommonConfirmPanel.show({
                content : Lang.getText(LangTextType.A0129),
                callback: () => {
                    MeSimModel.setPresetWarRuleId(null);
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
