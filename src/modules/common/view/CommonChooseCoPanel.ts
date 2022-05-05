
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

    export type OpenDataForCommonChooseCoPanel = {
        gameConfig              : GameConfig;
        currentCoIdArray        : number[];
        forceUnchosenCoIdArray  : number[] | null;
        callbackOnConfirm       : ((coIdArray: number[]) => void) | null;
    };
    export class CommonChooseCoPanel extends TwnsUiPanel.UiPanel<OpenDataForCommonChooseCoPanel> {
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

        private _chosenCoIdSet          = new Set<number>();
        private _previewCoId            : number | null = null;

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

        private _setPreviewCoId(coId: number): void {
            if (this._getPreviewCoId() !== coId) {
                this._previewCoId = coId;
                this._updateComponentsForPreviewCoId();
            }
        }
        private _getPreviewCoId(): number | null {
            return this._previewCoId;
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Event callbacks.
        ////////////////////////////////////////////////////////////////////////////////
        private _onNotifyLanguageChanged(): void {
            this._updateComponentsForLanguage();
        }

        private _onTouchedBtnConfirm(): void {
            const openData      = this._getOpenData();
            const chosenCoIdSet = this._chosenCoIdSet;
            for (const coId of openData.forceUnchosenCoIdArray ?? []) {
                if (chosenCoIdSet.has(coId)) {
                    PanelHelpers.open(PanelHelpers.PanelDict.CommonAlertPanel, {
                        title   : Lang.getText(LangTextType.B0088),
                        content : Lang.getFormattedText(LangTextType.F0133, openData.gameConfig.getCoNameAndTierText(coId)),
                    });
                    return;
                }
            }

            const callback = openData.callbackOnConfirm;
            if (callback) {
                callback([...chosenCoIdSet]);
            }

            this.close();
        }

        private _onTouchedCoNameRenderer(e: egret.TouchEvent): void {
            const renderer  = e.currentTarget as RendererForCoName;
            const coId      = Helpers.getExisted(renderer.getCoId());
            this._setPreviewCoId(coId);

            const openData = this._getOpenData();
            if (openData.callbackOnConfirm == null) {
                return;
            }

            const chosenCoIdSet = this._chosenCoIdSet;
            if (!renderer.getIsChosen()) {
                chosenCoIdSet.add(coId);
                this._updateGroupCoNames();
                return;
            }

            chosenCoIdSet.delete(coId);
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

            this._updateComponentsForPreviewCoId();
        }

        private _initButtons(): void {
            const canModify             = this._getOpenData().callbackOnConfirm != null;
            this._btnConfirm.visible    = canModify;
            this._btnCancel.visible     = canModify;
            this._btnClose.visible      = !canModify;
        }

        private _initGroupCoNames(): void {
            const openData      = this._getOpenData();
            const chosenCoIdSet = this._chosenCoIdSet;
            const gameConfig    = openData.gameConfig;
            const fullCoIdSet   = new Set(gameConfig.getEnabledCoArray().map(v => v.coId));
            for (const coId of openData.currentCoIdArray) {
                if (fullCoIdSet.has(coId)) {
                    chosenCoIdSet.add(coId);
                }
            }

            const fullCoIdArray = [...fullCoIdSet].sort((v1, v2) => {
                const name1 = gameConfig.getCoNameAndTierText(v1);
                const name2 = gameConfig.getCoNameAndTierText(v2);
                return (name1 || "").localeCompare(name2 || "", "zh");
            });
            const groupOriginCoNames = this._groupOriginCoNames;
            const groupCustomCoNames = this._groupCustomCoNames;
            for (const coId of fullCoIdArray) {
                const renderer = new RendererForCoName();
                renderer.setGameConfig(gameConfig);
                renderer.setCoId(coId);
                renderer.setIsChosen(false);

                renderer.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onTouchedCoNameRenderer, this);
                this._renderersForCoNames.push(renderer);

                if (gameConfig.checkIsOriginCo(coId)) {
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
            const chosenCoIdSet = this._chosenCoIdSet;
            for (const renderer of this._renderersForCoNames) {
                renderer.setIsChosen(chosenCoIdSet.has(Helpers.getExisted(renderer.getCoId())));
            }
        }

        private _initComponentsForPreviewCo(): void {
            this._setPreviewCoId(Twns.CommonConstants.CoEmptyId);
        }

        private _updateComponentsForPreviewCoId(): void {
            const coId = this._previewCoId;
            if (coId == null) {
                return;
            }

            this._uiCoInfo.setCoData({
                gameConfig   : this._getOpenData().gameConfig,
                coId,
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

            await Helpers.wait(Twns.CommonConstants.DefaultTweenTime);
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

            await Helpers.wait(Twns.CommonConstants.DefaultTweenTime);
        }
    }

    class RendererForCoName extends TwnsUiComponent.UiComponent {
        private readonly _imgUnselected!    : TwnsUiImage.UiImage;
        private readonly _imgSelected!      : TwnsUiImage.UiImage;
        private readonly _labelName!        : TwnsUiLabel.UiLabel;

        private _gameConfig     : GameConfig | null = null;
        private _coId           : number | null = null;
        private _isChosen       : boolean | null = null;

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

        public setCoId(coId: number): void {
            this._coId = coId;
            this._updateView();
        }
        public getCoId(): number | null {
            return this._coId;
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
            this._labelName.text        = this._gameConfig?.getCoBasicCfg(Helpers.getExisted(this._coId))?.name || Twns.CommonConstants.ErrorTextForUndefined;
        }
    }
}

// export default TwnsCommonChooseCoPanel;
