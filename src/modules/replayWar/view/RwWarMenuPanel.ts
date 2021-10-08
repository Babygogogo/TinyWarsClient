
// import TwnsBwPlayer                     from "../../baseWar/model/BwPlayer";
// import TwnsChatPanel                    from "../../chat/view/ChatPanel";
// import TwnsCommonConfirmPanel           from "../../common/view/CommonConfirmPanel";
// import TwnsCommonInputPanel             from "../../common/view/CommonInputPanel";
// import TwnsSpmCreateSfwSaveSlotsPanel   from "../../singlePlayerMode/view/SpmCreateSfwSaveSlotsPanel";
// import TwnsTwWar                        from "../../testWar/model/TwWar";
// import CommonConstants                  from "../../tools/helpers/CommonConstants";
// import ConfigManager                    from "../../tools/helpers/ConfigManager";
// import FloatText                        from "../../tools/helpers/FloatText";
// import FlowManager                      from "../../tools/helpers/FlowManager";
// import Helpers                          from "../../tools/helpers/Helpers";
// import Types                            from "../../tools/helpers/Types";
// import Lang                             from "../../tools/lang/Lang";
// import TwnsLangTextType                 from "../../tools/lang/LangTextType";
// import Notify                           from "../../tools/notify/Notify";
// import TwnsNotifyType                   from "../../tools/notify/NotifyType";
// import ProtoTypes                       from "../../tools/proto/ProtoTypes";
// import TwnsUiButton                     from "../../tools/ui/UiButton";
// import TwnsUiLabel                      from "../../tools/ui/UiLabel";
// import TwnsUiListItemRenderer           from "../../tools/ui/UiListItemRenderer";
// import TwnsUiPanel                      from "../../tools/ui/UiPanel";
// import TwnsUiScrollList                 from "../../tools/ui/UiScrollList";
// import UserModel                        from "../../user/model/UserModel";
// import UserProxy                        from "../../user/model/UserProxy";
// import TwnsUserSettingsPanel            from "../../user/view/UserSettingsPanel";
// import WarMapModel                      from "../../warMap/model/WarMapModel";
// import RwModel                          from "../model/RwModel";
// import RwProxy                          from "../model/RwProxy";
// import TwnsRwWar                        from "../model/RwWar";

namespace TwnsRwWarMenuPanel {
    import NotifyType                   = TwnsNotifyType.NotifyType;
    import LangTextType                 = TwnsLangTextType.LangTextType;

    // eslint-disable-next-line no-shadow
    enum MenuType {
        Main,
        Advanced,
    }

    export class RwWarMenuPanel extends TwnsUiPanel.UiPanel<void> {
        protected readonly _LAYER_TYPE   = Types.LayerType.Hud0;
        protected readonly _IS_EXCLUSIVE = false;

        private static _instance: RwWarMenuPanel;

        private readonly _group!                : eui.Group;
        private readonly _listCommand!          : TwnsUiScrollList.UiScrollList<DataForCommandRenderer>;
        private readonly _labelNoCommand!       : TwnsUiLabel.UiLabel;
        private readonly _btnBack!              : TwnsUiButton.UiButton;

        private readonly _groupInfo!            : eui.Group;
        private readonly _labelMenuTitle!       : TwnsUiLabel.UiLabel;
        private readonly _labelWarInfoTitle!    : TwnsUiLabel.UiLabel;
        private readonly _labelPlayerInfoTitle! : TwnsUiLabel.UiLabel;
        private readonly _btnMapName!           : TwnsUiButton.UiButton;
        private readonly _labelMapName!         : TwnsUiLabel.UiLabel;
        private readonly _btnMapDesigner!       : TwnsUiButton.UiButton;
        private readonly _labelMapDesigner!     : TwnsUiLabel.UiLabel;
        private readonly _btnWarId!             : TwnsUiButton.UiButton;
        private readonly _labelWarId!           : TwnsUiLabel.UiLabel;
        private readonly _btnTurnIndex!         : TwnsUiButton.UiButton;
        private readonly _labelTurnIndex!       : TwnsUiLabel.UiLabel;
        private readonly _btnActionId!          : TwnsUiButton.UiButton;
        private readonly _labelActionId!        : TwnsUiLabel.UiLabel;
        private readonly _listPlayer!           : TwnsUiScrollList.UiScrollList<DataForPlayerRenderer>;

        private _menuType       = MenuType.Main;

        public static show(): void {
            if (!RwWarMenuPanel._instance) {
                RwWarMenuPanel._instance = new RwWarMenuPanel();
            }
            RwWarMenuPanel._instance.open();
        }
        public static async hide(): Promise<void> {
            if (RwWarMenuPanel._instance) {
                await RwWarMenuPanel._instance.close();
            }
        }
        public static getIsOpening(): boolean {
            const instance = RwWarMenuPanel._instance;
            return instance ? instance.getIsOpening() : false;
        }

        public constructor() {
            super();

            this.skinName = `resource/skins/replayWar/RwWarMenuPanel.exml`;
        }

        protected _onOpened(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,                    callback: this._onNotifyLanguageChanged },
                { type: NotifyType.BwActionPlannerStateSet,        callback: this._onNotifyMcwPlannerStateChanged },
                { type: NotifyType.UnitAndTileTextureVersionChanged,   callback: this._onNotifyUnitAndTileTextureVersionChanged },
                { type: NotifyType.MsgSpmCreateSfw,                    callback: this._onNotifyMsgSpmCreateSfw },
                { type: NotifyType.MsgReplaySetRating,                 callback: this._onMsgReplaySetRating },
            ]);
            this._setUiListenerArray([
                { ui: this._btnBack, callback: this._onTouchedBtnBack },
            ]);
            this._listCommand.setItemRenderer(CommandRenderer);
            this._listPlayer.setItemRenderer(PlayerRenderer);

            this._menuType = MenuType.Main;
            this._updateView();

            Notify.dispatch(NotifyType.BwWarMenuPanelOpened);
        }
        protected async _onClosed(): Promise<void> {
            Notify.dispatch(NotifyType.BwWarMenuPanelClosed);
        }

        private _getWar(): TwnsRwWar.RwWar {
            return Helpers.getExisted(RwModel.getWar());
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Callbacks.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _onNotifyMcwPlannerStateChanged(): void {
            this._updateListPlayer();
        }

        private _onNotifyUnitAndTileTextureVersionChanged(): void {
            this._updateView();
        }

        private _onNotifyLanguageChanged(): void {
            this._updateComponentsForLanguage();
        }

        private _onNotifyMsgSpmCreateSfw(e: egret.Event): void {
            const data = e.data as ProtoTypes.NetMessage.MsgSpmCreateSfw.IS;
            TwnsCommonConfirmPanel.CommonConfirmPanel.show({
                content : Lang.getText(LangTextType.A0107),
                callback: () => {
                    FlowManager.gotoSinglePlayerWar({
                        slotIndex       : Helpers.getExisted(data.slotIndex),
                        slotExtraData   : Helpers.getExisted(data.extraData),
                        warData         : Helpers.getExisted(data.warData),
                    });
                },
            });
        }

        private _onMsgReplaySetRating(): void {
            FloatText.show(Lang.getText(LangTextType.A0106));
        }

        private _onTouchedBtnBack(): void {
            const type = this._menuType;
            if (type === MenuType.Main) {
                this.close();
            } else if (type === MenuType.Advanced) {
                this._menuType = MenuType.Main;
                this._updateListCommand();
            } else {
                throw Helpers.newError(`Invalid menuType: ${type}`);
            }
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Functions for view.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _updateView(): void {
            this._updateComponentsForLanguage();
            this._updateListCommand();
            this._updateGroupInfo();
            this._updateListPlayer();
        }

        private _updateListCommand(): void {
            const dataArray = this._createDataForList();
            if (!dataArray.length) {
                this._labelNoCommand.visible = true;
                this._listCommand.clear();
            } else {
                this._labelNoCommand.visible = false;
                this._listCommand.bindData(dataArray);
            }
        }

        private _updateComponentsForLanguage(): void {
            this._labelMenuTitle.text       = Lang.getText(LangTextType.B0155);
            this._labelWarInfoTitle.text    = Lang.getText(LangTextType.B0223);
            this._labelPlayerInfoTitle.text = Lang.getText(LangTextType.B0224);
            this._btnMapName.label          = Lang.getText(LangTextType.B0225);
            this._btnMapDesigner.label      = Lang.getText(LangTextType.B0163);
            this._btnWarId.label            = Lang.getText(LangTextType.B0235);
            this._btnTurnIndex.label        = Lang.getText(LangTextType.B0091);
            this._btnActionId.label         = Lang.getText(LangTextType.B0090);
            this._btnBack.label             = Lang.getText(LangTextType.B0146);
        }

        private async _updateGroupInfo(): Promise<void> {
            const war                   = this._getWar();
            const mapId                 = war.getMapId();
            this._labelMapName.text     = await WarMapModel.getMapNameInCurrentLanguage(mapId) || "----";
            this._labelMapDesigner.text = await WarMapModel.getDesignerName(mapId) || "----";
            this._labelWarId.text       = `${war.getReplayId()}`;
            this._labelTurnIndex.text   = `${war.getTurnManager().getTurnIndex()}`;
            this._labelActionId.text    = `${war.getNextActionId()} / ${war.getExecutedActionManager().getExecutedActionsCount()}`;
        }

        private _updateListPlayer(): void {
            const war   = this._getWar();
            const data  : DataForPlayerRenderer[] = [];
            war.getPlayerManager().forEachPlayer(false, player => {
                data.push({
                    war,
                    player,
                });
            });
            this._listPlayer.bindData(data.sort((p1, p2) => p1.player.getPlayerIndex() - p2.player.getPlayerIndex()));
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Menu item data creators.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _createDataForList(): DataForCommandRenderer[] {
            const type = this._menuType;
            if (type === MenuType.Main) {
                return this._createDataForMainMenu();
            } else if (type === MenuType.Advanced) {
                return this._createDataForAdvancedMenu();
            } else {
                throw Helpers.newError(`McwWarMenuPanel._createDataForList() invalid this._menuType: ${type}`);
            }
        }

        private _createDataForMainMenu(): DataForCommandRenderer[] {
            return Helpers.getNonNullElements([
                this._createCommandOpenAdvancedMenu(),
                this._createCommandRate(),
                // this._createCommandChat(),
                this._createCommandGotoRwReplayListPanel(),
                this._createCommandGotoLobby(),
            ]);
        }

        private _createDataForAdvancedMenu(): DataForCommandRenderer[] {
            return Helpers.getNonNullElements([
                this._createCommandSimulation(),
                this._createCommandCreateMfr(),
                this._createCommandUserSettings(),
                this._createCommandSetPathMode(),
            ]);
        }

        private _createCommandOpenAdvancedMenu(): DataForCommandRenderer | null {
            return {
                name    : Lang.getText(LangTextType.B0080),
                callback: () => {
                    this._menuType = MenuType.Advanced;
                    this._updateListCommand();
                },
            };
        }

        private _createCommandRate(): DataForCommandRenderer | null {
            return {
                name    : Lang.getText(LangTextType.B0365),
                callback: () => {
                    TwnsCommonInputPanel.CommonInputPanel.show({
                        title           : `${Lang.getText(LangTextType.B0365)}`,
                        currentValue    : "",
                        maxChars        : 2,
                        charRestrict    : "0-9",
                        tips            : `${Lang.getText(LangTextType.B0319)}: [${CommonConstants.ReplayMinRating}, ${CommonConstants.ReplayMaxRating}]`,
                        callback        : panel => {
                            const text  = panel.getInputText();
                            const value = Number(text);
                            if ((!text) || (isNaN(value)) || (value > CommonConstants.ReplayMaxRating) || (value < CommonConstants.ReplayMinRating)) {
                                FloatText.show(Lang.getText(LangTextType.A0098));
                            } else {
                                RwProxy.reqReplaySetRating(this._getWar().getReplayId(), value);
                            }
                        },
                    });
                },
            };
        }

        private _createCommandChat(): DataForCommandRenderer | null {
            return {
                name    : Lang.getText(LangTextType.B0383),
                callback: () => {
                    this.close();
                    TwnsChatPanel.ChatPanel.show({});
                },
            };
        }

        private _createCommandGotoRwReplayListPanel(): DataForCommandRenderer | null {
            return {
                name    : Lang.getText(LangTextType.B0651),
                callback: () => {
                    TwnsCommonConfirmPanel.CommonConfirmPanel.show({
                        title   : Lang.getText(LangTextType.B0651),
                        content : Lang.getText(LangTextType.A0225),
                        callback: () => FlowManager.gotoRwReplayListPanel(),
                    });
                },
            };
        }

        private _createCommandGotoLobby(): DataForCommandRenderer | null {
            return {
                name    : Lang.getText(LangTextType.B0054),
                callback: () => {
                    TwnsCommonConfirmPanel.CommonConfirmPanel.show({
                        title   : Lang.getText(LangTextType.B0054),
                        content : Lang.getText(LangTextType.A0025),
                        callback: () => FlowManager.gotoLobby(),
                    });
                },
            };
        }

        private _createCommandSimulation(): DataForCommandRenderer | null {
            const war = this._getWar();
            return {
                name    : Lang.getText(LangTextType.B0325),
                callback: () => {
                    if (war.getIsExecutingAction()) {
                        FloatText.show(Lang.getText(LangTextType.A0103));
                    } else {
                        TwnsSpmCreateSfwSaveSlotsPanel.SpmCreateSfwSaveSlotsPanel.show(war.serializeForCreateSfw());
                    }
                },
            };
        }

        private _createCommandCreateMfr(): DataForCommandRenderer | null {
            const war = this._getWar();
            return {
                name    : Lang.getText(LangTextType.B0557),
                callback: async () => {
                    if (war.getPlayerManager().getAliveOrDyingTeamsCount(false) < 2) {
                        FloatText.show(Lang.getText(LangTextType.A0199));
                        return;
                    }

                    const warData = war.serializeForCreateMfr();
                    if (warData == null) {
                        FloatText.show(Lang.getText(LangTextType.A0200));
                        return;
                    }

                    const errorCode = await (new TwnsTwWar.TwWar()).getErrorCodeForInit(warData);
                    if (errorCode) {
                        FloatText.show(Lang.getErrorText(errorCode));
                        return;
                    }

                    TwnsCommonConfirmPanel.CommonConfirmPanel.show({
                        content : Lang.getText(LangTextType.A0201),
                        callback: () => {
                            FlowManager.gotoMfrCreateSettingsPanel(warData);
                        }
                    });
                }
            };
        }
        private _createCommandUserSettings(): DataForCommandRenderer | null {
            return {
                name    : Lang.getText(LangTextType.B0560),
                callback: () => {
                    TwnsUserSettingsPanel.UserSettingsPanel.show();
                }
            };
        }
        private _createCommandSetPathMode(): DataForCommandRenderer {
            return {
                name    : Lang.getText(LangTextType.B0430),
                callback: () => {
                    const isEnabled = UserModel.getSelfSettingsIsSetPathMode();
                    TwnsCommonConfirmPanel.CommonConfirmPanel.show({
                        content : Lang.getFormattedText(
                            LangTextType.F0033,
                            Lang.getText(isEnabled ? LangTextType.B0431 : LangTextType.B0432),
                        ),
                        textForConfirm  : Lang.getText(LangTextType.B0433),
                        textForCancel   : Lang.getText(LangTextType.B0434),
                        callback: () => {
                            if (!isEnabled) {
                                UserProxy.reqUserSetSettings({
                                    isSetPathMode   : true,
                                });
                            }
                        },
                        callbackOnCancel: () => {
                            if (isEnabled) {
                                UserProxy.reqUserSetSettings({
                                    isSetPathMode   : false,
                                });
                            }
                        }
                    });
                }
            };
        }
    }

    type DataForCommandRenderer = {
        name    : string;
        callback: () => void;
    };

    class CommandRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForCommandRenderer> {
        private readonly _group!        : eui.Group;
        private readonly _labelName!    : TwnsUiLabel.UiLabel;

        protected _onDataChanged(): void {
            this._updateView();
        }

        public onItemTapEvent(): void {
            this._getData().callback();
        }

        private _updateView(): void {
            const data              = this._getData();
            this._labelName.text    = data.name;
        }
    }

    type DataForPlayerRenderer = {
        war     : TwnsRwWar.RwWar;
        player  : TwnsBwPlayer.BwPlayer;
    };

    class PlayerRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForPlayerRenderer> {
        private readonly _group!        : eui.Group;
        private readonly _labelName!    : TwnsUiLabel.UiLabel;
        private readonly _labelForce!   : TwnsUiLabel.UiLabel;
        private readonly _labelLost!    : TwnsUiLabel.UiLabel;
        private readonly _listInfo!     : TwnsUiScrollList.UiScrollList<DataForInfoRenderer>;

        protected _onOpened(): void {
            this._listInfo.setItemRenderer(InfoRenderer);
        }

        protected async _onDataChanged(): Promise<void> {
            const data                  = this._getData();
            const war                   = data.war;
            const player                = data.player;
            this._labelName.text        = await player.getNickname();
            this._labelName.textColor   = player === war.getPlayerInTurn() ? 0x00FF00 : 0xFFFFFF;
            this._labelForce.text       = `${Lang.getPlayerForceName(player.getPlayerIndex())}`
                + `  ${Lang.getPlayerTeamName(player.getTeamIndex())}`
                + `  ${player === war.getPlayerInTurn() ? Lang.getText(LangTextType.B0086) : ""}`;

            if (player.getAliveState() !== Types.PlayerAliveState.Alive) {
                this._labelLost.visible = true;
                this._listInfo.visible  = false;
            } else {
                this._labelLost.visible = false;
                this._listInfo.visible  = true;
                this._listInfo.bindData(this._createDataForListInfo());
            }
        }

        private _createDataForListInfo(): DataForInfoRenderer[] {
            const data          = this._getData();
            const war           = data.war;
            const player        = data.player;
            const playerIndex   = player.getPlayerIndex();
            return [
                this._createDataColor(war, playerIndex, player),
                this._createDataFund(war, playerIndex, player),
                this._createDataBuildings(war, playerIndex, player),
                this._createDataCoName(war, playerIndex, player),
                this._createDataEnergy(war, playerIndex, player),
                this._createDataUnitAndValue(war, playerIndex, player),
                this._createDataInitialFund(war, playerIndex, player),
                this._createDataIncomeMultiplier(war, playerIndex, player),
                this._createDataEnergyAddPctOnLoadCo(war, playerIndex, player),
                this._createDataEnergyGrowthMultiplier(war, playerIndex, player),
                this._createDataMoveRangeModifier(war, playerIndex, player),
                this._createDataAttackPowerModifier(war, playerIndex, player),
                this._createDataVisionRangeModifier(war, playerIndex, player),
                this._createDataLuckLowerLimit(war, playerIndex, player),
                this._createDataLuckUpperLimit(war, playerIndex, player),
            ];
        }
        private _createDataColor(
            war         : TwnsRwWar.RwWar,
            playerIndex : number,
            player      : TwnsBwPlayer.BwPlayer,
        ): DataForInfoRenderer {
            return {
                titleText   : Lang.getText(LangTextType.B0397),
                infoText    : Lang.getUnitAndTileSkinName(player.getUnitAndTileSkinId()) || CommonConstants.ErrorTextForUndefined,
                infoColor   : 0xFFFFFF,
            };
        }
        private _createDataFund(
            war         : TwnsRwWar.RwWar,
            playerIndex : number,
            player      : TwnsBwPlayer.BwPlayer,
        ): DataForInfoRenderer {
            return {
                titleText               : Lang.getText(LangTextType.B0032),
                infoText                : `${player.getFund()}`,
                infoColor               : 0xFFFFFF,
            };
        }
        private _createDataBuildings(
            war         : TwnsRwWar.RwWar,
            playerIndex : number,
            player      : TwnsBwPlayer.BwPlayer,
        ): DataForInfoRenderer {
            const info = this._getTilesCountAndIncome(war, playerIndex);
            return {
                titleText               : Lang.getText(LangTextType.B0158),
                infoText                : `${info.count} / +${info.income}`,
                infoColor               : 0xFFFFFF,
            };
        }
        private _createDataCoName(
            war         : TwnsRwWar.RwWar,
            playerIndex : number,
            player      : TwnsBwPlayer.BwPlayer,
        ): DataForInfoRenderer {
            const cfg = ConfigManager.getCoBasicCfg(war.getConfigVersion(), player.getCoId());
            return {
                titleText               : `CO`,
                infoText                : !cfg
                    ? `(${Lang.getText(LangTextType.B0001)})`
                    : `${cfg.name}(T${cfg.tier})`,
                infoColor               : 0xFFFFFF,
            };
        }
        private _createDataEnergy(
            war         : TwnsRwWar.RwWar,
            playerIndex : number,
            player      : TwnsBwPlayer.BwPlayer,
        ): DataForInfoRenderer {
            const currValue         = player.getCoCurrentEnergy();
            const powerEnergy       = player.getCoPowerEnergy();
            const superPowerEnergy  = player.getCoSuperPowerEnergy();
            const skillType         = player.getCoUsingSkillType();
            const hasLoadedCo       = war.getUnitMap().checkIsCoLoadedByAnyUnit(playerIndex);
            const currEnergyText    = skillType === Types.CoSkillType.Passive
                ? "" + currValue
                : skillType === Types.CoSkillType.Power ? "COP" : "SCOP";

            return {
                titleText               : Lang.getText(LangTextType.B0159),
                infoText                : `${!hasLoadedCo ? `--` : currEnergyText} / ${powerEnergy == null ? "--" : powerEnergy} / ${superPowerEnergy == null ? "--" : superPowerEnergy}`,
                infoColor               : 0xFFFFFF,
            };
        }
        private _createDataUnitAndValue(
            war         : TwnsRwWar.RwWar,
            playerIndex : number,
            player      : TwnsBwPlayer.BwPlayer,
        ): DataForInfoRenderer {
            const unitsCountAndValue = this._getUnitsCountAndValue(war, playerIndex);
            return {
                titleText               : Lang.getText(LangTextType.B0160),
                infoText                : `${unitsCountAndValue.count} / ${unitsCountAndValue.value}`,
                infoColor               : 0xFFFFFF,
            };
        }
        private _createDataInitialFund(
            war         : TwnsRwWar.RwWar,
            playerIndex : number,
            player      : TwnsBwPlayer.BwPlayer,
        ): DataForInfoRenderer {
            const currValue = war.getCommonSettingManager().getSettingsInitialFund(playerIndex);
            return {
                titleText               : Lang.getText(LangTextType.B0178),
                infoText                : `${currValue}`,
                infoColor               : getTextColor(currValue, CommonConstants.WarRuleInitialFundDefault),
            };
        }
        private _createDataIncomeMultiplier(
            war         : TwnsRwWar.RwWar,
            playerIndex : number,
            player      : TwnsBwPlayer.BwPlayer,
        ): DataForInfoRenderer {
            const currValue = war.getCommonSettingManager().getSettingsIncomeMultiplier(playerIndex);
            return {
                titleText               : Lang.getText(LangTextType.B0179),
                infoText                : `${currValue}%`,
                infoColor               : getTextColor(currValue, CommonConstants.WarRuleIncomeMultiplierDefault),
            };
        }
        private _createDataEnergyAddPctOnLoadCo(
            war         : TwnsRwWar.RwWar,
            playerIndex : number,
            player      : TwnsBwPlayer.BwPlayer,
        ): DataForInfoRenderer {
            const currValue = war.getCommonSettingManager().getSettingsEnergyAddPctOnLoadCo(playerIndex);
            return {
                titleText               : Lang.getText(LangTextType.B0180),
                infoText                : `${currValue}%`,
                infoColor               : getTextColor(currValue, CommonConstants.WarRuleEnergyAddPctOnLoadCoDefault),
            };
        }
        private _createDataEnergyGrowthMultiplier(
            war         : TwnsRwWar.RwWar,
            playerIndex : number,
            player      : TwnsBwPlayer.BwPlayer,
        ): DataForInfoRenderer {
            const currValue = war.getCommonSettingManager().getSettingsEnergyGrowthMultiplier(playerIndex);
            return {
                titleText               : Lang.getText(LangTextType.B0181),
                infoText                : `${currValue}%`,
                infoColor               : getTextColor(currValue, CommonConstants.WarRuleEnergyGrowthMultiplierDefault),
            };
        }
        private _createDataMoveRangeModifier(
            war         : TwnsRwWar.RwWar,
            playerIndex : number,
            player      : TwnsBwPlayer.BwPlayer,
        ): DataForInfoRenderer {
            const currValue = war.getCommonSettingManager().getSettingsMoveRangeModifier(playerIndex);
            return {
                titleText               : Lang.getText(LangTextType.B0182),
                infoText                : `${currValue}`,
                infoColor               : getTextColor(currValue, CommonConstants.WarRuleMoveRangeModifierDefault),
            };
        }
        private _createDataAttackPowerModifier(
            war         : TwnsRwWar.RwWar,
            playerIndex : number,
            player      : TwnsBwPlayer.BwPlayer,
        ): DataForInfoRenderer {
            const currValue = war.getCommonSettingManager().getSettingsAttackPowerModifier(playerIndex);
            return {
                titleText               : Lang.getText(LangTextType.B0183),
                infoText                : `${currValue}%`,
                infoColor               : getTextColor(currValue, CommonConstants.WarRuleOffenseBonusDefault),
            };
        }
        private _createDataVisionRangeModifier(
            war         : TwnsRwWar.RwWar,
            playerIndex : number,
            player      : TwnsBwPlayer.BwPlayer,
        ): DataForInfoRenderer {
            const currValue = war.getCommonSettingManager().getSettingsVisionRangeModifier(playerIndex);
            return {
                titleText               : Lang.getText(LangTextType.B0184),
                infoText                : `${currValue}`,
                infoColor               : getTextColor(currValue, CommonConstants.WarRuleVisionRangeModifierDefault),
            };
        }
        private _createDataLuckLowerLimit(
            war         : TwnsRwWar.RwWar,
            playerIndex : number,
            player      : TwnsBwPlayer.BwPlayer,
        ): DataForInfoRenderer {
            const currValue = war.getCommonSettingManager().getSettingsLuckLowerLimit(playerIndex);
            return {
                titleText               : Lang.getText(LangTextType.B0189),
                infoText                : `${currValue}%`,
                infoColor               : getTextColor(currValue, CommonConstants.WarRuleLuckDefaultLowerLimit),
            };
        }
        private _createDataLuckUpperLimit(
            war         : TwnsRwWar.RwWar,
            playerIndex : number,
            player      : TwnsBwPlayer.BwPlayer,
        ): DataForInfoRenderer {
            const currValue = war.getCommonSettingManager().getSettingsLuckUpperLimit(playerIndex);
            return {
                titleText               : Lang.getText(LangTextType.B0190),
                infoText                : `${currValue}%`,
                infoColor               : getTextColor(currValue, CommonConstants.WarRuleLuckDefaultUpperLimit),
            };
        }

        private _getTilesCountAndIncome(war: TwnsRwWar.RwWar, playerIndex: number): { count: number, income: number } {
            let count   = 0;
            let income  = 0;
            for (const tile of war.getTileMap().getAllTiles()) {
                if (tile.getPlayerIndex() === playerIndex) {
                    ++count;
                    income += tile.getIncomeForPlayer(playerIndex);
                }
            }
            return { count, income };
        }

        private _getUnitsCountAndValue(war: TwnsRwWar.RwWar, playerIndex: number): { count: number, value: number } {
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
            return { count, value };
        }
    }

    type DataForInfoRenderer = {
        titleText               : string;
        infoText                : string;
        infoColor               : number;
    };

    class InfoRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForInfoRenderer> {
        private readonly _btnTitle!     : TwnsUiButton.UiButton;
        private readonly _labelValue!   : TwnsUiLabel.UiLabel;

        protected _onDataChanged(): void {
            const data                  = this._getData();
            this._labelValue.text       = data.infoText;
            this._labelValue.textColor  = data.infoColor;
            this._btnTitle.label        = data.titleText;
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

// export default TwnsRwWarMenuPanel;
