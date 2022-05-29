
// import TwnsCommonHelpPanel              from "../../common/view/CommonHelpPanel";
// import CommonConstants                  from "../../tools/helpers/CommonConstants";
// import Helpers                          from "../../tools/helpers/Helpers";
// import Types                            from "../../tools/helpers/Types";
// import Lang                             from "../../tools/lang/Lang";
// import TwnsLangTextType                 from "../../tools/lang/LangTextType";
// import Notify                   from "../../tools/notify/NotifyType";
// import ProtoTypes                       from "../../tools/proto/ProtoTypes";
// import TwnsUiButton                     from "../../tools/ui/UiButton";
// import TwnsUiImage                      from "../../tools/ui/UiImage";
// import TwnsUiLabel                      from "../../tools/ui/UiLabel";
// import TwnsUiListItemRenderer           from "../../tools/ui/UiListItemRenderer";
// import TwnsUiPanel                      from "../../tools/ui/UiPanel";
// import TwnsUiScrollList                 from "../../tools/ui/UiScrollList";
// import TwnsMmWarRuleAvailableCoPanel    from "./MmWarRuleAvailableCoPanel";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.MapManagement {
    import LangTextType                 = Lang.LangTextType;
    import NotifyType                   = Notify.NotifyType;
    import ITemplateWarRule             = CommonProto.WarRule.ITemplateWarRule;
    import IDataForPlayerRule           = CommonProto.WarRule.IDataForPlayerRule;

    export type OpenDataForMmWarRulePanel = {
        mapRawData  : CommonProto.Map.IMapRawData;
    };
    export class MmWarRulePanel extends TwnsUiPanel.UiPanel<OpenDataForMmWarRulePanel> {
        private readonly _labelMenuTitle!       : TwnsUiLabel.UiLabel;
        private readonly _listWarRule!          : TwnsUiScrollList.UiScrollList<DataForWarRuleNameRenderer>;
        private readonly _btnBack!              : TwnsUiButton.UiButton;

        private readonly _btnSetRuleName!       : TwnsUiButton.UiButton;
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
        private _selectedRule       : ITemplateWarRule | null = null;

        protected _onOpening(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,             callback: this._onNotifyLanguageChanged },
                { type: NotifyType.MsgMmAddWarRule,             callback: this._onNotifyMsgMmAddWarRule },
                { type: NotifyType.MsgMmDeleteWarRule,          callback: this._onNotifyMsgMmDeleteWarRule },
                { type: NotifyType.MsgMmSetWarRuleName,         callback: this._onNotifyMsgMmSetWarRuleName },
                { type: NotifyType.MsgMmSetWarRuleAvailability, callback: this._onNotifyMsgMmSetWarRuleAvailability },
            ]);
            this._setUiListenerArray([
                { ui: this._btnBack,                callback: this._onTouchedBtnBack },
                { ui: this._btnSetAvailability,     callback: this._onTouchedBtnSetAvailability },
                { ui: this._btnSetRuleName,         callback: this._onTouchedBtnSetRuleName },
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
                this._selectedRule  = Helpers.deepClone(dataList[newIndex].templateWarRule);
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

        private _onNotifyMsgMmSetWarRuleName(): void {
            FloatText.show(Lang.getText(LangTextType.A0310));
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
                PanelHelpers.open(PanelHelpers.PanelDict.MmSetWarRuleAvailabilityPanel, {
                    mapId   : Helpers.getExisted(this._getOpenData().mapRawData.mapId),
                    ruleId,
                });
            }
        }

        private _onTouchedBtnSetRuleName(): void {
            const templateWarRule   = this._selectedRule;
            const ruleId            = templateWarRule?.ruleId;
            if ((templateWarRule != null) && (ruleId != null)) {
                PanelHelpers.open(PanelHelpers.PanelDict.CommonModifyWarRuleNamePanel, {
                    templateWarRule,
                    callback        : () => {
                        WarMap.WarMapProxy.reqMmSetWarRuleName(Helpers.getExisted(this._getOpenData().mapRawData.mapId), ruleId, Helpers.getExisted(templateWarRule.ruleNameArray));
                    },
                });
            }
        }

        private _onTouchedBtnSubmitRule(): void {
            const templateWarRule = this._selectedRule;
            if (templateWarRule) {
                PanelHelpers.open(PanelHelpers.PanelDict.CommonConfirmPanel, {
                    content     : Lang.getText(LangTextType.A0282),
                    callback    : () => {
                        WarMap.WarMapProxy.reqMmAddWarRule(Helpers.getExisted(this._getOpenData().mapRawData.mapId), templateWarRule);
                    },
                });
            }
        }

        private _onTouchedBtnDeleteRule(): void {
            const ruleId = this._selectedRule?.ruleId;
            if (ruleId != null) {
                const mapRawData = this._getOpenData().mapRawData;
                if ((mapRawData.templateWarRuleArray ?? []).length <= 1) {
                    FloatText.show(Lang.getText(LangTextType.A0291));
                    return;
                }

                PanelHelpers.open(PanelHelpers.PanelDict.CommonConfirmPanel, {
                    content : Lang.getText(LangTextType.A0292),
                    callback: () => {
                        WarMap.WarMapProxy.reqMmDeleteWarRule(Helpers.getExisted(mapRawData.mapId), ruleId);
                    }
                });
            }
        }

        private _onTouchedBtnHelpHasFog(): void {
            PanelHelpers.open(PanelHelpers.PanelDict.CommonHelpPanel, {
                title  : Lang.getText(LangTextType.B0020),
                content: Lang.getText(LangTextType.R0002),
            });
        }

        private _onTouchedBtnModifyHasFog(): void {
            const templateWarRule = this._selectedRule;
            if (templateWarRule) {
                WarHelpers.WarRuleHelpers.setHasFogByDefault(templateWarRule, !WarHelpers.WarRuleHelpers.getHasFogByDefault(templateWarRule));
                this._updateImgHasFog(templateWarRule);
            }
        }

        private async _onTouchedBtnModifyWeather(): Promise<void> {
            const templateWarRule  = this._selectedRule;
            if (templateWarRule) {
                WarHelpers.WarRuleHelpers.tickDefaultWeatherType(templateWarRule, await Config.ConfigManager.getLatestGameConfig());
                this._updateLabelWeather(templateWarRule);
            }
        }

        private _onTouchedBtnModifyRuleName(): void {
            const templateWarRule = this._selectedRule;
            if (templateWarRule) {
                PanelHelpers.open(PanelHelpers.PanelDict.CommonModifyWarRuleNamePanel, {
                    templateWarRule,
                    callback        : () => {
                        this._updateLabelRuleName(templateWarRule);
                    },
                });
            }
        }

        private _onTouchedBtnAvailabilityMcw(): void {
            const templateWarRule = this._selectedRule;
            if (templateWarRule) {
                const ruleAvailability  = Helpers.getExisted(templateWarRule.ruleAvailability);
                ruleAvailability.canMcw = !ruleAvailability.canMcw;
                this._updateImgAvailabilityMcw(templateWarRule);
            }
        }

        private _onTouchedBtnAvailabilityScw(): void {
            const templateWarRule = this._selectedRule;
            if (templateWarRule) {
                const ruleAvailability  = Helpers.getExisted(templateWarRule.ruleAvailability);
                ruleAvailability.canScw = !ruleAvailability.canScw;
                this._updateImgAvailabilityScw(templateWarRule);
            }
        }

        private _onTouchedBtnAvailabilityMrw(): void {
            const templateWarRule = this._selectedRule;
            if (templateWarRule) {
                const ruleAvailability  = Helpers.getExisted(templateWarRule.ruleAvailability);
                ruleAvailability.canMrw = !ruleAvailability.canMrw;
                this._updateImgAvailabilityMrw(templateWarRule);
            }
        }

        private _onTouchedBtnAvailabilityCcw(): void {
            const templateWarRule = this._selectedRule;
            if (templateWarRule) {
                const ruleAvailability  = Helpers.getExisted(templateWarRule.ruleAvailability);
                const canCcw            = !ruleAvailability.canCcw;
                ruleAvailability.canCcw = canCcw;
                this._updateImgAvailabilityCcw(templateWarRule);

                if (!canCcw) {
                    for (const playerRule of templateWarRule.ruleForPlayers?.playerRuleDataArray || []) {
                        playerRule.fixedCoIdInCcw = null;
                        this._updateListPlayerRule(templateWarRule);
                    }
                }
            }
        }

        private _onTouchedBtnAvailabilitySrw(): void {
            const templateWarRule = this._selectedRule;
            if (templateWarRule) {
                const ruleAvailability  = Helpers.getExisted(templateWarRule.ruleAvailability);
                ruleAvailability.canSrw = !ruleAvailability.canSrw;
                this._updateImgAvailabilitySrw(templateWarRule);
            }
        }

        private _onTouchedBtnAddWarEvent(): void {
            const templateWarRule = this._selectedRule;
            if (templateWarRule) {
                PanelHelpers.open(PanelHelpers.PanelDict.MeAddWarEventToRulePanel, {
                    templateWarRule,
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
            this._btnSetRuleName.label          = Lang.getText(LangTextType.B0495);
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
            for (const templateWarRule of this._getOpenData().mapRawData.templateWarRuleArray || []) {
                data.push({
                    index,
                    templateWarRule,
                    panel           : this,
                });
                ++index;
            }

            return data;
        }

        private _updateComponentsForRule(): void {
            const templateWarRule = this._selectedRule;
            this._updateLabelRuleName(templateWarRule);
            this._updateLabelWeather(templateWarRule);
            this._updateImgHasFog(templateWarRule);
            this._updateImgAvailabilityMcw(templateWarRule);
            this._updateImgAvailabilityScw(templateWarRule);
            this._updateImgAvailabilityMrw(templateWarRule);
            this._updateImgAvailabilityCcw(templateWarRule);
            this._updateImgAvailabilitySrw(templateWarRule);
            this._updateListWarEvent(templateWarRule);
            this._updateListPlayerRule(templateWarRule);
        }

        private _updateLabelRuleName(templateWarRule: ITemplateWarRule | null): void {
            this._labelRuleName.text = Lang.concatLanguageTextList(templateWarRule?.ruleNameArray) || Lang.getText(LangTextType.B0001);
        }
        private async _updateLabelWeather(templateWarRule: ITemplateWarRule | null): Promise<void> {
            const gameConfig        = await Config.ConfigManager.getLatestGameConfig();
            this._labelWeather.text = Lang.getWeatherName(templateWarRule
                ? WarHelpers.WarRuleHelpers.getDefaultWeatherType(templateWarRule, gameConfig)
                : gameConfig.getDefaultWeatherType(), gameConfig
            ) ?? CommonConstants.ErrorTextForUndefined;
        }
        private _updateImgHasFog(templateWarRule: ITemplateWarRule | null): void {
            this._imgHasFog.visible = templateWarRule ? !!templateWarRule.ruleForGlobalParams?.hasFogByDefault : false;
        }
        private _updateImgAvailabilityMcw(templateWarRule: ITemplateWarRule | null): void {
            this._imgAvailabilityMcw.visible = templateWarRule ? !!templateWarRule.ruleAvailability?.canMcw : false;
        }
        private _updateImgAvailabilityScw(templateWarRule: ITemplateWarRule | null): void {
            this._imgAvailabilityScw.visible = templateWarRule ? !!templateWarRule.ruleAvailability?.canScw : false;
        }
        private _updateImgAvailabilityMrw(templateWarRule: ITemplateWarRule | null): void {
            this._imgAvailabilityMrw.visible = templateWarRule ? !!templateWarRule.ruleAvailability?.canMrw : false;
        }
        private _updateImgAvailabilityCcw(templateWarRule: ITemplateWarRule | null): void {
            this._imgAvailabilityCcw.visible = !!templateWarRule?.ruleAvailability?.canCcw;
        }
        private _updateImgAvailabilitySrw(templateWarRule: ITemplateWarRule | null): void {
            this._imgAvailabilitySrw.visible = !!templateWarRule?.ruleAvailability?.canSrw;
        }
        private _updateListWarEvent(templateWarRule: ITemplateWarRule | null): void {
            const list = this._listWarEvent;
            if (templateWarRule == null) {
                list.clear();
                return;
            }

            const dataArray         : DataForWarEventRenderer[] = [];
            const warEventFullData  = this._getOpenData().mapRawData.warEventFullData;
            for (const warEventId of templateWarRule.warEventIdArray || []) {
                dataArray.push({
                    panel               : this,
                    warEventFullData,
                    warEventId,
                    templateWarRule,
                });
            }
            list.bindData(dataArray);
        }
        public _updateListPlayerRule(templateWarRule: ITemplateWarRule | null): void {
            const listPlayer = this._listPlayer;
            if (templateWarRule == null) {
                listPlayer.clear();
                return;
            }

            const playerRuleDataList = templateWarRule.ruleForPlayers?.playerRuleDataArray;
            if ((!playerRuleDataList) || (!playerRuleDataList.length)) {
                listPlayer.clear();
            } else {
                const dataList  : DataForPlayerRenderer[] = [];
                let index       = 0;
                for (const playerRule of playerRuleDataList) {
                    dataList.push({
                        index,
                        playerRule,
                        templateWarRule,
                        panel       : this,
                    });
                    ++index;
                }
                listPlayer.bindData(dataList);
            }
        }
    }

    type DataForWarRuleNameRenderer = {
        index           : number;
        templateWarRule : ITemplateWarRule;
        panel           : MmWarRulePanel;
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
        index           : number;
        templateWarRule : ITemplateWarRule;
        playerRule      : IDataForPlayerRule;
        panel           : MmWarRulePanel;
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
            this._listInfo.bindData(await this._createDataForListInfo());
        }

        private async _createDataForListInfo(): Promise<DataForInfoRenderer[]> {
            const data              = this._getData();
            const templateWarRule   = data.templateWarRule;
            const playerRule        = data.playerRule;
            return [
                this._createDataPlayerIndex(templateWarRule, playerRule),
                this._createDataTeamIndex(templateWarRule, playerRule),
                await this._createDataBannedCoCategoryIdArray(templateWarRule, playerRule),
                await this._createDataBannedUnitTypeArray(templateWarRule, playerRule),
                this._createDataCanActivateCoSkill(templateWarRule, playerRule),
                this._createDataInitialFund(templateWarRule, playerRule),
                this._createDataIncomeMultiplier(templateWarRule, playerRule),
                this._createDataEnergyAddPctOnLoadCo(templateWarRule, playerRule),
                this._createDataEnergyGrowthMultiplier(templateWarRule, playerRule),
                this._createDataMoveRangeModifier(templateWarRule, playerRule),
                this._createDataAttackPowerModifier(templateWarRule, playerRule),
                this._createDataVisionRangeModifier(templateWarRule, playerRule),
                this._createDataLuckLowerLimit(templateWarRule, playerRule),
                this._createDataLuckUpperLimit(templateWarRule, playerRule),
                this._createDataIsControlledByAiInCcw(templateWarRule, playerRule),
                await this._createDataAiCoIdInCcw(templateWarRule, playerRule),
                this._createDataIsControlledByAiInSrw(templateWarRule, playerRule),
                await this._createDataAiCoIdInSrw(templateWarRule, playerRule),
            ];
        }
        private _createDataPlayerIndex(templateWarRule: ITemplateWarRule, playerRule: IDataForPlayerRule): DataForInfoRenderer {
            return {
                titleText               : Lang.getText(LangTextType.B0018),
                infoText                : Lang.getPlayerForceName(Helpers.getExisted(playerRule.playerIndex)),
                infoColor               : 0xFFFFFF,
                callbackOnTouchedTitle  : null,
            };
        }
        private _createDataTeamIndex(templateWarRule: ITemplateWarRule, playerRule: IDataForPlayerRule): DataForInfoRenderer {
            return {
                titleText               : Lang.getText(LangTextType.B0019),
                infoText                : Lang.getPlayerTeamName(Helpers.getExisted(playerRule.teamIndex)) ?? CommonConstants.ErrorTextForUndefined,
                infoColor               : 0xFFFFFF,
                callbackOnTouchedTitle  : () => {
                    WarHelpers.WarRuleHelpers.tickTeamIndex(templateWarRule, Helpers.getExisted(playerRule.playerIndex));
                    this._updateView();
                },
            };
        }
        private async _createDataBannedCoCategoryIdArray(templateWarRule: ITemplateWarRule, playerRule: IDataForPlayerRule): Promise<DataForInfoRenderer> {
            const currentBannedCoCategoryIdArray    = playerRule.bannedCoCategoryIdArray ?? [];
            const gameConfig                        = await Config.ConfigManager.getLatestGameConfig();
            return {
                titleText               : Lang.getText(LangTextType.B0403),
                infoText                : `${currentBannedCoCategoryIdArray.length}`,
                infoColor               : 0xFFFFFF,
                callbackOnTouchedTitle  : () => PanelHelpers.open(PanelHelpers.PanelDict.CommonChooseCoCategoryIdPanel, {
                    gameConfig,
                    currentCoCategoryIdArray        : currentBannedCoCategoryIdArray,
                    forceUnchosenCoCategoryIdArray  : [CommonConstants.CoCategoryId.Empty],
                    callbackOnConfirm               : bannedCoCategoryIdArray => {
                        WarHelpers.WarRuleHelpers.setBannedCoCategoryIdArray(templateWarRule, Helpers.getExisted(playerRule.playerIndex), new Set(bannedCoCategoryIdArray));
                        this._updateView();
                    },
                }),
            };
        }
        private async _createDataBannedUnitTypeArray(templateWarRule: ITemplateWarRule, playerRule: IDataForPlayerRule): Promise<DataForInfoRenderer> {
            const currentBannedUnitTypeArray    = playerRule.bannedUnitTypeArray ?? [];
            const gameConfig                    = await Config.ConfigManager.getLatestGameConfig();
            return {
                titleText               : Lang.getText(LangTextType.B0895),
                infoText                : `${currentBannedUnitTypeArray.length}`,
                infoColor               : 0xFFFFFF,
                callbackOnTouchedTitle  : () => {
                    PanelHelpers.open(PanelHelpers.PanelDict.CommonChooseUnitTypePanel, {
                        currentUnitTypeArray    : currentBannedUnitTypeArray,
                        gameConfig,
                        callbackOnConfirm       : bannedUnitTypeArray => {
                            WarHelpers.WarRuleHelpers.setBannedUnitTypeArray(templateWarRule, Helpers.getExisted(playerRule.playerIndex), bannedUnitTypeArray);
                            this._updateView();
                        },
                    });
                },
            };
        }
        private _createDataCanActivateCoSkill(templateWarRule: ITemplateWarRule, playerRule: IDataForPlayerRule): DataForInfoRenderer {
            const canActivate = playerRule.canActivateCoSkill !== false;
            return {
                titleText               : Lang.getText(LangTextType.B0897),
                infoText                : Lang.getText(canActivate ? LangTextType.B0012 : LangTextType.B0013),
                infoColor               : canActivate ? 0xFFFFFF : 0xFF0000,
                callbackOnTouchedTitle  : () => {
                    WarHelpers.WarRuleHelpers.setCanActivateCoSkill(templateWarRule, Helpers.getExisted(playerRule.playerIndex), !canActivate);
                    this._updateView();
                },
            };
        }
        private _createDataInitialFund(templateWarRule: ITemplateWarRule, playerRule: IDataForPlayerRule): DataForInfoRenderer {
            const currValue = Helpers.getExisted(playerRule.initialFund);
            return {
                titleText               : Lang.getText(LangTextType.B0178),
                infoText                : `${currValue}`,
                infoColor               : getTextColor(currValue, CommonConstants.WarRuleInitialFundDefault),
                callbackOnTouchedTitle  : () => {
                    const maxValue  = CommonConstants.WarRuleInitialFundMaxLimit;
                    const minValue  = CommonConstants.WarRuleInitialFundMinLimit;
                    PanelHelpers.open(PanelHelpers.PanelDict.CommonInputIntegerPanel, {
                        title           : Lang.getText(LangTextType.B0178),
                        currentValue    : currValue,
                        minValue,
                        maxValue,
                        tips            : `${Lang.getText(LangTextType.B0319)}: [${minValue}, ${maxValue}]`,
                        callback        : panel => {
                            WarHelpers.WarRuleHelpers.setInitialFund(templateWarRule, Helpers.getExisted(playerRule.playerIndex), panel.getInputValue());
                            this._updateView();
                        },
                    });
                },
            };
        }
        private _createDataIncomeMultiplier(templateWarRule: ITemplateWarRule, playerRule: IDataForPlayerRule): DataForInfoRenderer {
            const currValue = Helpers.getExisted(playerRule.incomeMultiplier);
            return {
                titleText               : Lang.getText(LangTextType.B0179),
                infoText                : `${currValue}%`,
                infoColor               : getTextColor(currValue, CommonConstants.WarRuleIncomeMultiplierDefault),
                callbackOnTouchedTitle  : () => {
                    const maxValue  = CommonConstants.WarRuleIncomeMultiplierMaxLimit;
                    const minValue  = CommonConstants.WarRuleIncomeMultiplierMinLimit;
                    PanelHelpers.open(PanelHelpers.PanelDict.CommonInputIntegerPanel, {
                        title           : Lang.getText(LangTextType.B0179),
                        currentValue    : currValue,
                        minValue,
                        maxValue,
                        tips            : `${Lang.getText(LangTextType.B0319)}: [${minValue}, ${maxValue}]`,
                        callback        : panel => {
                            WarHelpers.WarRuleHelpers.setIncomeMultiplier(templateWarRule, Helpers.getExisted(playerRule.playerIndex), panel.getInputValue());
                            this._updateView();
                        },
                    });
                },
            };
        }
        private _createDataEnergyAddPctOnLoadCo(templateWarRule: ITemplateWarRule, playerRule: IDataForPlayerRule): DataForInfoRenderer {
            const currValue = Helpers.getExisted(playerRule.energyAddPctOnLoadCo);
            return {
                titleText               : Lang.getText(LangTextType.B0180),
                infoText                : `${currValue}%`,
                infoColor               : getTextColor(currValue, CommonConstants.WarRuleEnergyAddPctOnLoadCoDefault),
                callbackOnTouchedTitle  : () => {
                    const minValue      = CommonConstants.WarRuleEnergyAddPctOnLoadCoMinLimit;
                    const maxValue      = CommonConstants.WarRuleEnergyAddPctOnLoadCoMaxLimit;
                    PanelHelpers.open(PanelHelpers.PanelDict.CommonInputIntegerPanel, {
                        title           : Lang.getText(LangTextType.B0180),
                        currentValue    : currValue,
                        minValue,
                        maxValue,
                        tips            : `${Lang.getText(LangTextType.B0319)}: [${minValue}, ${maxValue}]`,
                        callback        : panel => {
                            WarHelpers.WarRuleHelpers.setEnergyAddPctOnLoadCo(templateWarRule, Helpers.getExisted(playerRule.playerIndex), panel.getInputValue());
                            this._updateView();
                        },
                    });
                },
            };
        }
        private _createDataEnergyGrowthMultiplier(templateWarRule: ITemplateWarRule, playerRule: IDataForPlayerRule): DataForInfoRenderer {
            const currValue = Helpers.getExisted(playerRule.energyGrowthMultiplier);
            return {
                titleText               : Lang.getText(LangTextType.B0181),
                infoText                : `${currValue}%`,
                infoColor               : getTextColor(currValue, CommonConstants.WarRuleEnergyGrowthMultiplierDefault),
                callbackOnTouchedTitle  : () => {
                    const minValue      = CommonConstants.WarRuleEnergyGrowthMultiplierMinLimit;
                    const maxValue      = CommonConstants.WarRuleEnergyGrowthMultiplierMaxLimit;
                    PanelHelpers.open(PanelHelpers.PanelDict.CommonInputIntegerPanel, {
                        title           : Lang.getText(LangTextType.B0181),
                        currentValue    : currValue,
                        minValue,
                        maxValue,
                        tips            : `${Lang.getText(LangTextType.B0319)}: [${minValue}, ${maxValue}]`,
                        callback        : panel => {
                            WarHelpers.WarRuleHelpers.setEnergyGrowthMultiplier(templateWarRule, Helpers.getExisted(playerRule.playerIndex), panel.getInputValue());
                            this._updateView();
                        },
                    });
                },
            };
        }
        private _createDataMoveRangeModifier(templateWarRule: ITemplateWarRule, playerRule: IDataForPlayerRule): DataForInfoRenderer {
            const currValue = Helpers.getExisted(playerRule.moveRangeModifier);
            return {
                titleText               : Lang.getText(LangTextType.B0182),
                infoText                : `${currValue}`,
                infoColor               : getTextColor(currValue, CommonConstants.WarRuleMoveRangeModifierDefault),
                callbackOnTouchedTitle  : () => {
                    const minValue      = CommonConstants.WarRuleMoveRangeModifierMinLimit;
                    const maxValue      = CommonConstants.WarRuleMoveRangeModifierMaxLimit;
                    PanelHelpers.open(PanelHelpers.PanelDict.CommonInputIntegerPanel, {
                        title           : Lang.getText(LangTextType.B0182),
                        currentValue    : currValue,
                        minValue,
                        maxValue,
                        tips            : `${Lang.getText(LangTextType.B0319)}: [${minValue}, ${maxValue}]`,
                        callback        : panel => {
                            WarHelpers.WarRuleHelpers.setMoveRangeModifier(templateWarRule, Helpers.getExisted(playerRule.playerIndex), panel.getInputValue());
                            this._updateView();
                        },
                    });
                },
            };
        }
        private _createDataAttackPowerModifier(templateWarRule: ITemplateWarRule, playerRule: IDataForPlayerRule): DataForInfoRenderer {
            const currValue = Helpers.getExisted(playerRule.attackPowerModifier);
            return {
                titleText               : Lang.getText(LangTextType.B0183),
                infoText                : `${currValue}%`,
                infoColor               : getTextColor(currValue, CommonConstants.WarRuleOffenseBonusDefault),
                callbackOnTouchedTitle  : () => {
                    const minValue      = CommonConstants.WarRuleOffenseBonusMinLimit;
                    const maxValue      = CommonConstants.WarRuleOffenseBonusMaxLimit;
                    PanelHelpers.open(PanelHelpers.PanelDict.CommonInputIntegerPanel, {
                        title           : Lang.getText(LangTextType.B0183),
                        currentValue    : currValue,
                        minValue,
                        maxValue,
                        tips            : `${Lang.getText(LangTextType.B0319)}: [${minValue}, ${maxValue}]`,
                        callback        : panel => {
                            WarHelpers.WarRuleHelpers.setAttackPowerModifier(templateWarRule, Helpers.getExisted(playerRule.playerIndex), panel.getInputValue());
                            this._updateView();
                        },
                    });
                },
            };
        }
        private _createDataVisionRangeModifier(templateWarRule: ITemplateWarRule, playerRule: IDataForPlayerRule): DataForInfoRenderer {
            const currValue = Helpers.getExisted(playerRule.visionRangeModifier);
            return {
                titleText               : Lang.getText(LangTextType.B0184),
                infoText                : `${currValue}`,
                infoColor               : getTextColor(currValue, CommonConstants.WarRuleVisionRangeModifierDefault),
                callbackOnTouchedTitle  : () => {
                    const minValue      = CommonConstants.WarRuleVisionRangeModifierMinLimit;
                    const maxValue      = CommonConstants.WarRuleVisionRangeModifierMaxLimit;
                    PanelHelpers.open(PanelHelpers.PanelDict.CommonInputIntegerPanel, {
                        title           : Lang.getText(LangTextType.B0184),
                        currentValue    : currValue,
                        minValue,
                        maxValue,
                        tips            : `${Lang.getText(LangTextType.B0319)}: [${minValue}, ${maxValue}]`,
                        callback        : panel => {
                            WarHelpers.WarRuleHelpers.setVisionRangeModifier(templateWarRule, Helpers.getExisted(playerRule.playerIndex), panel.getInputValue());
                            this._updateView();
                        },
                    });
                },
            };
        }
        private _createDataLuckLowerLimit(templateWarRule: ITemplateWarRule, playerRule: IDataForPlayerRule): DataForInfoRenderer {
            const currValue     = Helpers.getExisted(playerRule.luckLowerLimit);
            const playerIndex   = Helpers.getExisted(playerRule.playerIndex);
            return {
                titleText               : Lang.getText(LangTextType.B0189),
                infoText                : `${currValue}%`,
                infoColor               : getTextColor(currValue, CommonConstants.WarRuleLuckDefaultLowerLimit),
                callbackOnTouchedTitle  : () => {
                    const minValue      = CommonConstants.WarRuleLuckMinLimit;
                    const maxValue      = CommonConstants.WarRuleLuckMaxLimit;
                    PanelHelpers.open(PanelHelpers.PanelDict.CommonInputIntegerPanel, {
                        title           : Lang.getText(LangTextType.B0189),
                        currentValue    : currValue,
                        minValue,
                        maxValue,
                        tips            : `${Lang.getText(LangTextType.B0319)}: [${minValue}, ${maxValue}]`,
                        callback        : panel => {
                            const value         = panel.getInputValue();
                            const upperLimit    = WarHelpers.WarRuleHelpers.getLuckUpperLimit(templateWarRule, playerIndex);
                            if (value <= upperLimit) {
                                WarHelpers.WarRuleHelpers.setLuckLowerLimit(templateWarRule, playerIndex, value);
                            } else {
                                WarHelpers.WarRuleHelpers.setLuckUpperLimit(templateWarRule, playerIndex, value);
                                WarHelpers.WarRuleHelpers.setLuckLowerLimit(templateWarRule, playerIndex, upperLimit);
                            }
                            this._updateView();
                        },
                    });
                },
            };
        }
        private _createDataLuckUpperLimit(templateWarRule: ITemplateWarRule, playerRule: IDataForPlayerRule): DataForInfoRenderer {
            const currValue     = Helpers.getExisted(playerRule.luckUpperLimit);
            const playerIndex   = Helpers.getExisted(playerRule.playerIndex);
            return {
                titleText               : Lang.getText(LangTextType.B0190),
                infoText                : `${currValue}%`,
                infoColor               : getTextColor(currValue, CommonConstants.WarRuleLuckDefaultUpperLimit),
                callbackOnTouchedTitle  : () => {
                    const minValue      = CommonConstants.WarRuleLuckMinLimit;
                    const maxValue      = CommonConstants.WarRuleLuckMaxLimit;
                    PanelHelpers.open(PanelHelpers.PanelDict.CommonInputIntegerPanel, {
                        title           : Lang.getText(LangTextType.B0190),
                        currentValue    : currValue,
                        minValue,
                        maxValue,
                        tips            : `${Lang.getText(LangTextType.B0319)}: [${minValue}, ${maxValue}]`,
                        callback        : panel => {
                            const value         = panel.getInputValue();
                            const lowerLimit    = WarHelpers.WarRuleHelpers.getLuckLowerLimit(templateWarRule, playerIndex);
                            if (value >= lowerLimit) {
                                WarHelpers.WarRuleHelpers.setLuckUpperLimit(templateWarRule, playerIndex, value);
                            } else {
                                WarHelpers.WarRuleHelpers.setLuckLowerLimit(templateWarRule, playerIndex, value);
                                WarHelpers.WarRuleHelpers.setLuckUpperLimit(templateWarRule, playerIndex, lowerLimit);
                            }
                            this._updateView();
                        },
                    });
                },
            };
        }
        private _createDataIsControlledByAiInCcw(templateWarRule: ITemplateWarRule, playerRule: IDataForPlayerRule): DataForInfoRenderer {
            const isControlledByAi = playerRule.fixedCoIdInCcw != null;
            return {
                titleText               : Lang.getText(LangTextType.B0645),
                infoText                : Lang.getText(isControlledByAi ? LangTextType.B0012 : LangTextType.B0013),
                infoColor               : isControlledByAi ? 0x00FF00 : 0xFFFFFF,
                callbackOnTouchedTitle  : () => {
                    if (!templateWarRule.ruleAvailability?.canCcw) {
                        FloatText.show(Lang.getText(LangTextType.A0221));
                        return;
                    }

                    const playerIndex = Helpers.getExisted(playerRule.playerIndex);
                    if (isControlledByAi) {
                        WarHelpers.WarRuleHelpers.setFixedCoIdInCcw(templateWarRule, playerIndex, null);
                    } else {
                        WarHelpers.WarRuleHelpers.setFixedCoIdInCcw(templateWarRule, playerIndex, CommonConstants.CoId.Empty);
                    }
                    this._updateView();
                },
            };
        }
        private async _createDataAiCoIdInCcw(templateWarRule: ITemplateWarRule, playerRule: IDataForPlayerRule): Promise<DataForInfoRenderer> {
            const coId          = playerRule.fixedCoIdInCcw;
            const gameConfig    = await Config.ConfigManager.getLatestGameConfig();
            return {
                titleText               : Lang.getText(LangTextType.B0644),
                infoText                : coId == null ? `--` : gameConfig.getCoNameAndTierText(coId) ?? CommonConstants.ErrorTextForUndefined,
                infoColor               : coId == null ? 0xFFFFFF : 0x00FF00,
                callbackOnTouchedTitle  : () => {
                    if (!templateWarRule.ruleAvailability?.canCcw) {
                        FloatText.show(Lang.getText(LangTextType.A0221));
                        return;
                    }

                    const coIdArray: number[] = [];
                    for (const cfg of gameConfig.getEnabledCoArray()) {
                        coIdArray.push(cfg.coId);
                    }
                    PanelHelpers.open(PanelHelpers.PanelDict.CommonChooseSingleCoPanel, {
                        gameConfig,
                        currentCoId         : playerRule.fixedCoIdInCcw ?? null,
                        availableCoIdArray  : coIdArray,
                        callbackOnConfirm   : (newCoId: number) => {
                            WarHelpers.WarRuleHelpers.setFixedCoIdInCcw(templateWarRule, Helpers.getExisted(playerRule.playerIndex), newCoId);
                            this._updateView();
                        },
                    });
                },
            };
        }
        private _createDataIsControlledByAiInSrw(templateWarRule: ITemplateWarRule, playerRule: IDataForPlayerRule): DataForInfoRenderer {
            const isControlledByAi = playerRule.fixedCoIdInSrw != null;
            return {
                titleText               : Lang.getText(LangTextType.B0816),
                infoText                : Lang.getText(isControlledByAi ? LangTextType.B0012 : LangTextType.B0013),
                infoColor               : isControlledByAi ? 0x00FF00 : 0xFFFFFF,
                callbackOnTouchedTitle  : () => {
                    if (!templateWarRule.ruleAvailability?.canSrw) {
                        FloatText.show(Lang.getText(LangTextType.A0276));
                        return;
                    }

                    const playerIndex = Helpers.getExisted(playerRule.playerIndex);
                    if (isControlledByAi) {
                        WarHelpers.WarRuleHelpers.setFixedCoIdInSrw(templateWarRule, playerIndex, null);
                    } else {
                        WarHelpers.WarRuleHelpers.setFixedCoIdInSrw(templateWarRule, playerIndex, CommonConstants.CoId.Empty);
                    }
                    this._updateView();
                },
            };
        }
        private async _createDataAiCoIdInSrw(templateWarRule: ITemplateWarRule, playerRule: IDataForPlayerRule): Promise<DataForInfoRenderer> {
            const coId          = playerRule.fixedCoIdInSrw;
            const gameConfig    = await Config.ConfigManager.getLatestGameConfig();
            return {
                titleText               : Lang.getText(LangTextType.B0815),
                infoText                : coId == null ? `--` : gameConfig.getCoNameAndTierText(coId) ?? CommonConstants.ErrorTextForUndefined,
                infoColor               : coId == null ? 0xFFFFFF : 0x00FF00,
                callbackOnTouchedTitle  : () => {
                    if (!templateWarRule.ruleAvailability?.canSrw) {
                        FloatText.show(Lang.getText(LangTextType.A0276));
                        return;
                    }

                    const coIdArray: number[] = [];
                    for (const cfg of gameConfig.getEnabledCoArray()) {
                        coIdArray.push(cfg.coId);
                    }
                    PanelHelpers.open(PanelHelpers.PanelDict.CommonChooseSingleCoPanel, {
                        gameConfig,
                        currentCoId         : playerRule.fixedCoIdInSrw ?? null,
                        availableCoIdArray  : coIdArray,
                        callbackOnConfirm   : (newCoId: number) => {
                            WarHelpers.WarRuleHelpers.setFixedCoIdInSrw(templateWarRule, Helpers.getExisted(playerRule.playerIndex), newCoId);
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
        templateWarRule     : ITemplateWarRule;
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
                WarHelpers.WarRuleHelpers.moveWarEventId(data.templateWarRule, data.warEventId, -1);
                Notify.dispatch(NotifyType.MeWarEventIdArrayChanged);
            }
        }
        private _onTouchedBtnDown(): void {
            const data = this.data;
            if (data) {
                WarHelpers.WarRuleHelpers.moveWarEventId(data.templateWarRule, data.warEventId, 1);
                Notify.dispatch(NotifyType.MeWarEventIdArrayChanged);
            }
        }
        private _onTouchedBtnDelete(): void {
            const data = this.data;
            if (data) {
                WarHelpers.WarRuleHelpers.deleteWarEventId(data.templateWarRule, data.warEventId);
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
