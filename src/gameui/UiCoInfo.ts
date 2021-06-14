
namespace TinyWars.GameUi {
    import Lang             = Utility.Lang;
    import Types            = Utility.Types;
    import Notify           = Utility.Notify;
    import ConfigManager    = Utility.ConfigManager;
    import CommonConstants  = Utility.CommonConstants;
    import CoSkillType      = Types.CoSkillType;

    type CoData = {
        configVersion   : string;
        coId            : number;
    }

    export class UiCoInfo extends UiComponent {
        private readonly _labelCoName                   : GameUi.UiLabel;
        private readonly _labelDesignerTitle            : GameUi.UiLabel;
        private readonly _labelDesigner                 : GameUi.UiLabel;
        private readonly _imgCoPortrait                 : GameUi.UiImage;
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
        private readonly _listSkillDesc                 : GameUi.UiScrollList<DataForSkillDescRenderer>;

        private readonly _listSkillType                 : GameUi.UiScrollList<DataForSkillTypeRenderer>;

        private _coData                 : CoData;
        private _selectedCoSkillType    = CoSkillType.Passive;

        protected _onOpened(): void {
            this._setNotifyListenerArray([
                { type: Notify.Type.LanguageChanged,    callback: this._onNotifyLanguageChanged },
            ]);
            this._listSkillDesc.setItemRenderer(SkillDescRenderer);
            this._listSkillType.setItemRenderer(SkillTypeRenderer);

            this._initListSkillType();
            this._updateComponentsForLanguage();
            this._updateComponentsForCoInfo();
        }

        private _onNotifyLanguageChanged(e: egret.Event): void {
            this._updateComponentsForLanguage();
            this._updateComponentsForCoInfo();
        }

        public setCoData(newData: CoData): void {
            const currentData = this.getCoData();
            if ((currentData == null)                               ||
                (currentData.coId !== newData.coId)                 ||
                (currentData.configVersion !== newData.configVersion)
            ) {
                this._coData = newData;
                this._updateComponentsForCoInfo();
            }
        }
        public getCoData(): CoData {
            return this._coData;
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

        private _initListSkillType(): void {
            this._listSkillType.bindData([
                {
                    coSkillType : CoSkillType.Passive,
                    component   : this,
                },
                {
                    coSkillType : CoSkillType.Power,
                    component   : this,
                },
                {
                    coSkillType : CoSkillType.SuperPower,
                    component   : this,
                },
            ]);
        }

        private _updateComponentsForLanguage(): void {
            if (!this.getIsOpening()) {
                return;
            }

            this._labelDesignerTitle.text               = `${Lang.getText(Lang.Type.B0163)}:`;
            this._labelBoardCostPercentageTitle.text    = `${Lang.getText(Lang.Type.B0164)}:`;
            this._labelZoneRadiusTitle.text             = `${Lang.getText(Lang.Type.B0165)}:`;
            this._labelEnergyBarTitle.text              = `${Lang.getText(Lang.Type.B0166)}:`;
            this._labelEnergyCostTitle.text             = `${Lang.getText(Lang.Type.B0167)}:`;
        }

        private _updateComponentsForCoInfo(): void {
            if (!this.getIsOpening()) {
                return;
            }

            const coData = this._coData;
            if (coData == null) {
                return;
            }

            const coId                          = coData.coId;
            const cfg                           = ConfigManager.getCoBasicCfg(coData.configVersion, coId);
            this._imgCoPortrait.source          = ConfigManager.getCoBustImageSource(coId);
            this._labelCoName.text              = cfg.name;
            this._labelDesigner.text            = cfg.designer;
            this._labelBoardCostPercentage.text = `${cfg.boardCostPercentage}%`;
            this._labelZoneRadius.text          = `${cfg.zoneRadius}`;
            this._labelEnergyBar.text           = (cfg.zoneExpansionEnergyList || []).join(` / `) || `--`;

            this._updateComponentsForSkill();
        }

        private _updateComponentsForSkill(): void {
            if (!this.getIsOpening()) {
                return;
            }

            const coData = this.getCoData();
            if (coData == null) {
                return;
            }
            const skillType = this.getSelectedSkillType();
            if (skillType == null) {
                return;
            }

            this._listSkillType.refresh();

            const { coId, configVersion }   = coData;
            const skillIdArray              = ConfigManager.getCoSkillArray(configVersion, coId, skillType) || [];
            const hasSkill                  = !!skillIdArray.length;
            this._labelSkillType.text       = `${Lang.getCoSkillTypeName(skillType)}:`;
            this._labelSkillName.text       = hasSkill ? undefined : Lang.getText(Lang.Type.B0001);

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
                    configVersion,
                    skillId,
                });
            }
            this._listSkillDesc.bindData(dataArrayForListSkillDesc);
        }
    }

    type DataForSkillTypeRenderer = {
        coSkillType : CoSkillType;
        component   : UiCoInfo;
    }
    class SkillTypeRenderer extends GameUi.UiListItemRenderer<DataForSkillTypeRenderer> {
        private _labelType  : GameUi.UiLabel;

        protected _onDataChanged(): void {
            const data = this.data;
            if (data) {
                const skillType         = data.coSkillType;
                this.currentState       = data.component.getSelectedSkillType() === skillType ? Types.UiState.Down : Types.UiState.Up;
                this._labelType.text    = Lang.getCoSkillTypeName(skillType);
            }
        }

        public onItemTapEvent(e: eui.ItemTapEvent): void {
            const data = this.data;
            if (data) {
                data.component.setSelectedSkillType(data.coSkillType);
            }
        }
    }

    type DataForSkillDescRenderer = {
        skillId         : number;
        configVersion   : string;
    }
    class SkillDescRenderer extends GameUi.UiListItemRenderer<DataForSkillDescRenderer> {
        private _labelDesc  : GameUi.UiLabel;

        protected _onDataChanged(): void {
            const data              = this.data;
            this._labelDesc.text    = `- ${ConfigManager.getCoSkillCfg(data.configVersion, data.skillId).desc[Lang.getCurrentLanguageType()]}`;
        }
    }
}
