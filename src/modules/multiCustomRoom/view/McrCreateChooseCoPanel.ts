
namespace TinyWars.MultiCustomRoom {
    import Types            = Utility.Types;
    import Lang             = Utility.Lang;
    import ProtoTypes       = Utility.ProtoTypes;
    import ConfigManager    = Utility.ConfigManager;
    import Helpers          = Utility.Helpers;
    import Notify           = Utility.Notify;
    import CoSkillType      = Types.CoSkillType;

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

        private readonly _labelSkillType                : GameUi.UiLabel;
        private readonly _labelSkillName                : GameUi.UiLabel;
        private readonly _groupEnergyCost               : eui.Group;
        private readonly _labelEnergyCostTitle          : GameUi.UiLabel;
        private readonly _labelEnergyCost               : GameUi.UiLabel;
        private readonly _listSkillDesc                 : GameUi.UiScrollList<DataForSkillDescRenderer, SkillDescRenderer>;

        private readonly _listSkillType                 : GameUi.UiScrollList<DataForSkillTypeRenderer, SkillTypeRenderer>;

        private _dataForListCo          : DataForCoRenderer[] = [];
        private _selectedIndex          : number;
        private _selectedCoSkillType    = CoSkillType.Passive;

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
            this._setNotifyListenerArray([
                { type: Notify.Type.LanguageChanged,    callback: this._onNotifyLanguageChanged },
            ]);
            this._listCo.setItemRenderer(CoRenderer);
            this._listSkillDesc.setItemRenderer(SkillDescRenderer);
            this._listSkillType.setItemRenderer(SkillTypeRenderer);

            this._showOpenAnimation();

            this._updateComponentsForLanguage();
            this._initListCo();
            this._initListSkillType();
        }
        protected async _onClosed(): Promise<void> {
            await this._showCloseAnimation();

            this._listCo.clear();
            this._listSkillDesc.clear();
            this._listSkillType.clear();
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

        public setSelectedSkillType(skillType: CoSkillType): void {
            if (this.getSelectedSkillType() !== skillType) {
                this._selectedCoSkillType = skillType;
                this._updateComponentsForSkill();
            }
        }
        public getSelectedSkillType(): CoSkillType {
            return this._selectedCoSkillType;
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

        private _onNotifyLanguageChanged(e: egret.Event): void {
            this._updateComponentsForLanguage();
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Private functions.
        ////////////////////////////////////////////////////////////////////////////////
        private _updateComponentsForLanguage(): void {
            this._labelDesignerTitle.text               = `${Lang.getText(Lang.Type.B0163)}:`;
            this._labelBoardCostPercentageTitle.text    = `${Lang.getText(Lang.Type.B0164)}:`;
            this._labelZoneRadiusTitle.text             = `${Lang.getText(Lang.Type.B0165)}:`;
            this._labelEnergyBarTitle.text              = `${Lang.getText(Lang.Type.B0166)}:`;
            this._labelEnergyCostTitle.text             = `${Lang.getText(Lang.Type.B0167)}:`;
            this._labelChooseCo.text                    = Lang.getText(Lang.Type.B0145);
            this._btnConfirm.label                      = Lang.getText(Lang.Type.B0026);
            this._btnCancel.label                       = Lang.getText(Lang.Type.B0154);

            this._updateComponentsForCoInfo();
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

        private _initListSkillType(): void {
            this._listSkillType.bindData([
                {
                    coSkillType : CoSkillType.Passive,
                    panel       : this,
                },
                {
                    coSkillType : CoSkillType.Power,
                    panel       : this,
                },
                {
                    coSkillType : CoSkillType.SuperPower,
                    panel       : this,
                },
            ]);
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
            if (coId == null) {
                return;
            }

            const cfg                           = ConfigManager.getCoBasicCfg(ConfigManager.getLatestFormalVersion(), coId);
            this._imgCoPortrait.source          = cfg.fullPortrait;
            this._labelCoName.text              = cfg.name;
            this._labelDesigner.text            = cfg.designer;
            this._labelBoardCostPercentage.text = `${cfg.boardCostPercentage}%`;
            this._labelZoneRadius.text          = `${cfg.zoneRadius}`;
            this._labelEnergyBar.text           = (cfg.zoneExpansionEnergyList || []).join(` / `) || `--`;

            this._updateComponentsForSkill();
        }
        private _updateComponentsForSkill(): void {
            const coId = this._getSelectedCoId();
            if (coId == null) {
                return;
            }
            const skillType = this.getSelectedSkillType();
            if (skillType == null) {
                return;
            }

            this._listSkillType.refresh();

            const configVersion         = ConfigManager.getLatestFormalVersion();
            const skillIdArray          = ConfigManager.getCoSkillArray(configVersion, coId, skillType) || [];
            const hasSkill              = !!skillIdArray.length;
            this._labelSkillType.text   = `${Lang.getCoSkillTypeName(skillType)}:`;
            this._labelSkillName.text   = hasSkill ? undefined : Lang.getText(Lang.Type.B0001);

            const groupEnergyCost = this._groupEnergyCost;
            if (!hasSkill) {
                groupEnergyCost.visible = false;
            } else {
                const labelEnergyCost = this._labelEnergyCost;
                const powerEnergyList = ConfigManager.getCoBasicCfg(configVersion, coId).powerEnergyList || [];
                if (skillType === CoSkillType.Passive) {
                    groupEnergyCost.visible = false;
                } else if (skillType === CoSkillType.Power) {
                    groupEnergyCost.visible = true;
                    labelEnergyCost.text    = `${powerEnergyList[0]}`;
                } else if (skillType === CoSkillType.SuperPower) {
                    groupEnergyCost.visible = true;
                    labelEnergyCost.text    = `${powerEnergyList[1]}`;
                }
            }

            const dataArrayForListSkillDesc: DataForSkillDescRenderer[] = [];
            for (const skillId of skillIdArray) {
                dataArrayForListSkillDesc.push({
                    skillId,
                });
            }
            this._listSkillDesc.bindData(dataArrayForListSkillDesc);
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

    type DataForSkillTypeRenderer = {
        coSkillType : CoSkillType;
        panel       : McrCreateChooseCoPanel;
    }
    class SkillTypeRenderer extends GameUi.UiListItemRenderer<DataForSkillTypeRenderer> {
        private _labelType  : GameUi.UiLabel;

        protected dataChanged(): void {
            const data = this.data;
            if (data) {
                const skillType         = data.coSkillType;
                this.currentState       = data.panel.getSelectedSkillType() === skillType ? Types.UiState.Down : Types.UiState.Up;
                this._labelType.text    = Lang.getCoSkillTypeName(skillType);
            }
        }

        public onItemTapEvent(e: eui.ItemTapEvent): void {
            const data = this.data;
            if (data) {
                data.panel.setSelectedSkillType(data.coSkillType);
            }
        }
    }

    type DataForSkillDescRenderer = {
        skillId : number;
    }
    class SkillDescRenderer extends GameUi.UiListItemRenderer<DataForSkillDescRenderer> {
        private _labelDesc  : GameUi.UiLabel;

        protected dataChanged(): void {
            super.dataChanged();

            const data              = this.data;
            this._labelDesc.text    = `- ${ConfigManager.getCoSkillCfg(ConfigManager.getLatestFormalVersion(), data.skillId).desc[Lang.getCurrentLanguageType()]}`;
        }
    }
}
