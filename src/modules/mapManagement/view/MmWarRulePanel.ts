
import { TwnsUiImage }                      from "../../../utility/ui/UiImage";
import { TwnsUiListItemRenderer }           from "../../../utility/ui/UiListItemRenderer";
import { TwnsUiPanel }                      from "../../../utility/ui/UiPanel";
import { TwnsUiButton }                      from "../../../utility/ui/UiButton";
import { TwnsUiLabel }                      from "../../../utility/ui/UiLabel";
import { TwnsUiScrollList }                 from "../../../utility/ui/UiScrollList";
import { CommonHelpPanel }              from "../../common/view/CommonHelpPanel";
import { MmWarRuleAvailableCoPanel }    from "./MmWarRuleAvailableCoPanel";
import { CommonConstants }              from "../../../utility/CommonConstants";
import { Lang }                         from "../../../utility/lang/Lang";
import { TwnsLangTextType } from "../../../utility/lang/LangTextType";
import LangTextType         = TwnsLangTextType.LangTextType;
import { Notify }                       from "../../../utility/notify/Notify";
import { TwnsNotifyType } from "../../../utility/notify/NotifyType";
import NotifyType       = TwnsNotifyType.NotifyType;
import { ProtoTypes }                   from "../../../utility/proto/ProtoTypes";
import { Types }                        from "../../../utility/Types";
import IWarRule                         = ProtoTypes.WarRule.IWarRule;
import IDataForPlayerRule               = ProtoTypes.WarRule.IDataForPlayerRule;

type OpenDataForMmWarRulePanel = ProtoTypes.Map.IMapRawData;
export class MmWarRulePanel extends TwnsUiPanel.UiPanel<OpenDataForMmWarRulePanel> {
    protected readonly _LAYER_TYPE   = Types.LayerType.Hud0;
    protected readonly _IS_EXCLUSIVE = false;

    private static _instance: MmWarRulePanel;

    private _labelMenuTitle     : TwnsUiLabel.UiLabel;
    private _listWarRule        : TwnsUiScrollList.UiScrollList<DataForWarRuleNameRenderer>;
    private _btnBack            : TwnsUiButton.UiButton;

    private _btnModifyRuleName  : TwnsUiButton.UiButton;
    private _labelRuleName      : TwnsUiLabel.UiLabel;

    private _btnModifyHasFog    : TwnsUiButton.UiButton;
    private _imgHasFog          : TwnsUiImage.UiImage;
    private _btnHelpHasFog      : TwnsUiButton.UiButton;

    private _labelAvailability  : TwnsUiLabel.UiLabel;
    private _btnAvailabilityMcw : TwnsUiButton.UiButton;
    private _imgAvailabilityMcw : TwnsUiImage.UiImage;
    private _btnAvailabilityScw : TwnsUiButton.UiButton;
    private _imgAvailabilityScw : TwnsUiImage.UiImage;
    private _btnAvailabilityMrw : TwnsUiButton.UiButton;
    private _imgAvailabilityMrw : TwnsUiImage.UiImage;

    private _labelPlayerList    : TwnsUiLabel.UiLabel;
    private _listPlayer         : TwnsUiScrollList.UiScrollList<DataForPlayerRenderer>;

    private _dataForListWarRule : DataForWarRuleNameRenderer[] = [];
    private _selectedIndex      : number;
    private _selectedRule       : IWarRule;

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
    public updateListPlayerRule(rule: IWarRule): void {
        const playerRuleDataList    = rule ? rule.ruleForPlayers.playerRuleDataArray : null;
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

    private _onTouchTapBtnChoose(e: egret.TouchEvent): void {
        const data = this.data;
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
    private _listInfo   : TwnsUiScrollList.UiScrollList<DataForInfoRenderer>;

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
        const data          = this.data;
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
        const currValue = playerRule.initialFund;
        return {
            titleText               : Lang.getText(LangTextType.B0178),
            infoText                : `${currValue}`,
            infoColor               : getTextColor(currValue, CommonConstants.WarRuleInitialFundDefault),
            callbackOnTouchedTitle  : null,
        };
    }
    private _createDataIncomeMultiplier(warRule: IWarRule, playerRule: IDataForPlayerRule, isReviewing: boolean): DataForInfoRenderer {
        const currValue = playerRule.incomeMultiplier;
        return {
            titleText               : Lang.getText(LangTextType.B0179),
            infoText                : `${currValue}%`,
            infoColor               : getTextColor(currValue, CommonConstants.WarRuleIncomeMultiplierDefault),
            callbackOnTouchedTitle  : null,
        };
    }
    private _createDataEnergyAddPctOnLoadCo(warRule: IWarRule, playerRule: IDataForPlayerRule, isReviewing: boolean): DataForInfoRenderer {
        const currValue = playerRule.energyAddPctOnLoadCo;
        return {
            titleText               : Lang.getText(LangTextType.B0180),
            infoText                : `${currValue}%`,
            infoColor               : getTextColor(currValue, CommonConstants.WarRuleEnergyAddPctOnLoadCoDefault),
            callbackOnTouchedTitle  : null,
        };
    }
    private _createDataEnergyGrowthMultiplier(warRule: IWarRule, playerRule: IDataForPlayerRule, isReviewing: boolean): DataForInfoRenderer {
        const currValue = playerRule.energyGrowthMultiplier;
        return {
            titleText               : Lang.getText(LangTextType.B0181),
            infoText                : `${currValue}%`,
            infoColor               : getTextColor(currValue, CommonConstants.WarRuleEnergyGrowthMultiplierDefault),
            callbackOnTouchedTitle  : null,
        };
    }
    private _createDataMoveRangeModifier(warRule: IWarRule, playerRule: IDataForPlayerRule, isReviewing: boolean): DataForInfoRenderer {
        const currValue = playerRule.moveRangeModifier;
        return {
            titleText               : Lang.getText(LangTextType.B0182),
            infoText                : `${currValue}`,
            infoColor               : getTextColor(currValue, CommonConstants.WarRuleMoveRangeModifierDefault),
            callbackOnTouchedTitle  : null,
        };
    }
    private _createDataAttackPowerModifier(warRule: IWarRule, playerRule: IDataForPlayerRule, isReviewing: boolean): DataForInfoRenderer {
        const currValue = playerRule.attackPowerModifier;
        return {
            titleText               : Lang.getText(LangTextType.B0183),
            infoText                : `${currValue}%`,
            infoColor               : getTextColor(currValue, CommonConstants.WarRuleOffenseBonusDefault),
            callbackOnTouchedTitle  : null,
        };
    }
    private _createDataVisionRangeModifier(warRule: IWarRule, playerRule: IDataForPlayerRule, isReviewing: boolean): DataForInfoRenderer {
        const currValue = playerRule.visionRangeModifier;
        return {
            titleText               : Lang.getText(LangTextType.B0184),
            infoText                : `${currValue}`,
            infoColor               : getTextColor(currValue, CommonConstants.WarRuleVisionRangeModifierDefault),
            callbackOnTouchedTitle  : null,
        };
    }
    private _createDataLuckLowerLimit(warRule: IWarRule, playerRule: IDataForPlayerRule, isReviewing: boolean): DataForInfoRenderer {
        const currValue     = playerRule.luckLowerLimit;
        return {
            titleText               : Lang.getText(LangTextType.B0189),
            infoText                : `${currValue}%`,
            infoColor               : getTextColor(currValue, CommonConstants.WarRuleLuckDefaultLowerLimit),
            callbackOnTouchedTitle  : null,
        };
    }
    private _createDataLuckUpperLimit(warRule: IWarRule, playerRule: IDataForPlayerRule, isReviewing: boolean): DataForInfoRenderer {
        const currValue     = playerRule.luckUpperLimit;
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
