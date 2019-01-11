
namespace TinyWars.MultiCustomWarRoom {
    import ProtoTypes   = Utility.ProtoTypes;
    import Helpers      = Utility.Helpers;
    import Notify       = Utility.Notify;
    import Lang         = Utility.Lang;
    import FloatText    = Utility.FloatText;
    import Types        = Utility.Types;
    import HelpPanel    = Common.HelpPanel;

    export class McwrJoinPasswordPanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Hud0;
        protected readonly _IS_EXCLUSIVE = true;

        private static _instance: McwrJoinPasswordPanel;

        private _inputWarPassword   : GameUi.UiLabel;
        private _labelWarName       : GameUi.UiLabel;
        private _btnConfirm         : GameUi.UiButton;
        private _btnCancel          : GameUi.UiButton;

        private _openData: ProtoTypes.IWaitingMultiCustomWarInfo;

        public static show(data: ProtoTypes.IWaitingMultiCustomWarInfo): void {
            if (!McwrJoinPasswordPanel._instance) {
                McwrJoinPasswordPanel._instance = new McwrJoinPasswordPanel();
            }
            McwrJoinPasswordPanel._instance._openData = data;
            McwrJoinPasswordPanel._instance.open();
        }
        public static hide(): void {
            if (McwrJoinPasswordPanel._instance) {
                McwrJoinPasswordPanel._instance.close();
            }
        }

        private constructor() {
            super();

            this._setAutoAdjustHeightEnabled();
            this._setTouchMaskEnabled();
            this._callbackForTouchMask = () => McwrJoinPasswordPanel.hide();
            this.skinName = "resource/skins/multiCustomWarRoom/McwrJoinPasswordPanel.exml";
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
            McwrJoinPasswordPanel.hide();
        }

        private _onTouchedBtnConfirm(e: egret.TouchEvent): void {
            if (this._inputWarPassword.text !== this._openData.warPassword) {
                FloatText.show(Lang.getText(Lang.BigType.B00, Lang.SubType.S17));
            } else {
                McwrJoinPasswordPanel.hide();
                McwrJoinDetailPanel.show(this._openData);
            }
        }

        private _updateView(): void {
            const info = this._openData;
            this._inputWarPassword.text = "";
            this._labelWarName.text     = info.warName || info.mapName;
        }
    }
}
