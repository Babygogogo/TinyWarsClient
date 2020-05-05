
namespace TinyWars.SingleCustomRoom {
    import Notify       = Utility.Notify;
    import Lang         = Utility.Lang;
    import ProtoTypes   = Utility.ProtoTypes;

    export class ScrCreateSaveSlotsPanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Hud1;
        protected readonly _IS_EXCLUSIVE = false;

        private static _instance: ScrCreateSaveSlotsPanel;

        private _group          : eui.Group;
        private _labelPanelTitle: GameUi.UiLabel;
        private _srlSaveSlot    : GameUi.UiScrollList;
        private _listSaveSlot   : eui.List;
        private _btnCancel      : GameUi.UiButton;

        private _dataForList: DataForSlotRenderer[];

        public static show(): void {
            if (!ScrCreateSaveSlotsPanel._instance) {
                ScrCreateSaveSlotsPanel._instance = new ScrCreateSaveSlotsPanel();
            }
            ScrCreateSaveSlotsPanel._instance.open();
        }
        public static hide(): void {
            if (ScrCreateSaveSlotsPanel._instance) {
                ScrCreateSaveSlotsPanel._instance.close();
            }
        }

        public constructor() {
            super();

            this._setAutoAdjustHeightEnabled();
            this._setTouchMaskEnabled();
            this._callbackForTouchMask = () => this.close();
            this.skinName = `resource/skins/singleCustomRoom/ScrCreateSaveSlotsPanel.exml`;
        }

        protected _onFirstOpened(): void {
            this._uiListeners = [
                { ui: this._btnCancel, callback: this._onTouchedBtnCancel },
            ];
            this._notifyListeners = [
                { type: Notify.Type.LanguageChanged, callback: this._onNotifyLanguageChanged },
            ];
            this._srlSaveSlot.setItemRenderer(SlotRenderer);
        }
        protected _onOpened(): void {
            this._updateView();
        }
        protected _onClosed(): void {
            delete this._dataForList;
            this._srlSaveSlot.clear();
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
            this._listSaveSlot.selectedIndex = ScrModel.getCreateWarSaveSlotIndex();
        }

        private _updateComponentsForLanguage(): void {
            this._labelPanelTitle.text  = Lang.getText(Lang.Type.B0259);
            this._btnCancel.label       = Lang.getText(Lang.Type.B0154);
        }

        private _createDataForList(): DataForSlotRenderer[] {
            const dataList  : DataForSlotRenderer[] = [];
            const slotList  = ScrModel.getSaveSlotInfoList() || [];
            for (let i = 0; i < Utility.ConfigManager.COMMON_CONSTANTS.ScwSaveSlotMaxCount; ++i) {
                dataList.push({
                    slotIndex   : i,
                    slotInfo    : slotList.find(v => v.slotIndex === i),
                })
            }

            return dataList;
        }
    }

    type DataForSlotRenderer = {
        slotIndex   : number;
        slotInfo    : ProtoTypes.ISaveSlotInfo | null;
    }

    class SlotRenderer extends eui.ItemRenderer {
        private _group          : eui.Group;
        private _imgBg          : GameUi.UiImage;
        private _labelSlotIndex : GameUi.UiLabel;
        private _labelType      : GameUi.UiLabel;
        private _labelMapName   : GameUi.UiLabel;
        private _labelChoose    : GameUi.UiLabel;

        protected childrenCreated(): void {
            super.childrenCreated();

            this._imgBg.touchEnabled = true;
            this._imgBg.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onTouchedImgBg, this);
        }

        protected dataChanged(): void {
            super.dataChanged();

            this._updateView();
        }

        private _onTouchedImgBg(e: egret.TouchEvent): void {
            ScrModel.setCreateWarSaveSlotIndex((this.data as DataForSlotRenderer).slotIndex);
            ScrCreateSaveSlotsPanel.hide();
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Functions for view.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _updateView(): void {
            const data                  = this.data as DataForSlotRenderer;
            const slotInfo              = data.slotInfo;
            this._labelSlotIndex.text   = "" + data.slotIndex;
            this._labelType.text        = slotInfo ? Lang.getSinglePlayerWarTypeName(slotInfo.warType) : "----";
            this._labelChoose.text      = Lang.getText(Lang.Type.B0258);
            if (!slotInfo) {
                this._labelMapName.text = "----";
            } else {
                const mapFileName = slotInfo.mapFileName;
                if (!mapFileName) {
                    this._labelMapName.text = `(${Lang.getText(Lang.Type.B0321)})`;
                } else {
                    WarMap.WarMapModel.getMapNameInLanguage(mapFileName).then(value => this._labelMapName.text = value);
                }
            }
        }
    }
}
