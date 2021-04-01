
namespace TinyWars.MultiCustomRoom {
    import ProtoTypes       = Utility.ProtoTypes;
    import FloatText        = Utility.FloatText;
    import Lang             = Utility.Lang;
    import CommonConstants  = Utility.CommonConstants;
    import Notify           = Utility.Notify;

    export class McrCreateAdvancedSettingsPage extends GameUi.UiTabPage {
        private readonly _btnReset      : GameUi.UiButton;
        private readonly _listSetting   : GameUi.UiScrollList<DataForSettingRenderer>;
        private readonly _listPlayer    : GameUi.UiScrollList<DataForPlayerRenderer>;

        private _mapRawData : ProtoTypes.Map.IMapRawData;

        public constructor() {
            super();

            this.skinName = "resource/skins/multiCustomRoom/McrCreateAdvancedSettingsPage.exml";
        }

        protected async _onOpened(): Promise<void> {
            this._setNotifyListenerArray([
                { type: Notify.Type.LanguageChanged,                    callback: this._onNotifyLanguageChanged },
                { type: Notify.Type.McrCreateAvailableCoIdListChanged,  callback: this._onNotifyMcrCreateAvailableCoIdListChanged },
            ]);
            this._listSetting.setItemRenderer(SettingRenderer);
            this._listPlayer.setItemRenderer(PlayerRenderer);

            this._mapRawData = await McrModel.Create.getMapRawData();

            this._updateComponentsForLanguage();
            this._initListSetting();
            this._updateListPlayer();
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Event callbacks.
        ////////////////////////////////////////////////////////////////////////////////
        private _onNotifyLanguageChanged(): void {
            this._updateComponentsForLanguage();
        }
        private _onNotifyMcrCreateAvailableCoIdListChanged(e: egret.Event): void {
            this._updateListPlayer();
        }

        ////////////////////////////////////////////////////////////////////////////////
        // View functions.
        ////////////////////////////////////////////////////////////////////////////////
        private _updateComponentsForLanguage(): void {
            this._btnReset.label = Lang.getText(Lang.Type.B0567);
        }

        private _initListSetting(): void {
            const dataArray: DataForSettingRenderer[] = [];
            // TODO
            this._listSetting.bindData(dataArray);
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

    type DataForSettingRenderer = {
        nameLangType    : Lang.Type;
        callbackForHelp : (() => void) | null;
    }
    class SettingRenderer extends GameUi.UiListItemRenderer {
        private readonly _labelName : GameUi.UiLabel;
        private readonly _btnHelp   : GameUi.UiButton;

        protected _onOpened(): void {
            this._setUiListenerArray([
                { ui: this._btnHelp,    callback: this._onTouchedBtnHelp },
            ]);
        }

        protected dataChanged(): void {
            super.dataChanged();

            const data = this.data as DataForSettingRenderer;
            if (data) {
                this._labelName.text    = Lang.getText(data.nameLangType);
                this._btnHelp.visible   = !!data.callbackForHelp;
            }
        }

        private _onTouchedBtnHelp(e: egret.Event): void {
            const data = this.data as DataForSettingRenderer;
            if ((data) && (data.callbackForHelp)) {
                data.callbackForHelp();
            }
        }
    }

    type DataForPlayerRenderer = {
        playerIndex : number;
    }
    class PlayerRenderer extends GameUi.UiListItemRenderer {
        private _labelPlayerIndex   : GameUi.UiLabel;
        private _listInfo           : GameUi.UiScrollList<DataForInfoRenderer>;

        protected childrenCreated(): void {
            super.childrenCreated();

            this._listInfo.setItemRenderer(InfoRenderer);
        }

        protected dataChanged(): void {
            super.dataChanged();

            this._updateView();
        }

        private _updateView(): void {
            const data = this.data as DataForPlayerRenderer;
            if (data) {
                this._labelPlayerIndex.text = `P${data.playerIndex}`;
                this._listInfo.bindData(this._createDataForListInfo());
            }
        }

        private _createDataForListInfo(): DataForInfoRenderer[] {
            const data          = this.data as DataForPlayerRenderer;
            const playerIndex   = data.playerIndex;
            return [
                this._createDataTeamIndex(playerIndex),
                this._createDataAvailableCoIdList(playerIndex),
                this._createDataInitialFund(playerIndex),
                this._createDataIncomeMultiplier(playerIndex),
                this._createDataInitialEnergyPercentage(playerIndex),
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
                infoText                : Lang.getPlayerTeamName(McrModel.Create.getTeamIndex(playerIndex)),
                infoColor               : 0xFFFFFF,
                callbackOnTouchedTitle  : () => {
                    this._confirmUseCustomRule(() => {
                        McrModel.Create.tickTeamIndex(playerIndex);
                        this._updateView();
                    });
                },
            };
        }
        private _createDataAvailableCoIdList(playerIndex: number): DataForInfoRenderer {
            return {
                titleText               : Lang.getText(Lang.Type.B0403),
                infoText                : `${McrModel.Create.getAvailableCoIdList(playerIndex).length}`,
                infoColor               : 0xFFFFFF,
                callbackOnTouchedTitle  : () => {
                    this._confirmUseCustomRule(() => {
                        McrCreateAvailableCoPanel.show({ playerIndex });
                    });
                },
            };
        }
        private _createDataInitialFund(playerIndex: number): DataForInfoRenderer {
            const currValue = McrModel.Create.getInitialFund(playerIndex);
            return {
                titleText               : Lang.getText(Lang.Type.B0178),
                infoText                : `${currValue}`,
                infoColor               : getTextColor(currValue, CommonConstants.WarRuleInitialFundDefault),
                callbackOnTouchedTitle  : () => {
                    this._confirmUseCustomRule(() => {
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
                                    McrModel.Create.setInitialFund(playerIndex, value);
                                    this._updateView();
                                }
                            },
                        });
                    });
                }
            };
        }
        private _createDataIncomeMultiplier(playerIndex: number): DataForInfoRenderer {
            const currValue = McrModel.Create.getIncomeMultiplier(playerIndex);
            const maxValue  = CommonConstants.WarRuleIncomeMultiplierMaxLimit;
            const minValue  = CommonConstants.WarRuleIncomeMultiplierMinLimit;
            return {
                titleText               : Lang.getText(Lang.Type.B0179),
                infoText                : `${currValue}%`,
                infoColor               : getTextColor(currValue, CommonConstants.WarRuleIncomeMultiplierDefault),
                callbackOnTouchedTitle  : () => {
                    this._confirmUseCustomRule(() => {
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
                                    McrModel.Create.setIncomeMultiplier(playerIndex, value);
                                    this._updateView();
                                }
                            },
                        });
                    });
                },
            };
        }
        private _createDataInitialEnergyPercentage(playerIndex: number): DataForInfoRenderer {
            const currValue     = McrModel.Create.getInitialEnergyPercentage(playerIndex);
            const minValue      = CommonConstants.WarRuleInitialEnergyPercentageMinLimit;
            const maxValue      = CommonConstants.WarRuleInitialEnergyPercentageMaxLimit;
            return {
                titleText               : Lang.getText(Lang.Type.B0180),
                infoText                : `${currValue}%`,
                infoColor               : getTextColor(currValue, CommonConstants.WarRuleInitialEnergyPercentageDefault),
                callbackOnTouchedTitle  : () => {
                    this._confirmUseCustomRule(() => {
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
                                    McrModel.Create.setInitialEnergyPercentage(playerIndex, value);
                                    this._updateView();
                                }
                            },
                        });
                    });
                },
            };
        }
        private _createDataEnergyGrowthMultiplier(playerIndex: number): DataForInfoRenderer {
            const currValue     = McrModel.Create.getEnergyGrowthMultiplier(playerIndex);
            const minValue      = CommonConstants.WarRuleEnergyGrowthMultiplierMinLimit;
            const maxValue      = CommonConstants.WarRuleEnergyGrowthMultiplierMaxLimit;
            return {
                titleText               : Lang.getText(Lang.Type.B0181),
                infoText                : `${currValue}%`,
                infoColor               : getTextColor(currValue, CommonConstants.WarRuleEnergyGrowthMultiplierDefault),
                callbackOnTouchedTitle  : () => {
                    this._confirmUseCustomRule(() => {
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
                                    McrModel.Create.setEnergyGrowthMultiplier(playerIndex, value);
                                    this._updateView();
                                }
                            },
                        });
                    });
                },
            };
        }
        private _createDataMoveRangeModifier(playerIndex: number): DataForInfoRenderer {
            const currValue     = McrModel.Create.getMoveRangeModifier(playerIndex);
            const minValue      = CommonConstants.WarRuleMoveRangeModifierMinLimit;
            const maxValue      = CommonConstants.WarRuleMoveRangeModifierMaxLimit;
            return {
                titleText               : Lang.getText(Lang.Type.B0182),
                infoText                : `${currValue}`,
                infoColor               : getTextColor(currValue, CommonConstants.WarRuleMoveRangeModifierDefault),
                callbackOnTouchedTitle  : () => {
                    this._confirmUseCustomRule(() => {
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
                                    McrModel.Create.setMoveRangeModifier(playerIndex, value);
                                    this._updateView();
                                }
                            },
                        });
                    });
                },
            };
        }
        private _createDataAttackPowerModifier(playerIndex: number): DataForInfoRenderer {
            const currValue     = McrModel.Create.getAttackPowerModifier(playerIndex);
            const minValue      = CommonConstants.WarRuleOffenseBonusMinLimit;
            const maxValue      = CommonConstants.WarRuleOffenseBonusMaxLimit;
            return {
                titleText               : Lang.getText(Lang.Type.B0183),
                infoText                : `${currValue}%`,
                infoColor               : getTextColor(currValue, CommonConstants.WarRuleOffenseBonusDefault),
                callbackOnTouchedTitle  : () => {
                    this._confirmUseCustomRule(() => {
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
                                    McrModel.Create.setAttackPowerModifier(playerIndex, value);
                                    this._updateView();
                                }
                            },
                        });
                    });
                },
            };
        }
        private _createDataVisionRangeModifier(playerIndex: number): DataForInfoRenderer {
            const currValue     = McrModel.Create.getVisionRangeModifier(playerIndex);
            const minValue      = CommonConstants.WarRuleVisionRangeModifierMinLimit;
            const maxValue      = CommonConstants.WarRuleVisionRangeModifierMaxLimit;
            return {
                titleText               : Lang.getText(Lang.Type.B0184),
                infoText                : `${currValue}`,
                infoColor               : getTextColor(currValue, CommonConstants.WarRuleVisionRangeModifierDefault),
                callbackOnTouchedTitle  : () => {
                    this._confirmUseCustomRule(() => {
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
                                    McrModel.Create.setVisionRangeModifier(playerIndex, value);
                                    this._updateView();
                                }
                            },
                        });
                    });
                },
            };
        }
        private _createDataLuckLowerLimit(playerIndex: number): DataForInfoRenderer {
            const currValue     = McrModel.Create.getLuckLowerLimit(playerIndex);
            const minValue      = CommonConstants.WarRuleLuckMinLimit;
            const maxValue      = CommonConstants.WarRuleLuckMaxLimit;
            return {
                titleText               : Lang.getText(Lang.Type.B0189),
                infoText                : `${currValue}%`,
                infoColor               : getTextColor(currValue, CommonConstants.WarRuleLuckDefaultLowerLimit),
                callbackOnTouchedTitle  : () => {
                    this._confirmUseCustomRule(() => {
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
                                    const upperLimit = McrModel.Create.getLuckUpperLimit(playerIndex);
                                    if (value <= upperLimit) {
                                        McrModel.Create.setLuckLowerLimit(playerIndex, value);
                                    } else {
                                        McrModel.Create.setLuckUpperLimit(playerIndex, value);
                                        McrModel.Create.setLuckLowerLimit(playerIndex, upperLimit);
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
            const currValue     = McrModel.Create.getLuckUpperLimit(playerIndex);
            const minValue      = CommonConstants.WarRuleLuckMinLimit;
            const maxValue      = CommonConstants.WarRuleLuckMaxLimit;
            return {
                titleText               : Lang.getText(Lang.Type.B0190),
                infoText                : `${currValue}%`,
                infoColor               : getTextColor(currValue, CommonConstants.WarRuleLuckDefaultUpperLimit),
                callbackOnTouchedTitle  : () => {
                    this._confirmUseCustomRule(() => {
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
                                    const lowerLimit = McrModel.Create.getLuckLowerLimit(playerIndex);
                                    if (value >= lowerLimit) {
                                        McrModel.Create.setLuckUpperLimit(playerIndex, value);
                                    } else {
                                        McrModel.Create.setLuckLowerLimit(playerIndex, value);
                                        McrModel.Create.setLuckUpperLimit(playerIndex, lowerLimit);
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
            if (McrModel.Create.getPresetWarRuleId() == null) {
                callback();
            } else {
                Common.CommonConfirmPanel.show({
                    content : Lang.getText(Lang.Type.A0129),
                    callback: () => {
                        McrModel.Create.setPresetWarRuleId(null);
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
    }
    class InfoRenderer extends GameUi.UiListItemRenderer {
        private _btnTitle   : GameUi.UiButton;
        private _labelValue : GameUi.UiLabel;

        protected childrenCreated(): void {
            super.childrenCreated();

            this._btnTitle.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onTouchedBtnTitle, this);
        }

        protected dataChanged(): void {
            super.dataChanged();

            const data                  = this.data as DataForInfoRenderer;
            this._labelValue.text       = data.infoText;
            this._labelValue.textColor  = data.infoColor;
            this._btnTitle.label        = data.titleText;
            this._btnTitle.setTextColor(data.callbackOnTouchedTitle ? 0x00FF00 : 0xFFFFFF);
        }

        private _onTouchedBtnTitle(e: egret.TouchEvent): void {
            const data      = this.data as DataForInfoRenderer;
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
