
// import CommonConstants          from "../../tools/helpers/CommonConstants";
// import ConfigManager            from "../../tools/helpers/ConfigManager";
// import Helpers                  from "../../tools/helpers/Helpers";
// import Types                    from "../../tools/helpers/Types";
// import Lang                     from "../../tools/lang/Lang";
// import TwnsLangTextType         from "../../tools/lang/LangTextType";
// import Notify                   from "../../tools/notify/Notify";
// import Twns.Notify           from "../../tools/notify/NotifyType";
// import ProtoTypes               from "../../tools/proto/ProtoTypes";
// import TwnsUiButton             from "../../tools/ui/UiButton";
// import TwnsUiLabel              from "../../tools/ui/UiLabel";
// import TwnsUiListItemRenderer   from "../../tools/ui/UiListItemRenderer";
// import TwnsUiPanel              from "../../tools/ui/UiPanel";
// import TwnsUiScrollList         from "../../tools/ui/UiScrollList";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.WarEvent {
    import NotifyType       = Twns.Notify.NotifyType;
    import IDataForAddUnit  = CommonProto.WarEvent.WeaAddUnit.IDataForAddUnit;
    import LangTextType     = Twns.Lang.LangTextType;

    export type OpenDataForWeActionAddUnitListPanel = {
        gameConfig      : Config.GameConfig;
        dataForAddUnit  : IDataForAddUnit;
    };
    export class WeActionAddUnitListPanel extends TwnsUiPanel.UiPanel<OpenDataForWeActionAddUnitListPanel> {
        private readonly _labelTitle!   : TwnsUiLabel.UiLabel;
        private readonly _btnClose!     : TwnsUiButton.UiButton;
        private readonly _listType!     : TwnsUiScrollList.UiScrollList<DataForTypeRenderer>;

        protected _onOpening(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,    callback: this._onNotifyLanguageChanged },
            ]);
            this._setUiListenerArray([
                { ui: this._btnClose,       callback: this.close },
            ]);
            this._setIsTouchMaskEnabled(true);
            this._setIsCloseOnTouchedMask();

            this._listType.setItemRenderer(TypeRenderer);
        }
        protected async _updateOnOpenDataChanged(): Promise<void> {
            this._updateView();
        }
        protected _onClosing(): void {
            // nothing to do
        }

        private _onNotifyLanguageChanged(): void {
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
            for (const newUnitType of openData.gameConfig.getUnitTypesByCategory(Twns.Types.UnitCategory.All) ?? []) {
                dataArray.push({
                    newUnitType,
                    dataForAddUnit,
                });
            }
            this._listType.bindData(dataArray);
        }
    }

    type DataForTypeRenderer = {
        newUnitType     : Twns.Types.UnitType;
        dataForAddUnit  : IDataForAddUnit;
    };
    class TypeRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForTypeRenderer> {
        private readonly _labelType!    : TwnsUiLabel.UiLabel;

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

        private _onTouchedSelf(): void {
            const data = this._getData();
            resetUnitType(data.dataForAddUnit, data.newUnitType);
            Twns.PanelHelpers.close(Twns.PanelHelpers.PanelDict.WeActionAddUnitListPanel);
            Twns.Notify.dispatch(NotifyType.WarEventFullDataChanged);
        }
        private _onNotifyLanguageChanged(): void {        // DONE
            this._updateComponentsForLanguage();
        }

        private _updateComponentsForLanguage(): void {
            this._updateLabelType();
        }

        private _updateLabelType(): void {
            const data  = this.data;
            const label = this._labelType;
            if (data == null) {
                label.text = ``;
            } else {
                label.text = Lang.getUnitName(data.newUnitType) || CommonConstants.ErrorTextForUndefined;
            }
        }
    }

    function resetUnitType(data: IDataForAddUnit, unitType: Twns.Types.UnitType): void {
        const unitData = Twns.Helpers.getExisted(data.unitData);
        if (unitData.unitType !== unitType) {
            unitData.unitType                   = unitType;
            unitData.primaryWeaponCurrentAmmo   = null;
            unitData.isCapturingTile            = null;
            unitData.isDiving                   = null;
            unitData.flareCurrentAmmo           = null;
            unitData.currentFuel                = null;
            unitData.currentBuildMaterial       = null;
            unitData.currentProduceMaterial     = null;
            unitData.isBuildingTile             = null;
        }
    }
}

// export default TwnsWeActionAddUnitListPanel;
