
// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace TinyWars.MapManagement {
    import Lang         = Utility.Lang;
    import NotifyType   = Utility.Notify.Type;
    import Logger       = Utility.Logger;
    import WarMapModel  = WarMap.WarMapModel;
    import WarMapProxy  = WarMap.WarMapProxy;

    type OpenDataForMmAvailabilityChangePanel = {
        mapId   : number;
    }
    export class MmAvailabilityChangePanel extends GameUi.UiPanel<OpenDataForMmAvailabilityChangePanel> {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Hud0;
        protected readonly _IS_EXCLUSIVE = false;

        private static _instance: MmAvailabilityChangePanel;

        // @ts-ignore
        private _groupMcw       : eui.Group;
        // @ts-ignore
        private _labelMcw       : GameUi.UiLabel;
        // @ts-ignore
        private _imgMcw         : GameUi.UiImage;

        // @ts-ignore
        private _groupCcw       : eui.Group;
        // @ts-ignore
        private _labelCcw       : GameUi.UiLabel;
        // @ts-ignore
        private _imgCcw         : GameUi.UiImage;

        // @ts-ignore
        private _groupScw       : eui.Group;
        // @ts-ignore
        private _labelScw       : GameUi.UiLabel;
        // @ts-ignore
        private _imgScw         : GameUi.UiImage;

        // @ts-ignore
        private _groupSrw       : eui.Group;
        // @ts-ignore
        private _labelSrw       : GameUi.UiLabel;
        // @ts-ignore
        private _imgSrw         : GameUi.UiImage;

        // @ts-ignore
        private _groupMrwStd    : eui.Group;
        // @ts-ignore
        private _labelMrwStd    : GameUi.UiLabel;
        // @ts-ignore
        private _imgMrwStd      : GameUi.UiImage;

        // @ts-ignore
        private _groupMrwFog    : eui.Group;
        // @ts-ignore
        private _labelMrwFog    : GameUi.UiLabel;
        // @ts-ignore
        private _imgMrwFog      : GameUi.UiImage;

        // @ts-ignore
        private _btnDelete      : GameUi.UiButton;
        // @ts-ignore
        private _btnWarRule     : GameUi.UiButton;
        // @ts-ignore
        private _btnCancel      : GameUi.UiButton;
        // @ts-ignore
        private _btnConfirm     : GameUi.UiButton;

        public static show(openData: OpenDataForMmAvailabilityChangePanel): void {
            if (!MmAvailabilityChangePanel._instance) {
                MmAvailabilityChangePanel._instance = new MmAvailabilityChangePanel();
            }
            MmAvailabilityChangePanel._instance.open(openData);
        }

        public static async hide(): Promise<void> {
            if (MmAvailabilityChangePanel._instance) {
                await MmAvailabilityChangePanel._instance.close();
            }
        }

        private constructor() {
            super();

            this._setIsTouchMaskEnabled();
            this.skinName = "resource/skins/mapManagement/MmAvailabilityChangePanel.exml";
        }

        protected async _onOpened(): Promise<void> {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged, callback: this._onNotifyLanguageChanged },
            ]);
            this._setUiListenerArray([
                { ui: this._btnConfirm,     callback: this._onTouchedBtnConfirm },
                { ui: this._btnDelete,      callback: this._onTouchedBtnDelete },
                { ui: this._btnCancel,      callback: this._onTouchedBtnCancel },
                { ui: this._btnWarRule,     callback: this._onTouchedBtnWarRule },
                { ui: this._groupMcw,       callback: this._onTouchedGroupMcw },
                { ui: this._groupCcw,       callback: this._onTouchedGroupCcw },
                { ui: this._groupScw,       callback: this._onTouchedGroupScw },
                { ui: this._groupSrw,       callback: this._onTouchedGroupSrw },
                { ui: this._groupMrwStd,    callback: this._onTouchedGroupMrwStd },
                { ui: this._groupMrwFog,    callback: this._onTouchedGroupMrwFog },
            ]);

            this._btnDelete.setTextColor(0xFF0000);
            this._updateComponentsForLanguage();
            this._updateImages();
        }

        private _onNotifyLanguageChanged(): void {
            this._updateComponentsForLanguage();
        }

        private _onTouchedBtnConfirm(): void {
            WarMapProxy.reqMmSetMapAvailability(this._getOpenData().mapId, {
                canMcw      : this._imgMcw.visible,
                canCcw      : this._imgCcw.visible,
                canScw      : this._imgScw.visible,
                canSrw      : this._imgSrw.visible,
                canMrwStd   : this._imgMrwStd.visible,
                canMrwFog   : this._imgMrwFog.visible,
            });
            this.close();
        }

        private _onTouchedBtnDelete(): void {
            Common.CommonConfirmPanel.show({
                content : Lang.getText(Lang.Type.A0080),
                callback: () => {
                    WarMapProxy.reqMmSetMapEnabled(this._getOpenData().mapId, false);
                    this.close();
                },
            });
        }

        private async _onTouchedBtnWarRule(): Promise<void> {
            const mapRawData = await WarMapModel.getRawData(this._getOpenData().mapId);
            if (mapRawData == null) {
                Logger.error(`MmAvailabilityChangePanel._onTouchedBtnWarRule() empty mapRawData.`);
                return;
            }

            MmWarRulePanel.show(mapRawData);
            this.close();
        }

        private _onTouchedBtnCancel(): void {
            this.close();
        }

        private _onTouchedGroupMcw(): void {
            this._imgMcw.visible = !this._imgMcw.visible;
        }
        private _onTouchedGroupCcw(): void {
            this._imgCcw.visible = !this._imgCcw.visible;
        }
        private _onTouchedGroupScw(): void {
            this._imgScw.visible = !this._imgScw.visible;
        }
        private _onTouchedGroupSrw(): void {
            this._imgSrw.visible = !this._imgSrw.visible;
        }
        private _onTouchedGroupMrwStd(): void {
            this._imgMrwStd.visible = !this._imgMrwStd.visible;
        }
        private _onTouchedGroupMrwFog(): void {
            this._imgMrwFog.visible = !this._imgMrwFog.visible;
        }

        private async _updateImages(): Promise<void> {
            const briefData     = await WarMapModel.getBriefData(this._getOpenData().mapId);
            const extraData     = briefData ? briefData.mapExtraData : null;
            const complexInfo   = extraData ? extraData.mapComplexInfo : null;
            const availability  = complexInfo ? complexInfo.availability : null;
            if (availability == null) {
                Logger.error(`MmAvailabilityChangePanel._updateImages() empty availability.`);
                return;
            }

            this._imgMcw.visible        = !!availability.canMcw;
            this._imgCcw.visible        = !!availability.canCcw;
            this._imgScw.visible        = !!availability.canScw;
            this._imgSrw.visible        = !!availability.canSrw;
            this._imgMrwStd.visible     = !!availability.canMrwStd;
            this._imgMrwFog.visible     = !!availability.canMrwFog;
        }

        private _updateComponentsForLanguage(): void {
            this._btnCancel.label   = Lang.getText(Lang.Type.B0154);
            this._btnConfirm.label  = Lang.getText(Lang.Type.B0026);
            this._btnDelete.label   = Lang.getText(Lang.Type.B0270);
            this._btnWarRule.label  = Lang.getText(Lang.Type.B0314);
            this._labelMcw.text     = Lang.getText(Lang.Type.B0200);
            this._labelCcw.text     = Lang.getText(Lang.Type.B0619);
            this._labelMrwStd.text  = Lang.getText(Lang.Type.B0404);
            this._labelMrwFog.text  = Lang.getText(Lang.Type.B0408);
            this._labelScw.text     = Lang.getText(Lang.Type.B0409);
            this._labelSrw.text     = Lang.getText(Lang.Type.B0614);
        }
    }
}
