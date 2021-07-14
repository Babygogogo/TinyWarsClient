
import TwnsUiPanel                      from "../../tools/ui/UiPanel";
import TwnsUiButton                      from "../../tools/ui/UiButton";
import TwnsUiLabel                      from "../../tools/ui/UiLabel";
import { ChatPanel }                    from "../../chat/view/ChatPanel";
import { UserPanel }                    from "../../user/view/UserPanel";
import BwCoListPanel = TwnsBwCoListPanel.BwCoListPanel;import TwnsBwCoListPanel                from "../../baseWar/view/BwCoListPanel";
import BwUnitListPanel = TwnsBwUnitListPanel.BwUnitListPanel;import TwnsBwUnitListPanel              from "../../baseWar/view/BwUnitListPanel";
import { RwWar }                        from "../model/RwWar";
import { RwWarMenuPanel }               from "./RwWarMenuPanel";
import TwnsLangTextType             from "../../tools/lang/LangTextType";
import TwnsNotifyType               from "../../tools/notify/NotifyType";
import Types                        from "../../tools/helpers/Types";
import ConfigManager                from "../../tools/helpers/ConfigManager";
import FloatText                    from "../../tools/helpers/FloatText";
import Helpers                      from "../../tools/helpers/Helpers";
import Lang                         from "../../tools/lang/Lang";
import { ChatModel }                    from "../../chat/model/ChatModel";
import RwModel                      from "../model/RwModel";

namespace TwnsRwTopPanel {
    import NotifyType       = TwnsNotifyType.NotifyType;
    import LangTextType     = TwnsLangTextType.LangTextType;

    // eslint-disable-next-line no-shadow
    export class RwTopPanel extends TwnsUiPanel.UiPanel<void> {
        protected readonly _LAYER_TYPE   = Types.LayerType.Hud0;
        protected readonly _IS_EXCLUSIVE = false;

        private static _instance: RwTopPanel;

        private _groupPlayer        : eui.Group;
        private _labelPlayer        : TwnsUiLabel.UiLabel;
        private _labelFund          : TwnsUiLabel.UiLabel;
        private _labelTurnTitle     : TwnsUiLabel.UiLabel;
        private _labelTurn          : TwnsUiLabel.UiLabel;
        private _labelActionTitle   : TwnsUiLabel.UiLabel;
        private _labelAction        : TwnsUiLabel.UiLabel;
        private _groupCo            : eui.Group;
        private _labelCo            : TwnsUiLabel.UiLabel;
        private _labelCurrEnergy    : TwnsUiLabel.UiLabel;
        private _labelPowerEnergy   : TwnsUiLabel.UiLabel;
        private _labelZoneEnergy    : TwnsUiLabel.UiLabel;
        private _btnChat            : TwnsUiButton.UiButton;
        private _btnFastRewind      : TwnsUiButton.UiButton;
        private _btnFastForward     : TwnsUiButton.UiButton;
        private _btnPlay            : TwnsUiButton.UiButton;
        private _btnPause           : TwnsUiButton.UiButton;
        private _btnUnitList        : TwnsUiButton.UiButton;
        private _btnMenu            : TwnsUiButton.UiButton;

        private _war    : RwWar;

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

            this._war = RwModel.getWar();
            this._updateView();
        }

        protected async _onClosed(): Promise<void> {
            this._war = null;
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Callbacks.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _onNotifyLanguageChanged(e: egret.Event): void {
            this._updateComponentsForLanguage();
        }
        private _onNotifyBwPlayerFundChanged(e: egret.Event): void {
            this._updateLabelFund();
        }
        private _onNotifyBwPlayerIndexInTurnChanged(e: egret.Event): void {
            this._updateView();
        }
        private _onNotifyBwNextActionIdChanged(e: egret.Event): void {
            this._updateLabelAction();
        }
        private _onNotifyBwCoEnergyChanged(e: egret.Event): void {
            this._updateLabelCo();
        }
        private _onNotifyBwCoUsingSkillChanged(e: egret.Event): void {
            this._updateLabelCo();
        }
        private _onNotifyReplayAutoReplayChanged(e: egret.Event): void {
            this._updateView();
        }
        private _onMsgChatUpdateReadProgressList(e: egret.Event): void {
            this._updateBtnChat();
        }
        private _onMsgChatUpdateReadProgress(e: egret.Event): void {
            this._updateBtnChat();
        }
        private _onMsgChatGetAllMessages(e: egret.Event): void {
            this._updateBtnChat();
        }
        private _onMsgChatAddMessage(e: egret.Event): void {
            this._updateBtnChat();
        }

        private _onTouchedGroupPlayer(e: egret.TouchEvent): void {
            const userId = this._war.getPlayerInTurn().getUserId();
            (userId) && (UserPanel.show({ userId }));
        }
        private _onTouchedGroupCo(e: egret.TouchEvent): void {
            const war = this._war;
            BwCoListPanel.show({
                war,
                selectedIndex: Math.max(war.getPlayerIndexInTurn() - 1, 0),
            });
            RwWarMenuPanel.hide();
        }
        private _onTouchedBtnChat(e: egret.TouchEvent): void {
            RwWarMenuPanel.hide();
            ChatPanel.show({});
        }
        private async _onTouchedBtnFastRewind(e: egret.TouchEvent): Promise<void> {
            const war = this._war;
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
        private async _onTouchedBtnFastForward(e: egret.TouchEvent): Promise<void> {
            const war = this._war;
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
        private _onTouchedBtnPlay(e: egret.TouchEvent): void {
            const war = this._war;
            if (war.checkIsInEnd()) {
                FloatText.show(Lang.getText(LangTextType.A0041));
            } else {
                this._war.setIsAutoReplay(true);
            }
        }
        private _onTouchedBtnPause(e: egret.TouchEvent): void {
            this._war.setIsAutoReplay(false);
        }
        private _onTouchedBtnUnitList(e: egret.TouchEvent): void {
            const war = this._war;
            war.getField().getActionPlanner().setStateIdle();
            BwUnitListPanel.show({ war });
        }
        private _onTouchedBtnMenu(e: egret.TouchEvent): void {
            const actionPlanner = this._war.getActionPlanner();
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
            const war               = this._war;
            this._labelTurn.text    = `${war.getTurnManager().getTurnIndex()}`;
        }

        private _updateLabelAction(): void {
            const war               = this._war;
            this._labelAction.text  = `${war.getNextActionId()}`;
        }

        private async _updateLabelPlayer(): Promise<void> {
            const war               = this._war;
            const player            = war.getPlayerInTurn();
            this._labelPlayer.text  = player
                ? `${await player.getNickname()} (${Lang.getPlayerForceName(player.getPlayerIndex())}, ${Lang.getUnitAndTileSkinName(player.getUnitAndTileSkinId())})`
                : ``;
        }

        private _updateLabelFund(): void {
            const war     = this._war;
            const player  = war.getPlayerInTurn();
            this._labelFund.text = player
                ? `${player.getFund()}`
                : ``;
        }

        private _updateLabelCo(): void {
            const war = this._war;
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
            this._btnPlay.visible = !this._war.getIsAutoReplay();
        }

        private _updateBtnPause(): void {
            this._btnPause.visible = this._war.getIsAutoReplay();
        }

        private _updateBtnChat(): void {
            this._btnChat.setRedVisible(ChatModel.checkHasUnreadMessage());
        }
    }
}

export default TwnsRwTopPanel;
