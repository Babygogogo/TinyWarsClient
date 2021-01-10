
namespace TinyWars.SingleCustomWar {
    import Notify       = Utility.Notify;
    import Lang         = Utility.Lang;
    import ProtoTypes   = Utility.ProtoTypes;
    import ISerialWar   = ProtoTypes.WarSerialization.ISerialWar;

    export class ScwLoadWarPanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Hud1;
        protected readonly _IS_EXCLUSIVE = false;

        private static _instance: ScwLoadWarPanel;

        private _group          : eui.Group;
        private _labelPanelTitle: GameUi.UiLabel;
        private _srlSaveSlot    : GameUi.UiScrollList;
        private _listSaveSlot   : eui.List;
        private _btnHelp        : GameUi.UiButton;
        private _btnCancel      : GameUi.UiButton;

        private _dataForList: DataForSlotRenderer[];

        public static show(): void {
            if (!ScwLoadWarPanel._instance) {
                ScwLoadWarPanel._instance = new ScwLoadWarPanel();
            }

            ScwLoadWarPanel._instance.open();
        }
        public static hide(): void {
            if (ScwLoadWarPanel._instance) {
                ScwLoadWarPanel._instance.close();
            }
        }

        public constructor() {
            super();

            this._setIsAutoAdjustHeight();
            this._setIsTouchMaskEnabled();
            this._setIsCloseOnTouchedMask();
            this.skinName = `resource/skins/singleCustomWar/ScwLoadWarPanel.exml`;
        }

        protected _onOpened(): void {
            this._setUiListenerArray([
                { ui: this._btnCancel,  callback: this._onTouchedBtnCancel },
                { ui: this._btnHelp,    callback: this._onTouchedBtnHelp },
            ]);
            this._setNotifyListenerArray([
                { type: Notify.Type.LanguageChanged, callback: this._onNotifyLanguageChanged },
            ]);
            this._srlSaveSlot.setItemRenderer(SlotRenderer);

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
            Common.CommonHelpPanel.show({
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
            this._listSaveSlot.selectedIndex = ScwModel.getWar().getSaveSlotIndex();
        }

        private _updateComponentsForLanguage(): void {
            this._labelPanelTitle.text  = Lang.getText(Lang.Type.B0259);
            this._btnCancel.label       = Lang.getText(Lang.Type.B0154);
            this._btnHelp.label         = Lang.getText(Lang.Type.B0143);
        }

        private _createDataForList(): DataForSlotRenderer[] {
            const dataList  : DataForSlotRenderer[] = [];
            const slotList  = SingleCustomRoom.ScrModel.getSaveSlotInfoList() || [];
            for (let i = 0; i < Utility.ConfigManager.COMMON_CONSTANTS.ScwSaveSlotMaxCount; ++i) {
                dataList.push({
                    slotIndex   : i,
                    slotInfo    : slotList.find(v => v.slotIndex === i),
                });
            }

            return dataList;
        }
    }

    type DataForSlotRenderer = {
        slotIndex   : number;
        slotInfo    : ProtoTypes.SingleCustomRoom.IScrSaveSlotInfo | null;
    }

    class SlotRenderer extends GameUi.UiListItemRenderer {
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
            const data      = this.data as DataForSlotRenderer;
            const slotInfo  = data.slotInfo;
            if (slotInfo) {
                Common.CommonConfirmPanel.show({
                    title   : Lang.getText(Lang.Type.B0088),
                    content : Lang.getText(Lang.Type.A0072),
                    callback: () => {
                        SingleCustomRoom.ScrProxy.reqContinueWar(slotInfo.slotIndex);
                        ScwLoadWarPanel.hide();
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
            this._labelType.text        = slotInfo ? Lang.getWarTypeName(slotInfo.warType) : "----";
            this._labelChoose.text      = Lang.getText(Lang.Type.B0258);

            const labelMapName = this._labelMapName;
            if (!slotInfo) {
                labelMapName.text = "----";
            } else {
                const comment = slotInfo.slotComment;
                if (comment) {
                    labelMapName.text = comment;
                } else {
                    const mapId = slotInfo.mapId;
                    if (mapId == null) {
                        labelMapName.text = `(${Lang.getText(Lang.Type.B0321)})`;
                    } else {
                        labelMapName.text = ``;
                        WarMap.WarMapModel.getMapNameInCurrentLanguage(mapId).then(value => labelMapName.text = value);
                    }
                }
            }
        }
    }
}
