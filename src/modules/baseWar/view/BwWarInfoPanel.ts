
// import TwnsCommonChooseCoPanel  from "../../common/view/CommonChooseCoPanel";
// import TwnsCommonConfirmPanel   from "../../common/view/CommonConfirmPanel";
// import TwnsCommonInputPanel     from "../../common/view/CommonInputPanel";
// import SpwModel                 from "../../singlePlayerWar/model/SpwModel";
// import TwnsClientErrorCode      from "../../tools/helpers/ClientErrorCode";
// import CommonConstants          from "../../tools/helpers/CommonConstants";
// import ConfigManager            from "../../tools/helpers/ConfigManager";
// import FloatText                from "../../tools/helpers/FloatText";
// import Helpers                  from "../../tools/helpers/Helpers";
// import Types                    from "../../tools/helpers/Types";
// import Lang                     from "../../tools/lang/Lang";
// import TwnsLangTextType         from "../../tools/lang/LangTextType";
// import TwnsNotifyType           from "../../tools/notify/NotifyType";
// import ProtoTypes               from "../../tools/proto/ProtoTypes";
// import TwnsUiButton             from "../../tools/ui/UiButton";
// import TwnsUiImage              from "../../tools/ui/UiImage";
// import TwnsUiLabel              from "../../tools/ui/UiLabel";
// import TwnsUiListItemRenderer   from "../../tools/ui/UiListItemRenderer";
// import TwnsUiPanel              from "../../tools/ui/UiPanel";
// import TwnsUiScrollList         from "../../tools/ui/UiScrollList";
// import WarCommonHelpers         from "../../tools/warHelpers/WarCommonHelpers";
// import WarRuleHelpers           from "../../tools/warHelpers/WarRuleHelpers";
// import UserModel                from "../../user/model/UserModel";
// import WarMapModel              from "../../warMap/model/WarMapModel";
// import TwnsBwWar                from "../model/BwWar";

namespace TwnsBwWarInfoPanel {
    import LangTextType         = TwnsLangTextType.LangTextType;
    import NotifyType           = TwnsNotifyType.NotifyType;
    import ClientErrorCode      = TwnsClientErrorCode.ClientErrorCode;
    import IDataForPlayerRule   = ProtoTypes.WarRule.IDataForPlayerRule;

    // eslint-disable-next-line no-shadow
    enum InfoType {
        Player,
        TeamIndex,
        Co,
        Energy,
        CurrentFund,
        BuildingsAndIncome,
        UnitsAndValue,
        InitialFund,
        IncomeMultiplier,
        EnergyAddPctOnLoadCo,
        EnergyGrowthMultiplier,
        MoveRangeModifier,
        AttackPowerModifier,
        VisionRangeModifier,
        LuckLowerLimit,
        LuckUpperLimit,
    }

    type OpenData = {
        war : TwnsBwWar.BwWar;
    };
    export class BwWarInfoPanel extends TwnsUiPanel.UiPanel<OpenData> {
        protected readonly _LAYER_TYPE      = Types.LayerType.Hud0;
        protected readonly _IS_EXCLUSIVE    = false;

        private static _instance            : BwWarInfoPanel;

        private readonly _imgMask!          : TwnsUiImage.UiImage;
        private readonly _group!            : eui.Group;
        private readonly _labelTitle!       : TwnsUiLabel.UiLabel;
        private readonly _labelMapName!     : TwnsUiLabel.UiLabel;
        private readonly _labelMapDesigner! : TwnsUiLabel.UiLabel;
        private readonly _btnClose!         : TwnsUiButton.UiButton;

        private readonly _scroller!         : eui.Scroller;
        private readonly _labelTurnTitle!   : TwnsUiLabel.UiLabel;
        private readonly _labelTurn!        : TwnsUiLabel.UiLabel;
        private readonly _listRuleTitle!    : TwnsUiScrollList.UiScrollList<DataForRuleTitleRenderer>;
        private readonly _listPlayer!       : TwnsUiScrollList.UiScrollList<DataForPlayerRenderer>;

        public static show(openData: OpenData): void {
            if (!BwWarInfoPanel._instance) {
                BwWarInfoPanel._instance = new BwWarInfoPanel();
            }
            BwWarInfoPanel._instance.open(openData);
        }
        public static async hide(): Promise<void> {
            if (BwWarInfoPanel._instance) {
                await BwWarInfoPanel._instance.close();
            }
        }

        public constructor() {
            super();

            this._setIsTouchMaskEnabled();
            this._setIsCloseOnTouchedMask();
            this.skinName = "resource/skins/baseWar/BwWarInfoPanel.exml";
        }

        protected _onOpened(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged, callback: this._onNotifyLanguageChanged },
            ]);
            this._setUiListenerArray([
                { ui: this._btnClose,               callback: this.close },
            ]);
            this._listRuleTitle.setItemRenderer(RuleTitleRenderer);
            this._listPlayer.setItemRenderer(PlayerRenderer);
            this._scroller.scrollPolicyH = eui.ScrollPolicy.OFF;

            this._showOpenAnimation();

            this._updateView();
        }
        protected async _onClosed(): Promise<void> {
            await this._showCloseAnimation();
        }

        private _onNotifyLanguageChanged(): void {
            this._updateComponentsForLanguage();
        }

        ////////////////////////////////////////////////////////////////////////////////
        // View functions.
        ////////////////////////////////////////////////////////////////////////////////
        private _updateView(): void {
            this._updateComponentsForLanguage();

            const playerRuleTypeArray   = getInfoTypeArray();
            this._labelTurn.text        = Helpers.getNumText(this._getOpenData().war.getTurnManager().getTurnIndex());
            this._initListSetting(playerRuleTypeArray);
            this._updateListPlayer(playerRuleTypeArray);
        }

        private _updateComponentsForLanguage(): void {
            this._labelTitle.text       = Lang.getText(LangTextType.B0223);
            this._labelTurnTitle.text   = Lang.getText(LangTextType.B0687).toLocaleUpperCase();
            this._updateLabelMapNameAndDesigner();
        }

        private async _updateLabelMapNameAndDesigner(): Promise<void> {
            const mapId             = this._getOpenData().war.getMapId();
            const labelMapName      = this._labelMapName;
            const labelMapDesigner  = this._labelMapDesigner;
            if (mapId == null) {
                labelMapName.text       = ``;
                labelMapDesigner.text   = ``;
            } else {
                const briefInfo         = Helpers.getExisted(await WarMapModel.getBriefData(mapId), ClientErrorCode.BwWarInfoPanel_UpdateLabelMapNameAndDesigner_00);
                labelMapName.text       = Helpers.getExisted(Lang.getLanguageText({ textArray: briefInfo.mapNameArray }), ClientErrorCode.BwWarInfoPanel_UpdateLabelMapNameAndDesigner_01);
                labelMapDesigner.text   = `${Lang.getText(LangTextType.B0251)}: ${Helpers.getExisted(briefInfo.designerName, ClientErrorCode.BwWarInfoPanel_UpdateLabelMapNameAndDesigner_02)}`;
            }
        }

        private _initListSetting(playerRuleTypeArray: InfoType[]): void {
            const dataArray : DataForRuleTitleRenderer[] = [];
            let index       = 0;
            for (const playerRuleType of playerRuleTypeArray) {
                dataArray.push({
                    index,
                    infoType: playerRuleType,
                });
                ++index;
            }
            this._listRuleTitle.bindData(dataArray);
        }

        private _updateListPlayer(infoTypeArray: InfoType[]): void {
            const war               = this._getOpenData().war;
            const playerRuleArray   = Helpers.getExisted(war.getWarRule().ruleForPlayers?.playerRuleDataArray, ClientErrorCode.BwWarInfoPanel_UpdateListPlayer_00);
            const dataArray         : DataForPlayerRenderer[] = [];
            for (let playerIndex = CommonConstants.WarFirstPlayerIndex; playerIndex <= playerRuleArray.length; ++playerIndex) {
                dataArray.push({
                    war,
                    playerIndex,
                    playerRule      : Helpers.getExisted(playerRuleArray.find(v => v.playerIndex === playerIndex), ClientErrorCode.BwWarInfoPanel_UpdateListPlayer_01),
                    infoTypeArray,
                });
            }
            this._listPlayer.bindData(dataArray);
        }

        private _showOpenAnimation(): void {
            Helpers.resetTween({
                obj         : this._imgMask,
                beginProps  : { alpha: 0 },
                endProps    : { alpha: 1 },
            });
            Helpers.resetTween({
                obj         : this._group,
                beginProps  : { alpha: 0, verticalCenter: 40 },
                endProps    : { alpha: 1, verticalCenter: 0 },
            });
        }
        private _showCloseAnimation(): Promise<void> {
            return new Promise<void>((resolve) => {
                Helpers.resetTween({
                    obj         : this._imgMask,
                    beginProps  : { alpha: 1 },
                    endProps    : { alpha: 0 },
                });
                Helpers.resetTween({
                    obj         : this._group,
                    beginProps  : { alpha: 1, verticalCenter: 0 },
                    endProps    : { alpha: 0, verticalCenter: 40 },
                    callback    : resolve,
                });
            });
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // RuleTitleRenderer
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    type DataForRuleTitleRenderer = {
        index       : number;
        infoType    : InfoType;
    };
    class RuleTitleRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForRuleTitleRenderer> {
        private readonly _imgBg!        : TwnsUiImage.UiImage;
        private readonly _labelName!    : TwnsUiLabel.UiLabel;
        private readonly _btnHelp!      : TwnsUiButton.UiButton;

        protected _onOpened(): void {
            this._setUiListenerArray([
                { ui: this._btnHelp,    callback: this._onTouchedBtnHelp },
            ]);
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,    callback: this._onNotifyLanguageChanged },
            ]);
            this._setShortSfxCode(Types.ShortSfxCode.None);
        }

        protected _onDataChanged(): void {
            this._updateView();
        }

        private _onTouchedBtnHelp(): void {
            // TODO
        }

        private _onNotifyLanguageChanged(): void {
            this._updateView();
        }

        private _updateView(): void {
            const data              = this._getData();
            const infoType          = data.infoType;
            this._imgBg.visible     = data.index % 2 === 0;
            this._labelName.text    = getInfoTypeName(infoType) || CommonConstants.ErrorTextForUndefined;
            this._btnHelp.visible   = false;
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // PlayerRenderer
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    type DataForPlayerRenderer = {
        war             : TwnsBwWar.BwWar;
        playerIndex     : number;
        playerRule      : IDataForPlayerRule;
        infoTypeArray   : InfoType[];
    };
    class PlayerRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForPlayerRenderer> {
        private readonly _labelPlayerName!  : TwnsUiLabel.UiLabel;
        private readonly _imgSkin!          : TwnsUiImage.UiImage;
        private readonly _imgCo!            : TwnsUiImage.UiImage;
        private readonly _listInfo!         : TwnsUiScrollList.UiScrollList<DataForInfoRenderer>;

        protected _onOpened(): void {
            this._listInfo.setItemRenderer(InfoRenderer);
            this._setShortSfxCode(Types.ShortSfxCode.None);
        }

        protected _onDataChanged(): void {
            this.updateView();
        }

        public updateView(): void {
            this._updateComponentsForPlayerInfo();
            this._listInfo.bindData(this._createDataForListInfo());
        }

        public refreshListInfo(): void {
            this._listInfo.refresh();
        }

        private async _updateComponentsForPlayerInfo(): Promise<void> {
            const data                  = this._getData();
            const playerIndex           = data.playerIndex;
            const player                = data.war.getPlayer(playerIndex);
            this._imgSkin.source        = WarCommonHelpers.getImageSourceForCoEyeFrame(player.getUnitAndTileSkinId());
            this._imgCo.source          = ConfigManager.getCoEyeImageSource(player.getCoId(), player.getAliveState() !== Types.PlayerAliveState.Dead);
            this._labelPlayerName.text  = `P${playerIndex}`;
        }

        private _createDataForListInfo(): DataForInfoRenderer[] {
            const data          = this._getData();
            const war           = data.war;
            const playerIndex   = data.playerIndex;
            const dataArray     : DataForInfoRenderer[] = [];
            for (const infoType of data.infoTypeArray) {
                dataArray.push({
                    war,
                    infoType,
                    playerIndex,
                    playerRenderer: this,
                });
            }
            return dataArray;
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // InfoRenderer
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    type DataForInfoRenderer = {
        war                 : TwnsBwWar.BwWar;
        infoType            : InfoType;
        playerIndex         : number;
        playerRenderer      : PlayerRenderer;
    };
    class InfoRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForInfoRenderer> {
        private readonly _btnModify!    : TwnsUiButton.UiButton;
        private readonly _imgModify!    : TwnsUiImage.UiImage;
        private readonly _labelValue!   : TwnsUiLabel.UiLabel;

        protected _onOpened(): void {
            this._setUiListenerArray([
                { ui: this._btnModify, callback: this._onTouchedBtnModify },
            ]);
            this._setShortSfxCode(Types.ShortSfxCode.None);
        }

        protected _onDataChanged(): void {
            this._updateView();
        }

        private _onTouchedBtnModify(): void {
            const infoType = this._getData().infoType;
            if (infoType === InfoType.Player) {
                this._modifyAsPlayer();
            } else if (infoType === InfoType.TeamIndex) {
                this._modifyAsTeamIndex();
            } else if (infoType === InfoType.Co) {
                this._modifyAsCo();
            } else if (infoType === InfoType.Energy) {
                this._modifyAsEnergy();
            } else if (infoType === InfoType.CurrentFund) {
                this._modifyAsCurrentFund();
            } else if (infoType === InfoType.InitialFund) {
                this._modifyAsInitialFund();
            } else if (infoType === InfoType.IncomeMultiplier) {
                this._modifyAsIncomeMultiplier();
            } else if (infoType === InfoType.EnergyAddPctOnLoadCo) {
                this._modifyAsEnergyAddPctOnLoadCo();
            } else if (infoType === InfoType.EnergyGrowthMultiplier) {
                this._modifyAsEnergyGrowthMultiplier();
            } else if (infoType === InfoType.MoveRangeModifier) {
                this._modifyAsMoveRangeModifier();
            } else if (infoType === InfoType.AttackPowerModifier) {
                this._modifyAsAttackPowerModifier();
            } else if (infoType === InfoType.VisionRangeModifier) {
                this._modifyAsVisionRangeModifier();
            } else if (infoType === InfoType.LuckLowerLimit) {
                this._modifyAsLuckLowerLimit();
            } else if (infoType === InfoType.LuckUpperLimit) {
                this._modifyAsLuckUpperLimit();
            } else {
                throw Helpers.newError(`Invalid infoType: ${infoType}`, ClientErrorCode.BwWarInfoPanel_InfoRenderer_OnTouchedBtnModify_00);
            }
        }
        private _modifyAsPlayer(): void {
            const { playerIndex, war }  = this._getData();
            const player                = war.getPlayer(playerIndex);
            const isHuman               = player.getUserId() != null;
            TwnsCommonConfirmPanel.CommonConfirmPanel.show({
                content : isHuman ? Lang.getText(LangTextType.A0110) : Lang.getText(LangTextType.A0111),
                callback: () => {
                    if (!isHuman) {
                        player.setUserId(UserModel.getSelfUserId());
                    } else {
                        player.setUserId(null);
                        SpwModel.checkAndHandleAutoActionsAndRobotRecursively(war);
                    }
                    this._updateView();
                },
            });
        }
        private _modifyAsTeamIndex(): void {
            const { playerIndex, war } = this._getData();
            TwnsCommonConfirmPanel.CommonConfirmPanel.show({
                content : Lang.getFormattedText(LangTextType.F0072, playerIndex),
                callback: () => {
                    const playersCountUnneutral = war.getPlayerManager().getTotalPlayersCount(false);
                    const warRule               = war.getWarRule();
                    WarRuleHelpers.setTeamIndex(warRule, playerIndex, (WarRuleHelpers.getTeamIndex(warRule, playerIndex) % playersCountUnneutral) + 1);
                    this._updateView();
                },
            });
        }
        private _modifyAsCo(): void {
            const { playerIndex, war, playerRenderer }  = this._getData();
            const player                                = war.getPlayer(playerIndex);
            const currentCoId                           = player.getCoId();
            TwnsCommonChooseCoPanel.CommonChooseCoPanel.show({
                currentCoId,
                availableCoIdArray  : ConfigManager.getEnabledCoArray(war.getConfigVersion()).map(v => v.coId),
                callbackOnConfirm   : (newCoId) => {
                    if (newCoId !== currentCoId) {
                        player.setCoId(newCoId);
                        player.setCoCurrentEnergy(Math.min(player.getCoCurrentEnergy(), player.getCoMaxEnergy()));

                        war.getTileMap().getView().updateCoZone();
                        playerRenderer.updateView();
                    }
                },
            });
        }
        private _modifyAsEnergy(): void {
            const { playerIndex, war }  = this._getData();
            const player                = war.getPlayer(playerIndex);
            const minValue              = 0;
            const maxValue              = player.getCoMaxEnergy();
            const currValue             = player.getCoCurrentEnergy();
            TwnsCommonInputPanel.CommonInputPanel.show({
                title           : `P${playerIndex} ${Lang.getText(LangTextType.B0159)}`,
                currentValue    : "" + currValue,
                maxChars        : 4,
                charRestrict    : "0-9",
                tips            : `${Lang.getText(LangTextType.B0319)}: [${minValue}, ${maxValue}]`,
                callback        : panel => {
                    const text  = panel.getInputText();
                    const value = text ? Number(text) : NaN;
                    if ((isNaN(value)) || (value > maxValue) || (value < minValue)) {
                        FloatText.show(Lang.getText(LangTextType.A0098));
                    } else {
                        player.setCoCurrentEnergy(value);
                        this._updateView();
                    }
                },
            });
        }
        private _modifyAsCurrentFund(): void {
            const { playerIndex, war }  = this._getData();
            const player                = war.getPlayer(playerIndex);
            const currValue             = player.getFund();
            const maxValue              = CommonConstants.WarRuleInitialFundMaxLimit;
            const minValue              = CommonConstants.WarRuleInitialFundMinLimit;
            TwnsCommonInputPanel.CommonInputPanel.show({
                title           : `P${player.getPlayerIndex()} ${Lang.getText(LangTextType.B0032)}`,
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
                        player.setFund(value);
                        this._updateView();
                    }
                },
            });
        }
        private _modifyAsInitialFund(): void {
            const { war, playerIndex }  = this._getData();
            const currValue             = war.getCommonSettingManager().getSettingsInitialFund(playerIndex);
            const maxValue              = CommonConstants.WarRuleInitialFundMaxLimit;
            const minValue              = CommonConstants.WarRuleInitialFundMinLimit;
            TwnsCommonInputPanel.CommonInputPanel.show({
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
                        WarRuleHelpers.setInitialFund(war.getWarRule(), playerIndex, value);
                        this._updateView();
                    }
                },
            });
        }
        private _modifyAsIncomeMultiplier(): void {
            const { war, playerIndex }  = this._getData();
            const currValue             = war.getCommonSettingManager().getSettingsIncomeMultiplier(playerIndex);
            const maxValue              = CommonConstants.WarRuleIncomeMultiplierMaxLimit;
            const minValue              = CommonConstants.WarRuleIncomeMultiplierMinLimit;
            TwnsCommonInputPanel.CommonInputPanel.show({
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
                        WarRuleHelpers.setIncomeMultiplier(war.getWarRule(), playerIndex, value);
                        this._updateView();
                    }
                },
            });
        }
        private _modifyAsEnergyAddPctOnLoadCo(): void {
            const { war, playerIndex }  = this._getData();
            const currValue             = war.getCommonSettingManager().getSettingsEnergyAddPctOnLoadCo(playerIndex);
            const minValue              = CommonConstants.WarRuleEnergyAddPctOnLoadCoMinLimit;
            const maxValue              = CommonConstants.WarRuleEnergyAddPctOnLoadCoMaxLimit;
            TwnsCommonInputPanel.CommonInputPanel.show({
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
                        WarRuleHelpers.setEnergyAddPctOnLoadCo(war.getWarRule(), playerIndex, value);
                        this._updateView();
                    }
                },
            });
        }
        private _modifyAsEnergyGrowthMultiplier(): void {
            const { war, playerIndex }  = this._getData();
            const currValue             = war.getCommonSettingManager().getSettingsEnergyGrowthMultiplier(playerIndex);
            const minValue              = CommonConstants.WarRuleEnergyGrowthMultiplierMinLimit;
            const maxValue              = CommonConstants.WarRuleEnergyGrowthMultiplierMaxLimit;
            TwnsCommonInputPanel.CommonInputPanel.show({
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
                        WarRuleHelpers.setEnergyGrowthMultiplier(war.getWarRule(), playerIndex, value);
                        this._updateView();
                    }
                },
            });
        }
        private _modifyAsMoveRangeModifier(): void {
            const { playerIndex, war }  = this._getData();
            const currValue             = war.getCommonSettingManager().getSettingsMoveRangeModifier(playerIndex);
            const minValue              = CommonConstants.WarRuleMoveRangeModifierMinLimit;
            const maxValue              = CommonConstants.WarRuleMoveRangeModifierMaxLimit;
            TwnsCommonInputPanel.CommonInputPanel.show({
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
                        WarRuleHelpers.setMoveRangeModifier(war.getWarRule(), playerIndex, value);
                        this._updateView();
                    }
                },
            });
        }
        private _modifyAsAttackPowerModifier(): void {
            const { war, playerIndex }  = this._getData();
            const currValue             = war.getCommonSettingManager().getSettingsAttackPowerModifier(playerIndex);
            const minValue              = CommonConstants.WarRuleOffenseBonusMinLimit;
            const maxValue              = CommonConstants.WarRuleOffenseBonusMaxLimit;
            TwnsCommonInputPanel.CommonInputPanel.show({
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
                        WarRuleHelpers.setAttackPowerModifier(war.getWarRule(), playerIndex, value);
                        this._updateView();
                    }
                },
            });
        }
        private _modifyAsVisionRangeModifier(): void {
            const { war, playerIndex }  = this._getData();
            const currValue             = war.getCommonSettingManager().getSettingsVisionRangeModifier(playerIndex);
            const minValue              = CommonConstants.WarRuleVisionRangeModifierMinLimit;
            const maxValue              = CommonConstants.WarRuleVisionRangeModifierMaxLimit;
            TwnsCommonInputPanel.CommonInputPanel.show({
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
                        WarRuleHelpers.setVisionRangeModifier(war.getWarRule(), playerIndex, value);
                        this._updateView();
                    }
                },
            });
        }
        private _modifyAsLuckLowerLimit(): void {
            const { war, playerIndex, playerRenderer }  = this._getData();
            const currValue                             = war.getCommonSettingManager().getSettingsLuckLowerLimit(playerIndex);
            const minValue                              = CommonConstants.WarRuleLuckMinLimit;
            const maxValue                              = CommonConstants.WarRuleLuckMaxLimit;
            TwnsCommonInputPanel.CommonInputPanel.show({
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
                        const upperLimit    = war.getCommonSettingManager().getSettingsLuckUpperLimit(playerIndex);
                        const warRule       = war.getWarRule();
                        if (value <= upperLimit) {
                            WarRuleHelpers.setLuckLowerLimit(warRule, playerIndex, value);
                            this._updateView();
                        } else {
                            WarRuleHelpers.setLuckUpperLimit(warRule, playerIndex, value);
                            WarRuleHelpers.setLuckLowerLimit(warRule, playerIndex, upperLimit);
                            playerRenderer.refreshListInfo();
                        }
                    }
                },
            });
        }
        private _modifyAsLuckUpperLimit(): void {
            const { war, playerIndex, playerRenderer }  = this._getData();
            const currValue                             = war.getCommonSettingManager().getSettingsLuckUpperLimit(playerIndex);
            const minValue                              = CommonConstants.WarRuleLuckMinLimit;
            const maxValue                              = CommonConstants.WarRuleLuckMaxLimit;
            TwnsCommonInputPanel.CommonInputPanel.show({
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
                        const lowerLimit    = war.getCommonSettingManager().getSettingsLuckLowerLimit(playerIndex);
                        const warRule       = war.getWarRule();
                        if (value >= lowerLimit) {
                            WarRuleHelpers.setLuckUpperLimit(warRule, playerIndex, value);
                            this._updateView();
                        } else {
                            WarRuleHelpers.setLuckLowerLimit(warRule, playerIndex, value);
                            WarRuleHelpers.setLuckUpperLimit(warRule, playerIndex, lowerLimit);
                            playerRenderer.refreshListInfo();
                        }
                    }
                },
            });
        }

        private _updateView(): void {
            const infoType = this._getData().infoType;
            if (infoType === InfoType.Player) {
                this._updateViewAsPlayer();
            } else if (infoType === InfoType.TeamIndex) {
                this._updateViewAsTeamIndex();
            } else if (infoType === InfoType.Co) {
                this._updateViewAsCo();
            } else if (infoType === InfoType.Energy) {
                this._updateViewAsEnergy();
            } else if (infoType === InfoType.CurrentFund) {
                this._updateViewAsCurrentFund();
            } else if (infoType === InfoType.BuildingsAndIncome) {
                this._updateViewAsBuildingsAndIncome();
            } else if (infoType === InfoType.UnitsAndValue) {
                this._updateViewAsUnitsAndValue();
            } else if (infoType === InfoType.InitialFund) {
                this._updateViewAsInitialFund();
            } else if (infoType === InfoType.IncomeMultiplier) {
                this._updateViewAsIncomeMultiplier();
            } else if (infoType === InfoType.EnergyAddPctOnLoadCo) {
                this._updateViewAsEnergyAddPctOnLoadCo();
            } else if (infoType === InfoType.EnergyGrowthMultiplier) {
                this._updateViewAsEnergyGrowthMultiplier();
            } else if (infoType === InfoType.MoveRangeModifier) {
                this._updateViewAsMoveRangeModifier();
            } else if (infoType === InfoType.AttackPowerModifier) {
                this._updateViewAsAttackPowerModifier();
            } else if (infoType === InfoType.VisionRangeModifier) {
                this._updateViewAsVisionRangeModifier();
            } else if (infoType === InfoType.LuckLowerLimit) {
                this._updateViewAsLuckLowerLimit();
            } else if (infoType === InfoType.LuckUpperLimit) {
                this._updateViewAsLuckUpperLimit();
            } else {
                throw Helpers.newError(`Invalid infoType: ${infoType}`, ClientErrorCode.BwWarInfoPanel_InfoRenderer_UpdateView_00);
            }
        }
        private async _updateViewAsPlayer(): Promise<void> {
            const data              = this._getData();
            const war               = data.war;
            const userId            = war.getPlayer(data.playerIndex).getUserId();
            const labelValue        = this._labelValue;
            labelValue.text         = userId == null
                ? Lang.getText(LangTextType.B0607)
                : Helpers.getExisted(await UserModel.getUserNickname(userId), ClientErrorCode.BwWarInfoPanel_InfoRenderer_UpdateViewAsPlayer_00);
            labelValue.textColor    = 0xFFFFFF;

            const canModify         = checkCanModifyPlayerInfo(war);
            this._btnModify.visible = canModify;
            this._imgModify.visible = canModify;
        }
        private _updateViewAsTeamIndex(): void {
            const data              = this._getData();
            const war               = data.war;
            const teamIndex         = war.getPlayer(data.playerIndex).getTeamIndex();
            const labelValue        = this._labelValue;
            labelValue.text         = Lang.getPlayerTeamName(teamIndex) ?? CommonConstants.ErrorTextForUndefined;
            labelValue.textColor    = 0xFFFFFF;

            const canModify         = checkCanModifyPlayerInfo(war);
            this._btnModify.visible = canModify;
            this._imgModify.visible = canModify;        }
        private _updateViewAsCo(): void {
            const data              = this._getData();
            const war               = data.war;
            const labelValue        = this._labelValue;
            labelValue.text         = ConfigManager.getCoNameAndTierText(war.getConfigVersion(), war.getPlayer(data.playerIndex).getCoId());
            labelValue.textColor    = 0xFFFFFF;

            const canModify         = checkCanModifyPlayerInfo(war);
            this._btnModify.visible = canModify;
            this._imgModify.visible = canModify;
        }
        private _updateViewAsEnergy(): void {
            const data              = this._getData();
            const war               = data.war;
            const labelValue        = this._labelValue;
            labelValue.text         = `${war.getPlayer(data.playerIndex).getCoCurrentEnergy()}`;
            labelValue.textColor    = 0xFFFFFF;

            const canModify         = checkCanModifyPlayerInfo(war);
            this._btnModify.visible = canModify;
            this._imgModify.visible = canModify;
        }
        private _updateViewAsCurrentFund(): void {
            const data              = this._getData();
            const war               = data.war;
            const player            = war.getPlayer(data.playerIndex);
            const labelValue        = this._labelValue;
            labelValue.textColor    = 0xFFFFFF;
            if ((war.getFogMap().checkHasFogCurrently())                                                    &&
                (!war.getPlayerManager().getAliveWatcherTeamIndexesForSelf().has(player.getTeamIndex()))
            ) {
                labelValue.text = `????`;
            } else {
                labelValue.text = `${player.getFund()}`;
            }

            const canModify         = checkCanModifyPlayerInfo(war);
            this._btnModify.visible = canModify;
            this._imgModify.visible = canModify;
        }
        private _updateViewAsBuildingsAndIncome(): void {
            const data              = this._getData();
            const war               = data.war;
            const playerIndex       = data.playerIndex;
            const labelValue        = this._labelValue;
            labelValue.textColor    = 0xFFFFFF;
            if ((war.getFogMap().checkHasFogCurrently())                                                                    &&
                (!war.getPlayerManager().getAliveWatcherTeamIndexesForSelf().has(war.getPlayer(playerIndex).getTeamIndex()))
            ) {
                labelValue.text = `????`;
            } else {
                const tileMap   = war.getTileMap();
                labelValue.text = `${tileMap.getTilesCount(playerIndex)}, +${tileMap.getTotalIncomeForPlayer(playerIndex)}`;
            }
            this._btnModify.visible = false;
            this._imgModify.visible = false;
        }
        private _updateViewAsUnitsAndValue(): void {
            const data              = this._getData();
            const war               = data.war;
            const playerIndex       = data.playerIndex;
            const labelValue        = this._labelValue;
            labelValue.textColor    = 0xFFFFFF;
            if ((war.getFogMap().checkHasFogCurrently())                                                                    &&
                (!war.getPlayerManager().getAliveWatcherTeamIndexesForSelf().has(war.getPlayer(playerIndex).getTeamIndex()))
            ) {
                labelValue.text = `????`;
            } else {
                const unitMap   = war.getUnitMap();
                let count       = 0;
                let value       = 0;
                for (const unit of unitMap.getAllUnitsOnMap()) {
                    if (unit.getPlayerIndex() === playerIndex) {
                        ++count;
                        value += Math.floor(unit.getProductionFinalCost() * unit.getNormalizedCurrentHp() / unit.getNormalizedMaxHp());

                        for (const unitLoaded of unitMap.getUnitsLoadedByLoader(unit, true)) {
                            ++count;
                            value += Math.floor(unitLoaded.getProductionFinalCost() * unitLoaded.getNormalizedCurrentHp() / unitLoaded.getNormalizedMaxHp());
                        }
                    }
                }
                labelValue.text = `${count}, ${value}`;
            }

            this._btnModify.visible = false;
            this._imgModify.visible = false;
        }
        private _updateViewAsInitialFund(): void {
            const data              = this._getData();
            const war               = data.war;
            const currValue         = WarRuleHelpers.getInitialFund(war.getWarRule(), data.playerIndex);
            const labelValue        = this._labelValue;
            labelValue.text         = `${currValue}`;
            labelValue.textColor    = getTextColor(currValue, CommonConstants.WarRuleInitialFundDefault);

            const canModify         = checkCanModifyPlayerInfo(war);
            this._btnModify.visible = canModify;
            this._imgModify.visible = canModify;
        }
        private _updateViewAsIncomeMultiplier(): void {
            const data              = this._getData();
            const war               = data.war;
            const currValue         = WarRuleHelpers.getIncomeMultiplier(war.getWarRule(), data.playerIndex);
            const labelValue        = this._labelValue;
            labelValue.text         = `${currValue}`;
            labelValue.textColor    = getTextColor(currValue, CommonConstants.WarRuleIncomeMultiplierDefault);

            const canModify         = checkCanModifyPlayerInfo(war);
            this._btnModify.visible = canModify;
            this._imgModify.visible = canModify;
        }
        private _updateViewAsEnergyAddPctOnLoadCo(): void {
            const data              = this._getData();
            const war               = data.war;
            const currValue         = WarRuleHelpers.getEnergyAddPctOnLoadCo(war.getWarRule(), data.playerIndex);
            const labelValue        = this._labelValue;
            labelValue.text         = `${currValue}`;
            labelValue.textColor    = getTextColor(currValue, CommonConstants.WarRuleEnergyAddPctOnLoadCoDefault);

            const canModify         = checkCanModifyPlayerInfo(war);
            this._btnModify.visible = canModify;
            this._imgModify.visible = canModify;
        }
        private _updateViewAsEnergyGrowthMultiplier(): void {
            const data              = this._getData();
            const war               = data.war;
            const currValue         = WarRuleHelpers.getEnergyGrowthMultiplier(war.getWarRule(), data.playerIndex);
            const labelValue        = this._labelValue;
            labelValue.text         = `${currValue}`;
            labelValue.textColor    = getTextColor(currValue, CommonConstants.WarRuleEnergyGrowthMultiplierDefault);

            const canModify         = checkCanModifyPlayerInfo(war);
            this._btnModify.visible = canModify;
            this._imgModify.visible = canModify;
        }
        private _updateViewAsMoveRangeModifier(): void {
            const data              = this._getData();
            const war               = data.war;
            const currValue         = WarRuleHelpers.getMoveRangeModifier(war.getWarRule(), data.playerIndex);
            const labelValue        = this._labelValue;
            labelValue.text         = `${currValue}`;
            labelValue.textColor    = getTextColor(currValue, CommonConstants.WarRuleMoveRangeModifierDefault);

            const canModify         = checkCanModifyPlayerInfo(war);
            this._btnModify.visible = canModify;
            this._imgModify.visible = canModify;
        }
        private _updateViewAsAttackPowerModifier(): void {
            const data              = this._getData();
            const war               = data.war;
            const currValue         = WarRuleHelpers.getAttackPowerModifier(war.getWarRule(), data.playerIndex);
            const labelValue        = this._labelValue;
            labelValue.text         = `${currValue}`;
            labelValue.textColor    = getTextColor(currValue, CommonConstants.WarRuleOffenseBonusDefault);

            const canModify         = checkCanModifyPlayerInfo(war);
            this._btnModify.visible = canModify;
            this._imgModify.visible = canModify;
        }
        private _updateViewAsVisionRangeModifier(): void {
            const data              = this._getData();
            const war               = data.war;
            const currValue         = WarRuleHelpers.getVisionRangeModifier(war.getWarRule(), data.playerIndex);
            const labelValue        = this._labelValue;
            labelValue.text         = `${currValue}`;
            labelValue.textColor    = getTextColor(currValue, CommonConstants.WarRuleVisionRangeModifierDefault);

            const canModify         = checkCanModifyPlayerInfo(war);
            this._btnModify.visible = canModify;
            this._imgModify.visible = canModify;
        }
        private _updateViewAsLuckLowerLimit(): void {
            const data              = this._getData();
            const war               = data.war;
            const currValue         = WarRuleHelpers.getLuckLowerLimit(war.getWarRule(), data.playerIndex);
            const labelValue        = this._labelValue;
            labelValue.text         = `${currValue}`;
            labelValue.textColor    = getTextColor(currValue, CommonConstants.WarRuleLuckDefaultLowerLimit);

            const canModify         = checkCanModifyPlayerInfo(war);
            this._btnModify.visible = canModify;
            this._imgModify.visible = canModify;
        }
        private _updateViewAsLuckUpperLimit(): void {
            const data              = this._getData();
            const war               = data.war;
            const currValue         = WarRuleHelpers.getLuckUpperLimit(war.getWarRule(), data.playerIndex);
            const labelValue        = this._labelValue;
            labelValue.text         = `${currValue}`;
            labelValue.textColor    = getTextColor(currValue, CommonConstants.WarRuleLuckDefaultUpperLimit);

            const canModify         = checkCanModifyPlayerInfo(war);
            this._btnModify.visible = canModify;
            this._imgModify.visible = canModify;
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

    function getInfoTypeArray(): InfoType[] {
        return [
            InfoType.Player,
            InfoType.TeamIndex,
            InfoType.Co,
            InfoType.Energy,
            InfoType.CurrentFund,
            InfoType.BuildingsAndIncome,
            InfoType.UnitsAndValue,
            InfoType.InitialFund,
            InfoType.IncomeMultiplier,
            InfoType.EnergyAddPctOnLoadCo,
            InfoType.EnergyGrowthMultiplier,
            InfoType.MoveRangeModifier,
            InfoType.AttackPowerModifier,
            InfoType.VisionRangeModifier,
            InfoType.LuckLowerLimit,
            InfoType.LuckUpperLimit,
        ];
    }
    function getInfoTypeName(type: InfoType): string | null {
        switch (type) {
            case InfoType.Player                    : return Lang.getText(LangTextType.B0031);
            case InfoType.TeamIndex                 : return Lang.getText(LangTextType.B0019);
            case InfoType.Co                        : return Lang.getText(LangTextType.B0425);
            case InfoType.Energy                    : return Lang.getText(LangTextType.B0033);
            case InfoType.CurrentFund               : return Lang.getText(LangTextType.B0032);
            case InfoType.BuildingsAndIncome        : return Lang.getText(LangTextType.B0689);
            case InfoType.UnitsAndValue             : return Lang.getText(LangTextType.B0688);
            case InfoType.InitialFund               : return Lang.getText(LangTextType.B0178);
            case InfoType.IncomeMultiplier          : return Lang.getText(LangTextType.B0179);
            case InfoType.EnergyAddPctOnLoadCo      : return Lang.getText(LangTextType.B0180);
            case InfoType.EnergyGrowthMultiplier    : return Lang.getText(LangTextType.B0181);
            case InfoType.MoveRangeModifier         : return Lang.getText(LangTextType.B0182);
            case InfoType.AttackPowerModifier       : return Lang.getText(LangTextType.B0183);
            case InfoType.VisionRangeModifier       : return Lang.getText(LangTextType.B0184);
            case InfoType.LuckLowerLimit            : return Lang.getText(LangTextType.B0189);
            case InfoType.LuckUpperLimit            : return Lang.getText(LangTextType.B0190);
            default                                 : return null;
        }
    }
    function checkCanModifyPlayerInfo(war: TwnsBwWar.BwWar): boolean {
        const warType = war.getWarType();
        return (warType === Types.WarType.ScwFog)
            || (warType === Types.WarType.ScwStd)
            || (warType === Types.WarType.SfwFog)
            || (warType === Types.WarType.SfwStd);
    }
}

// export default TwnsBwWarInfoPanel;
