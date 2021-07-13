
import TwnsUiImage                      from "../../../utility/ui/UiImage";
import TwnsUiListItemRenderer           from "../../../utility/ui/UiListItemRenderer";
import TwnsUiPanel                      from "../../../utility/ui/UiPanel";
import TwnsUiButton                      from "../../../utility/ui/UiButton";
import TwnsUiLabel                      from "../../../utility/ui/UiLabel";
import TwnsUiScrollList                 from "../../../utility/ui/UiScrollList";
import { CommonChangeVersionPanel }     from "../../common/view/CommonChangeVersionPanel";
import { WarMapUnitView }               from "../../warMap/view/WarMapUnitView";
import { TwnsLangTextType }             from "../../../utility/lang/LangTextType";
import { Notify }                       from "../../../utility/notify/Notify";
import { TwnsNotifyType }               from "../../../utility/notify/NotifyType";
import { Types }                        from "../../../utility/Types";
import { CommonConstants }              from "../../../utility/CommonConstants";
import { ConfigManager }                from "../../../utility/ConfigManager";
import { Helpers }                      from "../../../utility/Helpers";
import { Lang }                         from "../../../utility/lang/Lang";
import { SoundManager }                 from "../../../utility/SoundManager";
import { TimeModel }                    from "../../time/model/TimeModel";

export namespace TwnsLoginBackgroundPanel {
    import NotifyType       = TwnsNotifyType.NotifyType;
    import LangTextType     = TwnsLangTextType.LangTextType;

    // eslint-disable-next-line no-shadow
    export class LoginBackgroundPanel extends TwnsUiPanel.UiPanel<void> {
        protected readonly _LAYER_TYPE   = Types.LayerType.Bottom;
        protected readonly _IS_EXCLUSIVE = true;

        private static _instance: LoginBackgroundPanel;

        // @ts-ignore
        private _imgBackground      : TwnsUiImage.UiImage;
        // @ts-ignore
        private _btnVersion         : TwnsUiButton.UiButton;
        // @ts-ignore
        private _labelVersion       : TwnsUiLabel.UiLabel;
        // @ts-ignore
        private _listLanguage       : TwnsUiScrollList.UiScrollList<DataForLanguageRenderer>;
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
                { type: NotifyType.LanguageChanged,                callback: this._onNotifyLanguageChanged },
                { type: NotifyType.UnitAnimationTick,              callback: this._onNotifyUnitAnimationTick },
                { type: NotifyType.MsgCommonLatestConfigVersion,   callback: this._onMsgCommonLatestConfigVersion },
            ]);
            this._setUiListenerArray([
                { ui: this,                 callback: this._onTouchedSelf },
                { ui: this._btnVersion,     callback: this._onTouchedBtnVersion },
            ]);
            this._listLanguage.setItemRenderer(LanguageRenderer);

            this._showOpenAnimation();

            this._imgBackground.touchEnabled = true;

            this._updateComponentsForLanguage();
            this._initListLanguage();

            if (ConfigManager.getLatestFormalVersion()) {
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
            const tick  = TimeModel.getUnitAnimationTickCount();
            for (let i = group.numChildren - 1; i >= 0; --i) {
                ((group.getChildAt(i) as eui.Component).getChildAt(0) as WarMapUnitView).updateOnAnimationTick(tick);
            }
        }
        private _onMsgCommonLatestConfigVersion(): void {
            // this._initGroupUnits();
        }
        private _onTouchedSelf(): void {
            SoundManager.init();
        }
        private _onTouchedBtnVersion(): void {
            CommonChangeVersionPanel.show();
        }

        private _updateComponentsForLanguage(): void {
            this._btnVersion.label = Lang.getText(LangTextType.B0620);
            this._labelVersion.text = `${Lang.getGameVersionName(CommonConstants.GameVersion)}\nv.${window.CLIENT_VERSION}`;
        }
        private _initListLanguage(): void {
            const listLanguage  = this._listLanguage;
            const languageType  = Lang.getCurrentLanguageType();
            const dataArray     : DataForLanguageRenderer[] = [
                { languageType: Types.LanguageType.Chinese },
                { languageType: Types.LanguageType.English },
            ];
            listLanguage.bindData(dataArray);
            listLanguage.setSelectedIndex(dataArray.findIndex(v => v.languageType === languageType));
        }

        private _showOpenAnimation(): void {
            Helpers.resetTween({
                obj         : this._imgBackground,
                beginProps  : { alpha: 0 },
                endProps    : { alpha: 1 },
            });
            Helpers.resetTween({
                obj         : this._listLanguage,
                waitTime    : 1400,
                beginProps  : { left: -40, alpha: 0 },
                endProps    : { left: 0, alpha: 1 },
            });
            Helpers.resetTween({
                obj         : this._btnVersion,
                waitTime    : 1500,
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
                    obj         : this._listLanguage,
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
        //     const gridWidth = ConfigManager.getGridSize().width;
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

    type DataForLanguageRenderer = {
        languageType: Types.LanguageType;
    };
    class LanguageRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForLanguageRenderer> {
        // @ts-ignore
        private _labelLanguage  : TwnsUiLabel.UiLabel;

        protected _onOpened(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,    callback: this._onNotifyLanguageChanged },
            ]);
            this._setUiListenerArray([
                { ui: this, callback: this._onTouchedSelf, },
            ]);
        }
        protected _onDataChanged(): void {
            this._labelLanguage.text = Lang.getLanguageTypeName(this.data.languageType) || `??`;

            this._updateCurrentState();
        }

        private _onNotifyLanguageChanged(): void {
            this._updateCurrentState();
        }
        private _onTouchedSelf(): void {
            const languageType = this.data.languageType;
            if (Lang.getCurrentLanguageType() !== languageType) {
                Lang.setLanguageType(languageType);
                Notify.dispatch(NotifyType.LanguageChanged);
            }
        }

        private _updateCurrentState(): void {
            // this.currentState = Lang.getCurrentLanguageType() === this.data.languageType ? Types.UiState.Down : Types.UiState.Up;
        }
    }

    // function _createRandomUnitView(): eui.Component {
    //     const view = new WarMap.WarMapUnitView();
    //     view.update({
    //         configVersion: ConfigManager.getNewestConfigVersion(),

    //         gridX: 0,
    //         gridY: 0,

    //         viewId: ConfigManager.getUnitViewId(Math.floor(Math.random() * 26), Math.floor(Math.random() * 4) + 1),
    //     });

    //     const container     = new eui.Component();
    //     container.width     = ConfigManager.getGridSize().width;
    //     container.height    = ConfigManager.getGridSize().height;
    //     container.addChild(view);
    //     return container;
    // }
}
