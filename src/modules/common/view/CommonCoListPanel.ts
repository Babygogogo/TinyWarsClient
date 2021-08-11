
import TwnsBwWar                from "../../baseWar/model/BwWar";
import CommonConstants          from "../../tools/helpers/CommonConstants";
import ConfigManager            from "../../tools/helpers/ConfigManager";
import Helpers                  from "../../tools/helpers/Helpers";
import Types                    from "../../tools/helpers/Types";
import Lang                     from "../../tools/lang/Lang";
import TwnsLangTextType         from "../../tools/lang/LangTextType";
import TwnsNotifyType           from "../../tools/notify/NotifyType";
import TwnsUiButton             from "../../tools/ui/UiButton";
import TwnsUiCoInfo             from "../../tools/ui/UiCoInfo";
import TwnsUiComponent          from "../../tools/ui/UiComponent";
import TwnsUiImage              from "../../tools/ui/UiImage";
import TwnsUiLabel              from "../../tools/ui/UiLabel";
import TwnsUiPanel              from "../../tools/ui/UiPanel";
import TwnsCommonHelpPanel      from "./CommonHelpPanel";

namespace TwnsCommonCoListPanel {
    import LangTextType         = TwnsLangTextType.LangTextType;
    import NotifyType           = TwnsNotifyType.NotifyType;

    type OpenDataForCommonBanCoPanel = {
        war     : TwnsBwWar.BwWar;
    };
    export class CommonCoListPanel extends TwnsUiPanel.UiPanel<OpenDataForCommonBanCoPanel> {
        protected readonly _LAYER_TYPE   = Types.LayerType.Hud2;
        protected readonly _IS_EXCLUSIVE = true;

        private static _instance: CommonCoListPanel;

        private readonly _imgMask       : TwnsUiImage.UiImage;
        private readonly _group         : eui.Group;
        private readonly _labelTitle    : TwnsUiLabel.UiLabel;
        private readonly _btnHelp       : TwnsUiButton.UiButton;
        private readonly _groupCoNames  : eui.Group;
        private readonly _btnClose      : TwnsUiButton.UiButton;
        private readonly _uiCoInfo      : TwnsUiCoInfo.UiCoInfo;

        private _renderersForCoNames    : RendererForCoName[] = [];

        private _previewingPlayerIndex  : number;

        public static show(openData: OpenDataForCommonBanCoPanel): void {
            if (!CommonCoListPanel._instance) {
                CommonCoListPanel._instance = new CommonCoListPanel();
            }
            CommonCoListPanel._instance.open(openData);
        }

        public static async hide(): Promise<void> {
            if (CommonCoListPanel._instance) {
                await CommonCoListPanel._instance.close();
            }
        }
        public static getIsOpening(): boolean {
            const instance = CommonCoListPanel._instance;
            return instance ? instance.getIsOpening() : false;
        }

        public constructor() {
            super();

            this._setIsTouchMaskEnabled();
            this._setIsCloseOnTouchedMask();
            this.skinName = "resource/skins/common/CommonCoListPanel.exml";
        }

        protected _onOpened(): void {
            this._setUiListenerArray([
                { ui: this._btnHelp,    callback: this._onTouchedBtnHelp },
                { ui: this._btnClose,   callback: this.close },
            ]);
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged, callback: this._onNotifyLanguageChanged },
            ]);

            this._showOpenAnimation();

            this._updateComponentsForLanguage();
            this._initGroupCoNames();
            this._initComponentsForPreviewCo();
        }

        protected async _onClosed(): Promise<void> {
            await this._showCloseAnimation();

            this._clearGroupCoNames();
            this._setPreviewingPlayerIndex(undefined);
        }

        private _setPreviewingPlayerIndex(playerIndex: number): void {
            if (this._getPreviewingPlayerIndex() !== playerIndex) {
                this._previewingPlayerIndex = playerIndex;
                this._updateComponentsForPreviewCoId();
            }
        }
        private _getPreviewingPlayerIndex(): number {
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
            TwnsCommonHelpPanel.CommonHelpPanel.show({
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
            const configVersion     = war.getConfigVersion();
            const rendererArray     = this._renderersForCoNames;
            rendererArray.length    = 0;

            for (const player of war.getPlayerManager().getAllPlayers().sort((v1, v2) => v1.getPlayerIndex() - v2.getPlayerIndex())) {
                if (player.getPlayerIndex() == CommonConstants.WarNeutralPlayerIndex) {
                    continue;
                }

                const renderer = new RendererForCoName();
                renderer.setData({
                    configVersion,
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
                        configVersion   : this._getOpenData().war.getConfigVersion(),
                        coId            : renderer.getCoId(),
                    });
                }
            }
        }

        private _showOpenAnimation(): void {
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
        }
        private _showCloseAnimation(): Promise<void> {
            return new Promise<void>(resolve => {
                Helpers.resetTween({
                    obj         : this._imgMask,
                    beginProps  : { alpha: 1 },
                    endProps    : { alpha: 0 },
                });

                Helpers.resetTween({
                    obj         : this._group,
                    beginProps  : { alpha: 1, verticalCenter: 0 },
                    endProps    : { alpha: 0, verticalCenter: -40 },
                    callback    : resolve,
                });
            });
        }
    }

    class RendererForCoName extends TwnsUiComponent.UiComponent {
        private readonly _imgUnselected : TwnsUiImage.UiImage;
        private readonly _imgSelected   : TwnsUiImage.UiImage;
        private readonly _labelName     : TwnsUiLabel.UiLabel;

        private _configVersion  : string;
        private _coId           : number;
        private _energy         : number;
        private _playerIndex    : number;
        private _isSelected     : boolean;

        public constructor() {
            super();

            this.skinName = "resource/skins/component/checkBox/CheckBox002.exml";
        }

        protected _onOpened(): void {
            this._updateView();
        }

        public setData({ configVersion, coId, energy, playerIndex }: {
            configVersion   : string;
            coId            : number;
            energy          : number;
            playerIndex     : number;
        }): void {
            this._configVersion = configVersion;
            this._coId          = coId;
            this._energy        = energy;
            this._playerIndex   = playerIndex;
            this._updateView();
        }
        public getCoId(): number {
            return this._coId;
        }
        public getPlayerIndex(): number {
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

            const isSelected            = this._isSelected;
            this._imgSelected.visible   = isSelected;
            this._imgUnselected.visible = !isSelected;
            this._labelName.text        = `${ConfigManager.getCoBasicCfg(this._configVersion, this._coId)?.name || CommonConstants.ErrorTextForUndefined}(${this._energy})`;
        }
    }
}

export default TwnsCommonCoListPanel;
