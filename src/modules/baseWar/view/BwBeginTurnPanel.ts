
// import SoundManager         from "../../tools/helpers/SoundManager";
// import Types                from "../../tools/helpers/Types";
// import Lang                 from "../../tools/lang/Lang";
// import TwnsLangTextType     from "../../tools/lang/LangTextType";
// import TwnsUiLabel          from "../../tools/ui/UiLabel";
// import TwnsUiPanel          from "../../tools/ui/UiPanel";

namespace TwnsBwBeginTurnPanel {
    type OpenDataForBwBeginTurnPanel = {
        playerIndex     : number;
        teamIndex       : number;
        nickname        : string;
        callbackOnFinish: () => void;
    };
    export class BwBeginTurnPanel extends TwnsUiPanel.UiPanel<OpenDataForBwBeginTurnPanel> {
        protected readonly _LAYER_TYPE   = Types.LayerType.Notify1;
        protected readonly _IS_EXCLUSIVE = true;

        private static _instance: BwBeginTurnPanel;

        private readonly _group!            : eui.Group;
        private readonly _labelPlayerIndex! : TwnsUiLabel.UiLabel;
        private readonly _labelNickname!    : TwnsUiLabel.UiLabel;
        private readonly _labelTurnStart!   : TwnsUiLabel.UiLabel;

        public static show(openData: OpenDataForBwBeginTurnPanel): void {
            if (!BwBeginTurnPanel._instance) {
                BwBeginTurnPanel._instance = new BwBeginTurnPanel();
            }
            BwBeginTurnPanel._instance.open(openData);
        }

        public static async hide(): Promise<void> {
            if (BwBeginTurnPanel._instance) {
                await BwBeginTurnPanel._instance.close();
            }
        }

        public constructor() {
            super();

            this._setIsTouchMaskEnabled();
            this.skinName = "resource/skins/baseWar/BwBeginTurnPanel.exml";
        }

        protected _onOpened(): void {
            this._setCallbackOnTouchedMask(() => {
                SoundManager.playShortSfx(Types.ShortSfxCode.ButtonNeutral01);
                this.close();
            });

            const openData              = this._getOpenData();
            this._labelPlayerIndex.text = `${Lang.getPlayerForceName(openData.playerIndex)} (${Lang.getPlayerTeamName(openData.teamIndex)})`;
            this._labelNickname.text    = openData.nickname;
            this._labelTurnStart.text   = Lang.getText(TwnsLangTextType.LangTextType.B0679);

            this.alpha = 0;
            egret.Tween.removeTweens(this);
            egret.Tween.get(this)
                .to({ alpha: 1 }, 250)
                .wait(1500)
                .to({ alpha: 0 }, 250)
                .call(() => this.close());
        }
        protected async _onClosed(): Promise<void> {
            egret.Tween.removeTweens(this);
            this._getOpenData().callbackOnFinish();
        }
    }
}

// export default TwnsBwBeginTurnPanel;
