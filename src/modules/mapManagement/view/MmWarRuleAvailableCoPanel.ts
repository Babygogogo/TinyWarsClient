
namespace TinyWars.MapManagement {
    import Types            = Utility.Types;
    import Helpers          = Utility.Helpers;
    import Lang             = Utility.Lang;
    import Notify           = Utility.Notify;
    import ConfigManager    = Utility.ConfigManager;
    import ProtoTypes       = Utility.ProtoTypes;
    import WarRule          = ProtoTypes.WarRule;

    type OpenDataForMmWarRuleAvailableCoPanel = {
        playerRule      : WarRule.IDataForPlayerRule;
        warRule         : WarRule.IWarRule;
    }

    export class MmWarRuleAvailableCoPanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Hud2;
        protected readonly _IS_EXCLUSIVE = true;

        private static _instance: MmWarRuleAvailableCoPanel;

        private _labelAvailableCoTitle  : TinyWars.GameUi.UiLabel;
        private _groupCoTiers           : eui.Group;
        private _groupCoNames           : eui.Group;
        private _btnCancel              : TinyWars.GameUi.UiButton;

        private _renderersForCoTiers    : RendererForCoTier[] = [];
        private _renderersForCoNames    : RendererForCoName[] = [];

        private _availableCoIdSet       = new Set<number>();

        public static show(openData: OpenDataForMmWarRuleAvailableCoPanel): void {
            if (!MmWarRuleAvailableCoPanel._instance) {
                MmWarRuleAvailableCoPanel._instance = new MmWarRuleAvailableCoPanel();
            }
            MmWarRuleAvailableCoPanel._instance.open(openData);
        }

        public static async hide(): Promise<void> {
            if (MmWarRuleAvailableCoPanel._instance) {
                await MmWarRuleAvailableCoPanel._instance.close();
            }
        }

        public constructor() {
            super();

            this.skinName = "resource/skins/mapManagement/MmWarRuleAvailableCoPanel.exml";
            this._setIsTouchMaskEnabled();
        }

        protected _onOpened(): void {
            this._setUiListenerArray([
                { ui: this._btnCancel,  callback: this._onTouchedBtnCancel },
            ]);
            this._setNotifyListenerArray([
                { type: Notify.Type.LanguageChanged, callback: this._onNotifyLanguageChanged },
            ]);

            const availableCoIdSet  = this._availableCoIdSet;
            const openData          = this._getOpenData<OpenDataForMmWarRuleAvailableCoPanel>();
            availableCoIdSet.clear();
            for (const coId of openData.playerRule.availableCoIdArray) {
                availableCoIdSet.add(coId);
            }

            this._updateComponentsForLanguage();
            this._initGroupCoTiers();
            this._initGroupCoNames();
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

        private _onTouchedBtnCancel(e: egret.TouchEvent): void {
            this.close();
        }

        ////////////////////////////////////////////////////////////////////////////////
        // View functions.
        ////////////////////////////////////////////////////////////////////////////////
        private _updateComponentsForLanguage(): void {
            this._btnCancel.label               = Lang.getText(Lang.Type.B0154);
            this._labelAvailableCoTitle.text    = `${Lang.getText(Lang.Type.B0238)} (P${this._getOpenData<OpenDataForMmWarRuleAvailableCoPanel>().playerRule.playerIndex})`;
        }

        private _initGroupCoTiers(): void {
            for (const tier of ConfigManager.getCoTiers(ConfigManager.getLatestFormalVersion())) {
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

        private _updateGroupCoTiers(): void {
            const availableCoIdSet  = this._availableCoIdSet;
            const configVersion     = ConfigManager.getLatestFormalVersion();
            for (const renderer of this._renderersForCoTiers) {
                const includedCoIdList = renderer.getIsCustomSwitch()
                    ? ConfigManager.getAvailableCustomCoIdList(configVersion)
                    : ConfigManager.getAvailableCoIdListInTier(configVersion, renderer.getCoTier());

                if (includedCoIdList.every(coId => availableCoIdSet.has(coId))) {
                    renderer.setState(CoTierState.AllAvailable);
                } else if (includedCoIdList.every(coId => !availableCoIdSet.has(coId))) {
                    renderer.setState(CoTierState.Unavailable);
                } else {
                    renderer.setState(CoTierState.PartialAvailable);
                }
            }
        }

        private _initGroupCoNames(): void {
            for (const cfg of ConfigManager.getAvailableCoArray(ConfigManager.getLatestFormalVersion())) {
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
            const availableCoIdSet = this._availableCoIdSet;
            for (const renderer of this._renderersForCoNames) {
                renderer.setIsSelected(availableCoIdSet.has(renderer.getCoId()));
            }
        }
    }

    const enum CoTierState {
        AllAvailable,
        PartialAvailable,
        Unavailable,
    }

    class RendererForCoTier extends GameUi.UiComponent {
        private _imgSelected: GameUi.UiImage;
        private _labelName  : GameUi.UiLabel;

        private _tier           : number;
        private _isCustomSwitch = false;
        private _state          : CoTierState;

        public constructor() {
            super();

            this.skinName = "resource/skins/component/checkBox/CheckBox1.exml";
        }

        public setCoTier(tier: number): void {
            this._tier              = tier;
            this._labelName.text    = `Tier ${tier}`;
        }
        public getCoTier(): number {
            return this._tier;
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
            return this._state;
        }
    }

    class RendererForCoName extends GameUi.UiComponent {
        private _imgSelected: GameUi.UiImage;
        private _labelName  : GameUi.UiLabel;

        private _coId           : number;
        private _isSelected     : boolean;

        public constructor() {
            super();

            this.skinName = "resource/skins/component/checkBox/CheckBox1.exml";
        }

        public setCoId(coId: number): void {
            this._coId = coId;

            this._labelName.text = `${ConfigManager.getCoBasicCfg(ConfigManager.getLatestFormalVersion(), coId).name}`;
        }
        public getCoId(): number {
            return this._coId;
        }

        public setIsSelected(isSelected: boolean): void {
            this._isSelected            = isSelected;
            this._labelName.textColor   = isSelected ? 0x00ff00 : 0xff0000;
            Helpers.changeColor(this._imgSelected, isSelected ? Types.ColorType.Origin : Types.ColorType.Gray);
        }
        public getIsSelected(): boolean {
            return this._isSelected;
        }
    }
}
