
// import TwnsBwWar                    from "../../baseWar/model/BwWar";
// import TwnsCommonConfirmPanel       from "../../common/view/CommonConfirmPanel";
// import CommonConstants              from "../../tools/helpers/CommonConstants";
// import ConfigManager                from "../../tools/helpers/ConfigManager";
// import FloatText                    from "../../tools/helpers/FloatText";
// import GridIndexHelpers             from "../../tools/helpers/GridIndexHelpers";
// import Helpers                      from "../../tools/helpers/Helpers";
// import Types                        from "../../tools/helpers/Types";
// import Lang                         from "../../tools/lang/Lang";
// import TwnsLangTextType             from "../../tools/lang/LangTextType";
// import Notify                       from "../../tools/notify/Notify";
// import Notify               from "../../tools/notify/NotifyType";
// import ProtoTypes                   from "../../tools/proto/ProtoTypes";
// import TwnsUiButton                 from "../../tools/ui/UiButton";
// import TwnsUiImage                  from "../../tools/ui/UiImage";
// import TwnsUiLabel                  from "../../tools/ui/UiLabel";
// import TwnsUiListItemRenderer       from "../../tools/ui/UiListItemRenderer";
// import TwnsUiPanel                  from "../../tools/ui/UiPanel";
// import TwnsUiScrollList             from "../../tools/ui/UiScrollList";
// import TwnsUiTextInput              from "../../tools/ui/UiTextInput";
// import WarEventHelper               from "../model/WarEventHelper";
// import TwnsWeActionAddUnitListPanel from "./WeActionAddUnitListPanel";
// import TwnsWeActionTypeListPanel    from "./WeActionTypeListPanel";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.WarEvent {
    import NotifyType               = Notify.NotifyType;
    import ColorValue               = Types.ColorValue;
    import IWarEventFullData        = CommonProto.Map.IWarEventFullData;
    import IWarEventAction          = CommonProto.WarEvent.IWarEventAction;
    import FocusEvent               = egret.FocusEvent;
    import LangTextType             = Lang.LangTextType;

    export type OpenDataForWeActionModifyPanel1 = {
        war         : MapEditor.MeWar;
        fullData    : IWarEventFullData;
        action      : IWarEventAction;
    };
    export class WeActionModifyPanel1 extends TwnsUiPanel.UiPanel<OpenDataForWeActionModifyPanel1> {
        private readonly _btnBack!          : TwnsUiButton.UiButton;
        private readonly _btnType!          : TwnsUiButton.UiButton;
        private readonly _btnAddUnit!       : TwnsUiButton.UiButton;
        private readonly _btnClear!         : TwnsUiButton.UiButton;
        private readonly _labelTitle!       : TwnsUiLabel.UiLabel;
        private readonly _labelUnitsCount!  : TwnsUiLabel.UiLabel;
        private readonly _listUnit!         : TwnsUiScrollList.UiScrollList<DataForUnitRenderer>;

        protected _onOpening(): void {
            this._setUiListenerArray([
                { ui: this._btnAddUnit,     callback: this._onTouchedBtnAddUnit },
                { ui: this._btnClear,       callback: this._onTouchedBtnClear },
                { ui: this._btnType,        callback: this._onTouchedBtnType },
                { ui: this._btnBack,        callback: this.close },
            ]);
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,            callback: this._onNotifyLanguageChanged },
                { type: NotifyType.WarEventFullDataChanged,    callback: this._onNotifyWarEventFullDataChanged },
            ]);
            this._setIsTouchMaskEnabled();
            this._setIsCloseOnTouchedMask();

            this._listUnit.setItemRenderer(UnitRenderer);
        }
        protected async _updateOnOpenDataChanged(): Promise<void> {
            this._updateView();
        }
        protected _onClosing(): void {
            // nothing to do
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Event callbacks.
        ////////////////////////////////////////////////////////////////////////////////
        private _onNotifyLanguageChanged(): void {
            this._updateComponentsForLanguage();
        }

        private _onNotifyWarEventFullDataChanged(): void {
            this._updateComponentsForUnits();
        }

        private _onTouchedBtnAddUnit(): void {
            const openData  = this._getOpenData();
            const unitArray = Helpers.getExisted(openData.action.WeaAddUnit?.unitArray);
            if (unitArray.length > CommonConstants.WarEventActionAddUnitMaxCount) {
                FloatText.show(Lang.getText(LangTextType.A0189));
            } else {
                unitArray.push(WarHelpers.WarEventHelpers.getDefaultAddUnitData(openData.war.getGameConfig()));
                Notify.dispatch(NotifyType.WarEventFullDataChanged);
            }
        }

        private _onTouchedBtnClear(): void {
            PanelHelpers.open(PanelHelpers.PanelDict.CommonConfirmPanel, {
                content : Lang.getText(LangTextType.A0190),
                callback: () => {
                    Helpers.getExisted(this._getOpenData().action.WeaAddUnit?.unitArray).length = 0;
                    Notify.dispatch(NotifyType.WarEventFullDataChanged);
                }
            });
        }

        private _onTouchedBtnType(): void {
            const openData = this._getOpenData();
            PanelHelpers.open(PanelHelpers.PanelDict.WeActionTypeListPanel, {
                war         : openData.war,
                fullData    : openData.fullData,
                action      : openData.action,
            });
        }

        ////////////////////////////////////////////////////////////////////////////////
        // View functions.
        ////////////////////////////////////////////////////////////////////////////////
        private _updateView(): void {
            this._updateComponentsForLanguage();

            this._updateComponentsForUnits();
        }

        private _updateComponentsForLanguage(): void {
            this._labelTitle.text   = `${Lang.getText(LangTextType.B0533)} A${this._getOpenData().action.WeaCommonData?.actionId}`;
            this._btnType.label     = Lang.getText(LangTextType.B0516);
            this._btnAddUnit.label  = Lang.getText(LangTextType.B0535);
            this._btnClear.label    = Lang.getText(LangTextType.B0391);
            this._btnBack.label     = Lang.getText(LangTextType.B0146);
        }

        private _updateComponentsForUnits(): void {
            const openData  = this._getOpenData();
            const action    = openData.action;
            const war       = openData.war;
            const dataArray : DataForUnitRenderer[] = [];
            for (const dataForAddUnit of action.WeaAddUnit?.unitArray || []) {
                dataArray.push({
                    war,
                    action,
                    dataForAddUnit,
                });
            }

            this._listUnit.bindData(dataArray);

            const label     = this._labelUnitsCount;
            const maxCount  = CommonConstants.WarEventActionAddUnitMaxCount;
            const currCount = dataArray.length;
            label.text      = `${Lang.getText(LangTextType.B0524)}: ${currCount} / ${maxCount}`;
            label.textColor = ((currCount <= maxCount) && (currCount > 0)) ? ColorValue.White : ColorValue.Red;
        }
    }

    type DataForUnitRenderer = {
        war             : MapEditor.MeWar;
        action          : IWarEventAction;
        dataForAddUnit  : CommonProto.WarEvent.WeaAddUnit.IDataForAddUnit;
    };
    class UnitRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForUnitRenderer> {
        private readonly _btnDelete!                : TwnsUiButton.UiButton;
        private readonly _labelError!               : TwnsUiLabel.UiLabel;

        private readonly _groupCanBeBlockedByUnit!  : eui.Group;
        private readonly _labelCanBeBlockedByUnit!  : TwnsUiLabel.UiLabel;
        private readonly _imgCanBeBlockedByUnit!    : TwnsUiImage.UiImage;

        private readonly _groupNeedMovableTile!     : eui.Group;
        private readonly _labelNeedMovableTile!     : TwnsUiLabel.UiLabel;
        private readonly _imgNeedMovableTile!       : TwnsUiImage.UiImage;

        private readonly _btnAiMode!                : TwnsUiButton.UiButton;
        private readonly _labelAiMode!              : TwnsUiLabel.UiLabel;

        private readonly _labelGridIndex!           : TwnsUiLabel.UiLabel;
        private readonly _inputGridX!               : TwnsUiTextInput.UiTextInput;
        private readonly _inputGridY!               : TwnsUiTextInput.UiTextInput;

        private readonly _labelPlayerIndex!         : TwnsUiLabel.UiLabel;
        private readonly _inputPlayerIndex!         : TwnsUiTextInput.UiTextInput;

        private readonly _btnUnitType!              : TwnsUiButton.UiButton;
        private readonly _labelUnitType!            : TwnsUiLabel.UiLabel;

        private readonly _btnActionState!           : TwnsUiButton.UiButton;
        private readonly _labelActionState!         : TwnsUiLabel.UiLabel;

        private readonly _labelHp!                  : TwnsUiLabel.UiLabel;
        private readonly _inputHp!                  : TwnsUiTextInput.UiTextInput;

        private readonly _labelFuel!                : TwnsUiLabel.UiLabel;
        private readonly _inputFuel!                : TwnsUiTextInput.UiTextInput;

        private readonly _labelPromotion!           : TwnsUiLabel.UiLabel;
        private readonly _inputPromotion!           : TwnsUiTextInput.UiTextInput;

        private readonly _groupHasLoadedCo!         : eui.Group;
        private readonly _labelHasLoadedCo!         : TwnsUiLabel.UiLabel;
        private readonly _imgHasLoadedCo!           : TwnsUiImage.UiImage;

        private readonly _groupPrimaryAmmo!         : eui.Group;
        private readonly _labelPrimaryAmmo!         : TwnsUiLabel.UiLabel;
        private readonly _inputPrimaryAmmo!         : TwnsUiTextInput.UiTextInput;

        private readonly _groupFlareAmmo!           : eui.Group;
        private readonly _labelFlareAmmo!           : TwnsUiLabel.UiLabel;
        private readonly _inputFlareAmmo!           : TwnsUiTextInput.UiTextInput;

        private readonly _groupIsDiving!            : eui.Group;
        private readonly _labelIsDiving!            : TwnsUiLabel.UiLabel;
        private readonly _imgIsDiving!              : TwnsUiImage.UiImage;

        private readonly _groupBuildMaterial!       : eui.Group;
        private readonly _labelBuildMaterial!       : TwnsUiLabel.UiLabel;
        private readonly _inputBuildMaterial!       : TwnsUiTextInput.UiTextInput;

        private readonly _groupProduceMaterial!     : eui.Group;
        private readonly _labelProduceMaterial!     : TwnsUiLabel.UiLabel;
        private readonly _inputProduceMaterial!     : TwnsUiTextInput.UiTextInput;

        protected _onOpened(): void {
            this._setUiListenerArray([
                { ui: this._btnDelete,                  callback: this._onTouchedBtnDelete },
                { ui: this._groupCanBeBlockedByUnit,    callback: this._onTouchedGroupCanBeBlockedByUnit },
                { ui: this._groupNeedMovableTile,       callback: this._onTouchedGroupNeedMovableTile },
                { ui: this._btnAiMode,                  callback: this._onTouchedBtnAiMode },
                { ui: this._groupIsDiving,              callback: this._onTouchedGroupIsDiving },
                { ui: this._groupHasLoadedCo,           callback: this._onTouchedGroupHasLoadedCo },
                { ui: this._btnActionState,             callback: this._onTouchedBtnActionState },
                { ui: this._btnUnitType,                callback: this._onTouchedBtnUnitType },
                { ui: this._inputGridX,                 callback: this._onFocusOutInputGridX,               eventType: FocusEvent.FOCUS_OUT },
                { ui: this._inputGridY,                 callback: this._onFocusOutInputGridY,               eventType: FocusEvent.FOCUS_OUT },
                { ui: this._inputPlayerIndex,           callback: this._onFocusOutInputPlayerIndex,         eventType: FocusEvent.FOCUS_OUT },
                { ui: this._inputHp,                    callback: this._onFocusOutInputHp,                  eventType: FocusEvent.FOCUS_OUT },
                { ui: this._inputFuel,                  callback: this._onFocusOutInputFuel,                eventType: FocusEvent.FOCUS_OUT },
                { ui: this._inputPromotion,             callback: this._onFocusOutInputPromotion,           eventType: FocusEvent.FOCUS_OUT },
                { ui: this._inputPrimaryAmmo,           callback: this._onFocusOutInputPrimaryAmmo,         eventType: FocusEvent.FOCUS_OUT },
                { ui: this._inputFlareAmmo,             callback: this._onFocusOutInputFlareAmmo,           eventType: FocusEvent.FOCUS_OUT },
                { ui: this._inputBuildMaterial,         callback: this._onFocusOutInputBuildMaterial,       eventType: FocusEvent.FOCUS_OUT },
                { ui: this._inputProduceMaterial,       callback: this._onFocusOutInputProduceMaterial,     eventType: FocusEvent.FOCUS_OUT },
            ]);
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged, callback: this._onNotifyLanguageChanged },
            ]);
            this._updateComponentsForLanguage();
        }

        private _onTouchedBtnDelete(): void {
            const data = this._getData();
            PanelHelpers.open(PanelHelpers.PanelDict.CommonConfirmPanel, {
                content : Lang.getText(LangTextType.A0029),
                callback: () => {
                    Helpers.deleteElementFromArray(Helpers.getExisted(data.action.WeaAddUnit?.unitArray), data.dataForAddUnit);
                    Notify.dispatch(NotifyType.WarEventFullDataChanged);
                },
            });
        }
        private _onTouchedGroupCanBeBlockedByUnit(): void {
            const data = this._getData();
            data.dataForAddUnit.canBeBlockedByUnit = !data.dataForAddUnit.canBeBlockedByUnit;
            Notify.dispatch(NotifyType.WarEventFullDataChanged);
        }
        private _onTouchedGroupNeedMovableTile(): void {
            const data                          = this._getData();
            data.dataForAddUnit.needMovableTile = !data.dataForAddUnit.needMovableTile;
            Notify.dispatch(NotifyType.WarEventFullDataChanged);
        }
        private _onTouchedBtnAiMode(): void {
            const unitData  = Helpers.getExisted(this._getData().dataForAddUnit.unitData);
            const aiMode    = unitData.aiMode;
            if (aiMode === Types.UnitAiMode.NoMove) {
                unitData.aiMode = Types.UnitAiMode.Normal;
            } else if ((aiMode === Types.UnitAiMode.Normal) || (aiMode == null)) {
                unitData.aiMode = Types.UnitAiMode.WaitUntilCanAttack;
            } else {
                unitData.aiMode = Types.UnitAiMode.NoMove;
            }
            Notify.dispatch(NotifyType.WarEventFullDataChanged);
        }
        private _onTouchedGroupIsDiving(): void {
            const data              = this._getData();
            const unitData          = Helpers.getExisted(data.dataForAddUnit.unitData);
            unitData.isDiving       = !unitData.isDiving;
            Notify.dispatch(NotifyType.WarEventFullDataChanged);
        }
        private _onTouchedGroupHasLoadedCo(): void {
            const data              = this._getData();
            const unitData          = Helpers.getExisted(data.dataForAddUnit.unitData);
            unitData.hasLoadedCo    = unitData.hasLoadedCo ? null : true;
            Notify.dispatch(NotifyType.WarEventFullDataChanged);
        }
        private _onTouchedBtnActionState(): void {
            const data      = this._getData();
            const unitData  = Helpers.getExisted(data.dataForAddUnit.unitData);
            if (unitData.actionState === Types.UnitActionState.Acted) {
                unitData.actionState = null;
            } else {
                unitData.actionState = Types.UnitActionState.Acted;
            }
            Notify.dispatch(NotifyType.WarEventFullDataChanged);
        }
        private _onTouchedBtnUnitType(): void {
            const data = this._getData();
            PanelHelpers.open(PanelHelpers.PanelDict.WeActionAddUnitListPanel, {
                gameConfig      : data.war.getGameConfig(),
                dataForAddUnit  : data.dataForAddUnit,
            });
        }
        private _onFocusOutInputGridX(): void {
            const data      = this._getData();
            const gridIndex = Helpers.getExisted(GridIndexHelpers.convertGridIndex(data.dataForAddUnit.unitData?.gridIndex));
            const newGridX  = Math.max(0, Math.min(parseInt(this._inputGridX.text) || 0, data.war.getTileMap().getMapSize().width - 1));
            if (newGridX !== gridIndex.x) {
                gridIndex.x = newGridX;
                Notify.dispatch(NotifyType.WarEventFullDataChanged);
            }
        }
        private _onFocusOutInputGridY(): void {
            const data      = this._getData();
            const gridIndex = Helpers.getExisted(GridIndexHelpers.convertGridIndex(data.dataForAddUnit.unitData?.gridIndex));
            const newGridY  = Math.max(0, Math.min(parseInt(this._inputGridY.text) || 0, data.war.getTileMap().getMapSize().height - 1));
            if (newGridY !== gridIndex.y) {
                gridIndex.y = newGridY;
                Notify.dispatch(NotifyType.WarEventFullDataChanged);
            }
        }
        private _onFocusOutInputPlayerIndex(): void {
            const data              = this._getData();
            const unitData          = Helpers.getExisted(data.dataForAddUnit.unitData);
            const newPlayerIndex    = Math.max(
                CommonConstants.PlayerIndex.First,
                Math.min(parseInt(this._inputPlayerIndex.text) || 0, CommonConstants.PlayerIndex.Max)
            );
            if (newPlayerIndex !== unitData.playerIndex) {
                unitData.playerIndex = newPlayerIndex;
                Notify.dispatch(NotifyType.WarEventFullDataChanged);
            }
        }
        private _onFocusOutInputHp(): void {
            const data      = this._getData();
            const unitData  = Helpers.getExisted(data.dataForAddUnit.unitData);
            const maxHp     = Helpers.getExisted(data.war.getGameConfig().getUnitTemplateCfg(Helpers.getExisted(unitData.unitType))?.maxHp);
            const currentHp = unitData.currentHp == null ? maxHp : unitData.currentHp;
            const newHp     = Math.max(0, Math.min(parseInt(this._inputHp.text) || 0, maxHp));
            if (newHp !== currentHp) {
                unitData.currentHp = newHp === maxHp ? null : newHp;
                Notify.dispatch(NotifyType.WarEventFullDataChanged);
            }
        }
        private _onFocusOutInputFuel(): void {
            const data          = this._getData();
            const unitData      = Helpers.getExisted(data.dataForAddUnit.unitData);
            const maxFuel       = Helpers.getExisted(data.war.getGameConfig().getUnitTemplateCfg(Helpers.getExisted(unitData.unitType))?.maxFuel);
            const currentFuel   = unitData.currentFuel == null ? maxFuel : unitData.currentFuel;
            const newFuel       = Math.max(0, Math.min(parseInt(this._inputFuel.text) || 0, maxFuel));
            if (newFuel !== currentFuel) {
                unitData.currentFuel = newFuel === maxFuel ? null : newFuel;
                Notify.dispatch(NotifyType.WarEventFullDataChanged);
            }
        }
        private _onFocusOutInputPromotion(): void {
            const data              = this._getData();
            const unitData          = Helpers.getExisted(data.dataForAddUnit.unitData);
            const maxPromotion      = data.war.getGameConfig().getUnitMaxPromotion();
            const currentPromotion  = unitData.currentPromotion || 0;
            const newPromotion      = Math.max(0, Math.min(parseInt(this._inputPromotion.text) || 0, maxPromotion));
            if (newPromotion !== currentPromotion) {
                unitData.currentPromotion = newPromotion === 0 ? null : newPromotion;
                Notify.dispatch(NotifyType.WarEventFullDataChanged);
            }
        }
        private _onFocusOutInputPrimaryAmmo(): void {
            const data          = this._getData();
            const unitData      = Helpers.getExisted(data.dataForAddUnit.unitData);
            const maxAmmo       = Helpers.getExisted(data.war.getGameConfig().getUnitTemplateCfg(Helpers.getExisted(unitData.unitType))?.primaryWeaponMaxAmmo);
            const currentAmmo   = unitData.primaryWeaponCurrentAmmo == null ? maxAmmo : unitData.primaryWeaponCurrentAmmo;
            const newAmmo       = Math.max(0, Math.min(parseInt(this._inputPrimaryAmmo.text) || 0, maxAmmo));
            if (newAmmo !== currentAmmo) {
                unitData.primaryWeaponCurrentAmmo = newAmmo === maxAmmo ? null : newAmmo;
                Notify.dispatch(NotifyType.WarEventFullDataChanged);
            }
        }
        private _onFocusOutInputFlareAmmo(): void {
            const data          = this._getData();
            const unitData      = Helpers.getExisted(data.dataForAddUnit.unitData);
            const maxAmmo       = Helpers.getExisted(data.war.getGameConfig().getUnitTemplateCfg(Helpers.getExisted(unitData.unitType))?.flareMaxAmmo);
            const currentAmmo   = unitData.flareCurrentAmmo == null ? maxAmmo : unitData.flareCurrentAmmo;
            const newAmmo       = Math.max(0, Math.min(parseInt(this._inputFlareAmmo.text) || 0, maxAmmo));
            if (newAmmo !== currentAmmo) {
                unitData.flareCurrentAmmo = newAmmo === maxAmmo ? null : newAmmo;
                Notify.dispatch(NotifyType.WarEventFullDataChanged);
            }
        }
        private _onFocusOutInputBuildMaterial(): void {
            const data              = this._getData();
            const unitData          = Helpers.getExisted(data.dataForAddUnit.unitData);
            const maxMaterial       = Helpers.getExisted(data.war.getGameConfig().getUnitTemplateCfg(Helpers.getExisted(unitData.unitType))?.maxBuildMaterial);
            const currentMaterial   = unitData.currentBuildMaterial == null ? maxMaterial : unitData.currentBuildMaterial;
            const newMaterial       = Math.max(0, Math.min(parseInt(this._inputBuildMaterial.text) || 0, maxMaterial));
            if (newMaterial !== currentMaterial) {
                unitData.currentBuildMaterial = newMaterial === maxMaterial ? null : newMaterial;
                Notify.dispatch(NotifyType.WarEventFullDataChanged);
            }
        }
        private _onFocusOutInputProduceMaterial(): void {
            const data              = this._getData();
            const unitData          = Helpers.getExisted(data.dataForAddUnit.unitData);
            const maxMaterial       = Helpers.getExisted(data.war.getGameConfig().getUnitTemplateCfg(Helpers.getExisted(unitData.unitType))?.maxProduceMaterial);
            const currentMaterial   = unitData.currentProduceMaterial == null ? maxMaterial : unitData.currentProduceMaterial;
            const newMaterial       = Math.max(0, Math.min(parseInt(this._inputProduceMaterial.text) || 0, maxMaterial));
            if (newMaterial !== currentMaterial) {
                unitData.currentProduceMaterial = newMaterial === maxMaterial ? null : newMaterial;
                Notify.dispatch(NotifyType.WarEventFullDataChanged);
            }
        }

        private _onNotifyLanguageChanged(): void {
            this._updateComponentsForLanguage();

            this._updateComponentsForData();
        }

        protected _onDataChanged(): void {
            this._updateComponentsForData();
        }

        private _updateComponentsForLanguage(): void {
            this._btnDelete.label               = Lang.getText(LangTextType.B0220);
            this._labelCanBeBlockedByUnit.text  = Lang.getText(LangTextType.B0532);
            this._labelNeedMovableTile.text     = Lang.getText(LangTextType.B0534);
            this._btnAiMode.label               = Lang.getText(LangTextType.B0720);
            this._labelIsDiving.text            = Lang.getText(LangTextType.B0371);
            this._labelHasLoadedCo.text         = Lang.getText(LangTextType.B0421);
            this._labelGridIndex.text           = Lang.getText(LangTextType.B0531);
            this._labelPlayerIndex.text         = Lang.getText(LangTextType.B0521);
            this._labelHp.text                  = Lang.getText(LangTextType.B0339);
            this._labelFuel.text                = Lang.getText(LangTextType.B0342);
            this._labelPromotion.text           = Lang.getText(LangTextType.B0370);
            this._labelPrimaryAmmo.text         = Lang.getText(LangTextType.B0350);
            this._labelFlareAmmo.text           = Lang.getText(LangTextType.B0349);
            this._labelBuildMaterial.text       = Lang.getText(LangTextType.B0347);
            this._labelProduceMaterial.text     = Lang.getText(LangTextType.B0348);
            this._btnActionState.label          = Lang.getText(LangTextType.B0526);
            this._btnUnitType.label             = Lang.getText(LangTextType.B0525);
        }
        private _updateComponentsForData(): void {
            this._updateLabelError();
            this._updateComponentsForCanBeBlockedByUnit();
            this._updateComponentsForNeedMovableTile();
            this._updateComponentsForAiMode();
            this._updateComponentsForIsDiving();
            this._updateComponentsForHasLoadedCo();
            this._updateComponentsForActionState();
            this._updateComponentsForGridIndex();
            this._updateComponentsForPlayerIndex();
            this._updateComponentsForUnitType();
            this._updateComponentsForHp();
            this._updateComponentsForFuel();
            this._updateComponentsForPromotion();
            this._updateComponentsForPrimaryAmmo();
            this._updateComponentsForFlareAmmo();
            this._updateComponentsForBuildMaterial();
            this._updateComponentsForProduceMaterial();
        }
        private _updateLabelError(): void {
            const data              = this._getData();
            const label             = this._labelError;
            const dataForAddUnit    = data.dataForAddUnit;
            const errorTips         = getErrorTipsForAddUnit({
                dataForAddUnit,
                war             : data.war,
            });
            label.text      = `${Helpers.getExisted(data.action.WeaAddUnit?.unitArray?.indexOf(dataForAddUnit)) + 1}. ${errorTips || Lang.getText(LangTextType.B0493)}`;
            label.textColor = errorTips ? ColorValue.Red : ColorValue.Green;
        }
        private _updateComponentsForCanBeBlockedByUnit(): void {
            const data                          = this._getData();
            this._imgCanBeBlockedByUnit.visible = (!!data.dataForAddUnit.canBeBlockedByUnit);
        }
        private _updateComponentsForNeedMovableTile(): void {
            const data                          = this._getData();
            this._imgNeedMovableTile.visible    = (!!data.dataForAddUnit.needMovableTile);
        }
        private _updateComponentsForAiMode(): void {
            const data              = this._getData();
            this._labelAiMode.text  = Lang.getUnitAiModeName(data.dataForAddUnit.unitData?.aiMode ?? Types.UnitAiMode.Normal) ?? CommonConstants.ErrorTextForUndefined;
        }
        private _updateComponentsForIsDiving(): void {
            const data      = this._getData();
            const group     = this._groupIsDiving;
            const unitData  = Helpers.getExisted(data.dataForAddUnit.unitData);
            const unitCfg   = data.war.getGameConfig().getUnitTemplateCfg(Helpers.getExisted(unitData.unitType));
            if ((!unitCfg) || (!unitCfg.diveCfgs)) {
                group.visible = false;
            } else {
                group.visible               = true;
                this._imgIsDiving.visible   = !!unitData.isDiving;
            }
        }
        private _updateComponentsForHasLoadedCo(): void {
            const data                      = this._getData();
            this._imgHasLoadedCo.visible    = !!data.dataForAddUnit.unitData?.hasLoadedCo;
        }
        private _updateComponentsForActionState(): void {
            const data  = this._getData();
            const label = this._labelActionState;
            const state = data.dataForAddUnit.unitData?.actionState;
            label.text  = state == null
                ? (Lang.getUnitActionStateText(Types.UnitActionState.Idle) ?? CommonConstants.ErrorTextForUndefined)
                : (Lang.getUnitActionStateText(state) ?? CommonConstants.ErrorTextForUndefined);
        }
        private _updateComponentsForGridIndex(): void {
            const data      = this._getData();
            const inputX    = this._inputGridX;
            const inputY    = this._inputGridY;
            const gridIndex = Helpers.getExisted(GridIndexHelpers.convertGridIndex(data.dataForAddUnit.unitData?.gridIndex));
            inputX.text     = `${gridIndex.x}`;
            inputY.text     = `${gridIndex.y}`;
        }
        private _updateComponentsForPlayerIndex(): void {
            const data                  = this._getData();
            this._inputPlayerIndex.text = `${data.dataForAddUnit.unitData?.playerIndex}`;
        }
        private _updateComponentsForUnitType(): void {
            const data                  = this._getData();
            this._labelUnitType.text    = Lang.getUnitName(Helpers.getExisted(data.dataForAddUnit.unitData?.unitType), data.war.getGameConfig()) ?? CommonConstants.ErrorTextForUndefined;
        }
        private _updateComponentsForHp(): void {
            const data      = this._getData();
            const input     = this._inputHp;
            const unitData  = Helpers.getExisted(data.dataForAddUnit.unitData);
            const currentHp = unitData.currentHp;
            input.text      = currentHp == null
                ? `${data.war.getGameConfig().getUnitTemplateCfg(Helpers.getExisted(unitData.unitType))?.maxHp}`
                : `${currentHp}`;
        }
        private _updateComponentsForFuel(): void {
            const data          = this._getData();
            const input         = this._inputFuel;
            const unitData      = Helpers.getExisted(data.dataForAddUnit.unitData);
            const currentFuel   = unitData.currentFuel;
            input.text          = currentFuel == null
                ? `${data.war.getGameConfig().getUnitTemplateCfg(Helpers.getExisted(unitData.unitType))?.maxFuel}`
                : `${currentFuel}`;
        }
        private _updateComponentsForPromotion(): void {
            const data  = this._getData();
            const input = this._inputPromotion;
            input.text = `${data.dataForAddUnit.unitData?.currentPromotion || 0}`;
        }
        private _updateComponentsForPrimaryAmmo(): void {
            const data      = this._getData();
            const group     = this._groupPrimaryAmmo;
            const unitData  = Helpers.getExisted(data.dataForAddUnit.unitData);
            const maxAmmo   = data.war.getGameConfig().getUnitTemplateCfg(Helpers.getExisted(unitData.unitType))?.primaryWeaponMaxAmmo;
            if (!maxAmmo) {
                group.visible = false;
            } else {
                group.visible = true;

                const currentAmmo           = unitData.primaryWeaponCurrentAmmo;
                this._inputPrimaryAmmo.text = `${currentAmmo == null ? maxAmmo : currentAmmo}`;
            }
        }
        private _updateComponentsForFlareAmmo(): void {
            const data      = this._getData();
            const group     = this._groupFlareAmmo;
            const unitData  = Helpers.getExisted(data.dataForAddUnit.unitData);
            const maxAmmo   = data.war.getGameConfig().getUnitTemplateCfg(Helpers.getExisted(unitData.unitType))?.flareMaxAmmo;
            if (!maxAmmo) {
                group.visible = false;
            } else {
                group.visible = true;

                const currentAmmo           = unitData.flareCurrentAmmo;
                this._inputFlareAmmo.text   = `${currentAmmo == null ? maxAmmo : currentAmmo}`;
            }
        }
        private _updateComponentsForBuildMaterial(): void {
            const data          = this._getData();
            const group         = this._groupBuildMaterial;
            const unitData      = Helpers.getExisted(data.dataForAddUnit.unitData);
            const maxMaterial   = data.war.getGameConfig().getUnitTemplateCfg(Helpers.getExisted(unitData.unitType))?.maxBuildMaterial;
            if (!maxMaterial) {
                group.visible = false;
            } else {
                group.visible = true;

                const currentMaterial           = unitData.currentBuildMaterial;
                this._inputBuildMaterial.text   = `${currentMaterial == null ? maxMaterial : currentMaterial}`;
            }
        }
        private _updateComponentsForProduceMaterial(): void {
            const data          = this._getData();
            const group         = this._groupProduceMaterial;
            const unitData      = Helpers.getExisted(data.dataForAddUnit.unitData);
            const maxMaterial   = data.war.getGameConfig().getUnitTemplateCfg(Helpers.getExisted(unitData.unitType))?.maxProduceMaterial;
            if (!maxMaterial) {
                group.visible = false;
            } else {
                group.visible = true;

                const currentMaterial           = unitData.currentProduceMaterial;
                this._inputProduceMaterial.text = `${currentMaterial == null ? maxMaterial : currentMaterial}`;
            }
        }
    }

    function getErrorTipsForAddUnit({ dataForAddUnit, war }: {
        dataForAddUnit  : CommonProto.WarEvent.WeaAddUnit.IDataForAddUnit;
        war             : MapEditor.MeWar;
    }): string | null {
        if (dataForAddUnit.canBeBlockedByUnit == null) {
            return Lang.getText(LangTextType.A0192);
        }

        if (dataForAddUnit.needMovableTile == null) {
            return Lang.getText(LangTextType.A0193);
        }

        const unitData      = Helpers.getExisted(dataForAddUnit.unitData);
        const gameConfig    = war.getGameConfig();
        const unitCfg       = gameConfig.getUnitTemplateCfg(Helpers.getExisted(unitData.unitType));
        if (unitCfg == null) {
            return Lang.getFormattedText(LangTextType.F0064, Lang.getText(LangTextType.B0525));
        }

        if (!GridIndexHelpers.checkIsInsideMap(Helpers.getExisted(unitData.gridIndex), war.getTileMap().getMapSize())) {
            return Lang.getFormattedText(LangTextType.F0064, Lang.getText(LangTextType.B0531));
        }

        {
            const playerIndex = unitData.playerIndex;
            if ((playerIndex == null)                               ||
                (playerIndex > war.getPlayersCountUnneutral())      ||
                (playerIndex < CommonConstants.PlayerIndex.First)
            ) {
                return Lang.getFormattedText(LangTextType.F0064, Lang.getText(LangTextType.B0521));
            }
        }

        {
            const actionState = unitData.actionState;
            if ((actionState != null)                           &&
                (actionState !== Types.UnitActionState.Acted)   &&
                (actionState !== Types.UnitActionState.Idle)
            ) {
                return Lang.getFormattedText(LangTextType.F0064, Lang.getText(LangTextType.B0526));
            }
        }

        {
            const currentFuel = unitData.currentFuel;
            if ((currentFuel != null)                                   &&
                ((currentFuel < 0) || (currentFuel > unitCfg.maxFuel))
            ) {
                return Lang.getFormattedText(LangTextType.F0064, Lang.getText(LangTextType.B0342));
            }
        }

        {
            const currentHp = unitData.currentHp;
            if ((currentHp != null)                             &&
                ((currentHp < 0) || (currentHp > unitCfg.maxHp))
            ) {
                return Lang.getFormattedText(LangTextType.F0064, Lang.getText(LangTextType.B0339));
            }
        }

        {
            const currentBuildMaterial  = unitData.currentBuildMaterial;
            const maxBuildMaterial      = unitCfg.maxBuildMaterial;
            if (maxBuildMaterial == null) {
                if (currentBuildMaterial != null) {
                    return Lang.getFormattedText(LangTextType.F0064, Lang.getText(LangTextType.B0347));
                }
            } else {
                if ((currentBuildMaterial != null)                                          &&
                    ((currentBuildMaterial < 0) || (currentBuildMaterial > maxBuildMaterial))
                ) {
                    return Lang.getFormattedText(LangTextType.F0064, Lang.getText(LangTextType.B0347));
                }
            }
        }

        {
            const currentProduceMaterial  = unitData.currentProduceMaterial;
            const maxProduceMaterial      = unitCfg.maxProduceMaterial;
            if (maxProduceMaterial == null) {
                if (currentProduceMaterial != null) {
                    return Lang.getFormattedText(LangTextType.F0064, Lang.getText(LangTextType.B0348));
                }
            } else {
                if ((currentProduceMaterial != null)                                                &&
                    ((currentProduceMaterial < 0) || (currentProduceMaterial > maxProduceMaterial))
                ) {
                    return Lang.getFormattedText(LangTextType.F0064, Lang.getText(LangTextType.B0348));
                }
            }
        }

        {
            const currentPromotion = unitData.currentPromotion;
            if ((currentPromotion != null)                                                      &&
                ((currentPromotion < 0) || (currentPromotion > gameConfig.getUnitMaxPromotion()))
            ) {
                return Lang.getFormattedText(LangTextType.F0064, Lang.getText(LangTextType.B0370));
            }
        }

        {
            const flareCurrentAmmo  = unitData.flareCurrentAmmo;
            const flareMaxAmmo      = unitCfg.flareMaxAmmo;
            if (flareMaxAmmo == null) {
                if (flareCurrentAmmo != null) {
                    return Lang.getFormattedText(LangTextType.F0064, Lang.getText(LangTextType.B0349));
                }
            } else {
                if ((flareCurrentAmmo != null)                                  &&
                    ((flareCurrentAmmo < 0) || (flareCurrentAmmo > flareMaxAmmo))
                ) {
                    return Lang.getFormattedText(LangTextType.F0064, Lang.getText(LangTextType.B0349));
                }
            }
        }

        {
            const primaryCurrentAmmo  = unitData.primaryWeaponCurrentAmmo;
            const primaryMaxAmmo      = unitCfg.primaryWeaponMaxAmmo;
            if (primaryMaxAmmo == null) {
                if (primaryCurrentAmmo != null) {
                    return Lang.getFormattedText(LangTextType.F0064, Lang.getText(LangTextType.B0350));
                }
            } else {
                if ((primaryCurrentAmmo != null)                                    &&
                    ((primaryCurrentAmmo < 0) || (primaryCurrentAmmo > primaryMaxAmmo))
                ) {
                    return Lang.getFormattedText(LangTextType.F0064, Lang.getText(LangTextType.B0350));
                }
            }
        }

        if (unitData.unitId != null) {
            return Lang.getFormattedText(LangTextType.F0064, Lang.getText(LangTextType.B0527));
        }

        if (unitData.loaderUnitId != null) {
            return Lang.getFormattedText(LangTextType.F0064, Lang.getText(LangTextType.B0528));
        }

        if ((unitData.isDiving) && (!unitCfg.diveCfgs)) {
            return Lang.getFormattedText(LangTextType.F0064, Lang.getText(LangTextType.B0371));
        }

        if (unitData.isBuildingTile) {
            return Lang.getFormattedText(LangTextType.F0064, Lang.getText(LangTextType.B0529));
        }

        if (unitData.isCapturingTile) {
            return Lang.getFormattedText(LangTextType.F0064, Lang.getText(LangTextType.B0530));
        }

        // unitData.hasLoadedCo的值不需要检查

        return null;
    }
}

// export default TwnsWeActionModifyPanel1;
