
namespace TinyWars.Login {
    import Notify   = Utility.Notify;
    import Lang     = Utility.Lang;
    import Types    = Utility.Types;

    export class LoginBackgroundPanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Bottom;
        protected readonly _IS_EXCLUSIVE = true;

        private static _instance: LoginBackgroundPanel;

        private _labelVersion       : GameUi.UiLabel;
        private _btnLanguage01      : GameUi.UiButton;
        private _btnLanguage02      : GameUi.UiButton;
        private _groupUnits         : eui.Group;

        public static show(): void {
            if (!LoginBackgroundPanel._instance) {
                LoginBackgroundPanel._instance = new LoginBackgroundPanel();
            }
            LoginBackgroundPanel._instance.open();
        }

        public static hide(): void {
            if (LoginBackgroundPanel._instance) {
                LoginBackgroundPanel._instance.close();
            }
        }

        private constructor() {
            super();

            this._setAutoAdjustHeightEnabled();
            this.skinName = "resource/skins/login/LoginBackgroundPanel.exml";
        }

        protected _onFirstOpened(): void {
            this._notifyListeners = [
                { type: Notify.Type.LanguageChanged,                callback: this._onNotifyLanguageChanged },
                { type: Notify.Type.UnitAnimationTick,              callback: this._onNotifyUnitAnimationTick },
                { type: Notify.Type.MsgCommonLatestConfigVersion,   callback: this._onMsgCommonLatestConfigVersion },
            ];
            this._uiListeners = [
                { ui: this._btnLanguage01, callback: this._onTouchedBtnLanguage01 },
                { ui: this._btnLanguage02, callback: this._onTouchedBtnLanguage02 },
            ];

            this._btnLanguage01.setImgDisplaySource("login_button_language_003");
            this._btnLanguage01.setImgExtraSource("login_button_language_001");
        }

        protected _onOpened(): void {
            this._labelVersion.text = `v.${window.CLIENT_VERSION}`;
            this._updateBtnLanguages();

            if (Utility.ConfigManager.getLatestFormalVersion()) {
                // this._initGroupUnits();
            }
        }

        protected _onClosed(): void {
            this._clearGroupUnits();
        }

        private _onNotifyLanguageChanged(e: egret.Event): void {
            this._updateBtnLanguages();
        }
        private _onNotifyUnitAnimationTick(e: egret.Event): void {
            const group = this._groupUnits;
            const tick  = Time.TimeModel.getUnitAnimationTickCount();
            for (let i = group.numChildren - 1; i >= 0; --i) {
                ((group.getChildAt(i) as eui.Component).getChildAt(0) as WarMap.WarMapUnitView).updateOnAnimationTick(tick);
            }
        }
        private _onMsgCommonLatestConfigVersion(e: egret.Event): void {
            // this._initGroupUnits();
        }
        private _onTouchedBtnLanguage01(e: egret.TouchEvent): void {
            if (Lang.getCurrentLanguageType() !== Types.LanguageType.Chinese) {
                Lang.setLanguageType(Types.LanguageType.Chinese);
                Notify.dispatch(Notify.Type.LanguageChanged);
            }
        }
        private _onTouchedBtnLanguage02(e: egret.TouchEvent): void {
            if (Lang.getCurrentLanguageType() !== Types.LanguageType.English) {
                Lang.setLanguageType(Types.LanguageType.English);
                Notify.dispatch(Notify.Type.LanguageChanged);
            }
        }

        private _updateBtnLanguages(): void {
            const languageType = Lang.getCurrentLanguageType();
            this._btnLanguage01.setImgDisplaySource(languageType === Types.LanguageType.Chinese
                ? "login_button_language_001"
                : "login_button_language_003"
            );
            this._btnLanguage02.setImgDisplaySource(languageType === Types.LanguageType.English
                ? "login_button_language_002"
                : "login_button_language_004"
            );
        }

        // private _initGroupUnits(): void {
        //     this._clearGroupUnits();

        //     const group     = this._groupUnits;
        //     const gridWidth = Utility.ConfigManager.getGridSize().width;
        //     const count     = Math.ceil(group.width / gridWidth);
        //     for (let i = 0; i < count; ++i) {
        //         group.addChild(_createRandomUnitView());
        //     }

        //     group.x = 0;
        //     egret.Tween.get(group, { loop: true })
        //         .to({ x: -gridWidth / 4 }, 500)
        //         .call(() => {
        //             group.x = 0;
        //             group.removeChildAt(0);
        //             group.addChild(_createRandomUnitView());
        //         });
        // }
        private _clearGroupUnits(): void {
            this._groupUnits.removeChildren();
            egret.Tween.removeTweens(this._groupUnits);
        }
    }

    // function _createRandomUnitView(): eui.Component {
    //     const view = new WarMap.WarMapUnitView();
    //     view.update({
    //         configVersion: Utility.ConfigManager.getNewestConfigVersion(),

    //         gridX: 0,
    //         gridY: 0,

    //         viewId: Utility.ConfigManager.getUnitViewId(Math.floor(Math.random() * 26), Math.floor(Math.random() * 4) + 1),
    //     });

    //     const container     = new eui.Component();
    //     container.width     = Utility.ConfigManager.getGridSize().width;
    //     container.height    = Utility.ConfigManager.getGridSize().height;
    //     container.addChild(view);
    //     return container;
    // }
}
