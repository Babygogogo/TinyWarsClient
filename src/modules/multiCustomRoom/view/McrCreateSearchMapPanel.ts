
// import Helpers                      from "../../tools/helpers/Helpers";
// import Types                        from "../../tools/helpers/Types";
// import Lang                         from "../../tools/lang/Lang";
// import TwnsLangTextType             from "../../tools/lang/LangTextType";
// import Twns.Notify               from "../../tools/notify/NotifyType";
// import ProtoTypes                   from "../../tools/proto/ProtoTypes";
// import TwnsUiButton                 from "../../tools/ui/UiButton";
// import TwnsUiImage                  from "../../tools/ui/UiImage";
// import TwnsUiLabel                  from "../../tools/ui/UiLabel";
// import TwnsUiPanel                  from "../../tools/ui/UiPanel";
// import TwnsUiTextInput              from "../../tools/ui/UiTextInput";
// import TwnsMcrCreateMapListPanel    from "./McrCreateMapListPanel";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.MultiCustomRoom {
    import LangTextType             = Twns.Lang.LangTextType;
    import NotifyType               = Twns.Notify.NotifyType;

    export type OpenDataForMcrCreateSearchMapPanel = void;
    export class McrCreateSearchMapPanel extends TwnsUiPanel.UiPanel<OpenDataForMcrCreateSearchMapPanel> {
        private readonly _imgMask!                  : TwnsUiImage.UiImage;

        private readonly _group!                    : eui.Group;
        private readonly _btnClose!                 : TwnsUiButton.UiButton;
        private readonly _btnReset!                 : TwnsUiButton.UiButton;
        private readonly _btnSearch!                : TwnsUiButton.UiButton;
        private readonly _labelName!                : TwnsUiLabel.UiLabel;
        private readonly _labelMapNameTitle!        : TwnsUiLabel.UiLabel;
        private readonly _labelDesignerTitle!       : TwnsUiLabel.UiLabel;
        private readonly _labelPlayersCountTitle!   : TwnsUiLabel.UiLabel;
        private readonly _labelPlayedTimesTitle!    : TwnsUiLabel.UiLabel;
        private readonly _labelMinRatingTitle!      : TwnsUiLabel.UiLabel;
        private readonly _labelDesc!                : TwnsUiLabel.UiLabel;
        private readonly _inputMapName!             : TwnsUiTextInput.UiTextInput;
        private readonly _inputDesigner!            : TwnsUiTextInput.UiTextInput;
        private readonly _inputPlayersCount!        : TwnsUiTextInput.UiTextInput;
        private readonly _inputPlayedTimes!         : TwnsUiTextInput.UiTextInput;
        private readonly _inputMinRating!           : TwnsUiTextInput.UiTextInput;

        private readonly _labelTagFogTitle!         : TwnsUiLabel.UiLabel;
        private readonly _labelTagFog!              : TwnsUiLabel.UiLabel;
        private readonly _btnTagFog!                : TwnsUiButton.UiButton;

        private _mapTag         : CommonProto.Map.IDataForMapTag = {};

        protected _onOpening(): void {
            this._setUiListenerArray([
                { ui: this._btnClose,   callback: this.close },
                { ui: this._btnReset,   callback: this._onTouchedBtnReset },
                { ui: this._btnSearch,  callback: this._onTouchedBtnSearch },
                { ui: this._btnTagFog,  callback: this._onTouchedBtnTagFog },
            ]);
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,    callback: this._onNotifyLanguageChanged },
            ]);
            this._setIsTouchMaskEnabled();
            this._setIsCloseOnTouchedMask();
        }
        protected async _updateOnOpenDataChanged(): Promise<void> {
            this._updateComponentsForLanguage();
        }
        protected _onClosing(): void {
            // nothing to do
        }

        private _onTouchedBtnReset(): void {
            Twns.PanelHelpers.open(Twns.PanelHelpers.PanelDict.McrCreateMapListPanel, {});
            this.close();
        }

        private _onTouchedBtnSearch(): void {
            const minRatingText = this._inputMinRating.text;
            const minRating     = minRatingText ? Number(minRatingText) : null;
            Twns.PanelHelpers.open(Twns.PanelHelpers.PanelDict.McrCreateMapListPanel, {
                mapName     : this._inputMapName.text || null,
                mapDesigner : this._inputDesigner.text || null,
                playersCount: Number(this._inputPlayersCount.text) || null,
                playedTimes : Number(this._inputPlayedTimes.text) || null,
                minRating   : (minRating == null || isNaN(minRating)) ? null : minRating,
                mapTag      : this._mapTag,
            });

            this.close();
        }

        private _onTouchedBtnTagFog(): void {
            const mapTag = this._mapTag;
            const hasFog = mapTag.fog;
            if (hasFog == true) {
                mapTag.fog = false;
            } else if (hasFog == false) {
                mapTag.fog = null;
            } else {
                mapTag.fog = true;
            }
            this._updateLabelTagFog();
        }

        private _onNotifyLanguageChanged(): void {
            this._updateComponentsForLanguage();
        }

        private _updateComponentsForLanguage(): void {
            this._labelName.text                = Lang.getText(LangTextType.B0447);
            this._labelMapNameTitle.text        = Lang.getText(LangTextType.B0225);
            this._labelDesignerTitle.text       = Lang.getText(LangTextType.B0251);
            this._labelPlayersCountTitle.text   = Lang.getText(LangTextType.B0229);
            this._labelPlayedTimesTitle.text    = Lang.getText(LangTextType.B0568);
            this._labelMinRatingTitle.text      = Lang.getText(LangTextType.B0569);
            this._labelTagFogTitle.text         = Lang.getText(LangTextType.B0570);
            this._labelDesc.text                = Lang.getText(LangTextType.A0063);
            this._btnReset.label                = Lang.getText(LangTextType.B0567);
            this._btnSearch.label               = Lang.getText(LangTextType.B0228);
            this._updateLabelTagFog();
        }

        private _updateLabelTagFog(): void {
            const hasFog    = this._mapTag.fog;
            const label     = this._labelTagFog;
            if (hasFog == true) {
                label.text = Lang.getText(LangTextType.B0012);
            } else if (hasFog == false) {
                label.text = Lang.getText(LangTextType.B0013);
            } else {
                label.text = ``;
            }
        }

        protected async _showOpenAnimation(): Promise<void> {
            Twns.Helpers.resetTween({
                obj         : this._imgMask,
                beginProps  : { alpha: 0 },
                endProps    : { alpha: 1 },
            });
            Twns.Helpers.resetTween({
                obj         : this._group,
                beginProps  : { alpha: 0, verticalCenter: 40 },
                endProps    : { alpha: 1, verticalCenter: 0 },
            });

            await Twns.Helpers.wait(Twns.CommonConstants.DefaultTweenTime);
        }
        protected async _showCloseAnimation(): Promise<void> {
            Twns.Helpers.resetTween({
                obj         : this._imgMask,
                beginProps  : { alpha: 1 },
                endProps    : { alpha: 0 },
            });
            Twns.Helpers.resetTween({
                obj         : this._group,
                beginProps  : { alpha: 1, verticalCenter: 0 },
                endProps    : { alpha: 0, verticalCenter: 40 },
            });

            await Twns.Helpers.wait(Twns.CommonConstants.DefaultTweenTime);
        }
    }
}

// export default TwnsMcrCreateSearchMapPanel;
