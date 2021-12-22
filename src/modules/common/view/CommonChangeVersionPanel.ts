
// import CommonConstants          from "../../tools/helpers/CommonConstants";
// import Helpers                  from "../../tools/helpers/Helpers";
// import Types                    from "../../tools/helpers/Types";
// import Lang                     from "../../tools/lang/Lang";
// import TwnsLangTextType         from "../../tools/lang/LangTextType";
// import TwnsNotifyType           from "../../tools/notify/NotifyType";
// import TwnsUiButton             from "../../tools/ui/UiButton";
// import TwnsUiImage              from "../../tools/ui/UiImage";
// import TwnsUiLabel              from "../../tools/ui/UiLabel";
// import TwnsUiListItemRenderer   from "../../tools/ui/UiListItemRenderer";
// import TwnsUiPanel              from "../../tools/ui/UiPanel";
// import TwnsUiScrollList         from "../../tools/ui/UiScrollList";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace TwnsCommonChangeVersionPanel {
    import LangTextType = TwnsLangTextType.LangTextType;
    import NotifyType   = TwnsNotifyType.NotifyType;
    import GameVersion  = Types.GameVersion;

    export type OpenData = void;
    export class CommonChangeVersionPanel extends TwnsUiPanel.UiPanel<OpenData> {
        private readonly _group!        : eui.Group;
        private readonly _imgMask!      : TwnsUiImage.UiImage;
        private readonly _labelTitle!   : TwnsUiLabel.UiLabel;
        private readonly _btnBack!      : TwnsUiButton.UiButton;
        private readonly _btnConfirm!   : TwnsUiButton.UiButton;
        private readonly _listVersion!  : TwnsUiScrollList.UiScrollList<DataForVersionRenderer>;
        private readonly _labelTips!    : TwnsUiLabel.UiLabel;

        protected _onOpening(): void {
            this._setUiListenerArray([
                { ui: this._btnBack,        callback: this._onTouchTapBtnBack },
                { ui: this._btnConfirm,     callback: this._onTouchedBtnConfirm },
            ]);
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,    callback: this._onNotifyLanguageChanged },
            ]);
            this._setIsTouchMaskEnabled();
            this._setIsCloseOnTouchedMask();

            this._listVersion.setItemRenderer(VersionRenderer);

        }
        protected async _updateOnOpenDataChanged(): Promise<void> {
            this._updateComponentsForLanguage();
            this._initListVersion();
        }
        protected _onClosing(): void {
            // nothing to do
        }

        private _getSelectedGameVersion(): GameVersion | null {
            const selectedData = this._listVersion.getSelectedData();
            return selectedData ? selectedData.gameVersion : null;
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Callbacks.
        ////////////////////////////////////////////////////////////////////////////////
        private _onTouchTapBtnBack(): void {
            this.close();
        }

        private async _onTouchedBtnConfirm(): Promise<void> {
            const selectedVersion = this._getSelectedGameVersion();
            if ((selectedVersion == null) || (selectedVersion === CommonConstants.GameVersion)) {
                this.close();
                return;
            }

            const url = getUrlForGameVersion(selectedVersion);
            if (url == null) {
                throw Helpers.newError(`CommonChangeVersionPanel._onTouchedBtnConfirm() empty url.`);
            } else {
                window.open(url);
            }
            this.close();
        }

        private _onNotifyLanguageChanged(): void {
            this._updateComponentsForLanguage();
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Private functions.
        ////////////////////////////////////////////////////////////////////////////////
        private _updateComponentsForLanguage(): void {
            this._labelTitle.text   = Lang.getText(LangTextType.B0620);
            this._btnBack.label     = Lang.getText(LangTextType.B0154);
            this._btnConfirm.label  = Lang.getText(LangTextType.B0026);
            this._labelTips.text    = Lang.getText(LangTextType.A0219);
        }

        private _initListVersion(): void {
            const dataArray     = this._createDataForListVersion();
            const listVersion   = this._listVersion;
            listVersion.bindData(dataArray);
            listVersion.setSelectedIndex(dataArray.findIndex(v => v.gameVersion === CommonConstants.GameVersion));
        }

        private _createDataForListVersion(): DataForVersionRenderer[] {
            return [
                {
                    gameVersion : GameVersion.Legacy,
                },
                {
                    gameVersion : GameVersion.Test,
                },
                {
                    gameVersion : GameVersion.Awbw,
                },
            ];
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

    type DataForVersionRenderer = {
        gameVersion : GameVersion;
    };
    class VersionRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForVersionRenderer> {
        private readonly _labelName!    : TwnsUiLabel.UiLabel;
        private readonly _labelDesc!    : TwnsUiLabel.UiLabel;
        private readonly _labelCurrent! : TwnsUiLabel.UiLabel;

        protected _onOpened(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,    callback: this._onNotifyLanguageChanged },
            ]);
        }

        protected _onDataChanged(): void {
            this._updateView();
        }

        private _onNotifyLanguageChanged(): void {
            this._updateView();
        }

        private _updateView(): void {
            if (!this._getIsOpening()) {
                return;
            }

            const data = this.data;
            if (data == null) {
                throw Helpers.newError(`CommonChangeVersionPanel.VersionRenderer._updateView() empty data.`);
            }

            const gameVersion       = data.gameVersion;
            this._labelName.text    = Lang.getGameVersionName(gameVersion) || CommonConstants.ErrorTextForUndefined;
            this._labelDesc.text    = Lang.getGameVersionDesc(gameVersion) || CommonConstants.ErrorTextForUndefined;

            const labelCurrent      = this._labelCurrent;
            labelCurrent.text       = `(${Lang.getText(LangTextType.B0623)})`;
            labelCurrent.visible    = gameVersion === CommonConstants.GameVersion;
        }
    }

    function getUrlForGameVersion(version: GameVersion): string | null {
        switch (version) {
            case GameVersion.Legacy : return `https://www.tinywars.online`;
            case GameVersion.Test   : return `https://www.tinywars.online/test`;
            case GameVersion.Awbw   : return `https://awbw.amarriner.com/`;
            default                 : return null;
        }
    }
}

// export default TwnsCommonChangeVersionPanel;
