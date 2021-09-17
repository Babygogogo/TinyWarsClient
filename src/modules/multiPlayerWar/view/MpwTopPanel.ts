
import ChatModel                from "../../chat/model/ChatModel";
import TwnsChatPanel            from "../../chat/view/ChatPanel";
import TwnsCommonCoListPanel    from "../../common/view/CommonCoListPanel";
import MpwProxy                 from "../../multiPlayerWar/model/MpwProxy";
import TwnsMpwWar               from "../../multiPlayerWar/model/MpwWar";
import CompatibilityHelpers     from "../../tools/helpers/CompatibilityHelpers";
import ConfigManager            from "../../tools/helpers/ConfigManager";
import Helpers                  from "../../tools/helpers/Helpers";
import SoundManager             from "../../tools/helpers/SoundManager";
import Timer                    from "../../tools/helpers/Timer";
import Types                    from "../../tools/helpers/Types";
import Lang                     from "../../tools/lang/Lang";
import TwnsLangTextType         from "../../tools/lang/LangTextType";
import TwnsNotifyType           from "../../tools/notify/NotifyType";
import ProtoTypes               from "../../tools/proto/ProtoTypes";
import TwnsUiButton             from "../../tools/ui/UiButton";
import TwnsUiLabel              from "../../tools/ui/UiLabel";
import TwnsUiPanel              from "../../tools/ui/UiPanel";
import UserModel                from "../../user/model/UserModel";
import UserProxy                from "../../user/model/UserProxy";
import TwnsUserPanel            from "../../user/view/UserPanel";
import TwnsUserSettingsPanel    from "../../user/view/UserSettingsPanel";
import TwnsMpwWarMenuPanel      from "./MpwWarMenuPanel";

namespace TwnsMpwTopPanel {
    import UserPanel            = TwnsUserPanel.UserPanel;
    import CommonCoListPanel    = TwnsCommonCoListPanel.CommonCoListPanel;
    import LangTextType         = TwnsLangTextType.LangTextType;
    import NotifyType           = TwnsNotifyType.NotifyType;

    type OpenData = {
        war     : TwnsMpwWar.MpwWar;
    };
    export class MpwTopPanel extends TwnsUiPanel.UiPanel<OpenData> {
        protected readonly _LAYER_TYPE   = Types.LayerType.Hud0;
        protected readonly _IS_EXCLUSIVE = false;

        private static _instance: MpwTopPanel;

        private readonly _groupPlayer!      : eui.Group;
        private readonly _labelPlayerState! : TwnsUiLabel.UiLabel;
        private readonly _labelPlayer!      : TwnsUiLabel.UiLabel;
        private readonly _labelFund!        : TwnsUiLabel.UiLabel;
        private readonly _groupTimer!       : eui.Group;
        private readonly _labelTimer!       : TwnsUiLabel.UiLabel;
        private readonly _groupCo!          : eui.Group;
        private readonly _labelCo!          : TwnsUiLabel.UiLabel;
        private readonly _labelCurrEnergy!  : TwnsUiLabel.UiLabel;
        private readonly _labelPowerEnergy! : TwnsUiLabel.UiLabel;
        private readonly _labelZoneEnergy!  : TwnsUiLabel.UiLabel;
        private readonly _btnChat!          : TwnsUiButton.UiButton;
        private readonly _btnSettings!      : TwnsUiButton.UiButton;

        public static show(openData: OpenData): void {
            if (!MpwTopPanel._instance) {
                MpwTopPanel._instance = new MpwTopPanel();
            }
            MpwTopPanel._instance.open(openData);
        }

        public static async hide(): Promise<void> {
            if (MpwTopPanel._instance) {
                await MpwTopPanel._instance.close().catch(err => { CompatibilityHelpers.showError(err); throw err; });
            }
        }

        private constructor() {
            super();

            this.skinName = "resource/skins/multiPlayerWar/MpwTopPanel.exml";
        }

        protected _onOpened(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,                 callback: this._onNotifyLanguageChanged },
                { type: NotifyType.TimeTick,                        callback: this._onNotifyTimeTick },
                { type: NotifyType.BwPlayerFundChanged,             callback: this._onNotifyBwPlayerFundChanged },
                { type: NotifyType.BwPlayerIndexInTurnChanged,      callback: this._onNotifyBwPlayerIndexInTurnChanged },
                { type: NotifyType.BwCoEnergyChanged,               callback: this._onNotifyBwCoEnergyChanged },
                { type: NotifyType.BwCoUsingSkillTypeChanged,       callback: this._onNotifyBwCoUsingSkillChanged },
                { type: NotifyType.MsgChatGetAllReadProgressList,   callback: this._onNotifyMsgChatGetAllReadProgressList },
                { type: NotifyType.MsgChatUpdateReadProgress,       callback: this._onNotifyMsgChatUpdateReadProgress },
                { type: NotifyType.MsgChatGetAllMessages,           callback: this._onNotifyMsgChatGetAllMessages },
                { type: NotifyType.MsgChatAddMessage,               callback: this._onNotifyMsgChatAddMessage },
                { type: NotifyType.MsgUserGetOnlineState,           callback: this._onNotifyMsgUserGetOnlineState },
            ]);
            this._setUiListenerArray([
                { ui: this._groupPlayer,        callback: this._onTouchedGroupPlayer },
                { ui: this._groupCo,            callback: this._onTouchedGroupCo },
                { ui: this._btnChat,            callback: this._onTouchedBtnChat },
                { ui: this._btnSettings,        callback: this._onTouchedBtnSettings, },
            ]);

            this._updateView();
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Callbacks.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _onNotifyLanguageChanged(): void {
            this._updateComponentsForLanguage();
        }
        private _onNotifyTimeTick(): void {
            this._updateGroupTimer();

            const war = this._getOpenData().war;
            if ((!war.getIsExecutingAction()) && (war.checkIsBoot())) {
                MpwProxy.reqMpwCommonHandleBoot(Helpers.getExisted(war.getWarId()));
            }

            const userId = war.getPlayerInTurn().getUserId();
            if ((userId != null)                        &&
                (userId !== UserModel.getSelfUserId())  &&
                (Timer.getServerTimestamp() % 60 == 0)
            ) {
                UserProxy.reqUserGetOnlineState(userId);
            }
        }
        private _onNotifyBwPlayerFundChanged(): void {
            this._updateLabelFund();
        }
        private _onNotifyBwPlayerIndexInTurnChanged(): void {
            const war = this._getOpenData().war;
            this._updateView();
            SoundManager.playCoBgmWithWar(war, false);

            const userId = war.getPlayerInTurn().getUserId();
            if ((userId != null) && (userId !== UserModel.getSelfUserId())) {
                UserProxy.reqUserGetOnlineState(userId);
            }
        }
        private _onNotifyBwCoEnergyChanged(): void {
            this._updateLabelCoAndEnergy();
        }
        private _onNotifyBwCoUsingSkillChanged(): void {
            this._updateLabelCoAndEnergy();
            SoundManager.playCoBgmWithWar(this._getOpenData().war, false);
        }

        private _onNotifyMsgChatGetAllReadProgressList(): void {
            this._updateBtnChat();
        }
        private _onNotifyMsgChatUpdateReadProgress(): void {
            this._updateBtnChat();
        }
        private _onNotifyMsgChatGetAllMessages(): void {
            this._updateBtnChat();
        }
        private _onNotifyMsgChatAddMessage(): void {
            this._updateBtnChat();
        }
        private _onNotifyMsgUserGetOnlineState(e: egret.Event): void {
            const data = e.data as ProtoTypes.NetMessage.MsgUserGetOnlineState.IS;
            if (data.userId === this._getOpenData().war.getPlayerInTurn().getUserId()) {
                this._updateLabelPlayerState();
            }
        }

        private _onTouchedGroupPlayer(): void {
            const userId = this._getOpenData().war.getPlayerInTurn().getUserId();
            if (userId != null) {
                UserPanel.show({ userId });

                if (userId !== UserModel.getSelfUserId()) {
                    UserProxy.reqUserGetOnlineState(userId);
                }
            }
        }
        private _onTouchedGroupCo(): void {
            CommonCoListPanel.show({
                war             : this._getOpenData().war,
            });
            TwnsMpwWarMenuPanel.MpwWarMenuPanel.hide();
        }
        private _onTouchedBtnChat(): void {
            TwnsMpwWarMenuPanel.MpwWarMenuPanel.hide();
            TwnsChatPanel.ChatPanel.show({});
        }
        private _onTouchedBtnSettings(): void {
            TwnsUserSettingsPanel.UserSettingsPanel.show();
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Functions for views.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _updateView(): void {
            this._updateComponentsForLanguage();
            this._updateLabelPlayerState();
            this._updateLabelPlayer();
            this._updateGroupTimer();
            this._updateLabelFund();
            this._updateLabelCoAndEnergy();
            this._updateBtnChat();
        }

        private _updateComponentsForLanguage(): void {
            // nothing to do
        }

        private async _updateLabelPlayerState(): Promise<void> {
            const userId    = this._getOpenData().war.getPlayerInTurn().getUserId();
            const label     = this._labelPlayerState;
            if ((userId == null) || (userId === UserModel.getSelfUserId())) {
                label.text      = Lang.getText(LangTextType.B0676);
                label.textColor = Types.ColorValue.Green;
            } else {
                const userPublicInfo = await UserModel.getUserPublicInfo(userId).catch(err => { CompatibilityHelpers.showError(err); throw err; });
                if ((userPublicInfo == null) || (!userPublicInfo.isOnline)) {
                    label.text      = Lang.getText(LangTextType.B0677);
                    label.textColor = Types.ColorValue.Red;
                } else {
                    label.text      = Lang.getText(LangTextType.B0676);
                    label.textColor = (Timer.getServerTimestamp() - Helpers.getExisted(userPublicInfo.lastActivityTime) > 60) ? Types.ColorValue.Yellow : Types.ColorValue.Green;
                }
            }
        }

        private async _updateLabelPlayer(): Promise<void> {
            const war                   = this._getOpenData().war;
            const player                = war.getPlayerInTurn();
            this._labelPlayer.text      = `${await player.getNickname().catch(err => { CompatibilityHelpers.showError(err); throw err; })} (${Lang.getPlayerForceName(player.getPlayerIndex())}, ${Lang.getUnitAndTileSkinName(player.getUnitAndTileSkinId())})`;
            this._labelPlayer.textColor = player === war.getPlayerLoggedIn() ? 0x00FF00 : 0xFFFFFF;
        }

        private _updateGroupTimer(): void {
            const war       = this._getOpenData().war;
            const group     = this._groupTimer;
            const restTime  = war ? war.getBootRestTime() : null;
            if (restTime == null) {
                group.visible = false;
            } else {
                group.visible = true;

                const label     = this._labelTimer;
                label.text      = Helpers.getTimeDurationText2(restTime);
                label.textColor = restTime >= 30 * 60
                    ? 0xFFFFFF
                    : (restTime >= 5 * 60 ? 0xFFFF00 : 0xFF4400);
            }
        }

        private _updateLabelFund(): void {
            const war               = this._getOpenData().war;
            const playerInTurn      = war.getPlayerInTurn();
            if ((war.getFogMap().checkHasFogCurrently())                                                                        &&
                (!war.getPlayerManager().getAliveWatcherTeamIndexesForSelf().has(playerInTurn.getTeamIndex()))
            ) {
                this._labelFund.text = `????`;
            } else {
                this._labelFund.text = `${playerInTurn.getFund()}`;
            }
        }

        private _updateLabelCoAndEnergy(): void {
            const war = this._getOpenData().war;
            if ((war) && (war.getIsRunning())) {
                const player        = war.getPlayerInTurn();
                const coId          = player.getCoId();
                this._labelCo.text  = `${coId == null ? "----" : ConfigManager.getCoBasicCfg(war.getConfigVersion(), coId).name}`;

                const skillType = player.getCoUsingSkillType();
                if (skillType === Types.CoSkillType.Power) {
                    this._labelCurrEnergy.text = "COP";
                } else if (skillType === Types.CoSkillType.SuperPower) {
                    this._labelCurrEnergy.text = "SCOP";
                } else {
                    const currentEnergy = player.getCoCurrentEnergy();
                    this._labelCurrEnergy.text = `${currentEnergy != null ? currentEnergy : `--`}`;
                }

                const powerEnergy           = player.getCoPowerEnergy();
                const superPowerEnergy      = player.getCoSuperPowerEnergy();
                this._labelPowerEnergy.text = `P ${powerEnergy == null ? `--` : powerEnergy} / ${superPowerEnergy == null ? `--` : superPowerEnergy}`;

                const zoneEnergyText        = (player.getCoZoneExpansionEnergyList() || []).join(` / `);
                this._labelZoneEnergy.text  = `Z ${zoneEnergyText.length ? zoneEnergyText : `--`}`;
            }
        }

        private _updateBtnChat(): void {
            this._btnChat.setRedVisible(ChatModel.checkHasUnreadMessage());
        }
    }
}

export default TwnsMpwTopPanel;
