
import { UiListItemRenderer }           from "../../../gameui/UiListItemRenderer";
import { UiButton }                     from "../../../gameui/UiButton";
import { UiLabel }                      from "../../../gameui/UiLabel";
import { UiTextInput }                  from "../../../gameui/UiTextInput";
import { UiScrollList }                 from "../../../gameui/UiScrollList";
import { UiTabPage }                    from "../../../gameui/UiTabPage";
import { CommonConfirmPanel }           from "../../common/view/CommonConfirmPanel";
import { CommonHelpPanel }              from "../../common/view/CommonHelpPanel";
import { McrCreateBanCoPanel }          from "./McrCreateBanCoPanel";
import * as CommonConstants             from "../../../utility/CommonConstants";
import * as FloatText                   from "../../../utility/FloatText";
import * as Lang                        from "../../../utility/Lang";
import { LangTextType } from "../../../utility/LangTextType";
import { Notify }                       from "../../../utility/Notify";
import { NotifyType } from "../../../utility/NotifyType";
import * as ProtoTypes                  from "../../../utility/ProtoTypes";
import { Types }                        from "../../../utility/Types";
import * as McrModel                    from "../../multiCustomRoom/model/McrModel";
import PlayerRuleType                   = Types.PlayerRuleType;

export class McrCreateAdvancedSettingsPage extends UiTabPage<void> {
    private readonly _scroller      : eui.Scroller;
    private readonly _btnReset      : UiButton;
    private readonly _btnCustomize  : UiButton;
    private readonly _listSetting   : UiScrollList<DataForSettingRenderer>;
    private readonly _listPlayer    : UiScrollList<DataForPlayerRenderer>;

    private _initialWarRuleId   : number;
    private _mapRawData         : ProtoTypes.Map.IMapRawData;

    public constructor() {
        super();

        this.skinName = "resource/skins/multiCustomRoom/McrCreateAdvancedSettingsPage.exml";
    }

    protected async _onOpened(): Promise<void> {
        this._setNotifyListenerArray([
            { type: NotifyType.LanguageChanged,                    callback: this._onNotifyLanguageChanged },
            { type: NotifyType.McrCreatePresetWarRuleIdChanged,    callback: this._onNotifyMcrCreatePresetWarRuleIdChanged },
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

        this._initialWarRuleId  = McrModel.Create.getPresetWarRuleId();
        this._mapRawData        = await McrModel.Create.getMapRawData();

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
    private _onNotifyMcrCreatePresetWarRuleIdChanged(e: egret.Event): void {
        this._updateBtnReset();
        this._updateBtnCustomize();
    }
    private _onTouchedBtnReset(e: egret.TouchEvent): void {
        McrModel.Create.resetDataByWarRuleId(this._initialWarRuleId);
    }
    private _onTouchedBtnCustomize(e: egret.TouchEvent): void {
        CommonConfirmPanel.show({
            content : Lang.getText(LangTextType.A0129),
            callback: () => {
                McrModel.Create.setCustomWarRuleId();
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
        this._btnReset.visible = (this._initialWarRuleId != null) && (McrModel.Create.getPresetWarRuleId() == null);
    }
    private _updateBtnCustomize(): void {
        this._btnCustomize.visible = McrModel.Create.getPresetWarRuleId() != null;
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
class SettingRenderer extends UiListItemRenderer<DataForSettingRenderer> {
    private readonly _labelName : UiLabel;
    private readonly _btnHelp   : UiButton;

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
class PlayerRenderer extends UiListItemRenderer<DataForPlayerRenderer> {
    private _labelPlayerIndex   : UiLabel;
    private _listInfo           : UiScrollList<DataForInfoRenderer>;

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
class InfoRenderer extends UiListItemRenderer<DataForInfoRenderer> {
    private readonly _btnCustom     : UiButton;
    private readonly _inputValue    : UiTextInput;
    private readonly _labelValue    : UiLabel;

    private _callbackForTouchLabelValue     : () => void;
    private _callbackForFocusOutInputValue  : () => void;

    protected _onOpened(): void {
        this._setUiListenerArray([
            { ui: this._btnCustom,  callback: this._onTouchedBtnCustom },
            { ui: this._labelValue, callback: this._onTouchedLabelValue },
            { ui: this._inputValue, callback: this._onFocusOutInputValue, eventType: egret.FocusEvent.FOCUS_OUT },
        ]);
        this._setNotifyListenerArray([
            { type: NotifyType.McrCreatePresetWarRuleIdChanged,    callback: this._onNotifyMcrCreatePresetWarRuleIdChanged },
            { type: NotifyType.McrCreateBannedCoIdArrayChanged,    callback: this._onNotifyMcrCreateBannedCoIdArrayChanged },
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
                McrModel.Create.setCustomWarRuleId();
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
    private _onNotifyMcrCreatePresetWarRuleIdChanged(e: egret.Event): void {
        this._updateBtnCustom();
        this._updateComponentsForValue();
    }
    private _onNotifyMcrCreateBannedCoIdArrayChanged(): void {
        this._updateComponentsForValue();
    }

    private _updateBtnCustom(): void {
        this._btnCustom.visible = McrModel.Create.getPresetWarRuleId() != null;
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
        labelValue.text                     = Lang.getPlayerTeamName(McrModel.Create.getTeamIndex(playerIndex));
        labelValue.textColor                = 0xFFFFFF;
        this._callbackForTouchLabelValue    = () => McrModel.Create.tickTeamIndex(playerIndex);
    }
    private _updateComponentsForValueAsBannedCoIdArray(playerIndex: number): void {
        this._inputValue.visible            = false;
        this._callbackForFocusOutInputValue = null;

        const labelValue                    = this._labelValue;
        const currValue                     = (McrModel.Create.getBannedCoIdArray(playerIndex) || []).length;
        labelValue.visible                  = true;
        labelValue.text                     = `${currValue}`;
        labelValue.textColor                = currValue > 0 ? 0xFF0000 : 0xFFFFFF;
        this._callbackForTouchLabelValue    = () => McrCreateBanCoPanel.show({ playerIndex });
    }
    private _updateComponentsForValueAsInitialFund(playerIndex: number): void {
        this._labelValue.visible            = false;
        this._callbackForTouchLabelValue    = null;

        const inputValue                    = this._inputValue;
        const currValue                     = McrModel.Create.getInitialFund(playerIndex);
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
                McrModel.Create.setInitialFund(playerIndex, value);
            }
        };
    }
    private _updateComponentsForValueAsIncomeMultiplier(playerIndex: number): void {
        this._labelValue.visible            = false;
        this._callbackForTouchLabelValue    = null;

        const inputValue                    = this._inputValue;
        const currValue                     = McrModel.Create.getIncomeMultiplier(playerIndex);
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
                McrModel.Create.setIncomeMultiplier(playerIndex, value);
            }
        };
    }
    private _updateComponentsForValueAsEnergyAddPctOnLoadCo(playerIndex: number): void {
        this._labelValue.visible            = false;
        this._callbackForTouchLabelValue    = null;

        const inputValue                    = this._inputValue;
        const currValue                     = McrModel.Create.getEnergyAddPctOnLoadCo(playerIndex);
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
                McrModel.Create.setEnergyAddPctOnLoadCo(playerIndex, value);
            }
        };
    }
    private _updateComponentsForValueAsEnergyGrowthMultiplier(playerIndex: number): void {
        this._labelValue.visible            = false;
        this._callbackForTouchLabelValue    = null;

        const inputValue                    = this._inputValue;
        const currValue                     = McrModel.Create.getEnergyGrowthMultiplier(playerIndex);
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
                McrModel.Create.setEnergyGrowthMultiplier(playerIndex, value);
            }
        };
    }
    private _updateComponentsForValueAsMoveRangeModifier(playerIndex: number): void {
        this._labelValue.visible            = false;
        this._callbackForTouchLabelValue    = null;

        const inputValue                    = this._inputValue;
        const currValue                     = McrModel.Create.getMoveRangeModifier(playerIndex);
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
                McrModel.Create.setMoveRangeModifier(playerIndex, value);
            }
        };
    }
    private _updateComponentsForValueAsAttackPowerModifier(playerIndex: number): void {
        this._labelValue.visible            = false;
        this._callbackForTouchLabelValue    = null;

        const inputValue                    = this._inputValue;
        const currValue                     = McrModel.Create.getAttackPowerModifier(playerIndex);
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
                McrModel.Create.setAttackPowerModifier(playerIndex, value);
            }
        };
    }
    private _updateComponentsForValueAsVisionRangeModifier(playerIndex: number): void {
        this._labelValue.visible            = false;
        this._callbackForTouchLabelValue    = null;

        const inputValue                    = this._inputValue;
        const currValue                     = McrModel.Create.getVisionRangeModifier(playerIndex);
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
                McrModel.Create.setVisionRangeModifier(playerIndex, value);
            }
        };
    }
    private _updateComponentsForValueAsLuckLowerLimit(playerIndex: number): void {
        this._labelValue.visible            = false;
        this._callbackForTouchLabelValue    = null;

        const inputValue                    = this._inputValue;
        const currValue                     = McrModel.Create.getLuckLowerLimit(playerIndex);
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
                (value > McrModel.Create.getLuckUpperLimit(playerIndex))
            ) {
                FloatText.show(Lang.getText(LangTextType.A0098));
            } else {
                McrModel.Create.setLuckLowerLimit(playerIndex, value);
            }
        };
    }
    private _updateComponentsForValueAsLuckUpperLimit(playerIndex: number): void {
        this._labelValue.visible            = false;
        this._callbackForTouchLabelValue    = null;

        const inputValue                    = this._inputValue;
        const currValue                     = McrModel.Create.getLuckUpperLimit(playerIndex);
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
                (value < McrModel.Create.getLuckLowerLimit(playerIndex))
            ) {
                FloatText.show(Lang.getText(LangTextType.A0098));
            } else {
                McrModel.Create.setLuckUpperLimit(playerIndex, value);
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
