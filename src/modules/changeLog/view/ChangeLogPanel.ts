
// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace TinyWars.ChangeLog {
    import Notify           = Utility.Notify;
    import Helpers          = Utility.Helpers;
    import ProtoTypes       = Utility.ProtoTypes;
    import Lang             = Utility.Lang;
    import CommonConstants  = Utility.CommonConstants;
    import FloatText        = Utility.FloatText;

    export class ChangeLogPanel extends GameUi.UiPanel<void> {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Hud1;
        protected readonly _IS_EXCLUSIVE = false;

        private static _instance: ChangeLogPanel;

        // @ts-ignore
        private _imgMask        : GameUi.UiImage;
        // @ts-ignore
        private _group          : eui.Group;
        // @ts-ignore
        private _btnClose       : GameUi.UiButton;

        // @ts-ignore
        private _listMessage    : GameUi.UiScrollList<DataForMessageRenderer>;
        // @ts-ignore
        private _labelTitle     : GameUi.UiLabel;
        // @ts-ignore
        private _labelNoMessage : GameUi.UiLabel;
        // @ts-ignore
        private _btnAddMessage  : GameUi.UiButton;

        public static show(): void {
            if (!ChangeLogPanel._instance) {
                ChangeLogPanel._instance = new ChangeLogPanel();
            }
            ChangeLogPanel._instance.open(undefined);
        }

        public static async hide(): Promise<void> {
            if (ChangeLogPanel._instance) {
                await ChangeLogPanel._instance.close();
            }
        }

        private constructor() {
            super();

            this._setIsTouchMaskEnabled(true);
            this._setIsCloseOnTouchedMask();
            this.skinName = "resource/skins/changeLog/ChangeLogPanel.exml";
        }

        protected _onOpened(): void {
            this._setNotifyListenerArray([
                { type: Notify.Type.LanguageChanged,            callback: this._onNotifyLanguageChanged },
                { type: Notify.Type.MsgChangeLogGetMessageList, callback: this._onMsgChangeLogGetMessageList },
                { type: Notify.Type.MsgChangeLogAddMessage,     callback: this._onMsgChangeLogAddMessage },
                { type: Notify.Type.MsgChangeLogModifyMessage,  callback: this._onMsgChangeLogModifyMessage },
            ]);
            this._setUiListenerArray([
                { ui: this._btnAddMessage,  callback: this._onTouchedBtnAddMessage },
                { ui: this._btnClose,       callback: this.close },
            ]);
            this._listMessage.setItemRenderer(MessageRenderer);

            this._showOpenAnimation();
            this._updateView();

            if (!ChangeLogModel.getAllMessageList()) {
                ChangeLogProxy.reqChangeLogGetMessageList();
            }
        }
        protected async _onClosed(): Promise<void> {
            await this._showCloseAnimation();
        }

        private _onNotifyLanguageChanged(): void {
            this._updateComponentsForLanguage();
        }
        private _onMsgChangeLogGetMessageList(): void {
            this._updateListMessageAndLabelNoMessage();
        }
        private _onMsgChangeLogAddMessage(): void {
            FloatText.show(Lang.getText(Lang.Type.A0154));
            ChangeLogProxy.reqChangeLogGetMessageList();
        }
        private _onMsgChangeLogModifyMessage(): void {
            FloatText.show(Lang.getText(Lang.Type.A0154));
            ChangeLogProxy.reqChangeLogGetMessageList();
        }

        private _onTouchedBtnAddMessage(): void {
            ChangeLogAddPanel.show();
        }

        private _updateView(): void {
            this._updateComponentsForLanguage();

            this._updateBtnAddMessage();
        }

        private _updateComponentsForLanguage(): void {
            this._updateListMessageAndLabelNoMessage();
            this._labelTitle.text       = Lang.getText(Lang.Type.B0457);
            this._labelNoMessage.text   = Lang.getText(Lang.Type.B0278);
            this._btnAddMessage.label   = Lang.getText(Lang.Type.B0454);
        }
        private _updateListMessageAndLabelNoMessage(): void {
            const messageList               = ChangeLogModel.getAllMessageList() || [];
            this._labelNoMessage.visible    = !messageList.length;
            this._listMessage.bindData(messageList);
        }
        private async _updateBtnAddMessage(): Promise<void> {
            const btn   = this._btnAddMessage;
            btn.visible = false;
            btn.visible = await User.UserModel.checkCanSelfEditChangeLog();
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
    }

    type DataForMessageRenderer = ProtoTypes.ChangeLog.IChangeLogMessage;
    class MessageRenderer extends GameUi.UiListItemRenderer<DataForMessageRenderer> {
        // @ts-ignore
        private _labelIndex     : GameUi.UiLabel;
        // @ts-ignore
        private _labelContent   : GameUi.UiLabel;
        // @ts-ignore
        private _btnModify      : GameUi.UiButton;

        protected _onOpened(): void {
            this._setUiListenerArray([
                { ui: this._btnModify,  callback: this._onTouchedBtnModify },
            ]);
        }

        protected async _onDataChanged(): Promise<void> {
            const data              = this.data;
            const messageId         = data.messageId;
            const createTimestamp   = data.createTimestamp;
            this._labelIndex.text   = `#${messageId == null ? CommonConstants.ErrorTextForUndefined : Helpers.getNumText(messageId, 3)} (${createTimestamp == null ? CommonConstants.ErrorTextForUndefined : Helpers.getTimestampShortText(createTimestamp)})`;

            const textArray         = data.textList;
            this._labelContent.text = textArray == null
                ? CommonConstants.ErrorTextForUndefined
                : (Lang.getLanguageText({ textArray }) || CommonConstants.ErrorTextForUndefined);

            const btnModify     = this._btnModify;
            btnModify.label     = Lang.getText(Lang.Type.B0317);
            btnModify.visible   = false;
            btnModify.visible   = User.UserModel.checkCanSelfEditChangeLog();
        }

        private _onTouchedBtnModify(): void {
            const messageId = this.data.messageId;
            (messageId != null) && (ChangeLogModifyPanel.show({ messageId }));
        }
    }
}
