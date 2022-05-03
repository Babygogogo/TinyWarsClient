
// import CommonConstants          from "../helpers/CommonConstants";
// import ConfigManager            from "../helpers/ConfigManager";
// import Helpers                  from "../helpers/Helpers";
// import Types                    from "../helpers/Types";
// import Lang                     from "../lang/Lang";
// import TwnsLangTextType         from "../lang/LangTextType";
// import Twns.Notify           from "../notify/NotifyType";
// import TwnsUiComponent          from "./UiComponent";
// import TwnsUiImage              from "./UiImage";
// import TwnsUiLabel              from "./UiLabel";
// import TwnsUiListItemRenderer   from "./UiListItemRenderer";
// import TwnsUiScrollList         from "./UiScrollList";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace TwnsUiCoInfo {
    import ClientErrorCode  = TwnsClientErrorCode.ClientErrorCode;
    import CoSkillType      = Types.CoSkillType;
    import NotifyType       = Twns.Notify.NotifyType;
    import LangTextType     = TwnsLangTextType.LangTextType;

    type CoData = {
        gameConfig      : Twns.Config.GameConfig;
        coId            : number;
    };
    export class UiCoInfo extends TwnsUiComponent.UiComponent {
        private readonly _labelCoName!                      : TwnsUiLabel.UiLabel;
        private readonly _groupInfo!                        : eui.Group;
        private readonly _groupZoneInfo!                    : eui.Group;
        private readonly _labelArtDesignerTitle!            : TwnsUiLabel.UiLabel;
        private readonly _labelArtDesigner!                 : TwnsUiLabel.UiLabel;
        private readonly _labelDataDesignerTitle!           : TwnsUiLabel.UiLabel;
        private readonly _labelDataDesigner!                : TwnsUiLabel.UiLabel;
        private readonly _imgCoPortrait!                    : TwnsUiImage.UiImage;
        private readonly _labelBoardCostPercentageTitle!    : TwnsUiLabel.UiLabel;
        private readonly _labelBoardCostPercentage!         : TwnsUiLabel.UiLabel;
        private readonly _labelZoneRadiusTitle!             : TwnsUiLabel.UiLabel;
        private readonly _labelZoneRadius!                  : TwnsUiLabel.UiLabel;
        private readonly _labelEnergyBarTitle!              : TwnsUiLabel.UiLabel;
        private readonly _labelEnergyBar!                   : TwnsUiLabel.UiLabel;

        private readonly _labelSkillType!                   : TwnsUiLabel.UiLabel;
        private readonly _labelSkillName!                   : TwnsUiLabel.UiLabel;
        private readonly _groupEnergyCost!                  : eui.Group;
        private readonly _labelEnergyCostTitle!             : TwnsUiLabel.UiLabel;
        private readonly _labelEnergyCost!                  : TwnsUiLabel.UiLabel;
        private readonly _listSkillDesc!                    : TwnsUiScrollList.UiScrollList<DataForSkillDescRenderer>;

        private readonly _listSkillType!                    : TwnsUiScrollList.UiScrollList<DataForSkillTypeRenderer>;

        private _coData?                : CoData;
        private _selectedCoSkillType    = CoSkillType.Passive;

        protected _onOpened(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,    callback: this._onNotifyLanguageChanged },
            ]);
            this._listSkillDesc.setItemRenderer(SkillDescRenderer);
            this._listSkillType.setItemRenderer(SkillTypeRenderer);

            this._initListSkillType();
            this._updateComponentsForLanguage();
            this._updateComponentsForCoInfo();
        }

        private _onNotifyLanguageChanged(): void {
            this._updateComponentsForLanguage();
            this._updateComponentsForCoInfo();
        }

        public setCoData(newData: CoData): void {
            this._coData = newData;
            this._updateComponentsForCoInfo();
        }
        public getCoData(): CoData {
            return Helpers.getExisted(this._coData);
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

            this._labelArtDesignerTitle.text            = `${Lang.getText(LangTextType.B0839)}:`;
            this._labelDataDesignerTitle.text           = `${Lang.getText(LangTextType.B0840)}:`;
            this._labelBoardCostPercentageTitle.text    = `${Lang.getText(LangTextType.B0164)}:`;
            this._labelZoneRadiusTitle.text             = `${Lang.getText(LangTextType.B0165)}:`;
            this._labelEnergyBarTitle.text              = `${Lang.getText(LangTextType.B0166)}:`;
            this._labelEnergyCostTitle.text             = `${Lang.getText(LangTextType.B0167)}:`;
        }

        private _updateComponentsForCoInfo(): void {
            if (!this.getIsOpening()) {
                return;
            }

            const coData = this._coData;
            if (coData == null) {
                return;
            }

            const coId                      = coData.coId;
            const gameConfig                = coData.gameConfig;
            const cfg                       = gameConfig.getCoBasicCfg(coId);
            this._imgCoPortrait.source      = gameConfig.getCoBustImageSource(coId) ?? CommonConstants.ErrorTextForUndefined;
            this._labelCoName.text          = cfg?.name ?? CommonConstants.ErrorTextForUndefined;
            this._labelArtDesigner.text     = cfg?.artDesigner ?? ``;
            this._labelDataDesigner.text    = cfg?.dataDesigner ?? ``;

            const coType        = gameConfig.getCoType(coId);
            const groupZoneInfo = this._groupZoneInfo;
            (groupZoneInfo.parent) && (groupZoneInfo.parent.removeChild(groupZoneInfo));
            if (coType === Types.CoType.Zoned) {
                this._groupInfo.addChildAt(groupZoneInfo, 0);

                this._labelBoardCostPercentage.text = `${cfg?.boardCostPercentage}%`;
                this._labelZoneRadius.text          = `${cfg?.zoneRadius}`;
                this._labelEnergyBar.text           = (cfg?.zoneExpansionEnergyList || []).join(` / `) || `--`;

            } else if (coType === Types.CoType.Global) {
                // nothing to do

            } else {
                throw Helpers.newError(`Invalid coType: ${coType}`, ClientErrorCode.UiCoInfo_UpdateComponentsForCoInfo_00);
            }

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

            const coId                      = coData.coId;
            const gameConfig                = coData.gameConfig;
            const skillIdArray              = gameConfig.getCoSkillArray(coId, skillType) || [];
            const hasSkill                  = !!skillIdArray.length;
            this._labelSkillType.text       = `${Lang.getCoSkillTypeName(skillType)}:`;
            this._labelSkillName.text       = hasSkill ? `` : Lang.getText(LangTextType.B0001);

            const groupEnergyCost = this._groupEnergyCost;
            if (!hasSkill) {
                groupEnergyCost.visible = false;
            } else {
                const labelEnergyCost = this._labelEnergyCost;
                const powerEnergyList = gameConfig.getCoBasicCfg(coId)?.powerEnergyList || [];
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

            const dataArrayForListSkillDesc : DataForSkillDescRenderer[] = [];
            const rawDesc                   = (gameConfig.getCoSkillDescArray(coId, skillType) || [])[Lang.getCurrentLanguageType()];
            if (!rawDesc) {
                dataArrayForListSkillDesc.push({ desc: CommonConstants.ErrorTextForUndefined });
            } else {
                for (const desc of rawDesc.split(`\n`)) {
                    dataArrayForListSkillDesc.push({
                        desc,
                    });
                }
            }
            this._listSkillDesc.bindData(dataArrayForListSkillDesc);
        }
    }

    type DataForSkillTypeRenderer = {
        coSkillType : CoSkillType;
        component   : UiCoInfo;
    };
    class SkillTypeRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForSkillTypeRenderer> {
        private readonly _labelType!    : TwnsUiLabel.UiLabel;

        protected _onDataChanged(): void {
            const data              = this._getData();
            const skillType         = data.coSkillType;
            this.currentState       = data.component.getSelectedSkillType() === skillType ? Types.UiState.Down : Types.UiState.Up;
            this._labelType.text    = Lang.getCoSkillTypeName(skillType) ?? CommonConstants.ErrorTextForUndefined;
        }

        public onItemTapEvent(): void {
            const data = this._getData();
            data.component.setSelectedSkillType(data.coSkillType);
        }
    }

    type DataForSkillDescRenderer = {
        // skillId         : number;
        // configVersion   : string;
        desc            : string;
    };
    class SkillDescRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForSkillDescRenderer> {
        private readonly _labelDesc!    : TwnsUiLabel.UiLabel;

        protected _onDataChanged(): void {
            const data              = this._getData();
            // this._labelDesc.text    = `- ${ConfigManager.getCoSkillCfg(data.configVersion, data.skillId).desc[Lang.getCurrentLanguageType()]}`;
            this._labelDesc.text = `- ${data.desc || CommonConstants.ErrorTextForUndefined}`;
        }
    }
}

// export default TwnsUiCoInfo;
