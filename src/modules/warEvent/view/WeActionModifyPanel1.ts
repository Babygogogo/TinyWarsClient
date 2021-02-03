
namespace TinyWars.WarEvent {
    import Helpers              = Utility.Helpers;
    import Lang                 = Utility.Lang;
    import Notify               = Utility.Notify;
    import Types                = Utility.Types;
    import FloatText            = Utility.FloatText;
    import Logger               = Utility.Logger;
    import ProtoTypes           = Utility.ProtoTypes;
    import ConfigManager        = Utility.ConfigManager;
    import ColorValue           = Types.ColorValue;
    import IWarEventFullData    = ProtoTypes.Map.IWarEventFullData;
    import IWarEventAction      = ProtoTypes.WarEvent.IWarEventAction;
    import CommonConstants      = ConfigManager.COMMON_CONSTANTS;

    type OpenDataForWeActionModifyPanel1 = {
        war         : BaseWar.BwWar;
        fullData    : IWarEventFullData;
        action      : IWarEventAction;
    }
    export class WeActionModifyPanel1 extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Hud0;
        protected readonly _IS_EXCLUSIVE = false;

        private static _instance: WeActionModifyPanel1;

        private _btnBack        : GameUi.UiButton;
        private _btnAddUnit     : GameUi.UiButton;
        private _btnClear       : GameUi.UiButton;
        private _labelTitle     : GameUi.UiLabel;
        private _labelUnitsCount: GameUi.UiLabel;
        private _labelError     : GameUi.UiLabel;
        private _listUnit       : GameUi.UiScrollList;

        public static show(openData: OpenDataForWeActionModifyPanel1): void {
            if (!WeActionModifyPanel1._instance) {
                WeActionModifyPanel1._instance = new WeActionModifyPanel1();
            }
            WeActionModifyPanel1._instance.open(openData);
        }
        public static hide(): void {
            if (WeActionModifyPanel1._instance) {
                WeActionModifyPanel1._instance.close();
            }
        }

        public constructor() {
            super();

            this._setIsAutoAdjustHeight();
            this.skinName = "resource/skins/warEvent/WeActionModifyPanel1.exml";
        }

        protected _onOpened(): void {
            this._setUiListenerArray([
                { ui: this._btnAddUnit,     callback: this._onTouchedBtnAddUnit },
                { ui: this._btnClear,       callback: this._onTouchedBtnClear },
                { ui: this._btnBack,        callback: this.close },
            ]);
            this._setNotifyListenerArray([
                { type: Notify.Type.LanguageChanged,            callback: this._onNotifyLanguageChanged },
                { type: Notify.Type.WarEventFullDataChanged,    callback: this._onNotifyWarEventFullDataChanged },
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
            const unitArray = this._getOpenData<OpenDataForWeActionModifyPanel1>().action.WarEventActionAddUnit.unitArray;
            if (unitArray.length > CommonConstants.WarEventActionAddUnitMaxCount) {
                FloatText.show(Lang.getText(Lang.Type.A0189));
            } else {
                unitArray.push(WarEventHelper.getDefaultAddUnitData());
                Notify.dispatch(Notify.Type.WarEventFullDataChanged);
            }
        }

        private _onTouchedBtnClear(e: egret.TouchEvent): void {
            const openData = this._getOpenData<OpenDataForWeActionModifyPanel1>();
            Common.CommonConfirmPanel.show({
                title   : Lang.getText(Lang.Type.B0088),
                content : Lang.getText(Lang.Type.A0190),
                callback: () => {
                    openData.action.WarEventActionAddUnit.unitArray.length = 0;
                    Notify.dispatch(Notify.Type.WarEventFullDataChanged);
                }
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
            this._labelTitle.text   = Lang.getText(Lang.Type.B0469);
            this._btnAddUnit.label  = Lang.getText(Lang.Type.B0497);
            this._btnClear.label    = Lang.getText(Lang.Type.B0498);
            this._btnBack.label     = Lang.getText(Lang.Type.B0146);
        }

        private _updateComponentsForUnits(): void {
            const openData  = this._getOpenData<OpenDataForWeActionModifyPanel1>();
            const action    = openData.action;
            const war       = openData.war;
            const dataArray : DataForUnitRenderer[] = [];
            for (const unitData of action.WarEventActionAddUnit.unitArray || []) {
                dataArray.push({
                    war,
                    action,
                    unitData,
                });
            }

            this._labelUnitsCount.text = `${Lang.getText(Lang.Type.B0524)}: ${dataArray.length}`;
            this._listUnit.bindData(dataArray);
        }
    }

    type DataForUnitRenderer = {
        war         : BaseWar.BwWar;
        action      : IWarEventAction;
        unitData    : ProtoTypes.WarEvent.WarEventActionAddUnit.IDataForAddUnit;
    }
    class UnitRenderer extends GameUi.UiListItemRenderer {
        private _btnDelete              : GameUi.UiButton;
        private _labelError             : GameUi.UiLabel;

        private _groupCanBeBlockedByUnit: eui.Group;
        private _labelCanBeBlockedByUnit: GameUi.UiLabel;
        private _imgCanBeBlockedByUnit  : GameUi.UiImage;

        private _groupNeedMovableTile   : eui.Group;
        private _labelNeedMovableTile   : GameUi.UiLabel;
        private _imgNeedMovableTile     : GameUi.UiImage;

        private _labelGridIndex         : GameUi.UiLabel;
        private _inputGridX             : GameUi.UiTextInput;
        private _inputGridY             : GameUi.UiTextInput;

        private _labelPlayerIndex       : GameUi.UiLabel;
        private _inputPlayerIndex       : GameUi.UiTextInput;

        private _btnUnitType            : GameUi.UiButton;
        private _labelUnitType          : GameUi.UiLabel;

        private _btnActionState         : GameUi.UiButton;
        private _labelActionState       : GameUi.UiLabel;

        private _labelHp                : GameUi.UiLabel;
        private _inputHp                : GameUi.UiTextInput;

        private _labelFuel              : GameUi.UiLabel;
        private _inputFuel              : GameUi.UiTextInput;

        private _labelPromotion         : GameUi.UiLabel;
        private _inputPromotion         : GameUi.UiTextInput;

        private _groupHasLoadedCo       : eui.Group;
        private _labelHasLoadedCo       : GameUi.UiLabel;
        private _imgHasLoadedCo         : GameUi.UiImage;

        private _groupPrimaryAmmo       : eui.Group;
        private _labelPrimaryAmmo       : GameUi.UiLabel;
        private _inputPrimaryAmmo       : GameUi.UiTextInput;

        private _groupFlareAmmo         : eui.Group;
        private _labelFlareAmmo         : GameUi.UiLabel;
        private _inputFlareAmmo         : GameUi.UiTextInput;

        private _groupIsDiving          : eui.Group;
        private _labelIsDiving          : GameUi.UiLabel;
        private _imgIsDiving            : GameUi.UiImage;

        private _groupBuildMaterial     : eui.Group;
        private _labelBuildMaterial     : GameUi.UiLabel;
        private _inputBuildMaterial     : GameUi.UiTextInput;

        private _groupProduceMaterial   : eui.Group;
        private _labelProduceMaterial   : GameUi.UiLabel;
        private _inputProduceMaterial   : GameUi.UiTextInput;

        protected _onOpened(): void {
            this._setUiListenerArray([
                { ui: this._btnDelete,  callback: this._onTouchedBtnDelete },
            ]);
            this._setNotifyListenerArray([
                { type: Notify.Type.LanguageChanged,            callback: this._onNotifyLanguageChanged },
                { type: Notify.Type.WarEventFullDataChanged,    callback: this._onNotifyWarEventFullDataChanged },
            ]);
            this._updateComponentsForLanguage();
        }

        private _onTouchedBtnDelete(e: egret.TouchEvent): void {
            const data = this.data as DataForUnitRenderer;
            if (data) {
                Common.CommonConfirmPanel.show({
                    title   : Lang.getText(Lang.Type.B0088),
                    content : Lang.getText(Lang.Type.A0029),
                    callback: () => {
                        Helpers.deleteElementFromArray(data.action.WarEventActionAddUnit.unitArray, data.unitData);
                        Notify.dispatch(Notify.Type.WarEventFullDataChanged);
                    },
                });
            }
        }

        private _onNotifyLanguageChanged(e: egret.Event): void {
            this._updateComponentsForLanguage();

            this._updateComponentsForData();
        }
        private _onNotifyWarEventFullDataChanged(e: egret.Event): void {
            this._updateComponentsForData();
        }

        protected dataChanged(): void {
            super.dataChanged();

            this._updateComponentsForData();
        }

        private _updateComponentsForLanguage(): void {
            this._btnDelete.label = Lang.getText(Lang.Type.B0220);
        }
        private _updateComponentsForData(): void {
            this._updateLabelError();
        }
        private _updateLabelError(): void {
            const data  = this.data as DataForUnitRenderer;
            const label = this._labelError;
            if (data == null) {
                label.text = undefined;
                return;
            }

            const errorTips = getErrorTipsForAddUnit({
                dataForAddUnit  : data.unitData,
                war             : data.war,
            });
            label.text      = errorTips || Lang.getText(Lang.Type.B0493);
            label.textColor = errorTips ? Types.ColorValue.Red : Types.ColorValue.Green;
        }
    }

    function getErrorTipsForAddUnit({ dataForAddUnit, war }: {
        dataForAddUnit  : ProtoTypes.WarEvent.WarEventActionAddUnit.IDataForAddUnit;
        war             : BaseWar.BwWar;
    }): string | undefined {
        if (dataForAddUnit.canBeBlockedByUnit == null) {
            return Lang.getText(Lang.Type.A0192);
        }

        if (dataForAddUnit.needMovableTile == null) {
            return Lang.getText(Lang.Type.A0193);
        }

        const {
               currentFuel,                currentHp,
            currentProduceMaterial, currentPromotion,       flareCurrentAmmo,           gridIndex,
            hasLoadedCo,            isBuildingTile,         isCapturingTile,            isDiving,
            loaderUnitId,           playerIndex,            primaryWeaponCurrentAmmo,   unitId,
        } = dataForAddUnit.unitData;

        const unitData  = dataForAddUnit.unitData;
        const unitCfg   = ConfigManager.getUnitTemplateCfg(war.getConfigVersion(), unitData.unitType);
        if (unitCfg == null) {
            return Lang.getText(Lang.Type.A0195);
        }

        const actionState = unitData.actionState;
        if ((actionState !== Types.UnitActionState.Acted) &&
            (actionState !== Types.UnitActionState.Idle)
        ) {
            return Lang.getText(Lang.Type.A0194);
        }

        const currentBuildMaterial  = unitData.currentBuildMaterial;
        const maxBuildMaterial      = unitCfg.maxBuildMaterial;
        if (maxBuildMaterial == null) {
            if (currentBuildMaterial != null) {
                return Lang.getText(Lang.Type.A0196);
            }
        } else {
            if ((currentBuildMaterial < 0) || (currentBuildMaterial > maxBuildMaterial)) {
                return Lang.getText(Lang.Type.A0196);
            }
        }
    }
}
