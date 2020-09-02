
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

        private _openData: ProtoTypes.IMcrWaitingInfo;

        public static show(data: ProtoTypes.IMcrWaitingInfo): void {
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
            if (this._inputWarPassword.text !== this._openData.warPassword) {
                FloatText.show(Lang.getText(Lang.Type.A0017));
            } else {
                McrJoinPasswordPanel.hide();
                McrJoinMapListPanel.hide();

                await McrModel.resetJoinWarData(this._openData);
                McrJoinSettingsPanel.show();
            }
        }

        private _updateView(): void {
            const info                  = this._openData;
            this._inputWarPassword.text = "";
            if (info.warName) {
                this._labelWarName.text = info.warName;
            } else {
                WarMapModel.getMapNameInCurrentLanguage(info.mapFileName).then(v => this._labelWarName.text = v);
            }
        }
    }
}
