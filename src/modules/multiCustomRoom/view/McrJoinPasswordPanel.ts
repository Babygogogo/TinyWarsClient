
namespace TinyWars.MultiCustomRoom {
    import ProtoTypes   = Utility.ProtoTypes;
    import Lang         = Utility.Lang;
    import FloatText    = Utility.FloatText;
    import Notify       = Utility.Notify;
    import WarMapModel  = WarMap.WarMapModel;

    export class McrJoinPasswordPanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Hud0;
        protected readonly _IS_EXCLUSIVE = true;

        private static _instance: McrJoinPasswordPanel;

        private _labelTitle         : TinyWars.GameUi.UiLabel;
        private _labelRoomTitle     : TinyWars.GameUi.UiLabel;
        private _labelPasswordTitle : TinyWars.GameUi.UiLabel;
        private _labelWarName       : TinyWars.GameUi.UiLabel;
        private _inputWarPassword   : TinyWars.GameUi.UiTextInput;
        private _btnCancel          : TinyWars.GameUi.UiButton;
        private _btnConfirm         : TinyWars.GameUi.UiButton;

        private _openData: ProtoTypes.MultiCustomRoom.IMcrRoomInfo;

        public static show(data: ProtoTypes.MultiCustomRoom.IMcrRoomInfo): void {
            if (!McrJoinPasswordPanel._instance) {
                McrJoinPasswordPanel._instance = new McrJoinPasswordPanel();
            }
            McrJoinPasswordPanel._instance._openData = data;
            McrJoinPasswordPanel._instance.open();
        }
        public static hide(): void {
            if (McrJoinPasswordPanel._instance) {
                McrJoinPasswordPanel._instance.close();
            }
        }

        private constructor() {
            super();

            this._setIsAutoAdjustHeight();
            this._setIsTouchMaskEnabled();
            this._setIsCloseOnTouchedMask();
            this.skinName = "resource/skins/multiCustomRoom/McrJoinPasswordPanel.exml";
        }

        protected _onOpened(): void {
            this._setUiListenerArray([
                { ui: this._btnCancel,        callback: this._onTouchedBtnCancel },
                { ui: this._btnConfirm,       callback: this._onTouchedBtnConfirm },
            ]);
            this._setNotifyListenerArray([
                { type: Notify.Type.LanguageChanged,    callback: this._onNotifyLanguageChanged },
            ]);

            this._updateComponentsForLanguage();
            this._inputWarPassword.text = "";
        }

        private _onNotifyLanguageChanged(e: egret.Event): void {
            this._updateComponentsForLanguage();
        }

        private _onTouchedBtnCancel(e: egret.TouchEvent): void {
            McrJoinPasswordPanel.hide();
        }

        private async _onTouchedBtnConfirm(e: egret.TouchEvent): Promise<void> {
            const roomInfo = this._openData;
            if (this._inputWarPassword.text !== roomInfo.settingsForMcw.warPassword) {
                FloatText.show(Lang.getText(Lang.Type.A0017));
            } else {
                this.close();

                const joinData = McrModel.Join.getFastJoinData(roomInfo);
                if (joinData) {
                    McrProxy.reqMcrJoinRoom(joinData);
                } else {
                    FloatText.show(Lang.getText(Lang.Type.A0145));
                    McrProxy.reqMcrGetJoinableRoomInfoList();
                }
            }
        }

        private _updateComponentsForLanguage(): void {
            const info          = this._openData;
            const warName       = info.settingsForMcw.warName;
            const labelWarName  = this._labelWarName;
            if (warName) {
                labelWarName.text = warName;
            } else {
                labelWarName.text = "";
                WarMapModel.getMapNameInCurrentLanguage(info.settingsForCommon.mapId).then(v => labelWarName.text = v);
            }

            this._labelTitle.text           = Lang.getText(Lang.Type.B0449);
            this._labelRoomTitle.text       = `${Lang.getText(Lang.Type.B0405)}:`;
            this._labelPasswordTitle.text   = `${Lang.getText(Lang.Type.B0171)}:`;
            this._btnCancel.label           = Lang.getText(Lang.Type.B0154);
            this._btnConfirm.label          = Lang.getText(Lang.Type.B0026);
        }
    }
}
