
namespace TinyWars.MultiRankRoom {
    import Types            = Utility.Types;
    import Helpers          = Utility.Helpers;
    import Lang             = Utility.Lang;
    import Notify           = Utility.Notify;
    import ConfigManager    = Utility.ConfigManager;
    import CommonConstants  = Utility.CommonConstants;

    type OpenDataForMrrRoomBanCoPanel = {
        roomId: number;
    }
    export class MrrRoomBanCoPanel extends GameUi.UiPanel<OpenDataForMrrRoomBanCoPanel> {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Hud2;
        protected readonly _IS_EXCLUSIVE = true;

        private static _instance: MrrRoomBanCoPanel;

        private readonly _imgMask                   : GameUi.UiImage;
        private readonly _group                     : eui.Group;
        private readonly _labelAvailableCoTitle     : GameUi.UiLabel;
        private readonly _groupCoNames              : eui.Group;
        private readonly _btnCancel                 : GameUi.UiButton;
        private readonly _btnConfirm                : GameUi.UiButton;
        private readonly _uiCoInfo                  : GameUi.UiCoInfo;

        private readonly _renderersForCoNames       : RendererForCoName[] = [];

        private _bannedCoIdSet      = new Set<number>();
        private _previewCoId        : number;

        public static show(openData: OpenDataForMrrRoomBanCoPanel): void {
            if (!MrrRoomBanCoPanel._instance) {
                MrrRoomBanCoPanel._instance = new MrrRoomBanCoPanel();
            }
            MrrRoomBanCoPanel._instance.open(openData);
        }

        public static async hide(): Promise<void> {
            if (MrrRoomBanCoPanel._instance) {
                await MrrRoomBanCoPanel._instance.close();
            }
        }

        public constructor() {
            super();

            this._setIsTouchMaskEnabled();
            this._setIsCloseOnTouchedMask();
            this.skinName = "resource/skins/multiRankRoom/MrrRoomBanCoPanel.exml";
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

            this._bannedCoIdSet.clear();

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
                return;
            }

            const bannedCoCount = bannedCoIdSet.size;
            const maxCount      = CommonConstants.RankMaxBanCoCount;
            if (bannedCoCount > maxCount) {
                Common.CommonAlertPanel.show({
                    title   : Lang.getText(Lang.Type.B0088),
                    content: Lang.getFormattedText(Lang.Type.F0031, maxCount),
                });
                return;
            }

            const callback = () => {
                MrrProxy.reqMrrSetBannedCoIdList(this._getOpenData().roomId, [...bannedCoIdSet]);
                this.close();
            };
            if (bannedCoCount > 0) {
                Common.CommonConfirmPanel.show({
                    content : Lang.getText(Lang.Type.A0138),
                    callback,
                });
            } else {
                Common.CommonConfirmPanel.show({
                    content : Lang.getText(Lang.Type.A0139),
                    callback,
                });
            }
        }

        private _onTouchedCoNameRenderer(e: egret.TouchEvent): void {
            const renderer      = e.currentTarget as RendererForCoName;
            const coId          = renderer.getCoId();
            const bannedCoIdSet = this._bannedCoIdSet;
            this._setPreviewCoId(coId);

            if (!renderer.getIsAvailable()) {
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

                bannedCoIdSet.add(coId);
                this._updateGroupCoNames();
            }
        }

        ////////////////////////////////////////////////////////////////////////////////
        // View functions.
        ////////////////////////////////////////////////////////////////////////////////
        private _updateComponentsForLanguage(): void {
            this._btnCancel.label               = Lang.getText(Lang.Type.B0154);
            this._btnConfirm.label              = Lang.getText(Lang.Type.B0026);
            this._labelAvailableCoTitle.text    = Lang.getText(Lang.Type.B0238);

            this._updateComponentsForPreviewCoId();
        }

        private _initGroupCoNames(): void {
            for (const cfg of ConfigManager.getEnabledCoArray(ConfigManager.getLatestFormalVersion())) {
                const renderer = new RendererForCoName();
                renderer.setCoId(cfg.coId);
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
                renderer.setIsAvailable(!bannedCoIdSet.has(renderer.getCoId()));
            }
        }

        private _initComponentsForPreviewCo(): void {
            for (const coId of this._bannedCoIdSet) {
                if (coId !== CommonConstants.CoEmptyId) {
                    this._setPreviewCoId(coId);
                    return;
                }
            }
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
        private _isAvailable     : boolean;

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

        public setIsAvailable(isSelected: boolean): void {
            this._isAvailable = isSelected;
            this._updateView();
        }
        public getIsAvailable(): boolean {
            return this._isAvailable;
        }

        private _updateView(): void {
            if (!this.getIsOpening()) {
                return;
            }

            const coCfg             = ConfigManager.getCoBasicCfg(ConfigManager.getLatestFormalVersion(), this._coId);
            this._labelName.text    = coCfg ? coCfg.name : null;

            const isAvailable           = this.getIsAvailable();
            this._imgSelected.visible   = isAvailable;
            this._imgUnselected.visible = !isAvailable;
        }
    }
}