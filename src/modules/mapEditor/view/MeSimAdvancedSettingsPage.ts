
// import TwnsCommonChooseCoPanel  from "../../common/view/CommonChooseCoPanel";
// import TwnsCommonConfirmPanel   from "../../common/view/CommonConfirmPanel";
// import TwnsCommonInputPanel     from "../../common/view/CommonInputPanel";
// import CommonConstants          from "../../tools/helpers/CommonConstants";
// import ConfigManager            from "../../tools/helpers/ConfigManager";
// import FloatText                from "../../tools/helpers/FloatText";
// import Helpers                  from "../../tools/helpers/Helpers";
// import Lang                     from "../../tools/lang/Lang";
// import TwnsLangTextType         from "../../tools/lang/LangTextType";
// import Twns.Notify           from "../../tools/notify/NotifyType";
// import TwnsUiButton             from "../../tools/ui/UiButton";
// import TwnsUiLabel              from "../../tools/ui/UiLabel";
// import TwnsUiListItemRenderer   from "../../tools/ui/UiListItemRenderer";
// import TwnsUiScrollList         from "../../tools/ui/UiScrollList";
// import TwnsUiTabPage            from "../../tools/ui/UiTabPage";
// import MeSimModel               from "../model/MeSimModel";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.MapEditor {
    import LangTextType         = Twns.Lang.LangTextType;
    import NotifyType           = Twns.Notify.NotifyType;

    export class MeSimAdvancedSettingsPage extends TwnsUiTabPage.UiTabPage<void> {
        private readonly _labelMapNameTitle!        : TwnsUiLabel.UiLabel;
        private readonly _labelMapName!             : TwnsUiLabel.UiLabel;
        private readonly _labelPlayersCountTitle!   : TwnsUiLabel.UiLabel;
        private readonly _labelPlayersCount!        : TwnsUiLabel.UiLabel;
        private readonly _labelPlayerList!          : TwnsUiLabel.UiLabel;
        private readonly _listPlayer!               : TwnsUiScrollList.UiScrollList<DataForPlayerRenderer>;

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
            this._labelMapName.text = Lang.getLanguageText({ textArray: Twns.MapEditor.MeSimModel.getMapRawData().mapNameArray }) ?? CommonConstants.ErrorTextForUndefined;
        }

        private _updateLabelPlayersCount(): void {
            this._labelPlayersCount.text = "" + Twns.MapEditor.MeSimModel.getMapRawData().playersCountUnneutral;
        }

        private _updateListPlayer(): void {
            const playersCount  = Twns.Helpers.getExisted(Twns.MapEditor.MeSimModel.getMapRawData().playersCountUnneutral);
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
    class PlayerRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForPlayerRenderer> {
        private readonly _listInfo! : TwnsUiScrollList.UiScrollList<DataForInfoRenderer>;

        protected _onOpened(): void {
            this._listInfo.setItemRenderer(InfoRenderer);
        }

        protected _onDataChanged(): void {
            this._updateView();
        }

        private async _updateView(): Promise<void> {
            this._listInfo.visible  = true;
            this._listInfo.bindData(await this._createDataForListInfo());
        }

        private async _createDataForListInfo(): Promise<DataForInfoRenderer[]> {
            const data          = this._getData();
            const playerIndex   = data.playerIndex;
            return [
                this._createDataController(playerIndex),
                this._createDataTeamIndex(playerIndex),
                await this._createDataCo(playerIndex),
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
            const isControlledByPlayer = Twns.MapEditor.MeSimModel.getIsControlledByPlayer(playerIndex);
            return {
                titleText               : Lang.getText(LangTextType.B0424),
                infoText                : isControlledByPlayer ? Lang.getText(LangTextType.B0031) : Lang.getText(LangTextType.B0256),
                infoColor               : 0xFFFFFF,
                callbackOnTouchedTitle  : () => {
                    Twns.MapEditor.MeSimModel.setIsControlledByPlayer(playerIndex, !isControlledByPlayer);
                    this._updateView();
                },
            };
        }
        private _createDataTeamIndex(playerIndex: number): DataForInfoRenderer {
            return {
                titleText               : Lang.getText(LangTextType.B0019),
                infoText                : Lang.getPlayerTeamName(Twns.MapEditor.MeSimModel.getTeamIndex(playerIndex)) ?? CommonConstants.ErrorTextForUndefined,
                infoColor               : 0xFFFFFF,
                callbackOnTouchedTitle  : () => {
                    this._confirmUseCustomRule(() => {
                        Twns.MapEditor.MeSimModel.tickTeamIndex(playerIndex);
                        this._updateView();
                    });
                },
            };
        }
        private async _createDataCo(playerIndex: number): Promise<DataForInfoRenderer> {
            const coId          = Twns.MapEditor.MeSimModel.getCoId(playerIndex);
            const gameConfig    = await Twns.Config.ConfigManager.getGameConfig(Twns.Helpers.getExisted(Twns.MapEditor.MeSimModel.getWarData().settingsForCommon?.configVersion));
            return {
                titleText               : Lang.getText(LangTextType.B0425),
                infoText                : gameConfig.getCoNameAndTierText(coId) ?? CommonConstants.ErrorTextForUndefined,
                infoColor               : 0xFFFFFF,
                callbackOnTouchedTitle  : () => {
                    Twns.PanelHelpers.open(Twns.PanelHelpers.PanelDict.CommonChooseCoPanel, {
                        gameConfig,
                        currentCoId         : coId,
                        availableCoIdArray  : gameConfig.getEnabledCoArray().map(v => v.coId),
                        callbackOnConfirm   : newCoId => {
                            if (newCoId !== coId) {
                                Twns.MapEditor.MeSimModel.setCoId(playerIndex, newCoId);
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
                infoText                : Lang.getUnitAndTileSkinName(Twns.MapEditor.MeSimModel.getUnitAndTileSkinId(playerIndex)) ?? CommonConstants.ErrorTextForUndefined,
                infoColor               : 0xFFFFFF,
                callbackOnTouchedTitle  : () => {
                    Twns.MapEditor.MeSimModel.tickUnitAndTileSkinId(playerIndex);
                    this._updateView();
                },
            };
        }
        private _createDataInitialFund(playerIndex: number): DataForInfoRenderer {
            const currValue = Twns.MapEditor.MeSimModel.getInitialFund(playerIndex);
            return {
                titleText               : Lang.getText(LangTextType.B0178),
                infoText                : `${currValue}`,
                infoColor               : getTextColor(currValue, CommonConstants.WarRuleInitialFundDefault),
                callbackOnTouchedTitle  : () => {
                    this._confirmUseCustomRule(() => {
                        const maxValue  = CommonConstants.WarRuleInitialFundMaxLimit;
                        const minValue  = CommonConstants.WarRuleInitialFundMinLimit;
                        Twns.PanelHelpers.open(Twns.PanelHelpers.PanelDict.CommonInputIntegerPanel, {
                            title           : Lang.getText(LangTextType.B0178),
                            currentValue    : currValue,
                            minValue,
                            maxValue,
                            tips            : `${Lang.getText(LangTextType.B0319)}: [${minValue}, ${maxValue}]`,
                            callback        : panel => {
                                Twns.MapEditor.MeSimModel.setInitialFund(playerIndex, panel.getInputValue());
                                this._updateView();
                            },
                        });
                    });
                }
            };
        }
        private _createDataIncomeMultiplier(playerIndex: number): DataForInfoRenderer {
            const currValue = Twns.MapEditor.MeSimModel.getIncomeMultiplier(playerIndex);
            const maxValue  = CommonConstants.WarRuleIncomeMultiplierMaxLimit;
            const minValue  = CommonConstants.WarRuleIncomeMultiplierMinLimit;
            return {
                titleText               : Lang.getText(LangTextType.B0179),
                infoText                : `${currValue}%`,
                infoColor               : getTextColor(currValue, CommonConstants.WarRuleIncomeMultiplierDefault),
                callbackOnTouchedTitle  : () => {
                    this._confirmUseCustomRule(() => {
                        Twns.PanelHelpers.open(Twns.PanelHelpers.PanelDict.CommonInputIntegerPanel, {
                            title           : Lang.getText(LangTextType.B0179),
                            currentValue    : currValue,
                            minValue,
                            maxValue,
                            tips            : `${Lang.getText(LangTextType.B0319)}: [${minValue}, ${maxValue}]`,
                            callback        : panel => {
                                Twns.MapEditor.MeSimModel.setIncomeMultiplier(playerIndex, panel.getInputValue());
                                this._updateView();
                            },
                        });
                    });
                },
            };
        }
        private _createDataEnergyAddPctOnLoadCo(playerIndex: number): DataForInfoRenderer {
            const currValue     = Twns.MapEditor.MeSimModel.getEnergyAddPctOnLoadCo(playerIndex);
            const minValue      = CommonConstants.WarRuleEnergyAddPctOnLoadCoMinLimit;
            const maxValue      = CommonConstants.WarRuleEnergyAddPctOnLoadCoMaxLimit;
            return {
                titleText               : Lang.getText(LangTextType.B0180),
                infoText                : `${currValue}%`,
                infoColor               : getTextColor(currValue, CommonConstants.WarRuleEnergyAddPctOnLoadCoDefault),
                callbackOnTouchedTitle  : () => {
                    this._confirmUseCustomRule(() => {
                        Twns.PanelHelpers.open(Twns.PanelHelpers.PanelDict.CommonInputIntegerPanel, {
                            title           : Lang.getText(LangTextType.B0180),
                            currentValue    : currValue,
                            minValue,
                            maxValue,
                            tips            : `${Lang.getText(LangTextType.B0319)}: [${minValue}, ${maxValue}]`,
                            callback        : panel => {
                                Twns.MapEditor.MeSimModel.setEnergyAddPctOnLoadCo(playerIndex, panel.getInputValue());
                                this._updateView();
                            },
                        });
                    });
                },
            };
        }
        private _createDataEnergyGrowthMultiplier(playerIndex: number): DataForInfoRenderer {
            const currValue     = Twns.MapEditor.MeSimModel.getEnergyGrowthMultiplier(playerIndex);
            const minValue      = CommonConstants.WarRuleEnergyGrowthMultiplierMinLimit;
            const maxValue      = CommonConstants.WarRuleEnergyGrowthMultiplierMaxLimit;
            return {
                titleText               : Lang.getText(LangTextType.B0181),
                infoText                : `${currValue}%`,
                infoColor               : getTextColor(currValue, CommonConstants.WarRuleEnergyGrowthMultiplierDefault),
                callbackOnTouchedTitle  : () => {
                    this._confirmUseCustomRule(() => {
                        Twns.PanelHelpers.open(Twns.PanelHelpers.PanelDict.CommonInputIntegerPanel, {
                            title           : Lang.getText(LangTextType.B0181),
                            currentValue    : currValue,
                            minValue,
                            maxValue,
                            tips            : `${Lang.getText(LangTextType.B0319)}: [${minValue}, ${maxValue}]`,
                            callback        : panel => {
                                Twns.MapEditor.MeSimModel.setEnergyGrowthMultiplier(playerIndex, panel.getInputValue());
                                this._updateView();
                            },
                        });
                    });
                },
            };
        }
        private _createDataMoveRangeModifier(playerIndex: number): DataForInfoRenderer {
            const currValue     = Twns.MapEditor.MeSimModel.getMoveRangeModifier(playerIndex);
            const minValue      = CommonConstants.WarRuleMoveRangeModifierMinLimit;
            const maxValue      = CommonConstants.WarRuleMoveRangeModifierMaxLimit;
            return {
                titleText               : Lang.getText(LangTextType.B0182),
                infoText                : `${currValue}`,
                infoColor               : getTextColor(currValue, CommonConstants.WarRuleMoveRangeModifierDefault),
                callbackOnTouchedTitle  : () => {
                    this._confirmUseCustomRule(() => {
                        Twns.PanelHelpers.open(Twns.PanelHelpers.PanelDict.CommonInputIntegerPanel, {
                            title           : Lang.getText(LangTextType.B0182),
                            currentValue    : currValue,
                            minValue,
                            maxValue,
                            tips            : `${Lang.getText(LangTextType.B0319)}: [${minValue}, ${maxValue}]`,
                            callback        : panel => {
                                Twns.MapEditor.MeSimModel.setMoveRangeModifier(playerIndex, panel.getInputValue());
                                this._updateView();
                            },
                        });
                    });
                },
            };
        }
        private _createDataAttackPowerModifier(playerIndex: number): DataForInfoRenderer {
            const currValue     = Twns.MapEditor.MeSimModel.getAttackPowerModifier(playerIndex);
            const minValue      = CommonConstants.WarRuleOffenseBonusMinLimit;
            const maxValue      = CommonConstants.WarRuleOffenseBonusMaxLimit;
            return {
                titleText               : Lang.getText(LangTextType.B0183),
                infoText                : `${currValue}%`,
                infoColor               : getTextColor(currValue, CommonConstants.WarRuleOffenseBonusDefault),
                callbackOnTouchedTitle  : () => {
                    this._confirmUseCustomRule(() => {
                        Twns.PanelHelpers.open(Twns.PanelHelpers.PanelDict.CommonInputIntegerPanel, {
                            title           : Lang.getText(LangTextType.B0183),
                            currentValue    : currValue,
                            minValue,
                            maxValue,
                            tips            : `${Lang.getText(LangTextType.B0319)}: [${minValue}, ${maxValue}]`,
                            callback        : panel => {
                                Twns.MapEditor.MeSimModel.setAttackPowerModifier(playerIndex, panel.getInputValue());
                                this._updateView();
                            },
                        });
                    });
                },
            };
        }
        private _createDataVisionRangeModifier(playerIndex: number): DataForInfoRenderer {
            const currValue     = Twns.MapEditor.MeSimModel.getVisionRangeModifier(playerIndex);
            const minValue      = CommonConstants.WarRuleVisionRangeModifierMinLimit;
            const maxValue      = CommonConstants.WarRuleVisionRangeModifierMaxLimit;
            return {
                titleText               : Lang.getText(LangTextType.B0184),
                infoText                : `${currValue}`,
                infoColor               : getTextColor(currValue, CommonConstants.WarRuleVisionRangeModifierDefault),
                callbackOnTouchedTitle  : () => {
                    this._confirmUseCustomRule(() => {
                        Twns.PanelHelpers.open(Twns.PanelHelpers.PanelDict.CommonInputIntegerPanel, {
                            title           : Lang.getText(LangTextType.B0184),
                            currentValue    : currValue,
                            minValue,
                            maxValue,
                            tips            : `${Lang.getText(LangTextType.B0319)}: [${minValue}, ${maxValue}]`,
                            callback        : panel => {
                                Twns.MapEditor.MeSimModel.setVisionRangeModifier(playerIndex, panel.getInputValue());
                                this._updateView();
                            },
                        });
                    });
                },
            };
        }
        private _createDataLuckLowerLimit(playerIndex: number): DataForInfoRenderer {
            const currValue     = Twns.MapEditor.MeSimModel.getLuckLowerLimit(playerIndex);
            const minValue      = CommonConstants.WarRuleLuckMinLimit;
            const maxValue      = CommonConstants.WarRuleLuckMaxLimit;
            return {
                titleText               : Lang.getText(LangTextType.B0189),
                infoText                : `${currValue}%`,
                infoColor               : getTextColor(currValue, CommonConstants.WarRuleLuckDefaultLowerLimit),
                callbackOnTouchedTitle  : () => {
                    this._confirmUseCustomRule(() => {
                        Twns.PanelHelpers.open(Twns.PanelHelpers.PanelDict.CommonInputIntegerPanel, {
                            title           : Lang.getText(LangTextType.B0189),
                            currentValue    : currValue,
                            minValue,
                            maxValue,
                            tips            : `${Lang.getText(LangTextType.B0319)}: [${minValue}, ${maxValue}]`,
                            callback        : panel => {
                                const value         = panel.getInputValue();
                                const upperLimit    = Twns.MapEditor.MeSimModel.getLuckUpperLimit(playerIndex);
                                if (value <= upperLimit) {
                                    Twns.MapEditor.MeSimModel.setLuckLowerLimit(playerIndex, value);
                                } else {
                                    Twns.MapEditor.MeSimModel.setLuckUpperLimit(playerIndex, value);
                                    Twns.MapEditor.MeSimModel.setLuckLowerLimit(playerIndex, upperLimit);
                                }
                                this._updateView();
                            },
                        });
                    });
                },
            };
        }
        private _createDataLuckUpperLimit(playerIndex: number): DataForInfoRenderer {
            const currValue     = Twns.MapEditor.MeSimModel.getLuckUpperLimit(playerIndex);
            const minValue      = CommonConstants.WarRuleLuckMinLimit;
            const maxValue      = CommonConstants.WarRuleLuckMaxLimit;
            return {
                titleText               : Lang.getText(LangTextType.B0190),
                infoText                : `${currValue}%`,
                infoColor               : getTextColor(currValue, CommonConstants.WarRuleLuckDefaultUpperLimit),
                callbackOnTouchedTitle  : () => {
                    this._confirmUseCustomRule(() => {
                        Twns.PanelHelpers.open(Twns.PanelHelpers.PanelDict.CommonInputIntegerPanel, {
                            title           : Lang.getText(LangTextType.B0190),
                            currentValue    : currValue,
                            minValue,
                            maxValue,
                            tips            : `${Lang.getText(LangTextType.B0319)}: [${minValue}, ${maxValue}]`,
                            callback        : panel => {
                                const value         = panel.getInputValue();
                                const lowerLimit    = Twns.MapEditor.MeSimModel.getLuckLowerLimit(playerIndex);
                                if (value >= lowerLimit) {
                                    Twns.MapEditor.MeSimModel.setLuckUpperLimit(playerIndex, value);
                                } else {
                                    Twns.MapEditor.MeSimModel.setLuckLowerLimit(playerIndex, value);
                                    Twns.MapEditor.MeSimModel.setLuckUpperLimit(playerIndex, lowerLimit);
                                }
                                this._updateView();
                            },
                        });
                    });
                },
            };
        }

        private _confirmUseCustomRule(callback: () => void): void {
            if (Twns.MapEditor.MeSimModel.getTemplateWarRuleId() == null) {
                callback();
            } else {
                Twns.PanelHelpers.open(Twns.PanelHelpers.PanelDict.CommonConfirmPanel, {
                    content : Lang.getText(LangTextType.A0129),
                    callback: () => {
                        Twns.MapEditor.MeSimModel.setCustomWarRuleId();
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

    class InfoRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForInfoRenderer> {
        private readonly _btnTitle!     : TwnsUiButton.UiButton;
        private readonly _labelValue!   : TwnsUiLabel.UiLabel;

        protected _onOpened(): void {
            this._setUiListenerArray([
                { ui: this._btnTitle,   callback: this._onTouchedBtnTitle },
            ]);
        }

        protected _onDataChanged(): void {
            const data                  = this._getData();
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
}

// export default TwnsMeSimAdvancedSettingsPage;
