
import TwnsCommonAlertPanel from "../../common/view/CommonAlertPanel";
import CommonConstants      from "../../tools/helpers/CommonConstants";
import CompatibilityHelpers from "../../tools/helpers/CompatibilityHelpers";
import ConfigManager        from "../../tools/helpers/ConfigManager";
import Helpers              from "../../tools/helpers/Helpers";
import Types                from "../../tools/helpers/Types";
import Lang                 from "../../tools/lang/Lang";
import TwnsLangTextType     from "../../tools/lang/LangTextType";
import Notify               from "../../tools/notify/Notify";
import TwnsNotifyType       from "../../tools/notify/NotifyType";
import ProtoTypes           from "../../tools/proto/ProtoTypes";
import TwnsUiButton         from "../../tools/ui/UiButton";
import TwnsUiComponent      from "../../tools/ui/UiComponent";
import TwnsUiImage          from "../../tools/ui/UiImage";
import TwnsUiLabel          from "../../tools/ui/UiLabel";
import TwnsUiPanel          from "../../tools/ui/UiPanel";
import WarRuleHelpers       from "../../tools/warHelpers/WarRuleHelpers";

namespace TwnsMeAvailableCoPanel {
    import NotifyType       = TwnsNotifyType.NotifyType;
    import WarRule          = ProtoTypes.WarRule;
    import LangTextType     = TwnsLangTextType.LangTextType;

    type OpenDataForMeAvailableCoPanel = {
        playerRule      : WarRule.IDataForPlayerRule;
        warRule         : WarRule.IWarRule;
        isReviewing     : boolean;
    };
    export class MeAvailableCoPanel extends TwnsUiPanel.UiPanel<OpenDataForMeAvailableCoPanel> {
        protected readonly _LAYER_TYPE   = Types.LayerType.Hud2;
        protected readonly _IS_EXCLUSIVE = false;

        private static _instance: MeAvailableCoPanel;

        private readonly _labelAvailableCoTitle!    : TwnsUiLabel.UiLabel;
        private readonly _groupCoTiers!             : eui.Group;
        private readonly _groupCoNames!             : eui.Group;
        private readonly _btnCancel!                : TwnsUiButton.UiButton;
        private readonly _btnConfirm!               : TwnsUiButton.UiButton;

        private _renderersForCoTiers    : RendererForCoTier[] = [];
        private _renderersForCoNames    : RendererForCoName[] = [];

        private _bannedCoIdSet          = new Set<number>();

        public static show(openData: OpenDataForMeAvailableCoPanel): void {
            if (!MeAvailableCoPanel._instance) {
                MeAvailableCoPanel._instance = new MeAvailableCoPanel();
            }
            MeAvailableCoPanel._instance.open(openData);
        }

        public static async hide(): Promise<void> {
            if (MeAvailableCoPanel._instance) {
                await MeAvailableCoPanel._instance.close().catch(err => { CompatibilityHelpers.showError(err); throw err; });
            }
        }

        public constructor() {
            super();

            this.skinName = "resource/skins/mapEditor/MeAvailableCoPanel.exml";
            this._setIsTouchMaskEnabled();
        }

        protected _onOpened(): void {
            this._setUiListenerArray([
                { ui: this._btnCancel,  callback: this._onTouchedBtnCancel },
                { ui: this._btnConfirm, callback: this._onTouchedBtnConfirm },
            ]);
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged, callback: this._onNotifyLanguageChanged },
            ]);

            const bannedCoIdSet = this._bannedCoIdSet;
            const openData      = this._getOpenData();
            bannedCoIdSet.clear();
            for (const coId of openData.playerRule.bannedCoIdArray || []) {
                bannedCoIdSet.add(coId);
            }

            this._btnConfirm.visible = !openData.isReviewing;
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

        private _onTouchedBtnCancel(): void {
            this.close();
        }

        private _onTouchedBtnConfirm(): void {
            const bannedCoIdSet = this._bannedCoIdSet;
            if (bannedCoIdSet.has(CommonConstants.CoEmptyId)) {
                TwnsCommonAlertPanel.CommonAlertPanel.show({
                    title   : Lang.getText(LangTextType.B0088),
                    content : Lang.getText(LangTextType.A0130),
                });
            } else {
                const openData = this._getOpenData();
                WarRuleHelpers.setBannedCoIdArray(openData.warRule, Helpers.getExisted(openData.playerRule.playerIndex), bannedCoIdSet);
                Notify.dispatch(NotifyType.MeBannedCoIdArrayChanged);
                this.close();
            }
        }

        private _onTouchedCoTierRenderer(e: egret.TouchEvent): void {
            if (!this._getOpenData().isReviewing) {
                const renderer      = e.currentTarget as RendererForCoTier;
                const bannedCoIdSet = this._bannedCoIdSet;
                const configVersion = Helpers.getExisted(ConfigManager.getLatestConfigVersion());
                const coIdList      = renderer.getIsCustomSwitch()
                    ? ConfigManager.getEnabledCustomCoIdList(configVersion)
                    : ConfigManager.getEnabledCoIdListInTier(configVersion, Helpers.getExisted(renderer.getCoTier()));

                if (renderer.getState() === CoTierState.Unavailable) {
                    for (const coId of coIdList) {
                        bannedCoIdSet.delete(coId);
                    }
                    this._updateGroupCoTiers();
                    this._updateGroupCoNames();

                } else {
                    for (const coId of coIdList) {
                        bannedCoIdSet.add(coId);
                    }
                    this._updateGroupCoTiers();
                    this._updateGroupCoNames();
                }
            }
        }

        private _onTouchedCoNameRenderer(e: egret.TouchEvent): void {
            if (!this._getOpenData().isReviewing) {
                const renderer      = e.currentTarget as RendererForCoName;
                const coId          = Helpers.getExisted(renderer.getCoId());
                const bannedCoIdSet = this._bannedCoIdSet;

                if (!renderer.getIsSelected()) {
                    bannedCoIdSet.delete(coId);
                    this._updateGroupCoTiers();
                    this._updateGroupCoNames();

                } else {
                    bannedCoIdSet.add(coId);
                    this._updateGroupCoTiers();
                    this._updateGroupCoNames();
                }
            }
        }

        ////////////////////////////////////////////////////////////////////////////////
        // View functions.
        ////////////////////////////////////////////////////////////////////////////////
        private _updateComponentsForLanguage(): void {
            this._btnCancel.label               = Lang.getText(LangTextType.B0154);
            this._btnConfirm.label              = Lang.getText(LangTextType.B0026);
            this._labelAvailableCoTitle.text    = `${Lang.getText(LangTextType.B0238)} (P${this._getOpenData().playerRule.playerIndex})`;
        }

        private _initGroupCoTiers(): void {
            for (const tier of ConfigManager.getCoTiers(Helpers.getExisted(ConfigManager.getLatestConfigVersion()))) {
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
            const bannedCoIdSet = this._bannedCoIdSet;
            const configVersion = Helpers.getExisted(ConfigManager.getLatestConfigVersion());
            for (const renderer of this._renderersForCoTiers) {
                const includedCoIdList = renderer.getIsCustomSwitch()
                    ? ConfigManager.getEnabledCustomCoIdList(configVersion)
                    : ConfigManager.getEnabledCoIdListInTier(configVersion, Helpers.getExisted(renderer.getCoTier()));

                if (includedCoIdList.every(coId => bannedCoIdSet.has(coId))) {
                    renderer.setState(CoTierState.Unavailable);
                } else if (includedCoIdList.every(coId => !bannedCoIdSet.has(coId))) {
                    renderer.setState(CoTierState.AllAvailable);
                } else {
                    renderer.setState(CoTierState.PartialAvailable);
                }
            }
        }

        private _initGroupCoNames(): void {
            for (const cfg of ConfigManager.getEnabledCoArray(Helpers.getExisted(ConfigManager.getLatestConfigVersion()))) {
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
            const bannedCoIdSet = this._bannedCoIdSet;
            for (const renderer of this._renderersForCoNames) {
                renderer.setIsSelected(!bannedCoIdSet.has(Helpers.getExisted(renderer.getCoId())));
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

        private _tier           : number | null = null;
        private _isCustomSwitch = false;
        private _state          : CoTierState | null = null;

        public constructor() {
            super();

            this.skinName = "resource/skins/component/checkBox/CheckBox1.exml";
        }

        public setCoTier(tier: number): void {
            this._tier              = tier;
            this._labelName.text    = `Tier ${tier}`;
        }
        public getCoTier(): number | null {
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
        public getState(): CoTierState | null {
            return this._state;
        }
    }

    class RendererForCoName extends TwnsUiComponent.UiComponent {
        private readonly _imgSelected!  : TwnsUiImage.UiImage;
        private readonly _labelName!    : TwnsUiLabel.UiLabel;

        private _coId           : number | null = null;
        private _isSelected     : boolean | null = null;

        public constructor() {
            super();

            this.skinName = "resource/skins/component/checkBox/CheckBox1.exml";
        }

        public setCoId(coId: number): void {
            this._coId = coId;

            const cfg               = ConfigManager.getCoBasicCfg(Helpers.getExisted(ConfigManager.getLatestConfigVersion()), coId);
            this._labelName.text    = `${cfg.name} (T${cfg.tier})`;
        }
        public getCoId(): number | null {
            return this._coId;
        }

        public setIsSelected(isSelected: boolean): void {
            this._isSelected            = isSelected;
            this._labelName.textColor   = isSelected ? 0x00ff00 : 0xff0000;
            Helpers.changeColor(this._imgSelected, isSelected ? Types.ColorType.Origin : Types.ColorType.Gray);
        }
        public getIsSelected(): boolean | null {
            return this._isSelected;
        }
    }
}

export default TwnsMeAvailableCoPanel;
