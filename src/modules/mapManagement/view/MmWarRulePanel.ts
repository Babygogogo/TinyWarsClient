
// import TwnsCommonHelpPanel              from "../../common/view/CommonHelpPanel";
// import CommonConstants                  from "../../tools/helpers/CommonConstants";
// import Helpers                          from "../../tools/helpers/Helpers";
// import Types                            from "../../tools/helpers/Types";
// import Lang                             from "../../tools/lang/Lang";
// import TwnsLangTextType                 from "../../tools/lang/LangTextType";
// import TwnsNotifyType                   from "../../tools/notify/NotifyType";
// import ProtoTypes                       from "../../tools/proto/ProtoTypes";
// import TwnsUiButton                     from "../../tools/ui/UiButton";
// import TwnsUiImage                      from "../../tools/ui/UiImage";
// import TwnsUiLabel                      from "../../tools/ui/UiLabel";
// import TwnsUiListItemRenderer           from "../../tools/ui/UiListItemRenderer";
// import TwnsUiPanel                      from "../../tools/ui/UiPanel";
// import TwnsUiScrollList                 from "../../tools/ui/UiScrollList";
// import TwnsMmWarRuleAvailableCoPanel    from "./MmWarRuleAvailableCoPanel";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace TwnsMmWarRulePanel {
    import LangTextType                 = TwnsLangTextType.LangTextType;
    import NotifyType                   = TwnsNotifyType.NotifyType;
    import IWarRule                     = CommonProto.WarRule.IWarRule;
    import IDataForPlayerRule           = CommonProto.WarRule.IDataForPlayerRule;

    export type OpenData = {
        mapRawData  : CommonProto.Map.IMapRawData;
    };
    export class MmWarRulePanel extends TwnsUiPanel.UiPanel<OpenData> {
        private readonly _labelMenuTitle!       : TwnsUiLabel.UiLabel;
        private readonly _listWarRule!          : TwnsUiScrollList.UiScrollList<DataForWarRuleNameRenderer>;
        private readonly _btnBack!              : TwnsUiButton.UiButton;

        private readonly _btnSetAvailability!   : TwnsUiButton.UiButton;
        private readonly _btnSubmitRule!        : TwnsUiButton.UiButton;
        private readonly _btnDeleteRule!        : TwnsUiButton.UiButton;

        private readonly _btnModifyRuleName!    : TwnsUiButton.UiButton;
        private readonly _labelRuleName!        : TwnsUiLabel.UiLabel;

        private readonly _btnModifyHasFog!      : TwnsUiButton.UiButton;
        private readonly _imgHasFog!            : TwnsUiImage.UiImage;
        private readonly _btnHelpHasFog!        : TwnsUiButton.UiButton;

        private readonly _btnModifyWeather!     : TwnsUiButton.UiButton;
        private readonly _labelWeather!         : TwnsUiLabel.UiLabel;

        private readonly _labelAvailability!    : TwnsUiLabel.UiLabel;
        private readonly _btnAvailabilityMcw!   : TwnsUiButton.UiButton;
        private readonly _imgAvailabilityMcw!   : TwnsUiImage.UiImage;
        private readonly _btnAvailabilityScw!   : TwnsUiButton.UiButton;
        private readonly _imgAvailabilityScw!   : TwnsUiImage.UiImage;
        private readonly _btnAvailabilityMrw!   : TwnsUiButton.UiButton;
        private readonly _imgAvailabilityMrw!   : TwnsUiImage.UiImage;
        private readonly _btnAvailabilityCcw!   : TwnsUiButton.UiButton;
        private readonly _imgAvailabilityCcw!   : TwnsUiImage.UiImage;
        private readonly _btnAvailabilitySrw!   : TwnsUiButton.UiButton;
        private readonly _imgAvailabilitySrw!   : TwnsUiImage.UiImage;

        private readonly _labelWarEventListTitle!   : TwnsUiLabel.UiLabel;
        private readonly _btnAddWarEvent!           : TwnsUiButton.UiButton;
        private readonly _listWarEvent!             : TwnsUiScrollList.UiScrollList<DataForWarEventRenderer>;

        private readonly _labelPlayerList!      : TwnsUiLabel.UiLabel;
        private readonly _listPlayer!           : TwnsUiScrollList.UiScrollList<DataForPlayerRenderer>;

        private _dataForListWarRule : DataForWarRuleNameRenderer[] = [];
        private _selectedIndex      : number | null = null;
        private _selectedRule       : IWarRule | null = null;

        protected _onOpening(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,             callback: this._onNotifyLanguageChanged },
                { type: NotifyType.MsgMmAddWarRule,             callback: this._onNotifyMsgMmAddWarRule },
                { type: NotifyType.MsgMmDeleteWarRule,          callback: this._onNotifyMsgMmDeleteWarRule },
                { type: NotifyType.MsgMmSetWarRuleAvailability, callback: this._onNotifyMsgMmSetWarRuleAvailability },
            ]);
            this._setUiListenerArray([
                { ui: this._btnBack,                callback: this._onTouchedBtnBack },
                { ui: this._btnSetAvailability,     callback: this._onTouchedBtnSetAvailability },
                { ui: this._btnSubmitRule,          callback: this._onTouchedBtnSubmitRule },
                { ui: this._btnDeleteRule,          callback: this._onTouchedBtnDeleteRule },
                { ui: this._btnHelpHasFog,          callback: this._onTouchedBtnHelpHasFog },
                { ui: this._btnModifyHasFog,        callback: this._onTouchedBtnModifyHasFog },
                { ui: this._btnModifyWeather,       callback: this._onTouchedBtnModifyWeather },
                { ui: this._btnModifyRuleName,      callback: this._onTouchedBtnModifyRuleName },
                { ui: this._btnAvailabilityMcw,     callback: this._onTouchedBtnAvailabilityMcw },
                { ui: this._btnAvailabilityScw,     callback: this._onTouchedBtnAvailabilityScw },
                { ui: this._btnAvailabilityMrw,     callback: this._onTouchedBtnAvailabilityMrw },
                { ui: this._btnAvailabilityCcw,     callback: this._onTouchedBtnAvailabilityCcw },
                { ui: this._btnAvailabilitySrw,     callback: this._onTouchedBtnAvailabilitySrw },
                { ui: this._btnAddWarEvent,         callback: this._onTouchedBtnAddWarEvent },
            ]);
            this._setIsTouchMaskEnabled();

            this._listWarRule.setItemRenderer(WarRuleNameRenderer);
            this._listWarEvent.setItemRenderer(WarEventRenderer);
            this._listPlayer.setItemRenderer(PlayerRenderer);
        }
        protected async _updateOnOpenDataChanged(): Promise<void> {
            this._updateComponentsForLanguage();

            this._resetView();
        }
        protected _onClosing(): void {
            // nothing to do
        }

        public setSelectedIndex(newIndex: number): void {
            const dataList = this._dataForListWarRule;
            if (!dataList[newIndex]) {
                this._selectedIndex = null;
                this._selectedRule  = null;
                this._updateComponentsForRule();

            } else {
                const oldIndex      = this.getSelectedIndex();
                this._selectedIndex = newIndex;
                this._selectedRule  = Helpers.deepClone(dataList[newIndex].rule);
                if ((oldIndex != null) && (dataList[oldIndex])) {
                    this._listWarRule.updateSingleData(oldIndex, dataList[oldIndex]);
                }
                (oldIndex !== newIndex) && (this._listWarRule.updateSingleData(newIndex, dataList[newIndex]));

                this._updateComponentsForRule();
            }
        }
        public getSelectedIndex(): number | null {
            return this._selectedIndex;
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Callbacks.
        ////////////////////////////////////////////////////////////////////////////////
        private _onNotifyLanguageChanged(): void {
            this._updateComponentsForLanguage();
        }

        private _onNotifyMsgMmAddWarRule(): void {
            FloatText.show(Lang.getText(LangTextType.A0283));
            this._resetView();
        }

        private _onNotifyMsgMmDeleteWarRule(): void {
            FloatText.show(Lang.getText(LangTextType.A0293));
            this._resetView();
        }

        private _onNotifyMsgMmSetWarRuleAvailability(): void {
            FloatText.show(Lang.getText(LangTextType.A0287));
            this._resetView();
        }

        private _onTouchedBtnBack(): void {
            this.close();
        }

        private _onTouchedBtnSetAvailability(): void {
            const ruleId = this._selectedRule?.ruleId;
            if (ruleId != null) {
                TwnsPanelManager.open(TwnsPanelConfig.Dict.MmSetWarRuleAvailabilityPanel, {
                    mapId   : Helpers.getExisted(this._getOpenData().mapRawData.mapId),
                    ruleId,
                });
            }
        }

        private _onTouchedBtnSubmitRule(): void {
            const rule = this._selectedRule;
            if (rule) {
                TwnsPanelManager.open(TwnsPanelConfig.Dict.CommonConfirmPanel, {
                    content     : Lang.getText(LangTextType.A0282),
                    callback    : () => {
                        WarMapProxy.reqMmAddWarRule(Helpers.getExisted(this._getOpenData().mapRawData.mapId), rule);
                    },
                });
            }
        }

        private _onTouchedBtnDeleteRule(): void {
            const ruleId = this._selectedRule?.ruleId;
            if (ruleId != null) {
                const mapRawData = this._getOpenData().mapRawData;
                if ((mapRawData.warRuleArray ?? []).length <= 1) {
                    FloatText.show(Lang.getText(LangTextType.A0291));
                    return;
                }

                TwnsPanelManager.open(TwnsPanelConfig.Dict.CommonConfirmPanel, {
                    content : Lang.getText(LangTextType.A0292),
                    callback: () => {
                        WarMapProxy.reqMmDeleteWarRule(Helpers.getExisted(mapRawData.mapId), ruleId);
                    }
                });
            }
        }

        private _onTouchedBtnHelpHasFog(): void {
            TwnsPanelManager.open(TwnsPanelConfig.Dict.CommonHelpPanel, {
                title  : Lang.getText(LangTextType.B0020),
                content: Lang.getText(LangTextType.R0002),
            });
        }

        private _onTouchedBtnModifyHasFog(): void {
            const rule = this._selectedRule;
            if (rule) {
                WarRuleHelpers.setHasFogByDefault(rule, !WarRuleHelpers.getHasFogByDefault(rule));
                this._updateImgHasFog(rule);
            }
        }

        private _onTouchedBtnModifyWeather(): void {
            const rule  = this._selectedRule;
            if (rule) {
                WarRuleHelpers.tickDefaultWeatherType(rule, Helpers.getExisted(ConfigManager.getLatestConfigVersion()));
                this._updateLabelWeather(rule);
            }
        }

        private _onTouchedBtnModifyRuleName(): void {
            const rule = this._selectedRule;
            if (rule) {
                TwnsPanelManager.open(TwnsPanelConfig.Dict.CommonModifyWarRuleNamePanel, {
                    rule,
                    callback: () => {
                        this._updateLabelRuleName(rule);
                    },
                });
            }
        }

        private _onTouchedBtnAvailabilityMcw(): void {
            const rule = this._selectedRule;
            if (rule) {
                const ruleAvailability  = Helpers.getExisted(rule.ruleAvailability);
                ruleAvailability.canMcw = !ruleAvailability.canMcw;
                this._updateImgAvailabilityMcw(rule);
            }
        }

        private _onTouchedBtnAvailabilityScw(): void {
            const rule = this._selectedRule;
            if (rule) {
                const ruleAvailability  = Helpers.getExisted(rule.ruleAvailability);
                ruleAvailability.canScw = !ruleAvailability.canScw;
                this._updateImgAvailabilityScw(rule);
            }
        }

        private _onTouchedBtnAvailabilityMrw(): void {
            const rule = this._selectedRule;
            if (rule) {
                const ruleAvailability  = Helpers.getExisted(rule.ruleAvailability);
                ruleAvailability.canMrw = !ruleAvailability.canMrw;
                this._updateImgAvailabilityMrw(rule);
            }
        }

        private _onTouchedBtnAvailabilityCcw(): void {
            const rule = this._selectedRule;
            if (rule) {
                const ruleAvailability  = Helpers.getExisted(rule.ruleAvailability);
                const canCcw            = !ruleAvailability.canCcw;
                ruleAvailability.canCcw = canCcw;
                this._updateImgAvailabilityCcw(rule);

                if (!canCcw) {
                    for (const playerRule of rule.ruleForPlayers?.playerRuleDataArray || []) {
                        playerRule.fixedCoIdInCcw = null;
                        this._updateListPlayerRule(rule);
                    }
                }
            }
        }

        private _onTouchedBtnAvailabilitySrw(): void {
            const rule = this._selectedRule;
            if (rule) {
                const ruleAvailability  = Helpers.getExisted(rule.ruleAvailability);
                ruleAvailability.canSrw = !ruleAvailability.canSrw;
                this._updateImgAvailabilitySrw(rule);
            }
        }

        private _onTouchedBtnAddWarEvent(): void {
            const warRule = this._selectedRule;
            if (warRule) {
                TwnsPanelManager.open(TwnsPanelConfig.Dict.MeAddWarEventToRulePanel, {
                    warRule,
                    warEventArray   : this._getOpenData().mapRawData.warEventFullData?.eventArray ?? [],
                });
            }
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Private functions.
        ////////////////////////////////////////////////////////////////////////////////
        private _resetView(): void {
            this._dataForListWarRule = this._createDataForListWarRule();
            this._listWarRule.bindData(this._dataForListWarRule);
            this.setSelectedIndex(0);
        }

        private _updateComponentsForLanguage(): void {
            this._btnSetAvailability.label      = Lang.getText(LangTextType.B0843);
            this._btnSubmitRule.label           = Lang.getText(LangTextType.B0824);
            this._btnDeleteRule.label           = Lang.getText(LangTextType.B0220);
            this._labelMenuTitle.text           = Lang.getText(LangTextType.B0314);
            this._labelAvailability.text        = Lang.getText(LangTextType.B0406);
            this._labelPlayerList.text          = Lang.getText(LangTextType.B0407);
            this._btnAvailabilityMcw.label      = Lang.getText(LangTextType.B0137);
            this._btnAvailabilityScw.label      = Lang.getText(LangTextType.B0138);
            this._btnAvailabilityMrw.label      = Lang.getText(LangTextType.B0404);
            this._btnAvailabilityCcw.label      = Lang.getText(LangTextType.B0619);
            this._btnAvailabilitySrw.label      = Lang.getText(LangTextType.B0614);
            this._btnBack.label                 = Lang.getText(LangTextType.B0146);
            this._btnModifyRuleName.label       = Lang.getText(LangTextType.B0315);
            this._btnModifyHasFog.label         = Lang.getText(LangTextType.B0020);
            this._labelWarEventListTitle.text   = Lang.getText(LangTextType.B0461);
            this._btnAddWarEvent.label          = Lang.getText(LangTextType.B0320);
            this._btnModifyWeather.label        = Lang.getText(LangTextType.B0705);
        }

        private _createDataForListWarRule(): DataForWarRuleNameRenderer[] {
            const data  : DataForWarRuleNameRenderer[] = [];
            let index   = 0;
            for (const rule of this._getOpenData().mapRawData.warRuleArray || []) {
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
            this._updateLabelWeather(rule);
            this._updateImgHasFog(rule);
            this._updateImgAvailabilityMcw(rule);
            this._updateImgAvailabilityScw(rule);
            this._updateImgAvailabilityMrw(rule);
            this._updateImgAvailabilityCcw(rule);
            this._updateImgAvailabilitySrw(rule);
            this._updateListWarEvent(rule);
            this._updateListPlayerRule(rule);
        }

        private _updateLabelRuleName(rule: IWarRule | null): void {
            this._labelRuleName.text = Lang.concatLanguageTextList(rule?.ruleNameArray) || Lang.getText(LangTextType.B0001);
        }
        private _updateLabelWeather(rule: IWarRule | null): void {
            this._labelWeather.text = Lang.getWeatherName(rule ? WarRuleHelpers.getDefaultWeatherType(rule) : Types.WeatherType.Clear);
        }
        private _updateImgHasFog(rule: IWarRule | null): void {
            this._imgHasFog.visible = rule ? !!rule.ruleForGlobalParams?.hasFogByDefault : false;
        }
        private _updateImgAvailabilityMcw(rule: IWarRule | null): void {
            this._imgAvailabilityMcw.visible = rule ? !!rule.ruleAvailability?.canMcw : false;
        }
        private _updateImgAvailabilityScw(rule: IWarRule | null): void {
            this._imgAvailabilityScw.visible = rule ? !!rule.ruleAvailability?.canScw : false;
        }
        private _updateImgAvailabilityMrw(rule: IWarRule | null): void {
            this._imgAvailabilityMrw.visible = rule ? !!rule.ruleAvailability?.canMrw : false;
        }
        private _updateImgAvailabilityCcw(rule: IWarRule | null): void {
            this._imgAvailabilityCcw.visible = !!rule?.ruleAvailability?.canCcw;
        }
        private _updateImgAvailabilitySrw(rule: IWarRule | null): void {
            this._imgAvailabilitySrw.visible = !!rule?.ruleAvailability?.canSrw;
        }
        private _updateListWarEvent(warRule: IWarRule | null): void {
            const list = this._listWarEvent;
            if (warRule == null) {
                list.clear();
                return;
            }

            const dataArray         : DataForWarEventRenderer[] = [];
            const warEventFullData  = this._getOpenData().mapRawData.warEventFullData;
            for (const warEventId of warRule.warEventIdArray || []) {
                dataArray.push({
                    panel               : this,
                    warEventFullData,
                    warEventId,
                    warRule,
                });
            }
            list.bindData(dataArray);
        }
        public _updateListPlayerRule(rule: IWarRule | null): void {
            const listPlayer = this._listPlayer;
            if (rule == null) {
                listPlayer.clear();
                return;
            }

            const playerRuleDataList = rule.ruleForPlayers?.playerRuleDataArray;
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
                        isReviewing : false,
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
        panel   : MmWarRulePanel;
    };
    class WarRuleNameRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForWarRuleNameRenderer> {
        private readonly _btnChoose!    : TwnsUiButton.UiButton;
        private readonly _labelName!    : TwnsUiLabel.UiLabel;

        protected _onOpened(): void {
            this._setUiListenerArray([
                { ui: this._btnChoose,  callback: this._onTouchTapBtnChoose },
            ]);
        }

        protected _onDataChanged(): void {
            const data              = this._getData();
            const index             = data.index;
            this.currentState       = index === data.panel.getSelectedIndex() ? Types.UiState.Down : Types.UiState.Up;
            this._labelName.text    = `${Lang.getText(LangTextType.B0318)} ${index}`;
        }

        private _onTouchTapBtnChoose(): void {
            const data = this._getData();
            data.panel.setSelectedIndex(data.index);
        }
    }

    type DataForPlayerRenderer = {
        index       : number;
        warRule     : IWarRule;
        playerRule  : IDataForPlayerRule;
        isReviewing : boolean;
        panel       : MmWarRulePanel;
    };

    class PlayerRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForPlayerRenderer> {
        private readonly _listInfo! : TwnsUiScrollList.UiScrollList<DataForInfoRenderer>;

        protected _onOpened(): void {
            this._listInfo.setItemRenderer(InfoRenderer);
        }

        protected _onDataChanged(): void {
            this._updateView();
        }

        private _updateView(): void {
            this._listInfo.bindData(this._createDataForListInfo());
        }

        private _createDataForListInfo(): DataForInfoRenderer[] {
            const data          = this._getData();
            const warRule       = data.warRule;
            const playerRule    = data.playerRule;
            const isReviewing   = data.isReviewing;
            return [
                this._createDataPlayerIndex(warRule, playerRule, isReviewing),
                this._createDataTeamIndex(warRule, playerRule, isReviewing),
                this._createDataBannedCoIdArray(warRule, playerRule, isReviewing),
                this._createDataInitialFund(warRule, playerRule, isReviewing),
                this._createDataIncomeMultiplier(warRule, playerRule, isReviewing),
                this._createDataEnergyAddPctOnLoadCo(warRule, playerRule, isReviewing),
                this._createDataEnergyGrowthMultiplier(warRule, playerRule, isReviewing),
                this._createDataMoveRangeModifier(warRule, playerRule, isReviewing),
                this._createDataAttackPowerModifier(warRule, playerRule, isReviewing),
                this._createDataVisionRangeModifier(warRule, playerRule, isReviewing),
                this._createDataLuckLowerLimit(warRule, playerRule, isReviewing),
                this._createDataLuckUpperLimit(warRule, playerRule, isReviewing),
                this._createDataIsControlledByAiInCcw(warRule, playerRule, isReviewing),
                this._createDataAiCoIdInCcw(warRule, playerRule, isReviewing),
                this._createDataIsControlledByAiInSrw(warRule, playerRule, isReviewing),
                this._createDataAiCoIdInSrw(warRule, playerRule, isReviewing),
            ];
        }
        private _createDataPlayerIndex(warRule: IWarRule, playerRule: IDataForPlayerRule, isReviewing: boolean): DataForInfoRenderer {
            return {
                titleText               : Lang.getText(LangTextType.B0018),
                infoText                : Lang.getPlayerForceName(Helpers.getExisted(playerRule.playerIndex)),
                infoColor               : 0xFFFFFF,
                callbackOnTouchedTitle  : null,
            };
        }
        private _createDataTeamIndex(warRule: IWarRule, playerRule: IDataForPlayerRule, isReviewing: boolean): DataForInfoRenderer {
            return {
                titleText               : Lang.getText(LangTextType.B0019),
                infoText                : Lang.getPlayerTeamName(Helpers.getExisted(playerRule.teamIndex)) ?? CommonConstants.ErrorTextForUndefined,
                infoColor               : 0xFFFFFF,
                callbackOnTouchedTitle  : isReviewing
                    ? null
                    : () => {
                        WarRuleHelpers.tickTeamIndex(warRule, Helpers.getExisted(playerRule.playerIndex));
                        this._updateView();
                    },
            };
        }
        private _createDataBannedCoIdArray(warRule: IWarRule, playerRule: IDataForPlayerRule, isReviewing: boolean): DataForInfoRenderer {
            const bannedCoIdArray   = playerRule.bannedCoIdArray ?? [];
            const configVersion     = Helpers.getExisted(ConfigManager.getLatestConfigVersion());
            return {
                titleText               : Lang.getText(LangTextType.B0403),
                infoText                : `${bannedCoIdArray.length}`,
                infoColor               : 0xFFFFFF,
                callbackOnTouchedTitle  : () => {
                    TwnsPanelManager.open(TwnsPanelConfig.Dict.CommonBanCoPanel, {
                        gameConfig: configVersion,
                        playerIndex         : Helpers.getExisted(playerRule.playerIndex),
                        bannedCoIdArray,
                        fullCoIdArray       : ConfigManager.getEnabledCoArray(configVersion).map(v => v.coId),
                        maxBanCount         : null,
                        selfCoId            : null,
                        callbackOnConfirm   : bannedCoIdSet => {
                            if (!isReviewing) {
                                playerRule.bannedCoIdArray = [...bannedCoIdSet];
                                this._updateView();
                            }
                            TwnsPanelManager.close(TwnsPanelConfig.Dict.CommonBanCoPanel);
                        },
                    });
                },
            };
        }
        private _createDataInitialFund(warRule: IWarRule, playerRule: IDataForPlayerRule, isReviewing: boolean): DataForInfoRenderer {
            const currValue = Helpers.getExisted(playerRule.initialFund);
            return {
                titleText               : Lang.getText(LangTextType.B0178),
                infoText                : `${currValue}`,
                infoColor               : getTextColor(currValue, CommonConstants.WarRuleInitialFundDefault),
                callbackOnTouchedTitle  : isReviewing
                    ? null
                    : () => {
                        const maxValue  = CommonConstants.WarRuleInitialFundMaxLimit;
                        const minValue  = CommonConstants.WarRuleInitialFundMinLimit;
                        TwnsPanelManager.open(TwnsPanelConfig.Dict.CommonInputIntegerPanel, {
                            title           : Lang.getText(LangTextType.B0178),
                            currentValue    : currValue,
                            minValue,
                            maxValue,
                            tips            : `${Lang.getText(LangTextType.B0319)}: [${minValue}, ${maxValue}]`,
                            callback        : panel => {
                                WarRuleHelpers.setInitialFund(warRule, Helpers.getExisted(playerRule.playerIndex), panel.getInputValue());
                                this._updateView();
                            },
                        });
                    },
            };
        }
        private _createDataIncomeMultiplier(warRule: IWarRule, playerRule: IDataForPlayerRule, isReviewing: boolean): DataForInfoRenderer {
            const currValue = Helpers.getExisted(playerRule.incomeMultiplier);
            return {
                titleText               : Lang.getText(LangTextType.B0179),
                infoText                : `${currValue}%`,
                infoColor               : getTextColor(currValue, CommonConstants.WarRuleIncomeMultiplierDefault),
                callbackOnTouchedTitle  : isReviewing
                    ? null
                    : () => {
                        const maxValue  = CommonConstants.WarRuleIncomeMultiplierMaxLimit;
                        const minValue  = CommonConstants.WarRuleIncomeMultiplierMinLimit;
                        TwnsPanelManager.open(TwnsPanelConfig.Dict.CommonInputIntegerPanel, {
                            title           : Lang.getText(LangTextType.B0179),
                            currentValue    : currValue,
                            minValue,
                            maxValue,
                            tips            : `${Lang.getText(LangTextType.B0319)}: [${minValue}, ${maxValue}]`,
                            callback        : panel => {
                                WarRuleHelpers.setIncomeMultiplier(warRule, Helpers.getExisted(playerRule.playerIndex), panel.getInputValue());
                                this._updateView();
                            },
                        });
                    },
            };
        }
        private _createDataEnergyAddPctOnLoadCo(warRule: IWarRule, playerRule: IDataForPlayerRule, isReviewing: boolean): DataForInfoRenderer {
            const currValue = Helpers.getExisted(playerRule.energyAddPctOnLoadCo);
            return {
                titleText               : Lang.getText(LangTextType.B0180),
                infoText                : `${currValue}%`,
                infoColor               : getTextColor(currValue, CommonConstants.WarRuleEnergyAddPctOnLoadCoDefault),
                callbackOnTouchedTitle  : isReviewing
                    ? null
                    : () => {
                        const minValue      = CommonConstants.WarRuleEnergyAddPctOnLoadCoMinLimit;
                        const maxValue      = CommonConstants.WarRuleEnergyAddPctOnLoadCoMaxLimit;
                        TwnsPanelManager.open(TwnsPanelConfig.Dict.CommonInputIntegerPanel, {
                            title           : Lang.getText(LangTextType.B0180),
                            currentValue    : currValue,
                            minValue,
                            maxValue,
                            tips            : `${Lang.getText(LangTextType.B0319)}: [${minValue}, ${maxValue}]`,
                            callback        : panel => {
                                WarRuleHelpers.setEnergyAddPctOnLoadCo(warRule, Helpers.getExisted(playerRule.playerIndex), panel.getInputValue());
                                this._updateView();
                            },
                        });
                    },
            };
        }
        private _createDataEnergyGrowthMultiplier(warRule: IWarRule, playerRule: IDataForPlayerRule, isReviewing: boolean): DataForInfoRenderer {
            const currValue = Helpers.getExisted(playerRule.energyGrowthMultiplier);
            return {
                titleText               : Lang.getText(LangTextType.B0181),
                infoText                : `${currValue}%`,
                infoColor               : getTextColor(currValue, CommonConstants.WarRuleEnergyGrowthMultiplierDefault),
                callbackOnTouchedTitle  : isReviewing
                    ? null
                    : () => {
                        const minValue      = CommonConstants.WarRuleEnergyGrowthMultiplierMinLimit;
                        const maxValue      = CommonConstants.WarRuleEnergyGrowthMultiplierMaxLimit;
                        TwnsPanelManager.open(TwnsPanelConfig.Dict.CommonInputIntegerPanel, {
                            title           : Lang.getText(LangTextType.B0181),
                            currentValue    : currValue,
                            minValue,
                            maxValue,
                            tips            : `${Lang.getText(LangTextType.B0319)}: [${minValue}, ${maxValue}]`,
                            callback        : panel => {
                                WarRuleHelpers.setEnergyGrowthMultiplier(warRule, Helpers.getExisted(playerRule.playerIndex), panel.getInputValue());
                                this._updateView();
                            },
                        });
                    },
            };
        }
        private _createDataMoveRangeModifier(warRule: IWarRule, playerRule: IDataForPlayerRule, isReviewing: boolean): DataForInfoRenderer {
            const currValue = Helpers.getExisted(playerRule.moveRangeModifier);
            return {
                titleText               : Lang.getText(LangTextType.B0182),
                infoText                : `${currValue}`,
                infoColor               : getTextColor(currValue, CommonConstants.WarRuleMoveRangeModifierDefault),
                callbackOnTouchedTitle  : isReviewing
                    ? null
                    : () => {
                        const minValue      = CommonConstants.WarRuleMoveRangeModifierMinLimit;
                        const maxValue      = CommonConstants.WarRuleMoveRangeModifierMaxLimit;
                        TwnsPanelManager.open(TwnsPanelConfig.Dict.CommonInputIntegerPanel, {
                            title           : Lang.getText(LangTextType.B0182),
                            currentValue    : currValue,
                            minValue,
                            maxValue,
                            tips            : `${Lang.getText(LangTextType.B0319)}: [${minValue}, ${maxValue}]`,
                            callback        : panel => {
                                WarRuleHelpers.setMoveRangeModifier(warRule, Helpers.getExisted(playerRule.playerIndex), panel.getInputValue());
                                this._updateView();
                            },
                        });
                    },
            };
        }
        private _createDataAttackPowerModifier(warRule: IWarRule, playerRule: IDataForPlayerRule, isReviewing: boolean): DataForInfoRenderer {
            const currValue = Helpers.getExisted(playerRule.attackPowerModifier);
            return {
                titleText               : Lang.getText(LangTextType.B0183),
                infoText                : `${currValue}%`,
                infoColor               : getTextColor(currValue, CommonConstants.WarRuleOffenseBonusDefault),
                callbackOnTouchedTitle  : isReviewing
                    ? null
                    : () => {
                        const minValue      = CommonConstants.WarRuleOffenseBonusMinLimit;
                        const maxValue      = CommonConstants.WarRuleOffenseBonusMaxLimit;
                        TwnsPanelManager.open(TwnsPanelConfig.Dict.CommonInputIntegerPanel, {
                            title           : Lang.getText(LangTextType.B0183),
                            currentValue    : currValue,
                            minValue,
                            maxValue,
                            tips            : `${Lang.getText(LangTextType.B0319)}: [${minValue}, ${maxValue}]`,
                            callback        : panel => {
                                WarRuleHelpers.setAttackPowerModifier(warRule, Helpers.getExisted(playerRule.playerIndex), panel.getInputValue());
                                this._updateView();
                            },
                        });
                    },
            };
        }
        private _createDataVisionRangeModifier(warRule: IWarRule, playerRule: IDataForPlayerRule, isReviewing: boolean): DataForInfoRenderer {
            const currValue = Helpers.getExisted(playerRule.visionRangeModifier);
            return {
                titleText               : Lang.getText(LangTextType.B0184),
                infoText                : `${currValue}`,
                infoColor               : getTextColor(currValue, CommonConstants.WarRuleVisionRangeModifierDefault),
                callbackOnTouchedTitle  : isReviewing
                    ? null
                    : () => {
                        const minValue      = CommonConstants.WarRuleVisionRangeModifierMinLimit;
                        const maxValue      = CommonConstants.WarRuleVisionRangeModifierMaxLimit;
                        TwnsPanelManager.open(TwnsPanelConfig.Dict.CommonInputIntegerPanel, {
                            title           : Lang.getText(LangTextType.B0184),
                            currentValue    : currValue,
                            minValue,
                            maxValue,
                            tips            : `${Lang.getText(LangTextType.B0319)}: [${minValue}, ${maxValue}]`,
                            callback        : panel => {
                                WarRuleHelpers.setVisionRangeModifier(warRule, Helpers.getExisted(playerRule.playerIndex), panel.getInputValue());
                                this._updateView();
                            },
                        });
                    },
            };
        }
        private _createDataLuckLowerLimit(warRule: IWarRule, playerRule: IDataForPlayerRule, isReviewing: boolean): DataForInfoRenderer {
            const currValue     = Helpers.getExisted(playerRule.luckLowerLimit);
            const playerIndex   = Helpers.getExisted(playerRule.playerIndex);
            return {
                titleText               : Lang.getText(LangTextType.B0189),
                infoText                : `${currValue}%`,
                infoColor               : getTextColor(currValue, CommonConstants.WarRuleLuckDefaultLowerLimit),
                callbackOnTouchedTitle  : isReviewing
                    ? null
                    : () => {
                        const minValue      = CommonConstants.WarRuleLuckMinLimit;
                        const maxValue      = CommonConstants.WarRuleLuckMaxLimit;
                        TwnsPanelManager.open(TwnsPanelConfig.Dict.CommonInputIntegerPanel, {
                            title           : Lang.getText(LangTextType.B0189),
                            currentValue    : currValue,
                            minValue,
                            maxValue,
                            tips            : `${Lang.getText(LangTextType.B0319)}: [${minValue}, ${maxValue}]`,
                            callback        : panel => {
                                const value         = panel.getInputValue();
                                const upperLimit    = WarRuleHelpers.getLuckUpperLimit(warRule, playerIndex);
                                if (value <= upperLimit) {
                                    WarRuleHelpers.setLuckLowerLimit(warRule, playerIndex, value);
                                } else {
                                    WarRuleHelpers.setLuckUpperLimit(warRule, playerIndex, value);
                                    WarRuleHelpers.setLuckLowerLimit(warRule, playerIndex, upperLimit);
                                }
                                this._updateView();
                            },
                        });
                    },
            };
        }
        private _createDataLuckUpperLimit(warRule: IWarRule, playerRule: IDataForPlayerRule, isReviewing: boolean): DataForInfoRenderer {
            const currValue     = Helpers.getExisted(playerRule.luckUpperLimit);
            const playerIndex   = Helpers.getExisted(playerRule.playerIndex);
            return {
                titleText               : Lang.getText(LangTextType.B0190),
                infoText                : `${currValue}%`,
                infoColor               : getTextColor(currValue, CommonConstants.WarRuleLuckDefaultUpperLimit),
                callbackOnTouchedTitle  : isReviewing
                    ? null
                    : () => {
                        const minValue      = CommonConstants.WarRuleLuckMinLimit;
                        const maxValue      = CommonConstants.WarRuleLuckMaxLimit;
                        TwnsPanelManager.open(TwnsPanelConfig.Dict.CommonInputIntegerPanel, {
                            title           : Lang.getText(LangTextType.B0190),
                            currentValue    : currValue,
                            minValue,
                            maxValue,
                            tips            : `${Lang.getText(LangTextType.B0319)}: [${minValue}, ${maxValue}]`,
                            callback        : panel => {
                                const value         = panel.getInputValue();
                                const lowerLimit    = WarRuleHelpers.getLuckLowerLimit(warRule, playerIndex);
                                if (value >= lowerLimit) {
                                    WarRuleHelpers.setLuckUpperLimit(warRule, playerIndex, value);
                                } else {
                                    WarRuleHelpers.setLuckLowerLimit(warRule, playerIndex, value);
                                    WarRuleHelpers.setLuckUpperLimit(warRule, playerIndex, lowerLimit);
                                }
                                this._updateView();
                            },
                        });
                    },
            };
        }
        private _createDataIsControlledByAiInCcw(warRule: IWarRule, playerRule: IDataForPlayerRule, isReviewing: boolean): DataForInfoRenderer {
            const isControlledByAi = playerRule.fixedCoIdInCcw != null;
            return {
                titleText               : Lang.getText(LangTextType.B0645),
                infoText                : Lang.getText(isControlledByAi ? LangTextType.B0012 : LangTextType.B0013),
                infoColor               : isControlledByAi ? 0x00FF00 : 0xFFFFFF,
                callbackOnTouchedTitle  : isReviewing
                    ? null
                    : () => {
                        if (!warRule.ruleAvailability?.canCcw) {
                            FloatText.show(Lang.getText(LangTextType.A0221));
                            return;
                        }

                        const playerIndex = Helpers.getExisted(playerRule.playerIndex);
                        if (isControlledByAi) {
                            WarRuleHelpers.setFixedCoIdInCcw(warRule, playerIndex, null);
                        } else {
                            WarRuleHelpers.setFixedCoIdInCcw(warRule, playerIndex, CommonConstants.CoEmptyId);
                        }
                        this._updateView();
                    },
            };
        }
        private _createDataAiCoIdInCcw(warRule: IWarRule, playerRule: IDataForPlayerRule, isReviewing: boolean): DataForInfoRenderer {
            const coId          = playerRule.fixedCoIdInCcw;
            const configVersion = Helpers.getExisted(ConfigManager.getLatestConfigVersion());
            return {
                titleText               : Lang.getText(LangTextType.B0644),
                infoText                : coId == null ? `--` : ConfigManager.getCoNameAndTierText(configVersion, coId),
                infoColor               : coId == null ? 0xFFFFFF : 0x00FF00,
                callbackOnTouchedTitle  : isReviewing
                    ? null
                    : () => {
                        if (!warRule.ruleAvailability?.canCcw) {
                            FloatText.show(Lang.getText(LangTextType.A0221));
                            return;
                        }

                        const coIdArray: number[] = [];
                        for (const cfg of ConfigManager.getEnabledCoArray(configVersion)) {
                            coIdArray.push(cfg.coId);
                        }
                        TwnsPanelManager.open(TwnsPanelConfig.Dict.CommonChooseCoPanel, {
                            currentCoId         : playerRule.fixedCoIdInCcw ?? null,
                            availableCoIdArray  : coIdArray,
                            callbackOnConfirm   : (newCoId: number) => {
                                WarRuleHelpers.setFixedCoIdInCcw(warRule, Helpers.getExisted(playerRule.playerIndex), newCoId);
                                this._updateView();
                            },
                        });
                    },
            };
        }
        private _createDataIsControlledByAiInSrw(warRule: IWarRule, playerRule: IDataForPlayerRule, isReviewing: boolean): DataForInfoRenderer {
            const isControlledByAi = playerRule.fixedCoIdInSrw != null;
            return {
                titleText               : Lang.getText(LangTextType.B0816),
                infoText                : Lang.getText(isControlledByAi ? LangTextType.B0012 : LangTextType.B0013),
                infoColor               : isControlledByAi ? 0x00FF00 : 0xFFFFFF,
                callbackOnTouchedTitle  : isReviewing
                    ? null
                    : () => {
                        if (!warRule.ruleAvailability?.canSrw) {
                            FloatText.show(Lang.getText(LangTextType.A0276));
                            return;
                        }

                        const playerIndex = Helpers.getExisted(playerRule.playerIndex);
                        if (isControlledByAi) {
                            WarRuleHelpers.setFixedCoIdInSrw(warRule, playerIndex, null);
                        } else {
                            WarRuleHelpers.setFixedCoIdInSrw(warRule, playerIndex, CommonConstants.CoEmptyId);
                        }
                        this._updateView();
                    },
            };
        }
        private _createDataAiCoIdInSrw(warRule: IWarRule, playerRule: IDataForPlayerRule, isReviewing: boolean): DataForInfoRenderer {
            const coId          = playerRule.fixedCoIdInSrw;
            const configVersion = Helpers.getExisted(ConfigManager.getLatestConfigVersion());
            return {
                titleText               : Lang.getText(LangTextType.B0815),
                infoText                : coId == null ? `--` : ConfigManager.getCoNameAndTierText(configVersion, coId),
                infoColor               : coId == null ? 0xFFFFFF : 0x00FF00,
                callbackOnTouchedTitle  : isReviewing
                    ? null
                    : () => {
                        if (!warRule.ruleAvailability?.canSrw) {
                            FloatText.show(Lang.getText(LangTextType.A0276));
                            return;
                        }

                        const coIdArray: number[] = [];
                        for (const cfg of ConfigManager.getEnabledCoArray(configVersion)) {
                            coIdArray.push(cfg.coId);
                        }
                        TwnsPanelManager.open(TwnsPanelConfig.Dict.CommonChooseCoPanel, {
                            currentCoId         : playerRule.fixedCoIdInSrw ?? null,
                            availableCoIdArray  : coIdArray,
                            callbackOnConfirm   : (newCoId: number) => {
                                WarRuleHelpers.setFixedCoIdInSrw(warRule, Helpers.getExisted(playerRule.playerIndex), newCoId);
                                this._updateView();
                            },
                        });
                    },
            };
        }
    }

    type DataForWarEventRenderer = {
        panel               : MmWarRulePanel;
        warEventFullData    : Types.Undefinable<CommonProto.Map.IWarEventFullData>;
        warEventId          : number;
        warRule             : IWarRule;
    };
    class WarEventRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForWarEventRenderer> {
        private readonly _labelWarEventIdTitle! : TwnsUiLabel.UiLabel;
        private readonly _labelWarEventId!      : TwnsUiLabel.UiLabel;
        private readonly _btnUp!                : TwnsUiButton.UiButton;
        private readonly _btnDown!              : TwnsUiButton.UiButton;
        private readonly _btnDelete!            : TwnsUiButton.UiButton;
        private readonly _labelWarEventName!    : TwnsUiLabel.UiLabel;

        protected _onOpened(): void {
            this._setUiListenerArray([
                { ui: this._btnUp,      callback: this._onTouchedBtnUp },
                { ui: this._btnDown,    callback: this._onTouchedBtnDown },
                { ui: this._btnDelete,  callback: this._onTouchedBtnDelete },
            ]);
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,    callback: this._onNotifyLanguageChanged },
            ]);

            this._updateComponentsForLanguage();
        }

        private _onTouchedBtnUp(): void {
            const data = this.data;
            if (data) {
                WarRuleHelpers.moveWarEventId(data.warRule, data.warEventId, -1);
                Notify.dispatch(NotifyType.MeWarEventIdArrayChanged);
            }
        }
        private _onTouchedBtnDown(): void {
            const data = this.data;
            if (data) {
                WarRuleHelpers.moveWarEventId(data.warRule, data.warEventId, 1);
                Notify.dispatch(NotifyType.MeWarEventIdArrayChanged);
            }
        }
        private _onTouchedBtnDelete(): void {
            const data = this.data;
            if (data) {
                WarRuleHelpers.deleteWarEventId(data.warRule, data.warEventId);
                Notify.dispatch(NotifyType.MeWarEventIdArrayChanged);
            }
        }
        private _onNotifyLanguageChanged(): void {
            this._updateComponentsForLanguage();
        }

        protected _onDataChanged(): void {
            const data                  = this._getData();
            this._labelWarEventId.text  = `${data.warEventId}`;
            this._updateLabelWarEventName();
        }

        private _updateComponentsForLanguage(): void {
            this._labelWarEventIdTitle.text = `${Lang.getText(LangTextType.B0462)}:`;
            this._btnUp.label               = Lang.getText(LangTextType.B0463);
            this._btnDown.label             = Lang.getText(LangTextType.B0464);
            this._btnDelete.label           = Lang.getText(LangTextType.B0220);
            this._updateLabelWarEventName();
        }
        private _updateLabelWarEventName(): void {
            const data                      = this._getData();
            this._labelWarEventName.text    = Lang.getLanguageText({ textArray: data.warEventFullData?.eventArray?.find(v => v.eventId === data.warEventId)?.eventNameArray }) ?? CommonConstants.ErrorTextForUndefined;
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
                { ui: this._btnTitle, callback: this._onTouchedBtnTitle },
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

// export default TwnsMmWarRulePanel;
