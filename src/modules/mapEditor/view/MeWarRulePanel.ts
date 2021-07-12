
import { TwnsUiImage }                      from "../../../utility/ui/UiImage";
import { TwnsUiListItemRenderer }           from "../../../utility/ui/UiListItemRenderer";
import { TwnsUiPanel }                      from "../../../utility/ui/UiPanel";
import { TwnsUiButton }                      from "../../../utility/ui/UiButton";
import { TwnsUiLabel }                      from "../../../utility/ui/UiLabel";
import { TwnsUiScrollList }                 from "../../../utility/ui/UiScrollList";
import { CommonConfirmPanel }           from "../../common/view/CommonConfirmPanel";
import { CommonHelpPanel }              from "../../common/view/CommonHelpPanel";
import { CommonInputPanel }             from "../../common/view/CommonInputPanel";
import { BwWarEventManager }            from "../../baseWar/model/BwWarEventManager";
import { MeField }                      from "../model/MeField";
import { MeWar }                        from "../model/MeWar";
import { MeWarMenuPanel }               from "./MeWarMenuPanel";
import { CommonChooseCoPanel }          from "../../common/view/CommonChooseCoPanel";
import { MeAvailableCoPanel }           from "./MeAvailableCoPanel";
import { MeAddWarEventToRulePanel }     from "./MeAddWarEventToRulePanel";
import { MeModifyRuleNamePanel }        from "./MeModifyRuleNamePanel";
import { WeEventListPanel }             from "../../warEvent/view/WeEventListPanel";
import { CommonConstants }              from "../../../utility/CommonConstants";
import { ConfigManager }                from "../../../utility/ConfigManager";
import { FloatText }                    from "../../../utility/FloatText";
import { Lang }                         from "../../../utility/lang/Lang";
import { TwnsLangTextType } from "../../../utility/lang/LangTextType";
import LangTextType         = TwnsLangTextType.LangTextType;
import { Notify }                       from "../../../utility/notify/Notify";
import { TwnsNotifyType } from "../../../utility/notify/NotifyType";
import NotifyType       = TwnsNotifyType.NotifyType;
import { ProtoTypes }                   from "../../../utility/proto/ProtoTypes";
import { Types }                        from "../../../utility/Types";
import { BwWarRuleHelpers }              from "../../baseWar/model/BwWarRuleHelpers";
import { MeModel }                      from "../model/MeModel";
import IWarRule                         = ProtoTypes.WarRule.IWarRule;
import IDataForPlayerRule               = ProtoTypes.WarRule.IDataForPlayerRule;

export class MeWarRulePanel extends TwnsUiPanel.UiPanel<void> {
    protected readonly _LAYER_TYPE   = Types.LayerType.Hud0;
    protected readonly _IS_EXCLUSIVE = false;

    private static _instance: MeWarRulePanel;

    private _labelMenuTitle         : TwnsUiLabel.UiLabel;
    private _listWarRule            : TwnsUiScrollList.UiScrollList<DataForWarRuleNameRenderer>;
    private _btnAddRule             : TwnsUiButton.UiButton;
    private _btnDelete              : TwnsUiButton.UiButton;
    private _btnBack                : TwnsUiButton.UiButton;

    private _btnModifyRuleName      : TwnsUiButton.UiButton;
    private _labelRuleName          : TwnsUiLabel.UiLabel;

    private _btnModifyHasFog        : TwnsUiButton.UiButton;
    private _imgHasFog              : TwnsUiImage.UiImage;
    private _btnHelpHasFog          : TwnsUiButton.UiButton;

    private _labelAvailability      : TwnsUiLabel.UiLabel;
    private _btnAvailabilityMcw     : TwnsUiButton.UiButton;
    private _imgAvailabilityMcw     : TwnsUiImage.UiImage;
    private _btnAvailabilityScw     : TwnsUiButton.UiButton;
    private _imgAvailabilityScw     : TwnsUiImage.UiImage;
    private _btnAvailabilityMrw     : TwnsUiButton.UiButton;
    private _imgAvailabilityMrw     : TwnsUiImage.UiImage;
    private _btnAvailabilityCcw     : TwnsUiButton.UiButton;
    private _imgAvailabilityCcw     : TwnsUiImage.UiImage;
    private _btnAvailabilitySrw     : TwnsUiButton.UiButton;
    private _imgAvailabilitySrw     : TwnsUiImage.UiImage;

    private _labelWarEventListTitle : TwnsUiLabel.UiLabel;
    private _btnTestWarEvent        : TwnsUiButton.UiButton;
    private _btnAddWarEvent         : TwnsUiButton.UiButton;
    private _btnEditWarEvent        : TwnsUiButton.UiButton;
    private _listWarEvent           : TwnsUiScrollList.UiScrollList<DataForWarEventRenderer>;

    private _labelPlayerList        : TwnsUiLabel.UiLabel;
    private _listPlayer             : TwnsUiScrollList.UiScrollList<DataForPlayerRenderer>;

    private _war                    : MeWar;
    private _dataForListWarRule     : DataForWarRuleNameRenderer[] = [];
    private _selectedIndex          : number;
    private _selectedRule           : IWarRule;

    public static show(): void {
        if (!MeWarRulePanel._instance) {
            MeWarRulePanel._instance = new MeWarRulePanel();
        }
        MeWarRulePanel._instance.open(undefined);
    }
    public static async hide(): Promise<void> {
        if (MeWarRulePanel._instance) {
            await MeWarRulePanel._instance.close();
        }
    }
    public static getIsOpening(): boolean {
        const instance = MeWarRulePanel._instance;
        return instance ? instance.getIsOpening() : false;
    }

    public constructor() {
        super();

        this._setIsTouchMaskEnabled();
        this.skinName = "resource/skins/mapEditor/MeWarRulePanel.exml";
    }

    protected _onOpened(): void {
        this._setNotifyListenerArray([
            { type: NotifyType.LanguageChanged,            callback: this._onNotifyLanguageChanged },
            { type: NotifyType.MeWarRuleNameChanged,       callback: this._onNotifyMeWarRuleNameChanged },
            { type: NotifyType.MeWarEventIdArrayChanged,   callback: this._onNotifyMeWarEventIdArrayChanged },
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
            { ui: this._btnAvailabilityMrw,     callback: this._onTouchedBtnAvailabilityMrw },
            { ui: this._btnAvailabilityCcw,     callback: this._onTouchedBtnAvailabilityCcw },
            { ui: this._btnAvailabilitySrw,     callback: this._onTouchedBtnAvailabilitySrw },
            { ui: this._btnEditWarEvent,        callback: this._onTouchedBtnEditWarEvent },
            { ui: this._btnAddWarEvent,         callback: this._onTouchedBtnAddWarEvent },
            { ui: this._btnTestWarEvent,        callback: this._onTouchedBtnTestWarEvent },
        ]);
        this._listWarRule.setItemRenderer(WarRuleNameRenderer);
        this._listWarEvent.setItemRenderer(WarEventRenderer);
        this._listPlayer.setItemRenderer(PlayerRenderer);

        this._updateComponentsForLanguage();

        this._war = MeModel.getWar();
        this._resetView();
    }
    protected async _onClosed(): Promise<void> {
        this._war = null;

        Notify.dispatch(NotifyType.BwCoListPanelClosed);
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
    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _onNotifyMeWarRuleNameChanged(): void {
        this._updateLabelRuleName(this._selectedRule);
    }

    private _onNotifyMeWarEventIdArrayChanged(): void {
        this._updateListWarEvent();
    }

    private _onTouchTapBtnBack(): void {
        this.close();
        MeWarMenuPanel.show();
    }

    private _onTouchedBtnDelete(): void {
        const selectedRule = this._selectedRule;
        if (selectedRule != null) {
            const war = this._war;
            if (war.getWarRuleArray().length <= 1) {
                FloatText.show(Lang.getText(LangTextType.A0096));
            } else {
                CommonConfirmPanel.show({
                    content : Lang.getText(LangTextType.A0097),
                    callback: () => {
                        war.deleteWarRule(selectedRule.ruleId);
                        this._resetView();
                    },
                });
            }
        }
    }

    private _onTouchedBtnAddRule(): void {
        const war = this._war;
        if (war.getWarRuleArray().length >= CommonConstants.WarRuleMaxCount) {
            FloatText.show(Lang.getText(LangTextType.A0099));
        } else {
            war.addWarRule();
            this._resetView();
        }
    }

    private _onTouchedBtnHelpHasFog(): void {
        CommonHelpPanel.show({
            title  : Lang.getText(LangTextType.B0020),
            content: Lang.getText(LangTextType.R0002),
        });
    }

    private _onTouchedBtnModifyHasFog(): void {
        const rule = this._selectedRule;
        if ((rule) && (!this._war.getIsReviewingMap())) {
            BwWarRuleHelpers.setHasFogByDefault(rule, !BwWarRuleHelpers.getHasFogByDefault(rule));
            this._updateImgHasFog(rule);
        }
    }

    private _onTouchedBtnModifyRuleName(): void {
        const rule = this._selectedRule;
        if ((rule) && (!this._war.getIsReviewingMap())) {
            MeModifyRuleNamePanel.show({ ruleId: rule.ruleId });
        }
    }

    private _onTouchedBtnAvailabilityMcw(): void {
        const rule = this._selectedRule;
        if ((rule) && (!this._war.getIsReviewingMap())) {
            rule.ruleAvailability.canMcw = !rule.ruleAvailability.canMcw;
            this._updateImgAvailabilityMcw(rule);
        }
    }

    private _onTouchedBtnAvailabilityScw(): void {
        const rule = this._selectedRule;
        if ((rule) && (!this._war.getIsReviewingMap())) {
            rule.ruleAvailability.canScw = !rule.ruleAvailability.canScw;
            this._updateImgAvailabilityScw(rule);
        }
    }

    private _onTouchedBtnAvailabilityMrw(): void {
        const rule = this._selectedRule;
        if ((rule) && (!this._war.getIsReviewingMap())) {
            rule.ruleAvailability.canMrw = !rule.ruleAvailability.canMrw;
            this._updateImgAvailabilityMrw(rule);
        }
    }

    private _onTouchedBtnAvailabilityCcw(): void {
        const rule = this._selectedRule;
        if ((rule) && (!this._war.getIsReviewingMap())) {
            const ruleAvailability  = rule.ruleAvailability;
            const canCcw            = !ruleAvailability.canCcw;
            ruleAvailability.canCcw = canCcw;
            this._updateImgAvailabilityCcw(rule);

            if (!canCcw) {
                for (const playerRule of rule.ruleForPlayers.playerRuleDataArray || []) {
                    playerRule.fixedCoIdInCcw = null;
                    this._updateListPlayerRule(rule);
                }
            }
        }
    }

    private _onTouchedBtnAvailabilitySrw(): void {
        const rule = this._selectedRule;
        if ((rule) && (!this._war.getIsReviewingMap())) {
            rule.ruleAvailability.canSrw = !rule.ruleAvailability.canSrw;
            this._updateImgAvailabilitySrw(rule);
        }
    }

    private _onTouchedBtnEditWarEvent(): void {
        WeEventListPanel.show({
            war: this._war,
        });
        this.close();
    }

    private _onTouchedBtnAddWarEvent(): void {
        MeAddWarEventToRulePanel.show({
            warRule : this._selectedRule,
        });
    }

    private _onTouchedBtnTestWarEvent(): void {
        const testData: ProtoTypes.Map.IWarEventFullData = {
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
                {
                    WeaCommonData: {
                        actionId    : 1,            // 动作id
                    },
                    WeaAddUnit: {        // 增加部队
                        unitArray: [
                            {
                                canBeBlockedByUnit  : false,    // 是否会被指定位置的已有部队阻断增援
                                needMovableTile     : true,     // 是否自动寻找合适的地形，比如海军不在陆地上刷出
                                unitData            : {         // 部队属性
                                    gridIndex       : { x: 10, y: 1 },
                                    unitType        : 8,
                                    playerIndex     : 2,
                                    currentHp       : 89,
                                },
                            }
                        ],
                    },
                },
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
                    actionIdArray               : [1, 1, 1, 1, 1, ],// 动作id列表，
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
                    actionIdArray               : [1, 1, 1, 1, 1, ],// 动作id列表，
                    // 动作1是刷出1个坦克，这里指定执行5次，而且坦克不会被已有部队阻断，所以执行时就直接刷出5个坦克
                },
            ],
        };

        this._war.getWarEventManager().init({
            warEventFullData: testData,
            calledCountList : undefined,
        });
        this._selectedRule.warEventIdArray = [1, 2];
        this._updateListWarEvent();
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
        this._btnTestWarEvent.visible   = window.CLIENT_VERSION === "DEVELOP";
        this._btnBack.setTextColor(0x00FF00);
        this._btnAvailabilityMcw.setTextColor(colorForButtons);
        this._btnAvailabilityMrw.setTextColor(colorForButtons);
        this._btnAvailabilityCcw.setTextColor(colorForButtons);
        this._btnAvailabilityScw.setTextColor(colorForButtons);
        this._btnAvailabilitySrw.setTextColor(colorForButtons);
        this._btnModifyHasFog.setTextColor(colorForButtons);
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
        this._labelWarEventListTitle.text   = Lang.getText(LangTextType.B0461);
        this._btnAddWarEvent.label          = Lang.getText(LangTextType.B0320);
        this._btnEditWarEvent.label         = Lang.getText(LangTextType.B0465);
    }

    private _createDataForListWarRule(): DataForWarRuleNameRenderer[] {
        const data  : DataForWarRuleNameRenderer[] = [];
        let index   = 0;
        for (const rule of this._war.getWarRuleArray()) {
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
        this._updateImgAvailabilityCcw(rule);
        this._updateImgAvailabilitySrw(rule);
        this._updateListWarEvent();
        this._updateListPlayerRule(rule);
    }

    private _updateLabelRuleName(rule: IWarRule): void {
        this._labelRuleName.text = Lang.concatLanguageTextList(rule ? rule.ruleNameArray : undefined) || Lang.getText(LangTextType.B0001);
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
    private _updateImgAvailabilityMrw(rule: IWarRule): void {
        this._imgAvailabilityMrw.visible = rule ? rule.ruleAvailability.canMrw : false;
    }
    private _updateImgAvailabilityCcw(rule: IWarRule): void {
        this._imgAvailabilityCcw.visible = rule ? rule.ruleAvailability.canCcw : false;
    }
    private _updateImgAvailabilitySrw(rule: IWarRule): void {
        this._imgAvailabilitySrw.visible = rule ? rule.ruleAvailability.canSrw : false;
    }
    private _updateListWarEvent(): void {
        const dataArray         : DataForWarEventRenderer[] = [];
        const warRule           = this._selectedRule;
        const warEventManager   = this._war.getWarEventManager();
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
    private _updateListPlayerRule(rule: IWarRule): void {
        const playerRuleDataList    = rule ? rule.ruleForPlayers.playerRuleDataArray : null;
        const listPlayer            = this._listPlayer;
        if ((!playerRuleDataList) || (!playerRuleDataList.length)) {
            listPlayer.clear();
        } else {
            const dataList              : DataForPlayerRenderer[] = [];
            const playersCountUnneutral = (this._war.getField() as MeField).getMaxPlayerIndex();
            let index       = 0;
            for (const playerRule of playerRuleDataList) {
                if (playerRule.playerIndex <= playersCountUnneutral) {
                    dataList.push({
                        index,
                        playerRule,
                        warRule     : rule,
                        isReviewing : this._war.getIsReviewingMap(),
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
    private _btnChoose: TwnsUiButton.UiButton;
    private _labelName: TwnsUiLabel.UiLabel;

    protected _onOpened(): void {
        this._setUiListenerArray([
            { ui: this._btnChoose,  callback: this._onTouchTapBtnChoose },
        ]);
    }

    protected _onDataChanged(): void {
        const data              = this.data;
        const index             = data.index;
        this.currentState       = index === data.panel.getSelectedIndex() ? Types.UiState.Down : Types.UiState.Up;
        this._labelName.text    = `${Lang.getText(LangTextType.B0318)} ${index}`;
    }

    private _onTouchTapBtnChoose(): void {
        const data = this.data;
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
    private _listInfo   : TwnsUiScrollList.UiScrollList<DataForInfoRenderer>;

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
        const data          = this.data;
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
            this._createDataAiCoIdInCcw(warRule, playerRule, isReviewing),
            this._createDataAiControlInCcw(warRule, playerRule, isReviewing),
        ];
    }
    private _createDataPlayerIndex(warRule: IWarRule, playerRule: IDataForPlayerRule): DataForInfoRenderer {
        return {
            titleText               : Lang.getText(LangTextType.B0018),
            infoText                : Lang.getPlayerForceName(playerRule.playerIndex),
            infoColor               : 0xFFFFFF,
            callbackOnTouchedTitle  : null,
        };
    }
    private _createDataTeamIndex(warRule: IWarRule, playerRule: IDataForPlayerRule, isReviewing: boolean): DataForInfoRenderer {
        return {
            titleText               : Lang.getText(LangTextType.B0019),
            infoText                : Lang.getPlayerTeamName(playerRule.teamIndex),
            infoColor               : 0xFFFFFF,
            callbackOnTouchedTitle  : isReviewing
                ? null
                : () => {
                    BwWarRuleHelpers.tickTeamIndex(warRule, playerRule.playerIndex);
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
                    MeAvailableCoPanel.show({
                        warRule,
                        playerRule,
                        isReviewing,
                    });
                },
        };
    }
    private _createDataInitialFund(warRule: IWarRule, playerRule: IDataForPlayerRule, isReviewing: boolean): DataForInfoRenderer {
        const currValue = playerRule.initialFund;
        return {
            titleText               : Lang.getText(LangTextType.B0178),
            infoText                : `${currValue}`,
            infoColor               : getTextColor(currValue, CommonConstants.WarRuleInitialFundDefault),
            callbackOnTouchedTitle  : isReviewing
                ? null
                : () => {
                    const maxValue  = CommonConstants.WarRuleInitialFundMaxLimit;
                    const minValue  = CommonConstants.WarRuleInitialFundMinLimit;
                    CommonInputPanel.show({
                        title           : Lang.getText(LangTextType.B0178),
                        currentValue    : "" + currValue,
                        maxChars        : 7,
                        charRestrict    : "0-9\\-",
                        tips            : `${Lang.getText(LangTextType.B0319)}: [${minValue}, ${maxValue}]`,
                        callback        : panel => {
                            const text  = panel.getInputText();
                            const value = text ? Number(text) : NaN;
                            if ((isNaN(value)) || (value > maxValue) || (value < minValue)) {
                                FloatText.show(Lang.getText(LangTextType.A0098));
                            } else {
                                BwWarRuleHelpers.setInitialFund(warRule, playerRule.playerIndex, value);
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
            titleText               : Lang.getText(LangTextType.B0179),
            infoText                : `${currValue}%`,
            infoColor               : getTextColor(currValue, CommonConstants.WarRuleIncomeMultiplierDefault),
            callbackOnTouchedTitle  : isReviewing
                ? null
                : () => {
                    const maxValue  = CommonConstants.WarRuleIncomeMultiplierMaxLimit;
                    const minValue  = CommonConstants.WarRuleIncomeMultiplierMinLimit;
                    CommonInputPanel.show({
                        title           : Lang.getText(LangTextType.B0179),
                        currentValue    : "" + currValue,
                        maxChars        : 5,
                        charRestrict    : "0-9",
                        tips            : `${Lang.getText(LangTextType.B0319)}: [${minValue}, ${maxValue}]`,
                        callback        : panel => {
                            const text  = panel.getInputText();
                            const value = text ? Number(text) : NaN;
                            if ((isNaN(value)) || (value > maxValue) || (value < minValue)) {
                                FloatText.show(Lang.getText(LangTextType.A0098));
                            } else {
                                BwWarRuleHelpers.setIncomeMultiplier(warRule, playerRule.playerIndex, value);
                                this._updateView();
                            }
                        },
                    });
                },
        };
    }
    private _createDataEnergyAddPctOnLoadCo(warRule: IWarRule, playerRule: IDataForPlayerRule, isReviewing: boolean): DataForInfoRenderer {
        const currValue = playerRule.energyAddPctOnLoadCo;
        return {
            titleText               : Lang.getText(LangTextType.B0180),
            infoText                : `${currValue}%`,
            infoColor               : getTextColor(currValue, CommonConstants.WarRuleEnergyAddPctOnLoadCoDefault),
            callbackOnTouchedTitle  : isReviewing
                ? null
                : () => {
                    const minValue      = CommonConstants.WarRuleEnergyAddPctOnLoadCoMinLimit;
                    const maxValue      = CommonConstants.WarRuleEnergyAddPctOnLoadCoMaxLimit;
                    CommonInputPanel.show({
                        title           : Lang.getText(LangTextType.B0180),
                        currentValue    : "" + currValue,
                        maxChars        : 3,
                        charRestrict    : "0-9",
                        tips            : `${Lang.getText(LangTextType.B0319)}: [${minValue}, ${maxValue}]`,
                        callback        : panel => {
                            const text  = panel.getInputText();
                            const value = text ? Number(text) : NaN;
                            if ((isNaN(value)) || (value > maxValue) || (value < minValue)) {
                                FloatText.show(Lang.getText(LangTextType.A0098));
                            } else {
                                BwWarRuleHelpers.setEnergyAddPctOnLoadCo(warRule, playerRule.playerIndex, value);
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
            titleText               : Lang.getText(LangTextType.B0181),
            infoText                : `${currValue}%`,
            infoColor               : getTextColor(currValue, CommonConstants.WarRuleEnergyGrowthMultiplierDefault),
            callbackOnTouchedTitle  : isReviewing
                ? null
                : () => {
                    const minValue      = CommonConstants.WarRuleEnergyGrowthMultiplierMinLimit;
                    const maxValue      = CommonConstants.WarRuleEnergyGrowthMultiplierMaxLimit;
                    CommonInputPanel.show({
                        title           : Lang.getText(LangTextType.B0181),
                        currentValue    : "" + currValue,
                        maxChars        : 5,
                        charRestrict    : "0-9",
                        tips            : `${Lang.getText(LangTextType.B0319)}: [${minValue}, ${maxValue}]`,
                        callback        : panel => {
                            const text  = panel.getInputText();
                            const value = text ? Number(text) : NaN;
                            if ((isNaN(value)) || (value > maxValue) || (value < minValue)) {
                                FloatText.show(Lang.getText(LangTextType.A0098));
                            } else {
                                BwWarRuleHelpers.setEnergyGrowthMultiplier(warRule, playerRule.playerIndex, value);
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
            titleText               : Lang.getText(LangTextType.B0182),
            infoText                : `${currValue}`,
            infoColor               : getTextColor(currValue, CommonConstants.WarRuleMoveRangeModifierDefault),
            callbackOnTouchedTitle  : isReviewing
                ? null
                : () => {
                    const minValue      = CommonConstants.WarRuleMoveRangeModifierMinLimit;
                    const maxValue      = CommonConstants.WarRuleMoveRangeModifierMaxLimit;
                    CommonInputPanel.show({
                        title           : Lang.getText(LangTextType.B0182),
                        currentValue    : "" + currValue,
                        maxChars        : 3,
                        charRestrict    : "0-9\\-",
                        tips            : `${Lang.getText(LangTextType.B0319)}: [${minValue}, ${maxValue}]`,
                        callback        : panel => {
                            const text  = panel.getInputText();
                            const value = text ? Number(text) : NaN;
                            if ((isNaN(value)) || (value > maxValue) || (value < minValue)) {
                                FloatText.show(Lang.getText(LangTextType.A0098));
                            } else {
                                BwWarRuleHelpers.setMoveRangeModifier(warRule, playerRule.playerIndex, value);
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
            titleText               : Lang.getText(LangTextType.B0183),
            infoText                : `${currValue}%`,
            infoColor               : getTextColor(currValue, CommonConstants.WarRuleOffenseBonusDefault),
            callbackOnTouchedTitle  : isReviewing
                ? null
                : () => {
                    const minValue      = CommonConstants.WarRuleOffenseBonusMinLimit;
                    const maxValue      = CommonConstants.WarRuleOffenseBonusMaxLimit;
                    CommonInputPanel.show({
                        title           : Lang.getText(LangTextType.B0183),
                        currentValue    : "" + currValue,
                        maxChars        : 5,
                        charRestrict    : "0-9\\-",
                        tips            : `${Lang.getText(LangTextType.B0319)}: [${minValue}, ${maxValue}]`,
                        callback        : panel => {
                            const text  = panel.getInputText();
                            const value = text ? Number(text) : NaN;
                            if ((isNaN(value)) || (value > maxValue) || (value < minValue)) {
                                FloatText.show(Lang.getText(LangTextType.A0098));
                            } else {
                                BwWarRuleHelpers.setAttackPowerModifier(warRule, playerRule.playerIndex, value);
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
            titleText               : Lang.getText(LangTextType.B0184),
            infoText                : `${currValue}`,
            infoColor               : getTextColor(currValue, CommonConstants.WarRuleVisionRangeModifierDefault),
            callbackOnTouchedTitle  : isReviewing
                ? null
                : () => {
                    const minValue      = CommonConstants.WarRuleVisionRangeModifierMinLimit;
                    const maxValue      = CommonConstants.WarRuleVisionRangeModifierMaxLimit;
                    CommonInputPanel.show({
                        title           : Lang.getText(LangTextType.B0184),
                        currentValue    : "" + currValue,
                        maxChars        : 3,
                        charRestrict    : "0-9\\-",
                        tips            : `${Lang.getText(LangTextType.B0319)}: [${minValue}, ${maxValue}]`,
                        callback        : panel => {
                            const text  = panel.getInputText();
                            const value = text ? Number(text) : NaN;
                            if ((isNaN(value)) || (value > maxValue) || (value < minValue)) {
                                FloatText.show(Lang.getText(LangTextType.A0098));
                            } else {
                                BwWarRuleHelpers.setVisionRangeModifier(warRule, playerRule.playerIndex, value);
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
            titleText               : Lang.getText(LangTextType.B0189),
            infoText                : `${currValue}%`,
            infoColor               : getTextColor(currValue, CommonConstants.WarRuleLuckDefaultLowerLimit),
            callbackOnTouchedTitle  : isReviewing
                ? null
                : () => {
                    const minValue      = CommonConstants.WarRuleLuckMinLimit;
                    const maxValue      = CommonConstants.WarRuleLuckMaxLimit;
                    CommonInputPanel.show({
                        title           : Lang.getText(LangTextType.B0189),
                        currentValue    : "" + currValue,
                        maxChars        : 4,
                        charRestrict    : "0-9\\-",
                        tips            : `${Lang.getText(LangTextType.B0319)}: [${minValue}, ${maxValue}]`,
                        callback        : panel => {
                            const text  = panel.getInputText();
                            const value = text ? Number(text) : NaN;
                            if ((isNaN(value)) || (value > maxValue) || (value < minValue)) {
                                FloatText.show(Lang.getText(LangTextType.A0098));
                            } else {
                                const upperLimit = BwWarRuleHelpers.getLuckUpperLimit(warRule, playerIndex);
                                if (value <= upperLimit) {
                                    BwWarRuleHelpers.setLuckLowerLimit(warRule, playerIndex, value);
                                } else {
                                    BwWarRuleHelpers.setLuckUpperLimit(warRule, playerIndex, value);
                                    BwWarRuleHelpers.setLuckLowerLimit(warRule, playerIndex, upperLimit);
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
            titleText               : Lang.getText(LangTextType.B0190),
            infoText                : `${currValue}%`,
            infoColor               : getTextColor(currValue, CommonConstants.WarRuleLuckDefaultUpperLimit),
            callbackOnTouchedTitle  : isReviewing
                ? null
                : () => {
                    const minValue      = CommonConstants.WarRuleLuckMinLimit;
                    const maxValue      = CommonConstants.WarRuleLuckMaxLimit;
                    CommonInputPanel.show({
                        title           : Lang.getText(LangTextType.B0190),
                        currentValue    : "" + currValue,
                        maxChars        : 4,
                        charRestrict    : "0-9\\-",
                        tips            : `${Lang.getText(LangTextType.B0319)}: [${minValue}, ${maxValue}]`,
                        callback        : panel => {
                            const text  = panel.getInputText();
                            const value = text ? Number(text) : NaN;
                            if ((isNaN(value)) || (value > maxValue) || (value < minValue)) {
                                FloatText.show(Lang.getText(LangTextType.A0098));
                            } else {
                                const lowerLimit = BwWarRuleHelpers.getLuckLowerLimit(warRule, playerIndex);
                                if (value >= lowerLimit) {
                                    BwWarRuleHelpers.setLuckUpperLimit(warRule, playerIndex, value);
                                } else {
                                    BwWarRuleHelpers.setLuckLowerLimit(warRule, playerIndex, value);
                                    BwWarRuleHelpers.setLuckUpperLimit(warRule, playerIndex, lowerLimit);
                                }
                                this._updateView();
                            }
                        },
                    });
            },
        };
    }
    private _createDataAiCoIdInCcw(warRule: IWarRule, playerRule: IDataForPlayerRule, isReviewing: boolean): DataForInfoRenderer {
        const isControlledByAi = playerRule.fixedCoIdInCcw != null;
        return {
            titleText               : Lang.getText(LangTextType.B0645),
            infoText                : Lang.getText(isControlledByAi ? LangTextType.B0012 : LangTextType.B0013),
            infoColor               : isControlledByAi ? 0x00FF00 : 0xFFFFFF,
            callbackOnTouchedTitle  : isReviewing
                ? null
                : () => {
                    if (!warRule.ruleAvailability.canCcw) {
                        FloatText.show(Lang.getText(LangTextType.A0221));
                        return;
                    }

                    const playerIndex = playerRule.playerIndex;
                    if (isControlledByAi) {
                        BwWarRuleHelpers.setFixedCoIdInCcw(warRule, playerIndex, null);
                    } else {
                        BwWarRuleHelpers.setFixedCoIdInCcw(warRule, playerIndex, CommonConstants.CoEmptyId);
                    }
                    this._updateView();
                },
        };
    }
    private _createDataAiControlInCcw(warRule: IWarRule, playerRule: IDataForPlayerRule, isReviewing: boolean): DataForInfoRenderer {
        const coId          = playerRule.fixedCoIdInCcw;
        const configVersion = ConfigManager.getLatestFormalVersion();
        return {
            titleText               : Lang.getText(LangTextType.B0644),
            infoText                : coId == null ? `--` : ConfigManager.getCoNameAndTierText(configVersion, coId),
            infoColor               : coId == null ? 0xFFFFFF : 0x00FF00,
            callbackOnTouchedTitle  : isReviewing
                ? null
                : () => {
                    if (!warRule.ruleAvailability.canCcw) {
                        FloatText.show(Lang.getText(LangTextType.A0221));
                        return;
                    }

                    const coIdArray: number[] = [];
                    for (const cfg of ConfigManager.getEnabledCoArray(configVersion)) {
                        coIdArray.push(cfg.coId);
                    }
                    CommonChooseCoPanel.show({
                        currentCoId         : playerRule.fixedCoIdInCcw,
                        availableCoIdArray  : coIdArray,
                        callbackOnConfirm   : (newCoId: number) => {
                            BwWarRuleHelpers.setFixedCoIdInCcw(warRule, playerRule.playerIndex, newCoId);
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
    private _btnTitle   : TwnsUiButton.UiButton;
    private _labelValue : TwnsUiLabel.UiLabel;

    protected _onOpened(): void {
        this._setUiListenerArray([
            { ui: this._btnTitle, callback: this._onTouchedBtnTitle },
        ]);
    }

    protected _onDataChanged(): void {
        const data                  = this.data;
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
    private _labelWarEventIdTitle   : TwnsUiLabel.UiLabel;
    private _labelWarEventId        : TwnsUiLabel.UiLabel;
    private _btnUp                  : TwnsUiButton.UiButton;
    private _btnDown                : TwnsUiButton.UiButton;
    private _btnDelete              : TwnsUiButton.UiButton;
    private _labelWarEventName      : TwnsUiLabel.UiLabel;

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
            BwWarRuleHelpers.moveWarEventId(data.warRule, data.warEventId, -1);
            Notify.dispatch(NotifyType.MeWarEventIdArrayChanged);
        }
    }
    private _onTouchedBtnDown(): void {
        const data = this.data;
        if (data) {
            BwWarRuleHelpers.moveWarEventId(data.warRule, data.warEventId, 1);
            Notify.dispatch(NotifyType.MeWarEventIdArrayChanged);
        }
    }
    private _onTouchedBtnDelete(): void {
        const data = this.data;
        if (data) {
            BwWarRuleHelpers.deleteWarEventId(data.warRule, data.warEventId);
            Notify.dispatch(NotifyType.MeWarEventIdArrayChanged);
        }
    }
    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    protected _onDataChanged(): void {
        const data                  = this.data;
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
            this._labelWarEventName.text = Lang.getLanguageText({ textArray: data.warEventManager.getWarEvent(data.warEventId).eventNameArray });
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
