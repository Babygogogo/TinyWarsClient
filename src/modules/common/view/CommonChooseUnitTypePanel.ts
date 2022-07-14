
// import TwnsBwWar            from "../../baseWar/model/BwWar";
// import Helpers              from "../../tools/helpers/Helpers";
// import Types                from "../../tools/helpers/Types";
// import Lang                 from "../../tools/lang/Lang";
// import TwnsLangTextType     from "../../tools/lang/LangTextType";
// import Notify       from "../../tools/notify/NotifyType";
// import TwnsUiImage          from "../../tools/ui/UiImage";
// import TwnsUiLabel          from "../../tools/ui/UiLabel";
// import TwnsUiPanel          from "../../tools/ui/UiPanel";
// import MeModel              from "../model/MeModel";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.Common {
    import LangTextType = Lang.LangTextType;
    import NotifyType   = Notify.NotifyType;
    import GameConfig   = Config.GameConfig;

    export type OpenDataForCommonChooseUnitTypePanel = {
        gameConfig              : GameConfig;
        currentUnitTypeArray    : number[];
        callbackOnConfirm       : ((unitTypeArray: number[]) => void) | null;
    };
    export class CommonChooseUnitTypePanel extends TwnsUiPanel.UiPanel<OpenDataForCommonChooseUnitTypePanel> {
        private readonly _labelTitle!       : TwnsUiLabel.UiLabel;
        private readonly _btnSelectAll!     : TwnsUiButton.UiButton;
        private readonly _btnUnselectAll!   : TwnsUiButton.UiButton;
        private readonly _listUnitType!     : TwnsUiScrollList.UiScrollList<DataForUnitTypeRenderer>;
        private readonly _btnConfirm!       : TwnsUiButton.UiButton;
        private readonly _btnCancel!        : TwnsUiButton.UiButton;
        private readonly _btnClose!         : TwnsUiButton.UiButton;

        protected _onOpening(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged, callback: this._onNotifyLanguageChanged },
            ]);
            this._setUiListenerArray([
                { ui: this._btnSelectAll,       callback: this._onTouchedBtnSelectAll },
                { ui: this._btnUnselectAll,     callback: this._onTouchedBtnUnselectAll },
                { ui: this._btnConfirm,         callback: this._onTouchedBtnConfirm },
                { ui: this._btnCancel,          callback: this.close },
                { ui: this._btnClose,           callback: this.close },
            ]);
            this._setIsTouchMaskEnabled();
            this._setIsCloseOnTouchedMask();

            this._listUnitType.setItemRenderer(UnitTypeRenderer);
        }
        protected async _updateOnOpenDataChanged(): Promise<void> {
            this._updateComponentsForLanguage();

            this._updateButtons();
            this._updateListUnitType();
        }
        protected _onClosing(): void {
            // nothing to do
        }

        private _onTouchedBtnSelectAll(): void {
            const indexArray        : number[] = [];
            const list              = this._listUnitType;
            const dataArrayLength   = list.getBoundDataArrayLength() ?? 0;
            for (let i = 0; i < dataArrayLength; ++i) {
                indexArray.push(i);
            }
            list.setSelectedIndexArray(indexArray);
        }
        private _onTouchedBtnUnselectAll(): void {
            this._listUnitType.setSelectedIndexArray([]);
        }
        private _onTouchedBtnConfirm(): void {
            const callback = this._getOpenData().callbackOnConfirm;
            if (callback) {
                callback(this._listUnitType.getSelectedDataArray()?.map(v => v.unitType).sort((v1, v2) => v1 - v2) ?? []);
            }

            this.close();
        }

        private _onNotifyLanguageChanged(): void {
            this._updateComponentsForLanguage();
        }

        private _updateComponentsForLanguage(): void {
            this._labelTitle.text       = Lang.getFormattedText(LangTextType.F0092, Lang.getText(LangTextType.B0525));
            this._btnSelectAll.label    = Lang.getText(LangTextType.B0761);
            this._btnUnselectAll.label  = Lang.getText(LangTextType.B0762);
            this._btnConfirm.label      = Lang.getText(LangTextType.B0026);
            this._btnCancel.label       = Lang.getText(LangTextType.B0154);
            this._btnClose.label        = Lang.getText(LangTextType.B0204);
        }

        private _updateButtons(): void {
            const canModify                 = this._getOpenData().callbackOnConfirm != null;
            this._btnSelectAll.visible      = canModify;
            this._btnUnselectAll.visible    = canModify;
            this._btnConfirm.visible        = canModify;
            this._btnCancel.visible         = canModify;
            this._btnClose.visible          = !canModify;
        }

        private _updateListUnitType(): void {
            const openData      = this._getOpenData();
            const gameConfig    = openData.gameConfig;
            const dataArray     : DataForUnitTypeRenderer[] = [];
            for (const unitType of openData.gameConfig.getAllUnitTypeArray()) {
                dataArray.push({
                    unitType,
                    gameConfig,
                });
            }

            const unitTypeArray = openData.currentUnitTypeArray;
            const list          = this._listUnitType;
            list.bindData(dataArray);
            list.setListTouchEnabled(openData.callbackOnConfirm != null);
            list.setSelectedIndexArray(Helpers.getNonNullElements(dataArray.map((v, i) => unitTypeArray.indexOf(v.unitType) >= 0 ? i : null)));
        }
    }

    type DataForUnitTypeRenderer = {
        unitType    : number;
        gameConfig  : GameConfig;
    };
    class UnitTypeRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForUnitTypeRenderer> {
        private readonly _groupShow!        : eui.Group;
        private readonly _conUnitView!      : eui.Group;
        private readonly _labelUnitName!    : TwnsUiLabel.UiLabel;

        private readonly _unitView          = new WarMap.WarMapUnitView();

        protected _onOpened(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,     callback: this._onNotifyLanguageChanged },
                { type: NotifyType.UnitAnimationTick,   callback: this._onNotifyUnitAnimationTick },
            ]);

            this._conUnitView.addChild(this._unitView);
        }

        protected _onDataChanged(): void {
            this._updateComponentsForLanguage();
            this._updateUnitView();
        }

        private _onNotifyLanguageChanged(): void {        // DONE
            this._updateComponentsForLanguage();
        }
        private _onNotifyUnitAnimationTick(): void {
            this._unitView.updateOnAnimationTick(Timer.getUnitAnimationTickCount());
        }

        private _updateComponentsForLanguage(): void {
            this._updateLabelType();
        }

        private _updateLabelType(): void {
            const data                  = this._getData();
            this._labelUnitName.text    = Lang.getUnitName(data.unitType, data.gameConfig) ?? CommonConstants.ErrorTextForUndefined;
        }
        private _updateUnitView(): void {
            const data = this._getData();
            this._unitView.update({
                gameConfig  : data.gameConfig,
                gridIndex   : { x: 0, y: 0 },
                playerIndex : CommonConstants.PlayerIndex.First,
                unitType    : data.unitType,
            });
        }
    }
}

// export default TwnsCommonChooseUnitTypePanel;
