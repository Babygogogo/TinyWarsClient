
import ConfigManager            from "../../tools/helpers/ConfigManager";
import Types                    from "../../tools/helpers/Types";
import Lang                     from "../../tools/lang/Lang";
import TwnsLangTextType         from "../../tools/lang/LangTextType";
import Notify                   from "../../tools/notify/Notify";
import TwnsNotifyType           from "../../tools/notify/NotifyType";
import ProtoTypes               from "../../tools/proto/ProtoTypes";
import TwnsUiButton             from "../../tools/ui/UiButton";
import TwnsUiLabel              from "../../tools/ui/UiLabel";
import TwnsUiListItemRenderer   from "../../tools/ui/UiListItemRenderer";
import TwnsUiPanel              from "../../tools/ui/UiPanel";
import TwnsUiScrollList         from "../../tools/ui/UiScrollList";

namespace TwnsWeActionAddUnitListPanel {
    import NotifyType       = TwnsNotifyType.NotifyType;
    import IDataForAddUnit  = ProtoTypes.WarEvent.WeaAddUnit.IDataForAddUnit;
    import LangTextType     = TwnsLangTextType.LangTextType;

    type OpenDataForWeActionAddUnitListPanel = {
        configVersion   : string;
        dataForAddUnit  : IDataForAddUnit;
    };
    export class WeActionAddUnitListPanel extends TwnsUiPanel.UiPanel<OpenDataForWeActionAddUnitListPanel> {
        protected readonly _LAYER_TYPE   = Types.LayerType.Hud1;
        protected readonly _IS_EXCLUSIVE = false;

        private static _instance: WeActionAddUnitListPanel;

        private _labelTitle : TwnsUiLabel.UiLabel;
        private _btnClose   : TwnsUiButton.UiButton;
        private _listType   : TwnsUiScrollList.UiScrollList<DataForTypeRenderer>;

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
                { type: NotifyType.LanguageChanged,    callback: this._onNotifyLanguageChanged },
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
            this._labelTitle.text       = Lang.getText(LangTextType.B0516);
            this._btnClose.label        = Lang.getText(LangTextType.B0146);
        }
        private _updateListType(): void {
            const openData          = this._getOpenData();
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
    };
    class TypeRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForTypeRenderer> {
        private _labelType  : TwnsUiLabel.UiLabel;

        protected _onOpened(): void {
            this._setUiListenerArray([
                { ui: this, callback: this._onTouchedSelf },
            ]);
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,    callback: this._onNotifyLanguageChanged },
            ]);

            this._updateComponentsForLanguage();
        }

        protected _onDataChanged(): void {
            this._updateLabelType();
        }

        private _onTouchedSelf(e: egret.TouchEvent): void {
            const data = this.data;
            if (data == null) {
                return;
            }

            resetUnitType(data.dataForAddUnit, data.newUnitType);
            WeActionAddUnitListPanel.hide();
            Notify.dispatch(NotifyType.WarEventFullDataChanged);
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

export default TwnsWeActionAddUnitListPanel;
