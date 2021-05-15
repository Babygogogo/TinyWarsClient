
namespace TinyWars.SingleCustomRoom {
    import Notify       = Utility.Notify;
    import Lang         = Utility.Lang;
    import Types        = Utility.Types;
    import BwHelpers    = BaseWar.BwHelpers;

    export class ScrCreateSaveSlotsPanel extends GameUi.UiPanel<void> {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Hud1;
        protected readonly _IS_EXCLUSIVE = false;

        private static _instance: ScrCreateSaveSlotsPanel;

        private _group          : eui.Group;
        private _labelPanelTitle: GameUi.UiLabel;
        private _srlSaveSlot    : GameUi.UiScrollList<DataForSlotRenderer>;
        private _listSaveSlot   : eui.List;
        private _btnCancel      : GameUi.UiButton;

        private _dataForList: DataForSlotRenderer[];

        public static show(): void {
            if (!ScrCreateSaveSlotsPanel._instance) {
                ScrCreateSaveSlotsPanel._instance = new ScrCreateSaveSlotsPanel();
            }
            ScrCreateSaveSlotsPanel._instance.open(undefined);
        }
        public static async hide(): Promise<void> {
            if (ScrCreateSaveSlotsPanel._instance) {
                await ScrCreateSaveSlotsPanel._instance.close();
            }
        }

        public constructor() {
            super();

            this._setIsTouchMaskEnabled();
            this._setIsCloseOnTouchedMask();
            this.skinName = `resource/skins/singleCustomRoom/ScrCreateSaveSlotsPanel.exml`;
        }

        protected _onOpened(): void {
            this._setUiListenerArray([
                { ui: this._btnCancel, callback: this._onTouchedBtnCancel },
            ]);
            this._setNotifyListenerArray([
                { type: Notify.Type.LanguageChanged, callback: this._onNotifyLanguageChanged },
            ]);
            this._srlSaveSlot.setItemRenderer(SlotRenderer);

            this._updateView();
        }
        protected async _onClosed(): Promise<void> {
            this._dataForList = null;
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Callbacks.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _onTouchedBtnCancel(e: egret.TouchEvent): void {
            this.close();
        }

        private _onNotifyLanguageChanged(e: egret.Event): void {
            this._updateComponentsForLanguage();
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Functions for view.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _updateView(): void {
            this._updateComponentsForLanguage();

            this._dataForList = this._createDataForList();
            this._srlSaveSlot.bindData(this._dataForList);
            this._listSaveSlot.selectedIndex = ScrModel.Create.getSaveSlotIndex();
        }

        private _updateComponentsForLanguage(): void {
            this._labelPanelTitle.text  = Lang.getText(Lang.Type.B0259);
            this._btnCancel.label       = Lang.getText(Lang.Type.B0154);
        }

        private _createDataForList(): DataForSlotRenderer[] {
            const dataList  : DataForSlotRenderer[] = [];
            const slotDict  = SinglePlayerMode.SpmModel.SaveSlot.getSlotDict();
            for (let slotIndex = 0; slotIndex < Utility.CommonConstants.SpwSaveSlotMaxCount; ++slotIndex) {
                dataList.push({
                    slotIndex,
                    slotInfo    : slotDict.get(slotIndex),
                });
            }

            return dataList;
        }
    }

    type DataForSlotRenderer = {
        slotIndex   : number;
        slotInfo    : Types.SpmWarSaveSlotData | null;
    }
    class SlotRenderer extends GameUi.UiListItemRenderer<DataForSlotRenderer> {
        private _group          : eui.Group;
        private _imgBg          : GameUi.UiImage;
        private _labelSlotIndex : GameUi.UiLabel;
        private _labelType      : GameUi.UiLabel;
        private _labelMapName   : GameUi.UiLabel;
        private _labelChoose    : GameUi.UiLabel;

        protected _onOpened(): void {
            this._setUiListenerArray([
                { ui: this._imgBg,  callback: this._onTouchedImgBg },
            ]);

            this._imgBg.touchEnabled    = true;
            this._labelChoose.text      = Lang.getText(Lang.Type.B0258);
        }

        protected dataChanged(): void {
            super.dataChanged();

            this._updateView();
        }

        private _onTouchedImgBg(e: egret.TouchEvent): void {
            ScrModel.Create.setSaveSlotIndex(this.data.slotIndex);
            ScrCreateSaveSlotsPanel.hide();
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Functions for view.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private async _updateView(): Promise<void> {
            const data                  = this.data;
            this._labelSlotIndex.text   = "" + data.slotIndex;

            const slotInfo      = data.slotInfo;
            const labelType     = this._labelType;
            const labelMapName  = this._labelMapName;
            if (slotInfo == null) {
                labelType.text      = `----`;
                labelMapName.text   = `----`;
            } else {
                const warData   = slotInfo.warData;
                labelType.text  = Lang.getWarTypeName(BwHelpers.getWarType(warData));

                const slotComment = slotInfo.extraData.slotComment;
                if (slotComment) {
                    labelMapName.text = slotComment;
                } else {
                    const mapId         = BwHelpers.getMapId(warData);
                    labelMapName.text   = mapId == null
                        ? `(${Lang.getText(Lang.Type.B0321)})`
                        : await WarMap.WarMapModel.getMapNameInCurrentLanguage(mapId);
                }
            }
        }
    }
}
