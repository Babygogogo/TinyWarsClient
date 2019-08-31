
namespace TinyWars.MultiCustomWar {
    import ConfirmPanel = Common.ConfirmPanel;
    import Notify       = Utility.Notify;
    import Lang         = Utility.Lang;
    import Types        = Utility.Types;
    import FlowManager  = Utility.FlowManager;
    import Logger       = Utility.Logger;
    import FloatText    = Utility.FloatText;

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

        private _groupInfo                  : eui.Group;
        private _labelMapName               : GameUi.UiLabel;
        private _labelMapDesigner           : GameUi.UiLabel;
        private _labelWarId                 : GameUi.UiLabel;
        private _labelTurnIndex             : GameUi.UiLabel;
        private _labelActionId              : GameUi.UiLabel;
        private _labelIncomeModifier        : GameUi.UiLabel;
        private _labelEnergyGrowthModifier  : GameUi.UiLabel;
        private _labelInitialEnergy         : GameUi.UiLabel;
        private _labelMoveRangeModifier     : GameUi.UiLabel;
        private _labelAttackPowerModifier   : GameUi.UiLabel;
        private _labelVisionRangeModifier   : GameUi.UiLabel;
        private _listPlayer                 : GameUi.UiScrollList;

        private _war            : McwWar;
        private _unitMap        : McwUnitMap;
        private _turnManager    : McwTurnManager;
        private _actionPlanner  : McwActionPlanner;
        private _dataForList    : DataForCommandRenderer[];
        private _playerIndex    : number;
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
                { type: Notify.Type.BwActionPlannerStateChanged,   callback: this._onNotifyMcwPlannerStateChanged },
            ];
            this._uiListeners = [
                { ui: this._btnBack, callback: this._onTouchedBtnBack },
            ];
            this._listCommand.setItemRenderer(CommandRenderer);
            this._listPlayer.setItemRenderer(PlayerRenderer);
        }
        protected _onOpened(): void {
            const war           = McwModel.getWar();
            this._war           = war;
            this._unitMap       = war.getUnitMap() as McwUnitMap;
            this._turnManager   = war.getTurnManager() as McwTurnManager;
            this._actionPlanner = war.getActionPlanner() as McwActionPlanner;
            this._playerIndex   = war.getPlayerIndexLoggedIn();
            this._menuType      = MenuType.Main;

            this._updateView();

            Notify.dispatch(Notify.Type.McwWarMenuPanelOpened);
        }
        protected _onClosed(): void {
            delete this._war;
            delete this._unitMap;
            delete this._dataForList;
            this._listCommand.clear();
            this._listPlayer.clear();

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

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Functions for view.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _updateView(): void {
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

        private _updateGroupInfo(): void {
            const war                               = this._war;
            const mapIndexKey                       = war.getMapIndexKey();
            this._labelMapName.text                 = mapIndexKey.mapName;
            this._labelMapDesigner.text             = mapIndexKey.mapDesigner;
            this._labelWarId.text                   = `${war.getWarId()}`;
            this._labelTurnIndex.text               = `${war.getTurnManager().getTurnIndex()}`;
            this._labelActionId.text                = `${war.getNextActionId() - 1}`;
            this._labelIncomeModifier.text          = `${war.getSettingsIncomeModifier()}%`;
            this._labelEnergyGrowthModifier.text    = `${war.getSettingsEnergyGrowthModifier()}%`;
            this._labelInitialEnergy.text           = `${war.getSettingsInitialEnergy()}%`;
            this._labelMoveRangeModifier.text       = `${war.getSettingsMoveRangeModifier()}`;
            this._labelAttackPowerModifier.text     = `${war.getSettingsAttackPowerModifier()}%`;
            this._labelVisionRangeModifier.text     = `${war.getSettingsVisionRangeModifier()}`;
        }

        private _updateListPlayer(): void {
            const war   = this._war;
            const data  = [] as DataForPlayerRenderer[];
            war.getPlayerManager().forEachPlayer(false, player => {
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
                    McwProxy.reqMcwPlayerSyncWar(this._war, Types.SyncWarRequestType.PlayerRequest);
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
                        const unit = war.getUnitMap().getUnitOnMap(war.getField().getCursor().getGridIndex());
                        if (!unit) {
                            FloatText.show(Lang.getText(Lang.Type.A0027));
                        } else if ((unit.getPlayerIndex() !== war.getPlayerIndexLoggedIn()) || (unit.getState() !== Types.UnitState.Idle)) {
                            FloatText.show(Lang.getText(Lang.Type.A0028));
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

                const isInfoKnown               = (player.getTeamIndex() === war.getPlayerLoggedIn().getTeamIndex()) || (!war.getFogMap().checkHasFogCurrently());
                const tilesCountAndIncome       = this._getTilesCountAndIncome(war, playerIndex);
                this._labelFundTitle.text       = Lang.getText(Lang.Type.B0156);
                this._labelFund.text            = isInfoKnown ? `${player.getFund()}` : `?`;
                this._labelIncomeTitle.text     = Lang.getText(Lang.Type.B0157);
                this._labelIncome.text          = `${tilesCountAndIncome.income}${isInfoKnown ? `` : `  ?`}`;
                this._labelBuildingsTitle.text  = Lang.getText(Lang.Type.B0158);
                this._labelBuildings.text       = `${tilesCountAndIncome.count}${isInfoKnown ? `` : `  ?`}`;

                const coId              = player.getCoId();
                this._labelCoName.text  = coId == null
                    ? `(${Lang.getText(Lang.Type.B0001)}CO)`
                    : ConfigManager.getCoBasicCfg(ConfigManager.getNewestConfigVersion(), coId).name;

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
            const teamIndexLoggedIn = war.getPlayerLoggedIn().getTeamIndex();
            const unitMap           = war.getUnitMap();
            let count               = 0;
            let value               = 0;
            unitMap.forEachUnitOnMap(unit => {
                if (unit.getPlayerIndex() === playerIndex) {
                    ++count;
                    value += Math.floor(unit.getProductionFinalCost() * unit.getNormalizedCurrentHp() / unit.getNormalizedMaxHp());

                    if ((unit.getTeamIndex() === teamIndexLoggedIn) || (!war.getFogMap().checkHasFogCurrently())) {
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
}
