
namespace TinyWars.MapManagement {
    import Lang     = Utility.Lang;
    import Notify   = Utility.Notify;

    export class MmAcceptMapPanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Hud3;
        protected readonly _IS_EXCLUSIVE = true;

        private static _instance: MmAcceptMapPanel;

        private _labelTitle     : GameUi.UiLabel;
        private _labelTips      : GameUi.UiLabel;
        private _inputReason    : GameUi.UiTextInput;
        private _btnCancel      : GameUi.UiButton;
        private _btnConfirm     : GameUi.UiButton;

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

        public static show(): void {
            if (!MmAcceptMapPanel._instance) {
                MmAcceptMapPanel._instance = new MmAcceptMapPanel();
            }
            MmAcceptMapPanel._instance.open();
        }

        public static hide(): void {
            if (MmAcceptMapPanel._instance) {
                MmAcceptMapPanel._instance.close();
            }
        }

        public constructor() {
            super();

            this.skinName = "resource/skins/mapManagement/MmAcceptMapPanel.exml";
            this._setAutoAdjustHeightEnabled();
            this._setTouchMaskEnabled();
        }

        protected _onFirstOpened(): void {
            this._setNotifyListenerArray([
                { type: Notify.Type.LanguageChanged, callback: this._onNotifyLanguageChanged },
            ]);
            this._setUiListenerArray([
                { ui: this._btnCancel,      callback: this._onTouchedBtnCancel, },
                { ui: this._btnConfirm,     callback: this._onTouchedBtnConfirm, },
                { ui: this._groupMcw,       callback: this._onTouchedGroupMcw },
                { ui: this._groupScw,       callback: this._onTouchedGroupScw },
                { ui: this._groupRank,      callback: this._onTouchedGroupRank },
                { ui: this._groupRankFog,   callback: this._onTouchedGroupRankFog },
            ]);
        }

        protected _onOpened(): void {
            this._updateComponentsForLanguage();

            this._imgMcw.visible        = false;
            this._imgScw.visible        = false;
            this._imgRank.visible       = false;
            this._imgRankFog.visible    = false;
        }

        private _onNotifyLanguageChanged(e: egret.Event): void {
            this._updateComponentsForLanguage();
        }

        private _onTouchedBtnCancel(e: egret.TouchEvent): void {
            MmAcceptMapPanel.hide();
        }
        private _onTouchedBtnConfirm(e: egret.TouchEvent): void {
            const war = MapEditor.MeManager.getWar();
            WarMap.WarMapProxy.reqMmReviewMap({
                designerUserId  : war.getMapDesignerUserId(),
                slotIndex       : war.getMapSlotIndex(),
                modifiedTime    : war.getMapModifiedTime(),
                isAccept        : true,
                reviewComment   : this._inputReason.text,
                availability    : {
                    canMcw      : this._imgMcw.visible,
                    canWr       : false,
                    canScw      : this._imgScw.visible,
                    canRank     : this._imgRank.visible,
                    canRankFog  : this._imgRankFog.visible,
                },
            });
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
            this._btnConfirm.label  = Lang.getText(Lang.Type.B0026);
            this._btnCancel.label   = Lang.getText(Lang.Type.B0154);
            this._labelTitle.text   = Lang.getText(Lang.Type.B0296);
            this._labelTips.text    = Lang.getText(Lang.Type.A0105);
            this._labelMcw.text     = Lang.getText(Lang.Type.B0200);
            this._labelRank.text    = Lang.getText(Lang.Type.B0404);
            this._labelRankFog.text = Lang.getText(Lang.Type.B0408);
            this._labelScw.text     = Lang.getText(Lang.Type.B0409);
        }
    }
}
