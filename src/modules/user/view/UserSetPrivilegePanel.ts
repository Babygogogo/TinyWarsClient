
import { UiImage }              from "../../../gameui/UiImage";
import { UiPanel }              from "../../../gameui/UiPanel";
import { UiButton }             from "../../../gameui/UiButton";
import { UiLabel }              from "../../../gameui/UiLabel";
import { UiTextInput }          from "../../../gameui/UiTextInput";
import * as FloatText           from "../../../utility/FloatText";
import * as Lang                from "../../../utility/Lang";
import { LangTextType } from "../../../utility/LangTextType";
import * as Notify              from "../../../utility/Notify";
import { NotifyType } from "../../../utility/NotifyType";
import * as ProtoTypes          from "../../../utility/ProtoTypes";
import * as Types               from "../../../utility/Types";
import * as UserProxy           from "../../user/model/UserProxy";

type OpenDataForUserSetPrivilegePanel = {
    userId  : number;
};
export class UserSetPrivilegePanel extends UiPanel<OpenDataForUserSetPrivilegePanel> {
    protected readonly _LAYER_TYPE   = Types.LayerType.Hud1;
    protected readonly _IS_EXCLUSIVE = false;

    private static _instance: UserSetPrivilegePanel;

    private _btnGetInfo             : UiButton;
    private _inputUserId            : UiTextInput;
    private _labelUserName          : UiLabel;
    private _groupIsAdmin           : eui.Group;
    private _imgIsAdmin             : UiImage;
    private _labelIsAdmin           : UiLabel;
    private _groupCanLogin          : eui.Group;
    private _imgCanLogin            : UiImage;
    private _labelCanLogin          : UiLabel;
    private _groupIsMapCommittee    : eui.Group;
    private _imgIsMapCommittee      : UiImage;
    private _labelIsMapCommittee    : UiLabel;
    private _groupIsChangeLogEditor : eui.Group;
    private _imgIsChangeLogEditor   : UiImage;
    private _labelIsChangeLogEditor : UiLabel;
    private _groupCanChat           : eui.Group;
    private _imgCanChat             : UiImage;
    private _labelCanChat           : UiLabel;
    private _btnCancel              : UiButton;
    private _btnConfirm             : UiButton;

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
        FloatText.show(Lang.getText(LangTextType.A0157));
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
