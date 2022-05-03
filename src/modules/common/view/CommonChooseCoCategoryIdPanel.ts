
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

    export type OpenDataForCommonChooseCoCategoryIdPanel = {
        currentCoCategoryIdArray    : number[];
        gameConfig                  : Twns.Config.GameConfig;
        callbackOnConfirm           : (coCategoryIdArray: number[]) => void;
    };
    export class CommonChooseCoCategoryIdPanel extends TwnsUiPanel.UiPanel<OpenDataForCommonChooseCoCategoryIdPanel> {
        private readonly _labelTitle!       : TwnsUiLabel.UiLabel;
        private readonly _btnSelectAll!     : TwnsUiButton.UiButton;
        private readonly _btnUnselectAll!   : TwnsUiButton.UiButton;
        private readonly _listLocation!     : TwnsUiScrollList.UiScrollList<DataForCounterIdRenderer>;
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

            this._listLocation.setItemRenderer(CounterIdRenderer);
        }
        protected async _updateOnOpenDataChanged(): Promise<void> {
            this._updateComponentsForLanguage();

            this._updateListLocation();
        }
        protected _onClosing(): void {
            // nothing to do
        }

        private _onTouchedBtnSelectAll(): void {
            const indexArray        : number[] = [];
            const list              = this._listLocation;
            const dataArrayLength   = list.getBoundDataArrayLength() ?? 0;
            for (let i = 0; i < dataArrayLength; ++i) {
                indexArray.push(i);
            }
            list.setSelectedIndexArray(indexArray);
        }
        private _onTouchedBtnUnselectAll(): void {
            this._listLocation.setSelectedIndexArray([]);
        }
        private _onTouchedBtnConfirm(): void {
            this._getOpenData().callbackOnConfirm(this._listLocation.getSelectedDataArray()?.map(v => v.coCategoryId).sort((v1, v2) => v1 - v2) ?? []);
            this.close();
        }

        private _onNotifyLanguageChanged(): void {
            this._updateComponentsForLanguage();
        }

        private _updateComponentsForLanguage(): void {
            this._labelTitle.text       = Lang.getFormattedText(LangTextType.F0092, Lang.getText(LangTextType.B0425));
            this._btnSelectAll.label    = Lang.getText(LangTextType.B0761);
            this._btnUnselectAll.label  = Lang.getText(LangTextType.B0762);
            this._btnConfirm.label      = Lang.getText(LangTextType.B0026);
            this._btnCancel.label       = Lang.getText(LangTextType.B0154);
        }

        private _updateListLocation(): void {
            const gameConfig    = this._getOpenData().gameConfig;
            const dataArray     : DataForCounterIdRenderer[] = [];
            for (const coCategoryId of gameConfig.getEnabledCoCategoryIdArray()) {
                dataArray.push({
                    coCategoryId,
                    gameConfig,
                });
            }

            const counterIdArray    = this._getOpenData().currentCoCategoryIdArray;
            const list              = this._listLocation;
            list.bindData(dataArray);
            list.setSelectedIndexArray(Twns.Helpers.getNonNullElements(dataArray.map((v, i) => counterIdArray.indexOf(v.coCategoryId) >= 0 ? i : null)));
        }
    }

    type DataForCounterIdRenderer = {
        coCategoryId    : number;
        gameConfig      : Twns.Config.GameConfig;
    };
    class CounterIdRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForCounterIdRenderer> {
        private readonly _groupShow!        : eui.Group;
        private readonly _labelCoCategory!  : TwnsUiLabel.UiLabel;

        protected _onDataChanged(): void {
            const data = this._getData();
            this._labelCoCategory.text = data.gameConfig.getCoCategoryCfg(data.coCategoryId)?.name ?? CommonConstants.ErrorTextForUndefined;
        }
    }
}

// export default TwnsCommonChooseCoCategoryIdPanel;
