
// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace TinyWars.Login {
    import Notify           = Utility.Notify;
    import Lang             = Utility.Lang;
    import Types            = Utility.Types;
    import CommonConstants  = Utility.CommonConstants;
    import Helpers          = Utility.Helpers;

    export class LoginBackgroundPanel extends GameUi.UiPanel<void> {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Bottom;
        protected readonly _IS_EXCLUSIVE = true;

        private static _instance: LoginBackgroundPanel;

        // @ts-ignore
        private _imgBackground      : GameUi.UiImage;
        // @ts-ignore
        private _btnVersion         : GameUi.UiButton;
        // @ts-ignore
        private _labelVersion       : GameUi.UiLabel;
        // @ts-ignore
        private _btnLanguage01      : GameUi.UiButton;
        // @ts-ignore
        private _btnLanguage02      : GameUi.UiButton;
        // @ts-ignore
        private _groupCopyright     : eui.Group;
        // @ts-ignore
        private _groupUnits         : eui.Group;

        public static show(): void {
            if (!LoginBackgroundPanel._instance) {
                LoginBackgroundPanel._instance = new LoginBackgroundPanel();
            }
            LoginBackgroundPanel._instance.open(undefined);
        }

        public static async hide(): Promise<void> {
            if (LoginBackgroundPanel._instance) {
                await LoginBackgroundPanel._instance.close();
            }
        }

        private constructor() {
            super();

            this.skinName = "resource/skins/login/LoginBackgroundPanel.exml";
        }

        protected _onOpened(): void {
            this._setNotifyListenerArray([
                { type: Notify.Type.LanguageChanged,                callback: this._onNotifyLanguageChanged },
                { type: Notify.Type.UnitAnimationTick,              callback: this._onNotifyUnitAnimationTick },
                { type: Notify.Type.MsgCommonLatestConfigVersion,   callback: this._onMsgCommonLatestConfigVersion },
            ]);
            this._setUiListenerArray([
                { ui: this,                 callback: this._onTouchedSelf },
                { ui: this._btnLanguage01,  callback: this._onTouchedBtnLanguage01 },
                { ui: this._btnLanguage02,  callback: this._onTouchedBtnLanguage02 },
                { ui: this._btnVersion,     callback: this._onTouchedBtnVersion },
            ]);

            this._showOpenAnimation();

            this._imgBackground.touchEnabled = true;
            this._btnLanguage01.setImgDisplaySource("login_button_language_003");
            this._btnLanguage01.setImgExtraSource("login_button_language_001");

            this._updateComponentsForLanguage();

            if (Utility.ConfigManager.getLatestFormalVersion()) {
                // this._initGroupUnits();
            }
        }

        protected async _onClosed(): Promise<void> {
            await this._showCloseAnimation();

            this._clearGroupUnits();
        }

        private _onNotifyLanguageChanged(): void {
            this._updateComponentsForLanguage();
        }
        private _onNotifyUnitAnimationTick(): void {
            const group = this._groupUnits;
            const tick  = Time.TimeModel.getUnitAnimationTickCount();
            for (let i = group.numChildren - 1; i >= 0; --i) {
                ((group.getChildAt(i) as eui.Component).getChildAt(0) as WarMap.WarMapUnitView).updateOnAnimationTick(tick);
            }
        }
        private _onMsgCommonLatestConfigVersion(): void {
            // this._initGroupUnits();
        }
        private _onTouchedSelf(): void {
            Utility.SoundManager.init();
        }
        private _onTouchedBtnLanguage01(): void {
            if (Lang.getCurrentLanguageType() !== Types.LanguageType.Chinese) {
                Lang.setLanguageType(Types.LanguageType.Chinese);
                Notify.dispatch(Notify.Type.LanguageChanged);
            }
        }
        private _onTouchedBtnLanguage02(): void {
            if (Lang.getCurrentLanguageType() !== Types.LanguageType.English) {
                Lang.setLanguageType(Types.LanguageType.English);
                Notify.dispatch(Notify.Type.LanguageChanged);
            }
        }
        private _onTouchedBtnVersion(): void {
            Common.CommonChangeVersionPanel.show();
        }

        private _updateComponentsForLanguage(): void {
            const languageType = Lang.getCurrentLanguageType();
            this._btnLanguage01.setImgDisplaySource(languageType === Types.LanguageType.Chinese
                ? "login_button_language_001"
                : "login_button_language_003"
            );
            this._btnLanguage02.setImgDisplaySource(languageType === Types.LanguageType.English
                ? "login_button_language_002"
                : "login_button_language_004"
            );
            this._btnVersion.label = Lang.getText(Lang.Type.B0620);
            this._labelVersion.text = `${Lang.getGameVersionName(CommonConstants.GameVersion)}\nv.${window.CLIENT_VERSION}`;
        }

        private _showOpenAnimation(): void {
            Helpers.resetTween({
                obj         : this._imgBackground,
                beginProps  : { alpha: 0 },
                endProps    : { alpha: 1 },
            });
            Helpers.resetTween({
                obj         : this._btnLanguage01,
                waitTime    : 1400,
                beginProps  : { left: -40, alpha: 0 },
                endProps    : { left: 0, alpha: 1 },
            });
            Helpers.resetTween({
                obj         : this._btnLanguage02,
                waitTime    : 1500,
                beginProps  : { left: -40, alpha: 0 },
                endProps    : { left: 0, alpha: 1 },
            });
            Helpers.resetTween({
                obj         : this._btnVersion,
                waitTime    : 1600,
                beginProps  : { right: -40, alpha: 0 },
                endProps    : { right: 0, alpha: 1 },
            });
            Helpers.resetTween({
                obj         : this._labelVersion,
                waitTime    : 1600,
                beginProps  : { right: -20, alpha: 0 },
                endProps    : { right: 20, alpha: 1 },
            });
            Helpers.resetTween({
                obj         : this._groupCopyright,
                beginProps  : { alpha: 0 },
                endProps    : { alpha: 1 },
                waitTime    : 1700,
            });
        }
        private _showCloseAnimation(): Promise<void> {
            return new Promise<void>(resolve => {
                Helpers.resetTween({
                    obj         : this._imgBackground,
                    beginProps  : { alpha: 1 },
                    endProps    : { alpha: 0 },
                    callback    : resolve,
                });
                Helpers.resetTween({
                    obj         : this._btnLanguage01,
                    beginProps  : { left: 0, alpha: 1 },
                    endProps    : { left: -40, alpha: 0 },
                });
                Helpers.resetTween({
                    obj         : this._btnLanguage02,
                    beginProps  : { left: 0, alpha: 1 },
                    endProps    : { left: -40, alpha: 0 },
                });
                Helpers.resetTween({
                    obj         : this._labelVersion,
                    beginProps  : { right: 20, alpha: 1 },
                    endProps    : { right: -20, alpha: 0 },
                });
                Helpers.resetTween({
                    obj         : this._btnVersion,
                    beginProps  : { right: 0, alpha: 1 },
                    endProps    : { right: -40, alpha: 0 },
                });
                Helpers.resetTween({
                    obj         : this._groupCopyright,
                    beginProps  : { alpha: 1 },
                    endProps    : { alpha: 0 },
                });
            });
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
