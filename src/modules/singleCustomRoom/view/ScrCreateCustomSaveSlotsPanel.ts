
namespace TinyWars.SingleCustomRoom {
    import Notify           = Utility.Notify;
    import Lang             = Utility.Lang;
    import ProtoTypes       = Utility.ProtoTypes;
    import CommonConstants  = Utility.CommonConstants;
    import Types            = Utility.Types;
    import ISerialWar       = ProtoTypes.WarSerialization.ISerialWar;

    export type OpenDataForScrCreateCustomSaveSlotsPanel = ISerialWar;

    export class ScrCreateCustomSaveSlotsPanel extends GameUi.UiPanel<OpenDataForScrCreateCustomSaveSlotsPanel> {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Hud1;
        protected readonly _IS_EXCLUSIVE = false;

        private static _instance: ScrCreateCustomSaveSlotsPanel;

        private _group          : eui.Group;
        private _labelPanelTitle: GameUi.UiLabel;
        private _srlSaveSlot    : GameUi.UiScrollList<DataForSlotRenderer>;
        private _listSaveSlot   : eui.List;
        private _btnHelp        : GameUi.UiButton;
        private _btnCancel      : GameUi.UiButton;

        private _dataForList: DataForSlotRenderer[];

        public static show(openData: OpenDataForScrCreateCustomSaveSlotsPanel): void {
            if (!ScrCreateCustomSaveSlotsPanel._instance) {
                ScrCreateCustomSaveSlotsPanel._instance = new ScrCreateCustomSaveSlotsPanel();
            }

            ScrCreateCustomSaveSlotsPanel._instance.open(openData);
        }
        public static async hide(): Promise<void> {
            if (ScrCreateCustomSaveSlotsPanel._instance) {
                await ScrCreateCustomSaveSlotsPanel._instance.close();
            }
        }

        public constructor() {
            super();

            this._setIsTouchMaskEnabled();
            this._setIsCloseOnTouchedMask();
            this.skinName = `resource/skins/singleCustomRoom/ScrCreateCustomSaveSlotsPanel.exml`;
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
        protected async _onClosed(): Promise<void> {
            this._dataForList = null;
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
            this._listSaveSlot.selectedIndex = ScrModel.Create.getSaveSlotIndex();
        }

        private _updateComponentsForLanguage(): void {
            this._labelPanelTitle.text  = Lang.getText(Lang.Type.B0259);
            this._btnCancel.label       = Lang.getText(Lang.Type.B0154);
            this._btnHelp.label         = Lang.getText(Lang.Type.B0143);
        }

        private _createDataForList(): DataForSlotRenderer[] {
            const dataList  : DataForSlotRenderer[] = [];
            const warData   = this._getOpenData();
            const slotList  = SinglePlayerMode.SpmModel.SaveSlot.getSlotArray() || [];
            for (let i = 0; i < CommonConstants.SpwSaveSlotMaxCount; ++i) {
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
        slotInfo    : Types.SpmWarSaveSlotData;
        warData     : ISerialWar;
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
            const data      = this.data;
            const callback  = () => {
                Common.CommonInputPanel.show({
                    title       : Lang.getText(Lang.Type.B0088),
                    maxChars    : CommonConstants.ScwSaveSlotCommentMaxLength,
                    currentValue: ``,
                    tips        : Lang.getText(Lang.Type.A0144),
                    charRestrict: null,
                    callback    : (panel) => {
                        SinglePlayerMode.SpmProxy.reqSpmCreateSfw({
                            slotIndex       : data.slotIndex,
                            slotExtraData   : { slotComment: panel.getInputText() },
                            warData         : data.warData,
                        });
                        ScrCreateCustomSaveSlotsPanel.hide();
                    }
                });
            };
            if (!data.slotInfo) {
                callback();
            } else {
                Common.CommonConfirmPanel.show({
                    content : Lang.getText(Lang.Type.A0070),
                    callback,
                });
            }
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Functions for view.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _updateView(): void {
            const data                  = this.data;
            const slotInfo              = data.slotInfo;
            this._labelSlotIndex.text   = "" + data.slotIndex;

            // TODO
            Utility.FloatText.show(`ScrCreateCustomSaveSlotsPanel.SlotRenderer._updateView()`);
            // this._labelType.text        = slotInfo ? Lang.getWarTypeName(slotInfo.warType) : "----";
            // const labelMapName = this._labelMapName;
            // if (!slotInfo) {
            //     labelMapName.text = "----";
            // } else {
            //     const comment = slotInfo.slotComment;
            //     if (comment) {
            //         labelMapName.text = comment;
            //     } else {
            //         const mapId = slotInfo.mapId;
            //         if (mapId == null) {
            //             labelMapName.text = `(${Lang.getText(Lang.Type.B0321)})`;
            //         } else {
            //             labelMapName.text = ``;
            //             WarMap.WarMapModel.getMapNameInCurrentLanguage(mapId).then(value => labelMapName.text = value);
            //         }
            //     }
            // }
        }
    }
}
