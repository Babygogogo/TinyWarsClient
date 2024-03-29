
// import TwnsCommonConfirmPanel   from "../../common/view/CommonConfirmPanel";
// import TwnsCommonHelpPanel      from "../../common/view/CommonHelpPanel";
// import TwnsCommonInputPanel     from "../../common/view/CommonInputPanel";
// import SpmModel                 from "../../singlePlayerMode/model/SpmModel";
// import SpmProxy                 from "../../singlePlayerMode/model/SpmProxy";
// import CommonConstants          from "../../tools/helpers/CommonConstants";
// import Types                    from "../../tools/helpers/Types";
// import Lang                     from "../../tools/lang/Lang";
// import TwnsLangTextType         from "../../tools/lang/LangTextType";
// import Twns.Notify           from "../../tools/notify/NotifyType";
// import ProtoTypes               from "../../tools/proto/ProtoTypes";
// import TwnsUiButton             from "../../tools/ui/UiButton";
// import TwnsUiImage              from "../../tools/ui/UiImage";
// import TwnsUiLabel              from "../../tools/ui/UiLabel";
// import TwnsUiListItemRenderer   from "../../tools/ui/UiListItemRenderer";
// import TwnsUiPanel              from "../../tools/ui/UiPanel";
// import TwnsUiScrollList         from "../../tools/ui/UiScrollList";
// import WarCommonHelpers         from "../../tools/warHelpers/WarCommonHelpers";
// import WarMapModel              from "../../warMap/model/WarMapModel";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.SinglePlayerMode {
    import LangTextType         = Twns.Lang.LangTextType;
    import NotifyType           = Twns.Notify.NotifyType;
    import ISerialWar           = CommonProto.WarSerialization.ISerialWar;

    export type OpenDataForSpmCreateSfwSaveSlotsPanel = ISerialWar;

    export class SpmCreateSfwSaveSlotsPanel extends TwnsUiPanel.UiPanel<OpenDataForSpmCreateSfwSaveSlotsPanel> {
        private readonly _group!            : eui.Group;
        private readonly _labelPanelTitle!  : TwnsUiLabel.UiLabel;
        private readonly _srlSaveSlot!      : TwnsUiScrollList.UiScrollList<DataForSlotRenderer>;
        private readonly _listSaveSlot!     : eui.List;
        private readonly _btnHelp!          : TwnsUiButton.UiButton;
        private readonly _btnCancel!        : TwnsUiButton.UiButton;

        protected _onOpening(): void {
            this._setUiListenerArray([
                { ui: this._btnCancel,  callback: this._onTouchedBtnCancel },
                { ui: this._btnHelp,    callback: this._onTouchedBtnHelp },
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

        private _onTouchedBtnHelp(): void {
            Twns.PanelHelpers.open(Twns.PanelHelpers.PanelDict.CommonHelpPanel, {
                title   : Lang.getText(LangTextType.B0325),
                content : Lang.getText(LangTextType.R0006),
            });
        }

        private _onNotifyLanguageChanged(): void {
            this._updateComponentsForLanguage();
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Functions for view.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private async _updateView(): Promise<void> {
            this._updateComponentsForLanguage();

            this._srlSaveSlot.bindData(await this._createDataForList());
            this._listSaveSlot.selectedIndex = await Twns.SinglePlayerMode.SpmModel.getAvailableSlotIndex();
        }

        private _updateComponentsForLanguage(): void {
            this._labelPanelTitle.text  = Lang.getText(LangTextType.B0259);
            this._btnCancel.label       = Lang.getText(LangTextType.B0154);
            this._btnHelp.label         = Lang.getText(LangTextType.B0143);
        }

        private async _createDataForList(): Promise<DataForSlotRenderer[]> {
            const dataList  : DataForSlotRenderer[] = [];
            const warData   = this._getOpenData();
            for (let slotIndex = 0; slotIndex < Twns.CommonConstants.SpwSaveSlotMaxCount; ++slotIndex) {
                dataList.push({
                    slotIndex,
                    slotInfo    : await Twns.SinglePlayerMode.SpmModel.getSlotFullData(slotIndex),
                    warData,
                });
            }

            return dataList;
        }
    }

    type DataForSlotRenderer = {
        slotIndex   : number;
        slotInfo    : Twns.Types.SpmWarSaveSlotData | null;
        warData     : ISerialWar;
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
            const data      = this._getData();
            const callback  = () => {
                Twns.PanelHelpers.open(Twns.PanelHelpers.PanelDict.CommonInputPanel, {
                    title       : Lang.getText(LangTextType.B0088),
                    maxChars    : Twns.CommonConstants.SpmSaveSlotCommentMaxLength,
                    currentValue: ``,
                    tips        : Lang.getText(LangTextType.A0144),
                    charRestrict: null,
                    callback    : (panel) => {
                        Twns.SinglePlayerMode.SpmProxy.reqSpmCreateSfw({
                            slotIndex       : data.slotIndex,
                            slotExtraData   : { slotComment: panel.getInputText() },
                            warData         : data.warData,
                        });
                        Twns.PanelHelpers.close(Twns.PanelHelpers.PanelDict.SpmCreateSfwSaveSlotsPanel);
                    }
                });
            };
            if (!data.slotInfo) {
                callback();
            } else {
                Twns.PanelHelpers.open(Twns.PanelHelpers.PanelDict.CommonConfirmPanel, {
                    content : Lang.getText(LangTextType.A0070),
                    callback,
                });
            }
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
                labelType.text  = Lang.getWarTypeName(Twns.WarHelpers.WarCommonHelpers.getWarType(warData)) || Twns.CommonConstants.ErrorTextForUndefined;

                const slotComment = slotInfo.extraData.slotComment;
                if (slotComment) {
                    labelMapName.text = slotComment;
                } else {
                    const mapId         = Twns.WarHelpers.WarCommonHelpers.getMapId(warData);
                    labelMapName.text   = mapId == null
                        ? `(${Lang.getText(LangTextType.B0321)})`
                        : (await Twns.WarMap.WarMapModel.getMapNameInCurrentLanguage(mapId) || Twns.CommonConstants.ErrorTextForUndefined);
                }
            }
        }
    }
}

// export default TwnsSpmCreateSfwSaveSlotsPanel;
