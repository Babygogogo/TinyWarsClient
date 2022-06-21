
// import TwnsCommonAlertPanel     from "../../common/view/CommonAlertPanel";
// import TwnsCommonConfirmPanel   from "../../common/view/CommonConfirmPanel";
// import CommonConstants          from "../../tools/helpers/CommonConstants";
// import ConfigManager            from "../../tools/helpers/ConfigManager";
// import Helpers                  from "../../tools/helpers/Helpers";
// import Types                    from "../../tools/helpers/Types";
// import Lang                     from "../../tools/lang/Lang";
// import TwnsLangTextType         from "../../tools/lang/LangTextType";
// import Notify           from "../../tools/notify/NotifyType";
// import TwnsUiButton             from "../../tools/ui/UiButton";
// import TwnsUiCoInfo             from "../../tools/ui/UiCoInfo";
// import TwnsUiComponent          from "../../tools/ui/UiComponent";
// import TwnsUiImage              from "../../tools/ui/UiImage";
// import TwnsUiLabel              from "../../tools/ui/UiLabel";
// import TwnsUiPanel              from "../../tools/ui/UiPanel";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.Common {
    import LangTextType     = Lang.LangTextType;
    import NotifyType       = Notify.NotifyType;
    import GameConfig       = Config.GameConfig;

    export type OpenDataForCommonBanCoCategoryIdPanel = {
        playerIndex             : number | null;
        gameConfig              : GameConfig;
        bannedCoCategoryIdArray : number[];
        maxBanCount             : number | null;
        selfCoId                : number | null;
        callbackOnConfirm       : ((bannedCoCategoryIdSet: Set<number>) => void) | null;
    };
    export class CommonBanCoCategoryIdPanel extends TwnsUiPanel.UiPanel<OpenDataForCommonBanCoCategoryIdPanel> {
        private readonly _imgMask!                  : TwnsUiImage.UiImage;
        private readonly _group!                    : eui.Group;
        private readonly _labelAvailableCoTitle!    : TwnsUiLabel.UiLabel;
        // private readonly _groupCoTiers              : eui.Group;
        private readonly _groupOriginCoNames!       : eui.Group;
        private readonly _groupCustomCoNames!       : eui.Group;
        private readonly _btnCancel!                : TwnsUiButton.UiButton;
        private readonly _btnConfirm!               : TwnsUiButton.UiButton;
        private readonly _btnClose!                 : TwnsUiButton.UiButton;
        private readonly _uiCoInfo!                 : TwnsUiCoInfo.UiCoInfo;

        // private _renderersForCoTiers    : RendererForCoTier[] = [];
        private _renderersForCoNames    : RendererForCoName[] = [];

        private _bannedCoCategoryIdSet  = new Set<number>();
        private _previewCoCategoryId    : number | null = null;

        protected _onOpening(): void {
            this._setUiListenerArray([
                { ui: this._btnCancel,  callback: this.close },
                { ui: this._btnConfirm, callback: this._onTouchedBtnConfirm },
                { ui: this._btnClose,   callback: this.close },
            ]);
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged, callback: this._onNotifyLanguageChanged },
            ]);
            this._setIsTouchMaskEnabled();
            this._setIsCloseOnTouchedMask();
        }
        protected async _updateOnOpenDataChanged(): Promise<void> {
            const openData              = this._getOpenData();
            const bannedCoCategoryIdSet = this._bannedCoCategoryIdSet;
            bannedCoCategoryIdSet.clear();
            for (const coCategoryId of openData.bannedCoCategoryIdArray) {
                bannedCoCategoryIdSet.add(coCategoryId);
            }

            this._updateComponentsForLanguage();
            // this._initGroupCoTiers();
            this._initButtons();
            this._initGroupCoNames();
            this._initComponentsForPreviewCo();
        }
        protected _onClosing(): void {
            // this._clearGroupCoTiers();
            this._clearGroupCoNames();
        }

        private _setPreviewCoCategoryId(coCategoryId: number): void {
            if (this._getPreviewCoCategoryId() !== coCategoryId) {
                this._previewCoCategoryId = coCategoryId;
                this._updateComponentsForPreviewCoCategoryId();
            }
        }
        private _getPreviewCoCategoryId(): number | null {
            return this._previewCoCategoryId;
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Event callbacks.
        ////////////////////////////////////////////////////////////////////////////////
        private _onNotifyLanguageChanged(): void {
            this._updateComponentsForLanguage();
        }

        private _onTouchedBtnConfirm(): void {
            const openData = this._getOpenData();
            const callback = openData.callbackOnConfirm;
            if (callback == null) {
                throw Helpers.newError(`CommonBanCoPanel._onTouchedBtnConfirm() empty callback.`);
            } else {
                const bannedCoCategoryIdSet = this._bannedCoCategoryIdSet;
                if (bannedCoCategoryIdSet.has(CommonConstants.CoCategoryId.Empty)) {
                    PanelHelpers.open(PanelHelpers.PanelDict.CommonAlertPanel, {
                        title   : Lang.getText(LangTextType.B0088),
                        content : Lang.getText(LangTextType.A0130),
                    });
                    return;
                }

                const maxBanCount = openData.maxBanCount;
                if ((maxBanCount != null) && (bannedCoCategoryIdSet.size > maxBanCount)) {
                    PanelHelpers.open(PanelHelpers.PanelDict.CommonAlertPanel, {
                        title   : Lang.getText(LangTextType.B0088),
                        content : Lang.getFormattedText(LangTextType.F0031, maxBanCount),
                    });
                    return;
                }

                callback(new Set(bannedCoCategoryIdSet));
            }
        }

        private _onTouchedCoNameRenderer(e: egret.TouchEvent): void {
            const renderer      = e.currentTarget as RendererForCoName;
            const coCategoryId  = Helpers.getExisted(renderer.getCoCategoryId());
            this._setPreviewCoCategoryId(coCategoryId);

            const openData = this._getOpenData();
            if (openData.callbackOnConfirm == null) {
                return;
            }

            const bannedCoCategoryIdSet = this._bannedCoCategoryIdSet;
            if (!renderer.getIsAvailable()) {
                bannedCoCategoryIdSet.delete(coCategoryId);
                // this._updateGroupCoTiers();
                this._updateGroupCoNames();
                return;
            }

            if (coCategoryId === CommonConstants.CoCategoryId.Empty) {
                PanelHelpers.open(PanelHelpers.PanelDict.CommonAlertPanel, {
                    title   : Lang.getText(LangTextType.B0088),
                    content : Lang.getText(LangTextType.A0130),
                });
                return;
            }

            const maxBanCount = openData.maxBanCount;
            if ((maxBanCount != null) && (bannedCoCategoryIdSet.size >= maxBanCount)) {
                PanelHelpers.open(PanelHelpers.PanelDict.CommonAlertPanel, {
                    title   : Lang.getText(LangTextType.B0088),
                    content : Lang.getFormattedText(LangTextType.F0031, maxBanCount),
                });
                return;
            }

            const callback = () => {
                bannedCoCategoryIdSet.add(coCategoryId);
                // this._updateGroupCoTiers();
                this._updateGroupCoNames();
            };
            const selfCoId = openData.selfCoId;
            if ((selfCoId == null) || (openData.gameConfig.getCoBasicCfg(selfCoId)?.categoryId !== coCategoryId)) {
                callback();
            } else {
                PanelHelpers.open(PanelHelpers.PanelDict.CommonConfirmPanel, {
                    content : Lang.getText(LangTextType.A0057),
                    callback,
                });
            }
        }

        ////////////////////////////////////////////////////////////////////////////////
        // View functions.
        ////////////////////////////////////////////////////////////////////////////////
        private _updateComponentsForLanguage(): void {
            this._btnCancel.label   = Lang.getText(LangTextType.B0154);
            this._btnConfirm.label  = Lang.getText(LangTextType.B0026);
            this._btnClose.label    = Lang.getText(LangTextType.B0204);

            const playerIndex           = this._getOpenData().playerIndex;
            const labelAvailableCoTitle = this._labelAvailableCoTitle;
            if (playerIndex == null) {
                labelAvailableCoTitle.text = Lang.getText(LangTextType.B0590);
            } else {
                labelAvailableCoTitle.text = `${Lang.getText(LangTextType.B0590)} (P${playerIndex})`;
            }

            this._updateComponentsForPreviewCoCategoryId();
        }

        private _initButtons(): void {
            const canModify             = this._getOpenData().callbackOnConfirm != null;
            this._btnConfirm.visible    = canModify;
            this._btnCancel.visible     = canModify;
            this._btnClose.visible      = !canModify;
        }

        private _initGroupCoNames(): void {
            const openData              = this._getOpenData();
            const gameConfig            = openData.gameConfig;
            const groupOriginCoNames    = this._groupOriginCoNames;
            const groupCustomCoNames    = this._groupCustomCoNames;
            for (const coCategoryId of gameConfig.getEnabledCoCategoryIdArray()) {
                const renderer = new RendererForCoName();
                renderer.setGameConfig(gameConfig);
                renderer.setCoCategoryId(coCategoryId);
                renderer.setIsAvailable(true);

                renderer.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onTouchedCoNameRenderer, this);
                this._renderersForCoNames.push(renderer);

                if (gameConfig.checkIsOriginCoByCategoryId(coCategoryId)) {
                    groupOriginCoNames.addChild(renderer);
                } else {
                    groupCustomCoNames.addChild(renderer);
                }
            }

            this._updateGroupCoNames();
        }

        private _clearGroupCoNames(): void {
            this._groupOriginCoNames.removeChildren();
            this._groupCustomCoNames.removeChildren();
            this._renderersForCoNames.length = 0;
        }

        private _updateGroupCoNames(): void {
            const bannedCoCategoryIdSet = this._bannedCoCategoryIdSet;
            for (const renderer of this._renderersForCoNames) {
                renderer.setIsAvailable(!bannedCoCategoryIdSet.has(Helpers.getExisted(renderer.getCoCategoryId())));
            }
        }

        private _initComponentsForPreviewCo(): void {
            this._setPreviewCoCategoryId(CommonConstants.CoCategoryId.Empty);
        }

        private _updateComponentsForPreviewCoCategoryId(): void {
            const coCategoryId = this._previewCoCategoryId;
            if (coCategoryId == null) {
                return;
            }

            const gameConfig = this._getOpenData().gameConfig;
            this._uiCoInfo.setCoData({
                gameConfig,
                coId        : gameConfig.getEnabledCoIdByCategoryId(coCategoryId) ?? gameConfig.getCoIdByCategoryId(coCategoryId),
            });
        }

        protected async _showOpenAnimation(): Promise<void> {
            Helpers.resetTween({
                obj         : this._imgMask,
                beginProps  : { alpha: 0 },
                endProps    : { alpha: 1 },
            });
            Helpers.resetTween({
                obj         : this._group,
                beginProps  : { alpha: 0, verticalCenter: -40 },
                endProps    : { alpha: 1, verticalCenter: 0 },
            });

            await Helpers.wait(CommonConstants.DefaultTweenTime);
        }
        protected async _showCloseAnimation(): Promise<void> {
            Helpers.resetTween({
                obj         : this._imgMask,
                beginProps  : { alpha: 1 },
                endProps    : { alpha: 0 },
            });

            Helpers.resetTween({
                obj         : this._group,
                beginProps  : { alpha: 1, verticalCenter: 0 },
                endProps    : { alpha: 0, verticalCenter: -40 },
            });

            await Helpers.wait(CommonConstants.DefaultTweenTime);
        }
    }

    class RendererForCoName extends TwnsUiComponent.UiComponent {
        private readonly _imgUnselected!    : TwnsUiImage.UiImage;
        private readonly _imgSelected!      : TwnsUiImage.UiImage;
        private readonly _labelName!        : TwnsUiLabel.UiLabel;

        private _gameConfig     : GameConfig | null = null;
        private _coCategoryId   : number | null = null;
        private _isAvailable    : boolean | null = null;

        public constructor() {
            super();

            this.skinName = "resource/skins/component/checkBox/CheckBox001.exml";
        }

        protected _onOpened(): void {
            this._updateView();
        }

        public setGameConfig(config: GameConfig): void {
            this._gameConfig = config;
        }

        public setCoCategoryId(coCategoryId: number): void {
            this._coCategoryId = coCategoryId;
            this._updateView();
        }
        public getCoCategoryId(): number | null {
            return this._coCategoryId;
        }

        public setIsAvailable(isAvailable: boolean): void {
            this._isAvailable = isAvailable;
            this._updateView();
        }
        public getIsAvailable(): boolean | null {
            return this._isAvailable;
        }

        private _updateView(): void {
            if (!this.getIsOpening()) {
                return;
            }

            const isAvailable           = !!this._isAvailable;
            this._imgSelected.visible   = isAvailable;
            this._imgUnselected.visible = !isAvailable;
            this._labelName.text        = this._gameConfig?.getCoCategoryCfg(Helpers.getExisted(this._coCategoryId))?.name ?? CommonConstants.ErrorTextForUndefined;
        }
    }
}

// export default TwnsCommonBanCoPanel;
