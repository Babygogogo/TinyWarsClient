
// import CommonConstants      from "../../tools/helpers/CommonConstants";
// import FloatText            from "../../tools/helpers/FloatText";
// import Helpers              from "../../tools/helpers/Helpers";
// import Types                from "../../tools/helpers/Types";
// import Lang                 from "../../tools/lang/Lang";
// import TwnsLangTextType     from "../../tools/lang/LangTextType";
// import Twns.Notify       from "../../tools/notify/NotifyType";
// import ProtoTypes           from "../../tools/proto/ProtoTypes";
// import TwnsUiButton         from "../../tools/ui/UiButton";
// import TwnsUiImage          from "../../tools/ui/UiImage";
// import TwnsUiLabel          from "../../tools/ui/UiLabel";
// import TwnsUiPanel          from "../../tools/ui/UiPanel";
// import TwnsUiTextInput      from "../../tools/ui/UiTextInput";
// import UserProxy            from "../../user/model/UserProxy";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.User {
    import LangTextType     = Twns.Lang.LangTextType;
    import NotifyType       = Twns.Notify.NotifyType;

    export type OpenDataForUserSetPrivilegePanel = {
        userId  : number;
    };
    export class UserSetPrivilegePanel extends TwnsUiPanel.UiPanel<OpenDataForUserSetPrivilegePanel> {
        private readonly _btnGetInfo!               : TwnsUiButton.UiButton;
        private readonly _inputUserId!              : TwnsUiTextInput.UiTextInput;
        private readonly _labelUserName!            : TwnsUiLabel.UiLabel;
        private readonly _groupIsAdmin!             : eui.Group;
        private readonly _imgIsAdmin!               : TwnsUiImage.UiImage;
        private readonly _labelIsAdmin!             : TwnsUiLabel.UiLabel;
        private readonly _groupCanLogin!            : eui.Group;
        private readonly _imgCanLogin!              : TwnsUiImage.UiImage;
        private readonly _labelCanLogin!            : TwnsUiLabel.UiLabel;
        private readonly _groupIsMapCommittee!      : eui.Group;
        private readonly _imgIsMapCommittee!        : TwnsUiImage.UiImage;
        private readonly _labelIsMapCommittee!      : TwnsUiLabel.UiLabel;
        private readonly _groupIsChangeLogEditor!   : eui.Group;
        private readonly _imgIsChangeLogEditor!     : TwnsUiImage.UiImage;
        private readonly _labelIsChangeLogEditor!   : TwnsUiLabel.UiLabel;

        private readonly _groupCanChat!             : eui.Group;
        private readonly _imgCanChat!               : TwnsUiImage.UiImage;
        private readonly _labelCanChat!             : TwnsUiLabel.UiLabel;

        private readonly _groupChatManager!         : eui.Group;
        private readonly _imgChatManager!           : TwnsUiImage.UiImage;
        private readonly _labelChatManager!         : TwnsUiLabel.UiLabel;

        private readonly _btnCancel!                : TwnsUiButton.UiButton;
        private readonly _btnConfirm!               : TwnsUiButton.UiButton;

        protected _onOpening(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.MsgUserGetPublicInfo,   callback: this._onNotifyMsgUserGetPublicInfo },
                { type: NotifyType.MsgUserSetPrivilege,    callback: this._onNotifyMsgUserSetPrivilege },
            ]);
            this._setUiListenerArray([
                { ui: this._btnGetInfo,             callback: this._onTouchedBtnGetInfo },
                { ui: this._btnConfirm,             callback: this._onTouchedBtnConfirm },
                { ui: this._btnCancel,              callback: this.close },
                { ui: this._groupCanChat,           callback: this._onTouchedGroupCanChat },
                { ui: this._groupChatManager,       callback: this._onTouchedGroupChatManager },
                { ui: this._groupCanLogin,          callback: this._onTouchedGroupCanLogin },
                { ui: this._groupIsAdmin,           callback: this._onTouchedGroupIsAdmin },
                { ui: this._groupIsChangeLogEditor, callback: this._onTouchedGroupIsChangeLogEditor },
                { ui: this._groupIsMapCommittee,    callback: this._onTouchedGroupIsMapCommittee },
            ]);
            this._setIsTouchMaskEnabled(true);
            this._setIsCloseOnTouchedMask();
        }
        protected async _updateOnOpenDataChanged(): Promise<void> {
            const userId = this._getOpenData().userId;
            this._inputUserId.text = `${userId}`;
            Twns.User.UserProxy.reqUserGetPublicInfo(userId);
        }
        protected _onClosing(): void {
            // nothing to do
        }

        private _onNotifyMsgUserGetPublicInfo(e: egret.Event): void {
            const data = e.data as CommonProto.NetMessage.MsgUserGetPublicInfo.IS;
            if (data.userId === this._getUserId()) {
                const userPublicInfo                = Twns.Helpers.getExisted(data.userPublicInfo);
                const userPrivilege                 = Twns.Helpers.getExisted(userPublicInfo.userPrivilege);
                this._labelUserName.text            = userPublicInfo.nickname || Twns.CommonConstants.ErrorTextForUndefined;
                this._imgCanChat.visible            = !!userPrivilege.canChat;
                this._imgChatManager.visible        = !!userPrivilege.isChatManager;
                this._imgCanLogin.visible           = !!userPrivilege.canLogin;
                this._imgIsAdmin.visible            = !!userPrivilege.isAdmin;
                this._imgIsChangeLogEditor.visible  = !!userPrivilege.isChangeLogEditor;
                this._imgIsMapCommittee.visible     = !!userPrivilege.isMapCommittee;
            }
        }

        private _onNotifyMsgUserSetPrivilege(): void {
            FloatText.show(Lang.getText(LangTextType.A0157));
            this.close();
        }

        private _onTouchedBtnGetInfo(): void {
            const userId = this._getUserId();
            (userId) && (Twns.User.UserProxy.reqUserGetPublicInfo(userId));
        }

        private _onTouchedBtnConfirm(): void {
            const userId = this._getUserId();
            if (userId) {
                Twns.User.UserProxy.reqUserSetPrivilege(userId, {
                    canChat             : !!this._imgCanChat.visible,
                    canLogin            : !!this._imgCanLogin.visible,
                    isAdmin             : !!this._imgIsAdmin.visible,
                    isChangeLogEditor   : !!this._imgIsChangeLogEditor.visible,
                    isMapCommittee      : !!this._imgIsMapCommittee.visible,
                    isChatManager       : !!this._imgChatManager.visible,
                });
            }
        }

        private _onTouchedGroupCanChat(): void {
            const img   = this._imgCanChat;
            img.visible = !img.visible;
        }
        private _onTouchedGroupChatManager(): void {
            const img   = this._imgChatManager;
            img.visible = !img.visible;
        }
        private _onTouchedGroupCanLogin(): void {
            const img   = this._imgCanLogin;
            img.visible = !img.visible;
        }
        private _onTouchedGroupIsAdmin(): void {
            const img   = this._imgIsAdmin;
            img.visible = !img.visible;
        }
        private _onTouchedGroupIsChangeLogEditor(): void {
            const img   = this._imgIsChangeLogEditor;
            img.visible = !img.visible;
        }
        private _onTouchedGroupIsMapCommittee(): void {
            const img   = this._imgIsMapCommittee;
            img.visible = !img.visible;
        }

        private _getUserId(): number {
            return parseInt(this._inputUserId.text);
        }
    }
}

// export default TwnsUserSetPrivilegePanel;
