
namespace TinyWars.ReplayWar {
    import Types    = Utility.Types;
    import Lang     = Utility.Lang;
    import Notify   = Utility.Notify;

    export class RwCoListPanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Hud0;
        protected readonly _IS_EXCLUSIVE = false;

        private static _instance: RwCoListPanel;

        private _openData   : number;

        private _listCo     : GameUi.UiScrollList;
        private _btnBack    : GameUi.UiButton;

        private _imgCoPortrait                  : GameUi.UiImage;
        private _labelCommanderInfo             : GameUi.UiLabel;
        private _labelNameTitle                 : GameUi.UiLabel;
        private _labelName                      : GameUi.UiLabel;
        private _labelForceTitle                : GameUi.UiLabel;
        private _labelForce                     : GameUi.UiLabel;
        private _labelDesignerTitle             : GameUi.UiLabel;
        private _labelDesigner                  : GameUi.UiLabel;
        private _labelBoardCostPercentageTitle  : GameUi.UiLabel;
        private _labelBoardCostPercentage       : GameUi.UiLabel;
        private _labelZoneRadiusTitle           : GameUi.UiLabel;
        private _labelZoneRadius                : GameUi.UiLabel;
        private _labelEnergyBarTitle            : GameUi.UiLabel;
        private _labelEnergyBar                 : GameUi.UiLabel;

        private _listPassiveSkill   : GameUi.UiScrollList;
        private _labelNoPassiveSkill: GameUi.UiLabel;

        private _listCop            : GameUi.UiScrollList;
        private _labelNoCop         : GameUi.UiLabel;
        private _labelCopEnergyTitle: GameUi.UiLabel;
        private _labelCopEnergy     : GameUi.UiLabel;

        private _listScop               : GameUi.UiScrollList;
        private _labelNoScop            : GameUi.UiLabel;
        private _labelScopEnergyTitle   : GameUi.UiLabel;
        private _labelScopEnergy        : GameUi.UiLabel;

        private _war                : RwWar;
        private _dataForListCo      : DataForCoRenderer[] = [];
        private _selectedIndex      : number;

        public static show(selectedIndex: number): void {
            if (!RwCoListPanel._instance) {
                RwCoListPanel._instance = new RwCoListPanel();
            }

            RwCoListPanel._instance._openData = selectedIndex;
            RwCoListPanel._instance.open();
        }
        public static hide(): void {
            if (RwCoListPanel._instance) {
                RwCoListPanel._instance.close();
            }
        }
        public static getIsOpening(): boolean {
            const instance = RwCoListPanel._instance;
            return instance ? instance.getIsOpening() : false;
        }

        public constructor() {
            super();

            this._setAutoAdjustHeightEnabled();
            this._setTouchMaskEnabled();
            this._callbackForTouchMask = () => this.close();
            this.skinName = "resource/skins/replayWar/RwCoListPanel.exml";
        }

        protected _onFirstOpened(): void {
            this._notifyListeners = [
                { type: Notify.Type.LanguageChanged,                callback: this._onNotifyLanguageChanged },
                { type: Notify.Type.BwActionPlannerStateChanged,    callback: this._onNotifyBwPlannerStateChanged },
            ];
            this._uiListeners = [
                { ui: this._btnBack,   callback: this._onTouchTapBtnBack },
            ];
            this._listCo.setItemRenderer(CoNameRenderer);
            this._listPassiveSkill.setItemRenderer(SkillRenderer);
            this._listCop.setItemRenderer(SkillRenderer);
            this._listScop.setItemRenderer(SkillRenderer);
        }
        protected _onOpened(): void {
            this._updateComponentsForLanguage();

            this._war           = RwModel.getWar();
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
        private _onNotifyLanguageChanged(e: egret.Event): void {
            this._updateComponentsForLanguage();
        }

        private _onNotifyBwPlannerStateChanged(e: egret.Event): void {
            this.close();
        }

        private _onTouchTapBtnBack(e: egret.TouchEvent): void {
            this.close();
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
            this._labelNameTitle.text                   = `${Lang.getText(Lang.Type.B0162)}: `;
            this._labelForceTitle.text                  = `${Lang.getText(Lang.Type.B0168)}: `;
            this._labelDesignerTitle.text               = `${Lang.getText(Lang.Type.B0163)}: `;
            this._labelBoardCostPercentageTitle.text    = `${Lang.getText(Lang.Type.B0164)}: `;
            this._labelZoneRadiusTitle.text             = `${Lang.getText(Lang.Type.B0165)}: `;
            this._labelEnergyBarTitle.text              = `${Lang.getText(Lang.Type.B0166)}: `;
            this._labelCopEnergyTitle.text              = `${Lang.getText(Lang.Type.B0167)}: `;
            this._labelScopEnergyTitle.text             = `${Lang.getText(Lang.Type.B0167)}: `;

            const player    = data.player;
            const coId      = player.getCoId();
            const cfg       = coId != null ? Utility.ConfigManager.getCoBasicCfg(data.configVersion, coId) : null;
            if (!cfg) {
                this._imgCoPortrait.source          = "";
                this._labelName.text                = "--";
                this._labelDesigner.text            = "--";
                this._labelForce.text               = "--";
                this._labelBoardCostPercentage.text = "--";
                this._labelZoneRadius.text          = "--";
                this._labelEnergyBar.text           = "--";
                this._labelNoPassiveSkill.text      = Lang.getText(Lang.Type.B0001);
                this._labelNoCop.text               = Lang.getText(Lang.Type.B0001);
                this._labelCopEnergy.text           = "--";
                this._labelNoScop.text              = Lang.getText(Lang.Type.B0001);
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
                    this._labelNoPassiveSkill.text = Lang.getText(Lang.Type.B0001);
                    this._listPassiveSkill.clear();
                } else {
                    this._labelNoPassiveSkill.text = "";
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
                    this._labelNoCop.text       = Lang.getText(Lang.Type.B0001);
                    this._labelCopEnergy.text   = "--";
                    this._listCop.clear();
                } else {
                    this._labelNoCop.text       = "";
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
                    this._labelNoScop.text      = Lang.getText(Lang.Type.B0001);
                    this._labelScopEnergy.text  = "--";
                    this._listScop.clear();
                } else {
                    this._labelNoScop.text      = "";
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

        private _updateComponentsForLanguage(): void {
            this._labelCommanderInfo.text   = Lang.getText(Lang.Type.B0240);
            this._btnBack.label             = Lang.getText(Lang.Type.B0146);
        }
    }

    type DataForCoRenderer = {
        configVersion   : string;
        player          : BaseWar.BwPlayer;
        index           : number;
        panel           : RwCoListPanel;
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
            const cfg               = coId != null ? Utility.ConfigManager.getCoBasicCfg(data.configVersion, coId) : null;
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

    class SkillRenderer extends eui.ItemRenderer {
        private _labelIndex : GameUi.UiLabel;
        private _labelDesc  : GameUi.UiLabel;

        protected dataChanged(): void {
            super.dataChanged();

            const data              = this.data as DataForSkillRenderer;
            this._labelIndex.text   = `${data.index}.`;
            this._labelDesc.text    = Utility.ConfigManager.getCoSkillCfg(Utility.ConfigManager.getLatestConfigVersion(), data.skillId).desc[Lang.getLanguageType()];
        }
    }
}
