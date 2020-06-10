
namespace TinyWars.Chat {
    import Types            = Utility.Types;
    import Lang             = Utility.Lang;
    import Notify           = Utility.Notify;
    import FloatText        = Utility.FloatText;
    import ProtoTypes       = Utility.ProtoTypes;
    import Helpers          = Utility.Helpers;
    import Logger           = Utility.Logger;
    import CommonConstants  = Utility.ConfigManager.COMMON_CONSTANTS;
    import ChatCategory     = Types.ChatMessageToCategory;
    import ChatChannel      = Types.ChatChannel;

    type OpenDataForChatPanel = {
        toUserId?: number;
    }

    export class ChatPanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Hud0;
        protected readonly _IS_EXCLUSIVE = false;

        private static _instance: ChatPanel;

        private _labelChatTitle : TinyWars.GameUi.UiLabel;
        private _listChat       : TinyWars.GameUi.UiScrollList;
        private _btnBack        : TinyWars.GameUi.UiButton;
        private _labelNoMessage : TinyWars.GameUi.UiLabel;
        private _listMessage    : TinyWars.GameUi.UiScrollList;
        private _inputMessage   : TinyWars.GameUi.UiTextInput;
        private _btnSend        : TinyWars.GameUi.UiButton;

        private _openData       : OpenDataForChatPanel;
        private _dataForListChat: DataForChatPageRenderer[] = [];
        private _selectedIndex  : number;

        public static show(openData: OpenDataForChatPanel): void {
            if (!ChatPanel._instance) {
                ChatPanel._instance = new ChatPanel();
            }
            ChatPanel._instance._openData = openData;
            ChatPanel._instance.open();
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

            this._setAutoAdjustHeightEnabled();
            this._setTouchMaskEnabled();
            this._callbackForTouchMask = () => this.close();
            this.skinName = "resource/skins/chat/ChatPanel.exml";
        }

        protected _onFirstOpened(): void {
            this._notifyListeners = [
                { type: Notify.Type.LanguageChanged,        callback: this._onNotifyLanguageChanged },
                { type: Notify.Type.SChatAddMessage,        callback: this._onNotifySChatAddMessage },
                { type: Notify.Type.SChatGetAllMessages,    callback: this._onNotifySChatGetAllMessages },
            ];
            this._uiListeners = [
                { ui: this._btnBack,    callback: this.close },
                { ui: this._btnSend,    callback: this._onTouchedBtnSend },
            ];
            this._listChat.setItemRenderer(ChatPageRenderer);
            this._listMessage.setItemRenderer(MessageRenderer);
        }
        protected _onOpened(): void {
            this._updateComponentsForLanguage();

            this._dataForListChat = this._createDataForListChat();
            this._listChat.bindData(this._dataForListChat);
            this.setSelectedIndex(this._getDefaultSelectedIndex());

            Notify.dispatch(Notify.Type.ChatPanelOpened);
        }
        protected _onClosed(): void {
            this._openData          = null;
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
                this._listChat.updateSingleData(newIndex, dataList[newIndex]);
                this._updateComponentsForMessage();
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

        private _onNotifySChatAddMessage(e: egret.Event): void {
            const message       = (e.data as ProtoTypes.IS_ChatAddMessage).message;
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
                }
            }

            const newDataList   = this._createDataForListChat();
            this._selectedIndex = newDataList.findIndex(v => {
                return (v.toCategory == pageData.toCategory)
                    && (v.toTarget == pageData.toTarget);
            });
            this._dataForListChat = newDataList;
            this._listChat.bindData(newDataList);
        }

        private _onNotifySChatGetAllMessages(e: egret.Event): void {
            this._dataForListChat = this._createDataForListChat();
            this._listChat.bindData(this._dataForListChat);
            this.setSelectedIndex(0);
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
        private _updateComponentsForLanguage(): void {
            this._labelChatTitle.text   = Lang.getText(Lang.Type.B0380);
            this._btnBack.label         = Lang.getText(Lang.Type.B0146);
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

        private _createDataForListChat(): DataForChatPageRenderer[] {
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

            const war           = MultiCustomWar.McwModel.getWar();
            const playerManager = war ? war.getPlayerManager() : null;
            const player        = playerManager ? playerManager.getPlayerByUserId(User.UserModel.getSelfUserId()) : null;
            if ((player) && (player.getIsAlive())) {
                const toWarAndTeam1 = war.getWarId() * CommonConstants.ChatTeamDivider;
                if (!checkHasDataForWarAndTeam(dataDict, toWarAndTeam1)) {
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
                if (!checkHasDataForWarAndTeam(dataDict, toWarAndTeam2)) {
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

            const openData = this._openData;
            const toUserId = openData.toUserId;
            if ((toUserId != null) && (!checkHasDataForUser(dataDict, toUserId))) {
                dataDict.set(indexForSort, {
                    index       : indexForSort,
                    panel       : this,
                    toCategory  : ChatCategory.Private,
                    toTarget    : toUserId,
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
            const openData  = this._openData;
            const toUserId  = openData.toUserId;
            if (toUserId != null) {
                for (const data of this._dataForListChat || []) {
                    if (data.toTarget === toUserId) {
                        return data.index;
                    }
                }
            }
            return 0;
        }
    }

    function getLatestTimestamp(index: number, msgList: ProtoTypes.IChatMessage[] | null): { index: number, timestamp: number } {
        let timestamp = 0;
        for (const msg of msgList || []) {
            timestamp = Math.max(timestamp, msg.timestamp);
        }
        return {
            index,
            timestamp,
        };
    }
    function checkHasDataForWarAndTeam(dict: Map<number, DataForChatPageRenderer>, toWarAndTeam: number): boolean {
        for (const [, data] of dict) {
            if ((data.toCategory === ChatCategory.WarAndTeam) && (data.toTarget === toWarAndTeam)) {
                return true;
            }
        }
        return false;
    }
    function checkHasDataForUser(dict: Map<number, DataForChatPageRenderer>, toUserId: number): boolean {
        for (const [, data] of dict) {
            if ((data.toCategory === ChatCategory.Private) && (data.toTarget === toUserId)) {
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

    class ChatPageRenderer extends eui.ItemRenderer {
        private _labelName: GameUi.UiLabel;
        private _labelType: GameUi.UiLabel;

        protected dataChanged(): void {
            super.dataChanged();

            const data          = this.data as DataForChatPageRenderer;
            this.currentState   = data.index === data.panel.getSelectedIndex() ? Types.UiState.Down : Types.UiState.Up;
            this._updateLabels();
        }

        private async _updateLabels(): Promise<void> {
            const data          = this.data as DataForChatPageRenderer;
            const toCategory    = data.toCategory;
            const toTarget      = data.toTarget;
            if (toCategory === ChatCategory.PublicChannel) {
                this._labelType.text    = Lang.getText(Lang.Type.B0376);
                this._labelName.text    = Lang.getChatChannelName(toTarget);

            } else if (toCategory === ChatCategory.WarAndTeam) {
                const divider           = CommonConstants.ChatTeamDivider;
                const teamIndex         = toTarget % divider;
                this._labelType.text    = Lang.getText(Lang.Type.B0377);
                this._labelName.text    = `ID:${Math.floor(toTarget / divider)} ${teamIndex === 0 ? Lang.getText(Lang.Type.B0379) : Lang.getPlayerTeamName(teamIndex)}`;
                return;

            } else if (toCategory === ChatCategory.Private) {
                this._labelType.text = Lang.getText(Lang.Type.B0378);
                User.UserModel.getUserNickname(toTarget).then(name => this._labelName.text = name);
                return;

            } else {
                Logger.error(`ChatPanel.ChatPageRenderer._updateLabels() invalid data!`);
            }
        }

        public onItemTapEvent(e: egret.TouchEvent): void {
            const data = this.data as DataForChatPageRenderer;
            data.panel.setSelectedIndex(data.index);
        }
    }

    type DataForMessageRenderer = ProtoTypes.IChatMessage;

    class MessageRenderer extends eui.ItemRenderer {
        private _labelName      : TinyWars.GameUi.UiLabel;
        private _labelContent   : TinyWars.GameUi.UiLabel;

        protected async dataChanged(): Promise<void> {
            super.dataChanged();

            const data                  = this.data as DataForMessageRenderer;
            const userInfo              = await User.UserModel.getUserPublicInfo(data.fromUserId);
            this._labelName.textColor   = (userInfo) && (userInfo.id === User.UserModel.getSelfUserId()) ? 0x00FF00 : 0xFFFFFF;
            this._labelName.text        = `${userInfo ? userInfo.nickname : `???`}    (${Helpers.getTimestampShortText(data.timestamp)})`;
            this._labelContent.text     = data.content;
        }

        public async onItemTapEvent(e: eui.ItemTapEvent): Promise<void> {
            const data = this.data as DataForMessageRenderer;
            if (data.toCategory !== ChatCategory.Private) {
                const userId = data.fromUserId;
                if (userId !== User.UserModel.getSelfUserId()) {
                    const info = await User.UserModel.getUserPublicInfo(userId);
                    if (info) {
                        Common.ConfirmPanel.show({
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
