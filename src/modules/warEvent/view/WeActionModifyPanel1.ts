
namespace TinyWars.WarEvent {
    import Helpers              = Utility.Helpers;
    import Lang                 = Utility.Lang;
    import Notify               = Utility.Notify;
    import Types                = Utility.Types;
    import FloatText            = Utility.FloatText;
    import Logger               = Utility.Logger;
    import ProtoTypes           = Utility.ProtoTypes;
    import ColorValue           = Types.ColorValue;
    import IWarEventFullData    = ProtoTypes.Map.IWarEventFullData;
    import IWarEventAction      = ProtoTypes.WarEvent.IWarEventAction;

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
        private _labelNoUnit    : GameUi.UiLabel;
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
        protected _onClosed(): void {
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Event callbacks.
        ////////////////////////////////////////////////////////////////////////////////
        private _onNotifyLanguageChanged(e: egret.Event): void {
            this._updateComponentsForLanguage();
        }

        private _onNotifyWarEventFullDataChanged(e: egret.Event): void {
            this._updateListUnitAndLabelNoUnit();
        }

        private _onTouchedBtnAddUnit(e: egret.TouchEvent): void {
            const openData = this._getOpenData<OpenDataForWeActionModifyPanel1>();
            // TODO
        }

        private _onTouchedBtnClear(e: egret.TouchEvent): void {
            const openData = this._getOpenData<OpenDataForWeActionModifyPanel1>();
            // TODO
        }

        ////////////////////////////////////////////////////////////////////////////////
        // View functions.
        ////////////////////////////////////////////////////////////////////////////////
        private _updateView(): void {
            this._updateComponentsForLanguage();

            this._updateListUnitAndLabelNoUnit();
        }

        private _updateComponentsForLanguage(): void {
            this._labelNoUnit.text  = Lang.getText(Lang.Type.B0278);
            this._labelTitle.text   = Lang.getText(Lang.Type.B0469);
            this._btnAddUnit.label  = Lang.getText(Lang.Type.B0497);
            this._btnClear.label    = Lang.getText(Lang.Type.B0498);
            this._btnBack.label     = Lang.getText(Lang.Type.B0146);
        }

        private _updateListUnitAndLabelNoUnit(): void {
            const action    = this._getOpenData<OpenDataForWeActionModifyPanel1>().action;
            const dataArray : DataForUnitRenderer[] = [];
            for (const unitData of action.WarEventActionAddUnit.unitArray || []) {
                dataArray.push({
                    action,
                    unitData,
                });
            }

            this._labelNoUnit.visible = !dataArray.length;
            this._listUnit.bindData(dataArray);
        }
    }

    type DataForUnitRenderer = {
        action  : IWarEventAction;
        unitData: ProtoTypes.WarEvent.WarEventActionAddUnit.IDataForAddUnit;
    }
    class UnitRenderer extends GameUi.UiListItemRenderer {
        private _btnModify  : GameUi.UiButton;

        protected _onOpened(): void {
            this._setUiListenerArray([
                { ui: this._btnModify, callback: this._onTouchedBtnModify },
            ]);
            this._setNotifyListenerArray([
                { type: Notify.Type.LanguageChanged,    callback: this._onNotifyLanguageChanged },
            ]);
            this._updateComponentsForLanguage();
        }

        private _onTouchedBtnModify(e: egret.TouchEvent): void {
            const data = this.data as DataForUnitRenderer;
            if (data) {
                // TODO
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
            this._btnModify.label = Lang.getText(Lang.Type.B0317);
        }

        private _updateView(): void {
            // TODO
        }
    }
}
