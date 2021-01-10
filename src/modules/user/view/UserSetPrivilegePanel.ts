
namespace TinyWars.User {
    import Notify       = Utility.Notify;
    import ProtoTypes   = Utility.ProtoTypes;
    import FloatText    = Utility.FloatText;
    import Lang         = Utility.Lang;

    type OpenDataForUserSetPrivilegePanel = {
        userId  : number;
    }

    export class UserSetPrivilegePanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Hud1;
        protected readonly _IS_EXCLUSIVE = false;

        private static _instance: UserSetPrivilegePanel;

        private _btnGetInfo             : TinyWars.GameUi.UiButton;
        private _inputUserId            : TinyWars.GameUi.UiTextInput;
        private _labelUserName          : TinyWars.GameUi.UiLabel;
        private _groupIsAdmin           : eui.Group;
        private _imgIsAdmin             : TinyWars.GameUi.UiImage;
        private _labelIsAdmin           : TinyWars.GameUi.UiLabel;
        private _groupCanLogin          : eui.Group;
        private _imgCanLogin            : TinyWars.GameUi.UiImage;
        private _labelCanLogin          : TinyWars.GameUi.UiLabel;
        private _groupIsMapCommittee    : eui.Group;
        private _imgIsMapCommittee      : TinyWars.GameUi.UiImage;
        private _labelIsMapCommittee    : TinyWars.GameUi.UiLabel;
        private _groupIsChangeLogEditor : eui.Group;
        private _imgIsChangeLogEditor   : TinyWars.GameUi.UiImage;
        private _labelIsChangeLogEditor : TinyWars.GameUi.UiLabel;
        private _groupCanChat           : eui.Group;
        private _imgCanChat             : TinyWars.GameUi.UiImage;
        private _labelCanChat           : TinyWars.GameUi.UiLabel;
        private _btnCancel              : TinyWars.GameUi.UiButton;
        private _btnConfirm             : TinyWars.GameUi.UiButton;

        private _openData               : OpenDataForUserSetPrivilegePanel;

        public static show(openData: OpenDataForUserSetPrivilegePanel): void {
            if (!UserSetPrivilegePanel._instance) {
                UserSetPrivilegePanel._instance = new UserSetPrivilegePanel();
            }
            UserSetPrivilegePanel._instance._openData = openData;
            UserSetPrivilegePanel._instance.open();
        }

        public static hide(): void {
            if (UserSetPrivilegePanel._instance) {
                UserSetPrivilegePanel._instance.close();
            }
        }

        public constructor() {
            super();

            this._setIsTouchMaskEnabled(true);
            this._setIsAutoAdjustHeight(true);
            this._setIsCloseOnTouchedMask();
            this.skinName = "resource/skins/user/UserSetPrivilegePanel.exml";
        }

        public _onOpened(): void {
            this._setNotifyListenerArray([
                { type: Notify.Type.MsgUserGetPublicInfo,   callback: this._onNotifyMsgUserGetPublicInfo },
                { type: Notify.Type.MsgUserSetPrivilege,    callback: this._onNotifyMsgUserSetPrivilege },
            ]);
            this._setUiListenerArray([
                { ui: this._btnGetInfo,             callback: this._onTouchedBtnGetInfo },
                { ui: this._btnConfirm,             callback: this._onTouchedBtnConfirm },
                { ui: this._btnCancel,              callback: this.close },
                { ui: this._groupCanChat,           callback: this._onTouchedGroupCanChat },
                { ui: this._groupCanLogin,          callback: this._onTouchedGroupCanLogin },
                { ui: this._groupIsAdmin,           callback: this._onTouchedGroupIsAdmin },
                { ui: this._groupIsChangeLogEditor, callback: this._onTouchedGroupIsChangeLogEditor },
                { ui: this._groupIsMapCommittee,    callback: this._onTouchedGroupIsMapCommittee },
            ]);

            const userId = this._openData.userId;
            this._inputUserId.text = `${userId}`;
            UserProxy.reqUserGetPublicInfo(userId);
        }

        private _onNotifyMsgUserGetPublicInfo(e: egret.Event): void {
            const data = e.data as ProtoTypes.NetMessage.MsgUserGetPublicInfo.IS;
            if (data.userId === this._getUserId()) {
                const userPublicInfo                = data.userPublicInfo;
                const userPrivilege                 = data.userPublicInfo.userPrivilege;
                this._labelUserName.text            = userPublicInfo.nickname;
                this._imgCanChat.visible            = !!userPrivilege.canChat;
                this._imgCanLogin.visible           = !!userPrivilege.canLogin;
                this._imgIsAdmin.visible            = !!userPrivilege.isAdmin;
                this._imgIsChangeLogEditor.visible  = !!userPrivilege.isChangeLogEditor;
                this._imgIsMapCommittee.visible     = !!userPrivilege.isMapCommittee;
            }
        }

        private _onNotifyMsgUserSetPrivilege(e: egret.Event): void {
            FloatText.show(Lang.getText(Lang.Type.A0157));
            this.close();
        }

        private _onTouchedBtnGetInfo(e: egret.TouchEvent): void {
            const userId = this._getUserId();
            (userId) && (UserProxy.reqUserGetPublicInfo(userId));
        }

        private _onTouchedBtnConfirm(e: egret.TouchEvent): void {
            const userId = this._getUserId();
            if (userId) {
                UserProxy.reqUserSetPrivilege(userId, {
                    canChat             : !!this._imgCanChat.visible,
                    canLogin            : !!this._imgCanLogin.visible,
                    isAdmin             : !!this._imgIsAdmin.visible,
                    isChangeLogEditor   : !!this._imgIsChangeLogEditor.visible,
                    isMapCommittee      : !!this._imgIsMapCommittee.visible,
                });
            }
        }

        private _onTouchedGroupCanChat(e: egret.TouchEvent): void {
            const img   = this._imgCanChat;
            img.visible = !img.visible;
        }
        private _onTouchedGroupCanLogin(e: egret.TouchEvent): void {
            const img   = this._imgCanLogin;
            img.visible = !img.visible;
        }
        private _onTouchedGroupIsAdmin(e: egret.TouchEvent): void {
            const img   = this._imgIsAdmin;
            img.visible = !img.visible;
        }
        private _onTouchedGroupIsChangeLogEditor(e: egret.TouchEvent): void {
            const img   = this._imgIsChangeLogEditor;
            img.visible = !img.visible;
        }
        private _onTouchedGroupIsMapCommittee(e: egret.TouchEvent): void {
            const img   = this._imgIsMapCommittee;
            img.visible = !img.visible;
        }

        private _getUserId(): number {
            return parseInt(this._inputUserId.text);
        }
    }
}
