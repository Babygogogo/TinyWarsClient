
import { UiPanel }                      from "../../../gameui/UiPanel";
import { UiButton }                     from "../../../gameui/UiButton";
import { UiLabel }                      from "../../../gameui/UiLabel";
import { ChatPanel }                    from "../../chat/view/ChatPanel";
import { UserPanel }                    from "../../user/view/UserPanel";
import { UserSettingsPanel }            from "../../user/view/UserSettingsPanel";
import { UserOnlineUsersPanel }         from "../../user/view/UserOnlineUsersPanel";
import * as Notify                      from "../../../utility/Notify";
import { NotifyType } from "../../../utility/NotifyType";
import * as Types                       from "../../../utility/Types";
import * as UserModel                   from "../../user/model/UserModel";

export class LobbyTopPanel extends UiPanel<void> {
    protected readonly _LAYER_TYPE   = Types.LayerType.Hud0;
    protected readonly _IS_EXCLUSIVE = false;

    private static _instance: LobbyTopPanel;

    private _group          : eui.Group;

    private _groupUserInfo  : eui.Group;
    private _labelNickname  : UiLabel;
    private _labelUserId    : UiLabel;

    private _btnSettings    : UiButton;

    public static show(): void {
        if (!LobbyTopPanel._instance) {
            LobbyTopPanel._instance = new LobbyTopPanel();
        }
        LobbyTopPanel._instance.open(undefined);
    }

    public static async hide(): Promise<void> {
        if (LobbyTopPanel._instance) {
            await LobbyTopPanel._instance.close();
        }
    }

    private constructor() {
        super();

        this.skinName = "resource/skins/lobby/LobbyTopPanel.exml";
    }

    protected _onOpened(): void {
        this._setNotifyListenerArray([
            { type: NotifyType.LanguageChanged,                callback: this._onNotifyLanguageChanged },
            { type: NotifyType.MsgUserLogin,                   callback: this._onMsgUserLogin },
            { type: NotifyType.MsgUserLogout,                  callback: this._onMsgUserLogout },
            { type: NotifyType.MsgUserSetNickname,             callback: this._onMsgUserSetNickname },
        ]);
        this._setUiListenerArray([
            { ui: this._groupUserInfo,  callback: this._onTouchedGroupUserInfo },
            { ui: this._btnSettings,    callback: this._onTouchedBtnSettings },
        ]);

        this._showOpenAnimation();

        this._updateView();
    }
    protected async _onClosed(): Promise<void> {
        await this._showCloseAnimation();
    }

    private _onMsgUserLogin(e: egret.Event): void {
        this._updateView();
    }

    private _onMsgUserLogout(e: egret.Event): void {
        this.close();
    }

    private _onMsgUserSetNickname(e: egret.Event): void {
        this._updateLabelNickname();
    }

    private _onNotifyLanguageChanged(e: egret.Event): void {
        // nothing to do
    }

    private _onTouchedGroupUserInfo(e: egret.Event): void {
        UserOnlineUsersPanel.hide();
        ChatPanel.hide();
        UserPanel.show({ userId: UserModel.getSelfUserId() });
    }

    private _onTouchedBtnSettings(e: egret.TouchEvent): void {
        UserSettingsPanel.show();
    }

    private _showOpenAnimation(): void {
        const group = this._group;
        egret.Tween.removeTweens(group);
        egret.Tween.get(group)
            .set({ alpha: 0, top: -40 })
            .to({ alpha: 1, top: 0 }, 200);
    }
    private _showCloseAnimation(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const group = this._group;
            egret.Tween.removeTweens(group);
            egret.Tween.get(group)
                .set({ alpha: 1, top: 0 })
                .to({ alpha: 0, top: -40 }, 200)
                .call(resolve);
        });
    }

    private _updateView(): void {
        this._updateLabelNickname();
        this._labelUserId.text = `ID: ${UserModel.getSelfUserId()}`;
    }

    private async _updateLabelNickname(): Promise<void> {
        this._labelNickname.text = await UserModel.getSelfNickname();
    }
}
