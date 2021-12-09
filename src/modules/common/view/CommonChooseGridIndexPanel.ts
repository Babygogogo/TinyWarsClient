
// import TwnsBwWar            from "../../baseWar/model/BwWar";
// import Helpers              from "../../tools/helpers/Helpers";
// import Types                from "../../tools/helpers/Types";
// import Lang                 from "../../tools/lang/Lang";
// import TwnsLangTextType     from "../../tools/lang/LangTextType";
// import TwnsNotifyType       from "../../tools/notify/NotifyType";
// import TwnsUiImage          from "../../tools/ui/UiImage";
// import TwnsUiLabel          from "../../tools/ui/UiLabel";
// import TwnsUiPanel          from "../../tools/ui/UiPanel";
// import MeModel              from "../model/MeModel";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace TwnsCommonChooseGridIndexPanel {
    import LangTextType = TwnsLangTextType.LangTextType;
    import NotifyType   = TwnsNotifyType.NotifyType;
    import GridIndex    = Types.GridIndex;

    export type OpenData = {
        currentGridIndexArray   : GridIndex[];
        mapSize                 : Types.MapSize;
        callbackOnConfirm       : (teamIndexArray: GridIndex[]) => void;
    };
    export class CommonChooseGridIndexPanel extends TwnsUiPanel.UiPanel<OpenData> {
        private readonly _labelTitle!       : TwnsUiLabel.UiLabel;
        private readonly _btnAdd!           : TwnsUiButton.UiButton;
        private readonly _inputGridX!       : TwnsUiTextInput.UiTextInput;
        private readonly _inputGridY!       : TwnsUiTextInput.UiTextInput;
        private readonly _labelMapSize!     : TwnsUiLabel.UiLabel;
        private readonly _btnDeleteAll!     : TwnsUiButton.UiButton;
        private readonly _listLocation!     : TwnsUiScrollList.UiScrollList<DataForLocationRenderer>;
        private readonly _btnConfirm!       : TwnsUiButton.UiButton;
        private readonly _btnCancel!        : TwnsUiButton.UiButton;

        protected _onOpening(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged, callback: this._onNotifyLanguageChanged },
            ]);
            this._setUiListenerArray([
                { ui: this._btnAdd,             callback: this._onTouchedBtnAdd },
                { ui: this._btnDeleteAll,       callback: this._onTouchedBtnDeleteAll },
                { ui: this._btnConfirm,         callback: this._onTouchedBtnConfirm },
                { ui: this._btnCancel,          callback: this.close },
                { ui: this._inputGridX,         callback: this._onFocusOutInputGridX,       eventType: egret.FocusEvent.FOCUS_OUT },
                { ui: this._inputGridY,         callback: this._onFocusOutInputGridY,       eventType: egret.FocusEvent.FOCUS_OUT },
            ]);
            this._setIsTouchMaskEnabled();
            this._setIsCloseOnTouchedMask();

            this._listLocation.setItemRenderer(LocationRenderer);
        }
        protected async _updateOnOpenDataChanged(): Promise<void> {
            this._updateComponentsForLanguage();

            this._updateListLocation();
        }
        protected _onClosing(): void {
            // nothing to do
        }

        public updateOnDeleteGridIndex(gridIndex: GridIndex): void {
            const list = this._listLocation;
            list.bindData(list.getBoundDataArray()?.filter(v => !GridIndexHelpers.checkIsEqual(gridIndex, v.gridIndex)) ?? []);
        }

        private _onTouchedBtnAdd(): void {
            const x = parseInt(this._inputGridX.text);
            const y = parseInt(this._inputGridY.text);
            if ((isNaN(x)) || (isNaN(y))) {
                FloatText.show(Lang.getText(LangTextType.A0250));
                return;
            }

            const gridIndex: GridIndex = { x, y };
            if (!GridIndexHelpers.checkIsInsideMap(gridIndex, this._getOpenData().mapSize)) {
                FloatText.show(Lang.getText(LangTextType.A0251));
                return;
            }

            const list              = this._listLocation;
            const gridIndexArray    = list.getBoundDataArray()?.map(v => v.gridIndex) ?? [];
            if (gridIndexArray.some(v => GridIndexHelpers.checkIsEqual(v, gridIndex))) {
                FloatText.show(Lang.getText(LangTextType.A0268));
                return;
            }

            gridIndexArray.push(gridIndex);
            list.bindData(gridIndexArray.sort(gridIndexSorter).map(v => { return { gridIndex: v, panel: this }; }));
        }
        private _onTouchedBtnDeleteAll(): void {
            TwnsPanelManager.open(TwnsPanelConfig.Dict.CommonConfirmPanel, {
                content : Lang.getText(LangTextType.A0225),
                callback: () => {
                    this._listLocation.clear();
                },
            });
        }
        private _onTouchedBtnConfirm(): void {
            this._getOpenData().callbackOnConfirm(this._listLocation.getBoundDataArray()?.map(v => v.gridIndex).sort(gridIndexSorter) ?? []);
            this.close();
        }
        private _onFocusOutInputGridX(): void {
            const input = this._inputGridX;
            const value = parseInt(input.text);
            if (isNaN(value)) {
                input.text = ``;
            } else {
                const maxValue = this._getOpenData().mapSize.width - 1;
                if (value > maxValue) {
                    input.text = `${maxValue}`;
                }
            }
        }
        private _onFocusOutInputGridY(): void {
            const input = this._inputGridY;
            const value = parseInt(input.text);
            if (isNaN(value)) {
                input.text = ``;
            } else {
                const maxValue = this._getOpenData().mapSize.height - 1;
                if (value > maxValue) {
                    input.text = `${maxValue}`;
                }
            }
        }

        private _onNotifyLanguageChanged(): void {
            this._updateComponentsForLanguage();
        }

        private _updateComponentsForLanguage(): void {
            this._labelTitle.text       = Lang.getFormattedText(LangTextType.F0092, Lang.getText(LangTextType.B0377));
            this._btnAdd.label          = Lang.getText(LangTextType.B0320);
            this._btnDeleteAll.label    = Lang.getText(LangTextType.B0762);
            this._btnConfirm.label      = Lang.getText(LangTextType.B0026);
            this._btnCancel.label       = Lang.getText(LangTextType.B0154);

            this._updateLabelMapSize();
        }

        private _updateListLocation(): void {
            const dataArray : DataForLocationRenderer[] = [];
            for (const gridIndex of this._getOpenData().currentGridIndexArray.concat().sort(gridIndexSorter)) {
                dataArray.push({
                    gridIndex,
                    panel       : this,
                });
            }

            this._listLocation.bindData(dataArray);
        }

        private _updateLabelMapSize(): void {
            const mapSize           = this._getOpenData().mapSize;
            this._labelMapSize.text = `${Lang.getText(LangTextType.B0300)}: ${mapSize.width} x ${mapSize.height}`;
        }
    }

    type DataForLocationRenderer = {
        gridIndex   : GridIndex;
        panel       : CommonChooseGridIndexPanel;
    };
    class LocationRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForLocationRenderer> {
        private readonly _btnDelete!    : TwnsUiButton.UiButton;
        private readonly _labelName!    : TwnsUiLabel.UiLabel;

        protected _onOpened(): void {
            this._setUiListenerArray([
                { ui: this._btnDelete, callback: this._onTouchedBtnDelete },
            ]);
        }

        private _onTouchedBtnDelete(): void {
            TwnsPanelManager.open(TwnsPanelConfig.Dict.CommonConfirmPanel, {
                content : Lang.getText(LangTextType.A0225),
                callback: () => {
                    const data = this._getData();
                    data.panel.updateOnDeleteGridIndex(data.gridIndex);
                },
            });
        }

        protected _onDataChanged(): void {
            const gridIndex         = this._getData().gridIndex;
            this._labelName.text    = `${gridIndex.x}, ${gridIndex.y}`;
        }
    }

    function gridIndexSorter(g1: GridIndex, g2: GridIndex): number {
        const x1 = g1.x;
        const x2 = g2.x;
        if (x1 !== x2) {
            return x1 - x2;
        } else {
            return g1.y - g2.y;
        }
    }
}

// export default TwnsCommonChooseGridIndexPanel;
