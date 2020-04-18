
namespace TinyWars.MultiCustomWar {
    import ConfirmPanel     = Common.ConfirmPanel;
    import Notify           = Utility.Notify;
    import Lang             = Utility.Lang;
    import Types            = Utility.Types;
    import FlowManager      = Utility.FlowManager;
    import Logger           = Utility.Logger;
    import FloatText        = Utility.FloatText;
    import LocalStorage     = Utility.LocalStorage;
    import ProtoTypes       = Utility.ProtoTypes;
    import WarMapModel      = WarMap.WarMapModel;
    import TimeModel        = Time.TimeModel;
    import CommonConstants  = ConfigManager.COMMON_CONSTANTS;

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
                { ui: this._btnBuildings,   callback: this._onTouchedBtnBuildings },
            ];
            this._listCommand.setItemRenderer(CommandRenderer);
            this._listPlayer.setItemRenderer(PlayerRenderer);
            this._listWarInfo.setItemRenderer(WarInfoRenderer);
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
            const data = e.data as ProtoTypes.IS_ScrCreateCustomWar;
            Common.ConfirmPanel.show({
                title   : Lang.getText(Lang.Type.B0088),
                content : Lang.getText(Lang.Type.A0107),
                callback: () => {
                    FlowManager.gotoSingleCustomWar(data.warData as Types.SerializedWar);
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
            this._btnBack.label                         = Lang.getText(Lang.Type.B0146);
            this._updateListWarInfo();
        }

        private async _updateGroupInfo(): Promise<void> {
            const war                   = this._war;
            const mapFileName           = war.getMapFileName();
            this._labelMapName.text     = `${await WarMapModel.getMapNameInLanguage(mapFileName) || "----"} (${Lang.getText(Lang.Type.B0163)}: ${await WarMapModel.getMapDesigner(mapFileName) || "----"})`;
        }

        private _updateListWarInfo(): void {
            const war                   = this._war;
            const incomeModifier        = war.getSettingsIncomeModifier();
            const energyGrowthModifier  = war.getSettingsEnergyGrowthModifier();
            const initialEnergy         = war.getSettingsInitialEnergy();
            const moveRangeModifier     = war.getSettingsMoveRangeModifier();
            const attackPowerModifier   = war.getSettingsAttackPowerModifier();
            const visionRangeModifier   = war.getSettingsVisionRangeModifier();
            const luckLowerLimit        = war.getSettingsLuckLowerLimit();
            const luckUpperLimit        = war.getSettingsLuckUpperLimit();
            const dataList              : DataForWarInfoRenderer[] = [
                {
                    titleText   : Lang.getText(Lang.Type.B0226),
                    infoText    : `${war.getWarId()}`,
                    infoColor   : 0xFFFFFF,
                },
                {
                    titleText   : Lang.getText(Lang.Type.B0091),
                    infoText    : `${war.getTurnManager().getTurnIndex() + 1} (${Lang.getText(Lang.Type.B0090)}: ${war.getNextActionId() + 1})`,
                    infoColor   : 0xFFFFFF,
                },
                {
                    titleText   : Lang.getText(Lang.Type.B0179),
                    infoText    : `${incomeModifier}%`,
                    infoColor   : getTextColor(incomeModifier, CommonConstants.WarRuleIncomeMultiplierDefault),
                },
                {
                    titleText   : Lang.getText(Lang.Type.B0180),
                    infoText    : `${initialEnergy}%`,
                    infoColor   : getTextColor(initialEnergy, CommonConstants.WarRuleInitialEnergyDefault),
                },
                {
                    titleText   : Lang.getText(Lang.Type.B0181),
                    infoText    : `${energyGrowthModifier}%`,
                    infoColor   : getTextColor(energyGrowthModifier, CommonConstants.WarRuleEnergyGrowthMultiplierDefault),
                },
                {
                    titleText   : Lang.getText(Lang.Type.B0182),
                    infoText    : `${moveRangeModifier}`,
                    infoColor   : getTextColor(moveRangeModifier, CommonConstants.WarRuleMoveRangeModifierDefault),
                },
                {
                    titleText   : Lang.getText(Lang.Type.B0183),
                    infoText    : `${attackPowerModifier}%`,
                    infoColor   : getTextColor(attackPowerModifier, CommonConstants.WarRuleOffenseBonusDefault),
                },
                {
                    titleText   : Lang.getText(Lang.Type.B0184),
                    infoText    : `${visionRangeModifier}`,
                    infoColor   : getTextColor(visionRangeModifier, CommonConstants.WarRuleVisionRangeModifierDefault),
                },
                {
                    titleText   : Lang.getText(Lang.Type.B0189),
                    infoText    : `${luckLowerLimit}%`,
                    infoColor   : getTextColor(luckLowerLimit, CommonConstants.WarRuleLuckDefaultLowerLimit),
                },
                {
                    titleText   : Lang.getText(Lang.Type.B0190),
                    infoText    : `${luckUpperLimit}%`,
                    infoColor   : getTextColor(luckUpperLimit, CommonConstants.WarRuleLuckDefaultUpperLimit),
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
            const dataList = [] as DataForCommandRenderer[];

            const commandOpenCoInfoMenu = this._createCommandOpenCoInfoMenu();
            (commandOpenCoInfoMenu) && (dataList.push(commandOpenCoInfoMenu));

            const commandOpenAdvancedMenu = this._createCommandOpenAdvancedMenu();
            (commandOpenAdvancedMenu) && (dataList.push(commandOpenAdvancedMenu));

            const commandSyncWar = this._createCommandSyncWar();
            (commandSyncWar) && (dataList.push(commandSyncWar));

            const commandGotoLobby = this._createCommandGotoLobby();
            (commandGotoLobby) && (dataList.push(commandGotoLobby));

            return dataList;
        }

        private _createDataForAdvancedMenu(): DataForCommandRenderer[] {
            const dataList = [] as DataForCommandRenderer[];

            const commandPlayerDeleteUnit = this._createCommandPlayerDeleteUnit();
            (commandPlayerDeleteUnit) && (dataList.push(commandPlayerDeleteUnit));

            const commandPlayerAgreeDraw = this._createCommandPlayerAgreeDraw();
            (commandPlayerAgreeDraw) && (dataList.push(commandPlayerAgreeDraw));

            const commandPlayerRefuseDraw = this._createCommandPlayerDeclineDraw();
            (commandPlayerRefuseDraw) && (dataList.push(commandPlayerRefuseDraw));

            const commandPlayerSurrender = this._createCommandPlayerSurrender();
            (commandPlayerSurrender) && (dataList.push(commandPlayerSurrender));

            const commandSimulation = this._createCommandSimulation();
            (commandSimulation) && (dataList.push(commandSimulation));

            const commandShowTileAnimation = this._createCommandShowTileAnimation();
            (commandShowTileAnimation) && (dataList.push(commandShowTileAnimation));

            const commandStopTileAnimation = this._createCommandStopTileAnimation();
            (commandStopTileAnimation) && (dataList.push(commandStopTileAnimation));

            return dataList;
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

        private _createCommandGotoLobby(): DataForCommandRenderer | undefined {
            return {
                name    : Lang.getText(Lang.Type.B0054),
                callback: () => {
                    ConfirmPanel.show({
                        title   : Lang.getText(Lang.Type.B0054),
                        content : Lang.getText(Lang.Type.A0025),
                        callback: () => FlowManager.gotoLobby(),
                    });
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
                        ConfirmPanel.show({
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
                        ConfirmPanel.show({
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
                        ConfirmPanel.show({
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
                        } else if ((unit.getPlayerIndex() !== playerIndex) || (unit.getState() !== Types.UnitActionState.Idle)) {
                            FloatText.show(Lang.getText(Lang.Type.A0028));
                        } else if (unitMap.countUnitsOnMapForPlayer(playerIndex) <= 1) {
                            FloatText.show(Lang.getText(Lang.Type.A0076));
                        } else {
                            ConfirmPanel.show({
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

        private _groupInfo              : eui.Group;
        private _labelFundTitle         : GameUi.UiLabel;
        private _labelFund              : GameUi.UiLabel;
        private _labelIncomeTitle       : GameUi.UiLabel;
        private _labelIncome            : GameUi.UiLabel;
        private _labelBuildingsTitle    : GameUi.UiLabel;
        private _labelBuildings         : GameUi.UiLabel;
        private _labelCoName            : GameUi.UiLabel;
        private _labelEnergyTitle       : GameUi.UiLabel;
        private _labelEnergy            : GameUi.UiLabel;
        private _labelUnitsTitle        : GameUi.UiLabel;
        private _labelUnits             : GameUi.UiLabel;
        private _labelUnitsValueTitle   : GameUi.UiLabel;
        private _labelUnitsValue        : GameUi.UiLabel;

        protected dataChanged(): void {
            super.dataChanged();

            const data                  = this.data as DataForPlayerRenderer;
            const war                   = data.war;
            const player                = data.player;
            const playerIndex           = player.getPlayerIndex();
            this._labelName.text        = player.getNickname();
            this._labelName.textColor   = player === war.getPlayerInTurn() ? 0x00FF00 : 0xFFFFFF;
            this._labelForce.text       = `${Lang.getPlayerForceName(player.getPlayerIndex())}`
                + `  ${Lang.getPlayerTeamName(player.getTeamIndex())}`
                + `  ${player === war.getPlayerInTurn() ? Lang.getText(Lang.Type.B0086) : ""}`;

            if (!player.getIsAlive()) {
                this._labelLost.visible = true;
                this._groupInfo.visible = false;
            } else {
                this._labelLost.visible = false;
                this._groupInfo.visible = true;

                const isInfoKnown               = (!war.getFogMap().checkHasFogCurrently()) || (war.getPlayerManager().getWatcherTeamIndexes(User.UserModel.getSelfUserId()).has(player.getTeamIndex()));
                const tilesCountAndIncome       = this._getTilesCountAndIncome(war, playerIndex);
                this._labelFundTitle.text       = Lang.getText(Lang.Type.B0156);
                this._labelFund.text            = isInfoKnown ? `${player.getFund()}` : `?`;
                this._labelIncomeTitle.text     = Lang.getText(Lang.Type.B0157);
                this._labelIncome.text          = `${tilesCountAndIncome.income}${isInfoKnown ? `` : `  ?`}`;
                this._labelBuildingsTitle.text  = Lang.getText(Lang.Type.B0158);
                this._labelBuildings.text       = `${tilesCountAndIncome.count}${isInfoKnown ? `` : `  ?`}`;

                const coId              = player.getCoId();
                const coBasicCfg        = coId == null ? null : ConfigManager.getCoBasicCfg(war.getConfigVersion(), coId);
                this._labelCoName.text  = coBasicCfg
                    ? `${coBasicCfg.name}(T${coBasicCfg.tier})`
                    : `(${Lang.getText(Lang.Type.B0001)}CO)`;

                const superPowerEnergy  = player.getCoSuperPowerEnergy();
                const powerEnergy       = player.getCoPowerEnergy();
                const skillType         = player.getCoUsingSkillType();
                const currEnergyText    = skillType === Types.CoSkillType.Passive
                    ? "" + player.getCoCurrentEnergy()
                    : skillType === Types.CoSkillType.Power ? "COP" : "SCOP";
                this._labelEnergyTitle.text = Lang.getText(Lang.Type.B0159);
                this._labelEnergy.text      = `${currEnergyText} / ${powerEnergy == null ? "--" : powerEnergy} / ${superPowerEnergy == null ? "--" : superPowerEnergy}`;

                const unitsCountAndValue        = this._getUnitsCountAndValue(war, playerIndex);
                this._labelUnitsTitle.text      = Lang.getText(Lang.Type.B0160);
                this._labelUnits.text           = `${unitsCountAndValue.count}${isInfoKnown ? `` : `  ?`}`;
                this._labelUnitsValueTitle.text = Lang.getText(Lang.Type.B0161);
                this._labelUnitsValue.text      = `${unitsCountAndValue.value}${isInfoKnown ? `` : `  ?`}`;
            }
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
            const teamIndexes   = war.getPlayerManager().getWatcherTeamIndexes(User.UserModel.getSelfUserId());
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

    type DataForWarInfoRenderer = {
        titleText   : string;
        infoText    : string;
        infoColor   : number;
    }

    class WarInfoRenderer extends eui.ItemRenderer {
        private _btnTitle   : GameUi.UiButton;
        private _labelValue : GameUi.UiLabel;

        protected dataChanged(): void {
            super.dataChanged();

            const data                  = this.data as DataForWarInfoRenderer;
            this._btnTitle.label        = data.titleText;
            this._labelValue.text       = data.infoText;
            this._labelValue.textColor  = data.infoColor;
        }
    }
}
