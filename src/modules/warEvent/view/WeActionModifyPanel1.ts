
import TwnsBwWar                    from "../../baseWar/model/BwWar";
import TwnsCommonConfirmPanel       from "../../common/view/CommonConfirmPanel";
import CommonConstants              from "../../tools/helpers/CommonConstants";
import ConfigManager                from "../../tools/helpers/ConfigManager";
import FloatText                    from "../../tools/helpers/FloatText";
import GridIndexHelpers             from "../../tools/helpers/GridIndexHelpers";
import Helpers                      from "../../tools/helpers/Helpers";
import Types                        from "../../tools/helpers/Types";
import Lang                         from "../../tools/lang/Lang";
import TwnsLangTextType             from "../../tools/lang/LangTextType";
import Notify                       from "../../tools/notify/Notify";
import TwnsNotifyType               from "../../tools/notify/NotifyType";
import ProtoTypes                   from "../../tools/proto/ProtoTypes";
import TwnsUiButton                 from "../../tools/ui/UiButton";
import TwnsUiImage                  from "../../tools/ui/UiImage";
import TwnsUiLabel                  from "../../tools/ui/UiLabel";
import TwnsUiListItemRenderer       from "../../tools/ui/UiListItemRenderer";
import TwnsUiPanel                  from "../../tools/ui/UiPanel";
import TwnsUiScrollList             from "../../tools/ui/UiScrollList";
import TwnsUiTextInput              from "../../tools/ui/UiTextInput";
import WarEventHelper               from "../model/WarEventHelper";
import TwnsWeActionAddUnitListPanel from "./WeActionAddUnitListPanel";
import TwnsWeActionTypeListPanel    from "./WeActionTypeListPanel";

namespace TwnsWeActionModifyPanel1 {
    import CommonConfirmPanel       = TwnsCommonConfirmPanel.CommonConfirmPanel;
    import WeActionTypeListPanel    = TwnsWeActionTypeListPanel.WeActionTypeListPanel;
    import WeActionAddUnitListPanel = TwnsWeActionAddUnitListPanel.WeActionAddUnitListPanel;
    import NotifyType               = TwnsNotifyType.NotifyType;
    import ColorValue               = Types.ColorValue;
    import IWarEventFullData        = ProtoTypes.Map.IWarEventFullData;
    import IWarEventAction          = ProtoTypes.WarEvent.IWarEventAction;
    import FocusEvent               = egret.FocusEvent;
    import LangTextType             = TwnsLangTextType.LangTextType;
    import BwWar                    = TwnsBwWar.BwWar;

    type OpenDataForWeActionModifyPanel1 = {
        war         : BwWar;
        fullData    : IWarEventFullData;
        action      : IWarEventAction;
    };
    export class WeActionModifyPanel1 extends TwnsUiPanel.UiPanel<OpenDataForWeActionModifyPanel1> {
        protected readonly _LAYER_TYPE   = Types.LayerType.Hud1;
        protected readonly _IS_EXCLUSIVE = false;

        private static _instance: WeActionModifyPanel1;

        private _btnBack        : TwnsUiButton.UiButton;
        private _btnType        : TwnsUiButton.UiButton;
        private _btnAddUnit     : TwnsUiButton.UiButton;
        private _btnClear       : TwnsUiButton.UiButton;
        private _labelTitle     : TwnsUiLabel.UiLabel;
        private _labelUnitsCount: TwnsUiLabel.UiLabel;
        private _listUnit       : TwnsUiScrollList.UiScrollList<DataForUnitRenderer>;

        public static show(openData: OpenDataForWeActionModifyPanel1): void {
            if (!WeActionModifyPanel1._instance) {
                WeActionModifyPanel1._instance = new WeActionModifyPanel1();
            }
            WeActionModifyPanel1._instance.open(openData);
        }
        public static async hide(): Promise<void> {
            if (WeActionModifyPanel1._instance) {
                await WeActionModifyPanel1._instance.close();
            }
        }

        public constructor() {
            super();

            this.skinName = "resource/skins/warEvent/WeActionModifyPanel1.exml";
        }

        protected _onOpened(): void {
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
            this._listUnit.setItemRenderer(UnitRenderer);

            this._updateView();
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Event callbacks.
        ////////////////////////////////////////////////////////////////////////////////
        private _onNotifyLanguageChanged(e: egret.Event): void {
            this._updateComponentsForLanguage();
        }

        private _onNotifyWarEventFullDataChanged(e: egret.Event): void {
            this._updateComponentsForUnits();
        }

        private _onTouchedBtnAddUnit(e: egret.TouchEvent): void {
            const unitArray = this._getOpenData().action.WeaAddUnit.unitArray;
            if (unitArray.length > CommonConstants.WarEventActionAddUnitMaxCount) {
                FloatText.show(Lang.getText(LangTextType.A0189));
            } else {
                unitArray.push(WarEventHelper.getDefaultAddUnitData());
                Notify.dispatch(NotifyType.WarEventFullDataChanged);
            }
        }

        private _onTouchedBtnClear(e: egret.TouchEvent): void {
            const openData = this._getOpenData();
            CommonConfirmPanel.show({
                content : Lang.getText(LangTextType.A0190),
                callback: () => {
                    openData.action.WeaAddUnit.unitArray.length = 0;
                    Notify.dispatch(NotifyType.WarEventFullDataChanged);
                }
            });
        }

        private _onTouchedBtnType(e: egret.TouchEvent): void {
            const openData = this._getOpenData();
            WeActionTypeListPanel.show({
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
            this._labelTitle.text   = `${Lang.getText(LangTextType.B0533)} A${this._getOpenData().action.WeaCommonData.actionId}`;
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
            for (const dataForAddUnit of action.WeaAddUnit.unitArray || []) {
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
        war             : BwWar;
        action          : IWarEventAction;
        dataForAddUnit  : ProtoTypes.WarEvent.WeaAddUnit.IDataForAddUnit;
    };
    class UnitRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForUnitRenderer> {
        private _btnDelete              : TwnsUiButton.UiButton;
        private _labelError             : TwnsUiLabel.UiLabel;

        private _groupCanBeBlockedByUnit: eui.Group;
        private _labelCanBeBlockedByUnit: TwnsUiLabel.UiLabel;
        private _imgCanBeBlockedByUnit  : TwnsUiImage.UiImage;

        private _groupNeedMovableTile   : eui.Group;
        private _labelNeedMovableTile   : TwnsUiLabel.UiLabel;
        private _imgNeedMovableTile     : TwnsUiImage.UiImage;

        private _labelGridIndex         : TwnsUiLabel.UiLabel;
        private _inputGridX             : TwnsUiTextInput.UiTextInput;
        private _inputGridY             : TwnsUiTextInput.UiTextInput;

        private _labelPlayerIndex       : TwnsUiLabel.UiLabel;
        private _inputPlayerIndex       : TwnsUiTextInput.UiTextInput;

        private _btnUnitType            : TwnsUiButton.UiButton;
        private _labelUnitType          : TwnsUiLabel.UiLabel;

        private _btnActionState         : TwnsUiButton.UiButton;
        private _labelActionState       : TwnsUiLabel.UiLabel;

        private _labelHp                : TwnsUiLabel.UiLabel;
        private _inputHp                : TwnsUiTextInput.UiTextInput;

        private _labelFuel              : TwnsUiLabel.UiLabel;
        private _inputFuel              : TwnsUiTextInput.UiTextInput;

        private _labelPromotion         : TwnsUiLabel.UiLabel;
        private _inputPromotion         : TwnsUiTextInput.UiTextInput;

        private _groupHasLoadedCo       : eui.Group;
        private _labelHasLoadedCo       : TwnsUiLabel.UiLabel;
        private _imgHasLoadedCo         : TwnsUiImage.UiImage;

        private _groupPrimaryAmmo       : eui.Group;
        private _labelPrimaryAmmo       : TwnsUiLabel.UiLabel;
        private _inputPrimaryAmmo       : TwnsUiTextInput.UiTextInput;

        private _groupFlareAmmo         : eui.Group;
        private _labelFlareAmmo         : TwnsUiLabel.UiLabel;
        private _inputFlareAmmo         : TwnsUiTextInput.UiTextInput;

        private _groupIsDiving          : eui.Group;
        private _labelIsDiving          : TwnsUiLabel.UiLabel;
        private _imgIsDiving            : TwnsUiImage.UiImage;

        private _groupBuildMaterial     : eui.Group;
        private _labelBuildMaterial     : TwnsUiLabel.UiLabel;
        private _inputBuildMaterial     : TwnsUiTextInput.UiTextInput;

        private _groupProduceMaterial   : eui.Group;
        private _labelProduceMaterial   : TwnsUiLabel.UiLabel;
        private _inputProduceMaterial   : TwnsUiTextInput.UiTextInput;

        protected _onOpened(): void {
            this._setUiListenerArray([
                { ui: this._btnDelete,                  callback: this._onTouchedBtnDelete },
                { ui: this._groupCanBeBlockedByUnit,    callback: this._onTouchedGroupCanBeBlockedByUnit },
                { ui: this._groupNeedMovableTile,       callback: this._onTouchedGroupNeedMovableTile },
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

        private _onTouchedBtnDelete(e: egret.TouchEvent): void {
            const data = this.data;
            if (data) {
                CommonConfirmPanel.show({
                    content : Lang.getText(LangTextType.A0029),
                    callback: () => {
                        Helpers.deleteElementFromArray(data.action.WeaAddUnit.unitArray, data.dataForAddUnit);
                        Notify.dispatch(NotifyType.WarEventFullDataChanged);
                    },
                });
            }
        }
        private _onTouchedGroupCanBeBlockedByUnit(e: egret.TouchEvent): void {
            const data = this.data;
            if (data) {
                data.dataForAddUnit.canBeBlockedByUnit = !data.dataForAddUnit.canBeBlockedByUnit;
                Notify.dispatch(NotifyType.WarEventFullDataChanged);
            }
        }
        private _onTouchedGroupNeedMovableTile(e: egret.TouchEvent): void {
            const data = this.data;
            if (data) {
                data.dataForAddUnit.needMovableTile = !data.dataForAddUnit.needMovableTile;
                Notify.dispatch(NotifyType.WarEventFullDataChanged);
            }
        }
        private _onTouchedGroupIsDiving(e: egret.TouchEvent): void {
            const data = this.data;
            if (data) {
                const unitData      = data.dataForAddUnit.unitData;
                unitData.isDiving   = unitData.isDiving ? undefined : true;
                Notify.dispatch(NotifyType.WarEventFullDataChanged);
            }
        }
        private _onTouchedGroupHasLoadedCo(e: egret.TouchEvent): void {
            const data = this.data;
            if (data) {
                const unitData          = data.dataForAddUnit.unitData;
                unitData.hasLoadedCo    = unitData.hasLoadedCo ? undefined : true;
                Notify.dispatch(NotifyType.WarEventFullDataChanged);
            }
        }
        private _onTouchedBtnActionState(e: egret.TouchEvent): void {
            const data = this.data;
            if (data) {
                const unitData = data.dataForAddUnit.unitData;
                if (unitData.actionState === Types.UnitActionState.Acted) {
                    unitData.actionState = undefined;
                } else {
                    unitData.actionState = Types.UnitActionState.Acted;
                }
                Notify.dispatch(NotifyType.WarEventFullDataChanged);
            }
        }
        private _onTouchedBtnUnitType(e: egret.TouchEvent): void {
            const data = this.data;
            WeActionAddUnitListPanel.show({
                configVersion   : data.war.getConfigVersion(),
                dataForAddUnit  : data.dataForAddUnit,
            });
        }
        private _onFocusOutInputGridX(e: FocusEvent): void {
            const data = this.data;
            if (!data) {
                return;
            }

            const gridIndex = data.dataForAddUnit.unitData.gridIndex;
            const newGridX  = Math.max(0, Math.min(parseInt(this._inputGridX.text) || 0, data.war.getTileMap().getMapSize().width - 1));
            if (newGridX !== gridIndex.x) {
                gridIndex.x = newGridX;
                Notify.dispatch(NotifyType.WarEventFullDataChanged);
            }
        }
        private _onFocusOutInputGridY(e: FocusEvent): void {
            const data = this.data;
            if (!data) {
                return;
            }

            const gridIndex = data.dataForAddUnit.unitData.gridIndex;
            const newGridY  = Math.max(0, Math.min(parseInt(this._inputGridY.text) || 0, data.war.getTileMap().getMapSize().height - 1));
            if (newGridY !== gridIndex.y) {
                gridIndex.y = newGridY;
                Notify.dispatch(NotifyType.WarEventFullDataChanged);
            }
        }
        private _onFocusOutInputPlayerIndex(e: FocusEvent): void {
            const data = this.data;
            if (!data) {
                return;
            }

            const unitData          = data.dataForAddUnit.unitData;
            const newPlayerIndex    = Math.max(
                CommonConstants.WarFirstPlayerIndex,
                Math.min(parseInt(this._inputPlayerIndex.text) || 0, CommonConstants.WarMaxPlayerIndex)
            );
            if (newPlayerIndex !== unitData.playerIndex) {
                unitData.playerIndex = newPlayerIndex;
                Notify.dispatch(NotifyType.WarEventFullDataChanged);
            }
        }
        private _onFocusOutInputHp(e: FocusEvent): void {
            const data = this.data;
            if (!data) {
                return;
            }

            const unitData  = data.dataForAddUnit.unitData;
            const maxHp     = ConfigManager.getUnitTemplateCfg(data.war.getConfigVersion(), unitData.unitType).maxHp;
            const currentHp = unitData.currentHp == null ? maxHp : unitData.currentHp;
            const newHp     = Math.max(0, Math.min(parseInt(this._inputHp.text) || 0, maxHp));
            if (newHp !== currentHp) {
                unitData.currentHp = newHp === maxHp ? undefined : newHp;
                Notify.dispatch(NotifyType.WarEventFullDataChanged);
            }
        }
        private _onFocusOutInputFuel(e: FocusEvent): void {
            const data = this.data;
            if (!data) {
                return;
            }

            const unitData      = data.dataForAddUnit.unitData;
            const maxFuel       = ConfigManager.getUnitTemplateCfg(data.war.getConfigVersion(), unitData.unitType).maxFuel;
            const currentFuel   = unitData.currentFuel == null ? maxFuel : unitData.currentFuel;
            const newFuel       = Math.max(0, Math.min(parseInt(this._inputFuel.text) || 0, maxFuel));
            if (newFuel !== currentFuel) {
                unitData.currentFuel = newFuel === maxFuel ? undefined : newFuel;
                Notify.dispatch(NotifyType.WarEventFullDataChanged);
            }
        }
        private _onFocusOutInputPromotion(e: FocusEvent): void {
            const data = this.data;
            if (!data) {
                return;
            }

            const unitData          = data.dataForAddUnit.unitData;
            const maxPromotion      = ConfigManager.getUnitMaxPromotion(data.war.getConfigVersion());
            const currentPromotion  = unitData.currentPromotion || 0;
            const newPromotion      = Math.max(0, Math.min(parseInt(this._inputPromotion.text) || 0, maxPromotion));
            if (newPromotion !== currentPromotion) {
                unitData.currentPromotion = newPromotion === 0 ? undefined : newPromotion;
                Notify.dispatch(NotifyType.WarEventFullDataChanged);
            }
        }
        private _onFocusOutInputPrimaryAmmo(e: FocusEvent): void {
            const data = this.data;
            if (!data) {
                return;
            }

            const unitData      = data.dataForAddUnit.unitData;
            const maxAmmo       = ConfigManager.getUnitTemplateCfg(data.war.getConfigVersion(), unitData.unitType).primaryWeaponMaxAmmo;
            const currentAmmo   = unitData.primaryWeaponCurrentAmmo == null ? maxAmmo : unitData.primaryWeaponCurrentAmmo;
            const newAmmo       = Math.max(0, Math.min(parseInt(this._inputPrimaryAmmo.text) || 0, maxAmmo));
            if (newAmmo !== currentAmmo) {
                unitData.primaryWeaponCurrentAmmo = newAmmo === maxAmmo ? undefined : newAmmo;
                Notify.dispatch(NotifyType.WarEventFullDataChanged);
            }
        }
        private _onFocusOutInputFlareAmmo(e: FocusEvent): void {
            const data = this.data;
            if (!data) {
                return;
            }

            const unitData      = data.dataForAddUnit.unitData;
            const maxAmmo       = ConfigManager.getUnitTemplateCfg(data.war.getConfigVersion(), unitData.unitType).flareMaxAmmo;
            const currentAmmo   = unitData.flareCurrentAmmo == null ? maxAmmo : unitData.flareCurrentAmmo;
            const newAmmo       = Math.max(0, Math.min(parseInt(this._inputFlareAmmo.text) || 0, maxAmmo));
            if (newAmmo !== currentAmmo) {
                unitData.flareCurrentAmmo = newAmmo === maxAmmo ? undefined : newAmmo;
                Notify.dispatch(NotifyType.WarEventFullDataChanged);
            }
        }
        private _onFocusOutInputBuildMaterial(e: FocusEvent): void {
            const data = this.data;
            if (!data) {
                return;
            }

            const unitData          = data.dataForAddUnit.unitData;
            const maxMaterial       = ConfigManager.getUnitTemplateCfg(data.war.getConfigVersion(), unitData.unitType).maxBuildMaterial;
            const currentMaterial   = unitData.currentBuildMaterial == null ? maxMaterial : unitData.currentBuildMaterial;
            const newMaterial       = Math.max(0, Math.min(parseInt(this._inputBuildMaterial.text) || 0, maxMaterial));
            if (newMaterial !== currentMaterial) {
                unitData.currentBuildMaterial = newMaterial === maxMaterial ? undefined : newMaterial;
                Notify.dispatch(NotifyType.WarEventFullDataChanged);
            }
        }
        private _onFocusOutInputProduceMaterial(e: FocusEvent): void {
            const data = this.data;
            if (!data) {
                return;
            }

            const unitData          = data.dataForAddUnit.unitData;
            const maxMaterial       = ConfigManager.getUnitTemplateCfg(data.war.getConfigVersion(), unitData.unitType).maxProduceMaterial;
            const currentMaterial   = unitData.currentProduceMaterial == null ? maxMaterial : unitData.currentProduceMaterial;
            const newMaterial       = Math.max(0, Math.min(parseInt(this._inputProduceMaterial.text) || 0, maxMaterial));
            if (newMaterial !== currentMaterial) {
                unitData.currentProduceMaterial = newMaterial === maxMaterial ? undefined : newMaterial;
                Notify.dispatch(NotifyType.WarEventFullDataChanged);
            }
        }

        private _onNotifyLanguageChanged(e: egret.Event): void {
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
            const data  = this.data;
            const label = this._labelError;
            if (data == null) {
                label.text = undefined;
                return;
            }

            const dataForAddUnit    = data.dataForAddUnit;
            const errorTips         = getErrorTipsForAddUnit({
                dataForAddUnit,
                war             : data.war,
            });
            label.text      = `${data.action.WeaAddUnit.unitArray.indexOf(dataForAddUnit) + 1}. ${errorTips || Lang.getText(LangTextType.B0493)}`;
            label.textColor = errorTips ? ColorValue.Red : ColorValue.Green;
        }
        private _updateComponentsForCanBeBlockedByUnit(): void {
            const data                          = this.data;
            this._imgCanBeBlockedByUnit.visible = (!!data) && (!!data.dataForAddUnit.canBeBlockedByUnit);
        }
        private _updateComponentsForNeedMovableTile(): void {
            const data                          = this.data;
            this._imgNeedMovableTile.visible    = (!!data) && (!!data.dataForAddUnit.needMovableTile);
        }
        private _updateComponentsForIsDiving(): void {
            const data  = this.data;
            const group = this._groupIsDiving;
            if (!data) {
                group.visible = false;
            } else {
                const unitData  = data.dataForAddUnit.unitData;
                const unitCfg   = ConfigManager.getUnitTemplateCfg(data.war.getConfigVersion(), unitData.unitType);
                if ((!unitCfg) || (!unitCfg.diveCfgs)) {
                    group.visible = false;
                } else {
                    group.visible               = true;
                    this._imgIsDiving.visible   = !!unitData.isDiving;
                }
            }
        }
        private _updateComponentsForHasLoadedCo(): void {
            const data                      = this.data;
            this._imgHasLoadedCo.visible    = (!!data) && (!!data.dataForAddUnit.unitData.hasLoadedCo);
        }
        private _updateComponentsForActionState(): void {
            const data  = this.data;
            const label = this._labelActionState;
            if (!data) {
                label.text = undefined;
            } else {
                const state = data.dataForAddUnit.unitData.actionState;
                label.text  = state == null
                    ? Lang.getUnitActionStateText(Types.UnitActionState.Idle)
                    : Lang.getUnitActionStateText(state);
            }
        }
        private _updateComponentsForGridIndex(): void {
            const data      = this.data;
            const inputX    = this._inputGridX;
            const inputY    = this._inputGridY;
            if (!data) {
                inputX.text = undefined;
                inputY.text = undefined;
            } else {
                const gridIndex = data.dataForAddUnit.unitData.gridIndex;
                inputX.text = `${gridIndex.x}`;
                inputY.text = `${gridIndex.y}`;
            }
        }
        private _updateComponentsForPlayerIndex(): void {
            const data                  = this.data;
            this._inputPlayerIndex.text = data
                ? `${data.dataForAddUnit.unitData.playerIndex}`
                : undefined;
        }
        private _updateComponentsForUnitType(): void {
            const data                  = this.data;
            this._labelUnitType.text    = data
                ? Lang.getUnitName(data.dataForAddUnit.unitData.unitType)
                : undefined;
        }
        private _updateComponentsForHp(): void {
            const data  = this.data;
            const input = this._inputHp;
            if (!data) {
                input.text = undefined;
            } else {
                const unitData  = data.dataForAddUnit.unitData;
                const currentHp = unitData.currentHp;
                input.text      = currentHp == null
                    ? `${ConfigManager.getUnitTemplateCfg(data.war.getConfigVersion(), unitData.unitType).maxHp}`
                    : `${currentHp}`;
            }
        }
        private _updateComponentsForFuel(): void {
            const data  = this.data;
            const input = this._inputFuel;
            if (!data) {
                input.text = undefined;
            } else {
                const unitData      = data.dataForAddUnit.unitData;
                const currentFuel   = unitData.currentFuel;
                input.text          = currentFuel == null
                    ? `${ConfigManager.getUnitTemplateCfg(data.war.getConfigVersion(), unitData.unitType).maxFuel}`
                    : `${currentFuel}`;
            }
        }
        private _updateComponentsForPromotion(): void {
            const data  = this.data;
            const input = this._inputPromotion;
            if (!data) {
                input.text = undefined;
            } else {
                input.text = `${data.dataForAddUnit.unitData.currentPromotion || 0}`;
            }
        }
        private _updateComponentsForPrimaryAmmo(): void {
            const data  = this.data;
            const group = this._groupPrimaryAmmo;
            if (!data) {
                group.visible = false;
            } else {
                const unitData  = data.dataForAddUnit.unitData;
                const maxAmmo   = ConfigManager.getUnitTemplateCfg(data.war.getConfigVersion(), unitData.unitType).primaryWeaponMaxAmmo;
                if (!maxAmmo) {
                    group.visible = false;
                } else {
                    group.visible = true;

                    const currentAmmo           = unitData.primaryWeaponCurrentAmmo;
                    this._inputPrimaryAmmo.text = `${currentAmmo == null ? maxAmmo : currentAmmo}`;
                }
            }
        }
        private _updateComponentsForFlareAmmo(): void {
            const data  = this.data;
            const group = this._groupFlareAmmo;
            if (!data) {
                group.visible = false;
            } else {
                const unitData  = data.dataForAddUnit.unitData;
                const maxAmmo   = ConfigManager.getUnitTemplateCfg(data.war.getConfigVersion(), unitData.unitType).flareMaxAmmo;
                if (!maxAmmo) {
                    group.visible = false;
                } else {
                    group.visible = true;

                    const currentAmmo           = unitData.flareCurrentAmmo;
                    this._inputFlareAmmo.text   = `${currentAmmo == null ? maxAmmo : currentAmmo}`;
                }
            }
        }
        private _updateComponentsForBuildMaterial(): void {
            const data  = this.data;
            const group = this._groupBuildMaterial;
            if (!data) {
                group.visible = false;
            } else {
                const unitData      = data.dataForAddUnit.unitData;
                const maxMaterial   = ConfigManager.getUnitTemplateCfg(data.war.getConfigVersion(), unitData.unitType).maxBuildMaterial;
                if (!maxMaterial) {
                    group.visible = false;
                } else {
                    group.visible = true;

                    const currentMaterial           = unitData.currentBuildMaterial;
                    this._inputBuildMaterial.text   = `${currentMaterial == null ? maxMaterial : currentMaterial}`;
                }
            }
        }
        private _updateComponentsForProduceMaterial(): void {
            const data  = this.data;
            const group = this._groupProduceMaterial;
            if (!data) {
                group.visible = false;
            } else {
                const unitData      = data.dataForAddUnit.unitData;
                const maxMaterial   = ConfigManager.getUnitTemplateCfg(data.war.getConfigVersion(), unitData.unitType).maxProduceMaterial;
                if (!maxMaterial) {
                    group.visible = false;
                } else {
                    group.visible = true;

                    const currentMaterial           = unitData.currentProduceMaterial;
                    this._inputProduceMaterial.text = `${currentMaterial == null ? maxMaterial : currentMaterial}`;
                }
            }
        }
    }

    function getErrorTipsForAddUnit({ dataForAddUnit, war }: {
        dataForAddUnit  : ProtoTypes.WarEvent.WeaAddUnit.IDataForAddUnit;
        war             : BwWar;
    }): string | undefined {
        if (dataForAddUnit.canBeBlockedByUnit == null) {
            return Lang.getText(LangTextType.A0192);
        }

        if (dataForAddUnit.needMovableTile == null) {
            return Lang.getText(LangTextType.A0193);
        }

        const configVersion = war.getConfigVersion();
        const unitData      = dataForAddUnit.unitData;
        const unitCfg       = ConfigManager.getUnitTemplateCfg(configVersion, unitData.unitType);
        if (unitCfg == null) {
            return Lang.getFormattedText(LangTextType.F0064, Lang.getText(LangTextType.B0525));
        }

        if (!GridIndexHelpers.checkIsInsideMap(unitData.gridIndex, war.getTileMap().getMapSize())) {
            return Lang.getFormattedText(LangTextType.F0064, Lang.getText(LangTextType.B0531));
        }

        const playerIndex = unitData.playerIndex;
        if ((playerIndex == null)                               ||
            (playerIndex > CommonConstants.WarMaxPlayerIndex)   ||
            (playerIndex < CommonConstants.WarFirstPlayerIndex)
        ) {
            return Lang.getFormattedText(LangTextType.F0064, Lang.getText(LangTextType.B0521));
        }

        const actionState = unitData.actionState;
        if ((actionState != null)                           &&
            (actionState !== Types.UnitActionState.Acted)   &&
            (actionState !== Types.UnitActionState.Idle)
        ) {
            return Lang.getFormattedText(LangTextType.F0064, Lang.getText(LangTextType.B0526));
        }

        const currentFuel = unitData.currentFuel;
        if ((currentFuel < 0) || (currentFuel > unitCfg.maxFuel)) {
            return Lang.getFormattedText(LangTextType.F0064, Lang.getText(LangTextType.B0342));
        }

        const currentHp = unitData.currentHp;
        if ((currentHp < 0) || (currentHp > unitCfg.maxHp)) {
            return Lang.getFormattedText(LangTextType.F0064, Lang.getText(LangTextType.B0339));
        }

        const currentBuildMaterial  = unitData.currentBuildMaterial;
        const maxBuildMaterial      = unitCfg.maxBuildMaterial;
        if (maxBuildMaterial == null) {
            if (currentBuildMaterial != null) {
                return Lang.getFormattedText(LangTextType.F0064, Lang.getText(LangTextType.B0347));
            }
        } else {
            if ((currentBuildMaterial < 0) || (currentBuildMaterial > maxBuildMaterial)) {
                return Lang.getFormattedText(LangTextType.F0064, Lang.getText(LangTextType.B0347));
            }
        }

        const currentProduceMaterial  = unitData.currentProduceMaterial;
        const maxProduceMaterial      = unitCfg.maxProduceMaterial;
        if (maxProduceMaterial == null) {
            if (currentProduceMaterial != null) {
                return Lang.getFormattedText(LangTextType.F0064, Lang.getText(LangTextType.B0348));
            }
        } else {
            if ((currentProduceMaterial < 0) || (currentProduceMaterial > maxProduceMaterial)) {
                return Lang.getFormattedText(LangTextType.F0064, Lang.getText(LangTextType.B0348));
            }
        }

        const currentPromotion = unitData.currentPromotion;
        if ((currentPromotion < 0) || (currentPromotion > ConfigManager.getUnitMaxPromotion(configVersion))) {
            return Lang.getFormattedText(LangTextType.F0064, Lang.getText(LangTextType.B0370));
        }

        const flareCurrentAmmo  = unitData.flareCurrentAmmo;
        const flareMaxAmmo      = unitCfg.flareMaxAmmo;
        if (flareMaxAmmo == null) {
            if (flareCurrentAmmo != null) {
                return Lang.getFormattedText(LangTextType.F0064, Lang.getText(LangTextType.B0349));
            }
        } else {
            if ((flareCurrentAmmo < 0) || (flareCurrentAmmo > flareMaxAmmo)) {
                return Lang.getFormattedText(LangTextType.F0064, Lang.getText(LangTextType.B0349));
            }
        }

        const primaryCurrentAmmo  = unitData.primaryWeaponCurrentAmmo;
        const primaryMaxAmmo      = unitCfg.primaryWeaponMaxAmmo;
        if (primaryMaxAmmo == null) {
            if (primaryCurrentAmmo != null) {
                return Lang.getFormattedText(LangTextType.F0064, Lang.getText(LangTextType.B0350));
            }
        } else {
            if ((primaryCurrentAmmo < 0) || (primaryCurrentAmmo > primaryMaxAmmo)) {
                return Lang.getFormattedText(LangTextType.F0064, Lang.getText(LangTextType.B0350));
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

        return undefined;
    }
}

export default TwnsWeActionModifyPanel1;
