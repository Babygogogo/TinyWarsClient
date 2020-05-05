
namespace TinyWars.SingleCustomRoom {
    import Notify       = Utility.Notify;
    import Lang         = Utility.Lang;
    import ProtoTypes   = Utility.ProtoTypes;
    import Types        = Utility.Types;

    export type OpenDataForScrCreateCustomSaveSlotsPanel = Types.SerializedWar;

    export class ScrCreateCustomSaveSlotsPanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Hud1;
        protected readonly _IS_EXCLUSIVE = false;

        private static _instance: ScrCreateCustomSaveSlotsPanel;

        private _group          : eui.Group;
        private _labelPanelTitle: GameUi.UiLabel;
        private _srlSaveSlot    : GameUi.UiScrollList;
        private _listSaveSlot   : eui.List;
        private _btnHelp        : GameUi.UiButton;
        private _btnCancel      : GameUi.UiButton;

        private _openData   : OpenDataForScrCreateCustomSaveSlotsPanel;
        private _dataForList: DataForSlotRenderer[];

        public static show(openData: OpenDataForScrCreateCustomSaveSlotsPanel): void {
            if (!ScrCreateCustomSaveSlotsPanel._instance) {
                ScrCreateCustomSaveSlotsPanel._instance = new ScrCreateCustomSaveSlotsPanel();
            }

            ScrCreateCustomSaveSlotsPanel._instance._openData = openData;
            ScrCreateCustomSaveSlotsPanel._instance.open();
        }
        public static hide(): void {
            if (ScrCreateCustomSaveSlotsPanel._instance) {
                ScrCreateCustomSaveSlotsPanel._instance.close();
            }
        }

        public constructor() {
            super();

            this._setAutoAdjustHeightEnabled();
            this._setTouchMaskEnabled();
            this._callbackForTouchMask = () => this.close();
            this.skinName = `resource/skins/singleCustomRoom/ScrCreateCustomSaveSlotsPanel.exml`;
        }

        protected _onFirstOpened(): void {
            this._uiListeners = [
                { ui: this._btnCancel,  callback: this._onTouchedBtnCancel },
                { ui: this._btnHelp,    callback: this._onTouchedBtnHelp },
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

        private _onTouchedBtnHelp(e: egret.TouchEvent): void {
            Common.HelpPanel.show({
                title   : Lang.getText(Lang.Type.B0325),
                content : Lang.getRichText(Lang.RichType.R0006),
            });
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
            this._btnHelp.label         = Lang.getText(Lang.Type.B0143);
        }

        private _createDataForList(): DataForSlotRenderer[] {
            const dataList  : DataForSlotRenderer[] = [];
            const warData   = this._openData;
            const slotList  = ScrModel.getSaveSlotInfoList() || [];
            for (let i = 0; i < Utility.ConfigManager.COMMON_CONSTANTS.ScwSaveSlotMaxCount; ++i) {
                dataList.push({
                    slotIndex   : i,
                    slotInfo    : slotList.find(v => v.slotIndex === i),
                    warData,
                });
            }

            return dataList;
        }
    }

    type DataForSlotRenderer = {
        slotIndex   : number;
        slotInfo    : ProtoTypes.ISaveSlotInfo | null;
        warData     : Types.SerializedWar;
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
            const data              = this.data as DataForSlotRenderer;
            const warData           = data.warData;
            warData.saveSlotIndex   = data.slotIndex;
            if (!data.slotInfo) {
                ScrProxy.reqScrCreateCustomWar(warData);
                ScrCreateCustomSaveSlotsPanel.hide();
            } else {
                Common.ConfirmPanel.show({
                    title   : Lang.getText(Lang.Type.B0088),
                    content : Lang.getText(Lang.Type.A0070),
                    callback: () => {
                        ScrProxy.reqScrCreateCustomWar(warData);
                        ScrCreateCustomSaveSlotsPanel.hide();
                    },
                });
            }
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
