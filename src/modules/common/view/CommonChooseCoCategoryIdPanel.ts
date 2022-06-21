
// import TwnsBwWar            from "../../baseWar/model/BwWar";
// import Helpers              from "../../tools/helpers/Helpers";
// import Types                from "../../tools/helpers/Types";
// import Lang                 from "../../tools/lang/Lang";
// import TwnsLangTextType     from "../../tools/lang/LangTextType";
// import Notify       from "../../tools/notify/NotifyType";
// import TwnsUiImage          from "../../tools/ui/UiImage";
// import TwnsUiLabel          from "../../tools/ui/UiLabel";
// import TwnsUiPanel          from "../../tools/ui/UiPanel";
// import MeModel              from "../model/MeModel";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.Common {
    import LangTextType = Lang.LangTextType;
    import NotifyType   = Notify.NotifyType;

    export type OpenDataForCommonChooseCoCategoryIdPanel = {
        currentCoCategoryIdArray        : number[];
        gameConfig                      : Config.GameConfig;
        forceUnchosenCoCategoryIdArray  : number[] | null;
        callbackOnConfirm               : ((coCategoryIdArray: number[]) => void) | null;
    };
    export class CommonChooseCoCategoryIdPanel extends TwnsUiPanel.UiPanel<OpenDataForCommonChooseCoCategoryIdPanel> {
        private readonly _imgMask!                  : TwnsUiImage.UiImage;
        private readonly _group!                    : eui.Group;
        private readonly _labelAvailableCoTitle!    : TwnsUiLabel.UiLabel;
        private readonly _groupOriginCoNames!       : eui.Group;
        private readonly _groupCustomCoNames!       : eui.Group;
        private readonly _btnCancel!                : TwnsUiButton.UiButton;
        private readonly _btnConfirm!               : TwnsUiButton.UiButton;
        private readonly _btnClose!                 : TwnsUiButton.UiButton;
        private readonly _uiCoInfo!                 : TwnsUiCoInfo.UiCoInfo;

        private _renderersForCoNames    : RendererForCoName[] = [];

        private _chosenCoCategoryIdSet  = new Set<number>();
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
            this._updateComponentsForLanguage();

            this._initButtons();
            this._initGroupCoNames();
            this._initComponentsForPreviewCo();
        }
        protected _onClosing(): void {
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
            const openData              = this._getOpenData();
            const chosenCoCategoryIdSet = this._chosenCoCategoryIdSet;
            for (const coCategoryId of openData.forceUnchosenCoCategoryIdArray ?? []) {
                if (chosenCoCategoryIdSet.has(coCategoryId)) {
                    PanelHelpers.open(PanelHelpers.PanelDict.CommonAlertPanel, {
                        title   : Lang.getText(LangTextType.B0088),
                        content : Lang.getFormattedText(LangTextType.F0133, openData.gameConfig.getCoNameAndTierText(coCategoryId)),
                    });
                    return;
                }
            }

            const callback = openData.callbackOnConfirm;
            if (callback) {
                callback([...chosenCoCategoryIdSet]);
            }

            this.close();
        }

        private _onTouchedCoNameRenderer(e: egret.TouchEvent): void {
            const renderer      = e.currentTarget as RendererForCoName;
            const coCategoryId  = Helpers.getExisted(renderer.getCoCategoryId());
            this._setPreviewCoCategoryId(coCategoryId);

            const openData = this._getOpenData();
            if (openData.callbackOnConfirm == null) {
                return;
            }

            const chosenCoCategoryIdSet = this._chosenCoCategoryIdSet;
            if (!renderer.getIsChosen()) {
                chosenCoCategoryIdSet.add(coCategoryId);
                this._updateGroupCoNames();
                return;
            }

            chosenCoCategoryIdSet.delete(coCategoryId);
            this._updateGroupCoNames();
        }

        ////////////////////////////////////////////////////////////////////////////////
        // View functions.
        ////////////////////////////////////////////////////////////////////////////////
        private _updateComponentsForLanguage(): void {
            this._btnCancel.label               = Lang.getText(LangTextType.B0154);
            this._btnConfirm.label              = Lang.getText(LangTextType.B0026);
            this._btnClose.label                = Lang.getText(LangTextType.B0204);
            this._labelAvailableCoTitle.text    = Lang.getText(LangTextType.B0898);

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
            const chosenCoCategoryIdSet = this._chosenCoCategoryIdSet;
            const gameConfig            = openData.gameConfig;
            const fullCoCategoryIdArray = gameConfig.getEnabledCoCategoryIdArray();
            for (const coCategoryId of openData.currentCoCategoryIdArray) {
                if (fullCoCategoryIdArray.indexOf(coCategoryId) >= 0) {
                    chosenCoCategoryIdSet.add(coCategoryId);
                }
            }

            const groupOriginCoNames = this._groupOriginCoNames;
            const groupCustomCoNames = this._groupCustomCoNames;
            for (const coCategoryId of fullCoCategoryIdArray) {
                const renderer = new RendererForCoName();
                renderer.setGameConfig(gameConfig);
                renderer.setCoCategoryId(coCategoryId);
                renderer.setIsChosen(false);

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
            const chosenCoCategoryIdSet = this._chosenCoCategoryIdSet;
            for (const renderer of this._renderersForCoNames) {
                renderer.setIsChosen(chosenCoCategoryIdSet.has(Helpers.getExisted(renderer.getCoCategoryId())));
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

        private _gameConfig     : Config.GameConfig | null = null;
        private _coCategoryId   : number | null = null;
        private _isChosen       : boolean | null = null;

        public constructor() {
            super();

            this.skinName = "resource/skins/component/checkBox/CheckBox001.exml";
        }

        protected _onOpened(): void {
            this._updateView();
        }

        public setGameConfig(config: Config.GameConfig): void {
            this._gameConfig = config;
        }

        public setCoCategoryId(coCategoryId: number): void {
            this._coCategoryId = coCategoryId;
            this._updateView();
        }
        public getCoCategoryId(): number | null {
            return this._coCategoryId;
        }

        public setIsChosen(isChosen: boolean): void {
            this._isChosen = isChosen;
            this._updateView();
        }
        public getIsChosen(): boolean | null {
            return this._isChosen;
        }

        private _updateView(): void {
            if (!this.getIsOpening()) {
                return;
            }

            const isChosen              = !!this._isChosen;
            this._imgSelected.visible   = isChosen;
            this._imgUnselected.visible = !isChosen;
            this._labelName.text        = this._gameConfig?.getCoCategoryCfg(Helpers.getExisted(this._coCategoryId))?.name ?? CommonConstants.ErrorTextForUndefined;
        }
    }
}

// export default TwnsCommonChooseCoCategoryIdPanel;
