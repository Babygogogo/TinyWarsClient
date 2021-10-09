
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

namespace TwnsMmWarRulePanel {
    import CommonHelpPanel              = TwnsCommonHelpPanel.CommonHelpPanel;
    import MmWarRuleAvailableCoPanel    = TwnsMmWarRuleAvailableCoPanel.MmWarRuleAvailableCoPanel;
    import LangTextType                 = TwnsLangTextType.LangTextType;
    import NotifyType                   = TwnsNotifyType.NotifyType;
    import IWarRule                     = ProtoTypes.WarRule.IWarRule;
    import IDataForPlayerRule           = ProtoTypes.WarRule.IDataForPlayerRule;

    type OpenDataForMmWarRulePanel = ProtoTypes.Map.IMapRawData;
    export class MmWarRulePanel extends TwnsUiPanel.UiPanel<OpenDataForMmWarRulePanel> {
        protected readonly _LAYER_TYPE   = Types.LayerType.Hud0;
        protected readonly _IS_EXCLUSIVE = false;

        private static _instance: MmWarRulePanel;

        private readonly _labelMenuTitle!       : TwnsUiLabel.UiLabel;
        private readonly _listWarRule!          : TwnsUiScrollList.UiScrollList<DataForWarRuleNameRenderer>;
        private readonly _btnBack!              : TwnsUiButton.UiButton;

        private readonly _btnModifyRuleName!    : TwnsUiButton.UiButton;
        private readonly _labelRuleName!        : TwnsUiLabel.UiLabel;

        private readonly _btnModifyHasFog!      : TwnsUiButton.UiButton;
        private readonly _imgHasFog!            : TwnsUiImage.UiImage;
        private readonly _btnHelpHasFog!        : TwnsUiButton.UiButton;

        private readonly _labelAvailability!    : TwnsUiLabel.UiLabel;
        private readonly _btnAvailabilityMcw!   : TwnsUiButton.UiButton;
        private readonly _imgAvailabilityMcw!   : TwnsUiImage.UiImage;
        private readonly _btnAvailabilityScw!   : TwnsUiButton.UiButton;
        private readonly _imgAvailabilityScw!   : TwnsUiImage.UiImage;
        private readonly _btnAvailabilityMrw!   : TwnsUiButton.UiButton;
        private readonly _imgAvailabilityMrw!   : TwnsUiImage.UiImage;

        private readonly _labelPlayerList!      : TwnsUiLabel.UiLabel;
        private readonly _listPlayer!           : TwnsUiScrollList.UiScrollList<DataForPlayerRenderer>;

        private _dataForListWarRule : DataForWarRuleNameRenderer[] = [];
        private _selectedIndex      : number | null = null;
        private _selectedRule       : IWarRule | null = null;

        public static show(openData: OpenDataForMmWarRulePanel): void {
            if (!MmWarRulePanel._instance) {
                MmWarRulePanel._instance = new MmWarRulePanel();
            }
            MmWarRulePanel._instance.open(openData);
        }
        public static async hide(): Promise<void> {
            if (MmWarRulePanel._instance) {
                await MmWarRulePanel._instance.close();
            }
        }
        public static getIsOpening(): boolean {
            const instance = MmWarRulePanel._instance;
            return instance ? instance.getIsOpening() : false;
        }

        public constructor() {
            super();

            this._setIsTouchMaskEnabled();
            this.skinName = "resource/skins/mapManagement/MmWarRulePanel.exml";
        }

        protected _onOpened(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,        callback: this._onNotifyLanguageChanged },
            ]);
            this._setUiListenerArray([
                { ui: this._btnBack,                callback: this._onTouchedBtnBack },
                { ui: this._btnHelpHasFog,          callback: this._onTouchedBtnHelpHasFog },
            ]);
            this._listWarRule.setItemRenderer(WarRuleNameRenderer);
            this._listPlayer.setItemRenderer(PlayerRenderer);

            this._updateComponentsForLanguage();

            this._resetView();
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
                this._selectedRule  = dataList[newIndex].rule;
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

        private _onTouchedBtnBack(): void {
            this.close();
        }

        private _onTouchedBtnHelpHasFog(): void {
            CommonHelpPanel.show({
                title  : Lang.getText(LangTextType.B0020),
                content: Lang.getText(LangTextType.R0002),
            });
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Private functions.
        ////////////////////////////////////////////////////////////////////////////////
        private _resetView(): void {
            this._btnBack.setTextColor(0x00FF00);

            this._dataForListWarRule = this._createDataForListWarRule();
            this._listWarRule.bindData(this._dataForListWarRule);
            this.setSelectedIndex(0);
        }

        private _updateComponentsForLanguage(): void {
            this._labelMenuTitle.text       = Lang.getText(LangTextType.B0314);
            this._labelAvailability.text    = Lang.getText(LangTextType.B0406);
            this._labelPlayerList.text      = Lang.getText(LangTextType.B0407);
            this._btnAvailabilityMcw.label  = Lang.getText(LangTextType.B0137);
            this._btnAvailabilityScw.label  = Lang.getText(LangTextType.B0138);
            this._btnAvailabilityMrw.label  = Lang.getText(LangTextType.B0404);
            this._btnBack.label             = Lang.getText(LangTextType.B0146);
            this._btnModifyRuleName.label   = Lang.getText(LangTextType.B0315);
            this._btnModifyHasFog.label     = Lang.getText(LangTextType.B0020);
        }

        private _createDataForListWarRule(): DataForWarRuleNameRenderer[] {
            const data  : DataForWarRuleNameRenderer[] = [];
            let index   = 0;
            for (const rule of this._getOpenData().warRuleArray || []) {
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
            this._updateImgAvailabilityMrw(rule);
            this.updateListPlayerRule(rule);
        }

        private _updateLabelRuleName(rule: IWarRule | null): void {
            this._labelRuleName.text = Lang.concatLanguageTextList(rule?.ruleNameArray) || Lang.getText(LangTextType.B0001);
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
        public updateListPlayerRule(rule: IWarRule | null): void {
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
                        isReviewing : true,
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
                this._createDataAvailableCoIdList(warRule, playerRule, isReviewing),
                this._createDataInitialFund(warRule, playerRule, isReviewing),
                this._createDataIncomeMultiplier(warRule, playerRule, isReviewing),
                this._createDataEnergyAddPctOnLoadCo(warRule, playerRule, isReviewing),
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
                callbackOnTouchedTitle  : null,
            };
        }
        private _createDataAvailableCoIdList(warRule: IWarRule, playerRule: IDataForPlayerRule, isReviewing: boolean): DataForInfoRenderer {
            return {
                titleText               : Lang.getText(LangTextType.B0403),
                infoText                : `${(playerRule.bannedCoIdArray || []).length}`,
                infoColor               : 0xFFFFFF,
                callbackOnTouchedTitle  : () => {
                    MmWarRuleAvailableCoPanel.show({
                        warRule,
                        playerRule,
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
                callbackOnTouchedTitle  : null,
            };
        }
        private _createDataIncomeMultiplier(warRule: IWarRule, playerRule: IDataForPlayerRule, isReviewing: boolean): DataForInfoRenderer {
            const currValue = Helpers.getExisted(playerRule.incomeMultiplier);
            return {
                titleText               : Lang.getText(LangTextType.B0179),
                infoText                : `${currValue}%`,
                infoColor               : getTextColor(currValue, CommonConstants.WarRuleIncomeMultiplierDefault),
                callbackOnTouchedTitle  : null,
            };
        }
        private _createDataEnergyAddPctOnLoadCo(warRule: IWarRule, playerRule: IDataForPlayerRule, isReviewing: boolean): DataForInfoRenderer {
            const currValue = Helpers.getExisted(playerRule.energyAddPctOnLoadCo);
            return {
                titleText               : Lang.getText(LangTextType.B0180),
                infoText                : `${currValue}%`,
                infoColor               : getTextColor(currValue, CommonConstants.WarRuleEnergyAddPctOnLoadCoDefault),
                callbackOnTouchedTitle  : null,
            };
        }
        private _createDataEnergyGrowthMultiplier(warRule: IWarRule, playerRule: IDataForPlayerRule, isReviewing: boolean): DataForInfoRenderer {
            const currValue = Helpers.getExisted(playerRule.energyGrowthMultiplier);
            return {
                titleText               : Lang.getText(LangTextType.B0181),
                infoText                : `${currValue}%`,
                infoColor               : getTextColor(currValue, CommonConstants.WarRuleEnergyGrowthMultiplierDefault),
                callbackOnTouchedTitle  : null,
            };
        }
        private _createDataMoveRangeModifier(warRule: IWarRule, playerRule: IDataForPlayerRule, isReviewing: boolean): DataForInfoRenderer {
            const currValue = Helpers.getExisted(playerRule.moveRangeModifier);
            return {
                titleText               : Lang.getText(LangTextType.B0182),
                infoText                : `${currValue}`,
                infoColor               : getTextColor(currValue, CommonConstants.WarRuleMoveRangeModifierDefault),
                callbackOnTouchedTitle  : null,
            };
        }
        private _createDataAttackPowerModifier(warRule: IWarRule, playerRule: IDataForPlayerRule, isReviewing: boolean): DataForInfoRenderer {
            const currValue = Helpers.getExisted(playerRule.attackPowerModifier);
            return {
                titleText               : Lang.getText(LangTextType.B0183),
                infoText                : `${currValue}%`,
                infoColor               : getTextColor(currValue, CommonConstants.WarRuleOffenseBonusDefault),
                callbackOnTouchedTitle  : null,
            };
        }
        private _createDataVisionRangeModifier(warRule: IWarRule, playerRule: IDataForPlayerRule, isReviewing: boolean): DataForInfoRenderer {
            const currValue = Helpers.getExisted(playerRule.visionRangeModifier);
            return {
                titleText               : Lang.getText(LangTextType.B0184),
                infoText                : `${currValue}`,
                infoColor               : getTextColor(currValue, CommonConstants.WarRuleVisionRangeModifierDefault),
                callbackOnTouchedTitle  : null,
            };
        }
        private _createDataLuckLowerLimit(warRule: IWarRule, playerRule: IDataForPlayerRule, isReviewing: boolean): DataForInfoRenderer {
            const currValue = Helpers.getExisted(playerRule.luckLowerLimit);
            return {
                titleText               : Lang.getText(LangTextType.B0189),
                infoText                : `${currValue}%`,
                infoColor               : getTextColor(currValue, CommonConstants.WarRuleLuckDefaultLowerLimit),
                callbackOnTouchedTitle  : null,
            };
        }
        private _createDataLuckUpperLimit(warRule: IWarRule, playerRule: IDataForPlayerRule, isReviewing: boolean): DataForInfoRenderer {
            const currValue = Helpers.getExisted(playerRule.luckUpperLimit);
            return {
                titleText               : Lang.getText(LangTextType.B0190),
                infoText                : `${currValue}%`,
                infoColor               : getTextColor(currValue, CommonConstants.WarRuleLuckDefaultUpperLimit),
                callbackOnTouchedTitle  : null,
            };
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
