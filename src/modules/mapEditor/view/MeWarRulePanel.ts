
namespace TinyWars.MapEditor {
    import Types                = Utility.Types;
    import Lang                 = Utility.Lang;
    import Notify               = Utility.Notify;
    import ProtoTypes           = Utility.ProtoTypes;
    import FloatText            = Utility.FloatText;
    import ConfigManager        = Utility.ConfigManager;
    import BwSettingsHelper     = BaseWar.BwSettingsHelper;
    import CommonConfirmPanel   = Common.CommonConfirmPanel;
    import CommonHelpPanel      = Common.CommonHelpPanel;
    import IWarRule             = ProtoTypes.WarRule.IWarRule;
    import IDataForPlayerRule   = ProtoTypes.WarRule.IDataForPlayerRule;
    import CommonConstants      = ConfigManager.COMMON_CONSTANTS;

    export class MeWarRulePanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Hud0;
        protected readonly _IS_EXCLUSIVE = false;

        private static _instance: MeWarRulePanel;

        private _labelMenuTitle         : GameUi.UiLabel;
        private _listWarRule            : GameUi.UiScrollList;
        private _btnAddRule             : GameUi.UiButton;
        private _btnDelete              : GameUi.UiButton;
        private _btnBack                : GameUi.UiButton;

        private _btnModifyRuleName      : GameUi.UiButton;
        private _labelRuleName          : GameUi.UiLabel;

        private _btnModifyHasFog        : GameUi.UiButton;
        private _imgHasFog              : GameUi.UiImage;
        private _btnHelpHasFog          : GameUi.UiButton;

        private _labelAvailability      : GameUi.UiLabel;
        private _btnAvailabilityMcw     : GameUi.UiButton;
        private _imgAvailabilityMcw     : GameUi.UiImage;
        private _btnAvailabilityScw     : GameUi.UiButton;
        private _imgAvailabilityScw     : GameUi.UiImage;
        private _btnAvailabilityRank    : GameUi.UiButton;
        private _imgAvailabilityRank    : GameUi.UiImage;
        private _btnAvailabilityWr      : GameUi.UiButton;
        private _imgAvailabilityWr      : GameUi.UiImage;

        private _labelWarEventListTitle : GameUi.UiLabel;
        private _btnAddWarEvent         : GameUi.UiButton;
        private _btnEditWarEvent        : GameUi.UiButton;
        private _listWarEvent           : GameUi.UiScrollList;

        private _labelPlayerList        : GameUi.UiLabel;
        private _listPlayer             : GameUi.UiScrollList;

        private _war                    : MeWar;
        private _dataForListWarRule     : DataForWarRuleNameRenderer[] = [];
        private _selectedIndex          : number;
        private _selectedRule           : IWarRule;

        public static show(): void {
            if (!MeWarRulePanel._instance) {
                MeWarRulePanel._instance = new MeWarRulePanel();
            }
            MeWarRulePanel._instance.open();
        }
        public static hide(): void {
            if (MeWarRulePanel._instance) {
                MeWarRulePanel._instance.close();
            }
        }
        public static getIsOpening(): boolean {
            const instance = MeWarRulePanel._instance;
            return instance ? instance.getIsOpening() : false;
        }

        public constructor() {
            super();

            this._setAutoAdjustHeightEnabled();
            this._setTouchMaskEnabled();
            this.skinName = "resource/skins/mapEditor/MeWarRulePanel.exml";
        }

        protected _onFirstOpened(): void {
            this._setNotifyListenerArray([
                { type: Notify.Type.LanguageChanged,        callback: this._onNotifyLanguageChanged },
                { type: Notify.Type.MeWarRuleNameChanged,   callback: this._onNotifyMeWarRuleNameChanged },
            ]);
            this._setUiListenerArray([
                { ui: this._btnBack,                callback: this._onTouchTapBtnBack },
                { ui: this._btnAddRule,             callback: this._onTouchedBtnAddRule },
                { ui: this._btnDelete,              callback: this._onTouchedBtnDelete },
                { ui: this._btnHelpHasFog,          callback: this._onTouchedBtnHelpHasFog },
                { ui: this._btnModifyHasFog,        callback: this._onTouchedBtnModifyHasFog },
                { ui: this._btnModifyRuleName,      callback: this._onTouchedBtnModifyRuleName },
                { ui: this._btnAvailabilityMcw,     callback: this._onTouchedBtnAvailabilityMcw },
                { ui: this._btnAvailabilityScw,     callback: this._onTouchedBtnAvailabilityScw },
                { ui: this._btnAvailabilityRank,    callback: this._onTouchedBtnAvailabilityRank },
                { ui: this._btnAvailabilityWr,      callback: this._onTouchedBtnAvailabilityWr },
                { ui: this._btnEditWarEvent,        callback: this._onTouchedBtnEditWarEvent },
                { ui: this._btnAddWarEvent,         callback: this._onTouchedBtnAddWarEvent },
            ]);
            this._listWarRule.setItemRenderer(WarRuleNameRenderer);
            this._listWarEvent.setItemRenderer(WarEventRenderer);
            this._listPlayer.setItemRenderer(PlayerRenderer);
        }
        protected _onOpened(): void {
            this._updateComponentsForLanguage();

            this._war = MeManager.getWar();
            this._resetView();
        }
        protected _onClosed(): void {
            this._war = null;
            this._listWarRule.clear();
            this._listWarEvent.clear();
            this._listPlayer.clear();

            Notify.dispatch(Notify.Type.BwCoListPanelClosed);
        }

        public setSelectedIndex(newIndex: number): void {
            const dataList = this._dataForListWarRule;
            if (!dataList[newIndex]) {
                this._selectedIndex = null;
                this._selectedRule  = null;
                this._updateComponentsForRule();

            } else {
                const oldIndex      = this._selectedIndex;
                this._selectedIndex = newIndex;
                this._selectedRule  = dataList[newIndex].rule;
                (dataList[oldIndex])    && (this._listWarRule.updateSingleData(oldIndex, dataList[oldIndex]));
                (oldIndex !== newIndex) && (this._listWarRule.updateSingleData(newIndex, dataList[newIndex]));

                this._updateComponentsForRule();
            }
        }
        public getSelectedIndex(): number {
            return this._selectedIndex;
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Callbacks.
        ////////////////////////////////////////////////////////////////////////////////
        private _onNotifyLanguageChanged(e: egret.Event): void {
            this._updateComponentsForLanguage();
        }

        private _onNotifyMeWarRuleNameChanged(e: egret.Event): void {
            this._updateLabelRuleName(this._selectedRule);
        }

        private _onTouchTapBtnBack(e: egret.TouchEvent): void {
            this.close();
            MeWarMenuPanel.show();
        }

        private _onTouchedBtnDelete(e: egret.TouchEvent): void {
            const selectedRule = this._selectedRule;
            if (selectedRule != null) {
                const war = this._war;
                if (war.getWarRuleList().length <= 1) {
                    FloatText.show(Lang.getText(Lang.Type.A0096));
                } else {
                    CommonConfirmPanel.show({
                        title   : Lang.getText(Lang.Type.B0088),
                        content : Lang.getText(Lang.Type.A0097),
                        callback: () => {
                            war.deleteWarRule(selectedRule.ruleId);
                            this._resetView();
                        },
                    });
                }
            }
        }

        private _onTouchedBtnAddRule(e: egret.TouchEvent): void {
            const war = this._war;
            if (war.getWarRuleList().length >= CommonConstants.WarRuleMaxCount) {
                FloatText.show(Lang.getText(Lang.Type.A0099));
            } else {
                war.addWarRule();
                this._resetView();
            }
        }

        private _onTouchedBtnHelpHasFog(e: egret.TouchEvent): void {
            CommonHelpPanel.show({
                title  : Lang.getText(Lang.Type.B0020),
                content: Lang.getRichText(Lang.RichType.R0002),
            });
        }

        private _onTouchedBtnModifyHasFog(e: egret.TouchEvent): void {
            const rule = this._selectedRule;
            if ((rule) && (!this._war.getIsReviewingMap())) {
                BwSettingsHelper.setHasFogByDefault(rule, !BwSettingsHelper.getHasFogByDefault(rule));
                this._updateImgHasFog(rule);
            }
        }

        private _onTouchedBtnModifyRuleName(e: egret.TouchEvent): void {
            const rule = this._selectedRule;
            if ((rule) && (!this._war.getIsReviewingMap())) {
                MeModifyRuleNamePanel.show({ ruleId: rule.ruleId });
            }
        }

        private _onTouchedBtnAvailabilityMcw(e: egret.TouchEvent): void {
            const rule = this._selectedRule;
            if ((rule) && (!this._war.getIsReviewingMap())) {
                rule.ruleAvailability.canMcw = !rule.ruleAvailability.canMcw;
                this._updateImgAvailabilityMcw(rule);
            }
        }

        private _onTouchedBtnAvailabilityScw(e: egret.TouchEvent): void {
            const rule = this._selectedRule;
            if ((rule) && (!this._war.getIsReviewingMap())) {
                rule.ruleAvailability.canScw = !rule.ruleAvailability.canScw;
                this._updateImgAvailabilityScw(rule);
            }
        }

        private _onTouchedBtnAvailabilityRank(e: egret.TouchEvent): void {
            const rule = this._selectedRule;
            if ((rule) && (!this._war.getIsReviewingMap())) {
                rule.ruleAvailability.canRank = !rule.ruleAvailability.canRank;
                this._updateImgAvailabilityRank(rule);
            }
        }

        private _onTouchedBtnAvailabilityWr(e: egret.TouchEvent): void {
            const rule = this._selectedRule;
            if ((rule) && (!this._war.getIsReviewingMap())) {
                rule.ruleAvailability.canWr = !rule.ruleAvailability.canWr;
                this._updateImgAvailabilityWr(rule);
            }
        }

        private _onTouchedBtnEditWarEvent(e: egret.TouchEvent): void {
            // TODO
            FloatText.show("TODO");
        }

        private _onTouchedBtnAddWarEvent(e: egret.TouchEvent): void {
            // TODO
            FloatText.show("TODO");
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Private functions.
        ////////////////////////////////////////////////////////////////////////////////
        private _resetView(): void {
            const canModify                 = !this._war.getIsReviewingMap();
            const colorForButtons           = canModify ? 0x00FF00 : 0xFFFFFF;
            this._btnDelete.visible         = canModify;
            this._btnAddRule.visible        = canModify;
            this._btnAddWarEvent.visible    = canModify;
            this._btnEditWarEvent.visible   = canModify;
            this._btnBack.setTextColor(0x00FF00);
            this._btnAvailabilityMcw.setTextColor(colorForButtons);
            this._btnAvailabilityRank.setTextColor(colorForButtons);
            this._btnAvailabilityScw.setTextColor(colorForButtons);
            this._btnAvailabilityWr.setTextColor(colorForButtons);
            this._btnModifyHasFog.setTextColor(colorForButtons);
            this._btnDelete.setTextColor(0xFF0000);
            this._btnAddRule.setTextColor(colorForButtons);
            this._btnModifyRuleName.setTextColor(colorForButtons);

            this._dataForListWarRule = this._createDataForListWarRule();
            this._listWarRule.bindData(this._dataForListWarRule);
            this.setSelectedIndex(0);
        }

        private _updateComponentsForLanguage(): void {
            this._labelMenuTitle.text           = Lang.getText(Lang.Type.B0314);
            this._labelAvailability.text        = Lang.getText(Lang.Type.B0406);
            this._labelPlayerList.text          = Lang.getText(Lang.Type.B0407);
            this._btnAvailabilityMcw.label      = Lang.getText(Lang.Type.B0137);
            this._btnAvailabilityScw.label      = Lang.getText(Lang.Type.B0138);
            this._btnAvailabilityRank.label     = Lang.getText(Lang.Type.B0404);
            this._btnAvailabilityWr.label       = Lang.getText(Lang.Type.B0257);
            this._btnBack.label                 = Lang.getText(Lang.Type.B0146);
            this._btnDelete.label               = Lang.getText(Lang.Type.B0220);
            this._btnAddRule.label              = Lang.getText(Lang.Type.B0320);
            this._btnModifyRuleName.label       = Lang.getText(Lang.Type.B0315);
            this._btnModifyHasFog.label         = Lang.getText(Lang.Type.B0020);
            this._labelWarEventListTitle.text   = Lang.getText(Lang.Type.B0461);
            this._btnAddWarEvent.label          = Lang.getText(Lang.Type.B0320);
            this._btnEditWarEvent.label         = Lang.getText(Lang.Type.B0465);
        }

        private _createDataForListWarRule(): DataForWarRuleNameRenderer[] {
            const data  : DataForWarRuleNameRenderer[] = [];
            let index   = 0;
            for (const rule of this._war.getWarRuleList()) {
                data.push({
                    index,
                    rule,
                    panel   : this,
                });
                ++index;
            }

            return data;
        }

        private _updateComponentsForRule(): void {
            const rule = this._selectedRule;
            this._updateLabelRuleName(rule);
            this._updateImgHasFog(rule);
            this._updateImgAvailabilityMcw(rule);
            this._updateImgAvailabilityScw(rule);
            this._updateImgAvailabilityRank(rule);
            this._updateImgAvailabilityWr(rule);
            this._updateListWarEvent(rule);
            this._updateListPlayerRule(rule);
        }

        private _updateLabelRuleName(rule: IWarRule): void {
            this._labelRuleName.text = Lang.concatLanguageTextList(rule ? rule.ruleNameList : undefined) || Lang.getText(Lang.Type.B0001);
        }
        private _updateImgHasFog(rule: IWarRule): void {
            this._imgHasFog.visible = rule ? rule.ruleForGlobalParams.hasFogByDefault : false;
        }
        private _updateImgAvailabilityMcw(rule: IWarRule): void {
            this._imgAvailabilityMcw.visible = rule ? rule.ruleAvailability.canMcw : false;
        }
        private _updateImgAvailabilityScw(rule: IWarRule): void {
            this._imgAvailabilityScw.visible = rule ? rule.ruleAvailability.canScw : false;
        }
        private _updateImgAvailabilityRank(rule: IWarRule): void {
            this._imgAvailabilityRank.visible = rule ? rule.ruleAvailability.canRank : false;
        }
        private _updateImgAvailabilityWr(rule: IWarRule): void {
            this._imgAvailabilityWr.visible = rule ? rule.ruleAvailability.canWr : false;
        }
        private _updateListWarEvent(rule: IWarRule): void {
            // TODO
            this._listWarEvent.bindData(["", ""]);
        }
        private _updateListPlayerRule(rule: IWarRule): void {
            const playerRuleDataList    = rule ? rule.ruleForPlayers.playerRuleDataList : null;
            const listPlayer            = this._listPlayer;
            if ((!playerRuleDataList) || (!playerRuleDataList.length)) {
                listPlayer.clear();
            } else {
                const dataList  : DataForPlayerRenderer[] = [];
                let index       = 0;
                for (const playerRule of playerRuleDataList) {
                    dataList.push({
                        index,
                        playerRule,
                        warRule     : rule,
                        isReviewing : this._war.getIsReviewingMap(),
                        panel       : this,
                    });
                    ++index;
                }
                listPlayer.bindData(dataList);
            }
        }
    }

    type DataForWarRuleNameRenderer = {
        index   : number;
        rule    : IWarRule;
        panel   : MeWarRulePanel;
    }

    class WarRuleNameRenderer extends GameUi.UiListItemRenderer {
        private _btnChoose: GameUi.UiButton;
        private _labelName: GameUi.UiLabel;

        protected childrenCreated(): void {
            super.childrenCreated();

            this._btnChoose.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onTouchTapBtnChoose, this);
        }

        protected dataChanged(): void {
            super.dataChanged();

            const data              = this.data as DataForWarRuleNameRenderer;
            const index             = data.index;
            this.currentState       = index === data.panel.getSelectedIndex() ? Types.UiState.Down : Types.UiState.Up;
            this._labelName.text    = `${Lang.getText(Lang.Type.B0318)} ${index}`;
        }

        private _onTouchTapBtnChoose(e: egret.TouchEvent): void {
            const data = this.data as DataForWarRuleNameRenderer;
            data.panel.setSelectedIndex(data.index);
        }
    }

    type DataForPlayerRenderer = {
        index       : number;
        warRule     : IWarRule;
        playerRule  : IDataForPlayerRule;
        isReviewing : boolean;
        panel       : MeWarRulePanel;
    }

    class PlayerRenderer extends GameUi.UiListItemRenderer {
        private _listInfo   : GameUi.UiScrollList;

        protected childrenCreated(): void {
            super.childrenCreated();

            this._listInfo.setItemRenderer(InfoRenderer);
        }

        protected dataChanged(): void {
            super.dataChanged();

            this._updateView();
        }

        private _updateView(): void {
            this._listInfo.bindData(this._createDataForListInfo());
        }

        private _createDataForListInfo(): DataForInfoRenderer[] {
            const data          = this.data as DataForPlayerRenderer;
            const warRule       = data.warRule;
            const playerRule    = data.playerRule;
            const isReviewing   = data.isReviewing;
            return [
                this._createDataPlayerIndex(warRule, playerRule, isReviewing),
                this._createDataTeamIndex(warRule, playerRule, isReviewing),
                this._createDataAvailableCoIdList(warRule, playerRule, isReviewing),
                this._createDataInitialFund(warRule, playerRule, isReviewing),
                this._createDataIncomeMultiplier(warRule, playerRule, isReviewing),
                this._createDataInitialEnergyPercentage(warRule, playerRule, isReviewing),
                this._createDataEnergyGrowthMultiplier(warRule, playerRule, isReviewing),
                this._createDataMoveRangeModifier(warRule, playerRule, isReviewing),
                this._createDataAttackPowerModifier(warRule, playerRule, isReviewing),
                this._createDataVisionRangeModifier(warRule, playerRule, isReviewing),
                this._createDataLuckLowerLimit(warRule, playerRule, isReviewing),
                this._createDataLuckUpperLimit(warRule, playerRule, isReviewing),
            ];
        }
        private _createDataPlayerIndex(warRule: IWarRule, playerRule: IDataForPlayerRule, isReviewing: boolean): DataForInfoRenderer {
            return {
                titleText               : Lang.getText(Lang.Type.B0018),
                infoText                : Lang.getPlayerForceName(playerRule.playerIndex),
                infoColor               : 0xFFFFFF,
                callbackOnTouchedTitle  : null,
            };
        }
        private _createDataTeamIndex(warRule: IWarRule, playerRule: IDataForPlayerRule, isReviewing: boolean): DataForInfoRenderer {
            return {
                titleText               : Lang.getText(Lang.Type.B0019),
                infoText                : Lang.getPlayerTeamName(playerRule.teamIndex),
                infoColor               : 0xFFFFFF,
                callbackOnTouchedTitle  : isReviewing
                    ? null
                    : () => {
                        BwSettingsHelper.tickTeamIndex(warRule, playerRule.playerIndex);
                        this._updateView();
                    },
            };
        }
        private _createDataAvailableCoIdList(warRule: IWarRule, playerRule: IDataForPlayerRule, isReviewing: boolean): DataForInfoRenderer {
            return {
                titleText               : Lang.getText(Lang.Type.B0403),
                infoText                : `${playerRule.availableCoIdList.length}`,
                infoColor               : 0xFFFFFF,
                callbackOnTouchedTitle  : isReviewing
                    ? null
                    : () => {
                        MeAvailableCoPanel.show({
                            warRule,
                            playerRule,
                            isReviewing,
                            callbackOnClose : () => {
                                this._updateView();
                            },
                        });
                    },
            };
        }
        private _createDataInitialFund(warRule: IWarRule, playerRule: IDataForPlayerRule, isReviewing: boolean): DataForInfoRenderer {
            const currValue = playerRule.initialFund;
            return {
                titleText               : Lang.getText(Lang.Type.B0178),
                infoText                : `${currValue}`,
                infoColor               : getTextColor(currValue, CommonConstants.WarRuleInitialFundDefault),
                callbackOnTouchedTitle  : isReviewing
                    ? null
                    : () => {
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
                                    BwSettingsHelper.setInitialFund(warRule, playerRule.playerIndex, value);
                                    this._updateView();
                                }
                            },
                        });
                    }
            };
        }
        private _createDataIncomeMultiplier(warRule: IWarRule, playerRule: IDataForPlayerRule, isReviewing: boolean): DataForInfoRenderer {
            const currValue = playerRule.incomeMultiplier;
            return {
                titleText               : Lang.getText(Lang.Type.B0179),
                infoText                : `${currValue}%`,
                infoColor               : getTextColor(currValue, CommonConstants.WarRuleIncomeMultiplierDefault),
                callbackOnTouchedTitle  : isReviewing
                    ? null
                    : () => {
                        const maxValue  = CommonConstants.WarRuleIncomeMultiplierMaxLimit;
                        const minValue  = CommonConstants.WarRuleIncomeMultiplierMinLimit;
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
                                    BwSettingsHelper.setIncomeMultiplier(warRule, playerRule.playerIndex, value);
                                    this._updateView();
                                }
                            },
                        });
                    },
            };
        }
        private _createDataInitialEnergyPercentage(warRule: IWarRule, playerRule: IDataForPlayerRule, isReviewing: boolean): DataForInfoRenderer {
            const currValue     = playerRule.initialEnergyPercentage;
            return {
                titleText               : Lang.getText(Lang.Type.B0180),
                infoText                : `${currValue}%`,
                infoColor               : getTextColor(currValue, CommonConstants.WarRuleInitialEnergyPercentageDefault),
                callbackOnTouchedTitle  : isReviewing
                    ? null
                    : () => {
                        const minValue      = CommonConstants.WarRuleInitialEnergyPercentageMinLimit;
                        const maxValue      = CommonConstants.WarRuleInitialEnergyPercentageMaxLimit;
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
                                    BwSettingsHelper.setInitialEnergyPercentage(warRule, playerRule.playerIndex, value);
                                    this._updateView();
                                }
                            },
                        });
                    },
            };
        }
        private _createDataEnergyGrowthMultiplier(warRule: IWarRule, playerRule: IDataForPlayerRule, isReviewing: boolean): DataForInfoRenderer {
            const currValue = playerRule.energyGrowthMultiplier;
            return {
                titleText               : Lang.getText(Lang.Type.B0181),
                infoText                : `${currValue}%`,
                infoColor               : getTextColor(currValue, CommonConstants.WarRuleEnergyGrowthMultiplierDefault),
                callbackOnTouchedTitle  : isReviewing
                    ? null
                    : () => {
                        const minValue      = CommonConstants.WarRuleEnergyGrowthMultiplierMinLimit;
                        const maxValue      = CommonConstants.WarRuleEnergyGrowthMultiplierMaxLimit;
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
                                    BwSettingsHelper.setEnergyGrowthMultiplier(warRule, playerRule.playerIndex, value);
                                    this._updateView();
                                }
                            },
                        });
                },
            };
        }
        private _createDataMoveRangeModifier(warRule: IWarRule, playerRule: IDataForPlayerRule, isReviewing: boolean): DataForInfoRenderer {
            const currValue = playerRule.moveRangeModifier;
            return {
                titleText               : Lang.getText(Lang.Type.B0182),
                infoText                : `${currValue}`,
                infoColor               : getTextColor(currValue, CommonConstants.WarRuleMoveRangeModifierDefault),
                callbackOnTouchedTitle  : isReviewing
                    ? null
                    : () => {
                        const minValue      = CommonConstants.WarRuleMoveRangeModifierMinLimit;
                        const maxValue      = CommonConstants.WarRuleMoveRangeModifierMaxLimit;
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
                                    BwSettingsHelper.setMoveRangeModifier(warRule, playerRule.playerIndex, value);
                                    this._updateView();
                                }
                            },
                        });
                },
            };
        }
        private _createDataAttackPowerModifier(warRule: IWarRule, playerRule: IDataForPlayerRule, isReviewing: boolean): DataForInfoRenderer {
            const currValue = playerRule.attackPowerModifier;
            return {
                titleText               : Lang.getText(Lang.Type.B0183),
                infoText                : `${currValue}%`,
                infoColor               : getTextColor(currValue, CommonConstants.WarRuleOffenseBonusDefault),
                callbackOnTouchedTitle  : isReviewing
                    ? null
                    : () => {
                        const minValue      = CommonConstants.WarRuleOffenseBonusMinLimit;
                        const maxValue      = CommonConstants.WarRuleOffenseBonusMaxLimit;
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
                                    BwSettingsHelper.setAttackPowerModifier(warRule, playerRule.playerIndex, value);
                                    this._updateView();
                                }
                            },
                        });
                },
            };
        }
        private _createDataVisionRangeModifier(warRule: IWarRule, playerRule: IDataForPlayerRule, isReviewing: boolean): DataForInfoRenderer {
            const currValue = playerRule.visionRangeModifier;
            return {
                titleText               : Lang.getText(Lang.Type.B0184),
                infoText                : `${currValue}`,
                infoColor               : getTextColor(currValue, CommonConstants.WarRuleVisionRangeModifierDefault),
                callbackOnTouchedTitle  : isReviewing
                    ? null
                    : () => {
                        const minValue      = CommonConstants.WarRuleVisionRangeModifierMinLimit;
                        const maxValue      = CommonConstants.WarRuleVisionRangeModifierMaxLimit;
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
                                    BwSettingsHelper.setVisionRangeModifier(warRule, playerRule.playerIndex, value);
                                    this._updateView();
                                }
                            },
                        });
                },
            };
        }
        private _createDataLuckLowerLimit(warRule: IWarRule, playerRule: IDataForPlayerRule, isReviewing: boolean): DataForInfoRenderer {
            const currValue     = playerRule.luckLowerLimit;
            const playerIndex   = playerRule.playerIndex;
            return {
                titleText               : Lang.getText(Lang.Type.B0189),
                infoText                : `${currValue}%`,
                infoColor               : getTextColor(currValue, CommonConstants.WarRuleLuckDefaultLowerLimit),
                callbackOnTouchedTitle  : isReviewing
                    ? null
                    : () => {
                        const minValue      = CommonConstants.WarRuleLuckMinLimit;
                        const maxValue      = CommonConstants.WarRuleLuckMaxLimit;
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
                                    const upperLimit = BwSettingsHelper.getLuckUpperLimit(warRule, playerIndex);
                                    if (value <= upperLimit) {
                                        BwSettingsHelper.setLuckLowerLimit(warRule, playerIndex, value);
                                    } else {
                                        BwSettingsHelper.setLuckUpperLimit(warRule, playerIndex, value);
                                        BwSettingsHelper.setLuckLowerLimit(warRule, playerIndex, upperLimit);
                                    }
                                    this._updateView();
                                }
                            },
                        });
                },
            };
        }
        private _createDataLuckUpperLimit(warRule: IWarRule, playerRule: IDataForPlayerRule, isReviewing: boolean): DataForInfoRenderer {
            const currValue     = playerRule.luckUpperLimit;
            const playerIndex   = playerRule.playerIndex;
            return {
                titleText               : Lang.getText(Lang.Type.B0190),
                infoText                : `${currValue}%`,
                infoColor               : getTextColor(currValue, CommonConstants.WarRuleLuckDefaultUpperLimit),
                callbackOnTouchedTitle  : isReviewing
                    ? null
                    : () => {
                        const minValue      = CommonConstants.WarRuleLuckMinLimit;
                        const maxValue      = CommonConstants.WarRuleLuckMaxLimit;
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
                                    const lowerLimit = BwSettingsHelper.getLuckLowerLimit(warRule, playerIndex);
                                    if (value >= lowerLimit) {
                                        BwSettingsHelper.setLuckUpperLimit(warRule, playerIndex, value);
                                    } else {
                                        BwSettingsHelper.setLuckLowerLimit(warRule, playerIndex, value);
                                        BwSettingsHelper.setLuckUpperLimit(warRule, playerIndex, lowerLimit);
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

    type DataForWarEventRenderer = {

    };
    class WarEventRenderer extends GameUi.UiListItemRenderer {
        private _labelWarEventIdTitle   : GameUi.UiLabel;
        private _labelWarEventId        : GameUi.UiLabel;
        private _btnUp                  : GameUi.UiButton;
        private _btnDown                : GameUi.UiButton;
        private _btnDelete              : GameUi.UiButton;
        private _labelWarEventName      : GameUi.UiLabel;

        protected _onOpened(): void {
            this._setUiListenerArray([
                { ui: this._btnUp,      callback: this._onTouchedBtnUp },
                { ui: this._btnDown,    callback: this._onTouchedBtnDown },
                { ui: this._btnDelete,  callback: this._onTouchedBtnDelete },
            ]);
            this._setNotifyListenerArray([
                { type: Notify.Type.LanguageChanged,    callback: this._onNotifyLanguageChanged },
            ]);

            this._updateComponentsForLanguage();
        }

        private _onTouchedBtnUp(e: egret.TouchEvent): void {
            // TODO
            FloatText.show("TODO");
        }
        private _onTouchedBtnDown(e: egret.TouchEvent): void {
            // TODO
            FloatText.show("TODO");
        }
        private _onTouchedBtnDelete(e: egret.TouchEvent): void {
            // TODO
            FloatText.show("TODO");
        }
        private _onNotifyLanguageChanged(e: egret.Event): void {
            this._updateComponentsForLanguage();
        }

        protected dataChanged(): void {
            super.dataChanged();

            const data = this.data as DataForWarEventRenderer;
            // TODO
            this._labelWarEventId.text = "TODO";
            this._updateLabelWarEventName();
        }

        private _updateComponentsForLanguage(): void {
            this._labelWarEventIdTitle.text = `${Lang.getText(Lang.Type.B0462)}:`;
            this._btnUp.label               = Lang.getText(Lang.Type.B0463);
            this._btnDown.label             = Lang.getText(Lang.Type.B0464);
            this._btnDelete.label           = Lang.getText(Lang.Type.B0220);
            this._updateLabelWarEventName();
        }
        private _updateLabelWarEventName(): void {
            // TODO
            this._labelWarEventName.text = "TODO";
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
