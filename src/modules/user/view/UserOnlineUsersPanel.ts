
import { UiScrollList }         from "../../../gameui/UiScrollList";
import { UiImage }              from "../../../gameui/UiImage";
import { UiLabel }              from "../../../gameui/UiLabel";
import { UiListItemRenderer }   from "../../../gameui/UiListItemRenderer";
import { UiPanel }              from "../../../gameui/UiPanel";
import { UiButton }             from "../../../gameui/UiButton";
import { UserPanel }            from "../../user/view/UserPanel";
import * as Helpers             from "../../../utility/Helpers";
import * as Lang                from "../../../utility/Lang";
import { LangTextType } from "../../../utility/LangTextType";
import * as Notify              from "../../../utility/Notify";
import { NotifyType } from "../../../utility/NotifyType";
import * as ProtoTypes          from "../../../utility/ProtoTypes";
import * as Types               from "../../../utility/Types";
import * as UserProxy           from "../../user/model/UserProxy";

export class UserOnlineUsersPanel extends UiPanel<void> {
    protected readonly _LAYER_TYPE   = Types.LayerType.Hud0;
    protected readonly _IS_EXCLUSIVE = false;

    private static _instance: UserOnlineUsersPanel;

    // @ts-ignore
    private readonly _imgMask               : UiImage;
    // @ts-ignore
    private readonly _group                 : eui.Group;
    // @ts-ignore
    private readonly _labelTitle            : UiLabel;
    // @ts-ignore
    private readonly _btnClose              : UiButton;

    // @ts-ignore
    private readonly _labelTips             : UiLabel;
    // @ts-ignore
    private readonly _labelUsersCountTitle  : UiLabel;
    // @ts-ignore
    private readonly _labelUsersCount       : UiLabel;
    // @ts-ignore
    private readonly _labelNameTitle1       : UiLabel;
    // @ts-ignore
    private readonly _labelNameTitle2       : UiLabel;
    // @ts-ignore
    private readonly _listUser              : UiScrollList<DataForUserRenderer>;
    // @ts-ignore
    private readonly _labelLoading          : UiLabel;

    private _msg        : ProtoTypes.NetMessage.MsgUserGetOnlineUsers.IS | null | undefined;
    private _dataForList: DataForUserRenderer[] | null | undefined;

    public static show(): void {
        if (!UserOnlineUsersPanel._instance) {
            UserOnlineUsersPanel._instance = new UserOnlineUsersPanel();
        }
        UserOnlineUsersPanel._instance.open(undefined);
    }
    public static async hide(): Promise<void> {
        if (UserOnlineUsersPanel._instance) {
            await UserOnlineUsersPanel._instance.close();
        }
    }
    public static getIsOpening(): boolean {
        const instance = UserOnlineUsersPanel._instance;
        return instance ? instance.getIsOpening() : false;
    }

    public constructor() {
        super();

        this._setIsTouchMaskEnabled();
        this._setIsCloseOnTouchedMask();
        this.skinName = `resource/skins/user/UserOnlineUsersPanel.exml`;
    }

    protected _onOpened(): void {
        this._setNotifyListenerArray([
            { type: NotifyType.LanguageChanged,        callback: this._onNotifyLanguageChanged },
            { type: NotifyType.MsgUserGetOnlineUsers,  callback: this._onNotifySUserGetOnlineUsers },
        ]);
        this._setUiListenerArray([
            { ui: this._btnClose,   callback: this.close },
        ]);
        this._listUser.setItemRenderer(UserRenderer);

        this._showOpenAnimation();

        UserProxy.reqUserGetOnlineUsers();

        this._updateView();
        this._updateComponentsForLanguage();
    }
    protected async _onClosed(): Promise<void> {
        await this._showCloseAnimation();

        this._msg           = null;
        this._dataForList   = null;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Callbacks.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _onNotifySUserGetOnlineUsers(e: egret.Event): void {
        this._msg = e.data;
        this._updateView();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for view.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _updateView(): void {
        const msg = this._msg;
        if (!msg) {
            this._labelLoading.visible  = true;
            this._labelUsersCount.text  = Lang.getText(LangTextType.B0029);
            this._listUser.clear();
        } else {
            this._labelLoading.visible  = false;
            this._labelUsersCount.text  = `${msg.totalCount}`;
            this._dataForList           = this._createDataForList();
            this._listUser.bindData(this._dataForList);
        }
    }

    private _createDataForList(): DataForUserRenderer[] {
        const msg       = this._msg;
        const dataArray : DataForUserRenderer[] = [];
        for (const userInfo of msg ? msg.userInfos || [] : []) {
            dataArray.push({
                index   : 0,
                userId  : userInfo.userId,
                nickname: userInfo.nickname,
            });
        }
        dataArray.sort((v1, v2) => {
            const nickname1 = v1.nickname;
            const nickname2 = v2.nickname;
            if (nickname1 == null) {
                return 1;
            } else if (nickname2 == null) {
                return -1;
            } else {
                return nickname1.localeCompare(nickname2, "zh");
            }
        });

        if (dataArray.length % 2 !== 0) {
            dataArray.push({
                index   : 0,
                userId  : null,
                nickname: null,
            });
        }

        const dataLength = dataArray.length;
        for (let index = 0; index < dataLength; ++index) {
            dataArray[index].index = index;
        }

        return dataArray;
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.text           = Lang.getText(LangTextType.B0236);
        this._labelTips.text            = Lang.getText(LangTextType.A0064);
        this._labelLoading.text         = Lang.getText(LangTextType.A0040);
        this._labelUsersCountTitle.text = `${Lang.getText(LangTextType.B0237)}:`;
        this._labelNameTitle1.text      = Lang.getText(LangTextType.B0175);
        this._labelNameTitle2.text      = Lang.getText(LangTextType.B0175);
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
        return new Promise<void>(resolve => {
            Helpers.resetTween({
                obj         : this._imgMask,
                beginProps  : { alpha: 1 },
                endProps    : { alpha: 0 },
                callback    : resolve,
            });
            Helpers.resetTween({
                obj         : this._group,
                beginProps  : { alpha: 1, verticalCenter: 0 },
                endProps    : { alpha: 0, verticalCenter: 40 },
            });
        });
    }
}

type DataForUserRenderer = {
    index       : number;
    userId      : number | null | undefined;
    nickname    : string | null | undefined;
};

class UserRenderer extends UiListItemRenderer<DataForUserRenderer> {
    // @ts-ignore
    private readonly _imgBg     : UiImage;
    // @ts-ignore
    private readonly _labelName : UiLabel;

    protected _onOpened(): void {
        this._setUiListenerArray([
            { ui: this._imgBg, callback: this._onTouchedImgBg },
        ]);
        this._imgBg.touchEnabled = true;
    }

    protected _onDataChanged(): void {
        const data = this.data;
        if (data == null) {
            return;
        }

        this._imgBg.alpha       = data.index % 4 < 2 ? 0.2 : 0.5;
        this._labelName.text    = data.nickname || ``;
    }

    private _onTouchedImgBg(): void {
        const data = this.data;
        if (data) {
            const userId = data.userId;
            if (userId != null) {
                UserPanel.show({ userId });
            }
        }
    }
}
