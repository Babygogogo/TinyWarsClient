
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
// import UserModel                from "../../user/model/UserModel";
// import WwProxy                  from "../model/WwProxy";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.WatchWar {
    import LangTextType = Twns.Lang.LangTextType;
    import NotifyType   = Twns.Notify.NotifyType;

    export type OpenDataForWwDeleteWatcherDetailPanel = {
        warId: number;
    };
    export class WwDeleteWatcherDetailPanel extends TwnsUiPanel.UiPanel<OpenDataForWwDeleteWatcherDetailPanel> {
        private readonly _labelMenuTitle!           : TwnsUiLabel.UiLabel;
        private readonly _labelDelete!              : TwnsUiLabel.UiLabel;
        private readonly _labelKeep!                : TwnsUiLabel.UiLabel;
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
            // nothing to do
        }

        protected async _onClosed(): Promise<void> {
            this._dataForListPlayer = null;
        }

        public setRequesterSelected(index: number, selected: boolean): void {
            const dataList = this._dataForListPlayer;
            if (dataList) {
                const data      = dataList[index];
                data.isDelete   = selected;
                this._listPlayer.updateSingleData(index, data);
            }
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Callbacks.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _onNotifyLanguageChanged(): void {
            this._updateComponentsForLanguage();
        }

        private async _onTouchedBtnConfirm(): Promise<void> {
            const warId = this._getOpenData().warId;
            if (await Twns.WatchWar.WwModel.getWatchIncomingInfo(warId) == null) {
                this.close();
                return;
            }

            const deleteUserIds : number[] = [];
            for (const data of this._dataForListPlayer || []) {
                if (data.isDelete) {
                    deleteUserIds.push(data.userId);
                }
            }
            if (deleteUserIds.length) {
                Twns.WatchWar.WwProxy.reqWatchDeleteWatcher(warId, deleteUserIds);
            }
            this.close();
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Other functions.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _updateView(): void {
            this._updateComponentsForLanguage();
            this._listPlayer.bindData(this._dataForListPlayer || []);
        }

        private _updateComponentsForLanguage(): void {
            this._labelMenuTitle.text           = Lang.getText(LangTextType.B0219);
            this._labelDelete.text              = Lang.getText(LangTextType.B0220);
            this._labelKeep.text                = Lang.getText(LangTextType.B0221);
            this._labelIsOpponent.text          = Lang.getText(LangTextType.B0217);
            this._labelIsWatchingOthers.text    = Lang.getText(LangTextType.B0218);
            this._btnConfirm.label              = Lang.getText(LangTextType.B0026);
            this._btnCancel.label               = Lang.getText(LangTextType.B0154);
        }

        private async _generateDataForListPlayer(): Promise<DataForRequesterRenderer[]> {
            const warId             = this._getOpenData().warId;
            const playerInfoList    = (await Twns.MultiPlayerWar.MpwModel.getWarProgressInfo(warId))?.playerInfoList;
            const dataList          : DataForRequesterRenderer[] = [];
            for (const info of (await Twns.WatchWar.WwModel.getWatchIncomingInfo(warId))?.srcUserInfoArray || []) {
                const userId = info.userId;
                if (userId != null) {
                    dataList.push({
                        panel           : this,
                        userId,
                        isWatchingOthers: !!info.isRequestingOthers || !!info.isWatchingOthers,
                        isOpponent      : !!playerInfoList?.some(v => v.userId === userId),
                        isDelete        : false,
                    });
                }
            }

            return dataList;
        }
    }

    type DataForRequesterRenderer = {
        panel           : WwDeleteWatcherDetailPanel;
        userId          : number;
        isWatchingOthers: boolean;
        isOpponent      : boolean;
        isDelete        : boolean;
    };
    class RequesterRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForRequesterRenderer> {
        private readonly _labelName!                : TwnsUiLabel.UiLabel;
        private readonly _labelIsOpponent!          : TwnsUiLabel.UiLabel;
        private readonly _labelIsWatchingOthers!    : TwnsUiLabel.UiLabel;
        private readonly _imgDelete!                : TwnsUiImage.UiImage;
        private readonly _imgKeep!                  : TwnsUiImage.UiImage;

        protected _onDataChanged(): void {
            const data                          = this._getData();
            this._labelIsOpponent.text          = data.isOpponent ? Lang.getText(LangTextType.B0012) : "";
            this._labelIsWatchingOthers.text    = data.isWatchingOthers ? Lang.getText(LangTextType.B0012) : "";
            this._imgDelete.visible             = data.isDelete;
            this._imgKeep.visible               = !data.isDelete;
            Twns.User.UserModel.getUserNickname(data.userId).then(name => this._labelName.text = name ?? CommonConstants.ErrorTextForUndefined);
        }

        public onItemTapEvent(e: eui.ItemTapEvent): void {
            if ((this._imgDelete.visible) || (this._imgKeep.visible)) {
                const data = this._getData();
                data.panel.setRequesterSelected(e.itemIndex, !data.isDelete);
            }
        }
    }
}

// export default TwnsWwDeleteWatcherDetailPanel;
