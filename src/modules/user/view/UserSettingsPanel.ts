
import { UiImage }                  from "../../../gameui/UiImage";
import { UiPanel }                  from "../../../gameui/UiPanel";
import { UiRadioButton }            from "../../../gameui/UiRadioButton";
import { UiButton }                 from "../../../gameui/UiButton";
import { UiLabel }                  from "../../../gameui/UiLabel";
import { UserChangeNicknamePanel }  from "./UserChangeNicknamePanel";
import { UserSetPasswordPanel }     from "./UserSetPasswordPanel";
import { UserChangeDiscordIdPanel } from "./UserChangeDiscordIdPanel";
import { UserOnlineUsersPanel }     from "./UserOnlineUsersPanel";
import { UserSetSoundPanel }        from "./UserSetSoundPanel";
import { UserSetStageScalePanel }   from "./UserSetStageScalePanel";
import { UserSetPrivilegePanel }    from "./UserSetPrivilegePanel";
import { ChatPanel }                from "../../chat/view/ChatPanel";
import { CommonDamageChartPanel }   from "../../common/view/CommonDamageChartPanel";
import { CommonChangeVersionPanel } from "../../common/view/CommonChangeVersionPanel";
import { CommonRankListPanel }      from "../../common/view/CommonRankListPanel";
import { CommonServerStatusPanel }  from "../../common/view/CommonServerStatusPanel";
import { ChangeLogPanel }           from "../../changeLog/view/ChangeLogPanel";
import { LobbyBackgroundPanel }     from "../../lobby/view/LobbyBackgroundPanel";
import { MmMainMenuPanel }          from "../../mapManagement/view/MmMainMenuPanel";
import * as CommonConstants         from "../../../utility/CommonConstants";
import * as Helpers                 from "../../../utility/Helpers";
import * as Lang                    from "../../../utility/Lang";
import { LangTextType } from "../../../utility/LangTextType";
import * as LocalStorage            from "../../../utility/LocalStorage";
import * as Logger                  from "../../../utility/Logger";
import * as Notify                  from "../../../utility/Notify";
import { NotifyType } from "../../../utility/NotifyType";
import * as StageManager            from "../../../utility/StageManager";
import * as Types                   from "../../../utility/Types";
import * as TimeModel               from "../../time/model/TimeModel";
import * as UserModel               from "../../user/model/UserModel";
import * as UserProxy               from "../../user/model/UserProxy";

export class UserSettingsPanel extends UiPanel<void> {
    protected readonly _LAYER_TYPE   = Types.LayerType.Hud0;
    protected readonly _IS_EXCLUSIVE = false;

    private static _instance: UserSettingsPanel;

    // @ts-ignore
    private readonly _imgMask               : UiImage;
    // @ts-ignore
    private readonly _labelTitle            : UiLabel;
    // @ts-ignore
    private readonly _btnClose              : UiButton;
    // @ts-ignore
    private readonly _group                 : eui.Group;
    // @ts-ignore
    private readonly _scroller              : eui.Scroller;

    // @ts-ignore
    private readonly _uiRadioLanguage       : UiRadioButton;
    // @ts-ignore
    private readonly _uiRadioTexture        : UiRadioButton;
    // @ts-ignore
    private readonly _uiRadioUnitAnimation  : UiRadioButton;
    // @ts-ignore
    private readonly _uiRadioTileAnimation  : UiRadioButton;
    // @ts-ignore
    private readonly _uiRadioShowGridBorder : UiRadioButton;

    // @ts-ignore
    private readonly _groupButtons          : eui.Group;
    // @ts-ignore
    private readonly _btnChangeNickname     : UiButton;
    // @ts-ignore
    private readonly _btnChangePassword     : UiButton;
    // @ts-ignore
    private readonly _btnChangeDiscordId    : UiButton;
    // @ts-ignore
    private readonly _btnChangeGameVersion  : UiButton;
    // @ts-ignore
    private readonly _btnRankList           : UiButton;
    // @ts-ignore
    private readonly _btnShowOnlineUsers    : UiButton;
    // @ts-ignore
    private readonly _btnSetSound           : UiButton;
    // @ts-ignore
    private readonly _btnSetStageScaler     : UiButton;
    // @ts-ignore
    private readonly _btnServerStatus       : UiButton;
    // @ts-ignore
    private readonly _btnComplaint          : UiButton;
    // @ts-ignore
    private readonly _btnUnitsInfo          : UiButton;
    // @ts-ignore
    private readonly _btnChangeLog          : UiButton;
    // @ts-ignore
    private readonly _btnSetPrivilege       : UiButton;
    // @ts-ignore
    private readonly _btnMapManagement      : UiButton;

    public static show(): void {
        if (!UserSettingsPanel._instance) {
            UserSettingsPanel._instance = new UserSettingsPanel();
        }
        UserSettingsPanel._instance.open(undefined);
    }

    public static async hide(): Promise<void> {
        if (UserSettingsPanel._instance) {
            await UserSettingsPanel._instance.close();
        }
    }

    private constructor() {
        super();

        this._setIsTouchMaskEnabled();
        this._setIsCloseOnTouchedMask();
        this.skinName = "resource/skins/user/UserSettingsPanel.exml";
    }

    protected _onOpened(): void {
        this._setNotifyListenerArray([
            { type: NotifyType.LanguageChanged,                    callback: this._onNotifyLanguageChanged },
            { type: NotifyType.UnitAndTileTextureVersionChanged,   callback: this._onNotifyUnitAndTileTextureVersionChanged },
            { type: NotifyType.IsShowGridBorderChanged,            callback: this._onNotifyIsShowGridBorderChanged },
            { type: NotifyType.MsgUserGetPublicInfo,               callback: this._onMsgUserGetPublicInfo },
            { type: NotifyType.MsgUserSetNickname,                 callback: this._onMsgUserSetNickname },
            { type: NotifyType.MsgUserSetDiscordId,                callback: this._onMsgUserSetDiscordId },
        ]);
        this._setUiListenerArray([
            { ui: this._btnClose,               callback: this.close },
            { ui: this._btnChangeNickname,      callback: this._onTouchedBtnChangeNickname },
            { ui: this._btnChangePassword,      callback: this._onTouchedBtnChangePassword },
            { ui: this._btnChangeDiscordId,     callback: this._onTouchedBtnChangeDiscordId },
            { ui: this._btnChangeGameVersion,   callback: this._onTouchedBtnChangeGameVersion },
            { ui: this._btnRankList,            callback: this._onTouchedBtnRankList },
            { ui: this._btnShowOnlineUsers,     callback: this._onTouchedBtnShowOnlineUsers },
            { ui: this._btnSetSound,            callback: this._onTouchedBtnSetSound },
            { ui: this._btnSetStageScaler,      callback: this._onTouchedBtnSetStageScaler },
            { ui: this._btnServerStatus,        callback: this._onTouchedBtnServerStatus },
            { ui: this._btnComplaint,           callback: this._onTouchedBtnComplaint },
            { ui: this._btnUnitsInfo,           callback: this._onTouchedBtnUnitsInfo },
            { ui: this._btnChangeLog,           callback: this._onTouchedBtnChangeLog },
            { ui: this._btnSetPrivilege,        callback: this._onTouchedBtnSetPrivilege },
            { ui: this._btnMapManagement,       callback: this._onTouchedBtnMapManagement },
        ]);

        this._uiRadioLanguage.setData({
            titleTextType   : LangTextType.B0627,
            leftTextType    : LangTextType.B0624,
            leftLangType    : Types.LanguageType.Chinese,
            rightTextType   : LangTextType.B0625,
            rightLangType   : Types.LanguageType.English,
            callbackOnLeft  : () => {
                const languageType = Types.LanguageType.Chinese;
                Lang.setLanguageType(languageType);
                LocalStorage.setLanguageType(languageType);

                Notify.dispatch(NotifyType.LanguageChanged);
            },
            callbackOnRight : () => {
                const languageType = Types.LanguageType.English;
                Lang.setLanguageType(languageType);
                LocalStorage.setLanguageType(languageType);

                Notify.dispatch(NotifyType.LanguageChanged);
            },
            checkerForLeftOn: () => {
                return Lang.getCurrentLanguageType() === Types.LanguageType.Chinese;
            },
        });
        this._uiRadioTexture.setData({
            titleTextType   : LangTextType.B0628,
            leftTextType    : LangTextType.B0385,
            rightTextType   : LangTextType.B0386,
            callbackOnLeft  : () => {
                UserProxy.reqUserSetSettings({
                    unitAndTileTextureVersion: Types.UnitAndTileTextureVersion.V0,
                });
            },
            callbackOnRight : () => {
                UserProxy.reqUserSetSettings({
                    unitAndTileTextureVersion: Types.UnitAndTileTextureVersion.V1,
                });
            },
            checkerForLeftOn: () => {
                return UserModel.getSelfSettingsTextureVersion() === Types.UnitAndTileTextureVersion.V0;
            },
        });
        this._uiRadioUnitAnimation.setData({
            titleTextType   : LangTextType.B0629,
            leftTextType    : LangTextType.B0561,
            rightTextType   : LangTextType.B0562,
            callbackOnLeft  : () => {
                TimeModel.startUnitAnimationTick();
                LocalStorage.setShowUnitAnimation(true);
            },
            callbackOnRight : () => {
                TimeModel.stopUnitAnimationTick();
                LocalStorage.setShowUnitAnimation(false);
            },
            checkerForLeftOn: () => {
                return TimeModel.checkIsUnitAnimationTicking();
            },
        });
        this._uiRadioTileAnimation.setData({
            titleTextType   : LangTextType.B0630,
            leftTextType    : LangTextType.B0561,
            rightTextType   : LangTextType.B0562,
            callbackOnLeft  : () => {
                TimeModel.startTileAnimationTick();
                LocalStorage.setShowTileAnimation(true);
            },
            callbackOnRight : () => {
                TimeModel.stopTileAnimationTick();
                LocalStorage.setShowTileAnimation(false);
            },
            checkerForLeftOn: () => {
                return TimeModel.checkIsTileAnimationTicking();
            },
        });
        this._uiRadioShowGridBorder.setData({
            titleTextType   : LangTextType.B0584,
            leftTextType    : LangTextType.B0561,
            rightTextType   : LangTextType.B0562,
            callbackOnLeft  : () => {
                UserProxy.reqUserSetSettings({
                    isShowGridBorder: true,
                });
            },
            callbackOnRight : () => {
                UserProxy.reqUserSetSettings({
                    isShowGridBorder: false,
                });
            },
            checkerForLeftOn: () => {
                return UserModel.getSelfSettingsIsShowGridBorder();
            },
        });

        this._showOpenAnimation();

        const selfUserId = UserModel.getSelfUserId();
        if (selfUserId == null) {
            Logger.error(`UserSettingsPanel._onOpened() empty selfUserId.`);
        } else {
            UserProxy.reqUserGetPublicInfo(selfUserId);
        }

        this._scroller.viewport.scrollV = 0;
        this._updateView();
    }
    protected async _onClosed(): Promise<void> {
        await this._showCloseAnimation();
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }
    private _onNotifyUnitAndTileTextureVersionChanged(): void {
        this._uiRadioTexture.updateView();
    }
    private _onNotifyIsShowGridBorderChanged(): void {
        this._uiRadioShowGridBorder.updateView();
    }
    private _onMsgUserGetPublicInfo(): void {
        this._updateView();
    }
    private _onMsgUserSetNickname(): void {
        const selfUserId = UserModel.getSelfUserId();
        if (selfUserId == null) {
            Logger.error(`UserSettingsPanel._onMsgUserSetNickname() empty selfUserId.`);
        } else {
            UserProxy.reqUserGetPublicInfo(selfUserId);
        }
    }
    private _onMsgUserSetDiscordId(): void {
        const selfUserId = UserModel.getSelfUserId();
        if (selfUserId == null) {
            Logger.error(`UserSettingsPanel._onMsgUserSetDiscordId() empty selfUserId.`);
        } else {
            UserProxy.reqUserGetPublicInfo(selfUserId);
        }
    }
    private _onTouchedBtnChangeNickname(): void {
        UserChangeNicknamePanel.show();
    }
    private _onTouchedBtnChangePassword(): void {
        UserSetPasswordPanel.show();
    }
    private _onTouchedBtnChangeDiscordId(): void {
        UserChangeDiscordIdPanel.show();
    }
    private _onTouchedBtnChangeGameVersion(): void {
        CommonChangeVersionPanel.show();
    }
    private _onTouchedBtnRankList(): void {
        CommonRankListPanel.show();
    }
    private _onTouchedBtnShowOnlineUsers(): void {
        UserOnlineUsersPanel.show();
    }
    private _onTouchedBtnSetSound(): void {
        UserSetSoundPanel.show();
    }
    private _onTouchedBtnSetStageScaler(): void {
        UserSetStageScalePanel.show();
    }
    private _onTouchedBtnServerStatus(): void {
        CommonServerStatusPanel.show();
    }
    private _onTouchedBtnComplaint(): void {
        this.close();
        ChatPanel.show({ toUserId: CommonConstants.AdminUserId });
    }
    private _onTouchedBtnUnitsInfo(): void {
        CommonDamageChartPanel.show();
    }
    private _onTouchedBtnChangeLog(): void {
        ChangeLogPanel.show();
    }
    private _onTouchedBtnSetPrivilege(): void {
        const selfUserId = UserModel.getSelfUserId();
        if (selfUserId == null) {
            Logger.error(`UserSettingsPanel._onTouchedBtnSetPrivilege() empty selfUserId.`);
        } else {
            UserSetPrivilegePanel.show({ userId: selfUserId });
        }
    }
    private _onTouchedBtnMapManagement(): void {
        StageManager.closeAllPanels();
        LobbyBackgroundPanel.show();
        MmMainMenuPanel.show();
    }

    private _showOpenAnimation(): void {
        Helpers.resetTween({
            obj         : this._imgMask,
            beginProps  : { alpha: 0 },
            endProps    : { alpha: 1 },
        });
        Helpers.resetTween({
            obj         : this._group,
            beginProps  : { alpha: 0, verticalCenter: 40 },
            endProps    : { alpha: 1, verticalCenter: 0 },
        });
    }
    private _showCloseAnimation(): Promise<void> {
        return new Promise<void>((resolve) => {
            Helpers.resetTween({
                obj         : this._imgMask,
                beginProps  : { alpha: 1 },
                endProps    : { alpha: 0 },
            });
            Helpers.resetTween({
                obj         : this._group,
                beginProps  : { alpha: 1, verticalCenter: 0 },
                endProps    : { alpha: 0, verticalCenter: 40 },
                callback    : resolve,
            });
        });
    }

    private async _updateView(): Promise<void> {
        this._updateComponentsForLanguage();
        this._updateGroupButtons();
    }

    private async _updateGroupButtons(): Promise<void> {
        const group = this._groupButtons;
        group.removeChildren();
        group.addChild(this._btnChangePassword);
        group.addChild(this._btnChangeNickname);
        group.addChild(this._btnChangeDiscordId);
        group.addChild(this._btnChangeGameVersion);
        group.addChild(this._btnSetSound);
        group.addChild(this._btnSetStageScaler);
        group.addChild(this._btnRankList);
        group.addChild(this._btnShowOnlineUsers);
        group.addChild(this._btnServerStatus);
        group.addChild(this._btnChangeLog);
        group.addChild(this._btnUnitsInfo);
        group.addChild(this._btnComplaint);
        if (await UserModel.getIsSelfAdmin()) {
            group.addChild(this._btnSetPrivilege);
        }
        if ((await UserModel.getIsSelfAdmin()) || (await UserModel.getIsSelfMapCommittee())) {
            group.addChild(this._btnMapManagement);
        }
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.text = Lang.getText(LangTextType.B0560);
        this._updateBtnChangeNickname();
        this._updateBtnChangePassword();
        this._updateBtnChangeDiscordId();
        this._updateBtnChangeGameVersion();
        this._updateBtnRankList();
        this._updateBtnShowOnlineUsers();
        this._updateBtnSetSound();
        this._updateBtnSetStageScaler();
        this._updateBtnUnitsInfo();
        this._updateBtnChangeLog();
        this._updateBtnSetPrivilege();
        this._updateBtnServerStatus();
        this._updateBtnComplaint();
        this._updateBtnMapManagement();
    }

    private _updateBtnChangeNickname(): void {
        this._btnChangeNickname.label = Lang.getText(LangTextType.B0149);
    }
    private _updateBtnChangePassword(): void {
        this._btnChangePassword.label = Lang.getText(LangTextType.B0426);
    }
    private _updateBtnChangeDiscordId(): void {
        this._btnChangeDiscordId.label = Lang.getText(LangTextType.B0150);
    }
    private _updateBtnChangeGameVersion(): void {
        this._btnChangeGameVersion.label = Lang.getText(LangTextType.B0620);
    }
    private _updateBtnRankList(): void {
        this._btnRankList.label = Lang.getText(LangTextType.B0436);
    }
    private _updateBtnShowOnlineUsers(): void {
        this._btnShowOnlineUsers.label = Lang.getText(LangTextType.B0151);
    }
    private _updateBtnSetSound(): void {
        this._btnSetSound.label = Lang.getText(LangTextType.B0540);
    }
    private _updateBtnSetStageScaler(): void {
        this._btnSetStageScaler.label = Lang.getText(LangTextType.B0558);
    }
    private _updateBtnUnitsInfo(): void {
        this._btnUnitsInfo.label = Lang.getText(LangTextType.B0440);
    }
    private _updateBtnChangeLog(): void {
        this._btnChangeLog.label = Lang.getText(LangTextType.B0457);
    }
    private _updateBtnSetPrivilege(): void {
        this._btnSetPrivilege.label = Lang.getText(LangTextType.B0460);
    }
    private _updateBtnServerStatus(): void {
        this._btnServerStatus.label = Lang.getText(LangTextType.B0327);
    }
    private _updateBtnComplaint(): void {
        this._btnComplaint.label = Lang.getText(LangTextType.B0453);
    }
    private _updateBtnMapManagement(): void {
        this._btnMapManagement.label = Lang.getText(LangTextType.B0192);
    }
}
