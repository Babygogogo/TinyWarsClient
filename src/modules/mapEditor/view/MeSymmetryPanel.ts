
import { UiImage }                      from "../../../utility/ui/UiImage";
import { UiPanel }                      from "../../../utility/ui/UiPanel";
import { UiLabel }                      from "../../../utility/ui/UiLabel";
import { MeWar }                        from "../model/MeWar";
import { Lang }                         from "../../../utility/lang/Lang";
import { TwnsLangTextType } from "../../../utility/lang/LangTextType";
import LangTextType         = TwnsLangTextType.LangTextType;
import { Notify }                       from "../../../utility/notify/Notify";
import { TwnsNotifyType } from "../../../utility/notify/NotifyType";
import NotifyType       = TwnsNotifyType.NotifyType;
import { Types }                        from "../../../utility/Types";
import { MeModel }                      from "../model/MeModel";
import * as MeUtility                   from "../model/MeUtility";
import SymmetryType                     = Types.SymmetryType;

export class MeSymmetryPanel extends UiPanel<void> {
    protected readonly _LAYER_TYPE   = Types.LayerType.Hud3;
    protected readonly _IS_EXCLUSIVE = false;

    private static _instance: MeSymmetryPanel;

    private _groupLeftRight             : eui.Group;
    private _labelLeftRightTitle        : UiLabel;
    private _labelLeftRightRate         : UiLabel;
    private _groupLeftRightBox          : eui.Group;
    private _imgLeftRight               : UiImage;
    private _labelLeftRightAuto         : UiLabel;

    private _groupUpDown                : eui.Group;
    private _labelUpDownTitle           : UiLabel;
    private _labelUpDownRate            : UiLabel;
    private _groupUpDownBox             : eui.Group;
    private _imgUpDown                  : UiImage;
    private _labelUpDownAuto            : UiLabel;

    private _groupRotational            : eui.Group;
    private _labelRotationalTitle       : UiLabel;
    private _labelRotationalRate        : UiLabel;
    private _groupRotationalBox         : eui.Group;
    private _imgRotational              : UiImage;
    private _labelRotationalAuto        : UiLabel;

    private _groupUpLeftDownRight       : eui.Group;
    private _labelUpLeftDownRightTitle  : UiLabel;
    private _labelUpLeftDownRightRate   : UiLabel;
    private _groupUpLeftDownRightBox    : eui.Group;
    private _imgUpLeftDownRight         : UiImage;
    private _labelUpLeftDownRightAuto   : UiLabel;

    private _groupUpRightDownLeft       : eui.Group;
    private _labelUpRightDownLeftTitle  : UiLabel;
    private _labelUpRightDownLeftRate   : UiLabel;
    private _groupUpRightDownLeftBox    : eui.Group;
    private _imgUpRightDownLeft         : UiImage;
    private _labelUpRightDownLeftAuto   : UiLabel;

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
