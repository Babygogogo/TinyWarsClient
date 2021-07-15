
import TwnsUiListItemRenderer           from "../../tools/ui/UiListItemRenderer";
import TwnsUiButton                      from "../../tools/ui/UiButton";
import TwnsUiLabel                      from "../../tools/ui/UiLabel";
import TwnsUiTextInput                  from "../../tools/ui/UiTextInput";
import TwnsUiScrollList                 from "../../tools/ui/UiScrollList";
import TwnsUiTabPage                    from "../../tools/ui/UiTabPage";
import CommonConfirmPanel = TwnsCommonConfirmPanel.CommonConfirmPanel;import TwnsCommonConfirmPanel           from "../../common/view/CommonConfirmPanel";
import CommonHelpPanel = TwnsCommonHelpPanel.CommonHelpPanel;import TwnsCommonHelpPanel              from "../../common/view/CommonHelpPanel";
import { ScrCreateBanCoPanel }          from "./ScrCreateBanCoPanel";
import CommonConstants              from "../../tools/helpers/CommonConstants";
import FloatText                    from "../../tools/helpers/FloatText";
import Lang                         from "../../tools/lang/Lang";
import TwnsLangTextType from "../../tools/lang/LangTextType";
import LangTextType         = TwnsLangTextType.LangTextType;
import Notify                       from "../../tools/notify/Notify";
import TwnsNotifyType from "../../tools/notify/NotifyType";
import NotifyType       = TwnsNotifyType.NotifyType;
import ProtoTypes                   from "../../tools/proto/ProtoTypes";
import Types                        from "../../tools/helpers/Types";
import ScrCreateModel                     from "../model/ScrCreateModel";
import PlayerRuleType                   = Types.PlayerRuleType;

export class ScrCreateAdvancedSettingsPage extends TwnsUiTabPage.UiTabPage<void> {
    private readonly _scroller      : eui.Scroller;
    private readonly _btnReset      : TwnsUiButton.UiButton;
    private readonly _btnCustomize  : TwnsUiButton.UiButton;
    private readonly _listSetting   : TwnsUiScrollList.UiScrollList<DataForSettingRenderer>;
    private readonly _listPlayer    : TwnsUiScrollList.UiScrollList<DataForPlayerRenderer>;

    private _initialWarRuleId   : number;
    private _mapRawData         : ProtoTypes.Map.IMapRawData;

    public constructor() {
        super();

        this.skinName = "resource/skins/singleCustomRoom/ScrCreateAdvancedSettingsPage.exml";
    }

    protected async _onOpened(): Promise<void> {
        this._setNotifyListenerArray([
            { type: NotifyType.LanguageChanged,                    callback: this._onNotifyLanguageChanged },
            { type: NotifyType.ScrCreatePresetWarRuleIdChanged,    callback: this._onNotifyScrCreatePresetWarRuleIdChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._btnReset,       callback: this._onTouchedBtnReset },
            { ui: this._btnCustomize,   callback: this._onTouchedBtnCustomize },
        ]);
        this._listSetting.setItemRenderer(SettingRenderer);
        this._listPlayer.setItemRenderer(PlayerRenderer);
        this._scroller.scrollPolicyH = eui.ScrollPolicy.OFF;
        this.left   = 0;
        this.right  = 0;
        this.top    = 0;
        this.bottom = 0;

        this._initialWarRuleId  = ScrCreateModel.getPresetWarRuleId();
        this._mapRawData        = await ScrCreateModel.getMapRawData();

        this._updateComponentsForLanguage();
        this._initListSetting();
        this._updateListPlayer();
        this._updateBtnReset();
        this._updateBtnCustomize();
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Event callbacks.
    ////////////////////////////////////////////////////////////////////////////////
    private _onNotifyLanguageChanged(e: egret.Event): void {
        this._updateComponentsForLanguage();
    }
    private _onNotifyScrCreatePresetWarRuleIdChanged(e: egret.Event): void {
        this._updateBtnReset();
        this._updateBtnCustomize();
    }
    private _onTouchedBtnReset(e: egret.TouchEvent): void {
        ScrCreateModel.resetDataByWarRuleId(this._initialWarRuleId);
    }
    private _onTouchedBtnCustomize(e: egret.TouchEvent): void {
        CommonConfirmPanel.show({
            content : Lang.getText(LangTextType.A0129),
            callback: () => {
                ScrCreateModel.setCustomWarRuleId();
            },
        });
    }

    ////////////////////////////////////////////////////////////////////////////////
    // View functions.
    ////////////////////////////////////////////////////////////////////////////////
    private _updateComponentsForLanguage(): void {
        this._btnReset.label        = Lang.getText(LangTextType.B0567);
        this._btnCustomize.label    = Lang.getText(LangTextType.B0575);
    }

    private _updateBtnReset(): void {
        this._btnReset.visible = (this._initialWarRuleId != null) && (ScrCreateModel.getPresetWarRuleId() == null);
    }
    private _updateBtnCustomize(): void {
        this._btnCustomize.visible = ScrCreateModel.getPresetWarRuleId() != null;
    }

    private _initListSetting(): void {
        this._listSetting.bindData([
            { playerRuleType: PlayerRuleType.TeamIndex },
            { playerRuleType: PlayerRuleType.BannedCoIdArray },
            { playerRuleType: PlayerRuleType.InitialFund },
            { playerRuleType: PlayerRuleType.IncomeMultiplier },
            { playerRuleType: PlayerRuleType.EnergyAddPctOnLoadCo },
            { playerRuleType: PlayerRuleType.EnergyGrowthMultiplier },
            { playerRuleType: PlayerRuleType.MoveRangeModifier },
            { playerRuleType: PlayerRuleType.AttackPowerModifier },
            { playerRuleType: PlayerRuleType.VisionRangeModifier },
            { playerRuleType: PlayerRuleType.LuckLowerLimit },
            { playerRuleType: PlayerRuleType.LuckUpperLimit },
        ]);
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

////////////////////////////////////////////////////////////////////////////////////////////////////
// SettingRenderer
////////////////////////////////////////////////////////////////////////////////////////////////////
type DataForSettingRenderer = {
    playerRuleType  : PlayerRuleType;
};
class SettingRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForSettingRenderer> {
    private readonly _labelName : TwnsUiLabel.UiLabel;
    private readonly _btnHelp   : TwnsUiButton.UiButton;

    protected _onOpened(): void {
        this._setUiListenerArray([
            { ui: this._btnHelp,    callback: this._onTouchedBtnHelp },
        ]);
    }

    protected _onDataChanged(): void {
        const data = this.data;
        if (data) {
            const playerRuleType    = data.playerRuleType;
            this._labelName.text    = Lang.getPlayerRuleName(playerRuleType);
            this._btnHelp.visible   = playerRuleType === PlayerRuleType.BannedCoIdArray;
        }
    }

    private _onTouchedBtnHelp(e: egret.Event): void {
        const data              = this.data;
        const playerRuleType    = data ? data.playerRuleType : null;
        if (playerRuleType === PlayerRuleType.BannedCoIdArray) {
            CommonHelpPanel.show({
                title   : `CO`,
                content : Lang.getText(LangTextType.R0004),
            });
        }
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////
// PlayerRenderer
////////////////////////////////////////////////////////////////////////////////////////////////////
type DataForPlayerRenderer = {
    playerIndex : number;
};
class PlayerRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForPlayerRenderer> {
    private _labelPlayerIndex   : TwnsUiLabel.UiLabel;
    private _listInfo           : TwnsUiScrollList.UiScrollList<DataForInfoRenderer>;

    protected _onOpened(): void {
        this._listInfo.setItemRenderer(InfoRenderer);
    }

    protected _onDataChanged(): void {
        this._updateView();
    }

    private _updateView(): void {
        const data = this.data;
        if (data) {
            this._labelPlayerIndex.text = `P${data.playerIndex}`;
            this._listInfo.bindData(this._createDataForListInfo());
        }
    }

    private _createDataForListInfo(): DataForInfoRenderer[] {
        const playerIndex = this.data.playerIndex;
        return [
            { playerIndex, playerRuleType: PlayerRuleType.TeamIndex },
            { playerIndex, playerRuleType: PlayerRuleType.BannedCoIdArray },
            { playerIndex, playerRuleType: PlayerRuleType.InitialFund },
            { playerIndex, playerRuleType: PlayerRuleType.IncomeMultiplier },
            { playerIndex, playerRuleType: PlayerRuleType.EnergyAddPctOnLoadCo },
            { playerIndex, playerRuleType: PlayerRuleType.EnergyGrowthMultiplier },
            { playerIndex, playerRuleType: PlayerRuleType.MoveRangeModifier },
            { playerIndex, playerRuleType: PlayerRuleType.AttackPowerModifier },
            { playerIndex, playerRuleType: PlayerRuleType.VisionRangeModifier },
            { playerIndex, playerRuleType: PlayerRuleType.LuckLowerLimit },
            { playerIndex, playerRuleType: PlayerRuleType.LuckUpperLimit },
        ];
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////
// InfoRenderer
////////////////////////////////////////////////////////////////////////////////////////////////////
type DataForInfoRenderer = {
    playerIndex             : number;
    playerRuleType          : PlayerRuleType;
    infoText?               : string;
    infoColor?              : number;
    callbackOnTouchedTitle? : (() => void) | null;
};
class InfoRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForInfoRenderer> {
    private readonly _btnCustom     : TwnsUiButton.UiButton;
    private readonly _inputValue    : TwnsUiTextInput.UiTextInput;
    private readonly _labelValue    : TwnsUiLabel.UiLabel;

    private _callbackForTouchLabelValue     : () => void;
    private _callbackForFocusOutInputValue  : () => void;

    protected _onOpened(): void {
        this._setUiListenerArray([
            { ui: this._btnCustom,  callback: this._onTouchedBtnCustom },
            { ui: this._labelValue, callback: this._onTouchedLabelValue },
            { ui: this._inputValue, callback: this._onFocusOutInputValue, eventType: egret.FocusEvent.FOCUS_OUT },
        ]);
        this._setNotifyListenerArray([
            { type: NotifyType.ScrCreatePresetWarRuleIdChanged,    callback: this._onNotifyScrCreatePresetWarRuleIdChanged },
            { type: NotifyType.ScrCreateBannedCoIdArrayChanged,    callback: this._onNotifyScrCreateBannedCoIdArrayChanged },
        ]);
        this._labelValue.touchEnabled = true;
    }
    protected _onClosed(): void {
        this._callbackForTouchLabelValue    = null;
        this._callbackForFocusOutInputValue = null;
    }

    protected _onDataChanged(): void {
        this._updateBtnCustom();
        this._updateComponentsForValue();
    }

    private _onTouchedBtnCustom(e: egret.TouchEvent): void {
        CommonConfirmPanel.show({
            content : Lang.getText(LangTextType.A0129),
            callback: () => {
                ScrCreateModel.setCustomWarRuleId();
            },
        });
    }
    private _onTouchedLabelValue(e: egret.TouchEvent): void {
        const callback = this._callbackForTouchLabelValue;
        if (callback) {
            callback();
            this._updateComponentsForValue();
        }
    }
    private _onFocusOutInputValue(e: egret.FocusEvent): void {
        const callback = this._callbackForFocusOutInputValue;
        if (callback) {
            callback();
            this._updateComponentsForValue();
        }
    }
    private _onNotifyScrCreatePresetWarRuleIdChanged(e: egret.Event): void {
        this._updateBtnCustom();
        this._updateComponentsForValue();
    }
    private _onNotifyScrCreateBannedCoIdArrayChanged(): void {
        this._updateComponentsForValue();
    }

    private _updateBtnCustom(): void {
        this._btnCustom.visible = ScrCreateModel.getPresetWarRuleId() != null;
    }
    private _updateComponentsForValue(): void {
        const data = this.data;
        if (data) {
            const playerIndex = data.playerIndex;
            switch (data.playerRuleType) {
                case PlayerRuleType.TeamIndex               : this._updateComponentsForValueAsTeamIndex(playerIndex);               return;
                case PlayerRuleType.BannedCoIdArray         : this._updateComponentsForValueAsBannedCoIdArray(playerIndex);         return;
                case PlayerRuleType.InitialFund             : this._updateComponentsForValueAsInitialFund(playerIndex);             return;
                case PlayerRuleType.IncomeMultiplier        : this._updateComponentsForValueAsIncomeMultiplier(playerIndex);        return;
                case PlayerRuleType.EnergyAddPctOnLoadCo    : this._updateComponentsForValueAsEnergyAddPctOnLoadCo(playerIndex);    return;
                case PlayerRuleType.EnergyGrowthMultiplier  : this._updateComponentsForValueAsEnergyGrowthMultiplier(playerIndex);  return;
                case PlayerRuleType.MoveRangeModifier       : this._updateComponentsForValueAsMoveRangeModifier(playerIndex);       return;
                case PlayerRuleType.AttackPowerModifier     : this._updateComponentsForValueAsAttackPowerModifier(playerIndex);     return;
                case PlayerRuleType.VisionRangeModifier     : this._updateComponentsForValueAsVisionRangeModifier(playerIndex);     return;
                case PlayerRuleType.LuckLowerLimit          : this._updateComponentsForValueAsLuckLowerLimit(playerIndex);          return;
                case PlayerRuleType.LuckUpperLimit          : this._updateComponentsForValueAsLuckUpperLimit(playerIndex);          return;
                default                                     : return;
            }
        }
    }
    private _updateComponentsForValueAsTeamIndex(playerIndex: number): void {
        this._inputValue.visible            = false;
        this._callbackForFocusOutInputValue = null;

        const labelValue                    = this._labelValue;
        labelValue.visible                  = true;
        labelValue.text                     = Lang.getPlayerTeamName(ScrCreateModel.getTeamIndex(playerIndex));
        labelValue.textColor                = 0xFFFFFF;
        this._callbackForTouchLabelValue    = () => ScrCreateModel.tickTeamIndex(playerIndex);
    }
    private _updateComponentsForValueAsBannedCoIdArray(playerIndex: number): void {
        this._inputValue.visible            = false;
        this._callbackForFocusOutInputValue = null;

        const labelValue                    = this._labelValue;
        const currValue                     = (ScrCreateModel.getBannedCoIdArray(playerIndex) || []).length;
        labelValue.visible                  = true;
        labelValue.text                     = `${currValue}`;
        labelValue.textColor                = currValue > 0 ? 0xFF0000 : 0xFFFFFF;
        this._callbackForTouchLabelValue    = () => ScrCreateBanCoPanel.show({ playerIndex });
    }
    private _updateComponentsForValueAsInitialFund(playerIndex: number): void {
        this._labelValue.visible            = false;
        this._callbackForTouchLabelValue    = null;

        const inputValue                    = this._inputValue;
        const currValue                     = ScrCreateModel.getInitialFund(playerIndex);
        inputValue.visible                  = true;
        inputValue.text                     = `${currValue}`;
        inputValue.textColor                = getTextColor(currValue, CommonConstants.WarRuleInitialFundDefault);
        inputValue.restrict                 = `0-9\\-`;
        inputValue.maxChars                 = 7;
        this._callbackForFocusOutInputValue = () => {
            const text  = inputValue.text;
            const value = text ? Number(text) : NaN;
            if ((isNaN(value))                                          ||
                (value > CommonConstants.WarRuleInitialFundMaxLimit)    ||
                (value < CommonConstants.WarRuleInitialFundMinLimit)
            ) {
                FloatText.show(Lang.getText(LangTextType.A0098));
            } else {
                ScrCreateModel.setInitialFund(playerIndex, value);
            }
        };
    }
    private _updateComponentsForValueAsIncomeMultiplier(playerIndex: number): void {
        this._labelValue.visible            = false;
        this._callbackForTouchLabelValue    = null;

        const inputValue                    = this._inputValue;
        const currValue                     = ScrCreateModel.getIncomeMultiplier(playerIndex);
        inputValue.visible                  = true;
        inputValue.text                     = `${currValue}`;
        inputValue.textColor                = getTextColor(currValue, CommonConstants.WarRuleIncomeMultiplierDefault);
        inputValue.restrict                 = `0-9`;
        inputValue.maxChars                 = 5;
        this._callbackForFocusOutInputValue = () => {
            const text  = inputValue.text;
            const value = text ? Number(text) : NaN;
            if ((isNaN(value))                                              ||
                (value > CommonConstants.WarRuleIncomeMultiplierMaxLimit)   ||
                (value < CommonConstants.WarRuleIncomeMultiplierMinLimit)
            ) {
                FloatText.show(Lang.getText(LangTextType.A0098));
            } else {
                ScrCreateModel.setIncomeMultiplier(playerIndex, value);
            }
        };
    }
    private _updateComponentsForValueAsEnergyAddPctOnLoadCo(playerIndex: number): void {
        this._labelValue.visible            = false;
        this._callbackForTouchLabelValue    = null;

        const inputValue                    = this._inputValue;
        const currValue                     = ScrCreateModel.getEnergyAddPctOnLoadCo(playerIndex);
        inputValue.visible                  = true;
        inputValue.text                     = `${currValue}`;
        inputValue.textColor                = getTextColor(currValue, CommonConstants.WarRuleEnergyAddPctOnLoadCoDefault);
        inputValue.restrict                 = `0-9`;
        inputValue.maxChars                 = 3;
        this._callbackForFocusOutInputValue = () => {
            const text  = inputValue.text;
            const value = text ? Number(text) : NaN;
            if ((isNaN(value))                                                      ||
                (value > CommonConstants.WarRuleEnergyAddPctOnLoadCoMaxLimit)    ||
                (value < CommonConstants.WarRuleEnergyAddPctOnLoadCoMinLimit)
            ) {
                FloatText.show(Lang.getText(LangTextType.A0098));
            } else {
                ScrCreateModel.setEnergyAddPctOnLoadCo(playerIndex, value);
            }
        };
    }
    private _updateComponentsForValueAsEnergyGrowthMultiplier(playerIndex: number): void {
        this._labelValue.visible            = false;
        this._callbackForTouchLabelValue    = null;

        const inputValue                    = this._inputValue;
        const currValue                     = ScrCreateModel.getEnergyGrowthMultiplier(playerIndex);
        inputValue.visible                  = true;
        inputValue.text                     = `${currValue}`;
        inputValue.textColor                = getTextColor(currValue, CommonConstants.WarRuleEnergyGrowthMultiplierDefault);
        inputValue.restrict                 = `0-9`;
        inputValue.maxChars                 = 5;
        this._callbackForFocusOutInputValue = () => {
            const text  = inputValue.text;
            const value = text ? Number(text) : NaN;
            if ((isNaN(value))                                                  ||
                (value > CommonConstants.WarRuleEnergyGrowthMultiplierMaxLimit) ||
                (value < CommonConstants.WarRuleEnergyGrowthMultiplierMinLimit)
            ) {
                FloatText.show(Lang.getText(LangTextType.A0098));
            } else {
                ScrCreateModel.setEnergyGrowthMultiplier(playerIndex, value);
            }
        };
    }
    private _updateComponentsForValueAsMoveRangeModifier(playerIndex: number): void {
        this._labelValue.visible            = false;
        this._callbackForTouchLabelValue    = null;

        const inputValue                    = this._inputValue;
        const currValue                     = ScrCreateModel.getMoveRangeModifier(playerIndex);
        inputValue.visible                  = true;
        inputValue.text                     = `${currValue}`;
        inputValue.textColor                = getTextColor(currValue, CommonConstants.WarRuleMoveRangeModifierDefault);
        inputValue.restrict                 = `0-9\\-`;
        inputValue.maxChars                 = 3;
        this._callbackForFocusOutInputValue = () => {
            const text  = inputValue.text;
            const value = text ? Number(text) : NaN;
            if ((isNaN(value))                                              ||
                (value > CommonConstants.WarRuleMoveRangeModifierMaxLimit)  ||
                (value < CommonConstants.WarRuleMoveRangeModifierMinLimit)
            ) {
                FloatText.show(Lang.getText(LangTextType.A0098));
            } else {
                ScrCreateModel.setMoveRangeModifier(playerIndex, value);
            }
        };
    }
    private _updateComponentsForValueAsAttackPowerModifier(playerIndex: number): void {
        this._labelValue.visible            = false;
        this._callbackForTouchLabelValue    = null;

        const inputValue                    = this._inputValue;
        const currValue                     = ScrCreateModel.getAttackPowerModifier(playerIndex);
        inputValue.visible                  = true;
        inputValue.text                     = `${currValue}`;
        inputValue.textColor                = getTextColor(currValue, CommonConstants.WarRuleOffenseBonusDefault);
        inputValue.restrict                 = `0-9\\-`;
        inputValue.maxChars                 = 5;
        this._callbackForFocusOutInputValue = () => {
            const text  = inputValue.text;
            const value = text ? Number(text) : NaN;
            if ((isNaN(value))                                          ||
                (value > CommonConstants.WarRuleOffenseBonusMaxLimit)   ||
                (value < CommonConstants.WarRuleOffenseBonusMinLimit)
            ) {
                FloatText.show(Lang.getText(LangTextType.A0098));
            } else {
                ScrCreateModel.setAttackPowerModifier(playerIndex, value);
            }
        };
    }
    private _updateComponentsForValueAsVisionRangeModifier(playerIndex: number): void {
        this._labelValue.visible            = false;
        this._callbackForTouchLabelValue    = null;

        const inputValue                    = this._inputValue;
        const currValue                     = ScrCreateModel.getVisionRangeModifier(playerIndex);
        inputValue.visible                  = true;
        inputValue.text                     = `${currValue}`;
        inputValue.textColor                = getTextColor(currValue, CommonConstants.WarRuleVisionRangeModifierDefault);
        inputValue.restrict                 = `0-9\\-`;
        inputValue.maxChars                 = 3;
        this._callbackForFocusOutInputValue = () => {
            const text  = inputValue.text;
            const value = text ? Number(text) : NaN;
            if ((isNaN(value))                                                  ||
                (value > CommonConstants.WarRuleVisionRangeModifierMaxLimit)    ||
                (value < CommonConstants.WarRuleVisionRangeModifierMinLimit)
            ) {
                FloatText.show(Lang.getText(LangTextType.A0098));
            } else {
                ScrCreateModel.setVisionRangeModifier(playerIndex, value);
            }
        };
    }
    private _updateComponentsForValueAsLuckLowerLimit(playerIndex: number): void {
        this._labelValue.visible            = false;
        this._callbackForTouchLabelValue    = null;

        const inputValue                    = this._inputValue;
        const currValue                     = ScrCreateModel.getLuckLowerLimit(playerIndex);
        inputValue.visible                  = true;
        inputValue.text                     = `${currValue}`;
        inputValue.textColor                = getTextColor(currValue, CommonConstants.WarRuleLuckDefaultLowerLimit);
        inputValue.restrict                 = `0-9\\-`;
        inputValue.maxChars                 = 4;
        this._callbackForFocusOutInputValue = () => {
            const text  = inputValue.text;
            const value = text ? Number(text) : NaN;
            if ((isNaN(value))                                          ||
                (value > CommonConstants.WarRuleLuckMaxLimit)           ||
                (value < CommonConstants.WarRuleLuckMinLimit)           ||
                (value > ScrCreateModel.getLuckUpperLimit(playerIndex))
            ) {
                FloatText.show(Lang.getText(LangTextType.A0098));
            } else {
                ScrCreateModel.setLuckLowerLimit(playerIndex, value);
            }
        };
    }
    private _updateComponentsForValueAsLuckUpperLimit(playerIndex: number): void {
        this._labelValue.visible            = false;
        this._callbackForTouchLabelValue    = null;

        const inputValue                    = this._inputValue;
        const currValue                     = ScrCreateModel.getLuckUpperLimit(playerIndex);
        inputValue.visible                  = true;
        inputValue.text                     = `${currValue}`;
        inputValue.textColor                = getTextColor(currValue, CommonConstants.WarRuleLuckDefaultUpperLimit);
        inputValue.restrict                 = `0-9\\-`;
        inputValue.maxChars                 = 4;
        this._callbackForFocusOutInputValue = () => {
            const text  = inputValue.text;
            const value = text ? Number(text) : NaN;
            if ((isNaN(value))                                          ||
                (value > CommonConstants.WarRuleLuckMaxLimit)           ||
                (value < CommonConstants.WarRuleLuckMinLimit)           ||
                (value < ScrCreateModel.getLuckLowerLimit(playerIndex))
            ) {
                FloatText.show(Lang.getText(LangTextType.A0098));
            } else {
                ScrCreateModel.setLuckUpperLimit(playerIndex, value);
            }
        };
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
