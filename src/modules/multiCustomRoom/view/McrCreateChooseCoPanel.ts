
namespace TinyWars.MultiCustomRoom {
    import Types            = Utility.Types;
    import Lang             = Utility.Lang;
    import ProtoTypes       = Utility.ProtoTypes;
    import ConfigManager    = Utility.ConfigManager;
    import Helpers          = Utility.Helpers;

    type OpenDataForMcrCreateChooseCoPanel = {
        coId    : number | undefined | null;
    }
    export class McrCreateChooseCoPanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Hud0;
        protected readonly _IS_EXCLUSIVE = false;

        private static _instance: McrCreateChooseCoPanel;

        private readonly _imgMask                       : GameUi.UiImage;
        private readonly _group                         : eui.Group;

        private readonly _labelChooseCo                 : GameUi.UiLabel;
        private readonly _listCo                        : GameUi.UiScrollList<DataForCoRenderer, CoRenderer>;
        private readonly _btnConfirm                    : GameUi.UiButton;
        private readonly _btnCancel                     : GameUi.UiButton;

        private readonly _imgCoPortrait                 : GameUi.UiImage;
        private readonly _labelCoName                   : GameUi.UiLabel;
        private readonly _labelDesignerTitle            : GameUi.UiLabel;
        private readonly _labelDesigner                 : GameUi.UiLabel;
        private readonly _labelBoardCostPercentageTitle : GameUi.UiLabel;
        private readonly _labelBoardCostPercentage      : GameUi.UiLabel;
        private readonly _labelZoneRadiusTitle          : GameUi.UiLabel;
        private readonly _labelZoneRadius               : GameUi.UiLabel;
        private readonly _labelEnergyBarTitle           : GameUi.UiLabel;
        private readonly _labelEnergyBar                : GameUi.UiLabel;

        private readonly _groupPassiveSkill             : eui.Group;
        private readonly _listPassiveSkill              : GameUi.UiScrollList<DataForSkillRenderer, SkillRenderer>;
        private readonly _labelNoPassiveSkill           : GameUi.UiLabel;

        private readonly _groupCop                      : eui.Group;
        private readonly _listCop                       : GameUi.UiScrollList<DataForSkillRenderer, SkillRenderer>;
        private readonly _labelNoCop                    : GameUi.UiLabel;
        private readonly _labelCopEnergyTitle           : GameUi.UiLabel;
        private readonly _labelCopEnergy                : GameUi.UiLabel;

        private readonly _groupScop                     : eui.Group;
        private readonly _listScop                      : GameUi.UiScrollList<DataForSkillRenderer, SkillRenderer>;
        private readonly _labelNoScop                   : GameUi.UiLabel;
        private readonly _labelScopEnergyTitle          : GameUi.UiLabel;
        private readonly _labelScopEnergy               : GameUi.UiLabel;

        private _dataForListCo      : DataForCoRenderer[] = [];
        private _selectedIndex      : number;

        public static show(openData: OpenDataForMcrCreateChooseCoPanel): void {
            if (!McrCreateChooseCoPanel._instance) {
                McrCreateChooseCoPanel._instance = new McrCreateChooseCoPanel();
            }

            McrCreateChooseCoPanel._instance.open(openData);
        }
        public static async hide(): Promise<void> {
            if (McrCreateChooseCoPanel._instance) {
                await McrCreateChooseCoPanel._instance.close();
            }
        }

        public constructor() {
            super();

            this._setIsTouchMaskEnabled();
            this._setIsCloseOnTouchedMask();
            this.skinName = "resource/skins/multiCustomRoom/McrCreateChooseCoPanel.exml";
        }

        protected _onOpened(): void {
            this._setUiListenerArray([
                { ui: this._btnConfirm,     callback: this._onTouchedBtnConfirm },
                { ui: this._btnCancel,      callback: this._onTouchTapBtnBack },
            ]);
            this._listCo.setItemRenderer(CoRenderer);
            this._listPassiveSkill.setItemRenderer(SkillRenderer);
            this._listCop.setItemRenderer(SkillRenderer);
            this._listScop.setItemRenderer(SkillRenderer);

            this._showOpenAnimation();

            this._updateComponentsForLanguage();
            this._initListCo();
        }
        protected async _onClosed(): Promise<void> {
            await this._showCloseAnimation();

            this._listCo.clear();
            this._listPassiveSkill.clear();
            this._listCop.clear();
            this._listScop.clear();
        }

        public setSelectedIndex(newIndex: number): void {
            const dataList = this._dataForListCo;
            if (dataList.length <= 0) {
                this._selectedIndex = undefined;

            } else if (dataList[newIndex]) {
                const oldIndex      = this._selectedIndex;
                this._selectedIndex = newIndex;
                (dataList[oldIndex])    && (this._listCo.updateSingleData(oldIndex, dataList[oldIndex]));
                (oldIndex !== newIndex) && (this._listCo.updateSingleData(newIndex, dataList[newIndex]));
            }

            this._updateComponentsForCoInfo();
        }
        public getSelectedIndex(): number {
            return this._selectedIndex;
        }

        private _getSelectedCoId(): number | null {
            const data = this._dataForListCo[this.getSelectedIndex()];
            return data ? data.coBasicCfg.coId : null;
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Callbacks.
        ////////////////////////////////////////////////////////////////////////////////
        private _onTouchedBtnConfirm(e: egret.TouchEvent): void {
            const coId = this._getSelectedCoId();
            if (coId != null) {
                McrModel.Create.setSelfCoId(coId);
                this.close();
            }
        }

        private _onTouchTapBtnBack(e: egret.TouchEvent): void {
            this.close();
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Private functions.
        ////////////////////////////////////////////////////////////////////////////////
        private _updateComponentsForLanguage(): void {
            this._labelDesignerTitle.text               = `${Lang.getText(Lang.Type.B0163)}:`;
            this._labelBoardCostPercentageTitle.text    = `${Lang.getText(Lang.Type.B0164)}:`;
            this._labelZoneRadiusTitle.text             = `${Lang.getText(Lang.Type.B0165)}:`;
            this._labelEnergyBarTitle.text              = `${Lang.getText(Lang.Type.B0166)}:`;
            this._labelCopEnergyTitle.text              = `${Lang.getText(Lang.Type.B0167)}:`;
            this._labelScopEnergyTitle.text             = `${Lang.getText(Lang.Type.B0167)}:`;
            this._labelChooseCo.text                    = Lang.getText(Lang.Type.B0145);
            this._btnConfirm.label                      = Lang.getText(Lang.Type.B0026);
            this._btnCancel.label                       = Lang.getText(Lang.Type.B0154);
        }

        private _initListCo(): void {
            this._dataForListCo = this._createDataForListCo();
            this._listCo.bindData(this._dataForListCo);
            this._listCo.scrollVerticalTo(0);

            const coId = this._getOpenData<OpenDataForMcrCreateChooseCoPanel>().coId;
            this.setSelectedIndex(this._dataForListCo.findIndex(data => {
                const cfg = data.coBasicCfg;
                return cfg ? cfg.coId === coId : coId == null;
            }));
        }

        private _createDataForListCo(): DataForCoRenderer[] {
            const data              : DataForCoRenderer[] = [];
            const availableCoIdList = McrModel.Create.getAvailableCoIdList(McrModel.Create.getSelfPlayerIndex());

            let index = 0;
            for (const cfg of ConfigManager.getAvailableCoArray(ConfigManager.getLatestFormalVersion())) {
                if (availableCoIdList.indexOf(cfg.coId) >= 0) {
                    data.push({
                        coBasicCfg  : cfg,
                        index,
                        panel       : this,
                    });
                    ++index;
                }
            }
            return data;
        }

        private _updateComponentsForCoInfo(): void {
            const coId = this._getSelectedCoId();
            const cfg  = coId != null ? ConfigManager.getCoBasicCfg(ConfigManager.getLatestFormalVersion(), coId) : null;
            if (!cfg) {
                this._imgCoPortrait.source          = "";
                this._labelCoName.text              = "--";
                this._labelDesigner.text            = "--";
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
                this._labelCoName.text              = cfg.name;
                this._labelDesigner.text            = cfg.designer;
                this._labelBoardCostPercentage.text = `${cfg.boardCostPercentage}%`;
                this._labelZoneRadius.text          = `${cfg.zoneRadius}`;
                this._labelEnergyBar.text           = (cfg.zoneExpansionEnergyList || []).join(` / `) || `--`;

                this._updateGroupPassiveSkill();
                this._updateGroupCop();
                this._updateGroupScop();
            }
        }
        private _updateGroupPassiveSkill(): void {
            const coId = this._getSelectedCoId();
            if (coId == null) {
                return;
            }

            const cfg           = ConfigManager.getCoBasicCfg(ConfigManager.getLatestFormalVersion(), coId);
            const passiveSkills = cfg.passiveSkills || [];
            const list          = this._listPassiveSkill;

            if (!passiveSkills.length) {
                this._labelNoPassiveSkill.text = Lang.getText(Lang.Type.B0001);

                list.clear();
                if (list.parent) {
                    list.parent.removeChild(list);
                }

            } else {
                this._labelNoPassiveSkill.text = "";

                const data: DataForSkillRenderer[] = [];
                for (let i = 0; i < passiveSkills.length; ++i) {
                    data.push({
                        skillId : passiveSkills[i],
                    });
                }
                list.bindData(data);
                if (!list.parent) {
                    this._groupPassiveSkill.addChild(list);
                }
            }
        }
        private _updateGroupCop(): void {
            const coId = this._getSelectedCoId();
            if (coId == null) {
                return;
            }

            const cfg       = ConfigManager.getCoBasicCfg(ConfigManager.getLatestFormalVersion(), coId);
            const copSkills = cfg.powerSkills || [];
            const list      = this._listCop;

            if (!copSkills.length) {
                this._labelNoCop.text       = Lang.getText(Lang.Type.B0001);
                this._labelCopEnergy.text   = "--";

                list.clear();
                if (list.parent) {
                    list.parent.removeChild(list);
                }
            } else {
                this._labelNoCop.text       = "";
                this._labelCopEnergy.text   = `${cfg.powerEnergyList[0]}`;

                const data: DataForSkillRenderer[] = [];
                for (let i = 0; i < copSkills.length; ++i) {
                    data.push({
                        skillId : copSkills[i],
                    });
                }
                list.bindData(data);
                if (!list.parent) {
                    this._groupCop.addChild(list);
                }
            }
        }
        private _updateGroupScop(): void {
            const coId = this._getSelectedCoId();
            if (coId == null) {
                return;
            }

            const cfg           = ConfigManager.getCoBasicCfg(ConfigManager.getLatestFormalVersion(), coId);
            const scopSkills    = cfg.superPowerSkills || [];
            const list          = this._listScop;

            if (!scopSkills.length) {
                this._labelNoScop.text      = Lang.getText(Lang.Type.B0001);
                this._labelScopEnergy.text  = "--";

                list.clear();
                if (list.parent) {
                    list.parent.removeChild(list);
                }
            } else {
                this._labelNoScop.text      = "";
                this._labelScopEnergy.text  = `${cfg.powerEnergyList[1]}`;

                const data: DataForSkillRenderer[] = [];
                for (let i = 0; i < scopSkills.length; ++i) {
                    data.push({
                        skillId : scopSkills[i],
                    });
                }
                list.bindData(data);
                if (!list.parent) {
                    this._groupScop.addChild(list);
                }
            }
        }

        private _showOpenAnimation(): void {
            Helpers.resetTween({
                obj         : this._imgMask,
                beginProps  : { alpha: 0 },
                endProps    : { alpha: 1 },
                tweenTime   : 200,
                waitTime    : 0,
            });
            Helpers.resetTween({
                obj         : this._group,
                beginProps  : { alpha: 0, verticalCenter: -40 },
                endProps    : { alpha: 1, verticalCenter: 0 },
                tweenTime   : 200,
                waitTime    : 0,
            });
        }
        private _showCloseAnimation(): Promise<void> {
            return new Promise<void>(resolve => {
                Helpers.resetTween({
                    obj         : this._imgMask,
                    beginProps  : { alpha: 1 },
                    endProps    : { alpha: 0 },
                    tweenTime   : 200,
                    waitTime    : 0,
                });

                Helpers.resetTween({
                    obj         : this._group,
                    beginProps  : { alpha: 1, verticalCenter: 0 },
                    endProps    : { alpha: 0, verticalCenter: -40 },
                    tweenTime   : 200,
                    waitTime    : 0,
                    callback    : resolve,
                });
            });
        }
    }

    type DataForCoRenderer = {
        coBasicCfg  : ProtoTypes.Config.ICoBasicCfg;
        index       : number;
        panel       : McrCreateChooseCoPanel;
    }

    class CoRenderer extends GameUi.UiListItemRenderer<DataForCoRenderer> {
        private _labelName: GameUi.UiLabel;

        protected dataChanged(): void {
            super.dataChanged();

            const data              = this.data;
            this.currentState       = data.index === data.panel.getSelectedIndex() ? Types.UiState.Down : Types.UiState.Up;
            this._labelName.text    = data.coBasicCfg.name;
        }

        public onItemTapEvent(e: eui.ItemTapEvent): void {
            const data = this.data;
            data.panel.setSelectedIndex(data.index);
        }
    }

    type DataForSkillRenderer = {
        skillId : number;
    }
    class SkillRenderer extends GameUi.UiListItemRenderer<DataForSkillRenderer> {
        private _labelDesc  : GameUi.UiLabel;

        protected dataChanged(): void {
            super.dataChanged();

            const data              = this.data;
            this._labelDesc.text    = `- ${ConfigManager.getCoSkillCfg(ConfigManager.getLatestFormalVersion(), data.skillId).desc[Lang.getCurrentLanguageType()]}`;
        }
    }
}
