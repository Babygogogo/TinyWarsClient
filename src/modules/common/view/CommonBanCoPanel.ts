
import TwnsCommonAlertPanel     from "../../common/view/CommonAlertPanel";
import TwnsCommonConfirmPanel   from "../../common/view/CommonConfirmPanel";
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

namespace TwnsCommonBanCoPanel {
    import CommonConfirmPanel   = TwnsCommonConfirmPanel.CommonConfirmPanel;
    import LangTextType         = TwnsLangTextType.LangTextType;
    import NotifyType           = TwnsNotifyType.NotifyType;

    type OpenDataForCommonBanCoPanel = {
        playerIndex         : number;
        configVersion       : string;
        bannedCoIdArray     : number[];
        fullCoIdArray       : number[];
        maxBanCount         : number | null;
        selfCoId            : number | null;
        callbackOnConfirm   : ((bannedCoIdSet: Set<number>) => void) | null;
    };
    export class CommonBanCoPanel extends TwnsUiPanel.UiPanel<OpenDataForCommonBanCoPanel> {
        protected readonly _LAYER_TYPE   = Types.LayerType.Hud2;
        protected readonly _IS_EXCLUSIVE = true;

        private static _instance: CommonBanCoPanel;

        private readonly _imgMask!                  : TwnsUiImage.UiImage;
        private readonly _group!                    : eui.Group;
        private readonly _labelAvailableCoTitle!    : TwnsUiLabel.UiLabel;
        // private readonly _groupCoTiers              : eui.Group;
        private readonly _groupCoNames!             : eui.Group;
        private readonly _btnCancel!                : TwnsUiButton.UiButton;
        private readonly _btnConfirm!               : TwnsUiButton.UiButton;
        private readonly _btnClose!                 : TwnsUiButton.UiButton;
        private readonly _uiCoInfo!                 : TwnsUiCoInfo.UiCoInfo;

        // private _renderersForCoTiers    : RendererForCoTier[] = [];
        private _renderersForCoNames    : RendererForCoName[] = [];

        private _bannedCoIdSet          = new Set<number>();
        private _previewCoId            : number | null = null;

        public static show(openData: OpenDataForCommonBanCoPanel): void {
            if (!CommonBanCoPanel._instance) {
                CommonBanCoPanel._instance = new CommonBanCoPanel();
            }
            CommonBanCoPanel._instance.open(openData);
        }

        public static async hide(): Promise<void> {
            if (CommonBanCoPanel._instance) {
                await CommonBanCoPanel._instance.close();
            }
        }

        public constructor() {
            super();

            this._setIsTouchMaskEnabled();
            this._setIsCloseOnTouchedMask();
            this.skinName = "resource/skins/common/CommonBanCoPanel.exml";
        }

        protected _onOpened(): void {
            this._setUiListenerArray([
                { ui: this._btnCancel,  callback: this.close },
                { ui: this._btnConfirm, callback: this._onTouchedBtnConfirm },
                { ui: this._btnClose,   callback: this.close },
            ]);
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged, callback: this._onNotifyLanguageChanged },
            ]);

            this._showOpenAnimation();

            const openData      = this._getOpenData();
            const bannedCoIdSet = this._bannedCoIdSet;
            bannedCoIdSet.clear();
            for (const coId of openData.bannedCoIdArray) {
                bannedCoIdSet.add(coId);
            }

            this._updateComponentsForLanguage();
            // this._initGroupCoTiers();
            this._initButtons();
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
            const openData = this._getOpenData();
            const callback = openData.callbackOnConfirm;
            if (callback == null) {
                throw new Error(`CommonBanCoPanel._onTouchedBtnConfirm() empty callback.`);
            } else {
                const bannedCoIdSet = this._bannedCoIdSet;
                if (bannedCoIdSet.has(CommonConstants.CoEmptyId)) {
                    TwnsCommonAlertPanel.CommonAlertPanel.show({
                        title   : Lang.getText(LangTextType.B0088),
                        content : Lang.getText(LangTextType.A0130),
                    });
                    return;
                }

                const maxBanCount = openData.maxBanCount;
                if ((maxBanCount != null) && (bannedCoIdSet.size > maxBanCount)) {
                    TwnsCommonAlertPanel.CommonAlertPanel.show({
                        title   : Lang.getText(LangTextType.B0088),
                        content : Lang.getFormattedText(LangTextType.F0031, maxBanCount),
                    });
                    return;
                }

                callback(new Set(bannedCoIdSet));
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
            const renderer  = e.currentTarget as RendererForCoName;
            const coId      = Helpers.getExisted(renderer.getCoId());
            this._setPreviewCoId(coId);

            const openData = this._getOpenData();
            if (openData.callbackOnConfirm == null) {
                return;
            }

            const bannedCoIdSet = this._bannedCoIdSet;
            if (!renderer.getIsAvailable()) {
                bannedCoIdSet.delete(coId);
                // this._updateGroupCoTiers();
                this._updateGroupCoNames();
                return;
            }

            if (coId === CommonConstants.CoEmptyId) {
                TwnsCommonAlertPanel.CommonAlertPanel.show({
                    title   : Lang.getText(LangTextType.B0088),
                    content : Lang.getText(LangTextType.A0130),
                });
                return;
            }

            const maxBanCount = openData.maxBanCount;
            if ((maxBanCount != null) && (bannedCoIdSet.size >= maxBanCount)) {
                TwnsCommonAlertPanel.CommonAlertPanel.show({
                    title   : Lang.getText(LangTextType.B0088),
                    content : Lang.getFormattedText(LangTextType.F0031, maxBanCount),
                });
                return;
            }

            const callback = () => {
                bannedCoIdSet.add(coId);
                // this._updateGroupCoTiers();
                this._updateGroupCoNames();
            };
            if (openData.selfCoId !== coId) {
                callback();
            } else {
                CommonConfirmPanel.show({
                    content : Lang.getText(LangTextType.A0057),
                    callback,
                });
            }
        }

        ////////////////////////////////////////////////////////////////////////////////
        // View functions.
        ////////////////////////////////////////////////////////////////////////////////
        private _updateComponentsForLanguage(): void {
            this._btnCancel.label               = Lang.getText(LangTextType.B0154);
            this._btnConfirm.label              = Lang.getText(LangTextType.B0026);
            this._btnClose.label                = Lang.getText(LangTextType.B0204);
            this._labelAvailableCoTitle.text    = `${Lang.getText(LangTextType.B0238)} (P${this._getOpenData().playerIndex})`;

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

        private _initButtons(): void {
            const canModify             = this._getOpenData().callbackOnConfirm != null;
            this._btnConfirm.visible    = canModify;
            this._btnCancel.visible     = canModify;
            this._btnClose.visible      = !canModify;
        }

        private _initGroupCoNames(): void {
            const openData      = this._getOpenData();
            const configVersion = openData.configVersion;
            const fullCoIdArray = [...new Set(openData.fullCoIdArray)].sort((v1, v2) => {
                const name1 = ConfigManager.getCoNameAndTierText(configVersion, v1);
                const name2 = ConfigManager.getCoNameAndTierText(configVersion, v2);
                return (name1 || "").localeCompare(name2 || "", "zh");
            });

            for (const coId of fullCoIdArray) {
                const renderer = new RendererForCoName();
                renderer.setConfigVersion(configVersion);
                renderer.setCoId(coId);
                renderer.setIsAvailable(true);

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
                renderer.setIsAvailable(!bannedCoIdSet.has(Helpers.getExisted(renderer.getCoId())));
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
                configVersion   : this._getOpenData().configVersion,
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
    // class RendererForCoTier extends TwnsUiComponent.UiComponent {
    //     private _imgSelected: TwnsUiImage.UiImage;
    //     private _labelName  : TwnsUiLabel.UiLabel;

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

    class RendererForCoName extends TwnsUiComponent.UiComponent {
        private readonly _imgUnselected!    : TwnsUiImage.UiImage;
        private readonly _imgSelected!      : TwnsUiImage.UiImage;
        private readonly _labelName!        : TwnsUiLabel.UiLabel;

        private _configVersion  : string | null = null;
        private _coId           : number | null = null;
        private _isAvailable    : boolean | null = null;

        public constructor() {
            super();

            this.skinName = "resource/skins/component/checkBox/CheckBox001.exml";
        }

        protected _onOpened(): void {
            this._updateView();
        }

        public setConfigVersion(configVersion: string): void {
            this._configVersion = configVersion;
        }

        public setCoId(coId: number): void {
            this._coId = coId;
            this._updateView();
        }
        public getCoId(): number | null {
            return this._coId;
        }

        public setIsAvailable(isAvailable: boolean): void {
            this._isAvailable = isAvailable;
            this._updateView();
        }
        public getIsAvailable(): boolean | null {
            return this._isAvailable;
        }

        private _updateView(): void {
            if (!this.getIsOpening()) {
                return;
            }

            const isAvailable           = !!this._isAvailable;
            this._imgSelected.visible   = isAvailable;
            this._imgUnselected.visible = !isAvailable;
            this._labelName.text        = ConfigManager.getCoBasicCfg(Helpers.getExisted(this._configVersion), Helpers.getExisted(this._coId))?.name || CommonConstants.ErrorTextForUndefined;
        }
    }
}

export default TwnsCommonBanCoPanel;
