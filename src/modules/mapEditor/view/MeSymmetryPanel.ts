
import Helpers              from "../../tools/helpers/Helpers";
import Types                from "../../tools/helpers/Types";
import Lang                 from "../../tools/lang/Lang";
import TwnsLangTextType     from "../../tools/lang/LangTextType";
import TwnsNotifyType       from "../../tools/notify/NotifyType";
import TwnsUiImage          from "../../tools/ui/UiImage";
import TwnsUiLabel          from "../../tools/ui/UiLabel";
import TwnsUiPanel          from "../../tools/ui/UiPanel";
import MeModel              from "../model/MeModel";
import MeUtility            from "../model/MeUtility";
import TwnsMeWar            from "../model/MeWar";

namespace TwnsMeSymmetryPanel {
    import MeWar        = TwnsMeWar.MeWar;
    import LangTextType = TwnsLangTextType.LangTextType;
    import NotifyType   = TwnsNotifyType.NotifyType;
    import SymmetryType = Types.SymmetryType;

    export class MeSymmetryPanel extends TwnsUiPanel.UiPanel<void> {
        protected readonly _LAYER_TYPE   = Types.LayerType.Hud3;
        protected readonly _IS_EXCLUSIVE = false;

        private static _instance: MeSymmetryPanel;

        private readonly _groupLeftRight!               : eui.Group;
        private readonly _labelLeftRightTitle!          : TwnsUiLabel.UiLabel;
        private readonly _labelLeftRightRate!           : TwnsUiLabel.UiLabel;
        private readonly _groupLeftRightBox!            : eui.Group;
        private readonly _imgLeftRight!                 : TwnsUiImage.UiImage;
        private readonly _labelLeftRightAuto!           : TwnsUiLabel.UiLabel;

        private readonly _groupUpDown!                  : eui.Group;
        private readonly _labelUpDownTitle!             : TwnsUiLabel.UiLabel;
        private readonly _labelUpDownRate!              : TwnsUiLabel.UiLabel;
        private readonly _groupUpDownBox!               : eui.Group;
        private readonly _imgUpDown!                    : TwnsUiImage.UiImage;
        private readonly _labelUpDownAuto!              : TwnsUiLabel.UiLabel;

        private readonly _groupRotational!              : eui.Group;
        private readonly _labelRotationalTitle!         : TwnsUiLabel.UiLabel;
        private readonly _labelRotationalRate!          : TwnsUiLabel.UiLabel;
        private readonly _groupRotationalBox!           : eui.Group;
        private readonly _imgRotational!                : TwnsUiImage.UiImage;
        private readonly _labelRotationalAuto!          : TwnsUiLabel.UiLabel;

        private readonly _groupUpLeftDownRight!         : eui.Group;
        private readonly _labelUpLeftDownRightTitle!    : TwnsUiLabel.UiLabel;
        private readonly _labelUpLeftDownRightRate!     : TwnsUiLabel.UiLabel;
        private readonly _groupUpLeftDownRightBox!      : eui.Group;
        private readonly _imgUpLeftDownRight!           : TwnsUiImage.UiImage;
        private readonly _labelUpLeftDownRightAuto!     : TwnsUiLabel.UiLabel;

        private readonly _groupUpRightDownLeft!         : eui.Group;
        private readonly _labelUpRightDownLeftTitle!    : TwnsUiLabel.UiLabel;
        private readonly _labelUpRightDownLeftRate!     : TwnsUiLabel.UiLabel;
        private readonly _groupUpRightDownLeftBox!      : eui.Group;
        private readonly _imgUpRightDownLeft!           : TwnsUiImage.UiImage;
        private readonly _labelUpRightDownLeftAuto!     : TwnsUiLabel.UiLabel;

        private _asymmetricalCounters   : MeUtility.AsymmetricalCounters | null = null;

        public static show(): void {
            if (!MeSymmetryPanel._instance) {
                MeSymmetryPanel._instance = new MeSymmetryPanel();
            }
            MeSymmetryPanel._instance.open();
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
            this.skinName = "resource/skins/mapEditor/MeSymmetryPanel.exml";
        }

        protected _onOpened(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,    callback: this._onNotifyLanguageChanged },
            ]);
            this._setUiListenerArray([
                { ui: this._groupLeftRightBox,          callback: this._onTouchedGroupLeftRightBox, },
                { ui: this._groupUpDownBox,             callback: this._onTouchedGroupUpDownBox, },
                { ui: this._groupRotationalBox,         callback: this._onTouchedGroupRotationalBox },
                { ui: this._groupUpLeftDownRightBox,    callback: this._onTouchedGroupUpLeftDownRightBox },
                { ui: this._groupUpRightDownLeftBox,    callback: this._onTouchedGroupUpRightDownLeftBox },
            ]);

            this._updateComponentsForLanguage();

            this._asymmetricalCounters  = MeUtility.getAsymmetricalCounters(this._getWar());

            this._updateGroupLeftRight();
            this._updateGroupUpDown();
            this._updateGroupRotational();
            this._updateGroupUpLeftDownRight();
            this._updateGroupUpRightDownLeft();
        }

        private _getWar(): MeWar {
            return Helpers.getExisted(MeModel.getWar());
        }

        private _onTouchedGroupLeftRightBox(): void {
            const drawer = this._getWar().getDrawer();
            if (drawer.getSymmetricalDrawType() !== SymmetryType.LeftToRight) {
                drawer.setSymmetricalDrawType(SymmetryType.LeftToRight);
            } else {
                drawer.setSymmetricalDrawType(SymmetryType.None);
            }
            this._updateGroupBoxes();
        }
        private _onTouchedGroupUpDownBox(): void {
            const drawer = this._getWar().getDrawer();
            if (drawer.getSymmetricalDrawType() !== SymmetryType.UpToDown) {
                drawer.setSymmetricalDrawType(SymmetryType.UpToDown);
            } else {
                drawer.setSymmetricalDrawType(SymmetryType.None);
            }
            this._updateGroupBoxes();
        }
        private _onTouchedGroupRotationalBox(): void {
            const drawer = this._getWar().getDrawer();
            if (drawer.getSymmetricalDrawType() !== SymmetryType.Rotation) {
                drawer.setSymmetricalDrawType(SymmetryType.Rotation);
            } else {
                drawer.setSymmetricalDrawType(SymmetryType.None);
            }
            this._updateGroupBoxes();
        }
        private _onTouchedGroupUpLeftDownRightBox(): void {
            const drawer = this._getWar().getDrawer();
            if (drawer.getSymmetricalDrawType() !== SymmetryType.UpLeftToDownRight) {
                drawer.setSymmetricalDrawType(SymmetryType.UpLeftToDownRight);
            } else {
                drawer.setSymmetricalDrawType(SymmetryType.None);
            }
            this._updateGroupBoxes();
        }
        private _onTouchedGroupUpRightDownLeftBox(): void {
            const drawer = this._getWar().getDrawer();
            if (drawer.getSymmetricalDrawType() !== SymmetryType.UpRightToDownLeft) {
                drawer.setSymmetricalDrawType(SymmetryType.UpRightToDownLeft);
            } else {
                drawer.setSymmetricalDrawType(SymmetryType.None);
            }
            this._updateGroupBoxes();
        }

        private _onNotifyLanguageChanged(): void {
            this._updateComponentsForLanguage();
        }

        private _updateComponentsForLanguage(): void {
            this._labelUpDownTitle.text             = Lang.getText(LangTextType.B0308);
            this._labelLeftRightTitle.text          = Lang.getText(LangTextType.B0309);
            this._labelRotationalTitle.text         = Lang.getText(LangTextType.B0310);
            this._labelUpLeftDownRightTitle.text    = Lang.getText(LangTextType.B0311);
            this._labelUpRightDownLeftTitle.text    = Lang.getText(LangTextType.B0312);
            this._labelUpDownAuto.text              = Lang.getText(LangTextType.B0307);
            this._labelLeftRightAuto.text           = Lang.getText(LangTextType.B0307);
            this._labelRotationalAuto.text          = Lang.getText(LangTextType.B0307);
            this._labelUpLeftDownRightAuto.text     = Lang.getText(LangTextType.B0307);
            this._labelUpRightDownLeftAuto.text     = Lang.getText(LangTextType.B0307);
        }

        private _updateGroupBoxes(): void {
            this._updateGroupUpDownBox();
            this._updateGroupLeftRightBox();
            this._updateGroupRotationalBox();
            this._updateGroupUpLeftDownRightBox();
            this._updateGroupUpRightDownLeftBox();
        }

        private _updateGroupLeftRight(): void {
            const count = this._asymmetricalCounters?.LeftToRight;
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
            this._imgLeftRight.visible = this._getWar().getDrawer().getSymmetricalDrawType() === SymmetryType.LeftToRight;
        }

        private _updateGroupUpDown(): void {
            const count = this._asymmetricalCounters?.UpToDown;
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
            this._imgUpDown.visible = this._getWar().getDrawer().getSymmetricalDrawType() === SymmetryType.UpToDown;
        }

        private _updateGroupRotational(): void {
            const count = this._asymmetricalCounters?.Rotation;
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
            this._imgRotational.visible = this._getWar().getDrawer().getSymmetricalDrawType() === SymmetryType.Rotation;
        }

        private _updateGroupUpLeftDownRight(): void {
            const count = this._asymmetricalCounters?.UpLeftToDownRight;
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
            const war       = this._getWar();
            const mapSize   = war.getTileMap().getMapSize();
            if (mapSize.width !== mapSize.height) {
                this._groupUpLeftDownRightBox.visible = false;
            } else {
                this._groupUpLeftDownRightBox.visible   = true;
                this._imgUpLeftDownRight.visible        = war.getDrawer().getSymmetricalDrawType() === SymmetryType.UpLeftToDownRight;
            }
        }

        private _updateGroupUpRightDownLeft(): void {
            const count = this._asymmetricalCounters?.UpRightToDownLeft;
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
            const war       = this._getWar();
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

export default TwnsMeSymmetryPanel;
