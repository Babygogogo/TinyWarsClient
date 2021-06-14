
namespace TinyWars.SingleCustomRoom {
    import Helpers          = Utility.Helpers;
    import Lang             = Utility.Lang;
    import Notify           = Utility.Notify;
    import ConfigManager    = Utility.ConfigManager;
    import CommonConstants  = Utility.CommonConstants;
    import ConfirmPanel     = Common.CommonConfirmPanel;

    type OpenDataForScrCreateBanCoPanel = {
        playerIndex : number;
    }
    export class ScrCreateBanCoPanel extends GameUi.UiPanel<OpenDataForScrCreateBanCoPanel> {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Hud2;
        protected readonly _IS_EXCLUSIVE = true;

        private static _instance: ScrCreateBanCoPanel;

        private readonly _imgMask                   : GameUi.UiImage;
        private readonly _group                     : eui.Group;
        private readonly _labelAvailableCoTitle     : GameUi.UiLabel;
        private readonly _groupCoNames              : eui.Group;
        private readonly _btnCancel                 : GameUi.UiButton;
        private readonly _btnConfirm                : GameUi.UiButton;
        private readonly _uiCoInfo                  : GameUi.UiCoInfo;

        private _renderersForCoNames    : RendererForCoName[] = [];

        private _playerIndex            : number;
        private _bannedCoIdSet          = new Set<number>();
        private _previewCoId            : number;

        public static show(openData: OpenDataForScrCreateBanCoPanel): void {
            if (!ScrCreateBanCoPanel._instance) {
                ScrCreateBanCoPanel._instance = new ScrCreateBanCoPanel();
            }
            ScrCreateBanCoPanel._instance.open(openData);
        }

        public static async hide(): Promise<void> {
            if (ScrCreateBanCoPanel._instance) {
                await ScrCreateBanCoPanel._instance.close();
            }
        }

        public constructor() {
            super();

            this._setIsTouchMaskEnabled();
            this._setIsCloseOnTouchedMask();
            this.skinName = "resource/skins/singleCustomRoom/ScrCreateBanCoPanel.exml";
        }

        protected _onOpened(): void {
            this._setUiListenerArray([
                { ui: this._btnCancel,  callback: this._onTouchedBtnCancel },
                { ui: this._btnConfirm, callback: this._onTouchedBtnConfirm },
            ]);
            this._setNotifyListenerArray([
                { type: Notify.Type.LanguageChanged, callback: this._onNotifyLanguageChanged },
            ]);

            this._showOpenAnimation();

            const playerIndex = this._getOpenData().playerIndex;
            this._playerIndex = playerIndex;

            const bannedCoIdSet = this._bannedCoIdSet;
            bannedCoIdSet.clear();
            for (const coId of ScrModel.Create.getBannedCoIdArray(playerIndex) || []) {
                bannedCoIdSet.add(coId);
            }

            this._updateComponentsForLanguage();
            this._initGroupCoNames();
            this._initComponentsForPreviewCo();
        }

        protected async _onClosed(): Promise<void> {
            await this._showCloseAnimation();

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
                Common.CommonAlertPanel.show({
                    title   : Lang.getText(Lang.Type.B0088),
                    content : Lang.getText(Lang.Type.A0130),
                });
            } else {
                const playerIndex   = this._playerIndex;
                const callback      = () => {
                    ScrModel.Create.setBannedCoIdArray(playerIndex, bannedCoIdSet);
                    Notify.dispatch(Notify.Type.ScrCreateBannedCoIdArrayChanged);
                    this.close();
                };

                if (!bannedCoIdSet.has(ScrModel.Create.getCoId(playerIndex))) {
                    callback();
                } else {
                    ConfirmPanel.show({
                        content : Lang.getText(Lang.Type.A0057),
                        callback: () => {
                            ScrModel.Create.setCoId(playerIndex, CommonConstants.CoEmptyId);
                            callback();
                        },
                    });
                }
            }
        }

        private _onTouchedCoNameRenderer(e: egret.TouchEvent): void {
            const renderer      = e.currentTarget as RendererForCoName;
            const coId          = renderer.getCoId();
            const bannedCoIdSet = this._bannedCoIdSet;
            this._setPreviewCoId(coId);

            if (!renderer.getIsSelected()) {
                bannedCoIdSet.delete(coId);
                this._updateGroupCoNames();

            } else {
                if (coId === CommonConstants.CoEmptyId) {
                    Common.CommonAlertPanel.show({
                        title   : Lang.getText(Lang.Type.B0088),
                        content : Lang.getText(Lang.Type.A0130),
                    });
                    return;
                }

                const callback = () => {
                    bannedCoIdSet.add(coId);
                    this._updateGroupCoNames();
                };

                if (coId !== ScrModel.Create.getCoId(this._playerIndex)) {
                    callback();
                } else {
                    ConfirmPanel.show({
                        content : Lang.getText(Lang.Type.A0057),
                        callback,
                    });
                }
            }
        }

        ////////////////////////////////////////////////////////////////////////////////
        // View functions.
        ////////////////////////////////////////////////////////////////////////////////
        private _updateComponentsForLanguage(): void {
            this._btnCancel.label               = Lang.getText(Lang.Type.B0154);
            this._btnConfirm.label              = Lang.getText(Lang.Type.B0026);
            this._labelAvailableCoTitle.text    = `${Lang.getText(Lang.Type.B0238)} (P${this._playerIndex})`;

            this._updateComponentsForPreviewCoId();
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

    class RendererForCoName extends GameUi.UiComponent {
        private readonly _imgUnselected : GameUi.UiImage;
        private readonly _imgSelected   : GameUi.UiImage;
        private readonly _labelName     : GameUi.UiLabel;

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
}
