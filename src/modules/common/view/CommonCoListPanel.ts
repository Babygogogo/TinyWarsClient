
// import TwnsBwWar                from "../../baseWar/model/BwWar";
// import CommonConstants          from "../../tools/helpers/CommonConstants";
// import ConfigManager            from "../../tools/helpers/ConfigManager";
// import Helpers                  from "../../tools/helpers/Helpers";
// import Types                    from "../../tools/helpers/Types";
// import Lang                     from "../../tools/lang/Lang";
// import TwnsLangTextType         from "../../tools/lang/LangTextType";
// import Twns.Notify           from "../../tools/notify/NotifyType";
// import TwnsUiButton             from "../../tools/ui/UiButton";
// import TwnsUiCoInfo             from "../../tools/ui/UiCoInfo";
// import TwnsUiComponent          from "../../tools/ui/UiComponent";
// import TwnsUiImage              from "../../tools/ui/UiImage";
// import TwnsUiLabel              from "../../tools/ui/UiLabel";
// import TwnsUiPanel              from "../../tools/ui/UiPanel";
// import TwnsCommonHelpPanel      from "./CommonHelpPanel";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.Common {
    import LangTextType         = Twns.Lang.LangTextType;
    import NotifyType           = Twns.Notify.NotifyType;
    import GameConfig           = Twns.Config.GameConfig;

    export type OpenDataForCommonCoListPanel = {
        war     : Twns.BaseWar.BwWar;
    };
    export class CommonCoListPanel extends TwnsUiPanel.UiPanel<OpenDataForCommonCoListPanel> {
        private readonly _imgMask!      : TwnsUiImage.UiImage;
        private readonly _group!        : eui.Group;
        private readonly _labelTitle!   : TwnsUiLabel.UiLabel;
        private readonly _btnHelp!      : TwnsUiButton.UiButton;
        private readonly _groupCoNames! : eui.Group;
        private readonly _btnClose!     : TwnsUiButton.UiButton;
        private readonly _uiCoInfo!     : TwnsUiCoInfo.UiCoInfo;

        private _renderersForCoNames    : RendererForCoName[] = [];

        private _previewingPlayerIndex  : number | null = null;

        protected _onOpening(): void {
            this._setUiListenerArray([
                { ui: this._btnHelp,    callback: this._onTouchedBtnHelp },
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
            this._initGroupCoNames();
            this._initComponentsForPreviewCo();
        }
        protected _onClosing(): void {
            this._clearGroupCoNames();
            this._setPreviewingPlayerIndex(null);
        }

        private _setPreviewingPlayerIndex(playerIndex: number | null): void {
            if (this._getPreviewingPlayerIndex() !== playerIndex) {
                this._previewingPlayerIndex = playerIndex;
                this._updateComponentsForPreviewCoId();
            }
        }
        private _getPreviewingPlayerIndex(): number | null {
            return this._previewingPlayerIndex;
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Event callbacks.
        ////////////////////////////////////////////////////////////////////////////////
        private _onNotifyLanguageChanged(): void {
            this._updateComponentsForLanguage();
        }

        private _onTouchedCoNameRenderer(e: egret.TouchEvent): void {
            const renderer = e.currentTarget as RendererForCoName;
            this._setPreviewingPlayerIndex(renderer.getPlayerIndex());
        }

        private _onTouchedBtnHelp(): void {
            Twns.PanelHelpers.open(Twns.PanelHelpers.PanelDict.CommonHelpPanel, {
                title   : Lang.getText(LangTextType.B0143),
                content : Lang.getText(LangTextType.R0004),
            });
        }

        ////////////////////////////////////////////////////////////////////////////////
        // View functions.
        ////////////////////////////////////////////////////////////////////////////////
        private _updateComponentsForLanguage(): void {
            this._btnClose.label    = Lang.getText(LangTextType.B0204);
            this._labelTitle.text   = Lang.getText(LangTextType.B0140);
        }

        private _initGroupCoNames(): void {
            const war               = this._getOpenData().war;
            const gameConfig        = war.getGameConfig();
            const rendererArray     = this._renderersForCoNames;
            rendererArray.length    = 0;

            for (const player of war.getPlayerManager().getAllPlayers().sort((v1, v2) => v1.getPlayerIndex() - v2.getPlayerIndex())) {
                if (player.getPlayerIndex() == Twns.CommonConstants.PlayerIndex.Neutral) {
                    continue;
                }

                const renderer = new RendererForCoName();
                renderer.setData({
                    gameConfig,
                    coId        : player.getCoId(),
                    energy      : player.getCoCurrentEnergy(),
                    playerIndex : player.getPlayerIndex(),
                });
                renderer.setIsSelected(true);

                renderer.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onTouchedCoNameRenderer, this);
                this._renderersForCoNames.push(renderer);
                this._groupCoNames.addChild(renderer);
            }
        }

        private _clearGroupCoNames(): void {
            this._groupCoNames.removeChildren();
            this._renderersForCoNames.length = 0;
        }

        private _initComponentsForPreviewCo(): void {
            const renderer = this._renderersForCoNames[0];
            (renderer) && (this._setPreviewingPlayerIndex(renderer.getPlayerIndex()));
        }

        private _updateComponentsForPreviewCoId(): void {
            const playerIndex = this._getPreviewingPlayerIndex();
            for (const renderer of this._renderersForCoNames) {
                if (renderer.getPlayerIndex() !== playerIndex) {
                    renderer.setIsSelected(false);
                } else {
                    renderer.setIsSelected(true);
                    this._uiCoInfo.setCoData({
                        gameConfig   : this._getOpenData().war.getGameConfig(),
                        coId            : Twns.Helpers.getExisted(renderer.getCoId()),
                    });
                }
            }
        }

        protected async _showOpenAnimation(): Promise<void> {
            Twns.Helpers.resetTween({
                obj         : this._imgMask,
                beginProps  : { alpha: 0 },
                endProps    : { alpha: 1 },
            });
            Twns.Helpers.resetTween({
                obj         : this._group,
                beginProps  : { alpha: 0, verticalCenter: -40 },
                endProps    : { alpha: 1, verticalCenter: 0 },
            });

            await Twns.Helpers.wait(Twns.CommonConstants.DefaultTweenTime);
        }
        protected async _showCloseAnimation(): Promise<void> {
            Twns.Helpers.resetTween({
                obj         : this._imgMask,
                beginProps  : { alpha: 1 },
                endProps    : { alpha: 0 },
            });
            Twns.Helpers.resetTween({
                obj         : this._group,
                beginProps  : { alpha: 1, verticalCenter: 0 },
                endProps    : { alpha: 0, verticalCenter: -40 },
            });

            await Twns.Helpers.wait(Twns.CommonConstants.DefaultTweenTime);
        }
    }

    class RendererForCoName extends TwnsUiComponent.UiComponent {
        private readonly _imgUnselected!    : TwnsUiImage.UiImage;
        private readonly _imgSelected!      : TwnsUiImage.UiImage;
        private readonly _labelName!        : TwnsUiLabel.UiLabel;

        private _gameConfig     : GameConfig | null = null;
        private _coId           : number | null = null;
        private _energy         : number | null = null;
        private _playerIndex    : number | null = null;
        private _isSelected     : boolean | null = null;

        public constructor() {
            super();

            this.skinName = "resource/skins/component/checkBox/CheckBox002.exml";
        }

        protected _onOpened(): void {
            this._updateView();
        }

        public setData({ gameConfig, coId, energy, playerIndex }: {
            gameConfig      : GameConfig;
            coId            : number;
            energy          : number;
            playerIndex     : number;
        }): void {
            this._gameConfig    = gameConfig;
            this._coId          = coId;
            this._energy        = energy;
            this._playerIndex   = playerIndex;
            this._updateView();
        }
        public getCoId(): number | null {
            return this._coId;
        }
        public getPlayerIndex(): number | null {
            return this._playerIndex;
        }

        public setIsSelected(isAvailable: boolean): void {
            this._isSelected = isAvailable;
            this._updateView();
        }

        private _updateView(): void {
            if (!this.getIsOpening()) {
                return;
            }

            const isSelected            = !!this._isSelected;
            this._imgSelected.visible   = isSelected;
            this._imgUnselected.visible = !isSelected;
            this._labelName.text        = `${this._gameConfig?.getCoBasicCfg(Twns.Helpers.getExisted(this._coId))?.name || Twns.CommonConstants.ErrorTextForUndefined}(${this._energy})`;
        }
    }
}

// export default TwnsCommonCoListPanel;
