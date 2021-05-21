
namespace TinyWars.MapManagement {
    import Lang         = Utility.Lang;
    import NotifyType   = Utility.Notify.Type;
    import WarMapModel  = WarMap.WarMapModel;
    import WarMapProxy  = WarMap.WarMapProxy;

    type OpenDataForMmAvailabilityChangePanel = {
        mapId   : number;
    }
    export class MmAvailabilityChangePanel extends GameUi.UiPanel<OpenDataForMmAvailabilityChangePanel> {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Hud0;
        protected readonly _IS_EXCLUSIVE = false;

        private static _instance: MmAvailabilityChangePanel;

        private _groupMcw       : eui.Group;
        private _labelMcw       : GameUi.UiLabel;
        private _imgMcw         : GameUi.UiImage;

        private _groupScw       : eui.Group;
        private _labelScw       : GameUi.UiLabel;
        private _imgScw         : GameUi.UiImage;

        private _groupSrw       : eui.Group;
        private _labelSrw       : GameUi.UiLabel;
        private _imgSrw         : GameUi.UiImage;

        private _groupMrwStd    : eui.Group;
        private _labelMrwStd    : GameUi.UiLabel;
        private _imgMrwStd      : GameUi.UiImage;

        private _groupMrwFog    : eui.Group;
        private _labelMrwFog    : GameUi.UiLabel;
        private _imgMrwFog      : GameUi.UiImage;

        private _btnDelete      : GameUi.UiButton;
        private _btnWarRule     : GameUi.UiButton;
        private _btnCancel      : GameUi.UiButton;
        private _btnConfirm     : GameUi.UiButton;

        private _mapId          : number;

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
                { ui: this._groupScw,       callback: this._onTouchedGroupScw },
                { ui: this._groupSrw,       callback: this._onTouchedGroupSrw },
                { ui: this._groupMrwStd,    callback: this._onTouchedGroupMrwStd },
                { ui: this._groupMrwFog,    callback: this._onTouchedGroupMrwFog },
            ]);

            this._btnDelete.setTextColor(0xFF0000);
            this._updateComponentsForLanguage();

            const mapId = this._getOpenData().mapId;
            this._mapId = mapId;

            const availability          = (await WarMapModel.getBriefData(mapId)).mapExtraData.mapComplexInfo.availability;
            this._imgMcw.visible        = !!availability.canMcw;
            this._imgScw.visible        = !!availability.canScw;
            this._imgSrw.visible        = !!availability.canSrw;
            this._imgMrwStd.visible     = !!availability.canMrwStd;
            this._imgMrwFog.visible     = !!availability.canMrwFog;
        }

        private _onNotifyLanguageChanged(e: egret.Event): void {
            this._updateComponentsForLanguage();
        }

        private _onTouchedBtnConfirm(e: egret.TouchEvent): void {
            WarMapProxy.reqMmSetMapAvailability(this._mapId, {
                canMcw      : this._imgMcw.visible,
                canScw      : this._imgScw.visible,
                canSrw      : this._imgSrw.visible,
                canMrwStd   : this._imgMrwStd.visible,
                canMrwFog   : this._imgMrwFog.visible,
            });
            this.close();
        }

        private _onTouchedBtnDelete(e: egret.TouchEvent): void {
            Common.CommonConfirmPanel.show({
                content : Lang.getText(Lang.Type.A0080),
                callback: () => {
                    WarMapProxy.reqMmSetMapEnabled(this._mapId, false);
                    this.close();
                },
            });
        }

        private async _onTouchedBtnWarRule(e: egret.TouchEvent): Promise<void> {
            MmWarRulePanel.show(await WarMapModel.getRawData(this._mapId));
            this.close();
        }

        private _onTouchedBtnCancel(e: egret.TouchEvent): void {
            this.close();
        }

        private _onTouchedGroupMcw(e: egret.TouchEvent): void {
            this._imgMcw.visible = !this._imgMcw.visible;
        }
        private _onTouchedGroupScw(e: egret.TouchEvent): void {
            this._imgScw.visible = !this._imgScw.visible;
        }
        private _onTouchedGroupSrw(e: egret.TouchEvent): void {
            this._imgSrw.visible = !this._imgSrw.visible;
        }
        private _onTouchedGroupMrwStd(e: egret.TouchEvent): void {
            this._imgMrwStd.visible = !this._imgMrwStd.visible;
        }
        private _onTouchedGroupMrwFog(e: egret.TouchEvent): void {
            this._imgMrwFog.visible = !this._imgMrwFog.visible;
        }

        private _updateComponentsForLanguage(): void {
            this._btnCancel.label   = Lang.getText(Lang.Type.B0154);
            this._btnConfirm.label  = Lang.getText(Lang.Type.B0026);
            this._btnDelete.label   = Lang.getText(Lang.Type.B0270);
            this._btnWarRule.label  = Lang.getText(Lang.Type.B0314);
            this._labelMcw.text     = Lang.getText(Lang.Type.B0200);
            this._labelMrwStd.text  = Lang.getText(Lang.Type.B0404);
            this._labelMrwFog.text  = Lang.getText(Lang.Type.B0408);
            this._labelScw.text     = Lang.getText(Lang.Type.B0409);
            this._labelSrw.text     = Lang.getText(Lang.Type.B0614);
        }
    }
}
