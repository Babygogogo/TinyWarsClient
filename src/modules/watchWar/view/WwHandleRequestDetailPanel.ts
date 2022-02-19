
// import CommonConstants          from "../../tools/helpers/CommonConstants";
// import Types                    from "../../tools/helpers/Types";
// import Lang                     from "../../tools/lang/Lang";
// import TwnsLangTextType         from "../../tools/lang/LangTextType";
// import TwnsNotifyType           from "../../tools/notify/NotifyType";
// import ProtoTypes               from "../../tools/proto/ProtoTypes";
// import TwnsUiButton             from "../../tools/ui/UiButton";
// import TwnsUiImage              from "../../tools/ui/UiImage";
// import TwnsUiLabel              from "../../tools/ui/UiLabel";
// import TwnsUiListItemRenderer   from "../../tools/ui/UiListItemRenderer";
// import TwnsUiPanel              from "../../tools/ui/UiPanel";
// import TwnsUiScrollList         from "../../tools/ui/UiScrollList";
// import UserModel                from "../../user/model/UserModel";
// import WwProxy                  from "../model/WwProxy";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace TwnsWwHandleRequestDetailPanel {
    import LangTextType     = TwnsLangTextType.LangTextType;
    import NotifyType       = TwnsNotifyType.NotifyType;

    export type OpenData = {
        watchInfo: ProtoTypes.MultiPlayerWar.IMpwWatchInfo;
    };
    export class WwHandleRequestDetailPanel extends TwnsUiPanel.UiPanel<OpenData> {
        private readonly _labelMenuTitle!           : TwnsUiLabel.UiLabel;
        private readonly _labelYes!                 : TwnsUiLabel.UiLabel;
        private readonly _labelNo!                  : TwnsUiLabel.UiLabel;
        private readonly _labelIsOpponent!          : TwnsUiLabel.UiLabel;
        private readonly _labelIsWatchingOthers!    : TwnsUiLabel.UiLabel;
        private readonly _listPlayer!               : TwnsUiScrollList.UiScrollList<DataForRequesterRenderer>;
        private readonly _btnConfirm!               : TwnsUiButton.UiButton;
        private readonly _btnCancel!                : TwnsUiButton.UiButton;

        private _dataForListPlayer  : DataForRequesterRenderer[] | null = null;

        protected _onOpening(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,    callback: this._onNotifyLanguageChanged },
            ]);
            this._setUiListenerArray([
                { ui: this._btnCancel,  callback: this.close },
                { ui: this._btnConfirm, callback: this._onTouchedBtnConfirm },
            ]);
            this._setIsTouchMaskEnabled();
            this._setIsCloseOnTouchedMask();

            this._listPlayer.setItemRenderer(RequesterRenderer);
        }
        protected async _updateOnOpenDataChanged(): Promise<void> {
            this._dataForListPlayer = await this._generateDataForListPlayer();
            this._updateView();
        }
        protected _onClosing(): void {
            this._dataForListPlayer = null;
        }

        public setRequesterSelected(index: number, selected: boolean): void {
            const dataList = this._dataForListPlayer;
            if (dataList) {
                const data      = dataList[index];
                data.isAccept   = selected;
                this._listPlayer.updateSingleData(index, data);
            }
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Callbacks.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _onNotifyLanguageChanged(): void {
            this._updateComponentsForLanguage();
        }

        private _onTouchedBtnConfirm(): void {
            const warId = this._getOpenData().watchInfo.warId;
            if (warId == null) {
                this.close();
                return;
            }

            const acceptUserIds : number[] = [];
            const declineUserIds: number[] = [];
            for (const data of this._dataForListPlayer || []) {
                if (data.isAccept) {
                    acceptUserIds.push(data.userId);
                } else {
                    declineUserIds.push(data.userId);
                }
            }
            TwnsPanelManager.open(TwnsPanelConfig.Dict.CommonConfirmPanel, {
                content : Lang.getFormattedText(LangTextType.F0082, acceptUserIds.length, declineUserIds.length),
                callback: () => {
                    WwProxy.reqWatchHandleRequest(warId, acceptUserIds, declineUserIds);
                    this.close();
                },
            });
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Other functions.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _updateView(): void {
            this._updateComponentsForLanguage();
            this._listPlayer.bindData(this._dataForListPlayer || []);
        }

        private _updateComponentsForLanguage(): void {
            this._labelMenuTitle.text           = Lang.getText(LangTextType.B0208);
            this._labelYes.text                 = Lang.getText(LangTextType.B0214);
            this._labelNo.text                  = Lang.getText(LangTextType.B0215);
            this._labelIsOpponent.text          = Lang.getText(LangTextType.B0217);
            this._labelIsWatchingOthers.text    = Lang.getText(LangTextType.B0218);
            this._btnConfirm.label              = Lang.getText(LangTextType.B0026);
            this._btnCancel.label               = Lang.getText(LangTextType.B0154);
        }

        private async _generateDataForListPlayer(): Promise<DataForRequesterRenderer[]> {
            const openData          = this._getOpenData().watchInfo;
            const playerInfoList    = (await MpwModel.getWarProgressInfo(Helpers.getExisted(openData.warId)))?.playerInfoList;
            const dataList          : DataForRequesterRenderer[] = [];
            for (const info of openData.requesterInfos || []) {
                const userId = info.userId;
                if (userId != null) {
                    dataList.push({
                        panel           : this,
                        userId,
                        isWatchingOthers: !!info.isRequestingOthers || !!info.isWatchingOthers,
                        isOpponent      : !!playerInfoList?.some(v => v.userId === userId),
                        isAccept        : true,
                    });
                }
            }

            return dataList;
        }
    }

    type DataForRequesterRenderer = {
        panel           : WwHandleRequestDetailPanel;
        userId          : number;
        isWatchingOthers: boolean;
        isOpponent      : boolean;
        isAccept        : boolean;
    };
    class RequesterRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForRequesterRenderer> {
        private readonly _labelName!                : TwnsUiLabel.UiLabel;
        private readonly _labelIsOpponent!          : TwnsUiLabel.UiLabel;
        private readonly _labelIsWatchingOthers!    : TwnsUiLabel.UiLabel;
        private readonly _imgAccept!                : TwnsUiImage.UiImage;
        private readonly _imgDecline!               : TwnsUiImage.UiImage;

        protected _onDataChanged(): void {
            const data                          = this._getData();
            this._labelIsOpponent.text          = data.isOpponent ? Lang.getText(LangTextType.B0012) : "";
            this._labelIsWatchingOthers.text    = data.isWatchingOthers ? Lang.getText(LangTextType.B0012) : "";
            this._imgAccept.visible             = data.isAccept;
            this._imgDecline.visible            = !data.isAccept;
            UserModel.getUserNickname(data.userId).then(name => this._labelName.text = name ?? CommonConstants.ErrorTextForUndefined);
        }

        public onItemTapEvent(e: eui.ItemTapEvent): void {
            if ((this._imgAccept.visible) || (this._imgDecline.visible)) {
                const data = this._getData();
                data.panel.setRequesterSelected(e.itemIndex, !data.isAccept);
            }
        }
    }
}

// export default TwnsWwHandleRequestDetailPanel;
