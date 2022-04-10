
// import Helpers              from "../../tools/helpers/Helpers";
// import Types                from "../../tools/helpers/Types";
// import Lang                 from "../../tools/lang/Lang";
// import TwnsLangTextType     from "../../tools/lang/LangTextType";
// import TwnsNotifyType       from "../../tools/notify/NotifyType";
// import TwnsUiImage          from "../../tools/ui/UiImage";
// import TwnsUiLabel          from "../../tools/ui/UiLabel";
// import TwnsUiPanel          from "../../tools/ui/UiPanel";
// import MeModel              from "../model/MeModel";
// import MeUtility            from "../model/MeUtility";
// import TwnsMeWar            from "../model/MeWar";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace TwnsMeSymmetryPanel {
    import MeWar        = Twns.MapEditor.MeWar;
    import LangTextType = TwnsLangTextType.LangTextType;
    import NotifyType   = TwnsNotifyType.NotifyType;
    import SymmetryType = Types.SymmetryType;
    import GridIndex    = Types.GridIndex;

    export type OpenData = void;
    export class MeSymmetryPanel extends TwnsUiPanel.UiPanel<OpenData> {
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

        private readonly _labelFill1!                   : TwnsUiLabel.UiLabel;
        private readonly _btnUpDown1!                   : TwnsUiButton.UiButton;
        private readonly _btnDownUp1!                   : TwnsUiButton.UiButton;
        private readonly _btnLeftRight1!                : TwnsUiButton.UiButton;
        private readonly _btnRightLeft1!                : TwnsUiButton.UiButton;
        private readonly _btnUpLeftDownRight1!          : TwnsUiButton.UiButton;
        private readonly _btnDownRightUpLeft1!          : TwnsUiButton.UiButton;
        private readonly _btnUpRightDownLeft1!          : TwnsUiButton.UiButton;
        private readonly _btnDownLeftUpRight1!          : TwnsUiButton.UiButton;

        private readonly _labelFill2!                   : TwnsUiLabel.UiLabel;
        private readonly _btnUpDown2!                   : TwnsUiButton.UiButton;
        private readonly _btnDownUp2!                   : TwnsUiButton.UiButton;
        private readonly _btnLeftRight2!                : TwnsUiButton.UiButton;
        private readonly _btnRightLeft2!                : TwnsUiButton.UiButton;
        private readonly _btnUpLeftDownRight2!          : TwnsUiButton.UiButton;
        private readonly _btnDownRightUpLeft2!          : TwnsUiButton.UiButton;
        private readonly _btnUpRightDownLeft2!          : TwnsUiButton.UiButton;
        private readonly _btnDownLeftUpRight2!          : TwnsUiButton.UiButton;

        private _asymmetricalCounters   : MeUtility.AsymmetricalCounters | null = null;

        protected _onOpening(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,    callback: this._onNotifyLanguageChanged },
            ]);
            this._setUiListenerArray([
                { ui: this._groupLeftRightBox,          callback: this._onTouchedGroupLeftRightBox, },
                { ui: this._groupUpDownBox,             callback: this._onTouchedGroupUpDownBox, },
                { ui: this._groupRotationalBox,         callback: this._onTouchedGroupRotationalBox },
                { ui: this._groupUpLeftDownRightBox,    callback: this._onTouchedGroupUpLeftDownRightBox },
                { ui: this._groupUpRightDownLeftBox,    callback: this._onTouchedGroupUpRightDownLeftBox },

                { ui: this._btnUpDown1,                 callback: this._onTouchedBtnUpDown1 },
                { ui: this._btnDownUp1,                 callback: this._onTouchedBtnDownUp1 },
                { ui: this._btnLeftRight1,              callback: this._onTouchedBtnLeftRight1 },
                { ui: this._btnRightLeft1,              callback: this._onTouchedBtnRightLeft1 },
                { ui: this._btnUpLeftDownRight1,        callback: this._onTouchedBtnUpLeftDownRight1 },
                { ui: this._btnDownRightUpLeft1,        callback: this._onTouchedBtnDownRightUpLeft1 },
                { ui: this._btnUpRightDownLeft1,        callback: this._onTouchedBtnUpRightDownLeft1 },
                { ui: this._btnDownLeftUpRight1,        callback: this._onTouchedBtnDownLeftUpRight1 },

                { ui: this._btnUpDown2,                 callback: this._onTouchedBtnUpDown2 },
                { ui: this._btnDownUp2,                 callback: this._onTouchedBtnDownUp2 },
                { ui: this._btnLeftRight2,              callback: this._onTouchedBtnLeftRight2 },
                { ui: this._btnRightLeft2,              callback: this._onTouchedBtnRightLeft2 },
                { ui: this._btnUpLeftDownRight2,        callback: this._onTouchedBtnUpLeftDownRight2 },
                { ui: this._btnDownRightUpLeft2,        callback: this._onTouchedBtnDownRightUpLeft2 },
                { ui: this._btnUpRightDownLeft2,        callback: this._onTouchedBtnUpRightDownLeft2 },
                { ui: this._btnDownLeftUpRight2,        callback: this._onTouchedBtnDownLeftUpRight2 },
            ]);
            this._setIsTouchMaskEnabled();
            this._setIsCloseOnTouchedMask();
        }
        protected async _updateOnOpenDataChanged(): Promise<void> {
            this._updateComponentsForLanguage();

            this._asymmetricalCounters  = MeUtility.getAsymmetricalCounters(this._getWar());

            this._updateGroupLeftRight();
            this._updateGroupUpDown();
            this._updateGroupRotational();
            this._updateGroupUpLeftDownRight();
            this._updateGroupUpRightDownLeft();
        }
        protected _onClosing(): void {
            // nothing to do
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

        private _onTouchedBtnUpDown1(): void {
            TwnsPanelManager.open(TwnsPanelConfig.Dict.CommonConfirmPanel, {
                title   : Lang.getText(LangTextType.B0864),
                content : Lang.getText(LangTextType.A0225),
                callback: () => {
                    const war           = this._getWar();
                    const mapSize       = war.getTileMap().getMapSize();
                    const mapWidth      = mapSize.width;
                    const mapHeight     = mapSize.height;
                    for (let x = 0; x < mapWidth; ++x) {
                        for (let y = Math.floor((mapHeight + 1) / 2); y < mapHeight; ++y) {
                            autoFillTile(war, { x, y }, SymmetryType.UpToDown);
                        }
                    }

                    this.close();
                },
            });
        }
        private _onTouchedBtnDownUp1(): void {
            TwnsPanelManager.open(TwnsPanelConfig.Dict.CommonConfirmPanel, {
                title   : Lang.getText(LangTextType.B0865),
                content : Lang.getText(LangTextType.A0225),
                callback: () => {
                    const war           = this._getWar();
                    const mapSize       = war.getTileMap().getMapSize();
                    const mapWidth      = mapSize.width;
                    const mapHeight     = mapSize.height;
                    for (let x = 0; x < mapWidth; ++x) {
                        for (let y = Math.floor(mapHeight / 2) - 1; y >= 0; --y) {
                            autoFillTile(war, { x, y }, SymmetryType.UpToDown);
                        }
                    }

                    this.close();
                },
            });
        }
        private _onTouchedBtnLeftRight1(): void {
            TwnsPanelManager.open(TwnsPanelConfig.Dict.CommonConfirmPanel, {
                title   : Lang.getText(LangTextType.B0866),
                content : Lang.getText(LangTextType.A0225),
                callback: () => {
                    const war           = this._getWar();
                    const mapSize       = war.getTileMap().getMapSize();
                    const mapWidth      = mapSize.width;
                    const mapHeight     = mapSize.height;
                    for (let x = Math.floor((mapWidth + 1) / 2); x < mapWidth; ++x) {
                        for (let y = 0; y < mapHeight; ++y) {
                            autoFillTile(war, { x, y }, SymmetryType.LeftToRight);
                        }
                    }

                    this.close();
                },
            });
        }
        private _onTouchedBtnRightLeft1(): void {
            TwnsPanelManager.open(TwnsPanelConfig.Dict.CommonConfirmPanel, {
                title   : Lang.getText(LangTextType.B0867),
                content : Lang.getText(LangTextType.A0225),
                callback: () => {
                    const war           = this._getWar();
                    const mapSize       = war.getTileMap().getMapSize();
                    const mapWidth      = mapSize.width;
                    const mapHeight     = mapSize.height;
                    for (let x = Math.floor(mapWidth / 2) - 1; x >= 0; --x) {
                        for (let y = 0; y < mapHeight; ++y) {
                            autoFillTile(war, { x, y }, SymmetryType.LeftToRight);
                        }
                    }

                    this.close();
                },
            });
        }
        private _onTouchedBtnUpLeftDownRight1(): void {
            const war           = this._getWar();
            const mapSize       = war.getTileMap().getMapSize();
            const mapWidth      = mapSize.width;
            const mapHeight     = mapSize.height;
            if (mapWidth !== mapHeight) {
                FloatText.show(Lang.getText(LangTextType.A0295));
                return;
            }

            TwnsPanelManager.open(TwnsPanelConfig.Dict.CommonConfirmPanel, {
                title   : Lang.getText(LangTextType.B0868),
                content : Lang.getText(LangTextType.A0225),
                callback: () => {
                    for (let x = 1; x < mapWidth; ++x) {
                        for (let y = mapHeight - x; y < mapHeight; ++y) {
                            autoFillTile(war, { x, y }, SymmetryType.UpLeftToDownRight);
                        }
                    }

                    this.close();
                },
            });
        }
        private _onTouchedBtnDownRightUpLeft1(): void {
            const war           = this._getWar();
            const mapSize       = war.getTileMap().getMapSize();
            const mapWidth      = mapSize.width;
            const mapHeight     = mapSize.height;
            if (mapWidth !== mapHeight) {
                FloatText.show(Lang.getText(LangTextType.A0295));
                return;
            }

            TwnsPanelManager.open(TwnsPanelConfig.Dict.CommonConfirmPanel, {
                title   : Lang.getText(LangTextType.B0869),
                content : Lang.getText(LangTextType.A0225),
                callback: () => {
                    for (let x = 0; x < mapWidth - 1; ++x) {
                        for (let y = 0; y < mapWidth - x - 1; ++y) {
                            autoFillTile(war, { x, y }, SymmetryType.UpLeftToDownRight);
                        }
                    }

                    this.close();
                },
            });
        }
        private _onTouchedBtnUpRightDownLeft1(): void {
            const war           = this._getWar();
            const mapSize       = war.getTileMap().getMapSize();
            const mapWidth      = mapSize.width;
            const mapHeight     = mapSize.height;
            if (mapWidth !== mapHeight) {
                FloatText.show(Lang.getText(LangTextType.A0295));
                return;
            }

            TwnsPanelManager.open(TwnsPanelConfig.Dict.CommonConfirmPanel, {
                title   : Lang.getText(LangTextType.B0870),
                content : Lang.getText(LangTextType.A0225),
                callback: () => {
                    for (let x = 0; x < mapWidth - 1; ++x) {
                        for (let y = x + 1; y < mapHeight; ++y) {
                            autoFillTile(war, { x, y }, SymmetryType.UpRightToDownLeft);
                        }
                    }

                    this.close();
                },
            });
        }
        private _onTouchedBtnDownLeftUpRight1(): void {
            const war           = this._getWar();
            const mapSize       = war.getTileMap().getMapSize();
            const mapWidth      = mapSize.width;
            const mapHeight     = mapSize.height;
            if (mapWidth !== mapHeight) {
                FloatText.show(Lang.getText(LangTextType.A0295));
                return;
            }

            TwnsPanelManager.open(TwnsPanelConfig.Dict.CommonConfirmPanel, {
                title   : Lang.getText(LangTextType.B0871),
                content : Lang.getText(LangTextType.A0225),
                callback: () => {
                    for (let x = 1; x < mapWidth; ++x) {
                        for (let y = 0; y < x; ++y) {
                            autoFillTile(war, { x, y }, SymmetryType.UpRightToDownLeft);
                        }
                    }

                    this.close();
                },
            });
        }

        private _onTouchedBtnUpDown2(): void {
            TwnsPanelManager.open(TwnsPanelConfig.Dict.CommonConfirmPanel, {
                title   : Lang.getText(LangTextType.B0864),
                content : Lang.getText(LangTextType.A0225),
                callback: () => {
                    const war           = this._getWar();
                    const mapSize       = war.getTileMap().getMapSize();
                    const mapWidth      = mapSize.width;
                    const mapHeight     = mapSize.height;
                    for (let x = 0; x < mapWidth; ++x) {
                        for (let y = Math.floor((mapHeight + 1) / 2); y < mapHeight; ++y) {
                            autoFillTile(war, { x, y }, SymmetryType.Rotation);
                        }
                    }

                    this.close();
                },
            });
        }
        private _onTouchedBtnDownUp2(): void {
            TwnsPanelManager.open(TwnsPanelConfig.Dict.CommonConfirmPanel, {
                title   : Lang.getText(LangTextType.B0865),
                content : Lang.getText(LangTextType.A0225),
                callback: () => {
                    const war           = this._getWar();
                    const mapSize       = war.getTileMap().getMapSize();
                    const mapWidth      = mapSize.width;
                    const mapHeight     = mapSize.height;
                    for (let x = 0; x < mapWidth; ++x) {
                        for (let y = Math.floor(mapHeight / 2) - 1; y >= 0; --y) {
                            autoFillTile(war, { x, y }, SymmetryType.Rotation);
                        }
                    }

                    this.close();
                },
            });
        }
        private _onTouchedBtnLeftRight2(): void {
            TwnsPanelManager.open(TwnsPanelConfig.Dict.CommonConfirmPanel, {
                title   : Lang.getText(LangTextType.B0866),
                content : Lang.getText(LangTextType.A0225),
                callback: () => {
                    const war           = this._getWar();
                    const mapSize       = war.getTileMap().getMapSize();
                    const mapWidth      = mapSize.width;
                    const mapHeight     = mapSize.height;
                    for (let x = Math.floor((mapWidth + 1) / 2); x < mapWidth; ++x) {
                        for (let y = 0; y < mapHeight; ++y) {
                            autoFillTile(war, { x, y }, SymmetryType.Rotation);
                        }
                    }

                    this.close();
                },
            });
        }
        private _onTouchedBtnRightLeft2(): void {
            TwnsPanelManager.open(TwnsPanelConfig.Dict.CommonConfirmPanel, {
                title   : Lang.getText(LangTextType.B0867),
                content : Lang.getText(LangTextType.A0225),
                callback: () => {
                    const war           = this._getWar();
                    const mapSize       = war.getTileMap().getMapSize();
                    const mapWidth      = mapSize.width;
                    const mapHeight     = mapSize.height;
                    for (let x = Math.floor(mapWidth / 2) - 1; x >= 0; --x) {
                        for (let y = 0; y < mapHeight; ++y) {
                            autoFillTile(war, { x, y }, SymmetryType.Rotation);
                        }
                    }

                    this.close();
                },
            });
        }
        private _onTouchedBtnUpLeftDownRight2(): void {
            const war           = this._getWar();
            const mapSize       = war.getTileMap().getMapSize();
            const mapWidth      = mapSize.width;
            const mapHeight     = mapSize.height;
            if (mapWidth !== mapHeight) {
                FloatText.show(Lang.getText(LangTextType.A0295));
                return;
            }

            TwnsPanelManager.open(TwnsPanelConfig.Dict.CommonConfirmPanel, {
                title   : Lang.getText(LangTextType.B0868),
                content : Lang.getText(LangTextType.A0225),
                callback: () => {
                    for (let x = 1; x < mapWidth; ++x) {
                        for (let y = mapHeight - x; y < mapHeight; ++y) {
                            autoFillTile(war, { x, y }, SymmetryType.Rotation);
                        }
                    }

                    this.close();
                },
            });
        }
        private _onTouchedBtnDownRightUpLeft2(): void {
            const war           = this._getWar();
            const mapSize       = war.getTileMap().getMapSize();
            const mapWidth      = mapSize.width;
            const mapHeight     = mapSize.height;
            if (mapWidth !== mapHeight) {
                FloatText.show(Lang.getText(LangTextType.A0295));
                return;
            }

            TwnsPanelManager.open(TwnsPanelConfig.Dict.CommonConfirmPanel, {
                title   : Lang.getText(LangTextType.B0869),
                content : Lang.getText(LangTextType.A0225),
                callback: () => {
                    for (let x = 0; x < mapWidth - 1; ++x) {
                        for (let y = 0; y < mapWidth - x - 1; ++y) {
                            autoFillTile(war, { x, y }, SymmetryType.Rotation);
                        }
                    }

                    this.close();
                },
            });
        }
        private _onTouchedBtnUpRightDownLeft2(): void {
            const war           = this._getWar();
            const mapSize       = war.getTileMap().getMapSize();
            const mapWidth      = mapSize.width;
            const mapHeight     = mapSize.height;
            if (mapWidth !== mapHeight) {
                FloatText.show(Lang.getText(LangTextType.A0295));
                return;
            }

            TwnsPanelManager.open(TwnsPanelConfig.Dict.CommonConfirmPanel, {
                title   : Lang.getText(LangTextType.B0870),
                content : Lang.getText(LangTextType.A0225),
                callback: () => {
                    for (let x = 0; x < mapWidth - 1; ++x) {
                        for (let y = x + 1; y < mapHeight; ++y) {
                            autoFillTile(war, { x, y }, SymmetryType.Rotation);
                        }
                    }

                    this.close();
                },
            });
        }
        private _onTouchedBtnDownLeftUpRight2(): void {
            const war           = this._getWar();
            const mapSize       = war.getTileMap().getMapSize();
            const mapWidth      = mapSize.width;
            const mapHeight     = mapSize.height;
            if (mapWidth !== mapHeight) {
                FloatText.show(Lang.getText(LangTextType.A0295));
                return;
            }

            TwnsPanelManager.open(TwnsPanelConfig.Dict.CommonConfirmPanel, {
                title   : Lang.getText(LangTextType.B0871),
                content : Lang.getText(LangTextType.A0225),
                callback: () => {
                    for (let x = 1; x < mapWidth; ++x) {
                        for (let y = 0; y < x; ++y) {
                            autoFillTile(war, { x, y }, SymmetryType.Rotation);
                        }
                    }

                    this.close();
                },
            });
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
            this._labelFill1.text                   = Lang.getText(LangTextType.B0862);
            this._labelFill2.text                   = Lang.getText(LangTextType.B0863);
            this._btnUpDown1.label                  = Lang.getText(LangTextType.B0864);
            this._btnDownUp1.label                  = Lang.getText(LangTextType.B0865);
            this._btnLeftRight1.label               = Lang.getText(LangTextType.B0866);
            this._btnRightLeft1.label               = Lang.getText(LangTextType.B0867);
            this._btnUpLeftDownRight1.label         = Lang.getText(LangTextType.B0868);
            this._btnDownRightUpLeft1.label         = Lang.getText(LangTextType.B0869);
            this._btnUpRightDownLeft1.label         = Lang.getText(LangTextType.B0870);
            this._btnDownLeftUpRight1.label         = Lang.getText(LangTextType.B0871);
            this._btnUpDown2.label                  = Lang.getText(LangTextType.B0864);
            this._btnDownUp2.label                  = Lang.getText(LangTextType.B0865);
            this._btnLeftRight2.label               = Lang.getText(LangTextType.B0866);
            this._btnRightLeft2.label               = Lang.getText(LangTextType.B0867);
            this._btnUpLeftDownRight2.label         = Lang.getText(LangTextType.B0868);
            this._btnDownRightUpLeft2.label         = Lang.getText(LangTextType.B0869);
            this._btnUpRightDownLeft2.label         = Lang.getText(LangTextType.B0870);
            this._btnDownLeftUpRight2.label         = Lang.getText(LangTextType.B0871);
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

    function autoFillTile(war: Twns.BaseWar.BwWar, dstGridIndex: GridIndex, symmetryType: SymmetryType): void {
        const tileMap               = war.getTileMap();
        const dstTile               = tileMap.getTile(dstGridIndex);
        const srcTile               = tileMap.getTile(Helpers.getExisted(MeUtility.getSymmetricalGridIndex(dstGridIndex, symmetryType, tileMap.getMapSize())));
        const tileData              = Helpers.deepClone(srcTile.serialize());
        const decoratorType         = srcTile.getDecoratorType();
        const decoratorShapeId      = srcTile.getDecoratorShapeId();
        const objectType            = srcTile.getObjectType();
        tileData.gridIndex          = dstGridIndex;
        tileData.isHighlighted      = dstTile.getIsHighlighted();
        tileData.locationFlags      = dstTile.getLocationFlags();
        tileData.baseShapeId        = Twns.Config.ConfigManager.getSymmetricalTileBaseShapeId(srcTile.getBaseType(), srcTile.getBaseShapeId(), symmetryType);
        tileData.objectType         = Twns.Config.ConfigManager.getSymmetricalTileObjectType(objectType, symmetryType);
        tileData.objectShapeId      = Twns.Config.ConfigManager.getSymmetricalTileObjectShapeId(objectType, srcTile.getObjectShapeId(), symmetryType);
        if ((decoratorType != null) && (decoratorShapeId != null)) {
            tileData.decoratorShapeId = Twns.Config.ConfigManager.getSymmetricalTileDecoratorShapeId(decoratorType, decoratorShapeId, symmetryType);
        }

        if ((srcTile.getMaxHp() !== null) && (war.getUnitMap().getUnitOnMap(dstGridIndex))) {
            WarDestructionHelpers.destroyUnitOnMap(war, dstGridIndex, true);
        }
        dstTile.init(tileData, war.getGameConfig());
        dstTile.startRunning(war);
        dstTile.flushDataToView();
    }
}

// export default TwnsMeSymmetryPanel;
