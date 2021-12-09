
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
namespace TwnsCommonChooseTileTypePanel {
    import LangTextType = TwnsLangTextType.LangTextType;
    import NotifyType   = TwnsNotifyType.NotifyType;
    import TileType     = Types.TileType;

    export type OpenData = {
        currentTileTypeArray    : TileType[];
        callbackOnConfirm       : (tileTypeArray: TileType[]) => void;
    };
    export class CommonChooseTileTypePanel extends TwnsUiPanel.UiPanel<OpenData> {
        private readonly _labelTitle!       : TwnsUiLabel.UiLabel;
        private readonly _btnSelectAll!     : TwnsUiButton.UiButton;
        private readonly _btnUnselectAll!   : TwnsUiButton.UiButton;
        private readonly _listTileType!     : TwnsUiScrollList.UiScrollList<DataForTileTypeRenderer>;
        private readonly _btnConfirm!       : TwnsUiButton.UiButton;
        private readonly _btnCancel!        : TwnsUiButton.UiButton;

        protected _onOpening(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged, callback: this._onNotifyLanguageChanged },
            ]);
            this._setUiListenerArray([
                { ui: this._btnSelectAll,       callback: this._onTouchedBtnSelectAll },
                { ui: this._btnUnselectAll,     callback: this._onTouchedBtnUnselectAll },
                { ui: this._btnConfirm,         callback: this._onTouchedBtnConfirm },
                { ui: this._btnCancel,          callback: this.close },
            ]);
            this._setIsTouchMaskEnabled();
            this._setIsCloseOnTouchedMask();

            this._listTileType.setItemRenderer(TileTypeRenderer);
        }
        protected async _updateOnOpenDataChanged(): Promise<void> {
            this._updateComponentsForLanguage();

            this._updateListTileType();
        }
        protected _onClosing(): void {
            // nothing to do
        }

        private _onTouchedBtnSelectAll(): void {
            const indexArray        : number[] = [];
            const list              = this._listTileType;
            const dataArrayLength   = list.getBoundDataArrayLength() ?? 0;
            for (let i = 0; i < dataArrayLength; ++i) {
                indexArray.push(i);
            }
            list.setSelectedIndexArray(indexArray);
        }
        private _onTouchedBtnUnselectAll(): void {
            this._listTileType.setSelectedIndexArray([]);
        }
        private _onTouchedBtnConfirm(): void {
            this._getOpenData().callbackOnConfirm(this._listTileType.getSelectedDataArray()?.map(v => v.tileType).sort((v1, v2) => v1 - v2) ?? []);
            this.close();
        }

        private _onNotifyLanguageChanged(): void {
            this._updateComponentsForLanguage();
        }

        private _updateComponentsForLanguage(): void {
            this._labelTitle.text       = Lang.getFormattedText(LangTextType.F0092, Lang.getText(LangTextType.B0718));
            this._btnSelectAll.label    = Lang.getText(LangTextType.B0761);
            this._btnUnselectAll.label  = Lang.getText(LangTextType.B0762);
            this._btnConfirm.label      = Lang.getText(LangTextType.B0026);
            this._btnCancel.label       = Lang.getText(LangTextType.B0154);
        }

        private _updateListTileType(): void {
            const dataArray : DataForTileTypeRenderer[] = [];
            for (const tileType of ConfigManager.getTileTypesByCategory(Helpers.getExisted(ConfigManager.getLatestConfigVersion()), Types.TileCategory.All)) {
                dataArray.push({ tileType });
            }

            const tileTypeArray = this._getOpenData().currentTileTypeArray;
            const list          = this._listTileType;
            list.bindData(dataArray);
            list.setSelectedIndexArray(Helpers.getNonNullElements(dataArray.map((v, i) => tileTypeArray.indexOf(v.tileType) >= 0 ? i : null)));
        }
    }

    type DataForTileTypeRenderer = {
        tileType    : TileType;
    };
    class TileTypeRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForTileTypeRenderer> {
        private readonly _groupShow!        : eui.Group;
        private readonly _labelTileName!    : TwnsUiLabel.UiLabel;

        protected _onDataChanged(): void {
            this._labelTileName.text = Lang.getTileName(this._getData().tileType) ?? CommonConstants.ErrorTextForUndefined;
        }
    }
}

// export default TwnsCommonChooseTileTypePanel;
