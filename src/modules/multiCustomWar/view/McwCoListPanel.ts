
namespace TinyWars.MultiCustomWar {
    import Types    = Utility.Types;
    import Lang     = Utility.Lang;
    import Notify   = Utility.Notify;

    export class McwCoListPanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Hud0;
        protected readonly _IS_EXCLUSIVE = false;

        private static _instance: McwCoListPanel;

        private _openData   : number;

        private _listCo     : GameUi.UiScrollList;
        private _btnBack    : GameUi.UiButton;

        private _scrCoInfo                  : eui.Scroller;
        private _imgCoPortrait              : GameUi.UiImage;
        private _labelName                  : GameUi.UiLabel;
        private _labelDesigner              : GameUi.UiLabel;
        private _labelForce                 : GameUi.UiLabel;
        private _labelBoardCostPercentage   : GameUi.UiLabel;
        private _labelZoneRadius            : GameUi.UiLabel;
        private _labelEnergyBar             : GameUi.UiLabel;

        private _listPassiveSkill   : GameUi.UiScrollList;
        private _labelNoPassiveSkill: GameUi.UiLabel;

        private _listCop        : GameUi.UiScrollList;
        private _labelNoCop     : GameUi.UiLabel;
        private _labelCopEnergy : GameUi.UiLabel;

        private _listScop       : GameUi.UiScrollList;
        private _labelNoScop    : GameUi.UiLabel;
        private _labelScopEnergy: GameUi.UiLabel;

        private _scrHelp    : eui.Scroller;
        private _labelHelp  : GameUi.UiLabel;

        private _war                : McwWar;
        private _dataForListCo      : DataForCoRenderer[] = [];
        private _selectedIndex      : number;

        public static show(selectedIndex: number): void {
            if (!McwCoListPanel._instance) {
                McwCoListPanel._instance = new McwCoListPanel();
            }

            McwCoListPanel._instance._openData = selectedIndex;
            McwCoListPanel._instance.open();
        }
        public static hide(): void {
            if (McwCoListPanel._instance) {
                McwCoListPanel._instance.close();
            }
        }
        public static getIsOpening(): boolean {
            const instance = McwCoListPanel._instance;
            return instance ? instance.getIsOpening() : false;
        }

        public constructor() {
            super();

            this._setAutoAdjustHeightEnabled();
            this.skinName = "resource/skins/multiCustomWar/McwCoListPanel.exml";
        }

        protected _onFirstOpened(): void {
            this._notifyListeners = [
                { type: Notify.Type.BwActionPlannerStateChanged,   callback: this._onNotifyMcwPlannerStateChanged },
            ];
            this._uiListeners = [
                { ui: this._btnBack,   callback: this._onTouchTapBtnBack },
            ];
            this._listCo.setItemRenderer(CoNameRenderer);
            this._listPassiveSkill.setItemRenderer(PassiveSkillRenderer);
            this._listCop.setItemRenderer(ActiveSkillRenderer);
            this._listScop.setItemRenderer(ActiveSkillRenderer);
        }
        protected _onOpened(): void {
            this._war           = McwModel.getWar();
            this._dataForListCo = this._createDataForListCo();
            this._listCo.bindData(this._dataForListCo);
            this.setSelectedIndex(this._openData);

            Notify.dispatch(Notify.Type.BwCoListPanelOpened);
        }
        protected _onClosed(): void {
            delete this._war;
            this._listCo.clear();
            this._listPassiveSkill.clear();
            this._listCop.clear();
            this._listScop.clear();

            Notify.dispatch(Notify.Type.BwCoListPanelClosed);
        }

        public setSelectedIndex(newIndex: number): void {
            const dataList = this._dataForListCo;
            if (!dataList[newIndex]) {
                this._selectedIndex = undefined;
                this._updateScrCoInfo(null);
                this._updateScrHelp(true);

            } else {
                const oldIndex      = this._selectedIndex;
                this._selectedIndex = newIndex;
                (dataList[oldIndex])    && (this._listCo.updateSingleData(oldIndex, dataList[oldIndex]));
                (oldIndex !== newIndex) && (this._listCo.updateSingleData(newIndex, dataList[newIndex]));

                const data = dataList[newIndex];
                this._updateScrCoInfo(data);
                this._updateScrHelp(!data.player);
            }
        }
        public getSelectedIndex(): number {
            return this._selectedIndex;
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Callbacks.
        ////////////////////////////////////////////////////////////////////////////////
        private _onNotifyMcwPlannerStateChanged(e: egret.Event): void {
            const war = this._war;
            if (war.getPlayerInTurn() === war.getPlayerLoggedIn()) {
                this.close();
            } else {
                this.setSelectedIndex(this._selectedIndex);
            }
        }

        private _onTouchTapBtnBack(e: egret.TouchEvent): void {
            McwCoListPanel.hide();
            McwWarMenuPanel.show();
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Private functions.
        ////////////////////////////////////////////////////////////////////////////////
        private _createDataForListCo(): DataForCoRenderer[] {
            const data          : DataForCoRenderer[] = [];
            const war           = this._war;
            const playerManager = war.getPlayerManager();
            const configVersion = war.getConfigVersion();

            for (let i = 1; i <= playerManager.getTotalPlayersCount(false); ++i) {
                const player = playerManager.getPlayer(i);
                data.push({
                    configVersion,
                    player,
                    index   : i - 1,
                    panel   : this,
                });
            }
            data.push({
                configVersion   : null,
                player          : null,
                index           : data.length,
                panel           : this,
            });

            return data;
        }

        private _updateScrCoInfo(data: DataForCoRenderer): void {
            if ((!data) || (!data.player)) {
                this._scrCoInfo.visible = false;
            } else {
                this._scrCoInfo.visible = true;

                const player    = data.player;
                const coId      = player.getCoId();
                const cfg       = coId != null ? ConfigManager.getCoBasicCfg(data.configVersion, coId) : null;
                if (!cfg) {
                    this._imgCoPortrait.source          = "";
                    this._labelName.text                = "--";
                    this._labelDesigner.text            = "--";
                    this._labelForce.text               = "--";
                    this._labelBoardCostPercentage.text = "--";
                    this._labelZoneRadius.text          = "--";
                    this._labelEnergyBar.text           = "--";
                    this._labelNoPassiveSkill.visible   = true;
                    this._labelNoCop.visible            = true;
                    this._labelCopEnergy.text           = "--";
                    this._labelNoScop.visible           = true;
                    this._labelScopEnergy.text          = "--";
                    this._listPassiveSkill.clear();
                    this._listCop.clear();
                    this._listScop.clear();

                } else {
                    this._imgCoPortrait.source          = cfg.fullPortrait;
                    this._labelName.text                = cfg.name;
                    this._labelDesigner.text            = cfg.designer;
                    this._labelForce.text               = Lang.getPlayerForceName(player.getPlayerIndex());
                    this._labelBoardCostPercentage.text = `${cfg.boardCostPercentage}%`;
                    this._labelZoneRadius.text          = `${player.getCoZoneBaseRadius()}`;
                    this._labelEnergyBar.text           = (player.getCoZoneExpansionEnergyList() || []).join(` / `) || `--`;

                    const passiveSkills = cfg.passiveSkills || [];
                    if (!passiveSkills.length) {
                        this._labelNoPassiveSkill.visible = true;
                        this._listPassiveSkill.clear();
                    } else {
                        this._labelNoPassiveSkill.visible = false;
                        const data: DataForSkillRenderer[] = [];
                        for (let i = 0; i < passiveSkills.length; ++i) {
                            data.push({
                                index   : i + 1,
                                skillId : passiveSkills[i],
                            });
                        }
                        this._listPassiveSkill.bindData(data);
                    }

                    const copSkills = player.getCoSkills(Types.CoSkillType.Power) || [];
                    if (!copSkills.length) {
                        this._labelNoCop.visible    = true;
                        this._labelCopEnergy.text   = "--";
                        this._listCop.clear();
                    } else {
                        this._labelNoCop.visible    = false;
                        this._labelCopEnergy.text   = `${player.getCoPowerEnergy()}`;

                        const data: DataForSkillRenderer[] = [];
                        for (let i = 0; i < copSkills.length; ++i) {
                            data.push({
                                index   : i + 1,
                                skillId : copSkills[i],
                            });
                        }
                        this._listCop.bindData(data);
                    }

                    const scopSkills = player.getCoSkills(Types.CoSkillType.SuperPower) || [];
                    if (!scopSkills.length) {
                        this._labelNoScop.visible   = true;
                        this._labelScopEnergy.text  = "--";
                        this._listScop.clear();
                    } else {
                        this._labelNoScop.visible   = false;
                        this._labelScopEnergy.text  = `${player.getCoSuperPowerEnergy()}`;

                        const data: DataForSkillRenderer[] = [];
                        for (let i = 0; i < scopSkills.length; ++i) {
                            data.push({
                                index   : i + 1,
                                skillId : scopSkills[i],
                            });
                        }
                        this._listScop.bindData(data);
                    }
                }
            }
        }

        private _updateScrHelp(visible: boolean): void {
            if (!visible) {
                this._scrHelp.visible = false;
            } else {
                this._scrHelp.visible = true;
                this._labelHelp.setRichText(Lang.getRichText(Lang.RichType.R0004));
            }
        }
    }

    type DataForCoRenderer = {
        configVersion   : number;
        player          : McwPlayer;
        index           : number;
        panel           : McwCoListPanel;
    }

    class CoNameRenderer extends eui.ItemRenderer {
        private _btnChoose: GameUi.UiButton;
        private _labelName: GameUi.UiLabel;

        protected childrenCreated(): void {
            super.childrenCreated();

            this._btnChoose.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onTouchTapBtnChoose, this);
        }

        protected dataChanged(): void {
            super.dataChanged();

            const data          = this.data as DataForCoRenderer;
            const player        = data.player;
            this.currentState   = data.index === data.panel.getSelectedIndex() ? Types.UiState.Down : Types.UiState.Up;

            if (!player) {
                this._labelName.text    = Lang.getText(Lang.Type.B0143);
            } else {
                const coId              = player.getCoId();
                const cfg               = coId != null ? ConfigManager.getCoBasicCfg(data.configVersion, coId) : null;
                this._labelName.text    = cfg ? cfg.name : `(${Lang.getText(Lang.Type.B0001)}CO)`;
            }
        }

        private _onTouchTapBtnChoose(e: egret.TouchEvent): void {
            const data = this.data as DataForCoRenderer;
            data.panel.setSelectedIndex(data.index);
        }
    }

    type DataForSkillRenderer = {
        index   : number;
        skillId : number;
    }

    class PassiveSkillRenderer extends eui.ItemRenderer {
        private _labelIndex : GameUi.UiLabel;
        private _labelDesc  : GameUi.UiLabel;

        protected dataChanged(): void {
            super.dataChanged();

            const data              = this.data as DataForSkillRenderer;
            this._labelIndex.text   = `${data.index}.`;
            this._labelDesc.text    = ConfigManager.getCoSkillCfg(ConfigManager.getNewestConfigVersion(), data.skillId).passiveDesc;
        }
    }

    class ActiveSkillRenderer extends eui.ItemRenderer {
        private _labelIndex : GameUi.UiLabel;
        private _labelDesc  : GameUi.UiLabel;

        protected dataChanged(): void {
            super.dataChanged();

            const data              = this.data as DataForSkillRenderer;
            this._labelIndex.text   = `${data.index}.`;
            this._labelDesc.text    = ConfigManager.getCoSkillCfg(ConfigManager.getNewestConfigVersion(), data.skillId).activeDesc;
        }
    }
}
