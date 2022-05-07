
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
// import Notify                   from "../../tools/notify/NotifyType";
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
namespace Twns.MapEditor {
    import BwWarEventManager        = BaseWar.BwWarEventManager;
    import MeField                  = MapEditor.MeField;
    import MeWar                    = MapEditor.MeWar;
    import LangTextType             = Lang.LangTextType;
    import NotifyType               = Notify.NotifyType;
    import ITemplateWarRule         = CommonProto.WarRule.ITemplateWarRule;
    import IDataForPlayerRule       = CommonProto.WarRule.IDataForPlayerRule;

    export type OpenDataForMeWarRulePanel = void;
    export class MeWarRulePanel extends TwnsUiPanel.UiPanel<OpenDataForMeWarRulePanel> {
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
        private _selectedRule           : ITemplateWarRule | null = null;

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
                this._selectedRule  = dataList[newIndex].templateWarRule;
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
            return Helpers.getExisted(MapEditor.MeModel.getWar());
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
                if (war.getTemplateWarRuleArray().length <= 1) {
                    Twns.FloatText.show(Lang.getText(LangTextType.A0096));
                } else {
                    PanelHelpers.open(PanelHelpers.PanelDict.CommonConfirmPanel, {
                        content : Lang.getText(LangTextType.A0097),
                        callback: () => {
                            war.deleteTemplateWarRule(Helpers.getExisted(selectedRule.ruleId));
                            this._resetView();
                        },
                    });
                }
            }
        }

        private _onTouchedBtnAddRule(): void {
            const war = this._getWar();
            if (war.getTemplateWarRuleArray().length >= Twns.CommonConstants.WarRuleMaxCount) {
                Twns.FloatText.show(Lang.getText(LangTextType.A0099));
            } else {
                war.addTemplateWarRule();
                this._resetView();
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
            if ((templateWarRule) && (!this._getWar().getIsReviewingMap())) {
                WarHelpers.WarRuleHelpers.setHasFogByDefault(templateWarRule, !WarHelpers.WarRuleHelpers.getHasFogByDefault(templateWarRule));
                this._updateImgHasFog(templateWarRule);
            }
        }

        private _onTouchedBtnModifyWeather(): void {
            const templateWarRule   = this._selectedRule;
            const war               = this._getWar();
            if ((templateWarRule) && (!war.getIsReviewingMap())) {
                WarHelpers.WarRuleHelpers.tickDefaultWeatherType(templateWarRule, war.getGameConfig());
                this._updateLabelWeather(templateWarRule);
            }
        }

        private _onTouchedBtnModifyRuleName(): void {
            const templateWarRule = this._selectedRule;
            if ((templateWarRule) && (!this._getWar().getIsReviewingMap())) {
                PanelHelpers.open(PanelHelpers.PanelDict.CommonModifyWarRuleNamePanel, {
                    templateWarRule,
                    callback        : () => {
                        this._updateLabelRuleName(templateWarRule);
                    }
                });
            }
        }

        private _onTouchedBtnAvailabilityMcw(): void {
            const templateWarRule = this._selectedRule;
            if ((templateWarRule) && (!this._getWar().getIsReviewingMap())) {
                const ruleAvailability  = Helpers.getExisted(templateWarRule.ruleAvailability);
                ruleAvailability.canMcw = !ruleAvailability.canMcw;
                this._updateImgAvailabilityMcw(templateWarRule);
            }
        }

        private _onTouchedBtnAvailabilityScw(): void {
            const templateWarRule = this._selectedRule;
            if ((templateWarRule) && (!this._getWar().getIsReviewingMap())) {
                const ruleAvailability  = Helpers.getExisted(templateWarRule.ruleAvailability);
                ruleAvailability.canScw = !ruleAvailability.canScw;
                this._updateImgAvailabilityScw(templateWarRule);
            }
        }

        private _onTouchedBtnAvailabilityMrw(): void {
            const templateWarRule = this._selectedRule;
            if ((templateWarRule) && (!this._getWar().getIsReviewingMap())) {
                const ruleAvailability  = Helpers.getExisted(templateWarRule.ruleAvailability);
                ruleAvailability.canMrw = !ruleAvailability.canMrw;
                this._updateImgAvailabilityMrw(templateWarRule);
            }
        }

        private _onTouchedBtnAvailabilityCcw(): void {
            const templateWarRule = this._selectedRule;
            if ((templateWarRule) && (!this._getWar().getIsReviewingMap())) {
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
            if ((templateWarRule) && (!this._getWar().getIsReviewingMap())) {
                const ruleAvailability  = Helpers.getExisted(templateWarRule.ruleAvailability);
                ruleAvailability.canSrw = !ruleAvailability.canSrw;
                this._updateImgAvailabilitySrw(templateWarRule);
            }
        }

        private _onTouchedBtnEditWarEvent(): void {
            PanelHelpers.open(PanelHelpers.PanelDict.WeEventListPanel, {
                war: this._getWar(),
            });
            this.close();
        }

        private _onTouchedBtnAddWarEvent(): void {
            const templateWarRule = this._selectedRule;
            if (templateWarRule) {
                PanelHelpers.open(PanelHelpers.PanelDict.MeAddWarEventToRulePanel, {
                    templateWarRule,
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

            Helpers.getExisted(this._getWar().getCommonSettingManager().getSettingsForCommon().instanceWarRule).warEventFullData = testData;
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
            for (const templateWarRule of this._getWar().getTemplateWarRuleArray()) {
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
            this._updateListWarEvent();
            this._updateListPlayerRule(templateWarRule);
        }

        private _updateLabelRuleName(templateWarRule: ITemplateWarRule | null): void {
            this._labelRuleName.text = Lang.concatLanguageTextList(templateWarRule?.ruleNameArray) || Lang.getText(LangTextType.B0001);
        }
        private _updateLabelWeather(templateWarRule: ITemplateWarRule | null): void {
            this._labelWeather.text = Lang.getWeatherName(templateWarRule ? WarHelpers.WarRuleHelpers.getDefaultWeatherType(templateWarRule) : Types.WeatherType.Clear);
        }
        private _updateImgHasFog(templateWarRule: ITemplateWarRule | null): void {
            this._imgHasFog.visible = templateWarRule ? !!templateWarRule.ruleForGlobalParams?.hasFogByDefault : false;
        }
        private _updateImgAvailabilityMcw(templateWarRule: ITemplateWarRule | null): void {
            this._imgAvailabilityMcw.visible = templateWarRule ? !!templateWarRule.ruleAvailability?.canMcw : false;
        }
        private _updateImgAvailabilityScw(templateWarRule: ITemplateWarRule | null ): void {
            this._imgAvailabilityScw.visible = templateWarRule ? !!templateWarRule.ruleAvailability?.canScw : false;
        }
        private _updateImgAvailabilityMrw(templateWarRule: ITemplateWarRule | null): void {
            this._imgAvailabilityMrw.visible = templateWarRule ? !!templateWarRule.ruleAvailability?.canMrw : false;
        }
        private _updateImgAvailabilityCcw(templateWarRule: ITemplateWarRule | null): void {
            this._imgAvailabilityCcw.visible = templateWarRule ? !!templateWarRule.ruleAvailability?.canCcw : false;
        }
        private _updateImgAvailabilitySrw(templateWarRule: ITemplateWarRule | null): void {
            this._imgAvailabilitySrw.visible = templateWarRule ? !!templateWarRule.ruleAvailability?.canSrw : false;
        }
        private _updateListWarEvent(): void {
            const dataArray         : DataForWarEventRenderer[] = [];
            const templateWarRule   = Helpers.getExisted(this._selectedRule);
            const war               = this._getWar();
            const warEventManager   = war.getWarEventManager();
            const isReviewing       = war.getIsReviewingMap();
            for (const warEventId of templateWarRule.warEventIdArray || []) {
                dataArray.push({
                    panel           : this,
                    warEventManager,
                    warEventId,
                    templateWarRule,
                    isReviewing,
                });
            }
            this._listWarEvent.bindData(dataArray);
        }
        private _updateListPlayerRule(templateWarRule: ITemplateWarRule | null): void {
            const listPlayer = this._listPlayer;
            if (templateWarRule == null) {
                listPlayer.clear();
                return;
            }

            const playerRuleDataList = templateWarRule.ruleForPlayers?.playerRuleDataArray;
            if ((!playerRuleDataList) || (!playerRuleDataList.length)) {
                listPlayer.clear();
            } else {
                const dataList              : DataForPlayerRenderer[] = [];
                const war                   = this._getWar();
                const playersCountUnneutral = (war.getField() as MeField).getMaxPlayerIndex();
                const gameConfig            = war.getGameConfig();
                const isReviewing           = war.getIsReviewingMap();
                let index                   = 0;
                for (const playerRule of playerRuleDataList) {
                    if (Helpers.getExisted(playerRule.playerIndex) <= playersCountUnneutral) {
                        dataList.push({
                            index,
                            playerRule,
                            templateWarRule,
                            isReviewing,
                            gameConfig,
                            panel           : this,
                        });
                        ++index;
                    }
                }
                listPlayer.bindData(dataList);
            }
        }
    }

    type DataForWarRuleNameRenderer = {
        index           : number;
        templateWarRule : ITemplateWarRule;
        panel           : MeWarRulePanel;
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
        isReviewing     : boolean;
        gameConfig      : Config.GameConfig;
        panel           : MeWarRulePanel;
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
            const data              = this._getData();
            const templateWarRule   = data.templateWarRule;
            const playerRule        = data.playerRule;
            const isReviewing       = data.isReviewing;
            const gameConfig        = data.gameConfig;
            return [
                this._createDataPlayerIndex(templateWarRule, playerRule),
                this._createDataTeamIndex(templateWarRule, playerRule, isReviewing),
                this._createDataBannedCoIdArray(templateWarRule, playerRule, isReviewing, gameConfig),
                this._createDataBannedUnitTypeArray(templateWarRule, playerRule, isReviewing, gameConfig),
                this._createDataCanActivateCoSkill(templateWarRule, playerRule, isReviewing),
                this._createDataInitialFund(templateWarRule, playerRule, isReviewing),
                this._createDataIncomeMultiplier(templateWarRule, playerRule, isReviewing),
                this._createDataEnergyAddPctOnLoadCo(templateWarRule, playerRule, isReviewing),
                this._createDataEnergyGrowthMultiplier(templateWarRule, playerRule, isReviewing),
                this._createDataMoveRangeModifier(templateWarRule, playerRule, isReviewing),
                this._createDataAttackPowerModifier(templateWarRule, playerRule, isReviewing),
                this._createDataVisionRangeModifier(templateWarRule, playerRule, isReviewing),
                this._createDataLuckLowerLimit(templateWarRule, playerRule, isReviewing),
                this._createDataLuckUpperLimit(templateWarRule, playerRule, isReviewing),
                this._createDataIsControlledByAiInCcw(templateWarRule, playerRule, isReviewing),
                this._createDataAiCoIdInCcw(templateWarRule, playerRule, isReviewing),
                this._createDataIsControlledByAiInSrw(templateWarRule, playerRule, isReviewing),
                this._createDataAiCoIdInSrw(templateWarRule, playerRule, isReviewing),
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
        private _createDataTeamIndex(templateWarRule: ITemplateWarRule, playerRule: IDataForPlayerRule, isReviewing: boolean): DataForInfoRenderer {
            return {
                titleText               : Lang.getText(LangTextType.B0019),
                infoText                : Lang.getPlayerTeamName(Helpers.getExisted(playerRule.teamIndex)) ?? Twns.CommonConstants.ErrorTextForUndefined,
                infoColor               : 0xFFFFFF,
                callbackOnTouchedTitle  : isReviewing
                    ? null
                    : () => {
                        WarHelpers.WarRuleHelpers.tickTeamIndex(templateWarRule, Helpers.getExisted(playerRule.playerIndex));
                        this._updateView();
                    },
            };
        }
        private _createDataBannedCoIdArray(templateWarRule: ITemplateWarRule, playerRule: IDataForPlayerRule, isReviewing: boolean, gameConfig: Config.GameConfig): DataForInfoRenderer {
            const currentBannedCoIdArray    = playerRule.bannedCoIdArray ?? [];
            const bannedCoIdsCount          = currentBannedCoIdArray.length;
            return {
                titleText               : Lang.getText(LangTextType.B0403),
                infoText                : `${bannedCoIdsCount}`,
                infoColor               : bannedCoIdsCount <= 0 ? 0xFFFFFF : 0xFF0000,
                callbackOnTouchedTitle  : () => PanelHelpers.open(PanelHelpers.PanelDict.CommonChooseCoPanel, {
                    gameConfig,
                    currentCoIdArray        : currentBannedCoIdArray,
                    forceUnchosenCoIdArray  : [Twns.CommonConstants.CoEmptyId],
                    callbackOnConfirm       : isReviewing
                        ? null
                        : (bannedCoIdArray => {
                            WarHelpers.WarRuleHelpers.setBannedCoIdArray(templateWarRule, Helpers.getExisted(playerRule.playerIndex), new Set(bannedCoIdArray));
                            this._updateView();
                        }),
                }),
            };
        }
        private _createDataBannedUnitTypeArray(templateWarRule: ITemplateWarRule, playerRule: IDataForPlayerRule, isReviewing: boolean, gameConfig: Config.GameConfig): DataForInfoRenderer {
            const currentBannedUnitTypeArray = playerRule.bannedUnitTypeArray ?? [];
            return {
                titleText               : Lang.getText(LangTextType.B0895),
                infoText                : `${currentBannedUnitTypeArray.length}`,
                infoColor               : currentBannedUnitTypeArray.length <= 0 ? 0xFFFFFF : 0xFF0000,
                callbackOnTouchedTitle  : () => {
                    PanelHelpers.open(PanelHelpers.PanelDict.CommonChooseUnitTypePanel, {
                        gameConfig,
                        currentUnitTypeArray    : currentBannedUnitTypeArray,
                        callbackOnConfirm       : isReviewing
                            ? null
                            : bannedUnitTypeArray => {
                                WarHelpers.WarRuleHelpers.setBannedUnitTypeArray(templateWarRule, Helpers.getExisted(playerRule.playerIndex), bannedUnitTypeArray);
                                this._updateView();
                            },
                    });
                },
            };
        }
        private _createDataCanActivateCoSkill(templateWarRule: ITemplateWarRule, playerRule: IDataForPlayerRule, isReviewing: boolean): DataForInfoRenderer {
            const canActivate = playerRule.canActivateCoSkill !== false;
            return {
                titleText               : Lang.getText(LangTextType.B0897),
                infoText                : Lang.getText(canActivate ? LangTextType.B0012 : LangTextType.B0013),
                infoColor               : canActivate ? 0xFFFFFF : 0xFF0000,
                callbackOnTouchedTitle  : isReviewing
                    ? null
                    : () => {
                        WarHelpers.WarRuleHelpers.setCanActivateCoSkill(templateWarRule, Helpers.getExisted(playerRule.playerIndex), !canActivate);
                        this._updateView();
                    },
            };
        }
        private _createDataInitialFund(templateWarRule: ITemplateWarRule, playerRule: IDataForPlayerRule, isReviewing: boolean): DataForInfoRenderer {
            const currValue = Helpers.getExisted(playerRule.initialFund);
            return {
                titleText               : Lang.getText(LangTextType.B0178),
                infoText                : `${currValue}`,
                infoColor               : getTextColor(currValue, Twns.CommonConstants.WarRuleInitialFundDefault),
                callbackOnTouchedTitle  : isReviewing
                    ? null
                    : () => {
                        const maxValue  = Twns.CommonConstants.WarRuleInitialFundMaxLimit;
                        const minValue  = Twns.CommonConstants.WarRuleInitialFundMinLimit;
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
                    }
            };
        }
        private _createDataIncomeMultiplier(templateWarRule: ITemplateWarRule, playerRule: IDataForPlayerRule, isReviewing: boolean): DataForInfoRenderer {
            const currValue = Helpers.getExisted(playerRule.incomeMultiplier);
            return {
                titleText               : Lang.getText(LangTextType.B0179),
                infoText                : `${currValue}%`,
                infoColor               : getTextColor(currValue, Twns.CommonConstants.WarRuleIncomeMultiplierDefault),
                callbackOnTouchedTitle  : isReviewing
                    ? null
                    : () => {
                        const maxValue  = Twns.CommonConstants.WarRuleIncomeMultiplierMaxLimit;
                        const minValue  = Twns.CommonConstants.WarRuleIncomeMultiplierMinLimit;
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
        private _createDataEnergyAddPctOnLoadCo(templateWarRule: ITemplateWarRule, playerRule: IDataForPlayerRule, isReviewing: boolean): DataForInfoRenderer {
            const currValue = Helpers.getExisted(playerRule.energyAddPctOnLoadCo);
            return {
                titleText               : Lang.getText(LangTextType.B0180),
                infoText                : `${currValue}%`,
                infoColor               : getTextColor(currValue, Twns.CommonConstants.WarRuleEnergyAddPctOnLoadCoDefault),
                callbackOnTouchedTitle  : isReviewing
                    ? null
                    : () => {
                        const minValue      = Twns.CommonConstants.WarRuleEnergyAddPctOnLoadCoMinLimit;
                        const maxValue      = Twns.CommonConstants.WarRuleEnergyAddPctOnLoadCoMaxLimit;
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
        private _createDataEnergyGrowthMultiplier(templateWarRule: ITemplateWarRule, playerRule: IDataForPlayerRule, isReviewing: boolean): DataForInfoRenderer {
            const currValue = Helpers.getExisted(playerRule.energyGrowthMultiplier);
            return {
                titleText               : Lang.getText(LangTextType.B0181),
                infoText                : `${currValue}%`,
                infoColor               : getTextColor(currValue, Twns.CommonConstants.WarRuleEnergyGrowthMultiplierDefault),
                callbackOnTouchedTitle  : isReviewing
                    ? null
                    : () => {
                        const minValue      = Twns.CommonConstants.WarRuleEnergyGrowthMultiplierMinLimit;
                        const maxValue      = Twns.CommonConstants.WarRuleEnergyGrowthMultiplierMaxLimit;
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
        private _createDataMoveRangeModifier(templateWarRule: ITemplateWarRule, playerRule: IDataForPlayerRule, isReviewing: boolean): DataForInfoRenderer {
            const currValue = Helpers.getExisted(playerRule.moveRangeModifier);
            return {
                titleText               : Lang.getText(LangTextType.B0182),
                infoText                : `${currValue}`,
                infoColor               : getTextColor(currValue, Twns.CommonConstants.WarRuleMoveRangeModifierDefault),
                callbackOnTouchedTitle  : isReviewing
                    ? null
                    : () => {
                        const minValue      = Twns.CommonConstants.WarRuleMoveRangeModifierMinLimit;
                        const maxValue      = Twns.CommonConstants.WarRuleMoveRangeModifierMaxLimit;
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
        private _createDataAttackPowerModifier(templateWarRule: ITemplateWarRule, playerRule: IDataForPlayerRule, isReviewing: boolean): DataForInfoRenderer {
            const currValue = Helpers.getExisted(playerRule.attackPowerModifier);
            return {
                titleText               : Lang.getText(LangTextType.B0183),
                infoText                : `${currValue}%`,
                infoColor               : getTextColor(currValue, Twns.CommonConstants.WarRuleOffenseBonusDefault),
                callbackOnTouchedTitle  : isReviewing
                    ? null
                    : () => {
                        const minValue      = Twns.CommonConstants.WarRuleOffenseBonusMinLimit;
                        const maxValue      = Twns.CommonConstants.WarRuleOffenseBonusMaxLimit;
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
        private _createDataVisionRangeModifier(templateWarRule: ITemplateWarRule, playerRule: IDataForPlayerRule, isReviewing: boolean): DataForInfoRenderer {
            const currValue = Helpers.getExisted(playerRule.visionRangeModifier);
            return {
                titleText               : Lang.getText(LangTextType.B0184),
                infoText                : `${currValue}`,
                infoColor               : getTextColor(currValue, Twns.CommonConstants.WarRuleVisionRangeModifierDefault),
                callbackOnTouchedTitle  : isReviewing
                    ? null
                    : () => {
                        const minValue      = Twns.CommonConstants.WarRuleVisionRangeModifierMinLimit;
                        const maxValue      = Twns.CommonConstants.WarRuleVisionRangeModifierMaxLimit;
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
        private _createDataLuckLowerLimit(templateWarRule: ITemplateWarRule, playerRule: IDataForPlayerRule, isReviewing: boolean): DataForInfoRenderer {
            const currValue     = Helpers.getExisted(playerRule.luckLowerLimit);
            const playerIndex   = Helpers.getExisted(playerRule.playerIndex);
            return {
                titleText               : Lang.getText(LangTextType.B0189),
                infoText                : `${currValue}%`,
                infoColor               : getTextColor(currValue, Twns.CommonConstants.WarRuleLuckDefaultLowerLimit),
                callbackOnTouchedTitle  : isReviewing
                    ? null
                    : () => {
                        const minValue      = Twns.CommonConstants.WarRuleLuckMinLimit;
                        const maxValue      = Twns.CommonConstants.WarRuleLuckMaxLimit;
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
        private _createDataLuckUpperLimit(templateWarRule: ITemplateWarRule, playerRule: IDataForPlayerRule, isReviewing: boolean): DataForInfoRenderer {
            const currValue     = Helpers.getExisted(playerRule.luckUpperLimit);
            const playerIndex   = Helpers.getExisted(playerRule.playerIndex);
            return {
                titleText               : Lang.getText(LangTextType.B0190),
                infoText                : `${currValue}%`,
                infoColor               : getTextColor(currValue, Twns.CommonConstants.WarRuleLuckDefaultUpperLimit),
                callbackOnTouchedTitle  : isReviewing
                    ? null
                    : () => {
                        const minValue      = Twns.CommonConstants.WarRuleLuckMinLimit;
                        const maxValue      = Twns.CommonConstants.WarRuleLuckMaxLimit;
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
        private _createDataIsControlledByAiInCcw(templateWarRule: ITemplateWarRule, playerRule: IDataForPlayerRule, isReviewing: boolean): DataForInfoRenderer {
            const isControlledByAi = playerRule.fixedCoIdInCcw != null;
            return {
                titleText               : Lang.getText(LangTextType.B0645),
                infoText                : Lang.getText(isControlledByAi ? LangTextType.B0012 : LangTextType.B0013),
                infoColor               : isControlledByAi ? 0x00FF00 : 0xFFFFFF,
                callbackOnTouchedTitle  : isReviewing
                    ? null
                    : () => {
                        if (!templateWarRule.ruleAvailability?.canCcw) {
                            Twns.FloatText.show(Lang.getText(LangTextType.A0221));
                            return;
                        }

                        const playerIndex = Helpers.getExisted(playerRule.playerIndex);
                        if (isControlledByAi) {
                            WarHelpers.WarRuleHelpers.setFixedCoIdInCcw(templateWarRule, playerIndex, null);
                        } else {
                            WarHelpers.WarRuleHelpers.setFixedCoIdInCcw(templateWarRule, playerIndex, Twns.CommonConstants.CoEmptyId);
                        }
                        this._updateView();
                    },
            };
        }
        private _createDataAiCoIdInCcw(templateWarRule: ITemplateWarRule, playerRule: IDataForPlayerRule, isReviewing: boolean): DataForInfoRenderer {
            const coId          = playerRule.fixedCoIdInCcw;
            const gameConfig    = Helpers.getExisted(MapEditor.MeModel.getWar()?.getGameConfig());
            return {
                titleText               : Lang.getText(LangTextType.B0644),
                infoText                : coId == null ? `--` : gameConfig.getCoNameAndTierText(coId) ?? Twns.CommonConstants.ErrorTextForUndefined,
                infoColor               : coId == null ? 0xFFFFFF : 0x00FF00,
                callbackOnTouchedTitle  : isReviewing
                    ? null
                    : () => {
                        if (!templateWarRule.ruleAvailability?.canCcw) {
                            Twns.FloatText.show(Lang.getText(LangTextType.A0221));
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
        private _createDataIsControlledByAiInSrw(templateWarRule: ITemplateWarRule, playerRule: IDataForPlayerRule, isReviewing: boolean): DataForInfoRenderer {
            const isControlledByAi = playerRule.fixedCoIdInSrw != null;
            return {
                titleText               : Lang.getText(LangTextType.B0816),
                infoText                : Lang.getText(isControlledByAi ? LangTextType.B0012 : LangTextType.B0013),
                infoColor               : isControlledByAi ? 0x00FF00 : 0xFFFFFF,
                callbackOnTouchedTitle  : isReviewing
                    ? null
                    : () => {
                        if (!templateWarRule.ruleAvailability?.canSrw) {
                            Twns.FloatText.show(Lang.getText(LangTextType.A0276));
                            return;
                        }

                        const playerIndex = Helpers.getExisted(playerRule.playerIndex);
                        if (isControlledByAi) {
                            WarHelpers.WarRuleHelpers.setFixedCoIdInSrw(templateWarRule, playerIndex, null);
                        } else {
                            WarHelpers.WarRuleHelpers.setFixedCoIdInSrw(templateWarRule, playerIndex, Twns.CommonConstants.CoEmptyId);
                        }
                        this._updateView();
                    },
            };
        }
        private _createDataAiCoIdInSrw(templateWarRule: ITemplateWarRule, playerRule: IDataForPlayerRule, isReviewing: boolean): DataForInfoRenderer {
            const coId          = playerRule.fixedCoIdInSrw;
            const gameConfig    = Helpers.getExisted(MapEditor.MeModel.getWar()?.getGameConfig());
            return {
                titleText               : Lang.getText(LangTextType.B0815),
                infoText                : coId == null ? `--` : gameConfig.getCoNameAndTierText(coId) ?? Twns.CommonConstants.ErrorTextForUndefined,
                infoColor               : coId == null ? 0xFFFFFF : 0x00FF00,
                callbackOnTouchedTitle  : isReviewing
                    ? null
                    : () => {
                        if (!templateWarRule.ruleAvailability?.canSrw) {
                            Twns.FloatText.show(Lang.getText(LangTextType.A0276));
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
        isReviewing     : boolean;
        templateWarRule : ITemplateWarRule;
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
            const isReviewing           = data.isReviewing;
            this._btnUp.visible         = !isReviewing;
            this._btnDown.visible       = !isReviewing;
            this._btnDelete.visible     = !isReviewing;
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
                this._labelWarEventName.text = Lang.getLanguageText({ textArray: data.warEventManager.getWarEvent(data.warEventId).eventNameArray }) ?? Twns.CommonConstants.ErrorTextForUndefined;
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
