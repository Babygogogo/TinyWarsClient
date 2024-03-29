
// import TwnsBwUnitListPanel      from "../../baseWar/view/BwUnitListPanel";
// import ChatModel                from "../../chat/model/ChatModel";
// import TwnsChatPanel            from "../../chat/view/ChatPanel";
// import TwnsCommonCoListPanel    from "../../common/view/CommonCoListPanel";
// import ConfigManager            from "../../tools/helpers/ConfigManager";
// import FloatText                from "../../tools/helpers/FloatText";
// import Helpers                  from "../../tools/helpers/Helpers";
// import SoundManager             from "../../tools/helpers/SoundManager";
// import Types                    from "../../tools/helpers/Types";
// import Lang                     from "../../tools/lang/Lang";
// import TwnsLangTextType         from "../../tools/lang/LangTextType";
// import Notify           from "../../tools/notify/NotifyType";
// import TwnsUiButton             from "../../tools/ui/UiButton";
// import TwnsUiLabel              from "../../tools/ui/UiLabel";
// import TwnsUiPanel              from "../../tools/ui/UiPanel";
// import TwnsUserPanel            from "../../user/view/UserPanel";
// import TwnsRwWar                from "../model/RwWar";
// import TwnsRwWarMenuPanel       from "./RwWarMenuPanel";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.ReplayWar {
    import NotifyType           = Notify.NotifyType;
    import LangTextType         = Lang.LangTextType;

    export type OpenDataForRwTopPanel = {
        war : ReplayWar.RwWar | HalfwayReplayWar.HrwWar;
    };
    export class RwTopPanel extends TwnsUiPanel.UiPanel<OpenDataForRwTopPanel> {
        private readonly _groupPlayer!          : eui.Group;
        private readonly _labelPlayer!          : TwnsUiLabel.UiLabel;
        private readonly _labelFundTitle!       : TwnsUiLabel.UiLabel;
        private readonly _labelFund!            : TwnsUiLabel.UiLabel;

        private readonly _groupPauseTime!       : eui.Group;
        private readonly _labelPauseTimeTitle!  : TwnsUiLabel.UiLabel;
        private readonly _labelPauseTime!       : TwnsUiLabel.UiLabel;

        private readonly _groupVisionTeam!      : TwnsUiButton.UiButton;
        private readonly _labelVisionTeamTitle! : TwnsUiLabel.UiLabel;
        private readonly _labelVisionTeam!      : TwnsUiLabel.UiLabel;

        private readonly _groupProgress!        : eui.Group;
        private readonly _labelTurnTitle!       : TwnsUiLabel.UiLabel;
        private readonly _labelTurn!            : TwnsUiLabel.UiLabel;
        private readonly _labelActionTitle!     : TwnsUiLabel.UiLabel;
        private readonly _labelAction!          : TwnsUiLabel.UiLabel;

        private readonly _groupCo!              : eui.Group;
        private readonly _labelCo!              : TwnsUiLabel.UiLabel;
        private readonly _labelCurrEnergy!      : TwnsUiLabel.UiLabel;
        private readonly _labelPowerEnergy!     : TwnsUiLabel.UiLabel;
        private readonly _labelZoneEnergy!      : TwnsUiLabel.UiLabel;
        private readonly _btnRewindBegin!       : TwnsUiButton.UiButton;
        private readonly _btnRewindTurn!        : TwnsUiButton.UiButton;
        private readonly _btnRewindAction!      : TwnsUiButton.UiButton;
        private readonly _btnForwardAction!     : TwnsUiButton.UiButton;
        private readonly _btnForwardTurn!       : TwnsUiButton.UiButton;
        private readonly _btnForwardEnd!        : TwnsUiButton.UiButton;
        private readonly _btnPlay!              : TwnsUiButton.UiButton;
        private readonly _btnPause!             : TwnsUiButton.UiButton;
        private readonly _btnMenu!              : TwnsUiButton.UiButton;

        protected _onOpening(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,                callback: this._onNotifyLanguageChanged },
                { type: NotifyType.BwPlayerFundChanged,            callback: this._onNotifyBwPlayerFundChanged },
                { type: NotifyType.BwPlayerIndexInTurnChanged,     callback: this._onNotifyBwPlayerIndexInTurnChanged },
                { type: NotifyType.RwNextActionIdChanged,          callback: this._onNotifyBwNextActionIdChanged },
                { type: NotifyType.BwCoEnergyChanged,              callback: this._onNotifyBwCoEnergyChanged },
                { type: NotifyType.BwCoUsingSkillTypeChanged,      callback: this._onNotifyBwCoUsingSkillChanged },
                { type: NotifyType.ReplayAutoReplayChanged,        callback: this._onNotifyReplayAutoReplayChanged },
            ]);
            this._setUiListenerArray([
                { ui: this._groupPlayer,        callback: this._onTouchedGroupPlayer },
                { ui: this._groupCo,            callback: this._onTouchedGroupCo },
                { ui: this._groupPauseTime,     callback: this._onTouchedGroupPauseTime },
                { ui: this._groupVisionTeam,    callback: this._onTouchedGroupVisionTeam },
                { ui: this._groupProgress,      callback: this._onTouchedGroupProgress },
                { ui: this._btnRewindAction,    callback: this._onTouchedBtnRewindAction },
                { ui: this._btnRewindTurn,      callback: this._onTouchedBtnRewindTurn },
                { ui: this._btnRewindBegin,     callback: this._onTouchedBtnRewindBegin },
                { ui: this._btnForwardAction,   callback: this._onTouchedBtnForwardAction, },
                { ui: this._btnForwardTurn,     callback: this._onTouchedBtnForwardTurn, },
                { ui: this._btnForwardEnd,      callback: this._onTouchedBtnForwardEnd, },
                { ui: this._btnPlay,            callback: this._onTouchedBtnPlay, },
                { ui: this._btnPause,           callback: this._onTouchedBtnPause, },
                { ui: this._btnMenu,            callback: this._onTouchedBtnMenu, },
            ]);
        }
        protected async _updateOnOpenDataChanged(): Promise<void> {
            this._updateView();
        }
        protected _onClosing(): void {
            // nothing to do
        }

        private _getWar(): ReplayWar.RwWar | HalfwayReplayWar.HrwWar {
            return this._getOpenData().war;
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

        private _onTouchedGroupPlayer(): void {
            const userId = this._getWar().getPlayerInTurn().getUserId();
            (userId) && (PanelHelpers.open(PanelHelpers.PanelDict.UserPanel, { userId }));
        }
        private _onTouchedGroupCo(): void {
            const war = this._getWar();
            PanelHelpers.open(PanelHelpers.PanelDict.CommonCoListPanel, { war });
        }
        private _onTouchedGroupPauseTime(): void {
            SoundManager.playShortSfx(Types.ShortSfxCode.ButtonNeutral01);

            const war       = this._getWar();
            const minValue  = 0;
            const maxValue  = 5000;
            PanelHelpers.open(PanelHelpers.PanelDict.CommonInputIntegerPanel, {
                title           : Lang.getText(LangTextType.B0846),
                minValue,
                maxValue,
                currentValue    : war.getPauseTimeMs(),
                tips            : `${Lang.getText(LangTextType.B0319)}: [${minValue}, ${maxValue}](ms)\n${Lang.getText(LangTextType.A0290)}`,
                callback        : value => {
                    war.setPauseTimeMs(value);
                    this._updateLabelPauseTime();
                },
            });
        }
        private _onTouchedGroupProgress(): void {
            SoundManager.playShortSfx(Types.ShortSfxCode.ButtonNeutral01);

            const war = this._getWar();
            if (war.getIsAutoReplay()) {
                war.setIsAutoReplay(false);
                this._updateView();
            }

            if (!war.getIsRunning()) {
                FloatText.show(Lang.getText(LangTextType.A0040));
            } else if (war.getIsExecutingAction()) {
                FloatText.show(Lang.getText(LangTextType.A0044));
            } else {
                PanelHelpers.open(PanelHelpers.PanelDict.RwReplayProgressPanel, { war });
            }
        }
        private _onTouchedGroupVisionTeam(): void {
            SoundManager.playShortSfx(Types.ShortSfxCode.ButtonNeutral01);

            const war = this._getWar();
            war.tickVisionTeamIndex();
            war.updateTilesAndUnitsOnVisibilityChanged(false);

            this._updateLabelVisionTeam();
        }
        private async _onTouchedBtnRewindAction(): Promise<void> {
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
                await war.loadPreviousAction();
                await Helpers.checkAndCallLater();
                this._updateView();
            }
        }
        private async _onTouchedBtnRewindTurn(): Promise<void> {
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
                await war.loadPreviousCheckpoint();
                await Helpers.checkAndCallLater();
                this._updateView();
            }
        }
        private async _onTouchedBtnRewindBegin(): Promise<void> {
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
                await war.loadCheckpoint(0);
                await Helpers.checkAndCallLater();
                this._updateView();
            }
        }
        private async _onTouchedBtnForwardAction(): Promise<void> {
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
                await war.loadNextAction();
                await Helpers.checkAndCallLater();
                this._updateView();
            }
        }
        private async _onTouchedBtnForwardTurn(): Promise<void> {
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
                await war.loadNextCheckpoint();
                await Helpers.checkAndCallLater();
                this._updateView();
            }
        }
        private async _onTouchedBtnForwardEnd(): Promise<void> {
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

                PanelHelpers.open(PanelHelpers.PanelDict.CommonBlockPanel, {
                    title   : Lang.getText(LangTextType.B0088),
                    content : Lang.getText(LangTextType.A0040),
                });
                await war.loadCheckpoint(war.getAllCheckpointInfoArray().length - 1);
                PanelHelpers.close(PanelHelpers.PanelDict.CommonBlockPanel);

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
        private _onTouchedBtnMenu(): void {
            const war           = this._getWar();
            const actionPlanner = war.getActionPlanner();
            if (!actionPlanner.checkIsStateRequesting()) {
                actionPlanner.setStateIdle();
            }

            PanelHelpers.open(PanelHelpers.PanelDict.RwWarMenuPanel, { war });
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Functions for views.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _updateView(): void {
            this._updateComponentsForLanguage();
            this._updateLabelPauseTime();
            this._updateLabelVisionTeam();
            this._updateLabelTurn();
            this._updateLabelAction();
            this._updateLabelPlayer();
            this._updateLabelFund();
            this._updateLabelCo();
            this._updateBtnPlay();
            this._updateBtnPause();
        }

        private _updateComponentsForLanguage(): void {
            this._labelTurnTitle.text       = Lang.getText(LangTextType.B0091);
            this._labelActionTitle.text     = Lang.getText(LangTextType.B0090);
            this._labelPauseTimeTitle.text  = Lang.getText(LangTextType.B0846);
            this._labelVisionTeamTitle.text = Lang.getText(LangTextType.B0891);
            this._labelFundTitle.text       = `${Lang.getText(LangTextType.B0032)}: `;
            this._btnRewindAction.label     = Lang.getText(LangTextType.B0616);
            this._btnRewindTurn.label       = Lang.getText(LangTextType.B0687);
            this._btnForwardTurn.label      = Lang.getText(LangTextType.B0687);
            this._btnForwardAction.label    = Lang.getText(LangTextType.B0616);
        }

        private _updateLabelPauseTime(): void {
            this._labelPauseTime.text = `${this._getWar().getPauseTimeMs()}`;
        }

        private _updateLabelVisionTeam(): void {
            const teamIndex             = this._getWar().getVisionTeamIndex();
            this._labelVisionTeam.text  = teamIndex == null
                ? Lang.getText(LangTextType.B0890)
                : (Lang.getPlayerTeamName(teamIndex) ?? CommonConstants.ErrorTextForUndefined);
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
                this._labelCo.text  = `${coId == null ? "----" : war.getGameConfig().getCoBasicCfg(coId)?.name}`;

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
    }
}

// export default TwnsRwTopPanel;
