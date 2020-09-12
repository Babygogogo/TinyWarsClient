
namespace TinyWars.Replay {
    import Notify           = Utility.Notify;
    import Lang             = Utility.Lang;
    import FlowManager      = Utility.FlowManager;
    import Logger           = Utility.Logger;
    import Types            = Utility.Types;
    import LocalStorage     = Utility.LocalStorage;
    import FloatText        = Utility.FloatText;
    import ProtoTypes       = Utility.ProtoTypes;
    import TimeModel        = Time.TimeModel;
    import WarMapModel      = WarMap.WarMapModel;
    import CommonConstants  = Utility.ConfigManager.COMMON_CONSTANTS;

    const enum MenuType {
        Main,
        Advanced,
    }

    export class ReplayWarMenuPanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Hud0;
        protected readonly _IS_EXCLUSIVE = false;

        private static _instance: ReplayWarMenuPanel;

        private _group          : eui.Group;
        private _listCommand    : GameUi.UiScrollList;
        private _labelNoCommand : GameUi.UiLabel;
        private _btnBack        : GameUi.UiButton;

        private _groupInfo                  : eui.Group;
        private _labelMenuTitle                 : GameUi.UiLabel;
        private _labelWarInfoTitle              : GameUi.UiLabel;
        private _labelPlayerInfoTitle           : GameUi.UiLabel;
        private _labelMapNameTitle              : GameUi.UiLabel;
        private _labelMapName                   : GameUi.UiLabel;
        private _labelMapDesignerTitle          : GameUi.UiLabel;
        private _labelMapDesigner               : GameUi.UiLabel;
        private _labelWarIdTitle                : GameUi.UiLabel;
        private _labelWarId                     : GameUi.UiLabel;
        private _labelTurnIndexTitle            : GameUi.UiLabel;
        private _labelTurnIndex                 : GameUi.UiLabel;
        private _labelActionIdTitle             : GameUi.UiLabel;
        private _labelActionId                  : GameUi.UiLabel;
        private _labelIncomeModifierTitle       : GameUi.UiLabel;
        private _labelIncomeModifier            : GameUi.UiLabel;
        private _labelEnergyGrowthModifierTitle : GameUi.UiLabel;
        private _labelEnergyGrowthModifier      : GameUi.UiLabel;
        private _labelInitialEnergyTitle        : GameUi.UiLabel;
        private _labelInitialEnergy             : GameUi.UiLabel;
        private _labelMoveRangeModifierTitle    : GameUi.UiLabel;
        private _labelMoveRangeModifier         : GameUi.UiLabel;
        private _labelAttackPowerModifierTitle  : GameUi.UiLabel;
        private _labelAttackPowerModifier       : GameUi.UiLabel;
        private _labelVisionRangeModifierTitle  : GameUi.UiLabel;
        private _labelVisionRangeModifier       : GameUi.UiLabel;
        private _labelLuckLowerLimitTitle       : GameUi.UiLabel;
        private _labelLuckLowerLimit            : GameUi.UiLabel;
        private _labelLuckUpperLimitTitle       : GameUi.UiLabel;
        private _labelLuckUpperLimit            : GameUi.UiLabel;
        private _listPlayer                     : GameUi.UiScrollList;

        private _war        : ReplayWar;
        private _unitMap    : ReplayUnitMap;
        private _turnManager: ReplayTurnManager;
        private _dataForList: DataForCommandRenderer[];
        private _menuType   = MenuType.Main;

        public static show(): void {
            if (!ReplayWarMenuPanel._instance) {
                ReplayWarMenuPanel._instance = new ReplayWarMenuPanel();
            }
            ReplayWarMenuPanel._instance.open();
        }
        public static hide(): void {
            if (ReplayWarMenuPanel._instance) {
                ReplayWarMenuPanel._instance.close();
            }
        }
        public static getIsOpening(): boolean {
            const instance = ReplayWarMenuPanel._instance;
            return instance ? instance.getIsOpening() : false;
        }

        public constructor() {
            super();

            this._setAutoAdjustHeightEnabled();
            this.skinName = `resource/skins/replay/ReplayWarMenuPanel.exml`;
        }

        protected _onFirstOpened(): void {
            this._notifyListeners = [
                { type: Notify.Type.LanguageChanged,                callback: this._onNotifyLanguageChanged },
                { type: Notify.Type.BwActionPlannerStateChanged,    callback: this._onNotifyMcwPlannerStateChanged },
                { type: Notify.Type.SScrCreateCustomWar,            callback: this._onNotifySScrCreateCustomWar },
                { type: Notify.Type.SCommonRateMultiPlayerReplay,   callback: this._onNotifySCommonRateMultiPlayerReplay },
            ];
            this._uiListeners = [
                { ui: this._btnBack, callback: this._onTouchedBtnBack },
            ];
            this._listCommand.setItemRenderer(CommandRenderer);
            this._listPlayer.setItemRenderer(PlayerRenderer);
        }
        protected _onOpened(): void {
            const war           = ReplayModel.getWar();
            this._war           = war;
            this._unitMap       = war.getUnitMap() as ReplayUnitMap;
            this._turnManager   = war.getTurnManager() as ReplayTurnManager;
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
            this._updateListPlayer();
        }

        private _onNotifyLanguageChanged(e: egret.Event): void {
            this._updateComponentsForLanguage();
        }

        private _onNotifySScrCreateCustomWar(e: egret.Event): void {
            const data = e.data as ProtoTypes.IS_ScrCreateCustomWar;
            Common.CommonConfirmPanel.show({
                title   : Lang.getText(Lang.Type.B0088),
                content : Lang.getText(Lang.Type.A0107),
                callback: () => {
                    FlowManager.gotoSingleCustomWar(data.warData as Types.SerializedWar);
                },
            });
        }

        private _onNotifySCommonRateMultiPlayerReplay(e: egret.Event): void {
            FloatText.show(Lang.getText(Lang.Type.A0106));
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
            this._labelMapNameTitle.text                = `${Lang.getText(Lang.Type.B0225)}: `;
            this._labelMapDesignerTitle.text            = `${Lang.getText(Lang.Type.B0163)}: `;
            this._labelWarIdTitle.text                  = `${Lang.getText(Lang.Type.B0226)}: `;
            this._labelTurnIndexTitle.text              = `${Lang.getText(Lang.Type.B0091)}: `;
            this._labelActionIdTitle.text               = `${Lang.getText(Lang.Type.B0090)}: `;
            this._labelIncomeModifierTitle.text         = `${Lang.getText(Lang.Type.B0179)}: `;
            this._labelInitialEnergyTitle.text          = `${Lang.getText(Lang.Type.B0180)}: `;
            this._labelEnergyGrowthModifierTitle.text   = `${Lang.getText(Lang.Type.B0181)}: `;
            this._labelMoveRangeModifierTitle.text      = `${Lang.getText(Lang.Type.B0182)}: `;
            this._labelAttackPowerModifierTitle.text    = `${Lang.getText(Lang.Type.B0183)}: `;
            this._labelVisionRangeModifierTitle.text    = `${Lang.getText(Lang.Type.B0184)}: `;
            this._labelLuckLowerLimitTitle.text         = `${Lang.getText(Lang.Type.B0189)}: `;
            this._labelLuckUpperLimitTitle.text         = `${Lang.getText(Lang.Type.B0190)}: `;
            this._btnBack.label                         = Lang.getText(Lang.Type.B0146);
        }

        private async _updateGroupInfo(): Promise<void> {
            const war                               = this._war;
            const mapFileName                       = war.getMapId();
            this._labelMapName.text                 = await WarMapModel.getMapNameInCurrentLanguage(mapFileName) || "----";
            this._labelMapDesigner.text             = await WarMapModel.getDesignerName(mapFileName) || "----";
            this._labelWarId.text                   = `${war.getWarId()}`;
            this._labelTurnIndex.text               = `${war.getTurnManager().getTurnIndex() + 1}`;
            this._labelActionId.text                = `${war.getExecutedActionsCount() - 1}`;
            this._labelIncomeModifier.text          = `${war.getSettingsIncomeMultiplier()}%`;
            this._labelEnergyGrowthModifier.text    = `${war.getSettingsEnergyGrowthMultiplier()}%`;
            this._labelInitialEnergy.text           = `${war.getSettingsInitialEnergyPercentage()}%`;
            this._labelMoveRangeModifier.text       = `${war.getSettingsMoveRangeModifier()}`;
            this._labelAttackPowerModifier.text     = `${war.getSettingsAttackPowerModifier()}%`;
            this._labelVisionRangeModifier.text     = `${war.getSettingsVisionRangeModifier()}`;
            this._labelLuckLowerLimit.text          = `${war.getSettingsLuckLowerLimit()}%`;
            this._labelLuckUpperLimit.text          = `${war.getSettingsLuckUpperLimit()}%`;
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
            return [
                // this._createCommandOpenCoInfoMenu(),
                this._createCommandOpenAdvancedMenu(),
                this._createCommandRate(),
                // this._createCommandChat(),
                this._createCommandGotoLobby(),
            ].filter(v => !!v);
        }

        private _createDataForAdvancedMenu(): DataForCommandRenderer[] {
            return [
                this._createCommandSimulation(),
                this._createCommandShowTileAnimation(),
                this._createCommandStopTileAnimation(),
                this._createCommandUseOriginTexture(),
                this._createCommandUseNewTexture(),
            ].filter(v => !!v);
        }

        private _createCommandOpenCoInfoMenu(): DataForCommandRenderer | undefined {
            return {
                name    : Lang.getText(Lang.Type.B0140),
                callback: () => {
                    ReplayCoListPanel.show(0);
                    ReplayWarMenuPanel.hide();
                },
            };
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

        private _createCommandRate(): DataForCommandRenderer | null {
            return {
                name    : Lang.getText(Lang.Type.B0365),
                callback: () => {
                    Common.CommonInputPanel.show({
                        title           : `${Lang.getText(Lang.Type.B0365)}`,
                        currentValue    : "",
                        maxChars        : 2,
                        charRestrict    : "0-9",
                        tips            : `${Lang.getText(Lang.Type.B0319)}: [${CommonConstants.ReplayMinRating}, ${CommonConstants.ReplayMaxRating}]`,
                        callback        : panel => {
                            const text  = panel.getInputText();
                            const value = Number(text);
                            if ((!text) || (isNaN(value)) || (value > CommonConstants.ReplayMaxRating) || (value < CommonConstants.ReplayMinRating)) {
                                FloatText.show(Lang.getText(Lang.Type.A0098));
                            } else {
                                Common.CommonProxy.reqCommonRateMultiPlayerReplay(this._war.getWarId(), value);
                            }
                        },
                    });
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

        private _createCommandGotoLobby(): DataForCommandRenderer | undefined {
            return {
                name    : Lang.getText(Lang.Type.B0054),
                callback: () => {
                    Common.CommonConfirmPanel.show({
                        title   : Lang.getText(Lang.Type.B0054),
                        content : Lang.getText(Lang.Type.A0025),
                        callback: () => FlowManager.gotoLobby(),
                    });
                },
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
            if (Common.CommonModel.getUnitAndTileTextureVersion() === Types.UnitAndTileTextureVersion.V1) {
                return null;
            } else {
                return {
                    name    : Lang.getText(Lang.Type.B0385),
                    callback: () => {
                        Common.CommonModel.setUnitAndTileTextureVersion(Types.UnitAndTileTextureVersion.V1);
                        this._updateView();
                    }
                };
            }
        }
        private _createCommandUseNewTexture(): DataForCommandRenderer | null {
            if (Common.CommonModel.getUnitAndTileTextureVersion() === Types.UnitAndTileTextureVersion.V2) {
                return null;
            } else {
                return {
                    name    : Lang.getText(Lang.Type.B0386),
                    callback: () => {
                        Common.CommonModel.setUnitAndTileTextureVersion(Types.UnitAndTileTextureVersion.V2);
                        this._updateView();
                    }
                };
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
        war     : ReplayWar;
        player  : BaseWar.BwPlayer;
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

                const isInfoKnown               = true;
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
                    : Utility.ConfigManager.getCoBasicCfg(Utility.ConfigManager.getNewestConfigVersion(), coId).name;

                const superPowerEnergy      = player.getCoSuperPowerEnergy();
                const powerEnergy           = player.getCoPowerEnergy();
                const skillType             = player.getCoUsingSkillType();
                const currEnergyText        = skillType === Types.CoSkillType.Passive
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

        private _getTilesCountAndIncome(war: ReplayWar, playerIndex: number): { count: number, income: number } {
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

        private _getUnitsCountAndValue(war: ReplayWar, playerIndex: number): { count: number, value: number } {
            const unitMap   = war.getUnitMap();
            let count       = 0;
            let value       = 0;
            unitMap.forEachUnitOnMap(unit => {
                if (unit.getPlayerIndex() === playerIndex) {
                    ++count;
                    value += Math.floor(unit.getProductionFinalCost() * unit.getNormalizedCurrentHp() / unit.getNormalizedMaxHp());

                    for (const unitLoaded of unitMap.getUnitsLoadedByLoader(unit, true)) {
                        ++count;
                        value += Math.floor(unitLoaded.getProductionFinalCost() * unitLoaded.getNormalizedCurrentHp() / unitLoaded.getNormalizedMaxHp());
                    }
                }
            });
            return { count, value };
        }
    }
}
