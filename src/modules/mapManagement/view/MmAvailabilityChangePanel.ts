
namespace TinyWars.MapManagement {
    import Lang         = Utility.Lang;
    import NotifyType   = Utility.Notify.Type;
    import WarMapModel  = WarMap.WarMapModel;
    import WarMapProxy  = WarMap.WarMapProxy;

    export class MmAvailabilityChangePanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Hud0;
        protected readonly _IS_EXCLUSIVE = false;

        private static _instance: MmAvailabilityChangePanel;

        private _groupMcw       : eui.Group;
        private _labelMcw       : GameUi.UiLabel;
        private _imgMcw         : GameUi.UiImage;

        private _groupScw       : eui.Group;
        private _labelScw       : GameUi.UiLabel;
        private _imgScw         : GameUi.UiImage;

        private _groupRank      : eui.Group;
        private _labelRank      : GameUi.UiLabel;
        private _imgRank        : GameUi.UiImage;

        private _groupRankFog   : eui.Group;
        private _labelRankFog   : GameUi.UiLabel;
        private _imgRankFog     : GameUi.UiImage;

        private _btnDelete      : GameUi.UiButton;
        private _btnWarRule     : GameUi.UiButton;
        private _btnCancel      : GameUi.UiButton;
        private _btnConfirm     : GameUi.UiButton;

        private _mapId          : number;

        public static show(mapId: number): void {
            if (!MmAvailabilityChangePanel._instance) {
                MmAvailabilityChangePanel._instance = new MmAvailabilityChangePanel();
            }
            MmAvailabilityChangePanel._instance._mapId = mapId;
            MmAvailabilityChangePanel._instance.open();
        }

        public static hide(): void {
            if (MmAvailabilityChangePanel._instance) {
                MmAvailabilityChangePanel._instance.close();
            }
        }

        private constructor() {
            super();

            this._setAutoAdjustHeightEnabled();
            this._setTouchMaskEnabled();
            this.skinName = "resource/skins/mapManagement/MmAvailabilityChangePanel.exml";
        }

        protected _onFirstOpened(): void {
            this._notifyListeners = [
                { type: NotifyType.LanguageChanged, callback: this._onNotifyLanguageChanged },
            ];
            this._uiListeners = [
                { ui: this._btnConfirm,     callback: this._onTouchedBtnConfirm },
                { ui: this._btnDelete,      callback: this._onTouchedBtnDelete },
                { ui: this._btnCancel,      callback: this._onTouchedBtnCancel },
                { ui: this._btnWarRule,     callback: this._onTouchedBtnWarRule },
                { ui: this._groupMcw,       callback: this._onTouchedGroupMcw },
                { ui: this._groupScw,       callback: this._onTouchedGroupScw },
                { ui: this._groupRank,      callback: this._onTouchedGroupRank },
                { ui: this._groupRankFog,   callback: this._onTouchedGroupRankFog },
            ];

            this._btnDelete.setTextColor(0xFF0000);
        }

        protected async _onOpened(): Promise<void> {
            this._updateComponentsForLanguage();

            const availability          = (await WarMapModel.getBriefData(this._mapId)).mapExtraData.mapComplexInfo.availability;
            this._imgMcw.visible        = !!availability.canMcw;
            this._imgScw.visible        = !!availability.canScw;
            this._imgRank.visible       = !!availability.canRank;
            this._imgRankFog.visible    = !!availability.canRankFog;
        }

        private _onNotifyLanguageChanged(e: egret.Event): void {
            this._updateComponentsForLanguage();
        }

        private _onTouchedBtnConfirm(e: egret.TouchEvent): void {
            WarMapProxy.reqMmSetMapAvailability(this._mapId, {
                canMcw      : this._imgMcw.visible,
                canWr       : false,
                canScw      : this._imgScw.visible,
                canRank     : this._imgRank.visible,
                canRankFog  : this._imgRankFog.visible,
            });
            this.close();
        }

        private _onTouchedBtnDelete(e: egret.TouchEvent): void {
            Common.CommonConfirmPanel.show({
                title   : Lang.getText(Lang.Type.B0088),
                content : Lang.getText(Lang.Type.A0080),
                callback: () => {
                    WarMapProxy.reqMmDeleteMap(this._mapId);
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
        private _onTouchedGroupRank(e: egret.TouchEvent): void {
            this._imgRank.visible = !this._imgRank.visible;
        }
        private _onTouchedGroupRankFog(e: egret.TouchEvent): void {
            this._imgRankFog.visible = !this._imgRankFog.visible;
        }

        private _updateComponentsForLanguage(): void {
            this._btnCancel.label   = Lang.getText(Lang.Type.B0154);
            this._btnConfirm.label  = Lang.getText(Lang.Type.B0026);
            this._btnDelete.label   = Lang.getText(Lang.Type.B0270);
            this._btnWarRule.label  = Lang.getText(Lang.Type.B0314);
            this._labelMcw.text     = Lang.getText(Lang.Type.B0200);
            this._labelRank.text    = Lang.getText(Lang.Type.B0404);
            this._labelRankFog.text = Lang.getText(Lang.Type.B0408);
            this._labelScw.text     = Lang.getText(Lang.Type.B0409);
        }
    }
}
