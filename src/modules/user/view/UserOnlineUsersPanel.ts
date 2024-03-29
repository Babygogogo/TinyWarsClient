
// import Helpers                  from "../../tools/helpers/Helpers";
// import Types                    from "../../tools/helpers/Types";
// import Lang                     from "../../tools/lang/Lang";
// import TwnsLangTextType         from "../../tools/lang/LangTextType";
// import Twns.Notify           from "../../tools/notify/NotifyType";
// import ProtoTypes               from "../../tools/proto/ProtoTypes";
// import TwnsUiButton             from "../../tools/ui/UiButton";
// import TwnsUiImage              from "../../tools/ui/UiImage";
// import TwnsUiLabel              from "../../tools/ui/UiLabel";
// import TwnsUiListItemRenderer   from "../../tools/ui/UiListItemRenderer";
// import TwnsUiPanel              from "../../tools/ui/UiPanel";
// import TwnsUiScrollList         from "../../tools/ui/UiScrollList";
// import UserProxy                from "../../user/model/UserProxy";
// import TwnsUserPanel            from "../../user/view/UserPanel";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.User {
    import LangTextType = Twns.Lang.LangTextType;
    import NotifyType   = Twns.Notify.NotifyType;

    export type OpenDataForUserOnlineUsersPanel = void;
    export class UserOnlineUsersPanel extends TwnsUiPanel.UiPanel<OpenDataForUserOnlineUsersPanel> {
        private readonly _imgMask!              : TwnsUiImage.UiImage;
        private readonly _group!                : eui.Group;
        private readonly _labelTitle!           : TwnsUiLabel.UiLabel;
        private readonly _btnClose!             : TwnsUiButton.UiButton;

        private readonly _labelTips!            : TwnsUiLabel.UiLabel;
        private readonly _labelUsersCountTitle! : TwnsUiLabel.UiLabel;
        private readonly _labelUsersCount!      : TwnsUiLabel.UiLabel;
        private readonly _labelNameTitle1!      : TwnsUiLabel.UiLabel;
        private readonly _labelNameTitle2!      : TwnsUiLabel.UiLabel;
        private readonly _listUser!             : TwnsUiScrollList.UiScrollList<DataForUserRenderer>;
        private readonly _labelLoading!         : TwnsUiLabel.UiLabel;

        private _msg        : CommonProto.NetMessage.MsgUserGetOnlineUserIdArray.IS | null = null;

        protected _onOpening(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,        callback: this._onNotifyLanguageChanged },
                { type: NotifyType.MsgUserGetOnlineUserIdArray,  callback: this._onNotifySUserGetOnlineUsers },
            ]);
            this._setUiListenerArray([
                { ui: this._btnClose,   callback: this.close },
            ]);
            this._setIsTouchMaskEnabled();
            this._setIsCloseOnTouchedMask();

            this._listUser.setItemRenderer(UserRenderer);

            Twns.User.UserProxy.reqUserGetOnlineUserIdArray();

            this._updateView();
            this._updateComponentsForLanguage();
        }
        protected async _updateOnOpenDataChanged(): Promise<void> {
            // nothing to do
        }
        protected _onClosing(): void {
            this._msg           = null;
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
        private async _updateView(): Promise<void> {
            const msg = this._msg;
            if (!msg) {
                this._labelLoading.visible  = true;
                this._labelUsersCount.text  = Lang.getText(LangTextType.B0029);
                this._listUser.clear();
            } else {
                this._labelLoading.visible  = false;
                this._labelUsersCount.text  = `${msg.totalCount}`;
                this._listUser.bindData(await this._createDataForList());
            }
        }

        private async _createDataForList(): Promise<DataForUserRenderer[]> {
            const dataArray     : DataForUserRenderer[] = [];
            const promiseArray  : Promise<void>[] = [];
            for (const userId of this._msg?.userIdArray ?? []) {
                promiseArray.push((async () => {
                    dataArray.push({
                        index   : 0,
                        userId,
                        nickname: (await Twns.User.UserModel.getUserBriefInfo(userId))?.nickname,
                    });
                })());
            }

            await Promise.all(promiseArray);
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

        protected async _showOpenAnimation(): Promise<void> {
            Twns.Helpers.resetTween({
                obj         : this._imgMask,
                beginProps  : { alpha: 0 },
                endProps    : { alpha: 1 },
            });
            Twns.Helpers.resetTween({
                obj         : this._group,
                beginProps  : { alpha: 0, verticalCenter: 40 },
                endProps    : { alpha: 1, verticalCenter: 0 },
            });

            await Twns.Helpers.wait(Twns.CommonConstants.DefaultTweenTime);
        }
        protected async _showCloseAnimation(): Promise<void> {
            Twns.Helpers.resetTween({
                obj         : this._imgMask,
                beginProps  : { alpha: 1 },
                endProps    : { alpha: 0 },
            });
            Twns.Helpers.resetTween({
                obj         : this._group,
                beginProps  : { alpha: 1, verticalCenter: 0 },
                endProps    : { alpha: 0, verticalCenter: 40 },
            });

            await Twns.Helpers.wait(Twns.CommonConstants.DefaultTweenTime);
        }
    }

    type DataForUserRenderer = {
        index       : number;
        userId      : Twns.Types.Undefinable<number>;
        nickname    : Twns.Types.Undefinable<string>;
    };
    class UserRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForUserRenderer> {
        private readonly _imgBg!        : TwnsUiImage.UiImage;
        private readonly _labelName!    : TwnsUiLabel.UiLabel;

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
                    Twns.PanelHelpers.open(Twns.PanelHelpers.PanelDict.UserPanel, { userId });
                }
            }
        }
    }
}

// export default TwnsUserOnlineUsersPanel;
