
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
    import LangTextType         = Twns.Lang.LangTextType;
    import NotifyType           = Twns.Notify.NotifyType;
    import UnitActionState      = Twns.Types.UnitActionState;

    const ACTION_STATES = [
        UnitActionState.Acted,
        UnitActionState.Idle,
    ];

    export type OpenDataForCommonChooseUnitActionStatePanel = {
        currentActionStateArray : UnitActionState[];
        callbackOnConfirm       : (unitActionState: UnitActionState[]) => void;
    };
    export class CommonChooseUnitActionStatePanel extends TwnsUiPanel.UiPanel<OpenDataForCommonChooseUnitActionStatePanel> {
        private readonly _labelTitle!       : TwnsUiLabel.UiLabel;
        private readonly _btnSelectAll!     : TwnsUiButton.UiButton;
        private readonly _btnUnselectAll!   : TwnsUiButton.UiButton;
        private readonly _listUnitType!     : TwnsUiScrollList.UiScrollList<DataForUnitActionStateRenderer>;
        private readonly _btnConfirm!       : TwnsUiButton.UiButton;
        private readonly _btnCancel!        : TwnsUiButton.UiButton;

        protected _onOpening(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged, callback: this._onNotifyLanguageChanged },
            ]);
            this._setUiListenerArray([
                { ui: this._btnSelectAll,       callback: this._onTouchedBtnSelectAllUnitTypes },
                { ui: this._btnUnselectAll,     callback: this._onTouchedBtnUnselectAllUnitTypes },
                { ui: this._btnConfirm,         callback: this._onTouchedBtnConfirm },
                { ui: this._btnCancel,          callback: this.close },
            ]);
            this._setIsTouchMaskEnabled();
            this._setIsCloseOnTouchedMask();

            this._listUnitType.setItemRenderer(UnitActionStateRenderer);
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
            this._getOpenData().callbackOnConfirm(this._listUnitType.getSelectedDataArray()?.map(v => v.unitActionState).sort((v1, v2) => v1 - v2) ?? []);
            this.close();
        }

        private _onNotifyLanguageChanged(): void {
            this._updateComponentsForLanguage();
        }

        private _updateComponentsForLanguage(): void {
            this._labelTitle.text               = Lang.getFormattedText(LangTextType.F0092, Lang.getText(LangTextType.B0525));
            this._btnSelectAll.label   = Lang.getText(LangTextType.B0761);
            this._btnUnselectAll.label = Lang.getText(LangTextType.B0762);
            this._btnConfirm.label              = Lang.getText(LangTextType.B0026);
            this._btnCancel.label               = Lang.getText(LangTextType.B0154);
        }

        private _updateListUnitType(): void {
            const dataArray : DataForUnitActionStateRenderer[] = [];
            for (const unitActionState of ACTION_STATES) {
                dataArray.push({ unitActionState });
            }

            const unitTypeArray = this._getOpenData().currentActionStateArray;
            const list          = this._listUnitType;
            list.bindData(dataArray);
            list.setSelectedIndexArray(Twns.Helpers.getNonNullElements(dataArray.map((v, i) => unitTypeArray.indexOf(v.unitActionState) >= 0 ? i : null)));
        }
    }

    type DataForUnitActionStateRenderer = {
        unitActionState : UnitActionState;
    };
    class UnitActionStateRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForUnitActionStateRenderer> {
        private readonly _groupShow!    : eui.Group;
        private readonly _labelName!    : TwnsUiLabel.UiLabel;

        protected _onDataChanged(): void {
            this._labelName.text = Lang.getUnitActionStateText(this._getData().unitActionState) ?? Twns.CommonConstants.ErrorTextForUndefined;
        }
    }
}

// export default TwnsCommonChooseUnitActionStatePanel;
