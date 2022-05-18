
// import CommonModel              from "../../common/model/CommonModel";
// import CommonConstants          from "../../tools/helpers/CommonConstants";
// import ConfigManager            from "../../tools/helpers/ConfigManager";
// import Helpers                  from "../../tools/helpers/Helpers";
// import Timer                    from "../../tools/helpers/Timer";
// import Types                    from "../../tools/helpers/Types";
// import Lang                     from "../../tools/lang/Lang";
// import TwnsLangTextType         from "../../tools/lang/LangTextType";
// import Notify           from "../../tools/notify/NotifyType";
// import ProtoTypes               from "../../tools/proto/ProtoTypes";
// import TwnsUiButton             from "../../tools/ui/UiButton";
// import TwnsUiImage              from "../../tools/ui/UiImage";
// import TwnsUiLabel              from "../../tools/ui/UiLabel";
// import TwnsUiListItemRenderer   from "../../tools/ui/UiListItemRenderer";
// import TwnsUiPanel              from "../../tools/ui/UiPanel";
// import TwnsUiScrollList         from "../../tools/ui/UiScrollList";
// import UserModel                from "../../user/model/UserModel";
// import TwnsWarMapUnitView       from "../../warMap/view/WarMapUnitView";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.Common {
    import NotifyType       = Notify.NotifyType;
    import LangTextType     = Lang.LangTextType;
    import TileType         = Types.TileType;
    import GameConfig       = Config.GameConfig;

    // eslint-disable-next-line no-shadow
    enum UnitInfoType {
        Hp,
        ProductionCost,
        Movement,
        Fuel,
        AttackRange,
        Vision,
        PrimaryWeaponAmmo,
        FlareAmmo,
        BuildMaterial,
        ProduceMaterial,
        IsDiver,
        LoadUnit,
    }
    export type OpenDataForCommonDamageChartPanel = {
        gameConfig   : GameConfig;
    };
    export class CommonDamageChartPanel extends TwnsUiPanel.UiPanel<OpenDataForCommonDamageChartPanel> {
        private readonly _imgMask!              : TwnsUiImage.UiImage;
        private readonly _groupList!            : eui.Group;
        private readonly _listUnit!             : TwnsUiScrollList.UiScrollList<DataForUnitRenderer>;
        private readonly _btnBack!              : TwnsUiButton.UiButton;

        private readonly _groupInfo!            : eui.Group;
        private readonly _conUnitView!          : eui.Group;
        private readonly _labelName!            : TwnsUiLabel.UiLabel;
        private readonly _labelName1!           : TwnsUiLabel.UiLabel;

        private readonly _listInfo!             : TwnsUiScrollList.UiScrollList<DataForInfoRenderer>;
        private readonly _listDamageChart!      : TwnsUiScrollList.UiScrollList<DataForDamageRenderer>;
        private readonly _labelDamageChart!     : TwnsUiLabel.UiLabel;
        private readonly _labelOffense!         : TwnsUiLabel.UiLabel;
        private readonly _labelDefense!         : TwnsUiLabel.UiLabel;
        private readonly _labelMain1!           : TwnsUiLabel.UiLabel;
        private readonly _labelSub1!            : TwnsUiLabel.UiLabel;
        private readonly _labelMain2!           : TwnsUiLabel.UiLabel;
        private readonly _labelSub2!            : TwnsUiLabel.UiLabel;

        private _selectedIndex                  : number | null = null;
        private _dataForListUnit?               : DataForUnitRenderer[];
        private readonly _unitView              = new WarMap.WarMapUnitView();

        protected _onOpening(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,             callback: this._onNotifyLanguageChanged },
                { type: NotifyType.UnitAnimationTick,           callback: this._onNotifyUnitAnimationTick },
                { type: NotifyType.UnitStateIndicatorTick,      callback: this._onNotifyUnitStateIndicatorTick },
                { type: NotifyType.BwActionPlannerStateSet,     callback: this._onNotifyBwPlannerStateChanged },
            ]);
            this._setUiListenerArray([
                { ui: this._btnBack,    callback: this.close },
            ]);
            this._setIsTouchMaskEnabled();
            this._setIsCloseOnTouchedMask();

            this._listUnit.setItemRenderer(UnitRenderer);
            this._listDamageChart.setItemRenderer(DamageRenderer);
            this._listInfo.setItemRenderer(InfoRenderer);

            this._conUnitView.addChild(this._unitView);
        }
        protected async _updateOnOpenDataChanged(): Promise<void> {
            const listUnit          = this._listUnit;
            this._dataForListUnit   = this._createDataForListUnit();
            listUnit.bindData(this._dataForListUnit);
            listUnit.scrollVerticalTo(0);
            this._updateComponentsForLanguage();
            this.setSelectedIndexAndUpdateView(0);
            this._updateListInfo();
        }
        protected _onClosing(): void {
            this._conUnitView.removeChildren();
            this._selectedIndex = null;
            delete this._dataForListUnit;
        }

        public setSelectedIndexAndUpdateView(newIndex: number): void {
            const oldIndex      = this._selectedIndex;
            this._selectedIndex = newIndex;
            if (oldIndex !== newIndex) {
                this._listUnit.setSelectedIndex(newIndex);
                this._updateUnitViewAndLabelName();
                this._updateListInfo();
                this._updateListDamageChart();
            }
        }
        public getSelectedIndex(): number | null {
            return this._selectedIndex;
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Callbacks.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _onNotifyLanguageChanged(): void {
            this._updateComponentsForLanguage();
        }

        private _onNotifyUnitAnimationTick(): void {
            this._unitView.updateOnAnimationTick(Timer.getUnitAnimationTickCount());
        }

        private _onNotifyUnitStateIndicatorTick(): void {
            this._unitView.updateOnStateIndicatorTick();
        }

        private _onNotifyBwPlannerStateChanged(): void {
            // this.close();
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Functions for view.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        protected async _showOpenAnimation(): Promise<void> {
            Helpers.resetTween({
                obj         : this._imgMask,
                beginProps  : { alpha: 0 },
                endProps    : { alpha: 1 },
            });

            const groupList = this._groupList;
            egret.Tween.removeTweens(groupList);
            egret.Tween.get(groupList)
                .set({ alpha: 0, left: -40 })
                .to({ alpha: 1, left: 0 }, 200);

            const groupInfo = this._groupInfo;
            egret.Tween.removeTweens(groupInfo);
            egret.Tween.get(groupInfo)
                .set({ alpha: 0, right: -40 })
                .to({ alpha: 1, right: 0 }, 200);

            await Helpers.wait(CommonConstants.DefaultTweenTime);
        }
        protected async _showCloseAnimation(): Promise<void> {
            Helpers.resetTween({
                obj         : this._imgMask,
                beginProps  : { alpha: 1 },
                endProps    : { alpha: 0 },
            });

            const groupList = this._groupList;
            egret.Tween.removeTweens(groupList);
            egret.Tween.get(groupList)
                .set({ alpha: 1, left: 0 })
                .to({ alpha: 0, left: -40 }, 200);

            const groupInfo = this._groupInfo;
            egret.Tween.removeTweens(groupInfo);
            egret.Tween.get(groupInfo)
                .set({ alpha: 1, right: 0 })
                .to({ alpha: 0, right: -40 }, 200);

            await Helpers.wait(CommonConstants.DefaultTweenTime);
        }

        private _updateComponentsForLanguage(): void {
            this._btnBack.label             = Lang.getText(LangTextType.B0146);
            this._labelDamageChart.text     = Lang.getText(LangTextType.B0334);
            this._labelOffense.text         = Lang.getText(LangTextType.B0694);
            this._labelDefense.text         = Lang.getText(LangTextType.B0695);
            this._labelMain1.text           = Lang.getText(LangTextType.B0692);
            this._labelSub1.text            = Lang.getText(LangTextType.B0693);
            this._labelMain2.text           = Lang.getText(LangTextType.B0692);
            this._labelSub2.text            = Lang.getText(LangTextType.B0693);
        }

        private _updateUnitViewAndLabelName(): void {
            const selectedIndex = this.getSelectedIndex();
            const dataArray     = this._dataForListUnit;
            const data          = (selectedIndex == null) || (dataArray == null)
                ? null
                : dataArray[selectedIndex];
            if (data) {
                const unitType          = data.unitType;
                const gameConfig        = data.gameConfig;
                this._labelName.text    = Lang.getUnitName(unitType, gameConfig) ?? CommonConstants.ErrorTextForUndefined;
                this._labelName1.text   = Lang.getUnitName(unitType, gameConfig, Lang.getCurrentLanguageType() === Types.LanguageType.Chinese ? Types.LanguageType.English : Types.LanguageType.Chinese) ?? CommonConstants.ErrorTextForUndefined;
                this._unitView.update({
                    gameConfig      : this._getOpenData().gameConfig,
                    gridIndex       : { x: 0, y: 0 },
                    playerIndex     : CommonConstants.WarFirstPlayerIndex,
                    unitType,
                    actionState     : Types.UnitActionState.Idle,
                }, Timer.getUnitAnimationTickCount());
            }
        }

        private _updateListInfo(): void {
            const selectedIndex     = this.getSelectedIndex();
            const dataArrayForUnit  = this._dataForListUnit;
            const unitData          = (selectedIndex == null) || (dataArrayForUnit == null)
                ? null
                : dataArrayForUnit[selectedIndex];
            const listInfo      = this._listInfo;
            if (unitData == null) {
                listInfo.clear();
            } else {
                const gameConfig        = unitData.gameConfig;
                const unitType          = unitData.unitType;
                const unitTemplateCfg   = Helpers.getExisted(gameConfig.getUnitTemplateCfg(unitType));
                const dataArray         : DataForInfoRenderer[] = Helpers.getNonNullElements([
                    this._createInfoHp(unitTemplateCfg, gameConfig),
                    this._createInfoProductionCost(unitTemplateCfg, gameConfig),
                    this._createInfoMovement(unitTemplateCfg, gameConfig),
                    this._createInfoFuel(unitTemplateCfg, gameConfig),
                    this._createInfoAttackRange(unitTemplateCfg, gameConfig),
                    this._createInfoVision(unitTemplateCfg, gameConfig),
                    this._createInfoPrimaryWeaponAmmo(unitTemplateCfg, gameConfig),
                    this._createInfoBuildMaterial(unitTemplateCfg, gameConfig),
                    this._createInfoProduceMaterial(unitTemplateCfg, gameConfig),
                    this._createInfoFlareAmmo(unitTemplateCfg, gameConfig),
                    this._createInfoIsDiver(unitTemplateCfg, gameConfig),
                    this._createInfoLoadUnit(unitTemplateCfg, gameConfig),
                ]);
                let index = 0;
                for (const data of dataArray) {
                    data.index = index++;
                }

                this._listInfo.bindData(dataArray);
            }
        }

        private _updateListDamageChart(): void {
            this._listDamageChart.bindData(this._createDataForListDamageChart());
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Util functions.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _createInfoHp(unitTemplateCfg: CommonProto.Config.IUnitTemplateCfg, gameConfig: GameConfig): DataForInfoRenderer {
            return {
                index           : 0,
                infoType        : UnitInfoType.Hp,
                unitTemplateCfg,
                gameConfig,
            };
        }
        private _createInfoProductionCost(unitTemplateCfg: CommonProto.Config.IUnitTemplateCfg, gameConfig: GameConfig): DataForInfoRenderer {
            return {
                index       : 0,
                infoType    : UnitInfoType.ProductionCost,
                unitTemplateCfg,
                gameConfig,
            };
        }
        private _createInfoMovement(unitTemplateCfg: CommonProto.Config.IUnitTemplateCfg, gameConfig: GameConfig): DataForInfoRenderer {
            return {
                index       : 0,
                infoType    : UnitInfoType.Movement,
                unitTemplateCfg,
                gameConfig,
            };
        }
        private _createInfoFuel(unitTemplateCfg: CommonProto.Config.IUnitTemplateCfg, gameConfig: GameConfig): DataForInfoRenderer {
            return {
                index       : 0,
                infoType    : UnitInfoType.Fuel,
                unitTemplateCfg,
                gameConfig,
            };
        }
        private _createInfoAttackRange(unitTemplateCfg: CommonProto.Config.IUnitTemplateCfg, gameConfig: GameConfig): DataForInfoRenderer | null {
            return unitTemplateCfg.minAttackRange == null
                ? null
                : {
                    index       : 0,
                    infoType    : UnitInfoType.AttackRange,
                    unitTemplateCfg,
                    gameConfig,
                };
        }
        private _createInfoVision(unitTemplateCfg: CommonProto.Config.IUnitTemplateCfg, gameConfig: GameConfig): DataForInfoRenderer {
            return {
                index       : 0,
                infoType    : UnitInfoType.Vision,
                unitTemplateCfg,
                gameConfig,
            };
        }
        private _createInfoPrimaryWeaponAmmo(unitTemplateCfg: CommonProto.Config.IUnitTemplateCfg, gameConfig: GameConfig): DataForInfoRenderer | null {
            return unitTemplateCfg.primaryWeaponMaxAmmo == null
                ? null
                : {
                    index       : 0,
                    infoType    : UnitInfoType.PrimaryWeaponAmmo,
                    unitTemplateCfg,
                    gameConfig,
                };
        }
        private _createInfoBuildMaterial(unitTemplateCfg: CommonProto.Config.IUnitTemplateCfg, gameConfig: GameConfig): DataForInfoRenderer | null {
            return unitTemplateCfg.maxBuildMaterial == null
                ? null
                : {
                    index       : 0,
                    infoType    : UnitInfoType.BuildMaterial,
                    unitTemplateCfg,
                    gameConfig,
                };
        }
        private _createInfoProduceMaterial(unitTemplateCfg: CommonProto.Config.IUnitTemplateCfg, gameConfig: GameConfig): DataForInfoRenderer | null {
            return unitTemplateCfg.maxProduceMaterial == null
                ? null
                : {
                    index       : 0,
                    infoType    : UnitInfoType.ProduceMaterial,
                    unitTemplateCfg,
                    gameConfig,
                };
        }
        private _createInfoFlareAmmo(unitTemplateCfg: CommonProto.Config.IUnitTemplateCfg, gameConfig: GameConfig): DataForInfoRenderer | null {
            return unitTemplateCfg.flareMaxAmmo == null
                ? null
                : {
                    index       : 0,
                    infoType    : UnitInfoType.FlareAmmo,
                    unitTemplateCfg,
                    gameConfig,
                };
        }
        private _createInfoIsDiver(unitTemplateCfg: CommonProto.Config.IUnitTemplateCfg, gameConfig: GameConfig): DataForInfoRenderer | null {
            return !unitTemplateCfg.diveCfgs
                ? null
                : {
                    index       : 0,
                    infoType    : UnitInfoType.IsDiver,
                    unitTemplateCfg,
                    gameConfig,
                };
        }
        private _createInfoLoadUnit(unitTemplateCfg: CommonProto.Config.IUnitTemplateCfg, gameConfig: GameConfig): DataForInfoRenderer | null {
            return unitTemplateCfg.loadUnitCategory == null
                ? null
                : {
                    index       : 0,
                    infoType    : UnitInfoType.LoadUnit,
                    unitTemplateCfg,
                    gameConfig,
                };
        }

        private _createDataForListDamageChart(): DataForDamageRenderer[] {
            const selectedIndex     = this.getSelectedIndex();
            const dataArrayForUnit  = this._dataForListUnit;
            const dataForUnit       = (selectedIndex == null) || (dataArrayForUnit == null) ? null : dataArrayForUnit[selectedIndex];
            const dataArray         : DataForDamageRenderer[] = [];
            if (dataForUnit) {
                const gameConfig        = dataForUnit.gameConfig;
                const attackUnitType    = dataForUnit.unitType;
                const playerIndex       = CommonConstants.WarFirstPlayerIndex;
                let index               = 0;
                for (const targetUnitType of gameConfig.getUnitTypesByCategory(Types.UnitCategory.All) ?? []) {
                    dataArray.push({
                        index,
                        gameConfig,
                        attackUnitType,
                        targetUnitType,
                        playerIndex,
                    });
                    ++index;
                }
                for (const targetTileType of gameConfig.getTileTypesByCategory(Types.TileCategory.DestroyableForDamageChart) ?? []) {
                    dataArray.push({
                        index,
                        gameConfig,
                        attackUnitType,
                        targetTileType,
                    });
                    ++index;
                }
            }

            return dataArray.sort(sorterForDataForList);
        }

        private _createDataForListUnit(): DataForUnitRenderer[] {
            const data          : DataForUnitRenderer[] = [];
            const gameConfig    = this._getOpenData().gameConfig;
            const unitTypes     = gameConfig.getUnitTypesByCategory(Types.UnitCategory.All) ?? [];
            for (let index = 0; index < unitTypes.length; ++index) {
                data.push({
                    gameConfig,
                    index,
                    unitType: unitTypes[index],
                    panel   : this,
                });
            }

            return data;
        }
    }

    function sorterForDataForList(a: DataForDamageRenderer, b: DataForDamageRenderer): number {
        return a.attackUnitType - b.attackUnitType;
    }

    type DataForUnitRenderer = {
        gameConfig      : GameConfig;
        unitType        : number;
        index           : number;
        panel           : CommonDamageChartPanel;
    };
    class UnitRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForUnitRenderer> {
        private readonly _imgChoose!    : eui.Image;
        private readonly _labelName!    : TwnsUiLabel.UiLabel;

        protected _onOpened(): void {
            this._setUiListenerArray([
                { ui: this._imgChoose,  callback: this._onTouchedImgChoose },
            ]);
        }

        protected _onDataChanged(): void {
            const data              = this._getData();
            this._labelName.text    = Lang.getUnitName(data.unitType, data.gameConfig) ?? CommonConstants.ErrorTextForUndefined;
        }

        private _onTouchedImgChoose(): void {
            const data = this._getData();
            data.panel.setSelectedIndexAndUpdateView(data.index);
        }
    }

    type DataForInfoRenderer = {
        index           : number;
        infoType        : UnitInfoType;
        unitTemplateCfg : CommonProto.Config.IUnitTemplateCfg;
        gameConfig      : GameConfig;
    };
    class InfoRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForInfoRenderer> {
        private readonly _imgBg!            : TwnsUiImage.UiImage;
        private readonly _labelTitle!       : TwnsUiLabel.UiLabel;
        private readonly _labelValue!       : TwnsUiLabel.UiLabel;
        private readonly _groupExtra!       : eui.Group;
        private readonly _labelExtraInfo!   : TwnsUiLabel.UiLabel;

        protected _onOpened(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged, callback: this._onNotifyLanguageChanged },
            ]);
            this._setShortSfxCode(Types.ShortSfxCode.None);
        }

        protected _onDataChanged(): void {
            this._updateView();
        }

        private _onNotifyLanguageChanged(): void {
            this._updateView();
        }

        private _updateView(): void {
            const data          = this._getData();
            this._imgBg.visible = data.index % 2 === 0;

            const infoType = data.infoType;
            if (infoType === UnitInfoType.AttackRange) {
                this._updateViewAsAttackRange();
            } else if (infoType === UnitInfoType.BuildMaterial) {
                this._updateViewAsBuildMaterial();
            } else if (infoType === UnitInfoType.FlareAmmo) {
                this._updateViewAsFlareAmmo();
            } else if (infoType === UnitInfoType.Fuel) {
                this._updateViewAsFuel();
            } else if (infoType === UnitInfoType.Hp) {
                this._updateViewAsHp();
            } else if (infoType === UnitInfoType.IsDiver) {
                this._updateViewAsIsDiver();
            } else if (infoType === UnitInfoType.Movement) {
                this._updateViewAsMovement();
            } else if (infoType === UnitInfoType.PrimaryWeaponAmmo) {
                this._updateViewAsPrimaryWeaponAmmo();
            } else if (infoType === UnitInfoType.ProduceMaterial) {
                this._updateViewAsProduceMaterial();
            } else if (infoType === UnitInfoType.ProductionCost) {
                this._updateViewAsProductionCost();
            } else if (infoType === UnitInfoType.Vision) {
                this._updateViewAsVision();
            } else if (infoType === UnitInfoType.LoadUnit) {
                this._updateViewAsLoadUnit();
            } else {
                throw Helpers.newError(`Invalid infoType: ${infoType}`);
            }
        }
        private _updateViewAsAttackRange(): void {
            const data                  = this._getData();
            const unit                  = data.unitTemplateCfg;
            const minRange              = unit.minAttackRange;
            const maxRange              = unit.maxAttackRange;
            this._labelTitle.text       = Lang.getText(LangTextType.B0696);
            this._labelValue.text       = minRange == null ? `--` : `${minRange} - ${maxRange}`;

            const groupExtra = this._groupExtra;
            if (!unit.canAttackAfterMove) {
                groupExtra.visible = false;
            } else {
                groupExtra.visible          = true;
                this._labelExtraInfo.text   = Lang.getText(LangTextType.B0697);
            }
        }
        private _updateViewAsBuildMaterial(): void {
            const data                  = this._getData();
            const unit                  = data.unitTemplateCfg;
            const currentValue          = unit.maxBuildMaterial;
            const maxValue              = unit.maxBuildMaterial;
            this._labelTitle.text       = Lang.getText(LangTextType.B0347);
            this._labelValue.text       = currentValue == null ? `--` : `${currentValue} / ${maxValue}`;
            this._groupExtra.visible    = false;
        }
        private _updateViewAsFlareAmmo(): void {
            const data                  = this._getData();
            const unit                  = data.unitTemplateCfg;
            const currentValue          = unit.flareMaxAmmo;
            const maxValue              = unit.flareMaxAmmo;
            this._labelTitle.text       = Lang.getText(LangTextType.B0349);
            this._labelValue.text       = currentValue == null ? `--` : `${currentValue} / ${maxValue}`;
            this._groupExtra.visible    = false;
        }
        private _updateViewAsFuel(): void {
            const data                  = this._getData();
            const unit                  = data.unitTemplateCfg;
            const currentValue          = unit.maxFuel;
            const maxValue              = unit.maxFuel;
            this._labelTitle.text       = Lang.getText(LangTextType.B0342);
            this._labelValue.text       = `${currentValue} / ${maxValue}`;

            const fuelConsumption   = Helpers.getExisted(unit.fuelConsumptionPerTurn);
            const groupExtra        = this._groupExtra;
            if (fuelConsumption == 0) {
                groupExtra.visible = false;
            } else {
                groupExtra.visible          = true;
                this._labelExtraInfo.text   = fuelConsumption < 0 ? `+${-fuelConsumption}` : `-${fuelConsumption}`;
            }
        }
        private _updateViewAsHp(): void {
            const data                  = this._getData();
            const unit                  = data.unitTemplateCfg;
            const currentValue          = unit.maxHp;
            const maxValue              = unit.maxHp;
            this._labelTitle.text       = Lang.getText(LangTextType.B0339);
            this._labelValue.text       = `${currentValue} / ${maxValue}`;
            this._groupExtra.visible    = false;
        }
        private _updateViewAsIsDiver(): void {
            const data                  = this._getData();
            const unit                  = data.unitTemplateCfg;
            this._labelTitle.text       = Lang.getText(LangTextType.B0371);
            this._labelValue.text       = unit.diveCfgs ? Lang.getText(LangTextType.B0012) : Lang.getText(LangTextType.B0013);
            this._groupExtra.visible    = false;
        }
        private _updateViewAsMovement(): void {
            const data                  = this._getData();
            const unit                  = data.unitTemplateCfg;
            const currentValue          = unit.moveRange;
            this._labelTitle.text       = Lang.getText(LangTextType.B0340);
            this._labelValue.text       = `${currentValue}`;
            this._groupExtra.visible    = true;
            this._labelExtraInfo.text   = Lang.getMoveTypeName(Helpers.getExisted(unit.moveType)) ?? CommonConstants.ErrorTextForUndefined;
        }
        private _updateViewAsPrimaryWeaponAmmo(): void {
            const data                  = this._getData();
            const unit                  = data.unitTemplateCfg;
            const currentValue          = unit.primaryWeaponMaxAmmo;
            const maxValue              = unit.primaryWeaponMaxAmmo;
            this._labelTitle.text       = Lang.getText(LangTextType.B0350);
            this._labelValue.text       = currentValue == null ? `--` : `${currentValue} / ${maxValue}`;
            this._groupExtra.visible    = false;
        }
        private _updateViewAsProduceMaterial(): void {
            const data                  = this._getData();
            const unit                  = data.unitTemplateCfg;
            const currentValue          = unit.maxProduceMaterial;
            const maxValue              = unit.maxProduceMaterial;
            this._labelTitle.text       = Lang.getText(LangTextType.B0348);
            this._labelValue.text       = currentValue == null ? `--` : `${currentValue} / ${maxValue}`;

            const groupExtra = this._groupExtra;
            if (currentValue == null) {
                groupExtra.visible = false;
            } else {
                groupExtra.visible          = true;
                this._labelExtraInfo.text   = Lang.getUnitName(Helpers.getExisted(unit.produceUnitType), data.gameConfig) ?? CommonConstants.ErrorTextForUndefined;
            }
        }
        private _updateViewAsProductionCost(): void {
            const data                  = this._getData();
            this._labelTitle.text       = Lang.getText(LangTextType.B0341);
            this._labelValue.text       = `${data.unitTemplateCfg.productionCost}`;
            this._groupExtra.visible    = false;
        }
        private _updateViewAsVision(): void {
            const data                  = this._getData();
            const unit                  = data.unitTemplateCfg;
            const currentValue          = unit.visionRange;
            this._labelTitle.text       = Lang.getText(LangTextType.B0354);
            this._labelValue.text       = `${currentValue}`;
            this._groupExtra.visible    = false;
        }
        private _updateViewAsLoadUnit(): void {
            this._labelTitle.text   = Lang.getText(LangTextType.B0698);

            const data          = this._getData();
            const unit          = data.unitTemplateCfg;
            const maxValue      = unit.maxLoadUnitsCount;
            const labelValue    = this._labelValue;
            const groupExtra    = this._groupExtra;
            if (maxValue == null) {
                labelValue.text     = `--`;
                groupExtra.visible  = false;
            } else {
                labelValue.text             = `0 / ${maxValue}`;
                groupExtra.visible          = true;
                this._labelExtraInfo.text   = Lang.getUnitCategoryName(Helpers.getExisted(unit.loadUnitCategory)) ?? CommonConstants.ErrorTextForUndefined;
            }
        }
    }

    type DataForDamageRenderer = {
        gameConfig      : GameConfig;
        index           : number;
        attackUnitType  : number;
        playerIndex?    : number;
        targetUnitType? : number;
        targetTileType? : TileType;
    };
    class DamageRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForDamageRenderer> {
        private readonly _group!                : eui.Group;
        private readonly _imgBg!                : TwnsUiImage.UiImage;
        private readonly _conView!              : eui.Group;
        private readonly _unitView              = new WarMap.WarMapUnitView();
        private readonly _tileView!             : TwnsUiImage.UiImage;
        private readonly _labelPrimaryAttack!   : TwnsUiLabel.UiLabel;
        private readonly _labelSecondaryAttack! : TwnsUiLabel.UiLabel;
        private readonly _labelPrimaryDefend!   : TwnsUiLabel.UiLabel;
        private readonly _labelSecondaryDefend! : TwnsUiLabel.UiLabel;

        protected _onOpened(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.UnitAnimationTick,       callback: this._onNotifyUnitAnimationTick },
                { type: NotifyType.UnitStateIndicatorTick,  callback: this._onNotifyUnitStateIndicatorTick },
            ]);

            this._conView.addChild(this._unitView);
        }

        private _onNotifyUnitAnimationTick(): void {
            if (this.data) {
                this._unitView.updateOnAnimationTick(Timer.getUnitAnimationTickCount());
            }
        }

        private _onNotifyUnitStateIndicatorTick(): void {
            if (this.data) {
                this._unitView.updateOnStateIndicatorTick();
            }
        }

        protected _onDataChanged(): void {
            this._updateView();
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Functions for view.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _updateView(): void {
            const data              = this._getData();
            this._imgBg.visible     = data.index % 2 === 1;

            const gameConfig        = data.gameConfig;
            const attackUnitType    = data.attackUnitType;
            const targetUnitType    = data.targetUnitType;
            if (targetUnitType != null) {
                this._unitView.visible = true;
                this._tileView.visible = false;
                this._unitView.update({
                    gameConfig,
                    gridIndex       : { x: 0, y: 0 },
                    unitType        : targetUnitType,
                    playerIndex     : data.playerIndex,
                    actionState     : Types.UnitActionState.Idle,
                }, Timer.getUnitAnimationTickCount());

                const attackCfg                 = Helpers.getExisted(gameConfig.getDamageChartCfgs(attackUnitType));
                const targetArmorType           = Helpers.getExisted(gameConfig.getUnitTemplateCfg(targetUnitType)?.armorType);
                const primaryAttackDamage       = attackCfg[targetArmorType][Types.WeaponType.Primary].damage;
                const secondaryAttackDamage     = attackCfg[targetArmorType][Types.WeaponType.Secondary].damage;
                this._labelPrimaryAttack.text   = primaryAttackDamage == null ? `--` : `${primaryAttackDamage}`;
                this._labelSecondaryAttack.text = secondaryAttackDamage == null ? `--` : `${secondaryAttackDamage}`;

                const defendCfg                 = Helpers.getExisted(gameConfig.getDamageChartCfgs(targetUnitType));
                const attackerArmorType         = Helpers.getExisted(gameConfig.getUnitTemplateCfg(attackUnitType)?.armorType);
                const primaryDefendDamage       = defendCfg[attackerArmorType][Types.WeaponType.Primary].damage;
                const secondaryDefendDamage     = defendCfg[attackerArmorType][Types.WeaponType.Secondary].damage;
                this._labelPrimaryDefend.text   = primaryDefendDamage == null ? `--` : `${primaryDefendDamage}`;
                this._labelSecondaryDefend.text = secondaryDefendDamage == null ? `--` : `${secondaryDefendDamage}`;

            } else {
                this._unitView.visible = false;
                this._tileView.visible = true;

                const targetTileType            = Helpers.getExisted(data.targetTileType);
                const attackCfg                 = Helpers.getExisted(gameConfig.getDamageChartCfgs(attackUnitType));
                const targetCfg                 = Helpers.getExisted(gameConfig.getTileTemplateCfgByType(targetTileType));
                const targetArmorType           = Helpers.getExisted(targetCfg.armorType);
                const primaryAttackDamage       = attackCfg[targetArmorType][Types.WeaponType.Primary].damage;
                const secondaryAttackDamage     = attackCfg[targetArmorType][Types.WeaponType.Secondary].damage;
                this._tileView.source           = Common.CommonModel.getCachedTileObjectImageSource({
                    version     : User.UserModel.getSelfSettingsTextureVersion(),
                    themeType   : Types.TileThemeType.Clear,
                    skinId      : CommonConstants.UnitAndTileNeutralSkinId,
                    objectType  : Config.ConfigManager.getTileObjectTypeByTileType(targetTileType),
                    isDark      : false,
                    shapeId     : 0,
                    tickCount   : Timer.getTileAnimationTickCount(),
                });
                this._labelPrimaryAttack.text   = primaryAttackDamage == null ? `--` : `${primaryAttackDamage}`;
                this._labelSecondaryAttack.text = secondaryAttackDamage == null ? `--` : `${secondaryAttackDamage}`;
                this._labelPrimaryDefend.text   = `--`;
                this._labelSecondaryDefend.text = `--`;
            }
        }
    }
}

// export default TwnsCommonDamageChartPanel;
