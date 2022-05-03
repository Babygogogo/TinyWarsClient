
// import ChangeLogModel           from "../../changeLog/model/ChangeLogModel";
// import ChangeLogProxy           from "../../changeLog/model/ChangeLogProxy";
// import CommonConstants          from "../../tools/helpers/CommonConstants";
// import FloatText                from "../../tools/helpers/FloatText";
// import Helpers                  from "../../tools/helpers/Helpers";
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
// import TwnsChangeLogAddPanel    from "./ChangeLogAddPanel";
// import TwnsChangeLogModifyPanel from "./ChangeLogModifyPanel";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.Broadcast {
    import LangTextType     = TwnsLangTextType.LangTextType;
    import NotifyType       = Twns.Notify.NotifyType;

    export type OpenDataForBroadcastMessageListPanel = void;
    export class BroadcastMessageListPanel extends TwnsUiPanel.UiPanel<OpenDataForBroadcastMessageListPanel> {
        private readonly _imgMask!          : TwnsUiImage.UiImage;
        private readonly _group!            : eui.Group;
        private readonly _btnClose!         : TwnsUiButton.UiButton;

        private readonly _listMessage!      : TwnsUiScrollList.UiScrollList<DataForMessageRenderer>;
        private readonly _labelTitle!       : TwnsUiLabel.UiLabel;
        private readonly _labelNoMessage!   : TwnsUiLabel.UiLabel;
        private readonly _btnAddMessage!    : TwnsUiButton.UiButton;

        protected _onOpening(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,                     callback: this._onNotifyLanguageChanged },
                { type: NotifyType.MsgBroadcastGetAllMessageIdArray,    callback: this._onNotifyMsgBroadcastGetAllMessageIdArray },
            ]);
            this._setUiListenerArray([
                { ui: this._btnAddMessage,                              callback: this._onTouchedBtnAddMessage },
                { ui: this._btnClose,                                   callback: this.close },
            ]);
            this._setIsTouchMaskEnabled(true);
            this._setIsCloseOnTouchedMask();

            this._listMessage.setItemRenderer(MessageRenderer);
        }
        protected async _updateOnOpenDataChanged(): Promise<void> {
            this._updateView();

            Twns.Broadcast.BroadcastProxy.reqBroadcastGetAllMessageIdArray();
        }
        protected _onClosing(): void {
            // nothing to do
        }

        private _onNotifyLanguageChanged(): void {
            this._updateComponentsForLanguage();
        }
        private _onNotifyMsgBroadcastGetAllMessageIdArray(): void {
            this._updateListMessageAndLabelNoMessage();
        }

        private _onTouchedBtnAddMessage(): void {
            TwnsPanelManager.open(TwnsPanelConfig.Dict.BroadcastAddMessagePanel, void 0);
        }

        private _updateView(): void {
            this._updateComponentsForLanguage();

            this._updateBtnAddMessage();
        }

        private _updateComponentsForLanguage(): void {
            this._updateListMessageAndLabelNoMessage();
            this._labelTitle.text       = Lang.getText(LangTextType.B0881);
            this._labelNoMessage.text   = Lang.getText(LangTextType.B0278);
            this._btnAddMessage.label   = Lang.getText(LangTextType.B0454);
        }
        private _updateListMessageAndLabelNoMessage(): void {
            const dataArray: DataForMessageRenderer[] = [];
            for (const messageId of Twns.Broadcast.BroadcastModel.getAllMessageIdArray()) {
                dataArray.push({
                    messageId,
                });
            }

            this._labelNoMessage.visible = !dataArray.length;
            this._listMessage.bindData(dataArray);
        }
        private _updateBtnAddMessage(): void {
            const btn   = this._btnAddMessage;
            btn.visible = Twns.User.UserModel.getIsSelfAdmin();
        }

        protected async _showOpenAnimation(): Promise<void> {
            Helpers.resetTween({
                obj         : this._imgMask,
                beginProps  : { alpha: 0 },
                endProps    : { alpha: 1 },
            });
            Helpers.resetTween({
                obj         : this._group,
                beginProps  : { alpha: 0, verticalCenter: 40 },
                endProps    : { alpha: 1, verticalCenter: 0 },
            });

            await Helpers.wait(CommonConstants.DefaultTweenTime);
        }
        protected async _showCloseAnimation(): Promise<void> {
            Helpers.resetTween({
                obj         : this._imgMask,
                beginProps  : { alpha: 1 },
                endProps    : { alpha: 0 },
            });
            Helpers.resetTween({
                obj         : this._group,
                beginProps  : { alpha: 1, verticalCenter: 0 },
                endProps    : { alpha: 0, verticalCenter: 40 },
            });

            await Helpers.wait(CommonConstants.DefaultTweenTime);
        }
    }

    type DataForMessageRenderer = {
        messageId: number;
    };
    class MessageRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForMessageRenderer> {
        private readonly _labelIndex!   : TwnsUiLabel.UiLabel;
        private readonly _labelContent! : TwnsUiLabel.UiLabel;
        private readonly _btnDelete!    : TwnsUiButton.UiButton;

        protected _onOpened(): void {
            this._setUiListenerArray([
                { ui: this._btnDelete,              callback: this._onTouchedBtnDelete },
            ]);
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged, callback: this._onNotifyLanguageChanged },
            ]);
            this._setShortSfxCode(Types.ShortSfxCode.None);

            this._updateComponentsForLanguage();
        }

        protected async _onDataChanged(): Promise<void> {
            const data          = this._getData();
            const messageId     = data.messageId;
            const messageData   = await Twns.Broadcast.BroadcastModel.getMessageData(messageId);
            if (messageData == null) {
                return;
            }

            this._labelIndex.text   = `#${messageId}    ${Helpers.getTimestampShortText(Helpers.getExisted(messageData.startTime))} ~ ${Helpers.getTimestampShortText(Helpers.getExisted(messageData.endTime))}`;

            const textArray         = messageData.textList;
            this._labelContent.text = [
                `${Lang.getText(LangTextType.B0455)}: ${Lang.getLanguageText({ textArray, languageType: Types.LanguageType.Chinese, useAlternate: false }) ?? `----`}`,
                `${Lang.getText(LangTextType.B0456)}: ${Lang.getLanguageText({ textArray, languageType: Types.LanguageType.English, useAlternate: false }) ?? `----`}`,
            ].join(`\n\n`);
        }

        private _onTouchedBtnDelete(): void {
            TwnsPanelManager.open(TwnsPanelConfig.Dict.CommonConfirmPanel, {
                title   : Lang.getText(LangTextType.B0220),
                content : Lang.getText(LangTextType.A0225),
                callback: () => {
                    Twns.Broadcast.BroadcastProxy.reqBroadcastDeleteMessage(this._getData().messageId);
                },
            });
        }

        private _onNotifyLanguageChanged(): void {
            this._updateComponentsForLanguage();
        }

        private _updateComponentsForLanguage(): void {
            this._btnDelete.label = Lang.getText(LangTextType.B0220);
        }
    }
}

// export default TwnsBroadcastMessageListPanel;
