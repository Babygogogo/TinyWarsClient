
// import CommonModel                  from "../../common/model/CommonModel";
// import TwnsCommonConfirmPanel       from "../../common/view/CommonConfirmPanel";
// import TwnsCommonDamageChartPanel   from "../../common/view/CommonDamageChartPanel";
// import TwnsCommonInputPanel         from "../../common/view/CommonInputPanel";
// import CommonConstants              from "../../tools/helpers/CommonConstants";
// import ConfigManager                from "../../tools/helpers/ConfigManager";
// import FloatText                    from "../../tools/helpers/FloatText";
// import Helpers                      from "../../tools/helpers/Helpers";
// import SoundManager                 from "../../tools/helpers/SoundManager";
// import Timer                        from "../../tools/helpers/Timer";
// import Types                        from "../../tools/helpers/Types";
// import Lang                         from "../../tools/lang/Lang";
// import TwnsLangTextType             from "../../tools/lang/LangTextType";
// import TwnsNotifyType               from "../../tools/notify/NotifyType";
// import TwnsUiButton                 from "../../tools/ui/UiButton";
// import TwnsUiImage                  from "../../tools/ui/UiImage";
// import TwnsUiLabel                  from "../../tools/ui/UiLabel";
// import TwnsUiListItemRenderer       from "../../tools/ui/UiListItemRenderer";
// import TwnsUiPanel                  from "../../tools/ui/UiPanel";
// import TwnsUiScrollList             from "../../tools/ui/UiScrollList";
// import WarCommonHelpers             from "../../tools/warHelpers/WarCommonHelpers";
// import UserModel                    from "../../user/model/UserModel";
// import TwnsWarMapUnitView           from "../../warMap/view/WarMapUnitView";
// import TwnsBwUnit                   from "../model/BwUnit";
// import TwnsBwWar                    from "../model/BwWar";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace TwnsBwUnitDetailPanel {
    import NotifyType               = TwnsNotifyType.NotifyType;
    import LangTextType             = TwnsLangTextType.LangTextType;
    import CommonDamageChartPanel   = TwnsCommonDamageChartPanel.CommonDamageChartPanel;
    import UnitType                 = Types.UnitType;
    import TileType                 = Types.TileType;
    import BwUnit                   = TwnsBwUnit.BwUnit;

    // eslint-disable-next-line no-shadow
    enum UnitInfoType {
        Hp,
        ProductionCost,
        Movement,
        Fuel,
        Promotion,
        AttackRange,
        Vision,
        PrimaryWeaponAmmo,
        FlareAmmo,
        BuildMaterial,
        ProduceMaterial,
        ActionState,
        IsDiving,
        HasLoadedCo,
        LoadUnit,
        AiMode,
    }

    type OpenData = {
        unit: BwUnit;
    };
    export class BwUnitDetailPanel extends TwnsUiPanel.UiPanel<OpenData> {
        protected readonly _LAYER_TYPE   = Types.LayerType.Hud0;
        protected readonly _IS_EXCLUSIVE = false;

        private static _instance: BwUnitDetailPanel;

        private readonly _imgMask!              : TwnsUiImage.UiImage;
        private readonly _group!                : eui.Group;
        private readonly _conUnitView!          : eui.Group;
        private readonly _labelName!            : TwnsUiLabel.UiLabel;
        private readonly _labelName1!           : TwnsUiLabel.UiLabel;
        private readonly _btnUnitsInfo!         : TwnsUiButton.UiButton;
        private readonly _btnClose!             : TwnsUiButton.UiButton;

        private readonly _listInfo!             : TwnsUiScrollList.UiScrollList<DataForInfoRenderer>;
        private readonly _listDamageChart!      : TwnsUiScrollList.UiScrollList<DataForDamageRenderer>;
        private readonly _labelDamageChart!     : TwnsUiLabel.UiLabel;
        private readonly _labelOffense!         : TwnsUiLabel.UiLabel;
        private readonly _labelDefense!         : TwnsUiLabel.UiLabel;
        private readonly _labelMain1!           : TwnsUiLabel.UiLabel;
        private readonly _labelSub1!            : TwnsUiLabel.UiLabel;
        private readonly _labelMain2!           : TwnsUiLabel.UiLabel;
        private readonly _labelSub2!            : TwnsUiLabel.UiLabel;

        private readonly _unitView              = new TwnsWarMapUnitView.WarMapUnitView();

        public static show(openData: OpenData): void {
            if (!BwUnitDetailPanel._instance) {
                BwUnitDetailPanel._instance = new BwUnitDetailPanel();
            }
            BwUnitDetailPanel._instance.open(openData);
        }
        public static async hide(): Promise<void> {
            if (BwUnitDetailPanel._instance) {
                await BwUnitDetailPanel._instance.close();
            }
        }
        public static getIsOpening(): boolean {
            const instance = BwUnitDetailPanel._instance;
            return instance ? instance.getIsOpening() : false;
        }

        public constructor() {
            super();

            this._setIsTouchMaskEnabled();
            this._setIsCloseOnTouchedMask();
            this.skinName = `resource/skins/baseWar/BwUnitDetailPanel.exml`;
        }

        protected _onOpened(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,             callback: this._onNotifyLanguageChanged },
                { type: NotifyType.UnitAnimationTick,           callback: this._onNotifyUnitAnimationTick },
                { type: NotifyType.UnitStateIndicatorTick,      callback: this._onNotifyUnitStateIndicatorTick },
                { type: NotifyType.BwActionPlannerStateSet,     callback: this._onNotifyBwPlannerStateChanged },
            ]);
            this._setUiListenerArray([
                { ui: this._btnUnitsInfo,   callback: this._onTouchedBtnUnitsInfo },
                { ui: this._btnClose,       callback: this.close },
            ]);
            this._listDamageChart.setItemRenderer(DamageRenderer);
            this._listInfo.setItemRenderer(InfoRenderer);
            this._conUnitView.addChild(this._unitView);

            this._showOpenAnimation();

            this._updateView();
        }
        protected async _onClosed(): Promise<void> {
            await this._showCloseAnimation();
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

        private _onTouchedBtnUnitsInfo(): void {
            this.close();
            CommonDamageChartPanel.show();
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Functions for view.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _updateView(): void {
            this._updateComponentsForLanguage();
            this._updateUnitViewAndLabelName();
            this._updateListDamageChart();
            this._updateListInfo();
        }

        private _updateComponentsForLanguage(): void {
            this._btnUnitsInfo.label        = Lang.getText(LangTextType.B0440);
            this._btnClose.label            = Lang.getText(LangTextType.B0204);
            this._labelDamageChart.text     = Lang.getText(LangTextType.B0334);
            this._labelOffense.text         = Lang.getText(LangTextType.B0694);
            this._labelDefense.text         = Lang.getText(LangTextType.B0695);
            this._labelMain1.text           = Lang.getText(LangTextType.B0692);
            this._labelSub1.text            = Lang.getText(LangTextType.B0693);
            this._labelMain2.text           = Lang.getText(LangTextType.B0692);
            this._labelSub2.text            = Lang.getText(LangTextType.B0693);
        }

        private _updateUnitViewAndLabelName(): void {
            const unit              = this._getOpenData().unit;
            const unitType          = unit.getUnitType();
            this._labelName.text    = Lang.getUnitName(unitType) ?? CommonConstants.ErrorTextForUndefined;
            this._labelName1.text   = Lang.getUnitName(unitType, Lang.getCurrentLanguageType() === Types.LanguageType.Chinese ? Types.LanguageType.English : Types.LanguageType.Chinese) ?? CommonConstants.ErrorTextForUndefined;
            this._unitView.update({
                gridIndex       : { x: 0, y: 0},
                skinId          : unit.getSkinId(),
                unitType        : unit.getUnitType(),
                actionState     : unit.getActionState(),
            }, Timer.getUnitAnimationTickCount());
        }

        private _updateListInfo(): void {
            const unit      = this._getOpenData().unit;
            const war       = unit.getWar();
            const dataArray : DataForInfoRenderer[] = Helpers.getNonNullElements([
                this._createInfoHp(war, unit),
                this._createInfoProductionCost(war, unit),
                this._createInfoMovement(war, unit),
                this._createInfoFuel(war, unit),
                this._createInfoPromotion(war, unit),
                this._createInfoAttackRange(war, unit),
                this._createInfoVision(war, unit),
                this._createInfoPrimaryWeaponAmmo(war, unit),
                this._createInfoBuildMaterial(war, unit),
                this._createInfoProduceMaterial(war, unit),
                this._createInfoFlareAmmo(war, unit),
                this._createInfoActionState(war, unit),
                this._createInfoDiving(war, unit),
                this._createInfoHasLoadedCo(war, unit),
                this._createInfoLoadUnit(war, unit),
                this._createInfoAiMode(war, unit),
            ]);
            let index = 0;
            for (const data of dataArray) {
                data.index = index++;
            }

            this._listInfo.bindData(dataArray);
        }

        private _createInfoHp(war: TwnsBwWar.BwWar, unit: BwUnit): DataForInfoRenderer {
            return {
                index       : 0,
                infoType    : UnitInfoType.Hp,
                war,
                unit,
            };
        }
        private _createInfoProductionCost(war: TwnsBwWar.BwWar, unit: BwUnit): DataForInfoRenderer {
            return {
                index       : 0,
                infoType    : UnitInfoType.ProductionCost,
                war,
                unit,
            };
        }
        private _createInfoMovement(war: TwnsBwWar.BwWar, unit: BwUnit): DataForInfoRenderer {
            return {
                index       : 0,
                infoType    : UnitInfoType.Movement,
                war,
                unit,
            };
        }
        private _createInfoFuel(war: TwnsBwWar.BwWar, unit: BwUnit): DataForInfoRenderer {
            return {
                index       : 0,
                infoType    : UnitInfoType.Fuel,
                war,
                unit,
            };
        }
        private _createInfoPromotion(war: TwnsBwWar.BwWar, unit: BwUnit): DataForInfoRenderer {
            return {
                index       : 0,
                infoType    : UnitInfoType.Promotion,
                war,
                unit,
            };
        }
        private _createInfoAttackRange(war: TwnsBwWar.BwWar, unit: BwUnit): DataForInfoRenderer | null {
            return unit.getMinAttackRange() == null
                ? null
                : {
                    index       : 0,
                    infoType    : UnitInfoType.AttackRange,
                    war,
                    unit,
                };
        }
        private _createInfoVision(war: TwnsBwWar.BwWar, unit: BwUnit): DataForInfoRenderer {
            return {
                index       : 0,
                infoType    : UnitInfoType.Vision,
                war,
                unit,
            };
        }
        private _createInfoPrimaryWeaponAmmo(war: TwnsBwWar.BwWar, unit: BwUnit): DataForInfoRenderer | null {
            return unit.getPrimaryWeaponMaxAmmo() == null
                ? null
                : {
                    index       : 0,
                    infoType    : UnitInfoType.PrimaryWeaponAmmo,
                    war,
                    unit,
                };
        }
        private _createInfoBuildMaterial(war: TwnsBwWar.BwWar, unit: BwUnit): DataForInfoRenderer | null {
            return unit.getMaxBuildMaterial() == null
                ? null
                : {
                    index       : 0,
                    infoType    : UnitInfoType.BuildMaterial,
                    war,
                    unit,
                };
        }
        private _createInfoProduceMaterial(war: TwnsBwWar.BwWar, unit: BwUnit): DataForInfoRenderer | null {
            return unit.getMaxProduceMaterial() == null
                ? null
                : {
                    index       : 0,
                    infoType    : UnitInfoType.ProduceMaterial,
                    war,
                    unit,
                };
        }
        private _createInfoFlareAmmo(war: TwnsBwWar.BwWar, unit: BwUnit): DataForInfoRenderer | null {
            return unit.getFlareMaxAmmo() == null
                ? null
                : {
                    index       : 0,
                    infoType    : UnitInfoType.FlareAmmo,
                    war,
                    unit,
                };
        }
        private _createInfoActionState(war: TwnsBwWar.BwWar, unit: BwUnit): DataForInfoRenderer {
            return {
                index       : 0,
                infoType    : UnitInfoType.ActionState,
                war,
                unit,
            };
        }
        private _createInfoDiving(war: TwnsBwWar.BwWar, unit: BwUnit): DataForInfoRenderer | null {
            return !unit.checkIsDiver()
                ? null
                : {
                    index       : 0,
                    infoType    : UnitInfoType.IsDiving,
                    war,
                    unit,
                };
        }
        private _createInfoHasLoadedCo(war: TwnsBwWar.BwWar, unit: BwUnit): DataForInfoRenderer | null {
            return {
                index       : 0,
                infoType    : UnitInfoType.HasLoadedCo,
                war,
                unit,
            };
        }
        private _createInfoLoadUnit(war: TwnsBwWar.BwWar, unit: BwUnit): DataForInfoRenderer | null {
            return unit.getLoadUnitCategory() == null
                ? null
                : {
                    index       : 0,
                    infoType    : UnitInfoType.LoadUnit,
                    war,
                    unit,
                };
        }
        private _createInfoAiMode(war: TwnsBwWar.BwWar, unit: BwUnit): DataForInfoRenderer | null {
            return ((war.getWarType() !== Types.WarType.Me) && (unit.getPlayer().getUserId() != null))
                ? null
                : {
                    index       : 0,
                    infoType    : UnitInfoType.AiMode,
                    war,
                    unit,
                };
        }

        private _updateListDamageChart(): void {
            this._listDamageChart.bindData(this._createDataForListDamageChart());
        }

        private _createDataForListDamageChart(): DataForDamageRenderer[] {
            const unit              = this._getOpenData().unit;
            const configVersion     = unit.getConfigVersion();
            const attackUnitType    = unit.getUnitType();
            const playerIndex       = unit.getPlayerIndex();

            const dataList  : DataForDamageRenderer[] = [];
            let index       = 0;
            for (const targetUnitType of ConfigManager.getUnitTypesByCategory(configVersion, Types.UnitCategory.All)) {
                dataList.push({
                    configVersion,
                    index,
                    attackUnitType,
                    targetUnitType,
                    playerIndex,
                });
                ++index;
            }
            for (const targetTileType of ConfigManager.getTileTypesByCategory(configVersion, Types.TileCategory.Destroyable)) {
                dataList.push({
                    configVersion,
                    index,
                    attackUnitType,
                    targetTileType,
                });
                ++index;
            }

            return dataList.sort(sorterForDataForList);
        }

        private _showOpenAnimation(): void {
            Helpers.resetTween({
                obj         : this._imgMask,
                beginProps  : { alpha: 0 },
                endProps    : { alpha: 1 },
            });
            Helpers.resetTween({
                obj         : this._group,
                beginProps  : { alpha: 0, verticalCenter: 40 },
                endProps    : { alpha: 1, verticalCenter: 0 },
            });
        }
        private _showCloseAnimation(): Promise<void> {
            return new Promise<void>((resolve) => {
                Helpers.resetTween({
                    obj         : this._imgMask,
                    beginProps  : { alpha: 1 },
                    endProps    : { alpha: 0 },
                });
                Helpers.resetTween({
                    obj         : this._group,
                    beginProps  : { alpha: 1, verticalCenter: 0 },
                    endProps    : { alpha: 0, verticalCenter: 40 },
                    callback    : resolve,
                });
            });
        }
    }

    function sorterForDataForList(a: DataForDamageRenderer, b: DataForDamageRenderer): number {
        return a.attackUnitType - b.attackUnitType;
    }

    type DataForInfoRenderer = {
        index       : number;
        infoType    : UnitInfoType;
        war         : TwnsBwWar.BwWar;
        unit        : BwUnit;
    };
    class InfoRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForInfoRenderer> {
        private readonly _imgBg!            : TwnsUiImage.UiImage;
        private readonly _imgTouchMask!     : TwnsUiImage.UiImage;
        private readonly _labelTitle!       : TwnsUiLabel.UiLabel;
        private readonly _labelValue!       : TwnsUiLabel.UiLabel;
        private readonly _groupExtra!       : eui.Group;
        private readonly _labelExtraInfo!   : TwnsUiLabel.UiLabel;
        private readonly _imgModify!        : TwnsUiImage.UiImage;

        protected _onOpened(): void {
            this._setUiListenerArray([
                { ui: this._imgTouchMask,           callback: this._onTouchedImgTouchMask },
                { ui: this._labelValue,             callback: this._onTouchedLabelValue },
            ]);
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged, callback: this._onNotifyLanguageChanged },
            ]);
            this._setShortSfxCode(Types.ShortSfxCode.None);

            this._imgTouchMask.touchEnabled = true;
            this._labelValue.touchEnabled   = true;
        }

        protected _onDataChanged(): void {
            this._updateView();
        }

        private _onTouchedImgTouchMask(): void {
            const infoType = this._getData().infoType;
            if (infoType === UnitInfoType.ActionState) {
                this._modifyAsActionState();
            } else if (infoType === UnitInfoType.AttackRange) {
                this._modifyAsAttackRange();
            } else if (infoType === UnitInfoType.BuildMaterial) {
                this._modifyAsBuildMaterial();
            } else if (infoType === UnitInfoType.FlareAmmo) {
                this._modifyAsFlareAmmo();
            } else if (infoType === UnitInfoType.Fuel) {
                this._modifyAsFuel();
            } else if (infoType === UnitInfoType.HasLoadedCo) {
                this._modifyAsHasLoadedCo();
            } else if (infoType === UnitInfoType.Hp) {
                this._modifyAsHp();
            } else if (infoType === UnitInfoType.IsDiving) {
                this._modifyAsIsDiving();
            } else if (infoType === UnitInfoType.Movement) {
                this._modifyAsMovement();
            } else if (infoType === UnitInfoType.PrimaryWeaponAmmo) {
                this._modifyAsPrimaryWeaponAmmo();
            } else if (infoType === UnitInfoType.ProduceMaterial) {
                this._modifyAsProduceMaterial();
            } else if (infoType === UnitInfoType.ProductionCost) {
                this._modifyAsProductionCost();
            } else if (infoType === UnitInfoType.Promotion) {
                this._modifyAsPromotion();
            } else if (infoType === UnitInfoType.Vision) {
                this._modifyAsVision();
            } else if (infoType === UnitInfoType.LoadUnit) {
                this._modifyAsLoadUnit();
            } else if (infoType === UnitInfoType.AiMode) {
                this._modifyAsAiMode();
            } else {
                throw Helpers.newError(`Invalid infoType: ${infoType}`);
            }
        }
        private _onTouchedLabelValue(): void {
            const infoType = this._getData().infoType;
            if (infoType === UnitInfoType.AiMode) {
                this._onTouchedLabelAsAiMode();
            } else {
                // nothing to do
            }
        }

        private _onNotifyLanguageChanged(): void {
            this._updateView();
        }

        private _updateView(): void {
            const data          = this._getData();
            this._imgBg.visible = data.index % 2 === 0;

            const infoType = data.infoType;
            if (infoType === UnitInfoType.ActionState) {
                this._updateViewAsActionState();
            } else if (infoType === UnitInfoType.AttackRange) {
                this._updateViewAsAttackRange();
            } else if (infoType === UnitInfoType.BuildMaterial) {
                this._updateViewAsBuildMaterial();
            } else if (infoType === UnitInfoType.FlareAmmo) {
                this._updateViewAsFlareAmmo();
            } else if (infoType === UnitInfoType.Fuel) {
                this._updateViewAsFuel();
            } else if (infoType === UnitInfoType.HasLoadedCo) {
                this._updateViewAsHasLoadedCo();
            } else if (infoType === UnitInfoType.Hp) {
                this._updateViewAsHp();
            } else if (infoType === UnitInfoType.IsDiving) {
                this._updateViewAsIsDiving();
            } else if (infoType === UnitInfoType.Movement) {
                this._updateViewAsMovement();
            } else if (infoType === UnitInfoType.PrimaryWeaponAmmo) {
                this._updateViewAsPrimaryWeaponAmmo();
            } else if (infoType === UnitInfoType.ProduceMaterial) {
                this._updateViewAsProduceMaterial();
            } else if (infoType === UnitInfoType.ProductionCost) {
                this._updateViewAsProductionCost();
            } else if (infoType === UnitInfoType.Promotion) {
                this._updateViewAsPromotion();
            } else if (infoType === UnitInfoType.Vision) {
                this._updateViewAsVision();
            } else if (infoType === UnitInfoType.LoadUnit) {
                this._updateViewAsLoadUnit();
            } else if (infoType === UnitInfoType.AiMode) {
                this._updateViewAsAiMode();
            } else {
                throw Helpers.newError(`Invalid infoType: ${infoType}`);
            }
        }
        private _updateViewAsActionState(): void {
            const data                  = this._getData();
            this._labelTitle.text       = Lang.getText(LangTextType.B0367);
            this._labelValue.text       = Lang.getUnitActionStateText(data.unit.getActionState()) ?? CommonConstants.ErrorTextForUndefined;
            this._groupExtra.visible    = false;
            this._imgModify.visible     = WarCommonHelpers.checkCanCheatInWar(data.war.getWarType());
        }
        private _updateViewAsAttackRange(): void {
            const data                  = this._getData();
            const unit                  = data.unit;
            const minRange              = unit.getMinAttackRange();
            const maxRange              = unit.getFinalMaxAttackRange();
            this._labelTitle.text       = Lang.getText(LangTextType.B0696);
            this._labelValue.text       = minRange == null ? `--` : `${minRange} - ${maxRange}`;
            this._imgModify.visible     = false;

            const groupExtra = this._groupExtra;
            if (!unit.checkCanAttackAfterMove()) {
                groupExtra.visible = false;
            } else {
                groupExtra.visible          = true;
                this._labelExtraInfo.text   = Lang.getText(LangTextType.B0697);
            }
        }
        private _updateViewAsBuildMaterial(): void {
            const data                  = this._getData();
            const unit                  = data.unit;
            const currentValue          = unit.getCurrentBuildMaterial();
            const maxValue              = unit.getMaxBuildMaterial();
            this._labelTitle.text       = Lang.getText(LangTextType.B0347);
            this._labelValue.text       = currentValue == null ? `--` : `${currentValue} / ${maxValue}`;
            this._groupExtra.visible    = false;
            this._imgModify.visible     = (WarCommonHelpers.checkCanCheatInWar(data.war.getWarType())) && (currentValue != null);
        }
        private _updateViewAsFlareAmmo(): void {
            const data                  = this._getData();
            const unit                  = data.unit;
            const currentValue          = unit.getFlareCurrentAmmo();
            const maxValue              = unit.getFlareMaxAmmo();
            this._labelTitle.text       = Lang.getText(LangTextType.B0349);
            this._labelValue.text       = currentValue == null ? `--` : `${currentValue} / ${maxValue}`;
            this._groupExtra.visible    = false;
            this._imgModify.visible     = (WarCommonHelpers.checkCanCheatInWar(data.war.getWarType())) && (currentValue != null);
        }
        private _updateViewAsFuel(): void {
            const data                  = this._getData();
            const unit                  = data.unit;
            const currentValue          = unit.getCurrentFuel();
            const maxValue              = unit.getMaxFuel();
            this._labelTitle.text       = Lang.getText(LangTextType.B0342);
            this._labelValue.text       = `${currentValue} / ${maxValue}`;
            this._imgModify.visible     = WarCommonHelpers.checkCanCheatInWar(data.war.getWarType());

            const fuelConsumption   = unit.getFuelConsumptionPerTurn();
            const groupExtra        = this._groupExtra;
            if (fuelConsumption == 0) {
                groupExtra.visible = false;
            } else {
                groupExtra.visible          = true;
                this._labelExtraInfo.text   = fuelConsumption < 0 ? `+${-fuelConsumption}` : `-${fuelConsumption}`;
            }
        }
        private _updateViewAsHasLoadedCo(): void {
            const data                  = this._getData();
            this._labelTitle.text       = Lang.getText(LangTextType.B0421);
            this._labelValue.text       = data.unit.getHasLoadedCo() ? Lang.getText(LangTextType.B0012) : Lang.getText(LangTextType.B0013);
            this._groupExtra.visible    = false;
            this._imgModify.visible     = WarCommonHelpers.checkCanCheatInWar(data.war.getWarType());
        }
        private _updateViewAsHp(): void {
            const data                  = this._getData();
            const unit                  = data.unit;
            const currentValue          = unit.getCurrentHp();
            const maxValue              = unit.getMaxHp();
            this._labelTitle.text       = Lang.getText(LangTextType.B0339);
            this._labelValue.text       = `${currentValue} / ${maxValue}`;
            this._groupExtra.visible    = false;
            this._imgModify.visible     = WarCommonHelpers.checkCanCheatInWar(data.war.getWarType());
        }
        private _updateViewAsIsDiving(): void {
            const data                  = this._getData();
            const unit                  = data.unit;
            this._labelTitle.text       = Lang.getText(LangTextType.B0371);
            this._labelValue.text       = unit.getIsDiving() ? Lang.getText(LangTextType.B0012) : Lang.getText(LangTextType.B0013);
            this._groupExtra.visible    = false;
            this._imgModify.visible     = (WarCommonHelpers.checkCanCheatInWar(data.war.getWarType())) && (unit.checkIsDiver());
        }
        private _updateViewAsMovement(): void {
            const data                  = this._getData();
            const unit                  = data.unit;
            const currentValue          = unit.getFinalMoveRange();
            this._labelTitle.text       = Lang.getText(LangTextType.B0340);
            this._labelValue.text       = `${currentValue}`;
            this._groupExtra.visible    = true;
            this._labelExtraInfo.text   = Lang.getMoveTypeName(unit.getMoveType()) ?? CommonConstants.ErrorTextForUndefined;
            this._imgModify.visible     = false;
        }
        private _updateViewAsPrimaryWeaponAmmo(): void {
            const data                  = this._getData();
            const unit                  = data.unit;
            const currentValue          = unit.getPrimaryWeaponCurrentAmmo();
            const maxValue              = unit.getPrimaryWeaponMaxAmmo();
            this._labelTitle.text       = Lang.getText(LangTextType.B0350);
            this._labelValue.text       = currentValue == null ? `--` : `${currentValue} / ${maxValue}`;
            this._groupExtra.visible    = false;
            this._imgModify.visible     = (WarCommonHelpers.checkCanCheatInWar(data.war.getWarType())) && (currentValue != null);
        }
        private _updateViewAsProduceMaterial(): void {
            const data                  = this._getData();
            const unit                  = data.unit;
            const currentValue          = unit.getCurrentProduceMaterial();
            const maxValue              = unit.getMaxProduceMaterial();
            this._labelTitle.text       = Lang.getText(LangTextType.B0348);
            this._labelValue.text       = currentValue == null ? `--` : `${currentValue} / ${maxValue}`;
            this._imgModify.visible     = (WarCommonHelpers.checkCanCheatInWar(data.war.getWarType())) && (currentValue != null);

            const groupExtra = this._groupExtra;
            if (currentValue == null) {
                groupExtra.visible = false;
            } else {
                groupExtra.visible          = true;
                this._labelExtraInfo.text   = Lang.getUnitName(Helpers.getExisted(unit.getProduceUnitType())) ?? CommonConstants.ErrorTextForUndefined;
            }
        }
        private _updateViewAsProductionCost(): void {
            const data                  = this._getData();
            this._labelTitle.text       = Lang.getText(LangTextType.B0341);
            this._labelValue.text       = `${data.unit.getProductionFinalCost()}`;
            this._groupExtra.visible    = false;
            this._imgModify.visible     = false;
        }
        private _updateViewAsPromotion(): void {
            const data                  = this._getData();
            const unit                  = data.unit;
            const currentValue          = unit.getCurrentPromotion();
            const maxValue              = unit.getMaxPromotion();
            this._labelTitle.text       = Lang.getText(LangTextType.B0370);
            this._labelValue.text       = `${currentValue} / ${maxValue}`;
            this._groupExtra.visible    = false;
            this._imgModify.visible     = WarCommonHelpers.checkCanCheatInWar(data.war.getWarType());
        }
        private _updateViewAsVision(): void {
            const data                  = this._getData();
            const unit                  = data.unit;
            const currentValue          = unit.getVisionRangeForPlayer(unit.getPlayerIndex(), unit.getGridIndex());
            this._labelTitle.text       = Lang.getText(LangTextType.B0354);
            this._labelValue.text       = `${currentValue}`;
            this._groupExtra.visible    = false;
            this._imgModify.visible     = false;
        }
        private _updateViewAsLoadUnit(): void {
            this._labelTitle.text   = Lang.getText(LangTextType.B0698);
            this._imgModify.visible = false;

            const data          = this._getData();
            const unit          = data.unit;
            const maxValue      = unit.getMaxLoadUnitsCount();
            const labelValue    = this._labelValue;
            const groupExtra    = this._groupExtra;
            if (maxValue == null) {
                labelValue.text     = `--`;
                groupExtra.visible  = false;
            } else {
                const war                   = data.war;
                const canShowValue          = (!war.getFogMap().checkHasFogCurrently()) || (war.getPlayerManager().getAliveWatcherTeamIndexesForSelf().has(unit.getTeamIndex()));
                labelValue.text             = `${canShowValue ? unit.getLoadedUnitsCount() : `??`} / ${maxValue}`;
                groupExtra.visible          = true;
                this._labelExtraInfo.text   = Lang.getUnitCategoryName(Helpers.getExisted(unit.getLoadUnitCategory())) ?? CommonConstants.ErrorTextForUndefined;
            }
        }
        private _updateViewAsAiMode(): void {
            const data                  = this._getData();
            this._labelTitle.text       = Lang.getText(LangTextType.B0720);
            this._labelValue.text       = Lang.getUnitAiModeName(data.unit.getAiMode()) ?? CommonConstants.ErrorTextForUndefined;
            this._imgModify.visible     = WarCommonHelpers.checkCanCheatInWar(data.war.getWarType());
            this._groupExtra.visible    = false;
        }

        private _modifyAsActionState(): void {
            const data = this._getData();
            if (!WarCommonHelpers.checkCanCheatInWar(data.war.getWarType())) {
                return;
            }

            const unit      = data.unit;
            const state     = unit.getActionState();
            TwnsCommonConfirmPanel.CommonConfirmPanel.show({
                title       : Lang.getText(LangTextType.B0349),
                content     : Lang.getText(LangTextType.A0113),
                callback    : () => {
                    unit.setActionState(state === Types.UnitActionState.Acted ? Types.UnitActionState.Idle : Types.UnitActionState.Acted);
                    unit.updateView();
                    this._updateView();
                }
            });
            SoundManager.playShortSfx(Types.ShortSfxCode.ButtonNeutral01);
        }
        private _modifyAsAttackRange(): void {
            // nothing to do
        }
        private _modifyAsBuildMaterial(): void {
            const { unit, war } = this._getData();
            const maxValue      = unit.getMaxBuildMaterial();
            if (!WarCommonHelpers.checkCanCheatInWar(war.getWarType()) || (maxValue == null)) {
                return;
            }

            const currValue = unit.getCurrentBuildMaterial();
            const minValue  = 0;
            TwnsCommonInputPanel.CommonInputPanel.show({
                title           : Lang.getText(LangTextType.B0347),
                currentValue    : "" + currValue,
                maxChars        : 2,
                charRestrict    : "0-9",
                tips            : `${Lang.getText(LangTextType.B0319)}: [${minValue}, ${maxValue}]`,
                callback        : panel => {
                    const text  = panel.getInputText();
                    const value = text ? Number(text) : NaN;
                    if ((isNaN(value)) || (value > maxValue) || (value < minValue)) {
                        FloatText.show(Lang.getText(LangTextType.A0098));
                    } else {
                        unit.setCurrentBuildMaterial(value);
                        unit.updateView();
                        this._updateView();
                    }
                },
            });
            SoundManager.playShortSfx(Types.ShortSfxCode.ButtonNeutral01);
        }
        private _modifyAsFlareAmmo(): void {
            const { unit, war } = this._getData();
            const maxValue      = unit.getFlareMaxAmmo();
            if (!WarCommonHelpers.checkCanCheatInWar(war.getWarType()) || (maxValue == null)) {
                return;
            }

            const currValue     = unit.getFlareCurrentAmmo();
            const minValue      = 0;
            TwnsCommonInputPanel.CommonInputPanel.show({
                title           : Lang.getText(LangTextType.B0349),
                currentValue    : "" + currValue,
                maxChars        : 2,
                charRestrict    : "0-9",
                tips            : `${Lang.getText(LangTextType.B0319)}: [${minValue}, ${maxValue}]`,
                callback        : panel => {
                    const text  = panel.getInputText();
                    const value = text ? Number(text) : NaN;
                    if ((isNaN(value)) || (value > maxValue) || (value < minValue)) {
                        FloatText.show(Lang.getText(LangTextType.A0098));
                    } else {
                        unit.setFlareCurrentAmmo(value);
                        unit.updateView();
                        this._updateView();
                    }
                },
            });
            SoundManager.playShortSfx(Types.ShortSfxCode.ButtonNeutral01);
        }
        private _modifyAsFuel(): void {
            const data = this._getData();
            if (!WarCommonHelpers.checkCanCheatInWar(data.war.getWarType())) {
                return;
            }

            const unit      = data.unit;
            const currValue = unit.getCurrentFuel();
            const maxValue  = unit.getMaxFuel();
            const minValue  = 0;
            TwnsCommonInputPanel.CommonInputPanel.show({
                title           : Lang.getText(LangTextType.B0342),
                currentValue    : "" + currValue,
                maxChars        : 2,
                charRestrict    : "0-9",
                tips            : `${Lang.getText(LangTextType.B0319)}: [${minValue}, ${maxValue}]`,
                callback        : panel => {
                    const text  = panel.getInputText();
                    const value = text ? Number(text) : NaN;
                    if ((isNaN(value)) || (value > maxValue) || (value < minValue)) {
                        FloatText.show(Lang.getText(LangTextType.A0098));
                    } else {
                        unit.setCurrentFuel(value);
                        unit.updateView();
                        this._updateView();
                    }
                },
            });
            SoundManager.playShortSfx(Types.ShortSfxCode.ButtonNeutral01);
        }
        private _modifyAsHasLoadedCo(): void {
            const data  = this._getData();
            const war   = data.war;
            if (!WarCommonHelpers.checkCanCheatInWar(war.getWarType())) {
                return;
            }

            const unit          = data.unit;
            const hasLoadedCo   = unit.getHasLoadedCo();
            TwnsCommonConfirmPanel.CommonConfirmPanel.show({
                content : Lang.getText(LangTextType.A0243),
                callback: () => {
                    unit.setHasLoadedCo(!hasLoadedCo);
                    unit.updateView();
                    this._updateView();

                    war.getTileMap().getView().updateCoZone();
                },
            });
            SoundManager.playShortSfx(Types.ShortSfxCode.ButtonNeutral01);
        }
        private _modifyAsHp(): void {
            const data = this._getData();
            if (!WarCommonHelpers.checkCanCheatInWar(data.war.getWarType())) {
                return;
            }

            const unit      = data.unit;
            const currValue = unit.getCurrentHp();
            const maxValue  = unit.getMaxHp();
            const minValue  = 1;
            TwnsCommonInputPanel.CommonInputPanel.show({
                title           : Lang.getText(LangTextType.B0339),
                currentValue    : "" + currValue,
                maxChars        : 3,
                charRestrict    : "0-9",
                tips            : `${Lang.getText(LangTextType.B0319)}: [${minValue}, ${maxValue}]`,
                callback        : panel => {
                    const text  = panel.getInputText();
                    const value = text ? Number(text) : NaN;
                    if ((isNaN(value)) || (value > maxValue) || (value < minValue)) {
                        FloatText.show(Lang.getText(LangTextType.A0098));
                    } else {
                        unit.setCurrentHp(value);
                        unit.updateView();
                        this._updateView();
                    }
                },
            });
            SoundManager.playShortSfx(Types.ShortSfxCode.ButtonNeutral01);
        }
        private _modifyAsIsDiving(): void {
            const data = this._getData();
            if (!WarCommonHelpers.checkCanCheatInWar(data.war.getWarType())) {
                return;
            }

            const unit      = data.unit;
            const isDiving  = unit.getIsDiving();
            TwnsCommonConfirmPanel.CommonConfirmPanel.show({
                content     : Lang.getText(LangTextType.A0114),
                callback    : () => {
                    unit.setIsDiving(!isDiving);
                    unit.updateView();
                    this._updateView();
                }
            });
            SoundManager.playShortSfx(Types.ShortSfxCode.ButtonNeutral01);
        }
        private _modifyAsMovement(): void {
            // nothing to do
        }
        private _modifyAsPrimaryWeaponAmmo(): void {
            const data      = this._getData();
            const unit      = data.unit;
            const maxValue  = unit.getPrimaryWeaponMaxAmmo();
            if (!WarCommonHelpers.checkCanCheatInWar(data.war.getWarType()) || (maxValue == null)) {
                return;
            }

            const currValue = unit.getPrimaryWeaponCurrentAmmo();
            const minValue  = 0;
            TwnsCommonInputPanel.CommonInputPanel.show({
                title           : Lang.getText(LangTextType.B0350),
                currentValue    : "" + currValue,
                maxChars        : 2,
                charRestrict    : "0-9",
                tips            : `${Lang.getText(LangTextType.B0319)}: [${minValue}, ${maxValue}]`,
                callback        : panel => {
                    const text  = panel.getInputText();
                    const value = text ? Number(text) : NaN;
                    if ((isNaN(value)) || (value > maxValue) || (value < minValue)) {
                        FloatText.show(Lang.getText(LangTextType.A0098));
                    } else {
                        unit.setPrimaryWeaponCurrentAmmo(value);
                        unit.updateView();
                        this._updateView();
                    }
                },
            });
            SoundManager.playShortSfx(Types.ShortSfxCode.ButtonNeutral01);
        }
        private _modifyAsProduceMaterial(): void {
            const data      = this._getData();
            const unit      = data.unit;
            const maxValue  = unit.getMaxProduceMaterial();
            if (!WarCommonHelpers.checkCanCheatInWar(data.war.getWarType()) || (maxValue == null)) {
                return;
            }

            const currValue = unit.getCurrentProduceMaterial();
            const minValue  = 0;
            TwnsCommonInputPanel.CommonInputPanel.show({
                title           : Lang.getText(LangTextType.B0348),
                currentValue    : "" + currValue,
                maxChars        : 2,
                charRestrict    : "0-9",
                tips            : `${Lang.getText(LangTextType.B0319)}: [${minValue}, ${maxValue}]`,
                callback        : panel => {
                    const text  = panel.getInputText();
                    const value = text ? Number(text) : NaN;
                    if ((isNaN(value)) || (value > maxValue) || (value < minValue)) {
                        FloatText.show(Lang.getText(LangTextType.A0098));
                    } else {
                        unit.setCurrentProduceMaterial(value);
                        unit.updateView();
                        this._updateView();
                    }
                },
            });
            SoundManager.playShortSfx(Types.ShortSfxCode.ButtonNeutral01);
        }
        private _modifyAsProductionCost(): void {
            // nothing to do
        }
        private _modifyAsPromotion(): void {
            const { unit, war } = this._getData();
            const maxValue      = unit.getMaxPromotion();
            if (!WarCommonHelpers.checkCanCheatInWar(war.getWarType()) || (maxValue == null)) {
                return;
            }

            const currValue = unit.getCurrentPromotion();
            const minValue  = 0;
            TwnsCommonInputPanel.CommonInputPanel.show({
                title           : Lang.getText(LangTextType.B0370),
                currentValue    : "" + currValue,
                maxChars        : 1,
                charRestrict    : "0-9",
                tips            : `${Lang.getText(LangTextType.B0319)}: [${minValue}, ${maxValue}]`,
                callback        : panel => {
                    const text  = panel.getInputText();
                    const value = text ? Number(text) : NaN;
                    if ((isNaN(value)) || (value > maxValue) || (value < minValue)) {
                        FloatText.show(Lang.getText(LangTextType.A0098));
                    } else {
                        unit.setCurrentPromotion(value);
                        unit.updateView();
                        this._updateView();
                    }
                },
            });
            SoundManager.playShortSfx(Types.ShortSfxCode.ButtonNeutral01);
        }
        private _modifyAsVision(): void {
            // nothing to do
        }
        private _modifyAsLoadUnit(): void {
            // nothing to do
        }
        private _modifyAsAiMode(): void {
            const data = this._getData();
            if (!WarCommonHelpers.checkCanCheatInWar(data.war.getWarType())) {
                return;
            }

            const unit      = data.unit;
            const aiMode    = unit.getAiMode();
            if (aiMode === Types.UnitAiMode.NoMove) {
                unit.setAiMode(Types.UnitAiMode.Normal);
            } else if (aiMode === Types.UnitAiMode.Normal) {
                unit.setAiMode(Types.UnitAiMode.WaitUntilCanAttack);
            } else {
                unit.setAiMode(Types.UnitAiMode.NoMove);
            }
            this._updateView();
            SoundManager.playShortSfx(Types.ShortSfxCode.ButtonNeutral01);
            FloatText.show(Lang.getText(LangTextType.B0724));
        }

        private _onTouchedLabelAsAiMode(): void {
            TwnsCommonHelpPanel.CommonHelpPanel.show({
                title   : Lang.getText(LangTextType.B0720),
                content : Lang.getText(LangTextType.R0010),
            });
            SoundManager.playShortSfx(Types.ShortSfxCode.ButtonNeutral01);
        }
    }

    type DataForDamageRenderer = {
        configVersion   : string;
        index           : number;
        attackUnitType  : UnitType;
        playerIndex?    : number;
        targetUnitType? : UnitType;
        targetTileType? : TileType;
    };
    class DamageRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForDamageRenderer> {
        private readonly _group!                : eui.Group;
        private readonly _imgBg!                : TwnsUiImage.UiImage;
        private readonly _conView!              : eui.Group;
        private readonly _unitView              = new TwnsWarMapUnitView.WarMapUnitView();
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
            this._setShortSfxCode(Types.ShortSfxCode.None);

            this._conView.addChild(this._unitView);
        }

        private _onNotifyUnitAnimationTick(): void {
            this._unitView.updateOnAnimationTick(Timer.getUnitAnimationTickCount());
        }

        private _onNotifyUnitStateIndicatorTick(): void {
            this._unitView.updateOnStateIndicatorTick();
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

            const configVersion     = data.configVersion;
            const attackUnitType    = data.attackUnitType;
            const targetUnitType    = data.targetUnitType;
            if (targetUnitType != null) {
                this._unitView.visible = true;
                this._tileView.visible = false;
                this._unitView.update({
                    gridIndex       : { x: 0, y: 0 },
                    unitType        : targetUnitType,
                    playerIndex     : data.playerIndex,
                    actionState     : Types.UnitActionState.Idle,
                }, Timer.getUnitAnimationTickCount());

                const attackCfg                 = ConfigManager.getDamageChartCfgs(configVersion, attackUnitType);
                const targetArmorType           = ConfigManager.getUnitTemplateCfg(configVersion, targetUnitType).armorType;
                const primaryAttackDamage       = attackCfg[targetArmorType][Types.WeaponType.Primary].damage;
                const secondaryAttackDamage     = attackCfg[targetArmorType][Types.WeaponType.Secondary].damage;
                this._labelPrimaryAttack.text   = primaryAttackDamage == null ? `--` : `${primaryAttackDamage}`;
                this._labelSecondaryAttack.text = secondaryAttackDamage == null ? `--` : `${secondaryAttackDamage}`;

                const defendCfg                 = ConfigManager.getDamageChartCfgs(configVersion, targetUnitType);
                const attackerArmorType         = ConfigManager.getUnitTemplateCfg(configVersion, attackUnitType).armorType;
                const primaryDefendDamage       = defendCfg[attackerArmorType][Types.WeaponType.Primary].damage;
                const secondaryDefendDamage     = defendCfg[attackerArmorType][Types.WeaponType.Secondary].damage;
                this._labelPrimaryDefend.text   = primaryDefendDamage == null ? `--` : `${primaryDefendDamage}`;
                this._labelSecondaryDefend.text = secondaryDefendDamage == null ? `--` : `${secondaryDefendDamage}`;

            } else {
                this._unitView.visible = false;
                this._tileView.visible = true;

                const targetTileType            = Helpers.getExisted(data.targetTileType);
                const attackCfg                 = ConfigManager.getDamageChartCfgs(configVersion, attackUnitType);
                const targetCfg                 = ConfigManager.getTileTemplateCfgByType(configVersion, targetTileType);
                const targetArmorType           = Helpers.getExisted(targetCfg.armorType);
                const primaryAttackDamage       = attackCfg[targetArmorType][Types.WeaponType.Primary].damage;
                const secondaryAttackDamage     = attackCfg[targetArmorType][Types.WeaponType.Secondary].damage;
                this._tileView.source           = CommonModel.getCachedTileObjectImageSource({
                    version     : UserModel.getSelfSettingsTextureVersion(),
                    skinId      : CommonConstants.UnitAndTileNeutralSkinId,
                    objectType  : ConfigManager.getTileObjectTypeByTileType(targetTileType),
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

// export default TwnsBwUnitDetailPanel;
