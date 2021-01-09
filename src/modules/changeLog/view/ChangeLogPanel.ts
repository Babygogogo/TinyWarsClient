
namespace TinyWars.ChangeLog {
    import Notify       = Utility.Notify;
    import Helpers      = Utility.Helpers;
    import ProtoTypes   = Utility.ProtoTypes;
    import Lang         = Utility.Lang;
    import FloatText    = Utility.FloatText;

    export class ChangeLogPanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Hud1;
        protected readonly _IS_EXCLUSIVE = false;

        private static _instance: ChangeLogPanel;

        private _listMessage    : GameUi.UiScrollList;
        private _labelTitle     : GameUi.UiLabel;
        private _labelNoMessage : GameUi.UiLabel;
        private _btnAddMessage  : GameUi.UiButton;
        private _btnClose       : GameUi.UiButton;

        public static show(): void {
            if (!ChangeLogPanel._instance) {
                ChangeLogPanel._instance = new ChangeLogPanel();
            }
            ChangeLogPanel._instance.open();
        }

        public static hide(): void {
            if (ChangeLogPanel._instance) {
                ChangeLogPanel._instance.close();
            }
        }

        private constructor() {
            super();

            this._setAutoAdjustHeightEnabled(true);
            this._setTouchMaskEnabled(true);
            this._callbackForTouchMask  = () => this.close();
            this.skinName               = "resource/skins/changeLog/ChangeLogPanel.exml";
        }

        protected _onFirstOpened(): void {
            this._notifyListeners = [
                { type: Notify.Type.LanguageChanged,            callback: this._onNotifyLanguageChanged },
                { type: Notify.Type.MsgChangeLogGetMessageList, callback: this._onMsgChangeLogGetMessageList },
                { type: Notify.Type.MsgChangeLogAddMessage,     callback: this._onMsgChangeLogAddMessage },
                { type: Notify.Type.MsgChangeLogModifyMessage,  callback: this._onMsgChangeLogModifyMessage },
            ];
            this._uiListeners = [
                { ui: this._btnAddMessage,  callback: this._onTouchedBtnAddMessage },
                { ui: this._btnClose,       callback: this.close },
            ];

            this._listMessage.setItemRenderer(MessageRenderer);
        }

        protected _onOpened(): void {
            this._updateView();

            if (!ChangeLogModel.getAllMessageList()) {
                ChangeLogProxy.reqChangeLogGetMessageList();
            }
        }

        private _onNotifyLanguageChanged(e: egret.Event): void {
            this._updateComponentsForLanguage();
        }
        private _onMsgChangeLogGetMessageList(e: egret.Event): void {
            this._updateListMessageAndLabelNoMessage();
        }
        private _onMsgChangeLogAddMessage(e: egret.Event): void {
            FloatText.show(Lang.getText(Lang.Type.A0154));
            ChangeLogProxy.reqChangeLogGetMessageList();
        }
        private _onMsgChangeLogModifyMessage(e: egret.Event): void {
            FloatText.show(Lang.getText(Lang.Type.A0154));
            ChangeLogProxy.reqChangeLogGetMessageList();
        }

        private _onTouchedBtnAddMessage(e: egret.TouchEvent): void {
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
            this._btnClose.label        = Lang.getText(Lang.Type.B0146);
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
    }

    type DataForMessageRenderer = ProtoTypes.ChangeLog.IChangeLogMessage;
    class MessageRenderer extends eui.ItemRenderer {
        private _labelIndex     : GameUi.UiLabel;
        private _labelContent   : GameUi.UiLabel;
        private _btnModify      : GameUi.UiButton;

        protected childrenCreated(): void {
            super.childrenCreated();

            this._btnModify.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onTouchedBtnModify, this);
        }

        protected async dataChanged(): Promise<void> {
            super.dataChanged();

            const data              = this.data as DataForMessageRenderer;
            this._labelIndex.text   = `#${Helpers.getNumText(data.messageId, 3)} (${Helpers.getTimestampShortText(data.createTimestamp)})`;
            this._labelContent.text = Lang.getTextInLanguage(data.textList);

            const btnModify     = this._btnModify;
            btnModify.label     = Lang.getText(Lang.Type.B0317);
            btnModify.visible   = false;
            btnModify.visible   = await User.UserModel.checkCanSelfEditChangeLog();
        }

        private _onTouchedBtnModify(e: egret.TouchEvent): void {
            ChangeLogModifyPanel.show({ messageId: (this.data as DataForMessageRenderer).messageId });
        }
    }
}
