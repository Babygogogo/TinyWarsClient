
import { UiImage }                      from "../../../utility/ui/UiImage";
import { UiPanel }                      from "../../../utility/ui/UiPanel";
import { UiButton }                     from "../../../utility/ui/UiButton";
import { UiComponent }                  from "../../../utility/ui/UiComponent";
import { UiLabel }                      from "../../../utility/ui/UiLabel";
import { UiCoInfo }                     from "../../../utility/ui/UiCoInfo";
import { CommonConfirmPanel }           from "../../common/view/CommonConfirmPanel";
import { TwnsCommonAlertPanel }             from "../../common/view/CommonAlertPanel";
import { CommonConstants }              from "../../../utility/CommonConstants";
import { ConfigManager }                from "../../../utility/ConfigManager";
import { Helpers }                      from "../../../utility/Helpers";
import { Lang }                         from "../../../utility/lang/Lang";
import { TwnsLangTextType } from "../../../utility/lang/LangTextType";
import { Notify }                       from "../../../utility/notify/Notify";
import { TwnsNotifyType } from "../../../utility/notify/NotifyType";
import { Types }                        from "../../../utility/Types";
import { McrCreateModel }               from "../model/McrCreateModel";
import LangTextType         = TwnsLangTextType.LangTextType;
import NotifyType       = TwnsNotifyType.NotifyType;

type OpenDataForMcrCreateBanCoPanel = {
    playerIndex : number;
};
export class McrCreateBanCoPanel extends UiPanel<OpenDataForMcrCreateBanCoPanel> {
    protected readonly _LAYER_TYPE   = Types.LayerType.Hud2;
    protected readonly _IS_EXCLUSIVE = true;

    private static _instance: McrCreateBanCoPanel;

    private readonly _imgMask                   : UiImage;
    private readonly _group                     : eui.Group;
    private readonly _labelAvailableCoTitle     : UiLabel;
    // private readonly _groupCoTiers              : eui.Group;
    private readonly _groupCoNames              : eui.Group;
    private readonly _btnCancel                 : UiButton;
    private readonly _btnConfirm                : UiButton;
    private readonly _uiCoInfo                  : UiCoInfo;

    // private _renderersForCoTiers    : RendererForCoTier[] = [];
    private _renderersForCoNames    : RendererForCoName[] = [];

    private _playerIndex            : number;
    private _bannedCoIdSet          = new Set<number>();
    private _previewCoId            : number;

    public static show(openData: OpenDataForMcrCreateBanCoPanel): void {
        if (!McrCreateBanCoPanel._instance) {
            McrCreateBanCoPanel._instance = new McrCreateBanCoPanel();
        }
        McrCreateBanCoPanel._instance.open(openData);
    }

    public static async hide(): Promise<void> {
        if (McrCreateBanCoPanel._instance) {
            await McrCreateBanCoPanel._instance.close();
        }
    }

    public constructor() {
        super();

        this._setIsTouchMaskEnabled();
        this._setIsCloseOnTouchedMask();
        this.skinName = "resource/skins/multiCustomRoom/McrCreateBanCoPanel.exml";
    }

    protected _onOpened(): void {
        this._setUiListenerArray([
            { ui: this._btnCancel,  callback: this._onTouchedBtnCancel },
            { ui: this._btnConfirm, callback: this._onTouchedBtnConfirm },
        ]);
        this._setNotifyListenerArray([
            { type: NotifyType.LanguageChanged, callback: this._onNotifyLanguageChanged },
        ]);

        this._showOpenAnimation();

        const playerIndex = this._getOpenData().playerIndex;
        this._playerIndex = playerIndex;

        const bannedCoIdSet = this._bannedCoIdSet;
        bannedCoIdSet.clear();
        for (const coId of McrCreateModel.getBannedCoIdArray(playerIndex) || []) {
            bannedCoIdSet.add(coId);
        }

        this._updateComponentsForLanguage();
        // this._initGroupCoTiers();
        this._initGroupCoNames();
        this._initComponentsForPreviewCo();
    }

    protected async _onClosed(): Promise<void> {
        await this._showCloseAnimation();

        // this._clearGroupCoTiers();
        this._clearGroupCoNames();
    }

    private _setPreviewCoId(coId: number): void {
        if (this._getPreviewCoId() !== coId) {
            this._previewCoId = coId;
            this._updateComponentsForPreviewCoId();
        }
    }
    private _getPreviewCoId(): number {
        return this._previewCoId;
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
            TwnsCommonAlertPanel.CommonAlertPanel.show({
                title   : Lang.getText(LangTextType.B0088),
                content : Lang.getText(LangTextType.A0130),
            });
        } else {
            const playerIndex   = this._playerIndex;
            const callback      = () => {
                McrCreateModel.setBannedCoIdArray(playerIndex, bannedCoIdSet);
                Notify.dispatch(NotifyType.McrCreateBannedCoIdArrayChanged);
                this.close();
            };
            if ((playerIndex !== McrCreateModel.getSelfPlayerIndex()) ||
                (!bannedCoIdSet.has(McrCreateModel.getSelfCoId()))
            ) {
                callback();
            } else {
                CommonConfirmPanel.show({
                    content : Lang.getText(LangTextType.A0057),
                    callback: () => {
                        McrCreateModel.setSelfCoId(CommonConstants.CoEmptyId);
                        callback();
                    },
                });
            }
        }
    }

    // private _onTouchedCoTierRenderer(e: egret.TouchEvent): void {
    //     const renderer          = e.currentTarget as RendererForCoTier;
    //     const availableCoIdSet  = this._availableCoIdSet;
    //     const coIdList          = renderer.getIsCustomSwitch()
    //         ? ConfigManager.getAvailableCustomCoIdList(ConfigManager.getLatestFormalVersion())
    //         : ConfigManager.getAvailableCoIdListInTier(ConfigManager.getLatestFormalVersion(), renderer.getCoTier());

    //     if (renderer.getState() === CoTierState.Unavailable) {
    //         for (const coId of coIdList) {
    //             availableCoIdSet.add(coId);
    //         }
    //         this._updateGroupCoTiers();
    //         this._updateGroupCoNames();

    //     } else {
    //         const callback = () => {
    //             for (const coId of coIdList) {
    //                 availableCoIdSet.delete(coId);
    //             }
    //             this._updateGroupCoTiers();
    //             this._updateGroupCoNames();
    //         }

    //         if ((this._playerIndex !== McrModel.Create.getSelfPlayerIndex()) ||
    //             (coIdList.indexOf(McrModel.Create.getSelfCoId()) < 0)
    //         ) {
    //             callback();
    //         } else {
    //             ConfirmPanel.show({
    //                 content : Lang.getText(Lang.Type.A0057),
    //                 callback,
    //             });
    //         }
    //     }
    // }

    private _onTouchedCoNameRenderer(e: egret.TouchEvent): void {
        const renderer      = e.currentTarget as RendererForCoName;
        const coId          = renderer.getCoId();
        const bannedCoIdSet = this._bannedCoIdSet;
        this._setPreviewCoId(coId);

        if (!renderer.getIsSelected()) {
            bannedCoIdSet.delete(coId);
            // this._updateGroupCoTiers();
            this._updateGroupCoNames();

        } else {
            if (coId === CommonConstants.CoEmptyId) {
                TwnsCommonAlertPanel.CommonAlertPanel.show({
                    title   : Lang.getText(LangTextType.B0088),
                    content : Lang.getText(LangTextType.A0130),
                });
                return;
            }

            const callback = () => {
                bannedCoIdSet.add(coId);
                // this._updateGroupCoTiers();
                this._updateGroupCoNames();
            };

            if ((this._playerIndex !== McrCreateModel.getSelfPlayerIndex()) ||
                (coId !== McrCreateModel.getSelfCoId())
            ) {
                callback();
            } else {
                CommonConfirmPanel.show({
                    content : Lang.getText(LangTextType.A0057),
                    callback,
                });
            }
        }
    }

    ////////////////////////////////////////////////////////////////////////////////
    // View functions.
    ////////////////////////////////////////////////////////////////////////////////
    private _updateComponentsForLanguage(): void {
        this._btnCancel.label               = Lang.getText(LangTextType.B0154);
        this._btnConfirm.label              = Lang.getText(LangTextType.B0026);
        this._labelAvailableCoTitle.text    = `${Lang.getText(LangTextType.B0238)} (P${this._playerIndex})`;

        this._updateComponentsForPreviewCoId();
    }

    // private _initGroupCoTiers(): void {
    //     for (const tier of ConfigManager.getCoTiers(ConfigManager.getLatestFormalVersion())) {
    //         const renderer = new RendererForCoTier();
    //         renderer.setCoTier(tier);
    //         renderer.setState(CoTierState.AllAvailable);
    //         renderer.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onTouchedCoTierRenderer, this);
    //         this._renderersForCoTiers.push(renderer);
    //         this._groupCoTiers.addChild(renderer);
    //     }

    //     const rendererForCustomCo = new RendererForCoTier();
    //     rendererForCustomCo.setIsCustomSwitch(true);
    //     rendererForCustomCo.setState(CoTierState.AllAvailable);
    //     rendererForCustomCo.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onTouchedCoTierRenderer, this);
    //     this._renderersForCoTiers.push(rendererForCustomCo);
    //     this._groupCoTiers.addChild(rendererForCustomCo);

    //     this._updateGroupCoTiers();
    // }

    // private _clearGroupCoTiers(): void {
    //     this._groupCoTiers.removeChildren();
    //     this._renderersForCoTiers.length = 0;
    // }

    // private _updateGroupCoTiers(): void {
    //     const availableCoIdSet  = this._availableCoIdSet;
    //     const configVersion     = McrModel.Create.getData().settingsForCommon.configVersion;
    //     for (const renderer of this._renderersForCoTiers) {
    //         const includedCoIdList = renderer.getIsCustomSwitch()
    //             ? ConfigManager.getAvailableCustomCoIdList(configVersion)
    //             : ConfigManager.getAvailableCoIdListInTier(configVersion, renderer.getCoTier());

    //         if (includedCoIdList.every(coId => availableCoIdSet.has(coId))) {
    //             renderer.setState(CoTierState.AllAvailable);
    //         } else if (includedCoIdList.every(coId => !availableCoIdSet.has(coId))) {
    //             renderer.setState(CoTierState.Unavailable);
    //         } else {
    //             renderer.setState(CoTierState.PartialAvailable);
    //         }
    //     }
    // }

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

    private _initComponentsForPreviewCo(): void {
        this._setPreviewCoId(CommonConstants.CoEmptyId);
    }

    private _updateComponentsForPreviewCoId(): void {
        const coId = this._previewCoId;
        if (coId == null) {
            return;
        }

        this._uiCoInfo.setCoData({
            configVersion   : ConfigManager.getLatestFormalVersion(),
            coId,
        });
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

// const enum CoTierState {
//     AllAvailable,
//     PartialAvailable,
//     Unavailable,
// }
// class RendererForCoTier extends UiComponent {
//     private _imgSelected: UiImage;
//     private _labelName  : UiLabel;

//     private _tier           : number;
//     private _isCustomSwitch = false;
//     private _state          : CoTierState;

//     public constructor() {
//         super();

//         this.skinName = "resource/skins/component/checkBox/CheckBox1.exml";
//     }

//     public setCoTier(tier: number): void {
//         this._tier              = tier;
//         this._labelName.text    = `Tier ${tier}`;
//     }
//     public getCoTier(): number {
//         return this._tier;
//     }

//     public setIsCustomSwitch(isCustomSwitch: boolean): void {
//         this._isCustomSwitch    = isCustomSwitch;
//         this._labelName.text    = "Custom";
//     }
//     public getIsCustomSwitch(): boolean {
//         return this._isCustomSwitch;
//     }

//     public setState(state: CoTierState): void {
//         this._state = state;
//         if (state === CoTierState.AllAvailable) {
//             this._labelName.textColor = 0x00FF00;
//         } else if (state === CoTierState.PartialAvailable) {
//             this._labelName.textColor = 0xFFFF00;
//         } else {
//             this._labelName.textColor = 0xFF0000;
//         }
//         Helpers.changeColor(this._imgSelected, state === CoTierState.AllAvailable ? Types.ColorType.Origin : Types.ColorType.Gray);
//     }
//     public getState(): CoTierState {
//         return this._state;
//     }
// }

class RendererForCoName extends UiComponent {
    private readonly _imgUnselected : UiImage;
    private readonly _imgSelected   : UiImage;
    private readonly _labelName     : UiLabel;

    private _coId           : number;
    private _isSelected     : boolean;

    public constructor() {
        super();

        this.skinName = "resource/skins/component/checkBox/CheckBox001.exml";
    }

    protected _onOpened(): void {
        this._updateView();
    }

    public setCoId(coId: number): void {
        this._coId = coId;

        this._updateView();
    }
    public getCoId(): number {
        return this._coId;
    }

    public setIsSelected(isSelected: boolean): void {
        this._isSelected = isSelected;
        this._updateView();
    }
    public getIsSelected(): boolean {
        return this._isSelected;
    }

    private _updateView(): void {
        if (!this.getIsOpening()) {
            return;
        }

        const coCfg             = ConfigManager.getCoBasicCfg(ConfigManager.getLatestFormalVersion(), this._coId);
        this._labelName.text    = coCfg ? coCfg.name : null;

        const isSelected            = this._isSelected;
        this._imgSelected.visible   = isSelected;
        this._imgUnselected.visible = !isSelected;
    }
}
