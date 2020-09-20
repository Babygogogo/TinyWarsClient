
namespace TinyWars.Replay {
    import FloatText        = Utility.FloatText;
    import Lang             = Utility.Lang;
    import Helpers          = Utility.Helpers;
    import Notify           = Utility.Notify;
    import Types            = Utility.Types;

    export class ReplayTopPanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Hud0;
        protected readonly _IS_EXCLUSIVE = false;

        private static _instance: ReplayTopPanel;

        private _groupPlayer        : eui.Group;
        private _labelPlayer        : GameUi.UiLabel;
        private _labelFund          : GameUi.UiLabel;
        private _labelTurnTitle     : GameUi.UiLabel;
        private _labelTurn          : GameUi.UiLabel;
        private _labelActionTitle   : GameUi.UiLabel;
        private _labelAction        : GameUi.UiLabel;
        private _groupCo            : eui.Group;
        private _labelCo            : GameUi.UiLabel;
        private _labelCurrEnergy    : GameUi.UiLabel;
        private _labelPowerEnergy   : GameUi.UiLabel;
        private _labelZoneEnergy    : GameUi.UiLabel;
        private _btnChat            : GameUi.UiButton;
        private _btnFastRewind      : GameUi.UiButton;
        private _btnFastForward     : GameUi.UiButton;
        private _btnPlay            : GameUi.UiButton;
        private _btnPause           : GameUi.UiButton;
        private _btnUnitList        : GameUi.UiButton;
        private _btnMenu            : GameUi.UiButton;

        private _war    : ReplayWar;

        public static show(): void {
            if (!ReplayTopPanel._instance) {
                ReplayTopPanel._instance = new ReplayTopPanel();
            }
            ReplayTopPanel._instance.open();
        }

        public static hide(): void {
            if (ReplayTopPanel._instance) {
                ReplayTopPanel._instance.close();
            }
        }

        private constructor() {
            super();

            this.skinName = "resource/skins/replay/ReplayTopPanel.exml";
        }

        protected _onFirstOpened(): void {
            this._notifyListeners = [
                { type: Notify.Type.LanguageChanged,                callback: this._onNotifyLanguageChanged },
                { type: Notify.Type.BwPlayerFundChanged,            callback: this._onNotifyBwPlayerFundChanged },
                { type: Notify.Type.BwPlayerIndexInTurnChanged,     callback: this._onNotifyBwPlayerIndexInTurnChanged },
                { type: Notify.Type.BwExecutedActionsCountChanged,          callback: this._onNotifyBwNextActionIdChanged },
                { type: Notify.Type.BwCoEnergyChanged,              callback: this._onNotifyBwCoEnergyChanged },
                { type: Notify.Type.BwCoUsingSkillTypeChanged,      callback: this._onNotifyBwCoUsingSkillChanged },
                { type: Notify.Type.ReplayAutoReplayChanged,        callback: this._onNotifyReplayAutoReplayChanged },
                { type: Notify.Type.SChatGetAllReadProgressList,    callback: this._onNotifyChatGetAllReadProgressList },
                { type: Notify.Type.SChatUpdateReadProgress,        callback: this._onNotifyChatUpdateReadProgress },
                { type: Notify.Type.SChatGetAllMessages,            callback: this._onNotifyChatGetAllMessages },
                { type: Notify.Type.SChatAddMessage,                callback: this._onNotifyChatAddMessage },
            ];
            this._uiListeners = [
                { ui: this._groupPlayer,        callback: this._onTouchedGroupPlayer },
                { ui: this._groupCo,            callback: this._onTouchedGroupCo },
                { ui: this._btnChat,            callback: this._onTouchedBtnChat },
                { ui: this._btnFastRewind,      callback: this._onTouchedBtnFastRewind },
                { ui: this._btnFastForward,     callback: this._onTouchedBtnFastForward, },
                { ui: this._btnPlay,            callback: this._onTouchedBtnPlay, },
                { ui: this._btnPause,           callback: this._onTouchedBtnPause, },
                { ui: this._btnUnitList,        callback: this._onTouchedBtnUnitList, },
                { ui: this._btnMenu,            callback: this._onTouchedBtnMenu, },
            ];
        }

        protected _onOpened(): void {
            this._war = ReplayModel.getWar();
            this._updateView();
        }

        protected _onClosed(): void {
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
        private _onNotifyChatGetAllReadProgressList(e: egret.Event): void {
            this._updateBtnChat();
        }
        private _onNotifyChatUpdateReadProgress(e: egret.Event): void {
            this._updateBtnChat();
        }
        private _onNotifyChatGetAllMessages(e: egret.Event): void {
            this._updateBtnChat();
        }
        private _onNotifyChatAddMessage(e: egret.Event): void {
            this._updateBtnChat();
        }

        private _onTouchedGroupPlayer(e: egret.TouchEvent): void {
            const userId = this._war.getPlayerInTurn().getUserId();
            (userId) && (User.UserPanel.show(userId));
        }
        private _onTouchedGroupCo(e: egret.TouchEvent): void {
            ReplayCoListPanel.show(Math.max(this._war.getPlayerIndexInTurn() - 1, 0));
            ReplayWarMenuPanel.hide();
        }
        private _onTouchedBtnChat(e: egret.TouchEvent): void {
            ReplayWarMenuPanel.hide();
            Chat.ChatPanel.show({});
        }
        private async _onTouchedBtnFastRewind(e: egret.TouchEvent): Promise<void> {
            const war = this._war;
            war.setIsAutoReplay(false);

            if (!war.getIsRunning()) {
                FloatText.show(Lang.getText(Lang.Type.A0040));
            } else if (war.getIsExecutingAction()) {
                FloatText.show(Lang.getText(Lang.Type.A0044));
            } else if (war.checkIsInBeginning()) {
                FloatText.show(Lang.getText(Lang.Type.A0042));
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
                FloatText.show(Lang.getText(Lang.Type.A0040));
            } else if (war.getIsExecutingAction()) {
                FloatText.show(Lang.getText(Lang.Type.A0044));
            } else if (war.checkIsInEnd()) {
                FloatText.show(Lang.getText(Lang.Type.A0043));
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
                FloatText.show(Lang.getText(Lang.Type.A0041));
            } else {
                this._war.setIsAutoReplay(true);
            }
        }
        private _onTouchedBtnPause(e: egret.TouchEvent): void {
            this._war.setIsAutoReplay(false);
        }
        private _onTouchedBtnUnitList(e: egret.TouchEvent): void {
            this._war.getField().getActionPlanner().setStateIdle();
            ReplayUnitListPanel.show();
        }
        private _onTouchedBtnMenu(e: egret.TouchEvent): void {
            const actionPlanner = this._war.getActionPlanner();
            if (!actionPlanner.checkIsStateRequesting()) {
                actionPlanner.setStateIdle();
            }
            ReplayWarMenuPanel.show();
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
            this._labelTurnTitle.text   = Lang.getText(Lang.Type.B0091);
            this._labelActionTitle.text = Lang.getText(Lang.Type.B0090);
        }

        private _updateLabelTurn(): void {
            const war               = this._war;
            this._labelTurn.text    = `${war.getTurnManager().getTurnIndex() + 1}`;
        }

        private _updateLabelAction(): void {
            const war               = this._war;
            this._labelAction.text  = `${war.getExecutedActionsCount()}`;
        }

        private _updateLabelPlayer(): void {
            const war               = this._war;
            const player            = war.getPlayerInTurn();
            this._labelPlayer.text  = player
                ? `${player.getNickname()} (${Helpers.getColorTextForPlayerIndex(player.getPlayerIndex())})`
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
                this._labelCo.text  = `${coId == null ? "----" : Utility.ConfigManager.getCoBasicCfg(war.getConfigVersion(), coId).name}`;

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
            this._btnChat.setRedVisible(Chat.ChatModel.checkHasUnreadMessage());
        }
    }
}
