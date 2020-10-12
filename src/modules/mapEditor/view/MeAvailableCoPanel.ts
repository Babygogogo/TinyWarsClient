
namespace TinyWars.MapEditor {
    import Types            = Utility.Types;
    import Helpers          = Utility.Helpers;
    import Lang             = Utility.Lang;
    import Notify           = Utility.Notify;
    import ConfigManager    = Utility.ConfigManager;
    import ProtoTypes       = Utility.ProtoTypes;
    import BwSettingsHelper = BaseWar.BwSettingsHelper;
    import WarRule          = ProtoTypes.WarRule;

    type OpenParam = {
        playerRule      : WarRule.IDataForPlayerRule;
        warRule         : WarRule.IWarRule;
        isReviewing     : boolean;
        callbackOnClose : () => void;
    }

    export class MeAvailableCoPanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Hud2;
        protected readonly _IS_EXCLUSIVE = true;

        private static _instance: MeAvailableCoPanel;

        private _labelAvailableCoTitle  : TinyWars.GameUi.UiLabel;
        private _groupCoTiers           : eui.Group;
        private _groupCoNames           : eui.Group;
        private _btnCancel              : TinyWars.GameUi.UiButton;
        private _btnConfirm             : TinyWars.GameUi.UiButton;

        private _renderersForCoTiers    : RendererForCoTier[] = [];
        private _renderersForCoNames    : RendererForCoName[] = [];

        private _openParam              : OpenParam;
        private _availableCoIdSet       = new Set<number>();

        public static show(openParam: OpenParam): void {
            if (!MeAvailableCoPanel._instance) {
                MeAvailableCoPanel._instance = new MeAvailableCoPanel();
            }
            MeAvailableCoPanel._instance._openParam = openParam;
            MeAvailableCoPanel._instance.open();
        }

        public static hide(): void {
            if (MeAvailableCoPanel._instance) {
                MeAvailableCoPanel._instance.close();
            }
        }

        public constructor() {
            super();

            this.skinName = "resource/skins/mapEditor/MeAvailableCoPanel.exml";
            this._setAutoAdjustHeightEnabled();
            this._setTouchMaskEnabled();
        }

        protected _onFirstOpened(): void {
            this._uiListeners = [
                { ui: this._btnCancel,  callback: this._onTouchedBtnCancel },
                { ui: this._btnConfirm, callback: this._onTouchedBtnConfirm },
            ];
            this._notifyListeners = [
                { type: Notify.Type.LanguageChanged, callback: this._onNotifyLanguageChanged },
            ];
        }

        protected _onOpened(): void {
            const availableCoIdSet  = this._availableCoIdSet;
            const openParam         = this._openParam;
            availableCoIdSet.clear();
            for (const coId of openParam.playerRule.availableCoIdList) {
                availableCoIdSet.add(coId);
            }

            this._btnConfirm.visible = !openParam.isReviewing;
            this._updateComponentsForLanguage();
            this._initGroupCoTiers();
            this._initGroupCoNames();
        }

        protected _onClosed(): void {
            this._clearGroupCoTiers();
            this._clearGroupCoNames();
            this._openParam.callbackOnClose();
            this._openParam = null;
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

        private _onTouchedBtnConfirm(e: egret.TouchEvent): void {
            const availableCoIdSet = this._availableCoIdSet;
            if (!availableCoIdSet.size) {
                Common.CommonAlertPanel.show({
                    title   : Lang.getText(Lang.Type.B0088),
                    content : Lang.getText(Lang.Type.A0130),
                });
            } else {
                const openParam = this._openParam;
                BwSettingsHelper.setAvailableCoIdList(openParam.warRule, openParam.playerRule.playerIndex, availableCoIdSet);
                this.close();
            }
        }

        private _onTouchedCoTierRenderer(e: egret.TouchEvent): void {
            if (!this._openParam.isReviewing) {
                const renderer          = e.currentTarget as RendererForCoTier;
                const availableCoIdSet  = this._availableCoIdSet;
                const coIdList          = renderer.getIsCustomSwitch()
                    ? ConfigManager.getAvailableCustomCoIdList(ConfigManager.getLatestConfigVersion())
                    : ConfigManager.getAvailableCoIdListInTier(ConfigManager.getLatestConfigVersion(), renderer.getCoTier());

                if (renderer.getState() === CoTierState.Unavailable) {
                    for (const coId of coIdList) {
                        availableCoIdSet.add(coId);
                    }
                    this._updateGroupCoTiers();
                    this._updateGroupCoNames();

                } else {
                    for (const coId of coIdList) {
                        availableCoIdSet.delete(coId);
                    }
                    this._updateGroupCoTiers();
                    this._updateGroupCoNames();
                }
            }
        }

        private _onTouchedCoNameRenderer(e: egret.TouchEvent): void {
            if (!this._openParam.isReviewing) {
                const renderer          = e.currentTarget as RendererForCoName;
                const coId              = renderer.getCoId();
                const availableCoIdSet  = this._availableCoIdSet;

                if (!renderer.getIsSelected()) {
                    availableCoIdSet.add(coId);
                    this._updateGroupCoTiers();
                    this._updateGroupCoNames();

                } else {
                    availableCoIdSet.delete(coId);
                    this._updateGroupCoTiers();
                    this._updateGroupCoNames();
                }
            }
        }

        ////////////////////////////////////////////////////////////////////////////////
        // View functions.
        ////////////////////////////////////////////////////////////////////////////////
        private _updateComponentsForLanguage(): void {
            this._btnCancel.label               = Lang.getText(Lang.Type.B0154);
            this._btnConfirm.label              = Lang.getText(Lang.Type.B0026);
            this._labelAvailableCoTitle.text    = `${Lang.getText(Lang.Type.B0238)} (P${this._openParam.playerRule.playerIndex})`;
        }

        private _initGroupCoTiers(): void {
            for (const tier of ConfigManager.getCoTiers(ConfigManager.getLatestConfigVersion())) {
                const renderer = new RendererForCoTier();
                renderer.setCoTier(tier);
                renderer.setState(CoTierState.AllAvailable);
                renderer.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onTouchedCoTierRenderer, this);
                this._renderersForCoTiers.push(renderer);
                this._groupCoTiers.addChild(renderer);
            }

            const rendererForCustomCo = new RendererForCoTier();
            rendererForCustomCo.setIsCustomSwitch(true);
            rendererForCustomCo.setState(CoTierState.AllAvailable);
            rendererForCustomCo.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onTouchedCoTierRenderer, this);
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
            const configVersion     = ConfigManager.getLatestConfigVersion();
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
            for (const cfg of ConfigManager.getAvailableCoList(ConfigManager.getLatestConfigVersion())) {
                const renderer = new RendererForCoName();
                renderer.setCoId(cfg.coId);
                renderer.setIsSelected(true);

                renderer.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onTouchedCoNameRenderer, this);
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

    class RendererForCoTier extends eui.ItemRenderer {
        private _imgSelected: GameUi.UiImage;
        private _labelName  : GameUi.UiLabel;

        private _tier           : number;
        private _isCustomSwitch = false;
        private _state          : CoTierState;

        public constructor() {
            super();

            this.skinName = "resource/skins/component/CheckBox1.exml";
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

    class RendererForCoName extends eui.ItemRenderer {
        private _imgSelected: GameUi.UiImage;
        private _labelName  : GameUi.UiLabel;

        private _coId           : number;
        private _isSelected     : boolean;

        public constructor() {
            super();

            this.skinName = "resource/skins/component/CheckBox1.exml";
        }

        public setCoId(coId: number): void {
            this._coId = coId;

            const cfg               = ConfigManager.getCoBasicCfg(ConfigManager.getLatestConfigVersion(), coId);
            this._labelName.text    = `${cfg.name} (T${cfg.tier})`;
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
