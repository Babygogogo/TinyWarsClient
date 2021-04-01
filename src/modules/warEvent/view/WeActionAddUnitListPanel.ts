
namespace TinyWars.WarEvent {
    import Notify               = Utility.Notify;
    import ProtoTypes           = Utility.ProtoTypes;
    import Logger               = Utility.Logger;
    import Types                = Utility.Types;
    import Lang                 = Utility.Lang;
    import FloatText            = Utility.FloatText;
    import ConfigManager        = Utility.ConfigManager;
    import IWarEventFullData    = ProtoTypes.Map.IWarEventFullData;
    import IDataForAddUnit      = ProtoTypes.WarEvent.WarEventActionAddUnit.IDataForAddUnit;

    type OpenDataForWeActionAddUnitListPanel = {
        configVersion   : string;
        dataForAddUnit  : IDataForAddUnit;
    }
    export class WeActionAddUnitListPanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Hud1;
        protected readonly _IS_EXCLUSIVE = false;

        private static _instance: WeActionAddUnitListPanel;

        private _labelTitle : GameUi.UiLabel;
        private _btnClose   : GameUi.UiButton;
        private _listType   : GameUi.UiScrollList<DataForTypeRenderer, TypeRenderer>;

        public static show(openData: OpenDataForWeActionAddUnitListPanel): void {
            if (!WeActionAddUnitListPanel._instance) {
                WeActionAddUnitListPanel._instance = new WeActionAddUnitListPanel();
            }
            WeActionAddUnitListPanel._instance.open(openData);
        }

        public static async hide(): Promise<void> {
            if (WeActionAddUnitListPanel._instance) {
                await WeActionAddUnitListPanel._instance.close();
            }
        }

        private constructor() {
            super();

            this._setIsTouchMaskEnabled(true);
            this._setIsCloseOnTouchedMask();
            this.skinName = "resource/skins/warEvent/WeActionAddUnitListPanel.exml";
        }

        protected _onOpened(): void {
            this._setNotifyListenerArray([
                { type: Notify.Type.LanguageChanged,    callback: this._onNotifyLanguageChanged },
            ]);
            this._setUiListenerArray([
                { ui: this._btnClose,       callback: this.close },
            ]);
            this._listType.setItemRenderer(TypeRenderer);

            this._updateView();
        }

        private _onNotifyLanguageChanged(e: egret.Event): void {
            this._updateComponentsForLanguage();
        }

        private _updateView(): void {
            this._updateComponentsForLanguage();

            this._updateListType();
        }

        private _updateComponentsForLanguage(): void {
            this._labelTitle.text       = Lang.getText(Lang.Type.B0516);
            this._btnClose.label        = Lang.getText(Lang.Type.B0146);
        }
        private _updateListType(): void {
            const openData          = this._getOpenData<OpenDataForWeActionAddUnitListPanel>();
            const dataForAddUnit    = openData.dataForAddUnit;

            const dataArray: DataForTypeRenderer[] = [];
            for (const newUnitType of ConfigManager.getUnitTypesByCategory(openData.configVersion, Types.UnitCategory.All)) {
                dataArray.push({
                    newUnitType,
                    dataForAddUnit,
                });
            }
            this._listType.bindData(dataArray);
        }
    }

    type DataForTypeRenderer = {
        newUnitType     : Types.UnitType;
        dataForAddUnit  : IDataForAddUnit;
    }
    class TypeRenderer extends GameUi.UiListItemRenderer<DataForTypeRenderer> {
        private _labelType  : GameUi.UiLabel;

        protected _onOpened(): void {
            this._setUiListenerArray([
                { ui: this, callback: this._onTouchedSelf },
            ]);
            this._setNotifyListenerArray([
                { type: Notify.Type.LanguageChanged,    callback: this._onNotifyLanguageChanged },
            ]);

            this._updateComponentsForLanguage();
        }

        protected dataChanged(): void {
            super.dataChanged();

            this._updateLabelType();
        }

        private _onTouchedSelf(e: egret.TouchEvent): void {
            const data = this.data;
            if (data == null) {
                return;
            }

            resetUnitType(data.dataForAddUnit, data.newUnitType);
            WeActionAddUnitListPanel.hide();
            Notify.dispatch(Notify.Type.WarEventFullDataChanged);
        }
        private _onNotifyLanguageChanged(e: egret.Event): void {        // DONE
            this._updateComponentsForLanguage();
        }

        private _updateComponentsForLanguage(): void {
            this._updateLabelType();
        }

        private _updateLabelType(): void {
            const data  = this.data;
            const label = this._labelType;
            if (data == null) {
                label.text = undefined;
            } else {
                label.text = Lang.getUnitName(data.newUnitType);
            }
        }
    }

    function resetUnitType(data: IDataForAddUnit, unitType: Types.UnitType): void {
        const unitData = data.unitData;
        if (unitData.unitType !== unitType) {
            unitData.unitType                   = unitType;
            unitData.primaryWeaponCurrentAmmo   = undefined;
            unitData.isCapturingTile            = undefined;
            unitData.isDiving                   = undefined;
            unitData.flareCurrentAmmo           = undefined;
            unitData.currentFuel                = undefined;
            unitData.currentBuildMaterial       = undefined;
            unitData.currentProduceMaterial     = undefined;
            unitData.isBuildingTile             = undefined;
        }
    }
}
