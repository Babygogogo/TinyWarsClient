
// import TwnsBwWarEventManager            from "../../baseWar/model/BwWarEventManager";
// import TwnsCommonChooseCoPanel          from "../../common/view/CommonChooseCoPanel";
// import TwnsCommonConfirmPanel           from "../../common/view/CommonConfirmPanel";
// import TwnsCommonHelpPanel              from "../../common/view/CommonHelpPanel";
// import TwnsCommonInputPanel             from "../../common/view/CommonInputPanel";
// import CommonConstants                  from "../../tools/helpers/CommonConstants";
// import ConfigManager                    from "../../tools/helpers/ConfigManager";
// import FloatText                        from "../../tools/helpers/FloatText";
// import Helpers                          from "../../tools/helpers/Helpers";
// import Types                            from "../../tools/helpers/Types";
// import Lang                             from "../../tools/lang/Lang";
// import TwnsLangTextType                 from "../../tools/lang/LangTextType";
// import Notify                           from "../../tools/notify/Notify";
// import TwnsNotifyType                   from "../../tools/notify/NotifyType";
// import ProtoTypes                       from "../../tools/proto/ProtoTypes";
// import TwnsUiButton                     from "../../tools/ui/UiButton";
// import TwnsUiImage                      from "../../tools/ui/UiImage";
// import TwnsUiLabel                      from "../../tools/ui/UiLabel";
// import TwnsUiListItemRenderer           from "../../tools/ui/UiListItemRenderer";
// import TwnsUiPanel                      from "../../tools/ui/UiPanel";
// import TwnsUiScrollList                 from "../../tools/ui/UiScrollList";
// import WarRuleHelpers                   from "../../tools/warHelpers/WarRuleHelpers";
// import TwnsWeEventListPanel             from "../../warEvent/view/WeEventListPanel";
// import TwnsMeField                      from "../model/MeField";
// import MeModel                          from "../model/MeModel";
// import TwnsMeWar                        from "../model/MeWar";
// import TwnsMeAddWarEventToRulePanel     from "./MeAddWarEventToRulePanel";
// import TwnsMeAvailableCoPanel           from "./MeAvailableCoPanel";
// import TwnsMeModifyRuleNamePanel        from "./MeModifyRuleNamePanel";
// import TwnsMeWarMenuPanel               from "./MeWarMenuPanel";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace TwnsMeWarRulePanel {
    import BwWarEventManager        = TwnsBwWarEventManager.BwWarEventManager;
    import MeField                  = TwnsMeField.MeField;
    import MeWar                    = Twns.MapEditor.MeWar;
    import LangTextType             = TwnsLangTextType.LangTextType;
    import NotifyType               = TwnsNotifyType.NotifyType;
    import IWarRule                 = CommonProto.WarRule.IWarRule;
    import IDataForPlayerRule       = CommonProto.WarRule.IDataForPlayerRule;

    export type OpenData = void;
    export class MeWarRulePanel extends TwnsUiPanel.UiPanel<OpenData> {
        private readonly _labelMenuTitle!           : TwnsUiLabel.UiLabel;
        private readonly _listWarRule!              : TwnsUiScrollList.UiScrollList<DataForWarRuleNameRenderer>;
        private readonly _btnAddRule!               : TwnsUiButton.UiButton;
        private readonly _btnDelete!                : TwnsUiButton.UiButton;
        private readonly _btnBack!                  : TwnsUiButton.UiButton;

        private readonly _btnModifyRuleName!        : TwnsUiButton.UiButton;
        private readonly _labelRuleName!            : TwnsUiLabel.UiLabel;

        private readonly _btnModifyHasFog!          : TwnsUiButton.UiButton;
        private readonly _imgHasFog!                : TwnsUiImage.UiImage;
        private readonly _btnHelpHasFog!            : TwnsUiButton.UiButton;

        private readonly _btnModifyWeather!         : TwnsUiButton.UiButton;
        private readonly _labelWeather!             : TwnsUiLabel.UiLabel;

        private readonly _labelAvailability!        : TwnsUiLabel.UiLabel;
        private readonly _btnAvailabilityMcw!       : TwnsUiButton.UiButton;
        private readonly _imgAvailabilityMcw!       : TwnsUiImage.UiImage;
        private readonly _btnAvailabilityScw!       : TwnsUiButton.UiButton;
        private readonly _imgAvailabilityScw!       : TwnsUiImage.UiImage;
        private readonly _btnAvailabilityMrw!       : TwnsUiButton.UiButton;
        private readonly _imgAvailabilityMrw!       : TwnsUiImage.UiImage;
        private readonly _btnAvailabilityCcw!       : TwnsUiButton.UiButton;
        private readonly _imgAvailabilityCcw!       : TwnsUiImage.UiImage;
        private readonly _btnAvailabilitySrw!       : TwnsUiButton.UiButton;
        private readonly _imgAvailabilitySrw!       : TwnsUiImage.UiImage;

        private readonly _labelWarEventListTitle!   : TwnsUiLabel.UiLabel;
        private readonly _btnTestWarEvent!          : TwnsUiButton.UiButton;
        private readonly _btnAddWarEvent!           : TwnsUiButton.UiButton;
        private readonly _btnEditWarEvent!          : TwnsUiButton.UiButton;
        private readonly _listWarEvent!             : TwnsUiScrollList.UiScrollList<DataForWarEventRenderer>;

        private readonly _labelPlayerList!          : TwnsUiLabel.UiLabel;
        private readonly _listPlayer!               : TwnsUiScrollList.UiScrollList<DataForPlayerRenderer>;

        private _dataForListWarRule     : DataForWarRuleNameRenderer[] = [];
        private _selectedIndex          : number | null = null;
        private _selectedRule           : IWarRule | null = null;

        protected _onOpening(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,            callback: this._onNotifyLanguageChanged },
                { type: NotifyType.MeWarEventIdArrayChanged,   callback: this._onNotifyMeWarEventIdArrayChanged },
            ]);
            this._setUiListenerArray([
                { ui: this._btnBack,                callback: this._onTouchTapBtnBack },
                { ui: this._btnAddRule,             callback: this._onTouchedBtnAddRule },
                { ui: this._btnDelete,              callback: this._onTouchedBtnDelete },
                { ui: this._btnHelpHasFog,          callback: this._onTouchedBtnHelpHasFog },
                { ui: this._btnModifyHasFog,        callback: this._onTouchedBtnModifyHasFog },
                { ui: this._btnModifyWeather,       callback: this._onTouchedBtnModifyWeather },
                { ui: this._btnModifyRuleName,      callback: this._onTouchedBtnModifyRuleName },
                { ui: this._btnAvailabilityMcw,     callback: this._onTouchedBtnAvailabilityMcw },
                { ui: this._btnAvailabilityScw,     callback: this._onTouchedBtnAvailabilityScw },
                { ui: this._btnAvailabilityMrw,     callback: this._onTouchedBtnAvailabilityMrw },
                { ui: this._btnAvailabilityCcw,     callback: this._onTouchedBtnAvailabilityCcw },
                { ui: this._btnAvailabilitySrw,     callback: this._onTouchedBtnAvailabilitySrw },
                { ui: this._btnEditWarEvent,        callback: this._onTouchedBtnEditWarEvent },
                { ui: this._btnAddWarEvent,         callback: this._onTouchedBtnAddWarEvent },
                { ui: this._btnTestWarEvent,        callback: this._onTouchedBtnTestWarEvent },
            ]);
            this._setIsTouchMaskEnabled();
            this._setIsCloseOnTouchedMask();

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

        private _getWar(): MeWar {
            return Helpers.getExisted(MeModel.getWar());
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Callbacks.
        ////////////////////////////////////////////////////////////////////////////////
        private _onNotifyLanguageChanged(): void {
            this._updateComponentsForLanguage();
        }

        private _onNotifyMeWarEventIdArrayChanged(): void {
            this._updateListWarEvent();
        }

        private _onTouchTapBtnBack(): void {
            this.close();
        }

        private _onTouchedBtnDelete(): void {
            const selectedRule = this._selectedRule;
            if (selectedRule != null) {
                const war = this._getWar();
                if (war.getWarRuleArray().length <= 1) {
                    FloatText.show(Lang.getText(LangTextType.A0096));
                } else {
                    TwnsPanelManager.open(TwnsPanelConfig.Dict.CommonConfirmPanel, {
                        content : Lang.getText(LangTextType.A0097),
                        callback: () => {
                            war.deleteWarRule(Helpers.getExisted(selectedRule.ruleId));
                            this._resetView();
                        },
                    });
                }
            }
        }

        private _onTouchedBtnAddRule(): void {
            const war = this._getWar();
            if (war.getWarRuleArray().length >= CommonConstants.WarRuleMaxCount) {
                FloatText.show(Lang.getText(LangTextType.A0099));
            } else {
                war.addWarRule();
                this._resetView();
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
            if ((rule) && (!this._getWar().getIsReviewingMap())) {
                WarRuleHelpers.setHasFogByDefault(rule, !WarRuleHelpers.getHasFogByDefault(rule));
                this._updateImgHasFog(rule);
            }
        }

        private _onTouchedBtnModifyWeather(): void {
            const rule  = this._selectedRule;
            const war   = this._getWar();
            if ((rule) && (!war.getIsReviewingMap())) {
                WarRuleHelpers.tickDefaultWeatherType(rule, war.getGameConfig());
                this._updateLabelWeather(rule);
            }
        }

        private _onTouchedBtnModifyRuleName(): void {
            const rule = this._selectedRule;
            if ((rule) && (!this._getWar().getIsReviewingMap())) {
                TwnsPanelManager.open(TwnsPanelConfig.Dict.CommonModifyWarRuleNamePanel, {
                    rule,
                    callback    : () => {
                        this._updateLabelRuleName(rule);
                    }
                });
            }
        }

        private _onTouchedBtnAvailabilityMcw(): void {
            const rule = this._selectedRule;
            if ((rule) && (!this._getWar().getIsReviewingMap())) {
                const ruleAvailability  = Helpers.getExisted(rule.ruleAvailability);
                ruleAvailability.canMcw = !ruleAvailability.canMcw;
                this._updateImgAvailabilityMcw(rule);
            }
        }

        private _onTouchedBtnAvailabilityScw(): void {
            const rule = this._selectedRule;
            if ((rule) && (!this._getWar().getIsReviewingMap())) {
                const ruleAvailability  = Helpers.getExisted(rule.ruleAvailability);
                ruleAvailability.canScw = !ruleAvailability.canScw;
                this._updateImgAvailabilityScw(rule);
            }
        }

        private _onTouchedBtnAvailabilityMrw(): void {
            const rule = this._selectedRule;
            if ((rule) && (!this._getWar().getIsReviewingMap())) {
                const ruleAvailability  = Helpers.getExisted(rule.ruleAvailability);
                ruleAvailability.canMrw = !ruleAvailability.canMrw;
                this._updateImgAvailabilityMrw(rule);
            }
        }

        private _onTouchedBtnAvailabilityCcw(): void {
            const rule = this._selectedRule;
            if ((rule) && (!this._getWar().getIsReviewingMap())) {
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
            if ((rule) && (!this._getWar().getIsReviewingMap())) {
                const ruleAvailability  = Helpers.getExisted(rule.ruleAvailability);
                ruleAvailability.canSrw = !ruleAvailability.canSrw;
                this._updateImgAvailabilitySrw(rule);
            }
        }

        private _onTouchedBtnEditWarEvent(): void {
            TwnsPanelManager.open(TwnsPanelConfig.Dict.WeEventListPanel, {
                war: this._getWar(),
            });
            this.close();
        }

        private _onTouchedBtnAddWarEvent(): void {
            const warRule = this._selectedRule;
            if (warRule) {
                TwnsPanelManager.open(TwnsPanelConfig.Dict.MeAddWarEventToRulePanel, {
                    warRule,
                    warEventArray   : this._getWar().getWarEventManager().getWarEventFullData()?.eventArray ?? [],
                });
            }
        }

        private _onTouchedBtnTestWarEvent(): void {
            const testData: CommonProto.Map.IWarEventFullData = {
                conditionArray: [                        // 条件列表
                    {
                        WecCommonData: {
                            conditionId : 1,
                        },
                        WecTurnPhaseEqualTo : {
                            isNot       : false,
                            valueEqualTo: Types.TurnPhaseCode.Main,
                        },
                    },
                    {
                        WecCommonData: {
                            conditionId: 2,
                        },
                        WecPlayerIndexInTurnEqualTo: {
                            isNot       : false,
                            valueEqualTo: 2,
                        },
                    },
                    {
                        WecCommonData: {
                            conditionId : 3,            // 条件id
                        },
                        WecTurnIndexLessThan: {
                            isNot           : false,
                            valueLessThan   : 3,
                        },
                    },
                    {
                        WecCommonData: {
                            conditionId : 4,
                        },
                        WecTurnIndexGreaterThan: {
                            isNot               : false,
                            valueGreaterThan    : 5,
                        },
                    },
                ],
                conditionNodeArray: [                    // 条件组合节点，用于对上面的条件进行排列组合
                    {
                        nodeId          : 1,
                        isAnd           : true,
                        subNodeIdArray  : [3],
                        conditionIdArray: [1],
                    },
                    {
                        nodeId          : 2,
                        isAnd           : true,
                        subNodeIdArray  : [3],
                        conditionIdArray: [1, 2],
                    },
                    {
                        nodeId          : 3,
                        isAnd           : false,
                        subNodeIdArray  : null,
                        conditionIdArray: [3, 4],
                    }
                ],
                actionArray: [                          // 动作列表
                    // {
                    //     WeaCommonData: {
                    //         actionId    : 1,            // 动作id
                    //     },
                    //     WeaAddUnit: {        // 增加部队
                    //         unitArray: [
                    //             {
                    //                 canBeBlockedByUnit  : false,    // 是否会被指定位置的已有部队阻断增援
                    //                 needMovableTile     : true,     // 是否自动寻找合适的地形，比如海军不在陆地上刷出
                    //                 unitData            : {         // 部队属性
                    //                     gridIndex       : { x: 10, y: 1 },
                    //                     unitType        : 8,
                    //                     playerIndex     : 2,
                    //                     currentHp       : 89,
                    //                 },
                    //             }
                    //         ],
                    //     },
                    // },
                    {
                        WeaCommonData: {
                            actionId    : 1,
                        },
                        WeaDialogue: {
                            dataArray: [
                                {
                                    dataForCoDialogue   : {
                                        coId        : 10001,
                                        side        : Types.WarEventActionDialogueSide.Left,
                                        textArray   : [
                                            { languageType: Types.LanguageType.Chinese, text: `这是啥10001` },
                                            { languageType: Types.LanguageType.English, text: `Hello World 10001` },
                                        ],
                                    },
                                },
                                {
                                    dataForCoDialogue   : {
                                        coId        : 20001,
                                        side        : Types.WarEventActionDialogueSide.Right,
                                        textArray   : [
                                            { languageType: Types.LanguageType.Chinese, text: `这是啥20001` },
                                            { languageType: Types.LanguageType.English, text: `Hello World 20001` },
                                        ],
                                    },
                                },
                                {
                                    dataForCoDialogue   : {
                                        coId        : 10001,
                                        side        : Types.WarEventActionDialogueSide.Left,
                                        textArray   : [
                                            { languageType: Types.LanguageType.Chinese, text: `这是啥10001-2` },
                                            { languageType: Types.LanguageType.English, text: `Hello World 10001-2` },
                                        ],
                                    },
                                },
                                {
                                    dataForCoDialogue   : {
                                        coId        : 20001,
                                        side        : Types.WarEventActionDialogueSide.Right,
                                        textArray   : [
                                            { languageType: Types.LanguageType.Chinese, text: `这是啥20001-2` },
                                            { languageType: Types.LanguageType.English, text: `Hello World 20001-2` },
                                        ],
                                    },
                                },
                            ],
                        },
                    }
                ],
                eventArray: [                            // 事件列表
                    {
                        eventId                     : 1,                // 事件id，在地图规则中被引用
                        eventNameArray              : [
                            { languageType: Types.LanguageType.Chinese, text: `一大坨增援` },
                            { languageType: Types.LanguageType.English, text: `Reinforcement` },
                        ],                                              // 自定义名称
                        maxCallCountInPlayerTurn    : 1,                // 每回合最多1次
                        maxCallCountTotal           : 1,                // 每局最多一次
                        conditionNodeId             : 2,                // 条件组合id，满足时执行动作列表
                        // actionIdArray               : [1, 1, 1, 1, 1, ],// 动作id列表，
                        actionIdArray               : [1],              // 动作id列表，
                        // 动作1是刷出1个坦克，这里指定执行5次，而且坦克不会被已有部队阻断，所以执行时就直接刷出5个坦克
                    },
                    {
                        eventId                     : 2,                // 事件id，在地图规则中被引用
                        eventNameArray              : [
                            { languageType: Types.LanguageType.Chinese, text: `一大坨增援2` },
                            { languageType: Types.LanguageType.English, text: `Reinforcement2` },
                        ],                                              // 自定义名称
                        maxCallCountInPlayerTurn    : 1,                // 每回合最多1次
                        maxCallCountTotal           : 1,                // 每局最多一次
                        conditionNodeId             : 1,                // 条件组合id，满足时执行动作列表
                        // actionIdArray               : [1, 1, 1, 1, 1, ],// 动作id列表，
                        actionIdArray               : [1],              // 动作id列表，
                        // 动作1是刷出1个坦克，这里指定执行5次，而且坦克不会被已有部队阻断，所以执行时就直接刷出5个坦克
                    },
                ],
            };

            this._getWar().getWarEventManager().init({
                warEventFullData: testData,
                calledCountList : null,
            });
            Helpers.getExisted(this._selectedRule).warEventIdArray = [1, 2];
            this._updateListWarEvent();
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Private functions.
        ////////////////////////////////////////////////////////////////////////////////
        private _resetView(): void {
            const canModify                 = !this._getWar().getIsReviewingMap();
            const colorForButtons           = canModify ? 0x00FF00 : 0xFFFFFF;
            this._btnDelete.visible         = canModify;
            this._btnAddRule.visible        = canModify;
            this._btnAddWarEvent.visible    = canModify;
            this._btnEditWarEvent.visible   = canModify;
            this._btnTestWarEvent.visible   = window.CLIENT_VERSION === "DEVELOP";
            this._btnBack.setTextColor(0x00FF00);
            this._btnAvailabilityMcw.setTextColor(colorForButtons);
            this._btnAvailabilityMrw.setTextColor(colorForButtons);
            this._btnAvailabilityCcw.setTextColor(colorForButtons);
            this._btnAvailabilityScw.setTextColor(colorForButtons);
            this._btnAvailabilitySrw.setTextColor(colorForButtons);
            this._btnModifyHasFog.setTextColor(colorForButtons);
            this._btnModifyWeather.setTextColor(colorForButtons);
            this._btnDelete.setTextColor(0xFF0000);
            this._btnAddRule.setTextColor(colorForButtons);
            this._btnModifyRuleName.setTextColor(colorForButtons);

            this._dataForListWarRule = this._createDataForListWarRule();
            this._listWarRule.bindData(this._dataForListWarRule);
            this.setSelectedIndex(0);
        }

        private _updateComponentsForLanguage(): void {
            this._labelMenuTitle.text           = Lang.getText(LangTextType.B0314);
            this._labelAvailability.text        = Lang.getText(LangTextType.B0406);
            this._labelPlayerList.text          = Lang.getText(LangTextType.B0407);
            this._btnAvailabilityMcw.label      = Lang.getText(LangTextType.B0137);
            this._btnAvailabilityScw.label      = Lang.getText(LangTextType.B0138);
            this._btnAvailabilityMrw.label      = Lang.getText(LangTextType.B0404);
            this._btnAvailabilityCcw.label      = Lang.getText(LangTextType.B0619);
            this._btnAvailabilitySrw.label      = Lang.getText(LangTextType.B0614);
            this._btnBack.label                 = Lang.getText(LangTextType.B0146);
            this._btnDelete.label               = Lang.getText(LangTextType.B0220);
            this._btnAddRule.label              = Lang.getText(LangTextType.B0320);
            this._btnModifyRuleName.label       = Lang.getText(LangTextType.B0315);
            this._btnModifyHasFog.label         = Lang.getText(LangTextType.B0020);
            this._btnModifyWeather.label        = Lang.getText(LangTextType.B0705);
            this._labelWarEventListTitle.text   = Lang.getText(LangTextType.B0461);
            this._btnAddWarEvent.label          = Lang.getText(LangTextType.B0320);
            this._btnEditWarEvent.label         = Lang.getText(LangTextType.B0465);
        }

        private _createDataForListWarRule(): DataForWarRuleNameRenderer[] {
            const data  : DataForWarRuleNameRenderer[] = [];
            let index   = 0;
            for (const rule of this._getWar().getWarRuleArray()) {
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
            this._updateListWarEvent();
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
        private _updateImgAvailabilityScw(rule: IWarRule | null ): void {
            this._imgAvailabilityScw.visible = rule ? !!rule.ruleAvailability?.canScw : false;
        }
        private _updateImgAvailabilityMrw(rule: IWarRule | null): void {
            this._imgAvailabilityMrw.visible = rule ? !!rule.ruleAvailability?.canMrw : false;
        }
        private _updateImgAvailabilityCcw(rule: IWarRule | null): void {
            this._imgAvailabilityCcw.visible = rule ? !!rule.ruleAvailability?.canCcw : false;
        }
        private _updateImgAvailabilitySrw(rule: IWarRule | null): void {
            this._imgAvailabilitySrw.visible = rule ? !!rule.ruleAvailability?.canSrw : false;
        }
        private _updateListWarEvent(): void {
            const dataArray         : DataForWarEventRenderer[] = [];
            const warRule           = Helpers.getExisted(this._selectedRule);
            const warEventManager   = this._getWar().getWarEventManager();
            for (const warEventId of warRule.warEventIdArray || []) {
                dataArray.push({
                    panel   : this,
                    warEventManager,
                    warEventId,
                    warRule,
                });
            }
            this._listWarEvent.bindData(dataArray);
        }
        private _updateListPlayerRule(rule: IWarRule | null): void {
            const listPlayer = this._listPlayer;
            if (rule == null) {
                listPlayer.clear();
                return;
            }

            const playerRuleDataList = rule.ruleForPlayers?.playerRuleDataArray;
            if ((!playerRuleDataList) || (!playerRuleDataList.length)) {
                listPlayer.clear();
            } else {
                const dataList              : DataForPlayerRenderer[] = [];
                const playersCountUnneutral = (this._getWar().getField() as MeField).getMaxPlayerIndex();
                let index                   = 0;
                for (const playerRule of playerRuleDataList) {
                    if (Helpers.getExisted(playerRule.playerIndex) <= playersCountUnneutral) {
                        dataList.push({
                            index,
                            playerRule,
                            warRule     : rule,
                            isReviewing : this._getWar().getIsReviewingMap(),
                            panel       : this,
                        });
                        ++index;
                    }
                }
                listPlayer.bindData(dataList);
            }
        }
    }

    type DataForWarRuleNameRenderer = {
        index   : number;
        rule    : IWarRule;
        panel   : MeWarRulePanel;
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
        panel       : MeWarRulePanel;
    };
    class PlayerRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForPlayerRenderer> {
        private readonly _listInfo! : TwnsUiScrollList.UiScrollList<DataForInfoRenderer>;

        protected _onOpened(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.MeBannedCoIdArrayChanged, callback: this._onNotifyMeBannedCoIdArrayChanged },
            ]);
            this._listInfo.setItemRenderer(InfoRenderer);
        }

        protected _onDataChanged(): void {
            this._updateView();
        }

        private _onNotifyMeBannedCoIdArrayChanged(): void {
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
                this._createDataPlayerIndex(warRule, playerRule),
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
        private _createDataPlayerIndex(warRule: IWarRule, playerRule: IDataForPlayerRule): DataForInfoRenderer {
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
            return {
                titleText               : Lang.getText(LangTextType.B0403),
                infoText                : `${(playerRule.bannedCoIdArray || []).length}`,
                infoColor               : 0xFFFFFF,
                callbackOnTouchedTitle  : isReviewing
                    ? null
                    : () => {
                        TwnsPanelManager.open(TwnsPanelConfig.Dict.MeAvailableCoPanel, {
                            warRule,
                            playerRule,
                            isReviewing,
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
                    }
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
            const gameConfig    = Helpers.getExisted(MeModel.getWar()?.getGameConfig());
            return {
                titleText               : Lang.getText(LangTextType.B0644),
                infoText                : coId == null ? `--` : gameConfig.getCoNameAndTierText(coId) ?? CommonConstants.ErrorTextForUndefined,
                infoColor               : coId == null ? 0xFFFFFF : 0x00FF00,
                callbackOnTouchedTitle  : isReviewing
                    ? null
                    : () => {
                        if (!warRule.ruleAvailability?.canCcw) {
                            FloatText.show(Lang.getText(LangTextType.A0221));
                            return;
                        }

                        const coIdArray: number[] = [];
                        for (const cfg of gameConfig.getEnabledCoArray()) {
                            coIdArray.push(cfg.coId);
                        }
                        TwnsPanelManager.open(TwnsPanelConfig.Dict.CommonChooseCoPanel, {
                            gameConfig,
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
            const gameConfig    = Helpers.getExisted(MeModel.getWar()?.getGameConfig());
            return {
                titleText               : Lang.getText(LangTextType.B0815),
                infoText                : coId == null ? `--` : gameConfig.getCoNameAndTierText(coId) ?? CommonConstants.ErrorTextForUndefined,
                infoColor               : coId == null ? 0xFFFFFF : 0x00FF00,
                callbackOnTouchedTitle  : isReviewing
                    ? null
                    : () => {
                        if (!warRule.ruleAvailability?.canSrw) {
                            FloatText.show(Lang.getText(LangTextType.A0276));
                            return;
                        }

                        const coIdArray: number[] = [];
                        for (const cfg of gameConfig.getEnabledCoArray()) {
                            coIdArray.push(cfg.coId);
                        }
                        TwnsPanelManager.open(TwnsPanelConfig.Dict.CommonChooseCoPanel, {
                            gameConfig,
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

    type DataForWarEventRenderer = {
        panel           : MeWarRulePanel;
        warEventManager : BwWarEventManager;
        warEventId      : number;
        warRule         : IWarRule;
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
            const data = this.data;
            if (data) {
                this._labelWarEventName.text = Lang.getLanguageText({ textArray: data.warEventManager.getWarEvent(data.warEventId).eventNameArray }) ?? CommonConstants.ErrorTextForUndefined;
            }
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

// export default TwnsMeWarRulePanel;
