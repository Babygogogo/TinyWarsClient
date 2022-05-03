
// import TwnsBwWar            from "../../baseWar/model/BwWar";
// import Helpers              from "../../tools/helpers/Helpers";
// import Types                from "../../tools/helpers/Types";
// import Lang                 from "../../tools/lang/Lang";
// import TwnsLangTextType     from "../../tools/lang/LangTextType";
// import Twns.Notify       from "../../tools/notify/NotifyType";
// import TwnsUiImage          from "../../tools/ui/UiImage";
// import TwnsUiLabel          from "../../tools/ui/UiLabel";
// import TwnsUiPanel          from "../../tools/ui/UiPanel";
// import MeModel              from "../model/MeModel";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.Common {
    import LangTextType = TwnsLangTextType.LangTextType;
    import NotifyType   = Twns.Notify.NotifyType;
    import UnitType     = Twns.Types.UnitType;
    import GameConfig   = Twns.Config.GameConfig;

    export type OpenDataForCommonChooseUnitTypePanel = {
        gameConfig              : GameConfig;
        currentUnitTypeArray    : UnitType[];
        callbackOnConfirm       : (unitTypeArray: UnitType[]) => void;
    };
    export class CommonChooseUnitTypePanel extends TwnsUiPanel.UiPanel<OpenDataForCommonChooseUnitTypePanel> {
        private readonly _labelTitle!               : TwnsUiLabel.UiLabel;
        private readonly _btnSelectAllUnitTypes!    : TwnsUiButton.UiButton;
        private readonly _btnUnselectAllUnitTypes!  : TwnsUiButton.UiButton;
        private readonly _listUnitType!             : TwnsUiScrollList.UiScrollList<DataForUnitTypeRenderer>;
        private readonly _btnConfirm!               : TwnsUiButton.UiButton;
        private readonly _btnCancel!                : TwnsUiButton.UiButton;

        protected _onOpening(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged, callback: this._onNotifyLanguageChanged },
            ]);
            this._setUiListenerArray([
                { ui: this._btnSelectAllUnitTypes,      callback: this._onTouchedBtnSelectAllUnitTypes },
                { ui: this._btnUnselectAllUnitTypes,    callback: this._onTouchedBtnUnselectAllUnitTypes },
                { ui: this._btnConfirm,                 callback: this._onTouchedBtnConfirm },
                { ui: this._btnCancel,                  callback: this.close },
            ]);
            this._setIsTouchMaskEnabled();
            this._setIsCloseOnTouchedMask();

            this._listUnitType.setItemRenderer(UnitTypeRenderer);
        }
        protected async _updateOnOpenDataChanged(): Promise<void> {
            this._updateComponentsForLanguage();

            this._updateListUnitType();
        }
        protected _onClosing(): void {
            // nothing to do
        }

        private _onTouchedBtnSelectAllUnitTypes(): void {
            const indexArray        : number[] = [];
            const list              = this._listUnitType;
            const dataArrayLength   = list.getBoundDataArrayLength() ?? 0;
            for (let i = 0; i < dataArrayLength; ++i) {
                indexArray.push(i);
            }
            list.setSelectedIndexArray(indexArray);
        }
        private _onTouchedBtnUnselectAllUnitTypes(): void {
            this._listUnitType.setSelectedIndexArray([]);
        }
        private _onTouchedBtnConfirm(): void {
            this._getOpenData().callbackOnConfirm(this._listUnitType.getSelectedDataArray()?.map(v => v.unitType).sort((v1, v2) => v1 - v2) ?? []);
            this.close();
        }

        private _onNotifyLanguageChanged(): void {
            this._updateComponentsForLanguage();
        }

        private _updateComponentsForLanguage(): void {
            this._labelTitle.text               = Lang.getFormattedText(LangTextType.F0092, Lang.getText(LangTextType.B0525));
            this._btnSelectAllUnitTypes.label   = Lang.getText(LangTextType.B0761);
            this._btnUnselectAllUnitTypes.label = Lang.getText(LangTextType.B0762);
            this._btnConfirm.label              = Lang.getText(LangTextType.B0026);
            this._btnCancel.label               = Lang.getText(LangTextType.B0154);
        }

        private _updateListUnitType(): void {
            const dataArray : DataForUnitTypeRenderer[] = [];
            for (const unitType of this._getOpenData().gameConfig.getUnitTypesByCategory(Twns.Types.UnitCategory.All) ?? []) {
                dataArray.push({ unitType });
            }

            const unitTypeArray = this._getOpenData().currentUnitTypeArray;
            const list          = this._listUnitType;
            list.bindData(dataArray);
            list.setSelectedIndexArray(Twns.Helpers.getNonNullElements(dataArray.map((v, i) => unitTypeArray.indexOf(v.unitType) >= 0 ? i : null)));
        }
    }

    type DataForUnitTypeRenderer = {
        unitType    : UnitType;
    };
    class UnitTypeRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForUnitTypeRenderer> {
        private readonly _groupShow!        : eui.Group;
        private readonly _labelUnitName!    : TwnsUiLabel.UiLabel;

        protected _onDataChanged(): void {
            this._labelUnitName.text = Lang.getUnitName(this._getData().unitType) ?? CommonConstants.ErrorTextForUndefined;
        }
    }
}

// export default TwnsCommonChooseUnitTypePanel;
