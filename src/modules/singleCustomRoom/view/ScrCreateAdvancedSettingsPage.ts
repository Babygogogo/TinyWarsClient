
namespace TinyWars.SingleCustomRoom {
    import ProtoTypes       = Utility.ProtoTypes;
    import FloatText        = Utility.FloatText;
    import Lang             = Utility.Lang;
    import Notify           = Utility.Notify;
    import WarMapModel      = WarMap.WarMapModel;
    import CommonConstants  = Utility.CommonConstants;

    export class ScrCreateAdvancedSettingsPage extends GameUi.UiTabPage<void> {
        private _labelMapNameTitle      : GameUi.UiLabel;
        private _labelMapName           : GameUi.UiLabel;
        private _labelPlayersCountTitle : GameUi.UiLabel;
        private _labelPlayersCount      : GameUi.UiLabel;
        private _labelPlayerList        : GameUi.UiLabel;
        private _listPlayer             : GameUi.UiScrollList<DataForPlayerRenderer>;

        private _mapRawData             : ProtoTypes.Map.IMapRawData;

        public constructor() {
            super();

            this.skinName = "resource/skins/singleCustomRoom/ScrCreateAdvancedSettingsPage.exml";
        }

        protected async _onOpened(): Promise<void> {
            this._setNotifyListenerArray([
                { type: Notify.Type.LanguageChanged, callback: this._onNotifyLanguageChanged },
            ]);
            this._listPlayer.setItemRenderer(PlayerRenderer);

            this._mapRawData = await ScrModel.Create.getMapRawData();

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
            WarMapModel.getMapNameInCurrentLanguage(this._mapRawData.mapId).then(v => this._labelMapName.text = v);
        }

        private _updateLabelPlayersCount(): void {
            this._labelPlayersCount.text = "" + this._mapRawData.playersCountUnneutral;
        }

        private _updateListPlayer(): void {
            const playersCount  = this._mapRawData.playersCountUnneutral;
            const dataList      : DataForPlayerRenderer[] = [];
            for (let playerIndex = 1; playerIndex <= playersCount; ++playerIndex) {
                dataList.push({ playerIndex });
            }
            this._listPlayer.bindData(dataList);
        }
    }

    type DataForPlayerRenderer = {
        playerIndex : number;
    }

    class PlayerRenderer extends GameUi.UiListItemRenderer<DataForPlayerRenderer> {
        private _listInfo   : GameUi.UiScrollList<DataForInfoRenderer>;

        protected childrenCreated(): void {
            super.childrenCreated();

            this._listInfo.setItemRenderer(InfoRenderer);
        }

        protected dataChanged(): void {
            super.dataChanged();

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
                this._createDataTeamIndex(playerIndex),
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
        private _createDataTeamIndex(playerIndex: number): DataForInfoRenderer {
            return {
                titleText               : Lang.getText(Lang.Type.B0019),
                infoText                : Lang.getPlayerTeamName(ScrModel.Create.getTeamIndex(playerIndex)),
                infoColor               : 0xFFFFFF,
                callbackOnTouchedTitle  : () => {
                    ScrModel.Create.tickTeamIndex(playerIndex);
                    this._updateView();
                },
            };
        }
        private _createDataInitialFund(playerIndex: number): DataForInfoRenderer {
            const currValue = ScrModel.Create.getInitialFund(playerIndex);
            return {
                titleText               : Lang.getText(Lang.Type.B0178),
                infoText                : `${currValue}`,
                infoColor               : getTextColor(currValue, CommonConstants.WarRuleInitialFundDefault),
                callbackOnTouchedTitle  : () => {
                    const maxValue  = CommonConstants.WarRuleInitialFundMaxLimit;
                    const minValue  = CommonConstants.WarRuleInitialFundMinLimit;
                    Common.CommonInputPanel.show({
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
                                ScrModel.Create.setInitialFund(playerIndex, value);
                                this._updateView();
                            }
                        },
                    });
                },
            };
        }
        private _createDataIncomeMultiplier(playerIndex: number): DataForInfoRenderer {
            const currValue = ScrModel.Create.getIncomeMultiplier(playerIndex);
            const maxValue  = CommonConstants.WarRuleIncomeMultiplierMaxLimit;
            const minValue  = CommonConstants.WarRuleIncomeMultiplierMinLimit;
            return {
                titleText               : Lang.getText(Lang.Type.B0179),
                infoText                : `${currValue}%`,
                infoColor               : getTextColor(currValue, CommonConstants.WarRuleIncomeMultiplierDefault),
                callbackOnTouchedTitle  : () => {
                    Common.CommonInputPanel.show({
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
                                ScrModel.Create.setIncomeMultiplier(playerIndex, value);
                                this._updateView();
                            }
                        },
                    });
                },
            };
        }
        private _createDataEnergyAddPctOnLoadCo(playerIndex: number): DataForInfoRenderer {
            const currValue     = ScrModel.Create.getEnergyAddPctOnLoadCo(playerIndex);
            const minValue      = CommonConstants.WarRuleEnergyAddPctOnLoadCoMinLimit;
            const maxValue      = CommonConstants.WarRuleEnergyAddPctOnLoadCoMaxLimit;
            return {
                titleText               : Lang.getText(Lang.Type.B0180),
                infoText                : `${currValue}%`,
                infoColor               : getTextColor(currValue, CommonConstants.WarRuleEnergyAddPctOnLoadCoDefault),
                callbackOnTouchedTitle  : () => {
                    Common.CommonInputPanel.show({
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
                                ScrModel.Create.setEnergyAddPctOnLoadCo(playerIndex, value);
                                this._updateView();
                            }
                        },
                    });
                },
            };
        }
        private _createDataEnergyGrowthMultiplier(playerIndex: number): DataForInfoRenderer {
            const currValue     = ScrModel.Create.getEnergyGrowthMultiplier(playerIndex);
            const minValue      = CommonConstants.WarRuleEnergyGrowthMultiplierMinLimit;
            const maxValue      = CommonConstants.WarRuleEnergyGrowthMultiplierMaxLimit;
            return {
                titleText               : Lang.getText(Lang.Type.B0181),
                infoText                : `${currValue}%`,
                infoColor               : getTextColor(currValue, CommonConstants.WarRuleEnergyGrowthMultiplierDefault),
                callbackOnTouchedTitle  : () => {
                    Common.CommonInputPanel.show({
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
                                ScrModel.Create.setEnergyGrowthMultiplier(playerIndex, value);
                                this._updateView();
                            }
                        },
                    });
                },
            };
        }
        private _createDataMoveRangeModifier(playerIndex: number): DataForInfoRenderer {
            const currValue     = ScrModel.Create.getMoveRangeModifier(playerIndex);
            const minValue      = CommonConstants.WarRuleMoveRangeModifierMinLimit;
            const maxValue      = CommonConstants.WarRuleMoveRangeModifierMaxLimit;
            return {
                titleText               : Lang.getText(Lang.Type.B0182),
                infoText                : `${currValue}`,
                infoColor               : getTextColor(currValue, CommonConstants.WarRuleMoveRangeModifierDefault),
                callbackOnTouchedTitle  : () => {
                    Common.CommonInputPanel.show({
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
                                ScrModel.Create.setMoveRangeModifier(playerIndex, value);
                                this._updateView();
                            }
                        },
                    });
                },
            };
        }
        private _createDataAttackPowerModifier(playerIndex: number): DataForInfoRenderer {
            const currValue     = ScrModel.Create.getAttackPowerModifier(playerIndex);
            const minValue      = CommonConstants.WarRuleOffenseBonusMinLimit;
            const maxValue      = CommonConstants.WarRuleOffenseBonusMaxLimit;
            return {
                titleText               : Lang.getText(Lang.Type.B0183),
                infoText                : `${currValue}%`,
                infoColor               : getTextColor(currValue, CommonConstants.WarRuleOffenseBonusDefault),
                callbackOnTouchedTitle  : () => {
                    Common.CommonInputPanel.show({
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
                                ScrModel.Create.setAttackPowerModifier(playerIndex, value);
                                this._updateView();
                            }
                        },
                    });
                },
            };
        }
        private _createDataVisionRangeModifier(playerIndex: number): DataForInfoRenderer {
            const currValue     = ScrModel.Create.getVisionRangeModifier(playerIndex);
            const minValue      = CommonConstants.WarRuleVisionRangeModifierMinLimit;
            const maxValue      = CommonConstants.WarRuleVisionRangeModifierMaxLimit;
            return {
                titleText               : Lang.getText(Lang.Type.B0184),
                infoText                : `${currValue}`,
                infoColor               : getTextColor(currValue, CommonConstants.WarRuleVisionRangeModifierDefault),
                callbackOnTouchedTitle  : () => {
                    Common.CommonInputPanel.show({
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
                                ScrModel.Create.setVisionRangeModifier(playerIndex, value);
                                this._updateView();
                            }
                        },
                    });
                },
            };
        }
        private _createDataLuckLowerLimit(playerIndex: number): DataForInfoRenderer {
            const currValue     = ScrModel.Create.getLuckLowerLimit(playerIndex);
            const minValue      = CommonConstants.WarRuleLuckMinLimit;
            const maxValue      = CommonConstants.WarRuleLuckMaxLimit;
            return {
                titleText               : Lang.getText(Lang.Type.B0189),
                infoText                : `${currValue}%`,
                infoColor               : getTextColor(currValue, CommonConstants.WarRuleLuckDefaultLowerLimit),
                callbackOnTouchedTitle  : () => {
                    Common.CommonInputPanel.show({
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
                                const upperLimit = ScrModel.Create.getLuckUpperLimit(playerIndex);
                                if (value <= upperLimit) {
                                    ScrModel.Create.setLuckLowerLimit(playerIndex, value);
                                } else {
                                    ScrModel.Create.setLuckUpperLimit(playerIndex, value);
                                    ScrModel.Create.setLuckLowerLimit(playerIndex, upperLimit);
                                }
                                this._updateView();
                            }
                        },
                    });
                },
            };
        }
        private _createDataLuckUpperLimit(playerIndex: number): DataForInfoRenderer {
            const currValue     = ScrModel.Create.getLuckUpperLimit(playerIndex);
            const minValue      = CommonConstants.WarRuleLuckMinLimit;
            const maxValue      = CommonConstants.WarRuleLuckMaxLimit;
            return {
                titleText               : Lang.getText(Lang.Type.B0190),
                infoText                : `${currValue}%`,
                infoColor               : getTextColor(currValue, CommonConstants.WarRuleLuckDefaultUpperLimit),
                callbackOnTouchedTitle  : () => {
                        Common.CommonInputPanel.show({
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
                                    const lowerLimit = ScrModel.Create.getLuckLowerLimit(playerIndex);
                                    if (value >= lowerLimit) {
                                        ScrModel.Create.setLuckUpperLimit(playerIndex, value);
                                    } else {
                                        ScrModel.Create.setLuckLowerLimit(playerIndex, value);
                                        ScrModel.Create.setLuckUpperLimit(playerIndex, lowerLimit);
                                    }
                                    this._updateView();
                                }
                            },
                        });
                    },
            };
        }
    }

    type DataForInfoRenderer = {
        titleText               : string;
        infoText                : string;
        infoColor               : number;
        callbackOnTouchedTitle  : (() => void) | null;
    }

    class InfoRenderer extends GameUi.UiListItemRenderer<DataForInfoRenderer> {
        private _btnTitle   : GameUi.UiButton;
        private _labelValue : GameUi.UiLabel;

        protected childrenCreated(): void {
            super.childrenCreated();

            this._btnTitle.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onTouchedBtnTitle, this);
        }

        protected dataChanged(): void {
            super.dataChanged();

            const data                  = this.data;
            this._labelValue.text       = data.infoText;
            this._labelValue.textColor  = data.infoColor;
            this._btnTitle.label        = data.titleText;
            this._btnTitle.setTextColor(data.callbackOnTouchedTitle ? 0x00FF00 : 0xFFFFFF);
        }

        private _onTouchedBtnTitle(e: egret.TouchEvent): void {
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
