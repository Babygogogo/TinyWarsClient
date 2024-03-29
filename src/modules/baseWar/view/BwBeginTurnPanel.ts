
// import SoundManager         from "../../tools/helpers/SoundManager";
// import Types                from "../../tools/helpers/Types";
// import Lang                 from "../../tools/lang/Lang";
// import TwnsLangTextType     from "../../tools/lang/LangTextType";
// import TwnsUiLabel          from "../../tools/ui/UiLabel";
// import TwnsUiPanel          from "../../tools/ui/UiPanel";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.BaseWar {
    export type OpenDataForBwBeginTurnPanel = {
        gameConfig          : Twns.Config.GameConfig;
        playerIndex         : number;
        teamIndex           : number;
        nickname            : string;
        coId                : number;
        unitAndTileSkinId   : number;
        callbackOnFinish    : () => void;
    };
    export class BwBeginTurnPanel extends TwnsUiPanel.UiPanel<OpenDataForBwBeginTurnPanel> {
        private readonly _group!            : eui.Group;
        private readonly _labelPlayerIndex! : TwnsUiLabel.UiLabel;
        private readonly _labelNickname!    : TwnsUiLabel.UiLabel;
        private readonly _labelTurnStart!   : TwnsUiLabel.UiLabel;
        private readonly _imgSkin!          : TwnsUiImage.UiImage;
        private readonly _imgCo!            : TwnsUiImage.UiImage;

        private _timeoutIdForClose  : number | null = null;

        protected _onOpening(): void {
            this._setIsTouchMaskEnabled();
            this._setCallbackOnTouchedMask(() => {
                Twns.SoundManager.playShortSfx(Twns.Types.ShortSfxCode.ButtonNeutral01);
                this._clearTimeoutForClose();
                this.close();
            });
        }
        protected async _updateOnOpenDataChanged(oldOpenData: OpenDataForBwBeginTurnPanel | null): Promise<void> {
            if (oldOpenData) {
                oldOpenData.callbackOnFinish();
                this._resetTimeoutForClose();
            }

            const openData              = this._getOpenData();
            this._labelPlayerIndex.text = `${Lang.getPlayerForceName(openData.playerIndex)} (${Lang.getPlayerTeamName(openData.teamIndex)})`;
            this._labelNickname.text    = openData.nickname;
            this._labelTurnStart.text   = Lang.getText(Twns.Lang.LangTextType.B0679);
            this._imgSkin.source        = Twns.WarHelpers.WarCommonHelpers.getImageSourceForCoHeadFrame(openData.unitAndTileSkinId);
            this._imgCo.source          = openData.gameConfig.getCoHeadImageSource(openData.coId) ?? Twns.CommonConstants.ErrorTextForUndefined;
        }
        protected _onClosing(): void {
            this._clearTimeoutForClose();
            this._getOpenData().callbackOnFinish();
        }

        private _resetTimeoutForClose(): void {
            this._clearTimeoutForClose();
            this._timeoutIdForClose = egret.setTimeout(() => {
                this._clearTimeoutForClose();
                this.close();
            }, null, 1500);
        }
        private _clearTimeoutForClose(): void {
            if (this._timeoutIdForClose != null) {
                egret.clearTimeout(this._timeoutIdForClose);
                this._timeoutIdForClose = null;
            }
        }

        protected async _showOpenAnimation(): Promise<void> {
            this.alpha = 0;
            egret.Tween.get(this)
                .to({ alpha: 1 }, 150);

            await Twns.Helpers.wait(250);

            this._resetTimeoutForClose();
        }
        protected async _showCloseAnimation(): Promise<void> {
            egret.Tween.get(this)
                .to({ alpha: 0 }, 150);

            await Twns.Helpers.wait(250);
        }
    }
}

// export default TwnsBwBeginTurnPanel;
