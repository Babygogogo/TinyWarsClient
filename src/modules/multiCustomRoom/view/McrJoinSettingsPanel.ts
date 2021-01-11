
namespace TinyWars.MultiCustomRoom {
    import Lang                 = Utility.Lang;
    import Notify               = Utility.Notify;
    import FloatText            = Utility.FloatText;
    import ProtoTypes           = Utility.ProtoTypes;
    import CommonConfirmPanel   = Common.CommonConfirmPanel;

    const CONFIRM_INTERVAL_MS = 5000;

    export class McrJoinSettingsPanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Scene;
        protected readonly _IS_EXCLUSIVE = true;

        private static _instance: McrJoinSettingsPanel;

        private _labelMenuTitle : GameUi.UiLabel;
        private _tabSettings    : GameUi.UiTab;
        private _btnBack        : GameUi.UiButton;
        private _btnConfirm     : GameUi.UiButton;

        private _timeoutIdForBtnConfirm: number;

        public static show(): void {
            if (!McrJoinSettingsPanel._instance) {
                McrJoinSettingsPanel._instance = new McrJoinSettingsPanel();
            }
            McrJoinSettingsPanel._instance.open(undefined);
        }
        public static hide(): void {
            if (McrJoinSettingsPanel._instance) {
                McrJoinSettingsPanel._instance.close();
            }
        }

        public constructor() {
            super();

            this._setIsAutoAdjustHeight(true);
            this.skinName = "resource/skins/multiCustomRoom/McrJoinSettingsPanel.exml";
        }

        protected _onOpened(): void {
            this._setUiListenerArray([
                { ui: this._btnBack,    callback: this._onTouchedBtnBack },
                { ui: this._btnConfirm, callback: this._onTouchedBtnConfirm },
            ]);
            this._setNotifyListenerArray([
                { type: Notify.Type.LanguageChanged,    callback: this._onNotifyLanguageChanged },
                { type: Notify.Type.MsgMcrJoinRoom,     callback: this._onMsgMcrJoinRoom },
                { type: Notify.Type.MsgMcrDeleteRoom,   callback: this._onMsgMcrDeleteRoom },
                { type: Notify.Type.MsgMcrGetRoomInfo,  callback: this._onMsgMcrGetRoomInfo },
            ]);
            this._tabSettings.setBarItemRenderer(TabItemRenderer);

            this._tabSettings.bindData([
                {
                    tabItemData: { name: Lang.getText(Lang.Type.B0002) },
                    pageClass  : McrJoinBasicSettingsPage,
                },
                {
                    tabItemData: { name: Lang.getText(Lang.Type.B0003) },
                    pageClass  : McrJoinAdvancedSettingsPage,
                },
            ]);

            this._updateComponentsForLanguage();
            this._btnConfirm.enabled = true;
        }

        protected _onClosed(): void {
            this._tabSettings.clear();
            this._clearTimeoutForBtnConfirm();
        }

        private _onTouchedBtnBack(e: egret.TouchEvent): void {
            McrJoinSettingsPanel.hide();
            McrJoinRoomListPanel.show();
        }

        private async _onTouchedBtnConfirm(e: egret.TouchEvent): Promise<void> {
            const data      = McrModel.Join.getData();
            const callback1 = () => {
                McrProxy.reqMcrJoinRoom(data);

                this._btnConfirm.enabled = false;
                this._resetTimeoutForBtnConfirm();
            };
            const callback2 = () => {
                if (data.coId != null) {
                    callback1();
                } else {
                    CommonConfirmPanel.show({
                        title   : Lang.getText(Lang.Type.B0088),
                        content : `${Lang.getText(Lang.Type.A0050)}\n${Lang.getText(Lang.Type.A0052)}`,
                        callback: callback1,
                    });
                }
            }

            if ((await McrModel.Join.getRoomInfo()).settingsForCommon.presetWarRuleId != null) {
                callback2();
            } else {
                CommonConfirmPanel.show({
                    title   : Lang.getText(Lang.Type.B0088),
                    content : Lang.getText(Lang.Type.A0102),
                    callback: callback2,
                });
            }
        }

        private _onNotifyLanguageChanged(e: egret.Event): void {
            this._updateComponentsForLanguage();
        }

        private _onMsgMcrJoinRoom(e: egret.Event): void {
            FloatText.show(Lang.getText(Lang.Type.A0018));
            this.close();
            McrJoinRoomListPanel.show();
        }

        private _onMsgMcrDeleteRoom(e: egret.Event): void {
            if (McrModel.Join.getRoomId() == null) {
                FloatText.show(Lang.getText(Lang.Type.A0019));
                this.close();
                McrJoinRoomListPanel.show();
            }
        }

        private _onMsgMcrGetRoomInfo(e: egret.Event): void {
            const data = e.data as ProtoTypes.NetMessage.MsgMcrGetRoomInfo.IS;
            if ((McrModel.Join.getRoomId() === data.roomId) &&
                (!McrModel.Join.checkCanJoin())
            ) {
                FloatText.show(Lang.getText(Lang.Type.A0145));
                this.close();
                McrJoinRoomListPanel.show();
            }
        }

        private _resetTimeoutForBtnConfirm(): void {
            this._clearTimeoutForBtnConfirm();
            this._timeoutIdForBtnConfirm = egret.setTimeout(() => {
                this._btnConfirm.enabled     = true;
                this._timeoutIdForBtnConfirm = undefined;
            }, this, CONFIRM_INTERVAL_MS);
        }

        private _clearTimeoutForBtnConfirm(): void {
            if (this._timeoutIdForBtnConfirm != null) {
                egret.clearTimeout(this._timeoutIdForBtnConfirm);
                this._timeoutIdForBtnConfirm = undefined;
            }
        }

        private _updateComponentsForLanguage(): void {
            this._labelMenuTitle.text   = Lang.getText(Lang.Type.B0023);
            this._btnBack.label         = Lang.getText(Lang.Type.B0146);
            this._btnConfirm.label      = Lang.getText(Lang.Type.B0026);
        }
    }

    type DataForTabItemRenderer = {
        name: string;
    }

    class TabItemRenderer extends GameUi.UiListItemRenderer {
        private _labelName: GameUi.UiLabel;

        protected dataChanged(): void {
            const data = (this.data as GameUi.DataForUiTab).tabItemData as DataForTabItemRenderer;
            this._labelName.text = data.name;
        }
    }
}
