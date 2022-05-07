
// import TwnsCommonBanCoPanel     from "../../common/view/CommonBanCoPanel";
// import TwnsCommonConfirmPanel   from "../../common/view/CommonConfirmPanel";
// import TwnsCommonHelpPanel      from "../../common/view/CommonHelpPanel";
// import CommonConstants          from "../../tools/helpers/CommonConstants";
// import ConfigManager            from "../../tools/helpers/ConfigManager";
// import FloatText                from "../../tools/helpers/FloatText";
// import Helpers                  from "../../tools/helpers/Helpers";
// import Types                    from "../../tools/helpers/Types";
// import Lang                     from "../../tools/lang/Lang";
// import TwnsLangTextType         from "../../tools/lang/LangTextType";
// import Notify                   from "../../tools/notify/Notify";
// import Notify           from "../../tools/notify/NotifyType";
// import TwnsUiButton             from "../../tools/ui/UiButton";
// import TwnsUiLabel              from "../../tools/ui/UiLabel";
// import TwnsUiListItemRenderer   from "../../tools/ui/UiListItemRenderer";
// import TwnsUiScrollList         from "../../tools/ui/UiScrollList";
// import TwnsUiTabPage            from "../../tools/ui/UiTabPage";
// import TwnsUiTextInput          from "../../tools/ui/UiTextInput";
// import McrCreateModel           from "../model/McrCreateModel";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.MultiCustomRoom {
    import LangTextType         = Lang.LangTextType;
    import NotifyType           = Notify.NotifyType;
    import PlayerRuleType       = Types.PlayerRuleType;

    export class McrCreateAdvancedSettingsPage extends TwnsUiTabPage.UiTabPage<void> {
        private readonly _scroller!     : eui.Scroller;
        private readonly _btnReset!     : TwnsUiButton.UiButton;
        private readonly _btnCustomize! : TwnsUiButton.UiButton;
        private readonly _listSetting!  : TwnsUiScrollList.UiScrollList<DataForSettingRenderer>;
        private readonly _listPlayer!   : TwnsUiScrollList.UiScrollList<DataForPlayerRenderer>;

        private _initialWarRuleId   : number | null = null;

        public constructor() {
            super();

            this.skinName = "resource/skins/multiCustomRoom/McrCreateAdvancedSettingsPage.exml";
        }

        protected async _onOpened(): Promise<void> {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,                     callback: this._onNotifyLanguageChanged },
                { type: NotifyType.McrCreateTemplateWarRuleIdChanged,   callback: this._onNotifyMcrCreateTemplateWarRuleIdChanged },
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

            this._initialWarRuleId  = MultiCustomRoom.McrCreateModel.getTemplateWarRuleId();

            this._updateComponentsForLanguage();
            this._initListSetting();
            this._updateListPlayer();
            this._updateBtnReset();
            this._updateBtnCustomize();
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Event callbacks.
        ////////////////////////////////////////////////////////////////////////////////
        private _onNotifyLanguageChanged(): void {
            this._updateComponentsForLanguage();
        }
        private _onNotifyMcrCreateTemplateWarRuleIdChanged(): void {
            this._updateBtnReset();
            this._updateBtnCustomize();
        }
        private _onTouchedBtnReset(): void {
            MultiCustomRoom.McrCreateModel.resetDataByTemplateWarRuleId(this._initialWarRuleId);
        }
        private _onTouchedBtnCustomize(): void {
            PanelHelpers.open(PanelHelpers.PanelDict.CommonConfirmPanel, {
                content : Lang.getText(LangTextType.A0129),
                callback: () => {
                    MultiCustomRoom.McrCreateModel.setCustomWarRuleId();
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
            this._btnReset.visible = (this._initialWarRuleId != null) && (MultiCustomRoom.McrCreateModel.getTemplateWarRuleId() == null);
        }
        private _updateBtnCustomize(): void {
            this._btnCustomize.visible = MultiCustomRoom.McrCreateModel.getTemplateWarRuleId() != null;
        }

        private _initListSetting(): void {
            this._listSetting.bindData([
                { playerRuleType: PlayerRuleType.TeamIndex },
                { playerRuleType: PlayerRuleType.BannedCoIdArray },
                { playerRuleType: PlayerRuleType.BannedUnitTypeArray },
                { playerRuleType: PlayerRuleType.InitialFund },
                { playerRuleType: PlayerRuleType.IncomeMultiplier },
                { playerRuleType: PlayerRuleType.EnergyAddPctOnLoadCo },
                { playerRuleType: PlayerRuleType.EnergyGrowthMultiplier },
                { playerRuleType: PlayerRuleType.CanActivateCoSkill },
                { playerRuleType: PlayerRuleType.MoveRangeModifier },
                { playerRuleType: PlayerRuleType.AttackPowerModifier },
                { playerRuleType: PlayerRuleType.VisionRangeModifier },
                { playerRuleType: PlayerRuleType.LuckLowerLimit },
                { playerRuleType: PlayerRuleType.LuckUpperLimit },
            ]);
        }

        private async _updateListPlayer(): Promise<void> {
            const playersCount  = Helpers.getExisted((await MultiCustomRoom.McrCreateModel.getMapRawData()).playersCountUnneutral);
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
        private readonly _labelName!    : TwnsUiLabel.UiLabel;
        private readonly _btnHelp!      : TwnsUiButton.UiButton;

        protected _onOpened(): void {
            this._setUiListenerArray([
                { ui: this._btnHelp,    callback: this._onTouchedBtnHelp },
            ]);
        }

        protected _onDataChanged(): void {
            const data = this.data;
            if (data) {
                const playerRuleType    = data.playerRuleType;
                this._labelName.text    = Lang.getPlayerRuleName(playerRuleType) ?? Twns.CommonConstants.ErrorTextForUndefined;
                this._btnHelp.visible   = playerRuleType === PlayerRuleType.BannedCoIdArray;
            }
        }

        private _onTouchedBtnHelp(): void {
            const data              = this.data;
            const playerRuleType    = data ? data.playerRuleType : null;
            if (playerRuleType === PlayerRuleType.BannedCoIdArray) {
                PanelHelpers.open(PanelHelpers.PanelDict.CommonHelpPanel, {
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
        private readonly _labelPlayerIndex! : TwnsUiLabel.UiLabel;
        private readonly _listInfo!         : TwnsUiScrollList.UiScrollList<DataForInfoRenderer>;

        protected _onOpened(): void {
            this._listInfo.setItemRenderer(InfoRenderer);
        }

        protected _onDataChanged(): void {
            this._updateView();
        }

        private _updateView(): void {
            const data                  = this._getData();
            this._labelPlayerIndex.text = `P${data.playerIndex}`;
            this._listInfo.bindData(this._createDataForListInfo());
        }

        private _createDataForListInfo(): DataForInfoRenderer[] {
            const playerIndex = this._getData().playerIndex;
            return [
                { playerIndex, playerRuleType: PlayerRuleType.TeamIndex },
                { playerIndex, playerRuleType: PlayerRuleType.BannedCoIdArray },
                { playerIndex, playerRuleType: PlayerRuleType.BannedUnitTypeArray },
                { playerIndex, playerRuleType: PlayerRuleType.InitialFund },
                { playerIndex, playerRuleType: PlayerRuleType.IncomeMultiplier },
                { playerIndex, playerRuleType: PlayerRuleType.EnergyAddPctOnLoadCo },
                { playerIndex, playerRuleType: PlayerRuleType.EnergyGrowthMultiplier },
                { playerIndex, playerRuleType: PlayerRuleType.CanActivateCoSkill },
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
        private readonly _btnCustom!    : TwnsUiButton.UiButton;
        private readonly _inputValue!   : TwnsUiTextInput.UiTextInput;
        private readonly _labelValue!   : TwnsUiLabel.UiLabel;

        private _callbackForTouchLabelValue     : (() => void) | null = null;
        private _callbackForFocusOutInputValue  : (() => void) | null = null;

        protected _onOpened(): void {
            this._setUiListenerArray([
                { ui: this._btnCustom,  callback: this._onTouchedBtnCustom },
                { ui: this._labelValue, callback: this._onTouchedLabelValue },
                { ui: this._inputValue, callback: this._onFocusOutInputValue, eventType: egret.FocusEvent.FOCUS_OUT },
            ]);
            this._setNotifyListenerArray([
                { type: NotifyType.McrCreateTemplateWarRuleIdChanged,   callback: this._onNotifyMcrCreateTemplateWarRuleIdChanged },
                { type: NotifyType.McrCreateBannedCoIdArrayChanged,     callback: this._onNotifyMcrCreateBannedCoIdArrayChanged },
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

        private _onTouchedBtnCustom(): void {
            PanelHelpers.open(PanelHelpers.PanelDict.CommonConfirmPanel, {
                content : Lang.getText(LangTextType.A0129),
                callback: () => {
                    MultiCustomRoom.McrCreateModel.setCustomWarRuleId();
                },
            });
        }
        private _onTouchedLabelValue(): void {
            const callback = this._callbackForTouchLabelValue;
            if (callback) {
                callback();
                this._updateComponentsForValue();
            }
        }
        private _onFocusOutInputValue(): void {
            const callback = this._callbackForFocusOutInputValue;
            if (callback) {
                callback();
                this._updateComponentsForValue();
            }
        }
        private _onNotifyMcrCreateTemplateWarRuleIdChanged(): void {
            this._updateBtnCustom();
            this._updateComponentsForValue();
        }
        private _onNotifyMcrCreateBannedCoIdArrayChanged(): void {
            this._updateComponentsForValue();
        }

        private _updateBtnCustom(): void {
            this._btnCustom.visible = MultiCustomRoom.McrCreateModel.getTemplateWarRuleId() != null;
        }
        private _updateComponentsForValue(): void {
            const data = this.data;
            if (data) {
                const playerIndex = data.playerIndex;
                switch (data.playerRuleType) {
                    case PlayerRuleType.TeamIndex               : this._updateComponentsForValueAsTeamIndex(playerIndex);               return;
                    case PlayerRuleType.BannedCoIdArray         : this._updateComponentsForValueAsBannedCoIdArray(playerIndex);         return;
                    case PlayerRuleType.BannedUnitTypeArray     : this._updateComponentsForValueAsBannedUnitTypeArray(playerIndex);     return;
                    case PlayerRuleType.InitialFund             : this._updateComponentsForValueAsInitialFund(playerIndex);             return;
                    case PlayerRuleType.IncomeMultiplier        : this._updateComponentsForValueAsIncomeMultiplier(playerIndex);        return;
                    case PlayerRuleType.EnergyAddPctOnLoadCo    : this._updateComponentsForValueAsEnergyAddPctOnLoadCo(playerIndex);    return;
                    case PlayerRuleType.EnergyGrowthMultiplier  : this._updateComponentsForValueAsEnergyGrowthMultiplier(playerIndex);  return;
                    case PlayerRuleType.CanActivateCoSkill      : this._updateComponentsForValueAsCanActivateCoSkill(playerIndex);      return;
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
            labelValue.text                     = Lang.getPlayerTeamName(MultiCustomRoom.McrCreateModel.getTeamIndex(playerIndex)) || Twns.CommonConstants.ErrorTextForUndefined;
            labelValue.textColor                = 0xFFFFFF;
            this._callbackForTouchLabelValue    = () => MultiCustomRoom.McrCreateModel.tickTeamIndex(playerIndex);
        }
        private _updateComponentsForValueAsBannedCoIdArray(playerIndex: number): void {
            this._inputValue.visible            = false;
            this._callbackForFocusOutInputValue = null;

            const labelValue                    = this._labelValue;
            const currValue                     = (MultiCustomRoom.McrCreateModel.getBannedCoIdArray(playerIndex) || []).length;
            const gameConfig                    = MultiCustomRoom.McrCreateModel.getGameConfig();
            const selfCoId                      = playerIndex === MultiCustomRoom.McrCreateModel.getSelfPlayerIndex() ? MultiCustomRoom.McrCreateModel.getSelfCoId() : null;
            labelValue.visible                  = true;
            labelValue.text                     = `${currValue}`;
            labelValue.textColor                = currValue > 0 ? 0xFF0000 : 0xFFFFFF;
            this._callbackForTouchLabelValue    = () => PanelHelpers.open(PanelHelpers.PanelDict.CommonBanCoPanel, {
                playerIndex,
                gameConfig,
                fullCoIdArray       : gameConfig.getEnabledCoArray().map(v => v.coId),
                bannedCoIdArray     : MultiCustomRoom.McrCreateModel.getBannedCoIdArray(playerIndex) || [],
                maxBanCount         : null,
                selfCoId,
                callbackOnConfirm   : (bannedCoIdSet) => {
                    const callback = () => {
                        MultiCustomRoom.McrCreateModel.setBannedCoIdArray(playerIndex, bannedCoIdSet);
                        Notify.dispatch(NotifyType.McrCreateBannedCoIdArrayChanged);
                        PanelHelpers.close(PanelHelpers.PanelDict.CommonBanCoPanel);
                    };
                    if ((selfCoId == null) || (!bannedCoIdSet.has(selfCoId))) {
                        callback();
                    } else {
                        PanelHelpers.open(PanelHelpers.PanelDict.CommonConfirmPanel, {
                            content : Lang.getText(LangTextType.A0057),
                            callback: () => {
                                MultiCustomRoom.McrCreateModel.setSelfCoId(Twns.CommonConstants.CoEmptyId);
                                callback();
                            },
                        });
                    }
                },
            });
        }
        private _updateComponentsForValueAsBannedUnitTypeArray(playerIndex: number): void {
            this._inputValue.visible            = false;
            this._callbackForFocusOutInputValue = null;

            const currentBannedUnitTypeArray    = MultiCustomRoom.McrCreateModel.getBannedUnitTypeArray(playerIndex) ?? [];
            const labelValue                    = this._labelValue;
            const currValue                     = currentBannedUnitTypeArray.length;
            labelValue.visible                  = true;
            labelValue.text                     = `${currValue}`;
            labelValue.textColor                = currValue > 0 ? 0xFF0000 : 0xFFFFFF;
            this._callbackForTouchLabelValue    = () => {
                PanelHelpers.open(PanelHelpers.PanelDict.CommonChooseUnitTypePanel, {
                    currentUnitTypeArray    : currentBannedUnitTypeArray,
                    gameConfig              : MultiCustomRoom.McrCreateModel.getGameConfig(),
                    callbackOnConfirm       : bannedUnitTypeArray => {
                        MultiCustomRoom.McrCreateModel.setBannedUnitTypeArray(playerIndex, bannedUnitTypeArray);
                        this._updateComponentsForValue();
                    },
                });
            };
        }
        private _updateComponentsForValueAsInitialFund(playerIndex: number): void {
            this._labelValue.visible            = false;
            this._callbackForTouchLabelValue    = null;

            const inputValue                    = this._inputValue;
            const currValue                     = MultiCustomRoom.McrCreateModel.getInitialFund(playerIndex);
            inputValue.visible                  = true;
            inputValue.text                     = `${currValue}`;
            inputValue.textColor                = getTextColor(currValue, Twns.CommonConstants.WarRuleInitialFundDefault);
            inputValue.restrict                 = `0-9\\-`;
            inputValue.maxChars                 = 7;
            this._callbackForFocusOutInputValue = () => {
                const text  = inputValue.text;
                const value = text ? Number(text) : NaN;
                if ((isNaN(value))                                          ||
                    (value > Twns.CommonConstants.WarRuleInitialFundMaxLimit)    ||
                    (value < Twns.CommonConstants.WarRuleInitialFundMinLimit)
                ) {
                    Twns.FloatText.show(Lang.getText(LangTextType.A0098));
                } else {
                    MultiCustomRoom.McrCreateModel.setInitialFund(playerIndex, value);
                }
            };
        }
        private _updateComponentsForValueAsIncomeMultiplier(playerIndex: number): void {
            this._labelValue.visible            = false;
            this._callbackForTouchLabelValue    = null;

            const inputValue                    = this._inputValue;
            const currValue                     = MultiCustomRoom.McrCreateModel.getIncomeMultiplier(playerIndex);
            inputValue.visible                  = true;
            inputValue.text                     = `${currValue}`;
            inputValue.textColor                = getTextColor(currValue, Twns.CommonConstants.WarRuleIncomeMultiplierDefault);
            inputValue.restrict                 = `0-9`;
            inputValue.maxChars                 = 5;
            this._callbackForFocusOutInputValue = () => {
                const text  = inputValue.text;
                const value = text ? Number(text) : NaN;
                if ((isNaN(value))                                              ||
                    (value > Twns.CommonConstants.WarRuleIncomeMultiplierMaxLimit)   ||
                    (value < Twns.CommonConstants.WarRuleIncomeMultiplierMinLimit)
                ) {
                    Twns.FloatText.show(Lang.getText(LangTextType.A0098));
                } else {
                    MultiCustomRoom.McrCreateModel.setIncomeMultiplier(playerIndex, value);
                }
            };
        }
        private _updateComponentsForValueAsEnergyAddPctOnLoadCo(playerIndex: number): void {
            this._labelValue.visible            = false;
            this._callbackForTouchLabelValue    = null;

            const inputValue                    = this._inputValue;
            const currValue                     = MultiCustomRoom.McrCreateModel.getEnergyAddPctOnLoadCo(playerIndex);
            inputValue.visible                  = true;
            inputValue.text                     = `${currValue}`;
            inputValue.textColor                = getTextColor(currValue, Twns.CommonConstants.WarRuleEnergyAddPctOnLoadCoDefault);
            inputValue.restrict                 = `0-9`;
            inputValue.maxChars                 = 3;
            this._callbackForFocusOutInputValue = () => {
                const text  = inputValue.text;
                const value = text ? Number(text) : NaN;
                if ((isNaN(value))                                                      ||
                    (value > Twns.CommonConstants.WarRuleEnergyAddPctOnLoadCoMaxLimit)    ||
                    (value < Twns.CommonConstants.WarRuleEnergyAddPctOnLoadCoMinLimit)
                ) {
                    Twns.FloatText.show(Lang.getText(LangTextType.A0098));
                } else {
                    MultiCustomRoom.McrCreateModel.setEnergyAddPctOnLoadCo(playerIndex, value);
                }
            };
        }
        private _updateComponentsForValueAsEnergyGrowthMultiplier(playerIndex: number): void {
            this._labelValue.visible            = false;
            this._callbackForTouchLabelValue    = null;

            const inputValue                    = this._inputValue;
            const currValue                     = MultiCustomRoom.McrCreateModel.getEnergyGrowthMultiplier(playerIndex);
            inputValue.visible                  = true;
            inputValue.text                     = `${currValue}`;
            inputValue.textColor                = getTextColor(currValue, Twns.CommonConstants.WarRuleEnergyGrowthMultiplierDefault);
            inputValue.restrict                 = `0-9`;
            inputValue.maxChars                 = 5;
            this._callbackForFocusOutInputValue = () => {
                const text  = inputValue.text;
                const value = text ? Number(text) : NaN;
                if ((isNaN(value))                                                  ||
                    (value > Twns.CommonConstants.WarRuleEnergyGrowthMultiplierMaxLimit) ||
                    (value < Twns.CommonConstants.WarRuleEnergyGrowthMultiplierMinLimit)
                ) {
                    Twns.FloatText.show(Lang.getText(LangTextType.A0098));
                } else {
                    MultiCustomRoom.McrCreateModel.setEnergyGrowthMultiplier(playerIndex, value);
                }
            };
        }
        private _updateComponentsForValueAsCanActivateCoSkill(playerIndex: number): void {
            this._inputValue.visible            = false;
            this._callbackForFocusOutInputValue = null;

            const instanceWarRule               = MultiCustomRoom.McrCreateModel.getInstanceWarRule();
            const canActivateCoSkill            = WarHelpers.WarRuleHelpers.getCanActivateCoSkill(instanceWarRule, playerIndex);
            const labelValue                    = this._labelValue;
            labelValue.visible                  = true;
            labelValue.text                     = Lang.getText(canActivateCoSkill ? LangTextType.B0012 : LangTextType.B0013);
            labelValue.textColor                = canActivateCoSkill ? 0xFFFFFF : 0xFF0000;
            this._callbackForTouchLabelValue    = () => {
                WarHelpers.WarRuleHelpers.setCanActivateCoSkill(instanceWarRule, playerIndex, !canActivateCoSkill);
                this._updateComponentsForValue();
            };
        }
        private _updateComponentsForValueAsMoveRangeModifier(playerIndex: number): void {
            this._labelValue.visible            = false;
            this._callbackForTouchLabelValue    = null;

            const inputValue                    = this._inputValue;
            const currValue                     = MultiCustomRoom.McrCreateModel.getMoveRangeModifier(playerIndex);
            inputValue.visible                  = true;
            inputValue.text                     = `${currValue}`;
            inputValue.textColor                = getTextColor(currValue, Twns.CommonConstants.WarRuleMoveRangeModifierDefault);
            inputValue.restrict                 = `0-9\\-`;
            inputValue.maxChars                 = 3;
            this._callbackForFocusOutInputValue = () => {
                const text  = inputValue.text;
                const value = text ? Number(text) : NaN;
                if ((isNaN(value))                                              ||
                    (value > Twns.CommonConstants.WarRuleMoveRangeModifierMaxLimit)  ||
                    (value < Twns.CommonConstants.WarRuleMoveRangeModifierMinLimit)
                ) {
                    Twns.FloatText.show(Lang.getText(LangTextType.A0098));
                } else {
                    MultiCustomRoom.McrCreateModel.setMoveRangeModifier(playerIndex, value);
                }
            };
        }
        private _updateComponentsForValueAsAttackPowerModifier(playerIndex: number): void {
            this._labelValue.visible            = false;
            this._callbackForTouchLabelValue    = null;

            const inputValue                    = this._inputValue;
            const currValue                     = MultiCustomRoom.McrCreateModel.getAttackPowerModifier(playerIndex);
            inputValue.visible                  = true;
            inputValue.text                     = `${currValue}`;
            inputValue.textColor                = getTextColor(currValue, Twns.CommonConstants.WarRuleOffenseBonusDefault);
            inputValue.restrict                 = `0-9\\-`;
            inputValue.maxChars                 = 5;
            this._callbackForFocusOutInputValue = () => {
                const text  = inputValue.text;
                const value = text ? Number(text) : NaN;
                if ((isNaN(value))                                          ||
                    (value > Twns.CommonConstants.WarRuleOffenseBonusMaxLimit)   ||
                    (value < Twns.CommonConstants.WarRuleOffenseBonusMinLimit)
                ) {
                    Twns.FloatText.show(Lang.getText(LangTextType.A0098));
                } else {
                    MultiCustomRoom.McrCreateModel.setAttackPowerModifier(playerIndex, value);
                }
            };
        }
        private _updateComponentsForValueAsVisionRangeModifier(playerIndex: number): void {
            this._labelValue.visible            = false;
            this._callbackForTouchLabelValue    = null;

            const inputValue                    = this._inputValue;
            const currValue                     = MultiCustomRoom.McrCreateModel.getVisionRangeModifier(playerIndex);
            inputValue.visible                  = true;
            inputValue.text                     = `${currValue}`;
            inputValue.textColor                = getTextColor(currValue, Twns.CommonConstants.WarRuleVisionRangeModifierDefault);
            inputValue.restrict                 = `0-9\\-`;
            inputValue.maxChars                 = 3;
            this._callbackForFocusOutInputValue = () => {
                const text  = inputValue.text;
                const value = text ? Number(text) : NaN;
                if ((isNaN(value))                                                  ||
                    (value > Twns.CommonConstants.WarRuleVisionRangeModifierMaxLimit)    ||
                    (value < Twns.CommonConstants.WarRuleVisionRangeModifierMinLimit)
                ) {
                    Twns.FloatText.show(Lang.getText(LangTextType.A0098));
                } else {
                    MultiCustomRoom.McrCreateModel.setVisionRangeModifier(playerIndex, value);
                }
            };
        }
        private _updateComponentsForValueAsLuckLowerLimit(playerIndex: number): void {
            this._labelValue.visible            = false;
            this._callbackForTouchLabelValue    = null;

            const inputValue                    = this._inputValue;
            const currValue                     = MultiCustomRoom.McrCreateModel.getLuckLowerLimit(playerIndex);
            inputValue.visible                  = true;
            inputValue.text                     = `${currValue}`;
            inputValue.textColor                = getTextColor(currValue, Twns.CommonConstants.WarRuleLuckDefaultLowerLimit);
            inputValue.restrict                 = `0-9\\-`;
            inputValue.maxChars                 = 4;
            this._callbackForFocusOutInputValue = () => {
                const text  = inputValue.text;
                const value = text ? Number(text) : NaN;
                if ((isNaN(value))                                          ||
                    (value > Twns.CommonConstants.WarRuleLuckMaxLimit)           ||
                    (value < Twns.CommonConstants.WarRuleLuckMinLimit)           ||
                    (value > MultiCustomRoom.McrCreateModel.getLuckUpperLimit(playerIndex))
                ) {
                    Twns.FloatText.show(Lang.getText(LangTextType.A0098));
                } else {
                    MultiCustomRoom.McrCreateModel.setLuckLowerLimit(playerIndex, value);
                }
            };
        }
        private _updateComponentsForValueAsLuckUpperLimit(playerIndex: number): void {
            this._labelValue.visible            = false;
            this._callbackForTouchLabelValue    = null;

            const inputValue                    = this._inputValue;
            const currValue                     = MultiCustomRoom.McrCreateModel.getLuckUpperLimit(playerIndex);
            inputValue.visible                  = true;
            inputValue.text                     = `${currValue}`;
            inputValue.textColor                = getTextColor(currValue, Twns.CommonConstants.WarRuleLuckDefaultUpperLimit);
            inputValue.restrict                 = `0-9\\-`;
            inputValue.maxChars                 = 4;
            this._callbackForFocusOutInputValue = () => {
                const text  = inputValue.text;
                const value = text ? Number(text) : NaN;
                if ((isNaN(value))                                          ||
                    (value > Twns.CommonConstants.WarRuleLuckMaxLimit)           ||
                    (value < Twns.CommonConstants.WarRuleLuckMinLimit)           ||
                    (value < MultiCustomRoom.McrCreateModel.getLuckLowerLimit(playerIndex))
                ) {
                    Twns.FloatText.show(Lang.getText(LangTextType.A0098));
                } else {
                    MultiCustomRoom.McrCreateModel.setLuckUpperLimit(playerIndex, value);
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
}

// export default TwnsMcrCreateAdvancedSettingsPage;
