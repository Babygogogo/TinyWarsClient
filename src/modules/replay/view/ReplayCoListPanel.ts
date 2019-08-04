
namespace TinyWars.Replay {
    import Types    = Utility.Types;
    import Lang     = Utility.Lang;
    import Notify   = Utility.Notify;

    export class ReplayCoListPanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Hud0;
        protected readonly _IS_EXCLUSIVE = false;

        private static _instance: ReplayCoListPanel;

        private _openData   : number;

        private _listCo     : GameUi.UiScrollList;
        private _btnBack    : GameUi.UiButton;

        private _labelName                  : GameUi.UiLabel;
        private _labelForce                 : GameUi.UiLabel;
        private _labelBoardCostPercentage   : GameUi.UiLabel;
        private _labelZoneRadius            : GameUi.UiLabel;
        private _labelEnergyBar             : GameUi.UiLabel;

        private _listPassiveSkill   : GameUi.UiScrollList;
        private _labelNoPassiveSkill: GameUi.UiLabel;

        private _listActiveSkill    : GameUi.UiScrollList;
        private _labelNoActiveSkill : GameUi.UiLabel;

        private _war                : ReplayWar;
        private _dataForListCo      : DataForCoRenderer[] = [];
        private _selectedIndex      : number;

        public static show(selectedIndex: number): void {
            if (!ReplayCoListPanel._instance) {
                ReplayCoListPanel._instance = new ReplayCoListPanel();
            }

            ReplayCoListPanel._instance._openData = selectedIndex;
            ReplayCoListPanel._instance.open();
        }
        public static hide(): void {
            if (ReplayCoListPanel._instance) {
                ReplayCoListPanel._instance.close();
            }
        }
        public static getIsOpening(): boolean {
            const instance = ReplayCoListPanel._instance;
            return instance ? instance.getIsOpening() : false;
        }

        public constructor() {
            super();

            this._setAutoAdjustHeightEnabled();
            this.skinName = "resource/skins/replay/ReplayCoListPanel.exml";
        }

        protected _onFirstOpened(): void {
            this._notifyListeners = [
                { type: Notify.Type.BwActionPlannerStateChanged,   callback: this._onNotifyBwPlannerStateChanged },
            ];
            this._uiListeners = [
                { ui: this._btnBack,   callback: this._onTouchTapBtnBack },
            ];
            this._listCo.setItemRenderer(CoNameRenderer);
            this._listPassiveSkill.setItemRenderer(PassiveSkillRenderer);
            this._listActiveSkill.setItemRenderer(ActiveSkillRenderer);
        }
        protected _onOpened(): void {
            this._war           = ReplayModel.getWar();
            this._dataForListCo = this._createDataForListCo();
            this._listCo.bindData(this._dataForListCo);
            this.setSelectedIndex(this._openData);

            Notify.dispatch(Notify.Type.BwCoListPanelOpened);
        }
        protected _onClosed(): void {
            delete this._war;
            this._listCo.clear();
            this._listPassiveSkill.clear();
            this._listActiveSkill.clear();

            Notify.dispatch(Notify.Type.BwCoListPanelClosed);
        }

        public setSelectedIndex(newIndex: number): void {
            const dataList = this._dataForListCo;
            if (dataList.length <= 0) {
                this._selectedIndex = undefined;
                this._showCoInfo(null);

            } else if (dataList[newIndex]) {
                const oldIndex      = this._selectedIndex;
                this._selectedIndex = newIndex;
                (dataList[oldIndex])    && (this._listCo.updateSingleData(oldIndex, dataList[oldIndex]));
                (oldIndex !== newIndex) && (this._listCo.updateSingleData(newIndex, dataList[newIndex]));

                this._showCoInfo(dataList[newIndex]);
            }
        }
        public getSelectedIndex(): number {
            return this._selectedIndex;
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Callbacks.
        ////////////////////////////////////////////////////////////////////////////////
        private _onNotifyBwPlannerStateChanged(e: egret.Event): void {
            this.close();
        }

        private _onTouchTapBtnBack(e: egret.TouchEvent): void {
            ReplayCoListPanel.hide();
            ReplayWarMenuPanel.show();
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
            return data;
        }

        private _showCoInfo(data: DataForCoRenderer): void {
            const player    = data.player;
            const coId      = player.getCoId();
            const cfg       = coId != null ? ConfigManager.getCoBasicCfg(data.configVersion, coId) : null;
            if (!cfg) {
                this._labelName.text                = "--";
                this._labelForce.text               = "--";
                this._labelBoardCostPercentage.text = "--";
                this._labelZoneRadius.text          = "--";
                this._labelEnergyBar.text           = "--";
                this._labelNoPassiveSkill.visible   = true;
                this._labelNoActiveSkill.visible    = true;
                this._listPassiveSkill.clear();
                this._listActiveSkill.clear();

            } else {
                const isUsingSkill                  = player.getCoIsUsingSkill();
                this._labelName.text                = cfg.name;
                this._labelForce.text               = Lang.getPlayerForceName(player.getPlayerIndex());
                this._labelBoardCostPercentage.text = `${cfg.boardCostPercentage}%`;
                this._labelZoneRadius.text          = `${isUsingSkill ? Lang.getText(Lang.Type.B0141) : player.getCoZoneRadius()}`;
                this._labelEnergyBar.text           = `${isUsingSkill ? `POWER` : player.getCoCurrentEnergy()} / ${cfg.middleEnergy != null ? cfg.middleEnergy : "--"} / ${cfg.maxEnergy != null ? cfg.maxEnergy : "--"}`;

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

                const activeSkills = cfg.activeSkills || [];
                if (!activeSkills.length) {
                    this._labelNoActiveSkill.visible = true;
                    this._listActiveSkill.clear();
                } else {
                    this._labelNoActiveSkill.visible = false;
                    const data: DataForSkillRenderer[] = [];
                    for (let i = 0; i < activeSkills.length; ++i) {
                        data.push({
                            index   : i + 1,
                            skillId : activeSkills[i],
                        });
                    }
                    this._listActiveSkill.bindData(data);
                }
            }
        }
    }

    type DataForCoRenderer = {
        configVersion   : number;
        player          : BaseWar.BwPlayer;
        index           : number;
        panel           : ReplayCoListPanel;
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

            const data              = this.data as DataForCoRenderer;
            const coId              = data.player.getCoId();
            const cfg               = coId != null ? ConfigManager.getCoBasicCfg(data.configVersion, coId) : null;
            this.currentState       = data.index === data.panel.getSelectedIndex() ? Types.UiState.Down : Types.UiState.Up;
            this._labelName.text    = cfg ? cfg.name : `(${Lang.getText(Lang.Type.B0001)}CO)`;
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
