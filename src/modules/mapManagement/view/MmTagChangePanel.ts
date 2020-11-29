
namespace TinyWars.MapManagement {
    import Lang         = Utility.Lang;
    import NotifyType   = Utility.Notify.Type;
    import WarMapModel  = WarMap.WarMapModel;
    import WarMapProxy  = WarMap.WarMapProxy;

    export class MmTagChangePanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Hud0;
        protected readonly _IS_EXCLUSIVE = false;

        private static _instance: MmTagChangePanel;

        private _labelTitle     : GameUi.UiLabel;
        private _btnWarRule     : GameUi.UiButton;
        private _btnCancel      : GameUi.UiButton;
        private _btnConfirm     : GameUi.UiButton;

        private _groupFog       : eui.Group;
        private _labelFog       : GameUi.UiLabel;
        private _imgFog         : GameUi.UiImage;

        private _mapId          : number;

        public static show(mapId: number): void {
            if (!MmTagChangePanel._instance) {
                MmTagChangePanel._instance = new MmTagChangePanel();
            }
            MmTagChangePanel._instance._mapId = mapId;
            MmTagChangePanel._instance.open();
        }

        public static hide(): void {
            if (MmTagChangePanel._instance) {
                MmTagChangePanel._instance.close();
            }
        }

        private constructor() {
            super();

            this._setAutoAdjustHeightEnabled();
            this._setTouchMaskEnabled();
            this.skinName = "resource/skins/mapManagement/MmTagChangePanel.exml";
        }

        protected _onFirstOpened(): void {
            this._notifyListeners = [
                { type: NotifyType.LanguageChanged, callback: this._onNotifyLanguageChanged },
            ];
            this._uiListeners = [
                { ui: this._btnConfirm,     callback: this._onTouchedBtnConfirm },
                { ui: this._btnCancel,      callback: this._onTouchedBtnCancel },
                { ui: this._btnWarRule,     callback: this._onTouchedBtnWarRule },
                { ui: this._groupFog,       callback: this._onTouchedGroupMcw },
            ];
        }

        protected async _onOpened(): Promise<void> {
            this._updateComponentsForLanguage();

            const mapTag            = (await WarMapModel.getBriefData(this._mapId)).mapTag || {};
            this._imgFog.visible    = !!mapTag.fog;
        }

        private _onNotifyLanguageChanged(e: egret.Event): void {
            this._updateComponentsForLanguage();
        }

        private _onTouchedBtnConfirm(e: egret.TouchEvent): void {
            WarMapProxy.reqMmSetMapTag(this._mapId, {
                fog : this._imgFog.visible ? true : null,
            });
            this.close();
        }

        private async _onTouchedBtnWarRule(e: egret.TouchEvent): Promise<void> {
            MmWarRulePanel.show(await WarMapModel.getRawData(this._mapId));
            this.close();
        }

        private _onTouchedBtnCancel(e: egret.TouchEvent): void {
            this.close();
        }

        private _onTouchedGroupMcw(e: egret.TouchEvent): void {
            this._imgFog.visible = !this._imgFog.visible;
        }

        private _updateComponentsForLanguage(): void {
            this._labelTitle.text   = Lang.getText(Lang.Type.B0444);
            this._btnCancel.label   = Lang.getText(Lang.Type.B0154);
            this._btnConfirm.label  = Lang.getText(Lang.Type.B0026);
            this._btnWarRule.label  = Lang.getText(Lang.Type.B0314);
            this._labelFog.text     = Lang.getText(Lang.Type.B0438);
        }
    }
}
