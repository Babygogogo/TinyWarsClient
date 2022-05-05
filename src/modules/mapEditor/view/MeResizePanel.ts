
// import CommonConstants      from "../../tools/helpers/CommonConstants";
// import FloatText            from "../../tools/helpers/FloatText";
// import Helpers              from "../../tools/helpers/Helpers";
// import Types                from "../../tools/helpers/Types";
// import Lang                 from "../../tools/lang/Lang";
// import TwnsLangTextType     from "../../tools/lang/LangTextType";
// import Twns.Notify       from "../../tools/notify/NotifyType";
// import TwnsUiButton         from "../../tools/ui/UiButton";
// import TwnsUiLabel          from "../../tools/ui/UiLabel";
// import TwnsUiPanel          from "../../tools/ui/UiPanel";
// import TwnsUiTextInput      from "../../tools/ui/UiTextInput";
// import MeModel              from "../model/MeModel";
// import MeUtility            from "../model/MeUtility";
// import TwnsMeWarMenuPanel   from "./MeWarMenuPanel";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.MapEditor {
    import LangTextType     = Twns.Lang.LangTextType;
    import NotifyType       = Twns.Notify.NotifyType;

    export type OpenDataForMeResizePanel = void;
    export class MeResizePanel extends TwnsUiPanel.UiPanel<OpenDataForMeResizePanel> {
        private readonly _labelTitle!           : TwnsUiLabel.UiLabel;
        private readonly _labelCurrSizeTitle!   : TwnsUiLabel.UiLabel;
        private readonly _labelCurrWidth!       : TwnsUiLabel.UiLabel;
        private readonly _labelCurrHeight!      : TwnsUiLabel.UiLabel;
        private readonly _labelCurrGrids!       : TwnsUiLabel.UiLabel;
        private readonly _labelNewSizeTitle!    : TwnsUiLabel.UiLabel;
        private readonly _labelNewWidth!        : TwnsUiLabel.UiLabel;
        private readonly _labelNewHeight!       : TwnsUiLabel.UiLabel;
        private readonly _labelNewGrids!        : TwnsUiLabel.UiLabel;
        private readonly _labelTips!            : TwnsUiLabel.UiLabel;
        private readonly _btnCancel!            : TwnsUiButton.UiButton;
        private readonly _btnConfirm!           : TwnsUiButton.UiButton;

        private readonly _btnDeltaTop!          : TwnsUiButton.UiButton;
        private readonly _btnDeltaBottom!       : TwnsUiButton.UiButton;
        private readonly _btnDeltaLeft!         : TwnsUiButton.UiButton;
        private readonly _btnDeltaRight!        : TwnsUiButton.UiButton;
        private readonly _labelDeltaTop!        : TwnsUiLabel.UiLabel;
        private readonly _labelDeltaBottom!     : TwnsUiLabel.UiLabel;
        private readonly _labelDeltaLeft!       : TwnsUiLabel.UiLabel;
        private readonly _labelDeltaRight!      : TwnsUiLabel.UiLabel;

        private _deltaLeft      = 0;
        private _deltaRight     = 0;
        private _deltaTop       = 0;
        private _deltaBottom    = 0;

        protected _onOpening(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged, callback: this._onNotifyLanguageChanged },
            ]);
            this._setUiListenerArray([
                { ui: this._btnCancel,          callback: this._onTouchedBtnCancel, },
                { ui: this._btnConfirm,         callback: this._onTouchedBtnConfirm, },
                { ui: this._btnDeltaTop,        callback: this._onTouchedBtnDeltaTop },
                { ui: this._btnDeltaBottom,     callback: this._onTouchedBtnDeltaBottom },
                { ui: this._btnDeltaLeft,       callback: this._onTouchedBtnDeltaLeft },
                { ui: this._btnDeltaRight,      callback: this._onTouchedBtnDeltaRight },
            ]);
            this._setIsTouchMaskEnabled();
        }
        protected async _updateOnOpenDataChanged(): Promise<void> {
            this._deltaLeft     = 0;
            this._deltaRight    = 0;
            this._deltaTop      = 0;
            this._deltaBottom   = 0;

            this._updateView();
        }
        protected _onClosing(): void {
            // nothing to do
        }

        private _onTouchedBtnCancel(): void {
            this.close();
        }

        private async _onTouchedBtnConfirm(): Promise<void> {
            // const width         = Helpers.getExisted(this._newWidth);
            // const height        = Helpers.getExisted(this._newHeight);
            // const gridsCount    = width * height;
            // if (gridsCount <= 0) {
            //     FloatText.show(Lang.getText(LangTextType.A0087));
            // } else if (gridsCount > CommonConstants.MapMaxGridsCount) {
            //     FloatText.show(Lang.getFormattedText(LangTextType.F0023, CommonConstants.MapMaxGridsCount));
            // } else {
            //     const war       = Helpers.getExisted(MeModel.getWar());
            //     const currSize  = war.getTileMap().getMapSize();
            //     if ((width !== currSize.width) || (height !== currSize.height)) {
            //         war.stopRunning();
            //         await war.initWithMapEditorData({
            //             mapRawData  : MeUtility.resizeMap(war.serializeForMap(), width, height),
            //             slotIndex   : war.getMapSlotIndex(),
            //         });
            //         war.setIsMapModified(true);
            //         war.startRunning()
            //             .startRunningView();
            //     }

            //     this.close();
            //     TwnsPanelManager.close(TwnsPanelConfig.Dict.MeWarMenuPanel);
            // }

            const deltaLeft     = this._deltaLeft;
            const deltaRight    = this._deltaRight;
            const deltaTop      = this._deltaTop;
            const deltaBottom   = this._deltaBottom;
            if ((deltaLeft === 0) && (deltaRight === 0) && (deltaTop === 0) && (deltaBottom === 0)) {
                this.close();
                Twns.PanelHelpers.close(Twns.PanelHelpers.PanelDict.MeWarMenuPanel);
                return;
            }

            const war               = Twns.Helpers.getExisted(Twns.MapEditor.MeModel.getWar());
            const { width, height } = war.getTileMap().getMapSize();
            const newWidth          = width + deltaLeft + deltaRight;
            const newHeight         = height + deltaTop + deltaBottom;
            if ((newWidth <= 0) || (newHeight <= 0) || (newWidth * newHeight > Twns.CommonConstants.MapMaxGridsCount)) {
                FloatText.show(Lang.getText(LangTextType.A0265));
                return;
            }

            const tempData = Twns.MapEditor.MeHelpers.resizeMap(war.serializeForMap(), width + Math.max(0, deltaLeft) + Math.max(0, deltaRight), height + Math.max(0, deltaTop) + Math.max(0, deltaBottom));
            war.stopRunning();
            war.initWithMapEditorData(
                {
                    mapRawData  : Twns.MapEditor.MeHelpers.resizeMap(Twns.MapEditor.MeHelpers.addOffset(tempData, deltaLeft, deltaTop), newWidth, newHeight),
                    slotIndex   : war.getMapSlotIndex(),
                },
                war.getGameConfig(),
            );
            war.setIsMapModified(true);
            war.startRunning()
                .startRunningView();

            this.close();
            Twns.PanelHelpers.close(Twns.PanelHelpers.PanelDict.MeWarMenuPanel);
        }

        private _onTouchedBtnDeltaTop(): void {
            const minValue      = -Twns.CommonConstants.MapMaxGridsCount;
            const maxValue      = Twns.CommonConstants.MapMaxGridsCount;
            const currentValue  = this._deltaTop;
            Twns.PanelHelpers.open(Twns.PanelHelpers.PanelDict.CommonInputIntegerPanel, {
                title           : Lang.getText(LangTextType.B0857),
                currentValue,
                minValue,
                maxValue,
                tips            : `${Lang.getText(LangTextType.B0319)}: [${minValue}, ${maxValue}]`,
                callback        : panel => {
                    const value = panel.getInputValue();
                    if (value !== currentValue) {
                        this._deltaTop = value;
                        this._updateComponentsForData();
                    }
                },
            });
        }
        private _onTouchedBtnDeltaBottom(): void {
            const minValue      = -Twns.CommonConstants.MapMaxGridsCount;
            const maxValue      = Twns.CommonConstants.MapMaxGridsCount;
            const currentValue  = this._deltaBottom;
            Twns.PanelHelpers.open(Twns.PanelHelpers.PanelDict.CommonInputIntegerPanel, {
                title           : Lang.getText(LangTextType.B0858),
                currentValue,
                minValue,
                maxValue,
                tips            : `${Lang.getText(LangTextType.B0319)}: [${minValue}, ${maxValue}]`,
                callback        : panel => {
                    const value = panel.getInputValue();
                    if (value !== currentValue) {
                        this._deltaBottom = value;
                        this._updateComponentsForData();
                    }
                },
            });
        }
        private _onTouchedBtnDeltaLeft(): void {
            const minValue      = -Twns.CommonConstants.MapMaxGridsCount;
            const maxValue      = Twns.CommonConstants.MapMaxGridsCount;
            const currentValue  = this._deltaLeft;
            Twns.PanelHelpers.open(Twns.PanelHelpers.PanelDict.CommonInputIntegerPanel, {
                title           : Lang.getText(LangTextType.B0859),
                currentValue,
                minValue,
                maxValue,
                tips            : `${Lang.getText(LangTextType.B0319)}: [${minValue}, ${maxValue}]`,
                callback        : panel => {
                    const value = panel.getInputValue();
                    if (value !== currentValue) {
                        this._deltaLeft = value;
                        this._updateComponentsForData();
                    }
                },
            });
        }
        private _onTouchedBtnDeltaRight(): void {
            const minValue      = -Twns.CommonConstants.MapMaxGridsCount;
            const maxValue      = Twns.CommonConstants.MapMaxGridsCount;
            const currentValue  = this._deltaRight;
            Twns.PanelHelpers.open(Twns.PanelHelpers.PanelDict.CommonInputIntegerPanel, {
                title           : Lang.getText(LangTextType.B0860),
                currentValue,
                minValue,
                maxValue,
                tips            : `${Lang.getText(LangTextType.B0319)}: [${minValue}, ${maxValue}]`,
                callback        : panel => {
                    const value = panel.getInputValue();
                    if (value !== currentValue) {
                        this._deltaRight = value;
                        this._updateComponentsForData();
                    }
                },
            });
        }

        private _onNotifyLanguageChanged(): void {
            this._updateComponentsForLanguage();
        }

        private _updateView(): void {
            this._updateComponentsForLanguage();
            this._updateComponentsForData();
        }

        private _updateComponentsForLanguage(): void {
            this._btnConfirm.label          = Lang.getText(LangTextType.B0026);
            this._btnCancel.label           = Lang.getText(LangTextType.B0154);
            this._labelTitle.text           = Lang.getText(LangTextType.B0290);
            this._labelCurrSizeTitle.text   = Lang.getText(LangTextType.B0855);
            this._labelNewSizeTitle.text    = Lang.getText(LangTextType.B0856);
            this._btnDeltaTop.label         = Lang.getText(LangTextType.B0857);
            this._btnDeltaBottom.label      = Lang.getText(LangTextType.B0858);
            this._btnDeltaLeft.label        = Lang.getText(LangTextType.B0859);
            this._btnDeltaRight.label       = Lang.getText(LangTextType.B0860);
            this._labelTips.text            = Lang.getFormattedText(LangTextType.F0023, Twns.CommonConstants.MapMaxGridsCount);
        }

        private _updateComponentsForData(): void {
            const war                   = Twns.Helpers.getExisted(Twns.MapEditor.MeModel.getWar());
            const { width, height }     = war.getTileMap().getMapSize();
            this._labelCurrWidth.text   = "" + width;
            this._labelCurrHeight.text  = "" + height;
            this._labelCurrGrids.text   = `` + (width * height);

            const deltaLeft             = this._deltaLeft;
            const deltaRight            = this._deltaRight;
            const deltaTop              = this._deltaTop;
            const deltaBottom           = this._deltaBottom;
            const newWidth              = width + deltaLeft + deltaRight;
            const newHeight             = height + deltaTop + deltaBottom;
            const newGrids              = newWidth * newHeight;
            const labelNewWidth         = this._labelNewWidth;
            const labelNewHeight        = this._labelNewHeight;
            const labelNewGrids         = this._labelNewGrids;
            labelNewWidth.text          = "" + newWidth;
            labelNewWidth.textColor     = newWidth > 0 ? 0xffffff : 0xff0000;
            labelNewHeight.text         = "" + newHeight;
            labelNewHeight.textColor    = newHeight > 0 ? 0xffffff : 0xff0000;
            labelNewGrids.text          = `` + newGrids;
            labelNewGrids.textColor     = ((newGrids > 0) && (newGrids <= Twns.CommonConstants.MapMaxGridsCount)) ? 0xffffff : 0xff0000;
            this._labelDeltaTop.text    = `` + deltaTop;
            this._labelDeltaBottom.text = `` + deltaBottom;
            this._labelDeltaLeft.text   = `` + deltaLeft;
            this._labelDeltaRight.text  = `` + deltaRight;
        }
    }
}

// export default TwnsMeResizePanel;
