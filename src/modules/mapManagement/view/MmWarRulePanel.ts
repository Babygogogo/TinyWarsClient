
namespace TinyWars.MapManagement {
    import Types                = Utility.Types;
    import Lang                 = Utility.Lang;
    import Notify               = Utility.Notify;
    import ProtoTypes           = Utility.ProtoTypes;
    import ConfigManager        = Utility.ConfigManager;
    import CommonHelpPanel      = Common.CommonHelpPanel;
    import IWarRule             = ProtoTypes.WarRule.IWarRule;
    import IDataForPlayerRule   = ProtoTypes.WarRule.IDataForPlayerRule;
    import CommonConstants      = ConfigManager.COMMON_CONSTANTS;

    type OpenDataForMmWarRulePanel = ProtoTypes.Map.IMapRawData;
    export class MmWarRulePanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Hud0;
        protected readonly _IS_EXCLUSIVE = false;

        private static _instance: MmWarRulePanel;

        private _labelMenuTitle     : TinyWars.GameUi.UiLabel;
        private _listWarRule        : TinyWars.GameUi.UiScrollList;
        private _btnBack            : TinyWars.GameUi.UiButton;

        private _btnModifyRuleName  : TinyWars.GameUi.UiButton;
        private _labelRuleName      : TinyWars.GameUi.UiLabel;

        private _btnModifyHasFog    : TinyWars.GameUi.UiButton;
        private _imgHasFog          : TinyWars.GameUi.UiImage;
        private _btnHelpHasFog      : TinyWars.GameUi.UiButton;

        private _labelAvailability  : TinyWars.GameUi.UiLabel;
        private _btnAvailabilityMcw : TinyWars.GameUi.UiButton;
        private _imgAvailabilityMcw : TinyWars.GameUi.UiImage;
        private _btnAvailabilityScw : TinyWars.GameUi.UiButton;
        private _imgAvailabilityScw : TinyWars.GameUi.UiImage;
        private _btnAvailabilityRank: TinyWars.GameUi.UiButton;
        private _imgAvailabilityRank: TinyWars.GameUi.UiImage;
        private _btnAvailabilityWr  : TinyWars.GameUi.UiButton;
        private _imgAvailabilityWr  : TinyWars.GameUi.UiImage;

        private _labelPlayerList    : TinyWars.GameUi.UiLabel;
        private _listPlayer         : TinyWars.GameUi.UiScrollList;

        private _dataForListWarRule : DataForWarRuleNameRenderer[] = [];
        private _selectedIndex      : number;
        private _selectedRule       : IWarRule;

        public static show(openData: OpenDataForMmWarRulePanel): void {
            if (!MmWarRulePanel._instance) {
                MmWarRulePanel._instance = new MmWarRulePanel();
            }
            MmWarRulePanel._instance.open(openData);
        }
        public static hide(): void {
            if (MmWarRulePanel._instance) {
                MmWarRulePanel._instance.close();
            }
        }
        public static getIsOpening(): boolean {
            const instance = MmWarRulePanel._instance;
            return instance ? instance.getIsOpening() : false;
        }

        public constructor() {
            super();

            this._setIsAutoAdjustHeight();
            this._setIsTouchMaskEnabled();
            this.skinName = "resource/skins/mapManagement/MmWarRulePanel.exml";
        }

        protected _onOpened(): void {
            this._setNotifyListenerArray([
                { type: Notify.Type.LanguageChanged,        callback: this._onNotifyLanguageChanged },
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
        protected _onClosed(): void {
            this._listWarRule.clear();
            this._listPlayer.clear();
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

        private _onTouchedBtnBack(e: egret.TouchEvent): void {
            this.close();
        }

        private _onTouchedBtnHelpHasFog(e: egret.TouchEvent): void {
            CommonHelpPanel.show({
                title  : Lang.getText(Lang.Type.B0020),
                content: Lang.getRichText(Lang.RichType.R0002),
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
            this._labelMenuTitle.text           = Lang.getText(Lang.Type.B0314);
            this._labelAvailability.text        = Lang.getText(Lang.Type.B0406);
            this._labelPlayerList.text          = Lang.getText(Lang.Type.B0407);
            this._btnAvailabilityMcw.label      = Lang.getText(Lang.Type.B0137);
            this._btnAvailabilityScw.label      = Lang.getText(Lang.Type.B0138);
            this._btnAvailabilityRank.label     = Lang.getText(Lang.Type.B0404);
            this._btnAvailabilityWr.label       = Lang.getText(Lang.Type.B0257);
            this._btnBack.label                 = Lang.getText(Lang.Type.B0146);
            this._btnModifyRuleName.label       = Lang.getText(Lang.Type.B0315);
            this._btnModifyHasFog.label         = Lang.getText(Lang.Type.B0020);
        }

        private _createDataForListWarRule(): DataForWarRuleNameRenderer[] {
            const data  : DataForWarRuleNameRenderer[] = [];
            let index   = 0;
            for (const rule of this._getOpenData<OpenDataForMmWarRulePanel>().warRuleList || []) {
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
            this.updateListPlayerRule(rule);
        }

        private _updateLabelRuleName(rule: IWarRule): void {
            this._labelRuleName.text = (rule ? rule.ruleNameList || [] : []).join(",");
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
        public updateListPlayerRule(rule: IWarRule): void {
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
        panel       : MmWarRulePanel;
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
                callbackOnTouchedTitle  : null,
            };
        }
        private _createDataAvailableCoIdList(warRule: IWarRule, playerRule: IDataForPlayerRule, isReviewing: boolean): DataForInfoRenderer {
            return {
                titleText               : Lang.getText(Lang.Type.B0403),
                infoText                : `${playerRule.availableCoIdList.length}`,
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
            const currValue = playerRule.initialFund;
            return {
                titleText               : Lang.getText(Lang.Type.B0178),
                infoText                : `${currValue}`,
                infoColor               : getTextColor(currValue, CommonConstants.WarRuleInitialFundDefault),
                callbackOnTouchedTitle  : null,
            };
        }
        private _createDataIncomeMultiplier(warRule: IWarRule, playerRule: IDataForPlayerRule, isReviewing: boolean): DataForInfoRenderer {
            const currValue = playerRule.incomeMultiplier;
            return {
                titleText               : Lang.getText(Lang.Type.B0179),
                infoText                : `${currValue}%`,
                infoColor               : getTextColor(currValue, CommonConstants.WarRuleIncomeMultiplierDefault),
                callbackOnTouchedTitle  : null,
            };
        }
        private _createDataInitialEnergyPercentage(warRule: IWarRule, playerRule: IDataForPlayerRule, isReviewing: boolean): DataForInfoRenderer {
            const currValue     = playerRule.initialEnergyPercentage;
            return {
                titleText               : Lang.getText(Lang.Type.B0180),
                infoText                : `${currValue}%`,
                infoColor               : getTextColor(currValue, CommonConstants.WarRuleInitialEnergyPercentageDefault),
                callbackOnTouchedTitle  : null,
            };
        }
        private _createDataEnergyGrowthMultiplier(warRule: IWarRule, playerRule: IDataForPlayerRule, isReviewing: boolean): DataForInfoRenderer {
            const currValue = playerRule.energyGrowthMultiplier;
            return {
                titleText               : Lang.getText(Lang.Type.B0181),
                infoText                : `${currValue}%`,
                infoColor               : getTextColor(currValue, CommonConstants.WarRuleEnergyGrowthMultiplierDefault),
                callbackOnTouchedTitle  : null,
            };
        }
        private _createDataMoveRangeModifier(warRule: IWarRule, playerRule: IDataForPlayerRule, isReviewing: boolean): DataForInfoRenderer {
            const currValue = playerRule.moveRangeModifier;
            return {
                titleText               : Lang.getText(Lang.Type.B0182),
                infoText                : `${currValue}`,
                infoColor               : getTextColor(currValue, CommonConstants.WarRuleMoveRangeModifierDefault),
                callbackOnTouchedTitle  : null,
            };
        }
        private _createDataAttackPowerModifier(warRule: IWarRule, playerRule: IDataForPlayerRule, isReviewing: boolean): DataForInfoRenderer {
            const currValue = playerRule.attackPowerModifier;
            return {
                titleText               : Lang.getText(Lang.Type.B0183),
                infoText                : `${currValue}%`,
                infoColor               : getTextColor(currValue, CommonConstants.WarRuleOffenseBonusDefault),
                callbackOnTouchedTitle  : null,
            };
        }
        private _createDataVisionRangeModifier(warRule: IWarRule, playerRule: IDataForPlayerRule, isReviewing: boolean): DataForInfoRenderer {
            const currValue = playerRule.visionRangeModifier;
            return {
                titleText               : Lang.getText(Lang.Type.B0184),
                infoText                : `${currValue}`,
                infoColor               : getTextColor(currValue, CommonConstants.WarRuleVisionRangeModifierDefault),
                callbackOnTouchedTitle  : null,
            };
        }
        private _createDataLuckLowerLimit(warRule: IWarRule, playerRule: IDataForPlayerRule, isReviewing: boolean): DataForInfoRenderer {
            const currValue     = playerRule.luckLowerLimit;
            return {
                titleText               : Lang.getText(Lang.Type.B0189),
                infoText                : `${currValue}%`,
                infoColor               : getTextColor(currValue, CommonConstants.WarRuleLuckDefaultLowerLimit),
                callbackOnTouchedTitle  : null,
            };
        }
        private _createDataLuckUpperLimit(warRule: IWarRule, playerRule: IDataForPlayerRule, isReviewing: boolean): DataForInfoRenderer {
            const currValue     = playerRule.luckUpperLimit;
            return {
                titleText               : Lang.getText(Lang.Type.B0190),
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
