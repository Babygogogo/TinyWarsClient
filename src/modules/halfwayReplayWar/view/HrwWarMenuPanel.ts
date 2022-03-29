
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace TwnsHrwWarMenuPanel {
    import NotifyType           = TwnsNotifyType.NotifyType;
    import LangTextType         = TwnsLangTextType.LangTextType;
    import ClientErrorCode      = TwnsClientErrorCode.ClientErrorCode;

    // eslint-disable-next-line no-shadow
    enum MenuType {
        Main,
        Advanced,
    }

    export type OpenData = void;
    export class HrwWarMenuPanel extends TwnsUiPanel.UiPanel<OpenData> {
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

        protected _onOpening(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,                     callback: this._onNotifyLanguageChanged },
                { type: NotifyType.BwActionPlannerStateSet,             callback: this._onNotifyMcwPlannerStateChanged },
                { type: NotifyType.UnitAndTileTextureVersionChanged,    callback: this._onNotifyUnitAndTileTextureVersionChanged },
                { type: NotifyType.MsgSpmCreateSfw,                     callback: this._onNotifyMsgSpmCreateSfw },
                { type: NotifyType.MsgMpwCommonContinueWarFailed,       callback: this._onNotifyMsgMpwCommonContinueWarFailed },
            ]);
            this._setUiListenerArray([
                { ui: this._btnBack, callback: this._onTouchedBtnBack },
            ]);
            this._setIsTouchMaskEnabled();
            this._setIsCloseOnTouchedMask();

            this._listCommand.setItemRenderer(CommandRenderer);
            this._listPlayer.setItemRenderer(PlayerRenderer);
        }
        protected async _updateOnOpenDataChanged(): Promise<void> {
            this._menuType = MenuType.Main;
            this._updateView();
        }
        protected _onClosing(): void {
            // nothing to do
        }

        private _getWar(): TwnsHrwWar.HrwWar {
            return Helpers.getExisted(HrwModel.getWar());
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
            const data = e.data as CommonProto.NetMessage.MsgSpmCreateSfw.IS;
            TwnsPanelManager.open(TwnsPanelConfig.Dict.CommonConfirmPanel, {
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

        private _onNotifyMsgMpwCommonContinueWarFailed(): void {
            TwnsPanelManager.close(TwnsPanelConfig.Dict.CommonBlockPanel);
        }

        private _onTouchedBtnBack(): void {
            const type = this._menuType;
            if (type === MenuType.Main) {
                this.close();
            } else if (type === MenuType.Advanced) {
                this._menuType = MenuType.Main;
                this._updateListCommand();
            } else {
                throw Helpers.newError(`Invalid menuType: ${type}`, ClientErrorCode.HrwWarMenuPanel_OnTouchedBtnBack_00);
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
            this._labelMapName.text     = mapId == null ? `----` : (await WarMapModel.getMapNameInCurrentLanguage(mapId) || "----");
            this._labelMapDesigner.text = mapId == null ? `----` : (await WarMapModel.getDesignerName(mapId) || "----");
            this._labelWarId.text       = `${war.getWarId()}`;
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
                throw Helpers.newError(`McwWarMenuPanel._createDataForList() invalid this._menuType: ${type}`, ClientErrorCode.HrwWarMenuPanel_CreateDataForList_00);
            }
        }

        private _createDataForMainMenu(): DataForCommandRenderer[] {
            return Helpers.getNonNullElements([
                this._createCommandOpenAdvancedMenu(),
                this._createCommandGotoOngoingWar(),
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

        private _createCommandGotoOngoingWar(): DataForCommandRenderer | null {
            return {
                name    : Lang.getText(LangTextType.B0711),
                callback: () => {
                    TwnsPanelManager.open(TwnsPanelConfig.Dict.CommonConfirmPanel, {
                        title   : Lang.getText(LangTextType.B0711),
                        content : Lang.getText(LangTextType.A0225),
                        callback: () => {
                            MpwProxy.reqMpwCommonContinueWar(Helpers.getExisted(this._getWar().getWarId()));
                            TwnsPanelManager.open(TwnsPanelConfig.Dict.CommonBlockPanel, {
                                title   : Lang.getText(LangTextType.B0088),
                                content : Lang.getText(LangTextType.A0040),
                            });
                        }
                    });
                },
            };
        }

        private _createCommandGotoLobby(): DataForCommandRenderer | null {
            return {
                name    : Lang.getText(LangTextType.B0054),
                callback: () => {
                    TwnsPanelManager.open(TwnsPanelConfig.Dict.CommonConfirmPanel, {
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
                        TwnsPanelManager.open(TwnsPanelConfig.Dict.SpmCreateSfwSaveSlotsPanel, war.serializeForCreateSfw());
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

                    const errorCode = await (new Twns.TestWar.TwWar()).getErrorCodeForInit(warData);
                    if (errorCode) {
                        FloatText.show(Lang.getErrorText(errorCode));
                        return;
                    }

                    TwnsPanelManager.open(TwnsPanelConfig.Dict.CommonConfirmPanel, {
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
                    TwnsPanelManager.open(TwnsPanelConfig.Dict.UserSettingsPanel, void 0);
                }
            };
        }
        private _createCommandSetPathMode(): DataForCommandRenderer {
            return {
                name    : Lang.getText(LangTextType.B0430),
                callback: () => {
                    const isEnabled = UserModel.getSelfSettingsIsSetPathMode();
                    TwnsPanelManager.open(TwnsPanelConfig.Dict.CommonConfirmPanel, {
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
        war     : TwnsHrwWar.HrwWar;
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
            war         : TwnsHrwWar.HrwWar,
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
            war         : TwnsHrwWar.HrwWar,
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
            war         : TwnsHrwWar.HrwWar,
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
            war         : TwnsHrwWar.HrwWar,
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
            war         : TwnsHrwWar.HrwWar,
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
            war         : TwnsHrwWar.HrwWar,
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
            war         : TwnsHrwWar.HrwWar,
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
            war         : TwnsHrwWar.HrwWar,
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
            war         : TwnsHrwWar.HrwWar,
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
            war         : TwnsHrwWar.HrwWar,
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
            war         : TwnsHrwWar.HrwWar,
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
            war         : TwnsHrwWar.HrwWar,
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
            war         : TwnsHrwWar.HrwWar,
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
            war         : TwnsHrwWar.HrwWar,
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
            war         : TwnsHrwWar.HrwWar,
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

        private _getTilesCountAndIncome(war: TwnsHrwWar.HrwWar, playerIndex: number): { count: number, income: number } {
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

        private _getUnitsCountAndValue(war: TwnsHrwWar.HrwWar, playerIndex: number): { count: number, value: number } {
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

// export default TwnsHrwWarMenuPanel;
