
import TwnsBwUnitListPanel      from "../../baseWar/view/BwUnitListPanel";
import ChatModel                from "../../chat/model/ChatModel";
import TwnsChatPanel            from "../../chat/view/ChatPanel";
import TwnsCommonCoListPanel    from "../../common/view/CommonCoListPanel";
import ConfigManager            from "../../tools/helpers/ConfigManager";
import FloatText                from "../../tools/helpers/FloatText";
import Helpers                  from "../../tools/helpers/Helpers";
import SoundManager             from "../../tools/helpers/SoundManager";
import Types                    from "../../tools/helpers/Types";
import Lang                     from "../../tools/lang/Lang";
import TwnsLangTextType         from "../../tools/lang/LangTextType";
import TwnsNotifyType           from "../../tools/notify/NotifyType";
import TwnsUiButton             from "../../tools/ui/UiButton";
import TwnsUiLabel              from "../../tools/ui/UiLabel";
import TwnsUiPanel              from "../../tools/ui/UiPanel";
import TwnsUserPanel            from "../../user/view/UserPanel";
import RwModel                  from "../model/RwModel";
import TwnsRwWar                from "../model/RwWar";
import TwnsRwWarMenuPanel       from "./RwWarMenuPanel";

namespace TwnsRwTopPanel {
    import NotifyType           = TwnsNotifyType.NotifyType;
    import LangTextType         = TwnsLangTextType.LangTextType;
    import ChatPanel            = TwnsChatPanel.ChatPanel;
    import UserPanel            = TwnsUserPanel.UserPanel;
    import CommonCoListPanel    = TwnsCommonCoListPanel.CommonCoListPanel;
    import BwUnitListPanel      = TwnsBwUnitListPanel.BwUnitListPanel;
    import RwWarMenuPanel       = TwnsRwWarMenuPanel.RwWarMenuPanel;

    // eslint-disable-next-line no-shadow
    export class RwTopPanel extends TwnsUiPanel.UiPanel<void> {
        protected readonly _LAYER_TYPE   = Types.LayerType.Hud0;
        protected readonly _IS_EXCLUSIVE = false;

        private static _instance: RwTopPanel;

        private readonly _groupPlayer!      : eui.Group;
        private readonly _labelPlayer!      : TwnsUiLabel.UiLabel;
        private readonly _labelFund!        : TwnsUiLabel.UiLabel;
        private readonly _labelTurnTitle!   : TwnsUiLabel.UiLabel;
        private readonly _labelTurn!        : TwnsUiLabel.UiLabel;
        private readonly _labelActionTitle! : TwnsUiLabel.UiLabel;
        private readonly _labelAction!      : TwnsUiLabel.UiLabel;
        private readonly _groupCo!          : eui.Group;
        private readonly _labelCo!          : TwnsUiLabel.UiLabel;
        private readonly _labelCurrEnergy!  : TwnsUiLabel.UiLabel;
        private readonly _labelPowerEnergy! : TwnsUiLabel.UiLabel;
        private readonly _labelZoneEnergy!  : TwnsUiLabel.UiLabel;
        private readonly _btnChat!          : TwnsUiButton.UiButton;
        private readonly _btnFastRewind!    : TwnsUiButton.UiButton;
        private readonly _btnFastForward!   : TwnsUiButton.UiButton;
        private readonly _btnPlay!          : TwnsUiButton.UiButton;
        private readonly _btnPause!         : TwnsUiButton.UiButton;
        private readonly _btnUnitList!      : TwnsUiButton.UiButton;
        private readonly _btnMenu!          : TwnsUiButton.UiButton;

        public static show(): void {
            if (!RwTopPanel._instance) {
                RwTopPanel._instance = new RwTopPanel();
            }
            RwTopPanel._instance.open(undefined);
        }

        public static async hide(): Promise<void> {
            if (RwTopPanel._instance) {
                await RwTopPanel._instance.close();
            }
        }

        private constructor() {
            super();

            this.skinName = "resource/skins/replayWar/RwTopPanel.exml";
        }

        protected _onOpened(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,                callback: this._onNotifyLanguageChanged },
                { type: NotifyType.BwPlayerFundChanged,            callback: this._onNotifyBwPlayerFundChanged },
                { type: NotifyType.BwPlayerIndexInTurnChanged,     callback: this._onNotifyBwPlayerIndexInTurnChanged },
                { type: NotifyType.RwNextActionIdChanged,          callback: this._onNotifyBwNextActionIdChanged },
                { type: NotifyType.BwCoEnergyChanged,              callback: this._onNotifyBwCoEnergyChanged },
                { type: NotifyType.BwCoUsingSkillTypeChanged,      callback: this._onNotifyBwCoUsingSkillChanged },
                { type: NotifyType.ReplayAutoReplayChanged,        callback: this._onNotifyReplayAutoReplayChanged },
                { type: NotifyType.MsgChatGetAllReadProgressList,  callback: this._onMsgChatUpdateReadProgressList },
                { type: NotifyType.MsgChatUpdateReadProgress,      callback: this._onMsgChatUpdateReadProgress },
                { type: NotifyType.MsgChatGetAllMessages,          callback: this._onMsgChatGetAllMessages },
                { type: NotifyType.MsgChatAddMessage,              callback: this._onMsgChatAddMessage },
            ]);
            this._setUiListenerArray([
                { ui: this._groupPlayer,        callback: this._onTouchedGroupPlayer },
                { ui: this._groupCo,            callback: this._onTouchedGroupCo },
                { ui: this._btnChat,            callback: this._onTouchedBtnChat },
                { ui: this._btnFastRewind,      callback: this._onTouchedBtnFastRewind },
                { ui: this._btnFastForward,     callback: this._onTouchedBtnFastForward, },
                { ui: this._btnPlay,            callback: this._onTouchedBtnPlay, },
                { ui: this._btnPause,           callback: this._onTouchedBtnPause, },
                { ui: this._btnUnitList,        callback: this._onTouchedBtnUnitList, },
                { ui: this._btnMenu,            callback: this._onTouchedBtnMenu, },
            ]);

            this._updateView();
        }

        private _getWar(): TwnsRwWar.RwWar {
            return Helpers.getExisted(RwModel.getWar());
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Callbacks.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _onNotifyLanguageChanged(): void {
            this._updateComponentsForLanguage();
        }
        private _onNotifyBwPlayerFundChanged(): void {
            this._updateLabelFund();
        }
        private _onNotifyBwPlayerIndexInTurnChanged(): void {
            this._updateView();
            SoundManager.playCoBgmWithWar(this._getWar(), false);
        }
        private _onNotifyBwNextActionIdChanged(): void {
            this._updateLabelAction();
        }
        private _onNotifyBwCoEnergyChanged(): void {
            this._updateLabelCo();
        }
        private _onNotifyBwCoUsingSkillChanged(): void {
            this._updateLabelCo();
            SoundManager.playCoBgmWithWar(this._getWar(), false);
        }
        private _onNotifyReplayAutoReplayChanged(): void {
            this._updateView();
        }
        private _onMsgChatUpdateReadProgressList(): void {
            this._updateBtnChat();
        }
        private _onMsgChatUpdateReadProgress(): void {
            this._updateBtnChat();
        }
        private _onMsgChatGetAllMessages(): void {
            this._updateBtnChat();
        }
        private _onMsgChatAddMessage(): void {
            this._updateBtnChat();
        }

        private _onTouchedGroupPlayer(): void {
            const userId = this._getWar().getPlayerInTurn().getUserId();
            (userId) && (UserPanel.show({ userId }));
        }
        private _onTouchedGroupCo(): void {
            const war = this._getWar();
            CommonCoListPanel.show({ war });
            RwWarMenuPanel.hide();
        }
        private _onTouchedBtnChat(): void {
            RwWarMenuPanel.hide();
            ChatPanel.show({});
        }
        private async _onTouchedBtnFastRewind(): Promise<void> {
            const war = this._getWar();
            war.setIsAutoReplay(false);

            if (!war.getIsRunning()) {
                FloatText.show(Lang.getText(LangTextType.A0040));
            } else if (war.getIsExecutingAction()) {
                FloatText.show(Lang.getText(LangTextType.A0044));
            } else if (war.checkIsInBeginning()) {
                FloatText.show(Lang.getText(LangTextType.A0042));
            } else {
                await Helpers.checkAndCallLater();
                await war.loadPreviousCheckPoint();
                await Helpers.checkAndCallLater();
                this._updateView();
            }
        }
        private async _onTouchedBtnFastForward(): Promise<void> {
            const war = this._getWar();
            war.setIsAutoReplay(false);

            if (!war.getIsRunning()) {
                FloatText.show(Lang.getText(LangTextType.A0040));
            } else if (war.getIsExecutingAction()) {
                FloatText.show(Lang.getText(LangTextType.A0044));
            } else if (war.checkIsInEnd()) {
                FloatText.show(Lang.getText(LangTextType.A0043));
            } else {
                await Helpers.checkAndCallLater();
                await war.loadNextCheckPoint();
                await Helpers.checkAndCallLater();
                this._updateView();
            }
        }
        private _onTouchedBtnPlay(): void {
            const war = this._getWar();
            if (war.checkIsInEnd()) {
                FloatText.show(Lang.getText(LangTextType.A0041));
            } else {
                war.setIsAutoReplay(true);
            }
        }
        private _onTouchedBtnPause(): void {
            this._getWar().setIsAutoReplay(false);
        }
        private _onTouchedBtnUnitList(): void {
            const war = this._getWar();
            war.getField().getActionPlanner().setStateIdle();
            BwUnitListPanel.show({ war });
        }
        private _onTouchedBtnMenu(): void {
            const actionPlanner = this._getWar().getActionPlanner();
            if (!actionPlanner.checkIsStateRequesting()) {
                actionPlanner.setStateIdle();
            }
            RwWarMenuPanel.show();
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Functions for views.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _updateView(): void {
            this._updateComponentsForLanguage();
            this._updateLabelTurn();
            this._updateLabelAction();
            this._updateLabelPlayer();
            this._updateLabelFund();
            this._updateLabelCo();
            this._updateBtnPlay();
            this._updateBtnPause();
            this._updateBtnChat();
        }

        private _updateComponentsForLanguage(): void {
            this._labelTurnTitle.text   = Lang.getText(LangTextType.B0091);
            this._labelActionTitle.text = Lang.getText(LangTextType.B0090);
        }

        private _updateLabelTurn(): void {
            const war               = this._getWar();
            this._labelTurn.text    = `${war.getTurnManager().getTurnIndex()}`;
        }

        private _updateLabelAction(): void {
            const war               = this._getWar();
            this._labelAction.text  = `${war.getNextActionId()}`;
        }

        private async _updateLabelPlayer(): Promise<void> {
            const war               = this._getWar();
            const player            = war.getPlayerInTurn();
            this._labelPlayer.text  = player
                ? `${await player.getNickname()} (${Lang.getPlayerForceName(player.getPlayerIndex())}, ${Lang.getUnitAndTileSkinName(player.getUnitAndTileSkinId())})`
                : ``;
        }

        private _updateLabelFund(): void {
            const war     = this._getWar();
            const player  = war.getPlayerInTurn();
            this._labelFund.text = player
                ? `${player.getFund()}`
                : ``;
        }

        private _updateLabelCo(): void {
            const war = this._getWar();
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
                    const energy                = player.getCoCurrentEnergy();
                    this._labelCurrEnergy.text  = `${energy != null ? energy : `--`}`;
                }

                const powerEnergy           = player.getCoPowerEnergy();
                const superPowerEnergy      = player.getCoSuperPowerEnergy();
                this._labelPowerEnergy.text = `P ${powerEnergy == null ? `--` : powerEnergy} / ${superPowerEnergy == null ? `--` : superPowerEnergy}`;

                const zoneEnergyText        = (player.getCoZoneExpansionEnergyList() || []).join(` / `);
                this._labelZoneEnergy.text  = `Z ${zoneEnergyText.length ? zoneEnergyText : `--`}`;
            }
        }

        private _updateBtnPlay(): void {
            this._btnPlay.visible = !this._getWar().getIsAutoReplay();
        }

        private _updateBtnPause(): void {
            this._btnPause.visible = this._getWar().getIsAutoReplay();
        }

        private _updateBtnChat(): void {
            this._btnChat.setRedVisible(ChatModel.checkHasUnreadMessage());
        }
    }
}

export default TwnsRwTopPanel;
