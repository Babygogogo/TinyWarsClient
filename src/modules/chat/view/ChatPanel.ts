
namespace TinyWars.Chat {
    import Types            = Utility.Types;
    import Lang             = Utility.Lang;
    import Notify           = Utility.Notify;
    import FloatText        = Utility.FloatText;
    import ProtoTypes       = Utility.ProtoTypes;
    import Helpers          = Utility.Helpers;
    import Logger           = Utility.Logger;
    import ConfigManager    = Utility.ConfigManager;
    import ChatCategory     = Types.ChatMessageToCategory;
    import ChatChannel      = Types.ChatChannel;
    import NetMessage       = ProtoTypes.NetMessage;
    import CommonConstants  = ConfigManager.COMMON_CONSTANTS;

    type OpenDataForChatPanel = {
        toUserId?   : number;
        toMcrRoomId?: number;
    }

    export class ChatPanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Hud0;
        protected readonly _IS_EXCLUSIVE = false;

        private static _instance: ChatPanel;

        private _groupChannel   : eui.Group;
        private _labelChatTitle : TinyWars.GameUi.UiLabel;
        private _listChat       : TinyWars.GameUi.UiScrollList;
        private _btnBack        : TinyWars.GameUi.UiButton;
        private _btnRefresh     : TinyWars.GameUi.UiButton;
        private _groupMessage   : eui.Group;
        private _labelNoMessage : TinyWars.GameUi.UiLabel;
        private _listMessage    : TinyWars.GameUi.UiScrollList;
        private _groupInput     : eui.Group;
        private _inputMessage   : TinyWars.GameUi.UiTextInput;
        private _btnSend        : TinyWars.GameUi.UiButton;

        private _dataForListChat: DataForChatPageRenderer[] = [];
        private _selectedIndex  : number;

        public static show(openData: OpenDataForChatPanel): void {
            if (!ChatPanel._instance) {
                ChatPanel._instance = new ChatPanel();
            }
            ChatPanel._instance.open(openData);
        }
        public static hide(): void {
            if (ChatPanel._instance) {
                ChatPanel._instance.close();
            }
        }
        public static getIsOpening(): boolean {
            const instance = ChatPanel._instance;
            return instance ? instance.getIsOpening() : false;
        }

        public constructor() {
            super();

            this._setIsAutoAdjustHeight();
            this._setIsTouchMaskEnabled();
            this._setIsCloseOnTouchedMask();
            this.skinName = "resource/skins/chat/ChatPanel.exml";
        }

        protected async _onOpened(): Promise<void> {
            this._setNotifyListenerArray([
                { type: Notify.Type.LanguageChanged,        callback: this._onNotifyLanguageChanged },
                { type: Notify.Type.MsgChatAddMessage,      callback: this._onMsgChatAddMessage },
                { type: Notify.Type.MsgChatGetAllMessages,  callback: this._onMsgChatGetAllMessages },
            ]);
            this._setUiListenerArray([
                { ui: this._btnBack,    callback: this.close },
                { ui: this._btnRefresh, callback: this._onTouchedBtnRefresh },
                { ui: this._btnSend,    callback: this._onTouchedBtnSend },
            ]);
            this._listChat.setItemRenderer(ChatPageRenderer);
            this._listMessage.setItemRenderer(MessageRenderer);

            this._showOpenAnimation();
            this._updateComponentsForLanguage();

            this._dataForListChat = await this._createDataForListChat();
            this._listChat.bindData(this._dataForListChat);
            this.setSelectedIndex(this._getDefaultSelectedIndex());

            Notify.dispatch(Notify.Type.ChatPanelOpened);
        }
        protected _onClosed(): void {
            this._dataForListChat   = null;
            this._selectedIndex     = null;
            this._listChat.clear();
            this._listMessage.clear();

            Notify.dispatch(Notify.Type.ChatPanelClosed);
        }

        public setSelectedIndex(newIndex: number): void {
            const dataList  = this._dataForListChat;
            const oldIndex  = this._selectedIndex;
            if (!dataList[newIndex]) {
                newIndex = 0;
            }
            this._selectedIndex = newIndex;
            if (dataList[oldIndex]) {
                this._listChat.updateSingleData(oldIndex, dataList[oldIndex]);
            }
            if (oldIndex !== newIndex) {
                const data = dataList[newIndex];
                this._listChat.updateSingleData(newIndex, data);
                this._updateComponentsForMessage();

                const toCategory    = data.toCategory;
                const toTarget      = data.toTarget;
                if (ChatModel.checkHasUnreadMessageForTarget(toCategory, toTarget)) {
                    ChatProxy.reqUpdateReadProgress(
                        toCategory,
                        toTarget,
                        ChatModel.getLatestMessageTimestamp(toCategory, toTarget)
                    );
                }
            }
        }
        public getSelectedIndex(): number {
            return this._selectedIndex;
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Callbacks.
        ////////////////////////////////////////////////////////////////////////////////
        private _onNotifyLanguageChanged(e: egret.Event): void {
            this._updateComponentsForLanguage();
        }

        private async _onMsgChatAddMessage(e: egret.Event): Promise<void> {
            const message       = (e.data as NetMessage.MsgChatAddMessage.IS).message;
            const fromUserId    = message.fromUserId;
            if (fromUserId === User.UserModel.getSelfUserId()) {
                this._inputMessage.text = "";
            }

            const pageData          = this._dataForListChat[this.getSelectedIndex()];
            const pageToCategory    = pageData.toCategory;
            if (message.toCategory === pageData.toCategory) {
                const pageToTarget = pageData.toTarget;
                if ((message.toTarget === pageToTarget)                                         ||
                    ((pageToCategory === ChatCategory.Private) && (fromUserId === pageToTarget))
                ) {
                    this._updateComponentsForMessage();

                    if (ChatModel.checkHasUnreadMessageForTarget(pageToCategory, pageToTarget)) {
                        ChatProxy.reqUpdateReadProgress(
                            pageToCategory,
                            pageToTarget,
                            ChatModel.getLatestMessageTimestamp(pageToCategory, pageToTarget)
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

        private async _onMsgChatGetAllMessages(e: egret.Event): Promise<void> {
            this._dataForListChat = await this._createDataForListChat();
            this._listChat.bindData(this._dataForListChat);
            this.setSelectedIndex(0);
        }

        private _onTouchedBtnRefresh(e: egret.TouchEvent): void {
            const currTime  = Time.TimeModel.getServerTimestamp();
            const cdTime    = ChatModel.getTimestampForNextReqAllMessages() - currTime;
            if (cdTime > 0) {
                FloatText.show(Lang.getFormattedText(Lang.Type.F0026, cdTime));
            } else {
                ChatModel.setTimestampForNextReqAllMessages(currTime + 30);
                ChatProxy.reqGetAllMessages();
            }
        }

        private _onTouchedBtnSend(e: egret.TouchEvent): void {
            const content = this._inputMessage.text;
            if (content) {
                if (content.length > CommonConstants.ChatContentMaxLength) {
                    FloatText.show(Lang.getText(Lang.Type.B0375));
                } else {
                    const data = this._dataForListChat[this.getSelectedIndex()];
                    if (data) {
                        ChatProxy.reqChatAddMessage(content, data.toCategory, data.toTarget);
                    }
                }
            }
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Private functions.
        ////////////////////////////////////////////////////////////////////////////////
        private _showOpenAnimation(): void {
            const groupChannel = this._groupChannel;
            egret.Tween.removeTweens(groupChannel);
            egret.Tween.get(groupChannel)
                .set({ alpha: 0, left: -40 })
                .to({ alpha: 1, left: 0 }, 200);

            const groupMessage = this._groupMessage;
            egret.Tween.removeTweens(groupMessage);
            egret.Tween.get(groupMessage)
                .set({ alpha: 0, right: -40 })
                .to({ alpha: 1, right: 0 }, 200);

            const groupInput = this._groupInput;
            egret.Tween.removeTweens(groupInput);
            egret.Tween.get(groupInput)
                .set({ alpha: 0, bottom: -40 })
                .to({ alpha: 1, bottom: 0 }, 200);
        }

        private _updateComponentsForLanguage(): void {
            this._labelChatTitle.text   = Lang.getText(Lang.Type.B0380);
            this._labelNoMessage.text   = Lang.getText(Lang.Type.B0381);
            this._btnSend.label         = Lang.getText(Lang.Type.B0382);
        }

        private _updateComponentsForMessage(): void {
            const data                      = this._dataForListChat[this.getSelectedIndex()];
            const messageList               = ChatModel.getMessagesForCategory(data.toCategory).get(data.toTarget) || [];
            this._labelNoMessage.visible    = !messageList.length;
            this._listMessage.bindData(messageList);
            this._listMessage.scrollVerticalTo(100);
        }

        private async _createDataForListChat(): Promise<DataForChatPageRenderer[]> {
            const dataDict      = new Map<number, DataForChatPageRenderer>();
            const timestampList : { index: number, timestamp: number }[] = [];
            let indexForSort    = 0;
            for (const [toChannelId, msgList] of ChatModel.getMessagesForCategory(ChatCategory.PublicChannel)) {
                dataDict.set(indexForSort, {
                    index       : indexForSort,
                    panel       : this,
                    toCategory  : ChatCategory.PublicChannel,
                    toTarget    : toChannelId,
                });
                timestampList.push(getLatestTimestamp(indexForSort, msgList));
                ++indexForSort;
            }
            for (const [toWarAndTeam, msgList] of ChatModel.getMessagesForCategory(ChatCategory.WarAndTeam)) {
                dataDict.set(indexForSort, {
                    index       : indexForSort,
                    panel       : this,
                    toCategory  : ChatCategory.WarAndTeam,
                    toTarget    : toWarAndTeam,
                });
                timestampList.push(getLatestTimestamp(indexForSort, msgList));
                ++indexForSort;
            }
            for (const [toRoomId, msgList] of ChatModel.getMessagesForCategory(ChatCategory.McrRoom)) {
                if (await MultiCustomRoom.McrModel.getRoomInfo(toRoomId)) {
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
            for (const [toUserId, msgList] of ChatModel.getMessagesForCategory(ChatCategory.Private)) {
                dataDict.set(indexForSort, {
                    index       : indexForSort,
                    panel       : this,
                    toCategory  : ChatCategory.Private,
                    toTarget    : toUserId,
                });
                timestampList.push(getLatestTimestamp(indexForSort, msgList));
                ++indexForSort;
            }

            const war           = MultiPlayerWar.MpwModel.getWar();
            const playerManager = war ? war.getPlayerManager() : null;
            const player        = playerManager ? playerManager.getPlayerByUserId(User.UserModel.getSelfUserId()) : null;
            if ((player) && (player.getAliveState() === Types.PlayerAliveState.Alive)) {
                const toWarAndTeam1 = war.getWarId() * CommonConstants.ChatTeamDivider;
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

            const openData = this._getOpenData<OpenDataForChatPanel>();
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

            timestampList.sort((a, b) => b.timestamp - a.timestamp);

            const dataList  : DataForChatPageRenderer[] = [];
            let index       = 0;
            for (const v of timestampList) {
                const data = dataDict.get(v.index);
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
            const openData          = this._getOpenData<OpenDataForChatPanel>();
            const dataForListChat   = this._dataForListChat || [];

            const toUserId  = openData.toUserId;
            if (toUserId != null) {
                for (const data of dataForListChat) {
                    if ((data.toCategory === ChatCategory.Private) && (data.toTarget === toUserId)) {
                        return data.index;
                    }
                }
            }

            const toMcrRoomId = openData.toMcrRoomId;
            if (toMcrRoomId != null) {
                for (const data of dataForListChat) {
                    if ((data.toCategory === ChatCategory.McrRoom) && (data.toTarget === toMcrRoomId)) {
                        return data.index;
                    }
                }
            }

            return 0;
        }
    }

    function getLatestTimestamp(index: number, msgList: ProtoTypes.Chat.IChatMessage[] | null): { index: number, timestamp: number } {
        let timestamp = 0;
        for (const msg of msgList || []) {
            timestamp = Math.max(timestamp, msg.timestamp);
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
    }

    class ChatPageRenderer extends GameUi.UiListItemRenderer {
        private _labelName      : GameUi.UiLabel;
        private _labelType      : GameUi.UiLabel;
        private _imgRed         : GameUi.UiLabel;

        protected _onOpened(): void {
            this._setNotifyListenerArray([
                { type: Notify.Type.MsgChatGetAllMessages,            callback: this._onMsgChatGetAllMessages },
                { type: Notify.Type.MsgChatAddMessage,                callback: this._onMsgChatAddMessage },
                { type: Notify.Type.MsgChatGetAllReadProgressList,    callback: this._onMsgChatGetAllReadProgressList },
                { type: Notify.Type.MsgChatUpdateReadProgress,        callback: this._onMsgChatUpdateReadProgress },
            ]);
        }

        public onItemTapEvent(e: egret.TouchEvent): void {
            const data = this.data as DataForChatPageRenderer;
            data.panel.setSelectedIndex(data.index);
        }

        private _onMsgChatGetAllMessages(e: egret.Event): void {
            this._updateImgRed();
        }
        private _onMsgChatAddMessage(e: egret.Event): void {
            this._updateImgRed();
        }
        private _onMsgChatGetAllReadProgressList(e: egret.Event): void {
            this._updateImgRed();
        }
        private _onMsgChatUpdateReadProgress(e: egret.Event): void {
            this._updateImgRed();
        }

        protected dataChanged(): void {
            super.dataChanged();

            const data          = this.data as DataForChatPageRenderer;
            this.currentState   = data.index === data.panel.getSelectedIndex() ? Types.UiState.Down : Types.UiState.Up;
            this._updateLabels();
            this._updateImgRed();
        }

        private _updateLabels(): void {
            const data          = this.data as DataForChatPageRenderer;
            const toCategory    = data.toCategory;
            const toTarget      = data.toTarget;
            const labelType     = this._labelType;
            const labelName     = this._labelName;

            if (toCategory === ChatCategory.PublicChannel) {
                labelType.text  = Lang.getText(Lang.Type.B0376);
                labelName.text  = Lang.getChatChannelName(toTarget);

            } else if (toCategory === ChatCategory.WarAndTeam) {
                const divider       = CommonConstants.ChatTeamDivider;
                const teamIndex     = toTarget % divider;
                labelType.text      = Lang.getText(Lang.Type.B0377);
                labelName.text      = `ID:${Math.floor(toTarget / divider)} ${teamIndex === 0 ? Lang.getText(Lang.Type.B0379) : Lang.getPlayerTeamName(teamIndex)}`;

            } else if (toCategory === ChatCategory.Private) {
                labelType.text = Lang.getText(Lang.Type.B0378);
                labelName.text = null;
                User.UserModel.getUserNickname(toTarget).then(name => labelName.text = name);

            } else if (toCategory === ChatCategory.McrRoom) {
                labelType.text = `${Lang.getText(Lang.Type.B0443)} #${toTarget}`;
                labelName.text = null;
                MultiCustomRoom.McrModel.getRoomInfo(toTarget).then(async (v) => {
                    const warName = v ? v.settingsForMcw.warName : null;
                    if (warName) {
                        labelName.text = warName;
                    } else {
                        labelName.text = await WarMap.WarMapModel.getMapNameInCurrentLanguage(v.settingsForCommon.mapId);
                    }
                });

            } else {
                Logger.error(`ChatPanel.ChatPageRenderer._updateLabels() invalid data!`);
            }
        }

        private _updateImgRed(): void {
            const data              = this.data as DataForChatPageRenderer;
            this._imgRed.visible    = ChatModel.checkHasUnreadMessageForTarget(data.toCategory, data.toTarget);
        }
    }

    type DataForMessageRenderer = ProtoTypes.Chat.IChatMessage;

    class MessageRenderer extends GameUi.UiListItemRenderer {
        private _labelName      : TinyWars.GameUi.UiLabel;
        private _labelContent   : TinyWars.GameUi.UiLabel;

        protected dataChanged(): void {
            super.dataChanged();

            const data                  = this.data as DataForMessageRenderer;
            const fromUserId            = data.fromUserId;
            this._labelContent.text     = data.content;
            this._labelName.textColor   = fromUserId === User.UserModel.getSelfUserId() ? 0x00FF00 : 0xFFFFFF;
            this._labelName.text        = `    (${Helpers.getTimestampShortText(data.timestamp)})`;
            User.UserModel.getUserPublicInfo(fromUserId).then(info => {
                const d = this.data as DataForMessageRenderer;
                if ((d) && (info.userId === d.fromUserId)) {
                    this._labelName.text = `${info.nickname || `???`}    (${Helpers.getTimestampShortText(data.timestamp)})`;
                }
            });
        }

        public async onItemTapEvent(e: eui.ItemTapEvent): Promise<void> {
            const data = this.data as DataForMessageRenderer;
            if (data.toCategory !== ChatCategory.Private) {
                const userId = data.fromUserId;
                if (userId !== User.UserModel.getSelfUserId()) {
                    const info = await User.UserModel.getUserPublicInfo(userId);
                    if (info) {
                        Common.CommonConfirmPanel.show({
                            title   : Lang.getText(Lang.Type.B0088),
                            content : Lang.getFormattedText(Lang.Type.F0025, info.nickname),
                            callback: () => {
                                ChatPanel.show({ toUserId: userId });
                            },
                        });
                    }
                }
            }
        }
    }
}
