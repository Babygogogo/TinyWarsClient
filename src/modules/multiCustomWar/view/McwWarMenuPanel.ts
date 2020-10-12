
namespace TinyWars.MultiCustomWar {
    import CommonConfirmPanel   = Common.CommonConfirmPanel;
    import Notify               = Utility.Notify;
    import Lang                 = Utility.Lang;
    import Types                = Utility.Types;
    import FlowManager          = Utility.FlowManager;
    import Logger               = Utility.Logger;
    import FloatText            = Utility.FloatText;
    import LocalStorage         = Utility.LocalStorage;
    import ProtoTypes           = Utility.ProtoTypes;
    import WarMapModel          = WarMap.WarMapModel;
    import TimeModel            = Time.TimeModel;
    import CommonConstants      = Utility.ConfigManager.COMMON_CONSTANTS;

    const enum MenuType {
        Main,
        Advanced,
    }

    export class McwWarMenuPanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Hud0;
        protected readonly _IS_EXCLUSIVE = false;

        private static _instance: McwWarMenuPanel;

        private _group          : eui.Group;
        private _listCommand    : GameUi.UiScrollList;
        private _labelNoCommand : GameUi.UiLabel;
        private _btnBack        : GameUi.UiButton;
        private _btnHome        : GameUi.UiButton;

        private _groupInfo              : eui.Group;
        private _labelMenuTitle         : GameUi.UiLabel;
        private _labelWarInfoTitle      : GameUi.UiLabel;
        private _labelPlayerInfoTitle   : GameUi.UiLabel;
        private _btnMapNameTitle        : GameUi.UiButton;
        private _labelMapName           : GameUi.UiLabel;
        private _listWarInfo            : GameUi.UiScrollList;
        private _btnBuildings           : GameUi.UiButton;
        private _listPlayer             : GameUi.UiScrollList;

        private _war            : McwWar;
        private _unitMap        : McwUnitMap;
        private _actionPlanner  : McwActionPlanner;
        private _dataForList    : DataForCommandRenderer[];
        private _menuType       = MenuType.Main;

        public static show(): void {
            if (!McwWarMenuPanel._instance) {
                McwWarMenuPanel._instance = new McwWarMenuPanel();
            }
            McwWarMenuPanel._instance.open();
        }
        public static hide(): void {
            if (McwWarMenuPanel._instance) {
                McwWarMenuPanel._instance.close();
            }
        }
        public static getIsOpening(): boolean {
            const instance = McwWarMenuPanel._instance;
            return instance ? instance.getIsOpening() : false;
        }

        public constructor() {
            super();

            this._setAutoAdjustHeightEnabled();
            this._setTouchMaskEnabled();
            this._callbackForTouchMask = () => this.close();
            this.skinName = `resource/skins/multiCustomWar/McwWarMenuPanel.exml`;
        }

        protected _onFirstOpened(): void {
            this._notifyListeners = [
                { type: Notify.Type.BwActionPlannerStateChanged,    callback: this._onNotifyMcwPlannerStateChanged },
                { type: Notify.Type.LanguageChanged,                callback: this._onNotifyLanguageChanged },
                { type: Notify.Type.SScrCreateCustomWar,            callback: this._onNotifySScrCreateCustomWar },
            ];
            this._uiListeners = [
                { ui: this._btnBack,        callback: this._onTouchedBtnBack },
                { ui: this._btnHome,        callback: this._onTouchedBtnHome },
                { ui: this._btnBuildings,   callback: this._onTouchedBtnBuildings },
            ];
            this._listCommand.setItemRenderer(CommandRenderer);
            this._listPlayer.setItemRenderer(PlayerRenderer);
            this._listWarInfo.setItemRenderer(InfoRenderer);
        }
        protected _onOpened(): void {
            const war           = McwModel.getWar();
            this._war           = war;
            this._unitMap       = war.getUnitMap() as McwUnitMap;
            this._actionPlanner = war.getActionPlanner() as McwActionPlanner;
            this._menuType      = MenuType.Main;

            this._updateView();

            Notify.dispatch(Notify.Type.McwWarMenuPanelOpened);
        }
        protected _onClosed(): void {
            this._war           = null;
            this._unitMap       = null;
            this._dataForList   = null;
            this._listCommand.clear();
            this._listPlayer.clear();
            this._listWarInfo.clear();

            Notify.dispatch(Notify.Type.McwWarMenuPanelClosed);
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Callbacks.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _onNotifyMcwPlannerStateChanged(e: egret.Event): void {
            const war = this._war;
            if (war.getPlayerInTurn() === war.getPlayerLoggedIn()) {
                this.close();
            } else {
                this._updateListPlayer();
            }
        }
        private _onNotifyLanguageChanged(e: egret.Event): void {
            this._updateComponentsForLanguage();
        }
        private _onNotifySScrCreateCustomWar(e: egret.Event): void {
            const data = e.data as ProtoTypes.NetMessage.IS_ScrCreateCustomWar;
            Common.CommonConfirmPanel.show({
                title   : Lang.getText(Lang.Type.B0088),
                content : Lang.getText(Lang.Type.A0107),
                callback: () => {
                    FlowManager.gotoSingleCustomWar(data.warData);
                },
            });
        }

        private _onTouchedBtnBack(e: egret.TouchEvent): void {
            const type = this._menuType;
            if (type === MenuType.Main) {
                this.close();
            } else if (type === MenuType.Advanced) {
                this._menuType = MenuType.Main;
                this._updateListCommand();
            } else {
                Logger.error(`McwWarMenuPanel._onTouchedBtnBack() invalid this._menuType: ${type}`);
                this.close();
            }
        }

        private _onTouchedBtnHome(e: egret.TouchEvent): void {
            CommonConfirmPanel.show({
                title   : Lang.getText(Lang.Type.B0054),
                content : Lang.getText(Lang.Type.A0025),
                callback: () => FlowManager.gotoLobby(),
            });
        }

        private _onTouchedBtnBuildings(e: egret.TouchEvent): void {
            McwBuildingListPanel.show();
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
            this._dataForList = this._createDataForList();
            if (!this._dataForList.length) {
                this._labelNoCommand.visible = true;
                this._listCommand.clear();
            } else {
                this._labelNoCommand.visible = false;
                this._listCommand.bindData(this._dataForList);
            }
        }

        private _updateComponentsForLanguage(): void {
            this._labelMenuTitle.text                   = Lang.getText(Lang.Type.B0155);
            this._labelWarInfoTitle.text                = Lang.getText(Lang.Type.B0223);
            this._labelPlayerInfoTitle.text             = Lang.getText(Lang.Type.B0224);
            this._btnMapNameTitle.label                 = Lang.getText(Lang.Type.B0225);
            this._btnBuildings.label                    = Lang.getText(Lang.Type.B0333);
            this._updateListWarInfo();
        }

        private async _updateGroupInfo(): Promise<void> {
            const war                   = this._war;
            const mapFileName           = war.getMapId();
            this._labelMapName.text     = `${await WarMapModel.getMapNameInCurrentLanguage(mapFileName) || "----"} (${Lang.getText(Lang.Type.B0163)}: ${await WarMapModel.getDesignerName(mapFileName) || "----"})`;
        }

        private _updateListWarInfo(): void {
            const war       = this._war;
            const dataList  : DataForInfoRenderer[] = [
                {
                    titleText   : Lang.getText(Lang.Type.B0226),
                    infoText    : `${war.getWarId()}`,
                    infoColor   : 0xFFFFFF,
                },
                {
                    titleText   : Lang.getText(Lang.Type.B0091),
                    infoText    : `${war.getTurnManager().getTurnIndex() + 1} (${Lang.getText(Lang.Type.B0090)}: ${war.getExecutedActionsCount() + 1})`,
                    infoColor   : 0xFFFFFF,
                },
            ];
            this._listWarInfo.bindData(dataList);
        }

        private _updateListPlayer(): void {
            const war   = this._war;
            const data  = [] as DataForPlayerRenderer[];
            war.getPlayerManager().forEachPlayer(false, (player: McwPlayer) => {
                data.push({
                    war,
                    player,
                });
            });
            this._listPlayer.bindData(data);
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
                Logger.error(`McwWarMenuPanel._createDataForList() invalid this._menuType: ${type}`);
                return [];
            }
        }

        private _createDataForMainMenu(): DataForCommandRenderer[] {
            return [
                this._createCommandOpenAdvancedMenu(),
                this._createCommandSyncWar(),
            ].filter(c => !!c);
        }

        private _createDataForAdvancedMenu(): DataForCommandRenderer[] {
            return [
                this._createCommandPlayerDeleteUnit(),
                this._createCommandPlayerAgreeDraw(),
                this._createCommandPlayerDeclineDraw(),
                this._createCommandPlayerSurrender(),
                this._createCommandSimulation(),
                this._createCommandShowTileAnimation(),
                this._createCommandStopTileAnimation(),
                this._createCommandUseOriginTexture(),
                this._createCommandUseNewTexture(),
            ].filter(c => !!c);
        }

        private _createCommandOpenAdvancedMenu(): DataForCommandRenderer | undefined {
            return {
                name    : Lang.getText(Lang.Type.B0080),
                callback: () => {
                    this._menuType = MenuType.Advanced;
                    this._updateListCommand();
                },
            };
        }

        private _createCommandOpenCoInfoMenu(): DataForCommandRenderer | undefined {
            return {
                name    : Lang.getText(Lang.Type.B0140),
                callback: () => {
                    McwCoListPanel.show(this._war.getPlayerIndexLoggedIn() - 1);
                    McwWarMenuPanel.hide();
                },
            };
        }

        private _createCommandSyncWar(): DataForCommandRenderer | undefined {
            return {
                name    : Lang.getText(Lang.Type.B0089),
                callback: () => {
                    const war = this._war;
                    McwProxy.reqMcwPlayerSyncWar(
                        war,
                        war.getActionPlanner().checkIsStateRequesting()
                            ? Types.SyncWarRequestType.PlayerForce
                            : Types.SyncWarRequestType.PlayerRequest
                    );
                    this.close();
                },
            };
        }

        private _createCommandChat(): DataForCommandRenderer | null {
            return {
                name    : Lang.getText(Lang.Type.B0383),
                callback: () => {
                    this.close();
                    Chat.ChatPanel.show({});
                },
            }
        }

        private _createCommandPlayerSurrender(): DataForCommandRenderer | undefined {
            const war = this._war;
            if ((war.getPlayerInTurn() !== war.getPlayerLoggedIn())                 ||
                (war.getTurnManager().getPhaseCode() !== Types.TurnPhaseCode.Main)  ||
                (this._actionPlanner.checkIsStateRequesting())
            ) {
                return undefined;
            } else {
                return {
                    name    : Lang.getText(Lang.Type.B0055),
                    callback: () => {
                        CommonConfirmPanel.show({
                            title   : Lang.getText(Lang.Type.B0055),
                            content : Lang.getText(Lang.Type.A0026),
                            callback: () => this._actionPlanner.setStateRequestingPlayerSurrender(),
                        });
                    },
                }
            }
        }

        private _createCommandSimulation(): DataForCommandRenderer | null {
            const war = this._war;
            return {
                name    : Lang.getText(Lang.Type.B0325),
                callback: () => {
                    if (war.getIsExecutingAction()) {
                        FloatText.show(Lang.getText(Lang.Type.A0103));
                    } else {
                        SingleCustomRoom.ScrCreateCustomSaveSlotsPanel.show(war.serializeForSimulation());
                    }
                },
            };
        }

        private _createCommandPlayerAgreeDraw(): DataForCommandRenderer | undefined {
            const war       = this._war;
            const player    = war.getPlayerInTurn();
            if ((player !== war.getPlayerLoggedIn())                                    ||
                (player.getHasVotedForDraw())                                           ||
                (war.getTurnManager().getPhaseCode() !== Types.TurnPhaseCode.Main)      ||
                (this._actionPlanner.getState() !== Types.ActionPlannerState.Idle)
            ) {
                return undefined;
            } else {
                const title = war.getRemainingVotesForDraw() == null ? Lang.getText(Lang.Type.B0083) : Lang.getText(Lang.Type.B0084);
                return {
                    name    : title,
                    callback: () => {
                        CommonConfirmPanel.show({
                            title,
                            content : war.getRemainingVotesForDraw() == null ? Lang.getText(Lang.Type.A0031) : Lang.getText(Lang.Type.A0032),
                            callback: () => this._actionPlanner.setStateRequestingPlayerVoteForDraw(true),
                        });
                    },
                };
            }
        }

        private _createCommandPlayerDeclineDraw(): DataForCommandRenderer | undefined {
            const war       = this._war;
            const player    = war.getPlayerInTurn();
            if ((player !== war.getPlayerLoggedIn())                                    ||
                (player.getHasVotedForDraw())                                           ||
                (war.getTurnManager().getPhaseCode() !== Types.TurnPhaseCode.Main)      ||
                (this._actionPlanner.getState() !== Types.ActionPlannerState.Idle)   ||
                (!war.getRemainingVotesForDraw())
            ) {
                return undefined;
            } else {
                const title = Lang.getText(Lang.Type.B0085);
                return {
                    name    : title,
                    callback: () => {
                        CommonConfirmPanel.show({
                            title,
                            content : Lang.getText(Lang.Type.A0033),
                            callback: () => this._actionPlanner.setStateRequestingPlayerVoteForDraw(false),
                        });
                    },
                };
            }
        }

        private _createCommandPlayerDeleteUnit(): DataForCommandRenderer | undefined {
            const war = this._war;
            if ((war.getPlayerInTurn() !== war.getPlayerLoggedIn())                 ||
                (war.getTurnManager().getPhaseCode() !== Types.TurnPhaseCode.Main)  ||
                (this._actionPlanner.getState() !== Types.ActionPlannerState.Idle)
            ) {
                return undefined;
            } else {
                return {
                    name    : Lang.getText(Lang.Type.B0081),
                    callback: () => {
                        const unitMap       = war.getUnitMap();
                        const unit          = unitMap.getUnitOnMap(war.getField().getCursor().getGridIndex());
                        const playerIndex   = war.getPlayerIndexLoggedIn();
                        if (!unit) {
                            FloatText.show(Lang.getText(Lang.Type.A0027));
                        } else if ((unit.getPlayerIndex() !== playerIndex) || (unit.getActionState() !== Types.UnitActionState.Idle)) {
                            FloatText.show(Lang.getText(Lang.Type.A0028));
                        } else if (unitMap.countUnitsOnMapForPlayer(playerIndex) <= 1) {
                            FloatText.show(Lang.getText(Lang.Type.A0076));
                        } else {
                            CommonConfirmPanel.show({
                                title   : Lang.getText(Lang.Type.B0081),
                                content : Lang.getText(Lang.Type.A0029),
                                callback: () => this._actionPlanner.setStateRequestingPlayerDeleteUnit(),
                            });
                        }
                    },
                }
            }
        }

        private _createCommandShowTileAnimation(): DataForCommandRenderer | null {
            if (TimeModel.checkIsTileAnimationTicking()) {
                return null;
            } else {
                return {
                    name    : Lang.getText(Lang.Type.B0176),
                    callback: () => {
                        TimeModel.startTileAnimationTick();
                        LocalStorage.setShowTileAnimation(true);
                        this._updateView();
                    },
                }
            }
        }
        private _createCommandStopTileAnimation(): DataForCommandRenderer | null {
            if (!TimeModel.checkIsTileAnimationTicking()) {
                return null;
            } else {
                return {
                    name    : Lang.getText(Lang.Type.B0177),
                    callback: () => {
                        TimeModel.stopTileAnimationTick();
                        LocalStorage.setShowTileAnimation(false);
                        this._updateView();
                    },
                }
            }
        }
        private _createCommandUseOriginTexture(): DataForCommandRenderer | null {
            if (Common.CommonModel.getUnitAndTileTextureVersion() === Types.UnitAndTileTextureVersion.V0) {
                return null;
            } else {
                return {
                    name    : Lang.getText(Lang.Type.B0385),
                    callback: () => {
                        Common.CommonModel.setUnitAndTileTextureVersion(Types.UnitAndTileTextureVersion.V0);
                        this._updateView();
                    }
                };
            }
        }
        private _createCommandUseNewTexture(): DataForCommandRenderer | null {
            if (Common.CommonModel.getUnitAndTileTextureVersion() === Types.UnitAndTileTextureVersion.V1) {
                return null;
            } else {
                return {
                    name    : Lang.getText(Lang.Type.B0386),
                    callback: () => {
                        Common.CommonModel.setUnitAndTileTextureVersion(Types.UnitAndTileTextureVersion.V1);
                        this._updateView();
                    }
                };
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

    type DataForCommandRenderer = {
        name    : string;
        callback: () => void;
    }

    class CommandRenderer extends eui.ItemRenderer {
        private _group      : eui.Group;
        private _labelName  : GameUi.UiLabel;

        protected dataChanged(): void {
            super.dataChanged();

            this._updateView();
        }

        public onItemTapEvent(e: eui.ItemTapEvent): void {
            (this.data as DataForCommandRenderer).callback();
        }

        private _updateView(): void {
            const data = this.data as DataForCommandRenderer;
            this._labelName.text    = data.name;
        }
    }

    type DataForPlayerRenderer = {
        war     : McwWar;
        player  : McwPlayer;
    }

    class PlayerRenderer extends eui.ItemRenderer {
        private _group          : eui.Group;
        private _labelName      : GameUi.UiLabel;
        private _labelForce     : GameUi.UiLabel;
        private _labelLost      : GameUi.UiLabel;
        private _listInfo       : GameUi.UiScrollList;

        protected childrenCreated(): void {
            super.childrenCreated();

            this._listInfo.setItemRenderer(InfoRenderer);
        }

        protected async dataChanged(): Promise<void> {
            super.dataChanged();

            const data                  = this.data as DataForPlayerRenderer;
            const war                   = data.war;
            const player                = data.player;
            this._labelName.text        = await player.getNickname();
            this._labelName.textColor   = player === war.getPlayerInTurn() ? 0x00FF00 : 0xFFFFFF;
            this._labelForce.text       = `${Lang.getPlayerForceName(player.getPlayerIndex())}`
                + `  ${Lang.getPlayerTeamName(player.getTeamIndex())}`
                + `  ${player === war.getPlayerInTurn() ? Lang.getText(Lang.Type.B0086) : ""}`;

            if (!player.getIsAlive()) {
                this._labelLost.visible = true;
                this._listInfo.visible  = false;
            } else {
                this._labelLost.visible = false;
                this._listInfo.visible  = true;
                this._listInfo.bindData(this._createDataForListInfo());
            }
        }

        private _createDataForListInfo(): DataForInfoRenderer[] {
            const data          = this.data as DataForPlayerRenderer;
            const war           = data.war;
            const player        = data.player;
            const isInfoKnown   = (!war.getFogMap().checkHasFogCurrently()) || (war.getPlayerManager().getAliveWatcherTeamIndexesForSelf().has(player.getTeamIndex()));
            return [
                this._createDataFund(war, player, isInfoKnown),
                this._createDataBuildings(war, player, isInfoKnown),
                this._createDataCoName(war, player, isInfoKnown),
                this._createDataEnergy(war, player, isInfoKnown),
                this._createDataUnitAndValue(war, player, isInfoKnown),

                this._createDataInitialFund(war, player, isInfoKnown),
                this._createDataIncomeMultiplier(war, player, isInfoKnown),
                this._createDataInitialEnergy(war, player, isInfoKnown),
                this._createDataEnergyGrowthMultiplier(war, player, isInfoKnown),
                this._createDataMoveRangeModifier(war, player, isInfoKnown),
                this._createDataAttackPowerModifier(war, player, isInfoKnown),
                this._createDataVisionRangeModifier(war, player, isInfoKnown),
                this._createDataLuckLowerLimit(war, player, isInfoKnown),
                this._createDataLuckUpperLimit(war, player, isInfoKnown),
            ];
        }
        private _createDataFund(
            war         : McwWar,
            player      : McwPlayer,
            isInfoKnown : boolean,
        ): DataForInfoRenderer {
            return {
                titleText   : Lang.getText(Lang.Type.B0032),
                infoText    : isInfoKnown ? `${player.getFund()}` : `?`,
                infoColor   : 0xFFFFFF,
            };
        }
        private _createDataBuildings(
            war         : McwWar,
            player      : McwPlayer,
            isInfoKnown : boolean,
        ): DataForInfoRenderer {
            const info = this._getTilesCountAndIncome(war, player.getPlayerIndex());
            return {
                titleText   : Lang.getText(Lang.Type.B0158),
                infoText    : `${info.count} / +${info.income}${isInfoKnown ? `` : `  ?`}`,
                infoColor   : 0xFFFFFF,
            };
        }
        private _createDataCoName(
            war         : McwWar,
            player      : McwPlayer,
            isInfoKnown : boolean,
        ): DataForInfoRenderer {
            const coId  = player.getCoId();
            const cfg   = coId == null ? null : Utility.ConfigManager.getCoBasicCfg(Utility.ConfigManager.getLatestConfigVersion(), coId);
            return {
                titleText               : `CO`,
                infoText                : !cfg
                    ? `(${Lang.getText(Lang.Type.B0001)})`
                    : `${cfg.name}(T${cfg.tier})`,
                infoColor               : 0xFFFFFF,
            };
        }
        private _createDataEnergy(
            war         : McwWar,
            player      : McwPlayer,
            isInfoKnown : boolean,
        ): DataForInfoRenderer {
            const currValue         = player.getCoCurrentEnergy();
            const powerEnergy       = player.getCoPowerEnergy();
            const superPowerEnergy  = player.getCoSuperPowerEnergy();
            const skillType         = player.getCoUsingSkillType();
            const currEnergyText    = skillType === Types.CoSkillType.Passive
                ? "" + currValue
                : skillType === Types.CoSkillType.Power ? "COP" : "SCOP";
            return {
                titleText               : Lang.getText(Lang.Type.B0159),
                infoText                : `${currValue == null ? `--` : currEnergyText} / ${powerEnergy == null ? "--" : powerEnergy} / ${superPowerEnergy == null ? "--" : superPowerEnergy}`,
                infoColor               : 0xFFFFFF,
            };
        }
        private _createDataUnitAndValue(
            war         : McwWar,
            player      : McwPlayer,
            isInfoKnown : boolean,
        ): DataForInfoRenderer {
            const unitsCountAndValue = this._getUnitsCountAndValue(war, player.getPlayerIndex());
            return {
                titleText               : Lang.getText(Lang.Type.B0160),
                infoText                : `${unitsCountAndValue.count} / ${unitsCountAndValue.value}${isInfoKnown ? `` : `  ?`}`,
                infoColor               : 0xFFFFFF,
            };
        }
        private _createDataInitialFund(
            war         : McwWar,
            player      : McwPlayer,
            isInfoKnown : boolean,
        ): DataForInfoRenderer {
            const playerIndex   = player.getPlayerIndex();
            const currValue     = war.getSettingsInitialFund(playerIndex);
            return {
                titleText               : Lang.getText(Lang.Type.B0178),
                infoText                : `${currValue}`,
                infoColor               : getTextColor(currValue, CommonConstants.WarRuleInitialFundDefault),
            };
        }
        private _createDataIncomeMultiplier(
            war         : McwWar,
            player      : McwPlayer,
            isInfoKnown : boolean,
        ): DataForInfoRenderer {
            const playerIndex   = player.getPlayerIndex();
            const currValue     = war.getSettingsIncomeMultiplier(playerIndex);
            const maxValue      = CommonConstants.WarRuleIncomeMultiplierMaxLimit;
            const minValue      = CommonConstants.WarRuleIncomeMultiplierMinLimit;
            return {
                titleText               : Lang.getText(Lang.Type.B0179),
                infoText                : `${currValue}%`,
                infoColor               : getTextColor(currValue, CommonConstants.WarRuleIncomeMultiplierDefault),
            };
        }
        private _createDataInitialEnergy(
            war         : McwWar,
            player      : McwPlayer,
            isInfoKnown : boolean,
        ): DataForInfoRenderer {
            const playerIndex   = player.getPlayerIndex();
            const currValue     = war.getSettingsInitialEnergyPercentage(playerIndex);
            const minValue      = CommonConstants.WarRuleInitialEnergyPercentageMinLimit;
            const maxValue      = CommonConstants.WarRuleInitialEnergyPercentageMaxLimit;
            return {
                titleText               : Lang.getText(Lang.Type.B0180),
                infoText                : `${currValue}%`,
                infoColor               : getTextColor(currValue, CommonConstants.WarRuleInitialEnergyPercentageDefault),
            };
        }
        private _createDataEnergyGrowthMultiplier(
            war         : McwWar,
            player      : McwPlayer,
            isInfoKnown : boolean,
        ): DataForInfoRenderer {
            const playerIndex   = player.getPlayerIndex();
            const currValue     = war.getSettingsEnergyGrowthMultiplier(playerIndex);
            const minValue      = CommonConstants.WarRuleEnergyGrowthMultiplierMinLimit;
            const maxValue      = CommonConstants.WarRuleEnergyGrowthMultiplierMaxLimit;
            return {
                titleText               : Lang.getText(Lang.Type.B0181),
                infoText                : `${currValue}%`,
                infoColor               : getTextColor(currValue, CommonConstants.WarRuleEnergyGrowthMultiplierDefault),
            };
        }
        private _createDataMoveRangeModifier(
            war         : McwWar,
            player      : McwPlayer,
            isInfoKnown : boolean,
        ): DataForInfoRenderer {
            const playerIndex   = player.getPlayerIndex();
            const currValue     = war.getSettingsMoveRangeModifier(playerIndex);
            const minValue      = CommonConstants.WarRuleMoveRangeModifierMinLimit;
            const maxValue      = CommonConstants.WarRuleMoveRangeModifierMaxLimit;
            return {
                titleText               : Lang.getText(Lang.Type.B0182),
                infoText                : `${currValue}`,
                infoColor               : getTextColor(currValue, CommonConstants.WarRuleMoveRangeModifierDefault),
            };
        }
        private _createDataAttackPowerModifier(
            war         : McwWar,
            player      : McwPlayer,
            isInfoKnown : boolean,
        ): DataForInfoRenderer {
            const playerIndex   = player.getPlayerIndex();
            const currValue     = war.getSettingsAttackPowerModifier(playerIndex);
            const minValue      = CommonConstants.WarRuleOffenseBonusMinLimit;
            const maxValue      = CommonConstants.WarRuleOffenseBonusMaxLimit;
            return {
                titleText               : Lang.getText(Lang.Type.B0183),
                infoText                : `${currValue}%`,
                infoColor               : getTextColor(currValue, CommonConstants.WarRuleOffenseBonusDefault),
            };
        }
        private _createDataVisionRangeModifier(
            war         : McwWar,
            player      : McwPlayer,
            isInfoKnown : boolean,
        ): DataForInfoRenderer {
            const playerIndex   = player.getPlayerIndex();
            const currValue     = war.getSettingsVisionRangeModifier(playerIndex);
            const minValue      = CommonConstants.WarRuleVisionRangeModifierMinLimit;
            const maxValue      = CommonConstants.WarRuleVisionRangeModifierMaxLimit;
            return {
                titleText               : Lang.getText(Lang.Type.B0184),
                infoText                : `${currValue}`,
                infoColor               : getTextColor(currValue, CommonConstants.WarRuleVisionRangeModifierDefault),
            };
        }
        private _createDataLuckLowerLimit(
            war         : McwWar,
            player      : McwPlayer,
            isInfoKnown : boolean,
        ): DataForInfoRenderer {
            const playerIndex   = player.getPlayerIndex();
            const currValue     = war.getSettingsLuckLowerLimit(playerIndex);
            const minValue      = CommonConstants.WarRuleLuckMinLimit;
            const maxValue      = CommonConstants.WarRuleLuckMaxLimit;
            return {
                titleText               : Lang.getText(Lang.Type.B0189),
                infoText                : `${currValue}%`,
                infoColor               : getTextColor(currValue, CommonConstants.WarRuleLuckDefaultLowerLimit),
            };
        }
        private _createDataLuckUpperLimit(
            war         : McwWar,
            player      : McwPlayer,
            isInfoKnown : boolean,
        ): DataForInfoRenderer {
            const playerIndex   = player.getPlayerIndex();
            const currValue     = war.getSettingsLuckUpperLimit(playerIndex);
            const minValue      = CommonConstants.WarRuleLuckMinLimit;
            const maxValue      = CommonConstants.WarRuleLuckMaxLimit;
            return {
                titleText               : Lang.getText(Lang.Type.B0190),
                infoText                : `${currValue}%`,
                infoColor               : getTextColor(currValue, CommonConstants.WarRuleLuckDefaultUpperLimit),
            };
        }

        private _getTilesCountAndIncome(war: McwWar, playerIndex: number): { count: number, income: number } {
            let count   = 0;
            let income  = 0;
            war.getTileMap().forEachTile(tile => {
                if (tile.getPlayerIndex() === playerIndex) {
                    ++count;
                    income += tile.getIncomeForPlayer(playerIndex);
                }
            });
            return { count, income };
        }

        private _getUnitsCountAndValue(war: McwWar, playerIndex: number): { count: number, value: number } {
            const teamIndexes   = war.getPlayerManager().getAliveWatcherTeamIndexesForSelf();
            const unitMap       = war.getUnitMap();
            let count           = 0;
            let value           = 0;
            unitMap.forEachUnitOnMap(unit => {
                if (unit.getPlayerIndex() === playerIndex) {
                    ++count;
                    value += Math.floor(unit.getProductionFinalCost() * unit.getNormalizedCurrentHp() / unit.getNormalizedMaxHp());

                    if ((teamIndexes.has(unit.getTeamIndex())) || (!war.getFogMap().checkHasFogCurrently())) {
                        for (const unitLoaded of unitMap.getUnitsLoadedByLoader(unit, true)) {
                            ++count;
                            value += Math.floor(unitLoaded.getProductionFinalCost() * unitLoaded.getNormalizedCurrentHp() / unitLoaded.getNormalizedMaxHp());
                        }
                    }
                }
            });
            return { count, value };
        }
    }

    type DataForInfoRenderer = {
        titleText   : string;
        infoText    : string;
        infoColor   : number;
    }

    class InfoRenderer extends eui.ItemRenderer {
        private _btnTitle   : GameUi.UiButton;
        private _labelValue : GameUi.UiLabel;

        protected dataChanged(): void {
            super.dataChanged();

            const data                  = this.data as DataForInfoRenderer;
            this._btnTitle.label        = data.titleText;
            this._labelValue.text       = data.infoText;
            this._labelValue.textColor  = data.infoColor;
        }
    }
}
