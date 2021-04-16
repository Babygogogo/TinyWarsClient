
namespace TinyWars.MapEditor {
    import Lang         = Utility.Lang;
    import Notify       = Utility.Notify;
    import Types        = Utility.Types;
    import SymmetryType = Types.SymmetryType;

    export class MeSymmetryPanel extends GameUi.UiPanel<void> {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Hud3;
        protected readonly _IS_EXCLUSIVE = false;

        private static _instance: MeSymmetryPanel;

        private _groupLeftRight             : eui.Group;
        private _labelLeftRightTitle        : TinyWars.GameUi.UiLabel;
        private _labelLeftRightRate         : TinyWars.GameUi.UiLabel;
        private _groupLeftRightBox          : eui.Group;
        private _imgLeftRight               : TinyWars.GameUi.UiImage;
        private _labelLeftRightAuto         : TinyWars.GameUi.UiLabel;

        private _groupUpDown                : eui.Group;
        private _labelUpDownTitle           : TinyWars.GameUi.UiLabel;
        private _labelUpDownRate            : TinyWars.GameUi.UiLabel;
        private _groupUpDownBox             : eui.Group;
        private _imgUpDown                  : TinyWars.GameUi.UiImage;
        private _labelUpDownAuto            : TinyWars.GameUi.UiLabel;

        private _groupRotational            : eui.Group;
        private _labelRotationalTitle       : TinyWars.GameUi.UiLabel;
        private _labelRotationalRate        : TinyWars.GameUi.UiLabel;
        private _groupRotationalBox         : eui.Group;
        private _imgRotational              : TinyWars.GameUi.UiImage;
        private _labelRotationalAuto        : TinyWars.GameUi.UiLabel;

        private _groupUpLeftDownRight       : eui.Group;
        private _labelUpLeftDownRightTitle  : TinyWars.GameUi.UiLabel;
        private _labelUpLeftDownRightRate   : TinyWars.GameUi.UiLabel;
        private _groupUpLeftDownRightBox    : eui.Group;
        private _imgUpLeftDownRight         : TinyWars.GameUi.UiImage;
        private _labelUpLeftDownRightAuto   : TinyWars.GameUi.UiLabel;

        private _groupUpRightDownLeft       : eui.Group;
        private _labelUpRightDownLeftTitle  : TinyWars.GameUi.UiLabel;
        private _labelUpRightDownLeftRate   : TinyWars.GameUi.UiLabel;
        private _groupUpRightDownLeftBox    : eui.Group;
        private _imgUpRightDownLeft         : TinyWars.GameUi.UiImage;
        private _labelUpRightDownLeftAuto   : TinyWars.GameUi.UiLabel;

        private _war                    : MeWar;
        private _asymmetricalCounters   : MeUtility.AsymmetricalCounters;

        public static show(): void {
            if (!MeSymmetryPanel._instance) {
                MeSymmetryPanel._instance = new MeSymmetryPanel();
            }
            MeSymmetryPanel._instance.open(undefined);
        }

        public static async hide(): Promise<void> {
            if (MeSymmetryPanel._instance) {
                await MeSymmetryPanel._instance.close();
            }
        }

        public constructor() {
            super();

            this._setIsTouchMaskEnabled();
            this._setIsCloseOnTouchedMask();
            this.skinName               = "resource/skins/mapEditor/MeSymmetryPanel.exml";
        }

        protected _onOpened(): void {
            this._setNotifyListenerArray([
                { type: Notify.Type.LanguageChanged,    callback: this._onNotifyLanguageChanged },
            ]);
            this._setUiListenerArray([
                { ui: this._groupLeftRightBox,          callback: this._onTouchedGroupLeftRightBox, },
                { ui: this._groupUpDownBox,             callback: this._onTouchedGroupUpDownBox, },
                { ui: this._groupRotationalBox,         callback: this._onTouchedGroupRotationalBox },
                { ui: this._groupUpLeftDownRightBox,    callback: this._onTouchedGroupUpLeftDownRightBox },
                { ui: this._groupUpRightDownLeftBox,    callback: this._onTouchedGroupUpRightDownLeftBox },
            ]);

            this._updateComponentsForLanguage();

            this._war                   = MeModel.getWar();
            this._asymmetricalCounters  = MeUtility.getAsymmetricalCounters(this._war);

            this._updateGroupLeftRight();
            this._updateGroupUpDown();
            this._updateGroupRotational();
            this._updateGroupUpLeftDownRight();
            this._updateGroupUpRightDownLeft();
        }

        private _onTouchedGroupLeftRightBox(e: egret.TouchEvent): void {
            const drawer = this._war.getDrawer();
            if (drawer.getSymmetricalDrawType() !== SymmetryType.LeftToRight) {
                drawer.setSymmetricalDrawType(SymmetryType.LeftToRight);
            } else {
                drawer.setSymmetricalDrawType(SymmetryType.None);
            }
            this._updateGroupBoxes();
        }
        private _onTouchedGroupUpDownBox(e: egret.TouchEvent): void {
            const drawer = this._war.getDrawer();
            if (drawer.getSymmetricalDrawType() !== SymmetryType.UpToDown) {
                drawer.setSymmetricalDrawType(SymmetryType.UpToDown);
            } else {
                drawer.setSymmetricalDrawType(SymmetryType.None);
            }
            this._updateGroupBoxes();
        }
        private _onTouchedGroupRotationalBox(e: egret.TouchEvent): void {
            const drawer = this._war.getDrawer();
            if (drawer.getSymmetricalDrawType() !== SymmetryType.Rotation) {
                drawer.setSymmetricalDrawType(SymmetryType.Rotation);
            } else {
                drawer.setSymmetricalDrawType(SymmetryType.None);
            }
            this._updateGroupBoxes();
        }
        private _onTouchedGroupUpLeftDownRightBox(e: egret.TouchEvent): void {
            const drawer = this._war.getDrawer();
            if (drawer.getSymmetricalDrawType() !== SymmetryType.UpLeftToDownRight) {
                drawer.setSymmetricalDrawType(SymmetryType.UpLeftToDownRight);
            } else {
                drawer.setSymmetricalDrawType(SymmetryType.None);
            }
            this._updateGroupBoxes();
        }
        private _onTouchedGroupUpRightDownLeftBox(e: egret.TouchEvent): void {
            const drawer = this._war.getDrawer();
            if (drawer.getSymmetricalDrawType() !== SymmetryType.UpRightToDownLeft) {
                drawer.setSymmetricalDrawType(SymmetryType.UpRightToDownLeft);
            } else {
                drawer.setSymmetricalDrawType(SymmetryType.None);
            }
            this._updateGroupBoxes();
        }

        private _onNotifyLanguageChanged(e: egret.Event): void {
            this._updateComponentsForLanguage();
        }

        private _updateComponentsForLanguage(): void {
            this._labelUpDownTitle.text             = Lang.getText(Lang.Type.B0308);
            this._labelLeftRightTitle.text          = Lang.getText(Lang.Type.B0309);
            this._labelRotationalTitle.text         = Lang.getText(Lang.Type.B0310);
            this._labelUpLeftDownRightTitle.text    = Lang.getText(Lang.Type.B0311);
            this._labelUpRightDownLeftTitle.text    = Lang.getText(Lang.Type.B0312);
            this._labelUpDownAuto.text              = Lang.getText(Lang.Type.B0307);
            this._labelLeftRightAuto.text           = Lang.getText(Lang.Type.B0307);
            this._labelRotationalAuto.text          = Lang.getText(Lang.Type.B0307);
            this._labelUpLeftDownRightAuto.text     = Lang.getText(Lang.Type.B0307);
            this._labelUpRightDownLeftAuto.text     = Lang.getText(Lang.Type.B0307);
        }

        private _updateGroupBoxes(): void {
            this._updateGroupUpDownBox();
            this._updateGroupLeftRightBox();
            this._updateGroupRotationalBox();
            this._updateGroupUpLeftDownRightBox();
            this._updateGroupUpRightDownLeftBox();
        }

        private _updateGroupLeftRight(): void {
            const count = this._asymmetricalCounters.LeftToRight;
            const label = this._labelLeftRightRate;
            if (count == null) {
                label.text      = "----";
                label.textColor = 0xffffff;
            } else {
                label.text      = "" + count;
                label.textColor = count > 0 ? 0xff0000 : 0x00ff00;
            }
            this._updateGroupLeftRightBox();
        }
        private _updateGroupLeftRightBox(): void {
            this._imgLeftRight.visible = this._war.getDrawer().getSymmetricalDrawType() === SymmetryType.LeftToRight;
        }

        private _updateGroupUpDown(): void {
            const count = this._asymmetricalCounters.UpToDown;
            const label = this._labelUpDownRate;
            if (count == null) {
                label.text      = "----";
                label.textColor = 0xffffff;
            } else {
                label.text      = "" + count;
                label.textColor = count > 0 ? 0xff0000 : 0x00ff00;
            }
            this._updateGroupUpDownBox();
        }
        private _updateGroupUpDownBox(): void {
            this._imgUpDown.visible = this._war.getDrawer().getSymmetricalDrawType() === SymmetryType.UpToDown;
        }

        private _updateGroupRotational(): void {
            const count = this._asymmetricalCounters.Rotation;
            const label = this._labelRotationalRate;
            if (count == null) {
                label.text      = "----";
                label.textColor = 0xffffff;
            } else {
                label.text      = "" + count;
                label.textColor = count > 0 ? 0xff0000 : 0x00ff00;
            }
            this._updateGroupRotationalBox();
        }
        private _updateGroupRotationalBox(): void {
            this._imgRotational.visible = this._war.getDrawer().getSymmetricalDrawType() === SymmetryType.Rotation;
        }

        private _updateGroupUpLeftDownRight(): void {
            const count = this._asymmetricalCounters.UpLeftToDownRight;
            const label = this._labelUpLeftDownRightRate;
            if (count == null) {
                label.text      = "----";
                label.textColor = 0xffffff;
            } else {
                label.text      = "" + count;
                label.textColor = count > 0 ? 0xff0000 : 0x00ff00;
            }
            this._updateGroupUpLeftDownRightBox();
        }
        private _updateGroupUpLeftDownRightBox(): void {
            const war       = this._war;
            const mapSize   = war.getTileMap().getMapSize();
            if (mapSize.width !== mapSize.height) {
                this._groupUpLeftDownRightBox.visible = false;
            } else {
                this._groupUpLeftDownRightBox.visible   = true;
                this._imgUpLeftDownRight.visible        = war.getDrawer().getSymmetricalDrawType() === SymmetryType.UpLeftToDownRight;
            }
        }

        private _updateGroupUpRightDownLeft(): void {
            const count = this._asymmetricalCounters.UpRightToDownLeft;
            const label = this._labelUpRightDownLeftRate;
            if (count == null) {
                label.text      = "----";
                label.textColor = 0xffffff;
            } else {
                label.text      = "" + count;
                label.textColor = count > 0 ? 0xff0000 : 0x00ff00;
            }
            this._updateGroupUpRightDownLeftBox();
        }
        private _updateGroupUpRightDownLeftBox(): void {
            const war       = this._war;
            const mapSize   = war.getTileMap().getMapSize();
            if (mapSize.width !== mapSize.height) {
                this._groupUpRightDownLeftBox.visible = false;
            } else {
                this._groupUpRightDownLeftBox.visible   = true;
                this._imgUpRightDownLeft.visible        = war.getDrawer().getSymmetricalDrawType() === SymmetryType.UpRightToDownLeft;
            }
        }
    }
}
