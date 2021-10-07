
import CommonConstants      from "../../tools/helpers/CommonConstants";
import CompatibilityHelpers from "../../tools/helpers/CompatibilityHelpers";
import FloatText            from "../../tools/helpers/FloatText";
import Helpers              from "../../tools/helpers/Helpers";
import Types                from "../../tools/helpers/Types";
import Lang                 from "../../tools/lang/Lang";
import TwnsLangTextType     from "../../tools/lang/LangTextType";
import TwnsNotifyType       from "../../tools/notify/NotifyType";
import ProtoTypes           from "../../tools/proto/ProtoTypes";
import TwnsUiButton         from "../../tools/ui/UiButton";
import TwnsUiImage          from "../../tools/ui/UiImage";
import TwnsUiLabel          from "../../tools/ui/UiLabel";
import TwnsUiPanel          from "../../tools/ui/UiPanel";
import TwnsUiTextInput      from "../../tools/ui/UiTextInput";
import UserProxy            from "../../user/model/UserProxy";

namespace TwnsUserSetPrivilegePanel {
    import LangTextType     = TwnsLangTextType.LangTextType;
    import NotifyType       = TwnsNotifyType.NotifyType;

    type OpenDataForUserSetPrivilegePanel = {
        userId  : number;
    };
    export class UserSetPrivilegePanel extends TwnsUiPanel.UiPanel<OpenDataForUserSetPrivilegePanel> {
        protected readonly _LAYER_TYPE   = Types.LayerType.Hud1;
        protected readonly _IS_EXCLUSIVE = false;

        private static _instance: UserSetPrivilegePanel;

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
        private readonly _btnCancel!                : TwnsUiButton.UiButton;
        private readonly _btnConfirm!               : TwnsUiButton.UiButton;

        public static show(openData: OpenDataForUserSetPrivilegePanel): void {
            if (!UserSetPrivilegePanel._instance) {
                UserSetPrivilegePanel._instance = new UserSetPrivilegePanel();
            }
            UserSetPrivilegePanel._instance.open(openData);
        }

        public static async hide(): Promise<void> {
            if (UserSetPrivilegePanel._instance) {
                await UserSetPrivilegePanel._instance.close();
            }
        }

        public constructor() {
            super();

            this._setIsTouchMaskEnabled(true);
            this._setIsCloseOnTouchedMask();
            this.skinName = "resource/skins/user/UserSetPrivilegePanel.exml";
        }

        public _onOpened(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.MsgUserGetPublicInfo,   callback: this._onNotifyMsgUserGetPublicInfo },
                { type: NotifyType.MsgUserSetPrivilege,    callback: this._onNotifyMsgUserSetPrivilege },
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

            const userId = this._getOpenData().userId;
            this._inputUserId.text = `${userId}`;
            UserProxy.reqUserGetPublicInfo(userId);
        }

        private _onNotifyMsgUserGetPublicInfo(e: egret.Event): void {
            const data = e.data as ProtoTypes.NetMessage.MsgUserGetPublicInfo.IS;
            if (data.userId === this._getUserId()) {
                const userPublicInfo                = Helpers.getExisted(data.userPublicInfo);
                const userPrivilege                 = Helpers.getExisted(userPublicInfo.userPrivilege);
                this._labelUserName.text            = userPublicInfo.nickname || CommonConstants.ErrorTextForUndefined;
                this._imgCanChat.visible            = !!userPrivilege.canChat;
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
            (userId) && (UserProxy.reqUserGetPublicInfo(userId));
        }

        private _onTouchedBtnConfirm(): void {
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

        private _onTouchedGroupCanChat(): void {
            const img   = this._imgCanChat;
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

export default TwnsUserSetPrivilegePanel;
