
namespace TinyWars.MultiCustomRoom {
    import Types            = Utility.Types;
    import Helpers          = Utility.Helpers;
    import Lang             = Utility.Lang;
    import Notify           = Utility.Notify;
    import ConfigManager    = Utility.ConfigManager;
    import CommonConstants  = Utility.CommonConstants;
    import ConfirmPanel     = Common.CommonConfirmPanel;
    import CoSkillType      = Types.CoSkillType;

    type OpenDataForMcrCreateAvailableCoPanel = {
        playerIndex : number;
    }
    export class McrCreateAvailableCoPanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Hud2;
        protected readonly _IS_EXCLUSIVE = true;

        private static _instance: McrCreateAvailableCoPanel;

        private readonly _imgMask                   : GameUi.UiImage;
        private readonly _group                     : eui.Group;
        private readonly _labelAvailableCoTitle     : GameUi.UiLabel;
        // private readonly _groupCoTiers              : eui.Group;
        private readonly _groupCoNames              : eui.Group;
        private readonly _btnCancel                 : GameUi.UiButton;
        private readonly _btnConfirm                : GameUi.UiButton;

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
        private readonly _listSkillDesc                 : GameUi.UiScrollList<DataForSkillDescRenderer, SkillDescRenderer>;

        private readonly _listSkillType                 : GameUi.UiScrollList<DataForSkillTypeRenderer, SkillTypeRenderer>;

        // private _renderersForCoTiers    : RendererForCoTier[] = [];
        private _renderersForCoNames    : RendererForCoName[] = [];

        private _playerIndex            : number;
        private _availableCoIdSet       = new Set<number>();
        private _previewCoId            : number;
        private _selectedCoSkillType    = CoSkillType.Passive;

        public static show(openData: OpenDataForMcrCreateAvailableCoPanel): void {
            if (!McrCreateAvailableCoPanel._instance) {
                McrCreateAvailableCoPanel._instance = new McrCreateAvailableCoPanel();
            }
            McrCreateAvailableCoPanel._instance.open(openData);
        }

        public static async hide(): Promise<void> {
            if (McrCreateAvailableCoPanel._instance) {
                await McrCreateAvailableCoPanel._instance.close();
            }
        }

        public constructor() {
            super();

            this._setIsTouchMaskEnabled();
            this._setIsCloseOnTouchedMask();
            this.skinName = "resource/skins/multiCustomRoom/McrCreateAvailableCoPanel.exml";
        }

        protected _onOpened(): void {
            this._setUiListenerArray([
                { ui: this._btnCancel,  callback: this._onTouchedBtnCancel },
                { ui: this._btnConfirm, callback: this._onTouchedBtnConfirm },
            ]);
            this._setNotifyListenerArray([
                { type: Notify.Type.LanguageChanged, callback: this._onNotifyLanguageChanged },
            ]);
            this._listSkillDesc.setItemRenderer(SkillDescRenderer);
            this._listSkillType.setItemRenderer(SkillTypeRenderer);

            this._showOpenAnimation();

            const playerIndex = this._getOpenData<OpenDataForMcrCreateAvailableCoPanel>().playerIndex;
            this._playerIndex = playerIndex;

            const availableCoIdSet = this._availableCoIdSet;
            availableCoIdSet.clear();
            for (const coId of McrModel.Create.getAvailableCoIdList(this._playerIndex)) {
                availableCoIdSet.add(coId);
            }

            this._updateComponentsForLanguage();
            // this._initGroupCoTiers();
            this._initGroupCoNames();
            this._initComponentsForPreviewCo();
        }

        protected async _onClosed(): Promise<void> {
            await this._showCloseAnimation();

            // this._clearGroupCoTiers();
            this._clearGroupCoNames();
            this._listSkillType.clear();
            this._listSkillDesc.clear();
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

        private _setPreviewCoId(coId: number): void {
            if (this._getPreviewCoId() !== coId) {
                this._previewCoId = coId;
                this._updateComponentsForPreviewCoId();
            }
        }
        private _getPreviewCoId(): number {
            return this._previewCoId;
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Event callbacks.
        ////////////////////////////////////////////////////////////////////////////////
        private _onNotifyLanguageChanged(): void {
            this._updateComponentsForLanguage();
        }

        private _onTouchedBtnCancel(e: egret.TouchEvent): void {
            this.close();
        }

        private _onTouchedBtnConfirm(e: egret.TouchEvent): void {
            const availableCoIdSet = this._availableCoIdSet;
            if (!availableCoIdSet.has(CommonConstants.CoEmptyId)) {
                Common.CommonAlertPanel.show({
                    title   : Lang.getText(Lang.Type.B0088),
                    content : Lang.getText(Lang.Type.A0130),
                });
            } else {
                const playerIndex   = this._playerIndex;
                const callback      = () => {
                    McrModel.Create.setAvailableCoIdList(playerIndex, availableCoIdSet);
                    Notify.dispatch(Notify.Type.McrCreateAvailableCoIdListChanged);
                    this.close();
                };
                if ((playerIndex !== McrModel.Create.getSelfPlayerIndex()) ||
                    (availableCoIdSet.has(McrModel.Create.getSelfCoId()))
                ) {
                    callback();
                } else {
                    ConfirmPanel.show({
                        content : Lang.getText(Lang.Type.A0057),
                        callback: () => {
                            McrModel.Create.setSelfCoId(Helpers.pickRandomElement([...availableCoIdSet]));
                            callback();
                        },
                    });
                }
            }
        }

        // private _onTouchedCoTierRenderer(e: egret.TouchEvent): void {
        //     const renderer          = e.currentTarget as RendererForCoTier;
        //     const availableCoIdSet  = this._availableCoIdSet;
        //     const coIdList          = renderer.getIsCustomSwitch()
        //         ? ConfigManager.getAvailableCustomCoIdList(ConfigManager.getLatestFormalVersion())
        //         : ConfigManager.getAvailableCoIdListInTier(ConfigManager.getLatestFormalVersion(), renderer.getCoTier());

        //     if (renderer.getState() === CoTierState.Unavailable) {
        //         for (const coId of coIdList) {
        //             availableCoIdSet.add(coId);
        //         }
        //         this._updateGroupCoTiers();
        //         this._updateGroupCoNames();

        //     } else {
        //         const callback = () => {
        //             for (const coId of coIdList) {
        //                 availableCoIdSet.delete(coId);
        //             }
        //             this._updateGroupCoTiers();
        //             this._updateGroupCoNames();
        //         }

        //         if ((this._playerIndex !== McrModel.Create.getSelfPlayerIndex()) ||
        //             (coIdList.indexOf(McrModel.Create.getSelfCoId()) < 0)
        //         ) {
        //             callback();
        //         } else {
        //             ConfirmPanel.show({
        //                 content : Lang.getText(Lang.Type.A0057),
        //                 callback,
        //             });
        //         }
        //     }
        // }

        private _onTouchedCoNameRenderer(e: egret.TouchEvent): void {
            const renderer          = e.currentTarget as RendererForCoName;
            const coId              = renderer.getCoId();
            const availableCoIdSet  = this._availableCoIdSet;
            this._setPreviewCoId(coId);

            if (!renderer.getIsSelected()) {
                availableCoIdSet.add(coId);
                // this._updateGroupCoTiers();
                this._updateGroupCoNames();

            } else {
                if (coId === CommonConstants.CoEmptyId) {
                    Common.CommonAlertPanel.show({
                        title   : Lang.getText(Lang.Type.B0088),
                        content : Lang.getText(Lang.Type.A0130),
                    });
                    return;
                }

                const callback = () => {
                    availableCoIdSet.delete(coId);
                    // this._updateGroupCoTiers();
                    this._updateGroupCoNames();
                };

                if ((this._playerIndex !== McrModel.Create.getSelfPlayerIndex()) ||
                    (coId !== McrModel.Create.getSelfCoId())
                ) {
                    callback();
                } else {
                    ConfirmPanel.show({
                        content : Lang.getText(Lang.Type.A0057),
                        callback,
                    });
                }
            }
        }

        ////////////////////////////////////////////////////////////////////////////////
        // View functions.
        ////////////////////////////////////////////////////////////////////////////////
        private _updateComponentsForLanguage(): void {
            this._btnCancel.label                       = Lang.getText(Lang.Type.B0154);
            this._btnConfirm.label                      = Lang.getText(Lang.Type.B0026);
            this._labelAvailableCoTitle.text            = `${Lang.getText(Lang.Type.B0238)} (P${this._playerIndex})`;
            this._labelDesignerTitle.text               = Lang.getText(Lang.Type.B0163);
            this._labelBoardCostPercentageTitle.text    = `${Lang.getText(Lang.Type.B0164)}:`;
            this._labelZoneRadiusTitle.text             = `${Lang.getText(Lang.Type.B0165)}:`;
            this._labelEnergyBarTitle.text              = `${Lang.getText(Lang.Type.B0166)}:`;
            this._labelEnergyCostTitle.text             = `${Lang.getText(Lang.Type.B0167)}:`;

            this._updateComponentsForPreviewCoId();
        }

        // private _initGroupCoTiers(): void {
        //     for (const tier of ConfigManager.getCoTiers(ConfigManager.getLatestFormalVersion())) {
        //         const renderer = new RendererForCoTier();
        //         renderer.setCoTier(tier);
        //         renderer.setState(CoTierState.AllAvailable);
        //         renderer.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onTouchedCoTierRenderer, this);
        //         this._renderersForCoTiers.push(renderer);
        //         this._groupCoTiers.addChild(renderer);
        //     }

        //     const rendererForCustomCo = new RendererForCoTier();
        //     rendererForCustomCo.setIsCustomSwitch(true);
        //     rendererForCustomCo.setState(CoTierState.AllAvailable);
        //     rendererForCustomCo.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onTouchedCoTierRenderer, this);
        //     this._renderersForCoTiers.push(rendererForCustomCo);
        //     this._groupCoTiers.addChild(rendererForCustomCo);

        //     this._updateGroupCoTiers();
        // }

        // private _clearGroupCoTiers(): void {
        //     this._groupCoTiers.removeChildren();
        //     this._renderersForCoTiers.length = 0;
        // }

        // private _updateGroupCoTiers(): void {
        //     const availableCoIdSet  = this._availableCoIdSet;
        //     const configVersion     = McrModel.Create.getData().settingsForCommon.configVersion;
        //     for (const renderer of this._renderersForCoTiers) {
        //         const includedCoIdList = renderer.getIsCustomSwitch()
        //             ? ConfigManager.getAvailableCustomCoIdList(configVersion)
        //             : ConfigManager.getAvailableCoIdListInTier(configVersion, renderer.getCoTier());

        //         if (includedCoIdList.every(coId => availableCoIdSet.has(coId))) {
        //             renderer.setState(CoTierState.AllAvailable);
        //         } else if (includedCoIdList.every(coId => !availableCoIdSet.has(coId))) {
        //             renderer.setState(CoTierState.Unavailable);
        //         } else {
        //             renderer.setState(CoTierState.PartialAvailable);
        //         }
        //     }
        // }

        private _initGroupCoNames(): void {
            for (const cfg of ConfigManager.getAvailableCoArray(ConfigManager.getLatestFormalVersion())) {
                const renderer = new RendererForCoName();
                renderer.setCoId(cfg.coId);
                renderer.setIsSelected(true);

                renderer.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onTouchedCoNameRenderer, this);
                this._renderersForCoNames.push(renderer);
                this._groupCoNames.addChild(renderer);
            }

            this._updateGroupCoNames();
        }

        private _clearGroupCoNames(): void {
            this._groupCoNames.removeChildren();
            this._renderersForCoNames.length = 0;
        }

        private _updateGroupCoNames(): void {
            const availableCoIdSet = this._availableCoIdSet;
            for (const renderer of this._renderersForCoNames) {
                renderer.setIsSelected(availableCoIdSet.has(renderer.getCoId()));
            }
        }

        private _initComponentsForPreviewCo(): void {
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

            for (const coId of this._availableCoIdSet) {
                if (coId !== CommonConstants.CoEmptyId) {
                    this._setPreviewCoId(coId);
                    return;
                }
            }
        }

        private _updateComponentsForPreviewCoId(): void {
            const coId = this._previewCoId;
            if (coId == null) {
                return;
            }

            const cfg                           = ConfigManager.getCoBasicCfg(ConfigManager.getLatestFormalVersion(), coId);
            this._labelCoName.text              = cfg.name;
            this._labelDesigner.text            = cfg.designer;
            this._imgCoPortrait.source          = cfg.fullPortrait;
            this._labelBoardCostPercentage.text = `${cfg.boardCostPercentage}%`;
            this._labelZoneRadius.text          = `${cfg.zoneRadius}`;
            this._labelEnergyBar.text           = (cfg.zoneExpansionEnergyList || []).join(` / `) || `--`;

            this._updateComponentsForSkill();
        }
        private _updateComponentsForSkill(): void {
            const coId = this._getPreviewCoId();
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

    // const enum CoTierState {
    //     AllAvailable,
    //     PartialAvailable,
    //     Unavailable,
    // }
    // class RendererForCoTier extends GameUi.UiComponent {
    //     private _imgSelected: GameUi.UiImage;
    //     private _labelName  : GameUi.UiLabel;

    //     private _tier           : number;
    //     private _isCustomSwitch = false;
    //     private _state          : CoTierState;

    //     public constructor() {
    //         super();

    //         this.skinName = "resource/skins/component/checkBox/CheckBox1.exml";
    //     }

    //     public setCoTier(tier: number): void {
    //         this._tier              = tier;
    //         this._labelName.text    = `Tier ${tier}`;
    //     }
    //     public getCoTier(): number {
    //         return this._tier;
    //     }

    //     public setIsCustomSwitch(isCustomSwitch: boolean): void {
    //         this._isCustomSwitch    = isCustomSwitch;
    //         this._labelName.text    = "Custom";
    //     }
    //     public getIsCustomSwitch(): boolean {
    //         return this._isCustomSwitch;
    //     }

    //     public setState(state: CoTierState): void {
    //         this._state = state;
    //         if (state === CoTierState.AllAvailable) {
    //             this._labelName.textColor = 0x00FF00;
    //         } else if (state === CoTierState.PartialAvailable) {
    //             this._labelName.textColor = 0xFFFF00;
    //         } else {
    //             this._labelName.textColor = 0xFF0000;
    //         }
    //         Helpers.changeColor(this._imgSelected, state === CoTierState.AllAvailable ? Types.ColorType.Origin : Types.ColorType.Gray);
    //     }
    //     public getState(): CoTierState {
    //         return this._state;
    //     }
    // }

    class RendererForCoName extends GameUi.UiComponent {
        private readonly _imgUnselected : GameUi.UiImage;
        private readonly _imgSelected   : GameUi.UiImage;
        private readonly _labelName     : GameUi.UiLabel;

        private _coId           : number;
        private _isSelected     : boolean;

        public constructor() {
            super();

            this.skinName = "resource/skins/component/checkBox/CheckBox001.exml";
        }

        protected _onOpened(): void {
            this._updateView();
        }

        public setCoId(coId: number): void {
            this._coId = coId;

            this._updateView();
        }
        public getCoId(): number {
            return this._coId;
        }

        public setIsSelected(isSelected: boolean): void {
            this._isSelected = isSelected;
            this._updateView();
        }
        public getIsSelected(): boolean {
            return this._isSelected;
        }

        private _updateView(): void {
            if (!this.getIsOpening()) {
                return;
            }

            const coCfg             = ConfigManager.getCoBasicCfg(ConfigManager.getLatestFormalVersion(), this._coId);
            this._labelName.text    = coCfg ? coCfg.name : null;

            const isSelected            = this._isSelected;
            this._imgSelected.visible   = isSelected;
            this._imgUnselected.visible = !isSelected;
        }
    }

    type DataForSkillTypeRenderer = {
        coSkillType : CoSkillType;
        panel       : McrCreateAvailableCoPanel;
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
