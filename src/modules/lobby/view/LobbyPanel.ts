
import TwnsCommonConfirmPanel   from "../../common/view/CommonConfirmPanel";
import CcrModel                 from "../../coopCustomRoom/model/CcrModel";
import McrModel                 from "../../multiCustomRoom/model/McrModel";
import TwnsMcrMainMenuPanel     from "../../multiCustomRoom/view/McrMainMenuPanel";
import MfrModel                 from "../../multiFreeRoom/model/MfrModel";
import MpwModel                 from "../../multiPlayerWar/model/MpwModel";
import MrrModel                 from "../../multiRankRoom/model/MrrModel";
import TwnsMrrMainMenuPanel     from "../../multiRankRoom/view/MrrMainMenuPanel";
import TwnsSpmMainMenuPanel     from "../../singlePlayerMode/view/SpmMainMenuPanel";
import CommonConstants          from "../../tools/helpers/CommonConstants";
import CompatibilityHelpers     from "../../tools/helpers/CompatibilityHelpers";
import Helpers                  from "../../tools/helpers/Helpers";
import Types                    from "../../tools/helpers/Types";
import Lang                     from "../../tools/lang/Lang";
import TwnsLangTextType         from "../../tools/lang/LangTextType";
import TwnsNotifyType           from "../../tools/notify/NotifyType";
import TwnsUiButton             from "../../tools/ui/UiButton";
import TwnsUiLabel              from "../../tools/ui/UiLabel";
import TwnsUiPanel              from "../../tools/ui/UiPanel";

namespace TwnsLobbyPanel {
    import CommonConfirmPanel   = TwnsCommonConfirmPanel.CommonConfirmPanel;
    import McrMainMenuPanel     = TwnsMcrMainMenuPanel.McrMainMenuPanel;
    import MrrMainMenuPanel     = TwnsMrrMainMenuPanel.MrrMainMenuPanel;
    import SpmMainMenuPanel     = TwnsSpmMainMenuPanel.SpmMainMenuPanel;
    import Tween                = egret.Tween;
    import NotifyType           = TwnsNotifyType.NotifyType;
    import LangTextType         = TwnsLangTextType.LangTextType;

    // eslint-disable-next-line no-shadow
    export class LobbyPanel extends TwnsUiPanel.UiPanel<void> {
        protected readonly _LAYER_TYPE   = Types.LayerType.Scene;
        protected readonly _IS_EXCLUSIVE = true;

        private static _instance            : LobbyPanel | null = null;

        private readonly _groupTips!        : eui.Group;
        private readonly _groupWelcome!     : eui.Group;
        private readonly _labelTips0!       : TwnsUiLabel.UiLabel;
        private readonly _labelTips1!       : TwnsUiLabel.UiLabel;
        private readonly _groupQq!          : eui.Group;
        private readonly _labelTips2!       : TwnsUiLabel.UiLabel;
        private readonly _labelTips3!       : TwnsUiLabel.UiLabel;
        private readonly _groupDiscord!     : eui.Group;
        private readonly _labelTips4!       : TwnsUiLabel.UiLabel;
        private readonly _labelTips5!       : TwnsUiLabel.UiLabel;
        private readonly _groupGithub!      : eui.Group;
        private readonly _labelTips6!       : TwnsUiLabel.UiLabel;
        private readonly _labelTips7!       : TwnsUiLabel.UiLabel;

        private readonly _group!            : eui.Group;
        private readonly _btnSinglePlayer!  : TwnsUiButton.UiButton;
        private readonly _btnMultiPlayer!   : TwnsUiButton.UiButton;
        private readonly _btnRanking!       : TwnsUiButton.UiButton;

        public static show(): void {
            if (!LobbyPanel._instance) {
                LobbyPanel._instance = new LobbyPanel();
            }
            LobbyPanel._instance.open();
        }
        public static async hide(): Promise<void> {
            if (LobbyPanel._instance) {
                await LobbyPanel._instance.close();
            }
        }
        public static getInstance(): LobbyPanel | null {
            return LobbyPanel._instance;
        }

        private constructor() {
            super();

            this.skinName = "resource/skins/lobby/LobbyPanel.exml";
        }

        protected _onOpened(): void {
            this._setUiListenerArray([
                { ui: this._groupDiscord,       callback: this._onTouchedGroupDiscord },
                { ui: this._groupGithub,        callback: this._onTouchedGroupGithub },
                { ui: this._btnMultiPlayer,     callback: this._onTouchedBtnMultiPlayer },
                { ui: this._btnSinglePlayer,    callback: this._onTouchedBtnSinglePlayer },
                { ui: this._btnRanking,         callback: this._onTouchedBtnRanking },
            ]);
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,                callback: this._onNotifyLanguageChanged },
                { type: NotifyType.MsgUserLogout,                  callback: this._onMsgUserLogout },
                { type: NotifyType.MsgMcrGetJoinedRoomInfoList,    callback: this._onMsgMcrGetJoinedRoomInfoList },
                { type: NotifyType.MsgMfrGetJoinedRoomInfoList,    callback: this._onMsgMfrGetJoinedRoomInfoList },
                { type: NotifyType.MsgCcrGetJoinedRoomInfoList,    callback: this._onMsgCcrGetJoinedRoomInfoList },
                { type: NotifyType.MsgMrrGetMyRoomPublicInfoList,  callback: this._onMsgMrrGetMyRoomPublicInfoList },
            ]);

            this._showOpenAnimation();

            this._updateComponentsForLanguage();
            this._updateBtnMultiPlayer();
            this._updateBtnRanking();
        }

        protected async _onClosed(): Promise<void> {
            await this._showCloseAnimation();
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Callbacks.
        ////////////////////////////////////////////////////////////////////////////////
        private _onTouchedGroupDiscord(): void {
            if ((window) && (window.open)) {
                CommonConfirmPanel.show({
                    content : Lang.getFormattedText(LangTextType.F0065, `Discord`),
                    callback: () => {
                        window.open(CommonConstants.DiscordUrl);
                    },
                });
            }
        }

        private _onTouchedGroupGithub(): void {
            if ((window) && (window.open)) {
                CommonConfirmPanel.show({
                    content : Lang.getFormattedText(LangTextType.F0065, `GitHub`),
                    callback: () => {
                        window.open(CommonConstants.GithubUrl);
                    },
                });
            }
        }

        private _onTouchedBtnMultiPlayer(): void {
            this.close();
            McrMainMenuPanel.show();
        }

        private _onTouchedBtnSinglePlayer(): void {
            this.close();
            SpmMainMenuPanel.show();
        }

        private _onTouchedBtnRanking(): void {
            this.close();
            MrrMainMenuPanel.show();
        }

        private _onMsgUserLogout(): void {
            this.close();
        }

        private _onMsgMcrGetJoinedRoomInfoList(): void {
            this._updateBtnMultiPlayer();
        }

        private _onMsgMfrGetJoinedRoomInfoList(): void {
            this._updateBtnMultiPlayer();
        }

        private _onMsgCcrGetJoinedRoomInfoList(): void {
            this._updateBtnMultiPlayer();
        }

        private _onMsgMrrGetMyRoomPublicInfoList(): void {
            this._updateBtnRanking();
        }

        private _onNotifyLanguageChanged(): void {
            this._updateComponentsForLanguage();
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Private functions.
        ////////////////////////////////////////////////////////////////////////////////
        private _showOpenAnimation(): void {
            // const group = this._group;
            // Tween.removeTweens(group);
            // Tween.get(group)
            //     .set({ alpha: 0, right: 20 })
            //     .to({ alpha: 1, right: 60 }, 200);
            const group = this._group;
            group.alpha = 1;
            group.right = 60;

            Helpers.resetTween({
                obj         : this._btnMultiPlayer,
                beginProps  : { alpha: 0, right: -40 },
                endProps    : { alpha: 1, right: 0 },
            });
            Helpers.resetTween({
                obj         : this._btnRanking,
                beginProps  : { alpha: 0, right: -40 },
                waitTime    : 100,
                endProps    : { alpha: 1, right: 0 },
            });
            Helpers.resetTween({
                obj         : this._btnSinglePlayer,
                beginProps  : { alpha: 0, right: -40 },
                waitTime    : 200,
                endProps    : { alpha: 1, right: 0 },
            });

            // const groupTips = this._groupTips;
            // Tween.removeTweens(groupTips);
            // Tween.get(groupTips)
            //     .set({ alpha: 0, left: 20 })
            //     .to({ alpha: 1, left: 60 }, 200);
            const groupTips = this._groupTips;
            groupTips.alpha = 1;
            groupTips.left  = 60;

            Helpers.resetTween({
                obj         : this._groupWelcome,
                beginProps  : { alpha: 0, left: -40 },
                endProps    : { alpha: 1, left: 0 },
            });
            Helpers.resetTween({
                obj         : this._groupQq,
                beginProps  : { alpha: 0, left: -40 },
                waitTime    : 66,
                endProps    : { alpha: 1, left: 0 },
            });
            Helpers.resetTween({
                obj         : this._groupDiscord,
                beginProps  : { alpha: 0, left: -40 },
                waitTime    : 132,
                endProps    : { alpha: 1, left: 0 },
            });
            Helpers.resetTween({
                obj         : this._groupGithub,
                beginProps  : { alpha: 0, left: -40 },
                waitTime    : 200,
                endProps    : { alpha: 1, left: 0 },
            });
        }
        private _showCloseAnimation(): Promise<void> {
            return new Promise<void>((resolve) => {
                const group = this._group;
                Tween.removeTweens(group);
                Tween.get(group)
                    .set({ alpha: 1, right: 60 })
                    .to({ alpha: 0, right: 20 }, 200);

                const groupTips = this._groupTips;
                Tween.removeTweens(groupTips);
                Tween.get(groupTips)
                    .set({ alpha: 1, left: 60 })
                    .to({ alpha: 0, left: 20 }, 200)
                    .call(resolve);
            });
        }

        private async _updateComponentsForLanguage(): Promise<void> {
            this._labelTips0.text   = Lang.getText(LangTextType.A0195);
            this._labelTips1.text   = ` `;
            this._labelTips2.text   = `${Lang.getText(LangTextType.B0537)}:`;
            this._labelTips3.text   = `368142455`;
            this._labelTips4.text   = `${Lang.getText(LangTextType.B0538)}:`;
            this._labelTips5.text   = CommonConstants.DiscordUrl;
            this._labelTips6.text   = `${Lang.getText(LangTextType.B0539)}:`;
            this._labelTips7.text   = CommonConstants.GithubUrl;
        }

        private async _updateBtnMultiPlayer(): Promise<void> {
            this._btnMultiPlayer.setRedVisible(
                (MpwModel.checkIsRedForMyMcwWars())                                                             ||
                (MpwModel.checkIsRedForMyMfwWars())                                                             ||
                (MpwModel.checkIsRedForMyCcwWars())                                                             ||
                (await McrModel.checkIsRed()) ||
                (await MfrModel.checkIsRed()) ||
                (await CcrModel.checkIsRed())
            );
        }

        private async _updateBtnRanking(): Promise<void> {
            this._btnRanking.setRedVisible(
                (MpwModel.checkIsRedForMyMrwWars())                                                             ||
                (await MrrModel.checkIsRed())
            );
        }
    }
}

export default TwnsLobbyPanel;
