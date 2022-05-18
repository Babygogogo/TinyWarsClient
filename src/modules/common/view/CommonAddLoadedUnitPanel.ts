
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
namespace Twns.Common {
    import NotifyType               = Notify.NotifyType;
    import ColorValue               = Types.ColorValue;
    import FocusEvent               = egret.FocusEvent;
    import LangTextType             = Lang.LangTextType;

    export type OpenDataForCommonAddLoadedUnitPanel = {
        war         : BaseWar.BwWar;
        loaderUnit  : BaseWar.BwUnit;
        callback    : (unitData: CommonProto.WarSerialization.ISerialUnit) => void;
    };
    export class CommonAddLoadedUnitPanel extends TwnsUiPanel.UiPanel<OpenDataForCommonAddLoadedUnitPanel> {
        private readonly _labelTitle!               : TwnsUiLabel.UiLabel;
        private readonly _btnBack!                  : TwnsUiButton.UiButton;
        private readonly _btnConfirm!               : TwnsUiButton.UiButton;

        private readonly _labelError!               : TwnsUiLabel.UiLabel;

        private readonly _btnAiMode!                : TwnsUiButton.UiButton;
        private readonly _labelAiMode!              : TwnsUiLabel.UiLabel;

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

        private _unitData?  : CommonProto.WarSerialization.ISerialUnit;

        protected _onOpening(): void {
            this._setUiListenerArray([
                { ui: this._btnBack,                    callback: this.close },
                { ui: this._btnConfirm,                 callback: this._onTouchedBtnConfirm },
                { ui: this._btnAiMode,                  callback: this._onTouchedBtnAiMode },
                { ui: this._groupIsDiving,              callback: this._onTouchedGroupIsDiving },
                { ui: this._groupHasLoadedCo,           callback: this._onTouchedGroupHasLoadedCo },
                { ui: this._btnActionState,             callback: this._onTouchedBtnActionState },
                { ui: this._btnUnitType,                callback: this._onTouchedBtnUnitType },
                { ui: this._inputHp,                    callback: this._onFocusOutInputHp,                  eventType: FocusEvent.FOCUS_OUT },
                { ui: this._inputFuel,                  callback: this._onFocusOutInputFuel,                eventType: FocusEvent.FOCUS_OUT },
                { ui: this._inputPromotion,             callback: this._onFocusOutInputPromotion,           eventType: FocusEvent.FOCUS_OUT },
                { ui: this._inputPrimaryAmmo,           callback: this._onFocusOutInputPrimaryAmmo,         eventType: FocusEvent.FOCUS_OUT },
                { ui: this._inputFlareAmmo,             callback: this._onFocusOutInputFlareAmmo,           eventType: FocusEvent.FOCUS_OUT },
                { ui: this._inputBuildMaterial,         callback: this._onFocusOutInputBuildMaterial,       eventType: FocusEvent.FOCUS_OUT },
                { ui: this._inputProduceMaterial,       callback: this._onFocusOutInputProduceMaterial,     eventType: FocusEvent.FOCUS_OUT },
            ]);
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,            callback: this._onNotifyLanguageChanged },
            ]);
            this._setIsTouchMaskEnabled();
            this._setIsCloseOnTouchedMask();
        }
        protected async _updateOnOpenDataChanged(): Promise<void> {
            const loaderUnit = this._getOpenData().loaderUnit;
            this._resetUnitData((loaderUnit.getGameConfig().getUnitTypesByCategory(Helpers.getExisted(loaderUnit.getLoadUnitCategory())) ?? [])[0]);
            this._updateView();
        }
        protected _onClosing(): void {
            // nothing to do
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Event callbacks.
        ////////////////////////////////////////////////////////////////////////////////
        private _onTouchedBtnConfirm(): void {
            const openData  = this._getOpenData();
            const unitData  = this._getUnitData();
            const errorTips = getErrorTipsForAddUnit({ war: openData.war, unitData });
            if (errorTips) {
                FloatText.show(errorTips);
            } else {
                openData.callback(unitData);
                this.close();
            }
        }

        private _onTouchedBtnAiMode(): void {
            const unitData  = this._getUnitData();
            const aiMode    = unitData.aiMode;
            if (aiMode === Types.UnitAiMode.NoMove) {
                unitData.aiMode = Types.UnitAiMode.Normal;
            } else if ((aiMode === Types.UnitAiMode.Normal) || (aiMode == null)) {
                unitData.aiMode = Types.UnitAiMode.WaitUntilCanAttack;
            } else {
                unitData.aiMode = Types.UnitAiMode.NoMove;
            }
            this._updateComponentsForData();
        }
        private _onTouchedGroupIsDiving(): void {
            const unitData      = this._getUnitData();
            unitData.isDiving   = unitData.isDiving ? null : true;
            this._updateComponentsForData();
        }
        private _onTouchedGroupHasLoadedCo(): void {
            const unitData          = this._getUnitData();
            unitData.hasLoadedCo    = unitData.hasLoadedCo ? null : true;
            this._updateComponentsForData();
        }
        private _onTouchedBtnActionState(): void {
            const unitData = this._getUnitData();
            if (unitData.actionState === Types.UnitActionState.Acted) {
                unitData.actionState = null;
            } else {
                unitData.actionState = Types.UnitActionState.Acted;
            }
            this._updateComponentsForData();
        }
        private _onTouchedBtnUnitType(): void {
            const data          = this._getOpenData();
            const loaderUnit    = data.loaderUnit;
            PanelHelpers.open(PanelHelpers.PanelDict.CommonChooseSingleUnitTypePanel, {
                gameConfig      : loaderUnit.getGameConfig(),
                currentUnitType : Helpers.getExisted(this._getUnitData().unitType),
                unitTypeArray   : loaderUnit.getGameConfig().getUnitTypesByCategory(Helpers.getExisted(loaderUnit.getLoadUnitCategory())) ?? [],
                playerIndex     : loaderUnit.getPlayerIndex(),
                callback        : unitType => {
                    this._resetUnitData(unitType);
                    this._updateView();
                },
            });
        }
        private _onFocusOutInputHp(): void {
            const data      = this._getOpenData();
            const unitData  = this._getUnitData();
            const maxHp     = Helpers.getExisted(data.war.getGameConfig().getUnitTemplateCfg(Helpers.getExisted(unitData.unitType))?.maxHp);
            const currentHp = unitData.currentHp == null ? maxHp : unitData.currentHp;
            const newHp     = Math.max(0, Math.min(parseInt(this._inputHp.text) || 0, maxHp));
            if (newHp !== currentHp) {
                unitData.currentHp = newHp === maxHp ? null : newHp;
                this._updateComponentsForData();
            }
        }
        private _onFocusOutInputFuel(): void {
            const data          = this._getOpenData();
            const unitData      = this._getUnitData();
            const maxFuel       = Helpers.getExisted(data.war.getGameConfig().getUnitTemplateCfg(Helpers.getExisted(unitData.unitType))?.maxFuel);
            const currentFuel   = unitData.currentFuel == null ? maxFuel : unitData.currentFuel;
            const newFuel       = Math.max(0, Math.min(parseInt(this._inputFuel.text) || 0, maxFuel));
            if (newFuel !== currentFuel) {
                unitData.currentFuel = newFuel === maxFuel ? null : newFuel;
                this._updateComponentsForData();
            }
        }
        private _onFocusOutInputPromotion(): void {
            const data              = this._getOpenData();
            const unitData          = this._getUnitData();
            const maxPromotion      = data.war.getGameConfig().getUnitMaxPromotion();
            const currentPromotion  = unitData.currentPromotion || 0;
            const newPromotion      = Math.max(0, Math.min(parseInt(this._inputPromotion.text) || 0, maxPromotion));
            if (newPromotion !== currentPromotion) {
                unitData.currentPromotion = newPromotion === 0 ? null : newPromotion;
                this._updateComponentsForData();
            }
        }
        private _onFocusOutInputPrimaryAmmo(): void {
            const data          = this._getOpenData();
            const unitData      = this._getUnitData();
            const maxAmmo       = Helpers.getExisted(data.war.getGameConfig().getUnitTemplateCfg(Helpers.getExisted(unitData.unitType))?.primaryWeaponMaxAmmo);
            const currentAmmo   = unitData.primaryWeaponCurrentAmmo == null ? maxAmmo : unitData.primaryWeaponCurrentAmmo;
            const newAmmo       = Math.max(0, Math.min(parseInt(this._inputPrimaryAmmo.text) || 0, maxAmmo));
            if (newAmmo !== currentAmmo) {
                unitData.primaryWeaponCurrentAmmo = newAmmo === maxAmmo ? null : newAmmo;
                this._updateComponentsForData();
            }
        }
        private _onFocusOutInputFlareAmmo(): void {
            const data          = this._getOpenData();
            const unitData      = this._getUnitData();
            const maxAmmo       = Helpers.getExisted(data.war.getGameConfig().getUnitTemplateCfg(Helpers.getExisted(unitData.unitType))?.flareMaxAmmo);
            const currentAmmo   = unitData.flareCurrentAmmo == null ? maxAmmo : unitData.flareCurrentAmmo;
            const newAmmo       = Math.max(0, Math.min(parseInt(this._inputFlareAmmo.text) || 0, maxAmmo));
            if (newAmmo !== currentAmmo) {
                unitData.flareCurrentAmmo = newAmmo === maxAmmo ? null : newAmmo;
                this._updateComponentsForData();
            }
        }
        private _onFocusOutInputBuildMaterial(): void {
            const data              = this._getOpenData();
            const unitData          = this._getUnitData();
            const maxMaterial       = Helpers.getExisted(data.war.getGameConfig().getUnitTemplateCfg(Helpers.getExisted(unitData.unitType))?.maxBuildMaterial);
            const currentMaterial   = unitData.currentBuildMaterial == null ? maxMaterial : unitData.currentBuildMaterial;
            const newMaterial       = Math.max(0, Math.min(parseInt(this._inputBuildMaterial.text) || 0, maxMaterial));
            if (newMaterial !== currentMaterial) {
                unitData.currentBuildMaterial = newMaterial === maxMaterial ? null : newMaterial;
                this._updateComponentsForData();
            }
        }
        private _onFocusOutInputProduceMaterial(): void {
            const data              = this._getOpenData();
            const unitData          = this._getUnitData();
            const maxMaterial       = Helpers.getExisted(data.war.getGameConfig().getUnitTemplateCfg(Helpers.getExisted(unitData.unitType))?.maxProduceMaterial);
            const currentMaterial   = unitData.currentProduceMaterial == null ? maxMaterial : unitData.currentProduceMaterial;
            const newMaterial       = Math.max(0, Math.min(parseInt(this._inputProduceMaterial.text) || 0, maxMaterial));
            if (newMaterial !== currentMaterial) {
                unitData.currentProduceMaterial = newMaterial === maxMaterial ? null : newMaterial;
                this._updateComponentsForData();
            }
        }

        private _onNotifyLanguageChanged(): void {
            this._updateComponentsForLanguage();
        }

        ////////////////////////////////////////////////////////////////////////////////
        // View functions.
        ////////////////////////////////////////////////////////////////////////////////
        private _updateView(): void {
            this._updateComponentsForLanguage();

            this._updateComponentsForData();
        }

        private _updateComponentsForLanguage(): void {
            this._labelTitle.text               = Lang.getText(LangTextType.B0811);
            this._btnBack.label                 = Lang.getText(LangTextType.B0146);
            this._btnConfirm.label              = Lang.getText(LangTextType.B0026);
            this._btnAiMode.label               = Lang.getText(LangTextType.B0720);
            this._labelIsDiving.text            = Lang.getText(LangTextType.B0371);
            this._labelHasLoadedCo.text         = Lang.getText(LangTextType.B0421);
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
            this._updateComponentsForAiMode();
            this._updateComponentsForIsDiving();
            this._updateComponentsForHasLoadedCo();
            this._updateComponentsForActionState();
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
            const data      = this._getOpenData();
            const label     = this._labelError;
            const errorTips = getErrorTipsForAddUnit({
                unitData    : this._getUnitData(),
                war         : data.war,
            });
            label.text      = errorTips || Lang.getText(LangTextType.B0493);
            label.textColor = errorTips ? ColorValue.Red : ColorValue.Green;
        }
        private _updateComponentsForAiMode(): void {
            this._labelAiMode.text  = Lang.getUnitAiModeName(this._getUnitData().aiMode ?? Types.UnitAiMode.Normal) ?? CommonConstants.ErrorTextForUndefined;
        }
        private _updateComponentsForIsDiving(): void {
            const data      = this._getOpenData();
            const group     = this._groupIsDiving;
            const unitData  = this._getUnitData();
            const unitCfg   = data.war.getGameConfig().getUnitTemplateCfg(Helpers.getExisted(unitData.unitType));
            if ((!unitCfg) || (!unitCfg.diveCfgs)) {
                group.visible = false;
            } else {
                group.visible               = true;
                this._imgIsDiving.visible   = !!unitData.isDiving;
            }
        }
        private _updateComponentsForHasLoadedCo(): void {
            this._imgHasLoadedCo.visible = !!this._getUnitData().hasLoadedCo;
        }
        private _updateComponentsForActionState(): void {
            const label = this._labelActionState;
            const state = this._getUnitData().actionState;
            label.text  = state == null
                ? (Lang.getUnitActionStateText(Types.UnitActionState.Idle) ?? CommonConstants.ErrorTextForUndefined)
                : (Lang.getUnitActionStateText(state) ?? CommonConstants.ErrorTextForUndefined);
        }
        private _updateComponentsForUnitType(): void {
            this._labelUnitType.text = Lang.getUnitName(Helpers.getExisted(this._getUnitData().unitType), this._getOpenData().war.getGameConfig()) ?? CommonConstants.ErrorTextForUndefined;
        }
        private _updateComponentsForHp(): void {
            const data      = this._getOpenData();
            const input     = this._inputHp;
            const unitData  = this._getUnitData();
            const currentHp = unitData.currentHp;
            input.text      = currentHp == null
                ? `${data.war.getGameConfig().getUnitTemplateCfg(Helpers.getExisted(unitData.unitType))?.maxHp}`
                : `${currentHp}`;
        }
        private _updateComponentsForFuel(): void {
            const data          = this._getOpenData();
            const input         = this._inputFuel;
            const unitData      = this._getUnitData();
            const currentFuel   = unitData.currentFuel;
            input.text          = currentFuel == null
                ? `${data.war.getGameConfig().getUnitTemplateCfg(Helpers.getExisted(unitData.unitType))?.maxFuel}`
                : `${currentFuel}`;
        }
        private _updateComponentsForPromotion(): void {
            this._inputPromotion.text = `${this._getUnitData().currentPromotion || 0}`;
        }
        private _updateComponentsForPrimaryAmmo(): void {
            const data      = this._getOpenData();
            const group     = this._groupPrimaryAmmo;
            const unitData  = this._getUnitData();
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
            const data      = this._getOpenData();
            const group     = this._groupFlareAmmo;
            const unitData  = this._getUnitData();
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
            const data          = this._getOpenData();
            const group         = this._groupBuildMaterial;
            const unitData      = this._getUnitData();
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
            const data          = this._getOpenData();
            const group         = this._groupProduceMaterial;
            const unitData      = this._getUnitData();
            const maxMaterial   = data.war.getGameConfig().getUnitTemplateCfg(Helpers.getExisted(unitData.unitType))?.maxProduceMaterial;
            if (!maxMaterial) {
                group.visible = false;
            } else {
                group.visible = true;

                const currentMaterial           = unitData.currentProduceMaterial;
                this._inputProduceMaterial.text = `${currentMaterial == null ? maxMaterial : currentMaterial}`;
            }
        }

        private _resetUnitData(unitType: number): void {
            const loaderUnit    = this._getOpenData().loaderUnit;
            this._unitData      = {
                gridIndex   : Helpers.deepClone(loaderUnit.getGridIndex()),
                unitType,
                playerIndex : loaderUnit.getPlayerIndex(),
                loaderUnitId: loaderUnit.getUnitId(),
            };
        }
        private _getUnitData(): CommonProto.WarSerialization.ISerialUnit {
            return Helpers.getExisted(this._unitData);
        }
    }

    function getErrorTipsForAddUnit({ unitData, war }: {
        unitData    : CommonProto.WarSerialization.ISerialUnit;
        war         : BaseWar.BwWar;
    }): string | null {
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
                (playerIndex < CommonConstants.WarFirstPlayerIndex)
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
            if ((currentPromotion != null) &&
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

// export default TwnsCommonAddLoadedUnitPanel;
