
namespace TinyWars.MultiCustomRoom {
    import Types    = Utility.Types;
    import Lang     = Utility.Lang;

    export class McrCreateCoListPanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Hud0;
        protected readonly _IS_EXCLUSIVE = true;

        private static _instance: McrCreateCoListPanel;

        private _openData   : number;

        private _listCo     : GameUi.UiScrollList;
        private _btnBack    : GameUi.UiButton;

        private _labelName                  : GameUi.UiLabel;
        private _labelBoardCostPercentage   : GameUi.UiLabel;
        private _labelZoneRadius            : GameUi.UiLabel;
        private _labelEnergyBar             : GameUi.UiLabel;

        private _listPassiveSkill   : GameUi.UiScrollList;
        private _labelNoPassiveSkill: GameUi.UiLabel;

        private _listActiveSkill    : GameUi.UiScrollList;
        private _labelNoActiveSkill : GameUi.UiLabel;

        private _dataForListCo      : DataForCoRenderer[] = [];
        private _selectedIndex      : number;

        public static show(coId: number | null): void {
            if (!McrCreateCoListPanel._instance) {
                McrCreateCoListPanel._instance = new McrCreateCoListPanel();
            }

            McrCreateCoListPanel._instance._openData = coId;
            McrCreateCoListPanel._instance.open();
        }
        public static hide(): void {
            if (McrCreateCoListPanel._instance) {
                McrCreateCoListPanel._instance.close();
            }
        }

        public constructor() {
            super();

            this._setAutoAdjustHeightEnabled();
            this.skinName = "resource/skins/multiCustomRoom/McrCreateCoListPanel.exml";
        }

        protected _onFirstOpened(): void {
            this._uiListeners = [
                { ui: this._btnBack,   callback: this._onTouchTapBtnBack },
            ];
            this._listCo.setItemRenderer(MapNameRenderer);
            this._listPassiveSkill.setItemRenderer(PassiveSkillRenderer);
            this._listActiveSkill.setItemRenderer(ActiveSkillRenderer);
        }
        protected _onOpened(): void {
            this._dataForListCo = this._createDataForListCo();
            this._listCo.bindData(this._dataForListCo);
            this.setSelectedIndex(this._dataForListCo.findIndex(data => {
                const cfg = data.coBasicCfg;
                return cfg ? cfg.coId === this._openData : this._openData == null;
            }));
        }
        protected _onClosed(): void {
            this._listCo.clear();
            this._listPassiveSkill.clear();
            this._listActiveSkill.clear();
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
        private _onTouchTapBtnBack(e: egret.TouchEvent): void {
            McrCreateCoListPanel.hide();
            McrCreateSettingsPanel.show();
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Private functions.
        ////////////////////////////////////////////////////////////////////////////////
        private _createDataForListCo(): DataForCoRenderer[] {
            const data: DataForCoRenderer[] = [];
            const cfgs = ConfigManager.getNewestCoList(ConfigManager.getNewestConfigVersion());
            for (let i = 0; i < cfgs.length; ++i) {
                const cfg = cfgs[i];
                data.push({
                    coBasicCfg  : cfg,
                    index       : i,
                    panel       : this,
                });
            }
            data.push({
                coBasicCfg  : null,
                index       : cfgs.length,
                panel       : this,
            });
            return data;
        }

        private _showCoInfo(data: DataForCoRenderer): void {
            const cfg = data.coBasicCfg;
            if (!cfg) {
                this._labelName.text                = "--";
                this._labelBoardCostPercentage.text = "--";
                this._labelZoneRadius.text          = "--";
                this._labelEnergyBar.text           = "--";
                this._labelNoPassiveSkill.visible   = true;
                this._labelNoActiveSkill.visible    = true;
                this._listPassiveSkill.clear();
                this._listActiveSkill.clear();
            } else {
                this._labelName.text                = cfg.name;
                this._labelBoardCostPercentage.text = `${cfg.boardCostPercentage}%`;
                this._labelZoneRadius.text          = `${cfg.zoneRadius}`;
                this._labelEnergyBar.text           = `${cfg.middleEnergy != null ? cfg.middleEnergy : "--"} / ${cfg.maxEnergy != null ? cfg.maxEnergy : "--"}`;

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
        coBasicCfg  : Types.CoBasicCfg;
        index       : number;
        panel       : McrCreateCoListPanel;
    }

    class MapNameRenderer extends eui.ItemRenderer {
        private _btnChoose: GameUi.UiButton;
        private _btnNext  : GameUi.UiButton;
        private _labelName: GameUi.UiLabel;

        protected childrenCreated(): void {
            super.childrenCreated();

            this._btnChoose.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onTouchTapBtnChoose, this);
            this._btnNext.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onTouchTapBtnNext, this);
        }

        protected dataChanged(): void {
            super.dataChanged();

            const data              = this.data as DataForCoRenderer;
            const cfg               = data.coBasicCfg;
            this.currentState       = data.index === data.panel.getSelectedIndex() ? Types.UiState.Down : Types.UiState.Up;
            this._labelName.text    = cfg ? cfg.name : `(${Lang.getText(Lang.Type.B0001)}CO)`;
        }

        private _onTouchTapBtnChoose(e: egret.TouchEvent): void {
            const data = this.data as DataForCoRenderer;
            data.panel.setSelectedIndex(data.index);
        }

        private _onTouchTapBtnNext(e: egret.TouchEvent): void {
            McrCreateCoListPanel.hide();

            const cfg = (this.data as DataForCoRenderer).coBasicCfg;
            McrModel.setCreateWarCoId(cfg ? cfg.coId : null);
            McrCreateSettingsPanel.show();
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
