
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
        private _listPlayer                     : GameUi.UiScrollList;

        private _war        : ReplayWar;
        private _unitMap    : ReplayUnitMap;
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
            const data = e.data as ProtoTypes.NetMessage.IS_ScrCreateCustomWar;
            Common.CommonConfirmPanel.show({
                title   : Lang.getText(Lang.Type.B0088),
                content : Lang.getText(Lang.Type.A0107),
                callback: () => {
                    FlowManager.gotoSingleCustomWar(data.warData);
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
        private _group      : eui.Group;
        private _labelName  : GameUi.UiLabel;
        private _labelForce : GameUi.UiLabel;
        private _labelLost  : GameUi.UiLabel;
        private _listInfo   : GameUi.UiScrollList;

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
            const playerIndex   = player.getPlayerIndex();
            return [
                this._createDataFund(war, playerIndex, player),
                this._createDataBuildings(war, playerIndex, player),
                this._createDataCoName(war, playerIndex, player),
                this._createDataEnergy(war, playerIndex, player),
                this._createDataUnitAndValue(war, playerIndex, player),
                this._createDataInitialFund(war, playerIndex, player),
                this._createDataIncomeMultiplier(war, playerIndex, player),
                this._createDataInitialEnergyPercentage(war, playerIndex, player),
                this._createDataEnergyGrowthMultiplier(war, playerIndex, player),
                this._createDataMoveRangeModifier(war, playerIndex, player),
                this._createDataAttackPowerModifier(war, playerIndex, player),
                this._createDataVisionRangeModifier(war, playerIndex, player),
                this._createDataLuckLowerLimit(war, playerIndex, player),
                this._createDataLuckUpperLimit(war, playerIndex, player),
            ];
        }
        private _createDataFund(
            war         : ReplayWar,
            playerIndex : number,
            player      : ReplayPlayer,
        ): DataForInfoRenderer {
            return {
                titleText               : Lang.getText(Lang.Type.B0032),
                infoText                : `${player.getFund()}`,
                infoColor               : 0xFFFFFF,
            };
        }
        private _createDataBuildings(
            war         : ReplayWar,
            playerIndex : number,
            player      : ReplayPlayer,
        ): DataForInfoRenderer {
            const info = this._getTilesCountAndIncome(war, playerIndex);
            return {
                titleText               : Lang.getText(Lang.Type.B0158),
                infoText                : `${info.count} / +${info.income}`,
                infoColor               : 0xFFFFFF,
            };
        }
        private _createDataCoName(
            war         : ReplayWar,
            playerIndex : number,
            player      : ReplayPlayer,
        ): DataForInfoRenderer {
            const cfg = Utility.ConfigManager.getCoBasicCfg(war.getConfigVersion(), player.getCoId());
            return {
                titleText               : `CO`,
                infoText                : !cfg
                    ? `(${Lang.getText(Lang.Type.B0001)})`
                    : `${cfg.name}(T${cfg.tier})`,
                infoColor               : 0xFFFFFF,
            };
        }
        private _createDataEnergy(
            war         : ReplayWar,
            playerIndex : number,
            player      : ReplayPlayer,
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
                titleText               : Lang.getText(Lang.Type.B0159),
                infoText                : `${!hasLoadedCo ? `--` : currEnergyText} / ${powerEnergy == null ? "--" : powerEnergy} / ${superPowerEnergy == null ? "--" : superPowerEnergy}`,
                infoColor               : 0xFFFFFF,
            };
        }
        private _createDataUnitAndValue(
            war         : ReplayWar,
            playerIndex : number,
            player      : ReplayPlayer,
        ): DataForInfoRenderer {
            const unitsCountAndValue = this._getUnitsCountAndValue(war, playerIndex);
            return {
                titleText               : Lang.getText(Lang.Type.B0160),
                infoText                : `${unitsCountAndValue.count} / ${unitsCountAndValue.value}`,
                infoColor               : 0xFFFFFF,
            };
        }
        private _createDataInitialFund(
            war         : ReplayWar,
            playerIndex : number,
            player      : ReplayPlayer,
        ): DataForInfoRenderer {
            const currValue = war.getSettingsInitialFund(playerIndex);
            return {
                titleText               : Lang.getText(Lang.Type.B0178),
                infoText                : `${currValue}`,
                infoColor               : getTextColor(currValue, CommonConstants.WarRuleInitialFundDefault),
            };
        }
        private _createDataIncomeMultiplier(
            war         : ReplayWar,
            playerIndex : number,
            player      : ReplayPlayer,
        ): DataForInfoRenderer {
            const currValue = war.getSettingsIncomeMultiplier(playerIndex);
            return {
                titleText               : Lang.getText(Lang.Type.B0179),
                infoText                : `${currValue}%`,
                infoColor               : getTextColor(currValue, CommonConstants.WarRuleIncomeMultiplierDefault),
            };
        }
        private _createDataInitialEnergyPercentage(
            war         : ReplayWar,
            playerIndex : number,
            player      : ReplayPlayer,
        ): DataForInfoRenderer {
            const currValue = war.getSettingsInitialEnergyPercentage(playerIndex);
            return {
                titleText               : Lang.getText(Lang.Type.B0180),
                infoText                : `${currValue}%`,
                infoColor               : getTextColor(currValue, CommonConstants.WarRuleInitialEnergyDefault),
            };
        }
        private _createDataEnergyGrowthMultiplier(
            war         : ReplayWar,
            playerIndex : number,
            player      : ReplayPlayer,
        ): DataForInfoRenderer {
            const currValue = war.getSettingsEnergyGrowthMultiplier(playerIndex);
            return {
                titleText               : Lang.getText(Lang.Type.B0181),
                infoText                : `${currValue}%`,
                infoColor               : getTextColor(currValue, CommonConstants.WarRuleEnergyGrowthMultiplierDefault),
            };
        }
        private _createDataMoveRangeModifier(
            war         : ReplayWar,
            playerIndex : number,
            player      : ReplayPlayer,
        ): DataForInfoRenderer {
            const currValue = war.getSettingsMoveRangeModifier(playerIndex);
            return {
                titleText               : Lang.getText(Lang.Type.B0182),
                infoText                : `${currValue}`,
                infoColor               : getTextColor(currValue, CommonConstants.WarRuleMoveRangeModifierDefault),
            };
        }
        private _createDataAttackPowerModifier(
            war         : ReplayWar,
            playerIndex : number,
            player      : ReplayPlayer,
        ): DataForInfoRenderer {
            const currValue = war.getSettingsAttackPowerModifier(playerIndex);
            return {
                titleText               : Lang.getText(Lang.Type.B0183),
                infoText                : `${currValue}%`,
                infoColor               : getTextColor(currValue, CommonConstants.WarRuleOffenseBonusDefault),
            };
        }
        private _createDataVisionRangeModifier(
            war         : ReplayWar,
            playerIndex : number,
            player      : ReplayPlayer,
        ): DataForInfoRenderer {
            const currValue = war.getSettingsVisionRangeModifier(playerIndex);
            return {
                titleText               : Lang.getText(Lang.Type.B0184),
                infoText                : `${currValue}`,
                infoColor               : getTextColor(currValue, CommonConstants.WarRuleVisionRangeModifierDefault),
            };
        }
        private _createDataLuckLowerLimit(
            war         : ReplayWar,
            playerIndex : number,
            player      : ReplayPlayer,
        ): DataForInfoRenderer {
            const currValue = war.getSettingsLuckLowerLimit(playerIndex);
            return {
                titleText               : Lang.getText(Lang.Type.B0189),
                infoText                : `${currValue}%`,
                infoColor               : getTextColor(currValue, CommonConstants.WarRuleLuckDefaultLowerLimit),
            };
        }
        private _createDataLuckUpperLimit(
            war         : ReplayWar,
            playerIndex : number,
            player      : ReplayPlayer,
        ): DataForInfoRenderer {
            const currValue = war.getSettingsLuckUpperLimit(playerIndex);
            return {
                titleText               : Lang.getText(Lang.Type.B0190),
                infoText                : `${currValue}%`,
                infoColor               : getTextColor(currValue, CommonConstants.WarRuleLuckDefaultUpperLimit),
            };
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

    type DataForInfoRenderer = {
        titleText               : string;
        infoText                : string;
        infoColor               : number;
    }

    class InfoRenderer extends eui.ItemRenderer {
        private _btnTitle   : GameUi.UiButton;
        private _labelValue : GameUi.UiLabel;

        protected dataChanged(): void {
            super.dataChanged();

            const data                  = this.data as DataForInfoRenderer;
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
