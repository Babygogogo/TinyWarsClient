
// import Helpers                      from "../../tools/helpers/Helpers";
// import Types                        from "../../tools/helpers/Types";
// import Lang                         from "../../tools/lang/Lang";
// import TwnsLangTextType             from "../../tools/lang/LangTextType";
// import Notify               from "../../tools/notify/NotifyType";
// import ProtoTypes                   from "../../tools/proto/ProtoTypes";
// import TwnsUiButton                 from "../../tools/ui/UiButton";
// import TwnsUiImage                  from "../../tools/ui/UiImage";
// import TwnsUiLabel                  from "../../tools/ui/UiLabel";
// import TwnsUiPanel                  from "../../tools/ui/UiPanel";
// import TwnsUiTextInput              from "../../tools/ui/UiTextInput";
// import TwnsMcrCreateMapListPanel    from "./McrCreateMapListPanel";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.Common {
    import LangTextType             = Lang.LangTextType;
    import NotifyType               = Notify.NotifyType;

    export type MapFilter = {
        mapName?        : string | null;
        mapDesigner?    : string | null;
        playersCount?   : number | null;
        playedTimes?    : number | null;
        minRating?      : number | null;
        mapTagIdFlags?  : number | null;
    };

    export type OpenDataForCommonMapFilterPanel = {
        mapFilter           : MapFilter | null;
        callbackOnConfirm   : (mapFilter: MapFilter) => void;
        callbackOnReset     : () => void;
    };
    export class CommonMapFilterPanel extends TwnsUiPanel.UiPanel<OpenDataForCommonMapFilterPanel> {
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

        private _mapTagIdFlags                      = 0;

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

            this._mapTagIdFlags = this._getOpenData().mapFilter?.mapTagIdFlags ?? 0;
            this._resetComponentsForFilter();
        }
        protected _onClosing(): void {
            // nothing to do
        }

        private _onTouchedBtnReset(): void {
            this._getOpenData().callbackOnReset();
            this.close();
        }

        private _onTouchedBtnSearch(): void {
            this._getOpenData().callbackOnConfirm({
                mapName         : this._inputMapName.text.trim() || null,
                mapDesigner     : this._inputDesigner.text.trim() || null,
                playersCount    : getNumber(this._inputPlayersCount.text),
                playedTimes     : getNumber(this._inputPlayedTimes.text),
                minRating       : getNumber(this._inputMinRating.text),
                mapTagIdFlags   : this._mapTagIdFlags,
            });

            this.close();
        }

        private _onTouchedBtnTagFog(): void {
            PanelHelpers.open(PanelHelpers.PanelDict.CommonChooseMapTagIdPanel, {
                currentMapTagIdFlags    : this._mapTagIdFlags,
                callbackOnConfirm       : mapTagIdFlags => {
                    this._mapTagIdFlags = mapTagIdFlags;
                    this._updateLabelTagFog();
                },
            });
        }

        private _onNotifyLanguageChanged(): void {
            this._updateComponentsForLanguage();
        }

        private _resetComponentsForFilter(): void {
            const mapFilter                 = this._getOpenData().mapFilter;
            this._inputMapName.text         = mapFilter?.mapName ?? ``;
            this._inputDesigner.text        = mapFilter?.mapDesigner ?? ``;
            this._inputPlayersCount.text    = `${mapFilter?.playersCount ?? ``}`;
            this._inputPlayedTimes.text     = `${mapFilter?.playedTimes ?? ``}`;
            this._inputMinRating.text       = `${mapFilter?.minRating ?? ``}`;
            this._updateLabelTagFog();
        }

        private _updateComponentsForLanguage(): void {
            this._labelName.text                = Lang.getText(LangTextType.B0447);
            this._labelMapNameTitle.text        = Lang.getText(LangTextType.B0225);
            this._labelDesignerTitle.text       = Lang.getText(LangTextType.B0251);
            this._labelPlayersCountTitle.text   = Lang.getText(LangTextType.B0922);
            this._labelPlayedTimesTitle.text    = Lang.getText(LangTextType.B0568);
            this._labelMinRatingTitle.text      = Lang.getText(LangTextType.B0569);
            this._labelTagFogTitle.text         = Lang.getText(LangTextType.B0445);
            this._labelDesc.text                = Lang.getText(LangTextType.A0063);
            this._btnReset.label                = Lang.getText(LangTextType.B0567);
            this._btnSearch.label               = Lang.getText(LangTextType.B0228);
            this._updateLabelTagFog();
        }

        private async _updateLabelTagFog(): Promise<void> {
            const mapTagIdArray = Helpers.getIdArrayByIdFlags(this._mapTagIdFlags);
            const length        = mapTagIdArray.length;
            const label         = this._labelTagFog;
            if (length == 0) {
                label.text = ``;
            } else if (length === 1) {
                label.text = Lang.getLanguageText({ textArray: (await WarMap.WarMapModel.getMapTag())?.mapTagDataArray?.find(v => v.mapTagId === mapTagIdArray[0])?.nameArray }) ?? CommonConstants.ErrorTextForUndefined;
            } else {
                label.text = `${length}`;
            }
        }

        protected async _showOpenAnimation(): Promise<void> {
            Helpers.resetTween({
                obj         : this._imgMask,
                beginProps  : { alpha: 0 },
                endProps    : { alpha: 1 },
            });
            Helpers.resetTween({
                obj         : this._group,
                beginProps  : { alpha: 0, verticalCenter: 40 },
                endProps    : { alpha: 1, verticalCenter: 0 },
            });

            await Helpers.wait(CommonConstants.DefaultTweenTime);
        }
        protected async _showCloseAnimation(): Promise<void> {
            Helpers.resetTween({
                obj         : this._imgMask,
                beginProps  : { alpha: 1 },
                endProps    : { alpha: 0 },
            });
            Helpers.resetTween({
                obj         : this._group,
                beginProps  : { alpha: 1, verticalCenter: 0 },
                endProps    : { alpha: 0, verticalCenter: 40 },
            });

            await Helpers.wait(CommonConstants.DefaultTweenTime);
        }
    }

    function getNumber(text: Types.Undefinable<string>): number | null {
        if (!text) {
            return null;
        }

        const num = parseInt(text);
        return isNaN(num) ? null : num;
    }
}

// export default TwnsCommonMapFilterPanel;
