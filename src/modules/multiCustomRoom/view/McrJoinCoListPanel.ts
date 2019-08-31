
namespace TinyWars.MultiCustomRoom {
    import Types        = Utility.Types;
    import Lang         = Utility.Lang;
    import HelpPanel    = Common.HelpPanel;

    export class McrJoinCoListPanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Hud0;
        protected readonly _IS_EXCLUSIVE = true;

        private static _instance: McrJoinCoListPanel;

        private _openData   : number;

        private _labelChooseCo  : GameUi.UiLabel;
        private _btnHelp        : GameUi.UiButton;
        private _listCo         : GameUi.UiScrollList;
        private _btnBack        : GameUi.UiButton;

        private _imgCoPortrait              : GameUi.UiImage;
        private _labelName                  : GameUi.UiLabel;
        private _labelDesigner              : GameUi.UiLabel;
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

        private _dataForListCo      : DataForCoRenderer[] = [];
        private _selectedIndex      : number;

        public static show(coId: number | null): void {
            if (!McrJoinCoListPanel._instance) {
                McrJoinCoListPanel._instance = new McrJoinCoListPanel();
            }

            McrJoinCoListPanel._instance._openData = coId;
            McrJoinCoListPanel._instance.open();
        }
        public static hide(): void {
            if (McrJoinCoListPanel._instance) {
                McrJoinCoListPanel._instance.close();
            }
        }

        public constructor() {
            super();

            this._setAutoAdjustHeightEnabled();
            this.skinName = "resource/skins/multiCustomRoom/McrJoinCoListPanel.exml";
        }

        protected _onFirstOpened(): void {
            this._uiListeners = [
                { ui: this._btnHelp,    callback: this._onTouchedBtnHelp },
                { ui: this._btnBack,    callback: this._onTouchTapBtnBack },
            ];
            this._listCo.setItemRenderer(MapNameRenderer);
            this._listPassiveSkill.setItemRenderer(PassiveSkillRenderer);
            this._listCop.setItemRenderer(ActiveSkillRenderer);
            this._listScop.setItemRenderer(ActiveSkillRenderer);
        }
        protected _onOpened(): void {
            this._initListCo();
            this._updateView();
        }
        protected _onClosed(): void {
            this._listCo.clear();
            this._listPassiveSkill.clear();
            this._listCop.clear();
            this._listScop.clear();
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
        private _onTouchedBtnHelp(e: egret.TouchEvent): void {
            HelpPanel.show({
                title   : Lang.getText(Lang.Type.B0147),
                content : Lang.getRichText(Lang.RichType.R0004),
            });
        }

        private _onTouchTapBtnBack(e: egret.TouchEvent): void {
            McrJoinCoListPanel.hide();
            McrJoinSettingsPanel.show();
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Private functions.
        ////////////////////////////////////////////////////////////////////////////////
        private _updateView(): void {
            this._labelChooseCo.text    = Lang.getText(Lang.Type.B0145);
            this._btnHelp.label         = Lang.getText(Lang.Type.B0143);
            this._btnBack.label         = Lang.getText(Lang.Type.B0146);
        }

        private _initListCo(): void {
            this._dataForListCo = this._createDataForListCo();
            this._listCo.bindData(this._dataForListCo);
            this._listCo.scrollVerticalTo(0);
            this.setSelectedIndex(this._dataForListCo.findIndex(data => {
                const cfg = data.coBasicCfg;
                return cfg ? cfg.coId === this._openData : this._openData == null;
            }));
        }

        private _createDataForListCo(): DataForCoRenderer[] {
            const data              : DataForCoRenderer[] = [];
            const bannedCoIdList    = McrModel.getJoinWarRoomInfo().bannedCoIdList || [];

            let index = 0;
            for (const cfg of ConfigManager.getNewestCoList(ConfigManager.getNewestConfigVersion())) {
                if (bannedCoIdList.indexOf(cfg.coId) < 0) {
                    data.push({
                        coBasicCfg  : cfg,
                        index,
                        panel       : this,
                    });
                    ++index;
                }
            }
            data.push({
                coBasicCfg  : null,
                index,
                panel       : this,
            });
            return data;
        }

        private _showCoInfo(data: DataForCoRenderer): void {
            const cfg = data.coBasicCfg;
            if (!cfg) {
                this._imgCoPortrait.source          = "";
                this._labelName.text                = "--";
                this._labelDesigner.text            = "--";
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
                this._labelBoardCostPercentage.text = `${cfg.boardCostPercentage}%`;
                this._labelZoneRadius.text          = `${cfg.zoneRadius}`;
                this._labelEnergyBar.text           = (cfg.zoneExpansionEnergyList || []).join(` / `) || `--`;

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

                const copSkills = cfg.powerSkills || [];
                if (!copSkills.length) {
                    this._labelNoCop.visible    = true;
                    this._labelCopEnergy.text   = "--";
                    this._listCop.clear();
                } else {
                    this._labelNoCop.visible    = false;
                    this._labelCopEnergy.text   = `${cfg.powerEnergyList[0]}`;

                    const data: DataForSkillRenderer[] = [];
                    for (let i = 0; i < copSkills.length; ++i) {
                        data.push({
                            index   : i + 1,
                            skillId : copSkills[i],
                        });
                    }
                    this._listCop.bindData(data);
                }

                const scopSkills = cfg.superPowerSkills || [];
                if (!scopSkills.length) {
                    this._labelNoScop.visible   = true;
                    this._labelScopEnergy.text  = "--";
                    this._listScop.clear();
                } else {
                    this._labelNoScop.visible   = false;
                    this._labelScopEnergy.text  = `${cfg.powerEnergyList[1]}`;

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

    type DataForCoRenderer = {
        coBasicCfg  : Types.CoBasicCfg;
        index       : number;
        panel       : McrJoinCoListPanel;
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
            McrJoinCoListPanel.hide();

            const cfg = (this.data as DataForCoRenderer).coBasicCfg;
            McrModel.setJoinWarCoId(cfg ? cfg.coId : null);
            McrJoinSettingsPanel.show();
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
