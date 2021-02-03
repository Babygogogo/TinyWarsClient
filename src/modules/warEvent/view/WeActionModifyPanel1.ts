
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
            const action    = this._getOpenData<OpenDataForWeActionModifyPanel1>().action;
            const dataArray : DataForUnitRenderer[] = [];
            for (const unitData of action.WarEventActionAddUnit.unitArray || []) {
                dataArray.push({
                    action,
                    unitData,
                });
            }

            this._labelUnitsCount.text = `${Lang.getText(Lang.Type.B0524)}: ${dataArray.length}`;
            this._listUnit.bindData(dataArray);
        }
    }

    type DataForUnitRenderer = {
        action  : IWarEventAction;
        unitData: ProtoTypes.WarEvent.WarEventActionAddUnit.IDataForAddUnit;
    }
    class UnitRenderer extends GameUi.UiListItemRenderer {
        private _btnDelete  : GameUi.UiButton;
        // return (v.canBeBlockedByUnit != null)
        // && (v.needMovableTile != null)
        // Structure.GridIndex gridIndex                   = 1;
        // uint32              playerIndex                 = 2;
        // uint32              unitType                    = 3;
        // uint32              actionState                 = 11;
        // uint32              primaryWeaponCurrentAmmo    = 12;
        // uint32              currentHp                   = 13;
        // bool                isDiving                    = 15;
        // uint32              flareCurrentAmmo            = 16;
        // uint32              currentFuel                 = 17;
        // uint32              currentBuildMaterial        = 18;
        // uint32              currentProduceMaterial      = 19;
        // uint32              currentPromotion            = 20;
        // bool                hasLoadedCo                 = 23;

        protected _onOpened(): void {
            this._setUiListenerArray([
                { ui: this._btnDelete,  callback: this._onTouchedBtnDelete },
            ]);
            this._setNotifyListenerArray([
                { type: Notify.Type.LanguageChanged,    callback: this._onNotifyLanguageChanged },
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
        }

        protected dataChanged(): void {
            super.dataChanged();

            this._updateView();
        }

        private _updateComponentsForLanguage(): void {
            this._btnDelete.label = Lang.getText(Lang.Type.B0220);
        }

        private _updateView(): void {
            // TODO
        }
    }
}
