
namespace TinyWars.SinglePlayerMode {
    import Notify           = Utility.Notify;
    import Lang             = Utility.Lang;
    import ProtoTypes       = Utility.ProtoTypes;
    import CommonConstants  = Utility.CommonConstants;
    import Types            = Utility.Types;
    import BwHelpers        = BaseWar.BwHelpers;
    import ISerialWar       = ProtoTypes.WarSerialization.ISerialWar;

    export type OpenDataForSpmCreateSfwSaveSlotsPanel = ISerialWar;

    export class SpmCreateSfwSaveSlotsPanel extends GameUi.UiPanel<OpenDataForSpmCreateSfwSaveSlotsPanel> {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Hud1;
        protected readonly _IS_EXCLUSIVE = false;

        private static _instance: SpmCreateSfwSaveSlotsPanel;

        private _group          : eui.Group;
        private _labelPanelTitle: GameUi.UiLabel;
        private _srlSaveSlot    : GameUi.UiScrollList<DataForSlotRenderer>;
        private _listSaveSlot   : eui.List;
        private _btnHelp        : GameUi.UiButton;
        private _btnCancel      : GameUi.UiButton;

        private _dataForList: DataForSlotRenderer[];

        public static show(openData: OpenDataForSpmCreateSfwSaveSlotsPanel): void {
            if (!SpmCreateSfwSaveSlotsPanel._instance) {
                SpmCreateSfwSaveSlotsPanel._instance = new SpmCreateSfwSaveSlotsPanel();
            }

            SpmCreateSfwSaveSlotsPanel._instance.open(openData);
        }
        public static async hide(): Promise<void> {
            if (SpmCreateSfwSaveSlotsPanel._instance) {
                await SpmCreateSfwSaveSlotsPanel._instance.close();
            }
        }

        public constructor() {
            super();

            this._setIsTouchMaskEnabled();
            this._setIsCloseOnTouchedMask();
            this.skinName = `resource/skins/singlePlayerMode/SpmCreateSfwSaveSlotsPanel.exml`;
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
                content : Lang.getText(Lang.Type.R0006),
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
            this._listSaveSlot.selectedIndex = SpmModel.SaveSlot.getAvailableIndex();
        }

        private _updateComponentsForLanguage(): void {
            this._labelPanelTitle.text  = Lang.getText(Lang.Type.B0259);
            this._btnCancel.label       = Lang.getText(Lang.Type.B0154);
            this._btnHelp.label         = Lang.getText(Lang.Type.B0143);
        }

        private _createDataForList(): DataForSlotRenderer[] {
            const dataList  : DataForSlotRenderer[] = [];
            const warData   = this._getOpenData();
            const slotDict  = SinglePlayerMode.SpmModel.SaveSlot.getSlotDict();
            for (let slotIndex = 0; slotIndex < CommonConstants.SpwSaveSlotMaxCount; ++slotIndex) {
                dataList.push({
                    slotIndex,
                    slotInfo    : slotDict.get(slotIndex),
                    warData,
                });
            }

            return dataList;
        }
    }

    type DataForSlotRenderer = {
        slotIndex   : number;
        slotInfo    : Types.SpmWarSaveSlotData | null;
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

        protected _onDataChanged(): void {
            this._updateView();
        }

        private _onTouchedImgBg(e: egret.TouchEvent): void {
            const data      = this.data;
            const callback  = () => {
                Common.CommonInputPanel.show({
                    title       : Lang.getText(Lang.Type.B0088),
                    maxChars    : CommonConstants.SpmSaveSlotCommentMaxLength,
                    currentValue: ``,
                    tips        : Lang.getText(Lang.Type.A0144),
                    charRestrict: null,
                    callback    : (panel) => {
                        SinglePlayerMode.SpmProxy.reqSpmCreateSfw({
                            slotIndex       : data.slotIndex,
                            slotExtraData   : { slotComment: panel.getInputText() },
                            warData         : data.warData,
                        });
                        SpmCreateSfwSaveSlotsPanel.hide();
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
