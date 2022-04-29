
// import ConfigManager        from "../../tools/helpers/ConfigManager";
// import Helpers              from "../../tools/helpers/Helpers";
// import Types                from "../../tools/helpers/Types";
// import Lang                 from "../../tools/lang/Lang";
// import TwnsLangTextType     from "../../tools/lang/LangTextType";
// import TwnsNotifyType       from "../../tools/notify/NotifyType";
// import ProtoTypes           from "../../tools/proto/ProtoTypes";
// import TwnsUiButton         from "../../tools/ui/UiButton";
// import TwnsUiComponent      from "../../tools/ui/UiComponent";
// import TwnsUiImage          from "../../tools/ui/UiImage";
// import TwnsUiLabel          from "../../tools/ui/UiLabel";
// import TwnsUiPanel          from "../../tools/ui/UiPanel";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace TwnsMmWarRuleAvailableCoPanel {
    import LangTextType     = TwnsLangTextType.LangTextType;
    import NotifyType       = TwnsNotifyType.NotifyType;
    import WarRule          = CommonProto.WarRule;

    export type OpenData = {
        playerRule      : WarRule.IDataForPlayerRule;
        warRule         : WarRule.ITemplateWarRule;
    };
    export class MmWarRuleAvailableCoPanel extends TwnsUiPanel.UiPanel<OpenData> {
        private readonly _labelAvailableCoTitle!    : TwnsUiLabel.UiLabel;
        private readonly _groupCoTiers!             : eui.Group;
        private readonly _groupCoNames!             : eui.Group;
        private readonly _btnCancel!                : TwnsUiButton.UiButton;

        private _renderersForCoTiers    : RendererForCoTier[] = [];
        private _renderersForCoNames    : RendererForCoName[] = [];

        private _bannedCoIdSet          = new Set<number>();

        protected _onOpening(): void {
            this._setUiListenerArray([
                { ui: this._btnCancel,  callback: this._onTouchedBtnCancel },
            ]);
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged, callback: this._onNotifyLanguageChanged },
            ]);
            this._setIsTouchMaskEnabled();
        }
        protected async _updateOnOpenDataChanged(): Promise<void> {
            const bannedCoIdSet = this._bannedCoIdSet;
            bannedCoIdSet.clear();
            for (const coId of this._getOpenData().playerRule.bannedCoIdArray || []) {
                bannedCoIdSet.add(coId);
            }

            this._updateComponentsForLanguage();
            this._initGroupCoTiers();
            this._initGroupCoNames();
        }
        protected _onClosing(): void {
            // nothing to do
        }

        protected async _onClosed(): Promise<void> {
            this._clearGroupCoTiers();
            this._clearGroupCoNames();
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Event callbacks.
        ////////////////////////////////////////////////////////////////////////////////
        private _onNotifyLanguageChanged(): void {
            this._updateComponentsForLanguage();
        }

        private _onTouchedBtnCancel(): void {
            this.close();
        }

        ////////////////////////////////////////////////////////////////////////////////
        // View functions.
        ////////////////////////////////////////////////////////////////////////////////
        private _updateComponentsForLanguage(): void {
            this._btnCancel.label               = Lang.getText(LangTextType.B0154);
            this._labelAvailableCoTitle.text    = `${Lang.getText(LangTextType.B0238)} (P${this._getOpenData().playerRule.playerIndex})`;
        }

        private async _initGroupCoTiers(): Promise<void> {
            const gameConfig = await Twns.Config.ConfigManager.getLatestGameConfig();
            for (const tier of gameConfig.getCoTiers()) {
                const renderer = new RendererForCoTier();
                renderer.setCoTier(tier);
                renderer.setState(CoTierState.AllAvailable);
                this._renderersForCoTiers.push(renderer);
                this._groupCoTiers.addChild(renderer);
            }

            const rendererForCustomCo = new RendererForCoTier();
            rendererForCustomCo.setIsCustomSwitch(true);
            rendererForCustomCo.setState(CoTierState.AllAvailable);
            this._renderersForCoTiers.push(rendererForCustomCo);
            this._groupCoTiers.addChild(rendererForCustomCo);

            this._updateGroupCoTiers();
        }

        private _clearGroupCoTiers(): void {
            this._groupCoTiers.removeChildren();
            this._renderersForCoTiers.length = 0;
        }

        private async _updateGroupCoTiers(): Promise<void> {
            const bannedCoIdSet = this._bannedCoIdSet;
            const gameConfig    = await Twns.Config.ConfigManager.getLatestGameConfig();
            for (const renderer of this._renderersForCoTiers) {
                const includedCoIdList = renderer.getIsCustomSwitch()
                    ? gameConfig.getEnabledCustomCoIdList()
                    : gameConfig.getEnabledCoIdListInTier(renderer.getCoTier());

                if (includedCoIdList.every(coId => !bannedCoIdSet.has(coId))) {
                    renderer.setState(CoTierState.AllAvailable);
                } else if (includedCoIdList.every(coId => bannedCoIdSet.has(coId))) {
                    renderer.setState(CoTierState.Unavailable);
                } else {
                    renderer.setState(CoTierState.PartialAvailable);
                }
            }
        }

        private async _initGroupCoNames(): Promise<void> {
            const gameConfig = await Twns.Config.ConfigManager.getLatestGameConfig();
            for (const cfg of gameConfig.getEnabledCoArray()) {
                const renderer = new RendererForCoName();
                renderer.setCoId(cfg.coId);
                renderer.setIsSelected(true);

                this._renderersForCoNames.push(renderer);
                this._groupCoNames.addChild(renderer);
            }

            this._updateGroupCoNames();
        }

        private _clearGroupCoNames(): void {
            this._groupCoNames.removeChildren();
            this._renderersForCoNames.length = 0;
        }

        private _updateGroupCoNames(): void {
            const bannedCoIdSet = this._bannedCoIdSet;
            for (const renderer of this._renderersForCoNames) {
                renderer.setIsSelected(!bannedCoIdSet.has(renderer.getCoId()));
            }
        }
    }

    // eslint-disable-next-line no-shadow
    enum CoTierState {
        AllAvailable,
        PartialAvailable,
        Unavailable,
    }

    class RendererForCoTier extends TwnsUiComponent.UiComponent {
        private readonly _imgSelected!  : TwnsUiImage.UiImage;
        private readonly _labelName!    : TwnsUiLabel.UiLabel;

        private _tier?          : number;
        private _isCustomSwitch = false;
        private _state?         : CoTierState;

        public constructor() {
            super();

            this.skinName = "resource/skins/component/checkBox/CheckBox1.exml";
        }

        public setCoTier(tier: number): void {
            this._tier              = tier;
            this._labelName.text    = `Tier ${tier}`;
        }
        public getCoTier(): number {
            return Helpers.getExisted(this._tier);
        }

        public setIsCustomSwitch(isCustomSwitch: boolean): void {
            this._isCustomSwitch    = isCustomSwitch;
            this._labelName.text    = "Custom";
        }
        public getIsCustomSwitch(): boolean {
            return this._isCustomSwitch;
        }

        public setState(state: CoTierState): void {
            this._state = state;
            if (state === CoTierState.AllAvailable) {
                this._labelName.textColor = 0x00FF00;
            } else if (state === CoTierState.PartialAvailable) {
                this._labelName.textColor = 0xFFFF00;
            } else {
                this._labelName.textColor = 0xFF0000;
            }
            Helpers.changeColor(this._imgSelected, state === CoTierState.AllAvailable ? Types.ColorType.Origin : Types.ColorType.Gray);
        }
        public getState(): CoTierState {
            return Helpers.getExisted(this._state);
        }
    }

    class RendererForCoName extends TwnsUiComponent.UiComponent {
        private readonly _imgSelected!  : TwnsUiImage.UiImage;
        private readonly _labelName!    : TwnsUiLabel.UiLabel;

        private _coId?          : number;
        private _isSelected?    : boolean;

        public constructor() {
            super();

            this.skinName = "resource/skins/component/checkBox/CheckBox1.exml";
        }

        public async setCoId(coId: number): Promise<void> {
            this._coId = coId;

            this._labelName.text = `${(await Twns.Config.ConfigManager.getLatestGameConfig()).getCoBasicCfg(coId)?.name}`;
        }
        public getCoId(): number {
            return Helpers.getExisted(this._coId);
        }

        public setIsSelected(isSelected: boolean): void {
            this._isSelected            = isSelected;
            this._labelName.textColor   = isSelected ? 0x00ff00 : 0xff0000;
            Helpers.changeColor(this._imgSelected, isSelected ? Types.ColorType.Origin : Types.ColorType.Gray);
        }
        public getIsSelected(): boolean {
            return Helpers.getExisted(this._isSelected);
        }
    }
}

// export default TwnsMmWarRuleAvailableCoPanel;
