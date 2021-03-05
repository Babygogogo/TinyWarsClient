
namespace TinyWars.MultiRankRoom {
    import Lang             = Utility.Lang;
    import Notify           = Utility.Notify;
    import ConfigManager    = Utility.ConfigManager;
    import CommonConstants  = Utility.CommonConstants;

    export class MrrSetMaxConcurrentCountPanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Hud2;
        protected readonly _IS_EXCLUSIVE = true;

        private static _instance: MrrSetMaxConcurrentCountPanel;

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
            if (!MrrSetMaxConcurrentCountPanel._instance) {
                MrrSetMaxConcurrentCountPanel._instance = new MrrSetMaxConcurrentCountPanel();
            }
            MrrSetMaxConcurrentCountPanel._instance.open(undefined);
        }

        public static async hide(): Promise<void> {
            if (MrrSetMaxConcurrentCountPanel._instance) {
                await MrrSetMaxConcurrentCountPanel._instance.close();
            }
        }

        public constructor() {
            super();

            this.skinName = "resource/skins/multiRankRoom/MrrSetMaxConcurrentCountPanel.exml";
            this._setIsAutoAdjustHeight();
            this._setIsTouchMaskEnabled();
        }

        protected _onOpened(): void {
            this._setNotifyListenerArray([
                { type: Notify.Type.LanguageChanged,                callback: this._onNotifyLanguageChanged },
                { type: Notify.Type.MsgMrrGetMaxConcurrentCount,    callback: this._onMsgMrrGetMaxConcurrentCount },
                { type: Notify.Type.MsgMrrSetMaxConcurrentCount,    callback: this._onMsgMrrSetMaxConcurrentCount },
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
            this._maxCount  = MrrModel.getMaxConcurrentCount(hasFog);
            this._updateImgHasFog();
            this._updateLabelCount();
        }

        private _onNotifyLanguageChanged(e: egret.Event): void {
            this._updateComponentsForLanguage();
        }
        private _onMsgMrrGetMaxConcurrentCount(e: egret.Event): void {
            this._maxCount = MrrModel.getMaxConcurrentCount(this._hasFog);
            this._updateLabelCount();
        }
        private _onMsgMrrSetMaxConcurrentCount(e: egret.Event): void {
            this._maxCount = MrrModel.getMaxConcurrentCount(this._hasFog);
            this._updateLabelCount();
        }

        private _onTouchedBtnCancel(e: egret.TouchEvent): void {
            this.close();
        }
        private _onTouchedBtnConfirm(e: egret.TouchEvent): void {
            const maxCount  = this._maxCount;
            const hasFog    = this._hasFog;
            if (maxCount !== MrrModel.getMaxConcurrentCount(hasFog)) {
                MrrProxy.reqMrrSetMaxConcurrentCount(hasFog, maxCount);
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
            this._maxCount  = MrrModel.getMaxConcurrentCount(hasFog);
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
