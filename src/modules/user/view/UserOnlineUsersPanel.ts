
namespace TinyWars.User {
    import Notify       = Utility.Notify;
    import Lang         = Utility.Lang;
    import ProtoTypes   = Utility.ProtoTypes;

    export class UserOnlineUsersPanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Hud0;
        protected readonly _IS_EXCLUSIVE = false;

        private static _instance: UserOnlineUsersPanel;

        private _labelTitle             : GameUi.UiLabel;
        private _labelTips              : GameUi.UiLabel;
        private _labelUsersCountTitle   : GameUi.UiLabel;

        private _group          : eui.Group;
        private _listUser       : GameUi.UiScrollList;
        private _labelUsersCount: GameUi.UiLabel;
        private _labelLoading   : GameUi.UiLabel;
        private _btnClose       : GameUi.UiButton;

        private _msg        : ProtoTypes.NetMessage.MsgUserGetOnlineUsers.IS;
        private _dataForList: DataForUserRenderer[];

        public static show(): void {
            if (!UserOnlineUsersPanel._instance) {
                UserOnlineUsersPanel._instance = new UserOnlineUsersPanel();
            }
            UserOnlineUsersPanel._instance.open();
        }
        public static hide(): void {
            if (UserOnlineUsersPanel._instance) {
                UserOnlineUsersPanel._instance.close();
            }
        }
        public static getIsOpening(): boolean {
            const instance = UserOnlineUsersPanel._instance;
            return instance ? instance.getIsOpening() : false;
        }

        public constructor() {
            super();

            this._setIsAutoAdjustHeight();
            this.skinName = `resource/skins/user/UserOnlineUsersPanel.exml`;
        }

        protected _onOpened(): void {
            this._setNotifyListenerArray([
                { type: Notify.Type.LanguageChanged,        callback: this._onNotifyLanguageChanged },
                { type: Notify.Type.MsgUserGetOnlineUsers,  callback: this._onNotifySUserGetOnlineUsers },
            ]);
            this._setUiListenerArray([
                { ui: this._btnClose, callback: this.close },
            ]);
            this._listUser.setItemRenderer(UserRenderer);

            UserProxy.reqUserGetOnlineUsers();

            this._updateView();
            this._updateComponentsForLanguage();
        }
        protected _onClosed(): void {
            delete this._msg;
            delete this._dataForList;
            this._listUser.clear();
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Callbacks.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _onNotifyLanguageChanged(e: egret.Event): void {
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
                this._labelUsersCount.text  = Lang.getText(Lang.Type.B0029);
                this._listUser.clear();
            } else {
                this._labelLoading.visible  = false;
                this._labelUsersCount.text  = `${msg.totalCount}`;
                this._dataForList           = this._createDataForList();
                this._listUser.bindData(this._dataForList);
            }
        }

        private _createDataForList(): DataForUserRenderer[] {
            const dataList  : DataForUserRenderer[] = [];
            const msg       = this._msg;
            if (msg) {
                for (const userInfo of msg.userInfos) {
                    dataList.push({
                        userId  : userInfo.userId,
                        nickname: userInfo.nickname,
                    });
                }
            }

            return dataList;
        }

        private _updateComponentsForLanguage(): void {
            this._labelTitle.text           = Lang.getText(Lang.Type.B0236);
            this._btnClose.label            = Lang.getText(Lang.Type.B0146);
            this._labelTips.text            = Lang.getText(Lang.Type.A0064);
            this._labelLoading.text         = Lang.getText(Lang.Type.A0040);
            this._labelUsersCountTitle.text = `${Lang.getText(Lang.Type.B0237)}:`;
        }
    }

    type DataForUserRenderer = {
        userId      : number;
        nickname    : string;
    }

    class UserRenderer extends GameUi.UiListItemRenderer {
        private _group      : eui.Group;
        private _imgBg      : GameUi.UiImage;
        private _labelName  : GameUi.UiLabel;

        protected childrenCreated(): void {
            super.childrenCreated();

            this._imgBg.touchEnabled = true;
            this._imgBg.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onTouchedImgBg, this);
        }

        protected dataChanged(): void {
            super.dataChanged();

            this._updateView();
        }

        private _onTouchedImgBg(e: egret.TouchEvent): void {
            UserOnlineUsersPanel.hide();
            UserPanel.show((this.data as DataForUserRenderer).userId);
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Functions for view.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _updateView(): void {
            const data              = this.data as DataForUserRenderer;
            this._labelName.text    = data.nickname;
        }
    }
}
