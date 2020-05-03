
namespace TinyWars.SingleCustomWar {
    import ConfirmPanel     = Common.ConfirmPanel;
    import Notify           = Utility.Notify;
    import Lang             = Utility.Lang;
    import Types            = Utility.Types;
    import FlowManager      = Utility.FlowManager;
    import Logger           = Utility.Logger;
    import FloatText        = Utility.FloatText;
    import LocalStorage     = Utility.LocalStorage;
    import ProtoManager     = Utility.ProtoManager;
    import ProtoTypes       = Utility.ProtoTypes;
    import WarMapModel      = WarMap.WarMapModel;
    import TimeModel        = Time.TimeModel;
    import CommonConstants  = ConfigManager.COMMON_CONSTANTS;

    const enum MenuType {
        Main,
        Advanced,
    }

    export class ScwWarMenuPanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Hud0;
        protected readonly _IS_EXCLUSIVE = false;

        private static _instance: ScwWarMenuPanel;

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

        private _war            : ScwWar;
        private _unitMap        : ScwUnitMap;
        private _actionPlanner  : ScwActionPlanner;
        private _dataForList    : DataForCommandRenderer[];
        private _menuType       = MenuType.Main;

        public static show(): void {
            if (!ScwWarMenuPanel._instance) {
                ScwWarMenuPanel._instance = new ScwWarMenuPanel();
            }
            ScwWarMenuPanel._instance.open();
        }
        public static hide(): void {
            if (ScwWarMenuPanel._instance) {
                ScwWarMenuPanel._instance.close();
            }
        }
        public static getIsOpening(): boolean {
            const instance = ScwWarMenuPanel._instance;
            return instance ? instance.getIsOpening() : false;
        }

        public constructor() {
            super();

            this._setAutoAdjustHeightEnabled();
            this.skinName = `resource/skins/singleCustomWar/ScwWarMenuPanel.exml`;
        }

        protected _onFirstOpened(): void {
            this._notifyListeners = [
                { type: Notify.Type.LanguageChanged,                callback: this._onNotifyLanguageChanged },
                { type: Notify.Type.BwActionPlannerStateChanged,    callback: this._onNotifyBwPlannerStateChanged },
                { type: Notify.Type.SScrContinueWar,                callback: this._onNotifySScrContinueWar },
                { type: Notify.Type.SScrSaveWar,                    callback: this._onNotifySScrSaveWar },
                { type: Notify.Type.SScrCreateCustomWar,            callback: this._onNotifySScrCreateCustomWar },
            ];
            this._uiListeners = [
                { ui: this._btnBack, callback: this._onTouchedBtnBack },
            ];
            this._listCommand.setItemRenderer(CommandRenderer);
            this._listPlayer.setItemRenderer(PlayerRenderer);
            this._listWarInfo.setItemRenderer(InfoRenderer);
        }
        protected _onOpened(): void {
            const war           = ScwModel.getWar();
            this._war           = war;
            this._unitMap       = war.getUnitMap() as ScwUnitMap;
            this._actionPlanner = war.getActionPlanner() as ScwActionPlanner;
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
        private _onNotifyBwPlannerStateChanged(e: egret.Event): void {
            const war = this._war;
            if (war.checkIsHumanInTurn()) {
                this.close();
            } else {
                this.updateListPlayer();
            }
        }

        private _onNotifySScrContinueWar(e: egret.Event): void {
            const data      = e.data as ProtoTypes.IS_ScrContinueWar;
            const warData   = ProtoManager.decodeAsSerializedWar(data.encodedWar);
            Utility.FlowManager.gotoSingleCustomWar(warData);
        }

        private _onNotifySScrSaveWar(e: egret.Event): void {
            FloatText.show(Lang.getText(Lang.Type.A0073));
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

        private _onNotifyLanguageChanged(e: egret.Event): void {
            this._updateComponentsForLanguage();
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
            this.updateListPlayer();
        }

        private _updateListCommand(): void {
            this._dataForList = this._createDataForListCommand();
            if (!this._dataForList.length) {
                this._labelNoCommand.visible = true;
                this._listCommand.clear();
            } else {
                this._labelNoCommand.visible = false;
                this._listCommand.bindData(this._dataForList);
            }
        }

        private _updateComponentsForLanguage(): void {
            this._labelMenuTitle.text       = Lang.getText(Lang.Type.B0155);
            this._labelWarInfoTitle.text    = Lang.getText(Lang.Type.B0223);
            this._labelPlayerInfoTitle.text = Lang.getText(Lang.Type.B0224);
            this._btnMapNameTitle.label     = Lang.getText(Lang.Type.B0225);
            this._btnBack.label             = Lang.getText(Lang.Type.B0146);
            this._updateListWarInfo();
        }

        private async _updateGroupInfo(): Promise<void> {
            const war               = this._war;
            const mapFileName       = war.getMapFileName();
            this._labelMapName.text = `${await WarMapModel.getMapNameInLanguage(mapFileName) || "----"} (${Lang.getText(Lang.Type.B0163)}: ${await WarMapModel.getMapDesigner(mapFileName) || "----"})`;
        }

        private _updateListWarInfo(): void {
            const dataList: DataForInfoRenderer[] = [
                this._createWarInfoTurnIndex(),
                this._createWarInfoInitialFund(),
                this._createWarInfoIncomeModifier(),
                this._createWarInfoInitialEnergy(),
                this._createWarInfoEnergyGrowthMultiplier(),
                this._createWarInfoMoveRangeModifier(),
                this._createWarInfoAttackPowerModifier(),
                this._createWarInfoVisionRangeModifier(),
                this._createWarInfoLuckLowerLimit(),
                this._createWarInfoLuckUpperLimit(),
            ];
            this._listWarInfo.bindData(dataList);
        }

        public updateListPlayer(): void {
            const war   = this._war;
            const data  = [] as DataForPlayerRenderer[];
            war.getPlayerManager().forEachPlayer(false, (player: ScwPlayer) => {
                data.push({
                    war,
                    player,
                    panel   : this,
                });
            });
            this._listPlayer.bindData(data);
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // War info data creators.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _createWarInfoTurnIndex(): DataForInfoRenderer {
            const war = this._war;
            return {
                titleText               : Lang.getText(Lang.Type.B0091),
                infoText                : `${war.getTurnManager().getTurnIndex() + 1} (${Lang.getText(Lang.Type.B0090)}: ${war.getNextActionId() + 1})`,
                infoColor               : 0xFFFFFF,
                callbackOnTouchedTitle  : null,
            };
        }

        private _createWarInfoInitialFund(): DataForInfoRenderer {
            const war       = this._war;
            const currValue = war.getSettingsInitialFund();
            const maxValue  = CommonConstants.WarRuleInitialFundMaxLimit;
            const minValue  = CommonConstants.WarRuleInitialFundMinLimit;
            return {
                titleText               : Lang.getText(Lang.Type.B0178),
                infoText                : `${currValue}`,
                infoColor               : getTextColor(currValue, CommonConstants.WarRuleInitialFundDefault),
                callbackOnTouchedTitle  : !war.getIsSinglePlayerCheating()
                    ? null
                    : () => {
                        Common.InputPanel.show({
                            title           : Lang.getText(Lang.Type.B0178),
                            currentValue    : "" + currValue,
                            maxChars        : 7,
                            charRestrict    : "0-9",
                            tips            : `${Lang.getText(Lang.Type.B0319)}: [${minValue}, ${maxValue}]`,
                            callback        : panel => {
                                const text  = panel.getInputText();
                                const value = text ? Number(text) : NaN;
                                if ((isNaN(value)) || (value > maxValue) || (value < minValue)) {
                                    FloatText.show(Lang.getText(Lang.Type.A0098));
                                } else {
                                    war.setSettingsInitialFund(value);
                                    this._updateListWarInfo();
                                }
                            },
                        });
                },
            };
        }

        private _createWarInfoIncomeModifier(): DataForInfoRenderer {
            const war       = this._war;
            const currValue = war.getSettingsIncomeModifier();
            const maxValue  = CommonConstants.WarRuleIncomeMultiplierMaxLimit;
            const minValue  = CommonConstants.WarRuleIncomeMultiplierMinLimit;
            return {
                titleText               : Lang.getText(Lang.Type.B0179),
                infoText                : `${currValue}%`,
                infoColor               : getTextColor(currValue, CommonConstants.WarRuleIncomeMultiplierDefault),
                callbackOnTouchedTitle  : !war.getIsSinglePlayerCheating()
                    ? null
                    : () => {
                        Common.InputPanel.show({
                            title           : Lang.getText(Lang.Type.B0179),
                            currentValue    : "" + currValue,
                            maxChars        : 5,
                            charRestrict    : "0-9",
                            tips            : `${Lang.getText(Lang.Type.B0319)}: [${minValue}, ${maxValue}]`,
                            callback        : panel => {
                                const text  = panel.getInputText();
                                const value = text ? Number(text) : NaN;
                                if ((isNaN(value)) || (value > maxValue) || (value < minValue)) {
                                    FloatText.show(Lang.getText(Lang.Type.A0098));
                                } else {
                                    war.setSettingsIncomeModifier(value);
                                    this._updateListWarInfo();
                                }
                            },
                        });
                    },
            };
        }

        private _createWarInfoInitialEnergy(): DataForInfoRenderer {
            const war       = this._war;
            const currValue = war.getSettingsInitialEnergy();
            const minValue  = CommonConstants.WarRuleInitialEnergyMinLimit;
            const maxValue  = CommonConstants.WarRuleInitialEnergyMaxLimit;
            return {
                titleText               : Lang.getText(Lang.Type.B0180),
                infoText                : `${currValue}%`,
                infoColor               : getTextColor(currValue, CommonConstants.WarRuleInitialEnergyDefault),
                callbackOnTouchedTitle  : !war.getIsSinglePlayerCheating()
                    ? null
                    : () => {
                        Common.InputPanel.show({
                            title           : Lang.getText(Lang.Type.B0180),
                            currentValue    : "" + currValue,
                            maxChars        : 3,
                            charRestrict    : "0-9",
                            tips            : `${Lang.getText(Lang.Type.B0319)}: [${minValue}, ${maxValue}]`,
                            callback        : panel => {
                                const text  = panel.getInputText();
                                const value = text ? Number(text) : NaN;
                                if ((isNaN(value)) || (value > maxValue) || (value < minValue)) {
                                    FloatText.show(Lang.getText(Lang.Type.A0098));
                                } else {
                                    war.setSettingsInitialEnergy(value);
                                    this._updateListWarInfo();
                                }
                            },
                        });
                    },
            };
        }

        private _createWarInfoEnergyGrowthMultiplier(): DataForInfoRenderer {
            const war       = this._war;
            const currValue = war.getSettingsEnergyGrowthMultiplier();
            const minValue  = CommonConstants.WarRuleEnergyGrowthMultiplierMinLimit;
            const maxValue  = CommonConstants.WarRuleEnergyGrowthMultiplierMaxLimit;
            return {
                titleText               : Lang.getText(Lang.Type.B0181),
                infoText                : `${currValue}%`,
                infoColor               : getTextColor(currValue, CommonConstants.WarRuleEnergyGrowthMultiplierDefault),
                callbackOnTouchedTitle  : !war.getIsSinglePlayerCheating()
                    ? null
                    : () => {
                        Common.InputPanel.show({
                            title           : Lang.getText(Lang.Type.B0181),
                            currentValue    : "" + currValue,
                            maxChars        : 5,
                            charRestrict    : "0-9",
                            tips            : `${Lang.getText(Lang.Type.B0319)}: [${minValue}, ${maxValue}]`,
                            callback        : panel => {
                                const text  = panel.getInputText();
                                const value = text ? Number(text) : NaN;
                                if ((isNaN(value)) || (value > maxValue) || (value < minValue)) {
                                    FloatText.show(Lang.getText(Lang.Type.A0098));
                                } else {
                                    war.setSettingsEnergyGrowthMultiplier(value);
                                    this._updateListWarInfo();
                                }
                            },
                        });
                    },
            };
        }

        private _createWarInfoMoveRangeModifier(): DataForInfoRenderer {
            const war       = this._war;
            const currValue = war.getSettingsMoveRangeModifier();
            const minValue  = CommonConstants.WarRuleMoveRangeModifierMinLimit;
            const maxValue  = CommonConstants.WarRuleMoveRangeModifierMaxLimit;
            return {
                titleText               : Lang.getText(Lang.Type.B0182),
                infoText                : `${currValue}`,
                infoColor               : getTextColor(currValue, CommonConstants.WarRuleMoveRangeModifierDefault),
                callbackOnTouchedTitle  : !war.getIsSinglePlayerCheating()
                    ? null
                    : () => {
                        Common.InputPanel.show({
                            title           : Lang.getText(Lang.Type.B0182),
                            currentValue    : "" + currValue,
                            maxChars        : 3,
                            charRestrict    : "0-9\\-",
                            tips            : `${Lang.getText(Lang.Type.B0319)}: [${minValue}, ${maxValue}]`,
                            callback        : panel => {
                                const text  = panel.getInputText();
                                const value = text ? Number(text) : NaN;
                                if ((isNaN(value)) || (value > maxValue) || (value < minValue)) {
                                    FloatText.show(Lang.getText(Lang.Type.A0098));
                                } else {
                                    war.setSettingsMoveRangeModifier(value);
                                    this._updateListWarInfo();
                                }
                            },
                        });
                    },
            };
        }

        private _createWarInfoAttackPowerModifier(): DataForInfoRenderer {
            const war       = this._war;
            const currValue = war.getSettingsAttackPowerModifier();
            const minValue  = CommonConstants.WarRuleOffenseBonusMinLimit;
            const maxValue  = CommonConstants.WarRuleOffenseBonusMaxLimit;
            return {
                titleText               : Lang.getText(Lang.Type.B0183),
                infoText                : `${currValue}%`,
                infoColor               : getTextColor(currValue, CommonConstants.WarRuleOffenseBonusDefault),
                callbackOnTouchedTitle  : !war.getIsSinglePlayerCheating()
                    ? null
                    : () => {
                        Common.InputPanel.show({
                            title           : Lang.getText(Lang.Type.B0183),
                            currentValue    : "" + currValue,
                            maxChars        : 5,
                            charRestrict    : "0-9\\-",
                            tips            : `${Lang.getText(Lang.Type.B0319)}: [${minValue}, ${maxValue}]`,
                            callback        : panel => {
                                const text  = panel.getInputText();
                                const value = text ? Number(text) : NaN;
                                if ((isNaN(value)) || (value > maxValue) || (value < minValue)) {
                                    FloatText.show(Lang.getText(Lang.Type.A0098));
                                } else {
                                    war.setSettingsAttackPowerModifier(value);
                                    this._updateListWarInfo();
                                }
                            },
                        });
                    },
            };
        }

        private _createWarInfoVisionRangeModifier(): DataForInfoRenderer {
            const war       = this._war;
            const currValue = war.getSettingsVisionRangeModifier();
            const minValue  = CommonConstants.WarRuleVisionRangeModifierMinLimit;
            const maxValue  = CommonConstants.WarRuleVisionRangeModifierMaxLimit;
            return {
                titleText               : Lang.getText(Lang.Type.B0184),
                infoText                : `${currValue}`,
                infoColor               : getTextColor(currValue, CommonConstants.WarRuleVisionRangeModifierDefault),
                callbackOnTouchedTitle  : !war.getIsSinglePlayerCheating()
                    ? null
                    : () => {
                        Common.InputPanel.show({
                            title           : Lang.getText(Lang.Type.B0184),
                            currentValue    : "" + currValue,
                            maxChars        : 3,
                            charRestrict    : "0-9\\-",
                            tips            : `${Lang.getText(Lang.Type.B0319)}: [${minValue}, ${maxValue}]`,
                            callback        : panel => {
                                const text  = panel.getInputText();
                                const value = text ? Number(text) : NaN;
                                if ((isNaN(value)) || (value > maxValue) || (value < minValue)) {
                                    FloatText.show(Lang.getText(Lang.Type.A0098));
                                } else {
                                    war.setSettingsVisionRangeModifier(value);
                                    this._updateListWarInfo();
                                }
                            },
                        });
                    },
            };
        }

        private _createWarInfoLuckLowerLimit(): DataForInfoRenderer {
            const war       = this._war;
            const currValue = war.getSettingsLuckLowerLimit();
            const minValue  = CommonConstants.WarRuleLuckMinLimit;
            const maxValue  = CommonConstants.WarRuleLuckMaxLimit;
            return {
                titleText               : Lang.getText(Lang.Type.B0189),
                infoText                : `${currValue}%`,
                infoColor               : getTextColor(currValue, CommonConstants.WarRuleLuckDefaultLowerLimit),
                callbackOnTouchedTitle  : !war.getIsSinglePlayerCheating()
                    ? null
                    : () => {
                        Common.InputPanel.show({
                            title           : Lang.getText(Lang.Type.B0189),
                            currentValue    : "" + currValue,
                            maxChars        : 4,
                            charRestrict    : "0-9\\-",
                            tips            : `${Lang.getText(Lang.Type.B0319)}: [${minValue}, ${maxValue}]`,
                            callback        : panel => {
                                const text  = panel.getInputText();
                                const value = text ? Number(text) : NaN;
                                if ((isNaN(value)) || (value > maxValue) || (value < minValue)) {
                                    FloatText.show(Lang.getText(Lang.Type.A0098));
                                } else {
                                    const upperLimit = war.getSettingsLuckUpperLimit();
                                    if (value <= upperLimit) {
                                        war.setSettingsLuckLowerLimit(value);
                                    } else {
                                        war.setSettingsLuckUpperLimit(value);
                                        war.setSettingsLuckLowerLimit(upperLimit);
                                    }
                                    this._updateListWarInfo();
                                }
                            },
                        });
                    },
            };
        }

        private _createWarInfoLuckUpperLimit(): DataForInfoRenderer {
            const war       = this._war;
            const currValue = war.getSettingsLuckUpperLimit();
            const minValue  = CommonConstants.WarRuleLuckMinLimit;
            const maxValue  = CommonConstants.WarRuleLuckMaxLimit;
            return {
                titleText               : Lang.getText(Lang.Type.B0190),
                infoText                : `${currValue}%`,
                infoColor               : getTextColor(currValue, CommonConstants.WarRuleLuckDefaultUpperLimit),
                callbackOnTouchedTitle  : !war.getIsSinglePlayerCheating()
                    ? null
                    : () => {
                        Common.InputPanel.show({
                            title           : Lang.getText(Lang.Type.B0190),
                            currentValue    : "" + currValue,
                            maxChars        : 4,
                            charRestrict    : "0-9\\-",
                            tips            : `${Lang.getText(Lang.Type.B0319)}: [${minValue}, ${maxValue}]`,
                            callback        : panel => {
                                const text  = panel.getInputText();
                                const value = text ? Number(text) : NaN;
                                if ((isNaN(value)) || (value > maxValue) || (value < minValue)) {
                                    FloatText.show(Lang.getText(Lang.Type.A0098));
                                } else {
                                    const lowerLimit = war.getSettingsLuckLowerLimit();
                                    if (value >= lowerLimit) {
                                        war.setSettingsLuckUpperLimit(value);
                                    } else {
                                        war.setSettingsLuckLowerLimit(value);
                                        war.setSettingsLuckUpperLimit(lowerLimit);
                                    }
                                    this._updateListWarInfo();
                                }
                            },
                        });
                    },
            };
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Menu item data creators.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _createDataForListCommand(): DataForCommandRenderer[] {
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
                this._createCommandOpenCoInfoMenu(),
                this._createCommandSaveGame(),
                this._createCommandLoadGame(),
                this._createCommandEnableCheating(),
                this._createCommandOpenAdvancedMenu(),
                this._createCommandChat(),
                this._createCommandGotoLobby(),
            ].filter(v => !!v);
        }

        private _createDataForAdvancedMenu(): DataForCommandRenderer[] {
            return [
                this._createCommandPlayerDeleteUnit(),
                this._createCommandSimulation(),
                this._createCommandShowTileAnimation(),
                this._createCommandStopTileAnimation(),
            ].filter(v => !!v);
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

        private _createCommandChat(): DataForCommandRenderer | null {
            return {
                name    : Lang.getText(Lang.Type.B0383),
                callback: () => {
                    this.close();
                    Chat.ChatPanel.show({});
                },
            }
        }

        private _createCommandOpenCoInfoMenu(): DataForCommandRenderer | undefined {
            return {
                name    : Lang.getText(Lang.Type.B0140),
                callback: () => {
                    ScwCoListPanel.show(this._war.getPlayerIndexInTurn() - 1);
                    ScwWarMenuPanel.hide();
                },
            };
        }

        private _createCommandSaveGame(): DataForCommandRenderer | null {
            const war = this._war;
            if ((!war)                                                              ||
                (!war.checkIsHumanInTurn())                                         ||
                (!war.getTurnManager().getPhaseCode())                              ||
                (war.getActionPlanner().getState() !== Types.ActionPlannerState.Idle)
            ) {
                return null;
            } else {
                return {
                    name    : Lang.getText(Lang.Type.B0260),
                    callback: () => {
                        Common.ConfirmPanel.show({
                            title   : Lang.getText(Lang.Type.B0088),
                            content : Lang.getText(Lang.Type.A0071),
                            callback: () => {
                                SingleCustomRoom.ScrProxy.reqSaveWar(war);
                            },
                        })
                    },
                };
            }
        }

        private _createCommandLoadGame(): DataForCommandRenderer | null {
            const war = this._war;
            if ((!war)                                                              ||
                (!war.checkIsHumanInTurn())                                         ||
                (!war.getTurnManager().getPhaseCode())                              ||
                (war.getActionPlanner().getState() !== Types.ActionPlannerState.Idle)
            ) {
                return null;
            } else {
                return {
                    name    : Lang.getText(Lang.Type.B0261),
                    callback: () => {
                        Common.ConfirmPanel.show({
                            title   : Lang.getText(Lang.Type.B0088),
                            content : Lang.getText(Lang.Type.A0072),
                            callback: () => {
                                SingleCustomRoom.ScrProxy.reqContinueWar(war.getSaveSlotIndex());
                            },
                        })
                    },
                };
            }
        }

        private _createCommandEnableCheating(): DataForCommandRenderer | null {
            const war = this._war;
            if ((!war) || (war.getIsSinglePlayerCheating())) {
                return null;
            } else {
                return {
                    name    : Lang.getText(Lang.Type.B0366),
                    callback: () => {
                        Common.ConfirmPanel.show({
                            title   : Lang.getText(Lang.Type.B0088),
                            content : Lang.getText(Lang.Type.A0108),
                            callback: () => {
                                war.setIsSinglePlayerCheating(true);
                                this._updateView();
                            },
                        });
                    },
                }
            }
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

        private _createCommandPlayerDeleteUnit(): DataForCommandRenderer | undefined {
            const war = this._war;
            if ((!war.checkIsHumanInTurn())                                         ||
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
                        } else if ((unit.getPlayerIndex() !== war.getPlayerIndexInTurn()) || (unit.getActionState() !== Types.UnitActionState.Idle)) {
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
        war     : ScwWar;
        player  : ScwPlayer;
        panel   : ScwWarMenuPanel;
    }

    class PlayerRenderer extends eui.ItemRenderer {
        private _group          : eui.Group;
        private _btnName        : GameUi.UiButton;
        private _labelForce     : GameUi.UiLabel;
        private _labelLost      : GameUi.UiLabel;
        private _listInfo       : GameUi.UiScrollList;

        protected childrenCreated(): void {
            super.childrenCreated();

            this._listInfo.setItemRenderer(InfoRenderer);
            this._btnName.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onTouchedBtnName, this);
        }

        protected dataChanged(): void {
            super.dataChanged();

            const data                  = this.data as DataForPlayerRenderer;
            const war                   = data.war;
            const player                = data.player;
            this._btnName.label         = player.getUserId() != null ? Lang.getText(Lang.Type.B0031) : Lang.getText(Lang.Type.B0256);
            this._labelForce.text       = `${Lang.getPlayerForceName(player.getPlayerIndex())}`
                + `  ${Lang.getPlayerTeamName(player.getTeamIndex())}`
                + `  ${player === war.getPlayerInTurn() ? Lang.getText(Lang.Type.B0086) : ""}`;
            this._labelForce.textColor  = player === war.getPlayerInTurn() ? 0x00FF00 : 0xFFFFFF;
            (this._btnName.labelDisplay as GameUi.UiLabel).textColor = war.getIsSinglePlayerCheating() ? 0x00FF00 : 0xFFFFFF;

            if (!player.getIsAlive()) {
                this._labelLost.visible = true;
                this._listInfo.visible  = false;
            } else {
                this._labelLost.visible = false;
                this._listInfo.visible  = true;
                this._listInfo.bindData(this._createDataForListInfo());
            }
        }

        private _onTouchedBtnName(e: egret.TouchEvent): void {
            const data  = this.data as DataForPlayerRenderer;
            const war   = data.war;
            if (war.getIsSinglePlayerCheating()) {
                const player    = data.player;
                const isHuman   = player.getUserId() != null;
                Common.ConfirmPanel.show({
                    title   : Lang.getText(Lang.Type.B0088),
                    content : isHuman ? Lang.getText(Lang.Type.A0110) : Lang.getText(Lang.Type.A0111),
                    callback: () => {
                        if (!isHuman) {
                            player.setUserId(User.UserModel.getSelfUserId());
                        } else {
                            player.setUserId(null);
                            ScwModel.checkAndRequestBeginTurnOrRunRobot(war);
                        }
                        data.panel.updateListPlayer();
                    },
                });
            }
        }

        private _createDataForListInfo(): DataForInfoRenderer[] {
            const data          = this.data as DataForPlayerRenderer;
            const war           = data.war;
            const player        = data.player;
            const panel         = data.panel;
            const isCheating    = war.getIsSinglePlayerCheating();
            const isInfoKnown   = (!war.getFogMap().checkHasFogCurrently()) || ((war.getPlayerManager() as ScwPlayerManager).getWatcherTeamIndexesForScw().has(player.getTeamIndex()));
            return [
                this._createDataFund(war, player, isInfoKnown, isCheating, panel),
                this._createDataBuildings(war, player, isInfoKnown, isCheating, panel),
                this._createDataCoName(war, player, isInfoKnown, isCheating, panel),
                this._createDataEnergy(war, player, isInfoKnown, isCheating, panel),
                this._createDataUnitAndValue(war, player, isInfoKnown, isCheating, panel),
            ];
        }
        private _createDataFund(
            war         : ScwWar,
            player      : ScwPlayer,
            isInfoKnown : boolean,
            isCheating  : boolean,
            menuPanel   : ScwWarMenuPanel,
        ): DataForInfoRenderer {
            const currValue = player.getFund();
            const maxValue  = CommonConstants.WarRuleInitialFundMaxLimit;
            const minValue  = CommonConstants.WarRuleInitialFundMinLimit;
            return {
                titleText               : Lang.getText(Lang.Type.B0032),
                infoText                : (isInfoKnown || isCheating) ? `${player.getFund()}` : `?`,
                infoColor               : 0xFFFFFF,
                callbackOnTouchedTitle  : !isCheating
                    ? null
                    : () => {
                        Common.InputPanel.show({
                            title           : `P${player.getPlayerIndex()} ${Lang.getText(Lang.Type.B0032)}`,
                            currentValue    : "" + currValue,
                            maxChars        : 7,
                            charRestrict    : "0-9",
                            tips            : `${Lang.getText(Lang.Type.B0319)}: [${minValue}, ${maxValue}]`,
                            callback        : panel => {
                                const text  = panel.getInputText();
                                const value = text ? Number(text) : NaN;
                                if ((isNaN(value)) || (value > maxValue) || (value < minValue)) {
                                    FloatText.show(Lang.getText(Lang.Type.A0098));
                                } else {
                                    player.setFund(value);
                                    menuPanel.updateListPlayer();
                                }
                            },
                        });
                    },
            };
        }
        private _createDataBuildings(
            war         : ScwWar,
            player      : ScwPlayer,
            isInfoKnown : boolean,
            isCheating  : boolean,
            menuPanel   : ScwWarMenuPanel,
        ): DataForInfoRenderer {
            const info = this._getTilesCountAndIncome(war, player.getPlayerIndex());
            return {
                titleText               : Lang.getText(Lang.Type.B0158),
                infoText                : `${info.count} / +${info.income}${isInfoKnown ? `` : `  ?`}`,
                infoColor               : 0xFFFFFF,
                callbackOnTouchedTitle  : null,
            };
        }
        private _createDataCoName(
            war         : ScwWar,
            player      : ScwPlayer,
            isInfoKnown : boolean,
            isCheating  : boolean,
            menuPanel   : ScwWarMenuPanel,
        ): DataForInfoRenderer {
            const coId  = player.getCoId();
            const cfg   = coId == null ? null : ConfigManager.getCoBasicCfg(ConfigManager.getNewestConfigVersion(), coId);
            return {
                titleText               : `CO`,
                infoText                : !cfg
                    ? `(${Lang.getText(Lang.Type.B0001)})`
                    : `${cfg.name}(T${cfg.tier})`,
                infoColor               : 0xFFFFFF,
                callbackOnTouchedTitle  : null,
            };
        }
        private _createDataEnergy(
            war         : ScwWar,
            player      : ScwPlayer,
            isInfoKnown : boolean,
            isCheating  : boolean,
            menuPanel   : ScwWarMenuPanel,
        ): DataForInfoRenderer {
            const currValue         = player.getCoCurrentEnergy();
            const maxValue          = player.getCoMaxEnergy();
            const minValue          = 0;
            const powerEnergy       = player.getCoPowerEnergy();
            const superPowerEnergy  = player.getCoSuperPowerEnergy();
            const skillType         = player.getCoUsingSkillType();
            const currEnergyText    = skillType === Types.CoSkillType.Passive
                ? "" + currValue
                : skillType === Types.CoSkillType.Power ? "COP" : "SCOP";

            return {
                titleText               : Lang.getText(Lang.Type.B0159),
                infoText                : `${player.getCoUnitId() == null ? `--` : currEnergyText} / ${powerEnergy == null ? "--" : powerEnergy} / ${superPowerEnergy == null ? "--" : superPowerEnergy}`,
                infoColor               : 0xFFFFFF,
                callbackOnTouchedTitle  : ((!isCheating) || (!maxValue))
                    ? null
                    : () => {
                        if (player.getCoUnitId() == null) {
                            FloatText.show(Lang.getText(Lang.Type.A0109));
                        } else {
                            Common.InputPanel.show({
                                title           : `P${player.getPlayerIndex()} ${Lang.getText(Lang.Type.B0159)}`,
                                currentValue    : "" + currValue,
                                maxChars        : 3,
                                charRestrict    : "0-9",
                                tips            : `${Lang.getText(Lang.Type.B0319)}: [${minValue}, ${maxValue}]`,
                                callback        : panel => {
                                    const text  = panel.getInputText();
                                    const value = text ? Number(text) : NaN;
                                    if ((isNaN(value)) || (value > maxValue) || (value < minValue)) {
                                        FloatText.show(Lang.getText(Lang.Type.A0098));
                                    } else {
                                        player.setCoCurrentEnergy(value);
                                        menuPanel.updateListPlayer();
                                    }
                                },
                            });
                        }
                    },
            };
        }
        private _createDataUnitAndValue(
            war         : ScwWar,
            player      : ScwPlayer,
            isInfoKnown : boolean,
            isCheating  : boolean,
            menuPanel   : ScwWarMenuPanel
        ): DataForInfoRenderer {
            const unitsCountAndValue = this._getUnitsCountAndValue(war, player.getPlayerIndex());
            return {
                titleText               : Lang.getText(Lang.Type.B0160),
                infoText                : `${unitsCountAndValue.count} / ${unitsCountAndValue.value}${isInfoKnown ? `` : `  ?`}`,
                infoColor               : 0xFFFFFF,
                callbackOnTouchedTitle  : null,
            };
        }

        private _getTilesCountAndIncome(war: ScwWar, playerIndex: number): { count: number, income: number } {
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

        private _getUnitsCountAndValue(war: ScwWar, playerIndex: number): { count: number, value: number } {
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

    type DataForInfoRenderer = {
        titleText               : string;
        infoText                : string;
        infoColor               : number;
        callbackOnTouchedTitle  : (() => void) | null;
    }

    class InfoRenderer extends eui.ItemRenderer {
        private _btnTitle   : GameUi.UiButton;
        private _labelValue : GameUi.UiLabel;

        protected childrenCreated(): void {
            super.childrenCreated();

            this._btnTitle.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onTouchedBtnTitle, this);
        }

        protected dataChanged(): void {
            super.dataChanged();

            const data                  = this.data as DataForInfoRenderer;
            this._labelValue.text       = data.infoText;
            this._labelValue.textColor  = data.infoColor;
            this._btnTitle.label        = data.titleText;
            (this._btnTitle.labelDisplay as GameUi.UiLabel).textColor = data.callbackOnTouchedTitle ? 0x00FF00 : 0xFFFFFF;
        }

        private _onTouchedBtnTitle(e: egret.TouchEvent): void {
            const data      = this.data as DataForInfoRenderer;
            const callback  = data ? data.callbackOnTouchedTitle : null;
            (callback) && (callback());
        }
    }
}
