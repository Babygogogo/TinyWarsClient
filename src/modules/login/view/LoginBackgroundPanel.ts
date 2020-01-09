
namespace TinyWars.Login {
    import Notify   = Utility.Notify;
    import Lang     = Utility.Lang;
    import Types    = Utility.Types;

    export class LoginBackgroundPanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Bottom;
        protected readonly _IS_EXCLUSIVE = true;

        private static _instance: LoginBackgroundPanel;

        private _labelVersion       : GameUi.UiLabel;
        private _btnChangeLanguage  : GameUi.UiButton;
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
                { type: Notify.Type.LanguageChanged,    callback: this._onNotifyLanguageChanged },
                { type: Notify.Type.UnitAnimationTick,  callback: this._onNotifyUnitAnimationTick },
            ];
            this._uiListeners = [
                { ui: this._btnChangeLanguage, callback: this._onTouchedBtnChangeLanguage },
            ];
        }

        protected _onOpened(): void {
            Network.Manager.addListeners([
                { msgCode: Network.Codes.S_NewestConfigVersion, callback: this._onSNewestConfigVersion },
            ], this);

            this._labelVersion.text = `TinyWars v.${window.CLIENT_VERSION}`;
            this._updateBtnChangeLanguage();

            if (ConfigManager.getNewestConfigVersion()) {
                this._initGroupUnits();
            }
        }

        protected _onClosed(): void {
            Network.Manager.addListeners([
                { msgCode: Network.Codes.S_NewestConfigVersion, callback: this._onSNewestConfigVersion },
            ], this);

            this._clearGroupUnits();
        }

        private _onNotifyLanguageChanged(e: egret.Event): void {
            this._updateBtnChangeLanguage();
        }
        private _onNotifyUnitAnimationTick(e: egret.Event): void {
            const group = this._groupUnits;
            const tick  = Time.TimeModel.getUnitAnimationTickCount();
            for (let i = group.numChildren - 1; i >= 0; --i) {
                ((group.getChildAt(i) as eui.Component).getChildAt(0) as WarMap.WarMapUnitView).updateOnAnimationTick(tick);
            }
        }
        private _onSNewestConfigVersion(e: egret.Event): void {
            this._initGroupUnits();
        }
        private _onTouchedBtnChangeLanguage(e: egret.TouchEvent): void {
            Lang.setLanguageType(Lang.getLanguageType() === Types.LanguageType.Chinese
                ? Types.LanguageType.English
                : Types.LanguageType.Chinese
            );
            Notify.dispatch(Notify.Type.LanguageChanged);
        }

        private _updateBtnChangeLanguage(): void {
            if (Lang.getLanguageType() === Types.LanguageType.Chinese) {
                this._btnChangeLanguage.label = Lang.getTextWithLanguage(Lang.Type.B0148, Types.LanguageType.English);
            } else {
                this._btnChangeLanguage.label = Lang.getTextWithLanguage(Lang.Type.B0148, Types.LanguageType.Chinese);
            }
        }

        private _initGroupUnits(): void {
            this._clearGroupUnits();

            const group     = this._groupUnits;
            const gridWidth = ConfigManager.getGridSize().width;
            const count     = Math.ceil(group.width / gridWidth);
            for (let i = 0; i < count; ++i) {
                group.addChild(_createRandomUnitView());
            }

            group.x = 0;
            egret.Tween.get(group, { loop: true })
                .to({ x: -gridWidth / 4 }, 500)
                .call(() => {
                    group.x = 0;
                    group.removeChildAt(0);
                    group.addChild(_createRandomUnitView());
                });
        }
        private _clearGroupUnits(): void {
            this._groupUnits.removeChildren();
            egret.Tween.removeTweens(this._groupUnits);
        }
    }

    function _createRandomUnitView(): eui.Component {
        const view = new WarMap.WarMapUnitView();
        view.update({
            configVersion: ConfigManager.getNewestConfigVersion(),

            gridX: 0,
            gridY: 0,

            viewId: ConfigManager.getUnitViewId(Math.floor(Math.random() * 26), Math.floor(Math.random() * 4) + 1),
        });

        const container     = new eui.Component();
        container.width     = ConfigManager.getGridSize().width;
        container.height    = ConfigManager.getGridSize().height;
        container.addChild(view);
        return container;
    }
}
