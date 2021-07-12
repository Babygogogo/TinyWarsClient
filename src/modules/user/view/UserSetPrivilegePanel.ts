
import { TwnsUiImage }              from "../../../utility/ui/UiImage";
import { TwnsUiPanel }              from "../../../utility/ui/UiPanel";
import { TwnsUiButton }              from "../../../utility/ui/UiButton";
import { TwnsUiLabel }              from "../../../utility/ui/UiLabel";
import { UiTextInput }          from "../../../utility/ui/UiTextInput";
import { FloatText }            from "../../../utility/FloatText";
import { Lang }                 from "../../../utility/lang/Lang";
import { TwnsLangTextType } from "../../../utility/lang/LangTextType";
import LangTextType         = TwnsLangTextType.LangTextType;
import { Notify }               from "../../../utility/notify/Notify";
import { TwnsNotifyType } from "../../../utility/notify/NotifyType";
import NotifyType       = TwnsNotifyType.NotifyType;
import { ProtoTypes }           from "../../../utility/proto/ProtoTypes";
import { Types }                from "../../../utility/Types";
import { UserProxy }            from "../../user/model/UserProxy";

type OpenDataForUserSetPrivilegePanel = {
    userId  : number;
};
export class UserSetPrivilegePanel extends TwnsUiPanel.UiPanel<OpenDataForUserSetPrivilegePanel> {
    protected readonly _LAYER_TYPE   = Types.LayerType.Hud1;
    protected readonly _IS_EXCLUSIVE = false;

    private static _instance: UserSetPrivilegePanel;

    private _btnGetInfo             : TwnsUiButton.UiButton;
    private _inputUserId            : UiTextInput;
    private _labelUserName          : TwnsUiLabel.UiLabel;
    private _groupIsAdmin           : eui.Group;
    private _imgIsAdmin             : TwnsUiImage.UiImage;
    private _labelIsAdmin           : TwnsUiLabel.UiLabel;
    private _groupCanLogin          : eui.Group;
    private _imgCanLogin            : TwnsUiImage.UiImage;
    private _labelCanLogin          : TwnsUiLabel.UiLabel;
    private _groupIsMapCommittee    : eui.Group;
    private _imgIsMapCommittee      : TwnsUiImage.UiImage;
    private _labelIsMapCommittee    : TwnsUiLabel.UiLabel;
    private _groupIsChangeLogEditor : eui.Group;
    private _imgIsChangeLogEditor   : TwnsUiImage.UiImage;
    private _labelIsChangeLogEditor : TwnsUiLabel.UiLabel;
    private _groupCanChat           : eui.Group;
    private _imgCanChat             : TwnsUiImage.UiImage;
    private _labelCanChat           : TwnsUiLabel.UiLabel;
    private _btnCancel              : TwnsUiButton.UiButton;
    private _btnConfirm             : TwnsUiButton.UiButton;

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
