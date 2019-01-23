
namespace TinyWars.MultiCustomRoom {
    import ProtoTypes   = Utility.ProtoTypes;
    import Helpers      = Utility.Helpers;
    import Notify       = Utility.Notify;
    import Lang         = Utility.Lang;
    import FloatText    = Utility.FloatText;
    import Types        = Utility.Types;
    import HelpPanel    = Common.HelpPanel;

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

        private _onTouchedBtnHelpFog(e: egret.TouchEvent): void {
            HelpPanel.show({
                title  : Lang.getText(Lang.BigType.B01, Lang.SubType.S20),
                content: Lang.getRichText(Lang.RichType.R002),
            });
        }

        private _onTouchedBtnHelpTimeLimit(e: egret.TouchEvent): void {
            HelpPanel.show({
                title  : Lang.getText(Lang.BigType.B01, Lang.SubType.S21),
                content: Lang.getRichText(Lang.RichType.R003),
            });
        }

        private _onTouchedBtnCancel(e: egret.TouchEvent): void {
            McrJoinPasswordPanel.hide();
        }

        private _onTouchedBtnConfirm(e: egret.TouchEvent): void {
            if (this._inputWarPassword.text !== this._openData.warPassword) {
                FloatText.show(Lang.getText(Lang.BigType.B00, Lang.SubType.S17));
            } else {
                McrJoinPasswordPanel.hide();
                McrJoinDetailPanel.show(this._openData);
            }
        }

        private _updateView(): void {
            const info = this._openData;
            this._inputWarPassword.text = "";
            this._labelWarName.text     = info.warName || info.mapName;
        }
    }
}
