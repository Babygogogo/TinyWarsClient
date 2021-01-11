
namespace TinyWars.RankMatchRoom {
    import Lang             = Utility.Lang;
    import Notify           = Utility.Notify;
    import ConfigManager    = Utility.ConfigManager;
    import CommonConstants  = ConfigManager.COMMON_CONSTANTS;

    export class RmrSetMaxConcurrentCountPanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Hud2;
        protected readonly _IS_EXCLUSIVE = true;

        private static _instance: RmrSetMaxConcurrentCountPanel;

        private _labelTitle     : GameUi.UiLabel;
        private _labelTips      : GameUi.UiLabel;
        private _btnCancel      : GameUi.UiButton;
        private _btnConfirm     : GameUi.UiButton;

        private _btnModifyHasFog    : TinyWars.GameUi.UiButton;
        private _imgHasFog          : TinyWars.GameUi.UiImage;

        private _btnModifyCount     : GameUi.UiButton;
        private _labelCount         : GameUi.UiLabel;

        private _hasFog     : boolean;
        private _maxCount   : number;

        public static show(): void {
            if (!RmrSetMaxConcurrentCountPanel._instance) {
                RmrSetMaxConcurrentCountPanel._instance = new RmrSetMaxConcurrentCountPanel();
            }
            RmrSetMaxConcurrentCountPanel._instance.open(undefined);
        }

        public static hide(): void {
            if (RmrSetMaxConcurrentCountPanel._instance) {
                RmrSetMaxConcurrentCountPanel._instance.close();
            }
        }

        public constructor() {
            super();

            this.skinName = "resource/skins/rankMatchRoom/RmrSetMaxConcurrentCountPanel.exml";
            this._setIsAutoAdjustHeight();
            this._setIsTouchMaskEnabled();
        }

        protected _onOpened(): void {
            this._setNotifyListenerArray([
                { type: Notify.Type.LanguageChanged,                callback: this._onNotifyLanguageChanged },
                { type: Notify.Type.MsgRmrGetMaxConcurrentCount,    callback: this._onMsgRmrGetMaxConcurrentCount },
                { type: Notify.Type.MsgRmrSetMaxConcurrentCount,    callback: this._onMsgRmrSetMaxConcurrentCount },
            ]);
            this._setUiListenerArray([
                { ui: this._btnCancel,          callback: this._onTouchedBtnCancel },
                { ui: this._btnConfirm,         callback: this._onTouchedBtnConfirm },
                { ui: this._btnModifyHasFog,    callback: this._onTouchedBtnModifyHasFog },
                { ui: this._btnModifyCount,     callback: this._onTouchedBtnModifyCount },
            ]);

            this._btnConfirm.setTextColor(0x00FF00);
            this._btnCancel.setTextColor(0xFF0000);
            this._btnModifyHasFog.setTextColor(0x00FF00);
            this._btnModifyCount.setTextColor(0x00FF00);

            this._updateComponentsForLanguage();

            const hasFog    = false;
            this._hasFog    = hasFog;
            this._maxCount  = RmrModel.getMaxConcurrentCount(hasFog);
            this._updateImgHasFog();
            this._updateLabelCount();
        }

        private _onNotifyLanguageChanged(e: egret.Event): void {
            this._updateComponentsForLanguage();
        }
        private _onMsgRmrGetMaxConcurrentCount(e: egret.Event): void {
            this._maxCount = RmrModel.getMaxConcurrentCount(this._hasFog);
            this._updateLabelCount();
        }
        private _onMsgRmrSetMaxConcurrentCount(e: egret.Event): void {
            this._maxCount = RmrModel.getMaxConcurrentCount(this._hasFog);
            this._updateLabelCount();
        }

        private _onTouchedBtnCancel(e: egret.TouchEvent): void {
            this.close();
        }
        private _onTouchedBtnConfirm(e: egret.TouchEvent): void {
            const maxCount  = this._maxCount;
            const hasFog    = this._hasFog;
            if (maxCount !== RmrModel.getMaxConcurrentCount(hasFog)) {
                RmrProxy.reqRmrSetMaxConcurrentCount(hasFog, maxCount);
            }
            this.close();
        }
        private _onTouchedBtnModifyCount(e: egret.TouchEvent): void {
            this._maxCount = (this._maxCount + 1) % (CommonConstants.RankMaxConcurrentCount + 1);
            this._updateLabelCount();
        }
        private _onTouchedBtnModifyHasFog(e: egret.TouchEvent): void {
            const hasFog    = !this._hasFog;
            this._hasFog    = hasFog;
            this._maxCount  = RmrModel.getMaxConcurrentCount(hasFog);
            this._updateImgHasFog();
            this._updateLabelCount();
        }

        private _updateComponentsForLanguage(): void {
            this._btnConfirm.label      = Lang.getText(Lang.Type.B0026);
            this._btnCancel.label       = Lang.getText(Lang.Type.B0154);
            this._labelTitle.text       = Lang.getText(Lang.Type.B0088);
            this._labelTips.text        = Lang.getText(Lang.Type.A0132);
            this._btnModifyCount.label  = Lang.getText(Lang.Type.B0412);
            this._btnModifyHasFog.label = Lang.getText(Lang.Type.B0020);
        }

        private _updateImgHasFog(): void {
            this._imgHasFog.visible = this._hasFog;
        }
        private _updateLabelCount(): void {
            this._labelCount.text = `${this._maxCount}`;
        }
    }
}
