
import { UiListItemRenderer }           from "../../../gameui/UiListItemRenderer";
import { UiPanel }                      from "../../../gameui/UiPanel";
import { UiButton }                     from "../../../gameui/UiButton";
import { UiLabel }                      from "../../../gameui/UiLabel";
import { UiScrollList }                 from "../../../gameui/UiScrollList";
import * as ConfigManager               from "../../../utility/ConfigManager";
import * as Lang                        from "../../../utility/Lang";
import { LangTextType } from "../../../utility/LangTextType";
import * as Notify                      from "../../../utility/Notify";
import { NotifyType } from "../../../utility/NotifyType";
import * as ProtoTypes                  from "../../../utility/ProtoTypes";
import * as Types                       from "../../../utility/Types";
import IDataForAddUnit                  = ProtoTypes.WarEvent.WeaAddUnit.IDataForAddUnit;

type OpenDataForWeActionAddUnitListPanel = {
    configVersion   : string;
    dataForAddUnit  : IDataForAddUnit;
};
export class WeActionAddUnitListPanel extends UiPanel<OpenDataForWeActionAddUnitListPanel> {
    protected readonly _LAYER_TYPE   = Types.LayerType.Hud1;
    protected readonly _IS_EXCLUSIVE = false;

    private static _instance: WeActionAddUnitListPanel;

    private _labelTitle : UiLabel;
    private _btnClose   : UiButton;
    private _listType   : UiScrollList<DataForTypeRenderer>;

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
class TypeRenderer extends UiListItemRenderer<DataForTypeRenderer> {
    private _labelType  : UiLabel;

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
