
import ChatModel                    from "../../chat/model/ChatModel";
import TwnsChatPanel                from "../../chat/view/ChatPanel";
import TwnsCommonDamageChartPanel   from "../../common/view/CommonDamageChartPanel";
import TwnsMeMapListPanel           from "../../mapEditor/view/MeMapListPanel";
import Helpers                      from "../../tools/helpers/Helpers";
import Types                        from "../../tools/helpers/Types";
import TwnsNotifyType               from "../../tools/notify/NotifyType";
import TwnsUiImage                  from "../../tools/ui/UiImage";
import TwnsUiPanel                  from "../../tools/ui/UiPanel";
import UserModel                    from "../../user/model/UserModel";
import TwnsUserOnlineUsersPanel     from "../../user/view/UserOnlineUsersPanel";
import TwnsUserPanel                from "../../user/view/UserPanel";
import TwnsLobbyTopPanel            from "./LobbyTopPanel";

namespace TwnsLobbyBottomPanel {
    import ChatPanel                = TwnsChatPanel.ChatPanel;
    import UserPanel                = TwnsUserPanel.UserPanel;
    import CommonDamageChartPanel   = TwnsCommonDamageChartPanel.CommonDamageChartPanel;
    import UserOnlineUsersPanel     = TwnsUserOnlineUsersPanel.UserOnlineUsersPanel;
    import MeMapListPanel           = TwnsMeMapListPanel.MeMapListPanel;
    import NotifyType               = TwnsNotifyType.NotifyType;
    import Tween                    = egret.Tween;

    // eslint-disable-next-line no-shadow
    export class LobbyBottomPanel extends TwnsUiPanel.UiPanel<void> {
        protected readonly _LAYER_TYPE   = Types.LayerType.Hud0;
        protected readonly _IS_EXCLUSIVE = false;

        private static _instance: LobbyBottomPanel;

        private _groupBottom    : eui.Group;
        private _groupMyInfo    : eui.Group;
        private _groupChat      : eui.Group;
        private _imgChatRed     : TwnsUiImage.UiImage;
        private _groupMapEditor : eui.Group;
        private _groupGameData  : eui.Group;

        public static show(): void {
            if (!LobbyBottomPanel._instance) {
                LobbyBottomPanel._instance = new LobbyBottomPanel();
            }
            LobbyBottomPanel._instance.open(undefined);
        }

        public static async hide(): Promise<void> {
            if (LobbyBottomPanel._instance) {
                await LobbyBottomPanel._instance.close();
            }
        }

        private constructor() {
            super();

            this.skinName = "resource/skins/lobby/LobbyBottomPanel.exml";
        }

        protected _onOpened(): void {
            this._setUiListenerArray([
                { ui: this._groupMyInfo,        callback: this._onTouchedGroupMyInfo },
                { ui: this._groupChat,          callback: this._onTouchedGroupChat },
                { ui: this._groupMapEditor,     callback: this._onTouchedGroupMapEditor },
                { ui: this._groupGameData,      callback: this._onTouchedGroupGameData },
            ]);
            this._setNotifyListenerArray([
                { type: NotifyType.MsgUserLogout,                  callback: this._onMsgUserLogout },
                { type: NotifyType.MsgChatGetAllReadProgressList,  callback: this._onMsgChatGetAllReadProgressList },
                { type: NotifyType.MsgChatUpdateReadProgress,      callback: this._onMsgChatUpdateReadProgress },
                { type: NotifyType.MsgChatGetAllMessages,          callback: this._onMsgChatGetAllMessages },
                { type: NotifyType.MsgChatAddMessage,              callback: this._onMsgChatAddMessages },
            ]);

            this._showOpenAnimation();
            this._updateImgChatRed();
        }

        protected async _onClosed(): Promise<void> {
            await this._showCloseAnimation();
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Callbacks.
        ////////////////////////////////////////////////////////////////////////////////
        private _onTouchedGroupMyInfo(e: egret.TouchEvent): void {
            UserOnlineUsersPanel.hide();
            ChatPanel.hide();
            UserPanel.show({ userId: UserModel.getSelfUserId() });
        }

        private _onTouchedGroupChat(e: egret.TouchEvent): void {
            UserOnlineUsersPanel.hide();
            UserPanel.hide();
            if (!ChatPanel.getIsOpening()) {
                ChatPanel.show({ toUserId: null });
            } else {
                ChatPanel.hide();
            }
        }

        private _onTouchedGroupMapEditor(e: egret.TouchEvent): void {
            this.close();
            TwnsLobbyTopPanel.LobbyTopPanel.hide();
            MeMapListPanel.show();
        }

        private _onTouchedGroupGameData(e: egret.TouchEvent): void {
            CommonDamageChartPanel.show();
        }

        private _onMsgUserLogout(e: egret.Event): void {
            this.close();
        }
        private _onMsgChatGetAllReadProgressList(e: egret.Event): void {
            this._updateImgChatRed();
        }
        private _onMsgChatUpdateReadProgress(e: egret.Event): void {
            this._updateImgChatRed();
        }
        private _onMsgChatGetAllMessages(e: egret.Event): void {
            this._updateImgChatRed();
        }
        private _onMsgChatAddMessages(e: egret.Event): void {
            this._updateImgChatRed();
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Private functions.
        ////////////////////////////////////////////////////////////////////////////////
        private _updateImgChatRed(): void {
            this._imgChatRed.visible = ChatModel.checkHasUnreadMessage();
        }

        private _showOpenAnimation(): void {
            const groupBottom = this._groupBottom;
            Tween.removeTweens(groupBottom);
            Tween.get(groupBottom)
                .set({ alpha: 0, bottom: -40 })
                .to({ alpha: 1, bottom: 0 }, 200);

            Helpers.resetTween({
                obj         : this._groupMyInfo,
                beginProps  : { alpha: 0, top: 40 },
                endProps    : { alpha: 1, top: 0 },
            });
            Helpers.resetTween({
                obj         : this._groupChat,
                beginProps  : { alpha: 0, top: 40 },
                waitTime    : 66,
                endProps    : { alpha: 1, top: 0 },
            });
            Helpers.resetTween({
                obj         : this._groupMapEditor,
                beginProps  : { alpha: 0, top: 40 },
                waitTime    : 132,
                endProps    : { alpha: 1, top: 0 },
            });
            Helpers.resetTween({
                obj         : this._groupGameData,
                beginProps  : { alpha: 0, top: 40 },
                waitTime    : 200,
                endProps    : { alpha: 1, top: 0 },
            });
        }
        private _showCloseAnimation(): Promise<void> {
            return new Promise<void>((resolve, reject) => {
                const groupBottom = this._groupBottom;
                Tween.removeTweens(groupBottom);
                Tween.get(groupBottom)
                    .set({ alpha: 1, bottom: 0 })
                    .to({ alpha: 0, bottom: -40 }, 200)
                    .call(resolve);
            });
        }
    }
}

export default TwnsLobbyBottomPanel;
