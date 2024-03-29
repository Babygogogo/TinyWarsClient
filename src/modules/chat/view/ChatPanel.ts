
// import TwnsCommonConfirmPanel   from "../../common/view/CommonConfirmPanel";
// import CcrModel                 from "../../coopCustomRoom/model/CcrModel";
// import McrModel                 from "../../multiCustomRoom/model/McrModel";
// import MfrModel                 from "../../multiFreeRoom/model/MfrModel";
// import MpwModel                 from "../../multiPlayerWar/model/MpwModel";
// import CommonConstants          from "../../tools/helpers/CommonConstants";
// import FloatText                from "../../tools/helpers/FloatText";
// import Helpers                  from "../../tools/helpers/Helpers";
// import Timer                    from "../../tools/helpers/Timer";
// import Types                    from "../../tools/helpers/Types";
// import Lang                     from "../../tools/lang/Lang";
// import TwnsLangTextType         from "../../tools/lang/LangTextType";
// import Notify                   from "../../tools/notify/Notify";
// import Twns.Notify           from "../../tools/notify/NotifyType";
// import ProtoTypes               from "../../tools/proto/ProtoTypes";
// import TwnsUiButton             from "../../tools/ui/UiButton";
// import TwnsUiImage              from "../../tools/ui/UiImage";
// import TwnsUiLabel              from "../../tools/ui/UiLabel";
// import TwnsUiListItemRenderer   from "../../tools/ui/UiListItemRenderer";
// import TwnsUiPanel              from "../../tools/ui/UiPanel";
// import TwnsUiScrollList         from "../../tools/ui/UiScrollList";
// import TwnsUiTextInput          from "../../tools/ui/UiTextInput";
// import UserModel                from "../../user/model/UserModel";
// import WarMapModel              from "../../warMap/model/WarMapModel";
// import ChatModel                from "../model/ChatModel";
// import ChatProxy                from "../model/ChatProxy";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.Chat {
    import LangTextType         = Twns.Lang.LangTextType;
    import NotifyType           = Twns.Notify.NotifyType;
    import ChatCategory         = Twns.Types.ChatMessageToCategory;
    import ChatChannel          = Twns.Types.ChatChannel;
    import NetMessage           = CommonProto.NetMessage;

    export type OpenDataForChatPanel = {
        toUserId?           : number | null;
        toMcrRoomId?        : number;
        toMfrRoomId?        : number;
        toCcrRoomId?        : number;
        toMapReviewTarget?  : number;
    };
    export class ChatPanel extends TwnsUiPanel.UiPanel<OpenDataForChatPanel> {
        private readonly _imgMask!          : TwnsUiImage.UiImage;

        private readonly _groupChannel!     : eui.Group;
        private readonly _listChat!         : TwnsUiScrollList.UiScrollList<DataForChatPageRenderer>;
        private readonly _btnClose!         : TwnsUiButton.UiButton;
        private readonly _btnRefresh!       : TwnsUiButton.UiButton;
        private readonly _groupMessage!     : eui.Group;
        private readonly _labelNoMessage!   : TwnsUiLabel.UiLabel;
        private readonly _listMessage!      : TwnsUiScrollList.UiScrollList<DataForMessageRenderer>;
        private readonly _groupInput!       : eui.Group;
        private readonly _inputMessage!     : TwnsUiTextInput.UiTextInput;
        private readonly _btnSend!          : TwnsUiButton.UiButton;

        private _dataForListChat: DataForChatPageRenderer[] = [];
        private _selectedIndex  : number | null = null;

        protected override _onOpening(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,         callback: this._onNotifyLanguageChanged },
                { type: NotifyType.MsgChatAddMessage,       callback: this._onNotifyMsgChatAddMessage },
                { type: NotifyType.MsgChatDeleteMessage,    callback: this._onNotifyMsgChatDeleteMessage },
                { type: NotifyType.MsgChatGetAllMessages,   callback: this._onNotifyMsgChatGetAllMessages },
            ]);
            this._setUiListenerArray([
                { ui: this._btnClose,   callback: this.close },
                { ui: this._btnRefresh, callback: this._onTouchedBtnRefresh },
                { ui: this._btnSend,    callback: this._onTouchedBtnSend },
            ]);
            this._setIsTouchMaskEnabled();
            this._setIsCloseOnTouchedMask();

            this._listChat.setItemRenderer(ChatPageRenderer);
            this._listMessage.setItemRenderer(MessageRenderer);
            this._inputMessage.maxChars = Twns.CommonConstants.ChatMessageMaxLength;

            this._updateComponentsForLanguage();
        }
        protected override async _updateOnOpenDataChanged(): Promise<void> {
            this._dataForListChat = await this._createDataForListChat();
            this._listChat.bindData(this._dataForListChat);
            this.setSelectedIndex(this._getDefaultSelectedIndex());
        }
        protected override _onClosing(): void {
            this._dataForListChat.length    = 0;
            this._selectedIndex             = null;
        }

        public setSelectedIndex(newIndex: number): void {
            const dataList  = this._dataForListChat;
            const oldIndex  = this.getSelectedIndex();
            if (!dataList[newIndex]) {
                newIndex = 0;
            }
            this._selectedIndex = newIndex;
            if ((oldIndex != null) && (dataList[oldIndex])) {
                this._listChat.updateSingleData(oldIndex, dataList[oldIndex]);
            }
            if (oldIndex !== newIndex) {
                const data = dataList[newIndex];
                this._listChat.updateSingleData(newIndex, data);
                this._updateComponentsForMessage();

                const toCategory    = data.toCategory;
                const toTarget      = data.toTarget;
                if (Twns.Chat.ChatModel.checkHasUnreadMessageForTarget(toCategory, toTarget)) {
                    Twns.Chat.ChatProxy.reqUpdateReadProgress(
                        toCategory,
                        toTarget,
                        Twns.Chat.ChatModel.getLatestMessageTimestamp(toCategory, toTarget)
                    );
                }
            }
        }
        public getSelectedIndex(): number | null {
            return this._selectedIndex;
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Callbacks.
        ////////////////////////////////////////////////////////////////////////////////
        private _onNotifyLanguageChanged(): void {
            this._updateComponentsForLanguage();
        }

        private async _onNotifyMsgChatAddMessage(e: egret.Event): Promise<void> {
            const message       = Twns.Helpers.getExisted((e.data as NetMessage.MsgChatAddMessage.IS).message);
            const fromUserId    = message.fromUserId;
            if (fromUserId === Twns.User.UserModel.getSelfUserId()) {
                this._inputMessage.text = "";
            }

            const pageData          = this._dataForListChat[Twns.Helpers.getExisted(this.getSelectedIndex())];
            const pageToCategory    = pageData.toCategory;
            if (message.toCategory === pageData.toCategory) {
                const pageToTarget = pageData.toTarget;
                if ((message.toTarget === pageToTarget)                                         ||
                    ((pageToCategory === ChatCategory.Private) && (fromUserId === pageToTarget))
                ) {
                    this._updateComponentsForMessage();

                    if (Twns.Chat.ChatModel.checkHasUnreadMessageForTarget(pageToCategory, pageToTarget)) {
                        Twns.Chat.ChatProxy.reqUpdateReadProgress(
                            pageToCategory,
                            pageToTarget,
                            Twns.Chat.ChatModel.getLatestMessageTimestamp(pageToCategory, pageToTarget)
                        );
                    }
                }
            }

            const newDataList   = await this._createDataForListChat();
            this._selectedIndex = newDataList.findIndex(v => {
                return (v.toCategory == pageData.toCategory)
                    && (v.toTarget == pageData.toTarget);
            });
            this._dataForListChat = newDataList;
            this._listChat.bindData(newDataList);
        }

        private async _onNotifyMsgChatDeleteMessage(e: egret.Event): Promise<void> {
            const messageId = (e.data as NetMessage.MsgChatDeleteMessage.IS).messageId;
            const list      = this._listMessage;
            if (list.getBoundDataArray()?.some(v => v.message.messageId === messageId)) {
                const chatData  = this._dataForListChat[Twns.Helpers.getExisted(this.getSelectedIndex())];
                const dataArray : DataForMessageRenderer[] = [];
                for (const message of Twns.Chat.ChatModel.getMessagesForCategory(chatData.toCategory).get(chatData.toTarget) || []) {
                    dataArray.push({ message });
                }

                list.bindData(dataArray);
                this._labelNoMessage.visible = !dataArray.length;
            }
        }

        private async _onNotifyMsgChatGetAllMessages(): Promise<void> {
            this._dataForListChat = await this._createDataForListChat();
            this._listChat.bindData(this._dataForListChat);
            this.setSelectedIndex(0);
        }

        private _onTouchedBtnRefresh(): void {
            const currTime  = Twns.Timer.getServerTimestamp();
            const cdTime    = Twns.Chat.ChatModel.getTimestampForNextReqAllMessages() - currTime;
            if (cdTime > 0) {
                Twns.FloatText.show(Lang.getFormattedText(LangTextType.F0026, cdTime));
            } else {
                Twns.Chat.ChatModel.setTimestampForNextReqAllMessages(currTime + 30);
                Twns.Chat.ChatProxy.reqGetAllMessages();
            }
        }

        private _onTouchedBtnSend(): void {
            const content = (this._inputMessage.text ?? ``).trim();
            if (content) {
                if (content.length > Twns.CommonConstants.ChatMessageMaxLength) {
                    Twns.FloatText.show(Lang.getText(LangTextType.B0375));
                } else {
                    const selectedIndex = this.getSelectedIndex();
                    const data          = selectedIndex != null ? this._dataForListChat[selectedIndex] : null;
                    if (data) {
                        Twns.Chat.ChatProxy.reqChatAddMessage(content, data.toCategory, data.toTarget);
                    }
                }
            }
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Private functions.
        ////////////////////////////////////////////////////////////////////////////////
        protected override async _showOpenAnimation(): Promise<void> {
            Twns.Helpers.resetTween({
                obj         : this._imgMask,
                beginProps  : { alpha: 0 },
                endProps    : { alpha: 1 },
            });
            Twns.Helpers.resetTween({
                obj         : this._groupChannel,
                beginProps  : { alpha: 0, left: -40 },
                endProps    : { alpha: 1, left: 0 },
            });
            Twns.Helpers.resetTween({
                obj         : this._groupMessage,
                beginProps  : { alpha: 0, right: -40 },
                endProps    : { alpha: 1, right: 0 },
            });
            Twns.Helpers.resetTween({
                obj         : this._groupInput,
                beginProps  : { alpha: 0, bottom: -40 },
                endProps    : { alpha: 1, bottom: 0 },
            });

            await Twns.Helpers.wait(Twns.CommonConstants.DefaultTweenTime);
        }
        protected override async _showCloseAnimation(): Promise<void> {
            Twns.Helpers.resetTween({
                obj         : this._imgMask,
                beginProps  : { alpha: 1 },
                endProps    : { alpha: 0 },
            });
            Twns.Helpers.resetTween({
                obj         : this._groupChannel,
                beginProps  : { alpha: 1, left: 0 },
                endProps    : { alpha: 0, left: -40 },
            });
            Twns.Helpers.resetTween({
                obj         : this._groupMessage,
                beginProps  : { alpha: 1, right: 0 },
                endProps    : { alpha: 0, right: -40 },
            });
            Twns.Helpers.resetTween({
                obj         : this._groupInput,
                beginProps  : { alpha: 1, bottom: 0 },
                endProps    : { alpha: 0, bottom: -40 },
            });

            await Twns.Helpers.wait(Twns.CommonConstants.DefaultTweenTime);
        }

        private _updateComponentsForLanguage(): void {
            this._labelNoMessage.text   = Lang.getText(LangTextType.B0381);
            this._btnClose.label        = Lang.getText(LangTextType.B0146);
            this._btnRefresh.label      = Lang.getText(LangTextType.B0602);
            this._btnSend.label         = Lang.getText(LangTextType.B0382);
        }

        private _updateComponentsForMessage(): void {
            const chatData  = this._dataForListChat[Twns.Helpers.getExisted(this.getSelectedIndex())];
            const dataArray : DataForMessageRenderer[] = [];
            for (const message of Twns.Chat.ChatModel.getMessagesForCategory(chatData.toCategory).get(chatData.toTarget) || []) {
                dataArray.push({ message });
            }

            this._labelNoMessage.visible = !dataArray.length;
            this._listMessage.bindData(dataArray);
            this._listMessage.scrollVerticalTo(100);
        }

        private async _createDataForListChat(): Promise<DataForChatPageRenderer[]> {
            const dataDict      = new Map<number, DataForChatPageRenderer>();
            const timestampList : { index: number, timestamp: number }[] = [];
            let indexForSort    = 0;
            for (const [toChannelId, msgList] of Twns.Chat.ChatModel.getMessagesForCategory(ChatCategory.PublicChannel)) {
                dataDict.set(indexForSort, {
                    index       : indexForSort,
                    panel       : this,
                    toCategory  : ChatCategory.PublicChannel,
                    toTarget    : toChannelId,
                });
                timestampList.push(getLatestTimestamp(indexForSort, msgList));
                ++indexForSort;
            }
            for (const [toWarAndTeam, msgList] of Twns.Chat.ChatModel.getMessagesForCategory(ChatCategory.WarAndTeam)) {
                dataDict.set(indexForSort, {
                    index       : indexForSort,
                    panel       : this,
                    toCategory  : ChatCategory.WarAndTeam,
                    toTarget    : toWarAndTeam,
                });
                timestampList.push(getLatestTimestamp(indexForSort, msgList));
                ++indexForSort;
            }
            for (const [toRoomId, msgList] of Twns.Chat.ChatModel.getMessagesForCategory(ChatCategory.McrRoom)) {
                if (await MultiCustomRoom.McrModel.getRoomStaticInfo(toRoomId)) {
                    dataDict.set(indexForSort, {
                        index       : indexForSort,
                        panel       : this,
                        toCategory  : ChatCategory.McrRoom,
                        toTarget    : toRoomId,
                    });
                    timestampList.push(getLatestTimestamp(indexForSort, msgList));
                    ++indexForSort;
                }
            }
            for (const [toRoomId, msgList] of Twns.Chat.ChatModel.getMessagesForCategory(ChatCategory.CcrRoom)) {
                if (await CoopCustomRoom.CcrModel.getRoomStaticInfo(toRoomId)) {
                    dataDict.set(indexForSort, {
                        index       : indexForSort,
                        panel       : this,
                        toCategory  : ChatCategory.CcrRoom,
                        toTarget    : toRoomId,
                    });
                    timestampList.push(getLatestTimestamp(indexForSort, msgList));
                    ++indexForSort;
                }
            }
            for (const [toRoomId, msgList] of Twns.Chat.ChatModel.getMessagesForCategory(ChatCategory.MfrRoom)) {
                if (await MultiFreeRoom.MfrModel.getRoomStaticInfo(toRoomId)) {
                    dataDict.set(indexForSort, {
                        index       : indexForSort,
                        panel       : this,
                        toCategory  : ChatCategory.MfrRoom,
                        toTarget    : toRoomId,
                    });
                    timestampList.push(getLatestTimestamp(indexForSort, msgList));
                    ++indexForSort;
                }
            }
            for (const [toMapReviewTarget, msgList] of Twns.Chat.ChatModel.getMessagesForCategory(ChatCategory.MapReview)) {
                dataDict.set(indexForSort, {
                    index       : indexForSort,
                    panel       : this,
                    toCategory  : ChatCategory.MapReview,
                    toTarget    : toMapReviewTarget,
                });
                timestampList.push(getLatestTimestamp(indexForSort, msgList));
                ++indexForSort;
            }
            for (const [toUserId, msgList] of Twns.Chat.ChatModel.getMessagesForCategory(ChatCategory.Private)) {
                dataDict.set(indexForSort, {
                    index       : indexForSort,
                    panel       : this,
                    toCategory  : ChatCategory.Private,
                    toTarget    : toUserId,
                });
                timestampList.push(getLatestTimestamp(indexForSort, msgList));
                ++indexForSort;
            }

            const war = MultiPlayerWar.MpwModel.getWar();
            if (war) {
                const player = war.getPlayerManager().getPlayerByUserId(Twns.Helpers.getExisted(Twns.User.UserModel.getSelfUserId()));
                if ((player) && (player.getAliveState() === Twns.Types.PlayerAliveState.Alive)) {
                    const toWarAndTeam1 = Twns.Helpers.getExisted(war.getWarId()) * Twns.CommonConstants.ChatTeamDivider;
                    if (!checkHasDataForChatCategoryAndTarget({ dict: dataDict, toCategory: ChatCategory.WarAndTeam, toTarget: toWarAndTeam1 })) {
                        dataDict.set(indexForSort, {
                            index       : indexForSort,
                            panel       : this,
                            toCategory  : ChatCategory.WarAndTeam,
                            toTarget    : toWarAndTeam1,
                        });
                        timestampList.push(getLatestTimestamp(indexForSort, null));
                        ++indexForSort;
                    }
                    const toWarAndTeam2 = toWarAndTeam1 + player.getTeamIndex();
                    if (!checkHasDataForChatCategoryAndTarget({ dict: dataDict, toCategory: ChatCategory.WarAndTeam, toTarget: toWarAndTeam2 })) {
                        dataDict.set(indexForSort, {
                            index       : indexForSort,
                            panel       : this,
                            toCategory  : ChatCategory.WarAndTeam,
                            toTarget    : toWarAndTeam2,
                        });
                        timestampList.push(getLatestTimestamp(indexForSort, null));
                        ++indexForSort;
                    }
                }
            }

            const openData = this._getOpenData();
            {
                const toUserId = openData.toUserId;
                if ((toUserId != null) && (!checkHasDataForChatCategoryAndTarget({ dict: dataDict, toCategory: ChatCategory.Private, toTarget: toUserId }))) {
                    dataDict.set(indexForSort, {
                        index       : indexForSort,
                        panel       : this,
                        toCategory  : ChatCategory.Private,
                        toTarget    : toUserId,
                    });
                    timestampList.push(getLatestTimestamp(indexForSort, null));
                    ++indexForSort;
                }
            }

            {
                const toMcrRoomId = openData.toMcrRoomId;
                if ((toMcrRoomId != null) && (!checkHasDataForChatCategoryAndTarget({ dict: dataDict, toCategory: ChatCategory.McrRoom, toTarget: toMcrRoomId }))) {
                    dataDict.set(indexForSort, {
                        index       : indexForSort,
                        panel       : this,
                        toCategory  : ChatCategory.McrRoom,
                        toTarget    : toMcrRoomId,
                    });
                    timestampList.push(getLatestTimestamp(indexForSort, null));
                    ++indexForSort;
                }
            }

            {
                const toCcrRoomId = openData.toCcrRoomId;
                if ((toCcrRoomId != null) && (!checkHasDataForChatCategoryAndTarget({ dict: dataDict, toCategory: ChatCategory.CcrRoom, toTarget: toCcrRoomId }))) {
                    dataDict.set(indexForSort, {
                        index       : indexForSort,
                        panel       : this,
                        toCategory  : ChatCategory.CcrRoom,
                        toTarget    : toCcrRoomId,
                    });
                    timestampList.push(getLatestTimestamp(indexForSort, null));
                    ++indexForSort;
                }
            }

            {
                const toMfrRoomId = openData.toMfrRoomId;
                if ((toMfrRoomId != null) && (!checkHasDataForChatCategoryAndTarget({ dict: dataDict, toCategory: ChatCategory.MfrRoom, toTarget: toMfrRoomId }))) {
                    dataDict.set(indexForSort, {
                        index       : indexForSort,
                        panel       : this,
                        toCategory  : ChatCategory.MfrRoom,
                        toTarget    : toMfrRoomId,
                    });
                    timestampList.push(getLatestTimestamp(indexForSort, null));
                    ++indexForSort;
                }
            }

            {
                const toMapReviewTarget = openData.toMapReviewTarget;
                if ((toMapReviewTarget != null) && (!checkHasDataForChatCategoryAndTarget({ dict: dataDict, toCategory: ChatCategory.MapReview, toTarget: toMapReviewTarget }))) {
                    dataDict.set(indexForSort, {
                        index       : indexForSort,
                        panel       : this,
                        toCategory  : ChatCategory.MapReview,
                        toTarget    : toMapReviewTarget,
                    });
                    timestampList.push(getLatestTimestamp(indexForSort, null));
                    ++indexForSort;
                }
            }

            timestampList.sort((a, b) => b.timestamp - a.timestamp);

            const dataList  : DataForChatPageRenderer[] = [];
            let index       = 0;
            for (const v of timestampList) {
                const data = Twns.Helpers.getExisted(dataDict.get(v.index));
                data.index = index;
                dataList.push(data);
                ++index;
            }

            if (dataList.every(d => (d.toCategory !== ChatCategory.PublicChannel) || (d.toTarget !== ChatChannel.PublicCn))) {
                dataList.push({
                    index       : dataList.length,
                    panel       : this,
                    toCategory  : ChatCategory.PublicChannel,
                    toTarget    : ChatChannel.PublicCn,
                });
            }
            if (dataList.every(d => (d.toCategory !== ChatCategory.PublicChannel) || (d.toTarget !== ChatChannel.PublicEn))) {
                dataList.push({
                    index       : dataList.length,
                    panel       : this,
                    toCategory  : ChatCategory.PublicChannel,
                    toTarget    : ChatChannel.PublicEn,
                });
            }

            return dataList;
        }

        private _getDefaultSelectedIndex(): number {
            const openData          = this._getOpenData();
            const dataForListChat   = this._dataForListChat || [];

            {
                const toUserId  = openData.toUserId;
                if (toUserId != null) {
                    for (const data of dataForListChat) {
                        if ((data.toCategory === ChatCategory.Private) && (data.toTarget === toUserId)) {
                            return data.index;
                        }
                    }
                }
            }

            {
                const toMcrRoomId = openData.toMcrRoomId;
                if (toMcrRoomId != null) {
                    for (const data of dataForListChat) {
                        if ((data.toCategory === ChatCategory.McrRoom) && (data.toTarget === toMcrRoomId)) {
                            return data.index;
                        }
                    }
                }
            }

            {
                const toCcrRoomId = openData.toCcrRoomId;
                if (toCcrRoomId != null) {
                    for (const data of dataForListChat) {
                        if ((data.toCategory === ChatCategory.CcrRoom) && (data.toTarget === toCcrRoomId)) {
                            return data.index;
                        }
                    }
                }
            }

            {
                const toMfrRoomId = openData.toMfrRoomId;
                if (toMfrRoomId != null) {
                    for (const data of dataForListChat) {
                        if ((data.toCategory === ChatCategory.MfrRoom) && (data.toTarget === toMfrRoomId)) {
                            return data.index;
                        }
                    }
                }
            }

            {
                const toMapReviewTarget = openData.toMapReviewTarget;
                if (toMapReviewTarget != null) {
                    for (const data of dataForListChat) {
                        if ((data.toCategory === ChatCategory.MapReview) && (data.toTarget === toMapReviewTarget)) {
                            return data.index;
                        }
                    }
                }
            }

            return 0;
        }
    }

    function getLatestTimestamp(index: number, msgList: CommonProto.Chat.IChatMessage[] | null): { index: number, timestamp: number } {
        let timestamp = 0;
        for (const msg of msgList || []) {
            timestamp = Math.max(timestamp, Twns.Helpers.getExisted(msg.timestamp));
        }
        return {
            index,
            timestamp,
        };
    }
    function checkHasDataForChatCategoryAndTarget({ dict, toTarget, toCategory }: {
        dict        : Map<number, DataForChatPageRenderer>;
        toTarget    : number;
        toCategory  : ChatCategory
    }): boolean {
        for (const [, data] of dict) {
            if ((data.toCategory === toCategory) && (data.toTarget === toTarget)) {
                return true;
            }
        }
        return false;
    }

    type DataForChatPageRenderer = {
        index       : number;
        panel       : ChatPanel;
        toCategory  : ChatCategory;
        toTarget    : number;
    };
    class ChatPageRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForChatPageRenderer> {
        private readonly _labelName!    : TwnsUiLabel.UiLabel;
        private readonly _labelType!    : TwnsUiLabel.UiLabel;
        private readonly _imgRed!       : TwnsUiLabel.UiLabel;

        protected _onOpened(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.MsgChatGetAllMessages,            callback: this._onMsgChatGetAllMessages },
                { type: NotifyType.MsgChatAddMessage,                callback: this._onMsgChatAddMessage },
                { type: NotifyType.MsgChatGetAllReadProgressList,    callback: this._onMsgChatGetAllReadProgressList },
                { type: NotifyType.MsgChatUpdateReadProgress,        callback: this._onMsgChatUpdateReadProgress },
            ]);
        }

        public onItemTapEvent(): void {
            const data = this._getData();
            data.panel.setSelectedIndex(data.index);
        }

        private _onMsgChatGetAllMessages(): void {
            this._updateImgRed();
        }
        private _onMsgChatAddMessage(): void {
            this._updateImgRed();
        }
        private _onMsgChatGetAllReadProgressList(): void {
            this._updateImgRed();
        }
        private _onMsgChatUpdateReadProgress(): void {
            this._updateImgRed();
        }

        protected _onDataChanged(): void {
            const data          = this._getData();
            this.currentState   = data.index === data.panel.getSelectedIndex() ? Twns.Types.UiState.Down : Twns.Types.UiState.Up;
            this._updateLabels();
            this._updateImgRed();
        }

        private async _updateLabels(): Promise<void> {
            const data          = this._getData();
            const toCategory    = data.toCategory;
            const toTarget      = data.toTarget;
            const labelType     = this._labelType;
            const labelName     = this._labelName;

            if (toCategory === ChatCategory.PublicChannel) {
                const languageType  = toTarget === ChatChannel.PublicCn
                    ? Twns.Types.LanguageType.Chinese
                    : (toTarget === ChatChannel.PublicEn
                        ? Twns.Types.LanguageType.English
                        : Lang.getCurrentLanguageType()
                    );
                labelType.text      = Lang.getText(LangTextType.B0376, languageType);
                labelName.text      = Lang.getChatChannelName(toTarget, languageType) ?? Twns.CommonConstants.ErrorTextForUndefined;

            } else if (toCategory === ChatCategory.WarAndTeam) {
                const divider       = Twns.CommonConstants.ChatTeamDivider;
                const teamIndex     = toTarget % divider;
                labelType.text      = Lang.getText(LangTextType.B0377);
                labelName.text      = `ID:${Math.floor(toTarget / divider)} ${teamIndex === 0 ? Lang.getText(LangTextType.B0379) : Lang.getPlayerTeamName(teamIndex)}`;

            } else if (toCategory === ChatCategory.Private) {
                labelType.text = Lang.getText(LangTextType.B0378);
                labelName.text = ``;
                Twns.User.UserModel.getUserNickname(toTarget).then(name => labelName.text = name ?? Twns.CommonConstants.ErrorTextForUndefined);

            } else if (toCategory === ChatCategory.McrRoom) {
                labelType.text = `${Lang.getText(LangTextType.B0443)} #${toTarget}`;
                labelName.text = ``;
                MultiCustomRoom.McrModel.getRoomStaticInfo(toTarget).then(async (v) => {
                    if (v == null) {
                        labelName.text = ``;
                    } else {
                        const settingsForMcw    = Twns.Helpers.getExisted(v.settingsForMcw);
                        const warName           = settingsForMcw.warName;
                        if (warName) {
                            labelName.text = warName;
                        } else {
                            labelName.text = await Twns.WarMap.WarMapModel.getMapNameInCurrentLanguage(Twns.Helpers.getExisted(settingsForMcw.mapId)) ?? Twns.CommonConstants.ErrorTextForUndefined;
                        }
                    }
                });

            } else if (toCategory === ChatCategory.CcrRoom) {
                labelType.text = `${Lang.getText(LangTextType.B0643)} #${toTarget}`;
                labelName.text = ``;
                CoopCustomRoom.CcrModel.getRoomStaticInfo(toTarget).then(async (v) => {
                    if (v == null) {
                        labelName.text = ``;
                    } else {
                        const settingsForCcw    = Twns.Helpers.getExisted(v.settingsForCcw);
                        const warName           = settingsForCcw.warName;
                        if (warName) {
                            labelName.text = warName;
                        } else {
                            labelName.text = await Twns.WarMap.WarMapModel.getMapNameInCurrentLanguage(Twns.Helpers.getExisted(settingsForCcw.mapId)) ?? Twns.CommonConstants.ErrorTextForUndefined;
                        }
                    }
                });

            } else if (toCategory === ChatCategory.MfrRoom) {
                labelType.text = `${Lang.getText(LangTextType.B0556)} #${toTarget}`;
                labelName.text = ``;
                MultiFreeRoom.MfrModel.getRoomStaticInfo(toTarget).then(async (v) => {
                    if (v == null) {
                        labelName.text = ``;
                    } else {
                        labelName.text = v.settingsForMfw?.warName ?? Lang.getText(LangTextType.B0555);
                    }
                });

            } else if (toCategory === ChatCategory.MapReview) {
                labelType.text = `${Lang.getText(LangTextType.B0892)}`;
                labelName.text = (await Twns.User.UserModel.getUserBriefInfo(toTarget))?.nickname ?? Twns.CommonConstants.ErrorTextForUndefined;

            } else {
                throw Twns.Helpers.newError(`Invalid data.`);
            }
        }

        private _updateImgRed(): void {
            const data              = this._getData();
            this._imgRed.visible    = Twns.Chat.ChatModel.checkHasUnreadMessageForTarget(data.toCategory, data.toTarget);
        }
    }

    type DataForMessageRenderer = {
        message: CommonProto.Chat.IChatMessage;
    };
    class MessageRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForMessageRenderer> {
        private readonly _imgAvatar!    : TwnsUiImage.UiImage;
        private readonly _labelName!    : TwnsUiLabel.UiLabel;
        private readonly _labelContent! : TwnsUiLabel.UiLabel;

        protected async _onDataChanged(): Promise<void> {
            const data                  = this._getData();
            const message               = data.message;
            const fromUserId            = Twns.Helpers.getExisted(message.fromUserId);
            this._labelContent.text     = message.content ?? Twns.CommonConstants.ErrorTextForUndefined;
            this._labelName.textColor   = fromUserId === Twns.User.UserModel.getSelfUserId() ? 0x00FF00 : 0xFFFFFF;
            this._labelName.text        = `    (${Twns.Helpers.getTimestampShortText(Twns.Helpers.getExisted(message.timestamp))})`;

            const userInfo = Twns.Helpers.getExisted(await Twns.User.UserModel.getUserPublicInfo(fromUserId));
            if ((this._getIsOpening()) && (data === this._getData())) {
                this._imgAvatar.source  = Config.ConfigManager.getUserAvatarImageSource(userInfo.avatarId ?? 1);
                this._labelName.text    = `${userInfo.nickname || `???`}    (${Twns.Helpers.getTimestampShortText(Twns.Helpers.getExisted(message.timestamp))})`;
            }
        }

        public async onItemTapEvent(): Promise<void> {
            const message = this._getData().message;
            Twns.PanelHelpers.open(Twns.PanelHelpers.PanelDict.ChatCommandPanel, {
                messageId   : Twns.Helpers.getExisted(message.messageId),
                userId      : message.fromUserId,
            });
        }
    }
}

// export default TwnsChatPanel;
