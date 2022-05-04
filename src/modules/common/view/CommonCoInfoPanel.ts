
// import Helpers              from "../../tools/helpers/Helpers";
// import Types                from "../../tools/helpers/Types";
// import Twns.Notify       from "../../tools/notify/NotifyType";
// import TwnsUiCoInfo         from "../../tools/ui/UiCoInfo";
// import TwnsUiImage          from "../../tools/ui/UiImage";
// import TwnsUiPanel          from "../../tools/ui/UiPanel";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.Common {
    import NotifyType   = Twns.Notify.NotifyType;
    import GameConfig   = Twns.Config.GameConfig;

    export type OpenDataForCommonCoInfoPanel = {
        gameConfig      : GameConfig;
        coId            : number;
    };
    export class CommonCoInfoPanel extends TwnsUiPanel.UiPanel<OpenDataForCommonCoInfoPanel> {
        private readonly _imgMask!  : TwnsUiImage.UiImage;
        private readonly _group!    : eui.Group;
        private readonly _uiCoInfo! : TwnsUiCoInfo.UiCoInfo;

        protected _onOpening(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged, callback: this._onNotifyLanguageChanged },
            ]);
            this._setIsTouchMaskEnabled();
            this._setIsCloseOnTouchedMask();
        }
        protected async _updateOnOpenDataChanged(): Promise<void> {
            this._updateComponentsForLanguage();

            const openData = this._getOpenData();
            this._uiCoInfo.setCoData({
                gameConfig   : openData.gameConfig,
                coId            : openData.coId,
            });
        }
        protected _onClosing(): void {
            // nothing to do
        }

        private _onNotifyLanguageChanged(): void {
            this._updateComponentsForLanguage();
        }

        private _updateComponentsForLanguage(): void {
            // nothing to do
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

            await Twns.Helpers.wait(CommonConstants.DefaultTweenTime);
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

            await Twns.Helpers.wait(CommonConstants.DefaultTweenTime);
        }
    }
}

// export default TwnsCommonCoInfoPanel;
