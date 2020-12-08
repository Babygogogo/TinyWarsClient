
namespace TinyWars.MultiCustomRoom {
    import ProtoTypes   = Utility.ProtoTypes;
    import Lang         = Utility.Lang;
    import FloatText    = Utility.FloatText;
    import WarMapModel  = WarMap.WarMapModel;

    export class McrJoinPasswordPanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Hud0;
        protected readonly _IS_EXCLUSIVE = true;

        private static _instance: McrJoinPasswordPanel;

        private _inputWarPassword   : GameUi.UiLabel;
        private _labelWarName       : GameUi.UiLabel;
        private _btnConfirm         : GameUi.UiButton;
        private _btnCancel          : GameUi.UiButton;

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

            this._setAutoAdjustHeightEnabled();
            this._setTouchMaskEnabled();
            this._callbackForTouchMask = () => McrJoinPasswordPanel.hide();
            this.skinName = "resource/skins/multiCustomRoom/McrJoinPasswordPanel.exml";
        }

        protected _onFirstOpened(): void {
            this._uiListeners = [
                { ui: this._btnCancel,        callback: this._onTouchedBtnCancel },
                { ui: this._btnConfirm,       callback: this._onTouchedBtnConfirm },
            ];
        }

        protected _onOpened(): void {
            this._updateView();
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

        private _updateView(): void {
            const info                  = this._openData;
            this._inputWarPassword.text = "";

            const warName = info.settingsForMcw.warName;
            if (warName) {
                this._labelWarName.text = warName;
            } else {
                WarMapModel.getMapNameInCurrentLanguage(info.settingsForCommon.mapId).then(v => this._labelWarName.text = v);
            }
        }
    }
}
