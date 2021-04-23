
namespace TinyWars.User {
    import Notify       = Utility.Notify;
    import Lang         = Utility.Lang;
    import Helpers      = Utility.Helpers;
    import ProtoTypes   = Utility.ProtoTypes;

    export class UserOnlineUsersPanel extends GameUi.UiPanel<void> {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Hud0;
        protected readonly _IS_EXCLUSIVE = false;

        private static _instance: UserOnlineUsersPanel;

        private readonly _imgMask               : TinyWars.GameUi.UiImage;
        private readonly _group                 : eui.Group;
        private readonly _labelTitle            : TinyWars.GameUi.UiLabel;
        private readonly _labelTips             : TinyWars.GameUi.UiLabel;
        private readonly _labelUsersCountTitle  : TinyWars.GameUi.UiLabel;
        private readonly _labelUsersCount       : TinyWars.GameUi.UiLabel;
        private readonly _labelNameTitle1       : TinyWars.GameUi.UiLabel;
        private readonly _labelNameTitle2       : TinyWars.GameUi.UiLabel;
        private readonly _listUser              : TinyWars.GameUi.UiScrollList<DataForUserRenderer>;
        private readonly _labelLoading          : TinyWars.GameUi.UiLabel;

        private _msg        : ProtoTypes.NetMessage.MsgUserGetOnlineUsers.IS;
        private _dataForList: DataForUserRenderer[];

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
                { type: Notify.Type.LanguageChanged,        callback: this._onNotifyLanguageChanged },
                { type: Notify.Type.MsgUserGetOnlineUsers,  callback: this._onNotifySUserGetOnlineUsers },
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
            const msg       = this._msg;
            const dataArray : DataForUserRenderer[] = [];
            for (const userInfo of msg ? msg.userInfos || [] : []) {
                dataArray.push({
                    index   : 0,
                    userId  : userInfo.userId,
                    nickname: userInfo.nickname,
                });
            }
            dataArray.sort((v1, v2) => v1.nickname.localeCompare(v2.nickname, "zh"));

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
            this._labelTitle.text           = Lang.getText(Lang.Type.B0236);
            this._labelTips.text            = Lang.getText(Lang.Type.A0064);
            this._labelLoading.text         = Lang.getText(Lang.Type.A0040);
            this._labelUsersCountTitle.text = `${Lang.getText(Lang.Type.B0237)}:`;
            this._labelNameTitle1.text      = Lang.getText(Lang.Type.B0175);
            this._labelNameTitle2.text      = Lang.getText(Lang.Type.B0175);
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
        userId      : number | null;
        nickname    : string | null;
    }

    class UserRenderer extends GameUi.UiListItemRenderer<DataForUserRenderer> {
        private readonly _imgBg     : GameUi.UiImage;
        private readonly _labelName : GameUi.UiLabel;

        protected _onOpened(): void {
            this._setUiListenerArray([
                { ui: this._imgBg, callback: this._onTouchedImgBg },
            ]);
            this._imgBg.touchEnabled = true;
        }

        protected dataChanged(): void {
            super.dataChanged();

            const data = this.data;
            if (data == null) {
                return;
            }

            this._imgBg.alpha       = data.index % 4 < 2 ? 0.2 : 0.5;
            this._labelName.text    = data.nickname;
        }

        private _onTouchedImgBg(e: egret.TouchEvent): void {
            const data = this.data;
            if (data) {
                const userId = data.userId;
                if (userId != null) {
                    UserPanel.show({ userId });
                }
            }
        }
    }
}
