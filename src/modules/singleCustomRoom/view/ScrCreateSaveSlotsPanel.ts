
// import SpmModel                 from "../../singlePlayerMode/model/SpmModel";
// import CommonConstants          from "../../tools/helpers/CommonConstants";
// import Types                    from "../../tools/helpers/Types";
// import Lang                     from "../../tools/lang/Lang";
// import TwnsLangTextType         from "../../tools/lang/LangTextType";
// import TwnsNotifyType           from "../../tools/notify/NotifyType";
// import TwnsUiButton             from "../../tools/ui/UiButton";
// import TwnsUiImage              from "../../tools/ui/UiImage";
// import TwnsUiLabel              from "../../tools/ui/UiLabel";
// import TwnsUiListItemRenderer   from "../../tools/ui/UiListItemRenderer";
// import TwnsUiPanel              from "../../tools/ui/UiPanel";
// import TwnsUiScrollList         from "../../tools/ui/UiScrollList";
// import WarCommonHelpers         from "../../tools/warHelpers/WarCommonHelpers";
// import WarMapModel              from "../../warMap/model/WarMapModel";
// import ScrCreateModel           from "../model/ScrCreateModel";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace TwnsScrCreateSaveSlotsPanel {
    import LangTextType     = TwnsLangTextType.LangTextType;
    import NotifyType       = TwnsNotifyType.NotifyType;

    export type OpenData = void;
    export class ScrCreateSaveSlotsPanel extends TwnsUiPanel2.UiPanel2<OpenData> {
        private readonly _group!            : eui.Group;
        private readonly _labelPanelTitle!  : TwnsUiLabel.UiLabel;
        private readonly _srlSaveSlot!      : TwnsUiScrollList.UiScrollList<DataForSlotRenderer>;
        private readonly _listSaveSlot!     : eui.List;
        private readonly _btnCancel!        : TwnsUiButton.UiButton;

        protected _onOpening(): void {
            this._setUiListenerArray([
                { ui: this._btnCancel, callback: this._onTouchedBtnCancel },
            ]);
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged, callback: this._onNotifyLanguageChanged },
            ]);
            this._setIsTouchMaskEnabled();
            this._setIsCloseOnTouchedMask();

            this._srlSaveSlot.setItemRenderer(SlotRenderer);

        }
        protected async _updateOnOpenDataChanged(): Promise<void> {
            this._updateView();
        }
        protected _onClosing(): void {
            // nothing to do
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Callbacks.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _onTouchedBtnCancel(): void {
            this.close();
        }

        private _onNotifyLanguageChanged(): void {
            this._updateComponentsForLanguage();
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Functions for view.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _updateView(): void {
            this._updateComponentsForLanguage();

            this._srlSaveSlot.bindData(this._createDataForList());
            this._listSaveSlot.selectedIndex = ScrCreateModel.getSaveSlotIndex();
        }

        private _updateComponentsForLanguage(): void {
            this._labelPanelTitle.text  = Lang.getText(LangTextType.B0259);
            this._btnCancel.label       = Lang.getText(LangTextType.B0154);
        }

        private _createDataForList(): DataForSlotRenderer[] {
            const dataList  : DataForSlotRenderer[] = [];
            const slotDict  = SpmModel.getSlotDict();
            for (let slotIndex = 0; slotIndex < CommonConstants.SpwSaveSlotMaxCount; ++slotIndex) {
                dataList.push({
                    slotIndex,
                    slotInfo    : slotDict.get(slotIndex) ?? null,
                });
            }

            return dataList;
        }
    }

    type DataForSlotRenderer = {
        slotIndex   : number;
        slotInfo    : Types.SpmWarSaveSlotData | null;
    };
    class SlotRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForSlotRenderer> {
        private readonly _group!            : eui.Group;
        private readonly _imgBg!            : TwnsUiImage.UiImage;
        private readonly _labelSlotIndex!   : TwnsUiLabel.UiLabel;
        private readonly _labelType!        : TwnsUiLabel.UiLabel;
        private readonly _labelMapName!     : TwnsUiLabel.UiLabel;
        private readonly _labelChoose!      : TwnsUiLabel.UiLabel;

        protected _onOpened(): void {
            this._setUiListenerArray([
                { ui: this._imgBg,  callback: this._onTouchedImgBg },
            ]);

            this._imgBg.touchEnabled    = true;
            this._labelChoose.text      = Lang.getText(LangTextType.B0258);
        }

        protected _onDataChanged(): void {
            this._updateView();
        }

        private _onTouchedImgBg(): void {
            ScrCreateModel.setSaveSlotIndex(this._getData().slotIndex);
            TwnsPanelManager.close(TwnsPanelConfig.Dict.ScrCreateSaveSlotsPanel);
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Functions for view.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private async _updateView(): Promise<void> {
            const data                  = this._getData();
            this._labelSlotIndex.text   = "" + data.slotIndex;

            const slotInfo      = data.slotInfo;
            const labelType     = this._labelType;
            const labelMapName  = this._labelMapName;
            if (slotInfo == null) {
                labelType.text      = `----`;
                labelMapName.text   = `----`;
            } else {
                const warData   = slotInfo.warData;
                labelType.text  = Lang.getWarTypeName(WarCommonHelpers.getWarType(warData)) || CommonConstants.ErrorTextForUndefined;

                const slotComment = slotInfo.extraData.slotComment;
                if (slotComment) {
                    labelMapName.text = slotComment;
                } else {
                    const mapId         = WarCommonHelpers.getMapId(warData);
                    labelMapName.text   = mapId == null
                        ? `(${Lang.getText(LangTextType.B0321)})`
                        : (await WarMapModel.getMapNameInCurrentLanguage(mapId) || CommonConstants.ErrorTextForUndefined);
                }
            }
        }
    }
}

// export default TwnsScrCreateSaveSlotsPanel;
