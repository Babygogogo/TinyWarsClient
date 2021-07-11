
import { UiImage }                      from "../../../gameui/UiImage";
import { UiPanel }                      from "../../../gameui/UiPanel";
import { UiButton }                     from "../../../gameui/UiButton";
import { UiComponent }                  from "../../../gameui/UiComponent";
import { UiLabel }                      from "../../../gameui/UiLabel";
import { CommonAlertPanel }             from "../../common/view/CommonAlertPanel";
import * as CommonConstants             from "../../../utility/CommonConstants";
import * as ConfigManager               from "../../../utility/ConfigManager";
import * as Helpers                     from "../../../utility/Helpers";
import * as Lang                        from "../../../utility/Lang";
import * as Notify                      from "../../../utility/Notify";
import * as ProtoTypes                  from "../../../utility/ProtoTypes";
import * as Types                       from "../../../utility/Types";
import * as BwWarRuleHelper             from "../../baseWar/model/BwWarRuleHelper";
import WarRule                          = ProtoTypes.WarRule;

type OpenDataForMeAvailableCoPanel = {
    playerRule      : WarRule.IDataForPlayerRule;
    warRule         : WarRule.IWarRule;
    isReviewing     : boolean;
};
export class MeAvailableCoPanel extends UiPanel<OpenDataForMeAvailableCoPanel> {
    protected readonly _LAYER_TYPE   = Types.LayerType.Hud2;
    protected readonly _IS_EXCLUSIVE = false;

    private static _instance: MeAvailableCoPanel;

    private _labelAvailableCoTitle  : UiLabel;
    private _groupCoTiers           : eui.Group;
    private _groupCoNames           : eui.Group;
    private _btnCancel              : UiButton;
    private _btnConfirm             : UiButton;

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
            await MeAvailableCoPanel._instance.close();
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
            { type: Notify.Type.LanguageChanged, callback: this._onNotifyLanguageChanged },
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

    private _onTouchedBtnCancel(e: egret.TouchEvent): void {
        this.close();
    }

    private _onTouchedBtnConfirm(e: egret.TouchEvent): void {
        const bannedCoIdSet = this._bannedCoIdSet;
        if (bannedCoIdSet.has(CommonConstants.CoEmptyId)) {
            CommonAlertPanel.show({
                title   : Lang.getText(Lang.Type.B0088),
                content : Lang.getText(Lang.Type.A0130),
            });
        } else {
            const openData = this._getOpenData();
            BwWarRuleHelper.setBannedCoIdArray(openData.warRule, openData.playerRule.playerIndex, bannedCoIdSet);
            Notify.dispatch(Notify.Type.MeBannedCoIdArrayChanged);
            this.close();
        }
    }

    private _onTouchedCoTierRenderer(e: egret.TouchEvent): void {
        if (!this._getOpenData().isReviewing) {
            const renderer      = e.currentTarget as RendererForCoTier;
            const bannedCoIdSet = this._bannedCoIdSet;
            const coIdList      = renderer.getIsCustomSwitch()
                ? ConfigManager.getEnabledCustomCoIdList(ConfigManager.getLatestFormalVersion())
                : ConfigManager.getEnabledCoIdListInTier(ConfigManager.getLatestFormalVersion(), renderer.getCoTier());

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
            const coId          = renderer.getCoId();
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
        this._btnCancel.label               = Lang.getText(Lang.Type.B0154);
        this._btnConfirm.label              = Lang.getText(Lang.Type.B0026);
        this._labelAvailableCoTitle.text    = `${Lang.getText(Lang.Type.B0238)} (P${this._getOpenData().playerRule.playerIndex})`;
    }

    private _initGroupCoTiers(): void {
        for (const tier of ConfigManager.getCoTiers(ConfigManager.getLatestFormalVersion())) {
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
        const configVersion = ConfigManager.getLatestFormalVersion();
        for (const renderer of this._renderersForCoTiers) {
            const includedCoIdList = renderer.getIsCustomSwitch()
                ? ConfigManager.getEnabledCustomCoIdList(configVersion)
                : ConfigManager.getEnabledCoIdListInTier(configVersion, renderer.getCoTier());

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
        for (const cfg of ConfigManager.getEnabledCoArray(ConfigManager.getLatestFormalVersion())) {
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
            renderer.setIsSelected(!bannedCoIdSet.has(renderer.getCoId()));
        }
    }
}

// eslint-disable-next-line no-shadow
const enum CoTierState {
    AllAvailable,
    PartialAvailable,
    Unavailable,
}

class RendererForCoTier extends UiComponent {
    private _imgSelected: UiImage;
    private _labelName  : UiLabel;

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

class RendererForCoName extends UiComponent {
    private _imgSelected: UiImage;
    private _labelName  : UiLabel;

    private _coId           : number;
    private _isSelected     : boolean;

    public constructor() {
        super();

        this.skinName = "resource/skins/component/checkBox/CheckBox1.exml";
    }

    public setCoId(coId: number): void {
        this._coId = coId;

        const cfg               = ConfigManager.getCoBasicCfg(ConfigManager.getLatestFormalVersion(), coId);
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
