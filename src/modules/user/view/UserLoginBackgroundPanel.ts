
// import TwnsCommonChangeVersionPanel from "../../common/view/CommonChangeVersionPanel";
// import CommonConstants              from "../../tools/helpers/CommonConstants";
// import ConfigManager                from "../../tools/helpers/ConfigManager";
// import Helpers                      from "../../tools/helpers/Helpers";
// import LocalStorage                 from "../../tools/helpers/LocalStorage";
// import SoundManager                 from "../../tools/helpers/SoundManager";
// import Timer                        from "../../tools/helpers/Timer";
// import Types                        from "../../tools/helpers/Types";
// import Lang                         from "../../tools/lang/Lang";
// import TwnsLangTextType             from "../../tools/lang/LangTextType";
// import Notify                       from "../../tools/notify/Notify";
// import Twns.Notify               from "../../tools/notify/NotifyType";
// import TwnsUiButton                 from "../../tools/ui/UiButton";
// import TwnsUiImage                  from "../../tools/ui/UiImage";
// import TwnsUiLabel                  from "../../tools/ui/UiLabel";
// import TwnsUiListItemRenderer       from "../../tools/ui/UiListItemRenderer";
// import TwnsUiPanel                  from "../../tools/ui/UiPanel";
// import TwnsUiScrollList             from "../../tools/ui/UiScrollList";
// import TwnsWarMapUnitView           from "../../warMap/view/WarMapUnitView";
// import TwnsUserSetSoundPanel        from "./UserSetSoundPanel";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.User {
    import NotifyType               = Twns.Notify.NotifyType;
    import LangTextType             = Twns.Lang.LangTextType;

    export type OpenDataForUserLoginBackgroundPanel = void;
    export class UserLoginBackgroundPanel extends TwnsUiPanel.UiPanel<OpenDataForUserLoginBackgroundPanel> {
        private readonly _imgBackground!    : TwnsUiImage.UiImage;

        private readonly _groupRightButton! : eui.Group;
        private readonly _btnVersion!       : TwnsUiButton.UiButton;
        private readonly _btnSound!         : TwnsUiButton.UiButton;

        private readonly _labelVersion!     : TwnsUiLabel.UiLabel;
        private readonly _listLanguage!     : TwnsUiScrollList.UiScrollList<DataForLanguageRenderer>;
        private readonly _groupCopyright!   : eui.Group;
        private readonly _groupUnits!       : eui.Group;

        protected _onOpening(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,                callback: this._onNotifyLanguageChanged },
                { type: NotifyType.UnitAnimationTick,              callback: this._onNotifyUnitAnimationTick },
                { type: NotifyType.MsgCommonLatestConfigVersion,   callback: this._onMsgCommonLatestConfigVersion },
            ]);
            this._setUiListenerArray([
                { ui: this,                 callback: this._onTouchedSelf },
                { ui: this._btnVersion,     callback: this._onTouchedBtnVersion },
                { ui: this._btnSound,       callback: this._onTouchedBtnSound },
            ]);
            this._listLanguage.setItemRenderer(LanguageRenderer);

            this._imgBackground.touchEnabled = true;

            this._updateComponentsForLanguage();
            this._initListLanguage();

            if (Twns.Config.ConfigManager.getLatestConfigVersion()) {
                // this._initGroupUnits();
            }
        }
        protected async _updateOnOpenDataChanged(): Promise<void> {
            // nothing to do
        }
        protected _onClosing(): void {
            this._clearGroupUnits();
        }

        private _onNotifyLanguageChanged(): void {
            this._updateComponentsForLanguage();
        }
        private _onNotifyUnitAnimationTick(): void {
            const group = this._groupUnits;
            const tick  = Twns.Timer.getUnitAnimationTickCount();
            for (let i = group.numChildren - 1; i >= 0; --i) {
                ((group.getChildAt(i) as eui.Component).getChildAt(0) as Twns.WarMap.WarMapUnitView).updateOnAnimationTick(tick);
            }
        }
        private _onMsgCommonLatestConfigVersion(): void {
            // this._initGroupUnits();
        }
        private _onTouchedSelf(): void {
            Twns.SoundManager.init();
        }
        private _onTouchedBtnVersion(): void {
            Twns.PanelHelpers.open(Twns.PanelHelpers.PanelDict.CommonChangeVersionPanel, void 0);
        }
        private _onTouchedBtnSound(): void {
            Twns.PanelHelpers.open(Twns.PanelHelpers.PanelDict.UserSetSoundPanel, void 0);
        }

        private _updateComponentsForLanguage(): void {
            this._btnVersion.label  = Lang.getText(LangTextType.B0620);
            this._btnSound.label    = Lang.getText(LangTextType.B0540);
            this._labelVersion.text = `${Lang.getGameVersionName(Twns.CommonConstants.GameVersion)}\nv.${window.CLIENT_VERSION}`;
        }
        private _initListLanguage(): void {
            const listLanguage  = this._listLanguage;
            const languageType  = Lang.getCurrentLanguageType();
            const dataArray     : DataForLanguageRenderer[] = [
                { languageType: Twns.Types.LanguageType.Chinese },
                { languageType: Twns.Types.LanguageType.English },
            ];
            listLanguage.bindData(dataArray);
            listLanguage.setSelectedIndex(dataArray.findIndex(v => v.languageType === languageType));
        }

        protected async _showOpenAnimation(): Promise<void> {
            Twns.Helpers.resetTween({
                obj         : this._imgBackground,
                beginProps  : { alpha: 0 },
                endProps    : { alpha: 1 },
            });
            Twns.Helpers.resetTween({
                obj         : this._listLanguage,
                waitTime    : 1400,
                beginProps  : { left: -40, alpha: 0 },
                endProps    : { left: 0, alpha: 1 },
            });
            Twns.Helpers.resetTween({
                obj         : this._groupRightButton,
                waitTime    : 1500,
                beginProps  : { right: -40, alpha: 0 },
                endProps    : { right: 0, alpha: 1 },
            });
            Twns.Helpers.resetTween({
                obj         : this._labelVersion,
                waitTime    : 1600,
                beginProps  : { right: -20, alpha: 0 },
                endProps    : { right: 20, alpha: 1 },
            });
            Twns.Helpers.resetTween({
                obj         : this._groupCopyright,
                beginProps  : { alpha: 0 },
                endProps    : { alpha: 1 },
                waitTime    : 1700,
            });

            await Twns.Helpers.wait(1700 + Twns.CommonConstants.DefaultTweenTime);
        }
        protected async _showCloseAnimation(): Promise<void> {
            Twns.Helpers.resetTween({
                obj         : this._imgBackground,
                beginProps  : { alpha: 1 },
                endProps    : { alpha: 0 },
            });
            Twns.Helpers.resetTween({
                obj         : this._listLanguage,
                beginProps  : { left: 0, alpha: 1 },
                endProps    : { left: -40, alpha: 0 },
            });
            Twns.Helpers.resetTween({
                obj         : this._labelVersion,
                beginProps  : { right: 20, alpha: 1 },
                endProps    : { right: -20, alpha: 0 },
            });
            Twns.Helpers.resetTween({
                obj         : this._groupRightButton,
                beginProps  : { right: 0, alpha: 1 },
                endProps    : { right: -40, alpha: 0 },
            });
            Twns.Helpers.resetTween({
                obj         : this._groupCopyright,
                beginProps  : { alpha: 1 },
                endProps    : { alpha: 0 },
            });

            await Twns.Helpers.wait(Twns.CommonConstants.DefaultTweenTime);
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
        languageType: Twns.Types.LanguageType;
    };
    class LanguageRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForLanguageRenderer> {
        private readonly _labelLanguage!    : TwnsUiLabel.UiLabel;

        protected _onOpened(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,    callback: this._onNotifyLanguageChanged },
            ]);
            this._setUiListenerArray([
                { ui: this, callback: this._onTouchedSelf, },
            ]);
        }
        protected _onDataChanged(): void {
            this._labelLanguage.text = Lang.getLanguageTypeName(this._getData().languageType) || `??`;

            this._updateCurrentState();
        }

        private _onNotifyLanguageChanged(): void {
            this._updateCurrentState();
        }
        private _onTouchedSelf(): void {
            const languageType = this._getData().languageType;
            if (Lang.getCurrentLanguageType() !== languageType) {
                Lang.setLanguageType(languageType);
                Twns.LocalStorage.setLanguageType(languageType);
                Twns.Notify.dispatch(NotifyType.LanguageChanged);
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

// export default TwnsUserLoginBackgroundPanel;
